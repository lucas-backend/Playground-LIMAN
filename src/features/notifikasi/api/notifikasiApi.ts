import type { NotifikasiItem } from "../model/notifikasi";

/**
 * Akses data modul Notifikasi.
 *
 * Kontrak backend: API-NTF-001 `GET /notifications` dan API-NTF-002
 * `POST /notifications/{notificationId}/read`
 * (docs/06-api-documentation.md §21). Kontrak masih `Proposed` dan backend
 * belum tersedia (KD-07 `Blocked`), sehingga modul ini memakai adapter mock
 * sementara.
 *
 * TODO(notifikasi F5): saat kontrak `Approved`, ganti `getNotifications`
 * dengan `api.get<...>("/notifications")` dan `markNotificationRead` dengan
 * `api.post("/notifications/{id}/read")` via `@/shared/api/client`, lalu
 * petakan DTO `{ id, type, payload, readAt, createdAt }` menjadi
 * `NotifikasiItem`. Pemetaan `type`/`payload` menunggu keputusan K-13.
 */

const MOCK_DELAY_MS = 300;

// Data contoh (mock). Sengaja tidak menyerupai PII nyata dan bukan cerminan
// bentuk `type`/`payload` backend (K-13 belum diputuskan).
const notifications: NotifikasiItem[] = [
  {
    id: "nt-0001",
    title: "Peringatan Absen Siswa",
    createdAt: "2026-07-29T14:23:00+07:00",
    message: [
      { text: "Statistik absensi " },
      { text: "Jon Sapriadi", strong: true },
      { text: " sudah memasuki " },
      { text: "Area Merah", strong: true, tone: "danger" },
    ],
    isRead: false,
  },
  {
    id: "nt-0002",
    title: "Peringatan Absen Siswa",
    createdAt: "2026-07-29T14:23:00+07:00",
    message: [
      { text: "Statistik absensi " },
      { text: "Wani Aprilia", strong: true },
      { text: " sudah memasuki " },
      { text: "Area Oranye", strong: true, tone: "warning" },
    ],
    isRead: false,
  },
  {
    id: "nt-0003",
    title: "Siswa Bolos Kelas",
    createdAt: "2026-07-29T14:23:00+07:00",
    message: [
      { text: "Samsul Benjamin", strong: true },
      { text: " sudah absen fingerprint namun tidak hadir " },
      { text: "tanpa keterangan", strong: true },
      { text: " pada mata pelajaran " },
      { text: "Matematika (Tri Suliastuti)", strong: true },
      { text: " pada 29 Juli 2026, 13:00 WIB" },
    ],
    isRead: false,
  },
  {
    id: "nt-0004",
    title: "Peringatan Absen Siswa",
    createdAt: "2026-07-29T14:23:00+07:00",
    message: [
      { text: "Statistik absensi " },
      { text: "Jon Sapriadi", strong: true },
      { text: " sudah memasuki " },
      { text: "Area Oranye", strong: true, tone: "warning" },
    ],
    isRead: false,
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getNotifications(): Promise<NotifikasiItem[]> {
  await delay(MOCK_DELAY_MS);
  // Salinan dangkal agar pemanggil tidak memutasi state adapter.
  return notifications.map((item) => ({ ...item }));
}

export async function markNotificationRead(id: string): Promise<void> {
  await delay(MOCK_DELAY_MS);
  const target = notifications.find((item) => item.id === id);
  if (target) target.isRead = true;
}
