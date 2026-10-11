# 07 — UAT Checklist: LIMEN

- **Status dokumen:** Draft untuk ditinjau (Fase G) — **belum dieksekusi**
- **Versi:** 0.1
- **Tanggal:** 2026-10-11
- **Dokumen terkait:** [02-prd.md](./02-prd.md) · [03-srs.md](./03-srs.md) · [04-wbs.md](./04-wbs.md) · [05-sdd.md](./05-sdd.md) · [06-api-documentation.md](./06-api-documentation.md) · [08-design-change-backup-plan.md](./08-design-change-backup-plan.md) · [09-decision-log.md](./09-decision-log.md) · [10-glossary.md](./10-glossary.md)

## 1. Tujuan dan Ruang Lingkup

Dokumen ini adalah checklist **User Acceptance Testing (UAT)** untuk memverifikasi bahwa LIMEN memenuhi kebutuhan yang tercatat di [02-prd.md](./02-prd.md) dan [03-srs.md](./03-srs.md). UAT dilakukan oleh **stakeholder/perwakilan pengguna** dengan pendampingan tim, dan menguji **alur serta hasil yang terlihat pengguna**, bukan sekadar halaman dapat dibuka.

- **Bukan** pengganti unit test, integration test teknis, test kontrak API, atau security test; rujuk [05-sdd.md](./05-sdd.md) §9.4.
- Setiap test case **terhubung** ke `Requirement ID` (`FR-*`/`NFR-*`) dan `Acceptance Criteria` (`AC-*` SRS §8 atau `AC-P-*` PRD §13).
- Cakupan: seluruh modul in-scope pada [02-prd.md](./02-prd.md) §6.1.

## 2. Aturan Status dan Pelaksanaan

Nilai `Status` mengikuti konvensi pada [04-wbs.md](./04-wbs.md) dan [10-glossary.md](./10-glossary.md):

| Status | Arti |
| --- | --- |
| `Not Run` | Belum dijalankan; dapat dijalankan **nanti** tanpa pemblokir permanen. |
| `Pass` | Dijalankan dan hasil sesuai harapan (wajib ada bukti). |
| `Fail` | Dijalankan dan hasil tidak sesuai (`Severity` wajib diisi). |
| `Blocked` | Tidak dapat dijalankan sekarang karena bergantung pada komponen yang belum ada (backend/API/DB/perangkat). |
| `Not Applicable` | Tidak relevan untuk rilis ini (alasan wajib dicatat). |

**Aturan penting:**

1. Pada saat penyusunan dokumen ini, **backend Go, database, dan integrasi belum ada**; kontrak API masih `Proposed` (lihat [06-api-documentation.md](./06-api-documentation.md) §1). Karena itu hampir seluruh skenario fungsional berstatus **`Blocked`**, dan skenario yang hanya menyentuh frontend berstatus **`Not Run`**.
2. **Tidak ada** skenario berstatus `Pass` pada dokumen ini karena pengujian **belum** dijalankan. Status hanya dinaikkan menjadi `Pass` **setelah** benar-benar dieksekusi dan dibuktikan.
3. Kolom `Hasil aktual` awalnya kosong (`-`) dan diisi saat eksekusi.
4. `Severity` hanya wajib bila `Fail` (mis. `Blocker`, `Critical`, `Major`, `Minor`).
5. Data uji **tidak** boleh memakai data pribadi/kredensial nyata; gunakan data contoh yang steril.

## 3. Peran, Akun, dan Data Uji (Prasyarat Umum)

Prasyarat lingkungan di bawah **belum tersedia** pada fase dokumentasi; menjadi dasar status `Blocked`.

| Prasyarat | Rincian | Status saat ini |
| --- | --- | --- |
| Akun tiap peran | 1 akun uji untuk `siswa`, `guru_mapel`, `guru_wali`, `guru_bk`, `admin` (BR-01) | Belum |
| Data akademik | ≥1 kelas, ≥1 mapel, penugasan mengajar, daftar siswa | Belum |
| Perangkat absensi | ≥1 alat absensi uji + pemetaan sidik jari (DEC-04) | Belum (`TBD` vendor) |
| Pengaturan sekolah | `first_entry_time` (mis. 07:15 WIB), TZ `Asia/Jakarta` (DEC-02/BR-12) | Belum |
| Sesi & CSRF | Cookie `limen_session` + header `X-CSRF-Token` (DEC-05) | Belum |
| Kontrak API | Endpoint berstatus `Approved` (IR-API-004) | Belum (masih `Proposed`) |

**Legenda `Req`:** ID requirement [03-srs.md](./03-srs.md). **`AC`:** `AC-xx` (SRS §8) atau `AC-P-xx` (PRD §13). **`WBS`:** pekerjaan [04-wbs.md](./04-wbs.md).

## 4. Functional UAT per Modul

### 4.1 Autentikasi & Akses

| TC ID | Req | AC | Skenario | Langkah ringkas | Hasil yang diharapkan | Status | Sev | WBS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-AUTH-01 | FR-AUTH-001 | AC-P-01, AC-01 | Login kredensial valid | Isi email+password benar, submit | Masuk dashboard sesuai peran; cookie sesi dibuat | Blocked | - | WBS-P4-02, WBS-P5-01 |
| TC-AUTH-02 | FR-AUTH-001, FR-AUTH-006 | AC-P-01 | Login gagal / validasi | Coba password salah; email kosong; format email salah | Pesan error; tidak ada sesi; tidak mengungkap field mana yang salah | Blocked | - | WBS-P4-02 |
| TC-AUTH-03 | FR-AUTH-002 | - | Logout | Klik logout | Sesi berakhir; dialihkan ke login; halaman terproteksi tak dapat diakses | Blocked | - | WBS-P4-02, WBS-P5-01 |
| TC-AUTH-04 | FR-AUTH-003 | AC-P-05, AC-05 | Admin reset password | Admin reset password pengguna; pengguna login dengan password baru | Password berubah; sesi lama pengguna dicabut; audit tercatat | Blocked | - | WBS-P4-02 |
| TC-AUTH-05 | FR-AUTH-005 | NFR-SEC-001 | Sesi kedaluwarsa | Biarkan idle lalu akses; atau picu 401 | Permintaan berikutnya 401 `SESSION_EXPIRED` → dialihkan ke login | Blocked | - | WBS-P6-02 |
| TC-AUTH-06 | FR-AUTH-004 | AC-02, AC-P-07 | Akses tanpa sesi | Buka URL/endpoint terproteksi langsung tanpa login | Dialihkan ke login; backend menolak (`401`) | Blocked | - | WBS-P4-03 |

### 4.2 Absensi

| TC ID | Req | AC | Skenario | Langkah ringkas | Hasil yang diharapkan | Status | Sev | WBS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-ABS-01 | FR-ABS-001 | AC-03 | Absen masuk pagi (IoT) | Kirim `check_in` sebelum jam masuk | Rekaman harian berstatus `hadir`; tampil di rekap | Blocked | - | WBS-P4-05, WBS-P5-03 |
| TC-ABS-02 | FR-ABS-005, FR-ABS-010 | AC-09 | Keterlambatan | Kirim `check_in` setelah jam masuk pertama | Status `terlambat`; `lateMinutes` sesuai | Blocked | - | WBS-P4-05/06 |
| TC-ABS-03 | FR-ABS-007 | AC-10 | Absen pulang | Kirim `check_out` setelah jam pulang pada hari sama | `check_out_at` terisi | Blocked | - | WBS-P4-05 |
| TC-ABS-04 | FR-ABS-008 | AC-08 | Banyak alat | Tap masuk di alat A, pulang di alat B | Tergabung ke satu rekaman harian siswa | Blocked | - | WBS-P4-05 |
| TC-ABS-05 | FR-ABS-009 | AC-07 | Tanda merah siswa | Siswa tanpa absen masuk pagi | Nama siswa tampil merah pada absensi guru | Blocked | - | WBS-P4-05, WBS-P5-03 |
| TC-ABS-06 | FR-ABS-002 | AC-04 | Status manual oleh guru | Guru menetapkan status siswa yang belum tercatat | Tersimpan `source=manual`; tampil pada rekap | Blocked | - | WBS-P4-06, WBS-P5-03 |
| TC-ABS-07 | FR-ABS-003 | AC-03 | Riwayat/detail absensi | Buka rekap per siswa/kelas/periode | Data sesuai filter; tanpa kehilangan baris | Blocked | - | WBS-P4-05, WBS-P5-03 |
| TC-ABS-08 | FR-ABS-004 | - | Koreksi disetujui | Guru ajukan koreksi → Admin setujui | Rekap resmi berubah **setelah** persetujuan; audit (sebelum/sesudah, aktor, waktu, alasan) tercatat | Blocked | - | WBS-P4-07 |
| TC-ABS-09 | FR-ABS-004 | - | Koreksi ditolak | Guru ajukan koreksi → Admin tolak | Rekap resmi **tidak** berubah; alasan penolakan tersimpan | Blocked | - | WBS-P4-07 |
| TC-ABS-10 | FR-ABS-012 | AC-11, AC-12 | Absensi guru | Guru absen masuk & pulang; uji masuk setelah jam | Tersimpan per hari; status `terlambat` bila lewat jam | Blocked | - | WBS-P4-05, WBS-P5-03 |
| TC-ABS-11 | FR-ABS-013 | AC-13 | Admin tinjau absensi guru | Buka rekap absensi guru | Guru tanpa absen masuk tampil merah | Blocked | - | WBS-P5-03, WBS-P5-11 |
| TC-ABS-12 | FR-ABS-010 | AC-09 | Ubah jam masuk | Admin ubah jam masuk pertama | Penentuan keterlambatan berikutnya mengikuti nilai baru | Blocked | - | WBS-P4-06 |

### 4.3 Dashboard

| TC ID | Req | AC | Skenario | Langkah ringkas | Hasil yang diharapkan | Status | Sev | WBS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-DASH-01 | FR-DASH-001 | AC-P-02 | Menu per peran | Login sebagai tiap peran | Menu berbeda sesuai hak peran | Blocked | - | WBS-P5-02 |
| TC-DASH-02 | FR-DASH-001 | - | Navigasi antar modul | Klik setiap menu yang tersedia | Halaman benar terbuka; tidak ada route rusak | Blocked | - | WBS-P2-01, WBS-P5-02 |

### 4.4 Jadwal

| TC ID | Req | AC | Skenario | Langkah ringkas | Hasil yang diharapkan | Status | Sev | WBS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-JADWAL-01 | FR-JADWAL-001 | - | Lihat jadwal | Buka jadwal, filter kelas/periode | Jadwal pelajaran/ujian/tryout tampil sesuai filter | Blocked | - | WBS-P4-09, WBS-P5-04 |

### 4.5 Quiz, Latihan, dan Bank Soal

| TC ID | Req | AC | Skenario | Langkah ringkas | Hasil yang diharapkan | Status | Sev | WBS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-QUIZ-01 | FR-QUIZ-001 | - | Mengerjakan quiz | Mulai attempt; jawab; autosave; submit | Jawaban tersimpan per butir; navigasi antar butir berfungsi | Blocked | - | WBS-P4-10, WBS-P5-05 |
| TC-QUIZ-02 | FR-QUIZ-001 | - | Kerahasiaan kunci | Buka detail quiz sebagai siswa | Kunci jawaban **tidak** dikirim ke siswa | Blocked | - | WBS-P4-10 |
| TC-QUIZ-03 | FR-QUIZ-002 | US-09 | Riwayat & hasil | Buka riwayat & detail hasil | Riwayat dan skor sesuai data | Blocked | - | WBS-P4-10, WBS-P5-05 |
| TC-LATIHAN-01 | FR-LATIHAN-001 | - | Daftar latihan soal | Buka per mata pelajaran | Daftar mapel & soal tampil; navigasi detail berfungsi | Blocked | - | WBS-P5-05 |
| TC-BANK-01 | FR-BANK-001 | - | Buat/edit soal | Tambah soal; lalu edit | Soal tersimpan; form edit memuat data yang benar | Blocked | - | WBS-P4-10, WBS-P5-05 |
| TC-BANK-02 | FR-BANK-002 | - | Tipe soal beragam | Tampilkan & jawab tiap tipe (PG, PG kompleks, B/S, rentang, esai) | Setiap tipe tampil & dapat dijawab sesuai tipenya | Blocked | - | WBS-P4-10 |

### 4.6 Tugas, Penilaian, dan Koreksi

| TC ID | Req | AC | Skenario | Langkah ringkas | Hasil yang diharapkan | Status | Sev | WBS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-TGS-01 | FR-TUGAS-001 | - | Buat & nilai tugas | Buat tugas; guru nilai pekerjaan siswa | Tugas & nilai tersimpan | Blocked | - | WBS-P4-11, WBS-P5-06 |
| TC-NIL-01 | FR-NILAI-001 | - | Input/rekap nilai | Input nilai per siswa; buka rekap | Nilai tersimpan; rekap per siswa/mapel benar | Blocked | - | WBS-P4-11, WBS-P5-06 |
| TC-KOR-01 | FR-KORESI-001 | - | Koreksi jawaban esai | Guru menilai jawaban esai | Penilaian tersimpan; skor attempt dihitung ulang | Blocked | - | WBS-P4-10 |
| TC-KOR-02 | FR-KORESI-002 | - | Remedial | Tandai siswa < KKM; catat nilai remedial | Mengikuti DEC-09; **struktur detail masih `TBD`** | Blocked | - | WBS-P4-11 |

### 4.7 Rekap & Rapor

| TC ID | Req | AC | Skenario | Langkah ringkas | Hasil yang diharapkan | Status | Sev | WBS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-REKAP-01 | FR-REKAP-001 | - | Rekap absensi | Filter kelas/periode | Rekap absensi sesuai data resmi (koreksi pending tidak dihitung) | Blocked | - | WBS-P4-08, WBS-P5-07 |
| TC-REKAP-02 | FR-REKAP-002 | - | Rekap nilai | Filter kelas/mapel | Rekap nilai tampil sesuai kelas/mapel | Blocked | - | WBS-P4-08, WBS-P5-07 |
| TC-RAPOT-01 | FR-RAPOT-001, FR-RAPOT-002 | - | Rapor & detail mapel | Buka rapor siswa & detail | Nilai per mapel tampil benar | Blocked | - | WBS-P4-08, WBS-P5-07 |

### 4.8 Konseling, Minat Bakat, dan Passing Grade

| TC ID | Req | AC | Skenario | Langkah ringkas | Hasil yang diharapkan | Status | Sev | WBS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-KSL-01 | FR-KONSELING-001 | - | Catat konseling | Catat konseling siswa | Catatan tersimpan & tampil pada daftar | Blocked | - | WBS-P4-12, WBS-P5-08 |
| TC-KSL-02 | FR-KONSELING-002 | - | Tindak lanjut | Tambah tindak lanjut atas catatan | Tindak lanjut tersimpan terkait catatan | Blocked | - | WBS-P4-12, WBS-P5-08 |
| TC-MB-01 | FR-MB-001, FR-MB-002 | - | Minat bakat & target jurusan | Lihat hasil; tambah target jurusan | Hasil tampil; target jurusan tersimpan | Blocked | - | WBS-P4-13, WBS-P5-09 |
| TC-PG-01 | FR-PG-001 | - | Passing grade | Buka daftar & detail passing grade | Informasi tampil sesuai data referensi | Blocked | - | WBS-P4-13, WBS-P5-09 |

### 4.9 Notifikasi

| TC ID | Req | AC | Skenario | Langkah ringkas | Hasil yang diharapkan | Status | Sev | WBS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-NTF-01 | FR-NOTIF-001 | - | Daftar & tandai baca | Buka notifikasi; tandai dibaca | Daftar tampil; status baca tersimpan (DEC-12) | Blocked | - | WBS-P4-14, WBS-P5-10 |

### 4.10 Admin

| TC ID | Req | AC | Skenario | Langkah ringkas | Hasil yang diharapkan | Status | Sev | WBS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-ADM-01 | FR-ADMIN-001 | AC-P-05 | Kelola pengguna | Buat/ubah pengguna & peran/status | Perubahan tersimpan; validasi peran berlaku | Blocked | - | WBS-P4-04, WBS-P5-11 |
| TC-ADM-02 | FR-ADMIN-002 | - | Data akademik & jadwal | Buat kelas/mapel/penugasan/jadwal | Data master tersimpan & tampil | Blocked | - | WBS-P4-04/09, WBS-P5-11 |
| TC-ADM-03 | FR-ADMIN-003 | - | Presensi & nilai rapor | Buka rekap presensi & nilai | Rekap tampil sesuai filter | Blocked | - | WBS-P4-08, WBS-P5-11 |
| TC-ADM-04 | FR-AUTH-003 | AC-P-05 | Reset password admin | Lihat TC-AUTH-04 | (digabung) | Blocked | - | WBS-P4-02 |
| TC-ADM-05 | FR-ABS-006, FR-ABS-008 | - | Registrasi & kelola device | Registrasi alat; nonaktifkan alat | Perangkat tersimpan; alat nonaktif ditolak saat ingestion | Blocked | - | WBS-P4-04 |

## 5. Role and Permission Testing

| TC ID | Req | AC | Skenario | Langkah ringkas | Hasil yang diharapkan | Status | Sev | WBS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-RLP-01 | BR-14, FR-AUTH-004 | AC-02 | Siswa hanya data sendiri | Siswa membuka data siswa lain | Ditolak (`403`/`404`) | Blocked | - | WBS-P4-03 |
| TC-RLP-02 | BR-14 | AC-02 | Cakupan Guru Mapel | Guru mapel buka kelas bukan ampuannya | Ditolak | Blocked | - | WBS-P4-03 |
| TC-RLP-03 | BR-14 | AC-02 | Cakupan Guru Wali | Wali buka kelas perwalian vs kelas lain | Perwalian diizinkan; lainnya ditolak | Blocked | - | WBS-P4-03 |
| TC-RLP-04 | BR-14 | AC-02 | Cakupan Guru BK | BK mengakses siswa lintas kelas | Diizinkan | Blocked | - | WBS-P4-03 |
| TC-RLP-05 | BR-14 | AC-02 | Cakupan Admin | Admin mengakses seluruh data sekolah & konfigurasi | Diizinkan | Blocked | - | WBS-P4-03 |
| TC-RLP-06 | NFR-SEC-002 | AC-02, AC-07 | Otorisasi backend | Panggil endpoint langsung tanpa hak (lewati UI) | Ditolak backend; data tidak berubah | Blocked | - | WBS-P4-03 |
| TC-RLP-07 | NFR-SEC-001 | AC-01 | Tanpa sesi | Akses endpoint terproteksi tanpa sesi | `401 UNAUTHENTICATED` | Blocked | - | WBS-P4-02 |

## 6. Data Validation

| TC ID | Req | AC | Skenario | Langkah ringkas | Hasil yang diharapkan | Status | Sev | WBS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-VAL-01 | FR-AUTH-006 | - | Validasi email | Input email kosong/format salah | Ditolak dengan pesan validasi | Blocked | - | WBS-P4-02 |
| TC-VAL-02 | FR-ABS-005 | - | Enum status absensi | Kirim status di luar `hadir/terlambat/izin/sakit/alpa` | Ditolak (`422`) | Blocked | - | WBS-P4-06 |
| TC-VAL-03 | API-ABS-004 | - | Tanggal masa depan | Tetapkan status absensi untuk tanggal mendatang | Ditolak | Blocked | - | WBS-P4-06 |
| TC-VAL-04 | NFR-DATA-001, FR-ABS-001/008 | AC-08 | Idempotensi ingestion | Kirim ulang event identik | `200` dengan `duplicate:true`; tidak menggandakan rekaman | Blocked | - | WBS-P4-05 |
| TC-VAL-05 | FR-ABS-004 | - | Konflik koreksi pending | Ajukan dua koreksi pending untuk rekaman sama | Yang kedua ditolak (`409`) | Blocked | - | WBS-P4-07 |
| TC-VAL-06 | API §2.6 | - | Batas pagination | Kirim `pageSize` > 100 | Dibatasi/ditolak sesuai kontrak | Blocked | - | WBS-P4-04 |
| TC-VAL-07 | SDD §8 | - | Mass-assignment | Kirim field tak dikenal pada payload mutasi | Field diabaikan/ditolak; tidak ada efek samping | Blocked | - | WBS-P4-02 |
| TC-VAL-08 | IR-API-002 | - | Envelope error | Picu berbagai error (400/401/403/404/409/422/429/500) | Respons `{ code, message, details? }` konsisten | Blocked | - | WBS-P6-02 |

## 7. Integration Scenarios

| TC ID | Req | AC | Skenario | Langkah ringkas | Hasil yang diharapkan | Status | Sev | WBS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-INT-01 | AC-03, FR-AUTH-001 | - | Alur siswa ujung ke ujung | Login → jadwal → absensi → rekap pribadi | Seluruh langkah berjalan tanpa data mock | Blocked | - | WBS-P6-01 |
| TC-INT-02 | FR-ABS-001 | AC-03 | Perangkat → rekap | Kirim event dari perangkat uji → buka rekap | Event tercatat pada rekaman harian yang benar | Blocked | - | WBS-P6-01 |
| TC-INT-03 | FR-ABS-004 | - | Koreksi → notifikasi | Setujui koreksi → cek notifikasi pengaju | Notifikasi in-app muncul (DEC-12) | Blocked | - | WBS-P6-01, WBS-P4-14 |
| TC-INT-04 | BR-14 | - | Konsistensi lintas modul | Bandingkan absensi/nilai di dashboard & rekap | Angka konsisten di seluruh modul berwenang | Blocked | - | WBS-P6-01 |

## 8. UI/UX Acceptance, Compatibility & Responsiveness, Regression, Release

### 8.1 UI/UX Acceptance

| TC ID | Req | AC | Skenario | Langkah ringkas | Hasil yang diharapkan | Status | Sev | WBS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-UX-01 | NFR-USE-001 | AC-06, AC-P-06 | Mobile-first | Buka di viewport ponsel & desktop | Fungsi utuh di ponsel; tetap fungsional di desktop | Not Run | - | WBS-P2-07 |
| TC-UX-02 | NFR-USE-002 | - | Bahasa Indonesia | Periksa atribut `lang` & teks UI | `html lang="id"`; teks berbahasa Indonesia | Not Run | - | WBS-P2-08 |
| TC-UX-03 | IR-UI-002 | - | State loading/empty/error | Picu kondisi data lambat/kosong/gagal | State konsisten tampil di seluruh halaman data | Not Run | - | WBS-P2-04 |
| TC-UX-04 | NFR-USE-003 | - | Aksesibilitas | Navigasi keyboard, dialog, label, kontras | Sesuai WCAG 2.1 AA (best-effort) | Not Run | - | WBS-P2-08 |
| TC-UX-05 | IR-UI-001 | - | Konsistensi tampilan | Periksa warna/spacing/komponen via design token | Konsisten; perubahan desain cukup lewat token | Not Run | - | WBS-P2-07 |

### 8.2 Compatibility and Responsiveness

| TC ID | Req | AC | Skenario | Langkah ringkas | Hasil yang diharapkan | Status | Sev | WBS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-COMPAT-01 | NFR-COM-001 | - | Browser matrix | Uji 2 versi terakhir Chrome/Edge/Firefox/Safari | Fungsi utuh di seluruh peramban | Not Run | - | WBS-P6-05 |
| TC-COMPAT-02 | NFR-USE-001 | AC-06 | Breakpoints | Uji ponsel/tablet/desktop | Layout adaptif tanpa kehilangan fungsi | Not Run | - | WBS-P2-07 |
| TC-COMPAT-03 | NFR-PERF-001 | - | Jaringan lambat | Throttle 3G/4G, ukur p95 | Memenuhi target DEC-06 **setelah diratifikasi** | Blocked | - | WBS-P6-05 |
| TC-COMPAT-04 | FR-AUTH-005 | - | Sesi hilang saat alur | Hapus cookie sesi di tengah alur | Dialihkan ke login; aplikasi tidak crash | Blocked | - | WBS-P6-02 |

### 8.3 Regression Testing

| TC ID | Req | AC | Skenario | Langkah ringkas | Hasil yang diharapkan | Status | Sev | WBS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-REGR-01 | AUD-002, AUD-003 | - | Regresi bug quiz & bank soal | Buka `/quiz/:quizId` dan bank soal Ujian | Berfungsi; tidak dialihkan ke `/notfound`/komponen salah | Blocked | - | WBS-P2-01 |
| TC-REGR-02 | NFR-MNT-001 | - | Regresi pasca-konsolidasi | Jalankan suite setelah konsolidasi/refactor | Tidak ada regresi fungsi inti | Blocked | - | WBS-P2-06 |
| TC-REGR-03 | IR-API-004 | - | Regresi pasca-perubahan backend | Jalankan test kontrak API | Hijau; mock selaras kontrak | Blocked | - | WBS-P6-03 |
| TC-REGR-04 | [08 §C](./08-design-change-backup-plan.md#c-change-impact-analysis) | - | Regresi pasca-change desain | Bandingkan visual & fungsi terhadap baseline | Tidak regresi; sesuai baseline baru | Not Run | - | WBS-P8-02 |

### 8.4 Release Acceptance

| TC ID | Req | AC | Skenario | Langkah ringkas | Hasil yang diharapkan | Status | Sev | WBS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-REL-01 | AC-01..AC-13 | - | Seluruh kriteria Must | Jalankan seluruh test case Must | 100% `Pass`, tanpa Blocker/Critical | Not Run | - | WBS-P7-01 |
| TC-REL-02 | DR-001..DR-010 | - | Integritas migrasi data | Jalankan migrasi & verifikasi data | Tidak ada kehilangan/duplikasi data | Blocked | - | WBS-P3-01 |
| TC-REL-03 | [08 §E](./08-design-change-backup-plan.md#e-rollback-plan) | - | Uji rollback rilis | Lakukan latihan rollback | Pulih ke versi sebelumnya dengan aman | Not Run | - | WBS-P7-03 |
| TC-REL-04 | NFR-OBS-001 | - | Monitoring & audit | Periksa log/audit/availabilitas | Terbaca; retensi sesuai DEC-11 | Not Run | - | WBS-P7-05 |
| TC-REL-05 | [08 §D](./08-design-change-backup-plan.md#d-backup-dan-version-control) | - | Backup & pemulihan | Verifikasi backup repo & aset | Dapat dipulihkan tanpa kehilangan | Not Run | - | WBS-P8-01 |

## 9. Ringkasan Hasil dan Kriteria Go/No-Go

### 9.1 Ringkasan Status (awal)

Seluruh baris pada dokumen ini **belum dieksekusi**. Status awal:

| Kategori | Total | Blocked | Not Run | Pass | Fail |
| --- | --- | --- | --- | --- | --- |
| Functional (Auth/Absensi/Dashboard/Jadwal/Quiz/Latihan/Tugas/Nilai/Koreksi/Rekap/Rapor/Konseling/MB/PG/Notifikasi/Admin) | 44 | 44 | 0 | 0 | 0 |
| Role & Permission | 7 | 7 | 0 | 0 | 0 |
| Data Validation | 8 | 8 | 0 | 0 | 0 |
| Integration | 4 | 4 | 0 | 0 | 0 |
| UI/UX Acceptance | 5 | 0 | 5 | 0 | 0 |
| Compatibility & Responsiveness | 4 | 2 | 2 | 0 | 0 |
| Regression | 4 | 3 | 1 | 0 | 0 |
| Release Acceptance | 5 | 1 | 4 | 0 | 0 |
| **Total** | **81** | **69** | **12** | **0** | **0** |

> Angka di atas dihitung ulang saat eksekusi; jangan mengklaim `Pass` tanpa bukti.

### 9.2 Kriteria Go (rilis diterima)

1. 100% test case yang menutup kriteria **Must** (`AC-01..AC-13` dan turunan `Must` di [03-srs.md](./03-srs.md)) berstatus `Pass`.
2. Tidak ada temuan `Blocker` atau `Critical` terbuka.
3. Tidak ada test case relevan berstatus `Blocked`/`Not Run` pada lingkup rilis; seluruh pemblokir terselesaikan.
4. Keputusan yang menyentuh aturan bisnis & keamanan inti (DEC-01/02/03/07) sudah **Confirmed** dan tercermin pada hasil uji.
5. Temuan `Major`/`Minor` yang tersisa disetujui untuk ditunda dengan rencana perbaikan tertulis.
6. Uji rollback (TC-REL-03) berhasil.

### 9.3 Kriteria No-Go

1. Ada kriteria **Must** yang `Fail` atau belum `Pass`.
2. Ada `Blocker`/`Critical` terbuka.
3. Kontrak API masih `Proposed` (belum `Approved`) saat jadwal integrasi.
4. Perilaku absensi inti (masuk/pulang/terlambat/tanda merah) tidak konsisten antara perangkat, rekap, dan koreksi.

## 10. Requirement Traceability Matrix (PRD → SRS → SDD → API → UAT → WBS)

Pemetaan ringkas; test case lengkap ada di atas. Rujuk juga `03-srs.md §9` (PRD→SRS), `05-sdd.md §12` (SRS→SDD), dan `06-api-documentation.md §22` (Requirement↔Endpoint↔Data).

| PRD (FEAT) | SRS (FR) | SDD / Perilaku | API | UAT TC | WBS |
| --- | --- | --- | --- | --- | --- |
| FEAT-AUTH-01 | FR-AUTH-001/006 | §7 Autentikasi | API-AUTH-001 | TC-AUTH-01/02, TC-VAL-01 | WBS-P4-02, WBS-P5-01 |
| FEAT-AUTH-02 / FEAT-ADMIN-02 | FR-AUTH-003 | §7, §16.2 | API-AUTH-004 | TC-AUTH-04, TC-ADM-04 | WBS-P4-02 |
| FEAT-AUTH-03 | FR-AUTH-004 | §7.3, §8 | API-AUTH-003 + middleware | TC-AUTH-06, TC-RLP-01..06 | WBS-P4-03 |
| FEAT-AUTH-04 | FR-AUTH-002 | §7 | API-AUTH-002 | TC-AUTH-03 | WBS-P4-02 |
| FEAT-DASH-01 | FR-DASH-001 | §2.2, §7 | API-AUTH-003 | TC-DASH-01/02 | WBS-P5-02 |
| FEAT-ABS-01 | FR-ABS-001/006 | §5.3, §16 | API-ABS-001 | TC-ABS-01, TC-VAL-04, TC-INT-02 | WBS-P4-05 |
| FEAT-ABS-02 | FR-ABS-002 | §5.3 | API-ABS-004 | TC-ABS-06, TC-VAL-03 | WBS-P4-06, WBS-P5-03 |
| FEAT-ABS-03 | FR-ABS-003 | §15.3 | API-ABS-002/003 | TC-ABS-07 | WBS-P4-05, WBS-P5-03 |
| FEAT-ABS-04 | FR-ABS-004 | §16.2 | API-ABS-005..008 | TC-ABS-08/09, TC-VAL-05 | WBS-P4-07 |
| FEAT-ABS-05 | FR-ABS-007 | §5.3 | API-ABS-001 | TC-ABS-03 | WBS-P4-05 |
| FEAT-ABS-06 | FR-ABS-008 | §5.3, §15.3 | API-ABS-001 | TC-ABS-04, TC-VAL-04 | WBS-P4-05 |
| FEAT-ABS-07 | FR-ABS-009 | §15.3 | API-ABS-002 | TC-ABS-05 | WBS-P4-05, WBS-P5-03 |
| FEAT-ABS-08 | FR-ABS-010 | §15.3 | API-SET-001/002 | TC-ABS-12 | WBS-P4-06 |
| FEAT-ABS-09 | FR-ABS-012 | §5.3 | API-ABS-001/002 | TC-ABS-10 | WBS-P4-05, WBS-P5-03 |
| FEAT-ABS-10 | FR-ABS-013 | §5.3 | API-ABS-002 | TC-ABS-11 | WBS-P5-03, WBS-P5-11 |
| FEAT-SYS-01 | FR-ABS-006 | §5.3, §8 | API-ABS-001, API-DEV-* | TC-INT-02, TC-ADM-05 | WBS-P1-09, WBS-P4-05 |
| FEAT-JADWAL-01 | FR-JADWAL-001 | §15.3 | API-JWL-001 | TC-JADWAL-01 | WBS-P4-09, WBS-P5-04 |
| FEAT-QUIZ-01/02 | FR-QUIZ-001/002 | §15.4 | API-QZ-* | TC-QUIZ-01..03 | WBS-P4-10, WBS-P5-05 |
| FEAT-LATIHAN-01 | FR-LATIHAN-001 | §15.4 | API-BNK-001/002 | TC-LATIHAN-01 | WBS-P5-05 |
| FEAT-GURU-BANKSOAL-01 | FR-BANK-001/002 | §15.4 | API-BNK-003..005 | TC-BANK-01/02 | WBS-P4-10, WBS-P5-05 |
| FEAT-GURU-TUGAS-01 | FR-TUGAS-001 | §15.4 | API-TGS-* | TC-TGS-01 | WBS-P4-11, WBS-P5-06 |
| FEAT-GURU-PENILAIAN-01 | FR-NILAI-001 | §15.4 | API-NIL-* | TC-NIL-01 | WBS-P4-11, WBS-P5-06 |
| FEAT-GURU-KOREKSI-01 | FR-KORESI-001 | §15.4 | API-KOR-001 | TC-KOR-01 | WBS-P4-10 |
| (placeholder) | FR-KORESI-002 | §15.4 | (belum ada, TBD) | TC-KOR-02 | WBS-P4-11 |
| FEAT-WALI-01 / FEAT-BK-02 | FR-REKAP-001/002 | §15.3 | API-RPT-001/002 | TC-REKAP-01/02 | WBS-P4-08, WBS-P5-07 |
| FEAT-WALI-02 | FR-RAPOT-001/002 | §15.4 | API-RPT-003 | TC-RAPOT-01 | WBS-P4-08, WBS-P5-07 |
| FEAT-WALI-03 / FEAT-BK-01 | FR-KONSELING-001/002 | §15.4 | API-KSL-* | TC-KSL-01/02 | WBS-P4-12, WBS-P5-08 |
| FEAT-BK-03 / FEAT-SISWA-01 | FR-MB-001/002 | §15.4 | API-MB-001/002 | TC-MB-01 | WBS-P4-13, WBS-P5-09 |
| FEAT-SISWA-02 | FR-PG-001 | §15.4 | API-PG-001/002 | TC-PG-01 | WBS-P4-13, WBS-P5-09 |
| FEAT-NOTIF-01 | FR-NOTIF-001 | §15.3 | API-NTF-001/002 | TC-NTF-01, TC-INT-03 | WBS-P4-14, WBS-P5-10 |
| FEAT-ADMIN-01 | FR-ADMIN-001 | §15.3 | API-USR-* | TC-ADM-01 | WBS-P4-04, WBS-P5-11 |
| FEAT-ADMIN-03 | FR-ADMIN-002 | §15.3/§15.4 | API-MST-*, API-JWL-002..004 | TC-ADM-02 | WBS-P4-04/09, WBS-P5-11 |
| FEAT-ADMIN-04 | FR-ADMIN-003 | §15.3/§15.4 | API-RPT-001/002 | TC-ADM-03 | WBS-P4-08, WBS-P5-11 |
| NFR-P-01 | NFR-USE-001 | §2, §10 | - | TC-UX-01, TC-COMPAT-02 | WBS-P2-07 |
| NFR-P-02 | NFR-USE-002 | §10 | - | TC-UX-02 | WBS-P2-08 |
| NFR-P-05 | NFR-USE-003 | §10 | - | TC-UX-04 | WBS-P2-08 |
| NFR-P-04 | NFR-PERF-001 | §9.2 | - | TC-COMPAT-03 | WBS-P6-05 |
| NFR-P-07 | NFR-OBS-001 | §9.2, §16.3b | `audit_logs` | TC-REL-04 | WBS-P7-05 |

Catatan: beberapa requirement tidak memerlukan endpoint sendiri (mis. FR-AUTH-004/005, FR-ABS-005/009/011) dan diuji melalui perilaku global; lihat `06-api-documentation.md §5`.

## 11. Catatan Konsistensi

- Setiap kolom `Req` merujuk `FR-*`/`NFR-*` yang ada di [03-srs.md](./03-srs.md); `AC` merujuk `AC-*` (SRS §8) atau `AC-P-*` (PRD §13).
- Test case yang bergantung pada backend/API/DB/perangkat diberi `Blocked`; yang hanya menyentuh frontend diberi `Not Run`. **Tidak ada** klaim `Pass`.
- Target NFR kuantitatif (DEC-06) tetap `Proposed`; pengujian performa/availability tidak dianggap final sebelum diratifikasi.
- Dokumen ini tidak mengubah kode aplikasi; eksekusi mengikuti [04-wbs.md](./04-wbs.md) Fase P7.