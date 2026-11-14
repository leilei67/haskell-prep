import { ghciCacheKey } from "./ghci-cache-key";

export interface CachedRun {
  load: string;
  outputs: string[];
  timedOut: boolean;
  truncated: boolean;
}

type CacheFile = { v: 1; entries: Record<string, CachedRun> };

let data: CacheFile | null = null;
let loading: Promise<void> | null = null;

export async function loadGhciCache(): Promise<void> {
  if (data) return;
  if (!loading) {
    loading = (async () => {
      try {
        const url = `${import.meta.env.BASE_URL}ghci-cache.json`;
        const res = await fetch(url, { cache: "force-cache" });
        if (!res.ok) return;
        data = (await res.json()) as CacheFile;
      } catch {
        /* no cache on disk */
      }
    })();
  }
  await loading;
}

export function lookupGhciCache(defs: string, exprs: string[]): CachedRun | null {
  if (!data?.entries) return null;
  const hit = data.entries[ghciCacheKey(defs, exprs)];
  if (!hit) return null;
  return { load: hit.load, outputs: [...hit.outputs], timedOut: hit.timedOut, truncated: hit.truncated };
}