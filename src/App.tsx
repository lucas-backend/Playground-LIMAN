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
import MenuWaliKelas from "./features/guruWali/MenuWaliKelas";
import AbsensiWaliDetailSiswa from "./features/guruWali/absensi/AbsensiWaliDetailSiswa";
import AbsensiWaliDetailSiswaDetailHari from "./features/guruWali/absensi/AbsensiWaliDetailSiswaDetailHari";
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
import UjianSoalGuru from "./features/guru/Ujian/UjianSoalGuru";
import TambahSoalUjian from "./features/guru/Ujian/TambahSoalUjian";
import EditSoalUjianGuru from "./features/guru/Ujian/EditSoalUjianGuru";
import BankSoalUjianGuruMapel from "./features/guru/Ujian/BankSoalUjianGuruMapel";
import BankSoalUjianGuruMapelSoal from "./features/guru/Ujian/BankSoalUjianGuruMapel";
import BankSoalUjianGuruMapelSoalDetail from "./features/guru/Ujian/BankSoalUjianGuruMapel";
import GuruTugas from "./features/guru/Tugas/GuruTugas";
import GuruPenilaian from "./features/guru/Penilaian/GuruPenilaian";
import GuruRemedial from "./features/guru/Remedial/GuruRemedial";
import GuruTugasMapel from "./features/guru/Tugas/GuruTugasMapel";
import GuruTugasTambahTugas from "./features/guru/Tugas/GuruTugasTambahTugas";
import GuruTugasListSiswa from "./features/guru/Tugas/GuruTugasListSiswa";
import GuruPenilaianKelas from "./features/guru/Penilaian/GuruPenilaianKelas";
import GuruPenilaianKelasSiswa from "./features/guru/Penilaian/GuruPenialaianKelasSiswa";
import GuruPenilaianKelasSiswaRekap from "./features/guru/Penilaian/GuruPenilaianKelasSiswaRekap";
import Koreksi from "./features/guru/Koreksi/Koreksi";
import KoreksiSiswa from "./features/guru/Koreksi/KoreksiSiswa";
import KoreksiSiswaPertanyaan from "./features/guru/Koreksi/KoreksiSiswaPertanyaan";
import Konseling from "./features/guruBK/Konseling/Konseling";
import Rekap from "./features/guruBK/Rekap/Rekap";
import MinatBakat from "./features/guruBK/MinatBakat/MinatBakat";
import HalamanNotifikasi from "./features/notifikasi/HalamanNotifikasi";
import AdminDashboard from "./features/admin/AdminDashboard";

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
        <Route path="/guruWali/absensi/:kelas_id" element={<MenuWaliKelas />} />
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

        {/* =============================== Latihan Soal =============================== */}
        <Route path="/guru/latihanSoal" element={<LatihanSoalGuru />} />
        <Route
          path="/guru/latihanSoal/tambahSoal"
          element={<TambahSoalLatihan />}
        />
        <Route
          path="/guru/latihanSoal/editSoal/:id_soal/soal/:id_pertanyaan"
          element={<EditSoalGuru />}
        />
        <Route path="/guru/latihanSoal/bankSoal" element={<BankSoalGuru />} />
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

        {/* =============================== UJIAN =============================== */}
        <Route path="/guru/ujian/" element={<UjianSoalGuru />} />
        <Route path="/guru/ujian/tambahSoal" element={<TambahSoalUjian />} />
        <Route
          path="/guru/ujian/editSoal/:id_soal/soal/:id_pertanyaan"
          element={<EditSoalUjianGuru />}
        />
        <Route path="/guru/ujian/bankSoal" element={<BankSoalGuru />} />
        <Route
          path="/guru/ujian/bankSoal/:mapel_id"
          element={<BankSoalUjianGuruMapel />}
        />
        <Route
          path="/guru/ujian/bankSoal/:mapel_id/soal/:soal_id"
          element={<BankSoalUjianGuruMapelSoal />}
        />
        <Route
          path="/guru/ujian/bankSoal/:mapel_id/soal/:soal_id/detail/:pertanyaan_id"
          element={<BankSoalUjianGuruMapelSoalDetail />}
        />

        {/* ========================= */}
        <Route path="/guru/tugas" element={<GuruTugas />} />
        <Route path="/guru/tugas/:mapel_id" element={<GuruTugasMapel />} />
        <Route
          path="/guru/tugas/:mapel_id/tambahTugas"
          element={<GuruTugasTambahTugas />}
        />
        <Route
          path="/guru/tugas/:mapel_id/listSiswa/:tugas_id"
          element={<GuruTugasListSiswa />}
        />

        {/* ========================= */}
        <Route path="/guru/penilaian" element={<GuruPenilaian />} />
        <Route
          path="/guru/penilaian/kelas/:kelas_id"
          element={<GuruPenilaianKelas />}
        />
        <Route
          path="/guru/penilaian/:kelas_id/siswa/:siswa_id"
          element={<GuruPenilaianKelasSiswa />}
        />
        <Route
          path="/guru/penilaian/:kelas_id/siswa/:siswa_id/rekap"
          element={<GuruPenilaianKelasSiswaRekap />}
        />

        {/* ========================= */}
        <Route path="/guru/remedial" element={<GuruRemedial />} />

        <Route path="/guru/koreksi/:soal_id" element={<Koreksi />} />
        <Route path="/guru/koreksi/:soal_id/siswa/:siswa_id" element={<KoreksiSiswa/>}/>
        <Route path="/guru/koreksi/:soal_id/siswa/:siswa_id/pertanyaan/:pertanyaan_id" element={<KoreksiSiswaPertanyaan/>}/>
        {/* ========================= */}

        <Route path="/guruBK/konseling/*" element={<Konseling/>}/>
        <Route path="/guruBK/rekap/*" element={<Rekap/>}/>
        <Route path="/rekap/*" element={<Rekap/>}/>
        <Route path="/guruBK/minatBakat/*" element={<MinatBakat/>}/>

        <Route path="/admin/*" element={<AdminDashboard/>}/>

        <Route path="/notifikasi" element={<HalamanNotifikasi/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
