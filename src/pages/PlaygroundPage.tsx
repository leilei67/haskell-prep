import { useEffect, useMemo, useRef, useState } from "react";
import { Editor } from "../components/Editor";
import { runnable } from "../components/Exercises";
import { items } from "../lib/content";
import { shuffle } from "../lib/exercises";
import { isGhcError, runExprs } from "../lib/api";
import { getState, savePlayground } from "../lib/store";

interface Entry {
  input: string;
  output: string;
  error: boolean;
}

const BINDING = /^(let\s|import\s|[a-z_][\w']*(\s+[^=]*)?\s*=(?![=>]))/;

export function PlaygroundPage({ ghcUp }: { ghcUp: boolean }) {
  const [defs, setDefs] = useState(() => getState().playground);
  const [loadMsg, setLoadMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [bindings, setBindings] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [histPos, setHistPos] = useState(-1);
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const examples = useMemo(() => shuffle(items.filter((i) => runnable(i.ex))).slice(0, 6), []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [entries]);

  const reload = async () => {
    savePlayground(defs);
    setBusy(true);
    const r = await runExprs([], defs, "playground");
    setBusy(false);
    if (!r) setLoadMsg({ ok: false, text: "Haskell isn't ready yet. Wait a moment and try again." });
    else setLoadMsg(r.load ? { ok: false, text: r.load } : { ok: true, text: "Loaded. Your definitions are in scope." });
  };

  const run = async (raw: string) => {
    const cmd = raw.trim();
    if (!cmd || busy) return;
    savePlayground(defs);
    setHistory((h) => [cmd, ...h.filter((x) => x !== cmd)].slice(0, 50));
    setHistPos(-1);
    setInput("");
    setBusy(true);
    const r = await runExprs([...bindings, cmd], defs, "playground");
    setBusy(false);
    if (!r) {
      setEntries((e) => [...e, { input: cmd, output: "Haskell isn't ready yet. Wait a moment and try again.", error: true }]);
      return;
    }
    const out = r.outputs[r.outputs.length - 1] ?? "";
    const loadErr = r.load ? r.load + "\n\n" : "";
    const error = isGhcError(out) || !!r.load;
    let output = loadErr + out;
    if (r.timedOut) output += "\n(stopped after 10 seconds)";
    if (r.truncated) output += "\n(output cut off; try take 20 on infinite lists)";
    setEntries((e) => [...e, { input: cmd, output, error }]);
    if (!cmd.startsWith(":") && BINDING.test(cmd) && !error) setBindings((b) => [...b, cmd]);
  };

  return (
    <div className="page playground">
      <h1 className="page-title">Playground</h1>
      <p className="page-lede">
        Put definitions on the left; evaluate expressions and <code className="code">let</code> bindings on the right.
        <code className="code">:t</code> and <code className="code">:i</code> need local GHCi (<code className="code">npm run dev</code>).
      </p>
      {!ghcUp && <p className="banner">Haskell is still starting in this tab.</p>}
      <div className="playground-grid">
        <section className="pg-editor">
          <div className="pg-bar">
            <span>Definitions</span>
            <button type="button" className="btn btn-secondary btn-small" onClick={reload} disabled={busy}>
              Load (⌘↵)
            </button>
          </div>
          <Editor value={defs} onChange={setDefs} onRun={reload} label="Haskell definitions" rows={18} />
          {loadMsg && <pre className={`load-msg ${loadMsg.ok ? "ok" : "err"}`}>{loadMsg.text}</pre>}
        </section>
        <section className="pg-repl">
          <div className="pg-bar">
            <span>GHCi</span>
            <button
              type="button"
              className="btn btn-quiet btn-small"
              onClick={() => {
                setEntries([]);
                setBindings([]);
              }}
            >
              Clear
            </button>
          </div>
          <div className="repl-log" ref={logRef} aria-live="polite">
            {entries.length === 0 && (
              <div className="repl-empty">
                <p>Try one of these:</p>
                <div className="chips">
                  {examples.map((i) => (
                    <button type="button" key={i.id} className="chip" onClick={() => run(i.ex)}>
                      {i.ex}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {entries.map((e, i) => (
              <div key={i} className="repl-entry">
                <div className="repl-in">
                  <span className="repl-prompt">ghci&gt; </span>
                  {e.input}
                </div>
                {e.output && <pre className={`repl-out ${e.error ? "err" : ""}`}>{e.output}</pre>}
              </div>
            ))}
            {busy && <div className="repl-busy">Evaluating…</div>}
          </div>
          <form
            className="repl-form"
            onSubmit={(e) => {
              e.preventDefault();
              run(input);
            }}
          >
            <span className="repl-prompt">ghci&gt;</span>
            <input
              className="repl-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" && history.length) {
                  e.preventDefault();
                  const p = Math.min(histPos + 1, history.length - 1);
                  setHistPos(p);
                  setInput(history[p]);
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  const p = histPos - 1;
                  setHistPos(Math.max(p, -1));
                  setInput(p >= 0 ? history[p] : "");
                }
              }}
              aria-label="GHCi input"
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              placeholder="map (*2) [1..5]"
            />
          </form>
        </section>
      </div>
    </div>
  );
}
