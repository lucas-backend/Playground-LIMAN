export type UserRole =
  | "siswa"
  | "guru_mapel"
  | "guru_wali"
  | "guru_bk"
  | "admin";

export interface UserData {
  name: string;
  role: UserRole;
  isPresent: boolean;
}
