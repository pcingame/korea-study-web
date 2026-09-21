export default function ProgressBar({ value, max, light = false }: { value: number; max: number; light?: boolean }) {
  return (
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} className={`h-2.5 w-full rounded-full ${light ? "bg-white/25" : "bg-soft"}`}>
      <div className={`grow h-full rounded-full transition-[width] duration-300 ${light ? "bg-white" : "bg-primary"}`} style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
    </div>
  );
}
