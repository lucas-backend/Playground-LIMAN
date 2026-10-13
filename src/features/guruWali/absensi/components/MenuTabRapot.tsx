import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import type { SiswaWali } from "../model/absensiWali";

/**
 * Tab Rapot pada menu wali kelas.
 *
 * CATATAN: hanya navigasi ke modul Rapot Guru Wali (#13) yang dipertahankan.
 * `persentaseNilai` berasal dari adapter mock (placeholder modul #13) agar
 * tidak ada data mock di dalam komponen; ganti saat #13 dimigrasikan.
 */
export default function MenuTabRapot({
  siswa,
  onDetail,
}: {
  siswa: SiswaWali[];
  onDetail: (siswaId: string) => void;
}) {
  return (
    <div className="mt-6 border-t border-slate-300">
      <div className="flex justify-between items-center bg-transparent py-3 px-6 text-sm font-bold text-slate-900 border-b border-slate-300">
        <span className="w-1/2 text-left">Nama Siswa</span>
        <span className="w-1/2 text-right pr-8">Persentase Nilai</span>
      </div>
      <div>
        {siswa.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center py-3.5 px-6 border-b border-slate-200 bg-transparent text-sm"
          >
            <span className="w-1/2 text-left font-medium text-slate-900 truncate">
              {item.nama}
            </span>
            <div className="w-1/2 flex items-center justify-end gap-4">
              <span className="inline-block bg-success-soft text-success text-xs font-semibold px-4 py-1.5 rounded-full border border-[#a5d6a7] min-w-[65px] text-center">
                {item.persentaseNilai}
              </span>
              <button
                type="button"
                aria-label={`Lihat rapot ${item.nama}`}
                onClick={() => onDetail(item.id)}
                className="text-slate-400 hover:text-slate-600 p-0.5 inline-flex items-center justify-center"
              >
                <PlayArrowIcon style={{ fontSize: 18 }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
