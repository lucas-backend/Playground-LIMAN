import { createContext, useContext } from "react";

import type { UserRole } from "@/shared/types";

// Abstraksi sesi frontend (SDD §7). Ini BUKAN mekanisme keamanan:
// otorisasi otoritatif tetap divalidasi backend (ADR-004, NFR-SEC-002).
//
// Status saat ini sengaja "unavailable": backend autentikasi (`/auth/me`)
// belum tersedia (kontrak API KD-07/KD-09 `Blocked`). Tidak ada login palsu;
// penguatan sesi nyata dilakukan pada fase autentikasi (F4).
export type SessionStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "unavailable";

export interface SessionUser {
  id: string;
  name: string;
  role: UserRole;
}

export interface Session {
  status: SessionStatus;
  user: SessionUser | null;
  signOut: () => void;
}

export const SessionContext = createContext<Session | null>(null);

export function useSession(): Session {
  const session = useContext(SessionContext);
  if (!session) {
    throw new Error("useSession harus dipakai di dalam SessionProvider.");
  }
  return session;
}
