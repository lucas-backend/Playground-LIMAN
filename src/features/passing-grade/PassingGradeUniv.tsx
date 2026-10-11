import { useParams } from "react-router-dom";

import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import EmptyState from "@/shared/components/state/EmptyState";
import ErrorState from "@/shared/components/state/ErrorState";

import MajorList from "./components/MajorList";
import PassingGradeSearch from "./components/PassingGradeSearch";
import { usePassingGradeUniversity } from "./hooks/usePassingGradeUniversity";
import { decodeUniversityParam } from "./model/passingGrade";

// Daftar jurusan untuk satu universitas (FR-PG-001). Param route
// `:passing_grade_id` dipertahankan; pada mock nilainya dipakai sebagai kunci
// `university` (lihat `model/passingGrade.ts`).
export default function PassingGradeUniv() {
  const { passing_grade_id } = useParams();
  const university = decodeUniversityParam(passing_grade_id);

  // `key` me-reset state hook saat universitas berubah (route yang sama).
  return <UniversityMajors key={university} university={university} />;
}

function UniversityMajors({ university }: { university: string }) {
  const { state, grades, query, setQuery, reload } =
    usePassingGradeUniversity(university);

  return (
    <div className="h-screen overflow-hidden">
      {/* TIDAK IKUT SCROLL */}
      <Header title="Passing Grade" />

      <XPadding>
        <div className="h-full flex flex-col max-h-screen">
          {/* SEARCH - TIDAK IKUT SCROLL */}
          <div className="mt-8 mb-6 shrink-0">
            <PassingGradeSearch
              placeholder="Cari Jurusan"
              ariaLabel="Cari jurusan"
              value={query}
              onChange={setQuery}
            />
          </div>

          {/* NAMA UNIVERSITAS - TIDAK IKUT SCROLL */}
          <h2 className="text-xl font-medium text-gray-900 mb-6 pl-2 shrink-0">
            {university}
          </h2>

          {/* HANYA BAGIAN INI YANG BISA DI-SCROLL */}
          <div className="flex-1 min-h-0 overflow-y-auto pl-2 pr-2">
            {state.status === "loading" ? (
              <p role="status" className="py-4 text-sm text-gray-500">
                Memuat jurusan…
              </p>
            ) : null}

            {state.status === "error" ? (
              <ErrorState
                description="Gagal memuat daftar jurusan."
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
            ) : null}

            {state.status === "ready" ? (
              grades.length > 0 ? (
                <MajorList grades={grades} />
              ) : (
                <EmptyState
                  title="Jurusan tidak ditemukan"
                  description="Coba ubah kata kunci pencarian."
                />
              )
            ) : null}
          </div>
        </div>
      </XPadding>
    </div>
  );
}
