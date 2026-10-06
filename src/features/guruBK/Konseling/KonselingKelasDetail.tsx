import { useParams } from "react-router-dom";
import XPadding from "../../../components/XPadding";

type Siswa = {
  id: number;
  nama: string;
  adaCatatanBaru: boolean;
};

const siswaList: Siswa[] = [
  { id: 1, nama: "Dipa Rama", adaCatatanBaru: true },
  ...Array.from({ length: 11 }, (_, i) => ({
    id: i + 2,
    nama: "Nama Siswa",
    adaCatatanBaru: false,
  })),
];

export default function KonselingKelasDetail() {
  const { kelas_id } = useParams();

  // Contoh: "10-ipa-1" -> "Kelas 10 IPA 1"
  const namaKelas = `Kelas ${kelas_id?.replace(/-/g, " ").toUpperCase()}`;

  return (
    <div>
      <XPadding className="mt-6">
        <h3 className="font-semibold text-base">Daftar Siswa</h3>
        <p className="text-xs text-gray-500">{namaKelas}</p>

        <h4 className="mt-6 text-sm font-semibold">Nama Siswa</h4>
      </XPadding>

      <ul className="mt-3 border-t border-gray-300">
        {siswaList.map((siswa) => (
          <li
            key={siswa.id}
            className="flex items-center justify-between border-b border-gray-300 px-6 py-3"
          >
            <span className="text-xs">{siswa.nama}</span>

            <button
              className="relative rounded-full border border-blue-900 bg-blue-50 px-3 py-0.5 text-[10px] font-medium text-blue-900 hover:bg-blue-100"
              onClick={() => {
                // TODO: navigate ke halaman catatan siswa
              }}
            >
              Lihat catatan
              {siswa.adaCatatanBaru && (
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-600" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}