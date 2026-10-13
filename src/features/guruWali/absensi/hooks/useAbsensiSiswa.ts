import { useCallback, useEffect, useState } from "react";

import { getAbsensiSiswaDetail } from "../api/absensiWaliApi";
import type { AbsensiSiswaDetail } from "../model/absensiWali";

export type AbsensiSiswaState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: AbsensiSiswaDetail | null };

export interface AbsensiSiswaView {
  state: AbsensiSiswaState;
  reload: () => void;
}

/**
 * Orkestrasi riwayat absensi harian satu siswa
 * (`/guruWali/absensi/siswa/:siswa_id`, FR-ABS-003). `data` bernilai `null`
 * bila siswa tidak ada dalam cakupan.
 */
export function useAbsensiSiswa(siswaId: string): AbsensiSiswaView {
  const [state, setState] = useState<AbsensiSiswaState>({ status: "loading" });

  const fetchData = useCallback(() => {
    getAbsensiSiswaDetail(siswaId)
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
