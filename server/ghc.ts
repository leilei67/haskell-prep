import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const SEP = "@@PRELUDE_PATH_SEP@@";
const MAX_OUTPUT = 40_000;
const MAX_PARALLEL = Number(process.env.GHC_PARALLEL ?? 4);

const COMMON_IMPORTS = [
  "import Data.List (sort, sortOn, sortBy, nub, (\\\\), union, intersect, partition, isPrefixOf, isSuffixOf, isInfixOf, group, groupBy, maximumBy, minimumBy, transpose, intercalate, tails, inits, delete, insert, foldl')",
  "import Data.Char (toUpper, toLower, isDigit, isSpace, isAlpha, isUpper, isLower, ord, chr, digitToInt)",
  "import Data.Maybe (fromMaybe, fromJust, mapMaybe, catMaybes, isJust, isNothing, maybeToList, listToMaybe)",
  "import Data.Ord (comparing)",
  "import Data.Bits ((.&.), (.|.), xor, shiftL, shiftR, bit, setBit, clearBit, testBit, popCount, complement)",
  "import Data.Ratio ((%), numerator, denominator)",
  "import Text.Read (readMaybe)",
];

export const CHECK_IMPORTS = [
  ...COMMON_IMPORTS,
  "import qualified Data.Map as Map",
  "import qualified Data.Set as Set",
  "import Data.Foldable (fold, foldMap', foldr', toList)",
  "import Numeric (log1p, expm1, log1pexp, log1mexp)",
  "import Data.Semigroup (sconcat, stimes)",
  "import Data.List.NonEmpty (NonEmpty(..))",
  "import Text.Read (readPrec, readListPrec)",
  "import Text.ParserCombinators.ReadPrec (ReadPrec)",
  "import GHC.Stack (HasCallStack)",
];

export const PLAYGROUND_IMPORTS = [
  ...COMMON_IMPORTS,
  "import Data.Foldable (toList)",
];

let running = 0;
const waiting: (() => void)[] = [];

async function rmQuiet(dir: string): Promise<void> {
  for (let i = 0; i < 6; i++) {
    try {
      await rm(dir, { recursive: true, force: true });
      return;
    } catch (e) {
      const code = (e as NodeJS.ErrnoException).code;
      if (code === "ENOENT") return;
      if (code !== "ENOTEMPTY" && code !== "EBUSY") return;
      await new Promise((r) => setTimeout(r, 40 * (i + 1)));
    }
  }
}

async function withSlot<T>(job: () => Promise<T>): Promise<T> {
  if (running >= MAX_PARALLEL) await new Promise<void>((r) => waiting.push(r));
  running++;
  try {
    return await job();
  } finally {
    running--;
    waiting.shift()?.();
  }
}

interface ProcResult {
  out: string;
  timedOut: boolean;
  truncated: boolean;
}

function runProcess(shellCmd: string, input: string, cwd: string, timeoutMs: number): Promise<ProcResult> {
  return new Promise((resolve) => {
    const child = spawn("sh", ["-c", `{ ${shellCmd} ; } 2>&1`], { cwd, detached: true });
    let out = "";
    let timedOut = false;
    let truncated = false;
    const kill = () => {
      try {
        process.kill(-child.pid!, "SIGKILL");
      } catch {
        /* already gone */
      }
    };
    const timer = setTimeout(() => {
      timedOut = true;
      kill();
    }, timeoutMs);
    child.stdout.on("data", (d: Buffer) => {
      out += d.toString();
      if (out.length > MAX_OUTPUT) {
        truncated = true;
        out = out.slice(0, MAX_OUTPUT);
        kill();
      }
    });
    child.on("close", () => {
      clearTimeout(timer);
      resolve({ out, timedOut, truncated });
    });
    child.stdin.on("error", () => {});
    child.stdin.end(input);
  });
}

function asStatement(expr: string): string {
  const e = expr.replace(/\s+$/, "");
  return e.includes("\n") ? `:{\n${e}\n:}` : e;
}

export interface RunResult {
  load: string;
  outputs: string[];
  timedOut: boolean;
  truncated: boolean;
}

const cache = new Map<string, RunResult>();

export async function runGhci(defs: string, exprs: string[], imports: string[]): Promise<RunResult> {
  const key = defs.trim() === "" ? JSON.stringify([exprs, imports]) : "";
  if (key && cache.has(key)) return cache.get(key)!;

  const dir = await mkdtemp(path.join(tmpdir(), "prelude-path-"));
  try {
    const script: string[] = [':set prompt ""', ':set prompt-cont ""'];
    if (defs.trim() !== "") {
      await writeFile(path.join(dir, "Playground.hs"), defs);
      script.push(":load Playground.hs");
    }
    script.push(...imports);
    script.push(`putStrLn "${SEP}"`);
    for (const e of exprs) {
      script.push(asStatement(e));
      script.push(`putStrLn "${SEP}"`);
    }
    const res = await withSlot(() =>
      runProcess(
        "ghci -v0 -ignore-dot-ghci -fdiagnostics-color=never -Wno-x-partial",
        script.join("\n") + "\n",
        dir,
        45_000,
      ),
    );
    const parts = res.out.split(SEP + "\n");
    const outputs = exprs.map((_, i) => (parts[i + 1] ?? "").replace(/\n$/, ""));
    const result: RunResult = {
      load: (parts[0] ?? "").trim(),
      outputs,
      timedOut: res.timedOut,
      truncated: res.truncated,
    };
    if (key && !res.timedOut) {
      if (cache.size > 4000) cache.clear();
      cache.set(key, result);
    }
    return result;
  } finally {
    await rmQuiet(dir);
  }
}

export interface ChallengeTest {
  expr: string;
  expected?: string;
  unordered?: boolean;
  label?: string;
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

function splitImports(code: string): { imports: string[]; rest: string } {
  const imports: string[] = [];
  const rest = code
    .split("\n")
    .filter((line) => {
      if (/^import\s/.test(line)) {
        imports.push(line);
        return false;
      }
      return !/^module\s/.test(line);
    })
    .join("\n");
  return { imports, rest };
}

function testExpr(t: ChallengeTest): string {
  if (t.expected === undefined) return `ppBool (${t.expr})`;
  if (t.unordered) return `ppEq (PPL.sort (${t.expr})) (PPL.sort (${t.expected}))`;
  return `ppEq (${t.expr}) (${t.expected})`;
}

export async function runChallenge(code: string, setup: string, tests: ChallengeTest[]): Promise<ChallengeResult> {
  const dir = await mkdtemp(path.join(tmpdir(), "prelude-path-ch-"));
  try {
    const s = splitImports(setup);
    const c = splitImports(code);
    const imports = [...new Set([...s.imports, ...c.imports])];
    const testList = tests.map((t, i) => `  (${i}, ${testExpr(t)})`).join(",\n");
    const program = [
      "{-# LANGUAGE ScopedTypeVariables #-}",
      "{-# OPTIONS_GHC -Wno-x-partial -Wno-overlapping-patterns #-}",
      "module Main (main) where",
      "import qualified Control.Exception as PPE",
      "import qualified System.IO as PPIO",
      "import qualified System.Timeout as PPT",
      "import qualified Data.List as PPL",
      ...imports,
      "",
      "{-# LINE 1 \"Given.hs\" #-}",
      s.rest,
      "",
      "{-# LINE 1 \"YourCode.hs\" #-}",
      c.rest,
      "",
      "ppEndOfYourCode :: ()",
      "ppEndOfYourCode = ()",
      "",
      "{-# LINE 1 \"Tests.hs\" #-}",
      "ppBool :: Bool -> (Bool, String)",
      "ppBool b = (b, \"\")",
      "",
      "ppEq :: (Eq ppa, Show ppa) => ppa -> ppa -> (Bool, String)",
      "ppEq a b = (a == b, show a)",
      "",
      "ppTests :: [(Int, (Bool, String))]",
      "ppTests =",
      "  [",
      testList,
      "  ]",
      "",
      "ppOneLine :: String -> String",
      "ppOneLine = map (\\ch -> if ch == '\\n' then ' ' else ch) . take 400",
      "",
      "main :: IO ()",
      "main = do",
      "  PPIO.hSetBuffering PPIO.stdout PPIO.LineBuffering",
      "  mapM_ ppRun ppTests",
      "  where",
      "    ppRun (i, t) = do",
      "      r <- PPT.timeout 4000000 (PPE.try (PPE.evaluate (fst t)))",
      "      case r of",
      `        Nothing -> putStrLn ("${SEP}TIMEOUT " ++ show i)`,
      `        Just (Left (e :: PPE.SomeException)) -> putStrLn ("${SEP}ERROR " ++ show i ++ " " ++ ppOneLine (show e))`,
      `        Just (Right True) -> putStrLn ("${SEP}PASS " ++ show i)`,
      "        Just (Right False) -> do",
      "          d <- PPT.timeout 2000000 (PPE.try (PPE.evaluate (let s = take 400 (snd t) in length s `seq` s)))",
      "          let detail = case d of",
      "                Just (Right str) -> str",
      "                Just (Left (_ :: PPE.SomeException)) -> \"\"",
      "                Nothing -> \"\"",
      `          putStrLn ("${SEP}FAIL " ++ show i ++ " " ++ ppOneLine (detail :: String))`,
    ].join("\n");
    await writeFile(path.join(dir, "Main.hs"), program);
    const budget = 30_000 + tests.length * 4_500;
    const res = await withSlot(() =>
      runProcess(
        "ghc -O0 -fdiagnostics-color=never -outputdir build -o main Main.hs >/dev/null 2>compile.txt; " +
          "if [ -x ./main ]; then ./main; else cat compile.txt; fi",
        "",
        dir,
        budget,
      ),
    );
    const marked = res.out.split("\n").filter((l) => l.startsWith(SEP));
    if (marked.length === 0) {
      const raw = res.out.replace(/^\[\d+ of \d+\] Compiling.*$/gm, "").replace(/^Linking.*$/gm, "").trim();
      return {
        compileError: res.timedOut ? "Your code ran for too long. Check for a recursion that never reaches its base case." : raw,
        results: [],
        timedOut: res.timedOut,
      };
    }
    const byIndex = new Map<number, TestOutcome>();
    for (const l of marked) {
      const body = l.slice(SEP.length);
      const sp1 = body.indexOf(" ");
      const status = body.slice(0, sp1);
      const rest = body.slice(sp1 + 1);
      const sp2 = rest.indexOf(" ");
      const idx = Number(sp2 < 0 ? rest : rest.slice(0, sp2));
      const detail = sp2 < 0 ? "" : rest.slice(sp2 + 1);
      const st = status.toLowerCase() as TestOutcome["status"];
      byIndex.set(idx, { pass: st === "pass", status: st, detail });
    }
    return {
      compileError: "",
      timedOut: res.timedOut,
      results: tests.map((_, i) => byIndex.get(i) ?? { pass: false, status: "missing", detail: res.timedOut ? "ran out of time" : "" }),
    };
  } finally {
    await rmQuiet(dir);
  }
}

export async function ghcVersion(): Promise<string> {
  const res = await runProcess("ghc --numeric-version", "", tmpdir(), 5000);
  return res.out.trim();
}
