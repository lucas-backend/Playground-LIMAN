import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FeedIcon from "@mui/icons-material/Feed";
import TimerIcon from "@mui/icons-material/Timer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from "@mui/icons-material/Add";
import { dummySoalRemedial, type SoalRemedial } from "./koreksiData";

function KartuSoalRemedial({ soal }: { soal: SoalRemedial }) {
  return (
    <div className="rounded-2xl bg-[#1E88E5] p-5 text-white shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium opacity-90">{soal.mapel}</p>
          <h2 className="mt-1 text-xl font-bold tracking-wide">{soal.judul}</h2>
        </div>
        {/* TODO: arahkan ke halaman detail remedial */}
        <button className="rounded-lg bg-white px-5 py-1.5 text-xs font-semibold text-[#1E88E5] transition hover:bg-opacity-90">
          Detail
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-y-3 text-xs font-medium">
        <div className="flex items-center gap-2">
          <span className="text-sm">
            <FeedIcon fontSize="small" />
          </span>
          <span>{soal.jumlahSoal} Soal</span>
        </div>
        <div className="flex items-center justify-end gap-2">
          <span className="text-sm">
            <CalendarMonthIcon fontSize="small" />
          </span>
          <span>{soal.tanggal}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">
            <TimerIcon fontSize="small" />
          </span>
          <span>{soal.waktu}</span>
        </div>
        <div className="flex items-center justify-end gap-2">
          <span className="text-xs">Lokasi:</span>
          <span>{soal.lokasi}</span>
        </div>
      </div>
    </div>
  );
}

export default function RemedialTab() {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // TODO: fetch daftar soal remedial dari API
  const daftarSoal = dummySoalRemedial;

  return (
    <div className="mt-5 flex flex-col gap-4">
      {daftarSoal.map((soal) => (
        <KartuSoalRemedial key={soal.id} soal={soal} />
      ))}

      {/* Tombol Tambah */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsPopupOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-[#1E88E5] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
        >
          <AddIcon fontSize="small" />
          <span>Tambah</span>
        </button>
      </div>

      {/* Backdrop & Pop-up Modal */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
          onClick={() => setIsPopupOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Tambah soal remedial"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold leading-tight text-gray-900">
              Bagaimana anda ingin menambah soal?
            </h3>
            <p className="mt-1 mb-6 text-xs text-gray-500">Silahkan pilih sumber soal</p>

            <div className="grid grid-cols-2 gap-4">
              {/* Opsi 1: Bank Soal */}
              <button
                onClick={() => {
                  navigate("/guru/ujian/bankSoal");
                  setIsPopupOpen(false);
                }}
                className="group flex h-28 flex-col items-start justify-between rounded-xl border-2 border-gray-200 p-4 text-left transition hover:border-[#1E88E5] hover:bg-blue-50/30"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100 text-[#1E88E5]">
                  <FeedIcon fontSize="small" />
                </div>
                <span className="text-sm font-bold text-gray-800 group-hover:text-[#1E88E5]">
                  Bank Soal
                </span>
              </button>

              {/* Opsi 2: Buat soal sendiri */}
              <button
                onClick={() => {
                  navigate("/guru/ujian/tambahSoal");
                  setIsPopupOpen(false);
                }}
                className="group flex h-28 flex-col items-start justify-between rounded-xl border-2 border-gray-200 p-4 text-left transition hover:border-[#1E88E5] hover:bg-blue-50/30"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded border border-blue-200 text-[#1E88E5]">
                  <AddIcon />
                </div>
                <span className="text-sm font-bold text-gray-800 group-hover:text-[#1E88E5]">
                  Buat soal sendiri
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}