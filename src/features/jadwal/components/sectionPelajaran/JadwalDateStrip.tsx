import type { JadwalDate } from "../../model/jadwal";

interface Props {
  dates: readonly JadwalDate[];
}

export default function JadwalDateStrip({ dates }: Props) {
  return (
    <div className="mt-4 flex justify-between">
      <div className="flex gap-2">
        {dates.map((item) => (
          <button
            key={`${item.day}-${item.date}`}
            className={`flex min-w-14 flex-col items-center justify-center rounded-lg border border-black/20 py-2 text-blue-400 ${item.isActive ? "bg-blue-400 text-white" : ""}`}
          >
            <span>{item.day}</span>
            <span className="font-bold">{item.date}</span>
            <div
              className={`mt-2 h-2 w-2 rounded-full ${item.isActive ? "bg-white" : "bg-blue-400"}`}
            />
          </button>
        ))}
      </div>

      <button className="p-4 text-blue-400">
        Lebih
        <br />
        Lengkap
      </button>
    </div>
  );
}
