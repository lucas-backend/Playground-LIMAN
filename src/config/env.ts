const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL =
  typeof configuredBaseUrl === "string" && configuredBaseUrl.trim().length > 0
    ? configuredBaseUrl.replace(/\/+$/, "")
    : "/api/v1";

export const API_TIMEOUT_MS = 15_000;
