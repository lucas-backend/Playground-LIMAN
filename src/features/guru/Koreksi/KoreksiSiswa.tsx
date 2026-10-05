import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/Header";
import XPadding from "../../../components/XPadding";
import TabKoreksi from "./TabKoreksi";
import { dummyPertanyaan, type TabKey } from "./koreksiData";

const labelTipe = { essay: "Essay", pilihan_ganda: "Pilihan Ganda" } as const;

export default function KoreksiSiswa() {
  const { soal_id, siswa_id } = useParams<{ soal_id: string; siswa_id: string }>();
  const navigate = useNavigate();

  // TODO: fetch daftar pertanyaan berdasarkan soal_id (dan status koreksi siswa_id)
  const daftarPertanyaan = dummyPertanyaan;

  // Pindah tab = kembali ke halaman Koreksi dengan tab terpilih
  const gantiTab = (tab: TabKey) => navigate(`/guru/koreksi/${soal_id}`, { state: { tab } });

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Ulangan Harian" />
      <XPadding>
        <TabKoreksi aktif="koreksi" onChange={gantiTab} />

        <div className="mt-5 flex flex-col gap-3">
          {daftarPertanyaan.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/guru/koreksi/${soal_id}/siswa/${siswa_id}/pertanyaan/${p.id}`)}
              className="flex items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-3 text-left"
            >
              <span className="text-xs">
                SOAL NO {p.no} - {labelTipe[p.tipe]}
                <span className="ml-3 text-[10px] text-gray-400">{p.poin} Poin</span>
              </span>
              <span className="text-blue-600">▶</span>
            </button>
          ))}
        </div>
      </XPadding>

      <div className="mt-auto flex justify-end px-5 pb-6 pt-6">
        <button
          onClick={() => navigate(`/guru/koreksi/${soal_id}`, { state: { tab: "nilai" } })}
          className="rounded bg-blue-600 px-5 py-1.5 text-xs text-white"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}