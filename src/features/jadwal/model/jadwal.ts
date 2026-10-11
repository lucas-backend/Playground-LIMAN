import type { SvgIconComponent } from "@mui/icons-material";

/**
 * Model modul Jadwal (siswa) — FR-JADWAL-001 (docs/03-srs.md §3.4):
 * menampilkan jadwal pelajaran/ujian/tryout.
 *
 * Kontrak backend: API-JWL-001 `GET /schedules`
 * (docs/06-api-documentation.md §12), entitas `schedules`
 * (docs/05-sdd.md §15.3). Kontrak masih `Proposed` dan backend belum tersedia
 * (KD-07 `Blocked`), sehingga tipe di bawah adalah model tampilan yang diisi
 * adapter mock (`../api/jadwalApi.ts`). Saat kontrak disetujui, adapter
 * memetakan DTO `{ id, classId, subjectId, teacherUserId, dayOfWeek, startTime,
 * endTime, kind }` ke model ini.
 *
 * Catatan keterbatasan: `icon` dan kelas warna ikut di model karena data
 * contoh mengaitkannya per baris (baseline desain DEC-14). Pemisahan ikon dari
 * data domain menunggu desain/token resmi (SDD-OI-04).
 */

/** Satu tab utama halaman Jadwal (Pelajaran/Try Out/Ujian). */
export interface JadwalTab {
  icon: SvgIconComponent;
  name: string;
  link: string;
}

/** Satu tanggal pada strip tanggal tab Pelajaran. */
export interface JadwalDate {
  day: string;
  date: number;
  isActive?: boolean;
}

/** Satu baris jadwal pelajaran. */
export interface JadwalItem {
  icon: SvgIconComponent;
  name: string;
  subject: string;
  time: string;
  duration: number;
  colorClassName: string;
  backgroundClassName: string;
}

/** Kelompok jadwal pelajaran (mis. "Hari ini", "Besok"). */
export interface JadwalSection {
  title: string;
  items: readonly JadwalItem[];
}

/** Data tab Pelajaran: strip tanggal + daftar kelompok jadwal. */
export interface JadwalPelajaranData {
  dates: readonly JadwalDate[];
  sections: readonly JadwalSection[];
}
