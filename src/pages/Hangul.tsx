import { speak } from "../components/AudioButton";
import hangul from "../data/hangul.json";

export default function Hangul() {
  return (
    <div>
      <h1 className="mb-4 font-display text-3xl font-extrabold">Bảng chữ cái Hangul</h1>
      {hangul.map((g) => (
        <section key={g.title} className="mb-6">
          <h2 className="mb-2 font-bold text-muted">{g.title}</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {g.items.map((i) => (
              <button
                key={i.c + i.say}
                onClick={() => speak(i.say)}
                className="card cursor-pointer p-3 text-center transition duration-150 hover:bg-soft active:scale-95"
              >
                <div className="font-display text-4xl font-extrabold text-primary">{i.c}</div>
                <div>{i.say}</div>
                <div className="text-xs text-muted">{i.r}</div>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
