import { factKey, factsByTopic, itemKey, items } from "../lib/content";

export interface Unit {
  id: string;
  title: string;
  blurb: string;
  keys: string[];
}

const cls = (...names: string[]) => names.flatMap((n) => factsByTopic(`class:${n}`));

function unit(id: string, title: string, blurb: string, itemNames: string[], factIds: string[] = []): Unit {
  return { id, title, blurb, keys: [...itemNames.map(itemKey), ...factIds.map(factKey)] };
}

export const units: Unit[] = [
  unit("notation", "Reading types", "How to read every line GHCi printed: ::, =>, kinds, MINIMAL.", [], [
    ...factsByTopic("notation"),
    ...factsByTopic("types"),
  ]),
  unit("functions", "Functions as values", "Composition, application, pairs and the tiny combinators.", [
    "id", "const", "flip", "(.)", "($)", "($!)", "curry", "uncurry", "fst", "snd", "seq",
  ]),
  unit("order", "Truth and order", "Booleans, equality and comparison.", [
    "(&&)", "(||)", "not", "otherwise", "(==)", "(/=)", "compare", "(<)", "(<=)", "(>)", "(>=)", "max", "min",
  ], cls("Eq", "Ord")),
  unit("lists", "Building lists", "Taking lists apart at the ends and building infinite ones.", [
    "(++)", "(!!)", "head", "tail", "init", "last", "null", "length", "reverse", "replicate", "repeat", "cycle", "iterate",
  ]),
  unit("slicing", "Slicing lists", "Cutting lists by count or by a test.", [
    "take", "drop", "splitAt", "takeWhile", "dropWhile", "span", "break", "filter",
  ]),
  unit("reshaping", "Reshaping lists", "Mapping, zipping, flattening and searching.", [
    "map", "concat", "concatMap", "zip", "zip3", "zipWith", "zipWith3", "unzip", "unzip3", "lookup", "elem", "notElem",
  ]),
  unit("folds", "Folds and scans", "Collapsing a container into one value, and keeping the steps.", [
    "foldr", "foldl", "foldl'", "foldr1", "foldl1", "sum", "product", "maximum", "minimum",
    "and", "or", "any", "all", "scanl", "scanl1", "scanr", "scanr1",
  ], cls("Foldable")),
  unit("text", "Text in and out", "Splitting strings and the Show and Read machinery.", [
    "lines", "unlines", "words", "unwords", "show", "read", "reads", "shows", "showString", "showChar",
    "showParen", "showsPrec", "showList", "readsPrec", "readList", "readPrec", "readListPrec", "lex", "readParen",
  ], cls("Show", "Read")),
  unit("num", "Num and friends", "Arithmetic, literals and powers.", [
    "(+)", "(-)", "(*)", "negate", "abs", "signum", "fromInteger", "(^)", "subtract", "even", "odd", "gcd", "lcm",
  ], cls("Num")),
  unit("integral", "Whole numbers", "The four kinds of division and converting between number types.", [
    "quot", "rem", "div", "mod", "quotRem", "divMod", "toInteger", "fromIntegral", "toRational",
  ], cls("Integral", "Real")),
  unit("floating", "Fractions and floating point", "Division, logs, powers and trigonometry.", [
    "(/)", "recip", "fromRational", "(^^)", "(**)", "pi", "exp", "log", "sqrt", "logBase",
    "sin", "cos", "tan", "asin", "acos", "atan", "sinh", "cosh", "tanh", "asinh", "acosh", "atanh",
  ], cls("Fractional", "Floating")),
  unit("rounding", "Rounding and converting", "Getting from fractions back to whole numbers.", [
    "truncate", "round", "ceiling", "floor", "properFraction", "realToFrac",
  ], cls("RealFrac")),
  unit("maybe", "Maybe and Either", "Values that might be missing or might be an error.", ["maybe", "either"]),
  unit("functor", "Functor and Applicative", "Working inside a context without leaving it.", [
    "fmap", "(<$>)", "(<$)", "pure", "(<*>)", "liftA2", "(*>)", "(<*)",
  ], cls("Functor", "Applicative")),
  unit("monad", "Monads", "Sequencing steps where each depends on the last.", [
    "(>>=)", "(>>)", "return", "(=<<)", "fail", "mapM_", "sequence_",
  ], cls("Monad", "MonadFail")),
  unit("traverse", "Traversing", "Running an effect over a whole container.", [
    "traverse", "sequenceA", "mapM", "sequence",
  ], cls("Traversable")),
  unit("monoid", "Combining things", "Semigroup, Monoid and the folds built on them.", [
    "(<>)", "sconcat", "stimes", "mempty", "mappend", "mconcat", "fold", "foldMap", "foldMap'", "foldr'", "toList",
  ], cls("Semigroup", "Monoid")),
  unit("io", "Talking to the world", "Printing, reading input and files.", [
    "putChar", "putStr", "putStrLn", "print", "getChar", "getLine", "getContents", "interact",
    "readFile", "writeFile", "appendFile", "readIO", "readLn", "ioError", "userError",
  ]),
  unit("enum", "Enumerations and bounds", "succ, pred and what [a .. b] really calls.", [
    "succ", "pred", "toEnum", "fromEnum", "enumFrom", "enumFromThen", "enumFromTo", "enumFromThenTo", "minBound", "maxBound",
  ], cls("Enum", "Bounded")),
  unit("crashes", "Crashes and laziness", "Partial functions, error, undefined and until.", [
    "error", "errorWithoutStackTrace", "undefined", "until", "asTypeOf",
  ]),
  unit("ieee", "Inside floating point", "The RealFloat internals and the precise log/exp helpers.", [
    "floatRadix", "floatDigits", "floatRange", "decodeFloat", "encodeFloat", "exponent", "significand",
    "scaleFloat", "isNaN", "isInfinite", "isDenormalized", "isNegativeZero", "isIEEE", "atan2",
    "log1p", "expm1", "log1pexp", "log1mexp",
  ], cls("RealFloat")),
  unit("traps", "Look-alikes, traps and precedence", "The things that catch people out in tests.", [], [
    ...factsByTopic("compare"),
    ...factsByTopic("gotchas"),
    ...factsByTopic("fixity"),
    ...factsByTopic("classes"),
  ]),
];

export const unitById = new Map(units.map((u) => [u.id, u]));

export const unitOfKey = new Map<string, Unit>();
for (const u of units) for (const k of u.keys) if (!unitOfKey.has(k)) unitOfKey.set(k, u);

const uncovered = items.filter((i) => !unitOfKey.has(itemKey(i.id)));
if (uncovered.length > 0) console.warn("Items not in any unit:", uncovered.map((i) => i.name));
