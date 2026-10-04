import { useState, type FormEvent } from "react";

interface Props {
  judul: string;
  nilaiAwal: number | null;
  onBatal: () => void;
  onSimpan: (nilai: number | null) => void;
}

export default function ModalNilai({ judul, nilaiAwal, onBatal, onSimpan }: Props) {
  const [teks, setTeks] = useState(nilaiAwal === null ? "" : String(nilaiAwal));

  const simpan = (e: FormEvent) => {
    e.preventDefault();
    if (teks.trim() === "") return onSimpan(null); // dikosongkan -> tampil "-"
    const n = Number(teks);
    if (Number.isNaN(n)) return;
    onSimpan(Math.min(100, Math.max(0, n)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onBatal}>
      <form onSubmit={simpan} onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-lg p-5">
        <h2 className="font-medium">{judul}</h2>

        <label className="flex items-center gap-3 mt-4 text-sm">
          Nilai:
          <input type="number" min={0} max={100} autoFocus value={teks}
            onChange={(e) => setTeks(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-1.5" />
        </label>

        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onBatal}
            className="border border-gray-400 rounded px-4 py-1.5 text-xs">Batal</button>
          <button type="submit"
            className="bg-blue-600 text-white rounded px-4 py-1.5 text-xs">Simpan</button>
        </div>
      </form>
    </div>
  );
}