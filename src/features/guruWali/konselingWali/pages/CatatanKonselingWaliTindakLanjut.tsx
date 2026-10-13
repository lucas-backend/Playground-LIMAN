import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import XPadding from "@/shared/components/layout/XPadding";
import EmptyState from "@/shared/components/state/EmptyState";
import ErrorState from "@/shared/components/state/ErrorState";

import KonselingShell from "../components/KonselingShell";
import {
  useCatatanBkById,
  useSimpanTindakLanjut,
} from "../hooks/useKonselingWali";
import { formatTanggal } from "../model/konseling";

/**
 * Form tindak lanjut wali kelas atas catatan BK (FR-KONSELING-002): menampilkan
 * catatan BK terkait (read-only), menyimpan tindak lanjut lewat adapter mock,
 * lalu kembali ke halaman konseling siswa.
 */
export default function CatatanKonselingWaliTindakLanjut() {
  const { siswa_id, id_catatan_bk } = useParams();
  const navigate = useNavigate();
  const catatanView = useCatatanBkById(id_catatan_bk ?? "");
  const { submitting, formError, submit } = useSimpanTindakLanjut(
    id_catatan_bk ?? "",
  );
  const [tindakLanjut, setTindakLanjut] = useState("");

  const handleSimpan = async () => {
    if (await submit(tindakLanjut)) {
      navigate(`/guruWali/konseling/siswa/${siswa_id}`);
    }
  };

  if (catatanView.state.status === "error") {
    return (
      <KonselingShell>
        <XPadding className="mt-6">
          <ErrorState
            title="Gagal memuat catatan BK"
            description="Silakan coba lagi."
            action={
              <button
                type="button"
                onClick={catatanView.reload}
                className="mt-2 text-sm font-semibold text-brand-600 underline"
              >
                Coba lagi
              </button>
            }
          />
        </XPadding>
      </KonselingShell>
    );
  }

  if (catatanView.state.status === "loading") {
    return (
      <KonselingShell>
        <XPadding className="mt-6">
          <p role="status" className="text-sm text-slate-500">
            Memuat catatan BK…
          </p>
        </XPadding>
      </KonselingShell>
    );
  }

  const catatanBk = catatanView.state.data;
  if (!catatanBk) {
    return (
      <KonselingShell>
        <XPadding className="mt-6">
          <EmptyState
            title="Catatan BK tidak ditemukan"
            description="Catatan yang ingin ditindaklanjuti tidak tersedia."
          />
        </XPadding>
      </KonselingShell>
    );
  }

  return (
    <KonselingShell>
      <XPadding className="mt-6 flex flex-col gap-5">
        <div className="text-sm font-semibold text-slate-900 mb-1">
          {formatTanggal(catatanBk.tanggal)}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-900">
            Catatan BK
          </span>
          <div className="w-full bg-surface-muted/70 border border-blue-200/50 rounded-2xl p-4 text-sm text-slate-500 min-h-[96px]">
            {catatanBk.isi}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="tindak-lanjut"
            className="text-sm font-semibold text-slate-900"
          >
            Tindak lanjut wali kelas
          </label>
          <textarea
            id="tindak-lanjut"
            value={tindakLanjut}
            onChange={(e) => setTindakLanjut(e.target.value)}
            placeholder="Ketik tindak lanjut disini"
            rows={4}
            className="w-full bg-surface-muted/70 border border-blue-200/50 rounded-2xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 resize-none transition min-h-[96px]"
          />
        </div>

        {formError ? (
          <p role="alert" className="text-sm font-medium text-danger">
            {formError}
          </p>
        ) : null}

        <div className="flex justify-end mt-1">
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
