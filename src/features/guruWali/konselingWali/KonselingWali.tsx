import { useState } from "react";
import Header from "../../../components/Header";
import XPadding from "../../../components/XPadding";
import {useNavigate }from "react-router-dom";

export default function KonselingWali() {
  // State untuk melacak tab sub-catatan aktif
  const [subTab, setSubTab] = useState<"wali" | "bk">("wali");

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FFFDF6] flex flex-col justify-between pb-6 text-slate-800">
      <div>
        <Header title="Catatan Konseling" />

        <XPadding className="mt-6">
          {/* Nama dan Kelas */}
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-900 leading-tight">
              Yaza Nurzahira
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-0.5">
              Kelas 12 IPA 1
            </p>
          </div>

          {/* 2 Button Fungsional mengganti Tab */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setSubTab("wali")}
              className={`flex-1 py-1.5 px-4 text-xs font-semibold rounded-full border transition-all text-center ${
                subTab === "wali"
                  ? "bg-blue-50 border-blue-500 text-slate-900 shadow-sm"
                  : "bg-white border-black text-slate-900"
              }`}
            >
              Catatan Wali Kelas
            </button>
            <button
              onClick={() => setSubTab("bk")}
              className={`flex-1 py-1.5 px-4 text-xs font-semibold rounded-full border transition-all text-center ${
                subTab === "bk"
                  ? "bg-blue-50 border-blue-500 text-slate-900 shadow-sm"
                  : "bg-white border-black text-slate-900"
              }`}
            >
              Catatan BK
            </button>
          </div>

          {/* Label Tanggal */}
          <div className="mt-6 text-sm font-semibold text-slate-900">
            Rabu, 21/10/2026
          </div>

          {/* Tab yang berganti berdasarkan button */}
          <div className="mt-3 border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col">
            {subTab === "wali" ? (
              <>
                {/* Tampilan Jika Tab Catatan Wali Kelas Aktif */}
                <div className="bg-blue-50 p-4 border-b border-slate-200 min-h-[110px]">
                  <h4 className="text-sm font-bold text-slate-900">Catatan Wali Kelas</h4>
                  <p className="text-xs text-slate-500 mt-1 italic">isinya ...</p>
                </div>
                <div className="p-4 bg-white min-h-[110px]">
                  <h4 className="text-sm font-bold text-slate-900">Tindak lanjut bk</h4>
                  <p className="text-xs text-slate-500 mt-1 italic">isinya ...</p>
                </div>
              </>
            ) : (
              <>
                {/* Tampilan Jika Tab Catatan BK Aktif */}
                <div className="bg-blue-50 p-4 border-b border-slate-200 min-h-[110px]">
                  <h4 className="text-sm font-bold text-slate-900">Catatan BK</h4>
                  <p className="text-xs text-slate-500 mt-1 italic">isinya ...</p>
                </div>
                <div className="p-4 bg-white min-h-[110px] flex flex-col justify-between items-center">
                  <div className="w-full text-left">
                    <h4 className="text-sm font-bold text-slate-900">Tindak lanjut wali kelas</h4>
                  </div>
                  {/* Button Tengah 'Isi tindak lanjut' */}
                  <button className="mt-4 bg-[#1e88e5] text-white text-xs font-medium px-5 py-2 rounded-xl shadow-sm hover:bg-blue-600 transition active:scale-[0.98]" onClick={() => {
                    navigate("/guruWali/konseling/siswa/1/tindakLanjut/1")
                  }}>
                    Isi Tindak Lanjut
                  </button>
                </div>
              </>
            )}
          </div>
        </XPadding>
      </div>

      {/* Button Sticky Aksi di Bagian Bawah Tergantung Tab */}
      <XPadding className="mt-8 mb-2">
        {subTab === "wali" ? (
          <button className="w-full bg-[#1e88e5] text-white font-medium py-3.5 rounded-2xl shadow-md hover:bg-blue-600 transition active:scale-[0.99] text-base tracking-wide" onClick={() => {
            navigate("/guruWali/konseling/siswa/:siswa_id/catatan")
          }}>
            Tambah Catatan
          </button>
        ) : (
          // Jika di tab BK, area tombol bawah dikosongkan (diwakili tombol isi tindak lanjut di dalam card)
          <div className="h-[54px] w-full bg-transparent pointer-events-none" />
        )}
      </XPadding>
    </div>
  );
}
