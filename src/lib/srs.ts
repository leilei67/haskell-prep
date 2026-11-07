export type Grade = "again" | "hard" | "good" | "easy";

export interface Mem {
  reps: number;
  ease: number;
  interval: number;
  due: number;
  lapses: number;
  correct: number;
  wrong: number;
  seen: number;
  last: number;
  confusedWith: string[];
}

export const MINUTE = 60_000;
export const DAY = 86_400_000;

export function newMem(now: number): Mem {
  return {
    reps: 0,
    ease: 2.5,
    interval: 0,
    due: now,
    lapses: 0,
    correct: 0,
    wrong: 0,
    seen: now,
    last: now,
    confusedWith: [],
  };
}

const LEARNING_STEPS_DAYS = [10 / 1440, 1, 3];

export function review(mem: Mem, grade: Grade, now: number): Mem {
  const m = { ...mem, last: now };
  if (grade === "again") {
    m.lapses++;
    m.wrong++;
    m.reps = Math.max(0, m.reps - 2);
    m.ease = Math.max(1.3, m.ease - 0.2);
    m.interval = 0;
    m.due = now + 5 * MINUTE;
    return m;
  }
  m.correct++;
  m.reps++;
  if (m.reps <= LEARNING_STEPS_DAYS.length) {
    let step = LEARNING_STEPS_DAYS[m.reps - 1];
    if (grade === "hard") step *= 0.5;
    if (grade === "easy") step = LEARNING_STEPS_DAYS[Math.min(m.reps, LEARNING_STEPS_DAYS.length - 1)];
    m.interval = step;
  } else {
    const factor = grade === "hard" ? 1.2 : grade === "easy" ? m.ease * 1.3 : m.ease;
    m.interval = Math.max(m.interval + 1, m.interval * factor);
  }
  if (grade === "hard") m.ease = Math.max(1.3, m.ease - 0.15);
  if (grade === "easy") m.ease += 0.15;
  m.due = now + m.interval * DAY;
  return m;
}

export function retrievability(mem: Mem, now: number): number {
  if (mem.interval <= 0) return mem.reps > 0 ? 0.9 : 0.5;
  const elapsed = (now - mem.last) / DAY;
  return Math.pow(0.9, elapsed / mem.interval);
}

export function strength(mem: Mem | undefined): number {
  if (!mem) return 0;
  if (mem.interval >= 7) return 5;
  return Math.min(4, 1 + mem.reps);
}

export const STRENGTH_LABELS = ["New", "Introduced", "Recognised", "Recalled", "Solid", "Mastered"];
