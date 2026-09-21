import { Link } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import vocab from "../data/vocabulary.json";
import { currentStreak, useProgress } from "../utils/progress";

export default function Home() {
  const [p] = useProgress();
  const tiles = [
    { to: "/hangul", icon: "🔤", text: "Học Hangul" },
    { to: "/flashcard", icon: "📚", text: "Flashcard từ vựng" },
    { to: "/quiz", icon: "📝", text: "Quiz 10 câu" },
    { to: "/grammar", icon: "📖", text: "Ngữ pháp" },
  ];
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Hôm nay học gì?</h1>
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-2 flex justify-between text-sm">
          <span>Đã thuộc {p.masteredWords.length}/{vocab.length} từ</span>
          <span>🔥 {currentStreak(p)} ngày</span>
        </div>
        <ProgressBar value={p.masteredWords.length} max={vocab.length} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {tiles.map((t) => (
          <Link key={t.to} to={t.to} className="rounded-xl bg-white p-6 text-center shadow-sm hover:bg-indigo-50">
            <div className="text-3xl">{t.icon}</div>
            <div className="mt-2">{t.text}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
