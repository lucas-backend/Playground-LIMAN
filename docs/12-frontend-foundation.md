# 12 — Frontend Foundation: Struktur, Konfigurasi, dan Batas Modul (Phase 1)

- **Status:** Implemented (Phase 1 fondasi; migrasi halaman belum dimulai)
- **Tanggal:** 2026-10-11
- **Dokumen terkait:** [05-sdd.md](./05-sdd.md) · [11-frontend-refactor-migration-plan.md](./11-frontend-refactor-migration-plan.md) · [09-decision-log.md](./09-decision-log.md) · [03-srs.md](./03-srs.md)

## 1. Ringkasan

Fase 1 menyiapkan fondasi frontend tanpa migrasi halaman: baseline build/lint dipulihkan,
struktur `app/`, `shared/`, `config/`, `styles/` dibuka sesuai target [05-sdd.md §3](./05-sdd.md),
alias import disiapkan, konfigurasi environment dan design token diletakkan, lapisan API
teknis dibuat (belum terhubung endpoint mana pun), dan tipe domain dasar didefinisikan
sesuai requirement **Confirmed**.

Tidak ada halaman yang dimigrasikan, tidak ada route yang diubah/hilang, tidak ada visual
yang diubah. Aplikasi lama tetap berjalan seperti sebelumnya.

## 2. Struktur Folder Saat Ini

```
src/
  app/
    App.tsx             # komposisi provider + router (BrowserRouter)
    router.tsx          # definisi seluruh route (dipindah dari src/App.tsx)
  config/
    env.ts              # sumber tunggal konfigurasi klien (VITE_*)
  shared/
    api/                # client.ts (wrapper fetch), errors.ts (envelope error)
    types/              # role.ts, attendance.ts, index.ts (tipe lintas domain)
  styles/
    tokens.css          # design token Tailwind v4 (@theme static)
  components/           # komponen reusable existing — BELUM dipindah (F2)
  features/             # domain fitur existing — BELUM distandarkan (F2)
  pages/                # NotFound — BELUM dipindah (F2)
  types/  data/         # tipe/mock existing — relokasi (F2)
  main.tsx  index.css   # entry + import tailwind/tokens
```

Struktur target lengkap (termasuk `shared/components`, `shared/layouts`, `shared/hooks`,
`features/<x>/api|hooks|model`, lazy loading) berstatus **Proposed** di SDD §3.2 dan baru
diberlakukan pada fase migrasi berikut. Perubahan mematuhi ketentuan: tidak ada struktur
final yang dipaksakan sebelum ADR-005 diratifikasi (KD-01).

## 3. Aturan Folder dan Batas Tanggung Jawab Modul

Diterapkan mulai sekarang (ringkas dari SDD §4):

| Lapisan | Tanggung jawab | Tidak boleh |
| --- | --- | --- |
| `app/` | Bootstrap, provider, definisi router | Berisi logika domain |
| `features/<x>/` | Halaman, komponen, hook, api, model spesifik fitur | Panggil `fetch` langsung; dipakai lintas fitur tanpa diangkat ke `shared/` |
| `shared/api/client` | Wrapper HTTP tunggal, session cookie, mapping error | Menyimpan state domain; terikat endpoint tertentu |
| `shared/types` | Tipe lintas domain (role, status absensi) | Aturan bisnis baru |
| `shared/components` (F2) | Komponen presentasional tanpa data | Memanggil API |
| `config/env.ts` | Sumber tunggal konfigurasi klien | Menyimpan rahasia |
| `styles/tokens.css` | Design token (warna, dan seterusnya) | Warna hex arbitrary pada komponen baru |

Aturan penamaan: file/folder `PascalCase` untuk komponen, `camelCase`/`kebab-case` untuk
modul non-komponen; setiap akar modul boleh mengekspos barrel `index.ts` sebagai public API
(GAP-FE-15). Semua import baru memakai alias `@/` → `src/`.

## 4. Konfigurasi yang Ditambahkan/Diperbaiki

### 4.1 Alias import
- `tsconfig.app.json`: `paths["@/*"] → ["./src/*"]` (tanpa `baseUrl`, karena deprecated di TS 6).
- `vite.config.ts`: `resolve.alias["@"] → <root>/src`.
- Digunakan pertama kali oleh `app/router.tsx`, `config/env.ts`, `shared/api/client.ts`.

### 4.2 Environment
- `src/config/env.ts`: membaca `VITE_API_BASE_URL` (default `""` = same-origin). Validasi nilai saat akses; tidak menyimpan rahasia.
- `.env.example` ditambahkan; `.gitignore` kini mengabaikan `.env`, `.env.*`, kecuali `.env.example`.

### 4.3 Linting (baseline dipulihkan, GAP-FE-18)
- `npm run lint` dan `npx tsc -b` sekarang hijau (sebelumnya 3 error lint, 13 error `tsc`).
- Perbaikan F0: hapus unused (`DaftarSiswaTab`, `Dropdown`, `bankSoalData*`, 9 file `guruWali`), pisahkan konstanta `REKAP_BASE`/`namaKelasDariId` dari `shared.tsx` ke `shared.constants.ts`.

## 5. Lapisan Integrasi (Belum Terhubung)

- `shared/api/client.ts`: wrapper `fetch` endpoint-agnostik (`api.get/post/put/patch/delete`),
  `credentials: "include"`, JSON, query params, AbortSignal. Header CSRF menunggu skema final (DEC-05).
- `shared/api/errors.ts`: `ApiError` + `ApiErrorBody` mengikuti envelope SDD §6
  `{ code, message, details? }`. Kode error konkret **tidak dikarang**; menunggu backend.
- Tidak ada service API palsu, tidak ada hook data, tidak ada query library (ADR-009 belum
  diratifikasi, KD-05). `fetch` tetap belum dipakai komponen mana pun.

## 6. Domain Types (Dasar Requirement)

| Tipe | Nilai | Sumber |
| --- | --- | --- |
| `UserRole` | `siswa`, `guru_mapel`, `guru_wali`, `guru_bk`, `admin_sekolah` + `USER_ROLES`, `USER_ROLE_LABELS` | SRS §2.2, BR-14/DEC-07 |
| `AttendanceStatus` | `hadir`, `terlambat`, `izin`, `sakit`, `alpa` + `ATTENDANCE_STATUSES`, `ATTENDANCE_STATUS_LABELS` | FR-ABS-005, BR-06 (Confirmed) |

Tipe lain (absensi event, penilaian, koreksi, dsb.) sengaja **tidak** dibuat karena kontrak
API/penamaan field belum final (jangan mengarang tipe domain). Migrasi komponen ke tipe ini
dilakukan per modul pada fase selanjutnya.

## 7. Design Tokens

- `src/styles/tokens.css` (Tailwind v4 `@theme static`), di-import dari `index.css`.
- Nilai diambil dari penggunaan aktual agar **tidak mengubah visual** (ADR-008/DEC-14):
  brand `#1e88e5/#1976d2/#173c91`, surface `#fffdf6/#ebf3fc/#e8f0fe`, state
  success/warning/danger beserta varian soft.
- Token menghasilkan utility `bg-brand-500`, `bg-surface`, `text-danger`, dst. Sumber
  kebenaran akhir tetap menunggu aset desain UI/UX resmi.

## 8. Verifikasi yang Dijalankan

| Perintah | Hasil | Catatan |
| --- | --- | --- |
| `npm run lint` | Exit 0 | — |
| `npx tsc -b` | Exit 0 | — |
| `npm run build` | Exit 0 | Waspada chunk >500 kB (pre-existing, lazy loading = fase F6) |
| Token ter-emit ke CSS build | Terverifikasi (`--color-brand-500` dst. muncul di `:root`) | — |

## 9. Kompatibilitas

- Seluruh route, halaman, dan `src/components/*`, `src/features/*`, `src/pages/*` tetap pada
  jalur lama; tidak ada import pindah massal.
- Satu-satunya pindahan: `src/App.tsx` → `src/app/App.tsx` (via `git mv`) dengan isi menjadi
  tipis (BrowserRouter + `AppRoutes`); definisi route dipindah ke `src/app/router.tsx` tanpa
  perubahan perilaku, termasuk bug terverifikasi (AUD-002/003) yang **belum** diperbaiki
  (milik Fase F1).

## 10. Keputusan yang Masih Diblokir / Belum Final

| Perihal | Status | Dampak ke fase berikut |
| --- | --- | --- |
| ADR-005 struktur final (`shared/components`, layout, lazy) | Proposed (KD-01) | F2/F6 |
| ADR-008 design token sebagai baseline final | Proposed (KD-02) | F2 |
| Kontrak API seluruh endpoint | Blocked (KD-07) | F3+ (integrasi belum dimulai) |
| ADR-009 server-state (TanStack Query, dsb.) | Proposed (KD-05) | F3/F4; dependency belum dipasang |
| Model role/permission final | Proposed (KD-08) | F4 |
| Param route quiz kanonik, alias route ganda | TBD (KD-03/04) | F1 |
| Tooling test (Vitest+RTL, `npm test`) | TBD (KD-06) | F5 |

## 11. Batasan

- Tidak ada klaim bahwa backend telah terintegrasi; lapisan API adalah abstraksi teknis.
- Tidak ada business rule, role, endpoint, atau field baru yang dikarang.
- Dokumen spesifikasi lain tidak diubah; [11-frontend-refactor-migration-plan.md](./11-frontend-refactor-migration-plan.md)
  tetap menjadi acuan fase (status perencanaannya sekarang digantikan oleh progres Phase 1 ini).