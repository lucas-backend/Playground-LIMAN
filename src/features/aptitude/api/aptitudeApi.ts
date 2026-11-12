import { request } from "../../../shared/api/client";

export interface AptitudeResult {
  id: string;
  result: string;
  assessedAt: string;
}

export interface AptitudeResultsResponse {
  studentUserId: string;
  results: AptitudeResult[];
}

export interface TargetMajor {
  id: string;
  studentUserId: string;
  major: string;
  createdAt: string;
}

export function getAptitudeResults(studentId: string): Promise<AptitudeResultsResponse> {
  return request<AptitudeResultsResponse>(
    `/students/${encodeURIComponent(studentId)}/aptitude-results`,
  );
}

export function createTargetMajor(
  studentId: string,
  major: string,
): Promise<TargetMajor> {
  return request<TargetMajor, { major: string }>(
    `/students/${encodeURIComponent(studentId)}/target-majors`,
    { method: "POST", body: { major } },
  );
}
