import { useState } from "react";
import type { Step, Test } from "../content/schema";
import { testLabel } from "../content/schema";
import { type ChallengeResult, isGhcError, runChallengeTests, runExprs } from "../lib/api";
import { bannedUsed } from "../lib/banned";
import { squash } from "../lib/haskell";
import { Code, Prose, Rich } from "./Code";
import { Editor } from "./Editor";

export type OnDone = (firstTry: boolean) => void;
type StepProps<K extends Step["k"]> = { step: Extract<Step, { k: K }>; onDone: OnDone };

export function TestResults({ tests, result }: { tests: Test[]; result: ChallengeResult }) {
  if (result.compileError) {
    return (
      <>
        <p className="step-wrong">GHC couldn't compile the code yet. The first lines of the message say where the problem is:</p>
        <pre className="load-msg err">{result.compileError}</pre>
      </>
    );
  }
  return (
    <ul className="test-list">
      {result.results.map((r, i) => {
        const t = tests[i];
        const timeout = r.status === "timeout" || r.detail === "<<timeout>>";
        return (
          <li key={i} className={r.pass ? "pass" : "fail"}>
            <span className="test-mark" aria-hidden>
              {r.pass ? "✓" : "✗"}
            </span>
            <span className="test-body">
              <Code code={testLabel(t)} />
              {!r.pass && (
                <span className="test-detail">
                  {timeout
                    ? "Took too long: is there a recursion that never reaches its base case?"
                    : r.status === "error"
                      ? r.detail.startsWith("Prelude.undefined")
                        ? "Still undefined: this function hasn't been written yet."
                        : `Crashed: ${r.detail}`
                      : t.expected !== undefined
                        ? `Your code gave: ${r.detail}`
                        : "This came out False."}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function TryStep({ step, onDone }: StepProps<"try">) {
  const [out, setOut] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    const r = await runExprs([step.code]);
    setBusy(false);
    setOut(r ? r.outputs[0] || "(no output)" : "The GHCi server isn't running. Start the app with npm run dev.");
    onDone(true);
  };
  return (
    <div className="lesson-step">
      {step.body && <Prose text={step.body} />}
      <p className="step-cue">Run this and look at what GHCi says:</p>
      <pre className="code-block repl-line">
        <span className="repl-prompt">ghci&gt; </span>
        <Code code={step.code} />
      </pre>
      {out === null ? (
        <button type="button" className="btn btn-primary" onClick={run} disabled={busy} autoFocus>
          {busy ? "Running…" : "Run it"}
        </button>
      ) : (
        <>
          <pre className={`ghci-out ${isGhcError(out) ? "is-error" : ""}`}>{out}</pre>
          {step.after && (
            <div className="step-after">
              <Prose text={step.after} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function QuizStep({ step, onDone }: StepProps<"quiz">) {
  const [tried, setTried] = useState<number[]>([]);
  const solved = tried.includes(step.answer);
  const pick = (i: number) => {
    if (solved || tried.includes(i)) return;
    const next = [...tried, i];
    setTried(next);
    if (i === step.answer) onDone(next.length === 1);
  };
  return (
    <div className="lesson-step">
      <h2 className="ex-prompt">
        <Rich text={step.q} />
      </h2>
      <div className="options">
        {step.options.map((o, i) => (
          <button
            type="button"
            key={i}
            className={`option ${tried.includes(i) ? (i === step.answer ? "right" : "wrong") : ""}`}
            onClick={() => pick(i)}
            disabled={solved}
          >
            <span className="option-num">{i + 1}</span>
            <span className="option-text">
              <Rich text={o} terms={false} />
            </span>
          </button>
        ))}
      </div>
      {tried.length > 0 && !solved && <p className="step-wrong">Not that one. Have another go.</p>}
      {solved && (
        <div className="step-after">
          <Prose text={step.why} />
        </div>
      )}
    </div>
  );
}

function PredictStep({ step, onDone }: StepProps<"predict">) {
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState<"open" | "wrong" | "right" | "revealed">("open");
  const [actual, setActual] = useState("");
  const [misses, setMisses] = useState(0);
  const [busy, setBusy] = useState(false);
  const check = async () => {
    if (!answer.trim() || busy) return;
    setBusy(true);
    const r = await runExprs([`(${step.expr})`, `((${step.expr}) == (${answer.trim()}))`]);
    setBusy(false);
    const shown = r?.outputs[0] ?? step.answer;
    setActual(shown);
    const ok = r?.outputs[1].trim() === "True" || squash(answer) === squash(shown) || squash(answer) === squash(step.answer);
    if (ok) {
      setState("right");
      onDone(misses === 0);
    } else {
      setMisses((m) => m + 1);
      setState("wrong");
    }
  };
  const done = state === "right" || state === "revealed";
  return (
    <div className="lesson-step">
      {step.body && <Prose text={step.body} />}
      <h2 className="ex-prompt">What will GHCi say?</h2>
      <pre className="code-block repl-line">
        <span className="repl-prompt">ghci&gt; </span>
        <Code code={step.expr} />
      </pre>
      <form
        className="predict-form"
        onSubmit={(e) => {
          e.preventDefault();
          check();
        }}
      >
        <input
          className="answer-input wide"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            if (state === "wrong") setState("open");
          }}
          disabled={done}
          placeholder="Your prediction, written the way GHCi prints it"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        {!done && (
          <button type="submit" className="btn btn-primary" disabled={!answer.trim() || busy}>
            {busy ? "Checking…" : "Check"}
          </button>
        )}
      </form>
      {state === "wrong" && (
        <p className="step-wrong">
          Not quite, so think it through again.{" "}
          {misses >= 2 && (
            <button
              type="button"
              className="btn btn-quiet btn-small"
              onClick={() => {
                setState("revealed");
                onDone(false);
              }}
            >
              Show me the answer
            </button>
          )}
        </p>
      )}
      {done && (
        <div className="step-after">
          <p>
            {state === "right" ? "Right. GHCi says " : "GHCi says "}
            <Code code={actual || step.answer} />
          </p>
          <Prose text={step.why} />
        </div>
      )}
    </div>
  );
}

function WriteStep({ step, onDone }: StepProps<"write">) {
  const [code, setCode] = useState(step.starter);
  const [result, setResult] = useState<ChallengeResult | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [fails, setFails] = useState(0);
  const [hint, setHint] = useState(false);
  const [solution, setSolution] = useState(false);
  const [passed, setPassed] = useState(false);

  const run = async () => {
    if (busy || passed) return;
    const used = bannedUsed(code, step.banned ?? []);
    if (used.length) {
      setMessage(`Write it without using ${used.map((u) => `\`${u}\``).join(", ")}.`);
      return;
    }
    setMessage("");
    setBusy(true);
    const r = await runChallengeTests(code, step.setup ?? "", step.tests);
    setBusy(false);
    if (!r) {
      setMessage("The GHCi server isn't running. Start the app with `npm run dev`.");
      return;
    }
    setResult(r);
    const ok = !r.compileError && r.results.every((t) => t.pass);
    if (ok) {
      setPassed(true);
      onDone(fails === 0 && !solution && !hint);
    } else setFails((f) => f + 1);
  };

  return (
    <div className="lesson-step">
      <Prose text={step.body} />
      {step.setup && (
        <details className="given-code">
          <summary>Code you're given</summary>
          <Code block code={step.setup.trim()} />
        </details>
      )}
      {step.banned && step.banned.length > 0 && (
        <p className="muted">
          Not allowed here: <Rich text={step.banned.map((b) => `\`${b}\``).join(", ")} terms={false} />
        </p>
      )}
      <Editor value={code} onChange={setCode} onRun={run} label="Your code" rows={Math.max(6, code.split("\n").length + 2)} />
      <div className="ch-run">
        <button type="button" className="btn btn-primary" onClick={run} disabled={busy || passed}>
          {busy ? "Checking…" : passed ? "Passed" : "Check my code (⌘↵)"}
        </button>
        <button type="button" className="btn btn-quiet btn-small" onClick={() => setHint((h) => !h)}>
          {hint ? "Hide hint" : "Hint"}
        </button>
        {fails >= 2 && !passed && (
          <button
            type="button"
            className="btn btn-quiet btn-small"
            onClick={() => {
              setSolution(true);
              onDone(false);
            }}
          >
            Show a solution
          </button>
        )}
      </div>
      {hint && (
        <div className="ch-hint">
          <Prose text={step.hint} />
        </div>
      )}
      {message && (
        <p className="ch-message err">
          <Rich text={message} />
        </p>
      )}
      {result && <TestResults tests={step.tests} result={result} />}
      {passed && <p className="step-after">Every check passes. Nice work.</p>}
      {solution && <Code block code={step.solution.trim()} />}
    </div>
  );
}

export function StepView({ step, onDone }: { step: Step; onDone: OnDone }) {
  switch (step.k) {
    case "read":
      return (
        <div className="lesson-step">
          <Prose text={step.body} />
        </div>
      );
    case "try":
      return <TryStep step={step} onDone={onDone} />;
    case "quiz":
      return <QuizStep step={step} onDone={onDone} />;
    case "predict":
      return <PredictStep step={step} onDone={onDone} />;
    case "write":
      return <WriteStep step={step} onDone={onDone} />;
  }
}
