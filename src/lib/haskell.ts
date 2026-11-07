const OP_CHARS = "!#$%&*+./<=>?@\\^|-~:";

export const isOperatorName = (name: string) => name.startsWith("(") && name.endsWith(")");
export const bareName = (name: string) => (isOperatorName(name) ? name.slice(1, -1) : name);

function scanTopLevel(s: string, visit: (i: number) => void) {
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '"') {
      i++;
      while (i < s.length && s[i] !== '"') {
        if (s[i] === "\\") i++;
        i++;
      }
      continue;
    }
    if (c === "'" && s[i + 2] === "'" && s[i + 1] !== "\\") {
      i += 2;
      continue;
    }
    if (c === "'" && s[i + 1] === "\\") {
      const j = s.indexOf("'", i + 2);
      if (j > 0) {
        i = j;
        continue;
      }
    }
    if ("([{".includes(c)) depth++;
    else if (")]}".includes(c)) depth--;
    else if (depth === 0) visit(i);
  }
}

export function splitTopEq(s: string): { lhs: string; rhs: string } | null {
  let last = -1;
  scanTopLevel(s, (i) => {
    if (s.startsWith(" == ", i)) last = i;
  });
  if (last < 0) return null;
  return { lhs: s.slice(0, last).trim(), rhs: s.slice(last + 4).trim() };
}

export function splitTop(s: string, sep: string): string[] {
  const cuts: number[] = [];
  scanTopLevel(s, (i) => {
    if (s.startsWith(sep, i)) cuts.push(i);
  });
  const parts: string[] = [];
  let start = 0;
  for (const c of cuts) {
    if (c < start) continue;
    parts.push(s.slice(start, c));
    start = c + sep.length;
  }
  parts.push(s.slice(start));
  return parts.map((p) => p.trim());
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function findName(code: string, name: string): number {
  const token = bareName(name);
  if (isOperatorName(name)) {
    let from = 0;
    while (true) {
      const i = code.indexOf(token, from);
      if (i < 0) return -1;
      const before = code[i - 1] ?? " ";
      const after = code[i + token.length] ?? " ";
      if (!OP_CHARS.includes(before) && !OP_CHARS.includes(after)) return i;
      from = i + 1;
    }
  }
  const m = new RegExp(`(?<![\\w'.])${escapeRe(token)}(?![\\w'])`).exec(code);
  return m ? m.index : -1;
}

export interface Blank {
  before: string;
  after: string;
  rhs: string;
  answer: string;
  infix: boolean;
}

export function makeBlank(name: string, ex: string): Blank | null {
  const split = splitTopEq(ex);
  if (!split) return null;
  const idx = findName(split.lhs, name);
  if (idx < 0) return null;
  const token = bareName(name);
  const infix = isOperatorName(name) && split.lhs[idx - 1] !== "(";
  return {
    before: split.lhs.slice(0, idx),
    after: split.lhs.slice(idx + token.length),
    rhs: split.rhs,
    answer: token,
    infix,
  };
}

export function stripCallStack(sig: string) {
  return sig.replace(/HasCallStack\s*=>\s*/g, "");
}

export function splitContext(sig: string): { ctx: string[]; body: string } {
  const parts = splitTop(sig, "=>");
  if (parts.length < 2) return { ctx: [], body: sig.trim() };
  const ctxRaw = parts.slice(0, -1).join(", ").trim();
  const inner = ctxRaw.startsWith("(") && ctxRaw.endsWith(")") ? ctxRaw.slice(1, -1) : ctxRaw;
  return { ctx: splitTop(inner, ",").filter(Boolean), body: parts[parts.length - 1] };
}

function joinContext(ctx: string[], body: string) {
  if (ctx.length === 0) return body;
  const c = ctx.length === 1 ? ctx[0] : `(${ctx.join(", ")})`;
  return `${c} => ${body}`;
}

export function normalizeSig(sig: string): string {
  const flat = stripCallStack(sig).replace(/\s+/g, " ").trim();
  const { ctx, body } = splitContext(flat);
  ctx.sort((a, b) => a.split(" ")[0].localeCompare(b.split(" ")[0]));
  let out = joinContext(ctx, body)
    .replace(/\s*->\s*/g, " -> ")
    .replace(/\s*=>\s*/g, " => ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/\[\s+/g, "[")
    .replace(/\s+\]/g, "]")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\bFilePath\b/g, "String")
    .replace(/\[Char\]/g, "String");
  const names = new Map<string, string>();
  out = out.replace(/(?<![\w'.])[a-z_][\w']*/g, (v) => {
    if (v === "forall") return v;
    if (!names.has(v)) names.set(v, `t${names.size}`);
    return names.get(v)!;
  });
  return out;
}

const SIBLING: Record<string, string> = {
  Num: "Integral",
  Integral: "Num",
  Fractional: "Floating",
  Floating: "Fractional",
  Functor: "Monad",
  Monad: "Applicative",
  Applicative: "Functor",
  Eq: "Ord",
  Ord: "Eq",
  Foldable: "Traversable",
  Traversable: "Foldable",
  Show: "Read",
  Read: "Show",
  Monoid: "Semigroup",
  Semigroup: "Monoid",
  RealFrac: "RealFloat",
  Real: "RealFrac",
};

export function mutateSig(sig: string): string[] {
  const clean = stripCallStack(sig);
  const { ctx, body } = splitContext(clean);
  const out: string[] = [];
  const args = splitTop(body, "->");
  if (args.length >= 3) {
    const swapped = [args[1], args[0], ...args.slice(2)];
    out.push(joinContext(ctx, swapped.join(" -> ")));
  } else if (args.length === 2) {
    out.push(joinContext(ctx, `${args[1]} -> ${args[0]}`));
  }
  if (ctx.length > 0) {
    const changed = ctx.map((c) => {
      const cls = c.split(" ")[0];
      return SIBLING[cls] ? c.replace(cls, SIBLING[cls]) : c;
    });
    out.push(joinContext(changed, body));
  }
  if (ctx.some((c) => c.startsWith("Foldable t"))) {
    out.push(
      joinContext(
        ctx.filter((c) => !c.startsWith("Foldable t")),
        body.replace(/\bt ([a-z]\w*|\[a\]|Bool)/g, "[$1]"),
      ),
    );
  }
  if (args.length >= 2) {
    out.push(joinContext(ctx, [...args.slice(0, -1), args[0]].join(" -> ")));
  }
  return out;
}

export type TokenKind = "kw" | "type" | "op" | "str" | "num" | "plain" | "punct" | "comment";

const KEYWORDS = new Set([
  "where", "let", "in", "do", "case", "of", "if", "then", "else", "data", "type",
  "newtype", "class", "instance", "deriving", "import", "module", "qualified", "as", "forall",
]);

export function tokenize(code: string): { kind: TokenKind; text: string }[] {
  const re =
    /(--[^\n]*)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)')|(\b\d+(?:\.\d+)?(?:e-?\d+)?\b)|([A-Z][\w']*(?:\.[A-Z][\w']*)*)|([a-z_][\w']*)|([!#$%&*+./<=>?@\\^|\-~:]+)|([()[\],`{}])|(\s+)|(.)/g;
  const out: { kind: TokenKind; text: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    const [text, comment, str, chr, num, upper, lower, op, punct] = m;
    let kind: TokenKind = "plain";
    if (comment) kind = "comment";
    else if (str || chr) kind = "str";
    else if (num) kind = "num";
    else if (upper) kind = "type";
    else if (lower) kind = KEYWORDS.has(lower) ? "kw" : "plain";
    else if (op) kind = "op";
    else if (punct) kind = "punct";
    out.push({ kind, text });
  }
  return out;
}

export const squash = (s: string) => s.replace(/\s+/g, "");
