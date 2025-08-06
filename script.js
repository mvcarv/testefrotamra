const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRA_7-CD28oqfaKtPDMubzfg2G6UvTB2tEhfU4NUuFCDPp3qbwY5S77GHbeWqdnJBuJSXwvtyjQAjsp/pub?output=xlsx";

async function fetchSheetXLSX() {
  const res = await fetch(sheetUrl);
  const blob = await res.blob();
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}

async function loadData() {
  const u8 = await fetchSheetXLSX();
  const wb = XLSX.read(u8, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws, { header: 1 });
}

async function showVehicle() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  if (!id) {
    document.getElementById("dados").innerText = "ID não informado.";
    return;
  }

  const arr = await loadData();
  const headers = arr[0];
  const rows = arr.slice(1);
  const index = headers.indexOf("ID");

  const row = rows.find(r => r[index] === id);
  if (!row) {
    document.getElementById("dados").innerText = "Veículo não encontrado.";
    return;
  }

  const obj = {};
  headers.forEach((h, i) => obj[h] = row[i]);

  const html = `
    <p><strong>ID:</strong> ${obj.ID}</p>
    <p><strong>Chassi:</strong> ${obj.Chassi}</p>
    <p><strong>Modelo:</strong> ${obj.Modelo}</p>
    <p><strong>Revisões:</strong> ${obj.Revisões}</p>
    <p><strong>Histórico:</strong> ${obj.Histórico}</p>
    <p><strong>Gastos:</strong> ${obj.Gastos}</p>
    <p><strong>Situação:</strong> ${obj.Situação}</p>
  `;
  document.getElementById("dados").innerHTML = html;
}

window.addEventListener("DOMContentLoaded", showVehicle);
