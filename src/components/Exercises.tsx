import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { itemById, plainFor, shortDesc, target } from "../lib/content";
import { type Exercise, shuffle } from "../lib/exercises";
import { isOperatorName, normalizeSig, squash, stripCallStack } from "../lib/haskell";
import { isGhcError, runExprs } from "../lib/api";
import type { Grade } from "../lib/srs";
import { Code, Rich } from "./Code";
import { ItemExplainer } from "./ItemExplainer";

export interface Verdict {
  correct: boolean;
  grade: Grade;
  heading?: string;
  answer?: ReactNode;
  note?: ReactNode;
  confusedWith?: string;
  perKey?: { key: string; correct: boolean }[];
  silent?: boolean;
}

interface Props<E extends Exercise = Exercise> {
  ex: E;
  locked: boolean;
  onVerdict: (v: Verdict) => void;
}

const NOT_RUNNABLE = /<-|^\||\bgetLine\b|\bgetContents\b|\bgetChar\b|\binteract\b|\breadLn\b|\.\.\.|\bxs\b/;
export const runnable = (ex: string) => ex !== "" && !NOT_RUNNABLE.test(ex);

function useEnter(enabled: boolean, fn: () => void) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    if (!enabled) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        ref.current();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [enabled]);
}

function itemNote(key: string): ReactNode {
  const t = target(key);
  if (t.t === "fact") return <Rich text={t.fact.a} />;
  const p = plainFor(t.item);
  return (
    <>
      <Code code={`${t.item.name} :: ${stripCallStack(t.item.sig)}`} />
      <span className="note-desc">
        <Rich text={p?.p ?? t.item.desc} />
      </span>
      {p?.t && (
        <span className="note-desc">
          <Rich text={`Watch out: ${p.t}`} />
        </span>
      )}
    </>
  );
}

export function RunExample({ ex }: { ex: string }) {
  const [out, setOut] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (!runnable(ex)) return null;
  const run = async () => {
    setBusy(true);
    const r = await runExprs([ex]);
    setBusy(false);
    setOut(r ? r.outputs[0] : "Haskell isn't ready yet.");
  };
  return (
    <div className="run-example">
      <button type="button" className="btn btn-quiet btn-small" onClick={run} disabled={busy}>
        {busy ? "Running…" : "Run in GHCi"}
      </button>
      {out !== null && <pre className="ghci-out">{out || "(no output)"}</pre>}
    </div>
  );
}

export function IntroCard({ ex, onVerdict }: Props<Extract<Exercise, { kind: "intro" }>>) {
  const t = target(ex.key);
  useEnter(true, () => onVerdict({ correct: true, grade: "good", silent: true }));
  return (
    <div className="exercise intro">
      <p className="ex-label">New</p>
      {t.t === "item" ? (
        <>
          <h2 className="intro-name">
            <Code code={t.item.name} />
          </h2>
          <ItemExplainer item={t.item} />
        </>
      ) : (
        <>
          <h2 className="intro-question">
            <Rich text={t.fact.q} />
          </h2>
          <div className="intro-answer">
            <Rich text={t.fact.a} />
          </div>
        </>
      )}
      <div className="ex-actions">
        <button type="button" className="btn btn-primary" onClick={() => onVerdict({ correct: true, grade: "good", silent: true })}>
          Got it
        </button>
      </div>
    </div>
  );
}

export function ChoiceExercise({ ex, locked, onVerdict }: Props<Extract<Exercise, { kind: "mcType" | "mcName" | "mcSigName" | "mcFact" }>>) {
  const [picked, setPicked] = useState<number | null>(null);
  const started = useRef(Date.now());

  const check = () => {
    if (picked === null || locked) return;
    const correct = picked === ex.answer;
    const fast = Date.now() - started.current < 4000;
    const wrongKey = ex.options[picked].key;
    onVerdict({
      correct,
      grade: correct ? (fast ? "easy" : "good") : "again",
      answer: correct ? undefined : ex.options[ex.answer].code ? <Code code={ex.options[ex.answer].text} /> : <Rich text={ex.options[ex.answer].text} />,
      note: correct ? undefined : (
        <>
          {itemNote(ex.key)}
          {wrongKey && wrongKey !== ex.key && wrongKey.startsWith("i:") && (
            <span className="note-confusion">
              You picked <Code code={itemById.get(wrongKey.slice(2))!.name} />: {shortDesc(itemById.get(wrongKey.slice(2))!)}
            </span>
          )}
        </>
      ),
      confusedWith: correct ? undefined : wrongKey,
    });
  };

  useEnter(!locked, check);
  useEffect(() => {
    if (locked) return;
    const h = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= ex.options.length) setPicked(n - 1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [locked, ex.options.length]);

  return (
    <div className="exercise">
      <h2 className="ex-prompt">
        <Rich text={ex.prompt} />
        {ex.kind === "mcType" && ex.code && (
          <>
            {" "}
            <Code code={ex.code} />?
          </>
        )}
      </h2>
      {ex.kind !== "mcType" && ex.code && <Code block code={ex.code} className="ex-subject" />}
      {ex.rich && (
        <p className="ex-subject ex-subject-text">
          <Rich text={ex.rich} />
        </p>
      )}
      <div className="options" role="radiogroup">
        {ex.options.map((o, i) => {
          const state = locked ? (i === ex.answer ? "right" : i === picked ? "wrong" : "") : i === picked ? "picked" : "";
          return (
            <button
              type="button"
              role="radio"
              aria-checked={i === picked}
              key={i}
              className={`option ${state}`}
              onClick={() => !locked && setPicked(i)}
              disabled={locked}
            >
              <span className="option-num">{i + 1}</span>
              <span className="option-text">{o.code ? <Code code={o.text} /> : <Rich text={o.text} terms={false} />}</span>
            </button>
          );
        })}
      </div>
      {!locked && (
        <div className="ex-actions">
          <button type="button" className="btn btn-primary" disabled={picked === null} onClick={check}>
            Check
          </button>
        </div>
      )}
    </div>
  );
}

function TextAnswer({
  value,
  onChange,
  locked,
  placeholder,
  wide = false,
}: {
  value: string;
  onChange: (v: string) => void;
  locked: boolean;
  placeholder: string;
  wide?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <input
      ref={ref}
      className={`answer-input ${wide ? "wide" : ""}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={locked}
      placeholder={placeholder}
      spellCheck={false}
      autoComplete="off"
      autoCapitalize="off"
    />
  );
}

export function PredictExercise({ ex, locked, onVerdict }: Props<Extract<Exercise, { kind: "predict" }>>) {
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);

  const check = async () => {
    if (!answer.trim() || locked || busy) return;
    setBusy(true);
    const a = answer.trim();
    const r = await runExprs([`(${ex.expr})`, `((${ex.expr}) == (${a}))`]);
    setBusy(false);
    const actual = r && !isGhcError(r.outputs[0]) ? r.outputs[0] : ex.expected;
    const correct = (r?.outputs[1].trim() === "True") || squash(a) === squash(actual) || squash(a) === squash(ex.expected);
    onVerdict({
      correct,
      grade: correct ? "good" : "again",
      answer: correct ? undefined : <Code code={actual} />,
      note: correct ? undefined : itemNote(ex.key),
    });
  };
  useEnter(!locked, check);

  return (
    <div className="exercise">
      <h2 className="ex-prompt">What does GHCi print?</h2>
      <pre className="code-block repl-line">
        <span className="repl-prompt">ghci&gt; </span>
        <Code code={ex.expr} />
      </pre>
      <TextAnswer value={answer} onChange={setAnswer} locked={locked} placeholder="Type the result exactly as GHCi shows it" wide />
      {!locked && (
        <div className="ex-actions">
          <button type="button" className="btn btn-primary" disabled={!answer.trim() || busy} onClick={check}>
            {busy ? "Asking GHCi…" : "Check"}
          </button>
        </div>
      )}
    </div>
  );
}

export function BlankExercise({ ex, locked, onVerdict }: Props<Extract<Exercise, { kind: "blank" }>>) {
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const b = ex.blank;

  const check = async () => {
    if (!answer.trim() || locked || busy) return;
    let a = answer.trim();
    if (b.infix && isOperatorName(a)) a = a.slice(1, -1);
    setBusy(true);
    const r = await runExprs([`((${b.before}${a}${b.after}) == (${b.rhs}))`]);
    setBusy(false);
    const exact = squash(a) === squash(b.answer);
    const correct = exact || r?.outputs[0].trim() === "True";
    onVerdict({
      correct,
      grade: correct ? (exact ? "good" : "hard") : "again",
      heading: correct && !exact ? "That works too" : undefined,
      answer: correct && exact ? undefined : <Code code={b.answer} />,
      note: correct ? (exact ? undefined : <>The one this card is about is <Code code={b.answer} />.</>) : itemNote(ex.key),
    });
  };
  useEnter(!locked, check);

  return (
    <div className="exercise">
      <h2 className="ex-prompt">Fill in the missing name</h2>
      <div className="code-block blank-line">
        <Code code={b.before} />
        <TextAnswer value={answer} onChange={setAnswer} locked={locked} placeholder="?" />
        <Code code={`${b.after} == ${b.rhs}`} />
      </div>
      {!locked && (
        <div className="ex-actions">
          <button type="button" className="btn btn-primary" disabled={!answer.trim() || busy} onClick={check}>
            {busy ? "Asking GHCi…" : "Check"}
          </button>
        </div>
      )}
    </div>
  );
}

export function SigExercise({ ex, locked, onVerdict }: Props<Extract<Exercise, { kind: "sig" }>>) {
  const t = target(ex.key);
  const item = t.t === "item" ? t.item : null;
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const actual = item ? stripCallStack(item.sig) : "";

  const check = async () => {
    if (!item || !answer.trim() || locked || busy) return;
    const a = stripCallStack(answer.trim());
    let verdict: "exact" | "specific" | "wrong" = normalizeSig(a) === normalizeSig(actual) ? "exact" : "wrong";
    if (verdict === "wrong") {
      setBusy(true);
      const r = await runExprs([`:t (${item.name} :: ${a})`, `:t ((undefined :: ${a}) :: ${actual})`]);
      setBusy(false);
      if (r) {
        const instanceOk = !isGhcError(r.outputs[0]) && r.outputs[0].trim() !== "";
        const generalOk = !isGhcError(r.outputs[1]) && r.outputs[1].trim() !== "";
        if (instanceOk && generalOk) verdict = "exact";
        else if (instanceOk) verdict = "specific";
      }
    }
    onVerdict({
      correct: verdict !== "wrong",
      grade: verdict === "exact" ? "easy" : verdict === "specific" ? "hard" : "again",
      heading: verdict === "specific" ? "Almost: the real type is more general" : undefined,
      answer: verdict === "exact" ? undefined : <Code code={`${item.name} :: ${actual}`} />,
      note: verdict === "exact" ? undefined : <Rich text={plainFor(item)?.p ?? item.desc} />,
    });
  };
  useEnter(!locked, check);
  if (!item) return null;

  return (
    <div className="exercise">
      <h2 className="ex-prompt">Write the type from memory</h2>
      <div className="code-block sig-line">
        <Code code={`${item.name} ::`} />
        <TextAnswer value={answer} onChange={setAnswer} locked={locked} placeholder="e.g. (a -> b) -> [a] -> [b]" wide />
      </div>
      <p className="ex-hint">Constraints count. Type variable names don't matter; GHC checks your answer.</p>
      {!locked && (
        <div className="ex-actions">
          <button type="button" className="btn btn-primary" disabled={!answer.trim() || busy} onClick={check}>
            {busy ? "Asking GHC…" : "Check"}
          </button>
        </div>
      )}
    </div>
  );
}

export function MatchExercise({ ex, locked, onVerdict }: Props<Extract<Exercise, { kind: "match" }>>) {
  const rights = useMemo(() => shuffle(ex.pairs.map((p) => p.key)), [ex.id]);
  const [left, setLeft] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [missed, setMissed] = useState<string[]>([]);
  const [flash, setFlash] = useState<string | null>(null);

  const tryPair = (l: string, r: string) => {
    if (l === r) {
      const next = [...done, l];
      setDone(next);
      setLeft(null);
      if (next.length === ex.pairs.length) {
        const perKey = ex.pairs.map((p) => ({ key: p.key, correct: !missed.includes(p.key) }));
        const all = perKey.every((p) => p.correct);
        onVerdict({ correct: all, grade: all ? "good" : "hard", heading: all ? "All matched" : "Matched, with a slip", perKey });
      }
    } else {
      setMissed((m) => [...new Set([...m, l])]);
      setFlash(r);
      setTimeout(() => setFlash(null), 450);
      setLeft(null);
    }
  };

  return (
    <div className="exercise">
      <h2 className="ex-prompt">Match each name to what it does</h2>
      <div className="match-grid">
        <div className="match-col">
          {ex.pairs.map((p) => (
            <button
              type="button"
              key={p.key}
              className={`match-tile ${done.includes(p.key) ? "matched" : left === p.key ? "picked" : ""}`}
              disabled={locked || done.includes(p.key)}
              onClick={() => setLeft(p.key)}
            >
              <Code code={p.left} />
            </button>
          ))}
        </div>
        <div className="match-col">
          {rights.map((k) => {
            const p = ex.pairs.find((x) => x.key === k)!;
            return (
              <button
                type="button"
                key={k}
                className={`match-tile match-desc ${done.includes(k) ? "matched" : flash === k ? "shake" : ""}`}
                disabled={locked || done.includes(k) || left === null}
                onClick={() => left && tryPair(left, k)}
              >
                <Rich text={p.right} terms={false} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function FlipExercise({ ex, onVerdict }: Props<Extract<Exercise, { kind: "flip" }>>) {
  const t = target(ex.key);
  const [shown, setShown] = useState(false);
  useEnter(!shown, () => setShown(true));
  if (t.t !== "fact") return null;
  const grade = (g: Grade) => onVerdict({ correct: g !== "again", grade: g, silent: true });
  return (
    <div className="exercise">
      <p className="ex-label">Say the answer out loud, then check yourself</p>
      <h2 className="ex-prompt">
        <Rich text={t.fact.q} />
      </h2>
      {shown ? (
        <>
          <div className="intro-answer">
            <Rich text={t.fact.a} />
          </div>
          <div className="grade-row">
            <button type="button" className="btn grade-again" onClick={() => grade("again")}>
              Forgot
            </button>
            <button type="button" className="btn grade-hard" onClick={() => grade("hard")}>
              Struggled
            </button>
            <button type="button" className="btn grade-good" onClick={() => grade("good")}>
              Knew it
            </button>
            <button type="button" className="btn grade-easy" onClick={() => grade("easy")}>
              Instantly
            </button>
          </div>
        </>
      ) : (
        <div className="ex-actions">
          <button type="button" className="btn btn-primary" onClick={() => setShown(true)}>
            Show answer
          </button>
        </div>
      )}
    </div>
  );
}

export function ExerciseView(props: Props) {
  const { ex } = props;
  switch (ex.kind) {
    case "intro":
      return <IntroCard {...props} ex={ex} />;
    case "mcType":
    case "mcName":
    case "mcSigName":
    case "mcFact":
      return <ChoiceExercise {...props} ex={ex} />;
    case "predict":
      return <PredictExercise {...props} ex={ex} />;
    case "blank":
      return <BlankExercise {...props} ex={ex} />;
    case "sig":
      return <SigExercise {...props} ex={ex} />;
    case "match":
      return <MatchExercise {...props} ex={ex} />;
    case "flip":
      return <FlipExercise {...props} ex={ex} />;
  }
}
