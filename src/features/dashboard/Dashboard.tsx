import AdSlider from "@/shared/components/ui/AdSlider";
import XPadding from "@/shared/components/layout/XPadding";

import DashboardHeader from "./components/DashboardHeader";
import FeatureGrid from "./components/FeatureGrid/FeatureGrid";
import SearchBar from "./components/SearchBar";
import StatusAbsen from "./components/StatusAbsen";
import { useDashboard } from "./hooks/useDashboard";

// Dashboard per peran (FR-DASH-001): menu diturunkan dari `roles` sesi
// (`/auth/me`), bukan lagi mock. Status absensi siswa berasal dari adapter
// mock absensi (lihat `api/dashboardApi.ts`).
export default function Dashboard() {
  const { user, features, isStudent, attendance, reloadAttendance } =
    useDashboard();

  // ProtectedLayout menjamin user terautentikasi; penjaga ini hanya untuk tipe.
  if (!user) return null;

  return (
    <div className="min-h-dvh bg-brand-500 pt-8 flex flex-col">
      <DashboardHeader name={user.fullName} />

      <XPadding className="mt-8">
        <SearchBar />
      </XPadding>

      {/* Background White Negative Margin Top for Overlap with Search Button */}
      <div className="bg-white flex-1 w-full max-w-md mx-auto -mt-6 rounded-t-[60px] pt-13 pb-8">
        <XPadding>
          {/* AdSlider Container : Untuk Box Styling AdSlider lewat container di Page nya aja */}
          <div className="rounded-xl overflow-hidden">
            <AdSlider />
          </div>

          {/* Status Absen Siswa */}
          {isStudent ? (
            <div>
              {attendance.status === "loading" ? (
                <p className="py-4 text-sm text-slate-500">
                  Memuat status absensi…
                </p>
              ) : null}
              {attendance.status === "error" ? (
                <div
                  role="alert"
                  className="flex items-center gap-2 py-4 text-sm text-danger"
                >
                  <span>Gagal memuat status absensi.</span>
                  <button
                    type="button"
                    onClick={reloadAttendance}
                    className="font-medium underline"
                  >
                    Coba lagi
                  </button>
                </div>
              ) : null}
              {attendance.status === "ready" ? (
                <StatusAbsen isPresent={attendance.isPresent} />
              ) : null}
            </div>
          ) : null}

          {/* Grid Fitur */}
          <FeatureGrid features={features} />
        </XPadding>
      </div>
    </div>
  );
}
