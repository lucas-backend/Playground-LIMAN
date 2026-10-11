import type { ChangeEvent, FormEvent } from "react";

import Button from "@/shared/components/ui/Button";

import type {
  LoginCredentials,
  LoginField,
  LoginFieldErrors,
} from "../model/auth";

interface LoginFormProps {
  credentials: LoginCredentials;
  fieldErrors: LoginFieldErrors;
  formError: string | null;
  submitting: boolean;
  onChange: (field: LoginField, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function LoginForm({
  credentials,
  fieldErrors,
  formError,
  submitting,
  onChange,
  onSubmit,
}: LoginFormProps) {
  const handleChange =
    (field: LoginField) => (event: ChangeEvent<HTMLInputElement>) =>
      onChange(field, event.target.value);

  return (
    <form
      className="flex flex-col items-center gap-4 mt-12"
      onSubmit={onSubmit}
      noValidate
    >
      <span className="font-semibold text-2xl">Masuk</span>

      <div className="w-full">
        <label htmlFor="login-email" className="sr-only">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange("email")}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
          className="text-black bg-white w-full px-4 py-2 focus:outline-none rounded-lg"
        />
        {fieldErrors.email ? (
          <p id="login-email-error" className="mt-1 text-sm text-danger-soft">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="w-full">
        <label htmlFor="login-password" className="sr-only">
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange("password")}
          aria-invalid={fieldErrors.password ? true : undefined}
          aria-describedby={
            fieldErrors.password ? "login-password-error" : undefined
          }
          className="text-black bg-white w-full px-4 py-2 focus:outline-none rounded-lg"
        />
        {fieldErrors.password ? (
          <p
            id="login-password-error"
            className="mt-1 text-sm text-danger-soft"
          >
            {fieldErrors.password}
          </p>
        ) : null}
      </div>

      {formError ? (
        <p
          role="alert"
          className="w-full rounded-lg bg-danger-soft px-4 py-2 text-sm font-medium text-danger"
        >
          {formError}
        </p>
      ) : null}

      <Button type="submit" className="bg-orange-400" disabled={submitting}>
        {submitting ? "MEMPROSES..." : "MASUK"}
      </Button>
    </form>
  );
}
