import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import XPadding from "@/shared/components/layout/XPadding";
import { getMapelList, getTugasByMapel, tambahTugas } from "./TugasData";
import FieldForm, { kelasInput } from "./components/FieldForm";
import TombolBiru from "./components/TombolBiru";
import Header from "@/shared/components/layout/Header";

// Route: /guru/tugas/:mapel_id/tambahTugas
export default function GuruTugasTambahTugas() {
  const { mapel_id } = useParams<{ mapel_id: string }>();
  const navigate = useNavigate();

  const [mapelId, setMapelId] = useState(mapel_id ?? "");
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tenggat, setTenggat] = useState("");
  const [jam, setJam] = useState("23:59");
  const [error, setError] = useState("");

  const nomorBerikut = getTugasByMapel(mapelId).length + 1;

  const simpan = (e: FormEvent) => {
    e.preventDefault();
    if (!mapelId) return setError("Pilih mata pelajaran terlebih dahulu");
    if (!judul.trim()) return setError("Judul tugas wajib diisi");
    if (!tenggat) return setError("Tanggal tenggat wajib diisi");

    // TODO: kirim ke API
    tambahTugas({ mapelId, judul: judul.trim(), deskripsi: deskripsi.trim(), tenggat, jam });
    navigate(`/guru/tugas/${mapelId}`);
  };

  return (
    <div>
      <Header title="Tambah Tugas"/>
      <XPadding>
        <form onSubmit={simpan} className="flex flex-col gap-4 mt-6 pb-8">
          <FieldForm label="Mata Pelajaran">
            <select value={mapelId} onChange={(e) => setMapelId(e.target.value)} className={kelasInput}>
              <option value="" disabled>Pilih mata pelajaran</option>
              {getMapelList().map((m) => (
                <option key={m.id} value={m.id}>{m.nama}</option>
              ))}
            </select>
          </FieldForm>

          <FieldForm label="Judul">
            <input value={judul} onChange={(e) => setJudul(e.target.value)}
              placeholder={`Tugas ${nomorBerikut}`} className={kelasInput} />
          </FieldForm>

          <FieldForm label="Deskripsi Tugas">
            <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Buatlah..." rows={3} className={`${kelasInput} resize-none`} />
          </FieldForm>

          <FieldForm label="Tenggat">
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={tenggat} onChange={(e) => setTenggat(e.target.value)}
                className={kelasInput} />
              <input type="time" value={jam} onChange={(e) => setJam(e.target.value)}
                className={kelasInput} />
            </div>
          </FieldForm>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex justify-end">
            <TombolBiru type="submit">Simpan</TombolBiru>
          </div>
        </form>
      </XPadding>
    </div>
  );
}