import { useNavigate, useParams } from "react-router-dom";
import SiswaRekapList from "../SiswaRekapList";
import { REKAP_BASE, namaKelasDariId } from "../constants";

const rows = [
  { id: 1, nama: "Yaza Nurzahira", persen: 100 },
  ...Array.from({ length: 11 }, (_, i) => ({
    id: i + 2,
    nama: "Nama Siswa",
    persen: 100,
  })),
];

export default function RekapNilaiKelas() {
  const { kelas_id } = useParams();
  const navigate = useNavigate();

  return (
    <SiswaRekapList
      headerTitle="Penilaian"
      kelas={namaKelasDariId(kelas_id)}
      kolomKanan="Persentase Nilai"
      rows={rows}
      onSelect={(id) => navigate(`${REKAP_BASE}/nilai/siswa/${id}`)}
    />
  );
}