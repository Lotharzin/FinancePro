let transactions = [];
let premiumActive = false;

const form = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const date = new Date(document.getElementById('date').value);

  if (!description || isNaN(amount) || !date) return alert('Preencha todos os campos.');

  const transaction = { description, amount, date };
  transactions.push(transaction);

  updateDashboard();
  renderTransactions();

  form.reset();
});

function renderTransactions() {
  transactionList.innerHTML = '';
  transactions.forEach(t => {
    const li = document.createElement('li');
    li.textContent = `${t.description} - R$ ${t.amount.toFixed(2)} (${t.date.toLocaleDateString()})`;
    transactionList.appendChild(li);
  });
}

function updateDashboard() {
  const now = new Date();
  let weekTotal = 0;
  let monthTotal = 0;
  let income = 0;

  transactions.forEach(t => {
    const timeDiff = (now - t.date) / (1000 * 60 * 60 * 24);
    if (timeDiff <= 7) weekTotal += t.amount;
    if (t.date.getMonth() === now.getMonth()) monthTotal += t.amount;
    if (t.amount > 0) income += t.amount;
  });

  document.getElementById('weekly-expense').textContent = weekTotal.toFixed(2);
  document.getElementById('monthly-expense').textContent = monthTotal.toFixed(2);
  document.getElementById('savings').textContent = (income - Math.abs(monthTotal - income)).toFixed(2);

  if (premiumActive) {
    generateInvestmentTips(income - Math.abs(monthTotal - income));
  }
}

function togglePremium() {
  premiumActive = !premiumActive;
  document.getElementById('premium-section').classList.toggle('hidden');
  updateDashboard();
}

function generateInvestmentTips(savings) {
  const tips = [];

  if (savings <= 0) {
    tips.push("Você está gastando mais do que ganha. Reveja seus custos fixos e tente economizar.");
  } else {
    tips.push(`Você pode investir cerca de R$ ${savings.toFixed(2)} este mês.`);
    tips.push("💰 50% em Renda Fixa (Tesouro Direto, CDBs)");
    tips.push("🏢 30% em Fundos Imobiliários");
    tips.push("📈 20% em ações de empresas sólidas (Blue Chips)");
    tips.push("📊 Use uma corretora confiável e diversifique sempre.");
  }

  const tipDiv = document.getElementById('investment-tips');
  tipDiv.innerHTML = '<ul>' + tips.map(t => `<li>${t}</li>`).join('') + '</ul>';
}
