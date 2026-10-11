import { useCallback, useEffect, useMemo, useState } from "react";

import { listPassingGrades } from "../api/passingGradeApi";
import {
  deriveUniversities,
  filterUniversities,
} from "../model/passingGrade";

export type PassingGradeListState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; universities: string[] };

export interface PassingGradeListView {
  state: PassingGradeListState;
  /** Daftar universitas setelah difilter kata kunci (selalu ter-saring). */
  universities: string[];
  query: string;
  setQuery: (value: string) => void;
  reload: () => void;
}

/**
 * Orkestrasi data layar daftar Passing Grade (FR-PG-001): memuat daftar
 * passing grade dari adapter (API-PG-001) lalu menurunkan universitas unik.
 * Pencarian disaring di klien atas data yang sudah dimuat.
 */
export function usePassingGradeList(): PassingGradeListView {
  const [state, setState] = useState<PassingGradeListState>({
    status: "loading",
  });
  const [query, setQuery] = useState("");

  const fetch = useCallback(() => {
    listPassingGrades()
      .then((grades) =>
        setState({ status: "ready", universities: deriveUniversities(grades) }),
      )
      .catch(() => setState({ status: "error" }));
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const reload = useCallback(() => {
    setState({ status: "loading" });
    fetch();
  }, [fetch]);

  const universities = useMemo(
    () =>
      state.status === "ready"
        ? filterUniversities(state.universities, query)
        : [],
    [state, query],
  );

  return { state, universities, query, setQuery, reload };
}
