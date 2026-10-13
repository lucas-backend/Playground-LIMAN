import {
  KETERANGAN_LABELS,
  type KeteranganAbsensi,
} from "../model/absensiWali";

/** Badge keterangan absensi per pertemuan (Hadir hijau, lainnya cokelat). */
export default function StatusBadge({
  keterangan,
}: {
  keterangan: KeteranganAbsensi;
}) {
  const hadir = keterangan === "hadir";
  return (
    <span
      className={`inline-block w-full max-w-[75px] py-1 text-xs font-semibold rounded-full border text-center ${
        hadir
          ? "bg-success-soft border-[#a5d6a7] text-success"
          : "bg-[#f5e4d7] border-[#e6ccb8] text-[#8d6e63]"
      }`}
    >
      {KETERANGAN_LABELS[keterangan]}
    </span>
  );
}
