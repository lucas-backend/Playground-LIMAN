import { createContext, useContext } from "react";
import type { UserRole } from "./data.mock";

export interface UserContextValue {
  name: string;
  role: UserRole;
  isPresent: boolean;
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
