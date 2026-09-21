import { MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import UnitFilter from "../components/UnitFilter";
import VocabularyCard from "../components/VocabularyCard";
import vocab from "../data/vocabulary.json";
import { inUnit, useUnit } from "../utils/unit";

const POS = [...new Set(vocab.map((v) => v.partOfSpeech))];

export default function Vocabulary() {
  const [q, setQ] = useState("");
  const [pos, setPos] = useState("");
  const [unit, setUnit] = useUnit();
  const s = q.trim().toLowerCase();
  const list = vocab.filter((v) => inUnit(v, unit) && (!pos || v.partOfSpeech === pos) && (!s || [v.word, v.reading, v.meaning].some((x) => x.toLowerCase().includes(s))));
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-extrabold">Từ vựng ({list.length})</h1>
        <Link to="/quiz" className="btn btn-primary">
          Làm bài tập từ vựng
        </Link>
      </div>
      <UnitFilter value={unit} onChange={setUnit} />
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
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Lọc theo từ loại">
        {["", ...POS].map((p) => (
          <button key={p} onClick={() => setPos(p)} aria-pressed={pos === p} className={`btn min-h-11 text-sm ${pos === p ? "btn-primary" : ""}`}>
            {p || "Tất cả"}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {list.map((v, n) => (
          <VocabularyCard key={v.id} v={v} index={n} />
        ))}
      </div>
      {!list.length && <p className="text-muted">Không tìm thấy từ nào.</p>}
    </div>
  );
}
