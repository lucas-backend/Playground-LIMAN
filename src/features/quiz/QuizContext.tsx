import {
  useState,
  useEffect,
  useRef,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import {
  type QuizProgress,
  type QuizData,
  type QuestionResponse,
} from "./types";

import { QuizContext } from "./hook";
import { isAnswerCompleted } from "./utils";
import { saveAnswer, type AttemptResult } from "./api/quizApi";
import { useMutation } from "@tanstack/react-query";

export interface QuizContextValueType {
  quizData: QuizData;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: Dispatch<SetStateAction<number>>;
  quizProgress: QuizProgress;
  setQuizProgress: Dispatch<SetStateAction<QuizProgress>>;
  updateUserAnswer: (
    questionId: string | number,
    questionNumber: number,
    type: QuestionResponse["type"],
    answer: QuestionResponse["userAnswer"],
  ) => void;
  isSaving: boolean;
  saveError: Error | null;
  submitStarted: () => boolean;
}

interface Props {
  quizData: QuizData;
  attemptId: string;
  initialResult?: AttemptResult;
  children: ReactNode;
}

export function QuizProvider({ quizData, attemptId, initialResult, children }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [quizProgress, setQuizProgress] = useState<QuizProgress>({
    quizId: quizData.id,
    startTime: initialResult?.startedAt ?? new Date().toISOString(),
    lastSaved: new Date().toISOString(),
    responses: Object.fromEntries((initialResult?.answers ?? []).map((answer) => [
      answer.questionId,
      {
        questionId: answer.questionId,
        type: quizData.questions.find((question) => String(question.id) === String(answer.questionId))?.type ?? "essay",
        userAnswer: answer.userAnswer,
        isCompleted: answer.userAnswer !== null,
        updatedAt: initialResult?.submittedAt ?? new Date().toISOString(),
      },
    ])),
  });
  const saveMutation = useMutation({
    mutationFn: ({ questionNumber, userAnswer }: { questionNumber: number; userAnswer: QuestionResponse["userAnswer"] }) =>
      saveAnswer(attemptId, questionNumber, userAnswer),
  });
  const [pendingCount, setPendingCount] = useState(0);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const pending = useRef(new Map<string, { questionNumber: number; userAnswer: QuestionResponse["userAnswer"] }>());
  const submitting = useRef(false);

  useEffect(() => () => {
    timers.current.forEach((timer) => globalThis.clearTimeout(timer));
  }, []);

  function updateUserAnswer(
    questionId: string | number,
    questionNumber: number,
    type: QuestionResponse["type"],
    answer: QuestionResponse["userAnswer"],
  ) {
    setQuizProgress((prev) => {
      const updatedResponses = { ...prev.responses };

      // Langsung tembak berdasarkan questionId tanpa looping!
      const key = String(questionId);
      updatedResponses[key] = {
        questionId,
        type,
        userAnswer: answer,
        isCompleted: isAnswerCompleted(answer),
        updatedAt: new Date().toISOString(),
      };

      if (!pending.current.has(key)) setPendingCount((count) => count + 1);
      pending.current.set(key, { questionNumber, userAnswer: answer });
      const previousTimer = timers.current.get(key);
      if (previousTimer) globalThis.clearTimeout(previousTimer);
      timers.current.set(key, globalThis.setTimeout(() => {
        const next = pending.current.get(key);
        pending.current.delete(key);
        setPendingCount((count) => Math.max(0, count - 1));
        timers.current.delete(key);
        if (next) void saveMutation.mutateAsync(next);
      }, 300));
      return {
        ...prev,
        lastSaved: new Date().toISOString(),
        responses: updatedResponses,
      };
    });
  }

  function submitStarted() {
    if (submitting.current) return false;
    submitting.current = true;
    return true;
  }

  // const contextValue
  const contextValue = {
    quizData,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    quizProgress,
    setQuizProgress,
    updateUserAnswer,
    isSaving: saveMutation.isPending || pendingCount > 0,
    saveError: saveMutation.error,
    submitStarted,
  };

  return (
    <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
  );
}
