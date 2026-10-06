import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import XPadding from "../../../components/XPadding";
import {
  catatanBkDummy,
  catatanWaliDummy,
  formatTanggal,
  siswaDummy,
} from "./konselingData";

type Tab = "bk" | "wali";

export default function KonselingSiswaDetail() {
  const { siswa_id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("bk");

  const base = `/guruBK/konseling/siswa/${siswa_id}`;

  // Badge = catatan yang belum punya tindak lanjut
  const belumBk = catatanBkDummy.filter((c) => !c.tindakLanjutWaliKelas).length;
  const belumWali = catatanWaliDummy.filter((c) => !c.tindakLanjutBk).length;

  const tabClass = (active: boolean) =>
    `relative rounded-full border border-black px-4 py-1 text-[11px] font-medium ${
      active ? "bg-blue-100" : "bg-white"
    }`;

  return (
    <div className="pb-24">
      <XPadding className="mt-6">
        <h3 className="text-sm font-semibold">{siswaDummy.nama}</h3>
        <p className="text-[10px] text-gray-500">{siswaDummy.kelas}</p>

        <div className="mt-4 flex gap-2">
          <button className={tabClass(tab === "bk")} onClick={() => setTab("bk")}>
            catatan bk
            {belumBk > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] text-white">
                {belumBk}
              </span>
            )}
          </button>
          <button className={tabClass(tab === "wali")} onClick={() => setTab("wali")}>
            catatan wali kelas
            {belumWali > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] text-white">
                {belumWali}
              </span>
            )}
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {tab === "bk"
            ? catatanBkDummy.map((c) => (
                <div key={c.id}>
                  <p className="mb-2 text-xs">{formatTanggal(c.tanggal)}</p>
                  <div className="overflow-hidden rounded-xl border border-gray-400 bg-white">
                    <div className="flex flex-col bg-blue-50 p-3">
                      <p className="text-[11px] font-semibold">Catatan bk</p>
                      <p className="text-[10px]">{c.isi}</p>
                      <button
                        className="mx-auto mt-6 rounded-full bg-blue-600 px-4 py-0.5 text-[9px] text-white"
                        onClick={() => navigate(`${base}/edit/${c.id}`)}
                      >
                        Edit catatan
                      </button>
                    </div>
                    <div className="border-t border-gray-400 p-3">
                      <p className="text-[11px] font-semibold">Tindak lanjut wali kelas</p>
                      <p className="text-[10px]">{c.tindakLanjutWaliKelas ?? "-"}</p>
                    </div>
                  </div>
                </div>
              ))
            : catatanWaliDummy.map((c) => (
                <div key={c.id}>
                  <p className="mb-2 text-xs">{formatTanggal(c.tanggal)}</p>
                  <div className="overflow-hidden rounded-xl border border-gray-400 bg-white">
                    <div className="bg-blue-50 p-3 pb-10">
                      <p className="text-[11px] font-semibold">Catatan wali kelas</p>
                      <p className="text-[10px]">{c.isi}</p>
                    </div>
                    <div className="flex flex-col border-t border-gray-400 p-3">
                      <p className="text-[11px] font-semibold">Tindak lanjut bk</p>
                      {c.tindakLanjutBk ? (
                        <p className="text-[10px]">{c.tindakLanjutBk}</p>
                      ) : (
                        <button
                          className="mx-auto mt-6 rounded-full bg-blue-600 px-4 py-0.5 text-[9px] text-white"
                          onClick={() => navigate(`${base}/tindakLanjut/${c.id}`)}
                        >
                          Isi tindak lanjut
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </XPadding>

      {/* Tombol tambah catatan hanya untuk tab catatan BK */}
      {tab === "bk" && (
        <div className="fixed inset-x-0 bottom-0 p-4">
          <button
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white"
            onClick={() => navigate(`${base}/tambah`)}
          >
            tambah catatan
          </button>
        </div>
      )}
    </div>
  );
}