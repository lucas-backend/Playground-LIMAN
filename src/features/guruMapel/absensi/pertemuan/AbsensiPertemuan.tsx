import { useState } from "react";
import Header from "../../../../components/Header";
import XPadding from "../../../../components/XPadding";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
const tanggal = "10/10/2026";
const waktu = "07:00-09:00";

// ===============================
// TYPE
// ===============================

type Status = "H" | "I" | "S" | "A" | "D";

type Tab = "absensi" | "nilai";

interface Siswa {
  id: number;
  nama: string;
  status: Status;
}

interface MataPelajaran {
  nama: string;
  nilai: number;
}

// ===============================
// DATA SISWA
// ===============================

const siswa: Siswa[] = [
  {
    id: 1,
    nama: "Yaza Nurzahira",
    status: "H",
  },
  {
    id: 2,
    nama: "I Made Dipa R",
    status: "H",
  },
  {
    id: 3,
    nama: "Nama Siswa",
    status: "A",
  },
  {
    id: 4,
    nama: "Nama Siswa",
    status: "I",
  },
  {
    id: 5,
    nama: "Nama Siswa",
    status: "S",
  },
  {
    id: 6,
    nama: "Nama Siswa",
    status: "I",
  },
  {
    id: 7,
    nama: "Nama Siswa",
    status: "D",
  },
];

// ===============================
// DATA MATA PELAJARAN
// ===============================

const mataPelajaran: MataPelajaran[] = [
  {
    nama: "Matematika",
    nilai: 90,
  },
  {
    nama: "Sejarah",
    nilai: 90,
  },
  {
    nama: "Bahasa Indonesia",
    nilai: 90,
  },
  {
    nama: "Agama",
    nilai: 90,
  },
  {
    nama: "Biologi",
    nilai: 90,
  },
];

// ===============================
// STYLE STATUS
// ===============================

const statusStyle: Record<Status, string> = {
  H: "bg-[#b9d59a]",
  I: "bg-[#ffd995]",
  S: "bg-[#b9bffc]",
  A: "bg-[#ff999e]",
  D: "bg-[#ead8b5]",
};

// ===============================
// COMPONENT
// ===============================

export default function AbsensiPertemuan() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("absensi");

  const [dataSiswa, setDataSiswa] = useState<Siswa[]>(siswa);

  const [openSiswa, setOpenSiswa] = useState<number | null>(0);

  // ===============================
  // UBAH STATUS ABSENSI
  // ===============================

  const ubahStatus = (id: number, status: Status) => {
    setDataSiswa((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item,
      ),
    );
  };

  // ===============================
  // HITUNG JUMLAH STATUS
  // ===============================

  const jumlahStatus = (status: Status): number => {
    return dataSiswa.filter((item) => item.status === status).length;
  };

  // ===============================
  // BUKA / TUTUP DETAIL SISWA
  // ===============================

  const toggleSiswa = (index: number) => {
    setOpenSiswa((prev) => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* =========================================
          HEADER
      ========================================== */}

      <Header title="Pertemuan 1" />

      {/* =========================================
          INFORMASI PERTEMUAN
      ========================================== */}

      <div className="flex flex-col bg-blue-500 text-white py-4 border-t border-white/50">
        <XPadding className="flex flex-col">
          <div className="grid grid-cols-[0.5fr_1fr]">
            <span>Tanggal</span>
            <span>: {tanggal}</span>
          </div>

          <div className="grid grid-cols-[0.5fr_1fr]">
            <span>Waktu</span>
            <span>: {waktu}</span>
          </div>
        </XPadding>
      </div>

      {/* =========================================
          TAB ABSENSI / NILAI
      ========================================== */}

      <XPadding>
        <div className="flex w-full gap-4 justify-between mt-8">
          {/* TAB ABSENSI */}

          <button
            type="button"
            onClick={() => setActiveTab("absensi")}
            className={`flex-1 border border-black/20 py-1 pb-1.5 rounded-full transition ${
              activeTab === "absensi" ? "bg-[#c8dcf5]" : "bg-white"
            }`}
          >
            Absensi
          </button>

          {/* TAB NILAI */}

          <button
            type="button"
            onClick={() => setActiveTab("nilai")}
            className={`flex-1 border border-black/20 py-1 pb-1.5 rounded-full transition ${
              activeTab === "nilai" ? "bg-[#c8dcf5]" : "bg-white"
            }`}
          >
            Nilai Siswa
          </button>
        </div>
      </XPadding>

      {/* =====================================================
          TAB ABSENSI
      ====================================================== */}

      {activeTab === "absensi" && (
        <XPadding>
          {/* =========================================
              STATISTIK ABSENSI
          ========================================== */}

          <div className="grid grid-cols-5 gap-2 mt-7">
            {/* HADIR */}

            <div className="bg-[#b9d59a] rounded-lg py-2 text-center">
              <p className="text-3xl font-semibold text-[#145b20]">
                {jumlahStatus("H")}
              </p>

              <p className="text-sm text-[#145b20]">HADIR</p>
            </div>

            {/* IZIN */}

            <div className="bg-[#ffd995] rounded-lg py-2 text-center">
              <p className="text-3xl font-semibold text-[#ae6900]">
                {jumlahStatus("I")}
              </p>

              <p className="text-sm text-[#ae6900]">IZIN</p>
            </div>

            {/* SAKIT */}

            <div className="bg-[#b9bffc] rounded-lg py-2 text-center">
              <p className="text-3xl font-semibold text-[#173c91]">
                {jumlahStatus("S")}
              </p>

              <p className="text-sm text-[#173c91]">SAKIT</p>
            </div>

            {/* ALPA */}

            <div className="bg-[#ff999e] rounded-lg py-2 text-center">
              <p className="text-3xl font-semibold text-[#9e0808]">
                {jumlahStatus("A")}
              </p>

              <p className="text-sm text-[#9e0808]">ALPA</p>
            </div>

            {/* DISPEN */}

            <div className="bg-[#ead8b5] rounded-lg py-2 text-center">
              <p className="text-3xl font-semibold text-[#573b08]">
                {jumlahStatus("D")}
              </p>

              <p className="text-sm text-[#573b08]">DISPEN</p>
            </div>
          </div>

          {/* =========================================
                  DAFTAR SISWA
              ========================================= */}

          <div className="flex flex-col gap-5 mt-10">
            {dataSiswa.map((item: Siswa) => (
              <div key={item.id} className="bg-[#e5f1ff] rounded-lg px-7 py-5">
                <div className="flex flex-col gap-3">
                  {/* NAMA SISWA */}
                  <p className="text-lg font-medium">{item.nama}</p>

                  {/* HISAD + DETAIL */}
                  <div className="flex items-center justify-end gap-2">
                    {/* STATUS */}
                    <div className="flex gap-2">
                      {(["H", "I", "S", "A", "D"] as Status[]).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => ubahStatus(item.id, status)}
                          className={`w-10 h-10 rounded-lg border border-black/20 text-xl transition ${
                            item.status === status
                              ? statusStyle[status]
                              : "bg-white"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>

                    {/* DETAIL */}
                    <button
                      type="button"
                      className="text-gray-500 text-sm ml-2"
                    >
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </XPadding>
      )}

      {/* =====================================================
          TAB NILAI SISWA
      ====================================================== */}

      {activeTab === "nilai" && (
        <XPadding>
          <div className="flex flex-col mt-7">
            {dataSiswa.map((item: Siswa, index: number) => {
              const isOpen = openSiswa === index;

              return (
                <div key={item.id}>
                  {/* =========================================
                      HEADER SISWA
                  ========================================== */}

                  <button
                    type="button"
                    onClick={() => toggleSiswa(index)}
                    className="w-full flex items-center justify-between py-3 text-left"
                  >
                    <span className="font-medium">{item.nama}</span>

                    <span
                      className={`text-lg transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <KeyboardArrowDownIcon />
                    </span>
                  </button>

                  {/* =========================================
                      DETAIL NILAI
                  ========================================== */}

                  {isOpen && (
                    <div className="bg-[#e5f1ff] rounded-lg overflow-hidden mb-2">
                      {/* HEADER TABEL */}

                      <div className="grid grid-cols-[1.5fr_0.7fr_0.6fr] px-7 py-4 font-semibold">
                        <span>Mata Pelajaran</span>

                        <span>Nilai</span>

                        <span>Detail</span>
                      </div>

                      {/* DATA NILAI */}

                      {mataPelajaran.map((mapel: MataPelajaran) => (
                        <div
                          key={mapel.nama}
                          className="grid grid-cols-[1.5fr_0.7fr_0.6fr] px-7 py-2 items-center"
                        >
                          <span>{mapel.nama}</span>

                          <span>{mapel.nilai}</span>

                          <button
                            type="button"
                            className="text-blue-500 text-xl"
                            onClick={() => {
                              navigate("/detail/siswa/1");
                            }}
                          >
                            <VisibilityIcon />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </XPadding>
      )}

      {/* =====================================================
          TOMBOL CETAK
      ====================================================== */}

      <div className="fixed bottom-0 left-0 right-0 bg-white px-7 py-5">
        <button
          type="button"
          className="w-full bg-[#238be2] hover:bg-[#197bc9] text-white text-2xl py-3 rounded-lg transition"
        >
          Cetak ...
        </button>
      </div>
    </div>
  );
}
