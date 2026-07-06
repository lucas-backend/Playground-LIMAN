import type { MultipleChoiceQuestion } from "../../../types";

interface Props {
  question: MultipleChoiceQuestion;
}

export default function SingleChoice({ question }: Props) {
  return (
    <div className="mt-4 flex flex-col gap-2">
      {question.options.map((option) => {
        return (
          <div key={`${option.id}`}>
            <input
              type="radio"
              name={`${question.question_number}`}
              id={`${option.id}`}
              className="mr-2"
            />
            <label htmlFor={`${option.id}`}>{option.label}</label>
          </div>
        );
      })}
    </div>
  );
}
