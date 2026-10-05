import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/Header";
import XPadding from "../../../components/XPadding";
import NilaiBadge from "../../../components/NilaiBadge";
import { dummyKelas, dummySiswa, lulus } from "./data";

export default function GuruPenilaianKelas() {
  const { kelas_id } = useParams<{ kelas_id: string }>();
  const navigate = useNavigate();

  // TODO: fetch kelas & siswa berdasarkan kelas_id
  const kelas = dummyKelas.find((k) => k.id === kelas_id);
  const daftarSiswa = dummySiswa;

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Penilaian" />
      <XPadding>
        <h2 className="mb-4 mt-5 text-base font-medium">
          KELAS {kelas?.nama ?? kelas_id}
        </h2>

        <div className="grid grid-cols-[1fr_72px_96px_16px] items-center gap-x-2 pb-2 text-sm font-medium">
          <span>Nama Siswa</span>
          <span className="text-center">Nilai akhir</span>
          <span className="text-center">Ket</span>
          <span />
        </div>

        <ul>
          {daftarSiswa.map((siswa) => {
            const ok = lulus(siswa.nilaiAkhir);
            return (
              <li key={siswa.id} className="border-t border-gray-300">
                <button
                  onClick={() =>
                    navigate(`/guru/penilaian/${kelas_id}/siswa/${siswa.id}`)
                  }
                  className="grid w-full grid-cols-[1fr_72px_96px_16px] items-center gap-x-2 py-2.5 text-left text-xs"
                >
                  <span>{siswa.nama}</span>
                  <span className="text-center">
                    <NilaiBadge lulus={ok}>{siswa.nilaiAkhir}</NilaiBadge>
                  </span>
                  <span className="text-center">
                    <NilaiBadge lulus={ok}>
                      {ok ? "Lulus" : "Tidak Lulus"}
                    </NilaiBadge>
                  </span>
                  <span className="text-gray-500">▶</span>
                </button>
              </li>
            );
          })}
        </ul>
      </XPadding>

      <div className="mt-auto px-5 pb-6 pt-6">
        <button
          onClick={() => window.print()}
          className="w-full rounded-lg bg-blue-600 py-3 text-lg font-medium text-white"
        >
          Cetak
        </button>
      </div>
    </div>
  );
}
