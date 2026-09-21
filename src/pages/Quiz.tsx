import { Trophy } from "@phosphor-icons/react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import QuizQuestion from "../components/QuizQuestion";
import exercises from "../data/grammar-exercises.json";
import hangul from "../data/hangul.json";
import vocab from "../data/vocabulary.json";
import type { Question, Vocab } from "../types";
import { quizResult, useProgress } from "../utils/progress";
import { shuffle } from "../utils/shuffle";

const TYPES = {
  "ko-vi": "Hàn → Việt",
  "vi-ko": "Việt → Hàn",
  listen: "Nghe → chọn từ",
  fill: "Điền từ",
  grammar: "Điền ngữ pháp",
  glisten: "Nghe → điền ngữ pháp",
  gmean: "Nghe câu → chọn nghĩa",
  hread: "Hangul: chữ → cách đọc",
  hlisten: "Hangul: nghe → chọn chữ",
  hpatchim: "Patchim: nghe → âm cuối",
} as const;
type Type = keyof typeof TYPES;
type GrammarType = "grammar" | "glisten" | "gmean";
type HangulType = "hread" | "hlisten" | "hpatchim";
type VocabType = Exclude<Type, GrammarType | HangulType>;
const isGrammar = (t: Type): t is GrammarType => t === "grammar" || t === "glisten" || t === "gmean";
const N = 10;

// Chỉ điền từ khi từ xuất hiện nguyên dạng trong câu ví dụ; từ 1 âm tiết dễ trùng nghĩa khác (이, 일…) nên bỏ
const fillable = (v: Vocab) => v.word.length > 1 && v.example.includes(v.word);

function make(type: VocabType, v: Vocab): Question {
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

type Ex = (typeof exercises)[number];
const full = (e: Ex) => e.sentence.replace(/_+/, e.answer); // câu hoàn chỉnh để đọc

function makeGrammar(type: GrammarType, e: Ex): Question {
  const note = type === "grammar" ? e.note : `${full(e)} — ${e.note}`;
  if (type === "gmean") {
    const others = [...new Set(exercises.map((x) => x.vi).filter((v) => v !== e.vi))];
    return { prompt: "Nghe câu và chọn nghĩa đúng", audio: full(e), options: shuffle([e.vi, ...shuffle(others).slice(0, 3)]), answer: e.vi, note };
  }
  return {
    prompt: type === "grammar" ? `${e.sentence}  (${e.vi})` : `Nghe và chọn phần còn thiếu: ${e.sentence}`,
    audio: type === "glisten" ? full(e) : undefined,
    options: shuffle(e.options),
    answer: e.answer,
    note,
  };
}

const isHangul = (t: Type): t is HangulType => t === "hread" || t === "hlisten" || t === "hpatchim";

type HItem = (typeof hangul)[number]["items"][number];
const patchim = hangul.find((g) => g.title.startsWith("Patchim"))!.items;
const letters = hangul.filter((g) => !g.title.startsWith("Patchim"));
const sound = (x: HItem) => x.r.split(" · ")[0]; // patchim: "k · 책 sách" → "k"

// Nguyên âm ghép (ㅐ/ㅔ, ㅙ/ㅚ/ㅞ…) nghe giống nhau nên không đưa vào bài nghe
const listenable = letters.filter((g) => g.title !== "Nguyên âm ghép");

// items = nhóm chứa chữ đó, dùng để lấy đáp án nhiễu cùng loại
function makeHangul(type: HangulType, it: HItem, items: HItem[]): Question {
  const opts = shuffle([it, ...shuffle(items.filter((x) => x !== it)).slice(0, 3)]);
  if (type === "hpatchim")
    return {
      prompt: `Từ "${it.say}": âm cuối (patchim) đọc là gì?`,
      audio: it.say,
      options: opts.map(sound),
      answer: sound(it),
      note: `${it.say}: patchim ${it.c} đọc là "${sound(it)}".`,
    };
  if (type === "hlisten")
    return { prompt: "Nghe và chọn chữ đúng", audio: it.say, options: opts.map((x) => x.c), answer: it.c, note: `${it.c} đọc là ${it.r} (${it.say}).` };
  return { prompt: `Chữ "${it.c}" đọc là gì?`, options: opts.map((x) => x.r), answer: it.r, note: `${it.c} = ${it.say} (${it.r}).` };
}

const build = (type: Type): Question[] =>
  isHangul(type)
    ? shuffle(
        type === "hpatchim"
          ? patchim.map((it) => ({ it, items: patchim }))
          : (type === "hlisten" ? listenable : letters).flatMap((g) => g.items.map((it) => ({ it, items: g.items }))),
      )
        .slice(0, N)
        .map((e) => makeHangul(type, e.it, e.items))
    : isGrammar(type)
    ? shuffle(exercises).slice(0, N).map((e) => makeGrammar(type, e))
    : shuffle(type === "fill" ? vocab.filter(fillable) : vocab).slice(0, N).map((v) => make(type, v));

export default function Quiz() {
  const [params] = useSearchParams(); // /quiz?type=glisten mở thẳng một dạng bài
  const [qs, setQs] = useState<Question[] | null>(() => {
    const t = params.get("type");
    return t && t in TYPES ? build(t as Type) : null;
  });
  const [n, setN] = useState(0);
  const [score, setScore] = useState(0);
  const [, update] = useProgress();

  const start = (type: Type) => {
    setQs(build(type));
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
        <h1 className="mb-4 font-display text-3xl font-extrabold">Quiz</h1>
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(TYPES) as Type[]).map((t) => (
            <button key={t} onClick={() => start(t)} className="card cursor-pointer p-4 text-left font-medium transition duration-150 hover:bg-soft active:scale-95">
              {TYPES[t]}
            </button>
          ))}
        </div>
      </div>
    );

  if (n >= qs.length)
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <Trophy size={64} weight="duotone" className="text-primary" />
        <div className="font-display text-3xl font-extrabold">
          Kết quả: {score}/{qs.length}
        </div>
        <button onClick={() => setQs(null)} className="btn btn-primary mt-4">
          Làm lại
        </button>
      </div>
    );

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-2 text-sm text-muted">
        Câu {n + 1}/{qs.length}
      </div>
      <QuizQuestion key={n} q={qs[n]} onNext={next} />
    </div>
  );
}
