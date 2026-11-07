export interface Test {
  expr: string;
  expected?: string;
  unordered?: boolean;
  label?: string;
}

export type Step =
  | { k: "read"; body: string }
  | { k: "try"; body?: string; code: string; after?: string; expectError?: boolean }
  | { k: "quiz"; q: string; options: string[]; answer: number; why: string }
  | { k: "predict"; body?: string; expr: string; answer: string; why: string }
  | {
      k: "write";
      body: string;
      starter: string;
      tests: Test[];
      hint: string;
      solution: string;
      banned?: string[];
      setup?: string;
    };

export type DrillStep = Extract<Step, { k: "quiz" | "predict" | "write" }>;

export interface Lesson {
  id: string;
  title: string;
  blurb: string;
  steps: Step[];
}

export interface DrillSet {
  id: string;
  lesson: string;
  title: string;
  drills: DrillStep[];
  level?: number;
  intro?: string;
}

export interface Book {
  id: string;
  order: number;
  title: string;
  blurb: string;
  sets: DrillSet[];
}

export interface ExamTask {
  id: string;
  name: string;
  part: string;
  marks: number;
  prompt: string;
  hints: string[];
  solution: string;
  tests: Test[];
}

export interface Exam {
  id: string;
  year: number;
  title: string;
  summary: string;
  story: string;
  skills: string[];
  setup: string;
  starter: string;
  tasks: ExamTask[];
  notes?: string;
  minutes?: number;
  difficulty?: number;
}

export const md = (...lines: string[]) => lines.join("\n");
export const hs = String.raw;

export const testLabel = (t: Test) =>
  t.label ?? (t.expected !== undefined ? `${t.expr} == ${t.expected}${t.unordered ? "  (any order)" : ""}` : t.expr);
