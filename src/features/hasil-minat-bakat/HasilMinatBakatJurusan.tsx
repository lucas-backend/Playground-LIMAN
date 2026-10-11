import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";

import { DEMO_JURUSAN_DETAIL } from "./model/aptitude.mock";

/**
 * Detail satu jurusan rekomendasi: Mapel TKA + daftar universitas (SNBP/SNBT).
 *
 * Konten masih fixture demo tunggal (`DEMO_JURUSAN_DETAIL`); kontrak API tidak
 * menyediakan endpoint detail jurusan (docs/06-api-documentation.md §20), jadi
 * param rute `:id_jurusan` sengaja belum dipetakan ke data.
 */
export default function HasilMinatBakatJurusan() {
  const { nama, mapelTka, daftarUniversitas } = DEMO_JURUSAN_DETAIL;

  return (
    <div>
      <Header title="Hasil Tes" />
      <XPadding>
        <div className="mt-8 bg-blue-500 py-2 flex justify-center items-center rounded-lg text-white font-semibold text-xl">
          {nama}
        </div>

        {/* Mapel TKA */}
        <div className="mt-8">
          <div className="font-semibold">Mapel TKA</div>
          <div className="ml-2">
            {mapelTka.map((mapel, index) => {
              return (
                <div key={mapel}>
                  {index + 1}. {mapel}
                </div>
              );
            })}
          </div>
        </div>

        {/* Daftar Univ */}
        <div className="mt-8">
          <div className="font-semibold mb-2">Daftar Universitas</div>
          <div className="ml-2">
            {/* Header Table menggunakan Grid */}
            <div className="grid grid-cols-[1fr_80px_80px] font-semibold text-gray-700 text-sm mb-2">
              <span>{/* sengaja dikosongin buat bikin gap */}</span>
              <span className="text-center">SNBP</span>
              <span className="text-center">SNBT</span>
            </div>

            {/* Baris Data menggunakan Grid yang Sama */}
            {daftarUniversitas.map((univ) => {
              return (
                <div
                  className="grid grid-cols-[1fr_80px_80px] py-1"
                  key={univ.id}
                >
                  <span className="truncate">{univ.nama}</span>
                  <span className="text-center text-gray-600">
                    {univ.scoreSnbp}
                  </span>
                  <span className="text-center text-gray-600">
                    {univ.scoreSnbt}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </XPadding>
    </div>
  );
}