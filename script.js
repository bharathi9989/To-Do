const STORAGE_KEY = "transaction-v1";
let transactions = [];
let editingId = null;

// Elements

const descInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const form = document.getElementById("transactionForm");
const saveBtn = document.getElementById("saveBtn");
const resetFormBtn = document.getElementById("resetFormBtn");

const totalIncomeE1 = document.getElementById("totalIncome");
const totalExpenseE1 = document.getElementById("totalExpense");
const netBalanceE1 = document.getElementById("netBalace");

const entryList = document.getElementById("entriesList");
const emptyState = document.getElementById("emptyState");

function localFormStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    transactions = raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.log("Failed to parse transaction from locaal storage", err);
    transactions = [];
  }
}

function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}
function currencyFormate() {
  const value = Number(n || 0);
  return "₹" + value.toFixed(2);
}

function calculateTotal(list = transactions) {
  const income = list
    .filter((t) => t.type == "income")
    .reduce((sum, t) => sum + Number(t.amound || 0), 0);
  return { income, expense, net: income - expense };
}
function renderTotals() {
  const { income, expense, net } = calculateTotal();
  totalIncomeE1.textContent = currencyFormate(income);
  totalExpenseE1.textContent = currencyFormate(expense);
  netBalanceE1.textContent = currencyFormate(net);
  netBalanceE1.className =
    net >= 0
      ? "text-2xl font-bold money-positive"
      : " text-2xl font-bold money-negative";
}

function getActiveFilter() {
  const f = document.querySelector('input[name="filter"]:checked');
  return f ? f.value : "all";
}

// -----------     ----------———---
