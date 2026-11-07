import type { Mem } from "../lib/srs";
import { STRENGTH_LABELS, strength } from "../lib/srs";

export function Strength({ mem }: { mem: Mem | undefined }) {
  const s = strength(mem);
  return (
    <span className="strength" title={STRENGTH_LABELS[s]} aria-label={`Memory: ${STRENGTH_LABELS[s]}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= s ? "pip on" : "pip"} />
      ))}
    </span>
  );
}

export function Meter({ value, max, tone = "plum" }: { value: number; max: number; tone?: "plum" | "sun" | "right" }) {
  const pct = max === 0 ? 0 : Math.min(100, (value / max) * 100);
  return (
    <span className={`meter meter-${tone}`} role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      <span style={{ width: `${pct}%` }} />
    </span>
  );
}
