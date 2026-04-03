const defaultFinancialSnapshot = {
  cashBalance: 24840,
  balanceChange: 12.4,
  monthlySpend: 2281.6,
  monthlyIncome: 6120,
  spendChange: -4.5,
  needsRatio: 61,
  savingsThisMonth: 286,
  savingsGoalRatio: 0.72,
  emergencyFundRatio: 68,
  upcomingBills: [
    { name: "Rent", due: "Monthly bill" },
    { name: "Electricity", due: "Monthly bill" },
    { name: "Phone", due: "Monthly bill" }
  ],
  budgets: [
    { category: "Dining", spent: 286, limit: 320, tone: "warn" },
    { category: "Groceries", spent: 412, limit: 550, tone: "safe" },
    { category: "Transport", spent: 96, limit: 180, tone: "safe" },
    { category: "Shopping", spent: 364, limit: 350, tone: "warn" }
  ],
  recurringBills: [
    { name: "Rent", amount: 1579.0, cadence: "Recurring bill", status: "Active" },
    { name: "Electricity", amount: 40.0, cadence: "Recurring bill", status: "Active" },
    { name: "Loan 1", amount: 193.71, cadence: "Recurring bill", status: "Active" },
    { name: "Loan 2", amount: 265.64, cadence: "Recurring bill", status: "Active" },
    { name: "Wifi", amount: 45.0, cadence: "Recurring bill", status: "Active" },
    { name: "Phone", amount: 60.0, cadence: "Recurring bill", status: "Active" },
    { name: "Bus Pass", amount: 89.0, cadence: "Recurring bill", status: "Active" },
    { name: "Renter Insurance", amount: 9.25, cadence: "Recurring bill", status: "Active" },
    { name: "Bus Pass 2", amount: 0, cadence: "Recurring bill", status: "Not set" },
    { name: "Macbook", amount: 0, cadence: "Recurring bill", status: "Not set" }
  ],
  recurringTotals: [
    212.35, 204.35, 694.35, 213.35, 2138.35,
    2088.35, 2088.35, 2190.02, 2132.35, 2213.35,
    2386.18, 2396.18, 2327.18, 2380.18, 2419.18,
    2419.18, 2419.18, 2327.18, 2327.18, 2329.18,
    2336.43, 2430.43, 2450.43, 2388.43, 2281.6
  ],
  transactions: [
    { merchant: "Whole Foods", category: "Groceries", date: "Today", amount: -84.72 },
    { merchant: "Payroll", category: "Income", date: "Yesterday", amount: 2140 },
    { merchant: "Uber", category: "Transport", date: "Yesterday", amount: -18.45 },
    { merchant: "Netflix", category: "Subscription", date: "Mar 30", amount: -22.99 },
    { merchant: "Sweetgreen", category: "Dining", date: "Mar 29", amount: -16.8 }
  ],
  accounts: [
    { institution: "Chase", account: "Linked balance", type: "Checking", balance: 2350 },
    { institution: "Amex", account: "Linked balance", type: "Credit", balance: 2.24 },
    { institution: "Apple", account: "Linked balance", type: "Savings", balance: 46417 },
    { institution: "SoFi", account: "Linked balance", type: "Checking", balance: 1357 },
    { institution: "Robinhood", account: "Linked balance", type: "Investment", balance: 6082 },
    { institution: "401k", account: "Linked balance", type: "Retirement", balance: 11489 }
  ],
  institutions: [
    { name: "Chase", note: "Checking, savings, cards" },
    { name: "Amex", note: "Cards and high-yield savings" },
    { name: "Apple", note: "Wallet and savings" },
    { name: "SoFi", note: "Banking and checking" },
    { name: "Robinhood", note: "Brokerage and investing" },
    { name: "401k", note: "Retirement account" }
  ]
};

const defaultMonthlyCalendar = [
  { month: "January", income: 0, recurring: 0, note: "Add this month when you have the updated numbers." },
  { month: "February", income: 0, recurring: 0, note: "Add this month when you have the updated numbers." },
  { month: "March", income: 0, recurring: 0, note: "Add this month when you have the updated numbers." },
  { month: "April", income: 0, recurring: 0, note: "Add this month when you have the updated numbers." },
  { month: "May", income: 0, recurring: 0, note: "Add this month when you have the updated numbers." },
  { month: "June", income: 0, recurring: 0, note: "Add this month when you have the updated numbers." },
  { month: "July", income: 0, recurring: 0, note: "Add this month when you have the updated numbers." },
  { month: "August", income: 0, recurring: 0, note: "Add this month when you have the updated numbers." },
  { month: "September", income: 0, recurring: 0, note: "Add this month when you have the updated numbers." },
  { month: "October", income: 0, recurring: 0, note: "Add this month when you have the updated numbers." },
  { month: "November", income: 0, recurring: 0, note: "Add this month when you have the updated numbers." },
  {
    month: "December",
    income: 6120,
    recurring: 2281.6,
    note: "December is loaded from your current sheet data."
  }
];

const storageKeys = {
  snapshot: "rokda-financial-snapshot",
  calendar: "rokda-monthly-calendar"
};

let financialSnapshot = loadStoredSnapshot();
let monthlyCalendar = loadStoredCalendar();

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const currencyPrecise = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function loadStoredSnapshot() {
  try {
    const stored = localStorage.getItem(storageKeys.snapshot);
    return stored ? JSON.parse(stored) : cloneData(defaultFinancialSnapshot);
  } catch (error) {
    return cloneData(defaultFinancialSnapshot);
  }
}

function loadStoredCalendar() {
  try {
    const stored = localStorage.getItem(storageKeys.calendar);
    return stored ? JSON.parse(stored) : cloneData(defaultMonthlyCalendar);
  } catch (error) {
    return cloneData(defaultMonthlyCalendar);
  }
}

function persistData() {
  localStorage.setItem(storageKeys.snapshot, JSON.stringify(financialSnapshot));
  localStorage.setItem(storageKeys.calendar, JSON.stringify(monthlyCalendar));
}

function setupAuth() {
  const authShell = document.getElementById("auth-shell");
  const appShell = document.getElementById("app-shell");
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");
  const authError = document.getElementById("auth-error");
  const logoutButtons = [
    document.getElementById("logout-button-desktop"),
    document.getElementById("logout-button-mobile")
  ];

  function showApp() {
    authShell.classList.add("hidden");
    appShell.classList.remove("hidden");
  }

  function showAuth() {
    appShell.classList.add("hidden");
    authShell.classList.remove("hidden");
    loginForm.reset();
    authError.textContent = "";
  }

  function handleLogin(event) {
    event.preventDefault();
    const username = emailInput.value.trim();
    const password = passwordInput.value;

    if (username && password) {
      authError.textContent = "";
      showApp();
      return;
    }

    authError.textContent = "Incorrect username or password.";
  }

  loginForm.addEventListener("submit", handleLogin);

  logoutButtons.forEach((button) => {
    button.addEventListener("click", showAuth);
  });
}

function renderOverview() {
  const linkedBalance = financialSnapshot.accounts.reduce((sum, account) => sum + account.balance, 0);
  setText("cash-balance", currency.format(linkedBalance));
  setText("balance-change", `+${financialSnapshot.balanceChange}%`);
  setText("monthly-spend", currencyPrecise.format(financialSnapshot.monthlySpend));
  setText(
    "spend-change",
    `${financialSnapshot.spendChange > 0 ? "+" : ""}${financialSnapshot.spendChange}%`
  );
  setText("monthly-income", currencyPrecise.format(financialSnapshot.monthlyIncome));
  setText("needs-ratio", `Needs ${financialSnapshot.needsRatio}%`);
  setText("saved-total", currency.format(financialSnapshot.savingsThisMonth));
  setText("goal-progress", `${financialSnapshot.emergencyFundRatio}%`);

  document.getElementById("savings-progress").style.width = `${financialSnapshot.savingsGoalRatio * 100}%`;
  document.getElementById("upcoming-bills").textContent = currencyPrecise.format(
    financialSnapshot.recurringBills.reduce((sum, bill) => sum + bill.amount, 0)
  );
  document.documentElement.style.setProperty(
    "--ring-angle",
    `${(financialSnapshot.emergencyFundRatio / 100) * 360}deg`
  );
}

function renderUpcomingBills() {
  const list = document.getElementById("upcoming-list");
  list.innerHTML = "";
  const totalRecurring = financialSnapshot.recurringBills.reduce((sum, bill) => sum + bill.amount, 0);

  financialSnapshot.upcomingBills.forEach((bill) => {
    const matchingBill = financialSnapshot.recurringBills.find((item) => item.name === bill.name);
    const ratio = matchingBill && totalRecurring > 0 ? Math.round((matchingBill.amount / totalRecurring) * 100) : 0;
    const item = document.createElement("div");
    item.className = "bill-item";
    item.innerHTML = `
      <div class="transaction-row">
        <div class="transaction-meta">
          <strong>${bill.name}</strong>
          <span class="muted">Due ${bill.due} • ${ratio}% of recurring</span>
        </div>
        <strong>${matchingBill ? currencyPrecise.format(matchingBill.amount) : "Tracked"}</strong>
      </div>
    `;
    list.appendChild(item);
  });
}

function renderBudgets() {
  const list = document.getElementById("budget-list");
  list.innerHTML = "";

  financialSnapshot.budgets.forEach((budget) => {
    const ratio = Math.min((budget.spent / budget.limit) * 100, 100);
    const row = document.createElement("div");
    row.className = "budget-row";
    row.innerHTML = `
      <div>
        <strong>${budget.category}</strong>
        <p class="muted">${currency.format(budget.spent)} of ${currency.format(budget.limit)}</p>
        <div class="progress-rail">
          <span class="progress-fill ${budget.tone === "warn" ? "warn" : ""}" style="width: ${ratio}%"></span>
        </div>
      </div>
      <span class="pill">${Math.round(ratio)}%</span>
    `;
    list.appendChild(row);
  });
}

function renderSubscriptions() {
  const list = document.getElementById("subscription-list");
  const detailedList = document.getElementById("subscriptions-detailed-list");
  list.innerHTML = "";
  detailedList.innerHTML = "";
  const totalMonthly = financialSnapshot.recurringBills.reduce((sum, bill) => sum + bill.amount, 0);
  const income = financialSnapshot.monthlyIncome;

  financialSnapshot.recurringBills.forEach((subscription) => {
    const ratio = totalMonthly > 0 ? Math.round((subscription.amount / totalMonthly) * 100) : 0;
    const incomeRatio = income > 0 ? Math.round((subscription.amount / income) * 100) : 0;
    const row = document.createElement("div");
    row.className = "subscription-row";
    row.innerHTML = `
      <div class="subscription-meta">
        <strong>${subscription.name}</strong>
        <span class="muted">${subscription.cadence} • ${ratio}% of recurring • ${incomeRatio}% of income</span>
      </div>
      <div class="subscription-meta" style="text-align: right">
        <strong>${currencyPrecise.format(subscription.amount)}</strong>
        <span class="pill">${subscription.status}</span>
      </div>
    `;
    list.appendChild(row);

    const detailedRow = row.cloneNode(true);
    detailedList.appendChild(detailedRow);
  });

  setText("subscription-monthly-total", `${currencyPrecise.format(totalMonthly)}/mo`);
  setText("subscription-count", `${financialSnapshot.recurringBills.length} recurring bills`);
}

function renderTransactions() {
  const list = document.getElementById("transaction-list");
  const detailedList = document.getElementById("transactions-detailed-list");
  list.innerHTML = "";
  detailedList.innerHTML = "";
  const netTotal = financialSnapshot.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  financialSnapshot.transactions.forEach((transaction) => {
    const amountClass = transaction.amount < 0 ? "negative" : "positive";
    const sign = transaction.amount < 0 ? "-" : "+";
    const row = document.createElement("div");
    row.className = "transaction-row";
    row.innerHTML = `
      <div class="transaction-meta">
        <strong>${transaction.merchant}</strong>
        <span class="muted">${transaction.category} • ${transaction.date}</span>
      </div>
      <span class="amount ${amountClass}">${sign}${currencyPrecise.format(Math.abs(transaction.amount))}</span>
    `;
    list.appendChild(row);

    const detailedRow = row.cloneNode(true);
    detailedList.appendChild(detailedRow);
  });

  setText(
    "transaction-total-tag",
    `${netTotal >= 0 ? "+" : "-"}${currencyPrecise.format(Math.abs(netTotal))} net`
  );
}

function renderBudgetDetails() {
  const detailList = document.getElementById("budget-detail-list");
  detailList.innerHTML = "";
  const totalSpent = financialSnapshot.budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalLimit = financialSnapshot.budgets.reduce((sum, budget) => sum + budget.limit, 0);

  financialSnapshot.budgets.forEach((budget) => {
    const ratio = Math.min((budget.spent / budget.limit) * 100, 100);
    const row = document.createElement("div");
    row.className = "budget-row";
    row.innerHTML = `
      <div>
        <strong>${budget.category}</strong>
        <p class="muted">${currency.format(budget.spent)} spent of ${currency.format(budget.limit)}</p>
        <div class="progress-rail">
          <span class="progress-fill ${budget.tone === "warn" ? "warn" : ""}" style="width: ${ratio}%"></span>
        </div>
      </div>
      <span class="pill">${currency.format(Math.max(budget.limit - budget.spent, 0))} left</span>
    `;
    detailList.appendChild(row);
  });

  const overallRatio = totalSpent / totalLimit;
  setText("budget-summary-tag", overallRatio < 0.85 ? "On track" : "Watch spend");
  setText("budget-remaining", `${currency.format(totalLimit - totalSpent)} left`);
}

function renderGoals() {
  setText("goal-progress-detail", `${financialSnapshot.emergencyFundRatio}%`);
  setText("goal-summary-copy", `You have funded ${currency.format(12240)} of your emergency cushion and are pacing toward your August target.`);
  setText("goal-savings-amount", currency.format(financialSnapshot.savingsThisMonth));
  document.getElementById("goal-savings-progress").style.width = `${financialSnapshot.savingsGoalRatio * 100}%`;
}

function renderAccounts() {
  const institutionList = document.getElementById("institution-list");
  const accountList = document.getElementById("account-list");
  institutionList.innerHTML = "";
  accountList.innerHTML = "";
  const totalLinked = financialSnapshot.accounts.reduce((sum, account) => sum + account.balance, 0);

  financialSnapshot.institutions.forEach((institution) => {
    const card = document.createElement("div");
    card.className = "institution-card";
    card.innerHTML = `
      <p class="card-label">Supported</p>
      <strong>${institution.name}</strong>
      <p class="muted">${institution.note}</p>
      <button class="ghost-button" type="button">Connect demo</button>
    `;
    institutionList.appendChild(card);
  });

  financialSnapshot.accounts.forEach((account) => {
    const amountClass = account.balance < 0 ? "negative" : "";
    const row = document.createElement("div");
    row.className = "account-row";
    row.innerHTML = `
      <div class="transaction-row">
        <div class="transaction-meta">
          <strong>${account.institution}</strong>
          <span class="muted">${account.account} • ${account.type}</span>
        </div>
        <span class="account-balance ${amountClass}">${currency.format(account.balance)}</span>
      </div>
    `;
    accountList.appendChild(row);
  });

  setText("accounts-total-tag", `${currency.format(totalLinked)} linked`);
}

function renderCalendar() {
  const calendarGrid = document.getElementById("calendar-grid");
  calendarGrid.innerHTML = "";
  const activeMonth = document.getElementById("calendar-active-month");
  const detailTitle = document.getElementById("calendar-detail-title");
  const detailStatus = document.getElementById("calendar-detail-status");
  const income = document.getElementById("calendar-income");
  const recurring = document.getElementById("calendar-recurring");
  const leftover = document.getElementById("calendar-leftover");
  const note = document.getElementById("calendar-note");

  function selectMonth(monthName) {
    const selected = monthlyCalendar.find((month) => month.month === monthName);
    if (!selected) {
      return;
    }

    activeMonth.textContent = selected.month;
    detailTitle.textContent = `${selected.month} snapshot`;
    detailStatus.textContent = selected.income > 0 ? "Loaded" : "Empty";
    income.textContent = currencyPrecise.format(selected.income);
    recurring.textContent = currencyPrecise.format(selected.recurring);
    leftover.textContent = currencyPrecise.format(selected.income - selected.recurring);
    note.textContent = selected.note;

    Array.from(calendarGrid.querySelectorAll(".calendar-month")).forEach((button) => {
      button.classList.toggle("active", button.dataset.month === monthName);
    });
  }

  monthlyCalendar.forEach((month) => {
    const button = document.createElement("button");
    button.className = "calendar-month";
    button.type = "button";
    button.dataset.month = month.month;
    button.innerHTML = `
      <strong>${month.month}</strong>
      <span>${month.income > 0 ? currencyPrecise.format(month.income) : "No income yet"}</span>
      <span>${month.recurring > 0 ? `${currencyPrecise.format(month.recurring)} recurring` : "Waiting for data"}</span>
    `;
    button.addEventListener("click", () => selectMonth(month.month));
    calendarGrid.appendChild(button);
  });

  selectMonth("December");
}

function setupEditor() {
  const appFrame = document.querySelector(".app-frame");
  const editorPanel = document.getElementById("editor-panel");
  const openButtons = [
    document.getElementById("open-editor-desktop"),
    document.getElementById("open-editor-mobile")
  ];
  const closeButton = document.getElementById("close-editor");
  const resetButton = document.getElementById("reset-editor");
  const form = document.getElementById("editor-form");

  const fieldMap = [
    ["edit-monthly-income", () => financialSnapshot.monthlyIncome, (value) => { financialSnapshot.monthlyIncome = value; updateDecemberCalendar(); }],
    ["edit-monthly-spend", () => financialSnapshot.monthlySpend, (value) => { financialSnapshot.monthlySpend = value; }],
    ["edit-rent", () => getBillAmount("Rent"), (value) => setBillAmount("Rent", value)],
    ["edit-electricity", () => getBillAmount("Electricity"), (value) => setBillAmount("Electricity", value)],
    ["edit-loan1", () => getBillAmount("Loan 1"), (value) => setBillAmount("Loan 1", value)],
    ["edit-loan2", () => getBillAmount("Loan 2"), (value) => setBillAmount("Loan 2", value)],
    ["edit-wifi", () => getBillAmount("Wifi"), (value) => setBillAmount("Wifi", value)],
    ["edit-phone", () => getBillAmount("Phone"), (value) => setBillAmount("Phone", value)],
    ["edit-bus-pass", () => getBillAmount("Bus Pass"), (value) => setBillAmount("Bus Pass", value)],
    ["edit-renter-insurance", () => getBillAmount("Renter Insurance"), (value) => setBillAmount("Renter Insurance", value)],
    ["edit-bus-pass-2", () => getBillAmount("Bus Pass 2"), (value) => setBillAmount("Bus Pass 2", value)],
    ["edit-macbook", () => getBillAmount("Macbook"), (value) => setBillAmount("Macbook", value)],
    ["edit-chase", () => getAccountBalance("Chase"), (value) => setAccountBalance("Chase", value)],
    ["edit-amex", () => getAccountBalance("Amex"), (value) => setAccountBalance("Amex", value)],
    ["edit-apple", () => getAccountBalance("Apple"), (value) => setAccountBalance("Apple", value)],
    ["edit-sofi", () => getAccountBalance("SoFi"), (value) => setAccountBalance("SoFi", value)],
    ["edit-robinhood", () => getAccountBalance("Robinhood"), (value) => setAccountBalance("Robinhood", value)],
    ["edit-401k", () => getAccountBalance("401k"), (value) => setAccountBalance("401k", value)]
  ];

  function fillForm() {
    fieldMap.forEach(([id, getter]) => {
      document.getElementById(id).value = getter();
    });
  }

  function openEditor() {
    fillForm();
    editorPanel.classList.remove("hidden");
    appFrame.classList.add("editor-open");
  }

  function closeEditor() {
    editorPanel.classList.add("hidden");
    appFrame.classList.remove("editor-open");
  }

  openButtons.forEach((button) => {
    button.addEventListener("click", openEditor);
  });

  closeButton.addEventListener("click", closeEditor);

  resetButton.addEventListener("click", () => {
    financialSnapshot = cloneData(defaultFinancialSnapshot);
    monthlyCalendar = cloneData(defaultMonthlyCalendar);
    persistData();
    rerenderApp();
    fillForm();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    fieldMap.forEach(([id, , setter]) => {
      setter(Number(document.getElementById(id).value || 0));
    });
    updateDecemberCalendar();
    persistData();
    rerenderApp();
    closeEditor();
  });
}

function getBillAmount(name) {
  return financialSnapshot.recurringBills.find((bill) => bill.name === name)?.amount ?? 0;
}

function setBillAmount(name, value) {
  const bill = financialSnapshot.recurringBills.find((entry) => entry.name === name);
  if (bill) {
    bill.amount = value;
    bill.status = value > 0 ? "Active" : "Not set";
  }
}

function getAccountBalance(name) {
  return financialSnapshot.accounts.find((account) => account.institution === name)?.balance ?? 0;
}

function setAccountBalance(name, value) {
  const account = financialSnapshot.accounts.find((entry) => entry.institution === name);
  if (account) {
    account.balance = value;
  }
}

function updateDecemberCalendar() {
  const december = monthlyCalendar.find((month) => month.month === "December");
  if (december) {
    december.income = financialSnapshot.monthlyIncome;
    december.recurring = financialSnapshot.recurringBills.reduce((sum, bill) => sum + bill.amount, 0);
  }
}

function rerenderApp() {
  renderOverview();
  renderUpcomingBills();
  renderBudgets();
  renderSubscriptions();
  renderTransactions();
  renderBudgetDetails();
  renderGoals();
  renderAccounts();
  renderCalendar();
}

function setupNavigation() {
  const navItems = Array.from(document.querySelectorAll(".nav-item"));
  const mobileTabs = Array.from(document.querySelectorAll(".mobile-tab"));
  const linkButtons = Array.from(document.querySelectorAll("[data-view-link]"));
  const views = Array.from(document.querySelectorAll("[data-view-panel]"));
  const allButtons = [...navItems, ...mobileTabs, ...linkButtons];

  function activate(viewId) {
    navItems.forEach((button) => {
      button.classList.toggle("active", button.dataset.view === viewId);
    });

    mobileTabs.forEach((button) => {
      button.classList.toggle("active", button.dataset.view === viewId);
    });

    views.forEach((view) => {
      view.classList.toggle("active", view.dataset.viewPanel === viewId);
    });
  }

  allButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const viewId = button.dataset.view || button.dataset.viewLink;
      activate(viewId);
    });
  });
}

rerenderApp();
setupNavigation();
setupAuth();
setupEditor();
