import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readdir } from "node:fs/promises";

import type { DrillSet, Lesson, Step } from "../src/content/schema.ts";
import { ghciCacheKey } from "../src/lib/ghci-cache-key.ts";
import { CHECK_IMPORTS, runGhci, type RunResult } from "../server/ghc.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function defsBefore(steps: Step[], index: number): string {
  let defs = "";
  for (let i = 0; i < index; i++) {
    const s = steps[i];
    if (s.k === "write") defs = `${s.setup ?? ""}\n${s.solution}`.trim();
  }
  return defs;
}

type Job = { defs: string; exprs: string[] };

function collectSteps(where: string, steps: Step[], out: Job[]) {
  steps.forEach((s, i) => {
    const defs = defsBefore(steps, i);
    if (s.k === "try") out.push({ defs, exprs: [s.code] });
    if (s.k === "predict") out.push({ defs, exprs: [`(${s.expr})`] });
  });
}

async function importBooks(): Promise<DrillSet[]> {
  const dir = path.join(root, "src/content/books");
  const sets: DrillSet[] = [];
  for (const f of await readdir(dir)) {
    if (!f.endsWith(".ts")) continue;
    const mod = (await import(pathToFileURL(path.join(dir, f)).href)) as { book?: { sets: DrillSet[] } };
    if (mod.book?.sets) sets.push(...mod.book.sets);
  }
  return sets;
}

async function loadJobs(): Promise<Job[]> {
  const jobs: Job[] = [];

  const { lessons: foundationLessons } = await import(pathToFileURL(path.join(root, "src/content/foundations.ts")).href);
  const { drills: foundationDrills } = await import(pathToFileURL(path.join(root, "src/content/drills-foundations.ts")).href);
  const skillsA = await import(pathToFileURL(path.join(root, "src/content/skills-a.ts")).href);
  const skillsB = await import(pathToFileURL(path.join(root, "src/content/skills-b.ts")).href);
  const skillsC = await import(pathToFileURL(path.join(root, "src/content/skills-c.ts")).href);
  const skillsInterim = await import(pathToFileURL(path.join(root, "src/content/skills-interim.ts")).href);
  const { mixed } = await import(pathToFileURL(path.join(root, "src/content/mixed.ts")).href);

  const lessons: Lesson[] = [
    ...(foundationLessons as Lesson[]),
    ...(skillsA.lessons as Lesson[]),
    ...(skillsB.lessons as Lesson[]),
    ...(skillsC.lessons as Lesson[]),
    ...(skillsInterim.lessons as Lesson[]),
  ];
  const drills: DrillSet[] = [
    ...(foundationDrills as DrillSet[]),
    ...(skillsA.drills as DrillSet[]),
    ...(skillsB.drills as DrillSet[]),
    ...(skillsC.drills as DrillSet[]),
    ...(skillsInterim.drills as DrillSet[]),
    ...(mixed as DrillSet[]),
    ...(await importBooks()),
  ];

  for (const l of lessons) collectSteps(`lesson ${l.id}`, l.steps, jobs);
  for (const d of drills) collectSteps(`drill ${d.id}`, d.drills, jobs);

  const seen = new Set<string>();
  return jobs.filter((j) => {
    const key = ghciCacheKey(j.defs, j.exprs);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function main() {
  const jobs = await loadJobs();
  console.log(`Caching ${jobs.length} try/predict expressions with GHC…`);

  const entries: Record<string, Pick<RunResult, "load" | "outputs" | "timedOut" | "truncated">> = {};
  let done = 0;
  const batchSize = 40;
  const byDefs = new Map<string, string[]>();
  for (const j of jobs) {
    const list = byDefs.get(j.defs) ?? [];
    list.push(...j.exprs);
    byDefs.set(j.defs, list);
  }

  for (const [defs, exprs] of byDefs) {
    for (let i = 0; i < exprs.length; i += batchSize) {
      const chunk = exprs.slice(i, i + batchSize);
      const r = await runGhci(defs, chunk, CHECK_IMPORTS);
      chunk.forEach((expr, k) => {
        const key = ghciCacheKey(defs, [expr]);
        entries[key] = {
          load: r.load,
          outputs: [r.outputs[k] ?? ""],
          timedOut: r.timedOut,
          truncated: r.truncated,
        };
        done++;
        if (done % 50 === 0) process.stdout.write(`\r  ${done}/${jobs.length}`);
      });
    }
  }

  console.log(`\n  ${done} entries`);
  const outPath = path.join(root, "public/ghci-cache.json");
  await mkdir(path.dirname(outPath), { recursive: true });
  const payload = { v: 1 as const, entries };
  const json = JSON.stringify(payload);
  await writeFile(outPath, json);
  const sha = createHash("sha256").update(json).digest("hex").slice(0, 12);
  console.log(`Wrote ${outPath} (${(json.length / 1024).toFixed(0)} KiB, sha ${sha})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});