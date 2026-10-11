import { Route, Routes, useSearchParams } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import RekapAbsen from "./Absen/RekapAbsen";
import RekapAbsenKelasList from "./Absen/RekapAbsenKelasList";
import RekapAbsenKelas from "./Absen/RekapAbsenKelas";
import RekapAbsenSiswa from "./Absen/RekapAbsenSiswa";
import RekapAbsenSiswaMapel from "./Absen/RekapAbsenSiswaMapel";
import RekapNilai from "./Nilai/RekapNilai";
import RekapNilaiKelasList from "./Nilai/RekapNilaiKelasList";
import RekapNilaiKelas from "./Nilai/RekapNilaiKelas";
import RekapNilaiSiswa from "./Nilai/RekapNilaiSiswa";
import RekapNilaiSiswaMapel from "./Nilai/RekapNilaiSiswaMapel";

function RekapHome() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "nilai" ? "nilai" : "absen";

  const tabClass = (aktif: boolean) =>
    `flex-1 rounded-full border border-blue-900 py-1 text-xs font-semibold text-blue-900 ${
      aktif ? "bg-blue-100" : "bg-white"
    }`;

  return (
    <div>
      <Header title="Rekap" />
      <XPadding className="mt-5">
        <div className="flex gap-3">
          <button
            className={tabClass(tab === "absen")}
            onClick={() => setParams({ tab: "absen" }, { replace: true })}
          >
            Rekap Absen
          </button>
          <button
            className={tabClass(tab === "nilai")}
            onClick={() => setParams({ tab: "nilai" }, { replace: true })}
          >
            Rekap Nilai
          </button>
        </div>
      </XPadding>

      {tab === "absen" ? <RekapAbsen /> : <RekapNilai />}
    </div>
  );
}

export default function Rekap() {
  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      <Routes>
        <Route path="/" element={<RekapHome />} />

        {/* Rekap Absen */}
        <Route path="absen/:jenjang/kelas" element={<RekapAbsenKelasList />} />
        <Route path="absen/kelas/:kelas_id" element={<RekapAbsenKelas />} />
        <Route path="absen/siswa/:siswa_id" element={<RekapAbsenSiswa />} />
        <Route
          path="absen/siswa/:siswa_id/mapel/:mapel_id"
          element={<RekapAbsenSiswaMapel />}
        />
        
        {/* Rekap Nilai */}
        <Route path="nilai/:jenjang/kelas" element={<RekapNilaiKelasList />} />
        <Route path="nilai/kelas/:kelas_id" element={<RekapNilaiKelas />} />
        <Route path="nilai/siswa/:siswa_id" element={<RekapNilaiSiswa />} />
        <Route
          path="nilai/siswa/:siswa_id/mapel/:mapel_id"
          element={<RekapNilaiSiswaMapel />}
        />
      </Routes>
    </div>
  );
}
