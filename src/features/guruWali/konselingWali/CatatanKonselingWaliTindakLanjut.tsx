import React, { useState } from "react";
import Header from "../../../components/Header";
import XPadding from "../../../components/XPadding";

export default function CatatanKonselingWaliTindakLanjut() {
  // State untuk menampung ketikan tindak lanjut wali kelas
  const [tindakLanjut, setTindakLanjut] = useState("");

  const handleSimpan = () => {
    console.log("Tindak lanjut disimpan:", tindakLanjut);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF6] text-slate-800">
      <Header title="Catatan Konseling" />

      <XPadding className="mt-6 flex flex-col gap-5">
        {/* Label Tanggal Utama */}
        <div className="text-sm font-semibold text-slate-900 mb-1">
          Rabu, 21/10/2026
        </div>

        {/* Kotak Read-Only: Catatan BK */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-900">
            Catatan BK
          </label>
          <div className="w-full bg-[#e8f0fe]/70 border border-blue-200/50 rounded-2xl p-4 text-sm text-slate-500 min-h-[96px]">
            Isi catatan dari bk
          </div>
        </div>

        {/* Kotak Input Aktif: Tindak lanjut wali kelas */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-900">
            Tindak lanjut wali kelas
          </label>
          <textarea
            value={tindakLanjut}
            onChange={(e) => setTindakLanjut(e.target.value)}
            placeholder="Ketik tindak lanjut disini"
            rows={4}
            className="w-full bg-[#e8f0fe]/70 border border-blue-200/50 rounded-2xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 resize-none transition min-h-[96px]"
          />
        </div>

        {/* Button Simpan: Posisi Rata Kanan */}
        <div className="flex justify-end mt-1">
          <button
            onClick={handleSimpan}
            className="bg-[#1e88e5] text-white text-sm font-medium px-6 py-2.5 rounded-xl shadow-sm hover:bg-blue-600 transition active:scale-[0.98]"
          >
            Simpan
          </button>
        </div>
      </XPadding>
    </div>
  );
}
