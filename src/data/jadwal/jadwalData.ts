import AssignmentIcon from "@mui/icons-material/Assignment";
import CalculateIcon from "@mui/icons-material/Calculate";
import CoronavirusIcon from "@mui/icons-material/Coronavirus";
import CreateIcon from "@mui/icons-material/Create";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TranslateIcon from "@mui/icons-material/Translate";

import type {
  JadwalDate,
  JadwalItem,
  JadwalSection,
  JadwalTab,
} from "../../types/jadwal";

export const jadwalPelajaranTabs: JadwalTab[] = [
  {
    icon: MenuBookIcon,
    name: "Pelajaran",
    link: "/jadwal-siswa/pelajaran",
    isActive: true,
  },
  {
    icon: AssignmentIcon,
    name: "Try Out",
    link: "/jadwal-siswa/tryout",
  },
  {
    icon: CreateIcon,
    name: "Ujian",
    link: "/jadwal-siswa/ujian",
  },
];

export const jadwalDates: readonly JadwalDate[] = [
  {
    day: "Sen",
    date: 29,
  },
  {
    day: "Sel",
    date: 30,
    isActive: true,
  },
  {
    day: "Rab",
    date: 31,
  },
  {
    day: "Kam",
    date: 1,
  },
];

export const jadwalItems: readonly JadwalItem[] = [
  {
    icon: CalculateIcon,
    name: "Matematika",
    subject: "Bab 3 - Turunan & Integral",
    time: "07:00",
    duration: 90,
    colorClassName: "text-[#46a634]",
    backgroundClassName: "bg-[#46a634]/30",
  },
  {
    icon: TranslateIcon,
    name: "Bahasa Inggris",
    subject: "Bab 2 - Simple Past Tense",
    time: "09:00",
    duration: 45,
    colorClassName: "text-[#a2adff]",
    backgroundClassName: "bg-[#a2adff]/30",
  },
  {
    icon: CoronavirusIcon,
    name: "Biologi",
    subject: "Bab 3 - Anatomi Tumbuhan",
    time: "11:00",
    duration: 90,
    colorClassName: "text-[#2d9cdb]",
    backgroundClassName: "bg-[#2d9cdb]/30",
  },
];

export const jadwalSections: readonly JadwalSection[] = [
  {
    title: "Hari ini",
    items: jadwalItems,
  },
  {
    title: "Besok",
    items: jadwalItems,
  },
];
