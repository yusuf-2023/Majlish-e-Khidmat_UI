// src/utils/exportUtils.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Export JSON data to CSV format and prompt download
 * @param {Array} data - Array of objects to be exported
 * @param {string} filename - desired file name without extension
 */
export function exportToCSV(data, filename) {
  if (!data || !data.length) {
    return;
  }
  
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));
  
  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ("" + (row[header] ?? "")).replace(/"/g, '""'); // Escape quotes
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }
  
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Export JSON data to PDF file and prompt download
 * Uses jsPDF and jsPDF-AutoTable
 * @param {Array} data - Array of objects to be exported
 * @param {string} filename - desired file name without extension
 */
export function exportToPDF(data, filename) {
  if (!data || !data.length) {
    return;
  }

  const doc = new jsPDF();
  const headers = [Object.keys(data[0])];
  const rows = data.map(obj => Object.values(obj));

  autoTable(doc, {
    head: headers,
    body: rows,
    theme: 'striped',
  });

  doc.save(`${filename}.pdf`);
}
