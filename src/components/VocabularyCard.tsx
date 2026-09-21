import type { Vocab } from "../types";
import AudioButton from "./AudioButton";

export default function VocabularyCard({ v }: { v: Vocab }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-2xl font-semibold">{v.word}</span>
          <span className="ml-2 text-slate-500">{v.reading}</span>
        </div>
        <AudioButton text={v.word} />
      </div>
      <div className="mt-1">
        {v.meaning} <span className="text-xs text-slate-400">({v.partOfSpeech})</span>
      </div>
      <div className="mt-2 text-sm">
        <div>{v.example}</div>
        <div className="text-slate-500">{v.translation}</div>
      </div>
    </div>
  );
}
