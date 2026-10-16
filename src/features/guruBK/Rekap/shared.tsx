import type { ReactNode } from "react";
import XPadding from "../../../components/XPadding";

function Badge({
  children,
  tone = "green",
  className = "",
}: {
  children: ReactNode;
  tone?: "green" | "orange";
  className?: string;
}) {
  const color = tone === "green" ? "bg-green-200" : "bg-orange-200";
  return (
    <span
      className={`inline-block min-w-[44px] rounded-full px-2 py-0.5 text-center text-[10px] font-medium ${color} ${className}`}
    >
      {children}
    </span>
  );
}

function CetakButton() {
  return (
    <XPadding className="mt-auto py-4">
      <button
        onClick={() => window.print()} // TODO: ganti dengan logika cetak/export
        className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Cetak
      </button>
    </XPadding>
  );
}

function SiswaInfo({
  nama,
  kelas,
  extra,
}: {
  nama: string;
  kelas?: string;
  extra?: string;
}) {
  return (
    <div>
      <h3 className="text-base font-semibold">{nama}</h3>
      {kelas && <p className="text-xs text-gray-500">{kelas}</p>}
      {extra && <p className="text-xs text-gray-500">{extra}</p>}
    </div>
  );
}

export { Badge, CetakButton, SiswaInfo };