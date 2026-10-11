import { useNavigate } from "react-router-dom";

import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";

import CustomDropdown from "./components/CustomDropdown";
import { useTambahTargetJurusan } from "./hooks/useTambahTargetJurusan";

/**
 * Halaman tambah target jurusan lain (FR-MB-002): pilih universitas + jurusan,
 * lalu simpan. UI tipis; validasi, loading, dan submit lewat
 * `useTambahTargetJurusan`.
 */
export default function TambahTargetJurusanLain() {
  const navigate = useNavigate();
  const {
    universities,
    selectedUniversitasName,
    selectedJurusan,
    jurusanOptions,
    formError,
    submitting,
    selectUniversitas,
    selectJurusan,
    submit,
  } = useTambahTargetJurusan();

  async function handleSubmit() {
    const ok = await submit();
    if (ok) {
      // Kembali ke halaman hasil. Catatan: daftar target jurusan lain pada
      // halaman hasil masih fixture demo (tidak ada endpoint GET target-majors),
      // sehingga entri baru belum tampil di sana sampai kontrak tersedia.
      navigate(-1);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header title="Hasil Tes" />

      <XPadding>
        <div className="min-h-[84vh] flex flex-col justify-between">
          <div>
            {/* Judul Section */}
            <div className="text-lg font-bold text-gray-900 mt-6 mb-4">
              Target Jurusan Lain
            </div>

            <div className="flex flex-col gap-4 max-w-xl">
              {/* Dropdown Universitas */}
              <CustomDropdown
                value={selectedUniversitasName}
                placeholder="Universitas"
                options={universities.map((univ) => univ.nama)}
                onChange={selectUniversitas}
              />

              {/* Dropdown Jurusan */}
              <CustomDropdown
                value={selectedJurusan}
                placeholder="Jurusan"
                options={jurusanOptions}
                onChange={selectJurusan}
              />

              {formError ? (
                <p
                  role="alert"
                  className="text-sm font-medium text-danger"
                >
                  {formError}
                </p>
              ) : null}
            </div>
          </div>

          {/* Simpan target jurusan */}
          <button
            type="button"
            disabled={submitting}
            className="bg-blue-500 w-full py-2 rounded-lg font-semibold text-white text-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
          >
            {submitting ? "Menyimpan…" : "SIMPAN"}
          </button>
        </div>
      </XPadding>
    </div>
  );
}