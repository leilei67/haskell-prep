import { splitContext, splitTop, stripCallStack } from "./haskell";

const CLASS_MEANING: Record<string, string> = {
  Eq: "can be compared with ==",
  Ord: "can be put in order with < and >",
  Show: "can be turned into text",
  Read: "can be read from text",
  Num: "is a number type",
  Integral: "is a whole-number type, like Int or Integer",
  Real: "is a number type that isn't complex",
  Fractional: "is a type with division, like Double",
  Floating: "is a decimal type like Double that has sqrt, sin and so on",
  RealFrac: "is a decimal type that can be rounded",
  RealFloat: "is a floating-point type like Double",
  Enum: "can be counted through, one value after another",
  Bounded: "has a smallest and a largest value",
  Foldable: "is a container you can go through, like a list",
  Traversable: "is a container you can walk through step by step, like a list",
  Functor: "is a container you can map over, like a list or Maybe",
  Applicative: "is a container that can combine values, like Maybe or a list",
  Monad: "is a container whose steps can be chained, like Maybe or IO",
  MonadFail: "is a chainable container that can fail with a message",
  Semigroup: "has a way to combine two values with <>",
  Monoid: "has a way to combine values and an empty value",
};

const ATOMS: Record<string, [string, string]> = {
  Int: ["an Int (whole number)", "Ints"],
  Integer: ["an Integer (whole number of any size)", "Integers"],
  Word: ["a Word (whole number, never negative)", "Words"],
  Double: ["a Double (decimal number)", "Doubles"],
  Float: ["a Float (decimal number)", "Floats"],
  Bool: ["a Bool (True or False)", "Bools"],
  Char: ["a Char (one character)", "Chars"],
  String: ["a String (text)", "Strings"],
  FilePath: ["a FilePath (a file name, which is text)", "file names"],
  Ordering: ["an Ordering (LT, EQ or GT)", "Orderings"],
  Rational: ["a Rational (exact fraction)", "Rationals"],
  ShowS: ["a ShowS (a piece of text waiting for more text)", "ShowS values"],
  IOError: ["an IOError", "IOErrors"],
  "()": ["nothing useful, ()", "()"],
};

const stripParens = (t: string) => {
  let s = t.trim();
  while (s.startsWith("(") && s.endsWith(")") && splitTop(s.slice(1, -1), ",").length === 1 && balanced(s.slice(1, -1))) {
    s = s.slice(1, -1).trim();
  }
  return s;
};

function balanced(s: string) {
  let d = 0;
  for (const c of s) {
    if (c === "(" || c === "[") d++;
    if (c === ")" || c === "]") d--;
    if (d < 0) return false;
  }
  return d === 0;
}

function words(t: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const c of t) {
    if (c === "(" || c === "[") depth++;
    if (c === ")" || c === "]") depth--;
    if (c === " " && depth === 0) {
      if (cur) out.push(cur);
      cur = "";
    } else cur += c;
  }
  if (cur) out.push(cur);
  return out;
}

const isVar = (t: string) => /^[a-z][\w']*$/.test(t);
const code = (t: string) => `\`${t}\``;

const article = (v: string) => (/^[aeiou]/.test(v) ? "an" : "a");

function describe(t: string, plural = false): string {
  if (t.trim() === "()") return plural ? "()" : "nothing useful (written `()`)";
  const s = stripParens(t);
  if (s === "[Char]") return plural ? "Strings" : "a String (text)";
  const arrows = splitTop(s, "->");
  if (arrows.length > 1) {
    const args = arrows.slice(0, -1).map((a) => describe(a));
    const res = describe(arrows[arrows.length - 1]);
    return `${plural ? "functions" : "a function"} from ${args.join(" and ")} to ${res}`;
  }
  if (s.startsWith("[") && s.endsWith("]")) {
    const inner = describe(s.slice(1, -1), true);
    return plural ? `lists of ${inner}` : `a list of ${inner}`;
  }
  if (s.startsWith("(") && s.endsWith(")")) {
    const parts = splitTop(s.slice(1, -1), ",");
    const name = parts.length === 2 ? "pair" : "triple";
    if (plural) return `${name}s ${code(s)}`;
    return `a ${name} of ${parts.map((p) => describe(p)).join(" and ")}`;
  }
  if (ATOMS[s]) return plural ? ATOMS[s][1] : ATOMS[s][0];
  if (isVar(s)) return plural ? `${code(s)}s` : `${article(s)} ${code(s)}`;
  const [head, ...args] = words(s);
  if (head === "Maybe") return plural ? "Maybe values" : `a Maybe (Just ${describe(args[0])}, or Nothing)`;
  if (head === "IO") {
    if (args[0].trim() === "()") return plural ? "IO actions" : "an IO action with no useful result";
    return plural ? "IO actions" : `an IO action that produces ${describe(args[0])}`;
  }
  if (head === "Either") return `an Either (Left with ${describe(args[0])}, or Right with ${describe(args[1])})`;
  if (head === "ReadS") return `a ReadS reader for ${describe(args[0], true)}`;
  if (head === "ReadPrec") return `a ReadPrec parser for ${describe(args[0], true)}`;
  if (head === "NonEmpty") return `a non-empty list of ${describe(args[0], true)}`;
  if (head === "Ratio") return `an exact fraction of ${describe(args[0], true)}`;
  if (isVar(head)) {
    if (plural) return `containers ${code(s)}`;
    const inner = args.map((a) => describe(a, true)).join(" and ");
    return `a container ${code(head)} holding ${inner}`;
  }
  return code(s);
}

export function readSignature(sig: string): { sentence: string; constraints: string[] } {
  const clean = stripCallStack(sig).replace(/\s+/g, " ").trim();
  const { ctx, body } = splitContext(clean);
  const parts = splitTop(body, "->");
  const result = describe(parts[parts.length - 1]);
  const args = parts.slice(0, -1).map((p) => describe(p));
  const sentence =
    args.length === 0
      ? `It is ${result}.`
      : args.length === 1
        ? `Takes ${args[0]}, and gives back ${result}.`
        : `Takes ${args.slice(0, -1).join(", then ")}, then ${args[args.length - 1]}, and gives back ${result}.`;
  const constraints = ctx.map((c) => {
    const [cls, v] = c.trim().split(/\s+/);
    const meaning = CLASS_MEANING[cls];
    return meaning ? `${code(v)} must be a type that ${meaning} (${code(cls)}).` : `${code(c)} must hold.`;
  });
  return { sentence, constraints };
}
