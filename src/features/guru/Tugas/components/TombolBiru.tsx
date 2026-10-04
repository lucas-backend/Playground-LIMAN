import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
  to?: string; // kalau diisi, tampil sebagai Link
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

const kelas = "inline-block bg-blue-600 text-white text-xs rounded-md px-4 py-2 disabled:opacity-50";

export default function TombolBiru({ children, to, onClick, type = "button", disabled }: Props) {
  if (to) return <Link to={to} className={kelas}>{children}</Link>;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={kelas}>
      {children}
    </button>
  );
}