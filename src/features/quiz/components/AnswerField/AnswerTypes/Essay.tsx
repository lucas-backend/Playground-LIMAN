import type { EssayQuestion } from "../../../types";

import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";

interface Props {
  question: EssayQuestion;
}

export default function Essay({ question }: Props) {
  return (
    <div>
      <div className="">
        {/* Field Isi Teks Jawaban */}
        <textarea
          name={`${question.id}`}
          id={`${question.id}`}
          placeholder="Ketik di sini..."
          className="border border-black/10 p-4 w-full h-44 resize-none overflow-y-auto rounded-xl"
        ></textarea>

        {/* Field Isi Foto */}
        <button className="text-white mt-4 p-4 bg-blue-500 w-full rounded-xl hover:bg-blue-600 active:bg-blue-600">
          <CameraAltRoundedIcon className="mr-2" />
          Sertakan Jawaban dalam Foto
        </button>
      </div>
    </div>
  );
}
