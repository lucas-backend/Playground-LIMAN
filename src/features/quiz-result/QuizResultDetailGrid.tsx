import React from "react";
import { useNavigate } from "react-router-dom";

// Menentukan tipe status jawaban
type AnswerStatus = "correct" | "wrong" | "empty";

export interface AnswerItem {
  number: number;
  status: AnswerStatus;
}

interface AnswerDetailGridProps {
  answers: AnswerItem[];
}

export const AnswerDetailGrid: React.FC<AnswerDetailGridProps> = ({
  answers,
}) => {
  // Fungsi helper untuk menentukan warna background berdasarkan status
  const getStatusBgColor = (status: AnswerStatus): string => {
    switch (status) {
      case "correct":
        return "bg-green-600"; // Hijau untuk Benar
      case "wrong":
        return "bg-red-500"; // Merah untuk Salah
      case "empty":
        return "bg-amber-500"; // Oranye/Kuning untuk Kosong
      default:
        return "bg-gray-400";
    }
  };

  const navigate = useNavigate();

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg">
      {/* Judul Bagian */}
      <h3 className="text-gray-800 mb-4 text-left font-semibold">
        Lihat Detail Jawaban
      </h3>

      {/* Grid Kontainer: Otomatis membuat 10 kolom pada layar kecil ke atas */}
      <div className="grid grid-cols-10 gap-1 justify-items-center">
        {answers.map((item) => (
          <button
            key={item.number}
            className={`w-7 h-7 flex items-center justify-center text-white font-semibold rounded-md shadow-sm transition-transform duration-200 hover:scale-105 ${getStatusBgColor(
              item.status,
            )}`}
            onClick={() => {
              navigate("/quiz_result/1/details")
            }}
          >
            {item.number}
          </button>
        ))}
      </div>
    </div>
  );
};
