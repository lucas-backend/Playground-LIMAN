import { useState } from "react";
import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";

export default function CatatanKonselingWali() {
  // State untuk menyimpan data inputan form
  const [tanggal, setTanggal] = useState("20/20/2026"); // Menyamakan dengan placeholder unik di gambar
  const [catatan, setCatatan] = useState("");

  const handleSimpan = () => {
    // Logika aksi saat tombol simpan ditekan
    console.log("Data disimpan:", { tanggal, catatan });
  };

  return (
    <div className="min-h-screen bg-[#FFFDF6] text-slate-800">
      <Header title="Catatan Konseling" />

      <XPadding className="mt-6 flex flex-col gap-5">
        {/* Input Field: Tanggal */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-900">
            Tanggal
          </label>
          <input
            type="text"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full bg-[#e8f0fe]/70 border border-blue-200/50 rounded-2xl px-4 py-3.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition"
          />
        </div>

        {/* Input Field: Isi Catatan */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-900">
            Isi catatan
          </label>
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Ketik catatan disini"
            rows={5}
            className="w-full bg-[#e8f0fe]/70 border border-blue-200/50 rounded-2xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 resize-none transition min-h-[120px]"
          />
        </div>

        {/* Button Simpan: Rata Kanan */}
        <div className="flex justify-end mt-2">
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
