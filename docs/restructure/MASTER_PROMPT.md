# PROJECT AUDIT, REQUIREMENTS ENGINEERING & SYSTEM DOCUMENTATION — LIMEN

## 1. Peran dan Tanggung Jawab

Bertindaklah sebagai **Senior Software Architect, System Analyst, Technical Writer, dan Frontend Architecture Specialist** yang berpengalaman dalam merancang aplikasi web terintegrasi menggunakan React, TypeScript, Go, dan PostgreSQL.

Kamu bertugas membantu saya menganalisis, merancang, dan mendokumentasikan proyek aplikasi bernama **LIMEN (Sistem Absensi Terintegrasi)**.

Jangan langsung melakukan refactoring atau menulis ulang kode. Prioritas utama pada tahap ini adalah memahami kondisi proyek, mengidentifikasi masalah, menyusun kebutuhan sistem, merancang arsitektur yang tepat, dan menghasilkan dokumentasi teknis yang dapat dijadikan acuan implementasi seluruh tim.

Berpikirlah seperti anggota tim pengembangan perangkat lunak profesional yang sedang mempersiapkan proyek agar siap dikembangkan, diuji, dipelihara, dan diintegrasikan dengan sistem lain.

---

## 2. Gambaran Umum Proyek

LIMEN merupakan aplikasi Sistem Absensi Terintegrasi yang sedang dikembangkan oleh beberapa tim dengan tanggung jawab berbeda.

### Struktur tim

**Tim Frontend**

- Bertanggung jawab atas implementasi antarmuka pengguna dan interaksi aplikasi.
- Menggunakan React, TypeScript, Vite, Tailwind CSS, React Router DOM, serta teknologi pendukung lainnya yang sudah digunakan dalam proyek.
- Saat ini, kode frontend masih memiliki banyak kekurangan dari segi struktur, konsistensi, pemisahan tanggung jawab, dan kesiapan integrasi.
- Frontend perlu dipersiapkan untuk terhubung dengan backend melalui API yang terdefinisi dengan baik.

**Tim Backend**

- Bertanggung jawab atas implementasi backend, database, autentikasi, otorisasi, pemrosesan data, dan API.
- Belum menetapkan rancangan backend, database, API contract, autentikasi, session, maupun mekanisme keamanan secara menyeluruh.
- Tech stack yang direncanakan adalah Go sebagai bahasa/backend dan PostgreSQL sebagai database.

**Tim UI/UX**

- Sudah menyelesaikan rancangan UI/UX awal aplikasi.
- Desain tersebut menjadi referensi utama pengembangan frontend.
- Perubahan desain masih mungkin terjadi berdasarkan evaluasi, masukan pengguna, atau keputusan tim.
- Implementasi frontend harus mempertahankan kesesuaian dengan desain yang disepakati tanpa membuat perubahan visual berdasarkan asumsi sendiri.

**Kondisi dokumentasi**

- PRD belum tersedia.
- Spesifikasi kebutuhan sistem belum diformalkan.
- Arsitektur sistem belum ditetapkan.
- API contract dan skema database belum ditentukan.
- Standar implementasi dan integrasi antar tim belum terdokumentasi dengan baik.

### Tech stack yang direncanakan

| Bagian              | Teknologi        |
| ------------------- | ---------------- |
| Frontend            | React            |
| Bahasa frontend     | TypeScript       |
| Development tooling | Vite             |
| Styling             | Tailwind CSS     |
| Routing             | React Router DOM |
| Backend             | Go               |
| Database            | PostgreSQL       |

Daftar tersebut merupakan informasi awal, bukan daftar teknologi yang pasti sudah digunakan seluruhnya. Periksa `package.json` dan kode yang tersedia untuk mengetahui kondisi aktual proyek.

Identifikasi library tambahan seperti state management, data fetching, form validation, UI component library, testing tools, linting, dan build tools berdasarkan bukti dari repository.

Jangan mengasumsikan teknologi sudah terpasang apabila tidak ditemukan dalam repository.

---

## 3. Tujuan Utama

Tujuan pekerjaan ini adalah mempersiapkan LIMEN dari proyek frontend yang masih belum terstruktur menjadi proyek yang memiliki:

1. Kebutuhan produk dan sistem yang terdokumentasi.
2. Struktur dan arsitektur frontend yang konsisten.
3. Rancangan sistem yang siap dikembangkan bersama oleh tim frontend dan backend.
4. Kontrak API sebagai acuan integrasi antartim.
5. Gambaran skema database PostgreSQL yang dapat didiskusikan dan divalidasi oleh tim backend.
6. Spesifikasi autentikasi, otorisasi, dan manajemen sesi yang jelas.
7. Rencana implementasi berdasarkan prioritas dan dependensi pekerjaan.
8. Kriteria penerimaan fitur yang objektif dan dapat diuji.
9. Strategi untuk menangani perubahan desain UI/UX tanpa merusak implementasi.
10. Dokumentasi yang dapat dipelihara selama siklus pengembangan aplikasi.

Semua dokumen harus saling berhubungan dan tidak boleh berisi keputusan yang saling bertentangan.

---

# 4. TAHAP 1 — AUDIT DAN ANALISIS REPOSITORY

Sebelum membuat dokumen, lakukan audit menyeluruh terhadap repository proyek yang tersedia.

## 4.1. Pelajari kondisi aktual proyek

Mulai dengan membaca:

- `package.json` dan lockfile yang tersedia.
- Konfigurasi Vite, TypeScript, ESLint, Prettier, Tailwind CSS, dan konfigurasi terkait lainnya.
- Seluruh struktur folder dan file dalam `src/`.
- Konfigurasi routing serta seluruh halaman dan komponen yang digunakan.
- Komponen layout, navigasi, form, tabel, modal, notifikasi, dan komponen UI lainnya.
- File data dummy, mock data, tipe data, konstanta, hooks, services, dan utilities.
- Penggunaan state, pengambilan data, validasi form, dan penanganan error.
- Sistem autentikasi atau otorisasi yang mungkin sudah diimplementasikan.
- Asset dan file desain yang tersedia di repository.
- File dokumentasi, konfigurasi environment, serta script development dan build.

Jika tersedia gambar desain, prototipe, atau hasil ekspor UI/UX, pelajari dan gunakan sebagai referensi. Jika file desain eksternal tidak tersedia, jelaskan batasan analisis berdasarkan sumber yang benar-benar tersedia.

Jangan hanya mengandalkan struktur folder. Baca implementasi kode untuk memahami perilaku sistem yang sesungguhnya.

## 4.2. Identifikasi masalah

Periksa setidaknya aspek berikut:

- Struktur folder dan konsistensi pendekatan arsitektur.
- Konsistensi penamaan file, folder, komponen, variabel, fungsi, dan tipe.
- Pemisahan antara UI, business logic, data access, dan routing.
- Komponen yang terlalu besar, duplikatif, atau memiliki tanggung jawab berlebihan.
- Data dummy yang masih ditulis langsung di dalam file TSX.
- Duplikasi tipe data dan model.
- Ketidakkonsistenan layout, styling, spacing, warna, typography, dan komponen.
- Penggunaan hardcoded value yang seharusnya menjadi konfigurasi atau design token.
- Kesiapan integrasi dengan REST API atau mekanisme komunikasi lain yang relevan.
- Penanganan loading, error, empty state, success state, dan kondisi jaringan.
- Kesiapan autentikasi, otorisasi berbasis role, route protection, dan pengelolaan session.
- Validasi input pada sisi frontend.
- Aksesibilitas, responsivitas, dan konsistensi dengan desain UI/UX.
- Keamanan pengelolaan token, cookie, environment variable, serta data sensitif.
- Testing, linting, type checking, build, dan maintainability.
- Risiko perubahan desain serta dampaknya terhadap komponen dan halaman.
- Potensi masalah performa dan skalabilitas frontend.

Periksa juga apakah ada bagian yang sudah baik dan sebaiknya dipertahankan. Jangan mengusulkan penggantian teknologi hanya karena ada alternatif lain yang lebih populer.

## 4.3. Format laporan audit

Untuk setiap temuan penting, sertakan:

| Kolom       | Penjelasan                                 |
| ----------- | ------------------------------------------ |
| ID          | Identitas temuan, misalnya AUD-001         |
| Lokasi      | File atau folder terkait                   |
| Temuan      | Kondisi aktual yang ditemukan              |
| Dampak      | Risiko atau masalah yang ditimbulkan       |
| Prioritas   | Critical, High, Medium, atau Low           |
| Rekomendasi | Solusi yang disarankan                     |
| Dependensi  | Bagian lain yang terdampak                 |
| Status      | Verified, Partially Verified, atau Unknown |

Pisahkan temuan berdasarkan fakta kode, kebutuhan produk, rekomendasi teknis, dan asumsi yang belum terverifikasi.

Jangan mengklaim telah menemukan masalah pada suatu file tanpa benar-benar memeriksa file tersebut.

Buat hasil audit dalam `docs/00-project-audit.md`.

---

# 5. TAHAP 2 — IDENTIFIKASI GAP DAN ASUMSI

Sebelum menyusun arsitektur, identifikasi informasi yang belum tersedia dan keputusan yang belum dapat dipastikan.

Kelompokkan menjadi:

1. **Verified:** didukung oleh kode, desain, atau informasi yang tersedia.
2. **Proposed:** rekomendasi arsitektur yang diajukan untuk dipertimbangkan.
3. **Assumption:** asumsi sementara yang diperlukan untuk menyusun rancangan.
4. **Open Decision:** keputusan yang harus dikonfirmasi oleh pemilik produk atau tim terkait.
5. **Out of Scope:** hal yang belum termasuk dalam cakupan proyek.

Buat daftar pertanyaan dan keputusan yang perlu dikonfirmasi, termasuk jika relevan:

- Siapa pengguna LIMEN?
- Apa saja peran dan hak akses pengguna?
- Bagaimana alur absensi yang diharapkan?
- Apakah terdapat perbedaan proses berdasarkan role, unit, lokasi, atau jenis pengguna?
- Bagaimana aturan waktu, jadwal, keterlambatan, dan koreksi absensi?
- Apakah absensi memerlukan GPS, geofencing, selfie, QR code, atau bukti lainnya?
- Apakah tersedia dashboard, laporan, ekspor data, notifikasi, atau fitur administrasi?
- Apakah ada sistem eksternal yang akan diintegrasikan?
- Bagaimana kebijakan autentikasi, sesi, reset kata sandi, dan pemulihan akun?
- Bagaimana proses persetujuan dan perubahan data absensi?

Jangan menyatakan semua fitur di atas sudah menjadi kebutuhan LIMEN. Gunakan daftar tersebut sebagai pertanyaan penemuan kebutuhan.

Jika informasi belum tersedia, lanjutkan dengan rancangan sementara yang diberi label jelas. Jangan berhenti hanya karena belum semua pertanyaan dapat dijawab.

---

# 6. TAHAP 3 — SUSUNAN DOKUMEN YANG HARUS DIHASILKAN

Buat seluruh dokumen sebagai file Markdown yang saling terhubung dan tersimpan dalam folder `docs/`.

Gunakan struktur berikut sebagai usulan awal:

```text
docs/
├── 00-project-audit.md
├── 01-project-overview.md
├── 02-prd.md
├── 03-srs.md
├── 04-wbs.md
├── 05-sdd.md
├── 06-api-documentation.md
├── 07-uat-checklist.md
├── 08-design-change-backup-plan.md
├── 09-decision-log.md
├── 10-glossary.md
└── assets/
    └── diagrams/
```

Struktur dapat disesuaikan apabila terdapat alasan yang jelas. Jangan membuat file kosong atau hanya berisi daftar isi.

## DOKUMEN 1 — Project Overview dan Audit

File: `docs/01-project-overview.md`

Dokumen harus menjelaskan:

- Ringkasan proyek LIMEN.
- Latar belakang dan permasalahan yang hendak diselesaikan.
- Tujuan proyek.
- Lingkup sistem sementara.
- Teknologi yang digunakan dan teknologi yang direncanakan.
- Kondisi implementasi saat ini.
- Pembagian tanggung jawab tim frontend, backend, dan UI/UX.
- Dependensi antartim.
- Risiko dan pertanyaan terbuka.
- Ringkasan masalah utama dari hasil audit.

Hindari pengulangan berlebihan dari dokumen lain. Gunakan tautan internal Markdown untuk merujuk ke dokumen terkait.

## DOKUMEN 2 — PRD (Product Requirements Document)

File: `docs/02-prd.md`

Walaupun tidak termasuk dalam daftar awal, dokumen ini harus dibuat karena proyek belum memiliki PRD dan semua spesifikasi teknis memerlukan fondasi kebutuhan produk.

PRD setidaknya mencakup:

- Product overview.
- Problem statement.
- Tujuan dan indikator keberhasilan.
- Target pengguna dan persona jika dapat didukung informasi.
- User needs dan pain points.
- Product scope dan out of scope.
- Daftar fitur berdasarkan prioritas.
- User journey dan user flow.
- User stories dengan format yang sesuai.
- Aturan bisnis yang diketahui.
- Kebutuhan nonfungsional pada tingkat produk.
- Dependensi, risiko, asumsi, dan batasan.
- Acceptance criteria tingkat produk.
- Daftar pertanyaan yang membutuhkan keputusan stakeholder.

Bedakan fitur yang sudah tampak pada UI/UX dari fitur yang benar-benar telah dikonfirmasi sebagai kebutuhan.

Jangan menyimpulkan kebutuhan bisnis hanya dari nama halaman atau tampilan visual.

## DOKUMEN 3 — SRS (Software Requirements Specification)

File: `docs/03-srs.md`

Gunakan struktur formal yang terinspirasi oleh praktik IEEE 29148 atau standar rekayasa kebutuhan yang relevan. Jangan mengklaim dokumen sepenuhnya memenuhi standar apabila seluruh ketentuannya belum diverifikasi.

SRS setidaknya berisi:

1. Introduction
   - Purpose
   - Scope
   - Definitions, acronyms, dan abbreviations
   - References
2. Overall Description
   - Product perspective
   - User classes and characteristics
   - Operating environment
   - Constraints
   - Assumptions and dependencies
3. Functional Requirements
   - Kebutuhan setiap modul dan fitur.
   - Identitas unik setiap requirement, misalnya FR-AUTH-001.
   - Deskripsi yang jelas dan dapat diuji.
   - Prioritas serta sumber kebutuhan.
4. Non-Functional Requirements
   - Performance.
   - Security.
   - Reliability dan availability.
   - Usability dan accessibility.
   - Maintainability.
   - Compatibility dan responsiveness.
   - Data integrity.
   - Observability dan auditability jika relevan.
5. Business Rules
6. External Interface Requirements
   - User interface.
   - Software interfaces.
   - API interfaces.
7. Data Requirements
8. Acceptance Criteria
9. Requirement Traceability Matrix
10. Open Issues

Kebutuhan harus konkret dan bisa diuji. Hindari pernyataan abstrak seperti “sistem harus cepat” tanpa metrik, ruang lingkup, atau target yang dapat dievaluasi.

Jika nilai target belum ditentukan, tandai sebagai `TBD` dan usulkan target awal untuk dibahas, bukan mengarangnya sebagai ketetapan.

## DOKUMEN 4 — WBS (Work Breakdown Structure)

File: `docs/04-wbs.md`

Susun seluruh pekerjaan yang diperlukan untuk mengembangkan LIMEN dari kondisi sekarang hingga siap dirilis.

Kelompokkan pekerjaan menjadi fase seperti:

1. Discovery dan requirement analysis.
2. Audit dan perbaikan fondasi frontend.
3. Perancangan arsitektur sistem.
4. Perancangan database dan API.
5. Implementasi backend.
6. Implementasi frontend.
7. Integrasi frontend dan backend.
8. Testing dan UAT.
9. Deployment dan release.
10. Maintenance dan perubahan desain.

Untuk setiap item pekerjaan, berikan:

- WBS ID.
- Nama pekerjaan.
- Deskripsi dan deliverable.
- Prioritas.
- Dependensi.
- Tim atau peran yang bertanggung jawab.
- Kriteria selesai atau Definition of Done.
- Risiko atau catatan.

Bedakan tugas frontend yang menjadi tanggung jawab saya dari pekerjaan backend dan pekerjaan bersama.

Jangan menetapkan durasi yang dibuat-buat. Jika estimasi diperlukan, berikan sebagai estimasi awal dengan asumsi yang eksplisit, bukan komitmen jadwal.

Tunjukkan dependensi penting menggunakan tabel, pohon WBS, atau diagram Mermaid.

## DOKUMEN 5 — SDD (Software Design Document)

File: `docs/05-sdd.md`

Dokumen ini harus menjadi acuan desain teknis bagi semua tim.

Cakupan minimum:

### A. Architecture Overview

- Gambaran arsitektur sistem.
- Tanggung jawab frontend, backend, database, dan layanan eksternal.
- Alur komunikasi antarbagian.
- Pilihan arsitektur beserta alasan dan trade-off.
- Diagram container atau component menggunakan Mermaid.

### B. Frontend Architecture

Analisis pendekatan struktur frontend yang sesuai dengan repository aktual.

Evaluasi pemisahan berdasarkan fitur, halaman, komponen bersama, atau kombinasi yang paling masuk akal.

Jangan memaksakan satu pola arsitektur secara dogmatis.

Rancang pemisahan tanggung jawab antara:

- App bootstrap dan routing.
- Layout dan halaman.
- Feature modules.
- Shared UI components.
- API client dan service layer.
- Domain types.
- State management.
- Form validation.
- Authentication dan authorization.
- Utilities, hooks, dan konfigurasi.
- Tests.

Berikan usulan struktur folder yang realistis, mudah dipahami developer pemula, dan dapat berkembang tanpa overengineering.

Sertakan aturan import, penamaan file, batas tanggung jawab komponen, serta pengelolaan shared code.

### C. Backend Architecture

Rancang backend menggunakan Go.

Jelaskan pembagian tanggung jawab secara konseptual, seperti:

- HTTP handlers atau controllers.
- Application/service layer.
- Domain/business logic.
- Repository atau data access layer.
- Authentication dan authorization.
- Validation dan error handling.
- Database access.
- Configuration dan logging.

Rekomendasikan pendekatan yang proporsional terhadap skala dan kebutuhan proyek. Jangan menambahkan microservices atau abstraksi kompleks tanpa kebutuhan yang jelas.

Bahasa dan database sudah diarahkan ke Go dan PostgreSQL, tetapi framework HTTP, database driver, ORM atau query generator, serta metode migrasi masih harus dievaluasi dan dicatat sebagai keputusan arsitektur.

### D. Database Design

Rancang model data awal PostgreSQL berdasarkan requirement yang tersedia.

Sertakan:

- Entitas dan tanggung jawabnya.
- Kolom penting dan tipe data yang diusulkan.
- Primary key dan foreign key.
- Unique constraint, check constraint, serta nullability.
- Relasi antartabel.
- Index yang diperlukan.
- Aturan integritas data.
- Timestamp dan audit fields jika diperlukan.
- Strategi database migration.
- Pertimbangan transaksi dan konsistensi data.

Gunakan ERD Mermaid bila sesuai.

Jangan langsung menganggap tabel pengguna, absensi, jadwal, lokasi, atau persetujuan tertentu sebagai kebutuhan final. Hubungkan setiap entitas dengan requirement yang mendasarinya.

### E. Authentication, Session, dan Authorization

Jelaskan rancangan autentikasi serta akses yang sesuai untuk aplikasi web.

Evaluasi:

- Login dan logout.
- Penyimpanan serta validasi sesi.
- Cookie `HttpOnly`, `Secure`, dan `SameSite` jika menggunakan cookie.
- Penggunaan JWT hanya jika memang memiliki alasan arsitektural.
- Refresh token atau mekanisme perpanjangan sesi jika diperlukan.
- Pengelolaan expired session.
- Password hashing di backend.
- Hak akses berbasis role atau permission.
- Route guards pada frontend.
- Validasi otorisasi di backend.
- Penanganan akses tanpa izin.
- Perlindungan CSRF jika relevan dengan metode autentikasi.
- CORS, rate limiting, dan perlindungan terhadap brute-force login.

Jelaskan dengan tegas bahwa route guards frontend bukan mekanisme keamanan utama. Backend tetap harus memvalidasi identitas dan hak akses setiap permintaan yang membutuhkan perlindungan.

Jangan menganggap JWT wajib digunakan. Bandingkan pendekatan session berbasis cookie dengan token berdasarkan kebutuhan LIMEN, kemudian rekomendasikan satu pendekatan beserta alasan dan konsekuensinya.

### F. Frontend–Backend Integration

Jelaskan:

- Kontrak komunikasi frontend dan backend.
- Base URL dan environment configuration.
- API client dan mekanisme request.
- Serialisasi serta deserialisasi data.
- Validasi input.
- Loading, success, empty, error, timeout, dan network failure states.
- Penanganan sesi kedaluwarsa.
- Mapping respons backend ke UI.
- Pagination, filtering, searching, dan sorting jika diperlukan.
- Batasan penggunaan mock data.
- Strategi pengujian integrasi.

### G. Design System dan UI/UX Integration

Jelaskan:

- Hubungan desain UI/UX dengan komponen frontend.
- Design tokens untuk warna, typography, spacing, radius, dan shadow.
- Reusable components.
- Konsistensi layout.
- Responsiveness dan accessibility.
- Mekanisme implementasi perubahan desain.
- Strategi agar perubahan visual tidak memaksa penulisan ulang business logic.

### H. Cross-Cutting Concerns

Bahas testing, logging, error handling, configuration, security, deployment assumptions, observability, dan pemeliharaan sistem sesuai cakupan proyek.

### I. Architecture Decision Records

Cantumkan keputusan arsitektur penting, pilihan alternatif, alasan pemilihan, trade-off, serta pertanyaan yang masih terbuka.

Pisahkan keputusan yang sudah disepakati dari rekomendasi yang belum disetujui.

## DOKUMEN 6 — API Documentation / API Contract

File: `docs/06-api-documentation.md`

Dokumen API dibuat untuk menjadi **kontrak awal antara tim frontend dan backend**, bukan sebagai klaim bahwa endpoint telah diimplementasikan.

Gunakan gaya REST API berbasis HTTP dan JSON sebagai baseline awal, kecuali terdapat bukti atau kebutuhan kuat yang mengarah pada pendekatan berbeda.

Setiap endpoint harus memiliki:

- HTTP method.
- Path.
- Tujuan.
- Requirement terkait.
- Status implementasi: Proposed, Approved, atau Implemented.
- Authentication dan authorization requirements.
- Path, query, dan request parameters.
- Request headers.
- Request body.
- Validasi input.
- Contoh request.
- Contoh response sukses.
- Contoh response error.
- HTTP status codes.
- Error codes.
- Side effects dan aturan bisnis.
- Pagination, filtering, atau sorting jika relevan.

### Standar desain API

Tetapkan rancangan konsisten untuk:

- Base path dan API versioning.
- Penamaan endpoint dan resource.
- Format JSON.
- Format tanggal, waktu, timezone, dan identifier.
- Struktur error response.
- Pagination.
- Validation errors.
- Authentication dan session expiry.
- Authorization failures.
- Idempotency jika relevan.
- Pengelompokan endpoint berdasarkan modul.

Buat matriks endpoint dan hubungkan setiap endpoint dengan requirement yang dilayaninya.

Jangan membuat endpoint hanya karena nama halaman sudah ada. Endpoint harus mendukung use case dan aturan bisnis yang telah dianalisis.

### Contoh format dokumentasi endpoint

Gunakan contoh berikut sebagai pola penulisan, bukan sebagai endpoint final:

```http
POST /api/v1/auth/login
Content-Type: application/json
```

Contoh request:

```json
{
  "identifier": "user@example.com",
  "password": "example-password"
}
```

Contoh response hanya boleh ditulis setelah perilaku autentikasi dan format respons disepakati. Jika keputusan tersebut belum ada, beri label `Proposed Contract`.

Jika bermanfaat, hasilkan spesifikasi OpenAPI dalam file terpisah, misalnya `docs/openapi.yaml`. File tersebut harus konsisten dengan dokumentasi Markdown dan dapat divalidasi secara sintaksis.

Jangan membuat data contoh yang menyerupai kredensial, token, atau data pribadi nyata.

## DOKUMEN 7 — UAT Checklist

File: `docs/07-uat-checklist.md`

Buat checklist User Acceptance Testing yang dapat digunakan stakeholder atau perwakilan pengguna untuk menguji apakah aplikasi sesuai dengan kebutuhan.

UAT harus didasarkan pada requirement, user stories, business rules, dan acceptance criteria yang telah didefinisikan.

Kelompokkan pengujian berdasarkan modul atau user journey yang terkonfirmasi.

Setiap test case berisi:

- Test Case ID.
- Requirement ID.
- Nama skenario.
- Tujuan.
- Prasyarat.
- Data pengujian.
- Langkah-langkah.
- Hasil yang diharapkan.
- Hasil aktual.
- Status: Not Run, Pass, Fail, Blocked, atau Not Applicable.
- Severity jika terjadi kegagalan.
- Catatan atau bukti.

Sertakan skenario positif, negatif, batas input, validasi, akses tanpa izin, loading/error states, responsivitas, dan integrasi sesuai relevansi.

Jangan hanya menguji apakah tampilan bisa dibuka. UAT harus memvalidasi alur dan hasil yang terlihat oleh pengguna.

Pisahkan:

- Functional UAT.
- Role and permission testing.
- Data validation.
- Integration scenarios.
- UI/UX acceptance.
- Compatibility and responsiveness.
- Regression testing.
- Release acceptance.

Bedakan UAT dari unit testing, integration testing teknis, dan security testing.

Skenario yang belum bisa dilakukan karena API atau backend belum tersedia harus diberi status `Blocked` atau `Not Run`, bukan diasumsikan berhasil.

Tambahkan ringkasan hasil UAT serta kriteria Go/No-Go yang dapat disepakati oleh pemilik produk.

## DOKUMEN 8 — Design Change & Backup Plan

File: `docs/08-design-change-backup-plan.md`

Dokumen ini berfokus pada **perubahan desain aplikasi oleh pengguna, stakeholder, atau tim UI/UX**, serta cara mengurangi dampaknya terhadap frontend yang sudah dibuat.

Jangan membatasi dokumen pada backup file biasa. Sertakan strategi pencegahan, pengelolaan perubahan, rollback, dan pemulihan implementasi.

### A. Baseline Design

- Menetapkan versi desain yang menjadi acuan implementasi.
- Menyimpan tautan atau referensi desain dan tanggal persetujuan.
- Mendokumentasikan design tokens dan komponen terkait.
- Mendefinisikan proses persetujuan perubahan desain.

### B. Change Request Workflow

Definisikan alur:

1. Permintaan perubahan diajukan.
2. Perubahan dicatat dan diberi ID.
3. Tim menilai dampak visual, fungsional, teknis, dan estimasi usaha.
4. Perubahan diperiksa terhadap requirement dan API contract.
5. Stakeholder menyetujui atau menolak perubahan.
6. Implementasi dilakukan pada branch yang sesuai.
7. Hasil diuji dan dibandingkan dengan desain terbaru.
8. Perubahan didokumentasikan dan baseline diperbarui.

Sertakan template change request, contoh perubahan minor/major, serta kriteria eskalasi.

### C. Change Impact Analysis

Analisis dampak perubahan desain terhadap:

- Page layout.
- Reusable components.
- Design tokens.
- Form dan validation.
- Routing.
- State management.
- Business logic.
- API integration.
- Accessibility.
- Responsive behavior.
- UAT dan regression tests.

Bedakan perubahan visual murni dari perubahan yang memengaruhi alur bisnis atau struktur data.

### D. Backup dan Version Control

Rekomendasikan pendekatan untuk:

- Git dan remote repository.
- Branching dan pull request.
- Commit yang terfokus.
- Tag atau release checkpoint.
- Penyimpanan referensi desain yang telah disetujui.
- Backup repository dan konfigurasi yang aman.
- Pemulihan perubahan yang gagal.
- Pencegahan kehilangan pekerjaan saat refactoring.

Jangan menyimpan secret, token, atau kredensial di repository maupun backup yang tidak aman.

### E. Rollback Plan

Jelaskan langkah rollback apabila:

- Perubahan desain merusak layout yang sudah stabil.
- Perubahan komponen menimbulkan regresi pada banyak halaman.
- Implementasi desain baru belum memenuhi UAT.
- Perubahan visual memengaruhi alur bisnis atau integrasi API.
- Rilis baru harus dikembalikan ke versi sebelumnya.

Tentukan prasyarat rollback, prosedur, validasi pascarollback, dan pihak yang menyetujui pemulihan.

### F. Prevention Strategy

Rekomendasikan cara mengurangi biaya perubahan desain melalui design tokens, komponen modular, pemisahan UI dan business logic, penggunaan tipe yang konsisten, visual regression testing jika proporsional, serta dokumentasi perubahan.

Jangan mengasumsikan semua perubahan desain dapat diselesaikan tanpa perubahan kode. Jelaskan batasannya secara realistis.

### G. Change Log dan Contoh

Buat template log perubahan desain yang mencatat ID, tanggal, alasan, versi desain, file terdampak, keputusan, hasil pengujian, dan status rollback.

## DOKUMEN 9 — Decision Log / Architecture Decision Records

File: `docs/09-decision-log.md`

Catat keputusan yang memiliki dampak signifikan terhadap desain atau pengembangan sistem.

Setiap keputusan memuat:

- ID keputusan.
- Judul.
- Konteks dan masalah.
- Alternatif yang dipertimbangkan.
- Keputusan atau rekomendasi.
- Alasan.
- Konsekuensi dan trade-off.
- Status: Proposed, Accepted, Rejected, atau Superseded.
- Penanggung jawab keputusan jika diketahui.
- Tanggal, jika dapat ditentukan.

Prioritaskan keputusan tentang struktur frontend, komunikasi API, autentikasi, pengelolaan state, database access, migration, API versioning, testing, dan deployment.

Jangan mencatat rekomendasi yang belum disetujui sebagai keputusan final.

## DOKUMEN 10 — Glossary

File: `docs/10-glossary.md`

Buat kamus istilah agar seluruh tim memiliki pemahaman yang konsisten mengenai istilah bisnis, istilah UI/UX, singkatan teknis, konsep autentikasi, dan entitas data.

Setiap istilah sebaiknya mempunyai definisi singkat, konteks penggunaannya, serta sinonim atau istilah yang tidak boleh digunakan secara bergantian apabila maknanya berbeda.

---

# 7. TAHAP 4 — KONSISTENSI ANTARDOKUMEN

Setelah seluruh dokumen dibuat, lakukan pemeriksaan silang.

Pastikan bahwa:

1. Setiap kebutuhan produk dalam PRD memiliki keterkaitan yang jelas dengan SRS.
2. Setiap requirement yang relevan memiliki implikasi teknis dalam SDD.
3. Endpoint API diturunkan dari use case dan requirement yang benar-benar dibutuhkan.
4. Model database mendukung business rules yang telah didefinisikan.
5. Peran dan permission konsisten antara SRS, SDD, dan API Documentation.
6. UAT menguji acceptance criteria yang terdaftar.
7. WBS mencakup seluruh deliverable penting dan dependensinya.
8. Design Change Plan mendukung proses implementasi, pengujian, dan rollback.
9. Keputusan yang belum dikonfirmasi tetap ditandai sebagai usulan atau open decision.
10. Tidak ada fitur, tabel, endpoint, atau aturan bisnis yang muncul tiba-tiba tanpa dasar kebutuhan yang jelas.

Buat requirement traceability matrix untuk menghubungkan sekurang-kurangnya:

`PRD ID → SRS ID → SDD Component → API Endpoint/Data Entity → UAT Test Case → WBS ID`

Tidak semua requirement harus memiliki endpoint API. Untuk requirement yang tidak memerlukannya, jelaskan implementasi atau pengujiannya melalui komponen lain.

---

# 8. TAHAP 5 — STANDAR ARSITEKTUR DAN REKOMENDASI

Semua rekomendasi teknologi harus mempertimbangkan keadaan proyek yang sebenarnya.

Gunakan prinsip berikut:

- Pilih solusi yang cukup sederhana untuk tim pemula tetapi tidak mengorbankan kualitas dasar.
- Hindari overengineering.
- Hindari migrasi teknologi jika tidak memberikan manfaat yang jelas.
- Utamakan konsistensi daripada penggunaan terlalu banyak library.
- Pisahkan tanggung jawab frontend dan backend.
- Jadikan API contract sebagai batas komunikasi antartim.
- Gunakan tipe dan skema yang eksplisit.
- Pastikan validasi dan otorisasi kritis dilakukan di backend.
- Hindari ketergantungan business logic terhadap detail presentasi.
- Pisahkan configuration dari kode.
- Jangan menyimpan rahasia di kode frontend.
- Jangan memasukkan file generated, dependency, atau build output secara tidak perlu ke dokumentasi.
- Dokumentasikan trade-off dari setiap rekomendasi penting.

Untuk keputusan penting, bandingkan alternatif dan pilih rekomendasi yang paling sesuai dengan kebutuhan proyek. Jangan sekadar menyebut banyak opsi tanpa kesimpulan.

Jangan menggunakan jumlah file, jumlah abstraksi, atau kompleksitas arsitektur sebagai indikator kualitas dengan sendirinya.

---

# 9. TAHAP 6 — FORMAT, KUALITAS, DAN VALIDASI DOKUMEN

Semua hasil harus ditulis menggunakan Bahasa Indonesia yang formal, jelas, konsisten, dan mudah dipahami developer pemula.

Istilah teknis bahasa Inggris boleh dipertahankan jika lebih tepat. Gunakan satu istilah secara konsisten untuk konsep yang sama.

Ketentuan dokumentasi:

- Gunakan heading Markdown yang terstruktur.
- Gunakan tabel untuk matriks, daftar requirement, API, keputusan, dan test case.
- Gunakan diagram Mermaid untuk arsitektur, alur proses, relasi, dan dependensi apabila membantu pemahaman.
- Gunakan ID unik dan konsisten untuk requirement, endpoint, test case, serta pekerjaan.
- Tambahkan tautan internal antardokumen.
- Cantumkan asumsi, batasan, dan status keputusan.
- Cantumkan sumber atau referensi teknis ketika relevan.
- Hindari pengulangan konten yang sama secara berlebihan.
- Jangan membuat dokumen terlalu panjang tanpa nilai tambah.
- Jangan mengisi dokumen dengan penjelasan generik yang tidak spesifik terhadap LIMEN.

Jika membuat diagram Mermaid, pastikan sintaksnya benar dan node-node yang ditampilkan sesuai dengan uraian arsitektur.

Setelah menulis setiap dokumen, lakukan pemeriksaan konsistensi dan kelengkapan.

Validasi OpenAPI jika file tersebut dibuat. Jalankan validasi teknis yang relevan hanya jika tool dan dependensinya tersedia. Jangan mengklaim telah menjalankan validasi yang sebenarnya tidak dilakukan.

---

# 10. BATASAN DAN ATURAN KERJA

Patuhi aturan berikut selama proses pengerjaan:

1. **Jangan langsung melakukan refactoring.** Tahap ini berfokus pada audit dan dokumentasi.
2. Jangan menghapus atau menimpa file proyek yang sudah ada.
3. Jangan mengubah `package.json`, dependency, kode aplikasi, atau konfigurasi tanpa kebutuhan dan persetujuan yang jelas.
4. Jangan membuat implementasi backend Go atau database migration pada tahap dokumentasi ini.
5. Jangan menganggap API contract sudah disetujui oleh tim backend.
6. Jangan menganggap rancangan database sudah final sebelum divalidasi oleh tim backend.
7. Jangan mengarang fitur, role, endpoint, atau business rules.
8. Jangan mengklaim desain telah dianalisis secara visual jika hanya ada informasi yang tidak cukup untuk mendukungnya.
9. Jangan berhenti hanya karena ada informasi yang belum tersedia. Buat rancangan sementara dan catat ketidakpastiannya.
10. Jangan mengubah keputusan sementara menjadi fakta final.
11. Pertahankan seluruh pekerjaan yang sudah baik dan usulkan perbaikan secara proporsional.
12. Jika terdapat konflik antara desain, kode aktual, dan requirement, dokumentasikan konflik tersebut beserta rekomendasi penyelesaiannya.

---

# 11. ALUR EKSEKUSI

Kerjakan dengan urutan berikut:

### Fase A — Repository Discovery

Pelajari repository, package manifest, source code, assets, konfigurasi, dan dokumentasi yang tersedia. Susun laporan audit berdasarkan temuan aktual.

### Fase B — Requirements Discovery

Identifikasi kebutuhan dari implementasi yang ada, desain UI/UX, serta informasi proyek. Susun PRD dan daftar open decisions tanpa mengada-ada.

### Fase C — Requirements Specification

Susun SRS dengan ID requirement, acceptance criteria, business rules, dan traceability.

### Fase D — System Design

Susun SDD yang mencakup arsitektur frontend, arsitektur backend Go, database PostgreSQL, autentikasi, otorisasi, integrasi, keamanan, serta strategi pengujian.

### Fase E — API Contract

Rancang API Documentation sebagai kontrak yang dapat dibahas dan disepakati oleh tim frontend dan backend.

### Fase F — Project Planning

Susun WBS berdasarkan requirement, design decisions, dependensi, deliverable, dan tanggung jawab setiap tim.

### Fase G — Acceptance & Change Management

Susun UAT Checklist serta Design Change & Backup Plan.

### Fase H — Cross-Document Validation

Verifikasi konsistensi seluruh dokumen, traceability, diagram, format, dan status keputusan.

Jangan menyelesaikan seluruh pekerjaan hanya dalam bentuk ringkasan di chat. Hasil utama harus berupa file dokumentasi yang benar-benar dibuat di repository.

Jika ukuran pekerjaan mengharuskan eksekusi bertahap, simpan kemajuan dalam file agar tahap selanjutnya dapat dilanjutkan tanpa mengulang analisis.

---

# 12. HASIL AKHIR YANG WAJIB DISERAHKAN

Minimal hasil akhir berupa:

- [ ] Audit repository dan daftar masalah.
- [ ] Project overview.
- [ ] PRD.
- [ ] SRS.
- [ ] WBS.
- [ ] SDD.
- [ ] API Documentation.
- [ ] UAT Checklist.
- [ ] Design Change & Backup Plan.
- [ ] Decision Log.
- [ ] Glossary.
- [ ] Requirement traceability matrix.
- [ ] Diagram arsitektur, flow, atau ERD yang relevan.
- [ ] OpenAPI specification jika layak digunakan.
- [ ] Ringkasan risiko, asumsi, keputusan terbuka, dan langkah implementasi berikutnya.

Dokumentasi tidak dianggap selesai hanya karena seluruh file sudah dibuat. Kualitasnya harus diperiksa berdasarkan kelengkapan isi, kesesuaian dengan repository, konsistensi antardokumen, dan kegunaannya bagi tim.

---

# 13. LAPORAN PENUTUP

Setelah seluruh pekerjaan selesai, berikan laporan singkat yang mencakup:

1. Ringkasan kondisi frontend LIMEN.
2. Masalah paling kritis yang ditemukan.
3. File dokumentasi yang berhasil dibuat.
4. Rekomendasi arsitektur frontend, backend, API, dan database.
5. Keputusan penting yang masih membutuhkan persetujuan.
6. Risiko terbesar yang dapat menghambat integrasi antartim.
7. Urutan implementasi berikutnya berdasarkan dependensi.
8. Pemeriksaan yang benar-benar sudah dilakukan serta pemeriksaan yang belum dapat dilakukan.

**Mulailah dengan membaca repository dan melakukan audit aktual. Jangan langsung menulis seluruh dokumen berdasarkan deskripsi prompt saja.** Gunakan hasil analisis tersebut sebagai fondasi semua rancangan selanjutnya.
