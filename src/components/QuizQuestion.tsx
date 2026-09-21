import { useState } from "react";
import type { Question } from "../types";
import AudioButton, { speak } from "./AudioButton";

// Gọi onNext(đúng/sai) khi người học bấm "Tiếp". Cha cần đặt key theo số câu để reset state.
export default function QuizQuestion({ q, onNext }: { q: Question; onNext: (correct: boolean) => void }) {
  const [picked, setPicked] = useState<string | null>(null);

  const pick = (o: string) => {
    if (picked) return;
    setPicked(o);
    if (o === q.answer) speak(q.answer);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-xl">
        <span>{q.prompt}</span>
        {q.audio && <AudioButton text={q.audio} />}
      </div>
      <div className="grid gap-2">
        {q.options.map((o) => {
          const state = !picked ? "bg-white hover:bg-slate-100" : o === q.answer ? "bg-green-100" : o === picked ? "bg-red-100" : "bg-white";
          return (
            <button key={o} onClick={() => pick(o)} className={`rounded-xl border border-slate-300 p-3 text-left ${state}`}>
              {o}
            </button>
          );
        })}
      </div>
      {picked && (
        <button onClick={() => onNext(picked === q.answer)} className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-white">
          Tiếp →
        </button>
      )}
    </div>
  );
}
