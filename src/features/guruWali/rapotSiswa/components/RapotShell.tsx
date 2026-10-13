import type { ReactNode } from "react";

import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";

interface Props {
  children: ReactNode;
  title?: string;
}

/**
 * Kerangka halaman modul Rapot Guru Wali: header, konten utama, tombol
 * Cetak di bagian bawah, dan catatan mock saat mode pengembangan
 * (baseline desain DEC-14; dipakai bersama keempat halaman modul ini).
 */
export default function RapotShell({ children, title = "Rapot" }: Props) {
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between pb-6 text-slate-800">
      <div>
        <Header title={title} />
        {children}
      </div>

      <XPadding className="mt-6 mb-2">
        <button className="w-full bg-brand-500 text-white font-medium py-3.5 rounded-2xl shadow-md hover:bg-blue-600 transition active:scale-[0.99] text-base tracking-wide">
          Cetak
        </button>
      </XPadding>

      {import.meta.env.DEV ? (
        <XPadding>
          <p className="mt-2 text-center text-xs text-gray-400">
            Mode pengembangan: data rapot masih mock (backend belum tersedia).
          </p>
        </XPadding>
      ) : null}
    </div>
  );
}