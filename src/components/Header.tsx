import { useState } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import XPadding from "./XPadding";
import { useLocation, useNavigate, matchPath } from "react-router-dom";

interface Props {
  title: string;
  backLink?: string;
}

export default function Header({ title, backLink }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);

  // Cek apakah user sedang berada di rute /quiz/:id/*
  const isQuizRoute = matchPath({ path: "/quiz/:id/*" }, location.pathname);

  function handleBackClick() {
    if (isQuizRoute) {
      setShowPopup(true); // Munculkan pop-up jika di halaman quiz
    } else {
      executeNavigation();
    }
  }

  function executeNavigation() {
    if (backLink) navigate(backLink);
    else navigate(-1);
  }

  return (
    <>
      <div className="bg-blue-500 text-white py-8">
        <XPadding>
          <div className="relative flex justify-center items-center">
            {/* Back Button */}
            <button className="absolute left-0" onClick={handleBackClick}>
              <ArrowBackRoundedIcon className="w-6! h-6!" />
            </button>

            {/* Title */}
            <h1 className="text-2xl font-semibold">{title}</h1>
          </div>
        </XPadding>
      </div>

      {/* Pop-up Modal Sesuai Desain Gambar */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full overflow-hidden flex flex-col justify-between min-h-[180px]">
            {/* Konten Teks */}
            <div className="flex-1 flex items-center justify-center p-6 text-center">
              <p className="text-gray-900 text-lg tracking-wide">
                Apakah anda yakin ingin keluar?
              </p>
            </div>

            {/* Area Tombol Bawah */}
            <div className="flex w-full h-12 text-white">
              {/* Tombol Tidak (Merah) */}
              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 bg-red-500 flex items-center justify-center"
              >
                Tidak
              </button>
              {/* Tombol Ya (Hijau) */}
              <button
                onClick={() => {
                  setShowPopup(false);
                  executeNavigation();
                }}
                className="flex-1 bg-green-700 flex items-center justify-center"
              >
                Ya
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
