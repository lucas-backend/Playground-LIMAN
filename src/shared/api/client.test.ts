import { afterEach, describe, expect, it, vi } from "vitest";
import { request } from "./client";
import { ApiError } from "./errors";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("shared API client", () => {
  it("uses the API URL, method, credentials, and JSON headers", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await request<{ ok: boolean }, { email: string }>("/auth/login", {
      method: "POST",
      body: { email: "user@example.com" },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/auth/login",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ email: "user@example.com" }),
      }),
    );
    const requestInit = fetchMock.mock.calls[0][1] as RequestInit;
    expect(new Headers(requestInit.headers).get("Accept")).toBe("application/json");
    expect(new Headers(requestInit.headers).get("Content-Type")).toBe(
      "application/json",
    );
  });

  it("sends the CSRF cookie value on mutations", async () => {
    vi.stubGlobal("document", { cookie: "csrf=csrf-token" });
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await request<void>("/auth/logout", { method: "POST" });

    const requestInit = fetchMock.mock.calls[0][1] as RequestInit;
    expect(new Headers(requestInit.headers).get("X-CSRF-Token")).toBe("csrf-token");
  });

  it("supports 204 responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 204 })));

    await expect(request<void>("/auth/logout", { method: "POST" })).resolves.toBeUndefined();
  });

  it("parses the API error envelope", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ code: "VALIDATION_ERROR", message: "Invalid", details: { fields: [] } }),
          { status: 422 },
        ),
      ),
    );

    await expect(request("/auth/login", { method: "POST" })).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      message: "Invalid",
      status: 422,
      details: { fields: [] },
    });
  });

  it("preserves authentication and authorization error codes", async () => {
    for (const response of [
      { status: 401, code: "UNAUTHENTICATED" },
      { status: 403, code: "FORBIDDEN" },
      { status: 403, code: "CSRF_INVALID" },
    ]) {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify({ code: response.code, message: response.code }), {
            status: response.status,
          }),
        ),
      );

      await expect(request("/private")).rejects.toMatchObject({
        status: response.status,
        code: response.code,
      });
    }
  });

  it("exposes network and abort errors explicitly", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    await expect(request("/auth/me")).rejects.toMatchObject({
      code: "NETWORK_ERROR",
    });

    const controller = new AbortController();
    controller.abort();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("Aborted", "AbortError")));
    await expect(request("/auth/me", { signal: controller.signal })).rejects.toBeInstanceOf(
      ApiError,
    );
    await expect(request("/auth/me", { signal: controller.signal })).rejects.toMatchObject({
      code: "REQUEST_ABORTED",
    });
  });
});
