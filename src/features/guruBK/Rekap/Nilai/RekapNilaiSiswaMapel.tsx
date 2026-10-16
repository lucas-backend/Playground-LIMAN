import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../../components/Header";
import XPadding from "../../../../components/XPadding";
import { Badge, CetakButton } from "../shared";
import { REKAP_BASE } from "../constants";

const mapel = [
  { id: "matematika", nama: "Matematika", nilai: 92 },
  { id: "bahasa-indonesia", nama: "Bahasa Indonesia", nilai: 92 },
  { id: "bahasa-inggris", nama: "Bahasa Inggris", nilai: 92 },
  { id: "fisika", nama: "Fisika", nilai: 92 },
  { id: "kimia", nama: "Kimia", nilai: 92 },
  { id: "biologi", nama: "Biologi", nilai: 92 },
];

export default function RekapNilaiSiswa() {
  const { siswa_id } = useParams();
  const navigate = useNavigate();

  const kirimWhatsApp = () => {
    // TODO: kirim rekap ke wali murid, mis. window.open(`https://wa.me/${noWali}?text=...`)
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Rekap" />

      <XPadding className="mt-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold">Yaza Nurzahira</h3>
            <p className="text-xs text-gray-500">Rekap nilai per mata pelajaran</p>
          </div>
          <button
            aria-label="Kirim lewat WhatsApp"
            onClick={kirimWhatsApp}
            className="text-green-600"
          >
            <WhatsAppIcon />
          </button>
        </div>
      </XPadding>

      <ul className="mt-4 border-t border-gray-300">
        {mapel.map((m) => (
          <li key={m.id} className="border-b border-gray-300">
            <button
              onClick={() =>
                navigate(`${REKAP_BASE}/nilai/siswa/${siswa_id}/mapel/${m.id}`)
              }
              className="flex w-full items-center justify-between px-6 py-3 text-left hover:bg-orange-50"
            >
              <span className="text-xs">{m.nama}</span>
              <span className="flex items-center gap-2">
                <Badge>{m.nilai}</Badge>
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