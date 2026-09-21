import { Microphone } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { speak } from "../components/AudioButton";
import hangul from "../data/hangul.json";
import { stagger } from "../utils/motion";

export default function Hangul() {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-extrabold">Bảng chữ cái Hangul</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/quiz?type=hread" className="btn btn-primary">
            Bài tập chọn đáp án
          </Link>
          <Link to="/pronunciation" className="btn">
            <Microphone size={20} weight="fill" /> Luyện phát âm
          </Link>
        </div>
      </div>
      {hangul.map((g) => (
        <section key={g.title} className="mb-6">
          <h2 className="mb-2 font-bold text-muted">{g.title}</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {g.items.map((i, n) => (
              <button
                key={i.c + i.say}
                onClick={() => speak(i.say)}
                style={stagger(n)}
                className="card enter cursor-pointer p-3 text-center transition duration-150 hover:bg-soft active:scale-95"
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
