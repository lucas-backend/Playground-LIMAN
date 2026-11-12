# 11 — Planning Integrasi Frontend dengan API LIMEN

- **Status dokumen:** Planning usulan — belum dieksekusi
- **Versi:** 0.1
- **Tanggal:** 2026-11-12
- **Pemilik:** Frontend, dengan koordinasi Backend
- **Sumber kontrak yang dianalisis:** `openapi.yaml` pada root repository
- **Dokumen terkait:** [00-project-audit.md](./00-project-audit.md), [04-wbs.md](./04-wbs.md), [05-sdd.md](./05-sdd.md), [06-api-documentation.md](./06-api-documentation.md), [07-uat-checklist.md](./07-uat-checklist.md), [09-decision-log.md](./09-decision-log.md)

> Dokumen ini adalah rencana kerja, bukan bukti bahwa endpoint backend sudah tersedia atau bahwa kontrak API sudah disetujui. Seluruh endpoint pada spesifikasi yang dianalisis masih berstatus **Proposed**. Implementasi hanya dimulai setelah keputusan dan kontrak yang menjadi prasyarat ditutup.

## 1. Tujuan dan batasan

### 1.1 Tujuan

1. Mengganti data mock/local state pada frontend dengan data dari API secara bertahap.
2. Menyediakan satu lapisan komunikasi HTTP yang konsisten untuk cookie sesi, CSRF, pagination, error, dan status request.
3. Menjaga batas akses berbasis peran sebagai UX di frontend, dengan otorisasi tetap ditegakkan oleh backend.
4. Menyediakan urutan integrasi yang dapat diverifikasi per domain tanpa menunggu seluruh 77 operasi API selesai.
5. Menghasilkan frontend yang dapat diuji dengan backend/mocking yang mengikuti OpenAPI, bukan payload ad-hoc per halaman.

### 1.2 Di luar cakupan

- Implementasi backend Go, skema/migrasi PostgreSQL, atau firmware perangkat.
- Penetapan aturan bisnis yang belum disetujui.
- Perubahan desain visual besar; baseline UI existing tetap menjadi referensi sampai baseline desain resmi disetujui.
- Menganggap endpoint fingerprint sebagai alur pengguna web biasa. Endpoint tersebut berada di root `/fingerprint/*`, tanpa autentikasi, dan perlu keputusan pemilik integrasi perangkat.

## 2. Baseline terverifikasi

### 2.1 Kondisi frontend saat ini

| Area | Fakta terverifikasi | Dampak terhadap integrasi |
| --- | --- | --- |
| Stack | React 19, TypeScript strict, Vite 8, React Router DOM 7, Tailwind v4 | Dapat dipertahankan; integrasi harus mengikuti pola TypeScript yang ketat. |
| Routing | Route inline di `src/App.tsx`, sekitar 62 route, tanpa guard | Auth bootstrap dan guard UX perlu ditambahkan sebelum domain privat diaktifkan. |
| Auth | `Login.tsx` langsung navigasi ke dashboard; input belum terikat state; belum ada session API | `API-AUTH-001..004` menjadi fondasi pertama. |
| Data fetching | Tidak ada API client/fetch/axios yang dipakai untuk data aplikasi | Perlu satu shared client sebelum halaman dihubungkan. |
| State server | Data fitur berupa mock/local state; `UserProvider` menyimpan user mock di localStorage | Mock tidak boleh menjadi source of truth setelah endpoint domain aktif. |
| Error/loading | Belum ada pola global yang konsisten dan belum ada ErrorBoundary | Setiap halaman data perlu state loading, error, empty, dan retry yang seragam. |
| Testing | Tidak ada test runner atau test script pada `package.json` | Tooling test perlu disepakati sebelum integrasi kritis; jangan mengklaim test berjalan sebelum benar-benar dijalankan. |

Rujukan utama: [00-project-audit.md](./00-project-audit.md) §1–§3 dan [05-sdd.md](./05-sdd.md) §2.

### 2.2 Kontrak API yang dianalisis

- Base path aplikasi: `/api/v1`.
- Auth pengguna: session cookie server-side `limen_session`.
- Mutasi terautentikasi: header `X-CSRF-Token`.
- Response error yang ditargetkan: `{ code, message, details? }`.
- Pagination: `page`, `pageSize`, dan response `{ items, page, pageSize, total }`.
- Timestamp: ISO-8601 dengan offset; tanggal domain absensi menggunakan WIB/`Asia/Jakarta`.
- Role code kontrak: `siswa`, `guru_mapel`, `guru_wali`, `guru_bk`, `admin`.
- Spesifikasi memuat **58 path dan 77 operasi** dari 16 tag, termasuk lima endpoint fingerprint pada root `/fingerprint/*`.

Rujukan detail: [06-api-documentation.md](./06-api-documentation.md) §2–§4 dan `openapi.yaml`.

### 2.3 Isu sumber spesifikasi yang harus dibereskan

`openapi.yaml` pada root dan `docs/openapi.yaml` memiliki hash SHA-256 berbeda. Karena itu, belum boleh membuat client atau tipe otomatis dari salah satu salinan secara diam-diam.

**Prasyarat keputusan `INT-DEC-001`:**

1. Tim menentukan satu lokasi OpenAPI sebagai source of truth.
2. Salinan lain dihapus, disinkronkan, atau diberi status jelas sebagai arsip.
3. Versi kontrak, status persetujuan, dan proses perubahan dicatat di [06-api-documentation.md](./06-api-documentation.md) serta [09-decision-log.md](./09-decision-log.md).
4. Backend dan frontend menggunakan commit/spec version yang sama.

## 3. Prinsip implementasi

1. **Contract-first:** tipe, request, response, dan error mengikuti OpenAPI yang sudah disetujui.
2. **API layer tunggal:** halaman/komponen tidak memanggil `fetch` langsung.
3. **Server-state terpisah dari UI state:** cache, invalidation, retry, dan mutation dikelola melalui pola server-state yang disetujui; state form/modal tetap lokal.
4. **Backend adalah otoritas:** route guard dan menu role hanya untuk UX, bukan kontrol keamanan.
5. **Tidak ada fallback diam-diam:** kegagalan API harus menghasilkan state error yang terlihat dan dapat dicoba ulang.
6. **Mock sementara harus kontraktual:** mock hanya digunakan untuk unblock UI dan harus memakai tipe/payload yang sama dengan API.
7. **Migrasi bertahap:** satu domain dapat dipindahkan dari mock ke API tanpa mengubah domain lain yang belum siap.
8. **Perubahan presisi:** pada tahap dokumentasi ini tidak ada perubahan source, dependency, atau build configuration.

## 4. Target arsitektur frontend

Struktur berikut adalah target usulan, bukan daftar file yang sudah ada:

```text
src/
  app/
    App.tsx
    router.tsx
    providers/
  config/
    env.ts
  shared/
    api/
      client.ts
      errors.ts
      queryKeys.ts
      generated/        # bila code generation disetujui
    auth/
      session.ts
      permissions.ts
    components/
      AsyncState/
      Pagination/
    layouts/
      ProtectedLayout.tsx
  features/
    auth/
      api/
      hooks/
      model/
    attendance/
      api/
      hooks/
      model/
    academic/
    schedules/
    quiz/
    question-banks/
    assignments/
    assessments/
    reports/
    counseling/
    aptitude/
    notifications/
    admin/
```

Migrasi struktur tidak harus dilakukan sekaligus. Bila refactor folder belum disetujui, batas tanggung jawab tetap wajib diterapkan secara logis pada lokasi existing.

## 5. Rencana fase dan dependensi

Status seluruh item: **Belum**. ID di bawah khusus untuk planning integrasi ini; WBS existing tetap menjadi referensi tingkat proyek.

| ID | Pekerjaan | Pemilik | Prioritas | Dependensi | Deliverable/DoD ringkas |
| --- | --- | --- | --- | --- | --- |
| INT-01 | Menetapkan source of truth dan ratifikasi kontrak | Bersama | Must | — | `INT-DEC-001` selesai; status endpoint, base URL, security, error, dan schema disepakati. |
| INT-02 | Menyiapkan environment dan HTTP client | Frontend | Must | INT-01 | Base URL dari env; `credentials: include`; header standar; timeout/abort; parsing error eksplisit. |
| INT-03 | Menyiapkan tipe API dan model mapping | Frontend | Must | INT-01 | Tipe response/request sesuai spec; mapping API model → view model terdokumentasi; tidak ada `any` untuk payload domain. |
| INT-04 | Menyiapkan session bootstrap dan auth flow | Frontend + Backend | Must | INT-02, backend auth | Login, `/auth/me`, logout, 401 expired, CSRF, dan guard UX berjalan. |
| INT-05 | Menyiapkan pola async state dan query/mutation | Frontend | Must | INT-02 | Loading/error/empty/success/retry serta invalidation konsisten. |
| INT-06 | Integrasi dashboard dan data akademik dasar | Frontend + Backend | Must | INT-03..05, API-MST | Menu berdasarkan `roles`; classes, subjects, students, assignments sesuai scope. |
| INT-07 | Integrasi absensi inti | Frontend + Backend | Must | INT-04..06, API-ABS/SET | Rekap, detail, status manual, dan konfigurasi jam menggunakan API; tidak ada mock pada alur utama. |
| INT-08 | Integrasi jadwal | Frontend + Backend | Should | INT-06 | Jadwal memakai `API-JWL-001`; admin CRUD memakai operasi mutasi yang sesuai. |
| INT-09 | Integrasi quiz, latihan, bank soal, dan koreksi | Frontend + Backend | Should | INT-04, data akademik | Attempt, autosave, submit, hasil, bank soal, dan grading mengikuti API-QZ/BNK/KOR. |
| INT-10 | Integrasi tugas, penilaian, dan remedial | Frontend + Backend | Should | INT-06, keputusan aturan remedial | API-TGS/NIL/KOR dipakai; aturan yang masih TBD tidak dikarang di UI. |
| INT-11 | Integrasi laporan, rapor, konseling | Frontend + Backend | Should | INT-07, INT-10 | Report/counseling memakai data resmi dan scope role. |
| INT-12 | Integrasi minat bakat, passing grade, notifikasi | Frontend + Backend | Could | INT-04, endpoint siap | API-MB/PG/NTF; status read meng-invalidate daftar secara benar. |
| INT-13 | Melengkapi admin | Frontend + Backend | Must | INT-04, INT-06..08 | User, class, subject, assignment, device, setting, dan report tidak lagi berupa `console.log`/mock. |
| INT-14 | Contract, integration, dan regression testing | Bersama | Must | INT-04..13 sesuai domain | Test request/response/error/role dan alur kritis terdokumentasi; hasil aktual dicatat. |
| INT-15 | Cutover mock → API dan release readiness | Bersama | Must | INT-14 | Mock domain dimatikan/diisolasi, UAT diperbarui, rollback dan observability disiapkan. |

Urutan minimum yang memblokir domain lain adalah:

`INT-01 → INT-02/03 → INT-04 → INT-05 → INT-06 → INT-07`.

Domain Should/Could dapat dikerjakan paralel setelah fondasi dan data master siap, tetapi tetap memerlukan backend endpoint yang telah disetujui.

## 6. Pemetaan frontend ke endpoint

Pemetaan ini adalah rencana integrasi, bukan klaim bahwa setiap halaman saat ini memiliki kontrak satu banding satu.

| Domain/route existing | Endpoint utama | Rencana perubahan |
| --- | --- | --- |
| `features/login`, `App`, `UserProvider` | `API-AUTH-001..004` | Ganti navigasi langsung dan user mock dengan login, session bootstrap, logout, reset password admin, serta redirect 401. |
| `dashboard` | `API-AUTH-003` + endpoint domain sesuai role | Dashboard mengambil identitas/role dari session; kartu/menu tidak lagi bergantung pada `localStorage` sebagai source of truth. |
| `guruMapel/absensi`, `guruWali/absensi`, admin presensi | `API-ABS-002..008`, `API-SET-001..002` | Gunakan filter tanggal/kelas/subjek; mutasi mengirim CSRF; status kosong/merah diturunkan dari payload API, bukan data statis. |
| admin device | `API-DEV-001..003` | Tambahkan query/mutation untuk daftar, registrasi, dan status device bila UI admin final sudah disetujui. |
| `jadwal` | `API-JWL-001..004` | Map `schedule.kind` ke tab pelajaran/ujian/tryout; query filter harus mengikuti parameter kontrak. |
| `quiz`, `quiz-result`, `riwayat-quiz` | `API-QZ-001..007` | `quizId`/`attemptId` memakai UUID API; detail siswa tidak menerima answer key; autosave memakai mutation per jawaban. |
| `latihan-soal` | `API-QZ-*` sesuai keputusan domain | Konfirmasi apakah latihan direpresentasikan sebagai quiz atau membutuhkan pemetaan khusus sebelum implementasi. |
| `guru/LatihanSoal`, `guru/Ujian`, `guru/Koreksi` | `API-BNK-001..006`, `API-KOR-001`, `API-QZ-008` | Bedakan `scope: latihan` dan `scope: ujian`; konsolidasi komponen tidak boleh menghapus perbedaan scope. |
| `guru/Tugas` | `API-TGS-001..004` | Daftar tugas, pembuatan, submissions, dan grading memakai owner/scope dari API. |
| `guru/Penilaian`, `guru/Remedial` | `API-NIL-001..004` + keputusan remedial | Jangan menanamkan KKM/remedial baru sebelum aturan yang dirujuk kontrak disetujui. |
| `guruBK/Rekap`, `guruWali/rapotSiswa`, admin report | `API-RPT-001..003` | Gunakan pagination/filter resmi; tampilkan hanya data yang dikembalikan sesuai scope role. |
| `guruBK/Konseling`, `guruWali/konselingWali` | `API-KSL-001..004` | Catatan dan follow-up memakai mutation API; state optimistic hanya jika aturan rollback disepakati. |
| `hasil-minat-bakat` | `API-MB-001..002` | Detail hasil dan target jurusan menggunakan `studentId`; validasi otorisasi tetap backend. |
| `passing-grade` | `API-PG-001..002` | Daftar dan detail menjadi query read-only sampai ada kontrak mutasi yang disetujui. |
| `notifikasi` | `API-NTF-001..002` | Daftar unread memakai query; tandai baca menginvalidasi count/list. `API-NTF-003` bukan kebutuhan UI pengguna umum tanpa keputusan pemanggilnya. |
| fingerprint/device gateway | `API-FP-001..005`, root `/` | Tidak digabung ke client session biasa. Pemilik alur harus menentukan apakah ini dipanggil perangkat/gateway, admin tool, atau tidak oleh SPA. |

### 6.1 Pemetaan master data dan route param

Kontrak memakai UUID dan nama parameter seperti `classId`, `studentId`, `quizId`, `attemptId`, sedangkan route existing banyak memakai nama seperti `kelas_id`, `siswa_id`, dan `quiz_id`. Pada setiap domain:

1. Ambil route param existing.
2. Validasi keberadaan dan format sebelum query.
3. Map ke nama parameter API pada service/query layer.
4. Jangan mengubah identifier menjadi angka atau memakai label tampilan sebagai ID.
5. Catat perubahan route yang diperlukan secara terpisah agar bug navigasi existing tidak tertutup oleh adapter.

## 7. Detail fondasi yang wajib disepakati

### 7.1 HTTP client

Client bersama harus memiliki perilaku berikut:

- Base URL configurable melalui `VITE_*`; tidak menyimpan secret di bundle.
- `credentials: "include"` untuk session cookie.
- `Accept: application/json`; `Content-Type` hanya untuk body yang sesuai.
- Menambahkan `X-CSRF-Token` pada mutation terautentikasi setelah mekanisme token final tersedia.
- Memproses `204` tanpa mencoba parse JSON.
- Membaca envelope error untuk 400/401/403/404/409/422/429/500.
- Membedakan `SESSION_EXPIRED`/`UNAUTHENTICATED` dari error validasi dan error jaringan.
- Menggunakan `AbortSignal`/timeout dan tidak melakukan retry otomatis pada mutation tanpa idempotency yang disepakati.
- Menyertakan `X-Request-Id` bila mekanisme client-side correlation disepakati.

### 7.2 Session dan role

- Bootstrap aplikasi memanggil `GET /auth/me`; status awal harus `loading`, bukan dianggap guest.
- `401` mengakhiri state session dan mengarahkan ke `/login` dengan cara yang mencegah loop.
- `403` menampilkan akses ditolak; tidak diperlakukan sebagai sesi expired.
- Role UI diturunkan dari kode kontrak (`guru_mapel`, bukan `guruMapel`) melalui mapping terpusat.
- Frontend boleh menyembunyikan menu/route berdasarkan role, tetapi semua endpoint tetap mengandalkan backend RBAC.
- Logout tidak hanya menghapus localStorage; client memanggil `POST /auth/logout` dan membersihkan cache server-state.

### 7.3 Query, mutation, dan cache

- Query key harus memasukkan seluruh filter yang memengaruhi hasil.
- Setelah mutation berhasil, invalidate query terkait; jangan memperbarui salinan data di banyak komponen secara manual.
- Pagination menyimpan `page`, `pageSize`, dan `total` dari server.
- Empty state dibedakan dari error dan loading.
- Mutation ganda harus dicegah pada tombol/form; retry mutation hanya untuk operasi yang aman menurut kontrak.

## 8. Strategi testing dan verifikasi

Tidak ada test yang diklaim telah dijalankan pada dokumen ini. Setelah implementasi, verifikasi minimum berikut wajib dilakukan pada domain yang dikerjakan:

| Lapisan | Fokus | Bukti yang diharapkan |
| --- | --- | --- |
| Static/type | TypeScript strict dan lint | `npm run build` dan `npm run lint` pada commit integrasi. |
| API client | URL, cookie, CSRF, 204, envelope error, abort | Test unit client dengan response mock. |
| Auth | login valid/gagal, `/auth/me`, logout, 401 expired, 403 | Test komponen/provider dan request contract. |
| Query/mutation | filter, pagination, invalidation, double-submit | Test hook/feature dengan mock kontraktual. |
| Role | tiap role dan scope data | Matrix request langsung ke backend/mock contract; UI guard bukan satu-satunya bukti. |
| Domain absensi | status, tanggal WIB, correction approval, duplicate state | Test integrasi mengikuti TC-ABS dan TC-RLP pada [07-uat-checklist.md](./07-uat-checklist.md). |
| Contract | schema request/response/error | Validasi mock/frontend terhadap OpenAPI versi yang sama. |
| Browser/E2E | login → modul prioritas → logout | Minimal alur auth dan absensi inti pada environment terpadu. |

Kriteria tidak boleh dinyatakan `Pass` hanya karena halaman terbuka. Status harus mengikuti bukti aktual di [07-uat-checklist.md](./07-uat-checklist.md).

## 9. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Dua salinan OpenAPI berbeda | Client dan backend dapat memakai kontrak berbeda | Tutup `INT-DEC-001` sebelum generate tipe atau service. |
| Kontrak masih Proposed | Rework request/response dan role | Ratifikasi keputusan `DEC-*`/`ADR-*`; gunakan adapter kecil selama transisi. |
| Backend belum tersedia | Integrasi end-to-end tidak dapat dibuktikan | Gunakan mock kontraktual hanya sementara; tandai UAT sebagai `Blocked`. |
| Cookie/CSRF lintas origin | Login tampak sukses tetapi request mutation gagal | Sepakati origin, CORS, SameSite, Secure, dan cara bootstrap CSRF sebelum INT-04. |
| Route param dan ID API berbeda | Detail/query salah atau 404 | Map param di layer API; uji UUID dan route regression. |
| Scope role tidak eksplisit di UI | Kebocoran UX atau akses salah | Definisikan permission matrix dari kontrak; backend tetap validator. |
| Payload UI tidak identik dengan schema | Error 422 dan data hilang | Tipe request terpusat, validasi UX, dan contract test. |
| Optimistic update terlalu dini | UI menampilkan data yang belum disetujui | Mulai dengan invalidate/refetch; aktifkan optimistic hanya per mutation yang aman. |
| Endpoint fingerprint tanpa auth | Risiko keamanan bila dipanggil dari SPA | Perlakukan sebagai gateway/device integration; jangan expose di menu pengguna sebelum keputusan. |

## 10. Keputusan terbuka sebelum implementasi

| ID | Pertanyaan | Pemilik keputusan | Pemblokir |
| --- | --- | --- | --- |
| INT-DEC-001 | Salinan OpenAPI mana yang menjadi source of truth? Jawaban: C:\Users\lucas\Project\liman-frontend\openapi.yaml | Bersama | Semua pekerjaan |
| INT-DEC-002 | Apakah tipe frontend di-generate dari OpenAPI atau dipelihara manual dengan contract test? Jawaban: Saya ikut rekomendasi kamu | Frontend + Backend | INT-03 |
| INT-DEC-003 | Library server-state dan test runner frontend apa yang disetujui? Jawaban: Saya ikut rekomendasi kamu | Frontend | INT-05, INT-14 |
| INT-DEC-004 | Bagaimana CSRF token diperoleh frontend, dan apakah endpoint bootstrap token diperlukan? Cek backend | C:\Users\lucas\Project\liman-frontend\openapi.yamld | INT-02, INT-04 |
| INT-DEC-005 | Origin dev/staging/production, CORS, cookie domain, SameSite, dan Secure final? | Backend/DevOps | INT-02, INT-04 |
| INT-DEC-006 | Apakah `API-FP-*` pernah dipanggil oleh SPA, admin tool, atau hanya perangkat/gateway? | Backend/IoT | Mapping fingerprint |
| INT-DEC-007 | Apakah `latihan-soal` memakai resource quiz yang sama atau alur berbeda? | Product + Backend | INT-09 |
| INT-DEC-008 | Scope dan aturan remedial/KKM yang belum final akan dipetakan bagaimana? | Product + Backend | INT-10 |
| INT-DEC-009 | Bentuk response untuk export/report dan operasi yang belum ada di OpenAPI? | Product + Backend | INT-11 bila export diperlukan |
| INT-DEC-010 | Apakah operasi create notification (`API-NTF-003`) memang dipanggil frontend? | Product + Backend | INT-12 |

Tidak satu pun keputusan di tabel ini boleh diasumsikan selesai hanya karena ada contoh di desain UI atau data mock.

## 11. Definition of Done integrasi frontend

Integrasi suatu domain dapat dinyatakan selesai bila seluruh kondisi berikut terpenuhi:

1. Endpoint yang dipakai tercantum pada OpenAPI yang disetujui dan memiliki `operationId`.
2. Request, response, enum, pagination, dan error memakai tipe/mapper terpusat.
3. Halaman tidak lagi mengambil data domain dari mock/localStorage sebagai source of truth.
4. Loading, empty, error, retry, forbidden, dan session expired memiliki tampilan yang benar.
5. Mutation mengirim cookie/CSRF sesuai kontrak dan mencegah submit ganda.
6. Query/mutation memakai cache key dan invalidation yang terdokumentasi.
7. Role/scope diuji terhadap backend/mock contract; route guard tidak dianggap sebagai otorisasi.
8. Test fokus domain dan contract test lulus pada commit yang sama; command dan hasil aktual dicatat.
9. `npm run build` dan `npm run lint` lulus setelah perubahan source.
10. UAT terkait dipindahkan dari `Blocked`/`Not Run` hanya setelah prasyarat dan bukti tersedia.

## 12. Langkah berikutnya yang direkomendasikan

1. Selesaikan `INT-DEC-001` dan sinkronkan OpenAPI.
2. Tinjau kembali keputusan `DEC-*`/`ADR-*` yang dirujuk auth, role, CSRF, remedial, notifikasi, dan fingerprint.
3. Buat backend/auth environment atau mock server yang benar-benar mengikuti spec final.
4. Kerjakan `INT-02` sampai `INT-05` sebagai fondasi, tanpa memindahkan seluruh fitur sekaligus.
5. Integrasikan auth dan absensi inti (`INT-04`, `INT-06`, `INT-07`) sebagai vertical slice pertama.
6. Jalankan verifikasi build/lint/test yang disepakati dan perbarui status pada WBS/UAT berdasarkan bukti, bukan asumsi.
7. Lanjutkan domain Should lalu Could hanya setelah vertical slice pertama stabil.

