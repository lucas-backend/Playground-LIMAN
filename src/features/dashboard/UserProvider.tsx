import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { getCurrentUser, login as loginRequest, logout as logoutRequest } from "../auth/api/authApi";
import type { RoleCode, UserSummary } from "../auth/api/types";
import { ApiError } from "../../shared/api/errors";
import type { UserRole } from "./data.mock";
import { UserContext, type UserContextValue } from "./UserContext";

const ROLE_MAP: Record<RoleCode, UserRole> = {
  siswa: "siswa",
  guru_mapel: "guruMapel",
  guru_wali: "guruWali",
  guru_bk: "guruBK",
  admin: "admin",
};

function getPrimaryRole(user: UserSummary | null): UserRole {
  return user?.roles?.map((role) => ROLE_MAP[role]).find(Boolean) ?? "siswa";
}

export default function UserProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<UserSummary | null>(null);
  const [status, setStatus] = useState<UserContextValue["status"]>("loading");
  const [authError, setAuthError] = useState<ApiError | null>(null);
  const [roleOverride, setRoleOverride] = useState<UserRole | null>(null);
  const [isPresent, setIsPresent] = useState(true);

  const loadSession = useCallback(async () => {
    setStatus("loading");
    setAuthError(null);
    try {
      setAuthUser(await getCurrentUser());
      setStatus("authenticated");
    } catch (error) {
      const apiError = error instanceof ApiError
        ? error
        : new ApiError({ code: "NETWORK_ERROR", message: "Sesi tidak dapat diperiksa." });
      setAuthUser(null);
      setStatus(apiError.code === "UNAUTHENTICATED" || apiError.status === 401
        ? "unauthenticated"
        : "error");
      setAuthError(apiError.code === "UNAUTHENTICATED" || apiError.status === 401 ? null : apiError);
    }
  }, []);

  useEffect(() => {
    const bootstrap = globalThis.setTimeout(() => {
      void loadSession();
    }, 0);
    return () => globalThis.clearTimeout(bootstrap);
  }, [loadSession]);

  const login = useCallback(async (email: string, password: string) => {
    await loginRequest({ email, password });
    const currentUser = await getCurrentUser();
    setAuthUser(currentUser);
    setAuthError(null);
    setRoleOverride(null);
    setStatus("authenticated");
  }, []);

  const clearSession = useCallback(() => {
    setAuthUser(null);
    setAuthError(null);
    setRoleOverride(null);
    setStatus("unauthenticated");
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
      clearSession();
    } catch (error) {
      if (error instanceof ApiError && (error.code === "UNAUTHENTICATED" || error.status === 401)) {
        clearSession();
      }
      throw error;
    }
  }, [clearSession]);

  const value = useMemo<UserContextValue>(
    () => ({
      name: authUser?.fullName ?? authUser?.email ?? "",
      role: roleOverride ?? getPrimaryRole(authUser),
      isPresent,
      status,
      authUser,
      authError,
      login,
      logout,
      retrySession: loadSession,
      setRole: setRoleOverride,
      setIsPresent,
      resetUser: clearSession,
    }),
    [authUser, authError, clearSession, isPresent, loadSession, login, logout, roleOverride, status],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
