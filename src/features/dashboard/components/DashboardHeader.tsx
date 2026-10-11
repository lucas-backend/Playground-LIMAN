import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PermIdentityRoundedIcon from "@mui/icons-material/PermIdentityRounded";
import { useNavigate } from "react-router-dom";

import XPadding from "@/shared/components/layout/XPadding";

interface Props {
  name: string;
}

export default function DashboardHeader({ name }: Props) {
  const navigate = useNavigate();
  return (
    <XPadding>
      <div className="flex items-center justify-between text-white">
        {/* Foto Profile + Profile + Welcome */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex justify-center items-center">
            <PermIdentityRoundedIcon className="text-brand-500 w-9! h-9!" />
          </div>

          <div>
            <h3 className="font-bold text-xl">Hi, Welcome!</h3>
            <p className="text-sm">{name}</p>
          </div>
        </div>

        {/* Notification */}
        <button
          type="button"
          aria-label="Buka notifikasi"
          className="bg-white h-8 w-8 flex items-center justify-center rounded-full cursor-pointer"
          onClick={() => {
            navigate("/notifikasi");
          }}
        >
          <NotificationsNoneRoundedIcon className="h-6! w-6! text-brand-500" />
        </button>
      </div>
    </XPadding>
  );
}
