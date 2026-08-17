import { Navigate, Route, Routes } from "react-router-dom";
import Header from "../../components/Header";
import JadwalTab from "./components/sectionPelajaran/PelajaranTab";
import TryoutTab from "./components/sectionTryout/TryoutTab";
import UjianTab from "./components/sectionUjian/UjianTab";
import { jadwalPelajaranTabs } from "../../data/jadwal/jadwalData";
import JadwalTabs from "./components/JadwalTabs";
import XPadding from "../../components/XPadding";

export default function Jadwal() {
  return (
    <div>
      <Header title="Jadwal" />

      <XPadding className="mt-4 mb-8">
        <JadwalTabs tabs={jadwalPelajaranTabs} />
        <Routes>
          <Route index element={<Navigate to="pelajaran" replace />} />
          <Route path="pelajaran" element={<JadwalTab />} />
          <Route path="tryout" element={<TryoutTab />} />
          <Route path="ujian" element={<UjianTab />} />
        </Routes>
      </XPadding>
    </div>
  );
}
