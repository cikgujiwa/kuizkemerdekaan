# Kelab Kebajikan Sasera

Web semakan yuran untuk guru dan staf berdasarkan data Google Sheet.

## Kolum Google Sheet (wajib)

`BIL | NAMA | BAKI 2025 | JAN | FEB | MAC | APR | MEI | JUN | JUL | OGO | SEP | OKT | JUMLAH | PROGRESS BAR`

## Anda minta guna Apps Script (akaun MOE)

Fail Apps Script sudah disediakan di: `apps-script/Code.gs`.

### Langkah setup Apps Script

1. Buka [script.google.com](https://script.google.com) dengan akaun MOE.
2. Cipta project baru, salin kandungan `apps-script/Code.gs`.
3. Dalam `Code.gs`, isi `SHEET_ID` anda pada:
   - `var SHEET_ID = 'GANTI_DENGAN_SHEET_ID_ANDA';`
4. Deploy -> **New deployment** -> type **Web app**:
   - **Execute as**: Me
   - **Who has access**: Anyone within MOE (atau ikut polisi)
5. Copy URL web app (biasanya berakhir dengan `/exec`).
6. Buka `app.js`, isi:

```js
const APPS_SCRIPT_URL = "URL_APPS_SCRIPT_EXEC_ANDA";
```

7. (Opsyen) kosongkan `PUBLISHED_SHEET_URL` jika tak guna publish link.
8. Buka `index.html`.

## Keutamaan sumber data dalam app.js

Aplikasi akan cuba sumber data ikut turutan ini:
1. `APPS_SCRIPT_URL`
2. `PUBLISHED_SHEET_URL`
3. `SHEET_ID`

## Konfigurasi semasa

- `SHEET_NAME` ditetapkan kepada `BAYARAN YURAN`.
- `PUBLISHED_SHEET_URL` masih ada sebagai fallback.

