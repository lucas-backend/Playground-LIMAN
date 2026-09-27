import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import MonitorRoundedIcon from "@mui/icons-material/MonitorRounded";
import ColorLensIcon from '@mui/icons-material/ColorLens';
import LoopIcon from '@mui/icons-material/Loop';
import AssignmentIcon from '@mui/icons-material/Assignment';

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

export const guruFeatures: featureType[] = [
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
];

export const adminFeatures: featureType[] = [];
