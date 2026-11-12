import { afterEach, describe, expect, it, vi } from "vitest";
import { API_BASE_URL } from "../../../config/env";
import { getCurrentUser, login, logout } from "./authApi";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("auth API", () => {
  it("logs in with credentials and returns the server response", async () => {
    const response = { user: { id: "user-1", roles: ["siswa"] } };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(response), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(login({ email: "user@example.com", password: "secret" })).resolves.toEqual(response);
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/auth/login`,
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ email: "user@example.com", password: "secret" }),
      }),
    );
  });

  it("exposes invalid credentials from login", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ code: "INVALID_CREDENTIALS", message: "Invalid credentials" }),
          { status: 401 },
        ),
      ),
    );

    await expect(login({ email: "user@example.com", password: "wrong" })).rejects.toMatchObject({
      code: "INVALID_CREDENTIALS",
      status: 401,
    });
  });

  it("bootstraps the current session from /auth/me", async () => {
    const user = { id: "user-1", fullName: "User", roles: ["guru_mapel"] };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify(user), { status: 200 }),
    ));

    await expect(getCurrentUser()).resolves.toEqual(user);
  });

  it("exposes expired sessions and forbidden responses distinctly", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(
        JSON.stringify({ code: "UNAUTHENTICATED", message: "Unauthenticated" }),
        { status: 401 },
      ))
      .mockResolvedValueOnce(new Response(
        JSON.stringify({ code: "FORBIDDEN", message: "Forbidden" }),
        { status: 403 },
      ));
    vi.stubGlobal("fetch", fetchMock);

    await expect(getCurrentUser()).rejects.toMatchObject({
      code: "UNAUTHENTICATED",
      status: 401,
    });
    await expect(logout()).rejects.toMatchObject({
      code: "FORBIDDEN",
      status: 403,
    });
  });

  it("logs out and does not invent a CSRF header when the cookie is absent", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("document", { cookie: "" });
    vi.stubGlobal("fetch", fetchMock);

    await expect(logout()).resolves.toBeUndefined();
    const requestInit = fetchMock.mock.calls[0][1] as RequestInit;
    expect(new Headers(requestInit.headers).get("X-CSRF-Token")).toBeNull();
  });
});
