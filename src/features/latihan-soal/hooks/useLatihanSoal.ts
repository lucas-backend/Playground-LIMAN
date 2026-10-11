import { useCallback, useEffect, useState } from "react";

import { getMapelLatihanList } from "../api/latihanSoalApi";
import type { MapelLatihan } from "../model/latihanSoal";

export type MapelListState =
  | { status: "loading" }
  | { status: "ready"; data: MapelLatihan[] }
  | { status: "error" };

export interface LatihanSoalView {
  state: MapelListState;
  reload: () => void;
}

/**
 * Orkestrasi halaman daftar latihan (`/latihan-soal`): memuat daftar mata
 * pelajaran dan menyediakan state loading/error eksplisit (FR-LATIHAN-001).
 */
export function useLatihanSoal(): LatihanSoalView {
  const [state, setState] = useState<MapelListState>({ status: "loading" });

  // Hanya mengubah state di callback `then`/`catch`, bukan sinkron di efek
  // (menghindari cascading render).
  const fetchList = useCallback(() => {
    getMapelLatihanList()
      .then((data) => setState({ status: "ready", data }))
      .catch(() => setState({ status: "error" }));
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const reload = useCallback(() => {
    setState({ status: "loading" });
    fetchList();
  }, [fetchList]);

  return { state, reload };
}
