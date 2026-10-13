import XPadding from "@/shared/components/layout/XPadding";

/**
 * Tombol cetak halaman absensi wali. Aksi cetak/ekspor belum ditentukan
 * (tidak ada requirement) sehingga perilaku lama (`window.print`) dipertahankan.
 */
export default function CetakButton() {
  return (
    <XPadding className="mt-6 mb-2">
      <button
        type="button"
        onClick={() => window.print()}
        className="w-full bg-brand-500 text-white font-medium py-3.5 rounded-2xl shadow-md hover:bg-blue-600 transition active:scale-[0.99] text-base tracking-wide"
      >
        Cetak
      </button>
    </XPadding>
  );
}
