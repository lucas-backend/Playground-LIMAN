# 03 — SRS: LIMEN (Software Requirements Specification)

- **Status dokumen:** Draft untuk ditinjau (belum disetujui penuh)
- **Versi:** 0.1
- **Tanggal:** 2026-10-11
- **Struktur:** Terinspirasi praktik IEEE 29148. Dokumen ini **belum** diklaim sepenuhnya memenuhi standar tersebut (tidak semua ketentuan diverifikasi).
- **Dokumen terkait:** [00-project-audit.md](./00-project-audit.md) · [01-project-overview.md](./01-project-overview.md) · [02-prd.md](./02-prd.md)

## Konvensi

**Status requirement:** `Confirmed` (dikonfirmasi stakeholder/kode), `Proposed` (usulan, belum disetujui), `TBD` (belum dapat ditentukan). **Prioritas:** Must / Should / Could (MoSCoW). **Verifikasi:** Review, Demo, Test, Analysis. Nilai yang belum tersedia ditandai `TBD` dan **tidak dikarang**.

## 1. Introduction

### 1.1 Purpose
Menjabarkan kebutuhan fungsional dan nonfungsional LIMEN sebagai acuan desain teknis (Fase D) dan pengujian (Fase G).

### 1.2 Scope
Aplikasi web absensi terintegrasi untuk sekolah dengan lima peran: Siswa, Guru Mata Pelajaran, Guru Wali, Guru BK, Admin Sekolah. Absensi direkam via perangkat IoT fingerprint; guru dapat menetapkan status manual bila siswa belum tercatat. Batasan teknis: hanya frontend yang ada; backend Go + PostgreSQL direncanakan. **(F)**

### 1.3 Definitions, Acronyms, dan Abbreviations
Lihat `10-glossary.md` (Fase berikutnya). Istilah kunci: **IoT fingerprint** = perangkat pemindai sidik jari; **SIAK/absensi** = pencatatan kehadiran; **Mapel** = mata pelajaran.

### 1.4 References
- `02-prd.md` (dasar fitur), `00-project-audit.md` (bukti kode), `01-project-overview.md` (konteks).
- Standar rujukan: IEEE 29148 (kerangka SRS), WCAG 2.1 (usulan aksesibilitas, status Proposed).

## 2. Overall Description

### 2.1 Product Perspective
Aplikasi web mandiri (greenfield dari sisi backend). Frontend sudah ada namun belum terintegrasi API; autentikasi belum berfungsi (AUD-001). Terlibat sistem eksternal: perangkat IoT fingerprint (mekanisme `TBD`, Q-05).

### 2.2 User Classes and Characteristics

| Kelas pengguna | Deskripsi | Kemampuan teknis (asumsi) |
| --- | --- | --- |
| Siswa | Peserta didik | Rendah–sedang |
| Guru Mata Pelajaran | Mengampu mapel | Sedang |
| Guru Wali | Mengelola wali kelas | Sedang |
| Guru BK | Bimbingan konseling | Sedang |
| Admin Sekolah | Administrasi & data master | Sedang–tinggi |

### 2.3 Operating Environment
Peramban web modern di ponsel (mobile-first, Q konfirmasi desktop); jaringan sekolah; backend Go + PostgreSQL; perangkat IoT fingerprint (protokol `TBD`).

### 2.4 Constraints
- Tidak mengubah source code pada fase dokumentasi.
- Backend/database belum ada; kontrak API belum disetujui.
- Harus mobile-first. **(F)**

### 2.5 Assumptions and Dependencies
- Asumsi: lima peran pada 2.2; absensi adalah fungsi inti.
- Dependensi: kontrak API (Fase E); desain UI/UX (belum tersedia); integrasi IoT.

## 3. Functional Requirements

Kolom **AC** = acceptance criteria yang dapat diuji. **Sumber** mengacu ke ID di `02-prd.md` atau ditandai `Usulan`.

### 3.1 Autentikasi & Otorisasi (AUTH)

| ID | Requirement | Sumber | Prioritas | Status | Verifikasi | AC |
| --- | --- | --- | --- | --- | --- | --- |
| FR-AUTH-001 | Sistem menyediakan login dengan email dan password. | FEAT-AUTH-01, BR-01 | Must | Confirmed | Demo, Test | Login berhasil untuk kredensial valid; gagal untuk invalid dengan pesan error. |
| FR-AUTH-002 | Sistem menyediakan logout yang mengakhiri sesi pengguna. | FEAT-AUTH-04 | Must | Proposed | Demo | Setelah logout, sesi berakhir dan akses halaman terproteksi dialihkan ke login. |
| FR-AUTH-003 | Admin dapat mereset password pengguna. | FEAT-AUTH-02, BR-02 | Must | Confirmed | Demo, Test | Admin dapat memicu reset; pengguna dapat login dengan password baru. |
| FR-AUTH-004 | Sistem membatasi akses halaman berdasarkan peran (route guard + otorisasi backend). | FEAT-AUTH-03, AUD-001 | Must | Proposed | Test | Peran tanpa hak tidak dapat membuka/memanipulasi resource (diverifikasi di backend). |
| FR-AUTH-005 | Sistem menangani sesi kedaluwarsa dengan mengarahkan ulang ke login. | DEC-05 | Must | Proposed | Test | Sesi expiring (idle 30 mnt / absolut 12 jam) → permintaan berikutnya menerima 401 dan di-redirect ke login. |
| FR-AUTH-006 | Form login memvalidasi format email dan wajib isi. | Usulan | Should | Proposed | Test | Input kosong/format salah ditolak dengan pesan validasi. |

### 3.2 Dashboard (DASH)

| ID | Requirement | Sumber | Prioritas | Status | Verifikasi | AC |
| --- | --- | --- | --- | --- | --- | --- |
| FR-DASH-001 | Sistem menampilkan dashboard dengan menu sesuai peran pengguna. | FEAT-DASH-01, AUD-013 | Must | Proposed | Demo | Tiap peran melihat menu yang berbeda sesuai haknya. |

### 3.3 Absensi (ABS)

| ID | Requirement | Sumber | Prioritas | Status | Verifikasi | AC |
| --- | --- | --- | --- | --- | --- | --- |
| FR-ABS-001 | Sistem merekam absen masuk pagi siswa dari perangkat IoT fingerprint saat datang. | FEAT-ABS-01, BR-03 | Must | Confirmed | Demo, Test | Tap pertama pagi tercatat sebagai kehadiran masuk siswa pada tanggal/jam terkait. |
| FR-ABS-002 | Guru dapat menetapkan status absensi siswa yang belum tercatat. | FEAT-ABS-02, BR-04 | Must | Confirmed | Demo, Test | Guru dapat memilih status untuk siswa tanpa catatan IoT; status tersimpan & tampil pada rekap. |
| FR-ABS-003 | Pengguna berwenang dapat melihat riwayat/detail absensi per siswa/kelas. | FEAT-ABS-03 | Must | Proposed | Demo | Rekap menampilkan status per siswa per periode yang dipilih. |
| FR-ABS-004 | Sistem menyediakan koreksi absensi beserta mekanisme persetujuan. | FEAT-ABS-04, BR-07 | Should | Proposed | Analysis, Demo | Mengikuti DEC-03: guru mengajukan, Admin menyetujui; perubahan tercatat (sebelum/sesudah, aktor, waktu, alasan); status menunggu tidak mengubah rekap resmi. |
| FR-ABS-005 | Status kehadiran resmi: Hadir, Terlambat, Izin, Sakit, Alpa. | BR-06 | Must | Confirmed | Review, Test | Hadir bila absen masuk ≤ jam masuk pertama; Terlambat bila melewatinya; Izin/Sakit/Alpa ditetapkan manual. |
| FR-ABS-006 | Sistem menerima dan memproses data dari perangkat IoT. | FEAT-SYS-01 | Must | Proposed | Analysis, Test | Mengikuti DEC-04: endpoint ingestion HTTP+JSON menerima event (device_id, identifier, timestamp, event_type); identifier dipetakan ke siswa. Detail vendor `TBD`. |
| FR-ABS-007 | Sistem merekam absen pulang (check-out) siswa setelah jam pulang via alat absensi. | FEAT-ABS-05, BR-03 | Must | Confirmed | Demo, Test | Tap pulang tercatat sebagai kejadian check-out pada hari yang sama. |
| FR-ABS-008 | Sistem mendukung lebih dari satu alat absensi; siswa dapat absen di alat mana pun. | FEAT-ABS-06, BR-11 | Must | Confirmed | Demo, Test | Tap dari alat berbeda untuk siswa sama tetap tergabung ke satu rekaman harian siswa. |
| FR-ABS-009 | Absensi guru menandai merah siswa yang belum absen masuk pagi. | FEAT-ABS-07, BR-10 | Must | Confirmed | Demo | Siswa tanpa absen masuk ditampilkan merah pada daftar absensi guru. |
| FR-ABS-010 | Admin dapat mengatur jam masuk pertama sebagai acuan keterlambatan. | FEAT-ABS-08, BR-06 | Must | Confirmed | Demo, Test | Perubahan jam masuk oleh Admin mengubah penentuan status Terlambat; contoh nilai 7:15 WIB. |
| FR-ABS-011 | Sistem menggunakan zona waktu WIB (Asia/Jakarta) untuk penilaian keterlambatan. | BR-12 | Must | Confirmed | Review | Absensi dibandingkan terhadap jam masuk dalam WIB. |
| FR-ABS-012 | Guru (Mapel/Wali/BK) dapat absen masuk & pulang melalui alat absensi. | FEAT-ABS-09, BR-13 | Must | Confirmed | Demo, Test | Tap guru tercatat sebagai absensi guru; absen masuk/pulang tersimpan per hari; memakai jam masuk yang sama dan dikenai status Terlambat. |
| FR-ABS-013 | Admin dapat meninjau absensi guru, dengan tanda merah untuk guru yang belum absen masuk. | FEAT-ABS-10, BR-13 | Must | Confirmed | Demo | Admin melihat rekap absensi guru; guru tanpa absen masuk tampil merah. |

### 3.4 Jadwal (JADWAL)

| ID | Requirement | Sumber | Prioritas | Status | Verifikasi | AC |
| --- | --- | --- | --- | --- | --- | --- |
| FR-JADWAL-001 | Sistem menampilkan jadwal pelajaran/ujian/tryout. | FEAT-JADWAL-01 | Should | Proposed | Demo | Jadwal tampil sesuai kelas/periode dan dapat difilter sesuai kebutuhan. |

### 3.5 Quiz & Riwayat (QUIZ)

| ID | Requirement | Sumber | Prioritas | Status | Verifikasi | AC |
| --- | --- | --- | --- | --- | --- | --- |
| FR-QUIZ-001 | Siswa dapat mengerjakan quiz dengan tipe soal yang tersedia. | FEAT-QUIZ-01 | Should | Proposed | Demo, Test | Jawaban tersimpan per butir; navigasi antar butir berfungsi. |
| FR-QUIZ-002 | Siswa dapat melihat hasil & riwayat quiz. | FEAT-QUIZ-02, US-09 | Should | Proposed | Demo | Daftar riwayat dan detail hasil tampil sesuai data. |

### 3.6 Latihan & Bank Soal (LATIHAN/BANKSOAL)

| ID | Requirement | Sumber | Prioritas | Status | Verifikasi | AC |
| --- | --- | --- | --- | --- | --- | --- |
| FR-LATIHAN-001 | Siswa dapat melihat daftar latihan soal per mata pelajaran. | FEAT-LATIHAN-01 | Should | Proposed | Demo | Daftar mapel & soal tampil; navigasi ke detail berfungsi. |
| FR-BANK-001 | Guru dapat membuat/mengubah soal latihan dan ujian. | FEAT-GURU-BANKSOAL-01 | Should | Proposed | Demo, Test | Soal tersimpan; edit memuat data yang benar. |
| FR-BANK-002 | Sistem mendukung beberapa tipe soal (mis. pilihan ganda, ganda, benar/salah, rentang, esai). | Usulan dari kode | Should | Proposed | Demo | Setiap tipe soal dapat ditampilkan dan dijawab sesuai tipenya. |

### 3.7 Tugas, Penilaian, Koreksi (GURU)

| ID | Requirement | Sumber | Prioritas | Status | Verifikasi | AC |
| --- | --- | --- | --- | --- | --- | --- |
| FR-TUGAS-001 | Guru dapat membuat tugas dan menilai pekerjaan siswa. | FEAT-GURU-TUGAS-01 | Should | Proposed | Demo, Test | Tugas tersimpan; nilai siswa dapat diisi dan tersimpan. |
| FR-NILAI-001 | Guru dapat menginput dan melihat rekap penilaian per kelas/siswa. | FEAT-GURU-PENILAIAN-01 | Should | Proposed | Demo | Nilai per siswa/mapel tampil pada rekap. |
| FR-KORESI-001 | Guru dapat mengoreksi jawaban siswa. | FEAT-GURU-KOREKSI-01 | Should | Proposed | Demo | Penilaian per butir tersimpan. |
| FR-KORESI-002 | Remedial sebagai sub-fitur penilaian (asesmen ulang siswa di bawah KKM). | Usulan (placeholder) | Could | Proposed | Demo | Mengikuti DEC-09: guru dapat menandai siswa < KKM dan mencatat nilai remedial; struktur detail `TBD`. |

### 3.8 Rekap & Rapor (REKAP/RAPOT)

| ID | Requirement | Sumber | Prioritas | Status | Verifikasi | AC |
| --- | --- | --- | --- | --- | --- | --- |
| FR-REKAP-001 | Guru BK/Wali dapat melihat rekap absensi per kelas/siswa. | FEAT-BK-02, FEAT-WALI-01 | Must | Proposed | Demo | Rekap tampil sesuai filter periode/kelas. |
| FR-REKAP-002 | Pengguna berwenang dapat melihat rekap nilai. | FEAT-BK-02 | Should | Proposed | Demo | Rekap nilai tampil sesuai kelas/mapel. |
| FR-RAPOT-001 | Guru Wali dapat melihat rapor siswa. | FEAT-WALI-02 | Should | Proposed | Demo | Rapor menampilkan nilai per mapel siswa. |
| FR-RAPOT-002 | Guru Wali dapat melihat detail nilai per mapel. | FEAT-WALI-02 | Should | Proposed | Demo | Detail nilai per mapel tampil benar. |

### 3.9 Konseling (KONSELING)

| ID | Requirement | Sumber | Prioritas | Status | Verifikasi | AC |
| --- | --- | --- | --- | --- | --- | --- |
| FR-KONSELING-001 | Guru BK/Wali dapat mencatat konseling siswa. | FEAT-BK-01, FEAT-WALI-03 | Should | Proposed | Demo, Test | Catatan tersimpan dan tampil pada daftar. |
| FR-KONSELING-002 | Guru dapat menambah tindak lanjut catatan konseling. | FEAT-WALI-03 | Should | Proposed | Demo | Tindak lanjut tersimpan terkait catatan. |

### 3.10 Minat Bakat & Passing Grade (MB/PG)

| ID | Requirement | Sumber | Prioritas | Status | Verifikasi | AC |
| --- | --- | --- | --- | --- | --- | --- |
| FR-MB-001 | Sistem menampilkan hasil minat bakat siswa. | FEAT-BK-03, FEAT-SISWA-01 | Could | Proposed | Demo | Hasil minat bakat tampil sesuai data. |
| FR-MB-002 | Siswa dapat menambah target jurusan lain. | FEAT-SISWA-01 | Could | Proposed | Demo, Test | Target jurusan tersimpan dan tampil. |
| FR-PG-001 | Sistem menampilkan informasi passing grade perguruan tinggi. | FEAT-SISWA-02 | Could | Proposed | Demo | Daftar & detail passing grade tampil. |

### 3.11 Notifikasi (NOTIF)

| ID | Requirement | Sumber | Prioritas | Status | Verifikasi | AC |
| --- | --- | --- | --- | --- | --- | --- |
| FR-NOTIF-001 | Sistem menampilkan daftar notifikasi pengguna. | FEAT-NOTIF-01, Q-09 | Could | Proposed | Demo | Mengikuti DEC-12: notifikasi in-app dengan status baca tersimpan; kanal eksternal di luar lingkup awal. |

### 3.12 Admin (ADMIN)

| ID | Requirement | Sumber | Prioritas | Status | Verifikasi | AC |
| --- | --- | --- | --- | --- | --- | --- |
| FR-ADMIN-001 | Admin dapat mengelola pengguna (peran, status). | FEAT-ADMIN-01 | Must | Proposed | Demo, Test | Perubahan pengguna tersimpan; validasi peran berlaku. |
| FR-ADMIN-002 | Admin dapat mengelola data akademik & jadwal. | FEAT-ADMIN-03 | Should | Proposed | Demo | Data master tersimpan & tampil. |
| FR-ADMIN-003 | Admin dapat melihat presensi & rekap nilai rapor. | FEAT-ADMIN-04 | Should | Proposed | Demo | Rekap tampil sesuai filter. |

## 4. Non-Functional Requirements

| ID | Kategori | Requirement | Prioritas | Status | Verifikasi | Sumber |
| --- | --- | --- | --- | --- | --- | --- |
| NFR-PERF-001 | Performance | Waktu muat halaman utama p95 < 3 dtk (4G); API p95 < 500 ms | Should | Proposed | Test | DEC-06, NFR-P-04, Q-12 |
| NFR-SEC-001 | Security | Semua halaman kecuali login memerlukan autentikasi | Must | Proposed | Test | AC-P-01 |
| NFR-SEC-002 | Security | Otorisasi divalidasi di backend pada setiap permintaan terproteksi | Must | Proposed | Test | AC-P-07, BR-05 |
| NFR-SEC-003 | Security | Password disimpan sebagai hash Argon2id | Must | Proposed | Analysis | DEC-05 |
| NFR-SEC-004 | Security | Rate limiting pada login (proteksi brute-force) | Should | Proposed | Test | DEC-05 |
| NFR-SEC-005 | Security | Transportasi HTTPS; cookie sesi Secure + HttpOnly + SameSite | Must | Proposed | Analysis | DEC-05 |
| NFR-REL-001 | Reliability/Availability | Ketersediaan 99% pada jam sekolah (usulan Sen–Sab 06:00–17:00) | Should | Proposed | Analysis | DEC-06, NFR-P-06 |
| NFR-USE-001 | Usability | Antarmuka mobile-first, tetap fungsional di desktop | Must | Confirmed | Demo | NFR-P-01, Q konfirmasi |
| NFR-USE-002 | Usability | Teks antarmuka berbahasa Indonesia (`html lang="id"`) | Should | Proposed | Review | NFR-P-02, AUD-012 |
| NFR-USE-003 | Accessibility | Target aksesibilitas WCAG 2.1 AA (best-effort) | Should | Proposed | Analysis | DEC-06, NFR-P-05, AUD-012 |
| NFR-MNT-001 | Maintainability | Struktur & penamaan konsisten; tanpa duplikasi berkas identik | Should | Proposed | Review | AUD-008, AUD-009 |
| NFR-MNT-002 | Maintainability | Tersedia automated test (unit/integration) | Should | Proposed | Review | AUD-007 |
| NFR-COM-001 | Compatibility | Peramban: 2 versi terakhir Chrome, Edge, Firefox, Safari (termasuk mobile) | Should | Proposed | Analysis | DEC-06, NFR-P-01 |
| NFR-DATA-001 | Data Integrity | Kehadiran unik per subjek (siswa/guru) per hari (satu absen masuk + satu absen pulang); event dari alat berbeda tidak menduplikasi | Must | Proposed | Test | FR-ABS-001, FR-ABS-008, FR-ABS-012 |
| NFR-OBS-001 | Observability | Jejak audit perubahan absensi/nilai, retensi log ≥ 1 tahun | Should | Proposed | Analysis | DEC-11, NFR-P-07, BR-09 |

## 5. Business Rules

| ID | Aturan | Status | Sumber |
| --- | --- | --- | --- |
| BR-01 | Autentikasi hanya dengan email dan password | Confirmed | 02-prd BR-01 |
| BR-02 | Reset password hanya oleh Admin | Confirmed | 02-prd BR-02 |
| BR-03 | Absensi via IoT fingerprint: absen masuk pagi saat datang, absen pulang setelah jam pulang | Confirmed | 02-prd BR-03 |
| BR-04 | Bila siswa tercatat via IoT, status dari perangkat; guru menetapkan status bila belum tercatat | Confirmed | 02-prd BR-04 |
| BR-05 | Setiap akses wajib tervalidasi otentikasi & otorisasi peran | Proposed | Turunan AUD-001 |
| BR-06 | Status: Hadir, Terlambat, Izin, Sakit, Alpa; Terlambat bila absen masuk melewati jam masuk pertama yang diatur Admin (contoh 7:15 WIB) | Confirmed | 02-prd BR-06 |
| BR-07 | Koreksi absensi: diajukan guru, disetujui Admin; wajib jejak audit; berlaku setelah persetujuan | Proposed | DEC-03 |
| BR-08 | Bukti absensi tambahan (selfie/QR/geofence) di luar lingkup awal; koreksi manual ber-alasan sebagai jalur ganti | Proposed | DEC-04 |
| BR-09 | Retensi data absensi/nilai ≥ masa aktif + arsip (usulan ≥ 5 tahun); log audit ≥ 1 tahun | Proposed | DEC-11 |
| BR-10 | Bila siswa belum absen pagi, nama ditandai merah pada absensi guru | Confirmed | 02-prd BR-10 |
| BR-11 | Terdapat lebih dari satu alat absensi; siswa bebas memilih alat mana pun | Confirmed | 02-prd BR-11 |
| BR-12 | Zona waktu acuan absensi: WIB (Asia/Jakarta) | Confirmed | 02-prd BR-12 |
| BR-13 | Guru (Mapel/Wali/BK) dapat absen masuk & pulang via alat absensi; memakai jam masuk yang sama dengan siswa dan dikenai aturan Terlambat; Admin meninjau absensi guru dan menandai merah guru yang belum absen | Confirmed | 02-prd BR-13 |
| BR-14 | Batas akses data per peran (Siswa=sendiri; Mapel=yang diampu; Wali=kelas perwalian; BK=semua siswa; Admin=semua dalam sekolah) | Proposed | DEC-07 |

## 6. External Interface Requirements

### 6.1 User Interface
| ID | Requirement | Status |
| --- | --- | --- |
| IR-UI-001 | Antarmuka mobile-first dengan design token terpusat (dibuat dulu, siap dikoreksi UI/UX) | Proposed |
| IR-UI-002 | Konsisten lintas halaman; state loading/empty/error ditampilkan | Proposed |

### 6.2 Software Interfaces
| ID | Requirement | Status |
| --- | --- | --- |
| IR-SW-001 | Integrasi perangkat IoT: ingestion HTTP+JSON via gateway/agent, dukungan **banyak perangkat** (DEC-04/DEC-04b); detail vendor/protokol `TBD` | Proposed |
| IR-SW-002 | Tidak ada integrasi sistem eksternal lain yang terverifikasi | Confirmed |

### 6.3 API Interfaces (baseline usulan)
| ID | Requirement | Status |
| --- | --- | --- |
| IR-API-001 | REST berbasis HTTP + JSON, diberi versi (mis. `/api/v1`) | Proposed |
| IR-API-002 | Format error response konsisten (kode + pesan + detail validasi) | Proposed |
| IR-API-003 | Autentikasi API: session cookie (HttpOnly, Secure, SameSite=Lax) + proteksi CSRF (DEC-05) | Proposed |
| IR-API-004 | Kontrak API final disetujui kedua tim sebelum implementasi | Proposed |

## 7. Data Requirements

| ID | Entitas/kebutuhan data | Keterangan | Status |
| --- | --- | --- | --- |
| DR-001 | Pengguna (identitas, email, peran, status) | Peran: 5 kelas pada 2.2 | Proposed |
| DR-002 | Siswa, Kelas, Mata Pelajaran | Relasi siswa–kelas–mapel | Proposed |
| DR-003 | Absensi (subjek siswa/guru, tanggal/jam, status, sumber, device_id, pencatat) | Absen masuk & pulang; banyak alat (BR-11); status sesuai BR-06 (DEC-01); subjek dapat guru (BR-13) | Proposed |
| DR-004 | Jadwal (kelas, mapel, waktu, jenis) | Jam mulai dipakai untuk deteksi keterlambatan (DEC-02) | Proposed |
| DR-005 | Penilaian (siswa, mapel, nilai, periode) | KKM dikonfigurasi per mapel/sekolah (DEC-10) | Proposed |
| DR-006 | Soal & Quiz (tipe, isi, jawaban) | Mendukung tipe soal pada FR-BANK-002 | Proposed |
| DR-007 | Tugas (mapel, tenggat, nilai) | — | Proposed |
| DR-008 | Konseling (siswa, catatan, tindak lanjut) | — | Proposed |
| DR-009 | Minat bakat (hasil, target jurusan) | — | Proposed |
| DR-010 | Timestamp & jejak audit | Retensi log ≥ 1 tahun (DEC-11); bergantung NFR-OBS-001 | Proposed |

Skema rinci PostgreSQL dibahas di `05-sdd.md` (Fase D) dan harus divalidasi tim backend.

## 8. Acceptance Criteria (Tingkat Sistem)

| ID | Kriteria | Terkait |
| --- | --- | --- |
| AC-01 | Tidak ada halaman aplikasi yang dapat diakses tanpa login. | NFR-SEC-001 |
| AC-02 | Setiap peran hanya mengakses fitur sesuai haknya, divalidasi backend. | FR-AUTH-004, NFR-SEC-002 |
| AC-03 | Kehadiran dari IoT tercatat dan tampil pada rekap absensi. | FR-ABS-001, FR-ABS-003 |
| AC-04 | Guru dapat menetapkan status siswa yang belum tercatat. | FR-ABS-002 |
| AC-05 | Admin dapat mereset password pengguna. | FR-AUTH-003 |
| AC-06 | Aplikasi berfungsi pada layar ponsel tanpa kehilangan fungsi. | NFR-USE-001 |
| AC-07 | Siswa tanpa absen pagi tampil merah pada absensi guru. | FR-ABS-009 |
| AC-08 | Tap dari alat absensi berbeda untuk siswa yang sama tergabung ke satu rekaman harian. | FR-ABS-008, NFR-DATA-001 |
| AC-09 | Absen masuk setelah jam masuk pertama yang diatur Admin berstatus Terlambat. | FR-ABS-005, FR-ABS-010 |
| AC-10 | Absen pulang tercatat setelah jam pulang. | FR-ABS-007 |
| AC-11 | Guru dapat absen masuk & pulang dan rekamannya tersimpan per hari. | FR-ABS-012, NFR-DATA-001 |
| AC-12 | Guru yang absen masuk setelah jam masuk berstatus Terlambat. | FR-ABS-012, FR-ABS-005 |
| AC-13 | Admin melihat tanda merah untuk guru yang belum absen masuk. | FR-ABS-013 |

## 9. Requirement Traceability Matrix

Pemetaan: **PRD → SRS Requirement → Business Rule / NFR → Verifikasi**.

| PRD | SRS | BR/NFR terkait | Verifikasi |
| --- | --- | --- | --- |
| FEAT-AUTH-01 | FR-AUTH-001 | BR-01 | Demo, Test |
| FEAT-AUTH-02 | FR-AUTH-003 | BR-02 | Demo, Test |
| FEAT-AUTH-03 | FR-AUTH-004 | BR-05, NFR-SEC-002 | Test |
| FEAT-AUTH-04 | FR-AUTH-002 | — | Demo |
| FEAT-DASH-01 | FR-DASH-001 | NFR-SEC-001 | Demo |
| FEAT-ABS-01 | FR-ABS-001 | BR-03, NFR-DATA-001 | Demo, Test |
| FEAT-ABS-02 | FR-ABS-002 | BR-04 | Demo, Test |
| FEAT-ABS-03 | FR-ABS-003 | BR-06 | Demo |
| FEAT-ABS-04 | FR-ABS-004 | BR-07 | Analysis, Demo |
| FEAT-ABS-05 | FR-ABS-007 | BR-03 | Demo, Test |
| FEAT-ABS-06 | FR-ABS-008 | BR-11, NFR-DATA-001 | Demo, Test |
| FEAT-ABS-07 | FR-ABS-009 | BR-10 | Demo |
| FEAT-ABS-08 | FR-ABS-010 | BR-06 | Demo, Test |
| FEAT-ABS-09 | FR-ABS-012 | BR-13 | Demo, Test |
| FEAT-ABS-10 | FR-ABS-013 | BR-13 | Demo |
| FEAT-SYS-01 | FR-ABS-006 / IR-SW-001 | DEC-04 | Analysis, Test |
| FEAT-JADWAL-01 | FR-JADWAL-001 | — | Demo |
| FEAT-QUIZ-01 | FR-QUIZ-001 | — | Demo, Test |
| FEAT-QUIZ-02 | FR-QUIZ-002 | — | Demo |
| FEAT-LATIHAN-01 | FR-LATIHAN-001 | — | Demo |
| FEAT-GURU-BANKSOAL-01 | FR-BANK-001 | — | Demo, Test |
| (kode) | FR-BANK-002 | — | Demo |
| FEAT-GURU-TUGAS-01 | FR-TUGAS-001 | — | Demo, Test |
| FEAT-GURU-PENILAIAN-01 | FR-NILAI-001 | — | Demo |
| FEAT-GURU-KOREKSI-01 | FR-KORESI-001 | — | Demo |
| (placeholder) | FR-KORESI-002 | DEC-09 | Demo |
| FEAT-WALI-01 / FEAT-BK-02 | FR-REKAP-001 / FR-REKAP-002 | — | Demo |
| FEAT-WALI-02 | FR-RAPOT-001 / FR-RAPOT-002 | — | Demo |
| FEAT-WALI-03 / FEAT-BK-01 | FR-KONSELING-001 / 002 | — | Demo, Test |
| FEAT-BK-03 / FEAT-SISWA-01 | FR-MB-001 / FR-MB-002 | — | Demo |
| FEAT-SISWA-02 | FR-PG-001 | — | Demo |
| FEAT-NOTIF-01 | FR-NOTIF-001 | Q-09 | Demo |
| FEAT-ADMIN-01 | FR-ADMIN-001 | NFR-SEC-002 | Demo, Test |
| FEAT-ADMIN-02 | FR-AUTH-003 | BR-02 | Demo, Test |
| FEAT-ADMIN-03 | FR-ADMIN-002 | — | Demo |
| FEAT-ADMIN-04 | FR-ADMIN-003 | — | Demo |
| NFR-P-01 | NFR-USE-001 | — | Demo |
| NFR-P-02 | NFR-USE-002 | AUD-012 | Review |
| NFR-P-04 | NFR-PERF-001 | DEC-06, Q-12 | Test |
| NFR-P-05 | NFR-USE-003 | DEC-06, AUD-012 | Analysis |
| NFR-P-06 | NFR-REL-001 | DEC-06, Q-12 | Analysis |
| NFR-P-07 | NFR-OBS-001 | DEC-11, BR-09 | Analysis |
| AUD-001 | NFR-SEC-001 | AC-01 | Test |
| AUD-007 | NFR-MNT-002 | — | Review |
| AUD-008/009 | NFR-MNT-001 | — | Review |

Catatan: seluruh requirement kini berstatus `Confirmed` (dari stakeholder/kode) atau `Proposed` (keputusan sementara, lihat Bagian 11). Tidak ada lagi status `TBD` terbuka; atribut spesifik yang masih belum pasti ditandai `TBD` di kolom keterangan/AC dan tetap menunggu ratifikasi.

## 10. Open Issues — Status

Seluruh open issue dijawab sebagai keputusan sementara (Proposed) pada Bagian 11. Isu yang tetap bergantung pihak ketiga/perangkat ditandai.

| ID | Isu | Keputusan | Status |
| --- | --- | --- | --- |
| OI-01 | Definisi status kehadiran & keterlambatan | DEC-01, DEC-02 | Resolved (Proposed) |
| OI-02 | Prosedur koreksi & persetujuan absensi | DEC-03 | Resolved (Proposed) |
| OI-03 | Mekanisme integrasi IoT | DEC-04 | Resolved (Proposed); detail vendor/perangkat `TBD` |
| OI-04 | Mekanisme autentikasi API (session vs token) | DEC-05 | Resolved (Proposed) |
| OI-05 | Target NFR kuantitatif | DEC-06 | Resolved (Proposed) |
| OI-06 | Batas akses data per peran | DEC-07 | Resolved (Proposed) |
| OI-07 | Lingkup modul non-absensi | DEC-08 | Resolved (Proposed) |
| OI-08 | Status fitur Remedial mandiri | DEC-09 | Resolved (Proposed) |
| OI-09 | Detail absensi guru (jam masuk, keterlambatan, tampilan/peninjau) | DEC-15 | Resolved (Confirmed) |

## 11. Keputusan Sementara (Provisional Decisions)

Keputusan berikut ditetapkan **untuk melanjutkan Fase D**. `DEC-01`, `DEC-02`, `DEC-04b`, dan `DEC-15` kini **Confirmed** (klarifikasi stakeholder atas alur absensi siswa & guru); sisanya **Proposed** dan wajib diratifikasi sebelum implementasi produksi. Dasar: fakta stakeholder di PRD, bukti kode/audit, dan praktik umum sekolah—tanpa mengubah fakta yang sudah `Confirmed`.

| ID | Keputusan | Dasar / Alasan | Terkait |
| --- | --- | --- | --- |
| DEC-01 | Status kehadiran: **Hadir, Terlambat, Izin, Sakit, Alpa**. Hadir/Terlambat dari absen masuk IoT; Izin/Sakit/Alpa ditetapkan manual guru. Siswa tanpa absen pagi ditandai merah di absensi guru. | **Dikonfirmasi stakeholder** (koreksi alur absensi); menutup FR-ABS-002/005/009. | FR-ABS-005, BR-06, BR-10 |
| DEC-02 | Terlambat bila absen masuk melewati **jam masuk pertama yang diatur Admin** (contoh 7:15 WIB); zona waktu WIB. Nilai jam dikonfigurasi Admin, bukan hardcode. | Dikonfirmasi stakeholder; nilai nyata per sekolah dikelola Admin; contoh 7:15 WIB. | FR-ABS-005, FR-ABS-010/011, BR-06 |
| DEC-04b | Alur harian dikonfirmasi: absen masuk pagi → (bila tidak, nama merah di absensi guru) → absen pulang; banyak alat, siswa bebas memilih alat; event digabung per siswa. | Stakeholder (dikoreksi). | FR-ABS-007/008/009, BR-10, BR-11, BR-12 |
| DEC-03 | Koreksi absensi: **diajukan guru** (Mapel/Wali/BK), **disetujui Admin Sekolah**; setiap perubahan menyimpan sebelum/sesudah, aktor, waktu, alasan; status menunggu tidak mengubah rekap resmi. | Admin memegang data master; audit trail menjamin akuntabilitas. | FR-ABS-004, BR-07 |
| DEC-04 | Integrasi IoT: backend menyediakan **endpoint ingestion HTTP+JSON** `{device_id, identifier, timestamp, event_type}`; perangkat via gateway/agent; pemetaan `identifier→siswa` di DB. Protokol/vendor detail `TBD`. | Backend memegang ingestion agar vendor-agnostik; memisahkan perangkat dari domain absensi. | FR-ABS-006, IR-SW-001 |
| DEC-05 | Autentikasi: **session cookie** HttpOnly+Secure+SameSite=Lax + proteksi CSRF; idle timeout usulan 30 menit, absolut 12 jam; hash password **Argon2id**; rate limiting login. | Aplikasi web monolitik + password dikelola Admin → sesi server lebih aman (revokasi mudah saat reset) dibanding token klien. | IR-API-003, NFR-SEC-003/004/005 |
| DEC-06 | Target NFR provisional: p95 halaman < 3 dtk (4G) & API < 500 ms; availability 99% jam sekolah (Sen–Sab 06:00–17:00); aksesibilitas WCAG 2.1 AA (best-effort); peramban 2 versi terakhir Chrome/Edge/Firefox/Safari. | Angka kerja yang wajar untuk aplikasi sekolah; skala pengguna final `TBD`. | NFR-PERF-001, NFR-REL-001, NFR-USE-003, NFR-COM-001 |
| DEC-07 | Batas akses data: Siswa=sendiri; Guru Mapel=kelas/mapel yang diampu; Guru Wali=kelas perwalian; Guru BK=semua siswa; Admin=semua dalam sekolah. | Prinsip least-privilege sesuai peran (PRD 4); BK butuh cakupan lintas kelas untuk konseling. | BR-14 |
| DEC-08 | Lingkup: **satu aplikasi terintegrasi** (React + Go) termasuk modul non-absensi (quiz, latihan, minat bakat, passing grade); modul tersebut prioritas **Could** dan menyusul inti absensi. | Frontend existing sudah satu aplikasi terpadu (audit); memecah modul menambah biaya tanpa manfaat jelas. | OI-07, FEAT-QUIZ-01, FR-MB-001, FR-PG-001 |
| DEC-09 | Remedial = sub-fitur penilaian (asesmen ulang siswa < KKM), prioritas Could; struktur detail `TBD`. | Placeholder `GuruRemedial.tsx` kosong (audit); memperlakukan sebagai bagian penilaian menghindari entitas baru prematur. | FR-KORESI-002 |
| DEC-10 | KKM/passing grade: ambang KKM **dapat dikonfigurasi per mapel/sekolah**; konten passing grade kampus = data referensi yang dikelola Admin. | Menghindari hardcode nilai; selaras FR-ADMIN-002/003. | DR-005, FR-PG-001 |
| DEC-11 | Retensi: data absensi & nilai disimpan selama siswa aktif + arsip (usulan ≥ 5 tahun); log audit perubahan ≥ 1 tahun. | Kebutuhan administratif sekolah; angka provisional. | BR-09, NFR-OBS-001, DR-010 |
| DEC-12 | Notifikasi: **in-app** lebih dulu dengan status baca tersimpan; kanal eksternal (email/WA) di luar lingkup awal. | Fitur sudah ada sebagai UI (audit); kanal eksternal butuh keputusan terpisah. | FR-NOTIF-001, Q-09 |
| DEC-13 | Ekspor laporan: sediakan ekspor **CSV/Excel** untuk rekap absensi & nilai, dan **PDF** untuk rapor, prioritas Should setelah inti. | Kebutuhan administratif umum; format dipilih agar mudah diolah. | Q-08 |
| DEC-14 | Design baseline: gunakan implementasi frontend saat ini + design token internal sebagai acuan sementara; penunjukan pemilik/penyetuju desain resmi masih `TBD` (organisasi). | Tidak ada aset desain resmi (fakta audit); perlu baseline agar Fase D/E dapat berjalan. | IR-UI-001, Q-11 |
| DEC-15 | Absensi guru: memakai **alat absensi dan jam masuk yang sama** dengan siswa serta dikenai aturan **Terlambat**; **Admin meninjau** absensi guru dengan **tanda merah** untuk guru yang belum absen. Absensi guru **tidak** memengaruhi penggajian/laporan (di luar lingkup). | **Dikonfirmasi stakeholder**. | FR-ABS-012/013, BR-13 |

**Catatan ratifikasi:** DEC-01/02/03/07 menyentuh aturan bisnis & keamanan inti dan harus dikonfirmasi stakeholder. DEC-04/06/11 masih bergantung data pihak ketiga (perangkat, skala, kebijakan retensi) dan dikonfirmasi sebelum rilis.

## 12. Catatan Konsistensi

- Setiap CR menautkan sumber PRD atau menandai `Usulan`; keputusan provisional ditautkan ke `DEC-*`.
- Tidak ada nilai performa/SLA/role/aturan absensi yang dikarang sebagai fakta; seluruh target baru berstatus `Proposed` dan diberi dasar.
- Requirement `Proposed` **bukan** kebutuhan final dan harus dikonfirmasi sebelum implementasi produksi (Fase D boleh memakai sebagai asumsi kerja).
- Catatan duplikasi identik di PRD: `FEAT-AUTH-02` dan `FEAT-ADMIN-02` sama-sama merujuk "reset password oleh Admin"; di SRS keduanya dipetakan ke satu requirement `FR-AUTH-003` (tidak ada kebutuhan ganda yang diciptakan).
- Seluruh 31 `FEAT-*` pada PRD telah dipetakan ke minimal satu requirement SRS (lihat Bagian 9).
