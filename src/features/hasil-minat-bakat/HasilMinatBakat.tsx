import { useState } from "react";

import Header from "../../components/Header";
import XPadding from "../../components/XPadding";

import HistoryIcon from "@mui/icons-material/History";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import DeleteIcon from "@mui/icons-material/Delete";

import { useNavigate } from "react-router-dom";

const tanggal = "11/11/2026";

const minat = "IT & Komputer";

const bakat = "Programming";

const jurusanRekomendasi = [
  "Teknik Informatika",
  "Sistem Informasi",
  "Ilmu Komputer",
];

const initialTargetJurusanLain = [
  "Teknik Kimia",
  "Teknik Industri",
];

export default function HasilMinatBakat() {
  const navigate = useNavigate();

  // State target jurusan lain
  const [targetJurusanLain, setTargetJurusanLain] = useState(
    initialTargetJurusanLain
  );

  // Handler hapus target jurusan
  const handleDeleteTargetJurusan = (indexToDelete: number) => {
    setTargetJurusanLain((prev) =>
      prev.filter((_, index) => index !== indexToDelete)
    );
  };

  return (
    <div>
      <Header title="Hasil Tes" />

      <XPadding>
        {/* Waktu Tes */}
        <div className="flex gap-2 mt-8 text-black/50">
          <HistoryIcon />
          <span>Waktu tes: {tanggal}</span>
        </div>

        {/* Minat, Bakat, Rekomendasi */}
        <div className="flex flex-col mt-9">
          <span className="font-semibold">
            Minat: {minat}
          </span>

          <span className="font-semibold">
            Bakat: {bakat}
          </span>

          <span className="font-semibold">
            Rekomendasi Jurusan:
          </span>
        </div>

        {/* Rekomendasi Jurusan */}
        <div className="flex flex-col gap-2 py-2">
          {jurusanRekomendasi.map((jurusan, index) => {
            return (
              <button
                key={index}
                className="
                  py-2
                  px-4
                  pr-1.5
                  pb-2.5
                  font-semibold
                  bg-blue-500
                  text-white
                  rounded-lg
                  flex
                  items-center
                  justify-between
                "
                onClick={() => {
                  navigate("/hasil_minat_bakat/1/jurusan/1");
                }}
              >
                <span>
                  {index + 1}. {jurusan}
                </span>

                <ArrowRightIcon />
              </button>
            );
          })}

          {/* Target Jurusan Lain */}
          <div className="font-semibold mt-2">
            Target Jurusan Lain
          </div>

          {/* List Target Jurusan */}
          <div className="flex flex-col gap-2">
            {targetJurusanLain.map((jurusan, index) => {
              return (
                <div
                  key={jurusan}
                  className="
                    py-2
                    px-4
                    pr-1.5
                    pb-2.5
                    font-semibold
                    bg-blue-500
                    text-white
                    rounded-lg
                    flex
                    items-center
                    justify-between
                  "
                >
                  {/* Nama jurusan */}
                  <button
                    type="button"
                    className="flex-1 text-left"
                    onClick={() => {
                      navigate(
                        "/hasil_minat_bakat/1/jurusan/1"
                      );
                    }}
                  >
                    {index + 1}. {jurusan}
                  </button>

                  {/* Action */}
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        handleDeleteTargetJurusan(index);
                      }}
                    >
                      <DeleteIcon />
                    </button>

                    <ArrowRightIcon />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tambah Target Jurusan */}
          <div className="w-full flex justify-start mt-2">
            <button
              className="
                bg-green-600
                px-4
                py-2
                rounded-lg
                font-semibold
                text-white
              "
              onClick={() => {
                navigate(
                  "/hasil_minat_bakat/:id/tambah_jurusan"
                );
              }}
            >
              Tambah Target Jurusan Lain
            </button>
          </div>
        </div>
      </XPadding>
    </div>
  );
}