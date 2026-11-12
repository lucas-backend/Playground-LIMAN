import { request } from "../../../shared/api/client";
import type { LoginRequest, LoginResponse, UserSummary } from "./types";

export function login(body: LoginRequest): Promise<LoginResponse> {
  return request<LoginResponse, LoginRequest>("/auth/login", {
    method: "POST",
    body,
  });
}

export function getCurrentUser(): Promise<UserSummary> {
  return request<UserSummary>("/auth/me");
}

export function logout(): Promise<void> {
  return request<void>("/auth/logout", { method: "POST" });
}
