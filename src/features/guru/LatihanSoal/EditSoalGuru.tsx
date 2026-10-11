import { useRef, useState, type ReactNode } from "react";
import Header from "@/shared/components/layout/Header";
import XPadding from "@/shared/components/layout/XPadding";

/* ---------- tipe ---------- */
type TipeSoal = "pg" | "pgk" | "bs" | "essay";

interface Pernyataan {
  teks: string;
  benar: boolean | null;
}

interface Soal {
  id: string;
  tipe: TipeSoal;
  teks: string;
  gambar: string | null;
  opsi: string[];
  kunci: number[]; // index opsi yang benar (pg & pgk)
  pernyataan: Pernyataan[]; // benar/salah
  kunciEssay: string;
  poin: number;
}

type JenisModal = "belum-selesai" | "konfirmasi" | null;

const TIPE: Record<TipeSoal, string> = {
  pg: "Pilihan Ganda",
  pgk: "Pg Kompleks",
  bs: "Benar/Salah",
  essay: "Essay",
};

const DAFTAR_TIPE = Object.keys(TIPE) as TipeSoal[];

const abjad = (i: number) => String.fromCharCode(65 + i);

const soalBaru = (tipe: TipeSoal = "pg"): Soal => ({
  id: crypto.randomUUID(),
  tipe,
  teks: "",
  gambar: null,
  opsi: ["", "", "", ""],
  kunci: [],
  pernyataan: [{ teks: "", benar: null }],
  kunciEssay: "",
  poin: 10,
});

/* ---------- ikon kecil ---------- */
interface IkonProps {
  className?: string;
}

const Ikon = ({ d, className = "w-4 h-4" }: IkonProps & { d: ReactNode }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);
const IkonKamera = (p: IkonProps) => (
  <Ikon {...p} d={<><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></>} />
);
const IkonEdit = (p: IkonProps) => (
  <Ikon {...p} d={<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>} />
);
const IkonHapus = (p: IkonProps) => (
  <Ikon {...p} d={<><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /></>} />
);

/* ---------- input teks + gambar ---------- */
interface AreaSoalProps {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  gambar: string | null;
  onGambar: (url: string) => void;
}

function AreaSoal({ value, onChange, placeholder, gambar, onGambar }: AreaSoalProps) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="relative border border-gray-300 rounded-lg bg-white">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full p-3 pr-10 text-sm rounded-lg resize-none outline-none"
      />
      {gambar && <img src={gambar} alt="" className="m-3 mt-0 max-h-40 rounded" />}
      <button type="button" onClick={() => ref.current?.click()}
        className="absolute top-3 right-3 text-gray-700" aria-label="Unggah gambar">
        <IkonKamera />
      </button>
      <input ref={ref} type="file" accept="image/*" hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onGambar(URL.createObjectURL(f));
        }} />
    </div>
  );
}

/* ---------- form pengisian soal ---------- */
interface FormSoalProps {
  awal: Soal;
  onSimpan: (s: Soal) => void;
  onBatal: () => void;
}

function FormSoal({ awal, onSimpan, onBatal }: FormSoalProps) {
  const [s, setS] = useState<Soal>(awal);
  const ubah = (patch: Partial<Soal>) => setS((p) => ({ ...p, ...patch }));

  const ganti = (tipe: TipeSoal) => ubah({ tipe, kunci: [] });

  const toggleKunci = (i: number) => {
    if (s.tipe === "pg") return ubah({ kunci: [i] });
    ubah({ kunci: s.kunci.includes(i) ? s.kunci.filter((x) => x !== i) : [...s.kunci, i] });
  };

  const setOpsi = (i: number, v: string) =>
    ubah({ opsi: s.opsi.map((o, x) => (x === i ? v : o)) });

  const setPern = (i: number, patch: Partial<Pernyataan>) =>
    ubah({ pernyataan: s.pernyataan.map((p, x) => (x === i ? { ...p, ...patch } : p)) });

  return (
    <div className="border border-gray-300 rounded-xl bg-white p-4 flex flex-col gap-4">
      {/* pilihan tipe */}
      <div className="flex flex-wrap gap-2">
        {DAFTAR_TIPE.map((k) => (
          <button key={k} type="button" onClick={() => ganti(k)}
            className={`px-3 py-1 text-xs rounded-full border ${
              s.tipe === k ? "bg-blue-500 text-white border-blue-600" : "border-gray-800"
            }`}>
            {TIPE[k]}
          </button>
        ))}
      </div>

      <AreaSoal value={s.teks} onChange={(teks) => ubah({ teks })}
        placeholder="Ketik/Unggah pertanyaan..."
        gambar={s.gambar} onGambar={(gambar) => ubah({ gambar })} />

      {/* pg & pg kompleks */}
      {(s.tipe === "pg" || s.tipe === "pgk") && (
        <>
          <p className="text-gray-600">Pilihan jawaban</p>
          <div className="flex flex-col gap-3">
            {s.opsi.map((o, i) => (
              <div key={i} className="flex items-center gap-3">
                <button type="button" onClick={() => toggleKunci(i)}
                  aria-pressed={s.kunci.includes(i)}
                  className={`w-9 h-9 shrink-0 rounded-full border text-sm ${
                    s.kunci.includes(i) ? "bg-green-600 text-white border-green-600" : "border-gray-400"
                  }`}>
                  {abjad(i)}
                </button>
                <input value={o} onChange={(e) => setOpsi(i, e.target.value)}
                  placeholder={`Opsi ${abjad(i)}`}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
            ))}
          </div>
          <button type="button" onClick={() => ubah({ opsi: [...s.opsi, ""] })}
            className="self-start border border-gray-300 rounded px-3 py-2 text-sm">
            + Tambah Opsi
          </button>
          <p className="text-[10px] text-green-600">
            ✓ {s.tipe === "pg"
              ? "Lingkaran/Tanda hijau yang anda pilih adalah kunci jawaban yang benar"
              : "Lingkaran/Tanda hijau yang anda pilih adalah kunci jawaban yang benar, anda bisa memilih lebih dari 1 kunci jawaban"}
          </p>
        </>
      )}

      {/* benar / salah */}
      {s.tipe === "bs" && (
        <>
          <p className="text-gray-600">Pernyataan</p>
          <div className="flex flex-col gap-3">
            {s.pernyataan.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs w-4">{i + 1}.</span>
                <input value={p.teks} onChange={(e) => setPern(i, { teks: e.target.value })}
                  placeholder="Tulis pernyataan"
                  className="flex-1 min-w-0 border border-gray-300 rounded px-3 py-2 text-sm" />
                <button type="button" onClick={() => setPern(i, { benar: true })}
                  className={`px-3 py-2 rounded text-sm border ${
                    p.benar === true ? "bg-green-600 text-white border-green-600" : "border-gray-300"
                  }`}>Benar</button>
                <button type="button" onClick={() => setPern(i, { benar: false })}
                  className={`px-3 py-2 rounded text-sm border ${
                    p.benar === false ? "bg-red-600 text-white border-red-600" : "border-gray-300"
                  }`}>Salah</button>
              </div>
            ))}
          </div>
          <button type="button"
            onClick={() => ubah({ pernyataan: [...s.pernyataan, { teks: "", benar: null }] })}
            className="self-start border border-gray-300 rounded px-3 py-2 text-sm">
            + Tambah Pernyataan
          </button>
        </>
      )}

      {/* essay */}
      {s.tipe === "essay" && (
        <>
          <p className="text-gray-600">Kunci jawaban/Pedoman penilaian</p>
          <textarea value={s.kunciEssay} onChange={(e) => ubah({ kunciEssay: e.target.value })}
            placeholder="Ketik kunci jawaban atau kriteria penilaian disini..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none" />
        </>
      )}

      {/* poin + aksi */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-500">
          Poin
          <input type="number" min={0} value={s.poin}
            onChange={(e) => ubah({ poin: Number(e.target.value) })}
            className="w-14 border border-gray-300 rounded px-2 py-2 text-center text-gray-800" />
        </label>
        <div className="ml-auto flex gap-2">
          <button type="button" onClick={onBatal}
            className="border border-gray-400 rounded px-4 py-2 text-sm">Batal</button>
          <button type="button" onClick={() => onSimpan(s)}
            className="bg-blue-500 text-white rounded px-4 py-2 text-sm">Simpan Soal</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- kartu soal tersimpan ---------- */
interface KartuSoalProps {
  soal: Soal;
  nomor: number;
  onEdit: () => void;
  onHapus: () => void;
}

function KartuSoal({ soal, nomor, onEdit, onHapus }: KartuSoalProps) {
  return (
    <div className="border border-gray-300 rounded-xl bg-white p-4 flex gap-3">
      <span className="text-sm font-medium">{nomor}.</span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="bg-orange-400 text-white text-xs px-3 py-1 rounded">{TIPE[soal.tipe]}</span>
          <span className="text-[10px] text-gray-500">{soal.poin} Poin</span>
        </div>
        <p className="text-[10px] text-gray-500 mt-2 line-clamp-1">
          {soal.teks || "Preview Soal"}
        </p>
      </div>
      <div className="flex gap-2 self-start text-gray-500">
        <button type="button" onClick={onEdit} aria-label="Edit soal"><IkonEdit /></button>
        <button type="button" onClick={onHapus} aria-label="Hapus soal" className="text-red-600"><IkonHapus /></button>
      </div>
    </div>
  );
}

/* ---------- modal ---------- */
interface ModalProps {
  children: ReactNode;
  onTutup: () => void;
}

function Modal({ children, onTutup }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onTutup}>
      <div className="w-full max-w-sm bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/* ---------- halaman ---------- */
export default function EditSoalGuru() {
  const [daftar, setDaftar] = useState<Soal[]>([]);
  const [form, setForm] = useState<Soal | null>(null); // soal yang sedang diisi/diedit
  const [modal, setModal] = useState<JenisModal>(null);

  const simpanSoal = (s: Soal) => {
    setDaftar((d) =>
      d.some((x) => x.id === s.id) ? d.map((x) => (x.id === s.id ? s : x)) : [...d, s]
    );
    setForm(null);
  };

  const klikSimpan = () => setModal(form ? "belum-selesai" : "konfirmasi");

  const kirim = () => {
    // TODO: kirim `daftar` ke API
    console.log("Simpan soal:", daftar);
    setModal(null);
  };

  return (
    <div>
      <Header title="Latihan Soal" />
      <XPadding>
        {/* Informasi Soal */}
        <div className="bg-blue-500 text-white rounded-xl p-4 my-4 text-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px]">Matematika</p>
              <h2 className="text-xl font-semibold">Latihan Soal 1</h2>
            </div>
            <button type="button" onClick={klikSimpan}
              className="bg-orange-400 text-xs px-3 py-1 rounded">Simpan</button>
          </div>
          <div className="flex justify-between mt-3 text-xs">
            <span>{daftar.length} dari 20 Soal</span>
            <span>10 Januari 2026</span>
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span>07.00-08.30 (90 menit)</span>
            <span>Lokasi: Online</span>
          </div>
        </div>

        {/* Field Pengisian Soal dinamis */}
        <div className="flex flex-col gap-3 pb-10">
          {daftar.map((s, i) =>
            form?.id === s.id ? (
              <FormSoal key={s.id} awal={form} onSimpan={simpanSoal} onBatal={() => setForm(null)} />
            ) : (
              <KartuSoal key={s.id} soal={s} nomor={i + 1}
                onEdit={() => setForm(s)}
                onHapus={() => setDaftar((d) => d.filter((x) => x.id !== s.id))} />
            )
          )}

          {form && !daftar.some((x) => x.id === form.id) && (
            <FormSoal awal={form} onSimpan={simpanSoal} onBatal={() => setForm(null)} />
          )}

          {!form && (
            <button type="button" onClick={() => setForm(soalBaru())}
              className="self-start bg-blue-500 text-white rounded-lg px-4 py-2 text-sm">
              + Tambah Soal
            </button>
          )}
        </div>
      </XPadding>

      {modal === "belum-selesai" && (
        <Modal onTutup={() => setModal(null)}>
          <div className="relative px-6 py-10 text-center text-red-600 font-medium">
            <button type="button" onClick={() => setModal(null)}
              className="absolute top-3 right-4 text-gray-700" aria-label="Tutup">✕</button>
            Anda perlu menyelesaikan membuat soal terlebih dahulu
          </div>
        </Modal>
      )}

      {modal === "konfirmasi" && (
        <Modal onTutup={() => setModal(null)}>
          <p className="px-6 py-10 text-center">Apakah anda yakin ingin menyimpan soal ini?</p>
          <div className="grid grid-cols-2 text-white">
            <button type="button" onClick={() => setModal(null)} className="bg-red-500 py-3">Batal</button>
            <button type="button" onClick={kirim} className="bg-green-600 py-3">Simpan</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
