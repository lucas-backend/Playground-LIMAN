import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useNavigate } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";

const rekomendasi = ["Teknik Informatika", "Sistem Informasi", "Ilmu Komputer"];
const targetLain = ["Teknik Kimia"];

function JurusanButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-2 flex w-full max-w-[220px] items-center justify-between rounded-md bg-blue-600 px-3 py-1.5 text-left text-xs font-semibold text-white hover:bg-blue-700"
    >
      <span>{label}</span>
      <ArrowRightIcon fontSize="small" />
    </button>
  );
}

export default function MinatBakatSiswa() {
  const navigate = useNavigate();

  const lihatHasil = (jurusan: string) =>
    navigate(`hasil?jurusan=${encodeURIComponent(jurusan)}`);

  return (
    <div>
      <Header title="Minat Bakat" />
      <XPadding className="mt-6">
        <h3 className="text-base font-semibold">Dipa Rama</h3>
        <p className="text-xs text-gray-500">Kelas 10 IPA 1</p>

        <div className="mt-5 space-y-1 text-xs font-semibold">
          <p>Minat:</p>
          <p>Bakat:</p>
          <p>Rekomendasi Jurusan:</p>
        </div>

        {rekomendasi.map((j, i) => (
          <JurusanButton key={j} label={`${i + 1}. ${j}`} onClick={() => lihatHasil(j)} />
        ))}

        <p className="mt-5 text-xs font-semibold">Target Jurusan Lain</p>
        {targetLain.map((j, i) => (
          <JurusanButton key={j} label={`${i + 1}. ${j}`} onClick={() => lihatHasil(j)} />
        ))}
      </XPadding>
    </div>
  );
}