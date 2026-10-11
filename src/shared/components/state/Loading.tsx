interface LoadingProps {
  label?: string;
}

export default function Loading({ label = "Memuat..." }: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-dvh w-full items-center justify-center bg-surface"
    >
      <div className="flex flex-col items-center gap-3 text-slate-600">
        <span
          aria-hidden="true"
          className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"
        />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}
