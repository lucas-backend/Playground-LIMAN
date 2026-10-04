import { useState } from "react";
import Header from "../../../components/Header";
import XPadding from "../../../components/XPadding";
import { useNavigate } from "react-router-dom";

export default function TambahSoalLatihan() {
  const navigate = useNavigate();
  // State untuk form data
  const [mataPelajaran, setMataPelajaran] = useState("Matematika");
  const [judul, setJudul] = useState("Latsos mtk 1");
  const [tanggal, setTanggal] = useState("20/20/2026");
  const [waktu, setWaktu] = useState("07.30-10.00");
  const [lokasi, setLokasi] = useState("Online");
  const [jumlahSoal, setJumlahSoal] = useState("25");

  // State untuk mengontrol dropdown mata pelajaran
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const daftarMapel = ["Matematika", "Kimia", "Biologi", "Fisika", "Ekonomi"];

  return (
    <div className="min-h-screen bg-[#FFFDF6] pb-10">
      <Header title={"Latihan Soal"} />
      <XPadding>
        <div className="mt-6 flex flex-col gap-5">
          {/* Field: Mata Pelajaran */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-sm font-semibold text-gray-800">
              Mata Pelajaran
            </label>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between rounded-xl border border-blue-200 bg-[#EBF3FC] px-4 py-3.5 text-left text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <span>{mataPelajaran}</span>
              {/* Dropdown Arrow (Animasi rotasi dihapus) */}
              <svg
                className={`h-5 w-5 text-blue-500 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Dropdown Options List */}
            {isDropdownOpen && (
              <div className="absolute top-[84px] left-0 z-10 w-full rounded-xl border border-blue-200 bg-[#EBF3FC] py-1 shadow-md">
                {daftarMapel.map((mapel) => (
                  <button
                    key={mapel}
                    onClick={() => {
                      setMataPelajaran(mapel);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm font-medium first:rounded-t-xl last:rounded-b-xl ${
                      mataPelajaran === mapel
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-800 hover:bg-blue-50"
                    }`}
                  >
                    {mapel}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Field: Judul */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800">Judul</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full rounded-xl border border-blue-200 bg-[#EBF3FC] px-4 py-3.5 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Field: Tanggal */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800">
              Tanggal
            </label>
            <input
              type="text"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full rounded-xl border border-blue-200 bg-[#EBF3FC] px-4 py-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Field: Waktu */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800">Waktu</label>
            <input
              type="text"
              value={waktu}
              onChange={(e) => setWaktu(e.target.value)}
              className="w-full rounded-xl border border-blue-200 bg-[#EBF3FC] px-4 py-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Field: Lokasi */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800">
              Lokasi
            </label>
            <input
              type="text"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              className="w-full rounded-xl border border-blue-200 bg-[#EBF3FC] px-4 py-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Field: Jumlah Soal */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800">
              Jumlah Soal
            </label>
            <input
              type="text"
              value={jumlahSoal}
              onChange={(e) => setJumlahSoal(e.target.value)}
              className="w-full rounded-xl border border-blue-200 bg-[#EBF3FC] px-4 py-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Tombol Tambah Soal */}
          <div className="mt-2 flex justify-start">
            <button
              onClick={() => {
                navigate("/guru/latihanSoal/editSoal/1/soal/1");
              }}
              className="rounded-xl bg-[#1E88E5] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              + Tambah Soal
            </button>
          </div>
        </div>
      </XPadding>
    </div>
  );
}
