import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { useState } from "react";
import type { Question } from "../types";
import { stagger } from "../utils/motion";
import AudioButton, { speak } from "./AudioButton";

// Gọi onNext(đúng/sai) khi người học bấm "Tiếp". Cha cần đặt key theo số câu để reset state.
export default function QuizQuestion({ q, onNext }: { q: Question; onNext: (correct: boolean) => void }) {
  const [picked, setPicked] = useState<string | null>(null);

  const pick = (o: string) => {
    if (picked) return;
    setPicked(o);
    // Chỉ đọc khi là chữ Hàn có nghĩa (đáp án tiếng Việt hay phiên âm La-tinh thì bỏ qua)
    const t = q.audio ?? q.answer;
    if (o === q.answer && /[가-힣]/.test(t)) speak(t);
  };

  return (
    <div>
      <div className="enter mb-4 flex items-center gap-3 text-xl font-medium">
        <span>{q.prompt}</span>
        {q.audio && <AudioButton text={q.audio} />}
      </div>
      <div className="grid gap-2">
        {q.options.map((o, n) => {
          const right = picked && o === q.answer;
          const wrong = picked && o === picked && o !== q.answer;
          return (
            <button
              key={o}
              onClick={() => pick(o)}
              disabled={!!picked}
              style={stagger(n + 1)}
              className={`btn enter justify-between text-left disabled:cursor-default ${right ? "pop border-ok bg-ok-bg" : ""} ${wrong ? "shake border-bad bg-bad-bg" : ""}`}
            >
              <span>{o}</span>
              {right && <CheckCircle size={22} weight="fill" className="text-ok" aria-label="Đúng" />}
              {wrong && <XCircle size={22} weight="fill" className="text-bad" aria-label="Sai" />}
            </button>
          );
        })}
      </div>
      {picked && q.note && <p className="enter mt-3 rounded-xl bg-soft p-3 text-sm">{q.note}</p>}
      {picked && (
        <button onClick={() => onNext(picked === q.answer)} className="btn btn-primary mt-4">
          Tiếp
        </button>
      )}
    </div>
  );
}
