import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import type { QuizData } from "../types";

interface Props {
  quiz: QuizData;
  questionIndex: number;
}

export default function QuizIndicator({ quiz, questionIndex }: Props) {
  return (
    <div className="text-black/50 flex justify-between items-center text-lg mt-4">
      <span className="flex items-center gap-1">
        <InsertDriveFileRoundedIcon />
        Soal {`${questionIndex + 1} / ${quiz.questions.length}`}
      </span>
      <div className="block items-center gap-1">
        {/* <AccessTimeRoundedIcon /> */}
        {/* <p className="text-end">Waktu Mulai: {`${quiz.startTime}`}</p> */}
        <p className="text-end">Waktu Selesai: {`${quiz.endTime}`}</p>
      </div>
    </div>
  );
}
