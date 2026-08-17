import QuizItemCard from "../QuizItemCard";

const ujianSubTab = [
  {
    name: "Ulangan Harian",
    link: "/jadwal-siswa/ujian/ulangan-harian",
    isActive: true,
  },
  { name: "PTS", link: "/jadwal-siswa/ujian/pts" },
  { name: "PAS", link: "/jadwal-siswa/ujian/pas" },
];

const listJadwalUH = [
  {
    name: "Ulangan Harian",
    topic: "Bahasa Inggris",
    status: 1,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
  {
    name: "Ulangan Harian",
    topic: "Matematika",
    status: 2,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
  {
    name: "Ulangan Harian",
    topic: "Biologi",
    status: 3,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
];

export default function UjianTab() {
  return (
    <>
      {/* Sub Tab Button */}
      <div className="mt-4 flex gap-2">
        {ujianSubTab.map((item, index) => {
          return (
            <button
              className={`rounded-full border border-black/15 justify-center flex-1 py-1 font-semibold ${index == 0 && "flex-2"} ${item.isActive && "bg-blue-400/25"}`}
              key={index}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      {/* List jadwal */}
      <div className="flex flex-col gap-4 mt-4">
        {listJadwalUH.map((item, index) => (
          <QuizItemCard item={item} key={index} />
        ))}
      </div>
    </>
  );
}
