const STORAGE_KEY = "transaction-v1";
let editingId = null;

// Elements

const descInput = document.getElementById("description").value.trim();
const amountInput = parseFloat(document.getElementById("amount").value);
const form = document.getElementById("transactionForm");
const saveBtn = document.getElementById("saveBtn");
const resetFormBtn = document.getElementById("resetFormBtn");

const transactionForm = document.getElementById("transactionForm");

const type = document.querySelector(`input[name="type"]:checked`).value;

const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const netBalance = document.getElementById("netBalace");

const entryList = document.getElementById("entriesList");
const emptyState = document.getElementById("emptyState");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

const erroMessage = document.getElementById("errorMsg");
erroMessage.textContent = "";

if (!descInput || !isNaN(amountInput) || amount <= 0) {
  erroMessage.textContent = "⚠️ Please enter valid description and amount ‼️ ";
  erroMessage.classList.remove("hidden");
  // return;
} else {
  errorMsg.classList.add("hidden");
}

const transaction = {
  id: Date.now(),
  descInput,
  amountInput,
  type,
};

transactions.push(transaction);

localStorage.setItem("transactions", JSON.stringify(transactions));

transactionForm.reset();

// updateUI();

function updateUI() {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  totalIncome.textContent = `₹ ${income.toFixed(2)}`;
  totalExpense.textContent = `₹ ${expense.toFixed(2)}`;
  netBalance.textContent = `₹ ${balance.toFixed(2)}`;

  renderEntries();
}

function renderEntries() {
  entryList.innerHTML = "";

  if (transactions.leangth === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  transactions.forEach((t) => {
    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center bg-white p-3 rounded-lg shadow";

    li.innerHTML = `<div>
    <p class= "font-medium">${t.descInput}</p>
    <p class= "text-sm text-red-500">${t.type.toUppercase()}</p>
    <p class= "font-medium">${t.descInput}</p>
    </div>
    <div class ="flex item-center gap-3">
    <span class =${
      t.type === "income" ? "money-positive" : "money-negative"
    }>₹${t.amount.toFixed(2)}</span>
      <button class="text-blue-600 edit-btn" data-id="${t.id}">Edite</button>
      <button class="text-blue-600 edit-btn" data-id="${t.id}">Delete</button>
    </div>`;
  });
}
