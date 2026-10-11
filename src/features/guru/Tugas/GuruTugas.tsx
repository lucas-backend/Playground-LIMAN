import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import { getMapelList } from "./TugasData";
import KartuMapel from "./components/KartuMapel";

// Route: /guru/tugas
export default function GuruTugas() {
  return (
    <div>
      <Header title="Tugas"/>
      <XPadding>
        <h1 className="mt-6 mb-4 text-lg">Mata Pelajaran</h1>
        <div className="grid grid-cols-2 gap-4 pb-8">
          {getMapelList().map((m) => (
            <KartuMapel key={m.id} mapel={m} />
          ))}
        </div>
      </XPadding>
    </div>
  );
}
