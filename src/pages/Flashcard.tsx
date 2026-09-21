import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from "@phosphor-icons/react";
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

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-2 flex min-h-6 justify-between text-sm text-muted">
        <span>
          {i + 1}/{vocab.length}
        </span>
        {p.masteredWords.includes(v.id) && (
          <span className="inline-flex items-center gap-1 text-ok">
            <CheckCircle size={18} weight="fill" /> đã nhớ
          </span>
        )}
      </div>
      <ProgressBar value={i + 1} max={vocab.length} />
      <div className="mt-4">
        <FlashCard v={v} flipped={flipped} onFlip={() => setFlipped(!flipped)} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="btn" onClick={() => go(-1)}>
          <ArrowLeft size={20} /> Trước
        </button>
        <button className="btn" onClick={() => go(1)}>
          Sau <ArrowRight size={20} />
        </button>
        <button className="btn" onClick={() => mark(false)}>
          <XCircle size={20} className="text-bad" /> Chưa nhớ
        </button>
        <button className="btn btn-primary" onClick={() => mark(true)}>
          <CheckCircle size={20} /> Đã nhớ
        </button>
      </div>
    </div>
  );
}
