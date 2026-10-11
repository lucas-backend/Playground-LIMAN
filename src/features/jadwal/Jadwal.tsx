import { Navigate, Route, Routes } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CreateIcon from "@mui/icons-material/Create";
import MenuBookIcon from "@mui/icons-material/MenuBook";

import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";

import JadwalTabs from "./components/JadwalTabs";
import PelajaranTab from "./components/sectionPelajaran/PelajaranTab";
import TryoutTab from "./components/sectionTryout/TryoutTab";
import UjianTab from "./components/sectionUjian/UjianTab";
import type { JadwalTab } from "./model/jadwal";

const jadwalTabs: JadwalTab[] = [
  { icon: MenuBookIcon, name: "Pelajaran", link: "/jadwal-siswa/pelajaran" },
  { icon: AssignmentIcon, name: "Try Out", link: "/jadwal-siswa/tryout" },
  { icon: CreateIcon, name: "Ujian", link: "/jadwal-siswa/ujian" },
];

/**
 * Halaman Jadwal siswa (FR-JADWAL-001): menampilkan jadwal
 * pelajaran/ujian/tryout. Tiap tab memuat datanya lewat hook sendiri
 * (`hooks/useJadwal.ts`) dari adapter mock sampai backend siap.
 */
export default function Jadwal() {
  return (
    <div>
      <Header title="Jadwal" backLink="/dashboard" />

      <XPadding className="mt-4 mb-8">
        <JadwalTabs tabs={jadwalTabs} />
        <Routes>
          <Route index element={<Navigate to="pelajaran" replace />} />
          <Route path="pelajaran" element={<PelajaranTab />} />
          <Route path="tryout" element={<TryoutTab />} />
          <Route path="ujian*" element={<UjianTab />} />
        </Routes>

        {import.meta.env.DEV ? (
          <p className="mt-6 text-center text-xs text-gray-400">
            Mode pengembangan: data jadwal masih mock (backend belum tersedia).
          </p>
        ) : null}
      </XPadding>
    </div>
  );
}
