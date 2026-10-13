/**
 * Model modul Rapot Guru Wali — FR-RAPOT-001/002 (docs/03-srs.md):
 * guru wali melihat rapor siswa (nilai per mapel) dan detail nilai per mapel.
 *
 * Kontrak backend: API-RPT-003 `GET /students/{studentId}/report-card`
 * (docs/06-api-documentation.md), entitas `assessment_scores`, `subjects`
 * (docs/05-sdd.md §15.4). Kontrak masih `Proposed` dan backend belum tersedia
 * (KD-07 `Blocked`), sehingga tipe di bawah adalah model tampilan yang diisi
 * adapter mock (`../api/rapotApi.ts`). Saat kontrak disetujui, adapter
 * memetakan DTO `{ studentUserId, period, subjects: [{ subjectId,
 * subjectName, score, kkm }] }` ke model ini.
 *
 * Catatan keterbatasan: sub-route `rapot/absensi/*` belum punya endpoint
 * khusus pada kontrak; saat integrasi, penyediaan datanya menunggu keputusan
 * (kandidat terdekat API-RPT-001 rekap absensi).
 */

/** Satu baris ringkasan nilai per mata pelajaran. */
export interface RapotMapelItem {
  id: string;
  nama: string;
  nilai: number;
}

/** Data halaman daftar rekap nilai siswa. */
export interface RapotSiswaWaliData {
  nama: string;
  mapel: readonly RapotMapelItem[];
}

/** Satu nilai (tugas/ulangan/PTS/PAS dsb.). */
export interface RapotSkorItem {
  nama: string;
  skor: number;
}

/** Kategori nilai pada detail mapel. */
export interface RapotKategoriNilai {
  kategori: string;
  items: readonly RapotSkorItem[];
}

/** Data halaman detail nilai per mapel. */
export interface RapotMapelDetailData {
  nama: string;
  mapel: string;
  kategori: readonly RapotKategoriNilai[];
  nilaiAkhir: number;
}

/** Satu baris tabel rekap absensi per materi. */
export interface RapotAbsensiMateriRow {
  materi: string;
  jp: number;
  h: number;
  i: number;
  s: number;
  a: number;
  d: number;
}

/** Data halaman rekap absensi per materi. */
export interface RapotAbsensiData {
  nama: string;
  mapel: string;
  rows: readonly RapotAbsensiMateriRow[];
}

/** Satu baris daftar pertemuan absensi materi. */
export interface RapotAbsensiPertemuanRow {
  pertemuan: string;
  tanggal: string;
  status: string;
}

/** Data halaman detail pertemuan absensi per materi. */
export interface RapotAbsensiMateriData {
  nama: string;
  mapelBab: string;
  rows: readonly RapotAbsensiPertemuanRow[];
}