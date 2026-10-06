import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import XPadding from "../../../components/XPadding";
import KelasCard from "./KelasCard";

const jenjangList = [
  { jenjang: "10", iconBg: "bg-green-200", iconColor: "text-green-600" },
  { jenjang: "11", iconBg: "bg-indigo-100", iconColor: "text-indigo-300" },
  { jenjang: "12", iconBg: "bg-blue-200", iconColor: "text-blue-500" },
];

export default function MinatBakatJenjang() {
  const navigate = useNavigate();

  return (
    <div>
      <Header title="Minat Bakat" />
      <XPadding className="mt-8">
        <h3 className="text-base font-semibold">Jenjang Kelas</h3>
        {jenjangList.map((j) => (
          <KelasCard
            key={j.jenjang}
            label={`KELAS ${j.jenjang}`}
            iconBg={j.iconBg}
            iconColor={j.iconColor}
            onClick={() => navigate(`kelasList/${j.jenjang}`)}
          />
        ))}
      </XPadding>
    </div>
  );
}