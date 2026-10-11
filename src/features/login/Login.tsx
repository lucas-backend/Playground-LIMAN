import type { FormEvent } from "react";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import { useLocation, useNavigate } from "react-router-dom";

import XPadding from "@/shared/components/layout/XPadding";

import LoginForm from "./components/LoginForm";
import { useLogin } from "./hooks/useLogin";

const APP_NAME = "LIMAN";

interface LoginRedirectState {
  from?: { pathname?: string };
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    credentials,
    fieldErrors,
    formError,
    submitting,
    changeField,
    submit,
  } = useLogin();

  const redirectTo =
    (location.state as LoginRedirectState | null)?.from?.pathname ??
    "/dashboard";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const user = await submit();
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }

  return (
    <div className="bg-brand-500 h-dvh text-white flex items-center pb-32">
      <XPadding>
        <div className="text-center">
          <MenuBookRoundedIcon className="h-16! w-16!" />
          <h1 className="text-6xl font-bold">{APP_NAME}</h1>
        </div>

        <LoginForm
          credentials={credentials}
          fieldErrors={fieldErrors}
          formError={formError}
          submitting={submitting}
          onChange={changeField}
          onSubmit={handleSubmit}
        />

        {import.meta.env.DEV ? (
          <p className="mt-8 text-center text-xs text-white/70">
            Mode pengembangan (mock): demo@example.test / demo
          </p>
        ) : null}
      </XPadding>
    </div>
  );
}
