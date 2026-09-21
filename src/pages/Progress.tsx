import ProgressBar from "../components/ProgressBar";
import vocab from "../data/vocabulary.json";
import { currentStreak, useProgress } from "../utils/progress";

export default function Progress() {
  const [p] = useProgress();
  const mastered = p.masteredWords.length;
  const learning = p.learnedWords.length - mastered;
  const avg = p.quizTotal ? Math.round((p.quizCorrect / p.quizTotal) * 100) : 0;
  const rows = [
    ["Đã học", `${p.learnedWords.length} từ`],
    ["Đã thuộc", `${mastered} từ`],
    ["Đang học", `${learning} từ`],
    ["Quiz trung bình", p.quizTotal ? `${avg}%` : "—"],
    ["Streak", `🔥 ${currentStreak(p)} ngày`],
  ];
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-2xl font-bold">Tiến độ học</h1>
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <ProgressBar value={mastered} max={vocab.length} />
        <div className="mb-4 mt-1 text-sm text-slate-500">
          {mastered}/{vocab.length} từ đã thuộc
        </div>
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between border-t border-slate-100 py-2">
            <span>{k}</span>
            <b>{v}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
