import type { PassingGrade } from "../model/passingGrade";

interface MajorListProps {
  grades: PassingGrade[];
}

export default function MajorList({ grades }: MajorListProps) {
  return (
    <div className="flex flex-col gap-6 pb-30">
      {grades.map((grade) => (
        <div key={grade.id} className="flex flex-col text-left">
          <h3 className="text-gray-800 text-base font-medium mb-1">
            {grade.major}
          </h3>

          <div className="text-xs text-gray-500 font-normal leading-relaxed tracking-wide">
            Passing Grade: {grade.score}
          </div>
        </div>
      ))}
    </div>
  );
}
