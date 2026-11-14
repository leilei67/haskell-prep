import { WASM_IMPORTS, ensureWasm, resetWasm, wasmChallenge, wasmRunExprs } from "./hs-runtime";
import { loadGhciCache, lookupGhciCache } from "./ghci-cache";

export interface RunResult {
  load: string;
  outputs: string[];
  timedOut: boolean;
  truncated: boolean;
}

export interface TestOutcome {
  pass: boolean;
  status: "pass" | "fail" | "error" | "timeout" | "missing";
  detail: string;
}

export interface ChallengeResult {
  compileError: string;
  results: TestOutcome[];
  timedOut: boolean;
}

type Engine = "local" | "wasm" | "none";

let engine: Engine | null = null;
let picking: Promise<Engine> | null = null;

export function resetEngine() {
  engine = null;
  picking = null;
  resetWasm();
}

async function probeLocal(): Promise<string | null> {
  try {
    const res = await fetch("/api/health", { signal: AbortSignal.timeout(1500) });
    if (!res.ok) return null;
    const json = (await res.json()) as { ok?: boolean; ghc?: string };
    return json.ok && json.ghc ? json.ghc : null;
  } catch {
    return null;
  }
}

async function pickEngine(): Promise<Engine> {
  if (engine) return engine;
  if (!picking) {
    picking = (async () => {
      if (await probeLocal()) return (engine = "local");
      try {
        await ensureWasm();
        return (engine = "wasm");
      } catch {
        return (engine = "none");
      }
    })();
  }
  return picking;
}

async function post<T>(url: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function runExprs(exprs: string[], defs = "", mode: "check" | "playground" = "check"): Promise<RunResult | null> {
  const e = await pickEngine();
  if (e === "local") return post<RunResult>("/api/run", { exprs, defs, mode });
  if (e === "wasm") {
    await loadGhciCache();
    const hit = lookupGhciCache(defs, exprs);
    if (hit) return hit;
    if (exprs.length > 1) {
      const one = lookupGhciCache(defs, [exprs[0]]);
      if (one) return one;
    }
    return wasmRunExprs(defs, exprs, WASM_IMPORTS);
  }
  return null;
}

export async function runChallengeTests(
  code: string,
  setup: string,
  tests: { expr: string; expected?: string; unordered?: boolean }[],
): Promise<ChallengeResult | null> {
  const e = await pickEngine();
  if (e === "local") return post<ChallengeResult>("/api/challenge", { code, setup, tests });
  if (e === "wasm") return wasmChallenge(code, setup, tests);
  return null;
}

export async function health(): Promise<string | null> {
  const e = await pickEngine();
  if (e === "local") return probeLocal();
  if (e === "wasm") return "MicroHs (browser)";
  return null;
}

export const isGhcError = (out: string) =>
  /<interactive>:\d+:\d+: error|^\s*error|\*\*\* Exception|Cannot find module|undefined/m.test(out);
