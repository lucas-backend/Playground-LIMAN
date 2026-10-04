import { useState } from "react";
import XPadding from "../../../components/XPadding";
import { useNavigate } from "react-router-dom";

type Pertemuan = {
  no: number;
  tanggal: string;
  waktu: string;
  jenisPertemuan: string;
};

const initialListPertemuan: Pertemuan[] = [
  {
    no: 1,
    tanggal: "10/10/2026",
    waktu: "09:00-11:00",
    jenisPertemuan: "Biasa",
  },
  {
    no: 2,
    tanggal: "10/10/2026",
    waktu: "11:00-13:00",
    jenisPertemuan: "UAS",
  },
];

function TambahPertemuanPopUp({
  setIsPopupOpen,
  pertemuan,
  onSimpan,
}: {
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pertemuan: Pertemuan | null;
  onSimpan: (data: Pertemuan) => void;
}) {
  const [no, setNo] = useState(pertemuan ? String(pertemuan.no) : "");

  const [tanggal, setTanggal] = useState(pertemuan ? pertemuan.tanggal : "");

  const [waktu, setWaktu] = useState(pertemuan ? pertemuan.waktu : "");

  const [jenisPertemuan, setJenisPertemuan] = useState(
    pertemuan ? pertemuan.jenisPertemuan : "",
  );

  function handleSimpan() {
    const dataPertemuan: Pertemuan = {
      no: Number(no),
      tanggal,
      waktu,
      jenisPertemuan,
    };

    onSimpan(dataPertemuan);

    setIsPopupOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          setIsPopupOpen(false);
        }}
      />

      {/* Popup */}
      <div
        className="
          relative
          z-10
          w-full
          mx-3
          bg-white
          rounded-lg
          px-7
          py-4
          pb-6
        "
      >
        {/* Judul */}
        <h3 className="text-center text-blue-500 font-semibold mb-6 text-xl">
          {pertemuan ? "Edit Pertemuan" : "Tambah Pertemuan"}
        </h3>

        {/* Form */}
        <div className="flex flex-col gap-2">
          {/* Pertemuan ke */}
          <div className="grid grid-cols-[105px_8px_1fr] items-center gap-1">
            <label className="text-gray-700">Pertemuan ke</label>

            <span className="text-gray-700">:</span>

            <input
              type="number"
              min="1"
              value={no}
              onChange={(e) => {
                setNo(e.target.value);
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

          {/* Tanggal */}
          <div className="grid grid-cols-[105px_8px_1fr] items-center gap-1">
            <label className="text-gray-700">Tanggal</label>

            <span className="text-gray-700">:</span>

            <input
              type="text"
              placeholder="DD/MM/YYYY"
              value={tanggal}
              onChange={(e) => {
                setTanggal(e.target.value);
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

          {/* Waktu */}
          <div className="grid grid-cols-[105px_8px_1fr] items-center gap-1">
            <label className="text-gray-700">Waktu</label>

            <span className="text-gray-700">:</span>

            <input
              type="text"
              placeholder="09:00-11:00"
              value={waktu}
              onChange={(e) => {
                setWaktu(e.target.value);
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

          {/* Jenis Pertemuan */}
          <div className="grid grid-cols-[105px_8px_1fr] items-center gap-1">
            <label className="text-gray-700">Jenis Pertemuan</label>

            <span className="text-gray-700">:</span>

            <input
              type="text"
              value={jenisPertemuan}
              onChange={(e) => {
                setJenisPertemuan(e.target.value);
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
        </div>

        {/* Tombol */}
        <div className="flex gap-2 mt-6">
          <button
            type="button"
            onClick={() => {
              setIsPopupOpen(false);
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

export default function AbsensiKelasTabPertemuan() {
  const [listPertemuan, setListPertemuan] =
    useState<Pertemuan[]>(initialListPertemuan);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [selectedPertemuan, setSelectedPertemuan] = useState<Pertemuan | null>(
    null,
  );

  const navigate = useNavigate();

  function handleTambahPertemuan() {
    setSelectedPertemuan(null);
    setIsPopupOpen(true);
  }

  function handleEditPertemuan(pertemuan: Pertemuan) {
    setSelectedPertemuan(pertemuan);
    setIsPopupOpen(true);
  }

  function handleSimpanPertemuan(data: Pertemuan) {
    // Kalau sedang edit
    if (selectedPertemuan) {
      setListPertemuan((prev) =>
        prev.map((item) => (item.no === selectedPertemuan.no ? data : item)),
      );

      return;
    }

    // Kalau tambah baru
    setListPertemuan((prev) => [...prev, data]);
  }

  function handleHapusPertemuan(no: number) {
    setListPertemuan((prev) =>
      prev
        .filter((item) => item.no !== no)
        .map((item, index) => ({
          ...item,
          no: index + 1,
        })),
    );
  }

  return (
    <XPadding>
      {/* Popup */}
      {isPopupOpen && (
        <TambahPertemuanPopUp
          setIsPopupOpen={setIsPopupOpen}
          pertemuan={selectedPertemuan}
          onSimpan={handleSimpanPertemuan}
        />
      )}

      {/* Tombol Tambah Pertemuan */}
      <button
        type="button"
        className="
          px-4
          py-2
          bg-blue-500
          text-white
          font-semibold
          rounded-lg
          w-full
          text-xl
          my-4
          hover:cursor-pointer
        "
        onClick={handleTambahPertemuan}
      >
        + Tambah Pertemuan
      </button>

      {/* List Pertemuan */}
      <div className="flex flex-col gap-4">
        {listPertemuan.map((pertemuan) => {
          return (
            <div className="flex w-full gap-2" key={pertemuan.no}>
              {/* Kotak besar */}
              <div
                className="p-4 bg-blue-500 rounded-lg flex-1 text-white flex flex-col hover:cursor-pointer"
                onClick={() => {
                  navigate("/guruMapel/absensi/1/pertemuan/1");
                }}
              >
                <h3 className="font-semibold text-xl">
                  Pertemuan {pertemuan.no}
                </h3>

                <span>{pertemuan.tanggal}</span>
                {/* 
                <span>
                  {pertemuan.waktu}
                </span>

                <span>
                  {pertemuan.jenisPertemuan}
                </span> */}
              </div>

              {/* Action */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="
                    text-white
                    bg-red-500
                    px-4
                    py-2
                    rounded-lg
                  "
                  onClick={() => {
                    handleHapusPertemuan(pertemuan.no);
                  }}
                >
                  Hapus
                </button>

                <button
                  type="button"
                  className="
                    bg-gray-300
                    px-4
                    py-2
                    rounded-lg
                  "
                  onClick={() => {
                    handleEditPertemuan(pertemuan);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </XPadding>
  );
}
