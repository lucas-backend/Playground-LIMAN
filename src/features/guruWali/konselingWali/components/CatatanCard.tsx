import type { ReactNode } from "react";

interface Props {
  catatanTitle: string;
  catatanIsi: string;
  followupTitle: string;
  followupIsi: string | null;
  emptyFollowupLabel: string;
  action?: ReactNode;
}

/**
 * Kartu catatan konseling: blok catatan (latar biru) di atas dan blok tindak
 * lanjut (putih) di bawah, dengan aksi opsional pada blok tindak lanjut.
 * Visualnya dipertahankan dari baseline desain (DEC-14).
 */
export default function CatatanCard({
  catatanTitle,
  catatanIsi,
  followupTitle,
  followupIsi,
  emptyFollowupLabel,
  action,
}: Props) {
  return (
    <div className="flex flex-col">
      <div className="bg-blue-50 p-4 border-b border-slate-200 min-h-[110px]">
        <h4 className="text-sm font-bold text-slate-900">{catatanTitle}</h4>
        <p className="text-xs text-slate-500 mt-1 italic">{catatanIsi}</p>
      </div>
      <div className="p-4 bg-white min-h-[110px] flex flex-col justify-between items-center">
        <div className="w-full text-left">
          <h4 className="text-sm font-bold text-slate-900">{followupTitle}</h4>
          {followupIsi ? (
            <p className="text-xs text-slate-500 mt-1 italic">{followupIsi}</p>
          ) : (
            <p className="text-xs text-slate-400 mt-1 italic">
              {emptyFollowupLabel}
            </p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}
