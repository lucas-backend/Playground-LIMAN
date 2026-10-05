type Props = { aktif?: boolean; size?: number };

const Lingkaran = ({ warna, size, children }: { warna: string; size: number; children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="11" fill={warna} />
    <g stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {children}
    </g>
  </svg>
);

export function IconBenar({ aktif = false, size = 18 }: Props) {
  return (
    <Lingkaran warna={aktif ? "#2E9E3E" : "#BDBDBD"} size={size}>
      <path d="M7 12.5l3.2 3.2L17 9" />
    </Lingkaran>
  );
}

export function IconSalah({ aktif = false, size = 18 }: Props) {
  return (
    <Lingkaran warna={aktif ? "#D32F2F" : "#BDBDBD"} size={size}>
      <path d="M8 8l8 8M16 8l-8 8" />
    </Lingkaran>
  );
}