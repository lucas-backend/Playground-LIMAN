import { useMemo, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import DeleteIcon from '@mui/icons-material/Delete';

type Peran = "Wali Kelas" | "Guru Mapel" | "Guru BK" | "Siswa";

const teksMenu = { primary: { sx: { fontSize: 13 } } };

type Pengguna = {
  id: number;
  nama: string;
  peran: Peran;
  kontak: string;
  sidikJari: boolean;
};

// TODO: ganti dengan data dari API
const dataPengguna: Pengguna[] = [
  { id: 1, nama: "Yaza", peran: "Siswa", kontak: "08xxx", sidikJari: true },
  { id: 2, nama: "Dipa", peran: "Wali Kelas", kontak: "08xxx", sidikJari: true },
  { id: 3, nama: "Budi", peran: "Wali Kelas", kontak: "08xxx", sidikJari: false },
  { id: 4, nama: "Dewi", peran: "Siswa", kontak: "08xxx", sidikJari: true },
];

// TODO: hitung dari API juga
const ringkasan: { peran: Peran; label: string; jumlah: number; card: string }[] = [
  { peran: "Wali Kelas", label: "Guru Wali Kelas", jumlah: 24, card: "bg-[#E6E6FF] text-purple-700" },
  { peran: "Guru Mapel", label: "Guru Mata Pelajaran", jumlah: 38, card: "bg-[#FFE8C4] text-amber-500" },
  { peran: "Guru BK", label: "Guru BK", jumlah: 4, card: "bg-[#A8D4FF] text-blue-900" },
  { peran: "Siswa", label: "Siswa", jumlah: 200, card: "bg-[#FFA8A8] text-red-600" },
];

const badgePeran: Record<Peran, string> = {
  "Wali Kelas": "bg-indigo-100 text-indigo-700",
  "Guru Mapel": "bg-orange-100 text-orange-700",
  "Guru BK": "bg-blue-100 text-blue-800",
  Siswa: "bg-red-300 text-red-900",
};

const filterPeran: ("Semua" | Peran)[] = ["Semua", "Wali Kelas", "Guru Mapel", "Guru BK", "Siswa"];

export default function ManajemenPengguna() {
  const [cari, setCari] = useState("");
  const [filter, setFilter] = useState<"Semua" | Peran>("Semua");
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [terpilih, setTerpilih] = useState<Pengguna | null>(null);

  const tampil = useMemo(
    () =>
      dataPengguna.filter(
        (u) =>
          (filter === "Semua" || u.peran === filter) &&
          u.nama.toLowerCase().includes(cari.toLowerCase())
      ),
    [cari, filter]
  );

  const bukaMenu = (e: React.MouseEvent<HTMLElement>, u: Pengguna) => {
    setAnchor(e.currentTarget);
    setTerpilih(u);
  };
  const tutupMenu = () => setAnchor(null);

  // Ganti isi handler ini dengan navigasi / modal / panggilan API
  const aksi = (nama: "edit" | "reset" | "sidikJari" | "hapus") => {
    console.log(nama, terpilih);
    tutupMenu();
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
      <p className="mt-1 text-sm text-gray-700">300 akun terdaftar</p>

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <label className="flex h-11 w-full items-center gap-2 rounded-full border border-gray-200 bg-white px-4 shadow-sm sm:w-72">
          <SearchIcon fontSize="small" className="text-gray-400" />
          <input
            type="search"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama"
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>
        <button className="h-11 rounded-lg bg-blue-500 px-6 font-semibold text-white hover:bg-blue-600">
          + Tambah Pengguna
        </button>
      </div>

      {/* Ringkasan */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {ringkasan.map((r) => (
          <div
            key={r.peran}
            className={`flex h-28 flex-col items-center justify-center rounded-2xl px-2 text-center ${r.card}`}
          >
            <span className="text-4xl font-bold leading-none">{r.jumlah}</span>
            <span className="mt-2 text-[11px] font-semibold leading-tight">{r.label}</span>
          </div>
        ))}
      </div>

      {/* Filter peran */}
      <h2 className="mt-6 font-semibold">Peran</h2>
      <div className="mt-2 flex flex-wrap gap-2">
        {filterPeran.map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`rounded-full border px-4 py-1 text-xs ${
              filter === p
                ? "border-blue-300 bg-blue-100"
                : "border-black bg-white hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Tabel */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[560px] text-center text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="px-6 py-4 text-left font-semibold">Pengguna</th>
              <th className="px-4 py-4 font-semibold">Peran</th>
              <th className="px-4 py-4 font-semibold">Kontak</th>
              <th className="px-4 py-4 font-semibold">Sidik Jari</th>
              <th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {tampil.map((u) => (
              <tr key={u.id} className="border-b border-gray-200 last:border-0">
                <td className="px-6 py-3 text-left">{u.nama}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-3 py-0.5 text-[11px] ${badgePeran[u.peran]}`}>
                    {u.peran}
                  </span>
                </td>
                <td className="px-4 py-3">{u.kontak}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-3 py-0.5 text-[11px] ${
                      u.sidikJari ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {u.sidikJari ? "Terdaftar" : "Belum"}
                  </span>
                </td>
                <td className="pr-3">
                  <button
                    aria-label={`Aksi untuk ${u.nama}`}
                    onClick={(e) => bukaMenu(e, u)}
                    className="rounded-full p-1 hover:bg-gray-100"
                  >
                    <MoreVertIcon fontSize="small" />
                  </button>
                </td>
              </tr>
            ))}
            {tampil.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-gray-500">
                  Tidak ada pengguna yang cocok. Coba ubah kata kunci atau filter peran.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Menu aksi */}
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={tutupMenu}>
        <MenuItem onClick={() => aksi("edit")}>
          <ListItemIcon><EditOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Edit Pengguna" slotProps={teksMenu} />
        </MenuItem>
        <MenuItem onClick={() => aksi("reset")}>
          <ListItemIcon><VpnKeyOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Reset Kata Sandi" slotProps={ teksMenu} />
        </MenuItem>
        <MenuItem onClick={() => aksi("sidikJari")}>
          <ListItemIcon><FingerprintIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Kelola Sidik Jari" slotProps={teksMenu} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => aksi("hapus")} sx={{ color: "error.main" }}>
          <ListItemIcon sx={{ color: "inherit" }}><DeleteIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Hapus Akun" slotProps={teksMenu} />
        </MenuItem>
      </Menu>
    </div>
  );
}