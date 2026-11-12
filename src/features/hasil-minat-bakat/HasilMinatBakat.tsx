import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Header from "../../components/Header";
import XPadding from "../../components/XPadding";

import HistoryIcon from "@mui/icons-material/History";
import { useUser } from "../dashboard/UserContext";
import { createTargetMajor, getAptitudeResults } from "../aptitude/api/aptitudeApi";
import { queryKeys } from "../../shared/server-state/queryKeys";
import { ApiErrorState, EmptyState } from "../../shared/components/ApiState";
import { apiErrorMessage } from "../../shared/components/apiErrorMessage";

export default function HasilMinatBakat() {
  const { authUser } = useUser();
  const queryClient = useQueryClient();
  const studentId = authUser?.id;
  const [major, setMajor] = useState("");
  const [targetJurusanLain, setTargetJurusanLain] = useState<string[]>([]);
  const results = useQuery({
    queryKey: queryKeys.aptitude.studentResults(studentId ?? ""),
    queryFn: () => getAptitudeResults(studentId!),
    enabled: Boolean(studentId && authUser?.roles?.includes("siswa")),
  });
  const targetMutation = useMutation({
    mutationFn: (value: string) => createTargetMajor(studentId!, value),
    onSuccess: async (target) => {
      setTargetJurusanLain((current) => [...current, target.major]);
      setMajor("");
      await queryClient.invalidateQueries({ queryKey: queryKeys.aptitude.targetMajors(studentId!) });
    },
  });

  if (!authUser?.roles?.includes("siswa")) return <p className="p-8">Akses hasil siswa ditolak.</p>;
  if (results.isLoading) return <p className="p-8">Memuat hasil tes...</p>;
  if (results.isError) return <div className="p-8"><ApiErrorState error={results.error} onRetry={() => void results.refetch()} /></div>;
  const aptitudeResults = results.data?.results ?? [];

  return (
    <div>
      <Header title="Hasil Tes" />

      <XPadding>
        {/* Waktu Tes */}
        <div className="flex gap-2 mt-8 text-black/50">
          <HistoryIcon />
          <span>Hasil tes</span>
        </div>

        {/* Minat, Bakat, Rekomendasi */}
        <div className="flex flex-col mt-9">
          {aptitudeResults.length === 0 && <EmptyState>Belum ada hasil aptitude.</EmptyState>}
          {aptitudeResults.map((item) => (
            <div key={item.id} className="rounded-lg border border-gray-200 p-3">
              <p>{item.result}</p>
              <small className="text-black/50">{new Date(item.assessedAt).toLocaleString()}</small>
            </div>
          ))}
        </div>

        {/* Rekomendasi Jurusan */}
        <div className="flex flex-col gap-2 py-2">
          <div className="font-semibold mt-2">
            Target Jurusan Lain
          </div>

          {/* List Target Jurusan */}
          <div className="flex flex-col gap-2">
            {targetJurusanLain.map((jurusan, index) => {
              return (
                <div
                  key={jurusan}
                  className="
                    py-2
                    px-4
                    pr-1.5
                    pb-2.5
                    font-semibold
                    bg-blue-500
                    text-white
                    rounded-lg
                    flex
                    items-center
                    justify-between
                  "
                >
                  {/* Nama jurusan */}
                  <span className="flex-1 text-left">
                    {index + 1}. {jurusan}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Tambah Target Jurusan */}
          <div className="w-full flex justify-start mt-2">
            <form className="flex gap-2" onSubmit={(event) => {
              event.preventDefault();
              if (major.trim()) targetMutation.mutate(major.trim());
            }}>
              <input value={major} onChange={(event) => setMajor(event.target.value)} placeholder="Nama jurusan" className="min-w-0 flex-1 rounded-lg border px-3 py-2" />
              <button
                type="submit"
                disabled={targetMutation.isPending || !major.trim()}
              className="
                bg-green-600
                px-4
                py-2
                rounded-lg
                font-semibold
                text-white
              "
            >
                Tambah
              </button>
            </form>
            {targetMutation.isError && <p className="mt-2 text-sm text-red-600">{apiErrorMessage(targetMutation.error)}</p>}
          </div>
        </div>
      </XPadding>
    </div>
  );
}