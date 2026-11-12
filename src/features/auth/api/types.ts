export type RoleCode = "siswa" | "guru_mapel" | "guru_wali" | "guru_bk" | "admin";
export type UserStatus = "active" | "inactive";

export interface UserSummary {
  id?: string;
  fullName?: string;
  email?: string;
  roles?: RoleCode[];
  status?: UserStatus;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user?: UserSummary;
}
