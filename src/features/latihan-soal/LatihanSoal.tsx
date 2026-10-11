import { useNavigate } from "react-router-dom";

import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import EmptyState from "@/shared/components/state/EmptyState";
import ErrorState from "@/shared/components/state/ErrorState";

import MapelCard from "./components/MapelCard";
import { useLatihanSoal } from "./hooks/useLatihanSoal";

/**
 * Halaman daftar latihan soal per mata pelajaran (FR-LATIHAN-001).
 * Data berasal dari hook `useLatihanSoal` (adapter mock sampai backend siap).
 */
export default function LatihanSoal() {
  const navigate = useNavigate();
  const { state, reload } = useLatihanSoal();

  return (
    <div>
      <Header title="Latihan Soal" />
      <XPadding className="mt-8">
        <h3 className="text-xl font-semibold">Mata Pelajaran</h3>

        {state.status === "loading" ? (
          <p className="mt-4 text-sm text-slate-500">Memuat mata pelajaran…</p>
        ) : null}

        {state.status === "error" ? (
          <ErrorState
            title="Gagal memuat mata pelajaran"
            action={
              <button
                type="button"
                onClick={reload}
                className="font-medium text-brand-500 underline"
              >
                Coba lagi
              </button>
            }
          />
        ) : null}

        {state.status === "ready" ? (
          state.data.length === 0 ? (
            <EmptyState
              title="Belum ada latihan soal"
              description="Daftar mata pelajaran latihan belum tersedia."
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {state.data.map((mapel) => (
                <MapelCard
                  key={mapel.id}
                  mapel={mapel}
                  onSelect={(mapelId) =>
                    navigate(`/latihan-soal/mapel/${mapelId}`)
                  }
                />
              ))}
            </div>
          )
        ) : null}
      </XPadding>
    </div>
  );
}
