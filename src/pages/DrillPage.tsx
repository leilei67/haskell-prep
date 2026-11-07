import { useRef, useState } from "react";
import { bookOfSet, drillFromKey, drillKey, drillSetById, lessonById } from "../content";
import type { DrillStep } from "../content/schema";
import { Prose } from "../components/Code";
import { StepView } from "../components/Steps";
import { Meter } from "../components/Strength";
import { go } from "../lib/router";
import { retrievability } from "../lib/srs";
import { addXp, getState, recordReview } from "../lib/store";

interface Item {
  key: string;
  drill: DrillStep;
  retry: boolean;
}

const shuffle = <T,>(xs: T[]) => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export function dueDrillKeys(now = Date.now()) {
  const s = getState();
  return Object.entries(s.mem)
    .filter(([k, m]) => k.startsWith("d:") && m.due <= now && drillFromKey(k))
    .sort((a, b) => a[1].due - b[1].due)
    .map(([k]) => k);
}

function buildQueue(mode: "set" | "review", setId?: string): { title: string; items: Item[] } | null {
  if (mode === "set") {
    const set = setId ? drillSetById.get(setId) : undefined;
    if (!set) return null;
    const s = getState();
    const items = set.drills.map((drill, i) => ({ key: drillKey(set.id, i), drill, retry: false }));
    const fresh = items.filter((it) => !s.mem[it.key]);
    const seen = items
      .filter((it) => s.mem[it.key])
      .sort((a, b) => retrievability(s.mem[a.key], Date.now()) - retrievability(s.mem[b.key], Date.now()));
    const cap = set.lesson ? 12 : set.drills.length;
    return { title: set.title, items: [...fresh, ...seen].slice(0, cap) };
  }
  const due = dueDrillKeys();
  let keys = due.slice(0, 15);
  if (keys.length < 8) {
    const s = getState();
    const weakest = Object.keys(s.mem)
      .filter((k) => k.startsWith("d:") && !keys.includes(k) && drillFromKey(k))
      .sort((a, b) => retrievability(s.mem[a], Date.now()) - retrievability(s.mem[b], Date.now()));
    keys = [...keys, ...weakest.slice(0, 8 - keys.length)];
  }
  const items = shuffle(keys)
    .map((key) => ({ key, drill: drillFromKey(key)!.drill, retry: false }));
  return { title: due.length ? "Review: questions due today" : "Review: your weakest questions", items };
}

export function DrillPage({ mode, setId }: { mode: "set" | "review"; setId?: string }) {
  const [plan] = useState(() => buildQueue(mode, setId));
  const [queue, setQueue] = useState<Item[]>(plan?.items ?? []);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const firstTry = useRef(new Map<string, boolean>());
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

  if (!plan || plan.items.length === 0) {
    return (
      <div className="session session-empty">
        <p>{mode === "review" ? "Nothing to review yet. Finish a lesson and practise it first." : "That practice set doesn't exist."}</p>
        <button type="button" className="btn btn-primary" onClick={() => go("/")}>
          Back to the path
        </button>
      </div>
    );
  }

  const set = setId ? drillSetById.get(setId) : undefined;
  const lesson = set ? lessonById.get(set.lesson) : undefined;
  const book = set ? bookOfSet.get(set.id) : undefined;
  const nextSet = book && set ? book.sets[book.sets.findIndex((s) => s.id === set.id) + 1] : undefined;

  if (index >= queue.length) {
    const results = [...firstTry.current.values()];
    const right = results.filter(Boolean).length;
    return (
      <div className="session session-summary">
        <h1 className="summary-title">{right === results.length ? "Clean sheet" : "Practice done"}</h1>
        <p className="muted">{plan.title}</p>
        <dl className="summary-stats">
          <div>
            <dt>Right first time</dt>
            <dd>
              {right}/{results.length}
            </dd>
          </div>
          <div>
            <dt>XP earned</dt>
            <dd>{xp}</dd>
          </div>
        </dl>
        <p className="summary-note">Questions you missed are scheduled to come back sooner. Ones you got right come back in a day, then a few days, then a week.</p>
        <div className="summary-actions">
          {nextSet && (
            <button type="button" className="btn btn-primary" onClick={() => go(`/drill/${nextSet.id}`)}>
              Next: {nextSet.title}
            </button>
          )}
          {mode === "set" && set && (
            <button type="button" className={`btn ${nextSet ? "btn-secondary" : "btn-primary"}`} onClick={() => go(`/drill/${set.id}/${Date.now()}`)}>
              More from this set
            </button>
          )}
          <button type="button" className="btn btn-secondary" onClick={() => go(`/review/${Date.now()}`)}>
            Mixed review
          </button>
          {lesson && (
            <button type="button" className="btn btn-quiet" onClick={() => go(`/lesson/${lesson.id}`)}>
              Re-read the lesson
            </button>
          )}
          <button type="button" className="btn btn-quiet" onClick={() => go("/")}>
            Back to the path
          </button>
        </div>
      </div>
    );
  }

  const item = queue[index];

  const onDone = (ok: boolean) => {
    if (!firstTry.current.has(item.key)) {
      firstTry.current.set(item.key, ok);
      recordReview(item.key, ok ? "good" : "again");
      if (!ok) setQueue((q) => [...q, { ...item, retry: true }]);
    }
    const gain = ok ? 10 + Math.min(streak, 5) * 2 : 3;
    addXp(gain);
    setXp((x) => x + gain);
    setStreak((s) => (ok ? s + 1 : 0));
    setDone(true);
  };

  const next = () => {
    setDone(false);
    setIndex((i) => i + 1);
    window.scrollTo(0, 0);
  };

  return (
    <div className="session lesson">
      <header className="session-top">
        <button type="button" className="btn btn-quiet btn-small" onClick={() => go("/")}>
          Leave
        </button>
        <Meter value={index} max={queue.length} />
        <span className={`combo ${streak >= 3 ? "hot" : ""}`}>{streak >= 2 ? `${streak} in a row` : `${index + 1} / ${queue.length}`}</span>
      </header>
      <div className="session-body">
        <p className="session-title">
          {book ? `${book.title} · ${plan.title}` : plan.title}
          {item.retry && <span className="muted"> (second go at one you missed)</span>}
          {mode === "review" && !item.retry && <span className="muted"> {drillFromKey(item.key)?.set.title}</span>}
        </p>
        {index === 0 && !item.retry && set?.intro && (
          <div className="drill-intro">
            <Prose text={set.intro} />
          </div>
        )}
        <StepView key={`${item.key}-${index}`} step={item.drill} onDone={onDone} />
        <div className="lesson-nav">
          <button type="button" className="btn btn-primary lesson-continue" onClick={next} disabled={!done}>
            {index + 1 === queue.length ? "Finish" : "Next question"}
          </button>
        </div>
      </div>
    </div>
  );
}
