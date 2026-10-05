import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import XPadding from "../../../components/XPadding";
import { dummyKelas } from "./data";

export default function GuruPenilaian() {
  const navigate = useNavigate();
  const daftarKelas = dummyKelas; // TODO: fetch dari API

  return (
    <div>
      <Header title="Penilaian" />
      <XPadding>
        <h2 className="mb-3 mt-5 text-base font-medium">DAFTAR KELAS</h2>
        <div className="flex flex-col gap-3">
          {daftarKelas.map((kelas) => (
            <button
              key={kelas.id}
              onClick={() => navigate(`/guru/penilaian/kelas/${kelas.id}`)}
              className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white p-3 text-left"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-blue-200 text-blue-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="3" width="12" height="16" rx="2" />
                  <path d="M8 21h10a2 2 0 0 0 2-2V8" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-medium">{kelas.nama}</div>
                <div className="text-sm text-gray-500">{kelas.keterangan}</div>
              </div>
            </button>
          ))}
        </div>
      </XPadding>
    </div>
  );
}