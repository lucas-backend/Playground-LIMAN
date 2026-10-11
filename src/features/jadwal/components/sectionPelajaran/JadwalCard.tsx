import type { JadwalItem } from "../../model/jadwal";

interface Props {
  item: JadwalItem;
}

export default function JadwalCard({ item }: Props) {
  const Icon = item.icon;

  return (
    <div className="flex items-center justify-between rounded-lg border border-black/10 p-4">
      <div className="flex items-center">
        <div
          className={`${item.backgroundClassName} ${item.colorClassName} mr-4 flex h-12 w-12 items-center justify-center rounded-lg`}
        >
          <Icon />
        </div>

        <div className="mr-4 flex flex-col">
          <span className="text-xl font-semibold">{item.name}</span>
          <span>{item.subject}</span>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <span className="font-semibold">{item.time}</span>
        <span>{item.duration}min</span>
      </div>
    </div>
  );
}
