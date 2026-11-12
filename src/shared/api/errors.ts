export interface ApiErrorDetails {
  fields?: Array<{
    field?: string;
    message?: string;
  }>;
  [key: string]: unknown;
}

export interface ApiErrorEnvelope {
  code: string;
  message: string;
  details?: ApiErrorDetails;
}

export class ApiError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly details?: ApiErrorDetails;

  constructor(
    envelope: ApiErrorEnvelope,
    options: { status?: number; cause?: unknown } = {},
  ) {
    super(envelope.message, { cause: options.cause });
    this.name = "ApiError";
    this.code = envelope.code;
    this.status = options.status;
    this.details = envelope.details;
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}
