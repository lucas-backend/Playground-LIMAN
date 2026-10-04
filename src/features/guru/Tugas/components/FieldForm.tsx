import type { ReactNode } from "react";

// Gaya input bersama (latar biru muda seperti di desain)
export const kelasInput =
  "w-full bg-blue-50 border border-gray-300 rounded px-3 py-2 text-xs outline-none focus:border-blue-500";

export default function FieldForm({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs mb-1">{label}</label>
      {children}
    </div>
  );
}