import { MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";
import VocabularyCard from "../components/VocabularyCard";
import vocab from "../data/vocabulary.json";

export default function Vocabulary() {
  const [q, setQ] = useState("");
  const s = q.trim().toLowerCase();
  const list = vocab.filter((v) => !s || [v.word, v.reading, v.meaning].some((x) => x.toLowerCase().includes(s)));
  return (
    <div>
      <h1 className="mb-4 font-display text-3xl font-extrabold">Từ vựng ({vocab.length})</h1>
      <label className="relative mb-4 block">
        <span className="sr-only">Tìm từ vựng</span>
        <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm từ, phiên âm hoặc nghĩa…"
          className="min-h-11 w-full rounded-xl border border-border bg-surface py-2 pl-10 pr-3 text-base placeholder:text-muted"
        />
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        {list.map((v) => (
          <VocabularyCard key={v.id} v={v} />
        ))}
      </div>
      {!list.length && <p className="text-muted">Không tìm thấy từ nào.</p>}
    </div>
  );
}
