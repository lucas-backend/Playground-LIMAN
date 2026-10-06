export type CatatanBk = {
  id: number;
  tanggal: string; // format YYYY-MM-DD
  isi: string;
  tindakLanjutWaliKelas: string | null;
};

export type CatatanWaliKelas = {
  id: number;
  tanggal: string;
  isi: string;
  tindakLanjutBk: string | null;
};

export const siswaDummy = { id: 1, nama: "Dipa Rama", kelas: "Kelas 10 IPA 1" };

export const catatanBkDummy: CatatanBk[] = [
  { id: 1, tanggal: "2026-10-21", isi: "Siswa sering terlambat.", tindakLanjutWaliKelas: null },
  { id: 2, tanggal: "2026-10-23", isi: "Konseling lanjutan.", tindakLanjutWaliKelas: "Sudah dihubungi orang tua." },
];

export const catatanWaliDummy: CatatanWaliKelas[] = [
  { id: 1, tanggal: "2026-10-21", isi: "Siswa kurang fokus di kelas.", tindakLanjutBk: null },
  { id: 2, tanggal: "2026-10-23", isi: "Nilai menurun.", tindakLanjutBk: "Dijadwalkan konseling." },
];

// "2026-10-21" -> "Rabu, 21/10/2026"
export function formatTanggal(iso: string) {
  const d = new Date(iso + "T00:00:00");
  const hari = d.toLocaleDateString("id-ID", { weekday: "long" });
  const tgl = d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${hari}, ${tgl}`;
}