import { useNavigate, useParams } from "react-router-dom";
import CatatanForm from "./CatatanForm";

export default function KonselingTambahCatatan() {
  const { siswa_id } = useParams();
  const navigate = useNavigate();

  return (
    <CatatanForm
      onSubmit={(data) => {
        // TODO: panggil API tambah catatan
        console.log("tambah", siswa_id, data);
        navigate(`/guruBK/konseling/siswa/${siswa_id}`);
      }}
    />
  );
}