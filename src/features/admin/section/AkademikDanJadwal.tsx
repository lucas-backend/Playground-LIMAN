import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

type Kelas = { nama: string; siswa: number };
type Mapel = { nama: string; guru: number };

const kelas: Kelas[] = [
  { nama: "10 IPA 1", siswa: 34 },
  { nama: "10 IPA 2", siswa: 34 },
  { nama: "10 IPA 3", siswa: 34 },
  { nama: "10 IPA 4", siswa: 34 },
];

const mapel: Mapel[] = [
  { nama: "MTK", guru: 4 },
  { nama: "KIMIA", guru: 3 },
  { nama: "FISIKA", guru: 2 },
  { nama: "SEJARAH", guru: 3 },
];

const hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

const jadwal = [
  { jam: "07.00-10.00", pelajaran: Array(5).fill("MTK") },
  { jam: "10.00-12.00", pelajaran: Array(5).fill("BINDO") },
];

type CardListProps = {
  judul: string;
  aksi: string;
  children: React.ReactNode;
};

function CardList({ judul, aksi, children }: CardListProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <header className="flex items-center justify-between px-5 py-4 text-sm">
        <h2 className="font-semibold">{judul}</h2>
        <button className="text-xs font-semibold text-blue-500 hover:underline">
          + {aksi}
        </button>
      </header>
      <ul className="divide-y divide-gray-200 border-t border-gray-200 text-xs">
        {children}
      </ul>
    </section>
  );
}

export default function AkademikDanJadwal() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold">Akademik & Jadwal</h1>

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <label className="flex h-11 w-full items-center gap-2 rounded-full border border-gray-200 bg-white px-4 shadow-sm sm:w-72">
          <SearchIcon fontSize="small" className="text-gray-400" />
          <input
            type="search"
            placeholder="Cari"
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>

        <button className="flex h-11 items-center gap-2 rounded-lg bg-blue-500 px-4 font-semibold text-white hover:bg-blue-600">
          TA 2025/2026 <KeyboardArrowDownIcon />
        </button>

        <button className="ml-auto h-11 rounded-lg bg-blue-500 px-6 font-semibold text-white hover:bg-blue-600">
          + Buat Jadwal
        </button>
      </div>

      {/* Kelas & Mapel */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <CardList judul="Kelas" aksi="Tambah Kelas">
          {kelas.map((k) => (
            <li key={k.nama} className="px-5 py-3">
              <b>{k.nama}</b> - {k.siswa} Siswa
            </li>
          ))}
        </CardList>

        <CardList judul="Mapel" aksi="Tambah Mapel">
          {mapel.map((m) => (
            <li key={m.nama} className="px-5 py-3">
              <b>{m.nama}</b> - {m.guru} Guru Pengampu
            </li>
          ))}
        </CardList>
      </div>

      {/* Jadwal Mingguan */}
      <section className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <header className="flex items-center justify-between px-5 py-4 text-sm">
          <h2 className="font-semibold">Jadwal Pelajaran Mingguan</h2>
          <select className="rounded bg-blue-500 px-2 py-1 text-[10px] font-semibold text-white">
            {kelas.map((k) => (
              <option key={k.nama}>{k.nama}</option>
            ))}
          </select>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-center text-xs">
            <thead>
              <tr>
                <th className="border border-gray-300 px-3 py-3 font-semibold">
                  Jam
                </th>
                {hari.map((h) => (
                  <th
                    key={h}
                    className="border border-gray-300 px-3 py-3 font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jadwal.map((baris) => (
                <tr key={baris.jam}>
                  <td className="w-24 border border-gray-300 px-3 py-3">
                    {baris.jam}
                  </td>
                  {baris.pelajaran.map((p, i) => (
                    <td key={i} className="border border-gray-300 px-3 py-3">
                      {p}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}