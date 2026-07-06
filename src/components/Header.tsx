import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import XPadding from "./XPadding";

interface Props {
  title: string;
}

export default function Header({ title }: Props) {
  return (
    <div className="bg-blue-500 text-white py-8">
      <XPadding>
        <div className="relative flex justify-center items-center">
          {/* Back Button */}
          <button className="absolute left-0">
            <ArrowBackRoundedIcon className="w-6! h-6!" />
          </button>

          {/* Title */}
          <h1 className="text-2xl font-semibold">{title}</h1>
        </div>
      </XPadding>
    </div>
  );
}
