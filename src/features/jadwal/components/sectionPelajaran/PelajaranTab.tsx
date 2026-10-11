import EmptyState from "@/shared/components/state/EmptyState";
import ErrorState from "@/shared/components/state/ErrorState";

import { useJadwalPelajaran } from "../../hooks/useJadwal";
import JadwalDateStrip from "./JadwalDateStrip";
import JadwalSection from "./JadwalSection";

export default function PelajaranTab() {
  const { state, reload } = useJadwalPelajaran();

  return (
    <>
      {state.status === "loading" ? (
        <p role="status" className="mt-4 text-sm text-slate-500">
          Memuat jadwal…
        </p>
      ) : null}

      {state.status === "error" ? (
        <ErrorState
          title="Gagal memuat jadwal"
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

      {state.status === "ready" ? (
        state.data.sections.length === 0 ? (
          <EmptyState
            title="Belum ada jadwal pelajaran"
            description="Jadwal pelajaran belum tersedia."
          />
        ) : (
          <>
            <JadwalDateStrip dates={state.data.dates} />

            {state.data.sections.map((section) => (
              <JadwalSection
                key={section.title}
                title={section.title}
                items={section.items}
              />
            ))}
          </>
        )
      ) : null}
    </>
  );
}