import { useCallback, useEffect, useMemo, useState } from "react";

import { useSession, type SessionUser } from "@/shared/session/session";

import { getTodayAttendance } from "../api/dashboardApi";
import {
  featuresForRoles,
  isStudent,
  type DashboardFeature,
} from "../model/dashboard";

export type AttendanceState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; isPresent: boolean }
  | { status: "error" };

export interface DashboardView {
  user: SessionUser | null;
  features: DashboardFeature[];
  isStudent: boolean;
  attendance: AttendanceState;
  reloadAttendance: () => void;
}

/**
 * Orkestrasi data halaman dashboard: peran dari sesi (`/auth/me`) menentukan
 * menu (FR-DASH-001); status absensi siswa dimuat terpisah agar state
 * loading/error-nya eksplisit.
 */
export function useDashboard(): DashboardView {
  const { user } = useSession();
  const roles = user?.roles;

  const features = useMemo(() => featuresForRoles(roles ?? []), [roles]);
  const student = isStudent(roles ?? []);

  const [attendance, setAttendance] = useState<AttendanceState>({
    status: "idle",
  });

  const fetchAttendance = useCallback(() => {
    if (!user) return;
    getTodayAttendance(user.id)
      .then((result) =>
        setAttendance({ status: "ready", isPresent: result.isPresent }),
      )
      .catch(() => setAttendance({ status: "error" }));
  }, [user]);

  useEffect(() => {
    if (!student) return;
    fetchAttendance();
  }, [student, fetchAttendance]);

  const reloadAttendance = useCallback(() => {
    setAttendance({ status: "loading" });
    fetchAttendance();
  }, [fetchAttendance]);

  return {
    user,
    features,
    isStudent: student,
    attendance,
    reloadAttendance,
  };
}
