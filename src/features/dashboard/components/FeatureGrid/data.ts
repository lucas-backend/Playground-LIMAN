import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import MonitorRoundedIcon from "@mui/icons-material/MonitorRounded";
import SportsEsportsRoundedIcon from "@mui/icons-material/SportsEsportsRounded";

import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import type { featureType } from "./types";

// Data
export const siswaFeatures: featureType[] = [
  {
    name: "Jadwal",
    link: "#",
    icon: CalendarMonthRoundedIcon,
  },
  {
    name: "Latihan Soal",
    link: "#",
    icon: BorderColorRoundedIcon,
  },
  {
    name: "Passing Grade",
    link: "#",
    icon: MonitorRoundedIcon,
  },
  {
    name: "Minat Bakat",
    link: "#",
    icon: SportsEsportsRoundedIcon,
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
