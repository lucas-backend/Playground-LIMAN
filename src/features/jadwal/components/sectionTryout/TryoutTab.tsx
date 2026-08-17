import QuizItemCard from "../QuizItemCard";

const listJadwalTryout = [
  {
    name: "Try Out Nasional",
    topic: "UTBK SOSHUM",
    status: 1,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
  {
    name: "Try Out Nasional",
    topic: "UTBK SOSHUM",
    status: 2,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
  {
    name: "Try Out Nasional",
    topic: "UTBK SOSHUM",
    status: 3,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
];

export default function TryoutTab() {
  return (
    <>
      {/* 2 button container */}
      <div className="flex gap-4 justify-between mt-4">
        <button className="py-1 border border-black/10 rounded-full flex justify-center items-center flex-1 bg-blue-400/25">
          Jadwal Try Out
        </button>
        <button className="py-1 border border-black/10 rounded-full flex justify-center items-center flex-1">
          Riwayat
        </button>
      </div>

      {/* List Jadwal */}
      <div className="flex flex-col gap-4 mt-4">
        {listJadwalTryout.map((item, index) => (
          <QuizItemCard item={item} key={index} />
        ))}
      </div>
    </>
  );
}
