# Kelab Kebajikan Sasera

Web ringkas untuk guru dan staf melihat jumlah bayaran yuran yang telah dibayar.

## Cara guna

1. Buka fail `app.js`.
2. Gantikan nilai `SHEET_ID` dengan ID Google Sheet anda.
3. Jika perlu, ubah `SHEET_NAME` (contoh: `Sheet1`).
4. Pastikan Google Sheet:
   - mempunyai kolum: `nama`, `jawatan`, `jumlah_bayaran`
   - telah di-**Publish to web**
5. Buka `index.html` di pelayar.

## Contoh struktur data

| nama | jawatan | jumlah_bayaran |
| --- | --- | --- |
| Siti Aisyah | Guru Matematik | 120 |
| Ahmad Faiz | Staf Pejabat | 100 |

