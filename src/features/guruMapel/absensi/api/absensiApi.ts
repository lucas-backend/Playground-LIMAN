import { env } from '@/config/env';
import { request } from '@/shared/api/client';

import type {
  AttendanceStatus,
  Kelas,
  Pertemuan,
  PertemuanDetail,
  Siswa,
} from './model/absensi';

const API_BASE = '/api/v1/absensi'; // reference documented contract

/** Mock adapter for guruMapel absensi (FR-ABS-002/003/009). */
export async function getKelasList(): Promise<Kelas[]> {
  await new Promise((r) => setTimeout(r, 300));
  return [
    {
      id: 1,
      namaKelas: '10.1',
      jumlahSiswa: 30,
      tingkat: { id: 1, nama: 'Kelas 10' },
    },
    {
      id: 2,
      namaKelas: '11.1',
      jumlahSiswa: 28,
      tingkat: { id: 2, nama: 'Kelas 11' },
    },
  ];
}

export async function getPertemuanList(kelasId: number): Promise<Pertemuan[]> {
  await new Promise((r) => setTimeout(r, 300));
  return [
    { no: 1, tanggal: '10/10/2026', waktu: '09:00-11:00', jenisPertemuan: 'Biasa' },
    { no: 2, tanggal: '10/10/2026', waktu: '11:00-13:00', jenisPertemuan: 'UAS' },
  ];
}

export async function getPertemuanDetail(kelasId: number, pertemuanId: number): Promise<PertemuanDetail | null> {
  await new Promise((r) => setTimeout(r, 300));
  return {
    id: pertemuanId,
    tanggal: '10/10/2026',
    waktu: '09:00-11:00',
    siswa: [
      { id: 1, nama: 'Yaza Nurzahira', status: 'hadir' as AttendanceStatus },
      { id: 2, nama: 'I Made Dipa R', status: 'izin' as AttendanceStatus },
      { id: 3, nama: 'Nama Siswa', status: 'sakit' as AttendanceStatus },
      { id: 4, nama: 'Nama Siswa', status: 'alpa' as AttendanceStatus },
    ],
    mataPelajaran: [
      { nama: 'Matematika', nilai: 90 },
      { nama: 'Sejarah', nilai: 90 },
      { nama: 'Bahasa Indonesia', nilai: 90 },
      { nama: 'Agama', nilai: 90 },
      { nama: 'Biologi', nilai: 90 },
    ],
  };
}

export async function updateSiswaStatus(kelasId: number, pertemuanId: number, siswaId: number, status: AttendanceStatus) {
  // TODO: call API-ABS-002 or PUT /guruMapel/absensi/{kelasId}/pertemuan/{pertemuanId}/siswa/{siswaId}/status
  await new Promise((r) => setTimeout(r, 300));
  return { success: true };
}

export async function getDetailSiswa(siswaId: string) {
  await new Promise((r) => setTimeout(r, 300));
  return {
    nama: 'Yaza Nuzahira',
    kelas: '10.1',
    nilai: [
      { mapel: 'Matematika', tugas: 90, uh: 90, pts: 90, pas: 90 },
      { mapel: 'Sejarah', tugas: 90, uh: 90, pts: 90, pas: 90 },
      { mapel: 'Bahasa Indonesia', tugas: 90, uh: 90, pts: 90, pas: 90 },
      { mapel: 'Agama', tugas: 90, uh: 90, pts: 90, pas: 90 },
      { mapel: 'Biologi', tugas: 90, uh: 90, pts: 90, pas: 90 },
    ],
  };
}
