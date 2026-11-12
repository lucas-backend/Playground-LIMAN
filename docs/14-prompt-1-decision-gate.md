# Gate Keputusan Integrasi Frontend–Backend LIMEN

- **Status:** Disetujui untuk membuka Prompt 2
- **Tahap:** Prompt 1 — menutup keputusan kontrak dan environment
- **Tanggal:** 2026-11-12
- **Batasan:** Dokumen ini tidak mengubah source aplikasi, dependency, atau konfigurasi build.
- **Rujukan fakta:** [12-backend-integration-findings.md](./12-backend-integration-findings.md), [11-frontend-api-integration-plan.md](./11-frontend-api-integration-plan.md), dan [openapi.yaml](../openapi.yaml).

> Persetujuan pengguna pada 2026-11-12 membuka Prompt 2 berdasarkan rekomendasi yang tercantum. Detail operasional yang belum memiliki nilai konkret tetap menjadi prasyarat sebelum pengujian browser atau deployment.

## 1. Fakta yang menjadi dasar

1. `openapi.yaml` di root frontend dan backend saat ini identik berdasarkan SHA-256 yang tercatat pada findings backend.
2. Cookie session backend bernama `session`, bersifat `HttpOnly`, `Secure=true`, dan `SameSite=Strict`.
3. Cookie CSRF backend bernama `csrf`, dapat dibaca JavaScript, dan mutation membutuhkan header `X-CSRF-Token`.
4. Backend tidak menunjukkan konfigurasi CORS pada area yang diperiksa.
5. Endpoint `API-ABS-*` belum terdaftar pada router aktif; keberadaan schema di OpenAPI bukan bukti endpoint siap dipanggil.
6. Fingerprint aktif pada `/api/v1/fingerprint/*` tanpa auth middleware.
7. Frontend belum memiliki test runner pada `package.json` dan belum ditemukan generator tipe OpenAPI.

Fakta di atas tidak boleh diubah menjadi asumsi bisnis, deployment, keamanan, atau ownership tanpa keputusan eksplisit.

## 2. Daftar keputusan yang harus disetujui

### DEC-GATE-001 — Source of truth OpenAPI

- **Pertanyaan:** File/spec mana yang menjadi kontrak resmi untuk frontend dan backend?
- **Opsi:**
  1. `C:\Users\lucas\Project\liman-frontend\openapi.yaml` sebagai source of truth bersama; backend mengonsumsi versi/commit yang sama.
  2. Spec di repository backend sebagai source of truth; frontend menyalin atau mengambilnya melalui proses sinkronisasi yang terdokumentasi.
  3. Spec terpisah per repository; perubahan wajib melalui proses sinkronisasi dan pemeriksaan diff.
- **Konsekuensi:**
  - Opsi 1 paling sederhana karena root frontend dan backend saat ini identik, tetapi membutuhkan disiplin sinkronisasi lintas repository.
  - Opsi 2 menempatkan kontrak dekat implementasi backend, tetapi menambah langkah pengambilan spec ke frontend.
  - Opsi 3 meningkatkan risiko drift dan tidak cocok untuk tahap integrasi awal tanpa automation.
- **Rekomendasi:** Opsi 1, dengan version/commit spec yang dicatat dan pemeriksaan hash/diff pada contract test.
- **Pemilik keputusan:** Backend + frontend, dengan persetujuan pemilik arsitektur.
- **Status:** **Disetujui — Opsi 1.**
- **Tidak boleh diasumsikan:** File yang kebetulan tersedia atau hash yang sama saat ini belum berarti lokasi tersebut telah disetujui sebagai governance source of truth.

### DEC-GATE-002 — Strategi TypeScript types

- **Pertanyaan:** Apakah tipe API dibuat otomatis dari OpenAPI atau dipelihara manual?
- **Opsi:**
  1. Generated types dari OpenAPI pada setiap perubahan kontrak.
  2. Manual TypeScript types, divalidasi dengan contract test terhadap OpenAPI.
  3. Hybrid: schema/types dasar generated, model view dan mapper tetap manual.
- **Konsekuensi:**
  - Generated mengurangi drift tipe, tetapi menambah toolchain dan harus menangani kualitas schema.
  - Manual lebih mudah dikendalikan secara lokal, tetapi drift lebih mudah terjadi.
  - Hybrid membatasi generated output pada boundary API dan menjaga fleksibilitas UI, dengan kompleksitas pipeline sedang.
- **Rekomendasi:** Opsi 3; bila toolchain generation belum disetujui, gunakan Opsi 2 sementara hanya setelah keputusan tertulis.
- **Pemilik keputusan:** Frontend + backend.
- **Status:** **Menunggu persetujuan — blocker INT-03.**
- **Tidak boleh diasumsikan:** Tipe manual tidak boleh dianggap sama dengan schema hanya karena nama field tampak serupa.

### DEC-GATE-003 — Test runner dan contract-test workflow

- **Pertanyaan:** Runner frontend dan alur validasi kontrak apa yang wajib digunakan?
- **Opsi:**
  1. Vitest untuk unit/component, dengan contract test terhadap OpenAPI pada CI.
  2. Jest untuk unit/component, dengan contract test terpisah.
  3. Runner lain yang disetujui tim, asalkan command, fixture, dan CI gate terdokumentasi.
- **Konsekuensi:**
  - Vitest selaras dengan Vite dan biasanya lebih ringan untuk setup frontend ini.
  - Jest memiliki ekosistem luas tetapi menambah keputusan konfigurasi pada proyek Vite.
  - Opsi 3 memberi fleksibilitas tetapi tidak cukup spesifik untuk mulai coding.
- **Rekomendasi:** Vitest + contract test yang memvalidasi request/response/error terhadap source spec yang disetujui; test browser/E2E ditambahkan untuk auth dan vertical slice prioritas.
- **Pemilik keputusan:** Frontend lead + pemilik CI; backend menyediakan fixture/endpoint test yang diperlukan.
- **Status:** **Menunggu persetujuan — blocker INT-05 dan INT-14.**
- **Tidak boleh diasumsikan:** `npm run build` atau lint bukan pengganti contract test; belum ada test runner yang boleh dianggap tersedia.

### DEC-GATE-004 — Origin environment dan CORS/proxy

- **Pertanyaan:** Bagaimana browser frontend mencapai API pada dev, staging, dan production?
- **Opsi:**
  1. Same-origin melalui reverse proxy pada semua environment.
  2. Dev memakai Vite proxy; staging/production memakai origin frontend terpisah dengan CORS allowlist eksplisit.
  3. Cross-origin langsung pada semua environment dengan CORS allowlist per environment.
- **Konsekuensi:**
  - Same-origin menyederhanakan cookie dan mengurangi konfigurasi CORS, tetapi membutuhkan proxy deployment.
  - Proxy dev + CORS terkontrol memberi fleksibilitas, tetapi perilaku environment harus diuji terpisah.
  - Cross-origin langsung paling fleksibel, tetapi paling sensitif terhadap credentialed CORS, origin, dan cookie policy.
- **Rekomendasi:** Opsi 2 sebagai default kerja; final origin dan allowlist harus ditulis per environment oleh DevOps/backend.
- **Pemilik keputusan:** DevOps/backend, dengan persetujuan frontend untuk konfigurasi client.
- **Status:** **Disetujui — Opsi 2 sebagai default kerja; origin/allowlist konkret per environment masih wajib dicatat.**
- **Tidak boleh diasumsikan:** `localhost`, hostname staging, domain production, CORS allowlist, proxy, atau `credentials` browser bekerja tanpa konfigurasi dan uji browser nyata.

### DEC-GATE-005 — Secure/SameSite cookie per environment

- **Pertanyaan:** Nilai `Secure` dan `SameSite` apa yang berlaku pada setiap environment?
- **Opsi:**
  1. `Secure=true`, `SameSite=Strict` di dev, staging, dan production; dev wajib HTTPS atau proxy yang mendukungnya.
  2. Dev memakai konfigurasi cookie yang lebih longgar, staging/production tetap `Secure=true`, `SameSite=Strict`.
  3. Jika deployment benar-benar cross-site memerlukan credentialed cookie, gunakan policy yang disetujui security (misalnya `SameSite=None` hanya bersama HTTPS dan CORS ketat).
- **Konsekuensi:**
  - Opsi 1 paling konsisten dan aman, tetapi dapat menghambat HTTP lokal.
  - Opsi 2 memudahkan dev, tetapi meningkatkan perbedaan perilaku dan risiko konfigurasi tidak sengaja terbawa.
  - Opsi 3 dapat menyelesaikan kebutuhan cross-site, tetapi memperluas permukaan CSRF dan tidak boleh dipilih tanpa review security.
- **Rekomendasi:** Pertahankan `Secure=true` dan `SameSite=Strict` sebagai baseline; pilih Opsi 1 bila dev HTTPS/proxy tersedia. Jangan menurunkan policy hanya untuk mengatasi masalah lokal.
- **Pemilik keputusan:** Backend + DevOps + security owner.
- **Status:** **Disetujui — baseline Opsi 1; dev wajib HTTPS atau proxy yang mendukung Secure cookie.**
- **Tidak boleh diasumsikan:** Cookie `session` dan `csrf`, atribut `HttpOnly`, domain/path, atau penerimaan cookie Secure pada HTTP lokal.

### DEC-GATE-006 — Mapping latihan vs quiz

- **Pertanyaan:** Apakah `latihan-soal` adalah quiz dengan scope tertentu atau domain/API terpisah?
- **Opsi:**
  1. Memetakan latihan ke resource quiz/question bank dengan `scope: latihan`.
  2. Memisahkan latihan sebagai resource/endpoint sendiri.
  3. Menunda integrasi latihan sampai kontrak khusus disetujui.
- **Konsekuensi:**
  - Opsi 1 memanfaatkan route aktif, tetapi field/status dan alur UX harus dikonfirmasi.
  - Opsi 2 membutuhkan endpoint dan schema baru; tidak boleh dibuat dari nama route frontend.
  - Opsi 3 mencegah asumsi, tetapi menunda feature latihan.
- **Rekomendasi:** Opsi 1 hanya jika backend/product menyetujui mapping dan lifecycle; jika belum, Opsi 3.
- **Pemilik keputusan:** Product + backend + pemilik fitur pembelajaran.
- **Status:** **Menunggu persetujuan — blocker integrasi latihan.**
- **Tidak boleh diasumsikan:** Nama `latihan-soal`, mock UI, atau enum `scope` saja belum membuktikan kesetaraan seluruh alur.

### DEC-GATE-007 — Scope remedial dan KKM

- **Pertanyaan:** Apa definisi, scope akses, sumber nilai, dan aturan KKM/remedial?
- **Opsi:**
  1. Remedial sebagai sub-fitur assessment/penilaian dengan KKM configurable.
  2. Remedial sebagai domain terpisah dengan kontrak dan status sendiri.
  3. Menunda UI/API remedial dan KKM sampai aturan bisnis serta endpoint tersedia.
- **Konsekuensi:**
  - Opsi 1 menyederhanakan integrasi jika aturan hanya turunan penilaian, tetapi berisiko mengarang status dan eligibility.
  - Opsi 2 lebih eksplisit, tetapi membutuhkan schema, route, dan ownership tambahan.
  - Opsi 3 menjaga integritas kontrak, tetapi fitur tetap blocked.
- **Rekomendasi:** Opsi 3 sekarang; evaluasi Opsi 1 hanya setelah product/backend menyetujui aturan KKM, eligibility, scope role, dan endpoint.
- **Pemilik keputusan:** Product + backend + pemilik akademik.
- **Status:** **Menunggu persetujuan — blocker remedial/KKM.**
- **Tidak boleh diasumsikan:** Threshold KKM, siapa yang eligible, apakah remedial mengganti nilai, dan siapa yang dapat menyetujui.

### DEC-GATE-008 — Boundary fingerprint

- **Pertanyaan:** Siapa client resmi endpoint fingerprint dan bagaimana boundary keamanannya?
- **Opsi:**
  1. Perangkat/gateway sebagai client resmi; SPA tidak memanggil endpoint.
  2. Admin tool terisolasi sebagai client resmi dengan auth/network boundary khusus.
  3. SPA sebagai client resmi setelah path, auth, rate limit, payload biometrik, dan security review disetujui.
  4. Menonaktifkan/menunda exposure sampai kontrak keamanan tersedia.
- **Konsekuensi:**
  - Opsi 1 meminimalkan exposure ke browser, tetapi membutuhkan integrasi gateway yang jelas.
  - Opsi 2 membatasi akses, tetapi membutuhkan tool dan otorisasi admin.
  - Opsi 3 membawa data biometrik ke browser dan berisiko tinggi.
  - Opsi 4 menunda penggunaan namun menghindari boundary yang belum aman.
- **Rekomendasi:** Opsi 1 atau 4; jangan memasukkan fingerprint ke client session SPA. Path aktual `/api/v1/fingerprint/*` dan status tanpa auth harus diperbaiki/diratifikasi sebelum dipakai.
- **Pemilik keputusan:** Backend/IoT + security owner.
- **Status:** **Menunggu persetujuan — blocker fingerprint.**
- **Tidak boleh diasumsikan:** Endpoint tanpa auth bukan berarti aman untuk user umum; kepemilikan perangkat, API key, raw/template data, dan enrollment belum ditetapkan.

### DEC-GATE-009 — Status endpoint absensi

- **Pertanyaan:** Kapan endpoint `API-ABS-*` dianggap siap diintegrasikan?
- **Opsi:**
  1. Blocked sampai route aktif, handler teruji, dan request/response final cocok dengan OpenAPI.
  2. Frontend boleh mulai memakai mock contract sebelum route aktif, tanpa klaim E2E.
  3. Backend mengaktifkan subset endpoint dengan status dan daftar operasi yang jelas.
- **Konsekuensi:**
  - Opsi 1 mencegah false readiness dan integrasi ke 404.
  - Opsi 2 memungkinkan pekerjaan UI, tetapi tetap tidak membuktikan integrasi.
  - Opsi 3 mempercepat vertical slice, tetapi membutuhkan scope subset dan acceptance criteria eksplisit.
- **Rekomendasi:** Opsi 1 sebagai gate runtime; Opsi 2 hanya untuk mock kontraktual yang diberi label blocked; Opsi 3 dapat dipilih bila backend menerbitkan daftar subset resmi.
- **Pemilik keputusan:** Backend lead + product owner absensi.
- **Status:** **Disetujui — Opsi 1; API absensi tetap blocked sampai route dan kontrak runtime aktif.**
- **Tidak boleh diasumsikan:** Schema OpenAPI, halaman frontend, atau route device bukan bukti bahwa API absensi aktif.

### DEC-GATE-010 — Pemanggil `API-NTF-003`

- **Pertanyaan:** Role/use case mana yang boleh membuat notifikasi?
- **Opsi:**
  1. Tidak dipanggil oleh SPA pengguna; hanya backend/job/service internal.
  2. Dipanggil admin atau role operasional tertentu yang disetujui, dengan UI khusus.
  3. Dipanggil dari workflow domain tertentu setelah event bisnis dan ownership disetujui.
- **Konsekuensi:**
  - Opsi 1 mengurangi penyalahgunaan dan scope frontend.
  - Opsi 2 membutuhkan permission matrix, form, audit, dan rate/abuse controls.
  - Opsi 3 menjaga notifikasi dekat sumber event, tetapi membutuhkan kontrak event dan idempotensi.
- **Rekomendasi:** Opsi 1 untuk tahap awal; integrasikan list/mark-read saja. Buka Opsi 2/3 hanya setelah pemanggil, role, payload, audit, dan idempotensi disetujui.
- **Pemilik keputusan:** Product + backend + owner notifikasi.
- **Status:** **Menunggu persetujuan — blocker API-NTF-003.**
- **Tidak boleh diasumsikan:** Endpoint create yang aktif secara teknis bukan bukti bahwa pengguna umum atau SPA boleh memanggilnya.

## 3. Checklist gate implementasi

### Gate wajib sebelum Prompt 2

- [x] **DEC-GATE-001:** Source of truth OpenAPI dipilih, lokasi/version/commit dicatat.
- [x] **DEC-GATE-005:** Cookie auth disetujui per environment: session=`session`, CSRF=`csrf`, `HttpOnly`, `Secure`, `SameSite`, domain/path.
- [x] **DEC-GATE-004:** Strategi origin dan CORS/proxy disetujui; nilai origin/allowlist konkret masih wajib diisi sebelum uji browser.
- [x] **DEC-GATE-009:** API absensi ditetapkan tetap blocked sampai route dan kontrak runtime aktif.
- [x] **CSRF contract:** Frontend membaca cookie `csrf` dan mutation mengirim `X-CSRF-Token`; tidak ada asumsi endpoint bootstrap.
- [x] Persetujuan pengguna dicatat pada bagian riwayat persetujuan di bawah.

### Gate sebelum domain terkait dikerjakan

- [ ] **DEC-GATE-002:** Strategi generated/manual/hybrid types dan command generation/validation disetujui.
- [ ] **DEC-GATE-003:** Test runner, fixture, contract-test command, dan CI failure policy disetujui.
- [ ] **DEC-GATE-006:** Mapping latihan vs quiz disetujui.
- [ ] **DEC-GATE-007:** Scope remedial/KKM disetujui, atau UI/API ditandai blocked.
- [ ] **DEC-GATE-008:** Boundary fingerprint dan security controls disetujui.
- [ ] **DEC-GATE-010:** Pemanggil `API-NTF-003`, role, payload, dan ownership disetujui.

### Bukti minimum untuk membuka gate

- [ ] Tautan/commit spec yang disetujui.
- [ ] Matriks environment berisi origin frontend, origin API, proxy/CORS, dan cookie policy.
- [ ] Matriks auth berisi nama cookie, `credentials: include`, CSRF cookie/header, serta respons `401`/`403`.
- [ ] Konfirmasi backend bahwa route absensi aktif atau keputusan eksplisit bahwa domain tetap blocked.
- [ ] Catatan pemilik dan tanggal persetujuan setiap keputusan.

## 4. Stop condition

Prompt 2 **boleh dimulai** berdasarkan persetujuan pengguna yang dicatat di bawah. Keputusan DEC-GATE-002, DEC-GATE-003, DEC-GATE-006, DEC-GATE-007, DEC-GATE-008, dan DEC-GATE-010 tetap wajib ditutup sebelum domain masing-masing diimplementasikan. API absensi dan fingerprint tetap tidak boleh diintegrasikan sebelum gate khususnya terpenuhi.

## 5. Riwayat persetujuan

- **Tanggal:** 2026-11-12
- **Pemberi persetujuan:** Pengguna
- **Pernyataan:** `ya saya setuju, buka block prompt 2`
- **Dampak:** DEC-GATE-001, DEC-GATE-004, DEC-GATE-005, dan DEC-GATE-009 diterima berdasarkan rekomendasi dokumen; Prompt 2 dibuka.
