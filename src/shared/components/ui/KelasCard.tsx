import StarIcon from "@mui/icons-material/Star";

type Props = {
  label: string;
  onClick: () => void;
  iconBg?: string;
  iconColor?: string;
};

export default function KelasCard({
  label,
  onClick,
  iconBg = "bg-green-200",
  iconColor = "text-green-600",
}: Props) {
  return (
    <button
      onClick={onClick}
      className="mt-4 flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-white p-2 text-left shadow-sm hover:bg-gray-50"
    >
      <div className={`flex h-9 w-9 items-center justify-center rounded-md ${iconBg} ${iconColor}`}>
        <StarIcon fontSize="small" />
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}