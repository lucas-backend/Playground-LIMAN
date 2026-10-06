import { useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

type StatusPresensi = "Hadir" | "Terlambat" | "Izin" | "Sakit" | "Alpa";

type CatatanPresensi = {
  id: number;
  waktu: string;
  nama: string;
  kelas: string;
  status: StatusPresensi;
};

// TODO: ganti dengan data dari API
const dataPresensi: CatatanPresensi[] = [
  { id: 1, waktu: "06.09", nama: "Budi", kelas: "10 IPA 1", status: "Hadir" },
  { id: 2, waktu: "06.23", nama: "Yaza", kelas: "10 IPA 1", status: "Hadir" },
  { id: 3, waktu: "06.10", nama: "Dipa", kelas: "10 IPA 1", status: "Hadir" },
  { id: 4, waktu: "06.33", nama: "Fatih", kelas: "10 IPA 1", status: "Hadir" },
];

const badgeStatus: Record<StatusPresensi, string> = {
  Hadir: "bg-green-300 text-green-900",
  Terlambat: "bg-yellow-200 text-yellow-900",
  Izin: "bg-blue-200 text-blue-900",
  Sakit: "bg-purple-200 text-purple-900",
  Alpa: "bg-red-300 text-red-900",
};

export default function Presensi() {
  const [cari, setCari] = useState("");

  const tampil = useMemo(
    () =>
      dataPresensi.filter((p) =>
        p.nama.toLowerCase().includes(cari.toLowerCase())
      ),
    [cari]
  );

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold">Presensi</h1>

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

      <div className="mt-8 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-140 text-center text-sm">
          <thead>
            <tr className="border-b border-gray-400">
              <th className="px-6 py-5 text-left font-semibold">Waktu</th>
              <th className="px-4 py-5 font-semibold">Nama</th>
              <th className="px-4 py-5 font-semibold">Kelas</th>
              <th className="px-4 py-5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {tampil.map((p) => (
              <tr key={p.id} className="border-b border-gray-300 last:border-0">
                <td className="px-6 py-4 text-left">{p.waktu}</td>
                <td className="px-4 py-4">{p.nama}</td>
                <td className="px-4 py-4">{p.kelas}</td>
                <td className="px-4 py-4">
                  <span className={`inline-block rounded-full px-3 py-0.5 text-[11px] ${badgeStatus[p.status]}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
            {tampil.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-gray-500">
                  Tidak ada data presensi yang cocok dengan kata kunci.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}