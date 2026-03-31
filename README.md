# Kelab Kebajikan Sasera

Web semakan yuran untuk guru dan staf berdasarkan data Google Sheet.

## Kolum Google Sheet (wajib)

Susunan kolum yang digunakan:

`BIL | NAMA | BAKI 2025 | JAN | FEB | MAC | APR | MEI | JUN | JUL | OGO | SEP | OKT | JUMLAH | PROGRESS BAR`

> Nota: Nama kolum perlu sama seperti di atas.

## Cara dapatkan `SHEET_ID`

1. Buka Google Sheet anda.
2. Lihat URL, contoh:
   `https://docs.google.com/spreadsheets/d/1AbCdEfGhIJkLmNoPqRsTuVwXyZ1234567890/edit#gid=0`
3. Nilai `SHEET_ID` ialah teks **di antara** `/d/` dan `/edit`.
   - Untuk contoh di atas, `SHEET_ID` ialah `1AbCdEfGhIJkLmNoPqRsTuVwXyZ1234567890`
4. Salin nilai itu ke `app.js`:
   - `const SHEET_ID = "PASTE_SHEET_ID_DI_SINI";`

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
