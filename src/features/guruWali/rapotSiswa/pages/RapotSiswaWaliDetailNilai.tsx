import { useNavigate, useParams } from "react-router-dom";

import XPadding from "@/shared/components/layout/XPadding";
import EmptyState from "@/shared/components/state/EmptyState";
import ErrorState from "@/shared/components/state/ErrorState";

import GreenPill from "../components/GreenPill";
import RapotShell from "../components/RapotShell";
import { useRapotMapelDetail } from "../hooks/useRapot";

// Halaman detail nilai per mapel (FR-RAPOT-002).
export default function RapotSiswaWaliDetailNilai() {
  const navigate = useNavigate();
  const { siswa_id } = useParams();
  const { state, reload } = useRapotMapelDetail();

  if (state.status === "loading") {
    return (
      <RapotShell>
        <p role="status" className="mt-4 text-sm text-slate-500">
          Memuat nilai…
        </p>
      </RapotShell>
    );
  }

  if (state.status === "error") {
    return (
      <RapotShell>
        <ErrorState
          title="Gagal memuat nilai"
          description="Periksa koneksi Anda lalu coba lagi."
          action={
            <button
              type="button"
              onClick={reload}
              className="mt-2 text-sm font-medium text-brand-600 underline"
            >
              Coba lagi
            </button>
          }
        />
      </RapotShell>
    );
  }

  const { nama, mapel, kategori, nilaiAkhir } = state.data;

  return (
    <RapotShell>
      {/* Section 1: Nama dan Mapel */}
      <XPadding className="mt-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-slate-900 leading-tight">
            {nama}
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">{mapel}</p>
        </div>
      </XPadding>

      {/* Section 2: Nilai-Nilai berdasar kelompok */}
      {kategori.length === 0 ? (
        <EmptyState
          title="Belum ada nilai"
          description="Detail nilai per mapel belum tersedia."
        />
      ) : (
        <div className="mt-6 flex flex-col">
          {kategori.map((grup, grupIdx) => (
            <div key={grupIdx} className="mb-2">
              <div className="px-6 py-2 bg-transparent text-sm font-medium text-slate-400">
                {grup.kategori}
              </div>

              <div className="border-t border-slate-200">
                {grup.items.map((item, itemIdx) => (
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
              <span>{nilaiAkhir}</span>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Button Lihat Absensi dan Status Tuntas */}
      <XPadding className="mt-4 flex justify-between items-center">
        <button
          onClick={() =>
            navigate(`/guruWali/rapot/absensi/siswa/${siswa_id ?? ""}`)
          }
          className="bg-blue-500 hover:bg-[#b8dbb9] text-white font-semibold px-4 py-2 rounded-lg border border-[#a5d6a7] transition-colors"
        >
          Lihat Absensi
        </button>

        <GreenPill className="font-semibold px-5 py-2">Tuntas</GreenPill>
      </XPadding>
    </RapotShell>
  );
}