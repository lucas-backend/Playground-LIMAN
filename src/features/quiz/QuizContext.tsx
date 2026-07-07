import {
  createContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import {
  type QuizProgress,
  type QuizData,
  type QuestionResponse,
} from "./types";

export interface QuizContextValueType {
  quizData: QuizData;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: Dispatch<SetStateAction<number>>;
  quizProgress: QuizProgress;
  setQuizProgress: Dispatch<SetStateAction<QuizProgress>>;
  updateUserAnswer: (
    questionId: number,
    type: QuestionResponse["type"],
    answer: QuestionResponse["userAnswer"],
  ) => void;
}

const QuizContext = createContext<QuizContextValueType | null>(null);

interface Props {
  quizData: QuizData;
  children: ReactNode;
}

export function QuizProvider({ quizData, children }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [quizProgress, setQuizProgress] = useState<QuizProgress>({
    quizId: quizData.id,
    startTime: new Date().toISOString(),
    lastSaved: new Date().toISOString(),
    responses: {},
  });

  function updateUserAnswer(
    questionId: number,
    type: QuestionResponse["type"],
    answer: QuestionResponse["userAnswer"],
  ) {
    setQuizProgress((prev) => {
      const updatedResponses = { ...prev.responses };

      // Langsung tembak berdasarkan questionId tanpa looping!
      updatedResponses[questionId] = {
        questionId,
        type,
        userAnswer: answer,
        isCompleted: answer !== null && answer !== "",
        updatedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        lastSaved: new Date().toISOString(),
        responses: updatedResponses,
      };
    });
  }

  // const contextValue
  const contextValue = {
    quizData,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    quizProgress,
    setQuizProgress,
    updateUserAnswer, // Fungsi ini di-expose agar komponen soal tinggal pakai
  };

  return (
    <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
  );
}
