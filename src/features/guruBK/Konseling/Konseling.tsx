import { Route, Routes } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import KonselingKelasList from "./KonselingKelasList";
import KonselingKelasDetail from "./KonselingKelasDetail";
import KonselingSiswaDetail from "./KonselingSiswaDetail";
import KonselingTambahCatatan from "./KonselingTambahCatatan";
import KonselingEditCatatan from "./KonselingEditCatatan";
import KonselingTindakLanjut from "./KonselingTindakLanjut";

export default function Konseling() {
  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      <Header title="Catatan Konseling" />
      <Routes>
        <Route path="/" element={<KonselingKelasList />} />
        <Route path="/kelas/:kelas_id" element={<KonselingKelasDetail />} />
        <Route path="/siswa/:siswa_id" element={<KonselingSiswaDetail />} />
        <Route path="/siswa/:siswa_id/tambah" element={<KonselingTambahCatatan />} />
        <Route path="/siswa/:siswa_id/edit/:id_catatan_konseling" element={<KonselingEditCatatan />} />
        <Route path="/siswa/:siswa_id/tindakLanjut/:id_catatan_konseling" element={<KonselingTindakLanjut />} />
      </Routes>
    </div>
  );
}