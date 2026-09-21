import AudioButton from "../components/AudioButton";
import grammar from "../data/grammar.json";

export default function Grammar() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Ngữ pháp</h1>
      <div className="grid gap-3">
        {grammar.map((g) => (
          <div key={g.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="text-xl font-semibold">{g.title}</div>
            <div className="mb-2 text-slate-600">{g.explanation}</div>
            {g.examples.map((e) => (
              <div key={e.korean} className="mt-1 flex items-center gap-2">
                <AudioButton text={e.korean} />
                <div>
                  <div>{e.korean}</div>
                  <div className="text-sm text-slate-500">{e.vietnamese}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
