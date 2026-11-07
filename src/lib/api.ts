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

export const runExprs = (exprs: string[], defs = "", mode: "check" | "playground" = "check") =>
  post<RunResult>("/api/run", { exprs, defs, mode });

export const runChallengeTests = (code: string, setup: string, tests: { expr: string; expected?: string; unordered?: boolean }[]) =>
  post<ChallengeResult>("/api/challenge", { code, setup, tests });

export async function health(): Promise<string | null> {
  try {
    const res = await fetch("/api/health");
    const json = await res.json();
    return json.ok ? json.ghc : null;
  } catch {
    return null;
  }
}

export const isGhcError = (out: string) => /<interactive>:\d+:\d+: error|^\s*error|\*\*\* Exception/m.test(out);
