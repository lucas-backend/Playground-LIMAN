import { useState } from "react";

import Header from "../../../components/Header";
import XPadding from "../../../components/XPadding";
import AbsensiKelasTabDaftarSiswa from "./DaftarSiswaTab";
import AbsensiKelasTabPertemuan from "./PertemuanTab";

const namaKelas = "KELAS 10.1";

const jumlahSiswa = 30;

const tingkat = "Kelas 10";

function AbsensiKelasTab({
  activeTab,
}: {
  activeTab: "pertemuan" | "daftarSiswa";
}) {
  switch (activeTab) {
    case "pertemuan":
      return <AbsensiKelasTabPertemuan />;

    case "daftarSiswa":
      return <AbsensiKelasTabDaftarSiswa />;
  }
}

export default function AbsensiKelas() {
  const [activeTab, setActiveTab] = useState<"pertemuan" | "daftarSiswa">(
    "pertemuan",
  );

  return (
    <div>
      <Header title={namaKelas} />

      {/* Informasi kelas */}
      <div className="flex flex-col bg-blue-500 text-white py-4 border-t border-white/50">
        <XPadding className="flex flex-col">
          <div className="grid grid-cols-[0.5fr_1fr]">
            <span>Jumlah Siswa</span>
            <span>: {jumlahSiswa} Orang</span>
          </div>

          <div className="grid grid-cols-[0.5fr_1fr]">
            <span>Tingkat</span>
            <span>: {tingkat}</span>
          </div>
        </XPadding>
      </div>

      <XPadding>
        {/* Tab Button */}
        <div className="w-full grid grid-cols-2 mt-4 gap-2">
          <button
            className={`
              rounded-full
              border
              border-black/20
              py-1
              pb-1.5
              font-semibold
              hover:bg-blue-500/15
              hover:cursor-pointer
              ${activeTab == "pertemuan" ? "bg-blue-500/20" : ""}
            `}
            onClick={() => {
              setActiveTab("pertemuan");
            }}
            disabled={activeTab == "pertemuan"}
          >
            Pertemuan
          </button>

          <button
            className={`
              rounded-full
              border
              border-black/20
              py-1
              pb-1.5
              font-semibold
              hover:bg-blue-500/15
              hover:cursor-pointer
              ${activeTab == "daftarSiswa" ? "bg-blue-500/20" : ""}
            `}
            onClick={() => {
              setActiveTab("daftarSiswa");
            }}
            disabled={activeTab == "daftarSiswa"}
          >
            Daftar Siswa
          </button>
        </div>
      </XPadding>

      {/* Tab Content */}
      <AbsensiKelasTab activeTab={activeTab} />
    </div>
  );
}
