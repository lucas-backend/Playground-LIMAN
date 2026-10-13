import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import XPadding from "@/shared/components/layout/XPadding";

import KonselingShell from "../components/KonselingShell";
import { useSimpanCatatanWali } from "../hooks/useKonselingWali";

function tanggalHariIni(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Form tambah catatan konseling oleh wali kelas (FR-KONSELING-002): menyimpan
 * catatan lewat adapter mock lalu kembali ke halaman konseling siswa.
 */
export default function CatatanKonselingWali() {
  const { siswa_id } = useParams();
  const navigate = useNavigate();
  const { submitting, formError, submit } = useSimpanCatatanWali();

  const [tanggal, setTanggal] = useState(tanggalHariIni);
  const [catatan, setCatatan] = useState("");

  const handleSimpan = async () => {
    if (await submit(tanggal, catatan)) {
      navigate(`/guruWali/konseling/siswa/${siswa_id}`);
    }
  };

  return (
    <KonselingShell>
      <XPadding className="mt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="tanggal"
            className="text-sm font-semibold text-slate-900"
          >
            Tanggal
          </label>
          <input
            id="tanggal"
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full bg-surface-muted/70 border border-blue-200/50 rounded-2xl px-4 py-3.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="catatan"
            className="text-sm font-semibold text-slate-900"
          >
            Isi catatan
          </label>
          <textarea
            id="catatan"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Ketik catatan disini"
            rows={5}
            className="w-full bg-surface-muted/70 border border-blue-200/50 rounded-2xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 resize-none transition min-h-[120px]"
          />
        </div>

        {formError ? (
          <p role="alert" className="text-sm font-medium text-danger">
            {formError}
          </p>
        ) : null}

        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={handleSimpan}
            disabled={submitting}
            className="bg-brand-500 text-white text-sm font-medium px-6 py-2.5 rounded-xl shadow-sm hover:bg-blue-600 transition active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Menyimpan…" : "Simpan"}
          </button>
        </div>
      </XPadding>
    </KonselingShell>
  );
}
