import { useNavigate } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import { useQuizContext } from "../hook";

export default function QuizQuestionList() {
  const {
    quizData,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    quizProgress,
  } = useQuizContext();

  const navigate = useNavigate();

  return (
    <div>
      <Header title={quizData.title} />
      <XPadding>
        <div className="flex flex-col justify-between min-h-[85vh] w-full">
          {/* Container Nomor */}
          <div className="grid grid-cols-5 mt-8 gap-4 items-center justify-center justify-items-center">
            {quizData.questions.map((item, index) => {
              const isActive =
                currentQuestionIndex === item.question_number - 1;
              const isCompleted = quizProgress.responses[item.id]?.isCompleted;

              let bgColorClass = "bg-gray-400"; // Default: abu-abu (belum dijawab)
              if (isActive) {
                bgColorClass = "bg-amber-500"; // Sedang aktif
              } else if (isCompleted) {
                bgColorClass = "bg-green-500"; // Sudah dijawab
              }
              return (
                <button
                  className={`flex w-12 h-12 text-2xl justify-center items-center  text-white font-semibold rounded-lg ${bgColorClass}`}
                  key={index}
                  onClick={() => {
                    setCurrentQuestionIndex(item.question_number - 1);
                    navigate(-1);
                  }}
                >
                  {item.question_number}
                </button>
              );
            })}
          </div>

          <button className="flex items-center justify-center font-semibold text-xl text-white rounded-lg botton-0 pt-1.5 pb-2 w-full bg-blue-400">
            SELESAIKAN
          </button>
        </div>
      </XPadding>
    </div>
  );
}
