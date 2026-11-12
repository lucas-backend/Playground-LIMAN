import { EmptyState } from "../../../shared/components/ApiState";

export default function Presensi() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold">Presensi</h1>
      <p className="mt-1 text-sm text-gray-600">Route presensi admin belum termasuk endpoint backend aktif.</p>
      <div className="mt-6"><EmptyState>Data presensi belum tersedia melalui API.</EmptyState></div>
    </div>
  );
}
