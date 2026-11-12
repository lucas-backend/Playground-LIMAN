import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PermIdentityRoundedIcon from "@mui/icons-material/PermIdentityRounded";
import XPadding from "../../../components/XPadding";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../UserContext";
import { ApiError } from "../../../shared/api/errors";

interface Props {
  user: {
    name: string;
    role: string;
  };
}

export default function DashboardHeader({ user }: Props) {
  const navigate = useNavigate();
  const { logout } = useUser();
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    setLogoutError("");
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      if (error instanceof ApiError && error.code === "CSRF_INVALID") {
        setLogoutError("Logout ditolak karena token CSRF tidak valid.");
      } else if (error instanceof ApiError && error.code === "NETWORK_ERROR") {
        setLogoutError("Logout gagal karena koneksi.");
      } else if (!(error instanceof ApiError && (error.code === "UNAUTHENTICATED" || error.status === 401))) {
        setLogoutError("Logout gagal. Coba lagi.");
      }
    }
  }

  return (
    <XPadding>
      <div className="flex items-center justify-between text-white">
        {/* Foto Profile + Profile + Welcome */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex justify-center items-center">
            <PermIdentityRoundedIcon className="text-blue-500 w-9! h-9!" />
          </div>

          <div>
            <h3 className="font-bold text-xl">Hi, Welcome!</h3>
            <p className="text-sm">{user.name}</p>
          </div>
        </div>

        {/* Notification */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="bg-white h-8 w-8 flex items-center justify-center rounded-full cursor-pointer"
            onClick={() => navigate("/notifikasi")}
            aria-label="Notifikasi"
          >
            <NotificationsNoneRoundedIcon className="h-6! w-6! text-blue-400" />
          </button>
          <button type="button" className="rounded-lg bg-orange-400 px-2 py-1 text-xs font-semibold" onClick={() => void handleLogout()}>
            Keluar
          </button>
        </div>
      </div>
      {logoutError && <p role="alert" className="mt-2 text-right text-xs">{logoutError}</p>}
    </XPadding>
  );
}
