import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DEFAULT_USER,
  STORAGE_KEY,
  type UserData,
  type UserRole,
} from "./data.mock";
import { UserContext, type UserContextValue } from "./UserContext";

function loadUser(): UserData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_USER, ...(JSON.parse(raw) as Partial<UserData>) };
  } catch {
    // abaikan data rusak
  }
  return DEFAULT_USER;
}

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData>(loadUser);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const value = useMemo<UserContextValue>(
    () => ({
      ...user,
      setRole: (role: UserRole) => setUser((u) => ({ ...u, role })),
      setIsPresent: (isPresent: boolean) => setUser((u) => ({ ...u, isPresent })),
      resetUser: () => setUser(DEFAULT_USER),
    }),
    [user],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
