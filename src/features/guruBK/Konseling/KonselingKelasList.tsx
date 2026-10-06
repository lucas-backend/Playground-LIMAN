import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import XPadding from "../../../components/XPadding";

type Kelas = {
  id: string;
  nama: string;
  catatanBaru: number; // jumlah catatan baru, 0 = badge disembunyikan
  iconBg: string;
  iconColor: string;
};

const kelasList: Kelas[] = [
  { id: "10-ipa-1", nama: "KELAS 10 IPA 1", catatanBaru: 3, iconBg: "bg-green-200", iconColor: "text-green-600" },
  { id: "11-ipa-2", nama: "KELAS 11 IPA 2", catatanBaru: 0, iconBg: "bg-indigo-100", iconColor: "text-indigo-300" },
  { id: "12-ipa-3", nama: "KELAS 12 IPA 3", catatanBaru: 0, iconBg: "bg-blue-200", iconColor: "text-blue-500" },
];

export default function KonselingKelasList() {
  const navigate = useNavigate();

  return (
    <XPadding className="mt-8">
      <h3 className="font-semibold text-base">Daftar Kelas</h3>

      {kelasList.map((kelas) => (
        <button
          key={kelas.id}
          onClick={() => navigate(`kelas/${kelas.id}`)}
          className="relative mt-4 flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-white p-2 text-left shadow-sm hover:bg-gray-50"
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-md ${kelas.iconBg} ${kelas.iconColor}`}
          >
            <StarIcon fontSize="small" />
          </div>

          <span className="font-semibold text-sm">{kelas.nama}</span>

          {kelas.catatanBaru > 0 && (
            <span className="absolute -top-2 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
              {kelas.catatanBaru}
            </span>
          )}
        </button>
      ))}
    </XPadding>
  );
}