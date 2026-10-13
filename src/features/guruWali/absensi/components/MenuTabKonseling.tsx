import XPadding from "@/shared/components/layout/XPadding";

import type { SiswaWali } from "../model/absensiWali";

/** Tab Catatan Konseling pada menu wali kelas (navigasi ke modul #14). */
export default function MenuTabKonseling({
  siswa,
  onDetail,
}: {
  siswa: SiswaWali[];
  onDetail: (siswaId: string) => void;
}) {
  return (
    <div className="mt-6">
      <XPadding className="mb-4">
        <h3 className="text-base font-semibold text-brand-500">Daftar Siswa</h3>
      </XPadding>

      <div className="flex flex-col">
        {siswa.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center py-3 px-6 bg-transparent text-sm"
          >
            <span className="font-semibold text-slate-900 truncate pr-4">
              {item.nama}
            </span>
            <button
              type="button"
              onClick={() => onDetail(item.id)}
              className="bg-brand-500 hover:bg-blue-600 text-white text-xs font-medium px-4 py-1.5 rounded-lg shadow-sm transition active:scale-[0.98] whitespace-nowrap"
            >
              Lihat catatan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
