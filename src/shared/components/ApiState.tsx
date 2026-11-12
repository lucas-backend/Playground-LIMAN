import type { ReactNode } from "react";
import { apiErrorMessage } from "./apiErrorMessage";

export function ApiErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <p>{apiErrorMessage(error)}</p>
      {onRetry && <button className="mt-2 font-semibold underline" onClick={onRetry}>Coba lagi</button>}
    </div>
  );
}

export function EmptyState({ children = "Tidak ada data." }: { children?: ReactNode }) {
  return <p className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">{children}</p>;
}
