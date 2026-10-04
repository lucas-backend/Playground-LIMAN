import { formatTanggal, type Mapel, type Tugas } from "../TugasData";
import { IkonKalender } from "./Ikon";

export default function InfoTugas({ tugas, mapel }: { tugas: Tugas; mapel: Mapel }) {
  return (
    <div className="mt-6 mb-4">
      <h1 className="text-lg font-semibold">{tugas.judul} - {mapel.nama}</h1>
      <p className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
        <IkonKalender /> {formatTanggal(tugas.tenggat)}
      </p>
      <p className="text-[10px] mt-1">{tugas.deskripsi}</p>
    </div>
  );
}