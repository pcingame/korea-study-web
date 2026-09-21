import { Microphone } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { speak } from "../components/AudioButton";
import hangul from "../data/hangul.json";
import { stagger } from "../utils/motion";

const EXERCISES = [
  { type: "hlisten", title: "Nghe âm → chọn chữ", desc: "Nghe một âm, chọn đúng chữ cái" },
  { type: "hread", title: "Nhìn chữ → chọn cách đọc", desc: "Thấy chữ cái, chọn cách đọc" },
  { type: "hpatchim", title: "Nghe từ → chọn âm cuối", desc: "Nhận biết patchim (phụ âm cuối)" },
  { type: "hword", title: "Nghe âm → chọn từ", desc: "Phân biệt các từ có âm gần giống" },
];

export default function Hangul() {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-extrabold">Bảng chữ cái Hangul</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/pronunciation" className="btn">
            <Microphone size={20} weight="fill" /> Luyện phát âm
          </Link>
        </div>
      </div>
      <section className="mb-8">
        <h2 className="mb-2 font-bold text-muted">Bài tập chọn đáp án</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {EXERCISES.map((e, n) => (
            <Link key={e.type} to={`/quiz?type=${e.type}`} style={stagger(n)} className="card enter block p-4 transition duration-150 hover:bg-soft active:scale-95">
              <div className="font-bold text-primary">{e.title}</div>
              <div className="text-sm text-muted">{e.desc}</div>
            </Link>
          ))}
        </div>
      </section>
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
