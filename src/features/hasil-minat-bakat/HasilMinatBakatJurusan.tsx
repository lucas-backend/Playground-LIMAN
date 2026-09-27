import Header from "../../components/Header";
import XPadding from "../../components/XPadding";

const jurusan = "Teknik Informatika";
const mapelTKA = ["Informatika", "Matematika Lanjut"];
const daftarUniv = [
  { name: "UI", scoreSNBP: 90, scoreSNBT: 750 },
  { name: "UGM", scoreSNBP: 92, scoreSNBT: 756 },
  { name: "UNILA", scoreSNBP: 90, scoreSNBT: 733 },
];

export default function HasilMinatBakatJurusan() {
  return (
    <div>
      <Header title="Hasil Tes" />
      <XPadding>
        <div className="mt-8 bg-blue-500 py-2 flex justify-center items-center rounded-lg text-white font-semibold text-xl">
          {jurusan}
        </div>

        {/* Mapel TKA */}
        <div className="mt-8">
          <div className="font-semibold">Mapel TKA</div>
          <div className="ml-2">
            {mapelTKA.map((mapel, index) => {
              return (
                <div key={index}>
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
              {/* Mengisi slot kosong / {} sebelumnya */}
              <span className="text-center">SNBP</span>
              <span className="text-center">SNBT</span>
            </div>

            {/* Baris Data menggunakan Grid yang Sama */}
            {daftarUniv.map((univ, index) => {
              return (
                <div
                  className="grid grid-cols-[1fr_80px_80px] py-1 
                  "
                  key={index}
                >
                  <span className="truncate">{univ.name}</span>
                  <span className="text-center text-gray-600">
                    {univ.scoreSNBP}
                  </span>
                  <span className="text-center text-gray-600">
                    {univ.scoreSNBT}
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
