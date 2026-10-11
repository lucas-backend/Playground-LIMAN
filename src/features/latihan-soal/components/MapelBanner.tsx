import type { MapelLatihan } from "../model/latihanSoal";

interface MapelBannerProps {
  mapel: MapelLatihan;
}

/** Banner berwarna mata pelajaran pada halaman detail latihan. */
export default function MapelBanner({ mapel }: MapelBannerProps) {
  const Icon = mapel.icon;

  return (
    <div
      className={`flex items-center justify-start p-4 rounded-lg gap-4 ${mapel.bgColorFull}`}
    >
      {/* Icon */}
      <div className="rounded-lg bg-white/50 text-white p-2 flex items-center justify-center">
        <Icon className="w-8! h-8!" />
      </div>

      {/* Title & Number Info */}
      <div className="text-white flex flex-col justify-center pb-1">
        <h3 className="font-semibold text-xl">{mapel.name}</h3>
        <span>
          {mapel.topicCount} Bab - {mapel.questionCount} Soal
        </span>
      </div>
    </div>
  );
}
