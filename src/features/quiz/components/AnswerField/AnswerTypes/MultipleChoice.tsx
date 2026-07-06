import type { MultipleChoiceQuestion } from "../../../types";

interface Props {
  question: MultipleChoiceQuestion;
}

// Note: Harus ada mekanisme penyimpan jawaban untuk checkbox
export default function MultipleChoice({ question }: Props) {
  return (
    <div className="">
      {question.options.map((option) => {
        return (
          <div key={`${option.id}`}>
            <input
              type="checkbox"
              name={`${option.id}`}
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
