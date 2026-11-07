import { type Book, type DrillSet, hs, md } from "../schema.ts";

// ---------------------------------------------------------------------------
// Level 1: Warm-up
// ---------------------------------------------------------------------------

const level1: DrillSet = {
  id: "b-lists-l1",
  lesson: "",
  level: 1,
  title: "Level 1: Warm-up",
  intro: md(
    "One idea at a time: a pattern for the empty list `[]`, a pattern for a list with a first element `(x : xs)`, and a recursive call on the rest. Most starters already have the equations written; you fill in the right-hand sides.",
    "",
    "```",
    "count :: [a] -> Int",
    "count []       = 0              -- base case: nothing left",
    "count (_ : xs) = 1 + count xs   -- one for this element, plus the rest",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: "Which pattern matches the list `[5]`, and what names does it bind?",
      options: [
        "`[]` matches, binding nothing",
        "`(x : xs)` matches, with `x = 5` and `xs = []`",
        "`(x : xs)` matches, with `x = 5` and `xs = 5`",
        "Neither: `[5]` can only be matched by the pattern `[x]`",
      ],
      answer: 1,
      why: "`[5]` is shorthand for `5 : []`. So `(x : xs)` fits, with `x` the first element and `xs` the rest, which is the empty list. (`[x]` would also match, but `(x : xs)` matches too.)",
    },
    {
      k: "predict",
      expr: "let f [] = 0; f (x : _) = x in f [7, 8, 9]",
      answer: "7",
      why: "The list isn't empty, so the second equation is used. `x` is the first element, 7. The `_` ignores the rest.",
    },
    {
      k: "write",
      body: "Write `mySum`, which adds up a list of Ints, by recursion. The equations are there: fill in the two right-hand sides.",
      starter: hs`mySum :: [Int] -> Int
mySum [] = undefined
mySum (x : xs) = undefined
`,
      tests: [
        { expr: "mySum [1, 2, 3]", expected: "6" },
        { expr: "mySum []", expected: "0", label: "the empty list adds up to 0" },
        { expr: "mySum [5]", expected: "5" },
        { expr: "mySum [-2, 2, 7]", expected: "7" },
      ],
      hint: "The sum of nothing is `0`. The sum of `x : xs` is `x` plus the sum of `xs`.",
      solution: hs`mySum :: [Int] -> Int
mySum [] = 0
mySum (x : xs) = x + mySum xs
`,
      banned: ["sum", "foldr", "foldl"],
    },
    {
      k: "predict",
      expr: "let f [] = []; f (x : xs) = x * 2 : f xs in f [1, 2, 3]",
      answer: "[2, 4, 6]",
      why: "Each step puts `x * 2` on the front of the answer for the rest: `2 : 4 : 6 : []`, which is `[2, 4, 6]`.",
    },
    {
      k: "write",
      body: "Write `myLength`, which counts the elements of any list.",
      starter: hs`myLength :: [a] -> Int
myLength [] = undefined
myLength (_ : xs) = undefined
`,
      tests: [
        { expr: `myLength "hello"`, expected: "5" },
        { expr: "myLength ([] :: [Int])", expected: "0" },
        { expr: "myLength [True]", expected: "1" },
        { expr: "myLength [1, 1, 1, 1 :: Int]", expected: "4", label: "duplicates still count" },
      ],
      hint: "An empty list has length 0. Otherwise it's 1 more than the length of the rest.",
      solution: hs`myLength :: [a] -> Int
myLength [] = 0
myLength (_ : xs) = 1 + myLength xs
`,
      banned: ["length"],
    },
    {
      k: "quiz",
      q: md(
        "What happens when you run `count [4, 5]`?",
        "",
        "```",
        "count :: [Int] -> Int",
        "count (x : xs) = 1 + count xs",
        "```",
      ),
      options: [
        "It gives 2",
        "It loops forever",
        "It crashes with a \"Non-exhaustive patterns\" error",
        "It doesn't compile",
      ],
      answer: 2,
      why: "`count [4, 5]` calls `count [5]`, which calls `count []`. No equation matches `[]`, so the program crashes. Every recursive list function needs a base case. (It does compile: GHC only warns about missing patterns.)",
    },
    {
      k: "write",
      body: "Write `doubleAll`, which doubles every number in a list, using recursion (not `map`).",
      starter: hs`doubleAll :: [Int] -> [Int]
doubleAll [] = undefined
doubleAll (x : xs) = undefined
`,
      tests: [
        { expr: "doubleAll [1, 2, 3]", expected: "[2, 4, 6]" },
        { expr: "doubleAll []", expected: "[]" },
        { expr: "doubleAll [-4]", expected: "[-8]" },
        { expr: "doubleAll [0, 5, 0]", expected: "[0, 10, 0]" },
      ],
      hint: "The answer for `x : xs` is `x * 2` on the front of the answer for `xs`: `x * 2 : doubleAll xs`.",
      solution: hs`doubleAll :: [Int] -> [Int]
doubleAll [] = []
doubleAll (x : xs) = x * 2 : doubleAll xs
`,
      banned: ["map"],
    },
    {
      k: "predict",
      expr: "let g [] = 1; g (x : xs) = x * g xs in g [2, 3, 4]",
      answer: "24",
      why: "`2 * (3 * (4 * 1))` is 24. The base case is 1, not 0: if it were 0, every product would come out as 0.",
    },
    {
      k: "write",
      body: "Write `countZeros`, which counts how many elements of a list are `0`. The guards are there for you.",
      starter: hs`countZeros :: [Int] -> Int
countZeros [] = undefined
countZeros (x : xs)
  | x == 0    = undefined
  | otherwise = undefined
`,
      tests: [
        { expr: "countZeros [0, 1, 0, 2]", expected: "2" },
        { expr: "countZeros []", expected: "0" },
        { expr: "countZeros [3, 4]", expected: "0" },
        { expr: "countZeros [0, 0, 0]", expected: "3" },
      ],
      hint: "If `x` is 0, the answer is `1 + countZeros xs`. Otherwise it's just `countZeros xs`.",
      solution: hs`countZeros :: [Int] -> Int
countZeros [] = 0
countZeros (x : xs)
  | x == 0    = 1 + countZeros xs
  | otherwise = countZeros xs
`,
    },
    {
      k: "quiz",
      q: "The pattern `(a : b : rest)` is matched against `[1, 2, 3]`. What are `a`, `b` and `rest`?",
      options: [
        "`a = 1`, `b = 2`, `rest = [3]`",
        "`a = 1`, `b = [2, 3]`, `rest = []`",
        "`a = [1]`, `b = [2]`, `rest = [3]`",
        "It doesn't match: the pattern only fits lists of exactly two elements",
      ],
      answer: 0,
      why: "`a : b : rest` means `a : (b : rest)`. The first two elements get names and `rest` is whatever is left, here `[3]`. It matches any list with at least two elements.",
    },
    {
      k: "write",
      body: "Write `firstOr d xs`, which gives the first element of `xs`, or the default `d` if `xs` is empty.",
      starter: hs`firstOr :: Int -> [Int] -> Int
firstOr d [] = undefined
firstOr d (x : _) = undefined
`,
      tests: [
        { expr: "firstOr 0 [4, 5, 6]", expected: "4" },
        { expr: "firstOr 99 []", expected: "99" },
        { expr: "firstOr 0 [-1]", expected: "-1" },
        { expr: "firstOr 7 [7, 7]", expected: "7" },
      ],
      hint: "With no elements, the answer is `d`. Otherwise it's `x`.",
      solution: hs`firstOr :: Int -> [Int] -> Int
firstOr d [] = d
firstOr d (x : _) = x
`,
      banned: ["head"],
    },
    {
      k: "predict",
      expr: `let h [] = 0; h [_] = 1; h (_ : _ : xs) = 1 + h xs in h "abcde"`,
      answer: "3",
      why: "Each step removes two characters: `\"abcde\"` to `\"cde\"` to `\"e\"`. The one-element equation gives 1, so the total is `1 + 1 + 1`. This counts pairs, rounding up.",
    },
    {
      k: "write",
      body: "Write `secondElem`, which gives `Just` the second element of a list, or `Nothing` if the list has fewer than two elements.",
      starter: hs`secondElem :: [a] -> Maybe a
secondElem (_ : y : _) = undefined
secondElem _ = undefined
`,
      tests: [
        { expr: `secondElem "abc"`, expected: "Just 'b'" },
        { expr: "secondElem [1 :: Int]", expected: "Nothing" },
        { expr: "secondElem ([] :: [Int])", expected: "Nothing" },
        { expr: "secondElem [3, 4 :: Int]", expected: "Just 4" },
      ],
      hint: "The first equation has already named the second element `y`, so its answer is `Just y`. Anything else falls through to `_`.",
      solution: hs`secondElem :: [a] -> Maybe a
secondElem (_ : y : _) = Just y
secondElem _ = Nothing
`,
    },
    {
      k: "quiz",
      q: md(
        "What does `go 10 [1, 2, 3]` give?",
        "",
        "```",
        "go :: Int -> [Int] -> Int",
        "go acc []       = acc",
        "go acc (x : xs) = go (acc + x) xs",
        "```",
      ),
      options: ["6", "16", "10", "[1, 2, 3]"],
      answer: 1,
      why: "`acc` is an accumulator: a running total carried along. It goes 10, 11, 13, 16, and when the list runs out the base case hands back the total so far: 16.",
    },
    {
      k: "write",
      body: md(
        "Write `lastElem`, which gives the last element of a list.",
        "",
        "Precondition: the list is non-empty. Order matters here: the one-element equation must come first.",
      ),
      starter: hs`lastElem :: [a] -> a
lastElem [x] = undefined
lastElem (_ : xs) = undefined
`,
      tests: [
        { expr: `lastElem "hello"`, expected: "'o'" },
        { expr: "lastElem [7 :: Int]", expected: "7" },
        { expr: "lastElem [1, 2, 3 :: Int]", expected: "3" },
        { expr: "lastElem [True, False]", expected: "False" },
      ],
      hint: "A one-element list's last element is that element. Otherwise, the last element is the last element of the rest.",
      solution: hs`lastElem :: [a] -> a
lastElem [x] = x
lastElem (_ : xs) = lastElem xs
`,
      banned: ["last", "reverse"],
    },
    {
      k: "predict",
      expr: "let r [] acc = acc; r (x : xs) acc = r xs (x : acc) in r [1, 2, 3] []",
      answer: "[3, 2, 1]",
      why: "Each element is moved onto the front of the accumulator: `[1]`, then `[2, 1]`, then `[3, 2, 1]`. Putting things on the front of an accumulator reverses them.",
    },
    {
      k: "write",
      body: "Write `contains y xs`, which is `True` if `y` appears in `xs`. It should stop as soon as it finds `y`.",
      starter: hs`contains :: Int -> [Int] -> Bool
contains _ [] = undefined
contains y (x : xs) = undefined
`,
      tests: [
        { expr: "contains 3 [1, 2, 3, 4]", expected: "True" },
        { expr: "contains 9 [1, 2, 3]", expected: "False" },
        { expr: "contains 1 []", expected: "False" },
        { expr: "contains 5 ([5] ++ [1 ..])", expected: "True", label: "stops early, even on an infinite list" },
      ],
      hint: "Nothing is in the empty list. Otherwise: `x == y || contains y xs`. `||` doesn't look at its right side when the left is already True.",
      solution: hs`contains :: Int -> [Int] -> Bool
contains _ [] = False
contains y (x : xs) = x == y || contains y xs
`,
      banned: ["elem", "any", "notElem"],
    },
    {
      k: "predict",
      expr: `let t 0 _ = []; t _ [] = []; t n (x : xs) = x : t (n - 1) xs in t 2 "hello"`,
      answer: `"he"`,
      why: "Each step keeps one character and counts `n` down. When `n` hits 0 the first equation stops it. That's `take` written by hand.",
    },
    {
      k: "write",
      body: md(
        "Write `myTake n xs`, which gives the first `n` elements of `xs` (or all of them, if there are fewer than `n`). If `n` is 0 or negative, the answer is `[]`.",
        "",
        "The guard in the first equation catches `n <= 0`. If the guard is False, Haskell moves on to the next equation.",
      ),
      starter: hs`myTake :: Int -> [a] -> [a]
myTake n _ | n <= 0 = undefined
myTake _ [] = undefined
myTake n (x : xs) = undefined
`,
      tests: [
        { expr: `myTake 2 "hello"`, expected: `"he"` },
        { expr: "myTake 0 [1, 2, 3 :: Int]", expected: "[]" },
        { expr: `myTake 10 "hi"`, expected: `"hi"`, label: "asking for too many gives the whole list" },
        { expr: `myTake (-1) "abc"`, expected: `""` },
        { expr: "myTake 3 ([] :: [Int])", expected: "[]" },
      ],
      hint: "The first two equations both answer `[]`. The last keeps `x` and takes `n - 1` from the rest.",
      solution: hs`myTake :: Int -> [a] -> [a]
myTake n _ | n <= 0 = []
myTake _ [] = []
myTake n (x : xs) = x : myTake (n - 1) xs
`,
      banned: ["take", "splitAt"],
    },
    {
      k: "write",
      body: "Write `myDrop n xs`, which removes the first `n` elements of `xs`. If `n` is 0 or negative the list is unchanged; if `n` is bigger than the length, the answer is `[]`.",
      starter: hs`myDrop :: Int -> [a] -> [a]
myDrop n xs | n <= 0 = undefined
myDrop _ [] = undefined
myDrop n (_ : xs) = undefined
`,
      tests: [
        { expr: `myDrop 2 "hello"`, expected: `"llo"` },
        { expr: "myDrop 0 [1, 2, 3 :: Int]", expected: "[1, 2, 3]" },
        { expr: `myDrop 10 "hi"`, expected: `""` },
        { expr: `myDrop (-3) "abc"`, expected: `"abc"` },
        { expr: "myDrop 1 [9 :: Int]", expected: "[]" },
      ],
      hint: "When `n <= 0`, give back `xs` untouched. Otherwise throw away the first element and drop `n - 1` from the rest.",
      solution: hs`myDrop :: Int -> [a] -> [a]
myDrop n xs | n <= 0 = xs
myDrop _ [] = []
myDrop n (_ : xs) = myDrop (n - 1) xs
`,
      banned: ["drop", "splitAt"],
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 2: Standard
// ---------------------------------------------------------------------------

const level2: DrillSet = {
  id: "b-lists-l2",
  lesson: "",
  level: 2,
  title: "Level 2: Standard",
  intro: md(
    "Now you write each function from a description, starting from just the type. Decide the base case first, then what to do with one element and the recursive answer for the rest.",
    "",
    "```",
    "evens :: [Int] -> [Int]",
    "evens [] = []",
    "evens (x : xs)",
    "  | even x    = x : evens xs   -- keep it",
    "  | otherwise = evens xs       -- skip it",
    "```",
  ),
  drills: [
    {
      k: "write",
      body: "Write `countOcc y xs`, which counts how many times `y` appears in `xs`. Use recursion.",
      starter: hs`countOcc :: Eq a => a -> [a] -> Int
countOcc y xs = undefined
`,
      tests: [
        { expr: `countOcc 'a' "banana"`, expected: "3" },
        { expr: "countOcc (5 :: Int) []", expected: "0" },
        { expr: "countOcc 1 [1, 1, 1 :: Int]", expected: "3" },
        { expr: `countOcc 'z' "abc"`, expected: "0" },
      ],
      hint: "Two equations: `[]` gives 0. For `(x : xs)`, use guards: if `x == y` add 1 to the count for `xs`.",
      solution: hs`countOcc :: Eq a => a -> [a] -> Int
countOcc _ [] = 0
countOcc y (x : xs)
  | x == y    = 1 + countOcc y xs
  | otherwise = countOcc y xs
`,
      banned: ["filter"],
    },
    {
      k: "write",
      body: "Write `keepEvens`, which keeps only the even numbers of a list, in their original order. Use recursion.",
      starter: hs`keepEvens :: [Int] -> [Int]
keepEvens xs = undefined
`,
      tests: [
        { expr: "keepEvens [1, 2, 3, 4, 5, 6]", expected: "[2, 4, 6]" },
        { expr: "keepEvens []", expected: "[]" },
        { expr: "keepEvens [-2, -1, 0]", expected: "[-2, 0]", label: "negatives and zero" },
        { expr: "keepEvens [1, 3]", expected: "[]" },
      ],
      hint: "For `(x : xs)`: if `even x`, the answer is `x : keepEvens xs`; otherwise just `keepEvens xs`.",
      solution: hs`keepEvens :: [Int] -> [Int]
keepEvens [] = []
keepEvens (x : xs)
  | even x    = x : keepEvens xs
  | otherwise = keepEvens xs
`,
      banned: ["filter"],
    },
    {
      k: "write",
      body: md(
        "Write `myReverse`, which reverses a list. Use a helper with an accumulator, so it runs in one pass:",
        "",
        "```",
        "myReverse xs = go xs []",
        "```",
      ),
      starter: hs`myReverse :: [a] -> [a]
myReverse xs = undefined
`,
      tests: [
        { expr: `myReverse "abc"`, expected: `"cba"` },
        { expr: "myReverse ([] :: [Int])", expected: "[]" },
        { expr: "myReverse [1 :: Int]", expected: "[1]" },
        { expr: "myReverse [1, 2, 2, 3 :: Int]", expected: "[3, 2, 2, 1]" },
      ],
      hint: "In a `where`: `go [] acc = acc` and `go (y : ys) acc = go ys (y : acc)`.",
      solution: hs`myReverse :: [a] -> [a]
myReverse xs = go xs []
  where
    go [] acc = acc
    go (y : ys) acc = go ys (y : acc)
`,
      banned: ["reverse", "foldl"],
    },
    {
      k: "write",
      body: "Write `myZip`, which pairs up two lists element by element. It stops when either list runs out.",
      starter: hs`myZip :: [a] -> [b] -> [(a, b)]
myZip xs ys = undefined
`,
      tests: [
        { expr: `myZip [1, 2, 3 :: Int] "ab"`, expected: `[(1, 'a'), (2, 'b')]` },
        { expr: `myZip ([] :: [Int]) "abc"`, expected: "[]" },
        { expr: `myZip "xy" [True, False]`, expected: `[('x', True), ('y', False)]` },
        { expr: "myZip [1, 2 :: Int] [3, 4, 5 :: Int]", expected: "[(1, 3), (2, 4)]" },
      ],
      hint: "Only one equation does real work: `myZip (x : xs) (y : ys) = (x, y) : myZip xs ys`. A second catch-all `myZip _ _ = []` covers every case where a list is empty.",
      solution: hs`myZip :: [a] -> [b] -> [(a, b)]
myZip (x : xs) (y : ys) = (x, y) : myZip xs ys
myZip _ _ = []
`,
      banned: ["zip", "zipWith"],
    },
    {
      k: "write",
      body: md(
        "Write `elementAt i xs`, which gives the element at index `i`, counting from 0.",
        "",
        "Precondition: `i` is a valid index.",
      ),
      starter: hs`elementAt :: Int -> [a] -> a
elementAt i xs = undefined
`,
      tests: [
        { expr: `elementAt 0 "hello"`, expected: "'h'" },
        { expr: `elementAt 4 "hello"`, expected: "'o'" },
        { expr: "elementAt 2 [10, 20, 30, 40 :: Int]", expected: "30" },
        { expr: "elementAt 0 [True]", expected: "True" },
      ],
      hint: "Index 0 is the first element. Index `i` of `x : xs` is index `i - 1` of `xs`.",
      solution: hs`elementAt :: Int -> [a] -> a
elementAt 0 (x : _) = x
elementAt i (_ : xs) = elementAt (i - 1) xs
`,
      banned: ["!!", "drop", "head"],
    },
    {
      k: "write",
      body: "Write `indexOf y xs`, which gives `Just` the index (from 0) of the first `y` in `xs`, or `Nothing` if `y` isn't there.",
      starter: hs`indexOf :: Eq a => a -> [a] -> Maybe Int
indexOf y xs = undefined
`,
      tests: [
        { expr: `indexOf 'c' "abcabc"`, expected: "Just 2", label: "first occurrence wins" },
        { expr: `indexOf 'z' "abc"`, expected: "Nothing" },
        { expr: "indexOf 1 [1 :: Int]", expected: "Just 0" },
        { expr: "indexOf 3 ([] :: [Int])", expected: "Nothing" },
      ],
      hint: "If `x == y` the answer is `Just 0`. Otherwise look in `xs`: if that finds `Just i`, this list has it at `Just (i + 1)`. Use `case indexOf y xs of`.",
      solution: hs`indexOf :: Eq a => a -> [a] -> Maybe Int
indexOf _ [] = Nothing
indexOf y (x : xs)
  | x == y = Just 0
  | otherwise = case indexOf y xs of
      Nothing -> Nothing
      Just i  -> Just (i + 1)
`,
      banned: ["elemIndex", "findIndex", "lookup", "zip"],
    },
    {
      k: "quiz",
      q: md(
        "What does `pairs [1, 2, 3] \"ab\"` do?",
        "",
        "```",
        "pairs :: [a] -> [b] -> [(a, b)]",
        "pairs [] []             = []",
        "pairs (x : xs) (y : ys) = (x, y) : pairs xs ys",
        "```",
      ),
      options: [
        "Gives `[(1, 'a'), (2, 'b')]`",
        "Gives `[(1, 'a'), (2, 'b'), (3, ' ')]`",
        "Crashes: no equation matches `pairs [3] []`",
        "It's a type error, because the lists have different lengths",
      ],
      answer: 2,
      why: "After two steps we reach `pairs [3] []`. The first equation needs both lists empty and the second needs both non-empty, so nothing matches. When recursing over two lists, think about all four shape combinations; a catch-all `pairs _ _ = []` fixes it.",
    },
    {
      k: "write",
      body: md(
        "Write `maximumOf`, which gives the largest number in a list.",
        "",
        "Precondition: the list is non-empty.",
      ),
      starter: hs`maximumOf :: [Int] -> Int
maximumOf xs = undefined
`,
      tests: [
        { expr: "maximumOf [3, 9, 2]", expected: "9" },
        { expr: "maximumOf [4]", expected: "4" },
        { expr: "maximumOf [-5, -2, -9]", expected: "-2", label: "all negative" },
        { expr: "maximumOf [1, 7, 7, 1]", expected: "7" },
      ],
      hint: "Base case `[x]`, not `[]`. For `(x : xs)`, the answer is `max x (maximumOf xs)`.",
      solution: hs`maximumOf :: [Int] -> Int
maximumOf [x] = x
maximumOf (x : xs) = max x (maximumOf xs)
`,
      banned: ["maximum", "foldr1", "foldl1", "sort"],
    },
    {
      k: "write",
      body: "Write `copies n x`, which makes a list of `n` copies of `x`. If `n` is 0 or negative, the answer is `[]`.",
      starter: hs`copies :: Int -> a -> [a]
copies n x = undefined
`,
      tests: [
        { expr: "copies 3 'x'", expected: `"xxx"` },
        { expr: "copies 0 True", expected: "[]" },
        { expr: "copies (-2) 'a'", expected: `""` },
        { expr: "copies 2 [1 :: Int]", expected: "[[1], [1]]" },
      ],
      hint: "Guard on `n <= 0` first. Otherwise `x : copies (n - 1) x`.",
      solution: hs`copies :: Int -> a -> [a]
copies n x
  | n <= 0    = []
  | otherwise = x : copies (n - 1) x
`,
      banned: ["replicate", "take", "repeat"],
    },
    {
      k: "write",
      body: "Write `countdown n`, which gives `[n, n - 1, ..., 1]`. If `n` is less than 1, the answer is `[]`. Build it with recursion, not a `..` range.",
      starter: hs`countdown :: Int -> [Int]
countdown n = undefined
`,
      tests: [
        { expr: "countdown 3", expected: "[3, 2, 1]" },
        { expr: "countdown 1", expected: "[1]" },
        { expr: "countdown 0", expected: "[]" },
        { expr: "countdown (-4)", expected: "[]" },
      ],
      hint: "`countdown n = n : countdown (n - 1)` while `n >= 1`.",
      solution: hs`countdown :: Int -> [Int]
countdown n
  | n < 1     = []
  | otherwise = n : countdown (n - 1)
`,
      banned: ["reverse", "enumFromThenTo", "enumFromTo"],
    },
    {
      k: "predict",
      expr: "let f (x : xs) (y : ys) = x * y : f xs ys; f _ _ = [] in f [1, 2, 3] [4, 5]",
      answer: "[4, 10]",
      why: "It walks both lists together: `1 * 4`, then `2 * 5`. Then the second list is empty, so the catch-all ends it and the 3 is never used.",
    },
    {
      k: "write",
      body: "Write `upToNegative`, which gives the elements of a list before the first negative number. It must stop at that point and not look further.",
      starter: hs`upToNegative :: [Int] -> [Int]
upToNegative xs = undefined
`,
      tests: [
        { expr: "upToNegative [3, 1, -2, 5]", expected: "[3, 1]" },
        { expr: "upToNegative [1, 2]", expected: "[1, 2]" },
        { expr: "upToNegative [-1, 4]", expected: "[]" },
        { expr: "upToNegative []", expected: "[]" },
        { expr: "upToNegative ([1, 2, -1] ++ [1 ..])", expected: "[1, 2]", label: "stops early" },
      ],
      hint: "When `x < 0`, the answer is `[]`: don't recurse at all. Otherwise keep `x` and carry on.",
      solution: hs`upToNegative :: [Int] -> [Int]
upToNegative [] = []
upToNegative (x : xs)
  | x < 0     = []
  | otherwise = x : upToNegative xs
`,
      banned: ["takeWhile", "span", "break"],
    },
    {
      k: "write",
      body: "Write `skipSpaces`, which removes the spaces at the start of a String (but not spaces later on).",
      starter: hs`skipSpaces :: String -> String
skipSpaces s = undefined
`,
      tests: [
        { expr: `skipSpaces "   hi there"`, expected: `"hi there"` },
        { expr: `skipSpaces "hi "`, expected: `"hi "` },
        { expr: `skipSpaces "    "`, expected: `""` },
        { expr: `skipSpaces ""`, expected: `""` },
      ],
      hint: "If the first character is `' '`, skip it and keep going. Otherwise return the whole string, including that character.",
      solution: hs`skipSpaces :: String -> String
skipSpaces (' ' : rest) = skipSpaces rest
skipSpaces s = s
`,
      banned: ["dropWhile", "span", "break"],
    },
    {
      k: "write",
      body: "Write `squash`, which replaces every run of equal adjacent elements by a single copy. For example `squash \"aaabccaa\"` is `\"abca\"`.",
      starter: hs`squash :: Eq a => [a] -> [a]
squash xs = undefined
`,
      tests: [
        { expr: `squash "aaabccaa"`, expected: `"abca"` },
        { expr: "squash ([] :: [Int])", expected: "[]" },
        { expr: "squash [5 :: Int]", expected: "[5]" },
        { expr: "squash [1, 2, 3 :: Int]", expected: "[1, 2, 3]" },
        { expr: "squash [7, 7, 7, 7 :: Int]", expected: "[7]" },
      ],
      hint: "Match two elements at once: `squash (x : y : rest)`. If `x == y`, drop `x` and squash `y : rest`. Otherwise keep `x`. Lists with fewer than two elements are already squashed.",
      solution: hs`squash :: Eq a => [a] -> [a]
squash (x : y : rest)
  | x == y    = squash (y : rest)
  | otherwise = x : squash (y : rest)
squash xs = xs
`,
      banned: ["group", "nub", "groupBy"],
    },
    {
      k: "write",
      body: "Write `interleave`, which takes elements from two lists in turn, starting with the first list. When one runs out, the rest of the other is added on the end.",
      starter: hs`interleave :: [a] -> [a] -> [a]
interleave xs ys = undefined
`,
      tests: [
        { expr: `interleave "abc" "123"`, expected: `"a1b2c3"` },
        { expr: `interleave "abc" "12345"`, expected: `"a1b2c345"` },
        { expr: `interleave "abcd" "1"`, expected: `"a1bcd"` },
        { expr: `interleave "" "xy"`, expected: `"xy"` },
      ],
      hint: "Base cases: `interleave [] ys = ys` and `interleave xs [] = xs`. Otherwise `x : y : interleave xs ys`.",
      solution: hs`interleave :: [a] -> [a] -> [a]
interleave [] ys = ys
interleave xs [] = xs
interleave (x : xs) (y : ys) = x : y : interleave xs ys
`,
    },
    {
      k: "quiz",
      q: md(
        "What does `allPos ([1, -1] ++ [1 ..])` give?",
        "",
        "```",
        "allPos :: [Int] -> Bool",
        "allPos []       = True",
        "allPos (x : xs) = x > 0 && allPos xs",
        "```",
      ),
      options: ["False", "True", "It runs forever, because the list is infinite", "An error, because there's no base case for infinite lists"],
      answer: 0,
      why: "At `-1`, `x > 0` is False, and `False && anything` is False without looking at `anything`. So the recursion stops there and never touches the infinite part.",
    },
    {
      k: "write",
      body: "Write `replaceAt i y xs`, which replaces the element at index `i` (from 0) with `y`. If `i` is not a valid index, the list is unchanged.",
      starter: hs`replaceAt :: Int -> a -> [a] -> [a]
replaceAt i y xs = undefined
`,
      tests: [
        { expr: `replaceAt 1 'X' "abc"`, expected: `"aXc"` },
        { expr: `replaceAt 0 'X' "abc"`, expected: `"Xbc"` },
        { expr: `replaceAt 5 'X' "abc"`, expected: `"abc"`, label: "index too big: unchanged" },
        { expr: `replaceAt (-1) 'X' "abc"`, expected: `"abc"`, label: "negative index: unchanged" },
        { expr: "replaceAt 0 1 ([] :: [Int])", expected: "[]" },
      ],
      hint: "At index 0, the answer is `y : xs` (the old first element is thrown away). Otherwise keep `x` and replace at `i - 1` in the rest. A negative index never reaches 0, so it falls off the end safely.",
      solution: hs`replaceAt :: Int -> a -> [a] -> [a]
replaceAt _ _ [] = []
replaceAt 0 y (_ : xs) = y : xs
replaceAt i y (x : xs) = x : replaceAt (i - 1) y xs
`,
      banned: ["splitAt", "take", "drop", "!!"],
    },
    {
      k: "write",
      body: "Write `insertAt i y xs`, which inserts `y` so that it ends up at index `i`. Index 0 means the front. If `i` is bigger than the length, `y` goes on the end. Precondition: `i >= 0`.",
      starter: hs`insertAt :: Int -> a -> [a] -> [a]
insertAt i y xs = undefined
`,
      tests: [
        { expr: `insertAt 1 'X' "abc"`, expected: `"aXbc"` },
        { expr: `insertAt 0 'X' "abc"`, expected: `"Xabc"` },
        { expr: `insertAt 3 'X' "abc"`, expected: `"abcX"` },
        { expr: `insertAt 10 'X' "abc"`, expected: `"abcX"`, label: "beyond the end: goes on the end" },
        { expr: "insertAt 0 5 ([] :: [Int])", expected: "[5]" },
      ],
      hint: "At index 0, `y : xs`. If the list runs out first, `[y]`. Otherwise keep `x` and insert at `i - 1`.",
      solution: hs`insertAt :: Int -> a -> [a] -> [a]
insertAt 0 y xs = y : xs
insertAt _ y [] = [y]
insertAt i y (x : xs) = x : insertAt (i - 1) y xs
`,
      banned: ["splitAt", "take", "drop"],
    },
    {
      k: "write",
      body: "Write `removeAt i xs`, which removes the element at index `i` (from 0). If `i` is not a valid index, the list is unchanged.",
      starter: hs`removeAt :: Int -> [a] -> [a]
removeAt i xs = undefined
`,
      tests: [
        { expr: `removeAt 1 "abc"`, expected: `"ac"` },
        { expr: `removeAt 0 "abc"`, expected: `"bc"` },
        { expr: `removeAt 3 "abc"`, expected: `"abc"` },
        { expr: `removeAt (-2) "abc"`, expected: `"abc"` },
        { expr: "removeAt 0 [7 :: Int]", expected: "[]" },
      ],
      hint: "Same shape as `replaceAt`, but at index 0 the answer is just `xs`.",
      solution: hs`removeAt :: Int -> [a] -> [a]
removeAt _ [] = []
removeAt 0 (_ : xs) = xs
removeAt i (x : xs) = x : removeAt (i - 1) xs
`,
      banned: ["splitAt", "take", "drop", "delete"],
    },
    {
      k: "write",
      body: md(
        "Write `breakAt y xs`, which splits `xs` at the first `y`. It gives a pair: the elements before the first `y`, and the elements after it. The `y` itself is thrown away.",
        "",
        "If `y` isn't there, the answer is `(xs, [])`.",
      ),
      starter: hs`breakAt :: Eq a => a -> [a] -> ([a], [a])
breakAt y xs = undefined
`,
      tests: [
        { expr: `breakAt ',' "ab,cd,e"`, expected: `("ab", "cd,e")`, label: "only the first comma splits" },
        { expr: "breakAt 0 [1, 2, 3 :: Int]", expected: "([1, 2, 3], [])" },
        { expr: `breakAt 'a' "abc"`, expected: `("", "bc")` },
        { expr: `breakAt 'c' "abc"`, expected: `("ab", "")` },
        { expr: `breakAt 'x' ""`, expected: `("", "")` },
      ],
      hint: "If `x == y` the answer is `([], xs)`. Otherwise split the rest with a recursive call, `(before, after) = breakAt y xs` in a `where`, and put `x` on the front of `before`.",
      solution: hs`breakAt :: Eq a => a -> [a] -> ([a], [a])
breakAt _ [] = ([], [])
breakAt y (x : xs)
  | x == y    = ([], xs)
  | otherwise = (x : before, after)
  where
    (before, after) = breakAt y xs
`,
      banned: ["break", "span", "splitAt", "elemIndex"],
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 3: Stretch
// ---------------------------------------------------------------------------

const level3: DrillSet = {
  id: "b-lists-l3",
  lesson: "",
  level: 3,
  title: "Level 3: Stretch",
  intro: md(
    "These combine two ideas: a helper with an extra argument (an index, a running total, a list of things seen so far), two lists at once, or a recursive call whose result you take apart. Watch the edge cases: empty lists, one element, duplicates.",
    "",
    "```",
    "positions :: Char -> String -> [Int]",
    "positions c s = go 0 s",
    "  where",
    "    go _ [] = []",
    "    go i (x : xs)",
    "      | x == c    = i : go (i + 1) xs",
    "      | otherwise = go (i + 1) xs",
    "```",
  ),
  drills: [
    {
      k: "write",
      body: "Write `runningTotal`, which replaces each element by the sum of it and everything before it. For example `runningTotal [1, 2, 3]` is `[1, 3, 6]`. Use a helper that carries the total so far.",
      starter: hs`runningTotal :: [Int] -> [Int]
runningTotal xs = undefined
`,
      tests: [
        { expr: "runningTotal [1, 2, 3]", expected: "[1, 3, 6]" },
        { expr: "runningTotal []", expected: "[]" },
        { expr: "runningTotal [5]", expected: "[5]" },
        { expr: "runningTotal [3, -3, 4]", expected: "[3, 0, 4]" },
      ],
      hint: "`runningTotal xs = go 0 xs`, with `go acc (y : ys) = (acc + y) : go (acc + y) ys`.",
      solution: hs`runningTotal :: [Int] -> [Int]
runningTotal xs = go 0 xs
  where
    go _ [] = []
    go acc (y : ys) = (acc + y) : go (acc + y) ys
`,
      banned: ["scanl", "scanl1", "sum"],
    },
    {
      k: "write",
      body: "Write `pairUp`, which groups a list into pairs: first and second, third and fourth, and so on. A leftover last element is dropped.",
      starter: hs`pairUp :: [a] -> [(a, a)]
pairUp xs = undefined
`,
      tests: [
        { expr: "pairUp [1, 2, 3, 4, 5 :: Int]", expected: "[(1, 2), (3, 4)]", label: "leftover 5 is dropped" },
        { expr: `pairUp "abcd"`, expected: `[('a', 'b'), ('c', 'd')]` },
        { expr: "pairUp ([] :: [Int])", expected: "[]" },
        { expr: "pairUp [1 :: Int]", expected: "[]" },
      ],
      hint: "Match `(x : y : rest)` and recurse on `rest`. Everything else gives `[]`.",
      solution: hs`pairUp :: [a] -> [(a, a)]
pairUp (x : y : rest) = (x, y) : pairUp rest
pairUp _ = []
`,
    },
    {
      k: "write",
      body: "Write `adjacentPairs`, which gives every pair of neighbouring elements. For example `adjacentPairs [1, 2, 3]` is `[(1, 2), (2, 3)]`. Unlike `pairUp`, the pairs overlap.",
      starter: hs`adjacentPairs :: [a] -> [(a, a)]
adjacentPairs xs = undefined
`,
      tests: [
        { expr: "adjacentPairs [1, 2, 3 :: Int]", expected: "[(1, 2), (2, 3)]" },
        { expr: "adjacentPairs [1 :: Int]", expected: "[]" },
        { expr: "adjacentPairs ([] :: [Int])", expected: "[]" },
        { expr: `adjacentPairs "abcd"`, expected: `[('a', 'b'), ('b', 'c'), ('c', 'd')]` },
      ],
      hint: "Match `(x : y : rest)`, but recurse on `y : rest`, so `y` gets used again as the start of the next pair.",
      solution: hs`adjacentPairs :: [a] -> [(a, a)]
adjacentPairs (x : y : rest) = (x, y) : adjacentPairs (y : rest)
adjacentPairs _ = []
`,
      banned: ["zip", "zipWith", "tail"],
    },
    {
      k: "write",
      body: "Write `isSorted`, which checks that a list never goes down: each element is less than or equal to the next. The empty list and one-element lists are sorted.",
      starter: hs`isSorted :: [Int] -> Bool
isSorted xs = undefined
`,
      tests: [
        { expr: "isSorted [1, 2, 2, 5]", expected: "True", label: "equal neighbours are fine" },
        { expr: "isSorted [3, 1]", expected: "False" },
        { expr: "isSorted []", expected: "True" },
        { expr: "isSorted [4]", expected: "True" },
        { expr: "isSorted [1, 2, 3, 2]", expected: "False", label: "the problem is at the end" },
      ],
      hint: "Compare neighbours: `isSorted (x : y : rest) = x <= y && isSorted (y : rest)`. Everything shorter is True.",
      solution: hs`isSorted :: [Int] -> Bool
isSorted (x : y : rest) = x <= y && isSorted (y : rest)
isSorted _ = True
`,
      banned: ["sort"],
    },
    {
      k: "quiz",
      q: md(
        "Spot the bug. What does `myLength \"abc\"` give?",
        "",
        "```",
        "myLength :: [a] -> Int",
        "myLength []       = 1",
        "myLength (_ : xs) = 1 + myLength xs",
        "```",
      ),
      options: ["3", "4", "1", "It crashes"],
      answer: 1,
      why: "It's `1 + (1 + (1 + 1))`. The base case adds an extra 1. Always check the base case against the smallest input: the length of `[]` should be 0.",
    },
    {
      k: "write",
      body: md(
        "This `merge` should combine two sorted lists into one sorted list, but it loses elements. Find the problem and fix it.",
        "",
        "For example `merge [1, 4] [2, 3, 10]` should be `[1, 2, 3, 4, 10]`.",
      ),
      starter: hs`merge :: [Int] -> [Int] -> [Int]
merge (x : xs) (y : ys)
  | x <= y    = x : merge xs (y : ys)
  | otherwise = y : merge (x : xs) ys
merge _ _ = []
`,
      tests: [
        { expr: "merge [1, 4, 6] [2, 3, 10]", expected: "[1, 2, 3, 4, 6, 10]" },
        { expr: "merge [] [1, 2]", expected: "[1, 2]" },
        { expr: "merge [5] []", expected: "[5]" },
        { expr: "merge [1, 1] [1]", expected: "[1, 1, 1]", label: "duplicates are kept" },
      ],
      hint: "When one list is empty, the answer isn't `[]`: it's whatever is left of the other list. Replace the last equation with two: `merge [] ys = ys` and `merge xs [] = xs`.",
      solution: hs`merge :: [Int] -> [Int] -> [Int]
merge [] ys = ys
merge xs [] = xs
merge (x : xs) (y : ys)
  | x <= y    = x : merge xs (y : ys)
  | otherwise = y : merge (x : xs) ys
`,
      banned: ["sort"],
    },
    {
      k: "write",
      body: "Write `chunksOf n xs`, which cuts `xs` into pieces of length `n`. The last piece may be shorter. Precondition: `n > 0`. You may use `take` and `drop`.",
      starter: hs`chunksOf :: Int -> [a] -> [[a]]
chunksOf n xs = undefined
`,
      tests: [
        { expr: "chunksOf 2 [1, 2, 3, 4, 5 :: Int]", expected: "[[1, 2], [3, 4], [5]]" },
        { expr: `chunksOf 3 "abcdef"`, expected: `["abc", "def"]` },
        { expr: "chunksOf 2 ([] :: [Int])", expected: "[]", label: "no chunks at all, not [[]]" },
        { expr: `chunksOf 5 "hi"`, expected: `["hi"]` },
      ],
      hint: "`chunksOf _ [] = []`. Otherwise the first chunk is `take n xs` and the rest is `chunksOf n (drop n xs)`.",
      solution: hs`chunksOf :: Int -> [a] -> [[a]]
chunksOf _ [] = []
chunksOf n xs = take n xs : chunksOf n (drop n xs)
`,
    },
    {
      k: "write",
      body: md(
        "Write `splitOnChar c s`, which cuts the String `s` at every `c`. The pieces can be empty.",
        "",
        "```",
        "splitOnChar ',' \"a,b,,c\"  ==  [\"a\", \"b\", \"\", \"c\"]",
        "splitOnChar ',' \"\"        ==  [\"\"]",
        "```",
        "",
        "You may use `break`: `break (== c) s` splits `s` just before the first `c`.",
      ),
      starter: hs`splitOnChar :: Char -> String -> [String]
splitOnChar c s = undefined
`,
      tests: [
        { expr: `splitOnChar ',' "a,b,,c"`, expected: `["a", "b", "", "c"]` },
        { expr: `splitOnChar ',' "abc"`, expected: `["abc"]` },
        { expr: `splitOnChar ',' ""`, expected: `[""]` },
        { expr: `splitOnChar ',' ",x,"`, expected: `["", "x", ""]`, label: "commas at both ends" },
      ],
      hint: "`case break (== c) s of`: if the second part is `[]`, there are no more `c`s, so the answer is `[chunk]`. If it's `(_ : rest)`, the answer is `chunk : splitOnChar c rest`.",
      solution: hs`splitOnChar :: Char -> String -> [String]
splitOnChar c s = case break (== c) s of
  (chunk, [])       -> [chunk]
  (chunk, _ : rest) -> chunk : splitOnChar c rest
`,
      banned: ["words", "lines"],
    },
    {
      k: "write",
      body: "Write `deleteFirst y xs`, which removes only the first `y` from `xs`. Later copies stay. If there's no `y`, the list is unchanged.",
      starter: hs`deleteFirst :: Eq a => a -> [a] -> [a]
deleteFirst y xs = undefined
`,
      tests: [
        { expr: "deleteFirst 3 [1, 3, 2, 3 :: Int]", expected: "[1, 2, 3]" },
        { expr: "deleteFirst 9 [1, 2 :: Int]", expected: "[1, 2]" },
        { expr: "deleteFirst 1 ([] :: [Int])", expected: "[]" },
        { expr: `deleteFirst 'a' "aaa"`, expected: `"aa"` },
      ],
      hint: "When `x == y`, the answer is just `xs`: stop recursing, so later copies survive.",
      solution: hs`deleteFirst :: Eq a => a -> [a] -> [a]
deleteFirst _ [] = []
deleteFirst y (x : xs)
  | x == y    = xs
  | otherwise = x : deleteFirst y xs
`,
      banned: ["delete", "filter"],
    },
    {
      k: "write",
      body: "Write `positionsOf y xs`, which gives every index (from 0) where `y` appears in `xs`. Use a helper that carries the current index.",
      starter: hs`positionsOf :: Eq a => a -> [a] -> [Int]
positionsOf y xs = undefined
`,
      tests: [
        { expr: `positionsOf 'a' "banana"`, expected: "[1, 3, 5]" },
        { expr: `positionsOf 'z' "banana"`, expected: "[]" },
        { expr: "positionsOf 1 ([] :: [Int])", expected: "[]" },
        { expr: "positionsOf 7 [7, 7 :: Int]", expected: "[0, 1]" },
      ],
      hint: "`positionsOf y xs = go 0 xs`. In `go i (x : rest)`, include `i` if `x == y`, and recurse with `i + 1` either way.",
      solution: hs`positionsOf :: Eq a => a -> [a] -> [Int]
positionsOf y xs = go 0 xs
  where
    go _ [] = []
    go i (x : rest)
      | x == y    = i : go (i + 1) rest
      | otherwise = go (i + 1) rest
`,
      banned: ["elemIndices", "findIndices", "zip"],
    },
    {
      k: "predict",
      expr: "let g n [] = n; g n (x : xs) = if x > n then g x xs else g n xs in g 0 [3, 1, 4, 1, 5, 2]",
      answer: "5",
      why: "`n` is the biggest value seen so far: 0, 3, 3, 4, 4, 5, 5. When the list ends, the base case returns it.",
    },
    {
      k: "write",
      body: "Write `matches xs ys`, which counts the positions where the two lists have the same element. Stop when either list runs out.",
      starter: hs`matches :: Eq a => [a] -> [a] -> Int
matches xs ys = undefined
`,
      tests: [
        { expr: `matches "abcd" "abxd"`, expected: "3" },
        { expr: `matches "" "abc"`, expected: "0" },
        { expr: `matches "abc" "a"`, expected: "1", label: "different lengths" },
        { expr: "matches [1, 2, 3] [3, 2, 1 :: Int]", expected: "1" },
      ],
      hint: "For `(x : xs) (y : ys)`: add 1 if `x == y`, then count the rest. A catch-all `matches _ _ = 0` handles running out.",
      solution: hs`matches :: Eq a => [a] -> [a] -> Int
matches (x : xs) (y : ys)
  | x == y    = 1 + matches xs ys
  | otherwise = matches xs ys
matches _ _ = 0
`,
      banned: ["zip", "zipWith"],
    },
    {
      k: "write",
      body: "Write `isPrefix xs ys`, which is `True` if `ys` starts with `xs`. The empty list is a prefix of everything.",
      starter: hs`isPrefix :: Eq a => [a] -> [a] -> Bool
isPrefix xs ys = undefined
`,
      tests: [
        { expr: `isPrefix "ab" "abc"`, expected: "True" },
        { expr: `isPrefix "" "xyz"`, expected: "True" },
        { expr: `isPrefix "abc" "ab"`, expected: "False", label: "longer than the list" },
        { expr: `isPrefix "ax" "abc"`, expected: "False" },
        { expr: `isPrefix "abc" "abc"`, expected: "True" },
      ],
      hint: "Three cases: `[]` first gives True. A non-empty first with an empty second gives False. Otherwise the heads must be equal and the tails must match too.",
      solution: hs`isPrefix :: Eq a => [a] -> [a] -> Bool
isPrefix [] _ = True
isPrefix _ [] = False
isPrefix (x : xs) (y : ys) = x == y && isPrefix xs ys
`,
      banned: ["isPrefixOf", "take"],
    },
    {
      k: "write",
      body: "Write `swapAdjacent`, which swaps each pair of neighbours: the first with the second, the third with the fourth, and so on. A leftover last element stays where it is.",
      starter: hs`swapAdjacent :: [a] -> [a]
swapAdjacent xs = undefined
`,
      tests: [
        { expr: "swapAdjacent [1, 2, 3, 4, 5 :: Int]", expected: "[2, 1, 4, 3, 5]" },
        { expr: `swapAdjacent "abcd"`, expected: `"badc"` },
        { expr: "swapAdjacent ([] :: [Int])", expected: "[]" },
        { expr: "swapAdjacent [1 :: Int]", expected: "[1]" },
      ],
      hint: "`swapAdjacent (x : y : rest) = y : x : swapAdjacent rest`. Shorter lists stay as they are.",
      solution: hs`swapAdjacent :: [a] -> [a]
swapAdjacent (x : y : rest) = y : x : swapAdjacent rest
swapAdjacent xs = xs
`,
    },
    {
      k: "write",
      body: md(
        "Write `evensOdds`, which splits a list into two: the elements at even indices (0, 2, 4, ...) and the elements at odd indices (1, 3, 5, ...).",
        "",
        "Hint for a neat answer: what is at an even index of `x : xs`, apart from `x`? It's whatever was at an odd index of `xs`.",
      ),
      starter: hs`evensOdds :: [a] -> ([a], [a])
evensOdds xs = undefined
`,
      tests: [
        { expr: `evensOdds "abcde"`, expected: `("ace", "bd")` },
        { expr: "evensOdds ([] :: [Int])", expected: "([], [])" },
        { expr: "evensOdds [1 :: Int]", expected: "([1], [])" },
        { expr: "evensOdds [1, 2 :: Int]", expected: "([1], [2])" },
      ],
      hint: "In a `where`, split the rest: `(evens, odds) = evensOdds xs`. Then the answer for `x : xs` is `(x : odds, evens)`: the two halves swap roles.",
      solution: hs`evensOdds :: [a] -> ([a], [a])
evensOdds [] = ([], [])
evensOdds (x : xs) = (x : odds, evens)
  where
    (evens, odds) = evensOdds xs
`,
    },
    {
      k: "quiz",
      q: md(
        "What does `firstOver 100 [1 ..]` give?",
        "",
        "```",
        "firstOver :: Int -> [Int] -> Int",
        "firstOver n (x : xs)",
        "  | x > n     = x",
        "  | otherwise = firstOver n xs",
        "```",
      ),
      options: [
        "101",
        "It runs forever, because `[1 ..]` is infinite",
        "It crashes, because there is no equation for `[]`",
        "100",
      ],
      answer: 0,
      why: "The recursion stops as soon as a guard gives an answer without a recursive call. At 101 the first guard is True, so it returns 101. The missing `[]` equation would only matter if the list ran out first.",
    },
    {
      k: "write",
      body: "Write `uniques`, which removes repeated elements, keeping the first copy of each in its original position. Use a helper that carries the list of elements seen so far. You may use `elem`.",
      starter: hs`uniques :: Eq a => [a] -> [a]
uniques xs = undefined
`,
      tests: [
        { expr: `uniques "banana"`, expected: `"ban"` },
        { expr: "uniques ([] :: [Int])", expected: "[]" },
        { expr: "uniques [3, 1, 3, 2, 1 :: Int]", expected: "[3, 1, 2]", label: "first copies keep their order" },
        { expr: `uniques "abc"`, expected: `"abc"` },
      ],
      hint: "`uniques xs = go [] xs`. In `go seen (x : rest)`: if `elem x seen`, skip `x`. Otherwise keep it and add it to `seen`.",
      solution: hs`uniques :: Eq a => [a] -> [a]
uniques xs = go [] xs
  where
    go _ [] = []
    go seen (x : rest)
      | elem x seen = go seen rest
      | otherwise   = x : go (x : seen) rest
`,
      banned: ["nub", "nubBy"],
    },
    {
      k: "write",
      body: "Write `rotate n xs`, which moves the first `n` elements to the end. `n` may be bigger than the length: rotating by the length gives the same list back. Precondition: `n >= 0`.",
      starter: hs`rotate :: Int -> [a] -> [a]
rotate n xs = undefined
`,
      tests: [
        { expr: `rotate 1 "abcde"`, expected: `"bcdea"` },
        { expr: `rotate 7 "abcde"`, expected: `"cdeab"`, label: "7 is the same as 2 for length 5" },
        { expr: "rotate 0 [1, 2 :: Int]", expected: "[1, 2]" },
        { expr: "rotate 3 ([] :: [Int])", expected: "[]", label: "careful: mod by 0 crashes" },
      ],
      hint: "Handle `[]` first. Then let `k = mod n (length xs)` and use `drop k xs ++ take k xs`.",
      solution: hs`rotate :: Int -> [a] -> [a]
rotate _ [] = []
rotate n xs = drop k xs ++ take k xs
  where
    k = mod n (length xs)
`,
    },
    {
      k: "write",
      body: md(
        "Write two related functions.",
        "",
        "- `insertSorted y xs` puts `y` into the sorted list `xs` in the right place, so the result is still sorted.",
        "- `isort xs` sorts a list by inserting its elements one at a time into a sorted list, using `insertSorted`.",
      ),
      starter: hs`insertSorted :: Int -> [Int] -> [Int]
insertSorted y xs = undefined

isort :: [Int] -> [Int]
isort xs = undefined
`,
      tests: [
        { expr: "insertSorted 3 [1, 2, 4, 5]", expected: "[1, 2, 3, 4, 5]" },
        { expr: "insertSorted 0 []", expected: "[0]" },
        { expr: "insertSorted 9 [1, 2]", expected: "[1, 2, 9]" },
        { expr: "isort [3, 1, 2]", expected: "[1, 2, 3]" },
        { expr: "isort [5, -1, 5, 0]", expected: "[-1, 0, 5, 5]", label: "negatives and duplicates" },
        { expr: "isort []", expected: "[]" },
      ],
      hint: "`insertSorted`: if `y <= x`, put `y` in front of `x : xs`; otherwise keep `x` and insert into `xs`. `isort (x : xs) = insertSorted x (isort xs)`.",
      solution: hs`insertSorted :: Int -> [Int] -> [Int]
insertSorted y [] = [y]
insertSorted y (x : xs)
  | y <= x    = y : x : xs
  | otherwise = x : insertSorted y xs

isort :: [Int] -> [Int]
isort [] = []
isort (x : xs) = insertSorted x (isort xs)
`,
      banned: ["sort", "insert", "sortBy", "sortOn"],
    },
    {
      k: "write",
      body: "Write `longestRun`, which gives the length of the longest block of equal neighbouring elements. For example `longestRun \"aabbbc\"` is 3. The empty list gives 0.",
      starter: hs`longestRun :: Eq a => [a] -> Int
longestRun xs = undefined
`,
      tests: [
        { expr: `longestRun "aabbbc"`, expected: "3" },
        { expr: "longestRun ([] :: [Int])", expected: "0" },
        { expr: "longestRun [1 :: Int]", expected: "1" },
        { expr: "longestRun [1, 2, 2, 1, 1, 1, 1 :: Int]", expected: "4", label: "longest run is at the end" },
        { expr: `longestRun "abab"`, expected: "1" },
      ],
      hint: "Use a helper that remembers the previous element, the length of the current run, and the best so far: `go prev cur best rest`. At the end, the answer is `max cur best`.",
      solution: hs`longestRun :: Eq a => [a] -> Int
longestRun [] = 0
longestRun (x : xs) = go x 1 1 xs
  where
    go _ cur best [] = max cur best
    go prev cur best (y : ys)
      | y == prev = go y (cur + 1) best ys
      | otherwise = go y 1 (max cur best) ys
`,
      banned: ["group", "groupBy"],
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 4: Exam strength
// ---------------------------------------------------------------------------

const playlistSetup = hs`type Song = (String, Int)

playlist :: [Song]
playlist = [("Intro", 95), ("Rain", 210), ("Echoes", 184), ("Outro", 61)]
`;

const level4: DrillSet = {
  id: "b-lists-l4",
  lesson: "",
  level: 4,
  title: "Level 4: Exam strength",
  intro: md(
    "These are worded like the real paper: a type, a description, and a GHCi transcript of examples. The types and test data are given above your code, just as the exam template gives them. Read every example: they often settle details the prose leaves open. The last five are as hard as a 3 to 5 mark exam question.",
    "",
    "```",
    "ghci> lookUpAll 2 [(2, 'a'), (1, 'b'), (2, 'c')]",
    "\"ac\"",
    "```",
  ),
  drills: [
    {
      k: "write",
      setup: playlistSetup,
      body: md(
        "A playlist is a list of songs; each song is a title and a length in seconds:",
        "",
        "```",
        "type Song = (String, Int)",
        "```",
        "",
        "Define a function `totalTime :: [Song] -> Int` that returns the total length, in seconds, of a playlist. Use recursion. For example:",
        "",
        "```",
        "ghci> totalTime playlist",
        "550",
        "ghci> totalTime []",
        "0",
        "```",
      ),
      starter: hs`totalTime :: [Song] -> Int
totalTime songs = undefined
`,
      tests: [
        { expr: "totalTime playlist", expected: "550" },
        { expr: "totalTime []", expected: "0" },
        { expr: `totalTime [("A", 10)]`, expected: "10" },
        { expr: `totalTime [("A", 1), ("A", 1)]`, expected: "2" },
      ],
      hint: "Pattern match on the pair inside the list: `totalTime ((_, secs) : rest) = secs + totalTime rest`.",
      solution: hs`totalTime :: [Song] -> Int
totalTime [] = 0
totalTime ((_, secs) : rest) = secs + totalTime rest
`,
      banned: ["sum", "map", "foldr"],
    },
    {
      k: "write",
      setup: playlistSetup,
      body: md(
        "Define a function `songAt :: Int -> [Song] -> Maybe String` that returns the title of the song at a given position in a playlist. Positions are counted from 1. If there is no song at that position, the result is `Nothing`. For example:",
        "",
        "```",
        "ghci> songAt 2 playlist",
        "Just \"Rain\"",
        "ghci> songAt 5 playlist",
        "Nothing",
        "ghci> songAt 0 playlist",
        "Nothing",
        "```",
      ),
      starter: hs`songAt :: Int -> [Song] -> Maybe String
songAt n songs = undefined
`,
      tests: [
        { expr: "songAt 2 playlist", expected: `Just "Rain"` },
        { expr: "songAt 1 playlist", expected: `Just "Intro"` },
        { expr: "songAt 5 playlist", expected: "Nothing" },
        { expr: "songAt 0 playlist", expected: "Nothing", label: "positions start at 1" },
        { expr: "songAt 1 []", expected: "Nothing" },
      ],
      hint: "Count down: position 1 is the head. Guard against `n < 1`, which can never be reached by counting down.",
      solution: hs`songAt :: Int -> [Song] -> Maybe String
songAt _ [] = Nothing
songAt n ((title, _) : rest)
  | n < 1     = Nothing
  | n == 1    = Just title
  | otherwise = songAt (n - 1) rest
`,
      banned: ["!!", "drop", "zip"],
    },
    {
      k: "write",
      setup: hs`type Pattern = [(Char, Int)]

scarf :: Pattern
scarf = [('K', 3), ('P', 2), ('K', 1)]
`,
      body: md(
        "A knitting pattern is written compactly as a list of (stitch, count) pairs:",
        "",
        "```",
        "type Pattern = [(Char, Int)]",
        "```",
        "",
        "Define a function `expand :: Pattern -> String` that writes out every stitch in full. A count may be 0. For example:",
        "",
        "```",
        "ghci> expand scarf",
        "\"KKKPPK\"",
        "ghci> expand [('K', 0), ('P', 2)]",
        "\"PP\"",
        "```",
      ),
      starter: hs`expand :: Pattern -> String
expand p = undefined
`,
      tests: [
        { expr: "expand scarf", expected: `"KKKPPK"` },
        { expr: "expand [('K', 0), ('P', 2)]", expected: `"PP"` },
        { expr: "expand []", expected: `""` },
        { expr: "expand [('S', 1)]", expected: `"S"` },
      ],
      hint: "`expand ((c, n) : rest) = replicate n c ++ expand rest`. `replicate 0 c` is `\"\"`, so zero counts take care of themselves.",
      solution: hs`expand :: Pattern -> String
expand [] = ""
expand ((c, n) : rest) = replicate n c ++ expand rest
`,
      banned: ["concatMap", "concat"],
    },
    {
      k: "write",
      setup: playlistSetup,
      body: md(
        "Define a function `moveToFront :: String -> [Song] -> [Song]` that moves the first song with a given title to the front of the playlist. The other songs keep their order. If there is no song with that title, the playlist is returned unchanged. For example:",
        "",
        "```",
        "ghci> moveToFront \"Echoes\" playlist",
        "[(\"Echoes\",184),(\"Intro\",95),(\"Rain\",210),(\"Outro\",61)]",
        "ghci> moveToFront \"Missing\" playlist",
        "[(\"Intro\",95),(\"Rain\",210),(\"Echoes\",184),(\"Outro\",61)]",
        "```",
      ),
      starter: hs`moveToFront :: String -> [Song] -> [Song]
moveToFront t songs = undefined
`,
      tests: [
        { expr: `moveToFront "Echoes" playlist`, expected: `[("Echoes", 184), ("Intro", 95), ("Rain", 210), ("Outro", 61)]` },
        { expr: `moveToFront "Intro" playlist`, expected: "playlist" },
        { expr: `moveToFront "Missing" playlist`, expected: "playlist" },
        { expr: `moveToFront "A" []`, expected: "[]" },
        { expr: `moveToFront "A" [("B", 1), ("A", 2), ("A", 3)]`, expected: `[("A", 2), ("B", 1), ("A", 3)]`, label: "only the first match moves" },
      ],
      hint: "Split the list at the first matching song, e.g. with `break (\\(n, _) -> n == t) songs`. If the second part is `s : after`, the answer is `s : before ++ after`.",
      solution: hs`moveToFront :: String -> [Song] -> [Song]
moveToFront t songs = case break (\(n, _) -> n == t) songs of
  (before, s : after) -> s : before ++ after
  (_, [])             -> songs
`,
    },
    {
      k: "write",
      setup: hs`temps :: [Int]
temps = [4, 6, 9, 13, 15, 12, 8]
`,
      body: md(
        "A weather station records one temperature per hour, starting at hour 0.",
        "",
        "Define a function `firstAbove :: Int -> [Int] -> Maybe Int` that returns the hour of the first reading strictly above a given threshold, or `Nothing` if there is none. For example:",
        "",
        "```",
        "ghci> temps",
        "[4,6,9,13,15,12,8]",
        "ghci> firstAbove 10 temps",
        "Just 3",
        "ghci> firstAbove 15 temps",
        "Nothing",
        "```",
      ),
      starter: hs`firstAbove :: Int -> [Int] -> Maybe Int
firstAbove t readings = undefined
`,
      tests: [
        { expr: "firstAbove 10 temps", expected: "Just 3" },
        { expr: "firstAbove 15 temps", expected: "Nothing", label: "strictly above" },
        { expr: "firstAbove 3 temps", expected: "Just 0" },
        { expr: "firstAbove 0 []", expected: "Nothing" },
        { expr: "firstAbove 5 ([1, 9] ++ [1 ..])", expected: "Just 1", label: "stops early" },
      ],
      hint: "Use a helper carrying the hour: `go h (r : rs)` returns `Just h` if `r > t`, otherwise `go (h + 1) rs`.",
      solution: hs`firstAbove :: Int -> [Int] -> Maybe Int
firstAbove t readings = go 0 readings
  where
    go _ [] = Nothing
    go h (r : rs)
      | r > t     = Just h
      | otherwise = go (h + 1) rs
`,
      banned: ["findIndex", "elemIndex"],
    },
    {
      k: "write",
      setup: hs`type Mark = (String, Int)

marks :: [Mark]
marks = [("Ana", 62), ("Ben", 48), ("Cal", 71)]
`,
      body: md(
        "A mark sheet pairs each student's name with a mark. Each name appears at most once.",
        "",
        "Define a function `updateMark :: String -> Int -> [Mark] -> [Mark]` that sets a student's mark. If the student is already on the sheet their mark is replaced; otherwise a new entry is added at the end. For example:",
        "",
        "```",
        "ghci> updateMark \"Ben\" 55 marks",
        "[(\"Ana\",62),(\"Ben\",55),(\"Cal\",71)]",
        "ghci> updateMark \"Dee\" 80 marks",
        "[(\"Ana\",62),(\"Ben\",48),(\"Cal\",71),(\"Dee\",80)]",
        "```",
      ),
      starter: hs`updateMark :: String -> Int -> [Mark] -> [Mark]
updateMark name m sheet = undefined
`,
      tests: [
        { expr: `updateMark "Ben" 55 marks`, expected: `[("Ana", 62), ("Ben", 55), ("Cal", 71)]` },
        { expr: `updateMark "Dee" 80 marks`, expected: `[("Ana", 62), ("Ben", 48), ("Cal", 71), ("Dee", 80)]` },
        { expr: `updateMark "Ana" 0 marks`, expected: `[("Ana", 0), ("Ben", 48), ("Cal", 71)]` },
        { expr: `updateMark "Eve" 50 []`, expected: `[("Eve", 50)]` },
      ],
      hint: "Reaching the end of the list means the name wasn't there, so the base case is `[(name, m)]`, not `[]`.",
      solution: hs`updateMark :: String -> Int -> [Mark] -> [Mark]
updateMark name m [] = [(name, m)]
updateMark name m ((n, old) : rest)
  | n == name = (n, m) : rest
  | otherwise = (n, old) : updateMark name m rest
`,
    },
    {
      k: "write",
      setup: hs`type Basket = [(String, Int)]

basket :: Basket
basket = [("apple", 3), ("bread", 1), ("milk", 2)]
`,
      body: md(
        "A shopping basket records how many of each item it holds. Each item appears at most once, and every count is positive.",
        "",
        "Define a function `removeOne :: String -> Basket -> Basket` that takes one of the named item out of the basket. If that was the last one, the item's entry disappears. If the item isn't in the basket, it is unchanged. For example:",
        "",
        "```",
        "ghci> removeOne \"apple\" basket",
        "[(\"apple\",2),(\"bread\",1),(\"milk\",2)]",
        "ghci> removeOne \"bread\" basket",
        "[(\"apple\",3),(\"milk\",2)]",
        "```",
      ),
      starter: hs`removeOne :: String -> Basket -> Basket
removeOne item b = undefined
`,
      tests: [
        { expr: `removeOne "apple" basket`, expected: `[("apple", 2), ("bread", 1), ("milk", 2)]` },
        { expr: `removeOne "bread" basket`, expected: `[("apple", 3), ("milk", 2)]`, label: "last one: entry removed" },
        { expr: `removeOne "eggs" basket`, expected: "basket" },
        { expr: `removeOne "milk" []`, expected: "[]" },
      ],
      hint: "When you find the item, look at its count: if it's 1, drop the entry; otherwise put back `(item, n - 1)`. Either way stop recursing.",
      solution: hs`removeOne :: String -> Basket -> Basket
removeOne _ [] = []
removeOne item ((name, n) : rest)
  | name /= item = (name, n) : removeOne item rest
  | n == 1       = rest
  | otherwise    = (name, n - 1) : rest
`,
    },
    {
      k: "write",
      setup: hs`type Board = String

board :: Board
board = "X.O.."
`,
      body: md(
        "A one-row game board is a String. A `'.'` is an empty square; positions are numbered from 0.",
        "",
        "Define a function `placeAt :: Int -> Char -> Board -> Maybe Board` that puts a piece on a square. The result is `Nothing` if the position is off the board or the square is not empty. For example:",
        "",
        "```",
        "ghci> placeAt 1 'O' board",
        "Just \"XOO..\"",
        "ghci> placeAt 0 'O' board",
        "Nothing",
        "ghci> placeAt 9 'X' board",
        "Nothing",
        "```",
      ),
      starter: hs`placeAt :: Int -> Char -> Board -> Maybe Board
placeAt i c b = undefined
`,
      tests: [
        { expr: "placeAt 1 'O' board", expected: `Just "XOO.."` },
        { expr: "placeAt 4 'X' board", expected: `Just "X.O.X"`, label: "last square" },
        { expr: "placeAt 0 'O' board", expected: "Nothing", label: "square taken" },
        { expr: "placeAt 9 'X' board", expected: "Nothing" },
        { expr: "placeAt (-1) 'X' board", expected: "Nothing" },
      ],
      hint: "Check the position is in range first, then look at `b !! i`. To build the new board: `take i b ++ [c] ++ drop (i + 1) b`.",
      solution: hs`placeAt :: Int -> Char -> Board -> Maybe Board
placeAt i c b
  | i < 0 || i >= length b = Nothing
  | b !! i /= '.'          = Nothing
  | otherwise              = Just (take i b ++ [c] ++ drop (i + 1) b)
`,
    },
    {
      k: "quiz",
      q: "A spec says: \"Define `peak :: [Int] -> Int` ... A precondition is that the list is non-empty.\" What should your function do with `[]`?",
      options: [
        "Return a sensible default like 0, or you'll lose marks",
        "Anything: the tests will never use `[]`, so you don't need an equation for it",
        "Call `error` with a helpful message, or you'll lose marks",
        "Change the type to return `Maybe Int`",
      ],
      answer: 1,
      why: "A precondition is a promise about the input. You can rely on it, so `peak [x] = x` as a base case is fine. Don't change the given type: the auto-tester calls your function with exactly that type.",
    },
    {
      k: "write",
      setup: hs`trip :: [Int]
trip = [3, 5, 0, 2, 0, 0, 7]
`,
      body: md(
        "A delivery van logs the distance of each leg of its route. A `0` marks a visit to the depot, which ends one trip and starts the next.",
        "",
        "Define a function `segments :: [Int] -> [[Int]]` that splits a log into trips: the runs of non-zero distances between zeros. Empty trips are not included. For example:",
        "",
        "```",
        "ghci> segments trip",
        "[[3,5],[2],[7]]",
        "ghci> segments [0, 0]",
        "[]",
        "```",
      ),
      starter: hs`segments :: [Int] -> [[Int]]
segments xs = undefined
`,
      tests: [
        { expr: "segments trip", expected: "[[3, 5], [2], [7]]" },
        { expr: "segments [0, 0]", expected: "[]" },
        { expr: "segments []", expected: "[]" },
        { expr: "segments [4]", expected: "[[4]]" },
        { expr: "segments [0, 1, 2, 0]", expected: "[[1, 2]]", label: "zeros at both ends" },
      ],
      hint: "First skip any zeros with `dropWhile (== 0)`. If nothing is left, the answer is `[]`. Otherwise `break (== 0)` gives one trip and the rest of the log.",
      solution: hs`segments :: [Int] -> [[Int]]
segments xs = case dropWhile (== 0) xs of
  [] -> []
  ys -> run : segments rest
    where
      (run, rest) = break (== 0) ys
`,
    },
    {
      k: "write",
      body: md(
        "Readings that repeat can be stored as (value, count) pairs.",
        "",
        "Define a function `runs :: [Int] -> [(Int, Int)]` that replaces each run of equal neighbouring readings by the value and the length of the run. For example:",
        "",
        "```",
        "ghci> runs [3, 3, 5, 5, 5, 3]",
        "[(3,2),(5,3),(3,1)]",
        "ghci> runs []",
        "[]",
        "```",
      ),
      starter: hs`runs :: [Int] -> [(Int, Int)]
runs xs = undefined
`,
      tests: [
        { expr: "runs [3, 3, 5, 5, 5, 3]", expected: "[(3, 2), (5, 3), (3, 1)]", label: "3 appears in two separate runs" },
        { expr: "runs []", expected: "[]" },
        { expr: "runs [7]", expected: "[(7, 1)]" },
        { expr: "runs [1, 2]", expected: "[(1, 1), (2, 1)]" },
      ],
      hint: "For `(x : xs)`, use `span (== x) xs` to split off the other copies of `x`. The run's length is `1 + length same`.",
      solution: hs`runs :: [Int] -> [(Int, Int)]
runs [] = []
runs (x : xs) = (x, 1 + length same) : runs rest
  where
    (same, rest) = span (== x) xs
`,
      banned: ["group", "groupBy"],
    },
    {
      k: "write",
      setup: hs`votes :: [String]
votes = ["red", "blue", "red", "green", "blue", "red"]
`,
      body: md(
        "Define a function `tally :: [String] -> [(String, Int)]` that counts the votes for each option. The options appear in the order of their first vote. For example:",
        "",
        "```",
        "ghci> tally votes",
        "[(\"red\",3),(\"blue\",2),(\"green\",1)]",
        "ghci> tally []",
        "[]",
        "```",
        "",
        "You will probably want a helper `addVote :: String -> [(String, Int)] -> [(String, Int)]` that adds one vote to a tally.",
      ),
      starter: hs`tally :: [String] -> [(String, Int)]
tally vs = undefined
`,
      tests: [
        { expr: "tally votes", expected: `[("red", 3), ("blue", 2), ("green", 1)]` },
        { expr: "tally []", expected: "[]" },
        { expr: `tally ["x"]`, expected: `[("x", 1)]` },
        { expr: `tally ["b", "a", "b"]`, expected: `[("b", 2), ("a", 1)]`, label: "order of first vote, not alphabetical" },
      ],
      hint: "`addVote v` walks the tally: if it finds `v` it adds 1; if it reaches the end it adds `(v, 1)` there. Then process the votes left to right with an accumulator, starting from `[]`.",
      solution: hs`tally :: [String] -> [(String, Int)]
tally vs = go vs []
  where
    go [] acc = acc
    go (v : rest) acc = go rest (addVote v acc)

addVote :: String -> [(String, Int)] -> [(String, Int)]
addVote v [] = [(v, 1)]
addVote v ((c, n) : rest)
  | c == v    = (c, n + 1) : rest
  | otherwise = (c, n) : addVote v rest
`,
    },
    {
      k: "write",
      setup: hs`round1, round2 :: [(String, Int)]
round1 = [("amy", 5), ("dev", 3), ("zoe", 8)]
round2 = [("bob", 4), ("dev", 6)]
`,
      body: md(
        "A quiz keeps a score table for each round. Each table is sorted by name and has no repeated names.",
        "",
        "Define a function `mergeScores :: [(String, Int)] -> [(String, Int)] -> [(String, Int)]` that combines two tables into one, still sorted by name. A player in both tables gets the sum of their scores. For example:",
        "",
        "```",
        "ghci> mergeScores round1 round2",
        "[(\"amy\",5),(\"bob\",4),(\"dev\",9),(\"zoe\",8)]",
        "```",
      ),
      starter: hs`mergeScores :: [(String, Int)] -> [(String, Int)] -> [(String, Int)]
mergeScores t1 t2 = undefined
`,
      tests: [
        { expr: "mergeScores round1 round2", expected: `[("amy", 5), ("bob", 4), ("dev", 9), ("zoe", 8)]` },
        { expr: "mergeScores [] round2", expected: "round2" },
        { expr: "mergeScores round1 []", expected: "round1" },
        { expr: `mergeScores [("a", 1)] [("a", 2)]`, expected: `[("a", 3)]` },
      ],
      hint: "Like merging two sorted lists. Compare the two first names: if they're equal, add the scores and move on in both lists; otherwise take the smaller name first.",
      solution: hs`mergeScores :: [(String, Int)] -> [(String, Int)] -> [(String, Int)]
mergeScores [] ys = ys
mergeScores xs [] = xs
mergeScores ((a, s) : xs) ((b, t) : ys)
  | a == b    = (a, s + t) : mergeScores xs ys
  | a < b     = (a, s) : mergeScores xs ((b, t) : ys)
  | otherwise = (b, t) : mergeScores ((a, s) : xs) ys
`,
      banned: ["sort", "sortBy", "sortOn"],
    },
    {
      k: "write",
      setup: hs`type Train = (Int, String)

timetable :: [Train]
timetable = [(800, "Leeds"), (830, "York"), (900, "Hull")]
`,
      body: md(
        "A departures board is a list of trains, each a departure time (like 830 for 08:30) and a destination. The board is sorted by time.",
        "",
        "Define a function `addTrain :: Train -> [Train] -> [Train]` that adds a train to the board, keeping it sorted. A new train that leaves at the same time as existing trains goes after them. For example:",
        "",
        "```",
        "ghci> addTrain (830, \"Bath\") timetable",
        "[(800,\"Leeds\"),(830,\"York\"),(830,\"Bath\"),(900,\"Hull\")]",
        "ghci> addTrain (700, \"Ely\") timetable",
        "[(700,\"Ely\"),(800,\"Leeds\"),(830,\"York\"),(900,\"Hull\")]",
        "```",
      ),
      starter: hs`addTrain :: Train -> [Train] -> [Train]
addTrain t board = undefined
`,
      tests: [
        { expr: `addTrain (830, "Bath") timetable`, expected: `[(800, "Leeds"), (830, "York"), (830, "Bath"), (900, "Hull")]`, label: "same time goes after" },
        { expr: `addTrain (700, "Ely") timetable`, expected: `[(700, "Ely"), (800, "Leeds"), (830, "York"), (900, "Hull")]` },
        { expr: `addTrain (1000, "Wells") timetable`, expected: `[(800, "Leeds"), (830, "York"), (900, "Hull"), (1000, "Wells")]` },
        { expr: `addTrain (900, "Ayr") []`, expected: `[(900, "Ayr")]` },
      ],
      hint: "Compare only the times. Keep walking while the existing train's time is less than or equal to the new one, so equal times stay in front.",
      solution: hs`addTrain :: Train -> [Train] -> [Train]
addTrain t [] = [t]
addTrain (time, dest) ((t2, d2) : rest)
  | t2 <= time = (t2, d2) : addTrain (time, dest) rest
  | otherwise  = (time, dest) : (t2, d2) : rest
`,
      banned: ["sort", "sortBy", "sortOn", "insert", "insertBy"],
    },
    {
      k: "write",
      setup: hs`route :: [String]
route = ["Acton", "Bank", "Cove", "Bank"]
`,
      body: md(
        "Define a function `swapStations :: String -> String -> [String] -> [String]` that swaps two stations everywhere in a route: every `a` becomes `b` and every `b` becomes `a`. Other stations are unchanged. For example:",
        "",
        "```",
        "ghci> swapStations \"Acton\" \"Bank\" route",
        "[\"Bank\",\"Acton\",\"Cove\",\"Acton\"]",
        "ghci> swapStations \"Cove\" \"Dale\" route",
        "[\"Acton\",\"Bank\",\"Dale\",\"Bank\"]",
        "```",
      ),
      starter: hs`swapStations :: String -> String -> [String] -> [String]
swapStations a b stops = undefined
`,
      tests: [
        { expr: `swapStations "Acton" "Bank" route`, expected: `["Bank", "Acton", "Cove", "Acton"]` },
        { expr: `swapStations "Cove" "Dale" route`, expected: `["Acton", "Bank", "Dale", "Bank"]`, label: "only one of them is present" },
        { expr: `swapStations "X" "Y" route`, expected: "route" },
        { expr: `swapStations "X" "Y" []`, expected: "[]" },
      ],
      hint: "Guards on each station `s`: if `s == a` put `b`; if `s == b` put `a`; otherwise keep `s`. Then recurse.",
      solution: hs`swapStations :: String -> String -> [String] -> [String]
swapStations _ _ [] = []
swapStations a b (s : rest)
  | s == a    = b : swapStations a b rest
  | s == b    = a : swapStations a b rest
  | otherwise = s : swapStations a b rest
`,
    },
    {
      k: "write",
      setup: hs`text :: [String]
text = ["the", "quick", "brown", "fox", "jumps"]
`,
      body: md(
        "Define a function `wrapWords :: Int -> [String] -> [[String]]` that splits a list of words into lines for a screen of a given width. Lines are filled greedily: each line takes as many of the next words as fit, where the words of a line joined by single spaces must be at most `width` characters. A word longer than `width` goes on a line of its own. A precondition is that `width > 0`. For example:",
        "",
        "```",
        "ghci> wrapWords 10 text",
        "[[\"the\",\"quick\"],[\"brown\",\"fox\"],[\"jumps\"]]",
        "ghci> wrapWords 3 [\"hello\", \"a\", \"b\"]",
        "[[\"hello\"],[\"a\",\"b\"]]",
        "ghci> wrapWords 5 []",
        "[]",
        "```",
        "",
        "[4 marks]",
      ),
      starter: hs`wrapWords :: Int -> [String] -> [[String]]
wrapWords width ws = undefined
`,
      tests: [
        { expr: "wrapWords 10 text", expected: `[["the", "quick"], ["brown", "fox"], ["jumps"]]` },
        { expr: `wrapWords 3 ["hello", "a", "b"]`, expected: `[["hello"], ["a", "b"]]`, label: "a long word sits alone; \"a b\" is exactly 3" },
        { expr: "wrapWords 5 []", expected: "[]" },
        { expr: "wrapWords 100 text", expected: "[text]" },
        { expr: "wrapWords 1 text", expected: "map (: []) text" },
      ],
      hint: "Every line starts with at least one word. Write a helper `fill line used rest` that keeps taking the next word `x` while `used + 1 + length x <= width`, and returns the finished line and the words still left. Then recurse on those.",
      solution: hs`wrapWords :: Int -> [String] -> [[String]]
wrapWords _ [] = []
wrapWords width (w : ws) = line : wrapWords width rest
  where
    (line, rest) = fill [w] (length w) ws
    fill acc _ [] = (reverse acc, [])
    fill acc used (x : xs)
      | used + 1 + length x <= width = fill (x : acc) (used + 1 + length x) xs
      | otherwise                    = (reverse acc, x : xs)
`,
    },
    {
      k: "write",
      setup: hs`type Leg = (String, String, Int)

coast :: [Leg]
coast = [ ("Ayr", "Troon", 12), ("Troon", "Irvine", 8)
        , ("Irvine", "Kilwinning", 6), ("Kilwinning", "Largs", 25) ]
`,
      body: md(
        "A train route is a list of legs `(from, to, minutes)`, in order: each leg starts where the previous one ended.",
        "",
        "Define a function `journey :: String -> String -> [Leg] -> Maybe Int` that gives the travel time from station `a` to station `b`. Start adding at the leg that leaves `a` and stop after the leg that arrives at `b`. The result is `Nothing` if no leg leaves `a`, or if `b` is not reached after `a`. A precondition is that `a /= b`. For example:",
        "",
        "```",
        "ghci> journey \"Troon\" \"Kilwinning\" coast",
        "Just 14",
        "ghci> journey \"Irvine\" \"Troon\" coast",
        "Nothing",
        "ghci> journey \"Paris\" \"Largs\" coast",
        "Nothing",
        "```",
        "",
        "[4 marks]",
      ),
      starter: hs`journey :: String -> String -> [Leg] -> Maybe Int
journey a b legs = undefined
`,
      tests: [
        { expr: `journey "Troon" "Kilwinning" coast`, expected: "Just 14" },
        { expr: `journey "Ayr" "Largs" coast`, expected: "Just 51", label: "the whole route" },
        { expr: `journey "Ayr" "Troon" coast`, expected: "Just 12", label: "a single leg" },
        { expr: `journey "Irvine" "Troon" coast`, expected: "Nothing", label: "b comes before a" },
        { expr: `journey "Paris" "Largs" coast`, expected: "Nothing" },
        { expr: `journey "Ayr" "Troon" []`, expected: "Nothing" },
      ],
      hint: "Two steps. First skip legs until one leaves `a`: `dropWhile (\\(from, _, _) -> from /= a) legs`. Then add up minutes with a helper that returns `Just m` at the leg arriving at `b`, and `Nothing` if the legs run out.",
      solution: hs`journey :: String -> String -> [Leg] -> Maybe Int
journey a b legs = case dropWhile (\(from, _, _) -> from /= a) legs of
  []   -> Nothing
  rest -> addUp rest
  where
    addUp [] = Nothing
    addUp ((_, to, m) : more)
      | to == b   = Just m
      | otherwise = case addUp more of
          Nothing -> Nothing
          Just t  -> Just (m + t)
`,
    },
    {
      k: "write",
      setup: hs`pages :: [Int]
pages = [1, 2, 3, 7, 8, 10]
`,
      body: md(
        "A printer is given a list of page numbers, sorted ascending with no repeats.",
        "",
        "Define a function `groupConsecutive :: [Int] -> [[Int]]` that groups the pages into runs of consecutive numbers. Then use it to define `ranges :: [Int] -> String`, which writes each run as `first-last` (or just the number, for a run of one), separated by commas. For example:",
        "",
        "```",
        "ghci> groupConsecutive pages",
        "[[1,2,3],[7,8],[10]]",
        "ghci> ranges pages",
        "\"1-3,7-8,10\"",
        "ghci> ranges []",
        "\"\"",
        "```",
        "",
        "[4 marks]",
      ),
      starter: hs`groupConsecutive :: [Int] -> [[Int]]
groupConsecutive ns = undefined

ranges :: [Int] -> String
ranges ns = undefined
`,
      tests: [
        { expr: "groupConsecutive pages", expected: "[[1, 2, 3], [7, 8], [10]]" },
        { expr: "groupConsecutive []", expected: "[]" },
        { expr: "groupConsecutive [4, 5, 6]", expected: "[[4, 5, 6]]" },
        { expr: "groupConsecutive [1, 3, 5]", expected: "[[1], [3], [5]]" },
        { expr: "ranges pages", expected: `"1-3,7-8,10"` },
        { expr: "ranges []", expected: `""` },
        { expr: "ranges [5]", expected: `"5"` },
        { expr: "ranges [1, 2, 4]", expected: `"1-2,4"` },
      ],
      hint: "For `groupConsecutive (x : xs)`, group the rest first. If the first group of the rest starts with `x + 1`, put `x` on the front of it; otherwise start a new group `[x]`. For `ranges`, show each group and join with `intercalate \",\"` (from Data.List).",
      solution: hs`import Data.List (intercalate)

groupConsecutive :: [Int] -> [[Int]]
groupConsecutive [] = []
groupConsecutive (x : xs) = case groupConsecutive xs of
  ((y : ys) : gs) | y == x + 1 -> (x : y : ys) : gs
  gs                           -> [x] : gs

ranges :: [Int] -> String
ranges ns = intercalate "," (map showRun (groupConsecutive ns))
  where
    showRun [x] = show x
    showRun run = show (head run) ++ "-" ++ show (last run)
`,
    },
    {
      k: "write",
      setup: hs`type Pos = (Int, Int)

data Dir = U | D | L | R
  deriving (Show, Eq)

snake :: [Pos]
snake = [(2, 2), (1, 2), (0, 2)]

longSnake :: [Pos]
longSnake = [(3, 0), (2, 0), (1, 0), (0, 0), (-1, 0)]
`,
      body: md(
        "In a snake game the snake is a list of positions `(x, y)`, head first. `U` increases `y`, `D` decreases `y`, `R` increases `x` and `L` decreases `x`. A snake is never empty.",
        "",
        "Define a function `move :: Dir -> [Pos] -> [Pos]` that moves the snake one step: the new head is one step from the old head in the given direction, every other segment follows, and the snake stays the same length.",
        "",
        "Then define `survive :: [Dir] -> [Pos] -> Maybe [Pos]` that makes a list of moves in order. If after any move the head is on the same square as another segment, the snake has crashed and the result is `Nothing` (later moves are not made). Otherwise the result is `Just` the final snake. For example:",
        "",
        "```",
        "ghci> move R snake",
        "[(3,2),(2,2),(1,2)]",
        "ghci> move U snake",
        "[(2,3),(2,2),(1,2)]",
        "ghci> survive [U, L] longSnake",
        "Just [(2,1),(3,1),(3,0),(2,0),(1,0)]",
        "ghci> survive [U, L, D, R] longSnake",
        "Nothing",
        "```",
        "",
        "[5 marks]",
      ),
      starter: hs`move :: Dir -> [Pos] -> [Pos]
move d body = undefined

survive :: [Dir] -> [Pos] -> Maybe [Pos]
survive ds body = undefined
`,
      tests: [
        { expr: "move R snake", expected: "[(3, 2), (2, 2), (1, 2)]" },
        { expr: "move U snake", expected: "[(2, 3), (2, 2), (1, 2)]" },
        { expr: "move L [(5, 5)]", expected: "[(4, 5)]", label: "a one-segment snake" },
        { expr: "move D snake", expected: "[(2, 1), (2, 2), (1, 2)]" },
        { expr: "survive [] snake", expected: "Just snake" },
        { expr: "survive [U, L] longSnake", expected: "Just [(2, 1), (3, 1), (3, 0), (2, 0), (1, 0)]" },
        { expr: "survive [U, L, D, R] longSnake", expected: "Nothing", label: "crashes on the third move" },
      ],
      hint: "`move d body = step d (head body) : init body`, with a small helper `step` for one direction at a time. For `survive`, move once, check `elem newHead (tail newSnake)`, and only recurse if there was no crash.",
      solution: hs`move :: Dir -> [Pos] -> [Pos]
move d body = step d (head body) : init body
  where
    step U (x, y) = (x, y + 1)
    step D (x, y) = (x, y - 1)
    step L (x, y) = (x - 1, y)
    step R (x, y) = (x + 1, y)

survive :: [Dir] -> [Pos] -> Maybe [Pos]
survive [] body = Just body
survive (d : ds) body
  | elem h rest = Nothing
  | otherwise   = survive ds (h : rest)
  where
    (h : rest) = move d body
`,
    },
    {
      k: "write",
      setup: hs`yesterday, today :: [Int]
yesterday = [1, 3, 5, 7]
today = [3, 4, 7, 9]
`,
      body: md(
        "A shop records the product codes in stock each day, as a list sorted ascending with no repeats.",
        "",
        "Define a function `diffLists :: [Int] -> [Int] -> ([Int], [Int])` that compares two such lists. The result is the codes only in the first list, and the codes only in the second list, both sorted. Your answer must walk down both lists together, so it does not use `elem` or `filter`. For example:",
        "",
        "```",
        "ghci> diffLists yesterday today",
        "([1,5],[4,9])",
        "ghci> diffLists [] [1, 2]",
        "([],[1,2])",
        "ghci> diffLists [1, 2] [1, 2]",
        "([],[])",
        "```",
        "",
        "[4 marks]",
      ),
      starter: hs`diffLists :: [Int] -> [Int] -> ([Int], [Int])
diffLists xs ys = undefined
`,
      tests: [
        { expr: "diffLists yesterday today", expected: "([1, 5], [4, 9])" },
        { expr: "diffLists [] [1, 2]", expected: "([], [1, 2])" },
        { expr: "diffLists [1, 2] [1, 2]", expected: "([], [])" },
        { expr: "diffLists [2] []", expected: "([2], [])" },
        { expr: "diffLists [1, 2, 3] [4, 5]", expected: "([1, 2, 3], [4, 5])", label: "no overlap" },
      ],
      hint: "Compare the two heads. Equal: skip both. `x < y`: `x` is only in the first list, so put it on the front of the first part of the answer for `xs` and `y : ys`. Otherwise `y` is only in the second list.",
      solution: hs`diffLists :: [Int] -> [Int] -> ([Int], [Int])
diffLists [] ys = ([], ys)
diffLists xs [] = (xs, [])
diffLists (x : xs) (y : ys)
  | x == y    = diffLists xs ys
  | x < y     = (x : a, b)
  | otherwise = (c, y : d)
  where
    (a, b) = diffLists xs (y : ys)
    (c, d) = diffLists (x : xs) ys
`,
      banned: ["elem", "notElem", "filter"],
    },
  ],
};

const extra: DrillSet = {
  id: "b-lists-extra",
  lesson: "",
  level: 5,
  title: "Extra practice",
  intro: md(
    "More of the same list recursion, mixed difficulty, so you can keep practising without new ideas.",
    "Toward the end the questions are exam-style: a short description, a type, and a GHCi transcript.",
  ),
  drills: [
    {
      k: "quiz",
      q: "What is the value of `xs` after the pattern `(x : xs)` matches `[True]`?",
      options: ["`True`", "`[True]`", "`[]`", "The match fails"],
      answer: 2,
      why: "`[True]` is `True : []`, so `x` is `True` and `xs` is the rest, which is empty.",
    },
    {
      k: "predict",
      expr: "let f [] = 1; f (x : xs) = x * f xs in f [2, 5]",
      answer: "10",
      why: "`2 * (5 * 1)` is 10. The empty-list case is 1, so a product of nothing is 1.",
    },
    {
      k: "write",
      body: "Write `productAll`, which multiplies every Int in a list. The product of nothing is 1.",
      starter: hs`productAll :: [Int] -> Int
productAll xs = undefined
`,
      tests: [
        { expr: "productAll [2, 3, 4]", expected: "24" },
        { expr: "productAll []", expected: "1", label: "empty product is 1" },
        { expr: "productAll [7]", expected: "7" },
        { expr: "productAll [2, 0, 9]", expected: "0" },
        { expr: "productAll [-2, 3]", expected: "-6" },
      ],
      hint: "The product of `[]` is `1`. The product of `x : xs` is `x * productAll xs`.",
      solution: hs`productAll :: [Int] -> Int
productAll [] = 1
productAll (x : xs) = x * productAll xs
`,
      banned: ["product", "foldr", "foldl"],
    },
    {
      k: "write",
      body: "Write `allPositive`, which is True when every element of a list is greater than 0. An empty list counts as True.",
      starter: hs`allPositive :: [Int] -> Bool
allPositive xs = undefined
`,
      tests: [
        { expr: "allPositive [1, 2, 3]", expected: "True" },
        { expr: "allPositive []", expected: "True", label: "nothing fails the test" },
        { expr: "allPositive [1, 0, 2]", expected: "False" },
        { expr: "allPositive [-1]", expected: "False" },
        { expr: "allPositive [4]", expected: "True" },
      ],
      hint: "Empty is True. For `x : xs`, you need `x > 0` and `allPositive xs`.",
      solution: hs`allPositive :: [Int] -> Bool
allPositive [] = True
allPositive (x : xs) = x > 0 && allPositive xs
`,
      banned: ["all", "and"],
    },
    {
      k: "write",
      body: "Write `addN`, which adds the same Int to every element of a list.",
      starter: hs`addN :: Int -> [Int] -> [Int]
addN n xs = undefined
`,
      tests: [
        { expr: "addN 3 [1, 2, 3]", expected: "[4, 5, 6]" },
        { expr: "addN 1 []", expected: "[]" },
        { expr: "addN 0 [5, -1]", expected: "[5, -1]" },
        { expr: "addN (-2) [2]", expected: "[0]" },
      ],
      hint: "`addN n (x : xs)` is `x + n` on the front of `addN n xs`.",
      solution: hs`addN :: Int -> [Int] -> [Int]
addN _ [] = []
addN n (x : xs) = (x + n) : addN n xs
`,
      banned: ["map"],
    },
    {
      k: "write",
      body: "Write `oddsOnly`, which keeps only the odd numbers, in the same order.",
      starter: hs`oddsOnly :: [Int] -> [Int]
oddsOnly xs = undefined
`,
      tests: [
        { expr: "oddsOnly [1, 2, 3, 4, 5]", expected: "[1, 3, 5]" },
        { expr: "oddsOnly []", expected: "[]" },
        { expr: "oddsOnly [2, 4, 8]", expected: "[]" },
        { expr: "oddsOnly [-3, 0, -1]", expected: "[-3, -1]" },
      ],
      hint: "If `odd x`, put `x` on the front of the answer for the rest; otherwise skip it.",
      solution: hs`oddsOnly :: [Int] -> [Int]
oddsOnly [] = []
oddsOnly (x : xs)
  | odd x     = x : oddsOnly xs
  | otherwise = oddsOnly xs
`,
      banned: ["filter"],
    },
    {
      k: "write",
      body: "Write `butLast`, which drops the last element of a non-empty list. You may assume the list is not empty.",
      starter: hs`butLast :: [a] -> [a]
butLast xs = undefined
`,
      tests: [
        { expr: "butLast [1, 2, 3]", expected: "[1, 2]" },
        { expr: "butLast [7]", expected: "[]" },
        { expr: `butLast "hi"`, expected: `"h"` },
        { expr: "butLast [True, False]", expected: "[True]" },
      ],
      hint: "A one-element list becomes `[]`. Otherwise keep the head and recurse on the rest.",
      solution: hs`butLast :: [a] -> [a]
butLast [_] = []
butLast (x : xs) = x : butLast xs
`,
      banned: ["init"],
    },
    {
      k: "write",
      body: "Write `countNeg`, which counts how many elements are strictly less than 0.",
      starter: hs`countNeg :: [Int] -> Int
countNeg xs = undefined
`,
      tests: [
        { expr: "countNeg [1, -2, 0, -3]", expected: "2" },
        { expr: "countNeg []", expected: "0" },
        { expr: "countNeg [0, 4]", expected: "0" },
        { expr: "countNeg [-1, -1, -1]", expected: "3" },
      ],
      hint: "If `x < 0`, add 1 to the count of the rest; otherwise just take the count of the rest.",
      solution: hs`countNeg :: [Int] -> Int
countNeg [] = 0
countNeg (x : xs)
  | x < 0     = 1 + countNeg xs
  | otherwise = countNeg xs
`,
    },
    {
      k: "write",
      body: "Write `minOf`, the smallest Int in a non-empty list. You may assume the list is not empty.",
      starter: hs`minOf :: [Int] -> Int
minOf xs = undefined
`,
      tests: [
        { expr: "minOf [3, 1, 4]", expected: "1" },
        { expr: "minOf [8]", expected: "8" },
        { expr: "minOf [-2, -9, 0]", expected: "-9" },
        { expr: "minOf [5, 5, 5]", expected: "5" },
      ],
      hint: "A singleton is itself. Otherwise `min x (minOf xs)`.",
      solution: hs`minOf :: [Int] -> Int
minOf [x] = x
minOf (x : xs) = min x (minOf xs)
`,
      banned: ["minimum"],
    },
    {
      k: "write",
      body: "Write `myAppend`, which sticks two lists together. Do not use `++`.",
      starter: hs`myAppend :: [a] -> [a] -> [a]
myAppend xs ys = undefined
`,
      tests: [
        { expr: "myAppend [1, 2] [3, 4]", expected: "[1, 2, 3, 4]" },
        { expr: "myAppend [] [9]", expected: "[9]" },
        { expr: "myAppend [9] []", expected: "[9]" },
        { expr: `myAppend "ab" "c"`, expected: `"abc"` },
      ],
      hint: "Walk the first list: `myAppend [] ys` is `ys`, and `myAppend (x : xs) ys` is `x : myAppend xs ys`.",
      solution: hs`myAppend :: [a] -> [a] -> [a]
myAppend [] ys = ys
myAppend (x : xs) ys = x : myAppend xs ys
`,
      banned: ["++"],
    },
    {
      k: "write",
      body: "Write `everyOther`, which keeps the elements at even positions (counting from 0), so the first, third, fifth, ... stay.",
      starter: hs`everyOther :: [a] -> [a]
everyOther xs = undefined
`,
      tests: [
        { expr: "everyOther [1, 2, 3, 4, 5]", expected: "[1, 3, 5]" },
        { expr: "everyOther ([] :: [Int])", expected: "[]" },
        { expr: "everyOther [7]", expected: "[7]" },
        { expr: `everyOther "abcd"`, expected: `"ac"` },
      ],
      hint: "Keep the head, skip the next if there is one, and recurse. Two equations covering `[]`, `[x]` and `x : _ : xs` work.",
      solution: hs`everyOther :: [a] -> [a]
everyOther [] = []
everyOther [x] = [x]
everyOther (x : _ : xs) = x : everyOther xs
`,
    },
    {
      k: "write",
      body: "Write `isPalindrome`, which is True when a list reads the same forwards and backwards.",
      starter: hs`isPalindrome :: Eq a => [a] -> Bool
isPalindrome xs = undefined
`,
      tests: [
        { expr: `isPalindrome "kayak"`, expected: "True" },
        { expr: `isPalindrome "ka"`, expected: "False" },
        { expr: "isPalindrome ([] :: [Int])", expected: "True" },
        { expr: "isPalindrome [1, 2, 1]", expected: "True" },
        { expr: "isPalindrome [1, 1]", expected: "True" },
      ],
      hint: "Compare the list with its reverse. You may write a small reverse helper.",
      solution: hs`isPalindrome :: Eq a => [a] -> Bool
isPalindrome xs = xs == rev xs []
  where
    rev [] acc = acc
    rev (y : ys) acc = rev ys (y : acc)
`,
    },
    {
      k: "write",
      body: "Write `dropWhileNeg`, which drops a prefix of negative numbers and keeps the rest, including later negatives.",
      starter: hs`dropWhileNeg :: [Int] -> [Int]
dropWhileNeg xs = undefined
`,
      tests: [
        { expr: "dropWhileNeg [-2, -1, 3, -4]", expected: "[3, -4]" },
        { expr: "dropWhileNeg []", expected: "[]" },
        { expr: "dropWhileNeg [5, -1]", expected: "[5, -1]" },
        { expr: "dropWhileNeg [-1, -2]", expected: "[]" },
        { expr: "dropWhileNeg [0, -1]", expected: "[0, -1]", label: "0 is not negative" },
      ],
      hint: "Keep dropping while the head is `< 0`. Stop as soon as you see a non-negative, or the list ends.",
      solution: hs`dropWhileNeg :: [Int] -> [Int]
dropWhileNeg [] = []
dropWhileNeg (x : xs)
  | x < 0     = dropWhileNeg xs
  | otherwise = x : xs
`,
      banned: ["dropWhile"],
    },
    {
      k: "write",
      body: "Write `takeUntilZero`, which keeps elements up to but not including the first 0. If there is no 0, keep the whole list.",
      starter: hs`takeUntilZero :: [Int] -> [Int]
takeUntilZero xs = undefined
`,
      tests: [
        { expr: "takeUntilZero [1, 2, 0, 4]", expected: "[1, 2]" },
        { expr: "takeUntilZero []", expected: "[]" },
        { expr: "takeUntilZero [0, 1]", expected: "[]" },
        { expr: "takeUntilZero [3, 4]", expected: "[3, 4]" },
        { expr: "takeUntilZero [0]", expected: "[]" },
      ],
      hint: "If the head is 0, stop with `[]`. Otherwise keep the head and continue.",
      solution: hs`takeUntilZero :: [Int] -> [Int]
takeUntilZero [] = []
takeUntilZero (x : xs)
  | x == 0    = []
  | otherwise = x : takeUntilZero xs
`,
      banned: ["takeWhile"],
    },
    {
      k: "write",
      body: "Write `flatten`, which joins a list of lists into one list, in order.",
      starter: hs`flatten :: [[a]] -> [a]
flatten xss = undefined
`,
      tests: [
        { expr: "flatten [[1, 2], [3], []]", expected: "[1, 2, 3]" },
        { expr: "flatten ([] :: [[Int]])", expected: "[]" },
        { expr: "flatten [[7]]", expected: "[7]" },
        { expr: `flatten ["ab", "c"]`, expected: `"abc"` },
      ],
      hint: "`flatten (xs : xss)` is `xs` stuck in front of `flatten xss` (you may use `++` here).",
      solution: hs`flatten :: [[a]] -> [a]
flatten [] = []
flatten (xs : xss) = xs ++ flatten xss
`,
      banned: ["concat"],
    },
    {
      k: "write",
      body: "Write `replaceAll`, which replaces every copy of one value with another.",
      starter: hs`replaceAll :: Eq a => a -> a -> [a] -> [a]
replaceAll old new xs = undefined
`,
      tests: [
        { expr: "replaceAll 1 9 [1, 2, 1]", expected: "[9, 2, 9]" },
        { expr: "replaceAll 1 9 []", expected: "[]" },
        { expr: "replaceAll 1 9 [2, 3]", expected: "[2, 3]" },
        { expr: `replaceAll 'a' 'b' "aa"`, expected: `"bb"` },
      ],
      hint: "If the head equals `old`, put `new` on the front of the recursive answer; otherwise keep the head.",
      solution: hs`replaceAll :: Eq a => a -> a -> [a] -> [a]
replaceAll _ _ [] = []
replaceAll old new (x : xs)
  | x == old  = new : replaceAll old new xs
  | otherwise = x : replaceAll old new xs
`,
    },
    {
      k: "write",
      body: "Write `tailsOf`, which returns every suffix of a list, longest first, including the empty suffix.",
      starter: hs`tailsOf :: [a] -> [[a]]
tailsOf xs = undefined
`,
      tests: [
        { expr: "tailsOf [1, 2, 3]", expected: "[[1, 2, 3], [2, 3], [3], []]" },
        { expr: "tailsOf ([] :: [Int])", expected: "[[]]" },
        { expr: "tailsOf [7]", expected: "[[7], []]" },
        { expr: `tailsOf "ab"`, expected: `["ab", "b", ""]` },
      ],
      hint: "The first suffix is the whole list. Then recurse on the rest. The empty list has one suffix: `[]` itself.",
      solution: hs`tailsOf :: [a] -> [[a]]
tailsOf [] = [[]]
tailsOf xs@(_ : rest) = xs : tailsOf rest
`,
      banned: ["tails"],
    },
    {
      k: "write",
      body: "Write `zipSum`, which adds matching elements of two Int lists. Stop when either list runs out.",
      starter: hs`zipSum :: [Int] -> [Int] -> [Int]
zipSum xs ys = undefined
`,
      tests: [
        { expr: "zipSum [1, 2, 3] [10, 20, 30]", expected: "[11, 22, 33]" },
        { expr: "zipSum [1, 2] [10, 20, 30]", expected: "[11, 22]" },
        { expr: "zipSum [] [1]", expected: "[]" },
        { expr: "zipSum [1] []", expected: "[]" },
        { expr: "zipSum [-1] [1]", expected: "[0]" },
      ],
      hint: "If either list is empty, the answer is `[]`. Otherwise add the two heads and recurse.",
      solution: hs`zipSum :: [Int] -> [Int] -> [Int]
zipSum (x : xs) (y : ys) = (x + y) : zipSum xs ys
zipSum _ _ = []
`,
      banned: ["zipWith", "zip"],
    },
    {
      k: "write",
      body: "Write `isSuffix`, which is True when the first list is a suffix of the second (including when they are equal, or the first is empty).",
      starter: hs`isSuffix :: Eq a => [a] -> [a] -> Bool
isSuffix xs ys = undefined
`,
      tests: [
        { expr: `isSuffix "ing" "string"`, expected: "True" },
        { expr: `isSuffix "str" "string"`, expected: "False" },
        { expr: `isSuffix "" "ab"`, expected: "True" },
        { expr: "isSuffix [1, 2] [1, 2]", expected: "True" },
        { expr: "isSuffix [1] []", expected: "False" },
      ],
      hint: "A helper that walks `ys` and checks whether the remaining tail equals `xs` works. Or drop `length ys - length xs` from `ys` and compare, if the first list is not longer.",
      solution: hs`isSuffix :: Eq a => [a] -> [a] -> Bool
isSuffix xs ys = go ys
  where
    go zs = zs == xs || case zs of
      [] -> False
      _ : rest -> go rest
`,
      banned: ["isSuffixOf"],
    },
    {
      k: "write",
      body: "Write `removeAll`, which drops every copy of a value and keeps the rest in order.",
      starter: hs`removeAll :: Eq a => a -> [a] -> [a]
removeAll x xs = undefined
`,
      tests: [
        { expr: "removeAll 1 [1, 2, 1, 3]", expected: "[2, 3]" },
        { expr: "removeAll 1 []", expected: "[]" },
        { expr: "removeAll 1 [1, 1]", expected: "[]" },
        { expr: `removeAll ' ' "a b c"`, expected: `"abc"` },
      ],
      hint: "If the head matches, skip it; otherwise keep it. Recurse either way.",
      solution: hs`removeAll :: Eq a => a -> [a] -> [a]
removeAll _ [] = []
removeAll x (y : ys)
  | x == y    = removeAll x ys
  | otherwise = y : removeAll x ys
`,
      banned: ["filter"],
    },
    {
      k: "write",
      body: "Write `cycleN`, which repeats a list `n` times, stuck together. If `n` is 0 or less, the answer is empty.",
      starter: hs`cycleN :: Int -> [a] -> [a]
cycleN n xs = undefined
`,
      tests: [
        { expr: "cycleN 3 [1, 2]", expected: "[1, 2, 1, 2, 1, 2]" },
        { expr: "cycleN 0 [1, 2]", expected: "[]" },
        { expr: "cycleN 2 ([] :: [Int])", expected: "[]" },
        { expr: "cycleN 1 [9]", expected: "[9]" },
        { expr: "cycleN (-1) [1]", expected: "[]" },
      ],
      hint: "If `n <= 0` return `[]`. Otherwise `xs ++ cycleN (n - 1) xs`.",
      solution: hs`cycleN :: Int -> [a] -> [a]
cycleN n xs
  | n <= 0    = []
  | otherwise = xs ++ cycleN (n - 1) xs
`,
      banned: ["cycle", "replicate", "concat"],
    },
    {
      k: "write",
      body: "Write `scanMax`, which replaces each element by the maximum of the prefix up to that point. For example `scanMax [3, 1, 4, 2]` is `[3, 3, 4, 4]`.",
      starter: hs`scanMax :: [Int] -> [Int]
scanMax xs = undefined
`,
      tests: [
        { expr: "scanMax [3, 1, 4, 2]", expected: "[3, 3, 4, 4]" },
        { expr: "scanMax []", expected: "[]" },
        { expr: "scanMax [5]", expected: "[5]" },
        { expr: "scanMax [-1, -3, 0]", expected: "[-1, -1, 0]" },
      ],
      hint: "A helper `go soFar rest` puts `max soFar x` on the front and continues with that new maximum.",
      solution: hs`scanMax :: [Int] -> [Int]
scanMax [] = []
scanMax (x : xs) = go x xs
  where
    go m [] = [m]
    go m (y : ys) = m : go (max m y) ys
`,
      banned: ["scanl"],
    },
    {
      k: "write",
      body: "Write `splitWhen`, which splits a list at the first occurrence of a value. The value itself starts the second half. If it never appears, the second half is empty.",
      starter: hs`splitWhen :: Eq a => a -> [a] -> ([a], [a])
splitWhen x xs = undefined
`,
      tests: [
        { expr: "splitWhen 0 [1, 2, 0, 3]", expected: "([1, 2], [0, 3])" },
        { expr: "splitWhen 0 []", expected: "([], [])" },
        { expr: "splitWhen 0 [0, 1]", expected: "([], [0, 1])" },
        { expr: "splitWhen 9 [1, 2]", expected: "([1, 2], [])" },
      ],
      hint: "If the head is the value, the first half is `[]` and the second is the whole remaining list. Otherwise the head belongs on the first half.",
      solution: hs`splitWhen :: Eq a => a -> [a] -> ([a], [a])
splitWhen _ [] = ([], [])
splitWhen x xs@(y : ys)
  | x == y    = ([], xs)
  | otherwise = let (a, b) = splitWhen x ys in (y : a, b)
`,
      banned: ["break", "span"],
    },
    {
      k: "write",
      body: "Write `keepUntil`, which keeps elements while they are not equal to a given value, and drops the rest (including that value).",
      starter: hs`keepUntil :: Eq a => a -> [a] -> [a]
keepUntil x xs = undefined
`,
      tests: [
        { expr: "keepUntil 0 [1, 2, 0, 3]", expected: "[1, 2]" },
        { expr: "keepUntil 0 []", expected: "[]" },
        { expr: "keepUntil 0 [0]", expected: "[]" },
        { expr: "keepUntil 9 [1, 2]", expected: "[1, 2]" },
      ],
      hint: "Stop with `[]` when the head matches. Otherwise keep the head and continue.",
      solution: hs`keepUntil :: Eq a => a -> [a] -> [a]
keepUntil _ [] = []
keepUntil x (y : ys)
  | x == y    = []
  | otherwise = y : keepUntil x ys
`,
      banned: ["takeWhile"],
    },
    {
      k: "write",
      body: "Write `myUnzip`, which splits a list of pairs into a pair of lists.",
      starter: hs`myUnzip :: [(a, b)] -> ([a], [b])
myUnzip xys = undefined
`,
      tests: [
        { expr: "myUnzip [(1, 'a'), (2, 'b')]", expected: "([1, 2], \"ab\")" },
        { expr: "myUnzip ([] :: [(Int, Char)])", expected: "([], [])" },
        { expr: "myUnzip [(True, 0)]", expected: "([True], [0])" },
        { expr: "myUnzip [(1, 2), (3, 4), (5, 6)]", expected: "([1, 3, 5], [2, 4, 6])" },
      ],
      hint: "Unzip the rest, then put `a` on the first list and `b` on the second.",
      solution: hs`myUnzip :: [(a, b)] -> ([a], [b])
myUnzip [] = ([], [])
myUnzip ((a, b) : rest) = (a : as, b : bs)
  where
    (as, bs) = myUnzip rest
`,
      banned: ["unzip"],
    },
    {
      k: "write",
      body: "Write `dropLast`, which drops the last `n` elements of a list. If `n` is 0 or less, return the list unchanged. If `n` is too big, return `[]`.",
      starter: hs`dropLast :: Int -> [a] -> [a]
dropLast n xs = undefined
`,
      tests: [
        { expr: "dropLast 2 [1, 2, 3, 4]", expected: "[1, 2]" },
        { expr: "dropLast 0 [1, 2]", expected: "[1, 2]" },
        { expr: "dropLast 5 [1, 2]", expected: "[]" },
        { expr: "dropLast 1 ([] :: [Int])", expected: "[]" },
        { expr: "dropLast (-1) [1]", expected: "[1]" },
      ],
      hint: "A simple way: `take (length xs - n) xs` when `n` is between 0 and the length. Watch the `n <= 0` case.",
      solution: hs`dropLast :: Int -> [a] -> [a]
dropLast n xs
  | n <= 0    = xs
  | otherwise = take (length xs - n) xs
`,
    },
    {
      k: "write",
      body: "Write `windows3`, which returns every adjacent triple as a list of three. A list shorter than 3 gives `[]`.",
      starter: hs`windows3 :: [a] -> [[a]]
windows3 xs = undefined
`,
      tests: [
        { expr: "windows3 [1, 2, 3, 4]", expected: "[[1, 2, 3], [2, 3, 4]]" },
        { expr: "windows3 [1, 2]", expected: "[]" },
        { expr: "windows3 ([] :: [Int])", expected: "[]" },
        { expr: "windows3 [1, 2, 3]", expected: "[[1, 2, 3]]" },
      ],
      hint: "If you can see three elements `a : b : c : rest`, the first window is `[a, b, c]` and then you recurse on `b : c : rest`.",
      solution: hs`windows3 :: [a] -> [[a]]
windows3 (a : b : c : rest) = [a, b, c] : windows3 (b : c : rest)
windows3 _ = []
`,
    },
    {
      k: "write",
      body: "Write `equalNeighbours`, which counts how many adjacent pairs are equal.",
      starter: hs`equalNeighbours :: Eq a => [a] -> Int
equalNeighbours xs = undefined
`,
      tests: [
        { expr: "equalNeighbours [1, 1, 2, 2, 2]", expected: "3" },
        { expr: "equalNeighbours ([] :: [Int])", expected: "0" },
        { expr: "equalNeighbours [7]", expected: "0" },
        { expr: `equalNeighbours "abba"`, expected: "1" },
        { expr: "equalNeighbours [1, 2, 1]", expected: "0" },
      ],
      hint: "Look at the first two. If they are equal, add 1, then recurse on the list starting at the second element.",
      solution: hs`equalNeighbours :: Eq a => [a] -> Int
equalNeighbours (x : y : ys)
  | x == y    = 1 + equalNeighbours (y : ys)
  | otherwise = equalNeighbours (y : ys)
equalNeighbours _ = 0
`,
    },
    {
      k: "write",
      body: "Write `mapIf`, which applies a function only to elements that pass a test, and leaves the others unchanged.",
      starter: hs`mapIf :: (a -> Bool) -> (a -> a) -> [a] -> [a]
mapIf p f xs = undefined
`,
      tests: [
        { expr: "mapIf even (* 10) [1, 2, 3, 4]", expected: "[1, 20, 3, 40]" },
        { expr: "mapIf even (* 10) []", expected: "[]" },
        { expr: "mapIf (> 0) abs [-1, 2]", expected: "[-1, 2]" },
        { expr: "mapIf (const True) (+ 1) [0, 0]", expected: "[1, 1]" },
      ],
      hint: "If `p x`, put `f x` on the front; otherwise put `x`. Recurse on the rest either way.",
      solution: hs`mapIf :: (a -> Bool) -> (a -> a) -> [a] -> [a]
mapIf _ _ [] = []
mapIf p f (x : xs)
  | p x       = f x : mapIf p f xs
  | otherwise = x : mapIf p f xs
`,
    },
    {
      k: "write",
      body: "Write `longestOf`, which returns the longest list among a list of lists. If several have that length, return the first of them. If the outer list is empty, return `[]`.",
      starter: hs`longestOf :: [[a]] -> [a]
longestOf xss = undefined
`,
      tests: [
        { expr: "longestOf [[1], [1, 2, 3], [1, 2]]", expected: "[1, 2, 3]" },
        { expr: "longestOf ([] :: [[Int]])", expected: "[]" },
        { expr: "longestOf [[], [1], []]", expected: "[1]" },
        { expr: `longestOf ["aa", "b", "cc"]`, expected: `"aa"`, label: "tie: first wins" },
      ],
      hint: "Walk the list keeping the best so far. A list is better if it is strictly longer.",
      solution: hs`longestOf :: [[a]] -> [a]
longestOf [] = []
longestOf (xs : xss) = go xs xss
  where
    go best [] = best
    go best (ys : yss)
      | length ys > length best = go ys yss
      | otherwise               = go best yss
`,
    },
    {
      k: "quiz",
      q: "A helper `go acc (x : xs) = go (x : acc) xs` builds an answer by putting each element on the front of `acc`. After walking `[1, 2, 3]` starting from `[]`, what is `acc`?",
      options: ["`[1, 2, 3]`", "`[3, 2, 1]`", "`[]`", "`[1]`"],
      answer: 1,
      why: "Each step puts the new head on the front, so the original list comes out reversed. That is the usual reverse-with-an-accumulator trick.",
    },
    {
      k: "predict",
      expr: "let f xs ys = case (xs, ys) of { ([], _) -> []; (_, []) -> []; (x : xt, y : yt) -> (x, y) : f xt yt } in f [1, 2] \"ab\"",
      answer: "[(1, 'a'), (2, 'b')]",
      why: "This is zip: pair the two heads, then recurse. It stops when either list is empty.",
    },
    {
      k: "write",
      setup: hs`type Item = (String, Int)

receipt :: [Item]
receipt = [("tea", 120), ("cake", 250), ("tea", 120)]
`,
      body: md(
        "A shop receipt is a list of items; each item is a name and a price in pence:",
        "",
        "```",
        "type Item = (String, Int)",
        "```",
        "",
        "Define a function `receiptTotal :: [Item] -> Int` that adds up the prices. Use recursion. For example:",
        "",
        "```",
        "ghci> receiptTotal receipt",
        "490",
        "ghci> receiptTotal []",
        "0",
        "```",
      ),
      starter: hs`receiptTotal :: [Item] -> Int
receiptTotal items = undefined
`,
      tests: [
        { expr: "receiptTotal receipt", expected: "490" },
        { expr: "receiptTotal []", expected: "0" },
        { expr: `receiptTotal [("a", 1)]`, expected: "1" },
        { expr: `receiptTotal [("a", 0), ("b", 5)]`, expected: "5" },
      ],
      hint: "Pattern match on the pair: `receiptTotal ((_, p) : rest) = p + receiptTotal rest`.",
      solution: hs`receiptTotal :: [Item] -> Int
receiptTotal [] = 0
receiptTotal ((_, p) : rest) = p + receiptTotal rest
`,
      banned: ["sum", "map", "foldr"],
    },
    {
      k: "write",
      setup: hs`type Mail = (String, Bool)

inbox :: [Mail]
inbox = [("ann", True), ("raj", False), ("li", True), ("ann", True)]
`,
      body: md(
        "A mailbox is a list of messages. Each message is a sender and a Bool that is True when the message is unread:",
        "",
        "```",
        "type Mail = (String, Bool)",
        "```",
        "",
        "Define a function `unreadCount :: [Mail] -> Int` that returns how many messages are unread. For example:",
        "",
        "```",
        "ghci> unreadCount inbox",
        "3",
        "ghci> unreadCount []",
        "0",
        "```",
      ),
      starter: hs`unreadCount :: [Mail] -> Int
unreadCount ms = undefined
`,
      tests: [
        { expr: "unreadCount inbox", expected: "3" },
        { expr: "unreadCount []", expected: "0" },
        { expr: `unreadCount [("x", False)]`, expected: "0" },
        { expr: `unreadCount [("x", True), ("y", True)]`, expected: "2" },
      ],
      hint: "If the Bool is True, add 1; otherwise skip. Recurse on the rest.",
      solution: hs`unreadCount :: [Mail] -> Int
unreadCount [] = 0
unreadCount ((_, u) : rest)
  | u         = 1 + unreadCount rest
  | otherwise = unreadCount rest
`,
    },
    {
      k: "write",
      body: md(
        "DNA is written as a String of bases `'A'`, `'T'`, `'C'` and `'G'`.",
        "",
        "Define a function `dnaPair :: String -> String` that returns the complementary strand: A pairs with T, T with A, C with G and G with C. Any other character is left unchanged. For example:",
        "",
        "```",
        "ghci> dnaPair \"ATCG\"",
        "\"TAGC\"",
        "ghci> dnaPair \"\"",
        "\"\"",
        "ghci> dnaPair \"ANx\"",
        "\"TNx\"",
        "```",
      ),
      starter: hs`dnaPair :: String -> String
dnaPair s = undefined
`,
      tests: [
        { expr: `dnaPair "ATCG"`, expected: `"TAGC"` },
        { expr: `dnaPair ""`, expected: `""` },
        { expr: `dnaPair "ANx"`, expected: `"TNx"` },
        { expr: `dnaPair "aa"`, expected: `"aa"`, label: "only uppercase bases change" },
        { expr: `dnaPair "G"`, expected: `"C"` },
      ],
      hint: "A small helper on one Char, then recurse down the String.",
      solution: hs`dnaPair :: String -> String
dnaPair [] = []
dnaPair (c : cs) = pair c : dnaPair cs
  where
    pair 'A' = 'T'
    pair 'T' = 'A'
    pair 'C' = 'G'
    pair 'G' = 'C'
    pair x   = x
`,
    },
    {
      k: "write",
      body: md(
        "A simple editor records commands as a list of Strings, oldest first. The command `\"undo\"` cancels the previous kept command (and is not kept itself). An `\"undo\"` with nothing left to cancel is ignored.",
        "",
        "Define a function `runUndo :: [String] -> [String]` that returns the commands that remain. For example:",
        "",
        "```",
        "ghci> runUndo [\"a\", \"b\", \"undo\", \"c\"]",
        "[\"a\",\"c\"]",
        "ghci> runUndo [\"undo\"]",
        "[]",
        "ghci> runUndo [\"a\", \"undo\", \"undo\"]",
        "[]",
        "```",
      ),
      starter: hs`runUndo :: [String] -> [String]
runUndo cmds = undefined
`,
      tests: [
        { expr: `runUndo ["a", "b", "undo", "c"]`, expected: `["a", "c"]` },
        { expr: `runUndo ["undo"]`, expected: "[]" },
        { expr: `runUndo ["a", "undo", "undo"]`, expected: "[]" },
        { expr: `runUndo []`, expected: "[]" },
        { expr: `runUndo ["a", "b"]`, expected: `["a", "b"]` },
      ],
      hint: "Walk left to right with an accumulator of kept commands (newest at the front). For `\"undo\"`, drop the head of the accumulator if there is one. Reverse at the end.",
      solution: hs`runUndo :: [String] -> [String]
runUndo cmds = reverse (go cmds [])
  where
    go [] acc = acc
    go ("undo" : rest) acc = case acc of
      []       -> go rest []
      (_ : as) -> go rest as
    go (c : rest) acc = go rest (c : acc)
`,
    },
    {
      k: "write",
      setup: hs`type Fare = (String, String, Int)

fares :: [Fare]
fares = [("Ayr", "Troon", 10), ("Troon", "Irvine", 8), ("Irvine", "Glasgow", 30)]
`,
      body: md(
        "A fare table is a list of triples: from-station, to-station, price in pence:",
        "",
        "```",
        "type Fare = (String, String, Int)",
        "```",
        "",
        "Define a function `lookupFare :: String -> String -> [Fare] -> Int` that returns the price of that hop, or 0 if the hop is not in the table. For example:",
        "",
        "```",
        "ghci> lookupFare \"Troon\" \"Irvine\" fares",
        "8",
        "ghci> lookupFare \"Ayr\" \"Glasgow\" fares",
        "0",
        "```",
      ),
      starter: hs`lookupFare :: String -> String -> [Fare] -> Int
lookupFare from to table = undefined
`,
      tests: [
        { expr: `lookupFare "Troon" "Irvine" fares`, expected: "8" },
        { expr: `lookupFare "Ayr" "Glasgow" fares`, expected: "0" },
        { expr: `lookupFare "Ayr" "Troon" []`, expected: "0" },
        { expr: `lookupFare "Irvine" "Glasgow" fares`, expected: "30" },
        { expr: `lookupFare "Troon" "Ayr" fares`, expected: "0", label: "direction matters" },
      ],
      hint: "Walk the table. When both strings match, return that price. If you run out, return 0.",
      solution: hs`lookupFare :: String -> String -> [Fare] -> Int
lookupFare _ _ [] = 0
lookupFare from to ((a, b, p) : rest)
  | from == a && to == b = p
  | otherwise            = lookupFare from to rest
`,
    },
    {
      k: "write",
      body: md(
        "A walk is recorded as a list of altitudes in metres, one per step.",
        "",
        "Define a function `climbGain :: [Int] -> Int` that returns the total uphill: the sum of the positive differences between consecutive altitudes. Flat or downhill steps add nothing. For example:",
        "",
        "```",
        "ghci> climbGain [100, 120, 110, 150]",
        "60",
        "ghci> climbGain [50]",
        "0",
        "```",
      ),
      starter: hs`climbGain :: [Int] -> Int
climbGain hs = undefined
`,
      tests: [
        { expr: "climbGain [100, 120, 110, 150]", expected: "60" },
        { expr: "climbGain [50]", expected: "0" },
        { expr: "climbGain []", expected: "0" },
        { expr: "climbGain [10, 10, 8]", expected: "0" },
        { expr: "climbGain [0, 5, 5, 6]", expected: "6" },
      ],
      hint: "Look at the first two heights. If the second is bigger, add the difference, then recurse on the list starting at the second height.",
      solution: hs`climbGain :: [Int] -> Int
climbGain (a : b : rest)
  | b > a     = (b - a) + climbGain (b : rest)
  | otherwise = climbGain (b : rest)
climbGain _ = 0
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `wordLens :: String -> [Int]` that returns the length of each word in a sentence. Words are separated by spaces. Ignore extra spaces, so leading, trailing and doubled spaces do not make empty words. For example:",
        "",
        "```",
        "ghci> wordLens \"hi there\"",
        "[2,5]",
        "ghci> wordLens \"  a  bb \"",
        "[1,2]",
        "ghci> wordLens \"\"",
        "[]",
        "```",
      ),
      starter: hs`wordLens :: String -> [Int]
wordLens s = undefined
`,
      tests: [
        { expr: `wordLens "hi there"`, expected: "[2, 5]" },
        { expr: `wordLens "  a  bb "`, expected: "[1, 2]" },
        { expr: `wordLens ""`, expected: "[]" },
        { expr: `wordLens "one"`, expected: "[3]" },
        { expr: `wordLens "   "`, expected: "[]" },
      ],
      hint: "Skip spaces, then count letters until the next space (or the end), then repeat.",
      solution: hs`wordLens :: String -> [Int]
wordLens [] = []
wordLens (' ' : cs) = wordLens cs
wordLens cs = length w : wordLens rest
  where
    (w, rest) = span (/= ' ') cs
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `dealHands :: Int -> [a] -> [[a]]` that deals a list of cards to `n` players in round-robin order. Player 0 gets the first card, player 1 the second, and so on, wrapping round. If `n` is 0 or less, return `[]`. For example:",
        "",
        "```",
        "ghci> dealHands 2 [1, 2, 3, 4, 5]",
        "[[1,3,5],[2,4]]",
        "ghci> dealHands 3 [1, 2, 3, 4]",
        "[[1,4],[2],[3]]",
        "ghci> dealHands 0 [1, 2]",
        "[]",
        "```",
      ),
      starter: hs`dealHands :: Int -> [a] -> [[a]]
dealHands n cards = undefined
`,
      tests: [
        { expr: "dealHands 2 [1, 2, 3, 4, 5]", expected: "[[1, 3, 5], [2, 4]]" },
        { expr: "dealHands 3 [1, 2, 3, 4]", expected: "[[1, 4], [2], [3]]" },
        { expr: "dealHands 0 [1, 2]", expected: "[]" },
        { expr: "dealHands 2 ([] :: [Int])", expected: "[[], []]" },
        { expr: "dealHands 1 [7, 8]", expected: "[[7, 8]]" },
      ],
      hint: "For each player `i` from 0 to `n - 1`, walk the deck keeping every nth card, starting at offset `i`.",
      solution: hs`dealHands :: Int -> [a] -> [[a]]
dealHands n cards
  | n <= 0    = []
  | otherwise = [everyFrom i cards | i <- [0 .. n - 1]]
  where
    everyFrom _ [] = []
    everyFrom 0 (x : xs) = x : everyFrom (n - 1) xs
    everyFrom k (_ : xs) = everyFrom (k - 1) xs
`,
    },
  ],
};

export const book: Book = {
  id: "b-lists",
  order: 1,
  title: "Lists and recursion",
  blurb: "Pattern matching on lists, base cases, accumulators, list surgery and walking two lists at once.",
  sets: [level1, level2, level3, level4, extra],
};
