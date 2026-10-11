import { useState } from "react";
import XPadding from "@/shared/components/layout/XPadding";

type Props = {
  initialTanggal?: string;
  initialIsi?: string;
  onSubmit: (data: { tanggal: string; isi: string }) => void;
};

export default function CatatanForm({ initialTanggal, initialIsi = "", onSubmit }: Props) {
  const [tanggal, setTanggal] = useState(
    initialTanggal ?? new Date().toISOString().slice(0, 10)
  );
  const [isi, setIsi] = useState(initialIsi);

  return (
    <XPadding className="mt-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isi.trim()) return;
          onSubmit({ tanggal, isi: isi.trim() });
        }}
      >
        <label className="text-xs">Tanggal</label>
        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          className="mt-2 w-full rounded-md border border-gray-300 bg-blue-50 px-3 py-2 text-xs"
          required
        />

        <label className="mt-5 block text-xs">Isi catatan</label>
        <textarea
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          placeholder="Ketik catatan disini"
          rows={5}
          className="mt-2 w-full rounded-md border border-gray-300 bg-blue-50 px-3 py-2 text-xs"
          required
        />

        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-6 py-1.5 text-xs font-medium text-white"
          >
            Simpan
          </button>
        </div>
      </form>
    </XPadding>
  );
}