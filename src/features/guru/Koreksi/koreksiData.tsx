// Data dummy + tipe. Ganti dengan fetch ke API Anda.
export const KKM = 75;

export type TabKey = "nilai" | "koreksi" | "remedial";

export type SiswaNilai = {
  id: string;
  nama: string;
  nilai: number | null; // null = belum dikoreksi
  sudahDikoreksi: boolean;
};

export type JawabanEssay = {
  id: string;
  teks?: string;
  fotoUrl?: string; // jika ada, ditampilkan sebagai "Foto jawaban"
};

export type Pertanyaan =
  | { id: string; no: number; tipe: "essay"; poin: number; preview: string; kunci: string; jawaban: JawabanEssay[] }
  | { id: string; no: number; tipe: "pilihan_ganda"; poin: number; preview: string; kunci: string };

export type JawabanPG = { siswaId: string; nama: string; jawaban: string };

export const dummyUlangan = { judul: "Ulangan Harian 1", kelas: "12 IPA 1" };

export type SoalRemedial = {
  id: string;
  mapel: string;
  judul: string;
  jumlahSoal: number;
  tanggal: string;
  waktu: string;
  lokasi: string;
};

export const dummySoalRemedial: SoalRemedial[] = [
  {
    id: "1",
    mapel: "Matematika",
    judul: "Remedial Ulangan Harian 1",
    jumlahSoal: 5,
    tanggal: "12 Januari 2026",
    waktu: "07.00-08.00 (60 menit)",
    lokasi: "Online",
  },
];

export const dummyDaftarSiswa: SiswaNilai[] = [
  { id: "1", nama: "Yaza Nurzahira", nilai: 60, sudahDikoreksi: true },
  { id: "2", nama: "Nama Siswa", nilai: null, sudahDikoreksi: false },
  { id: "3", nama: "Nama Siswa", nilai: null, sudahDikoreksi: false },
  { id: "4", nama: "Nama Siswa", nilai: null, sudahDikoreksi: false },
];

export const dummyPertanyaan: Pertanyaan[] = [
  {
    id: "1", no: 1, tipe: "essay", poin: 10,
    preview: "Preview soal .....",
    kunci: "Ir. Soekarno",
    jawaban: [
      { id: "a", teks: "Ir. Soekarno" },
      { id: "b", teks: "Soekarno" },
      { id: "c", teks: "Sukarno" },
      { id: "d", teks: "Ir Sukarno" },
      { id: "e", fotoUrl: "" },
    ],
  },
  { id: "2", no: 2, tipe: "pilihan_ganda", poin: 10, preview: "Preview soal .....", kunci: "D" },
  {
    id: "3", no: 3, tipe: "essay", poin: 10,
    preview: "Preview soal .....",
    kunci: "Ir. Soekarno",
    jawaban: [{ id: "a", teks: "Soekarno" }, { id: "b", fotoUrl: "" }],
  },
];

export const dummyJawabanPG: JawabanPG[] = [
  { siswaId: "1", nama: "Yaza Nurzahira", jawaban: "D" },
  { siswaId: "2", nama: "I Made Dipa", jawaban: "D" },
  { siswaId: "3", nama: "Nama Siswa", jawaban: "C" },
];