import React from "react";
import Header from "../../../components/Header";
import XPadding from "../../../components/XPadding";

// Data absensi mata pelajaran berdasarkan gambar
const detailHariData = [
  { waktu: "07.00-08.30", mapel: "Matematika", status: "Hadir" },
  { waktu: "08.30-10.00", mapel: "Bahasa Indonesia", status: "Hadir" }, // Typo di gambar 'Bahasa Indoensia' diperbaiki di sini
  { waktu: "10.30-11.30", mapel: "Sejarah", status: "Dispen" },
];

// Membuat baris kosong tambahan agar tabel memanjang ke bawah sesuai gambar
const emptyRows = Array(14).fill(null);

export default function AbsensiWaliDetailSiswaDetailHari() {
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

          {/* Detail Absensi Hari Itu */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-center border-collapse text-sm table-fixed">
              <thead>
                <tr className="border-b border-slate-200 bg-white font-semibold text-slate-900">
                  <th className="py-4 px-4 text-left font-semibold w-[35%]">
                    Waktu
                  </th>
                  <th className="py-4 text-left font-semibold w-[40%]">
                    Mata Pelajaran
                  </th>
                  <th className="py-4 px-4 text-center font-semibold w-[25%]">
                    Keterangan
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Menampilkan Baris Data */}
                {detailHariData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-100 bg-white h-[48px]"
                  >
                    <td className="py-2 px-4 text-left font-medium text-slate-700">
                      {row.waktu}
                    </td>
                    <td className="py-2 text-left text-slate-700">
                      {row.mapel}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <span
                        className={`inline-block w-full max-w-[75px] py-1 text-xs font-semibold rounded-full border text-center ${
                          row.status === "Hadir"
                            ? "bg-[#c8e6c9] border-[#a5d6a7] text-[#2e7d32]"
                            : "bg-[#f5e4d7] border-[#e6ccb8] text-[#8d6e63]"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Menampilkan Baris Kosong Tambahan */}
                {emptyRows.map((_, idx) => (
                  <tr
                    key={`empty-${idx}`}
                    className="border-b border-slate-100 bg-white h-[48px]"
                  >
                    <td className="py-2 px-4"></td>
                    <td className="py-2"></td>
                    <td className="py-2 px-4"></td>
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
