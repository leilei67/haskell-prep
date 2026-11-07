import itemsJson from "../data/items.json";
import factsJson from "../data/facts.json";
import classesJson from "../data/classes.json";
import { plain } from "../data/plain";
import { findName } from "./haskell";

export type Prio = "core" | "useful" | "rare";

export interface Item {
  id: string;
  name: string;
  sig: string;
  desc: string;
  ex: string;
  prio: Prio;
  kind: "method" | "function";
  explain: string;
}

export interface Fact {
  id: string;
  q: string;
  a: string;
  group: string;
  topic: string;
  prio: Prio;
}

export interface ClassInfo {
  name: string;
  prio: Prio;
  purpose: string;
  kind: string;
  sup: string;
  methods: string;
  minimal: string;
}

const capitalise = (s: string) => (/^[a-z]/.test(s) ? s[0].toUpperCase() + s.slice(1) : s);

export const items = (itemsJson as Item[]).map((i) => ({ ...i, explain: capitalise(i.explain) }));
export const facts = factsJson as Fact[];
export const classes = classesJson as ClassInfo[];

export const itemById = new Map(items.map((i) => [i.id, i]));
export const factById = new Map(facts.map((f) => [f.id, f]));

export const itemKey = (id: string) => `i:${id}`;
export const factKey = (id: string) => `f:${id}`;

export type Target = { t: "item"; item: Item } | { t: "fact"; fact: Fact };

export function target(key: string): Target {
  const id = key.slice(2);
  if (key.startsWith("i:")) {
    const item = itemById.get(id);
    if (!item) throw new Error(`Unknown item ${id}`);
    return { t: "item", item };
  }
  const fact = factById.get(id);
  if (!fact) throw new Error(`Unknown fact ${id}`);
  return { t: "fact", fact };
}

export function targetLabel(key: string): string {
  const t = target(key);
  return t.t === "item" ? t.item.name : t.fact.q;
}

export function targetPrio(key: string): Prio {
  const t = target(key);
  return t.t === "item" ? t.item.prio : t.fact.prio;
}

export const factsByTopic = (topic: string) => facts.filter((f) => f.topic === topic).map((f) => f.id);

const firstSentence = (s: string) => s.split(/(?<=\.)\s/)[0].replace(/\s*infix[lr]? \d\.?$/, "");

export const shortDesc = (item: Item) => {
  const p = plain[item.name]?.p;
  const fromPlain = p ? firstSentence(p) : "";
  const first = fromPlain && findName(fromPlain.replace(/`/g, " "), item.name) < 0 ? fromPlain : firstSentence(item.desc);
  return first.length > 110 ? first.slice(0, 107) + "…" : first;
};

export const plainFor = (item: Item) => plain[item.name];
