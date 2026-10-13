import type { KonselingSubTab } from "../model/konseling";

interface Props {
  value: KonselingSubTab;
  onChange: (tab: KonselingSubTab) => void;
}

/**
 * Pemilih sub-catatan (Wali Kelas / BK) pada halaman konseling siswa.
 * Perilaku dan visualnya dipertahankan dari baseline desain (DEC-14).
 */
export default function KonselingTabSwitcher({ value, onChange }: Props) {
  const buttonClass = (tab: KonselingSubTab) =>
    `flex-1 py-1.5 px-4 text-xs font-semibold rounded-full border transition-all text-center ${
      value === tab
        ? "bg-blue-50 border-blue-500 text-slate-900 shadow-sm"
        : "bg-white border-black text-slate-900"
    }`;

  return (
    <div className="flex gap-4 mt-6">
      <button
        type="button"
        onClick={() => onChange("wali")}
        className={buttonClass("wali")}
      >
        Catatan Wali Kelas
      </button>
      <button
        type="button"
        onClick={() => onChange("bk")}
        className={buttonClass("bk")}
      >
        Catatan BK
      </button>
    </div>
  );
}
