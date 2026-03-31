# Kelab Kebajikan Sasera

Web semakan yuran untuk guru dan staf berdasarkan data Google Sheet.

## Kolum Google Sheet (wajib)

Susunan kolum yang digunakan:

`BIL | NAMA | BAKI 2025 | JAN | FEB | MAC | APR | MEI | JUN | JUL | OGO | SEP | OKT | JUMLAH | PROGRESS BAR`

> Nota: Nama kolum perlu sama seperti di atas.

## Cara guna

1. Buka fail `app.js`.
2. Gantikan nilai `SHEET_ID` dengan ID Google Sheet anda.
3. Ubah `SHEET_NAME` jika nama tab bukan `Sheet1`.
4. Pastikan Google Sheet telah di-**Publish to web**.
5. Buka `index.html` di pelayar.

## Apa yang dipaparkan

- Jumlah yuran dibayar (`JUMLAH`)
- Baki semasa (`BAKI 2025`)
- Ringkasan bayaran bulanan (JAN hingga OKT)
- Progress bar (jika kolum `PROGRESS BAR` ada nilai)
