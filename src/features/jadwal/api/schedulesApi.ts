import { request } from "../../../shared/api/client";

export type ScheduleKind = "pelajaran" | "ujian" | "tryout";

export interface Schedule {
  id: string;
  classId: string;
  subjectId: string;
  teacherUserId?: string | null;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  kind: ScheduleKind;
}

export interface ScheduleListResponse {
  items: Schedule[];
  page?: number;
  pageSize?: number;
  total?: number;
}

export interface ScheduleFilters {
  classId?: string;
  subjectId?: string;
  kind?: ScheduleKind;
  dayOfWeek?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface ScheduleInput {
  classId: string;
  subjectId: string;
  teacherUserId?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  kind: ScheduleKind;
}

export type ScheduleUpdate = Partial<ScheduleInput>;

function query(params: ScheduleFilters): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const result = search.toString();
  return result ? `?${result}` : "";
}

export function listSchedules(filters: ScheduleFilters = {}): Promise<ScheduleListResponse> {
  return request<ScheduleListResponse>(`/schedules${query(filters)}`);
}

export function createSchedule(body: ScheduleInput): Promise<Schedule> {
  return request<Schedule, ScheduleInput>("/schedules", { method: "POST", body });
}

export function updateSchedule(scheduleId: string, body: ScheduleUpdate): Promise<Schedule> {
  return request<Schedule, ScheduleUpdate>(
    `/schedules/${encodeURIComponent(scheduleId)}`,
    { method: "PUT", body },
  );
}

export function deleteSchedule(scheduleId: string): Promise<void> {
  return request<void>(`/schedules/${encodeURIComponent(scheduleId)}`, {
    method: "DELETE",
  });
}
