import { useState } from "react";
import Header from "../../../components/Header";
import XPadding from "../../../components/XPadding";
import FeedIcon from '@mui/icons-material/Feed';
import TimerIcon from '@mui/icons-material/Timer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";

// Daftar tab
const TABS = ["Ulangan Harian", "PTS", "PAS"];

export default function UjianSoalGuru() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFDF6] relative">
      <Header title="Ujian Soal" />
      <XPadding>
        {/* Tab */}
        <div className="mt-4 flex gap-3">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "border-[#1E88E5]/40 bg-blue-100 text-gray-900"
                    : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {/* Card Ujian Soal */}
          <div className="rounded-2xl bg-[#1E88E5] p-5 text-white shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium opacity-90">Matematika</p>
                <h2 className="mt-1 text-xl font-bold tracking-wide">
                  {activeTab} 1
                </h2>
              </div>
              <button className="rounded-lg bg-white px-5 py-1.5 text-xs font-semibold text-[#1E88E5] transition hover:bg-opacity-90">
                Detail
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-y-3 text-xs font-medium">
              <div className="flex items-center gap-2">
                <span className="text-sm"><FeedIcon fontSize="small" /></span>
                <span>20 Soal</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-sm"><CalendarMonthIcon fontSize="small" /></span>
                <span>10 Januari 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm"><TimerIcon fontSize="small" /></span>
                <span>07.00-08.30 (90 menit)</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-xs">Lokasi:</span>
                <span>Online</span>
              </div>
            </div>
          </div>

          {/* Tombol Buat Baru */}
          <div className="flex justify-end">
            <button
              onClick={() => setIsPopupOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#1E88E5] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
            >
              <span>+ Buat Baru</span>
            </button>
          </div>
        </div>
      </XPadding>

      {/* Backdrop & Pop-up Modal */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={() => setIsPopupOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-gray-900 leading-tight">
              Bagaimana anda ingin menambah soal?
            </h3>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              Silahkan pilih sumber soal
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Opsi 1: Bank Soal */}
              <button
                onClick={() => {
                  navigate("/guru/ujian/bankSoal");
                  setIsPopupOpen(false);
                }}
                className="flex flex-col items-start justify-between border-2 border-gray-200 rounded-xl p-4 h-28 text-left transition hover:border-[#1E88E5] hover:bg-blue-50/30 group"
              >
                <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-[#1E88E5]">
                  <FeedIcon fontSize="small" />
                </div>
                <span className="text-sm font-bold text-gray-800 group-hover:text-[#1E88E5]">
                  Bank Soal
                </span>
              </button>

              {/* Opsi 2: Buat soal sendiri */}
              <button
                onClick={() => {
                  navigate("/guru/ujian/tambahSoal");
                  setIsPopupOpen(false);
                }}
                className="flex flex-col items-start justify-between border-2 border-gray-200 rounded-xl p-4 h-28 text-left transition hover:border-[#1E88E5] hover:bg-blue-50/30 group"
              >
                <div className="w-8 h-8 flex items-center justify-center text-[#1E88E5] border border-blue-200 rounded">
                  <AddIcon />
                </div>
                <span className="text-sm font-bold text-gray-800 group-hover:text-[#1E88E5]">
                  Buat soal sendiri
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}