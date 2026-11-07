import { useSyncExternalStore } from "react";
import { type Grade, type Mem, newMem, review } from "./srs";

const STORAGE_KEY = "prelude-path-v1";

export interface ChallengeState {
  passed: boolean;
  code: string;
}

export interface State {
  mem: Record<string, Mem>;
  xp: number;
  xpByDay: Record<string, number>;
  streak: { current: number; best: number; lastDay: string };
  startDate: string;
  dailyGoal: number;
  challenges: Record<string, ChallengeState>;
  lessons: Record<string, { done: boolean }>;
  exams: Record<string, ExamState>;
  playground: string;
}

export interface ExamState {
  code: string;
  best: number;
  last: number;
  runs: number;
  startedAt?: number;
}

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const yesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dayKey(d);
};

const DEFAULT_PLAYGROUND = `-- Definitions go here. Expressions go in the REPL on the right.
double :: Num a => a -> a
double x = x * 2

squares :: [Integer]
squares = map (^ 2) [1 ..]
`;

function fresh(): State {
  return {
    mem: {},
    xp: 0,
    xpByDay: {},
    streak: { current: 0, best: 0, lastDay: "" },
    startDate: dayKey(),
    dailyGoal: 150,
    challenges: {},
    lessons: {},
    exams: {},
    playground: DEFAULT_PLAYGROUND,
  };
}

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...fresh(), ...JSON.parse(raw) };
  } catch {
    /* corrupted storage falls back to a fresh state */
  }
  return fresh();
}

let state: State = load();
const listeners = new Set<() => void>();

function commit(next: State) {
  state = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export const getState = () => state;

export function useAppState(): State {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
}

export function addXp(amount: number) {
  if (amount <= 0) return;
  const today = dayKey();
  const s = state.streak;
  let streak = s;
  if (s.lastDay !== today) {
    const current = s.lastDay === yesterdayKey() ? s.current + 1 : 1;
    streak = { current, best: Math.max(s.best, current), lastDay: today };
  }
  commit({
    ...state,
    xp: state.xp + amount,
    xpByDay: { ...state.xpByDay, [today]: (state.xpByDay[today] ?? 0) + amount },
    streak,
  });
}

export function currentStreak(s: State) {
  const today = dayKey();
  return s.streak.lastDay === today || s.streak.lastDay === yesterdayKey() ? s.streak.current : 0;
}

export function markSeen(key: string) {
  if (state.mem[key]) return;
  commit({ ...state, mem: { ...state.mem, [key]: newMem(Date.now()) } });
}

export function recordReview(key: string, grade: Grade, confusedWith?: string) {
  const now = Date.now();
  const prev = state.mem[key] ?? newMem(now);
  const next = review(prev, grade, now);
  if (confusedWith && confusedWith !== key && !next.confusedWith.includes(confusedWith)) {
    next.confusedWith = [...next.confusedWith, confusedWith].slice(-4);
  }
  commit({ ...state, mem: { ...state.mem, [key]: next } });
}

export function saveChallenge(id: string, patch: Partial<ChallengeState>) {
  const prev = state.challenges[id] ?? { passed: false, code: "" };
  commit({ ...state, challenges: { ...state.challenges, [id]: { ...prev, ...patch } } });
}

export function saveExam(id: string, patch: Partial<ExamState>) {
  const prev = state.exams[id] ?? { code: "", best: 0, last: 0, runs: 0 };
  commit({ ...state, exams: { ...state.exams, [id]: { ...prev, ...patch } } });
}

export function completeLesson(id: string): boolean {
  if (state.lessons[id]?.done) return false;
  commit({ ...state, lessons: { ...state.lessons, [id]: { done: true } } });
  return true;
}

export function savePlayground(code: string) {
  commit({ ...state, playground: code });
}

export function setDailyGoal(goal: number) {
  commit({ ...state, dailyGoal: goal });
}

export function restartPlan() {
  commit({ ...state, startDate: dayKey() });
}

export function exportProgress(): string {
  return JSON.stringify(state, null, 1);
}

export function importProgress(json: string) {
  commit({ ...fresh(), ...JSON.parse(json) });
}

export function resetProgress() {
  commit(fresh());
}
