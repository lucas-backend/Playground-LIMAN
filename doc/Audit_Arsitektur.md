# Audit Arsitektur Frontend & Rencana Refactor — LIMAN

**Tanggal audit:** 09 Oktober 2026
**Metode:** audit statis seluruh source code `src/` (167 file `.ts/.tsx`, ±10.548 baris). Tidak ada file yang diubah.
**Sumber utama:** source code aktual. Label: **[FAKTA]** terbukti dari kode, **[REKOMENDASI]** usulan, **[UNKNOWN]** perlu tooling/keputusan.

> Dokumen ini adalah **blueprint refactor**. Belum ada refactor yang dijalankan. Alur yang disarankan: **Audit → temukan masalah → jelaskan → target architecture → migration plan**.

---

## Ringkasan Lingkungan (FAKTA)

- React 19.2, TypeScript ~6.0, Vite 8, `react-router-dom` 7.18, Tailwind v4, MUI 9 + Emotion (`package.json:12-22`).
- 167 file `.ts/.tsx`, ±10.548 baris.
- Tidak ada state-management lib, form lib, data-fetching lib, testing, dan folder `hooks/ services/ layouts/ utils/ constants/ routes/`.
- `tsconfig.app.json` **tidak punya `"strict"`** (baris 1-25) → strict mode OFF.
- Struktur saat ini = **feature-based** (`src/features/*`), **bukan page-based**. `src/pages/` hanya berisi `NotFound.tsx`.

---

## 1. Executive Summary

| Aspek | Nilai |
|---|---|
| Architecture | 4/10 |
| Folder Structure | 4/10 |
| Naming | 3/10 |
| Type Safety | 5/10 |
| API Readiness | 2/10 |
| RBAC Readiness | 2/10 |
| Styling Consistency | 4/10 |
| Component Reusability | 5/10 |
| Maintainability | 4/10 |
| Scalability | 4/10 |
| **Overall** | **4/10** |

Alasan: pondasi fitur sudah ada dan `quiz` relatif rapi (types/utils/hook/context terpisah), tetapi **tidak ada auth, RBAC, service layer, layout bersama, dan routing monolitik (53 route di `App.tsx`)**. Ada **duplikasi masif** (folder `Ujian` ≈ `LatihanSoal`), **bug routing nyata** (quiz tak dapat diakses), penamaan tidak konsisten, dan styling Tailwind tersebar dengan hex hardcoded.

---

## 2. Critical Problems

### CRITICAL
1. **Quiz route tidak pernah cocok.** Route `App.tsx:70` = `/quiz/:quiz_id/*`, tetapi `Quiz.tsx:66` membaca `useParams().id` → `undefined` → `quiz` selalu null → redirect `Quiz.tsx:72`. Halaman quiz efektif tidak bisa diakses. **[FAKTA]**
2. **Duplicate import salah modul + route salah komponen.** `App.tsx:43-44` meng-import `BankSoalUjianGuruMapelSoal` & `...SoalDetail` **dari file `BankSoalUjianGuruMapel` yang sama** → route `:185` & `:189` merender komponen salah; file aslinya jadi dead code. `App.tsx:179` (`/guru/ujian/bankSoal`) juga merender `<BankSoalGuru/>` milik **LatihanSoal**, bukan `BankSoalUjianGuru`. **[FAKTA]**
3. **Tidak ada authentication & authorization sama sekali.** `Login.tsx:11-14` hanya `navigate("/dashboard")` (tanpa validasi/token/state, tanpa `preventDefault`). Tidak ada token, storage, context, guard. **[FAKTA]**
4. **Tidak ada proteksi route.** 53 `<Route>` tanpa guard; semua halaman bisa diakses via URL langsung. **[FAKTA]**

### HIGH
5. **Duplikasi besar `src/features/guru/Ujian` ≈ `src/features/guru/LatihanSoal`** (`bankSoalData.tsx` == `bankSoalDataUjian.tsx`, `BankSoalUI.tsx` == `BankSoalUIUjian.tsx`, `EditSoal*.tsx` 376 baris nyaris identik). **[FAKTA]**
6. **Duplikasi komponen**: `src/components/KelasCard.tsx` == `guruBK/MinatBakat/KelasCard.tsx`; `RekapNilaiSiswa.tsx` == `RekapNilaiSiswaMapel.tsx` **dengan nama export sama** `RekapNilaiSiswa`. **[FAKTA]**
7. **`/notfound` tidak terdefinisi** — `Quiz.tsx:23,72` navigate ke `/notfound`, padahal hanya ada catch-all `*` (`App.tsx:236`). Ada 2 halaman 404 duplikat (`pages/NotFound.tsx` dipakai; `quiz/components/QuizNotFound.tsx` dead). **[FAKTA]**
8. **God components** (UI+state+data+logic dalam satu file): `AbsensiPertemuan.tsx` (414), `Absensi.tsx` (379), `PertemuanTab.tsx` (378), `EditSoalGuru.tsx`/`EditSoalUjianGuru.tsx` (376), `MenuWaliKelas.tsx` (256). **[FAKTA]**
9. **`React` namespace tanpa import** (`React.ReactNode`) di `GuruPenialaianKelasSiswa.tsx:16`, `GuruPenilaianKelasSiswaRekap.tsx:15`, `Absensi.tsx:42`, `PertemuanTab.tsx:32` → kandidat error `TS2686`. **[UNKNOWN — jalankan `npm run build`]**

### MEDIUM
10. **Mock data masih langsung di `.tsx`** di 10+ file (lihat §5). **[FAKTA]**
11. **Role vocabulary tidak konsisten**: `FeatureGrid/utils.ts` pakai `guruMapel/guruBK/guruWali`; `BottomNav/utils.ts:3-9` pakai `"guru"`; `data.mock.ts:4` `role:"guruBK"` → Dashboard merender fitur guru, `StatusAbsen` siswa tersembunyi. **[FAKTA]**
12. **`Role`/`User` tidak bertipe** — semua plain `string` (`data.mock.ts:2-6`, `DashboardHeader.tsx:6-11`). **[FAKTA]**
13. **Styling tidak konsisten**: brand blue ditulis `blue-500`, `#1E88E5`, `#1e88e5`, `#238be2`; radius `rounded-md/lg/xl/2xl/[20px]` campur; `shadow-sm` vs `shadow-md`. **MUI komponen hanya di 1 file** (`ManajemenPengguna.tsx:2-6`) **tanpa `ThemeProvider`**. **[FAKTA]**
14. **Asset tidak terpakai**: `public/icons.svg`, `src/assets/{vite,react}.svg`, `src/assets/hero.png`; `AdSlider` `imageLink:"#"` (`adData.tsx:18,25`) → gambar rusak (`AdSlider.tsx:38`). **[FAKTA]**
15. **`Array(10).fill({...})`** berbagi satu reference di `MenuWaliKelas.tsx:16` (bug mutasi laten). **[FAKTA]**
16. **`console.log` stub** 13 lokasi & `TODO` 30+ lokasi. **[FAKTA]**

### LOW
17. Banyak halaman tanpa state Loading/Error/Empty (hanya data).
18. Tidak ada Error Boundary, tidak ada indikator loading.
19. `latihan-soal/data.tsx` dan `Penilaian/data.tsx` berekstensi `.tsx` padahal **tanpa JSX**.
20. Penamaan file typo: `GuruPenialaianKelasSiswa.tsx`.

---

## 3. Folder Structure Problems

```
CURRENT                          PROBLEM                                 RECOMMENDED
src/features/<domain>            feature-based, bukan page-based;        src/pages/<domain>/...
                                 casing campur (guruBK vs hasil-minat-   (kebab-case, konsisten)
                                 bakat vs Koreksi)
src/components/*                 sebagian hanya dipakai 1x              pindah ke page terkait;
(Button, IconNilai, AdSlider)    (Button/IconNilai/AdSlider)             sisakan yang benar-benar global
src/data/                        hanya jadwal; data lain scattered       src/data/mock/ terpusat
src/types/                       hanya jadwal; sisanya lokal/duplikat    src/types/ terpusat + page types
src/pages/                       hanya NotFound.tsx                      isi seluruh halaman
(tidak ada)                      tidak ada layouts/                      src/layouts/
(tidak ada)                      tidak ada services/ hooks/ utils/       src/services/ hooks/ utils/
                                 constants/ routes/                      constants/ routes/
src/features/*/data.tsx          data bercampur di dalam feature          data/mock + pages/<p>/data
src/features/guru/Ujian          duplikat total LatihanSoal              satu modul bank-soal generik
```

Detail: folder terlalu dalam/tidak seragam (`features/guru/LatihanSoal/` PascalCase vs `features/guruMapel/absensi/detailSiswa/` camelCase), fungsi tumpang tindih (`guru/Remedial/GuruRemedial.tsx` stub vs `guru/Koreksi/RemedialTab.tsx` yang nyata), `MenuWaliKelas.tsx` mengapung di root `guruWali/`, dan layout/nav dicampur ke page component (`DashboardHeader` di `Dashboard.tsx:20`).

---

## 4. Naming Problems

| Current | Recommended | Reason |
|---|---|---|
| `features/guruBK/`, `guruMapel/`, `guruWali/` | `guru-bk/`, `guru-mapel/`, `guru-wali/` | kebab-case konsisten dgn `hasil-minat-bakat` |
| `features/guru/LatihanSoal/`, `Ujian/`, `Koreksi/`… | `latihan-soal/`, `ujian/`, `koreksi/` | folder pakai kebab-case |
| `absensi/detailSiswa/`, `konselingWali/`, `rapotSiswa/` | `detail-siswa/`, `konseling-wali/`, `rapot-siswa/` | kebab-case |
| `GuruPenialaianKelasSiswa.tsx` | `GuruPenilaianKelasSiswa.tsx` | typo "Penialaian" |
| `data.tsx`, `TugasData.tsx`, `koreksiData.tsx`, `bankSoalData.tsx`, `data.mock.ts` | `data.ts` / `<domain>.mock.ts` | konvensi data file tunggal |
| `latihan-soal/data.tsx`, `Penilaian/data.tsx`, `koreksiData.tsx` (tanpa JSX) | `.ts` | ekstensi salah |
| `BankSoalUI.tsx` vs `BankSoalUIUjian.tsx` | satu modul generik | suffix tak konsisten |
| export named (`QuizResultCard`) vs default | pilih satu (sarankan default utk page/komponen utama) | export style campur |
| `menuType`, `featureType` (lowerCamel) | `MenuType`, `FeatureType` | tipe pakai PascalCase |
| `PelajaranTab.tsx` mengekspor `JadwalTab` | samakan nama file & komponen | nama file ≠ komponen |
| `TombolBiru`, `KartuMapel` (ID) vs `KelasCard` (EN) | pilih satu bahasa | bahasa campur |
| `BottomNav/utils.ts` role `"guru"` | `"guru-mapel"` dst | vocab role beda dgn FeatureGrid |

---

## 5. Dummy Data Problems

Data yang masih **inline di `.tsx`** (harus dipindah):

| File | Variabel | Baris | Klasifikasi |
|---|---|---|---|
| `quiz-result/QuizResult.tsx` | `name/subject/tanggal`, `examAnswers` | 7-32 | MOCK / FUTURE API |
| `quiz-result/QuizResultDetails.tsx` | `dummyQuestions` | 5-54 | MOCK |
| `riwayat-quiz/RiwayatQuiz.tsx` | `historyData` | 6-11 | MOCK |
| `jadwal/.../TryoutTab.tsx` | `listJadwalTryout` | 3-37 | MOCK |
| `jadwal/.../UjianSubtab.tsx` | `ujianSubTab`, `listJadwal` | 4-110 | MOCK |
| `passing-grade/PassingGrade.tsx` | `UNIVERSITIES` (15) | 7-23 | MOCK |
| `passing-grade/PassingGradeUniv.tsx` | `MAJORS` (9) | 4-14 | MOCK |
| `hasil-minat-bakat/HasilMinatBakat.tsx` | `tanggal/minat/bakat/jurusanRekomendasi/initialTargetJurusanLain` | 12-27 | MOCK |
| `hasil-minat-bakat/HasilMinatBakatJurusan.tsx` | `jurusan/mapelTKA/daftarUniv` | 4-10 | MOCK |
| `hasil-minat-bakat/TambahTargetJurusanLain.tsx` | `listUniversitas` | 8-26 | MOCK |
| `notifikasi/HalamanNotifikasi.tsx` | `notifications` | 5-51 | MOCK (**message berisi JSX → campur UI+data**) |
| `login/Login.tsx` | `appName` | 6 | CONSTANT |
| `dashboard/data.mock.ts` | `userData` | 2-6 | MOCK/FUTURE API |
| `dashboard/components/FeatureGrid/data.ts` | `siswaFeatures`…`adminFeatures` | 17-137 | STATIC CONFIG (menu per role) |
| `dashboard/components/BottomNav/data.ts` | `siswaMenus/guruMenus/adminMenus` | 10-20 | STATIC CONFIG |
| `quiz/data.mock.ts` | `quiz1`, `quizList` | 4,124 | MOCK (sudah terpisah & bertipe) |
| `latihan-soal/data.tsx` | `mapelLatihan`, `latihanSoalMapel` | 8,77 | MOCK |
| `guru/Koreksi/koreksiData.tsx` | `KKM/dummy*` | 2-78 | MOCK |
| `guru/Penilaian/data.tsx` | `KKM/dummyKelas/dummySiswa/dummyRincian` | 2-31 | MOCK |
| `guru/Tugas/TugasData.tsx` | `mapelList/siswaList/tugasList/nilai` | 28-46 | MOCK (+mutator in-memory) |
| `guru/LatihanSoal/bankSoalData.tsx` & `Ujian/bankSoalDataUjian.tsx` | `soalContoh/DATA` | 39-54 | MOCK (duplikat) |
| `guruBK/Konseling/konselingData.ts` | `siswaDummy/catatanBkDummy/catatanWaliDummy` | 15-22 | MOCK |
| `guruBK/**` (MinatBakat, Rekap) | `jenjangList/kelasList/siswaList/rows/...` | inline per file | MOCK |
| `guruMapel/absensi/*` | `tingkat/siswa/mataPelajaran/initialListPertemuan` | inline | MOCK |
| `guruWali/*` | `dataSiswa/dataAbsensi/mapelData/kategoriNilai` | inline | MOCK |
| `admin/section/*` | `dataPengguna/kelas/mapel/dataPresensi/dataRekap` | inline + `// TODO: ganti dengan data dari API` | MOCK/FUTURE API |
| `data/jadwal/jadwalData.ts` | `jadwal*` | 1-88 | MOCK (satu-satunya di `src/data`) |

Kelompok:
- **Global mock** (dipakai lintas page): `data.mock.ts` (user), `quiz/data.mock.ts`, `jadwalData.ts`.
- **Page mock**: hampir semua di atas.
- **Future API data**: semua daftar entitas (siswa, guru, kelas, nilai, absen, soal, jadwal, catatan BK).
- **Static config / constant**: `FeatureGrid/data.ts`, `BottomNav/data.ts`, `TIPE/DAFTAR_TIPE` di `EditSoal*`, `badgePeran/badgeStatus`.

---

## 6. API Readiness

- **Belum siap.** Tidak ada `fetch/axios`, tidak ada `.env`, tidak ada `services/`, tidak ada hook data-fetching. Semua pola = `UI → hardcoded data`. `TugasData.tsx` bahkan menyimpan mutator in-memory (`tambahTugas/setNilai`) — hilang saat refresh.
- **Yang sudah siap**: model domain `quiz/types.ts` (discriminated union — kualitas terbaik), pure util `quiz/utils.ts`, state `quiz/QuizContext.tsx` + hook `quiz/hook.ts`. Ini template yang bisa ditiru.
- **Service layer yang dibutuhkan** (usulan, jangan backend):
  ```
  src/services/
  ├── api.ts                (base client, interceptor auth, error normalization)
  ├── auth.service.ts
  ├── user.service.ts
  ├── student.service.ts  teacher.service.ts  class.service.ts
  ├── schedule.service.ts attendance.service.ts
  ├── assignment.service.ts quiz.service.ts  grade.service.ts
  └── counseling.service.ts  minat-bakat.service.ts
  ```
  Alternatif `src/lib/api/` lebih tepat bila client generik + util bersama tumbuh besar; untuk sekarang `services/` lebih sederhana dan cukup.
- **Type API**: butuh `types/api.ts` (envelope response, error, pagination) + type per entitas di `types/`.
- **Auth flow**: `login → token → interceptor → guard → logout`.
- **Error/loading**: `api.ts` menormalkan error (401/403/404/500/network); hook mengekspos `{data,isLoading,error}`.

---

## 7. RBAC Design

Basis fakta: role yang **terlihat** di kode = `siswa`, `guruMapel`, `guruBK`, `guruWali`, `admin` (`FeatureGrid/data.ts`, `utils.ts`), plus `"guru"` di `BottomNav/utils.ts`. **Tidak ada** `guru` generik di FeatureGrid → role `guru` ambigu **[NEEDS DECISION]**.

| Page/Feature | Admin | Guru | Guru Mapel | Guru Wali | Guru BK | Siswa |
|---|---:|---:|---:|---:|---:|---:|
| Login | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Dashboard | ✔ | ? | ✔ | ✔ | ✔ | ✔ |
| Quiz / Riwayat / Quiz Result | - | - | - | - | - | ✔ |
| Jadwal siswa | - | - | - | - | - | ✔ |
| Latihan Soal, Passing Grade, Minat Bakat, Notifikasi | - | - | - | - | - | ✔ |
| `/guruMapel/absensi` | - | - | ✔ | - | - | - |
| `/guru/*` (tugas, penilaian, ujian, latihan soal, koreksi, remedial) | - | ? | ✔ | - | - | - |
| `/guruWali/*` (absensi, rapot, konseling) | - | - | - | ✔ | - | - |
| `/guruBK/*` (konseling, rekap, minat bakat) | - | - | - | - | ✔ | - |
| `/admin/*` | ✔ | - | - | - | - | - |

`/guru/*` **NEEDS DECISION**: apakah milik role `guru` umum atau `guru-mapel`? `/rekap/*` (`App.tsx:230`) duplikat `/guruBK/rekap/*` → tentukan satu.

Konsep:
- **Authentication** = siapa kamu (login, token, session).
- **Authorization** = apa yang boleh kamu lakukan.
- **RBAC** = authorization berbasis role.
- **Frontend RBAC hanya untuk UX/navigation protection.** Security authorization tetap wajib di backend/API (guard frontend bisa dilewati).

Struktur usulan:
```
src/auth/       AuthContext + provider + useAuth
src/routes/     PublicRoute, ProtectedRoute, RoleRoute, route config
```

---

## 8. Routing Design

Tabel (ringkas; 53 route, sumber `App.tsx`):

| Route | Page | Role | Layout | Guard | Status |
|---|---|---|---|---|---|
| `/` | redirect→login | - | Public | - | OK |
| `/login` | Login | public | PublicLayout | - | perlu `preventDefault` |
| `/dashboard` | Dashboard | semua | AppLayout | perlu | mock role `guruBK` |
| `/quiz/:quiz_id/*` | Quiz | siswa | StudentLayout | perlu | **BROKEN** (param ≠ `id`) |
| `/jadwal-siswa/*` | Jadwal | siswa | StudentLayout | perlu | OK |
| `/latihan-soal`, `/latihan-soal/mapel/:id` | LatihanSoal(Mapel) | siswa | StudentLayout | perlu | OK |
| `/quiz_result/:id`, `/quiz_result/:id/details` | QuizResult(Details) | siswa | StudentLayout | perlu | OK |
| `/riwayat/*` | RiwayatQuiz | siswa | StudentLayout | perlu | OK |
| `/passing_grade(/:id)` | PassingGrade(Univ) | siswa | StudentLayout | perlu | OK |
| `/hasil_minat_bakat/...` | HasilMinatBakat* | siswa | StudentLayout | perlu | OK |
| `/guruMapel/absensi(/:kelas_id)(/pertemuan/:id)` | Absensi* | guru-mapel | TeacherLayout | perlu | OK |
| `/detail/siswa/:id` | DetailSiswa | guru-mapel | TeacherLayout | perlu | **nama route generik** |
| `/guruWali/...` | guruWali | guru-wali | TeacherLayout | perlu | OK |
| `/guru/latihanSoal`… | guru | ? | TeacherLayout | perlu | **trailing slash `:173`** |
| `/guru/ujian/bankSoal` | — | ? | — | — | **wrong component `:179`** |
| `/guru/tugas/*`, `/guru/penilaian/*`, `/guru/remedial`, `/guru/koreksi/*` | guru | ? | TeacherLayout | perlu | OK |
| `/guruBK/konseling/*`, `/guruBK/rekap/*`, `/guruBK/minatBakat/*` | guruBK | guru-bk | TeacherLayout | perlu | child path absolut campur |
| `/rekap/*` | Rekap | guru-bk | TeacherLayout | perlu | **duplikat** |
| `/admin/*` | AdminDashboard | admin | AdminLayout | perlu | sidebar hilang di mobile |
| `/notifikasi` | HalamanNotifikasi | semua | AppLayout | - | OK |
| `*` | NotFound | public | - | - | OK |

Rekomendasi: pindahkan definisi ke `src/routes/`, gunakan **nested route + `Outlet`** dengan layout, tambahkan `ProtectedRoute`/`RoleRoute`, normalkan param (`:quizId`), hilangkan trailing slash & duplikat `/rekap`, dan standardisasi kebab-case pada path (`/guru-mapel`, `/guru-bk`, `/guru-wali`).

---

## 9. Layout Design

Saat ini **tidak ada layout bersama**; tiap page memasang `Header`/`DashboardHeader` sendiri (`Dashboard.tsx:20`), `BottomNav` ada tapi dikomentari (`Dashboard.tsx:9-10,45`). Admin punya shell sendiri (`AdminDashboard.tsx:28,62`) dengan nested `<Routes>`, tanpa `Outlet`.

Layout yang disarankan (gabungkan yang setara):
```
layouts/
├── PublicLayout.tsx      (login)
├── StudentLayout.tsx     (siswa: quiz, jadwal, latihan, passing-grade, minat-bakat)
├── TeacherLayout.tsx     (guru-mapel, guru-wali, guru-bk → satu shell + menu per-role)
├── AdminLayout.tsx       (admin; + drawer mobile)
└── AppLayout.tsx         (notifikasi / halaman netral)
```
Jangan buat 6 layout role bila cukup `TeacherLayout` yang menerima daftar menu per role (`FeatureGrid/data.ts` sudah punya config menu per role untuk dipakai ulang).

---

## 10. Component Design

- **Global reusable (terbukti multipakai)**: `XPadding` (83 file), `Header` (67 file), `NilaiBadge` (4), `KelasCard` (4), `QuizItemCard` (3).
- **Bukan global (dipakai 1x, jangan di `components/`)**: `Button` (hanya `Login.tsx:2`), `IconNilai` (hanya `KoreksiSiswaPertanyaan.tsx:5`), `AdSlider` (hanya `Dashboard.tsx:1`).
- **Page-specific**: `BarisSiswa`, `KartuTugas`, `KartuMapel`, `FeatureGrid`, `BottomNav`, `AnswerTypes/*`, dll.
- **Role-specific**: `DashboardHeader` (dashboard), sidebar di `AdminDashboard.tsx`.
- **Duplicate / near-duplicate**:
  - `KelasCard` global == `guruBK/MinatBakat/KelasCard`
  - `Ujian/BankSoalUIUjian` == `LatihanSoal/BankSoalUI`; `Ujian/EditSoalUjianGuru` ≈ `LatihanSoal/EditSoalGuru`; `Ujian/TambahSoalUjian` ≈ `TambahSoalLatihan`
  - `RekapNilaiSiswa` == `RekapNilaiSiswaMapel`
  - `Baris`+`Seksi` di `GuruPenialaianKelasSiswa` == `GuruPenilaianKelasSiswaRekap`
  - `jenjangList` identik di `MinatBakatJenjang`, `RekapAbsen`, `RekapNilai`
  - error/empty: `NotFound` vs `QuizNotFound` (dead) vs `TidakDitemukan` (2 file) vs badge inline
  - `TombolBiru` (lokal) vs `Button` (global) vs tombol biru inline di admin → konsolidasi ke satu `Button`.
- **Too large**: lihat §2 butir 8.

---

## 11. Styling Problems

- Tailwind-first: `className=` di 133/167 file; `index.css:1` = `@import "tailwindcss"`.
- MUI komponen **hanya** `ManajemenPengguna.tsx:2-6`; MUI icons di 38 file; **tidak ada `ThemeProvider`/`createTheme`** → MUI berjalan default, tidak nyambung ke Tailwind.
- **Hex hardcoded**: `#1E88E5`/`#1e88e5`/`#238be2` (mis. `RemedialTab.tsx:11`, `AbsensiPertemuan.tsx:407`, `DetailSiswa.tsx:74`), `#FFF9F0`/`#FFFDF6`, `#EBF3FC`; SVG `IconNilai.tsx:14,22`, `QuizResultCard.tsx:40,49`.
- **Radius campur**: `rounded-lg` 88, `rounded-full` 71, `rounded-xl` 51, `rounded-2xl` 26, `rounded-md` 18, `rounded-[20px]`.
- **Shadow campur**: `shadow-sm` 46 vs `shadow-md` 11.
- **Button/input/card duplikat**: recipe search-input admin 4 varian (`AkademikDanJadwal.tsx:57` h-11, `Presensi.tsx:45` h-12, dll); input soal `rounded-xl border-blue-200 bg-[#EBF3FC]` diulang 6x di `TambahSoalLatihan.tsx` & `TambahSoalUjian.tsx`.
- **Responsive hampir tidak ada**: `sm:` 8, `md:` 2, `lg/xl/2xl` 0; `XPadding.tsx:11` mengunci `max-w-sm` (mobile) untuk 83 file.
- **Inline style** 7 file (`NilaiRapor.tsx:73`, `Koreksi.tsx:51,65`, dll) + 3 idiom berbeda untuk ukuran ikon (className `w-6!`, `w-10!`, `style={{fontSize}}`).
- Design system minimal: `colors` (brand 1 nilai), `typography`, `spacing`, `radius` (pilih 2-3), `shadow` (1-2), `container`, `breakpoints`, dan kelas komponen `button/input/card/badge/modal/table`. Cukup lewat token Tailwind CSS v4 (`@theme`), tanpa over-engineering.

---

## 12. Target Folder Structure

```
src/
├── assets/
├── components/          (hanya UI global benar-benar multipakai: XPadding, Header, Button, NilaiBadge, KelasCard, QuizItemCard)
├── layouts/             (PublicLayout, StudentLayout, TeacherLayout, AdminLayout, AppLayout)
├── pages/               (PAGE-BASED)
│   ├── auth/LoginPage.tsx
│   ├── dashboard/DashboardPage.tsx (+ components/, data.ts, types.ts)
│   ├── quiz/, quiz-result/, riwayat-quiz/
│   ├── jadwal/, latihan-soal/, passing-grade/, hasil-minat-bakat/
│   ├── notifikasi/
│   ├── guru-mapel/absensi/
│   ├── guru-wali/{absensi,rapot,konseling}/
│   ├── guru-bk/{konseling,rekap,minat-bakat}/
│   ├── guru/{tugas,penilaian,ujian,latihan-soal,koreksi}/   (atau digabung guru-mapel → NEEDS DECISION)
│   └── admin/{pengguna,akademik,presensi,nilai}/
├── hooks/               (useAuth, useFetch/useTugas, dll)
├── services/            (api.ts + *.service.ts)
├── types/               (auth, user, student, teacher, class, schedule, quiz, ...)
├── data/mock/           (users, students, teachers, classes, schedules, quizzes, ...)
├── utils/               (format tanggal, dll)
├── constants/           (roles, routes, KKM, dsb.)
├── routes/              (index + guards)
├── auth/                (AuthContext/provider)
├── App.tsx
├── main.tsx
└── index.css
```

Aturan izin:
- `components/`: hanya presentational + benar-benar lintas fitur (≥2 page). Tidak boleh ada data/mock atau service.
- `pages/`: satu halaman = satu tanggung jawab; boleh punya `components/`, `data.ts`, `types.ts` lokal.
- `services/`: hanya pemanggilan API + mapping DTO↔domain.
- `data/mock`: hanya data palsu; tidak ada JSX.
- `types/`: hanya tipe lintas fitur; tipe satu page taruh di page.

---

## 13. Migration Plan

**Phase 0 — Audit & dokumentasi.** Buat `AUDIT.md`/`CONTRIBUTING.md` berisi konvensi; perbarui `doc/Struktur_Folder.md` yang saat ini masih menganjurkan `features/`. Risiko: rendah.

**Phase 1 — Naming convention.** Perbaiki typo (`GuruPenialaian→GuruPenilaian`), `.tsx→.ts` untuk data tanpa JSX, samakan ekstensi data (`*.mock.ts`/`data.ts`), tambah alias `@/`. Risiko sedang (banyak import berubah) → lakukan mekanis + `tsc`. Aman sekarang.

**Phase 2 — Global components.** Konsolidasi `KelasCard`, `Button`/`TombolBiru`, `TidakDitemukan`/`NotFound`, pindahkan `Button`/`IconNilai`/`AdSlider` ke page terkait. Aman setelah Phase 1.

**Phase 3 — Pemisahan mock data.** Pindahkan mock inline (§5) ke `data/mock/` (global) atau `pages/<p>/data.ts` (lokal); bersihkan JSX dari data (`HalamanNotifikasi`). Bergantung Phase 1.

**Phase 4 — Page-based restructuring.** `features/` → `pages/` (kebab-case). **Bergantung Phase 1-3**; risiko tinggi → lakukan per-domain, verifikasi route tiap langkah.

**Phase 5 — Types.** Tambah union `Role`, `User`, type entitas; hapus duplikat (`AnswerStatus`, `Siswa`, `Kelas`); aktifkan `strict` di `tsconfig.app.json`. Bergantung Phase 4.

**Phase 6 — API/service layer.** Buat `services/api.ts` + service per entitas, hook per page. Bergantung Phase 4-5.

**Phase 7 — Authentication.** `auth/` context + login flow + token. Bergantung Phase 6.

**Phase 8 — RBAC.** `routes/` guard (`ProtectedRoute`/`RoleRoute`) + `constants/roles.ts`; layout per role. Bergantung Phase 7.

**Phase 9 — Layout standardization.** `layouts/` + `Outlet`; pindahkan `DashboardHeader`, sidebar admin, dan aktifkan/rapikan `BottomNav`. Bergantung Phase 4 (bisa paralel Phase 7-8).

**Phase 10 — Styling/design system.** Token Tailwind (`@theme`), hapus hex duplikat, samakan radius/shadow/button/input/card, putuskan MUI (pakai ThemeProvider atau tinggalkan MUI komponen). Bergantung Phase 2.

**Phase 11 — State/error/loading.** Error Boundary, `Loading/Empty/Error` per page, route 404/401/403. Bergantung Phase 6-7.

**Phase 12 — Cleanup/dead code.** Hapus `QuizNotFound.tsx`, `Dropdown.tsx`, 3 file Ujian dead, asset tak terpakai, `console.log`, komentar; selesaikan duplikasi Ujian↔LatihanSoal. **Terakhir**, setelah semua stabil.

**Dependensi kunci:** Phase 1 → 3 → 4 adalah tulang punggung; jangan mulai Phase 4 sebelum penamaan & data rapi.

---

## 14. Prioritized TODO

```
[ ] Phase 1: perbaiki typo GuruPenialaianKelasSiswa.tsx & rename import di App.tsx
[ ] Phase 1: ubah data.tsx/koreksiData.tsx/TugasData.tsx/bankSoalData*.tsx → .ts (tanpa JSX)
[ ] Phase 1: tambah path alias @/ dan samakan konvensi nama file/folder
[ ] CRITICAL: perbaiki route quiz (:quiz_id vs id) di App.tsx:70 & Quiz.tsx:66
[ ] CRITICAL: perbaiki import alias ganda App.tsx:43-44 & route /guru/ujian/bankSoal:179
[ ] CRITICAL: tambah preventDefault di Login.tsx & putuskan outlet login
[ ] HIGH: definisikan route /notfound atau ganti Navigate; hapus QuizNotFound
[ ] Phase 2: konsolidasi KelasCard, Button/TombolBiru, NotFound/TidakDitemukan
[ ] Phase 3: pindahkan semua mock inline (lihat tabel §5) ke data/mock atau pages/<p>/data.ts
[ ] Phase 3: keluarkan JSX dari data notifikasi
[ ] Phase 5: buat Role/User types + constants/roles.ts; aktifkan strict mode
[ ] Phase 5: hapus duplikat type (AnswerStatus, Siswa, Kelas, dll)
[ ] HIGH: de-duplikasi fitur Ujian vs LatihanSoal (satu modul generik)
[ ] HIGH: pecah god components (AbsensiPertemuan, Absensi, PertemuanTab, EditSoal*, MenuWaliKelas)
[ ] Phase 4: restrukturisasi features/ → pages/ (page-based, kebab-case)
[ ] Phase 6: buat services/api.ts + service per entitas + hook per page
[ ] Phase 7: implementasi auth (context, login, token)
[ ] Phase 8: RBAC guard + layout per role; putuskan role /guru/* & /rekap/*
[ ] Phase 9: satukan layout (Public/Student/Teacher/Admin) + Outlet
[ ] Phase 10: design token Tailwind, hapus hex/radius/shadow duplikat, putuskan MUI
[ ] Phase 11: Error Boundary + Loading/Empty/Error + halaman 401/403/404/500
[ ] Phase 12: hapus dead code, asset tak terpakai, console.log, komentar sisa
[ ] Perbarui doc/Struktur_Folder.md agar konsisten dengan arsitektur baru
```

---

## Lampiran — Aturan Analisis & Larangan

**Yang tidak boleh dilakukan saat audit/refactor:**
1. Menghapus file sebelum Phase 12.
2. Mengubah behavior aplikasi.
3. Mengganti library tanpa alasan.
4. Menambah dependency hanya untuk terlihat lebih modern.
5. Memindahkan file hanya karena preferensi pribadi.
6. Membuat folder kosong yang belum diperlukan.
7. Membuat abstraksi berlebihan.
8. Membuat global component jika hanya digunakan satu page.
9. Menganggap semua dummy data harus langsung dibuat service API.
10. Menganggap frontend RBAC sebagai security.
11. Melakukan refactor besar sebelum audit selesai.

**Catatan:** `plan.md` di root repo menyebut `src/router.tsx` dan `SerchBar` — **keduanya tidak ada di source saat ini** (routing ada di `App.tsx`, folder sudah `SearchBar`), jadi `plan.md` sebagian sudah **usang**.
