import { ArrowLeft, ArrowRight, CheckCircle, Microphone, XCircle } from "@phosphor-icons/react";
import { useState } from "react";
import AudioButton from "../components/AudioButton";
import hangul from "../data/hangul.json";
import vocab from "../data/vocabulary.json";

// Web Speech API (nhận dạng): Chrome, Edge, Safari. Firefox chưa hỗ trợ.
type Rec = {
  lang: string;
  maxAlternatives: number;
  onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
  onerror: (e: { error: string }) => void;
  onend: () => void;
  start: () => void;
};
const w = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;

const SETS = {
  hangul: {
    label: "Hangul",
    items: hangul.flatMap((g) => g.items.map((i) => ({ text: i.say, hint: `${i.c} · ${i.r}` }))),
  },
  vocab: { label: "Từ vựng", items: vocab.map((v) => ({ text: v.word, hint: `${v.reading} · ${v.meaning}` })) },
};
type SetKey = keyof typeof SETS;

const norm = (s: string) => s.replace(/[\s.,!?]/g, "");
const ERRORS: Record<string, string> = {
  "not-allowed": "Hãy cho phép dùng micro trong trình duyệt rồi thử lại.",
  "no-speech": "Không nghe thấy giọng nói, thử lại nhé.",
};

export default function Pronunciation() {
  const [set, setSet] = useState<SetKey>("hangul");
  const [i, setI] = useState(0);
  const [status, setStatus] = useState<"idle" | "listening" | "ok" | "bad" | "error">("idle");
  const [heard, setHeard] = useState<string[]>([]);
  const [msg, setMsg] = useState("");
  const [correct, setCorrect] = useState(0);

  if (!SR)
    return (
      <div>
        <h1 className="mb-4 font-display text-3xl font-extrabold">Luyện phát âm</h1>
        <p className="card p-4">Trình duyệt này chưa hỗ trợ nhận dạng giọng nói. Hãy dùng Chrome, Edge hoặc Safari.</p>
      </div>
    );

  const items = SETS[set].items;
  const target = items[i];

  const go = (d: number) => {
    setI((i + d + items.length) % items.length);
    setStatus("idle");
  };
  const choose = (k: SetKey) => {
    setSet(k);
    setI(0);
    setStatus("idle");
  };

  const listen = () => {
    const r = new SR();
    r.lang = "ko-KR";
    r.maxAlternatives = 5;
    r.onresult = (e) => {
      const alts = Array.from(e.results[0], (a) => a.transcript);
      const ok = alts.some((a) => norm(a) === norm(target.text));
      setHeard(alts);
      setStatus(ok ? "ok" : "bad");
      if (ok) setCorrect((n) => n + 1);
    };
    r.onerror = (e) => {
      setMsg(ERRORS[e.error] ?? `Lỗi nhận dạng: ${e.error}`);
      setStatus("error");
    };
    r.onend = () => setStatus((s) => (s === "listening" ? "idle" : s));
    setStatus("listening");
    r.start();
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 font-display text-3xl font-extrabold">Luyện phát âm</h1>
      <div className="mb-4 flex gap-2">
        {(Object.keys(SETS) as SetKey[]).map((k) => (
          <button key={k} onClick={() => choose(k)} className={`btn ${set === k ? "btn-primary" : ""}`}>
            {SETS[k].label}
          </button>
        ))}
      </div>
      <div className="mb-2 flex justify-between text-sm text-muted">
        <span>
          {i + 1}/{items.length}
        </span>
        <span>Đọc đúng: {correct}</span>
      </div>
      <div className="card flex flex-col items-center gap-3 p-6 text-center">
        <div className="font-display text-5xl font-extrabold">{target.text}</div>
        <div className="text-muted">{target.hint}</div>
        <AudioButton text={target.text} />
        <button onClick={listen} disabled={status === "listening"} className={`btn btn-primary mt-2 min-h-14 px-6 text-lg disabled:opacity-60 ${status === "listening" ? "animate-pulse" : ""}`}>
          <Microphone size={26} weight="fill" />
          {status === "listening" ? "Đang nghe…" : "Bấm rồi đọc"}
        </button>
        <div aria-live="polite" className="min-h-12">
          {status === "ok" && (
            <div className="pop inline-flex items-center gap-1 font-bold text-ok">
              <CheckCircle size={22} weight="fill" /> Chính xác!
            </div>
          )}
          {status === "bad" && (
            <div>
              <div className="shake inline-flex items-center gap-1 font-bold text-bad">
                <XCircle size={22} weight="fill" /> Chưa khớp
              </div>
              <div className="text-sm text-muted">Máy nghe được: {heard[0] || "—"}</div>
            </div>
          )}
          {status === "error" && <div className="text-sm text-bad">{msg}</div>}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="btn" onClick={() => go(-1)}>
          <ArrowLeft size={20} /> Trước
        </button>
        <button className="btn" onClick={() => go(1)}>
          Sau <ArrowRight size={20} />
        </button>
      </div>
      <p className="mt-4 text-xs text-muted">
        Kết quả chỉ cho biết máy có hiểu bạn đọc đúng từ này không, không chấm điểm từng âm. Âm thanh có thể được gửi tới dịch vụ nhận dạng của trình duyệt.
      </p>
    </div>
  );
}
