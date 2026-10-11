import { Navigate, Outlet, useLocation } from "react-router-dom";

import Loading from "@/shared/components/state/Loading";
import { useSession } from "@/shared/session/session";

// Host untuk route terautentikasi. Guard di sini hanya UX (ADR-004);
// otorisasi otoritatif tetap di backend (NFR-SEC-002).
// Backend sesi belum tersedia sehingga status saat ini "unavailable":
// guard belum menolak akses. Pengalihan ke /login diaktifkan pada fase auth (F4).
export default function ProtectedLayout() {
  const { status } = useSession();
  const location = useLocation();

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
