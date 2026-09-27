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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz/:id/*" element={<Quiz />} />
        <Route path="/jadwal-siswa/*" element={<Jadwal />} />
        <Route path="/latihan-soal" element={<LatihanSoal />} />
        <Route path="/latihan-soal/mapel/:id" element={<LatihanSoalMapel />} />
        <Route path="/quiz_result/:id" element={<QuizResult />} />
        <Route
          path="/quiz_result/:id/details"
          element={<QuizResultDetails />}
        />
        <Route path="/riwayat/*" element={<RiwayatQuiz />} />
        <Route path="/passing_grade" element={<PassingGrade />} />
        <Route path="/passing_grade/:id" element={<PassingGradeUniv />} />
        <Route path="/hasil_minat_bakat/:id" element={<HasilMinatBakat />} />
        <Route
          path="/hasil_minat_bakat/:id/jurusan/:id_jurusan"
          element={<HasilMinatBakatJurusan />}
        />
        <Route
          path="/hasil_minat_bakat/:id/tambah_jurusan"
          element={<TambahTargetJurusanLain />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
