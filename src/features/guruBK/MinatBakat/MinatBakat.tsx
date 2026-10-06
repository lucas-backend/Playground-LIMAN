import { Route, Routes } from "react-router-dom";
import MinatBakatJenjang from "./MinatBakatJenjang";
import MinatBakatKelasList from "./MinatBakatKelasList";
import MinatBakatKelas from "./MinatBakatKelas";
import MinatBakatSiswa from "./MinatBakatSiswa";
import MinatBakatSiswaHasil from "./MinatBakatSiswaHasil";

export default function MinatBakat() {
  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      <Routes>
        <Route path="/" element={<MinatBakatJenjang />} />
        <Route path="kelasList/:jenjang" element={<MinatBakatKelasList />} />
        <Route path="kelas/:kelas_id" element={<MinatBakatKelas />} />
        <Route path="siswa/:siswa_id" element={<MinatBakatSiswa />} />
        <Route path="siswa/:siswa_id/hasil" element={<MinatBakatSiswaHasil />} />
      </Routes>
    </div>
  );
}