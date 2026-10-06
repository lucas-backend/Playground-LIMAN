import { useNavigate, useParams } from "react-router-dom";
import CatatanForm from "./CatatanForm";
import { catatanBkDummy } from "./konselingData";

export default function KonselingEditCatatan() {
  const { siswa_id, id_catatan_konseling } = useParams();
  const navigate = useNavigate();

  // TODO: ganti dengan fetch API berdasarkan id_catatan_konseling
  const catatan = catatanBkDummy.find((c) => c.id === Number(id_catatan_konseling));

  if (!catatan) {
    return <p className="p-6 text-xs">Catatan tidak ditemukan.</p>;
  }

  return (
    <CatatanForm
      initialTanggal={catatan.tanggal}
      initialIsi={catatan.isi}
      onSubmit={(data) => {
        // TODO: panggil API update catatan
        console.log("edit", id_catatan_konseling, data);
        navigate(`/guruBK/konseling/siswa/${siswa_id}`);
      }}
    />
  );
}