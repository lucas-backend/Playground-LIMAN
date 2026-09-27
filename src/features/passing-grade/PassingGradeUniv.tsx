import Header from "../../components/Header";
import XPadding from "../../components/XPadding";

const MAJORS = [
  { name: "Jurusan A", passingGrade: 78, capacity: 78, tightness: 78 },
  { name: "Jurusan B", passingGrade: 78, capacity: 78, tightness: 78 },
  { name: "Jurusan C", passingGrade: 78, capacity: 78, tightness: 78 },
  { name: "Jurusan D", passingGrade: 78, capacity: 78, tightness: 78 },
  { name: "Jurusan E", passingGrade: 78, capacity: 78, tightness: 78 },
  { name: "Jurusan E", passingGrade: 78, capacity: 78, tightness: 78 },
  { name: "Jurusan E", passingGrade: 78, capacity: 78, tightness: 78 },
  { name: "Jurusan E", passingGrade: 78, capacity: 78, tightness: 78 },
  { name: "Jurusan ESSS", passingGrade: 78, capacity: 78, tightness: 78 },
];

export default function PassingGradeUniv() {
  return (
    <div className="h-screen overflow-hidden">
      {/* TIDAK IKUT SCROLL */}
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
              placeholder="Cari Jurusan"
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-base placeholder-gray-400 text-gray-700 outline-none focus:border-gray-300 shadow-sm transition-all"
            />
          </div>

          {/* NAMA UNIVERSITAS - TIDAK IKUT SCROLL */}
          <h2 className="text-xl font-medium text-gray-900 mb-6 pl-2 shrink-0">
            Universitas A
          </h2>

          {/* ================================================= */}
          {/* HANYA BAGIAN INI YANG BISA DI-SCROLL             */}
          {/* ================================================= */}
          <div className="flex-1 min-h-0 overflow-y-auto pl-2 pr-2">
            <div className="flex flex-col gap-6 pb-30">
              {MAJORS.map((major, idx) => (
                <div key={idx} className="flex flex-col text-left">
                  <h3 className="text-gray-800 text-base font-medium mb-1">
                    {major.name}
                  </h3>

                  <div className="text-xs text-gray-500 font-normal space-y-0.5 leading-relaxed tracking-wide">
                    <div>
                      Passing Grade: {major.passingGrade}
                    </div>

                    <div>
                      Daya Tampung: {major.capacity}
                    </div>

                    <div>
                      Keketatan: {major.tightness}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </XPadding>
    </div>
  );
}