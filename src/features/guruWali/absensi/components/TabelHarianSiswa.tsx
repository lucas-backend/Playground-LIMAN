import VisibilityIcon from "@mui/icons-material/Visibility";

import { KOLOM_REKAP, type AbsensiHarian } from "../model/absensiWali";

// Baris kosong pengisi agar tabel memanjang sesuai desain (presentasional).
const BARIS_PENGISI = 13;

/**
 * Tabel riwayat absensi harian siswa (kolom H/I/S/A/D per tanggal).
 * Tombol detail mengarah ke detail absensi satu hari.
 */
export default function TabelHarianSiswa({
  harian,
  onDetail,
}: {
  harian: AbsensiHarian[];
  onDetail: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <table className="w-full text-center border-collapse text-sm table-fixed">
        <thead>
          <tr className="border-b border-slate-200 bg-white font-semibold text-slate-900">
            <th className="py-3 px-4 text-left font-semibold w-[32%]">Tanggal</th>
            {KOLOM_REKAP.map((kolom) => (
              <th key={kolom.key} className="py-3 font-semibold w-[9%]">
                {kolom.kode}
              </th>
            ))}
            <th className="py-3 font-semibold w-[23%]">Detail</th>
          </tr>
        </thead>
        <tbody>
          {harian.map((row) => (
            <tr key={row.tanggal} className="border-b border-slate-100 bg-white">
              <td className="py-3 px-4 text-left font-medium text-slate-700">
                {row.tanggal}
              </td>
              {KOLOM_REKAP.map((kolom) => (
                <td key={kolom.key} className="py-3 text-slate-600">
                  {row.rekap[kolom.key]}
                </td>
              ))}
              <td className="py-3">
                <button
                  type="button"
                  aria-label={`Detail absensi ${row.tanggal}`}
                  className="text-blue-500 hover:text-blue-600 inline-flex items-center justify-center"
                  onClick={onDetail}
                >
                  <VisibilityIcon style={{ fontSize: 20 }} />
                </button>
              </td>
            </tr>
          ))}

          {Array.from({ length: BARIS_PENGISI }).map((_, idx) => (
            <tr
              key={`pengisi-${idx}`}
              className="border-b border-slate-100 bg-white h-[45px]"
            >
              <td className="py-3 px-4" />
              <td className="py-3" />
              <td className="py-3" />
              <td className="py-3" />
              <td className="py-3" />
              <td className="py-3" />
              <td className="py-3" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
