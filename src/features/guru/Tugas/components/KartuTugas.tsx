import { Link } from "react-router-dom";
import { formatTanggal, type Tugas } from "../TugasData";
import { IkonKalender } from "./Ikon";

export default function KartuTugas({ tugas }: { tugas: Tugas }) {
  return (
    <Link
      to={`/guru/tugas/${tugas.mapelId}/listSiswa/${tugas.id}`}
      className="block bg-white border border-gray-300 rounded-xl shadow-sm px-4 py-3
        active:bg-blue-50 transition-colors"
    >
      <h2 className="font-medium">{tugas.judul}</h2>
      <p className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
        <IkonKalender /> {formatTanggal(tugas.tenggat)}
      </p>
      <p className="text-[10px] mt-2 line-clamp-1">{tugas.deskripsi}</p>
    </Link>
  );
}
