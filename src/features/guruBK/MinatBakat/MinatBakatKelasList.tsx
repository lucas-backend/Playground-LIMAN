import { useNavigate, useParams } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import KelasCard from "./KelasCard";

// Dummy, nanti ganti dengan data API berdasarkan jenjang
const getKelas = (jenjang: string) => [
  { id: `${jenjang}-ipa-1`, nama: `KELAS ${jenjang} IPA 1` },
  { id: `${jenjang}-ipa-2`, nama: `KELAS ${jenjang} IPA 2` },
  { id: `${jenjang}-ipa-3`, nama: `KELAS ${jenjang} IPA 3` },
];

export default function MinatBakatKelasList() {
  const { jenjang = "10" } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <Header title="Minat Bakat" />
      <XPadding className="mt-8">
        <h3 className="text-base font-semibold">Daftar Kelas</h3>
        {getKelas(jenjang).map((k) => (
          <KelasCard
            key={k.id}
            label={k.nama}
            onClick={() => navigate(`../kelas/${k.id}`)}
          />
        ))}
      </XPadding>
    </div>
  );
}