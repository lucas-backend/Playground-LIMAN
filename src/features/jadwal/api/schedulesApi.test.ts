import { afterEach, describe, expect, it, vi } from "vitest";
import { API_BASE_URL } from "../../../config/env";
import { createSchedule, deleteSchedule, listSchedules, updateSchedule } from "./schedulesApi";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("schedules API", () => {
  it("sends only declared list filters and supports an empty response", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ items: [] }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(listSchedules({
      kind: "ujian",
      classId: "class-id",
      dayOfWeek: 2,
      dateFrom: "2026-01-01",
      dateTo: "2026-01-31",
    })).resolves.toEqual({ items: [] });

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/schedules?kind=ujian&classId=class-id&dayOfWeek=2&dateFrom=2026-01-01&dateTo=2026-01-31`,
      expect.anything(),
    );
  });

  it("uses UUID schedule IDs for update and delete and sends create payloads", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "schedule-uuid" }), { status: 201 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "schedule-uuid" }), { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    const body = {
      classId: "class-uuid",
      subjectId: "subject-uuid",
      dayOfWeek: 1,
      startTime: "07:00",
      endTime: "08:00",
      kind: "pelajaran" as const,
    };

    await createSchedule(body);
    await updateSchedule("schedule-uuid", body);
    await deleteSchedule("schedule-uuid");

    expect(fetchMock.mock.calls[0][0]).toBe(`${API_BASE_URL}/schedules`);
    expect(fetchMock.mock.calls[1][0]).toBe(`${API_BASE_URL}/schedules/schedule-uuid`);
    expect(fetchMock.mock.calls[2][0]).toBe(`${API_BASE_URL}/schedules/schedule-uuid`);
    expect((fetchMock.mock.calls[1][1] as RequestInit).method).toBe("PUT");
    expect((fetchMock.mock.calls[2][1] as RequestInit).method).toBe("DELETE");
  });
});
