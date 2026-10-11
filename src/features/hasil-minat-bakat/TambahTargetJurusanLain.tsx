import { useEffect, useRef, useState } from "react";
import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useNavigate } from "react-router-dom";

const listUniversitas = [
  {
    nama: "ITERA",
    listJurusan: ["Teknik Informatika", "Teknik Elektro", "Teknik Mesin"],
  },
  {
    nama: "Unila",
    listJurusan: [
      "Bisnis Digital",
      "Ekonomi",
      "Manajemen",
      "Akuntansi",
      "Bisnis Digital",
      "Hukum",
      "Administrasi Negara",
      "Ilmu Pemerintahan",
    ],
  },
];

interface CustomDropdownProps {
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
}

function CustomDropdown({
  value,
  placeholder,
  options,
  onChange,
}: CustomDropdownProps) {
  const [isOpened, setIsOpened] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpened(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpened(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpened((prev) => !prev)}
        className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg shadow-sm cursor-pointer pr-12 font-medium text-base focus:outline-none text-left flex items-center"
      >
        <span>{value || placeholder}</span>

        <div className="absolute right-6 flex items-center">
          {isOpened ? (
            <ArrowDropUpIcon className="text-4xl!" />
          ) : (
            <ArrowDropDownIcon className="text-4xl!" />
          )}
        </div>
      </button>

      {/* Options */}
      {isOpened && (
        <div className="absolute z-50 w-full bg-white rounded-lg overflow-hidden border border-gray-200">
          {options.map((option, index) => (
            <button
              key={`${option}-${index}`}
              type="button"
              onClick={() => handleSelect(option)}
              className={`w-full px-6 py-2 text-left text-gray-900 hover:bg-blue-100 transition-colors ${
                option === value ? "bg-blue-50 font-semibold" : ""
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TambahTargetJurusanLain() {
  const navigate = useNavigate();
  // Default kosong → menampilkan placeholder "Universitas"
  const [selectedUniversitas, setSelectedUniversitas] = useState<string>("");

  // Default kosong → menampilkan placeholder "Jurusan"
  const [selectedJurusan, setSelectedJurusan] = useState<string>("");

  // Cari data universitas berdasarkan pilihan
  const activeUniversitas = listUniversitas.find(
    (univ) => univ.nama === selectedUniversitas,
  );

  // Ketika universitas berubah
  const handleUniversitasChange = (namaUniversitas: string) => {
    setSelectedUniversitas(namaUniversitas);

    // Reset jurusan karena universitas berubah
    setSelectedJurusan("");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="Hasil Tes" />

      <XPadding>
        <div className="min-h-[84vh] flex flex-col justify-between">
          <div>
            {/* Judul Section */}
            <div className="text-lg font-bold text-gray-900 mt-6 mb-4">
              Target Jurusan Lain
            </div>

            <div className="flex flex-col gap-4 max-w-xl">
              {/* Dropdown Universitas */}
              <CustomDropdown
                value={selectedUniversitas}
                placeholder="Universitas"
                options={listUniversitas.map((univ) => univ.nama)}
                onChange={handleUniversitasChange}
              />

              {/* Dropdown Jurusan */}
              <CustomDropdown
                value={selectedJurusan}
                placeholder="Jurusan"
                options={activeUniversitas?.listJurusan ?? []}
                onChange={setSelectedJurusan}
              />
            </div>
          </div>

          {/* Button yang jika di klik maka akan menambahkan jurusan saat kembali ke /hasil_minat_bakat/:id */}
          <button
            className="bg-blue-500 w-full py-2 rounded-lg font-semibold text-white text-xl cursor-pointer"
            onClick={() => {
              navigate(-1);
            }}
          >
            SIMPAN
          </button>
        </div>
      </XPadding>
    </div>
  );
}
