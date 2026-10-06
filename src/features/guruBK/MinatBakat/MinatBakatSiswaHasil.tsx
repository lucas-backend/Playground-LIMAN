import { useSearchParams } from "react-router-dom";
import Header from "../../../components/Header";
import XPadding from "../../../components/XPadding";

const snbp = [
  { univ: "UI", sekarang: 90, snbp: 90, target: 97 },
  { univ: "UGM", sekarang: 89, snbp: 89, target: 98 },
  { univ: "Unila", sekarang: 89, snbp: 89, target: 95 },
];

const snbt = [
  { univ: "UI", nilai: 750 },
  { univ: "UGM", nilai: 754 },
  { univ: "Unila", nilai: 754 },
];

export default function MinatBakatSiswaHasil() {
  const [params] = useSearchParams();
  const jurusan = params.get("jurusan") ?? "Teknik Informatika";

  return (
    <div>
      <Header title="Hasil Tes" />
      <XPadding className="mt-6 pb-8">
        <h3 className="text-base font-semibold">Dipa Rama</h3>
        <p className="text-xs text-gray-500">Kelas 10 IPA 1</p>

        <div className="mt-4 rounded-md bg-blue-600 py-1.5 text-center text-sm font-semibold text-white">
          {jurusan}
        </div>

        <h4 className="mt-5 text-xs font-semibold">Mapel TKA</h4>
        <ol className="mt-1 list-inside list-decimal pl-3 text-xs">
          <li>Informatika</li>
          <li>Matematika Lanjut</li>
        </ol>

        <span className="mt-5 inline-block rounded-full bg-green-200 px-3 py-0.5 text-[10px]">
          Siswa berada disemester 3
        </span>

        {/* SNBP */}
        <h4 className="mt-5 text-xs font-semibold">Detail SNBP</h4>
        <div className="mt-1 overflow-x-auto rounded-md bg-orange-200 p-3">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left align-top">
                <th className="pb-1 font-medium">Univ</th>
                <th className="pb-1 font-medium">Nilai saat ini</th>
                <th className="pb-1 font-medium">SNBP</th>
                <th className="pb-1 font-medium">Target semester selanjutnya</th>
              </tr>
            </thead>
            <tbody>
              {snbp.map((r) => (
                <tr key={r.univ}>
                  <td className="py-0.5">{r.univ}</td>
                  <td className="py-0.5 text-center">{r.sekarang}</td>
                  <td className="py-0.5 text-center">{r.snbp}</td>
                  <td className="py-0.5 text-center">{r.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SNBT */}
        <h4 className="mt-5 text-xs font-semibold">Detail SNBT</h4>
        <div className="mt-1 inline-block min-w-[140px] rounded-md bg-sky-300 p-3">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left">
                <th className="pb-1 font-semibold">Univ</th>
                <th className="pb-1 font-semibold">SNBT</th>
              </tr>
            </thead>
            <tbody>
              {snbt.map((r) => (
                <tr key={r.univ}>
                  <td className="py-0.5">{r.univ}</td>
                  <td className="py-0.5">{r.nilai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </XPadding>
    </div>
  );
}