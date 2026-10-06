# FRONTEND ARCHITECTURE AUDIT & REFACTOR PLANNING

## Konteks Project

Saya memiliki project frontend berbasis:

* React
* TypeScript
* Vite
* React Router (jika digunakan, silakan verifikasi dari source code)
* Project saat ini masih dalam tahap frontend/prototype
* Belum terintegrasi dengan API/backend
* Banyak data masih berupa dummy/mock data
* Sebagian dummy data masih ditulis langsung di file `.tsx`
* Role-Based Access Control (RBAC) belum ditetapkan
* Struktur folder dan arsitektur belum memiliki standar yang konsisten
* Penamaan file/folder/component belum konsisten
* Styling belum konsisten
* Layout dan pola UI belum konsisten
* Banyak halaman dan fitur sudah dibuat, sehingga refactor harus mempertimbangkan kode yang sudah ada
* Saya ingin menggunakan pendekatan **PAGE-BASED ARCHITECTURE**, bukan feature-based sebagai struktur utama.

## TUJUAN UTAMA

Lakukan audit menyeluruh terhadap seluruh project frontend ini.

Jangan langsung mengubah kode.

Pertama, lakukan scanning dan analisis seluruh source code untuk menemukan masalah arsitektur, struktur, konsistensi, maintainability, scalability, dan kesiapan integrasi API.

Setelah audit selesai, buat rekomendasi struktur project baru yang lebih rapi dan scalable.

Target akhirnya adalah frontend yang:

1. Menggunakan page-based architecture.
2. Mudah diintegrasikan dengan backend/API di kemudian hari.
3. Memiliki pemisahan yang jelas antara:

   * pages
   * components
   * layouts
   * hooks
   * services/API
   * types
   * data/mock
   * utils
   * constants
   * assets
4. Memiliki strategi RBAC yang jelas.
5. Tidak mencampurkan dummy data dengan UI component.
6. Memiliki naming convention yang konsisten.
7. Memiliki styling convention yang konsisten.
8. Memiliki layout dan navigation yang konsisten.
9. Mengurangi duplikasi kode.
10. Mudah dikembangkan oleh beberapa developer.
11. Tidak melakukan over-engineering.
12. Tetap cocok untuk project React + TypeScript + Vite.

---

# BAGIAN 1 — SCAN PROJECT

Scan SELURUH source code project.

Jangan hanya melihat struktur folder.

Periksa:

* semua `.tsx`
* semua `.ts`
* `App.tsx`
* `main.tsx`
* routing
* components
* pages/features
* hooks
* utility
* data
* types
* assets
* styling
* import/export
* state management
* dummy data
* hardcoded values
* navigation
* authentication
* authorization
* role handling
* API-related code
* error handling
* loading state
* empty state
* reusable components
* layout
* responsive behavior

Jika terdapat file yang tidak digunakan, cari indikasi apakah file tersebut:

* dead code
* legacy
* duplicate
* experimental
* masih digunakan oleh route/component tertentu

Jangan langsung menghapusnya. Tandai terlebih dahulu.

---

# BAGIAN 2 — AUDIT STRUKTUR FOLDER

Analisis struktur folder saat ini.

Cari masalah seperti:

* folder terlalu dalam
* folder terlalu datar
* folder dengan fungsi yang tumpang tindih
* feature dan role tercampur
* page dan component tercampur
* reusable component berada di folder feature
* component khusus page berada di global components
* data tersebar di berbagai tempat
* types tersebar tanpa aturan
* utility tersebar
* nama folder tidak konsisten
* struktur folder berbeda untuk fitur yang sejenis

Karena saya memilih PAGE-BASED ARCHITECTURE, tentukan struktur berdasarkan:

```text
pages/
├── auth/
├── dashboard/
├── jadwal/
├── quiz/
├── guru/
├── guru-bk/
├── guru-wali/
├── guru-mapel/
├── admin/
└── ...
```

Namun jangan mengasumsikan struktur tersebut sudah benar.

Validasi berdasarkan source code sebenarnya.

---

# BAGIAN 3 — AUDIT NAMING CONVENTION

Cari seluruh inkonsistensi penamaan.

Audit:

## Folder

Contoh masalah:

```text
guruBK
guruMapel
guruWali
hasil-minat-bakat
detailSiswa
```

Tentukan satu convention yang paling cocok.

Rekomendasi awal:

```text
kebab-case
```

Contoh:

```text
guru-bk/
guru-mapel/
guru-wali/
hasil-minat-bakat/
detail-siswa/
```

## React Components

Gunakan:

```text
PascalCase.tsx
```

Contoh:

```text
DetailSiswa.tsx
AbsensiPertemuan.tsx
QuizResult.tsx
```

## TypeScript files

Gunakan convention yang konsisten untuk:

```text
types.ts
constants.ts
utils.ts
services.ts
hooks.ts
```

Audit semua file dan berikan:

* nama sekarang
* masalah
* nama yang disarankan
* alasan perubahan

Termasuk typo seperti:

```text
GuruPenialaian.tsx
```

jika ditemukan.

---

# BAGIAN 4 — AUDIT DUMMY / MOCK DATA

Ini merupakan prioritas tinggi.

Cari semua data dummy yang ditulis langsung di:

```text
.tsx
```

Contoh:

```tsx
const students = [
  {
    id: 1,
    name: "Budi",
    score: 90
  }
];
```

Cari seluruh pola seperti:

* array object
* static JSON-like object
* daftar siswa
* daftar guru
* daftar kelas
* jadwal
* nilai
* quiz
* soal
* tugas
* absensi
* notifikasi
* data dashboard
* data user
* data role
* data mata pelajaran
* data passing grade
* data universitas
* data minat bakat
* dan data dummy lainnya

Pisahkan menjadi:

```text
data/
├── mock/
│   ├── users.ts
│   ├── students.ts
│   ├── teachers.ts
│   ├── classes.ts
│   ├── schedules.ts
│   ├── quizzes.ts
│   └── ...
```

Tetapi jangan membuat file hanya demi membuat file.

Jika data hanya digunakan satu page, pertimbangkan:

```text
pages/<page>/data.ts
```

Jika digunakan banyak page:

```text
data/mock/
```

Tentukan berdasarkan penggunaan aktual.

Selain itu, identifikasi data dummy yang seharusnya nanti berasal dari API.

Beri label:

```text
MOCK DATA
FUTURE API DATA
STATIC CONFIG
CONSTANT
UI CONFIG
```

---

# BAGIAN 5 — AUDIT TYPE SAFETY

Cari:

* `any`
* type assertion berlebihan
* interface/type duplicate
* type yang hanya digunakan satu tempat tetapi diletakkan global
* object tanpa typing
* props tanpa interface/type
* response API yang belum memiliki type
* enum/string literal yang tidak konsisten
* nullable field yang tidak ditangani
* optional field yang tidak jelas

Buat rekomendasi struktur:

```text
types/
├── auth.ts
├── user.ts
├── student.ts
├── teacher.ts
├── class.ts
├── schedule.ts
├── quiz.ts
├── assignment.ts
├── attendance.ts
└── ...
```

Tetapi gunakan prinsip:

> Jangan membuat global type jika type tersebut hanya relevan untuk satu page/component.

---

# BAGIAN 6 — AUDIT API READINESS

Project saat ini BELUM disiapkan untuk API.

Analisis seluruh component yang nantinya membutuhkan API.

Cari pola:

```text
UI
↓
hardcoded data
```

dan sarankan transisi menjadi:

```text
Page
↓
Hook
↓
Service/API
↓
Backend
```

Contoh target:

```text
pages/guru/tugas/
    TugasPage.tsx

hooks/
    useTugas.ts

services/
    tugas.service.ts

types/
    tugas.ts
```

Jangan langsung membuat backend.

Fokus hanya pada kesiapan frontend.

Sarankan struktur API client seperti:

```text
services/
├── api.ts
├── auth.service.ts
├── user.service.ts
├── student.service.ts
├── teacher.service.ts
├── schedule.service.ts
├── quiz.service.ts
├── assignment.service.ts
├── attendance.service.ts
└── ...
```

Jika lebih cocok menggunakan folder:

```text
lib/api/
```

jelaskan alasannya.

---

# BAGIAN 7 — AUDIT AUTHENTICATION & RBAC

Saat ini Role-Based Access Control belum ditetapkan.

Audit seluruh project untuk melihat:

* apakah ada login?
* apakah ada user state?
* apakah ada role?
* apakah role masih hardcoded?
* apakah route sudah diproteksi?
* apakah UI melakukan conditional rendering berdasarkan role?
* apakah authorization hanya dilakukan di frontend?
* apakah ada layout berdasarkan role?
* apakah ada route guard?

Jangan menganggap role dari nama folder.

Identifikasi role yang terlihat dari project.

Kemungkinan role:

```text
admin
guru
guru-mapel
guru-wali
guru-bk
siswa
```

Validasi berdasarkan source code.

Buat rekomendasi:

```text
auth/
├── auth context/store
├── authentication
└── authorization

routes/
├── public routes
├── protected routes
└── role-based routes
```

atau struktur lain yang lebih baik.

Jelaskan juga perbedaan:

```text
Authentication
vs
Authorization
vs
RBAC
```

Dan jelaskan bahwa:

> Frontend RBAC hanya untuk UX/navigation protection. Security authorization tetap wajib dilakukan oleh backend/API.

---

# BAGIAN 8 — AUDIT ROUTING

Audit seluruh route.

Buat tabel:

| Route | Page | Role | Layout | Protection | Status |
| ----- | ---- | ---- | ------ | ---------- | ------ |

Cari:

* route duplicate
* route naming tidak konsisten
* route terlalu panjang
* route tidak sesuai folder
* route tanpa protection
* route yang seharusnya membutuhkan role
* route yang dapat diakses user yang salah
* halaman yang tidak memiliki route
* route yang mengarah ke component yang salah

Buat rekomendasi routing architecture.

---

# BAGIAN 9 — AUDIT LAYOUT

Audit seluruh layout.

Cari:

* Header duplicate
* Sidebar duplicate
* Bottom navigation duplicate
* Navbar berbeda padahal seharusnya sama
* spacing berbeda
* container width berbeda
* page padding berbeda
* mobile layout berbeda tanpa alasan
* desktop layout tidak konsisten
* role layout tercampur dengan page component

Rekomendasikan layout seperti:

```text
layouts/
├── PublicLayout.tsx
├── StudentLayout.tsx
├── TeacherLayout.tsx
├── TeacherBKLayout.tsx
├── TeacherWaliLayout.tsx
├── TeacherMapelLayout.tsx
└── AdminLayout.tsx
```

Namun jangan membuat layout yang tidak diperlukan.

Jika beberapa role bisa menggunakan layout yang sama, gabungkan.

---

# BAGIAN 10 — AUDIT STYLING

Audit styling secara keseluruhan.

Cari:

* hardcoded colors
* hardcoded spacing
* font-size yang berbeda-beda
* border-radius tidak konsisten
* shadow tidak konsisten
* button style duplicate
* card style duplicate
* input style duplicate
* responsive breakpoint berbeda-beda
* inline style berlebihan
* className terlalu panjang
* styling component yang duplicate

Tentukan design system minimal:

```text
colors
typography
spacing
radius
shadow
container
breakpoints
button
input
card
badge
modal
table
```

Jangan over-engineer.

Tujuan utamanya adalah konsistensi.

---

# BAGIAN 11 — AUDIT COMPONENT

Kelompokkan semua component menjadi:

### A. Global reusable

Contoh:

```text
Button
Input
Modal
Badge
Header
```

### B. Page-specific

Contoh:

```text
KartuTugas
BarisSiswa
QuizQuestionList
```

### C. Role-specific

Contoh:

```text
GuruSidebar
AdminSidebar
```

### D. Duplicate / near duplicate

Cari component yang sebenarnya melakukan hal yang sama tetapi memiliki nama berbeda.

Contoh:

```text
KartuMapel
MapelCard
CardMapel
```

Jika ditemukan, sarankan consolidation.

---

# BAGIAN 12 — AUDIT STATE MANAGEMENT

Cari semua:

* useState
* useEffect
* Context
* custom hooks
* prop drilling
* local state
* global state

Identifikasi state:

```text
UI state
server state
authentication state
form state
global application state
```

Berikan rekomendasi teknologi hanya jika memang diperlukan.

Jangan menambahkan Redux/Zustand/React Query/TanStack Query hanya karena populer.

Jika project belum membutuhkan global state, katakan demikian.

---

# BAGIAN 13 — AUDIT FORM

Cari seluruh form.

Audit:

* validation
* controlled/uncontrolled input
* duplicate form component
* error handling
* loading state
* submit state
* reset behavior
* type safety

Jika perlu library form/validation, berikan rekomendasi dan alasan.

---

# BAGIAN 14 — AUDIT UX STATE

Untuk setiap page penting, cek apakah memiliki:

```text
Loading
Success
Error
Empty
Data
```

Contoh:

```text
Loading → Skeleton/Spinner
Error → Error state
Empty → Empty state
Success → Content
```

Cari page yang hanya memiliki:

```text
Data
```

tanpa handling state lainnya.

---

# BAGIAN 15 — AUDIT ERROR HANDLING

Cari:

* try/catch
* error boundary
* API error
* form error
* 404
* unauthorized
* forbidden
* network error

Rekomendasikan:

```text
404
401
403
500
Network Error
```

dan strategi handling-nya.

---

# BAGIAN 16 — AUDIT PERFORMANCE

Cari potensi:

* component terlalu besar
* unnecessary re-render
* duplicate calculation
* unnecessary useEffect
* list tanpa key yang tepat
* image tidak optimal
* import besar
* route yang seharusnya lazy loaded
* duplicate data
* component yang dapat di-split

Jangan melakukan premature optimization.

Hanya tandai masalah yang benar-benar terlihat.

---

# BAGIAN 17 — AUDIT ACCESSIBILITY

Periksa:

* semantic HTML
* button vs div clickable
* label input
* alt image
* keyboard navigation
* focus state
* aria-label
* color contrast
* heading hierarchy

Beri prioritas masalah.

---

# BAGIAN 18 — AUDIT FILE SIZE & GOD COMPONENT

Identifikasi file yang terlalu besar.

Buat tabel:

| File | Perkiraan masalah | Alasan | Saran pemecahan |
| ---- | ----------------- | ------ | --------------- |

Prioritaskan component yang memiliki:

* UI
* state
* data
* business logic
* API logic

sekaligus.

---

# BAGIAN 19 — TARGET ARCHITECTURE

Setelah audit, buat target structure.

Gunakan PAGE-BASED sebagai struktur utama.

Contoh konsep:

```text
src/
├── assets/
├── components/
├── layouts/
├── pages/
├── hooks/
├── services/
├── types/
├── data/
│   └── mock/
├── utils/
├── constants/
├── lib/
├── routes/
├── App.tsx
├── main.tsx
└── index.css
```

Untuk setiap folder jelaskan:

* tanggung jawab
* apa yang boleh berada di sana
* apa yang tidak boleh berada di sana

---

# BAGIAN 20 — TARGET PAGE STRUCTURE

Buat template standar untuk page.

Contoh:

```text
pages/
└── guru/
    └── tugas/
        ├── TugasPage.tsx
        ├── TugasListPage.tsx
        ├── TambahTugasPage.tsx
        ├── components/
        ├── hooks/
        ├── data/
        └── types.ts
```

Tetapi jangan memaksakan semua folder tersebut.

Gunakan hanya yang memang diperlukan.

---

# BAGIAN 21 — MIGRATION PLAN

Ini sangat penting.

Jangan hanya memberikan struktur target.

Buat langkah migrasi dari struktur saat ini menuju struktur baru.

Prioritaskan:

### Phase 0

Audit dan dokumentasi.

### Phase 1

Naming convention.

### Phase 2

Global components.

### Phase 3

Pemisahan dummy data.

### Phase 4

Page-based restructuring.

### Phase 5

Types.

### Phase 6

API/service layer.

### Phase 7

Authentication.

### Phase 8

RBAC.

### Phase 9

Layout standardization.

### Phase 10

Styling/design system.

### Phase 11

State/error/loading handling.

### Phase 12

Cleanup/dead code.

Untuk setiap phase berikan:

* tujuan
* file/folder yang terlibat
* perubahan
* risiko
* dependency
* apakah aman dilakukan sekarang atau harus menunggu phase lain

---

# BAGIAN 22 — JANGAN MELAKUKAN INI

Selama audit:

1. Jangan menghapus file.
2. Jangan mengubah behavior aplikasi.
3. Jangan mengganti library tanpa alasan.
4. Jangan menambahkan dependency hanya untuk terlihat lebih modern.
5. Jangan memindahkan file hanya karena preferensi pribadi.
6. Jangan membuat folder kosong yang belum diperlukan.
7. Jangan membuat abstraksi berlebihan.
8. Jangan membuat global component jika hanya digunakan satu page.
9. Jangan menganggap semua dummy data harus langsung dibuat service API.
10. Jangan menganggap frontend RBAC sebagai security.
11. Jangan melakukan refactor besar sebelum audit selesai.

---

# OUTPUT YANG SAYA INGINKAN

Setelah scanning selesai, berikan hasil dalam urutan berikut:

## 1. Executive Summary

Berikan penilaian:

```text
Architecture: X/10
Folder Structure: X/10
Naming: X/10
Type Safety: X/10
API Readiness: X/10
RBAC Readiness: X/10
Styling Consistency: X/10
Component Reusability: X/10
Maintainability: X/10
Scalability: X/10
Overall: X/10
```

Jelaskan alasan singkat.

---

## 2. Critical Problems

Urutkan:

```text
CRITICAL
HIGH
MEDIUM
LOW
```

Jangan hanya menyebutkan masalah.

Sertakan lokasi file dan alasan.

---

## 3. Folder Structure Problems

Tampilkan:

```text
CURRENT
↓
PROBLEM
↓
RECOMMENDED
```

---

## 4. Naming Problems

Buat tabel:

| Current | Recommended | Reason |
| ------- | ----------- | ------ |

---

## 5. Dummy Data Problems

Daftar semua dummy data yang perlu dipindahkan dari `.tsx`.

Kelompokkan:

```text
Global mock
Page mock
Future API data
Static configuration
Constant
```

---

## 6. API Readiness

Jelaskan:

* bagian mana yang sudah siap
* bagian mana yang belum
* service layer yang dibutuhkan
* type API yang dibutuhkan
* authentication flow
* error handling
* loading state

---

## 7. RBAC Design

Buat matriks:

| Page/Feature | Admin | Guru | Guru Mapel | Guru Wali | Guru BK | Siswa |
| ------------ | ----: | ---: | ---------: | --------: | ------: | ----: |

Gunakan source code sebagai dasar, bukan asumsi.

Jika role belum dapat ditentukan, tandai:

```text
NEEDS DECISION
```

---

## 8. Routing Design

Berikan rekomendasi:

```text
route
page
layout
role
guard
```

---

## 9. Layout Design

Tentukan layout yang seharusnya tersedia dan mana yang bisa digabung.

---

## 10. Component Design

Kelompokkan:

```text
Global
Page-specific
Role-specific
Duplicate
Too large
```

---

## 11. Styling Problems

Tampilkan masalah konsistensi styling dan rekomendasi design system.

---

## 12. Target Folder Structure

Berikan struktur folder lengkap yang realistis.

Jangan membuat struktur ideal yang terlalu kompleks.

---

## 13. Migration Plan

Buat roadmap refactor bertahap.

---

## 14. Prioritized TODO

Buat checklist:

```text
[ ] ...
[ ] ...
[ ] ...
```

Urutkan dari yang paling penting.

---

# ATURAN ANALISIS

Sangat penting:

* Jangan mengarang masalah yang tidak ditemukan.
* Bedakan antara fakta dan rekomendasi.
* Untuk setiap masalah, berikan bukti berupa file/path.
* Jika tidak dapat memastikan sesuatu dari source code, tulis `UNKNOWN`.
* Jangan berasumsi React Router jika belum ditemukan.
* Jangan berasumsi Tailwind jika belum ditemukan.
* Jangan berasumsi state management library jika belum ditemukan.
* Jangan berasumsi role tertentu jika belum ditemukan.
* Jangan berasumsi backend/API tertentu.
* Gunakan source code aktual sebagai sumber utama.

Prioritaskan:

```text
Maintainability
Consistency
Scalability
API readiness
RBAC readiness
Developer experience
```

daripada sekadar membuat struktur terlihat bagus.

## HASIL AKHIR YANG DIHARAPKAN

Saya ingin mendapatkan **blueprint refactor frontend** yang bisa digunakan sebagai pedoman pengembangan selanjutnya.

Jangan melakukan refactor otomatis pada tahap ini.

**Audit terlebih dahulu → temukan masalah → jelaskan → buat target architecture → buat migration plan.**
