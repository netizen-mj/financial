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
  });
}

function renderTransactions() {
  const list = document.getElementById("transaction-list");

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
  });
}

renderOverview();
renderUpcomingBills();
renderBudgets();
renderSubscriptions();
renderTransactions();
