type Props = {
  children: React.ReactNode;
  lulus?: boolean;
  className?: string;
};

export default function NilaiBadge({ children, lulus = true, className = "" }: Props) {
  return (
    <span
      className={`inline-block min-w-[44px] rounded-full px-3 py-0.5 text-center text-xs ${
        lulus ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"
      } ${className}`}
    >
      {children}
    </span>
  );
}