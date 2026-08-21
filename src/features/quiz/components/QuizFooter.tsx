import type { Dispatch, SetStateAction } from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import XPadding from "../../../components/XPadding";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  quizLength: number;
  currentQuestionIndex: number;
  setQuestionIndex: Dispatch<SetStateAction<number>>;
}

export default function QuizFooter({
  quizLength,
  currentQuestionIndex,
  setQuestionIndex,
}: Props) {
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === quizLength - 1;

  const navigate = useNavigate();
  const location = useLocation();

  function handlePrev() {
    setQuestionIndex((prev) => Math.max(prev - 1, 0));
  }

  function handleNext() {
    setQuestionIndex((prev) => Math.min(prev + 1, quizLength - 1));
  }

  return (
    <div className="bg-blue-500 text-white py-8 fixed bottom-0 w-full">
      <XPadding>
        <div className="grid grid-cols-3 w-full justify-between items-center">
          {/* Tombol Sebelumnya */}
          <button
            onClick={handlePrev}
            disabled={isFirstQuestion}
            className="flex items-center justify-center"
          >
            <span
              className={`flex items-center justify-center ${isFirstQuestion ? "hidden" : ""}`}
            >
              <ChevronLeftRoundedIcon className="w-8! h-8!" />
              Sebelumnya
            </span>
          </button>

          {/* Tombol ke Komponen Navigasi Soal */}
          <button className="flex flex-col sm:flex-row justify-center items-center pt-2 pl-6" onClick={() => {
            navigate(location.pathname + "/navigation");
          }}>
            <FormatListBulletedRoundedIcon className="w-6! h-6! mb-1 mr-1" />
            {/* <span>Daftar Soal</span> */}
          </button>

          {/* Tombol Selanjutnya */}
          <button
            onClick={handleNext}
            disabled={isLastQuestion}
            className="flex items-center justify-center"
          >
            {isLastQuestion ? "Selesai" : "Selanjutnya"}
            <ChevronRightRoundedIcon className="w-8! h-8! order-1" />
          </button>
        </div>
      </XPadding>
    </div>
  );
}
