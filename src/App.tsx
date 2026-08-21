import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "./features/dashboard/Dashboard";
import Jadwal from "./features/jadwal/Jadwal";
import Login from "./features/login/Login";
import Quiz from "./features/quiz/Quiz";
import NotFound from "./pages/NotFound";
import LatihanSoal from "./features/latihan-soal/LatihanSoal";
import LatihanSoalMapel from "./features/latihan-soal/LatihanSoalMapel";

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
        <Route path="/latihan-soal/mapel/:id" element={<LatihanSoalMapel/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
