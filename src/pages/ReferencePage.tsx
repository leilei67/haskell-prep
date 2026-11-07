import { useState } from "react";
import { unitOfKey, units } from "../data/units";
import { Code, Rich } from "../components/Code";
import { ItemExplainer } from "../components/ItemExplainer";
import { Strength } from "../components/Strength";
import { facts, factKey, itemKey, items } from "../lib/content";
import { relativeDue } from "../lib/router";
import { strength } from "../lib/srs";
import { useAppState } from "../lib/store";

type Filter = "all" | "new" | "weak" | "due" | "mastered";

export function ReferencePage({ query }: { query?: string }) {
  const state = useAppState();
  const [q, setQ] = useState(query ?? "");
  const [filter, setFilter] = useState<Filter>("all");
  const [unit, setUnit] = useState("all");
  const [open, setOpen] = useState<string | null>(query ? itemKey(query) : null);
  const now = Date.now();

  const keep = (key: string, text: string) => {
    const mem = state.mem[key];
    if (unit !== "all" && unitOfKey.get(key)?.id !== unit) return false;
    if (q && !text.toLowerCase().includes(q.toLowerCase())) return false;
    if (filter === "new") return !mem;
    if (filter === "weak") return !!mem && strength(mem) <= 2;
    if (filter === "due") return !!mem && mem.due <= now;
    if (filter === "mastered") return strength(mem) === 5;
    return true;
  };

  const shownItems = items.filter((i) => keep(itemKey(i.id), `${i.name} ${i.sig} ${i.desc}`));
  const shownFacts = facts.filter((f) => keep(factKey(f.id), `${f.q} ${f.a}`));

  return (
    <div className="page reference">
      <h1 className="page-title">Reference</h1>
      <div className="ref-controls">
        <input className="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search names, types, descriptions" aria-label="Search" />
        <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)} aria-label="Filter by memory">
          <option value="all">Everything</option>
          <option value="new">Not learned</option>
          <option value="weak">Weak</option>
          <option value="due">Due now</option>
          <option value="mastered">Mastered</option>
        </select>
        <select value={unit} onChange={(e) => setUnit(e.target.value)} aria-label="Filter by unit">
          <option value="all">All units</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.title}
            </option>
          ))}
        </select>
      </div>
      <p className="muted">
        {shownItems.length} names, {shownFacts.length} concepts
      </p>
      <ul className="ref-list">
        {shownItems.map((i) => {
          const key = itemKey(i.id);
          const mem = state.mem[key];
          const isOpen = open === key;
          return (
            <li key={key} className={`ref-row ${isOpen ? "open" : ""}`}>
              <button type="button" className="ref-head" onClick={() => setOpen(isOpen ? null : key)} aria-expanded={isOpen}>
                <Code code={i.name} className="ref-name" />
                <Code code={i.sig} className="ref-sig" />
                <Strength mem={mem} />
              </button>
              {isOpen && (
                <div className="ref-body">
                  <ItemExplainer item={i} />
                  <p className="muted">
                    {unitOfKey.get(key)?.title}. {mem ? `Next review ${relativeDue(mem.due, now)}; right ${mem.correct}, wrong ${mem.wrong}.` : "Not learned yet."}
                  </p>
                </div>
              )}
            </li>
          );
        })}
        {shownFacts.map((f) => {
          const key = factKey(f.id);
          const isOpen = open === key;
          return (
            <li key={key} className={`ref-row ref-fact ${isOpen ? "open" : ""}`}>
              <button type="button" className="ref-head" onClick={() => setOpen(isOpen ? null : key)} aria-expanded={isOpen}>
                <span className="ref-q">
                  <Rich text={f.q} terms={false} />
                </span>
                <Strength mem={state.mem[key]} />
              </button>
              {isOpen && (
                <div className="ref-body">
                  <Rich text={f.a} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
