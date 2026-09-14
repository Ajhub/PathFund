/**
 * FundPath v2 — app.js
 * Vanilla JS SPA. No framework, no build step.
 * Talks to backend at localhost:3001.
 */
"use strict";

// ═══════════════════════════════════════════════════════════════
// CONFIG & STATE
// ═══════════════════════════════════════════════════════════════

const API = "http://localhost:3001/api";

const S = {
  // Onboarding
  obStep: 0,   // 0=student 1=parent 2=country 3=bank
  student:      {},
  parent:       {},
  countryFields:{},   // fieldId → value (or "__skipped__")
  digiDone:     false,
  countryConfigs: null,
  selectedBank: null,
  bankAccount:  null,

  // Dashboard
  profile:      null,
  tab:          "scholarships",

  // Scholarships tab
  scholarships: [],
  cardUI:       {}, // schId → { state:'default'|'cancelled'|'checklist'|'allocation', checkedSteps:Set }
  applications: [], // from backend

  // Investing tab
  pool:         { balance: 0 },
  riskCategory: null,
  duration:     null,
  filtered:     [],
  aiRec:        null,      // { recommendedId, reasoning, source }
  selectedPlan: null,      // planId
};

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

const $  = id => document.getElementById(id);

function fmtCur(n) {
  const c = S.profile ? S.profile.country : (S.student ? S.student.country : 'IN');
  const sym = c === 'US' ? '$' : c === 'UK' ? '£' : '₹';
  const loc = c === 'US' ? 'en-US' : c === 'UK' ? 'en-GB' : 'en-IN';
  return sym + Math.round(n || 0).toLocaleString(loc);
}
const fmtDate = iso => iso ? new Date(iso).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—";
const fmtTime = iso => iso ? new Date(iso).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" }) + ", " + fmtDate(iso) : "—";

function show(id) { const el = $(id); if (el) el.classList.remove("hidden"); }
function hide(id) { const el = $(id); if (el) el.classList.add("hidden"); }

let toastTimer;
function toast(msg, type = "") {
  const el = $("toast");
  el.textContent = msg;
  el.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.className = "toast"; }, 3200);
}

async function apiGet(path) {
  const r = await fetch(API + path);
  if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.error || r.statusText); }
  return r.json();
}
async function apiPost(path, body) {
  const r = await fetch(API + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.error || r.statusText); }
  return r.json();
}
async function logDecision(stage, ai, family) {
  try { await apiPost("/decisions", { stage, aiSuggested: ai, familyChose: family }); } catch {}
}

// ═══════════════════════════════════════════════════════════════
// ONBOARDING — step bar
// ═══════════════════════════════════════════════════════════════

const OB_STEPS = ["Student Details", "Parent / Guardian", "Eligibility Fields", "Bank Connect"];

function renderObStepBar() {
  const bar = $("ob-step-bar");
  if (!bar) return;
  bar.innerHTML = OB_STEPS.map((label, i) => {
    const isDone   = i < S.obStep;
    const isActive = i === S.obStep;
    const conn = i < OB_STEPS.length - 1
      ? `<div class="ob-step-conn ${isDone ? "done" : ""}"></div>` : "";
    return `
      <div class="ob-step-item">
        <div class="ob-step-dot ${isDone ? "done" : isActive ? "active" : ""}">
          ${isDone ? "✓" : i + 1}
        </div>
        <div class="ob-step-label ${isDone ? "done" : isActive ? "active" : ""}">${label}</div>
        ${conn}
      </div>`;
  }).join("");
}

// ═══════════════════════════════════════════════════════
// ONBOARDING — Step 0: Student Details
// ═══════════════════════════════════════════════════════

const CURRENCY_MAP = {
  IN:      { symbol: '₹', code: 'INR', locale: 'en-IN' },
  US:      { symbol: '$', code: 'USD', locale: 'en-US' },
  UK:      { symbol: '£', code: 'GBP', locale: 'en-GB' },
  default: { symbol: '$', code: 'USD', locale: 'en-US' },
};

const GPA_META = {
  IN:      { label: 'GPA / CGPA',    note: 'out of 10',            placeholder: 'e.g. 8.2', max: 10  },
  US:      { label: 'GPA',           note: '4.0 scale',            placeholder: 'e.g. 3.8', max: 4   },
  UK:      { label: 'Grade (%)',     note: 'enter as percentage',   placeholder: 'e.g. 72',  max: 100 },
  default: { label: 'Academic Score',note: '0–10 normalised',      placeholder: 'e.g. 8.0', max: 10  },
};

function renderStep0() {
  renderObStepBar();
  const country = S.student.country || '';
  const gm   = GPA_META[country] || GPA_META.default;
  const sym  = country ? (CURRENCY_MAP[country]?.symbol || '') : '';
  const code = country ? (CURRENCY_MAP[country]?.code   || '') : '';
  const flag = country === 'IN' ? '🇮🇳' : country === 'US' ? '🇺🇸' : country === 'UK' ? '🇬🇧' : country ? '🌍' : '';
  const currencyNotice = sym
    ? `<div class="field full" id="currency-notice-wrap">
        <div class="notice" style="margin-bottom:0;">
          <span class="n-icon">${flag}</span>
          <p>Scholarship amounts, bank balances, and investments will be shown in <strong>${code} (${sym})</strong>.</p>
        </div>
      </div>`
    : `<div class="field full" id="currency-notice-wrap"></div>`;

  $("ob-content").innerHTML = `
    <div class="card">
      <h2>Student Details</h2>
      <p class="subtitle">Tell us about the student applying for scholarships.</p>
      <div class="form-grid">
        <div class="field full">
          <label>Full Name</label>
          <input id="s-name" type="text" placeholder="e.g. Priya Sharma" value="${S.student.name || ""}" />
        </div>
        <div class="field">
          <label id="gpa-label">${gm.label} <span class="note">(${gm.note})</span></label>
          <input id="s-gpa" type="number" step="0.01" min="0" max="${gm.max}" placeholder="${gm.placeholder}" value="${S.student.gpa || ""}" />
        </div>
        <div class="field">
          <label>Field of Study</label>
          <select id="s-field">
            <option value="">-- Select --</option>
            ${["Agriculture","Computer Science","Data Science","Education","Engineering","Environmental Science","Humanities","Information Technology","Law","Mathematics","Physics","Rural Development","Social Sciences","Other"].map(f =>
              `<option value="${f}" ${S.student.fieldOfStudy === f ? "selected" : ""}>${f}</option>`
            ).join("")}
          </select>
        </div>
        <div class="field">
          <label>Gender</label>
          <select id="s-gender">
            <option value="">-- Select --</option>
            <option value="Male"   ${S.student.gender === "Male"   ? "selected" : ""}>Male</option>
            <option value="Female" ${S.student.gender === "Female" ? "selected" : ""}>Female</option>
            <option value="Non-binary / Other" ${S.student.gender === "Non-binary / Other" ? "selected" : ""}>Non-binary / Other</option>
            <option value="Prefer not to say"  ${S.student.gender === "Prefer not to say"  ? "selected" : ""}>Prefer not to say</option>
          </select>
        </div>
        <div class="field full">
          <label>Country of Study</label>
          <select id="s-country" onchange="onCountryChange(this.value)">
            <option value="">-- Select Country --</option>
            <option value="IN" ${S.student.country === "IN" ? "selected" : ""}>🇮🇳 India</option>
            <option value="US" ${S.student.country === "US" ? "selected" : ""}>🇺🇸 United States</option>
            <option value="UK" ${S.student.country === "UK" ? "selected" : ""}>🇬🇧 United Kingdom</option>
            <option value="default" ${S.student.country === "default" ? "selected" : ""}>🌍 Other</option>
          </select>
        </div>
        ${currencyNotice}
      </div>
      <div class="row">
        <button class="btn btn-primary" onclick="nextStep0()">Next: Parent Details →</button>
      </div>
    </div>`;
}

// Live update GPA label + currency notice when country changes (no page reload)
function onCountryChange(country) {
  const gm   = GPA_META[country] || GPA_META.default;
  const sym  = CURRENCY_MAP[country]?.symbol || '';
  const code = CURRENCY_MAP[country]?.code   || '';
  const flag = country === 'IN' ? '🇮🇳' : country === 'US' ? '🇺🇸' : country === 'UK' ? '🇬🇧' : '🌍';

  const lbl = $("gpa-label");
  if (lbl) lbl.innerHTML = `${gm.label} <span class="note">(${gm.note})</span>`;
  const gpaInput = $("s-gpa");
  if (gpaInput) { gpaInput.placeholder = gm.placeholder; gpaInput.max = gm.max; }

  const wrap = $("currency-notice-wrap");
  if (wrap) {
    wrap.innerHTML = sym ? `
      <div class="notice" style="margin-bottom:0;">
        <span class="n-icon">${flag}</span>
        <p>Scholarship amounts, bank balances, and investments will be shown in <strong>${code} (${sym})</strong>.</p>
      </div>` : '';
  }

  S.currency = CURRENCY_MAP[country] || CURRENCY_MAP.default;
}

function nextStep0() {
  const name    = $("s-name").value.trim();
  const gpa     = parseFloat($("s-gpa").value);
  const field   = $("s-field").value;
  const gender  = $("s-gender").value;
  const country = $("s-country").value;
  if (!name || !gpa || !field || !country) { toast("Please fill in all required fields.", "error"); return; }
  S.student  = { name, gpa, fieldOfStudy: field, gender, country };
  S.currency = CURRENCY_MAP[country] || CURRENCY_MAP.default;

  // Indian users get a sign-up method choice screen
  if (country === "IN") {
    S.obStep = 0; // Keep at 0 visually — it's a sub-screen
    renderStepChoice();
  } else {
    S.obStep = 1;
    renderStep1();
  }
}

// ═══════════════════════════════════════════════════════
// ONBOARDING — Step 0.5: Sign-up Method (India only)
// ═══════════════════════════════════════════════════════

async function renderStepChoice() {
  renderObStepBar();
  $("ob-content").innerHTML = `
    <div class="card">
      <h2>🇮🇳 How would you like to sign up?</h2>
      <p class="subtitle">
        As an Indian student, you can connect your DigiLocker to automatically pre-fill your
        academic and identity details — or enter them manually.
      </p>

      <div style="display:flex; flex-direction:column; gap:16px; margin-top:24px;">

        <div class="digi-choice-card" id="choice-digi" onclick="chooseDigiLocker()" style="cursor:pointer;">
          <div class="digi-icon" style="font-size:2rem;">🔐</div>
          <div>
            <div class="digi-title" style="font-size:1.05rem;font-weight:700;">Connect via DigiLocker</div>
            <div class="digi-desc" style="margin-top:4px;">
              Auto-fill your Aadhaar, marksheets, and income details from DigiLocker.
              Faster and fewer fields to fill.
              <span style="margin-left:6px;background:var(--success-bg);color:var(--success);border-radius:4px;padding:2px 8px;font-size:.75rem;font-weight:700;">Recommended</span>
            </div>
          </div>
        </div>

        <div class="digi-choice-card" id="choice-manual" onclick="chooseManual()" style="cursor:pointer;">
          <div class="digi-icon" style="font-size:2rem;">✏️</div>
          <div>
            <div class="digi-title" style="font-size:1.05rem;font-weight:700;">Fill Manually</div>
            <div class="digi-desc" style="margin-top:4px;">
              Enter your parent, income, and eligibility details yourself step by step.
            </div>
          </div>
        </div>
      </div>

      <div class="row" style="margin-top:24px;">
        <button class="btn btn-outline" onclick="S.obStep=0; renderStep0();">← Back</button>
      </div>
    </div>`;
}

async function chooseDigiLocker() {
  const card = $("choice-digi");
  if (card) card.innerHTML = `<div class="spinner"></div><span style="font-size:.9rem;color:var(--text-muted);">Connecting to DigiLocker…</span>`;

  try {
    const data = await apiPost("/onboarding/digilocker-mock", { country: "IN" });
    const d = data.digilocker;

    // Pre-fill parent details from DigiLocker
    S.parent = {
      name: d.guardianName || "",
      relationship: d.guardianRelation || "Parent",
      income: d.annualIncome || 0,
    };

    // Pre-fill country fields from DigiLocker
    if (d.countryFields) {
      Object.assign(S.countryFields, d.countryFields);
    }

    S.digiDone = true;
    toast("DigiLocker connected! Details pre-filled.", "success");

    // Skip straight to Step 2 (Eligibility Fields) — parent step is pre-filled
    S.obStep = 2;
    renderStep2();
  } catch (err) {
    toast("DigiLocker connection failed: " + err.message, "error");
    // Restore the card
    renderStepChoice();
  }
}

function chooseManual() {
  S.obStep = 1;
  renderStep1();
}

// ——————————————————————————————————————————————————————————————
// ONBOARDING — Step 1: Parent / Guardian
// ——————————————————————————————————————————————————————————————

function renderStep1() {
  renderObStepBar();
  $("ob-content").innerHTML = `
    <div class="card">
      <h2>Parent / Guardian Details</h2>
      <p class="subtitle">Required to verify household income for means-tested scholarships.</p>
      <div class="form-grid">
        <div class="field">
          <label>Full Name</label>
          <input id="p-name" type="text" placeholder="e.g. Rajesh Sharma" value="${S.parent.name || ""}" />
        </div>
        <div class="field">
          <label>Relationship to Student</label>
          <select id="p-rel">
            <option value="">-- Select --</option>
            ${["Parent","Guardian","Grandparent","Sibling","Other"].map(r =>
              `<option value="${r}" ${S.parent.relationship === r ? "selected" : ""}>${r}</option>`
            ).join("")}
          </select>
        </div>
        <div class="field full">
          <label>Annual Household Income <span class="note">(${S.currency?.code || 'local currency'}, ${S.currency?.symbol || ''}numeric only)</span></label>
          <input id="p-income" type="number" min="0" placeholder="${S.student.country === 'US' ? 'e.g. 48000' : S.student.country === 'UK' ? 'e.g. 28000' : 'e.g. 600000'}" value="${S.parent.income || ""}" />
        </div>
      </div>
      <div class="row">
        <button class="btn btn-outline" onclick="prevStep()">← Back</button>
        <button class="btn btn-primary" onclick="nextStep1()">Next: Eligibility Fields →</button>
      </div>
    </div>`;
}

function nextStep1() {
  const name = $("p-name").value.trim();
  const rel  = $("p-rel").value;
  const inc  = parseFloat($("p-income").value);
  if (!name || !rel || isNaN(inc)) { toast("Please fill in all fields.", "error"); return; }
  S.parent = { name, relationship: rel, income: inc };
  S.obStep = 2;
  renderStep2();
}

// ═══════════════════════════════════════════════════════════════
// ONBOARDING — Step 2: Country-specific eligibility fields
// ═══════════════════════════════════════════════════════════════

async function renderStep2() {
  renderObStepBar();
  $("ob-content").innerHTML = `<div class="loading-row"><div class="spinner"></div> Loading eligibility fields—¦</div>`;
  if (!S.countryConfigs) {
    try {
      const data = await apiGet("/config/country-fields");
      S.countryConfigs = data.configs;
    } catch (e) {
      toast("Could not load country fields. Using defaults.", "error");
      S.countryConfigs = {};
    }
  }
  const countryCode = S.student.country || "default";
  const cfg = S.countryConfigs[countryCode] || S.countryConfigs.default;

  let html = `
    <div class="card">
      <h2>Eligibility Fields — ${cfg.name || "Other"}</h2>
      <p class="subtitle">
        These fields help match you to specific scholarships. Each field is individually skippable.
      </p>
      <div class="notice">
        <span class="n-icon">🔒</span>
        <p>Sensitive information is used only for scholarship matching within this session. No data is stored beyond your browser session.</p>
      </div>`;

  if (cfg.digilocker) {
    html += `
      <div class="digi-choice-card" onclick="connectDigiLocker()">
        <div class="digi-icon">🔐</div>
        <div>
          <div class="digi-title">Connect via DigiLocker</div>
          <div class="digi-desc">Automatically fetch your identity documents from DigiLocker and pre-fill fields below</div>
        </div>
      </div>
      <div class="digi-divider">— or enter manually below —</div>`;
  }

  (cfg.fields || []).forEach(field => {
    const skipped = S.countryFields[field.id] === "__skipped__";
    const val     = skipped ? "" : (S.countryFields[field.id] || "");
    html += `<div class="country-field-wrap" id="cfw-${field.id}">`;
    html += `<label>${field.label}</label>`;
    if (skipped) {
      html += `<div class="skipped-field">⏭ Skipped — <a href="#" style="color:var(--brand)" onclick="unskipField('${field.id}'); return false">Undo</a></div>`;
      html += `<div class="skip-note">${field.skipNote}</div>`;
    } else {
      if (field.type === "select") {
        html += `<select id="cf-${field.id}" onchange="saveCountryField('${field.id}', this.value)">
          <option value="">-- Select --</option>
          ${(field.options || []).map(o => `<option value="${o}" ${val === o ? "selected" : ""}>${o}</option>`).join("")}
        </select>`;
      } else if (field.type === "boolean") {
        html += `<div class="bool-choice">
          <button class="bool-btn ${val === "yes" ? "selected" : ""}" onclick="saveCountryField('${field.id}', 'yes'); document.querySelectorAll('#cfw-${field.id} .bool-btn').forEach(b=>b.classList.remove('selected')); this.classList.add('selected')">Yes</button>
          <button class="bool-btn ${val === "no"  ? "selected" : ""}" onclick="saveCountryField('${field.id}', 'no');  document.querySelectorAll('#cfw-${field.id} .bool-btn').forEach(b=>b.classList.remove('selected')); this.classList.add('selected')">No</button>
        </div>`;
      } else {
        html += `<input type="text" id="cf-${field.id}" placeholder="${field.placeholder || ""}" value="${val}" oninput="saveCountryField('${field.id}', this.value)" />`;
      }
      html += `<div class="skip-row"><button class="skip-btn" onclick="skipField('${field.id}', '${field.skipNote.replace(/'/g, "\\'")}')">Skip this field</button></div>`;
    }
    html += `</div>`;
  });

  html += `
      <div class="row">
        <button class="btn btn-outline" onclick="prevStep()">← Back</button>
        <button class="btn btn-primary" onclick="nextStep2()">Next: Connect Bank →</button>
      </div>
    </div>`;

  $("ob-content").innerHTML = html;
}

function saveCountryField(id, val) { S.countryFields[id] = val; }

function skipField(id, note) {
  S.countryFields[id] = "__skipped__";
  const wrap = $(`cfw-${id}`);
  if (!wrap) return;
  const label = wrap.querySelector("label").textContent;
  wrap.innerHTML = `<label>${label}</label>
    <div class="skipped-field">⏭ Skipped — <a href="#" style="color:var(--brand)" onclick="unskipField('${id}'); return false">Undo</a></div>
    <div class="skip-note">${note}</div>`;
}

function unskipField(id) {
  delete S.countryFields[id];
  renderStep2();
}

async function connectDigiLocker() {
  const modal = $("modal-digi");
  $("modal-digi-body").innerHTML = `
    <div style="padding:16px;">
      <div style="font-size:2.5rem;margin-bottom:12px;">🔐</div>
      <div style="font-weight:700;font-size:1rem;margin-bottom:8px;">Connecting to DigiLocker—¦</div>
      <div style="color:var(--text-muted);font-size:.85rem;">Verifying your identity documents</div>
      <div class="spinner" style="margin:16px auto;"></div>
    </div>`;
  show("modal-digi");
  try {
    await new Promise(r => setTimeout(r, 1800));
    const data = await apiPost("/onboarding/digilocker-mock", {});
    Object.assign(S.countryFields, data.fields);
    S.digiDone = true;
    $("modal-digi-body").innerHTML = `
      <div style="padding:16px;">
        <div style="font-size:2.5rem;margin-bottom:12px;">🔐</div>
        <div style="font-weight:700;font-size:1rem;margin-bottom:8px;color:var(--success);">DigiLocker Connected!</div>
        <div style="color:var(--text-muted);font-size:.85rem;">Fields pre-filled from your documents. You may review or skip any field below.</div>
        <button class="btn btn-success" style="margin-top:16px;" onclick="closeModal('modal-digi'); renderStep2()">Review Fields →</button>
      </div>`;
  } catch {
    hide("modal-digi");
    toast("DigiLocker connection failed. Please enter fields manually.", "error");
  }
}

function nextStep2() {
  S.obStep = 3;
  renderStep3();
}

// ═══════════════════════════════════════════════════════════════
// ONBOARDING — Step 3: Bank Connect
// ═══════════════════════════════════════════════════════════════

async function renderStep3() {
  renderObStepBar();
  $("ob-content").innerHTML = `<div class="loading-row"><div class="spinner"></div> Loading banks—¦</div>`;
  let banks = [];
  try {
    const countryParam = S.student.country || "default";
    const data = await apiGet(`/config/banks?country=${countryParam}`);
    banks = data.banks;
  } catch { banks = ["Generic Bank"]; }

  $("ob-content").innerHTML = `
    <div class="card">
      <h2>Connect Your Bank Account</h2>
      <p class="subtitle">
        A mocked bank-linking flow. This balance will be used by the AI to recommend an investment plan.
        No real account or credentials are accessed.
      </p>
      <div class="notice">
        <span class="n-icon">🔒</span>
        <p><strong>Demonstration only.</strong> This simulates a bank OAuth flow. No real financial data is read or stored.</p>
      </div>
      <div class="bank-list" id="bank-list">
        ${banks.map(b => `
          <button class="bank-btn ${S.selectedBank === b ? "selected" : ""}" onclick="selectBank('${b}')">
            <span class="bank-icon">🏦</span> ${b}
          </button>`).join("")}
      </div>
      <div id="bank-connected-wrap"></div>
      <div class="row">
        <button class="btn btn-outline" onclick="prevStep()">← Back</button>
        <button class="btn btn-primary" id="btn-connect-bank" onclick="connectBank()" ${!S.selectedBank ? "disabled" : ""}>
          🔗 Link Account
        </button>
        <button class="btn btn-success hidden" id="btn-finish-ob" onclick="finishOnboarding()">
          Go to Dashboard →
        </button>
      </div>
    </div>`;

  if (S.bankAccount) showBankConnected();
}

function selectBank(name) {
  S.selectedBank = name;
  document.querySelectorAll(".bank-btn").forEach(b => {
    b.classList.toggle("selected", b.textContent.trim() === name);
  });
  if ($("btn-connect-bank")) $("btn-connect-bank").disabled = false;
}

async function connectBank() {
  const btn = $("btn-connect-bank");
  btn.disabled = true;
  btn.innerHTML = `<div class="spinner"></div> Linking—¦`;
  try {
    const data = await apiPost("/onboarding/bank-connect", { bankName: S.selectedBank });
    S.bankAccount = data.bankAccount;
    showBankConnected();
    btn.classList.add("hidden");
    show("btn-finish-ob");
  } catch (err) {
    toast("Bank link failed: " + err.message, "error");
    btn.disabled = false;
    btn.textContent = "🔗 Link Account";
  }
}

function showBankConnected() {
  const b = S.bankAccount;
  $("bank-connected-wrap").innerHTML = `
    <div class="bank-connected mt-12">
      <div class="bc-name">✅ ${b.bankName}</div>
      <div class="bc-acct">Account: ${b.accountNumber}</div>
      <div class="bc-bal">${fmtCur(b.balance)}</div>
      <div style="font-size:.8rem;color:var(--success);margin-top:2px;">Available balance (mock)</div>
    </div>`;
}

async function finishOnboarding() {
  const btn = $("btn-finish-ob");
  btn.disabled = true;
  btn.innerHTML = `<div class="spinner"></div> Setting up—¦`;
  try {
    const data = await apiPost("/onboarding/profile", {
      studentName:    S.student.name,
      gpa:            S.student.gpa,
      fieldOfStudy:   S.student.fieldOfStudy,
      country:        S.student.country,
      gender:         S.student.gender,
      parentName:     S.parent.name,
      relationship:   S.parent.relationship,
      householdIncome: S.parent.income,
      countryFields:  S.countryFields,
    });
    S.profile  = data.profile;
    S.currency = CURRENCY_MAP[S.profile.country] || CURRENCY_MAP.default;

    // Set initials
    const initials = (S.profile.studentName || "?").split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase();
    if ($("avatar-initials")) $("avatar-initials").textContent = initials;

    // Set greeting details
    if ($("dash-greeting-name")) $("dash-greeting-name").textContent = `Welcome back, ${S.profile.studentName.split(' ')[0]}`;
    if ($("dash-greeting-sub")) $("dash-greeting-sub").textContent = `${S.profile.country} · ${S.profile.fieldOfStudy}`;

    hide("view-onboarding");
    show("view-dashboard");
    await loadScholarships();
  } catch (err) {
    toast("Setup failed: " + err.message, "error");
    btn.disabled = false;
    btn.textContent = "Go to Dashboard →";
  }
}

function prevStep() {
  // If Indian user is on Step 2 via DigiLocker, go back to choice screen
  if (S.obStep === 2 && S.student.country === "IN") {
    S.obStep = 0;
    renderStepChoice();
    return;
  }
  // If Indian user is on Step 1 (manual route), go back to choice screen
  if (S.obStep === 1 && S.student.country === "IN") {
    S.obStep = 0;
    renderStepChoice();
    return;
  }
  S.obStep = Math.max(0, S.obStep - 1);
  [renderStep0, renderStep1, renderStep2, renderStep3][S.obStep]();
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD — Tab switching
// ═══════════════════════════════════════════════════════════════

function switchTab(tab) {
  S.tab = tab;
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  $(`tab-btn-${tab}`).classList.add("active");
  document.querySelectorAll(".tab-pane").forEach(p => p.classList.add("hidden"));
  $(`tab-${tab}`).classList.remove("hidden");
  if (tab === "investing") renderInvestingTab();
}

function updatePoolBadge() {
  const badge = $("pool-badge");
  if (!badge) return;
  if (S.pool.balance > 0) {
    badge.textContent = `💰 Pool: ${fmtCur(S.pool.balance)}`;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}

// ═══════════════════════════════════════════════════════════════
// SCHOLARSHIPS TAB
// ═══════════════════════════════════════════════════════════════

async function loadScholarships() {
  $("tab-scholarships").innerHTML = `<div class="loading-row"><div class="spinner"></div> Searching scholarships—¦</div>`;
  try {
    const data = await apiPost("/scholarships/search", { profile: S.profile });
    S.scholarships = data.scholarships;
    S.applications = [];
    renderScholarshipsTab();
  } catch (err) {
    $("tab-scholarships").innerHTML = `<div class="empty-state"><div class="e-icon">⚠️</div><p>${err}</p></div>`;
    return;
  }
}

function renderScholarshipsTab() {
  const eligible   = S.scholarships.filter(s => s.eligibility.eligible);
  const ineligible = S.scholarships.filter(s => !s.eligibility.eligible);

  const totalAward = eligible.reduce((sum, sch) => sum + sch.amount, 0);
  const topAward = eligible.length > 0 ? Math.max(...eligible.map(s => s.amount)) : 0;

  let html = `
    <div class="stats-bar">
      <div class="stat-card">
        <div class="stat-label">Eligible Grants</div>
        <div class="stat-value">${eligible.length}</div>
        <div class="stat-sub">of ${S.scholarships.length} total matched</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Top Award</div>
        <div class="stat-value">${fmtCur(topAward)}</div>
        <div class="stat-sub">highest value opportunity</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Available</div>
        <div class="stat-value">${fmtCur(totalAward)}</div>
        <div class="stat-sub">across all eligible options</div>
      </div>
    </div>
    <div class="notice">
      <span class="n-icon"></span>
      <p>The agent has ranked scholarships by value score (award ÷ effort). <strong>Apply and Cancel buttons only take effect after your explicit confirmation</strong> — the agent never submits anything on your behalf.</p>
    </div>
    <div class="sch-section-label">RECOMMENDED GRANTS</div>`;

  if (eligible.length === 0) {
    html += `<div class="empty-state"><div class="e-icon">😔</div><p>No eligible scholarships found for your current profile.</p></div>`;
  } else {
    eligible.forEach(sch => { html += buildScholarshipCard(sch, true); });
  }

  if (ineligible.length > 0) {
    html += `
      <details class="ineligible-section">
        <summary class="ineligible-summary">Not currently eligible (${ineligible.length}) — click to expand</summary>
        <div class="ineligible-body">`;
    ineligible.forEach(sch => { html += buildScholarshipCard(sch, false); });
    html += `</div></details>`;
  }

  $("tab-scholarships").innerHTML = html;
}

function buildScholarshipCard(sch, isEligible) {
  const ui  = S.cardUI[sch.id] || { state: "default", checkedSteps: new Set() };
  const app = S.applications.find(a => a.scholarshipId === sch.id);

  const statusBadge = app ? `<span class="badge badge-status-${app.status.toLowerCase()}">${
    app.status === "Pending" ? "⏳ Pending" : app.status === "Accepted" ? "✅ Accepted" : "❌ Rejected"
  }</span>` : "";

  let cardClass = "sch-card";
  if (!isEligible) cardClass += " ineligible";
  if (ui.state === "cancelled") cardClass += " cancelled";

  // Step progress bar — only shown when the user is actively in the apply flow
  const inFlow = isEligible && !app && (ui.state === "checklist" || ui.state === "allocation");
  const stepBar = inFlow ? `
    <div class="sch-flow-steps">
      <div class="sch-flow-step ${ui.state === 'checklist' ? 'active' : 'done'}">
        <div class="sch-flow-dot">${ui.state === 'checklist' ? '1' : '✓'}</div>
        <div class="sch-flow-label">Checklist</div>
      </div>
      <div class="sch-flow-connector ${ui.state === 'allocation' ? 'done' : ''}"></div>
      <div class="sch-flow-step ${ui.state === 'allocation' ? 'active' : ''}">
        <div class="sch-flow-dot">2</div>
        <div class="sch-flow-label">Allocation</div>
      </div>
      <div class="sch-flow-connector"></div>
      <div class="sch-flow-step">
        <div class="sch-flow-dot">3</div>
        <div class="sch-flow-label">Submit</div>
      </div>
    </div>` : "";

  // Default state: only show Apply. No Cancel — there is nothing to cancel yet.
  let actionsHtml = "";
  if (!app && isEligible) {
    if (ui.state === "default") {
      actionsHtml = `
        <div class="sch-actions">
          <button class="btn btn-success btn-sm" onclick="handleApply('${sch.id}')">Apply for this grant →</button>
        </div>`;
    }
  }

  // Checklist expansion — shown during step 1 (checklist) and step 2 (allocation)
  let checklistHtml = "";
  if (!app && (ui.state === "checklist" || ui.state === "allocation")) {
    const steps = ui.steps || [];
    const allChecked = steps.length > 0 && steps.every((_, i) => ui.checkedSteps.has(i));
    checklistHtml = `
      <div class="checklist-section" id="cl-${sch.id}">
        <p class="checklist-note">Confirm each step is completed. All must be checked before moving on.</p>
        ${steps.map((step, i) => `
          <div class="step-item ${ui.checkedSteps.has(i) ? "checked" : ""}" id="step-${sch.id}-${i}">
            <input type="checkbox" id="cb-${sch.id}-${i}" ${ui.checkedSteps.has(i) ? "checked" : ""} onchange="toggleStep('${sch.id}', ${i})" />
            <label for="cb-${sch.id}-${i}">${step}</label>
          </div>`).join("")}
        ${ui.state === "allocation" ? buildAllocationForm(sch) : `
          <div class="row">
            <button class="btn btn-outline btn-sm" onclick="handleCancel('${sch.id}')">✕ Cancel</button>
            <button class="btn btn-primary" id="btn-confirm-${sch.id}" ${allChecked ? "" : "disabled"} onclick="handleConfirmApplication('${sch.id}')">
              Next: Set Award Allocation →
            </button>
          </div>`}
      </div>`;
  }

  // Cancelled state — offer to restart
  if (!app && ui.state === "cancelled") {
    actionsHtml = `
      <div class="sch-actions">
        <span class="cancelled-label">✕ Skipped</span>
        <button class="btn btn-outline btn-sm" onclick="handleApply('${sch.id}')">Apply after all →</button>
      </div>`;
  }

  // Status section for submitted apps
  let statusHtml = "";
  if (app) {
    statusHtml = buildStatusSection(app, sch);
    // Only show "Apply Again" for Pending (so family can resubmit if they want)
    actionsHtml = app.status === "Pending" ? `
      <div class="sch-actions">
        <button class="btn btn-outline btn-sm" onclick="handleApply('${sch.id}')">Apply Again</button>
      </div>` : "";
  }

  return `
    <div class="${cardClass}" id="card-${sch.id}">
      ${stepBar}
      <div class="sch-header">
        <div class="sch-name">${sch.name}</div>
        <div class="sch-amount">${fmtCur(sch.amount)}</div>
      </div>
      <div class="sch-meta">
        <span class="badge ${isEligible ? "badge-eligible" : "badge-ineligible"}">${isEligible ? "✓ Eligible" : "✕ Not Eligible"}</span>
        <span class="badge badge-effort-${sch.effort}">${sch.effort[0].toUpperCase() + sch.effort.slice(1)} effort</span>
        <span class="badge badge-deadline">⏰ ${fmtDate(sch.deadline)}</span>
        ${statusBadge}
      </div>
      <div class="pros-cons">
        <div class="pcon-col pros"><h4>Advantages</h4><ul>${sch.pros.map(p => `<li>${p}</li>`).join("")}</ul></div>
        <div class="pcon-col cons"><h4>Disadvantages</h4><ul>${sch.cons.map(c => `<li>${c}</li>`).join("")}</ul></div>
      </div>
      <button class="elig-toggle" onclick="toggleElig('${sch.id}')">▶ Show eligibility detail</button>
      <ul class="elig-list" id="elig-${sch.id}">
        ${sch.eligibility.reasons.map(r => `<li class="${r.startsWith("PASS") ? "pass" : "fail"}">${r}</li>`).join("")}
      </ul>
      ${actionsHtml}
      ${checklistHtml}
      ${statusHtml}
    </div>`;
}

function buildAllocationForm(sch) {
  return `
    <div class="alloc-section" id="alloc-${sch.id}">
      <h4>Allocation of ${fmtCur(sch.amount)} Award</h4>
      <p class="alloc-note">Decide how to split the award if received. The three percentages must sum to 100. "To Invest" may be 0 to skip investing.</p>
      <div class="alloc-row">
        <div class="field">
          <label>Loan Repayment (%)</label>
          <input type="number" id="al-loan-${sch.id}" min="0" max="100" value="40" oninput="updateAllocTotal('${sch.id}')" />
        </div>
        <div class="field">
          <label>Emergency Buffer (%)</label>
          <input type="number" id="al-buf-${sch.id}" min="0" max="100" value="60" oninput="updateAllocTotal('${sch.id}')" />
        </div>
        <div class="field">
          <label>To Invest (%) <span class="note">optional</span></label>
          <input type="number" id="al-inv-${sch.id}" min="0" max="100" value="0" oninput="updateAllocTotal('${sch.id}')" />
        </div>
      </div>
      <div id="alloc-total-${sch.id}" class="alloc-total">Total: 100%</div>
      <div class="confirm-gate" style="margin-top:14px;">
        <span class="gate-icon">🔒</span>
        <div>
          <p><strong>Human confirmation required.</strong> Clicking Submit finalises the application. The agent has not submitted anything yet.</p>
          <div class="row">
            <button class="btn btn-outline btn-sm" onclick="handleCancel('${sch.id}')">✕ Cancel</button>
            <button class="btn btn-success" id="btn-submit-alloc-${sch.id}" onclick="submitApplication('${sch.id}')">Submit Application →</button>
          </div>
        </div>
      </div>
    </div>`;
}

function updateAllocTotal(schId) {
  const loan = parseFloat($(`al-loan-${schId}`)?.value || 0);
  const buf  = parseFloat($(`al-buf-${schId}`)?.value  || 0);
  const inv  = parseFloat($(`al-inv-${schId}`)?.value  || 0);
  const total = loan + buf + inv;
  const el = $(`alloc-total-${schId}`);
  if (!el) return;
  el.textContent = `Total: ${total}%`;
  el.style.color = Math.round(total) === 100 ? "var(--success)" : "var(--danger)";
  const btn = $(`btn-submit-alloc-${schId}`);
  if (btn) btn.disabled = Math.round(total) !== 100;
}

function buildStatusSection(app, sch) {
  let html = `<div class="status-section">`;
  if (app.status === "Pending") {
    html += `<p style="font-size:.85rem;color:var(--warn);font-weight:600;">⏳ Application submitted — awaiting board decision</p>`;
    if (app.allocation) {
      html += `<p style="font-size:.8rem;color:var(--text-muted);margin-top:4px;">
        Allocation: ${app.allocation.breakdown.loanPct}% loan · ${app.allocation.breakdown.bufferPct}% buffer · ${app.allocation.breakdown.investPct}% invest</p>`;
    }
    html += `
      <div class="demo-controls">
        <div class="demo-label">⚠️ Demo: Simulate scholarship board decision</div>
        <div class="demo-desc">These controls are for demonstration only — they are not part of the normal user flow.</div>
        <div class="demo-btns">
          <button class="btn btn-success btn-sm" onclick="simulateApp('${app.id}', 'accept')">🎉 Simulate: Received</button>
          <button class="btn btn-danger-outline btn-sm" onclick="simulateApp('${app.id}', 'reject')">✕ Simulate: Rejected</button>
        </div>
      </div>`;
  } else if (app.status === "Accepted") {
    html += `<p class="accepted-info">✅ Scholarship awarded!</p>`;
    if (app.allocation && app.allocation.toInvest > 0) {
      html += `<p style="font-size:.82rem;color:var(--text-muted);margin-top:4px;">${fmtCur(app.allocation.toInvest)} (${app.allocation.breakdown.investPct}%) added to your Investment Pool.</p>`;
    }
  } else if (app.status === "Rejected") {
    html += `<p class="rejected-info">❌ Application not selected this cycle.</p>`;
    if (app.simulationReason) {
      html += `<p style="font-size:.82rem;color:var(--text-muted);margin-top:4px;font-style:italic;">Reason (example): "${app.simulationReason}"</p>`;
    }
  }
  html += `</div>`;
  return html;
}

function toggleElig(schId) {
  const el = $(`elig-${schId}`);
  if (!el) return;
  el.classList.toggle("open");
  const btn = el.previousElementSibling;
  if (btn) btn.textContent = el.classList.contains("open") ? "▼ Hide eligibility rule trace" : "▶ Show eligibility rule trace";
}

async function handleApply(schId) {
  // Load steps from backend
  const steps = await (async () => {
    try { return (await apiGet(`/scholarships/${schId}/steps`)).steps; } catch { return []; }
  })();
  S.cardUI[schId] = { state: "checklist", checkedSteps: new Set(), steps };
  await logDecision("scholarship-apply-intent", `Agent provided ${steps.length} application steps for "${schId}"`, "Family clicked Apply");
  renderScholarshipsTab();
}

function handleCancel(schId) {
  S.cardUI[schId] = { state: "cancelled", checkedSteps: new Set() };
  logDecision("scholarship-cancel", null, `Family cancelled / opted out of "${schId}"`);
  renderScholarshipsTab();
}

function toggleStep(schId, idx) {
  const ui = S.cardUI[schId];
  if (!ui) return;
  ui.checkedSteps.has(idx) ? ui.checkedSteps.delete(idx) : ui.checkedSteps.add(idx);
  const allChecked = ui.steps.length > 0 && ui.steps.every((_, i) => ui.checkedSteps.has(i));
  const btn = $(`btn-confirm-${schId}`);
  if (btn) btn.disabled = !allChecked;
  const item = $(`step-${schId}-${idx}`);
  if (item) item.classList.toggle("checked", ui.checkedSteps.has(idx));
}

async function handleConfirmApplication(schId) {
  await logDecision(
    "checklist-confirm",
    "Agent provided ordered application steps",
    `Family confirmed all checklist steps for "${schId}" — moving to allocation`
  );
  S.cardUI[schId].state = "allocation";
  renderScholarshipsTab();
  // Trigger total calculation with defaults
  setTimeout(() => updateAllocTotal(schId), 50);
}

async function submitApplication(schId) {
  const sch  = S.scholarships.find(s => s.id === schId);
  const loan = parseFloat($(`al-loan-${schId}`)?.value || 0);
  const buf  = parseFloat($(`al-buf-${schId}`)?.value  || 0);
  let inv    = parseFloat($(`al-inv-${schId}`)?.value  || 0);
  if (Math.round(loan + buf + inv) !== 100) { toast("Percentages must sum to 100.", "error"); return; }

  const btn = $(`btn-submit-alloc-${schId}`);
  if (btn) { btn.disabled = true; btn.innerHTML = `<div class="spinner"></div> Submitting—¦`; }

  try {
    const data = await apiPost("/applications", {
      scholarshipId: schId,
      confirmed: true,        // set only by this explicit button click
      loanPct: loan,
      bufferPct: buf,
      investPct: inv,
    });
    S.applications.push(data.application);
    S.cardUI[schId] = { state: "default", checkedSteps: new Set() };
    toast(`Application for "${sch?.name}" submitted.`, "success");
    renderScholarshipsTab();
  } catch (err) {
    toast("Submission failed: " + err.message, "error");
    if (btn) { btn.disabled = false; btn.textContent = "Submit Application →"; }
  }
}

async function simulateApp(appId, action) {
  try {
    const data = await apiPost(`/applications/${appId}/simulate`, { action });
    const idx = S.applications.findIndex(a => a.id === appId);
    if (idx >= 0) S.applications[idx] = data.application;
    if (data.poolBalance !== undefined) {
      S.pool.balance = data.poolBalance;
      updatePoolBadge();
    }
    renderScholarshipsTab();
    if (action === "accept") toast("🎉 Scholarship accepted! Pool updated.", "success");
    else toast("Application marked as rejected.", "");
  } catch (err) {
    toast("Simulation failed: " + err.message, "error");
  }
}

// ═══════════════════════════════════════════════════════════════
// INVESTING TAB
// ═══════════════════════════════════════════════════════════════

function renderInvestingTab() {
  // Preserve typed amount across re-renders
  const displayAmount = S.invAmount !== undefined ? S.invAmount : S.pool.balance;

  const poolHtml = S.pool.balance === 0 ? `
    <div class="pool-section">
      <div>
        <div class="pool-label">Investment Pool</div>
        <div class="pool-value" style="-webkit-text-fill-color:var(--text-muted);color:var(--text-muted);font-size:1.5rem;">₹0</div>
        <div class="pool-zero">Your pool fills automatically when a scholarship award with an "Invest %" is accepted.</div>
      </div>
      <button class="btn btn-primary" onclick="switchTab('scholarships')">Go to Scholarships →</button>
    </div>` : `
    <div class="pool-section">
      <div>
        <div class="pool-label">Investment Pool Balance</div>
        <div class="pool-value" id="pool-display">${fmtCur(S.pool.balance)}</div>
      </div>
      <button class="btn btn-outline" onclick="openPoolEdit()">✏️ Adjust</button>
    </div>`;

  const filterHtml = `
    <div class="filter-section">
      <h3>Step 1 — Choose your preferences</h3>
      <div class="field" style="max-width:300px;margin-bottom:20px;">
        <label>Amount to Invest</label>
        <input type="number" id="inv-amount" value="${displayAmount}" min="0"
          oninput="S.invAmount=parseFloat(this.value)||0" />
      </div>
      <label style="font-size:.82rem;font-weight:700;display:block;margin-bottom:8px;">Risk Appetite</label>
      <div class="pill-group">
        ${[["low","🟢 Low — steady & safe"],["moderate","🟡 Moderate — balanced"],["high","🔴 High — max growth"]].map(([v, l]) =>
          `<button class="pill ${S.riskCategory === v ? "selected" : ""}" onclick="selectRisk('${v}')">${l}</button>`
        ).join("")}
      </div>
      <label style="font-size:.82rem;font-weight:700;display:block;margin-bottom:8px;margin-top:4px;">Investment Horizon</label>
      <div class="pill-group">
        ${[["short","⚡ Short — under 1 year"],["medium","📅 Medium — 1 to 3 years"],["long","🌱 Long — 3 years+"]].map(([v, l]) =>
          `<button class="pill ${S.duration === v ? "selected" : ""}" onclick="selectDuration('${v}')">${l}</button>`
        ).join("")}
      </div>
      <button class="btn btn-primary btn-block" onclick="filterInvestments()"
        ${!S.riskCategory || !S.duration ? "disabled" : ""} id="btn-filter">
        Find Matching Plans →
      </button>
    </div>`;

  $("tab-investing").innerHTML = poolHtml + filterHtml + `<div id="invest-results"></div>`;
}

function selectRisk(v) {
  S.invAmount = parseFloat($("inv-amount")?.value) || S.invAmount || S.pool.balance;
  S.riskCategory = v;
  S.filtered = []; S.aiRec = null; S.selectedPlan = null;
  renderInvestingTab();
}

function selectDuration(v) {
  S.invAmount = parseFloat($("inv-amount")?.value) || S.invAmount || S.pool.balance;
  S.duration = v;
  S.filtered = []; S.aiRec = null; S.selectedPlan = null;
  renderInvestingTab();
}

async function filterInvestments() {
  const amount = parseFloat($("inv-amount")?.value || S.pool.balance);
  S.invAmount = amount; // persist
  if (!S.riskCategory || !S.duration) { toast("Choose a risk appetite and investment horizon first.", "error"); return; }
  const btn = $("btn-filter");
  if (btn) { btn.disabled = true; btn.innerHTML = `<div class="spinner"></div> Searching…`; }
  try {
    const data = await apiPost("/investments/filter", { investAmount: amount, riskCategory: S.riskCategory, duration: S.duration });
    S.filtered = data.investments;
    S.aiRec = null; S.selectedPlan = null;
    renderInvestResults();
  } catch (err) {
    toast("Filter failed: " + err.message, "error");
  } finally {
    const b = $("btn-filter");
    if (b) { b.disabled = false; b.innerHTML = "Find Matching Plans →"; }
  }
}

function renderInvestResults() {
  const el = $("invest-results");
  if (!el) return;
  if (S.filtered.length === 0) {
    el.innerHTML = `<div class="empty-state"><div class="e-icon">🔍</div><p>No plans matched. Try adjusting your risk or horizon preferences above.</p></div>`;
    return;
  }

  let html = `<div>`;

  // AI recommendation card (pinned at top when available)
  if (S.aiRec) {
    const recPlan = S.filtered.find(i => i.id === S.aiRec.recommendedId);
    if (recPlan) {
      html += `
        <div class="inv-card ai-pick" id="inv-card-${recPlan.id}">
          <div class="ai-badge"> AI Recommendation</div>
          ${buildInvCardInner(recPlan)}
          <div class="ai-reasoning">"${S.aiRec.reasoning}"</div>
          <div class="ai-source">${S.aiRec.source === "llm-groq" ? "Groq LLM — live AI call" : "Template — no LLM called"}</div>
          <button class="btn btn-success btn-sm" onclick="selectPlan('${recPlan.id}', true)">Invest in AI Pick →</button>
        </div>
        <div class="divider"></div>
        <div style="font-size:.82rem;font-weight:600;color:var(--text-muted);margin-bottom:10px;">Or choose manually from all matching plans:</div>`;
    }
  }

  // Section header + AI nudge
  html += `
    <div class="section-hdr" style="margin-bottom:14px;">
      <div class="section-title">Step 2 — Pick a plan <span style="font-size:.8rem;color:var(--text-muted);font-weight:500;">(${S.filtered.length} matching)</span></div>
      ${!S.aiRec ? `<button class="btn btn-outline btn-sm" onclick="askAI()" id="btn-ai"> Let AI recommend</button>` : ""}
    </div>`;

  S.filtered.forEach(inv => {
    html += `
      <div class="inv-card" id="inv-card-${inv.id}">
        ${buildInvCardInner(inv)}
        <div class="fit-note">${inv.fitNote}</div>
        <button class="btn btn-primary btn-sm" onclick="selectPlan('${inv.id}', false)">Select &amp; Confirm →</button>
      </div>`;
  });

  html += `</div>`;
  el.innerHTML = html;
}

function buildInvCardInner(inv) {
  const amount = parseFloat($("inv-amount")?.value || S.pool.balance);
  const expectedReturnAmount = amount * (inv.typicalAnnualReturnPct / 100);
  return `
    <div class="inv-header">
      <div class="inv-name">${inv.name}</div>
      <div style="text-align:right;">
        <div class="inv-return">+${fmtCur(expectedReturnAmount)}</div>
        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; margin-top:2px;">${inv.typicalAnnualReturnPct}% projected</div>
      </div>
    </div>
    <div class="inv-meta">
      <span class="badge badge-type">${inv.type}</span>
      <span class="badge badge-risk-${inv.riskCategory}">${inv.riskCategory.charAt(0).toUpperCase() + inv.riskCategory.slice(1)} risk</span>
      ${inv.lockInMonths > 0 ? `<span class="badge badge-deadline">🔒 ${inv.lockInMonths}m lock-in</span>` : `<span class="badge badge-eligible">No lock-in</span>`}
      <span class="badge badge-deadline">Min ${fmtCur(inv.minAmount)}</span>
    </div>
    <div class="pros-cons">
      <div class="pcon-col pros"><h4>Advantages</h4><ul>${inv.pros.map(p => `<li>${p}</li>`).join("")}</ul></div>
      <div class="pcon-col cons"><h4>Disadvantages</h4><ul>${inv.cons.map(c => `<li>${c}</li>`).join("")}</ul></div>
    </div>`;
}

async function askAI() {
  const btn = $("btn-ai");
  if (btn) { btn.disabled = true; btn.innerHTML = `<div class="spinner"></div> Asking AI—¦`; }
  const amount = parseFloat($("inv-amount")?.value || S.pool.balance);
  try {
    const rec = await apiPost("/investments/recommend", {
      filteredOptions: S.filtered,
      bankBalance:     S.bankAccount?.balance || 0,
      investAmount:    amount,
    });
    S.aiRec = rec;
    renderInvestResults();
  } catch (err) {
    toast("AI recommendation failed: " + err.message, "error");
  } finally {
    if ($("btn-ai")) { $("btn-ai").disabled = false; $("btn-ai").textContent = " Ask AI for Recommendation"; }
  }
}

function selectPlan(planId, followedAI) {
  // Show "Are you sure?" confirmation modal before selecting
  const plan = S.filtered.find(i => i.id === planId);
  const amount = parseFloat($("inv-amount")?.value || S.pool.balance);
  if (!plan) return;

  const expectedReturn = amount * (plan.typicalAnnualReturnPct / 100);

  $("modal-invest-confirm-body").innerHTML = `
    <div class="invest-confirm-summary">
      <div class="invest-confirm-plan-name">${plan.name}</div>
      <div class="invest-confirm-rows">
        <div class="invest-confirm-row">
          <span class="invest-confirm-label">Amount to invest</span>
          <span class="invest-confirm-value">${fmtCur(amount)}</span>
        </div>
        <div class="invest-confirm-row">
          <span class="invest-confirm-label">Expected annual return</span>
          <span class="invest-confirm-value text-success">+${fmtCur(expectedReturn)} (${plan.typicalAnnualReturnPct}%)</span>
        </div>
        <div class="invest-confirm-row">
          <span class="invest-confirm-label">Risk level</span>
          <span class="invest-confirm-value">${plan.riskCategory.charAt(0).toUpperCase() + plan.riskCategory.slice(1)}</span>
        </div>
        ${plan.lockInMonths > 0 ? `<div class="invest-confirm-row">
          <span class="invest-confirm-label">Lock-in period</span>
          <span class="invest-confirm-value">${plan.lockInMonths} months</span>
        </div>` : ''}
      </div>
      <div class="invest-confirm-notice">
        <span>🏦</span>
        <span>A reminder will be sent to your connected bank when you confirm this plan.</span>
      </div>
    </div>
  `;

  // Store pending selection
  S._pendingPlanId = planId;
  S._pendingFollowedAI = followedAI;
  show("modal-invest-confirm");
}

async function confirmAndInvest() {
  const planId = S._pendingPlanId;
  const followedAI = S._pendingFollowedAI;
  if (!planId) return;

  const btn = $("btn-invest-confirm-ok");
  if (btn) { btn.disabled = true; btn.innerHTML = `<div class="spinner"></div> Processing…`; }

  // Step 1: notify bank (non-blocking)
  try {
    await sendBankReminder(planId);
  } catch (e) {
    // non-blocking — proceed regardless
  }

  // Step 2: set plan and execute investment directly
  S.selectedPlan = planId;
  S._followedAI  = followedAI;
  S._pendingPlanId = null;
  S._pendingFollowedAI = null;

  closeModal("modal-invest-confirm");
  if (btn) { btn.disabled = false; btn.innerHTML = "✓ Confirm &amp; Invest Now →"; }

  await executeInvestment();
}

async function sendBankReminder(planId) {
  const plan = S.filtered.find(i => i.id === planId);
  const amount = parseFloat($("inv-amount")?.value || S.pool.balance);
  await apiPost("/investments/notify-bank", {
    planId,
    planName: plan?.name,
    amount,
    bankAccountId: S.bankAccount?.id || null,
    studentName: S.profile?.studentName || "Student",
  });
}

async function executeInvestment() {
  const amount = parseFloat($("inv-amount")?.value || S.pool.balance);
  try {
    const data = await apiPost("/investments/execute", {
      planId:     S.selectedPlan,
      amount,
      followedAI: !!S._followedAI,
      confirmed:  true,           // set only by this explicit button click
    });
    S.pool.balance = data.poolBalance;
    updatePoolBadge();
    const plan = S.filtered.find(i => i.id === S.selectedPlan);
    toast(`✅ Invested ${fmtCur(amount)} in "${plan?.name}"`, "success");
    S.filtered = []; S.aiRec = null; S.selectedPlan = null; S.riskCategory = null; S.duration = null;
    renderInvestingTab();
  } catch (err) {
    toast("Investment failed: " + err.message, "error");
  }
}

// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════
// POOL EDIT MODAL
// ═══════════════════════════════════════════════════════

function openPoolEdit() {
  const current = S.pool.balance;
  const sym = S.currency?.symbol || '₹';
  const removed20 = Math.round(current * 0.2);
  const split10   = Math.round(current * 0.1);
  $("modal-pool-body").innerHTML = `
    <div class="notice">
      <span class="n-icon">🔒</span>
      <p>You can only <strong>decrease</strong> the pool balance. The pool increases automatically when a scholarship is accepted. Allocate the removed amount between Loan Repayment and Emergency Buffer (any remainder stays in general savings).</p>
    </div>
    <div class="field" style="margin-bottom:12px;">
      <label>Current Balance</label>
      <div style="font-size:1.3rem;font-weight:700;color:var(--brand);">${fmtCur(current)}</div>
    </div>
    <div class="field">
      <label>New Balance (must be lower)</label>
      <input type="number" id="pool-new-bal" min="0" max="${current - 1}" value="${Math.round(current * 0.8)}" oninput="updatePoolSplit()" />
    </div>
    <div class="removed-amount-box" id="removed-amount-box">
      Removed amount: <strong id="removed-amt-disp">${fmtCur(removed20)}</strong>
    </div>
    <p style="font-size:.82rem;font-weight:600;margin-bottom:8px;">Allocate from removed amount (${sym}):</p>
    <div class="split-row">
      <div class="field">
        <label>Loan Repayment (${sym})</label>
        <input type="number" id="pool-loan-split" min="0" value="${split10}" oninput="updatePoolSplitTotal()" />
      </div>
      <div class="field">
        <label>Emergency Buffer (${sym})</label>
        <input type="number" id="pool-buf-split" min="0" value="${split10}" oninput="updatePoolSplitTotal()" />
      </div>
    </div>
    <div id="pool-split-total" class="split-total">Split total: ${fmtCur(removed20)} of ${fmtCur(removed20)} removed</div>`;
  show("modal-pool-edit");
  updatePoolSplit();
}

function updatePoolSplit() {
  const current = S.pool.balance;
  const newBal  = parseFloat($("pool-new-bal")?.value ?? current);
  const removed = Math.max(0, Math.round(current - newBal));
  if ($("removed-amt-disp")) $("removed-amt-disp").textContent = fmtCur(removed);

  // Auto-redistribute split inputs proportionally when new-balance changes
  const half = Math.floor(removed / 2);
  if ($("pool-loan-split")) $("pool-loan-split").value = half;
  if ($("pool-buf-split"))  $("pool-buf-split").value  = removed - half; // handles odd amounts

  updatePoolSplitTotal();
}

function updatePoolSplitTotal() {
  const current = S.pool.balance;
  const newBal  = parseFloat($("pool-new-bal")?.value ?? current);
  const removed = Math.max(0, Math.round(current - newBal));
  const loan    = parseFloat($("pool-loan-split")?.value || 0);
  const buf     = parseFloat($("pool-buf-split")?.value  || 0);
  const splitTotal = Math.round(loan + buf);
  const el = $("pool-split-total");
  if (el) {
    const leftover = removed - splitTotal;
    const leftoverTxt = leftover > 0 ? ` (${fmtCur(leftover)} goes to savings)` : "";
    el.textContent = `Split total: ${fmtCur(splitTotal)} of ${fmtCur(removed)} removed${leftoverTxt}`;
    el.style.color = splitTotal > removed ? "var(--danger)" : "var(--success)";
  }
  const btn = $("pool-edit-confirm-btn");
  // Allow submit if split ≤ removed AND new balance is strictly less than current
  if (btn) btn.disabled = (splitTotal > removed) || (newBal >= current) || (newBal < 0);
}

async function submitPoolEdit() {
  const newBal = parseFloat($("pool-new-bal")?.value || 0);
  const loan   = parseFloat($("pool-loan-split")?.value || 0);
  const buf    = parseFloat($("pool-buf-split")?.value  || 0);
  const btn    = $("pool-edit-confirm-btn");
  if (btn) { btn.disabled = true; btn.innerHTML = `<div class="spinner"></div>`; }
  try {
    const data = await apiPost("/pool/edit", { newBalance: newBal, loanSplit: loan, bufferSplit: buf });
    S.pool.balance = data.balance;
    updatePoolBadge();
    closeModal("modal-pool-edit");
    toast("Pool balance updated.", "success");
    renderInvestingTab();
  } catch (err) {
    toast("Edit failed: " + err.message, "error");
    if (btn) { btn.disabled = false; btn.textContent = "Confirm Edit"; }
  }
}

// ═══════════════════════════════════════════════════════
// DECISION LOG MODAL
// ═══════════════════════════════════════════════════════

async function showDecisionLog() {
  $("modal-log-body").innerHTML = `<div class="loading-row"><div class="spinner"></div> Loading—¦</div>`;
  show("modal-log");
  try {
    const data = await apiGet("/decisions");
    const log  = data.log || [];
    if (log.length === 0) {
      $("modal-log-body").innerHTML = `<div class="empty-state"><div class="e-icon">📋</div><p>No decisions logged yet.</p></div>`;
      return;
    }
    $("modal-log-body").innerHTML = `
      <div class="log-table-wrap">
        <table>
          <thead><tr>
            <th>#</th><th>Stage</th><th>AI Suggested</th><th>Family Chose</th><th>Time</th>
          </tr></thead>
          <tbody>
            ${log.map((e, i) => `<tr>
              <td>${log.length - i}</td>
              <td class="td-stage">${e.stage}</td>
              <td class="td-ai">${e.aiSuggested || "—"}</td>
              <td class="td-fam">${e.familyChose || "—"}</td>
              <td class="td-time">${fmtTime(e.timestamp)}</td>
            </tr>`).reverse().join("")}
          </tbody>
        </table>
      </div>`;
  } catch {
    $("modal-log-body").innerHTML = `<div class="empty-state"><p>Could not load log.</p></div>`;
  }
}

// ═══════════════════════════════════════════════════════════════
// MODALS HELPER
// ═══════════════════════════════════════════════════════════════

function closeModal(id) { hide(id); }

// Close modals on overlay click
document.querySelectorAll(".modal-overlay").forEach(overlay => {
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// ═══════════════════════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════════════════════

(async function init() {
  // Start the intro animation
  const sfw = document.getElementById("split-flap-wrapper");
  if (sfw) {
    new SplitFlapText("split-flap", {
      words: ['         ', 'FUND PATH'],
      loop: false,
      cycleDelay: 200,
      onComplete: () => {
        sfw.classList.add("hidden");
        setTimeout(() => sfw.remove(), 1000);
      }
    });
  }

  // Check if profile already exists (e.g. server still hot)
  try {
    const data = await apiGet("/profile");
    S.profile     = data.profile;
    S.bankAccount = data.bankAccount;
    S.currency    = data.currency || CURRENCY_MAP[data.profile.country] || CURRENCY_MAP.default;
    // Reload pool
    const pool = await apiGet("/pool").catch(() => ({ balance: 0 }));
    S.pool.balance = pool.balance;
    updatePoolBadge();

    // Set initials
    const initials = (S.profile.studentName || "?").split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase();
    if ($("avatar-initials")) $("avatar-initials").textContent = initials;

    hide("view-onboarding");
    show("view-dashboard");
    await loadScholarships();
  } catch {
    // No profile yet — show onboarding
    renderStep0();
  }
})();

// ---------------------------------------------------------------
// SETTINGS / ACCOUNT DRAWER
// ---------------------------------------------------------------

async function openSettings() {
  if (!S.profile) return;
  
  const initials = (S.profile.studentName || "?").split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase();
  if ($("sp-avatar-lg")) $("sp-avatar-lg").textContent = initials;
  if ($("sp-user-name")) $("sp-user-name").textContent = S.profile.studentName;
  if ($("sp-user-sub")) $("sp-user-sub").textContent = S.profile.fieldOfStudy + " · " + (S.profile.location || "");

  show("settings-overlay");
  $("sp-body").innerHTML = `<div class="loading-row" style="padding-left:24px;"><div class="spinner"></div> Loading settings·</div>`;

  let stats = {};
  try {
    stats = await apiGet("/stats");
  } catch {}

  $("sp-body").innerHTML = `
    <div class="sp-section">
      <h3>1. Profile (View Only)</h3>
      <div class="sp-data-row"><div class="sp-data-label">GPA</div><div class="sp-data-val">${S.profile.gpa || "·"}</div></div>
      <div class="sp-data-row"><div class="sp-data-label">Household Income</div><div class="sp-data-val">${S.profile.householdIncome ? fmtCur(S.profile.householdIncome) : "·"}</div></div>
      <div class="sp-data-row"><div class="sp-data-label">Parent / Guardian</div><div class="sp-data-val">${S.profile.parentName || "·"}</div></div>
    </div>
    
    <div class="sp-section">
      <h3>2. Eligibility Fields</h3>
      ${Object.keys(S.profile.countryFields || {}).map(k => {
        const val = S.profile.countryFields[k];
        if (val === "__skipped__") return `<div class="sp-data-row"><div class="sp-data-label">${k}</div><div class="sp-data-val text-muted">Skipped</div></div>`;
        return `<div class="sp-data-row"><div class="sp-data-label">${k}</div><div class="sp-data-val">${val}</div></div>`;
      }).join("") || `<div class="text-muted" style="font-size:.85rem;">No country-specific fields provided.</div>`}
    </div>

    <div class="sp-section">
      <h3>3. Bank Accounts</h3>
      ${S.bankAccount ? `
        <div style="background:var(--success-bg);border:1px solid #86efac;padding:12px;border-radius:8px;">
          <div style="font-weight:700;margin-bottom:4px;font-size:.95rem;">${S.bankAccount.bankName}</div>
          <div style="font-size:.85rem;color:var(--neutral);">Account: ${S.bankAccount.accountNumber}</div>
          <div style="font-weight:700;color:var(--success);margin-top:6px;font-size:1.1rem;">${fmtCur(S.bankAccount.balance)}</div>
        </div>
      ` : `<div class="text-muted" style="font-size:.85rem;">No bank connected.</div>`}
    </div>

    <div class="sp-section">
      <h3>4. Privacy & Data</h3>
      <div class="sp-data-row"><div class="sp-data-label">Matched Scholarships</div><div class="sp-data-val">${stats.scholarshipsInCache || 0}</div></div>
      <div class="sp-data-row"><div class="sp-data-label">Active Applications</div><div class="sp-data-val">${stats.applicationsCount || 0}</div></div>
      <div class="sp-data-row"><div class="sp-data-label">Logged Decisions</div><div class="sp-data-val">${stats.decisionsCount || 0}</div></div>
      <div class="sp-data-row"><div class="sp-data-label">Executed Investments</div><div class="sp-data-val">${stats.executedInvestments || 0}</div></div>
      <p style="font-size:.75rem;color:var(--text-muted);margin-top:12px;line-height:1.4;">
        ${stats.storageNote || "Data is strictly temporary."}
      </p>
    </div>

    <div class="sp-section">
      <h3>5. Notifications (Mock)</h3>
      <div class="sp-data-row" style="align-items:center;border:none;">
        <div class="sp-data-label" style="color:var(--text);">Email Alerts</div>
        <label class="toggle-switch">
          <input type="checkbox" checked />
          <span class="slider"></span>
        </label>
      </div>
      <div class="sp-data-row" style="align-items:center;border:none;">
        <div class="sp-data-label" style="color:var(--text);">SMS Updates</div>
        <label class="toggle-switch">
          <input type="checkbox" />
          <span class="slider"></span>
        </label>
      </div>
    </div>

    <div class="sp-section" style="padding:12px 24px;">
      <button class="sp-menu-btn" onclick="closeSettings(); showDecisionLog()">
        6. View Decision Log <span>?</span>
      </button>
    </div>

    <div class="sp-section" style="padding:12px 24px; border-bottom:none; margin-bottom:24px;">
      <button class="sp-menu-btn text-danger" onclick="logout(event)">
        7. Log Out <span>?</span>
      </button>
    </div>
  `;
}

function closeSettings() {
  hide("settings-overlay");
}

function closeSettingsOverlay(e) {
  if (e.target.id === "settings-overlay") closeSettings();
}

async function logout(e) {
  const btn = e.currentTarget;
  btn.innerHTML = `<div class="spinner" style="width:14px;height:14px;"></div> Logging out·`;
  try {
    await apiPost("/logout", {});
    
    // Reset local state
    S.profile = null;
    S.bankAccount = null;
    S.pool.balance = 0;
    S.scholarships = [];
    S.applications = [];
    S.filtered = [];
    S.obStep = 0;
    
    closeSettings();
    hide("view-dashboard");
    show("view-onboarding");
    renderStep0();
    toast("Logged out successfully.", "success");
  } catch (err) {
    toast("Logout failed.", "error");
    btn.innerHTML = `8. Log Out <span>?</span>`;
  }
}

// ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ 
// GLOBAL EVENT LISTENERS
// ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ 
document.addEventListener("focusin", (e) => {
  if (e.target.tagName === "INPUT" && e.target.type === "number") {
    if (e.target.value === "0") {
      e.target.value = "";
    }
  }
});

document.addEventListener("focusout", (e) => {
  if (e.target.tagName === "INPUT" && e.target.type === "number") {
    if (e.target.value === "") {
      e.target.value = "0";
      // Trigger input event to update state if there are any oninput handlers
      e.target.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }
});

