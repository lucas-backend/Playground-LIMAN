import type { ReactNode } from "react";

export function LoadingState({ label = "Memuat data..." }: { label?: string }) {
  return <p role="status">{label}</p>;
}

export function EmptyState({ label = "Belum ada data." }: { label?: string }) {
  return <p role="status">{label}</p>;
}

export function ForbiddenState({ label = "Anda tidak memiliki akses ke data ini." }: { label?: string }) {
  return <p role="alert">{label}</p>;
}

export function ErrorState({
  error,
  onRetry,
  label = "Data tidak dapat dimuat.",
}: {
  error: unknown;
  onRetry?: () => void;
  label?: string;
}) {
  const message = error instanceof Error ? error.message : label;
  return (
    <div role="alert">
      <p>{message}</p>
      {onRetry && <button type="button" onClick={onRetry}>Coba lagi</button>}
    </div>
  );
}

export function QueryState({
  isLoading,
  isError,
  error,
  isForbidden = false,
  isEmpty = false,
  onRetry,
  children,
}: {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isForbidden?: boolean;
  isEmpty?: boolean;
  onRetry?: () => void;
  children: ReactNode;
}) {
  if (isLoading) return <LoadingState />;
  if (isForbidden) return <ForbiddenState />;
  if (isError) return <ErrorState error={error} onRetry={onRetry} />;
  if (isEmpty) return <EmptyState />;
  return <>{children}</>;
}
