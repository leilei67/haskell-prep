import { type Book, type DrillSet, hs, md } from "../schema.ts";

type Level = Book["sets"][number];

const libs = hs`import Data.Maybe (fromMaybe, mapMaybe)
import Data.List (nub, sort)
`;

const exprSetup = hs`data Expr = Num Int | Var String | Add Expr Expr | Mul Expr Expr
  deriving (Eq, Show)
`;

const kitchenSetup =
  libs +
  hs`
type Item   = String
type Stock  = [(Item, Int)]
type Recipe = [(Item, Int)]

pantry :: Stock
pantry = [("flour", 500), ("egg", 6), ("milk", 300), ("sugar", 0)]

pancakes :: Recipe
pancakes = [("flour", 200), ("egg", 2), ("milk", 300)]

cake :: Recipe
cake = [("flour", 250), ("egg", 4), ("sugar", 200), ("butter", 100)]
`;

const librarySetup =
  libs +
  hs`
type Member    = String
type ISBN      = Int
type Catalogue = [(ISBN, String)]
type Loans     = [(Member, [ISBN])]

catalogue :: Catalogue
catalogue = [(101, "Dune"), (102, "Emma"), (103, "Ulysses"), (104, "Beloved")]

loans :: Loans
loans = [("ann", [101, 103]), ("raj", [102]), ("li", [])]
`;

const trainSetup =
  libs +
  hs`
type Station   = String
type Timetable = [(Station, [(Station, Int)])]

net :: Timetable
net = [ ("Ayr",        [("Troon", 10)])
      , ("Troon",      [("Ayr", 10), ("Irvine", 8)])
      , ("Irvine",     [("Kilwinning", 6)])
      , ("Kilwinning", [("Glasgow", 30), ("Largs", 25)])
      , ("Largs",      [])
      ]
`;

const trainBlock = [
  "```",
  "type Station   = String",
  "type Timetable = [(Station, [(Station, Int)])]",
  "",
  "net :: Timetable",
  "net = [ (\"Ayr\",        [(\"Troon\", 10)])",
  "      , (\"Troon\",      [(\"Ayr\", 10), (\"Irvine\", 8)])",
  "      , (\"Irvine\",     [(\"Kilwinning\", 6)])",
  "      , (\"Kilwinning\", [(\"Glasgow\", 30), (\"Largs\", 25)])",
  "      , (\"Largs\",      [])",
  "      ]",
  "```",
];

// ---------------------------------------------------------------------------
// Level 1: Warm-up
// ---------------------------------------------------------------------------

const level1: Level = {
  id: "b-tables-l1",
  lesson: "",
  level: 1,
  title: "Level 1: Warm-up",
  intro: md(
    "A lookup table (an association list) is just a list of pairs `[(key, value)]`. This level practises reading one: `lookup`, pulling out keys and values, and list comprehensions that take each pair apart.",
    "",
    "```",
    "prices = [(\"tea\", 120), (\"cake\", 250)]",
    "lookup \"cake\" prices     -- Just 250",
    "[k | (k, v) <- prices]   -- [\"tea\",\"cake\"]",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: "What is the type of the built-in `lookup`?",
      options: [
        "`Eq a => a -> [(a, b)] -> b`",
        "`Eq a => a -> [(a, b)] -> Maybe b`",
        "`a -> [(a, b)] -> [b]`",
        "`Eq a => [(a, b)] -> a -> Maybe b`",
      ],
      answer: 1,
      why: "The key comes first, then the table. The answer is wrapped in `Maybe` because the key might not be there: `Nothing` means missing, `Just v` means found. `Eq a` is needed because `lookup` compares keys with `==`.",
    },
    {
      k: "predict",
      expr: "lookup 2 [(1, \"one\"), (2, \"two\"), (3, \"three\")]",
      answer: "Just \"two\"",
      why: "Key 2 is in the table, so `lookup` gives its value wrapped in `Just`.",
    },
    {
      k: "predict",
      expr: "lookup 'z' [('a', 1), ('b', 2)]",
      answer: "Nothing",
      why: "No pair has the key `'z'`, so the answer is `Nothing`. It is not an error.",
    },
    {
      k: "predict",
      expr: "lookup \"tea\" [(\"tea\", 2), (\"cake\", 3), (\"tea\", 5)]",
      answer: "Just 2",
      why: "`lookup` stops at the first pair with a matching key. The later `(\"tea\", 5)` is never seen.",
    },
    {
      k: "predict",
      expr: "fromMaybe 0 (lookup \"pen\" [(\"ink\", 4)])",
      answer: "0",
      why: "`lookup` gives `Nothing`, and `fromMaybe 0` turns `Nothing` into the default `0`. If it had found `Just 4` it would give `4`.",
    },
    {
      k: "quiz",
      q: "`table` has type `[(String, Int)]`. Which expression gives the list of all its keys?",
      options: ["`map fst table`", "`map snd table`", "`fst table`", "`[k | k <- table]`"],
      answer: 0,
      why: "`fst` takes the first part of one pair, and `map` does it to every pair. `fst table` is a type error: `table` is a list, not a pair. `[k | k <- table]` just gives back the pairs.",
    },
    {
      k: "predict",
      expr: "[name | (name, age) <- [(\"Ann\", 12), (\"Bob\", 9), (\"Cy\", 15)], age > 10]",
      answer: "[\"Ann\", \"Cy\"]",
      why: "The pattern `(name, age)` takes each pair apart. Only the pairs with `age > 10` are kept, and we output just the name.",
    },
    {
      k: "write",
      body: "Write `keys`, which gives every key in the table, in order. Fill in the hole in the list comprehension.",
      starter: hs`keys :: [(String, Int)] -> [String]
keys table = [ undefined | (k, v) <- table ]
`,
      tests: [
        { expr: 'keys [("a", 1), ("b", 2)]', expected: '["a", "b"]' },
        { expr: 'keys [("x", 5)]', expected: '["x"]' },
        { expr: "keys []", expected: "[]" },
        { expr: 'keys [("a", 1), ("a", 2)]', expected: '["a", "a"]', label: "duplicate keys are both listed" },
      ],
      hint: "Each pair is taken apart as `(k, v)`. You want the `k`.",
      solution: hs`keys :: [(String, Int)] -> [String]
keys table = [ k | (k, v) <- table ]
`,
    },
    {
      k: "write",
      body: "A table maps player names to scores. Write `namesOver n table`, which gives the names of players whose score is strictly greater than `n`. Fill in the condition.",
      starter: hs`namesOver :: Int -> [(String, Int)] -> [String]
namesOver n table = [ k | (k, v) <- table, undefined ]
`,
      tests: [
        { expr: 'namesOver 10 [("ann", 12), ("bob", 9), ("cy", 15)]', expected: '["ann", "cy"]' },
        { expr: 'namesOver 10 [("dee", 10)]', expected: "[]", label: "exactly n is not over" },
        { expr: 'namesOver 0 [("eve", -3), ("fay", 1)]', expected: '["fay"]' },
        { expr: "namesOver 5 []", expected: "[]" },
      ],
      hint: "The condition is a Bool about the score `v`: `v > n`.",
      solution: hs`namesOver :: Int -> [(String, Int)] -> [String]
namesOver n table = [ k | (k, v) <- table, v > n ]
`,
    },
    {
      k: "write",
      body: md(
        "A café keeps prices in pence. Write `priceOf item prices`. If the item isn't on the menu, it costs `0`.",
        "",
        "Fill in the two holes: the default, and the key to look up.",
      ),
      setup: libs,
      starter: hs`priceOf :: String -> [(String, Int)] -> Int
priceOf item prices = fromMaybe undefined (lookup undefined prices)
`,
      tests: [
        { expr: 'priceOf "tea" [("tea", 120), ("cake", 250)]', expected: "120" },
        { expr: 'priceOf "cake" [("tea", 120), ("cake", 250)]', expected: "250" },
        { expr: 'priceOf "soup" [("tea", 120)]', expected: "0", label: "missing item costs 0" },
        { expr: 'priceOf "tea" []', expected: "0" },
      ],
      hint: "`fromMaybe 0 (lookup item prices)`.",
      solution: hs`priceOf :: String -> [(String, Int)] -> Int
priceOf item prices = fromMaybe 0 (lookup item prices)
`,
    },
    {
      k: "write",
      body: "Write `hasKey k table`, which is `True` when `k` is one of the keys. `elem` searches a list made by `map`: fill in the function that picks out the key of each pair.",
      starter: hs`hasKey :: String -> [(String, Int)] -> Bool
hasKey k table = elem k (map undefined table)
`,
      tests: [
        { expr: 'hasKey "b" [("a", 1), ("b", 2)]', expected: "True" },
        { expr: 'hasKey "c" [("a", 1), ("b", 2)]', expected: "False" },
        { expr: 'hasKey "a" []', expected: "False" },
        { expr: 'hasKey "2" [("a", 2)]', expected: "False", label: "values don't count" },
      ],
      hint: "`fst` gives the first part of a pair, so `map fst table` is the list of keys.",
      solution: hs`hasKey :: String -> [(String, Int)] -> Bool
hasKey k table = elem k (map fst table)
`,
    },
    {
      k: "predict",
      expr: "[(v, k) | (k, v) <- [(\"a\", 1), (\"b\", 2)]]",
      answer: "[(1, \"a\"), (2, \"b\")]",
      why: "Each pair is taken apart as `(k, v)` and put back together the other way round. This flips a table so you can look up by value.",
    },
    {
      k: "write",
      body: "Write `swapAll`, which flips every pair so values become keys. Fill in the output of the comprehension.",
      starter: hs`swapAll :: [(String, Int)] -> [(Int, String)]
swapAll table = [ undefined | (k, v) <- table ]
`,
      tests: [
        { expr: 'swapAll [("a", 1), ("b", 2)]', expected: '[(1, "a"), (2, "b")]' },
        { expr: "swapAll []", expected: "[]" },
        { expr: 'swapAll [("x", 7), ("y", 7)]', expected: '[(7, "x"), (7, "y")]' },
        { expr: 'lookup 2 (swapAll [("a", 1), ("b", 2)])', expected: 'Just "b"', label: "reverse lookup by value" },
      ],
      hint: "Output the pair `(v, k)`.",
      solution: hs`swapAll :: [(String, Int)] -> [(Int, String)]
swapAll table = [ (v, k) | (k, v) <- table ]
`,
    },
    {
      k: "quiz",
      q: md(
        "Many exam papers give you this helper. What does `lookUp \"z\" [(\"a\", 1)]` do?",
        "",
        "```",
        "lookUp :: String -> [(String, Int)] -> Int",
        "lookUp k t = fromJust (lookup k t)",
        "```",
      ),
      options: ["It returns `0`", "It returns `Nothing`", "It crashes with an error at run time", "It fails to compile"],
      answer: 2,
      why: "`lookup` gives `Nothing`, and `fromJust Nothing` is an error. That's why exam specs say \"you may assume the key is in the table\": it's a precondition. When the key might be missing, use `case` or `fromMaybe` instead.",
    },
    {
      k: "write",
      body: md(
        "Write `valueOf k t`, which gives the value paired with `k`. You may assume `k` is in the table.",
        "",
        "Fill in the condition: we keep the values whose key matches, then take the first.",
      ),
      starter: hs`valueOf :: String -> [(String, Int)] -> Int
valueOf k t = head [ v | (k', v) <- t, undefined ]
`,
      tests: [
        { expr: 'valueOf "b" [("a", 1), ("b", 2)]', expected: "2" },
        { expr: 'valueOf "a" [("a", 1), ("b", 2)]', expected: "1" },
        { expr: 'valueOf "x" [("x", -4)]', expected: "-4" },
        { expr: 'valueOf "a" [("a", 1), ("a", 9)]', expected: "1", label: "first match wins" },
      ],
      hint: "`k'` is the key of the current pair. Keep it when `k' == k`.",
      solution: hs`valueOf :: String -> [(String, Int)] -> Int
valueOf k t = head [ v | (k', v) <- t, k' == k ]
`,
    },
    {
      k: "predict",
      expr: "filter (\\(k, _) -> k /= \"b\") [(\"a\", 1), (\"b\", 2), (\"c\", 3)]",
      answer: "[(\"a\", 1), (\"c\", 3)]",
      why: "The lambda takes each pair apart and keeps it only when the key is not `\"b\"`. This is how you remove a key from a table.",
    },
    {
      k: "write",
      body: "Write `dropKey k t`, which removes every pair whose key is `k`. Fill in the condition.",
      starter: hs`dropKey :: String -> [(String, Int)] -> [(String, Int)]
dropKey k t = [ (k', v) | (k', v) <- t, undefined ]
`,
      tests: [
        { expr: 'dropKey "b" [("a", 1), ("b", 2), ("c", 3)]', expected: '[("a", 1), ("c", 3)]' },
        { expr: 'dropKey "z" [("a", 1)]', expected: '[("a", 1)]', label: "missing key: unchanged" },
        { expr: 'dropKey "a" [("a", 1), ("a", 2)]', expected: "[]" },
        { expr: 'dropKey "a" []', expected: "[]" },
      ],
      hint: "Keep the pair when `k' /= k`.",
      solution: hs`dropKey :: String -> [(String, Int)] -> [(String, Int)]
dropKey k t = [ (k', v) | (k', v) <- t, k' /= k ]
`,
    },
    {
      k: "write",
      body: "Write `addFront k v t`, which puts the new pair `(k, v)` at the front of the table.",
      starter: hs`addFront :: String -> Int -> [(String, Int)] -> [(String, Int)]
addFront k v t = undefined : t
`,
      tests: [
        { expr: 'addFront "a" 1 []', expected: '[("a", 1)]' },
        { expr: 'addFront "b" 2 [("a", 1)]', expected: '[("b", 2), ("a", 1)]' },
        { expr: 'lookup "a" (addFront "a" 9 [("a", 1)])', expected: "Just 9", label: "new pair hides the old one" },
        { expr: 'length (addFront "x" 0 [("y", 1), ("z", 2)])', expected: "3" },
      ],
      hint: "The hole is one pair: `(k, v)`.",
      solution: hs`addFront :: String -> Int -> [(String, Int)] -> [(String, Int)]
addFront k v t = (k, v) : t
`,
    },
    {
      k: "quiz",
      q: "What is `lookup \"a\" ((\"a\", 9) : [(\"a\", 1)])`?",
      options: ["`Just 1`", "`Just 9`", "`Just [9, 1]`", "An error: duplicate key"],
      answer: 1,
      why: "Tables may contain the same key twice. `lookup` finds the first, which is `(\"a\", 9)`. Adding at the front is a cheap way to \"overwrite\" a value, but the old pair is still in the list.",
    },
    {
      k: "write",
      body: "Write `howMany k t`, the number of pairs in `t` whose key is `k`. Fill in the condition.",
      starter: hs`howMany :: String -> [(String, Int)] -> Int
howMany k t = length [ k' | (k', _) <- t, undefined ]
`,
      tests: [
        { expr: 'howMany "a" [("a", 1), ("b", 2), ("a", 3)]', expected: "2" },
        { expr: 'howMany "b" [("a", 1), ("b", 2), ("a", 3)]', expected: "1" },
        { expr: 'howMany "z" [("a", 1)]', expected: "0" },
        { expr: 'howMany "a" []', expected: "0" },
      ],
      hint: "Count the pairs where `k' == k`.",
      solution: hs`howMany :: String -> [(String, Int)] -> Int
howMany k t = length [ k' | (k', _) <- t, k' == k ]
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 2: Standard
// ---------------------------------------------------------------------------

const level2: Level = {
  id: "b-tables-l2",
  lesson: "",
  level: 2,
  title: "Level 2: Standard",
  intro: md(
    "Now each question is one whole function from a plain description: lookups with defaults, reverse lookups, removing, replacing and counting. Most answers are one list comprehension, or a `case` on `lookup`.",
    "",
    "```",
    "stockOf :: String -> [(String, Int)] -> Int",
    "stockOf k t = case lookup k t of",
    "                Nothing -> 0",
    "                Just n  -> n",
    "```",
  ),
  drills: [
    {
      k: "write",
      body: "Write `lookupOr d k t`, which gives the value for key `k`, or the default `d` if `k` isn't in the table.",
      setup: libs,
      starter: hs`lookupOr :: Int -> String -> [(String, Int)] -> Int
lookupOr d k t = undefined
`,
      tests: [
        { expr: 'lookupOr 0 "b" [("a", 1), ("b", 2)]', expected: "2" },
        { expr: 'lookupOr 0 "c" [("a", 1), ("b", 2)]', expected: "0" },
        { expr: 'lookupOr (-1) "c" []', expected: "-1" },
        { expr: 'lookupOr 5 "a" [("a", 0)]', expected: "0", label: "a stored 0 is not missing" },
      ],
      hint: "`fromMaybe d (lookup k t)`, or a `case` with two alternatives.",
      solution: hs`lookupOr :: Int -> String -> [(String, Int)] -> Int
lookupOr d k t = fromMaybe d (lookup k t)
`,
    },
    {
      k: "write",
      body: md(
        "A table maps students to exam marks. Write `describeScore name t`:",
        "",
        "- if the student has a mark, give the name, a colon, a space, then the mark, e.g. `\"Ann: 72\"`",
        "- otherwise give e.g. `\"Ann: absent\"`",
      ),
      starter: hs`describeScore :: String -> [(String, Int)] -> String
describeScore name t = undefined
`,
      tests: [
        { expr: 'describeScore "Ann" [("Ann", 72), ("Bo", 55)]', expected: '"Ann: 72"' },
        { expr: 'describeScore "Bo" [("Ann", 72), ("Bo", 55)]', expected: '"Bo: 55"' },
        { expr: 'describeScore "Cy" [("Ann", 72)]', expected: '"Cy: absent"' },
        { expr: 'describeScore "Di" []', expected: '"Di: absent"' },
      ],
      hint: "`case lookup name t of` with `Nothing -> name ++ \": absent\"` and `Just m -> name ++ \": \" ++ show m`.",
      solution: hs`describeScore :: String -> [(String, Int)] -> String
describeScore name t
  = case lookup name t of
      Nothing -> name ++ ": absent"
      Just m  -> name ++ ": " ++ show m
`,
    },
    {
      k: "predict",
      expr: "sum (map snd [(\"mon\", 3), (\"tue\", 0), (\"wed\", 4)])",
      answer: "7",
      why: "`map snd` gives the values `[3, 0, 4]`, and their sum is 7.",
    },
    {
      k: "write",
      body: "A shop's stock table maps items to how many are in stock. Write `totalStock`, the total number of items in the shop.",
      starter: hs`totalStock :: [(String, Int)] -> Int
totalStock t = undefined
`,
      tests: [
        { expr: 'totalStock [("pen", 4), ("pad", 10)]', expected: "14" },
        { expr: 'totalStock [("pen", 0)]', expected: "0" },
        { expr: "totalStock []", expected: "0" },
        { expr: 'totalStock [("a", 1), ("b", 2), ("c", 3)]', expected: "6" },
      ],
      hint: "Add up the values: `sum (map snd t)`.",
      solution: hs`totalStock :: [(String, Int)] -> Int
totalStock t = sum (map snd t)
`,
    },
    {
      k: "write",
      body: "This is a reverse lookup. A table maps people to their house number. Write `whoHas n t`, the names of everyone who lives at number `n`, in table order.",
      starter: hs`whoHas :: Int -> [(String, Int)] -> [String]
whoHas n t = undefined
`,
      tests: [
        { expr: 'whoHas 4 [("ann", 4), ("bob", 7), ("cy", 4)]', expected: '["ann", "cy"]' },
        { expr: 'whoHas 7 [("ann", 4), ("bob", 7), ("cy", 4)]', expected: '["bob"]' },
        { expr: 'whoHas 9 [("ann", 4)]', expected: "[]" },
        { expr: "whoHas 1 []", expected: "[]" },
      ],
      hint: "Keep the key when the value equals `n`: `[k | (k, v) <- t, v == n]`.",
      solution: hs`whoHas :: Int -> [(String, Int)] -> [String]
whoHas n t = [ k | (k, v) <- t, v == n ]
`,
    },
    {
      k: "write",
      body: "In a game, a table maps players to lives left. Write `knockOut`, which removes every player with 0 lives (or fewer). Keep the others in order.",
      starter: hs`knockOut :: [(String, Int)] -> [(String, Int)]
knockOut t = undefined
`,
      tests: [
        { expr: 'knockOut [("ann", 2), ("bob", 0), ("cy", 1)]', expected: '[("ann", 2), ("cy", 1)]' },
        { expr: 'knockOut [("dee", -1)]', expected: "[]" },
        { expr: "knockOut []", expected: "[]" },
        { expr: 'knockOut [("eve", 3)]', expected: '[("eve", 3)]' },
      ],
      hint: "`[(k, v) | (k, v) <- t, v > 0]`.",
      solution: hs`knockOut :: [(String, Int)] -> [(String, Int)]
knockOut t = [ (k, v) | (k, v) <- t, v > 0 ]
`,
    },
    {
      k: "write",
      body: "Write `setStock k n t`. If item `k` is in the table, its value becomes `n`, staying in the same position. If it isn't there, the table is unchanged.",
      starter: hs`setStock :: String -> Int -> [(String, Int)] -> [(String, Int)]
setStock k n t = undefined
`,
      tests: [
        { expr: 'setStock "pad" 0 [("pen", 4), ("pad", 10), ("ink", 2)]', expected: '[("pen", 4), ("pad", 0), ("ink", 2)]' },
        { expr: 'setStock "pen" 9 [("pen", 4)]', expected: '[("pen", 9)]' },
        { expr: 'setStock "gum" 5 [("pen", 4)]', expected: '[("pen", 4)]', label: "missing key: unchanged" },
        { expr: 'setStock "pen" 1 []', expected: "[]" },
      ],
      hint: "Go through every pair and use `if`: `[if k' == k then (k', n) else (k', v) | (k', v) <- t]`.",
      solution: hs`setStock :: String -> Int -> [(String, Int)] -> [(String, Int)]
setStock k n t = [ if k' == k then (k', n) else (k', v) | (k', v) <- t ]
`,
    },
    {
      k: "write",
      body: md(
        "A high-score table maps players to their best score. Write `record k n t`, which is insert-or-replace:",
        "",
        "- if `k` is already a key, replace its value with `n` (same position)",
        "- otherwise add `(k, n)` at the end",
      ),
      starter: hs`record :: String -> Int -> [(String, Int)] -> [(String, Int)]
record k n t = undefined
`,
      tests: [
        { expr: 'record "bo" 50 [("ann", 30), ("bo", 20)]', expected: '[("ann", 30), ("bo", 50)]' },
        { expr: 'record "cy" 10 [("ann", 30), ("bo", 20)]', expected: '[("ann", 30), ("bo", 20), ("cy", 10)]' },
        { expr: 'record "ann" 5 []', expected: '[("ann", 5)]' },
        { expr: 'record "ann" 1 [("ann", 9), ("bo", 2)]', expected: '[("ann", 1), ("bo", 2)]' },
      ],
      hint: "Two guards: `elem k (map fst t)` decides which case you're in. Replace with a comprehension, or append with `t ++ [(k, n)]`.",
      solution: hs`record :: String -> Int -> [(String, Int)] -> [(String, Int)]
record k n t
  | elem k (map fst t) = [ if k' == k then (k', n) else (k', v) | (k', v) <- t ]
  | otherwise          = t ++ [(k, n)]
`,
    },
    {
      k: "write",
      body: "A log of lap times maps each runner to one lap time, and runners appear many times. Write `lapsOf k t`, all the lap times for runner `k`, in order.",
      starter: hs`lapsOf :: String -> [(String, Int)] -> [Int]
lapsOf k t = undefined
`,
      tests: [
        { expr: 'lapsOf "al" [("al", 61), ("bea", 58), ("al", 59)]', expected: "[61, 59]" },
        { expr: 'lapsOf "bea" [("al", 61), ("bea", 58), ("al", 59)]', expected: "[58]" },
        { expr: 'lapsOf "cal" [("al", 61)]', expected: "[]" },
        { expr: 'lapsOf "al" []', expected: "[]" },
      ],
      hint: "Like `lookup`, but keep every match instead of the first.",
      solution: hs`lapsOf :: String -> [(String, Int)] -> [Int]
lapsOf k t = [ v | (k', v) <- t, k' == k ]
`,
    },
    {
      k: "write",
      body: "A nickname table maps real names to nicknames. Write `nickname t n`, which gives the nickname of `n`, or `n` itself if there's no nickname.",
      setup: libs,
      starter: hs`nickname :: [(String, String)] -> String -> String
nickname t n = undefined
`,
      tests: [
        { expr: 'nickname [("Robert", "Bob"), ("William", "Bill")] "Robert"', expected: '"Bob"' },
        { expr: 'nickname [("Robert", "Bob"), ("William", "Bill")] "William"', expected: '"Bill"' },
        { expr: 'nickname [("Robert", "Bob")] "Ann"', expected: '"Ann"', label: "no nickname: unchanged" },
        { expr: 'nickname [] "Zed"', expected: '"Zed"' },
      ],
      hint: "The default for `fromMaybe` is the name itself: `fromMaybe n (lookup n t)`.",
      solution: hs`nickname :: [(String, String)] -> String -> String
nickname t n = fromMaybe n (lookup n t)
`,
    },
    {
      k: "write",
      body: "Write `nicknames t ns`, which renames every name in the list `ns` using the table `t`. Names with no nickname stay the same.",
      setup: libs,
      starter: hs`nicknames :: [(String, String)] -> [String] -> [String]
nicknames t ns = undefined
`,
      tests: [
        { expr: 'nicknames [("Robert", "Bob")] ["Robert", "Ann", "Robert"]', expected: '["Bob", "Ann", "Bob"]' },
        { expr: 'nicknames [] ["Ann"]', expected: '["Ann"]' },
        { expr: 'nicknames [("A", "B")] []', expected: "[]" },
        { expr: 'nicknames [("A", "B"), ("B", "C")] ["A", "B"]', expected: '["B", "C"]', label: "rename once only, not twice" },
      ],
      hint: "`map` a function over `ns`. The function is `\\n -> fromMaybe n (lookup n t)`.",
      solution: hs`nicknames :: [(String, String)] -> [String] -> [String]
nicknames t ns = map (\n -> fromMaybe n (lookup n t)) ns
`,
    },
    {
      k: "predict",
      expr: "lookup 3 (zip [1 ..] \"hello\")",
      answer: "Just 'l'",
      why: "`zip [1 ..] \"hello\"` builds the table `[(1,'h'), (2,'e'), (3,'l'), (4,'l'), (5,'o')]`. Key 3 gives `'l'`. `zip` stops when the shorter list runs out, so the infinite `[1 ..]` is fine.",
    },
    {
      k: "write",
      body: "Write `numbered`, which numbers the tracks of a playlist from 1, giving a table from track number to title.",
      starter: hs`numbered :: [String] -> [(Int, String)]
numbered songs = undefined
`,
      tests: [
        { expr: 'numbered ["Intro", "Song", "Outro"]', expected: '[(1, "Intro"), (2, "Song"), (3, "Outro")]' },
        { expr: 'numbered ["Solo"]', expected: '[(1, "Solo")]' },
        { expr: "numbered []", expected: "[]" },
        { expr: 'lookup 2 (numbered ["a", "b", "c"])', expected: 'Just "b"' },
      ],
      hint: "`zip [1 ..] songs`.",
      solution: hs`numbered :: [String] -> [(Int, String)]
numbered songs = zip [1 ..] songs
`,
    },
    {
      k: "write",
      body: "Prices are going up. Write `raiseAll n t`, which adds `n` to every value in the table.",
      starter: hs`raiseAll :: Int -> [(String, Int)] -> [(String, Int)]
raiseAll n t = undefined
`,
      tests: [
        { expr: 'raiseAll 10 [("tea", 120), ("cake", 250)]', expected: '[("tea", 130), ("cake", 260)]' },
        { expr: 'raiseAll 0 [("a", 1)]', expected: '[("a", 1)]' },
        { expr: 'raiseAll (-5) [("a", 5)]', expected: '[("a", 0)]' },
        { expr: "raiseAll 3 []", expected: "[]" },
      ],
      hint: "`[(k, v + n) | (k, v) <- t]`.",
      solution: hs`raiseAll :: Int -> [(String, Int)] -> [(String, Int)]
raiseAll n t = [ (k, v + n) | (k, v) <- t ]
`,
    },
    {
      k: "write",
      body: "Write `keepOnly ks t`, which keeps only the pairs whose key is in the list `ks`. Keep the table's order.",
      starter: hs`keepOnly :: [String] -> [(String, Int)] -> [(String, Int)]
keepOnly ks t = undefined
`,
      tests: [
        { expr: 'keepOnly ["b", "a"] [("a", 1), ("b", 2), ("c", 3)]', expected: '[("a", 1), ("b", 2)]' },
        { expr: 'keepOnly [] [("a", 1)]', expected: "[]" },
        { expr: 'keepOnly ["z"] [("a", 1)]', expected: "[]" },
        { expr: 'keepOnly ["a"] [("a", 1), ("a", 2)]', expected: '[("a", 1), ("a", 2)]' },
      ],
      hint: "The condition is `elem k ks`.",
      solution: hs`keepOnly :: [String] -> [(String, Int)] -> [(String, Int)]
keepOnly ks t = [ (k, v) | (k, v) <- t, elem k ks ]
`,
    },
    {
      k: "write",
      body: "A shopping list `ks` is checked against a price table. Write `pricesOf ks t`, the prices of the items on the list, in list order. Items that aren't in the table are skipped.",
      setup: libs,
      starter: hs`pricesOf :: [String] -> [(String, Int)] -> [Int]
pricesOf ks t = undefined
`,
      tests: [
        { expr: 'pricesOf ["egg", "jam"] [("jam", 200), ("egg", 30)]', expected: "[30, 200]" },
        { expr: 'pricesOf ["egg", "caviar", "egg"] [("egg", 30)]', expected: "[30, 30]" },
        { expr: 'pricesOf ["x"] []', expected: "[]" },
        { expr: 'pricesOf [] [("egg", 30)]', expected: "[]" },
      ],
      hint: "`mapMaybe (\\k -> lookup k t) ks` keeps only the `Just` results. Or: `[p | k <- ks, Just p <- [lookup k t]]`.",
      solution: hs`pricesOf :: [String] -> [(String, Int)] -> [Int]
pricesOf ks t = mapMaybe (\k -> lookup k t) ks
`,
    },
    {
      k: "quiz",
      q: "What is `zip [\"a\", \"b\", \"c\"] [1, 2]`?",
      options: ["`[(\"a\",1),(\"b\",2),(\"c\",0)]`", "`[(\"a\",1),(\"b\",2)]`", "An error: the lists have different lengths", "`[(\"a\",1),(\"b\",2),(\"c\",2)]`"],
      answer: 1,
      why: "`zip` stops as soon as either list runs out. The extra `\"c\"` is silently dropped.",
    },
    {
      k: "write",
      body: md(
        "Write `tally`, which builds a count table from a list of votes. Each different vote appears once, in the order it first appears, with the number of times it was cast.",
        "",
        "`nub` (from Data.List, already imported) removes duplicates and keeps first appearances.",
      ),
      setup: libs,
      starter: hs`tally :: [String] -> [(String, Int)]
tally votes = undefined
`,
      tests: [
        { expr: 'tally ["red", "blue", "red", "red"]', expected: '[("red", 3), ("blue", 1)]' },
        { expr: 'tally ["x"]', expected: '[("x", 1)]' },
        { expr: "tally []", expected: "[]" },
        { expr: 'tally ["b", "a", "b", "a", "c"]', expected: '[("b", 2), ("a", 2), ("c", 1)]' },
      ],
      hint: "For every `x` in `nub votes`, output `(x, length (filter (== x) votes))`.",
      solution: hs`tally :: [String] -> [(String, Int)]
tally votes = [ (x, length (filter (== x) votes)) | x <- nub votes ]
`,
    },
    {
      k: "write",
      body: "Write `cheapest`, the item with the lowest price in a non-empty price table. If several items share the lowest price, give the first one in the table.",
      starter: hs`cheapest :: [(String, Int)] -> String
cheapest t = undefined
`,
      tests: [
        { expr: 'cheapest [("tea", 120), ("bun", 90), ("cake", 250)]', expected: '"bun"' },
        { expr: 'cheapest [("tea", 120)]', expected: '"tea"' },
        { expr: 'cheapest [("zip", 5), ("abc", 5)]', expected: '"zip"', label: "ties: the first in the table" },
        { expr: 'cheapest [("a", 3), ("b", -1)]', expected: '"b"' },
      ],
      hint: "Work out `low = minimum (map snd t)`, then take the first key whose value is `low`.",
      solution: hs`cheapest :: [(String, Int)] -> String
cheapest t = head [ k | (k, v) <- t, v == low ]
  where
    low = minimum (map snd t)
`,
    },
    {
      k: "write",
      body: "Write `sameKeys a b`, which is `True` when the two tables have exactly the same keys. Order and values don't matter.",
      starter: hs`sameKeys :: [(String, Int)] -> [(String, Int)] -> Bool
sameKeys a b = undefined
`,
      tests: [
        { expr: 'sameKeys [("a", 1), ("b", 2)] [("b", 5), ("a", 0)]', expected: "True" },
        { expr: 'sameKeys [("a", 1)] [("a", 1), ("b", 2)]', expected: "False" },
        { expr: 'sameKeys [("a", 1), ("b", 2)] [("a", 1)]', expected: "False" },
        { expr: "sameKeys [] []", expected: "True" },
      ],
      hint: "Every key of `a` must be a key of `b`, and the other way round. Use `all` twice.",
      solution: hs`sameKeys :: [(String, Int)] -> [(String, Int)] -> Bool
sameKeys a b = all (\k -> elem k kb) ka && all (\k -> elem k ka) kb
  where
    ka = map fst a
    kb = map fst b
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 3: Stretch
// ---------------------------------------------------------------------------

const level3: Level = {
  id: "b-tables-l3",
  lesson: "",
  level: 3,
  title: "Level 3: Stretch",
  intro: md(
    "These questions combine ideas: counts that must include zeros, key-to-list tables, merging two tables, tables inside tables, and tables used to rename things in a list or a tree. A few ask you to fix broken code.",
    "",
    "```",
    "countVotes [\"a\", \"b\"] [\"b\", \"b\"]",
    "  -- [(\"a\", 0), (\"b\", 2)]   \"a\" got no votes but still appears",
    "```",
  ),
  drills: [
    {
      k: "write",
      body: md(
        "Write `countVotes cands votes`. The result has one pair for every candidate in `cands`, in that order, with the number of votes they got. A candidate with no votes must still appear, with 0. Votes for people who aren't candidates are ignored.",
      ),
      starter: hs`countVotes :: [String] -> [String] -> [(String, Int)]
countVotes cands votes = undefined
`,
      tests: [
        { expr: 'countVotes ["a", "b"] ["b", "a", "b"]', expected: '[("a", 1), ("b", 2)]' },
        { expr: 'countVotes ["a", "b", "c"] ["b", "b"]', expected: '[("a", 0), ("b", 2), ("c", 0)]', label: "zero counts included" },
        { expr: 'countVotes ["a"] ["z", "a"]', expected: '[("a", 1)]' },
        { expr: 'countVotes ["a"] []', expected: '[("a", 0)]' },
        { expr: 'countVotes [] ["a"]', expected: "[]" },
      ],
      hint: "Loop over the candidates, not the votes: `[(c, length (filter (== c) votes)) | c <- cands]`.",
      solution: hs`countVotes :: [String] -> [String] -> [(String, Int)]
countVotes cands votes = [ (c, length (filter (== c) votes)) | c <- cands ]
`,
    },
    {
      k: "write",
      body: "Write `diceCounts rolls`, how many times each face 1 to 6 came up, as a table with all six faces in order, including faces that never came up.",
      starter: hs`diceCounts :: [Int] -> [(Int, Int)]
diceCounts rolls = undefined
`,
      tests: [
        { expr: "diceCounts [6, 1, 6]", expected: "[(1, 1), (2, 0), (3, 0), (4, 0), (5, 0), (6, 2)]" },
        { expr: "diceCounts []", expected: "[(1, 0), (2, 0), (3, 0), (4, 0), (5, 0), (6, 0)]" },
        { expr: "lookup 3 (diceCounts [3, 3, 3, 2])", expected: "Just 3" },
        { expr: "sum (map snd (diceCounts [1, 2, 3, 4, 5, 6, 1]))", expected: "7" },
      ],
      hint: "Loop over the faces `[1 .. 6]` and count each one in `rolls`.",
      solution: hs`diceCounts :: [Int] -> [(Int, Int)]
diceCounts rolls = [ (f, length (filter (== f) rolls)) | f <- [1 .. 6] ]
`,
    },
    {
      k: "write",
      body: "A till receipt log has one pair per sale: `(person, amount)`. Write `totalsBy`, which gives each person once, in the order they first appear, with the total they spent.",
      setup: libs,
      starter: hs`totalsBy :: [(String, Int)] -> [(String, Int)]
totalsBy sales = undefined
`,
      tests: [
        { expr: 'totalsBy [("ann", 5), ("bo", 3), ("ann", 2)]', expected: '[("ann", 7), ("bo", 3)]' },
        { expr: 'totalsBy [("cy", 4)]', expected: '[("cy", 4)]' },
        { expr: "totalsBy []", expected: "[]" },
        { expr: 'totalsBy [("bo", 1), ("ann", 1), ("bo", -1)]', expected: '[("bo", 0), ("ann", 1)]' },
      ],
      hint: "The people are `nub (map fst sales)`. For each person `k`, add up `[v | (k', v) <- sales, k' == k]`.",
      solution: hs`totalsBy :: [(String, Int)] -> [(String, Int)]
totalsBy sales = [ (k, sum [ v | (k', v) <- sales, k' == k ]) | k <- nub (map fst sales) ]
`,
    },
    {
      k: "write",
      body: md(
        "A table maps each key to a list. Write `addTo k v t`:",
        "",
        "- if `k` is already a key, add `v` to the end of its list",
        "- otherwise add a new pair `(k, [v])` at the end of the table",
        "",
        "Use recursion over the table.",
      ),
      starter: hs`addTo :: String -> Int -> [(String, [Int])] -> [(String, [Int])]
addTo k v [] = undefined
addTo k v ((k', vs) : rest) = undefined
`,
      tests: [
        { expr: 'addTo "a" 3 [("a", [1, 2]), ("b", [9])]', expected: '[("a", [1, 2, 3]), ("b", [9])]' },
        { expr: 'addTo "b" 3 [("a", [1, 2]), ("b", [9])]', expected: '[("a", [1, 2]), ("b", [9, 3])]' },
        { expr: 'addTo "c" 3 [("a", [1])]', expected: '[("a", [1]), ("c", [3])]' },
        { expr: 'addTo "a" 1 []', expected: '[("a", [1])]' },
        { expr: 'addTo "a" 1 [("a", [])]', expected: '[("a", [1])]' },
      ],
      hint: "Empty table: `[(k, [v])]`. Otherwise, if `k == k'` give `(k', vs ++ [v]) : rest`, else keep the pair and recurse on `rest`.",
      solution: hs`addTo :: String -> Int -> [(String, [Int])] -> [(String, [Int])]
addTo k v [] = [(k, [v])]
addTo k v ((k', vs) : rest)
  | k == k'   = (k', vs ++ [v]) : rest
  | otherwise = (k', vs) : addTo k v rest
`,
    },
    {
      k: "write",
      body: "Write `groupPairs`, which turns a list of pairs into a table from each key to all its values. Keys appear in first-appearance order; values keep their original order.",
      setup: libs,
      starter: hs`groupPairs :: [(String, Int)] -> [(String, [Int])]
groupPairs ps = undefined
`,
      tests: [
        { expr: 'groupPairs [("a", 1), ("b", 2), ("a", 3)]', expected: '[("a", [1, 3]), ("b", [2])]' },
        { expr: 'groupPairs [("x", 5)]', expected: '[("x", [5])]' },
        { expr: "groupPairs []", expected: "[]" },
        { expr: 'groupPairs [("b", 1), ("a", 2), ("b", 1)]', expected: '[("b", [1, 1]), ("a", [2])]' },
      ],
      hint: "`[(k, [v | (k', v) <- ps, k' == k]) | k <- nub (map fst ps)]`. Or `foldl` with `addTo`.",
      solution: hs`groupPairs :: [(String, Int)] -> [(String, [Int])]
groupPairs ps = [ (k, [ v | (k', v) <- ps, k' == k ]) | k <- nub (map fst ps) ]
`,
    },
    {
      k: "write",
      body: md(
        "Fix this code. `setPrice k p t` should change the price of `k` to `p` and leave every other item alone. A student wrote the version below. Run the tests to see what goes wrong, then fix it.",
      ),
      starter: hs`setPrice :: String -> Int -> [(String, Int)] -> [(String, Int)]
setPrice k p t = [ (k', p) | (k', v) <- t, k' == k ]
`,
      tests: [
        { expr: 'setPrice "b" 9 [("a", 1), ("b", 2), ("c", 3)]', expected: '[("a", 1), ("b", 9), ("c", 3)]' },
        { expr: 'setPrice "a" 0 [("a", 5)]', expected: '[("a", 0)]' },
        { expr: 'setPrice "z" 1 [("a", 5)]', expected: '[("a", 5)]', label: "missing key: unchanged" },
        { expr: 'setPrice "a" 1 []', expected: "[]" },
      ],
      hint: "The condition throws away every other item. Don't filter: keep every pair, and use `if` in the output to decide which value it gets.",
      solution: hs`setPrice :: String -> Int -> [(String, Int)] -> [(String, Int)]
setPrice k p t = [ if k' == k then (k', p) else (k', v) | (k', v) <- t ]
`,
    },
    {
      k: "write",
      body: md(
        "Fix this code. The table pairs each person with their pet. `ownersOf pet t` should give everyone who owns that kind of pet, but it always returns `[]` on the tests.",
      ),
      starter: hs`ownersOf :: String -> [(String, String)] -> [String]
ownersOf pet t = [ p | (p, x) <- t, p == pet ]
`,
      tests: [
        { expr: 'ownersOf "cat" [("ann", "cat"), ("bo", "dog"), ("cy", "cat")]', expected: '["ann", "cy"]' },
        { expr: 'ownersOf "dog" [("ann", "cat"), ("bo", "dog")]', expected: '["bo"]' },
        { expr: 'ownersOf "ann" [("ann", "cat")]', expected: "[]", label: "a person's name is not a pet" },
        { expr: 'ownersOf "cat" []', expected: "[]" },
      ],
      hint: "It compares the wrong half of the pair. The pet is `x`.",
      solution: hs`ownersOf :: String -> [(String, String)] -> [String]
ownersOf pet t = [ p | (p, x) <- t, x == pet ]
`,
    },
    {
      k: "write",
      body: md(
        "Write `adjust f k t`, which changes the value of `k` by applying `f` to it.",
        "",
        "- if `k` is in the table, replace its value `v` with `f v` (same position)",
        "- otherwise add `(k, f 0)` at the end, as if the old value had been 0",
      ),
      starter: hs`adjust :: (Int -> Int) -> String -> [(String, Int)] -> [(String, Int)]
adjust f k t = undefined
`,
      tests: [
        { expr: 'adjust (+ 1) "b" [("a", 1), ("b", 2)]', expected: '[("a", 1), ("b", 3)]' },
        { expr: 'adjust (+ 1) "c" [("a", 1)]', expected: '[("a", 1), ("c", 1)]' },
        { expr: 'adjust (* 2) "a" [("a", 5)]', expected: '[("a", 10)]' },
        { expr: 'adjust (* 2) "z" []', expected: '[("z", 0)]' },
      ],
      hint: "The same two cases as insert-or-replace, but use `f v` and `f 0` as the new values.",
      solution: hs`adjust :: (Int -> Int) -> String -> [(String, Int)] -> [(String, Int)]
adjust f k t
  | elem k (map fst t) = [ if k' == k then (k', f v) else (k', v) | (k', v) <- t ]
  | otherwise          = t ++ [(k, f 0)]
`,
    },
    {
      k: "write",
      body: md(
        "Two shops each have a stock table, and they are merging. Write `mergeAdd a b`. Every item from either table appears once, with the two counts added (a missing item counts as 0).",
        "",
        "Order: the keys of `a` in order, then the keys that are only in `b`, in `b`'s order. You may assume each table has no repeated keys.",
      ),
      setup: libs,
      starter: hs`mergeAdd :: [(String, Int)] -> [(String, Int)] -> [(String, Int)]
mergeAdd a b = undefined
`,
      tests: [
        { expr: 'mergeAdd [("pen", 4), ("pad", 1)] [("pad", 2), ("ink", 3)]', expected: '[("pen", 4), ("pad", 3), ("ink", 3)]' },
        { expr: 'mergeAdd [] [("ink", 3)]', expected: '[("ink", 3)]' },
        { expr: 'mergeAdd [("pen", 4)] []', expected: '[("pen", 4)]' },
        { expr: 'mergeAdd [("a", 1), ("b", 2)] [("b", 2), ("a", 1)]', expected: '[("a", 2), ("b", 4)]' },
      ],
      hint: "The keys are `nub (map fst a ++ map fst b)`. For each key, add `fromMaybe 0 (lookup k a)` and `fromMaybe 0 (lookup k b)`.",
      solution: hs`mergeAdd :: [(String, Int)] -> [(String, Int)] -> [(String, Int)]
mergeAdd a b = [ (k, get k a + get k b) | k <- nub (map fst a ++ map fst b) ]
  where
    get k t = fromMaybe 0 (lookup k t)
`,
    },
    {
      k: "write",
      body: md(
        "Write `mergePrefer a b`, a combined settings table. It contains all of `a`, followed by the pairs of `b` whose key is not already in `a`. So when both tables have a key, `a` wins.",
      ),
      starter: hs`mergePrefer :: [(String, Int)] -> [(String, Int)] -> [(String, Int)]
mergePrefer a b = undefined
`,
      tests: [
        { expr: 'mergePrefer [("vol", 7)] [("vol", 3), ("bass", 2)]', expected: '[("vol", 7), ("bass", 2)]' },
        { expr: 'mergePrefer [] [("vol", 3)]', expected: '[("vol", 3)]' },
        { expr: 'mergePrefer [("a", 1)] []', expected: '[("a", 1)]' },
        { expr: 'mergePrefer [("a", 1), ("b", 2)] [("c", 3), ("b", 0)]', expected: '[("a", 1), ("b", 2), ("c", 3)]' },
      ],
      hint: "`a ++ [(k, v) | (k, v) <- b, notElem k (map fst a)]`.",
      solution: hs`mergePrefer :: [(String, Int)] -> [(String, Int)] -> [(String, Int)]
mergePrefer a b = a ++ [ (k, v) | (k, v) <- b, notElem k (map fst a) ]
`,
    },
    {
      k: "write",
      body: "A substitution cipher is a table from letters to letters. Write `translate t s`, which replaces each character of `s` using the table. Characters not in the table stay the same.",
      setup: libs,
      starter: hs`translate :: [(Char, Char)] -> String -> String
translate t s = undefined
`,
      tests: [
        { expr: "translate [('a', 'x'), ('b', 'y')] \"abc\"", expected: '"xyc"' },
        { expr: "translate [('o', '0'), ('e', '3')] \"hello there\"", expected: '"h3ll0 th3r3"' },
        { expr: "translate [] \"same\"", expected: '"same"' },
        { expr: "translate [('a', 'b'), ('b', 'a')] \"abba\"", expected: '"baab"', label: "each letter is changed once" },
      ],
      hint: "A String is a list of Char, so `map` over it with `\\c -> fromMaybe c (lookup c t)`.",
      solution: hs`translate :: [(Char, Char)] -> String -> String
translate t s = map (\c -> fromMaybe c (lookup c t)) s
`,
    },
    {
      k: "write",
      body: md(
        "Write two related functions.",
        "",
        "- `shiftTable n` is the Caesar-shift table for lower-case letters: `'a'` maps to the letter `n` places later, wrapping round after `'z'`. Assume `0 <= n < 26`.",
        "- `encode n s` uses that table to encode `s`. Characters that aren't lower-case letters stay the same.",
      ),
      setup: libs,
      starter: hs`shiftTable :: Int -> [(Char, Char)]
shiftTable n = undefined

encode :: Int -> String -> String
encode n s = undefined
`,
      tests: [
        { expr: "take 3 (shiftTable 1)", expected: "[('a', 'b'), ('b', 'c'), ('c', 'd')]" },
        { expr: "lookup 'z' (shiftTable 3)", expected: "Just 'c'" },
        { expr: "length (shiftTable 5)", expected: "26" },
        { expr: 'encode 1 "abc xyz"', expected: '"bcd yza"' },
        { expr: 'encode 0 "hi!"', expected: '"hi!"' },
        { expr: 'encode 13 "Hello"', expected: '"Hryyb"', label: "capitals are left alone" },
      ],
      hint: "`zip ['a' .. 'z'] (drop n (cycle ['a' .. 'z']))` builds the table. `cycle` repeats the alphabet forever and `zip` stops after 26.",
      solution: hs`shiftTable :: Int -> [(Char, Char)]
shiftTable n = zip ['a' .. 'z'] (drop n (cycle ['a' .. 'z']))

encode :: Int -> String -> String
encode n s = map (\c -> fromMaybe c (lookup c table)) s
  where
    table = shiftTable n
`,
    },
    {
      k: "write",
      body: "Write `consistent t`, which is `True` when no key is paired with two different values. (The same key twice with the same value is fine.)",
      starter: hs`consistent :: [(String, Int)] -> Bool
consistent t = undefined
`,
      tests: [
        { expr: 'consistent [("a", 1), ("b", 2), ("a", 1)]', expected: "True" },
        { expr: 'consistent [("a", 1), ("b", 2), ("a", 3)]', expected: "False" },
        { expr: "consistent []", expected: "True" },
        { expr: 'consistent [("a", 1), ("b", 1)]', expected: "True", label: "two keys sharing a value is fine" },
      ],
      hint: "Compare every pair with every pair: `and [v1 == v2 | (k1, v1) <- t, (k2, v2) <- t, k1 == k2]`.",
      solution: hs`consistent :: [(String, Int)] -> Bool
consistent t = and [ v1 == v2 | (k1, v1) <- t, (k2, v2) <- t, k1 == k2 ]
`,
    },
    {
      k: "write",
      body: "Write `removeKeys ks t`, which removes from `t` every pair whose key is in the list `ks`.",
      starter: hs`removeKeys :: [String] -> [(String, Int)] -> [(String, Int)]
removeKeys ks t = undefined
`,
      tests: [
        { expr: 'removeKeys ["a", "c"] [("a", 1), ("b", 2), ("c", 3)]', expected: '[("b", 2)]' },
        { expr: 'removeKeys [] [("a", 1)]', expected: '[("a", 1)]' },
        { expr: 'removeKeys ["z"] [("a", 1)]', expected: '[("a", 1)]' },
        { expr: 'removeKeys ["a"] [("a", 1), ("a", 2)]', expected: "[]" },
      ],
      hint: "Keep a pair when `notElem k ks`.",
      solution: hs`removeKeys :: [String] -> [(String, Int)] -> [(String, Int)]
removeKeys ks t = [ (k, v) | (k, v) <- t, notElem k ks ]
`,
    },
    {
      k: "write",
      body: md(
        "A website keeps a table of redirects: page `a` has moved to page `b`. A redirect may point to another redirect. Write `follow t p`, which keeps following redirects from `p` until it reaches a page that has no redirect. You may assume there are no loops.",
      ),
      starter: hs`follow :: [(String, String)] -> String -> String
follow t p = undefined
`,
      tests: [
        { expr: 'follow [("old", "new")] "old"', expected: '"new"' },
        { expr: 'follow [("a", "b"), ("b", "c"), ("c", "d")] "a"', expected: '"d"' },
        { expr: 'follow [("a", "b")] "home"', expected: '"home"', label: "no redirect: stay put" },
        { expr: 'follow [("a", "b"), ("b", "c")] "b"', expected: '"c"' },
      ],
      hint: "`case lookup p t of`: `Nothing -> p`, and `Just q -> follow t q`.",
      solution: hs`follow :: [(String, String)] -> String -> String
follow t p
  = case lookup p t of
      Nothing -> p
      Just q  -> follow t q
`,
    },
    {
      k: "write",
      body: md(
        "A weather table is a table of tables: each city maps to its own table from day to temperature. Write `tempOn city day t`. It gives `Nothing` if the city is missing, or if the city has no reading for that day.",
      ),
      starter: hs`tempOn :: String -> String -> [(String, [(String, Int)])] -> Maybe Int
tempOn city day t = undefined
`,
      tests: [
        { expr: 'tempOn "Leeds" "tue" [("York", [("mon", 9)]), ("Leeds", [("mon", 8), ("tue", 11)])]', expected: "Just 11" },
        { expr: 'tempOn "York" "mon" [("York", [("mon", -2)])]', expected: "Just (-2)" },
        { expr: 'tempOn "York" "sun" [("York", [("mon", 9)])]', expected: "Nothing", label: "missing day" },
        { expr: 'tempOn "Bath" "mon" [("York", [("mon", 9)])]', expected: "Nothing", label: "missing city" },
      ],
      hint: "`case lookup city t of`: `Nothing -> Nothing`, and `Just days -> lookup day days`.",
      solution: hs`tempOn :: String -> String -> [(String, [(String, Int)])] -> Maybe Int
tempOn city day t
  = case lookup city t of
      Nothing   -> Nothing
      Just days -> lookup day days
`,
    },
    {
      k: "write",
      body: md(
        "A table maps each student to the clubs they belong to. Write `invert`, which gives the table the other way round: each club mapped to its members.",
        "",
        "Clubs appear in the order they are first mentioned. Members of a club are listed in table order.",
      ),
      setup: libs,
      starter: hs`invert :: [(String, [String])] -> [(String, [String])]
invert t = undefined
`,
      tests: [
        {
          expr: 'invert [("ann", ["chess", "choir"]), ("bo", ["choir"]), ("cy", ["chess"])]',
          expected: '[("chess", ["ann", "cy"]), ("choir", ["ann", "bo"])]',
        },
        { expr: 'invert [("ann", [])]', expected: "[]" },
        { expr: "invert []", expected: "[]" },
        { expr: 'invert [("bo", ["golf"]), ("ann", ["golf", "art"])]', expected: '[("golf", ["bo", "ann"]), ("art", ["ann"])]' },
      ],
      hint: "The clubs are `nub (concatMap snd t)`. For each club `c`, the members are `[s | (s, cs) <- t, elem c cs]`.",
      solution: hs`invert :: [(String, [String])] -> [(String, [String])]
invert t = [ (c, [ s | (s, cs) <- t, elem c cs ]) | c <- nub (concatMap snd t) ]
`,
    },
    {
      k: "write",
      body: md(
        "Write `mostCommon`, the item that appears most often in a non-empty list. If there is a tie, give the one that appears first in the list.",
      ),
      starter: hs`mostCommon :: [String] -> String
mostCommon xs = undefined
`,
      tests: [
        { expr: 'mostCommon ["a", "b", "b", "c"]', expected: '"b"' },
        { expr: 'mostCommon ["x"]', expected: '"x"' },
        { expr: 'mostCommon ["c", "a", "a", "c"]', expected: '"c"', label: "tie: first in the list wins" },
        { expr: 'mostCommon ["p", "q", "q", "p", "q"]', expected: '"q"' },
      ],
      hint: "Use a helper `count x = length (filter (== x) xs)`. Find `best = maximum (map count xs)`, then take the first `x` in `xs` with `count x == best`.",
      solution: hs`mostCommon :: [String] -> String
mostCommon xs = head [ x | x <- xs, count x == best ]
  where
    count x = length (filter (== x) xs)
    best    = maximum (map count xs)
`,
    },
    {
      k: "write",
      body: md(
        "The setup gives a small expression type. Write `renameVars t e`, which renames every variable in `e` using the table `t`. Variables not in the table keep their name.",
        "",
        "```",
        "data Expr = Num Int | Var String | Add Expr Expr | Mul Expr Expr",
        "```",
      ),
      setup: libs + exprSetup,
      starter: hs`renameVars :: [(String, String)] -> Expr -> Expr
renameVars t e = undefined
`,
      tests: [
        { expr: 'renameVars [("x", "a")] (Var "x")', expected: 'Var "a"' },
        { expr: 'renameVars [("x", "a")] (Add (Var "x") (Mul (Num 2) (Var "y")))', expected: 'Add (Var "a") (Mul (Num 2) (Var "y"))' },
        { expr: 'renameVars [] (Var "q")', expected: 'Var "q"' },
        { expr: 'renameVars [("x", "y"), ("y", "x")] (Add (Var "x") (Var "y"))', expected: 'Add (Var "y") (Var "x")', label: "a swap renames each variable once" },
      ],
      hint: "One equation per constructor. `Num n` stays the same; `Var v` becomes `Var (fromMaybe v (lookup v t))`; `Add` and `Mul` recurse on both sides.",
      solution: hs`renameVars :: [(String, String)] -> Expr -> Expr
renameVars t (Num n)   = Num n
renameVars t (Var v)   = Var (fromMaybe v (lookup v t))
renameVars t (Add a b) = Add (renameVars t a) (renameVars t b)
renameVars t (Mul a b) = Mul (renameVars t a) (renameVars t b)
`,
    },
    {
      k: "write",
      body: md(
        "Using the same `Expr` type, write `evalIn env e`, which works out the value of `e`. Variables get their values from the table `env`. If any variable is missing, the answer is `Nothing`.",
      ),
      setup: libs + exprSetup,
      starter: hs`evalIn :: [(String, Int)] -> Expr -> Maybe Int
evalIn env e = undefined
`,
      tests: [
        { expr: "evalIn [] (Add (Num 2) (Num 3))", expected: "Just 5" },
        { expr: 'evalIn [("x", 4)] (Mul (Var "x") (Num 3))', expected: "Just 12" },
        { expr: 'evalIn [("x", 4)] (Add (Var "x") (Var "y"))', expected: "Nothing", label: "missing variable" },
        { expr: 'evalIn [("y", 1)] (Mul (Num 0) (Var "z"))', expected: "Nothing", label: "missing even when multiplied by 0" },
        { expr: 'evalIn [("a", 2), ("b", 5)] (Add (Mul (Var "a") (Var "b")) (Var "a"))', expected: "Just 12" },
      ],
      hint: "`Var v` is just `lookup v env`. For `Add a b`, `case (evalIn env a, evalIn env b) of (Just x, Just y) -> Just (x + y); _ -> Nothing`.",
      solution: hs`evalIn :: [(String, Int)] -> Expr -> Maybe Int
evalIn env (Num n)   = Just n
evalIn env (Var v)   = lookup v env
evalIn env (Add a b) = both (+) (evalIn env a) (evalIn env b)
evalIn env (Mul a b) = both (*) (evalIn env a) (evalIn env b)

both :: (Int -> Int -> Int) -> Maybe Int -> Maybe Int -> Maybe Int
both f (Just x) (Just y) = Just (f x y)
both _ _ _               = Nothing
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 4: Exam strength
// ---------------------------------------------------------------------------

const kitchenBlock = [
  "```",
  "type Item   = String",
  "type Stock  = [(Item, Int)]",
  "type Recipe = [(Item, Int)]",
  "",
  "pantry :: Stock",
  "pantry = [(\"flour\", 500), (\"egg\", 6), (\"milk\", 300), (\"sugar\", 0)]",
  "",
  "pancakes, cake :: Recipe",
  "pancakes = [(\"flour\", 200), (\"egg\", 2), (\"milk\", 300)]",
  "cake = [(\"flour\", 250), (\"egg\", 4), (\"sugar\", 200), (\"butter\", 100)]",
  "```",
];

const libraryBlock = [
  "```",
  "type Member    = String",
  "type ISBN      = Int",
  "type Catalogue = [(ISBN, String)]",
  "type Loans     = [(Member, [ISBN])]",
  "",
  "catalogue = [(101, \"Dune\"), (102, \"Emma\"), (103, \"Ulysses\"), (104, \"Beloved\")]",
  "loans     = [(\"ann\", [101, 103]), (\"raj\", [102]), (\"li\", [])]",
  "```",
];

const level4: Level = {
  id: "b-tables-l4",
  lesson: "",
  level: 4,
  title: "Level 4: Exam strength",
  intro: md(
    "These are worded like the real papers: a small domain with given types, then \"Define a function ...\" and a GHCi transcript. The types and example data are in the given code. The last five are as hard as a 3-5 mark exam question.",
    "",
    "```",
    "ghci> stockLevel \"egg\" pantry",
    "6",
    "```",
  ),
  drills: [
    {
      k: "write",
      body: md(
        "A kitchen keeps its stock in a table. The given code contains:",
        "",
        ...kitchenBlock,
        "",
        "Define a function `stockLevel :: Item -> Stock -> Int` that returns how much of the given item is in stock. An item that isn't in the table has stock 0. For example:",
        "",
        "```",
        "ghci> stockLevel \"egg\" pantry",
        "6",
        "ghci> stockLevel \"butter\" pantry",
        "0",
        "```",
      ),
      setup: kitchenSetup,
      starter: hs`stockLevel :: Item -> Stock -> Int
stockLevel item stock = undefined
`,
      tests: [
        { expr: 'stockLevel "egg" pantry', expected: "6" },
        { expr: 'stockLevel "butter" pantry', expected: "0" },
        { expr: 'stockLevel "sugar" pantry', expected: "0" },
        { expr: 'stockLevel "flour" pantry', expected: "500" },
        { expr: 'stockLevel "egg" []', expected: "0" },
      ],
      hint: "`fromMaybe 0 (lookup item stock)`.",
      solution: hs`stockLevel :: Item -> Stock -> Int
stockLevel item stock = fromMaybe 0 (lookup item stock)
`,
    },
    {
      k: "write",
      body: md(
        "Using the kitchen types:",
        "",
        ...kitchenBlock,
        "",
        "Define a function `restock :: Item -> Int -> Stock -> Stock` that adds the given amount to an item's stock. If the item is not in the table it should be added at the end. For example:",
        "",
        "```",
        "ghci> restock \"egg\" 6 pantry",
        "[(\"flour\",500),(\"egg\",12),(\"milk\",300),(\"sugar\",0)]",
        "ghci> restock \"butter\" 250 pantry",
        "[(\"flour\",500),(\"egg\",6),(\"milk\",300),(\"sugar\",0),(\"butter\",250)]",
        "```",
      ),
      setup: kitchenSetup,
      starter: hs`restock :: Item -> Int -> Stock -> Stock
restock item n stock = undefined
`,
      tests: [
        { expr: 'restock "egg" 6 pantry', expected: '[("flour",500),("egg",12),("milk",300),("sugar",0)]' },
        { expr: 'restock "butter" 250 pantry', expected: '[("flour",500),("egg",6),("milk",300),("sugar",0),("butter",250)]' },
        { expr: 'restock "sugar" 1 pantry', expected: '[("flour",500),("egg",6),("milk",300),("sugar",1)]' },
        { expr: 'restock "egg" 2 []', expected: '[("egg",2)]' },
      ],
      hint: "Guard on `elem item (map fst stock)`. If present, add `n` to the matching value with a comprehension; otherwise `stock ++ [(item, n)]`.",
      solution: hs`restock :: Item -> Int -> Stock -> Stock
restock item n stock
  | elem item (map fst stock) = [ if k == item then (k, v + n) else (k, v) | (k, v) <- stock ]
  | otherwise                 = stock ++ [(item, n)]
`,
    },
    {
      k: "write",
      body: md(
        "Using the kitchen types:",
        "",
        ...kitchenBlock,
        "",
        "Define a function `canMake :: Recipe -> Stock -> Bool` that returns `True` if there is enough of every ingredient in the recipe. An ingredient missing from the stock has stock 0. For example:",
        "",
        "```",
        "ghci> canMake pancakes pantry",
        "True",
        "ghci> canMake cake pantry",
        "False",
        "```",
      ),
      setup: kitchenSetup,
      starter: hs`canMake :: Recipe -> Stock -> Bool
canMake recipe stock = undefined
`,
      tests: [
        { expr: "canMake pancakes pantry", expected: "True" },
        { expr: "canMake cake pantry", expected: "False" },
        { expr: "canMake [] []", expected: "True", label: "an empty recipe can always be made" },
        { expr: 'canMake [("egg", 7)] pantry', expected: "False" },
        { expr: 'canMake [("egg", 6), ("sugar", 0)] pantry', expected: "True", label: "exactly enough is enough" },
      ],
      hint: "`and [fromMaybe 0 (lookup i stock) >= n | (i, n) <- recipe]`.",
      solution: hs`canMake :: Recipe -> Stock -> Bool
canMake recipe stock = and [ fromMaybe 0 (lookup i stock) >= n | (i, n) <- recipe ]
`,
    },
    {
      k: "write",
      body: md(
        "A library keeps a catalogue and a loans table. The given code contains:",
        "",
        ...libraryBlock,
        "",
        "Define a function `loansOf :: Member -> Loans -> [ISBN]` that returns the books a member has borrowed. A member who isn't in the table has borrowed nothing. For example:",
        "",
        "```",
        "ghci> loansOf \"ann\" loans",
        "[101,103]",
        "ghci> loansOf \"zoe\" loans",
        "[]",
        "```",
      ),
      setup: librarySetup,
      starter: hs`loansOf :: Member -> Loans -> [ISBN]
loansOf m ls = undefined
`,
      tests: [
        { expr: 'loansOf "ann" loans', expected: "[101,103]" },
        { expr: 'loansOf "raj" loans', expected: "[102]" },
        { expr: 'loansOf "li" loans', expected: "[]" },
        { expr: 'loansOf "zoe" loans', expected: "[]" },
      ],
      hint: "`fromMaybe [] (lookup m ls)`.",
      solution: hs`loansOf :: Member -> Loans -> [ISBN]
loansOf m ls = fromMaybe [] (lookup m ls)
`,
    },
    {
      k: "write",
      body: md(
        "Using the library types:",
        "",
        ...libraryBlock,
        "",
        "Define a function `borrower :: ISBN -> Loans -> Maybe Member` that returns the member who has the given book, or `Nothing` if nobody has it. You may assume at most one member has any book. For example:",
        "",
        "```",
        "ghci> borrower 103 loans",
        "Just \"ann\"",
        "ghci> borrower 104 loans",
        "Nothing",
        "```",
      ),
      setup: librarySetup,
      starter: hs`borrower :: ISBN -> Loans -> Maybe Member
borrower b ls = undefined
`,
      tests: [
        { expr: "borrower 103 loans", expected: 'Just "ann"' },
        { expr: "borrower 102 loans", expected: 'Just "raj"' },
        { expr: "borrower 104 loans", expected: "Nothing" },
        { expr: "borrower 101 []", expected: "Nothing" },
      ],
      hint: "Find the members whose list contains `b`: `[m | (m, bs) <- ls, elem b bs]`. Then `case` on that list: `[]` gives `Nothing`, `(m : _)` gives `Just m`.",
      solution: hs`borrower :: ISBN -> Loans -> Maybe Member
borrower b ls
  = case [ m | (m, bs) <- ls, elem b bs ] of
      []      -> Nothing
      (m : _) -> Just m
`,
    },
    {
      k: "write",
      body: md(
        "A rail network is stored as a table of tables: each station maps to the stations you can reach directly, with the journey time in minutes. The given code contains:",
        "",
        ...trainBlock,
        "",
        "Define a function `destinations :: Station -> Timetable -> [Station]` that returns the stations directly reachable from the given station, in table order. A station not in the table has no destinations. For example:",
        "",
        "```",
        "ghci> destinations \"Kilwinning\" net",
        "[\"Glasgow\",\"Largs\"]",
        "ghci> destinations \"Glasgow\" net",
        "[]",
        "```",
      ),
      setup: trainSetup,
      starter: hs`destinations :: Station -> Timetable -> [Station]
destinations s t = undefined
`,
      tests: [
        { expr: 'destinations "Kilwinning" net', expected: '["Glasgow","Largs"]' },
        { expr: 'destinations "Troon" net', expected: '["Ayr","Irvine"]' },
        { expr: 'destinations "Largs" net', expected: "[]" },
        { expr: 'destinations "Glasgow" net', expected: "[]" },
      ],
      hint: "Look up the inner table (default `[]`), then `map fst` over it.",
      solution: hs`destinations :: Station -> Timetable -> [Station]
destinations s t = map fst (fromMaybe [] (lookup s t))
`,
    },
    {
      k: "write",
      body: md(
        "Using the kitchen types:",
        "",
        ...kitchenBlock,
        "",
        "Define a function `useRecipe :: Recipe -> Stock -> Stock` that returns the stock left after making the recipe once. Every item in the stock stays in the table, in the same order, even if its amount becomes 0. You may assume `canMake recipe stock` is `True`. For example:",
        "",
        "```",
        "ghci> useRecipe pancakes pantry",
        "[(\"flour\",300),(\"egg\",4),(\"milk\",0),(\"sugar\",0)]",
        "```",
      ),
      setup: kitchenSetup,
      starter: hs`useRecipe :: Recipe -> Stock -> Stock
useRecipe recipe stock = undefined
`,
      tests: [
        { expr: "useRecipe pancakes pantry", expected: '[("flour",300),("egg",4),("milk",0),("sugar",0)]' },
        { expr: "useRecipe [] pantry", expected: "pantry" },
        { expr: 'useRecipe [("egg", 1), ("egg", 1)] [("egg", 5)]', expected: '[("egg",4)]', label: "only the first entry for a repeated ingredient counts" },
        { expr: 'useRecipe [("milk", 100)] [("egg", 2), ("milk", 100)]', expected: '[("egg",2),("milk",0)]' },
      ],
      hint: "Go through the stock, not the recipe: `[(i, v - fromMaybe 0 (lookup i recipe)) | (i, v) <- stock]`.",
      solution: hs`useRecipe :: Recipe -> Stock -> Stock
useRecipe recipe stock = [ (i, v - fromMaybe 0 (lookup i recipe)) | (i, v) <- stock ]
`,
    },
    {
      k: "write",
      body: md(
        "Using the kitchen types:",
        "",
        ...kitchenBlock,
        "",
        "Define a function `shoppingList :: Recipe -> Stock -> [(Item, Int)]` that lists, in recipe order, each ingredient we don't have enough of, paired with how much more we need. For example:",
        "",
        "```",
        "ghci> shoppingList cake pantry",
        "[(\"sugar\",200),(\"butter\",100)]",
        "ghci> shoppingList pancakes pantry",
        "[]",
        "```",
      ),
      setup: kitchenSetup,
      starter: hs`shoppingList :: Recipe -> Stock -> [(Item, Int)]
shoppingList recipe stock = undefined
`,
      tests: [
        { expr: "shoppingList cake pantry", expected: '[("sugar",200),("butter",100)]' },
        { expr: "shoppingList pancakes pantry", expected: "[]" },
        { expr: 'shoppingList [("egg", 10)] pantry', expected: '[("egg",4)]' },
        { expr: "shoppingList cake []", expected: "cake" },
      ],
      hint: "In a comprehension you can name things with `let`: `[(i, n - have) | (i, n) <- recipe, let have = fromMaybe 0 (lookup i stock), n > have]`.",
      solution: hs`shoppingList :: Recipe -> Stock -> [(Item, Int)]
shoppingList recipe stock
  = [ (i, n - have) | (i, n) <- recipe, let have = fromMaybe 0 (lookup i stock), n > have ]
`,
    },
    {
      k: "write",
      body: md(
        "Using the library types:",
        "",
        ...libraryBlock,
        "",
        "Define a function `lend :: Member -> ISBN -> Loans -> Loans` that records that the member has borrowed the book. The book is added to the end of the member's list. If the member is not yet in the table, add them at the end with just that book. For example:",
        "",
        "```",
        "ghci> lend \"raj\" 104 loans",
        "[(\"ann\",[101,103]),(\"raj\",[102,104]),(\"li\",[])]",
        "ghci> lend \"zoe\" 104 loans",
        "[(\"ann\",[101,103]),(\"raj\",[102]),(\"li\",[]),(\"zoe\",[104])]",
        "```",
      ),
      setup: librarySetup,
      starter: hs`lend :: Member -> ISBN -> Loans -> Loans
lend m b ls = undefined
`,
      tests: [
        { expr: 'lend "raj" 104 loans', expected: '[("ann",[101,103]),("raj",[102,104]),("li",[])]' },
        { expr: 'lend "zoe" 104 loans', expected: '[("ann",[101,103]),("raj",[102]),("li",[]),("zoe",[104])]' },
        { expr: 'lend "li" 101 loans', expected: '[("ann",[101,103]),("raj",[102]),("li",[101])]' },
        { expr: 'lend "ann" 7 []', expected: '[("ann",[7])]' },
      ],
      hint: "The same shape as insert-or-replace: if `m` is a key, `[if m' == m then (m', bs ++ [b]) else (m', bs) | (m', bs) <- ls]`, else `ls ++ [(m, [b])]`.",
      solution: hs`lend :: Member -> ISBN -> Loans -> Loans
lend m b ls
  | elem m (map fst ls) = [ if m' == m then (m', bs ++ [b]) else (m', bs) | (m', bs) <- ls ]
  | otherwise           = ls ++ [(m, [b])]
`,
    },
    {
      k: "write",
      body: md(
        "Using the library types:",
        "",
        ...libraryBlock,
        "",
        "Define a function `titlesOf :: Member -> Catalogue -> Loans -> [String]` that returns the titles of the books the member has borrowed, in loan order. Books whose ISBN is not in the catalogue are left out. For example:",
        "",
        "```",
        "ghci> titlesOf \"ann\" catalogue loans",
        "[\"Dune\",\"Ulysses\"]",
        "ghci> titlesOf \"bo\" catalogue [(\"bo\", [999, 104])]",
        "[\"Beloved\"]",
        "```",
      ),
      setup: librarySetup,
      starter: hs`titlesOf :: Member -> Catalogue -> Loans -> [String]
titlesOf m cat ls = undefined
`,
      tests: [
        { expr: 'titlesOf "ann" catalogue loans', expected: '["Dune","Ulysses"]' },
        { expr: 'titlesOf "bo" catalogue [("bo", [999, 104])]', expected: '["Beloved"]' },
        { expr: 'titlesOf "li" catalogue loans', expected: "[]" },
        { expr: 'titlesOf "zoe" catalogue loans', expected: "[]" },
      ],
      hint: "Two lookups in a row: first the member's ISBNs (default `[]`), then `mapMaybe (\\b -> lookup b cat)` over them.",
      solution: hs`titlesOf :: Member -> Catalogue -> Loans -> [String]
titlesOf m cat ls = mapMaybe (\b -> lookup b cat) (fromMaybe [] (lookup m ls))
`,
    },
    {
      k: "write",
      body: md(
        "A school keeps two tables: one from student to house, and one from house to house points.",
        "",
        "Define a function `chain :: [(String, String)] -> [(String, Int)] -> [(String, Int)]` that joins the two tables, giving each student their house's points. Keep the order of the first table. A student whose house has no entry in the second table is left out. For example:",
        "",
        "```",
        "ghci> chain [(\"ann\",\"Red\"),(\"bo\",\"Blue\"),(\"cy\",\"Red\")] [(\"Red\",40),(\"Blue\",25)]",
        "[(\"ann\",40),(\"bo\",25),(\"cy\",40)]",
        "ghci> chain [(\"di\",\"Green\")] [(\"Red\",40)]",
        "[]",
        "```",
      ),
      setup: libs,
      starter: hs`chain :: [(String, String)] -> [(String, Int)] -> [(String, Int)]
chain houses points = undefined
`,
      tests: [
        { expr: 'chain [("ann","Red"),("bo","Blue"),("cy","Red")] [("Red",40),("Blue",25)]', expected: '[("ann",40),("bo",25),("cy",40)]' },
        { expr: 'chain [("di","Green")] [("Red",40)]', expected: "[]" },
        { expr: 'chain [("di","Green"),("ed","Red")] [("Red",40)]', expected: '[("ed",40)]' },
        { expr: 'chain [] [("Red",40)]', expected: "[]" },
      ],
      hint: "A pattern on the left of `<-` that doesn't match just skips that item: `[(s, p) | (s, h) <- houses, Just p <- [lookup h points]]`.",
      solution: hs`chain :: [(String, String)] -> [(String, Int)] -> [(String, Int)]
chain houses points = [ (s, p) | (s, h) <- houses, Just p <- [lookup h points] ]
`,
    },
    {
      k: "write",
      body: md(
        "Using the library types:",
        "",
        ...libraryBlock,
        "",
        "Define a function `returnBook :: ISBN -> Loans -> Loans` that records that a book has been returned: it is removed from whichever list it is in. Members who have no books left afterwards are removed from the table. For example:",
        "",
        "```",
        "ghci> returnBook 103 loans",
        "[(\"ann\",[101]),(\"raj\",[102])]",
        "ghci> returnBook 102 loans",
        "[(\"ann\",[101,103])]",
        "```",
      ),
      setup: librarySetup,
      starter: hs`returnBook :: ISBN -> Loans -> Loans
returnBook b ls = undefined
`,
      tests: [
        { expr: "returnBook 103 loans", expected: '[("ann",[101]),("raj",[102])]' },
        { expr: "returnBook 102 loans", expected: '[("ann",[101,103])]' },
        { expr: "returnBook 999 loans", expected: '[("ann",[101,103]),("raj",[102])]', label: "unknown book: only empty members removed" },
        { expr: "returnBook 1 []", expected: "[]" },
      ],
      hint: "For each `(m, bs)`, work out `bs' = filter (/= b) bs` with a `let` in the comprehension, and keep the pair only when `not (null bs')`.",
      solution: hs`returnBook :: ISBN -> Loans -> Loans
returnBook b ls = [ (m, bs') | (m, bs) <- ls, let bs' = filter (/= b) bs, not (null bs') ]
`,
    },
    {
      k: "write",
      body: md(
        "Using the rail network:",
        "",
        ...trainBlock,
        "",
        "Define a function `addLink :: Station -> Station -> Int -> Timetable -> Timetable` such that `addLink a b n t` records a direct train from `a` to `b` taking `n` minutes. If `a` already has a link to `b`, its time is replaced. Otherwise the link is added to the end of `a`'s list. If `a` is not in the table, it is added at the end. For example:",
        "",
        "```",
        "ghci> addLink \"Largs\" \"Ayr\" 40 [(\"Largs\", [])]",
        "[(\"Largs\",[(\"Ayr\",40)])]",
        "ghci> addLink \"Troon\" \"Ayr\" 12 [(\"Troon\", [(\"Ayr\",10),(\"Irvine\",8)])]",
        "[(\"Troon\",[(\"Ayr\",12),(\"Irvine\",8)])]",
        "ghci> addLink \"Oban\" \"Ayr\" 99 []",
        "[(\"Oban\",[(\"Ayr\",99)])]",
        "```",
      ),
      setup: trainSetup,
      starter: hs`addLink :: Station -> Station -> Int -> Timetable -> Timetable
addLink a b n t = undefined
`,
      tests: [
        { expr: 'addLink "Largs" "Ayr" 40 [("Largs", [])]', expected: '[("Largs",[("Ayr",40)])]' },
        { expr: 'addLink "Troon" "Ayr" 12 [("Troon", [("Ayr",10),("Irvine",8)])]', expected: '[("Troon",[("Ayr",12),("Irvine",8)])]' },
        { expr: 'addLink "Oban" "Ayr" 99 []', expected: '[("Oban",[("Ayr",99)])]' },
        { expr: 'lookup "Irvine" (addLink "Irvine" "Troon" 8 net)', expected: 'Just [("Kilwinning",6),("Troon",8)]' },
        { expr: 'length (addLink "Glasgow" "Kilwinning" 30 net)', expected: "6" },
      ],
      hint: "Write a helper `setLeg legs` that does insert-or-replace on the inner table. Then do insert-or-replace on the outer table, using `setLeg` when you find `a`.",
      solution: hs`addLink :: Station -> Station -> Int -> Timetable -> Timetable
addLink a b n t
  | elem a (map fst t) = [ if s == a then (s, setLeg legs) else (s, legs) | (s, legs) <- t ]
  | otherwise          = t ++ [(a, [(b, n)])]
  where
    setLeg legs
      | elem b (map fst legs) = [ if d == b then (d, n) else (d, m) | (d, m) <- legs ]
      | otherwise             = legs ++ [(b, n)]
`,
    },
    {
      k: "write",
      body: md(
        "Using the rail network:",
        "",
        ...trainBlock,
        "",
        "Define a function `journeyTime :: [Station] -> Timetable -> Maybe Int` that returns the total time of a journey that visits the given stations in order, using a direct train for each step. If any step has no direct train, the result is `Nothing`. A journey of one station takes no time. You may assume the list is non-empty. For example:",
        "",
        "```",
        "ghci> journeyTime [\"Ayr\",\"Troon\",\"Irvine\"] net",
        "Just 18",
        "ghci> journeyTime [\"Ayr\",\"Irvine\"] net",
        "Nothing",
        "ghci> journeyTime [\"Largs\"] net",
        "Just 0",
        "```",
      ),
      setup: trainSetup,
      starter: hs`journeyTime :: [Station] -> Timetable -> Maybe Int
journeyTime ss t = undefined
`,
      tests: [
        { expr: 'journeyTime ["Ayr","Troon","Irvine"] net', expected: "Just 18" },
        { expr: 'journeyTime ["Ayr","Irvine"] net', expected: "Nothing" },
        { expr: 'journeyTime ["Largs"] net', expected: "Just 0" },
        { expr: 'journeyTime ["Troon","Irvine","Kilwinning","Glasgow"] net', expected: "Just 44" },
        { expr: 'journeyTime ["Kilwinning","Glasgow","Kilwinning"] net', expected: "Nothing", label: "Glasgow has no entry" },
      ],
      hint: "Recurse on the list with the pattern `(a : b : rest)`. Look up `a`, then look up `b` in its inner table, then recurse on `(b : rest)`. Any `Nothing` along the way gives `Nothing`.",
      solution: hs`journeyTime :: [Station] -> Timetable -> Maybe Int
journeyTime (a : b : rest) t
  = case lookup a t of
      Nothing   -> Nothing
      Just legs -> case lookup b legs of
        Nothing -> Nothing
        Just m  -> case journeyTime (b : rest) t of
          Nothing    -> Nothing
          Just total -> Just (m + total)
journeyTime _ _ = Just 0
`,
    },
    {
      k: "write",
      body: md(
        "A family tree service stores names in a binary tree:",
        "",
        "```",
        "data Tree = Leaf | Node Tree String Tree",
        "  deriving (Eq, Show)",
        "```",
        "",
        "Define a function `relabel :: [(String, String)] -> Tree -> Tree` that renames every node using the table. Names not in the table are unchanged. The shape of the tree must not change. For example:",
        "",
        "```",
        "ghci> relabel [(\"Bob\",\"Robert\")] (Node Leaf \"Bob\" (Node Leaf \"Al\" Leaf))",
        "Node Leaf \"Robert\" (Node Leaf \"Al\" Leaf)",
        "```",
      ),
      setup:
        libs +
        hs`
data Tree = Leaf | Node Tree String Tree
  deriving (Eq, Show)
`,
      starter: hs`relabel :: [(String, String)] -> Tree -> Tree
relabel t tree = undefined
`,
      tests: [
        { expr: 'relabel [("Bob","Robert")] (Node Leaf "Bob" (Node Leaf "Al" Leaf))', expected: 'Node Leaf "Robert" (Node Leaf "Al" Leaf)' },
        { expr: 'relabel [("a","b")] Leaf', expected: "Leaf" },
        {
          expr: 'relabel [("x","y"),("y","x")] (Node (Node Leaf "x" Leaf) "y" (Node Leaf "z" Leaf))',
          expected: 'Node (Node Leaf "y" Leaf) "x" (Node Leaf "z" Leaf)',
        },
        { expr: 'relabel [] (Node Leaf "q" Leaf)', expected: 'Node Leaf "q" Leaf' },
      ],
      hint: "Two equations: `Leaf` stays `Leaf`; `Node l n r` becomes `Node (relabel t l) (fromMaybe n (lookup n t)) (relabel t r)`.",
      solution: hs`relabel :: [(String, String)] -> Tree -> Tree
relabel t Leaf         = Leaf
relabel t (Node l n r) = Node (relabel t l) (fromMaybe n (lookup n t)) (relabel t r)
`,
    },
    {
      k: "write",
      body: md(
        "A tiny language has variables and `let`:",
        "",
        "```",
        "type Env = [(String, Int)]",
        "",
        "data Exp = Const Int | Var String | Plus Exp Exp | Times Exp Exp",
        "         | Let String Exp Exp",
        "  deriving (Eq, Show)",
        "```",
        "",
        "`Let x e1 e2` means: work out `e1`, then work out `e2` with `x` bound to that value. The new binding hides any older binding of `x`.",
        "",
        "Define a function `eval :: Env -> Exp -> Int`. You may assume every variable is bound. For example:",
        "",
        "```",
        "ghci> eval [(\"x\",5)] (Plus (Var \"x\") (Const 1))",
        "6",
        "ghci> eval [] (Let \"y\" (Const 3) (Times (Var \"y\") (Var \"y\")))",
        "9",
        "ghci> eval [(\"x\",1)] (Let \"x\" (Const 10) (Var \"x\"))",
        "10",
        "```",
      ),
      setup:
        libs +
        hs`
type Env = [(String, Int)]

data Exp = Const Int | Var String | Plus Exp Exp | Times Exp Exp
         | Let String Exp Exp
  deriving (Eq, Show)
`,
      starter: hs`eval :: Env -> Exp -> Int
eval env e = undefined
`,
      tests: [
        { expr: 'eval [("x",5)] (Plus (Var "x") (Const 1))', expected: "6" },
        { expr: 'eval [] (Let "y" (Const 3) (Times (Var "y") (Var "y")))', expected: "9" },
        { expr: 'eval [("x",1)] (Let "x" (Const 10) (Var "x"))', expected: "10" },
        { expr: 'eval [("x",2)] (Let "x" (Plus (Var "x") (Var "x")) (Times (Var "x") (Const 3)))', expected: "12", label: "e1 uses the old x" },
        { expr: 'eval [] (Plus (Let "a" (Const 1) (Var "a")) (Let "a" (Const 2) (Var "a")))', expected: "3" },
      ],
      hint: "`Var v` is `fromJust (lookup v env)` (or a `case`). For `Let x e1 e2`, work out `v = eval env e1`, then `eval ((x, v) : env) e2`. Putting the new pair at the front hides the old one.",
      solution: hs`eval :: Env -> Exp -> Int
eval env (Const n)     = n
eval env (Var v)       = fromMaybe 0 (lookup v env)
eval env (Plus a b)    = eval env a + eval env b
eval env (Times a b)   = eval env a * eval env b
eval env (Let x e1 e2) = eval ((x, eval env e1) : env) e2
`,
    },
    {
      k: "write",
      body: md(
        "A football league records results:",
        "",
        "```",
        "type Team = String",
        "data Result = Result Team Int Team Int   -- home, home goals, away, away goals",
        "  deriving (Eq, Show)",
        "",
        "results :: [Result]",
        "results = [ Result \"Lions\" 2 \"Tigers\" 1",
        "          , Result \"Bears\" 0 \"Lions\" 0",
        "          , Result \"Tigers\" 3 \"Bears\" 1 ]",
        "```",
        "",
        "A win is worth 3 points, a draw 1, a loss 0. Define a function `points :: [Result] -> [(Team, Int)]` that returns every team's total. Teams appear in the order they are first mentioned (home team before away team). For example:",
        "",
        "```",
        "ghci> points results",
        "[(\"Lions\",4),(\"Tigers\",3),(\"Bears\",1)]",
        "```",
      ),
      setup:
        libs +
        hs`
type Team = String
data Result = Result Team Int Team Int
  deriving (Eq, Show)

results :: [Result]
results = [ Result "Lions" 2 "Tigers" 1
          , Result "Bears" 0 "Lions" 0
          , Result "Tigers" 3 "Bears" 1 ]
`,
      starter: hs`points :: [Result] -> [(Team, Int)]
points rs = undefined
`,
      tests: [
        { expr: "points results", expected: '[("Lions",4),("Tigers",3),("Bears",1)]' },
        { expr: "points []", expected: "[]" },
        { expr: 'points [Result "A" 1 "B" 1]', expected: '[("A",1),("B",1)]' },
        { expr: 'points [Result "A" 0 "B" 2, Result "C" 5 "A" 0]', expected: '[("A",0),("B",3),("C",3)]', label: "a team with 0 points still appears" },
      ],
      hint: "Get the teams with `nub (concatMap teams rs)` where `teams (Result h _ a _) = [h, a]`. Write a helper `score t r` giving team `t`'s points from one result (0 if `t` didn't play), and sum it over all results.",
      solution: hs`points :: [Result] -> [(Team, Int)]
points rs = [ (t, sum [ score t r | r <- rs ]) | t <- nub (concatMap teams rs) ]
  where
    teams (Result h _ a _) = [h, a]
    score t (Result h hg a ag)
      | t == h    = pts hg ag
      | t == a    = pts ag hg
      | otherwise = 0
    pts mine theirs
      | mine > theirs  = 3
      | mine == theirs = 1
      | otherwise      = 0
`,
    },
    {
      k: "write",
      body: md(
        "A text is stored as numbered lines, `[(Int, String)]`. All words are lower case and separated by spaces.",
        "",
        "Define a function `buildIndex :: [(Int, String)] -> [(String, [Int])]` that builds an index: every word, in alphabetical order, with the line numbers it appears on, in increasing order and without repeats. For example:",
        "",
        "```",
        "ghci> buildIndex [(1,\"the cat sat\"),(2,\"the dog\"),(3,\"cat and cat\")]",
        "[(\"and\",[3]),(\"cat\",[1,3]),(\"dog\",[2]),(\"sat\",[1]),(\"the\",[1,2])]",
        "```",
      ),
      setup: libs,
      starter: hs`buildIndex :: [(Int, String)] -> [(String, [Int])]
buildIndex ls = undefined
`,
      tests: [
        {
          expr: 'buildIndex [(1,"the cat sat"),(2,"the dog"),(3,"cat and cat")]',
          expected: '[("and",[3]),("cat",[1,3]),("dog",[2]),("sat",[1]),("the",[1,2])]',
        },
        { expr: "buildIndex []", expected: "[]" },
        { expr: 'buildIndex [(5,"b a"),(2,"a")]', expected: '[("a",[2,5]),("b",[5])]', label: "line numbers sorted" },
        { expr: 'buildIndex [(1,"")]', expected: "[]" },
        { expr: 'buildIndex [(1,"x x x")]', expected: '[("x",[1])]' },
      ],
      hint: "The words are `sort (nub (concatMap (words . snd) ls))`. For each word `w`, its lines are `sort (nub [n | (n, l) <- ls, elem w (words l)])`.",
      solution: hs`buildIndex :: [(Int, String)] -> [(String, [Int])]
buildIndex ls = [ (w, linesOf w) | w <- sort (nub (concatMap (words . snd) ls)) ]
  where
    linesOf w = sort (nub [ n | (n, l) <- ls, elem w (words l) ])
`,
    },
    {
      k: "write",
      body: md(
        "A spreadsheet is a table from cell names to formulas:",
        "",
        "```",
        "type Cell = String",
        "data Formula = Val Int | Ref Cell | Add Formula Formula | SumOf [Cell]",
        "  deriving (Eq, Show)",
        "type Sheet = [(Cell, Formula)]",
        "",
        "sheet :: Sheet",
        "sheet = [ (\"A1\", Val 5), (\"A2\", Val 7)",
        "        , (\"A3\", Add (Ref \"A1\") (Ref \"A2\"))",
        "        , (\"B1\", SumOf [\"A1\", \"A2\", \"A3\"])",
        "        , (\"B2\", Ref \"C9\") ]",
        "```",
        "",
        "`Ref c` means the value of cell `c`. `SumOf cs` is the sum of the values of the cells `cs`. An empty cell (one not in the sheet) has value 0. Define a function `value :: Sheet -> Cell -> Int` that returns the value of a cell. You may assume no cell refers to itself, directly or indirectly. For example:",
        "",
        "```",
        "ghci> value sheet \"A3\"",
        "12",
        "ghci> value sheet \"B1\"",
        "24",
        "ghci> value sheet \"B2\"",
        "0",
        "```",
      ),
      setup:
        libs +
        hs`
type Cell = String
data Formula = Val Int | Ref Cell | Add Formula Formula | SumOf [Cell]
  deriving (Eq, Show)
type Sheet = [(Cell, Formula)]

sheet :: Sheet
sheet = [ ("A1", Val 5), ("A2", Val 7)
        , ("A3", Add (Ref "A1") (Ref "A2"))
        , ("B1", SumOf ["A1", "A2", "A3"])
        , ("B2", Ref "C9") ]
`,
      starter: hs`value :: Sheet -> Cell -> Int
value s c = undefined
`,
      tests: [
        { expr: 'value sheet "A3"', expected: "12" },
        { expr: 'value sheet "B1"', expected: "24" },
        { expr: 'value sheet "B2"', expected: "0" },
        { expr: 'value sheet "Z9"', expected: "0" },
        { expr: 'value [("X", Add (Val 1) (SumOf ["Y", "Y"])), ("Y", Ref "Z"), ("Z", Val 4)] "X"', expected: "9" },
      ],
      hint: "Use a helper `evalF :: Sheet -> Formula -> Int` with one equation per constructor. `value s c` looks up `c`: `Nothing` gives 0, `Just f` gives `evalF s f`. `evalF` calls `value` for `Ref` and `SumOf`.",
      solution: hs`value :: Sheet -> Cell -> Int
value s c
  = case lookup c s of
      Nothing -> 0
      Just f  -> evalF s f

evalF :: Sheet -> Formula -> Int
evalF s (Val n)    = n
evalF s (Ref c)    = value s c
evalF s (Add a b)  = evalF s a + evalF s b
evalF s (SumOf cs) = sum (map (value s) cs)
`,
    },
    {
      k: "write",
      body: md(
        "Using the rail network:",
        "",
        ...trainBlock,
        "",
        "Define a function `reachable :: Station -> Timetable -> [Station]` that returns every station you can get to from the given station using any number of trains (including zero, so the start station is always included). The result should be in alphabetical order with no repeats. Note that the network has loops (Ayr and Troon link to each other), so your function must not run forever. For example:",
        "",
        "```",
        "ghci> reachable \"Irvine\" net",
        "[\"Glasgow\",\"Irvine\",\"Kilwinning\",\"Largs\"]",
        "ghci> reachable \"Glasgow\" net",
        "[\"Glasgow\"]",
        "```",
      ),
      setup: trainSetup,
      starter: hs`reachable :: Station -> Timetable -> [Station]
reachable start t = undefined
`,
      tests: [
        { expr: 'reachable "Irvine" net', expected: '["Glasgow","Irvine","Kilwinning","Largs"]' },
        { expr: 'reachable "Glasgow" net', expected: '["Glasgow"]' },
        { expr: 'reachable "Ayr" net', expected: '["Ayr","Glasgow","Irvine","Kilwinning","Largs","Troon"]' },
        { expr: 'reachable "Troon" net', expected: '["Ayr","Glasgow","Irvine","Kilwinning","Largs","Troon"]' },
        { expr: 'reachable "X" [("X",[("Y",1)]),("Y",[("X",1)])]', expected: '["X","Y"]' },
      ],
      hint: "Keep a to-do list and a list of stations already seen. Take the next station from the to-do list; if it's been seen, skip it; otherwise mark it seen and add its destinations to the to-do list. Sort the seen list at the end.",
      solution: hs`reachable :: Station -> Timetable -> [Station]
reachable start t = sort (go [start] [])
  where
    go [] seen = seen
    go (s : todo) seen
      | elem s seen = go todo seen
      | otherwise   = go (todo ++ next s) (s : seen)
    next s = map fst (fromMaybe [] (lookup s t))
`,
    },
  ],
};

const extra: DrillSet = {
  id: "b-tables-extra",
  lesson: "",
  level: 5,
  title: "Extra practice",
  intro: md(
    "More of the same lookup-table work, mixed difficulty, so you can keep practising without new ideas.",
    "Toward the end the questions are exam-style: a short description, a type, and a GHCi transcript.",
  ),
  drills: [
    {
      k: "quiz",
      q: "What does `lookup \"b\" [(\"a\", 1), (\"b\", 2), (\"b\", 9)]` give?",
      options: ["`Just 2`", "`Just 9`", "`[2, 9]`", "`Nothing`"],
      answer: 0,
      why: "`lookup` returns the value from the first matching pair and then stops, so the later `(\"b\", 9)` is ignored.",
    },
    {
      k: "predict",
      expr: "[k | (k, v) <- [(\"a\", 1), (\"b\", 2), (\"c\", 0)], v > 0]",
      answer: `["a", "b"]`,
      why: "The comprehension keeps keys whose value is greater than 0. `c` has value 0, so it is dropped.",
    },
    {
      k: "write",
      body: "Write `valuesOf`, which returns the value from every pair, in table order.",
      starter: hs`valuesOf :: [(String, Int)] -> [Int]
valuesOf table = undefined
`,
      tests: [
        { expr: `valuesOf [("a", 1), ("b", 2)]`, expected: "[1, 2]" },
        { expr: "valuesOf []", expected: "[]" },
        { expr: `valuesOf [("x", 0)]`, expected: "[0]" },
        { expr: `valuesOf [("a", 1), ("a", 9)]`, expected: "[1, 9]" },
      ],
      hint: "`[v | (_, v) <- table]`, or `map snd`.",
      solution: hs`valuesOf :: [(String, Int)] -> [Int]
valuesOf table = [v | (_, v) <- table]
`,
    },
    {
      k: "write",
      body: "Write `hasValue`, which is True when the table contains the given Int as a value (not necessarily as a key).",
      starter: hs`hasValue :: Int -> [(String, Int)] -> Bool
hasValue n table = undefined
`,
      tests: [
        { expr: `hasValue 2 [("a", 1), ("b", 2)]`, expected: "True" },
        { expr: `hasValue 9 [("a", 1)]`, expected: "False" },
        { expr: "hasValue 0 []", expected: "False" },
        { expr: `hasValue 1 [("a", 1), ("b", 1)]`, expected: "True" },
      ],
      hint: "`elem n (map snd table)`.",
      solution: hs`hasValue :: Int -> [(String, Int)] -> Bool
hasValue n table = elem n [v | (_, v) <- table]
`,
    },
    {
      k: "write",
      body: "Write `firstKey`, which returns the first key, or `Nothing` if the table is empty.",
      starter: hs`firstKey :: [(String, Int)] -> Maybe String
firstKey table = undefined
`,
      tests: [
        { expr: `firstKey [("a", 1), ("b", 2)]`, expected: `Just "a"` },
        { expr: "firstKey []", expected: "Nothing" },
        { expr: `firstKey [("z", 0)]`, expected: `Just "z"` },
        { expr: `firstKey [("", 1)]`, expected: `Just ""` },
      ],
      hint: "Pattern match: empty is `Nothing`; `(k, _) : _` is `Just k`.",
      solution: hs`firstKey :: [(String, Int)] -> Maybe String
firstKey [] = Nothing
firstKey ((k, _) : _) = Just k
`,
    },
    {
      k: "write",
      body: "Write `scaleAll`, which multiplies every value by the same Int and keeps the keys.",
      starter: hs`scaleAll :: Int -> [(String, Int)] -> [(String, Int)]
scaleAll n table = undefined
`,
      tests: [
        { expr: `scaleAll 10 [("a", 1), ("b", 2)]`, expected: `[("a", 10), ("b", 20)]` },
        { expr: "scaleAll 3 []", expected: "[]" },
        { expr: `scaleAll 0 [("a", 5)]`, expected: `[("a", 0)]` },
        { expr: `scaleAll (-1) [("a", 2)]`, expected: `[("a", -2)]` },
      ],
      hint: "`[(k, n * v) | (k, v) <- table]`.",
      solution: hs`scaleAll :: Int -> [(String, Int)] -> [(String, Int)]
scaleAll n table = [(k, n * v) | (k, v) <- table]
`,
    },
    {
      k: "write",
      body: "Write `keysMatching`, which returns the keys whose value equals a given Int, in table order.",
      starter: hs`keysMatching :: Int -> [(String, Int)] -> [String]
keysMatching n table = undefined
`,
      tests: [
        { expr: `keysMatching 1 [("a", 1), ("b", 2), ("c", 1)]`, expected: `["a", "c"]` },
        { expr: `keysMatching 9 [("a", 1)]`, expected: "[]" },
        { expr: "keysMatching 0 []", expected: "[]" },
        { expr: `keysMatching 0 [("z", 0)]`, expected: `["z"]` },
      ],
      hint: "`[k | (k, v) <- table, v == n]`.",
      solution: hs`keysMatching :: Int -> [(String, Int)] -> [String]
keysMatching n table = [k | (k, v) <- table, v == n]
`,
    },
    {
      k: "write",
      body: "Write `dropValue`, which removes every pair whose value equals a given Int.",
      starter: hs`dropValue :: Int -> [(String, Int)] -> [(String, Int)]
dropValue n table = undefined
`,
      tests: [
        { expr: `dropValue 0 [("a", 1), ("b", 0), ("c", 0)]`, expected: `[("a", 1)]` },
        { expr: `dropValue 1 []`, expected: "[]" },
        { expr: `dropValue 2 [("a", 1)]`, expected: `[("a", 1)]` },
        { expr: `dropValue 5 [("x", 5)]`, expected: "[]" },
      ],
      hint: "`[(k, v) | (k, v) <- table, v /= n]`.",
      solution: hs`dropValue :: Int -> [(String, Int)] -> [(String, Int)]
dropValue n table = [(k, v) | (k, v) <- table, v /= n]
`,
    },
    {
      k: "write",
      body: "Write `addEnd`, which adds a pair at the end of the table. It does not look at whether the key is already there.",
      starter: hs`addEnd :: String -> Int -> [(String, Int)] -> [(String, Int)]
addEnd k v table = undefined
`,
      tests: [
        { expr: `addEnd "c" 3 [("a", 1)]`, expected: `[("a", 1), ("c", 3)]` },
        { expr: `addEnd "a" 9 []`, expected: `[("a", 9)]` },
        { expr: `addEnd "a" 2 [("a", 1)]`, expected: `[("a", 1), ("a", 2)]` },
        { expr: `addEnd "z" 0 [("x", 1), ("y", 2)]`, expected: `[("x", 1), ("y", 2), ("z", 0)]` },
      ],
      hint: "`table ++ [(k, v)]`.",
      solution: hs`addEnd :: String -> Int -> [(String, Int)] -> [(String, Int)]
addEnd k v table = table ++ [(k, v)]
`,
    },
    {
      k: "write",
      body: "Write `maxValue`, the largest value in a non-empty table. You may assume the table is not empty.",
      starter: hs`maxValue :: [(String, Int)] -> Int
maxValue table = undefined
`,
      tests: [
        { expr: `maxValue [("a", 1), ("b", 4), ("c", 2)]`, expected: "4" },
        { expr: `maxValue [("a", 0)]`, expected: "0" },
        { expr: `maxValue [("a", -3), ("b", -1)]`, expected: "-1" },
        { expr: `maxValue [("a", 5), ("b", 5)]`, expected: "5" },
      ],
      hint: "`maximum (map snd table)`.",
      solution: hs`maxValue :: [(String, Int)] -> Int
maxValue table = maximum [v | (_, v) <- table]
`,
    },
    {
      k: "write",
      body: "Write `getOr`, which looks up a key and returns the given default when the key is missing.",
      starter: hs`getOr :: Int -> String -> [(String, Int)] -> Int
getOr def k table = undefined
`,
      tests: [
        { expr: `getOr 0 "b" [("a", 1), ("b", 2)]`, expected: "2" },
        { expr: `getOr 0 "z" [("a", 1)]`, expected: "0" },
        { expr: `getOr 7 "z" []`, expected: "7" },
        { expr: `getOr 0 "a" [("a", 1), ("a", 9)]`, expected: "1", label: "first match" },
      ],
      hint: "`fromMaybe def (lookup k table)`. You will need `import Data.Maybe (fromMaybe)` in the starter, or write it with a `case`.",
      solution: hs`getOr :: Int -> String -> [(String, Int)] -> Int
getOr def k table = case lookup k table of
  Just v  -> v
  Nothing -> def
`,
    },
    {
      k: "write",
      body: "Write `onlyPositive`, which keeps the pairs whose value is strictly greater than 0.",
      starter: hs`onlyPositive :: [(String, Int)] -> [(String, Int)]
onlyPositive table = undefined
`,
      tests: [
        { expr: `onlyPositive [("a", 1), ("b", 0), ("c", -2)]`, expected: `[("a", 1)]` },
        { expr: "onlyPositive []", expected: "[]" },
        { expr: `onlyPositive [("a", 0)]`, expected: "[]" },
        { expr: `onlyPositive [("x", 3), ("y", 1)]`, expected: `[("x", 3), ("y", 1)]` },
      ],
      hint: "`[(k, v) | (k, v) <- table, v > 0]`.",
      solution: hs`onlyPositive :: [(String, Int)] -> [(String, Int)]
onlyPositive table = [(k, v) | (k, v) <- table, v > 0]
`,
    },
    {
      k: "write",
      body: "Write `tableSize`, the number of pairs in the table (duplicates count separately).",
      starter: hs`tableSize :: [(String, Int)] -> Int
tableSize table = undefined
`,
      tests: [
        { expr: `tableSize [("a", 1), ("b", 2)]`, expected: "2" },
        { expr: "tableSize []", expected: "0" },
        { expr: `tableSize [("a", 1), ("a", 1)]`, expected: "2" },
        { expr: `tableSize [("z", 0)]`, expected: "1" },
      ],
      hint: "This is just `length`.",
      solution: hs`tableSize :: [(String, Int)] -> Int
tableSize table = length table
`,
    },
    {
      k: "write",
      body: "Write `renameKey`, which replaces every copy of one key with another and leaves values alone. Other keys are unchanged.",
      starter: hs`renameKey :: String -> String -> [(String, Int)] -> [(String, Int)]
renameKey old new table = undefined
`,
      tests: [
        { expr: `renameKey "a" "z" [("a", 1), ("b", 2), ("a", 3)]`, expected: `[("z", 1), ("b", 2), ("z", 3)]` },
        { expr: `renameKey "a" "z" []`, expected: "[]" },
        { expr: `renameKey "x" "y" [("a", 1)]`, expected: `[("a", 1)]` },
        { expr: `renameKey "a" "a" [("a", 1)]`, expected: `[("a", 1)]` },
      ],
      hint: "`[(if k == old then new else k, v) | (k, v) <- table]`.",
      solution: hs`renameKey :: String -> String -> [(String, Int)] -> [(String, Int)]
renameKey old new table = [(if k == old then new else k, v) | (k, v) <- table]
`,
    },
    {
      k: "write",
      body: "Write `lookupAll`, which returns every value stored under a key, in table order (a key may appear more than once).",
      starter: hs`lookupAll :: String -> [(String, Int)] -> [Int]
lookupAll k table = undefined
`,
      tests: [
        { expr: `lookupAll "a" [("a", 1), ("b", 2), ("a", 9)]`, expected: "[1, 9]" },
        { expr: `lookupAll "z" [("a", 1)]`, expected: "[]" },
        { expr: `lookupAll "a" []`, expected: "[]" },
        { expr: `lookupAll "b" [("b", 0)]`, expected: "[0]" },
      ],
      hint: "`[v | (k', v) <- table, k' == k]`.",
      solution: hs`lookupAll :: String -> [(String, Int)] -> [Int]
lookupAll k table = [v | (k', v) <- table, k' == k]
`,
    },
    {
      k: "write",
      body: "Write `missingKeys`, which returns the names from a list that do not appear as keys in the table, in the list's order. Duplicates in the list are kept.",
      starter: hs`missingKeys :: [String] -> [(String, Int)] -> [String]
missingKeys names table = undefined
`,
      tests: [
        { expr: `missingKeys ["a", "z", "b"] [("a", 1), ("b", 2)]`, expected: `["z"]` },
        { expr: `missingKeys ["a"] []`, expected: `["a"]` },
        { expr: `missingKeys [] [("a", 1)]`, expected: "[]" },
        { expr: `missingKeys ["a", "a"] [("b", 1)]`, expected: `["a", "a"]` },
      ],
      hint: "Let `ks = map fst table`, then keep names with `not (elem name ks)`.",
      solution: hs`missingKeys :: [String] -> [(String, Int)] -> [String]
missingKeys names table = [n | n <- names, not (elem n (map fst table))]
`,
    },
    {
      k: "write",
      body: "Write `bothHave`, which is True when every key of the first table also appears as a key of the second (values do not matter). Empty first table is True.",
      starter: hs`bothHave :: [(String, Int)] -> [(String, Int)] -> Bool
bothHave t1 t2 = undefined
`,
      tests: [
        { expr: `bothHave [("a", 1)] [("a", 9), ("b", 2)]`, expected: "True" },
        { expr: `bothHave [("a", 1), ("c", 0)] [("a", 1)]`, expected: "False" },
        { expr: `bothHave [] [("a", 1)]`, expected: "True" },
        { expr: `bothHave [("a", 1)] []`, expected: "False" },
      ],
      hint: "For every key of `t1`, `elem` it in `map fst t2`.",
      solution: hs`bothHave :: [(String, Int)] -> [(String, Int)] -> Bool
bothHave t1 t2 = and [elem k (map fst t2) | (k, _) <- t1]
`,
    },
    {
      k: "write",
      body: "Write `countsOf`, which, given a list of keys, returns how many times each appears in the table (as a key), in the same order as the list.",
      starter: hs`countsOf :: [String] -> [(String, Int)] -> [Int]
countsOf names table = undefined
`,
      tests: [
        { expr: `countsOf ["a", "b"] [("a", 1), ("a", 2), ("c", 3)]`, expected: "[2, 0]" },
        { expr: `countsOf [] [("a", 1)]`, expected: "[]" },
        { expr: `countsOf ["a"] []`, expected: "[0]" },
        { expr: `countsOf ["x", "x"] [("x", 1)]`, expected: "[1, 1]" },
      ],
      hint: "For each name, `length [() | (k, _) <- table, k == name]`.",
      solution: hs`countsOf :: [String] -> [(String, Int)] -> [Int]
countsOf names table = [length [() | (k, _) <- table, k == n] | n <- names]
`,
    },
    {
      k: "write",
      body: "Write `invertOne`, which turns `[(key, value)]` into `[(value, key)]`. If a value appears more than once, keep every pair.",
      starter: hs`invertOne :: [(String, Int)] -> [(Int, String)]
invertOne table = undefined
`,
      tests: [
        { expr: `invertOne [("a", 1), ("b", 2)]`, expected: `[(1, "a"), (2, "b")]` },
        { expr: "invertOne []", expected: "[]" },
        { expr: `invertOne [("a", 1), ("b", 1)]`, expected: `[(1, "a"), (1, "b")]` },
        { expr: `invertOne [("z", 0)]`, expected: `[(0, "z")]` },
      ],
      hint: "`[(v, k) | (k, v) <- table]`.",
      solution: hs`invertOne :: [(String, Int)] -> [(Int, String)]
invertOne table = [(v, k) | (k, v) <- table]
`,
    },
    {
      k: "write",
      body: "Write `zipKeys`, which pairs each name with the corresponding Int, stopping when either list runs out.",
      starter: hs`zipKeys :: [String] -> [Int] -> [(String, Int)]
zipKeys names nums = undefined
`,
      tests: [
        { expr: `zipKeys ["a", "b"] [1, 2, 3]`, expected: `[("a", 1), ("b", 2)]` },
        { expr: `zipKeys ["a"] []`, expected: "[]" },
        { expr: `zipKeys [] [1]`, expected: "[]" },
        { expr: `zipKeys ["x"] [0]`, expected: `[("x", 0)]` },
      ],
      hint: "`zip names nums`.",
      solution: hs`zipKeys :: [String] -> [Int] -> [(String, Int)]
zipKeys names nums = zip names nums
`,
    },
    {
      k: "write",
      body: "Write `subtractTables`, which subtracts values in the second table from matching keys in the first. Keys only in the first stay as they are. Keys only in the second are ignored. Use the first occurrence of each key in the second table.",
      starter: hs`subtractTables :: [(String, Int)] -> [(String, Int)] -> [(String, Int)]
subtractTables t1 t2 = undefined
`,
      tests: [
        { expr: `subtractTables [("a", 10), ("b", 5)] [("a", 3)]`, expected: `[("a", 7), ("b", 5)]` },
        { expr: `subtractTables [("a", 1)] []`, expected: `[("a", 1)]` },
        { expr: `subtractTables [] [("a", 1)]`, expected: "[]" },
        { expr: `subtractTables [("a", 4)] [("a", 1), ("a", 9)]`, expected: `[("a", 3)]`, label: "first occurrence in t2" },
      ],
      hint: "For each pair in `t1`, look up the key in `t2` and subtract `fromMaybe 0` of that lookup.",
      solution: hs`subtractTables :: [(String, Int)] -> [(String, Int)] -> [(String, Int)]
subtractTables t1 t2 = [(k, v - maybe 0 id (lookup k t2)) | (k, v) <- t1]
`,
    },
    {
      k: "write",
      body: "Write `replaceVal`, which sets the value of a key wherever it appears. If the key is not there, the table is unchanged.",
      starter: hs`replaceVal :: String -> Int -> [(String, Int)] -> [(String, Int)]
replaceVal k new table = undefined
`,
      tests: [
        { expr: `replaceVal "a" 9 [("a", 1), ("b", 2), ("a", 3)]`, expected: `[("a", 9), ("b", 2), ("a", 9)]` },
        { expr: `replaceVal "z" 9 [("a", 1)]`, expected: `[("a", 1)]` },
        { expr: `replaceVal "a" 1 []`, expected: "[]" },
        { expr: `replaceVal "b" 0 [("b", 4)]`, expected: `[("b", 0)]` },
      ],
      hint: "`[(k', if k' == k then new else v) | (k', v) <- table]`.",
      solution: hs`replaceVal :: String -> Int -> [(String, Int)] -> [(String, Int)]
replaceVal k new table = [(k', if k' == k then new else v) | (k', v) <- table]
`,
    },
    {
      k: "write",
      body: "Write `unionKeys`, the list of keys that appear in either table, first table first, with duplicates removed.",
      setup: libs,
      starter: hs`unionKeys :: [(String, Int)] -> [(String, Int)] -> [String]
unionKeys t1 t2 = undefined
`,
      tests: [
        { expr: `unionKeys [("a", 1), ("b", 2)] [("b", 9), ("c", 3)]`, expected: `["a", "b", "c"]` },
        { expr: `unionKeys [] [("a", 1)]`, expected: `["a"]` },
        { expr: `unionKeys [("a", 1)] []`, expected: `["a"]` },
        { expr: `unionKeys [("a", 1), ("a", 2)] [("a", 3)]`, expected: `["a"]` },
      ],
      hint: "`nub (map fst t1 ++ map fst t2)`. `nub` is in `Data.List` and is already imported in the given code.",
      solution: hs`unionKeys :: [(String, Int)] -> [(String, Int)] -> [String]
unionKeys t1 t2 = nub (map fst t1 ++ map fst t2)
`,
    },
    {
      k: "write",
      body: "Write `filterTable`, which keeps the pairs whose value passes a test.",
      starter: hs`filterTable :: (Int -> Bool) -> [(String, Int)] -> [(String, Int)]
filterTable p table = undefined
`,
      tests: [
        { expr: `filterTable even [("a", 1), ("b", 2), ("c", 4)]`, expected: `[("b", 2), ("c", 4)]` },
        { expr: `filterTable even []`, expected: "[]" },
        { expr: `filterTable (> 0) [("a", 0)]`, expected: "[]" },
        { expr: `filterTable (const True) [("a", 1)]`, expected: `[("a", 1)]` },
      ],
      hint: "`[(k, v) | (k, v) <- table, p v]`.",
      solution: hs`filterTable :: (Int -> Bool) -> [(String, Int)] -> [(String, Int)]
filterTable p table = [(k, v) | (k, v) <- table, p v]
`,
    },
    {
      k: "write",
      body: "Write `minKey`, the key whose value is the smallest in a non-empty table. If several share that value, return the first of them. You may assume the table is not empty.",
      starter: hs`minKey :: [(String, Int)] -> String
minKey table = undefined
`,
      tests: [
        { expr: `minKey [("a", 3), ("b", 1), ("c", 1)]`, expected: `"b"` },
        { expr: `minKey [("z", 0)]`, expected: `"z"` },
        { expr: `minKey [("a", -1), ("b", 4)]`, expected: `"a"` },
        { expr: `minKey [("a", 5), ("b", 5)]`, expected: `"a"` },
      ],
      hint: "Fold through the table keeping the best pair so far, or `fst (minimum [(v, k) | (k, v) <- table])` — but that would pick the alphabetically first key on a tie. Safer: a one-pass helper.",
      solution: hs`minKey :: [(String, Int)] -> String
minKey ((k0, v0) : rest) = go k0 v0 rest
  where
    go k _ [] = k
    go k v ((k', v') : xs)
      | v' < v    = go k' v' xs
      | otherwise = go k v xs
`,
    },
    {
      k: "write",
      body: "Write `followDefault`, which starts from a name and follows a table of `[(from, to)]` at most `n` times. If a name is missing, stay there. Return the name you land on.",
      starter: hs`followDefault :: Int -> [(String, String)] -> String -> String
followDefault n table start = undefined
`,
      tests: [
        { expr: `followDefault 2 [("a", "b"), ("b", "c")] "a"`, expected: `"c"` },
        { expr: `followDefault 0 [("a", "b")] "a"`, expected: `"a"` },
        { expr: `followDefault 3 [("a", "b")] "z"`, expected: `"z"` },
        { expr: `followDefault 1 [("a", "b"), ("b", "c")] "a"`, expected: `"b"` },
        { expr: `followDefault 5 [("x", "x")] "x"`, expected: `"x"` },
      ],
      hint: "If `n <= 0` return `start`. Otherwise look up `start`; if you get `Just next`, recurse with `n - 1`, else return `start`.",
      solution: hs`followDefault :: Int -> [(String, String)] -> String -> String
followDefault n table start
  | n <= 0    = start
  | otherwise = case lookup start table of
      Nothing   -> start
      Just next -> followDefault (n - 1) table next
`,
    },
    {
      k: "write",
      body: "Write `mergeKeep`, which concatenates two tables and then keeps only the first pair for each key.",
      setup: libs,
      starter: hs`mergeKeep :: [(String, Int)] -> [(String, Int)] -> [(String, Int)]
mergeKeep t1 t2 = undefined
`,
      tests: [
        { expr: `mergeKeep [("a", 1), ("b", 2)] [("b", 9), ("c", 3)]`, expected: `[("a", 1), ("b", 2), ("c", 3)]` },
        { expr: `mergeKeep [] [("a", 1)]`, expected: `[("a", 1)]` },
        { expr: `mergeKeep [("a", 1)] []`, expected: `[("a", 1)]` },
        { expr: `mergeKeep [("a", 1), ("a", 2)] [("a", 3)]`, expected: `[("a", 1)]` },
      ],
      hint: "Walk `t1 ++ t2` keeping a pair when its key has not been seen yet. `nub` by key, not `nub` on the whole pair.",
      solution: hs`mergeKeep :: [(String, Int)] -> [(String, Int)] -> [(String, Int)]
mergeKeep t1 t2 = go (t1 ++ t2) []
  where
    go [] _ = []
    go ((k, v) : rest) seen
      | elem k seen = go rest seen
      | otherwise   = (k, v) : go rest (k : seen)
`,
    },
    {
      k: "write",
      body: "Write `avgOf`, the integer average (using `div`) of all values stored under a key. If the key is missing, return `Nothing`.",
      starter: hs`avgOf :: String -> [(String, Int)] -> Maybe Int
avgOf k table = undefined
`,
      tests: [
        { expr: `avgOf "a" [("a", 2), ("b", 9), ("a", 4)]`, expected: "Just 3" },
        { expr: `avgOf "z" [("a", 1)]`, expected: "Nothing" },
        { expr: `avgOf "a" []`, expected: "Nothing" },
        { expr: `avgOf "a" [("a", 5)]`, expected: "Just 5" },
        { expr: `avgOf "a" [("a", 1), ("a", 2)]`, expected: "Just 1", label: "div rounds toward -Infinity" },
      ],
      hint: "Collect the values, then if the list is empty Nothing, else Just (div (sum vs) (length vs)).",
      solution: hs`avgOf :: String -> [(String, Int)] -> Maybe Int
avgOf k table =
  let vs = [v | (k', v) <- table, k' == k]
  in if null vs then Nothing else Just (div (sum vs) (length vs))
`,
    },
    {
      k: "quiz",
      q: "You want the names of everyone whose score is at least 50 from `marks :: [(String, Int)]`. Which expression is right?",
      options: [
        "`[n | (n, s) <- marks, s >= 50]`",
        "`lookup 50 marks`",
        "`map fst marks`",
        "`[s | (n, s) <- marks, s >= 50]`",
      ],
      answer: 0,
      why: "You need the names (`n`), not the scores, and you keep a row only when `s >= 50`. `lookup` looks up a key, not a value.",
    },
    {
      k: "predict",
      expr: "maybe 0 id (lookup \"b\" [(\"a\", 1), (\"c\", 3)])",
      answer: "0",
      why: "`lookup \"b\"` is `Nothing`, and `maybe 0 id Nothing` is the default 0.",
    },
    {
      k: "write",
      setup: kitchenSetup,
      body: md(
        "Using the kitchen types:",
        "",
        ...kitchenBlock,
        "",
        "Define a function `inStock :: Stock -> [Item]` that returns the names of items with a strictly positive amount, in table order. For example:",
        "",
        "```",
        "ghci> inStock pantry",
        "[\"flour\",\"egg\",\"milk\"]",
        "ghci> inStock []",
        "[]",
        "```",
      ),
      starter: hs`inStock :: Stock -> [Item]
inStock stock = undefined
`,
      tests: [
        { expr: "inStock pantry", expected: `["flour", "egg", "milk"]` },
        { expr: "inStock []", expected: "[]" },
        { expr: `inStock [("sugar", 0)]`, expected: "[]" },
        { expr: `inStock [("butter", 100)]`, expected: `["butter"]` },
      ],
      hint: "`[item | (item, n) <- stock, n > 0]`.",
      solution: hs`inStock :: Stock -> [Item]
inStock stock = [item | (item, n) <- stock, n > 0]
`,
    },
    {
      k: "write",
      setup: kitchenSetup,
      body: md(
        "Using the kitchen types:",
        "",
        ...kitchenBlock,
        "",
        "Define a function `shortfall :: Recipe -> Stock -> [(Item, Int)]` that, for each ingredient in the recipe, records how many more you need if stock is not enough. Ingredients you already have enough of are omitted. An ingredient missing from stock is treated as 0. For example:",
        "",
        "```",
        "ghci> shortfall cake pantry",
        "[(\"sugar\",200),(\"butter\",100)]",
        "ghci> shortfall pancakes pantry",
        "[]",
        "```",
      ),
      starter: hs`shortfall :: Recipe -> Stock -> [(Item, Int)]
shortfall recipe stock = undefined
`,
      tests: [
        { expr: "shortfall cake pantry", expected: `[("sugar", 200), ("butter", 100)]` },
        { expr: "shortfall pancakes pantry", expected: "[]" },
        { expr: "shortfall [] pantry", expected: "[]" },
        { expr: `shortfall [("egg", 10)] pantry`, expected: `[("egg", 4)]` },
        { expr: `shortfall [("egg", 1)] []`, expected: `[("egg", 1)]` },
      ],
      hint: "For each `(item, need)` in the recipe, let `have = fromMaybe 0 (lookup item stock)`. Keep `(item, need - have)` when `need > have`.",
      solution: hs`shortfall :: Recipe -> Stock -> [(Item, Int)]
shortfall recipe stock =
  [ (item, need - have)
  | (item, need) <- recipe
  , let have = fromMaybe 0 (lookup item stock)
  , need > have
  ]
`,
    },
    {
      k: "write",
      setup: librarySetup,
      body: md(
        "Using the library types:",
        "",
        ...libraryBlock,
        "",
        "Define a function `borrowedCount :: Member -> Loans -> Int` that returns how many books a member currently has out. A member who is not in the table has 0. For example:",
        "",
        "```",
        "ghci> borrowedCount \"ann\" loans",
        "2",
        "ghci> borrowedCount \"li\" loans",
        "0",
        "ghci> borrowedCount \"zoe\" loans",
        "0",
        "```",
      ),
      starter: hs`borrowedCount :: Member -> Loans -> Int
borrowedCount m ls = undefined
`,
      tests: [
        { expr: `borrowedCount "ann" loans`, expected: "2" },
        { expr: `borrowedCount "li" loans`, expected: "0" },
        { expr: `borrowedCount "zoe" loans`, expected: "0" },
        { expr: `borrowedCount "raj" loans`, expected: "1" },
        { expr: `borrowedCount "ann" []`, expected: "0" },
      ],
      hint: "`length (fromMaybe [] (lookup m ls))`.",
      solution: hs`borrowedCount :: Member -> Loans -> Int
borrowedCount m ls = length (fromMaybe [] (lookup m ls))
`,
    },
    {
      k: "write",
      setup: librarySetup,
      body: md(
        "Using the library types:",
        "",
        ...libraryBlock,
        "",
        "Define a function `heldBy :: ISBN -> Loans -> Maybe Member` that returns the member who currently has that book, or `Nothing` if nobody does. For example:",
        "",
        "```",
        "ghci> heldBy 102 loans",
        "Just \"raj\"",
        "ghci> heldBy 104 loans",
        "Nothing",
        "```",
      ),
      starter: hs`heldBy :: ISBN -> Loans -> Maybe Member
heldBy isbn ls = undefined
`,
      tests: [
        { expr: "heldBy 102 loans", expected: `Just "raj"` },
        { expr: "heldBy 104 loans", expected: "Nothing" },
        { expr: "heldBy 101 loans", expected: `Just "ann"` },
        { expr: "heldBy 101 []", expected: "Nothing" },
      ],
      hint: "Walk the loans. If `elem isbn` the member's list, return `Just` that member; otherwise keep going.",
      solution: hs`heldBy :: ISBN -> Loans -> Maybe Member
heldBy _ [] = Nothing
heldBy isbn ((m, books) : rest)
  | elem isbn books = Just m
  | otherwise       = heldBy isbn rest
`,
    },
    {
      k: "write",
      setup: trainSetup,
      body: md(
        "Using the timetable types:",
        "",
        ...trainBlock,
        "",
        "Define a function `hopTime :: Station -> Station -> Timetable -> Maybe Int` that returns the time of a direct hop, or `Nothing` if there is no direct link. For example:",
        "",
        "```",
        "ghci> hopTime \"Ayr\" \"Troon\" net",
        "Just 10",
        "ghci> hopTime \"Ayr\" \"Glasgow\" net",
        "Nothing",
        "```",
      ),
      starter: hs`hopTime :: Station -> Station -> Timetable -> Maybe Int
hopTime from to t = undefined
`,
      tests: [
        { expr: `hopTime "Ayr" "Troon" net`, expected: "Just 10" },
        { expr: `hopTime "Ayr" "Glasgow" net`, expected: "Nothing" },
        { expr: `hopTime "Largs" "Ayr" net`, expected: "Nothing" },
        { expr: `hopTime "Troon" "Ayr" net`, expected: "Just 10" },
        { expr: `hopTime "Ayr" "Troon" []`, expected: "Nothing" },
      ],
      hint: "Look up `from` to get its list of `(Station, Int)`, then `lookup to` in that list. Both lookups can fail.",
      solution: hs`hopTime :: Station -> Station -> Timetable -> Maybe Int
hopTime from to t = case lookup from t of
  Nothing    -> Nothing
  Just dests -> lookup to dests
`,
    },
    {
      k: "write",
      setup: trainSetup,
      body: md(
        "Using the timetable types:",
        "",
        ...trainBlock,
        "",
        "Define a function `deadEnds :: Timetable -> [Station]` that returns the stations whose destination list is empty, in timetable order. For example:",
        "",
        "```",
        "ghci> deadEnds net",
        "[\"Largs\"]",
        "```",
      ),
      starter: hs`deadEnds :: Timetable -> [Station]
deadEnds t = undefined
`,
      tests: [
        { expr: "deadEnds net", expected: `["Largs"]` },
        { expr: "deadEnds []", expected: "[]" },
        { expr: `deadEnds [("X", [])]`, expected: `["X"]` },
        { expr: `deadEnds [("X", [("Y", 1)]), ("Y", [])]`, expected: `["Y"]` },
      ],
      hint: "`[s | (s, dests) <- t, null dests]`.",
      solution: hs`deadEnds :: Timetable -> [Station]
deadEnds t = [s | (s, dests) <- t, null dests]
`,
    },
    {
      k: "write",
      setup:
        libs +
        hs`
type Student = String
type Mark = Int
type Marks = [(Student, Mark)]

cohort :: Marks
cohort = [("ann", 72), ("raj", 45), ("li", 72), ("mo", 38)]
`,
      body: md(
        "A class list stores one mark per student:",
        "",
        "```",
        "type Student = String",
        "type Mark = Int",
        "type Marks = [(Student, Mark)]",
        "```",
        "",
        "Define a function `passed :: Int -> Marks -> [Student]` that returns the students whose mark is at least the pass mark, in table order. For example:",
        "",
        "```",
        "ghci> passed 40 cohort",
        "[\"ann\",\"raj\",\"li\"]",
        "ghci> passed 80 cohort",
        "[]",
        "```",
      ),
      starter: hs`passed :: Int -> Marks -> [Student]
passed passMark ms = undefined
`,
      tests: [
        { expr: "passed 40 cohort", expected: `["ann", "raj", "li"]` },
        { expr: "passed 80 cohort", expected: "[]" },
        { expr: "passed 72 cohort", expected: `["ann", "li"]` },
        { expr: "passed 0 []", expected: "[]" },
      ],
      hint: "`[s | (s, m) <- ms, m >= passMark]`.",
      solution: hs`passed :: Int -> Marks -> [Student]
passed passMark ms = [s | (s, m) <- ms, m >= passMark]
`,
    },
    {
      k: "write",
      setup:
        libs +
        hs`
type Name = String
type Pence = Int
type Menu = [(Name, Pence)]
type Basket = [Name]

menu :: Menu
menu = [("tea", 120), ("cake", 250), ("soup", 300)]
`,
      body: md(
        "A cafe menu maps item names to prices in pence. A basket is a list of names (repeats allowed):",
        "",
        "```",
        "type Menu = [(String, Int)]",
        "type Basket = [String]",
        "```",
        "",
        "Define a function `bill :: Menu -> Basket -> Int` that adds up the prices. An unknown name costs 0. For example:",
        "",
        "```",
        "ghci> bill menu [\"tea\", \"cake\", \"tea\"]",
        "490",
        "ghci> bill menu [\"wine\"]",
        "0",
        "```",
      ),
      starter: hs`bill :: Menu -> Basket -> Int
bill menu basket = undefined
`,
      tests: [
        { expr: `bill menu ["tea", "cake", "tea"]`, expected: "490" },
        { expr: `bill menu ["wine"]`, expected: "0" },
        { expr: "bill menu []", expected: "0" },
        { expr: `bill [] ["tea"]`, expected: "0" },
        { expr: `bill menu ["soup"]`, expected: "300" },
      ],
      hint: "`sum [fromMaybe 0 (lookup name menu) | name <- basket]`.",
      solution: hs`bill :: Menu -> Basket -> Int
bill menu basket = sum [fromMaybe 0 (lookup name menu) | name <- basket]
`,
    },
    {
      k: "write",
      setup:
        libs +
        hs`
type Alias = [(String, String)]

aliases :: Alias
aliases = [("bob", "robert"), ("liz", "elizabeth"), ("robert", "rob")]
`,
      body: md(
        "A nickname table maps a name to another name. Define a function `resolve :: Int -> [(String, String)] -> String -> String` that follows the table at most `n` steps. Stop early if the current name is not a key. For example:",
        "",
        "```",
        "ghci> resolve 1 aliases \"bob\"",
        "\"robert\"",
        "ghci> resolve 2 aliases \"bob\"",
        "\"rob\"",
        "ghci> resolve 9 aliases \"ann\"",
        "\"ann\"",
        "```",
      ),
      starter: hs`resolve :: Int -> [(String, String)] -> String -> String
resolve n table name = undefined
`,
      tests: [
        { expr: `resolve 1 aliases "bob"`, expected: `"robert"` },
        { expr: `resolve 2 aliases "bob"`, expected: `"rob"` },
        { expr: `resolve 9 aliases "ann"`, expected: `"ann"` },
        { expr: `resolve 0 aliases "bob"`, expected: `"bob"` },
        { expr: `resolve 3 aliases "liz"`, expected: `"elizabeth"` },
      ],
      hint: "Same idea as following a chain: if `n <= 0` stop; otherwise `lookup` and either recurse or stay.",
      solution: hs`resolve :: Int -> [(String, String)] -> String -> String
resolve n table name
  | n <= 0    = name
  | otherwise = case lookup name table of
      Nothing -> name
      Just n' -> resolve (n - 1) table n'
`,
    },
    {
      k: "write",
      setup:
        libs +
        hs`
type City = String
type Flights = [(City, [City])]

flights :: Flights
flights =
  [ ("GLA", ["EDI", "LHR"])
  , ("EDI", ["LHR"])
  , ("LHR", ["JFK"])
  , ("JFK", [])
  ]
`,
      body: md(
        "A flight map records, for each city, the cities you can fly to directly:",
        "",
        "```",
        "type Flights = [(String, [String])]",
        "```",
        "",
        "Define a function `canFly :: City -> City -> Flights -> Bool` that is True when there is a direct flight from the first city to the second. For example:",
        "",
        "```",
        "ghci> canFly \"GLA\" \"EDI\" flights",
        "True",
        "ghci> canFly \"GLA\" \"JFK\" flights",
        "False",
        "```",
      ),
      starter: hs`canFly :: City -> City -> Flights -> Bool
canFly from to fs = undefined
`,
      tests: [
        { expr: `canFly "GLA" "EDI" flights`, expected: "True" },
        { expr: `canFly "GLA" "JFK" flights`, expected: "False" },
        { expr: `canFly "JFK" "GLA" flights`, expected: "False" },
        { expr: `canFly "EDI" "LHR" flights`, expected: "True" },
        { expr: `canFly "GLA" "EDI" []`, expected: "False" },
      ],
      hint: "`elem to (fromMaybe [] (lookup from fs))`.",
      solution: hs`canFly :: City -> City -> Flights -> Bool
canFly from to fs = elem to (fromMaybe [] (lookup from fs))
`,
    },
  ],
};

export const book: Book = {
  id: "b-tables",
  order: 3,
  title: "Lookup tables",
  blurb: "Association lists [(key, value)]: lookups with defaults, reverse lookups, insert-or-replace, counts, merges, tables of tables and renaming.",
  sets: [level1, level2, level3, level4, extra],
};
