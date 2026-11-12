import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import XPadding from "../../components/XPadding";
import { listPassingGrades } from "./api/passingGradeApi";
import { queryKeys } from "../../shared/server-state/queryKeys";
import { ApiErrorState, EmptyState } from "../../shared/components/ApiState";
import { Pagination } from "../../shared/server-state/Pagination";

export default function PassingGrade() {
  const navigate = useNavigate();
  const [university, setUniversity] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const grades = useQuery({
    queryKey: queryKeys.passingGrade.list({ university, page, pageSize }),
    queryFn: () => listPassingGrades({ university: university || undefined, page, pageSize }),
  });

  return (
    <div className="min-h-screen">
      <Header title="Passing Grade" />
      <XPadding>
        <div className="mt-8 mb-6">
          <input
            value={university}
            onChange={(event) => { setUniversity(event.target.value); setPage(1); }}
            placeholder="Cari Universitas"
            className="w-full rounded-full border border-gray-200 bg-white px-4 py-3 shadow-sm outline-none"
          />
        </div>
        {grades.isLoading && <p>Memuat passing grade...</p>}
        {grades.isError && <ApiErrorState error={grades.error} onRetry={() => void grades.refetch()} />}
        {grades.data?.items.length === 0 && <EmptyState>Tidak ada passing grade.</EmptyState>}
        <div className="space-y-4">
          {grades.data?.items.map((item) => (
            <button key={item.id} type="button" onClick={() => navigate(`/passing_grade/${item.id}`)} className="block w-full text-left">
              <h3 className="font-medium text-gray-800">{item.university}</h3>
              <p className="text-sm text-gray-500">{item.major} · {item.score} · {item.year}</p>
            </button>
          ))}
        </div>
        {grades.data && grades.data.total > 0 && <Pagination meta={grades.data} onPageChange={setPage} />}
      </XPadding>
    </div>
  );
}
