import { useNavigate, useParams } from "react-router-dom";
import SiswaRekapList from "../SiswaRekapList";
import { REKAP_BASE, namaKelasDariId } from "../constants";

const rows = [
  { id: 1, nama: "Yaza Nurzahira", persen: 80 },
  ...Array.from({ length: 8 }, (_, i) => ({
    id: i + 2,
    nama: "Nama Siswa",
    persen: 100,
  })),
];

export default function RekapAbsenKelas() {
  const { kelas_id } = useParams();
  const navigate = useNavigate();

  return (
    <SiswaRekapList
      headerTitle="Rekap"
      kelas={namaKelasDariId(kelas_id)}
      kolomKanan="Total Kehadiran"
      rows={rows}
      onSelect={(id) => navigate(`${REKAP_BASE}/absen/siswa/${id}`)}
    />
  );
}