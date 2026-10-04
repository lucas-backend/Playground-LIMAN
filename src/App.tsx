import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "./features/dashboard/Dashboard";
import Jadwal from "./features/jadwal/Jadwal";
import Login from "./features/login/Login";
import Quiz from "./features/quiz/Quiz";
import NotFound from "./pages/NotFound";
import LatihanSoal from "./features/latihan-soal/LatihanSoal";
import LatihanSoalMapel from "./features/latihan-soal/LatihanSoalMapel";
import QuizResult from "./features/quiz-result/QuizResult";
import QuizResultDetails from "./features/quiz-result/QuizResultDetails";
import RiwayatQuiz from "./features/riwayat-quiz/RiwayatQuiz";
import PassingGrade from "./features/passing-grade/PassingGrade";
import PassingGradeUniv from "./features/passing-grade/PassingGradeUniv";
import HasilMinatBakat from "./features/hasil-minat-bakat/HasilMinatBakat";
import HasilMinatBakatJurusan from "./features/hasil-minat-bakat/HasilMinatBakatJurusan";
import TambahTargetJurusanLain from "./features/hasil-minat-bakat/TambahTargetJurusanLain";
import Absensi from "./features/guruMapel/absensi/Absensi";
import AbsensiKelas from "./features/guruMapel/absensi/AbsensiKelas";
import AbsensiPertemuan from "./features/guruMapel/absensi/pertemuan/AbsensiPertemuan";
import DetailSiswa from "./features/guruMapel/absensi/detailSiswa/DetailSiswa";
import AbsensiWali from "./features/guruWali/absensi/AbsensiWali";
import AbsensiWaliDetailSiswa from "./features/guruWali/absensi/absensiDetail/AbsensiWaliDetailSiswa";
import AbsensiWaliDetailSiswaDetailHari from "./features/guruWali/absensi/absensiDetail/AbsensiWaliDetailSiswaDetailHari";
import RapotSiswaWali from "./features/guruWali/rapotSiswa/RapotSiswaWali";
import RapotSiswaWaliDetailNilai from "./features/guruWali/rapotSiswa/RapotSiswaWaliDetailNilai";
import RapotAbsensi from "./features/guruWali/rapotSiswa/RapotAbsensi";
import RapotAbsensiMateri from "./features/guruWali/rapotSiswa/RapotAbsensiMateri";
import KonselingWali from "./features/guruWali/konselingWali/KonselingWali";
import CatatanKonselingWali from "./features/guruWali/konselingWali/CatatanKonselingWali";
import CatatanKonselingWaliTindakLanjut from "./features/guruWali/konselingWali/CatatanKonselingWaliTindakLanjut";
import LatihanSoalGuru from "./features/guru/LatihanSoal/LatihanSoalGuru";
import TambahSoalLatihan from "./features/guru/LatihanSoal/TambahSoalLatihan";
import EditSoalGuru from "./features/guru/LatihanSoal/EditSoalGuru";
import BankSoalGuru from "./features/guru/LatihanSoal/BankSoalGuru";
import BankSoalGuruMapel from "./features/guru/LatihanSoal/BankSoalGuruMapel";
import BankSoalGuruMapelSoal from "./features/guru/LatihanSoal/BankSoalGuruMapelSoal";
import BankSoalGuruMapelSoalDetail from "./features/guru/LatihanSoal/BankSoalGuruMapelSoalDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz/:quiz_id/*" element={<Quiz />} />
        <Route path="/jadwal-siswa/*" element={<Jadwal />} />
        <Route path="/latihan-soal" element={<LatihanSoal />} />
        <Route
          path="/latihan-soal/mapel/:mapel_id"
          element={<LatihanSoalMapel />}
        />
        <Route path="/quiz_result/:quiz_result_id" element={<QuizResult />} />
        <Route
          path="/quiz_result/:id/details"
          element={<QuizResultDetails />}
        />
        <Route path="/riwayat/*" element={<RiwayatQuiz />} />
        <Route path="/passing_grade" element={<PassingGrade />} />
        <Route
          path="/passing_grade/:passing_grade_id"
          element={<PassingGradeUniv />}
        />
        <Route
          path="/hasil_minat_bakat/:quiz_minat_bakat_id"
          element={<HasilMinatBakat />}
        />
        <Route
          path="/hasil_minat_bakat/:id/jurusan/:id_jurusan"
          element={<HasilMinatBakatJurusan />}
        />
        <Route
          path="/hasil_minat_bakat/:id/tambah_jurusan"
          element={<TambahTargetJurusanLain />}
        />
        <Route path="/guruMapel/absensi" element={<Absensi />} />
        <Route path="/guruMapel/absensi/:kelas_id" element={<AbsensiKelas />} />
        <Route
          path="/guruMapel/absensi/:kelas_id/pertemuan/:pertemuan_id"
          element={<AbsensiPertemuan />}
        />

        <Route path="/detail/siswa/:id" element={<DetailSiswa />} />
        <Route path="/guruWali/absensi/:kelas_id" element={<AbsensiWali />} />
        <Route
          path="/guruWali/absensi/siswa/:siswa_id"
          element={<AbsensiWaliDetailSiswa />}
        />
        <Route
          path="/guruWali/absensi/siswa/:siswa_id/detail/"
          element={<AbsensiWaliDetailSiswaDetailHari />}
        />
        <Route
          path="/guruWali/rapot/siswa/:siswa_id"
          element={<RapotSiswaWali />}
        />

        <Route
          path="/guruWali/rapot/siswa/:siswa_id/mapel/:mapel_id"
          element={<RapotSiswaWaliDetailNilai />}
        />
        <Route
          path="/guruWali/rapot/absensi/siswa/:siswa_id"
          element={<RapotAbsensi />}
        />
        <Route
          path="/guruWali/rapot/absensi/siswa/:siswa_id/materi/:materi_id"
          element={<RapotAbsensiMateri />}
        />

        <Route
          path="/guruWali/konseling/siswa/:siswa_id"
          element={<KonselingWali />}
        />
        <Route
          path="/guruWali/konseling/siswa/:siswa_id/catatan"
          element={<CatatanKonselingWali />}
        />
        <Route
          path="/guruWali/konseling/siswa/:siswa_id/tindakLanjut/:id_catatan_bk"
          element={<CatatanKonselingWaliTindakLanjut />}
        />

        <Route
          path="/guru/latihanSoal"
          element={<LatihanSoalGuru />}
        />
        <Route
          path="/guru/latihanSoal/tambahSoal"
          element={<TambahSoalLatihan />}
        />
        {/* /guru/latihanSoal/tambahSoal */}
        {/* /guru/latihanSoal/editSoal/1/soal/1 */}
        <Route
          path="/guru/latihanSoal/editSoal/:id_soal/soal/:id_pertanyaan"
          element={<EditSoalGuru />}
        />
        <Route
          path="/guru/latihanSoal/bankSoal"
          element={<BankSoalGuru />}
        />
        <Route
          path="/guru/latihanSoal/bankSoal/:mapel_id"
          element={<BankSoalGuruMapel />}
        />
        <Route
          path="/guru/latihanSoal/bankSoal/:mapel_id/soal/:soal_id"
          element={<BankSoalGuruMapelSoal />}
        />
        <Route
          path="/guru/latihanSoal/bankSoal/:mapel_id/soal/:soal_id/detail/:pertanyaan_id"
          element={<BankSoalGuruMapelSoalDetail />}
        />



        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
