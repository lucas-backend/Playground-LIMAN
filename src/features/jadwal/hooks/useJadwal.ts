import { useCallback, useEffect, useState } from "react";

import type { TryoutItem } from "@/shared/components/ui/QuizItemCard";

import {
  getJadwalPelajaran,
  getJadwalTryout,
  getJadwalUjian,
} from "../api/jadwalApi";
import type { JadwalPelajaranData } from "../model/jadwal";

export type JadwalResourceState<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "error" };

export interface JadwalView<T> {
  state: JadwalResourceState<T>;
  reload: () => void;
}

// Hanya mengubah state di callback `then`/`catch`, bukan sinkron di efek
// (latihan-soal/useLatihanSoal.ts, notifikasi/useNotifikasi.ts).
function useJadwalResource<T>(load: () => Promise<T>): JadwalView<T> {
  const [state, setState] = useState<JadwalResourceState<T>>({
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
 * Orkestrasi data modul Jadwal (FR-JADWAL-001): tiap tab memuat datanya
 * sendiri dari adapter mock (`../api/jadwalApi.ts`) dengan state
 * loading/error eksplisit. Sumber di `api/jadwalApi.ts` diganti saat kontrak
 * API-JWL-001 diratifikasi, tanpa mengubah hook/komponen.
 */
export function useJadwalPelajaran(): JadwalView<JadwalPelajaranData> {
  return useJadwalResource(getJadwalPelajaran);
}

export function useJadwalTryout(): JadwalView<TryoutItem[]> {
  return useJadwalResource(getJadwalTryout);
}

export function useJadwalUjian(): JadwalView<TryoutItem[]> {
  return useJadwalResource(getJadwalUjian);
}