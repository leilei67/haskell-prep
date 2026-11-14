const SEP = "@@PRELUDE_PATH_SEP@@";
const CMD_NOTE = "Type and info commands need local GHCi. Expression evaluation still works here.";

export const WASM_IMPORTS = [
  "import Data.List (sort, sortOn, sortBy, nub, (\\\\), union, intersect, partition, isPrefixOf, isSuffixOf, isInfixOf, group, groupBy, maximumBy, minimumBy, transpose, intercalate, tails, inits, delete, insert, foldl')",
  "import Data.Char (toUpper, toLower, isDigit, isSpace, isAlpha, isUpper, isLower, ord, chr, digitToInt)",
  "import Data.Maybe (fromMaybe, fromJust, mapMaybe, catMaybes, isJust, isNothing, maybeToList, listToMaybe)",
  "import Data.Ord (comparing)",
  "import Data.Bits ((.&.), (.|.), xor, shiftL, shiftR, bit, setBit, clearBit, testBit, popCount, complement)",
  "import Data.Ratio ((%), numerator, denominator)",
  "import Text.Read (readMaybe)",
  "import Data.Foldable (toList)",
  "import qualified Data.Map as Map",
  "import qualified Data.Set as Set",
];

type WasmRun = { stdout: string; stderr: string; error: string | null; exitCode: number };

let frame: HTMLIFrameElement | null = null;
let seq = 0;
const pending = new Map<number, (r: WasmRun) => void>();
let bootOnce: Promise<void> | null = null;

function onFrameMessage(ev: MessageEvent<{ type: string; id?: number; error?: string; stdout?: string; stderr?: string; exitCode?: number }>) {
  if (ev.source !== frame?.contentWindow) return;
  const m = ev.data;
  if (m.type === "done" && m.id != null) {
    pending.get(m.id)?.({
      stdout: m.stdout ?? "",
      stderr: m.stderr ?? "",
      error: m.error ?? null,
      exitCode: m.exitCode ?? 1,
    });
    pending.delete(m.id);
  }
}

function spawnFrame() {
  if (frame) {
    window.removeEventListener("message", onFrameMessage);
    frame.remove();
  }
  pending.forEach((fn) => fn({ stdout: "", stderr: "", error: "restarted", exitCode: 1 }));
  pending.clear();
  frame = document.createElement("iframe");
  frame.src = `${import.meta.env.BASE_URL}hs-frame.html`;
  frame.title = "Haskell runtime";
  frame.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden";
  document.body.appendChild(frame);
  window.addEventListener("message", onFrameMessage);
}

function frameRun(code: string, timeout: number): Promise<WasmRun> {
  if (!frame?.contentWindow) spawnFrame();
  const id = ++seq;
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => {
      pending.delete(id);
      bootOnce = bootFrame();
      resolve({ stdout: "", stderr: "", error: "timed out", exitCode: 124 });
    }, timeout + 4000);
    pending.set(id, (r) => {
      window.clearTimeout(timer);
      resolve(r);
    });
    frame!.contentWindow!.postMessage({ id, code, timeout }, "*");
  });
}

function bootFrame(): Promise<void> {
  spawnFrame();
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("Haskell runtime timed out while starting")), 30_000);
    const onMsg = (ev: MessageEvent<{ type: string; error?: string }>) => {
      if (ev.source !== frame?.contentWindow) return;
      if (ev.data.type === "ready") {
        window.clearTimeout(timer);
        window.removeEventListener("message", onMsg);
        resolve();
      }
      if (ev.data.type === "boot-error") {
        window.clearTimeout(timer);
        window.removeEventListener("message", onMsg);
        reject(new Error(ev.data.error || "Haskell runtime failed to start"));
      }
    };
    window.addEventListener("message", onMsg);
  });
}

export function resetWasm() {
  bootOnce = null;
  if (frame) {
    window.removeEventListener("message", onFrameMessage);
    frame.remove();
    frame = null;
  }
  pending.clear();
}

export function ensureWasm(): Promise<void> {
  if (!bootOnce) bootOnce = bootFrame();
  return bootOnce;
}

async function runProgram(code: string, timeout = 20_000): Promise<WasmRun> {
  await ensureWasm();
  return frameRun(code, timeout);
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

function stripPragmas(code: string) {
  return code.replace(/\{-#[\s\S]*?#-\}/g, "").trim();
}

function unique(xs: string[]) {
  return [...new Set(xs)];
}

function isCmd(expr: string) {
  return expr.trim().startsWith(":");
}

function moduleOf(imports: string[], body: string, mainBody: string) {
  return [
    "module Main where",
    ...unique(imports),
    "",
    stripPragmas(body),
    "",
    "main :: IO ()",
    "main = do",
    mainBody,
    "",
  ].join("\n");
}

export async function wasmRunExprs(defs: string, exprs: string[], extraImports: string[]) {
  const d = splitImports(defs);
  const imports = unique([...extraImports, ...d.imports]);
  const kinds = exprs.map((e) => (isCmd(e) ? "cmd" : "expr"));
  const runnable = exprs.map((e, i) => (kinds[i] === "expr" ? e : null));
  const steps = runnable
    .map((e) => (e ? [`  putStrLn (${jsonHs(SEP)})`, `  print (${e})`] : []))
    .flat();
  const mainBody = steps.length ? steps.join("\n") : "  return ()";
  const code = moduleOf(imports, d.rest, mainBody);
  const r = await runProgram(code, 20_000);
  const timedOut = r.exitCode === 124;
  const err = [r.error, r.stderr].filter(Boolean).join("\n").trim();
  const parts = (r.stdout || "").split(SEP + "\n");
  const printed = parts.slice(1).map((p) => p.replace(/\n$/, ""));
  let pi = 0;
  const outputs = kinds.map((k) => {
    if (k === "cmd") return CMD_NOTE;
    return printed[pi++] ?? (err && pi === 1 ? "" : "");
  });
  return {
    load: r.exitCode !== 0 && printed.length === 0 ? err : "",
    outputs: kinds.map((k, i) => {
      if (k === "cmd") return CMD_NOTE;
      if (outputs[i]) return outputs[i];
      return err && printed.length === 0 ? err : outputs[i];
    }),
    timedOut,
    truncated: false,
  };
}

function jsonHs(s: string) {
  return JSON.stringify(s);
}

function testExpr(t: { expr: string; expected?: string; unordered?: boolean }) {
  if (t.expected === undefined) return `ppBool (${t.expr})`;
  if (t.unordered) return `ppEq (sort (${t.expr})) (sort (${t.expected}))`;
  return `ppEq (${t.expr}) (${t.expected})`;
}

export async function wasmChallenge(
  student: string,
  setup: string,
  tests: { expr: string; expected?: string; unordered?: boolean }[],
): Promise<{
  compileError: string;
  timedOut: boolean;
  results: { pass: boolean; status: "pass" | "fail" | "error" | "timeout" | "missing"; detail: string }[];
}> {
  const s = splitImports(setup);
  const c = splitImports(student);
  const imports = unique([...WASM_IMPORTS, ...s.imports, ...c.imports]);
  const testList = tests.map((t, i) => `  (${i}, ${testExpr(t)})`).join(",\n");
  const body = [
    stripPragmas(s.rest),
    "",
    stripPragmas(c.rest),
    "",
    "ppBool :: Bool -> (Bool, String)",
    'ppBool b = (b, "")',
    "",
    "ppEq :: (Eq a, Show a) => a -> a -> (Bool, String)",
    "ppEq a b = (a == b, take 400 (show a))",
    "",
    "ppTests :: [(Int, (Bool, String))]",
    "ppTests =",
    "  [",
    testList,
    "  ]",
    "",
    "ppOneLine :: String -> String",
    "ppOneLine xs = take 400 [if ch == '\\n' then ' ' else ch | ch <- xs]",
    "",
    "ppRun :: (Int, (Bool, String)) -> IO ()",
    "ppRun (i, (ok, detail)) =",
    `  putStrLn (${jsonHs(SEP)} ++ (if ok then "PASS " else "FAIL ") ++ show i ++ (if ok then "" else " " ++ ppOneLine detail))`,
    "",
  ].join("\n");
  const code = moduleOf(imports, body, "  mapM_ ppRun ppTests");
  const r = await runProgram(code, Math.min(60_000, 25_000 + tests.length * 1500));
  const timedOut = r.exitCode === 124;
  const marked = (r.stdout || "").split("\n").filter((l) => l.startsWith(SEP));
  if (marked.length === 0) {
    const raw = [r.error, r.stderr, r.stdout].filter(Boolean).join("\n").trim();
    return {
      compileError: timedOut
        ? "Your code ran for too long. Check for a recursion that never reaches its base case."
        : raw || "Couldn't compile the code.",
      results: [],
      timedOut,
    };
  }
  type Status = "pass" | "fail" | "error" | "timeout" | "missing";
  const byIndex = new Map<number, { pass: boolean; status: Status; detail: string }>();
  for (const l of marked) {
    const bodyLine = l.slice(SEP.length);
    const sp1 = bodyLine.indexOf(" ");
    const status = bodyLine.slice(0, sp1).toLowerCase();
    const rest = bodyLine.slice(sp1 + 1);
    const sp2 = rest.indexOf(" ");
    const idx = Number(sp2 < 0 ? rest : rest.slice(0, sp2));
    const detail = sp2 < 0 ? "" : rest.slice(sp2 + 1);
    const st: Status = status === "pass" ? "pass" : status === "fail" ? "fail" : "error";
    byIndex.set(idx, { pass: st === "pass", status: st, detail });
  }
  return {
    compileError: "",
    timedOut,
    results: tests.map((_, i) => {
      const miss: Status = timedOut ? "timeout" : "missing";
      return byIndex.get(i) ?? { pass: false, status: miss, detail: timedOut ? "ran out of time" : "" };
    }),
  };
}
