import type { RangeValueQuestion } from "../../../types";

interface Props {
  question: RangeValueQuestion;
}

export default function RangeValue({ question }: Props) {
  const rangeVal: number[] = [];
  for (let i = question.min_val; i <= question.max_val; i++) {
    rangeVal.push(i);
  }

  return (
    <div className="flex justify-evenly">
      {rangeVal.map((num) => {
        return (
          <div className="flex flex-col gap-1 items-center justify-center">
            <input
              type="radio"
              name={`${question.id}`}
              id={`${question.id}-${num}`}
            />
            <label htmlFor={`${question.id}-${num}`}>{num}</label>
          </div>
        );
      })}
    </div>
  );
}
