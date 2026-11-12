import type { ApiError } from "../api/errors";

export function apiErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return "Terjadi kesalahan yang tidak diketahui.";
  const apiError = error as ApiError;
  if (apiError.status === 403 || apiError.code === "FORBIDDEN") return "Akses ditolak.";
  if (apiError.status === 404 || apiError.code === "NOT_FOUND") return "Data tidak ditemukan.";
  if (apiError.status === 409 || apiError.code === "CONFLICT") return "Data bertentangan dengan data yang sudah ada.";
  if (apiError.status === 422 || apiError.code === "VALIDATION_ERROR") return apiError.message;
  return apiError.message || "Permintaan gagal.";
}
