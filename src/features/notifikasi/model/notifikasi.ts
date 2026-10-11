/**
 * Model domain modul Notifikasi.
 *
 * Sumber: FR-NOTIF-001, DEC-12 (notifikasi in-app dengan status baca
 * tersimpan). Kontrak backend: API-NTF-001/002
 * (docs/06-api-documentation.md §21) dan entitas `notifications`
 * (docs/05-sdd.md §15.3).
 *
 * Catatan keterbatasan (K-13): katalog `type` notifikasi dan bentuk
 * `payload` belum ditetapkan, sehingga pemetaan pesan dari kontrak backend
 * belum dapat dilakukan tanpa menebak. Selama kontrak masih `Proposed`
 * (KD-07), tipe di bawah adalah model tampilan yang diisi adapter mock
 * (`../api/notifikasiApi.ts`). Saat kontrak disetujui, adapter bertugas
 * memetakan DTO backend `{ id, type, payload, readAt, createdAt }` ke model
 * ini.
 */

export type NotificationTone = "danger" | "warning";

/** Potongan pesan notifikasi agar penekanan teks tidak ditulis sebagai JSX di data. */
export interface NotificationSegment {
  text: string;
  strong?: boolean;
  tone?: NotificationTone;
}

export interface NotifikasiItem {
  id: string;
  title: string;
  /** Waktu kejadian (ISO-8601). Diformat untuk tampilan oleh `formatNotificationDate`. */
  createdAt: string;
  message: NotificationSegment[];
  isRead: boolean;
}

// BR-12: waktu acuan Asia/Jakarta.
const JAKARTA_TIME_ZONE = "Asia/Jakarta";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: JAKARTA_TIME_ZONE,
});

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: JAKARTA_TIME_ZONE,
});

function formatTime(value: Date): string {
  return timeFormatter
    .formatToParts(value)
    .filter((part) => part.type === "hour" || part.type === "minute")
    .map((part) => part.value)
    .join(":");
}

/** Format tampilan, mis. "29 Jul 2026 (14:23)" (waktu WIB). */
export function formatNotificationDate(createdAt: string): string {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";
  return `${dateFormatter.format(date)} (${formatTime(date)})`;
}
