import { useState } from "react";
import FlashCard from "../components/FlashCard";
import ProgressBar from "../components/ProgressBar";
import vocab from "../data/vocabulary.json";
import { master, useProgress } from "../utils/progress";

export default function Flashcard() {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [p, update] = useProgress();
  const v = vocab[i];

  const go = (d: number) => {
    setI((i + d + vocab.length) % vocab.length);
    setFlipped(false);
  };
  const mark = (yes: boolean) => {
    update((x) => master(x, v.id, yes));
    go(1);
  };
  const btn = "rounded-xl border border-slate-300 bg-white px-4 py-2 hover:bg-slate-100";

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-2 flex justify-between text-sm text-slate-500">
        <span>{i + 1}/{vocab.length}</span>
        <span>{p.masteredWords.includes(v.id) ? "✅ đã nhớ" : ""}</span>
      </div>
      <ProgressBar value={i + 1} max={vocab.length} />
      <div className="mt-4">
        <FlashCard v={v} flipped={flipped} onFlip={() => setFlipped(!flipped)} />
      </div>
      <div className="mt-4 flex justify-between">
        <button className={btn} onClick={() => go(-1)}>← Trước</button>
        <button className={btn} onClick={() => go(1)}>Sau →</button>
      </div>
      <div className="mt-3 flex justify-between">
        <button className={btn} onClick={() => mark(false)}>❌ Chưa nhớ</button>
        <button className={btn} onClick={() => mark(true)}>✅ Đã nhớ</button>
      </div>
    </div>
  );
}
