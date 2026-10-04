import React, { useState } from "react";
import Header from "../../components/Header";
import XPadding from "../../components/XPadding";

// Import Ikon Material UI
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";

// Dummy data siswa sesuai gambar
const dataSiswa = [
  { nama: "Yaza Nurzahira", h: 8, i: 0, s: 0, a: 0, d: 0, persentase: "100%" },
  ...Array(10).fill({
    nama: "Nama Siswa",
    h: 8,
    i: 0,
    s: 0,
    a: 0,
    d: 0,
    persentase: "100%",
  }),
];

interface TabItem {
  tabName: string;
  icon: React.ReactNode;
}

const tabs: TabItem[] = [
  {
    tabName: "Absensi",
    icon: <AutoStoriesIcon className="text-slate-700" />,
  },
  {
    tabName: "Rapot",
    icon: <AssignmentOutlinedIcon className="text-slate-700" />,
  },
  {
    tabName: "Catatan Konseling",
    icon: (
      <EditNoteOutlinedIcon
        className="text-slate-700"
        style={{ fontSize: 28 }}
      />
    ),
  },
];

export default function MenuWaliKelas() {
  const navigate = useNavigate();
  // Diubah default-nya ke Catatan Konseling sesuai gambar terbaru kamu
  const [activeTab, setActiveTab] = useState("Catatan Konseling");

  return (
    <div className="min-h-screen bg-[#FFFDF6] flex flex-col justify-between pb-6 text-slate-800">
      <div>
        <Header title="Wali Kelas" />

        {/* Navigasi Tab */}
        <XPadding className="mt-4">
          <div className="flex gap-3 justify-between">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.tabName;
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(tab.tabName)}
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
                    {tab.tabName}
                  </span>
                </button>
              );
            })}
          </div>
        </XPadding>

        {/* KONTEN KONDISIONAL BERDASARKAN TAB */}
        {activeTab === "Absensi" && (
          <>
            {/* Judul Kelas */}
            <XPadding className="mt-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Kelas 12 IPA 1
              </h2>
            </XPadding>

            {/* Tabel Data Absensi */}
            <XPadding className="mt-2">
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-center border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-white">
                      <th
                        rowSpan={2}
                        className="py-3 px-4 text-left font-semibold border-r border-slate-200 w-1/3"
                      >
                        Nama
                      </th>
                      <th
                        colSpan={5}
                        className="py-1.5 font-semibold border-b border-slate-200"
                      >
                        Total Absen
                      </th>
                      <th
                        rowSpan={2}
                        className="py-3 px-2 font-semibold border-l border-slate-200"
                      >
                        Detail
                      </th>
                    </tr>
                    <tr className="border-b border-slate-200 bg-white text-xs font-medium text-slate-600">
                      <th className="py-1 border-r border-slate-100">H</th>
                      <th className="py-1 border-r border-slate-100">I</th>
                      <th className="py-1 border-r border-slate-100">S</th>
                      <th className="py-1 border-r border-slate-100">A</th>
                      <th className="py-1">D</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataSiswa.map((siswa, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-100 last:border-none hover:bg-slate-50"
                      >
                        <td className="py-3 px-4 text-left font-medium text-slate-900 border-r border-slate-200 truncate max-w-[120px]">
                          {siswa.nama}
                        </td>
                        <td className="py-3 border-r border-slate-100 text-slate-700">
                          {siswa.h}
                        </td>
                        <td className="py-3 border-r border-slate-100 text-slate-700">
                          {siswa.i}
                        </td>
                        <td className="py-3 border-r border-slate-100 text-slate-700">
                          {siswa.s}
                        </td>
                        <td className="py-3 border-r border-slate-100 text-slate-700">
                          {siswa.a}
                        </td>
                        <td className="py-3 text-slate-700">{siswa.d}</td>
                        <td className="py-3 border-l border-slate-200">
                          <button
                            className="text-blue-500 hover:text-blue-600 inline-flex items-center justify-center"
                            onClick={() =>
                              navigate("/guruWali/absensi/siswa/1")
                            }
                          >
                            <VisibilityIcon style={{ fontSize: 20 }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </XPadding>
          </>
        )}

        {activeTab === "Rapot" && (
          <>
            {/* List Tampilan Rapot */}
            <div className="mt-6 border-t border-slate-300">
              <div className="flex justify-between items-center bg-transparent py-3 px-6 text-sm font-bold text-slate-900 border-b border-slate-300">
                <span className="w-1/2 text-left">Nama Siswa</span>
                <span className="w-1/2 text-right pr-8">Persentase Nilai</span>
              </div>
              <div>
                {dataSiswa.map((siswa, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-3.5 px-6 border-b border-slate-200 bg-transparent text-sm"
                  >
                    <span className="w-1/2 text-left font-medium text-slate-900 truncate">
                      {siswa.nama}
                    </span>
                    <div className="w-1/2 flex items-center justify-end gap-4">
                      <span className="inline-block bg-[#c8e6c9] text-[#2e7d32] text-xs font-semibold px-4 py-1.5 rounded-full border border-[#a5d6a7] min-w-[65px] text-center">
                        {siswa.persentase}
                      </span>
                      <button
                        onClick={() => navigate(`/guruWali/rapot/siswa/${idx}`)}
                        className="text-slate-400 hover:text-slate-600 p-0.5 inline-flex items-center justify-center"
                      >
                        <PlayArrowIcon style={{ fontSize: 18 }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "Catatan Konseling" && (
          <>
            {/* List Tampilan Catatan Konseling Sesuai Gambar */}
            <div className="mt-6">
              {/* Label Sub-header Biru */}
              <XPadding className="mb-4">
                <h3 className="text-base font-semibold text-[#1e88e5]">
                  Daftar Siswa
                </h3>
              </XPadding>

              {/* Baris List Siswa */}
              <div className="flex flex-col">
                {dataSiswa.map((siswa, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-3 px-6 bg-transparent text-sm"
                  >
                    {/* Sisi Kiri: Nama Siswa */}
                    <span className="font-semibold text-slate-900 truncate pr-4">
                      {siswa.nama}
                    </span>

                    {/* Sisi Kanan: Button Lihat Catatan Biru */}
                    <button
                      onClick={() =>
                        navigate(`/guruWali/konseling/siswa/${idx}`)
                      }
                      className="bg-[#1e88e5] hover:bg-blue-600 text-white text-xs font-medium px-4 py-1.5 rounded-lg shadow-sm transition active:scale-[0.98] whitespace-nowrap"
                    >
                      Lihat catatan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tombol Aksi Cetak di Bagian Bawah */}
      <XPadding className="mt-6 mb-2">
        <button className="w-full bg-[#1e88e5] text-white font-medium py-3.5 rounded-2xl shadow-md hover:bg-blue-600 transition active:scale-[0.99] text-base tracking-wide">
          Cetak
        </button>
      </XPadding>
    </div>
  );
}
