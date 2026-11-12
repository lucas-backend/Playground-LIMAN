import { request } from "../../../shared/api/client";

export interface PassingGrade {
  id: string;
  university: string;
  major: string;
  score: number;
  year: number;
}

export interface PassingGradeListResponse {
  items: PassingGrade[];
  page: number;
  pageSize: number;
  total: number;
}

export interface PassingGradeFilters {
  university?: string;
  major?: string;
  year?: number;
  page?: number;
  pageSize?: number;
}

function query(filters: PassingGradeFilters): string {
  const search = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const result = search.toString();
  return result ? `?${result}` : "";
}

export function listPassingGrades(
  filters: PassingGradeFilters = {},
): Promise<PassingGradeListResponse> {
  return request<PassingGradeListResponse>(`/passing-grades${query(filters)}`);
}

export function getPassingGrade(id: string): Promise<PassingGrade> {
  return request<PassingGrade>(`/passing-grades/${encodeURIComponent(id)}`);
}
