import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import NilaiBadge from "@/shared/components/ui/NilaiBadge";
import TabKoreksi from "./TabKoreksi";
import RemedialTab from "./RemedialTab";
import { KKM, dummyDaftarSiswa, dummyUlangan, type TabKey } from "./koreksiData";

export default function Koreksi() {
  const { soal_id } = useParams<{ soal_id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Tab awal bisa dikirim dari halaman lain lewat navigate(..., { state: { tab } })
  const [tab, setTab] = useState<TabKey>((location.state as { tab?: TabKey } | null)?.tab ?? "nilai");

  // TODO: fetch ulangan & daftar siswa berdasarkan soal_id
  const ulangan = dummyUlangan;
  const daftarSiswa = dummyDaftarSiswa;

  const tampilNilai = tab !== "koreksi";
  const tampilAksi = tab !== "remedial";
  const kolom = [
    "1fr",
    tampilNilai ? "56px" : null,
    tampilNilai ? "76px" : null,
    tampilAksi ? "76px" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={ulangan.judul} />
      <XPadding>
        {/* 3 Button untuk ganti tab */}
        <TabKoreksi aktif={tab} onChange={setTab} />

        {/* Section Dinamis */}
        <div>
          {/* Kelas */}
          <h3 className="mb-3 mt-5 text-sm font-semibold">KELAS {ulangan.kelas}</h3>

          {/* List Soal Remedial */}
          {tab === "remedial" && <RemedialTab />}

          {/* List Siswa */}
          {tab !== "remedial" && (
            <div>
              <div className="grid items-center gap-x-2 pb-2 text-xs font-semibold" style={{ gridTemplateColumns: kolom }}>
                <span>Nama Siswa</span>
                {tampilNilai && <span className="text-center">Nilai</span>}
                {tampilNilai && <span className="text-center">Status</span>}
                {tampilAksi && <span />}
              </div>

              {daftarSiswa.map((s) => {
                const sudahNilai = s.nilai !== null;
                const lulus = sudahNilai && s.nilai! >= KKM;
                return (
                  <div
                    key={s.id}
                    className="grid items-center gap-x-2 border-t border-gray-300 py-2.5 text-xs"
                    style={{ gridTemplateColumns: kolom }}
                  >
                    <span>{s.nama}</span>
                    {tampilNilai && (
                      <span className="text-center">
                        {sudahNilai ? (
                          <NilaiBadge lulus={lulus}>{s.nilai}</NilaiBadge>
                        ) : (
                          <span className="inline-block min-w-[44px] rounded-full bg-gray-200 px-3 py-0.5">-</span>
                        )}
                      </span>
                    )}
                    {tampilNilai && (
                      <span className="text-center">
                        {sudahNilai ? (
                          <NilaiBadge lulus={lulus}>{lulus ? "Tuntas" : "Remedial"}</NilaiBadge>
                        ) : (
                          <span className="inline-block min-w-[44px] rounded-full bg-gray-200 px-3 py-0.5">-</span>
                        )}
                      </span>
                    )}
                    {tampilAksi && (
                      <button
                        onClick={() => navigate(`/guru/koreksi/${soal_id}/siswa/${s.id}`)}
                        className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] text-white"
                      >
                        {s.sudahDikoreksi ? "Lihat/edit" : "Koreksi"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </XPadding>

      {tab === "nilai" && (
        <div className="mt-auto px-5 pb-6 pt-6">
          <button
            onClick={() => window.print()}
            className="w-full rounded-lg bg-blue-600 py-3 text-lg font-medium text-white"
          >
            Cetak
          </button>
        </div>
      )}
    </div>
  );
}