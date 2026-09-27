import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useNavigate } from "react-router-dom";

// Definisikan tipe data untuk props (TypeScript)
export interface TryoutItem {
  name: string;
  topic: string;
  status: number;
  startTime: string;
  endTime: string;
  duration: string;
  date: string;
  location: string;
  link: string;
}

interface TryoutCardProps {
  item: TryoutItem;
}

export default function QuizItemCard({ item }: TryoutCardProps) {
  const navigate = useNavigate();
  function handleNavigate(location: string) {
    navigate(location);
  }

  let bg_color: string;
  let currentStatus: string;
  let actionBgColor: string;
  let actionText: string;

  switch (item.status) {
    case 1:
      bg_color = "bg-red-500";
      currentStatus = "Belum";
      actionBgColor = "bg-blue-400";
      actionText = "Mulai Test";
      break;
    case 2:
      bg_color = "bg-orange-300";
      currentStatus = "Sedang dinilai";
      actionBgColor = "bg-black/40";
      actionText = "Lihat Hasil";
      break;
    case 3:
      bg_color = "bg-green-600";
      currentStatus = "Selesai";
      actionBgColor = "bg-blue-400";
      actionText = "Lihat Hasil";
      break;
    default:
      bg_color = "bg-red-500";
      currentStatus = "Error";
      actionBgColor = "bg-black/40";
      actionText = "Error";
      break;
  }

  return (
    <div className="border border-black/10 rounded-lg flex overflow-hidden">
      {/* Garis Tebal Berwarna (warna menyesuaikan status) */}
      <div className={`w-2 ${bg_color}`}></div>

      {/* Container Info */}
      <div className="flex flex-col gap-2 p-4 pl-2 w-full">
        {/* Container Icon Assigment, Judul + Topik, Status */}
        <div className="flex justify-between">
          <div className="flex gap-2 items-center justify-center">
            {/* Icon */}
            <AssignmentIcon className="text-black/60 w-10! h-10!" />

            {/* Container Judul + Topik */}
            <div className="flex flex-col">
              <span className="font-semibold text-xl">{item.name}</span>
              <span>{item.topic}</span>
            </div>
          </div>
          {/* Status */}
          <span
            className={`text-white ${bg_color} h-fit px-4 pt-1 pb-1.5 flex justify-center items-center rounded-full text-xs`}
          >
            {currentStatus}
          </span>
        </div>

        {/* Container Icon Jam, startTime, endTime, duration, date icon, date */}
        <div className="flex justify-between items-center">
          {/* Container Waktu */}
          <div className="flex items-center gap-1 text-sm ">
            <AccessTimeFilledIcon className="text-black/60" />
            <span>
              {item.startTime} - {item.endTime} ( {item.duration} min )
            </span>
          </div>

          {/* Container Tanggal */}
          <div className="flex items-center gap-1 text-sm ">
            <CalendarMonthIcon className="text-black/60" />
            <span>{item.date}</span>
          </div>
        </div>

        {/* Container info lokasi dan tombol action */}
        <div className="flex justify-between items-center border-t border-black/40 pt-4">
          <span className="text-sm ">Lokasi: {item.location}</span>
          <button
            className={`text-sm rounded-lg px-4 py-2 text-white ${actionBgColor}`}
            onClick={() => {
              // Kalau case 1: belum, maka jika ini di klik user akan diarahkan ke quiz
              // kalau case 2: sedang dinilai, maka user tidak bisa menekan tombol ini
              // Kalau case 3: sudah selesai, maka jika ini di klik user akan diarahkan ke halaman lihat hasil
              switch(item.status) {
                case 1: handleNavigate("/quiz/1"); break; // sementara begini untuk mockup
                case 3: handleNavigate("/quiz_result/1"); break; //sementara begini untuk mockup 
              }
            }}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
}
