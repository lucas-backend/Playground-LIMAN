import ScheduleList from "../ScheduleList";

export default function TryoutTab() {
  return (
    <>
      <div className="mt-4 flex justify-between gap-4">
        <button className="flex-1 rounded-full border border-black/10 bg-blue-400/25 py-1">
          Jadwal Try Out
        </button>
        <button className="flex-1 rounded-full border border-black/10 py-1">
          Riwayat
        </button>
      </div>
      <ScheduleList kind="tryout" />
    </>
  );
}
