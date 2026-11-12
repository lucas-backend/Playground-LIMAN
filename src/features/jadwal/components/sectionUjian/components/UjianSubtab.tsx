import { useLocation, useNavigate } from "react-router-dom";
import ScheduleList from "../../ScheduleList";

const ujianSubTab = [
  { name: "Ulangan Harian", link: "/jadwal-siswa/ujian/ulangan-harian" },
  { name: "PTS", link: "/jadwal-siswa/ujian/pts" },
  { name: "PAS", link: "/jadwal-siswa/ujian/pas" },
];

export default function UjianSubtab() {
  const location = useLocation();
  const navigate = useNavigate();

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

      <ScheduleList kind="ujian" />
    </>
  );
}
