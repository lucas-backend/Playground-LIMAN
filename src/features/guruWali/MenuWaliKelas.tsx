import { useState, type ReactNode } from "react";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { useNavigate, useParams } from "react-router-dom";

import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import EmptyState from "@/shared/components/state/EmptyState";
import ErrorState from "@/shared/components/state/ErrorState";

import CetakButton from "./absensi/components/CetakButton";
import MenuTabAbsensi from "./absensi/components/MenuTabAbsensi";
import MenuTabKonseling from "./absensi/components/MenuTabKonseling";
import MenuTabRapot from "./absensi/components/MenuTabRapot";
import { useWaliKelas } from "./absensi/hooks/useWaliKelas";

type MenuTab = "Absensi" | "Rapot" | "Catatan Konseling";

const TABS: { name: MenuTab; icon: ReactNode }[] = [
  { name: "Absensi", icon: <AutoStoriesIcon className="text-slate-700" /> },
  { name: "Rapot", icon: <AssignmentOutlinedIcon className="text-slate-700" /> },
  {
    name: "Catatan Konseling",
    icon: (
      <EditNoteOutlinedIcon className="text-slate-700" style={{ fontSize: 28 }} />
    ),
  },
];

// Menu kelas perwalian (FR-ABS-003). Tab Absensi, Rapot, dan Catatan Konseling
// hanya berbagi daftar siswa perwalian; tab Rapot/Konseling sebatas navigasi ke
// modulnya masing-masing (#13/#14).
export default function MenuWaliKelas() {
  const { kelas_id } = useParams();
  const kelasId = kelas_id ?? "";

  // `key` me-reset state hook saat kelas berubah (route yang sama).
  return <MenuWaliKelasContent key={kelasId} kelasId={kelasId} />;
}

function MenuWaliKelasContent({ kelasId }: { kelasId: string }) {
  const navigate = useNavigate();
  const { state, reload } = useWaliKelas(kelasId);
  const [activeTab, setActiveTab] = useState<MenuTab>("Catatan Konseling");

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between pb-6 text-slate-800">
      <div>
        <Header title="Wali Kelas" />

        {state.status === "loading" ? (
          <XPadding className="mt-4">
            <p role="status" className="text-sm text-slate-500">
              Memuat data kelas…
            </p>
          </XPadding>
        ) : null}

        {state.status === "error" ? (
          <XPadding className="mt-4">
            <ErrorState
              description="Gagal memuat data kelas."
              action={
                <button
                  type="button"
                  onClick={reload}
                  className="font-medium text-brand-500 underline"
                >
                  Coba lagi
                </button>
              }
            />
          </XPadding>
        ) : null}

        {state.status === "ready" ? (
          state.data.siswa.length === 0 ? (
            <XPadding className="mt-4">
              <EmptyState
                title="Belum ada siswa"
                description="Kelas ini belum memiliki siswa perwalian."
              />
            </XPadding>
          ) : (
            <>
              {/* Navigasi Tab */}
              <XPadding className="mt-4">
                <div className="flex gap-3 justify-between">
                  {TABS.map((tab) => {
                    const isActive = activeTab === tab.name;
                    return (
                      <button
                        key={tab.name}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setActiveTab(tab.name)}
                        className={`flex-1 flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                          isActive
                            ? "bg-blue-50 border-blue-500 shadow-sm"
                            : "bg-white border-slate-300"
                        }`}
                      >
                        <div className="h-8 flex items-center justify-center mb-1">
                          {tab.icon}
                        </div>
                        <span className="text-xs font-medium text-center leading-tight">
                          {tab.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </XPadding>

              {activeTab === "Absensi" ? (
                <MenuTabAbsensi
                  kelas={state.data.kelas}
                  siswa={state.data.siswa}
                  onDetail={(siswaId) =>
                    navigate(`/guruWali/absensi/siswa/${siswaId}`)
                  }
                />
              ) : null}

              {activeTab === "Rapot" ? (
                <MenuTabRapot
                  siswa={state.data.siswa}
                  onDetail={(siswaId) =>
                    navigate(`/guruWali/rapot/siswa/${siswaId}`)
                  }
                />
              ) : null}

              {activeTab === "Catatan Konseling" ? (
                <MenuTabKonseling
                  siswa={state.data.siswa}
                  onDetail={(siswaId) =>
                    navigate(`/guruWali/konseling/siswa/${siswaId}`)
                  }
                />
              ) : null}
            </>
          )
        ) : null}
      </div>

      {state.status === "ready" && state.data.siswa.length > 0 ? (
        <CetakButton />
      ) : null}
    </div>
  );
}
