import { useState } from "react";
import { useParams } from "react-router-dom";
import XPadding from "@/shared/components/layout/XPadding";
import {
  getMapel,
  getNilaiTugas,
  getTugas,
  setNilai,
  type NilaiSiswa,
} from "./TugasData";
import InfoTugas from "./components/InfoTugas";
import BarisSiswa from "./components/BarisSiswa";
import ModalNilai from "./components/ModalNilai";
import Header from "@/shared/components/layout/Header";

// Route: /guru/tugas/:mapel_id/listSiswa/:tugas_id
export default function GuruTugasListSiswa() {
  const { mapel_id, tugas_id } = useParams<{
    mapel_id: string;
    tugas_id: string;
  }>();
  const mapel = getMapel(mapel_id);
  const tugas = getTugas(tugas_id);

  const [daftar, setDaftar] = useState<NilaiSiswa[]>(() =>
    getNilaiTugas(tugas_id),
  );
  const [diedit, setDiedit] = useState<NilaiSiswa | null>(null);

  if (!mapel || !tugas) {
    return (
      <XPadding>
        <p className="mt-10 text-center text-sm text-gray-500">
          Tugas tidak ditemukan
        </p>
      </XPadding>
    );
  }

  const simpanNilai = (nilai: number | null) => {
    if (!diedit) return;
    // TODO: kirim ke API
    setNilai(tugas.id, diedit.id, nilai);
    setDaftar(getNilaiTugas(tugas.id));
    setDiedit(null);
  };

  return (
    <div>
      <Header title="Tugas"/>
      <XPadding>
        <InfoTugas tugas={tugas} mapel={mapel} />

        <div className="bg-white border border-gray-300 rounded-xl shadow-sm mb-8">
          {daftar.map((s, i) => (
            <BarisSiswa
              key={s.id}
              nomor={i + 1}
              siswa={s}
              onEdit={() => setDiedit(s)}
            />
          ))}
        </div>
      </XPadding>

      {diedit && (
        <ModalNilai
          judul={tugas.judul}
          nilaiAwal={diedit.nilai}
          onBatal={() => setDiedit(null)}
          onSimpan={simpanNilai}
        />
      )}
    </div>
  );
}
