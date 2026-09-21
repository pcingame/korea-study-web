import { Ear, Headphones, Keyboard, PencilLine, PencilSimple, SpeakerHigh, TextAa, Translate, Trophy, Waveform } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import QuizQuestion from "../components/QuizQuestion";
import TypeQuestion from "../components/TypeQuestion";
import UnitFilter from "../components/UnitFilter";
import exercises from "../data/grammar-exercises.json";
import hangul from "../data/hangul.json";
import vocab from "../data/vocabulary.json";
import type { Question, Vocab } from "../types";
import { quizResult, useProgress } from "../utils/progress";
import { stagger } from "../utils/motion";
import { shuffle } from "../utils/shuffle";
import { inUnit, useUnit, type Unit } from "../utils/unit";

const TYPES = {
  "ko-vi": "Hàn → Việt",
  "vi-ko": "Việt → Hàn",
  listen: "Nghe → chọn từ",
  fill: "Điền từ",
  vtype: "Gõ từ (Việt → Hàn)",
  ltype: "Nghe → gõ từ",
  grammar: "Điền ngữ pháp",
  glisten: "Nghe → điền ngữ pháp",
  gmean: "Nghe câu → chọn nghĩa",
  hread: "Nhìn chữ cái → chọn cách đọc",
  hlisten: "Nghe âm → chọn chữ cái",
  hpatchim: "Nghe từ → chọn âm cuối (patchim)",
  hword: "Nghe âm → chọn từ",
} as const;
type Type = keyof typeof TYPES;
type GrammarType = "grammar" | "glisten" | "gmean";
const GROUPS: [string, Type[], string][] = [
  ["Từ vựng", ["ko-vi", "vi-ko", "listen", "fill", "vtype", "ltype"], "tone-indigo"],
  ["Ngữ pháp", ["grammar", "glisten", "gmean"], "tone-rose"],
  ["Hangul và phát âm", ["hlisten", "hread", "hpatchim", "hword"], "tone-green"],
];
// biểu tượng và mô tả ngắn cho từng dạng bài ở menu
const INFO: Record<Type, [Icon, string]> = {
  "ko-vi": [Translate, "Thấy từ Hàn, chọn nghĩa"],
  "vi-ko": [Translate, "Thấy nghĩa, chọn từ Hàn"],
  listen: [Headphones, "Nghe, chọn từ đúng"],
  fill: [PencilSimple, "Điền từ vào câu ví dụ"],
  vtype: [Keyboard, "Đọc nghĩa, tự gõ chữ Hàn"],
  ltype: [Keyboard, "Nghe, gõ lại từ"],
  grammar: [PencilLine, "Chọn trợ từ hoặc đuôi câu"],
  glisten: [Headphones, "Nghe câu, chọn phần còn thiếu"],
  gmean: [SpeakerHigh, "Nghe câu, chọn nghĩa"],
  hread: [TextAa, "Thấy chữ cái, chọn cách đọc"],
  hlisten: [Ear, "Nghe âm, chọn chữ cái"],
  hpatchim: [Waveform, "Nghe từ, chọn âm cuối"],
  hword: [Headphones, "Phân biệt các từ có âm gần nhau"],
};
type LetterType = "hread" | "hlisten" | "hpatchim";
type HangulType = LetterType | "hword";
type VocabType = Exclude<Type, GrammarType | HangulType>;
const isGrammar = (t: Type): t is GrammarType => t === "grammar" || t === "glisten" || t === "gmean";
const N = 10;

// Chỉ điền từ khi từ xuất hiện nguyên dạng trong câu ví dụ; từ 1 âm tiết dễ trùng nghĩa khác (이, 일…) nên bỏ
const fillable = (v: Vocab) => v.word.length > 1 && v.example.includes(v.word);

// Đáp án nhiễu lấy cùng bài đang lọc cho sát chủ đề; bài quá ít từ thì lấy từ toàn bộ
const distractorPool = (unit: Unit) => {
  const p = vocab.filter((v) => inUnit(v, unit));
  return p.length >= 8 ? p : vocab;
};

function make(type: VocabType, v: Vocab, pool: Vocab[]): Question {
  const others = shuffle(pool.filter((x) => x.id !== v.id)).slice(0, 3);
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
    case "vtype":
      return {
        prompt: `Gõ từ tiếng Hàn có nghĩa “${v.meaning}” (${v.word.replace(/\s/g, "").length} âm tiết)`,
        options: [],
        answer: v.word,
        note: `${v.word} (${v.reading})`,
        typed: true,
      };
    case "ltype":
      return { prompt: "Nghe và gõ lại từ bạn nghe được", audio: v.word, options: [], answer: v.word, note: `${v.word} (${v.reading}) = ${v.meaning}`, typed: true };
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

const isHangul = (t: Type): t is HangulType => t === "hread" || t === "hlisten" || t === "hpatchim" || t === "hword";

type HItem = (typeof hangul)[number]["items"][number];
const patchim = hangul.find((g) => g.title.startsWith("Patchim"))!.items;
const letters = hangul.filter((g) => !g.title.startsWith("Patchim"));
const sound = (x: HItem) => x.r.split(" · ")[0]; // patchim: "k · 책 sách" → "k"

// Nguyên âm ghép (ㅐ/ㅔ, ㅙ/ㅚ/ㅞ…) nghe giống nhau nên không đưa vào bài nghe
const listenable = letters.filter((g) => g.title !== "Nguyên âm ghép");

// items = nhóm chứa chữ đó, dùng để lấy đáp án nhiễu cùng loại
function makeHangul(type: LetterType, it: HItem, items: HItem[]): Question {
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

// Bài "nghe âm → chọn từ": đáp án nhiễu là các từ có nét chữ (jamo) gần giống nhất, để luyện phân biệt âm
const jamo = (w: string) => [...w.normalize("NFD")];
function distance(a: string[], b: string[]) {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}
const singleWords = vocab.filter((v) => !v.word.includes(" "));

function makeWord(v: Vocab, pool: Vocab[]): Question {
  const a = jamo(v.word);
  const near = shuffle(pool.filter((x) => !x.word.includes(" ") && x.id !== v.id))
    .map((x) => ({ word: x.word, d: distance(a, jamo(x.word)) }))
    .sort((p, q) => p.d - q.d)
    .slice(0, 3)
    .map((x) => x.word);
  return {
    prompt: "Nghe và chọn từ đúng (các đáp án có âm gần giống nhau)",
    audio: v.word,
    options: shuffle([v.word, ...near]),
    answer: v.word,
    note: `${v.word} (${v.reading}) = ${v.meaning}`,
  };
}

const build = (type: Type, unit: Unit): Question[] => {
  const pool = distractorPool(unit);
  return type === "hword"
    ? shuffle(singleWords.filter((v) => inUnit(v, unit)))
        .slice(0, N)
        .map((v) => makeWord(v, pool))
    : isHangul(type)
    ? shuffle(
        type === "hpatchim"
          ? patchim.map((it) => ({ it, items: patchim }))
          : (type === "hlisten" ? listenable : letters).flatMap((g) => g.items.map((it) => ({ it, items: g.items }))),
      )
        .slice(0, N)
        .map((e) => makeHangul(type, e.it, e.items))
    : isGrammar(type)
    ? shuffle(exercises.filter((e) => inUnit(e, unit)))
        .slice(0, N)
        .map((e) => makeGrammar(type, e))
    : shuffle((type === "fill" ? vocab.filter(fillable) : vocab).filter((v) => inUnit(v, unit)))
        .slice(0, N)
        .map((v) => make(type, v, pool));
};

export default function Quiz() {
  const [unit, setUnit] = useUnit();
  const [params] = useSearchParams(); // /quiz?type=glisten mở thẳng một dạng bài
  const [qs, setQs] = useState<Question[] | null>(() => {
    const t = params.get("type");
    return t && t in TYPES ? build(t as Type, unit) : null;
  });
  const [n, setN] = useState(0);
  const [score, setScore] = useState(0);
  const [, update] = useProgress();

  const start = (type: Type) => {
    setQs(build(type, unit));
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
        <UnitFilter value={unit} onChange={setUnit} />
        <p className="-mt-2 mb-4 text-xs text-muted">Bộ lọc bài áp dụng cho bài tập từ vựng và ngữ pháp. Bài tập Hangul dùng chung toàn bộ.</p>
        {GROUPS.map(([title, types, tone]) => (
          <section key={title} className="mb-6">
            <h2 className="mb-2 font-bold text-muted">{title}</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {types.map((t, n) => {
                const [Icon, desc] = INFO[t];
                return (
                  <button
                    key={t}
                    onClick={() => start(t)}
                    style={stagger(n)}
                    className="card enter flex cursor-pointer items-center gap-3 p-3 text-left transition duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                  >
                    <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                      <Icon size={24} weight="duotone" />
                    </span>
                    <span>
                      <span className="block font-bold">{TYPES[t]}</span>
                      <span className="text-sm text-muted">{desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    );

  if (n >= qs.length)
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <Trophy size={64} weight="duotone" className="pop text-primary" />
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
      <div className="mb-4">
        <ProgressBar value={n} max={qs.length} />
      </div>
      {qs[n].typed ? <TypeQuestion key={n} q={qs[n]} onNext={next} /> : <QuizQuestion key={n} q={qs[n]} onNext={next} />}
    </div>
  );
}
