import { afterEach, describe, expect, it, vi } from "vitest";
import { API_BASE_URL } from "../../../config/env";
import { listNotifications, markNotificationRead } from "./notificationsApi";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("notifications API", () => {
  it("sends unreadOnly and pagination filters and preserves an empty list", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ items: [], page: 2, pageSize: 20, total: 0 }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(listNotifications({ unreadOnly: true, page: 2, pageSize: 20 })).resolves.toEqual({
      items: [], page: 2, pageSize: 20, total: 0,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/notifications?unreadOnly=true&page=2&pageSize=20`,
      expect.anything(),
    );
  });

  it("marks a notification read with the CSRF token", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: "notification-1", readAt: "2026-11-12T10:00:00Z" }), { status: 200 }),
    );
    vi.stubGlobal("document", { cookie: "csrf=csrf-token" });
    vi.stubGlobal("fetch", fetchMock);

    await markNotificationRead("notification-1");

    const requestInit = fetchMock.mock.calls[0][1] as RequestInit;
    expect(fetchMock.mock.calls[0][0]).toBe(`${API_BASE_URL}/notifications/notification-1/read`);
    expect(requestInit.method).toBe("POST");
    expect(new Headers(requestInit.headers).get("X-CSRF-Token")).toBe("csrf-token");
  });
});
