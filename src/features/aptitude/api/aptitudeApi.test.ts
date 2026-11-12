import { afterEach, describe, expect, it, vi } from "vitest";
import { API_BASE_URL } from "../../../config/env";
import { createTargetMajor, getAptitudeResults } from "./aptitudeApi";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("aptitude API", () => {
  it("requests aptitude results for the supplied student scope", async () => {
    const response = { studentUserId: "student-1", results: [] };
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(response), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(getAptitudeResults("student-1")).resolves.toEqual(response);
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/students/student-1/aptitude-results`,
      expect.anything(),
    );
  });

  it("creates a target major with the scoped student path", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: "target-1", studentUserId: "student-1", major: "Teknik Kimia" }), { status: 201 }),
    );
    vi.stubGlobal("document", { cookie: "csrf=csrf-token" });
    vi.stubGlobal("fetch", fetchMock);

    await createTargetMajor("student-1", "Teknik Kimia");

    expect(fetchMock.mock.calls[0][0]).toBe(`${API_BASE_URL}/students/student-1/target-majors`);
    expect((fetchMock.mock.calls[0][1] as RequestInit).body).toBe(JSON.stringify({ major: "Teknik Kimia" }));
    expect(new Headers((fetchMock.mock.calls[0][1] as RequestInit).headers).get("X-CSRF-Token")).toBe("csrf-token");
  });
});
