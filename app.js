const financialSnapshot = {
  cashBalance: 24840,
  balanceChange: 12.4,
  monthlySpend: 2281.6,
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
    { institution: "Chase", account: "Total Checking", type: "Checking", balance: 8420 },
    { institution: "Ally", account: "High Yield Savings", type: "Savings", balance: 16420 },
    { institution: "Amex", account: "Gold Card", type: "Credit", balance: -1294 },
    { institution: "Fidelity", account: "Brokerage", type: "Investment", balance: 11294 }
  ],
  institutions: [
    { name: "Chase", note: "Checking, savings, cards" },
    { name: "Bank of America", note: "Checking and credit" },
    { name: "Wells Fargo", note: "Banking and loans" },
    { name: "Capital One", note: "Cards and checking" }
  ]
};

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

function renderOverview() {
  setText("cash-balance", currency.format(financialSnapshot.cashBalance));
  setText("balance-change", `+${financialSnapshot.balanceChange}%`);
  setText("monthly-spend", currencyPrecise.format(financialSnapshot.monthlySpend));
  setText(
    "spend-change",
    `${financialSnapshot.spendChange > 0 ? "+" : ""}${financialSnapshot.spendChange}%`
  );
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

  financialSnapshot.upcomingBills.forEach((bill) => {
    const matchingBill = financialSnapshot.recurringBills.find((item) => item.name === bill.name);
    const item = document.createElement("div");
    item.className = "bill-item";
    item.innerHTML = `
      <div class="transaction-row">
        <div class="transaction-meta">
          <strong>${bill.name}</strong>
          <span class="muted">Due ${bill.due}</span>
        </div>
        <strong>${matchingBill ? currencyPrecise.format(matchingBill.amount) : "Tracked"}</strong>
      </div>
    `;
    list.appendChild(item);
  });
}

function renderBudgets() {
  const list = document.getElementById("budget-list");

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
  const totalMonthly = financialSnapshot.recurringBills.reduce((sum, bill) => sum + bill.amount, 0);

  financialSnapshot.recurringBills.forEach((subscription) => {
    const row = document.createElement("div");
    row.className = "subscription-row";
    row.innerHTML = `
      <div class="subscription-meta">
        <strong>${subscription.name}</strong>
        <span class="muted">${subscription.cadence}</span>
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

renderOverview();
renderUpcomingBills();
renderBudgets();
renderSubscriptions();
renderTransactions();
renderBudgetDetails();
renderGoals();
renderAccounts();
setupNavigation();
