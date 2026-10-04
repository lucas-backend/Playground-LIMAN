/* ---------- tipe ---------- */
export type TipeSoal = "pg" | "pgk" | "bs" | "essay";

export interface Soal {
  id: string;
  tipe: TipeSoal;
  teks: string;
  opsi?: string[]; // pg & pgk
  kunci?: number[]; // index opsi yang benar
  pernyataan?: { teks: string; benar: boolean }[]; // bs
  kunciEssay?: string;
}

export interface BankSoal {
  id: string;
  nama: string;
  jumlahSoal: number;
  soal: Soal[];
}

export interface MataPelajaran {
  id: string;
  nama: string;
  ikon: string;
  warna: string; // kelas tailwind untuk latar ikon
  bank: BankSoal[];
}

export const LABEL_TIPE: Record<TipeSoal, string> = {
  pg: "Pilihan Ganda",
  pgk: "Pg Kompleks",
  bs: "Benar/Salah",
  essay: "Essay",
};

export const abjad = (i: number) => String.fromCharCode(65 + i);

/* ---------- data contoh (ganti dengan data dari API) ---------- */
const soalContoh: Soal[] = [
  { id: "1", tipe: "pg", teks: "2+2=", opsi: ["Pilihan 1", "Pilihan 2", "Pilihan 3", "Pilihan 4", "Pilihan 5"], kunci: [0] },
  { id: "2", tipe: "pgk", teks: "Pilih bilangan genap", opsi: ["2", "3", "4", "5"], kunci: [0, 2] },
  { id: "3", tipe: "essay", teks: "Jelaskan pengertian bilangan prima", kunciEssay: "Bilangan yang hanya habis dibagi 1 dan dirinya sendiri" },
  { id: "4", tipe: "bs", teks: "Tentukan benar atau salah", pernyataan: [{ teks: "2 adalah bilangan prima", benar: true }, { teks: "9 adalah bilangan prima", benar: false }] },
];

const buatBank = (id: string, jumlah: number): BankSoal[] =>
  Array.from({ length: jumlah }, (_, i) => ({
    id: String(i + 1),
    nama: `Bank Soal ${i + 1}`,
    jumlahSoal: 30,
    soal: soalContoh,
  }));

export const DATA: MataPelajaran[] = [
  { id: "mtk", nama: "Matematika", ikon: "√x", warna: "bg-green-200 text-green-700", bank: buatBank("mtk", 5) },
  { id: "big", nama: "Bahasa Inggris", ikon: "📘", warna: "bg-indigo-100", bank: buatBank("big", 3) },
  { id: "eko", nama: "Ekonomi", ikon: "💵", warna: "bg-orange-100", bank: buatBank("eko", 3) },
  { id: "bio", nama: "Biologi", ikon: "⚙️", warna: "bg-blue-100", bank: buatBank("bio", 3) },
  { id: "kim", nama: "Kimia", ikon: "⚛️", warna: "bg-red-100", bank: buatBank("kim", 3) },
  { id: "sej", nama: "Sejarah", ikon: "🕓", warna: "bg-amber-100", bank: buatBank("sej", 4) },
];

/* ---------- pencarian (ganti dengan fetch API bila sudah ada backend) ---------- */
export const cariMapel = (mapelId?: string) => DATA.find((m) => m.id === mapelId);

export const cariBank = (mapelId?: string, bankId?: string) =>
  cariMapel(mapelId)?.bank.find((b) => b.id === bankId);

export const cariSoal = (mapelId?: string, bankId?: string, soalId?: string) =>
  cariBank(mapelId, bankId)?.soal.find((s) => s.id === soalId);