import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import { DATA } from "./bankSoalDataUjian";
import { IkonKotak, KartuLink } from "./BankSoalUIUjian";

// Route: /guru/ujian/bankSoal
export default function BankSoalGuru() {
  return (
    <div>
      <Header title="Bank Soal" />
      <XPadding>
        <h1 className="mt-8 mb-4 text-lg">Mata Pelajaran</h1>
        <div className="grid grid-cols-2 gap-4 pb-8">
          {DATA.map((m) => (
            <KartuLink key={m.id} to={`/guru/ujian/bankSoal/${m.id}`} className="p-4">
              <IkonKotak ikon={m.ikon} warna={m.warna} />
              <p className="mt-3 text-sm font-semibold">{m.nama}</p>
              <p className="text-[10px] opacity-70">{m.bank.length} Bank Soal</p>
            </KartuLink>
          ))}
        </div>
      </XPadding>
    </div>
  );
}