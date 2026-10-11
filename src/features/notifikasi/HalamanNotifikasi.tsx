import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";

// Data dummy berdasarkan gambar
const notifications = [
  {
    id: 1,
    title: "Peringatan Absen Siswa",
    date: "29 Jul 2026 (14:23)",
    message: (
      <span>
        Statistik absensi <span className="font-semibold">Jon Sapriadi</span> sudah memasuki{" "}
        <span className="text-red-500 font-semibold">Area Merah</span>
      </span>
    ),
  },
  {
    id: 2,
    title: "Peringatan Absen Siswa",
    date: "29 Jul 2026 (14:23)",
    message: (
      <span>
        Statistik absensi <span className="font-semibold">Wani Aprilia</span> sudah memasuki{" "}
        <span className="text-orange-500 font-semibold">Area Oranye</span>
      </span>
    ),
  },
  {
    id: 3,
    title: "Siswa Bolos Kelas",
    date: "29 Jul 2026 (14:23)",
    message: (
      <span>
        <span className="font-semibold">Samsul Benjamin</span> sudah absen fingerprint namun tidak hadir{" "}
        <span className="font-semibold">tanpa keterangan</span> pada mata pelajaran{" "}
        <span className="font-semibold">Matematika (Tri Suliastuti)</span> pada 29 Juli 2026, 13:00 WIB
      </span>
    ),
  },
  {
    id: 4,
    title: "Peringatan Absen Siswa",
    date: "29 Jul 2026 (14:23)",
    message: (
      <span>
        Statistik absensi <span className="font-semibold">Jon Sapriadi</span> sudah memasuki{" "}
        <span className="text-orange-500 font-semibold">Area Oranye</span>
      </span>
    ),
  },
];

export default function HalamanNotifikasi() {
  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      <Header title="Notifikasi" />
      <XPadding>
        <div className="mt-4 flex flex-col gap-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
            >
              {/* Bagian Atas: Judul & Waktu */}
              <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
                <h3 className="font-medium text-gray-700">{item.title}</h3>
                <span>{item.date}</span>
              </div>
              
              {/* Bagian Isi Pesan */}
              <p className="text-xs leading-relaxed text-gray-600">
                {item.message}
              </p>
            </div>
          ))}
        </div>
      </XPadding>
    </div>
  );
}
