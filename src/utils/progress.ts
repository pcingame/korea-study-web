import { useState } from "react";
import type { Progress } from "../types";
import { load, save } from "./storage";

const KEY = "korean-progress";
const empty: Progress = { learnedWords: [], masteredWords: [], quizCorrect: 0, quizTotal: 0, streak: 0, lastStudyDate: "" };

const day = (d = new Date()) => d.toLocaleDateString("sv"); // YYYY-MM-DD theo giờ máy

// Cập nhật streak: học liên tiếp thì +1, bỏ 1 ngày thì về 1
function touch(p: Progress): Progress {
  const today = day();
  if (p.lastStudyDate === today) return p;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return { ...p, streak: p.lastStudyDate === day(y) ? p.streak + 1 : 1, lastStudyDate: today };
}

// Streak hiển thị: đã quá 1 ngày chưa học thì coi như 0
export function currentStreak(p: Progress) {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return [day(), day(y)].includes(p.lastStudyDate) ? p.streak : 0;
}

export const learn = (p: Progress, id: number): Progress =>
  p.learnedWords.includes(id) ? p : { ...p, learnedWords: [...p.learnedWords, id] };

export function master(p: Progress, id: number, yes: boolean): Progress {
  const rest = learn(p, id).masteredWords.filter((x) => x !== id);
  return { ...learn(p, id), masteredWords: yes ? [...rest, id] : rest };
}

export const quizResult = (p: Progress, correct: number, total: number): Progress => ({
  ...p,
  quizCorrect: p.quizCorrect + correct,
  quizTotal: p.quizTotal + total,
});

export function useProgress() {
  const [p, setP] = useState(() => load(KEY, empty));
  const update = (fn: (p: Progress) => Progress) =>
    setP((prev) => {
      const next = touch(fn(prev));
      save(KEY, next);
      return next;
    });
  return [p, update] as const;
}
