import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import XPadding from "../../components/XPadding";
import { useUser } from "../dashboard/UserContext";
import { listAttempts } from "../quiz/api/quizApi";
import { queryKeys } from "../../shared/server-state/queryKeys";

export default function RiwayatQuiz() {
  const navigate = useNavigate();
  const { authUser } = useUser();
  const history = useQuery({
    queryKey: queryKeys.quiz.attempts({ studentUserId: authUser?.id }),
    queryFn: () => listAttempts({ studentUserId: authUser?.id, pageSize: 100 }),
    enabled: Boolean(authUser?.roles?.includes("siswa")),
  });

  if (!authUser?.roles?.includes("siswa")) return <p className="p-8">Akses riwayat siswa ditolak.</p>;
  return <div>
    <Header title="Riwayat" />
    <XPadding>
      {history.isLoading && <p>Memuat riwayat...</p>}
      {history.error && <p>Riwayat tidak dapat dimuat.</p>}
      <div className="space-y-3">
        {history.data?.items.map((attempt) => (
          <button key={attempt.attemptId} type="button" onClick={() => navigate(`/quiz_result/${attempt.attemptId}`)}
            className="flex w-full justify-between rounded-xl border border-black/10 p-4 text-left">
            <span><strong>{attempt.quizTitle}</strong><br /><small>{new Date(attempt.startedAt).toLocaleString()}</small></span>
            <span>{attempt.score ?? "-"} · {attempt.status}</span>
          </button>
        ))}
      </div>
    </XPadding>
  </div>;
}
