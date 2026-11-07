import { type Book, type DrillSet, hs, md } from "../schema.ts";

const fromMaybeImp = hs`import Data.Maybe (fromMaybe)
`;

const hopsSetup = hs`hops :: [(String, String)]
hops = [("amy", "ben"), ("ben", "cal"), ("cal", "dot"), ("dot", "ed"), ("x", "y")]
`;

const scoresSetup = hs`scores :: [(String, Int)]
scores = [("sam", 12), ("rio", 7), ("kim", 12), ("lee", 0)]
`;

const seatingSetup = hs`type Guest = String
type Seat = Int
type Plan = [(Guest, Seat)]

plan :: Plan
plan = [("Ada", 12), ("Ben", 7), ("Cara", 12), ("Dan", 3)]
`;

const roomsSetup = hs`type Room = String
type Object = String
type Desc = String
type Rooms = [(Room, [(Object, Desc)])]

rooms :: Rooms
rooms = [ ("kitchen", [("cup", "blue mug"), ("tap", "drips")])
        , ("hall",    [("mat", "red")])
        , ("*",       [("lamp", "on"), ("cup", "plain cup")])
        ]
`;

const exprSetup = hs`data Expr = Lit Int | Var String | Plus Expr Expr | Quot Expr Expr
  deriving (Eq, Show)
`;

const entrySetup = hs`data Entry = File String | Folder String [Entry]
  deriving (Eq, Show)

root :: Entry
root =
  Folder "root"
    [ File "README"
    , Folder "src"
        [ File "Main.hs"
        , Folder "Lib" [File "Util.hs"]
        ]
    , Folder "empty" []
    ]
`;

const termSetup = hs`data Term = N Int | Add Term Term | Neg Term
  deriving (Eq, Show)
`;

const cmdSetup = hs`data Cmd = Set String Int | AddTo String Int | Copy String String
  deriving (Eq, Show)
`;

// ---------------------------------------------------------------------------
// Level 1: Warm-up
// ---------------------------------------------------------------------------

const level1: DrillSet = {
  id: "b-maybe-l1",
  lesson: "",
  level: 1,
  title: "Level 1: Warm-up",
  intro: md(
    "A `Maybe` is an answer or nothing. `Just 5` means the answer is 5. `Nothing` means there isn't one. You always handle both shapes: two equations, or a `case` with two branches.",
    "",
    "```",
    "withZero :: Maybe Int -> Int",
    "withZero Nothing  = 0",
    "withZero (Just n) = n",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: "What does `Nothing` mean?",
      options: [
        "The answer is 0",
        "There is no answer",
        "The program crashed",
        "The answer is an empty list",
      ],
      answer: 1,
      why: "`Nothing` is the 'no answer' case of a Maybe. It is a normal value, not a crash. 0 and `[]` are answers; they just happen to be zero and empty.",
    },
    {
      k: "quiz",
      q: "What is the type of `Just True`?",
      options: ["`Just Bool`", "`Maybe Bool`", "`Bool`", "`Just True`"],
      answer: 1,
      why: "`Just` wraps a value. The type of the wrapped value is `Maybe` of that type, so `Just True` has type `Maybe Bool`. `Just` is a value-maker, not a type.",
    },
    {
      k: "predict",
      expr: "maybe 0 (+ 1) (lookup 1 [(1, 8)])",
      answer: "9",
      why: "`lookup` finds `Just 8`. `maybe` applies `(+ 1)` to 8. If the lookup had failed, the answer would be 0.",
    },
    {
      k: "predict",
      expr: "maybe 0 (+ 1) (lookup 2 [(1, 8 :: Int)])",
      answer: "0",
      why: "Key 2 is missing, so `lookup` gives `Nothing` and `maybe` uses the default 0.",
    },
    {
      k: "predict",
      expr: "fromMaybe \"z\" (Just \"ok\")",
      answer: "\"ok\"",
      why: "`fromMaybe` unwraps a `Just`. The default `\"z\"` is only used when the Maybe is `Nothing`.",
    },
    {
      k: "predict",
      expr: "fromMaybe 99 (Nothing :: Maybe Int)",
      answer: "99",
      why: "There is no value inside `Nothing`, so `fromMaybe` gives the default 99.",
    },
    {
      k: "quiz",
      q: "`lookup k table` does not find the key. What happens?",
      options: [
        "It crashes",
        "It gives 0",
        "It gives `Nothing`",
        "It gives `Just 0`",
      ],
      answer: 2,
      why: "`lookup` returns a Maybe. Missing is a normal outcome: `Nothing`. It does not crash, and it does not invent 0.",
    },
    {
      k: "predict",
      expr: "lookup \"tea\" [(\"tea\", 2), (\"milk\", 1)]",
      answer: "Just 2",
      why: "The key `\"tea\"` is in the table, so `lookup` wraps the matching value in `Just`.",
    },
    {
      k: "predict",
      expr: "lookup \"x\" [(\"a\", 1 :: Int)]",
      answer: "Nothing",
      why: "`\"x\"` is not a key in the table, so the answer is `Nothing`.",
    },
    {
      k: "predict",
      expr: "maybe 0 (* 10) (Just 4)",
      answer: "40",
      why: "`maybe` applies the function to the value inside a `Just`. `(* 10)` turns 4 into 40. The 0 is only for `Nothing`.",
    },
    {
      k: "predict",
      expr: "maybe 0 (* 10) (Nothing :: Maybe Int)",
      answer: "0",
      why: "There is nothing to apply `(* 10)` to, so `maybe` gives the default 0.",
    },
    {
      k: "quiz",
      q: "A function's type says it returns `Maybe Int`. You have the number 5. What must you return?",
      options: ["`5`", "`Just 5`", "`Maybe 5`", "`[5]`"],
      answer: 1,
      why: "The type is `Maybe Int`, so the answer is wrapped: `Just 5`. A plain `5` is an `Int`, which does not match. `Maybe 5` is not valid Haskell.",
    },
    {
      k: "write",
      body: "Write `withZero`: the number inside a `Maybe Int`, or `0` if it is `Nothing`.",
      starter: hs`withZero :: Maybe Int -> Int
withZero m = undefined
`,
      tests: [
        { expr: "withZero (Just 5)", expected: "5" },
        { expr: "withZero Nothing", expected: "0", label: "Nothing becomes 0" },
        { expr: "withZero (Just 0)", expected: "0" },
        { expr: "withZero (Just (-3))", expected: "-3" },
      ],
      hint: "Two equations: `withZero Nothing = 0` and `withZero (Just n) = n`.",
      solution: hs`withZero :: Maybe Int -> Int
withZero Nothing = 0
withZero (Just n) = n
`,
      banned: ["fromMaybe", "maybe"],
    },
    {
      k: "write",
      body: "Write `boxLabel`: `\"got\"` if the Maybe is a `Just`, `\"none\"` if it is `Nothing`. Ignore the value inside.",
      starter: hs`boxLabel :: Maybe a -> String
boxLabel m = undefined
`,
      tests: [
        { expr: "boxLabel (Just 3)", expected: "\"got\"" },
        { expr: "boxLabel (Nothing :: Maybe Int)", expected: "\"none\"", label: "Nothing is none" },
        { expr: "boxLabel (Just \"hi\")", expected: "\"got\"" },
        { expr: "boxLabel (Nothing :: Maybe Char)", expected: "\"none\"" },
      ],
      hint: "`boxLabel (Just _) = \"got\"` and `boxLabel Nothing = \"none\"`.",
      solution: hs`boxLabel :: Maybe a -> String
boxLabel (Just _) = "got"
boxLabel Nothing = "none"
`,
    },
    {
      k: "write",
      body: "Write `firstOne`: `Just` the first element of a list, or `Nothing` if the list is empty. Do not use `head`.",
      starter: hs`firstOne :: [a] -> Maybe a
firstOne xs = undefined
`,
      tests: [
        { expr: "firstOne [4, 5, 6]", expected: "Just 4" },
        { expr: "firstOne ([] :: [Int])", expected: "Nothing", label: "empty list" },
        { expr: "firstOne \"hello\"", expected: "Just 'h'" },
        { expr: "firstOne [True]", expected: "Just True" },
      ],
      hint: "`firstOne [] = Nothing`. For `(x : _)` the answer is `Just x`.",
      solution: hs`firstOne :: [a] -> Maybe a
firstOne [] = Nothing
firstOne (x : _) = Just x
`,
      banned: ["head"],
    },
    {
      k: "write",
      body: "Write `afterOne`: `Just` the list without its first element, or `Nothing` if the list is empty. Do not use `tail`.",
      starter: hs`afterOne :: [a] -> Maybe [a]
afterOne xs = undefined
`,
      tests: [
        { expr: "afterOne [1, 2, 3 :: Int]", expected: "Just [2, 3]" },
        { expr: "afterOne ([] :: [Int])", expected: "Nothing", label: "empty list" },
        { expr: "afterOne [7 :: Int]", expected: "Just []" },
        { expr: "afterOne \"ab\"", expected: "Just \"b\"" },
      ],
      hint: "`afterOne [] = Nothing`. For `(_ : xs)` the answer is `Just xs`.",
      solution: hs`afterOne :: [a] -> Maybe [a]
afterOne [] = Nothing
afterOne (_ : xs) = Just xs
`,
      banned: ["tail"],
    },
    {
      k: "write",
      body: "Write `pointsOf player table`. Look the player up. If they are missing, they have 0 points.",
      setup: fromMaybeImp,
      starter: hs`pointsOf :: String -> [(String, Int)] -> Int
pointsOf player table = undefined
`,
      tests: [
        { expr: "pointsOf \"sam\" [(\"sam\", 12), (\"rio\", 7)]", expected: "12" },
        { expr: "pointsOf \"zed\" [(\"sam\", 12)]", expected: "0", label: "missing player" },
        { expr: "pointsOf \"sam\" []", expected: "0" },
        { expr: "pointsOf \"rio\" [(\"rio\", 0)]", expected: "0" },
      ],
      hint: "`fromMaybe 0 (lookup player table)`.",
      solution: hs`pointsOf :: String -> [(String, Int)] -> Int
pointsOf player table = fromMaybe 0 (lookup player table)
`,
    },
    {
      k: "write",
      body: "Write `evenBox n`: `Just n` if `n` is even, `Nothing` if it is odd.",
      starter: hs`evenBox :: Int -> Maybe Int
evenBox n = undefined
`,
      tests: [
        { expr: "evenBox 4", expected: "Just 4" },
        { expr: "evenBox 7", expected: "Nothing", label: "odd is Nothing" },
        { expr: "evenBox 0", expected: "Just 0" },
        { expr: "evenBox (-2)", expected: "Just (-2)" },
      ],
      hint: "Use a guard: `even n` gives `Just n`, otherwise `Nothing`.",
      solution: hs`evenBox :: Int -> Maybe Int
evenBox n
  | even n    = Just n
  | otherwise = Nothing
`,
    },
    {
      k: "write",
      body: "Write `isFilled`, which is `True` when the Maybe is a `Just`.",
      starter: hs`isFilled :: Maybe a -> Bool
isFilled m = undefined
`,
      tests: [
        { expr: "isFilled (Just 1)", expected: "True" },
        { expr: "isFilled (Nothing :: Maybe Int)", expected: "False", label: "Nothing is not filled" },
        { expr: "isFilled (Just 'a')", expected: "True" },
        { expr: "isFilled (Just False)", expected: "True" },
      ],
      hint: "`isFilled (Just _) = True` and `isFilled Nothing = False`.",
      solution: hs`isFilled :: Maybe a -> Bool
isFilled (Just _) = True
isFilled Nothing = False
`,
      banned: ["isJust"],
    },
    {
      k: "write",
      body: "Write `isBlank`, which is `True` when the Maybe is `Nothing`.",
      starter: hs`isBlank :: Maybe a -> Bool
isBlank m = undefined
`,
      tests: [
        { expr: "isBlank (Nothing :: Maybe Int)", expected: "True" },
        { expr: "isBlank (Just 1)", expected: "False", label: "Just is not blank" },
        { expr: "isBlank (Nothing :: Maybe Char)", expected: "True" },
        { expr: "isBlank (Just \"\")", expected: "False" },
      ],
      hint: "The opposite of `isFilled`: only `Nothing` is blank.",
      solution: hs`isBlank :: Maybe a -> Bool
isBlank Nothing = True
isBlank (Just _) = False
`,
      banned: ["isNothing"],
    },
    {
      k: "write",
      body: "Write `bump`: add 1 to the number inside, or give 0 when the Maybe is `Nothing`. Use `maybe`.",
      starter: hs`bump :: Maybe Int -> Int
bump m = undefined
`,
      tests: [
        { expr: "bump (Just 8)", expected: "9" },
        { expr: "bump Nothing", expected: "0", label: "Nothing becomes 0" },
        { expr: "bump (Just 0)", expected: "1" },
        { expr: "bump (Just (-1))", expected: "0" },
      ],
      hint: "`maybe 0 (+ 1) m`.",
      solution: hs`bump :: Maybe Int -> Int
bump m = maybe 0 (+ 1) m
`,
    },
    {
      k: "write",
      body: "Write `stripNones`: keep only the values from the `Just`s, in order. Drop every `Nothing`.",
      starter: hs`stripNones :: [Maybe a] -> [a]
stripNones ms = undefined
`,
      tests: [
        { expr: "stripNones [Just 1, Nothing, Just 3]", expected: "[1, 3]" },
        { expr: "stripNones ([] :: [Maybe Int])", expected: "[]" },
        { expr: "stripNones [Nothing, Nothing :: Maybe Int]", expected: "[]", label: "all Nothing" },
        { expr: "stripNones [Just 'h', Just 'i']", expected: "\"hi\"" },
      ],
      hint: "`stripNones [] = []`. For `(Nothing : ms)` skip it. For `(Just x : ms)` put `x` on the front.",
      solution: hs`stripNones :: [Maybe a] -> [a]
stripNones [] = []
stripNones (Nothing : ms) = stripNones ms
stripNones (Just x : ms) = x : stripNones ms
`,
      banned: ["catMaybes", "mapMaybe"],
    },
    {
      k: "write",
      body: "Write `nickOr name table`: the nickname from the table, or the original `name` if there isn't one.",
      setup: fromMaybeImp,
      starter: hs`nickOr :: String -> [(String, String)] -> String
nickOr name table = undefined
`,
      tests: [
        { expr: "nickOr \"william\" [(\"william\", \"will\")]", expected: "\"will\"" },
        { expr: "nickOr \"ada\" [(\"william\", \"will\")]", expected: "\"ada\"", label: "missing keeps the name" },
        { expr: "nickOr \"ada\" []", expected: "\"ada\"" },
        { expr: "nickOr \"kim\" [(\"kim\", \"kim\")]", expected: "\"kim\"" },
      ],
      hint: "`fromMaybe name (lookup name table)`.",
      solution: hs`nickOr :: String -> [(String, String)] -> String
nickOr name table = fromMaybe name (lookup name table)
`,
    },
    {
      k: "write",
      body: "Write `posBox n`: `Just n` if `n` is greater than 0, otherwise `Nothing`.",
      starter: hs`posBox :: Int -> Maybe Int
posBox n = undefined
`,
      tests: [
        { expr: "posBox 3", expected: "Just 3" },
        { expr: "posBox 0", expected: "Nothing", label: "zero is not positive" },
        { expr: "posBox (-4)", expected: "Nothing" },
        { expr: "posBox 1", expected: "Just 1" },
      ],
      hint: "Guard on `n > 0`.",
      solution: hs`posBox :: Int -> Maybe Int
posBox n
  | n > 0     = Just n
  | otherwise = Nothing
`,
    },
    {
      k: "write",
      body: "Write `openChar`: `Just` the first character of a string, or `Nothing` if the string is empty.",
      starter: hs`openChar :: String -> Maybe Char
openChar s = undefined
`,
      tests: [
        { expr: "openChar \"cat\"", expected: "Just 'c'" },
        { expr: "openChar \"\"", expected: "Nothing", label: "empty string" },
        { expr: "openChar \"x\"", expected: "Just 'x'" },
        { expr: "openChar \" A\"", expected: "Just ' '" },
      ],
      hint: "A String is a list of Char, so this is the same idea as `firstOne`.",
      solution: hs`openChar :: String -> Maybe Char
openChar [] = Nothing
openChar (c : _) = Just c
`,
      banned: ["head"],
    },
    {
      k: "write",
      body: "Write `lastOne`: `Just` the last element of a list, or `Nothing` if the list is empty. Do not use `last`.",
      starter: hs`lastOne :: [a] -> Maybe a
lastOne xs = undefined
`,
      tests: [
        { expr: "lastOne [1, 2, 9 :: Int]", expected: "Just 9" },
        { expr: "lastOne ([] :: [Int])", expected: "Nothing", label: "empty list" },
        { expr: "lastOne \"z\"", expected: "Just 'z'" },
        { expr: "lastOne [True, False]", expected: "Just False" },
      ],
      hint: "`lastOne [] = Nothing`, `lastOne [x] = Just x`, and `lastOne (_ : xs) = lastOne xs`.",
      solution: hs`lastOne :: [a] -> Maybe a
lastOne [] = Nothing
lastOne [x] = Just x
lastOne (_ : xs) = lastOne xs
`,
      banned: ["last"],
    },
    {
      k: "write",
      body: "Write `bothFilled`: `True` only when both Maybes are `Just` (the values inside do not matter).",
      starter: hs`bothFilled :: Maybe a -> Maybe b -> Bool
bothFilled m n = undefined
`,
      tests: [
        { expr: "bothFilled (Just 1) (Just 'a')", expected: "True" },
        { expr: "bothFilled Nothing (Just 2 :: Maybe Int)", expected: "False", label: "left Nothing" },
        { expr: "bothFilled (Just 1) (Nothing :: Maybe Int)", expected: "False" },
        { expr: "bothFilled (Nothing :: Maybe Int) (Nothing :: Maybe Char)", expected: "False" },
      ],
      hint: "`bothFilled (Just _) (Just _) = True`, and a catch-all `_ _ = False`.",
      solution: hs`bothFilled :: Maybe a -> Maybe b -> Bool
bothFilled (Just _) (Just _) = True
bothFilled _ _ = False
`,
    },
    {
      k: "write",
      body: "Write `dropEmpty`: if the Maybe holds an empty string, turn it into `Nothing`. Any other `Just` stays. `Nothing` stays `Nothing`.",
      starter: hs`dropEmpty :: Maybe String -> Maybe String
dropEmpty m = undefined
`,
      tests: [
        { expr: "dropEmpty (Just \"hi\")", expected: "Just \"hi\"" },
        { expr: "dropEmpty (Just \"\")", expected: "Nothing", label: "empty string becomes Nothing" },
        { expr: "dropEmpty Nothing", expected: "Nothing" },
        { expr: "dropEmpty (Just \" \")", expected: "Just \" \"" },
      ],
      hint: "Match `Just \"\"` separately from `Just s` and `Nothing`.",
      solution: hs`dropEmpty :: Maybe String -> Maybe String
dropEmpty (Just "") = Nothing
dropEmpty m = m
`,
    },
    {
      k: "write",
      body: "Write `timesN k m`: multiply the number inside `m` by `k`, or give 0 if `m` is `Nothing`. Use `maybe`.",
      starter: hs`timesN :: Int -> Maybe Int -> Int
timesN k m = undefined
`,
      tests: [
        { expr: "timesN 3 (Just 4)", expected: "12" },
        { expr: "timesN 3 Nothing", expected: "0", label: "Nothing becomes 0" },
        { expr: "timesN 0 (Just 9)", expected: "0" },
        { expr: "timesN 5 (Just (-2))", expected: "-10" },
      ],
      hint: "`maybe 0 (* k) m`.",
      solution: hs`timesN :: Int -> Maybe Int -> Int
timesN k m = maybe 0 (* k) m
`,
    },
    {
      k: "write",
      body: "Write `asList`: a `Just` becomes a one-element list; `Nothing` becomes `[]`.",
      starter: hs`asList :: Maybe a -> [a]
asList m = undefined
`,
      tests: [
        { expr: "asList (Just 4)", expected: "[4]" },
        { expr: "asList (Nothing :: Maybe Int)", expected: "[]", label: "Nothing is []" },
        { expr: "asList (Just 'q')", expected: "\"q\"" },
        { expr: "asList (Just [1 :: Int])", expected: "[[1]]" },
      ],
      hint: "`asList Nothing = []` and `asList (Just x) = [x]`.",
      solution: hs`asList :: Maybe a -> [a]
asList Nothing = []
asList (Just x) = [x]
`,
      banned: ["maybeToList"],
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 2: Standard
// ---------------------------------------------------------------------------

const level2: DrillSet = {
  id: "b-maybe-l2",
  lesson: "",
  level: 2,
  title: "Level 2: Standard",
  intro: md(
    "Now you build Maybes and take them apart. `lookup` already returns `Maybe`. Two lookups in a row need a `case`: if the first is `Nothing`, stop; if it is `Just y`, use `y` in the next step.",
    "",
    "```",
    "twoHops x table =",
    "  case lookup x table of",
    "    Nothing -> Nothing",
    "    Just y  -> lookup y table",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: "`map f xs` always keeps one result per element. Which function maps and also drops the failures?",
      options: ["`filter`", "`mapMaybe`", "`fromMaybe`", "`lookup`"],
      answer: 1,
      why: "`mapMaybe f xs` applies `f`, keeps each `Just` value, and throws away `Nothing`. `map` would give you a list of Maybes instead.",
    },
    {
      k: "predict",
      expr: "mapMaybe (\\n -> if n > 0 then Just (n * n) else Nothing) [(-2), 0, 3, 4]",
      answer: "[9, 16]",
      why: "Negative and zero give `Nothing` and are dropped. 3 and 4 become 9 and 16.",
    },
    {
      k: "predict",
      expr: "catMaybes [Nothing, Just 8, Nothing, Just 1]",
      answer: "[8, 1]",
      why: "`catMaybes` unwraps the `Just`s and skips `Nothing`, keeping order.",
    },
    {
      k: "quiz",
      q: md(
        "This function follows a table twice:",
        "",
        "```",
        "twoHops x t =",
        "  case lookup x t of",
        "    Nothing -> Nothing",
        "    Just y  -> lookup y t",
        "```",
        "",
        "The first `lookup` gives `Nothing`. What is the overall result?",
      ),
      options: [
        "`lookup` is still run on a default key",
        "`Nothing`, and the second `lookup` never runs",
        "It crashes",
        "`Just` of the original `x`",
      ],
      answer: 1,
      why: "The `Nothing` branch returns immediately. That is how failure is passed on: you do not invent a next key.",
    },
    {
      k: "predict",
      expr: "maybe Nothing (\\y -> lookup y [(\"amy\", \"ben\"), (\"ben\", \"cal\")]) (lookup \"amy\" [(\"amy\", \"ben\"), (\"ben\", \"cal\")])",
      answer: "Just \"cal\"",
      why: "First hop: `amy` to `ben`. Then `ben` is looked up and gives `cal`. Both steps succeed.",
    },
    {
      k: "predict",
      expr: "maybe Nothing (\\y -> lookup y [(\"amy\", \"ben\")]) (lookup \"zed\" [(\"amy\", \"ben\")])",
      answer: "Nothing",
      why: "`zed` is not in the table, so the first lookup is `Nothing` and the second step never runs.",
    },
    {
      k: "quiz",
      q: "Why is `firstOne []` safer than `head []`?",
      options: [
        "They do the same thing",
        "`firstOne` gives `Nothing` instead of crashing",
        "`head` is slower",
        "`firstOne` gives `[]`",
      ],
      answer: 1,
      why: "`head []` is an error. A Maybe return type can say 'no first element' without blowing up.",
    },
    {
      k: "predict",
      expr: "maybe \"none\" reverse (Just \"ab\")",
      answer: "\"ba\"",
      why: "There is a string inside, so `reverse` is applied: `\"ab\"` becomes `\"ba\"`.",
    },
    {
      k: "write",
      body: "Write `itemAt i xs`: the element at position `i`, counting from 1. Out of range (too small, too big, or an empty list) is `Nothing`. Do not use `!!`.",
      starter: hs`itemAt :: Int -> [a] -> Maybe a
itemAt i xs = undefined
`,
      tests: [
        { expr: "itemAt 1 \"cat\"", expected: "Just 'c'" },
        { expr: "itemAt 3 \"cat\"", expected: "Just 't'" },
        { expr: "itemAt 4 \"cat\"", expected: "Nothing", label: "past the end" },
        { expr: "itemAt 0 \"cat\"", expected: "Nothing", label: "positions start at 1" },
        { expr: "itemAt 1 ([] :: [Int])", expected: "Nothing" },
      ],
      hint: "`itemAt _ [] = Nothing`. For `(x : xs)`: if `i == 1` give `Just x`; if `i < 1` give `Nothing`; otherwise go on with `i - 1`.",
      solution: hs`itemAt :: Int -> [a] -> Maybe a
itemAt _ [] = Nothing
itemAt i (x : xs)
  | i < 1     = Nothing
  | i == 1    = Just x
  | otherwise = itemAt (i - 1) xs
`,
      banned: ["!!", "drop"],
    },
    {
      k: "write",
      body: "Write `shareOut a b`: integer division `div a b`, or `Nothing` when `b` is 0.",
      starter: hs`shareOut :: Int -> Int -> Maybe Int
shareOut a b = undefined
`,
      tests: [
        { expr: "shareOut 7 2", expected: "Just 3" },
        { expr: "shareOut 7 0", expected: "Nothing", label: "divide by zero" },
        { expr: "shareOut 0 5", expected: "Just 0" },
        { expr: "shareOut (-8) 2", expected: "Just (-4)" },
      ],
      hint: "Guard on `b == 0`. Use `div a b`, not backticks.",
      solution: hs`shareOut :: Int -> Int -> Maybe Int
shareOut a b
  | b == 0    = Nothing
  | otherwise = Just (div a b)
`,
    },
    {
      k: "write",
      body: "Write `firstEven`: `Just` the first even number in a list, or `Nothing` if there isn't one.",
      starter: hs`firstEven :: [Int] -> Maybe Int
firstEven xs = undefined
`,
      tests: [
        { expr: "firstEven [1, 3, 8, 4]", expected: "Just 8" },
        { expr: "firstEven [1, 3, 5]", expected: "Nothing", label: "no even" },
        { expr: "firstEven []", expected: "Nothing" },
        { expr: "firstEven [0, 2]", expected: "Just 0" },
      ],
      hint: "Empty: `Nothing`. If `even x`, `Just x`. Otherwise keep looking in `xs`.",
      solution: hs`firstEven :: [Int] -> Maybe Int
firstEven [] = Nothing
firstEven (x : xs)
  | even x    = Just x
  | otherwise = firstEven xs
`,
    },
    {
      k: "write",
      body: "Write `scoresOf names table`: look up each name. Keep the scores that were found; skip missing names. Use `mapMaybe`.",
      setup: hs`import Data.Maybe (mapMaybe)
` + scoresSetup,
      starter: hs`scoresOf :: [String] -> [(String, Int)] -> [Int]
scoresOf names table = undefined
`,
      tests: [
        { expr: "scoresOf [\"sam\", \"lee\"] scores", expected: "[12, 0]" },
        { expr: "scoresOf [\"zed\", \"rio\"] scores", expected: "[7]", label: "missing name dropped" },
        { expr: "scoresOf [\"zed\"] scores", expected: "[]" },
        { expr: "scoresOf [] scores", expected: "[]" },
      ],
      hint: "`mapMaybe (\\n -> lookup n table) names`.",
      solution: hs`scoresOf :: [String] -> [(String, Int)] -> [Int]
scoresOf names table = mapMaybe (\n -> lookup n table) names
`,
    },
    {
      k: "write",
      body: "Write `nextHop x table`: one lookup. Missing keys give `Nothing`.",
      setup: hopsSetup,
      starter: hs`nextHop :: String -> [(String, String)] -> Maybe String
nextHop x table = undefined
`,
      tests: [
        { expr: "nextHop \"amy\" hops", expected: "Just \"ben\"" },
        { expr: "nextHop \"zed\" hops", expected: "Nothing", label: "missing key" },
        { expr: "nextHop \"ed\" hops", expected: "Nothing" },
        { expr: "nextHop \"x\" hops", expected: "Just \"y\"" },
      ],
      hint: "This is just `lookup x table`.",
      solution: hs`nextHop :: String -> [(String, String)] -> Maybe String
nextHop x table = lookup x table
`,
    },
    {
      k: "write",
      body: "Write `twoHops x table`: look up `x`, then look up that result. If either step is missing, the answer is `Nothing`. Use `case`, not `>>=`.",
      setup: hopsSetup,
      starter: hs`twoHops :: String -> [(String, String)] -> Maybe String
twoHops x table = undefined
`,
      tests: [
        { expr: "twoHops \"amy\" hops", expected: "Just \"cal\"" },
        { expr: "twoHops \"dot\" hops", expected: "Nothing", label: "second hop missing" },
        { expr: "twoHops \"zed\" hops", expected: "Nothing", label: "first hop missing" },
        { expr: "twoHops \"ben\" hops", expected: "Just \"dot\"" },
      ],
      hint: "`case lookup x table of { Nothing -> Nothing; Just y -> lookup y table }`.",
      solution: hs`twoHops :: String -> [(String, String)] -> Maybe String
twoHops x table =
  case lookup x table of
    Nothing -> Nothing
    Just y  -> lookup y table
`,
      banned: [">>=", ">>"],
    },
    {
      k: "write",
      body: "Write `leadingDigit`: `Just` the first character if it is a digit `'0'`..`'9'`, otherwise `Nothing`.",
      starter: hs`leadingDigit :: String -> Maybe Char
leadingDigit s = undefined
`,
      tests: [
        { expr: "leadingDigit \"3abc\"", expected: "Just '3'" },
        { expr: "leadingDigit \"abc\"", expected: "Nothing", label: "letter first" },
        { expr: "leadingDigit \"\"", expected: "Nothing" },
        { expr: "leadingDigit \"0\"", expected: "Just '0'" },
      ],
      hint: "Empty string is `Nothing`. For `(c : _)`, check `c >= '0' && c <= '9'`.",
      solution: hs`leadingDigit :: String -> Maybe Char
leadingDigit [] = Nothing
leadingDigit (c : _)
  | c >= '0' && c <= '9' = Just c
  | otherwise            = Nothing
`,
    },
    {
      k: "write",
      body: "Write `plusMinus`: `Just True` for `'+'`, `Just False` for `'-'`, `Nothing` for any other character.",
      starter: hs`plusMinus :: Char -> Maybe Bool
plusMinus c = undefined
`,
      tests: [
        { expr: "plusMinus '+'", expected: "Just True" },
        { expr: "plusMinus '-'", expected: "Just False" },
        { expr: "plusMinus '*'", expected: "Nothing", label: "unknown sign" },
        { expr: "plusMinus '0'", expected: "Nothing" },
      ],
      hint: "Three equations, one per case, with a catch-all `_`.",
      solution: hs`plusMinus :: Char -> Maybe Bool
plusMinus '+' = Just True
plusMinus '-' = Just False
plusMinus _   = Nothing
`,
    },
    {
      k: "write",
      body: "Write `keepJusts` using `catMaybes`.",
      setup: hs`import Data.Maybe (catMaybes)
`,
      starter: hs`keepJusts :: [Maybe a] -> [a]
keepJusts ms = undefined
`,
      tests: [
        { expr: "keepJusts [Just 2, Nothing, Just 5]", expected: "[2, 5]" },
        { expr: "keepJusts [Nothing :: Maybe Int]", expected: "[]", label: "only Nothing" },
        { expr: "keepJusts ([] :: [Maybe Int])", expected: "[]" },
        { expr: "keepJusts [Just False, Just True]", expected: "[False, True]" },
      ],
      hint: "`keepJusts = catMaybes`.",
      solution: hs`keepJusts :: [Maybe a] -> [a]
keepJusts ms = catMaybes ms
`,
    },
    {
      k: "write",
      body: "Write `longEnough n words`: keep the words whose length is at least `n`, as they are. Use `mapMaybe`.",
      setup: hs`import Data.Maybe (mapMaybe)
`,
      starter: hs`longEnough :: Int -> [String] -> [String]
longEnough n words = undefined
`,
      tests: [
        { expr: "longEnough 3 [\"a\", \"bb\", \"cat\", \"door\"]", expected: "[\"cat\", \"door\"]" },
        { expr: "longEnough 5 [\"a\", \"bb\"]", expected: "[]", label: "none long enough" },
        { expr: "longEnough 0 [\"\", \"x\"]", expected: "[\"\", \"x\"]" },
        { expr: "longEnough 1 []", expected: "[]" },
      ],
      hint: "`mapMaybe (\\w -> if length w >= n then Just w else Nothing) words`.",
      solution: hs`longEnough :: Int -> [String] -> [String]
longEnough n words =
  mapMaybe (\w -> if length w >= n then Just w else Nothing) words
`,
    },
    {
      k: "write",
      body: "Write `minBox`: the smaller of two `Maybe Int`s. If one is `Nothing`, use the other. If both are `Nothing`, the answer is `Nothing`.",
      starter: hs`minBox :: Maybe Int -> Maybe Int -> Maybe Int
minBox a b = undefined
`,
      tests: [
        { expr: "minBox (Just 3) (Just 8)", expected: "Just 3" },
        { expr: "minBox Nothing (Just 8)", expected: "Just 8", label: "Nothing ignored" },
        { expr: "minBox (Just 3) Nothing", expected: "Just 3" },
        { expr: "minBox Nothing Nothing", expected: "Nothing" },
      ],
      hint: "Four combinations: `Just`/`Just` uses `min`; a single `Just` wins; two `Nothing`s stay `Nothing`.",
      solution: hs`minBox :: Maybe Int -> Maybe Int -> Maybe Int
minBox (Just x) (Just y) = Just (min x y)
minBox Nothing b = b
minBox a Nothing = a
`,
    },
    {
      k: "write",
      body: "Write `plusBoxes`: add the two numbers if both are `Just`. If either is `Nothing`, the answer is `Nothing`. Use `case`.",
      starter: hs`plusBoxes :: Maybe Int -> Maybe Int -> Maybe Int
plusBoxes a b = undefined
`,
      tests: [
        { expr: "plusBoxes (Just 3) (Just 4)", expected: "Just 7" },
        { expr: "plusBoxes Nothing (Just 4)", expected: "Nothing", label: "left Nothing" },
        { expr: "plusBoxes (Just 3) Nothing", expected: "Nothing" },
        { expr: "plusBoxes Nothing Nothing", expected: "Nothing" },
      ],
      hint: "Outer `case` on `a`. In the `Just x` branch, `case` on `b`.",
      solution: hs`plusBoxes :: Maybe Int -> Maybe Int -> Maybe Int
plusBoxes a b =
  case a of
    Nothing -> Nothing
    Just x ->
      case b of
        Nothing -> Nothing
        Just y  -> Just (x + y)
`,
      banned: [">>=", ">>", "<$>"],
    },
    {
      k: "write",
      body: "Write `findOr d k table`: look up `k`; if it is missing, use the default `d`. Do not use `fromMaybe`.",
      starter: hs`findOr :: Eq k => a -> k -> [(k, a)] -> a
findOr d k table = undefined
`,
      tests: [
        { expr: "findOr 0 \"a\" [(\"a\", 5), (\"b\", 9)]", expected: "5" },
        { expr: "findOr 0 \"z\" [(\"a\", 5)]", expected: "0", label: "missing uses default" },
        { expr: "findOr 'x' 1 [(1, 'q')]", expected: "'q'" },
        { expr: "findOr 'x' 2 ([] :: [(Int, Char)])", expected: "'x'" },
      ],
      hint: "`case lookup k table of { Just v -> v; Nothing -> d }`.",
      solution: hs`findOr :: Eq k => a -> k -> [(k, a)] -> a
findOr d k table =
  case lookup k table of
    Just v  -> v
    Nothing -> d
`,
      banned: ["fromMaybe", "maybe"],
    },
    {
      k: "write",
      body: "Write `shoutMaybe`: if the Maybe holds a string, append `\"!\"`. If it is `Nothing`, the answer is `\"hi!\"`. Use `maybe`.",
      starter: hs`shoutMaybe :: Maybe String -> String
shoutMaybe m = undefined
`,
      tests: [
        { expr: "shoutMaybe (Just \"ok\")", expected: "\"ok!\"" },
        { expr: "shoutMaybe Nothing", expected: "\"hi!\"", label: "Nothing uses the default" },
        { expr: "shoutMaybe (Just \"\")", expected: "\"!\"" },
        { expr: "shoutMaybe (Just \"!\")", expected: "\"!!\"" },
      ],
      hint: "`maybe \"hi!\" (++ \"!\") m`.",
      solution: hs`shoutMaybe :: Maybe String -> String
shoutMaybe m = maybe "hi!" (++ "!") m
`,
    },
    {
      k: "write",
      body: "Write `predNat n`: `Just (n - 1)` when `n > 0`, otherwise `Nothing`.",
      starter: hs`predNat :: Int -> Maybe Int
predNat n = undefined
`,
      tests: [
        { expr: "predNat 5", expected: "Just 4" },
        { expr: "predNat 0", expected: "Nothing", label: "cannot go below 0" },
        { expr: "predNat 1", expected: "Just 0" },
        { expr: "predNat (-3)", expected: "Nothing" },
      ],
      hint: "Guard on `n > 0`.",
      solution: hs`predNat :: Int -> Maybe Int
predNat n
  | n > 0     = Just (n - 1)
  | otherwise = Nothing
`,
    },
    {
      k: "write",
      body: "Write `bumpDigit`: if the character is `'0'`..`'8'`, give `Just` the next digit. `'9'` and non-digits are `Nothing`.",
      starter: hs`bumpDigit :: Char -> Maybe Char
bumpDigit c = undefined
`,
      tests: [
        { expr: "bumpDigit '3'", expected: "Just '4'" },
        { expr: "bumpDigit '9'", expected: "Nothing", label: "no digit after 9" },
        { expr: "bumpDigit 'a'", expected: "Nothing" },
        { expr: "bumpDigit '0'", expected: "Just '1'" },
      ],
      hint: "Check `c >= '0' && c <= '8'`, then `toEnum (fromEnum c + 1)`.",
      solution: hs`bumpDigit :: Char -> Maybe Char
bumpDigit c
  | c >= '0' && c <= '8' = Just (toEnum (fromEnum c + 1))
  | otherwise            = Nothing
`,
    },
    {
      k: "write",
      body: "Write `firstOk`: the first `Just` in a list of Maybes, or `Nothing` if the list is empty or every element is `Nothing`.",
      starter: hs`firstOk :: [Maybe a] -> Maybe a
firstOk ms = undefined
`,
      tests: [
        { expr: "firstOk [Nothing, Just 4, Just 5]", expected: "Just 4" },
        { expr: "firstOk [Nothing, Nothing :: Maybe Int]", expected: "Nothing", label: "all failed" },
        { expr: "firstOk ([] :: [Maybe Int])", expected: "Nothing" },
        { expr: "firstOk [Just False, Just True]", expected: "Just False" },
      ],
      hint: "`firstOk [] = Nothing`. A `Just` at the front is the answer. A `Nothing` at the front means keep going.",
      solution: hs`firstOk :: [Maybe a] -> Maybe a
firstOk [] = Nothing
firstOk (Just x : _) = Just x
firstOk (Nothing : ms) = firstOk ms
`,
    },
    {
      k: "write",
      body: "Write `keepPos`: keep the positive numbers, in order, using `mapMaybe`.",
      setup: hs`import Data.Maybe (mapMaybe)
`,
      starter: hs`keepPos :: [Int] -> [Int]
keepPos xs = undefined
`,
      tests: [
        { expr: "keepPos [(-2), 0, 3, 4]", expected: "[3, 4]" },
        { expr: "keepPos [(-1), 0]", expected: "[]", label: "none positive" },
        { expr: "keepPos []", expected: "[]" },
        { expr: "keepPos [1]", expected: "[1]" },
      ],
      hint: "`mapMaybe (\\n -> if n > 0 then Just n else Nothing) xs`.",
      solution: hs`keepPos :: [Int] -> [Int]
keepPos xs = mapMaybe (\n -> if n > 0 then Just n else Nothing) xs
`,
    },
    {
      k: "write",
      body: "Write `dropFails f xs`: apply `f` to each element and keep the successes. Write it with recursion, not `mapMaybe`.",
      starter: hs`dropFails :: (a -> Maybe b) -> [a] -> [b]
dropFails f xs = undefined
`,
      tests: [
        { expr: "dropFails (\\n -> if even n then Just n else Nothing) [1, 2, 3, 4]", expected: "[2, 4]" },
        { expr: "dropFails (\\n -> if even n then Just n else Nothing) [1, 3]", expected: "[]", label: "all fail" },
        { expr: "dropFails (const (Nothing :: Maybe Int)) [1, 2]", expected: "[]" },
        { expr: "dropFails Just ([] :: [Int])", expected: "[]" },
      ],
      hint: "Empty gives `[]`. `case f x of { Nothing -> dropFails f xs; Just y -> y : dropFails f xs }`.",
      solution: hs`dropFails :: (a -> Maybe b) -> [a] -> [b]
dropFails _ [] = []
dropFails f (x : xs) =
  case f x of
    Nothing -> dropFails f xs
    Just y  -> y : dropFails f xs
`,
      banned: ["mapMaybe", "catMaybes"],
    },
    {
      k: "write",
      body: "Write `orElse a b`: use `a` if it is a `Just`, otherwise use `b`. This is 'try this, else that'.",
      starter: hs`orElse :: Maybe a -> Maybe a -> Maybe a
orElse a b = undefined
`,
      tests: [
        { expr: "orElse (Just 1) (Just 2)", expected: "Just 1" },
        { expr: "orElse Nothing (Just 2)", expected: "Just 2", label: "fall back to second" },
        { expr: "orElse (Just 1) Nothing", expected: "Just 1" },
        { expr: "orElse (Nothing :: Maybe Int) Nothing", expected: "Nothing" },
      ],
      hint: "`orElse (Just x) _ = Just x` and `orElse Nothing b = b`.",
      solution: hs`orElse :: Maybe a -> Maybe a -> Maybe a
orElse (Just x) _ = Just x
orElse Nothing b = b
`,
    },
    {
      k: "write",
      body: "Write `charAt i s`: the character of `s` at index `i`, counting from 0. Negative or too large is `Nothing`. Do not use `!!`.",
      starter: hs`charAt :: Int -> String -> Maybe Char
charAt i s = undefined
`,
      tests: [
        { expr: "charAt 0 \"hi\"", expected: "Just 'h'" },
        { expr: "charAt 1 \"hi\"", expected: "Just 'i'" },
        { expr: "charAt 2 \"hi\"", expected: "Nothing", label: "past the end" },
        { expr: "charAt (-1) \"hi\"", expected: "Nothing" },
        { expr: "charAt 0 \"\"", expected: "Nothing" },
      ],
      hint: "Empty string is `Nothing`. Index 0 is the first character. Negative is `Nothing`. Otherwise recurse with `i - 1`.",
      solution: hs`charAt :: Int -> String -> Maybe Char
charAt _ [] = Nothing
charAt i (c : cs)
  | i < 0     = Nothing
  | i == 0    = Just c
  | otherwise = charAt (i - 1) cs
`,
      banned: ["!!"],
    },
    {
      k: "write",
      body: "Write `yesNo`: `Just True` for `\"yes\"`, `Just False` for `\"no\"`, `Nothing` for anything else (including different case).",
      starter: hs`yesNo :: String -> Maybe Bool
yesNo s = undefined
`,
      tests: [
        { expr: "yesNo \"yes\"", expected: "Just True" },
        { expr: "yesNo \"no\"", expected: "Just False" },
        { expr: "yesNo \"Yes\"", expected: "Nothing", label: "case matters" },
        { expr: "yesNo \"\"", expected: "Nothing" },
      ],
      hint: "Three equations: `\"yes\"`, `\"no\"`, and `_`.",
      solution: hs`yesNo :: String -> Maybe Bool
yesNo "yes" = Just True
yesNo "no"  = Just False
yesNo _     = Nothing
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 3: Stretch
// ---------------------------------------------------------------------------

const level3: DrillSet = {
  id: "b-maybe-l3",
  lesson: "",
  level: 3,
  title: "Level 3: Stretch",
  intro: md(
    "Three jobs come up again and again.",
    "",
    "- First success: walk a list of Maybes and take the first `Just`.",
    "- All or nothing: a list of Maybes becomes `Just` a list only if every element is `Just`. One `Nothing` makes the whole thing `Nothing`.",
    "- Try this, else that: if one attempt fails, try another.",
    "",
    "A tiny parser is just a function `String -> Maybe something`. Failure is `Nothing`.",
  ),
  drills: [
    {
      k: "quiz",
      q: "You have `[Maybe Int]`. You want `Nothing` as soon as any element is `Nothing`, otherwise `Just` the numbers. Which idea is that?",
      options: [
        "Keep the ones that worked (`catMaybes`)",
        "All-or-nothing (every element must be `Just`)",
        "First success (stop at the first `Just`)",
        "Unwrap with a default of 0",
      ],
      answer: 1,
      why: "All-or-nothing means one failure spoils the list. `catMaybes` would quietly drop the failures instead.",
    },
    {
      k: "predict",
      expr: "(\\xs -> if null xs then Nothing else Just (head xs)) (catMaybes [Nothing, Just (4 :: Int), Just 5])",
      answer: "Just 4",
      why: "`catMaybes` keeps `[4, 5]`. Taking the first element gives `Just 4`.",
    },
    {
      k: "predict",
      expr: "sequence [Just 1, Just 2, Just 3]",
      answer: "Just [1, 2, 3]",
      why: "`sequence` on Maybes is all-or-nothing. Every element is `Just`, so the list is wrapped up.",
    },
    {
      k: "predict",
      expr: "sequence [Just (1 :: Int), Nothing, Just 3]",
      answer: "Nothing",
      why: "The middle `Nothing` makes the whole sequence fail.",
    },
    {
      k: "quiz",
      q: "A parser reads two digits in a row. The first digit succeeds and the second returns `Nothing`. What should the whole parser return?",
      options: [
        "`Just` the first digit",
        "`Nothing`",
        "`Just 0`",
        "It should crash",
      ],
      answer: 1,
      why: "The second step failed, so there is no complete answer. Pass `Nothing` up. Do not keep a half-parsed result.",
    },
    {
      k: "predict",
      expr: "fromMaybe (Just \"b\") (Nothing :: Maybe (Maybe String))",
      answer: "Just \"b\"",
      why: "The first attempt is `Nothing`, so the alternative `Just \"b\"` is used.",
    },
    {
      k: "write",
      body: "Write `firstPresent`: the first `Just` in a list, or `Nothing` if there isn't one. Recursion, no `catMaybes`.",
      starter: hs`firstPresent :: [Maybe a] -> Maybe a
firstPresent ms = undefined
`,
      tests: [
        { expr: "firstPresent [Nothing, Just 'a', Just 'b']", expected: "Just 'a'" },
        { expr: "firstPresent [Nothing, Nothing :: Maybe Int]", expected: "Nothing", label: "all Nothing" },
        { expr: "firstPresent ([] :: [Maybe Int])", expected: "Nothing" },
        { expr: "firstPresent [Just 9]", expected: "Just 9" },
      ],
      hint: "Empty: `Nothing`. `Just x` at the front: `Just x`. `Nothing` at the front: recurse.",
      solution: hs`firstPresent :: [Maybe a] -> Maybe a
firstPresent [] = Nothing
firstPresent (Just x : _) = Just x
firstPresent (Nothing : ms) = firstPresent ms
`,
      banned: ["catMaybes"],
    },
    {
      k: "write",
      body: "Write `everyJust`: `Just` the list of values if every element is `Just`. One `Nothing` makes the whole answer `Nothing`. Do not use `sequence` or `mapM`.",
      starter: hs`everyJust :: [Maybe a] -> Maybe [a]
everyJust ms = undefined
`,
      tests: [
        { expr: "everyJust [Just 1, Just 2, Just 3]", expected: "Just [1, 2, 3]" },
        { expr: "everyJust [Just 1, Nothing, Just 3]", expected: "Nothing", label: "one Nothing fails all" },
        { expr: "everyJust ([] :: [Maybe Int])", expected: "Just []" },
        { expr: "everyJust [Nothing :: Maybe Int]", expected: "Nothing" },
      ],
      hint: "`everyJust [] = Just []`. A `Nothing` at the front is `Nothing`. For `Just x`, `case everyJust xs of { Nothing -> Nothing; Just ys -> Just (x : ys) }`.",
      solution: hs`everyJust :: [Maybe a] -> Maybe [a]
everyJust [] = Just []
everyJust (Nothing : _) = Nothing
everyJust (Just x : xs) =
  case everyJust xs of
    Nothing -> Nothing
    Just ys -> Just (x : ys)
`,
      banned: ["sequence", "mapM", "sequenceA"],
    },
    {
      k: "write",
      body: "Write `tryInOrder`: try each function on `x` from left to right and return the first `Just`. If every function fails, `Nothing`.",
      starter: hs`tryInOrder :: [a -> Maybe b] -> a -> Maybe b
tryInOrder fs x = undefined
`,
      tests: [
        { expr: "tryInOrder [\\n -> if n > 10 then Just \"big\" else Nothing, \\n -> if n < 0 then Just \"neg\" else Nothing] 4", expected: "Nothing", label: "both fail" },
        { expr: "tryInOrder [\\n -> if n > 10 then Just \"big\" else Nothing, \\n -> if n < 0 then Just \"neg\" else Nothing] (-2)", expected: "Just \"neg\"" },
        { expr: "tryInOrder [\\n -> if n > 10 then Just \"big\" else Nothing, \\n -> if n < 0 then Just \"neg\" else Nothing] 20", expected: "Just \"big\"" },
        { expr: "tryInOrder [] True :: Maybe Int", expected: "Nothing" },
      ],
      hint: "`tryInOrder [] _ = Nothing`. For `(f : fs)`, `case f x of { Just y -> Just y; Nothing -> tryInOrder fs x }`.",
      solution: hs`tryInOrder :: [a -> Maybe b] -> a -> Maybe b
tryInOrder [] _ = Nothing
tryInOrder (f : fs) x =
  case f x of
    Just y  -> Just y
    Nothing -> tryInOrder fs x
`,
    },
    {
      k: "write",
      body: "Write `bitOf`: `'0'` is `Just False`, `'1'` is `Just True`, anything else is `Nothing`.",
      starter: hs`bitOf :: Char -> Maybe Bool
bitOf c = undefined
`,
      tests: [
        { expr: "bitOf '0'", expected: "Just False" },
        { expr: "bitOf '1'", expected: "Just True" },
        { expr: "bitOf '2'", expected: "Nothing", label: "not a bit" },
        { expr: "bitOf ' '", expected: "Nothing" },
      ],
      hint: "Two equations plus a catch-all.",
      solution: hs`bitOf :: Char -> Maybe Bool
bitOf '0' = Just False
bitOf '1' = Just True
bitOf _   = Nothing
`,
    },
    {
      k: "write",
      body: "Write `bitsAll`: parse a whole string of bits. If any character is not `'0'` or `'1'`, the answer is `Nothing`. An empty string succeeds as `Just []`.",
      starter: hs`bitsAll :: String -> Maybe [Bool]
bitsAll s = undefined
`,
      tests: [
        { expr: "bitsAll \"01\"", expected: "Just [False, True]" },
        { expr: "bitsAll \"0x1\"", expected: "Nothing", label: "bad character" },
        { expr: "bitsAll \"\"", expected: "Just []" },
        { expr: "bitsAll \"111\"", expected: "Just [True, True, True]" },
      ],
      hint: "Reuse the `bitOf` idea. Empty: `Just []`. For `(c : cs)`, `case` on the bit, then `case` on `bitsAll cs`.",
      solution: hs`bitsAll :: String -> Maybe [Bool]
bitsAll [] = Just []
bitsAll (c : cs) =
  case bitOne c of
    Nothing -> Nothing
    Just b ->
      case bitsAll cs of
        Nothing -> Nothing
        Just bs -> Just (b : bs)
  where
    bitOne '0' = Just False
    bitOne '1' = Just True
    bitOne _   = Nothing
`,
    },
    {
      k: "write",
      body: "Write `bitsGood`: keep the bits that parse, skip any other character. `\"0x1\"` becomes `[False, True]`.",
      starter: hs`bitsGood :: String -> [Bool]
bitsGood s = undefined
`,
      tests: [
        { expr: "bitsGood \"0x1\"", expected: "[False, True]" },
        { expr: "bitsGood \"abc\"", expected: "[]", label: "nothing kept" },
        { expr: "bitsGood \"\"", expected: "[]" },
        { expr: "bitsGood \"10\"", expected: "[True, False]" },
      ],
      hint: "Like `mapMaybe` over the characters. `'0'` keeps `False`, `'1'` keeps `True`, anything else is skipped.",
      solution: hs`bitsGood :: String -> [Bool]
bitsGood [] = []
bitsGood ('0' : cs) = False : bitsGood cs
bitsGood ('1' : cs) = True : bitsGood cs
bitsGood (_ : cs) = bitsGood cs
`,
    },
    {
      k: "write",
      body: "Write `followAll keys table`: look up every key. If any key is missing, the whole answer is `Nothing`. If `keys` is empty, `Just []`.",
      setup: scoresSetup,
      starter: hs`followAll :: [String] -> [(String, Int)] -> Maybe [Int]
followAll keys table = undefined
`,
      tests: [
        { expr: "followAll [\"sam\", \"rio\"] scores", expected: "Just [12, 7]" },
        { expr: "followAll [\"sam\", \"zed\"] scores", expected: "Nothing", label: "one missing key" },
        { expr: "followAll [] scores", expected: "Just []" },
        { expr: "followAll [\"lee\"] scores", expected: "Just [0]" },
      ],
      hint: "Empty keys: `Just []`. `case lookup k table of { Nothing -> Nothing; Just v -> case followAll ks table of ... }`.",
      solution: hs`followAll :: [String] -> [(String, Int)] -> Maybe [Int]
followAll [] _ = Just []
followAll (k : ks) table =
  case lookup k table of
    Nothing -> Nothing
    Just v ->
      case followAll ks table of
        Nothing -> Nothing
        Just vs -> Just (v : vs)
`,
      banned: ["sequence", "mapM"],
    },
    {
      k: "write",
      body: "Write `digitsInt`: if the string is non-empty and every character is a digit, `Just` the Int; otherwise `Nothing`. `\"\"` is `Nothing`.",
      starter: hs`digitsInt :: String -> Maybe Int
digitsInt s = undefined
`,
      tests: [
        { expr: "digitsInt \"42\"", expected: "Just 42" },
        { expr: "digitsInt \"4x\"", expected: "Nothing", label: "non-digit" },
        { expr: "digitsInt \"\"", expected: "Nothing", label: "empty string" },
        { expr: "digitsInt \"07\"", expected: "Just 7" },
      ],
      hint: "Check `not (null s) && all (\\c -> c >= '0' && c <= '9') s`, then `Just (read s)`.",
      solution: hs`digitsInt :: String -> Maybe Int
digitsInt s
  | not (null s) && all (\c -> c >= '0' && c <= '9') s = Just (read s)
  | otherwise = Nothing
`,
    },
    {
      k: "write",
      body: "Write `twoChars`: `Just` the first two characters as a pair, or `Nothing` if the string has fewer than two characters.",
      starter: hs`twoChars :: String -> Maybe (Char, Char)
twoChars s = undefined
`,
      tests: [
        { expr: "twoChars \"hi!\"", expected: "Just ('h', 'i')" },
        { expr: "twoChars \"a\"", expected: "Nothing", label: "too short" },
        { expr: "twoChars \"\"", expected: "Nothing" },
        { expr: "twoChars \"xy\"", expected: "Just ('x', 'y')" },
      ],
      hint: "The pattern `(a : b : _)` succeeds when there are at least two characters.",
      solution: hs`twoChars :: String -> Maybe (Char, Char)
twoChars (a : b : _) = Just (a, b)
twoChars _ = Nothing
`,
    },
    {
      k: "write",
      body: "Write `splitEnds`: `Just` `(first, last)` for a non-empty list, `Nothing` for `[]`.",
      starter: hs`splitEnds :: [a] -> Maybe (a, a)
splitEnds xs = undefined
`,
      tests: [
        { expr: "splitEnds [1, 2, 9 :: Int]", expected: "Just (1, 9)" },
        { expr: "splitEnds ([] :: [Int])", expected: "Nothing", label: "empty" },
        { expr: "splitEnds \"z\"", expected: "Just ('z', 'z')" },
        { expr: "splitEnds [True, False, True]", expected: "Just (True, True)" },
      ],
      hint: "Empty is `Nothing`. Otherwise combine `head`/`last` ideas yourself: first element, then walk to the last.",
      solution: hs`splitEnds :: [a] -> Maybe (a, a)
splitEnds [] = Nothing
splitEnds (x : xs) = Just (x, lastOf (x : xs))
  where
    lastOf [y] = y
    lastOf (_ : ys) = lastOf ys
    lastOf [] = x
`,
      banned: ["head", "last"],
    },
    {
      k: "write",
      body: "Write `applyBoth f g x`: run both `f` and `g` on `x`. If both succeed, `Just` the pair. If either fails, `Nothing`.",
      starter: hs`applyBoth :: (a -> Maybe b) -> (a -> Maybe c) -> a -> Maybe (b, c)
applyBoth f g x = undefined
`,
      tests: [
        { expr: "applyBoth (\\n -> if n > 0 then Just n else Nothing) (\\n -> if even n then Just n else Nothing) 4", expected: "Just (4, 4)" },
        { expr: "applyBoth (\\n -> if n > 0 then Just n else Nothing) (\\n -> if even n then Just n else Nothing) 3", expected: "Nothing", label: "second fails" },
        { expr: "applyBoth (\\n -> if n > 0 then Just n else Nothing) (\\n -> if even n then Just n else Nothing) 0", expected: "Nothing" },
        { expr: "applyBoth Just Just 'a'", expected: "Just ('a', 'a')" },
      ],
      hint: "`case f x of { Nothing -> Nothing; Just a -> case g x of { Nothing -> Nothing; Just b -> Just (a, b) } }`.",
      solution: hs`applyBoth :: (a -> Maybe b) -> (a -> Maybe c) -> a -> Maybe (b, c)
applyBoth f g x =
  case f x of
    Nothing -> Nothing
    Just a ->
      case g x of
        Nothing -> Nothing
        Just b  -> Just (a, b)
`,
      banned: [">>=", ">>"],
    },
    {
      k: "write",
      body: "Write `chooseMap f xs` with recursion: map `f` and keep the `Just` results. Do not use `mapMaybe`.",
      starter: hs`chooseMap :: (a -> Maybe b) -> [a] -> [b]
chooseMap f xs = undefined
`,
      tests: [
        { expr: "chooseMap (\\c -> if c >= '0' && c <= '9' then Just c else Nothing) \"a1b2\"", expected: "\"12\"" },
        { expr: "chooseMap (const (Nothing :: Maybe Int)) [1, 2]", expected: "[]", label: "all fail" },
        { expr: "chooseMap Just ([] :: [Int])", expected: "[]" },
        { expr: "chooseMap Just [7, 8]", expected: "[7, 8]" },
      ],
      hint: "Same shape as `dropFails` from Level 2.",
      solution: hs`chooseMap :: (a -> Maybe b) -> [a] -> [b]
chooseMap _ [] = []
chooseMap f (x : xs) =
  case f x of
    Nothing -> chooseMap f xs
    Just y  -> y : chooseMap f xs
`,
      banned: ["mapMaybe", "catMaybes"],
    },
    {
      k: "write",
      body: "Write `recover d m`: if `m` is `Nothing`, replace it with `Just d`. A `Just` is left alone.",
      starter: hs`recover :: a -> Maybe a -> Maybe a
recover d m = undefined
`,
      tests: [
        { expr: "recover 0 (Just 5)", expected: "Just 5" },
        { expr: "recover 0 Nothing", expected: "Just 0", label: "Nothing recovered" },
        { expr: "recover 'z' Nothing", expected: "Just 'z'" },
        { expr: "recover \"x\" (Just \"y\")", expected: "Just \"y\"" },
      ],
      hint: "`recover d Nothing = Just d` and `recover _ (Just x) = Just x`.",
      solution: hs`recover :: a -> Maybe a -> Maybe a
recover d Nothing = Just d
recover _ (Just x) = Just x
`,
    },
    {
      k: "write",
      body: "Write `matchFirst checks x`: each check is a test and a label. Return `Just` the first label whose test is `True`. If none match, `Nothing`.",
      starter: hs`matchFirst :: [(a -> Bool, b)] -> a -> Maybe b
matchFirst checks x = undefined
`,
      tests: [
        { expr: "matchFirst [((> 10), \"big\"), (even, \"even\")] 4", expected: "Just \"even\"" },
        { expr: "matchFirst [((> 10), \"big\"), (even, \"even\")] 12", expected: "Just \"big\"" },
        { expr: "matchFirst [((> 10), \"big\"), (even, \"even\")] 3", expected: "Nothing", label: "no rule matches" },
        { expr: "matchFirst [] True :: Maybe Int", expected: "Nothing" },
      ],
      hint: "Empty checks: `Nothing`. For `((p, label) : rest)`, if `p x` then `Just label`, else recurse.",
      solution: hs`matchFirst :: [(a -> Bool, b)] -> a -> Maybe b
matchFirst [] _ = Nothing
matchFirst ((p, label) : rest) x
  | p x       = Just label
  | otherwise = matchFirst rest x
`,
    },
    {
      k: "write",
      body: "Write `hexDigit`: `'0'`..`'9'` as 0..9, `'a'`..`'f'` as 10..15. Any other character is `Nothing`. Uppercase letters fail.",
      starter: hs`hexDigit :: Char -> Maybe Int
hexDigit c = undefined
`,
      tests: [
        { expr: "hexDigit '9'", expected: "Just 9" },
        { expr: "hexDigit 'a'", expected: "Just 10" },
        { expr: "hexDigit 'f'", expected: "Just 15" },
        { expr: "hexDigit 'A'", expected: "Nothing", label: "uppercase fails" },
        { expr: "hexDigit 'g'", expected: "Nothing" },
      ],
      hint: "Three guards: digits, then `'a'`..`'f'` using `fromEnum c - fromEnum 'a' + 10`.",
      solution: hs`hexDigit :: Char -> Maybe Int
hexDigit c
  | c >= '0' && c <= '9' = Just (fromEnum c - fromEnum '0')
  | c >= 'a' && c <= 'f' = Just (fromEnum c - fromEnum 'a' + 10)
  | otherwise            = Nothing
`,
    },
    {
      k: "write",
      body: "Write `hexOrDec`: try `hexDigit` first; if that fails, accept `'0'`..`'9'` as decimal (same values). Other characters are `Nothing`. (So `'a'` is 10, `'A'` is `Nothing`.)",
      starter: hs`hexOrDec :: Char -> Maybe Int
hexOrDec c = undefined
`,
      tests: [
        { expr: "hexOrDec 'b'", expected: "Just 11" },
        { expr: "hexOrDec '5'", expected: "Just 5" },
        { expr: "hexOrDec 'A'", expected: "Nothing", label: "uppercase still fails" },
        { expr: "hexOrDec '?'", expected: "Nothing" },
      ],
      hint: "You can write one `case` on a helper, or just the same guards as `hexDigit` (decimal is already included).",
      solution: hs`hexOrDec :: Char -> Maybe Int
hexOrDec c =
  case hex of
    Just n  -> Just n
    Nothing -> dec
  where
    hex
      | c >= 'a' && c <= 'f' = Just (fromEnum c - fromEnum 'a' + 10)
      | otherwise            = Nothing
    dec
      | c >= '0' && c <= '9' = Just (fromEnum c - fromEnum '0')
      | otherwise            = Nothing
`,
    },
    {
      k: "write",
      body: "Write `thenDo f g x`: run `f` on `x`; if that succeeds, run `g` on the result. Either failure is `Nothing`.",
      starter: hs`thenDo :: (a -> Maybe b) -> (b -> Maybe c) -> a -> Maybe c
thenDo f g x = undefined
`,
      tests: [
        { expr: "thenDo (\\n -> if n > 0 then Just n else Nothing) (\\n -> if even n then Just (n * 10) else Nothing) 4", expected: "Just 40" },
        { expr: "thenDo (\\n -> if n > 0 then Just n else Nothing) (\\n -> if even n then Just (n * 10) else Nothing) 3", expected: "Nothing", label: "second fails" },
        { expr: "thenDo (\\n -> if n > 0 then Just n else Nothing) (\\n -> if even n then Just (n * 10) else Nothing) 0", expected: "Nothing" },
        { expr: "thenDo Just Just \"ok\"", expected: "Just \"ok\"" },
      ],
      hint: "`case f x of { Nothing -> Nothing; Just y -> g y }`.",
      solution: hs`thenDo :: (a -> Maybe b) -> (b -> Maybe c) -> a -> Maybe c
thenDo f g x =
  case f x of
    Nothing -> Nothing
    Just y  -> g y
`,
      banned: [">>=", ">>"],
    },
    {
      k: "write",
      body: "Write `pairUp`: if both Maybes are `Just`, pair the values. Otherwise `Nothing`.",
      starter: hs`pairUp :: Maybe a -> Maybe b -> Maybe (a, b)
pairUp a b = undefined
`,
      tests: [
        { expr: "pairUp (Just (1 :: Int)) (Just 'a')", expected: "Just (1, 'a')" },
        { expr: "pairUp (Nothing :: Maybe Int) (Just 'a')", expected: "Nothing", label: "left Nothing" },
        { expr: "pairUp (Just (1 :: Int)) (Nothing :: Maybe Char)", expected: "Nothing" },
        { expr: "pairUp (Nothing :: Maybe Int) (Nothing :: Maybe Char)", expected: "Nothing :: Maybe (Int, Char)" },
      ],
      hint: "`pairUp (Just x) (Just y) = Just (x, y)` and a catch-all `Nothing`.",
      solution: hs`pairUp :: Maybe a -> Maybe b -> Maybe (a, b)
pairUp (Just x) (Just y) = Just (x, y)
pairUp _ _ = Nothing
`,
    },
    {
      k: "write",
      body: "Write `nothingAs d m`: unwrap with a default, without `fromMaybe`. Same idea as Level 1, now polymorphic.",
      starter: hs`nothingAs :: a -> Maybe a -> a
nothingAs d m = undefined
`,
      tests: [
        { expr: "nothingAs 0 (Just 8)", expected: "8" },
        { expr: "nothingAs 0 Nothing", expected: "0", label: "default" },
        { expr: "nothingAs \"z\" (Just \"q\")", expected: "\"q\"" },
        { expr: "nothingAs \"z\" Nothing", expected: "\"z\"" },
      ],
      hint: "Two equations: `Nothing` gives `d`, `Just x` gives `x`.",
      solution: hs`nothingAs :: a -> Maybe a -> a
nothingAs d Nothing = d
nothingAs _ (Just x) = x
`,
      banned: ["fromMaybe", "maybe"],
    },
    {
      k: "write",
      body: "Write `mustHave pred m`: keep a `Just` only when `pred` holds of the value. If the Maybe is `Nothing`, or the value fails the test, the answer is `Nothing`.",
      starter: hs`mustHave :: (a -> Bool) -> Maybe a -> Maybe a
mustHave pred m = undefined
`,
      tests: [
        { expr: "mustHave even (Just 4)", expected: "Just 4" },
        { expr: "mustHave even (Just 3)", expected: "Nothing", label: "predicate fails" },
        { expr: "mustHave even Nothing", expected: "Nothing" },
        { expr: "mustHave (not . null) (Just \"ok\")", expected: "Just \"ok\"" },
      ],
      hint: "`Nothing` stays `Nothing`. For `Just x`, if `pred x` then `Just x` else `Nothing`.",
      solution: hs`mustHave :: (a -> Bool) -> Maybe a -> Maybe a
mustHave _ Nothing = Nothing
mustHave pred (Just x)
  | pred x    = Just x
  | otherwise = Nothing
`,
    },
    {
      k: "write",
      body: "Write `eatPrefix pre s`: if `s` starts with `pre`, `Just` the leftover suffix. Otherwise `Nothing`. Do not use `isPrefixOf`.",
      starter: hs`eatPrefix :: String -> String -> Maybe String
eatPrefix pre s = undefined
`,
      tests: [
        { expr: "eatPrefix \"go\" \"going\"", expected: "Just \"ing\"" },
        { expr: "eatPrefix \"go\" \"stop\"", expected: "Nothing", label: "no match" },
        { expr: "eatPrefix \"\" \"ab\"", expected: "Just \"ab\"" },
        { expr: "eatPrefix \"ab\" \"a\"", expected: "Nothing" },
      ],
      hint: "`eatPrefix [] s = Just s`. If either string runs out early, `Nothing`. Compare heads one by one.",
      solution: hs`eatPrefix :: String -> String -> Maybe String
eatPrefix [] s = Just s
eatPrefix _ [] = Nothing
eatPrefix (p : ps) (c : cs)
  | p == c    = eatPrefix ps cs
  | otherwise = Nothing
`,
      banned: ["isPrefixOf", "stripPrefix"],
    },
    {
      k: "write",
      body: "Write `parseWord`: skip leading spaces, then take a run of letters (`'a'`..`'z'` or `'A'`..`'Z'`). `Just` the word and the leftover. If there is no letter after the spaces, `Nothing`.",
      starter: hs`parseWord :: String -> Maybe (String, String)
parseWord s = undefined
`,
      tests: [
        { expr: "parseWord \"  cat dog\"", expected: "Just (\"cat\", \" dog\")" },
        { expr: "parseWord \"   \"", expected: "Nothing", label: "only spaces" },
        { expr: "parseWord \"42\"", expected: "Nothing" },
        { expr: "parseWord \"Hi!\"", expected: "Just (\"Hi\", \"!\")" },
      ],
      hint: "Drop spaces first. If the next character is a letter, span letters. Otherwise `Nothing`.",
      solution: hs`parseWord :: String -> Maybe (String, String)
parseWord s =
  case dropWhile isSp s of
    [] -> Nothing
    (c : cs)
      | isLet c ->
          let (w, rest) = span isLet (c : cs)
          in Just (w, rest)
      | otherwise -> Nothing
  where
    isSp c = c == ' '
    isLet c = (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
`,
    },
    {
      k: "write",
      body: "Write `parseTwo`: parse two words in a row (same rules as `parseWord`). Spaces between them are skipped. If either word is missing, `Nothing`.",
      starter: hs`parseTwo :: String -> Maybe (String, String)
parseTwo s = undefined
`,
      tests: [
        { expr: "parseTwo \"  red  blue!\"", expected: "Just (\"red\", \"blue\")" },
        { expr: "parseTwo \"red\"", expected: "Nothing", label: "only one word" },
        { expr: "parseTwo \"  1 2\"", expected: "Nothing" },
        { expr: "parseTwo \"A B\"", expected: "Just (\"A\", \"B\")" },
      ],
      hint: "Parse one word, then parse a word from the leftover. Use `case` twice.",
      solution: hs`parseTwo :: String -> Maybe (String, String)
parseTwo s =
  case one s of
    Nothing -> Nothing
    Just (w1, rest) ->
      case one rest of
        Nothing -> Nothing
        Just (w2, _) -> Just (w1, w2)
  where
    one t =
      case dropWhile isSp t of
        [] -> Nothing
        (c : cs)
          | isLet c ->
              let (w, rest) = span isLet (c : cs)
              in Just (w, rest)
          | otherwise -> Nothing
    isSp c = c == ' '
    isLet c = (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
`,
    },
    {
      k: "write",
      body: "Write `untilFail`: collect values from the front of a `[Maybe a]` until the first `Nothing` (that `Nothing` is not included). A `Nothing` later is where you stop. Contrast this with `everyJust` (all-or-nothing) and `stripNones` (skip holes).",
      starter: hs`untilFail :: [Maybe a] -> [a]
untilFail ms = undefined
`,
      tests: [
        { expr: "untilFail [Just 1, Just 2, Nothing, Just 4]", expected: "[1, 2]" },
        { expr: "untilFail [Nothing, Just 1]", expected: "[]", label: "fails at once" },
        { expr: "untilFail [Just 1, Just 2]", expected: "[1, 2]" },
        { expr: "untilFail ([] :: [Maybe Int])", expected: "[]" },
      ],
      hint: "Stop at `[]` or `Nothing`. For `Just x : ms`, put `x` on the front of `untilFail ms`.",
      solution: hs`untilFail :: [Maybe a] -> [a]
untilFail [] = []
untilFail (Nothing : _) = []
untilFail (Just x : ms) = x : untilFail ms
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 4: Exam strength
// ---------------------------------------------------------------------------

const level4: DrillSet = {
  id: "b-maybe-l4",
  lesson: "",
  level: 4,
  title: "Level 4: Exam strength",
  intro: md(
    "These are worded like the real paper: a type, a short description, and a GHCi transcript. The types and sample data are given above your code. Read the examples: they settle details the prose leaves open. The last eight are as hard as a 3 to 5 mark question.",
    "",
    "```",
    "ghci> seatOf \"Ada\" plan",
    "Just 12",
    "ghci> seatOf \"Zed\" plan",
    "Nothing",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: "The spec says `seatOf :: String -> Plan -> Maybe Int` and 'if the guest is not seated the result is `Nothing`'. A guest is missing. What do you return?",
      options: [
        "`0`",
        "`Nothing`",
        "`error \"missing guest\"`",
        "Change the type to `Int`",
      ],
      answer: 1,
      why: "The type is `Maybe Int` and the spec names `Nothing` as the missing case. Do not invent 0, and do not change a given signature.",
    },
    {
      k: "quiz",
      q: "The spec says `feeOf :: String -> Menu -> Int` and 'a missing item costs 0'. How should you handle a missing item?",
      options: [
        "Return `Nothing`",
        "Call `error`",
        "`fromMaybe 0 (lookup item menu)`",
        "Change the type to `Maybe Int`",
      ],
      answer: 2,
      why: "The result type is `Int`, and the spec gives the missing-case answer. The Maybe from `lookup` is unwrapped with a default.",
    },
    {
      k: "write",
      setup: seatingSetup,
      body: md(
        "A seating plan is a list of `(guest, seat)` pairs:",
        "",
        "```",
        "type Guest = String",
        "type Seat  = Int",
        "type Plan  = [(Guest, Seat)]",
        "```",
        "",
        "Define a function `seatOf :: Guest -> Plan -> Maybe Seat` that returns the seat of a guest. If the guest does not appear, the result is `Nothing`. For example:",
        "",
        "```",
        "ghci> seatOf \"Ada\" plan",
        "Just 12",
        "ghci> seatOf \"Zed\" plan",
        "Nothing",
        "```",
      ),
      starter: hs`seatOf :: Guest -> Plan -> Maybe Seat
seatOf g p = undefined
`,
      tests: [
        { expr: "seatOf \"Ada\" plan", expected: "Just 12" },
        { expr: "seatOf \"Zed\" plan", expected: "Nothing", label: "missing guest" },
        { expr: "seatOf \"Dan\" plan", expected: "Just 3" },
        { expr: "seatOf \"Ada\" []", expected: "Nothing" },
      ],
      hint: "`seatOf g p = lookup g p`.",
      solution: hs`seatOf :: Guest -> Plan -> Maybe Seat
seatOf g p = lookup g p
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `firstFree :: Int -> [Int] -> Maybe Int`. Seats are numbered `1` to `n`. The second argument is the list of seats already taken. Return `Just` the smallest free seat number, or `Nothing` if every seat is taken. For example:",
        "",
        "```",
        "ghci> firstFree 4 [1, 2, 4]",
        "Just 3",
        "ghci> firstFree 2 [1, 2]",
        "Nothing",
        "```",
      ),
      starter: hs`firstFree :: Int -> [Int] -> Maybe Int
firstFree n taken = undefined
`,
      tests: [
        { expr: "firstFree 4 [1, 2, 4]", expected: "Just 3" },
        { expr: "firstFree 2 [1, 2]", expected: "Nothing", label: "all taken" },
        { expr: "firstFree 3 []", expected: "Just 1" },
        { expr: "firstFree 1 [1]", expected: "Nothing" },
        { expr: "firstFree 5 [2, 1, 3]", expected: "Just 4" },
      ],
      hint: "Count from 1 to `n`. If `i` is not in `taken`, `Just i`. If you pass `n`, `Nothing`.",
      solution: hs`firstFree :: Int -> [Int] -> Maybe Int
firstFree n taken = go 1
  where
    go i
      | i > n          = Nothing
      | elem i taken   = go (i + 1)
      | otherwise      = Just i
`,
    },
    {
      k: "write",
      setup: seatingSetup,
      body: md(
        "Define `badgeOf :: Guest -> Plan -> String`. If the guest has a seat, the badge is `\"seat \" ++ show seat`. If they are missing, the badge is `\"waitlist\"`. For example:",
        "",
        "```",
        "ghci> badgeOf \"Ben\" plan",
        "\"seat 7\"",
        "ghci> badgeOf \"Zed\" plan",
        "\"waitlist\"",
        "```",
      ),
      starter: hs`badgeOf :: Guest -> Plan -> String
badgeOf g p = undefined
`,
      tests: [
        { expr: "badgeOf \"Ben\" plan", expected: "\"seat 7\"" },
        { expr: "badgeOf \"Zed\" plan", expected: "\"waitlist\"", label: "missing guest" },
        { expr: "badgeOf \"Ada\" plan", expected: "\"seat 12\"" },
        { expr: "badgeOf \"Ada\" []", expected: "\"waitlist\"" },
      ],
      hint: "`maybe \"waitlist\" (\\s -> \"seat \" ++ show s) (lookup g p)`.",
      solution: hs`badgeOf :: Guest -> Plan -> String
badgeOf g p = maybe "waitlist" (\s -> "seat " ++ show s) (lookup g p)
`,
    },
    {
      k: "write",
      body: md(
        "A club stores optional nicknames. Define `callName :: String -> [(String, String)] -> String` that returns the nickname if there is one, otherwise the original name. For example:",
        "",
        "```",
        "ghci> callName \"william\" [(\"william\", \"will\")]",
        "\"will\"",
        "ghci> callName \"ada\" [(\"william\", \"will\")]",
        "\"ada\"",
        "```",
      ),
      setup: fromMaybeImp,
      starter: hs`callName :: String -> [(String, String)] -> String
callName name table = undefined
`,
      tests: [
        { expr: "callName \"william\" [(\"william\", \"will\")]", expected: "\"will\"" },
        { expr: "callName \"ada\" [(\"william\", \"will\")]", expected: "\"ada\"", label: "no nickname" },
        { expr: "callName \"ada\" []", expected: "\"ada\"" },
        { expr: "callName \"kim\" [(\"kim\", \"k\")]", expected: "\"k\"" },
      ],
      hint: "`fromMaybe name (lookup name table)`.",
      solution: hs`callName :: String -> [(String, String)] -> String
callName name table = fromMaybe name (lookup name table)
`,
    },
    {
      k: "write",
      setup: hs`type Stop = String
type Line = [(Stop, Stop)]

line :: Line
line = [("Ayr", "Troon"), ("Troon", "Irvine"), ("Irvine", "Kilwinning")]
`,
      body: md(
        "A single-track line is a table from each stop to the next stop:",
        "",
        "```",
        "type Stop = String",
        "type Line = [(Stop, Stop)]",
        "```",
        "",
        "Define `nextStop :: Stop -> Line -> Maybe Stop`. The last stop, and any unknown name, give `Nothing`. For example:",
        "",
        "```",
        "ghci> nextStop \"Troon\" line",
        "Just \"Irvine\"",
        "ghci> nextStop \"Kilwinning\" line",
        "Nothing",
        "```",
      ),
      starter: hs`nextStop :: Stop -> Line -> Maybe Stop
nextStop s line = undefined
`,
      tests: [
        { expr: "nextStop \"Troon\" line", expected: "Just \"Irvine\"" },
        { expr: "nextStop \"Kilwinning\" line", expected: "Nothing", label: "last stop" },
        { expr: "nextStop \"Zed\" line", expected: "Nothing" },
        { expr: "nextStop \"Ayr\" line", expected: "Just \"Troon\"" },
      ],
      hint: "`lookup s line`.",
      solution: hs`nextStop :: Stop -> Line -> Maybe Stop
nextStop s line = lookup s line
`,
    },
    {
      k: "write",
      body: md(
        "Define `paintOf :: Char -> Maybe String`. The codes are `'r'` red, `'g'` green, `'b'` blue. Any other character is `Nothing`. For example:",
        "",
        "```",
        "ghci> paintOf 'g'",
        "Just \"green\"",
        "ghci> paintOf 'x'",
        "Nothing",
        "```",
      ),
      starter: hs`paintOf :: Char -> Maybe String
paintOf c = undefined
`,
      tests: [
        { expr: "paintOf 'g'", expected: "Just \"green\"" },
        { expr: "paintOf 'x'", expected: "Nothing", label: "unknown code" },
        { expr: "paintOf 'r'", expected: "Just \"red\"" },
        { expr: "paintOf 'b'", expected: "Just \"blue\"" },
      ],
      hint: "One equation per colour, then a catch-all `Nothing`.",
      solution: hs`paintOf :: Char -> Maybe String
paintOf 'r' = Just "red"
paintOf 'g' = Just "green"
paintOf 'b' = Just "blue"
paintOf _   = Nothing
`,
    },
    {
      k: "write",
      setup: hs`exts :: [(String, [(String, Int)])]
exts = [("maths", [("ada", 101), ("ben", 102)]), ("cs", [("cara", 210)])]
`,
      body: md(
        "A phone book is a table from department to a table from person to extension. Define `extOf :: String -> String -> [(String, [(String, Int)])] -> Maybe Int` that looks up a person in a department. If the department or the person is missing, the result is `Nothing`. Use `case`. For example:",
        "",
        "```",
        "ghci> extOf \"maths\" \"ben\" exts",
        "Just 102",
        "ghci> extOf \"maths\" \"zed\" exts",
        "Nothing",
        "```",
      ),
      starter: hs`extOf :: String -> String -> [(String, [(String, Int)])] -> Maybe Int
extOf dept person book = undefined
`,
      tests: [
        { expr: "extOf \"maths\" \"ben\" exts", expected: "Just 102" },
        { expr: "extOf \"maths\" \"zed\" exts", expected: "Nothing", label: "person missing" },
        { expr: "extOf \"art\" \"ada\" exts", expected: "Nothing", label: "department missing" },
        { expr: "extOf \"cs\" \"cara\" exts", expected: "Just 210" },
      ],
      hint: "`case lookup dept book of { Nothing -> Nothing; Just t -> lookup person t }`.",
      solution: hs`extOf :: String -> String -> [(String, [(String, Int)])] -> Maybe Int
extOf dept person book =
  case lookup dept book of
    Nothing -> Nothing
    Just t  -> lookup person t
`,
      banned: [">>=", ">>"],
    },
    {
      k: "write",
      body: md(
        "Define `pickFrom :: Eq k => k -> [(k, v)] -> [(k, v)] -> Maybe v`. Look the key up in the first table; if it is missing, look in the second. If it is in neither, `Nothing`. For example:",
        "",
        "```",
        "ghci> pickFrom \"port\" [(\"host\", \"a\")] [(\"port\", \"80\")]",
        "Just \"80\"",
        "```",
      ),
      starter: hs`pickFrom :: Eq k => k -> [(k, v)] -> [(k, v)] -> Maybe v
pickFrom k a b = undefined
`,
      tests: [
        { expr: "pickFrom \"host\" [(\"host\", \"a\")] [(\"host\", \"b\"), (\"port\", \"80\")]", expected: "Just \"a\"" },
        { expr: "pickFrom \"port\" [(\"host\", \"a\")] [(\"host\", \"b\"), (\"port\", \"80\")]", expected: "Just \"80\"" },
        { expr: "pickFrom \"user\" [(\"host\", \"a\")] [(\"port\", \"80\")]", expected: "Nothing", label: "in neither table" },
        { expr: "pickFrom 1 [(1, True)] []", expected: "Just True" },
      ],
      hint: "`case lookup k a of { Just v -> Just v; Nothing -> lookup k b }`.",
      solution: hs`pickFrom :: Eq k => k -> [(k, v)] -> [(k, v)] -> Maybe v
pickFrom k a b =
  case lookup k a of
    Just v  -> Just v
    Nothing -> lookup k b
`,
    },
    {
      k: "write",
      setup: hs`type Team = String
type Player = String
type Captains = [(Team, Player)]

caps :: Captains
caps = [("reds", "mo"), ("blues", "ali")]
`,
      body: md(
        "Define `captainOf :: Team -> Captains -> Maybe Player`. A team with no listed captain gives `Nothing`. For example:",
        "",
        "```",
        "ghci> captainOf \"reds\" caps",
        "Just \"mo\"",
        "ghci> captainOf \"greens\" caps",
        "Nothing",
        "```",
      ),
      starter: hs`captainOf :: Team -> Captains -> Maybe Player
captainOf t cs = undefined
`,
      tests: [
        { expr: "captainOf \"reds\" caps", expected: "Just \"mo\"" },
        { expr: "captainOf \"greens\" caps", expected: "Nothing", label: "no captain listed" },
        { expr: "captainOf \"blues\" caps", expected: "Just \"ali\"" },
        { expr: "captainOf \"reds\" []", expected: "Nothing" },
      ],
      hint: "`lookup t cs`.",
      solution: hs`captainOf :: Team -> Captains -> Maybe Player
captainOf t cs = lookup t cs
`,
    },
    {
      k: "write",
      body: md(
        "Lockers are numbered from 0. Define `lockerOf :: Int -> [String] -> Maybe String` that returns the name on locker `i`. Negative `i`, or `i` past the end, is `Nothing`. Do not use `!!`. For example:",
        "",
        "```",
        "ghci> lockerOf 1 [\"ann\", \"bo\", \"cy\"]",
        "Just \"bo\"",
        "ghci> lockerOf 5 [\"ann\", \"bo\", \"cy\"]",
        "Nothing",
        "```",
      ),
      starter: hs`lockerOf :: Int -> [String] -> Maybe String
lockerOf i xs = undefined
`,
      tests: [
        { expr: "lockerOf 1 [\"ann\", \"bo\", \"cy\"]", expected: "Just \"bo\"" },
        { expr: "lockerOf 5 [\"ann\", \"bo\", \"cy\"]", expected: "Nothing", label: "past the end" },
        { expr: "lockerOf 0 [\"ann\", \"bo\", \"cy\"]", expected: "Just \"ann\"" },
        { expr: "lockerOf (-1) [\"ann\"]", expected: "Nothing" },
        { expr: "lockerOf 0 []", expected: "Nothing" },
      ],
      hint: "Same idea as a 0-based index: empty is `Nothing`; `i == 0` is the head; `i < 0` is `Nothing`.",
      solution: hs`lockerOf :: Int -> [String] -> Maybe String
lockerOf _ [] = Nothing
lockerOf i (x : xs)
  | i < 0     = Nothing
  | i == 0    = Just x
  | otherwise = lockerOf (i - 1) xs
`,
      banned: ["!!"],
    },
    {
      k: "write",
      setup: hopsSetup,
      body: md(
        "`hops` is a table from a course to the course it requires. Define `neededBy :: String -> [(String, String)] -> Maybe String`, the prerequisite of a course, or `Nothing` if none is listed. For example:",
        "",
        "```",
        "ghci> neededBy \"ben\" hops",
        "Just \"cal\"",
        "ghci> neededBy \"ed\" hops",
        "Nothing",
        "```",
      ),
      starter: hs`neededBy :: String -> [(String, String)] -> Maybe String
neededBy c table = undefined
`,
      tests: [
        { expr: "neededBy \"ben\" hops", expected: "Just \"cal\"" },
        { expr: "neededBy \"ed\" hops", expected: "Nothing", label: "no prerequisite" },
        { expr: "neededBy \"zed\" hops", expected: "Nothing" },
        { expr: "neededBy \"amy\" hops", expected: "Just \"ben\"" },
      ],
      hint: "`lookup c table`.",
      solution: hs`neededBy :: String -> [(String, String)] -> Maybe String
neededBy c table = lookup c table
`,
    },
    {
      k: "write",
      body: md(
        "Define `shadeOf :: String -> Maybe (Int, Int, Int)`. Recognised names are `\"black\"` as `(0,0,0)`, `\"white\"` as `(255,255,255)`, and `\"red\"` as `(255,0,0)`. Any other string is `Nothing`. For example:",
        "",
        "```",
        "ghci> shadeOf \"red\"",
        "Just (255,0,0)",
        "ghci> shadeOf \"pink\"",
        "Nothing",
        "```",
      ),
      starter: hs`shadeOf :: String -> Maybe (Int, Int, Int)
shadeOf s = undefined
`,
      tests: [
        { expr: "shadeOf \"red\"", expected: "Just (255, 0, 0)" },
        { expr: "shadeOf \"pink\"", expected: "Nothing", label: "unknown name" },
        { expr: "shadeOf \"black\"", expected: "Just (0, 0, 0)" },
        { expr: "shadeOf \"white\"", expected: "Just (255, 255, 255)" },
      ],
      hint: "One equation per name, then `_ = Nothing`.",
      solution: hs`shadeOf :: String -> Maybe (Int, Int, Int)
shadeOf "black" = Just (0, 0, 0)
shadeOf "white" = Just (255, 255, 255)
shadeOf "red"   = Just (255, 0, 0)
shadeOf _       = Nothing
`,
    },
    {
      k: "write",
      body: md(
        "Define `countHeld :: [Maybe a] -> Int`, the number of `Just` values. `Nothing`s do not count. For example:",
        "",
        "```",
        "ghci> countHeld [Just 1, Nothing, Just 2]",
        "2",
        "ghci> countHeld [Nothing, Nothing :: Maybe Int]",
        "0",
        "```",
      ),
      starter: hs`countHeld :: [Maybe a] -> Int
countHeld ms = undefined
`,
      tests: [
        { expr: "countHeld [Just 1, Nothing, Just 2]", expected: "2" },
        { expr: "countHeld [Nothing, Nothing :: Maybe Int]", expected: "0", label: "all Nothing" },
        { expr: "countHeld ([] :: [Maybe Int])", expected: "0" },
        { expr: "countHeld [Just 'a']", expected: "1" },
      ],
      hint: "`Nothing` adds 0. `Just _` adds 1.",
      solution: hs`countHeld :: [Maybe a] -> Int
countHeld [] = 0
countHeld (Nothing : ms) = countHeld ms
countHeld (Just _ : ms) = 1 + countHeld ms
`,
    },
    {
      k: "write",
      setup: seatingSetup,
      body: md(
        "Define `bothOn :: Guest -> Guest -> Plan -> Maybe (Seat, Seat)`. Look up both guests. If either is missing, the result is `Nothing`. Use `case`. For example:",
        "",
        "```",
        "ghci> bothOn \"Ada\" \"Dan\" plan",
        "Just (12,3)",
        "ghci> bothOn \"Ada\" \"Zed\" plan",
        "Nothing",
        "```",
      ),
      starter: hs`bothOn :: Guest -> Guest -> Plan -> Maybe (Seat, Seat)
bothOn a b p = undefined
`,
      tests: [
        { expr: "bothOn \"Ada\" \"Dan\" plan", expected: "Just (12, 3)" },
        { expr: "bothOn \"Ada\" \"Zed\" plan", expected: "Nothing", label: "second missing" },
        { expr: "bothOn \"Zed\" \"Ada\" plan", expected: "Nothing" },
        { expr: "bothOn \"Ben\" \"Cara\" plan", expected: "Just (7, 12)" },
      ],
      hint: "Two nested `case`s on `lookup a p` and `lookup b p`.",
      solution: hs`bothOn :: Guest -> Guest -> Plan -> Maybe (Seat, Seat)
bothOn a b p =
  case lookup a p of
    Nothing -> Nothing
    Just s ->
      case lookup b p of
        Nothing -> Nothing
        Just t  -> Just (s, t)
`,
      banned: [">>=", ">>", "<$>"],
    },
    {
      k: "write",
      body: md(
        "Define `waitHead :: [String] -> Maybe String`, the first name on a waitlist, or `Nothing` if the list is empty. Do not use `head`. For example:",
        "",
        "```",
        "ghci> waitHead [\"ada\", \"ben\"]",
        "Just \"ada\"",
        "ghci> waitHead []",
        "Nothing",
        "```",
      ),
      starter: hs`waitHead :: [String] -> Maybe String
waitHead xs = undefined
`,
      tests: [
        { expr: "waitHead [\"ada\", \"ben\"]", expected: "Just \"ada\"" },
        { expr: "waitHead []", expected: "Nothing", label: "empty waitlist" },
        { expr: "waitHead [\"zed\"]", expected: "Just \"zed\"" },
        { expr: "waitHead [\"\", \"x\"]", expected: "Just \"\"" },
      ],
      hint: "`waitHead [] = Nothing` and `waitHead (x : _) = Just x`.",
      solution: hs`waitHead :: [String] -> Maybe String
waitHead [] = Nothing
waitHead (x : _) = Just x
`,
      banned: ["head"],
    },
    {
      k: "write",
      body: md(
        "Define `codeOf :: String -> [(String, Int)] -> Int`. Return the code from the table, or `-1` if the name is missing. For example:",
        "",
        "```",
        "ghci> codeOf \"ok\" [(\"ok\", 200), (\"no\", 404)]",
        "200",
        "ghci> codeOf \"zzz\" [(\"ok\", 200)]",
        "-1",
        "```",
      ),
      setup: fromMaybeImp,
      starter: hs`codeOf :: String -> [(String, Int)] -> Int
codeOf name table = undefined
`,
      tests: [
        { expr: "codeOf \"ok\" [(\"ok\", 200), (\"no\", 404)]", expected: "200" },
        { expr: "codeOf \"zzz\" [(\"ok\", 200)]", expected: "-1", label: "missing name" },
        { expr: "codeOf \"no\" [(\"ok\", 200), (\"no\", 404)]", expected: "404" },
        { expr: "codeOf \"ok\" []", expected: "-1" },
      ],
      hint: "`fromMaybe (-1) (lookup name table)`.",
      solution: hs`codeOf :: String -> [(String, Int)] -> Int
codeOf name table = fromMaybe (-1) (lookup name table)
`,
    },
    {
      k: "write",
      body: md(
        "Define `shiftBy :: Int -> Maybe Int -> Maybe Int`. If the Maybe is `Just n`, add the shift. If it is `Nothing`, stay `Nothing`. For example:",
        "",
        "```",
        "ghci> shiftBy 5 (Just 10)",
        "Just 15",
        "ghci> shiftBy 5 Nothing",
        "Nothing",
        "```",
      ),
      starter: hs`shiftBy :: Int -> Maybe Int -> Maybe Int
shiftBy k m = undefined
`,
      tests: [
        { expr: "shiftBy 5 (Just 10)", expected: "Just 15" },
        { expr: "shiftBy 5 Nothing", expected: "Nothing", label: "Nothing stays Nothing" },
        { expr: "shiftBy 0 (Just 3)", expected: "Just 3" },
        { expr: "shiftBy (-2) (Just 1)", expected: "Just (-1)" },
      ],
      hint: "`shiftBy _ Nothing = Nothing` and `shiftBy k (Just n) = Just (n + k)`.",
      solution: hs`shiftBy :: Int -> Maybe Int -> Maybe Int
shiftBy _ Nothing = Nothing
shiftBy k (Just n) = Just (n + k)
`,
    },
    {
      k: "write",
      body: md(
        "A carriage has window seats and aisle seats. Define `preferSeat :: Maybe Int -> Maybe Int -> Maybe Int` that takes the window seat if it is a `Just`, otherwise the aisle seat. If both are `Nothing`, the result is `Nothing`. For example:",
        "",
        "```",
        "ghci> preferSeat (Just 11) (Just 12)",
        "Just 11",
        "ghci> preferSeat Nothing (Just 12)",
        "Just 12",
        "```",
      ),
      starter: hs`preferSeat :: Maybe Int -> Maybe Int -> Maybe Int
preferSeat window aisle = undefined
`,
      tests: [
        { expr: "preferSeat (Just 11) (Just 12)", expected: "Just 11" },
        { expr: "preferSeat Nothing (Just 12)", expected: "Just 12", label: "fall back to aisle" },
        { expr: "preferSeat (Just 11) Nothing", expected: "Just 11" },
        { expr: "preferSeat Nothing Nothing", expected: "Nothing" },
      ],
      hint: "`preferSeat (Just w) _ = Just w` and `preferSeat Nothing a = a`.",
      solution: hs`preferSeat :: Maybe Int -> Maybe Int -> Maybe Int
preferSeat (Just w) _ = Just w
preferSeat Nothing a = a
`,
    },
    {
      k: "write",
      setup: hs`import Data.Maybe (mapMaybe)
`,
      body: md(
        "Marks are stored as `Maybe Int`, where `Nothing` means 'absent'. Define `keepMarks :: [Maybe Int] -> [Int]` that keeps the sitting scores, dropping absences. Use `mapMaybe`. For example:",
        "",
        "```",
        "ghci> keepMarks [Just 70, Nothing, Just 45]",
        "[70,45]",
        "```",
      ),
      starter: hs`keepMarks :: [Maybe Int] -> [Int]
keepMarks ms = undefined
`,
      tests: [
        { expr: "keepMarks [Just 70, Nothing, Just 45]", expected: "[70, 45]" },
        { expr: "keepMarks [Nothing, Nothing]", expected: "[]", label: "all absent" },
        { expr: "keepMarks []", expected: "[]" },
        { expr: "keepMarks [Just 0]", expected: "[0]" },
      ],
      hint: "`mapMaybe id ms`, or `catMaybes`.",
      solution: hs`keepMarks :: [Maybe Int] -> [Int]
keepMarks ms = mapMaybe id ms
`,
    },
    {
      k: "write",
      body: md(
        "A module is recorded only if every student sat the exam. Marks are `Maybe Int`, and `Nothing` means absent. Define `allSat :: [Maybe Int] -> Maybe [Int]` that returns `Just` the list of marks when every student sat, and `Nothing` if anyone is absent. An empty list is `Just []`. Do not use `sequence` or `mapM`. For example:",
        "",
        "```",
        "ghci> allSat [Just 70, Just 45]",
        "Just [70,45]",
        "ghci> allSat [Just 70, Nothing]",
        "Nothing",
        "```",
      ),
      starter: hs`allSat :: [Maybe Int] -> Maybe [Int]
allSat ms = undefined
`,
      tests: [
        { expr: "allSat [Just 70, Just 45]", expected: "Just [70, 45]" },
        { expr: "allSat [Just 70, Nothing]", expected: "Nothing", label: "one absence" },
        { expr: "allSat []", expected: "Just []" },
        { expr: "allSat [Nothing]", expected: "Nothing" },
        { expr: "allSat [Just 0, Just 100]", expected: "Just [0, 100]" },
      ],
      hint: "`allSat [] = Just []`. A `Nothing` at the front fails. For `Just n`, recurse and cons `n` onto the rest if that succeeds.",
      solution: hs`allSat :: [Maybe Int] -> Maybe [Int]
allSat [] = Just []
allSat (Nothing : _) = Nothing
allSat (Just n : ms) =
  case allSat ms of
    Nothing -> Nothing
    Just ns -> Just (n : ns)
`,
      banned: ["sequence", "mapM", "sequenceA"],
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Expressions are",
        "",
        "```",
        "data Expr = Lit Int | Var String | Plus Expr Expr | Quot Expr Expr",
        "```",
        "",
        "Define `evalExpr :: [(String, Int)] -> Expr -> Maybe Int`. A variable is looked up in the environment. `Quot` is integer division and fails if the divisor is 0. If any part fails, the whole answer is `Nothing`. Use `case`, not `do`. For example:",
        "",
        "```",
        "ghci> evalExpr [(\"x\", 4)] (Plus (Var \"x\") (Lit 1))",
        "Just 5",
        "ghci> evalExpr [] (Quot (Lit 7) (Lit 0))",
        "Nothing",
        "```",
      ),
      starter: hs`evalExpr :: [(String, Int)] -> Expr -> Maybe Int
evalExpr env e = undefined
`,
      tests: [
        { expr: "evalExpr [(\"x\", 4)] (Plus (Var \"x\") (Lit 1))", expected: "Just 5" },
        { expr: "evalExpr [] (Var \"x\")", expected: "Nothing", label: "missing variable" },
        { expr: "evalExpr [] (Quot (Lit 7) (Lit 2))", expected: "Just 3" },
        { expr: "evalExpr [] (Quot (Lit 7) (Lit 0))", expected: "Nothing", label: "divide by zero" },
        { expr: "evalExpr [(\"y\", 0)] (Plus (Lit 1) (Quot (Lit 5) (Var \"y\")))", expected: "Nothing" },
        { expr: "evalExpr [] (Plus (Var \"a\") (Lit 1))", expected: "Nothing" },
      ],
      hint: "`Var v` is `lookup v env`. For `Plus` and `Quot`, two nested `case`s. For `Quot`, after both succeed, check the divisor is not 0, then `div x y`.",
      solution: hs`evalExpr :: [(String, Int)] -> Expr -> Maybe Int
evalExpr _ (Lit n) = Just n
evalExpr env (Var v) = lookup v env
evalExpr env (Plus a b) =
  case evalExpr env a of
    Nothing -> Nothing
    Just x ->
      case evalExpr env b of
        Nothing -> Nothing
        Just y  -> Just (x + y)
evalExpr env (Quot a b) =
  case evalExpr env a of
    Nothing -> Nothing
    Just x ->
      case evalExpr env b of
        Nothing -> Nothing
        Just y  -> if y == 0 then Nothing else Just (div x y)
`,
      banned: [">>=", ">>", "do"],
    },
    {
      k: "write",
      body: md(
        "A registration form has a name, an age string, and a three-letter code. Define `parseForm :: String -> String -> String -> Maybe (String, Int, String)` that succeeds only when:",
        "",
        "- the name is non-empty;",
        "- the age is a non-empty string of digits;",
        "- the code has length 3 and every character is `'A'`..`'Z'`.",
        "",
        "Otherwise the result is `Nothing`. Use `case` on three small helpers so a failure in any field fails the whole form. For example:",
        "",
        "```",
        "ghci> parseForm \"Ada\" \"19\" \"ABC\"",
        "Just (\"Ada\",19,\"ABC\")",
        "ghci> parseForm \"\" \"19\" \"ABC\"",
        "Nothing",
        "```",
      ),
      starter: hs`parseForm :: String -> String -> String -> Maybe (String, Int, String)
parseForm name age code = undefined
`,
      tests: [
        { expr: "parseForm \"Ada\" \"19\" \"ABC\"", expected: "Just (\"Ada\", 19, \"ABC\")" },
        { expr: "parseForm \"\" \"19\" \"ABC\"", expected: "Nothing", label: "empty name" },
        { expr: "parseForm \"Ada\" \"1x\" \"ABC\"", expected: "Nothing", label: "bad age" },
        { expr: "parseForm \"Ada\" \"\" \"ABC\"", expected: "Nothing" },
        { expr: "parseForm \"Ada\" \"19\" \"abc\"", expected: "Nothing", label: "lowercase code" },
        { expr: "parseForm \"Ada\" \"19\" \"AB\"", expected: "Nothing" },
      ],
      hint: "Helpers returning Maybe, then three nested `case`s. Age: non-empty digits, then `read`. Code: `length code == 3` and each char in `'A'`..`'Z'`.",
      solution: hs`parseForm :: String -> String -> String -> Maybe (String, Int, String)
parseForm name age code =
  case nameOk name of
    Nothing -> Nothing
    Just n ->
      case ageOk age of
        Nothing -> Nothing
        Just a ->
          case codeOk code of
            Nothing -> Nothing
            Just c  -> Just (n, a, c)
  where
    nameOk s
      | null s    = Nothing
      | otherwise = Just s
    ageOk s
      | not (null s) && all (\ch -> ch >= '0' && ch <= '9') s = Just (read s)
      | otherwise = Nothing
    codeOk s
      | length s == 3 && all (\ch -> ch >= 'A' && ch <= 'Z') s = Just s
      | otherwise = Nothing
`,
    },
    {
      k: "write",
      setup: entrySetup,
      body: md(
        "A directory tree is",
        "",
        "```",
        "data Entry = File String | Folder String [Entry]",
        "```",
        "",
        "Define `findPath :: [String] -> Entry -> Maybe String`. Starting from the given folder, follow the path of names. Every name except the last must name a folder. The last name must name a file; then return that file's name. Any missing step, or a file in the middle, or a folder at the end, is `Nothing`. For example (with the given `root`):",
        "",
        "```",
        "ghci> findPath [\"src\", \"Main.hs\"] root",
        "Just \"Main.hs\"",
        "ghci> findPath [\"src\"] root",
        "Nothing",
        "```",
      ),
      starter: hs`findPath :: [String] -> Entry -> Maybe String
findPath path entry = undefined
`,
      tests: [
        { expr: "findPath [\"src\", \"Main.hs\"] root", expected: "Just \"Main.hs\"" },
        { expr: "findPath [\"src\", \"Lib\", \"Util.hs\"] root", expected: "Just \"Util.hs\"" },
        { expr: "findPath [\"README\"] root", expected: "Just \"README\"" },
        { expr: "findPath [\"src\"] root", expected: "Nothing", label: "folder at the end" },
        { expr: "findPath [\"src\", \"Nope\"] root", expected: "Nothing" },
        { expr: "findPath [\"README\", \"x\"] root", expected: "Nothing", label: "file in the middle" },
      ],
      hint: "Write a helper that finds a named child. One-element path: that child must be a `File`. Longer path: that child must be a `Folder`, then recurse.",
      solution: hs`findPath :: [String] -> Entry -> Maybe String
findPath [n] (Folder _ kids) =
  case child n kids of
    Just (File f) -> Just f
    _             -> Nothing
findPath (n : ns) (Folder _ kids) =
  case child n kids of
    Just d@(Folder _ _) -> findPath ns d
    _                   -> Nothing
findPath _ _ = Nothing

child :: String -> [Entry] -> Maybe Entry
child _ [] = Nothing
child n (File f : es)
  | n == f    = Just (File f)
  | otherwise = child n es
child n (Folder f kids : es)
  | n == f    = Just (Folder f kids)
  | otherwise = child n es
`,
    },
    {
      k: "write",
      setup: termSetup,
      body: md(
        "Terms are",
        "",
        "```",
        "data Term = N Int | Add Term Term | Neg Term",
        "```",
        "",
        "Define `rewriteStep :: Term -> Maybe Term`, one rewrite at the leftmost place that matches, using these rules in this order:",
        "",
        "1. `Neg (Neg e)` becomes `e`.",
        "2. `Add (N 0) e` becomes `e`.",
        "3. `Add e (N 0)` becomes `e`.",
        "4. Otherwise try to rewrite inside `Neg` or inside the left, then right, of `Add`.",
        "",
        "If no rule applies anywhere, the result is `Nothing`. For example:",
        "",
        "```",
        "ghci> rewriteStep (Neg (Neg (N 3)))",
        "Just (N 3)",
        "ghci> rewriteStep (N 3)",
        "Nothing",
        "```",
      ),
      starter: hs`rewriteStep :: Term -> Maybe Term
rewriteStep t = undefined
`,
      tests: [
        { expr: "rewriteStep (Neg (Neg (N 3)))", expected: "Just (N 3)" },
        { expr: "rewriteStep (Add (N 0) (N 4))", expected: "Just (N 4)" },
        { expr: "rewriteStep (Add (N 4) (N 0))", expected: "Just (N 4)" },
        { expr: "rewriteStep (Neg (Add (N 0) (N 2)))", expected: "Just (Neg (N 2))" },
        { expr: "rewriteStep (N 3)", expected: "Nothing", label: "no rule" },
        { expr: "rewriteStep (Add (N 1) (N 2))", expected: "Nothing" },
      ],
      hint: "Put the three root rules first. Then `Neg e`: `case rewriteStep e of { Just e' -> Just (Neg e'); Nothing -> Nothing }`. For `Add`, try the left subterm, then the right.",
      solution: hs`rewriteStep :: Term -> Maybe Term
rewriteStep (Neg (Neg e)) = Just e
rewriteStep (Add (N 0) e) = Just e
rewriteStep (Add e (N 0)) = Just e
rewriteStep (Neg e) =
  case rewriteStep e of
    Nothing -> Nothing
    Just e' -> Just (Neg e')
rewriteStep (Add a b) =
  case rewriteStep a of
    Just a' -> Just (Add a' b)
    Nothing ->
      case rewriteStep b of
        Just b' -> Just (Add a b')
        Nothing -> Nothing
rewriteStep _ = Nothing
`,
    },
    {
      k: "write",
      body: md(
        "A robot lives on an `n` by `n` grid. Positions are `(x, y)` with `0 <= x < n` and `0 <= y < n`. Moves are characters `'N'`, `'S'`, `'E'`, `'W'` (north increases `y`). Define `runMoves :: Int -> (Int, Int) -> String -> Maybe (Int, Int)` that applies every move in order. If any move would leave the board, or is not one of the four letters, the whole result is `Nothing`. An empty move string succeeds with the start position. For example:",
        "",
        "```",
        "ghci> runMoves 3 (0, 0) \"EEN\"",
        "Just (2,1)",
        "ghci> runMoves 3 (0, 0) \"W\"",
        "Nothing",
        "```",
      ),
      starter: hs`runMoves :: Int -> (Int, Int) -> String -> Maybe (Int, Int)
runMoves n start moves = undefined
`,
      tests: [
        { expr: "runMoves 3 (0, 0) \"EEN\"", expected: "Just (2, 1)" },
        { expr: "runMoves 3 (0, 0) \"W\"", expected: "Nothing", label: "off the board" },
        { expr: "runMoves 3 (0, 0) \"\"", expected: "Just (0, 0)" },
        { expr: "runMoves 3 (2, 2) \"N\"", expected: "Nothing" },
        { expr: "runMoves 3 (0, 0) \"EEW\"", expected: "Just (1, 0)" },
        { expr: "runMoves 2 (0, 0) \"X\"", expected: "Nothing", label: "bad letter" },
      ],
      hint: "Write `step` that returns `Maybe` the next position. Then recurse on the string: fail if `step` fails.",
      solution: hs`runMoves :: Int -> (Int, Int) -> String -> Maybe (Int, Int)
runMoves _ p [] = Just p
runMoves n p (c : cs) =
  case step n p c of
    Nothing -> Nothing
    Just p' -> runMoves n p' cs

step :: Int -> (Int, Int) -> Char -> Maybe (Int, Int)
step n (x, y) 'N'
  | y + 1 < n = Just (x, y + 1)
step n (x, y) 'S'
  | y > 0 = Just (x, y - 1)
step n (x, y) 'E'
  | x + 1 < n = Just (x + 1, y)
step n (x, y) 'W'
  | x > 0 = Just (x - 1, y)
step _ _ _ = Nothing
`,
    },
    {
      k: "write",
      body: md(
        "Define `parseAmount :: String -> Maybe Int`. Try these alternatives in order:",
        "",
        "1. If the string starts with `\"0b\"` and the rest is a non-empty run of `'0'` and `'1'`, parse it as binary.",
        "2. Else if it starts with `\"0x\"` and the rest is a non-empty run of decimal digits or `'a'`..`'f'`, parse it as hexadecimal.",
        "3. Else if the whole string is a non-empty run of decimal digits, parse it as decimal.",
        "4. Otherwise `Nothing`.",
        "",
        "For example:",
        "",
        "```",
        "ghci> parseAmount \"0b101\"",
        "Just 5",
        "ghci> parseAmount \"0x10\"",
        "Just 16",
        "ghci> parseAmount \"0b\"",
        "Nothing",
        "```",
      ),
      starter: hs`parseAmount :: String -> Maybe Int
parseAmount s = undefined
`,
      tests: [
        { expr: "parseAmount \"0b101\"", expected: "Just 5" },
        { expr: "parseAmount \"0x10\"", expected: "Just 16" },
        { expr: "parseAmount \"0xa\"", expected: "Just 10" },
        { expr: "parseAmount \"42\"", expected: "Just 42" },
        { expr: "parseAmount \"0b\"", expected: "Nothing", label: "empty payload" },
        { expr: "parseAmount \"0xG\"", expected: "Nothing" },
        { expr: "parseAmount \"\"", expected: "Nothing" },
      ],
      hint: "Pattern match on `'0':'b':rest` and `'0':'x':rest`. Write small `fromBin` / `fromHex` / `fromDec` helpers with `foldl`.",
      solution: hs`parseAmount :: String -> Maybe Int
parseAmount ('0' : 'b' : rest)
  | not (null rest) && all isBit rest = Just (fromBin rest)
  | otherwise = Nothing
parseAmount ('0' : 'x' : rest)
  | not (null rest) && all isHex rest = Just (fromHex rest)
  | otherwise = Nothing
parseAmount s
  | not (null s) && all isDig s = Just (fromDec s)
  | otherwise = Nothing

isBit c = c == '0' || c == '1'
isDig c = c >= '0' && c <= '9'
isHex c = isDig c || (c >= 'a' && c <= 'f')

fromBin = foldl (\n c -> n * 2 + (if c == '1' then 1 else 0)) 0
fromDec = foldl (\n c -> n * 10 + (fromEnum c - fromEnum '0')) 0
fromHex = foldl (\n c -> n * 16 + hexVal c) 0
hexVal c
  | isDig c   = fromEnum c - fromEnum '0'
  | otherwise = fromEnum c - fromEnum 'a' + 10
`,
    },
    {
      k: "write",
      setup: roomsSetup,
      body: md(
        "Rooms hold named objects. There is also a default room called `\"*\"`. Define `describeIn :: Room -> Object -> Rooms -> Maybe Desc`. Look in the named room first. If that room is missing, or the object is not in it, try the default room. If the object is in neither, `Nothing`. For example:",
        "",
        "```",
        "ghci> describeIn \"kitchen\" \"cup\" rooms",
        "Just \"blue mug\"",
        "ghci> describeIn \"kitchen\" \"lamp\" rooms",
        "Just \"on\"",
        "ghci> describeIn \"attic\" \"mat\" rooms",
        "Nothing",
        "```",
      ),
      starter: hs`describeIn :: Room -> Object -> Rooms -> Maybe Desc
describeIn room obj book = undefined
`,
      tests: [
        { expr: "describeIn \"kitchen\" \"cup\" rooms", expected: "Just \"blue mug\"" },
        { expr: "describeIn \"kitchen\" \"lamp\" rooms", expected: "Just \"on\"", label: "falls back to *" },
        { expr: "describeIn \"attic\" \"mat\" rooms", expected: "Nothing", label: "not in * either" },
        { expr: "describeIn \"hall\" \"mat\" rooms", expected: "Just \"red\"" },
        { expr: "describeIn \"attic\" \"cup\" rooms", expected: "Just \"plain cup\"" },
        { expr: "describeIn \"kitchen\" \"tap\" rooms", expected: "Just \"drips\"" },
      ],
      hint: "Look up the room. If you get a table, `lookup obj` there; on `Nothing`, look in `\"*\"`. If the room itself is missing, go straight to `\"*\"`.",
      solution: hs`describeIn :: Room -> Object -> Rooms -> Maybe Desc
describeIn room obj book =
  case lookup room book of
    Just stuff ->
      case lookup obj stuff of
        Just d  -> Just d
        Nothing -> fallback
    Nothing -> fallback
  where
    fallback =
      case lookup "*" book of
        Nothing -> Nothing
        Just defs -> lookup obj defs
`,
    },
    {
      k: "write",
      setup: cmdSetup,
      body: md(
        "A tiny store language has commands",
        "",
        "```",
        "data Cmd = Set String Int | AddTo String Int | Copy String String",
        "```",
        "",
        "The store is an association list `[(String, Int)]`. Define `runCmds :: [(String, Int)] -> [Cmd] -> Maybe [(String, Int)]`:",
        "",
        "- `Set k n` writes `n` at `k` (adding or replacing) and always succeeds.",
        "- `AddTo k n` adds `n` to the current value of `k`; missing `k` is `Nothing`.",
        "- `Copy from to` copies the value of `from` to `to`; missing `from` is `Nothing`.",
        "",
        "Commands run in order. If any command fails, the whole run is `Nothing`. An empty command list succeeds with the starting store. For example:",
        "",
        "```",
        "ghci> runCmds [] [Set \"x\" 1, AddTo \"x\" 4]",
        "Just [(\"x\",5)]",
        "ghci> runCmds [] [AddTo \"x\" 1]",
        "Nothing",
        "```",
      ),
      starter: hs`runCmds :: [(String, Int)] -> [Cmd] -> Maybe [(String, Int)]
runCmds st cs = undefined
`,
      tests: [
        { expr: "runCmds [] [Set \"x\" 1, AddTo \"x\" 4]", expected: "Just [(\"x\", 5)]" },
        { expr: "runCmds [] [AddTo \"x\" 1]", expected: "Nothing", label: "AddTo missing key" },
        { expr: "runCmds [] [Set \"x\" 1, Set \"y\" 2, Copy \"x\" \"z\"]", expected: "Just [(\"x\", 1), (\"y\", 2), (\"z\", 1)]" },
        { expr: "runCmds [] [Copy \"x\" \"y\"]", expected: "Nothing" },
        { expr: "runCmds [] []", expected: "Just []" },
        { expr: "runCmds [(\"a\", 3)] [AddTo \"a\" (-1)]", expected: "Just [(\"a\", 2)]" },
      ],
      hint: "A helper `put` replaces or appends a key. `runOne` returns `Maybe` the new store. Then recurse on the command list.",
      solution: hs`runCmds :: [(String, Int)] -> [Cmd] -> Maybe [(String, Int)]
runCmds st [] = Just st
runCmds st (c : cs) =
  case runOne st c of
    Nothing  -> Nothing
    Just st' -> runCmds st' cs

runOne :: [(String, Int)] -> Cmd -> Maybe [(String, Int)]
runOne st (Set k n) = Just (put k n st)
runOne st (AddTo k n) =
  case lookup k st of
    Nothing -> Nothing
    Just v  -> Just (put k (v + n) st)
runOne st (Copy from to) =
  case lookup from st of
    Nothing -> Nothing
    Just v  -> Just (put to v st)

put :: String -> Int -> [(String, Int)] -> [(String, Int)]
put k n [] = [(k, n)]
put k n ((k', v) : rest)
  | k == k'   = (k, n) : rest
  | otherwise = (k', v) : put k n rest
`,
    },
  ],
};

export const book: Book = {
  id: "b-maybe",
  order: 8,
  title: "Maybe, failure and alternatives",
  blurb: "Maybe as answer-or-nothing: Just and Nothing, fromMaybe, maybe, lookup, case-of chaining, mapMaybe, first success, all-or-nothing, and tiny failing parsers.",
  sets: [level1, level2, level3, level4],
};

