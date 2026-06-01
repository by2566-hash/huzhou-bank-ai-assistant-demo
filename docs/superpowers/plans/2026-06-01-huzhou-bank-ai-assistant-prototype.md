# Huzhou Bank AI Assistant Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first, high-fidelity static web prototype that demonstrates a trusted Huzhou Bank in-app AI task assistant for ordinary personal users.

**Architecture:** Use a dependency-free static app: one HTML entry point, one CSS file, one mock-data file, and one UI/controller file. The app is state-driven in the browser, with deterministic mock intent routing, mock verification, selection sheets, and structured result cards. AI behavior is simulated through fixed flows; no real AI model, bank API, authentication, account data, or third-party SDK is used.

**Tech Stack:** Plain HTML, CSS, and vanilla JavaScript. Local verification uses a static file open or `python3 -m http.server`; browser smoke testing should be done with Codex Browser when implementation is complete.

---

## File Structure

- Create `index.html`: static entry point, app root, no external CDN, no third-party assets.
- Create `src/styles.css`: mobile banking visual system, phone viewport, cards, sheets, buttons, responsive rules.
- Create `src/data.js`: fictional Huzhou Bank user, cards, branches, transactions, recurring payments, and policy metadata.
- Create `src/app.js`: app state, placeholder rotation, intent routing, sheet/card rendering, mock verification, copy/toast behavior.
- Modify `docs/audit-log.md`: append implementation audit after each completed execution phase.

Do not create `package.json`, install dependencies, add build tooling, add a backend, add real AI SDKs, or add real bank assets in the first implementation.

## Design Boundaries

- Bank context: Huzhou Bank only.
- User: fictional personal user `林晨`.
- Cards: fictional Huzhou Bank debit card ending `8026` and fictional Huzhou Bank salary card ending `3391`.
- Search placeholder loop: only `你好，我是小X，有什么可以帮到您？` and `请直接复制你的问题`.
- Core flows: face login, home search entry, receipt info, card number, branch/CNAPS, counterparty transaction search, charge explanation, recurring app deductions, spending summary, lost-card guidance.
- Sensitive data: default masked; reveal and high-risk actions require mock verification and audit messaging.
- First version: read-only; no real transfer, share, export, cancellation, loss report, or data submission.

---

### Task 1: Static App Skeleton and Mock Data Contract

**Files:**
- Create: `index.html`
- Create: `src/data.js`
- Create: `src/app.js`
- Create: `src/styles.css`

- [ ] **Step 1: Create `index.html` with a static app root**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>湖州银行可信 AI 助手 Demo</title>
    <link rel="stylesheet" href="./src/styles.css" />
  </head>
  <body>
    <main id="app" class="app-shell" aria-live="polite"></main>
    <script src="./src/data.js"></script>
    <script src="./src/app.js"></script>
  </body>
</html>
```

- [ ] **Step 2: Create `src/data.js` with centralized fictional demo data**

```javascript
window.DEMO_DATA = {
  bank: {
    name: "湖州银行",
    assistantName: "小X",
    lastUpdated: "2026-06-01 11:30",
    sourceLabel: "来自演示账户资料"
  },
  user: {
    id: "demo_user_linchen",
    name: "林晨",
    loginStatus: "已登录"
  },
  placeholders: [
    "你好，我是小X，有什么可以帮到您？",
    "请直接复制你的问题"
  ],
  cards: [
    {
      id: "card_8026",
      label: "湖州银行借记卡",
      type: "借记卡",
      tail: "8026",
      maskedNumber: "**** **** **** 8026",
      fullNumber: "演示卡号 8888 0000 0000 8026",
      accountName: "林晨",
      branch: "湖州银行演示支行",
      city: "浙江省湖州市",
      cnaps: "3132900D001",
      balanceLabel: "演示余额 18,620.35 元",
      isDefault: true
    },
    {
      id: "card_3391",
      label: "湖州银行工资卡",
      type: "工资卡",
      tail: "3391",
      maskedNumber: "**** **** **** 3391",
      fullNumber: "演示卡号 8888 0000 0000 3391",
      accountName: "林晨",
      branch: "湖州银行演示工资卡支行",
      city: "浙江省湖州市",
      cnaps: "3132900D002",
      balanceLabel: "演示余额 9,804.20 元",
      isDefault: false
    }
  ],
  transactions: [
    { id: "tx_wm_1", counterparty: "王明", merchant: "王明", amount: "860.00", direction: "转出", date: "2026-05-28", cardTail: "8026", status: "成功", note: "房租分摊" },
    { id: "tx_wm_2", counterparty: "王明", merchant: "王明", amount: "800.00", direction: "转出", date: "2026-05-12", cardTail: "8026", status: "成功", note: "生活费" },
    { id: "tx_wm_3", counterparty: "王明", merchant: "王明", amount: "800.00", direction: "转出", date: "2026-04-30", cardTail: "3391", status: "成功", note: "房租分摊" },
    { id: "tx_charge_1", counterparty: "网易云音乐", merchant: "网易云音乐会员", amount: "18.00", direction: "扣款", date: "2026-05-30", cardTail: "8026", status: "成功", note: "自动续费" },
    { id: "tx_charge_2", counterparty: "爱奇艺", merchant: "爱奇艺会员", amount: "25.00", direction: "扣款", date: "2026-05-25", cardTail: "8026", status: "成功", note: "自动续费" }
  ],
  recurringPayments: [
    { id: "auto_1", app: "网易云音乐", cardTail: "8026", amount: "18.00", cycle: "每月", lastCharge: "2026-05-30", status: "已授权" },
    { id: "auto_2", app: "爱奇艺", cardTail: "8026", amount: "25.00", cycle: "每月", lastCharge: "2026-05-25", status: "已授权" },
    { id: "auto_3", app: "支付宝小额免密", cardTail: "3391", amount: "按实际消费", cycle: "不固定", lastCharge: "2026-05-21", status: "已授权" }
  ],
  quickQuestions: [
    "公司报销要收款信息",
    "我的银行卡号是多少",
    "我的开户行和联行号",
    "查给王明的转账",
    "这笔扣款是什么",
    "哪些 App 正在自动扣我的银行卡",
    "最近一个月消费总结",
    "银行卡丢了怎么办"
  ]
};
```

- [ ] **Step 3: Create minimal `src/app.js` boot code**

```javascript
const state = {
  screen: "login",
  selectedCardId: "card_8026",
  pendingIntent: null,
  placeholderIndex: 0,
  verifiedActions: new Set(),
  toast: ""
};

const app = document.getElementById("app");
const data = window.DEMO_DATA;

function render() {
  app.innerHTML = `<section class="phone-frame"><p>加载中...</p></section>`;
}

render();
```

- [ ] **Step 4: Create minimal `src/styles.css` foundation**

```css
:root {
  color-scheme: light;
  --brand: #1f6f5b;
  --brand-dark: #145244;
  --ink: #17211f;
  --muted: #66736f;
  --line: #dfe7e4;
  --bg: #eef4f2;
  --card: #ffffff;
  --danger: #b42318;
  --radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
}

.app-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 16px;
}

.phone-frame {
  width: min(100%, 390px);
  min-height: 844px;
  background: #f8fbfa;
  border: 1px solid var(--line);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 24px 70px rgba(23, 33, 31, 0.18);
}
```

- [ ] **Step 5: Verify static load**

Run:

```bash
python3 -m http.server 4173
```

Expected: local server starts from `/Users/yubo/Documents/AI_bank_app`. Open `http://localhost:4173` and confirm the phone frame renders with “加载中...”.

---

### Task 2: Login Screen, Home Screen, and Search Entry

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Implement screen rendering functions in `src/app.js`**

```javascript
function getSelectedCard() {
  return data.cards.find((card) => card.id === state.selectedCardId) || data.cards[0];
}

function renderLogin() {
  return `
    <section class="phone-frame login-screen">
      <div class="status-bar"><span>23:15</span><span>5G 68%</span></div>
      <div class="login-panel">
        <div class="bank-mark">${data.bank.name}</div>
        <div class="face-icon" aria-hidden="true">Face ID</div>
        <h1>人脸认证登录</h1>
        <p>验证成功，正在进入手机银行。</p>
      </div>
    </section>
  `;
}

function renderHome() {
  const card = getSelectedCard();
  return `
    <section class="phone-frame bank-screen">
      <div class="status-bar"><span>23:15</span><span>5G 68%</span></div>
      <header class="bank-header">
        <div>
          <strong>${data.bank.name}</strong>
          <span>${data.user.name} · ${data.user.loginStatus}</span>
        </div>
      </header>
      <button class="ai-search" data-action="open-assistant">
        <span>${data.placeholders[state.placeholderIndex]}</span>
        <b>语音</b>
      </button>
      <section class="account-overview">
        <p>${card.label} 尾号 ${card.tail}</p>
        <strong>${card.balanceLabel}</strong>
      </section>
      <nav class="feature-grid" aria-label="常用功能">
        <button>转账</button>
        <button>账户</button>
        <button>明细</button>
        <button>客服</button>
      </nav>
      <section class="quick-section">
        <h2>快捷问题</h2>
        <div class="quick-list">
          ${data.quickQuestions.map((q) => `<button data-question="${q}">${q}</button>`).join("")}
        </div>
      </section>
    </section>
  `;
}

function render() {
  app.innerHTML = state.screen === "login" ? renderLogin() : renderHome();
}
```

- [ ] **Step 2: Add placeholder rotation and login transition**

```javascript
setTimeout(() => {
  state.screen = "home";
  render();
}, 1200);

setInterval(() => {
  state.placeholderIndex = (state.placeholderIndex + 1) % data.placeholders.length;
  if (state.screen === "home") render();
}, 3000);
```

- [ ] **Step 3: Add home screen styling in `src/styles.css`**

```css
.status-bar {
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  font-weight: 700;
  font-size: 14px;
}

.login-screen {
  background: linear-gradient(180deg, #f6fbf9 0%, #dcebe6 100%);
}

.login-panel {
  min-height: 760px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 18px;
  text-align: center;
  padding: 28px;
}

.bank-mark {
  color: var(--brand-dark);
  font-size: 24px;
  font-weight: 800;
}

.face-icon {
  width: 116px;
  height: 116px;
  border: 2px solid var(--brand);
  border-radius: 28px;
  display: grid;
  place-items: center;
  color: var(--brand-dark);
  font-weight: 800;
}

.bank-header {
  padding: 14px 18px 8px;
}

.bank-header div {
  display: grid;
  gap: 4px;
}

.bank-header strong {
  font-size: 22px;
}

.bank-header span {
  color: var(--muted);
  font-size: 13px;
}

.ai-search {
  width: calc(100% - 36px);
  margin: 8px 18px 14px;
  min-height: 48px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--card);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 14px;
  color: var(--muted);
  text-align: left;
  font-size: 15px;
}

.account-overview,
.quick-section {
  margin: 0 18px 14px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 14px;
}

.account-overview p {
  margin: 0 0 8px;
  color: var(--muted);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin: 0 18px 14px;
}

.feature-grid button,
.quick-list button {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--card);
  min-height: 44px;
}

.quick-section h2 {
  margin: 0 0 12px;
  font-size: 16px;
}

.quick-list {
  display: grid;
  gap: 8px;
}
```

- [ ] **Step 4: Verify login and placeholder behavior**

Run:

```bash
python3 -m http.server 4173
```

Expected: login screen appears briefly, home screen appears, and the search placeholder alternates only between the two approved strings every 3 seconds.

---

### Task 3: Assistant State, Intent Routing, Selection Sheet, and Verification Sheet

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Add intent routing helpers**

```javascript
function routeQuestion(question) {
  if (question.includes("收款") || question.includes("报销")) return "receipt";
  if (question.includes("银行卡号") || question.includes("卡号")) return "cardNumber";
  if (question.includes("开户行") || question.includes("联行号")) return "branch";
  if (question.includes("王明") || question.includes("转账")) return "counterparty";
  if (question.includes("扣款是什么") || question.includes("这笔扣款")) return "charge";
  if (question.includes("自动扣") || question.includes("App")) return "recurring";
  if (question.includes("消费总结") || question.includes("最近一个月")) return "spending";
  if (question.includes("丢了") || question.includes("挂失")) return "lostCard";
  return "fallback";
}

function requiresVerification(intent) {
  return ["receipt", "cardNumber", "recurring"].includes(intent);
}

function requiresCardSelection(intent) {
  return ["receipt", "cardNumber", "branch", "recurring"].includes(intent);
}
```

- [ ] **Step 2: Add event handling**

```javascript
app.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  const question = event.target.closest("[data-question]")?.dataset.question;

  if (question) {
    startIntent(routeQuestion(question), question);
    return;
  }

  if (action === "open-assistant") {
    state.screen = "assistant";
    state.currentQuestion = "";
    state.currentIntent = null;
    render();
  }

  if (action === "verify") {
    state.verifiedActions.add(state.pendingIntent);
    state.sheet = null;
    render();
  }

  if (action === "cancel-sheet") {
    state.sheet = null;
    render();
  }

  if (action === "select-card") {
    state.selectedCardId = event.target.closest("[data-card-id]").dataset.cardId;
    state.sheet = requiresVerification(state.pendingIntent) ? "verify" : null;
    render();
  }
});

function startIntent(intent, question) {
  state.screen = "assistant";
  state.currentIntent = intent;
  state.currentQuestion = question;
  state.pendingIntent = intent;
  if (requiresCardSelection(intent)) {
    state.sheet = "selectCard";
  } else if (requiresVerification(intent)) {
    state.sheet = "verify";
  } else {
    state.sheet = null;
  }
  render();
}
```

- [ ] **Step 3: Render assistant, selection sheet, and verification sheet**

```javascript
function renderAssistant() {
  return `
    <section class="phone-frame assistant-screen">
      <div class="status-bar"><span>23:15</span><span>5G 68%</span></div>
      <header class="assistant-header">
        <button data-action="go-home">返回</button>
        <strong>${data.bank.assistantName}</strong>
      </header>
      <main class="conversation">
        ${state.currentQuestion ? `<div class="user-bubble">${state.currentQuestion}</div>` : ""}
        ${renderCurrentResult()}
      </main>
      <footer class="assistant-input">
        <input placeholder="请输入问题" aria-label="请输入问题" />
        <button>发送</button>
      </footer>
      ${renderSheet()}
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function renderSheet() {
  if (state.sheet === "selectCard") {
    return `
      <div class="sheet-backdrop">
        <section class="bottom-sheet">
          <h2>请选择要查询的银行卡</h2>
          ${data.cards.map((card) => `
            <button class="select-row" data-action="select-card" data-card-id="${card.id}">
              <span>${card.label}</span>
              <strong>尾号 ${card.tail}</strong>
            </button>
          `).join("")}
          <button class="secondary" data-action="cancel-sheet">取消</button>
        </section>
      </div>
    `;
  }
  if (state.sheet === "verify") {
    return `
      <div class="sheet-backdrop">
        <section class="bottom-sheet">
          <h2>需要验证身份</h2>
          <p>为保护账户安全，请完成验证。</p>
          <button class="primary" data-action="verify">Mock Face ID 验证</button>
          <button class="secondary" data-action="cancel-sheet">取消</button>
        </section>
      </div>
    `;
  }
  return "";
}

function render() {
  if (state.screen === "login") app.innerHTML = renderLogin();
  if (state.screen === "home") app.innerHTML = renderHome();
  if (state.screen === "assistant") app.innerHTML = renderAssistant();
}
```

- [ ] **Step 4: Add missing action handlers**

```javascript
if (action === "go-home") {
  state.screen = "home";
  state.currentIntent = null;
  state.currentQuestion = "";
  state.sheet = null;
  render();
}
```

Add this block inside the existing click listener after `open-assistant`.

- [ ] **Step 5: Add sheet and assistant styling**

```css
.assistant-header {
  display: grid;
  grid-template-columns: 64px 1fr 64px;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid var(--line);
}

.assistant-header strong {
  text-align: center;
}

.assistant-header button {
  border: 0;
  background: transparent;
  color: var(--brand-dark);
}

.conversation {
  min-height: 680px;
  padding: 14px;
  overflow: auto;
}

.user-bubble {
  margin-left: auto;
  width: fit-content;
  max-width: 82%;
  background: var(--brand);
  color: white;
  border-radius: 8px;
  padding: 10px 12px;
}

.assistant-input {
  min-height: 64px;
  border-top: 1px solid var(--line);
  display: flex;
  gap: 8px;
  padding: 10px;
  background: var(--card);
}

.assistant-input input {
  flex: 1;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 0 10px;
}

.sheet-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(23, 33, 31, 0.28);
  display: flex;
  align-items: flex-end;
}

.phone-frame {
  position: relative;
}

.bottom-sheet {
  width: 100%;
  background: var(--card);
  border-radius: 16px 16px 0 0;
  padding: 18px;
  display: grid;
  gap: 10px;
}

.select-row {
  min-height: 56px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fbfdfc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
}

.primary,
.secondary {
  min-height: 44px;
  border-radius: 8px;
  border: 1px solid var(--line);
}

.primary {
  background: var(--brand);
  color: white;
}

.secondary {
  background: white;
  color: var(--brand-dark);
}
```

- [ ] **Step 6: Verify selection and verification behavior**

Run:

```bash
python3 -m http.server 4173
```

Expected: clicking “我的银行卡号是多少” opens card selection, choosing a card opens verification, and verification returns to the assistant result area without exposing full card number by default.

---

### Task 4: Result Cards and Core Banking Flows

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Add generic field card renderer**

```javascript
function fieldRow(label, value, copyable = true) {
  return `
    <div class="field-row">
      <span>${label}</span>
      <strong>${value}</strong>
      ${copyable ? `<button data-copy="${value}" aria-label="复制${label}">复制</button>` : ""}
    </div>
  `;
}

function resultCard(title, body, actions = "") {
  return `
    <section class="result-card">
      <h2>${title}</h2>
      ${body}
      ${actions ? `<div class="card-actions">${actions}</div>` : ""}
      <button class="source-link" data-action="show-source">查看来源</button>
    </section>
  `;
}
```

- [ ] **Step 2: Add receipt, card number, and branch cards**

```javascript
function renderReceiptCard() {
  const card = getSelectedCard();
  return resultCard("收款信息", [
    fieldRow("户名", card.accountName),
    fieldRow("银行名称", data.bank.name),
    fieldRow("账户类型", card.type),
    fieldRow("账号", card.maskedNumber),
    fieldRow("开户支行", card.branch),
    fieldRow("开户地", card.city),
    fieldRow("联行号/CNAPS", card.cnaps)
  ].join(""), `
    <button data-action="copy-visible">复制全部</button>
    <button data-action="reveal-account">显示完整账号</button>
    <button data-action="mock-share">生成收款信息单</button>
  `);
}

function renderCardNumberCard() {
  const card = getSelectedCard();
  return resultCard("银行卡号", [
    fieldRow("银行卡", `${card.label} 尾号 ${card.tail}`, false),
    fieldRow("卡号", card.maskedNumber)
  ].join(""), `
    <button data-action="reveal-card">显示完整卡号</button>
    <button data-action="switch-card">换一张卡</button>
  `);
}

function renderBranchCard() {
  const card = getSelectedCard();
  return resultCard("开户行和联行号", [
    fieldRow("账户", `尾号 ${card.tail} ${card.type}`, false),
    fieldRow("开户行", card.branch),
    fieldRow("联行号/CNAPS", card.cnaps)
  ].join(""), `
    <button data-action="explain-cnaps">解释联行号是什么</button>
  `);
}
```

- [ ] **Step 3: Add transaction, charge, recurring, spending, and lost-card cards**

```javascript
function renderCounterpartyCard() {
  const matches = data.transactions.filter((tx) => tx.counterparty === "王明");
  const total = matches.reduce((sum, tx) => sum + Number(tx.amount), 0).toFixed(2);
  return resultCard("给王明的转账", [
    fieldRow("时间范围", "最近 90 天", false),
    fieldRow("匹配交易", `${matches.length} 笔`, false),
    fieldRow("总金额", `${total} 元`, false),
    fieldRow("最近一笔", `${matches[0].date} · ${matches[0].amount} 元 · ${matches[0].status}`, false)
  ].join(""), `
    <button data-action="verify-details">查看完整明细</button>
    <button data-action="copy-summary">复制摘要</button>
  `);
}

function renderChargeCard() {
  const tx = data.transactions.find((item) => item.id === "tx_charge_1");
  return resultCard("这笔扣款是什么", [
    fieldRow("扣款商户", tx.merchant, false),
    fieldRow("金额", `${tx.amount} 元`, false),
    fieldRow("时间", tx.date, false),
    fieldRow("扣款卡", `尾号 ${tx.cardTail}`, false),
    fieldRow("说明", "可能来自会员自动续费", false)
  ].join(""), `
    <button data-action="show-recurring">查看自动扣款协议</button>
    <button data-action="unknown-charge">我不认识这笔</button>
  `);
}

function renderRecurringCard() {
  const card = getSelectedCard();
  const rows = data.recurringPayments.filter((item) => item.cardTail === card.tail);
  return resultCard("自动扣款 App", `
    <p class="card-note">尾号 ${card.tail} 的银行卡当前有 ${rows.length} 项演示授权。</p>
    ${rows.map((item) => fieldRow(item.app, `${item.amount} 元 · ${item.cycle} · ${item.status}`, false)).join("")}
  `, `
    <button data-action="manage-official">进入官方管理流程</button>
    <button data-action="switch-card">换一张卡</button>
  `);
}

function renderSpendingCard() {
  return resultCard("最近一个月消费总结", [
    fieldRow("时间范围", "2026-05-01 至 2026-05-31", false),
    fieldRow("总支出", "4,286.50 元", false),
    fieldRow("最大类别", "生活服务", false),
    fieldRow("固定扣费", "2 项会员自动续费", false),
    fieldRow("疑似重复扣款", "未发现明显重复", false)
  ].join(""), `
    <button data-action="show-recurring">查看固定扣费</button>
  `);
}

function renderLostCardCard() {
  return resultCard("银行卡丢失怎么办", [
    fieldRow("建议第一步", "先进入官方挂失/冻结流程", false),
    fieldRow("冻结", "临时限制交易，适合不确定是否丢失", false),
    fieldRow("挂失", "正式挂失补卡，可能影响取现和刷卡", false)
  ].join(""), `
    <button data-action="official-lost-card">进入挂失页面</button>
    <button data-action="contact-service">联系官方客服</button>
  `);
}
```

- [ ] **Step 4: Wire `renderCurrentResult()`**

```javascript
function renderCurrentResult() {
  if (!state.currentIntent) {
    return `<p class="assistant-hint">请选择一个快捷问题，或直接复制你的问题。</p>`;
  }
  if (state.sheet) {
    return `<p class="assistant-hint">我先确认一下要查询的对象。</p>`;
  }
  if (requiresVerification(state.currentIntent) && !state.verifiedActions.has(state.currentIntent)) {
    return `<p class="assistant-hint">这会展示敏感信息，需要先验证身份。</p>`;
  }
  const renderers = {
    receipt: renderReceiptCard,
    cardNumber: renderCardNumberCard,
    branch: renderBranchCard,
    counterparty: renderCounterpartyCard,
    charge: renderChargeCard,
    recurring: renderRecurringCard,
    spending: renderSpendingCard,
    lostCard: renderLostCardCard
  };
  return renderers[state.currentIntent]?.() || resultCard("暂时无法确认", `<p>我无法从当前演示数据确认这个问题，请通过官方页面或客服核实。</p>`);
}
```

- [ ] **Step 5: Add copy, reveal, and secondary action handlers**

```javascript
const copyValue = event.target.closest("[data-copy]")?.dataset.copy;
if (copyValue) {
  navigator.clipboard?.writeText(copyValue);
  state.toast = "已复制";
  render();
  setTimeout(() => { state.toast = ""; render(); }, 1200);
}

if (action === "switch-card") {
  state.pendingIntent = state.currentIntent;
  state.sheet = "selectCard";
  render();
}

if (action === "reveal-card" || action === "reveal-account" || action === "verify-details") {
  state.sheet = "verify";
  state.toast = "完整信息属于敏感信息，本次查看会记录在安全日志中。";
  render();
}

if (action === "show-recurring") {
  startIntent("recurring", "哪些 App 正在自动扣我的银行卡");
}

if (action === "explain-cnaps") {
  state.toast = "联行号可以理解为银行网点在跨行转账系统里的编号。";
  render();
}

if (["mock-share", "manage-official", "official-lost-card", "contact-service", "unknown-charge"].includes(action)) {
  state.toast = "第一版仅演示官方流程入口，不执行真实操作。";
  render();
}
```

Add this block inside the click listener after existing action handling.

- [ ] **Step 6: Add result card styling**

```css
.result-card {
  margin-top: 14px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 14px;
}

.result-card h2 {
  margin: 0 0 12px;
  font-size: 18px;
}

.field-row {
  display: grid;
  grid-template-columns: 96px 1fr auto;
  gap: 8px;
  align-items: center;
  min-height: 44px;
  border-top: 1px solid var(--line);
}

.field-row:first-of-type {
  border-top: 0;
}

.field-row span {
  color: var(--muted);
}

.field-row strong {
  font-size: 14px;
  word-break: break-word;
}

.field-row button,
.card-actions button,
.source-link {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #f8fbfa;
  min-height: 32px;
}

.card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
}

.source-link {
  width: 100%;
  margin-top: 8px;
  color: var(--muted);
}

.card-note,
.assistant-hint {
  color: var(--muted);
  line-height: 1.5;
}

.toast {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 78px;
  min-height: 42px;
  border-radius: 8px;
  background: rgba(20, 82, 68, 0.94);
  color: white;
  display: grid;
  place-items: center;
  padding: 8px 12px;
  text-align: center;
}
```

- [ ] **Step 7: Verify all required flows**

Run:

```bash
python3 -m http.server 4173
```

Expected: each quick question opens the correct result flow; high-sensitive flows verify first; multi-card flows show a selector; cards remain short and copyable.

---

### Task 5: Visual Polish, Mobile Fit, and Bank-Credible Interaction Details

**Files:**
- Modify: `src/styles.css`
- Modify: `src/app.js`

- [ ] **Step 1: Add desktop and mobile responsive constraints**

```css
@media (max-width: 430px) {
  .app-shell {
    padding: 0;
    place-items: stretch;
  }

  .phone-frame {
    width: 100%;
    min-height: 100vh;
    border-radius: 0;
    border: 0;
    box-shadow: none;
  }
}

@media (min-width: 900px) {
  .app-shell {
    background:
      radial-gradient(circle at 20% 20%, rgba(31, 111, 91, 0.12), transparent 28%),
      var(--bg);
  }
}
```

- [ ] **Step 2: Add source/security sheet rendering**

```javascript
if (action === "show-source") {
  state.sheet = "source";
  render();
}
```

Extend `renderSheet()` with:

```javascript
if (state.sheet === "source") {
  return `
    <div class="sheet-backdrop">
      <section class="bottom-sheet">
        <h2>来源与安全说明</h2>
        <p>${data.bank.sourceLabel}，更新时间：${data.bank.lastUpdated}。</p>
        <p>完整账号、完整卡号、明细导出和授权管理需要再次验证。演示数据不代表真实银行系统。</p>
        <button class="primary" data-action="cancel-sheet">知道了</button>
      </section>
    </div>
  `;
}
```

- [ ] **Step 3: Add current input submission for copied questions**

```javascript
app.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.target.querySelector("input");
  const question = input?.value?.trim();
  if (!question) return;
  startIntent(routeQuestion(question), question);
});
```

Change the assistant footer from:

```html
<footer class="assistant-input">
```

to:

```html
<form class="assistant-input">
```

and change the closing tag from `</footer>` to `</form>`.

- [ ] **Step 4: Verify no text overflow on mobile**

Run:

```bash
python3 -m http.server 4173
```

Expected: at 390px width and at 430px width, buttons, field rows, and cards do not overlap; long values wrap inside their row.

---

### Task 6: Final Verification and Audit

**Files:**
- Modify: `docs/audit-log.md`

- [ ] **Step 1: Run static consistency scans**

Run:

```bash
rg -n "中国银行|Bank of China|真实账号|真实银行卡|API key|token|\\.env" .
```

Expected: no current implementation files contain forbidden real-data or dual-bank references. Historical audit references may exist only inside `docs/audit-log.md`.

- [ ] **Step 2: Run approved placeholder scan**

Run:

```bash
rg -n "你好，我是小X|请直接复制你的问题|例如：" index.html src docs/product-brief.md docs/demo-script.md docs/security-and-data-policy.md docs/ui-information-architecture.md
```

Expected: only the two approved placeholder strings appear in app/source specs; no `例如：` placeholder remains in current app/source specs.

- [ ] **Step 3: Browser smoke test**

Run:

```bash
python3 -m http.server 4173
```

Use Codex Browser to open `http://localhost:4173`.

Expected checklist:
- Login screen appears first.
- Home screen shows Huzhou Bank and full-width AI search bar.
- Placeholder cycles between only the two approved strings.
- Receipt/card-number/branch flows show card selection where needed.
- Sensitive flows require mock verification.
- Result cards answer only the selected question.
- Receipt card supports both whole-card and row-level copy affordances.
- Charge and recurring-payment flows are present.
- Lost-card flow is read-only and routes to official-process messaging.

- [ ] **Step 4: Append implementation audit**

Add a new `docs/audit-log.md` section:

```markdown
## 2026-06-01 - Phase 6 Static Prototype Implementation

**Phase:** Phase 6 - 静态高保真原型实现

**Files changed:**
- Created `index.html`
- Created `src/data.js`
- Created `src/app.js`
- Created `src/styles.css`
- Modified `docs/audit-log.md`

**Purpose:**
- Implement the first runnable Huzhou Bank AI assistant prototype using dependency-free static web files.

**Verification:**
- Static forbidden-reference scan completed.
- Placeholder scan completed.
- Browser smoke test completed at `http://localhost:4173`.

**Residual risks / unknowns:**
- This is still a mock prototype, not a production banking system.
- Real deployment would require bank design, legal, security, data, and accessibility review.
```

- [ ] **Step 5: Report final status**

Report:
- Files changed.
- Verification commands and results.
- Browser smoke-test status.
- Any gaps, especially if browser testing could not run.

---

## Plan Self-Review

**Spec coverage:** This plan covers the approved Huzhou Bank-only context, login state, top AI search entry, two approved placeholders, selection sheets, mock verification, receipt info, card number, branch/CNAPS, counterparty transfer search, charge explanation, recurring app deductions, spending summary, lost-card guidance, row-level copy, progressive source/security detail, and audit update.

**Placeholder scan:** The plan uses concrete paths, commands, code snippets, and expected results rather than unresolved placeholders.

**Type consistency:** The planned app uses `window.DEMO_DATA`, `state`, `routeQuestion()`, `requiresVerification()`, `requiresCardSelection()`, `renderSheet()`, `renderCurrentResult()`, `resultCard()`, and `fieldRow()` consistently across tasks.

**Risk note:** Because the project is not a Git repository, this plan replaces commit steps with audit-log updates and explicit verification commands.
