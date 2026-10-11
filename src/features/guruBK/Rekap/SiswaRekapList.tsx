import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import { Badge, CetakButton } from "./shared";

type Row = { id: number; nama: string; persen: number };

type Props = {
  headerTitle: string;
  kelas: string;
  kolomKanan: string; // "Total Kehadiran" | "Persentase Nilai"
  rows: Row[];
  onSelect: (id: number) => void;
};

export default function SiswaRekapList({
  headerTitle,
  kelas,
  kolomKanan,
  rows,
  onSelect,
}: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header title={headerTitle} />

      <XPadding className="mt-6">
        <h3 className="text-base font-semibold">Daftar Siswa</h3>
        <p className="text-xs text-gray-500">{kelas}</p>
      </XPadding>

      <XPadding className="mt-5">
        <div className="flex justify-between pb-2 text-xs font-semibold">
          <span>Nama Siswa</span>
          <span>{kolomKanan}</span>
        </div>
      </XPadding>

      <ul className="border-t border-gray-300">
        {rows.map((r) => (
          <li key={r.id} className="border-b border-gray-300">
            <button
              onClick={() => onSelect(r.id)}
              className="flex w-full items-center justify-between px-6 py-2.5 text-left hover:bg-orange-50"
            >
              <span className="text-xs">{r.nama}</span>
              <span className="flex items-center gap-2">
                <Badge tone={r.persen < 100 ? "orange" : "green"}>{r.persen}%</Badge>
                <ArrowRightIcon fontSize="small" className="text-gray-500" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <CetakButton />
    </div>
  );
}