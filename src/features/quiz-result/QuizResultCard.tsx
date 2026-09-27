import React from 'react';

// Menentukan tipe data props untuk keamanan TypeScript
interface QuizResultCardProps {
  score: number;
  totalScore: number;
  correctCount: number;
  wrongCount: number;
  emptyCount: number;
}

export const QuizResultCard: React.FC<QuizResultCardProps> = ({
  score = 85,
  totalScore = 100,
  correctCount = 18,
  wrongCount = 2,
  emptyCount = 2,
}) => {
  // Menghitung keliling lingkaran SVG (2 * pi * r) -> r = 40
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.2
  
  // Menghitung persentase dan offset untuk progress bar
  const percentage = Math.min(Math.max(score / totalScore, 0), 1);
  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-300 w-full max-w-sm text-center">
      
      {/* Lingkaran Progress & Angka Nilai */}
      <div className="relative flex items-center justify-center w-48 h-48 mx-auto mb-6">
        
        {/* Elemen SVG */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Lingkaran Background (Biru Muda) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#bfdbfe" // Tailind bg-blue-200 warna dasar
            strokeWidth="8"
            fill="transparent"
          />
          {/* Lingkaran Progress Aktif (Biru Tua) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#3b82f6" // Tailwind text-blue-500
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        
        {/* Teks Angka di Tengah Lingkaran */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-blue-600 tracking-wide">{score}/</span>
          <span className="text-3xl font-semibold text-gray-500 mt-1">{totalScore}</span>
        </div>
      </div>

      {/* Garis Pembatas (Divider) */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* Statistik Detail (Grid 3 Kolom) */}
      <div className="grid grid-cols-3 gap-2">
        {/* Benar */}
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-green-600 mb-1">{correctCount}</span>
          <span className="text-sm font-normal text-gray-700">Benar</span>
        </div>
        {/* Salah */}
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-red-600 mb-1">{wrongCount}</span>
          <span className="text-sm font-normal text-gray-700">Salah</span>
        </div>
        {/* Kosong */}
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-amber-500 mb-1">{emptyCount}</span>
          <span className="text-sm font-normal text-gray-700">Kosong</span>
        </div>
      </div>

    </div>
  );
};
