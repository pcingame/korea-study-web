import { BookOpenText, Books, Cards, Exam, Flame, Microphone, TextAa } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import vocab from "../data/vocabulary.json";
import { currentStreak, useProgress } from "../utils/progress";

const TILES = [
  { to: "/hangul", Icon: TextAa, text: "Học Hangul" },
  { to: "/flashcard", Icon: Cards, text: "Flashcard từ vựng" },
  { to: "/quiz", Icon: Exam, text: "Quiz 10 câu" },
  { to: "/grammar", Icon: BookOpenText, text: "Ngữ pháp" },
  { to: "/vocabulary", Icon: Books, text: "Từ vựng" },
  { to: "/pronunciation", Icon: Microphone, text: "Luyện phát âm" },
];

export default function Home() {
  const [p] = useProgress();
  return (
    <div>
      <h1 className="mb-4 font-display text-3xl font-extrabold">Hôm nay học gì?</h1>
      <Link to="/progress" className="card mb-4 block p-4 transition duration-150 hover:bg-soft">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-medium">
            Đã thuộc {p.masteredWords.length}/{vocab.length} từ
          </span>
          <span className="inline-flex items-center gap-1 font-bold text-primary">
            <Flame size={22} weight="fill" />
            {currentStreak(p)} ngày
          </span>
        </div>
        <ProgressBar value={p.masteredWords.length} max={vocab.length} />
      </Link>
      <div className="grid grid-cols-2 gap-3">
        {TILES.map(({ to, Icon, text }) => (
          <Link key={to} to={to} className="card flex flex-col items-center gap-3 p-6 text-center font-medium transition duration-150 hover:bg-soft active:scale-95">
            <span className="flex size-14 items-center justify-center rounded-full bg-soft text-primary">
              <Icon size={30} weight="duotone" />
            </span>
            {text}
          </Link>
        ))}
      </div>
    </div>
  );
}
