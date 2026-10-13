import VisibilityIcon from "@mui/icons-material/Visibility";

import XPadding from "@/shared/components/layout/XPadding";

import {
  KOLOM_REKAP,
  type SiswaWali,
  type WaliKelasInfo,
} from "../model/absensiWali";

/** Tab Absensi pada menu wali kelas: rekap H/I/S/A/D tiap siswa. */
export default function MenuTabAbsensi({
  kelas,
  siswa,
  onDetail,
}: {
  kelas: WaliKelasInfo;
  siswa: SiswaWali[];
  onDetail: (siswaId: string) => void;
}) {
  return (
    <>
      <XPadding className="mt-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
          {kelas.nama}
        </h2>
      </XPadding>

      <XPadding className="mt-2">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-center border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th
                  rowSpan={2}
                  className="py-3 px-4 text-left font-semibold border-r border-slate-200 w-1/3"
                >
                  Nama
                </th>
                <th
                  colSpan={KOLOM_REKAP.length}
                  className="py-1.5 font-semibold border-b border-slate-200"
                >
                  Total Absen
                </th>
                <th
                  rowSpan={2}
                  className="py-3 px-2 font-semibold border-l border-slate-200"
                >
                  Detail
                </th>
              </tr>
              <tr className="border-b border-slate-200 bg-white text-xs font-medium text-slate-600">
                {KOLOM_REKAP.map((kolom) => (
                  <th key={kolom.key} className="py-1 border-r border-slate-100">
                    {kolom.kode}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {siswa.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 last:border-none hover:bg-slate-50"
                >
                  <td className="py-3 px-4 text-left font-medium text-slate-900 border-r border-slate-200 truncate max-w-[120px]">
                    {item.nama}
                  </td>
                  {KOLOM_REKAP.map((kolom) => (
                    <td
                      key={kolom.key}
                      className="py-3 border-r border-slate-100 text-slate-700"
                    >
                      {item.rekap[kolom.key]}
                    </td>
                  ))}
                  <td className="py-3 border-l border-slate-200">
                    <button
                      type="button"
                      aria-label={`Lihat absensi ${item.nama}`}
                      className="text-blue-500 hover:text-blue-600 inline-flex items-center justify-center"
                      onClick={() => onDetail(item.id)}
                    >
                      <VisibilityIcon style={{ fontSize: 20 }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </XPadding>
    </>
  );
}
