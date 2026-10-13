import { useNavigate, useParams } from "react-router-dom";

import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import EmptyState from "@/shared/components/state/EmptyState";
import ErrorState from "@/shared/components/state/ErrorState";

import CetakButton from "./components/CetakButton";
import SiswaInfoCard from "./components/SiswaInfoCard";
import TabelHarianSiswa from "./components/TabelHarianSiswa";
import { useAbsensiSiswa } from "./hooks/useAbsensiSiswa";

// Riwayat absensi harian satu siswa (FR-ABS-003). Data berasal dari hook
// `useAbsensiSiswa` (adapter mock sampai kontrak API `Approved`).
export default function AbsensiWaliDetailSiswa() {
  const { siswa_id } = useParams();
  const siswaId = siswa_id ?? "";

  // `key` me-reset state hook saat siswa berubah (route yang sama).
  return <AbsensiWaliDetailSiswaContent key={siswaId} siswaId={siswaId} />;
}

function AbsensiWaliDetailSiswaContent({ siswaId }: { siswaId: string }) {
  const navigate = useNavigate();
  const { state, reload } = useAbsensiSiswa(siswaId);

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between pb-6 text-slate-800">
      <div>
        <Header title="Absensi" />

        <XPadding className="mt-4 flex flex-col gap-5">
          {state.status === "loading" ? (
            <p role="status" className="text-sm text-slate-500">
              Memuat riwayat absensi…
            </p>
          ) : null}

          {state.status === "error" ? (
            <ErrorState
              description="Gagal memuat riwayat absensi."
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
            state.data === null ? (
              <EmptyState
                title="Data absensi tidak ditemukan"
                description="Siswa tidak ada dalam cakupan perwalian."
              />
            ) : (
              <>
                <SiswaInfoCard ringkasan={state.data.ringkasan} />
                {state.data.harian.length > 0 ? (
                  <TabelHarianSiswa
                    harian={state.data.harian}
                    onDetail={() =>
                      navigate(`/guruWali/absensi/siswa/${siswaId}/detail/`)
                    }
                  />
                ) : (
                  <EmptyState
                    title="Belum ada riwayat absensi"
                    description="Tidak ada catatan absensi untuk siswa ini."
                  />
                )}
              </>
            )
          ) : null}
        </XPadding>
      </div>

      <CetakButton />
    </div>
  );
}
