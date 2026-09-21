import type { Vocab } from "../types";
import AudioButton from "./AudioButton";

export default function FlashCard({ v, flipped, onFlip }: { v: Vocab; flipped: boolean; onFlip: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={flipped ? "Ẩn nghĩa" : "Xem nghĩa"}
      onClick={onFlip}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && (e.preventDefault(), onFlip())}
      className="card card-soft enter flex min-h-72 cursor-pointer select-none flex-col items-center justify-center gap-2 p-6 text-center transition duration-150 active:scale-[0.98]"
    >
      <div className="mb-2 flex gap-2 text-xs">
        {v.unit && <span className="rounded-full bg-soft px-2 py-0.5 text-primary">Bài {v.unit}</span>}
        <span className="rounded-full border border-border px-2 py-0.5 text-muted">{v.partOfSpeech}</span>
      </div>
      <div className="font-display text-6xl font-extrabold">{v.word}</div>
      <div className="text-muted">{v.reading}</div>
      {flipped ? (
        <div className="enter mt-3 w-full rounded-xl bg-bg p-4">
          <div className="text-2xl font-bold text-primary">{v.meaning}</div>
          <div className="mt-2">{v.example}</div>
          <div className="text-sm text-muted">{v.translation}</div>
        </div>
      ) : (
        <div className="mt-6 text-sm text-muted">Nhấn để xem nghĩa</div>
      )}
      <div className="mt-2">
        <AudioButton text={v.word} />
      </div>
    </div>
  );
}
