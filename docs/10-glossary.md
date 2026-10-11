# 10 — Glossary: LIMEN

- **Status dokumen:** Draft untuk ditinjau (pelengkap Fase G)
- **Versi:** 0.1
- **Tanggal:** 2026-10-11
- **Dokumen terkait:** [00-project-audit.md](./00-project-audit.md) · [01-project-overview.md](./01-project-overview.md) · [02-prd.md](./02-prd.md) · [03-srs.md](./03-srs.md) · [04-wbs.md](./04-wbs.md) · [05-sdd.md](./05-sdd.md) · [06-api-documentation.md](./06-api-documentation.md) · [07-uat-checklist.md](./07-uat-checklist.md) · [08-design-change-backup-plan.md](./08-design-change-backup-plan.md) · [09-decision-log.md](./09-decision-log.md)

## Cara Menggunakan Glosarium

- Definisi ditulis **singkat** dan **konsisten** dengan seluruh dokumen di `docs/`.
- Kolom **Jangan disamakan dengan** menandai istilah yang mudah tertukar; gunakan satu istilah untuk satu konsep.
- Istilah Inggris dipertahankan bila lebih tepat (mis. `design token`, `session cookie`).
- Singkatan dan ID dokumen dijelaskan di §8 dan §9.

## 1. Istilah Proyek dan Domain Sekolah

| Istilah | Definisi | Konteks | Jangan disamakan dengan |
| --- | --- | --- | --- |
| **LIMEN** | Nama produk: Sistem Absensi Terintegrasi untuk sekolah. | Seluruh dokumen. | — |
| **Sistem Absensi Terintegrasi** | Deskripsi LIMEN: pencatatan kehadiran siswa/guru yang terpusat dan tersambung perangkat IoT serta modul pendukung. | [01](./01-project-overview.md), [02](./02-prd.md). | "SIAK" yang merujuk sistem informasi akademik lain. |
| **Absensi** | Kegiatan/proses pencatatan kehadiran (masuk & pulang). | Inti produk. | **Kehadiran** (hasil/status per hari). |
| **Kehadiran** | Status/keadaan hadir-tidaknya seseorang pada suatu hari. | Rekap, status. | **Absensi** (prosesnya). |
| **SIAK/absensi** | Singkatan longgar untuk "sistem absensi" pada SRS §1.3; bukan produk pihak ketiga. | [03](./03-srs.md) §1.3. | Sistem akademik eksternal. |
| **Siswa** | Peserta didik. Peran kode `siswa`. | BR-14, DEC-07. | Guru. |
| **Guru Mata Pelajaran** | Guru pengampu mapel di kelas. Peran kode `guru_mapel`. | [02](./02-prd.md) §4. | Guru Wali, Guru BK. |
| **Guru Wali** | Wali kelas; memantau kehadiran, rapor, konseling kelas perwalian. Peran kode `guru_wali`. | FEAT-WALI-*, BR-14. | Guru Mata Pelajaran. |
| **Guru BK** | Guru Bimbingan Konseling; cakupan lintas kelas untuk konseling, rekap, minat bakat. Peran kode `guru_bk`. | FEAT-BK-*, BR-14. | Guru Wali. |
| **Admin Sekolah** | Administrator; kelola pengguna, data master, konfigurasi, reset password, tinjau absensi guru. Peran kode `admin`. | BR-02, DEC-07. | Guru. |
| **Mapel** | Singkatan **Mata Pelajaran**. | DR-002, jadwal. | Kelas. |
| **Kelas** | Rombongan belajar (mis. `10.1`). | `classes`, BR-14. | Mapel. |
| **Wali kelas** | Guru Wali yang bertanggung jawab atas satu kelas. | `classes.homeroom_teacher_user_id`. | Guru BK (lintas kelas). |
| **NIS** | Nomor Induk Siswa. | `students.nis`. | NIP. |
| **NIP** | Nomor Induk Pegawai (guru). | `teachers.nip`. | NIS. |
| **KKM** | Kriteria Ketuntasan Minimal; ambang nilai yang dapat dikonfigurasi per mapel/sekolah. | DEC-10, `assessments.kkm`. | **Passing grade** (ambang kampus). |
| **Passing grade** | Ambang/skor referensi masuk perguruan tinggi (data referensi yang dikelola Admin). | FR-PG-001, DEC-10. | **KKM**. |
| **Rapor** | Laporan nilai siswa per periode/per mapel. | FR-RAPOT-*, API-RPT-003. | Rekap absensi. |
| **Remedial** | Asesmen ulang bagi siswa di bawah KKM; sub-fitur penilaian. | DEC-09, FR-KORESI-002. | Koreksi jawaban. |
| **Konseling** | Pencatatan bimbingan siswa dan tindak lanjutnya. | FR-KONSELING-*, `counseling_notes`. | Minat bakat. |
| **Minat bakat** | Hasil asesmen minat/bakat siswa (mis. rekomendasi jurusan). | FR-MB-*, `aptitude_results`. | Passing grade. |

## 2. Istilah Absensi dan Perangkat

| Istilah | Definisi | Konteks | Jangan disamakan dengan |
| --- | --- | --- | --- |
| **IoT fingerprint** | Perangkat pemindai sidik jari yang mengirim event absensi. | BR-03, DEC-04. | Aplikasi web. |
| **Alat absensi** | Sinonim perangkat IoT; satu sekolah dapat memiliki **lebih dari satu** alat. | BR-11. | Kamera/QR. |
| **Absen masuk (check-in)** | Pencatatan kedatangan; nilai `eventType: check_in`. | FR-ABS-001. | Absen pulang. |
| **Absen pulang (check-out)** | Pencatatan kepulangan; nilai `eventType: check_out`. | FR-ABS-007. | Absen masuk. |
| **Jam masuk pertama** | Jam acuan keterlambatan yang diatur Admin (mis. 07:15 WIB). | FR-ABS-010, DEC-02, `school_settings.first_entry_time`. | Jam pelajaran. |
| **Terlambat** | Status bila absen masuk melewati jam masuk pertama. | FR-ABS-005, DEC-01/02. | Hadir. |
| **Tanda merah** | Penanda pada daftar absensi guru untuk subjek (siswa/guru) yang belum absen masuk pagi. | FR-ABS-009/013, BR-10. | Alpa. |
| **Status kehadiran** | Himpunan tetap: **Hadir, Terlambat, Izin, Sakit, Alpa** (nilai: `hadir`, `terlambat`, `izin`, `sakit`, `alpa`). | DEC-01, `attendance.status`. | Keterangan bebas. |
| **Koreksi absensi** | Permohonan mengubah status absensi; **diajukan guru, disetujui Admin**. Nilai status koreksi: `pending`, `approved`, `rejected`. | FR-ABS-004, BR-07, DEC-03. | Penetapan status manual. |
| **Penetapan status manual** | Guru menetapkan status untuk subjek yang **belum tercatat** perangkat (`source: manual`). | FR-ABS-002. | Koreksi (untuk yang sudah ada). |
| **Sumber absensi** | Asal rekaman: `device`, `manual`, atau `correction`. | `attendance.source`. | Status kehadiran. |
| **Ingestion** | Penerimaan event absensi mentah dari perangkat ke backend. | FR-ABS-006, DEC-04. | Input manual guru. |
| **Idempotensi** | Sifat operasi yang diulang menghasilkan efek sama (kirim ulang event tidak menggandakan). | §2.8 [06](./06-api-documentation.md), ADR-014. | Duplikasi. |
| **Identifier** | String penanda sidik jari yang dipetakan ke pengguna (`biometric_identities`); **bukan** UUID. | FR-ABS-006. | `deviceId`. |
| **WIB (Asia/Jakarta)** | Zona waktu acuan absensi dan keterlambatan. | BR-12, ADR-011. | Waktu server lain. |

## 3. Istilah Produk dan Rekayasa Kebutuhan

| Istilah | Definisi | Konteks | Jangan disamakan dengan |
| --- | --- | --- | --- |
| **PRD** | Product Requirements Document. | [02-prd.md](./02-prd.md). | SRS. |
| **SRS** | Software/System Requirements Specification. | [03-srs.md](./03-srs.md). | PRD. |
| **SDD** | System Design Document. | [05-sdd.md](./05-sdd.md). | SRS. |
| **WBS** | Work Breakdown Structure; rincian pekerjaan. | [04-wbs.md](./04-wbs.md). | Timeline/jadwal. |
| **ADR** | Architecture Decision Record; catatan keputusan arsitektur. | [09-decision-log.md](./09-decision-log.md). | Business rule. |
| **DEC-*** | Keputusan bisnis sementara (Provisional Decision) di SRS §11. | [03-srs.md](./03-srs.md) §11. | ADR. |
| **Requirement (FR/NFR)** | Kebutuhan fungsional (`FR-*`) dan nonfungsional (`NFR-*`). | [03-srs.md](./03-srs.md). | Fitur UI. |
| **Business Rule (BR-*)** | Aturan bisnis yang wajib dipatuhi sistem. | [03-srs.md](./03-srs.md) §5. | `DEC-*`. |
| **Acceptance Criteria (AC)** | Kriteria objektif yang dapat diuji; `AC-*` (sistem) dan `AC-P-*` (produk). | [03](./03-srs.md) §8, [02](./02-prd.md) §13. | Test case. |
| **User Story (US-*)** | Pernyataan kebutuhan dari sudut pandang peran. | [02](./02-prd.md) §9. | Requirement teknis. |
| **Definition of Done (DoD)** | Kondisi pekerjaan dianggap selesai. | [04-wbs.md](./04-wbs.md). | Acceptance criteria. |
| **MoSCoW** | Skala prioritas **Must / Should / Could** (tanpa "Won't" pada dokumen ini). | [02](./02-prd.md), [03](./03-srs.md). | Severity. |
| **Status requirement** | `Confirmed` (dikonfirmasi), `Proposed` (usulan), `TBD` (belum ditentukan). | [03-srs.md](./03-srs.md) Konvensi. | Status pekerjaan. |
| **Status pekerjaan** | `Selesai`, `Berjalan`, `Belum` pada WBS. | [04-wbs.md](./04-wbs.md). | Status requirement. |
| **Traceability** | Ketertelusuran antar-`FR`→SDD→API→UAT→WBS. | [07-uat-checklist.md](./07-uat-checklist.md) §10. | — |
| **Open Decision** | Keputusan yang harus dikonfirmasi pemilik produk/tim. | [00](./00-project-audit.md) §4. | Asumsi. |
| **Asumsi (A)** | Andaian sementara untuk menyusun rancangan; wajib divalidasi. | [02](./02-prd.md) label (A). | Fakta. |
| **Fase A–H** | Tahapan kerja dokumentasi (A Discovery … H Cross-Document Validation). | [MASTER_PROMPT](./restructure/MASTER_PROMPT.md). | Rilis. |

## 4. Istilah Teknis Frontend dan UI/UX

| Istilah | Definisi | Konteks | Jangan disamakan dengan |
| --- | --- | --- | --- |
| **SPA** | Single Page Application; frontend React dimuat sekali, navigasi di klien. | ADR-001. | SSR. |
| **React / TypeScript / Vite / Tailwind** | Stack frontend aktual (React 19, TS, Vite 8, Tailwind v4). | [00](./00-project-audit.md) §1. | Stack backend. |
| **React Router DOM** | Pustaka routing frontend. | ADR-001/005. | Routing backend. |
| **Route** | Jalur URL halaman (mis. `/dashboard`). | Audit AUD-005. | Endpoint API. |
| **Route guard** | Pengalih/penyembunyi UX berbasis peran; **bukan** keamanan. | ADR-004, FR-AUTH-004. | Otorisasi backend. |
| **Feature-first** | Struktur folder berdasar domain fitur (`src/features/*`). | ADR-005, SDD §3. | Layer-first. |
| **Design token** | Nilai desain terpusat (warna, tipografi, spacing, radius) via Tailwind `@theme`. | DEC-14, ADR-008. | Palet hardcoded. |
| **Baseline desain** | Versi desain acuan implementasi. | [08](./08-design-change-backup-plan.md) §A. | Mock figma pribadi. |
| **Change Request (DCR)** | Permintaan perubahan desain ber-ID. | [08](./08-design-change-backup-plan.md) §B. | Business change. |
| **Mobile-first** | Pendekatan desain mulai dari layar ponsel. | NFR-USE-001. | Desktop-first. |
| **Accessibility (a11y)** | Keteraksesan (kontras, label, navigasi keyboard); target WCAG 2.1 AA. | NFR-USE-003. | Responsif. |
| **Reusable component** | Komponen UI dipakai lintas fitur. | ADR-005, SDD §4. | Komponen fitur. |
| **State management** | Pengelolaan state klien; server-state via query library, local-state via hooks. | ADR-009. | Database state. |
| **OpenAPI** | Spesifikasi mesin kontrak API (`docs/openapi.yaml`). | ADR-002. | Dokumentasi naratif. |

## 5. Istilah Backend, Data, dan API

| Istilah | Definisi | Konteks | Jangan disamakan dengan |
| --- | --- | --- | --- |
| **Go** | Bahasa backend yang direncanakan. | SDD §5. | — |
| **PostgreSQL** | Database relasional yang direncanakan. | SDD §15. | — |
| **Handler → Service → Repository** | Lapisan backend: transport → aturan bisnis → akses data. | ADR-006. | Monolit campur. |
| **Migration** | Perubahan skema berversi; pola **expand-contract**, **forward-only** di produksi. | ADR-015, SDD §16.1. | Seed. |
| **Seed** | Data awal idempoten (mis. `roles`, `school_settings`). | SDD §16.1. | Migration. |
| **Endpoint** | Titik akses API (method + path). Status: `Proposed`, `Approved`, `Implemented`. | [06-api-documentation.md](./06-api-documentation.md). | Route frontend. |
| **Kontrak API** | Kesepakatan bentuk request/response antartim; sumber kebenaran OpenAPI. | IR-API-004, ADR-002. | Implementasi. |
| **Envelope error** | Format error seragam `{ code, message, details? }`. | §2.5 [06](./06-api-documentation.md). | Pesan bebas. |
| **Pagination** | Pembagian hasil daftar (`page`, `pageSize`, `items`, `total`). | §2.6 [06](./06-api-documentation.md). | Filter. |
| **`attendance_events`** | Tabel event mentah perangkat (append-only, idempoten). | SDD §15.3, ADR-014. | `attendance_records`. |
| **`attendance_records`** | Tabel rekaman harian per subjek + status. | SDD §15.3. | `attendance_events`. |
| **`school_settings`** | Tabel konfigurasi sekolah (jam masuk, TZ, toleransi). | FR-ABS-010, DEC-02. | `sessions`. |
| **`audit_logs`** | Tabel jejak audit perubahan (aktor, aksi, before/after). | BR-09, ADR-016. | Log aplikasi biasa. |
| **`sessions`** | Tabel sesi login server-side. | ADR-007, DEC-05. | Sesi browser. |
| **`biometric_identities`** | Pemetaan `identifier` sidik jari → pengguna. | FR-ABS-006. | `devices`. |
| **Soft-delete** | Penandaan nonaktif alih-alih hapus fisik. | SDD §15.1 (`TBD`). | Hard delete. |

## 6. Istilah Autentikasi, Sesi, dan Otorisasi

| Istilah | Definisi | Konteks | Jangan disamakan dengan |
| --- | --- | --- | --- |
| **Autentikasi** | Pembuktian identitas (login email+password). | BR-01, FR-AUTH-001. | **Otorisasi**. |
| **Otorisasi** | Pemeriksaan hak akses per peran/data. | BR-14, NFR-SEC-002. | **Autentikasi**. |
| **RBAC** | Role-Based Access Control; akses berdasarkan peran. | DEC-07, SDD §7.3. | Autentikasi. |
| **Session cookie** | Cookie sesi server-side `limen_session` (HttpOnly, Secure, SameSite=Lax). | ADR-003, DEC-05. | JWT. |
| **CSRF** | Cross-Site Request Forgery; dilindungi cookie `limen_csrf` + header `X-CSRF-Token`. | §2.2 [06](./06-api-documentation.md). | XSS. |
| **Argon2id** | Algoritma hash password. | NFR-SEC-003, DEC-05. | Enkripsi. |
| **Rate limiting** | Pembatasan laju percobaan (mis. login) untuk anti brute-force. | NFR-SEC-004. | Throttling UI. |
| **Idle timeout / Absolute timeout** | Batas sesi karena tidak aktif (30 mnt) / total (12 jam). | FR-AUTH-005, DEC-05. | Logout manual. |
| **401 / 403** | `401` belum terautentikasi; `403` terautentikasi tanpa hak. | §2.5 [06](./06-api-documentation.md). | 404. |
| **JWT** | JSON Web Token; **tidak dipakai** pada desain ini. | ADR-003b. | Session cookie. |

## 7. Istilah Pengujian dan Perubahan

| Istilah | Definisi | Konteks | Jangan disamakan dengan |
| --- | --- | --- | --- |
| **UAT** | User Acceptance Testing oleh pengguna/stakeholder. | [07-uat-checklist.md](./07-uat-checklist.md). | Unit test. |
| **Test Case (TC-*)** | Skenario uji ber-ID. | [07](./07-uat-checklist.md). | Requirement. |
| **Status UAT** | `Not Run`, `Pass`, `Fail`, `Blocked`, `Not Applicable`. | [07](./07-uat-checklist.md) §2. | Status requirement. |
| **Blocked** | Tidak dapat dijalankan karena ketergantungan belum ada (backend/API/DB/perangkat). | [07](./07-uat-checklist.md) §2. | `Fail`. |
| **Regression testing** | Pengujian ulang untuk memastikan perubahan tidak merusak yang lama. | [07](./07-uat-checklist.md) §8.3, [08](./08-design-change-backup-plan.md) §C. | UAT fitur baru. |
| **Visual regression** | Deteksi perubahan tampilan tak sengaja. | [08](./08-design-change-backup-plan.md) §F. | Fungsional. |
| **Rollback** | Pengembalian ke versi sebelumnya saat perubahan gagal. | [08](./08-design-change-backup-plan.md) §E. | Backup. |
| **Backup** | Salinan repo/aset/data untuk pemulihan. | [08](./08-design-change-backup-plan.md) §D. | Rollback. |
| **Go/No-Go** | Keputusan menerima/menolak rilis berdasarkan kriteria. | [07](./07-uat-checklist.md) §9. | Definition of Done. |
| **Severity** | Tingkat keparahan kegagalan (Blocker/Critical/Major/Minor). | [07](./07-uat-checklist.md) §2. | Prioritas MoSCoW. |

## 8. Singkatan

| Singkatan | Arti |
| --- | --- |
| **AC / AC-P** | Acceptance Criteria (SRS) / Acceptance Criteria tingkat Produk (PRD). |
| **ADR** | Architecture Decision Record. |
| **AUD** | ID temuan audit. |
| **API** | Application Programming Interface. |
| **BR** | Business Rule. |
| **CRUD** | Create, Read, Update, Delete. |
| **CSRF** | Cross-Site Request Forgery. |
| **DB** | Database. |
| **DCR** | Design Change Request. |
| **DEC** | Provisional (Business) Decision di SRS §11. |
| **DoD** | Definition of Done. |
| **DR** | Data Requirement. |
| **FE / BE** | Frontend / Backend. |
| **FEAT** | ID fitur di PRD. |
| **FR / NFR** | Functional / Non-Functional Requirement. |
| **IoT** | Internet of Things. |
| **IR** | Interface Requirement (UI/SW/API). |
| **JSON / HTTPS** | Format data / protokol aman. |
| **KKM** | Kriteria Ketuntasan Minimal. |
| **NIS / NIP** | Nomor Induk Siswa / Pegawai. |
| **PII** | Personally Identifiable Information. |
| **PRD / SRS / SDD / WBS** | Dokumen produk/kebutuhan/desain/rencana kerja. |
| **RBAC** | Role-Based Access Control. |
| **REST** | Representational State Transfer. |
| **SLA** | Service Level Agreement. |
| **SPA / SSR** | Single Page Application / Server-Side Rendering. |
| **TBD** | To Be Determined (belum ditentukan). |
| **TC / UAT** | Test Case / User Acceptance Testing. |
| **TZ / WIB** | Timezone / Waktu Indonesia Barat (Asia/Jakarta). |
| **UI / UX** | User Interface / User Experience. |

## 9. Awalan ID (Konvensi Penamaan)

| Awalan | Contoh | Di mana |
| --- | --- | --- |
| `AUD-` | `AUD-001` | [00-project-audit.md](./00-project-audit.md) |
| `GOAL-` | `GOAL-01` | [02-prd.md](./02-prd.md) §3 |
| `FEAT-` | `FEAT-ABS-01` | [02-prd.md](./02-prd.md) §7 |
| `US-` | `US-01` | [02-prd.md](./02-prd.md) §9 |
| `Q-` | `Q-01` | [02-prd.md](./02-prd.md) §15 |
| `FR-` / `NFR-` | `FR-ABS-001`, `NFR-SEC-001` | [03-srs.md](./03-srs.md) |
| `BR-` | `BR-14` | [03-srs.md](./03-srs.md) §5 |
| `IR-` | `IR-API-001` | [03-srs.md](./03-srs.md) §6 |
| `DR-` | `DR-003` | [03-srs.md](./03-srs.md) §7 |
| `AC-` / `AC-P-` | `AC-08`, `AC-P-06` | [03](./03-srs.md) §8 / [02](./02-prd.md) §13 |
| `DEC-` | `DEC-05` | [03-srs.md](./03-srs.md) §11 |
| `ADR-` | `ADR-007` | [09-decision-log.md](./09-decision-log.md) |
| `SDD-OI-` / `DB-` | `SDD-OI-02`, `DB-01` | [05-sdd.md](./05-sdd.md) |
| `API-` | `API-ABS-001` | [06-api-documentation.md](./06-api-documentation.md) |
| `K-` | `K-04` | [06-api-documentation.md](./06-api-documentation.md) §24 |
| `WBS-P<fase>-` | `WBS-P4-05` | [04-wbs.md](./04-wbs.md) |
| `TC-` | `TC-ABS-01` | [07-uat-checklist.md](./07-uat-checklist.md) |
| `DCR-` | `DCR-001` | [08-design-change-backup-plan.md](./08-design-change-backup-plan.md) |
| `RSK-` | `RSK-004` | [01-project-overview.md](./01-project-overview.md) §9 |

## 10. Catatan Konsistensi

- Istilah yang dipakai implementasi data (`hadir`, `terlambat`, `izin`, `sakit`, `alpa`; peran `siswa`, `guru_mapel`, `guru_wali`, `guru_bk`, `admin`) mengikuti [06-api-documentation.md](./06-api-documentation.md) §2.11.
- Makna "route" (frontend) selalu dibedakan dari "endpoint" (API).
- "Koreksi" pada konteks absensi berbeda dari "koreksi jawaban" pada konteks quiz; glosarium memakai keduanya dengan konteks eksplisit.
- Istilah berstatus `Proposed`/`TBD` tetap belum final dan tidak diangkat menjadi fakta oleh dokumen ini.