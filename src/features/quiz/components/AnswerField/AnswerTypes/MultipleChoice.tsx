import { useQuizContext } from "../../../hook";
import type { MultipleChoiceQuestion } from "../../../types";
import { toggleNumberSelection } from "../../../utils";

interface Props {
  question: MultipleChoiceQuestion;
}

// Note: Harus ada mekanisme penyimpan jawaban untuk checkbox
export default function MultipleChoice({ question }: Props) {
  const { quizProgress, updateUserAnswer } = useQuizContext();
  const savedAnswer = quizProgress.responses[question.id]?.userAnswer;
  const selectedAnswers =
    Array.isArray(savedAnswer) &&
    savedAnswer.every((value) => typeof value === "number")
      ? savedAnswer
      : [];

  return (
    <div className="">
      {question.options.map((option) => {
        const isChecked = selectedAnswers.includes(option.id);

        return (
          <div key={`${option.id}`}>
            <input
              type="checkbox"
              name={`${option.id}`}
              id={`${option.id}`}
              className="mr-2"
              checked={isChecked}
              onChange={() => {
                const nextSelection = toggleNumberSelection(
                  selectedAnswers,
                  option.id,
                );

                updateUserAnswer(question.id, question.type, nextSelection);
              }}
            />
            <label htmlFor={`${option.id}`}>{option.label}</label>
          </div>
        );
      })}
    </div>
  );
}
