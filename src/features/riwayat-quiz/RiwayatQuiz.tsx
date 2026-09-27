import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import XPadding from "../../components/XPadding";
import { TabelRiwayat } from "./TabelRiwayat";

const historyData = [
  { no: 1, date: "11/11/2026" },
  { no: 2, date: "12/11/2026" },
  { no: 3, date: "13/11/2026" },
  { no: 4, date: "14/11/2026" },
];

export default function RiwayatQuiz() {
  const navigate = useNavigate();
  const handleView = (id: number) => {
    navigate(`/quiz_result/${id}`);
  };
  return (
    <div>
      <Header title="Riwayat" />
      <XPadding>
        <TabelRiwayat data={historyData} onViewDetails={handleView} />
      </XPadding>
    </div>
  );
}
