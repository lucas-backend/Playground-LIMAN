import type { QuizQuestion } from "../../types";
import MultipleChoice from "./AnswerTypes/MultipleChoice";
import RangeValue from "./AnswerTypes/RangeValue";
import SingleChoice from "./AnswerTypes/SingleChoice";

interface Props {
  question: QuizQuestion;
}

export default function AnswerField({ question }: Props) {
  switch (question.type) {
    case "pilihan_ganda":
      return <SingleChoice question={question} />;
    case "pilihan_ganda_kompleks":
      return <MultipleChoice question={question} />;
    case "rentang_nilai":
      return <RangeValue question={question} />;
    case "benar_salah":
      return null;
    case "essay":
      return null;
    default:
      return null;
  }
}
