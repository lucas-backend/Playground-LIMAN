import React from "react";
import Header from "../../../components/Header";
import XPadding from "../../../components/XPadding";

// Data daftar absensi pertemuan sesuai gambar
const dataPertemuanAbsensi = [
  { pertemuan: "Pertemuan 1", tanggal: "21/10/2026", status: "Hadir" },
  { pertemuan: "Pertemuan 2", tanggal: "22/10/2026", status: "Hadir" },
  { pertemuan: "Pertemuan 3", tanggal: "23/10/2026", status: "Hadir" },
];

export default function RapotAbsensiMateri() {
  return (
    <div className="min-h-screen bg-[#FFFDF6] flex flex-col justify-between pb-6 text-slate-800">
      <div>
        <Header title="Rapot" />

        {/* Section 1: Nama Siswa, Mata Pelajaran & Bab */}
        <XPadding className="mt-6">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-900 leading-tight">
              Yaza Nurzahira
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-0.5 capitalize">
              Matematika - bab 1
            </p>
          </div>
        </XPadding>

        {/* Section 2: Tabel Rekap Absensi Pertemuan */}
        <div className="mt-8 border-t border-slate-300 w-full">
          <table className="w-full border-collapse text-sm table-fixed">
            <thead>
              <tr className="border-b border-slate-300 bg-transparent font-bold text-slate-900">
                <th className="py-3 px-6 text-left font-bold w-[35%]">Pertemuan</th>
                <th className="py-3 text-center font-bold w-[35%]">Tanggal</th>
                <th className="py-3 px-6 text-center font-bold w-[30%]">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {dataPertemuanAbsensi.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-200 bg-transparent h-[48px]">
                  {/* Nama Pertemuan */}
                  <td className="py-2 px-6 text-left font-medium text-slate-700 truncate">
                    {row.pertemuan}
                  </td>
                  {/* Tanggal Pertemuan */}
                  <td className="py-2 text-center text-slate-600 font-medium">
                    {row.tanggal}
                  </td>
                  {/* Badge Status Keterangan */}
                  <td className="py-2 px-6 text-center">
                    <span className="inline-block w-full max-w-[80px] py-1 text-xs font-semibold rounded-full border border-[#a5d6a7] bg-[#c8e6c9] text-[#2e7d32] text-center">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
