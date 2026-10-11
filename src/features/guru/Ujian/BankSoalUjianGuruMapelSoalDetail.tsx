import { useParams } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import { abjad, cariBank, LABEL_TIPE } from "./bankSoalDataUjian";
import { TidakDitemukan } from "./BankSoalUIUjian";

// Route: /guru/ujian/bankSoal/:mapel_id/soal/:soal_id/detail/:pertanyaan_id
// `soal_id` = id bank soal, `pertanyaan_id` = id soal di dalam bank tersebut.
export default function BankSoalGuruMapelSoalDetail() {
  const { mapel_id, soal_id, pertanyaan_id } = useParams();
  const bank = cariBank(mapel_id, soal_id);
  const index = bank ? bank.soal.findIndex((s) => s.id === pertanyaan_id) : -1;
  const soal = bank && index >= 0 ? bank.soal[index] : undefined;

  const kunciTeks =
    soal?.opsi && soal.kunci
      ? soal.kunci.map((i) => `${abjad(i)}. ${soal.opsi![i]}`).join(", ")
      : soal?.kunciEssay;

  return (
    <div>
      <Header title="Bank Soal" />
      <XPadding>
        {!soal ? (
          <TidakDitemukan pesan="Soal tidak ditemukan" />
        ) : (
          <div className="mt-6 text-sm pb-8">
            <p className="font-semibold">Tipe Soal: {LABEL_TIPE[soal.tipe]}</p>
            <p className="mt-6">{index + 1}. {soal.teks}</p>

            {soal.opsi && (
              <ul className="mt-6 flex flex-col gap-4">
                {soal.opsi.map((o, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-blue-600 text-blue-600 text-xs flex items-center justify-center">
                      {abjad(i)}
                    </span>
                    {o}
                  </li>
                ))}
              </ul>
            )}

            {soal.pernyataan && (
              <ul className="mt-6 flex flex-col gap-3">
                {soal.pernyataan.map((p, i) => (
                  <li key={i} className="flex items-center justify-between gap-3">
                    <span>{i + 1}. {p.teks}</span>
                    <span className={`text-xs px-3 py-1 rounded text-white ${p.benar ? "bg-green-600" : "bg-red-600"}`}>
                      {p.benar ? "Benar" : "Salah"}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {kunciTeks && (
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg px-5 py-3">
                Kunci Jawaban: {kunciTeks}
              </div>
            )}
          </div>
        )}
      </XPadding>
    </div>
  );
}