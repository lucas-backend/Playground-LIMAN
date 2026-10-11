import { useNavigate } from "react-router-dom";

import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import EmptyState from "@/shared/components/state/EmptyState";
import ErrorState from "@/shared/components/state/ErrorState";

import PassingGradeSearch from "./components/PassingGradeSearch";
import UniversityList from "./components/UniversityList";
import { usePassingGradeList } from "./hooks/usePassingGradeList";

// Daftar universitas (FR-PG-001). Data berasal dari adapter mock
// (`api/passingGradeApi.ts`), bukan mock inline di komponen.
export default function PassingGrade() {
  const navigate = useNavigate();
  const { state, universities, query, setQuery, reload } = usePassingGradeList();

  return (
    <div className="h-screen overflow-hidden">
      {/* HEADER - TIDAK IKUT SCROLL */}
      <Header title="Passing Grade" />

      <XPadding>
        <div className="h-full flex flex-col max-h-screen">
          {/* SEARCH - TIDAK IKUT SCROLL */}
          <div className="mt-8 mb-6 shrink-0">
            <PassingGradeSearch
              placeholder="Cari Universitas"
              ariaLabel="Cari universitas"
              value={query}
              onChange={setQuery}
            />
          </div>

          {/* DAFTAR UNIVERSITAS - HANYA BAGIAN INI YANG SCROLL */}
          <div className="flex-1 min-h-0 overflow-y-auto pl-2 pr-2">
            {state.status === "loading" ? (
              <p role="status" className="py-4 text-sm text-gray-500">
                Memuat passing grade…
              </p>
            ) : null}

            {state.status === "error" ? (
              <ErrorState
                description="Gagal memuat daftar universitas."
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
              universities.length > 0 ? (
                <UniversityList
                  universities={universities}
                  onSelect={(university) =>
                    navigate(`/passing_grade/${encodeURIComponent(university)}`)
                  }
                />
              ) : (
                <EmptyState
                  title="Universitas tidak ditemukan"
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
