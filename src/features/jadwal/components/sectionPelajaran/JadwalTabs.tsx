import type { JadwalTab } from "../../../../types/jadwal";

interface Props {
  tabs: readonly JadwalTab[];
}

export default function JadwalTabs({ tabs }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <button
            key={tab.name}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border border-black/15 p-4 hover:bg-blue-400/25 ${tab.isActive ? "bg-blue-400/25" : ""}`}
          >
            <Icon />
            <span className="font-semibold">{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
}
