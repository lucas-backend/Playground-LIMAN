import type { TrueFalseQuestion } from "../../../types";

interface Props {
  question: TrueFalseQuestion;
}

export default function TrueFalse({ question }: Props) {
  return (
    <div>
      <table className="border border-black/20 rounded-xl overflow-hidden">
        <tr>
          <th className="p-4">Pernyataan</th>
          <th className="p-4 text-center">
            <span className="mx-4">T</span>
            <span className="mx-4">F</span>
          </th>
        </tr>

        {question.question_table.map((item, index) => {
          return (
            <tr key={index}>
              <td className="p-4 ">{item.question}</td>
              <td className="text-center">
                <input
                  type="radio"
                  name={`${item.id}`}
                  id={`${item.id}`}
                  className="mx-4"
                />
                <input
                  type="radio"
                  name={`${item.id}`}
                  id={`${item.id}`}
                  className="mx-4"
                />
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
