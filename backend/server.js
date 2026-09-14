/**
 * FundPath v2 — Express server
 *
 * All state-mutating routes that submit an application, change an allocation,
 * or execute an investment require { confirmed: true } in the request body.
 * This flag is ONLY set by an explicit user UI button click — the orchestrator
 * never sets it autonomously. Server enforces this with a 400 if absent.
 *
 * Total Investment pool rules (enforced server-side):
 *   INCREASE — only passively, when a scholarship simulation → "accept" fires.
 *              POST /api/pool/edit with newBalance > current returns 400.
 *   DECREASE — user may lower the balance via POST /api/pool/edit,
 *              but must supply loanSplit + bufferSplit that sum to the removed amount.
 */

"use strict";

const express = require("express");
const cors    = require("cors");
const path    = require("path");
const orc     = require("./orchestrator");

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

// ── In-memory state ───────────────────────────────────────────────────────────

let profile         = null;   // { studentName, gpa, fieldOfStudy, country, parentName, relationship, householdIncome, gender, countryFields }
let bankAccount     = null;   // { bankName, accountNumber, balance }
let scholarshipCache = [];    // last search results with eligibility data
let applications    = [];     // { id, scholarshipId, name, amount, status, allocation, simulationReason, createdAt }
let investmentPool  = { balance: 0, history: [] };
let executedInvs    = [];     // { id, planId, planName, amount, followedAI, executedAt }

// Helper to find an application
const findApp = id => applications.find(a => a.id === id);

// ── Helpers ───────────────────────────────────────────────────────────────────

function mkId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// Mock bank catalogue — keyed by country code
const MOCK_BANKS = {
  IN: [
    { name: "State Bank of India",   balance: () => 245000 + Math.floor(Math.random() * 80000) },
    { name: "HDFC Bank",             balance: () => 382500 + Math.floor(Math.random() * 60000) },
    { name: "ICICI Bank",            balance: () => 310000 + Math.floor(Math.random() * 90000) },
    { name: "Axis Bank",             balance: () => 187500 + Math.floor(Math.random() * 50000) },
  ],
  US: [
    { name: "Chase Bank",            balance: () => 4200 + Math.floor(Math.random() * 3000) },
    { name: "Bank of America",       balance: () => 5100 + Math.floor(Math.random() * 4000) },
    { name: "Wells Fargo",           balance: () => 3800 + Math.floor(Math.random() * 2500) },
  ],
  UK: [
    { name: "Lloyds Bank",           balance: () => 2800 + Math.floor(Math.random() * 1500) },
    { name: "Barclays",              balance: () => 3400 + Math.floor(Math.random() * 2000) },
    { name: "NatWest",               balance: () => 2200 + Math.floor(Math.random() * 1800) },
  ],
  default: [
    { name: "Global Community Bank", balance: () => 1500 + Math.floor(Math.random() * 1000) },
    { name: "Metro Savings Bank",    balance: () => 2100 + Math.floor(Math.random() * 900)  },
  ],
};

// ── SERVER-SIDE CURRENCY FORMATTER ────────────────────────────────────────────
// Used only for human-readable decision-log strings. Reads profile at call time.
const COUNTRY_CURRENCY = {
  IN: { symbol: '₹', code: 'INR', locale: 'en-IN' },
  US: { symbol: '$', code: 'USD', locale: 'en-US' },
  UK: { symbol: '£', code: 'GBP', locale: 'en-GB' },
};
function fmtCur(n) {
  const cur = COUNTRY_CURRENCY[profile?.country] || { symbol: '$', locale: 'en-US' };
  return `${cur.symbol}${Math.round(n || 0).toLocaleString(cur.locale)}`;
}

app.get("/api/profile", (_req, res) => {
  if (!profile) return res.status(404).json({ error: "No profile set yet." });
  const currency = COUNTRY_CURRENCY[profile.country] || { symbol: '$', code: 'USD', locale: 'en-US' };
  res.json({ profile, bankAccount, currency });
});

// ── POST /api/onboarding/profile ──────────────────────────────────────────────
app.post("/api/onboarding/profile", (req, res) => {
  const { studentName, gpa, fieldOfStudy, country, gender,
          parentName, relationship, householdIncome, countryFields } = req.body;

  if (!studentName || gpa === undefined || !fieldOfStudy || !country) {
    return res.status(400).json({ error: "studentName, gpa, fieldOfStudy, country are required." });
  }

  profile = {
    studentName,
    gpa: parseFloat(gpa),
    fieldOfStudy,
    country,
    gender: gender || "",
    parentName:      parentName || "",
    relationship:    relationship || "",
    householdIncome: parseFloat(householdIncome || 0),
    countryFields:   countryFields || {},
    // Derived convenience flags
    // Derived convenience flags used by score_eligibility
    firstGen: !!(
      countryFields?.firstGenCollege === true ||
      (typeof countryFields?.firstGenCollege === "string" && countryFields.firstGenCollege.toLowerCase() === "yes") ||
      countryFields?.firstGen === true ||
      (typeof countryFields?.firstGen === "string" && countryFields.firstGen.toLowerCase() === "yes")
    ),
    location: country === "IN" ? "India"
            : country === "US" ? "United States"
            : country === "UK" ? "United Kingdom"
            : country,
  };

  orc.log_decision({
    stage:       "onboarding-profile",
    aiSuggested: null,
    familyChose: `Profile created for ${studentName}, ${fieldOfStudy}, country ${country}`,
  });

  res.json({ profile });
});

// ── POST /api/onboarding/bank-connect ─────────────────────────────────────────
app.post("/api/onboarding/bank-connect", (req, res) => {
  const { bankName } = req.body;
  if (!bankName) return res.status(400).json({ error: "bankName is required." });

  const country = profile?.country || "default";
  const catalogue = MOCK_BANKS[country] || MOCK_BANKS.default;
  const entry = catalogue.find(b => b.name === bankName) || catalogue[0];

  const rawBalance  = entry.balance();
  const lastFour    = String(1000 + Math.floor(Math.random() * 9000));
  const accountNo   = `XXXX XXXX XXXX ${lastFour}`;

  bankAccount = { bankName, accountNumber: accountNo, balance: rawBalance };

  orc.log_decision({
    stage:       "onboarding-bank-connect",
    aiSuggested: null,
    familyChose: `Bank "${bankName}" linked (${accountNo})`,
  });

  res.json({ bankAccount });
});

// ── POST /api/onboarding/digilocker-mock ─────────────────────────────────────
// Mocked DigiLocker OAuth-style flow for India.
// Returns pre-filled values for the India-specific fields.
app.post("/api/onboarding/digilocker-mock", (_req, res) => {
  // Simulate a realistic DigiLocker payload
  const digilocker = {
    guardianName:     "Ramesh Kumar",
    guardianRelation: "Parent",
    annualIncome:     550000,
    countryFields: {
      casteCategory: "OBC",
      religion:      "Hindu",
      disability:    "None / Not disclosed",
      firstGenCollege: "no",
    },
  };

  orc.log_decision({
    stage:       "onboarding-digilocker",
    aiSuggested: null,
    familyChose: "DigiLocker mock flow completed — guardian name, income and fields pre-filled",
  });

  res.json({ digilocker, source: "digilocker-mock" });
});

// ── GET /api/config/country-fields ────────────────────────────────────────────
app.get("/api/config/country-fields", (_req, res) => {
  res.json({ configs: orc.countryFieldConfigs });
});

// ── GET /api/config/banks ─────────────────────────────────────────────────────
app.get("/api/config/banks", (req, res) => {
  const country  = req.query.country || profile?.country || "default";
  const banks    = (MOCK_BANKS[country] || MOCK_BANKS.default).map(b => b.name);
  res.json({ banks });
});

// ── POST /api/scholarships/search ─────────────────────────────────────────────
app.post("/api/scholarships/search", async (req, res) => {
  try {
    const prof = req.body.profile || profile;
    if (!prof) return res.status(400).json({ error: "Profile required." });

    // Filter scholarships to those matching the user's country
    const country = prof.country || "IN";
    const countryScholarships = orc.scholarships.filter(
      sch => !sch.country || sch.country === country
    );

    const results = countryScholarships.map(sch => {
      const eligResult = orc.score_eligibility(prof, sch);
      return { ...sch, eligibility: eligResult };
    });

    // Sort: eligible first, then by valueScore desc
    results.sort((a, b) => {
      if (a.eligibility.eligible !== b.eligibility.eligible) {
        return a.eligibility.eligible ? -1 : 1;
      }
      return b.eligibility.valueScore - a.eligibility.valueScore;
    });

    scholarshipCache = results;

    orc.log_decision({
      stage:       "scholarship-search",
      aiSuggested: `Agent ranked ${results.filter(r => r.eligibility.eligible).length} eligible scholarships for country ${country}`,
      familyChose: `Profile submitted for ${prof.studentName || "student"}`,
    });

    res.json({ scholarships: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/scholarships/:id/steps ──────────────────────────────────────────
app.get("/api/scholarships/:id/steps", (req, res) => {
  try {
    const steps = orc.get_application_steps(req.params.id);
    res.json({ steps });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// ── POST /api/compute-allocation ──────────────────────────────────────────────
// Pure arithmetic preview. No state changes. Called by the allocation form.
app.post("/api/compute-allocation", (req, res) => {
  const { awardAmount, loanPct, bufferPct, investPct } = req.body;
  if (awardAmount === undefined) {
    return res.status(400).json({ error: "awardAmount is required." });
  }
  try {
    const allocation = orc.compute_allocation(
      parseFloat(awardAmount),
      parseFloat(loanPct   || 0),
      parseFloat(bufferPct || 0),
      parseFloat(investPct || 0)
    );
    res.json({ allocation });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── POST /api/applications ────────────────────────────────────────────────────
// HARD CONSTRAINT: confirmed must be true (set only by UI button click).
app.post("/api/applications", (req, res) => {
  const { scholarshipId, confirmed, loanPct, bufferPct, investPct } = req.body;

  if (!confirmed) {
    return res.status(400).json({
      error: "confirmed must be true. No application is submitted without explicit user confirmation.",
    });
  }

  const sch = orc.scholarships.find(s => s.id === scholarshipId);
  if (!sch) return res.status(404).json({ error: "Scholarship not found." });

  // Compute allocation
  let allocation = null;
  if (loanPct !== undefined) {
    try {
      allocation = orc.compute_allocation(sch.amount, loanPct || 0, bufferPct || 0, investPct || 0);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  const newApp = {
    id:               mkId("app"),
    scholarshipId,
    name:             sch.name,
    amount:           sch.amount,
    status:           "Pending",
    allocation,
    simulationReason: null,
    createdAt:        new Date().toISOString(),
  };
  applications.push(newApp);

  orc.log_decision({
    stage:       "application-submit",
    aiSuggested: `Agent checked eligibility and provided application steps for "${sch.name}"`,
    familyChose: `Family confirmed application for "${sch.name}" (${fmtCur(sch.amount)})`,
  });

  if (allocation) {
    orc.log_decision({
      stage:       "allocation",
      aiSuggested: "Agent computed arithmetic breakdown from user-supplied percentages",
      familyChose: `Split: ${loanPct}% loan, ${bufferPct}% buffer, ${investPct || 0}% invest on ${fmtCur(sch.amount)}`,
    });
  }

  res.json({ application: newApp });
});

// ── POST /api/applications/:id/allocate ──────────────────────────────────────
app.post("/api/applications/:id/allocate", (req, res) => {
  const application = findApp(req.params.id);
  if (!application) return res.status(404).json({ error: "Application not found." });

  const { loanPct, bufferPct, investPct, awardAmount } = req.body;
  try {
    const allocation = orc.compute_allocation(
      parseFloat(awardAmount || application.amount),
      parseFloat(loanPct   || 0),
      parseFloat(bufferPct || 0),
      parseFloat(investPct || 0)
    );
    application.allocation = allocation;

    orc.log_decision({
      stage:       "allocation",
      aiSuggested: "Agent computed arithmetic breakdown from user-supplied percentages",
      familyChose: `Split: ${loanPct}% loan, ${bufferPct}% buffer, ${investPct || 0}% invest on ${fmtCur(application.amount)}`,
    });

    res.json({ application });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── POST /api/applications/:id/simulate ──────────────────────────────────────
// Demo-only control — simulates a scholarship board decision.
app.post("/api/applications/:id/simulate", (req, res) => {
  const application = findApp(req.params.id);
  if (!application) return res.status(404).json({ error: "Application not found." });

  const { action } = req.body; // "accept" | "reject"

  if (action === "accept") {
    application.status = "Accepted";

    let investAmount = 0;
    if (application.allocation && (application.allocation.breakdown?.investPct || 0) > 0) {
      investAmount = application.allocation.toInvest;

      // CONSTRAINT: pool increases only passively on accept — never via direct user input
      investmentPool.balance += investAmount;
      investmentPool.history.push({
        type:          "scholarship-accept",
        scholarshipId: application.scholarshipId,
        name:          application.name,
        amount:        investAmount,
        at:            new Date().toISOString(),
      });
    }

    orc.log_decision({
      stage:       "simulate-accept",
      aiSuggested: "Demo control fired: Simulate Received",
      familyChose: `"${application.name}" marked Accepted; ${fmtCur(investAmount)} added to investment pool`,
    });

    return res.json({ application, poolBalance: investmentPool.balance });
  }

  if (action === "reject") {
    application.status = "Rejected";
    // Pick a rejection reason from the scholarship's seeded set
    const sch = orc.scholarships.find(s => s.id === application.scholarshipId);
    const reasons = sch?.rejectionReasons || ["Award fully allocated to other applicants this cycle"];
    application.simulationReason = reasons[Math.floor(Math.random() * reasons.length)];

    orc.log_decision({
      stage:       "simulate-reject",
      aiSuggested: "Demo control fired: Simulate Rejected",
      familyChose: `"${application.name}" marked Rejected: "${application.simulationReason}"`,
    });

    return res.json({ application });
  }

  res.status(400).json({ error: 'action must be "accept" or "reject".' });
});

// ── GET /api/pool ─────────────────────────────────────────────────────────────
app.get("/api/pool", (_req, res) => {
  res.json({ ...investmentPool });
});

// ── POST /api/pool/edit ───────────────────────────────────────────────────────
// Server enforces: no increase; decrease split must sum to removed amount.
app.post("/api/pool/edit", (req, res) => {
  const { newBalance, loanSplit, bufferSplit } = req.body;
  const current = investmentPool.balance;

  // CONSTRAINT: Total Investment balance can never be increased by direct user input
  if (newBalance > current) {
    return res.status(400).json({
      error:
        "The Total Investment balance cannot be increased by direct user input. " +
        "It increases only when a scholarship application is accepted.",
    });
  }

  const removedAmount = Math.round(current - newBalance);
  const splitTotal    = Math.round((loanSplit || 0) + (bufferSplit || 0));

  if (splitTotal > removedAmount) {
    return res.status(400).json({
      error: `Split (${fmtCur(splitTotal)}) cannot exceed the removed amount (${fmtCur(removedAmount)}).`,
      removedAmount,
    });
  }

  investmentPool.balance = newBalance;
  investmentPool.history.push({
    type:          "manual-decrease",
    from:          current,
    to:            newBalance,
    removedAmount,
    loanSplit:     loanSplit || 0,
    bufferSplit:   bufferSplit || 0,
    at:            new Date().toISOString(),
  });

  orc.log_decision({
    stage:       "pool-edit",
    aiSuggested: null,
    familyChose: `Pool manually decreased from ${fmtCur(current)} to ${fmtCur(newBalance)}; ` +
                 `removed ${fmtCur(removedAmount)} split as loan ${fmtCur((loanSplit||0))} / buffer ${fmtCur((bufferSplit||0))}`,
  });

  res.json({ balance: investmentPool.balance, removedAmount, loanSplit: loanSplit || 0, bufferSplit: bufferSplit || 0 });
});

// ── POST /api/investments/filter ──────────────────────────────────────────────
app.post("/api/investments/filter", (req, res) => {
  try {
    const { investAmount, riskCategory, duration } = req.body;
    if (!riskCategory || !duration) {
      return res.status(400).json({ error: "riskCategory and duration are required." });
    }
    const filtered = orc.filter_investments(
      parseFloat(investAmount || investmentPool.balance), riskCategory, duration
    , profile?.country);
    res.json({ investments: filtered });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/investments/recommend ──────────────────────────────────────────
app.post("/api/investments/recommend", async (req, res) => {
  try {
    const { filteredOptions, bankBalance, investAmount } = req.body;
    if (!filteredOptions || filteredOptions.length === 0) {
      return res.status(400).json({ error: "filteredOptions array is required and must be non-empty." });
    }
    const result = await orc.recommend_investment(
      filteredOptions, parseFloat(bankBalance  || bankAccount?.balance || 0), parseFloat(investAmount || investmentPool.balance, profile?.country)
    );

    orc.log_decision({
      stage:       "invest-recommend",
      aiSuggested: `${result.source === "llm-groq" ? "Groq LLM" : "Template fallback"} recommended plan ID "${result.recommendedId}"`,
      familyChose: null,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/investments/execute ─────────────────────────────────────────────
// HARD CONSTRAINT: confirmed must be true (set only by UI button click).
app.post("/api/investments/execute", (req, res) => {
  const { planId, amount, followedAI, confirmed } = req.body;

  if (!confirmed) {
    return res.status(400).json({
      error: "confirmed must be true. No investment is executed without explicit user confirmation.",
    });
  }

  const plan = orc.investments.find(i => i.id === planId);
  if (!plan) return res.status(404).json({ error: "Investment plan not found." });

  const execAmount = parseFloat(amount || investmentPool.balance);
  if (execAmount > investmentPool.balance) {
    return res.status(400).json({ error: `Insufficient pool balance (${fmtCur(investmentPool.balance)}).` });
  }
  if (execAmount < plan.minAmount) {
    return res.status(400).json({ error: `Amount ${fmtCur(execAmount)} is below the plan minimum ${fmtCur(plan.minAmount)}.` });
  }

  investmentPool.balance -= execAmount;
  investmentPool.history.push({
    type:    "invest-execute",
    planId,
    amount:  execAmount,
    at:      new Date().toISOString(),
  });

  const executed = {
    id:         mkId("inv"),
    planId,
    planName:   plan.name,
    amount:     execAmount,
    followedAI: !!followedAI,
    executedAt: new Date().toISOString(),
  };
  executedInvs.push(executed);

  orc.log_decision({
    stage:       "invest-execute",
    aiSuggested: followedAI ? `AI recommended "${plan.name}"` : null,
    familyChose: `Family ${followedAI ? "followed AI recommendation" : "made independent choice"}: ` +
                 `invested ${fmtCur(execAmount)} in "${plan.name}"`,
  });

  res.json({ executed, poolBalance: investmentPool.balance });
});

// ── GET /api/investments/executed ────────────────────────────────────────────
app.get("/api/investments/executed", (_req, res) => {
  res.json({ executed: executedInvs });
});

// ── POST /api/investments/notify-bank ────────────────────────────────────────
// Sends a reminder to the connected bank that an investment plan has been selected.
// CONSTRAINT: this is a notification only — it does NOT execute any transfer or
// change any balance. All actual execution still requires confirmed: true on /execute.
app.post("/api/investments/notify-bank", (req, res) => {
  const { planId, planName, amount, bankAccountId, studentName } = req.body;

  const notification = {
    id:          `notif-${Date.now()}`,
    type:        "investment-intent",
    sentAt:      new Date().toISOString(),
    to:          "connected-bank",
    bankAccountId: bankAccountId || "mock-account",
    message:     `Investment intent: ${studentName} has selected plan "${planName}" for ${
                   typeof amount === "number" ? amount.toLocaleString("en-IN", { style: "currency", currency: "INR" }) : amount
                 }. Awaiting final execute confirmation before any fund transfer.`,
    planId,
    amount:      typeof amount === "number" ? amount : parseFloat(amount || 0),
    status:      "sent",   // mock — real impl would POST to bank's webhook
    agentNote:   "This is a reminder only. No money has moved. The agent cannot transfer funds without a separate confirmed: true request on /api/investments/execute.",
  };

  // Log to the decision log
  orc.logDecision({
    stage:      "invest-bank-notify",
    agentDid:   `Sent bank reminder for plan "${planName}" (${planId}), amount ${amount}`,
    familyChose: `User selected plan and confirmed bank reminder`,
  });

  console.log(`[BANK NOTIFY] ${JSON.stringify(notification)}`);
  res.json({ notification });
});

// ── GET /api/decisions ────────────────────────────────────────────────────────
app.get("/api/decisions", (_req, res) => {
  res.json({ log: orc.getDecisionLog() });
});

// ── POST /api/decisions ───────────────────────────────────────────────────────
app.post("/api/decisions", (req, res) => {
  const { stage, aiSuggested, familyChose } = req.body;
  if (!stage) return res.status(400).json({ error: "stage is required." });
  const log = orc.log_decision({ stage, aiSuggested, familyChose });
  res.json({ log });
});

// ── GET /api/applications ────────────────────────────────────────────────────
app.get("/api/applications", (_req, res) => {
  res.json({ applications });
});

// ── GET /api/stats ────────────────────────────────────────────────────────────
// Used by the settings Privacy section — view only, no mutation.
app.get("/api/stats", (_req, res) => {
  res.json({
    scholarshipsInCache: scholarshipCache.length,
    applicationsCount:   applications.length,
    decisionsCount:      orc.getDecisionLog().length,
    executedInvestments: executedInvs.length,
    poolBalance:         investmentPool.balance,
    storageNote:         "All data is in-memory only — cleared when the server restarts.",
  });
});

// ── POST /api/logout ──────────────────────────────────────────────────────────
// Resets all in-memory state. UI redirects to onboarding after calling this.
// CONSTRAINT: this route does NOT call any allocation, investment-filtering,
// AI-recommendation, or balance-changing tool. It only resets raw state.
app.post("/api/logout", (_req, res) => {
  profile          = null;
  bankAccount      = null;
  scholarshipCache = [];
  applications     = [];
  investmentPool   = { balance: 0, history: [] };
  executedInvs     = [];
  // Decision log is intentionally kept for audit purposes (could be cleared too if desired).
  orc.log_decision({ stage: "logout", aiSuggested: null, familyChose: "Session cleared by user" });
  res.json({ ok: true });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`FundPath v2 backend running → http://localhost:${PORT}`);
  console.log(`LLM (recommend_investment): ${process.env.GROQ_API_KEY ? "Groq (llama-3.3-70b-versatile)" : "template fallback"}`);
});

