import { useCallback, useEffect, useState } from "react";

import {
  getRapotAbsensi,
  getRapotAbsensiMateri,
  getRapotMapelDetail,
  getRapotSiswaWali,
} from "../api/rapotApi";
import type {
  RapotAbsensiData,
  RapotAbsensiMateriData,
  RapotMapelDetailData,
  RapotSiswaWaliData,
} from "../model/rapot";

export type RapotResourceState<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "error" };

export interface RapotView<T> {
  state: RapotResourceState<T>;
  reload: () => void;
}

// Hanya mengubah state di callback `then`/`catch`, bukan sinkron di efek
// (pola sama dengan `jadwal/hooks/useJadwal.ts`).
function useRapotResource<T>(load: () => Promise<T>): RapotView<T> {
  const [state, setState] = useState<RapotResourceState<T>>({
    status: "loading",
  });

  const fetchData = useCallback(() => {
    load()
      .then((data) => setState({ status: "ready", data }))
      .catch(() => setState({ status: "error" }));
  }, [load]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const reload = useCallback(() => {
    setState({ status: "loading" });
    fetchData();
  }, [fetchData]);

  return { state, reload };
}

/**
 * Orkestrasi data modul Rapot Guru Wali (FR-RAPOT-001/002): tiap halaman
 * memuat datanya sendiri dari adapter mock (`../api/rapotApi.ts`) dengan
 * state loading/error eksplisit. Sumber di `api/rapotApi.ts` diganti saat
 * kontrak API-RPT-003 diratifikasi, tanpa mengubah hook/komponen.
 */
export function useRapotSiswaWali(): RapotView<RapotSiswaWaliData> {
  return useRapotResource(getRapotSiswaWali);
}

export function useRapotMapelDetail(): RapotView<RapotMapelDetailData> {
  return useRapotResource(getRapotMapelDetail);
}

export function useRapotAbsensi(): RapotView<RapotAbsensiData> {
  return useRapotResource(getRapotAbsensi);
}

export function useRapotAbsensiMateri(): RapotView<RapotAbsensiMateriData> {
  return useRapotResource(getRapotAbsensiMateri);
}