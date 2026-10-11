import { useCallback, useMemo, useState } from "react";

import { isApiError } from "@/shared/api/errors";
import { useSession } from "@/shared/session/session";

import { addTargetMajor } from "../api/aptitudeApi";
import type { UniversitasOption } from "../model/aptitude";
import { DEMO_UNIVERSITAS } from "../model/aptitude.mock";

function describeAddError(error: unknown): string {
  if (isApiError(error)) {
    return error.message || "Gagal menyimpan target jurusan.";
  }
  return "Tidak dapat menghubungi server. Periksa koneksi Anda.";
}

export interface TambahTargetJurusanController {
  universities: UniversitasOption[];
  selectedUniversitasName: string;
  selectedJurusan: string;
  jurusanOptions: string[];
  formError: string | null;
  submitting: boolean;
  selectUniversitas: (nama: string) => void;
  selectJurusan: (nama: string) => void;
  submit: () => Promise<boolean>;
}

/**
 * Orkestrasi form tambah target jurusan (FR-MB-002).
 *
 * Validasi murni klien: universitas dan jurusan wajib dipilih. Saat valid,
 * simpan via adapter mock `addTargetMajor` (API-MB-002). Catatan: kontrak
 * belum menyediakan `GET target-majors`, sehingga hasil simpan tidak dapat
 * ditampilkan kembali pada halaman hasil (keterbatasan jujur, bukan fitur
 * baru).
 */
export function useTambahTargetJurusan(): TambahTargetJurusanController {
  const { user } = useSession();
  const [selectedUniversitasId, setSelectedUniversitasId] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedUniversitas = useMemo(
    () =>
      DEMO_UNIVERSITAS.find((univ) => univ.id === selectedUniversitasId) ??
      null,
    [selectedUniversitasId],
  );

  const jurusanOptions = useMemo(
    () => selectedUniversitas?.listJurusan ?? [],
    [selectedUniversitas],
  );

  const selectUniversitas = useCallback((nama: string) => {
    const univ = DEMO_UNIVERSITAS.find((item) => item.nama === nama);
    setSelectedUniversitasId(univ?.id ?? "");
    // Universitas berubah → jurusan selesai sebelumnya tidak relevan.
    setSelectedJurusan("");
    setFormError(null);
  }, []);

  const selectJurusan = useCallback((nama: string) => {
    setSelectedJurusan(nama);
    setFormError(null);
  }, []);

  const submit = useCallback(async (): Promise<boolean> => {
    if (!selectedUniversitas || selectedJurusan === "") {
      setFormError("Pilih universitas dan jurusan untuk menyimpan target.");
      return false;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      await addTargetMajor(user?.id ?? "", { major: selectedJurusan });
      return true;
    } catch (error) {
      setFormError(describeAddError(error));
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [selectedUniversitas, selectedJurusan, user]);

  return {
    universities: DEMO_UNIVERSITAS,
    selectedUniversitasName: selectedUniversitas?.nama ?? "",
    selectedJurusan,
    jurusanOptions,
    formError,
    submitting,
    selectUniversitas,
    selectJurusan,
    submit,
  };
}