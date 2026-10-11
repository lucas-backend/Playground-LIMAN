import DeleteIcon from "@mui/icons-material/Delete";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import HistoryIcon from "@mui/icons-material/History";
import { useNavigate, useParams } from "react-router-dom";

import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";

import { useHasilMinatBakat } from "./hooks/useHasilMinatBakat";

// Id detail jurusan ({id_jurusan} di route detail) tetap "1": halaman detail
// hanya memiliki satu fixture demo (lihat model/aptitude.mock.ts).
const DETAIL_JURUSAN_ID = "1";

/**
 * Halaman hasil tes minat bakat siswa (FR-MB-001) + daftar target jurusan lain
 * (FR-MB-002). UI tipis: data dan aksi lewat `useHasilMinatBakat`.
 */
export default function HasilMinatBakat() {
  const navigate = useNavigate();
  const { quiz_minat_bakat_id } = useParams<{ quiz_minat_bakat_id?: string }>();
  const {
    summary,
    targetJurusanLain,
    waktuTes,
    reloadWaktuTes,
    deleteTargetJurusan,
  } = useHasilMinatBakat();

  const hasilId = quiz_minat_bakat_id ?? "";

  const jurusanDetailPath = () =>
    `/hasil_minat_bakat/${hasilId}/jurusan/${DETAIL_JURUSAN_ID}`;

  const tambahTargetPath = () =>
    `/hasil_minat_bakat/${hasilId}/tambah_jurusan`;

  return (
    <div>
      <Header title="Hasil Tes" />

      <XPadding>
        {/* Waktu Tes */}
        <div className="flex gap-2 mt-8 text-black/50">
          <HistoryIcon />
          {waktuTes.status === "error" ? (
            <div
              role="alert"
              className="flex items-center gap-2 text-sm text-danger"
            >
              <span>Waktu tes gagal dimuat.</span>
              <button
                type="button"
                onClick={reloadWaktuTes}
                className="font-medium underline"
              >
                Coba lagi
              </button>
            </div>
          ) : (
            <span>
              Waktu tes:{" "}
              {waktuTes.status === "ready" ? waktuTes.tanggal : "Memuat…"}
            </span>
          )}
        </div>

        {/* Minat, Bakat, Rekomendasi */}
        <div className="flex flex-col mt-9">
          <span className="font-semibold">Minat: {summary.minat}</span>

          <span className="font-semibold">Bakat: {summary.bakat}</span>

          <span className="font-semibold">Rekomendasi Jurusan:</span>
        </div>

        {/* Rekomendasi Jurusan */}
        <div className="flex flex-col gap-2 py-2">
          {summary.rekomendasi.map((jurusan, index) => {
            return (
              <button
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
                onClick={() => {
                  navigate(jurusanDetailPath());
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
          <div className="font-semibold mt-2">Target Jurusan Lain</div>

          {/* List Target Jurusan */}
          <div className="flex flex-col gap-2">
            {targetJurusanLain.map((jurusan, index) => {
              return (
                <div
                  key={jurusan.id}
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
                      navigate(jurusanDetailPath());
                    }}
                  >
                    {index + 1}. {jurusan.nama}
                  </button>

                  {/* Action */}
                  <div className="flex items-center">
                    <button
                      type="button"
                      aria-label={`Hapus target jurusan ${jurusan.nama}`}
                      onClick={() => {
                        deleteTargetJurusan(jurusan.id);
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
                navigate(tambahTargetPath());
              }}
            >
              Tambah Target Jurusan Lain
            </button>
          </div>

          {import.meta.env.DEV ? (
            <p className="mt-8 text-center text-xs text-black/50">
              Mode pengembangan (mock): hasil minat bakat belum terhubung
              backend.
            </p>
          ) : null}
        </div>
      </XPadding>
    </div>
  );
}