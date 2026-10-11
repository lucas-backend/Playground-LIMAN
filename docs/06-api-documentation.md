# 06 — API Documentation / API Contract LIMEN

- **Status dokumen:** Draft kontrak awal (**belum disetujui**) — Fase E
- **Versi:** 0.1
- **Tanggal:** 2026-10-11
- **Dokumen terkait:** [02-prd.md](./02-prd.md) · [03-srs.md](./03-srs.md) · [05-sdd.md](./05-sdd.md) · [09-decision-log.md](./09-decision-log.md) · [openapi.yaml](./openapi.yaml)

> **Peringatan status.** Dokumen ini adalah **usulan kontrak** antara tim frontend dan backend. **Belum ada satu pun endpoint yang berjalan** (backend Go belum ada). Semua endpoint berstatus **Proposed** hingga disetujui kedua tim. Tidak ada klaim persetujuan, tidak ada implementasi, dan tidak ada perubahan frontend pada tahap ini.

## 1. Cara Membaca Dokumen

- Baseline gaya: **REST berbasis HTTP + JSON** (IR-API-001, ADR-002). Alternatif GraphQL ditolak pada SDD §11.
- Setiap endpoint memiliki **ID unik** `API-<MODUL>-NNN`, dipetakan ke **requirement** di `03-srs.md`.
- **Status endpoint:** `Proposed` (usulan), `Approved` (disetujui kedua tim), `Implemented` (berjalan). Saat ini **semua `Proposed`**.
- Contoh request/response bersifat **ilustratif**; nilai bukan data pribadi/kredensial nyata.
- Endpoint diturunkan dari **use case dan aturan bisnis**, bukan dari jumlah halaman (lihat §5 dan §13).

## 2. Standar Global

### 2.1 Base path dan versioning

- Base path: **`/api/v1`** (IR-API-001, SDD §6). Perubahan breaking menaikkan versi mayor (`/api/v2`).
- Media type request/response: **`application/json; charset=utf-8`**.
- Nama resource: jamak, `kebab-case` (mis. `/teaching-assignments`, `/question-banks`).
- Sub-resource memakai path bersarang untuk kepemilikan kuat (mis. `/assignments/{id}/submissions`).

### 2.2 Autentikasi pengguna (session cookie)

Mengikuti DEC-05 / ADR-003:

| Aspek | Ketentuan |
| --- | --- |
| Mekanisme | Session cookie server-side (`limen_session`), **HttpOnly + Secure + SameSite=Lax**. |
| Login | `POST /auth/login` membuat sesi; server merotasi/`set-cookie`. |
| CSRF | Cookie `limen_csrf` (dapat dibaca JS) + header **`X-CSRF-Token`** **wajib** pada semua request mutasi (POST/PUT/PATCH/DELETE) setelah login. |
| Idle timeout | 30 menit (usulan DEC-05). |
| Absolute timeout | 12 jam (usulan DEC-05). |
| Logout | `POST /auth/logout` mencabut sesi. |
| Reset password Admin | Mencabut **semua** sesi aktif pengguna tersebut (SDD §16.2). |
| Token akses | **Tidak dipakai** (JWT bukan kewajiban, ADR-003/003b). |

### 2.3 Autentikasi perangkat ingestion

Endpoint ingestion perangkat memakai **kredensial perangkat**, bukan sesi pengguna (SDD §8, DEC-04). Bentuk konkret **`TBD`** (SDD-OI-02); usulan header:

```
X-Device-Id: <device-uuid>
X-Device-Key: <secret>
```

Perangkat tidak dapat mengakses endpoint pengguna; pengguna tidak dapat mengakses endpoint ingestion.

### 2.4 Header standar

| Header | Wajib | Keterangan |
| --- | --- | --- |
| `Content-Type: application/json` | Ya (bila ada body) | Request dengan body. |
| `Accept: application/json` | Ya | Respons selalu JSON. |
| `X-CSRF-Token` | Ya (mutasi terotentikasi) | Sesuai §2.2. |
| `X-Request-Id` | Tidak | Kolerasi log; dibuat server bila kosong. |

### 2.5 Format error (envelope seragam)

Selaras SDD §6/§9.1:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Data permintaan tidak valid.",
  "details": {
    "fields": [
      { "field": "email", "message": "Format email tidak valid." }
    ]
  }
}
```

| HTTP | `code` | Kapan muncul | Dikembalikan oleh |
| --- | --- | --- | --- |
| 400 | `BAD_REQUEST` | Format JSON/malformed request | Semua (global) |
| 401 | `UNAUTHENTICATED` | Tidak ada/tidak valid sesi | Global |
| 401 | `INVALID_CREDENTIALS` | Login gagal | `POST /auth/login` |
| 401 | `SESSION_EXPIRED` | Idle/absolut timeout | Global |
| 401 | `INVALID_DEVICE_CREDENTIALS` | Kredensial perangkat salah | `POST /attendance/ingest` |
| 403 | `FORBIDDEN` | Terautentikasi tanpa hak | Global |
| 404 | `NOT_FOUND` | Resource tidak ada/tidak terlihat peran | Global |
| 409 | `CONFLICT` | Konflik state (mis. review ganda, record device sudah ada) | Sesuai endpoint |
| 422 | `VALIDATION_ERROR` | Field tidak valid (dengan `details.fields`) | Global mutasi |
| 429 | `RATE_LIMITED` | Rate limit terlampaui | `POST /auth/login` |
| 500 | `INTERNAL_ERROR` | Kesalahan tak terduga | Global |

> Error `403` **tidak membocorkan** keberadaan detail resource (SDD §9.1). `401` → frontend mengalihkan ke login (FR-AUTH-005).

### 2.6 Pagination, filter, dan sorting

- Query: `?page=<int>&pageSize=<int>` (default `page=1`, `pageSize=20`, maks `100` pada usulan ini).
- Respons daftar: `{ "items": [...], "page": 1, "pageSize": 20, "total": 128 }`.
- Filter dan sorting dideklarasikan per endpoint; sorting `?sort=field:asc|desc`.
- Daftar yang pasti kecil (mis. jenjang kelas) boleh tanpa pagination, tetapi tetap berbentuk `items` bila memungkinkan.

### 2.7 Format waktu, tanggal, dan identifier

- **Timestamp:** ISO-8601 dengan offset, mis. `2026-10-11T07:05:00+07:00` (SDD §6). Disimpan `timestamptz`.
- **Tanggal:** `YYYY-MM-DD`, dihitung dalam **WIB (Asia/Jakarta)** (BR-12). Contoh `attendanceDate`.
- **Jam konfigurasi:** `HH:mm` WIB (mis. `07:15`) untuk pengaturan sekolah.
- **Identifier:** UUID v4 sebagai string; `identifier` sidik jari adalah string (bukan UUID).
- Tidak ada timestamp numerik/epoch pada payload publik.

### 2.8 Idempotensi

- **Ingestion perangkat** idempoten pada kunci `(deviceId, identifier, timestamp, eventType)` (SDD §5.3/§16.2). Kirim ulang → **200** dengan `duplicate: true` (bukan error; SDD §9.1).
- Mutasi lain tidak menjamin idempotensi otomatis; klien menghindari kirim ganda. Dukungan `Idempotency-Key` **tidak** diwajibkan pada kontrak awal (`TBD` bila diperlukan).

### 2.9 Validasi

- Validasi otoritatif di **backend** (NFR-SEC-002). Validasi frontend hanya UX.
- Field tak dikenal diabaikan/ditolak untuk mencegah *mass-assignment* (SDD §8).
- Aturan rentang umum: string wajib `not blank`, panjang maksimum dideklarasikan per field; enum harus salah satu nilai yang tercantum.

### 2.10 Otorisasi dan batas data per peran (BR-14 / DEC-07)

| Peran | Kode | Cakupan data |
| --- | --- | --- |
| Siswa | `siswa` | Data miliknya sendiri |
| Guru Mata Pelajaran | `guru_mapel` | Kelas/mapel yang diampu (`teaching_assignments`) |
| Guru Wali | `guru_wali` | Kelas perwalian |
| Guru BK | `guru_bk` | Semua siswa |
| Admin Sekolah | `admin` | Semua data dalam sekolah; kelola user & konfigurasi; tinjau absensi guru |

### 2.11 Konvensi enumerated values

| Domain | Nilai |
| --- | --- |
| `role` | `siswa`, `guru_mapel`, `guru_wali`, `guru_bk`, `admin` |
| `user.status` | `active`, `inactive` |
| `attendance.status` | `hadir`, `terlambat`, `izin`, `sakit`, `alpa` |
| `attendance.source` | `device`, `manual`, `correction` |
| `attendanceEvent.eventType` | `check_in`, `check_out` |
| `subjectType` | `student`, `teacher` |
| `correction.status` | `pending`, `approved`, `rejected` |
| `schedule.kind` | `pelajaran`, `ujian`, `tryout` |
| `question.type` | `pilihan_ganda`, `pilihan_ganda_kompleks`, `benar_salah`, `rentang_nilai`, `essay` (paralel FR-BANK-002 & `src/features/quiz/types.ts`) |

## 3. Model Resource Ringkas (Objek Bersama)

Objek berikut dirujuk berulang pada kartu endpoint. Bentuk lengkap ada di `openapi.yaml`.

```json
// UserSummary
{ "id": "8f2c...", "fullName": "Budi Santoso", "email": "budi@example.sch.id", "roles": ["guru_mapel"], "status": "active" }

// AttendanceRecord
{
  "id": "b4a1...",
  "subjectType": "student",
  "subjectUserId": "8f2c...",
  "subjectName": "Budi Santoso",
  "classId": "c01...",
  "attendanceDate": "2026-10-11",
  "checkInAt": "2026-10-11T06:58:00+07:00",
  "checkOutAt": "2026-10-11T14:05:00+07:00",
  "status": "hadir",
  "source": "device",
  "checkInDeviceId": "d01...",
  "checkOutDeviceId": "d02...",
  "lateMinutes": null
}
```

## 4. Matriks Endpoint

Status seluruh endpoint: **Proposed**. `Peran` = peran yang diizinkan (selain syarat autentikasi).

| ID | Method & Path | Tujuan | Requirement | Peran |
| --- | --- | --- | --- | --- |
| API-AUTH-001 | `POST /auth/login` | Login email + password | FR-AUTH-001, FR-AUTH-006 | publik |
| API-AUTH-002 | `POST /auth/logout` | Akhiri sesi | FR-AUTH-002 | semua terautentikasi |
| API-AUTH-003 | `GET /auth/me` | Identitas & peran sesi aktif | FR-AUTH-004, FR-DASH-001 | semua terautentikasi |
| API-AUTH-004 | `POST /users/{userId}/password-reset` | Admin reset password | FR-AUTH-003, BR-02 | admin |
| API-ABS-001 | `POST /attendance/ingest` | Terima event absensi dari perangkat | FR-ABS-001/006/007/008/012, IR-SW-001 | perangkat |
| API-ABS-002 | `GET /attendance/records` | Daftar/rekap harian absensi | FR-ABS-003/009/013 | siswa, guru, admin (per cakupan) |
| API-ABS-003 | `GET /attendance/records/{recordId}` | Detail satu rekaman harian | FR-ABS-003 | sesuai cakupan |
| API-ABS-004 | `PUT /attendance/records/{subjectUserId}/{date}` | Guru menetapkan status belum tercatat | FR-ABS-002, BR-04 | guru_mapel/wali/bk, admin |
| API-ABS-005 | `POST /attendance/corrections` | Ajukan koreksi absensi | FR-ABS-004, BR-07 | guru_mapel/wali/bk |
| API-ABS-006 | `GET /attendance/corrections` | Daftar koreksi (menunggu/riwayat) | FR-ABS-004 | admin, pengaju |
| API-ABS-007 | `POST /attendance/corrections/{correctionId}/approve` | Setujui koreksi | FR-ABS-004, BR-07 | admin |
| API-ABS-008 | `POST /attendance/corrections/{correctionId}/reject` | Tolak koreksi | FR-ABS-004, BR-07 | admin |
| API-SET-001 | `GET /settings/school` | Baca jam masuk pertama & TZ | FR-ABS-010, DEC-02 | semua terautentikasi |
| API-SET-002 | `PUT /settings/school` | Ubah jam masuk pertama | FR-ABS-010 | admin |
| API-DEV-001 | `GET /devices` | Daftar alat absensi | FR-ABS-006/008, BR-11 | admin |
| API-DEV-002 | `POST /devices` | Registrasi alat absensi | DEC-04, BR-11 | admin |
| API-DEV-003 | `PUT /devices/{deviceId}` | Ubah data/status alat | DEC-04 | admin |
| API-USR-001 | `GET /users` | Daftar pengguna | FR-ADMIN-001 | admin |
| API-USR-002 | `POST /users` | Buat pengguna | FR-ADMIN-001 | admin |
| API-USR-003 | `GET /users/{userId}` | Detail pengguna | FR-ADMIN-001 | admin |
| API-USR-004 | `PUT /users/{userId}` | Ubah peran/status pengguna | FR-ADMIN-001 | admin |
| API-MST-001 | `GET /classes` | Daftar kelas | FR-ADMIN-002, FR-ABS-003 | semua terautentikasi (cakupan) |
| API-MST-002 | `POST /classes` | Buat kelas | FR-ADMIN-002 | admin |
| API-MST-003 | `PUT /classes/{classId}` | Ubah kelas/wali kelas | FR-ADMIN-002 | admin |
| API-MST-004 | `GET /subjects` | Daftar mata pelajaran | FR-ADMIN-002 | semua terautentikasi |
| API-MST-005 | `POST /subjects` | Buat mata pelajaran | FR-ADMIN-002 | admin |
| API-MST-006 | `GET /students` | Daftar siswa (filter kelas) | FR-ADMIN-002, FEAT-WALI-01 | guru, admin |
| API-MST-007 | `GET /students/{studentId}` | Detail siswa | FR-ADMIN-002 | sesuai cakupan |
| API-MST-008 | `GET /teaching-assignments` | Daftar penugasan mengajar | FR-ADMIN-002, BR-14 | guru, admin |
| API-MST-009 | `POST /teaching-assignments` | Buat penugasan mengajar | FR-ADMIN-002 | admin |
| API-JWL-001 | `GET /schedules` | Daftar jadwal pelajaran/ujian/tryout | FR-JADWAL-001 | semua terautentikasi (cakupan) |
| API-JWL-002 | `POST /schedules` | Buat jadwal | FR-ADMIN-002, FR-JADWAL-001 | admin |
| API-JWL-003 | `PUT /schedules/{scheduleId}` | Ubah jadwal | FR-ADMIN-002 | admin |
| API-JWL-004 | `DELETE /schedules/{scheduleId}` | Hapus jadwal | FR-ADMIN-002 | admin |
| API-QZ-001 | `GET /quizzes` | Daftar quiz tersedia | FR-QUIZ-001 | siswa, guru |
| API-QZ-002 | `GET /quizzes/{quizId}` | Detail quiz + soal (tanpa kunci) | FR-QUIZ-001 | siswa pemilik attempt, guru |
| API-QZ-003 | `POST /quizzes/{quizId}/attempts` | Mulai pengerjaan quiz | FR-QUIZ-001 | siswa |
| API-QZ-004 | `PATCH /quiz-attempts/{attemptId}/answers/{questionId}` | Simpan jawaban per butir | FR-QUIZ-001 | siswa pemilik attempt |
| API-QZ-005 | `POST /quiz-attempts/{attemptId}/submit` | Kirim & nilai quiz | FR-QUIZ-001/002 | siswa pemilik attempt |
| API-QZ-006 | `GET /quiz-attempts` | Riwayat pengerjaan quiz | FR-QUIZ-002 | siswa (sendiri) |
| API-QZ-007 | `GET /quiz-attempts/{attemptId}` | Hasil & rincian jawaban | FR-QUIZ-002 | siswa pemilik, guru |
| API-BNK-001 | `GET /question-banks` | Daftar bank soal per mapel/scope | FR-BANK-001 | guru |
| API-BNK-002 | `GET /question-banks/{bankId}/questions` | Daftar soal dalam bank | FR-BANK-001/002 | guru |
| API-BNK-003 | `POST /question-banks/{bankId}/questions` | Tambah soal | FR-BANK-001/002 | guru pemilik |
| API-BNK-004 | `PUT /questions/{questionId}` | Ubah soal | FR-BANK-001 | guru pemilik |
| API-BNK-005 | `DELETE /questions/{questionId}` | Hapus soal | FR-BANK-001 | guru pemilik |
| API-TGS-001 | `GET /assignments` | Daftar tugas | FR-TUGAS-001 | guru, siswa (cakupan) |
| API-TGS-002 | `POST /assignments` | Buat tugas | FR-TUGAS-001 | guru |
| API-TGS-003 | `GET /assignments/{assignmentId}/submissions` | Daftar pekerjaan siswa | FR-TUGAS-001 | guru pemilik |
| API-TGS-004 | `PUT /assignments/{assignmentId}/submissions/{studentUserId}` | Nilai pekerjaan siswa | FR-TUGAS-001 | guru pemilik |
| API-NIL-001 | `GET /assessments` | Daftar penilaian | FR-NIL-001 | guru, admin (cakupan) |
| API-NIL-002 | `POST /assessments` | Buat penilaian | FR-NIL-001 | guru |
| API-NIL-003 | `GET /assessments/{assessmentId}/scores` | Rekap nilai penilaian | FR-NIL-001 | guru pemilik |
| API-NIL-004 | `PUT /assessments/{assessmentId}/scores/{studentUserId}` | Input/ubah nilai siswa | FR-NIL-001 | guru pemilik |
| API-KOR-001 | `PUT /quiz-attempts/{attemptId}/answers/{answerId}/grade` | Koreksi jawaban siswa | FR-KORESI-001 | guru |
| API-RPT-001 | `GET /reports/attendance` | Rekap absensi per kelas/siswa/periode | FR-REKAP-001 | wali, BK, admin |
| API-RPT-002 | `GET /reports/grades` | Rekap nilai per kelas/mapel | FR-REKAP-002, FR-ADMIN-003 | wali, BK, admin |
| API-RPT-003 | `GET /students/{studentId}/report-card` | Rapor siswa + detail mapel | FR-RAPOT-001/002 | wali, admin |
| API-KSL-001 | `GET /counseling-notes` | Daftar catatan konseling | FR-KONSELING-001 | wali, BK |
| API-KSL-002 | `POST /counseling-notes` | Catat konseling | FR-KONSELING-001 | wali, BK |
| API-KSL-003 | `PUT /counseling-notes/{noteId}` | Ubah catatan konseling | FR-KONSELING-001 | penulis, BK |
| API-KSL-004 | `POST /counseling-notes/{noteId}/followups` | Tambah tindak lanjut | FR-KONSELING-002 | wali, BK |
| API-MB-001 | `GET /students/{studentId}/aptitude-results` | Hasil minat bakat siswa | FR-MB-001 | siswa (sendiri), wali, BK |
| API-MB-002 | `POST /students/{studentId}/target-majors` | Tambah target jurusan | FR-MB-002 | siswa (sendiri) |
| API-PG-001 | `GET /passing-grades` | Daftar passing grade | FR-PG-001 | semua terautentikasi |
| API-PG-002 | `GET /passing-grades/{passingGradeId}` | Detail passing grade PT | FR-PG-001 | semua terautentikasi |
| API-NTF-001 | `GET /notifications` | Daftar notifikasi in-app | FR-NOTIF-001, DEC-12 | semua terautentikasi |
| API-NTF-002 | `POST /notifications/{notificationId}/read` | Tandai notifikasi dibaca | FR-NOTIF-001 | pemilik notifikasi |

## 5. Requirement Tanpa Endpoint Khusus

Beberapa requirement **tidak** memerlukan endpoint sendiri dan dipenuhi dengan cara lain (menghindari endpoint spekulatif):

| Requirement | Pemenuhan tanpa endpoint khusus |
| --- | --- |
| FR-AUTH-004 (otorisasi per peran) | Middleware backend + tipe peran di setiap respons (`/auth/me`, `roles`). Bukan endpoint. |
| FR-AUTH-005 (sesi kedaluwarsa) | Perilaku global `401 SESSION_EXPIRED` (§2.2). Bukan endpoint. |
| FR-DASH-001 (dashboard per peran) | Komposisi klien dari `GET /auth/me` + data modul; menu per peran diturunkan dari `roles`. |
| FR-ABS-005 (daftar status) | Enum pada `attendance.status` (§2.11). |
| FR-ABS-008 (banyak alat) | Ditangani ingestion/`UNIQUE(subject_user_id, attendance_date)`; tanpa endpoint tambahan. |
| FR-ABS-009/013 (tanda merah) | Turunan status pada `GET /attendance/records` (siswa/guru tanpa `checkInAt`). |
| FR-ABS-011 (WIB) | Konvensi waktu (§2.7), bukan endpoint. |
| IR-API-002/003/004 | Envelope error, otentikasi, dan proses persetujuan kontrak (§2). |

## 6. Modul Autentikasi (AUTH)

### API-AUTH-001 — `POST /api/v1/auth/login`

- **Requirement:** FR-AUTH-001, FR-AUTH-006, BR-01
- **Tujuan:** Memverifikasi email+password dan membuat sesi server-side.
- **Auth:** publik. **Otorisasi:** tidak ada (rate limit berlaku).
- **Path/query:** tidak ada. **Header:** `Content-Type: application/json`.
- **Body:** `{ "email": string, "password": string }`
- **Validasi:** `email` wajib, format email; `password` wajib. Kredensial salah → `INVALID_CREDENTIALS` tanpa mengungkap field mana yang salah.
- **Contoh request:**

```http
POST /api/v1/auth/login
Content-Type: application/json
```

```json
{ "email": "budi@example.sch.id", "password": "rahasia-contoh" }
```

- **Contoh response `200`:**

```json
{
  "user": {
    "id": "8f2c1e6a-0000-4a00-9000-000000000001",
    "fullName": "Budi Santoso",
    "email": "budi@example.sch.id",
    "roles": ["guru_mapel"],
    "status": "active"
  }
}
```

- **Status & error:** `200` sukses; `401 INVALID_CREDENTIALS`; `422 VALIDATION_ERROR`; `429 RATE_LIMITED`; `500 INTERNAL_ERROR`.
- **Aturan & side effect:** membuat baris `sessions`; `Set-Cookie: limen_session` (HttpOnly/Secure/SameSite=Lax) + `limen_csrf`; memperbarui `users.last_login_at`. Sesi dirotasi bila sudah ada.
- **Status:** Proposed

### API-AUTH-002 — `POST /api/v1/auth/logout`

- **Requirement:** FR-AUTH-002
- **Tujuan:** Mengakhiri sesi pengguna.
- **Auth:** sesi valid. **Otorisasi:** pemilik sesi.
- **Path/query/body:** tidak ada (CSRF header tetap wajib).
- **Validasi:** tidak ada.
- **Contoh request:**

```http
POST /api/v1/auth/logout
X-CSRF-Token: <token>
```

- **Contoh response `204`:** tanpa body (`Set-Cookie` penghapusan sesi).
- **Status & error:** `204`; `401 UNAUTHENTICATED`; `403 FORBIDDEN` (CSRF salah); `500`.
- **Aturan & side effect:** menandai `sessions.revoked_at`; frontend mengalihkan ke login.
- **Status:** Proposed

### API-AUTH-003 — `GET /api/v1/auth/me`

- **Requirement:** FR-AUTH-004, FR-DASH-001
- **Tujuan:** Identitas, peran, dan status sesi aktif untuk bootstrap UI & menu per peran.
- **Auth:** sesi valid. **Otorisasi:** pemilik sesi.
- **Path/query/body:** tidak ada.
- **Validasi:** tidak ada.
- **Contoh request:** `GET /api/v1/auth/me`
- **Contoh response `200`:** `{ "id": "8f2c...", "fullName": "Budi Santoso", "email": "budi@example.sch.id", "roles": ["guru_mapel","guru_wali"], "status": "active" }`
- **Status & error:** `200`; `401 UNAUTHENTICATED`/`SESSION_EXPIRED`; `500`.
- **Aturan & side effect:** `roles` menentukan menu/tampilan; otorisasi sesungguhnya tetap di backend per endpoint.
- **Status:** Proposed

### API-AUTH-004 — `POST /api/v1/users/{userId}/password-reset`

- **Requirement:** FR-AUTH-003, BR-02, DEC-05
- **Tujuan:** Admin mengatur ulang password pengguna.
- **Auth:** sesi admin. **Otorisasi:** `admin` saja.
- **Path:** `userId` (uuid pengguna). **Body:** `{ "newPassword": string }` — **`TBD`**: apakah password dibuat Admin, dibuat sistem (temporary), atau dipaksa ganti saat login pertama.
- **Validasi:** `userId` ada; `newPassword` memenuhi kebijakan kompleksitas (`TBD`, DEC-05).
- **Contoh request:**

```http
POST /api/v1/users/8f2c1e6a-0000-4a00-9000-000000000001/password-reset
X-CSRF-Token: <token>
```

```json
{ "newPassword": "PasswordSementara123" }
```

- **Contoh response `204`:** tanpa body.
- **Status & error:** `204`; `401`; `403 FORBIDDEN` (bukan admin); `404 NOT_FOUND`; `422 VALIDATION_ERROR`; `500`.
- **Aturan & side effect:** memperbarui `users.password_hash` (Argon2id); mencabut **semua** sesi pengguna; menulis `audit_logs`.
- **Status:** Proposed

## 7. Modul Absensi (ABS)

### API-ABS-001 — `POST /api/v1/attendance/ingest`

- **Requirement:** FR-ABS-001, FR-ABS-006, FR-ABS-007, FR-ABS-008, FR-ABS-012, IR-SW-001, DEC-04
- **Tujuan:** Menerima event absensi mentah dari perangkat IoT dan memproyeksikannya ke rekaman harian.
- **Auth:** **kredensial perangkat** (§2.3). **Otorisasi:** perangkat aktif (`devices.is_active`).
- **Path/query:** tidak ada. **Body:**

```json
{
  "deviceId": "d01e2f3a-0000-4a00-9000-000000000010",
  "identifier": "FP-000123",
  "timestamp": "2026-10-11T06:58:00+07:00",
  "eventType": "check_in"
}
```

- **Validasi:** `deviceId` uuid & aktif; `identifier` tidak blank; `timestamp` ISO-8601 valid; `eventType` ∈ `check_in|check_out`.
- **Contoh request:**

```http
POST /api/v1/attendance/ingest
X-Device-Id: d01e2f3a-0000-4a00-9000-000000000010
X-Device-Key: <secret>
Content-Type: application/json
```

- **Contoh response `200`:**

```json
{
  "accepted": true,
  "duplicate": false,
  "eventId": 10241,
  "matched": true,
  "subjectType": "student",
  "subjectUserId": "8f2c1e6a-0000-4a00-9000-000000000001",
  "attendanceRecordId": "b4a1c2d3-0000-4a00-9000-000000000020",
  "attendanceDate": "2026-10-11",
  "resultingStatus": "hadir"
}
```

- **Status & error:** `200` (termasuk `duplicate:true` = no-op); `400 BAD_REQUEST`; `401 INVALID_DEVICE_CREDENTIALS`; `403 FORBIDDEN` (device nonaktif); `422 VALIDATION_ERROR`; `500`.
- **Aturan & side effect:**
  - Idempoten pada `(deviceId, identifier, timestamp, eventType)` (SDD §16.2). Duplikat tidak menggandakan.
  - `identifier` dipetakan ke pengguna via `biometric_identities` (`matched:false` bila belum dipetakan; event tetap tersimpan dengan `subject_user_id = null`).
  - Susun/upsert `attendance_records` (satu baris per subjek per hari, WIB).
  - `check_in`: status `hadir` bila ≤ `school_settings.first_entry_time`; selain itu `terlambat` (DEC-01/02, WIB).
  - `check_out`: mengisi `check_out_at` pada hari yang sama (FR-ABS-007). Event dari alat berbeda digabung (FR-ABS-008, NFR-DATA-001).
  - Subjek guru dan siswa ditangani sama (`subjectType` dari profil terkait; FR-ABS-012).
- **Status:** Proposed

### API-ABS-002 — `GET /api/v1/attendance/records`

- **Requirement:** FR-ABS-003, FR-ABS-009, FR-ABS-013
- **Tujuan:** Daftar/rekap harian absensi dengan filter; dasar tampilan daftar & "tanda merah".
- **Auth:** sesi. **Otorisasi:** cakupan per peran (BR-14); siswa hanya datanya sendiri.
- **Query params:** `date`, `dateFrom`, `dateTo`, `classId`, `subjectUserId`, `subjectType` (`student|teacher`), `status`, `source`, `page`, `pageSize`, `sort`.
- **Body:** tidak ada.
- **Validasi:** rentang tanggal valid (`dateFrom`≤`dateTo`); enum valid; `pageSize`≤100.
- **Contoh request:** `GET /api/v1/attendance/records?classId=c01...&date=2026-10-11&subjectType=student`
- **Contoh response `200`:**

```json
{
  "items": [
    {
      "id": "b4a1c2d3-0000-4a00-9000-000000000020",
      "subjectType": "student",
      "subjectUserId": "8f2c1e6a-0000-4a00-9000-000000000001",
      "subjectName": "Budi Santoso",
      "classId": "c01...",
      "attendanceDate": "2026-10-11",
      "checkInAt": "2026-10-11T06:58:00+07:00",
      "checkOutAt": null,
      "status": "hadir",
      "source": "device",
      "checkInDeviceId": "d01...",
      "checkOutDeviceId": null,
      "lateMinutes": 0
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 1
}
```

- **Status & error:** `200`; `401`; `403 FORBIDDEN`; `422 VALIDATION_ERROR`; `500`.
- **Aturan & side effect:** tanpa side effect. "Tanda merah" = rekaman tanpa `checkInAt` pada tanggal berjalan; endpoint mengembalikan `checkInAt: null` agar UI menandai merah (FR-ABS-009/013). Absensi guru memakai `subjectType=teacher`.
- **Status:** Proposed

### API-ABS-003 — `GET /api/v1/attendance/records/{recordId}`

- **Requirement:** FR-ABS-003
- **Tujuan:** Detail satu rekaman harian termasuk event mentah dan koreksi terkait.
- **Auth:** sesi. **Otorisasi:** sesuai cakupan per peran (BR-14).
- **Path:** `recordId` (uuid). **Query/body:** tidak ada.
- **Validasi:** `recordId` uuid; resource terlihat peran, jika tidak → `404`.
- **Contoh request:** `GET /api/v1/attendance/records/b4a1c2d3-...`
- **Contoh response `200`:**

```json
{
  "record": { "id": "b4a1c2d3-...", "subjectType": "student", "attendanceDate": "2026-10-11", "status": "terlambat", "source": "device", "checkInAt": "2026-10-11T07:20:00+07:00", "checkOutAt": null, "lateMinutes": 5 },
  "events": [ { "id": 10241, "deviceId": "d01...", "eventType": "check_in", "occurredAt": "2026-10-11T07:20:00+07:00" } ],
  "corrections": []
}
```

- **Status & error:** `200`; `401`; `403`; `404 NOT_FOUND`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

### API-ABS-004 — `PUT /api/v1/attendance/records/{subjectUserId}/{date}`

- **Requirement:** FR-ABS-002, BR-04, DEC-01
- **Tujuan:** Guru menetapkan status absensi untuk subjek yang belum tercatat perangkat (upsert harian).
- **Auth:** sesi. **Otorisasi:** `guru_mapel`/`guru_wali`/`guru_bk`/`admin` sesuai cakupan kelas.
- **Path:** `subjectUserId` (uuid), `date` (`YYYY-MM-DD` WIB). **Body:** `{ "status": "hadir|terlambat|izin|sakit|alpa", "note": string? }`
- **Validasi:** tanggal tidak di masa depan; `status` enum; **tolak `409 CONFLICT`** bila sudah ada rekaman `source=device` dengan `checkInAt` pada hari itu (harus melalui koreksi).
- **Contoh request:**

```http
PUT /api/v1/attendance/records/8f2c1e6a-.../2026-10-11
X-CSRF-Token: <token>
```

```json
{ "status": "izin", "note": "Surat izin terlampir" }
```

- **Contoh response `200`:**

```json
{
  "id": "b4a1c2d3-...",
  "subjectUserId": "8f2c1e6a-...",
  "attendanceDate": "2026-10-11",
  "status": "izin",
  "source": "manual",
  "createdBy": "9a7b...",
  "updatedAt": "2026-10-11T08:10:00+07:00"
}
```

- **Status & error:** `200` (baru atau ubah); `401`; `403`; `404` (subjek tidak terlihat); `409 CONFLICT`; `422`; `500`.
- **Aturan & side effect:** membuat/mengubah `attendance_records` dengan `source=manual`, `updated_by`. Menulis `audit_logs` (aktor, sebelum/sesudah). Tidak mengubah event perangkat.
- **Status:** Proposed

### API-ABS-005 — `POST /api/v1/attendance/corrections`

- **Requirement:** FR-ABS-004, BR-07, DEC-03
- **Tujuan:** Guru mengajukan koreksi status absensi (belum mengubah rekap resmi).
- **Auth:** sesi. **Otorisasi:** `guru_mapel`/`guru_wali`/`guru_bk` atas rekaman dalam cakupan.
- **Path/query:** tidak ada. **Body:** `{ "attendanceRecordId": uuid, "newStatus": "hadir|terlambat|izin|sakit|alpa", "reason": string }`
- **Validasi:** rekaman ada & terlihat; `newStatus` berbeda dari status saat ini; `reason` tidak blank.
- **Contoh request:**

```http
POST /api/v1/attendance/corrections
X-CSRF-Token: <token>
```

```json
{ "attendanceRecordId": "b4a1c2d3-...", "newStatus": "sakit", "reason": "Sakit, surat dokter menyusul" }
```

- **Contoh response `201`:**

```json
{
  "id": "f0e1d2c3-...",
  "attendanceRecordId": "b4a1c2d3-...",
  "oldStatus": "alpa",
  "newStatus": "sakit",
  "status": "pending",
  "requestedBy": "9a7b...",
  "reason": "Sakit, surat dokter menyusul",
  "createdAt": "2026-10-11T09:00:00+07:00"
}
```

- **Status & error:** `201`; `401`; `403`; `404`; `409 CONFLICT` (sudah ada koreksi `pending` untuk rekaman sama); `422`; `500`.
- **Aturan & side effect:** membuat `attendance_corrections` status `pending`. **Rekap resmi tidak berubah** sampai disetujui. Menulis `audit_logs`.
- **Status:** Proposed

### API-ABS-006 — `GET /api/v1/attendance/corrections`

- **Requirement:** FR-ABS-004
- **Tujuan:** Daftar koreksi untuk ditinjau Admin dan riwayat pengaju.
- **Auth:** sesi. **Otorisasi:** admin melihat semua; guru melihat pengajuan sendiri.
- **Query params:** `status` (`pending|approved|rejected`), `attendanceRecordId`, `requestedBy`, `page`, `pageSize`, `sort`.
- **Body:** tidak ada.
- **Validasi:** enum valid; rentang pagination valid.
- **Contoh request:** `GET /api/v1/attendance/corrections?status=pending`
- **Contoh response `200`:** `{ "items": [ { "id": "f0e1d2c3-...", "attendanceRecordId": "b4a1c2d3-...", "newStatus": "sakit", "status": "pending", "requestedBy": "9a7b...", "createdAt": "2026-10-11T09:00:00+07:00" } ], "page": 1, "pageSize": 20, "total": 1 }`
- **Status & error:** `200`; `401`; `403`; `422`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

### API-ABS-007 — `POST /api/v1/attendance/corrections/{correctionId}/approve`

- **Requirement:** FR-ABS-004, BR-07, DEC-03
- **Tujuan:** Admin menyetujui koreksi; status resmi berubah.
- **Auth:** sesi admin. **Otorisasi:** `admin` saja.
- **Path:** `correctionId` (uuid). **Body:** `{ "reviewNote": string? }`
- **Validasi:** koreksi ada & berstatus `pending` (jika tidak → `409`).
- **Contoh request:** `POST /api/v1/attendance/corrections/f0e1d2c3-.../approve` dengan header CSRF.
- **Contoh response `200`:** `{ "id": "f0e1d2c3-...", "status": "approved", "reviewedBy": "1111...", "reviewedAt": "2026-10-11T10:00:00+07:00", "appliedStatus": "sakit" }`
- **Status & error:** `200`; `401`; `403`; `404`; `409 CONFLICT`; `500`.
- **Aturan & side effect:** dalam satu transaksi: kunci rekaman (`SELECT ... FOR UPDATE`) → ubah `attendance_records.status`, `source=correction`, `updated_by` → `attendance_corrections.status=approved` → menulis `audit_logs` (sebelum/sesudah, aktor, waktu, alasan) (SDD §16.2). Rekap resmi berubah setelah ini.
- **Status:** Proposed

### API-ABS-008 — `POST /api/v1/attendance/corrections/{correctionId}/reject`

- **Requirement:** FR-ABS-004, BR-07
- **Tujuan:** Admin menolak koreksi; rekap tidak berubah.
- **Auth:** sesi admin. **Otorisasi:** `admin` saja.
- **Path:** `correctionId` (uuid). **Body:** `{ "reviewNote": string }`
- **Validasi:** koreksi ada & `pending` (jika tidak → `409`); `reviewNote` tidak blank.
- **Contoh request:** `POST /api/v1/attendance/corrections/f0e1d2c3-.../reject` + CSRF.
- **Contoh response `200`:** `{ "id": "f0e1d2c3-...", "status": "rejected", "reviewedBy": "1111...", "reviewedAt": "2026-10-11T10:05:00+07:00" }`
- **Status & error:** `200`; `401`; `403`; `404`; `409`; `422`; `500`.
- **Aturan & side effect:** `attendance_corrections.status=rejected`, catat reviewer; rekap resmi tidak berubah; menulis `audit_logs`.
- **Status:** Proposed

## 8. Modul Pengaturan Sekolah (SET)

### API-SET-001 — `GET /api/v1/settings/school`

- **Requirement:** FR-ABS-010, DEC-02, BR-12
- **Tujuan:** Membaca jam masuk pertama, zona waktu, dan toleransi keterlambatan.
- **Auth:** sesi. **Otorisasi:** semua peran terautentikasi (baca).
- **Path/query/body:** tidak ada.
- **Validasi:** tidak ada.
- **Contoh request:** `GET /api/v1/settings/school`
- **Contoh response `200`:** `{ "firstEntryTime": "07:15", "timezone": "Asia/Jakarta", "lateToleranceMinutes": 0, "updatedAt": "2026-10-01T00:00:00+07:00" }`
- **Status & error:** `200`; `401`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

### API-SET-002 — `PUT /api/v1/settings/school`

- **Requirement:** FR-ABS-010, DEC-02
- **Tujuan:** Admin mengubah jam masuk pertama (acuan keterlambatan).
- **Auth:** sesi admin. **Otorisasi:** `admin`.
- **Path/query:** tidak ada. **Body:** `{ "firstEntryTime": "HH:mm", "lateToleranceMinutes": int }`
- **Validasi:** format `HH:mm` valid; `lateToleranceMinutes` ≥ 0. `timezone` **tidak** dapat diubah dari klien (tetap `Asia/Jakarta`, BR-12).
- **Contoh request:** `PUT /api/v1/settings/school` + CSRF, body `{ "firstEntryTime": "07:15", "lateToleranceMinutes": 0 }`.
- **Contoh response `200`:** objek settings terbaru (lihat API-SET-001).
- **Status & error:** `200`; `401`; `403`; `422`; `500`.
- **Aturan & side effect:** memperbarui `school_settings` + `updated_by`; menulis `audit_logs`. Berlaku untuk absensi berikutnya; **tidak** menghitung ulang rekaman historis (lihat §24 K-04).
- **Status:** Proposed

## 9. Modul Perangkat (DEV)

### API-DEV-001 — `GET /api/v1/devices`

- **Requirement:** FR-ABS-006, FR-ABS-008, BR-11
- **Tujuan:** Daftar alat absensi terdaftar.
- **Auth:** sesi admin. **Otorisasi:** `admin`.
- **Query params:** `isActive`, `page`, `pageSize`.
- **Body:** tidak ada.
- **Validasi:** enum boolean valid.
- **Contoh request:** `GET /api/v1/devices`
- **Contoh response `200`:** `{ "items": [ { "id": "d01...", "name": "Gerbang Utama", "location": "Lobi", "serial": "SN-001", "isActive": true, "lastSeenAt": "2026-10-11T07:20:00+07:00" } ], "page": 1, "pageSize": 20, "total": 1 }`
- **Status & error:** `200`; `401`; `403`; `500`.
- **Aturan & side effect:** tanpa side effect. `credential_ref` **tidak** pernah dikembalikan.
- **Status:** Proposed

### API-DEV-002 — `POST /api/v1/devices`

- **Requirement:** DEC-04, BR-11, IR-SW-001
- **Tujuan:** Registrasi alat absensi baru.
- **Auth:** sesi admin. **Otorisasi:** `admin`.
- **Path/query:** tidak ada. **Body:** `{ "name": string, "location": string?, "serial": string? }`
- **Validasi:** `name` tidak blank; `serial` unik bila diisi.
- **Contoh request:** `POST /api/v1/devices` + CSRF, body `{ "name": "Gerbang Samping", "location": "Sayap Barat", "serial": "SN-002" }`.
- **Contoh response `201`:** `{ "id": "d02...", "name": "Gerbang Samping", "location": "Sayap Barat", "serial": "SN-002", "isActive": true }`
- **Status & error:** `201`; `401`; `403`; `409 CONFLICT` (serial duplikat); `422`; `500`.
- **Aturan & side effect:** membuat baris `devices`. **Penerbitan kredensial perangkat `TBD`** (SDD-OI-02) — kontrak awal tidak menetapkan cara/format pemberian `X-Device-Key`.
- **Status:** Proposed

### API-DEV-003 — `PUT /api/v1/devices/{deviceId}`

- **Requirement:** DEC-04
- **Tujuan:** Mengubah data atau menonaktifkan alat.
- **Auth:** sesi admin. **Otorisasi:** `admin`.
- **Path:** `deviceId` (uuid). **Body:** `{ "name"?: string, "location"?: string, "isActive"?: bool }`
- **Validasi:** `deviceId` ada; tidak ada field rahasia dalam body.
- **Contoh request:** `PUT /api/v1/devices/d02...` + CSRF, body `{ "isActive": false }`.
- **Contoh response `200`:** objek device terbaru.
- **Status & error:** `200`; `401`; `403`; `404`; `422`; `500`.
- **Aturan & side effect:** memperbarui `devices`; perangkat nonaktif ditolak pada ingestion (`403`). Menulis `audit_logs`.
- **Status:** Proposed

## 10. Modul Manajemen Pengguna (USR)

> Catatan: modul Admin pada frontend belum lengkap (AUD-014). Endpoint di bawah **Proposed** dan wajib dipastikan lingkupnya bersama backend sebelum dipakai (DEC-08).

### API-USR-001 — `GET /api/v1/users`

- **Requirement:** FR-ADMIN-001
- **Tujuan:** Daftar pengguna untuk pengelolaan peran/status.
- **Auth:** sesi admin. **Otorisasi:** `admin`.
- **Query params:** `role`, `status`, `q` (nama/email), `page`, `pageSize`, `sort`.
- **Body:** tidak ada.
- **Validasi:** `role` enum; `status` enum.
- **Contoh request:** `GET /api/v1/users?role=guru_mapel&status=active`
- **Contoh response `200`:** `{ "items": [ { "id": "8f2c...", "fullName": "Budi Santoso", "email": "budi@example.sch.id", "roles": ["guru_mapel"], "status": "active" } ], "page": 1, "pageSize": 20, "total": 1 }`
- **Status & error:** `200`; `401`; `403`; `422`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

### API-USR-002 — `POST /api/v1/users`

- **Requirement:** FR-ADMIN-001
- **Tujuan:** Membuat pengguna beserta perannya.
- **Auth:** sesi admin. **Otorisasi:** `admin`.
- **Path/query:** tidak ada. **Body:** `{ "fullName": string, "email": string, "password": string, "roles": ["siswa|guru_mapel|guru_wali|guru_bk|admin"] }`
- **Validasi:** `email` unik & format valid; `roles` minimal 1 & valid; `password` memenuhi kebijakan (`TBD`).
- **Contoh request:** `POST /api/v1/users` + CSRF, body `{ "fullName": "Siti Aminah", "email": "siti@example.sch.id", "password": "contoh", "roles": ["guru_wali"] }`.
- **Contoh response `201`:** objek pengguna + `roles`.
- **Status & error:** `201`; `401`; `403`; `409 CONFLICT` (email duplikat); `422`; `500`.
- **Aturan & side effect:** membuat `users` + baris `user_roles`; menulis `audit_logs`. Pembuatan profil siswa/guru (`students`/`teachers`) — lihat §24 K-02.
- **Status:** Proposed

### API-USR-003 — `GET /api/v1/users/{userId}`

- **Requirement:** FR-ADMIN-001
- **Tujuan:** Detail pengguna, peran, dan profil terkait.
- **Auth:** sesi admin. **Otorisasi:** `admin`.
- **Path:** `userId` (uuid).
- **Validasi:** resource ada.
- **Contoh request:** `GET /api/v1/users/8f2c...`
- **Contoh response `200`:** `{ "id": "8f2c...", "fullName": "Budi Santoso", "email": "budi@example.sch.id", "roles": ["guru_mapel"], "status": "active", "profile": { "type": "teacher", "nip": "1980..." } }`
- **Status & error:** `200`; `401`; `403`; `404`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

### API-USR-004 — `PUT /api/v1/users/{userId}`

- **Requirement:** FR-ADMIN-001
- **Tujuan:** Mengubah nama, status, dan/atau peran pengguna.
- **Auth:** sesi admin. **Otorisasi:** `admin`.
- **Path:** `userId` (uuid). **Body:** `{ "fullName"?: string, "status"?: "active|inactive", "roles"?: [roleCode] }`
- **Validasi:** `roles` minimal 1 bila dikirim; `status` enum; cegah Admin menonaktifkan akunnya sendiri (usulan, lihat §24 K-03).
- **Contoh request:** `PUT /api/v1/users/8f2c...` + CSRF, body `{ "roles": ["guru_mapel","guru_wali"] }`.
- **Contoh response `200`:** objek pengguna terbaru.
- **Status & error:** `200`; `401`; `403`; `404`; `409 CONFLICT` (jika aturan terakhir dilanggar); `422`; `500`.
- **Aturan & side effect:** memperbarui `users`/`user_roles`; nonaktif mencabut sesi (usulan); menulis `audit_logs`.
- **Status:** Proposed

## 11. Modul Data Akademik (MST)

### API-MST-001 — `GET /api/v1/classes`

- **Requirement:** FR-ADMIN-002, FR-ABS-003, FEAT-WALI-01
- **Tujuan:** Daftar kelas untuk filter dan pemilihan.
- **Auth:** sesi. **Otorisasi:** semua peran (cakupan data per peran bila difilter).
- **Query params:** `level`, `q`, `page`, `pageSize`.
- **Body:** tidak ada.
- **Validasi:** pagination valid.
- **Contoh request:** `GET /api/v1/classes?level=10`
- **Contoh response `200`:** `{ "items": [ { "id": "c01...", "name": "10.1", "level": "10", "homeroomTeacherUserId": "9a7b...", "studentCount": 30 } ], "page": 1, "pageSize": 20, "total": 1 }`
- **Status & error:** `200`; `401`; `403`; `422`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

### API-MST-002 — `POST /api/v1/classes`

- **Requirement:** FR-ADMIN-002
- **Tujuan:** Membuat kelas.
- **Auth:** sesi admin. **Otorisasi:** `admin`.
- **Path/query:** tidak ada. **Body:** `{ "name": string, "level": string?, "homeroomTeacherUserId": uuid? }`
- **Validasi:** `name` tidak blank; `homeroomTeacherUserId` (bila ada) adalah pengguna berperan guru.
- **Contoh request:** `POST /api/v1/classes` + CSRF, body `{ "name": "10.2", "level": "10" }`.
- **Contoh response `201`:** objek kelas.
- **Status & error:** `201`; `401`; `403`; `409 CONFLICT`; `422`; `500`.
- **Aturan & side effect:** membuat `classes`; menulis `audit_logs`.
- **Status:** Proposed

### API-MST-003 — `PUT /api/v1/classes/{classId}`

- **Requirement:** FR-ADMIN-002
- **Tujuan:** Mengubah kelas atau menetapkan wali kelas.
- **Auth:** sesi admin. **Otorisasi:** `admin`.
- **Path:** `classId` (uuid). **Body:** `{ "name"?: string, "level"?: string, "homeroomTeacherUserId"?: uuid|null }`
- **Validasi:** kelas ada; wali kelas berperan guru.
- **Contoh request:** `PUT /api/v1/classes/c01...` + CSRF, body `{ "homeroomTeacherUserId": "9a7b..." }`.
- **Contoh response `200`:** objek kelas terbaru.
- **Status & error:** `200`; `401`; `403`; `404`; `422`; `500`.
- **Aturan & side effect:** memperbarui `classes` (mendukung Guru Wali, FEAT-WALI-01); menulis `audit_logs`.
- **Status:** Proposed

### API-MST-004 — `GET /api/v1/subjects`

- **Requirement:** FR-ADMIN-002
- **Tujuan:** Daftar mata pelajaran.
- **Auth:** sesi. **Otorisasi:** semua peran.
- **Query params:** `q`, `page`, `pageSize`.
- **Body:** tidak ada.
- **Validasi:** pagination valid.
- **Contoh request:** `GET /api/v1/subjects`
- **Contoh response `200`:** `{ "items": [ { "id": "s01...", "code": "MAT", "name": "Matematika" } ], "page": 1, "pageSize": 20, "total": 1 }`
- **Status & error:** `200`; `401`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

### API-MST-005 — `POST /api/v1/subjects`

- **Requirement:** FR-ADMIN-002
- **Tujuan:** Membuat mata pelajaran.
- **Auth:** sesi admin. **Otorisasi:** `admin`.
- **Path/query:** tidak ada. **Body:** `{ "code": string, "name": string }`
- **Validasi:** `code` unik & tidak blank; `name` tidak blank.
- **Contoh request:** `POST /api/v1/subjects` + CSRF, body `{ "code": "BIO", "name": "Biologi" }`.
- **Contoh response `201`:** objek mapel.
- **Status & error:** `201`; `401`; `403`; `409 CONFLICT`; `422`; `500`.
- **Aturan & side effect:** membuat `subjects`; menulis `audit_logs`.
- **Status:** Proposed

### API-MST-006 — `GET /api/v1/students`

- **Requirement:** FR-ADMIN-002, FEAT-WALI-01, FR-REKAP-001
- **Tujuan:** Daftar siswa dengan filter kelas/pencarian.
- **Auth:** sesi. **Otorisasi:** guru (cakupan kelas diampu/perwalian), BK, admin; siswa → lihat sendiri (via API-MST-007).
- **Query params:** `classId`, `q`, `page`, `pageSize`, `sort`.
- **Body:** tidak ada.
- **Validasi:** pagination valid.
- **Contoh request:** `GET /api/v1/students?classId=c01...`
- **Contoh response `200`:** `{ "items": [ { "userId": "8f2c...", "fullName": "Budi Santoso", "nis": "2024001", "classId": "c01...", "className": "10.1" } ], "page": 1, "pageSize": 20, "total": 1 }`
- **Status & error:** `200`; `401`; `403`; `422`; `500`.
- **Aturan & side effect:** cakupan per peran ditegakkan backend (BR-14).
- **Status:** Proposed

### API-MST-007 — `GET /api/v1/students/{studentId}`

- **Requirement:** FR-ADMIN-002
- **Tujuan:** Detail profil siswa.
- **Auth:** sesi. **Otorisasi:** siswa (sendiri), guru sesuai cakupan, BK, admin.
- **Path:** `studentId` (uuid pengguna siswa).
- **Validasi:** resource ada & terlihat.
- **Contoh request:** `GET /api/v1/students/8f2c...`
- **Contoh response `200`:** `{ "userId": "8f2c...", "fullName": "Budi Santoso", "nis": "2024001", "classId": "c01...", "className": "10.1", "status": "active" }`
- **Status & error:** `200`; `401`; `403`; `404`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

### API-MST-008 — `GET /api/v1/teaching-assignments`

- **Requirement:** FR-ADMIN-002, BR-14, DEC-07
- **Tujuan:** Daftar penugasan mengajar (dasar cakupan Guru Mapel).
- **Auth:** sesi. **Otorisasi:** guru melihat miliknya; admin semua.
- **Query params:** `teacherUserId`, `classId`, `subjectId`, `page`, `pageSize`.
- **Body:** tidak ada.
- **Validasi:** pagination valid.
- **Contoh request:** `GET /api/v1/teaching-assignments?teacherUserId=9a7b...`
- **Contoh response `200`:** `{ "items": [ { "id": "t01...", "teacherUserId": "9a7b...", "subjectId": "s01...", "classId": "c01..." } ], "page": 1, "pageSize": 20, "total": 1 }`
- **Status & error:** `200`; `401`; `403`; `422`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

### API-MST-009 — `POST /api/v1/teaching-assignments`

- **Requirement:** FR-ADMIN-002, BR-14
- **Tujuan:** Menetapkan guru mengampu mapel di kelas.
- **Auth:** sesi admin. **Otorisasi:** `admin`.
- **Path/query:** tidak ada. **Body:** `{ "teacherUserId": uuid, "subjectId": uuid, "classId": uuid }`
- **Validasi:** ketiga entitas ada; kombinasi belum ada (unik).
- **Contoh request:** `POST /api/v1/teaching-assignments` + CSRF, body `{ "teacherUserId": "9a7b...", "subjectId": "s01...", "classId": "c01..." }`.
- **Contoh response `201`:** objek penugasan.
- **Status & error:** `201`; `401`; `403`; `409 CONFLICT`; `422`; `500`.
- **Aturan & side effect:** membuat `teaching_assignments`; menulis `audit_logs`.
- **Status:** Proposed

## 12. Modul Jadwal (JWL)

### API-JWL-001 — `GET /api/v1/schedules`

- **Requirement:** FR-JADWAL-001
- **Tujuan:** Menampilkan jadwal pelajaran/ujian/tryout.
- **Auth:** sesi. **Otorisasi:** semua peran dengan cakupan kelas (siswa → kelasnya).
- **Query params:** `classId`, `subjectId`, `kind` (`pelajaran|ujian|tryout`), `dayOfWeek` (1–7), `dateFrom`, `dateTo`.
- **Body:** tidak ada.
- **Validasi:** enum valid; `1 ≤ dayOfWeek ≤ 7`.
- **Contoh request:** `GET /api/v1/schedules?classId=c01...&kind=pelajaran`
- **Contoh response `200`:** `{ "items": [ { "id": "j01...", "classId": "c01...", "subjectId": "s01...", "teacherUserId": "9a7b...", "dayOfWeek": 1, "startTime": "07:15", "endTime": "08:45", "kind": "pelajaran" } ], "page": 1, "pageSize": 20, "total": 1 }`
- **Status & error:** `200`; `401`; `403`; `422`; `500`.
- **Aturan & side effect:** tanpa side effect. Jadwal dipakai sebagai konteks pertemuan absensi guru mapel.
- **Status:** Proposed

### API-JWL-002 — `POST /api/v1/schedules`

- **Requirement:** FR-ADMIN-002, FR-JADWAL-001
- **Tujuan:** Membuat jadwal.
- **Auth:** sesi admin. **Otorisasi:** `admin`.
- **Path/query:** tidak ada. **Body:** `{ "classId": uuid, "subjectId": uuid, "teacherUserId": uuid?, "dayOfWeek": int, "startTime": "HH:mm", "endTime": "HH:mm", "kind": "pelajaran|ujian|tryout" }`
- **Validasi:** `startTime < endTime`; `dayOfWeek` 1–7; entitas terkait ada.
- **Contoh request:** `POST /api/v1/schedules` + CSRF, body contoh di atas.
- **Contoh response `201`:** objek jadwal.
- **Status & error:** `201`; `401`; `403`; `409 CONFLICT` (bentrok jadwal kelas — usulan, §24 K-05); `422`; `500`.
- **Aturan & side effect:** membuat `schedules`; menulis `audit_logs`.
- **Status:** Proposed

### API-JWL-003 — `PUT /api/v1/schedules/{scheduleId}`

- **Requirement:** FR-ADMIN-002
- **Tujuan:** Mengubah jadwal.
- **Auth:** sesi admin. **Otorisasi:** `admin`.
- **Path:** `scheduleId` (uuid). **Body:** subset field API-JWL-002.
- **Validasi:** sama dengan create pada field yang dikirim.
- **Contoh request:** `PUT /api/v1/schedules/j01...` + CSRF.
- **Contoh response `200`:** objek jadwal terbaru.
- **Status & error:** `200`; `401`; `403`; `404`; `422`; `500`.
- **Aturan & side effect:** memperbarui `schedules`; menulis `audit_logs`.
- **Status:** Proposed

### API-JWL-004 — `DELETE /api/v1/schedules/{scheduleId}`

- **Requirement:** FR-ADMIN-002
- **Tujuan:** Menghapus jadwal.
- **Auth:** sesi admin. **Otorisasi:** `admin`.
- **Path:** `scheduleId` (uuid). **Body:** tidak ada.
- **Validasi:** jadwal ada.
- **Contoh request:** `DELETE /api/v1/schedules/j01...` + CSRF.
- **Contoh response `204`:** tanpa body.
- **Status & error:** `204`; `401`; `403`; `404`; `409 CONFLICT` (bila masih direferensikan — usulan); `500`.
- **Aturan & side effect:** menghapus `schedules` (kebijakan soft-delete `TBD`, SDD §15.1); menulis `audit_logs`.
- **Status:** Proposed

## 13. Modul Quiz (QZ)

> Tipe soal mengikuti `src/features/quiz/types.ts` (paralel FR-BANK-002). Nilai jawaban fleksibel (`number`, `number[]`, `boolean`, `boolean[]`, `string`).

### API-QZ-001 — `GET /api/v1/quizzes`

- **Requirement:** FR-QUIZ-001
- **Tujuan:** Daftar quiz yang tersedia untuk peran pemanggil.
- **Auth:** sesi. **Otorisasi:** siswa (quiz untuk kelasnya), guru (miliknya).
- **Query params:** `subjectId`, `classId`, `status`, `page`, `pageSize`.
- **Body:** tidak ada.
- **Validasi:** pagination valid.
- **Contoh request:** `GET /api/v1/quizzes?subjectId=s01...`
- **Contoh response `200`:** `{ "items": [ { "id": "q01...", "title": "Quiz Bab 1", "subjectId": "s01...", "description": null } ], "page": 1, "pageSize": 20, "total": 1 }`
- **Status & error:** `200`; `401`; `403`; `422`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

### API-QZ-002 — `GET /api/v1/quizzes/{quizId}`

- **Requirement:** FR-QUIZ-001
- **Tujuan:** Detail quiz + daftar soal untuk dikerjakan.
- **Auth:** sesi. **Otorisasi:** siswa pemilik attempt/kelas terkait; guru pemilik.
- **Path:** `quizId` (uuid). **Query params:** `attemptId` (opsional, agar jawaban tersimpan disertakan).
- **Body:** tidak ada.
- **Validasi:** quiz ada & terlihat.
- **Contoh request:** `GET /api/v1/quizzes/q01...`
- **Contoh response `200`:** soal **tanpa kunci jawaban** (mis. `answer_key` disamarkan untuk siswa):

```json
{
  "id": "q01...",
  "title": "Quiz Bab 1",
  "startTime": null,
  "endTime": null,
  "questions": [
    { "id": 1, "questionNumber": 1, "type": "pilihan_ganda", "question": "Ibu kota Indonesia?", "options": [ { "id": 1, "label": "Jakarta" }, { "id": 2, "label": "Bandung" } ] }
  ]
}
```

- **Status & error:** `200`; `401`; `403`; `404`; `500`.
- **Aturan & side effect:** **kunci jawaban tidak pernah dikirim ke siswa** (validasi pada backend).
- **Status:** Proposed

### API-QZ-003 — `POST /api/v1/quizzes/{quizId}/attempts`

- **Requirement:** FR-QUIZ-001
- **Tujuan:** Memulai sesi pengerjaan quiz.
- **Auth:** sesi. **Otorisasi:** `siswa`.
- **Path:** `quizId` (uuid). **Query/body:** tidak ada.
- **Validasi:** quiz aktif; siswa berhak; belum ada attempt aktif lain (usulan single-active).
- **Contoh request:** `POST /api/v1/quizzes/q01.../attempts` + CSRF.
- **Contoh response `201`:** `{ "attemptId": "a01...", "quizId": "q01...", "startedAt": "2026-10-11T09:00:00+07:00", "status": "in_progress" }`
- **Status & error:** `201`; `401`; `403`; `404`; `409 CONFLICT`; `500`.
- **Aturan & side effect:** membuat `quiz_attempts`; menulis `audit_logs` (ringan).
- **Status:** Proposed

### API-QZ-004 — `PATCH /api/v1/quiz-attempts/{attemptId}/answers/{questionId}`

- **Requirement:** FR-QUIZ-001
- **Tujuan:** Menyimpan/autosave jawaban per butir.
- **Auth:** sesi. **Otorisasi:** siswa pemilik attempt.
- **Path:** `attemptId` (uuid), `questionId` (int). **Body:** `{ "userAnswer": number|number[]|boolean|boolean[]|string|null }`
- **Validasi:** attempt berstatus `in_progress`; bentuk `userAnswer` sesuai `type` soal; rentang nilai dalam `min_val`..`max_val` untuk tipe `rentang_nilai`.
- **Contoh request:** `PATCH /api/v1/quiz-attempts/a01.../answers/1` + CSRF, body `{ "userAnswer": 1 }`.
- **Contoh response `200`:** `{ "questionId": 1, "userAnswer": 1, "isCompleted": true, "updatedAt": "2026-10-11T09:05:00+07:00" }`
- **Status & error:** `200`; `401`; `403`; `404`; `409 CONFLICT` (attempt sudah submit); `422`; `500`.
- **Aturan & side effect:** upsert `quiz_answers` (paralel `QuestionResponse`/`QuizProgress` di `types.ts`).
- **Status:** Proposed

### API-QZ-005 — `POST /api/v1/quiz-attempts/{attemptId}/submit`

- **Requirement:** FR-QUIZ-001, FR-QUIZ-002
- **Tujuan:** Mengirim jawaban dan menilai.
- **Auth:** sesi. **Otorisasi:** siswa pemilik attempt.
- **Path:** `attemptId` (uuid). **Body:** tidak ada (opsional `{ "answers": [...] }` bila tidak autosave).
- **Validasi:** attempt `in_progress`; semua soal wajib sudah dijawab (kebijakan `TBD`).
- **Contoh request:** `POST /api/v1/quiz-attempts/a01.../submit` + CSRF.
- **Contoh response `200`:** `{ "attemptId": "a01...", "submittedAt": "2026-10-11T09:30:00+07:00", "score": 80, "essayPending": true }`
- **Status & error:** `200`; `401`; `403`; `404`; `409 CONFLICT`; `422`; `500`.
- **Aturan & side effect:** menetapkan `submitted_at`; auto-nilai soal objektif; soal `essay` menunggu koreksi guru (API-KOR-001) sehingga `score` bisa final setelah koreksi.
- **Status:** Proposed

### API-QZ-006 — `GET /api/v1/quiz-attempts`

- **Requirement:** FR-QUIZ-002
- **Tujuan:** Riwayat pengerjaan quiz siswa.
- **Auth:** sesi. **Otorisasi:** siswa (sendiri); guru (untuk quiz miliknya, cakupan).
- **Query params:** `quizId`, `studentUserId`, `status`, `page`, `pageSize`, `sort`.
- **Body:** tidak ada.
- **Validasi:** pagination valid.
- **Contoh request:** `GET /api/v1/quiz-attempts?studentUserId=8f2c...`
- **Contoh response `200`:** `{ "items": [ { "attemptId": "a01...", "quizId": "q01...", "quizTitle": "Quiz Bab 1", "submittedAt": "2026-10-11T09:30:00+07:00", "score": 80 } ], "page": 1, "pageSize": 20, "total": 1 }`
- **Status & error:** `200`; `401`; `403`; `422`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

### API-QZ-007 — `GET /api/v1/quiz-attempts/{attemptId}`

- **Requirement:** FR-QUIZ-002
- **Tujuan:** Hasil & rincian jawaban satu pengerjaan.
- **Auth:** sesi. **Otorisasi:** siswa pemilik, guru pemilik quiz.
- **Path:** `attemptId` (uuid).
- **Validasi:** resource ada & terlihat.
- **Contoh request:** `GET /api/v1/quiz-attempts/a01...`
- **Contoh response `200`:** `{ "attemptId": "a01...", "quizId": "q01...", "submittedAt": "2026-10-11T09:30:00+07:00", "score": 80, "answers": [ { "answerId": "an01...", "questionId": 1, "userAnswer": 1, "isCorrect": true } ] }`
- **Status & error:** `200`; `401`; `403`; `404`; `500`.
- **Aturan & side effect:** kunci jawaban hanya untuk guru (konteks koreksi), tidak untuk siswa.
- **Status:** Proposed

## 14. Modul Bank Soal & Latihan (BNK)

### API-BNK-001 — `GET /api/v1/question-banks`

- **Requirement:** FR-LATIHAN-001, FR-BANK-001
- **Tujuan:** Daftar bank soal per mapel dan scope (`latihan`/`ujian`).
- **Auth:** sesi. **Otorisasi:** guru (bank diampu/miliknya); siswa (scope latihan untuk mapelnya).
- **Query params:** `scope` (`latihan|ujian`), `subjectId`, `ownerId`, `page`, `pageSize`.
- **Body:** tidak ada.
- **Validasi:** `scope` enum.
- **Contoh request:** `GET /api/v1/question-banks?scope=latihan&subjectId=s01...`
- **Contoh response `200`:** `{ "items": [ { "id": "b01...", "subjectId": "s01...", "scope": "latihan", "ownerId": "9a7b...", "questionCount": 12 } ], "page": 1, "pageSize": 20, "total": 1 }`
- **Status & error:** `200`; `401`; `403`; `422`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

### API-BNK-002 — `GET /api/v1/question-banks/{bankId}/questions`

- **Requirement:** FR-BANK-001, FR-BANK-002
- **Tujuan:** Daftar soal dalam satu bank.
- **Auth:** sesi. **Otorisasi:** guru pemilik bank (menyertakan kunci jawaban); siswa scope latihan (tanpa kunci).
- **Path:** `bankId` (uuid). **Query params:** `page`, `pageSize`.
- **Body:** tidak ada.
- **Validasi:** bank ada & terlihat.
- **Contoh request:** `GET /api/v1/question-banks/b01.../questions`
- **Contoh response `200`:** `{ "items": [ { "id": "qs01...", "bankId": "b01...", "type": "benar_salah", "body": "..." } ] }` (kunci jawaban hanya untuk guru).
- **Status & error:** `200`; `401`; `403`; `404`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

### API-BNK-003 — `POST /api/v1/question-banks/{bankId}/questions`

- **Requirement:** FR-BANK-001, FR-BANK-002
- **Tujuan:** Menambah soal ke bank.
- **Auth:** sesi. **Otorisasi:** guru pemilik bank.
- **Path:** `bankId` (uuid). **Body:** `{ "type": "pilihan_ganda|pilihan_ganda_kompleks|benar_salah|rentang_nilai|essay", "body": string, "options": object?, "answerKey": object? }` (bentuk per tipe `TBD` rinci → §24 K-06).
- **Validasi:** `type` enum; `body` tidak blank; struktur `options`/`answerKey` sesuai tipe.
- **Contoh request:** `POST /api/v1/question-banks/b01.../questions` + CSRF, body `{ "type": "pilihan_ganda", "body": "Ibu kota Indonesia?", "options": [ { "id": 1, "label": "Jakarta" } ], "answerKey": 1 }`.
- **Contoh response `201`:** objek soal.
- **Status & error:** `201`; `401`; `403`; `404`; `422`; `500`.
- **Aturan & side effect:** membuat `questions`; menulis `audit_logs`.
- **Status:** Proposed

### API-BNK-004 — `PUT /api/v1/questions/{questionId}`

- **Requirement:** FR-BANK-001
- **Tujuan:** Mengubah soal.
- **Auth:** sesi. **Otorisasi:** guru pemilik bank.
- **Path:** `questionId` (uuid). **Body:** subset field API-BNK-003.
- **Validasi:** soal ada; struktur sesuai tipe.
- **Contoh request:** `PUT /api/v1/questions/qs01...` + CSRF.
- **Contoh response `200`:** objek soal terbaru.
- **Status & error:** `200`; `401`; `403`; `404`; `422`; `500`.
- **Aturan & side effect:** memperbarui `questions`; menulis `audit_logs`. Perubahan soal yang sudah dipakai attempt **tidak** mengubah jawaban historis (lihat §24 K-07).
- **Status:** Proposed

### API-BNK-005 — `DELETE /api/v1/questions/{questionId}`

- **Requirement:** FR-BANK-001
- **Tujuan:** Menghapus soal.
- **Auth:** sesi. **Otorisasi:** guru pemilik bank.
- **Path:** `questionId` (uuid). **Body:** tidak ada.
- **Validasi:** soal ada.
- **Contoh request:** `DELETE /api/v1/questions/qs01...` + CSRF.
- **Contoh response `204`:** tanpa body.
- **Status & error:** `204`; `401`; `403`; `404`; `409 CONFLICT` (sudah dipakai attempt — usulan); `500`.
- **Aturan & side effect:** hapus/soft-delete `questions`; menulis `audit_logs`.
- **Status:** Proposed

## 15. Modul Koreksi Jawaban (KOR)

### API-KOR-001 — `PUT /api/v1/quiz-attempts/{attemptId}/answers/{answerId}/grade`

- **Requirement:** FR-KORESI-001
- **Tujuan:** Guru menilai jawaban siswa (terutama esai).
- **Auth:** sesi. **Otorisasi:** guru pemilik quiz (cakupan).
- **Path:** `attemptId` (uuid), `answerId` (uuid). **Body:** `{ "isCorrect": boolean?, "score": number?, "feedback": string? }`
- **Validasi:** answer ada & milik attempt; `score` dalam rentang bila diberikan.
- **Contoh request:** `PUT /api/v1/quiz-attempts/a01.../answers/an01.../grade` + CSRF, body `{ "isCorrect": true, "score": 10, "feedback": "Baik" }`.
- **Contoh response `200`:** `{ "answerId": "an01...", "isCorrect": true, "score": 10, "gradedBy": "9a7b...", "gradedAt": "2026-10-11T11:00:00+07:00" }`
- **Status & error:** `200`; `401`; `403`; `404`; `422`; `500`.
- **Aturan & side effect:** memperbarui `quiz_answers`; menghitung ulang skor attempt; menulis `audit_logs`.
- **Status:** Proposed

## 16. Modul Tugas (TGS)

### API-TGS-001 — `GET /api/v1/assignments`

- **Requirement:** FR-TUGAS-001
- **Tujuan:** Daftar tugas per kelas/mapel.
- **Auth:** sesi. **Otorisasi:** guru (mengampu), siswa (kelasnya).
- **Query params:** `classId`, `subjectId`, `teacherUserId`, `page`, `pageSize`, `sort`.
- **Body:** tidak ada.
- **Validasi:** pagination valid.
- **Contoh request:** `GET /api/v1/assignments?classId=c01...`
- **Contoh response `200`:** `{ "items": [ { "id": "as01...", "classId": "c01...", "subjectId": "s01...", "title": "Latihan Bab 2", "dueAt": "2026-10-18T23:59:00+07:00" } ], "page": 1, "pageSize": 20, "total": 1 }`
- **Status & error:** `200`; `401`; `403`; `422`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

### API-TGS-002 — `POST /api/v1/assignments`

- **Requirement:** FR-TUGAS-001
- **Tujuan:** Membuat tugas.
- **Auth:** sesi. **Otorisasi:** guru pengampu mapel/kelas.
- **Path/query:** tidak ada. **Body:** `{ "classId": uuid, "subjectId": uuid, "title": string, "description": string?, "dueAt": timestamp }`
- **Validasi:** `title` tidak blank; `dueAt` valid; guru mengampu kelas+mapel.
- **Contoh request:** `POST /api/v1/assignments` + CSRF, body contoh di atas.
- **Contoh response `201`:** objek tugas.
- **Status & error:** `201`; `401`; `403`; `422`; `500`.
- **Aturan & side effect:** membuat `assignments`; menulis `audit_logs`.
- **Status:** Proposed

### API-TGS-003 — `GET /api/v1/assignments/{assignmentId}/submissions`

- **Requirement:** FR-TUGAS-001
- **Tujuan:** Daftar pekerjaan siswa beserta nilai.
- **Auth:** sesi. **Otorisasi:** guru pemilik tugas.
- **Path:** `assignmentId` (uuid). **Query params:** `page`, `pageSize`.
- **Body:** tidak ada.
- **Validasi:** tugas ada.
- **Contoh request:** `GET /api/v1/assignments/as01.../submissions`
- **Contoh response `200`:** `{ "items": [ { "studentUserId": "8f2c...", "studentName": "Budi Santoso", "submittedAt": "2026-10-17T20:00:00+07:00", "score": null, "gradedBy": null } ], "page": 1, "pageSize": 20, "total": 1 }`
- **Status & error:** `200`; `401`; `403`; `404`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

### API-TGS-004 — `PUT /api/v1/assignments/{assignmentId}/submissions/{studentUserId}`

- **Requirement:** FR-TUGAS-001
- **Tujuan:** Menyimpan/menilai pekerjaan siswa.
- **Auth:** sesi. **Otorisasi:** guru pemilik tugas.
- **Path:** `assignmentId`, `studentUserId` (uuid). **Body:** `{ "score": number?, "note": string? }`
- **Validasi:** tugas ada; siswa anggota kelas; `score` dalam rentang bila diberikan.
- **Contoh request:** `PUT /api/v1/assignments/as01.../submissions/8f2c...` + CSRF, body `{ "score": 90 }`.
- **Contoh response `200`:** `{ "assignmentId": "as01...", "studentUserId": "8f2c...", "score": 90, "gradedBy": "9a7b...", "gradedAt": "2026-10-18T08:00:00+07:00" }`
- **Status & error:** `200`; `401`; `403`; `404`; `422`; `500`.
- **Aturan & side effect:** upsert `assignment_submissions`; menulis `audit_logs`.
- **Status:** Proposed

## 17. Modul Penilaian (NIL)

### API-NIL-001 — `GET /api/v1/assessments`

- **Requirement:** FR-NIL-001, FR-NILAI-001
- **Tujuan:** Daftar penilaian per kelas/mapel/periode.
- **Auth:** sesi. **Otorisasi:** guru (mengampu), wali, admin.
- **Query params:** `classId`, `subjectId`, `kind`, `period`, `page`, `pageSize`.
- **Body:** tidak ada.
- **Validasi:** pagination valid.
- **Contoh request:** `GET /api/v1/assessments?classId=c01...&subjectId=s01...`
- **Contoh response `200`:** `{ "items": [ { "id": "n01...", "classId": "c01...", "subjectId": "s01...", "teacherUserId": "9a7b...", "kind": "ulangan", "kkm": 75, "period": "2026-Ganjil" } ], "page": 1, "pageSize": 20, "total": 1 }`
- **Status & error:** `200`; `401`; `403`; `422`; `500`.
- **Aturan & side effect:** tanpa side effect. `kkm` dapat dikonfigurasi per mapel/sekolah (DEC-10).
- **Status:** Proposed

### API-NIL-002 — `POST /api/v1/assessments`

- **Requirement:** FR-NIL-001
- **Tujuan:** Membuat penilaian.
- **Auth:** sesi. **Otorisasi:** guru pengampu.
- **Path/query:** tidak ada. **Body:** `{ "classId": uuid, "subjectId": uuid, "kind": string, "kkm": number?, "period": string }`
- **Validasi:** guru mengampu; `kkm` ≥ 0 bila ada; `period` tidak blank.
- **Contoh request:** `POST /api/v1/assessments` + CSRF, body contoh di atas.
- **Contoh response `201`:** objek penilaian.
- **Status & error:** `201`; `401`; `403`; `422`; `500`.
- **Aturan & side effect:** membuat `assessments`; menulis `audit_logs`. Penandaan remedial (FR-KORESI-002/DEC-09) **belum** dispesifikasikan (`TBD`).
- **Status:** Proposed

### API-NIL-003 — `GET /api/v1/assessments/{assessmentId}/scores`

- **Requirement:** FR-NIL-001
- **Tujuan:** Rekap nilai penilaian per siswa.
- **Auth:** sesi. **Otorisasi:** guru pemilik, wali, admin.
- **Path:** `assessmentId` (uuid). **Query params:** `page`, `pageSize`.
- **Body:** tidak ada.
- **Validasi:** penilaian ada.
- **Contoh request:** `GET /api/v1/assessments/n01.../scores`
- **Contoh response `200`:** `{ "items": [ { "studentUserId": "8f2c...", "studentName": "Budi Santoso", "score": 85, "updatedBy": "9a7b...", "updatedAt": "2026-10-18T08:00:00+07:00" } ], "page": 1, "pageSize": 20, "total": 1 }`
- **Status & error:** `200`; `401`; `403`; `404`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

### API-NIL-004 — `PUT /api/v1/assessments/{assessmentId}/scores/{studentUserId}`

- **Requirement:** FR-NIL-001
- **Tujuan:** Menginput/mengubah nilai siswa.
- **Auth:** sesi. **Otorisasi:** guru pemilik.
- **Path:** `assessmentId`, `studentUserId` (uuid). **Body:** `{ "score": number }`
- **Validasi:** penilaian ada; siswa anggota kelas; `score` dalam rentang (mis. 0–100).
- **Contoh request:** `PUT /api/v1/assessments/n01.../scores/8f2c...` + CSRF, body `{ "score": 85 }`.
- **Contoh response `200`:** `{ "assessmentId": "n01...", "studentUserId": "8f2c...", "score": 85, "updatedBy": "9a7b...", "updatedAt": "2026-10-18T08:00:00+07:00" }`
- **Status & error:** `200`; `401`; `403`; `404`; `422`; `500`.
- **Aturan & side effect:** upsert `assessment_scores`; menulis `audit_logs` (BR-09).
- **Status:** Proposed

## 18. Modul Rekap & Rapor (RPT)

### API-RPT-001 — `GET /api/v1/reports/attendance`

- **Requirement:** FR-REKAP-001, FEAT-WALI-01, FEAT-BK-02
- **Tujuan:** Rekap absensi per kelas/siswa/periode untuk Guru Wali/BK/Admin.
- **Auth:** sesi. **Otorisasi:** `guru_wali` (kelas perwalian), `guru_bk` (semua siswa), `admin`.
- **Query params:** `classId`, `studentUserId`, `subjectType`, `dateFrom`, `dateTo`, `groupBy` (`student|class|day`).
- **Body:** tidak ada.
- **Validasi:** rentang tanggal valid; `groupBy` enum.
- **Contoh request:** `GET /api/v1/reports/attendance?classId=c01...&dateFrom=2026-10-01&dateTo=2026-10-11`
- **Contoh response `200`:** `{ "groupBy": "student", "items": [ { "studentUserId": "8f2c...", "studentName": "Budi Santoso", "hadir": 8, "terlambat": 1, "izin": 1, "sakit": 0, "alpa": 0 } ] }`
- **Status & error:** `200`; `401`; `403`; `422`; `500`.
- **Aturan & side effect:** tanpa side effect. Hanya rekaman **resmi** (koreksi `pending` tidak dihitung).
- **Status:** Proposed

### API-RPT-002 — `GET /api/v1/reports/grades`

- **Requirement:** FR-REKAP-002, FR-ADMIN-003
- **Tujuan:** Rekap nilai per kelas/mapel.
- **Auth:** sesi. **Otorisasi:** `guru_wali`, `guru_bk`, `admin`.
- **Query params:** `classId`, `subjectId`, `period`, `page`, `pageSize`.
- **Body:** tidak ada.
- **Validasi:** pagination valid.
- **Contoh request:** `GET /api/v1/reports/grades?classId=c01...&period=2026-Ganjil`
- **Contoh response `200`:** `{ "items": [ { "studentUserId": "8f2c...", "studentName": "Budi Santoso", "subjectId": "s01...", "average": 84.5 } ], "page": 1, "pageSize": 20, "total": 1 }`
- **Status & error:** `200`; `401`; `403`; `422`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

### API-RPT-003 — `GET /api/v1/students/{studentId}/report-card`

- **Requirement:** FR-RAPOT-001, FR-RAPOT-002
- **Tujuan:** Rapor siswa dengan detail nilai per mapel.
- **Auth:** sesi. **Otorisasi:** `guru_wali` (perwalian), `admin`; usulan siswa sendiri (lihat §24 K-08).
- **Path:** `studentId` (uuid). **Query params:** `period`.
- **Body:** tidak ada.
- **Validasi:** siswa ada & terlihat; `period` valid.
- **Contoh request:** `GET /api/v1/students/8f2c.../report-card?period=2026-Ganjil`
- **Contoh response `200`:** `{ "studentUserId": "8f2c...", "period": "2026-Ganjil", "subjects": [ { "subjectId": "s01...", "subjectName": "Matematika", "score": 85, "kkm": 75 } ] }`
- **Status & error:** `200`; `401`; `403`; `404`; `422`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

## 19. Modul Konseling (KSL)

### API-KSL-001 — `GET /api/v1/counseling-notes`

- **Requirement:** FR-KONSELING-001
- **Tujuan:** Daftar catatan konseling per siswa/kelas.
- **Auth:** sesi. **Otorisasi:** `guru_wali` (perwalian), `guru_bk` (semua siswa).
- **Query params:** `studentUserId`, `classId`, `page`, `pageSize`, `sort`.
- **Body:** tidak ada.
- **Validasi:** pagination valid.
- **Contoh request:** `GET /api/v1/counseling-notes?studentUserId=8f2c...`
- **Contoh response `200`:** `{ "items": [ { "id": "k01...", "studentUserId": "8f2c...", "authorId": "9a7b...", "note": "Konsultasi jurusan", "createdAt": "2026-10-10T10:00:00+07:00" } ], "page": 1, "pageSize": 20, "total": 1 }`
- **Status & error:** `200`; `401`; `403`; `422`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

### API-KSL-002 — `POST /api/v1/counseling-notes`

- **Requirement:** FR-KONSELING-001
- **Tujuan:** Mencatat konseling siswa.
- **Auth:** sesi. **Otorisasi:** `guru_wali`, `guru_bk`.
- **Path/query:** tidak ada. **Body:** `{ "studentUserId": uuid, "note": string }`
- **Validasi:** siswa ada & terlihat; `note` tidak blank.
- **Contoh request:** `POST /api/v1/counseling-notes` + CSRF, body `{ "studentUserId": "8f2c...", "note": "Konsultasi jurusan" }`.
- **Contoh response `201`:** objek catatan konseling.
- **Status & error:** `201`; `401`; `403`; `404`; `422`; `500`.
- **Aturan & side effect:** membuat `counseling_notes`; menulis `audit_logs`.
- **Status:** Proposed

### API-KSL-003 — `PUT /api/v1/counseling-notes/{noteId}`

- **Requirement:** FR-KONSELING-001
- **Tujuan:** Mengubah catatan konseling.
- **Auth:** sesi. **Otorisasi:** penulis catatan atau `guru_bk`.
- **Path:** `noteId` (uuid). **Body:** `{ "note": string }`
- **Validasi:** catatan ada; `note` tidak blank.
- **Contoh request:** `PUT /api/v1/counseling-notes/k01...` + CSRF, body `{ "note": "Diperbarui" }`.
- **Contoh response `200`:** objek catatan terbaru.
- **Status & error:** `200`; `401`; `403`; `404`; `422`; `500`.
- **Aturan & side effect:** memperbarui `counseling_notes`; menulis `audit_logs`.
- **Status:** Proposed

### API-KSL-004 — `POST /api/v1/counseling-notes/{noteId}/followups`

- **Requirement:** FR-KONSELING-002
- **Tujuan:** Menambah tindak lanjut atas catatan konseling.
- **Auth:** sesi. **Otorisasi:** `guru_wali`, `guru_bk` (cakupan).
- **Path:** `noteId` (uuid). **Body:** `{ "note": string }`
- **Validasi:** catatan ada; `note` tidak blank.
- **Contoh request:** `POST /api/v1/counseling-notes/k01.../followups` + CSRF, body `{ "note": "Orang tua dihubungi" }`.
- **Contoh response `201`:** objek tindak lanjut.
- **Status & error:** `201`; `401`; `403`; `404`; `422`; `500`.
- **Aturan & side effect:** membuat `counseling_followups`; menulis `audit_logs`.
- **Status:** Proposed

## 20. Modul Minat Bakat & Passing Grade (MB/PG)

### API-MB-001 — `GET /api/v1/students/{studentId}/aptitude-results`

- **Requirement:** FR-MB-001
- **Tujuan:** Menampilkan hasil minat bakat siswa.
- **Auth:** sesi. **Otorisasi:** siswa (sendiri), `guru_wali` (perwalian), `guru_bk`.
- **Path:** `studentId` (uuid). **Body:** tidak ada.
- **Validasi:** siswa ada & terlihat.
- **Contoh request:** `GET /api/v1/students/8f2c.../aptitude-results`
- **Contoh response `200`:** `{ "studentUserId": "8f2c...", "results": [ { "id": "ap01...", "result": "Rekomendasi: IPA", "assessedAt": "2026-09-01T00:00:00+07:00" } ] }`
- **Status & error:** `200`; `401`; `403`; `404`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

### API-MB-002 — `POST /api/v1/students/{studentId}/target-majors`

- **Requirement:** FR-MB-002
- **Tujuan:** Menambah target jurusan siswa.
- **Auth:** sesi. **Otorisasi:** siswa (sendiri).
- **Path:** `studentId` (uuid). **Body:** `{ "major": string }`
- **Validasi:** siswa = pemilik sesi; `major` tidak blank.
- **Contoh request:** `POST /api/v1/students/8f2c.../target-majors` + CSRF, body `{ "major": "Teknik Informatika" }`.
- **Contoh response `201`:** `{ "id": "tm01...", "studentUserId": "8f2c...", "major": "Teknik Informatika", "createdAt": "2026-10-11T12:00:00+07:00" }`
- **Status & error:** `201`; `401`; `403`; `404`; `422`; `500`.
- **Aturan & side effect:** membuat `target_majors`.
- **Status:** Proposed

### API-PG-001 — `GET /api/v1/passing-grades`

- **Requirement:** FR-PG-001
- **Tujuan:** Daftar informasi passing grade perguruan tinggi.
- **Auth:** sesi. **Otorisasi:** semua peran terautentikasi.
- **Query params:** `university`, `major`, `year`, `page`, `pageSize`.
- **Body:** tidak ada.
- **Validasi:** pagination valid.
- **Contoh request:** `GET /api/v1/passing-grades?university=UI`
- **Contoh response `200`:** `{ "items": [ { "id": "pg01...", "university": "Universitas Indonesia", "major": "Teknik Informatika", "score": 700, "year": 2025 } ], "page": 1, "pageSize": 20, "total": 1 }`
- **Status & error:** `200`; `401`; `422`; `500`.
- **Aturan & side effect:** data referensi yang dikelola Admin (DEC-10); tanpa side effect.
- **Status:** Proposed

### API-PG-002 — `GET /api/v1/passing-grades/{passingGradeId}`

- **Requirement:** FR-PG-001
- **Tujuan:** Detail passing grade satu jurusan/PT.
- **Auth:** sesi. **Otorisasi:** semua peran terautentikasi.
- **Path:** `passingGradeId` (uuid).
- **Validasi:** resource ada.
- **Contoh request:** `GET /api/v1/passing-grades/pg01...`
- **Contoh response `200`:** objek passing grade.
- **Status & error:** `200`; `401`; `404`; `500`.
- **Aturan & side effect:** tanpa side effect.
- **Status:** Proposed

## 21. Modul Notifikasi (NTF)

### API-NTF-001 — `GET /api/v1/notifications`

- **Requirement:** FR-NOTIF-001, DEC-12
- **Tujuan:** Daftar notifikasi in-app pengguna.
- **Auth:** sesi. **Otorisasi:** pemilik notifikasi (dirinya sendiri).
- **Query params:** `unreadOnly` (bool), `page`, `pageSize`.
- **Body:** tidak ada.
- **Validasi:** pagination valid.
- **Contoh request:** `GET /api/v1/notifications?unreadOnly=true`
- **Contoh response `200`:** `{ "items": [ { "id": "nt01...", "type": "attendance_correction_approved", "payload": { "attendanceDate": "2026-10-11" }, "readAt": null, "createdAt": "2026-10-11T10:00:00+07:00" } ], "page": 1, "pageSize": 20, "total": 1 }`
- **Status & error:** `200`; `401`; `422`; `500`.
- **Aturan & side effect:** tanpa side effect. Kanal eksternal (email/WA) di luar lingkup awal.
- **Status:** Proposed

### API-NTF-002 — `POST /api/v1/notifications/{notificationId}/read`

- **Requirement:** FR-NOTIF-001
- **Tujuan:** Menandai notifikasi telah dibaca.
- **Auth:** sesi. **Otorisasi:** pemilik notifikasi.
- **Path:** `notificationId` (uuid). **Body:** tidak ada.
- **Validasi:** notifikasi ada & milik pemanggil.
- **Contoh request:** `POST /api/v1/notifications/nt01.../read` + CSRF.
- **Contoh response `200`:** `{ "id": "nt01...", "readAt": "2026-10-11T10:05:00+07:00" }`
- **Status & error:** `200`; `401`; `403`; `404`; `500`.
- **Aturan & side effect:** memperbarui `notifications.read_at`.
- **Status:** Proposed

## 22. Requirement Traceability (Endpoint ↔ Requirement ↔ Data)

Pemetaan `Requirement → Endpoint → Entitas (SDD §15) → Halaman/Modul frontend` (referensi kode aktual sebagai konteks, bukan klaim integrasi).

| Requirement | Endpoint | Entitas/kolom | Modul frontend (konteks) |
| --- | --- | --- | --- |
| FR-AUTH-001/006 | API-AUTH-001 | `users`, `sessions` | `features/login/Login.tsx` |
| FR-AUTH-002 | API-AUTH-002 | `sessions` | (belum ada UI logout) |
| FR-AUTH-003 | API-AUTH-004 | `users.password_hash`, `sessions`, `audit_logs` | `admin/section/ManajemenPengguna.tsx` |
| FR-AUTH-004 | API-AUTH-003 + middleware | `users`, `roles`, `user_roles` | semua `features/*` |
| FR-DASH-001 | API-AUTH-003 | `user_roles` | `features/dashboard/*` |
| FR-ABS-001/006/007/008/012 | API-ABS-001 | `attendance_events`, `attendance_records`, `devices`, `biometric_identities`, `school_settings` | `guruMapel/absensi/*` |
| FR-ABS-002 | API-ABS-004 | `attendance_records` (`source=manual`) | `guruMapel/absensi/DaftarSiswaTab.tsx`, `pertemuan/*` |
| FR-ABS-003 | API-ABS-002, API-ABS-003 | `attendance_records`, `attendance_events` | `guruMapel/absensi/*`, `guruWali/absensi/*` |
| FR-ABS-004 | API-ABS-005..008 | `attendance_corrections`, `audit_logs` | (belum ada UI koreksi) |
| FR-ABS-009 | API-ABS-002 | `attendance_records.check_in_at` | `guruMapel/absensi/DaftarSiswaTab.tsx` |
| FR-ABS-010 | API-SET-001, API-SET-002 | `school_settings` | `admin/section/AkademikDanJadwal.tsx` |
| FR-ABS-011 | konvensi waktu §2.7 | `attendance_records.attendance_date` | semua absensi |
| FR-ABS-013 | API-ABS-002 (`subjectType=teacher`) | `attendance_records` | `admin/section/Presensi.tsx` |
| FR-ADMIN-001 | API-USR-001..004 | `users`, `user_roles` | `admin/section/ManajemenPengguna.tsx` |
| FR-ADMIN-002 | API-MST-001..009, API-JWL-002..004 | `classes`, `subjects`, `teaching_assignments`, `schedules` | `admin/section/AkademikDanJadwal.tsx` |
| FR-ADMIN-003 | API-RPT-001/002 | `attendance_records`, `assessment_scores` | `admin/section/Presensi.tsx`, `NilaiRapor.tsx` |
| FR-JADWAL-001 | API-JWL-001 | `schedules` | `features/jadwal/*` |
| FR-QUIZ-001 | API-QZ-001..004 | `quizzes`, `quiz_attempts`, `quiz_answers` | `features/quiz/*` |
| FR-QUIZ-002 | API-QZ-005..007 | `quiz_attempts`, `quiz_answers` | `features/quiz-result/*`, `riwayat-quiz/*` |
| FR-LATIHAN-001 | API-BNK-001/002 | `question_banks`, `questions` | `features/latihan-soal/*` |
| FR-BANK-001 | API-BNK-003..005 | `questions` | `guru/LatihanSoal/*`, `guru/Ujian/*` |
| FR-BANK-002 | API-BNK-002/003 | `questions.type`/`options` | `features/quiz/types.ts` (5 tipe) |
| FR-TUGAS-001 | API-TGS-001..004 | `assignments`, `assignment_submissions` | `guru/Tugas/*` |
| FR-NILAI-001 | API-NIL-001..004 | `assessments`, `assessment_scores` | `guru/Penilaian/*` |
| FR-KORESI-001 | API-KOR-001 | `quiz_answers` | `guru/Koreksi/*` |
| FR-KORESI-002 | **belum ada endpoint** (`TBD`, DEC-09) | `assessments` (`is_remedial`) | `guru/Remedial/GuruRemedial.tsx` (kosong) |
| FR-REKAP-001 | API-RPT-001 | `attendance_records` | `guruWali/absensi/*`, `guruBK/Rekap/Absen/*` |
| FR-REKAP-002 | API-RPT-002 | `assessment_scores` | `guruBK/Rekap/Nilai/*` |
| FR-RAPOT-001/002 | API-RPT-003 | `assessment_scores`, `subjects` | `guruWali/rapotSiswa/*` |
| FR-KONSELING-001 | API-KSL-001..003 | `counseling_notes` | `guruBK/Konseling/*`, `guruWali/konselingWali/*` |
| FR-KONSELING-002 | API-KSL-004 | `counseling_followups` | `guruWali/konselingWali/CatatanKonselingWaliTindakLanjut.tsx` |
| FR-MB-001 | API-MB-001 | `aptitude_results` | `guruBK/MinatBakat/*`, `hasil-minat-bakat/*` |
| FR-MB-002 | API-MB-002 | `target_majors` | `hasil-minat-bakat/TambahTargetJurusanLain.tsx` |
| FR-PG-001 | API-PG-001/002 | `passing_grades` | `features/passing-grade/*` |
| FR-NOTIF-001 | API-NTF-001/002 | `notifications` | `features/notifikasi/*` |
| IR-SW-001 / DEC-04 | API-ABS-001, API-DEV-001..003 | `devices`, `attendance_events` | (perangkat eksternal) |

Catatan: `FR-KORESI-002` dan fitur ekspor (DEC-13) sengaja **tanpa** endpoint pada kontrak awal karena lingkup/struktur belum diputuskan; lihat §24 K-01.

## 23. Aturan Bisnis yang Direpresentasikan

| Aturan | Penerapan di kontrak |
| --- | --- |
| BR-01 (email+password) | API-AUTH-001 |
| BR-02 (reset hanya Admin) | API-AUTH-004 (peran `admin`) |
| BR-03 (IoT masuk pagi / pulang) | API-ABS-001 (`eventType`) |
| BR-04 (device menang; guru bila belum tercatat) | API-ABS-001 vs API-ABS-004, ditahan `409` bila sudah ada rekaman device |
| BR-06 (Terlambat vs jam masuk, WIB) | API-ABS-001 + API-SET-001/002 |
| BR-07 (koreksi + persetujuan + audit) | API-ABS-005..008 |
| BR-09 (retensi & audit) | `audit_logs` pada API-AUTH-004, API-ABS-004..008, API-MST-*, API-NIL-004, API-KSL-* |
| BR-10 (tanda merah) | `checkInAt: null` pada API-ABS-002 |
| BR-11 (banyak alat) | API-ABS-001 + `UNIQUE(subject_user_id, attendance_date)` |
| BR-12 (WIB) | §2.7 |
| BR-13 (absensi guru) | API-ABS-001/002 dengan `subjectType=teacher` |
| BR-14 (batas akses per peran) | Kolom `Peran` tiap endpoint + §2.10 |

## 24. Keputusan yang Wajib Dibahas dengan Tim Backend

Isu berikut harus disepakati **sebelum** kontrak dipakai untuk integrasi (IR-API-004). Dipetakan ke open issues SDD/DEC.

| ID | Keputusan | Terkait | Dampak bila tidak diputuskan |
| --- | --- | --- | --- |
| K-01 | Lingkup Admin (DEC-08, AUD-014): confirm CRUD pengguna/data akademik; apakah ekspor CSV/Excel/PDF (DEC-13) masuk kontrak awal. | API-USR-*, API-MST-*, API-JWL-*, DEC-13 | Endpoint Admin/ekspor bisa berubah besar. |
| K-02 | Apakah pembuatan pengguna (`POST /users`) sekaligus membuat profil `students`/`teachers`, atau dipisah. | API-USR-002, API-MST-007, ADR-012 | Skema input user & integritas profil. |
| K-03 | Aturan keselamatan Admin: larangan menonaktifkan akun sendiri / menghapus Admin terakhir; status inactive vs soft-delete. | API-USR-004, SDD §15.1 | Risiko lockout dan kehilangan akses. |
| K-04 | Apakah perubahan `school_settings.first_entry_time` menghitung ulang status historis atau hanya berlaku ke depan. | API-SET-002, DEC-02 | Inkonsistensi rekap vs aturan keterlambatan. |
| K-05 | Deteksi bentrok jadwal (kelas/guru/ruang) — perlu constraint atau tidak. | API-JWL-002, DR-004 | Data jadwal ganda/keliru. |
| K-06 | Skema rinci `options`/`answerKey` per tipe soal (5 tipe) dan validasinya. | API-BNK-003, FR-BANK-002 | Soal tidak dapat dinilai konsisten. |
| K-07 | Kebijakan versi soal: apakah soal yang sudah dipakai attempt boleh diubah; dampak ke attempt historis. | API-BNK-004/005, FR-QUIZ-002 | Nilai/riwayat berubah tanpa jejak. |
| K-08 | Apakah siswa boleh melihat rapor sendiri (`report-card`) atau hanya Guru Wali/Admin. | API-RPT-003, DEC-07 | Kebocoran data / salah otorisasi. |
| K-09 | Status `pending` koreksi: apakah mencegah edit lain pada rekaman yang sama; aturan konflik. | API-ABS-005, API-ABS-004 | Dua jalur mengubah satu rekaman. |
| K-10 | Layanan ingestion perangkat: format kredensial device, autentikasi, rate limit, dan payload versi (DEC-04, SDD-OI-02). | API-ABS-001, API-DEV-002 | Keamanan & idempotensi ingestion tidak terjamin. |
| K-11 | Apakah flag `lateToleranceMinutes` dipakai (SDD §15.3) dan bagaimana pengaruhnya ke status `terlambat`. | API-SET-002, SDD §17.1 | Perbedaan perhitungan keterlambatan FE/BE. |
| K-12 | Pagination default/maks dan apakah ada endpoint yang butuh streaming/ekspor tanpa pagination. | §2.6 | Performa & konsistensi respons. |
| K-13 | Notifikasi: siapa/layanan apa yang menghasilkan (event dari absensi/nilai); jenis `type` yang diizinkan. | API-NTF-001, DEC-12 | Kontrak `payload`/`type` tidak jelas. |
| K-14 | Password: kebijakan kompleksitas, alur reset (generated/temporary, paksa ganti saat login). | API-AUTH-004, DEC-05 | Keamanan kredensial. |

## 25. Catatan Konsistensi & Perubahan

- Seluruh endpoint **Proposed**; tidak ada endpoint berstatus Approved/Implemented. Tidak ada implementasi Go maupun perubahan frontend pada tahap ini.
- Nama field mengikuti model SDD §15 (`attendance_records`, `attendance_events`, `attendance_corrections`, `school_settings`, `devices`, `biometric_identities`, `audit_logs`, `sessions`, `notifications`, entitas akademik §15.4).
- Tipe soal selaras `src/features/quiz/types.ts` (5 tipe termasuk `rentang_nilai`).
- Enum peran/status selaras SRS §2.11 dan DEC-01/02.
- Format error, timestamp, pagination, versioning, dan penamaan konsisten dengan SDD §6.
- `docs/openapi.yaml` adalah representasi mesin dari dokumen ini; bila berbeda, dokumen Markdown dan OpenAPI harus diselaraskan melalui PR (SDD §6).

## 26. Riwayat Dokumen

| Versi | Tanggal | Perubahan |
| --- | --- | --- |
| 0.1 | 2026-10-11 | Draft kontrak awal (Fase E); seluruh endpoint Proposed; belum ada ratifikasi. |
