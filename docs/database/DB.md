# DB — Usulan Skema Database LIMEN (PostgreSQL)

- **Status dokumen:** Draft usulan untuk ditinjau tim backend (**belum disetujui**)
- **Versi:** 0.1
- **Tanggal:** 2026-10-11
- **Stack target:** Go + PostgreSQL (rencana proyek, [AGENTS.md](../../AGENTS.md))
- **Dokumen terkait:** [05-sdd.md §15–§17](../05-sdd.md) · [06-api-documentation.md](../06-api-documentation.md) · [openapi.yaml](../openapi.yaml) · [09-decision-log.md](../09-decision-log.md) · [03-srs.md](../03-srs.md)

> **Peringatan status.** Dokumen ini adalah **usulan skema**, bukan migrasi siap pakai. Turunan dari SDD §15 (desain konseptual) + kontrak API (Proposed). **Belum ada** SQL migration, **belum** ada tabel berjalan, dan **tidak ada** perubahan kode/dependensi (sesuai [AGENTS.md](../../AGENTS.md)). Semua entitas eksisting berstatus **Proposed** kecuali ditandai sumber **Confirmed**.

## 1. Cara Membaca

- Sintaks di §4 memakai **DBML (Database Markup Language)** — dapat langsung ditempel ke [dbdiagram.io](https://dbdiagram.io) atau `dbdocs.io` untuk dirender sebagai diagram.
- Setiap tabel memiliki **Note** berisi dasar keberadaan (ID requirement) dan status (`Confirmed` kebutuhan / `Proposed`).
- Status diambil dari SDD §15.2/§17.1. Penandaan `Confirmed` di sini berarti **kebutuhan bisnis** terkonfirmasi, **bukan** bahwa skema kolomnya disetujui.
- Kolom yang **tidak** ada di SDD §15.3 tetapi **diperlukan kontrak API** ditandai di Note tabel (`Proposed (dari kontrak API)`).

## 2. Konvensi Skema (ikuti SDD §15.1)

| Aspek | Ketentuan | Status |
| --- | --- | --- |
| Nama tabel | `snake_case`, jamak (`users`, `attendance_records`) | Proposed |
| Primary key | `uuid` default `gen_random_uuid()`; `bigint identity` untuk tabel append-only bervolume (`attendance_events`, `audit_logs`) | Proposed |
| Timestamp | `created_at`, `updated_at timestamptz not null default now()` | Proposed |
| Audit kolom | `created_by`, `updated_by` pada entitas yang diedit manusia | Proposed |
| Waktu lokal | Simpan `timestamptz` (UTC internal); `timezone` acuan = `Asia/Jakarta` | Confirmed (BR-12) |
| Enum | Postgres enum untuk himpunan tetap; lookup table untuk peran (`roles`) | Proposed (DB-04) |
| Soft-delete | `deleted_at` hanya bila requirement menuntut | TBD |
| Email unik | `citext` (perlu extension `citext`) **atau** unique index pada `lower(email)` | Proposed |

## 3. Daftar Entitas & Dasar (SDD §15.2/§15.4)

| # | Tabel | Dasar | Status |
| --- | --- | --- | --- |
| 1 | `users` | BR-01, FR-AUTH-001, DR-001 | Confirmed (kebutuhan) |
| 2 | `roles` | 5 peran, DEC-07 | Confirmed (peran) |
| 3 | `user_roles` | Peran ganda, ADR-013 | Proposed |
| 4 | `students` | DR-002 | Confirmed (kebutuhan) |
| 5 | `teachers` | DR-002, BR-13 | Proposed |
| 6 | `classes` | DR-002, FEAT-WALI-01 | Confirmed (kebutuhan) |
| 7 | `subjects` | DR-002 | Confirmed (kebutuhan) |
| 8 | `teaching_assignments` | BR-14/DEC-07 | Proposed |
| 9 | `schedules` | DR-004, FR-JADWAL-001 | Confirmed (kebutuhan) |
| 10 | `school_settings` | FR-ABS-010, DEC-02 | Confirmed |
| 11 | `devices` | BR-11, DEC-04 | Confirmed (kebutuhan) |
| 12 | `biometric_identities` | FR-ABS-006 | Proposed |
| 13 | `attendance_events` | FR-ABS-006, ADR-014 | Proposed |
| 14 | `attendance_records` | FR-ABS-001..013, NFR-DATA-001 | Confirmed (kebutuhan) |
| 15 | `attendance_corrections` | FR-ABS-004, DEC-03 | Proposed |
| 16 | `audit_logs` | BR-09, ADR-016 | Proposed |
| 17 | `sessions` | ADR-007 | Proposed |
| 18 | `notifications` | FR-NOTIF-001, DEC-12 | Proposed |
| 19 | `assessments` | DR-005, FR-NILAI-001 | Proposed |
| 20 | `assessment_scores` | DR-005 | Proposed |
| 21 | `assignments` | DR-007, FR-TUGAS-001 | Proposed |
| 22 | `assignment_submissions` | DR-007 | Proposed |
| 23 | `question_banks` | DR-006, FR-BANK-001 | Proposed |
| 24 | `questions` | DR-006, FR-BANK-002 | Proposed |
| 25 | `quizzes` | DR-006, FR-QUIZ-001 | Proposed |
| 26 | `quiz_questions` | FR-QUIZ-001 (kontrak API) | Proposed (**DB-05**) |
| 27 | `quiz_attempts` | FR-QUIZ-002 | Proposed |
| 28 | `quiz_answers` | FR-QUIZ-001, FR-KORESI-001 | Proposed |
| 29 | `counseling_notes` | DR-008, FR-KONSELING-001 | Proposed |
| 30 | `counseling_followups` | FR-KONSELING-002 | Proposed |
| 31 | `aptitude_results` | DR-009, FR-MB-001 | Proposed |
| 32 | `target_majors` | DR-009, FR-MB-002 | Proposed |
| 33 | `passing_grades` | FR-PG-001, DEC-10 | Proposed |

> Tidak ada tabel tanpa dasar (SDD §17.1). `quiz_questions` (#26) **tidak** tercantum di SDD §15.4 namun implisit dari `GET /quizzes/{quizId}` yang mengembalikan daftar soal; dicatat sebagai usulan (**DB-05**) menunggu keputusan tim.

## 4. Skema DBML

```dbml
//////////
// LIMEN (Sistem Absensi Terintegrasi) — Usulan Skema PostgreSQL
// Sintaks: DBML (dbdiagram.io). Status: Draft usulan (belum disetujui).
//////////

// ---------- ENUM ----------

Enum user_status {
  active
  inactive
}

Enum subject_type {
  student
  teacher
}

Enum attendance_status {
  hadir
  terlambat
  izin
  sakit
  alpa
}

Enum attendance_source {
  device
  manual
  correction
}

Enum attendance_event_type {
  check_in
  check_out
}

Enum correction_status {
  pending
  approved
  rejected
}

Enum schedule_kind {
  pelajaran
  ujian
  tryout
}

Enum question_type {
  pilihan_ganda
  pilihan_ganda_kompleks
  benar_salah
  rentang_nilai
  essay
}

Enum question_bank_scope {
  latihan
  ujian
}

Enum quiz_attempt_status {
  in_progress
  submitted
  graded
}

// ---------- AUTH & IDENTITAS ----------

Table users {
  id uuid [pk, default: `gen_random_uuid()`]
  email citext [not null, unique, note: 'unik case-insensitive (citext atau lower() index)']
  password_hash text [not null, note: 'Argon2id (DEC-05)']
  full_name text [not null]
  status user_status [not null, default: 'active']
  last_login_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Note: 'BR-01, FR-AUTH-001, DR-001. Confirmed (kebutuhan).'
}

Table roles {
  code text [pk, note: 'siswa, guru_mapel, guru_wali, guru_bk, admin']
  name text [not null]

  Note: '5 peran (DEC-07). Seed idempoten. Lookup table (DB-04).'
}

Table user_roles {
  user_id uuid [not null]
  role_code text [not null]
  granted_at timestamptz [not null, default: `now()`]
  granted_by uuid

  indexes {
    (user_id, role_code) [pk]
    user_id
  }

  Note: 'ADR-013. Peran ganda (Guru Mapel + Wali). Proposed (SDD-OI-07/DB-01).'
}

Table sessions {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  token_hash text [not null, unique, note: 'hash token sesi; nilai mentah tidak disimpan']
  created_at timestamptz [not null, default: `now()`]
  last_seen_at timestamptz
  expires_at timestamptz [not null]
  revoked_at timestamptz
  ip inet
  user_agent text

  indexes {
    user_id
    expires_at
  }

  Note: 'ADR-007. Idle 30 mnt / absolut 12 jam (DEC-05). Reset password mencabut semua sesi.'
}

// ---------- DATA AKADEMIK ----------

Table students {
  user_id uuid [pk, note: '1:1 dengan users']
  nis text [not null, unique]
  class_id uuid
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Note: 'DR-002. Confirmed (kebutuhan). class_id nullable sampai penempatan.'
}

Table teachers {
  user_id uuid [pk, note: '1:1 dengan users']
  nip text [unique]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Note: 'DR-002; guru ikut absen (BR-13). Proposed.'
}

Table classes {
  id uuid [pk, default: `gen_random_uuid()`]
  name text [not null]
  level text
  homeroom_teacher_user_id uuid
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    homeroom_teacher_user_id
  }

  Note: 'DR-002; wali kelas (FEAT-WALI-01). Confirmed (kebutuhan).'
}

Table subjects {
  id uuid [pk, default: `gen_random_uuid()`]
  code text [not null, unique]
  name text [not null]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Note: 'DR-002. Confirmed (kebutuhan).'
}

Table teaching_assignments {
  id uuid [pk, default: `gen_random_uuid()`]
  teacher_user_id uuid [not null]
  subject_id uuid [not null]
  class_id uuid [not null]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (teacher_user_id, subject_id, class_id) [unique]
  }

  Note: 'Cakupan Guru Mapel (BR-14/DEC-07). Proposed.'
}

Table schedules {
  id uuid [pk, default: `gen_random_uuid()`]
  class_id uuid [not null]
  subject_id uuid [not null]
  teacher_user_id uuid
  day_of_week smallint [not null, note: 'CHECK 1..7']
  start_time time [not null]
  end_time time [not null]
  kind schedule_kind [not null]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (class_id, day_of_week)
  }

  Note: 'DR-004, FR-JADWAL-001. CHECK start_time < end_time. Bentrok jadwal = TBD (K-05). Confirmed (kebutuhan).'
}

// ---------- ABSENSI ----------

Table school_settings {
  id smallint [pk, note: 'singleton; CHECK id = 1']
  first_entry_time time [not null, note: 'jam masuk pertama acuan keterlambatan']
  timezone text [not null, default: 'Asia/Jakarta', note: 'tidak diubah klien (BR-12)']
  late_tolerance_minutes integer [not null, default: 0, note: 'CHECK >= 0; dipakai? (K-11)']
  updated_by uuid
  updated_at timestamptz [not null, default: `now()`]

  Note: 'FR-ABS-010, DEC-02. Confirmed. Perubahan tidak menghitung ulang historis (K-04).'
}

Table devices {
  id uuid [pk, default: `gen_random_uuid()`]
  name text [not null]
  location text
  serial text [unique]
  is_active boolean [not null, default: true]
  credential_ref text [note: 'referensi rahasia, bukan nilai; tidak pernah direspons']
  last_seen_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Note: 'BR-11, DEC-04. Confirmed (kebutuhan); skema Proposed. Format kredensial TBD (SDD-OI-02).'
}

Table biometric_identities {
  id uuid [pk, default: `gen_random_uuid()`]
  identifier text [not null, note: 'sidik jari; UNIQUE global (DB-02/SDD-OI-08)']
  subject_user_id uuid [not null]
  subject_type subject_type [not null]
  is_active boolean [not null, default: true]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    identifier [unique]
    subject_user_id
  }

  Note: 'FR-ABS-006. Proposed. Global vs per-device = TBD (SDD-OI-08).'
}

Table attendance_events {
  id bigint [pk, increment, note: 'append-only / imutabel']
  device_id uuid [not null]
  identifier text [not null]
  subject_user_id uuid [note: 'null bila pemetaan tidak ditemukan']
  event_type attendance_event_type [not null]
  occurred_at timestamptz [not null]
  received_at timestamptz [not null, default: `now()`]
  raw_payload jsonb

  indexes {
    (device_id, identifier, occurred_at, event_type) [unique, note: 'idempotensi ingestion']
    occurred_at
    subject_user_id
  }

  Note: 'FR-ABS-006, ADR-014. Proposed. Retensi mentah = TBD (DR-003/DEC-11).'
}

Table attendance_records {
  id uuid [pk, default: `gen_random_uuid()`]
  subject_user_id uuid [not null]
  subject_type subject_type [not null]
  attendance_date date [not null, note: 'dihitung dalam WIB (Asia/Jakarta)']
  check_in_at timestamptz
  check_out_at timestamptz
  status attendance_status [not null]
  source attendance_source [not null, default: 'device']
  check_in_device_id uuid
  check_out_device_id uuid
  late_minutes integer [note: 'CHECK >= 0; turunan (Proposed)']
  note text [note: 'Proposed (dari kontrak API-ABS-004)']
  created_by uuid
  updated_by uuid
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (subject_user_id, attendance_date) [unique, note: 'NFR-DATA-001']
    (attendance_date, status)
    status
  }

  Note: 'FR-ABS-001..013. Confirmed (kebutuhan). check_in_at null = tanda merah (BR-10).'
}

Table attendance_corrections {
  id uuid [pk, default: `gen_random_uuid()`]
  attendance_record_id uuid [not null]
  requested_by uuid [not null]
  reason text [not null]
  old_status attendance_status
  new_status attendance_status [not null]
  status correction_status [not null, default: 'pending']
  review_note text [note: 'Proposed (dari kontrak API-ABS-007/008)']
  reviewed_by uuid
  reviewed_at timestamptz
  created_at timestamptz [not null, default: `now()`]

  indexes {
    attendance_record_id
    status
  }

  Note: 'FR-ABS-004, BR-07, DEC-03. Proposed. pending tidak mengubah rekap resmi.'
}

// ---------- AUDIT & NOTIFIKASI ----------

Table audit_logs {
  id bigint [pk, increment, note: 'append-only; tidak di-update/delete']
  actor_user_id uuid
  entity_type text [not null]
  entity_id text [not null]
  action text [not null]
  before_data jsonb
  after_data jsonb
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (entity_type, entity_id)
    created_at
  }

  Note: 'BR-09, ADR-016, NFR-OBS-001. Proposed. Retensi >= 1 tahun (DEC-11).'
}

Table notifications {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  type text [not null, note: 'katalog type = TBD (K-13)']
  payload jsonb
  read_at timestamptz
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, read_at)
  }

  Note: 'FR-NOTIF-001, DEC-12. Proposed. Kanal eksternal di luar lingkup awal.'
}

// ---------- PENILAIAN ----------

Table assessments {
  id uuid [pk, default: `gen_random_uuid()`]
  class_id uuid [not null]
  subject_id uuid [not null]
  teacher_user_id uuid [not null]
  kind text [not null, note: 'jenis penilaian; katalog TBD']
  kkm numeric [note: 'CHECK >= 0; sumber KKM per mapel/sekolah (DEC-10)']
  is_remedial boolean [not null, default: false, note: 'FR-KORESI-002; detail TBD (DEC-09)']
  period text [not null, note: 'mis. 2026-Ganjil']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (class_id, subject_id, period)
  }

  Note: 'DR-005, FR-NILAI-001. Proposed.'
}

Table assessment_scores {
  id uuid [pk, default: `gen_random_uuid()`]
  assessment_id uuid [not null]
  student_user_id uuid [not null]
  score numeric [not null]
  updated_by uuid
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (assessment_id, student_user_id) [unique]
  }

  Note: 'DR-005. Proposed. ON DELETE CASCADE dari assessments.'
}

// ---------- TUGAS ----------

Table assignments {
  id uuid [pk, default: `gen_random_uuid()`]
  class_id uuid [not null]
  subject_id uuid [not null]
  teacher_user_id uuid [not null]
  title text [not null]
  description text
  due_at timestamptz [not null]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (class_id, subject_id)
  }

  Note: 'DR-007, FR-TUGAS-001. Proposed.'
}

Table assignment_submissions {
  id uuid [pk, default: `gen_random_uuid()`]
  assignment_id uuid [not null]
  student_user_id uuid [not null]
  submitted_at timestamptz
  score numeric
  note text
  graded_by uuid
  graded_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (assignment_id, student_user_id) [unique]
  }

  Note: 'DR-007. Proposed. ON DELETE CASCADE dari assignments.'
}

// ---------- BANK SOAL & QUIZ ----------

Table question_banks {
  id uuid [pk, default: `gen_random_uuid()`]
  subject_id uuid [not null]
  owner_id uuid [not null]
  scope question_bank_scope [not null]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Note: 'DR-006, FR-BANK-001/002. Proposed.'
}

Table questions {
  id uuid [pk, default: `gen_random_uuid()`, note: 'tipe id vs integer: lihat DB-06']
  bank_id uuid [not null]
  type question_type [not null]
  body text [not null]
  options jsonb [note: 'bentuk per tipe = TBD (K-06)']
  answer_key jsonb [note: 'tidak pernah dikirim ke siswa']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    bank_id
  }

  Note: 'DR-006, FR-BANK-002 (5 tipe paralel src/features/quiz/types.ts). Proposed.'
}

Table quizzes {
  id uuid [pk, default: `gen_random_uuid()`]
  subject_id uuid [not null]
  owner_id uuid [not null]
  title text [not null]
  description text
  published_at timestamptz
  start_time timestamptz
  end_time timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Note: 'DR-006, FR-QUIZ-001. start_time/end_time dari kontrak API (Proposed).'
}

Table quiz_questions {
  quiz_id uuid [not null]
  question_id uuid [not null]
  question_number integer [not null, note: 'urutan tampil dalam quiz']

  indexes {
    (quiz_id, question_id) [pk]
    (quiz_id, question_number) [unique]
  }

  Note: 'Proposed (DB-05). Diperlukan agar GET /quizzes/{quizId} mengembalikan soal; tidak tercantum di SDD §15.4. Versi soal = TBD (K-07).'
}

Table quiz_attempts {
  id uuid [pk, default: `gen_random_uuid()`]
  quiz_id uuid [not null]
  student_user_id uuid [not null]
  started_at timestamptz [not null, default: `now()`]
  submitted_at timestamptz
  status quiz_attempt_status [not null, default: 'in_progress']
  score numeric
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (quiz_id, student_user_id)
  }

  Note: 'FR-QUIZ-002. Proposed. Satu attempt aktif per siswa/quiz = usulan (belum final).'
}

Table quiz_answers {
  id uuid [pk, default: `gen_random_uuid()`]
  attempt_id uuid [not null]
  question_id uuid [not null]
  answer jsonb [note: 'number | number[] | boolean | boolean[] | string | null']
  is_correct boolean
  score numeric
  feedback text
  graded_by uuid
  graded_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (attempt_id, question_id) [unique]
  }

  Note: 'FR-QUIZ-001, FR-KORESI-001. Proposed. Autosave (API-QZ-004) dan koreksi (API-KOR-001).'
}

// ---------- KONSELING & MINAT BAKAT ----------

Table counseling_notes {
  id uuid [pk, default: `gen_random_uuid()`]
  student_user_id uuid [not null]
  author_id uuid [not null]
  note text [not null]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    student_user_id
  }

  Note: 'DR-008, FR-KONSELING-001. Proposed.'
}

Table counseling_followups {
  id uuid [pk, default: `gen_random_uuid()`]
  note_id uuid [not null]
  note text [not null]
  created_by uuid [not null]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    note_id
  }

  Note: 'FR-KONSELING-002. Proposed. ON DELETE CASCADE dari counseling_notes.'
}

Table aptitude_results {
  id uuid [pk, default: `gen_random_uuid()`]
  student_user_id uuid [not null]
  result text [not null]
  assessed_at timestamptz [not null]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    student_user_id
  }

  Note: 'DR-009, FR-MB-001. Proposed.'
}

Table target_majors {
  id uuid [pk, default: `gen_random_uuid()`]
  student_user_id uuid [not null]
  major text [not null]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    student_user_id
  }

  Note: 'DR-009, FR-MB-002. Proposed.'
}

Table passing_grades {
  id uuid [pk, default: `gen_random_uuid()`]
  university text [not null]
  major text [not null]
  score numeric [not null]
  year integer [not null]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (university, major, year)
  }

  Note: 'FR-PG-001. Data referensi dikelola Admin (DEC-10). Proposed.'
}

// ---------- RELASI (FK) ----------

Ref: user_roles.user_id > users.id
Ref: user_roles.role_code > roles.code
Ref: user_roles.granted_by > users.id
Ref: sessions.user_id > users.id

Ref: students.user_id - users.id
Ref: students.class_id > classes.id
Ref: teachers.user_id - users.id
Ref: classes.homeroom_teacher_user_id > users.id
Ref: teaching_assignments.teacher_user_id > users.id
Ref: teaching_assignments.subject_id > subjects.id
Ref: teaching_assignments.class_id > classes.id
Ref: schedules.class_id > classes.id
Ref: schedules.subject_id > subjects.id
Ref: schedules.teacher_user_id > users.id

Ref: school_settings.updated_by > users.id
Ref: biometric_identities.subject_user_id > users.id
Ref: attendance_events.device_id > devices.id
Ref: attendance_events.subject_user_id > users.id
Ref: attendance_records.subject_user_id > users.id
Ref: attendance_records.check_in_device_id > devices.id
Ref: attendance_records.check_out_device_id > devices.id
Ref: attendance_records.created_by > users.id
Ref: attendance_records.updated_by > users.id
Ref: attendance_corrections.attendance_record_id > attendance_records.id
Ref: attendance_corrections.requested_by > users.id
Ref: attendance_corrections.reviewed_by > users.id

Ref: audit_logs.actor_user_id > users.id
Ref: notifications.user_id > users.id

Ref: assessments.class_id > classes.id
Ref: assessments.subject_id > subjects.id
Ref: assessments.teacher_user_id > users.id
Ref: assessment_scores.assessment_id > assessments.id
Ref: assessment_scores.student_user_id > users.id
Ref: assessment_scores.updated_by > users.id
Ref: assignments.class_id > classes.id
Ref: assignments.subject_id > subjects.id
Ref: assignments.teacher_user_id > users.id
Ref: assignment_submissions.assignment_id > assignments.id
Ref: assignment_submissions.student_user_id > users.id
Ref: assignment_submissions.graded_by > users.id

Ref: question_banks.subject_id > subjects.id
Ref: question_banks.owner_id > users.id
Ref: questions.bank_id > question_banks.id
Ref: quizzes.subject_id > subjects.id
Ref: quizzes.owner_id > users.id
Ref: quiz_questions.quiz_id > quizzes.id
Ref: quiz_questions.question_id > questions.id
Ref: quiz_attempts.quiz_id > quizzes.id
Ref: quiz_attempts.student_user_id > users.id
Ref: quiz_answers.attempt_id > quiz_attempts.id
Ref: quiz_answers.question_id > questions.id
Ref: quiz_answers.graded_by > users.id

Ref: counseling_notes.student_user_id > users.id
Ref: counseling_notes.author_id > users.id
Ref: counseling_followups.note_id > counseling_notes.id
Ref: counseling_followups.created_by > users.id
Ref: aptitude_results.student_user_id > users.id
Ref: target_majors.student_user_id > users.id
```

## 5. Catatan Relasi & Integritas

- **FK & penghapusan:** `ON DELETE RESTRICT` untuk data referensial (`users`, `devices`, `classes`, `subjects`); `ON DELETE CASCADE` hanya untuk anak murni (`assessment_scores`, `assignment_submissions`, `quiz_answers`, `counseling_followups`) sesuai SDD §16.3.
- **Idempotensi ingestion:** UNIQUE `(device_id, identifier, occurred_at, event_type)` pada `attendance_events` (SDD §16.2/§16.3).
- **Satu rekaman per subjek per hari:** UNIQUE `(subject_user_id, attendance_date)` pada `attendance_records` (NFR-DATA-001).
- **Imutabilitas:** `attendance_events` dan `audit_logs` append-only; koreksi tidak mengubah event, hanya `attendance_records` + `audit_logs` (ADR-014/ADR-016).
- **Waktu:** semua timestamp `timestamptz`; `attendance_date` dihitung dari `occurred_at` dalam `Asia/Jakarta` (BR-12).
- **Transaksi penting** (SDD §16.2): ingestion (upsert), persetujuan koreksi (`SELECT ... FOR UPDATE` → update → audit), reset password (update hash → revoke sesi → audit), ubah pengaturan (update → audit).

## 6. Keputusan yang Perlu Ditinjau Tim Backend

Dipetakan ke isu yang sudah ada (SDD §17, §18) dan tambahan baru dari penurunan kontrak API.

| ID | Keputusan | Terkait | Dampak bila tidak diputuskan |
| --- | --- | --- | --- |
| DB-01 / SDD-OI-07 | Peran: `user_roles` M:N (ADR-013) vs kolom `role` tunggal di `users`. | `users`, `roles`, `user_roles` | Integritas otorisasi & kompleksitas query. |
| DB-02 / SDD-OI-08 | Identitas fingerprint: UNIQUE(`identifier`) global vs UNIQUE(`device_id`,`identifier`). | `biometric_identities`, BR-11 | Menentukan apakah template per-device perlu tabel tambahan. |
| DB-03 / SDD-OI-02 | Format kredensial & payload ingestion perangkat (XC-Device-Key, versi payload). | `devices.credential_ref`, `attendance_events.raw_payload` | Keamanan & idempotensi ingestion tidak terjamin. |
| DB-04 | Enum Postgres vs lookup table untuk himpunan status. | semua enum | Migrasi enum lebih kaku; lookup lebih fleksibel. |
| DB-05 | Perlukah tabel penghubung `quiz_questions`; apakah soal di-*snapshot* per quiz. | `quizzes`, `questions`, FR-QUIZ-001 | Struktur quiz tidak dapat direpresentasikan tanpa keputusan ini. |
| DB-06 | Tipe `questions.id`: `uuid` (SDD §15.4) vs `integer` (kontrak API & `src/features/quiz/types.ts`). | API-QZ-002/004, FR-BANK-002 | Tipe id tidak konsisten antara skema & kontrak. |
| DB-07 | Kebijakan versi soal (K-07): perubahan/hapus soal yang sudah dipakai attempt. | `questions`, `quiz_answers` | Nilai/riwayat berubah tanpa jejak. |
| DB-08 | Kolom `attendance_records.note` & `attendance_corrections.review_note` (implisit dari API). | API-ABS-004/007/008 | Kontrak tidak dapat dipetakan utuh ke skema. |
| DR-003 / DEC-11 | Retensi & partisi `attendance_events`/`audit_logs`; pembersihan event mentah. | `attendance_events`, `audit_logs` | Volume data & kepatuhan. |
| DR-005 | Skema penilaian generik vs per-jenis; lokasi `kkm` (DEC-10). | `assessments`, `assessment_scores` | Fleksibilitas vs kesederhanaan. |
| DEC-10 | Sumber KKM (per mapel vs sekolah) → lokasi kolom. | `assessments.kkm` | Nilai KKM tidak konsisten. |
| NFR-DATA-001 | Definisi "hari" untuk shift malam/ekstrakurikuler → batas `attendance_date`. | `attendance_records` | Salah hitung hari absensi. |
| K-11 | Apakah `late_tolerance_minutes` benar-benar dipakai. | `school_settings` | Perbedaan perhitungan keterlambatan FE/BE. |
| K-13 | Katalog `notifications.type` dan siapa penghasilnya. | `notifications` | Kontrak `payload`/`type` tidak jelas. |

## 7. Catatan Konsistensi

- Sumber utama: SDD §15 (entitas inti & §15.4 akademik) + kontrak API ([06](../06-api-documentation.md)/[openapi.yaml](../openapi.yaml)). Field yang hanya berasal dari kontrak API ditandai `Proposed (dari kontrak API)`.
- **Selaras:** enum peran/status mengikuti §2.11 API & DEC-01/02; tipe soal selaras `src/features/quiz/types.ts`; WIB selaras BR-12/ADR-011; penamaan tabel/kolom selaras konvensi SDD §15.1.
- **Tidak diklaim:** tidak ada migration/SQL yang dijalankan; tidak ada tabel dibuat; tidak ada perubahan kode, dependensi, atau konfigurasi build.
- **Diverifikasi ulang:** setelah kontrak API `Approved`, dokumen ini menyesuaikan nama field & tipe (mis. DB-06) dan menjadi basis migrasi WBS-P3-01.

## 8. Riwayat Dokumen

| Versi | Tanggal | Perubahan |
| --- | --- | --- |
| 0.1 | 2026-10-11 | Usulan awal skema DBML dari SDD §15 + kontrak API (Proposed). |
