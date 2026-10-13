import { useCallback, useEffect, useState } from "react";

import { getAbsensiHariDetail } from "../api/absensiWaliApi";
import type { AbsensiHariDetail } from "../model/absensiWali";

export type AbsensiHariState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: AbsensiHariDetail | null };

export interface AbsensiHariView {
  state: AbsensiHariState;
  reload: () => void;
}

/**
 * Orkestrasi detail absensi satu hari per mata pelajaran
 * (`/guruWali/absensi/siswa/:siswa_id/detail/`, FR-ABS-003). `data` bernilai
 * `null` bila siswa tidak ada dalam cakupan.
 */
export function useAbsensiHari(siswaId: string): AbsensiHariView {
  const [state, setState] = useState<AbsensiHariState>({ status: "loading" });

  const fetchData = useCallback(() => {
    getAbsensiHariDetail(siswaId)
      .then((data) => setState({ status: "ready", data }))
      .catch(() => setState({ status: "error" }));
  }, [siswaId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const reload = useCallback(() => {
    setState({ status: "loading" });
    fetchData();
  }, [fetchData]);

  return { state, reload };
}
