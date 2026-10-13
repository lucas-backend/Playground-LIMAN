import XPadding from "@/shared/components/layout/XPadding";
import EmptyState from "@/shared/components/state/EmptyState";
import ErrorState from "@/shared/components/state/ErrorState";

import GreenPill from "../components/GreenPill";
import RapotShell from "../components/RapotShell";
import { useRapotAbsensiMateri } from "../hooks/useRapot";

// Halaman detail pertemuan absensi per materi pada rapor.
export default function RapotAbsensiMateri() {
  const { state, reload } = useRapotAbsensiMateri();

  if (state.status === "loading") {
    return (
      <RapotShell>
        <p role="status" className="mt-4 text-sm text-slate-500">
          Memuat absensi materi…
        </p>
      </RapotShell>
    );
  }

  if (state.status === "error") {
    return (
      <RapotShell>
        <ErrorState
          title="Gagal memuat absensi materi"
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

  const { nama, mapelBab, rows } = state.data;

  return (
    <RapotShell>
      {/* Section 1: Nama Siswa, Mata Pelajaran & Bab */}
      <XPadding className="mt-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-slate-900 leading-tight">
            {nama}
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5 capitalize">
            {mapelBab}
          </p>
        </div>
      </XPadding>

      {/* Section 2: Tabel Rekap Absensi Pertemuan */}
      {rows.length === 0 ? (
        <EmptyState
          title="Belum ada pertemuan"
          description="Daftar pertemuan materi ini belum tersedia."
        />
      ) : (
        <div className="mt-8 border-t border-slate-300 w-full">
          <table className="w-full border-collapse text-sm table-fixed">
            <thead>
              <tr className="border-b border-slate-300 bg-transparent font-bold text-slate-900">
                <th className="py-3 px-6 text-left font-bold w-[35%]">
                  Pertemuan
                </th>
                <th className="py-3 text-center font-bold w-[35%]">Tanggal</th>
                <th className="py-3 px-6 text-center font-bold w-[30%]">
                  Keterangan
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-200 bg-transparent h-[48px]"
                >
                  <td className="py-2 px-6 text-left font-medium text-slate-700 truncate">
                    {row.pertemuan}
                  </td>
                  <td className="py-2 text-center text-slate-600 font-medium">
                    {row.tanggal}
                  </td>
                  <td className="py-2 px-6 text-center">
                    <GreenPill className="w-full max-w-[80px] py-1 text-xs font-semibold text-center">
                      {row.status}
                    </GreenPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </RapotShell>
  );
}