import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

import type { menuType } from "./types";

// Data
export const siswaMenus: menuType[] = [
  { name: "Beranda", isActive: true, icon: HomeOutlinedIcon },
  { name: "Statistik", icon: AutoGraphRoundedIcon },
  { name: "Tukar", icon: SwapHorizRoundedIcon },
  { name: "Menu", icon: LayersOutlinedIcon },
  { name: "Profil", icon: PersonOutlineRoundedIcon },
];

export const guruMenus: menuType[] = [];

export const adminMenus: menuType[] = [];
