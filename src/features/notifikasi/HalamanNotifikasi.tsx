import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";
import EmptyState from "@/shared/components/state/EmptyState";
import ErrorState from "@/shared/components/state/ErrorState";

import NotificationCard from "./components/NotificationCard";
import { useNotifikasi } from "./hooks/useNotifikasi";

// Halaman daftar notifikasi (FR-NOTIF-001). Data dari adapter mock
// `api/notifikasiApi.ts` karena backend belum tersedia (KD-07); status baca
// (DEC-12) ditandai lewat aksi "Tandai dibaca".
export default function HalamanNotifikasi() {
  const { status, items, markingId, actionError, reload, markRead } =
    useNotifikasi();

  return (
    <div className="min-h-screen bg-surface">
      <Header title="Notifikasi" />
      <XPadding>
        {status === "loading" ? (
          <p role="status" className="py-4 text-sm text-slate-500">
            Memuat notifikasi…
          </p>
        ) : null}

        {status === "error" ? (
          <ErrorState
            title="Gagal memuat notifikasi"
            description="Periksa koneksi Anda lalu coba lagi."
            action={
              <button
                type="button"
                onClick={reload}
                className="mt-2 text-sm font-medium text-brand-600 underline"
              >
                Coba lagi
              </button>
            }
          />
        ) : null}

        {status === "ready" && items.length === 0 ? (
          <EmptyState
            title="Belum ada notifikasi"
            description="Notifikasi baru akan muncul di sini."
          />
        ) : null}

        {status === "ready" && items.length > 0 ? (
          <>
            <div className="mt-4 flex flex-col gap-3">
              {items.map((item) => (
                <NotificationCard
                  key={item.id}
                  item={item}
                  marking={markingId === item.id}
                  onMarkRead={markRead}
                />
              ))}
            </div>

            {actionError ? (
              <p role="alert" className="mt-3 text-sm text-danger">
                {actionError}
              </p>
            ) : null}

            {import.meta.env.DEV ? (
              <p className="mt-6 text-center text-xs text-gray-400">
                Mode pengembangan: data notifikasi masih mock (backend belum
                tersedia).
              </p>
            ) : null}
          </>
        ) : null}
      </XPadding>
    </div>
  );
}
