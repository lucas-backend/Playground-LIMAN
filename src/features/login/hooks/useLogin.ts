import { useCallback, useState } from "react";

import { isApiError } from "@/shared/api/errors";
import { useSession, type SessionUser } from "@/shared/session/session";

import { login } from "../api/authApi";
import {
  validateCredentials,
  type LoginCredentials,
  type LoginField,
  type LoginFieldErrors,
} from "../model/auth";

// Terjemahan error transport/kontrak menjadi pesan UI. Pesan generik untuk
// kredensial salah agar tidak mengungkap field mana yang keliru (API-AUTH-001).
function describeLoginError(error: unknown): string {
  if (isApiError(error)) {
    switch (error.code) {
      case "INVALID_CREDENTIALS":
        return "Email atau password salah.";
      case "VALIDATION_ERROR":
        return "Periksa kembali data yang dimasukkan.";
      case "RATE_LIMITED":
        return "Terlalu banyak percobaan masuk. Coba lagi nanti.";
      default:
        return error.message || "Gagal masuk. Silakan coba lagi.";
    }
  }
  return "Tidak dapat menghubungi server. Periksa koneksi Anda.";
}

export function useLogin() {
  const { signIn } = useSession();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const changeField = useCallback((field: LoginField, value: string) => {
    setCredentials((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  // Mengembalikan user bila berhasil (pemanggil yang mengarahkan navigasi).
  const submit = useCallback(async (): Promise<SessionUser | null> => {
    const errors = validateCredentials(credentials);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError(null);
      return null;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      const user = await login(credentials);
      signIn(user);
      return user;
    } catch (error) {
      setFormError(describeLoginError(error));
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [credentials, signIn]);

  return {
    credentials,
    fieldErrors,
    formError,
    submitting,
    changeField,
    submit,
  };
}
