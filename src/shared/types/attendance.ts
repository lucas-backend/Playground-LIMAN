/**
 * Status kehadiran resmi.
 * Sumber: FR-ABS-005 dan BR-06 (Confirmed).
 * Berlaku untuk absensi siswa maupun guru (FR-ABS-012/013).
 */
export type AttendanceStatus =
  | "hadir"
  | "terlambat"
  | "izin"
  | "sakit"
  | "alpa";

export const ATTENDANCE_STATUSES: readonly AttendanceStatus[] = [
  "hadir",
  "terlambat",
  "izin",
  "sakit",
  "alpa",
];

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  hadir: "Hadir",
  terlambat: "Terlambat",
  izin: "Izin",
  sakit: "Sakit",
  alpa: "Alpa",
};
