import { useParams } from "react-router-dom";
import Header from "../../../components/Header";
import XPadding from "../../../components/XPadding";
import { cariMapel } from "./bankSoalData";
import { IkonKotak, Judul, KartuLink, TidakDitemukan } from "./BankSoalUI";

// Route: /guru/latihanSoal/bankSoal/:mapel_id
export default function BankSoalGuruMapel() {
  const { mapel_id } = useParams();
  const mapel = cariMapel(mapel_id);

  return (
    <div>
      <Header title="Bank Soal" />
      <XPadding>
        {!mapel ? (
          <TidakDitemukan pesan="Mata pelajaran tidak ditemukan" />
        ) : (
          <>
            <Judul mapel={mapel.nama} sub="Daftar Bank Soal" />
            <div className="flex flex-col gap-4 pb-8">
              {mapel.bank.map((b) => (
                <KartuLink key={b.id} to={`/guru/latihanSoal/bankSoal/${mapel.id}/soal/${b.id}`}
                  className="p-3 flex items-center gap-3">
                  <IkonKotak ikon={mapel.ikon} warna={mapel.warna} />
                  <div>
                    <p className="font-medium uppercase">{b.nama}</p>
                    <p className="text-sm opacity-70">{b.jumlahSoal} Soal</p>
                  </div>
                </KartuLink>
              ))}
            </div>
          </>
        )}
      </XPadding>
    </div>
  );
}