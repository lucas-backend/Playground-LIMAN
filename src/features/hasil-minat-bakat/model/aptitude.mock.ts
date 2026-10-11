/**
 * Fixture demo modul Hasil Minat Bakat (siswa).
 *
 * Data ini diturunkan dari konten halaman lama dan dikenali secara eksplisit
 * sebagai demo: TIDAK ada endpoint yang menyediakannya (docs/06-api-documentation.md
 * §20 hanya mendefinisikan `GET /students/{studentId}/aptitude-results` dan
 * `POST /students/{studentId}/target-majors`). Oleh karena itu nilai di bawah
 * tidak boleh dipresentasikan sebagai data backend nyata; sandi jembatan ke
 * backend ditentukan saat kontrak direvisi/disetujui.
 */

import type {
  HasilMinatBakatSummary,
  JurusanDetail,
  TargetJurusanLainItem,
  UniversitasOption,
} from "./aptitude";

export const DEMO_SUMMARY: HasilMinatBakatSummary = {
  minat: "IT & Komputer",
  bakat: "Programming",
  rekomendasi: ["Teknik Informatika", "Sistem Informasi", "Ilmu Komputer"],
};

export const DEMO_TARGET_JURUSAN: TargetJurusanLainItem[] = [
  { id: "demo-tj-1", nama: "Teknik Kimia" },
  { id: "demo-tj-2", nama: "Teknik Industri" },
];

export const DEMO_JURUSAN_DETAIL: JurusanDetail = {
  nama: "Teknik Informatika",
  mapelTka: ["Informatika", "Matematika Lanjut"],
  daftarUniversitas: [
    { id: "demo-univ-1", nama: "UI", scoreSnbp: 90, scoreSnbt: 750 },
    { id: "demo-univ-2", nama: "UGM", scoreSnbp: 92, scoreSnbt: 756 },
    { id: "demo-univ-3", nama: "UNILA", scoreSnbp: 90, scoreSnbt: 733 },
  ],
};

export const DEMO_UNIVERSITAS: UniversitasOption[] = [
  {
    id: "demo-it-itera",
    nama: "ITERA",
    listJurusan: ["Teknik Informatika", "Teknik Elektro", "Teknik Mesin"],
  },
  {
    id: "demo-it-unila",
    nama: "Unila",
    listJurusan: [
      "Bisnis Digital",
      "Ekonomi",
      "Manajemen",
      "Akuntansi",
      "Bisnis Digital",
      "Hukum",
      "Administrasi Negara",
      "Ilmu Pemerintahan",
    ],
  },
];