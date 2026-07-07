import type { Dispatch, SetStateAction } from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import XPadding from "../../../components/XPadding";

interface Props {
  quizLength: number;
  setQuestionIndex: Dispatch<SetStateAction<number>>;
}

export default function QuizFooter({ quizLength, setQuestionIndex }: Props) {
  function handlePrev() {
    setQuestionIndex((prev) => Math.max(prev - 1, 0));
  }

  function handleNext() {
    setQuestionIndex((prev) => Math.min(prev + 1, quizLength - 1));
  }

  return (
    <div className="bg-blue-500 text-white py-8 fixed bottom-0 w-full">
      <XPadding>
        <div className="flex w-full justify-between items-center">
          {/* Tombol Sebelumnya */}
          <button onClick={handlePrev}>
            <ChevronLeftRoundedIcon className="w-8! h-8!" />
            Sebelumnya
          </button>

          {/* Tombol ke Komponen Navigasi Soal */}
          <button className="flex flex-col sm:flex-row justify-center items-center">
            <FormatListBulletedRoundedIcon className="w-6! h-6! mb-1 mr-1" />
            <span>Daftar Soal</span>
          </button>

          {/* Tombol Selanjutnya */}
          <button onClick={handleNext} className="">
            Selanjutnya
            <ChevronRightRoundedIcon className="w-8! h-8! order-1" />
          </button>
        </div>
      </XPadding>
    </div>
  );
}
