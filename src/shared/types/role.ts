/**
 * Peran pengguna LIMEN.
 * Sumber: SRS §2.2 (User Classes) dan BR-14/DEC-07.
 * Nilai kanonik ini menjadi acuan bersama; model otorisasi final menunggu
 * keputusan KD-08 (ADR-012/ADR-013). Otorisasi tetap otoritatif di backend.
 */
export type UserRole =
  | "siswa"
  | "guru_mapel"
  | "guru_wali"
  | "guru_bk"
  | "admin_sekolah";

export const USER_ROLES: readonly UserRole[] = [
  "siswa",
  "guru_mapel",
  "guru_wali",
  "guru_bk",
  "admin_sekolah",
];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  siswa: "Siswa",
  guru_mapel: "Guru Mata Pelajaran",
  guru_wali: "Guru Wali",
  guru_bk: "Guru BK",
  admin_sekolah: "Admin Sekolah",
};
