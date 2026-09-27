import Header from "../../components/Header";
import XPadding from "../../components/XPadding";
import HistoryIcon from "@mui/icons-material/History";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useNavigate } from "react-router-dom";

const tanggal = "11/11/2026";
const minat = "IT & Komputer";
const bakat = "Programming";

const jurusanRekomendasi = [
  "Teknik Informatika",
  "Sistem Infromasi",
  "Ilmu Komputer",
];

export default function HasilMinatBakat() {
  const navigate = useNavigate();
  return (
    <div>
      <Header title="Hasil Tes" />
      <XPadding>
        <div className="flex gap-2 mt-8 text-black/50">
          {/* Icon */}
          <HistoryIcon />

          {/* Tanggal */}
          <span>Waktu Tes: {tanggal}</span>
        </div>

        <div className="flex flex-col">
          <span className="font-semibold">Minat: {minat}</span>
          <span className="font-semibold">Minat: {bakat}</span>
          <span className="font-semibold">Rekomendasi Jurusan: </span>
        </div>

        <div className="flex flex-col gap-2 py-2">
          {jurusanRekomendasi.map((jurusan, index) => {
            return (
              <button
                key={index}
                className="py-2 px-4 pr-1.5 pb-2.5 font-semibold bg-blue-500 text-white rounded-lg flex items-center justify-between"
                onClick={() => {
                  navigate("/hasil_minat_bakat/1/jurusan/1");
                }}
              >
                <span>
                  {index + 1}. {jurusan}{" "}
                </span>
                <ArrowRightIcon />
              </button>
            );
          })}

          <div className="w-full flex justify-end mt-2">
            <button
              className="bg-green-600 px-4 py-2 rounded-lg font-semibold text-white"
              onClick={() => {
                navigate("/hasil_minat_bakat/:id/tambah_jurusan"); 
              }}
            >
              Tambah Target Jurusan Lain
            </button>
          </div>
        </div>

        <button></button>
      </XPadding>
    </div>
  );
}
