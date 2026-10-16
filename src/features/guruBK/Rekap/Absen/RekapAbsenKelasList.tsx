import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../../components/Header";
import XPadding from "../../../../components/XPadding";
import KelasCard from "../../../../components/KelasCard";
import { REKAP_BASE } from "../constants";

export default function RekapAbsenKelasList() {
  const { jenjang = "10" } = useParams();
  const navigate = useNavigate();

  // Dummy, ganti dengan data API
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
            onClick={() => navigate(`${REKAP_BASE}/absen/kelas/${k.id}`)}
          />
        ))}
      </XPadding>
    </div>
  );
}