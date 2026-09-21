import vocab from "../data/vocabulary.json";
import { useProgress } from "../utils/progress";
import { UNITS, UNIT_TITLES } from "../utils/unit";
import ProgressBar from "./ProgressBar";

export default function UnitProgress() {
  const [p] = useProgress();
  return (
    <section className="card p-4">
      <h2 className="mb-3 font-bold">Tiến độ theo bài</h2>
      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {UNITS.map((u) => {
          const words = vocab.filter((v) => v.unit === u);
          const done = words.filter((v) => p.masteredWords.includes(v.id)).length;
          return (
            <div key={u}>
              <div className="mb-1 flex justify-between gap-2 text-sm">
                <span className="truncate">
                  Bài {u} · {UNIT_TITLES[u]}
                </span>
                <span className="shrink-0 text-muted">
                  {done}/{words.length}
                </span>
              </div>
              <ProgressBar value={done} max={words.length} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
