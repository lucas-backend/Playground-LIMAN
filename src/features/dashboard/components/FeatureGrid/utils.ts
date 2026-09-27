import type { featureType } from "./types";
import {
  adminFeatures,
  guruMapelFeatures,
  guruWaliFeatures,
  siswaFeatures,
} from "./data";

export function gridFeaturesSwitcher(userRole: string): featureType[] {
  switch (userRole) {
    case "siswa":
      return siswaFeatures;
    case "guruMapel":
      return guruMapelFeatures;
    case "guruWali":
      return guruWaliFeatures;
    case "admin":
      return adminFeatures;
    default:
      return [];
  }
}
