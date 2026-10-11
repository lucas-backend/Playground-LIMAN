Tidak semua. Paralel aman **hanya** bila file benar-benar terpisah dan fondasi bersama sudah beku.

## Syarat wajib sebelum paralel
1. **Bekukan fondasi dulu (serial):** API client + env, pola state (loading/error/empty), konvensi `api/hooks`, model role. Kalau tidak, tiap modul paralel akan mengarang adapter berbeda → duplikasi (`KD-07` masih `Proposed`).
2. **Bekukan router/rename.** Perbaikan nama file/route menyentuh `src/app/router.tsx` yang **dipakai bersama** (`GAP-FE-09`). Rename saat paralel = konflik.
3. **Satu modul = satu git worktree** (branch terpisah), merge berurutan. `lint`/`build` itu whole-repo; jangan jalan paralel di folder yang sama.

## Boleh paralel (folder terpisah, tak ada file bersama)
- Siswa: #3 Jadwal, #7 Latihan, #8 Passing Grade, #9 Minat Bakat siswa, #10 Notifikasi.
- Guru: #17 Tugas, #18 Penilaian, #19 Koreksi, #20 Remedial.
- BK: #21 Konseling, #22 Rekap, #23 Minat Bakat BK.
- Wali: #12 Absensi, #13 Rapot, #14 Konseling (subfolder beda).
- #11 Absensi Guru Mapel (folder sendiri).

## Harus serial (berbagi file/concern)
- **#1 → #2** (Auth, Dashboard): sama-sama menyentuh sesi/role + `router`/provider.
- **#15 → #16** (Bank Soal Latihan → Ujian): `bankSoalData.tsx` ≡ `bankSoalDataUjian.tsx` (`GAP-FE-08`). Konsolidasi di #15, #16 pakai ulang. Paralel = tabrakan.
- **#22 Rekap & #18 Penilaian**: duplikat `RekapNilai*` (`GAP-FE-08`) — serahkan konsolidasi ke satu sisi.
- Modul apa pun yang perlu mengubah `shared/*`, `app/router.tsx`, `types/*`, `data/*` → jangan paralel.

## Gelombang disarankan
1. **Gelombang 0 (serial):** #1 + fondasi API/state/role.
2. **Gelombang 1 (paralel):** #2 dulu, lalu #3, #7, #8, #9, #10.
3. **Gelombang 2 (paralel):** #11, #12, #13, #14.
4. **Gelombang 3 (paralel):** #15, #17, #18, #19, #20 (lalu #16 setelah #15).
5. **Gelombang 4 (paralel):** #21, #22, #23.
6. **#24 Admin terakhir** (butuh API modul lain).

Catatan: prompt migrasi Anda berbunyi "berhenti setelah satu modul". Paralel berarti menjalankan beberapa instance/sesi prompt sekaligus — bisa, tapi tiap instance harus scope 1 modul dan worktree sendiri.