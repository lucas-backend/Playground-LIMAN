import { Route, Routes } from "react-router-dom";
import Header from "../../../components/Header";
import KonselingKelasList from "./KonselingKelasList";
import KonselingKelasDetail from "./KonselingKelasDetail";

export default function Konseling() {
  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      <Header title="Catatan Konseling" />
      <Routes>
        <Route path="/" element={<KonselingKelasList />} />
        <Route path="/kelas/:kelas_id" element={<KonselingKelasDetail />} />
      </Routes>
    </div>
  );
}