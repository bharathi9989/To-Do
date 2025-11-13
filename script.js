// ------------------- STORAGE -------------------
const STORAGE_KEY = "transactions";
let currentEditId = null;
let currentFilter = "all"; // ⭐ Filter state

// ------------------- DOM ELEMENTS -------------------
const form = document.getElementById("transactionForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const errorMsg = document.getElementById("errorMsg");

const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const netBalance = document.getElementById("netBalace");

const entriesList = document.getElementById("entriesList");
const emptyState = document.getElementById("emptyState");

const filterRadios = document.querySelectorAll(".filter-radio");

// ------------------- LOAD OLD DATA -------------------
let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ------------------- FORM SUBMIT -------------------
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = document.querySelector('input[name="type"]:checked').value;

  // VALIDATION
  if (!description || isNaN(amount) || amount <= 0) {
    errorMsg.textContent = "⚠️ Please enter valid description and amount!";
    errorMsg.classList.remove("hidden");
    return;
  }

  errorMsg.classList.add("hidden");

  // UPDATE MODE
  if (currentEditId !== null) {
    const index = transactions.findIndex((t) => t.id === currentEditId);

    transactions[index] = {
      ...transactions[index],
      description,
      amount,
      type,
    };

    currentEditId = null;
    saveBtn.textContent = "Add";
  } else {
    // ADD MODE
    const transaction = {
      id: Date.now(),
      description,
      amount,
      type,
    };

    transactions.push(transaction);
  }

  // SAVE EVERYTHING
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));

  form.reset();
  updateUI();
});

// ------------------- FILTER HANDLING -------------------
filterRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    currentFilter = e.target.value; // all / income / expense
    renderEntries();
  });
});

// ------------------- UPDATE UI -------------------
function updateUI() {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  totalIncome.textContent = `₹${income.toFixed(2)}`;
  totalExpense.textContent = `₹${expense.toFixed(2)}`;
  netBalance.textContent = `₹${balance.toFixed(2)}`;

  renderEntries();
}

// ------------------- RENDER ENTRIES -------------------
function renderEntries() {
  entriesList.innerHTML = "";

  // ⭐ FILTER LOGIC
  let filtered = [];
  if (currentFilter === "all") {
    filtered = transactions;
  } else {
    filtered = transactions.filter((t) => t.type === currentFilter);
  }

  // NO ITEMS
  if (filtered.length === 0) {
    if (currentFilter === "income") {
      emptyState.textContent = "No income entries yet.";
    } else if (currentFilter === "expense") {
      emptyState.textContent = "No expense entries yet.";
    } else {
      emptyState.textContent =
        "No entries yet. Add your income or expense above.";
    }

    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  // DISPLAY ITEMS
  filtered.forEach((t) => {
    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center bg-white p-3 rounded-lg shadow";

    li.innerHTML = `
      <div>
        <p class="font-medium">${t.description}</p>
        <p class="text-sm text-gray-500">${t.type.toUpperCase()}</p>
      </div>

      <div class="flex items-center gap-3">
        <span class="${
          t.type === "income" ? "money-positive" : "money-negative"
        } font-bold">
          ₹${t.amount.toFixed(2)}
        </span>

        <button class="text-blue-600 edit-btn" data-id="${t.id}">Edit</button>
        <button class="text-red-600 delete-btn" data-id="${
          t.id
        }">Delete</button>
      </div>
    `;

    entriesList.appendChild(li);
  });
}

// ------------------- DELETE + EDIT HANDLING -------------------
entriesList.addEventListener("click", (e) => {
  const id = e.target.getAttribute("data-id");

  if (e.target.classList.contains("delete-btn")) {
    deleteEntry(id);
  }

  if (e.target.classList.contains("edit-btn")) {
    loadEntryForEdit(id);
  }
});

// ------------------- DELETE FUNCTION -------------------
function deleteEntry(id) {
  transactions = transactions.filter((t) => t.id != id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  updateUI();
}

// ------------------- LOAD ENTRY TO EDIT -------------------
function loadEntryForEdit(id) {
  const entry = transactions.find((t) => t.id == id);

  descriptionInput.value = entry.description;
  amountInput.value = entry.amount;

  document.querySelector(
    `input[name="type"][value="${entry.type}"]`
  ).checked = true;

  currentEditId = entry.id;
  saveBtn.textContent = "Update";
}

// INITIAL RENDER
updateUI();
