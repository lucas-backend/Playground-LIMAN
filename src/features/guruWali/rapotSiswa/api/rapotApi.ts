import type {
  RapotAbsensiData,
  RapotAbsensiMateriData,
  RapotMapelDetailData,
  RapotSiswaWaliData,
} from "../model/rapot";

/**
 * Akses data modul Rapot Guru Wali.
 *
 * Kontrak backend: API-RPT-003 `GET /students/{studentId}/report-card`
 * (docs/06-api-documentation.md §18), entitas `assessment_scores`, `subjects`
 * (docs/05-sdd.md §15.4). Kontrak masih `Proposed` dan backend belum tersedia
 * (KD-07 `Blocked`), sehingga modul ini memakai adapter mock sementara.
 *
 * TODO(rapot F5): saat kontrak `Approved`, ganti `getRapot*` dengan
 * `api.get<...>` di `@/shared/api/client`, lalu petakan DTO report-card
 * `{ studentUserId, period, subjects: [{ subjectId, subjectName, score, kkm }] }`
 * menjadi model tampilan `../model/rapot.ts`. Hapus nilai mock. Sub-route
 * `rapot/absensi/*` belum punya endpoint khusus pada kontrak (lihat
 * `../model/rapot.ts`).
 */

const MOCK_DELAY_MS = 300;

const rapotSiswaWali: RapotSiswaWaliData = {
  nama: "Yaza Nurzahira",
  mapel: [
    { id: "matematika", nama: "Matematika", nilai: 92 },
    { id: "bahasa-indonesia", nama: "Bahasa Indonesia", nilai: 92 },
    { id: "bahasa-inggris", nama: "Bahasa Inggris", nilai: 92 },
    { id: "fisika", nama: "Fisika", nilai: 92 },
    { id: "kimia", nama: "Kimia", nilai: 92 },
    { id: "biologi", nama: "Biologi", nilai: 92 },
  ],
};

const rapotMapelDetail: RapotMapelDetailData = {
  nama: "Yaza Nurzahira",
  mapel: "Matematika",
  kategori: [
    {
      kategori: "Tugas",
      items: [
        { nama: "Tugas 1", skor: 92 },
        { nama: "Tugas 2", skor: 92 },
      ],
    },
    {
      kategori: "Ulangan Harian",
      items: [
        { nama: "Ulangan Harian 1", skor: 92 },
        { nama: "Ulangan Harian 2", skor: 92 },
      ],
    },
    {
      kategori: "Penilaian tengah & akhir semester",
      items: [
        { nama: "PTS", skor: 92 },
        { nama: "PAS", skor: 92 },
      ],
    },
  ],
  nilaiAkhir: 92,
};

const rapotAbsensi: RapotAbsensiData = {
  nama: "Yaza Nurzahira",
  mapel: "Matematika",
  rows: [
    { materi: "BAB 1", jp: 3, h: 14, i: 1, s: 1, a: 0, d: 0 },
    { materi: "BAB 2", jp: 4, h: 14, i: 1, s: 1, a: 0, d: 0 },
    { materi: "BAB 3", jp: 5, h: 14, i: 1, s: 1, a: 0, d: 0 },
  ],
};

const rapotAbsensiMateri: RapotAbsensiMateriData = {
  nama: "Yaza Nurzahira",
  mapelBab: "Matematika - bab 1",
  rows: [
    { pertemuan: "Pertemuan 1", tanggal: "21/10/2026", status: "Hadir" },
    { pertemuan: "Pertemuan 2", tanggal: "22/10/2026", status: "Hadir" },
    { pertemuan: "Pertemuan 3", tanggal: "23/10/2026", status: "Hadir" },
  ],
};

function mockResolve<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), MOCK_DELAY_MS);
  });
}

export function getRapotSiswaWali(): Promise<RapotSiswaWaliData> {
  return mockResolve(rapotSiswaWali);
}

export function getRapotMapelDetail(): Promise<RapotMapelDetailData> {
  return mockResolve(rapotMapelDetail);
}

export function getRapotAbsensi(): Promise<RapotAbsensiData> {
  return mockResolve(rapotAbsensi);
}

export function getRapotAbsensiMateri(): Promise<RapotAbsensiMateriData> {
  return mockResolve(rapotAbsensiMateri);
}