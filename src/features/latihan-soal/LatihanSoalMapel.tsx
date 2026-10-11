import { useParams } from "react-router-dom";

import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import EmptyState from "@/shared/components/state/EmptyState";
import ErrorState from "@/shared/components/state/ErrorState";
import QuizItemCard from "@/shared/components/ui/QuizItemCard";

import MapelBanner from "./components/MapelBanner";
import { useLatihanSoalMapel } from "./hooks/useLatihanSoalMapel";

/**
 * Halaman latihan soal satu mata pelajaran (FR-LATIHAN-001). Parameter rute
 * kanonik adalah `:mapel_id` (lihat `src/app/router.tsx`).
 */
export default function LatihanSoalMapel() {
  const { mapel_id } = useParams();
  const { state, reload } = useLatihanSoalMapel(mapel_id);

  return (
    <div>
      <Header title="Latihan Soal" />
      <XPadding className="pt-8">
        {state.status === "loading" ? (
          <p className="text-sm text-slate-500">Memuat latihan soal…</p>
        ) : null}

        {state.status === "notfound" ? (
          <EmptyState
            title="Mata pelajaran tidak ditemukan"
            description="Mata pelajaran yang Anda buka tidak tersedia."
          />
        ) : null}

        {state.status === "error" ? (
          <ErrorState
            title="Gagal memuat latihan soal"
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
          <>
            <MapelBanner mapel={state.data.mapel} />

            {/* 2 tombol (belum ada perilaku; dipertahankan dari UI lama) */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                type="button"
                className="cursor-pointer pt-0.5 pb-1 flex items-center justify-center border border-black/15 rounded-full bg-blue-400/25"
              >
                Latihan Soal
              </button>
              <button
                type="button"
                className="cursor-pointer pt-0.5 pb-1 flex items-center justify-center border border-black/15 rounded-full hover:bg-blue-400/25"
              >
                Riwayat
              </button>
            </div>

            {/* List latihan soal */}
            <div className="flex flex-col gap-4 mt-4">
              {state.data.latihan.map((item, index) => (
                <QuizItemCard item={item} key={index} />
              ))}
            </div>
          </>
        ) : null}
      </XPadding>
    </div>
  );
}
