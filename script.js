const user = localStorage.getItem("loggedUser");
let users = JSON.parse(localStorage.getItem("users")) || {};
let transactions = users[user]?.transactions || [];
let premiumActive = false;

const form = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const date = new Date(document.getElementById('date').value);

  if (!description || isNaN(amount) || !date) return alert('Preencha todos os campos.');

  const transaction = { description, amount, date: date.toISOString() };
  transactions.push(transaction);
  saveTransactions();
  updateDashboard();
  renderTransactions();
  form.reset();
});

function saveTransactions() {
  users[user].transactions = transactions;
  localStorage.setItem("users", JSON.stringify(users));
}

function renderTransactions() {
  transactionList.innerHTML = '';
  transactions.forEach(t => {
    const date = new Date(t.date);
    const li = document.createElement('li');
    li.textContent = `${t.description} - R$ ${t.amount.toFixed(2)} (${date.toLocaleDateString()})`;
    transactionList.appendChild(li);
  });
}

function updateDashboard() {
  const now = new Date();
  let weekTotal = 0;
  let monthTotal = 0;
  let income = 0;

  const chartData = {};

  transactions.forEach(t => {
    const date = new Date(t.date);
    const timeDiff = (now - date) / (1000 * 60 * 60 * 24);
    if (timeDiff <= 7) weekTotal += t.amount;
    if (date.getMonth() === now.getMonth()) monthTotal += t.amount;
    if (t.amount > 0) income += t.amount;

    const day = date.toLocaleDateString();
    chartData[day] = (chartData[day] || 0) + t.amount;
  });

  document.getElementById('weekly-expense').textContent = weekTotal.toFixed(2);
  document.getElementById('monthly-expense').textContent = monthTotal.toFixed(2);
  document.getElementById('savings').textContent = (income - Math.abs(monthTotal - income)).toFixed(2);

  if (premiumActive) {
    generateInvestmentTips(income - Math.abs(monthTotal - income));
  }

  updateChart(chartData);
  updateMonthComparison();
}

function togglePremium() {
  premiumActive = !premiumActive;
  document.getElementById('premium-section').classList.toggle('hidden');
  updateDashboard();
}

function
