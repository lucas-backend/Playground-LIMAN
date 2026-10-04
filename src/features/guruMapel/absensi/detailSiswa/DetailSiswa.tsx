import Header from "../../../../components/Header";
import XPadding from "../../../../components/XPadding";

const nama = "Yaza Nuzahira";
const kelas = "10.1";

const nilaiData = [
  { mapel: "Matematika", tugas: 90, uh: 90, pts: 90, pas: 90 },
  { mapel: "Sejarah", tugas: 90, uh: 90, pts: 90, pas: 90 },
  { mapel: "Bahasa Indonesia", tugas: 90, uh: 90, pts: 90, pas: 90 },
  { mapel: "Agama", tugas: 90, uh: 90, pts: 90, pas: 90 },
  { mapel: "Biologi", tugas: 90, uh: 90, pts: 90, pas: 90 },
];

export default function DetailSiswa() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between pb-6">
      <div>
        <Header title="Detail Siswa" />

        {/* User Info Header Section */}
        <div className="bg-blue-500 text-white pb-4">
          <XPadding className="flex flex-col">
            <span>Nama: {nama}</span>
            <span>Kelas: {kelas}</span>
          </XPadding>
        </div>

        {/* Tab Selection Buttons */}
        <XPadding className="mt-4">
          <div className="flex gap-4 justify-between">
            <button className="border border-black/20 py-2 px-4 flex-1 rounded-full text-slate-700 bg-white">
              Detail Pertemuan
            </button>
            <button className="py-2 px-4 flex-1 rounded-full  bg-blue-100 border border-black/20">
              Detail Nilai
            </button>
          </div>
        </XPadding>

        {/* Grades Table Section */}
        <XPadding className="mt-6">
          <div className="bg-blue-50/50 border border-blue-100/50 rounded-lg p-4 text-slate-700">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-slate-900 font-bold">
                  <th className="text-left pb-4 font-bold">Mata Pelajaran</th>
                  <th className="text-center pb-4 font-bold">TUGAS</th>
                  <th className="text-center pb-4 font-bold">UH</th>
                  <th className="text-center pb-4 font-bold">PTS</th>
                  <th className="text-center pb-4 font-bold">PAS</th>
                </tr>
              </thead>
              <tbody>
                {nilaiData.map((item, index) => (
                  <tr key={index}>
                    <td className="text-left py-3.5 font-medium">
                      {item.mapel}
                    </td>
                    <td className="text-center py-3.5">{item.tugas}</td>
                    <td className="text-center py-3.5">{item.uh}</td>
                    <td className="text-center py-3.5">{item.pts}</td>
                    <td className="text-center py-3.5">{item.pas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </XPadding>
      </div>

      {/* Sticky Bottom Action Button */}
      <XPadding className="mt-8">
        <button className="w-full bg-[#238be2] hover:bg-[#197bc9] text-white text-2xl py-3 rounded-lg transition">
          Cetak ...
        </button>
      </XPadding>
    </div>
  );
}
