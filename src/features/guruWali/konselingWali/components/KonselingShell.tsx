import type { ReactNode } from "react";

import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";

interface Props {
  children: ReactNode;
  title?: string;
  footer?: ReactNode;
}

/**
 * Kerangka halaman modul Konseling Guru Wali: header, konten utama, area aksi
 * opsional di bawah, dan catatan mock saat mode pengembangan (baseline desain
 * DEC-14; dipakai bersama ketiga halaman modul ini).
 */
export default function KonselingShell({
  children,
  title = "Catatan Konseling",
  footer,
}: Props) {
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between pb-6 text-slate-800">
      <div>
        <Header title={title} />
        {children}
      </div>

      {footer}

      {import.meta.env.DEV ? (
        <XPadding>
          <p className="mt-2 text-center text-xs text-gray-400">
            Mode pengembangan: data konseling masih mock (backend belum
            tersedia).
          </p>
        </XPadding>
      ) : null}
    </div>
  );
}
