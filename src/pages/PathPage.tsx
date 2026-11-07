import { bookQuestionCount, books, drillSetsForLesson, examMarks, exams, minis, mixed, tracks } from "../content";
import type { Book, DrillSet, Lesson } from "../content/schema";
import { Rich } from "../components/Code";
import { Meter } from "../components/Strength";
import { go } from "../lib/router";
import { dueDrillKeys } from "./DrillPage";
import { currentStreak, dayKey, useAppState } from "../lib/store";

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

function practised(set: DrillSet, mem: Record<string, unknown>) {
  return set.drills.filter((_, i) => mem[`d:${set.id}:${i}`]).length;
}

function LessonGrid({ lessons, start }: { lessons: Lesson[]; start: number }) {
  const state = useAppState();
  const next = lessons.find((l) => !state.lessons[l.id]?.done);
  return (
    <ol className="lesson-list" style={{ counterReset: `lesson ${start}` }}>
      {lessons.map((l) => {
        const done = state.lessons[l.id]?.done;
        const set = drillSetsForLesson(l.id)[0];
        const n = set ? practised(set, state.mem) : 0;
        return (
          <li key={l.id} className={`lesson-row ${done ? "done" : ""} ${next?.id === l.id ? "next" : ""}`}>
            <a href={`#/lesson/${l.id}`}>
              <span className="lesson-title">{l.title}</span>
              <span className="lesson-blurb">
                <Rich text={l.blurb} terms={false} />
              </span>
            </a>
            {set && done && (
              <a className="lesson-practice" href={`#/drill/${set.id}`}>
                Practise ({n}/{set.drills.length})
              </a>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function LevelLinks({ sets }: { sets: DrillSet[] }) {
  const state = useAppState();
  return (
    <ul className="level-list">
      {sets.map((s) => {
        const n = practised(s, state.mem);
        const cls = n >= s.drills.length ? "full" : n > 0 ? "part" : "";
        return (
          <li key={s.id}>
            <a href={`#/drill/${s.id}`} className={cls}>
              <span className="level-title">{s.title}</span>
              <span className="level-count">
                {n}/{s.drills.length}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function BookBlock({ book }: { book: Book }) {
  return (
    <div className="book-block">
      <h3 className="book-title">
        Book {book.order}. {book.title}
      </h3>
      <p className="book-blurb">{book.blurb}</p>
      <LevelLinks sets={book.sets} />
    </div>
  );
}

export function PathPage() {
  const state = useAppState();
  const due = dueDrillKeys().length;
  const xpToday = state.xpByDay[dayKey()] ?? 0;
  const streak = currentStreak(state);
  const allLessons = tracks.flatMap((t) => t.lessons);
  const lessonsDone = allLessons.filter((l) => state.lessons[l.id]?.done).length;
  const nextLesson = allLessons.find((l) => !state.lessons[l.id]?.done);
  const examTotal = exams.reduce((n, e) => n + examMarks(e), 0);
  const examBest = exams.reduce((n, e) => n + (state.exams[e.id]?.best ?? 0), 0);
  const examsByAge = [...exams].sort((a, b) => a.year - b.year);
  const nextMini = minis.find((e) => (state.exams[e.id]?.best ?? 0) < examMarks(e));
  const nextExam = examsByAge.find((e) => (state.exams[e.id]?.best ?? 0) < examMarks(e));
  const bookQs = books.reduce((n, b) => n + bookQuestionCount(b), 0) + mixed.reduce((n, s) => n + s.drills.length, 0);
  const bookDone =
    [...books.flatMap((b) => b.sets), ...mixed].reduce((n, s) => n + practised(s, state.mem), 0);
  const miniTotal = minis.reduce((n, e) => n + examMarks(e), 0);
  const miniBest = minis.reduce((n, e) => n + (state.exams[e.id]?.best ?? 0), 0);

  const nextBookSet = [...books.flatMap((b) => b.sets), ...mixed].find((s) => practised(s, state.mem) < s.drills.length);

  return (
    <div className="path-page">
      <section className="path" aria-label="Course">
        <p className="course-sig" aria-label="The course: Foundations, exam skills, exercise books, mini papers, past exams, full marks">
          <span className="tk-plain">pass</span> <span className="tk-op">::</span> <span className="tk-type">Foundations</span>{" "}
          <span className="tk-op">-&gt;</span> <span className="tk-type">Skills</span> <span className="tk-op">-&gt;</span>{" "}
          <span className="tk-type">Books</span> <span className="tk-op">-&gt;</span> <span className="tk-type">Minis</span>{" "}
          <span className="tk-op">-&gt;</span> <span className="tk-type">PastExams</span> <span className="tk-op">-&gt;</span>{" "}
          <span className="tk-type">FullMarks</span>
        </p>

        {tracks.map((t, i) => (
          <div className="track" key={t.id}>
            <h2 className="foundations-title">
              {i + 1}. {t.title}
            </h2>
            <p className="path-intro">{t.blurb}</p>
            <LessonGrid lessons={t.lessons} start={0} />
          </div>
        ))}

        <div className="track">
          <h2 className="foundations-title">3. Exercise books</h2>
          <p className="path-intro">
            Graded drills that ramp like an A-level textbook: warm-up, standard, stretch, then exam wording. Work each level in order. {bookQs} questions across {books.length} books
            {mixed.length ? ` and ${mixed.length} mixed sets` : ""}.
          </p>
          {books.map((b) => (
            <BookBlock key={b.id} book={b} />
          ))}
          {mixed.length > 0 && (
            <div className="book-block">
              <h3 className="book-title">Mixed exercises</h3>
              <p className="book-blurb">Unlabelled questions that mix the books you have already done. Spot which tool fits.</p>
              <LevelLinks sets={mixed} />
            </div>
          )}
        </div>

        <div className="track">
          <h2 className="foundations-title">4. Mini papers</h2>
          <p className="path-intro">
            Short mocks in the real exam shape: a story, given types, then functions to write. They start at 30 minutes and grow toward a full paper.
          </p>
          <ul className="exam-mini">
            {minis.map((e) => {
              const best = state.exams[e.id]?.best ?? 0;
              const total = examMarks(e);
              return (
                <li key={e.id}>
                  <a href={`#/exam/${e.id}`} className={best >= total ? "full" : best > 0 ? "part" : ""}>
                    <span className="exam-year">M{e.difficulty ?? 0}</span>
                    <span className="exam-title">{e.title.replace(/^Mini paper \d+:\s*/i, "")}</span>
                    <span className="exam-best">
                      {best ? `${fmt(best)}/${fmt(total)}` : `${e.minutes ?? 30} min · ${fmt(total)} marks`}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="track">
          <h2 className="foundations-title">5. Past exams</h2>
          <p className="path-intro">
            All {exams.length} past papers as mock exams with real marking. Start once the books and minis feel easy; begin with the older ones.
          </p>
          <ul className="exam-mini">
            {examsByAge.map((e) => {
              const best = state.exams[e.id]?.best ?? 0;
              const total = examMarks(e);
              return (
                <li key={e.id}>
                  <a href={`#/exam/${e.id}`} className={best >= total ? "full" : best > 0 ? "part" : ""}>
                    <span className="exam-year">{e.year}</span>
                    <span className="exam-title">{e.title}</span>
                    <span className="exam-best">{best ? `${fmt(best)}/${fmt(total)}` : `${fmt(total)} marks`}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <aside className="today" aria-label="Today">
        <div className="today-block today-actions">
          {nextLesson ? (
            <button type="button" className="btn btn-primary btn-wide" onClick={() => go(`/lesson/${nextLesson.id}`)}>
              Next lesson: {nextLesson.title}
            </button>
          ) : nextBookSet ? (
            <button type="button" className="btn btn-primary btn-wide" onClick={() => go(`/drill/${nextBookSet.id}`)}>
              Next drill: {nextBookSet.title}
            </button>
          ) : nextMini ? (
            <button type="button" className="btn btn-primary btn-wide" onClick={() => go(`/exam/${nextMini.id}`)}>
              Next mini: {nextMini.title.replace(/^Mini paper \d+:\s*/i, "")}
            </button>
          ) : nextExam ? (
            <button type="button" className="btn btn-primary btn-wide" onClick={() => go(`/exam/${nextExam.id}`)}>
              Next exam: {nextExam.year}
            </button>
          ) : null}
          <button type="button" className="btn btn-secondary btn-wide" disabled={due === 0 && Object.keys(state.mem).length === 0} onClick={() => go(`/review/${Date.now()}`)}>
            {due > 0 ? `Review ${due} due question${due === 1 ? "" : "s"}` : "Mixed review"}
          </button>
        </div>

        <div className="today-block">
          <h2 className="today-title">Progress</h2>
          <p className="today-line">
            {lessonsDone} of {allLessons.length} lessons done
          </p>
          <Meter value={lessonsDone} max={allLessons.length} />
          {bookQs > 0 && (
            <>
              <p className="today-line today-gap">
                Book drills: {bookDone} of {bookQs}
              </p>
              <Meter value={bookDone} max={bookQs} />
            </>
          )}
          {minis.length > 0 && (
            <>
              <p className="today-line today-gap">
                Minis: {fmt(miniBest)} of {fmt(miniTotal)} marks
              </p>
              <Meter value={miniBest} max={miniTotal} />
            </>
          )}
          <p className="today-line today-gap">
            Exams: {fmt(examBest)} of {fmt(examTotal)} marks across all papers
          </p>
          <Meter value={examBest} max={examTotal} tone="right" />
        </div>

        <div className="today-block today-stats">
          <div>
            <span className="big-num">{streak}</span>
            <span className="big-label">day streak (best {state.streak.best})</span>
          </div>
          <div>
            <span className="big-num">{xpToday}</span>
            <span className="big-label">of {state.dailyGoal} XP today</span>
            <Meter value={xpToday} max={state.dailyGoal} tone="sun" />
          </div>
        </div>
      </aside>
    </div>
  );
}
