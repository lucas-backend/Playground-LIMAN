import { useNavigate } from "react-router-dom";
import XPadding from "@/shared/components/layout/XPadding";
import KelasCard from "@/shared/components/ui/KelasCard";
import { REKAP_BASE } from "../shared.constants";

const jenjangList = [
  { jenjang: "10", iconBg: "bg-green-200", iconColor: "text-green-600" },
  { jenjang: "11", iconBg: "bg-indigo-100", iconColor: "text-indigo-300" },
  { jenjang: "12", iconBg: "bg-blue-200", iconColor: "text-blue-500" },
];

export default function RekapNilai() {
  const navigate = useNavigate();
  return (
    <XPadding className="mt-5">
      <h3 className="text-sm font-semibold">Jenjang Kelas</h3>
      {jenjangList.map((j) => (
        <KelasCard
          key={j.jenjang}
          label={`KELAS ${j.jenjang}`}
          iconBg={j.iconBg}
          iconColor={j.iconColor}
          onClick={() => navigate(`${REKAP_BASE}/nilai/${j.jenjang}/kelas`)}
        />
      ))}
    </XPadding>
  );
}