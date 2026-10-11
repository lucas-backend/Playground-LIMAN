import { useCallback, useEffect, useMemo, useState } from "react";

import { listPassingGrades } from "../api/passingGradeApi";
import { filterGradesByMajor, type PassingGrade } from "../model/passingGrade";

export type PassingGradeUniversityState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; grades: PassingGrade[] };

export interface PassingGradeUniversityView {
  state: PassingGradeUniversityState;
  /** Daftar jurusan setelah difilter kata kunci (selalu ter-saring). */
  grades: PassingGrade[];
  query: string;
  setQuery: (value: string) => void;
  reload: () => void;
}

/**
 * Orkestrasi data layar jurusan per universitas (FR-PG-001). Memuat passing
 * grade dengan filter `university` (API-PG-001); pencarian jurusan disaring di
 * klien atas data yang sudah dimuat.
 *
 * Komponen pemanggil meng-*key* dirinya dengan `university` agar state
 * di-reset saat universitas berubah (menghindari daftar lama tampil sementara).
 */
export function usePassingGradeUniversity(
  university: string,
): PassingGradeUniversityView {
  const [state, setState] = useState<PassingGradeUniversityState>({
    status: "loading",
  });
  const [query, setQuery] = useState("");

  const fetch = useCallback(() => {
    listPassingGrades({ university })
      .then((grades) => setState({ status: "ready", grades }))
      .catch(() => setState({ status: "error" }));
  }, [university]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const reload = useCallback(() => {
    setState({ status: "loading" });
    fetch();
  }, [fetch]);

  const grades = useMemo(
    () =>
      state.status === "ready"
        ? filterGradesByMajor(state.grades, query)
        : [],
    [state, query],
  );

  return { state, grades, query, setQuery, reload };
}
