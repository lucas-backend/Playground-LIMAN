import type { NilaiSiswa } from "../TugasData";
import { IkonPensil } from "./Ikon";

interface Props {
  nomor: number;
  siswa: NilaiSiswa;
  onEdit: () => void;
}

export default function BarisSiswa({ nomor, siswa, onEdit }: Props) {
  const adaNilai = siswa.nilai !== null;

  return (
    <div className="flex items-center gap-3 px-4 py-4 text-xs border-b border-gray-200 last:border-b-0">
      <span className="flex-1">
        {nomor}. {siswa.nama}
      </span>
      <span
        className={`min-w-[2.75rem] text-center rounded-full px-3 py-0.5 font-medium ${
          adaNilai ? "bg-green-200 text-green-900" : "bg-gray-200 text-gray-500"
        }`}
      >
        {adaNilai ? siswa.nilai : "-"}
      </span>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Ubah nilai ${siswa.nama}`}
        className="text-gray-500"
      >
        <IkonPensil />
      </button>
    </div>
  );
}
