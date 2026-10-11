import { useCallback, useEffect, useState } from "react";

import { useSession } from "@/shared/session/session";

import { getAptitudeResults } from "../api/aptitudeApi";
import {
  formatTanggalTes,
  type HasilMinatBakatSummary,
  type TargetJurusanLainItem,
} from "../model/aptitude";
import { DEMO_SUMMARY, DEMO_TARGET_JURUSAN } from "../model/aptitude.mock";

export type WaktuTesState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; tanggal: string }
  | { status: "error" };

export interface HasilMinatBakatController {
  summary: HasilMinatBakatSummary;
  targetJurusanLain: TargetJurusanLainItem[];
  waktuTes: WaktuTesState;
  reloadWaktuTes: () => void;
  deleteTargetJurusan: (id: string) => void;
}

/**
 * Orkestrasi data halaman hasil minat bakat (FR-MB-001/002).
 *
 * Waktu tes (`assessedAt`) diambil lewat adapter mock `getAptitudeResults`
 * agar jalur loading/error eksplisit. Ringkasan (minat/bakat/rekomendasi) dan
 * daftar target jurusan lain masih fixture demo (lihat model/aptitude.mock.ts)
 * karena tidak ada kontrak endpoint untuk keduanya.
 */
export function useHasilMinatBakat(): HasilMinatBakatController {
  const { user } = useSession();

  const [targetJurusanLain, setTargetJurusanLain] = useState<
    TargetJurusanLainItem[]
  >(DEMO_TARGET_JURUSAN);
  const [waktuTes, setWaktuTes] = useState<WaktuTesState>({ status: "idle" });

  const fetchWaktuTes = useCallback(() => {
    getAptitudeResults(user?.id ?? "")
      .then((response) => {
        const tanggal = formatTanggalTes(response.results[0]?.assessedAt ?? "");
        if (tanggal === "") {
          throw new Error("assessedAt tidak tersedia pada hasil aptitude.");
        }
        setWaktuTes({ status: "ready", tanggal });
      })
      .catch(() => setWaktuTes({ status: "error" }));
  }, [user]);

  useEffect(() => {
    fetchWaktuTes();
  }, [fetchWaktuTes]);

  const reloadWaktuTes = useCallback(() => {
    setWaktuTes({ status: "loading" });
    fetchWaktuTes();
  }, [fetchWaktuTes]);

  const deleteTargetJurusan = useCallback((id: string) => {
    setTargetJurusanLain((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return {
    summary: DEMO_SUMMARY,
    targetJurusanLain,
    waktuTes,
    reloadWaktuTes,
    deleteTargetJurusan,
  };
}