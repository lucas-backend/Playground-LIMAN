import { request } from "../../../../shared/api/client";

export interface PageResponse<T> {
  items: T[];
  page?: number;
  pageSize?: number;
  total?: number;
}

export interface Assignment {
  id: string;
  classId: string;
  subjectId: string;
  teacherUserId: string;
  title: string;
  description?: string | null;
  dueAt: string;
}

export interface Submission {
  studentUserId: string;
  studentName: string;
  submittedAt: string | null;
  score: number | null;
  gradedBy: string | null;
  gradedAt: string | null;
}

export interface AssignmentFilters {
  classId?: string;
  subjectId?: string;
  teacherUserId?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export interface AssignmentInput {
  classId: string;
  subjectId: string;
  title: string;
  description?: string;
  dueAt: string;
}

export interface SubmissionGrade {
  score?: number;
  note?: string;
}

function query(params: object): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const result = search.toString();
  return result ? `?${result}` : "";
}

export function listAssignments(
  filters: AssignmentFilters = {},
): Promise<PageResponse<Assignment>> {
  return request<PageResponse<Assignment>>(`/assignments${query(filters)}`);
}

export function createAssignment(body: AssignmentInput): Promise<Assignment> {
  return request<Assignment, AssignmentInput>("/assignments", {
    method: "POST",
    body,
  });
}

export function listSubmissions(
  assignmentId: string,
  params: { page?: number; pageSize?: number } = {},
): Promise<PageResponse<Submission>> {
  return request<PageResponse<Submission>>(
    `/assignments/${encodeURIComponent(assignmentId)}/submissions${query(params)}`,
  );
}

export function gradeSubmission(
  assignmentId: string,
  studentUserId: string,
  body: SubmissionGrade,
): Promise<Submission> {
  return request<Submission, SubmissionGrade>(
    `/assignments/${encodeURIComponent(assignmentId)}/submissions/${encodeURIComponent(studentUserId)}`,
    { method: "PUT", body },
  );
}
