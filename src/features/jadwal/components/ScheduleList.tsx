import { useQuery } from "@tanstack/react-query";
import { ApiErrorState, EmptyState } from "../../../shared/components/ApiState";
import { apiErrorMessage } from "../../../shared/components/apiErrorMessage";
import { queryKeys } from "../../../shared/server-state/queryKeys";
import { listSchedules, type ScheduleKind } from "../api/schedulesApi";

interface Props {
  kind: ScheduleKind;
}

export default function ScheduleList({ kind }: Props) {
  const filters = { kind };
  const schedules = useQuery({
    queryKey: queryKeys.schedule.list(filters),
    queryFn: () => listSchedules(filters),
  });

  if (schedules.isLoading) return <p className="mt-6 text-sm text-gray-500">Memuat jadwal...</p>;
  if (schedules.isError) {
    return (
      <div className="mt-4">
        <ApiErrorState error={schedules.error} onRetry={() => void schedules.refetch()} />
        <p className="mt-1 text-xs text-gray-500">{apiErrorMessage(schedules.error)}</p>
      </div>
    );
  }

  const items = schedules.data?.items ?? [];
  if (items.length === 0) return <div className="mt-4"><EmptyState>Tidak ada jadwal.</EmptyState></div>;

  return (
    <div className="mt-4 flex flex-col gap-3">
      {items.map((item) => (
        <article key={item.id} className="rounded-lg border border-black/10 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">{item.startTime} - {item.endTime}</h3>
            <span className="text-xs text-gray-500">Hari ke-{item.dayOfWeek}</span>
          </div>
          <p className="mt-2 text-sm">Kelas: {item.classId}</p>
          <p className="text-sm">Mata pelajaran: {item.subjectId}</p>
          {item.teacherUserId && <p className="text-sm">Guru: {item.teacherUserId}</p>}
          <p className="mt-2 text-xs text-gray-500">ID jadwal: {item.id}</p>
        </article>
      ))}
    </div>
  );
}
