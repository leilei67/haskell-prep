import { useRef, useState } from "react";
import { exportProgress, importProgress, resetProgress, restartPlan, setDailyGoal, useAppState } from "../lib/store";

const GOALS = [
  { xp: 60, label: "Light: about 10 minutes" },
  { xp: 150, label: "Steady: about 25 minutes" },
  { xp: 300, label: "Cramming: about 50 minutes" },
  { xp: 500, label: "All in: over an hour" },
];

export function SettingsPage() {
  const state = useAppState();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");

  const download = () => {
    const blob = new Blob([exportProgress()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `haskell-prep-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const upload = async (file: File) => {
    try {
      importProgress(await file.text());
      setMsg("Progress imported.");
    } catch {
      setMsg("That file isn't a Haskell Prep progress file.");
    }
  };

  return (
    <div className="page settings">
      <h1 className="page-title">Settings</h1>

      <section className="section">
        <h2 className="section-title">Daily goal</h2>
        <div className="goal-list" role="radiogroup">
          {GOALS.map((g) => (
            <label key={g.xp} className={`goal ${state.dailyGoal === g.xp ? "picked" : ""}`}>
              <input type="radio" name="goal" checked={state.dailyGoal === g.xp} onChange={() => setDailyGoal(g.xp)} />
              <span className="goal-xp">{g.xp} XP</span>
              <span>{g.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Week plan</h2>
        <p>Your 7-day plan started on {state.startDate}.</p>
        <button type="button" className="btn btn-secondary" onClick={restartPlan}>
          Start the 7 days again from today
        </button>
      </section>

      <section className="section">
        <h2 className="section-title">Your progress</h2>
        <p>Progress is saved in this browser. Export it to move it to another browser or keep a backup.</p>
        <div className="settings-row">
          <button type="button" className="btn btn-secondary" onClick={download}>
            Export progress
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => fileRef.current?.click()}>
            Import progress
          </button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              if (confirm("Erase all progress, XP and your streak? This can't be undone.")) {
                resetProgress();
                setMsg("Progress erased.");
              }
            }}
          >
            Erase progress
          </button>
        </div>
        {msg && <p className="muted">{msg}</p>}
      </section>
    </div>
  );
}
