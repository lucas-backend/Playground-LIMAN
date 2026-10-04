import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function IkonKotak({ ikon, warna }: { ikon: string; warna: string }) {
  return (
    <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-lg font-semibold ${warna}`}>
      {ikon}
    </div>
  );
}

export function Judul({ mapel, sub }: { mapel: string; sub: string }) {
  return (
    <div className="mt-6 mb-4">
      <h1 className="text-2xl font-semibold">{mapel}</h1>
      <p className="text-sm font-medium">{sub}</p>
    </div>
  );
}

export function KartuLink({ to, children, className = "" }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to}
      className={`block w-full bg-white border border-gray-300 rounded-xl shadow-sm
        active:bg-blue-500 active:text-white transition-colors ${className}`}>
      {children}
    </Link>
  );
}

export function TidakDitemukan({ pesan }: { pesan: string }) {
  return <p className="mt-10 text-center text-sm text-gray-500">{pesan}</p>;
}