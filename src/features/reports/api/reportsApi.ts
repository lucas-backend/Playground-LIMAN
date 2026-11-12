import { request } from "../../../shared/api/client";

export interface AttendanceReport {
  groupBy: string;
  items: Array<Record<string, unknown>>;
}

export interface PageResponse<T> {
  items: T[];
  page?: number;
  pageSize?: number;
  total?: number;
}

export interface ReportCardSubject {
  subjectId: string;
  subjectName: string;
  score: number;
  kkm: number | null;
}

export interface ReportCard {
  studentUserId: string;
  period: string;
  subjects: ReportCardSubject[];
}

export interface AttendanceFilters {
  classId?: string;
  studentUserId?: string;
  subjectType?: string;
  dateFrom?: string;
  dateTo?: string;
  groupBy?: "student" | "class" | "day";
}

export interface GradeReportFilters {
  classId?: string;
  subjectId?: string;
  period?: string;
  page?: number;
  pageSize?: number;
}

function query(params: object): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const result = search.toString();
  return result ? `?${result}` : "";
}

export function getAttendanceReport(filters: AttendanceFilters = {}) {
  return request<AttendanceReport>(`/reports/attendance${query(filters)}`);
}

export function getGradesReport(filters: GradeReportFilters = {}) {
  return request<PageResponse<Record<string, unknown>>>(`/reports/grades${query(filters)}`);
}

export function getReportCard(studentId: string, period?: string) {
  return request<ReportCard>(
    `/students/${encodeURIComponent(studentId)}/report-card${query({ period })}`,
  );
}
