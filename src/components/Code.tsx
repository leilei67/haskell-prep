import { Fragment, type ReactNode } from "react";
import { tokenize } from "../lib/haskell";
import { glossary, glossaryTerms } from "../data/glossary";

export function Code({ code, block = false, className = "" }: { code: string; block?: boolean; className?: string }) {
  const tokens = tokenize(code).map((t, i) =>
    t.kind === "plain" || t.kind === "punct" ? (
      <Fragment key={i}>{t.text}</Fragment>
    ) : (
      <span key={i} className={`tk-${t.kind}`}>
        {t.text}
      </span>
    ),
  );
  if (block) return <pre className={`code-block ${className}`}>{tokens}</pre>;
  return <code className={`code ${className}`}>{tokens}</code>;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const TERM_RE = new RegExp(`(?<![\\w-])(${glossaryTerms.map(escapeRe).join("|")})(?:s|es)?(?![\\w-])`, "gi");
const termKey = new Map(glossaryTerms.map((t) => [t.toLowerCase(), t]));

function Term({ word, term }: { word: string; term: string }) {
  return (
    <span className="term" tabIndex={0}>
      {word}
      <span className="term-pop" role="tooltip">
        <strong>{term}</strong>: <Rich text={glossary[term]} terms={false} />
      </span>
    </span>
  );
}

function withTerms(text: string, used: Set<string>): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TERM_RE)) {
    const term = termKey.get(m[1].toLowerCase());
    if (!term || used.has(term)) continue;
    used.add(term);
    out.push(text.slice(last, m.index));
    out.push(<Term key={m.index} word={m[0]} term={term} />);
    last = m.index! + m[0].length;
  }
  out.push(text.slice(last));
  return out;
}

function emphasis(text: string, terms: boolean, used: Set<string>): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|(?<![\w*])\*[^\s*](?:[^*]*[^\s*])?\*(?![\w*]))/).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4)
      return <strong key={i}>{terms ? withTerms(part.slice(2, -2), used) : part.slice(2, -2)}</strong>;
    if (/^\*[^*].*\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
    return <Fragment key={i}>{terms ? withTerms(part, used) : part}</Fragment>;
  });
}

export function Rich({ text, terms = true, seen }: { text: string; terms?: boolean; seen?: Set<string> }) {
  const used = seen ?? new Set<string>();
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.split(/(``[^`]+``|`[^`]+`)/).map((part, i) => {
            if (part.startsWith("``")) return <Code key={i} code={part.slice(2, -2)} />;
            if (part.startsWith("`") && part.endsWith("`") && part.length > 1) return <Code key={i} code={part.slice(1, -1)} />;
            return <Fragment key={i}>{emphasis(part, terms, used)}</Fragment>;
          })}
        </Fragment>
      ))}
    </>
  );
}

type Block = { kind: "p" | "ul" | "ol" | "h"; lines: string[]; level?: number };

function blocks(text: string): Block[] {
  const out: Block[] = [];
  for (const para of text.split(/\n\s*\n/)) {
    let cur: Block | null = null;
    for (const raw of para.split("\n")) {
      const line = raw.trimEnd();
      if (!line.trim()) continue;
      const h = /^(#{1,4})\s+(.*)$/.exec(line);
      const ul = /^\s*[-*•]\s+(.*)$/.exec(line);
      const ol = /^\s*\d+[.)]\s+(.*)$/.exec(line);
      if (h) {
        out.push({ kind: "h", lines: [h[2]], level: h[1].length });
        cur = null;
      } else if (ul) {
        if (cur?.kind !== "ul") out.push((cur = { kind: "ul", lines: [] }));
        cur.lines.push(ul[1]);
      } else if (ol) {
        if (cur?.kind !== "ol") out.push((cur = { kind: "ol", lines: [] }));
        cur.lines.push(ol[1]);
      } else if (cur && (cur.kind === "ul" || cur.kind === "ol") && /^\s{2,}/.test(raw)) {
        cur.lines[cur.lines.length - 1] += " " + line.trim();
      } else {
        if (cur?.kind !== "p") out.push((cur = { kind: "p", lines: [] }));
        cur.lines.push(line.trim());
      }
    }
  }
  return out;
}

export function Prose({ text }: { text: string }) {
  const seen = new Set<string>();
  const parts = text.split(/```[a-z]*\n?([\s\S]*?)\n?```/);
  return (
    <div className="prose">
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <Code key={i} block code={part} />
        ) : (
          blocks(part).map((b, j) => {
            const key = `${i}-${j}`;
            if (b.kind === "h") return <h4 key={key} className="prose-h"><Rich text={b.lines[0]} seen={seen} /></h4>;
            if (b.kind === "ul" || b.kind === "ol") {
              const items = b.lines.map((l, k) => (
                <li key={k}>
                  <Rich text={l} seen={seen} />
                </li>
              ));
              return b.kind === "ul" ? <ul key={key}>{items}</ul> : <ol key={key}>{items}</ol>;
            }
            return (
              <p key={key}>
                <Rich text={b.lines.join("\n")} seen={seen} />
              </p>
            );
          })
        ),
      )}
    </div>
  );
}
