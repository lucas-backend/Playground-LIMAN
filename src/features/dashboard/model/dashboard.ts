import type { ElementType } from "react";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import MonitorRoundedIcon from "@mui/icons-material/MonitorRounded";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import LoopIcon from "@mui/icons-material/Loop";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TaskIcon from "@mui/icons-material/Task";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CreateIcon from "@mui/icons-material/Create";
import DescriptionIcon from "@mui/icons-material/Description";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";

import type { UserRole } from "@/shared/types";

/**
 * Model domain modul Dashboard (FR-DASH-001).
 *
 * Menu per peran diturunkan dari `roles` sesi aktif (`GET /auth/me`,
 * API-AUTH-003; docs/06-api-documentation.md §5/§6). Tidak ada endpoint
 * dashboard khusus — komposisi klien murni.
 *
 * Catatan keterbatasan: tautan `"#"` pada `guru_mapel` merupakan placeholder
 * lama (AUD-010) yang dipertahankan apa adanya pada migrasi ini; penetapan
 * rute target menunggu keputusan produk (jangan dikarang).
 */
export interface DashboardFeature {
  name: string;
  icon: ElementType;
  link: string;
}

const siswaFeatures: DashboardFeature[] = [
  { name: "Jadwal", link: "/jadwal-siswa", icon: CalendarMonthRoundedIcon },
  { name: "Latihan Soal", link: "/latihan-soal", icon: BorderColorRoundedIcon },
  { name: "Passing Grade", link: "/passing_grade", icon: MonitorRoundedIcon },
  { name: "Minat Bakat", link: "/quiz/1", icon: ColorLensIcon },
  { name: "Remedial", link: "/remedial", icon: LoopIcon },
  { name: "Tugas", link: "/tugas", icon: AssignmentIcon },
];

const guruMapelFeatures: DashboardFeature[] = [
  { name: "Absensi", link: "/guruMapel/absensi", icon: PeopleRoundedIcon },
  { name: "Latihan Soal", link: "#", icon: BorderColorRoundedIcon },
  { name: "Ujian", link: "#", icon: MonitorRoundedIcon },
  { name: "Tugas", link: "#", icon: TaskIcon },
  { name: "Penilaian", link: "#", icon: LibraryBooksIcon },
];

const guruWaliFeatures: DashboardFeature[] = [
  { name: "Absensi", link: "/guruMapel/absensi", icon: PeopleRoundedIcon },
  { name: "Latihan Soal", link: "/guru/latihanSoal", icon: BorderColorRoundedIcon },
  { name: "Ujian", link: "/guru/ujian", icon: MonitorRoundedIcon },
  { name: "Tugas", link: "/guru/tugas", icon: TaskIcon },
  { name: "Penilaian", link: "/guru/penilaian", icon: LibraryBooksIcon },
  { name: "Wali Kelas", link: "/guruWali/absensi/1", icon: HistoryEduIcon },
  { name: "Remedial", link: "/guru/remedial", icon: AssignmentLateIcon },
];

const guruBKFeatures: DashboardFeature[] = [
  { name: "Konseling", link: "/guruBK/konseling", icon: CreateIcon },
  { name: "Rekap", link: "/guruBK/rekap", icon: DescriptionIcon },
  { name: "Minat Bakat", link: "/guruBK/minatBakat", icon: EmojiObjectsIcon },
];

// Admin Sekolah belum memiliki menu terdaftar (AUD-010: `adminFeatures = []`).
const adminFeatures: DashboardFeature[] = [];

const FEATURES_BY_ROLE: Record<UserRole, DashboardFeature[]> = {
  siswa: siswaFeatures,
  guru_mapel: guruMapelFeatures,
  guru_wali: guruWaliFeatures,
  guru_bk: guruBKFeatures,
  admin_sekolah: adminFeatures,
};

/**
 * Gabungkan menu dari seluruh peran pengguna (satu orang dapat berperan
 * ganda, BR-14/DEC-07), tanpa duplikasi nama fitur.
 */
export function featuresForRoles(
  roles: readonly UserRole[],
): DashboardFeature[] {
  const seen = new Set<string>();
  const features: DashboardFeature[] = [];

  for (const role of roles) {
    for (const feature of FEATURES_BY_ROLE[role] ?? []) {
      if (seen.has(feature.name)) continue;
      seen.add(feature.name);
      features.push(feature);
    }
  }

  return features;
}

export function isStudent(roles: readonly UserRole[]): boolean {
  return roles.includes("siswa");
}
