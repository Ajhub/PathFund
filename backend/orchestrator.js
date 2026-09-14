/**
 * FundPath v2 — FundPathOrchestrator
 *
 * Six tools, no execution tools:
 *   1. score_eligibility        — rule-based eligibility check
 *   2. get_application_steps    — returns ordered checklist for a scholarship
 *   3. compute_allocation       — pure math on user-supplied percentages
 *   4. filter_investments       — rule-based filter by riskCategory + durationFit
 *   5. recommend_investment     — ONE LLM call (Groq) or template fallback
 *   6. log_decision             — append to in-memory audit log
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HARD CONSTRAINT — READ BEFORE MODIFYING THIS FILE
 * ─────────────────────────────────────────────────────────────────────────────
 * There is intentionally NO submitApplication(), reassignAllocation(), or
 * executeInvestment() tool in this orchestrator.
 * Every state-mutating route in server.js that creates an application, changes
 * an allocation, or places an investment requires a { confirmed: true } flag
 * that can ONLY be set by an explicit user UI action (a button click).
 * The orchestrator never sets confirmed:true on its own.
 * Do NOT add execution tools to this orchestrator.
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use strict";

const fs   = require("fs");
const path = require("path");
const https = require("https");

// ── Data ─────────────────────────────────────────────────────────────────────

const scholarships = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "scholarships.json"), "utf8")
);

const investments = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "investments.json"), "utf8")
);

const countryFieldConfigs = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "countryFieldConfigs.json"), "utf8")
);

// ── In-memory decision log ────────────────────────────────────────────────────
const decisionLog = [];

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL 1 — score_eligibility
// Rule engine: deterministic, same input → same output.
// Each rule produces an explicit reason string.
// valueScore = awardAmount / effortWeight (low=1, medium=2, high=3)
// ═══════════════════════════════════════════════════════════════════════════════

const EFFORT_WEIGHT = { low: 1, medium: 2, high: 3 };

function score_eligibility(profile, scholarship) {
  const reasons = [];
  let eligible = true;
  const e = scholarship.eligibility;

  // Rule 1 — GPA
  if (profile.gpa < e.minGpa) {
    eligible = false;
    reasons.push(`FAIL: GPA ${profile.gpa} is below the minimum required ${e.minGpa}.`);
  } else {
    reasons.push(`PASS: GPA ${profile.gpa} meets minimum ${e.minGpa}.`);
  }

  // Rule 2 — Field of study
  const fieldOpen  = e.fields.includes("Any");
  const fieldMatch = fieldOpen || e.fields.some(
    f => f.toLowerCase() === (profile.fieldOfStudy || "").toLowerCase()
  );
  if (!fieldMatch) {
    eligible = false;
    reasons.push(`FAIL: Field "${profile.fieldOfStudy}" not in [${e.fields.join(", ")}].`);
  } else {
    reasons.push(fieldOpen
      ? `PASS: Open to all fields of study.`
      : `PASS: Field "${profile.fieldOfStudy}" matches eligible fields.`);
  }

  // Rule 3 — Income ceiling
  if (e.incomeCeiling !== null && profile.householdIncome > e.incomeCeiling) {
    eligible = false;
    reasons.push(`FAIL: Income ₹${profile.householdIncome.toLocaleString("en-IN")} exceeds ceiling ₹${e.incomeCeiling.toLocaleString("en-IN")}.`);
  } else if (e.incomeCeiling !== null) {
    reasons.push(`PASS: Income ₹${profile.householdIncome.toLocaleString("en-IN")} within ceiling ₹${e.incomeCeiling.toLocaleString("en-IN")}.`);
  } else {
    reasons.push(`PASS: No income ceiling for this scholarship.`);
  }

  // Rule 4 — First-generation
  if (e.firstGen && !profile.firstGen) {
    eligible = false;
    reasons.push(`FAIL: Scholarship requires first-generation student status.`);
  } else if (e.firstGen && profile.firstGen) {
    reasons.push(`PASS: First-generation student status confirmed.`);
  } else {
    reasons.push(`PASS: No first-generation requirement.`);
  }

  // Rule 5 — Gender restriction
  if (e.genderRestricted !== null &&
      (profile.gender || "").toLowerCase() !== e.genderRestricted.toLowerCase()) {
    eligible = false;
    reasons.push(`FAIL: Restricted to ${e.genderRestricted} applicants (profile gender: "${profile.gender}").`);
  } else if (e.genderRestricted !== null) {
    reasons.push(`PASS: Gender requirement (${e.genderRestricted}) satisfied.`);
  } else {
    reasons.push(`PASS: No gender restriction.`);
  }

  // Rule 6 — Location (substring matching both ways; no country-specific special cases)
  const locReq  = (e.location || "").toLowerCase();
  const locProf = (profile.location || "").toLowerCase();
  const locOk   = !locReq || locProf.includes(locReq) || locReq.includes(locProf);
  if (!locOk) {
    eligible = false;
    reasons.push(`FAIL: Location "${profile.location}" does not match required "${e.location}".`);
  } else {
    reasons.push(`PASS: Location "${profile.location}" satisfies requirement "${e.location}".`);
  }

  const effortWeight = EFFORT_WEIGHT[scholarship.effort] || 2;
  const valueScore   = eligible ? Math.round(scholarship.amount / effortWeight) : 0;

  return { eligible, reasons, valueScore };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL 2 — get_application_steps
// Pure data lookup — returns the ordered checklist for a scholarship.
// ═══════════════════════════════════════════════════════════════════════════════

function get_application_steps(scholarshipId) {
  const sch = scholarships.find(s => s.id === scholarshipId);
  if (!sch) throw new Error(`Scholarship "${scholarshipId}" not found.`);
  return sch.applySteps || [];
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL 3 — compute_allocation
// Pure arithmetic on user-supplied percentages.
// investPct may be 0. Rejects if percentages don't sum to 100.
// ═══════════════════════════════════════════════════════════════════════════════

function compute_allocation(awardAmount, loanPct, bufferPct, investPct) {
  const total = (loanPct || 0) + (bufferPct || 0) + (investPct || 0);
  if (Math.round(total) !== 100) {
    throw new Error(
      `Percentages must sum to 100. Supplied: ${loanPct} + ${bufferPct} + ${investPct} = ${total}.`
    );
  }
  if ([loanPct, bufferPct, investPct].some(p => (p || 0) < 0)) {
    throw new Error("No percentage may be negative.");
  }
  return {
    loanRepayment:   Math.round((awardAmount * loanPct)   / 100),
    emergencyBuffer: Math.round((awardAmount * bufferPct)  / 100),
    toInvest:        Math.round((awardAmount * (investPct || 0)) / 100),
    breakdown:       { loanPct, bufferPct, investPct: investPct || 0 },
  };
}

const CURRENCY_SYMBOLS = { IN: '₹', US: '$', UK: '£', default: '$' };

function filter_investments(investAmount, riskCategory, duration, country) {
  const countryCode = country || "IN";
  const sym = CURRENCY_SYMBOLS[countryCode] || CURRENCY_SYMBOLS.default;
  const locale = countryCode === 'US' ? 'en-US' : countryCode === 'UK' ? 'en-GB' : 'en-IN';

  return investments
    .filter(inv => {
      const amountOk   = investAmount >= inv.minAmount;
      const riskOk     = inv.riskCategory === riskCategory;
      const durationOk = inv.durationFit.includes(duration);
      const countryOk  = !inv.country || inv.country === countryCode;
      return amountOk && riskOk && durationOk && countryOk;
    })
    .map(inv => {
      const notes = [
        `Amount ${sym}${Math.round(investAmount).toLocaleString(locale)} ≥ minimum ${sym}${inv.minAmount.toLocaleString(locale)}.`,
        `Risk category "${inv.riskCategory}" matches selected "${riskCategory}".`,
        `Duration "${duration}" is in this plan's fit set [${inv.durationFit.join(", ")}].`,
        inv.lockInMonths > 0
          ? `Lock-in: ${inv.lockInMonths} months — confirm funds won't be needed before then.`
          : `No lock-in — funds remain liquid.`,
      ];
      return { ...inv, fitNote: notes.join(" | ") };
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL 5 — recommend_investment
// ─────────────────────────────────────────────────────────────────────────────
// THIS IS THE ONLY PLACE AN LLM CALL BELONGS.
// All other tools are pure rule engines or data lookups.
// ─────────────────────────────────────────────────────────────────────────────
// Calls Groq (llama-3.3-70b-versatile) with the already-filtered options,
// the connected bank balance, and the invest amount.
// Returns { recommendedId, reasoning, source }.
// If GROQ_API_KEY is absent, falls back to a template rule and logs the fallback.
// ═══════════════════════════════════════════════════════════════════════════════

function _templateRecommend(filteredOptions, bankBalance, investAmount) {
  const ratio = bankBalance / (investAmount || 1);
  let pick, reasoning;

  if (ratio >= 3) {
    // Comfortable cushion → favour higher return
    pick = [...filteredOptions].sort((a, b) => b.typicalAnnualReturnPct - a.typicalAnnualReturnPct)[0];
    reasoning =
      `Your bank balance of ₹${bankBalance.toLocaleString("en-IN")} is ${ratio.toFixed(1)}× your ` +
      `invest amount of ₹${investAmount.toLocaleString("en-IN")}, giving you a comfortable liquidity cushion. ` +
      `This means you can absorb short-term volatility, making "${pick.name}" — ` +
      `with its ${pick.typicalAnnualReturnPct}% p.a. typical return — a suitable choice within your ` +
      `selected risk and duration criteria. [Note: Template fallback — no LLM was called.]`;
  } else {
    // Tighter cushion → favour stability
    pick = [...filteredOptions].sort((a, b) => a.typicalAnnualReturnPct - b.typicalAnnualReturnPct)[0];
    reasoning =
      `Your bank balance of ₹${bankBalance.toLocaleString("en-IN")} is relatively close to ` +
      `your invest amount of ₹${investAmount.toLocaleString("en-IN")}, suggesting a tighter near-term buffer. ` +
      `"${pick.name}" is the more conservative choice within your criteria, prioritising capital safety ` +
      `over maximum returns until your liquidity position improves. [Note: Template fallback — no LLM was called.]`;
  }

  return { recommendedId: pick.id, reasoning, source: "template-fallback" };
}

async function recommend_investment(filteredOptions, bankBalance, investAmount) {
  if (!filteredOptions || filteredOptions.length === 0) {
    throw new Error("No filtered options provided to recommend_investment.");
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.warn("[FundPath] GROQ_API_KEY not set — using template fallback for recommendation.");
    return _templateRecommend(filteredOptions, bankBalance, investAmount);
  }

  const optionsList = filteredOptions
    .map((o, i) =>
      `${i + 1}. ID="${o.id}" | ${o.name} (${o.type}) | ~${o.typicalAnnualReturnPct}% p.a. | ` +
      `min ₹${o.minAmount.toLocaleString("en-IN")} | lock-in ${o.lockInMonths} months`
    )
    .join("\n");

  const prompt =
    `You are a concise, honest personal-finance advisor helping an Indian student invest scholarship money.\n\n` +
    `Investment options already filtered for the student's chosen risk category and duration:\n${optionsList}\n\n` +
    `Student's connected bank balance: ₹${bankBalance.toLocaleString("en-IN")}\n` +
    `Amount to invest: ₹${investAmount.toLocaleString("en-IN")}\n\n` +
    `Pick exactly ONE option and write 2–3 plain-language sentences explaining your recommendation. ` +
    `Reference the bank balance relative to the invest amount as a key factor. ` +
    `Do not invent statistics. Be concise.\n\n` +
    `Return JSON only, no other text:\n{"recommendedId": "<id from list above>", "reasoning": "<your explanation>"}`;

  const body = JSON.stringify({
    model: "llama-3.3-70b-versatile",
    max_tokens: 400,
    messages: [{ role: "user", content: prompt }],
  });

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: "api.groq.com",
        path: "/openai/v1/chat/completions",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
      },
      (res) => {
        let data = "";
        res.on("data", chunk => (data += chunk));
        res.on("end", () => {
          try {
            const parsed  = JSON.parse(data);
            const text    = parsed.choices?.[0]?.message?.content || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const result = JSON.parse(jsonMatch[0]);
              // Validate that the recommendedId is in our list
              const valid = filteredOptions.find(o => o.id === result.recommendedId);
              if (valid && result.reasoning) {
                resolve({ ...result, source: "llm-groq" });
                return;
              }
            }
          } catch { /* fall through */ }
          // Any parse error → template fallback
          console.warn("[FundPath] LLM response parsing failed — using template fallback.");
          resolve(_templateRecommend(filteredOptions, bankBalance, investAmount));
        });
      }
    );
    req.on("error", () => {
      console.warn("[FundPath] LLM request error — using template fallback.");
      resolve(_templateRecommend(filteredOptions, bankBalance, investAmount));
    });
    req.write(body);
    req.end();
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL 6 — log_decision
// Appends { stage, aiSuggested, familyChose, timestamp } to the in-memory log.
// ═══════════════════════════════════════════════════════════════════════════════

function log_decision(entry) {
  const record = {
    stage:       entry.stage,
    aiSuggested: entry.aiSuggested || null,
    familyChose: entry.familyChose || null,
    timestamp:   new Date().toISOString(),
  };
  decisionLog.push(record);
  return decisionLog;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public orchestrator surface
// ─────────────────────────────────────────────────────────────────────────────

const FundPathOrchestrator = {
  // Data
  scholarships,
  investments,
  countryFieldConfigs,

  // Tools
  score_eligibility,
  get_application_steps,
  compute_allocation,
  filter_investments,
  recommend_investment,
  log_decision,

  // Log access
  getDecisionLog: () => decisionLog,
};

module.exports = FundPathOrchestrator;
