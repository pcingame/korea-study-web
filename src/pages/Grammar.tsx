import AudioButton from "../components/AudioButton";
import grammar from "../data/grammar.json";

export default function Grammar() {
  return (
    <div>
      <h1 className="mb-4 font-display text-3xl font-extrabold">Ngữ pháp</h1>
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
