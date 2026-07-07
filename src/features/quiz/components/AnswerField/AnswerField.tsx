import type { QuizQuestion } from "../../types";
import Essay from "./AnswerTypes/Essay";
import MultipleChoice from "./AnswerTypes/MultipleChoice";
import RangeValue from "./AnswerTypes/RangeValue";
import SingleChoice from "./AnswerTypes/SingleChoice";
import TrueFalse from "./AnswerTypes/TrueFalse";

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
      return <TrueFalse question={question}></TrueFalse>;
    case "essay":
      return <Essay question={question}></Essay>;
    default:
      return null;
  }
}
