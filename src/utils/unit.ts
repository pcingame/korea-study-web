import { useState } from "react";
import grammar from "../data/grammar.json";
import vocab from "../data/vocabulary.json";
import { load, save } from "./storage";

// unit: null = tất cả, 0 = chưa gắn bài, n = Bài n của giáo trình
export type Unit = number | null;

export const UNITS = [...new Set([...vocab, ...grammar].map((x) => x.unit).filter((u): u is number => !!u))].sort((a, b) => a - b);

export const inUnit = (x: { unit?: number }, unit: Unit) => unit === null || (unit === 0 ? x.unit === undefined : x.unit === unit);

// Tên bài theo mục lục giáo trình Seoul 1A
export const UNIT_TITLES: Record<number, string> = {
  1: "안녕하세요?",
  2: "이거는 뭐예요?",
  3: "한국어를 공부해요",
  4: "어디에 있어요?",
  5: "주말에 친구를 만났어요",
  6: "얼마예요?",
  7: "날씨가 어떻습니까?",
  8: "영화 볼까요?",
};

const KEY = "korean-unit";

// Bài đang học được nhớ lại, dùng chung cho Từ vựng, Flashcard, Ngữ pháp, Quiz
export function useUnit() {
  const [unit, setUnit] = useState<Unit>(() => load<{ unit: Unit }>(KEY, { unit: null }).unit);
  const set = (u: Unit) => {
    setUnit(u);
    save(KEY, { unit: u });
  };
  return [unit, set] as const;
}
