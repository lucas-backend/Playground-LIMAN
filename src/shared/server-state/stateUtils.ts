import { isApiError } from "../api/errors";

export function isForbiddenError(error: unknown) {
  return isApiError(error) && (error.status === 403 || error.code === "FORBIDDEN");
}
