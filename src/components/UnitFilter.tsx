import { UNITS, type Unit } from "../utils/unit";

const OPTIONS: [Unit, string][] = [[null, "Tất cả"], ...UNITS.map((u): [Unit, string] => [u, `Bài ${u}`]), [0, "Chưa gắn bài"]];

export default function UnitFilter({ value, onChange }: { value: Unit; onChange: (u: Unit) => void }) {
  return (
    <div className="mb-4">
      <div className="mb-1 text-sm text-muted">Lọc theo bài (giáo trình Seoul 1A)</div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc theo bài">
        {OPTIONS.map(([u, label]) => (
          <button key={label} onClick={() => onChange(u)} aria-pressed={value === u} className={`btn min-h-11 text-sm ${value === u ? "btn-primary" : ""}`}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
