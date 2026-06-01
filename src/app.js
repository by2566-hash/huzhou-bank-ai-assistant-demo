const data = window.DEMO_DATA;
const app = document.getElementById("app");

const state = {
  screen: "login",
  selectedCardId: "card_8026",
  selectedTransactionId: "tx_charge_1",
  currentQuestion: "",
  currentIntent: null,
  pendingIntent: null,
  pendingReveal: null,
  sheet: null,
  placeholderIndex: 0,
  verifiedIntents: new Set(),
  revealed: new Set(),
  toast: ""
};

const intentMeta = {
  receipt: {
    summary: "收款信息、开户支行、联行号",
    selecting: "请先选择用于收款的银行卡。",
    verifying: "这会展示账户收款信息，需要先验证身份。",
    trust: "已验证｜账号默认脱敏｜完整账号查看会记录"
  },
  cardNumber: {
    summary: "银行卡号",
    selecting: "请先选择要查询的银行卡。",
    verifying: "卡号属于敏感信息，需要先验证身份。",
    trust: "已验证｜卡号默认脱敏｜完整卡号查看会记录"
  },
  cardNumberBranch: {
    summary: "银行卡号、开户行、联行号",
    selecting: "请先选择要查询的银行卡。",
    verifying: "以下信息包含银行卡号，需要先验证身份。",
    trust: "已验证｜卡号默认脱敏｜完整卡号查看会记录"
  },
  branch: {
    summary: "开户行、联行号",
    selecting: "请先选择要查询的银行卡。",
    trust: "账户资料｜低敏信息｜用于转账前核对"
  },
  counterparty: {
    summary: "与王明相关的转账记录",
    trust: "交易明细｜摘要展示｜完整明细需再次验证"
  },
  charge: {
    summary: "扣款来源、扣款类型、下一步处理建议",
    selecting: "请先选择要解释的扣款。",
    trust: "交易明细｜只读分析｜不发起争议或退款"
  },
  recurring: {
    summary: "正在自动扣款的 App、授权类型、处理建议",
    selecting: "请先选择要检查的银行卡。",
    verifying: "自动扣款授权属于账户敏感信息，需要先验证身份。",
    trust: "授权记录｜只读展示｜取消授权需进入官方流程"
  },
  spending: {
    summary: "近一个月支出、固定扣费、异常提醒",
    trust: "交易统计｜只读分析｜金额为演示数据"
  },
  lostCard: {
    summary: "挂失、冻结、联系客服的官方处理路径",
    trust: "安全指引｜不执行真实挂失｜需官方页面确认"
  },
  fallback: {
    summary: "当前演示数据可核实的信息",
    trust: "演示数据｜无法确认时给出官方兜底"
  }
};

function getSelectedCard() {
  return data.cards.find((card) => card.id === state.selectedCardId) || data.cards[0];
}

function getSelectedTransaction() {
  return data.transactions.find((tx) => tx.id === state.selectedTransactionId) || data.transactions[3];
}

function routeQuestion(question) {
  const asksCardNumber = question.includes("银行卡号") || question.includes("卡号");
  const asksBranch = question.includes("开户行") || question.includes("联行号");
  const asksUnknownCharge = (question.includes("不认识") || question.includes("陌生") || question.includes("看不懂")) && question.includes("扣款");
  if (asksCardNumber && asksBranch) return "cardNumberBranch";
  if (question.includes("收款") || question.includes("报销")) return "receipt";
  if (asksCardNumber) return "cardNumber";
  if (asksBranch) return "branch";
  if (question.includes("王明") || question.includes("转账")) return "counterparty";
  if (asksUnknownCharge || question.includes("扣款是什么") || question.includes("这笔扣款")) return "charge";
  if (question.includes("自动扣") || question.includes("App")) return "recurring";
  if (question.includes("消费总结") || question.includes("最近一个月")) return "spending";
  if (question.includes("丢了") || question.includes("挂失")) return "lostCard";
  return "fallback";
}

function requiresVerification(intent) {
  return ["receipt", "cardNumber", "cardNumberBranch", "recurring"].includes(intent);
}

function requiresCardSelection(intent) {
  return ["receipt", "cardNumber", "cardNumberBranch", "branch", "recurring"].includes(intent);
}

function startIntent(intent, question) {
  state.screen = "assistant";
  state.currentIntent = intent;
  state.currentQuestion = question;
  state.pendingIntent = intent;
  state.pendingReveal = null;

  if (intent === "charge") {
    state.sheet = "selectTransaction";
  } else if (requiresCardSelection(intent)) {
    state.sheet = "selectCard";
  } else if (requiresVerification(intent) && !state.verifiedIntents.has(intent)) {
    state.sheet = "verify";
  } else {
    state.sheet = null;
  }

  render();
}

function showToast(message) {
  state.toast = message;
  render();
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    state.toast = "";
    render();
  }, 1500);
}

function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(value);
  }
  showToast("已复制");
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
      <section class="home-hero">
        <div class="status-bar status-bar-light"><span>02:52</span><span>5G 79%</span></div>
        <div class="home-toolbar">
          <button class="toolbar-link" data-action="static-feature">登录</button>
          <button class="toolbar-link" data-action="static-feature">版本</button>
          <span></span>
          <button class="toolbar-icon" data-action="static-feature">客服</button>
          <button class="toolbar-icon" data-action="static-feature">消息</button>
        </div>
        <button class="ai-search hero-search" data-action="open-assistant">
          <span class="search-mark">⌕</span>
          <span>${data.placeholders[state.placeholderIndex]}</span>
          <b>语音</b>
        </button>
        <div class="hero-actions" aria-label="主要功能">
          ${data.primaryActions.map((item) => renderHomeAction(item)).join("")}
        </div>
        <div class="lake-visual" aria-hidden="true">
          <span class="lake-leaf lake-leaf-left"></span>
          <span class="lake-leaf lake-leaf-right"></span>
          <span class="lake-water"></span>
          <span class="lake-card-shape"></span>
        </div>
      </section>

      <section class="home-content">
        <section class="demo-disclaimer">
          演示原型 · 所有账户、交易、授权数据均为虚构 · 不连接真实银行系统
        </section>

        <section class="service-grid" aria-label="常用银行服务">
          ${data.serviceItems.map((item) => renderServiceItem(item)).join("")}
        </section>

        <section class="notice-strip">
          <strong>公告</strong>
          <span>电信诈骗案例警示（2026 年第五期）</span>
        </section>

        <button class="ai-promo" data-action="open-assistant">
          <span class="promo-kicker">小X 智能助手</span>
          <strong>直接问，安全查</strong>
          <span>收款信息、开户行、卡号、扣款解释，一句话直达。</span>
        </button>

        <section class="account-overview home-card">
          <p>${card.label} 尾号 ${card.tail}</p>
          <strong>${card.balanceLabel}</strong>
          <span>演示账户 · 已登录 · 敏感信息默认隐藏</span>
        </section>

        <section class="quick-section home-card">
          <div class="section-title-row">
            <h2>智能助手任务区</h2>
            <button data-action="open-assistant">更多</button>
          </div>
          <div class="quick-list">
            ${data.quickQuestions.map((q) => `<button data-question="${q}">${q}</button>`).join("")}
          </div>
        </section>
      </section>

      <nav class="bottom-nav" aria-label="底部导航">
        ${data.bottomNav.map((item) => `
          <button class="${item.active ? "active" : ""}" data-action="static-feature">
            <span>${item.icon}</span>
            <b>${item.label}</b>
          </button>
        `).join("")}
      </nav>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function renderHomeAction(item) {
  const attrs = item.question ? `data-question="${item.question}"` : `data-action="${item.action}"`;
  return `
    <button class="hero-action" ${attrs}>
      <span>${item.icon}</span>
      <b>${item.label}</b>
    </button>
  `;
}

function renderServiceItem(item) {
  const attrs = item.question ? `data-question="${item.question}"` : `data-action="${item.action}"`;
  return `
    <button class="service-item" ${attrs}>
      <span>${item.icon}</span>
      <b>${item.label}</b>
    </button>
  `;
}

function renderAssistant() {
  return `
    <section class="phone-frame assistant-screen">
      <div class="status-bar"><span>23:15</span><span>5G 68%</span></div>
      <header class="assistant-header">
        <button data-action="go-home">返回</button>
        <strong>${data.bank.assistantName}</strong>
        <button class="feedback-button" data-action="open-feedback">反馈</button>
      </header>
      <main class="conversation">
        ${state.currentQuestion ? `<div class="user-bubble">${state.currentQuestion}</div>` : renderAssistantIntro()}
        ${renderCurrentResult()}
      </main>
      <form class="assistant-input">
        <button class="voice-button" type="button" data-action="voice-demo" aria-label="语音输入">麦</button>
        <input name="question" placeholder="欢迎向小X提问~" aria-label="欢迎向小X提问" />
        <div class="input-tools">
          <button class="round-tool" type="button" data-action="open-attach" aria-label="更多输入方式">+</button>
          <button class="grid-tool" type="button" data-action="open-tool-menu" aria-label="打开工具菜单">▦</button>
        </div>
        <button class="send-icon" type="submit" aria-label="发送">➤</button>
      </form>
      ${renderSheet()}
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function renderAssistantIntro() {
  return `
    <section class="assistant-intro">
      <h1>你好，我是${data.bank.assistantName}</h1>
      <p>你可以直接复制问题，也可以点下面的快捷问题。</p>
      <div class="quick-list">
        ${data.quickQuestions.map((q) => `<button data-question="${q}">${q}</button>`).join("")}
      </div>
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

  if (state.sheet === "selectTransaction") {
    return `
      <div class="sheet-backdrop">
        <section class="bottom-sheet">
          <h2>请选择要解释的扣款</h2>
          ${data.transactions.filter((tx) => tx.direction === "扣款").map((tx) => `
            <button class="select-row" data-action="select-transaction" data-transaction-id="${tx.id}">
              <span>${tx.merchant}</span>
              <strong>${tx.amount} 元</strong>
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

  if (state.sheet === "unknownCharge") {
    return `
      <div class="sheet-backdrop">
        <section class="bottom-sheet unknown-charge-sheet">
          <h2>不认识这笔扣款？</h2>
          <p>小X不会直接替你取消、退款或冻结账户。更安全的处理顺序是先核对授权，再走官方流程。</p>
          <div class="safety-steps">
            <span>1</span><p>确认家人、会员、生活缴费是否使用过该服务。</p>
            <span>2</span><p>查看本卡自动扣款协议，判断是否为授权续费。</p>
            <span>3</span><p>仍不认识时，联系官方客服或进入官方争议/冻结流程。</p>
          </div>
          <button class="primary" data-action="show-recurring">查看自动扣款协议</button>
          <button class="secondary" data-action="contact-service">联系官方客服</button>
          <button class="secondary" data-action="cancel-sheet">取消</button>
        </section>
      </div>
    `;
  }

  if (state.sheet === "attach") {
    return `
      <div class="sheet-backdrop compact-backdrop" data-action="cancel-sheet">
        <section class="bottom-sheet attach-sheet">
          <div class="sheet-handle"></div>
          <div class="attach-grid">
            <button data-action="demo-input-tool"><span>图</span><b>相册</b></button>
            <button data-action="demo-input-tool"><span>拍</span><b>拍照</b></button>
            <button data-action="demo-input-tool"><span>笑</span><b>表情</b></button>
          </div>
        </section>
      </div>
    `;
  }

  if (state.sheet === "toolMenu") {
    const tools = [
      { icon: "收", title: "收款信息生成", desc: "生成报销、学校退款可用字段", question: "公司报销要收款信息" },
      { icon: "行", title: "开户行/联行号查询", desc: "查询开户地址与联行号", question: "我的开户行和联行号" },
      { icon: "卡", title: "卡号和开户行", desc: "同时查看卡号、开户行和联行号", question: "卡号和开户行" },
      { icon: "扣", title: "自动扣款 App", desc: "查看哪些服务正在扣款", question: "哪些 App 正在自动扣我的银行卡" },
      { icon: "支", title: "每月支出回顾", desc: "查看支出分类和固定扣费", question: "最近一个月消费总结" },
      { icon: "客", title: "人工服务", desc: "转接专业人工客服", action: "contact-service" }
    ];
    return `
      <div class="sheet-backdrop" data-action="cancel-sheet">
        <section class="bottom-sheet tool-menu-sheet">
          <div class="sheet-handle"></div>
          <h2>常用助手能力</h2>
          ${tools.map((tool) => `
            <button class="tool-menu-row" ${tool.question ? `data-question="${tool.question}"` : `data-action="${tool.action}"`}>
              <span>${tool.icon}</span>
              <strong>${tool.title}<em>new</em></strong>
              <small>${tool.desc}</small>
            </button>
          `).join("")}
        </section>
      </div>
    `;
  }

  if (state.sheet === "feedback") {
    return `
      <div class="sheet-backdrop">
        <section class="bottom-sheet feedback-sheet">
          <h2>给小X提意见</h2>
          <div class="feedback-options">
            <button data-action="feedback-option">体验不顺畅</button>
            <button data-action="feedback-option">回答不准确</button>
            <button data-action="feedback-option">我有新建议</button>
          </div>
          <textarea placeholder="请输入你的建议，demo 不会真实发送"></textarea>
          <button class="primary" data-action="submit-feedback">提交反馈</button>
          <button class="secondary" data-action="cancel-sheet">取消</button>
        </section>
      </div>
    `;
  }

  return "";
}

function fieldRow(label, value, copyable = true) {
  return `
    <div class="field-row">
      <span>${label}</span>
      <strong>${value}</strong>
      ${copyable ? `<button data-copy="${value}" aria-label="复制${label}">复制</button>` : ""}
    </div>
  `;
}

function renderIntentUnderstanding(mode = "ready") {
  const meta = intentMeta[state.currentIntent] || intentMeta.fallback;
  const detail = mode === "selecting" ? meta.selecting : mode === "verifying" ? meta.verifying : "我会只返回你当前需要的字段。";
  return `
    <section class="intent-summary">
      <span>我理解你想查询</span>
      <strong>${meta.summary}</strong>
      <p>${detail}</p>
    </section>
  `;
}

function renderTrustLine(customText) {
  const meta = intentMeta[state.currentIntent] || intentMeta.fallback;
  return `
    <div class="trust-line">
      <span>来源：${data.bank.sourceLabel}｜更新：${data.bank.lastUpdated}｜${customText || meta.trust}</span>
      <button data-action="show-source">详情</button>
    </div>
  `;
}

function resultCard(title, body, actions = "", trustText = "") {
  return `
    <section class="result-card">
      <h2>${title}</h2>
      ${body}
      ${actions ? `<div class="card-actions">${actions}</div>` : ""}
      ${renderTrustLine(trustText)}
    </section>
  `;
}

function renderReceiptCard() {
  const card = getSelectedCard();
  const account = state.revealed.has("account") ? card.fullNumber : card.maskedNumber;
  return resultCard("收款信息", [
    fieldRow("户名", card.accountName),
    fieldRow("银行名称", data.bank.name),
    fieldRow("账户类型", card.type),
    fieldRow("账号", account),
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
  const isCardNumberRevealed = state.revealed.has("cardNumber");
  const number = isCardNumberRevealed ? card.fullNumber : card.maskedNumber;
  return resultCard("银行卡号", [
    fieldRow("银行卡", `${card.label} 尾号 ${card.tail}`, false),
    fieldRow("卡号", number, isCardNumberRevealed)
  ].join(""), `
    <button data-action="reveal-card">显示完整卡号</button>
    <button data-action="switch-card">换一张卡</button>
  `);
}

function renderCardNumberBranchCard() {
  const card = getSelectedCard();
  const isCardNumberRevealed = state.revealed.has("cardNumber");
  const number = isCardNumberRevealed ? card.fullNumber : card.maskedNumber;
  return resultCard("卡号和开户行", [
    fieldRow("银行卡", `${card.label} 尾号 ${card.tail}`, false),
    fieldRow("卡号", number, isCardNumberRevealed),
    fieldRow("开户行", card.branch),
    fieldRow("联行号/CNAPS", card.cnaps),
    fieldRow("开户地", card.city)
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

function renderCounterpartyCard() {
  const matches = data.transactions.filter((tx) => tx.counterparty === "王明");
  const total = matches.reduce((sum, tx) => sum + Number(tx.amount), 0).toFixed(2);
  const details = state.revealed.has("transactionDetails")
    ? matches.map((tx) => fieldRow(tx.date, `${tx.amount} 元 · ${tx.note} · 尾号 ${tx.cardTail}`, false)).join("")
    : fieldRow("最近一笔", `${matches[0].date} · ${matches[0].amount} 元 · ${matches[0].status}`, false);

  return resultCard("给王明的转账", [
    fieldRow("时间范围", "最近 90 天", false),
    fieldRow("匹配交易", `${matches.length} 笔`, false),
    fieldRow("总金额", `${total} 元`, false),
    details
  ].join(""), `
    <button data-action="verify-details">查看完整明细</button>
    <button data-action="copy-summary">复制摘要</button>
  `);
}

function getAgreementForTransaction(tx) {
  return data.recurringPayments.find((item) => tx.merchant.includes(item.app) || tx.counterparty.includes(item.app));
}

function renderChargeCard() {
  const tx = getSelectedTransaction();
  const agreement = getAgreementForTransaction(tx);
  const isAutoPay = tx.note === "自动续费";
  const type = agreement ? `${tx.note} · ${agreement.category} · ${agreement.channel}` : tx.note;
  const judgment = agreement
    ? `这笔扣款与 ${agreement.app} 的${agreement.status}记录匹配，最近一次扣款时间一致。`
    : "当前没有匹配到会员类自动续费授权，更像是生活缴费或单次账单扣款。";
  const nextStep = agreement
    ? agreement.nextStep
    : "如果本人或家人没有办理该缴费，建议先核对账单户号，再联系官方客服。";

  return resultCard("这笔扣款是什么", [
    fieldRow("扣款商户", tx.merchant, false),
    fieldRow("金额", `${tx.amount} 元`, false),
    fieldRow("时间", tx.date, false),
    fieldRow("扣款卡", `尾号 ${tx.cardTail}`, false),
    fieldRow("扣款类型", type, false),
    `<div class="risk-panel ${isAutoPay ? "" : "neutral"}">
      <strong>小X判断</strong>
      <p>${judgment}</p>
      <p>${nextStep}</p>
    </div>`
  ].join(""), `
    <button data-action="show-recurring">查看自动扣款协议</button>
    <button data-action="unknown-charge">我不认识这笔</button>
  `, "交易明细｜只读解释｜不发起退款或争议");
}

function renderRecurringCard() {
  const card = getSelectedCard();
  const rows = data.recurringPayments.filter((item) => item.cardTail === card.tail);
  const monthlyTotal = rows
    .map((item) => Number(item.amount))
    .filter((amount) => Number.isFinite(amount))
    .reduce((sum, amount) => sum + amount, 0)
    .toFixed(2);

  return resultCard("自动扣款 App", `
    <p class="card-note">尾号 ${card.tail} 当前有 ${rows.length} 项演示授权，已知固定月扣约 ${monthlyTotal} 元。</p>
    <div class="auto-pay-list">
      ${rows.map((item) => `
        <article class="auto-pay-item">
          <div>
            <strong>${item.app}</strong>
            <span>${item.status} · 风险${item.riskLevel}</span>
          </div>
          <p>${item.amount} 元 · ${item.cycle} · ${item.category}</p>
          <small>渠道：${item.channel}｜最近扣款：${item.lastCharge}</small>
          <em>${item.nextStep}</em>
        </article>
      `).join("")}
    </div>
  `, `
    <button data-action="manage-official">进入官方管理流程</button>
    <button data-action="unknown-charge">我不认识某笔扣款</button>
    <button data-action="switch-card">换一张卡</button>
  `, "授权记录｜只读展示｜关闭授权需进入官方流程");
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

function renderCurrentResult() {
  if (!state.currentIntent) {
    return "";
  }

  if (state.sheet && state.sheet !== "source") {
    return renderIntentUnderstanding(state.sheet === "verify" ? "verifying" : "selecting");
  }

  if (requiresVerification(state.currentIntent) && !state.verifiedIntents.has(state.currentIntent)) {
    return renderIntentUnderstanding("verifying");
  }

  const renderers = {
    receipt: renderReceiptCard,
    cardNumber: renderCardNumberCard,
    cardNumberBranch: renderCardNumberBranchCard,
    branch: renderBranchCard,
    counterparty: renderCounterpartyCard,
    charge: renderChargeCard,
    recurring: renderRecurringCard,
    spending: renderSpendingCard,
    lostCard: renderLostCardCard
  };

  const result = renderers[state.currentIntent]?.() || resultCard("暂时无法确认", "<p>当前演示数据里没有可核实结果。你可以换一种问法，或转人工客服并附带本次查询上下文。</p>");
  return `${renderIntentUnderstanding()}${result}`;
}

function handleAction(action, target) {
  if (action === "open-assistant") {
    state.screen = "assistant";
    state.currentQuestion = "";
    state.currentIntent = null;
    state.sheet = null;
    render();
  }

  if (action === "go-home") {
    state.screen = "home";
    state.currentQuestion = "";
    state.currentIntent = null;
    state.sheet = null;
    render();
  }

  if (action === "select-card") {
    state.selectedCardId = target.closest("[data-card-id]").dataset.cardId;
    state.sheet = requiresVerification(state.pendingIntent) && !state.verifiedIntents.has(state.pendingIntent) ? "verify" : null;
    render();
  }

  if (action === "select-transaction") {
    state.selectedTransactionId = target.closest("[data-transaction-id]").dataset.transactionId;
    state.sheet = null;
    render();
  }

  if (action === "verify") {
    if (state.pendingIntent) state.verifiedIntents.add(state.pendingIntent);
    if (state.pendingReveal) state.revealed.add(state.pendingReveal);
    state.pendingReveal = null;
    state.sheet = null;
    showToast("验证通过");
  }

  if (action === "cancel-sheet") {
    state.sheet = null;
    state.pendingReveal = null;
    render();
  }

  if (action === "show-source") {
    state.sheet = "source";
    render();
  }

  if (action === "open-attach") {
    state.sheet = "attach";
    render();
  }

  if (action === "open-tool-menu") {
    state.sheet = "toolMenu";
    render();
  }

  if (action === "open-feedback") {
    state.sheet = "feedback";
    render();
  }

  if (action === "switch-card") {
    state.pendingIntent = state.currentIntent;
    state.sheet = "selectCard";
    render();
  }

  if (action === "reveal-card") {
    state.pendingReveal = "cardNumber";
    state.sheet = "verify";
    showToast("完整卡号属于敏感信息，本次查看会记录在安全日志中。");
  }

  if (action === "reveal-account") {
    state.pendingReveal = "account";
    state.sheet = "verify";
    showToast("完整账号属于敏感信息，本次查看会记录在安全日志中。");
  }

  if (action === "verify-details") {
    state.pendingReveal = "transactionDetails";
    state.sheet = "verify";
    showToast("完整明细属于敏感信息，本次查看会记录在安全日志中。");
  }

  if (action === "show-recurring") {
    startIntent("recurring", "哪些 App 正在自动扣我的银行卡");
  }

  if (action === "unknown-charge") {
    state.sheet = "unknownCharge";
    render();
  }

  if (action === "explain-cnaps") {
    showToast("联行号可以理解为银行网点在跨行转账系统里的编号。");
  }

  if (action === "copy-visible") {
    const card = getSelectedCard();
    copyText(`户名：${card.accountName}\n银行名称：${data.bank.name}\n账号：${card.maskedNumber}\n开户支行：${card.branch}\n开户地：${card.city}\n联行号：${card.cnaps}`);
  }

  if (action === "copy-summary") {
    copyText("最近 90 天给王明转账 3 笔，总金额 2460.00 元。");
  }

  if (action === "voice-demo") {
    showToast("语音输入为演示入口，可直接打字提问。");
  }

  if (action === "demo-input-tool") {
    state.sheet = null;
    showToast("图片、拍照和表情为演示入口。");
  }

  if (action === "feedback-option") {
    showToast("已选择反馈类型，可继续填写意见。");
  }

  if (action === "submit-feedback") {
    state.sheet = null;
    showToast("感谢反馈，demo 已记录你的意见。");
  }

  if (action === "static-feature") {
    showToast("此入口为首页演示功能，核心体验请使用小X智能助手。");
  }

  if (["mock-share", "manage-official", "official-lost-card", "contact-service"].includes(action)) {
    showToast("第一版仅演示官方流程入口，不执行真实操作。");
  }
}

app.addEventListener("click", (event) => {
  const question = event.target.closest("[data-question]")?.dataset.question;
  if (question) {
    startIntent(routeQuestion(question), question);
    return;
  }

  const copyValue = event.target.closest("[data-copy]")?.dataset.copy;
  if (copyValue) {
    copyText(copyValue);
    return;
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action) {
    handleAction(action, event.target);
  }
});

app.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.target.querySelector("input");
  const question = input?.value?.trim();
  if (!question) return;
  startIntent(routeQuestion(question), question);
});

function render() {
  if (state.screen === "login") app.innerHTML = renderLogin();
  if (state.screen === "home") app.innerHTML = renderHome();
  if (state.screen === "assistant") app.innerHTML = renderAssistant();
}

window.setTimeout(() => {
  state.screen = "home";
  render();
}, 1200);

window.setInterval(() => {
  state.placeholderIndex = (state.placeholderIndex + 1) % data.placeholders.length;
  if (state.screen === "home") render();
}, 3000);

render();
