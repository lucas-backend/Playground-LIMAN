import { request } from "../../../shared/api/client";

export interface PageResponse<T> {
  items: T[];
  page?: number;
  pageSize?: number;
  total?: number;
}

export interface ClassRecord {
  id: string;
  name: string;
  level?: string | null;
  homeroomTeacherUserId?: string | null;
  studentCount?: number;
}

export interface SubjectRecord {
  id: string;
  code: string;
  name: string;
}

export interface StudentRecord {
  userId: string;
  fullName: string;
  nis?: string | null;
  classId?: string | null;
  className?: string | null;
  status?: "active" | "inactive";
}

export interface TeachingAssignment {
  id: string;
  teacherUserId: string;
  subjectId: string;
  classId: string;
}

export interface ClassInput {
  name: string;
  level?: string;
  homeroomTeacherUserId?: string;
}

export interface ClassUpdate {
  name?: string;
  level?: string;
  homeroomTeacherUserId?: string | null;
}

export interface SubjectInput {
  code: string;
  name: string;
}

export interface StudentUpdate {
  nis?: string;
  classId?: string | null;
}

function query(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const result = search.toString();
  return result ? `?${result}` : "";
}

export function listClasses(params: {
  level?: string;
  q?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<PageResponse<ClassRecord>> {
  return request<PageResponse<ClassRecord>>(`/classes${query(params)}`);
}

export function createClass(body: ClassInput): Promise<ClassRecord> {
  return request<ClassRecord, ClassInput>("/classes", { method: "POST", body });
}

export function updateClass(classId: string, body: ClassUpdate): Promise<ClassRecord> {
  return request<ClassRecord, ClassUpdate>(`/classes/${encodeURIComponent(classId)}`, {
    method: "PUT",
    body,
  });
}

export function listSubjects(params: {
  q?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<PageResponse<SubjectRecord>> {
  return request<PageResponse<SubjectRecord>>(`/subjects${query(params)}`);
}

export function createSubject(body: SubjectInput): Promise<SubjectRecord> {
  return request<SubjectRecord, SubjectInput>("/subjects", { method: "POST", body });
}

export function listStudents(params: {
  classId?: string;
  q?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<PageResponse<StudentRecord>> {
  return request<PageResponse<StudentRecord>>(`/students${query(params)}`);
}

export function getStudent(studentId: string): Promise<StudentRecord> {
  return request<StudentRecord>(`/students/${encodeURIComponent(studentId)}`);
}

export function updateStudent(studentId: string, body: StudentUpdate): Promise<StudentRecord> {
  return request<StudentRecord, StudentUpdate>(`/students/${encodeURIComponent(studentId)}`, {
    method: "PATCH",
    body,
  });
}

export function listTeachingAssignments(params: {
  teacherUserId?: string;
  classId?: string;
  subjectId?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<PageResponse<TeachingAssignment>> {
  return request<PageResponse<TeachingAssignment>>(`/teaching-assignments${query(params)}`);
}

export function createTeachingAssignment(body: Omit<TeachingAssignment, "id">): Promise<TeachingAssignment> {
  return request<TeachingAssignment, Omit<TeachingAssignment, "id">>("/teaching-assignments", {
    method: "POST",
    body,
  });
}
