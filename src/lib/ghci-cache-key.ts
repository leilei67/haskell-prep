/** Stable cache key for (defs + expressions), same in browser and Node. */
export function ghciCacheKey(defs: string, exprs: string[]): string {
  let h = 2166136261;
  const s = `${defs.trim()}\0${exprs.join("\0")}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}