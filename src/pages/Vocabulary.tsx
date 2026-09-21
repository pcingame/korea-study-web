import { useState } from "react";
import VocabularyCard from "../components/VocabularyCard";
import vocab from "../data/vocabulary.json";

export default function Vocabulary() {
  const [q, setQ] = useState("");
  const s = q.trim().toLowerCase();
  const list = vocab.filter((v) => !s || [v.word, v.reading, v.meaning].some((x) => x.toLowerCase().includes(s)));
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Từ vựng ({vocab.length})</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tìm từ, phiên âm hoặc nghĩa…"
        className="mb-4 w-full rounded-xl border border-slate-300 bg-white p-3"
      />
      <div className="grid gap-3 md:grid-cols-2">
        {list.map((v) => (
          <VocabularyCard key={v.id} v={v} />
        ))}
      </div>
      {!list.length && <p className="text-slate-500">Không tìm thấy từ nào.</p>}
    </div>
  );
}
