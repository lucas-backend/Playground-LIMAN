import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiErrorState, EmptyState } from "../../../shared/components/ApiState";
import { apiErrorMessage } from "../../../shared/components/apiErrorMessage";
import { queryKeys } from "../../../shared/server-state/queryKeys";
import { useAppMutation } from "../../../shared/server-state/useAppMutation";
import {
  createSchedule,
  deleteSchedule,
  listSchedules,
  updateSchedule,
  type Schedule,
  type ScheduleInput,
  type ScheduleKind,
} from "../api/schedulesApi";

const initialForm: ScheduleInput = {
  classId: "",
  subjectId: "",
  dayOfWeek: 1,
  startTime: "07:00",
  endTime: "08:00",
  kind: "pelajaran",
};

export default function ScheduleAdminPanel() {
  const [form, setForm] = useState<ScheduleInput>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState<unknown>(null);
  const schedules = useQuery({
    queryKey: queryKeys.schedule.list(),
    queryFn: () => listSchedules(),
  });
  const invalidateKeys = [queryKeys.schedule.all] as const;
  const createMutation = useAppMutation(createSchedule, {
    invalidateKeys,
    onSuccess: () => {
      setForm(initialForm);
      setNotice("Jadwal berhasil dibuat.");
      setError(null);
    },
    onError: setError,
  });
  const updateMutation = useAppMutation(
    ({ id, body }: { id: string; body: ScheduleInput }) => updateSchedule(id, body),
    {
      invalidateKeys,
      onSuccess: () => {
        setEditingId(null);
        setForm(initialForm);
        setNotice("Jadwal berhasil diperbarui.");
        setError(null);
      },
      onError: setError,
    },
  );
  const deleteMutation = useAppMutation(deleteSchedule, {
    invalidateKeys,
    onSuccess: () => {
      setNotice("Jadwal berhasil dihapus.");
      setError(null);
    },
    onError: setError,
  });
  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  function setField<K extends keyof ScheduleInput>(field: K, value: ScheduleInput[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setError(null);
    if (form.endTime <= form.startTime) {
      setError(new Error("Waktu selesai harus setelah waktu mulai."));
      return;
    }
    if (editingId) updateMutation.mutateOnce({ id: editingId, body: form });
    else createMutation.mutateOnce(form);
  }

  function edit(item: Schedule) {
    setEditingId(item.id);
    setForm({
      classId: item.classId,
      subjectId: item.subjectId,
      teacherUserId: item.teacherUserId ?? undefined,
      dayOfWeek: item.dayOfWeek,
      startTime: item.startTime,
      endTime: item.endTime,
      kind: item.kind,
    });
    setError(null);
  }

  function remove(item: Schedule) {
    if (!window.confirm(`Hapus jadwal ${item.id}?`)) return;
    setNotice("");
    deleteMutation.mutateOnce(item.id);
  }

  return (
    <section className="mt-6 rounded-lg border bg-white p-5 shadow-sm">
      <h2 className="font-semibold">Jadwal</h2>
      <p className="mt-1 text-xs text-gray-500">CRUD jadwal tersedia untuk admin. ID jadwal menggunakan UUID backend.</p>
      {notice && <p className="mt-3 rounded bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
      {Boolean(error) && <div className="mt-3"><ApiErrorState error={error} /><p className="mt-1 text-xs text-gray-500">{apiErrorMessage(error)}</p></div>}
      <form onSubmit={submit} className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <input required value={form.classId} onChange={(event) => setField("classId", event.target.value)} placeholder="UUID kelas" className="rounded border p-2 text-sm" />
        <input required value={form.subjectId} onChange={(event) => setField("subjectId", event.target.value)} placeholder="UUID mata pelajaran" className="rounded border p-2 text-sm" />
        <input value={form.teacherUserId ?? ""} onChange={(event) => setField("teacherUserId", event.target.value || undefined)} placeholder="UUID guru (opsional)" className="rounded border p-2 text-sm" />
        <select value={form.kind} onChange={(event) => setField("kind", event.target.value as ScheduleKind)} className="rounded border p-2 text-sm">
          <option value="pelajaran">Pelajaran</option>
          <option value="ujian">Ujian</option>
          <option value="tryout">Tryout</option>
        </select>
        <input required min={1} max={7} type="number" value={form.dayOfWeek} onChange={(event) => setField("dayOfWeek", Number(event.target.value))} placeholder="Hari (1-7)" className="rounded border p-2 text-sm" />
        <input required type="time" value={form.startTime} onChange={(event) => setField("startTime", event.target.value)} className="rounded border p-2 text-sm" />
        <input required type="time" value={form.endTime} onChange={(event) => setField("endTime", event.target.value)} className="rounded border p-2 text-sm" />
        <div className="flex gap-2">
          <button disabled={isMutating} className="rounded bg-blue-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {isMutating ? "Menyimpan..." : editingId ? "Simpan perubahan" : "Tambah jadwal"}
          </button>
          {editingId && <button type="button" disabled={isMutating} onClick={() => { setEditingId(null); setForm(initialForm); }} className="rounded border px-3 py-2 text-sm">Batal</button>}
        </div>
      </form>
      <div className="mt-5 space-y-2">
        {schedules.isLoading && <p className="text-sm text-gray-500">Memuat jadwal...</p>}
        {schedules.isError && <ApiErrorState error={schedules.error} onRetry={() => void schedules.refetch()} />}
        {!schedules.isLoading && !schedules.isError && (schedules.data?.items.length ?? 0) === 0 && <EmptyState>Tidak ada jadwal.</EmptyState>}
        {schedules.data?.items.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center gap-2 border-b py-2 text-sm">
            <span className="mr-auto">{item.kind} · {item.startTime}-{item.endTime} · {item.id}</span>
            <button disabled={isMutating} onClick={() => edit(item)} className="text-blue-600 underline disabled:opacity-50">Ubah</button>
            <button disabled={isMutating} onClick={() => remove(item)} className="text-red-600 underline disabled:opacity-50">Hapus</button>
          </div>
        ))}
      </div>
    </section>
  );
}
