import { useCallback, useEffect, useState } from "react";

import { getNotifications, markNotificationRead } from "../api/notifikasiApi";
import type { NotifikasiItem } from "../model/notifikasi";

export type NotifikasiStatus = "loading" | "ready" | "error";

export interface NotifikasiView {
  status: NotifikasiStatus;
  items: NotifikasiItem[];
  /** Id notifikasi yang sedang ditandai dibaca (untuk state tombol). */
  markingId: string | null;
  /** Pesan error aksi "tandai dibaca". */
  actionError: string | null;
  reload: () => void;
  markRead: (id: string) => void;
}

/**
 * Orkestrasi halaman Notifikasi (FR-NOTIF-001): memuat daftar dari adapter
 * (`../api/notifikasiApi`) dan menandai notifikasi dibaca (DEC-12).
 */
export function useNotifikasi(): NotifikasiView {
  const [status, setStatus] = useState<NotifikasiStatus>("loading");
  const [items, setItems] = useState<NotifikasiItem[]>([]);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchNotifications = useCallback(() => {
    getNotifications()
      .then((result) => {
        setItems(result);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const reload = useCallback(() => {
    setStatus("loading");
    fetchNotifications();
  }, [fetchNotifications]);

  const markRead = useCallback((id: string) => {
    setMarkingId(id);
    setActionError(null);
    markNotificationRead(id)
      .then(() => {
        setItems((current) =>
          current.map((item) =>
            item.id === id ? { ...item, isRead: true } : item,
          ),
        );
      })
      .catch(() => setActionError("Gagal menandai notifikasi. Coba lagi."))
      .finally(() => setMarkingId(null));
  }, []);

  return { status, items, markingId, actionError, reload, markRead };
}
