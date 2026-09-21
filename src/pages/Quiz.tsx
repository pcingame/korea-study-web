import { useState } from "react";
import QuizQuestion from "../components/QuizQuestion";
import vocab from "../data/vocabulary.json";
import type { Question, Vocab } from "../types";
import { quizResult, useProgress } from "../utils/progress";
import { shuffle } from "../utils/shuffle";

const TYPES = {
  "ko-vi": "Hàn → Việt",
  "vi-ko": "Việt → Hàn",
  listen: "Nghe → chọn từ",
  fill: "Điền từ",
} as const;
type Type = keyof typeof TYPES;
const N = 10;

// Chỉ điền từ khi từ xuất hiện nguyên dạng trong câu ví dụ; từ 1 âm tiết dễ trùng nghĩa khác (이, 일…) nên bỏ
const fillable = (v: Vocab) => v.word.length > 1 && v.example.includes(v.word);

function make(type: Type, v: Vocab): Question {
  const others = shuffle(vocab.filter((x) => x.id !== v.id)).slice(0, 3);
  const pick = (f: (x: Vocab) => string) => shuffle([v, ...others].map(f));
  switch (type) {
    case "ko-vi":
      return { prompt: `"${v.word}" nghĩa là gì?`, options: pick((x) => x.meaning), answer: v.meaning };
    case "vi-ko":
      return { prompt: `"${v.meaning}" trong tiếng Hàn là?`, options: pick((x) => x.word), answer: v.word };
    case "listen":
      return { prompt: "Nghe và chọn từ đúng", audio: v.word, options: pick((x) => x.word), answer: v.word };
    case "fill":
      return {
        prompt: `${v.example.replace(v.word, "______")}  (${v.translation})`,
        options: pick((x) => x.word),
        answer: v.word,
      };
  }
}

export default function Quiz() {
  const [qs, setQs] = useState<Question[] | null>(null);
  const [n, setN] = useState(0);
  const [score, setScore] = useState(0);
  const [, update] = useProgress();

  const start = (type: Type) => {
    const pool = type === "fill" ? vocab.filter(fillable) : vocab;
    setQs(shuffle(pool).slice(0, N).map((v) => make(type, v)));
    setN(0);
    setScore(0);
  };

  const next = (correct: boolean) => {
    const s = score + (correct ? 1 : 0);
    setScore(s);
    if (n + 1 === qs!.length) update((p) => quizResult(p, s, qs!.length));
    setN(n + 1);
  };

  if (!qs)
    return (
      <div>
        <h1 className="mb-4 text-2xl font-bold">Quiz</h1>
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(TYPES) as Type[]).map((t) => (
            <button key={t} onClick={() => start(t)} className="rounded-xl bg-white p-4 text-left shadow-sm hover:bg-indigo-50">
              {TYPES[t]}
            </button>
          ))}
        </div>
      </div>
    );

  if (n >= qs.length)
    return (
      <div className="text-center">
        <div className="text-2xl font-bold">
          Kết quả: {score}/{qs.length}
        </div>
        <button onClick={() => setQs(null)} className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-white">
          Làm lại
        </button>
      </div>
    );

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-2 text-sm text-slate-500">
        Câu {n + 1}/{qs.length}
      </div>
      <QuizQuestion key={n} q={qs[n]} onNext={next} />
    </div>
  );
}
