import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

const dataMateriAbsensi = [
  { materi: "BAB 1", jp: 3, h: 14, i: 1, s: 1, a: 0, d: 0 },
  { materi: "BAB 2", jp: 4, h: 14, i: 1, s: 1, a: 0, d: 0 },
  { materi: "BAB 3", jp: 5, h: 14, i: 1, s: 1, a: 0, d: 0 },
];

export default function RapotAbsensi() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFDF6] flex flex-col justify-between pb-6 text-slate-800">
      <div>
        <Header title="Rapot" />

        {/* Section 1: Nama Siswa dan Mata Pelajaran */}
        <XPadding className="mt-6">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-900 leading-tight">
              Yaza Nurzahira
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-0.5">
              Matematika
            </p>
          </div>
        </XPadding>

        {/* Section 2: Tabel Rekap Absensi (Anti Overlap & Rapat) */}
        <div className="mt-8 border-t border-slate-300 w-full overflow-x-auto balance-scroll">
          <div className="min-w-[340px] px-2"> {/* Mencegah tabel tercekik di bawah 340px */}
            <table className="w-full text-center border-collapse text-xs table-fixed">
              <thead>
                <tr className="border-b border-slate-300 bg-transparent font-bold text-slate-900">
                  {/* Kolom Materi diperlebar sedikit agar teks Bab aman */}
                  <th className="py-3 pl-3 pr-1 text-left font-bold w-[26%] text-sm">Materi</th>
                  {/* Kolom angka dipersempit menjadi merata 10% - 11% */}
                  <th className="py-3 font-bold w-[11%]">JP</th>
                  <th className="py-3 font-bold w-[10%]">H</th>
                  <th className="py-3 font-bold w-[10%]">I</th>
                  <th className="py-3 font-bold w-[10%]">S</th>
                  <th className="py-3 font-bold w-[10%]">A</th>
                  <th className="py-3 font-bold w-[10%]">D</th>
                  {/* Mengosongkan teks "Detail" agar space kolom mata biru lega */}
                  <th className="py-3 pr-3 w-[13%]"></th>
                </tr>
              </thead>
              <tbody>
                {dataMateriAbsensi.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-200 bg-transparent">
                    <td className="py-4 pl-3 pr-1 text-left font-medium text-slate-700 text-sm truncate">
                      {row.materi}
                    </td>
                    <td className="py-4 text-slate-600 font-semibold">{row.jp}</td>
                    <td className="py-4 text-slate-500">{row.h}</td>
                    <td className="py-4 text-slate-500">{row.i}</td>
                    <td className="py-4 text-slate-500">{row.s}</td>
                    <td className="py-4 text-slate-500">{row.a}</td>
                    <td className="py-4 text-slate-500">{row.d}</td>
                    <td className="py-4 pr-3 text-center">
                      <button
                        onClick={() => navigate(`/guruWali/rapot/absensi/siswa/1/materi/1`)}
                        className="text-blue-500 hover:text-blue-600 inline-flex items-center justify-center alignment-baseline"
                      >
                        <VisibilityIcon style={{ fontSize: 18 }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tombol Aksi Cetak */}
      <XPadding className="mt-6 mb-2">
        <button className="w-full bg-[#1e88e5] text-white font-medium py-3.5 rounded-2xl shadow-md hover:bg-blue-600 transition active:scale-[0.99] text-base tracking-wide">
          Cetak
        </button>
      </XPadding>
    </div>
  );
}
