import type { Mapel } from "../TugasData";

export default function IkonMapel({ mapel }: { mapel: Mapel }) {
  return (
    <div
      className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center font-semibold ${mapel.warna}`}
    >
      {mapel.ikon}
    </div>
  );
}
