import { useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

type RekapKelas = {
  id: number;
  kelas: string;
  progres: number; // 0 - 100
  keterangan: string;
};

// TODO: ganti dengan data dari API
const dataRekap: RekapKelas[] = [
  { id: 1, kelas: "10 IPA 1", progres: 100, keterangan: "Rekap Wali Kelas Selesai" },
  { id: 2, kelas: "10 IPA 2", progres: 50, keterangan: "Menunggu 6 Nilai Mapel" },
];

export default function NilaiRapor() {
  const [cari, setCari] = useState("");

  const tampil = useMemo(
    () =>
      dataRekap.filter((k) =>
        k.kelas.toLowerCase().includes(cari.toLowerCase())
      ),
    [cari]
  );

  const tutupNilai = (k: RekapKelas) => {
    if (!window.confirm(`Tutup nilai ${k.kelas}? Nilai tidak dapat diubah setelah ditutup.`)) return;
    // TODO: panggil API untuk menutup nilai
    console.log("tutup nilai", k);
  };

  const ingatkanGuru = (k: RekapKelas) => {
    // TODO: panggil API untuk mengirim pengingat
    console.log("ingatkan guru", k);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold uppercase">BK & Nilai Rapor</h1>

      <label className="mt-4 flex h-12 w-full items-center gap-2 rounded-full border border-gray-200 bg-white px-4 shadow-sm sm:w-96">
        <SearchIcon fontSize="small" className="text-gray-400" />
        <input
          type="search"
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Cari"
          className="w-full bg-transparent text-sm outline-none"
        />
      </label>

      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-8">
          {tampil.map((k) => {
            const selesai = k.progres >= 100;
            return (
              <section key={k.id} className="rounded-lg border border-gray-400 px-5 py-4">
                <h2 className="text-lg font-bold">{k.kelas}</h2>
                <p className="text-xs">{k.keterangan}</p>

                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={k.progres}
                  aria-label={`Progres rekap ${k.kelas}`}
                  className="mt-2 h-1.5 w-full overflow-hidden bg-gray-400"
                >
                  <div
                    className={`h-full ${selesai ? "bg-green-600" : "bg-orange-400"}`}
                    style={{ width: `${k.progres}%` }}
                  />
                </div>

                <div className="mt-4 flex justify-center">
                  {selesai ? (
                    <button
                      onClick={() => tutupNilai(k)}
                      className="rounded-md bg-blue-500 px-6 py-1.5 font-semibold text-white hover:bg-blue-600"
                    >
                      Tutup Nilai
                    </button>
                  ) : (
                    <button
                      onClick={() => ingatkanGuru(k)}
                      className="rounded-md bg-blue-500 px-6 py-1.5 font-semibold text-white hover:bg-blue-600"
                    >
                      Ingatkan Guru
                    </button>
                  )}
                </div>
              </section>
            );
          })}

          {tampil.length === 0 && (
            <p className="py-6 text-center text-sm text-gray-500">
              Tidak ada kelas yang cocok dengan kata kunci.
            </p>
          )}
        </div>

        <p className="mt-6 text-xs">
          Penilaian tidak dapat diubah jika sudah ditutup, pastikan seluruh wali
          kelas menyelesaikan rekap.
        </p>
      </div>
    </div>
  );
}