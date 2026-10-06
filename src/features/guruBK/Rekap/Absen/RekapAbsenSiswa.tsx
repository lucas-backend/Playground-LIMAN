import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../../components/Header";
import XPadding from "../../../../components/XPadding";
import { CetakButton, REKAP_BASE, SiswaInfo } from "../shared";

// H = Hadir, I = Izin, S = Sakit, A = Alpa, D = Dispensasi
const mapel = [
  { id: "matematika", nama: "Matematika", h: 16, i: 0, s: 0, a: 0, d: 0 },
  { id: "bahasa-indonesia", nama: "Bahasa Indonesia", h: 12, i: 2, s: 0, a: 2, d: 0 },
  { id: "bahasa-inggris", nama: "Bahasa Inggris", h: 14, i: 0, s: 1, a: 0, d: 1 },
  { id: "sejarah", nama: "Sejarah", h: 16, i: 0, s: 0, a: 0, d: 0 },
];

export default function RekapAbsenSiswa() {
  const { siswa_id } = useParams();
  const navigate = useNavigate();

  const grid = "grid grid-cols-[1fr_repeat(5,24px)_44px] items-center gap-1";

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Rekap" />

      <XPadding className="mt-6">
        <SiswaInfo nama="Yaza Nurzahira" kelas="Kelas 10 IPA 1" />

        <div className={`${grid} mt-5 pb-2 text-xs font-semibold`}>
          <span>Mata Pelajaran</span>
          {["H", "I", "S", "A", "D"].map((c) => (
            <span key={c} className="text-center">{c}</span>
          ))}
          <span className="text-center">Detail</span>
        </div>
      </XPadding>

      <ul className="border-t border-gray-300">
        {mapel.map((m) => (
          <li key={m.id} className="border-b border-gray-300 px-6 py-2.5">
            <div className={`${grid} text-[11px]`}>
              <span>{m.nama}</span>
              {[m.h, m.i, m.s, m.a, m.d].map((v, i) => (
                <span key={i} className="text-center">{v}</span>
              ))}
              <button
                aria-label={`Detail ${m.nama}`}
                onClick={() =>
                  navigate(`${REKAP_BASE}/absen/siswa/${siswa_id}/mapel/${m.id}`)
                }
                className="flex justify-center text-blue-600"
              >
                <VisibilityIcon fontSize="small" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <CetakButton />
    </div>
  );
}