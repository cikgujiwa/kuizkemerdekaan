# Kelab Kebajikan Sasera

Web semakan yuran untuk guru dan staf berdasarkan data Google Sheet.

## Kolum Google Sheet (wajib)

Susunan kolum yang digunakan:

`BIL | NAMA | BAKI 2025 | JAN | FEB | MAC | APR | MEI | JUN | JUL | OGO | SEP | OKT | JUMLAH | PROGRESS BAR`

> Nota: Nama kolum perlu sama seperti di atas.

## Konfigurasi semasa (siap diisi)

- `PUBLISHED_SHEET_URL` telah diisi dengan pautan yang anda beri.
- `SHEET_NAME` telah ditetapkan kepada `BAYARAN YURAN`.

Jika anda tukar sheet lain pada masa depan, kemas kini nilai ini dalam `app.js`.

## Cara guna

1. Pastikan Google Sheet telah di-**Publish to web**.
2. Semak nilai dalam `app.js`:
   - `PUBLISHED_SHEET_URL`
   - `SHEET_NAME`
3. Buka `index.html` di pelayar.

## Pilihan konfigurasi alternatif

Jika tak guna link publish (`/d/e/.../pubhtml`), anda boleh kosongkan `PUBLISHED_SHEET_URL` dan guna `SHEET_ID` biasa:

```js
const PUBLISHED_SHEET_URL = "";
const SHEET_ID = "ID_SHEET_BIASA";
const SHEET_NAME = "BAYARAN YURAN";
```

## Apa yang dipaparkan

- Jumlah yuran dibayar (`JUMLAH`)
- Baki semasa (`BAKI 2025`)
- Ringkasan bayaran bulanan (JAN hingga OKT)
- Progress bar (jika kolum `PROGRESS BAR` ada nilai)
