import { useState } from "react";
import Header from "../../components/Header";

import { type QuizQuestion, type QuizData } from "./types";
import QuizIndicator from "./components/QuizIndicator";
import QuestionText from "./components/QuestionText";
import { Navigate, useParams } from "react-router-dom";
import { quizList } from "./data.mock";
import AnswerField from "./components/AnswerField/AnswerField";
import QuizFooter from "./components/QuizFooter";
import XPadding from "../../components/XPadding";

export default function Quiz() {
  const { id } = useParams();

  const quiz: QuizData | null =
    quizList.find((item) => `${item.id}` == id) ?? null;

  const [questionIndex, setQuestionIndex] = useState(3);

  if (!quiz) {
    return <Navigate to={"/notfound"} />;
  }

  const question: QuizQuestion = quiz.questions[questionIndex];

  if (!question) {
    return <Navigate to={"/notfound"} />;
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <Header title={quiz.title} />

      {/* Body */}
      <XPadding className="text-lg">
        <QuizIndicator quiz={quiz} questionIndex={questionIndex} />
        <div className="mt-4"></div>
        <QuestionText text={question.question} />
        <div className="mt-4"></div>

        {/* Answer Field */}
        <AnswerField question={question} />
      </XPadding>

      {/* Footer & Control Button */}
      <div className="mt-auto">
        <QuizFooter
          setQuestionIndex={setQuestionIndex}
          quizLength={quiz.questions.length}
        />
      </div>
    </div>
  );
}
