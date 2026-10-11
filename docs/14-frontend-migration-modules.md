# 14 — Frontend Migration: Daftar Modul (Phase 3 — Feature-by-Feature)

- **Status:** Draft untuk ditinjau (perencanaan; **belum ada kode yang diubah**)
- **Versi:** 0.1
- **Tanggal:** 2026-10-11
- **Branch:** `refactor`
- **Dokumen terkait:** [05-sdd.md](./05-sdd.md) · [11-frontend-refactor-migration-plan.md](./11-frontend-refactor-migration-plan.md) · [12-frontend-foundation.md](./12-frontend-foundation.md) · [13-frontend-shell-routing-shared-ui.md](./13-frontend-shell-routing-shared-ui.md) · [03-srs.md](./03-srs.md) · [07-uat-checklist.md](./07-uat-checklist.md)

> **Tujuan dokumen.** Menyediakan **daftar modul fitur** frontend yang dapat dimigrasikan satu per satu menuju arsitektur di [05-sdd.md](./05-sdd.md), beserta route, lokasi kode, dan requirement terkait. Dokumen ini **tidak mengubah** kode, dependency, konfigurasi, maupun dokumen spesifikasi.

## 1. Cara Memakai Dokumen Ini

1. Ambil **satu baris** dari tabel §3.
2. Jalankan prompt migrasi (feature-by-feature) dan isi placeholder:
   - `Nama modul` → kolom **Modul**.
   - `Halaman atau route` → kolom **Route**.
   - `Requirement` → kolom **Requirement**.
3. Migrasikan **hanya modul tersebut**, lalu berhenti.
4. Lanjut ke baris berikutnya pada sesi terpisah.

## 2. Sudah Selesai (jangan diulang)

Per [12-frontend-foundation.md](./12-frontend-foundation.md) dan [13-frontend-shell-routing-shared-ui.md](./13-frontend-shell-routing-shared-ui.md), hal berikut **bukan** modul fitur dan sudah ditangani Phase 1/Phase 2:

- Fondasi: `@/` alias, `shared/api`, `shared/types`, `styles/tokens.css` (Phase 1).
- Shell: `app/App.tsx`, `app/router.tsx`, `app/providers` (Phase 2).
- Routing berlapis: `PublicLayout`, `ProtectedLayout` (Phase 2).
- Shared UI: `shared/components/{ui,layout,state}`, `shared/pages` (Phase 2).
- Sesi: `shared/session/*` (abstraksi; autentikasi nyata belum ada).

## 3. Daftar Modul (urutan disarankan)

Urutan dari risiko/kecil ke besar, dengan dependensi fungsional diperhatikan (mis. Auth & Dashboard bergantung lapisan API client/sesi; Absensi adalah inti GOAL).

| # | Modul | Feature folder | Route utama | Requirement | Catatan |
| --- | --- | --- | --- | --- | --- |
| 1 | Login / Auth | `src/features/login` | `/login` | FR-AUTH-001..006 | Rancang ulang (GAP-FE-01). Bergantung kontrak auth (`KD-07`/`KD-09`). |
| 2 | Dashboard per peran | `src/features/dashboard` | `/dashboard` | FR-DASH-001 | Mock → role dari `/auth/me` (GAP-FE-13). `BottomNav` hanya komentar (AUD-010). |
| 3 | Jadwal | `src/features/jadwal` | `/jadwal-siswa/*` | FR-JADWAL-001 | Tipe `types/jadwal.ts` + `data/jadwal/*` ikut modul ini. |
| 4 | Quiz (kerjakan) | `src/features/quiz` | `/quiz/:quiz_id/*` | FR-QUIZ-001 | Punya 1 context + 5 tipe jawaban; pertahankan. |
| 5 | Hasil Quiz | `src/features/quiz-result` | `/quiz_result/*` | FR-QUIZ-002 | — |
| 6 | Riwayat Quiz | `src/features/riwayat-quiz` | `/riwayat/*` | FR-QUIZ-002 | — |
| 7 | Latihan Soal (siswa) | `src/features/latihan-soal` | `/latihan-soal`, `/latihan-soal/mapel/:mapel_id` | FR-LATIHAN-001 | — |
| 8 | Passing Grade | `src/features/passing-grade` | `/passing_grade/*` | FR-PG-001 | Prioritas Could. |
| 9 | Hasil Minat Bakat (siswa) | `src/features/hasil-minat-bakat` | `/hasil_minat_bakat/*` | FR-MB-001/002 | `Dropdown.tsx` tak dipakai (AUD-010). |
| 10 | Notifikasi | `src/features/notifikasi` | `/notifikasi` | FR-NOTIF-001 | Prioritas Could. |
| 11 | Absensi Guru Mapel | `src/features/guruMapel/absensi` | `/guruMapel/absensi*`, `/detail/siswa/:id` | FR-ABS-002/003/009 | Inti GOAL. `DaftarSiswaTab` ada unused var (F0). |
| 12 | Absensi Guru Wali | `src/features/guruWali/absensi` (+ `MenuWaliKelas`) | `/guruWali/absensi/*` | FR-ABS-003 | 8 berkas `guruWali/**` punya unused `React` (F0). |
| 13 | Rapot Guru Wali | `src/features/guruWali/rapotSiswa` | `/guruWali/rapot/*` | FR-RAPOT-001/002 | — |
| 14 | Konseling Guru Wali | `src/features/guruWali/konselingWali` | `/guruWali/konseling/*` | FR-KONSELING-001/002 | Ada navigasi literal tanpa substitusi param (GAP-FE-05). |
| 15 | Bank Soal Latihan (guru) | `src/features/guru/LatihanSoal` | `/guru/latihanSoal*` | FR-BANK-001/002 | `bankSoalData.tsx` ≡ `bankSoalDataUjian.tsx` (GAP-FE-08) — konsolidasi di sini. |
| 16 | Bank Soal Ujian (guru) | `src/features/guru/Ujian` | `/guru/ujian/*` | FR-BANK-001/002 | Pakai ulang hasil konsolidasi #15; perbaikan route/impor sudah Phase 2. |
| 17 | Tugas (guru) | `src/features/guru/Tugas` | `/guru/tugas*` | FR-TUGAS-001 | Punya `components/*`; pertahankan pola. |
| 18 | Penilaian (guru) | `src/features/guru/Penilaian` | `/guru/penilaian*` | FR-NILAI-001 | Typo `GuruPenialaianKelasSiswa.tsx` (GAP-FE-09). |
| 19 | Koreksi (guru) | `src/features/guru/Koreksi` | `/guru/koreksi/*` | FR-KORESI-001 | — |
| 20 | Remedial (guru) | `src/features/guru/Remedial` | `/guru/remedial` | FR-KORESI-002 | Placeholder kosong (DEC-09). |
| 21 | Konseling BK | `src/features/guruBK/Konseling` | `/guruBK/konseling/*` | FR-KONSELING-001 | — |
| 22 | Rekap BK | `src/features/guruBK/Rekap` | `/guruBK/rekap/*`, `/rekap/*` | FR-REKAP-001/002 | Alias route ganda (`C-06`); `shared.tsx` pernah langgar `react-refresh` (F0). |
| 23 | Minat Bakat BK | `src/features/guruBK/MinatBakat` | `/guruBK/minatBakat/*` | FR-MB-001 | `KelasCard` lokal (GAP-FE-08). |
| 24 | Admin | `src/features/admin` (+ `section/*`) | `/admin/*` | FR-ADMIN-001..003 | Belum lengkap; aksi hanya `console.log` (GAP-FE-14). |

## 4. Bukan Kandidat Modul

- `src/shared/*`, `src/app/*` — sudah Phase 1/2 (§2).
- `src/features/dashboard/components/BottomNav` — hanya baris komentar (AUD-010); ditangani di #2.
- `src/config/*`, `src/styles/*`, `src/types/*`, `src/data/*` — fondasi/lintas-fitur.
- `public/*`, `dist/*` — asset/build.

## 5. Blocker & Batasan (jujur)

- **Kontrak API masih `Proposed`** (`KD-07`); **auth backend & model sesi belum ada** (`KD-09` `Blocked`). Modul yang memanggil backend belum dapat diintegrasikan; gunakan mock adapter sampai kontrak `Approved`.
- **Autentikasi belum diimplementasikan**; `ProtectedLayout` belum menolak akses (status `unavailable`).
- **Belum ada tooling test** (`npm test` tidak ada). Verifikasi migrasi modul terbatas pada `npm run lint`, `npx tsc -b`, `npm run build`, dan uji manual `npm run dev`.
- Jangan menyatakan modul "selesai terintegrasi backend" selama kontrak `Proposed` dan mock masih dipakai.

## 6. Traceability

| Sumber | Dipakai untuk |
| --- | --- |
| `src/app/router.tsx` | Daftar route per modul |
| `src/features/*` | Lokasi kode per modul |
| [03-srs.md](./03-srs.md) §3 | ID requirement per modul |
| [11-frontend-refactor-migration-plan.md](./11-frontend-refactor-migration-plan.md) §4 | Gap ID (GAP-FE-xx) per catatan |
| [13-frontend-shell-routing-shared-ui.md](./13-frontend-shell-routing-shared-ui.md) | Batas Phase 2 (apa yang sudah selesai) |

## 7. Catatan Konsistensi

- Tidak ada route/fitur/role/endpoint baru yang dikarang; seluruh rujukan memakai ID yang sudah ada.
- Daftar diturunkan dari pembacaan aktual `src/app/router.tsx` dan `src/features/*` (bukan asumsi).
- Status implementasi backend dinyatakan apa adanya (§5); tidak ada klaim pengujian yang belum dijalankan.
