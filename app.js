// Tetapan Google Sheet
const SHEET_ID = "GANTI_DENGAN_SHEET_ID";
const SHEET_NAME = "Sheet1";

const memberSelect = document.getElementById("memberSelect");
const resultEl = document.getElementById("result");
const errorEl = document.getElementById("error");

let records = [];

function showError(message) {
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
}

function clearError() {
  errorEl.classList.add("hidden");
  errorEl.textContent = "";
}

function formatCurrency(value) {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function renderResult(record) {
  const nama = record.nama ?? "Tanpa nama";
  const jawatan = record.jawatan ?? "-";
  const jumlah = formatCurrency(record.jumlah_bayaran);

  resultEl.innerHTML = `
    <strong>${nama}</strong><br />
    Jawatan: ${jawatan}<br />
    Jumlah yuran dibayar: <strong>${jumlah}</strong>
  `;
  resultEl.classList.remove("hidden");
}

function parseGoogleSheetResponse(rawText) {
  // Respons Google Visualization bermula dengan: google.visualization.Query.setResponse(...)
  const jsonText = rawText
    .replace(/^.*setResponse\(/, "")
    .replace(/\);?\s*$/, "");
  const parsed = JSON.parse(jsonText);

  const cols = parsed.table.cols.map((c) => c.label.trim().toLowerCase());
  return parsed.table.rows.map((row) => {
    const values = row.c.map((cell) => (cell ? cell.v : ""));
    const item = {};
    cols.forEach((col, index) => {
      item[col] = values[index];
    });
    return {
      nama: item.nama,
      jawatan: item.jawatan,
      jumlah_bayaran: item.jumlah_bayaran,
    };
  });
}

function populateSelect(data) {
  memberSelect.innerHTML = '<option value="">-- Pilih nama --</option>';

  data.forEach((record, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${record.nama ?? "Tanpa nama"}`;
    memberSelect.appendChild(option);
  });

  memberSelect.disabled = false;
}

memberSelect.addEventListener("change", (event) => {
  const idx = event.target.value;
  if (idx === "") {
    resultEl.classList.add("hidden");
    return;
  }
  renderResult(records[Number(idx)]);
});

async function loadData() {
  if (SHEET_ID === "GANTI_DENGAN_SHEET_ID") {
    showError(
      "Sila kemas kini SHEET_ID dalam app.js terlebih dahulu sebelum guna sistem ini."
    );
    memberSelect.innerHTML = '<option>Sila tetapkan SHEET_ID</option>';
    return;
  }

  clearError();
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(
    SHEET_NAME
  )}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const rawText = await response.text();
    records = parseGoogleSheetResponse(rawText).filter((r) => r.nama);

    if (records.length === 0) {
      showError("Data tidak dijumpai. Sila semak kandungan Google Sheet.");
      memberSelect.innerHTML = '<option>Tiada data</option>';
      return;
    }

    populateSelect(records);
  } catch (error) {
    showError(
      "Gagal memuatkan data Google Sheet. Sila semak akses Publish to web dan nama sheet."
    );
    memberSelect.innerHTML = '<option>Ralat memuatkan data</option>';
    console.error(error);
  }
}

loadData();
