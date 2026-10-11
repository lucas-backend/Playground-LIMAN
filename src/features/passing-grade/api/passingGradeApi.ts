import type { PassingGrade } from "../model/passingGrade";

/**
 * Akses data modul Passing Grade.
 *
 * Kontrak resmi: API-PG-001 `GET /api/v1/passing-grades` (daftar; query
 * `university`/`major`/`year`/`page`/`pageSize`) dan API-PG-002
 * `GET /api/v1/passing-grades/{passingGradeId}` (detail) —
 * docs/06-api-documentation.md §20. Kontrak masih `Proposed` dan backend belum
 * tersedia (KD-07 `Blocked`), sehingga fungsi ini memakai adapter mock
 * sementara.
 *
 * TODO(passing-grade F5): saat kontrak `Approved`, ganti isi
 * `listPassingGrades` dengan
 * `api.get<{ items: PassingGrade[] }>("/passing-grades", { query })` lewat
 * `@/shared/api/client` dan kembalikan `items` (kontrak mengembalikan
 * envelope `{ items, page, pageSize, total }`). Layar detail saat ini
 * menampilkan daftar jurusan per universitas melalui filter `university`
 * (API-PG-001), bukan API-PG-002; penyimpangan ini dicatat dan menunggu
 * keputusan produk. Hapus data mock di bawah saat itu.
 */

const MOCK_DELAY_MS = 300;

// Data mock (bukan data backend). Penamaan generik dan nilai seragam sengaja
// dipakai agar jelas placeholder, tidak menyerupai data referensi nyata.
const MOCK_UNIVERSITIES = [
  "Universitas A",
  "Universitas B",
  "Universitas C",
  "Universitas D",
  "Universitas E",
  "Universitas F",
  "Universitas G",
  "Universitas H",
  "Universitas I",
  "Universitas J",
];

const MOCK_MAJORS = ["Jurusan A", "Jurusan B", "Jurusan C"];

const MOCK_PASSING_GRADES: PassingGrade[] = MOCK_UNIVERSITIES.flatMap(
  (university, universityIndex) =>
    MOCK_MAJORS.map((major, majorIndex) => ({
      id: `pg-${universityIndex + 1}-${majorIndex + 1}`,
      university,
      major,
      score: 78,
      year: 2025,
    })),
);

export interface PassingGradeQuery {
  university?: string;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function listPassingGrades(
  query: PassingGradeQuery = {},
): Promise<PassingGrade[]> {
  await delay(MOCK_DELAY_MS);

  if (!query.university) return [...MOCK_PASSING_GRADES];
  return MOCK_PASSING_GRADES.filter(
    (grade) => grade.university === query.university,
  );
}
