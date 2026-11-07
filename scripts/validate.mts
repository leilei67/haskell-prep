import path from "node:path";
import { pathToFileURL } from "node:url";
import { CHECK_IMPORTS, runChallenge, runGhci } from "../server/ghc.ts";
import type { DrillSet, Exam, Lesson, Step } from "../src/content/schema.ts";

const problems: string[] = [];
const warnings: string[] = [];
let checked = 0;

const isError = (o: string) => /<interactive>:\d+:\d+: error|\*\*\* Exception/.test(o);

async function checkSteps(where: string, steps: Step[]) {
  const tries = steps.flatMap((s, i) => (s.k === "try" ? [{ s, i }] : []));
  const preds = steps.flatMap((s, i) => (s.k === "predict" ? [{ s, i }] : []));
  const exprs = [...tries.map(({ s }) => s.code), ...preds.map(({ s }) => `((${s.expr}) == (${s.answer}))`)];
  if (exprs.length) {
    const r = await runGhci("", exprs, CHECK_IMPORTS);
    tries.forEach(({ s, i }, j) => {
      checked++;
      const o = r.outputs[j];
      const bad = isError(o) || o.trim() === "";
      if (bad && !s.expectError) problems.push(`${where} step ${i} try \`${s.code}\` -> ${o.slice(0, 300)}`);
      if (!bad && s.expectError) problems.push(`${where} step ${i} try \`${s.code}\` was expected to error but printed: ${o.slice(0, 200)}`);
    });
    preds.forEach(({ s, i }, j) => {
      checked++;
      const o = r.outputs[tries.length + j];
      if (o.trim() !== "True") problems.push(`${where} step ${i} predict \`${s.expr}\` == \`${s.answer}\` -> ${o.slice(0, 300)}`);
    });
  }
  const writes: Promise<void>[] = [];
  for (const [i, s] of steps.entries()) {
    if (s.k === "quiz") {
      checked++;
      if (s.answer < 0 || s.answer >= s.options.length) problems.push(`${where} step ${i} quiz answer index out of range`);
      if (new Set(s.options).size !== s.options.length) problems.push(`${where} step ${i} quiz has duplicate options`);
    }
    if (s.k === "write") {
      checked++;
      writes.push(
        (async () => {
          const [sol, st] = await Promise.all([
            runChallenge(s.solution, s.setup ?? "", s.tests),
            runChallenge(s.starter, s.setup ?? "", s.tests),
          ]);
          if (sol.compileError) problems.push(`${where} step ${i} write: solution does not compile:\n${sol.compileError.slice(0, 600)}`);
          else
            sol.results.forEach((t, j) => {
              if (!t.pass) problems.push(`${where} step ${i} write: solution fails test ${j} (${s.tests[j].expr}): ${t.status} ${t.detail.slice(0, 200)}`);
            });
          if (st.compileError) problems.push(`${where} step ${i} write: starter does not compile:\n${st.compileError.slice(0, 600)}`);
          else if (st.results.every((t) => t.pass)) warnings.push(`${where} step ${i} write: starter already passes every test`);
        })(),
      );
    }
  }
  await Promise.all(writes);
}

async function checkExam(e: Exam) {
  const where = `exam ${e.id}`;
  const tests = e.tasks.flatMap((t) => t.tests);
  const owner = e.tasks.flatMap((t) => t.tests.map(() => t.name));
  checked += tests.length;
  const full = e.tasks.map((t) => t.solution).join("\n\n");
  const [sol, st] = await Promise.all([runChallenge(full, e.setup, tests), runChallenge(e.starter, e.setup, tests)]);
  if (sol.compileError) problems.push(`${where}: setup + all solutions do not compile:\n${sol.compileError.slice(0, 1500)}`);
  else
    sol.results.forEach((t, j) => {
      if (!t.pass) problems.push(`${where}: solution fails test for ${owner[j]} (${tests[j].expr}): ${t.status} ${t.detail.slice(0, 300)}`);
    });
  if (st.compileError) problems.push(`${where}: setup + starter do not compile:\n${st.compileError.slice(0, 1500)}`);
  for (const t of e.tasks) {
    if (!e.starter.includes(t.name.split(" ")[0])) warnings.push(`${where}: starter doesn't seem to mention ${t.name}`);
    if (t.tests.length === 0) warnings.push(`${where}: task ${t.name} has no tests`);
  }
  const ids = e.tasks.map((t) => t.id);
  if (new Set(ids).size !== ids.length) problems.push(`${where}: duplicate task ids`);
}

const isExam = (v: unknown): v is Exam => !!v && typeof v === "object" && "tasks" in v && "setup" in v && "starter" in v;
const isLesson = (v: unknown): v is Lesson => !!v && typeof v === "object" && "steps" in v && "title" in v;
const isDrillSet = (v: unknown): v is DrillSet => !!v && typeof v === "object" && "drills" in v;

async function visit(name: string, v: unknown): Promise<void> {
  if (Array.isArray(v)) {
    for (const [i, x] of v.entries()) await visit(`${name}[${i}]`, x);
  } else if (isExam(v)) await checkExam(v);
  else if (isLesson(v)) await checkSteps(`lesson ${v.id}`, v.steps);
  else if (isDrillSet(v)) await checkSteps(`drills ${v.id}`, v.drills);
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) await visit(`${name}.${k}`, x);
}

for (const file of process.argv.slice(2)) {
  const mod = await import(pathToFileURL(path.resolve(file)).href);
  for (const [name, value] of Object.entries(mod)) await visit(name, value);
}

if (warnings.length) console.log(`WARNINGS (${warnings.length}):\n` + warnings.map((w) => "  - " + w).join("\n"));
if (problems.length) {
  console.log(`\nPROBLEMS (${problems.length}):\n` + problems.map((p) => "  - " + p).join("\n"));
  console.log(`\n${checked} checks, ${problems.length} problems`);
  process.exit(1);
}
console.log(`OK: ${checked} checks, 0 problems`);
