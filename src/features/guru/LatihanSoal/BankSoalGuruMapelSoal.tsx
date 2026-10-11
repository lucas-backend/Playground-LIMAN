import { useParams } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import { cariBank, cariMapel, LABEL_TIPE } from "./bankSoalData";
import { Judul, KartuLink, TidakDitemukan } from "./BankSoalUI";

// Route: /guru/latihanSoal/bankSoal/:mapel_id/soal/:soal_id
// Catatan: di sini `soal_id` adalah id bank soal (mis. "Bank Soal 1").
export default function BankSoalGuruMapelSoal() {
  const { mapel_id, soal_id } = useParams();
  const mapel = cariMapel(mapel_id);
  const bank = cariBank(mapel_id, soal_id);

  const tambahkanKeUjian = () => {
    // TODO: panggil API / navigasi ke halaman ujian
    console.log("Tambahkan ke ujian:", mapel_id, soal_id);
  };

  return (
    <div>
      <Header title="Bank Soal" />
      <XPadding>
        {!mapel || !bank ? (
          <TidakDitemukan pesan="Bank soal tidak ditemukan" />
        ) : (
          <>
            <Judul mapel={mapel.nama} sub={bank.nama} />
            <p className="text-sm font-semibold mb-3">Daftar Soal</p>
            <div className="flex flex-col gap-4">
              {bank.soal.map((s, i) => (
                <KartuLink key={s.id}
                  to={`/guru/latihanSoal/bankSoal/${mapel.id}/soal/${bank.id}/detail/${s.id}`}
                  className="p-4 flex gap-3">
                  <span className="text-xs font-medium">{i + 1}.</span>
                  <div>
                    <span className="inline-block bg-blue-500 text-white text-xs px-3 py-1 rounded">
                      {LABEL_TIPE[s.tipe]}
                    </span>
                    <p className="text-[10px] opacity-70 mt-2 line-clamp-1">{s.teks || "Preview Soal"}</p>
                  </div>
                </KartuLink>
              ))}
            </div>
            <div className="flex justify-end mt-4 pb-8">
              <button type="button" onClick={tambahkanKeUjian}
                className="bg-blue-500 text-white rounded-lg px-4 py-2 text-sm">
                Tambahkan ke ujian
              </button>
            </div>
          </>
        )}
      </XPadding>
    </div>
  );
}