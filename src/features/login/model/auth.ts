/**
 * Model domain modul Login/Auth.
 *
 * Sumber: FR-AUTH-001/006, BR-01; kontrak API-AUTH-001
 * (docs/06-api-documentation.md §6).
 * Aturan kompleksitas password belum ditetapkan (DEC-05 `TBD`), jadi tidak
 * dikarang di sini — hanya kewajiban isi dan format email (FR-AUTH-006).
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export type LoginField = keyof LoginCredentials;

export type LoginFieldErrors = Partial<Record<LoginField, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCredentials(
  credentials: LoginCredentials,
): LoginFieldErrors {
  const errors: LoginFieldErrors = {};
  const email = credentials.email.trim();

  if (email === "") {
    errors.email = "Email wajib diisi.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Format email tidak valid.";
  }

  if (credentials.password === "") {
    errors.password = "Password wajib diisi.";
  }

  return errors;
}
