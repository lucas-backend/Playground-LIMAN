import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import { IconBenar, IconSalah } from "@/shared/components/ui/IconNilai";
import { dummyJawabanPG, dummyPertanyaan } from "./koreksiData";

type Hasil = "benar" | "salah";

export default function KoreksiSiswaPertanyaan() {
  const { soal_id, siswa_id, pertanyaan_id } = useParams<{
    soal_id: string;
    siswa_id: string;
    pertanyaan_id: string;
  }>();
  const navigate = useNavigate();

  // TODO: fetch pertanyaan & jawaban siswa dari API
  const pertanyaan = dummyPertanyaan.find((p) => p.id === pertanyaan_id);

  const [hasil, setHasil] = useState<Record<string, Hasil>>({});
  const [fotoTerbuka, setFotoTerbuka] = useState<string | null>(null); // id jawaban foto yang diperbesar

  const kembali = () => navigate(`/guru/koreksi/${soal_id}/siswa/${siswa_id}`);

  const nilaiKan = (id: string, h: Hasil) => setHasil((prev) => ({ ...prev, [id]: h }));

  if (!pertanyaan) {
    return (
      <div>
        <Header title="Koreksi Nilai" />
        <XPadding>
          <p className="mt-6 text-sm">Pertanyaan tidak ditemukan.</p>
        </XPadding>
      </div>
    );
  }

  const judul = (
    <div className="mt-5">
      <div className="text-sm font-medium">
        SOAL NO {pertanyaan.no} - {pertanyaan.tipe === "essay" ? "Essay" : "Pilihan Ganda"}
        <span className="ml-2 text-[10px] font-normal text-gray-400">{pertanyaan.poin} Poin</span>
      </div>
      <p className="mt-1 text-xs text-gray-600">{pertanyaan.preview}</p>
      <p className="mt-4 text-xs">Kunci Jawaban: {pertanyaan.kunci}</p>
    </div>
  );

  /* ---------- Pilihan ganda: otomatis, hanya ditampilkan ---------- */
  if (pertanyaan.tipe === "pilihan_ganda") {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="Koreksi Nilai" />
        <XPadding>
          {judul}
          <h3 className="mb-3 mt-6 text-sm font-medium">Jawaban Siswa</h3>
          <ol className="space-y-3 text-xs">
            {dummyJawabanPG.map((j, i) => {
              const benar = j.jawaban === pertanyaan.kunci;
              return (
                <li key={j.siswaId}>
                  <div>
                    {i + 1}. {j.nama}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 pl-4">
                    Jawaban: {j.jawaban}
                    {benar ? <IconBenar aktif /> : <IconSalah aktif />}
                  </div>
                </li>
              );
            })}
          </ol>
        </XPadding>
      </div>
    );
  }

  /* ---------- Essay: guru menandai benar / salah ---------- */
  const jawabanFoto = pertanyaan.jawaban.find((j) => j.id === fotoTerbuka);

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Koreksi Nilai" />
      <XPadding>
        {judul}

        <h3 className="mt-8 text-sm font-medium">Jawaban Siswa</h3>

        <div className="mt-4 text-xs">
          <div className="grid grid-cols-[1fr_56px_56px] pb-2 text-center">
            <span />
            <span>Benar</span>
            <span>Salah</span>
          </div>

          {pertanyaan.jawaban.map((j) => {
            const h = hasil[j.id];
            return (
              <div key={j.id} className="grid grid-cols-[1fr_56px_56px] items-center py-2">
                {j.fotoUrl !== undefined ? (
                  <button
                    onClick={() => setFotoTerbuka(j.id)}
                    className="flex h-12 w-16 items-center justify-center overflow-hidden rounded bg-gray-300 text-[9px] text-gray-600"
                    aria-label="Perbesar foto jawaban"
                  >
                    {j.fotoUrl ? <img src={j.fotoUrl} alt="Foto jawaban" className="h-full w-full object-cover" /> : "Foto jawaban"}
                  </button>
                ) : (
                  <span>{j.teks}</span>
                )}
                <button onClick={() => nilaiKan(j.id, "benar")} aria-label="Benar" className="mx-auto">
                  <IconBenar aktif={h === "benar"} />
                </button>
                <button onClick={() => nilaiKan(j.id, "salah")} aria-label="Salah" className="mx-auto">
                  <IconSalah aktif={h === "salah"} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={kembali} className="rounded bg-blue-600 px-5 py-1.5 text-xs text-white">
            Selesai
          </button>
        </div>
      </XPadding>

      {/* Modal foto jawaban */}
      {jawabanFoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
          onClick={() => setFotoTerbuka(null)}
        >
          <div
            className="w-full max-w-sm rounded bg-neutral-700 p-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Foto jawaban"
          >
            <div className="flex h-56 items-center justify-center overflow-hidden rounded bg-neutral-600 text-xs text-neutral-300">
              {jawabanFoto.fotoUrl ? (
                <img src={jawabanFoto.fotoUrl} alt="Foto jawaban" className="h-full w-full object-contain" />
              ) : (
                "Foto jawaban"
              )}
            </div>
            <div className="mt-4 flex justify-center gap-16">
              <button
                aria-label="Benar"
                onClick={() => {
                  nilaiKan(jawabanFoto.id, "benar");
                  setFotoTerbuka(null);
                }}
              >
                <IconBenar aktif={hasil[jawabanFoto.id] === "benar"} size={26} />
              </button>
              <button
                aria-label="Salah"
                onClick={() => {
                  nilaiKan(jawabanFoto.id, "salah");
                  setFotoTerbuka(null);
                }}
              >
                <IconSalah aktif size={26} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}