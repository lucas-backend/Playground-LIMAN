import type { Mapel } from "../TugasData";
import IkonMapel from "./IkonMapel";

export default function BannerMapel({ mapel }: { mapel: Mapel }) {
  return (
    <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-xl shadow-sm px-4 py-3">
      <IkonMapel mapel={mapel} />
      <h1 className="text-lg font-medium">{mapel.nama}</h1>
    </div>
  );
}
