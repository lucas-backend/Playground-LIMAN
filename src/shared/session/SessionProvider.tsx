import { useCallback, useMemo, useState, type ReactNode } from "react";

import { SessionContext, type Session, type SessionUser } from "./session";

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [user, setUser] = useState<SessionUser | null>(null);

  const signIn = useCallback((nextUser: SessionUser) => {
    setUser(nextUser);
  }, []);

  const signOut = useCallback(() => {
    // TODO(auth F5): panggil API-AUTH-002 `POST /auth/logout` saat backend ada.
    setUser(null);
  }, []);

  const value = useMemo<Session>(
    () => ({
      status: user ? "authenticated" : "unauthenticated",
      user,
      signIn,
      signOut,
    }),
    [user, signIn, signOut],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
