import { request } from "../../../../shared/api/client";

export interface PageResponse<T> {
  items: T[];
  page?: number;
  pageSize?: number;
  total?: number;
}

export interface CounselingNote {
  id: string;
  studentUserId: string;
  authorId: string;
  note: string;
  createdAt: string;
}

export interface Followup {
  id: string;
  noteId: string;
  note: string;
  createdBy: string;
  createdAt: string;
}

export interface CounselingFilters {
  studentUserId?: string;
  classId?: string;
  sort?: string;
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

export function listCounselingNotes(
  filters: CounselingFilters = {},
): Promise<PageResponse<CounselingNote>> {
  return request<PageResponse<CounselingNote>>(`/counseling-notes${query(filters)}`);
}

export function createCounselingNote(body: {
  studentUserId: string;
  note: string;
}): Promise<CounselingNote> {
  return request<CounselingNote, typeof body>("/counseling-notes", {
    method: "POST",
    body,
  });
}

export function updateCounselingNote(
  noteId: string,
  body: { note: string },
): Promise<CounselingNote> {
  return request<CounselingNote, typeof body>(
    `/counseling-notes/${encodeURIComponent(noteId)}`,
    { method: "PUT", body },
  );
}

export function createFollowup(
  noteId: string,
  body: { note: string },
): Promise<Followup> {
  return request<Followup, typeof body>(
    `/counseling-notes/${encodeURIComponent(noteId)}/followups`,
    { method: "POST", body },
  );
}
