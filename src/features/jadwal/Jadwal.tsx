import Header from "../../components/Header";
import XPadding from "../../components/XPadding";

// Icon
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CreateIcon from "@mui/icons-material/Create";

import CalculateIcon from '@mui/icons-material/Calculate';
import TranslateIcon from '@mui/icons-material/Translate';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';

const tab_item = [
  {
    icon: <MenuBookIcon />,
    name: "Pelajaran",
    isActive: true,
  },
  {
    icon: <AssignmentIcon />,
    name: "Try Out",
  },
  {
    icon: <CreateIcon />,
    name: "Ujian",
  },
];

const tanggal_item = [
  {
    day: "Sen",
    date: 29,
  },
  {
    day: "Sel",
    date: 30,
    isActive: true,
  },
  {
    day: "Rab",
    date: 31,
  },
  {
    day: "Kam",
    date: 1,
  },
];

const list_jadwal = [
  {
    icon: <CalculateIcon/>,
    name: "Matematika",
    subject: "Bab 3 - Turunan & Integral",
    time: "07:00",
    duration: 90,
    color: "text-[#46a634]",
    bgColor: "bg-[#46a634]/30"
  },
  {
    icon: <TranslateIcon/>,
    name: "Bahasa Inggris",
    subject: "Bab 2 - Simple Past Tense",
    time: "09:00",
    duration: 45,
    color: "text-[#a2adff]",
    bgColor: "bg-[#a2adff]/30"
  },
  {
    icon: <CoronavirusIcon/>,
    name: "Biologi",
    subject: "Bab 3 - Anatomi Tumbuhan",
    time: "11:00",
    duration: 90,
    color: "text-[#2d9cdb]",
    bgColor: "bg-[#2d9cdb]/30"
  },
];

export default function Jadwal() {
  return (
    <div>
      <Header title="Jadwal" />

      <XPadding className="mt-4 mb-8">
        {/* Tab Halaman */}
        <div className="grid grid-cols-3 gap-4">
          {tab_item.map((item, index) => {
            return (
              <button
                key={index}
                className={`p-4 flex flex-col items-center justify-center border border-black/15 rounded-lg cursor-pointer hover:bg-blue-400/25 ${item.isActive ? "bg-blue-400/25" : ""} `}
              >
                {item.icon}
                <span className="font-semibold">{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tombol Tanggal */}
        <div className="flex justify-between mt-4">
          <div className="flex gap-2">
            {tanggal_item.map((item, index) => {
              return (
                <button
                  key={index}
                  className={` flex flex-col py-2 min-w-14 border
                     border-black/20 rounded-lg justify-center items-center text-blue-400 ${item.isActive && "bg-blue-400 text-white"}`}
                >
                  <span>{item.day}</span>
                  <span className="font-bold">{item.date}</span>
                  <div
                    className={`mt-2 h-2 w-2 rounded-full ${item.isActive ? "bg-white" : "bg-blue-400"}`}
                  ></div>
                </button>
              );
            })}
          </div>

          <button className="p-4 text-blue-400">
            Lebih
            <br />
            Lengkap
          </button>
        </div>

        {/* List Jadwal */}
        <h3 className="mt-4 font-semibold text-xl">Hari ini</h3>
        <div className="flex flex-col gap-4 mt-4">
          {list_jadwal.map((item, index) => {
            return (
              <div
                key={index}
                className="border border-black/10 p-4 rounded-lg flex justify-between items-center"
              >
                <div className="flex items-center">
                  <div className={`${item.bgColor} ${item.color} w-12 h-12 rounded-lg mr-4 flex items-center justify-center`}>{item.icon}</div>
                  <div className="flex flex-col mr-4">
                    <span className="font-semibold text-xl">{item.name}</span>
                    <span>{item.subject}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="font-semibold">{item.time}</span>
                  <span>{item.duration}min</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* List Jadwal 2*/}
        <h3 className="mt-4 font-semibold text-xl">Besok</h3>
        <div className="flex flex-col gap-4 mt-4">
          {list_jadwal.map((item, index) => {
            return (
              <div
                key={index}
                className="border border-black/10 p-4 rounded-lg flex justify-between items-center"
              >
                <div className="flex items-center">
                  <div className={`${item.bgColor} ${item.color} w-12 h-12 rounded-lg mr-4 flex items-center justify-center`}>{item.icon}</div>
                  <div className="flex flex-col mr-4">
                    <span className="font-semibold text-xl">{item.name}</span>
                    <span>{item.subject}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="font-semibold">{item.time}</span>
                  <span>{item.duration}min</span>
                </div>
              </div>
            );
          })}
        </div>
      </XPadding>
    </div>
  );
}
