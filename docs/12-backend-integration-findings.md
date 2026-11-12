# 12 — Findings Backend untuk Planning Integrasi Frontend

- **Status:** Hasil pemeriksaan read-only — keputusan produk/arsitektur tetap perlu disetujui
- **Versi:** 0.1
- **Tanggal:** 2026-11-12
- **Repository backend:** `C:\Users\lucas\Project\limen-backend`
- **Dokumen terkait:** [11-frontend-api-integration-plan.md](./11-frontend-api-integration-plan.md), [06-api-documentation.md](./06-api-documentation.md), [07-uat-checklist.md](./07-uat-checklist.md)

> Temuan ini berasal dari pembacaan repository backend, bukan dari asumsi desain. Status `Terjawab` berarti fakta implementasi sudah ditemukan; status `Masih terbuka` berarti backend belum cukup untuk menetapkan keputusan bisnis atau deployment.

## 1. Ringkasan eksekutif

1. `openapi.yaml` pada frontend root dan backend memiliki SHA-256 yang sama: `7B0DC2D39E5E363696566E4CD3BB5D6471D77F37A0AA5A6459979E480D66B15D`. Untuk dua repository tersebut, source spec saat ini identik.
2. Backend aktif menggunakan Go, Gin, GORM/PostgreSQL, dan Redis. Route aktif didefinisikan di `internal/adapter/http/router/routes.go`.
3. Auth aktif memakai cookie bernama `session` dan `csrf`, bukan nama yang direncanakan sebelumnya `limen_session`/`limen_csrf`.
4. CSRF token sudah tersedia setelah login melalui cookie `csrf`; frontend perlu membaca cookie tersebut dan mengirim nilainya sebagai `X-CSRF-Token`.
5. Backend tidak memiliki konfigurasi CORS pada area yang diperiksa, sehingga origin frontend dan deployment cross-origin belum terjawab.
6. Endpoint absensi `API-ABS-*` ada di OpenAPI, tetapi tidak terdaftar pada router aktif. Jangan mengintegrasikan halaman absensi ke endpoint tersebut sebagai endpoint siap pakai.
7. Endpoint fingerprint aktual berada di `/api/v1/fingerprint/*` dan tidak dilindungi auth middleware, berbeda dari keterangan OpenAPI yang menyatakan root `/fingerprint/*`.
8. Banyak domain non-absensi sudah terdaftar pada router aktif, termasuk auth, master data, jadwal, quiz, bank soal, tugas, penilaian, laporan, konseling, aptitude, passing grade, dan notifikasi.

## 2. Jawaban atas `INT-DEC`

| ID | Jawaban terverifikasi | Status keputusan | Tindak lanjut frontend |
| --- | --- | --- | --- |
| INT-DEC-001 | OpenAPI frontend root dan backend identik berdasarkan hash. `docs/openapi.yaml` pada frontend tidak tersedia saat pemeriksaan; jangan menganggapnya sebagai salinan aktif. | **Terjawab untuk root/frontend ↔ backend** | Gunakan spec root/backend yang sama dalam commit. Tandai salinan dokumentasi yang hilang/berbeda bila dikembalikan. |
| INT-DEC-002 | Tidak ditemukan generator tipe OpenAPI atau konfigurasi code generation pada backend/frontend yang diperiksa. Backend menggunakan tipe Go manual di handler/domain. | **Masih terbuka** | Pilih manual types + contract test, atau tetapkan generator resmi. Jangan menambah dependency sebelum keputusan. |
| INT-DEC-003 | Backend memakai Gin/GORM/Redis. Frontend `package.json` belum memiliki test runner; backend memiliki seeder quiz dan dokumentasi alur, tetapi belum menjadi strategi test frontend. | **Masih terbuka** | Tetapkan test runner frontend dan contract-test workflow. Untuk tahap awal, fokus auth, client, dan domain yang aktif. |
| INT-DEC-004 | Tidak ada endpoint bootstrap CSRF. Login langsung mengirim cookie `csrf`; middleware memvalidasi cookie `csrf` dan header `X-CSRF-Token` terhadap turunan cookie `session`. | **Terjawab secara implementasi; perlu ratifikasi kontrak** | Setelah login, baca cookie `csrf`; kirim header pada semua mutation. Selaraskan nama cookie di OpenAPI dan dokumen frontend. |
| INT-DEC-005 | Backend tidak menunjukkan middleware CORS atau konfigurasi origin. Cookie dibuat `Secure=true`, `SameSite=Strict`, path `/`; cookie session HttpOnly, cookie CSRF dapat dibaca JavaScript. | **Masih terbuka dan memblokir cross-origin** | Tentukan apakah Vite proxy/same-origin dipakai atau CORS + origin allowlist ditambahkan. Uji login/mutation pada browser nyata. |
| INT-DEC-006 | Fingerprint di router aktif pada `/api/v1/fingerprint/{identify,enroll,enroll/raw,latest,stream}` tanpa `Authenticate()`/`RequireCSRF()`. Gateway upstream memakai `FINGERPRINT_SERVICE_URL` dan API key dari env. | **Terjawab sebagian; kontrak perlu diperbaiki** | Jangan memanggil dari alur user biasa sebelum pemilik alur ditentukan. Update OpenAPI agar path dan security mencerminkan backend aktual atau ubah backend melalui keputusan bersama. |
| INT-DEC-007 | Backend memiliki resource quiz tunggal `/quizzes` dan question bank memiliki `scope` enum `latihan|ujian`; belum ditemukan endpoint terpisah untuk `latihan-soal`. | **Masih terbuka untuk UX** | Perlakukan latihan sebagai scope/resource quiz hanya setelah mapping field/status dikonfirmasi. Jangan membuat endpoint baru dari nama route frontend. |
| INT-DEC-008 | Tidak ditemukan route remedial atau field/aturan remedial yang cukup untuk menetapkan perilaku. Endpoint assessment tersedia, tetapi tidak membuktikan aturan remedial/KKM. | **Masih terbuka** | Tetap blokir integrasi remedial. Integrasikan assessment hanya untuk operasi yang benar-benar ada di kontrak dan backend. |
| INT-DEC-009 | Tidak ditemukan route export CSV/Excel/PDF pada router aktif maupun daftar API operasional README. | **Terjawab negatif** | Jangan membuat tombol export yang memanggil endpoint spekulatif. Perlakukan export sebagai requirement/kontrak baru bila dibutuhkan. |
| INT-DEC-010 | `POST /api/v1/notifications` aktif di `authWrite`, sehingga memerlukan session dan CSRF serta dapat membuat notifikasi. | **Terjawab implementasi; pemanggil masih terbuka** | Frontend pengguna cukup memakai list/read. Jangan expose create notification kecuali role/use case pemanggil disepakati. |

## 3. Endpoint yang benar-benar terdaftar pada router

Sumber utama adalah [routes.go](C:/Users/lucas/Project/limen-backend/internal/adapter/http/router/routes.go), bukan hanya OpenAPI.

### 3.1 Aktif dan relevan untuk integrasi bertahap

| Domain | Route aktif | Middleware umum |
| --- | --- | --- |
| Auth | `/api/v1/auth/login`, `/auth/logout`, `/auth/me`, password reset | Login rate limit; route lain session; mutasi CSRF. |
| Admin/settings/device/user | `/settings/school`, `/devices`, `/users` | `admin` + session; mutasi CSRF. |
| Academic | `/classes`, `/subjects`, `/students`, `/teaching-assignments` | `admin` pada router aktif; mutasi CSRF. |
| Schedule | `/schedules` | `admin` pada router aktif; mutasi CSRF. |
| Assessment | `/assessments`, `/assessments/:id/scores` | Session; mutasi CSRF. |
| Aptitude/passing grade | `/students/:id/aptitude-results`, `/target-majors`, `/passing-grades` | Session; target major mutasi CSRF. |
| Counseling | `/counseling-notes`, followups | Session; mutasi CSRF. |
| Reports | `/reports/attendance`, `/reports/grades`, report-card | Session. |
| Assignment | `/assignments`, submissions, grading | Session; mutasi CSRF. |
| Question bank | `/question-banks`, questions | Session; mutasi CSRF. |
| Quiz | `/quizzes`, attempts, answers, submit, grade | Session; mutasi CSRF. |
| Notifications | `/notifications`, mark read | Session; mutasi CSRF. |

### 3.2 Belum aktif pada router

- Semua route `API-ABS-001..008` untuk ingestion, records, dan corrections tidak ditemukan pada router aktif.
- Karena itu `INT-07` (integrasi absensi inti) masih bergantung pada pekerjaan backend, walaupun schema dan kontrak absensi ada di OpenAPI.
- Endpoint `API-DEV-*` adalah manajemen device, bukan bukti bahwa ingestion absensi sudah tersedia.

## 4. Temuan auth, cookie, dan CSRF

### 4.1 Nama dan atribut cookie aktual

Di `internal/adapter/http/handler/auth_handler.go:54-57`:

- Cookie session: `session`, `Secure=true`, `HttpOnly=true`, masa hidup 12 jam.
- Cookie CSRF: `csrf`, `Secure=true`, `HttpOnly=false`, masa hidup 12 jam.
- `SameSite` diset ke `Strict` pada response login/logout.

Di `internal/adapter/http/middleware/session.go:28-47`, middleware membaca cookie `session`. Di `session.go:87-107`, middleware membaca cookie `csrf`, membaca header `X-CSRF-Token`, lalu membandingkan keduanya dengan token turunan dari session.

**Implikasi frontend:**

1. Browser harus menerima cookie Secure; environment HTTP lokal perlu diuji karena cookie Secure dapat menghambat pengujian bila tidak melalui HTTPS atau mekanisme proxy yang sesuai.
2. Request client harus memakai `credentials: "include"`.
3. Nilai cookie `csrf` perlu dibaca oleh JavaScript untuk mutation.
4. Dokumen OpenAPI/frontend perlu mengganti nama cookie usulan bila implementasi backend ini dipertahankan.
5. Response CSRF gagal memakai `403 CSRF_INVALID`, bukan `401`; client tidak boleh menganggap semua `403` sebagai session expired.

### 4.2 Session expiration

Middleware backend menerapkan idle timeout 30 menit dan absolute timeout 12 jam berdasarkan session timestamps di `session.go:42-70`. Response yang dipakai untuk sesi hilang/expired adalah `401 UNAUTHENTICATED`; belum ditemukan penggunaan kode `SESSION_EXPIRED` pada middleware.

**Tindak lanjut:** frontend boleh menangani `UNAUTHENTICATED` sebagai logout/redirect. Penggunaan kode khusus `SESSION_EXPIRED` masih perlu diselaraskan atau dianggap belum tersedia.

## 5. Perbedaan kontrak yang wajib dicatat

| Topik | OpenAPI/planning sebelumnya | Backend aktual | Dampak |
| --- | --- | --- | --- |
| Session cookie | `limen_session` | `session` | Client dan dokumentasi harus diselaraskan. |
| CSRF cookie | `limen_csrf` | `csrf` | Client harus membaca nama aktual atau backend diubah. |
| SameSite | Usulan `Lax` | `Strict` | Cross-site/cross-origin deployment perlu diuji dan diputuskan. |
| Fingerprint path | Root `/fingerprint/*` | `/api/v1/fingerprint/*` | Spec dan client akan salah URL bila tidak diperbaiki. |
| Fingerprint auth | Tanpa auth di spec | Tanpa auth middleware pada router | Risiko exposure; pemilik alur harus menetapkan boundary. |
| Attendance | Ada di OpenAPI | Tidak ada pada router aktif | Absensi belum siap diintegrasikan end-to-end. |
| Error details | Spec `details` opsional | Backend selalu mengirim object `details.fields` | Mapper boleh mendukung keduanya, tetapi tipe final harus disepakati. |
| Expired session code | Spec mencantumkan `SESSION_EXPIRED` | Middleware mengirim `UNAUTHENTICATED` | Redirect dapat berbasis status 401, kode perlu diratifikasi. |
| Export | Disebut sebagai requirement lain, tanpa route pada spec/backend | Tidak tersedia | Jangan implementasi endpoint export di frontend. |

## 6. Revisi prioritas planning

Berdasarkan backend aktual, urutan vertical slice yang paling realistis:

1. **Auth/session client:** `API-AUTH-001..003`, termasuk cookie aktual dan CSRF.
2. **Admin/master data:** users, classes, subjects, students, teaching assignments.
3. **Jadwal:** read dan admin CRUD.
4. **Quiz/question bank:** backend route sudah tersedia dan memiliki seeder quiz untuk data uji.
5. **Tugas, assessment, reports, counseling, aptitude, passing grade, notification.**
6. **Absensi:** menunggu router dan handler `API-ABS-*` aktif; jangan menandai `INT-07` selesai dari keberadaan OpenAPI saja.
7. **Fingerprint:** dipisahkan dari SPA sampai path, auth boundary, dan pemilik alurnya disepakati.

## 7. Bukti dan batas pemeriksaan

- Pemeriksaan dilakukan read-only pada `README.md`, `openapi.yaml`, `internal/adapter/http/router/routes.go`, auth handler/middleware, config, Docker Compose, dan daftar file backend.
- File `.env` tidak dibaca; hanya `.env.example` yang digunakan untuk mengetahui nama konfigurasi tanpa mengungkap nilai rahasia.
- Hash spec dibandingkan, tetapi tidak ada klaim bahwa service backend sedang berjalan atau endpoint telah diuji melalui HTTP.
- Tidak ada source code backend yang diubah.

