import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import XPadding from "@/shared/components/layout/XPadding";
import EmptyState from "@/shared/components/state/EmptyState";
import ErrorState from "@/shared/components/state/ErrorState";

import CatatanCard from "../components/CatatanCard";
import KonselingShell from "../components/KonselingShell";
import KonselingTabSwitcher from "../components/KonselingTabSwitcher";
import { useKonselingSiswa } from "../hooks/useKonselingWali";
import { formatTanggal } from "../model/konseling";
import type { KonselingSubTab } from "../model/konseling";

function catatanTerakhir<T>(daftar: readonly T[]): T | undefined {
  return daftar.length > 0 ? daftar[daftar.length - 1] : undefined;
}

/**
 * Halaman catatan konseling siswa untuk guru wali (FR-KONSELING-001):
 * menampilkan catatan terakhir wali kelas / BK dan navigasi ke form tambah
 * catatan serta form tindak lanjut.
 */
export default function KonselingWali() {
  const { siswa_id } = useParams();
  const navigate = useNavigate();
  const [subTab, setSubTab] = useState<KonselingSubTab>("wali");

  const konselingView = useKonselingSiswa();

  if (konselingView.state.status === "error") {
    return (
      <KonselingShell>
        <XPadding className="mt-6">
          <ErrorState
            title="Gagal memuat catatan konseling"
            description="Silakan coba lagi."
            action={
              <button
                type="button"
                onClick={konselingView.reload}
                className="mt-2 text-sm font-semibold text-brand-600 underline"
              >
                Coba lagi
              </button>
            }
          />
        </XPadding>
      </KonselingShell>
    );
  }

  if (konselingView.state.status === "loading") {
    return (
      <KonselingShell>
        <XPadding className="mt-6">
          <p role="status" className="text-sm text-slate-500">
            Memuat catatan konseling…
          </p>
        </XPadding>
      </KonselingShell>
    );
  }

  const { siswa, catatanWali, catatanBk } = konselingView.state.data;
  const waliTerakhir = catatanTerakhir(catatanWali);
  const bkTerakhir = catatanTerakhir(catatanBk);
  const tanggalTampil =
    subTab === "wali" ? waliTerakhir?.tanggal : bkTerakhir?.tanggal;

  return (
    <KonselingShell
      footer={
        subTab === "wali" ? (
          <XPadding className="mt-8 mb-2">
            <button
              type="button"
              className="w-full bg-brand-500 text-white font-medium py-3.5 rounded-2xl shadow-md hover:bg-blue-600 transition active:scale-[0.99] text-base tracking-wide"
              onClick={() =>
                navigate(`/guruWali/konseling/siswa/${siswa_id}/catatan`)
              }
            >
              Tambah Catatan
            </button>
          </XPadding>
        ) : (
          <XPadding className="mt-8 mb-2">
            {/* Di tab BK area tombol bawah dikosongkan; aksi diwakili tombol
                "Isi Tindak Lanjut" di dalam kartu. */}
            <div className="h-[54px] w-full bg-transparent pointer-events-none" />
          </XPadding>
        )
      }
    >
      <XPadding className="mt-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-slate-900 leading-tight">
            {siswa.nama}
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            {siswa.kelas}
          </p>
        </div>

        <KonselingTabSwitcher value={subTab} onChange={setSubTab} />

        {tanggalTampil ? (
          <div className="mt-6 text-sm font-semibold text-slate-900">
            {formatTanggal(tanggalTampil)}
          </div>
        ) : null}

        <div className="mt-3 border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col">
          {subTab === "wali" ? (
            waliTerakhir ? (
              <CatatanCard
                catatanTitle="Catatan Wali Kelas"
                catatanIsi={waliTerakhir.isi}
                followupTitle="Tindak lanjut bk"
                followupIsi={waliTerakhir.tindakLanjutBk}
                emptyFollowupLabel="Belum ada tindak lanjut BK."
              />
            ) : (
              <EmptyState
                title="Belum ada catatan"
                description="Belum ada catatan konseling wali kelas untuk siswa ini."
              />
            )
          ) : bkTerakhir ? (
            <CatatanCard
              catatanTitle="Catatan BK"
              catatanIsi={bkTerakhir.isi}
              followupTitle="Tindak lanjut wali kelas"
              followupIsi={bkTerakhir.tindakLanjutWaliKelas}
              emptyFollowupLabel="Belum ada tindak lanjut wali kelas."
              action={
                <button
                  type="button"
                  className="mt-4 bg-brand-500 text-white text-xs font-medium px-5 py-2 rounded-xl shadow-sm hover:bg-blue-600 transition active:scale-[0.98]"
                  onClick={() =>
                    navigate(
                      `/guruWali/konseling/siswa/${siswa_id}/tindakLanjut/${bkTerakhir.id}`,
                    )
                  }
                >
                  Isi Tindak Lanjut
                </button>
              }
            />
          ) : (
            <EmptyState
              title="Belum ada catatan"
              description="Belum ada catatan konseling BK untuk siswa ini."
            />
          )}
        </div>
      </XPadding>
    </KonselingShell>
  );
}
