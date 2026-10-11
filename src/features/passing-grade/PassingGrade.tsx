import { useNavigate } from "react-router-dom";

import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";

// === DATA DUMMY ===
const UNIVERSITIES = [
  "Universitas A",
  "Universitas B",
  "Universitas C",
  "Universitas D",
  "Universitas E",
  "Universitas F",
  "Universitas G",
  "Universitas H",
  "Universitas I",
  "Universitas J",
  "Universitas J",
  "Universitas J",
  "Universitas J",
  "Universitas J",
  "Universitas JSSS",
];

export default function PassingGrade() {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-hidden">
      {/* HEADER - TIDAK IKUT SCROLL */}
      <Header title="Passing Grade" />

      <XPadding>
        <div className="h-full flex flex-col max-h-screen">
          {/* SEARCH - TIDAK IKUT SCROLL */}
          <div className="mt-8 relative mb-6 shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>

            <input
              type="text"
              placeholder="Cari Universitas"
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-base placeholder-gray-400 text-gray-700 outline-none focus:border-gray-300 shadow-sm transition-all"
            />
          </div>

          {/* DAFTAR UNIVERSITAS - HANYA BAGIAN INI YANG SCROLL */}
          <div className="flex-1 min-h-0 overflow-y-auto pl-2 pr-2">
            <div className="flex flex-col gap-6 pb-30">
              {UNIVERSITIES.map((uni, idx) => (
                <div
                  key={idx}
                  className="flex flex-col text-left cursor-pointer"
                  onClick={() => {
                    navigate("/passing_grade/1");
                  }}
                >
                  <h3 className="text-gray-800 text-base font-medium mb-1 hover:text-blue-600 transition-colors">
                    {uni}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </XPadding>
    </div>
  );
}