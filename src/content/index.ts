import type { Book, DrillSet, DrillStep, Exam, Lesson } from "./schema";
import { lessons as foundationLessons } from "./foundations";
import { drills as foundationDrills } from "./drills-foundations";
import * as skillsA from "./skills-a";
import * as skillsB from "./skills-b";
import * as skillsC from "./skills-c";
import { mixed as mixedSets } from "./mixed";

export interface Track {
  id: string;
  title: string;
  blurb: string;
  lessons: Lesson[];
}

export const tracks: Track[] = [
  {
    id: "foundations",
    title: "Foundations",
    blurb: "Haskell from zero: values, functions, types, lists, recursion and more.",
    lessons: foundationLessons,
  },
  {
    id: "skills",
    title: "Exam skills",
    blurb: "Every technique the past exams use, taught step by step.",
    lessons: [...skillsA.lessons, ...skillsB.lessons, ...skillsC.lessons],
  },
];

export const allLessons: Lesson[] = tracks.flatMap((t) => t.lessons);
export const lessonById = new Map(allLessons.map((l) => [l.id, l]));
export const trackOfLesson = new Map(tracks.flatMap((t) => t.lessons.map((l) => [l.id, t] as const)));

const bookModules = import.meta.glob<{ book: Book }>("./books/*.ts", { eager: true });
export const books: Book[] = Object.values(bookModules)
  .map((m) => m.book)
  .filter((b): b is Book => !!b)
  .sort((a, b) => a.order - b.order);

export const mixed: DrillSet[] = mixedSets;

const miniModules = import.meta.glob<{ exam: Exam }>("./minis/*.ts", { eager: true });
export const minis: Exam[] = Object.values(miniModules)
  .map((m) => m.exam)
  .filter((e): e is Exam => !!e)
  .sort((a, b) => (a.difficulty ?? 0) - (b.difficulty ?? 0));

export const drillSets: DrillSet[] = [
  ...foundationDrills,
  ...skillsA.drills,
  ...skillsB.drills,
  ...skillsC.drills,
  ...books.flatMap((b) => b.sets),
  ...mixed,
];
export const drillSetById = new Map(drillSets.map((d) => [d.id, d]));
export const drillSetsForLesson = (lessonId: string) => drillSets.filter((d) => d.lesson === lessonId);
export const bookOfSet = new Map(books.flatMap((b) => b.sets.map((s) => [s.id, b] as const)));

export const drillKey = (setId: string, index: number) => `d:${setId}:${index}`;

export function drillFromKey(key: string): { set: DrillSet; index: number; drill: DrillStep } | null {
  const m = /^d:(.+):(\d+)$/.exec(key);
  if (!m) return null;
  const set = drillSetById.get(m[1]);
  const index = Number(m[2]);
  const drill = set?.drills[index];
  return set && drill ? { set, index, drill } : null;
}

const examModules = import.meta.glob<{ exam: Exam }>("./exams/*.ts", { eager: true });
export const exams: Exam[] = Object.values(examModules)
  .map((m) => m.exam)
  .filter(Boolean)
  .sort((a, b) => b.year - a.year);
export const examById = new Map([...exams, ...minis].map((e) => [e.id, e]));

export const examMarks = (e: Exam) => e.tasks.reduce((n, t) => n + t.marks, 0);

export const bookQuestionCount = (b: Book) => b.sets.reduce((n, s) => n + s.drills.length, 0);
