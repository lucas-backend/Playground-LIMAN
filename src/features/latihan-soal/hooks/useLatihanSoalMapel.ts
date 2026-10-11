import { useCallback, useEffect, useState } from "react";

import { getMapelLatihanDetail } from "../api/latihanSoalApi";
import type { MapelLatihanDetail } from "../model/latihanSoal";

export type MapelDetailState =
  | { status: "loading" }
  | { status: "ready"; data: MapelLatihanDetail }
  | { status: "notfound" }
  | { status: "error" };

export interface LatihanSoalMapelView {
  state: MapelDetailState;
  reload: () => void;
}

/**
 * Orkestrasi halaman detail latihan per mata pelajaran
 * (`/latihan-soal/mapel/:mapel_id`). `id` yang hilang atau tidak dikenal
 * menghasilkan state `notfound`, bukan error render (FR-LATIHAN-001).
 */
export function useLatihanSoalMapel(
  mapelId: string | undefined,
): LatihanSoalMapelView {
  const [state, setState] = useState<MapelDetailState>(
    mapelId ? { status: "loading" } : { status: "notfound" },
  );

  // Tidak memanggil `setState` secara sinkron di dalam efek: `fetchDetail`
  // hanya mengubah state di callback `then`/`catch`, dan langsung keluar bila
  // id tidak ada (state `notfound` sudah ditetapkan saat inisialisasi).
  const fetchDetail = useCallback(() => {
    if (!mapelId) return;
    getMapelLatihanDetail(mapelId)
      .then((detail) =>
        setState(
          detail ? { status: "ready", data: detail } : { status: "notfound" },
        ),
      )
      .catch(() => setState({ status: "error" }));
  }, [mapelId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const reload = useCallback(() => {
    if (!mapelId) return;
    setState({ status: "loading" });
    fetchDetail();
  }, [fetchDetail, mapelId]);

  return { state, reload };
}
