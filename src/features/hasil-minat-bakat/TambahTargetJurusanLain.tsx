import Header from "../../components/Header";
import XPadding from "../../components/XPadding";

const listUniversitas = [
  {
    nama: "Unila",
    listJurusan: [
      "Teknik Informatika",
      "Teknik Elektro",
      "Teknik Mesin",
      "Bisnis Digital",
      "Hukum",
      "Administrasi Negara",
      "Ilmu Pemerintahan"
    ]
  }
]

export default function TambahTargetJurusanLain() {
  return <div>
    <Header title="Hasil Tes"/>
    <XPadding>
      <div>Target Jurusan Lain</div>
      <div>
        <select name="universitas" id="univ">
          <option value="1">Unila</option>
          <option value="2">UI</option>
          <option value="3">ITB</option>

        </select>
      </div>
    </XPadding>
  </div>
}