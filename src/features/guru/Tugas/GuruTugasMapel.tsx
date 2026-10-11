import { useParams } from "react-router-dom";
import XPadding from "@/shared/components/layout/XPadding";
import { getMapel, getTugasByMapel } from "./TugasData";
import BannerMapel from "./components/BannerMapel";
import KartuTugas from "./components/KartuTugas";
import TombolBiru from "./components/TombolBiru";
import Header from "@/shared/components/layout/Header";

// Route: /guru/tugas/:mapel_id
export default function GuruTugasMapel() {
  const { mapel_id } = useParams<{ mapel_id: string }>();
  const mapel = getMapel(mapel_id);

  if (!mapel) {
    return (
      <div>
        <XPadding>
          <p className="mt-10 text-center text-sm text-gray-500">
            Mata pelajaran tidak ditemukan
          </p>
        </XPadding>
      </div>
    );
  }

  const daftar = getTugasByMapel(mapel.id);

  return (
    <div>
      <Header title="Tugas" />
      <XPadding>
        <div className="mt-6">
          <BannerMapel mapel={mapel} />
        </div>

        <div className="flex flex-col gap-4 mt-4">
          {daftar.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-6">
              Belum ada tugas
            </p>
          )}
          {daftar.map((t) => (
            <KartuTugas key={t.id} tugas={t} />
          ))}
        </div>

        <div className="flex justify-end mt-4 pb-8">
          <TombolBiru to={`/guru/tugas/${mapel.id}/tambahTugas`}>
            + Tambah Tugas
          </TombolBiru>
        </div>
      </XPadding>
    </div>
  );
}
