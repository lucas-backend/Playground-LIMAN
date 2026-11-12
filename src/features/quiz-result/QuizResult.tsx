import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import XPadding from "../../components/XPadding";
import { getAttempt } from "../quiz/api/quizApi";
import { queryKeys } from "../../shared/server-state/queryKeys";

export default function QuizResult() {
  const { quiz_result_id: attemptId } = useParams<{ quiz_result_id: string }>();
  const result = useQuery({
    queryKey: queryKeys.quiz.result(attemptId ?? ""),
    queryFn: () => getAttempt(attemptId!),
    enabled: Boolean(attemptId),
  });

  if (!attemptId || result.isLoading) return <p className="p-8">Memuat hasil...</p>;
  if (result.error || !result.data) return <p className="p-8">Hasil tidak dapat dimuat.</p>;
  return <div>
    <Header title={`Hasil ${result.data.quizTitle}`} />
    <XPadding className="space-y-6 pt-8">
      <div className="rounded-xl border border-black/10 p-5">
        <p>Status: {result.data.status}</p>
        <p>Nilai: {result.data.score ?? "Menunggu koreksi"}</p>
        {result.data.essayPending && <p className="mt-2 text-sm text-orange-700">Jawaban essay menunggu koreksi guru.</p>}
      </div>
      <div className="space-y-2">
        {result.data.answers.map((answer, index) => (
          <div key={answer.answerId} className="rounded-lg border border-black/10 p-3">
            <span>Soal {index + 1}</span>: {answer.userAnswer === null ? "Belum dijawab" : String(answer.userAnswer)}
            <span className="ml-2">{answer.isCorrect === null ? "Menunggu koreksi" : answer.isCorrect ? "Benar" : "Salah"}</span>
          </div>
        ))}
      </div>
    </XPadding>
  </div>;
}
