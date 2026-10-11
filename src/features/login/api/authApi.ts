import { ApiError } from "@/shared/api/errors";
import type { SessionUser } from "@/shared/session/session";

import type { LoginCredentials } from "../model/auth";

/**
 * Akses data modul Auth.
 *
 * Kontrak resmi: API-AUTH-001 `POST /api/v1/auth/login`
 * (docs/06-api-documentation.md §6). Kontrak masih `Proposed` dan backend auth
 * belum tersedia (KD-07/KD-09 `Blocked`), sehingga fungsi ini memakai adapter
 * mock sementara.
 *
 * TODO(auth F5): saat kontrak `Approved`, ganti isi `login` dengan panggilan
 * `api.post<ApiLoginResponse>("/auth/login", credentials)` lewat shared/api,
 * lalu petakan respons `{ user: { id, fullName, email, roles, status } }`
 * menjadi `SessionUser`. Hapus konstanta mock di bawah saat itu.
 */

const MOCK_DELAY_MS = 400;

// Akun demo adapter mock. Sengaja tidak menyerupai kredensial/PII nyata
// (lihat docs/restructure/MASTER_PROMPT.md §557). Hanya untuk pengembangan.
const MOCK_ACCOUNT = {
  email: "demo@example.test",
  password: "demo",
  user: {
    id: "00000000-0000-0000-0000-000000000001",
    fullName: "Pengguna Demo",
    email: "demo@example.test",
    roles: ["siswa"],
  } satisfies SessionUser,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(
  credentials: LoginCredentials,
): Promise<SessionUser> {
  await delay(MOCK_DELAY_MS);

  const email = credentials.email.trim().toLowerCase();
  if (
    email === MOCK_ACCOUNT.email &&
    credentials.password === MOCK_ACCOUNT.password
  ) {
    return MOCK_ACCOUNT.user;
  }

  // Kode error mengikuti kontrak API-AUTH-001; tidak mengungkap field salah.
  throw new ApiError(401, {
    code: "INVALID_CREDENTIALS",
    message: "Email atau password salah.",
  });
}
