import Header from "../../components/Header";
import XPadding from "../../components/XPadding";


import { useNavigate } from "react-router-dom";

import { mapelLatihan } from "./data";

export default function LatihanSoal() {
  const navigate = useNavigate();
  return (
    <div>
      <Header title="Latihan Soal" />
      <XPadding className="mt-8">
        <h3 className="text-xl font-semibold">Mata Pelajaran</h3>

        {/* List Card Mata Pelajaran */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {mapelLatihan.map((item, index) => {
            return (
              <button
                className="flex flex-col p-4 border border-black/20 shadow rounded-lg justify-start"
                key={index}
                onClick={() => {
                  navigate(`/latihan-soal/mapel/${item.id}`);
                }}
              >
                {/* Icon */}
                <div
                  className={`${item.bgColor} ${item.color} w-fit p-2 rounded-sm`}
                >
                  <item.icon className="w-8! h-8!" />
                </div>

                {/* Title */}
                <span className="font-semibold mt-2 flex justify-start">
                  {item.name}
                </span>

                {/* Counter */}
                <div className="flex items-center gap-1.5 text-sm text-black/60">
                  <span>{item.topicCount} Bab</span>{" "}
                  <div className="bg-black/60 w-1 h-1 rounded-full"></div>
                  <span>{item.questionCount} Soal</span>
                </div>

                {/* Progress Bar */}
                <div className={`${item.bgColor} w-full h-1 rounded-full mt-2`}>
                  <div
                    className={`${item.bgColorFull} h-1 rounded-full`}
                    style={{
                      width: `${(item.questionSolved / item.questionCount) * 100}%`,
                    }}
                  ></div>
                </div>
              </button>
            );
          })}
        </div>
      </XPadding>
    </div>
  );
}
