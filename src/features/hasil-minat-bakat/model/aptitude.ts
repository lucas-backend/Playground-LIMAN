/**
 * Model domain modul Hasil Minat Bakat (siswa).
 *
 * Sumber kontrak: docs/06-api-documentation.md §20 (API-MB-001/002) dan
 * docs/openapi.yaml (schema `AptitudeResult`, `TargetMajor`). Kontrak
 * berstatus `Proposed` dan backend belum tersedia (KD-07/KD-09 `Blocked`).
 *
 * Batas jujur: halaman demo menampilkan ringkasan (minat, bakat,
 * rekomendasi jurusan) dan daftar "Target Jurusan Lain" yang saat ini TIDAK
 * disediakan kontrak endpoint mana pun. Tipe berjuluk view di bawah memodelkan
 * tampilan UI lama, bukan respons API. Jangan menaikkan field tampilan ini
 * menjadi kontrak backend tanpa persetujuan.
 */

// ============ Kontrak API (docs/06-api-documentation.md §20) ============

export interface AptitudeResult {
  id: string;
  result: string;
  assessedAt: string;
}

export interface AptitudeResultsResponse {
  studentUserId: string;
  results: AptitudeResult[];
}

export interface AddTargetMajorPayload {
  major: string;
}

export interface TargetMajor {
  id: string;
  studentUserId: string;
  major: string;
  createdAt: string;
}

// ============ Tampilan (tanpa kontrak; lihat model/aptitude.mock.ts) ============

export interface HasilMinatBakatSummary {
  minat: string;
  bakat: string;
  rekomendasi: string[];
}

export interface TargetJurusanLainItem {
  id: string;
  nama: string;
}

export interface UniversitasOption {
  id: string;
  nama: string;
  listJurusan: string[];
}

export interface JurusanDetail {
  nama: string;
  mapelTka: string[];
  daftarUniversitas: Array<{
    id: string;
    nama: string;
    scoreSnbp: number;
    scoreSnbt: number;
  }>;
}

// ============ Helper murni ============

/** Format ISO-8601 (offset +07:00) menjadi dd/mm/yyyy dalam Asia/Jakarta (BR-12). */
export function formatTanggalTes(iso: string): string {
  if (iso === "") return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  // "en-GB" menghasilkan dd/mm/yyyy.
  return date.toLocaleDateString("en-GB", { timeZone: "Asia/Jakarta" });
}