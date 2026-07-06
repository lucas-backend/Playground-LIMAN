import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PermIdentityRoundedIcon from "@mui/icons-material/PermIdentityRounded";
import XPadding from "../../../components/XPadding";

interface Props {
  user: {
    name: string;
    role: string;
  };
}

export default function DashboardHeader({ user }: Props) {
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
        <button
          type="button"
          className="bg-white h-8 w-8 flex items-center justify-center rounded-full cursor-pointer"
        >
          <NotificationsNoneRoundedIcon className="h-6! w-6! text-blue-400" />
        </button>
      </div>
    </XPadding>
  );
}
