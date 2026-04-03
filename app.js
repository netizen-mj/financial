const financialSnapshot = {
  cashBalance: 24840,
  balanceChange: 12.4,
  monthlySpend: 4182,
  spendChange: 6.1,
  needsRatio: 61,
  savingsThisMonth: 286,
  savingsGoalRatio: 0.72,
  emergencyFundRatio: 68,
  upcomingBills: [
    { name: "Rent", due: "Apr 3", amount: 1850 },
    { name: "Wi-Fi", due: "Apr 5", amount: 64 },
    { name: "Phone", due: "Apr 8", amount: 95 }
  ],
  budgets: [
    { category: "Dining", spent: 286, limit: 320, tone: "warn" },
    { category: "Groceries", spent: 412, limit: 550, tone: "safe" },
    { category: "Transport", spent: 96, limit: 180, tone: "safe" },
    { category: "Shopping", spent: 364, limit: 350, tone: "warn" }
  ],
  subscriptions: [
    { name: "Spotify", amount: 10.99, cadence: "Monthly", status: "Active" },
    { name: "Netflix", amount: 22.99, cadence: "Monthly", status: "Underused" },
    { name: "Notion AI", amount: 10, cadence: "Monthly", status: "Active" },
    { name: "ClassPass", amount: 49, cadence: "Monthly", status: "Underused" }
  ],
  transactions: [
    { merchant: "Whole Foods", category: "Groceries", date: "Today", amount: -84.72 },
    { merchant: "Payroll", category: "Income", date: "Yesterday", amount: 2140 },
    { merchant: "Uber", category: "Transport", date: "Yesterday", amount: -18.45 },
    { merchant: "Netflix", category: "Subscription", date: "Mar 30", amount: -22.99 },
    { merchant: "Sweetgreen", category: "Dining", date: "Mar 29", amount: -16.8 }
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
  setText("monthly-spend", currency.format(financialSnapshot.monthlySpend));
  setText("spend-change", `+${financialSnapshot.spendChange}%`);
  setText("needs-ratio", `Needs ${financialSnapshot.needsRatio}%`);
  setText("saved-total", currency.format(financialSnapshot.savingsThisMonth));
  setText("goal-progress", `${financialSnapshot.emergencyFundRatio}%`);

  document.getElementById("savings-progress").style.width = `${financialSnapshot.savingsGoalRatio * 100}%`;
  document.getElementById("upcoming-bills").textContent = currency.format(
    financialSnapshot.upcomingBills.reduce((sum, bill) => sum + bill.amount, 0)
  );
  document.documentElement.style.setProperty(
    "--ring-angle",
    `${(financialSnapshot.emergencyFundRatio / 100) * 360}deg`
  );
}

function renderUpcomingBills() {
  const list = document.getElementById("upcoming-list");

  financialSnapshot.upcomingBills.forEach((bill) => {
    const item = document.createElement("div");
    item.className = "bill-item";
    item.innerHTML = `
      <div class="transaction-row">
        <div class="transaction-meta">
          <strong>${bill.name}</strong>
          <span class="muted">Due ${bill.due}</span>
        </div>
        <strong>${currency.format(bill.amount)}</strong>
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
  const totalMonthly = financialSnapshot.subscriptions.reduce((sum, subscription) => sum + subscription.amount, 0);

  financialSnapshot.subscriptions.forEach((subscription) => {
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
  setText("subscription-count", `${financialSnapshot.subscriptions.length} active services`);
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

function setupNavigation() {
  const navItems = Array.from(document.querySelectorAll(".nav-item"));
  const linkButtons = Array.from(document.querySelectorAll("[data-view-link]"));
  const views = Array.from(document.querySelectorAll("[data-view-panel]"));
  const allButtons = [...navItems, ...linkButtons];

  function activate(viewId) {
    navItems.forEach((button) => {
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
setupNavigation();
