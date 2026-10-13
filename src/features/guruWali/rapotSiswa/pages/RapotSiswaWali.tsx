import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useNavigate, useParams } from "react-router-dom";

import XPadding from "@/shared/components/layout/XPadding";
import EmptyState from "@/shared/components/state/EmptyState";
import ErrorState from "@/shared/components/state/ErrorState";

import GreenPill from "../components/GreenPill";
import RapotShell from "../components/RapotShell";
import { useRapotSiswaWali } from "../hooks/useRapot";

// Halaman daftar nilai siswa per mapel (FR-RAPOT-001).
export default function RapotSiswaWali() {
  const navigate = useNavigate();
  const { siswa_id } = useParams();
  const { state, reload } = useRapotSiswaWali();

  if (state.status === "loading") {
    return (
      <RapotShell>
        <p role="status" className="mt-4 text-sm text-slate-500">
          Memuat rapor…
        </p>
      </RapotShell>
    );
  }

  if (state.status === "error") {
    return (
      <RapotShell>
        <ErrorState
          title="Gagal memuat rapor"
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

  const { nama, mapel } = state.data;

  return (
    <RapotShell>
      {/* Section Data dan WA Siswa */}
      <XPadding className="mt-6 flex justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-slate-900 leading-tight">
            {nama}
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Rekap nilai per mata pelajaran
          </p>
        </div>

        {/* Tombol WhatsApp Hijau */}
        <button
          onClick={() => window.open("https://wa.me", "_blank")}
          className="text-[#25D366] hover:text-[#20ba56] transition-colors p-1"
        >
          <WhatsAppIcon style={{ fontSize: 32 }} />
        </button>
      </XPadding>

      {/* Section List Mapel Siswa */}
      {mapel.length === 0 ? (
        <EmptyState
          title="Belum ada nilai"
          description="Nilai per mata pelajaran belum tersedia."
        />
      ) : (
        <div className="mt-8 border-t border-slate-300">
          {mapel.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-4 px-6 border-b border-slate-200 bg-transparent"
            >
              <span className="text-base font-semibold text-slate-900">
                {item.nama}
              </span>

              <div className="flex items-center gap-4">
                <GreenPill className="text-sm font-bold px-4 py-1.5 min-w-[55px] text-center">
                  {item.nilai}
                </GreenPill>
                <button
                  onClick={() =>
                    navigate(
                      `/guruWali/rapot/siswa/${siswa_id ?? ""}/mapel/${item.id}`,
                    )
                  }
                  className="text-slate-400 hover:text-slate-600 p-0.5 inline-flex items-center justify-center"
                >
                  <PlayArrowIcon style={{ fontSize: 18 }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </RapotShell>
  );
}