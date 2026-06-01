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
      fullNumber: "8888 0000 0000 8026",
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
      fullNumber: "8888 0000 0000 3391",
      accountName: "林晨",
      branch: "湖州银行演示工资卡支行",
      city: "浙江省湖州市",
      cnaps: "3132900D002",
      balanceLabel: "演示余额 9,804.20 元",
      isDefault: false
    }
  ],
  transactions: [
    {
      id: "tx_wm_1",
      counterparty: "王明",
      merchant: "王明",
      amount: "860.00",
      direction: "转出",
      date: "2026-05-28",
      cardTail: "8026",
      status: "成功",
      note: "房租分摊"
    },
    {
      id: "tx_wm_2",
      counterparty: "王明",
      merchant: "王明",
      amount: "800.00",
      direction: "转出",
      date: "2026-05-12",
      cardTail: "8026",
      status: "成功",
      note: "生活费"
    },
    {
      id: "tx_wm_3",
      counterparty: "王明",
      merchant: "王明",
      amount: "800.00",
      direction: "转出",
      date: "2026-04-30",
      cardTail: "3391",
      status: "成功",
      note: "房租分摊"
    },
    {
      id: "tx_charge_1",
      counterparty: "网易云音乐",
      merchant: "网易云音乐会员",
      amount: "18.00",
      direction: "扣款",
      date: "2026-05-30",
      cardTail: "8026",
      status: "成功",
      note: "自动续费"
    },
    {
      id: "tx_charge_2",
      counterparty: "爱奇艺",
      merchant: "爱奇艺会员",
      amount: "25.00",
      direction: "扣款",
      date: "2026-05-25",
      cardTail: "8026",
      status: "成功",
      note: "自动续费"
    },
    {
      id: "tx_charge_3",
      counterparty: "湖州水务",
      merchant: "湖州水务",
      amount: "63.50",
      direction: "扣款",
      date: "2026-05-20",
      cardTail: "3391",
      status: "成功",
      note: "生活缴费"
    }
  ],
  recurringPayments: [
    {
      id: "auto_1",
      app: "网易云音乐",
      cardTail: "8026",
      amount: "18.00",
      cycle: "每月",
      lastCharge: "2026-05-30",
      status: "已授权",
      category: "会员服务",
      channel: "第三方快捷支付",
      riskLevel: "低",
      nextStep: "如已不使用会员，可进入授权管理关闭自动续费。"
    },
    {
      id: "auto_2",
      app: "爱奇艺",
      cardTail: "8026",
      amount: "25.00",
      cycle: "每月",
      lastCharge: "2026-05-25",
      status: "已授权",
      category: "会员服务",
      channel: "第三方快捷支付",
      riskLevel: "低",
      nextStep: "如不认识该扣款，建议先核对家庭成员或平台会员记录。"
    },
    {
      id: "auto_3",
      app: "支付宝小额免密",
      cardTail: "3391",
      amount: "按实际消费",
      cycle: "不固定",
      lastCharge: "2026-05-21",
      status: "已授权",
      category: "小额免密",
      channel: "支付平台授权",
      riskLevel: "中",
      nextStep: "不固定扣款更适合定期复核额度和授权范围。"
    }
  ],
  primaryActions: [
    { label: "账户", icon: "￥", action: "static-feature" },
    { label: "转账", icon: "⇄", question: "查给王明的转账" },
    { label: "存款", icon: "存", action: "static-feature" },
    { label: "理财", icon: "理", action: "static-feature" }
  ],
  serviceItems: [
    { label: "湖银益家", icon: "益", action: "static-feature" },
    { label: "自助循环贷", icon: "贷", action: "static-feature" },
    { label: "个人绿小贷", icon: "绿", action: "static-feature" },
    { label: "人脸核实", icon: "核", action: "static-feature" },
    { label: "手机号转账", icon: "号", action: "static-feature" },
    { label: "银行卡", icon: "卡", question: "我的银行卡号是多少" },
    { label: "收支明细", icon: "明", question: "最近一个月消费总结" },
    { label: "全部", icon: "全", action: "static-feature" }
  ],
  bottomNav: [
    { label: "首页", icon: "⌂", active: true },
    { label: "金融", icon: "◎", active: false },
    { label: "生活", icon: "▣", active: false },
    { label: "我的", icon: "人", active: false }
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
