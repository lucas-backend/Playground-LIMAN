import type { MapelLatihan } from "../model/latihanSoal";

interface MapelCardProps {
  mapel: MapelLatihan;
  onSelect: (mapelId: string) => void;
}

/** Kartu mata pelajaran pada daftar latihan (presentasional, tanpa data). */
export default function MapelCard({ mapel, onSelect }: MapelCardProps) {
  const Icon = mapel.icon;

  return (
    <button
      type="button"
      className="flex flex-col p-4 border border-black/20 shadow rounded-lg justify-start"
      onClick={() => onSelect(mapel.id)}
    >
      {/* Icon */}
      <div className={`${mapel.bgColor} ${mapel.color} w-fit p-2 rounded-sm`}>
        <Icon className="w-8! h-8!" />
      </div>

      {/* Title */}
      <span className="font-semibold mt-2 flex justify-start">{mapel.name}</span>

      {/* Counter */}
      <div className="flex items-center gap-1.5 text-sm text-black/60">
        <span>{mapel.topicCount} Bab</span>
        <div className="bg-black/60 w-1 h-1 rounded-full" />
        <span>{mapel.questionCount} Soal</span>
      </div>

      {/* Progress Bar */}
      <div className={`${mapel.bgColor} w-full h-1 rounded-full mt-2`}>
        <div
          className={`${mapel.bgColorFull} h-1 rounded-full`}
          style={{
            width: `${(mapel.questionSolved / mapel.questionCount) * 100}%`,
          }}
        />
      </div>
    </button>
  );
}
