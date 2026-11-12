import { afterEach, describe, expect, it, vi } from "vitest";
import { API_BASE_URL } from "../../../config/env";
import { getPassingGrade, listPassingGrades } from "./passingGradeApi";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("passing grade API", () => {
  it("lists read-only passing grades with filters and pagination", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ items: [], page: 1, pageSize: 20, total: 0 }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await listPassingGrades({ university: "UI", major: "Informatika", year: 2026, page: 1, pageSize: 20 });

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/passing-grades?university=UI&major=Informatika&year=2026&page=1&pageSize=20`,
      expect.anything(),
    );
  });

  it("gets a passing grade detail without a mutation method", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: "grade-1", university: "UI", major: "Informatika", score: 700, year: 2026 }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await getPassingGrade("grade-1");

    expect(fetchMock.mock.calls[0][0]).toBe(`${API_BASE_URL}/passing-grades/grade-1`);
    expect((fetchMock.mock.calls[0][1] as RequestInit).method).toBe("GET");
  });
});
