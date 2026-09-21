export default function ProgressBar({ value, max }: { value: number; max: number }) {
  return (
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} className="h-2.5 w-full rounded-full bg-soft">
      <div className="grow h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
    </div>
  );
}
