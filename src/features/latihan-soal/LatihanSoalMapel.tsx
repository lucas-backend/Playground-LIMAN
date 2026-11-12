import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import XPadding from "../../components/XPadding";
import { mapelLatihan } from "./data";
import { useUser } from "../dashboard/UserContext";
import { listQuizzes } from "../quiz/api/quizApi";
import { queryKeys } from "../../shared/server-state/queryKeys";

export default function LatihanSoalMapel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useUser();
  const mapel = mapelLatihan.find((item) => String(item.id) === id);
  const quizzes = useQuery({
    queryKey: queryKeys.quiz.list(),
    queryFn: () => listQuizzes({ pageSize: 100 }),
    enabled: Boolean(authUser?.roles?.includes("siswa")),
  });

  if (!mapel) return <p className="p-8">Mata pelajaran tidak ditemukan.</p>;
  return <div>
    <Header title="Latihan Soal" />
    <XPadding className="pt-8">
      <div className={`flex items-center gap-4 rounded-lg p-4 ${mapel.bgColorFull}`}>
        <div className="rounded-lg bg-white/50 p-2 text-white"><mapel.icon className="h-8! w-8!" /></div>
        <div className="text-white"><h3 className="text-xl font-semibold">{mapel.name}</h3><span>{mapel.topicCount} Bab</span></div>
      </div>
      <p className="mt-5 text-xs text-black/60">Daftar ini memakai endpoint quiz aktif; pemetaan mapel ke subject UUID belum disimpulkan dari route UI.</p>
      {quizzes.isLoading && <p className="mt-4">Memuat quiz...</p>}
      {quizzes.error && <p className="mt-4">Quiz tidak dapat dimuat.</p>}
      <div className="mt-4 space-y-3">
        {quizzes.data?.items.map((quiz) => (
          <div key={quiz.id} className="rounded-lg border border-black/10 p-4">
            <p className="font-semibold">{quiz.title}</p>
            <p className="text-sm text-black/60">{quiz.description ?? "Quiz latihan"}</p>
            <button type="button" onClick={() => navigate(`/quiz/${quiz.id}`)}
              className="mt-3 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white">Mulai / lanjutkan</button>
          </div>
        ))}
      </div>
    </XPadding>
  </div>;
}
