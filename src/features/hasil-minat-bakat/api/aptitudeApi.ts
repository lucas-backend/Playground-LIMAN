/**
 * Akses data modul Hasil Minat Bakat (siswa).
 *
 * Kontrak resmi: API-MB-001 `GET /students/{studentId}/aptitude-results`
 * dan API-MB-002 `POST /students/{studentId}/target-majors`
 * (docs/06-api-documentation.md §20). Kontrak masih `Proposed` dan backend
 * belum tersedia (KD-07/KD-09 `Blocked`), sehingga fungsi di bawah memakai
 * adapter mock sementara.
 *
 * TODO(hasil-minat-bakat F5): saat kontrak `Approved`, ganti isi fungsi dengan
 * panggilan `api.get<AptitudeResultsResponse>(...)` / `api.post<TargetMajor>(...)`
 * lewat `@/shared/api/client` (studentId menjadi path param). Hapus konstanta
 * dan `MOCK_DELAY_MS` di bawah saat itu.
 */

import type {
  AddTargetMajorPayload,
  AptitudeResultsResponse,
  TargetMajor,
} from "../model/aptitude";

const MOCK_DELAY_MS = 300;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** `GET /students/{studentId}/aptitude-results` (API-MB-001, FR-MB-001). */
export async function getAptitudeResults(
  studentId: string,
): Promise<AptitudeResultsResponse> {
  // `studentId` belum dipakai oleh adapter mock; menjadi path param saat
  // backend tersedia.
  void studentId;
  await delay(MOCK_DELAY_MS);
  return {
    studentUserId: studentId,
    results: [
      {
        id: "ap-demo-001",
        result: "IT & Komputer",
        assessedAt: "2026-11-11T00:00:00+07:00",
      },
    ],
  };
}

/** `POST /students/{studentId}/target-majors` (API-MB-002, FR-MB-002). */
export async function addTargetMajor(
  studentId: string,
  payload: AddTargetMajorPayload,
): Promise<TargetMajor> {
  void studentId;
  await delay(MOCK_DELAY_MS);
  return {
    id: "tm-demo-001",
    studentUserId: studentId,
    major: payload.major,
    createdAt: "2026-10-11T12:00:00+07:00",
  };
}