import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import FlashCard from "../components/FlashCard";
import UnitFilter from "../components/UnitFilter";
import ProgressBar from "../components/ProgressBar";
import vocab from "../data/vocabulary.json";
import { master, useProgress } from "../utils/progress";
import { inUnit, useUnit } from "../utils/unit";

export default function Flashcard() {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [p, update] = useProgress();
  const [unit, setUnit] = useUnit();
  const deck = vocab.filter((x) => inUnit(x, unit));
  const v = deck[i];

  const go = (d: number) => {
    setI((i + d + deck.length) % deck.length);
    setFlipped(false);
  };
  const mark = (yes: boolean) => {
    update((x) => master(x, v.id, yes));
    go(1);
  };

  // Phím tắt: ←/→ chuyển thẻ, Space lật thẻ (bỏ qua khi đang focus vào nút để không lật hai lần)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === " " && !(e.target as HTMLElement).closest("button,[role=button],input,a")) {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="mx-auto max-w-md">
      <UnitFilter
        value={unit}
        onChange={(u) => {
          setUnit(u);
          setI(0);
          setFlipped(false);
        }}
      />
      <div className="mb-2 flex min-h-6 justify-between text-sm text-muted">
        <span>
          {i + 1}/{deck.length}
        </span>
        {p.masteredWords.includes(v.id) && (
          <span className="inline-flex items-center gap-1 text-ok">
            <CheckCircle size={18} weight="fill" /> đã nhớ
          </span>
        )}
      </div>
      <ProgressBar value={i + 1} max={deck.length} />
      <div className="mt-4">
        <FlashCard key={v.id} v={v} flipped={flipped} onFlip={() => setFlipped(!flipped)} />
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
      <p className="mt-4 hidden text-center text-xs text-muted md:block">Phím ← → để chuyển thẻ, Space để lật thẻ</p>
    </div>
  );
}
