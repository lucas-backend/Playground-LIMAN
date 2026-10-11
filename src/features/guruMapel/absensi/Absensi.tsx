import { useState } from "react";

import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";

import NoMeetingRoomIcon from "@mui/icons-material/NoMeetingRoom";
import { useNavigate } from "react-router-dom";

type Tingkat = {
  id: number;
  nama: string;
};

type Kelas = {
  id: number;
  namaKelas: string;
  jumlahSiswa: number;
  tingkat: Tingkat;
};

// Dummy data tingkat
const tingkat: Tingkat[] = [
  {
    id: 1,
    nama: "Kelas 10",
  },
  {
    id: 2,
    nama: "Kelas 11",
  },
  {
    id: 3,
    nama: "Kelas 12",
  },
];

function TambahKelasPopUp({
  setIsTambahKelas,
  tingkatList,
  onSimpan,
}: {
  setIsTambahKelas: React.Dispatch<React.SetStateAction<boolean>>;
  tingkatList: Tingkat[];
  onSimpan: (kelasBaru: Kelas) => void;
}) {
  const [namaKelas, setNamaKelas] = useState("");
  const [jumlahSiswa, setJumlahSiswa] = useState("");
  const [tingkatId, setTingkatId] = useState("");

  function handleSimpan() {
    // Cari object tingkat berdasarkan ID yang dipilih
    const tingkatDipilih = tingkatList.find(
      (item) => item.id === Number(tingkatId),
    );

    if (!tingkatDipilih) {
      return;
    }

    const dataKelas: Kelas = {
      id: Date.now(),
      namaKelas,
      jumlahSiswa: Number(jumlahSiswa),
      tingkat: tingkatDipilih,
    };

    console.log("Data kelas:", dataKelas);

    // Kirim data ke parent
    onSimpan(dataKelas);

    // Tutup popup
    setIsTambahKelas(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          setIsTambahKelas(false);
        }}
      />

      {/* Popup */}
      <div
        className="
          relative
          z-10
          w-full
          mx-6
          bg-white
          rounded-lg
          px-7
          py-4
          pb-6
        "
      >
        {/* Judul */}
        <h3 className="text-center text-blue-500 font-semibold mb-6 text-xl">
          Tambah Kelas
        </h3>

        {/* Form */}
        <div className="flex flex-col gap-2">
          {/* Nama Kelas */}
          <div className="grid grid-cols-[94px_8px_1fr] items-center gap-1">
            <label className="text-gray-700">Nama Kelas</label>

            <span className="text-gray-700">:</span>

            <input
              type="text"
              value={namaKelas}
              onChange={(e) => {
                setNamaKelas(e.target.value);
              }}
              className="
                w-full
                h-8
                border
                border-gray-300
                rounded
                px-2
                outline-none
                focus:border-blue-500
              "
            />
          </div>

          {/* Jumlah Siswa */}
          <div className="grid grid-cols-[94px_8px_1fr] items-center gap-1">
            <label className="text-gray-700">Jumlah Siswa</label>

            <span className="text-gray-700">:</span>

            <input
              type="number"
              min="1"
              value={jumlahSiswa}
              onChange={(e) => {
                setJumlahSiswa(e.target.value);
              }}
              className="
                w-full
                h-8
                border
                border-gray-300
                rounded
                px-2
                outline-none
                focus:border-blue-500
              "
            />
          </div>

          {/* Tingkat */}
          <div className="grid grid-cols-[94px_8px_1fr] items-center gap-1">
            <label className="text-gray-700">Tingkat</label>

            <span className="text-gray-700">:</span>

            <select
              value={tingkatId}
              onChange={(e) => {
                setTingkatId(e.target.value);
              }}
              className="
                w-full
                h-8
                border
                border-gray-300
                rounded
                px-2
                text-gray-700
                outline-none
                focus:border-blue-500
                bg-white
              "
            >
              <option value="" disabled>
                Pilih tingkat
              </option>

              {tingkatList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tombol */}
        <div className="flex gap-2 mt-6">
          <button
            type="button"
            onClick={() => {
              setIsTambahKelas(false);
            }}
            className="
              flex-1
              py-1.5
              pb-2
              border
              border-blue-400
              rounded
              text-blue-500
            "
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSimpan}
            className="
              flex-1
              py-1.5
              pb-2
              bg-blue-500
              rounded
              text-white
            "
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

function NoKelasDisplay({
  tingkatList,
  onSimpan,
}: {
  tingkatList: Tingkat[];
  onSimpan: (kelasBaru: Kelas) => void;
}) {
  const [isTambahKelas, setIsTambahKelas] = useState(false);

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center">
      {/* Popup */}
      {isTambahKelas && (
        <TambahKelasPopUp
          setIsTambahKelas={setIsTambahKelas}
          tingkatList={tingkatList}
          onSimpan={onSimpan}
        />
      )}

      {/* Icon ketika belum ada kelas */}
      <div className="bg-blue-500/10 rounded-full p-8 text-blue-500">
        <NoMeetingRoomIcon className="text-6xl!" />
      </div>

      <span className="text-black/50 mt-4">Belum ada kelas</span>

      <span className="text-black/50">Silahkan tambah kelas</span>

      <button
        className="
          cursor-pointer
          bg-blue-500
          text-xl
          text-white
          px-6
          font-semibold
          mt-4
          py-1.5
          pb-2
          rounded-lg
        "
        onClick={() => {
          setIsTambahKelas(true);
        }}
      >
        + Tambah Kelas
      </button>
    </div>
  );
}

export default function Absensi() {
  const [kelas, setKelas] = useState<Kelas[]>([]);

  const [isTambahKelas, setIsTambahKelas] = useState(false);

  const navigate = useNavigate();

  function handleTambahKelas(kelasBaru: Kelas) {
    setKelas((prev) => [...prev, kelasBaru]);
  }

  return (
    <div className="min-h-screen">
      <Header title="Absensi" />

      <XPadding>
        {kelas.length < 1 ? (
          <NoKelasDisplay tingkatList={tingkat} onSimpan={handleTambahKelas} />
        ) : (
          <div className="min-h-[80vh] flex flex-col">
            {/* Daftar Kelas */}
            <div>
              <div className="text-xl mt-8 mb-4">DAFTAR KELAS</div>

              <div className="flex flex-col gap-3">
                {kelas.map((item, index) => {
                  const warna = [
                    "bg-orange-400",
                    "bg-indigo-300",
                    "bg-blue-500",
                  ][index % 3];

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`
                        ${warna}
                        w-full
                        text-left
                        text-white
                        text-xl
                        px-7
                        py-7
                        rounded-xl
                        shadow-md
                      `}
                      onClick={() => {
                        navigate("/guruMapel/absensi/1");
                      }}
                    >
                      {item.namaKelas}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tombol Tambah Kelas */}
            <div className="mt-auto pt-8 pb-4">
              <button
                type="button"
                className="
                  w-full
                  bg-blue-500
                  text-white
                  text-xl
                  font-semibold
                  py-2.5
                  rounded-xl
                "
                onClick={() => {
                  setIsTambahKelas(true);
                }}
              >
                + Tambah Kelas
              </button>
            </div>

            {/* Popup */}
            {isTambahKelas && (
              <TambahKelasPopUp
                setIsTambahKelas={setIsTambahKelas}
                tingkatList={tingkat}
                onSimpan={handleTambahKelas}
              />
            )}
          </div>
        )}
      </XPadding>
    </div>
  );
}
