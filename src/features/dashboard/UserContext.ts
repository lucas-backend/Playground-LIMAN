import { createContext, useContext } from "react";
import type { UserRole } from "./data.mock";
import type { ApiError } from "../../shared/api/errors";
import type { UserSummary } from "../auth/api/types";

export interface UserContextValue {
  name: string;
  role: UserRole;
  isPresent: boolean;
  status: "loading" | "authenticated" | "unauthenticated" | "error";
  authUser: UserSummary | null;
  authError: ApiError | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  retrySession: () => Promise<void>;
  setRole: (role: UserRole) => void;
  setIsPresent: (isPresent: boolean) => void;
  resetUser: () => void;
}

export const UserContext = createContext<UserContextValue | null>(null);

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser harus dipakai di dalam UserProvider");
  return ctx;
}
