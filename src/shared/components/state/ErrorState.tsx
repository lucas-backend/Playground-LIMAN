import type { ReactNode } from "react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export default function ErrorState({
  title = "Terjadi kesalahan",
  description = "Silakan coba lagi.",
  action,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-2 py-10 text-center"
    >
      <p className="font-semibold text-danger">{title}</p>
      {description ? <p className="text-sm text-slate-600">{description}</p> : null}
      {action}
    </div>
  );
}
