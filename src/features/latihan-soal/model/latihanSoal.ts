import type { ElementType } from "react";

/**
 * Model domain modul Latihan Soal (siswa) — FR-LATIHAN-001
 * (docs/03-srs.md §3.6): siswa dapat melihat daftar latihan soal per mata
 * pelajaran.
 *
 * Kontrak data mengikuti API-BNK-001/002
 * (docs/06-api-documentation.md §14): daftar bank soal per mapel beserta
 * jumlah soal. Kontrak masih `Proposed` dan backend belum tersedia (KD-07),
 * sehingga pengambilan data memakai adapter mock di `../api/latihanSoalApi.ts`.
 */

/** Satu mata pelajaran pada daftar latihan. */
export interface MapelLatihan {
  id: string;
  name: string;
  topicCount: number;
  questionCount: number;
  questionSolved: number;
  icon: ElementType;
  bgColor: string;
  bgColorFull: string;
  color: string;
}

/**
 * Satu butir latihan pada halaman mata pelajaran.
 *
 * Bentuk ini cocok dengan prop bersama `QuizItemCard`
 * (`@/shared/components/ui/QuizItemCard`), yang memetakan `status` ke label
 * tampilan (Belum / Sedang dinilai / Selesai). Semantik `status` tetap milik
 * komponen tersebut; di sini hanya diteruskan apa adanya.
 */
export interface LatihanItem {
  name: string;
  topic: string;
  status: number;
  startTime: string;
  endTime: string;
  duration: string;
  date: string;
  location: string;
  link: string;
}

/** Detail satu mata pelajaran: profil mapel + daftar latihannya. */
export interface MapelLatihanDetail {
  mapel: MapelLatihan;
  latihan: LatihanItem[];
}
