import CalculateIcon from "@mui/icons-material/Calculate";
import CoronavirusIcon from "@mui/icons-material/Coronavirus";
import TranslateIcon from "@mui/icons-material/Translate";

import type { TryoutItem } from "@/shared/components/ui/QuizItemCard";
import type {
  JadwalDate,
  JadwalItem,
  JadwalPelajaranData,
  JadwalSection,
} from "../model/jadwal";

/**
 * Akses data modul Jadwal.
 *
 * Kontrak backend: API-JWL-001 `GET /schedules`
 * (docs/06-api-documentation.md §12), entitas `schedules`
 * (docs/05-sdd.md §15.3). Kontrak masih `Proposed` dan backend belum tersedia
 * (KD-07 `Blocked`), sehingga modul ini memakai adapter mock sementara.
 *
 * TODO(jadwal F5): saat kontrak `Approved`, ganti `getJadwal*` dengan
 * `api.get<...>` di `@/shared/api/client`, lalu petakan DTO `schedules`
 * `{ id, classId, subjectId, teacherUserId, dayOfWeek, startTime, endTime,
 * kind }` menjadi model tampilan `../model/jadwal.ts`. Hapus nilai mock.
 */

const MOCK_DELAY_MS = 300;

const jadwalDates: readonly JadwalDate[] = [
  { day: "Sen", date: 29 },
  { day: "Sel", date: 30, isActive: true },
  { day: "Rab", date: 31 },
  { day: "Kam", date: 1 },
];

const jadwalItems: readonly JadwalItem[] = [
  {
    icon: CalculateIcon,
    name: "Matematika",
    subject: "Bab 3 - Turunan & Integral",
    time: "07:00",
    duration: 90,
    colorClassName: "text-[#46a634]",
    backgroundClassName: "bg-[#46a634]/30",
  },
  {
    icon: TranslateIcon,
    name: "Bahasa Inggris",
    subject: "Bab 2 - Simple Past Tense",
    time: "09:00",
    duration: 45,
    colorClassName: "text-[#a2adff]",
    backgroundClassName: "bg-[#a2adff]/30",
  },
  {
    icon: CoronavirusIcon,
    name: "Biologi",
    subject: "Bab 3 - Anatomi Tumbuhan",
    time: "11:00",
    duration: 90,
    colorClassName: "text-[#2d9cdb]",
    backgroundClassName: "bg-[#2d9cdb]/30",
  },
];

const jadwalPelajaran: JadwalPelajaranData = {
  dates: jadwalDates,
  sections: [
    { title: "Hari ini", items: jadwalItems },
    { title: "Besok", items: jadwalItems },
  ],
};

const jadwalTryout: TryoutItem[] = [
  {
    name: "Try Out Nasional",
    topic: "UTBK SOSHUM",
    status: 1,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
  {
    name: "Try Out Nasional",
    topic: "UTBK SOSHUM",
    status: 2,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
  {
    name: "Try Out Nasional",
    topic: "UTBK SOSHUM",
    status: 3,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
];

const jadwalUjian: TryoutItem[] = [
  {
    name: "Ulangan Harian",
    topic: "Bahasa Inggris",
    status: 1,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
  {
    name: "Ulangan Harian",
    topic: "Matematika",
    status: 2,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
  {
    name: "Ulangan Harian",
    topic: "Biologi",
    status: 3,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
  {
    name: "PTS",
    topic: "Biologi",
    status: 1,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
  {
    name: "PTS",
    topic: "Matematika",
    status: 2,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
  {
    name: "PTS",
    topic: "Bahasa Inggris",
    status: 3,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
  {
    name: "PAS",
    topic: "Bahasa Inggris",
    status: 1,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
  {
    name: "PAS",
    topic: "Kimia",
    status: 2,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
  {
    name: "PAS",
    topic: "Matematika",
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

function copySections(sections: readonly JadwalSection[]): JadwalSection[] {
  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({ ...item })),
  }));
}

export async function getJadwalPelajaran(): Promise<JadwalPelajaranData> {
  await delay(MOCK_DELAY_MS);
  // Salinan dangkal agar pemanggil tidak memutasi state adapter.
  return {
    dates: jadwalPelajaran.dates.map((date) => ({ ...date })),
    sections: copySections(jadwalPelajaran.sections),
  };
}

export async function getJadwalTryout(): Promise<TryoutItem[]> {
  await delay(MOCK_DELAY_MS);
  return jadwalTryout.map((item) => ({ ...item }));
}

export async function getJadwalUjian(): Promise<TryoutItem[]> {
  await delay(MOCK_DELAY_MS);
  return jadwalUjian.map((item) => ({ ...item }));
}