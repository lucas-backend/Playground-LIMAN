import { useEffect, useMemo } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "../../components/Header";
import XPadding from "../../components/XPadding";
import { useUser } from "../dashboard/UserContext";
import { getAttempt, getQuiz, listAttempts, startAttempt, submitAttempt } from "./api/quizApi";
import { queryKeys } from "../../shared/server-state/queryKeys";
import { useAppMutation } from "../../shared/server-state/useAppMutation";
import { QuizProvider } from "./QuizContext";
import { useQuizContext } from "./hook";
import type { QuizData } from "./types";
import QuizIndicator from "./components/QuizIndicator";
import QuestionText from "./components/QuestionText";
import AnswerField from "./components/AnswerField/AnswerField";
import QuizFooter from "./components/QuizFooter";
import QuizQuestionList from "./components/QuizQuestionList";

function message(text: string) {
  return <main className="flex min-h-dvh items-center justify-center p-6 text-center"><p>{text}</p></main>;
}

function normalizeQuiz(detail: Awaited<ReturnType<typeof getQuiz>>): QuizData {
  return {
    id: detail.id,
    title: detail.title,
    description: detail.description ?? undefined,
    startTime: detail.startTime,
    endTime: detail.endTime,
    questions: detail.questions.map((question) => ({
      id: String(question.id),
      question_number: question.questionNumber,
      question: question.question,
      type: question.type as QuizData["questions"][number]["type"],
      options: question.options,
    })) as QuizData["questions"],
  };
}

function QuizContent({ attemptId, result }: { attemptId: string; result: Awaited<ReturnType<typeof getAttempt>> }) {
  const { quizData, currentQuestionIndex, setCurrentQuestionIndex } = useQuizContext();
  const navigate = useNavigate();
  const submitMutation = useAppMutation(() => submitAttempt(attemptId), {
    onSuccess: (submitted) => navigate(`/quiz_result/${submitted.attemptId}`),
  });
  const question = quizData.questions[currentQuestionIndex];

  if (!question) return <Navigate to="/notfound" replace />;

  const handleSubmit = () => {
    submitMutation.mutateOnce(undefined);
  };

  return (
    <Routes>
      <Route index element={
        <div className="min-h-dvh flex flex-col">
          <Header title={quizData.title} />
          <XPadding className="text-lg">
            <QuizIndicator quiz={quizData} questionIndex={currentQuestionIndex} />
            <div className="mt-4" />
            <QuestionText text={question.question} />
            <div className="mt-4" />
            <AnswerField question={question} />
          </XPadding>
          {currentQuestionIndex === quizData.questions.length - 1 && (
            <XPadding className="mb-32 mt-8">
              <button type="button" disabled={submitMutation.isPending || result.status !== "in_progress"} onClick={handleSubmit}
                className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white disabled:opacity-50">
                {submitMutation.isPending ? "Mengirim..." : "Kirim jawaban"}
              </button>
            </XPadding>
          )}
          <QuizFooter setQuestionIndex={setCurrentQuestionIndex} quizLength={quizData.questions.length} currentQuestionIndex={currentQuestionIndex} />
        </div>
      } />
      <Route path="navigation" element={<QuizQuestionList />} />
    </Routes>
  );
}

export default function Quiz() {
  const { quizId } = useParams<{ quizId: string }>();
  const { authUser } = useUser();
  const client = useQueryClient();
  const attempts = useQuery({
    queryKey: queryKeys.quiz.attempts({ quizId }),
    queryFn: () => listAttempts({ quizId, status: "in_progress" }),
    enabled: Boolean(quizId && authUser?.roles?.includes("siswa")),
  });
  const startMutation = useMutation({
    mutationFn: () => startAttempt(quizId!),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.quiz.attempts({ quizId }) }),
  });
  const activeAttempt = attempts.data?.items[0];
  const attemptId = activeAttempt?.attemptId ?? startMutation.data?.attemptId;
  const detail = useQuery({
    queryKey: queryKeys.quiz.detail(quizId ?? ""),
    queryFn: () => getQuiz(quizId!, attemptId),
    enabled: Boolean(quizId && attemptId),
  });
  const result = useQuery({
    queryKey: queryKeys.quiz.result(attemptId ?? ""),
    queryFn: () => getAttempt(attemptId!),
    enabled: Boolean(attemptId),
  });

  useEffect(() => {
    if (quizId && authUser?.roles?.includes("siswa") && attempts.isFetched && !activeAttempt && !startMutation.data && !startMutation.isPending) {
      startMutation.mutate();
    }
  }, [activeAttempt, attempts.isFetched, authUser?.roles, quizId, startMutation]);

  const quizData = useMemo(() => detail.data ? normalizeQuiz(detail.data) : null, [detail.data]);
  if (!quizId) return message("Quiz tidak ditemukan.");
  if (!authUser?.roles?.includes("siswa")) return message("Akses quiz siswa ditolak oleh profil pengguna.");
  if (attempts.isLoading || startMutation.isPending || detail.isLoading || result.isLoading) return message("Menyiapkan quiz...");
  if (attempts.error || startMutation.error || detail.error || result.error) return message("Quiz tidak dapat dimuat. Periksa akses dan koneksi.");
  if (!attemptId || !quizData || !result.data) return message("Attempt quiz belum tersedia.");

  return <QuizProvider quizData={quizData} attemptId={attemptId} initialResult={result.data}>
    <QuizContent attemptId={attemptId} result={result.data} />
  </QuizProvider>;
}
