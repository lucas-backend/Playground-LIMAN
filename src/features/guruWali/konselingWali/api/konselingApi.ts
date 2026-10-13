import type {
  CatatanBk,
  CatatanWaliKelas,
  KonselingSiswaData,
  SiswaKonseling,
} from "../model/konseling";

/**
 * Adapter data modul Konseling Guru Wali. Kontrak backend
 * (docs/06-api-documentation.md, status `Proposed`):
 *   - API-KSL-001 `GET /api/v1/counseling-notes` (query `studentUserId`,
 *     `classId`, `page`, `pageSize`, `sort`) - daftar catatan per siswa/kelas.
 *   - API-KSL-002 `POST /api/v1/counseling-notes` body `{ studentUserId, note }`
 *     - menulis `counseling_notes` + `audit_logs`.
 *   - API-KSL-003 `PUT /api/v1/counseling-notes/{noteId}` - koreksi catatan.
 * Entitas: `counseling_notes` (docs/05-sdd.md). Kontrak masih `Proposed` dan
 * backend belum tersedia (KD-07 `Blocked`), sehingga modul ini memakai store
 * mock in-memory (bertahan selama satu sesi SPA).
 *
 * Keterbatasan: kontrak `POST` hanya memuat `{ studentUserId, note }`, tanpa
 * field `tanggal`. UI tetap menampilkan input Tanggal (baseline desain), tetapi
 * nilainya belum dikirim/dipersistensi sampai kontrak diratifikasi.
 *
 * TODO(konseling F5): saat kontrak `Approved`, ganti fungsi `get*`/`add*` di
 * sini dengan `api.get`/`api.post` di `@/shared/api/client` dan hapus store mock.
 */

const MOCK_DELAY_MS = 300;

const siswaKonseling: SiswaKonseling = {
  id: "1",
  nama: "Yaza Nurzahira",
  kelas: "Kelas 12 IPA 1",
};

// Store mock in-memory: cukup untuk mendemokan alur simpan -> kembali -> tampil
// selama satu sesi SPA tanpa backend. Pemetaan per-siswa disederhanakan karena
// kontrak belum final.
let storeCatatanWali: CatatanWaliKelas[] = [];
let storeCatatanBk: CatatanBk[] = [
  {
    id: "bk-1",
    tanggal: "2026-10-21",
    isi: "Siswa sering terlambat dan kurang fokus mengikuti pelajaran.",
    tindakLanjutWaliKelas: null,
  },
];

let urutanCatatanWali = 1;

function salinWali(catatan: CatatanWaliKelas): CatatanWaliKelas {
  return { ...catatan };
}

function salinBk(catatan: CatatanBk): CatatanBk {
  return { ...catatan };
}

function mockResolve<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), MOCK_DELAY_MS);
  });
}

export function getKonselingSiswa(): Promise<KonselingSiswaData> {
  return mockResolve({
    siswa: { ...siswaKonseling },
    catatanWali: storeCatatanWali.map(salinWali),
    catatanBk: storeCatatanBk.map(salinBk),
  });
}

export function getCatatanBkById(idCatatanBk: string): Promise<CatatanBk | null> {
  const ditemukan = storeCatatanBk.find((catatan) => catatan.id === idCatatanBk);
  return mockResolve(ditemukan ? salinBk(ditemukan) : null);
}

export function addCatatanWali(data: {
  tanggal: string;
  isi: string;
}): Promise<CatatanWaliKelas> {
  const catatan: CatatanWaliKelas = {
    id: `wali-${urutanCatatanWali}`,
    tanggal: data.tanggal,
    isi: data.isi,
    tindakLanjutBk: null,
  };
  urutanCatatanWali += 1;
  storeCatatanWali = [...storeCatatanWali, catatan];
  return mockResolve(salinWali(catatan));
}

export function addTindakLanjutWali(
  idCatatanBk: string,
  data: { tindakLanjut: string },
): Promise<CatatanBk> {
  const indeks = storeCatatanBk.findIndex((catatan) => catatan.id === idCatatanBk);
  if (indeks === -1) {
    return Promise.reject(new Error("Catatan BK tidak ditemukan."));
  }
  const diperbarui: CatatanBk = {
    ...storeCatatanBk[indeks],
    tindakLanjutWaliKelas: data.tindakLanjut,
  };
  storeCatatanBk = storeCatatanBk.map((catatan) =>
    catatan.id === idCatatanBk ? diperbarui : catatan,
  );
  return mockResolve(salinBk(diperbarui));
}
