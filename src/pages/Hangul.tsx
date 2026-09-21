import { speak } from "../components/AudioButton";
import hangul from "../data/hangul.json";

export default function Hangul() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Bảng chữ cái Hangul</h1>
      {hangul.map((g) => (
        <section key={g.title} className="mb-6">
          <h2 className="mb-2 font-semibold text-slate-600">{g.title}</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {g.items.map((i) => (
              <button
                key={i.c + i.say}
                onClick={() => speak(i.say)}
                className="rounded-xl bg-white p-3 text-center shadow-sm hover:bg-indigo-50"
              >
                <div className="text-3xl">{i.c}</div>
                <div className="text-sm">{i.say}</div>
                <div className="text-xs text-slate-500">{i.r}</div>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
