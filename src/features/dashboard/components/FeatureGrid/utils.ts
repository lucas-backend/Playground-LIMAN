import type { featureType } from "./types";
import {
  adminFeatures,
  guruBKFeatures,
  guruMapelFeatures,
  guruWaliFeatures,
  siswaFeatures,
} from "./data";

export function gridFeaturesSwitcher(userRole: string): featureType[] {
  switch (userRole) {
    case "siswa":
      return siswaFeatures;
    case "guru_mapel":
      return guruMapelFeatures;
    case "guru_bk":
      return guruBKFeatures;    
    case "guru_wali":
      return guruWaliFeatures;
    case "admin":
      return adminFeatures;
    default:
      return [];
  }
}
