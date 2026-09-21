export default function ProgressBar({ value, max }: { value: number; max: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-slate-200">
      <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
    </div>
  );
}
