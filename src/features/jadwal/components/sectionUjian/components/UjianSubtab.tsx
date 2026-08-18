import { useLocation, useNavigate } from "react-router-dom";
import QuizItemCard from "../../../../../components/QuizItemCard";

const ujianSubTab = [
  { name: "Ulangan Harian", link: "/jadwal-siswa/ujian/ulangan-harian" },
  { name: "PTS", link: "/jadwal-siswa/ujian/pts" },
  { name: "PAS", link: "/jadwal-siswa/ujian/pas" },
];

const listJadwal = [
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
  {
    name: "PTS",
    topic: "Biologi",
    status: 1,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
  {
    name: "PTS",
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
    name: "PTS",
    topic: "Bahasa Inggris",
    status: 3,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
  {
    name: "PAS",
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
    name: "PAS",
    topic: "Kimia",
    status: 2,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
  {
    name: "PAS",
    topic: "Matematika",
    status: 3,
    startTime: "07:00",
    endTime: "08:30",
    duration: "90",
    date: "10 Januari 2026",
    location: "Online",
    link: "#",
  },
];

export default function UjianSubtab() {
  const location = useLocation();
  const navigate = useNavigate();

  const lastPath = location.pathname.split("/").pop();
  let itemTarget: string;

  if (lastPath == "ulangan-harian") itemTarget = "Ulangan Harian";
  if (lastPath == "pts") itemTarget = "PTS";
  if (lastPath == "pas") itemTarget = "PAS";

  return (
    <>
      {/* Sub Tab Button */}
      <div className="mt-4 flex gap-2">
        {ujianSubTab.map((item, index) => {
          return (
            <button
              className={`rounded-full border border-black/15 justify-center flex-1 py-1 font-semibold ${index == 0 && "flex-2"} ${location.pathname == item.link && "bg-blue-400/25"} cursor-pointer hover:bg-blue-400/25`}
              key={index}
              onClick={() => navigate(item.link)}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      {/* List jadwal */}
      <div className="flex flex-col gap-4 mt-4">
        {listJadwal
          .filter((item) => item.name == itemTarget)
          .map((item, index) => (
            <QuizItemCard item={item} key={index} />
          ))}
      </div>
    </>
  );
}
