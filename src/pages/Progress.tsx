import { Flame } from "@phosphor-icons/react";
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
  ];
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 font-display text-3xl font-extrabold">Tiến độ học</h1>
      <div className="card p-4">
        <ProgressBar value={mastered} max={vocab.length} />
        <div className="mb-4 mt-2 text-sm text-muted">
          {mastered}/{vocab.length} từ đã thuộc
        </div>
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between border-t border-border py-3">
            <span>{k}</span>
            <b>{v}</b>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-border py-3">
          <span>Streak</span>
          <b className="inline-flex items-center gap-1 text-primary">
            <Flame size={22} weight="fill" /> {currentStreak(p)} ngày
          </b>
        </div>
      </div>
    </div>
  );
}
