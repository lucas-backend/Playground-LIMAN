// Data dummy + tipe. Ganti dengan fetch ke API Anda.
export const KKM = 75;

export type Kelas = { id: string; nama: string; keterangan?: string };

export type Siswa = { id: string; nama: string; nilaiAkhir: number };

export type Rincian = {
  tugas: { nama: string; nilai: number }[];
  ulanganHarian: { nama: string; nilai: number }[];
  pts: number;
  pas: number;
  nilaiAkhir: number;
};

export const lulus = (nilai: number) => nilai >= KKM;

export const dummyKelas: Kelas[] = [
  { id: "1", nama: "12 IPA 1", keterangan: "-" },
  { id: "2", nama: "12 IPA 2", keterangan: "-" },
  { id: "5", nama: "12 IPA 5", keterangan: "-" },
];

export const dummySiswa: Siswa[] = [
  { id: "1", nama: "Yaza Nurzahira", nilaiAkhir: 80 },
  { id: "2", nama: "Nama Siswa", nilaiAkhir: 60 },
  { id: "3", nama: "Nama Siswa", nilaiAkhir: 100 },
  { id: "4", nama: "Nama Siswa", nilaiAkhir: 100 },
];

export const dummyRincian: Rincian = {
  tugas: [
    { nama: "Tugas 1", nilai: 80 },
    { nama: "Tugas 2", nilai: 80 },
  ],
  ulanganHarian: [
    { nama: "Ulangan Harian 1", nilai: 80 },
    { nama: "Ulangan Harian 2", nilai: 80 },
  ],
  pts: 80,
  pas: 80,
  nilaiAkhir: 80,
};