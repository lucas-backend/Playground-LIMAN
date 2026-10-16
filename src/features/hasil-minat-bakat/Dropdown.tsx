import { useState } from "react";

interface DropdownProps {
  label: string;
  options: string[];
  placeholder: string;
  onSelect: (value: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholder,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-xl font-sans mb-4">
      {/* Tombol Utama Dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-[#1E88E5] text-white px-6 py-4 rounded-[20px] shadow-sm hover:bg-[#1976D2] transition-colors focus:outline-none"
      >
        <span className="text-lg font-medium">
          {selectedValue || placeholder}
        </span>
        {/* Ikon Segitiga / Panah Bawah */}
        <svg
          className={`w-4 h-4 fill-current transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </button>

      {/* Menu Pilihan (Menu List) */}
      {isOpen && (
        <div className="mt-2 w-full bg-white border border-gray-200 rounded-[20px] shadow-lg overflow-hidden z-10 absolute max-w-xl">
          <ul className="py-2">
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleSelect(option)}
                className="px-6 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer text-base transition-colors"
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
