import StatusBadge from "./StatusBadge";
import type { AbsensiPertemuan } from "../model/absensiWali";

// Baris kosong pengisi agar tabel memanjang sesuai desain (presentasional).
const BARIS_PENGISI = 14;

/** Tabel detail absensi satu hari per mata pelajaran/pertemuan. */
export default function TabelPertemuanHari({
  pertemuan,
}: {
  pertemuan: AbsensiPertemuan[];
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <table className="w-full text-center border-collapse text-sm table-fixed">
        <thead>
          <tr className="border-b border-slate-200 bg-white font-semibold text-slate-900">
            <th className="py-4 px-4 text-left font-semibold w-[35%]">Waktu</th>
            <th className="py-4 text-left font-semibold w-[40%]">
              Mata Pelajaran
            </th>
            <th className="py-4 px-4 text-center font-semibold w-[25%]">
              Keterangan
            </th>
          </tr>
        </thead>
        <tbody>
          {pertemuan.map((row) => (
            <tr
              key={row.id}
              className="border-b border-slate-100 bg-white h-[48px]"
            >
              <td className="py-2 px-4 text-left font-medium text-slate-700">
                {row.waktu}
              </td>
              <td className="py-2 text-left text-slate-700">{row.mapel}</td>
              <td className="py-2 px-4 text-center">
                <StatusBadge keterangan={row.keterangan} />
              </td>
            </tr>
          ))}

          {Array.from({ length: BARIS_PENGISI }).map((_, idx) => (
            <tr
              key={`pengisi-${idx}`}
              className="border-b border-slate-100 bg-white h-[48px]"
            >
              <td className="py-2 px-4" />
              <td className="py-2" />
              <td className="py-2 px-4" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
