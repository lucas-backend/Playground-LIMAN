import React from 'react';

// Tipe data untuk status jawaban (benar atau salah)
type AnswerStatus = 'correct' | 'wrong';

interface QuestionItem {
  id: number;
  questionNumber: string;
  questionText: string;
  userAnswer: string;
  status: AnswerStatus;
}

interface QuestionReviewListProps {
  questions: QuestionItem[];
}

export const QuestionReviewList: React.FC<QuestionReviewListProps> = ({ questions }) => {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4">
      {questions.map((item) => {
        const isCorrect = item.status === 'correct';

        return (
          <div 
            key={item.id} 
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col"
          >
            {/* Bagian Atas: Nomor Soal & Teks Pertanyaan */}
            <div className="p-5 flex flex-col text-left">
              <span className="text-sm font-normal text-gray-400 mb-2">
                {item.questionNumber}
              </span>
              <p className="text-gray-800 text-base leading-relaxed font-normal">
                {item.questionText}
              </p>
            </div>

            {/* Bagian Bawah: Jawaban User & Indikator Status */}
            <div 
              className={`px-5 py-3.5 flex items-center justify-between text-white font-medium ${
                isCorrect ? 'bg-green-600' : 'bg-red-500'
              }`}
            >
              <span className="text-base tracking-wide truncate pr-4">
                {item.userAnswer}
              </span>
              
              {/* Icon Checkmark atau Cross Bulat */}
              <div className="shrink-0 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                {isCorrect ? (
                  // Icon Check (Centang) untuk Benar
                  <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  // Icon Cross (Silang) untuk Salah
                  <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
