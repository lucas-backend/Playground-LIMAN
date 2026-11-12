import { request } from "../../../shared/api/client";
import type { RoleCode, UserStatus } from "../../auth/api/types";
import type { PageResponse } from "../../academic/api/academicApi";

export interface AdminUser {
  id: string;
  fullName?: string;
  email?: string;
  roles?: RoleCode[];
  status?: UserStatus;
}

export interface CreateUserInput {
  fullName: string;
  email: string;
  password: string;
  roles: RoleCode[];
}

export interface UpdateUserInput {
  fullName?: string;
  status?: UserStatus;
  roles?: RoleCode[];
}

function query(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const result = search.toString();
  return result ? `?${result}` : "";
}

export function listUsers(params: {
  role?: RoleCode;
  status?: UserStatus;
  q?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<PageResponse<AdminUser>> {
  return request<PageResponse<AdminUser>>(`/users${query(params)}`);
}

export function getUser(userId: string): Promise<AdminUser> {
  return request<AdminUser>(`/users/${encodeURIComponent(userId)}`);
}

export function createUser(body: CreateUserInput): Promise<AdminUser> {
  return request<AdminUser, CreateUserInput>("/users", { method: "POST", body });
}

export function updateUser(userId: string, body: UpdateUserInput): Promise<AdminUser> {
  return request<AdminUser, UpdateUserInput>(`/users/${encodeURIComponent(userId)}`, {
    method: "PUT",
    body,
  });
}
