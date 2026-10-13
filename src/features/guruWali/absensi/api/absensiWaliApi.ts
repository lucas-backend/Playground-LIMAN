import type {
  AbsensiHariDetail,
  AbsensiPertemuan,
  AbsensiSiswaDetail,
  RekapKehadiran,
  SiswaWali,
  WaliKelasDetail,
} from "../model/absensiWali";

/**
 * Akses data modul Absensi Guru Wali — FR-ABS-003.
 *
 * Kontrak resmi: API-ABS-002 `GET /api/v1/attendance/records` (rekap harian
 * per siswa/kelas; query `classId`/`subjectUserId`/`dateFrom`/`dateTo`) dan
 * API-ABS-003 `GET /api/v1/attendance/records/{recordId}` (detail) —
 * docs/06-api-documentation.md §3. Kontrak masih `Proposed` dan backend belum
 * tersedia (KD-07 `Blocked`), sehingga fungsi di sini adalah adapter mock
 * sementara yang memindahkan data dari komponen presentasional lama.
 *
 * TODO(absensi wali F5): saat kontrak `Approved`, ganti isi fungsi dengan
 * `api.get<{ items: ... }>("/attendance/records", { query })` lewat
 * `@/shared/api/client` (rekap kelas/siswa) dan
 * `api.get<...>("/attendance/records/{recordId}")` (detail harian). Hapus
 * seluruh data mock di bawah saat itu.
 *
 * Keterbatasan mock (jujur): bentuk data mengikuti tampilan lama, bukan
 * proyeksi `attendance_records` final. Detail per pertemuan/mata pelajaran
 * tidak punya entitas backend pada SDD §15 (jadwal ada di `schedules`);
 * bentuk ini dipertahankan agar desain tidak berubah dan menunggu keputusan
 * kontrak. Rekap disajikan per hari, bukan per mata pelajaran.
 */

const MOCK_DELAY_MS = 250;

const MOCK_KELAS_NAMA = "Kelas 12 IPA 1";
const MOCK_RINGKASAN_KELAS = "12 IPA 1";
const MOCK_TOTAL_KEHADIRAN = "98%";

const REKAP_PENUH: RekapKehadiran = {
  hadir: 8,
  izin: 0,
  sakit: 0,
  alpa: 0,
  dispensasi: 0,
};

const MOCK_SISWA: SiswaWali[] = Array.from({ length: 11 }, (_, index) => ({
  id: String(index + 1),
  nama: index === 0 ? "Yaza Nurzahira" : "Nama Siswa",
  rekap: { ...REKAP_PENUH },
  persentaseNilai: "100%",
}));

const MOCK_HARIAN = [
  "21/10/2026",
  "22/10/2026",
  "23/10/2026",
  "24/10/2026",
].map((tanggal) => ({ tanggal, rekap: { ...REKAP_PENUH } }));

const MOCK_PERTEMUAN: AbsensiPertemuan[] = [
  { id: "1", waktu: "07.00-08.30", mapel: "Matematika", keterangan: "hadir" },
  {
    id: "2",
    waktu: "08.30-10.00",
    mapel: "Bahasa Indonesia",
    keterangan: "hadir",
  },
  { id: "3", waktu: "10.30-11.30", mapel: "Sejarah", keterangan: "dispensasi" },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function findSiswa(siswaId: string): SiswaWali | undefined {
  return MOCK_SISWA.find((siswa) => siswa.id === siswaId);
}

/** Ringkasan identitas siswa untuk kartu informasi halaman detail. */
function ringkasanSiswa(siswa: SiswaWali) {
  return {
    nama: siswa.nama,
    kelas: MOCK_RINGKASAN_KELAS,
    totalKehadiran: MOCK_TOTAL_KEHADIRAN,
  };
}

/** Data menu kelas perwalian (halaman `/guruWali/absensi/:kelas_id`). */
export async function getWaliKelasDetail(
  kelasId: string,
): Promise<WaliKelasDetail> {
  await delay(MOCK_DELAY_MS);
  return {
    kelas: { id: kelasId, nama: MOCK_KELAS_NAMA },
    siswa: MOCK_SISWA,
  };
}

/**
 * Riwayat absensi harian satu siswa
 * (`/guruWali/absensi/siswa/:siswa_id`). Mengembalikan `null` bila siswa tidak
 * ada dalam cakupan.
 */
export async function getAbsensiSiswaDetail(
  siswaId: string,
): Promise<AbsensiSiswaDetail | null> {
  await delay(MOCK_DELAY_MS);
  const siswa = findSiswa(siswaId);
  if (!siswa) return null;
  return { ringkasan: ringkasanSiswa(siswa), harian: MOCK_HARIAN };
}

/**
 * Detail absensi satu hari per mata pelajaran
 * (`/guruWali/absensi/siswa/:siswa_id/detail/`). Mengembalikan `null` bila
 * siswa tidak ada dalam cakupan.
 */
export async function getAbsensiHariDetail(
  siswaId: string,
): Promise<AbsensiHariDetail | null> {
  await delay(MOCK_DELAY_MS);
  const siswa = findSiswa(siswaId);
  if (!siswa) return null;
  return { ringkasan: ringkasanSiswa(siswa), pertemuan: MOCK_PERTEMUAN };
}
