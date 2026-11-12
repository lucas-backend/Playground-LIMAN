# Audit Readiness Backend untuk Prompt 10–13

- **Status audit:** Blocked
- **Tanggal audit:** 2026-11-12
- **Repository diperiksa:** `C:\Users\lucas\Project\limen-backend`
- **Commit teramati:** `ddeabd9 fix some missing params`
- **Metode:** pemeriksaan read-only terhadap source, migration, router, OpenAPI, README, dan percobaan command lokal

## 1. Kesimpulan

Backend **belum memenuhi prasyarat Prompt 10–13**.

Alasan blocker utama:

1. Route `API-ABS-001..008` belum terdaftar pada router aktif.
2. `attendance_handler.go` hanya berisi deklarasi `package handler`; belum ada HTTP handler absensi.
3. Belum ditemukan use case absensi yang mengorkestrasi ingestion, records, manual status, dan correction.
4. Repository/migration absensi sudah tersedia, tetapi belum menjadi alur aplikasi yang dapat dipanggil melalui API.
5. Tidak ada file `*_test.go` pada repository backend.
6. `go test ./...` tidak dapat dijalankan pada environment pemeriksaan karena executable `go` tidak tersedia.
7. Endpoint fingerprint terdaftar tanpa session, CSRF, atau role middleware.
8. Kontrak OpenAPI backend masih mendeskripsikan fingerprint sebagai root `/fingerprint/*` tanpa autentikasi, sedangkan implementasi aktual berada di `/api/v1/fingerprint/*`.
9. Belum ditemukan konfigurasi CORS/origin allowlist.

Keberadaan tabel dan repository absensi **tidak cukup** untuk menyatakan API absensi sudah siap.

## 2. Status Prompt 10 — Absensi

**Status: Blocked — belum dapat dimulai.**

### Fakta yang sudah tersedia

- Domain attendance memiliki enum status, source, event, subject type, dan correction.
- Migration membuat tabel `attendance_events`, `attendance_records`, `attendance_corrections`, `devices`, dan `biometric_identities`.
- Migration memiliki unique index untuk event idempotency:
  `(device_id, identifier, occurred_at, event_type)`.
- Migration memiliki unique index record harian:
  `(subject_user_id, attendance_date)`.
- Repository PostgreSQL attendance sudah memiliki operasi dasar create/find/update/list.

Bukti: [attendance domain](../../limen-backend/internal/domain/attendance/attendance.go), [initial migration](../../limen-backend/migrations/000001_init.up.sql), [attendance repositories](../../limen-backend/internal/adapter/persistence/postgres/attendance).

### Kekurangan yang memblokir

- `API-ABS-001..008` hanya ada di OpenAPI; tidak ada route attendance pada `routes.go`.
- `attendance_handler.go` belum diimplementasikan.
- Belum ada use case attendance untuk:
  - validasi credential device;
  - mapping biometric identifier;
  - perhitungan tanggal/status WIB;
  - check-in/check-out multi-device;
  - records list/detail dengan filter dan pagination;
  - manual status dan `409 CONFLICT`;
  - correction submit/list/approve/reject;
  - role scope;
  - transaksi atomik dan audit log.
- Unique index saja belum membuktikan duplicate dikembalikan sebagai `200` dengan `duplicate: true`.
- Belum ada bukti runtime, integration test, atau UAT untuk status, terlambat WIB, check-out, multi-device, manual, correction, duplicate, dan role scope.

Bukti route aktif hanya menginisialisasi handler fingerprint dan report attendance; tidak ada pendaftaran `/attendance/*` di [routes.go](../../limen-backend/internal/adapter/http/router/routes.go).

### Perubahan backend yang masih wajib

1. Implementasikan attendance use case dan handler.
2. Daftarkan delapan operation ID pada router aktif.
3. Tambahkan middleware device credential untuk ingestion.
4. Tambahkan session, CSRF, dan authorization scope untuk operasi user.
5. Tambahkan query repository untuk filter `date`, rentang tanggal, kelas, subjek, status, source, sort, dan pagination.
6. Gunakan timezone sekolah yang disetujui, yaitu `Asia/Jakarta`, untuk `attendanceDate` dan keterlambatan.
7. Bungkus ingestion, record upsert, correction approval, dan audit log dengan transaksi yang sesuai.
8. Tambahkan contract/integration tests dan jalankan pada environment dengan PostgreSQL/Redis.

## 3. Status Prompt 11 — Fingerprint dan Gateway

**Status: Blocked — implementasi parsial, security boundary belum memenuhi gate.**

### Fakta yang sudah tersedia

- Implementasi aktual terdaftar pada:
  - `POST /api/v1/fingerprint/identify`
  - `POST /api/v1/fingerprint/enroll`
  - `POST /api/v1/fingerprint/enroll/raw`
  - `GET /api/v1/fingerprint/latest`
  - `GET /api/v1/fingerprint/stream`
- Raw capture dibatasi tepat `18432` byte.
- Request binary dibatasi dengan `http.MaxBytesReader`.
- Gateway memakai `FINGERPRINT_SERVICE_URL` dan `FINGERPRINT_API_KEY` dari environment.
- SSE memiliki keepalive, context cancellation, dan unsubscribe cleanup.
- Hasil identifikasi disimpan ke in-memory store dan audit repository.

Bukti: [fingerprint routes](../../limen-backend/internal/adapter/http/router/routes.go), [fingerprint handler](../../limen-backend/internal/adapter/http/handler/fingerprint_handler.go), [fingerprint use case](../../limen-backend/internal/usecase/fingerprint/fingerprint.go), [gateway client](../../limen-backend/internal/adapter/fingerprint/client.go).

### Kekurangan yang memblokir

- Semua route fingerprint dipasang pada `v1` tanpa `Authenticate()`, `RequireCSRF()`, atau role restriction.
- Enrollment dan raw enrollment dapat dipanggil melalui router yang sama tanpa boundary admin/device/gateway yang terlihat.
- OpenAPI menyatakan fingerprint berada di root `/fingerprint/*` dan tanpa autentikasi, tidak sama dengan route aktual `/api/v1/fingerprint/*`.
- `writeGatewayResponse` memasukkan `err.Error()` ke response 500; perlu dipastikan error upstream tidak mengandung credential, URL sensitif, atau data biometrik.
- Belum ada bukti bahwa template fingerprint tidak masuk log, response yang tidak perlu, localStorage, atau bundle client.
- Belum ada test untuk abort, reconnect, concurrent SSE subscriber, upstream timeout, dan gateway error.

### Perubahan backend yang masih wajib

1. Tetapkan client resmi: perangkat, gateway, admin tool, atau SPA.
2. Selaraskan path dan security scheme antara router dan OpenAPI.
3. Lindungi enrollment/raw capture dengan authentication dan authorization yang disetujui, atau pisahkan endpoint gateway internal.
4. Sanitasi seluruh error upstream sebelum dikirim ke client.
5. Tambahkan network allowlist/rate limit bila endpoint memang device/gateway-facing.
6. Tambahkan test security boundary dan SSE lifecycle menggunakan data biometrik sintetis.

## 4. Status Prompt 12 — Contract, Integration, E2E, UAT

**Status: Blocked — bukti eksekusi belum tersedia.**

- Backend memiliki `openapi.yaml`, tetapi kesesuaian runtime belum terbukti.
- Tidak ada file `*_test.go` yang ditemukan pada repository.
- `go test ./...` dicoba pada 2026-11-12 dan gagal sebelum kompilasi karena `go` tidak tersedia di PATH environment pemeriksaan.
- Tidak ada bukti contract test, integration test, E2E auth, atau UAT backend yang berhasil.
- Tidak dapat menyatakan Pass untuk login/session expired, CSRF invalid, role scope, pagination/filter, duplicate, correction, atau network failure.

Sebelum Prompt 12 dapat dinyatakan selesai, siapkan toolchain Go, PostgreSQL, Redis, environment test, data uji, test runner, dan bukti command/output yang dapat direproduksi.

## 5. Status Prompt 13 — Cutover dan Release Readiness

**Status: Blocked — Prompt 12 belum lulus dan domain absensi/fingerprint belum siap.**

### Fakta yang sudah tersedia

- Secret fingerprint dikonfigurasi melalui environment, bukan source frontend.
- Request logger mencatat method, path, status, durasi, client IP, dan request ID field.
- Terdapat health endpoint yang memeriksa PostgreSQL dan Redis.
- README menyediakan command backup/restore.

### Kekurangan yang masih perlu diverifikasi atau diperbaiki

- Belum ada bukti production smoke test.
- Belum ada bukti contract/integration test hijau.
- Belum ada bukti rollback cutover pada commit sebelum cutover.
- Belum ada bukti monitoring/alerting production dan sanitasi log menyeluruh.
- Middleware request logger membaca `request_id`, tetapi pada pemeriksaan ini tidak ditemukan middleware yang membuat atau menetapkan request ID secara global.
- README masih menyatakan sebagian domain belum tersedia dan belum mencantumkan fingerprint/attendance sebagai endpoint aktif.
- Belum ada daftar resmi endpoint aktif versus blocked yang diverifikasi melalui runtime.

## 6. Matriks keputusan

| Gate | Status | Bukti utama | Keputusan |
| --- | --- | --- | --- |
| API-ABS-001..008 terdaftar | **Fail** | Tidak ada `/attendance/*` di router; handler kosong | Jangan integrasikan absensi |
| Kontrak absensi final | **Blocked** | OpenAPI ada, runtime belum ada | Belum dapat dianggap final |
| Status/WIB/role scope | **Blocked** | Enum dan schema ada, service/authorization absensi belum ada | Perlu implementasi dan persetujuan |
| Fingerprint path | **Fail** | Implementasi `/api/v1`, OpenAPI root `/fingerprint` | Selaraskan kontrak |
| Fingerprint security | **Fail** | Route tanpa auth/CSRF/role | Tetapkan boundary dan middleware |
| Contract/integration test | **Not Run** | Tidak ada test; Go tidak tersedia | Siapkan environment dan test runner |
| E2E/UAT | **Blocked** | Tidak ada bukti runtime | Jangan klaim Pass |
| Cutover/release | **Blocked** | Gate sebelumnya belum lulus | Jangan lanjut release |

## 7. Blocker yang harus ditutup sebelum Prompt 10

1. Implementasi handler dan use case attendance.
2. Pendaftaran route `API-ABS-001..008`.
3. Device authentication untuk ingestion.
4. Session/CSRF/role scope untuk mutation dan correction.
5. Query filter/pagination records dan corrections.
6. Transaksi, idempotency response, conflict state, dan audit log.
7. Contract/integration test dengan environment PostgreSQL dan Redis.
8. Bukti UAT untuk seluruh skenario absensi yang diwajibkan.

## 8. Batas audit

Audit ini tidak menjalankan service backend, tidak membaca nilai `.env`, tidak mengirim request ke gateway fingerprint, dan tidak menggunakan data biometrik. Karena itu status di atas adalah hasil pemeriksaan source/configuration dan percobaan command lokal, bukan klaim bahwa endpoint production telah diuji.
