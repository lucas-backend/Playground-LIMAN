export type UserRole = "siswa" | "guruMapel" | "guruBK" | "guruWali" | "admin";

export interface UserData {
  name: string;
  role: UserRole;
  isPresent: boolean;
}

export const STORAGE_KEY = "limen.dev.user";

// -- Mock Data --
export const DEFAULT_USER: UserData = {
  name: "I Made Dipa Rama Artike",
  role: "guruWali",
  isPresent: true,
};
