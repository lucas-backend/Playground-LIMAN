// Sesuaikan dengan path tempat <Rekap /> di-mount, mis. "/guru/rekap"
export const REKAP_BASE = "/rekap";

export const namaKelasDariId = (id?: string) =>
  `Kelas ${(id ?? "").replace(/-/g, " ").toUpperCase()}`;
