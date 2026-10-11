import CalculateIcon from "@mui/icons-material/Calculate";
import TranslateIcon from "@mui/icons-material/Translate";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import CoronavirusIcon from "@mui/icons-material/Coronavirus";
import ScienceIcon from "@mui/icons-material/Science";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

import type {
  LatihanItem,
  MapelLatihan,
  MapelLatihanDetail,
} from "../model/latihanSoal";

/**
 * Akses data modul Latihan Soal (siswa) — FR-LATIHAN-001.
 *
 * Backend belum tersedia (KD-07 `Blocked`); fungsi di sini adalah adapter mock
 * sementara yang dipindahkan dari `data.tsx` lama, agar komponen
 * presentasional tidak lagi menyimpan data.
 *
 * TODO(latihan F5): saat kontrak `Approved`, ganti isi fungsi dengan
 * `api.get<...>("/question-banks", { query: { scope: "latihan", subjectId } })`
 * (API-BNK-001) dan `.../{bankId}/questions` (API-BNK-002) lewat
 * `@/shared/api/client`. Hapus data mock di bawah saat itu.
 *
 * Keterbatasan mock (jujur): daftar latihan (`latihanPerMapel`) sama untuk
 * setiap mata pelajaran karena data contoh belum dikaitkan per mapel.
 */

const MOCK_DELAY_MS = 300;

const mapelLatihan: MapelLatihan[] = [
  {
    name: "Matematika",
    topicCount: 12,
    questionCount: 360,
    icon: CalculateIcon,
    bgColor: "bg-green-500/25",
    bgColorFull: "bg-green-500",
    color: "text-green-500",
    questionSolved: 100,
    id: "1",
  },
  {
    name: "Bahasa Inggris",
    topicCount: 12,
    questionCount: 360,
    icon: TranslateIcon,
    bgColor: "bg-indigo-400/25",
    bgColorFull: "bg-indigo-400",
    color: "text-indigo-400",
    questionSolved: 100,
    id: "2",
  },
  {
    name: "Ekonomi",
    topicCount: 12,
    questionCount: 360,
    icon: LocalAtmIcon,
    bgColor: "bg-orange-400/25",
    bgColorFull: "bg-orange-400",
    color: "text-orange-400",
    questionSolved: 100,
    id: "3",
  },
  {
    name: "Biologi",
    topicCount: 12,
    questionCount: 360,
    icon: CoronavirusIcon,
    bgColor: "bg-blue-400/25",
    bgColorFull: "bg-blue-400",
    color: "text-blue-400",
    questionSolved: 200,
    id: "4",
  },
  {
    name: "Kimia",
    topicCount: 12,
    questionCount: 360,
    icon: ScienceIcon,
    bgColor: "bg-red-500/25",
    bgColorFull: "bg-red-500",
    color: "text-red-500",
    questionSolved: 150,
    id: "5",
  },
  {
    name: "Sejarah",
    topicCount: 12,
    questionCount: 360,
    icon: HistoryEduIcon,
    bgColor: "bg-amber-900/25",
    bgColorFull: "bg-amber-900",
    color: "text-amber-900",
    questionSolved: 250,
    id: "6",
  },
];

const latihanPerMapel: LatihanItem[] = [
  {
    name: "Latihan Soal",
    topic: "Bab 1 - Integral",
    status: 1,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
  {
    name: "Latihan Soal",
    topic: "Bab 2",
    status: 2,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
  {
    name: "Latihan Soal",
    topic: "Bab 3",
    status: 3,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Daftar mata pelajaran latihan (halaman `/latihan-soal`). */
export async function getMapelLatihanList(): Promise<MapelLatihan[]> {
  await delay(MOCK_DELAY_MS);
  return mapelLatihan;
}

/**
 * Detail satu mata pelajaran beserta daftar latihannya
 * (halaman `/latihan-soal/mapel/:mapel_id`). Mengembalikan `null` bila mapel
 * tidak ditemukan.
 */
export async function getMapelLatihanDetail(
  mapelId: string,
): Promise<MapelLatihanDetail | null> {
  await delay(MOCK_DELAY_MS);
  const mapel = mapelLatihan.find((item) => item.id === mapelId);
  if (!mapel) return null;
  return { mapel, latihan: latihanPerMapel };
}
