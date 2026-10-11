import { createContext, useContext } from "react";

import type { UserRole } from "@/shared/types";

// Abstraksi sesi frontend (SDD §7). Ini BUKAN mekanisme keamanan:
// otorisasi otoritatif tetap divalidasi backend (ADR-004, NFR-SEC-002).
//
// Identitas sesi mengikuti kontrak API-AUTH-003 (`id`, `fullName`, `email`,
// `roles`) pada docs/06-api-documentation.md §6. Bootstrap `/auth/me` belum
// tersedia (KD-07/KD-09 `Blocked`); sesi di sini bersifat in-memory untuk
// pengembangan dan hilang saat muat ulang.
export type SessionStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "unavailable";

export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  roles: UserRole[];
}

export interface Session {
  status: SessionStatus;
  user: SessionUser | null;
  signIn: (user: SessionUser) => void;
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
