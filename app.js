// Tetapan sumber data (pilih salah satu)
// 1) APPS_SCRIPT_URL (disyorkan untuk akaun MOE/private sheet)
// 2) PUBLISHED_SHEET_URL (sheet publish ke web)
// 3) SHEET_ID biasa
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyG86RW4y1iYwVKUuBT8Fu9u3KkDrNzV9qckorFf8JJ84E-r1LMyFFVR0OPZPpSpkSp/exec";
const PUBLISHED_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTbyBR7o1fXIm5AuiZQnxTnmcLHT5wrR3zj0rFso_SmQ49XzgSx8oA-xkUzbh9C4SXPGOWjn4BeukZF/pubhtml?gid=0&single=true";
const SHEET_ID = "";
const SHEET_NAME = "BAYARAN YURAN";

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

function normalizeRowsFromAppScript(rows) {
  return rows.map((row) => {
    const normalized = {};
    Object.keys(row).forEach((key) => {
      normalized[normalizeHeader(key)] = row[key];
    });
    return normalized;
  });
}

function parsePayload(rawText) {
  const trimmed = rawText.trim();

  if (trimmed.startsWith("google.visualization.Query.setResponse")) {
    return parseGoogleSheetResponse(trimmed);
  }

  const parsed = JSON.parse(trimmed);
  if (Array.isArray(parsed)) {
    return normalizeRowsFromAppScript(parsed);
  }

  if (Array.isArray(parsed.rows)) {
    return normalizeRowsFromAppScript(parsed.rows);
  }

  return [];
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

function buildDataUrl() {
  if (APPS_SCRIPT_URL) {
    const scriptUrl = new URL(APPS_SCRIPT_URL);
    scriptUrl.searchParams.set("sheet", SHEET_NAME);
    return scriptUrl.toString();
  }

  if (PUBLISHED_SHEET_URL) {
    const publishedUrl = new URL(PUBLISHED_SHEET_URL);
    const parts = publishedUrl.pathname.split("/").filter(Boolean);
    const keyIndex = parts.indexOf("e") + 1;
    const publishedKey = parts[keyIndex];
    const gid = publishedUrl.searchParams.get("gid") || "0";

    if (!publishedKey) throw new Error("PUBLISHED_SHEET_URL tidak sah.");

    const gvizUrl = new URL(`https://docs.google.com/spreadsheets/d/e/${publishedKey}/gviz/tq`);
    gvizUrl.searchParams.set("gid", gid);
    gvizUrl.searchParams.set("sheet", SHEET_NAME);
    return gvizUrl.toString();
  }

  if (!SHEET_ID) throw new Error("Tetapkan APPS_SCRIPT_URL, PUBLISHED_SHEET_URL atau SHEET_ID.");

  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(
    SHEET_NAME
  )}`;
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
  try {
    clearError();
    const url = buildDataUrl();

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const rawText = await response.text();
    records = parsePayload(rawText).filter((r) => r.nama);

    if (records.length === 0) {
      showError("Tiada data nama dijumpai. Sila semak kolum NAMA pada sumber data.");
      memberSelect.innerHTML = '<option>Tiada data</option>';
      return;
    }

    populateSelect(records);
  } catch (error) {
    showError(
      "Gagal memuatkan data. Semak APPS_SCRIPT_URL / link publish / SHEET_ID dan nama sheet."
    );
    memberSelect.innerHTML = '<option>Ralat memuatkan data</option>';
    console.error(error);
  }
}

loadData();
