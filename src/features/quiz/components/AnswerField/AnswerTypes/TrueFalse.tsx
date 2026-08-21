import { useQuizContext } from "../../../hook";
import type { TrueFalseQuestion } from "../../../types";
import { replaceBooleanAtIndex } from "../../../utils";

interface Props {
  question: TrueFalseQuestion;
}

export default function TrueFalse({ question }: Props) {
  const { quizProgress, updateUserAnswer } = useQuizContext();
  const savedAnswer = quizProgress.responses[question.id]?.userAnswer;
  const selectedAnswers =
    Array.isArray(savedAnswer) &&
    savedAnswer.every((value) => typeof value === "boolean")
      ? savedAnswer
      : [];

  return (
    <div className="border border-black/50 rounded-xl overflow-hidden">
      <table className="">
        <thead className="bg-blue-400 text-white">
          <tr>
            <th className="p-4 text-center border-r border-black/20">Pernyataan</th>
            <th className="p-4 text-center border-r border-black/20">
              <span className="">Benar</span>
            </th>
            <th className="p-4 text-center">
              <span className="">Salah</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {question.question_table.map((item, index) => {
            const selectedValue = selectedAnswers[index];

            return (
              <tr key={index}  className={`border-t border-black/20`}>
                <td className="p-4 border-r border-black/20">{item.question}</td>
                <td className="text-center border-r border-black/20">
                  <input
                    type="radio"
                    name={`${question.id}-${item.id}`}
                    id={`${question.id}-${item.id}-true`}
                    className=""
                    checked={selectedValue === true}
                    onChange={() => {
                      const nextSelection = replaceBooleanAtIndex(
                        selectedAnswers,
                        index,
                        true,
                      );

                      updateUserAnswer(
                        question.id,
                        question.type,
                        nextSelection,
                      );
                    }}
                  />
                </td>
                <td className="text-center ">
                  <input
                    type="radio"
                    name={`${question.id}-${item.id}`}
                    id={`${question.id}-${item.id}-false`}
                    className=""
                    checked={selectedValue === false}
                    onChange={() => {
                      const nextSelection = replaceBooleanAtIndex(
                        selectedAnswers,
                        index,
                        false,
                      );

                      updateUserAnswer(
                        question.id,
                        question.type,
                        nextSelection,
                      );
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
