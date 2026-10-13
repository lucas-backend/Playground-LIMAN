import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate, useParams } from "react-router-dom";

import XPadding from "@/shared/components/layout/XPadding";
import EmptyState from "@/shared/components/state/EmptyState";
import ErrorState from "@/shared/components/state/ErrorState";

import RapotShell from "../components/RapotShell";
import { useRapotAbsensi } from "../hooks/useRapot";

// Halaman rekap absensi siswa per materi pada rapor.
export default function RapotAbsensi() {
  const navigate = useNavigate();
  const { siswa_id } = useParams();
  const { state, reload } = useRapotAbsensi();

  if (state.status === "loading") {
    return (
      <RapotShell>
        <p role="status" className="mt-4 text-sm text-slate-500">
          Memuat absensi…
        </p>
      </RapotShell>
    );
  }

  if (state.status === "error") {
    return (
      <RapotShell>
        <ErrorState
          title="Gagal memuat absensi"
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

  const { nama, mapel, rows } = state.data;

  return (
    <RapotShell>
      {/* Section 1: Nama Siswa dan Mata Pelajaran */}
      <XPadding className="mt-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-slate-900 leading-tight">
            {nama}
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">{mapel}</p>
        </div>
      </XPadding>

      {/* Section 2: Tabel Rekap Absensi */}
      {rows.length === 0 ? (
        <EmptyState
          title="Belum ada data absensi"
          description="Rekap absensi per materi belum tersedia."
        />
      ) : (
        <div className="mt-8 border-t border-slate-300 w-full overflow-x-auto balance-scroll">
          <div className="min-w-[340px] px-2">
            <table className="w-full text-center border-collapse text-xs table-fixed">
              <thead>
                <tr className="border-b border-slate-300 bg-transparent font-bold text-slate-900">
                  <th className="py-3 pl-3 pr-1 text-left font-bold w-[26%] text-sm">
                    Materi
                  </th>
                  <th className="py-3 font-bold w-[11%]">JP</th>
                  <th className="py-3 font-bold w-[10%]">H</th>
                  <th className="py-3 font-bold w-[10%]">I</th>
                  <th className="py-3 font-bold w-[10%]">S</th>
                  <th className="py-3 font-bold w-[10%]">A</th>
                  <th className="py-3 font-bold w-[10%]">D</th>
                  <th className="py-3 pr-3 w-[13%]"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-200 bg-transparent"
                  >
                    <td className="py-4 pl-3 pr-1 text-left font-medium text-slate-700 text-sm truncate">
                      {row.materi}
                    </td>
                    <td className="py-4 text-slate-600 font-semibold">
                      {row.jp}
                    </td>
                    <td className="py-4 text-slate-500">{row.h}</td>
                    <td className="py-4 text-slate-500">{row.i}</td>
                    <td className="py-4 text-slate-500">{row.s}</td>
                    <td className="py-4 text-slate-500">{row.a}</td>
                    <td className="py-4 text-slate-500">{row.d}</td>
                    <td className="py-4 pr-3 text-center">
                      <button
                        onClick={() =>
                          navigate(
                            `/guruWali/rapot/absensi/siswa/${siswa_id ?? ""}/materi/${idx + 1}`,
                          )
                        }
                        className="text-blue-500 hover:text-blue-600 inline-flex items-center justify-center alignment-baseline"
                      >
                        <VisibilityIcon style={{ fontSize: 18 }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </RapotShell>
  );
}