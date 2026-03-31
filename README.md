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


## Untuk akaun MOE (akses terhad)

Ya, **boleh guna `SHEET_ID`**, tapi ada syarat penting:

- Jika sheet hanya boleh diakses warga MOE (tidak public), web statik biasa **tidak boleh** baca terus data itu dari browser tanpa mekanisme login/token.
- `SHEET_ID` sahaja tidak cukup jika akses sheet masih private.

Pilihan praktikal:

1. **Publish to web** (paling mudah) jika polisi MOE benarkan.
2. Guna **Google Apps Script Web App** sebagai perantara (output JSON), dan hadkan akses kepada domain MOE.
3. Jika perlu kekal private sepenuhnya, guna backend sendiri yang pegang OAuth/service account dan web frontend panggil backend itu.

