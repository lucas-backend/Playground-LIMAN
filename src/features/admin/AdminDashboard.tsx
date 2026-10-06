import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import type { SvgIconComponent } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ManajemenPengguna from "./section/ManajemenPengguna";
import AkademikDanJadwal from "./section/AkademikDanJadwal";
import Presensi from "./section/Presensi";
import NilaiRapor from "./section/NilaiRapor";

type MenuItem = { to: string; label: string; icon: SvgIconComponent };

// Path relatif terhadap route induk (mis. /admin/*)
const menu: MenuItem[] = [
  { to: "/admin/dasbor", label: "Dasbor", icon: DashboardIcon },
  { to: "/admin/manajemenPengguna", label: "Manajemen Pengguna", icon: PersonIcon },
  { to: "/admin/akademikDanJadwal", label: "Akademik & Jadwal", icon: SchoolIcon },
  { to: "/admin/presensi", label: "Presensi", icon: FactCheckIcon },
  { to: "/admin/nilaiRapor", label: "Nilai Rapor", icon: MenuBookIcon },
];

export default function AdminDashboard() {
  return (
    <div className="flex w-full">
      {/* Left Sidebar */}
      <aside className="hidden h-screen w-60 shrink-0 flex-col bg-blue-500 text-white sm:flex">
        {/* Logo, Nama Sekolah, dan Tulisan Admin */}
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-lg font-bold text-orange-500">
            3
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-xs font-medium">
              SMA Negeri 3 Bandar Lampung
            </p>
            <p className="text-[10px] opacity-80">Admin</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="mt-6 flex flex-col gap-2 px-3">
          {menu.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`
              }
            >
              <Icon fontSize="small" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Dynamic Section */}
      <main className="h-screen flex-1 overflow-y-auto bg-[#FFF9F0] p-6 sm:p-8">
        <Routes>
          <Route index element={<Navigate to="akademikDanJadwal" replace />} />
          <Route path="dasbor" element={<div>Dasbor</div>} />
          <Route path="manajemenPengguna" element={<ManajemenPengguna />} />
          <Route path="akademikDanJadwal" element={<AkademikDanJadwal />} />
          <Route path="presensi" element={<Presensi />} />
          <Route path="nilaiRapor" element={<NilaiRapor />} />
        </Routes>
      </main>
    </div>
  );
}