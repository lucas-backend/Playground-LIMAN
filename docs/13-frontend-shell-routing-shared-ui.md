# 13 — Frontend Shell, Routing, dan Shared UI (Phase 2)

- **Status:** Implemented (Phase 2; migrasi konten halaman belum dimulai)
- **Tanggal:** 2026-10-11
- **Branch:** `refactor`
- **Dokumen terkait:** [05-sdd.md](./05-sdd.md) · [11-frontend-refactor-migration-plan.md](./11-frontend-refactor-migration-plan.md) · [12-frontend-foundation.md](./12-frontend-foundation.md) · [09-decision-log.md](./09-decision-log.md) · [00-project-audit.md](./00-project-audit.md) · [07-uat-checklist.md](./07-uat-checklist.md)

## 1. Ringkasan

Phase 2 melanjutkan fondasi Phase 1 ([12](./12-frontend-foundation.md)) dengan tiga hal:

1. **Shell aplikasi** — komposisi provider (`app/providers`) + `ErrorBoundary` global.
2. **Routing berlapis** — `PublicLayout`/`ProtectedLayout` menggantikan daftar route datar,
   sekaligus memperbaiki tiga bug routing terverifikasi (AUD-002/003/005).
3. **Shared UI** — komponen lintas fitur dipindah ke `shared/components/{ui,layout}`,
   halaman lintas fitur ke `shared/pages`, plus primitif state (`Loading/EmptyState/ErrorState/ErrorBoundary`).

Tidak ada URL/route yang diubah atau dihapus (jumlah path route **62 → 62**). Tidak ada
konten halaman fitur yang dimigrasikan. Tidak ada perubahan dependency. Tidak ada perubahan
visual yang disengaja. Autentikasi tetap belum diimplementasikan; sesi disediakan sebagai
abstraksi eksplisit tanpa login palsu.

## 2. Struktur Setelah Phase 2

```
src/
  app/
    App.tsx                   # AppProviders + BrowserRouter + AppRoutes
    router.tsx                # seluruh route, dikelompokkan per layout
    providers/
      AppProviders.tsx        # ErrorBoundary -> SessionProvider
  shared/
    api/  types/  styles/     # dari Phase 1 (tidak berubah)
    components/
      ui/                     # Button, KelasCard, NilaiBadge, IconNilai, QuizItemCard, AdSlider/
      layout/                 # Header, XPadding
      state/                  # Loading, EmptyState, ErrorState, ErrorBoundary
    layouts/
      PublicLayout.tsx        # <Outlet/> untuk route publik
      ProtectedLayout.tsx     # host route terautentikasi (guard UX)
    session/
      session.ts              # tipe + context + useSession (bukan komponen)
      SessionProvider.tsx     # provider (komponen)
    pages/
      NotFound.tsx            # dipindah dari src/pages/
  features/                   # domain fitur existing (konten belum dimigrasikan)
```

## 3. Perubahan Material

### 3.1 Relokasi komponen bersama (tanpa perubahan perilaku)

| Dari | Ke |
| --- | --- |
| `src/components/Header.tsx` | `src/shared/components/layout/Header.tsx` |
| `src/components/XPadding.tsx` | `src/shared/components/layout/XPadding.tsx` |
| `src/components/Button.tsx` | `src/shared/components/ui/Button.tsx` |
| `src/components/KelasCard.tsx` | `src/shared/components/ui/KelasCard.tsx` |
| `src/components/NilaiBadge.tsx` | `src/shared/components/ui/NilaiBadge.tsx` |
| `src/components/IconNilai.tsx` | `src/shared/components/ui/IconNilai.tsx` |
| `src/components/QuizItemCard.tsx` | `src/shared/components/ui/QuizItemCard.tsx` |
| `src/components/AdSlider/*` | `src/shared/components/ui/AdSlider/*` |
| `src/pages/NotFound.tsx` | `src/shared/pages/NotFound.tsx` |

86 berkas fitur diperbarui impornya dari relatif (`../../components/X`) menjadi alias
(`@/shared/components/{ui,layout}/X`). Impor lokal fitur (mis. `./KelasCard` di
`guruBK/MinatBakat`) **tidak** tersentuh karena hanya impor lintas-fitur yang cocok pola.
`src/components/` dan `src/pages/` kini kosong.

### 3.2 Shell aplikasi (baru)

- `src/app/providers/AppProviders.tsx` — urutan `ErrorBoundary → SessionProvider → children`.
- `src/app/App.tsx` — `AppProviders` + `BrowserRouter` + `AppRoutes` (router tetap di `app/`).

### 3.3 Routing berlapis + perbaikan bug

`src/app/router.tsx` dikelompokkan: `PublicLayout` (`/` → `/login`, `/login`),
`ProtectedLayout` (seluruh route terautentikasi), dan `*` → `NotFound` di luar layout.
Karena route induk bersifat *pathless*, path absolut anak tetap sama — URL **tidak berubah**.

Perbaikan bug (masing-masing terverifikasi sebelum perubahan):

| Bug | Bukti sebelum | Perbaikan |
| --- | --- | --- |
| Param quiz tak cocok (AUD-002) | route `/quiz/:quiz_id/*` vs `useParams().id` di `Quiz.tsx` | `Quiz.tsx` membaca `quiz_id` (URL tidak diubah; KD-03 masih TBD) |
| `matchPath` Header tak cocok (AUD-002) | `Header.tsx` memakai `/quiz/:id/*` | disamakan ke `/quiz/:quiz_id/*` |
| Impor bank soal Ujian salah (AUD-003) | `router.tsx` mengimpor `...MapelSoal`/`...SoalDetail` dari `BankSoalUjianGuruMapel` | diimpor dari modul `...MapelSoal`/`...MapelSoalDetail` yang benar |
| Route `/guru/ujian/bankSoal` salah komponen (AUD-003) | memuat `BankSoalGuru` (fitur LatihanSoal) | memuat `BankSoalUjianGuru` |

### 3.4 Sesi (abstraksi eksplisit, tanpa login palsu)

`src/shared/session/session.ts` mendefinisikan `SessionStatus`
(`loading | authenticated | unauthenticated | unavailable`), `SessionUser`, `Session`,
`SessionContext`, dan `useSession()`. `SessionProvider.tsx` menyediakan status
**`unavailable`** dengan `user: null` karena backend autentikasi (`/auth/me`) belum ada
(KD-07/KD-09 `Blocked`). **Tidak ada** kredensial palsu atau pembacaan `localStorage`.

`ProtectedLayout` memakai `useSession()`: menampilkan `Loading` saat `loading` dan
`<Navigate to="/login">` saat `unauthenticated`. Karena status saat ini `unavailable`, guard
**belum menolak akses** — perilaku login lama (masuk → `/dashboard`) tidak berubah.

> **Peringatan desain.** Guard ini hanya UX. Otorisasi otoritatif tetap di backend
> (ADR-004, NFR-SEC-002). Jangan menganggapnya sebagai kontrol keamanan.

### 3.5 Primitif state (baru)

`shared/components/state/`: `Loading`, `EmptyState`, `ErrorState`, `ErrorBoundary` (class,
menangkap error render). Belum dikonsumsi fitur mana pun — disediakan untuk fase integrasi
(F3/GAP-FE-06). `Loading` dipakai `ProtectedLayout`; `ErrorState` dipakai `ErrorBoundary`.

### 3.6 Aksesibilitas (AUD-012, TC-UX-02/04)

- `index.html`: `lang="en"` → `lang="id"`.
- `Header.tsx`: tombol kembali diberi `aria-label="Kembali"` + `type="button"`; modal konfirmasi
  diberi `role="dialog"`, `aria-modal`, `aria-labelledby`, fokus awal ke tombol, dan tutup
  dengan `Escape`; tombol modal `type="button"`.
- `DashboardHeader.tsx`: tombol notifikasi `aria-label="Buka notifikasi"`.
- `SearchBar.tsx`: input diberi `aria-label="Cari Fitur"` (placeholder bukan label yang andal).

Judul dokumen (`title`) sengaja **tidak** diubah: belum ada string produk yang diratifikasi.

## 4. Batas dan Catatan Konsistensi

- **Tidak ada URL/route yang berubah atau dihapus**; jumlah path route tetap 62.
- **Tidak ada konten halaman fitur yang dimigrasikan**; `features/*` tetap seperti semula.
- Desain token **tidak** diterapkan ke komponen lama (menghindari perubahan visual):
  `--color-brand-500` (`#1e88e5`) berbeda dari `bg-blue-500` Tailwind (`#3b82f6`) yang dipakai
  komponen existing. Hanya komponen state baru yang memakai token.
- **Lazy loading sengaja dilewati** (F6/GAP-FE-05 keputusan fase); memunculkan peringatan
  ukuran chunk `>500 kB` pada build — bukan kegagalan.
- **Tidak ada dependency baru**, tidak ada script baru, tidak ada tooling test.
- Struktur final masih **Proposed** hingga ratifikasi ADR-005 (KD-01). Phase 2 dijalankan
  atas instruksi eksplisit untuk melanjutkan; dokumen ini mencatat penyimpangan itu secara
  terbuka.
- `SessionProvider`/`PublicLayout` saat ini tipis (status konstan / `<Outlet/>`) karena
  perilaku nyatanya menunggu backend auth; keduanya adalah titik kepemilikan yang disepakati,
  bukan scaffolding spekulatif.

## 5. Bukti Eksekusi (nyata, dijalankan pada Phase 2)

| Perintah | Hasil |
| --- | --- |
| `npx tsc -b` | **exit 0** (tanpa error) |
| `npm run lint` (`eslint .`) | **exit 0** (0 error, 0 warning) |
| `npm run build` (`tsc -b && vite build`) | **exit 0**; 623 modul; `dist/assets/index-*.js` ≈ 648 kB (gzip ≈ 178 kB); peringatan chunk > 500 kB (lihat §4) |
| Pemeriksaan jumlah route | path route **62 → 62** (tidak ada route hilang) |
| `git status` | 10 rename + 86 modifikasi impor + 1 `index.html` + 5 modul baru (`app/providers`, `shared/{layouts,session}`, `shared/components/state`, `shared/pages`) |

Catatan: **tidak ada test otomatis** dijalankan — proyek belum memiliki runner/script test
(AUD-007). Verifikasi runtime (navigasi manual login → dashboard → quiz → …) **belum**
diekeskusi dalam sesi ini; lihat §6.

## 6. Risiko & Verifikasi yang Belum Dilakukan

| Item | Status | Catatan |
| --- | --- | --- |
| Uji navigasi manual tiap route | **Belum dijalankan** | Perlu `npm run dev` + `TC-REGR-01`. Hanya typecheck/build/lint yang dijalankan. |
| Perilaku runtime guard sesi | Tidak dapat diuji | Status `unavailable` konstan sampai backend auth ada (F4). |
| UAT terkait | `Blocked`/`Not Run` | Status [07-uat-checklist.md](./07-uat-checklist.md) tidak diubah. |
| ADR-005/008 (KD-01/KD-02) | Masih `Proposed` | Struktur final belum diratifikasi. |

## 7. Traceability

| Perubahan | Gap / Requirement |
| --- | --- |
| Relokasi `components/`→`shared/`, `pages/`→`shared/pages` | GAP-FE-15, ADR-005 (KD-01) |
| Router berlapis (`app/router.tsx`) | GAP-FE-05, WBS-P2-01 |
| Fix param quiz + `matchPath` | GAP-FE-02, AUD-002, KD-03 (TBD) |
| Fix impor/route bank soal Ujian | GAP-FE-03, AUD-003 |
| Provider + `ErrorBoundary` | GAP-FE-06, IR-UI-002 |
| Sesi + `ProtectedLayout` (kerangka) | GAP-FE-01, ADR-003/004, KD-09 |
| A11y (`lang`, label, dialog) | GAP-FE-12, AUD-012, TC-UX-02/04 |
| Primitif state | GAP-FE-06 |
