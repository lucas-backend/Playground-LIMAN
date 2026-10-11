import EmptyState from "@/shared/components/state/EmptyState";
import ErrorState from "@/shared/components/state/ErrorState";
import QuizItemCard from "@/shared/components/ui/QuizItemCard";

import { useJadwalTryout } from "../../hooks/useJadwal";

export default function TryoutTab() {
  const { state, reload } = useJadwalTryout();

  return (
    <>
      {/* 2 button container */}
      <div className="mt-4 flex justify-between gap-4">
        <button
          type="button"
          className="flex flex-1 items-center justify-center rounded-full border border-black/10 bg-blue-400/25 py-1"
        >
          Jadwal Try Out
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center rounded-full border border-black/10 py-1"
        >
          Riwayat
        </button>
      </div>

      {/* List Jadwal */}
      <div className="mt-4 flex flex-col gap-4">
        {state.status === "loading" ? (
          <p role="status" className="text-sm text-slate-500">
            Memuat jadwal…
          </p>
        ) : null}

        {state.status === "error" ? (
          <ErrorState
            title="Gagal memuat jadwal try out"
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
        ) : null}

        {state.status === "ready" && state.data.length === 0 ? (
          <EmptyState
            title="Belum ada jadwal try out"
            description="Daftar try out belum tersedia."
          />
        ) : null}

        {state.status === "ready"
          ? state.data.map((item, index) => (
              <QuizItemCard item={item} key={index} />
            ))
          : null}
      </div>
    </>
  );
}