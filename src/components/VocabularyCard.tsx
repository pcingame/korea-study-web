import type { Vocab } from "../types";
import AudioButton from "./AudioButton";

export default function VocabularyCard({ v }: { v: Vocab }) {
  return (
    <div className="card p-4">
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
