// import { useState } from "react";
import Header from "../../components/Header";

import { type QuizQuestion, type QuizData } from "./types";
import QuizIndicator from "./components/QuizIndicator";
import QuestionText from "./components/QuestionText";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { quizList } from "./data.mock";
import AnswerField from "./components/AnswerField/AnswerField";
import QuizFooter from "./components/QuizFooter";
import XPadding from "../../components/XPadding";
import { useQuizContext } from "./hook";
import { QuizProvider } from "./QuizContext";
import QuizQuestionList from "./components/QuizQuestionList";

export function QuizContent() {
  const { quizData, currentQuestionIndex, setCurrentQuestionIndex } =
    useQuizContext();

  const question: QuizQuestion = quizData.questions[currentQuestionIndex];

  if (!question) {
    return <Navigate to={"/notfound"} />;
  }

  return (
    <Routes>
      <Route
        index
        element={
          <div className="min-h-dvh flex flex-col">
            {/* Header */}
            <Header title={quizData.title} />

            {/* Body */}
            <XPadding className="text-lg">
              <QuizIndicator
                quiz={quizData}
                questionIndex={currentQuestionIndex}
              />
              <div className="mt-4"></div>
              <QuestionText text={question.question} />
              <div className="mt-4"></div>

              {/* Answer Field */}
              <AnswerField question={question} />
            </XPadding>

            {/* Footer & Control Button */}
            <div className="mt-48">
              <QuizFooter
                setQuestionIndex={setCurrentQuestionIndex}
                quizLength={quizData.questions.length}
                currentQuestionIndex={currentQuestionIndex}
              />
            </div>
          </div>
        }
      />
      <Route path={`navigation`} element={<QuizQuestionList />} />
    </Routes>
  );
}

export default function Quiz() {
  const { id } = useParams();

  const quiz: QuizData | null =
    quizList.find((item) => `${item.id}` === id) ?? null;

  if (!quiz) {
    return <Navigate to={"/notfound"} />;
  }

  return (
    <QuizProvider quizData={quiz}>
      <QuizContent />
    </QuizProvider>
  );
}
