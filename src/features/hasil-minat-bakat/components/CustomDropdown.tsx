import { useEffect, useRef, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

export interface CustomDropdownProps {
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
}

/**
 * Dropdown pilihan berbasis <button> (UI khusus modul Hasil Minat Bakat).
 * Dipindahkan dari halaman `TambahTargetJurusanLain` agar UI dapat dipakai
 * ulang di dalam modul; belum diangkat ke shared karena belum dipakai fitur lain.
 */
export default function CustomDropdown({
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
        aria-label={placeholder}
        aria-haspopup="listbox"
        aria-expanded={isOpened}
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
      {isOpened ? (
        <div
          role="listbox"
          aria-label={placeholder}
          className="absolute z-50 w-full bg-white rounded-lg overflow-hidden border border-gray-200"
        >
          {options.map((option, index) => (
            <button
              key={`${option}-${index}`}
              type="button"
              role="option"
              aria-selected={option === value}
              onClick={() => handleSelect(option)}
              className={`w-full px-6 py-2 text-left text-gray-900 hover:bg-blue-100 transition-colors ${
                option === value ? "bg-blue-50 font-semibold" : ""
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}