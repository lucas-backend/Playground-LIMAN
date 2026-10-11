# 00 — Project Audit: Repository LIMEN

- **Proyek:** LIMEN (Sistem Absensi Terintegrasi)
- **Tanggal audit:** 2026-10-11
- **Branch:** `main`
- **Cakupan:** seluruh `src/` (171 file), konfigurasi build/lint/TypeScript, aset, dokumentasi, dan riwayat Git.
- **Metode:** enumerasi direktori, pembacaan file, pencarian regex rekursif, perbandingan hash MD5, dan subagent read-only. Build/lint/test **tidak dijalankan** pada fase ini (menghindari penulisan artefak build).

> **Catatan integritas.** Satu subagent audit cross-cutting mengembalikan temuan untuk berkas yang **tidak ada** di repositori (mis. `src/utils/api.ts`, `src/hooks/useAuth.ts`, `src/components/ProtectedRoute.tsx`, `.env`, `src/features/{auth,monitoring,absensi,quizzes}`). Path tersebut terbukti tidak ada (`Test-Path` bernilai `False`) dan tidak muncul pada daftar berkas lengkap. Laporan itu **dibuang** dan seluruh aspek cross-cutting diverifikasi ulang secara langsung. Semua temuan di bawah ialah hasil verifikasi langsung.

## 1. Fakta Teknologi Terverifikasi

Sumber: `package.json`, `vite.config.ts`, `eslint.config.js`, `tsconfig*.json`, `index.html`, `src/index.css`.

| Aspek | Kondisi | Bukti |
| --- | --- | --- |
| Framework UI | React 19.2 | `package.json:18` |
| Bahasa | TypeScript ~6.0, `strict: true`, `noUnusedLocals`, `noUnusedParameters` | `tsconfig.app.json:20-23` |
| Build tool | Vite 8 + `@vitejs/plugin-react` | `package.json:35`, `vite.config.ts:2,7` |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` | `package.json:17,21`, `vite.config.ts:3,7`, `src/index.css:1` |
| Routing | `react-router-dom` 7.18 | `package.json:20`, `src/App.tsx` |
| UI library | `@mui/material` 9.2 + `@mui/icons-material` 9.2 + Emotion | `package.json:13-16` |
| State management | Tidak ada library; hanya React state lokal | `createContext` = 2 (hanya `features/quiz`) |
| Data fetching | Tidak ada (`axios`/`fetch`/`XMLHttpRequest` = 0) | pencarian rekursif seluruh `src/` |
| Form library | Tidak ada | `package.json` |
| Testing | Tidak ada runner, librari, berkas, atau script | `package.json:6-11` |
| Linting | ESLint flat config, **non-type-aware** (tanpa `parserOptions.project`) | `eslint.config.js:8-21` |
| Format | Tidak ada Prettier | — |

**Catatan styling.** `src/index.css:1` hanya berisi `@import "tailwindcss";` — tidak ada CSS variable, `@theme`, atau design token. Warna hex hardcoded ditemukan di 27 berkas (contoh `src/components/IconNilai.tsx:14,22`; `src/data/jadwal/jadwalData.ts:61-80`). MUI praktis dipakai sebagai pustaka ikon (104 referensi `@mui/icons-material`); komponen `@mui/material` hanya di satu berkas: `src/features/admin/section/ManajemenPengguna.tsx:2-6`.

## 2. Struktur Repositori

- `src/` berisi 171 berkas: 152 di `src/features/`, 10 di `src/components/`, 1 `src/pages/`, 1 `src/data/`, 1 `src/types/`, 3 aset, dan 3 berkas root (`App.tsx`, `main.tsx`, `index.css`).
- 15 area fitur: `admin`, `dashboard`, `guru/**`, `guruBK/**`, `guruMapel/**`, `guruWali/**`, `hasil-minat-bakat`, `jadwal`, `latihan-soal`, `login`, `notifikasi`, `passing-grade`, `quiz`, `quiz-result`, `riwayat-quiz`.
- Routing: `src/App.tsx:63-239`, satu `BrowserRouter`, **62 route inline**, tanpa layout route, lazy loading, atau guard.

## 3. Temuan Audit

Kolom: **ID**, **Lokasi**, **Temuan**, **Dampak**, **Prioritas**, **Rekomendasi**, **Dependensi**, **Status**.

### 3.1 Kritis dan Tinggi

| ID | Lokasi | Temuan | Dampak | Prioritas | Rekomendasi | Dependensi | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AUD-001 | `src/features/login/Login.tsx:9-14,24-42`; seluruh `src/App.tsx` | Tidak ada autentikasi/sesi: `handleFormSubmit()` hanya `navigate("/dashboard")`; input email/password tidak di-bind (tanpa state/`name`/validasi); tidak ada token/cookie/storage; tidak ada route guard (semua route publik termasuk `/admin/*`); submit tanpa `preventDefault`. | Seluruh modul terekspos tanpa login; tidak ada dasar otorisasi. | Critical | Rancang autentikasi backend + session/cookie + `ProtectedRoute` + role sebagai fondasi. | Semua modul; API contract | Verified |
| AUD-002 | `src/App.tsx:70` vs `src/features/quiz/Quiz.tsx:66,69`; `src/components/Header.tsx:17` | Route memakai param `:quiz_id`, komponen membaca `const { id } = useParams()` → `undefined` → `Navigate to "/notfound"`. Dashboard menautkan `/quiz/1` (`src/features/dashboard/components/FeatureGrid/data.ts:35`). | Fitur quiz tidak dapat dibuka. | High | Samakan nama param atau perbaiki pembacaan; perbaiki `matchPath` di `Header`. | quiz, dashboard, Header | Verified |
| AUD-003 | `src/App.tsx:42-44,179,185-191` | Dua nama berbeda diimpor dari modul yang sama (`BankSoalUjianGuruMapel`); route `/guru/ujian/bankSoal` merender `BankSoalGuru` milik LatihanSoal (`src/App.tsx:35`). `BankSoalUjianGuru.tsx`, `BankSoalUjianGuruMapelSoal.tsx`, `...Detail.tsx` menjadi dead code. | Navigasi bank soal Ujian salah; dua area rusak. | High | Perbaiki impor/route; gunakan komponen Ujian yang benar. | `guru/Ujian`, `guru/LatihanSoal` | Verified |
| AUD-004 | seluruh `src/` | Tidak ada lapisan data/API. Semua data mock inline di TSX atau berkas `data.*` lokal; tidak ada API client atau konfigurasi environment. | Frontend belum siap integrasi; kontrak API belum ada. | High | Tetapkan API contract, service layer, dan konfigurasi environment. | backend, semua fitur | Verified |
| AUD-005 | `src/App.tsx` (62 route); `:223-230` | Route menumpuk tanpa struktur; alias ganda `/guruBK/rekap/*` dan `/rekap/*` (keduanya `Rekap`); `/guru/ujian/` trailing slash; navigasi literal tanpa substitusi param di `src/features/guruWali/konselingWali/KonselingWali.tsx:98` dan `src/features/hasil-minat-bakat/HasilMinatBakat.tsx:169-172`. | Navigasi rusak; sulit dipelihara. | High | Konsolidasi routing (layout + guard), kelompokkan per domain, perbaiki path param & alias. | Semua modul | Verified |
| AUD-006 | seluruh `src/` | Tidak ada penanganan error/loading/empty yang konsisten: `try`/`catch` = 0; tidak ada `ErrorBoundary`. | Pengalaman gagal data buruk. | High | Definisikan pola state + `ErrorBoundary` saat integrasi API. | AUD-004 | Verified |
| AUD-007 | seluruh repo | Tidak ada test (unit/integration/E2E) maupun tooling test. | Regresi tidak terdeteksi. | High | Tetapkan strategi & tooling testing sebelum refactor besar. | AUD-005 | Verified |

### 3.2 Sedang dan Rendah

| ID | Lokasi | Temuan | Dampak | Prioritas | Rekomendasi | Dependensi | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AUD-008 | `guru/Ujian/*` vs `guru/LatihanSoal/*`; `components/KelasCard.tsx` vs `guruBK/MinatBakat/KelasCard.tsx`; `guruBK/Rekap/Nilai/RekapNilaiSiswa(Mapel).tsx` | Duplikasi masif: `bankSoalData.tsx` ≡ `bankSoalDataUjian.tsx` (MD5 identik); `KelasCard` identik; dua berkas `RekapNilai` identik + default export sama; `EditSoal*`/`TambahSoal*` Ujian≈Latihan (beda 3 baris); `KKM=75` di dua tempat. | Perbaikan ganda; risiko divergensi. | Medium | Konsolidasi ke modul bersama terparameterisasi; hapus salinan. | AUD-005 | Verified |
| AUD-009 | `src/features/guru/Penilaian/GuruPenialaianKelasSiswa.tsx`; `src/features/jadwal/components/sectionPelajaran/PelajaranTab.tsx:8`; `src/App.tsx:51` | Inkonsistensi penamaan: typo "Penialaian" pada nama berkas & impor; berkas `PelajaranTab.tsx` mengekspor `JadwalTab`. | Kebingungan & kesalahan impor. | Medium | Standarkan konvensi penamaan; perbaiki typo dengan kontrol referensi. | Semua | Verified |
| AUD-010 | `src/features/quiz/components/QuizNotFound.tsx`; `src/features/dashboard/components/BottomNav/*`; `src/features/hasil-minat-bakat/Dropdown.tsx`; `src/features/guru/Remedial/GuruRemedial.tsx`; `src/features/dashboard/components/FeatureGrid/data.ts:117-137` | Kode mati/placeholder: `QuizNotFound` tak pernah diimpor; `BottomNav` hanya direferensikan baris terkomentar; `Dropdown` tak dipakai (prop `label` tak dirender); `GuruRemedial` kosong; `link:"#"` dan `adminFeatures=[]`. | Beban pemeliharaan; kebingungan. | Medium | Tandai/rapikan placeholder; hapus dead code setelah konfirmasi. | AUD-008 | Verified |
| AUD-011 | 27 berkas (contoh `src/components/IconNilai.tsx:14-22`; `src/data/jadwal/jadwalData.ts:61-80`; `src/features/guruMapel/absensi/pertemuan/AbsensiPertemuan.tsx`) | Tidak ada design token; warna hex/arbitrary Tailwind tersebar; ukuran arbitrary (`w-6!`, `h-38`). | Perubahan desain mahal & tidak konsisten. | Medium | Tetapkan design token terpusat. | Desain UI/UX | Verified |
| AUD-012 | `index.html:2`; `src/components/Header.tsx:38,49-81`; aset | A11y rendah: `lang="en"` (UI berbahasa Indonesia); tombol back ikon tanpa label; modal tanpa `role="dialog"`/`aria-modal`/focus trap; `alt` hanya 5×. | Kepatuhan aksesibilitas rendah. | Medium | Perbaiki bahasa, label, semantik dialog, alt. | Desain UI/UX | Verified |
| AUD-013 | `src/features/dashboard/data.mock.ts:2-5`; `src/types/` | Konsep role hanya ada di mock dashboard (`role:"guruWali"`) dan `gridFeaturesSwitcher`; tidak ada model role/permission terpusat. | Tidak ada dasar otorisasi berbasis role. | Medium | Definisikan model role/permission (lihat `02-prd.md`). | AUD-001 | Partially Verified |
| AUD-014 | `src/features/admin/AdminDashboard.tsx:27`; `src/features/admin/section/AkademikDanJadwal.tsx:61-65`; `src/features/admin/section/ManajemenPengguna.tsx:75` | Modul admin belum lengkap: sidebar tak tampil di mobile; pencarian tanpa state; aksi hanya `console.log`. | Fitur admin belum dapat diuji. | Medium | Tandai sebagai belum lengkap; jangan dokumentasikan sebagai fitur final. | Stakeholder | Verified |
| AUD-015 | `src/components/AdSlider/index.ts` (satu-satunya barrel) | Tidak ada barrel file kecuali `AdSlider`; kedalaman impor relatif tidak konsisten. | Onboarding & refactor lebih sulit. | Low | Tetapkan aturan impor & public API per modul. | Tim frontend | Verified |
| AUD-016 | `src/features/quiz-result/QuizResult.tsx:48`; `src/features/hasil-minat-bakat/TambahTargetJurusanLain.tsx:109,112` | Korupsi encoding (mojibake): `â€¢` dan `â†’`. | Teks salah tampil. | Low | Betulkan ke UTF-8 (`•`, `→`). | — | Verified |
| AUD-017 | 13 berkas (`console.log`), 2 `alert(` | Sisa debug: `console.log` di `admin/`, `guru/`, `guruBK/`, `guruMapel/`, `guruWali/`; `alert(`. | Noise; potensi kebocoran info. | Low | Bersihkan saat refactor. | — | Verified |
| AUD-018 | `README.md`; `plan.md`; `git status`; `docs/restructure/PROMPT_GUIDE_FOR_USER.md` | Dokumentasi proyek minim; `plan.md` merujuk `doc/Struktur_Folder.md` yang sudah dihapus (`git status`: `D doc/...`); `PROMPT_GUIDE_FOR_USER.md` kosong (0 byte); ada perubahan belum di-commit. | Sumber kebenaran struktur hilang. | Medium | Buat dokumentasi resmi di `docs/`; jangan menimpa berkas lama. | AUD-015 | Verified |

### 3.3 Aset & Konfigurasi

| ID | Lokasi | Temuan | Prioritas | Status |
| --- | --- | --- | --- | --- |
| AUD-019 | `src/assets/hero.png`, `react.svg`, `vite.svg`; `public/icons.svg` | Aset tidak diimpor/direferensikan (hanya komentar di `src/components/AdSlider/adData.tsx:1-2`); `icons.svg` tidak dipakai; favicon masih bawaan Vite. | Low | Verified |
| AUD-020 | `.gitignore:15-21` | `.env` dan varian lokal sudah diabaikan (benar). Tidak ada berkas `.env` di repo. | Low | Verified |

## 4. Pemisahan Fakta, Usulan, Asumsi, dan Informasi Belum Diketahui

### 4.1 Fakta terverifikasi
Seluruh baris tabel Bagian 3, dengan bukti `file:line` atau hasil pencarian/hash.

### 4.2 Rekomendasi teknis (belum disetujui)
Autentikasi backend dan sesi; design token; service layer & kontrak API; konsolidasi routing/duplikasi; barrel & aturan impor; strategi testing. Semua berstatus usulan.

### 4.3 Asumsi sementara
- Peran pengguna: Siswa, Guru Mata Pelajaran, Guru Wali, Guru BK, Admin Sekolah (dikonfirmasi stakeholder pada Fase B, bukan dari kode).
- LIMEN berfokus pada absensi, namun repositori memuat fitur lain (quiz, minat bakat, passing grade).

### 4.4 Informasi belum diketahui
Aturan bisnis absensi rinci, mekanisme integrasi perangkat IoT, kebijakan sesi/reset password teknis, dan strategi deployment belum tersedia pada saat audit.

## 5. Ringkasan Prioritas Perbaikan Fondasi

1. **AUD-001, AUD-002, AUD-003** — bug fungsional & keamanan yang membuat fitur tidak berjalan.
2. **AUD-004, AUD-006, AUD-007** — kesiapan integrasi, penanganan error, dan testing.
3. **AUD-005, AUD-008, AUD-009** — konsolidasi routing, duplikasi, dan penamaan.
4. **AUD-010 s.d. AUD-020** — kebersihan kode, aksesibilitas, dan aset.
