import { request } from "../../../shared/api/client";

export interface Notification {
  id: string;
  type: string;
  payload: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationListResponse {
  items: Notification[];
  page: number;
  pageSize: number;
  total: number;
}

export interface NotificationFilters {
  unreadOnly?: boolean;
  page?: number;
  pageSize?: number;
}

function query(filters: NotificationFilters): string {
  const search = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) search.set(key, String(value));
  });
  const result = search.toString();
  return result ? `?${result}` : "";
}

export function listNotifications(
  filters: NotificationFilters = {},
): Promise<NotificationListResponse> {
  return request<NotificationListResponse>(`/notifications${query(filters)}`);
}

export function markNotificationRead(id: string): Promise<Notification> {
  return request<Notification>(
    `/notifications/${encodeURIComponent(id)}/read`,
    { method: "POST" },
  );
}
