import { createContext, useContext } from "react";
import type { QuizContextValueType } from "./QuizContext";

export const QuizContext = createContext<QuizContextValueType | null>(null);

export function useQuizContext() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuizContext harus digunakan di dalam QuizProvider");
  }
  return context;
}
