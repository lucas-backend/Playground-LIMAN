/**
 * Model domain modul Passing Grade.
 *
 * Sumber: FR-PG-001 (SRS §3.10). Bentuk objek mengikuti kontrak API-PG-001/002
 * (docs/06-api-documentation.md §20) dan skema `PassingGrade`
 * (docs/openapi.yaml): `id`, `university`, `major`, `score`, `year`.
 *
 * Field di luar kontrak yang muncul pada implementasi lama (mis. "Daya
 * Tampung"/kapasitas dan "Keketatan") sengaja tidak dimodelkan: tidak ada di
 * requirement maupun kontrak. Menampilkannya sebagai angka akan menyesatkan
 * pengguna seolah data backend nyata.
 */

export interface PassingGrade {
  id: string;
  university: string;
  major: string;
  score: number;
  year: number;
}

/** Daftar universitas unik dengan urutan kemunculan pertama. */
export function deriveUniversities(
  grades: readonly PassingGrade[],
): string[] {
  const seen = new Set<string>();
  const universities: string[] = [];

  for (const grade of grades) {
    if (seen.has(grade.university)) continue;
    seen.add(grade.university);
    universities.push(grade.university);
  }

  return universities;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

/** Saring daftar universitas berdasarkan kata kunci (case-insensitive). */
export function filterUniversities(
  universities: readonly string[],
  query: string,
): string[] {
  const needle = normalize(query);
  if (needle === "") return [...universities];
  return universities.filter((university) =>
    normalize(university).includes(needle),
  );
}

/** Saring daftar jurusan berdasarkan kata kunci (case-insensitive). */
export function filterGradesByMajor(
  grades: readonly PassingGrade[],
  query: string,
): PassingGrade[] {
  const needle = normalize(query);
  if (needle === "") return [...grades];
  return grades.filter((grade) => normalize(grade.major).includes(needle));
}

/**
 * Baca nilai segmen route `/passing_grade/:passing_grade_id`.
 *
 * Nama param legacy dipertahankan (URL tidak diubah). Pada mock, nilainya
 * dipakai sebagai kunci `university`; pemetaan ke `passingGradeId` resmi
 * menunggu keputusan produk.
 */
export function decodeUniversityParam(value: string | undefined): string {
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
