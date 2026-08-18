import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import XPadding from "../../../components/XPadding";
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
        {/* Container Nomor */}
        <div className="grid grid-cols-5 mt-8 gap-4 items-center justify-center justify-items-center">
          {quizData.questions.map((item, index) => {
            const isActive = currentQuestionIndex === item.question_number - 1;
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
      </XPadding>
    </div>
  );
}
