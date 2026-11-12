import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Header from "../../components/Header";
import XPadding from "../../components/XPadding";
import { listNotifications, markNotificationRead } from "./api/notificationsApi";
import { queryKeys } from "../../shared/server-state/queryKeys";
import { ApiErrorState, EmptyState } from "../../shared/components/ApiState";
import { Pagination } from "../../shared/server-state/Pagination";

const PAGE_SIZE = 20;

function notificationMessage(type: string, payload: Record<string, unknown> | null) {
  const message = payload?.message;
  return typeof message === "string" ? message : type;
}

export default function HalamanNotifikasi() {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const notifications = useQuery({
    queryKey: queryKeys.notification.list({ unreadOnly, page, pageSize: PAGE_SIZE }),
    queryFn: () => listNotifications({ unreadOnly, page, pageSize: PAGE_SIZE }),
  });
  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.notification.all });
    },
  });

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      <Header title="Notifikasi" />
      <XPadding>
        <div className="mt-4 mb-4 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={unreadOnly} onChange={(event) => { setUnreadOnly(event.target.checked); setPage(1); }} />
            Belum dibaca
          </label>
          {notifications.data && <span className="text-xs text-gray-500">{notifications.data.total} notifikasi</span>}
        </div>
        {notifications.isLoading && <p>Memuat notifikasi...</p>}
        {notifications.isError && <ApiErrorState error={notifications.error} onRetry={() => void notifications.refetch()} />}
        {notifications.data?.items.length === 0 && <EmptyState>Tidak ada notifikasi.</EmptyState>}
        <div className="flex flex-col gap-3">
          {notifications.data?.items.map((item) => (
            <article key={item.id} className={`rounded-lg border border-gray-100 bg-white p-4 shadow-sm ${item.readAt ? "" : "border-l-4 border-l-blue-500"}`}>
              <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
                <h3 className="font-medium text-gray-700">{item.type}</h3>
                <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time>
              </div>
              <p className="text-xs leading-relaxed text-gray-600">{notificationMessage(item.type, item.payload)}</p>
              {!item.readAt && (
                <button type="button" disabled={markRead.isPending} onClick={() => markRead.mutate(item.id)} className="mt-3 text-xs font-semibold text-blue-600">
                  Tandai sudah dibaca
                </button>
              )}
            </article>
          ))}
        </div>
        {notifications.data && notifications.data.total > 0 && <Pagination meta={notifications.data} onPageChange={setPage} />}
        {markRead.isError && <ApiErrorState error={markRead.error} />}
      </XPadding>
    </div>
  );
}
