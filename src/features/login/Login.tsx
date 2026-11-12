import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import Button from "../../components/Button";
import XPadding from "../../components/XPadding";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../shared/api/errors";
import { useUser } from "../dashboard/UserContext";

const appName = "LIMAN";

export default function Login() {
  const navigate = useNavigate();
  const { login, status } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") navigate("/dashboard", { replace: true });
  }, [navigate, status]);

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage("Email dan password wajib diisi.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === "INVALID_CREDENTIALS" || error.status === 401) {
          setErrorMessage("Email atau password salah.");
        } else if (error.code === "NETWORK_ERROR") {
          setErrorMessage("Tidak dapat terhubung ke server. Coba lagi.");
        } else if (error.code === "CSRF_INVALID") {
          setErrorMessage("Permintaan ditolak karena token CSRF tidak valid. Muat ulang halaman.");
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage("Login gagal. Coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="bg-blue-500 h-dvh text-white flex items-center pb-32">
      <XPadding>
        {/* Icon & Title */}
        <div className="text-center">
          <MenuBookRoundedIcon className="h-16! w-16!" />
          <h1 className="text-6xl font-bold">{appName}</h1>
        </div>

        <form
          className="flex flex-col items-center gap-4 mt-12"
          onSubmit={handleFormSubmit}
        >
          <span className="font-semibold text-2xl">Masuk</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            aria-invalid={Boolean(errorMessage)}
            className="text-black bg-white w-full px-4 py-2 focus:outline-none rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className="text-black bg-white w-full px-4 py-2 focus:outline-none rounded-lg"
          />
          {errorMessage && <p role="alert" className="w-full text-center text-sm text-red-100">{errorMessage}</p>}
          <Button type="submit" disabled={isSubmitting} className="bg-orange-400">
            {isSubmitting ? "MEMPROSES..." : "MASUK"}
          </Button>
        </form>
      </XPadding>
    </div>
  );
}
