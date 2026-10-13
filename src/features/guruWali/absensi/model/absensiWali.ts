import {
  ATTENDANCE_STATUS_LABELS,
  type AttendanceStatus,
} from "@/shared/types";

/**
 * Model domain modul Absensi Guru Wali (FR-ABS-003).
 *
 * Sumber requirement: SRS FR-ABS-003 — "Pengguna berwenang dapat melihat
 * riwayat/detail absensi per siswa/kelas". Data absensi mengikuti kontrak
 * API-ABS-002 (`GET /attendance/records`) dan API-ABS-003
 * (`GET /attendance/records/{recordId}`) — docs/06-api-documentation.md §3.
 * Kontrak masih `Proposed` dan backend belum tersedia (KD-07 `Blocked`),
 * sehingga `../api/absensiWaliApi.ts` memakai adapter mock sementara.
 *
 * Catatan penyimpangan (jujur): tampilan lama memakai 5 kolom rekap
 * H/I/S/A/D dengan D = "Dispensasi" (lihat juga `features/guruBK/Rekap/Absen`).
 * "Dispensasi" **bukan** bagian dari himpunan status resmi DEC-01/FR-ABS-005
 * (Hadir, Terlambat, Izin, Sakit, Alpa). Nilai tersebut dipertahankan agar
 * tampilan tidak berubah, tetapi ditandai sebagai konsep UI lama yang masih
 * menunggu keputusan produk. `shared/types/attendance.ts` sengaja **tidak**
 * diubah agar domain resmi tetap bersih.
 */

/** Rekap jumlah kehadiran menurut kolom H/I/S/A/D. */
export interface RekapKehadiran {
  hadir: number;
  izin: number;
  sakit: number;
  alpa: number;
  /** Kolom "D" pada UI lama; bukan bagian enum resmi DEC-01. */
  dispensasi: number;
}

/** Konfigurasi kolom rekap (urutan & label H/I/S/A/D). */
export const KOLOM_REKAP: readonly {
  key: keyof RekapKehadiran;
  kode: string;
  judul: string;
}[] = [
  { key: "hadir", kode: "H", judul: "Hadir" },
  { key: "izin", kode: "I", judul: "Izin" },
  { key: "sakit", kode: "S", judul: "Sakit" },
  { key: "alpa", kode: "A", judul: "Alpa" },
  { key: "dispensasi", kode: "D", judul: "Dispensasi" },
];

/** Identitas kelas perwalian. */
export interface WaliKelasInfo {
  id: string;
  nama: string;
}

/** Keterangan absensi per mata pelajaran/pertemuan. */
export type KeteranganAbsensi = AttendanceStatus | "dispensasi";

/** Label tampilan keterangan absensi. */
export const KETERANGAN_LABELS: Record<KeteranganAbsensi, string> = {
  ...ATTENDANCE_STATUS_LABELS,
  dispensasi: "Dispen",
};

/** Baris siswa pada daftar kelas perwalian (tab menu wali kelas). */
export interface SiswaWali {
  id: string;
  nama: string;
  rekap: RekapKehadiran;
  /**
   * Persentase nilai untuk tab Rapot. Ini **placeholder** milik modul Rapot
   * Guru Wali (#13) yang belum dimigrasikan; disertakan agar tab menu tetap
   * berfungsi tanpa data mock di dalam komponen. Ganti saat #13 selesai.
   */
  persentaseNilai: string;
}

/** Rekap absensi satu hari (kolom H/I/S/A/D per tanggal). */
export interface AbsensiHarian {
  tanggal: string;
  rekap: RekapKehadiran;
}

/** Satu pertemuan (mata pelajaran) pada detail absensi harian. */
export interface AbsensiPertemuan {
  id: string;
  waktu: string;
  mapel: string;
  keterangan: KeteranganAbsensi;
}

/** Ringkasan identitas siswa pada kartu informasi. */
export interface RingkasanSiswa {
  nama: string;
  kelas: string;
  totalKehadiran: string;
}

/** Data halaman riwayat absensi harian siswa (`/guruWali/absensi/siswa/:id`). */
export interface AbsensiSiswaDetail {
  ringkasan: RingkasanSiswa;
  harian: AbsensiHarian[];
}

/** Data halaman detail absensi satu hari (`/guruWali/absensi/siswa/:id/detail/`). */
export interface AbsensiHariDetail {
  ringkasan: RingkasanSiswa;
  pertemuan: AbsensiPertemuan[];
}

/** Seluruh data menu wali kelas (`/guruWali/absensi/:kelas_id`). */
export interface WaliKelasDetail {
  kelas: WaliKelasInfo;
  siswa: SiswaWali[];
}
