interface PassingGradeSearchProps {
  placeholder: string;
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
}

export default function PassingGradeSearch({
  placeholder,
  ariaLabel,
  value,
  onChange,
}: PassingGradeSearchProps) {
  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>

      <input
        type="search"
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-base placeholder-gray-400 text-gray-700 outline-none focus:border-gray-300 shadow-sm transition-all"
      />
    </div>
  );
}
