import { useCallback, useEffect, useState } from "react";

import { isApiError } from "@/shared/api/errors";

import {
  addCatatanWali,
  addTindakLanjutWali,
  getCatatanBkById,
  getKonselingSiswa,
} from "../api/konselingApi";
import type { CatatanBk, KonselingSiswaData } from "../model/konseling";

export type KonselingResourceState<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "error" };

export interface KonselingView<T> {
  state: KonselingResourceState<T>;
  reload: () => void;
}

// Hanya mengubah state di callback `then`/`catch`, bukan sinkron di efek
// (pola sama dengan `rapotSiswa/hooks/useRapot.ts`).
function useKonselingResource<T>(load: () => Promise<T>): KonselingView<T> {
  const [state, setState] = useState<KonselingResourceState<T>>({
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
 * Orkestrasi data modul Konseling Guru Wali (FR-KONSELING-001/002). Sumber di
 * `../api/konselingApi.ts` diganti saat kontrak API-KSL-001..003 diratifikasi,
 * tanpa mengubah hook/komponen.
 */
export function useKonselingSiswa(): KonselingView<KonselingSiswaData> {
  return useKonselingResource(getKonselingSiswa);
}

export function useCatatanBkById(
  idCatatanBk: string,
): KonselingView<CatatanBk | null> {
  const load = useCallback(() => getCatatanBkById(idCatatanBk), [idCatatanBk]);
  return useKonselingResource(load);
}

export interface CatatanFormController {
  submitting: boolean;
  formError: string | null;
  submit: (tanggal: string, isi: string) => Promise<boolean>;
}

export interface TindakLanjutFormController {
  submitting: boolean;
  formError: string | null;
  submit: (tindakLanjut: string) => Promise<boolean>;
}

function jelaskanGalatSimpan(error: unknown): string {
  if (isApiError(error)) {
    return error.message || "Gagal menyimpan data konseling.";
  }
  return "Tidak dapat menghubungi server. Periksa koneksi Anda.";
}

export function useSimpanCatatanWali(): CatatanFormController {
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = useCallback(
    async (tanggal: string, isi: string): Promise<boolean> => {
      if (!tanggal) {
        setFormError("Tanggal wajib diisi.");
        return false;
      }
      if (!isi.trim()) {
        setFormError("Isi catatan tidak boleh kosong.");
        return false;
      }
      setSubmitting(true);
      setFormError(null);
      try {
        await addCatatanWali({ tanggal, isi: isi.trim() });
        return true;
      } catch (error) {
        setFormError(jelaskanGalatSimpan(error));
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  return { submitting, formError, submit };
}

export function useSimpanTindakLanjut(
  idCatatanBk: string,
): TindakLanjutFormController {
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = useCallback(
    async (tindakLanjut: string): Promise<boolean> => {
      if (!tindakLanjut.trim()) {
        setFormError("Tindak lanjut tidak boleh kosong.");
        return false;
      }
      setSubmitting(true);
      setFormError(null);
      try {
        await addTindakLanjutWali(idCatatanBk, {
          tindakLanjut: tindakLanjut.trim(),
        });
        return true;
      } catch (error) {
        setFormError(jelaskanGalatSimpan(error));
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [idCatatanBk],
  );

  return { submitting, formError, submit };
}
