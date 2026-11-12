import { useQuizContext } from "../../../hook";
import type { MultipleChoiceQuestion } from "../../../types";

interface Props {
  question: MultipleChoiceQuestion;
}

// Helper untuk mengubah ID opsi (0, 1, 2...) menjadi huruf (A, B, C...)
// Jika option.id Anda sudah berupa string "A", "B", "C", Anda bisa langsung memakai option.id
const getLetter = (id: number | string) => {
  if (typeof id === "number") {
    return String.fromCharCode(65 + id - 1); // 0 -> A, 1 -> B, dst.
  }
  return id;
};

export default function SingleChoice({ question }: Props) {
  const { quizProgress, updateUserAnswer } = useQuizContext();
  const savedAnswer = quizProgress.responses[question.id]?.userAnswer;
  const selectedAnswer = typeof savedAnswer === "number" || typeof savedAnswer === "string" ? savedAnswer : null;

  return (
    <div className="mt-4 flex flex-col gap-2">
      {question.options.map((option) => {
        const optionLetter = getLetter(option.id);

        return (
          <div key={`${option.id}`} className="flex items-center">
            <input
              type="radio"
              name={`${question.question_number}`}
              id={`${option.id}`}
              className={` mr-2 appearance-none rounded-full w-5 h-5 border border-blue-500 checked:bg-blue-500 text-xs flex items-center justify-center checked:text-white before:content-(--opt-letter)`}
              style={
                { "--opt-letter": `"${optionLetter}"` } as React.CSSProperties
              }
              checked={selectedAnswer === option.id}
              onChange={() =>
                updateUserAnswer(question.id, question.question_number, question.type, option.id)
              }
            />
            <label htmlFor={`${option.id}`}>{option.label}</label>
          </div>
        );
      })}
    </div>
  );
}
