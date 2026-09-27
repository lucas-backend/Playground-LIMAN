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
import type { featureType } from "./types";

// Data
export const siswaFeatures: featureType[] = [
  {
    name: "Jadwal",
    link: "/jadwal-siswa",
    icon: CalendarMonthRoundedIcon,
  },
  {
    name: "Latihan Soal",
    link: "/latihan-soal",
    icon: BorderColorRoundedIcon,
  },
  {
    name: "Passing Grade",
    link: "/passing_grade",
    icon: MonitorRoundedIcon,
  },
  {
    name: "Minat Bakat",
    link: "/quiz/1",
    icon: ColorLensIcon,
  },
  {
    name: "Remedial",
    link: "/remedial",
    icon: LoopIcon,
  },
  {
    name: "Tugas",
    link: "/tugas",
    icon: AssignmentIcon,
  },
];

export const guruWaliFeatures: featureType[] = [
  {
    name: "Absensi",
    link: "#",
    icon: PeopleRoundedIcon,
  },
  {
    name: "Latihan Soal",
    link: "#",
    icon: BorderColorRoundedIcon,
  },
  {
    name: "Ujian",
    link: "#",
    icon: MonitorRoundedIcon,
  },
  {
    name: "Tugas",
    link: "#",
    icon: TaskIcon,
  },
  {
    name: "Penilaian",
    link: "#",
    icon: LibraryBooksIcon,
  },
  {
    name: "Wali Kelas",
    link: "#",
    icon: HistoryEduIcon,
  },
  {
    name: "Remedial",
    link: "#",
    icon: AssignmentLateIcon,
  },
];

export const guruMapelFeatures: featureType[] = [
  {
    name: "Absensi",
    link: "#",
    icon: PeopleRoundedIcon,
  },
  {
    name: "Latihan Soal",
    link: "#",
    icon: BorderColorRoundedIcon,
  },
  {
    name: "Ujian",
    link: "#",
    icon: MonitorRoundedIcon,
  },
  {
    name: "Tugas",
    link: "#",
    icon: TaskIcon,
  },
  {
    name: "Penilaian",
    link: "#",
    icon: LibraryBooksIcon,
  },
];

export const adminFeatures: featureType[] = [];
