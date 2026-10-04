/* ---------- tipe ---------- */
export interface Mapel {
  id: string;
  nama: string;
  ikon: string;
  warna: string; // kelas tailwind untuk latar ikon
}

export interface Tugas {
  id: string;
  mapelId: string;
  judul: string;
  deskripsi: string;
  tenggat: string; // format YYYY-MM-DD
  jam: string; // format HH:mm
}

export interface Siswa {
  id: string;
  nama: string;
}

export interface NilaiSiswa extends Siswa {
  nilai: number | null;
}

/* ---------- data contoh (ganti dengan data dari API) ---------- */
const mapelList: Mapel[] = [
  { id: "mtk", nama: "Matematika", ikon: "√x", warna: "bg-green-200 text-green-700" },
  { id: "big", nama: "Bahasa Inggris", ikon: "📘", warna: "bg-indigo-100" },
  { id: "eko", nama: "Ekonomi", ikon: "💵", warna: "bg-orange-100" },
  { id: "bio", nama: "Biologi", ikon: "⚙️", warna: "bg-blue-100" },
];

const siswaList: Siswa[] = [
  { id: "1", nama: "Yaza Nurzahira" },
  ...[2, 3, 4, 5, 6, 7].map((n) => ({ id: String(n), nama: "Nama Siswa" })),
];

const tugasList: Tugas[] = [
  { id: "1", mapelId: "mtk", judul: "Tugas 1", deskripsi: "Buatlah .....", tenggat: "2026-01-10", jam: "23:59" },
  { id: "2", mapelId: "mtk", judul: "Tugas 2", deskripsi: "Buatlah .....", tenggat: "2026-01-13", jam: "23:59" },
];

// nilai[tugasId][siswaId]
const nilai: Record<string, Record<string, number | null>> = {
  "1": { "1": null, "2": 92, "3": 92, "4": 92, "5": 92, "6": 92, "7": 92 },
  "2": {},
};

/* ---------- fungsi akses (ganti isinya dengan fetch API) ---------- */
export const getMapelList = () => mapelList;

export const getMapel = (id?: string) => mapelList.find((m) => m.id === id);

export const getTugasByMapel = (mapelId?: string) =>
  tugasList.filter((t) => t.mapelId === mapelId);

export const getTugas = (id?: string) => tugasList.find((t) => t.id === id);

export const tambahTugas = (data: Omit<Tugas, "id">): Tugas => {
  const baru: Tugas = { ...data, id: String(tugasList.length + 1) };
  tugasList.push(baru);
  nilai[baru.id] = {};
  return baru;
};

export const getNilaiTugas = (tugasId?: string): NilaiSiswa[] =>
  siswaList.map((s) => ({
    ...s,
    nilai: tugasId ? (nilai[tugasId]?.[s.id] ?? null) : null,
  }));

export const setNilai = (tugasId: string, siswaId: string, n: number | null) => {
  nilai[tugasId] = { ...nilai[tugasId], [siswaId]: n };
};

/* ---------- util ---------- */
// "2026-01-10" -> "10 Januari 2026"
export const formatTanggal = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });