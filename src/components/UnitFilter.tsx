import { UNITS, type Unit } from "../utils/unit";

const OPTIONS: [Unit, string][] = [[null, "Tất cả"], ...UNITS.map((u): [Unit, string] => [u, `Bài ${u}`]), [0, "Khác"]];

export default function UnitFilter({ value, onChange }: { value: Unit; onChange: (u: Unit) => void }) {
  return (
    <div className="mb-4">
      <div className="mb-1 text-sm text-muted">Lọc theo bài (giáo trình Seoul 1A)</div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0" role="group" aria-label="Lọc theo bài">
        {OPTIONS.map(([u, label]) => (
          <button key={label} onClick={() => onChange(u)} aria-pressed={value === u} className={`btn min-h-11 shrink-0 text-sm md:min-h-9 ${value === u ? "btn-primary" : ""}`}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
