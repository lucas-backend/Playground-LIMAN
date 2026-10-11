interface UniversityListProps {
  universities: string[];
  onSelect: (university: string) => void;
}

export default function UniversityList({
  universities,
  onSelect,
}: UniversityListProps) {
  return (
    <div className="flex flex-col gap-6 pb-30">
      {universities.map((university) => (
        <button
          key={university}
          type="button"
          className="flex flex-col text-left cursor-pointer"
          onClick={() => onSelect(university)}
        >
          <h3 className="text-gray-800 text-base font-medium mb-1 hover:text-blue-600 transition-colors">
            {university}
          </h3>
        </button>
      ))}
    </div>
  );
}
