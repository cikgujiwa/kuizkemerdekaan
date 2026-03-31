// Tetapan Google Sheet
const SHEET_ID = "GANTI_DENGAN_SHEET_ID";
const SHEET_NAME = "Sheet1";

const memberSelect = document.getElementById("memberSelect");
const resultEl = document.getElementById("result");
const errorEl = document.getElementById("error");

const MONTH_KEYS = ["jan", "feb", "mac", "apr", "mei", "jun", "jul", "ogo", "sep", "okt"];

let records = [];

function showError(message) {
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
}

function clearError() {
  errorEl.classList.add("hidden");
  errorEl.textContent = "";
}

function normalizeHeader(header) {
  return String(header || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function parseAmount(value) {
  if (typeof value === "number") return value;
  const cleaned = String(value ?? "")
    .replace(/[^0-9,.-]/g, "")
    .replace(/,/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(parseAmount(value));
}

function getProgress(record) {
  const raw = record["progress bar"];
  if (typeof raw === "number") {
    return Math.max(0, Math.min(100, Math.round(raw * (raw <= 1 ? 100 : 1))));
  }

  const text = String(raw ?? "").trim();
  if (text.endsWith("%")) {
    const parsedPercent = Number(text.replace("%", ""));
    if (Number.isFinite(parsedPercent)) return Math.max(0, Math.min(100, Math.round(parsedPercent)));
  }

  const parsed = Number(text);
  if (Number.isFinite(parsed)) {
    return Math.max(0, Math.min(100, Math.round(parsed * (parsed <= 1 ? 100 : 1))));
  }

  return null;
}

function renderMonthlyBreakdown(record) {
  return MONTH_KEYS.map((month) => {
    const paid = parseAmount(record[month]);
    return `<li><span>${month.toUpperCase()}</span><strong>${formatCurrency(paid)}</strong></li>`;
  }).join("");
}

function renderResult(record) {
  const nama = record.nama || "Tanpa nama";
  const jumlah = parseAmount(record.jumlah);
  const baki = parseAmount(record["baki 2025"]);
  const progress = getProgress(record);

  resultEl.innerHTML = `
    <h3>${nama}</h3>
    <p class="summary">Jumlah yuran dibayar: <strong>${formatCurrency(jumlah)}</strong></p>
    <p class="summary">Baki 2025: <strong>${formatCurrency(baki)}</strong></p>
    ${
      progress !== null
        ? `<div class="progress-wrap"><div class="progress-label">Progress: ${progress}%</div><div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div></div>`
        : ""
    }
    <h4>Bayaran Bulanan</h4>
    <ul class="monthly-list">
      ${renderMonthlyBreakdown(record)}
    </ul>
  `;

  resultEl.classList.remove("hidden");
}

function parseGoogleSheetResponse(rawText) {
  const jsonText = rawText
    .replace(/^.*setResponse\(/, "")
    .replace(/\);?\s*$/, "");
  const parsed = JSON.parse(jsonText);

  const cols = parsed.table.cols.map((c) => normalizeHeader(c.label));
  return parsed.table.rows.map((row) => {
    const values = row.c.map((cell) => (cell ? cell.v : ""));
    const item = {};
    cols.forEach((col, index) => {
      item[col] = values[index];
    });
    return item;
  });
}

function populateSelect(data) {
  memberSelect.innerHTML = '<option value="">-- Pilih nama --</option>';

  data.forEach((record, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = record.nama || `Rekod ${index + 1}`;
    memberSelect.appendChild(option);
  });

  memberSelect.disabled = false;
}

memberSelect.addEventListener("change", (event) => {
  const idx = event.target.value;
  if (!idx) {
    resultEl.classList.add("hidden");
    return;
  }
  renderResult(records[Number(idx)]);
});

async function loadData() {
  if (SHEET_ID === "GANTI_DENGAN_SHEET_ID") {
    showError("Sila kemas kini SHEET_ID dalam app.js sebelum guna sistem ini.");
    memberSelect.innerHTML = '<option>Sila tetapkan SHEET_ID</option>';
    return;
  }

  clearError();

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(
    SHEET_NAME
  )}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const rawText = await response.text();
    records = parseGoogleSheetResponse(rawText).filter((r) => r.nama);

    if (records.length === 0) {
      showError("Tiada data nama dijumpai. Sila semak kolum NAMA pada Google Sheet.");
      memberSelect.innerHTML = '<option>Tiada data</option>';
      return;
    }

    populateSelect(records);
  } catch (error) {
    showError(
      "Gagal memuatkan data Google Sheet. Pastikan sheet dipublish dan nama sheet betul."
    );
    memberSelect.innerHTML = '<option>Ralat memuatkan data</option>';
    console.error(error);
  }
}

loadData();
