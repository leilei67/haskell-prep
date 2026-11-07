import { useEffect, useState } from "react";

export function useRoute(): string[] {
  const [hash, setHash] = useState(location.hash || "#/");
  useEffect(() => {
    const h = () => {
      setHash(location.hash || "#/");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  return hash.slice(1).split("/").filter(Boolean).map(decodeURIComponent);
}

export const go = (path: string) => {
  location.hash = path;
};

export function relativeDue(due: number, now = Date.now()): string {
  const diff = due - now;
  if (diff <= 0) return "due now";
  const min = Math.round(diff / 60_000);
  if (min < 60) return `in ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `in ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "tomorrow" : `in ${d} days`;
}
