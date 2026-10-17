import { useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../features/dashboard/UserContext";
import { STORAGE_KEY, type UserRole } from "../features/dashboard/data.mock";

const ROLES: { id: UserRole; label: string }[] = [
  { id: "siswa", label: "Siswa" },
  { id: "guruMapel", label: "Guru Mapel" },
  { id: "guruBK", label: "Guru BK" },
  { id: "guruWali", label: "Guru Wali" },
  { id: "admin", label: "Admin" },
];

const QUICK_LINKS: { label: string; path: string }[] = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Login", path: "/login" },
  { label: "Jadwal (Siswa)", path: "/jadwal-siswa" },
  { label: "Latihan Soal (Siswa)", path: "/latihan-soal" },
  { label: "Passing Grade", path: "/passing_grade" },
  { label: "Absensi (Guru Mapel)", path: "/guruMapel/absensi" },
  { label: "Menu Wali Kelas", path: "/guruWali/absensi/1" },
  { label: "Latihan Soal (Guru)", path: "/guru/latihanSoal" },
  { label: "Bank Soal Latihan", path: "/guru/latihanSoal/bankSoal" },
  { label: "Ujian (Guru)", path: "/guru/ujian" },
  { label: "Bank Soal Ujian", path: "/guru/ujian/bankSoal" },
  { label: "Tugas (Guru)", path: "/guru/tugas" },
  { label: "Penilaian (Guru)", path: "/guru/penilaian" },
  { label: "Remedial (Guru)", path: "/guru/remedial" },
  { label: "Konseling (BK)", path: "/guruBK/konseling" },
  { label: "Rekap (BK)", path: "/guruBK/rekap" },
  { label: "Minat Bakat (BK)", path: "/guruBK/minatBakat" },
  { label: "Admin", path: "/admin" },
  { label: "Notifikasi", path: "/notifikasi" },
];

export default function DevTools() {
  const [open, setOpen] = useState(false);
  const { role, setRole, isPresent, setIsPresent, resetUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const switchRole = (next: UserRole) => {
    setRole(next);
    navigate("/dashboard");
    setOpen(false);
  };

  return (
    <>
      {/* Handle slider */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed right-0 top-24 z-50 rounded-l-md border border-r-0 border-zinc-700 bg-zinc-900 px-1.5 py-5 text-[10px] font-bold tracking-[0.2em] text-emerald-400 hover:bg-zinc-800"
        style={{ writingMode: "vertical-rl" }}
        aria-expanded={open}
        aria-label="Toggle devtools"
      >
        DEV
      </button>

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 h-dvh w-72 overflow-y-auto border-l border-zinc-800 bg-zinc-950/97 text-zinc-100 shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-3">
          <div>
            <h2 className="text-sm font-bold text-emerald-400">DevTools</h2>
            <p className="text-[10px] text-zinc-500">LIMEN prototype</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 px-4 py-4">
          {/* Ganti Role */}
          <section>
            <SectionTitle>Ganti Role</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => switchRole(r.id)}
                  className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                    role === r.id
                      ? "border-emerald-500 bg-emerald-500/15 text-emerald-400"
                      : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600"
                  }`}
                >
                  {r.label}
                  {role === r.id && " •"}
                </button>
              ))}
            </div>
          </section>

          {/* Mode Siswa */}
          <section>
            <SectionTitle>Status Absen (Siswa)</SectionTitle>
            <button
              type="button"
              onClick={() => setIsPresent(!isPresent)}
              className={`w-full rounded-lg border px-3 py-2 text-xs font-medium ${
                isPresent
                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-400"
                  : "border-red-500 bg-red-500/15 text-red-400"
              }`}
            >
              {isPresent ? "Hadir" : "Tidak Hadir"} — klik untuk toggle
            </button>
          </section>

          {/* Quick Navigation */}
          <section>
            <SectionTitle>Quick Navigation</SectionTitle>
            <div className="space-y-1">
              {QUICK_LINKS.map((link) => (
                <button
                  key={link.path + link.label}
                  type="button"
                  onClick={() => go(link.path)}
                  className={`block w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-zinc-800 ${
                    location.pathname === link.path
                      ? "bg-zinc-800 text-emerald-400"
                      : "text-zinc-300"
                  }`}
                >
                  {link.label}
                  <span className="ml-2 text-[10px] text-zinc-600">{link.path}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Info Route */}
          <section>
            <SectionTitle>Route Saat Ini</SectionTitle>
            <code className="block break-all rounded-md bg-zinc-900 px-2 py-2 text-[11px] text-emerald-400">
              {location.pathname}
              {location.search}
            </code>
          </section>

          {/* Reset */}
          <section>
            <SectionTitle>Reset</SectionTitle>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                resetUser();
              }}
              className="w-full rounded-lg border border-red-900 bg-red-950/50 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-950"
            >
              Reset mock user & storage
            </button>
          </section>

          <p className="pb-4 text-[10px] leading-relaxed text-zinc-600">
            Data role & status absen disimpan di localStorage key{" "}
            <code>{STORAGE_KEY}</code>. Untuk memunculkan DevTools di build
            production (Vercel), set env var{" "}
            <code>VITE_ENABLE_DEVTOOLS=true</code>.
          </p>
        </div>
      </div>
    </>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-2 text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase">
      {children}
    </h3>
  );
}
