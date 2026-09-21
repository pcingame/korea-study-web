import { Link } from "react-router-dom";
import AudioButton from "../components/AudioButton";
import grammar from "../data/grammar.json";

export default function Grammar() {
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
      <div className="grid gap-3 md:grid-cols-2">
        {grammar.map((g) => (
          <div key={g.id} className="card p-4">
            <div className="font-display text-xl font-extrabold text-primary">{g.title}</div>
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
