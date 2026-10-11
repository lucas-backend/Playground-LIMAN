# 09 — Decision Log (ADR) LIMEN

- **Status:** Aktif (draft Fase 4A)
- **Tanggal:** 2026-10-11
- **Dokumen terkait:** [05-sdd.md](./05-sdd.md) · [03-srs.md](./03-srs.md) · [02-prd.md](./02-prd.md)

Catatan: **Status** ADR mengikuti kaidah umum (Proposed/Accepted/Deprecated). Tidak ada ADR berstatus *Accepted* pada tahap ini kecuali yang bersumber dari fakta stakeholder (ditandai). Decision bisnis sementara (DEC-*) tetap berada di `03-srs.md` dan dirujuk di sini.

## Ringkasan

| ADR | Judul | Status | Sumber |
| --- | --- | --- | --- |
| ADR-001 | Frontend SPA (React+Vite), bukan SSR | Proposed | SDD §11 |
| ADR-002 | REST/JSON contract-first via OpenAPI | Proposed | SDD §6 |
| ADR-003 | Autentikasi session cookie server-side (bukan JWT) | Proposed | SDD §7.2, DEC-05 |
| ADR-004 | Otorisasi di backend; route guard hanya UX | Proposed (prinsip Confirmed) | SRS NFR-SEC-002 |
| ADR-005 | Struktur frontend feature-first + lapisan shared | Proposed | SDD §3–§4 |
| ADR-006 | Backend Go berlapis handler→service→repository | Proposed | SDD §5 |
| ADR-007 | Session store: PostgreSQL (bukan Redis) untuk awal | Proposed | SDD §7.2 |
| ADR-008 | Design token terpusat (Tailwind v4); baseline = frontend existing | Proposed | SDD §10, DEC-14 |
| ADR-009 | Server-state via query library; local state via hooks | Proposed | SDD §2.2 |
| ADR-010 | Mono-repo frontend + backend | Proposed | SDD §11 |
| ADR-011 | Zona waktu domain absensi = Asia/Jakarta (WIB) | **Confirmed** | 02-prd BR-12 |
| ADR-012 | Model identitas: `users` + profil `students`/`teachers` | Proposed | SDD §15.3 |
| ADR-013 | Peran sebagai relasi M:N (`user_roles`) | Proposed | SDD §15.3, SDD-OI-07 |
| ADR-014 | Absensi: event append-only + agregat harian | Proposed | SDD §15.3, §16 |
| ADR-015 | Migration expand-contract, forward-only | Proposed | SDD §16.1 |
| ADR-016 | Audit terpusat via `audit_logs` | Proposed | SDD §15.3, §16 |

---

## ADR-001 — Frontend SPA (React + Vite), bukan SSR

- **Status:** Proposed
- **Konteks:** Frontend sudah berupa SPA (React+Vite+TS) dengan React Router (audit). Aplikasi berada di balik login; tidak ada kebutuhan SEO publik.
- **Keputusan:** Pertahankan SPA; tambahkan lazy loading dan layout/guard UX.
- **Alternatif:** Migrasi ke SSR (Next) — ditolak: biaya besar, manfaat (SEO/SSR) tidak relevan untuk aplikasi internal.
- **Konsekuensi:** Bootstrap cepat; perlu mengelola loading state & guard di klien; keamanan tetap di backend.
- **Terkait:** SDD §2, §11.

## ADR-002 — REST/JSON contract-first via OpenAPI

- **Status:** Proposed
- **Konteks:** Tim frontend & backend terpisah; belum ada endpoint (0 endpoint).
- **Keputusan:** Satu spesifikasi OpenAPI sebagai sumber kebenaran; versioning `/api/v1`; envelope error seragam.
- **Alternatif:** GraphQL — ditolak: overkill untuk CRUD, tooling tim belum mendukung.
- **Konsekuensi:** Perlu disiplin menjaga spec; tipe frontend dapat di-generate.
- **Terkait:** SDD §6; SRS IR-API-001..003.

## ADR-003 — Autentikasi session cookie server-side (bukan JWT)

- **Status:** Proposed
- **Konteks:** Aplikasi web monolitik; Admin mereset password (BR-02) → butuh revokasi sesi.
- **Keputusan:** Sesi server-side dengan cookie HttpOnly/Secure/SameSite + proteksi CSRF; TTL mengikuti DEC-05.
- **Alternatif:** JWT stateless — ditolak: revokasi sulit, tidak dibutuhkan pada skala ini.
- **Konsekuensi:** Butuh store sesi dan proteksi CSRF; revokasi instan.
- **Terkait:** SDD §7, DEC-05, FR-AUTH-001..006.

## ADR-003b — Catatan: JWT bukan kewajiban

- JWT **tidak** dijadikan keharusan. Bila di masa depan muncul kebutuhan klien non-browser/skala besar, keputusan ditinjau ulang melalui ADR baru.

## ADR-004 — Otorisasi di backend; route guard hanya UX

- **Status:** Proposed (prinsip **Confirmed**)
- **Konteks:** Route guard tak dapat dipercaya (klien dapat dimodifikasi).
- **Keputusan:** Semua otorisasi peran divalidasi backend (SRS NFR-SEC-002); frontend hanya mengarahkan/menyembunyikan untuk UX.
- **Alternatif:** Membatasi hanya di klien — ditolak (tidak aman).
- **Konsekuensi:** Duplikasi aturan peran di klien (UX) & server (otoritatif) — dibatasi pada frontend.
- **Terkait:** SDD §7.3, BR-14/DEC-07.

## ADR-005 — Struktur frontend feature-first + lapisan shared

- **Status:** Proposed
- **Konteks:** Repo sudah dominan `features/` (15 area), tetapi `App.tsx` monolitik, ada duplikasi, tanpa lapisan API.
- **Keputusan:** Pertahankan feature-first; standarkan sub-folder; angkat komponen lintas fitur ke `shared/`; routing ke `app/`.
- **Alternatif:** Reorganisasi menyeluruh — ditolak: risiko tinggi, tak sepadan.
- **Konsekuensi:** Refactor bertahap; perbaiki bug import & duplikasi (AUD-002/008/009).
- **Terkait:** SDD §3–§4.

## ADR-006 — Backend Go berlapis handler→service→repository

- **Status:** Proposed
- **Konteks:** Stack Go+PostgreSQL direncanakan; domain absensi punya aturan (WIB, koreksi+audit, idempotensi).
- **Keputusan:** Pisahkan transport/domain/persistensi; ingestion perangkat masuk lewat service.
- **Alternatif:** Handler langsung ke DB — ditolak: aturan bercampur, sulit diuji.
- **Konsekuensi:** Lebih banyak tipe/interface; uji terisolasi lebih mudah.
- **Terkait:** SDD §5, §9.4.

## ADR-007 — Session store PostgreSQL (bukan Redis) untuk awal

- **Status:** Proposed
- **Konteks:** Skala sekolah; sederhana lebih penting daripada latensi ekstrem.
- **Keputusan:** Simpan sesi di PostgreSQL; Redis ditinjau bila skala menuntut (SDD-OI-03).
- **Alternatif:** Redis sejak awal — ditolak: komponen tambahan tanpa kebutuhan terbukti.
- **Konsekuensi:** Bergantung DB untuk sesi; perlu indeks kedaluwarsa/pembersihan.
- **Terkait:** SDD §7.2.

## ADR-008 — Design token terpusat; baseline = frontend existing

- **Status:** Proposed
- **Konteks:** Tidak ada aset desain resmi (audit); token harus siap dikoreksi.
- **Keputusan:** Token via Tailwind v4 `@theme`; baseline mengikuti UI existing (DEC-14).
- **Alternatif:** Menunggu desain resmi — ditolak: memblokir pengembangan.
- **Konsekuensi:** Kemungkinan rework terbatas pada token saat desain datang.
- **Terkait:** SDD §10, IR-UI-001, DEC-14.

## ADR-009 — Server-state via query library; local state via hooks

- **Status:** Proposed
- **Konteks:** Belum ada state library; data dominan berasal dari server.
- **Keputusan:** Gunakan library server-state (mis. TanStack Query) + local state React; hindari store global berat.
- **Alternatif:** Redux — ditolak: beban boilerplate untuk kebutuhan ini.
- **Konsekuensi:** Perlu konvensi `queryKeys`; caching & invalidasi terkelola.
- **Terkait:** SDD §2.2, §4.

## ADR-010 — Mono-repo frontend + backend

- **Status:** Proposed
- **Konteks:** Kontrak OpenAPI perlu sinkron; tim kecil.
- **Keputusan:** Satu repo dengan `frontend/` (existing `src`) dan `backend/`.
- **Alternatif:** Repo terpisah — ditolak: koordinasi kontrak lebih rumit.
- **Konsekuensi:** Perlu penataan root; pipeline CI menyaring per folder.
- **Terkait:** SDD §11.

## ADR-011 — Zona waktu domain absensi = Asia/Jakarta (WIB)

- **Status:** **Confirmed** (stakeholder, BR-12)
- **Konteks:** Penentuan keterlambatan bergantung jam lokal.
- **Keputusan:** Semua perbandingan jam absensi memakai WIB; simpan timestamp dengan offset.
- **Alternatif:** UTC murni untuk aturan keterlambatan — ditolak: aturan bisnis berbasis WIB.
- **Konsekuensi:** Server harus konsisten TZ; pengujian lintas DST tidak relevan (WIB tanpa DST).
- **Terkait:** SDD §1/§5/§9, FR-ABS-011.

- **Konsekuensi:** Server harus konsisten TZ; pengujian lintas DST tidak relevan (WIB tanpa DST).
- **Terkait:** SDD §1/§5/§9, FR-ABS-011.

---

## ADR-012 — Model identitas: `users` + profil `students`/`teachers`

- **Status:** Proposed
- **Konteks:** Login (BR-01) berlaku untuk semua peran; guru & siswa punya atribut khusus (NIS/NIP, kelas).
- **Keputusan:** `users` menyimpan identitas/autentikasi; `students` & `teachers` sebagai profil 1:1 berisi atribut khusus.
- **Alternatif:** (a) Satu tabel dengan banyak kolom nullable; (b) tabel terpisah per peran termasuk kredensial. — (a) kotor secara skema; (b) menduplikasi autentikasi.
- **Trade-off:** Menambah satu join untuk profil; memisahkan kredensial dari data domain (lebih aman).
- **Status keputusan:** Proposed (perlu persetujuan backend, §18 SDD-OI).

## ADR-013 — Peran sebagai relasi M:N (`user_roles`)

- **Status:** Proposed
- **Konteks:** Satu guru dapat menjadi Guru Mapel sekaligus Guru Wali.
- **Keputusan:** Tabel `roles` + `user_roles` (PK komposit).
- **Alternatif:** Kolom tunggal `users.role` — lebih sederhana tetapi gagal menampung peran ganda.
- **Trade-off:** Sedikit lebih kompleks pada query otorisasi; integritas & fleksibilitas lebih baik.
- **Status keputusan:** Perlu diputuskan (SDD-OI-07).

## ADR-014 — Absensi: event append-only + agregat harian

- **Status:** Proposed
- **Konteks:** Perlu idempotensi dari banyak alat (BR-11), dan rekaman harian berstatus (NFR-DATA-001).
- **Keputusan:** `attendance_events` (mentah, unik per device/identifier/timestamp/type) → diproyeksikan ke `attendance_records` (satu baris per subjek per hari).
- **Alternatif:** Hanya simpan `attendance_records` (kehilangan jejak mentah & rentan duplikasi) atau hanya events (query rekap berat).
- **Trade-off:** Redundansi terkendali untuk performa baca & audit; perlu logika proyeksi idempoten.
- **Status keputusan:** Proposed.

## ADR-015 — Migration expand-contract, forward-only

- **Status:** Proposed
- **Konteks:** Skema akan berkembang; produksi tidak boleh downtime.
- **Keputusan:** Migration berversi; expand-contract; forward-only di produksi; seed idempoten.
- **Alternatif:** Migrasi destruktif langsung — risiko data hilang/downtime.
- **Trade-off:** Perlu disiplin & beberapa langkah per perubahan skema.
- **Status keputusan:** Proposed.

## ADR-016 — Audit terpusat via `audit_logs`

- **Status:** Proposed
- **Konteks:** Perlunya jejak perubahan absensi/nilai (BR-09, NFR-OBS-001, DEC-11).
- **Keputusan:** Satu tabel `audit_logs` (aktor, entitas, aksi, before/after JSONB, timestamp), append-only.
- **Alternatif:** Kolom `updated_by` saja (tak cukup) atau pola event-sourcing penuh (berlebihan).
- **Trade-off:** Menambah tulisan per mutasi; retensi perlu kebijakan (DEC-11).
- **Status keputusan:** Proposed.

---

## Rujukan keputusan bisnis (DEC-*) di `03-srs.md`| DEC | Ringkas | Status |
| --- | --- | --- |
| DEC-01 | Status kehadiran & tanda merah | Confirmed |
| DEC-02 | Keterlambatan vs jam masuk Admin (WIB) | Confirmed |
| DEC-03 | Koreksi absensi & persetujuan | Proposed |
| DEC-04 | Integrasi IoT (ingestion HTTP+JSON) | Proposed; detail `TBD` |
| DEC-04b | Alur harian absensi | Confirmed |
| DEC-05 | Session cookie + Argon2id + rate limit | Proposed |
| DEC-06 | Target NFR (perf/availability/WCAG) | Proposed |
| DEC-07 | Batas akses data per peran | Proposed |
| DEC-08 | Satu aplikasi terintegrasi | Proposed |
| DEC-09 | Remedial = sub-fitur penilaian | Proposed |
| DEC-10 | KKM konfigurabel | Proposed |
| DEC-11 | Retensi data & audit | Proposed |
| DEC-12 | Notifikasi in-app | Proposed |
| DEC-13 | Ekspor CSV/Excel/PDF | Proposed |
| DEC-14 | Design baseline | Proposed |
| DEC-15 | Absensi guru (jam sama, Terlambat, Admin tinjau, tanda merah) | Confirmed |
