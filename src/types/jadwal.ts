import type { SvgIconComponent } from "@mui/icons-material";

export interface JadwalTab {
  icon: SvgIconComponent;
  name: string;
  isActive?: boolean;
  link: string;
}

export interface JadwalDate {
  day: string;
  date: number;
  isActive?: boolean;
}

export interface JadwalItem {
  icon: SvgIconComponent;
  name: string;
  subject: string;
  time: string;
  duration: number;
  colorClassName: string;
  backgroundClassName: string;
}

export interface JadwalSection {
  title: string;
  items: readonly JadwalItem[];
}
