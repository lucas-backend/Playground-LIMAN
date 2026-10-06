import Header from "../../../../components/Header";
import XPadding from "../../../../components/XPadding";
import { Badge, CetakButton, SiswaInfo } from "../shared";

const pertemuan = [
  { no: 1, tanggal: "21/10/2026", ket: "Hadir" },
  { no: 2, tanggal: "22/10/2026", ket: "Hadir" },
  { no: 3, tanggal: "23/10/2026", ket: "Hadir" },
];

export default function RekapAbsenSiswaMapel() {
  const grid = "grid grid-cols-3 items-center text-center";

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Rekap" />

      <XPadding className="mt-6">
        <SiswaInfo nama="Yaza Nurzahira" kelas="Kelas 10 IPA 1" extra="Matematika" />
        <div className={`${grid} mt-5 pb-2 text-xs font-semibold`}>
          <span>Pertemuan</span>
          <span>Tanggal</span>
          <span>Keterangan</span>
        </div>
      </XPadding>

      <ul className="border-t border-gray-300">
        {pertemuan.map((p) => (
          <li key={p.no} className="border-b border-gray-300 px-6 py-2.5">
            <div className={`${grid} text-[11px]`}>
              <span>Pertemuan {p.no}</span>
              <span>{p.tanggal}</span>
              <span><Badge>{p.ket}</Badge></span>
            </div>
          </li>
        ))}
      </ul>

      <CetakButton />
    </div>
  );
}