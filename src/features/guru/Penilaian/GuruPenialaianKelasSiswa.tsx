import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/Header";
import XPadding from "../../../components/XPadding";
import NilaiBadge from "../../../components/NilaiBadge";
import { dummyKelas, dummyRincian, dummySiswa, lulus } from "./data";

function Baris({ nama, nilai }: { nama: string; nilai: number }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-300 py-3">
      <span className="font-medium">{nama}</span>
      <NilaiBadge lulus={lulus(nilai)}>{nilai}</NilaiBadge>
    </div>
  );
}

function Seksi({ judul, children }: { judul: string; children: React.ReactNode }) {
  return (
    <section className="mt-4">
      <h3 className="text-sm text-gray-500">{judul}</h3>
      {children}
    </section>
  );
}

export default function GuruPenilaianKelasSiswa() {
  const { kelas_id, siswa_id } = useParams<{ kelas_id: string; siswa_id: string }>();
  const navigate = useNavigate();

  // TODO: fetch rincian nilai siswa berdasarkan kelas_id & siswa_id
  const kelas = dummyKelas.find((k) => k.id === kelas_id);
  const siswa = dummySiswa.find((s) => s.id === siswa_id);
  const r = dummyRincian;
  const tuntas = lulus(r.nilaiAkhir);

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Penilaian" />
      <XPadding>
        <div className="mt-5">
          <div className="text-xl font-medium">{siswa?.nama ?? "Siswa"}</div>
          <div className="text-sm">Kelas {kelas?.nama ?? kelas_id}</div>
        </div>

        <Seksi judul="Tugas">
          {r.tugas.map((t) => <Baris key={t.nama} nama={t.nama} nilai={t.nilai} />)}
        </Seksi>

        <Seksi judul="Ulangan Harian">
          {r.ulanganHarian.map((u) => <Baris key={u.nama} nama={u.nama} nilai={u.nilai} />)}
        </Seksi>

        <Seksi judul="Penilaian tengah & akhir semester">
          <Baris nama="PTS" nilai={r.pts} />
          <Baris nama="PAS" nilai={r.pas} />
        </Seksi>

        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Nilai akhir</span>
            <NilaiBadge lulus={tuntas}>{r.nilaiAkhir}</NilaiBadge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Keterangan</span>
            <NilaiBadge lulus={tuntas}>{tuntas ? "Tuntas" : "Belum Tuntas"}</NilaiBadge>
          </div>
        </div>
      </XPadding>

      <div className="mt-auto px-5 pb-6 pt-6">
        <button
          onClick={() => navigate(`/guru/penilaian/${kelas_id}/siswa/${siswa_id}/rekap`)}
          className="w-full rounded-lg bg-blue-600 py-3 text-lg font-medium text-white"
        >
          Cetak
        </button>
      </div>
    </div>
  );
}