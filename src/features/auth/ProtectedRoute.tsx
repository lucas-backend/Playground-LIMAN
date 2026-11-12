import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../dashboard/UserContext";

export default function ProtectedRoute() {
  const { status, authError, retrySession } = useUser();
  const location = useLocation();

  if (status === "loading") {
    return <AuthMessage message="Memeriksa sesi..." />;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (status === "error") {
    const isForbidden = authError?.status === 403 || authError?.code === "FORBIDDEN";
    return (
      <AuthMessage
        message={isForbidden
          ? "Sesi tersedia, tetapi akses pemeriksaan sesi ditolak."
          : "Sesi tidak dapat diperiksa. Periksa koneksi lalu coba lagi."}
        actionLabel="Coba lagi"
        onAction={() => void retrySession()}
      />
    );
  }

  return <Outlet />;
}

function AuthMessage({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-blue-500 p-6 text-center text-white">
      <div className="max-w-sm space-y-4">
        <p>{message}</p>
        {actionLabel && (
          <button type="button" className="rounded-lg bg-orange-400 px-5 py-2 font-semibold" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    </main>
  );
}
