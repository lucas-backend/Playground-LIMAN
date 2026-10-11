/**
 * Akses data modul Dashboard.
 *
 * FR-DASH-001 (menu per peran) dipenuhi murni dari data sesi
 * (`GET /auth/me`, API-AUTH-003) — lihat `../model/dashboard.ts`. Tidak ada
 * endpoint dashboard khusus (docs/06-api-documentation.md §5).
 *
 * Satu-satunya data tambahan pada halaman adalah status absensi hari ini
 * untuk siswa, yang merupakan komposisi data modul absensi
 * (API-ABS-002 `GET /attendance/records`, cakupan siswa sendiri — §3.3
 * FR-ABS-009). Karena backend belum tersedia (KD-07/KD-09 `Blocked`),
 * fungsi ini masih adapter mock sementara.
 *
 * TODO(absensi F5): ganti isi `getTodayAttendance` dengan
 * `api.get<...>("/attendance/records", { query: { subject: userId, date } })`
 * lewat `@/shared/api/client`, lalu turunkan `isPresent` dari `checkInAt`.
 * Hapus nilai mock di bawah saat itu.
 */

export interface TodayAttendance {
  isPresent: boolean;
}

export async function getTodayAttendance(
  userId: string,
): Promise<TodayAttendance> {
  // `userId` belum dipakai oleh adapter mock; akan jadi parameter query
  // `GET /attendance/records` saat backend tersedia.
  void userId;
  return { isPresent: true };
}
