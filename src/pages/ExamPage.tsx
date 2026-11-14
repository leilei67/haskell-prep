import { useEffect, useMemo, useState } from "react";
import { examById, examMarks, exams } from "../content";
import type { Exam, ExamTask } from "../content/schema";
import { Code, Prose } from "../components/Code";
import { Editor } from "../components/Editor";
import { TestResults } from "../components/Steps";
import { type ChallengeResult, runChallengeTests } from "../lib/api";
import { addXp, getState, saveExam, useAppState } from "../lib/store";

interface TaskScore {
  passed: number;
  total: number;
  marks: number;
}

function scoreTasks(exam: Exam, result: ChallengeResult | null): Map<string, TaskScore> {
  const out = new Map<string, TaskScore>();
  let offset = 0;
  for (const t of exam.tasks) {
    const rs = result && !result.compileError ? result.results.slice(offset, offset + t.tests.length) : [];
    const passed = rs.filter((r) => r.pass).length;
    const marks = t.tests.length ? Math.round(((t.marks * passed) / t.tests.length) * 2) / 2 : 0;
    out.set(t.id, { passed, total: t.tests.length, marks });
    offset += t.tests.length;
  }
  return out;
}

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

function useTimer(startedAt?: number, minutes = 180) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!startedAt) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [startedAt]);
  if (!startedAt) return null;
  const left = Math.max(0, minutes * 60_000 - (now - startedAt));
  const h = Math.floor(left / 3600_000);
  const m = Math.floor((left % 3600_000) / 60_000);
  const s = Math.floor((left % 60_000) / 1000);
  const text = h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
  return { left, text };
}

function TaskCard({
  task,
  score,
  result,
  offset,
  open,
  onToggle,
}: {
  task: ExamTask;
  score?: TaskScore;
  result: ChallengeResult | null;
  offset: number;
  open: boolean;
  onToggle: () => void;
}) {
  const [hints, setHints] = useState(0);
  const [solution, setSolution] = useState(false);
  const status = !score || !result ? "" : score.passed === score.total ? "full" : score.passed > 0 ? "part" : "none";
  const taskResult: ChallengeResult | null = result
    ? { ...result, results: result.results.slice(offset, offset + task.tests.length) }
    : null;
  return (
    <li className={`task-card ${status} ${open ? "open" : ""}`}>
      <button type="button" className="task-head" onClick={onToggle} aria-expanded={open}>
        <span className="task-part">{task.part}</span>
        <Code code={task.name} className="task-name" />
        <span className="task-marks">
          {score && result ? `${fmt(score.marks)} / ` : ""}
          {fmt(task.marks)} {task.marks === 1 ? "mark" : "marks"}
        </span>
      </button>
      {open && (
        <div className="task-body">
          <Prose text={task.prompt} />
          <div className="task-help">
            {hints < task.hints.length && (
              <button type="button" className="btn btn-quiet btn-small" onClick={() => setHints((h) => h + 1)}>
                {hints === 0 ? "I'm stuck: give me a hint" : "Another hint"}
              </button>
            )}
            <button type="button" className="btn btn-quiet btn-small" onClick={() => setSolution((s) => !s)}>
              {solution ? "Hide the model answer" : "Show the model answer"}
            </button>
          </div>
          {task.hints.slice(0, hints).map((h, i) => (
            <div key={i} className="ch-hint">
              <strong>Hint {i + 1}.</strong> <Prose text={h} />
            </div>
          ))}
          {solution && (
            <div className="model-answer">
              <p className="muted">One good answer. Read it, close it, then write your own version from memory.</p>
              <Code block code={task.solution.trim()} />
            </div>
          )}
          {taskResult && !taskResult.compileError && (
            <>
              <h4 className="task-tests-title">
                Tests: {score?.passed} of {score?.total} passing
              </h4>
              <TestResults tests={task.tests} result={taskResult} />
            </>
          )}
        </div>
      )}
    </li>
  );
}

export function ExamPage({ id }: { id: string }) {
  const exam = examById.get(id);
  const state = useAppState();
  const saved = exam ? state.exams[exam.id] : undefined;
  const [code, setCode] = useState(() => (exam ? getState().exams[exam.id]?.code || exam.starter.trim() + "\n" : ""));
  const [result, setResult] = useState<ChallengeResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"story" | "tasks" | "given">("story");
  const [openTask, setOpenTask] = useState<string | null>(null);
  const timer = useTimer(saved?.startedAt, exam?.minutes ?? 180);
  const isMini = !!exam && exam.year === 0;
  const total = exam ? examMarks(exam) : 0;
  const allTests = useMemo(() => (exam ? exam.tasks.flatMap((t) => t.tests) : []), [exam]);

  if (!exam) {
    return (
      <div className="page">
        <p>That exam doesn't exist.</p>
        <a href="#/exams">All exams</a>
      </div>
    );
  }

  const scores = scoreTasks(exam, result);
  const earned = [...scores.values()].reduce((n, s) => n + s.marks, 0);
  const offsets = exam.tasks.reduce<number[]>((acc, _t, i) => [...acc, i === 0 ? 0 : acc[i - 1] + exam.tasks[i - 1].tests.length], []);

  const run = async () => {
    if (busy) return;
    saveExam(exam.id, { code });
    setBusy(true);
    const r = await runChallengeTests(code, exam.setup, allTests);
    setBusy(false);
    if (!r) {
      setResult({ compileError: "Haskell isn't ready yet. Wait a moment and try again.", results: [], timedOut: false });
      return;
    }
    setResult(r);
    setTab("tasks");
    const s = [...scoreTasks(exam, r).values()].reduce((n, x) => n + x.marks, 0);
    const prev = getState().exams[exam.id];
    if (s > (prev?.best ?? 0)) addXp(Math.round((s - (prev?.best ?? 0)) * 5));
    saveExam(exam.id, { code, last: s, best: Math.max(s, prev?.best ?? 0), runs: (prev?.runs ?? 0) + 1 });
  };

  const resetCode = () => {
    if (confirm("Start this exam again from the blank template? Your current code will be replaced.")) {
      const fresh = exam.starter.trim() + "\n";
      setCode(fresh);
      setResult(null);
      saveExam(exam.id, { code: fresh, startedAt: undefined });
    }
  };

  return (
    <div className="exam-page">
      <header className="exam-head">
        <a className="back" href={isMini ? "#/" : "#/exams"}>
          {isMini ? "Back to the path" : "All exams"}
        </a>
        <h1 className="page-title">{isMini ? exam.title : `${exam.year}: ${exam.title}`}</h1>
        <p className="page-lede">{exam.summary}</p>
        <div className="exam-meta">
          <span>
            {exam.tasks.length} functions, {fmt(total)} marks
            {exam.minutes ? ` · ${exam.minutes} min` : ""}
          </span>
          {saved?.best ? <span>Best score {fmt(saved.best)} / {fmt(total)}</span> : <span>Not attempted yet</span>}
          {timer ? (
            <span className={timer.left === 0 ? "timer over" : "timer"}>{timer.left === 0 ? "Time's up" : `${timer.text} left`}</span>
          ) : (
            <button type="button" className="btn btn-secondary btn-small" onClick={() => saveExam(exam.id, { startedAt: Date.now() })}>
              Start a {exam.minutes ?? 180}-minute timed attempt
            </button>
          )}
        </div>
      </header>

      <div className="exam-grid">
        <section className="exam-spec">
          <div className="tabs" role="tablist">
            {(["story", "tasks", "given"] as const).map((t) => (
              <button key={t} type="button" role="tab" aria-selected={tab === t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                {t === "story" ? "The problem" : t === "tasks" ? "What to write" : "Given code"}
              </button>
            ))}
          </div>
          {tab === "story" && (
            <div className="exam-story">
              <Prose text={exam.story} />
              {exam.notes && (
                <div className="exam-notes">
                  <h3 className="ex-part-title">How to approach this paper</h3>
                  <Prose text={exam.notes} />
                </div>
              )}
              <button type="button" className="btn btn-primary" onClick={() => setTab("tasks")}>
                See what to write
              </button>
            </div>
          )}
          {tab === "given" && (
            <div>
              <p className="muted">
                This is already in the file you're writing (types, helpers and example data). You can use any of it. Don't copy it into your answer.
              </p>
              <Code block code={exam.setup.trim()} />
            </div>
          )}
          {tab === "tasks" && (
            <ol className="task-list">
              {exam.tasks.map((t, i) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  score={scores.get(t.id)}
                  result={result}
                  offset={offsets[i]}
                  open={openTask === t.id}
                  onToggle={() => setOpenTask(openTask === t.id ? null : t.id)}
                />
              ))}
            </ol>
          )}
        </section>

        <section className="exam-work">
          <div className="pg-bar">
            <span>Your answer file</span>
            <button type="button" className="btn btn-quiet btn-small" onClick={resetCode}>
              Start again
            </button>
          </div>
          <Editor
            value={code}
            onChange={(v) => {
              setCode(v);
              saveExam(exam.id, { code: v });
            }}
            onRun={run}
            label="Your exam answers"
            rows={26}
          />
          <div className="ch-run">
            <button type="button" className="btn btn-primary" onClick={run} disabled={busy}>
              {busy ? "Compiling and marking…" : "Mark my exam (⌘↵)"}
            </button>
            {result && !result.compileError && (
              <span className="exam-score">
                {fmt(earned)} / {fmt(total)}
              </span>
            )}
          </div>
          {result?.compileError && (
            <>
              <p className="step-wrong">
                The file doesn't compile, so this would score 0. Fix the error, or comment the broken function out and put back its `= undefined` stub.
              </p>
              <pre className="load-msg err">{result.compileError}</pre>
            </>
          )}
          {result && !result.compileError && (
            <ul className="score-strip">
              {exam.tasks.map((t) => {
                const s = scores.get(t.id)!;
                return (
                  <li key={t.id} className={s.passed === s.total ? "full" : s.passed > 0 ? "part" : "none"}>
                    <button
                      type="button"
                      onClick={() => {
                        setTab("tasks");
                        setOpenTask(t.id);
                      }}
                    >
                      <span>{t.name}</span>
                      <span>
                        {fmt(s.marks)}/{fmt(t.marks)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export function ExamsPage() {
  const state = useAppState();
  const list = exams;
  return (
    <div className="page exams">
      <h1 className="page-title">Past exams</h1>
      <p className="page-lede">
        Every past paper as a mock exam: the problem explained from scratch, the given code, hints and model answers for every function, and real marking.
        Do the newest papers last; they match the current format best.
      </p>
      <ul className="exam-cards">
        {list.map((e) => {
          const s = state.exams[e.id];
          const total = examMarks(e);
          return (
            <li key={e.id}>
              <a href={`#/exam/${e.id}`} className="exam-card">
                <span className="exam-year">{e.year}</span>
                <span className="exam-title">{e.title}</span>
                <span className="exam-summary">{e.summary}</span>
                <span className="exam-skills">{e.skills.slice(0, 5).join(", ")}</span>
                <span className={`exam-best ${s?.best && s.best >= total ? "full" : ""}`}>
                  {s?.best ? `Best: ${fmt(s.best)} / ${fmt(total)}` : `${fmt(total)} marks`}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
