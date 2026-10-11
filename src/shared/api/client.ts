// Wrapper HTTP tunggal untuk frontend (SDD §4, §6).
// Abstraksi teknis ini tidak terikat pada endpoint tertentu; modul fitur
// memakai `api`/`request` dan tidak memanggil `fetch` langsung.
//
// Catatan integrasi:
// - Session cookie dikirim via `credentials: "include"` (ADR-003/DEC-05).
// - Proteksi CSRF untuk mutasi (IR-API-003) belum final; header CSRF akan
//   ditambahkan di sini setelah skema disepakati.
// - Penanganan 401 (arahkan ke login) dilakukan oleh lapisan pemanggil
//   (mis. hook/session) melalui `ApiError.status`.

import { env } from "@/config/env";
import {
  ApiError,
  isApiErrorBody,
  type ApiErrorBody,
} from "./errors";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type QueryParams = Record<
  string,
  string | number | boolean | undefined
>;

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  query?: QueryParams;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: QueryParams): string {
  const base = env.apiBaseUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${base}${normalizedPath}`;
  if (!query) return url;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.append(key, String(value));
  }
  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (text === "") return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers, query, signal } = options;

  const response = await fetch(buildUrl(path, query), {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (response.status === 204) return undefined as T;

  const payload = await parseBody(response);

  if (!response.ok) {
    const errorBody: ApiErrorBody = isApiErrorBody(payload)
      ? payload
      : { code: String(response.status), message: response.statusText };
    throw new ApiError(response.status, errorBody);
  }

  return payload as T;
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
