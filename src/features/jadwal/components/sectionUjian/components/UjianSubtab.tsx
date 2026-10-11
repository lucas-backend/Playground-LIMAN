import { useLocation, useNavigate } from "react-router-dom";

import EmptyState from "@/shared/components/state/EmptyState";
import ErrorState from "@/shared/components/state/ErrorState";
import QuizItemCard from "@/shared/components/ui/QuizItemCard";

import { useJadwalUjian } from "../../../hooks/useJadwal";

const ujianSubtabs = [
  { name: "Ulangan Harian", link: "/jadwal-siswa/ujian/ulangan-harian" },
  { name: "PTS", link: "/jadwal-siswa/ujian/pts" },
  { name: "PAS", link: "/jadwal-siswa/ujian/pas" },
];

const targetByPath: Record<string, string> = {
  "ulangan-harian": "Ulangan Harian",
  pts: "PTS",
  pas: "PAS",
};

export default function UjianSubtab() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, reload } = useJadwalUjian();

  const lastPath = location.pathname.split("/").pop();
  const itemTarget = lastPath ? targetByPath[lastPath] : undefined;

  const items =
    state.status === "ready"
      ? state.data.filter((item) => item.name === itemTarget)
      : [];

  return (
    <>
      {/* Sub Tab Button */}
      <div className="mt-4 flex gap-2">
        {ujianSubtabs.map((item, index) => (
          <button
            key={item.link}
            type="button"
            className={`flex-1 justify-center rounded-full border border-black/15 py-1 font-semibold ${index === 0 ? "flex-2" : ""} ${location.pathname === item.link ? "bg-blue-400/25" : ""} cursor-pointer hover:bg-blue-400/25`}
            onClick={() => navigate(item.link)}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* List jadwal */}
      <div className="mt-4 flex flex-col gap-4">
        {state.status === "loading" ? (
          <p role="status" className="text-sm text-slate-500">
            Memuat jadwal…
          </p>
        ) : null}

        {state.status === "error" ? (
          <ErrorState
            title="Gagal memuat jadwal ujian"
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

        {state.status === "ready" && items.length === 0 ? (
          <EmptyState
            title="Belum ada jadwal"
            description="Jadwal untuk kategori ini belum tersedia."
          />
        ) : null}

        {state.status === "ready"
          ? items.map((item, index) => (
              <QuizItemCard item={item} key={index} />
            ))
          : null}
      </div>
    </>
  );
}