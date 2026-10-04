import { Link } from "react-router-dom";
import type { Mapel } from "../TugasData";
import IkonMapel from "./IkonMapel";

export default function KartuMapel({ mapel }: { mapel: Mapel }) {
  return (
    <Link to={`/guru/tugas/${mapel.id}`}
      className="block bg-white border border-gray-300 rounded-xl shadow-sm p-4
        active:bg-blue-500 active:text-white transition-colors">
      <IkonMapel mapel={mapel} />
      <p className="mt-3 text-xs font-semibold">{mapel.nama}</p>
    </Link>
  );
}