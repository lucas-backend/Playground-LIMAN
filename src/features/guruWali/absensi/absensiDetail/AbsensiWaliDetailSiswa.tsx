import React from "react";
import Header from "../../../../components/Header";
import XPadding from "../../../../components/XPadding";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

// Data absensi siswa berdasarkan gambar
const dataAbsensi = [
  { tanggal: "21/10/2026", h: 8, i: 0, s: 0, a: 0, d: 0 },
  { tanggal: "22/10/2026", h: 8, i: 0, s: 0, a: 0, d: 0 },
  { tanggal: "23/10/2026", h: 8, i: 0, s: 0, a: 0, d: 0 },
  { tanggal: "24/10/2026", h: 8, i: 0, s: 0, a: 0, d: 0 },
];

// Membuat baris kosong tambahan agar tabel terlihat memanjang ke bawah sesuai gambar
const emptyRows = Array(13).fill(null);

export default function AbsensiWaliDetailSiswa() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FFFDF6] flex flex-col justify-between pb-6 text-slate-800">
      <div>
        <Header title="Absensi" />

        <XPadding className="mt-4 flex flex-col gap-5">
          {/* Card Info Siswa */}
          <div className="bg-[#1e88e5] text-white p-4 rounded-2xl shadow-sm flex flex-col gap-1 text-sm font-medium">
            <p>Nama Siswa: Yaza Nurzahira</p>
            <p>Kelas: 12 IPA 1</p>
            <p>Total kehadiran: 98%</p>
          </div>

          {/* Tabel Absensi Siswa */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-center border-collapse text-sm table-fixed">
              <thead>
                <tr className="border-b border-slate-200 bg-white font-semibold text-slate-900">
                  <th className="py-3 px-4 text-left font-semibold w-[32%]">
                    Tanggal
                  </th>
                  <th className="py-3 font-semibold w-[9%]">H</th>
                  <th className="py-3 font-semibold w-[9%]">I</th>
                  <th className="py-3 font-semibold w-[9%]">S</th>
                  <th className="py-3 font-semibold w-[9%]">A</th>
                  <th className="py-3 font-semibold w-[9%]">D</th>
                  <th className="py-3 font-semibold w-[23%]">Detail</th>
                </tr>
              </thead>
              <tbody>
                {/* Menampilkan Baris Data */}
                {dataAbsensi.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100 bg-white">
                    <td className="py-3 px-4 text-left font-medium text-slate-700">
                      {row.tanggal}
                    </td>
                    <td className="py-3 text-slate-600">{row.h}</td>
                    <td className="py-3 text-slate-600">{row.i}</td>
                    <td className="py-3 text-slate-600">{row.s}</td>
                    <td className="py-3 text-slate-600">{row.a}</td>
                    <td className="py-3 text-slate-600">{row.d}</td>
                    <td className="py-3">
                      <button
                        className="text-blue-500 hover:text-blue-600 inline-flex items-center justify-center alignment-baseline"
                        onClick={() => {
                          navigate("/guruWali/absensi/siswa/1/detail/");
                        }}
                      >
                        <VisibilityIcon style={{ fontSize: 20 }} />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Menampilkan Baris Kosong Tambahan agar Panjang Kebawah */}
                {emptyRows.map((_, idx) => (
                  <tr
                    key={`empty-${idx}`}
                    className="border-b border-slate-100 bg-white h-[45px]"
                  >
                    <td className="py-3 px-4"></td>
                    <td className="py-3"></td>
                    <td className="py-3"></td>
                    <td className="py-3"></td>
                    <td className="py-3"></td>
                    <td className="py-3"></td>
                    <td className="py-3"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </XPadding>
      </div>

      {/* Tombol Cetak Sticky di Bagian Bawah */}
      <XPadding className="mt-6 mb-2">
        <button className="w-full bg-[#1e88e5] text-white font-medium py-3.5 rounded-2xl shadow-md hover:bg-blue-600 transition active:scale-[0.99] text-base tracking-wide">
          Cetak
        </button>
      </XPadding>
    </div>
  );
}
