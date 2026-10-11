import Header from "../../../components/Header";
import XPadding from "../../../components/XPadding";
import WhatsAppIcon from "@mui/icons-material/WhatsApp"; // Ikon WA untuk hubungi siswa/ortu
import PlayArrowIcon from "@mui/icons-material/PlayArrow"; // Ikon panah abu-abu di list
import { useNavigate } from "react-router-dom";

// Data rekap nilai per mata pelajaran sesuai gambar
const mapelData = [
  { id: "matematika", nama: "Matematika", nilai: 92 },
  { id: "bahasa-indonesia", nama: "Bahasa Indonesia", nilai: 92 },
  { id: "bahasa-inggris", nama: "Bahasa Inggris", nilai: 92 },
  { id: "fisika", nama: "Fisika", nilai: 92 },
  { id: "kimia", nama: "Kimia", nilai: 92 },
  { id: "biologi", nama: "Biologi", nilai: 92 },
];

export default function RapotSiswaWali() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFDF6] flex flex-col justify-between pb-6 text-slate-800">
      <div>
        <Header title="Rapot" />

        {/* Section Data dan WA Siswa */}
        <XPadding className="mt-6 flex justify-between items-start">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-900 leading-tight">
              Yaza Nurzahira
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Rekap nilai per mata pelajaran
            </p>
          </div>
          
          {/* Tombol WhatsApp Hijau */}
          <button 
            onClick={() => window.open("https://wa.me", "_blank")}
            className="text-[#25D366] hover:text-[#20ba56] transition-colors p-1"
          >
            <WhatsAppIcon style={{ fontSize: 32 }} />
          </button>
        </XPadding>

        {/* Section List Mapel Siswa */}
        <div className="mt-8 border-t border-slate-300">
          {mapelData.map((mapel) => (
            <div
              key={mapel.id}
              className="flex justify-between items-center py-4 px-6 border-b border-slate-200 bg-transparent"
            >
              {/* Nama Mata Pelajaran */}
              <span className="text-base font-semibold text-slate-900">
                {mapel.nama}
              </span>

              {/* Sisi Kanan: Badge Nilai & Tombol Detail */}
              <div className="flex items-center gap-4">
                <span className="inline-block bg-[#c8e6c9] text-[#2e7d32] text-sm font-bold px-4 py-1.5 rounded-full border border-[#a5d6a7] min-w-[55px] text-center">
                  {mapel.nilai}
                </span>
                <button
                  onClick={() => navigate(`/guruWali/rapot/siswa/1/mapel/${mapel.id}`)}
                  className="text-slate-400 hover:text-slate-600 p-0.5 inline-flex items-center justify-center"
                >
                  <PlayArrowIcon style={{ fontSize: 18 }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tombol Aksi Cetak di Bagian Bawah */}
      <XPadding className="mt-6 mb-2">
        <button className="w-full bg-[#1e88e5] text-white font-medium py-3.5 rounded-2xl shadow-md hover:bg-blue-600 transition active:scale-[0.99] text-base tracking-wide">
          Cetak
        </button>
      </XPadding>
    </div>
  );
}
