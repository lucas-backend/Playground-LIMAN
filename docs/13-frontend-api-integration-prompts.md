# 13 — Tahapan Prompt Integrasi Frontend–Backend LIMEN

- **Status:** Prompt eksekusi bertahap — belum dijalankan
- **Versi:** 0.1
- **Tanggal:** 2026-11-12
- **Tujuan:** Menyediakan prompt siap pakai dari pemeriksaan awal sampai release integrasi frontend dengan backend.
- **Rujukan:** [11-frontend-api-integration-plan.md](./11-frontend-api-integration-plan.md) dan [12-backend-integration-findings.md](./12-backend-integration-findings.md)

> Jalankan prompt secara berurutan. Jangan melompati gate. Setiap prompt harus menghasilkan perubahan yang dapat diperiksa atau laporan blocker yang eksplisit. Jangan mengklaim test/build berhasil bila command belum benar-benar dijalankan.

## 1. Aturan penggunaan

1. Jalankan satu prompt dalam satu sesi kerja.
2. Sebelum mulai, periksa `git status` pada repository yang akan diubah.
3. Jangan menghapus atau membalik perubahan yang bukan hasil pekerjaan sesi aktif.
4. Pada setiap tahap, baca file terkait sebelum mengedit.
5. Pertahankan kontrak backend aktual sebagai fakta, tetapi jangan mengubah kontrak bisnis tanpa persetujuan.
6. Untuk kebutuhan yang belum terjawab, berhenti pada gate dan minta keputusan; jangan membuat endpoint, role, field, atau aturan bisnis baru.
7. Semua mutation memakai cookie session dan CSRF sesuai hasil backend:
   - cookie session: `session`
   - cookie CSRF: `csrf`
   - header: `X-CSRF-Token`
8. Backend aktual belum mendaftarkan `API-ABS-*` pada router. Jangan mengintegrasikan absensi seolah-olah endpoint sudah tersedia.
9. Endpoint fingerprint aktual berada di `/api/v1/fingerprint/*` dan boundary keamanannya belum disetujui. Jangan memasukkannya ke alur user biasa.
10. Setelah setiap tahap, catat file berubah, command yang dijalankan, hasilnya, dan blocker berikutnya.

## 2. Peta tahapan dan gate

| Tahap | Fokus | Dependensi | Gate selesai |
| --- | --- | --- | --- |
| 0 | Baseline dan workspace | — | Scope dan status repo tervalidasi. |
| 1 | Keputusan kontrak/API | 0 | Cookie, CSRF, origin, source spec, dan domain scope disepakati. |
| 2 | Fondasi API client dan tipe | 1 | Client dapat request read/mutation dan memetakan error tanpa komponen memanggil `fetch` langsung. |
| 3 | Auth, session, dan route guard | 2 + backend auth | Login, `/auth/me`, logout, 401/403, dan guard teruji. |
| 4 | Server-state dan async UI | 2 | Query/mutation, cache, loading, empty, error, retry konsisten. |
| 5 | Master data dan admin | 3–4 | User, class, subject, student, teaching assignment aktif via API. |
| 6 | Jadwal | 5 | Jadwal read/admin CRUD sesuai route aktif. |
| 7 | Quiz dan bank soal | 3–4 | Quiz, attempt, answer, submit, question bank, grading berjalan. |
| 8 | Tugas, penilaian, laporan, konseling | 5–7 | Domain yang endpoint-nya aktif terintegrasi tanpa mock sebagai source of truth. |
| 9 | Notifikasi, aptitude, passing grade | 3–8 | Read/mutation yang disetujui terintegrasi. |
| 10 | Absensi | Backend `API-ABS-*` aktif | Hanya dijalankan setelah route absensi benar-benar tersedia dan diuji. |
| 11 | Fingerprint | Keputusan boundary | Hanya dijalankan bila SPA memang menjadi client resmi. |
| 12 | Contract, integration, E2E, UAT | 3–11 | Bukti test dan UAT tersedia; tidak ada blocker release. |
| 13 | Cutover dan release | 12 | Mock dipensiunkan, rollback dan observability siap. |

---

## Prompt 0 — Baseline dan pemeriksaan workspace

```text
Konteks:
- Proyek frontend LIMEN berada di C:\Users\lucas\Project\liman-frontend.
- Backend LIMEN berada di C:\Users\lucas\Project\limen-backend.
- Tujuan akhir adalah integrasi frontend dengan endpoint backend yang benar-benar aktif.
- Dokumentasi integrasi:
  - docs/11-frontend-api-integration-plan.md
  - docs/12-backend-integration-findings.md

Tugas:
1. Periksa git status kedua repository tanpa mengubah file.
2. Baca package.json, konfigurasi TypeScript/Vite/ESLint, src/App.tsx, Login.tsx,
   UserProvider, dan struktur features frontend.
3. Baca backend README.md, openapi.yaml, dan
   internal/adapter/http/router/routes.go.
4. Buat matriks:
   - endpoint OpenAPI,
   - route backend aktif,
   - route frontend existing,
   - status: aktif, belum aktif, mismatch, atau belum diputuskan.
5. Verifikasi hash openapi.yaml frontend root dan backend.
6. Jangan menambah dependency dan jangan mengubah source.

Output:
- Laporan fakta dengan path dan nomor baris.
- Daftar blocker untuk Prompt 1.
- Tidak ada klaim test/build karena tahap ini read-only.

Stop condition:
- Berhenti bila source spec tidak identik atau git status menunjukkan konflik
  yang membuat pemeriksaan tidak dapat dipercaya.
```

## Prompt 1 — Menutup keputusan kontrak dan environment

```text
Konteks:
- Gunakan findings backend sebagai fakta.
- Backend memakai cookie session bernama "session" dan CSRF cookie bernama "csrf".
- Mutation membutuhkan header X-CSRF-Token.
- Cookie backend saat ini Secure=true dan SameSite=Strict.
- Backend tidak menunjukkan konfigurasi CORS.
- API absensi belum aktif pada router.
- Fingerprint aktif di /api/v1/fingerprint/* tanpa auth middleware.

Tugas:
1. Jangan mengubah source aplikasi.
2. Buat daftar keputusan yang harus disetujui sebelum coding:
   - source of truth OpenAPI,
   - strategi generated/manual TypeScript types,
   - test runner dan contract-test workflow,
   - origin dev/staging/production dan CORS/proxy,
   - cookie Secure/SameSite untuk setiap environment,
   - mapping latihan vs quiz,
   - scope remedial/KKM,
   - boundary fingerprint,
   - status endpoint absensi,
   - pemanggil API-NTF-003.
3. Untuk tiap keputusan, tulis opsi, konsekuensi, rekomendasi,
   pemilik keputusan, dan status.
4. Tandai keputusan yang tidak boleh diasumsikan.

Output:
- Dokumen keputusan atau update dokumentasi yang disetujui pengguna.
- Checklist gate implementasi.

Stop condition:
- Jangan lanjut ke Prompt 2 sebelum source spec, auth cookie, CSRF,
  environment origin, dan status API absensi memiliki keputusan eksplisit.
```

## Prompt 2 — Membangun API client dan tipe

```text
Konteks:
- Gunakan openapi.yaml yang sudah ditetapkan sebagai source of truth.
- Backend aktif menggunakan /api/v1.
- Jangan membuat endpoint dari nama route frontend.

Tugas:
1. Implementasikan konfigurasi environment API tanpa menaruh secret di bundle.
2. Buat shared HTTP client tunggal dengan:
   - base URL,
   - credentials: include,
   - Accept dan Content-Type yang benar,
   - AbortSignal/timeout,
   - dukungan response 204,
   - header X-CSRF-Token pada mutation,
   - parsing error { code, message, details }.
3. Buat tipe request/response untuk domain yang benar-benar aktif.
4. Buat mapper API model ke view model hanya bila format UI berbeda.
5. Pastikan komponen tidak memanggil fetch/axios langsung.
6. Tambahkan test focused untuk:
   - URL dan method,
   - credentials,
   - CSRF,
   - 204,
   - envelope error,
   - network/abort error.
7. Jangan mengintegrasikan domain absensi atau fingerprint pada tahap ini.

Validasi:
- Jalankan typecheck/build/lint dan test yang tersedia.
- Catat command dan output aktual.

Stop condition:
- Berhenti bila response backend tidak cocok dengan OpenAPI.
- Jangan menambahkan fallback sukses palsu atau catch kosong.
```

## Prompt 3 — Auth, session, dan route guard

```text
Konteks:
- Login: POST /api/v1/auth/login.
- Session identity: GET /api/v1/auth/me.
- Logout: POST /api/v1/auth/logout.
- Password reset admin: POST /api/v1/users/{userId}/password-reset.
- Cookie session: session, HttpOnly.
- Cookie CSRF: csrf, dapat dibaca JavaScript.
- Mutation mengirim X-CSRF-Token.
- Backend menggunakan 401 UNAUTHENTICATED dan 403 CSRF_INVALID/FORBIDDEN.

Tugas:
1. Ganti Login.tsx yang masih langsung navigate ke dashboard.
2. Bind email/password ke state/form dan tampilkan validation/error.
3. Setelah login, bootstrap /auth/me dan simpan session state hanya sebagai
   state UX; jangan menyimpan session token ke localStorage.
4. Tambahkan logout yang memanggil backend dan membersihkan cache.
5. Tambahkan protected layout/guard UX untuk route privat.
6. Tangani:
   - initial session loading,
   - 401 UNAUTHENTICATED,
   - 403 tanpa menganggap session expired,
   - invalid credentials,
   - CSRF_INVALID,
   - network error.
7. Gunakan role code backend: siswa, guru_mapel, guru_wali, guru_bk, admin.
8. Jangan menganggap guard sebagai otorisasi backend.
9. Jangan implementasikan reset password UI bila requirement layar dan role
   belum disepakati; siapkan API layer saja bila diperlukan.

Validasi:
- Test login valid/gagal, refresh session, logout, expired session,
  forbidden, dan mutation tanpa CSRF.
- Jalankan build/lint/test dan catat hasil aktual.
```

## Prompt 4 — Server-state dan pola async UI

```text
Konteks:
- Banyak halaman frontend masih memakai mock/local state.
- Backend memiliki endpoint aktif untuk master data, jadwal, quiz, tugas,
  assessment, reports, counseling, aptitude, passing grade, dan notification.

Tugas:
1. Tetapkan dan pasang pola server-state yang telah disetujui.
2. Buat konvensi query key per domain dan filter.
3. Sediakan komponen/pola:
   - loading,
   - empty,
   - error,
   - retry,
   - forbidden,
   - pagination.
4. Sediakan mutation state untuk pending/success/error.
5. Invalidate query setelah mutation berhasil.
6. Cegah double submit.
7. Jangan memakai optimistic update sebelum mutation dan rollback-nya aman.
8. Tambahkan ErrorBoundary untuk error render yang tidak tertangani.
9. Pertahankan UI existing; jangan melakukan redesign tidak terkait.

Validasi:
- Uji query berubah ketika filter/page berubah.
- Uji mutation menginvalidasi query yang benar.
- Uji empty berbeda dari error.
```

## Prompt 5 — Master data dan admin

```text
Konteks:
- Route backend aktif:
  GET/POST/PUT /classes,
  GET/POST /subjects,
  GET /students,
  GET/PATCH /students/{studentId},
  GET/POST /teaching-assignments,
  GET/POST/PUT users sesuai role admin.
- Semua mutation membutuhkan CSRF.
- ID API berbentuk UUID.

Tugas:
1. Integrasikan halaman Admin dan halaman yang membutuhkan class/subject/student
   melalui API layer.
2. Implementasikan list, filter, pagination, detail, create, update sesuai
   operasi yang benar-benar tersedia.
3. Map route param existing seperti kelas_id/siswa_id ke classId/studentId
   tanpa mengubah identifier menjadi angka.
4. Tampilkan validation, conflict, forbidden, not found, dan empty state.
5. Hilangkan source of truth mock untuk domain yang sudah dipindahkan.
6. Pastikan operasi admin hanya tersedia sebagai UX untuk role admin.
7. Jangan menambah delete bila backend tidak menyediakan delete.
8. Jangan mengarang field profil yang tidak ada di schema/backend.

Validasi:
- Uji CRUD sesuai operasi yang tersedia.
- Uji role non-admin tidak mendapatkan menu admin dan backend tetap menjadi
  otoritas.
- Jalankan build/lint/test.
```

## Prompt 6 — Jadwal

```text
Konteks:
- Backend aktif menyediakan GET/POST /schedules dan PUT/DELETE
  /schedules/{scheduleId}.
- Router backend saat ini menempatkan schedule di admin group.
- Kontrak membedakan kind: pelajaran, ujian, tryout.

Tugas:
1. Integrasikan halaman Jadwal ke API-JWL-001..004.
2. Map tab/section existing ke kind API tanpa mengubah nilai enum.
3. Kirim filter yang benar-benar dideklarasikan kontrak.
4. Implementasikan admin mutation dengan CSRF, confirmation, loading,
   conflict/validation, dan refresh cache.
5. Pastikan UUID scheduleId dipakai pada detail/mutation.
6. Jangan mengasumsikan siswa/guru dapat CRUD bila router backend hanya
   mengizinkan admin.

Validasi:
- Uji daftar kosong, filter, create, update, delete, 401, 403, 422.
```

## Prompt 7 — Quiz dan bank soal

```text
Konteks:
- Backend aktif menyediakan quiz, attempts, answers, submit, grading,
  question banks, questions, dan grading jawaban.
- Question bank memiliki scope latihan|ujian.
- Backend menyediakan seeder quiz untuk data pengujian.
- Answer key tidak boleh dikirim ke siswa bila tidak ada di response siswa.

Tugas:
1. Integrasikan quiz list/detail/start attempt/save answer/submit/history/result.
2. Gunakan UUID quizId, attemptId, questionId, answerId.
3. Implementasikan autosave dengan mutation terkontrol dan cegah double submit.
4. Integrasikan bank soal dengan filter scope latihan/ujian.
5. Pisahkan permission siswa, guru pemilik, dan role lain berdasarkan response
   backend; jangan menjadikan route UI sebagai otorisasi.
6. Pastikan detail quiz siswa tidak menampilkan answer key.
7. Integrasikan koreksi jawaban hanya untuk endpoint grading yang aktif.
8. Jangan mengklaim bahwa route latihan-soal adalah endpoint berbeda sebelum
   keputusan mapping latihan vs quiz ditutup.
9. Pertahankan/fix route param quiz existing secara terukur; uji regresi
   terhadap bug :quiz_id vs useParams().

Validasi:
- Jalankan seeder quiz backend pada environment test bila tersedia.
- Uji autosave, refresh attempt, submit, hasil, grading, forbidden,
  dan answer-key leakage.
```

## Prompt 8 — Tugas, assessment, reports, dan konseling

```text
Konteks:
- Backend aktif memiliki:
  assignments + submissions,
  assessments + scores,
  reports/attendance, reports/grades, report-card,
  counseling-notes + followups.
- Tidak ada route remedial yang dapat dijadikan kontrak.
- Aturan KKM/remedial masih terbuka.

Tugas:
1. Integrasikan domain tugas dengan list/create/submissions/grading.
2. Integrasikan assessment dan score dengan filter/detail/upsert yang tersedia.
3. Integrasikan report absensi, report grades, dan report card sebagai read
   sesuai scope yang backend izinkan.
4. Integrasikan counseling notes dan followups dengan error/validation state.
5. Gunakan cache invalidation setelah grading, score upsert, note update,
   atau followup.
6. Jangan membuat UI remedial atau KKM baru dari asumsi.
7. Jangan membuat export CSV/Excel/PDF karena endpoint belum tersedia.
8. Pastikan data sensitif tidak bocor ke role atau studentId yang salah.

Validasi:
- Uji ownership/scope dengan role yang berbeda.
- Uji conflict, 403/404, pagination, dan data stale setelah mutation.
```

## Prompt 9 — Aptitude, passing grade, dan notification

```text
Konteks:
- Backend aktif memiliki aptitude results, target majors, passing grades,
  notifications list, create, dan mark read.
- Create notification tersedia secara teknis, tetapi pemanggil/use case
  frontend belum diputuskan.

Tugas:
1. Integrasikan hasil aptitude dan target major untuk scope student yang sah.
2. Integrasikan passing grade list/detail sebagai read-only.
3. Integrasikan notification list dengan unread filter dan pagination.
4. Integrasikan mark-read dengan CSRF dan invalidation unread/list.
5. Jangan expose create notification pada menu pengguna sampai role dan use
   case pemanggil disepakati.
6. Tampilkan forbidden/not-found tanpa membocorkan data siswa.

Validasi:
- Uji unreadOnly, mark-read, refresh, empty list, dan scope student.
```

## Prompt 10 — Absensi setelah backend siap

```text
Prasyarat wajib:
- Backend telah mendaftarkan dan menguji API-ABS-001..008 pada router aktif.
- Request/response absensi final sudah sama dengan OpenAPI.
- Aturan status, correction approval, tanggal WIB, dan role scope sudah
  disetujui.
- Tersedia environment test dan data uji.

Tugas:
1. Jangan mulai bila salah satu prasyarat belum terpenuhi; laporkan blocker.
2. Integrasikan records list/detail dengan filter tanggal, kelas, subjek,
   dan pagination sesuai kontrak.
3. Integrasikan penetapan status manual dengan CSRF dan conflict state.
4. Integrasikan correction submit/list/approve/reject sesuai role.
5. Tampilkan status turunan seperti belum check-in hanya berdasarkan payload
   resmi, bukan aturan baru di UI.
6. Tangani duplicate/idempotency sesuai response backend.
7. Pisahkan absensi siswa, guru mapel, guru wali, BK, dan admin sesuai
   scope backend.
8. Jangan memanggil /attendance/ingest dari browser pengguna kecuali backend
   dan pemilik perangkat secara eksplisit menetapkannya sebagai client resmi.

Validasi:
- Jalankan seluruh test case absensi yang relevan pada UAT checklist:
  status, terlambat WIB, check-out, multi-device, manual, correction,
  admin review, duplicate, dan role scope.
```

## Prompt 11 — Fingerprint dan gateway

```text
Prasyarat wajib:
- Pemilik alur fingerprint sudah menetapkan apakah client-nya perangkat,
  gateway, admin tool, atau SPA.
- Keamanan endpoint dan path sudah diselaraskan antara backend dan OpenAPI.

Tugas:
1. Verifikasi path aktual /api/v1/fingerprint/* terhadap kontrak final.
2. Verifikasi apakah endpoint boleh tanpa session/CSRF.
3. Jangan expose enrollment atau raw fingerprint capture ke user umum.
4. Jika SPA bukan client resmi, jangan menambah feature frontend.
5. Jika SPA client resmi, buat API layer terisolasi, validasi ukuran binary,
   dan tampilkan error gateway tanpa membocorkan data biometrik.
6. Untuk SSE stream, tangani reconnect, abort, lifecycle, dan cleanup.
7. Jangan menaruh fingerprint template atau API key di localStorage/bundle.

Validasi:
- Hanya uji dengan data biometrik sintetis/lingkungan yang disetujui.
- Catat keputusan security dan bukti boundary.
```

## Prompt 12 — Contract, integration, E2E, dan UAT

```text
Konteks:
- Domain telah diintegrasikan secara bertahap.
- Absensi/fingerprint hanya dihitung jika gate-nya sudah terpenuhi.
- Tidak boleh ada klaim Pass tanpa bukti eksekusi.

Tugas:
1. Validasi request/response frontend terhadap OpenAPI versi yang sama dengan
   backend.
2. Tambahkan/rapikan test client, auth provider, query/mutation kritis, dan
   domain yang sudah aktif.
3. Jalankan:
   - npm run lint
   - npm run build
   - test runner frontend yang disepakati
   - contract/integration test yang tersedia
   - E2E auth dan vertical slice prioritas
4. Uji:
   - login/logout/session expired,
   - CSRF invalid,
   - role scope,
   - pagination/filter,
   - loading/empty/error/retry,
   - mutation double-submit,
   - browser refresh,
   - network failure.
5. Update UAT checklist dengan status aktual Not Run/Pass/Fail/Blocked,
   command, timestamp, environment, dan bukti.
6. Pisahkan kegagalan frontend, backend, environment, dan kontrak.

Output:
- Laporan test yang dapat direproduksi.
- Daftar defect dengan severity dan owner.
- Daftar item yang masih Blocked.

Stop condition:
- Jangan lanjut release bila ada Blocker/Critical atau contract test gagal.
```

## Prompt 13 — Cutover mock dan release readiness

```text
Prasyarat:
- Prompt 12 selesai dan acceptance criteria domain prioritas terpenuhi.

Tugas:
1. Cari seluruh mock/local data yang masih menjadi source of truth pada domain
   yang sudah aktif dan migrasikan atau isolasikan.
2. Pastikan tidak ada fetch langsung di komponen di luar API layer.
3. Pastikan environment production tidak memakai secret frontend.
4. Pastikan error global, logging client, request correlation, dan monitoring
   tidak membocorkan password, cookie, CSRF, token, atau data biometrik.
5. Dokumentasikan rollback ke commit sebelum cutover.
6. Dokumentasikan endpoint aktif dan endpoint yang masih blocked.
7. Update WBS, API documentation, UAT, dan decision log dengan status aktual.
8. Jalankan build/lint/test final dan simpan output sebagai bukti release.
9. Lakukan smoke test login → modul prioritas → logout pada environment
   deployment yang sebenarnya.

Definition of Done:
- Tidak ada mock sebagai source of truth pada domain release.
- Auth/session/CSRF berjalan pada browser target.
- Contract test dan test prioritas hijau.
- UAT Must tidak memiliki Blocker/Critical.
- Rollback dan known limitations terdokumentasi.
- Tidak ada endpoint/role/aturan bisnis yang hanya dibuat berdasarkan asumsi.
```

## 3. Checklist status eksekusi

| Tahap | Status | Bukti/tautan | Blocker |
| --- | --- | --- | --- |
| Prompt 0 — Baseline | Belum | — | — |
| Prompt 1 — Keputusan kontrak | Selesai — gate disetujui | [14-prompt-1-decision-gate.md](./14-prompt-1-decision-gate.md) | Detail origin/allowlist konkret wajib diisi sebelum uji browser |
| Prompt 2 — API client/types | Terbuka | — | Gunakan keputusan gate; jangan integrasikan absensi/fingerprint |
| Prompt 3 — Auth/session | Belum | — | — |
| Prompt 4 — Server-state | Belum | — | — |
| Prompt 5 — Master/admin | Belum | — | — |
| Prompt 6 — Jadwal | Belum | — | — |
| Prompt 7 — Quiz/bank soal | Belum | — | — |
| Prompt 8 — Tugas/assessment/report/konseling | Belum | — | — |
| Prompt 9 — Aptitude/passing grade/notifikasi | Belum | — | — |
| Prompt 10 — Absensi | Blocked sampai backend aktif | — | `API-ABS-*` belum di router |
| Prompt 11 — Fingerprint | Blocked sampai keputusan boundary | — | Security/path/client belum final |
| Prompt 12 — Testing/UAT | Belum | — | Tahap implementasi |
| Prompt 13 — Cutover/release | Belum | — | Tahap sebelumnya |

