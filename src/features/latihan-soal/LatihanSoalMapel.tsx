import { useParams } from "react-router-dom";

import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import { mapelLatihan } from "./data";
import { latihanSoalMapel } from "./data";
import QuizItemCard from "@/shared/components/ui/QuizItemCard";

export default function LatihanSoalMapel() {
  const { id } = useParams();
  const mapel = mapelLatihan.filter((item) => item.id == id)[0];

  return (
    <div className="">
      <Header title="Latihan Soal" />
      <XPadding className="pt-8">
        {/* kotak title mapel berwarna */}
        <div
          className={`flex items-center justify-start p-4 rounded-lg gap-4 ${mapel.bgColorFull}`}
        >
          {/* Icon */}
          <div
            className={`rounded-lg bg-white/50 text-white p-2 flex items-center justify-center`}
          >
            {<mapel.icon className="w-8! h-8!" />}
          </div>

          {/* Title & Number Info */}
          <div className="text-white flex flex-col justify-center pb-1">
            <h3 className="font-semibold text-xl">{mapel.name}</h3>
            <span>
              {mapel.topicCount} Bab - {mapel.questionCount} Soal
            </span>
          </div>
        </div>

        {/* 2 tombol */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <button className="cursor-pointer pt-0.5 pb-1 flex items-center justify-center border border-black/15 rounded-full bg-blue-400/25">
            Latihan Soal
          </button>
          <button className="cursor-pointer pt-0.5 pb-1 flex items-center justify-center border border-black/15 rounded-full hover:bg-blue-400/25">
            Riwayat
          </button>
        </div>

        {/* List latihan soal */}
        <div className="flex flex-col gap-4 mt-4">
          {/* <QuizItemCard item={item} key={index} /> */}
          {latihanSoalMapel.map((item, index) => {
            return <QuizItemCard item={item} key={index} />;
          })}
        </div>
      </XPadding>
    </div>
  );
}
