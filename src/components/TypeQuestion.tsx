import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { type FormEvent, useState } from "react";
import type { Question } from "../types";
import AudioButton, { speak } from "./AudioButton";

// Bỏ dấu cách và chuẩn hóa Unicode để so sánh chữ Hàn gõ từ bàn phím
const norm = (s: string) => s.normalize("NFC").replace(/\s/g, "");

// Câu hỏi tự gõ đáp án. Cha đặt key theo số câu để reset state.
export default function TypeQuestion({ q, onNext }: { q: Question; onNext: (correct: boolean) => void }) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<boolean | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (result !== null || !value.trim()) return;
    const ok = norm(value) === norm(q.answer);
    setResult(ok);
    if (ok) speak(q.answer);
  };

  return (
    <form onSubmit={submit}>
      <div className="enter mb-4 flex items-center gap-3 text-xl font-medium">
        <span>{q.prompt}</span>
        {q.audio && <AudioButton text={q.audio} />}
      </div>
      <label htmlFor="typed" className="sr-only">
        Câu trả lời tiếng Hàn
      </label>
      <input
        id="typed"
        autoFocus
        lang="ko"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={result !== null}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder="한국어로 쓰세요"
        className="min-h-12 w-full rounded-xl border border-border bg-surface px-3 text-xl placeholder:text-base placeholder:text-muted"
      />
      {result === null ? (
        <div className="mt-3 flex gap-2">
          <button type="submit" className="btn btn-primary">
            Kiểm tra
          </button>
          <button type="button" className="btn" onClick={() => setResult(false)}>
            Không biết
          </button>
        </div>
      ) : (
        <div className="enter mt-3">
          {result ? (
            <div className="pop inline-flex items-center gap-1 font-bold text-ok">
              <CheckCircle size={22} weight="fill" /> Chính xác!
            </div>
          ) : (
            <div className="shake inline-flex items-center gap-1 font-bold text-bad">
              <XCircle size={22} weight="fill" /> Đáp án: {q.answer}
            </div>
          )}
          {q.note && <p className="mt-2 rounded-xl bg-soft p-3 text-sm">{q.note}</p>}
          <button type="button" onClick={() => onNext(result)} className="btn btn-primary mt-3">
            Tiếp
          </button>
        </div>
      )}
    </form>
  );
}
