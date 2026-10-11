import { useMemo, type ReactNode } from "react";

import { SessionContext, type Session } from "./session";

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const value = useMemo<Session>(
    () => ({
      status: "unavailable",
      user: null,
      signOut: () => {
        // TODO(auth F4): panggil endpoint logout backend saat tersedia.
      },
    }),
    [],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
