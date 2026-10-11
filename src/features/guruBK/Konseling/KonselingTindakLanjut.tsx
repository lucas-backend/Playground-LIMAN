import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import XPadding from "@/shared/components/layout/XPadding";

export default function KonselingTindakLanjut() {
  const { siswa_id, id_catatan_konseling } = useParams();
  const navigate = useNavigate();
  const [isi, setIsi] = useState("");

  return (
    <XPadding className="mt-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isi.trim()) return;
          // TODO: panggil API simpan tindak lanjut
          console.log("tindak lanjut", id_catatan_konseling, isi.trim());
          navigate(`/guruBK/konseling/siswa/${siswa_id}`);
        }}
      >
        <label className="text-xs">Isi tindak lanjut</label>
        <textarea
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          placeholder="Ketik tindak lanjut disini"
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