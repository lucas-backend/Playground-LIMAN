export type AttendanceStatus = 'hadir' | 'terlambat' | 'izin' | 'sakit' | 'alpa';

export const ATTENDANCE_STATUSES: readonly AttendanceStatus[] = [
  'hadir',
  'terlambat',
  'izin',
  'sakit',
  'alpa',
];

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  hadir: 'Hadir',
  terlambat: 'Terlambat',
  izin: 'Izin',
  sakit: 'Sakit',
  alpa: 'Alpa',
};

export type Tingkat = {
  id: number;
  nama: string;
};

export type Kelas = {
  id: number;
  namaKelas: string;
  jumlahSiswa: number;
  tingkat: Tingkat;
};

export type Pertemuan = {
  no: number;
  tanggal: string;
  waktu: string;
  jenisPertemuan: string;
};

export type Siswa = {
  id: number;
  nama: string;
  status: AttendanceStatus;
};

export type NilaiMapel = {
  mapel: string;
  tugas: number;
  uh: number;
  pts: number;
  pas: number;
};

export type DetailSiswa = {
  nama: string;
  kelas: string;
  nilai: NilaiMapel[];
};

export type PertemuanDetail = {
  id: number;
  tanggal: string;
  waktu: string;
  siswa: Siswa[];
  mataPelajaran: Array<{nama: string; nilai: number}>;
};
