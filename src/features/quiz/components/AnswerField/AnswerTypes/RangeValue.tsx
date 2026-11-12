import { useQuizContext } from "../../../hook";
import type { RangeValueQuestion } from "../../../types";

interface Props {
  question: RangeValueQuestion;
}

// Fungsi untuk bikin penomoran pada opsi jawaban
export default function RangeValue({ question }: Props) {
  const { quizProgress, updateUserAnswer } = useQuizContext();
  const savedAnswer = quizProgress.responses[question.id]?.userAnswer;
  const selectedAnswer = typeof savedAnswer === "number" ? savedAnswer : null;

  const rangeVal: number[] = [];
  for (let i = question.min_val; i <= question.max_val; i++) {
    rangeVal.push(i);
  }

  return (
    <div className="flex justify-evenly">
      {rangeVal.map((num) => {
        return (
          <div
            className="flex flex-col gap-1 items-center justify-center"
            key={num}
          >
            <input
              type="radio"
              name={`${question.id}`}
              id={`${question.id}-${num}`}
              checked={selectedAnswer === num}
              onChange={() => updateUserAnswer(question.id, question.question_number, question.type, num)}
            />
            <label htmlFor={`${question.id}-${num}`}>{num}</label>
          </div>
        );
      })}
    </div>
  );
}
