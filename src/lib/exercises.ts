import { type Fact, type Item, facts, itemById, itemKey, items, shortDesc, target } from "./content";
import { type Blank, findName, makeBlank, mutateSig, normalizeSig, splitTopEq, stripCallStack } from "./haskell";
import type { Mem } from "./srs";
import { unitOfKey } from "../data/units";

export interface Option {
  text: string;
  code: boolean;
  key?: string;
}

export type ExerciseKind = "intro" | "mcType" | "mcName" | "mcSigName" | "mcFact" | "predict" | "blank" | "sig" | "match" | "flip";

interface Base {
  id: string;
}

export type Exercise =
  | (Base & { kind: "intro"; key: string })
  | (Base & { kind: "mcType" | "mcName" | "mcSigName" | "mcFact"; key: string; prompt: string; code?: string; rich?: string; options: Option[]; answer: number })
  | (Base & { kind: "predict"; key: string; expr: string; expected: string })
  | (Base & { kind: "blank"; key: string; blank: Blank })
  | (Base & { kind: "sig"; key: string })
  | (Base & { kind: "match"; pairs: { key: string; left: string; right: string }[] })
  | (Base & { kind: "flip"; key: string });

export const exerciseKey = (ex: Exercise) => (ex.kind === "match" ? null : ex.key);

let counter = 0;
const uid = () => `ex-${Date.now()}-${counter++}`;

export function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pickOne = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

function unitItems(item: Item): Item[] {
  const unit = unitOfKey.get(itemKey(item.id));
  if (!unit) return [];
  return unit.keys.filter((k) => k.startsWith("i:")).map((k) => itemById.get(k.slice(2))!).filter((i) => i.id !== item.id);
}

function confusedItems(mem: Mem | undefined): Item[] {
  return (mem?.confusedWith ?? [])
    .filter((k) => k.startsWith("i:"))
    .map((k) => itemById.get(k.slice(2)))
    .filter((i): i is Item => !!i);
}

function buildOptions(correct: Option, candidates: Option[], same: (a: Option, b: Option) => boolean, n = 4) {
  const chosen: Option[] = [correct];
  for (const c of candidates) {
    if (chosen.length >= n) break;
    if (!chosen.some((o) => same(o, c))) chosen.push(c);
  }
  const options = shuffle(chosen);
  return { options, answer: options.indexOf(correct) };
}

function mcType(item: Item, mem: Mem | undefined): Exercise {
  const sigOpt = (sig: string, key?: string): Option => ({ text: stripCallStack(sig), code: true, key });
  const correct = sigOpt(item.sig, itemKey(item.id));
  const mutations = shuffle(mutateSig(item.sig)).slice(0, 2).map((s) => sigOpt(s));
  const near = [...confusedItems(mem), ...shuffle(unitItems(item))].map((i) => sigOpt(i.sig, itemKey(i.id)));
  const far = shuffle(items).slice(0, 12).map((i) => sigOpt(i.sig, itemKey(i.id)));
  const { options, answer } = buildOptions(
    correct,
    [...mutations, ...near, ...far],
    (a, b) => normalizeSig(a.text) === normalizeSig(b.text),
  );
  return { id: uid(), kind: "mcType", key: itemKey(item.id), prompt: "What is the type of", code: item.name, options, answer };
}

function nameCandidates(item: Item, mem: Mem | undefined): Option[] {
  return [...confusedItems(mem), ...shuffle(unitItems(item)), ...shuffle(items).slice(0, 12)].map((i) => ({
    text: i.name,
    code: true,
    key: itemKey(i.id),
  }));
}

function mcName(item: Item, mem: Mem | undefined): Exercise {
  const correct: Option = { text: item.name, code: true, key: itemKey(item.id) };
  const desc = shortDesc(item);
  const { options, answer } = buildOptions(
    correct,
    nameCandidates(item, mem).filter((o) => shortDesc(itemById.get(o.key!.slice(2))!) !== desc),
    (a, b) => a.text === b.text,
  );
  return { id: uid(), kind: "mcName", key: itemKey(item.id), prompt: "Which one does this?", rich: desc, options, answer };
}

function mcSigName(item: Item, mem: Mem | undefined): Exercise {
  const correct: Option = { text: item.name, code: true, key: itemKey(item.id) };
  const norm = normalizeSig(item.sig);
  const { options, answer } = buildOptions(
    correct,
    nameCandidates(item, mem).filter((o) => normalizeSig(itemById.get(o.key!.slice(2))!.sig) !== norm),
    (a, b) => a.text === b.text,
  );
  return {
    id: uid(),
    kind: "mcSigName",
    key: itemKey(item.id),
    prompt: "Which Prelude name has this type?",
    code: stripCallStack(item.sig),
    options,
    answer,
  };
}

function mcFact(fact: Fact, mem: Mem | undefined): Exercise {
  const opt = (f: Fact): Option => ({ text: f.a, code: false, key: `f:${f.id}` });
  const confused = (mem?.confusedWith ?? []).filter((k) => k.startsWith("f:")).map((k) => target(k)).flatMap((t) => (t.t === "fact" ? [t.fact] : []));
  const family = fact.group.startsWith("class-") ? fact.group : fact.topic;
  const sameGroup = shuffle(facts.filter((f) => f.group === fact.group && f.id !== fact.id));
  const sameFamily = shuffle(facts.filter((f) => (f.topic === family || f.group === family) && f.id !== fact.id));
  const rest = shuffle(facts.filter((f) => !f.group.startsWith("class-"))).slice(0, 10);
  const { options, answer } = buildOptions(opt(fact), [...confused, ...sameGroup, ...sameFamily, ...rest].map(opt), (a, b) => a.text === b.text);
  return { id: uid(), kind: "mcFact", key: `f:${fact.id}`, prompt: fact.q, options, answer };
}

export function predictable(item: Item) {
  const split = splitTopEq(item.ex);
  return split && findName(split.lhs, item.name) >= 0 ? split : null;
}

const POOLS: ExerciseKind[][] = [
  ["mcName", "mcType"],
  ["mcType", "mcSigName", "predict"],
  ["predict", "blank", "mcSigName", "mcType"],
  ["sig", "blank", "predict", "sig"],
];

export function exerciseFor(key: string, mem: Mem | undefined, avoid?: ExerciseKind, levelOverride?: number): Exercise {
  const t = target(key);
  const level = Math.min(3, levelOverride ?? mem?.reps ?? 0);
  if (t.t === "fact") {
    const kind: ExerciseKind = level >= 2 && avoid !== "flip" ? pickOne(["flip", "mcFact"]) : "mcFact";
    return kind === "flip" ? { id: uid(), kind: "flip", key } : mcFact(t.fact, mem);
  }
  const item = t.item;
  const split = predictable(item);
  const blank = makeBlank(item.name, item.ex);
  const available = (k: ExerciseKind) =>
    k === "predict" ? !!split : k === "blank" ? !!blank && !!split : true;
  let pool = POOLS[level].filter(available);
  if (pool.length > 1 && avoid) pool = pool.filter((k) => k !== avoid);
  if (pool.length === 0) pool = ["mcType"];
  const kind = pickOne(pool);
  switch (kind) {
    case "mcName":
      return mcName(item, mem);
    case "mcSigName":
      return mcSigName(item, mem);
    case "predict":
      return { id: uid(), kind: "predict", key, expr: split!.lhs, expected: split!.rhs };
    case "blank":
      return { id: uid(), kind: "blank", key, blank: blank! };
    case "sig":
      return { id: uid(), kind: "sig", key };
    default:
      return mcType(item, mem);
  }
}

export function introFor(key: string): Exercise {
  return { id: uid(), kind: "intro", key };
}

export function matchFor(keys: string[]): Exercise | null {
  const seenDesc = new Set<string>();
  const pairs: { key: string; left: string; right: string }[] = [];
  for (const k of shuffle(keys.filter((k) => k.startsWith("i:")))) {
    const item = itemById.get(k.slice(2))!;
    const d = shortDesc(item);
    if (seenDesc.has(d)) continue;
    seenDesc.add(d);
    pairs.push({ key: k, left: item.name, right: d });
    if (pairs.length === 4) break;
  }
  return pairs.length === 4 ? { id: uid(), kind: "match", pairs } : null;
}
