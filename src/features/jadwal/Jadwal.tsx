import { Navigate, Route, Routes } from "react-router-dom";
import Header from "../../components/Header";
import JadwalTab from "./components/sectionPelajaran/JadwalTab";

export default function Jadwal() {
  return (
    <div>
      <Header title="Jadwal" />
      <Routes>
        <Route index element={<Navigate to="pelajaran" replace />} />
        <Route path="pelajaran" element={<JadwalTab />} />
      </Routes>
    </div>
  );
}
