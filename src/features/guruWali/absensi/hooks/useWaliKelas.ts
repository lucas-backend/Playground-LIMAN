import { useCallback, useEffect, useState } from "react";

import { getWaliKelasDetail } from "../api/absensiWaliApi";
import type { WaliKelasDetail } from "../model/absensiWali";

export type WaliKelasState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: WaliKelasDetail };

export interface WaliKelasView {
  state: WaliKelasState;
  reload: () => void;
}

/**
 * Orkestrasi data menu wali kelas (`/guruWali/absensi/:kelas_id`): daftar
 * siswa perwalian beserta rekap absensinya (FR-ABS-003). Menyediakan state
 * loading/error eksplisit.
 */
export function useWaliKelas(kelasId: string): WaliKelasView {
  const [state, setState] = useState<WaliKelasState>({ status: "loading" });

  const fetchData = useCallback(() => {
    getWaliKelasDetail(kelasId)
      .then((data) => setState({ status: "ready", data }))
      .catch(() => setState({ status: "error" }));
  }, [kelasId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const reload = useCallback(() => {
    setState({ status: "loading" });
    fetchData();
  }, [fetchData]);

  return { state, reload };
}
