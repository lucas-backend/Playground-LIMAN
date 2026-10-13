/**
 * Model modul Konseling Guru Wali - FR-KONSELING-001/002 (docs/03-srs.md):
 * guru wali melihat catatan konseling siswa, menambah catatan wali kelas, dan
 * mengisi tindak lanjut atas catatan BK.
 *
 * Kontrak backend: API-KSL-001..003 di `/api/v1/counseling-notes`
 * (docs/06-api-documentation.md), entitas `counseling_notes` (docs/05-sdd.md).
 * Kontrak masih `Proposed` dan backend belum tersedia (KD-07 `Blocked`),
 * sehingga tipe di bawah adalah model tampilan yang diisi adapter mock
 * (`../api/konselingApi.ts`).
 *
 * Catatan: catatan BK juga dipakai modul BK (`guruBK/Konseling`). Duplikasi tipe
 * lokal ini disengaja agar tidak ada ketergantungan lintas fitur; konsolidasi
 * ke fitur `konseling` (SDD) ditunda sampai keputusan arsitektur diratifikasi.
 */

/** Sub-tab catatan pada halaman konseling siswa. */
export type KonselingSubTab = "wali" | "bk";

/** Identitas ringkas siswa yang dibahas. */
export interface SiswaKonseling {
  id: string;
  nama: string;
  kelas: string;
}

/** Catatan yang ditulis wali kelas untuk siswa. */
export interface CatatanWaliKelas {
  id: string;
  /** Tanggal ISO `YYYY-MM-DD`. */
  tanggal: string;
  isi: string;
  /** Tindak lanjut dari guru BK, bila sudah ada. */
  tindakLanjutBk: string | null;
}

/** Catatan yang ditulis guru BK untuk siswa. */
export interface CatatanBk {
  id: string;
  /** Tanggal ISO `YYYY-MM-DD`. */
  tanggal: string;
  isi: string;
  /** Tindak lanjut dari wali kelas, bila sudah ada. */
  tindakLanjutWaliKelas: string | null;
}

/** Data halaman konseling siswa (identitas + daftar catatan wali & BK). */
export interface KonselingSiswaData {
  siswa: SiswaKonseling;
  catatanWali: CatatanWaliKelas[];
  catatanBk: CatatanBk[];
}

const NAMA_HARI = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
] as const;

/** Format ISO `YYYY-MM-DD` menjadi `Hari, DD/MM/YYYY` (mis. `Rabu, 21/10/2026`). */
export function formatTanggal(iso: string): string {
  const bagian = iso.split("-");
  if (bagian.length !== 3) {
    return iso;
  }
  const tahun = Number(bagian[0]);
  const bulan = Number(bagian[1]);
  const hari = Number(bagian[2]);
  const tanggal = new Date(tahun, bulan - 1, hari);
  if (Number.isNaN(tanggal.getTime())) {
    return iso;
  }
  const namaHari = NAMA_HARI[tanggal.getDay()] ?? "";
  const dd = String(hari).padStart(2, "0");
  const mm = String(bulan).padStart(2, "0");
  return `${namaHari}, ${dd}/${mm}/${tahun}`;
}
