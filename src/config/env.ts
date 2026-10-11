// Konfigurasi klien terpusat (SDD §9.3).
// Hanya nilai VITE_* yang akan tertanam di bundel; jangan menyimpan rahasia di sini.
// Dokumentasi variabel ada di .env.example.

function readString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : fallback;
}

export const env = {
  // Base URL API. Kosong berarti same-origin (permintaan ke path relatif).
  // Contoh: "http://localhost:8080/api/v1".
  apiBaseUrl: readString(import.meta.env.VITE_API_BASE_URL, ""),
} as const;
