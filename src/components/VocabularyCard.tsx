import type { Vocab } from "../types";
import { stagger } from "../utils/motion";
import AudioButton from "./AudioButton";

export default function VocabularyCard({ v, index = 0 }: { v: Vocab; index?: number }) {
  return (
    <div className="card enter p-4" style={stagger(index)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-display text-3xl font-extrabold">{v.word}</div>
          <div className="text-muted">{v.reading}</div>
        </div>
        <AudioButton text={v.word} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="font-medium">{v.meaning}</span>
        <span className="rounded-full bg-soft px-2 py-0.5 text-xs text-primary">{v.partOfSpeech}</span>
      </div>
      <div className="mt-3 rounded-xl bg-bg p-3 text-sm">
        <div>{v.example}</div>
        <div className="text-muted">{v.translation}</div>
      </div>
    </div>
  );
}
