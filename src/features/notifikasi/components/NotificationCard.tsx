import {
  formatNotificationDate,
  type NotificationTone,
  type NotifikasiItem,
} from "../model/notifikasi";

const SEGMENT_TONE_CLASS: Record<NotificationTone, string> = {
  danger: "text-red-500",
  warning: "text-orange-500",
};

interface NotificationCardProps {
  item: NotifikasiItem;
  marking: boolean;
  onMarkRead: (id: string) => void;
}

export default function NotificationCard({
  item,
  marking,
  onMarkRead,
}: NotificationCardProps) {
  return (
    <article className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      {/* Bagian Atas: Judul & Waktu */}
      <div className="mb-2 flex items-center justify-between gap-2 text-xs text-gray-400">
        <h3 className="flex items-center gap-2 font-medium text-gray-700">
          {item.isRead ? null : (
            <>
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full bg-brand-500"
              />
              <span className="sr-only">Belum dibaca</span>
            </>
          )}
          {item.title}
        </h3>
        <span className="shrink-0">
          {formatNotificationDate(item.createdAt)}
        </span>
      </div>

      {/* Bagian Isi Pesan */}
      <p className="text-xs leading-relaxed text-gray-600">
        {item.message.map((segment, index) => (
          <span
            key={index}
            className={[
              segment.strong ? "font-semibold" : "",
              segment.tone ? SEGMENT_TONE_CLASS[segment.tone] : "",
            ]
              .join(" ")
              .trim() || undefined}
          >
            {segment.text}
          </span>
        ))}
      </p>

      {item.isRead ? null : (
        <button
          type="button"
          onClick={() => onMarkRead(item.id)}
          disabled={marking}
          className="mt-2 text-xs font-medium text-brand-600 underline disabled:opacity-50"
        >
          {marking ? "Menandai…" : "Tandai dibaca"}
        </button>
      )}
    </article>
  );
}
