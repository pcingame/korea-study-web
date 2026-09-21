import type { Vocab } from "../types";
import AudioButton from "./AudioButton";

export default function FlashCard({ v, flipped, onFlip }: { v: Vocab; flipped: boolean; onFlip: () => void }) {
  return (
    <div
      onClick={onFlip}
      className="flex min-h-64 cursor-pointer select-none flex-col items-center justify-center gap-2 rounded-2xl bg-white p-6 text-center shadow"
    >
      <div className="text-5xl font-semibold">{v.word}</div>
      <div className="text-slate-500">{v.reading}</div>
      {flipped ? (
        <>
          <div className="mt-3 text-2xl">{v.meaning}</div>
          <div className="mt-2">{v.example}</div>
          <div className="text-sm text-slate-500">{v.translation}</div>
        </>
      ) : (
        <div className="mt-6 text-sm text-slate-400">Nhấn để xem nghĩa</div>
      )}
      <div className="mt-2">
        <AudioButton text={v.word} />
      </div>
    </div>
  );
}
