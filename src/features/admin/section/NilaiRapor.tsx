import { EmptyState } from "../../../shared/components/ApiState";

export default function NilaiRapor() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold">Nilai Rapor</h1>
      <p className="mt-1 text-sm text-gray-600">Route nilai rapor admin belum termasuk endpoint backend aktif.</p>
      <div className="mt-6"><EmptyState>Data nilai rapor belum tersedia melalui API.</EmptyState></div>
    </div>
  );
}
