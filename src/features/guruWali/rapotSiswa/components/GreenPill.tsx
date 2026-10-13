import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

/**
 * Pil hijau (nilai/tuntas/hadir) khas tampilan Rapot Guru Wali.
 * Ukuran teks/padding diatur pemakai via `className` agar sesuai konteks.
 */
export default function GreenPill({ children, className = "" }: Props) {
  return (
    <span
      className={`inline-block bg-success-soft text-success rounded-full border border-[#a5d6a7] ${className}`}
    >
      {children}
    </span>
  );
}