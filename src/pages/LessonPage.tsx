import { useEffect, useRef, useState } from "react";
import { drillSetsForLesson, lessonById, trackOfLesson } from "../content";
import { StepView } from "../components/Steps";
import { Meter } from "../components/Strength";
import { go } from "../lib/router";
import { addXp, completeLesson } from "../lib/store";

export function LessonPage({ id }: { id: string }) {
  const lesson = lessonById.get(id);
  const track = trackOfLesson.get(id);
  const [index, setIndex] = useState(0);
  const [doneSteps, setDoneSteps] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);
  const xpGiven = useRef(false);

  const step = lesson?.steps[index];
  const canContinue = step ? step.k === "read" || doneSteps.has(index) : false;

  const next = () => {
    if (!lesson || !canContinue) return;
    if (index + 1 < lesson.steps.length) {
      setIndex(index + 1);
      window.scrollTo(0, 0);
    } else {
      if (!xpGiven.current) {
        xpGiven.current = true;
        if (completeLesson(lesson.id)) addXp(25);
      }
      setFinished(true);
    }
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (e.key !== "Enter" || el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) return;
      if (el instanceof HTMLButtonElement && !el.classList.contains("lesson-continue")) return;
      e.preventDefault();
      next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  if (!lesson || !step || !track) {
    return (
      <div className="session session-empty">
        <p>That lesson doesn't exist.</p>
        <button type="button" className="btn btn-primary" onClick={() => go("/")}>
          Back to the path
        </button>
      </div>
    );
  }

  const order = track.lessons.findIndex((l) => l.id === lesson.id);
  const following = track.lessons[order + 1];
  const practice = drillSetsForLesson(lesson.id)[0];

  if (finished) {
    return (
      <div className="session session-summary">
        <h1 className="summary-title">Lesson done</h1>
        <p className="muted">
          {track.title} {order + 1}: {lesson.title}
        </p>
        {practice && (
          <p className="summary-note">
            Now lock it in: {practice.drills.length} practice questions on exactly this lesson. Questions you get wrong come back later until they stick.
          </p>
        )}
        <div className="summary-actions">
          {practice && (
            <button type="button" className="btn btn-primary" onClick={() => go(`/drill/${practice.id}`)}>
              Practise this lesson
            </button>
          )}
          {following && (
            <button type="button" className={practice ? "btn btn-secondary" : "btn btn-primary"} onClick={() => go(`/lesson/${following.id}`)}>
              Next: {following.title}
            </button>
          )}
          <button type="button" className="btn btn-quiet" onClick={() => go("/")}>
            Back to the path
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="session lesson">
      <header className="session-top">
        <button type="button" className="btn btn-quiet btn-small" onClick={() => go("/")}>
          Leave
        </button>
        <Meter value={index} max={lesson.steps.length} />
        <span className="combo">
          {index + 1} / {lesson.steps.length}
        </span>
      </header>
      <div className="session-body">
        <p className="session-title">
          {track.title} {order + 1}: {lesson.title}
        </p>
        <StepView key={`${lesson.id}-${index}`} step={step} onDone={() => setDoneSteps((s) => new Set(s).add(index))} />
        <div className="lesson-nav">
          {index > 0 && (
            <button type="button" className="btn btn-quiet" onClick={() => setIndex(index - 1)}>
              Back
            </button>
          )}
          <button type="button" className="btn btn-primary lesson-continue" onClick={next} disabled={!canContinue}>
            {index + 1 === lesson.steps.length ? "Finish lesson" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
