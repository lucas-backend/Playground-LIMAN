import { Route, Routes } from "react-router-dom";
import Header from "../../../components/Header";
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

export default function Rekap() {
  return (
    <div>
      <Header title="Rekap" />
      <Routes>
        {/* Ada 2 tombol"Rekap Absen dan Rekap Nilai */}
        <Route
          path="/"
          element={
            <div>
              {/* JIKA TAB AKTIF ADALAH REKAP ABSEN MAKA REKAP ABSEN */}
              <RekapAbsen />
              {/* JIKA TAB AKTIF ADALAH REKAP NILAI MAKA REKAP NILAI */}
              <RekapNilai />
            </div>
          }
        />

        {/* Rekap Absen */}
        <Route path="/absen/:jenjang/kelas" element={<RekapAbsenKelasList />} />
        <Route path="/absen/kelas/:kelas_id" element={<RekapAbsenKelas />} />
        <Route path="/absen/siswa/:siswa_id" element={<RekapAbsenSiswa />} />
        <Route
          path="/absen/siswa/:siswa_id/mapel/:mapel_id"
          element={<RekapAbsenSiswaMapel />}
        />

        {/* Rekap Nilai */}
        <Route path="/nilai/:jenjang/kelas" element={<RekapNilaiKelasList />} />
        <Route path="/nilai/kelas/:kelas_id" element={<RekapNilaiKelas />} />
        <Route path="/nilai/siswa/:siswa_id" element={<RekapNilaiSiswa />} />
        <Route
          path="nilai/siswa/:siswa_id/mapel/:mapel_id"
          element={<RekapNilaiSiswaMapel />}
        />
      </Routes>
    </div>
  );
}
