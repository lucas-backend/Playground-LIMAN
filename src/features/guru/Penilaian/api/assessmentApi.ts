import { request } from "../../../../shared/api/client";

export interface PageResponse<T> {
  items: T[];
  page?: number;
  pageSize?: number;
  total?: number;
}

export interface Assessment {
  id: string;
  classId: string;
  subjectId: string;
  teacherUserId: string;
  kind: string;
  kkm: number | null;
  period: string;
}

export interface Score {
  assessmentId: string;
  studentUserId: string;
  studentName: string;
  score: number;
  updatedBy: string | null;
  updatedAt: string;
}

export interface AssessmentFilters {
  classId?: string;
  subjectId?: string;
  kind?: string;
  period?: string;
  page?: number;
  pageSize?: number;
}

export interface AssessmentInput {
  classId: string;
  subjectId: string;
  kind: string;
  kkm?: number;
  period: string;
}

function query(params: object): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const result = search.toString();
  return result ? `?${result}` : "";
}

export function listAssessments(
  filters: AssessmentFilters = {},
): Promise<PageResponse<Assessment>> {
  return request<PageResponse<Assessment>>(`/assessments${query(filters)}`);
}

export function createAssessment(body: AssessmentInput): Promise<Assessment> {
  return request<Assessment, AssessmentInput>("/assessments", {
    method: "POST",
    body,
  });
}

export function listScores(
  assessmentId: string,
  params: { page?: number; pageSize?: number } = {},
): Promise<PageResponse<Score>> {
  return request<PageResponse<Score>>(
    `/assessments/${encodeURIComponent(assessmentId)}/scores${query(params)}`,
  );
}

export function upsertScore(
  assessmentId: string,
  studentUserId: string,
  body: { score: number },
): Promise<Score> {
  return request<Score, { score: number }>(
    `/assessments/${encodeURIComponent(assessmentId)}/scores/${encodeURIComponent(studentUserId)}`,
    { method: "PUT", body },
  );
}
