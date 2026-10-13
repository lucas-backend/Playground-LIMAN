import type { RingkasanSiswa } from "../model/absensiWali";

/** Kartu identitas siswa pada halaman detail absensi wali. */
export default function SiswaInfoCard({ ringkasan }: { ringkasan: RingkasanSiswa }) {
  return (
    <div className="bg-brand-500 text-white p-4 rounded-2xl shadow-sm flex flex-col gap-1 text-sm font-medium">
      <p>Nama Siswa: {ringkasan.nama}</p>
      <p>Kelas: {ringkasan.kelas}</p>
      <p>Total kehadiran: {ringkasan.totalKehadiran}</p>
    </div>
  );
}
