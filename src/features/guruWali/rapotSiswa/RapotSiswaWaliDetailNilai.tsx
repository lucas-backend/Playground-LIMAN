import React from "react";
import Header from "../../../components/Header";
import XPadding from "../../../components/XPadding";
import { useNavigate } from "react-router-dom";

// Data nilai yang dikelompokkan berdasarkan kategori sesuai gambar
const kategoriNilai = [
  {
    kategori: "Tugas",
    list: [
      { nama: "Tugas 1", skor: 92 },
      { nama: "Tugas 2", skor: 92 },
    ],
  },
  {
    kategori: "Ulangan Harian",
    list: [
      { nama: "Ulangan Harian 1", skor: 92 },
      { nama: "Ulangan Harian 2", skor: 92 },
    ],
  },
  {
    kategori: "Penilaian tengah & akhir semester",
    list: [
      { nama: "PTS", skor: 92 },
      { nama: "PAS", skor: 92 },
    ],
  },
];

export default function RapotSiswaWaliDetailNilai() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFDF6] flex flex-col justify-between pb-6 text-slate-800">
      <div>
        <Header title="Rapot" />

        {/* Section 1: Nama dan Mapel */}
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

        {/* Section 2: Nilai-Nilai berdasar kelompok */}
        <div className="mt-6 flex flex-col">
          {kategoriNilai.map((grup, grupIdx) => (
            <div key={grupIdx} className="mb-2">
              {/* Header Kategori */}
              <div className="px-6 py-2 bg-transparent text-sm font-medium text-slate-400">
                {grup.kategori}
              </div>

              {/* List Item Nilai */}
              <div className="border-t border-slate-200">
                {grup.list.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex justify-between items-center py-4 px-6 border-b border-slate-200 bg-transparent text-sm font-semibold text-slate-900"
                  >
                    <span>{item.nama}</span>
                    <span>{item.skor}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Baris Total: Nilai Akhir */}
          <div>
            <div className="px-6 py-2 bg-transparent text-sm font-medium text-slate-400">
              {/* Spacer Kategori */}
            </div>
            <div className="flex justify-between items-center py-4 px-6 border-y border-slate-200 bg-transparent text-sm font-semibold text-slate-900">
              <span>Nilai akhir</span>
              <span>92</span>
            </div>
          </div>
        </div>

        {/* Section 3: Button Lihat Absensi dan Status Tuntas */}
        <XPadding className="mt-4 flex justify-between items-center">
          {/* Tombol Lihat Absensi */}
          <button
            onClick={() => navigate("/guruWali/rapot/absensi/siswa/1")}
            className="bg-blue-500 hover:bg-[#b8dbb9] text-white font-semibold px-4 py-2 rounded-lg border border-[#a5d6a7] transition-colors"
          >
            Lihat Absensi
          </button>

          {/* Status Keterangan Tuntas */}
          <span className="inline-block bg-[#c8e6c9] text-[#2e7d32] font-semibold px-5 py-2 rounded-full border border-[#a5d6a7]">
            Tuntas
          </span>
        </XPadding>
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
