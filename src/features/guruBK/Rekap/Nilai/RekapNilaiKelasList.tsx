import { useNavigate, useParams } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import KelasCard from "@/shared/components/ui/KelasCard";
import { REKAP_BASE } from "../shared.constants";

export default function RekapNilaiKelasList() {
  const { jenjang = "10" } = useParams();
  const navigate = useNavigate();

  const kelas = [1, 2, 3].map((n) => ({
    id: `${jenjang}-ipa-${n}`,
    nama: `KELAS ${jenjang} IPA ${n}`,
  }));

  return (
    <div>
      <Header title="Rekap" />
      <XPadding className="mt-8">
        <h3 className="text-sm font-semibold">Daftar Kelas</h3>
        {kelas.map((k) => (
          <KelasCard
            key={k.id}
            label={k.nama}
            iconBg="bg-blue-200"
            iconColor="text-blue-500"
            onClick={() => navigate(`${REKAP_BASE}/nilai/kelas/${k.id}`)}
          />
        ))}
      </XPadding>
    </div>
  );
}