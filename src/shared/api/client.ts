import { API_BASE_URL, API_TIMEOUT_MS } from "../../config/env";
import { ApiError, type ApiErrorEnvelope } from "./errors";

type HttpMethod = "DELETE" | "GET" | "HEAD" | "PATCH" | "POST" | "PUT";

export interface RequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  signal?: AbortSignal;
  timeoutMs?: number;
}

const MUTATION_METHODS = new Set<HttpMethod>(["DELETE", "PATCH", "POST", "PUT"]);

function getCsrfToken(): string | undefined {
  if (typeof document === "undefined") return undefined;

  const csrfCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("csrf="));

  return csrfCookie ? decodeURIComponent(csrfCookie.slice("csrf=".length)) : undefined;
}

function createRequestSignal(
  signal: AbortSignal | undefined,
  timeoutMs: number,
): { signal: AbortSignal; cleanup: () => void } {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(
    () => controller.abort("timeout"),
    timeoutMs,
  );
  const abortParent = () => controller.abort(signal?.reason);

  if (signal) {
    if (signal.aborted) abortParent();
    else signal.addEventListener("abort", abortParent, { once: true });
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      globalThis.clearTimeout(timeoutId);
      signal?.removeEventListener("abort", abortParent);
    },
  };
}

async function parseJson<T>(response: Response): Promise<T | undefined> {
  if (response.status === 204) return undefined;

  const text = await response.text();
  if (!text) return undefined;

  return JSON.parse(text) as T;
}

async function parseError(response: Response): Promise<ApiError> {
  try {
    const body = await parseJson<Partial<ApiErrorEnvelope>>(response);
    if (
      body &&
      typeof body.code === "string" &&
      typeof body.message === "string"
    ) {
      return new ApiError(
        {
          code: body.code,
          message: body.message,
          details: body.details,
        },
        { status: response.status },
      );
    }
  } catch {
    // The status-based error below preserves an explicit failure for malformed bodies.
  }

  return new ApiError(
    {
      code: `HTTP_${response.status}`,
      message: `Request failed with status ${response.status}`,
    },
    { status: response.status },
  );
}

export async function request<TResponse, TBody = unknown>(
  path: string,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> {
  const method = options.method ?? "GET";
  const { signal, cleanup } = createRequestSignal(
    options.signal,
    options.timeoutMs ?? API_TIMEOUT_MS,
  );
  const headers = new Headers({ Accept: "application/json" });
  const hasBody = options.body !== undefined;

  if (hasBody) headers.set("Content-Type", "application/json");
  if (MUTATION_METHODS.has(method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) headers.set("X-CSRF-Token", csrfToken);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers,
      body: hasBody ? JSON.stringify(options.body) : undefined,
      signal,
    });

    if (!response.ok) throw await parseError(response);
    return (await parseJson<TResponse>(response)) as TResponse;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError({
        code: "REQUEST_ABORTED",
        message: "The request was aborted.",
      }, { cause: error });
    }

    throw new ApiError(
      { code: "NETWORK_ERROR", message: "The request could not be completed." },
      { cause: error },
    );
  } finally {
    cleanup();
  }
}
