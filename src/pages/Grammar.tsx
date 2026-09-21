import { Link } from "react-router-dom";
import AudioButton from "../components/AudioButton";
import UnitFilter from "../components/UnitFilter";
import grammar from "../data/grammar.json";
import { stagger } from "../utils/motion";
import { inUnit, useUnit } from "../utils/unit";

export default function Grammar() {
  const [unit, setUnit] = useUnit();
  const list = grammar.filter((g) => inUnit(g, unit));
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-extrabold">Ngữ pháp</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/quiz?type=grammar" className="btn btn-primary">
            Bài tập điền chỗ trống
          </Link>
          <Link to="/quiz?type=glisten" className="btn">
            Bài tập nghe
          </Link>
        </div>
      </div>
      <UnitFilter value={unit} onChange={setUnit} />
      <div className="grid gap-3 md:grid-cols-2">
        {list.map((g, n) => (
          <div key={g.id} className="card enter p-4" style={stagger(n)}>
            <div className="flex items-start justify-between gap-2">
              <div className="font-display text-xl font-extrabold text-primary">{g.title}</div>
              {g.unit && <span className="shrink-0 rounded-full bg-soft px-2 py-0.5 text-xs text-primary">Bài {g.unit}</span>}
            </div>
            <div className="mb-3 text-muted">{g.explanation}</div>
            {g.examples.map((e) => (
              <div key={e.korean} className="mt-2 flex items-center gap-3 rounded-xl bg-bg p-2">
                <AudioButton text={e.korean} />
                <div>
                  <div>{e.korean}</div>
                  <div className="text-sm text-muted">{e.vietnamese}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
