import { ArrowRight, BookOpenText, Books, Cards, Exam, Flame, Microphone, TextAa } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import AudioButton from "../components/AudioButton";
import ProgressBar from "../components/ProgressBar";
import UnitProgress from "../components/UnitProgress";
import grammar from "../data/grammar.json";
import vocab from "../data/vocabulary.json";
import { stagger } from "../utils/motion";
import { currentStreak, useProgress } from "../utils/progress";

const TILES = [
  { to: "/hangul", Icon: TextAa, tone: "tone-indigo", text: "Học Hangul", desc: "Bảng chữ cái, patchim" },
  { to: "/flashcard", Icon: Cards, tone: "tone-green", text: "Flashcard", desc: `${vocab.length} từ theo bài` },
  { to: "/quiz", Icon: Exam, tone: "tone-amber", text: "Quiz", desc: "Từ vựng, ngữ pháp, Hangul" },
  { to: "/grammar", Icon: BookOpenText, tone: "tone-rose", text: "Ngữ pháp", desc: `${grammar.length} điểm ngữ pháp` },
  { to: "/vocabulary", Icon: Books, tone: "tone-indigo", text: "Từ vựng", desc: "Tra cứu, lọc theo bài" },
  { to: "/pronunciation", Icon: Microphone, tone: "tone-green", text: "Luyện phát âm", desc: "Đọc vào micro để kiểm tra" },
];

// Từ của hôm nay: đổi theo ngày, giữ nguyên trong cùng một ngày
const wordOfDay = () => vocab[Math.floor(Date.now() / 864e5) % vocab.length];

export default function Home() {
  const [p] = useProgress();
  const w = wordOfDay();
  const mastered = p.masteredWords.length;
  return (
    <div>
      <section className="hero enter mb-4 p-5 md:p-7">
        <p className="text-sm font-medium opacity-90">Xin chào, cùng học tiếng Hàn nào</p>
        <h1 className="font-display text-3xl font-extrabold md:text-4xl">Hôm nay học gì?</h1>
        <div className="mt-4 flex flex-wrap gap-2 text-sm font-medium">
          <span className="chip-hero">
            <Flame size={18} weight="fill" /> {currentStreak(p)} ngày liên tiếp
          </span>
          <span className="chip-hero">
            {mastered}/{vocab.length} từ đã thuộc
          </span>
        </div>
        <div className="mt-3">
          <ProgressBar light value={mastered} max={vocab.length} />
        </div>
        <Link to="/flashcard" className="btn btn-light mt-5">
          Học tiếp với Flashcard <ArrowRight size={18} weight="bold" />
        </Link>
      </section>

      <div className="card enter mb-4 flex items-center gap-4 p-4" style={stagger(1)}>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium uppercase tracking-wide text-muted">Từ hôm nay</div>
          <div className="font-display text-3xl font-extrabold">{w.word}</div>
          <div className="text-muted">
            {w.reading} · {w.meaning}
          </div>
        </div>
        <AudioButton text={w.word} />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        {TILES.map(({ to, Icon, tone, text, desc }, n) => (
          <Link
            key={to}
            to={to}
            style={stagger(n + 2)}
            className="card enter flex flex-col items-start gap-3 p-4 transition duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-95 sm:flex-row sm:items-center sm:gap-4"
          >
            <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${tone}`}>
              <Icon size={28} weight="duotone" />
            </span>
            <span>
              <span className="block font-bold">{text}</span>
              <span className="text-sm text-muted">{desc}</span>
            </span>
          </Link>
        ))}
      </div>

      <UnitProgress />
    </div>
  );
}
