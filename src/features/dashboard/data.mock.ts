export type UserRole = "siswa" | "guruMapel" | "guruBK" | "guruWali" | "admin";

export interface UserData {
  name: string;
  role: UserRole;
  isPresent: boolean;
}
