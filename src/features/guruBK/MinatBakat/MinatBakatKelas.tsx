import { useNavigate, useParams } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";

const siswaList = [
  { id: 1, nama: "Dipa Rama" },
  ...Array.from({ length: 11 }, (_, i) => ({ id: i + 2, nama: "Nama Siswa" })),
];

export default function MinatBakatKelas() {
  const { kelas_id } = useParams();
  const navigate = useNavigate();
  const namaKelas = `Kelas ${kelas_id?.replace(/-/g, " ").toUpperCase()}`;

  return (
    <div>
      <Header title="Minat Bakat" />
      <XPadding className="mt-6">
        <h3 className="text-base font-semibold">Daftar Siswa</h3>
        <p className="text-xs text-gray-500">{namaKelas}</p>
        <h4 className="mt-6 text-sm font-semibold">Nama Siswa</h4>
      </XPadding>

      <ul className="mt-3 border-t border-gray-300">
        {siswaList.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between border-b border-gray-300 px-6 py-3"
          >
            <span className="text-xs">{s.nama}</span>
            <button
              onClick={() => navigate(`../siswa/${s.id}`)}
              className="rounded-full border border-blue-900 bg-blue-50 px-3 py-0.5 text-[10px] font-medium text-blue-900 hover:bg-blue-100"
            >
              Lihat detail
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}