import Header from "@/shared/components/layout/Header";
import AssignmentIcon from "@mui/icons-material/Assignment";
import XPadding from "@/shared/components/layout/XPadding";
import { QuizResultCard } from "./QuizResultCard";
import { AnswerDetailGrid, type AnswerItem } from "./QuizResultDetailGrid";

const name = "Ulangan Harian";
const subject = "Bahasa Inggris";
const tanggal = "10 Januari 2026";

const examAnswers: AnswerItem[] = [
    { number: 1, status: 'correct' },
    { number: 2, status: 'correct' },
    { number: 3, status: 'empty' },
    { number: 4, status: 'correct' },
    { number: 5, status: 'correct' },
    { number: 6, status: 'correct' },
    { number: 7, status: 'correct' },
    { number: 8, status: 'wrong' },
    { number: 9, status: 'correct' },
    { number: 10, status: 'correct' },
    { number: 11, status: 'correct' },
    { number: 12, status: 'correct' },
    { number: 13, status: 'correct' },
    { number: 14, status: 'wrong' },
    { number: 15, status: 'correct' },
    { number: 16, status: 'correct' },
    { number: 17, status: 'correct' },
    { number: 18, status: 'empty' },
    { number: 19, status: 'correct' },
    { number: 20, status: 'correct' },
  ];

export default function QuizResult() {

  return (
    <div>
      <Header title={"Hasil " + name} />
      <XPadding className="pt-8">
        <div className="flex gap-2 items-center">
          {/* Icon */}
          <AssignmentIcon className="text-yellow-500 text-6xl!" />

          {/* Quiz Info */}
          <div className="flex flex-col justify-center pb-2">
            <h3 className="text-lg font-semibold">{name}</h3>
            <span>
              {subject} • {tanggal}
            </span>
          </div>
        </div>

        {/* Quiz Result Diagram */}
        <div className="mt-8">
          <QuizResultCard
            score={85}
            totalScore={100}
            correctCount={18}
            wrongCount={2}
            emptyCount={2}
          />
        </div>

        {/* lihat detail jawaban */}
        <div className="mt-8">
          <AnswerDetailGrid answers={examAnswers} />
        </div>
      </XPadding>
    </div>
  );
}
