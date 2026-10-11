import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <p className="font-semibold text-slate-800">{title}</p>
      {description ? <p className="text-sm text-slate-600">{description}</p> : null}
      {action}
    </div>
  );
}
