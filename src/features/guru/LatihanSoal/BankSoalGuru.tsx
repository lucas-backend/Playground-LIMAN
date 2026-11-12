import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "../../../components/Header";
import XPadding from "../../../components/XPadding";
import { useUser } from "../../dashboard/UserContext";
import { listQuestionBanks, type QuestionBankScope } from "../../quiz/api/quizApi";
import { queryKeys } from "../../../shared/server-state/queryKeys";

export default function BankSoalGuru() {
  const { authUser } = useUser();
  const [scope, setScope] = useState<QuestionBankScope>("latihan");
  const banks = useQuery({
    queryKey: queryKeys.questionBank.list({ scope, ownerId: authUser?.id }),
    queryFn: () => listQuestionBanks({ scope, ownerId: authUser?.id, pageSize: 100 }),
    enabled: Boolean(authUser?.roles?.includes("guru_mapel")),
  });

  if (!authUser?.roles?.includes("guru_mapel")) return <p className="p-8">Akses bank soal guru ditolak.</p>;
  return <div>
    <Header title="Bank Soal" />
    <XPadding>
      <div className="mt-8 grid grid-cols-2 gap-3">
        {(["latihan", "ujian"] as const).map((value) => (
          <button key={value} type="button" onClick={() => setScope(value)}
            className={`rounded-full border p-2 ${scope === value ? "bg-blue-500 text-white" : ""}`}>
            {value === "latihan" ? "Latihan" : "Ujian"}
          </button>
        ))}
      </div>
      {banks.isLoading && <p className="mt-6">Memuat bank soal...</p>}
      {banks.error && <p className="mt-6">Bank soal tidak dapat dimuat.</p>}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {banks.data?.items.map((bank) => (
          <div key={bank.id} className="rounded-lg border border-black/15 p-4">
            <p className="font-semibold">{bank.scope}</p>
            <p className="text-sm">{bank.questionCount} Soal</p>
            <p className="mt-2 text-xs text-black/60">Pemilik: {bank.ownerId}</p>
          </div>
        ))}
      </div>
    </XPadding>
  </div>;
}
