import { useState } from "react";
import XPadding from "@/shared/components/layout/XPadding";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const listSiswaAwal = [
  "Yaza Nurzahira",
  "I Made Dipa Rama Artike",
  "Arqan Purusa Eryan",
  "Nama Siswa",
  "Nama Siswa",
  "Nama Siswa",
  "Nama Siswa",
  "Nama Siswa",
];

export default function AbsensiKelasTabDaftarSiswa() {
  const [daftarSiswa] = useState(listSiswaAwal);
  return (
    <XPadding>
      {/* List Daftar Siswa */}
      <div className="flex flex-col gap-4 mt-4 max-h-[63vh] pb-[12vh] overflow-y-auto">
        {daftarSiswa.map((siswa, index) => {
          return (
            <div
              className="bg-blue-500/20 px-4 py-2 pb-2.5 rounded-lg flex justify-between items-center"
              key={index}
            >
              <span className="font-semibold">
                {index + 1}. {siswa}
              </span>

              {/* Icon WA yang mengarah ke whatsapp */}
              <div className="p-2 bg-white rounded-full flex items-center justify-center hover:cursor-pointer">
                <WhatsAppIcon className="text-green-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tombol Tambah Siswa */}
      <div className="fixed bottom-4 left-0 w-full">
        <XPadding>
          <button className="bg-blue-500 w-full py-2 pb-2.5 text-white font-semibold rounded-lg">
            + Tambah Siswa
          </button>
        </XPadding>
      </div>
    </XPadding>
  );
}
