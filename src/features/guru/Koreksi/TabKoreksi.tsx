import type { TabKey } from "./koreksiData";

const TABS: { key: TabKey; label: string }[] = [
  { key: "nilai", label: "Nilai Siswa" },
  { key: "koreksi", label: "Koreksi Nilai" },
  { key: "remedial", label: "Remedial" },
];

type Props = { aktif: TabKey; onChange: (tab: TabKey) => void };

export default function TabKoreksi({ aktif, onChange }: Props) {
  return (
    <div className="flex justify-between gap-2 pt-4" role="tablist">
      {TABS.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={aktif === t.key}
          onClick={() => onChange(t.key)}
          className={`flex-1 rounded-full border border-gray-300 px-2 py-1 text-xs ${
            aktif === t.key ? "bg-blue-100" : "bg-white"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}