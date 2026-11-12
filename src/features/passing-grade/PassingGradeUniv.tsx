import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import XPadding from "../../components/XPadding";
import { getPassingGrade } from "./api/passingGradeApi";
import { queryKeys } from "../../shared/server-state/queryKeys";
import { ApiErrorState } from "../../shared/components/ApiState";

export default function PassingGradeUniv() {
  const { passing_grade_id } = useParams();
  const detail = useQuery({
    queryKey: queryKeys.passingGrade.detail(passing_grade_id ?? ""),
    queryFn: () => getPassingGrade(passing_grade_id!),
    enabled: Boolean(passing_grade_id),
  });

  return (
    <div className="min-h-screen">
      <Header title="Passing Grade" />
      <XPadding>
        {detail.isLoading && <p className="mt-8">Memuat detail...</p>}
        {detail.isError && <div className="mt-8"><ApiErrorState error={detail.error} onRetry={() => void detail.refetch()} /></div>}
        {detail.data && (
          <article className="mt-8 space-y-3">
            <h2 className="text-xl font-semibold">{detail.data.university}</h2>
            <p>{detail.data.major}</p>
            <p>Passing grade: {detail.data.score}</p>
            <p className="text-sm text-gray-500">Tahun: {detail.data.year}</p>
          </article>
        )}
      </XPadding>
    </div>
  );
}
