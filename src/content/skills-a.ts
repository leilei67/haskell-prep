import { type DrillSet, type Lesson, hs, md } from "./schema.ts";

// ---------------------------------------------------------------------------
// Lesson 1: where, let and case
// ---------------------------------------------------------------------------

const local: Lesson = {
  id: "local",
  title: "where, let and case",
  blurb: "Name the pieces of a calculation, and choose between shapes inside an expression.",
  steps: [
    {
      k: "read",
      body: md(
        "Exam answers get long quickly. Giving a name to a piece of the calculation makes them much easier to write and to read. A name that only exists inside one function is called a local definition.",
        "",
        "The most common way is `where`, written after the equation:",
        "",
        "```",
        "average :: [Double] -> Double",
        "average xs = total / count",
        "  where",
        "    total = sum xs",
        "    count = fromIntegral (length xs)",
        "```",
        "",
        "Read it as: \"the average is total divided by count, where total is ... and count is ...\". The local names can use the function's inputs (here `xs`). Nothing outside `average` can see `total` or `count`.",
        "",
        "`fromIntegral` turns a whole number (the Int from `length`) into any number type, here a Double, so it can be divided with `/`.",
      ),
    },
    {
      k: "try",
      code: "let area r = piTimes * r * r where piTimes = 3.14 in area 10",
      after: "Inside GHCi we need `let ... in` to define a function at all, but the `where` part works just like in a file: `piTimes` is a local name inside `area`.",
    },
    {
      k: "quiz",
      q: md(
        "In this definition, which names can the `where` part use?",
        "",
        "```",
        "price :: Int -> Int -> Int",
        "price qty unit = total - discount",
        "  where",
        "    total    = qty * unit",
        "    discount = total `div` 10",
        "```",
      ),
      options: ["Only `qty`", "`qty` and `unit`, but not `total`", "`qty`, `unit`, and the other local names like `total`", "Nothing: where can't see the inputs"],
      answer: 2,
      why: "Everything in a `where` can see the function's inputs and every other name in the same `where`. That's why `discount` can use `total`. The order you list them in doesn't matter.",
    },
    {
      k: "write",
      body: md(
        "Write `average`, which gives the mean of a non-empty list of Doubles. Use a `where` with two local names, `total` and `count`.",
        "",
        "(The precondition \"non-empty\" means the tests never give you `[]`. Exams use preconditions like this all the time: you can ignore the case they rule out.)",
      ),
      starter: hs`average :: [Double] -> Double
average xs = total / count
  where
    total = undefined
    count = undefined
`,
      tests: [
        { expr: "average [1, 2, 3]", expected: "2.0" },
        { expr: "average [5]", expected: "5.0" },
        { expr: "average [1, 2]", expected: "1.5" },
        { expr: "average [10, 0, 0, 0]", expected: "2.5" },
      ],
      hint: "`total = sum xs` and `count = fromIntegral (length xs)`.",
      solution: hs`average :: [Double] -> Double
average xs = total / count
  where
    total = sum xs
    count = fromIntegral (length xs)
`,
    },
    {
      k: "read",
      body: md(
        "`where` really shines with guards. One `where` belongs to the whole equation, so every guard can use its names:",
        "",
        "```",
        "category :: Double -> Double -> String",
        "category weight height",
        "  | bmi < 18.5 = \"under\"",
        "  | bmi < 25   = \"normal\"",
        "  | otherwise  = \"over\"",
        "  where",
        "    bmi = weight / (height * height)",
        "```",
        "",
        "Without `where` you'd have to write the formula three times. Haskell works out `bmi` once, the first time a guard needs it.",
        "",
        "Notice where things go: the guards are indented under the function name, and `where` comes after the last guard.",
      ),
    },
    {
      k: "write",
      body: md(
        "Write `grade mark total`, which turns a test score into a letter. Work out the percentage once, in a `where`, as `pct = div (100 * mark) total`. Then:",
        "",
        "```",
        "70 or more  ->  'A'",
        "60 or more  ->  'B'",
        "50 or more  ->  'C'",
        "otherwise   ->  'F'",
        "```",
      ),
      starter: hs`grade :: Int -> Int -> Char
grade mark total
  | otherwise = undefined
  where
    pct = undefined
`,
      tests: [
        { expr: "grade 35 50", expected: "'A'" },
        { expr: "grade 13 20", expected: "'B'" },
        { expr: "grade 5 10", expected: "'C'" },
        { expr: "grade 49 100", expected: "'F'" },
        { expr: "grade 7 10", expected: "'A'", label: "exactly 70% is an A" },
      ],
      hint: "Guards are checked top to bottom, so test `pct >= 70` first, then `pct >= 60`, then `pct >= 50`, then `otherwise`.",
      solution: hs`grade :: Int -> Int -> Char
grade mark total
  | pct >= 70 = 'A'
  | pct >= 60 = 'B'
  | pct >= 50 = 'C'
  | otherwise = 'F'
  where
    pct = div (100 * mark) total
`,
    },
    {
      k: "quiz",
      q: md(
        "A function has two equations. Can the second equation use `y`?",
        "",
        "```",
        "f :: Int -> Int",
        "f 0 = y",
        "  where y = 10",
        "f n = n + y",
        "```",
      ),
      options: ["Yes, `where` names are visible in the whole file", "Yes, but only if `n` is 0", "No: a `where` belongs to one equation only", "No: `where` can't be used with patterns"],
      answer: 2,
      why: "Each equation has its own `where`. The second equation would give the error `Variable not in scope: y`. If both equations need it, define it at the top level (no indentation) or repeat it.",
    },
    {
      k: "read",
      body: md(
        "The other way to name things locally is `let ... in`. It's an expression: it has a value, so it can go anywhere a value can.",
        "",
        "```",
        "let total = 3 + 4 in total * total      -- 49",
        "```",
        "",
        "Read it as \"let total be 3 + 4 in the expression total * total\". Several names go on separate lines (lined up), or on one line separated by `;`.",
        "",
        "`where` and `let` do the same job. `where` puts the main formula first and the details after; `let` puts the details first. In exam code `where` is more common, because it reads top-down and works with guards. In GHCi you'll use `let`.",
      ),
    },
    { k: "try", code: "let x = 3; y = 4 in x * y" },
    {
      k: "predict",
      expr: "let (a, b) = (3, 4) in a * 10 + b",
      answer: "34",
      why: "The pattern `(a, b)` takes the pair apart: `a` is 3 and `b` is 4. Then `3 * 10 + 4` is 34.",
    },
    {
      k: "predict",
      expr: "let xs = [1, 2, 3] in sum xs * length xs",
      answer: "18",
      why: "`sum xs` is 6 and `length xs` is 3, so the answer is 18.",
    },
    {
      k: "read",
      body: md(
        "Sometimes you need to choose based on the shape of a value that isn't one of the inputs, like the result of `lookup`. That's what `case ... of` is for. It's pattern matching inside an expression:",
        "",
        "```",
        "describe :: Int -> [(Int, String)] -> String",
        "describe k table",
        "  = case lookup k table of",
        "      Nothing -> \"unknown\"",
        "      Just s  -> \"found \" ++ s",
        "```",
        "",
        "Each line below `case` is called an alternative: a pattern, an arrow `->`, and the answer for that shape. Haskell tries them top to bottom and uses the first pattern that fits.",
        "",
        "Exams love this. In 2016, `getAttribute` had to give `\"\"` when an attribute was missing; `case lookup name attributes of` is exactly the right tool.",
      ),
    },
    {
      k: "try",
      code: md(
        "let describe k table = case lookup k table of",
        "      Nothing -> \"unknown\"",
        "      Just s  -> \"found \" ++ s",
        "in describe 2 [(1, \"one\"), (2, \"two\")]",
      ),
      after: "`lookup` gave `Just \"two\"`, which matched the second alternative with `s` standing for `\"two\"`.",
    },
    {
      k: "write",
      body: md(
        "Write `getOr key table`, which gives the String that `key` is paired with, or `\"\"` if the key isn't in the table. Use `case` on the result of `lookup`.",
        "",
        "This is the heart of 2016's `getAttribute` (2 marks).",
      ),
      starter: hs`getOr :: String -> [(String, String)] -> String
getOr key table = undefined
`,
      tests: [
        { expr: `getOr "x" [("x", "1"), ("y", "2")]`, expected: `"1"` },
        { expr: `getOr "y" [("x", "1"), ("y", "2")]`, expected: `"2"` },
        { expr: `getOr "z" [("x", "1")]`, expected: `""` },
        { expr: `getOr "a" []`, expected: `""`, label: "empty table gives \"\"" },
      ],
      hint: "`case lookup key table of` then two alternatives: `Nothing -> \"\"` and `Just v -> v`.",
      solution: hs`getOr :: String -> [(String, String)] -> String
getOr key table
  = case lookup key table of
      Nothing -> ""
      Just v  -> v
`,
    },
    {
      k: "quiz",
      q: "In a `case`, what does the pattern `_` match?",
      options: ["Only the empty list", "Only `Nothing`", "Anything at all, without giving it a name", "Nothing: it's a syntax error"],
      answer: 2,
      why: "`_` is the wildcard: it fits every value. Put it last as a catch-all, because alternatives are tried top to bottom and anything after it would never be reached.",
    },
    {
      k: "read",
      body: md(
        "`case` works on any pattern you know: lists and tuples too.",
        "",
        "```",
        "case xs of",
        "  []      -> \"empty\"",
        "  [x]     -> \"just one\"",
        "  (x : _) -> \"starts with \" ++ show x",
        "",
        "case divMod n 10 of",
        "  (q, r) -> show q ++ \" tens and \" ++ show r",
        "```",
        "",
        "Order matters: `[x]` must come before `(x : _)`, because a one-element list fits both.",
      ),
    },
    {
      k: "predict",
      body: "The lambda just passes the list in, so GHC can't see the list in advance.",
      expr: "(\\xs -> case xs of { [] -> 0; (x : _) -> x }) [5, 6, 7]",
      answer: "5",
      why: "`[5, 6, 7]` isn't empty, so the second alternative matches with `x` as 5. (The `{ ; }` lets you write a case on one line.)",
    },
    {
      k: "predict",
      expr: "(\\p -> case p of (n, s) -> replicate n s) (3, \"hi\")",
      answer: "[\"hi\", \"hi\", \"hi\"]",
      why: "The pair splits into `n = 3` and `s = \"hi\"`, so the answer is three copies of `\"hi\"` in a list.",
    },
    {
      k: "write",
      body: "Write `firstWord`, which gives the first word of a String, or `\"\"` if there are no words. Use `case` on `words s`.",
      starter: hs`firstWord :: String -> String
firstWord s = undefined
`,
      tests: [
        { expr: `firstWord "hello world"`, expected: `"hello"` },
        { expr: `firstWord "   padded  text"`, expected: `"padded"` },
        { expr: `firstWord ""`, expected: `""` },
        { expr: `firstWord "   "`, expected: `""`, label: "only spaces gives \"\"" },
      ],
      hint: "`case words s of` with alternatives `[] -> \"\"` and `(w : _) -> w`.",
      solution: hs`firstWord :: String -> String
firstWord s
  = case words s of
      []      -> ""
      (w : _) -> w
`,
    },
    {
      k: "read",
      body: md(
        "A very handy trick: on the left of `=` in a `where` or `let` you can write a pattern, not just a name. This is called a pattern binding:",
        "",
        "```",
        "rotate :: Int -> [a] -> [a]",
        "rotate n xs = back ++ front",
        "  where",
        "    (front, back) = splitAt n xs",
        "```",
        "",
        "`splitAt` gives back a pair, and the pattern `(front, back)` names both halves in one go. You'll use this with any function that returns a tuple: `splitAt`, `span`, `break`, `partition`, `divMod`, `unzip`, and exam types like `type Automaton = (State, [State], [Transition])`.",
      ),
    },
    {
      k: "predict",
      expr: "let (q, r) = divMod 17 5 in q * 100 + r",
      answer: "302",
      why: "`divMod 17 5` is `(3, 2)`: 17 is 3 fives with 2 left over. So `3 * 100 + 2` is 302.",
    },
    {
      k: "write",
      body: md(
        "Write `rotate n xs`, which moves the first `n` elements to the end. Use a pattern binding with `splitAt`.",
        "",
        "```",
        "rotate 2 \"haskell\"   is  \"skellha\"",
        "```",
      ),
      starter: hs`rotate :: Int -> [a] -> [a]
rotate n xs = undefined
`,
      tests: [
        { expr: `rotate 2 "haskell"`, expected: `"skellha"` },
        { expr: "rotate 1 [1, 2, 3]", expected: "[2, 3, 1]" },
        { expr: "rotate 0 [1, 2, 3]", expected: "[1, 2, 3]" },
        { expr: "rotate 5 [1, 2]", expected: "[1, 2]", label: "n bigger than the list" },
      ],
      hint: "`where (front, back) = splitAt n xs`, then the answer is `back ++ front`.",
      solution: hs`rotate :: Int -> [a] -> [a]
rotate n xs = back ++ front
  where
    (front, back) = splitAt n xs
`,
    },
    {
      k: "write",
      body: md(
        "Write `stats`, which gives the smallest element, the largest element and the range (largest minus smallest) of a non-empty list, as a triple.",
        "",
        "Name `lo` and `hi` in a `where` so you only work each out once.",
      ),
      starter: hs`stats :: [Int] -> (Int, Int, Int)
stats xs = undefined
`,
      tests: [
        { expr: "stats [3, 9, 1, 4]", expected: "(1, 9, 8)" },
        { expr: "stats [7]", expected: "(7, 7, 0)" },
        { expr: "stats [-2, 2]", expected: "(-2, 2, 4)" },
        { expr: "stats [5, 5, 5]", expected: "(5, 5, 0)" },
      ],
      hint: "`stats xs = (lo, hi, hi - lo)` with `lo = minimum xs` and `hi = maximum xs` in the `where`.",
      solution: hs`stats :: [Int] -> (Int, Int, Int)
stats xs = (lo, hi, hi - lo)
  where
    lo = minimum xs
    hi = maximum xs
`,
    },
    {
      k: "read",
      body: md(
        "Haskell uses indentation (spaces at the start of a line) to work out where things begin and end. This is called layout. Three rules cover nearly every error you'll meet:",
        "",
        "1. Everything that belongs to a definition must be indented more than the definition's first character. A line that starts in column 1 begins a new top-level definition.",
        "2. All the definitions in one `where` (or `let`, or all the alternatives of one `case`) must start in exactly the same column.",
        "3. Use spaces, never tabs.",
        "",
        "```",
        "good x = a + b          bad x = a + b",
        "  where                   where",
        "    a = x                   a = x",
        "    b = 2                     b = 2     -- not lined up!",
        "```",
        "",
        "On the right, `b = 2` is indented more than `a`, so Haskell thinks it continues the previous line: `a = x b = 2`. The error is `parse error on input '='`. When you see a parse error, check the lining up first.",
      ),
    },
    {
      k: "try",
      code: md("let a = 1", "     b = 2", "in a + b"),
      expectError: true,
      after: "The `b` is one column to the right of `a`, so GHCi reads it as part of `a`'s line, and the second `=` makes no sense. Line `b` up exactly under `a` and it works.",
    },
    {
      k: "quiz",
      q: md(
        "Which version is laid out correctly?",
        "",
        "```",
        "-- A                      -- B",
        "f x = y * 2               f x = y * 2",
        "where                       where",
        "  y = x + 1                   y = x + 1",
        "```",
      ),
      options: ["A", "B", "Both", "Neither"],
      answer: 1,
      why: "In A, `where` is in column 1, so Haskell thinks a new top-level definition is starting. `where` must be indented more than `f`. B is right.",
    },
    {
      k: "quiz",
      q: "Which of these can you write directly as the input to another function, like `show (...)`?",
      options: ["A `where` block", "A `let ... in ...` expression", "Both", "Neither"],
      answer: 1,
      why: "`let ... in ...` is an expression, so `show (let x = 2 in x * x)` is fine. `where` isn't an expression: it can only hang off the end of an equation (or a case alternative).",
    },
  ],
};

const drillLocal: DrillSet = {
  id: "drill-local",
  lesson: "local",
  title: "where, let and case drills",
  drills: [
    {
      k: "quiz",
      q: md("What is `f 5`?", "", "```", "f :: Int -> Int", "f x = a + b", "  where", "    a = x * 2", "    b = 1", "```"),
      options: ["10", "11", "12", "6"],
      answer: 1,
      why: "`a` is `5 * 2`, which is 10, and `b` is 1, so `f 5` is 11.",
    },
    { k: "predict", expr: "let n = 4 in n * n + 1", answer: "17", why: "`n` is 4, so `4 * 4 + 1` is 17." },
    {
      k: "predict",
      expr: 'let (a, b) = splitAt 2 "hello" in b ++ a',
      answer: '"llohe"',
      why: '`splitAt 2 "hello"` is `("he", "llo")`. Then `"llo" ++ "he"` is `"llohe"`.',
    },
    {
      k: "quiz",
      q: "You have three guards that all need the same value worked out from the inputs. Where do you put its definition?",
      options: ["In a `where` after the last guard", "Before the first guard, on its own line", "In a separate `let` inside every guard", "You can't share values between guards"],
      answer: 0,
      why: "One `where` belongs to the whole equation, so every guard can use it.",
    },
    {
      k: "predict",
      expr: "(\\m -> case m of { Nothing -> 0; Just n -> n * 2 }) (Just 21)",
      answer: "42",
      why: "`Just 21` matches `Just n` with `n` as 21, giving 42.",
    },
    {
      k: "quiz",
      q: "Which statement is true?",
      options: [
        "`where` is an expression and `let` isn't",
        "`let ... in ...` is an expression; `where` attaches to an equation",
        "`let` can only define numbers",
        "`where` can only define functions",
      ],
      answer: 1,
      why: "`let ... in ...` has a value and can go anywhere an expression can. `where` hangs off the end of an equation. Both can define values and functions.",
    },
    {
      k: "predict",
      expr: 'let ws = words "the cat sat" in (length ws, head ws)',
      answer: '(3, "the")',
      why: '`words` splits on spaces into `["the", "cat", "sat"]`: three words, the first being `"the"`.',
    },
    {
      k: "quiz",
      q: md("Why does this give `parse error on input '='`?", "", "```", "f x = a * b", "  where", "    a = x + 1", "      b = x - 1", "```"),
      options: [
        "`where` must be on the same line as `f`",
        "`b` isn't lined up with `a`, so it's read as part of `a`'s line",
        "You can't define two things in one `where`",
        "`a` and `b` must be defined before `f`",
      ],
      answer: 1,
      why: "All definitions in one `where` must start in the same column. Because `b` is further right, Haskell reads `a = x + 1 b = x - 1`, which has two `=` signs.",
    },
    {
      k: "predict",
      expr: '(\\xs -> case xs of { [] -> "empty"; [_] -> "one"; _ -> "many" }) [1, 2]',
      answer: '"many"',
      why: "`[1, 2]` isn't empty and isn't a one-element list, so it falls through to the wildcard `_`.",
    },
    {
      k: "predict",
      expr: "let (q, r) = 47 `divMod` 10 in r * 10 + q",
      answer: "74",
      why: "`divMod 47 10` is `(4, 7)`, so `r * 10 + q` is `70 + 4`, which is 74.",
    },
    {
      k: "quiz",
      q: md(
        "What does this give for `size []`?",
        "",
        "```",
        "size xs = case xs of",
        "  _  -> \"some\"",
        "  [] -> \"none\"",
        "```",
      ),
      options: ['`"none"`', '`"some"`', "An error", '`""`'],
      answer: 1,
      why: "Alternatives are tried top to bottom, and `_` matches everything, so the `[]` line is never reached. Always put the wildcard last.",
    },
    {
      k: "write",
      body: "Write `bill price qty`. The total is `price * qty`; if the total is over 100, take 10 off. Name the total in a `where`.",
      starter: hs`bill :: Int -> Int -> Int
bill price qty = undefined
`,
      tests: [
        { expr: "bill 10 5", expected: "50" },
        { expr: "bill 30 4", expected: "110" },
        { expr: "bill 50 2", expected: "100", label: "exactly 100 gets no discount" },
        { expr: "bill 7 0", expected: "0" },
      ],
      hint: "Guards `| total > 100 = total - 10` and `| otherwise = total`, with `where total = price * qty`.",
      solution: hs`bill :: Int -> Int -> Int
bill price qty
  | total > 100 = total - 10
  | otherwise   = total
  where
    total = price * qty
`,
    },
    {
      k: "quiz",
      q: "What is wrong with `f x = let y = x + 1`?",
      options: ["Nothing", "It's missing the `in` part, so `let` has no expression to give", "`let` can't use `x`", "It needs a `where`"],
      answer: 1,
      why: "`let` must be followed by `in` and the expression whose value you want: `f x = let y = x + 1 in y * y`.",
    },
    {
      k: "write",
      body: "Write `headOr def xs`, which gives the first element of `xs`, or `def` if the list is empty. Use `case`.",
      starter: hs`headOr :: a -> [a] -> a
headOr def xs = undefined
`,
      tests: [
        { expr: "headOr 0 [4, 5, 6]", expected: "4" },
        { expr: "headOr 0 []", expected: "0" },
        { expr: `headOr 'z' "abc"`, expected: "'a'" },
        { expr: `headOr "none" []`, expected: `"none"` },
      ],
      hint: "`case xs of` with `[] -> def` and `(x : _) -> x`.",
      solution: hs`headOr :: a -> [a] -> a
headOr def xs
  = case xs of
      []      -> def
      (x : _) -> x
`,
    },
    {
      k: "predict",
      expr: "(\\p -> case p of (x, y) -> y - x) (3, 10)",
      answer: "7",
      why: "The pair gives `x = 3` and `y = 10`, so `y - x` is 7.",
    },
    {
      k: "quiz",
      q: md(
        "Can the second guard use `big`?",
        "",
        "```",
        "f n",
        "  | n < 0     = 0",
        "  | otherwise = big",
        "  where big = n * 1000",
        "```",
      ),
      options: ["No, only the first guard can", "Yes, every guard of this equation can", "Only if `n` is negative", "No, `where` can't follow guards"],
      answer: 1,
      why: "The `where` belongs to the whole equation, so every guard can use `big`.",
    },
    {
      k: "predict",
      expr: "let f n = if n <= 1 then 1 else n * f (n - 1) in f 5",
      answer: "120",
      why: "`let` can define functions, even recursive ones. `f 5` is `5 * 4 * 3 * 2 * 1`, which is 120.",
    },
    {
      k: "quiz",
      q: "What is `let x = 1 in let x = 2 in x`?",
      options: ["1", "2", "3", "An error: x is defined twice"],
      answer: 1,
      why: "The inner `let` makes a new `x` that hides the outer one inside its `in` part. This is called shadowing. It's legal, but confusing, so avoid it in your own code.",
    },
    {
      k: "write",
      body: md(
        "Write `category weight height`, using a `where` for `bmi = weight / (height * height)`:",
        "",
        "```",
        "bmi below 18.5  ->  \"under\"",
        "bmi below 25    ->  \"normal\"",
        "otherwise       ->  \"over\"",
        "```",
      ),
      starter: hs`category :: Double -> Double -> String
category weight height = undefined
`,
      tests: [
        { expr: "category 50 1.8", expected: `"under"` },
        { expr: "category 70 1.8", expected: `"normal"` },
        { expr: "category 100 1.8", expected: `"over"` },
        { expr: "category 25 1.0", expected: `"over"`, label: "exactly 25 is over" },
      ],
      hint: "Three guards in order: `bmi < 18.5`, `bmi < 25`, `otherwise`, then the `where`.",
      solution: hs`category :: Double -> Double -> String
category weight height
  | bmi < 18.5 = "under"
  | bmi < 25   = "normal"
  | otherwise  = "over"
  where
    bmi = weight / (height * height)
`,
    },
    {
      k: "write",
      body: md(
        "Write `splitName`, which splits a full name at the first space into (first name, the rest). Use a pattern binding with `break (== ' ')`, then drop the space from the second part.",
        "",
        "```",
        "splitName \"Ada Lovelace\"   is  (\"Ada\", \"Lovelace\")",
        "splitName \"Plato\"          is  (\"Plato\", \"\")",
        "```",
      ),
      starter: hs`splitName :: String -> (String, String)
splitName s = undefined
`,
      tests: [
        { expr: `splitName "Ada Lovelace"`, expected: `("Ada", "Lovelace")` },
        { expr: `splitName "Plato"`, expected: `("Plato", "")` },
        { expr: `splitName "Mary Ann Evans"`, expected: `("Mary", "Ann Evans")` },
        { expr: `splitName ""`, expected: `("", "")` },
      ],
      hint: "`where (first, rest) = break (== ' ') s`. `rest` still starts with the space, so the answer is `(first, drop 1 rest)`.",
      solution: hs`splitName :: String -> (String, String)
splitName s = (first, drop 1 rest)
  where
    (first, rest) = break (== ' ') s
`,
    },
    {
      k: "write",
      body: md(
        "Exam 2017, Part I (2 marks): write `allSame`, which is `True` if every item in the list is the same, and `False` otherwise. The empty list counts as all the same.",
        "",
        "```",
        "allSame []        is  True",
        "allSame [9,9,9]   is  True",
        "allSame \"abc\"     is  False",
        "```",
        "",
        "Use `case` (or two equations) to handle the empty list, then compare every element with the first.",
      ),
      starter: hs`allSame :: Eq a => [a] -> Bool
allSame xs = undefined
`,
      tests: [
        { expr: "allSame ([] :: [Int])", expected: "True" },
        { expr: "allSame [9, 9, 9]", expected: "True" },
        { expr: `allSame "abc"`, expected: "False" },
        { expr: "allSame [1]", expected: "True" },
        { expr: "allSame [2, 2, 2, 3]", expected: "False", label: "different only at the end" },
      ],
      hint: "`case xs of [] -> True; (y : ys) -> all (== y) ys`.",
      solution: hs`allSame :: Eq a => [a] -> Bool
allSame xs
  = case xs of
      []       -> True
      (y : ys) -> all (== y) ys
`,
    },
    {
      k: "write",
      body: md(
        "Exam 2010, Part I: write `removePrefix pre s`, which removes the prefix `pre` from the start of `s`. Precondition: `pre` really is a prefix of `s`.",
        "",
        "```",
        "removePrefix \"ja\" \"java\"   is  \"va\"",
        "```",
        "",
        "Use a `where` to name the length of the prefix.",
      ),
      starter: hs`removePrefix :: String -> String -> String
removePrefix pre s = undefined
`,
      tests: [
        { expr: `removePrefix "ja" "java"`, expected: `"va"` },
        { expr: `removePrefix "" "java"`, expected: `"java"` },
        { expr: `removePrefix "java" "java"`, expected: `""` },
        { expr: `removePrefix "has" "haskell"`, expected: `"kell"` },
      ],
      hint: "`removePrefix pre s = drop n s where n = length pre`.",
      solution: hs`removePrefix :: String -> String -> String
removePrefix pre s = drop n s
  where
    n = length pre
`,
    },
    {
      k: "write",
      setup: hs`type State = Int
data Label = C Char | Eps
  deriving (Eq, Show)
type Transition = (State, State, Label)
type Automaton = (State, [State], [Transition])

nda1 :: Automaton
nda1 = (1, [2], [(1, 2, C 'a')])

nda2 :: Automaton
nda2 = (1, [4, 6], [(1, 2, Eps), (2, 4, C 'x'), (1, 6, C 'y')])
`,
      body: md(
        "Exam 2014, Part I (1 mark): an automaton is a triple `(start state, terminal states, transitions)`:",
        "",
        "```",
        "type Automaton = (State, [State], [Transition])",
        "```",
        "",
        "Write `isTerminal s a`, which is `True` if `s` is one of the terminal states of `a`. Take the triple apart with a pattern binding in a `where` (or in the argument). Test automata `nda1` and `nda2` are given.",
      ),
      starter: hs`isTerminal :: State -> Automaton -> Bool
isTerminal s a = undefined
`,
      tests: [
        { expr: "isTerminal 2 nda1", expected: "True" },
        { expr: "isTerminal 1 nda1", expected: "False" },
        { expr: "isTerminal 6 nda2", expected: "True" },
        { expr: "isTerminal 5 nda2", expected: "False" },
        { expr: "isTerminal 1 (1, [], [])", expected: "False", label: "no terminal states at all" },
      ],
      hint: "`where (_, terminals, _) = a`, then `elem s terminals`.",
      solution: hs`isTerminal :: State -> Automaton -> Bool
isTerminal s a = elem s terminals
  where
    (_, terminals, _) = a
`,
    },
    {
      k: "write",
      setup: hs`type Name = String
type Attributes = [(String, String)]
data XML = Text String | Element Name Attributes [XML]
  deriving (Eq, Show)

x2 :: XML
x2 = Element "a" [("x", "1"), ("y", "2")] [Element "b" [] [Text "A"]]
`,
      body: md(
        "Exam 2016, Part I (2 marks): XML is given as",
        "",
        "```",
        "data XML = Text String | Element Name Attributes [XML]",
        "type Attributes = [(String, String)]",
        "```",
        "",
        "Write `getAttribute name x`, which looks up the attribute called `name` in the element `x`. If there's no such attribute, or `x` is a `Text`, the answer is `\"\"`. Use one equation per constructor, and a `case` on `lookup` for the `Element` one.",
      ),
      starter: hs`getAttribute :: String -> XML -> String
getAttribute name x = undefined
`,
      tests: [
        { expr: `getAttribute "x" x2`, expected: `"1"` },
        { expr: `getAttribute "y" x2`, expected: `"2"` },
        { expr: `getAttribute "z" x2`, expected: `""` },
        { expr: `getAttribute "x" (Text "t")`, expected: `""` },
        { expr: `getAttribute "x" (Element "e" [] [])`, expected: `""`, label: "element with no attributes" },
      ],
      hint: "`getAttribute _ (Text _) = \"\"` and `getAttribute name (Element _ attrs _) = case lookup name attrs of ...`.",
      solution: hs`getAttribute :: String -> XML -> String
getAttribute _ (Text _) = ""
getAttribute name (Element _ attrs _)
  = case lookup name attrs of
      Nothing -> ""
      Just v  -> v
`,
    },
    {
      k: "write",
      setup: hs`data Op = Add | Mul | Eq | Gtr
  deriving (Eq, Show)
`,
      body: md(
        "Exam 2018, Part I (2 marks): with `data Op = Add | Mul | Eq | Gtr`, write `apply op x y`, which applies the operator to two Ints. Comparisons give 1 for true and 0 for false.",
        "",
        "```",
        "apply Add 7 5   is  12",
        "apply Gtr 4 9   is  0",
        "```",
        "",
        "Use `case op of` with one alternative per constructor (or four equations).",
      ),
      starter: hs`apply :: Op -> Int -> Int -> Int
apply op x y = undefined
`,
      tests: [
        { expr: "apply Add 7 5", expected: "12" },
        { expr: "apply Mul 7 5", expected: "35" },
        { expr: "apply Gtr 4 9", expected: "0" },
        { expr: "apply Gtr 9 4", expected: "1" },
        { expr: "apply Eq 3 3", expected: "1" },
        { expr: "apply Eq 3 4", expected: "0" },
      ],
      hint: "For the comparisons, `if x == y then 1 else 0` works, or `fromEnum (x == y)` (which turns `False`/`True` into 0/1).",
      solution: hs`apply :: Op -> Int -> Int -> Int
apply op x y
  = case op of
      Add -> x + y
      Mul -> x * y
      Eq  -> fromEnum (x == y)
      Gtr -> fromEnum (x > y)
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Lesson 2: List comprehensions
// ---------------------------------------------------------------------------

const comprehensions: Lesson = {
  id: "comprehensions",
  title: "List comprehensions",
  blurb: "Build lists by drawing from other lists, keeping only what you want.",
  steps: [
    {
      k: "read",
      body: md(
        "A list comprehension builds a new list from an old one. It's borrowed from maths set notation, like { x² | x ∈ S }:",
        "",
        "```",
        "[x * x | x <- [1 .. 5]]        is  [1, 4, 9, 16, 25]",
        "```",
        "",
        "Read it from the bar: \"for each `x` drawn from `[1 .. 5]`, give `x * x`\".",
        "",
        "- `x <- [1 .. 5]` is called a generator. `<-` is read \"drawn from\". It names each element in turn.",
        "- The part before the bar `|` says what to put in the new list for each one.",
        "",
        "Past exams use comprehensions everywhere. The 2014 function `transitionsFrom` is one line with a comprehension; so are 2011's `reverseLookUp` and 2016's `getChildren`.",
      ),
    },
    { k: "try", code: "[x * x | x <- [1 .. 5]]" },
    { k: "try", code: "[toUpper c | c <- \"shout\"]", after: "A String is a list of Chars, so you can draw characters from it." },
    { k: "predict", expr: "[x + 1 | x <- [10, 20]]", answer: "[11, 21]", why: "For each `x` in `[10, 20]`, give `x + 1`." },
    {
      k: "read",
      body: md(
        "After the generator you can add filters: tests separated by commas. Only elements that pass every test are used:",
        "",
        "```",
        "[x | x <- [1 .. 10], even x]              is  [2, 4, 6, 8, 10]",
        "[x | x <- [1 .. 20], even x, x > 12]      is  [14, 16, 18, 20]",
        "```",
        "",
        "Read the commas as \"and\". A filter is any expression that gives a Bool, and it can use the names from the generators before it.",
      ),
    },
    { k: "try", code: "[x * 10 | x <- [1 .. 10], odd x, x /= 5]" },
    {
      k: "predict",
      expr: '[c | c <- "Hello World", isUpper c]',
      answer: '"HW"',
      why: "Only the characters that pass `isUpper` are kept: `'H'` and `'W'`. A list of Chars is shown as a String.",
    },
    {
      k: "write",
      body: md(
        "Write `smallSquares`, which squares the numbers in the list that are less than 10, and drops the rest. Use one comprehension.",
        "",
        "```",
        "smallSquares [3, 12, 5]   is  [9, 25]",
        "```",
      ),
      starter: hs`smallSquares :: [Int] -> [Int]
smallSquares xs = undefined
`,
      tests: [
        { expr: "smallSquares [3, 12, 5]", expected: "[9, 25]" },
        { expr: "smallSquares []", expected: "[]" },
        { expr: "smallSquares [10, 11]", expected: "[]", label: "10 itself is not less than 10" },
        { expr: "smallSquares [-2, 9]", expected: "[4, 81]" },
      ],
      hint: "`[x * x | x <- xs, x < 10]`",
      solution: hs`smallSquares :: [Int] -> [Int]
smallSquares xs = [x * x | x <- xs, x < 10]
`,
    },
    {
      k: "quiz",
      q: "Which `map`/`filter` expression gives the same list as `[f x | x <- xs, p x]`?",
      options: ["`filter p (map f xs)`", "`map f (filter p xs)`", "`map p (filter f xs)`", "`filter f (map p xs)`"],
      answer: 1,
      why: "The test `p` is applied to the original `x`, before `f`. So filter first, then map. `filter p (map f xs)` would test the changed values instead.",
    },
    {
      k: "read",
      body: md(
        "You can have several generators. The comprehension then tries every combination, like nested loops. The last generator changes fastest:",
        "",
        "```",
        "[(x, y) | x <- [1, 2], y <- \"ab\"]",
        "  is  [(1,'a'), (1,'b'), (2,'a'), (2,'b')]",
        "```",
        "",
        "All combinations of two lists is called the cartesian product. A later generator can use names from earlier ones:",
        "",
        "```",
        "[(x, y) | x <- [1 .. 3], y <- [x .. 3]]    -- pairs with x <= y",
        "```",
      ),
    },
    { k: "try", code: "[(x, y) | x <- [1, 2], y <- \"ab\"]" },
    {
      k: "predict",
      expr: "length [(x, y) | x <- [1 .. 3], y <- [1 .. 4]]",
      answer: "12",
      why: "Every one of the 3 `x`s is paired with every one of the 4 `y`s: 3 × 4 = 12 pairs.",
    },
    {
      k: "predict",
      expr: "[(x, y) | x <- [1 .. 3], y <- [x .. 3]]",
      answer: "[(1,1),(1,2),(1,3),(2,2),(2,3),(3,3)]",
      why: "For `x = 1`, `y` goes 1, 2, 3; for `x = 2`, `y` goes 2, 3; for `x = 3`, just 3.",
    },
    {
      k: "write",
      body: md(
        "Write `pairsSumTo n xs`: all pairs `(a, b)` with `a` and `b` drawn from `xs`, `a < b`, and `a + b == n`.",
        "",
        "```",
        "pairsSumTo 10 [1 .. 9]   is  [(1,9), (2,8), (3,7), (4,6)]",
        "```",
      ),
      starter: hs`pairsSumTo :: Int -> [Int] -> [(Int, Int)]
pairsSumTo n xs = undefined
`,
      tests: [
        { expr: "pairsSumTo 10 [1 .. 9]", expected: "[(1,9), (2,8), (3,7), (4,6)]" },
        { expr: "pairsSumTo 3 [1, 2]", expected: "[(1,2)]" },
        { expr: "pairsSumTo 5 []", expected: "[]" },
        { expr: "pairsSumTo 4 [2, 2]", expected: "[]", label: "a must be strictly less than b" },
      ],
      hint: "Two generators drawing from `xs`, then two filters: `[(a, b) | a <- xs, b <- xs, a < b, a + b == n]`.",
      solution: hs`pairsSumTo :: Int -> [Int] -> [(Int, Int)]
pairsSumTo n xs = [(a, b) | a <- xs, b <- xs, a < b, a + b == n]
`,
    },
    {
      k: "read",
      body: md(
        "The left of `<-` can be a pattern, not just a name. This is the comprehension you'll write most in exams, because exam data lives in lists of tuples:",
        "",
        "```",
        "table = [(\"hello\", 1), (\"x\", 9), (\"dolly\", 1)]",
        "",
        "[k | (k, v) <- table, v == 1]      is  [\"hello\", \"dolly\"]",
        "```",
        "",
        "`(k, v) <- table` takes each pair apart as it's drawn. That one line is the whole of 2011's `reverseLookUp` (2 marks).",
        "",
        "Bonus: if an element doesn't fit the pattern, it's quietly skipped, not an error. So `[x | Just x <- maybes]` keeps only the values inside the `Just`s.",
      ),
    },
    { k: "try", code: '[k | (k, v) <- [("hello", 1), ("x", 9), ("dolly", 1)], v == 1]' },
    {
      k: "predict",
      expr: "[x | Just x <- [Just 1, Nothing, Just 3]]",
      answer: "[1, 3]",
      why: "`Nothing` doesn't fit the pattern `Just x`, so it's skipped. The other two give 1 and 3.",
    },
    {
      k: "quiz",
      q: "What is `[a | (a, 'x') <- [(1, 'x'), (2, 'y'), (3, 'x')]]`?",
      options: ["`[1, 2, 3]`", "`[1, 3]`", "`[2]`", "A pattern-match error"],
      answer: 1,
      why: "The pattern `(a, 'x')` only fits pairs whose second part is `'x'`. Pairs that don't fit are skipped, so you get `[1, 3]`.",
    },
    {
      k: "write",
      body: md(
        "Write `namesOver n people`, which gives the names of everyone older than `n`, keeping the original order. Use a pattern in the generator.",
        "",
        "```",
        "namesOver 30 [(\"Ann\", 31), (\"Bob\", 25), (\"Cy\", 40)]   is  [\"Ann\", \"Cy\"]",
        "```",
      ),
      starter: hs`namesOver :: Int -> [(String, Int)] -> [String]
namesOver n people = undefined
`,
      tests: [
        { expr: `namesOver 30 [("Ann", 31), ("Bob", 25), ("Cy", 40)]`, expected: `["Ann", "Cy"]` },
        { expr: `namesOver 50 [("Ann", 31)]`, expected: "[]" },
        { expr: "namesOver 0 []", expected: "[]" },
        { expr: `namesOver 30 [("Dee", 30), ("Eve", 31)]`, expected: `["Eve"]`, label: "exactly n is not older" },
      ],
      hint: "`[name | (name, age) <- people, age > n]`",
      solution: hs`namesOver :: Int -> [(String, Int)] -> [String]
namesOver n people = [name | (name, age) <- people, age > n]
`,
    },
    {
      k: "write",
      setup: hs`type State = Int
data Label = C Char | Eps
  deriving (Eq, Show)
type Transition = (State, State, Label)
type Automaton = (State, [State], [Transition])

nda :: Automaton
nda = (1, [4], [(1, 2, C 'a'), (2, 3, Eps), (5, 7, Eps), (2, 4, C 'b'), (5, 9, Eps)])
`,
      body: md(
        "Exam 2014, Part I (2 marks): with these given types",
        "",
        "```",
        "type Transition = (State, State, Label)     -- (from, to, label)",
        "type Automaton  = (State, [State], [Transition])",
        "```",
        "",
        "write `transitionsFrom s a`: the transitions in `a` that start at state `s`, in their original order. If there are none, give `[]`.",
        "",
        "```",
        "transitionsFrom 5 nda   is  [(5,7,Eps), (5,9,Eps)]",
        "```",
        "",
        "Get the transitions out of the triple with a pattern, then use a pattern in the generator too.",
      ),
      starter: hs`transitionsFrom :: State -> Automaton -> [Transition]
transitionsFrom s a = undefined
`,
      tests: [
        { expr: "transitionsFrom 5 nda", expected: "[(5,7,Eps), (5,9,Eps)]" },
        { expr: "transitionsFrom 2 nda", expected: "[(2,3,Eps), (2,4,C 'b')]" },
        { expr: "transitionsFrom 1 nda", expected: "[(1,2,C 'a')]" },
        { expr: "transitionsFrom 4 nda", expected: "[]", label: "a state with no way out" },
        { expr: "transitionsFrom 8 nda", expected: "[]", label: "a state not in the automaton" },
      ],
      hint: "`transitionsFrom s (_, _, ts) = [(from, to, l) | (from, to, l) <- ts, from == s]`",
      solution: hs`transitionsFrom :: State -> Automaton -> [Transition]
transitionsFrom s (_, _, ts) = [(from, to, l) | (from, to, l) <- ts, from == s]
`,
    },
    {
      k: "read",
      body: md(
        "Often you need each element's position (its index). `zip [0 ..] xs` pairs every element with its index, counting from 0:",
        "",
        "```",
        "zip [0 ..] \"cat\"     is  [(0,'c'), (1,'a'), (2,'t')]",
        "```",
        "",
        "`[0 ..]` is infinite, but `zip` stops when the shorter list runs out, so that's fine. Now draw pairs from it:",
        "",
        "```",
        "[i | (i, c) <- zip [0 ..] \"banana\", c == 'a']     is  [1, 3, 5]",
        "```",
        "",
        "In 2010, `findSubstrings` had to return the indices where a substring occurs; this is exactly how.",
      ),
    },
    {
      k: "predict",
      expr: "[i | (i, x) <- zip [0 ..] [7, 3, 7, 7], x == 7]",
      answer: "[0, 2, 3]",
      why: "The 7s are at positions 0, 2 and 3 (counting from 0).",
    },
    {
      k: "write",
      body: md(
        "Write `positions x xs`: every index (from 0) at which `x` appears in `xs`.",
        "",
        "```",
        "positions 'a' \"banana\"   is  [1, 3, 5]",
        "```",
      ),
      starter: hs`positions :: Eq a => a -> [a] -> [Int]
positions x xs = undefined
`,
      tests: [
        { expr: `positions 'a' "banana"`, expected: "[1, 3, 5]" },
        { expr: "positions 7 [7, 3, 7]", expected: "[0, 2]" },
        { expr: `positions 'z' "banana"`, expected: "[]" },
        { expr: "positions 1 []", expected: "[]" },
      ],
      hint: "`[i | (i, y) <- zip [0 ..] xs, y == x]`. Use a different name (like `y`) for the drawn element so it doesn't hide `x`.",
      solution: hs`positions :: Eq a => a -> [a] -> [Int]
positions x xs = [i | (i, y) <- zip [0 ..] xs, y == x]
`,
    },
    {
      k: "quiz",
      q: "What goes wrong with `positions x xs = [i | (i, x) <- zip [0 ..] xs]`?",
      options: [
        "Nothing, it works",
        "It's a type error",
        "The `x` in the pattern is a new name that hides the input `x`, so every index is returned",
        "It only returns the first index",
      ],
      answer: 2,
      why: "A pattern always makes new names; it never compares with an existing one. So `(i, x)` matches every pair. To compare, use a fresh name and a filter: `(i, y) <- ..., y == x`.",
    },
    {
      k: "read",
      body: md(
        "Comprehensions nest. A comprehension can be the thing you produce for each element, giving a list of lists:",
        "",
        "```",
        "[[x * y | y <- [1 .. 3]] | x <- [1 .. 2]]    is  [[1,2,3], [2,4,6]]",
        "```",
        "",
        "Going the other way, two generators flatten a list of lists, because the second can draw from the first:",
        "",
        "```",
        "[x | row <- [[1, 2], [3], []], x <- row]       is  [1, 2, 3]",
        "```",
        "",
        "You can also name something inside a comprehension with `let`: `[(w, n) | w <- ws, let n = length w, n > 3]`.",
      ),
    },
    {
      k: "predict",
      expr: "[x | row <- [[1, 2], [3], [], [4, 5]], x <- row, odd x]",
      answer: "[1, 3, 5]",
      why: "The two generators visit 1, 2, 3, 4, 5 in order, and the filter keeps the odd ones.",
    },
    {
      k: "predict",
      expr: '[(w, n) | w <- words "a big elephant", let n = length w, n > 1]',
      answer: '[("big", 3), ("elephant", 8)]',
      why: "`let n = length w` names the length for each word; the filter drops `\"a\"`, whose length is 1.",
    },
    {
      k: "write",
      body: md(
        "Write `multTable n`: an n-by-n multiplication table, as a list of rows.",
        "",
        "```",
        "multTable 3   is  [[1,2,3], [2,4,6], [3,6,9]]",
        "```",
      ),
      starter: hs`multTable :: Int -> [[Int]]
multTable n = undefined
`,
      tests: [
        { expr: "multTable 3", expected: "[[1,2,3], [2,4,6], [3,6,9]]" },
        { expr: "multTable 1", expected: "[[1]]" },
        { expr: "multTable 0", expected: "[]" },
        { expr: "length (multTable 5)", expected: "5" },
      ],
      hint: "An inner comprehension for each row: `[[r * c | c <- [1 .. n]] | r <- [1 .. n]]`.",
      solution: hs`multTable :: Int -> [[Int]]
multTable n = [[r * c | c <- [1 .. n]] | r <- [1 .. n]]
`,
    },
    {
      k: "quiz",
      q: "What is `length [() | x <- [1 .. 4], y <- [1 .. 4], x /= y]`?",
      options: ["4", "8", "12", "16"],
      answer: 2,
      why: "There are 4 × 4 = 16 combinations, and the filter removes the 4 where `x == y`, leaving 12.",
    },
    {
      k: "write",
      setup: hs`type AttName = String
type AttValue = String
type Attribute = (AttName, [AttValue])
type Header = [Attribute]
type Row = [AttValue]

header :: Header
header = [("outlook", ["sunny", "overcast", "rainy"]), ("temp", ["hot", "mild", "cool"]), ("wind", ["windy", "calm"]), ("result", ["good", "bad"])]

row0 :: Row
row0 = ["sunny", "hot", "calm", "bad"]
`,
      body: md(
        "Exam 2017, Part I (2 marks): each `Row` is a list of values, and the `Header` lists the attributes in the same order:",
        "",
        "```",
        "header = [(\"outlook\", [...]), (\"temp\", [...]), (\"wind\", [...]), (\"result\", [...])]",
        "row0   = [\"sunny\",         \"hot\",         \"calm\",         \"bad\"]",
        "```",
        "",
        "Write `removeAtt name header row`, which removes the value of the named attribute from the row, keeping the order.",
        "",
        "```",
        "removeAtt \"temp\" header row0   is  [\"sunny\", \"calm\", \"bad\"]",
        "```",
        "",
        "Zip the header with the row so each value sits next to its attribute, then filter.",
      ),
      starter: hs`removeAtt :: AttName -> Header -> Row -> Row
removeAtt name header row = undefined
`,
      tests: [
        { expr: `removeAtt "temp" header row0`, expected: `["sunny", "calm", "bad"]` },
        { expr: `removeAtt "outlook" header row0`, expected: `["hot", "calm", "bad"]` },
        { expr: `removeAtt "result" header row0`, expected: `["sunny", "hot", "calm"]` },
        { expr: `removeAtt "wind" header ["rainy", "mild", "windy", "good"]`, expected: `["rainy", "mild", "good"]` },
      ],
      hint: "`[v | ((n, _), v) <- zip header row, n /= name]`: the pattern takes apart each (attribute, value) pair.",
      solution: hs`removeAtt :: AttName -> Header -> Row -> Row
removeAtt name header row = [v | ((n, _), v) <- zip header row, n /= name]
`,
    },
  ],
};

const drillComprehensions: DrillSet = {
  id: "drill-comprehensions",
  lesson: "comprehensions",
  title: "List comprehension drills",
  drills: [
    { k: "predict", expr: "[x * 2 | x <- [1, 2, 3]]", answer: "[2, 4, 6]", why: "Each `x` is doubled." },
    {
      k: "quiz",
      q: "In `[x * 2 | x <- xs, x > 0]`, what is `x > 0` called?",
      options: ["A generator", "A filter (guard)", "A pattern", "A lambda"],
      answer: 1,
      why: "Anything after the bar that gives a Bool is a filter: elements that fail it are dropped. `x <- xs` is the generator.",
    },
    { k: "predict", expr: "[n | n <- [1 .. 10], mod n 3 == 0]", answer: "[3, 6, 9]", why: "Only the multiples of 3 pass the filter." },
    {
      k: "predict",
      expr: '[c | c <- "a1b2c3", isDigit c]',
      answer: '"123"',
      why: "Only the digit characters are kept, and a list of Chars is shown as a String.",
    },
    {
      k: "quiz",
      q: "What is `[(x, y) | x <- \"ab\", y <- [1, 2]]`?",
      options: [
        "`[('a',1), ('b',2)]`",
        "`[('a',1), ('a',2), ('b',1), ('b',2)]`",
        "`[('a',1), ('b',1), ('a',2), ('b',2)]`",
        "`[(\"ab\", [1, 2])]`",
      ],
      answer: 1,
      why: "The last generator changes fastest: for `'a'` try 1 then 2, then for `'b'` try 1 then 2. Pairing up side by side would be `zip`.",
    },
    {
      k: "predict",
      expr: "[x | (x, True) <- [(1, True), (2, False), (3, True)]]",
      answer: "[1, 3]",
      why: "Only pairs whose second part is `True` fit the pattern; the others are skipped.",
    },
    {
      k: "quiz",
      q: "Which is the same as `map fst table`?",
      options: ["`[k | (k, v) <- table, v]`", "`[k | (k, _) <- table]`", "`[(k, v) | k <- table]`", "`[fst | table]`"],
      answer: 1,
      why: "Draw each pair, take it apart, and keep the first part. `_` ignores the second.",
    },
    {
      k: "predict",
      expr: "[(i, c) | (i, c) <- zip [1 ..] \"hey\"]",
      answer: "[(1,'h'), (2,'e'), (3,'y')]",
      why: "`zip [1 ..]` numbers the characters from 1. `zip` stops when the String runs out.",
    },
    {
      k: "quiz",
      q: "What happens with `[x | Just x <- [Nothing, Nothing]]`?",
      options: ["A pattern-match error", "`[]`", "`[Nothing]`", "It never finishes"],
      answer: 1,
      why: "In a generator, elements that don't fit the pattern are skipped, so nothing is kept.",
    },
    {
      k: "predict",
      expr: "sum [x * y | x <- [1, 2], y <- [10, 100]]",
      answer: "330",
      why: "Every combination is multiplied: 1 × 10, 1 × 100, 2 × 10, 2 × 100. That's 10 + 100 + 20 + 200 = 330.",
    },
    {
      k: "write",
      body: "Write `lengths`, which gives the length of each String in a list, using a comprehension.",
      starter: hs`lengths :: [String] -> [Int]
lengths ws = undefined
`,
      tests: [
        { expr: `lengths ["a", "bb", ""]`, expected: "[1, 2, 0]" },
        { expr: "lengths []", expected: "[]" },
        { expr: `lengths ["hello"]`, expected: "[5]" },
        { expr: `lengths (words "the quick brown fox")`, expected: "[3, 5, 5, 3]" },
      ],
      hint: "`[length w | w <- ws]`",
      solution: hs`lengths :: [String] -> [Int]
lengths ws = [length w | w <- ws]
`,
    },
    {
      k: "quiz",
      q: "Which comprehension flattens a list of lists `xss` into one list?",
      options: ["`[xs | xs <- xss]`", "`[x | xs <- xss, x <- xs]`", "`[x | x <- xss]`", "`[[x] | xs <- xss]`"],
      answer: 1,
      why: "The first generator draws each inner list, the second draws each element from it. This is `concat`.",
    },
    {
      k: "write",
      body: "Write `vowelCount`, which counts the lowercase vowels (`a`, `e`, `i`, `o`, `u`) in a String. Build a list of the vowels with a comprehension and take its length.",
      starter: hs`vowelCount :: String -> Int
vowelCount s = undefined
`,
      tests: [
        { expr: `vowelCount "haskell"`, expected: "2" },
        { expr: `vowelCount "rhythm"`, expected: "0" },
        { expr: `vowelCount ""`, expected: "0" },
        { expr: `vowelCount "aeiou"`, expected: "5" },
      ],
      hint: "`length [c | c <- s, elem c \"aeiou\"]`",
      solution: hs`vowelCount :: String -> Int
vowelCount s = length [c | c <- s, elem c "aeiou"]
`,
    },
    {
      k: "predict",
      expr: "[[c] | c <- \"ab\"]",
      answer: '["a", "b"]',
      why: "Each character `c` becomes the one-character list `[c]`, which is a String.",
    },
    {
      k: "quiz",
      q: "Why is `[i | (i, x) <- zip [0 ..] xs]` safe even though `[0 ..]` is infinite?",
      options: [
        "It isn't safe: it never finishes",
        "`zip` stops as soon as the shorter list (`xs`) runs out",
        "GHC limits `[0 ..]` to 1000 elements",
        "Comprehensions ignore infinite lists",
      ],
      answer: 1,
      why: "`zip` pairs elements until either list ends, and laziness means the rest of `[0 ..]` is never built.",
    },
    {
      k: "write",
      body: md(
        "Write `grid w h`: all coordinates `(x, y)` with `x` from 0 to `w - 1` and `y` from 0 to `h - 1`, with `x` changing slowest.",
        "",
        "```",
        "grid 2 3   is  [(0,0),(0,1),(0,2),(1,0),(1,1),(1,2)]",
        "```",
      ),
      starter: hs`grid :: Int -> Int -> [(Int, Int)]
grid w h = undefined
`,
      tests: [
        { expr: "grid 2 3", expected: "[(0,0),(0,1),(0,2),(1,0),(1,1),(1,2)]" },
        { expr: "grid 1 1", expected: "[(0,0)]" },
        { expr: "grid 0 5", expected: "[]" },
        { expr: "length (grid 4 5)", expected: "20" },
      ],
      hint: "Two generators; the one that should change slowest comes first: `[(x, y) | x <- [0 .. w - 1], y <- [0 .. h - 1]]`.",
      solution: hs`grid :: Int -> Int -> [(Int, Int)]
grid w h = [(x, y) | x <- [0 .. w - 1], y <- [0 .. h - 1]]
`,
    },
    {
      k: "write",
      body: md(
        "Write `everyOther`, which keeps the elements at even positions (0, 2, 4, ...). Use `zip [0 ..]`.",
        "",
        "```",
        "everyOther \"abcdefg\"   is  \"aceg\"",
        "```",
      ),
      starter: hs`everyOther :: [a] -> [a]
everyOther xs = undefined
`,
      tests: [
        { expr: `everyOther "abcdefg"`, expected: `"aceg"` },
        { expr: "everyOther [1, 2]", expected: "[1]" },
        { expr: "everyOther ([] :: [Int])", expected: "[]" },
        { expr: "everyOther [5]", expected: "[5]" },
      ],
      hint: "`[x | (i, x) <- zip [0 ..] xs, even i]`",
      solution: hs`everyOther :: [a] -> [a]
everyOther xs = [x | (i, x) <- zip [0 ..] xs, even i]
`,
    },
    {
      k: "predict",
      expr: "[x | x <- [1 .. 5], y <- [1 .. x], x == y * y]",
      answer: "[1, 4]",
      why: "`x` is kept once for every `y` with `y * y == x`. Only 1 (1 × 1) and 4 (2 × 2) are perfect squares up to 5.",
    },
    {
      k: "quiz",
      q: "`table` is a list of `(String, Int)` pairs. Which gives the names paired with 0?",
      options: ["`[n | (n, 0) <- table]`", "`[n | n <- table, n == 0]`", "`[(n, 0) | n <- table]`", "`filter (== 0) table`"],
      answer: 0,
      why: "The pattern `(n, 0)` only fits pairs whose number is 0, and names the String `n`. (`[n | (n, v) <- table, v == 0]` would also work.)",
    },
    {
      k: "quiz",
      q: "Graph edges are pairs `(a, b)`. Which comprehension gives the nodes that `n` has an edge going to?",
      options: ["`[b | (a, b) <- es, a == n]`", "`[b | (n, b) <- es]`", "`[a | (a, b) <- es, b == n]`", "`[(n, b) | b <- es]`"],
      answer: 0,
      why: "Draw each edge, keep those starting at `n`, and give their end. `(n, b) <- es` looks right but doesn't work: the `n` in a pattern is a brand-new name, so it matches every edge.",
    },
    {
      k: "write",
      setup: hs`type Id = String
data Scope = Local | Global
  deriving (Eq, Show)
type Binding = (Id, (Scope, Int))
type State = [Binding]

sampleState :: State
sampleState = [("x", (Local, 5)), ("y", (Global, 2)), ("a", (Global, 7)), ("i", (Local, 0))]
`,
      body: md(
        "Exam 2015, Part I (2 marks): a state is a list of bindings, each remembering its variable's scope:",
        "",
        "```",
        "data Scope   = Local | Global",
        "type Binding = (Id, (Scope, Int))     -- simplified: values are Ints here",
        "type State   = [Binding]",
        "```",
        "",
        "Write `getLocals`, which keeps only the `Local` bindings, in their original order.",
        "",
        "```",
        "getLocals sampleState   is  [(\"x\",(Local,5)), (\"i\",(Local,0))]",
        "```",
      ),
      starter: hs`getLocals :: State -> State
getLocals st = undefined
`,
      tests: [
        { expr: "getLocals sampleState", expected: `[("x",(Local,5)), ("i",(Local,0))]` },
        { expr: "getLocals []", expected: "[]" },
        { expr: `getLocals [("g", (Global, 1))]`, expected: "[]" },
        { expr: `getLocals [("p", (Local, 1)), ("q", (Local, 2))]`, expected: `[("p",(Local,1)), ("q",(Local,2))]` },
      ],
      hint: "Use a nested pattern with the constructor: `[(v, (Local, n)) | (v, (Local, n)) <- st]`, or draw `(v, (sc, n))` and filter `sc == Local`.",
      solution: hs`getLocals :: State -> State
getLocals st = [(v, (sc, n)) | (v, (sc, n)) <- st, sc == Local]
`,
    },
    {
      k: "write",
      setup: hs`suffixes :: [a] -> [[a]]
suffixes [] = []
suffixes xs = xs : suffixes (tail xs)

isPrefix :: String -> String -> Bool
isPrefix pre s = take (length pre) s == pre
`,
      body: md(
        "Exam 2010, Part I (3 marks): `suffixes` and `isPrefix` are given:",
        "",
        "```",
        "suffixes \"bat\"          is  [\"bat\", \"at\", \"t\"]",
        "isPrefix \"ba\" \"banana\"  is  True",
        "```",
        "",
        "Write `findSubstrings sub s`: every index at which `sub` occurs in `s`.",
        "",
        "```",
        "findSubstrings \"an\" \"banana\"      is  [1, 3]",
        "findSubstrings \"s\" \"mississippi\"  is  [2, 3, 5, 6]",
        "```",
        "",
        "Key idea: `sub` occurs at index `i` exactly when it's a prefix of the suffix starting at `i`.",
      ),
      starter: hs`findSubstrings :: String -> String -> [Int]
findSubstrings sub s = undefined
`,
      tests: [
        { expr: `findSubstrings "an" "banana"`, expected: "[1, 3]", unordered: true },
        { expr: `findSubstrings "s" "mississippi"`, expected: "[2, 3, 5, 6]", unordered: true },
        { expr: `findSubstrings "xyz" "banana"`, expected: "[]" },
        { expr: `findSubstrings "banana" "banana"`, expected: "[0]" },
        { expr: `findSubstrings "ana" "banana"`, expected: "[1, 3]", unordered: true, label: "overlapping matches both count" },
      ],
      hint: "`[i | (i, suf) <- zip [0 ..] (suffixes s), isPrefix sub suf]`",
      solution: hs`findSubstrings :: String -> String -> [Int]
findSubstrings sub s = [i | (i, suf) <- zip [0 ..] (suffixes s), isPrefix sub suf]
`,
    },
    {
      k: "write",
      setup: hs`type Edge a = (a, a)
type Graph a = ([a], [Edge a])

fig1Left :: Graph Int
fig1Left = ([1, 2, 3, 4], [(1, 2), (1, 3), (2, 4), (3, 4)])
`,
      body: md(
        "Exam 2021, Part I (3 marks): a graph is a list of nodes and a list of edges:",
        "",
        "```",
        "type Edge a  = (a, a)",
        "type Graph a = ([a], [Edge a])",
        "```",
        "",
        "Write `neighbours n g`: the nodes joined to `n` by an edge, in either direction.",
        "",
        "```",
        "neighbours 2 fig1Left   is  [1, 4]     -- in any order",
        "```",
      ),
      starter: hs`neighbours :: Eq a => a -> Graph a -> [a]
neighbours n g = undefined
`,
      tests: [
        { expr: "neighbours 2 fig1Left", expected: "[1, 4]", unordered: true },
        { expr: "neighbours 1 fig1Left", expected: "[2, 3]", unordered: true },
        { expr: "neighbours 4 fig1Left", expected: "[2, 3]", unordered: true },
        { expr: "neighbours 1 ([1], [])", expected: "[]" },
      ],
      hint: "Two comprehensions joined with `++`: `[b | (a, b) <- es, a == n] ++ [a | (a, b) <- es, b == n]`, where `(_, es) = g`.",
      solution: hs`neighbours :: Eq a => a -> Graph a -> [a]
neighbours n (_, es) = [b | (a, b) <- es, a == n] ++ [a | (a, b) <- es, b == n]
`,
    },
    {
      k: "write",
      setup: hs`type Edge a = (a, a)
type Graph a = ([a], [Edge a])

fig1Left :: Graph Int
fig1Left = ([1, 2, 3, 4], [(1, 2), (1, 3), (2, 4), (3, 4)])
`,
      body: md(
        "Exam 2021, Part I (3 marks): write `degrees g`, pairing every node with its degree: the number of edges that begin or end at it. Nodes with no edges have degree 0.",
        "",
        "```",
        "degrees ([1], [])    is  [(1, 0)]",
        "degrees fig1Left     is  [(1,2), (2,2), (3,2), (4,2)]",
        "```",
        "",
        "Draw each node from the node list, and count with an inner comprehension.",
      ),
      starter: hs`degrees :: Eq a => Graph a -> [(a, Int)]
degrees g = undefined
`,
      tests: [
        { expr: "degrees ([1], [])", expected: "[(1, 0)]" },
        { expr: "degrees fig1Left", expected: "[(1,2), (2,2), (3,2), (4,2)]", unordered: true },
        { expr: `degrees (["a", "b", "c"], [("a", "b"), ("a", "c")])`, expected: `[("a",2), ("b",1), ("c",1)]`, unordered: true },
        { expr: "degrees ([] :: [Int], [])", expected: "[]" },
      ],
      hint: "Take the graph apart as `(ns, es)`. Then `[(n, length [() | (a, b) <- es, a == n || b == n]) | n <- ns]`: the inner list has one `()` for each edge touching `n`.",
      solution: hs`degrees :: Eq a => Graph a -> [(a, Int)]
degrees (ns, es) = [(n, length [() | (a, b) <- es, a == n || b == n]) | n <- ns]
`,
    },
    {
      k: "write",
      setup: hs`import Data.List (nub)

type State = Int
data Label = C Char | Eps
  deriving (Eq, Show)
type Transition = (State, State, Label)
`,
      body: md(
        "Exam 2014, Part I (1 mark): write `labels ts`: the labels used in the transitions, with no duplicates and with `Eps` left out, in the order they first appear. `nub` (from Data.List, already imported) removes duplicates.",
        "",
        "```",
        "labels [(1,2,Eps)]                                 is  []",
        "labels [(1,2,C 'a'), (2,3,Eps), (3,1,C 'a'), (1,4,C 'b')]   is  [C 'a', C 'b']",
        "```",
      ),
      starter: hs`labels :: [Transition] -> [Label]
labels ts = undefined
`,
      tests: [
        { expr: "labels [(1, 2, Eps)]", expected: "[]" },
        { expr: "labels [(1, 2, C 'a'), (2, 3, Eps), (3, 1, C 'a'), (1, 4, C 'b')]", expected: "[C 'a', C 'b']" },
        { expr: "labels []", expected: "[]" },
        { expr: "labels [(5, 7, C 'c'), (7, 5, C 'b'), (5, 5, C 'c')]", expected: "[C 'c', C 'b']" },
      ],
      hint: "`nub [l | (_, _, l) <- ts, l /= Eps]`",
      solution: hs`labels :: [Transition] -> [Label]
labels ts = nub [l | (_, _, l) <- ts, l /= Eps]
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Lesson 3: Lookup tables (association lists)
// ---------------------------------------------------------------------------

const tables: Lesson = {
  id: "tables",
  title: "Lookup tables (association lists)",
  blurb: "lookUp, remove, update and friends: Part I of nearly every exam.",
  steps: [
    {
      k: "read",
      body: md(
        "A lookup table is a list of pairs: a key and the value that goes with it. Haskell people call it an association list.",
        "",
        "```",
        "ages :: [(String, Int)]",
        "ages = [(\"ann\", 31), (\"bob\", 25), (\"cy\", 40)]",
        "```",
        "",
        "Exams give these tables names with `type`, which just makes a new name for an existing type:",
        "",
        "```",
        "type Env   = [(Index, Bool)]      -- 2009: which variables are True",
        "type State = [(Id, Int)]          -- 2018: the value of each variable",
        "type IdMap = [(Id, Id)]           -- 2021: renaming variables",
        "```",
        "",
        "Part I of almost every January test asks you to write, or use, small functions on tables like these. They're quick marks if you know the patterns in this lesson.",
      ),
    },
    {
      k: "try",
      code: "lookup \"bob\" [(\"ann\", 31), (\"bob\", 25), (\"cy\", 40)]",
      after: "The Prelude's `lookup` gives `Just` the value if the key is there.",
    },
    {
      k: "quiz",
      q: "What is `lookup \"dan\" [(\"ann\", 31), (\"bob\", 25)]`?",
      options: ["`0`", "`Nothing`", "An error", "`Just 0`"],
      answer: 1,
      why: "`lookup :: Eq a => a -> [(a, b)] -> Maybe b`. When the key is missing it gives `Nothing` rather than crashing.",
    },
    {
      k: "read",
      body: md(
        "Most exams want `lookUp` (capital U) with a precondition: the key is always in the table. So it can give the plain value, not a Maybe:",
        "",
        "```",
        "lookUp :: Eq a => a -> [(a, b)] -> b",
        "```",
        "",
        "In 2009 it was worth 1 mark; in 2011, 2012, 2014 and 2019 you had to write it again; from 2015 on it was given in the template. There are three standard ways to write it.",
        "",
        "Way 1, recursion: check the first pair, otherwise look in the rest.",
        "",
        "```",
        "lookUp x ((k, v) : rest)",
        "  | x == k    = v",
        "  | otherwise = lookUp x rest",
        "```",
        "",
        "There's no equation for `[]`: the precondition says we never get there. (If we did, Haskell would stop with a \"non-exhaustive patterns\" error.)",
      ),
    },
    {
      k: "write",
      body: "Write `lookUp` by recursion (Way 1). You may not use the Prelude's `lookup`.",
      starter: hs`lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x table = undefined
`,
      banned: ["lookup"],
      tests: [
        { expr: `lookUp "x" [("hello", 1), ("x", 9), ("dolly", 1)]`, expected: "9" },
        { expr: "lookUp 5 [(4, 1), (5, 2), (9, 9)]", expected: "2" },
        { expr: "lookUp (2, 1) [((1, 2), True), ((2, 1), False)]", expected: "False", label: "keys can be pairs too (2009)" },
        { expr: `lookUp 1 [(1, "first"), (1, "second")]`, expected: `"first"`, label: "the first match wins" },
      ],
      hint: "Pattern match the table as `((k, v) : rest)`, then guards: `x == k` gives `v`, otherwise recurse on `rest`.",
      solution: hs`lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x ((k, v) : rest)
  | x == k    = v
  | otherwise = lookUp x rest
`,
    },
    {
      k: "read",
      body: md(
        "Way 2, a comprehension: collect every value whose key matches, and take the first.",
        "",
        "```",
        "lookUp x table = head [v | (k, v) <- table, k == x]",
        "```",
        "",
        "Way 3, use the Prelude's `lookup` and unwrap the Maybe. `fromJust` (from Data.Maybe) takes the value out of a `Just`:",
        "",
        "```",
        "lookUp x table = fromJust (lookup x table)",
        "```",
        "",
        "The templates from 2015 on use a nicer version of Way 3 that prints a helpful message if the key is missing:",
        "",
        "```",
        "lookUp i table",
        "  = fromMaybe (error (\"lookup failed on identifier: \" ++ show i))",
        "              (lookup i table)",
        "```",
      ),
    },
    {
      k: "write",
      body: "Write `lookUp` again, this time as a one-line comprehension (Way 2). You may not use `lookup`.",
      starter: hs`lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x table = undefined
`,
      banned: ["lookup"],
      tests: [
        { expr: `lookUp "x" [("hello", 1), ("x", 9), ("dolly", 1)]`, expected: "9" },
        { expr: "lookUp 'b' [('a', True), ('b', False)]", expected: "False" },
        { expr: `lookUp 3 [(3, "only")]`, expected: `"only"` },
        { expr: `lookUp 1 [(2, "x"), (1, "first"), (1, "second")]`, expected: `"first"`, label: "the first match wins" },
      ],
      hint: "`head [v | (k, v) <- table, k == x]`",
      solution: hs`lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x table = head [v | (k, v) <- table, k == x]
`,
    },
    {
      k: "predict",
      expr: 'head [v | (k, v) <- [(1, "a"), (2, "b"), (1, "c")], k == 1]',
      answer: '"a"',
      why: 'The comprehension gives `["a", "c"]` (both values with key 1), and `head` takes the first.',
    },
    {
      k: "quiz",
      q: "A table has the same key twice: `[(\"x\", 1), (\"x\", 2)]`. What do `lookup \"x\"` and all three versions of `lookUp \"x\"` find?",
      options: ["The first binding, 1", "The last binding, 2", "Both, added together", "An error"],
      answer: 0,
      why: "They all search from the front and stop at the first match. This matters for `update`: putting a new pair at the front hides older ones.",
    },
    {
      k: "read",
      body: md(
        "Sometimes a missing key is normal, and you want a default value instead. 2011 called this `tryToLookUp`:",
        "",
        "```",
        "tryToLookUp :: Eq a => a -> b -> [(a, b)] -> b",
        "tryToLookUp \"k\" 0 [(\"hello\", 1), (\"x\", 9)]     is  0",
        "```",
        "",
        "`fromMaybe` (from Data.Maybe) is made for this. `fromMaybe d m` gives the value inside `m` if it's a `Just`, and `d` if it's `Nothing`:",
        "",
        "```",
        "fromMaybe 0 (Just 5)    is  5",
        "fromMaybe 0 Nothing     is  0",
        "```",
      ),
    },
    { k: "try", code: 'fromMaybe 0 (lookup "x" [("y", 1)])' },
    {
      k: "predict",
      expr: 'fromMaybe 0 (lookup "y" [("y", 5)])',
      answer: "5",
      why: "`lookup` finds `Just 5`, so `fromMaybe` gives the 5 inside it.",
    },
    {
      k: "write",
      setup: "import Data.Maybe (fromMaybe)\n",
      body: md(
        "Exam 2011, Part I: write `tryToLookUp key def table`. It gives the value for `key`, or `def` if the key isn't in the table. (Data.Maybe is imported for you.)",
        "",
        "```",
        "tryToLookUp \"k\" 0 [(\"hello\", 1), (\"x\", 9)]   is  0",
        "tryToLookUp \"x\" 0 [(\"hello\", 1), (\"x\", 9)]   is  9",
        "```",
      ),
      starter: hs`tryToLookUp :: Eq a => a -> b -> [(a, b)] -> b
tryToLookUp key def table = undefined
`,
      tests: [
        { expr: `tryToLookUp "k" 0 [("hello", 1), ("x", 9), ("dolly", 1)]`, expected: "0" },
        { expr: `tryToLookUp "x" 0 [("hello", 1), ("x", 9), ("dolly", 1)]`, expected: "9" },
        { expr: `tryToLookUp 'a' "none" []`, expected: `"none"` },
        { expr: "tryToLookUp 2 False [(1, False), (2, True)]", expected: "True" },
      ],
      hint: "`fromMaybe def (lookup key table)`",
      solution: hs`tryToLookUp :: Eq a => a -> b -> [(a, b)] -> b
tryToLookUp key def table = fromMaybe def (lookup key table)
`,
    },
    {
      k: "read",
      body: md(
        "Looking up backwards: given a value, find every key that has it. 2011's `reverseLookUp` (2 marks):",
        "",
        "```",
        "reverseLookUp :: Eq b => b -> [(a, b)] -> [a]",
        "reverseLookUp 1 [(\"hello\", 1), (\"x\", 9), (\"dolly\", 1)]   is  [\"hello\", \"dolly\"]",
        "```",
        "",
        "Several keys can share a value, so the answer is a list. A comprehension with a pattern does it in one line.",
      ),
    },
    {
      k: "write",
      body: "Write `reverseLookUp`.",
      starter: hs`reverseLookUp :: Eq b => b -> [(a, b)] -> [a]
reverseLookUp val table = undefined
`,
      tests: [
        { expr: `reverseLookUp 1 [("hello", 1), ("x", 9), ("dolly", 1)]`, expected: `["hello", "dolly"]` },
        { expr: `reverseLookUp 9 [("hello", 1), ("x", 9), ("dolly", 1)]`, expected: `["x"]` },
        { expr: `reverseLookUp 5 [("hello", 1)]`, expected: "[]" },
        { expr: "reverseLookUp 'a' ([] :: [(Int, Char)])", expected: "[]" },
      ],
      hint: "`[k | (k, v) <- table, v == val]`",
      solution: hs`reverseLookUp :: Eq b => b -> [(a, b)] -> [a]
reverseLookUp val table = [k | (k, v) <- table, v == val]
`,
    },
    {
      k: "predict",
      expr: '[k | (k, v) <- [("a", 1), ("b", 2), ("c", 1)], v == 1]',
      answer: '["a", "c"]',
      why: 'The keys whose value is 1 are `"a"` and `"c"`.',
    },
    {
      k: "read",
      body: md(
        "Removing a key. 2017's `remove` (2 marks):",
        "",
        "```",
        "remove :: Eq a => a -> [(a, b)] -> [(a, b)]",
        "remove 1 [(3,'a'), (1,'b'), (7,'a')]    is  [(3,'a'), (7,'a')]",
        "remove 6 []                             is  []",
        "```",
        "",
        "\"Remove\" really means \"keep all the others\", so it's a filter on the keys:",
        "",
        "```",
        "remove x table = [(k, v) | (k, v) <- table, k /= x]",
        "remove x table = filter ((/= x) . fst) table      -- the same thing",
        "```",
        "",
        "`(/= x) . fst` reads \"take the first part, then check it isn't `x`\".",
      ),
    },
    {
      k: "predict",
      expr: "filter ((/= 2) . fst) [(1, 'a'), (2, 'b'), (3, 'c')]",
      answer: "[(1,'a'), (3,'c')]",
      why: "Only the pair whose first part is 2 fails the test.",
    },
    {
      k: "write",
      body: "Exam 2017, Part I (2 marks): write `remove`. If the key isn't there, the table comes back unchanged.",
      starter: hs`remove :: Eq a => a -> [(a, b)] -> [(a, b)]
remove x table = undefined
`,
      tests: [
        { expr: "remove 1 [(3, 'a'), (1, 'b'), (7, 'a')]", expected: "[(3, 'a'), (7, 'a')]" },
        { expr: "remove 6 ([] :: [(Int, Char)])", expected: "[]" },
        { expr: "remove 9 [(3, 'a'), (1, 'b')]", expected: "[(3, 'a'), (1, 'b')]", label: "missing key: table unchanged" },
        { expr: `remove "x" [("x", 1), ("y", 2), ("x", 3)]`, expected: `[("y", 2)]`, label: "removes every binding for the key" },
      ],
      hint: "`[(k, v) | (k, v) <- table, k /= x]`",
      solution: hs`remove :: Eq a => a -> [(a, b)] -> [(a, b)]
remove x table = [(k, v) | (k, v) <- table, k /= x]
`,
    },
    {
      k: "quiz",
      q: "Why is the type `remove :: Eq a => a -> [(a, b)] -> [(a, b)]` and not `(Eq a, Eq b) => ...`?",
      options: [
        "It's a mistake in the exam",
        "Only the keys are compared with `/=`; the values are just copied, so they don't need `Eq`",
        "Values can never be compared",
        "`b` is always a number",
      ],
      answer: 1,
      why: "A class constraint is only needed for the operations you actually use on that type. Read exam types closely: they tell you what you're allowed to do.",
    },
    {
      k: "read",
      body: md(
        "Updating: give a key a new value, or add it if it's not there yet. This is \"insert or replace\". 2018's `update` (2 marks):",
        "",
        "```",
        "update :: (Id, Int) -> State -> State",
        "update (\"x\", 3) [(\"x\",7), (\"y\",8)]    is  [(\"x\",3), (\"y\",8)]",
        "update (\"z\", 0) [(\"x\",7), (\"y\",8)]    is  [(\"z\",0), (\"x\",7), (\"y\",8)]",
        "```",
        "",
        "The spec said \"the order of the elements in the resulting state is not important\". That allows the neat trick: remove the old binding (if any), then put the new one on the front.",
        "",
        "```",
        "update (k, v) table = (k, v) : remove k table",
        "```",
        "",
        "Reusing a function you wrote earlier in the exam is normal and expected.",
      ),
    },
    {
      k: "write",
      setup: hs`type Id = String
type State = [(Id, Int)]

remove :: Eq a => a -> [(a, b)] -> [(a, b)]
remove x table = [(k, v) | (k, v) <- table, k /= x]
`,
      body: "Exam 2018, Part I (2 marks): write `update`. `remove` is given. The order of the result doesn't matter (the tests ignore it), but there must be exactly one binding for the key.",
      starter: hs`update :: (Id, Int) -> State -> State
update (k, v) st = undefined
`,
      tests: [
        { expr: `update ("x", 3) [("x", 7), ("y", 8)]`, expected: `[("x", 3), ("y", 8)]`, unordered: true },
        { expr: `update ("z", 0) [("x", 7), ("y", 8)]`, expected: `[("z", 0), ("x", 7), ("y", 8)]`, unordered: true },
        { expr: `update ("a", 1) []`, expected: `[("a", 1)]` },
        { expr: `length (update ("y", 1) [("x", 7), ("y", 8)])`, expected: "2", label: "replacing doesn't add a second binding" },
      ],
      hint: "`(k, v) : remove k st`",
      solution: hs`update :: (Id, Int) -> State -> State
update (k, v) st = (k, v) : remove k st
`,
    },
    {
      k: "quiz",
      q: "What's wrong with `update (k, v) st = (k, v) : st`?",
      options: [
        "Nothing, it's correct",
        "It's a type error",
        "The old binding stays in the table too, so there are two bindings for `k`",
        "It loses all the other bindings",
      ],
      answer: 2,
      why: "`lookUp` would still find the right value (the new one is first), but the table now has duplicates, and exam tests that compare the whole table will fail.",
    },
    {
      k: "read",
      body: md(
        "A mapping is a table where each key has a list of values. 2017's `addToMapping` (3 marks) adds one value:",
        "",
        "```",
        "addToMapping :: Eq a => (a, b) -> [(a, [b])] -> [(a, [b])]",
        "addToMapping (1,'a') [(2,\"b\")]               is  [(2,\"b\"), (1,\"a\")]",
        "addToMapping (5,'a') [(2,\"b\"), (5,\"bcd\")]    is  [(2,\"b\"), (5,\"abcd\")]",
        "```",
        "",
        "If the key exists, put the new value on the front of its list; if not, add `(x, [v])`. A `case` on `lookup` handles the two situations:",
        "",
        "```",
        "addToMapping (x, v) m",
        "  = case lookup x m of",
        "      Nothing -> (x, [v]) : m",
        "      Just vs -> (x, v : vs) : remove x m",
        "```",
      ),
    },
    {
      k: "write",
      setup: hs`remove :: Eq a => a -> [(a, b)] -> [(a, b)]
remove x table = [(k, v) | (k, v) <- table, k /= x]
`,
      body: "Exam 2017, Part I (3 marks): write `addToMapping`. `remove` is given. The order of the pairs in the result doesn't matter.",
      starter: hs`addToMapping :: Eq a => (a, b) -> [(a, [b])] -> [(a, [b])]
addToMapping (x, v) m = undefined
`,
      tests: [
        { expr: `addToMapping (1, 'a') [(2, "b")]`, expected: `[(2, "b"), (1, "a")]`, unordered: true },
        { expr: `addToMapping (5, 'a') [(2, "b"), (5, "bcd")]`, expected: `[(2, "b"), (5, "abcd")]`, unordered: true },
        { expr: `addToMapping (1, 'x') []`, expected: `[(1, "x")]` },
        { expr: `addToMapping (1, 'y') (addToMapping (1, 'x') [])`, expected: `[(1, "yx")]`, label: "adding twice to the same key" },
      ],
      hint: "`case lookup x m of Nothing -> (x, [v]) : m; Just vs -> (x, v : vs) : remove x m`",
      solution: hs`addToMapping :: Eq a => (a, b) -> [(a, [b])] -> [(a, [b])]
addToMapping (x, v) m
  = case lookup x m of
      Nothing -> (x, [v]) : m
      Just vs -> (x, v : vs) : remove x m
`,
    },
    {
      k: "read",
      body: md(
        "Counting. 2021 started with `count` (1 mark): how many times an item appears in a list.",
        "",
        "```",
        "count :: Eq a => a -> [a] -> Int",
        "count 3 [2,4,1,3,2,3,3]   is  3",
        "```",
        "",
        "The simplest version: keep the matching items and take the length: `length (filter (== x) xs)`.",
        "",
        "A frequency table pairs each possible value with its count. 2017's `buildFrequencyTable` (3 marks) had a trap: values that never appear must still be listed with count 0. So don't build the table from the data; build it from the list of possible values:",
        "",
        "```",
        "[(v, count v xs) | v <- possibleValues]",
        "```",
      ),
    },
    {
      k: "predict",
      expr: "length (filter (== 'a') \"banana\")",
      answer: "3",
      why: "`filter (== 'a')` keeps `\"aaa\"`, which has length 3.",
    },
    {
      k: "write",
      body: "Exam 2021, Part I (1 mark): write `count`.",
      starter: hs`count :: Eq a => a -> [a] -> Int
count x xs = undefined
`,
      tests: [
        { expr: "count 3 [2, 4, 1, 3, 2, 3, 3]", expected: "3" },
        { expr: `count 'a' "b"`, expected: "0" },
        { expr: "count 1 []", expected: "0" },
        { expr: `count "hi" ["hi", "ho", "hi"]`, expected: "2" },
      ],
      hint: "`length (filter (== x) xs)`, or `length [y | y <- xs, y == x]`.",
      solution: hs`count :: Eq a => a -> [a] -> Int
count x xs = length (filter (== x) xs)
`,
    },
    {
      k: "write",
      setup: hs`count :: Eq a => a -> [a] -> Int
count x xs = length (filter (== x) xs)
`,
      body: md(
        "Write `frequencies values xs`: pair every possible value (from `values`, in that order) with how many times it appears in `xs`. Values that never appear get 0. `count` is given.",
        "",
        "```",
        "frequencies \"abc\" \"banana\"   is  [('a',3), ('b',1), ('c',0)]",
        "```",
      ),
      starter: hs`frequencies :: Eq a => [a] -> [a] -> [(a, Int)]
frequencies values xs = undefined
`,
      tests: [
        { expr: `frequencies "abc" "banana"`, expected: "[('a',3), ('b',1), ('c',0)]" },
        { expr: `frequencies ["good", "bad"] ["good", "bad", "good"]`, expected: `[("good",2), ("bad",1)]` },
        { expr: "frequencies [1, 2] []", expected: "[(1,0), (2,0)]", label: "empty data: every count is 0" },
        { expr: "frequencies [] [1, 2, 3]", expected: "([] :: [(Int, Int)])" },
      ],
      hint: "Draw from `values`, not from `xs`: `[(v, count v xs) | v <- values]`.",
      solution: hs`frequencies :: Eq a => [a] -> [a] -> [(a, Int)]
frequencies values xs = [(v, count v xs) | v <- values]
`,
    },
    {
      k: "quiz",
      q: "Why does `frequencies` draw from the list of possible values rather than from the data?",
      options: [
        "It's faster",
        "So that values which never occur still appear, with count 0",
        "Because `count` only works on possible values",
        "To sort the result",
      ],
      answer: 1,
      why: "Drawing from the data could only ever list values that occur (and would list them once per occurrence). In 2017 the spec's example with an empty data set expected `[(\"sunny\",0),(\"overcast\",0),(\"rainy\",0)]`.",
    },
  ],
};

const drillTables: DrillSet = {
  id: "drill-tables",
  lesson: "tables",
  title: "Lookup table drills",
  drills: [
    { k: "predict", expr: "lookup 2 [(1, 'a'), (2, 'b')]", answer: "Just 'b'", why: "Key 2 is there, paired with `'b'`." },
    {
      k: "quiz",
      q: "What is the type of the Prelude's `lookup`?",
      options: ["`Eq a => a -> [(a, b)] -> b`", "`Eq a => a -> [(a, b)] -> Maybe b`", "`a -> [b] -> Maybe b`", "`Eq b => b -> [(a, b)] -> [a]`"],
      answer: 1,
      why: "It gives a `Maybe b` because the key might be missing. The exam's `lookUp` drops the Maybe by assuming the key is present.",
    },
    { k: "predict", expr: "lookup 'z' [('a', 1)]", answer: "Nothing", why: "`'z'` isn't a key in the table." },
    { k: "predict", expr: "fromMaybe 10 (lookup 3 [(3, 7)])", answer: "7", why: "The key is found, so the default 10 isn't used." },
    {
      k: "quiz",
      q: "The spec says: \"A precondition is that the search item is in the given list.\" What does that let you do?",
      options: [
        "Return `Nothing` when it isn't",
        "Ignore the case where it isn't, e.g. leave out the `[]` equation",
        "Sort the list first",
        "Nothing: you must still handle every case",
      ],
      answer: 1,
      why: "A precondition is a promise that the tests will never break it. You don't need to handle that case, and no marks are given for doing so.",
    },
    { k: "predict", expr: "fromMaybe 10 (lookup 4 [(3, 7)])", answer: "10", why: "Key 4 is missing, so `lookup` gives `Nothing` and `fromMaybe` gives the default." },
    {
      k: "predict",
      expr: "map fst [(\"a\", 1), (\"b\", 2)]",
      answer: '["a", "b"]',
      why: "`fst` takes the key from each pair, so `map fst` lists all the keys.",
    },
    {
      k: "quiz",
      q: "Which expression checks whether key `k` is in `table`?",
      options: ["`elem k table`", "`elem k (map fst table)`", "`lookup k table == True`", "`k <- table`"],
      answer: 1,
      why: "`table` contains pairs, not keys, so first list the keys with `map fst`. (`lookup k table /= Nothing` would also work.)",
    },
    {
      k: "predict",
      expr: "[v | (k, v) <- [(1, 'x'), (2, 'y'), (1, 'z')], k == 1]",
      answer: '"xz"',
      why: "Both values with key 1 are collected. A list of Chars is shown as a String.",
    },
    {
      k: "quiz",
      q: "What is `head [v | (k, v) <- [(1, 'a')], k == 2]`?",
      options: ["`'a'`", "`Nothing`", "An exception: `head` of an empty list", "`' '`"],
      answer: 2,
      why: "No pair matches, so the comprehension is `[]`, and `head []` crashes. That's why the comprehension `lookUp` relies on its precondition.",
    },
    {
      k: "write",
      body: "Write `hasKey k table`, which is `True` if `k` is one of the keys.",
      starter: hs`hasKey :: Eq a => a -> [(a, b)] -> Bool
hasKey k table = undefined
`,
      tests: [
        { expr: `hasKey "b" [("a", 1), ("b", 2)]`, expected: "True" },
        { expr: `hasKey "c" [("a", 1), ("b", 2)]`, expected: "False" },
        { expr: "hasKey 1 ([] :: [(Int, Int)])", expected: "False" },
        { expr: "hasKey 2 [(1, 2)]", expected: "False", label: "2 is a value here, not a key" },
      ],
      hint: "`elem k (map fst table)`",
      solution: hs`hasKey :: Eq a => a -> [(a, b)] -> Bool
hasKey k table = elem k (map fst table)
`,
    },
    {
      k: "predict",
      expr: "[(v, k) | (k, v) <- [(1, 'a'), (2, 'b')]]",
      answer: "[('a',1), ('b',2)]",
      why: "Each pair is taken apart and put back together the other way round.",
    },
    {
      k: "quiz",
      q: "`update (k, v) t = (k, v) : remove k t`. When is this correct?",
      options: [
        "Only if `k` is already in `t`",
        "Only if `k` is not in `t`",
        "In both cases, as long as the order of the result doesn't matter",
        "Never",
      ],
      answer: 2,
      why: "If `k` is there, `remove` takes the old binding out first; if not, `remove` changes nothing. Either way the new pair goes on the front. The spec allowed any order.",
    },
    {
      k: "write",
      body: "Write `lookUpAll k table`: every value paired with `k`, in order.",
      starter: hs`lookUpAll :: Eq a => a -> [(a, b)] -> [b]
lookUpAll k table = undefined
`,
      tests: [
        { expr: "lookUpAll 1 [(1, 'x'), (2, 'y'), (1, 'z')]", expected: `"xz"` },
        { expr: "lookUpAll 3 [(1, 'x')]", expected: `""` },
        { expr: `lookUpAll "a" [("a", 5)]`, expected: "[5]" },
        { expr: "lookUpAll 0 ([] :: [(Int, Int)])", expected: "[]" },
      ],
      hint: "`[v | (k', v) <- table, k' == k]` (a new name like `k'` for the drawn key, so it doesn't hide `k`).",
      solution: hs`lookUpAll :: Eq a => a -> [(a, b)] -> [b]
lookUpAll k table = [v | (k', v) <- table, k' == k]
`,
    },
    {
      k: "quiz",
      q: "Which of these is NOT a correct `count x xs`?",
      options: ["`length (filter (== x) xs)`", "`length [y | y <- xs, y == x]`", "`sum [1 | y <- xs, y == x]`", "`length [x | x <- xs]`"],
      answer: 3,
      why: "In `[x | x <- xs]`, the `x` in the generator is a new name that hides the input `x`, so it just copies the whole list. It gives `length xs`.",
    },
    {
      k: "predict",
      expr: 'sum [1 | c <- "mississippi", c == \'s\']',
      answer: "4",
      why: "Each `'s'` contributes a 1, and there are four of them.",
    },
    {
      k: "write",
      body: md(
        "Write `incr k table`, the step used to build a frequency table one item at a time: if `k` is a key, add 1 to its count; otherwise add `(k, 1)`. Order doesn't matter.",
        "",
        "```",
        "incr 'a' [('a',2), ('b',1)]   is  [('a',3), ('b',1)]   -- in any order",
        "```",
      ),
      starter: hs`incr :: Eq a => a -> [(a, Int)] -> [(a, Int)]
incr k table = undefined
`,
      tests: [
        { expr: "incr 'a' [('a', 2), ('b', 1)]", expected: "[('a', 3), ('b', 1)]", unordered: true },
        { expr: "incr 'c' [('a', 2), ('b', 1)]", expected: "[('a', 2), ('b', 1), ('c', 1)]", unordered: true },
        { expr: "incr 'x' []", expected: "[('x', 1)]" },
        { expr: "foldr incr [] \"abca\"", expected: "[('a', 2), ('b', 1), ('c', 1)]", unordered: true, label: "folding incr over a String counts its letters" },
      ],
      hint: "`case lookup k table of Nothing -> (k, 1) : table; Just n -> (k, n + 1) : [p | p <- table, fst p /= k]`.",
      solution: hs`incr :: Eq a => a -> [(a, Int)] -> [(a, Int)]
incr k table
  = case lookup k table of
      Nothing -> (k, 1) : table
      Just n  -> (k, n + 1) : [(k', v) | (k', v) <- table, k' /= k]
`,
    },
    {
      k: "write",
      body: md(
        "Write `invert`, which swaps every key with its value.",
        "",
        "```",
        "invert [(1,'a'), (2,'b')]   is  [('a',1), ('b',2)]",
        "```",
      ),
      starter: hs`invert :: [(a, b)] -> [(b, a)]
invert table = undefined
`,
      tests: [
        { expr: "invert [(1, 'a'), (2, 'b')]", expected: "[('a', 1), ('b', 2)]" },
        { expr: "invert ([] :: [(Int, Int)])", expected: "[]" },
        { expr: `invert [("x", True)]`, expected: `[(True, "x")]` },
        { expr: "invert (invert [(1, 2), (3, 4)])", expected: "[(1, 2), (3, 4)]" },
      ],
      hint: "`[(v, k) | (k, v) <- table]`",
      solution: hs`invert :: [(a, b)] -> [(b, a)]
invert table = [(v, k) | (k, v) <- table]
`,
    },
    {
      k: "quiz",
      q: "The spec says \"the order of the elements in the result is unimportant\". What does that mean for you?",
      options: [
        "Your result must be sorted",
        "Any order is accepted, so pick whatever is easiest (e.g. put new bindings on the front)",
        "The tests won't check your result",
        "You must keep the original order",
      ],
      answer: 1,
      why: "The auto-tester compares in a way that ignores order. Take the free simplification.",
    },
    {
      k: "quiz",
      q: "A row's values line up with a header's attributes. Which builds a table from attribute names to this row's values?",
      options: ["`zip row header`", "`zip (map fst header) row`", "`map fst (zip header row)`", "`lookup header row`"],
      answer: 1,
      why: "`map fst header` lists the attribute names in order; zipping with the row pairs each name with its value. Now `lookUp name` finds a value. This is the whole idea of 2017's `lookUpAtt`.",
    },
    {
      k: "write",
      setup: hs`type AttName = String
type AttValue = String
type Attribute = (AttName, [AttValue])
type Header = [Attribute]
type Row = [AttValue]

lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x table = head [v | (k, v) <- table, k == x]

header :: Header
header = [("outlook", ["sunny", "overcast", "rainy"]), ("temp", ["hot", "mild", "cool"]), ("humidity", ["high", "normal"]), ("wind", ["windy", "calm"]), ("result", ["good", "bad"])]

row0 :: Row
row0 = ["sunny", "hot", "high", "calm", "bad"]
`,
      body: md(
        "Exam 2017, Part I (2 marks): using the given `lookUp`, write `lookUpAtt name header row`: the value of the named attribute in the row. The header lists the attributes in the same order as the row's values.",
        "",
        "```",
        "lookUpAtt \"temp\" header row0   is  \"hot\"",
        "```",
        "",
        "Build a table that pairs each attribute name with the row's value, then look the name up in it.",
      ),
      starter: hs`lookUpAtt :: AttName -> Header -> Row -> AttValue
lookUpAtt name header row = undefined
`,
      tests: [
        { expr: `lookUpAtt "temp" header row0`, expected: `"hot"` },
        { expr: `lookUpAtt "outlook" header row0`, expected: `"sunny"` },
        { expr: `lookUpAtt "result" header row0`, expected: `"bad"` },
        { expr: `lookUpAtt "wind" header ["rainy", "mild", "normal", "windy", "good"]`, expected: `"windy"` },
      ],
      hint: "`lookUp name (zip (map fst header) row)`",
      solution: hs`lookUpAtt :: AttName -> Header -> Row -> AttValue
lookUpAtt name header row = lookUp name (zip (map fst header) row)
`,
    },
    {
      k: "write",
      setup: hs`type Id = String
data Scope = Local | Global
  deriving (Eq, Ord, Show)
data Value = I Int | A [(Int, Int)]
  deriving (Eq, Ord, Show)
type Binding = (Id, (Scope, Value))
type State = [Binding]

sampleState :: State
sampleState = [("x", (Local, I 5)), ("y", (Global, I 2)), ("a", (Global, A [(0, 4), (1, 2), (2, 7)]))]
`,
      body: md(
        "Exam 2015, Part I (3 marks): each variable in a `State` has a scope and a value:",
        "",
        "```",
        "type Binding = (Id, (Scope, Value))",
        "type State   = [Binding]",
        "```",
        "",
        "Write `updateVar (v, val) st`: give variable `v` the new value but keep its scope. If `v` has no binding, add one with `Local` scope. Order doesn't matter.",
        "",
        "```",
        "updateVar (\"x\", I 6) sampleState            -- x is still Local, now I 6",
        "updateVar (\"z\", I 3) [(\"g\", (Global, I 8))]",
        "  is  [(\"g\",(Global,I 8)), (\"z\",(Local,I 3))]",
        "```",
      ),
      starter: hs`updateVar :: (Id, Value) -> State -> State
updateVar (v, val) st = undefined
`,
      tests: [
        {
          expr: `updateVar ("x", I 6) sampleState`,
          expected: `[("x", (Local, I 6)), ("y", (Global, I 2)), ("a", (Global, A [(0, 4), (1, 2), (2, 7)]))]`,
          unordered: true,
        },
        { expr: `updateVar ("z", I 3) [("g", (Global, I 8))]`, expected: `[("g", (Global, I 8)), ("z", (Local, I 3))]`, unordered: true },
        { expr: `updateVar ("y", I 0) sampleState`, expected: `[("x", (Local, I 5)), ("y", (Global, I 0)), ("a", (Global, A [(0, 4), (1, 2), (2, 7)]))]`, unordered: true, label: "a Global stays Global" },
        { expr: `updateVar ("n", I 1) []`, expected: `[("n", (Local, I 1))]` },
      ],
      hint: "`case lookup v st of Nothing -> (v, (Local, val)) : st; Just (sc, _) -> (v, (sc, val)) : [b | b <- st, fst b /= v]`.",
      solution: hs`updateVar :: (Id, Value) -> State -> State
updateVar (v, val) st
  = case lookup v st of
      Nothing      -> (v, (Local, val)) : st
      Just (sc, _) -> (v, (sc, val)) : [b | b <- st, fst b /= v]
`,
    },
    {
      k: "write",
      setup: hs`data Value = I Int | A [(Int, Int)]
  deriving (Eq, Show)

pairs :: Value -> [(Int, Int)]
pairs (A ps) = ps
pairs (I _) = []
`,
      body: md(
        "Exam 2015, Part I (2 marks): an array value `A [(index, element)]` is itself a lookup table. Write `assignArray arr i v`: the same array except that index `i` now holds `v` (added if it wasn't there). No index may appear twice; order doesn't matter. The index and new element come wrapped as `I` values.",
        "",
        "```",
        "assignArray (A [(0,4), (1,2), (2,7)]) (I 2) (I 1)   is  A [(2,1), (0,4), (1,2)]",
        "```",
        "",
        "(The tests use a helper `pairs` to get the list out of the array.)",
      ),
      starter: hs`assignArray :: Value -> Value -> Value -> Value
assignArray arr i v = undefined
`,
      tests: [
        { expr: "pairs (assignArray (A [(0, 4), (1, 2), (2, 7)]) (I 2) (I 1))", expected: "[(2, 1), (0, 4), (1, 2)]", unordered: true },
        { expr: "pairs (assignArray (A [(0, 4)]) (I 5) (I 9))", expected: "[(0, 4), (5, 9)]", unordered: true },
        { expr: "pairs (assignArray (A []) (I 0) (I 0))", expected: "[(0, 0)]" },
        { expr: "length (pairs (assignArray (A [(1, 1), (2, 2)]) (I 1) (I 8)))", expected: "2", label: "no index twice" },
      ],
      hint: "Pattern match the wrappers in the arguments: `assignArray (A ps) (I i) (I v) = A ((i, v) : [p | p <- ps, fst p /= i])`.",
      solution: hs`assignArray :: Value -> Value -> Value -> Value
assignArray (A ps) (I i) (I v) = A ((i, v) : [p | p <- ps, fst p /= i])
`,
    },
    {
      k: "write",
      setup: hs`type AttName = String
type AttValue = String
type Attribute = (AttName, [AttValue])
type Header = [Attribute]
type Row = [AttValue]
type DataSet = (Header, [Row])

lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x table = head [v | (k, v) <- table, k == x]

lookUpAtt :: AttName -> Header -> Row -> AttValue
lookUpAtt name header row = lookUp name (zip (map fst header) row)

outlook :: Attribute
outlook = ("outlook", ["sunny", "overcast", "rainy"])

result :: Attribute
result = ("result", ["good", "bad"])

mini :: DataSet
mini = ([outlook, result], [["sunny", "bad"], ["rainy", "good"], ["sunny", "good"], ["sunny", "bad"]])
`,
      body: md(
        "Exam 2017, Part I (3 marks): write `buildFrequencyTable att dataset`: for every possible value of the attribute, how many rows have that value. Values that never occur must appear with 0. `lookUpAtt` is given.",
        "",
        "```",
        "type Attribute = (AttName, [AttValue])     -- name and possible values",
        "type DataSet   = (Header, [Row])",
        "",
        "buildFrequencyTable outlook mini     is  [(\"sunny\",3), (\"overcast\",0), (\"rainy\",1)]",
        "buildFrequencyTable outlook ([],[])  is  [(\"sunny\",0), (\"overcast\",0), (\"rainy\",0)]",
        "```",
      ),
      starter: hs`buildFrequencyTable :: Attribute -> DataSet -> [(AttValue, Int)]
buildFrequencyTable att dataset = undefined
`,
      tests: [
        { expr: "buildFrequencyTable outlook mini", expected: `[("sunny", 3), ("overcast", 0), ("rainy", 1)]`, unordered: true },
        { expr: "buildFrequencyTable result mini", expected: `[("good", 2), ("bad", 2)]`, unordered: true },
        { expr: "buildFrequencyTable outlook ([], [])", expected: `[("sunny", 0), ("overcast", 0), ("rainy", 0)]`, unordered: true, label: "empty data set: all zeros" },
        { expr: `buildFrequencyTable result ([outlook, result], [["sunny", "good"]])`, expected: `[("good", 1), ("bad", 0)]`, unordered: true },
      ],
      hint: md(
        "Take both tuples apart: `buildFrequencyTable (name, values) (header, rows)`. Then:",
        "",
        "```",
        "[(v, length [r | r <- rows, lookUpAtt name header r == v]) | v <- values]",
        "```",
      ),
      solution: hs`buildFrequencyTable :: Attribute -> DataSet -> [(AttValue, Int)]
buildFrequencyTable (name, values) (header, rows)
  = [(v, length [r | r <- rows, lookUpAtt name header r == v]) | v <- values]
`,
    },
    {
      k: "write",
      setup: hs`type NodeId = Int
type Index = Int
type BDDNode = (NodeId, (Index, NodeId, NodeId))
type BDD = (NodeId, [BDDNode])
type Env = [(Index, Bool)]

lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x table = head [v | (k, v) <- table, k == x]

bddFig1 :: BDD
bddFig1 = (2, [(4, (2, 1, 1)), (5, (2, 1, 0)), (2, (1, 4, 5))])

bddFalse :: BDD
bddFalse = (0, [])
`,
      body: md(
        "Exam 2009, Part I (4 marks): a BDD is a root node id and a table of nodes. Each node `(id, (i, l, r))` tests variable `i`: if it's False go to node `l`, if True go to node `r`. Node ids 0 and 1 aren't in the table: they are the final answers False and True.",
        "",
        "```",
        "type BDDNode = (NodeId, (Index, NodeId, NodeId))",
        "type BDD     = (NodeId, [BDDNode])",
        "type Env     = [(Index, Bool)]",
        "```",
        "",
        "Write `checkSat bdd env`: start at the root and follow the arrows using the values in `env` until you reach 0 or 1. You'll need two lookups: one in the node table, one in `env`. A helper in a `where` that takes the current node id is the cleanest way.",
        "",
        "```",
        "checkSat bddFig1 [(1,True), (2,False)]   is  True",
        "```",
      ),
      starter: hs`checkSat :: BDD -> Env -> Bool
checkSat bdd env = undefined
`,
      tests: [
        { expr: "checkSat bddFig1 [(1, True), (2, False)]", expected: "True" },
        { expr: "checkSat bddFig1 [(1, True), (2, True)]", expected: "False" },
        { expr: "checkSat bddFig1 [(2, True), (1, False)]", expected: "True", label: "env in any order" },
        { expr: "checkSat bddFalse []", expected: "False" },
        { expr: "checkSat (1, []) []", expected: "True", label: "the BDD for True" },
      ],
      hint: md(
        "`checkSat (root, nodes) env = go root` with a helper:",
        "",
        "```",
        "go 0 = False",
        "go 1 = True",
        "go n = if lookUp i env then go r else go l",
        "  where (i, l, r) = lookUp n nodes",
        "```",
      ),
      solution: hs`checkSat :: BDD -> Env -> Bool
checkSat (root, nodes) env = go root
  where
    go 0 = False
    go 1 = True
    go n
      | lookUp i env = go r
      | otherwise    = go l
      where
        (i, l, r) = lookUp n nodes
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Lesson 4: Your own data types
// ---------------------------------------------------------------------------

const datatypes: Lesson = {
  id: "datatypes",
  title: "Your own data types",
  blurb: "Read the types an exam gives you, build values, and take them apart.",
  steps: [
    {
      k: "read",
      body: md(
        "Every January test starts by giving you some data types that model its problem. You need to read them fluently. A `data` declaration makes a brand-new type:",
        "",
        "```",
        "data Shape = Circle Double | Rect Double Double",
        "  deriving (Eq, Show)",
        "```",
        "",
        "Read it as: \"a Shape is either a Circle holding one Double, or a Rect holding two Doubles\".",
        "",
        "- `Shape` is the name of the new type.",
        "- `Circle` and `Rect` are its constructors: the different shapes a Shape value can have. `|` means \"or\".",
        "- The types after a constructor are its fields: the data it carries.",
        "",
        "Type names and constructor names always start with a capital letter. Values look like `Circle 2.0` or `Rect 3 4`.",
        "",
        "A constructor can have no fields at all. Then the type is just a list of options, like 2018's `data Op = Add | Mul | Eq | Gtr`.",
      ),
    },
    {
      k: "quiz",
      q: "In 2018's `data Op = Add | Mul | Eq | Gtr`, how many different values does the type `Op` have?",
      options: ["1", "2", "4", "Infinitely many"],
      answer: 2,
      why: "Four constructors, none with fields, so exactly four values: `Add`, `Mul`, `Eq` and `Gtr`. (`Bool` is defined the same way: `data Bool = False | True`.)",
    },
    {
      k: "read",
      body: md(
        "A constructor with fields is a function: give it the fields and it builds a value.",
        "",
        "```",
        "Circle :: Double -> Shape",
        "Rect   :: Double -> Double -> Shape",
        "```",
        "",
        "You've already used constructors from the Prelude. `Maybe` is defined as `data Maybe a = Nothing | Just a`, so `Just` is a function from `a` to `Maybe a`. `Either` is `data Either a b = Left a | Right b`.",
      ),
    },
    { k: "try", code: ":t Just" },
    { k: "try", code: ":t Left", after: "`Left` turns an `a` into an `Either a b`. The `b` is left open: it's decided by how you use the value." },
    {
      k: "quiz",
      q: "With `data Shape = Circle Double | Rect Double Double`, what is the type of `Rect 3`?",
      options: ["`Shape`", "`Double -> Shape`", "`Double -> Double -> Shape`", "It's an error"],
      answer: 1,
      why: "`Rect` wants two Doubles. Given one, it's partially applied: a function still waiting for the second Double.",
    },
    {
      k: "read",
      body: md(
        "`deriving (...)` asks Haskell to write standard class instances for you:",
        "",
        "- `Show`: values can be printed. GHCi and the auto-tester need it to display results.",
        "- `Eq`: values can be compared with `==`. Two values are equal when they use the same constructor with equal fields.",
        "- `Ord`: values can be put in order. Constructors listed earlier are smaller; with the same constructor, the fields are compared left to right.",
        "",
        "The exam's types always come with their `deriving` already written. Your job is to notice what it allows: you can only use `==` on a type if it derives `Eq`, and `<`, `max` or `sort` if it derives `Ord`.",
        "",
        "The Prelude's `Maybe` derives Ord, with `Nothing` listed first.",
      ),
    },
    {
      k: "predict",
      expr: "Nothing < Just 0",
      answer: "True",
      why: "In `data Maybe a = Nothing | Just a`, `Nothing` comes first, so it's smaller than every `Just`.",
    },
    {
      k: "predict",
      expr: "maximum [Just 3, Nothing, Just 10]",
      answer: "Just 10",
      why: "`Nothing` is the smallest; between two `Just`s the fields are compared, and 10 is bigger than 3.",
    },
    {
      k: "predict",
      expr: "compare (Left 100) (Right 1 :: Either Int Int)",
      answer: "LT",
      why: "`Left` is listed before `Right` in `data Either a b = Left a | Right b`, so any `Left` is smaller. The 100 is never looked at.",
    },
    {
      k: "write",
      body: md(
        "The starter declares a traffic light type. Write `next`, which gives the light that comes after: Red goes to Green, Green to Amber, Amber to Red.",
        "",
        "Use one equation per constructor.",
      ),
      starter: hs`data Light = Red | Amber | Green
  deriving (Eq, Show)

next :: Light -> Light
next l = undefined
`,
      tests: [
        { expr: "next Red", expected: "Green" },
        { expr: "next Green", expected: "Amber" },
        { expr: "next Amber", expected: "Red" },
        { expr: "next (next (next Red))", expected: "Red", label: "three steps get back to the start" },
      ],
      hint: "Three equations: `next Red = Green`, `next Green = Amber`, `next Amber = Red`.",
      solution: hs`data Light = Red | Amber | Green
  deriving (Eq, Show)

next :: Light -> Light
next Red   = Green
next Green = Amber
next Amber = Red
`,
    },
    {
      k: "write",
      setup: hs`data Shape = Circle Double | Rect Double Double
  deriving (Eq, Show)
`,
      body: md(
        "Write `area` for the `Shape` type (it's given). A pattern for a constructor with fields goes in brackets and names the fields:",
        "",
        "```",
        "area (Circle r) = ...",
        "area (Rect w h) = ...",
        "```",
        "",
        "A circle's area is `pi * r * r`.",
      ),
      starter: hs`area :: Shape -> Double
area s = undefined
`,
      tests: [
        { expr: "area (Rect 3 4)", expected: "12.0" },
        { expr: "area (Circle 1)", expected: "pi" },
        { expr: "area (Rect 2.5 2)", expected: "5.0" },
        { expr: "area (Circle 0)", expected: "0.0" },
      ],
      hint: "`area (Circle r) = pi * r * r` and `area (Rect w h) = w * h`.",
      solution: hs`area :: Shape -> Double
area (Circle r) = pi * r * r
area (Rect w h) = w * h
`,
    },
    {
      k: "read",
      body: md(
        "Exams also use `type`, which does something quite different: it gives a new name to a type that already exists. It's called a type synonym.",
        "",
        "```",
        "type Index = Int",
        "type Env   = [(Index, Bool)]",
        "```",
        "",
        "`Index` and `Int` are now completely interchangeable. No new values, no constructors: it's only there to make signatures readable.",
        "",
        "A common exam trick is a tuple used as a record (a value with several named parts). In 2014:",
        "",
        "```",
        "type Automaton = (State, [State], [Transition])",
        "                 -- start   terminals  transitions",
        "```",
        "",
        "To get a part out, pattern match on the tuple. The 2014 template gave accessor functions (functions that just pull out one part) like `startState (s, _, _) = s`.",
      ),
    },
    {
      k: "quiz",
      q: "What is the difference between `type` and `data`?",
      options: [
        "None: they're two spellings of the same thing",
        "`type` gives a new name to an existing type; `data` makes a new type with its own constructors",
        "`data` is for numbers and `type` is for lists",
        "`type` makes a new type; `data` renames one",
      ],
      answer: 1,
      why: "A `type` synonym has no constructors; you build its values the normal way (e.g. with a tuple). A `data` type has constructors that are the only way to build its values.",
    },
    {
      k: "write",
      setup: hs`type State = Int
data Label = C Char | Eps
  deriving (Eq, Show)
type Transition = (State, State, Label)
type Automaton = (State, [State], [Transition])

nda :: Automaton
nda = (1, [3, 4], [(1, 2, C 'a'), (2, 3, Eps), (2, 4, C 'b')])
`,
      body: md(
        "Exam 2014: write the three accessor functions for `type Automaton = (State, [State], [Transition])`. Each one pattern matches on the triple and gives back one part.",
      ),
      starter: hs`startState :: Automaton -> State
startState a = undefined

terminalStates :: Automaton -> [State]
terminalStates a = undefined

transitions :: Automaton -> [Transition]
transitions a = undefined
`,
      tests: [
        { expr: "startState nda", expected: "1" },
        { expr: "terminalStates nda", expected: "[3, 4]" },
        { expr: "transitions nda", expected: "[(1, 2, C 'a'), (2, 3, Eps), (2, 4, C 'b')]" },
        { expr: "startState (7, [], [])", expected: "7" },
        { expr: "terminalStates (7, [], [])", expected: "[]" },
      ],
      hint: "`startState (s, _, _) = s`, and similarly with the `_` in the other positions.",
      solution: hs`startState :: Automaton -> State
startState (s, _, _) = s

terminalStates :: Automaton -> [State]
terminalStates (_, ts, _) = ts

transitions :: Automaton -> [Transition]
transitions (_, _, trs) = trs
`,
    },
    {
      k: "read",
      body: md(
        "Now an exam-sized type. 2009 represented Boolean expressions like this:",
        "",
        "```",
        "type Index = Int",
        "data BExp = Prim Bool | IdRef Index | Not BExp | And BExp BExp | Or BExp BExp",
        "  deriving (Eq, Show)",
        "```",
        "",
        "Read each constructor in plain words:",
        "",
        "- `Prim Bool`: a constant, `True` or `False`.",
        "- `IdRef Index`: variable number i, written xᵢ.",
        "- `Not BExp`: \"not\" of another expression.",
        "- `And BExp BExp`, `Or BExp BExp`: two smaller expressions joined.",
        "",
        "Some fields are themselves `BExp`s, so the type is recursive: expressions contain smaller expressions, like a tree. To build ¬(x1 ∧ (False ∨ x2)), work from the outside in:",
        "",
        "```",
        "Not (And (IdRef 1) (Or (Prim False) (IdRef 2)))",
        "```",
        "",
        "Every field that is more than one word needs its own brackets.",
      ),
    },
    {
      k: "quiz",
      q: "Which of these is a valid `BExp`?",
      options: ["`And (IdRef 1)`", "`Not IdRef 3`", "`Or (Prim True) (Not (IdRef 2))`", "`And True (IdRef 1)`"],
      answer: 2,
      why: "`And (IdRef 1)` is missing its second field. `Not IdRef 3` gives `Not` two arguments (needs brackets: `Not (IdRef 3)`). `True` is a Bool, not a BExp: it has to be wrapped as `Prim True`.",
    },
    {
      k: "quiz",
      q: "What is the type of the constructor `And`?",
      options: ["`BExp`", "`Bool -> Bool -> Bool`", "`BExp -> BExp -> BExp`", "`BExp -> BExp`"],
      answer: 2,
      why: "`And BExp BExp` has two BExp fields, so `And` takes two BExps and builds a BExp.",
    },
    {
      k: "write",
      setup: hs`type Index = Int
data BExp = Prim Bool | IdRef Index | Not BExp | And BExp BExp | Or BExp BExp
  deriving (Eq, Show)
`,
      body: md(
        "Build these two expressions from the 2009 exam as `BExp` values:",
        "",
        "```",
        "b4 = x7 ∧ (x2 ∨ ¬x3)",
        "b8 = x1 ∨ ¬x1",
        "```",
      ),
      starter: hs`b4 :: BExp
b4 = undefined

b8 :: BExp
b8 = undefined
`,
      tests: [
        { expr: "b4", expected: "And (IdRef 7) (Or (IdRef 2) (Not (IdRef 3)))" },
        { expr: "b8", expected: "Or (IdRef 1) (Not (IdRef 1))" },
        { expr: "b4 /= b8", expected: "True" },
        { expr: "case b4 of { And l _ -> l; _ -> Prim False }", expected: "IdRef 7", label: "the left of b4's And is x7" },
      ],
      hint: "Outermost operator first: `b4 = And (IdRef 7) (Or ...)`.",
      solution: hs`b4 :: BExp
b4 = And (IdRef 7) (Or (IdRef 2) (Not (IdRef 3)))

b8 :: BExp
b8 = Or (IdRef 1) (Not (IdRef 1))
`,
    },
    {
      k: "read",
      body: md(
        "To use a data type, pattern match on its constructors. Patterns can be nested: a constructor inside a constructor. 2009's `simplify` (2 marks) did one step of simplification, but only when the arguments are constants (`Prim`):",
        "",
        "```",
        "simplify :: BExp -> BExp",
        "simplify (Not (Prim b))            = Prim (not b)",
        "simplify (And (Prim a) (Prim b))   = Prim (a && b)",
        "simplify (Or (Prim a) (Prim b))    = Prim (a || b)",
        "simplify e                         = e",
        "```",
        "",
        "The last equation is a catch-all: `e` matches anything not caught above, and gives it back unchanged. Equations are tried top to bottom, so the catch-all must come last.",
      ),
    },
    {
      k: "write",
      setup: hs`type Index = Int
data BExp = Prim Bool | IdRef Index | Not BExp | And BExp BExp | Or BExp BExp
  deriving (Eq, Show)
`,
      body: md(
        "Exam 2009, Part II (2 marks): write `simplify`, without looking back if you can. It's non-recursive: only simplify when the arguments of `Not`, `And` or `Or` are `Prim` values; otherwise return the expression unchanged.",
        "",
        "```",
        "simplify (Not (Prim False))             is  Prim True",
        "simplify (Or (Prim False) (Prim False)) is  Prim False",
        "simplify (And (IdRef 3) (Prim True))    is  And (IdRef 3) (Prim True)",
        "```",
      ),
      starter: hs`simplify :: BExp -> BExp
simplify e = undefined
`,
      tests: [
        { expr: "simplify (Not (Prim False))", expected: "Prim True" },
        { expr: "simplify (Or (Prim False) (Prim False))", expected: "Prim False" },
        { expr: "simplify (And (Prim True) (Prim True))", expected: "Prim True" },
        { expr: "simplify (And (IdRef 3) (Prim True))", expected: "And (IdRef 3) (Prim True)" },
        { expr: "simplify (IdRef 4)", expected: "IdRef 4" },
        { expr: "simplify (Not (Not (Prim True)))", expected: "Not (Not (Prim True))", label: "not recursive: inner Not isn't a Prim" },
      ],
      hint: "Three equations with nested `Prim` patterns, then the catch-all `simplify e = e` last.",
      solution: hs`simplify :: BExp -> BExp
simplify (Not (Prim b))          = Prim (not b)
simplify (And (Prim a) (Prim b)) = Prim (a && b)
simplify (Or (Prim a) (Prim b))  = Prim (a || b)
simplify e                       = e
`,
    },
    {
      k: "predict",
      body: "Matching on the two constructors of `Either`:",
      expr: '(\\e -> case e of { Left s -> length s; Right n -> n }) (Left "abc")',
      answer: "3",
      why: '`Left "abc"` matches `Left s` with `s` as `"abc"`, so the answer is its length.',
    },
    {
      k: "read",
      body: md(
        "A type can have a type parameter: a type variable that's filled in later, like the `a` in `Maybe a`. 2013 used binomial trees:",
        "",
        "```",
        "data BinTree a = Node a Int [BinTree a]",
        "  deriving (Eq, Ord, Show)",
        "```",
        "",
        "One constructor, `Node`, with three fields: a value of type `a`, the rank (an Int), and a list of child trees. A `BinTree Int` holds Ints, a `BinTree Char` holds Chars.",
        "",
        "Part I question 1 (1 mark) was three accessor functions:",
        "",
        "```",
        "value    :: BinTree a -> a",
        "rank     :: BinTree a -> Int",
        "children :: BinTree a -> [BinTree a]",
        "```",
        "",
        "Each is one equation: match `(Node v r cs)` and give back one field. Then use them everywhere else, so you never have to remember the field order again.",
      ),
    },
    {
      k: "write",
      setup: hs`data BinTree a = Node a Int [BinTree a]
  deriving (Eq, Ord, Show)

t2 :: BinTree Int
t2 = Node 2 2 [Node 8 1 [Node 9 0 []], Node 7 0 []]
`,
      body: "Exam 2013, Part I (1 mark): write `value`, `rank` and `children`.",
      starter: hs`value :: BinTree a -> a
value t = undefined

rank :: BinTree a -> Int
rank t = undefined

children :: BinTree a -> [BinTree a]
children t = undefined
`,
      tests: [
        { expr: "value t2", expected: "2" },
        { expr: "rank t2", expected: "2" },
        { expr: "children t2", expected: "[Node 8 1 [Node 9 0 []], Node 7 0 []]" },
        { expr: "value (Node 'q' 0 [])", expected: "'q'" },
        { expr: "children (Node 5 0 [])", expected: "([] :: [BinTree Int])" },
        { expr: "map value (children t2)", expected: "[8, 7]" },
      ],
      hint: "`value (Node v _ _) = v`, `rank (Node _ r _) = r`, `children (Node _ _ cs) = cs`.",
      solution: hs`value :: BinTree a -> a
value (Node v _ _) = v

rank :: BinTree a -> Int
rank (Node _ r _) = r

children :: BinTree a -> [BinTree a]
children (Node _ _ cs) = cs
`,
    },
    {
      k: "quiz",
      q: "What is `rank (head (children (Node 2 1 [Node 5 0 []])))`?",
      options: ["2", "1", "0", "5"],
      answer: 2,
      why: "The children are `[Node 5 0 []]`; the first is `Node 5 0 []`, whose rank (second field) is 0.",
    },
    {
      k: "read",
      body: md(
        "How derived `Show` prints values: constructor name, then each field, with brackets around any field that is itself more than one word, or negative:",
        "",
        "```",
        "Just (Just 3)",
        "Not (IdRef 2)",
        "Just (-3)",
        "```",
        "",
        "If a type doesn't derive `Show`, GHCi can't print its values and you get `No instance for (Show ...)`. The same message with `Eq` appears if you use `==` on a type that doesn't derive `Eq`.",
      ),
    },
    {
      k: "predict",
      expr: "show (Just (-3))",
      answer: '"Just (-3)"',
      why: "Negative numbers are bracketed when they're a constructor's field, otherwise `Just -3` would read as `Just` minus 3.",
    },
    {
      k: "quiz",
      q: "You declare `data Coin = Heads | Tails` (no `deriving`) and type `Heads == Tails` in GHCi. What happens?",
      options: ["`False`", "`True`", "An error: No instance for (Eq Coin)", "An error: Heads is not defined"],
      answer: 2,
      why: "Without `deriving (Eq)`, Haskell doesn't know how to compare Coins. Add `deriving (Eq, Show)`.",
    },
    {
      k: "write",
      setup: hs`type Id = String
data Op = Add | Mul | Eq | GEq
  deriving (Eq, Show)
data Exp = Const Int | Var Id | Apply Op Exp Exp
  deriving (Eq, Show)
`,
      body: md(
        "2021's expression type:",
        "",
        "```",
        "data Exp = Const Int | Var Id | Apply Op Exp Exp",
        "```",
        "",
        "Write `constValue`, which gives `Just n` for `Const n`, and `Nothing` for anything else.",
      ),
      starter: hs`constValue :: Exp -> Maybe Int
constValue e = undefined
`,
      tests: [
        { expr: "constValue (Const 4)", expected: "Just 4" },
        { expr: `constValue (Var "x")`, expected: "Nothing" },
        { expr: "constValue (Apply Add (Const 1) (Const 2))", expected: "Nothing", label: "not simplified: an Apply isn't a Const" },
        { expr: "constValue (Const (-1))", expected: "Just (-1)" },
      ],
      hint: "`constValue (Const n) = Just n` and a catch-all `constValue _ = Nothing`.",
      solution: hs`constValue :: Exp -> Maybe Int
constValue (Const n) = Just n
constValue _         = Nothing
`,
    },
  ],
};

const drillDatatypes: DrillSet = {
  id: "drill-datatypes",
  lesson: "datatypes",
  title: "Data type drills",
  drills: [
    {
      k: "quiz",
      q: "In `data Item = Book String Int | Pen`, what is `Book`?",
      options: ["A type", "A constructor taking a String and an Int", "A type synonym", "A field"],
      answer: 1,
      why: "`Item` is the type; `Book` and `Pen` are its constructors. `Book :: String -> Int -> Item`.",
    },
    { k: "predict", expr: "Just 3 == Just 3", answer: "True", why: "Same constructor, equal fields." },
    {
      k: "quiz",
      q: "After `type Name = String`, can you pass a `Name` to a function that wants a `String`?",
      options: ["Yes: they're the same type", "No: Name is a new type", "Only with a conversion function", "Only if it's in a list"],
      answer: 0,
      why: "A type synonym is just another name. `Name` and `String` are interchangeable everywhere.",
    },
    { k: "predict", expr: "compare GT LT", answer: "GT", why: "`data Ordering = LT | EQ | GT` derives Ord: `GT` is listed last, so it's the biggest." },
    {
      k: "predict",
      expr: "(Left 5 :: Either Int Int) == Right 5",
      answer: "False",
      why: "Different constructors are never equal, even when the fields are the same.",
    },
    {
      k: "quiz",
      q: "What's wrong with `area Circle r = pi * r * r`?",
      options: [
        "Nothing",
        "It needs brackets: `area (Circle r)`; without them `area` seems to take two arguments, `Circle` and `r`",
        "`pi` isn't defined",
        "Constructors can't be used in patterns",
      ],
      answer: 1,
      why: "A constructor pattern with fields must be bracketed. Otherwise GHC complains that `Circle` should have 1 argument but has been given none.",
    },
    { k: "predict", expr: "max (Just 2) Nothing", answer: "Just 2", why: "`Nothing` is smaller than any `Just`." },
    {
      k: "quiz",
      q: "With `data Size = Small | Medium | Large deriving (Eq, Ord, Show)`, what is `Large > Small`?",
      options: ["`True`", "`False`", "An error", "It depends on the fields"],
      answer: 0,
      why: "Derived Ord puts constructors in the order they're listed: `Small < Medium < Large`.",
    },
    {
      k: "predict",
      expr: 'show (Left 3 :: Either Int Bool)',
      answer: '"Left 3"',
      why: "Derived Show writes the constructor and then its field.",
    },
    {
      k: "predict",
      expr: '(\\m -> case m of { Nothing -> "none"; Just (a, b) -> a ++ b }) (Just ("ab", "cd"))',
      answer: '"abcd"',
      why: "Patterns nest: `Just (a, b)` takes off the `Just` and splits the pair at the same time.",
    },
    {
      k: "write",
      body: md(
        "Declare `data Suit = Hearts | Diamonds | Clubs | Spades` deriving `(Eq, Show)` (it's in the starter), then write `isRed`: Hearts and Diamonds are red.",
      ),
      starter: hs`data Suit = Hearts | Diamonds | Clubs | Spades
  deriving (Eq, Show)

isRed :: Suit -> Bool
isRed s = undefined
`,
      tests: [
        { expr: "isRed Hearts", expected: "True" },
        { expr: "isRed Diamonds", expected: "True" },
        { expr: "isRed Clubs", expected: "False" },
        { expr: "isRed Spades", expected: "False" },
      ],
      hint: "Two `True` equations, then `isRed _ = False`. Or `elem s [Hearts, Diamonds]` (which needs Eq).",
      solution: hs`data Suit = Hearts | Diamonds | Clubs | Spades
  deriving (Eq, Show)

isRed :: Suit -> Bool
isRed Hearts   = True
isRed Diamonds = True
isRed _        = False
`,
    },
    {
      k: "quiz",
      q: "You forgot one constructor in a function's equations, and the tests call it on that constructor. What happens?",
      options: [
        "It returns a default value",
        "It won't compile",
        "It compiles (maybe with a warning), then crashes with \"Non-exhaustive patterns\" when that case is reached",
        "It returns `Nothing`",
      ],
      answer: 2,
      why: "Missing cases are only a warning at compile time; the crash happens when the missing case is used. Always check you have one equation per constructor (or a catch-all).",
    },
    {
      k: "write",
      setup: hs`data Shape = Circle Double | Rect Double Double
  deriving (Eq, Show)
`,
      body: "Write `perimeter` for the given `Shape` type. A circle's perimeter is `2 * pi * r`.",
      starter: hs`perimeter :: Shape -> Double
perimeter s = undefined
`,
      tests: [
        { expr: "perimeter (Rect 3 4)", expected: "14.0" },
        { expr: "perimeter (Circle 1)", expected: "2 * pi" },
        { expr: "perimeter (Rect 0 0)", expected: "0.0" },
        { expr: "perimeter (Circle 0.5)", expected: "pi" },
      ],
      hint: "`perimeter (Circle r) = 2 * pi * r` and `perimeter (Rect w h) = 2 * (w + h)`.",
      solution: hs`perimeter :: Shape -> Double
perimeter (Circle r) = 2 * pi * r
perimeter (Rect w h) = 2 * (w + h)
`,
    },
    {
      k: "predict",
      expr: "sort [Just 2, Nothing, Just 1]",
      answer: "[Nothing, Just 1, Just 2]",
      why: "`sort` uses Ord: `Nothing` first, then the `Just`s by their fields.",
    },
    {
      k: "quiz",
      q: "An exam type comes with one of these `deriving` clauses. With which one can you NOT `sort` a list of its values?",
      options: ["`deriving (Eq, Ord, Show)`", "`deriving (Ord, Eq)`", "`deriving (Eq, Show)`", "`deriving (Show, Eq, Ord)`"],
      answer: 2,
      why: "`sort` needs `Ord`. Without it in the `deriving` list, you can't sort (the order inside the brackets doesn't matter).",
    },
    {
      k: "write",
      setup: hs`data Point = Point Int Int
  deriving (Eq, Show)
`,
      body: md(
        "`data Point = Point Int Int` uses the same name for the type and its only constructor (that's allowed and very common). Write `manhattan`: the distance between two points moving only along the grid, `|x1 - x2| + |y1 - y2|`.",
      ),
      starter: hs`manhattan :: Point -> Point -> Int
manhattan p q = undefined
`,
      tests: [
        { expr: "manhattan (Point 0 0) (Point 3 4)", expected: "7" },
        { expr: "manhattan (Point 3 4) (Point 0 0)", expected: "7" },
        { expr: "manhattan (Point 1 1) (Point 1 1)", expected: "0" },
        { expr: "manhattan (Point (-2) 5) (Point 2 1)", expected: "8" },
      ],
      hint: "`manhattan (Point x1 y1) (Point x2 y2) = abs (x1 - x2) + abs (y1 - y2)`",
      solution: hs`manhattan :: Point -> Point -> Int
manhattan (Point x1 y1) (Point x2 y2) = abs (x1 - x2) + abs (y1 - y2)
`,
    },
    {
      k: "quiz",
      q: "Which signature is correct for a function returning the value at the root of a `data BinTree a = Node a Int [BinTree a]`?",
      options: ["`value :: BinTree -> a`", "`value :: BinTree a -> a`", "`value :: Node a -> a`", "`value :: a -> BinTree a`"],
      answer: 1,
      why: "The type is `BinTree a` (with its parameter); `Node` is a constructor, not a type. It takes a tree and gives an `a`.",
    },
    {
      k: "predict",
      expr: "(\\e -> case e of { Left n -> n * 2; Right s -> length s }) (Right \"hey\")",
      answer: "3",
      why: "`Right \"hey\"` matches the second alternative, giving the length of `\"hey\"`.",
    },
    {
      k: "write",
      setup: hs`data Shape = Circle Double | Rect Double Double
  deriving (Eq, Show)
`,
      body: "Write `scale k s`, which multiplies every size in the shape by `k`. You build the answer with the same constructor you matched.",
      starter: hs`scale :: Double -> Shape -> Shape
scale k s = undefined
`,
      tests: [
        { expr: "scale 2 (Circle 1)", expected: "Circle 2.0" },
        { expr: "scale 3 (Rect 1 2)", expected: "Rect 3.0 6.0" },
        { expr: "scale 0 (Rect 5 5)", expected: "Rect 0.0 0.0" },
        { expr: "scale 1 (Circle 7)", expected: "Circle 7.0" },
      ],
      hint: "`scale k (Circle r) = Circle (k * r)` and similarly for `Rect`.",
      solution: hs`scale :: Double -> Shape -> Shape
scale k (Circle r) = Circle (k * r)
scale k (Rect w h) = Rect (k * w) (k * h)
`,
    },
    {
      k: "quiz",
      q: "Which is the correct value for 2016's `Element \"a\" [] [Text \"A\"]` with an extra child `Text \"B\"` on the end?",
      options: [
        "`Element \"a\" [] [Text \"A\"] ++ [Text \"B\"]`",
        "`Element \"a\" [] [Text \"A\", Text \"B\"]`",
        "`Element \"a\" [] (Text \"A\", Text \"B\")`",
        "`Element \"a\" [] [Text \"A\"] Text \"B\"`",
      ],
      answer: 1,
      why: "The third field is a list of XML children. You add to that list; you can't `++` onto an `Element` itself.",
    },
    {
      k: "write",
      setup: hs`type Id = String
data Exp = Const Int | Var Id | Fun [Id] Exp | App Exp [Exp] | Let [(Id, Exp)] Exp
  deriving (Eq, Show)
`,
      body: md(
        "Exam 2022, Part I (1 mark): with",
        "",
        "```",
        "data Exp = Const Int | Var Id | Fun [Id] Exp | App Exp [Exp] | Let [(Id, Exp)] Exp",
        "```",
        "",
        "write `isFun`, which is `True` only for a `Fun` expression.",
      ),
      starter: hs`isFun :: Exp -> Bool
isFun e = undefined
`,
      tests: [
        { expr: `isFun (Fun ["x", "y"] (Var "x"))`, expected: "True" },
        { expr: "isFun (Const 3)", expected: "False" },
        { expr: `isFun (App (Var "f") [Const 1])`, expected: "False" },
        { expr: `isFun (Let [("f", Fun [] (Const 1))] (Var "f"))`, expected: "False", label: "a Let containing a Fun is still a Let" },
      ],
      hint: "`isFun (Fun _ _) = True` and `isFun _ = False`.",
      solution: hs`isFun :: Exp -> Bool
isFun (Fun _ _) = True
isFun _         = False
`,
    },
    {
      k: "write",
      setup: hs`type Name = String
type Attributes = [(String, String)]
data XML = Text String | Element Name Attributes [XML]
  deriving (Eq, Show)
`,
      body: md(
        "Exam 2016, Part I (1 mark): write `addChild c x`, which adds `c` as a new child at the right-hand end of element `x`'s children. Precondition: `x` is always an `Element`.",
        "",
        "```",
        "addChild (Text \"B\") (Element \"a\" [] [Text \"A\"])",
        "  is  Element \"a\" [] [Text \"A\", Text \"B\"]",
        "```",
      ),
      starter: hs`addChild :: XML -> XML -> XML
addChild c x = undefined
`,
      tests: [
        { expr: `addChild (Text "B") (Element "a" [] [Text "A"])`, expected: `Element "a" [] [Text "A", Text "B"]` },
        { expr: `addChild (Text "x") (Element "e" [("k", "v")] [])`, expected: `Element "e" [("k", "v")] [Text "x"]` },
        { expr: `addChild (Element "b" [] []) (Element "a" [] [Text "A"])`, expected: `Element "a" [] [Text "A", Element "b" [] []]` },
        { expr: `addChild (Text "2") (addChild (Text "1") (Element "r" [] []))`, expected: `Element "r" [] [Text "1", Text "2"]` },
      ],
      hint: "`addChild c (Element n as cs) = Element n as (cs ++ [c])`",
      solution: hs`addChild :: XML -> XML -> XML
addChild c (Element n as cs) = Element n as (cs ++ [c])
`,
    },
    {
      k: "write",
      setup: hs`data BinTree a = Node a Int [BinTree a]
  deriving (Eq, Ord, Show)

value :: BinTree a -> a
value (Node v _ _) = v

rank :: BinTree a -> Int
rank (Node _ r _) = r

children :: BinTree a -> [BinTree a]
children (Node _ _ cs) = cs

t5, t6, t7 :: BinTree Int
t5 = Node 4 2 [Node 8 1 [Node 10 0 []], Node 6 0 []]
t6 = Node 1 2 [Node 12 1 [Node 16 0 []], Node 5 0 []]
t7 = Node 1 3 [Node 4 2 [Node 8 1 [Node 10 0 []], Node 6 0 []], Node 12 1 [Node 16 0 []], Node 5 0 []]
`,
      body: md(
        "Exam 2013, Part I (3 marks): combine two binomial trees of the same rank. The tree with the smaller root value becomes the root; the other tree is added to the front of its children; the rank goes up by 1. If the roots are equal, the second tree becomes the root.",
        "",
        "```",
        "combineTrees t5 t6   is  t7",
        "```",
        "",
        "`value`, `rank` and `children` are given. Use them.",
      ),
      starter: hs`combineTrees :: Ord a => BinTree a -> BinTree a -> BinTree a
combineTrees t1 t2 = undefined
`,
      tests: [
        { expr: "combineTrees t5 t6", expected: "t7" },
        { expr: "combineTrees t6 t5", expected: "t7", label: "same answer either way round" },
        { expr: "combineTrees (Node 4 0 []) (Node 7 0 [])", expected: "Node 4 1 [Node 7 0 []]" },
        { expr: "combineTrees (Node 'a' 0 []) (Node 'a' 0 [])", expected: "Node 'a' 1 [Node 'a' 0 []]" },
        { expr: "combineTrees (Node 3 0 []) (Node 3 0 [Node 9 0 []])", expected: "Node 3 1 [Node 3 0 [], Node 9 0 []]", label: "equal roots: the second tree is the root" },
      ],
      hint: "`| value t1 < value t2 = Node (value t1) (rank t1 + 1) (t2 : children t1)`, and `otherwise` the same with t1 and t2 swapped.",
      solution: hs`combineTrees :: Ord a => BinTree a -> BinTree a -> BinTree a
combineTrees t1 t2
  | value t1 < value t2 = Node (value t1) (rank t1 + 1) (t2 : children t1)
  | otherwise           = Node (value t2) (rank t2 + 1) (t1 : children t2)
`,
    },
    {
      k: "write",
      setup: hs`data Value = I Int | A [(Int, Int)]
  deriving (Eq, Show)
data Op = Add | Mul | Less | Equal | Index
  deriving (Eq, Show)
`,
      body: md(
        "Exam 2015, Part II: write `applyOp`. Comparisons give `I 1` for true and `I 0` for false. `Index` looks up an index in an array, giving `I 0` if it isn't there.",
        "",
        "```",
        "applyOp Add (I 6) (I (-2))             is  I 4",
        "applyOp Less (I 7) (I 0)               is  I 0",
        "applyOp Index (A [(1,1),(0,3)]) (I 0)  is  I 3",
        "applyOp Index (A [(1,1),(0,3)]) (I 2)  is  I 0",
        "```",
        "",
        "Match the wrappers in each equation, e.g. `applyOp Add (I x) (I y) = I (x + y)`.",
      ),
      starter: hs`applyOp :: Op -> Value -> Value -> Value
applyOp op v1 v2 = undefined
`,
      tests: [
        { expr: "applyOp Add (I 6) (I (-2))", expected: "I 4" },
        { expr: "applyOp Mul (I 3) (I 4)", expected: "I 12" },
        { expr: "applyOp Less (I 7) (I 0)", expected: "I 0" },
        { expr: "applyOp Less (I 0) (I 7)", expected: "I 1" },
        { expr: "applyOp Equal (I 2) (I 2)", expected: "I 1" },
        { expr: "applyOp Index (A [(1, 1), (0, 3)]) (I 0)", expected: "I 3" },
        { expr: "applyOp Index (A [(1, 1), (0, 3)]) (I 2)", expected: "I 0" },
      ],
      hint: "For Index: `applyOp Index (A ps) (I i) = case lookup i ps of Nothing -> I 0; Just v -> I v`. For comparisons, `fromEnum` turns `False`/`True` into 0/1.",
      solution: hs`applyOp :: Op -> Value -> Value -> Value
applyOp Add (I x) (I y)    = I (x + y)
applyOp Mul (I x) (I y)    = I (x * y)
applyOp Less (I x) (I y)   = I (fromEnum (x < y))
applyOp Equal (I x) (I y)  = I (fromEnum (x == y))
applyOp Index (A ps) (I i)
  = case lookup i ps of
      Nothing -> I 0
      Just v  -> I v
`,
    },
    {
      k: "write",
      setup: hs`type Id = String
data Op = Add | Mul | Eq | Gtr
  deriving (Eq, Show)
data Exp = Const Int | Var Id | Apply Op Exp Exp | Phi Exp Exp
  deriving (Eq, Show)

apply :: Op -> Int -> Int -> Int
apply Add x y = x + y
apply Mul x y = x * y
apply Eq x y = fromEnum (x == y)
apply Gtr x y = fromEnum (x > y)
`,
      body: md(
        "Exam 2018, Part II (3 marks): write `foldConst`, which simplifies one expression using only these rules (it is not recursive):",
        "",
        "- `Phi (Const c) (Const c)` with both constants equal becomes `Const c`.",
        "- `Apply op (Const a) (Const b)` becomes `Const (apply op a b)` (`apply` is given).",
        "- `Apply Add (Var v) (Const 0)` and `Apply Add (Const 0) (Var v)` become `Var v`.",
        "- Anything else is unchanged.",
        "",
        "Guards are allowed alongside patterns: `foldConst (Phi (Const a) (Const b)) | a == b = Const a`.",
      ),
      starter: hs`foldConst :: Exp -> Exp
foldConst e = undefined
`,
      tests: [
        { expr: "foldConst (Phi (Const 2) (Const 2))", expected: "Const 2" },
        { expr: "foldConst (Phi (Const 2) (Const 3))", expected: "Phi (Const 2) (Const 3)", label: "different constants: unchanged" },
        { expr: `foldConst (Apply Add (Const 0) (Var "x"))`, expected: `Var "x"` },
        { expr: `foldConst (Apply Add (Var "y") (Const 0))`, expected: `Var "y"` },
        { expr: "foldConst (Apply Mul (Const 6) (Const 7))", expected: "Const 42" },
        { expr: `foldConst (Apply Mul (Var "x") (Const 0))`, expected: `Apply Mul (Var "x") (Const 0)`, label: "only the listed rules" },
        { expr: "foldConst (Apply Add (Const 0) (Const 0))", expected: "Const 0" },
      ],
      hint: "Four equations plus a catch-all. Put the `Phi` one with a guard; if the guard fails, Haskell moves on to the next equation, so the catch-all still works.",
      solution: hs`foldConst :: Exp -> Exp
foldConst (Phi (Const a) (Const b))
  | a == b = Const a
foldConst (Apply op (Const a) (Const b)) = Const (apply op a b)
foldConst (Apply Add (Var v) (Const 0)) = Var v
foldConst (Apply Add (Const 0) (Var v)) = Var v
foldConst e = e
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Lesson 5: Recursion over trees
// ---------------------------------------------------------------------------

const treeSetup = hs`data Tree = Leaf | Node Tree Int Tree
  deriving (Eq, Show)

t1 :: Tree
t1 = Node (Node Leaf 1 Leaf) 2 (Node Leaf 3 (Node Leaf 4 Leaf))
`;

const expSetup = hs`data Exp = Const Int | Var String | Add Exp Exp | Mul Exp Exp
  deriving (Eq, Show)

e1 :: Exp
e1 = Add (Const 2) (Mul (Var "x") (Const 3))

e2 :: Exp
e2 = Mul (Add (Var "x") (Var "y")) (Add (Var "x") (Const 1))
`;

const treerec: Lesson = {
  id: "treerec",
  title: "Recursion over trees",
  blurb: "One equation per constructor: the most important skill in the whole exam.",
  steps: [
    {
      k: "read",
      body: md(
        "Nearly every January test has a recursive data type at its heart: Boolean expressions (2009), types (2011), regular expressions (2014), program expressions (2015, 2018, 2021, 2022), formulas (2019). Writing functions over them is worth more marks than anything else.",
        "",
        "We'll start with the simplest tree: a binary tree of Ints.",
        "",
        "```",
        "data Tree = Leaf | Node Tree Int Tree",
        "  deriving (Eq, Show)",
        "```",
        "",
        "A Tree is either an empty `Leaf`, or a `Node` holding a left subtree, a number, and a right subtree. Example:",
        "",
        "```",
        "t1 = Node (Node Leaf 1 Leaf) 2 (Node Leaf 3 (Node Leaf 4 Leaf))",
        "",
        "        2",
        "       / \\",
        "      1   3",
        "           \\",
        "            4",
        "```",
        "",
        "(The empty Leafs aren't drawn.) A subtree is just a smaller tree inside a bigger one.",
      ),
    },
    {
      k: "quiz",
      q: "How many `Node`s does `t1` contain?",
      options: ["3", "4", "5", "8"],
      answer: 1,
      why: "One for each number: 1, 2, 3 and 4. (It also contains five `Leaf`s.)",
    },
    {
      k: "read",
      body: md(
        "Here is the recipe. Learn it by heart: it solves most exam tree questions.",
        "",
        "1. Write one equation per constructor.",
        "2. For a constructor with no subtrees (like `Leaf`), give the answer directly. This is the base case.",
        "3. For a constructor with subtrees, call your function on each subtree, then combine those answers with the other fields.",
        "",
        "Trust the recursive calls: assume they already give the right answer for the subtrees. Your only job is the combining.",
        "",
        "```",
        "size :: Tree -> Int",
        "size Leaf         = 0",
        "size (Node l _ r) = size l + 1 + size r",
        "```",
        "",
        "In words: an empty tree has no nodes; a Node has all the nodes on its left, plus itself, plus all the nodes on its right.",
      ),
    },
    {
      k: "quiz",
      q: "Using that definition, what is `size (Node Leaf 5 (Node Leaf 6 Leaf))`?",
      options: ["1", "2", "3", "4"],
      answer: 1,
      why: "`size Leaf + 1 + size (Node Leaf 6 Leaf)` = `0 + 1 + (0 + 1 + 0)` = 2.",
    },
    {
      k: "write",
      setup: treeSetup,
      body: md(
        "Write `sumTree`, which adds up all the numbers in a tree. Follow the recipe: one equation for `Leaf`, one for `Node`.",
        "",
        "(`Tree` and the example `t1` are given.)",
      ),
      starter: hs`sumTree :: Tree -> Int
sumTree Leaf = undefined
sumTree (Node l x r) = undefined
`,
      tests: [
        { expr: "sumTree t1", expected: "10" },
        { expr: "sumTree Leaf", expected: "0" },
        { expr: "sumTree (Node Leaf 7 Leaf)", expected: "7" },
        { expr: "sumTree (Node (Node Leaf (-3) Leaf) 3 Leaf)", expected: "0" },
      ],
      hint: "`sumTree Leaf = 0` and `sumTree (Node l x r) = sumTree l + x + sumTree r`.",
      solution: hs`sumTree :: Tree -> Int
sumTree Leaf = 0
sumTree (Node l x r) = sumTree l + x + sumTree r
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `leaves`, which counts the `Leaf`s in a tree (not the Nodes).",
      starter: hs`leaves :: Tree -> Int
leaves t = undefined
`,
      tests: [
        { expr: "leaves t1", expected: "5" },
        { expr: "leaves Leaf", expected: "1" },
        { expr: "leaves (Node Leaf 7 Leaf)", expected: "2" },
        { expr: "leaves (Node (Node Leaf 1 Leaf) 2 Leaf)", expected: "3" },
      ],
      hint: "This time `Leaf` is what you're counting, so `leaves Leaf = 1`. A Node itself adds nothing: `leaves l + leaves r`.",
      solution: hs`leaves :: Tree -> Int
leaves Leaf = 1
leaves (Node l _ r) = leaves l + leaves r
`,
    },
    {
      k: "read",
      body: md(
        "The depth (or height) of a tree is the number of Nodes on the longest path from the top down. The combining step uses `max` instead of `+`:",
        "",
        "```",
        "depth :: Tree -> Int",
        "depth Leaf         = 0",
        "depth (Node l _ r) = 1 + max (depth l) (depth r)",
        "```",
        "",
        "In words: a Node is one level, plus however deep the deeper of its two subtrees is.",
        "",
        "Notice that the shape is identical to `size` and `sumTree`. Only the base value and the combining change. Once you see this, tree questions become fill-in-the-blanks.",
      ),
    },
    {
      k: "predict",
      body: "Unfolding `depth (Node (Node Leaf 1 Leaf) 2 Leaf)` step by step gives this expression. What is its value?",
      expr: "1 + max (1 + max 0 0) 0",
      answer: "2",
      why: "The inner part is the left subtree: `1 + max 0 0` is 1. Then `1 + max 1 0` is 2.",
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `depth`.",
      starter: hs`depth :: Tree -> Int
depth t = undefined
`,
      tests: [
        { expr: "depth t1", expected: "3" },
        { expr: "depth Leaf", expected: "0" },
        { expr: "depth (Node Leaf 7 Leaf)", expected: "1" },
        { expr: "depth (Node (Node (Node Leaf 1 Leaf) 2 Leaf) 3 (Node Leaf 4 Leaf))", expected: "3" },
      ],
      hint: "`depth Leaf = 0` and `depth (Node l _ r) = 1 + max (depth l) (depth r)`.",
      solution: hs`depth :: Tree -> Int
depth Leaf = 0
depth (Node l _ r) = 1 + max (depth l) (depth r)
`,
    },
    {
      k: "read",
      body: md(
        "Collecting things into a list is the same recipe, combining with `++`. To list the numbers left to right (called an in-order traversal):",
        "",
        "```",
        "flatten :: Tree -> [Int]",
        "flatten Leaf         = []",
        "flatten (Node l x r) = flatten l ++ [x] ++ flatten r",
        "```",
        "",
        "`x` is one Int, so wrap it as `[x]` to join it with `++`. The empty list is the base case for collecting, just as 0 is for adding.",
        "",
        "For a yes/no question, combine with `||` (or) or `&&` (and). Is there a 3 anywhere?",
        "",
        "```",
        "member :: Int -> Tree -> Bool",
        "member _ Leaf         = False",
        "member n (Node l x r) = x == n || member n l || member n r",
        "```",
      ),
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `flatten`.",
      starter: hs`flatten :: Tree -> [Int]
flatten t = undefined
`,
      tests: [
        { expr: "flatten t1", expected: "[1, 2, 3, 4]" },
        { expr: "flatten Leaf", expected: "[]" },
        { expr: "flatten (Node (Node Leaf 9 Leaf) 5 (Node Leaf 1 Leaf))", expected: "[9, 5, 1]" },
        { expr: "flatten (Node Leaf 1 (Node Leaf 2 (Node Leaf 3 Leaf)))", expected: "[1, 2, 3]" },
      ],
      hint: "`flatten Leaf = []` and `flatten (Node l x r) = flatten l ++ [x] ++ flatten r`.",
      solution: hs`flatten :: Tree -> [Int]
flatten Leaf = []
flatten (Node l x r) = flatten l ++ [x] ++ flatten r
`,
    },
    {
      k: "quiz",
      q: "What would `flatten (Node l x r) = [x] ++ flatten l ++ flatten r` give for `t1`?",
      options: ["`[1, 2, 3, 4]`", "`[2, 1, 3, 4]`", "`[4, 3, 2, 1]`", "`[2, 3, 4, 1]`"],
      answer: 1,
      why: "Each node now comes before its subtrees (a pre-order traversal): 2 first, then the left subtree (1), then the right (3, then 4).",
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `member n t`, which says whether `n` is anywhere in the tree. (The tree isn't sorted, so search both sides.)",
      starter: hs`member :: Int -> Tree -> Bool
member n t = undefined
`,
      tests: [
        { expr: "member 3 t1", expected: "True" },
        { expr: "member 4 t1", expected: "True", label: "deep in the tree" },
        { expr: "member 5 t1", expected: "False" },
        { expr: "member 0 Leaf", expected: "False" },
      ],
      hint: "`member _ Leaf = False` and `member n (Node l x r) = x == n || member n l || member n r`.",
      solution: hs`member :: Int -> Tree -> Bool
member _ Leaf = False
member n (Node l x r) = x == n || member n l || member n r
`,
    },
    {
      k: "read",
      body: md(
        "Some functions take a tree and give back a new tree. The rule: rebuild each constructor with the same constructor, using the recursive results for the subtrees.",
        "",
        "```",
        "addOne :: Tree -> Tree",
        "addOne Leaf         = Leaf",
        "addOne (Node l x r) = Node (addOne l) (x + 1) (addOne r)",
        "```",
        "",
        "Every Node stays a Node, every Leaf stays a Leaf; only the numbers change. Rewriting, renaming and substituting in exam expressions all work this way.",
      ),
    },
    {
      k: "write",
      setup:
        treeSetup +
        hs`
inorder :: Tree -> [Int]
inorder Leaf = []
inorder (Node l x r) = inorder l ++ [x] ++ inorder r
`,
      body: md(
        "Write `mirror`, which swaps left and right at every level.",
        "",
        "```",
        "     2                2",
        "    / \\      ->     / \\",
        "   1   3           3   1",
        "```",
      ),
      starter: hs`mirror :: Tree -> Tree
mirror t = undefined
`,
      tests: [
        { expr: "mirror (Node (Node Leaf 1 Leaf) 2 (Node Leaf 3 Leaf))", expected: "Node (Node Leaf 3 Leaf) 2 (Node Leaf 1 Leaf)" },
        { expr: "mirror Leaf", expected: "Leaf" },
        { expr: "inorder (mirror t1)", expected: "[4, 3, 2, 1]", label: "mirroring reverses the in-order list" },
        { expr: "mirror (mirror t1)", expected: "t1" },
      ],
      hint: "`mirror (Node l x r) = Node (mirror r) x (mirror l)`: swap the sides AND mirror each of them.",
      solution: hs`mirror :: Tree -> Tree
mirror Leaf = Leaf
mirror (Node l x r) = Node (mirror r) x (mirror l)
`,
    },
    {
      k: "quiz",
      q: "What's wrong with `mirror (Node l x r) = Node r x l`?",
      options: [
        "Nothing",
        "It only swaps the top level; the subtrees aren't mirrored",
        "It's a type error",
        "It loses `x`",
      ],
      answer: 1,
      why: "Without recursive calls, deeper levels stay as they were. The most common tree bug in exams is forgetting to recurse on some field.",
    },
    {
      k: "read",
      body: md(
        "Now the kind of tree the exams really use: an expression tree. Here's a small version of the 2018 and 2021 types:",
        "",
        "```",
        "data Exp = Const Int | Var String | Add Exp Exp | Mul Exp Exp",
        "  deriving (Eq, Show)",
        "",
        "e1 = Add (Const 2) (Mul (Var \"x\") (Const 3))      -- 2 + x * 3",
        "```",
        "",
        "`Const` and `Var` have no sub-expressions: they're the base cases. `Add` and `Mul` have two sub-expressions each. Same recipe, four equations.",
        "",
        "To evaluate an expression we need the variables' values: an environment, which is just a lookup table `[(String, Int)]`. In 2018 it was `eval :: Exp -> State -> Int` (3 marks):",
        "",
        "```",
        "eval (Const n) env = n",
        "eval (Var v)   env = lookUp v env",
        "eval (Add a b) env = eval a env + eval b env",
        "eval (Mul a b) env = ...",
        "```",
        "",
        "The environment is passed along unchanged to every recursive call.",
      ),
    },
    {
      k: "write",
      setup: expSetup + hs`
lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x table = head [v | (k, v) <- table, k == x]
`,
      body: "Write `eval`. `lookUp` is given. Precondition: every variable is in the environment.",
      starter: hs`eval :: Exp -> [(String, Int)] -> Int
eval e env = undefined
`,
      tests: [
        { expr: `eval e1 [("x", 5)]`, expected: "17" },
        { expr: `eval e2 [("x", 2), ("y", 3)]`, expected: "15" },
        { expr: "eval (Const 7) []", expected: "7" },
        { expr: `eval (Var "y") [("x", 1), ("y", 9)]`, expected: "9" },
        { expr: "eval (Mul (Const 0) (Add (Const 4) (Const 5))) []", expected: "0" },
      ],
      hint: "Four equations, one per constructor. `Add` and `Mul` call `eval` on both sub-expressions with the same `env`.",
      solution: hs`eval :: Exp -> [(String, Int)] -> Int
eval (Const n) _ = n
eval (Var v) env = lookUp v env
eval (Add a b) env = eval a env + eval b env
eval (Mul a b) env = eval a env * eval b env
`,
    },
    {
      k: "quiz",
      q: "What is `eval (Add (Const 2) (Mul (Var \"x\") (Const 3))) [(\"x\", 5)]`?",
      options: ["17", "21", "10", "25"],
      answer: 0,
      why: "The tree's shape decides the order: the `Mul` is inside the `Add`, so it's `2 + (5 * 3)` = 17. Trees never need brackets or precedence rules.",
    },
    {
      k: "write",
      setup: expSetup,
      body: md(
        "Write `vars`, which lists the variable names in an expression, left to right, keeping duplicates.",
        "",
        "```",
        "vars e2   is  [\"x\", \"y\", \"x\"]",
        "```",
        "",
        "This is the same \"collect into a list\" pattern as `flatten`. (In 2019, `vars` also had to sort and remove duplicates: you'd just wrap the result in `sort (nub ...)`.)",
      ),
      starter: hs`vars :: Exp -> [String]
vars e = undefined
`,
      tests: [
        { expr: "vars e2", expected: `["x", "y", "x"]` },
        { expr: "vars e1", expected: `["x"]` },
        { expr: "vars (Const 3)", expected: "[]" },
        { expr: `vars (Add (Var "b") (Mul (Var "a") (Var "c")))`, expected: `["b", "a", "c"]` },
      ],
      hint: "`vars (Const _) = []`, `vars (Var v) = [v]`, and for `Add a b` and `Mul a b`: `vars a ++ vars b`.",
      solution: hs`vars :: Exp -> [String]
vars (Const _) = []
vars (Var v) = [v]
vars (Add a b) = vars a ++ vars b
vars (Mul a b) = vars a ++ vars b
`,
    },
    {
      k: "read",
      body: md(
        "Renaming: 2021's `renameExp` (2 marks) replaced every variable using a lookup table. Its types:",
        "",
        "```",
        "data Op  = Add | Mul | Eq | GEq",
        "data Exp = Const Int | Var Id | Apply Op Exp Exp",
        "type IdMap = [(Id, Id)]",
        "",
        "renameExp :: Exp -> IdMap -> Exp",
        "renameExp (Apply Add (Var \"a\") (Const 2)) [(\"a\", \"R1\")]",
        "  is  Apply Add (Var \"R1\") (Const 2)",
        "```",
        "",
        "Here one constructor, `Apply`, covers all the operators: the operator is just a field. That means fewer equations: three, one per constructor of `Exp`.",
        "",
        "- `Const n`: nothing to rename, give it back unchanged.",
        "- `Var v`: look `v` up in the map.",
        "- `Apply op a b`: rebuild with `Apply op`, renaming both sub-expressions.",
      ),
    },
    {
      k: "write",
      setup: hs`type Id = String
data Op = Add | Mul | Eq | GEq
  deriving (Eq, Show)
data Exp = Const Int | Var Id | Apply Op Exp Exp
  deriving (Eq, Show)
type IdMap = [(Id, Id)]

lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x table = head [v | (k, v) <- table, k == x]

idMap1 :: IdMap
idMap1 = [("a", "a"), ("b", "R1"), ("x", "R6"), ("y", "R1")]
`,
      body: md(
        "Exam 2021, Part III (2 marks): write `renameExp`. Precondition: every variable is in the map. `lookUp` is given.",
        "",
        "```",
        "renameExp (Apply Mul (Apply Add (Var \"x\") (Const 2)) (Var \"y\")) idMap1",
        "  is  Apply Mul (Apply Add (Var \"R6\") (Const 2)) (Var \"R1\")",
        "```",
      ),
      starter: hs`renameExp :: Exp -> IdMap -> Exp
renameExp e m = undefined
`,
      tests: [
        { expr: `renameExp (Apply Add (Var "a") (Var "b")) idMap1`, expected: `Apply Add (Var "a") (Var "R1")` },
        { expr: `renameExp (Apply Mul (Apply Add (Var "x") (Const 2)) (Var "y")) idMap1`, expected: `Apply Mul (Apply Add (Var "R6") (Const 2)) (Var "R1")` },
        { expr: "renameExp (Const 5) []", expected: "Const 5" },
        { expr: `renameExp (Var "x") idMap1`, expected: `Var "R6"` },
      ],
      hint: "`renameExp (Const n) _ = Const n`, `renameExp (Var v) m = Var (lookUp v m)`, `renameExp (Apply op a b) m = Apply op (renameExp a m) (renameExp b m)`.",
      solution: hs`renameExp :: Exp -> IdMap -> Exp
renameExp (Const n) _ = Const n
renameExp (Var v) m = Var (lookUp v m)
renameExp (Apply op a b) m = Apply op (renameExp a m) (renameExp b m)
`,
    },
    {
      k: "quiz",
      q: "A student writes `renameExp (Apply op a b) m = Apply op a b`. Which test would catch the bug?",
      options: [
        "`renameExp (Const 5) []`",
        "`renameExp (Var \"x\") idMap1`",
        "`renameExp (Apply Add (Var \"x\") (Const 1)) idMap1`",
        "None: it's correct",
      ],
      answer: 2,
      why: "The variables inside an `Apply` are never renamed, because there are no recursive calls. Simple tests on `Const` or a lone `Var` would still pass, which is why exam tests always include nested examples.",
    },
    {
      k: "read",
      body: md(
        "Substitution replaces a variable by a value. 2018's `sub :: Id -> Int -> Exp -> Exp` (3 marks) replaced a variable with a constant; 2009's `restrict :: BExp -> Index -> Bool -> BExp` (2 marks, and needed again for building BDDs in Part III) replaced `IdRef i` with `Prim b`.",
        "",
        "Both had a twist: after rebuilding each node, simplify it. 2009's spec said \"invoke your simplify function each time you build a new Not, And or Or expression\":",
        "",
        "```",
        "restrict (Prim b) _ _ = Prim b",
        "restrict (IdRef j) i b",
        "  | j == i    = Prim b",
        "  | otherwise = IdRef j",
        "restrict (Not e) i b   = simplify (Not (restrict e i b))",
        "restrict (And x y) i b = simplify (And (restrict x i b) (restrict y i b))",
        "restrict (Or x y) i b  = ...",
        "```",
        "",
        "Because the recursive calls run first, the children are already as simple as possible when `simplify` looks at the parent. So simplifications ripple upwards.",
      ),
    },
    {
      k: "write",
      setup: expSetup,
      body: md(
        "Write `substitute v n e`, which replaces every `Var v` in `e` with `Const n`. Other variables stay.",
        "",
        "```",
        "substitute \"x\" 4 e1   is  Add (Const 2) (Mul (Const 4) (Const 3))",
        "```",
      ),
      starter: hs`substitute :: String -> Int -> Exp -> Exp
substitute v n e = undefined
`,
      tests: [
        { expr: `substitute "x" 4 e1`, expected: "Add (Const 2) (Mul (Const 4) (Const 3))" },
        { expr: `substitute "x" 0 e2`, expected: `Mul (Add (Const 0) (Var "y")) (Add (Const 0) (Const 1))` },
        { expr: `substitute "z" 1 e2`, expected: "e2", label: "no z: unchanged" },
        { expr: `substitute "x" 9 (Var "x")`, expected: "Const 9" },
      ],
      hint: "Guards in the `Var` equation: `| w == v = Const n` and `| otherwise = Var w`. `Add` and `Mul` rebuild with recursive calls.",
      solution: hs`substitute :: String -> Int -> Exp -> Exp
substitute _ _ (Const c) = Const c
substitute v n (Var w)
  | w == v    = Const n
  | otherwise = Var w
substitute v n (Add a b) = Add (substitute v n a) (substitute v n b)
substitute v n (Mul a b) = Mul (substitute v n a) (substitute v n b)
`,
    },
    {
      k: "write",
      setup: hs`type Index = Int
data BExp = Prim Bool | IdRef Index | Not BExp | And BExp BExp | Or BExp BExp
  deriving (Eq, Show)

simplify :: BExp -> BExp
simplify (Not (Prim b)) = Prim (not b)
simplify (And (Prim a) (Prim b)) = Prim (a && b)
simplify (Or (Prim a) (Prim b)) = Prim (a || b)
simplify e = e

b7 :: BExp
b7 = Or (Not (IdRef 3)) (Or (IdRef 2) (Not (IdRef 9)))
`,
      body: md(
        "Exam 2009, Part II (2 marks): write `restrict e i b`, replacing variable `i` by the constant `b` and calling the given `simplify` every time you build a `Not`, `And` or `Or`.",
        "",
        "```",
        "restrict b7 2 True",
        "  is  Or (Not (IdRef 3)) (Or (Prim True) (Not (IdRef 9)))",
        "restrict (restrict b7 2 True) 9 False",
        "  is  Or (Not (IdRef 3)) (Prim True)",
        "```",
        "",
        "Why isn't the first result simpler? `Or (Prim True) (Not (IdRef 9))` has only one `Prim` argument, and `simplify` only handles two.",
      ),
      starter: hs`restrict :: BExp -> Index -> Bool -> BExp
restrict e i b = undefined
`,
      tests: [
        { expr: "restrict b7 2 True", expected: "Or (Not (IdRef 3)) (Or (Prim True) (Not (IdRef 9)))" },
        { expr: "restrict (restrict b7 2 True) 9 False", expected: "Or (Not (IdRef 3)) (Prim True)" },
        { expr: "restrict (restrict (restrict b7 2 True) 9 False) 3 True", expected: "Prim True" },
        { expr: "restrict (IdRef 5) 4 True", expected: "IdRef 5" },
        { expr: "restrict (And (IdRef 1) (Not (IdRef 1))) 1 True", expected: "Prim False" },
      ],
      hint: "Five equations. `Prim` stays; `IdRef j` becomes `Prim b` when `j == i`; the other three rebuild with recursive calls and wrap the result in `simplify`.",
      solution: hs`restrict :: BExp -> Index -> Bool -> BExp
restrict (Prim c) _ _ = Prim c
restrict (IdRef j) i b
  | j == i    = Prim b
  | otherwise = IdRef j
restrict (Not e) i b = simplify (Not (restrict e i b))
restrict (And x y) i b = simplify (And (restrict x i b) (restrict y i b))
restrict (Or x y) i b = simplify (Or (restrict x i b) (restrict y i b))
`,
    },
    {
      k: "quiz",
      q: "In `restrict (Not e) i b = simplify (Not (restrict e i b))`, why is `simplify` applied after the recursive call rather than before?",
      options: [
        "It makes no difference",
        "So it sees the already-restricted child: the substitution might have just turned it into a `Prim` it can simplify",
        "Because `simplify` is recursive",
        "To avoid a type error",
      ],
      answer: 1,
      why: "Simplifying the old `Not e` would see the unrestricted `e`. Working bottom-up means every node is simplified with fully simplified children.",
    },
    {
      k: "write",
      setup: hs`data Type = TInt | TBool | TFun Type Type | TErr | TVar String
  deriving (Eq, Ord, Show)
`,
      body: md(
        "Exam 2011, Part I (3 marks): with",
        "",
        "```",
        "data Type = TInt | TBool | TFun Type Type | TErr | TVar String",
        "```",
        "",
        "write `occurs v t`: is the type variable `v` (a `TVar v`) anywhere inside `t`? A variable occurs in `TFun t t'` if it occurs in either part.",
        "",
        "```",
        "occurs \"x\" (TVar \"y\")                is  False",
        "occurs \"x\" TBool                     is  False",
        "occurs \"x\" (TFun TBool (TVar \"x\"))   is  True",
        "```",
        "",
        "Three constructors have no sub-types: a catch-all can cover them in one go, as long as it comes last.",
      ),
      starter: hs`occurs :: String -> Type -> Bool
occurs v t = undefined
`,
      tests: [
        { expr: `occurs "x" (TVar "y")`, expected: "False" },
        { expr: `occurs "x" TBool`, expected: "False" },
        { expr: `occurs "x" (TFun TBool (TVar "x"))`, expected: "True" },
        { expr: `occurs "a" (TFun (TFun (TVar "a") TInt) TBool)`, expected: "True", label: "deep on the left" },
        { expr: `occurs "a" (TVar "a")`, expected: "True" },
        { expr: `occurs "z" (TFun TErr (TFun TInt TInt))`, expected: "False" },
      ],
      hint: "`occurs v (TVar w) = v == w`, `occurs v (TFun a b) = occurs v a || occurs v b`, and `occurs _ _ = False` last.",
      solution: hs`occurs :: String -> Type -> Bool
occurs v (TVar w) = v == w
occurs v (TFun a b) = occurs v a || occurs v b
occurs _ _ = False
`,
    },
    {
      k: "read",
      body: md(
        "Checklist for any exam tree question:",
        "",
        "1. Copy the `data` declaration into a comment and write one equation per constructor, in the same order. Name the fields with short letters.",
        "2. For every field whose type is the tree type itself, you almost certainly need a recursive call on it.",
        "3. Decide the base cases first: 0 for counting and adding, `[]` for collecting, `False` for \"is there any\", the unchanged value for rewriting.",
        "4. Combine: `+`, `max`, `++`, `||`, or rebuild with the same constructor.",
        "5. Test on the spec's examples, especially the nested ones.",
        "",
        "Common mistakes: forgetting a constructor (crash: \"Non-exhaustive patterns\"), forgetting to recurse on one field, a catch-all placed above other equations, and missing brackets in patterns like `(Add a b)`.",
      ),
    },
    {
      k: "quiz",
      q: md(
        "What happens with this definition when you call `count (Mul (Const 1) (Const 2))`?",
        "",
        "```",
        "count :: Exp -> Int",
        "count (Const _) = 1",
        "count (Var _)   = 1",
        "count (Add a b) = count a + count b",
        "```",
      ),
      options: ["It gives 2", "It gives 0", "It crashes: Non-exhaustive patterns in function count", "It won't compile"],
      answer: 2,
      why: "There's no equation for `Mul`. It compiles (with a warning at most), but crashes when a `Mul` is reached. One equation per constructor!",
    },
  ],
};

const drillTreerec: DrillSet = {
  id: "drill-treerec",
  lesson: "treerec",
  title: "Tree recursion drills",
  drills: [
    {
      k: "quiz",
      q: "In `size (Node l _ r) = size l + 1 + size r`, what is the `+ 1` for?",
      options: ["The Leaf", "The current Node itself", "The depth", "It's a mistake"],
      answer: 1,
      why: "The recursive calls count the nodes in the subtrees; the `+ 1` counts the node you're standing on.",
    },
    {
      k: "predict",
      body: "This is what `size (Node Leaf 4 (Node Leaf 5 Leaf))` unfolds to:",
      expr: "0 + 1 + (0 + 1 + 0)",
      answer: "2",
      why: "Two Nodes, each contributing 1.",
    },
    {
      k: "quiz",
      q: "How many equations do you need for a function over `data Exp = Const Int | Var String | Add Exp Exp | Mul Exp Exp`, with no catch-all?",
      options: ["1", "2", "4", "8"],
      answer: 2,
      why: "One per constructor: `Const`, `Var`, `Add`, `Mul`.",
    },
    {
      k: "predict",
      body: "Combining the depths of two subtrees, 2 and 0:",
      expr: "1 + max 2 0",
      answer: "3",
      why: "The deeper side is 2, plus 1 for this node.",
    },
    {
      k: "quiz",
      q: "In `flatten (Node l x r) = flatten l ++ [x] ++ flatten r`, why `[x]` and not `x`?",
      options: ["Style only", "`++` joins two lists, and `x` is a single Int", "To sort the result", "`x` might be a Leaf"],
      answer: 1,
      why: "Both sides of `++` must be lists. `[x]` is the one-element list containing `x`. (`flatten l ++ x : flatten r` would also work.)",
    },
    {
      k: "predict",
      expr: "concat [[3], [1, 2], []]",
      answer: "[3, 1, 2]",
      why: "`concat` joins a list of lists, which is how you combine the lists collected from several subtrees.",
    },
    {
      k: "predict",
      expr: 'nub "banana"',
      answer: '"ban"',
      why: "`nub` keeps the first copy of each element. Use it on collected variable lists to drop repeats.",
    },
    {
      k: "quiz",
      q: "What is the right type for evaluating an expression with an environment of variable values?",
      options: ["`eval :: Exp -> Int`", "`eval :: Exp -> [(String, Int)] -> Int`", "`eval :: [(String, Int)] -> Int`", "`eval :: Exp -> Exp`"],
      answer: 1,
      why: "It needs the expression and the environment (a lookup table for the variables), and gives a number.",
    },
    {
      k: "predict",
      expr: 'lookup "y" [("x", "R1"), ("y", "R2")]',
      answer: 'Just "R2"',
      why: "This is the lookup that `renameExp` does at each `Var`.",
    },
    {
      k: "quiz",
      q: "A function on trees has `f Leaf = ...` but the `Node` equation never calls `f`. What can it possibly look at?",
      options: ["The whole tree", "Only the top node and its immediate fields", "Only the Leafs", "Nothing"],
      answer: 1,
      why: "Without recursion, a function only sees the outermost constructor. That's fine for `value` or `simplify` (2009 required it to be non-recursive), but wrong for `size` or `renameExp`.",
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `doubleAll`, which doubles every number in a tree, keeping the shape.",
      starter: hs`doubleAll :: Tree -> Tree
doubleAll t = undefined
`,
      tests: [
        { expr: "doubleAll (Node Leaf 3 Leaf)", expected: "Node Leaf 6 Leaf" },
        { expr: "doubleAll Leaf", expected: "Leaf" },
        { expr: "doubleAll t1", expected: "Node (Node Leaf 2 Leaf) 4 (Node Leaf 6 (Node Leaf 8 Leaf))" },
        { expr: "doubleAll (Node (Node Leaf (-1) Leaf) 0 Leaf)", expected: "Node (Node Leaf (-2) Leaf) 0 Leaf" },
      ],
      hint: "`doubleAll (Node l x r) = Node (doubleAll l) (2 * x) (doubleAll r)`.",
      solution: hs`doubleAll :: Tree -> Tree
doubleAll Leaf = Leaf
doubleAll (Node l x r) = Node (doubleAll l) (2 * x) (doubleAll r)
`,
    },
    {
      k: "predict",
      expr: "or [False, 3 > 2, False]",
      answer: "True",
      why: "`or` is True if any element is True. It's the list version of combining yes/no answers with `||`.",
    },
    {
      k: "write",
      setup: expSetup,
      body: "Write `countVars`, the number of `Var` nodes in an expression (repeats count each time).",
      starter: hs`countVars :: Exp -> Int
countVars e = undefined
`,
      tests: [
        { expr: "countVars e2", expected: "3" },
        { expr: "countVars e1", expected: "1" },
        { expr: "countVars (Const 0)", expected: "0" },
        { expr: `countVars (Var "q")`, expected: "1" },
      ],
      hint: "`Const` gives 0, `Var` gives 1, `Add` and `Mul` add up both sides.",
      solution: hs`countVars :: Exp -> Int
countVars (Const _) = 0
countVars (Var _) = 1
countVars (Add a b) = countVars a + countVars b
countVars (Mul a b) = countVars a + countVars b
`,
    },
    {
      k: "quiz",
      q: "Someone defines `depth Leaf = 1` instead of 0. What happens to `depth (Node Leaf 7 Leaf)`?",
      options: ["Still 1", "It becomes 2", "It crashes", "It becomes 0"],
      answer: 1,
      why: "`1 + max 1 1` is 2. Every depth is now one too big. The base case sets the scale for everything.",
    },
    {
      k: "predict",
      expr: 'fromMaybe "q" (lookup "z" [("x", "r")])',
      answer: '"q"',
      why: "`\"z\"` isn't in the table, so the default is used. 2011's `applySub` leaves a type variable unchanged in exactly this situation.",
    },
    {
      k: "write",
      setup: treeSetup,
      body: md(
        "Write `leftmost`, which gives the leftmost number in the tree (the first one in `flatten` order), or `Nothing` for an empty tree. Don't use `flatten`.",
        "",
        "Hint: in a Node, if the left subtree has a leftmost number, that's the answer; otherwise it's this node's number.",
      ),
      starter: hs`leftmost :: Tree -> Maybe Int
leftmost t = undefined
`,
      tests: [
        { expr: "leftmost t1", expected: "Just 1" },
        { expr: "leftmost Leaf", expected: "Nothing" },
        { expr: "leftmost (Node Leaf 5 (Node Leaf 6 Leaf))", expected: "Just 5" },
        { expr: "leftmost (Node (Node (Node Leaf 9 Leaf) 8 Leaf) 7 Leaf)", expected: "Just 9" },
      ],
      hint: "`leftmost (Node l x _) = case leftmost l of Nothing -> Just x; found -> found`.",
      solution: hs`leftmost :: Tree -> Maybe Int
leftmost Leaf = Nothing
leftmost (Node l x _)
  = case leftmost l of
      Nothing -> Just x
      found   -> found
`,
    },
    {
      k: "quiz",
      q: "When you rename or substitute inside an expression tree, which is true?",
      options: [
        "The result has the same shape; only the leaves change",
        "The result is always a list",
        "You only need an equation for `Var`",
        "You must sort the result",
      ],
      answer: 0,
      why: "Every constructor is rebuilt with itself; only `Var` nodes are changed. (If you also simplify, as in 2009 and 2018, the shape can shrink.)",
    },
    {
      k: "write",
      setup: expSetup,
      body: md(
        "Write `showExp`, which turns an expression into a String with full brackets around every `Add` and `Mul`.",
        "",
        "```",
        "showExp e1   is  \"(2+(x*3))\"",
        "```",
      ),
      starter: hs`showExp :: Exp -> String
showExp e = undefined
`,
      tests: [
        { expr: "showExp e1", expected: `"(2+(x*3))"` },
        { expr: "showExp e2", expected: `"((x+y)*(x+1))"` },
        { expr: "showExp (Const 7)", expected: `"7"` },
        { expr: `showExp (Var "abc")`, expected: `"abc"` },
      ],
      hint: "`showExp (Const n) = show n`, `showExp (Var v) = v`, `showExp (Add a b) = \"(\" ++ showExp a ++ \"+\" ++ showExp b ++ \")\"`.",
      solution: hs`showExp :: Exp -> String
showExp (Const n) = show n
showExp (Var v) = v
showExp (Add a b) = "(" ++ showExp a ++ "+" ++ showExp b ++ ")"
showExp (Mul a b) = "(" ++ showExp a ++ "*" ++ showExp b ++ ")"
`,
    },
    {
      k: "predict",
      expr: "sort (nub [\"c\", \"a\", \"c\", \"b\"])",
      answer: '["a", "b", "c"]',
      why: "`nub` removes the repeated `\"c\"`, then `sort` orders them. This is exactly 2019's `vars`.",
    },
    {
      k: "quiz",
      q: "To push a `Not` inside an `And` (De Morgan), which pattern matches \"a Not whose argument is an And\"?",
      options: ["`toNNF Not (And f g)`", "`toNNF (Not (And f g))`", "`toNNF (Not And f g)`", "`toNNF (And (Not f g))`"],
      answer: 1,
      why: "Patterns nest exactly like values: the whole thing is a `Not` whose single field is `(And f g)`. Each constructor with fields needs its own brackets.",
    },
    {
      k: "write",
      setup: hs`type Id = String
data Op = Add | Mul | Eq | Gtr
  deriving (Eq, Show)
data Exp = Const Int | Var Id | Apply Op Exp Exp | Phi Exp Exp
  deriving (Eq, Show)
type State = [(Id, Int)]

lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x table = head [v | (k, v) <- table, k == x]

apply :: Op -> Int -> Int -> Int
apply Add x y = x + y
apply Mul x y = x * y
apply Eq x y = fromEnum (x == y)
apply Gtr x y = fromEnum (x > y)

s1 :: State
s1 = [("x", 7), ("y", 8)]
`,
      body: md(
        "Exam 2018, Part I (3 marks): write `eval`. `lookUp` and `apply` are given. Precondition: every variable is bound, and there are no `Phi`s (so you don't need an equation for `Phi`).",
        "",
        "```",
        "eval (Var \"x\") s1                                          is  7",
        "eval (Apply Mul (Apply Add (Var \"x\") (Const 1)) (Var \"y\")) s1   is  64",
        "```",
      ),
      starter: hs`eval :: Exp -> State -> Int
eval e st = undefined
`,
      tests: [
        { expr: `eval (Var "x") s1`, expected: "7" },
        { expr: `eval (Apply Mul (Apply Add (Var "x") (Const 1)) (Var "y")) s1`, expected: "64" },
        { expr: "eval (Const 3) []", expected: "3" },
        { expr: `eval (Apply Gtr (Var "y") (Var "x")) s1`, expected: "1" },
        { expr: `eval (Apply Eq (Apply Add (Const 1) (Const 1)) (Const 3)) []`, expected: "0" },
      ],
      hint: "Three equations: `Const n` gives `n`; `Var v` gives `lookUp v st`; `Apply op a b` gives `apply op (eval a st) (eval b st)`.",
      solution: hs`eval :: Exp -> State -> Int
eval (Const n) _ = n
eval (Var v) st = lookUp v st
eval (Apply op a b) st = apply op (eval a st) (eval b st)
`,
    },
    {
      k: "write",
      setup: hs`import Data.List (nub, sort)

type Id = String
data Formula = Var Id | Not Formula | And Formula Formula | Or Formula Formula
  deriving (Eq, Show)
`,
      body: md(
        "Exam 2019, Part I (3 marks): with",
        "",
        "```",
        "data Formula = Var Id | Not Formula | And Formula Formula | Or Formula Formula",
        "```",
        "",
        "write `vars`: the variable names in a formula, sorted, without duplicates. `nub` and `sort` are imported.",
        "",
        "```",
        "vars (Not (Not (Var \"a\")))   is  [\"a\"]",
        "```",
        "",
        "Collect all the names with recursion, then tidy up once at the top. A helper in a `where` that does the collecting keeps it clean.",
      ),
      starter: hs`vars :: Formula -> [Id]
vars f = undefined
`,
      tests: [
        { expr: `vars (Not (Not (Var "a")))`, expected: `["a"]` },
        { expr: `vars (And (Var "c") (Or (Var "a") (Not (Var "c"))))`, expected: `["a", "c"]` },
        { expr: `vars (Var "z")`, expected: `["z"]` },
        { expr: `vars (Or (And (Var "b") (Var "d")) (And (Var "a") (Var "b")))`, expected: `["a", "b", "d"]` },
      ],
      hint: md(
        "```",
        "vars f = sort (nub (collect f))",
        "  where",
        "    collect (Var v)   = [v]",
        "    collect (Not g)   = collect g",
        "    collect (And g h) = collect g ++ collect h",
        "    collect (Or g h)  = collect g ++ collect h",
        "```",
      ),
      solution: hs`vars :: Formula -> [Id]
vars f = sort (nub (collect f))
  where
    collect (Var v) = [v]
    collect (Not g) = collect g
    collect (And g h) = collect g ++ collect h
    collect (Or g h) = collect g ++ collect h
`,
    },
    {
      k: "write",
      setup: hs`type Id = String
data Op = Add | Mul | Eq | Gtr
  deriving (Eq, Show)
data Exp = Const Int | Var Id | Apply Op Exp Exp | Phi Exp Exp
  deriving (Eq, Show)

apply :: Op -> Int -> Int -> Int
apply Add x y = x + y
apply Mul x y = x * y
apply Eq x y = fromEnum (x == y)
apply Gtr x y = fromEnum (x > y)

foldConst :: Exp -> Exp
foldConst (Phi (Const a) (Const b))
  | a == b = Const a
foldConst (Apply op (Const a) (Const b)) = Const (apply op a b)
foldConst (Apply Add (Var v) (Const 0)) = Var v
foldConst (Apply Add (Const 0) (Var v)) = Var v
foldConst e = e
`,
      body: md(
        "Exam 2018, Part II (3 marks): write `sub v n e`, which substitutes `Const n` for every `Var v` in `e`, and applies the given `foldConst` to each `Apply` and `Phi` node it rebuilds (so constants fold bottom-up).",
        "",
        "```",
        "sub \"a\" 0 (Apply Add (Var \"a\") (Var \"x\"))   is  Var \"x\"",
        "```",
      ),
      starter: hs`sub :: Id -> Int -> Exp -> Exp
sub v n e = undefined
`,
      tests: [
        { expr: `sub "a" 0 (Apply Add (Var "a") (Var "x"))`, expected: `Var "x"` },
        { expr: `sub "x" 3 (Apply Mul (Var "x") (Apply Add (Var "x") (Const 1)))`, expected: "Const 12", label: "folds all the way up" },
        { expr: `sub "x" 1 (Var "y")`, expected: `Var "y"` },
        { expr: `sub "x" 2 (Phi (Var "x") (Const 2))`, expected: "Const 2" },
        { expr: `sub "x" 2 (Phi (Var "x") (Var "y"))`, expected: `Phi (Const 2) (Var "y")` },
      ],
      hint: "`sub v n (Apply op a b) = foldConst (Apply op (sub v n a) (sub v n b))`, the same for `Phi`; `Var w` becomes `Const n` when `w == v`.",
      solution: hs`sub :: Id -> Int -> Exp -> Exp
sub _ _ (Const c) = Const c
sub v n (Var w)
  | w == v    = Const n
  | otherwise = Var w
sub v n (Apply op a b) = foldConst (Apply op (sub v n a) (sub v n b))
sub v n (Phi a b) = foldConst (Phi (sub v n a) (sub v n b))
`,
    },
    {
      k: "write",
      setup: hs`import Data.Maybe (fromMaybe)

data Type = TInt | TBool | TFun Type Type | TErr | TVar String
  deriving (Eq, Ord, Show)
type Sub = [(String, Type)]

tryToLookUp :: Eq a => a -> b -> [(a, b)] -> b
tryToLookUp x def table = fromMaybe def (lookup x table)

s :: Sub
s = [("a", TBool), ("b", TFun TBool TInt)]
`,
      body: md(
        "Exam 2011, Part III: write `applySub sub t`, which replaces each `TVar v` in `t` by its binding in `sub`, leaving it unchanged if there's no binding. Use the given `tryToLookUp`.",
        "",
        "```",
        "applySub s TInt                     is  TInt",
        "applySub s (TFun (TVar \"a\") TInt)   is  TFun TBool TInt",
        "applySub s (TVar \"c\")               is  TVar \"c\"",
        "```",
      ),
      starter: hs`applySub :: Sub -> Type -> Type
applySub sub t = undefined
`,
      tests: [
        { expr: "applySub s TInt", expected: "TInt" },
        { expr: `applySub s (TFun (TVar "a") TInt)`, expected: "TFun TBool TInt" },
        { expr: `applySub s (TVar "c")`, expected: `TVar "c"` },
        { expr: `applySub s (TFun (TVar "b") (TFun (TVar "a") (TVar "q")))`, expected: `TFun (TFun TBool TInt) (TFun TBool (TVar "q"))` },
        { expr: `applySub [] (TVar "a")`, expected: `TVar "a"` },
      ],
      hint: "`applySub sub (TVar v) = tryToLookUp v (TVar v) sub` (the default is the variable itself), `applySub sub (TFun a b) = TFun (applySub sub a) (applySub sub b)`, and anything else is unchanged.",
      solution: hs`applySub :: Sub -> Type -> Type
applySub sub (TVar v) = tryToLookUp v (TVar v) sub
applySub sub (TFun a b) = TFun (applySub sub a) (applySub sub b)
applySub _ t = t
`,
    },
    {
      k: "write",
      setup: hs`type Id = String
data Formula = Var Id | Not Formula | And Formula Formula | Or Formula Formula
  deriving (Eq, Show)
`,
      body: md(
        "Exam 2019, Part II (4 marks): convert a formula to Negation Normal Form, where `Not` only ever appears directly on a `Var`. Push each `Not` inwards with these rules:",
        "",
        "```",
        "Not (Not f)    ->  f",
        "Not (And f g)  ->  Or (Not f) (Not g)        -- De Morgan",
        "Not (Or f g)   ->  And (Not f) (Not g)       -- De Morgan",
        "```",
        "",
        "and keep converting the results. `And`/`Or` just convert both sides; `Var` and `Not (Var v)` are already done.",
        "",
        "```",
        "toNNF (Not (Or (Var \"b\") (And (Var \"a\") (Not (Var \"c\")))))",
        "  is  And (Not (Var \"b\")) (Or (Not (Var \"a\")) (Var \"c\"))",
        "```",
        "",
        "Here patterns two constructors deep pay off: `toNNF (Not (And f g)) = ...`.",
      ),
      starter: hs`toNNF :: Formula -> Formula
toNNF f = undefined
`,
      tests: [
        { expr: `toNNF (Not (Not (Var "a")))`, expected: `Var "a"` },
        { expr: `toNNF (Not (Or (Var "b") (And (Var "a") (Not (Var "c")))))`, expected: `And (Not (Var "b")) (Or (Not (Var "a")) (Var "c"))` },
        {
          expr: `toNNF (Or (And (Var "a") (Not (Or (Var "b") (Var "c")))) (Not (Var "d")))`,
          expected: `Or (And (Var "a") (And (Not (Var "b")) (Not (Var "c")))) (Not (Var "d"))`,
        },
        { expr: `toNNF (Not (Var "x"))`, expected: `Not (Var "x")` },
        { expr: `toNNF (Not (Not (Not (Var "x"))))`, expected: `Not (Var "x")` },
      ],
      hint: md(
        "```",
        "toNNF (Not (Not f))   = toNNF f",
        "toNNF (Not (And f g)) = Or (toNNF (Not f)) (toNNF (Not g))",
        "toNNF (Not (Or f g))  = And (toNNF (Not f)) (toNNF (Not g))",
        "toNNF (And f g)       = And (toNNF f) (toNNF g)",
        "toNNF (Or f g)        = Or (toNNF f) (toNNF g)",
        "toNNF f               = f",
        "```",
      ),
      solution: hs`toNNF :: Formula -> Formula
toNNF (Not (Not f)) = toNNF f
toNNF (Not (And f g)) = Or (toNNF (Not f)) (toNNF (Not g))
toNNF (Not (Or f g)) = And (toNNF (Not f)) (toNNF (Not g))
toNNF (And f g) = And (toNNF f) (toNNF g)
toNNF (Or f g) = Or (toNNF f) (toNNF g)
toNNF f = f
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Lesson 6: Trees with lists of children
// ---------------------------------------------------------------------------

const roseSetup = hs`data Rose = Node Int [Rose]
  deriving (Eq, Show)

r1 :: Rose
r1 = Node 1 [Node 2 [Node 4 []], Node 3 [], Node 5 [Node 6 [], Node 7 []]]
`;

const xmlSetup = hs`type Name = String
type Attributes = [(String, String)]
data XML = Text String | Element Name Attributes [XML]
  deriving (Eq, Show)

x2 :: XML
x2 = Element "a" [("x", "1")] [Element "b" [] [Text "A"], Element "c" [] [], Element "b" [] [Text "B"]]
`;

const suffixSetup = hs`data SuffixTree = Leaf Int | Node [(String, SuffixTree)]
  deriving (Eq, Ord, Show)

t1 :: SuffixTree
t1 = Node [("banana", Leaf 0),
           ("a", Node [("na", Node [("na", Leaf 1), ("", Leaf 3)]), ("", Leaf 5)]),
           ("na", Node [("na", Leaf 2), ("", Leaf 4)])]
`;

const decisionSetup = hs`type AttName = String
type AttValue = String
data DecisionTree = Null | Leaf AttValue | Node AttName [(AttValue, DecisionTree)]
  deriving (Eq, Show)

fig :: DecisionTree
fig = Node "outlook" [("sunny", Node "temp" [("hot", Leaf "bad"), ("mild", Leaf "good")]), ("overcast", Leaf "good"), ("rainy", Leaf "bad")]
`;

const rosetrees: Lesson = {
  id: "rosetrees",
  title: "Trees with lists of children",
  blurb: "Rose trees, XML, suffix trees, decision trees, and two types that call each other.",
  steps: [
    {
      k: "read",
      body: md(
        "Binary trees have exactly two subtrees per node. Many exam trees allow any number of children, stored in a list. This is called a rose tree:",
        "",
        "```",
        "data Rose = Node Int [Rose]",
        "  deriving (Eq, Show)",
        "",
        "r1 = Node 1 [Node 2 [Node 4 []], Node 3 [], Node 5 [Node 6 [], Node 7 []]]",
        "",
        "        1",
        "      / | \\",
        "     2  3  5",
        "     |    / \\",
        "     4   6   7",
        "```",
        "",
        "There's only one constructor. A node with no children, like `Node 3 []`, plays the part of a leaf. You've seen this shape already: 2013's `data BinTree a = Node a Int [BinTree a]` is a rose tree.",
      ),
    },
    {
      k: "quiz",
      q: "How do you write a node holding 9 with no children?",
      options: ["`Node 9`", "`Leaf 9`", "`Node 9 []`", "`Node [] 9`"],
      answer: 2,
      why: "`Node` always has two fields: the number and the list of children. With no children, that list is empty.",
    },
    {
      k: "read",
      body: md(
        "The recipe changes slightly. There's one equation, and the recursive call has to be made on every child in the list. `map` does exactly that:",
        "",
        "```",
        "size :: Rose -> Int",
        "size (Node _ ts) = 1 + sum (map size ts)",
        "```",
        "",
        "`map size ts` is the list of the children's sizes; `sum` adds them; `1` counts this node.",
        "",
        "Where's the base case? It's hidden in the empty list: for `Node 3 []`, `map size []` is `[]` and `sum []` is 0, so the size is 1. The recursion stops by itself when there are no children.",
      ),
    },
    {
      k: "predict",
      body: "A node whose three children have sizes 1, 1 and 3. Its size is:",
      expr: "1 + sum [1, 1, 3]",
      answer: "6",
      why: "Add up the children and count the node itself.",
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `size` for rose trees. (`Rose` and `r1` are given.)",
      starter: hs`size :: Rose -> Int
size t = undefined
`,
      tests: [
        { expr: "size r1", expected: "7" },
        { expr: "size (Node 3 [])", expected: "1" },
        { expr: "size (Node 0 [Node 0 [], Node 0 []])", expected: "3" },
        { expr: "size (Node 1 [Node 2 [Node 3 [Node 4 []]]])", expected: "4" },
      ],
      hint: "`size (Node _ ts) = 1 + sum (map size ts)`",
      solution: hs`size :: Rose -> Int
size (Node _ ts) = 1 + sum (map size ts)
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `sumRose`, which adds up every number in the tree.",
      starter: hs`sumRose :: Rose -> Int
sumRose t = undefined
`,
      tests: [
        { expr: "sumRose r1", expected: "28" },
        { expr: "sumRose (Node 5 [])", expected: "5" },
        { expr: "sumRose (Node 1 [Node (-1) []])", expected: "0" },
        { expr: "sumRose (Node 10 [Node 20 [Node 30 []], Node 40 []])", expected: "100" },
      ],
      hint: "Like `size`, but this node contributes `x` instead of 1: `x + sum (map sumRose ts)`.",
      solution: hs`sumRose :: Rose -> Int
sumRose (Node x ts) = x + sum (map sumRose ts)
`,
    },
    {
      k: "read",
      body: md(
        "Depth needs the biggest child depth, and here's a trap: `maximum` crashes on an empty list.",
        "",
        "```",
        "depth (Node _ ts) = 1 + maximum (map depth ts)     -- crashes on Node 3 []",
        "depth (Node _ ts) = 1 + maximum (0 : map depth ts) -- safe",
        "```",
        "",
        "Putting a 0 on the front means a node with no children gets `1 + maximum [0]`, which is 1. With children, 0 never wins because every depth is at least 1.",
        "",
        "Watch for `maximum`, `minimum`, `head` and `foldr1` on lists of children: any of them can be empty.",
      ),
    },
    {
      k: "quiz",
      q: "What does `1 + maximum (map depth ts)` do on `Node 3 []`?",
      options: ["Gives 1", "Gives 0", "Crashes: maximum of an empty list", "Loops forever"],
      answer: 2,
      why: "`map depth []` is `[]`, and `maximum []` has no answer, so it throws an exception. Every rose tree has nodes without children, so this always crashes eventually.",
    },
    {
      k: "predict",
      expr: "maximum (0 : [])",
      answer: "0",
      why: "The list is just `[0]`, so the maximum is 0.",
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `depth`: the number of nodes on the longest path from the top down. A node with no children has depth 1.",
      starter: hs`depth :: Rose -> Int
depth t = undefined
`,
      tests: [
        { expr: "depth r1", expected: "3" },
        { expr: "depth (Node 3 [])", expected: "1" },
        { expr: "depth (Node 1 [Node 2 [Node 3 [Node 4 []]]])", expected: "4" },
        { expr: "depth (Node 1 [Node 2 [], Node 3 [Node 4 []], Node 5 []])", expected: "3" },
      ],
      hint: "`depth (Node _ ts) = 1 + maximum (0 : map depth ts)`",
      solution: hs`depth :: Rose -> Int
depth (Node _ ts) = 1 + maximum (0 : map depth ts)
`,
    },
    {
      k: "read",
      body: md(
        "To collect into a list, each child gives a list, so `map` gives a list of lists. `concat` joins them; `concatMap f xs` does both in one go (it's `concat (map f xs)`):",
        "",
        "```",
        "flatten :: Rose -> [Int]",
        "flatten (Node x ts) = x : concatMap flatten ts",
        "```",
        "",
        "This lists each node before its children (pre-order). The same thing as a comprehension, which some people find easier to read:",
        "",
        "```",
        "flatten (Node x ts) = x : [y | t <- ts, y <- flatten t]",
        "```",
      ),
    },
    {
      k: "predict",
      expr: "concatMap (\\x -> [x, x * 10]) [1, 2]",
      answer: "[1, 10, 2, 20]",
      why: "Each element gives a two-element list, and the lists are joined: `[1, 10] ++ [2, 20]`.",
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `flatten`, listing each node's number before its children's numbers.",
      starter: hs`flatten :: Rose -> [Int]
flatten t = undefined
`,
      tests: [
        { expr: "flatten r1", expected: "[1, 2, 4, 3, 5, 6, 7]" },
        { expr: "flatten (Node 9 [])", expected: "[9]" },
        { expr: "flatten (Node 1 [Node 2 [], Node 3 []])", expected: "[1, 2, 3]" },
        { expr: "length (flatten r1)", expected: "7" },
      ],
      hint: "`flatten (Node x ts) = x : concatMap flatten ts`",
      solution: hs`flatten :: Rose -> [Int]
flatten (Node x ts) = x : concatMap flatten ts
`,
    },
    {
      k: "read",
      body: md(
        "Sometimes a childless node needs a different answer. Give it its own equation, before the general one:",
        "",
        "```",
        "leaves :: Rose -> [Int]",
        "leaves (Node x []) = [x]",
        "leaves (Node _ ts) = concatMap leaves ts",
        "```",
        "",
        "The pattern `(Node x [])` only matches a node whose children list is empty. Anything else falls through to the second equation.",
      ),
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `leaves`: the numbers in nodes with no children, left to right.",
      starter: hs`leaves :: Rose -> [Int]
leaves t = undefined
`,
      tests: [
        { expr: "leaves r1", expected: "[4, 3, 6, 7]" },
        { expr: "leaves (Node 9 [])", expected: "[9]" },
        { expr: "leaves (Node 1 [Node 2 [], Node 3 []])", expected: "[2, 3]" },
        { expr: "leaves (Node 1 [Node 2 [Node 3 []]])", expected: "[3]" },
      ],
      hint: "Two equations: `leaves (Node x []) = [x]` first, then `leaves (Node _ ts) = concatMap leaves ts`.",
      solution: hs`leaves :: Rose -> [Int]
leaves (Node x []) = [x]
leaves (Node _ ts) = concatMap leaves ts
`,
    },
    {
      k: "quiz",
      q: "What goes wrong if you write the two `leaves` equations the other way round?",
      options: [
        "Nothing",
        "`(Node _ ts)` matches every node first, so a childless node gives `concatMap leaves []`, which is `[]`: you'd always get `[]`",
        "It won't compile",
        "It loops forever",
      ],
      answer: 1,
      why: "Equations are tried top to bottom. A specific pattern must come before a general one that also matches it.",
    },
    {
      k: "read",
      body: md(
        "Exams dress rose trees up. 2016's XML has two constructors; `Text` can't have children, an `Element` has a name, attributes and a list of children:",
        "",
        "```",
        "data XML = Text String | Element Name Attributes [XML]",
        "",
        "x2 = Element \"a\" [(\"x\",\"1\")] [Element \"b\" [] [Text \"A\"], Element \"c\" [] [], Element \"b\" [] [Text \"B\"]]",
        "```",
        "",
        "2016's `getChildren :: String -> XML -> [XML]` (2 marks) returns the child elements with a given name. It isn't even recursive: it only looks at one level. A comprehension can filter the children, but there's a snag: we must check the child's name and keep the whole child.",
        "",
        "An as-pattern solves it. `c@(Element n _ _)` matches an Element, names its name `n`, and also names the whole value `c`:",
        "",
        "```",
        "getChildren name (Element _ _ cs) = [c | c@(Element n _ _) <- cs, n == name]",
        "getChildren _ (Text _)            = []",
        "```",
        "",
        "`Text` children don't fit the pattern `Element n _ _`, so they're skipped automatically.",
      ),
    },
    {
      k: "write",
      setup: xmlSetup,
      body: md(
        "Exam 2016, Part I (2 marks): write `getChildren`.",
        "",
        "```",
        "getChildren \"b\" x2   is  [Element \"b\" [] [Text \"A\"], Element \"b\" [] [Text \"B\"]]",
        "getChildren \"c\" x2   is  [Element \"c\" [] []]",
        "```",
      ),
      starter: hs`getChildren :: String -> XML -> [XML]
getChildren name x = undefined
`,
      tests: [
        { expr: `getChildren "b" x2`, expected: `[Element "b" [] [Text "A"], Element "b" [] [Text "B"]]` },
        { expr: `getChildren "c" x2`, expected: `[Element "c" [] []]` },
        { expr: `getChildren "d" x2`, expected: "[]" },
        { expr: `getChildren "b" (Text "b")`, expected: "[]" },
        { expr: `getChildren "t" (Element "r" [] [Text "t", Element "t" [] []])`, expected: `[Element "t" [] []]`, label: "Text children are never returned" },
      ],
      hint: "`getChildren name (Element _ _ cs) = [c | c@(Element n _ _) <- cs, n == name]`, plus an equation for `Text`.",
      solution: hs`getChildren :: String -> XML -> [XML]
getChildren name (Element _ _ cs) = [c | c@(Element n _ _) <- cs, n == name]
getChildren _ (Text _) = []
`,
    },
    {
      k: "write",
      setup: xmlSetup,
      body: md(
        "Write `allText`, which joins up every `Text` string inside an XML value, left to right, at any depth. (This is the heart of 2016's `getValue`, worth 2 marks.)",
        "",
        "```",
        "allText x2   is  \"AB\"",
        "```",
      ),
      starter: hs`allText :: XML -> String
allText x = undefined
`,
      tests: [
        { expr: "allText x2", expected: `"AB"` },
        { expr: `allText (Text "hi")`, expected: `"hi"` },
        { expr: `allText (Element "e" [] [])`, expected: `""` },
        { expr: `allText (Element "p" [] [Text "a", Element "q" [] [Text "b", Element "r" [] [Text "c"]], Text "d"])`, expected: `"abcd"` },
      ],
      hint: "`allText (Text s) = s` and `allText (Element _ _ cs) = concatMap allText cs`.",
      solution: hs`allText :: XML -> String
allText (Text s) = s
allText (Element _ _ cs) = concatMap allText cs
`,
    },
    {
      k: "quiz",
      q: "In `[c | c@(Element n _ _) <- cs, n == \"b\"]`, what is `c`?",
      options: ["The name of the element", "The whole child element that matched", "The list of children", "Its attributes"],
      answer: 1,
      why: "`c@pattern` reads \"c as pattern\": it matches the pattern and also names the entire value. So you can test a part (`n`) and keep the whole (`c`).",
    },
    {
      k: "read",
      body: md(
        "Sometimes the children are labelled. 2010's suffix trees put a String on every edge:",
        "",
        "```",
        "data SuffixTree = Leaf Int | Node [(String, SuffixTree)]",
        "```",
        "",
        "A `Node`'s field is a list of (label, subtree) pairs. To recurse, take the subtree out of each pair. A comprehension with a pattern does it neatly:",
        "",
        "```",
        "getIndices :: SuffixTree -> [Int]",
        "getIndices (Leaf i)  = [i]",
        "getIndices (Node es) = [i | (_, t) <- es, i <- getIndices t]",
        "```",
        "",
        "`concatMap (getIndices . snd) es` is the same thing: `snd` takes the subtree out of each pair. 2010's `getIndices` was worth 3 marks.",
      ),
    },
    {
      k: "write",
      setup: suffixSetup,
      body: md(
        "Exam 2010, Part II (3 marks): write `getIndices`, which returns all the numbers stored in the leaves. Order doesn't matter. `t1` is the suffix tree for \"banana\".",
      ),
      starter: hs`getIndices :: SuffixTree -> [Int]
getIndices t = undefined
`,
      tests: [
        { expr: `getIndices (Node [("", Leaf 4), ("", Leaf 1)])`, expected: "[1, 4]", unordered: true },
        { expr: "getIndices t1", expected: "[0, 1, 2, 3, 4, 5]", unordered: true },
        { expr: "getIndices (Leaf 7)", expected: "[7]" },
        { expr: "getIndices (Node [])", expected: "[]" },
      ],
      hint: "`getIndices (Leaf i) = [i]` and `getIndices (Node es) = [i | (_, t) <- es, i <- getIndices t]`.",
      solution: hs`getIndices :: SuffixTree -> [Int]
getIndices (Leaf i) = [i]
getIndices (Node es) = [i | (_, t) <- es, i <- getIndices t]
`,
    },
    {
      k: "quiz",
      q: "In `Node [(String, SuffixTree)]`, what does `map snd es` give?",
      options: ["The labels", "The subtrees", "The leaf numbers", "A type error"],
      answer: 1,
      why: "Each element of `es` is a (label, subtree) pair; `snd` takes the second part, the subtree.",
    },
    {
      k: "read",
      body: md(
        "2017's decision trees combine both ideas: three constructors, and labelled children.",
        "",
        "```",
        "data DecisionTree = Null | Leaf AttValue | Node AttName [(AttValue, DecisionTree)]",
        "",
        "fig = Node \"outlook\" [(\"sunny\",    Node \"temp\" [(\"hot\", Leaf \"bad\"), (\"mild\", Leaf \"good\")]),",
        "                      (\"overcast\", Leaf \"good\"),",
        "                      (\"rainy\",    Leaf \"bad\")]",
        "```",
        "",
        "A `Node` asks a question (\"what's the outlook?\"); each answer leads down one labelled branch; a `Leaf` is the final decision.",
        "",
        "Counting is the usual recipe, one equation per constructor. Evaluating follows just one branch: look the row's answer up in the list of branches. The list of branches is a lookup table!",
      ),
    },
    {
      k: "write",
      setup: decisionSetup,
      body: "Exam 2017, Part II (2 marks): write `nodes`, which counts all the `Node`s and `Leaf`s. `Null` counts as 0.",
      starter: hs`nodes :: DecisionTree -> Int
nodes t = undefined
`,
      tests: [
        { expr: "nodes fig", expected: "6" },
        { expr: "nodes Null", expected: "0" },
        { expr: `nodes (Leaf "good")`, expected: "1" },
        { expr: `nodes (Node "a" [("x", Null), ("y", Leaf "z")])`, expected: "2" },
      ],
      hint: "`nodes (Node _ bs) = 1 + sum [nodes t | (_, t) <- bs]`.",
      solution: hs`nodes :: DecisionTree -> Int
nodes Null = 0
nodes (Leaf _) = 1
nodes (Node _ bs) = 1 + sum [nodes t | (_, t) <- bs]
`,
    },
    {
      k: "write",
      setup:
        decisionSetup +
        hs`
lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x table = head [v | (k, v) <- table, k == x]
`,
      body: md(
        "Write `evalTree t row`, where (to keep it short) a row is a lookup table from attribute names to values. `Null` gives `\"\"`, a `Leaf` gives its value, and a `Node` asks for its attribute's value in the row, then continues down the branch with that label. `lookUp` is given.",
        "",
        "```",
        "evalTree fig [(\"outlook\",\"sunny\"), (\"temp\",\"mild\")]   is  \"good\"",
        "```",
      ),
      starter: hs`evalTree :: DecisionTree -> [(AttName, AttValue)] -> AttValue
evalTree t row = undefined
`,
      tests: [
        { expr: `evalTree fig [("outlook", "sunny"), ("temp", "mild")]`, expected: `"good"` },
        { expr: `evalTree fig [("outlook", "sunny"), ("temp", "hot")]`, expected: `"bad"` },
        { expr: `evalTree fig [("temp", "hot"), ("outlook", "overcast")]`, expected: `"good"` },
        { expr: "evalTree Null []", expected: `""` },
        { expr: `evalTree (Leaf "yes") []`, expected: `"yes"` },
      ],
      hint: "`evalTree (Node att bs) row = evalTree (lookUp (lookUp att row) bs) row`: first find this row's answer, then the branch for that answer.",
      solution: hs`evalTree :: DecisionTree -> [(AttName, AttValue)] -> AttValue
evalTree Null _ = ""
evalTree (Leaf v) _ = v
evalTree (Node att bs) row = evalTree (lookUp (lookUp att row) bs) row
`,
    },
    {
      k: "read",
      body: md(
        "Finally, two types that refer to each other. 2020's hash tries:",
        "",
        "```",
        "data Trie    = Leaf [Int] | Node BitVector [SubNode]",
        "data SubNode = Term Int | SubTrie Trie",
        "```",
        "",
        "A `Trie` contains `SubNode`s, and a `SubNode` can contain a `Trie`. So you write one function per type, and they call each other. This is mutual recursion. It's the same recipe, just spread over two functions, one equation per constructor in each.",
        "",
        "2018 and 2021 did the same with programs: a `Block` is a list of `Statement`s, and an `If` statement contains Blocks:",
        "",
        "```",
        "data Statement = Assign Id Exp | If Exp Block Block | While Exp Block",
        "type Block     = [Statement]",
        "",
        "countBlock :: Block -> Int",
        "countBlock b = sum (map countStmt b)",
        "",
        "countStmt :: Statement -> Int",
        "countStmt (Assign _ _)   = 1",
        "countStmt (If _ b1 b2)   = countBlock b1 + countBlock b2",
        "countStmt (While _ b)    = countBlock b",
        "```",
        "",
        "2018 asked for exactly this pair as `execStatement` and `execBlock` (7 marks).",
      ),
    },
    {
      k: "write",
      setup: hs`type BitVector = Int
data Trie = Leaf [Int] | Node BitVector [SubNode]
  deriving (Eq, Show)
data SubNode = Term Int | SubTrie Trie
  deriving (Eq, Show)

small :: Trie
small = Node 16960 [Term 1830, SubTrie (Node 8208 [Term 10, SubTrie (Leaf [4, 20]), Term 73]), Term 2]

empty :: Trie
empty = Node 0 []
`,
      body: md(
        "Exam 2020, Part II (4 marks): write `sumTrie f g t`. Every `Term v` contributes `f v`; every `Leaf vs` contributes `g vs`; add them all up. The bit vectors are ignored.",
        "",
        "```",
        "sumTrie (const 1) length small     is  6    -- number of values stored",
        "sumTrie (const 1) (const 1) small  is  5    -- number of bins",
        "```",
        "",
        "Use a helper for `SubNode` in a `where`; it calls `sumTrie` for a `SubTrie`.",
      ),
      starter: hs`sumTrie :: (Int -> Int) -> ([Int] -> Int) -> Trie -> Int
sumTrie f g t = undefined
`,
      tests: [
        { expr: "sumTrie (const 1) length small", expected: "6" },
        { expr: "sumTrie (const 1) (const 1) small", expected: "5" },
        { expr: "sumTrie id sum small", expected: "1939" },
        { expr: "sumTrie (const 1) length empty", expected: "0" },
        { expr: "sumTrie id sum (Leaf [1, 2, 3])", expected: "6" },
      ],
      hint: md(
        "```",
        "sumTrie f g (Leaf vs)     = g vs",
        "sumTrie f g (Node _ subs) = sum (map sumSub subs)",
        "  where",
        "    sumSub (Term v)    = f v",
        "    sumSub (SubTrie t) = sumTrie f g t",
        "```",
      ),
      solution: hs`sumTrie :: (Int -> Int) -> ([Int] -> Int) -> Trie -> Int
sumTrie _ g (Leaf vs) = g vs
sumTrie f g (Node _ subs) = sum (map sumSub subs)
  where
    sumSub (Term v) = f v
    sumSub (SubTrie t) = sumTrie f g t
`,
    },
    {
      k: "quiz",
      q: "With `type Block = [Statement]` and a `While Exp Block` statement, why do you need two functions rather than one?",
      options: [
        "You don't: one function is enough",
        "A Block is a list and a Statement is a data type: each needs its own equations, and each calls the other",
        "Because Haskell forbids recursion on lists",
        "To make it faster",
      ],
      answer: 1,
      why: "The Block function handles the list (usually with `map` or a fold); the Statement function has one equation per constructor and calls the Block function on any Blocks inside.",
    },
    {
      k: "write",
      setup: hs`type Id = String
data Exp = Const Int | Var Id | Apply String Exp Exp
  deriving (Eq, Show)
data Statement = Assign Id Exp | If Exp Block Block | While Exp Block
  deriving (Eq, Show)
type Block = [Statement]

fact :: Block
fact = [Assign "p" (Const 1), While (Var "n") [Assign "p" (Apply "*" (Var "p") (Var "n")), Assign "n" (Apply "-" (Var "n") (Const 1))], Assign "ret" (Var "p")]
`,
      body: md(
        "Write the mutually recursive pair `countBlock` and `countStmt`, counting the `Assign` statements anywhere in a program, however deeply nested.",
      ),
      starter: hs`countBlock :: Block -> Int
countBlock b = undefined

countStmt :: Statement -> Int
countStmt s = undefined
`,
      tests: [
        { expr: "countBlock fact", expected: "4" },
        { expr: "countBlock []", expected: "0" },
        { expr: `countStmt (Assign "x" (Const 1))`, expected: "1" },
        { expr: `countStmt (If (Var "c") [Assign "a" (Const 1)] [Assign "b" (Const 2), Assign "c" (Const 3)])`, expected: "3" },
        { expr: `countStmt (While (Var "c") [While (Var "d") [Assign "e" (Const 0)]])`, expected: "1", label: "nested loops" },
      ],
      hint: "`countBlock b = sum (map countStmt b)`; `countStmt` has three equations, calling `countBlock` on the blocks inside `If` and `While`.",
      solution: hs`countBlock :: Block -> Int
countBlock b = sum (map countStmt b)

countStmt :: Statement -> Int
countStmt (Assign _ _) = 1
countStmt (If _ b1 b2) = countBlock b1 + countBlock b2
countStmt (While _ b) = countBlock b
`,
    },
  ],
};

const drillRosetrees: DrillSet = {
  id: "drill-rosetrees",
  lesson: "rosetrees",
  title: "Rose tree drills",
  drills: [
    {
      k: "quiz",
      q: "With `data Rose = Node Int [Rose]`, what plays the role of a leaf?",
      options: ["`Leaf`", "A `Node` whose list of children is empty", "`Nothing`", "`[]`"],
      answer: 1,
      why: "There's only one constructor; a node with no children, like `Node 5 []`, is a leaf.",
    },
    { k: "predict", expr: "sum (map (+ 1) [])", answer: "0", why: "Mapping over no children gives `[]`, and `sum []` is 0. This is why rose tree functions often need no separate base case." },
    { k: "predict", expr: "maximum (0 : [2, 5])", answer: "5", why: "The 0 only matters when the list would otherwise be empty." },
    {
      k: "quiz",
      q: "If `size :: Rose -> Int` and `ts :: [Rose]`, what is the type of `map size ts`?",
      options: ["`Int`", "`[Int]`", "`[Rose]`", "`Rose -> Int`"],
      answer: 1,
      why: "`map` applies `size` to each child, giving one Int per child.",
    },
    { k: "predict", expr: "concat [[1], [], [2, 3]]", answer: "[1, 2, 3]", why: "`concat` joins the lists; empty ones disappear." },
    {
      k: "quiz",
      q: "Which is the same as `concatMap f xs`?",
      options: ["`map (concat f) xs`", "`concat (map f xs)`", "`map f (concat xs)`", "`concat f xs`"],
      answer: 1,
      why: "Map first (giving a list of lists), then join them.",
    },
    { k: "predict", expr: 'map snd [("a", 1), ("b", 2)]', answer: "[1, 2]", why: "`snd` takes the second part of each pair: for labelled children, that's the subtree." },
    {
      k: "quiz",
      q: "A `leaves` function has `leaves (Node x []) = [x]` as its first equation. Why does this pattern need to come first?",
      options: [
        "Haskell requires the shortest equation first",
        "The general `(Node _ ts)` also matches childless nodes, so it would catch them first",
        "It doesn't matter",
        "Empty lists can only be matched first",
      ],
      answer: 1,
      why: "Equations are tried top to bottom; the more specific pattern must come before the general one.",
    },
    { k: "predict", expr: "or (map even [1, 3, 4])", answer: "True", why: "\"Does any child satisfy...?\": `map` gives `[False, False, True]`, and `or` is True because one is True." },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `countEven`, the number of even numbers in a rose tree.",
      starter: hs`countEven :: Rose -> Int
countEven t = undefined
`,
      tests: [
        { expr: "countEven r1", expected: "3" },
        { expr: "countEven (Node 1 [])", expected: "0" },
        { expr: "countEven (Node 2 [])", expected: "1" },
        { expr: "countEven (Node 0 [Node 0 [Node 0 []], Node 1 []])", expected: "3" },
      ],
      hint: "`countEven (Node x ts) = (if even x then 1 else 0) + sum (map countEven ts)`.",
      solution: hs`countEven :: Rose -> Int
countEven (Node x ts) = (if even x then 1 else 0) + sum (map countEven ts)
`,
    },
    {
      k: "quiz",
      q: "2016's `getChild` must return the first matching child, or `Text \"\"` if there isn't one. Which is safe?",
      options: [
        "`head (getChildren n x)`",
        "`case getChildren n x of [] -> Text \"\"; (c : _) -> c`",
        "`last (getChildren n x)`",
        "`getChildren n x !! 0`",
      ],
      answer: 1,
      why: "`head`, `last` and `!! 0` all crash on an empty list. A `case` handles the empty case explicitly.",
    },
    {
      k: "predict",
      expr: '[x | (_, x) <- [("e", 1), ("f", 2)]]',
      answer: "[1, 2]",
      why: "The pattern ignores the label and keeps the second part.",
    },
    {
      k: "predict",
      expr: "length (concatMap (\\(_, xs) -> xs) [(\"a\", [1, 2]), (\"b\", []), (\"c\", [3])])",
      answer: "3",
      why: "Each pair contributes its list; joined they are `[1, 2, 3]`, which has length 3.",
    },
    {
      k: "predict",
      expr: "length (concatMap (\\(_, xs) -> xs) [(\"a\", [1, 2]), (\"b\", []), (\"c\", [3])])",
      answer: "3",
      why: "Each pair contributes its list; joined they are `[1, 2, 3]`, which has length 3.",
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `mapRose f t`, which applies `f` to every number in the tree, keeping its shape.",
      starter: hs`mapRose :: (Int -> Int) -> Rose -> Rose
mapRose f t = undefined
`,
      tests: [
        { expr: "mapRose (* 2) (Node 1 [Node 2 []])", expected: "Node 2 [Node 4 []]" },
        { expr: "mapRose negate (Node 5 [])", expected: "Node (-5) []" },
        { expr: "mapRose id r1", expected: "r1" },
        { expr: "mapRose (+ 1) (Node 0 [Node 0 [], Node 0 [Node 0 []]])", expected: "Node 1 [Node 1 [], Node 1 [Node 1 []]]" },
      ],
      hint: "`mapRose f (Node x ts) = Node (f x) (map (mapRose f) ts)`. Note `mapRose f` (partially applied) is the function you map over the children.",
      solution: hs`mapRose :: (Int -> Int) -> Rose -> Rose
mapRose f (Node x ts) = Node (f x) (map (mapRose f) ts)
`,
    },
    {
      k: "quiz",
      q: "`data Trie = Leaf [Int] | Node Int [SubNode]` and `data SubNode = Term Int | SubTrie Trie`. A function over Tries will need...",
      options: [
        "Just one equation",
        "Two equations for Trie, plus a helper with two equations for SubNode that calls back into the Trie function",
        "Four separate unrelated functions",
        "No recursion at all",
      ],
      answer: 1,
      why: "Each type gets one equation per constructor, and the two functions call each other (mutual recursion).",
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `maxRose`, the largest number anywhere in the tree. (A tree always has at least one number, so there's no empty case.)",
      starter: hs`maxRose :: Rose -> Int
maxRose t = undefined
`,
      tests: [
        { expr: "maxRose r1", expected: "7" },
        { expr: "maxRose (Node 3 [])", expected: "3" },
        { expr: "maxRose (Node 9 [Node 2 [], Node 5 []])", expected: "9" },
        { expr: "maxRose (Node (-5) [Node (-2) [Node (-9) []]])", expected: "-2" },
      ],
      hint: "`maxRose (Node x ts) = maximum (x : map maxRose ts)`: including `x` means the list is never empty.",
      solution: hs`maxRose :: Rose -> Int
maxRose (Node x ts) = maximum (x : map maxRose ts)
`,
    },
    {
      k: "quiz",
      q: "In `maxRose (Node x ts) = maximum (x : map maxRose ts)`, why is `maximum` safe here?",
      options: ["It isn't", "The list always contains at least `x`", "Haskell's `maximum` never crashes", "Because `ts` is never empty"],
      answer: 1,
      why: "Putting `x` on the front means the list has at least one element even when there are no children.",
    },
    {
      k: "write",
      setup: roseSetup,
      body: md(
        "Write `atDepth n t`: the numbers exactly `n` levels down, left to right. The root is at level 0.",
        "",
        "```",
        "atDepth 1 r1   is  [2, 3, 5]",
        "atDepth 2 r1   is  [4, 6, 7]",
        "```",
      ),
      starter: hs`atDepth :: Int -> Rose -> [Int]
atDepth n t = undefined
`,
      tests: [
        { expr: "atDepth 0 r1", expected: "[1]" },
        { expr: "atDepth 1 r1", expected: "[2, 3, 5]" },
        { expr: "atDepth 2 r1", expected: "[4, 6, 7]" },
        { expr: "atDepth 5 r1", expected: "[]" },
      ],
      hint: "`atDepth 0 (Node x _) = [x]`; otherwise go one level down with `n - 1`: `concatMap (atDepth (n - 1)) ts`.",
      solution: hs`atDepth :: Int -> Rose -> [Int]
atDepth 0 (Node x _) = [x]
atDepth n (Node _ ts) = concatMap (atDepth (n - 1)) ts
`,
    },
    {
      k: "quiz",
      q: "Inside `countStmt (If e b1 b2) = ...`, what is the type of `b1`?",
      options: ["`Statement`", "`Block` (a list of Statements)", "`Exp`", "`Int`"],
      answer: 1,
      why: "`If Exp Block Block`: the two branches are Blocks, so you call the Block function on them, not the Statement function.",
    },
    {
      k: "write",
      setup:
        xmlSetup +
        hs`
getChildren :: String -> XML -> [XML]
getChildren name (Element _ _ cs) = [c | c@(Element n _ _) <- cs, n == name]
getChildren _ (Text _) = []
`,
      body: md(
        "Exam 2016, Part I (2 marks): using the given `getChildren`, write `getChild name x`: the first child element with that name, or `Text \"\"` if there isn't one.",
        "",
        "```",
        "getChild \"b\" x2   is  Element \"b\" [] [Text \"A\"]",
        "getChild \"z\" x2   is  Text \"\"",
        "```",
      ),
      starter: hs`getChild :: String -> XML -> XML
getChild name x = undefined
`,
      tests: [
        { expr: `getChild "b" x2`, expected: `Element "b" [] [Text "A"]` },
        { expr: `getChild "c" x2`, expected: `Element "c" [] []` },
        { expr: `getChild "z" x2`, expected: `Text ""` },
        { expr: `getChild "b" (Text "b")`, expected: `Text ""` },
      ],
      hint: "`case getChildren name x of [] -> Text \"\"; (c : _) -> c`",
      solution: hs`getChild :: String -> XML -> XML
getChild name x
  = case getChildren name x of
      []      -> Text ""
      (c : _) -> c
`,
    },
    {
      k: "write",
      setup: hs`import Data.List (nub)

type Id = String
data Process = STOP | Ref Id | Prefix Id Process | Choice [Process]
  deriving (Eq, Ord, Show)

maker :: Process
maker = Prefix "make" (Prefix "ready" (Ref "MAKER"))

vendor :: Process
vendor = Choice [Prefix "red" (Prefix "coffee" (Ref "VENDOR")), Prefix "blue" (Prefix "tea" (Ref "VENDOR")), Prefix "off" STOP]
`,
      body: md(
        "Exam 2012, Part II (5 marks): processes are",
        "",
        "```",
        "data Process = STOP | Ref Id | Prefix Id Process | Choice [Process]",
        "```",
        "",
        "Write `actions p`: the action names in `p`, with no duplicates (any order). `STOP` and `Ref` have no actions; `Prefix a p` has action `a` plus those of `p`; a `Choice` has the actions of all its options. `nub` is imported.",
        "",
        "```",
        "actions maker   is  [\"make\", \"ready\"]",
        "```",
      ),
      starter: hs`actions :: Process -> [Id]
actions p = undefined
`,
      tests: [
        { expr: "actions maker", expected: `["make", "ready"]`, unordered: true },
        { expr: "actions vendor", expected: `["red", "coffee", "blue", "tea", "off"]`, unordered: true },
        { expr: "actions STOP", expected: "[]" },
        { expr: `actions (Choice [Prefix "a" STOP, Prefix "a" (Prefix "b" STOP)])`, expected: `["a", "b"]`, unordered: true, label: "no duplicates" },
        { expr: "actions (Choice [])", expected: "[]" },
      ],
      hint: "Collect with recursion, then `nub` at the top: `actions (Prefix a q) = nub (a : actions q)`, `actions (Choice ps) = nub (concatMap actions ps)`, and `[]` for the rest.",
      solution: hs`actions :: Process -> [Id]
actions STOP = []
actions (Ref _) = []
actions (Prefix a q) = nub (a : actions q)
actions (Choice ps) = nub (concatMap actions ps)
`,
    },
    {
      k: "write",
      setup: hs`type AttName = String
type AttValue = String
type Attribute = (AttName, [AttValue])
type Header = [Attribute]
type Row = [AttValue]
data DecisionTree = Null | Leaf AttValue | Node AttName [(AttValue, DecisionTree)]
  deriving (Eq, Show)

lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x table = head [v | (k, v) <- table, k == x]

lookUpAtt :: AttName -> Header -> Row -> AttValue
lookUpAtt name header row = lookUp name (zip (map fst header) row)

header :: Header
header = [("outlook", ["sunny", "overcast", "rainy"]), ("temp", ["hot", "mild", "cool"]), ("result", ["good", "bad"])]

fig :: DecisionTree
fig = Node "outlook" [("sunny", Node "temp" [("hot", Leaf "bad"), ("mild", Leaf "good"), ("cool", Leaf "good")]), ("overcast", Leaf "good"), ("rainy", Leaf "bad")]
`,
      body: md(
        "Exam 2017, Part II: write the real `evalTree t header row`, where a row is a list of values in header order. Use the given `lookUp` and `lookUpAtt`. `Null` gives `\"\"`.",
        "",
        "```",
        "evalTree fig header [\"sunny\", \"mild\", \"?\"]   is  \"good\"",
        "```",
      ),
      starter: hs`evalTree :: DecisionTree -> Header -> Row -> AttValue
evalTree t header row = undefined
`,
      tests: [
        { expr: `evalTree fig header ["sunny", "mild", "?"]`, expected: `"good"` },
        { expr: `evalTree fig header ["sunny", "hot", "?"]`, expected: `"bad"` },
        { expr: `evalTree fig header ["overcast", "cool", "?"]`, expected: `"good"` },
        { expr: `evalTree fig header ["rainy", "mild", "?"]`, expected: `"bad"` },
        { expr: `evalTree Null header ["sunny", "hot", "?"]`, expected: `""` },
      ],
      hint: "`evalTree (Node att bs) h r = evalTree (lookUp (lookUpAtt att h r) bs) h r`.",
      solution: hs`evalTree :: DecisionTree -> Header -> Row -> AttValue
evalTree Null _ _ = ""
evalTree (Leaf v) _ _ = v
evalTree (Node att bs) h r = evalTree (lookUp (lookUpAtt att h r) bs) h r
`,
    },
    {
      k: "write",
      setup: hs`type Id = String
data Op = Add | Mul | Eq | GEq
  deriving (Eq, Show)
data Exp = Const Int | Var Id | Apply Op Exp Exp
  deriving (Eq, Show)
data Statement = Assign Id Exp | If Exp Block Block | While Exp Block
  deriving (Eq, Show)
type Block = [Statement]
type IdMap = [(Id, Id)]

lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x table = head [v | (k, v) <- table, k == x]

renameExp :: Exp -> IdMap -> Exp
renameExp (Const n) _ = Const n
renameExp (Var v) m = Var (lookUp v m)
renameExp (Apply op a b) m = Apply op (renameExp a m) (renameExp b m)

m1 :: IdMap
m1 = [("n", "R1"), ("p", "R2"), ("i", "R3")]
`,
      body: md(
        "Modelled on 2021, Part III (`renameBlock`, without its clean-up step): rename every variable in a block, both the ones assigned to and the ones in expressions. `renameExp` is given. Write it as a mutually recursive pair, `renameBlock` and `renameStmt`.",
        "",
        "```",
        "renameBlock [Assign \"p\" (Var \"n\")] m1   is  [Assign \"R2\" (Var \"R1\")]",
        "```",
      ),
      starter: hs`renameBlock :: Block -> IdMap -> Block
renameBlock b m = undefined

renameStmt :: Statement -> IdMap -> Statement
renameStmt s m = undefined
`,
      tests: [
        { expr: `renameBlock [Assign "p" (Var "n")] m1`, expected: `[Assign "R2" (Var "R1")]` },
        { expr: "renameBlock [] m1", expected: "[]" },
        {
          expr: `renameStmt (While (Var "i") [Assign "p" (Apply Mul (Var "p") (Var "i"))]) m1`,
          expected: `While (Var "R3") [Assign "R2" (Apply Mul (Var "R2") (Var "R3"))]`,
        },
        {
          expr: `renameStmt (If (Apply GEq (Var "n") (Const 0)) [Assign "p" (Const 1)] [If (Var "i") [] [Assign "n" (Var "i")]]) m1`,
          expected: `If (Apply GEq (Var "R1") (Const 0)) [Assign "R2" (Const 1)] [If (Var "R3") [] [Assign "R1" (Var "R3")]]`,
          label: "nested If inside an If",
        },
      ],
      hint: "`renameBlock b m = map (\\s -> renameStmt s m) b`; `renameStmt (If e b1 b2) m = If (renameExp e m) (renameBlock b1 m) (renameBlock b2 m)`, and similarly for `Assign` and `While`.",
      solution: hs`renameBlock :: Block -> IdMap -> Block
renameBlock b m = [renameStmt s m | s <- b]

renameStmt :: Statement -> IdMap -> Statement
renameStmt (Assign v e) m = Assign (lookUp v m) (renameExp e m)
renameStmt (If e b1 b2) m = If (renameExp e m) (renameBlock b1 m) (renameBlock b2 m)
renameStmt (While e b) m = While (renameExp e m) (renameBlock b m)
`,
    },
    {
      k: "write",
      setup: suffixSetup + hs`
isPrefix :: String -> String -> Bool
isPrefix pre s = take (length pre) s == pre

removePrefix :: String -> String -> String
removePrefix pre s = drop (length pre) s

getIndices :: SuffixTree -> [Int]
getIndices (Leaf i) = [i]
getIndices (Node es) = [i | (_, t) <- es, i <- getIndices t]
`,
      body: md(
        "Exam 2010, Part II: search a suffix tree for every index where `s` occurs. At a `Node`, look at each (label `a`, subtree) pair:",
        "",
        "1. If `s` is a prefix of `a`: every leaf below matches, so give `getIndices` of the subtree.",
        "2. Else if `a` is a prefix of `s`: carry on into the subtree with `removePrefix a s`.",
        "3. Otherwise: no matches down there, `[]`.",
        "",
        "At a `Leaf i`: if the remaining `s` is empty, give `[i]`, else `[]`. Collect the answers from all the pairs. `isPrefix`, `removePrefix` and `getIndices` are given; `t1` is the tree for \"banana\".",
        "",
        "```",
        "findSubstrings' \"an\" t1   is  [1, 3]   -- in any order",
        "```",
      ),
      starter: hs`findSubstrings' :: String -> SuffixTree -> [Int]
findSubstrings' s t = undefined
`,
      tests: [
        { expr: `findSubstrings' "an" t1`, expected: "[1, 3]", unordered: true },
        { expr: `findSubstrings' "a" t1`, expected: "[1, 3, 5]", unordered: true },
        { expr: `findSubstrings' "nana" t1`, expected: "[2]" },
        { expr: `findSubstrings' "banana" t1`, expected: "[0]" },
        { expr: `findSubstrings' "nab" t1`, expected: "[]" },
        { expr: `findSubstrings' "x" t1`, expected: "[]" },
      ],
      hint: md(
        "```",
        "findSubstrings' s (Leaf i) = if null s then [i] else []",
        "findSubstrings' s (Node es) = concatMap search es",
        "  where",
        "    search (a, t)",
        "      | isPrefix s a = getIndices t",
        "      | isPrefix a s = findSubstrings' (removePrefix a s) t",
        "      | otherwise    = []",
        "```",
      ),
      solution: hs`findSubstrings' :: String -> SuffixTree -> [Int]
findSubstrings' s (Leaf i)
  | null s    = [i]
  | otherwise = []
findSubstrings' s (Node es) = concatMap search es
  where
    search (a, t)
      | isPrefix s a = getIndices t
      | isPrefix a s = findSubstrings' (removePrefix a s) t
      | otherwise    = []
`,
    },
  ],
};

// ---- exports ----

export const lessons: Lesson[] = [local, comprehensions, tables, datatypes, treerec, rosetrees];
export const drills: DrillSet[] = [drillLocal, drillComprehensions, drillTables, drillDatatypes, drillTreerec, drillRosetrees];
