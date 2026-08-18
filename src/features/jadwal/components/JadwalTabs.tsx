import { useLocation, useNavigate } from "react-router-dom";
import type { JadwalTab } from "../../../types/jadwal";

interface Props {
  tabs: JadwalTab[];
}

export default function JadwalTabs({ tabs }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="grid grid-cols-3 gap-4">
      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <button
            key={tab.name}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border border-black/15 p-4 hover:bg-blue-400/25 ${location.pathname == tab.link ? "bg-blue-400/25" : ""}`}
            onClick={() => {
              navigate(tab.link);
            }}
          >
            <Icon />
            <span className="font-semibold">{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
}
