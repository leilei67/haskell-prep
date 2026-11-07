import { type DrillSet, hs, md } from "./schema.ts";

// ---------------------------------------------------------------------------
// Mixed exercise 1: books 1-2
// ---------------------------------------------------------------------------

const mixed01: DrillSet = {
  id: "mixed-01",
  lesson: "",
  title: "Mixed exercise 1",
  intro: md(
    "Mixed review of **Book 1** (lists and recursion) and **Book 2** (map, filter, folds and comprehensions).",
    "",
    "The questions aren't labelled by topic. Part of the job is spotting which tool fits: plain recursion, a `map`/`filter`, a fold or a list comprehension. Often more than one works.",
    "",
    "The set starts gently and gets harder. The last eight questions are written the way the January test writes them: a short description, a type and a GHCi transcript.",
  ),
  drills: [
    {
      k: "predict",
      expr: "sum (map (* 2) [1, 2, 3])",
      answer: "12",
      why: "`map (* 2)` doubles each element, giving `[2, 4, 6]`, and the sum of that is 12.",
    },
    {
      k: "quiz",
      q: "You need the number of elements of `xs` that are bigger than 10. Which expression gives it?",
      options: ["`length (filter (> 10) xs)`", "`filter (> 10) (length xs)`", "`map (> 10) xs`", "`sum (filter (> 10) xs)`"],
      answer: 0,
      why: "`filter (> 10) xs` keeps the big ones; `length` counts them. `map (> 10) xs` gives a list of Bools, and `sum` would add the values instead of counting them.",
    },
    {
      k: "write",
      body: "Write `countEvens`, which gives how many even numbers are in a list.",
      starter: hs`countEvens :: [Int] -> Int
countEvens xs = undefined
`,
      tests: [
        { expr: "countEvens [1, 2, 3, 4]", expected: "2" },
        { expr: "countEvens []", expected: "0" },
        { expr: "countEvens [1, 3, 5]", expected: "0" },
        { expr: "countEvens [0, -2]", expected: "2", label: "0 and negative evens count too" },
      ],
      hint: "Filter with `even`, then take the `length`.",
      solution: hs`countEvens :: [Int] -> Int
countEvens xs = length (filter even xs)
`,
    },
    {
      k: "write",
      body: md(
        "Write `final`, which gives the last element of a **non-empty** list. Use recursion rather than the built-in `last`.",
      ),
      starter: hs`final :: [a] -> a
final xs = undefined
`,
      tests: [
        { expr: "final [1, 2, 3]", expected: "3" },
        { expr: `final "x"`, expected: "'x'" },
        { expr: "final [5, 4]", expected: "4" },
        { expr: "final [1 .. 10]", expected: "10" },
      ],
      hint: "Two equations: a one-element list `[x]` gives `x`; otherwise `(_ : rest)` gives `final rest`. The `[x]` equation must come first.",
      solution: hs`final :: [a] -> a
final [x]        = x
final (_ : rest) = final rest
`,
      banned: ["last"],
    },
    {
      k: "predict",
      expr: "[x * y | x <- [1, 2], y <- [10, 20]]",
      answer: "[10, 20, 20, 40]",
      why: "The later generator `y` runs fastest: `x = 1` with `y = 10, 20`, then `x = 2` with `y = 10, 20`.",
    },
    {
      k: "write",
      body: "Write `squaresOfOdds`, which squares every odd number in the list and drops the even ones.",
      starter: hs`squaresOfOdds :: [Int] -> [Int]
squaresOfOdds xs = undefined
`,
      tests: [
        { expr: "squaresOfOdds [1 .. 5]", expected: "[1, 9, 25]" },
        { expr: "squaresOfOdds []", expected: "[]" },
        { expr: "squaresOfOdds [2, 4]", expected: "[]" },
        { expr: "squaresOfOdds [-3]", expected: "[9]", label: "negative odd numbers are odd" },
      ],
      hint: "A comprehension does both jobs at once: `[x * x | x <- xs, odd x]`.",
      solution: hs`squaresOfOdds :: [Int] -> [Int]
squaresOfOdds xs = [x * x | x <- xs, odd x]
`,
    },
    {
      k: "write",
      body: md("Write `adjacentPairs`, which pairs each element with the one after it:", "", "```", "adjacentPairs [1, 2, 3]  ==  [(1, 2), (2, 3)]", "```"),
      starter: hs`adjacentPairs :: [a] -> [(a, a)]
adjacentPairs xs = undefined
`,
      tests: [
        { expr: "adjacentPairs [1, 2, 3]", expected: "[(1, 2), (2, 3)]" },
        { expr: `adjacentPairs "ab"`, expected: "[('a', 'b')]" },
        { expr: "adjacentPairs [7]", expected: "[]" },
        { expr: "adjacentPairs ([] :: [Int])", expected: "[]" },
      ],
      hint: "Zip the list with itself shifted by one: `zip xs (drop 1 xs)`. `zip` stops at the shorter list.",
      solution: hs`adjacentPairs :: [a] -> [(a, a)]
adjacentPairs xs = zip xs (drop 1 xs)
`,
    },
    {
      k: "quiz",
      q: "What is `foldr (\\x acc -> x : acc) [] xs`?",
      options: ["`xs`, unchanged", "`reverse xs`", "`[]`", "A list holding only the last element"],
      answer: 0,
      why: "`foldr` replaces each `:` with the function and `[]` with the start value. Here the function *is* `:` and the start value *is* `[]`, so the list is rebuilt exactly as it was.",
    },
    {
      k: "write",
      body: md("Write `everyOther`, which keeps the 1st, 3rd, 5th, ... elements:", "", "```", 'everyOther "abcde"  ==  "ace"', "```"),
      starter: hs`everyOther :: [a] -> [a]
everyOther xs = undefined
`,
      tests: [
        { expr: "everyOther [1 .. 6]", expected: "[1, 3, 5]" },
        { expr: `everyOther "abcde"`, expected: `"ace"` },
        { expr: "everyOther ([] :: [Int])", expected: "[]" },
        { expr: "everyOther [9]", expected: "[9]" },
      ],
      hint: "Match two elements at a time: `everyOther (x : _ : rest) = x : everyOther rest`. Lists shorter than two come back unchanged.",
      solution: hs`everyOther :: [a] -> [a]
everyOther (x : _ : rest) = x : everyOther rest
everyOther xs             = xs
`,
    },
    {
      k: "predict",
      expr: "foldr (-) 0 [10, 4, 1]",
      answer: "7",
      why: "`foldr` brackets from the right: `10 - (4 - (1 - 0))` is `10 - (4 - 1)`, which is `10 - 3`, so 7.",
    },
    {
      k: "write",
      body: md("Write `runningTotals`, where each element of the answer is the sum of everything up to and including that position:", "", "```", "runningTotals [1, 2, 3]  ==  [1, 3, 6]", "```"),
      starter: hs`runningTotals :: [Int] -> [Int]
runningTotals xs = undefined
`,
      tests: [
        { expr: "runningTotals [1, 2, 3]", expected: "[1, 3, 6]" },
        { expr: "runningTotals []", expected: "[]" },
        { expr: "runningTotals [5]", expected: "[5]" },
        { expr: "runningTotals [1, -1, 1]", expected: "[1, 0, 1]" },
      ],
      hint: "Carry the total so far in a helper: `go acc (x : rest) = (acc + x) : go (acc + x) rest`, starting from `go 0`.",
      solution: hs`runningTotals :: [Int] -> [Int]
runningTotals = go 0
  where
    go _ []         = []
    go acc (x : xs) = (acc + x) : go (acc + x) xs
`,
    },
    {
      k: "write",
      body: md("Write `stretch n xs`, which repeats every element `n` times:", "", "```", 'stretch 2 "abc"  ==  "aabbcc"', "```"),
      starter: hs`stretch :: Int -> [a] -> [a]
stretch n xs = undefined
`,
      tests: [
        { expr: `stretch 2 "abc"`, expected: `"aabbcc"` },
        { expr: "stretch 3 [1]", expected: "[1, 1, 1]" },
        { expr: `stretch 0 "abc"`, expected: `""` },
        { expr: `stretch 2 ""`, expected: `""` },
      ],
      hint: "`concatMap (replicate n) xs`, or the comprehension `[x | x <- xs, _ <- [1 .. n]]`.",
      solution: hs`stretch :: Int -> [a] -> [a]
stretch n xs = concatMap (replicate n) xs
`,
    },
    {
      k: "predict",
      expr: "takeWhile (< 4) [1, 3, 5, 2]",
      answer: "[1, 3]",
      why: "`takeWhile` stops for good at the first element that fails the test (5). The 2 after it is never looked at.",
    },
    {
      k: "write",
      body: md("Write `positions x xs`, the indexes (counting from 0) where `x` appears in `xs`:", "", "```", "positions 'a' \"banana\"  ==  [1, 3, 5]", "```"),
      starter: hs`positions :: Eq a => a -> [a] -> [Int]
positions x xs = undefined
`,
      tests: [
        { expr: `positions 'a' "banana"`, expected: "[1, 3, 5]" },
        { expr: "positions 3 [3, 1, 3]", expected: "[0, 2]" },
        { expr: `positions 'z' "abc"`, expected: "[]" },
        { expr: "positions 1 []", expected: "[]" },
      ],
      hint: "Pair each element with its index using `zip [0 ..] xs`, then keep the indexes whose element equals `x`.",
      solution: hs`positions :: Eq a => a -> [a] -> [Int]
positions x xs = [i | (i, y) <- zip [0 ..] xs, y == x]
`,
    },
    {
      k: "quiz",
      q: md("What happens when you evaluate `biggest [3, 1]`?", "", "```", "biggest :: [Int] -> Int", "biggest (x : xs) = max x (biggest xs)", "```"),
      options: ["`3`", "An error: no equation matches the empty list", "`1`", "`0`"],
      answer: 1,
      why: "The recursion keeps going until it calls `biggest []`, and no equation matches `[]`. The function needs a base case such as `biggest [x] = x`, written before the general equation.",
    },
    {
      k: "write",
      body: md("Write `mergeSorted`, which merges two lists that are each in ascending order into one ascending list. Keep duplicates.", "", "```", "mergeSorted [1, 4, 6] [2, 3, 7]  ==  [1, 2, 3, 4, 6, 7]", "```"),
      starter: hs`mergeSorted :: [Int] -> [Int] -> [Int]
mergeSorted xs ys = undefined
`,
      tests: [
        { expr: "mergeSorted [1, 4, 6] [2, 3, 7]", expected: "[1, 2, 3, 4, 6, 7]" },
        { expr: "mergeSorted [] [1, 2]", expected: "[1, 2]" },
        { expr: "mergeSorted [1, 2] []", expected: "[1, 2]" },
        { expr: "mergeSorted [1, 1] [1]", expected: "[1, 1, 1]", label: "duplicates are kept" },
      ],
      hint: "If either list is empty, the answer is the other one. Otherwise compare the two heads, output the smaller, and recurse on what's left.",
      solution: hs`mergeSorted :: [Int] -> [Int] -> [Int]
mergeSorted [] ys = ys
mergeSorted xs [] = xs
mergeSorted (x : xs) (y : ys)
  | x <= y    = x : mergeSorted xs (y : ys)
  | otherwise = y : mergeSorted (x : xs) ys
`,
    },
    {
      k: "write",
      body: md("Write `chunks n xs`, which cuts `xs` into pieces of length `n` (the last piece may be shorter). You may assume `n > 0`.", "", "```", "chunks 2 [1 .. 5]  ==  [[1, 2], [3, 4], [5]]", "```"),
      starter: hs`chunks :: Int -> [a] -> [[a]]
chunks n xs = undefined
`,
      tests: [
        { expr: "chunks 2 [1 .. 5]", expected: "[[1, 2], [3, 4], [5]]" },
        { expr: `chunks 3 "abcdef"`, expected: `["abc", "def"]` },
        { expr: `chunks 4 ""`, expected: "[]" },
        { expr: "chunks 5 [1, 2]", expected: "[[1, 2]]" },
      ],
      hint: "Base case `chunks _ [] = []`. Otherwise `take n xs : chunks n (drop n xs)`.",
      solution: hs`chunks :: Int -> [a] -> [[a]]
chunks _ [] = []
chunks n xs = take n xs : chunks n (drop n xs)
`,
    },
    {
      k: "write",
      body: md(
        "A shopping basket is a list of `(item, unitPrice, quantity)` triples, with prices in pence.",
        "",
        "Define a function `basketTotal :: [(String, Int, Int)] -> Int` that returns the total cost of a basket. For example:",
        "",
        "```",
        '*Main> basketTotal [("tea", 250, 2), ("milk", 95, 1)]',
        "595",
        "*Main> basketTotal []",
        "0",
        "```",
      ),
      starter: hs`basketTotal :: [(String, Int, Int)] -> Int
basketTotal basket = undefined
`,
      tests: [
        { expr: hs`basketTotal [("tea", 250, 2), ("milk", 95, 1)]`, expected: "595" },
        { expr: "basketTotal []", expected: "0" },
        { expr: hs`basketTotal [("pen", 30, 0)]`, expected: "0" },
        { expr: hs`basketTotal [("a", 1, 1), ("b", 2, 2), ("c", 3, 3)]`, expected: "14" },
      ],
      hint: "Take each triple apart in a comprehension: `sum [p * q | (_, p, q) <- basket]`.",
      solution: hs`basketTotal :: [(String, Int, Int)] -> Int
basketTotal basket = sum [p * q | (_, p, q) <- basket]
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `allSame :: Eq a => [a] -> Bool` that will return `True` if every item in a given list is the same; `False` otherwise. For example:",
        "",
        "```",
        "*Main> allSame []",
        "True",
        "*Main> allSame [9,9,9]",
        "True",
        '*Main> allSame "abc"',
        "False",
        "```",
      ),
      starter: hs`allSame :: Eq a => [a] -> Bool
allSame xs = undefined
`,
      tests: [
        { expr: "allSame ([] :: [Int])", expected: "True" },
        { expr: "allSame [9, 9, 9]", expected: "True" },
        { expr: `allSame "abc"`, expected: "False" },
        { expr: "allSame [1]", expected: "True" },
        { expr: "allSame [1, 1, 2]", expected: "False", label: "the odd one out is last" },
      ],
      hint: "Every element equals its neighbour: `and (zipWith (==) xs (drop 1 xs))`. Or compare everything with the head.",
      solution: hs`allSame :: Eq a => [a] -> Bool
allSame xs = and (zipWith (==) xs (drop 1 xs))
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `rotate :: Int -> [a] -> [a]` that moves the first `n` elements of a list to the end. If `n` is larger than the length of the list it wraps around, so rotating a list of length 5 by 7 is the same as rotating it by 2. Rotating `[]` gives `[]`. You may assume `n >= 0`. For example:",
        "",
        "```",
        "*Main> rotate 2 [1,2,3,4,5]",
        "[3,4,5,1,2]",
        "*Main> rotate 7 [1,2,3,4,5]",
        "[3,4,5,1,2]",
        '*Main> rotate 3 "abc"',
        '"abc"',
        "```",
      ),
      starter: hs`rotate :: Int -> [a] -> [a]
rotate n xs = undefined
`,
      tests: [
        { expr: "rotate 2 [1 .. 5]", expected: "[3, 4, 5, 1, 2]" },
        { expr: "rotate 7 [1 .. 5]", expected: "[3, 4, 5, 1, 2]" },
        { expr: `rotate 3 "abc"`, expected: `"abc"` },
        { expr: `rotate 0 "abc"`, expected: `"abc"` },
        { expr: `rotate 3 ""`, expected: `""`, label: "rotating [] must not divide by zero" },
      ],
      hint: "Work out `k = mod n (length xs)` and then `drop k xs ++ take k xs`. Deal with `[]` in its own equation first, since `mod n 0` is an error.",
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
        "Define a function `runs :: Eq a => [a] -> [Int]` that returns the lengths of the runs of equal adjacent items in a list. For example:",
        "",
        "```",
        '*Main> runs "aaabcc"',
        "[3,1,2]",
        "*Main> runs [1,2,1]",
        "[1,1,1]",
        "*Main> runs []",
        "[]",
        "```",
      ),
      starter: hs`runs :: Eq a => [a] -> [Int]
runs xs = undefined
`,
      tests: [
        { expr: `runs "aaabcc"`, expected: "[3, 1, 2]" },
        { expr: "runs [1, 2, 1]", expected: "[1, 1, 1]" },
        { expr: "runs ([] :: [Int])", expected: "[]" },
        { expr: "runs [4, 4, 4]", expected: "[3]" },
        { expr: `runs "abbb"`, expected: "[1, 3]" },
      ],
      hint: "`span (== x) rest` splits off the elements equal to the head `x`. The run length is `1 + length same`, then recurse on the remainder.",
      solution: hs`runs :: Eq a => [a] -> [Int]
runs [] = []
runs (x : rest) = (1 + length same) : runs others
  where
    (same, others) = span (== x) rest
`,
    },
    {
      k: "write",
      body: md(
        "A matrix is a list of rows, all of the same length. Define a function `columns :: [[a]] -> [[a]]` that returns the columns of a matrix (its transpose). A precondition is that the matrix has at least one row. For example:",
        "",
        "```",
        "*Main> columns [[1,2,3],[4,5,6]]",
        "[[1,4],[2,5],[3,6]]",
        "*Main> columns [[1,2]]",
        "[[1],[2]]",
        "```",
      ),
      starter: hs`columns :: [[a]] -> [[a]]
columns rows = undefined
`,
      tests: [
        { expr: "columns [[1, 2, 3], [4, 5, 6]]", expected: "[[1, 4], [2, 5], [3, 6]]" },
        { expr: "columns [[1, 2]]", expected: "[[1], [2]]" },
        { expr: "columns [[1], [2], [3]]", expected: "[[1, 2, 3]]" },
        { expr: "columns ([[], []] :: [[Int]])", expected: "[]", label: "rows of length 0 have no columns" },
      ],
      hint: "When the first row is empty there are no columns left. Otherwise the first column is `map head rows`, and the rest are the columns of `map tail rows`.",
      solution: hs`columns :: [[a]] -> [[a]]
columns ([] : _) = []
columns rows     = map head rows : columns (map tail rows)
`,
    },
    {
      k: "write",
      body: md(
        "Each row of Pascal's triangle is made from the one above by adding neighbouring pairs, with a 1 at each end: `[1]`, `[1,1]`, `[1,2,1]`, `[1,3,3,1]`, ...",
        "",
        "Define a function `pascal :: Int -> [[Int]]` that returns the first `n` rows. For example:",
        "",
        "```",
        "*Main> pascal 4",
        "[[1],[1,1],[1,2,1],[1,3,3,1]]",
        "*Main> pascal 0",
        "[]",
        "```",
      ),
      starter: hs`pascal :: Int -> [[Int]]
pascal n = undefined
`,
      tests: [
        { expr: "pascal 4", expected: "[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]]" },
        { expr: "pascal 0", expected: "[]" },
        { expr: "pascal 1", expected: "[[1]]" },
        { expr: "last (pascal 6)", expected: "[1, 5, 10, 10, 5, 1]" },
      ],
      hint: "The next row of `r` is `zipWith (+) (0 : r) (r ++ [0])`. Then `take n (iterate next [1])`.",
      solution: hs`pascal :: Int -> [[Int]]
pascal n = take n (iterate next [1])
  where
    next r = zipWith (+) (0 : r) (r ++ [0])
`,
    },
    {
      k: "write",
      body: md(
        "A polynomial \\(a_0 + a_1x + a_2x^2 + \\dots\\) is represented by its list of coefficients `[a0, a1, a2, ...]`, lowest power first. So `[1, 2, 3]` is \\(1 + 2x + 3x^2\\).",
        "",
        "Define a function `evalPoly :: [Int] -> Int -> Int` that evaluates a polynomial at a given `x`. For example:",
        "",
        "```",
        "*Main> evalPoly [1,2,3] 2",
        "17",
        "*Main> evalPoly [] 5",
        "0",
        "```",
      ),
      starter: hs`evalPoly :: [Int] -> Int -> Int
evalPoly cs x = undefined
`,
      tests: [
        { expr: "evalPoly [1, 2, 3] 2", expected: "17" },
        { expr: "evalPoly [] 5", expected: "0" },
        { expr: "evalPoly [7] 100", expected: "7" },
        { expr: "evalPoly [0, 1] 9", expected: "9" },
        { expr: "evalPoly [1, 0, 0, 2] (-1)", expected: "-1" },
      ],
      hint: "Either `sum (zipWith (*) cs (map (x ^) [0 ..]))`, or Horner's rule as a fold: `foldr (\\a acc -> a + x * acc) 0 cs`.",
      solution: hs`evalPoly :: [Int] -> Int -> Int
evalPoly cs x = foldr (\a acc -> a + x * acc) 0 cs
`,
    },
    {
      k: "write",
      body: md(
        "Polynomials are coefficient lists as in the previous question. The function `addPoly` is given: it adds two polynomials of any lengths.",
        "",
        "Define a function `mulPoly :: [Int] -> [Int] -> [Int]` that multiplies two polynomials. For example, \\((1 + x)(1 + x) = 1 + 2x + x^2\\):",
        "",
        "```",
        "*Main> mulPoly [1,1] [1,1]",
        "[1,2,1]",
        "*Main> mulPoly [1,2] [3,4]",
        "[3,10,8]",
        "*Main> mulPoly [] [1,2]",
        "[]",
        "```",
      ),
      setup: hs`addPoly :: [Int] -> [Int] -> [Int]
addPoly [] ys = ys
addPoly xs [] = xs
addPoly (x : xs) (y : ys) = (x + y) : addPoly xs ys
`,
      starter: hs`mulPoly :: [Int] -> [Int] -> [Int]
mulPoly ps qs = undefined
`,
      tests: [
        { expr: "mulPoly [1, 1] [1, 1]", expected: "[1, 2, 1]" },
        { expr: "mulPoly [1, 2] [3, 4]", expected: "[3, 10, 8]" },
        { expr: "mulPoly [] [1, 2]", expected: "[]" },
        { expr: "mulPoly [2] [1, 2, 3]", expected: "[2, 4, 6]" },
        { expr: "mulPoly [1, 0, 1] [0, 1]", expected: "[0, 1, 0, 1]" },
      ],
      hint: "Recurse on the first polynomial. \\((a + x \\cdot p)\\,q = a\\,q + x\\,(p\\,q)\\), and multiplying by \\(x\\) means putting a 0 on the front: `addPoly (map (a *) qs) (0 : mulPoly ps qs)`.",
      solution: hs`mulPoly :: [Int] -> [Int] -> [Int]
mulPoly [] _ = []
mulPoly (a : ps) qs = addPoly (map (a *) qs) (0 : mulPoly ps qs)
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Mixed exercise 2: books 1-3
// ---------------------------------------------------------------------------

const mixed02: DrillSet = {
  id: "mixed-02",
  lesson: "",
  title: "Mixed exercise 2",
  intro: md(
    "Mixed review of **Books 1-3**: lists and recursion; map, filter, folds and comprehensions; and lookup tables.",
    "",
    "Lookup tables (lists of key-value pairs) turn up in almost every January test, so they get the most space here, but you'll need the list tools from the first two books to work with them.",
    "",
    "The set gets harder as it goes. The last eight questions are in exam style and share a small stock-keeping and voting theme.",
  ),
  drills: [
    {
      k: "predict",
      expr: 'lookup 2 [(1, "one"), (2, "two")]',
      answer: 'Just "two"',
      why: "`lookup` finds the first pair whose key is 2 and wraps its value in `Just`.",
    },
    {
      k: "quiz",
      q: "`table :: [(String, Int)]`. What is the type of `lookup \"x\" table`?",
      options: ["`Int`", "`Maybe Int`", "`[Int]`", "`(String, Int)`"],
      answer: 1,
      why: "The key might not be there, so `lookup` returns `Maybe Int`: `Just v` when found and `Nothing` when not.",
    },
    {
      k: "write",
      body: "Write `priceOf item prices`, the price of `item` in the table, or `0` if the item isn't listed.",
      starter: hs`priceOf :: String -> [(String, Int)] -> Int
priceOf item prices = undefined
`,
      tests: [
        { expr: hs`priceOf "jam" [("bread", 120), ("jam", 300)]`, expected: "300" },
        { expr: hs`priceOf "tea" [("bread", 120)]`, expected: "0" },
        { expr: hs`priceOf "tea" []`, expected: "0" },
        { expr: hs`priceOf "a" [("a", 1), ("a", 2)]`, expected: "1", label: "the first match wins" },
      ],
      hint: "`case lookup item prices of` with alternatives `Nothing -> 0` and `Just p -> p`.",
      solution: hs`priceOf :: String -> [(String, Int)] -> Int
priceOf item prices
  = case lookup item prices of
      Nothing -> 0
      Just p  -> p
`,
    },
    {
      k: "write",
      body: md("Write `namesOver n table`, the names (keys) whose value is strictly greater than `n`, in table order."),
      starter: hs`namesOver :: Int -> [(String, Int)] -> [String]
namesOver n table = undefined
`,
      tests: [
        { expr: hs`namesOver 50 [("ann", 72), ("bob", 40), ("cy", 51)]`, expected: hs`["ann", "cy"]` },
        { expr: hs`namesOver 50 [("bob", 50)]`, expected: "[]", label: "exactly n doesn't count" },
        { expr: "namesOver 0 []", expected: "[]" },
        { expr: hs`namesOver (-1) [("z", 0)]`, expected: hs`["z"]` },
      ],
      hint: "A comprehension that takes each pair apart: `[name | (name, v) <- table, v > n]`.",
      solution: hs`namesOver :: Int -> [(String, Int)] -> [String]
namesOver n table = [name | (name, v) <- table, v > n]
`,
    },
    {
      k: "predict",
      expr: '[k | (k, v) <- [("a", 1), ("b", 3), ("c", 2)], v > 1]',
      answer: '["b", "c"]',
      why: "The pattern `(k, v)` takes each pair apart, and the guard keeps the pairs whose value is more than 1.",
    },
    {
      k: "write",
      body: "Write `countOf x xs`, the number of times `x` occurs in `xs`.",
      starter: hs`countOf :: Eq a => a -> [a] -> Int
countOf x xs = undefined
`,
      tests: [
        { expr: `countOf 'a' "banana"`, expected: "3" },
        { expr: "countOf 3 [1, 2]", expected: "0" },
        { expr: "countOf 1 []", expected: "0" },
        { expr: "countOf 7 [7, 7]", expected: "2" },
      ],
      hint: "`length (filter (== x) xs)`.",
      solution: hs`countOf :: Eq a => a -> [a] -> Int
countOf x xs = length (filter (== x) xs)
`,
    },
    {
      k: "write",
      body: md("Write `invert`, which swaps the two halves of every pair in a table:", "", "```", "invert [(1, 'a'), (2, 'b')]  ==  [('a', 1), ('b', 2)]", "```"),
      starter: hs`invert :: [(a, b)] -> [(b, a)]
invert table = undefined
`,
      tests: [
        { expr: "invert [(1, 'a'), (2, 'b')]", expected: "[('a', 1), ('b', 2)]" },
        { expr: "invert ([] :: [(Int, Int)])", expected: "[]" },
        { expr: hs`invert [("x", True)]`, expected: hs`[(True, "x")]` },
        { expr: "lookup 'b' (invert [(1, 'a'), (2, 'b')])", expected: "Just 2", label: "inverting lets you look up by value" },
      ],
      hint: "`[(v, k) | (k, v) <- table]`, or `map (\\(k, v) -> (v, k)) table`.",
      solution: hs`invert :: [(a, b)] -> [(b, a)]
invert table = [(v, k) | (k, v) <- table]
`,
    },
    {
      k: "predict",
      expr: "lookup 'x' [('y', 0), ('x', 1), ('x', 2)]",
      answer: "Just 1",
      why: "`lookup` walks the list from the front and stops at the first matching key, so later duplicates are ignored.",
    },
    {
      k: "write",
      body: md("Write `removeKey k table`, which removes every pair with key `k`. If the key isn't there, the table is unchanged."),
      starter: hs`removeKey :: Eq k => k -> [(k, v)] -> [(k, v)]
removeKey k table = undefined
`,
      tests: [
        { expr: "removeKey 1 [(3, 'a'), (1, 'b'), (7, 'a')]", expected: "[(3, 'a'), (7, 'a')]" },
        { expr: "removeKey 6 [(3, 'a')]", expected: "[(3, 'a')]" },
        { expr: "removeKey 6 ([] :: [(Int, Char)])", expected: "[]" },
        { expr: "removeKey 'x' [('x', 1), ('y', 2), ('x', 3)]", expected: "[('y', 2)]" },
      ],
      hint: "Keep the pairs whose key is different: `filter (\\(k', _) -> k' /= k) table`.",
      solution: hs`removeKey :: Eq k => k -> [(k, v)] -> [(k, v)]
removeKey k table = [(k', v) | (k', v) <- table, k' /= k]
`,
    },
    {
      k: "write",
      body: md(
        "Write `setValue k v table`. If `k` is already in the table, its value becomes `v` (in the same position). If not, `(k, v)` is added at the end.",
        "",
        "```",
        "setValue 'b' 9 [('a', 1), ('b', 2)]  ==  [('a', 1), ('b', 9)]",
        "setValue 'c' 9 [('a', 1)]            ==  [('a', 1), ('c', 9)]",
        "```",
      ),
      starter: hs`setValue :: Eq k => k -> v -> [(k, v)] -> [(k, v)]
setValue k v table = undefined
`,
      tests: [
        { expr: "setValue 'b' 9 [('a', 1), ('b', 2)]", expected: "[('a', 1), ('b', 9)]" },
        { expr: "setValue 'c' 9 [('a', 1)]", expected: "[('a', 1), ('c', 9)]" },
        { expr: "setValue 'a' 0 []", expected: "[('a', 0)]" },
        { expr: "setValue 'a' 5 [('a', 1), ('b', 2), ('c', 3)]", expected: "[('a', 5), ('b', 2), ('c', 3)]" },
      ],
      hint: "Recursion: on `[]` give `[(k, v)]`. On `(k', v') : rest`, if `k' == k` replace the head and keep `rest`; otherwise keep the head and recurse.",
      solution: hs`setValue :: Eq k => k -> v -> [(k, v)] -> [(k, v)]
setValue k v [] = [(k, v)]
setValue k v ((k', v') : rest)
  | k' == k   = (k, v) : rest
  | otherwise = (k', v') : setValue k v rest
`,
    },
    {
      k: "quiz",
      q: "`t :: [(String, Int)]`. Which expression is `True` exactly when the key `k` appears in `t`?",
      options: ["`elem k (map fst t)`", "`elem k t`", "`lookup k t == True`", "`k == fst t`"],
      answer: 0,
      why: "`map fst t` is the list of keys, and `elem` checks membership. `elem k t` compares a String with pairs (type error), `lookup` gives a `Maybe Int` not a Bool, and `fst` needs a single pair, not a list.",
    },
    {
      k: "write",
      body: md("Write `bestScorer`, which gives the name with the highest score in a **non-empty** table. If several share the top score, give the one that comes first."),
      starter: hs`bestScorer :: [(String, Int)] -> String
bestScorer scores = undefined
`,
      tests: [
        { expr: hs`bestScorer [("ann", 3), ("bob", 7), ("cy", 5)]`, expected: hs`"bob"` },
        { expr: hs`bestScorer [("solo", 0)]`, expected: hs`"solo"` },
        { expr: hs`bestScorer [("a", 4), ("b", 4)]`, expected: hs`"a"`, label: "ties go to the first" },
        { expr: hs`bestScorer [("a", -2), ("b", -1)]`, expected: hs`"b"` },
      ],
      hint: "Find `top = maximum (map snd scores)`, then the first name with that score: `head [n | (n, s) <- scores, s == top]`.",
      solution: hs`bestScorer :: [(String, Int)] -> String
bestScorer scores = head [n | (n, s) <- scores, s == top]
  where
    top = maximum (map snd scores)
`,
    },
    {
      k: "predict",
      expr: 'zip "abc" [1 ..]',
      answer: "[('a', 1), ('b', 2), ('c', 3)]",
      why: "`zip` stops when the shorter list runs out, so pairing with the infinite list `[1 ..]` is a safe way to number things.",
    },
    {
      k: "write",
      body: md("Write `lookupAll k table`, every value paired with `k`, in table order (not just the first)."),
      starter: hs`lookupAll :: Eq k => k -> [(k, v)] -> [v]
lookupAll k table = undefined
`,
      tests: [
        { expr: "lookupAll 'x' [('x', 1), ('y', 2), ('x', 3)]", expected: "[1, 3]" },
        { expr: "lookupAll 'z' [('x', 1)]", expected: "[]" },
        { expr: "lookupAll 1 ([] :: [(Int, Int)])", expected: "[]" },
        { expr: hs`lookupAll "k" [("k", "v")]`, expected: hs`["v"]` },
      ],
      hint: "`[v | (k', v) <- table, k' == k]`. You need a new name like `k'` in the pattern; see the next question for why.",
      solution: hs`lookupAll :: Eq k => k -> [(k, v)] -> [v]
lookupAll k table = [v | (k', v) <- table, k' == k]
`,
    },
    {
      k: "quiz",
      q: md(
        "This version always returns the value from the first pair, whatever key you ask for. Why?",
        "",
        "```",
        "lookUp :: Eq a => a -> [(a, b)] -> b",
        "lookUp k t = head [v | (k, v) <- t]",
        "```",
      ),
      options: [
        "The `k` in the pattern is a brand-new variable that hides the argument `k`, so every pair matches",
        "`head` always picks the first pair of the table",
        "Comprehensions can't use the function's arguments",
        "It doesn't: it works correctly",
      ],
      answer: 0,
      why: "A name in a pattern always introduces a new variable; it never compares with an existing one. Write `(k', v) <- t, k' == k` to compare.",
    },
    {
      k: "write",
      body: md(
        "Write `pairsSumTo n xs`: all pairs `(x, y)` where `x` comes earlier in the list than `y` and `x + y == n`. List them in the order of `x`'s position, then `y`'s.",
        "",
        "```",
        "pairsSumTo 5 [1, 2, 3, 4]  ==  [(1, 4), (2, 3)]",
        "```",
      ),
      starter: hs`pairsSumTo :: Int -> [Int] -> [(Int, Int)]
pairsSumTo n xs = undefined
`,
      tests: [
        { expr: "pairsSumTo 5 [1, 2, 3, 4]", expected: "[(1, 4), (2, 3)]" },
        { expr: "pairsSumTo 4 [2, 2, 2]", expected: "[(2, 2), (2, 2), (2, 2)]", label: "each pair of positions counts" },
        { expr: "pairsSumTo 10 [1, 2]", expected: "[]" },
        { expr: "pairsSumTo 0 []", expected: "[]" },
      ],
      hint: "Number the list with `zip [0 ..] xs` and use two generators over it, keeping `i < j`.",
      solution: hs`pairsSumTo :: Int -> [Int] -> [(Int, Int)]
pairsSumTo n xs
  = [(x, y) | (i, x) <- ixs, (j, y) <- ixs, i < j, x + y == n]
  where
    ixs = zip [0 :: Int ..] xs
`,
    },
    {
      k: "write",
      body: md(
        "Write `joinTables`, which chains two tables. For each `(a, b)` in the first table, if `b` is a key in the second table with value `c`, the result has `(a, c)`. Pairs whose `b` isn't found are dropped.",
        "",
        "```",
        'joinTables [("ann", 2), ("bob", 9)] [(2, "red")]  ==  [("ann", "red")]',
        "```",
      ),
      starter: hs`joinTables :: Eq b => [(a, b)] -> [(b, c)] -> [(a, c)]
joinTables t1 t2 = undefined
`,
      tests: [
        { expr: hs`joinTables [("ann", 2), ("bob", 9)] [(2, "red")]`, expected: hs`[("ann", "red")]` },
        { expr: "joinTables [(1, 'a'), (2, 'b')] [('b', True), ('a', False)]", expected: "[(1, False), (2, True)]" },
        { expr: "joinTables ([] :: [(Int, Int)]) [(1, 'x')]", expected: "[]" },
        { expr: "joinTables [(1, 'a')] ([] :: [(Char, Int)])", expected: "[]" },
      ],
      hint: "Two generators: `[(a, c) | (a, b) <- t1, (b', c) <- t2, b' == b]`. (This gives every match; with unique keys that's at most one.)",
      solution: hs`joinTables :: Eq b => [(a, b)] -> [(b, c)] -> [(a, c)]
joinTables t1 t2 = [(a, c) | (a, b) <- t1, (b', c) <- t2, b' == b]
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `lookUp :: Eq a => a -> [(a, b)] -> b` that looks up an item in a table. A precondition is that the item is in the table. For example:",
        "",
        "```",
        "*Main> lookUp 2 [(1,'a'),(2,'b')]",
        "'b'",
        '*Main> lookUp "y" [("x",5),("y",6)]',
        "6",
        "```",
      ),
      starter: hs`lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x table = undefined
`,
      tests: [
        { expr: "lookUp 2 [(1, 'a'), (2, 'b')]", expected: "'b'" },
        { expr: hs`lookUp "y" [("x", 5), ("y", 6)]`, expected: "6" },
        { expr: "lookUp 1 [(1, 'a'), (1, 'z')]", expected: "'a'" },
        { expr: "lookUp True [(False, 0), (True, 1)]", expected: "1" },
      ],
      hint: "`head [v | (k, v) <- table, k == x]`, or pattern match on the result of `lookup`. The precondition means you don't need to handle a missing key.",
      solution: hs`lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x table = head [v | (k, v) <- table, k == x]
`,
    },
    {
      k: "write",
      body: md(
        "A shop's stock is a table `[(String, Int)]` from item names to quantities.",
        "",
        "Define a function `toReorder :: Int -> [(String, Int)] -> [String]` that returns the items whose quantity is below the given threshold, in table order. For example:",
        "",
        "```",
        '*Main> toReorder 5 [("nails",120),("glue",3),("tape",5),("saw",0)]',
        '["glue","saw"]',
        "```",
      ),
      starter: hs`toReorder :: Int -> [(String, Int)] -> [String]
toReorder threshold stock = undefined
`,
      tests: [
        { expr: hs`toReorder 5 [("nails", 120), ("glue", 3), ("tape", 5), ("saw", 0)]`, expected: hs`["glue", "saw"]` },
        { expr: "toReorder 5 []", expected: "[]" },
        { expr: hs`toReorder 0 [("saw", 0)]`, expected: "[]" },
        { expr: hs`toReorder 100 [("a", 1), ("b", 2)]`, expected: hs`["a", "b"]` },
      ],
      hint: "`[item | (item, q) <- stock, q < threshold]`.",
      solution: hs`toReorder :: Int -> [(String, Int)] -> [String]
toReorder threshold stock = [item | (item, q) <- stock, q < threshold]
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `addStock :: String -> Int -> [(String, Int)] -> [(String, Int)]` that adds a quantity of an item to a stock table. If the item is already in the table its quantity is increased (keeping its position); otherwise the item is added at the end. For example:",
        "",
        "```",
        '*Main> addStock "glue" 10 [("nails",120),("glue",3)]',
        '[("nails",120),("glue",13)]',
        '*Main> addStock "saw" 2 [("nails",120)]',
        '[("nails",120),("saw",2)]',
        "```",
      ),
      starter: hs`addStock :: String -> Int -> [(String, Int)] -> [(String, Int)]
addStock item n stock = undefined
`,
      tests: [
        { expr: hs`addStock "glue" 10 [("nails", 120), ("glue", 3)]`, expected: hs`[("nails", 120), ("glue", 13)]` },
        { expr: hs`addStock "saw" 2 [("nails", 120)]`, expected: hs`[("nails", 120), ("saw", 2)]` },
        { expr: hs`addStock "saw" 2 []`, expected: hs`[("saw", 2)]` },
        { expr: hs`addStock "a" (-1) [("a", 5), ("b", 1)]`, expected: hs`[("a", 4), ("b", 1)]` },
      ],
      hint: "The same shape as `setValue`: walk the table; when the key matches, replace `(k, q)` with `(k, q + n)` and stop; at `[]`, add the new pair.",
      solution: hs`addStock :: String -> Int -> [(String, Int)] -> [(String, Int)]
addStock item n [] = [(item, n)]
addStock item n ((k, q) : rest)
  | k == item = (k, q + n) : rest
  | otherwise = (k, q) : addStock item n rest
`,
    },
    {
      k: "write",
      body: md(
        "A delivery is a list of `(item, quantity)` pairs. The function `addStock` from the previous question is given.",
        "",
        "Define a function `restock :: [(String, Int)] -> [(String, Int)] -> [(String, Int)]` that applies every line of a delivery (first argument) to a stock table (second argument), in order. For example:",
        "",
        "```",
        '*Main> restock [("glue",10),("saw",1),("glue",1)] [("nails",120),("glue",3)]',
        '[("nails",120),("glue",14),("saw",1)]',
        "```",
      ),
      setup: hs`addStock :: String -> Int -> [(String, Int)] -> [(String, Int)]
addStock item n [] = [(item, n)]
addStock item n ((k, q) : rest)
  | k == item = (k, q + n) : rest
  | otherwise = (k, q) : addStock item n rest
`,
      starter: hs`restock :: [(String, Int)] -> [(String, Int)] -> [(String, Int)]
restock delivery stock = undefined
`,
      tests: [
        {
          expr: hs`restock [("glue", 10), ("saw", 1), ("glue", 1)] [("nails", 120), ("glue", 3)]`,
          expected: hs`[("nails", 120), ("glue", 14), ("saw", 1)]`,
        },
        { expr: hs`restock [] [("nails", 1)]`, expected: hs`[("nails", 1)]` },
        { expr: hs`restock [("a", 1), ("b", 2)] []`, expected: hs`[("a", 1), ("b", 2)]`, label: "new items appear in delivery order" },
        { expr: hs`restock [("a", 1), ("a", 1), ("a", 1)] [("a", 0)]`, expected: hs`[("a", 3)]` },
      ],
      hint: "Thread the stock through the delivery left to right: `foldl (\\s (item, n) -> addStock item n s) stock delivery`. (A `foldr` would apply the lines in reverse order, which puts new items at the end in the wrong order.)",
      solution: hs`restock :: [(String, Int)] -> [(String, Int)] -> [(String, Int)]
restock delivery stock = foldl (\s (item, n) -> addStock item n s) stock delivery
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `tally :: Eq a => [a] -> [(a, Int)]` that counts how many times each item occurs in a list. Items appear in the result in the order of their first occurrence. For example:",
        "",
        "```",
        '*Main> tally "abcab"',
        "[('a',2),('b',2),('c',1)]",
        "*Main> tally []",
        "[]",
        "```",
      ),
      starter: hs`tally :: Eq a => [a] -> [(a, Int)]
tally xs = undefined
`,
      tests: [
        { expr: `tally "abcab"`, expected: "[('a', 2), ('b', 2), ('c', 1)]" },
        { expr: "tally ([] :: [Int])", expected: "[]" },
        { expr: "tally [3, 3, 3]", expected: "[(3, 3)]" },
        { expr: hs`tally ["no", "yes", "no", "no"]`, expected: hs`[("no", 3), ("yes", 1)]` },
      ],
      hint: "Recursion: for `x : rest`, the count of `x` is `1 + length (filter (== x) rest)`, and you carry on with `filter (/= x) rest` so `x` isn't counted twice.",
      solution: hs`tally :: Eq a => [a] -> [(a, Int)]
tally [] = []
tally (x : rest) = (x, 1 + length (filter (== x) rest)) : tally (filter (/= x) rest)
`,
    },
    {
      k: "write",
      body: md(
        "Votes are given as a list of candidate names, one per ballot. Define a function `winner :: [String] -> String` that returns the candidate with the most votes. If there is a tie, the winner is the tied candidate whose first vote came earliest. A precondition is that there is at least one vote. For example:",
        "",
        "```",
        '*Main> winner ["kim","lee","kim","max","lee"]',
        '"kim"',
        '*Main> winner ["max"]',
        '"max"',
        "```",
      ),
      starter: hs`winner :: [String] -> String
winner votes = undefined
`,
      tests: [
        { expr: hs`winner ["kim", "lee", "kim", "max", "lee"]`, expected: hs`"kim"` },
        { expr: hs`winner ["max"]`, expected: hs`"max"` },
        { expr: hs`winner ["a", "b", "b"]`, expected: hs`"b"` },
        { expr: hs`winner ["lee", "kim", "kim", "lee"]`, expected: hs`"lee"`, label: "tie: lee's first vote came first" },
      ],
      hint: "Build a tally (as in the previous question) as a helper, then pick the first entry whose count equals the maximum count.",
      solution: hs`winner :: [String] -> String
winner votes = head [c | (c, n) <- counts, n == top]
  where
    counts = tally votes
    top    = maximum (map snd counts)

    tally [] = []
    tally (x : rest) = (x, 1 + length (filter (== x) rest)) : tally (filter (/= x) rest)
`,
    },
    {
      k: "write",
      body: md(
        "A *mapping* is a table that associates each key with a list of values. Define a function `buildMap :: Eq a => [(a, b)] -> [(a, [b])]` that collects together all the values for each key. Keys appear in order of first occurrence, and each key's values stay in their original order. For example:",
        "",
        "```",
        "*Main> buildMap [(1,'a'),(2,'b'),(1,'c')]",
        '[(1,"ac"),(2,"b")]',
        "*Main> buildMap []",
        "[]",
        "```",
      ),
      starter: hs`buildMap :: Eq a => [(a, b)] -> [(a, [b])]
buildMap pairs = undefined
`,
      tests: [
        { expr: "buildMap [(1, 'a'), (2, 'b'), (1, 'c')]", expected: hs`[(1, "ac"), (2, "b")]` },
        { expr: "buildMap ([] :: [(Int, Char)])", expected: "[]" },
        { expr: hs`buildMap [("x", 1), ("x", 2), ("x", 3)]`, expected: hs`[("x", [1, 2, 3])]` },
        { expr: "buildMap [(3, True), (1, False), (2, True), (1, True)]", expected: "[(3, [True]), (1, [False, True]), (2, [True])]" },
      ],
      hint: "Take the first key `k`. Its values are `[v | (k', v) <- pairs, k' == k]`; then recurse on the pairs whose key isn't `k`.",
      solution: hs`buildMap :: Eq a => [(a, b)] -> [(a, [b])]
buildMap [] = []
buildMap pairs@((k, _) : _)
  = (k, [v | (k', v) <- pairs, k' == k]) : buildMap [p | p@(k', _) <- pairs, k' /= k]
`,
    },
    {
      k: "write",
      body: md(
        "A table of *forwarding addresses* says, for some people, who to send their post to instead. Define a function `follow :: Eq a => [(a, a)] -> a -> [a]` that returns the chain of people a letter visits, starting from the given person and following the table until it reaches someone with no forwarding entry. A precondition is that the table contains no cycles. For example:",
        "",
        "```",
        "*Main> follow [(1,2),(2,3),(5,1)] 5",
        "[5,1,2,3]",
        '*Main> follow [("al","bo")] "cy"',
        '["cy"]',
        "```",
      ),
      starter: hs`follow :: Eq a => [(a, a)] -> a -> [a]
follow table x = undefined
`,
      tests: [
        { expr: "follow [(1, 2), (2, 3), (5, 1)] 5", expected: "[5, 1, 2, 3]" },
        { expr: hs`follow [("al", "bo")] "cy"`, expected: hs`["cy"]` },
        { expr: "follow [(1, 2), (2, 3)] 3", expected: "[3]" },
        { expr: "follow ([] :: [(Int, Int)]) 4", expected: "[4]" },
        { expr: "follow [('a', 'b'), ('b', 'c'), ('c', 'd')] 'a'", expected: hs`"abcd"` },
      ],
      hint: "`x` is always in the chain. Then `case lookup x table of` with `Nothing -> [x]` and `Just y -> x : follow table y`.",
      solution: hs`follow :: Eq a => [(a, a)] -> a -> [a]
follow table x
  = case lookup x table of
      Nothing -> [x]
      Just y  -> x : follow table y
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Mixed exercise 3: books 1-4
// ---------------------------------------------------------------------------

const mixed03: DrillSet = {
  id: "mixed-03",
  lesson: "",
  title: "Mixed exercise 3",
  intro: md(
    "Mixed review of **Books 1-4**: lists and recursion; map, filter, folds and comprehensions; lookup tables; strings and parsing.",
    "",
    "A String is just a list of Char, so everything from the first three books still applies, but you'll also want `words`, `lines`, `span`, `break` and the `Data.Char` functions. Where a question needs `Data.Char`, it has already been imported for you.",
    "",
    "The set gets harder as it goes. The last eight questions are in exam style: config files, tokenising, Roman numerals and text layout.",
  ),
  drills: [
    {
      k: "predict",
      expr: 'words "  the cat  sat "',
      answer: '["the", "cat", "sat"]',
      why: "`words` splits on any run of white space and throws the spaces away, so leading, trailing and double spaces disappear.",
    },
    {
      k: "quiz",
      q: 'Which expression turns the String `"42"` into the Int `42`?',
      options: ['`read "42" :: Int`', '`show "42"`', '`digitToInt "42"`', '`ord "42"`'],
      answer: 0,
      why: "`read` parses a String into a value of the type you ask for. `show` goes the other way, and `digitToInt` and `ord` work on a single Char, not a String.",
    },
    {
      k: "write",
      body: "Write `capitalise`, which makes the first character of a String upper case and leaves the rest alone.",
      setup: hs`import Data.Char
`,
      starter: hs`capitalise :: String -> String
capitalise s = undefined
`,
      tests: [
        { expr: `capitalise "hello"`, expected: `"Hello"` },
        { expr: `capitalise "hELLO"`, expected: `"HELLO"` },
        { expr: `capitalise ""`, expected: `""` },
        { expr: `capitalise "9 lives"`, expected: `"9 lives"` },
      ],
      hint: "Two equations: `capitalise [] = []` and `capitalise (c : cs) = toUpper c : cs`.",
      solution: hs`capitalise :: String -> String
capitalise []       = []
capitalise (c : cs) = toUpper c : cs
`,
    },
    {
      k: "write",
      body: "Write `countVowels`, the number of vowels (`a e i o u`, either case) in a String.",
      setup: hs`import Data.Char
`,
      starter: hs`countVowels :: String -> Int
countVowels s = undefined
`,
      tests: [
        { expr: `countVowels "Haskell"`, expected: "2" },
        { expr: `countVowels "AEIOU"`, expected: "5" },
        { expr: `countVowels "rhythm"`, expected: "0" },
        { expr: `countVowels ""`, expected: "0" },
      ],
      hint: "`length [c | c <- s, elem (toLower c) \"aeiou\"]`.",
      solution: hs`countVowels :: String -> Int
countVowels s = length [c | c <- s, elem (toLower c) "aeiou"]
`,
    },
    {
      k: "predict",
      expr: 'map toUpper "hi!"',
      answer: '"HI!"',
      why: "A String is a list of Char, so `map` works on it. `toUpper` leaves non-letters like `!` alone.",
    },
    {
      k: "write",
      body: md(
        "Write `splitOn c s`, which cuts `s` at every occurrence of the character `c`. Empty pieces are kept:",
        "",
        "```",
        "splitOn ',' \"a,b,,c\"  ==  [\"a\", \"b\", \"\", \"c\"]",
        "splitOn ',' \"\"        ==  [\"\"]",
        "```",
      ),
      starter: hs`splitOn :: Char -> String -> [String]
splitOn c s = undefined
`,
      tests: [
        { expr: `splitOn ',' "a,b,,c"`, expected: `["a", "b", "", "c"]` },
        { expr: `splitOn ',' ""`, expected: `[""]` },
        { expr: `splitOn ';' "no separators"`, expected: `["no separators"]` },
        { expr: `splitOn '/' "/usr/bin/"`, expected: `["", "usr", "bin", ""]` },
      ],
      hint: "`break (== c) s` gives `(piece, rest)`. If `rest` is empty, the answer is `[piece]`; otherwise it's `piece : splitOn c (tail rest)`.",
      solution: hs`splitOn :: Char -> String -> [String]
splitOn c s
  = case break (== c) s of
      (piece, [])       -> [piece]
      (piece, _ : rest) -> piece : splitOn c rest
`,
    },
    {
      k: "write",
      body: md("Write `initials`, the first letter of each word of a name, in order:", "", "```", 'initials "Ada King Lovelace"  ==  "AKL"', "```"),
      starter: hs`initials :: String -> String
initials name = undefined
`,
      tests: [
        { expr: `initials "Ada King Lovelace"`, expected: `"AKL"` },
        { expr: `initials "  Alan   Turing "`, expected: `"AT"` },
        { expr: `initials ""`, expected: `""` },
        { expr: `initials "x"`, expected: `"x"` },
      ],
      hint: "`map head (words name)`. `words` never gives an empty word, so `head` is safe here.",
      solution: hs`initials :: String -> String
initials name = map head (words name)
`,
    },
    {
      k: "predict",
      expr: 'span isDigit "123abc45"',
      answer: '("123", "abc45")',
      why: "`span` takes the longest prefix that passes the test and gives the rest separately. It stops at the first `a`, so the later digits stay in the second part.",
    },
    {
      k: "write",
      body: md("Write `digitSum`, the sum of all the digit characters in a String (ignore everything else):", "", "```", 'digitSum "a1b22"  ==  5', "```"),
      setup: hs`import Data.Char
`,
      starter: hs`digitSum :: String -> Int
digitSum s = undefined
`,
      tests: [
        { expr: `digitSum "a1b22"`, expected: "5" },
        { expr: `digitSum "no digits"`, expected: "0" },
        { expr: `digitSum "999"`, expected: "27" },
        { expr: `digitSum ""`, expected: "0" },
      ],
      hint: "`sum [digitToInt c | c <- s, isDigit c]`.",
      solution: hs`digitSum :: String -> Int
digitSum s = sum [digitToInt c | c <- s, isDigit c]
`,
    },
    {
      k: "write",
      body: md(
        "A phone book line looks like `\"name:number\"`. Write `parseEntry`, which splits a line at its **first** colon into a pair (without the colon). If there's no colon, the number is `\"\"`.",
        "",
        "```",
        'parseEntry "ann:0123"  ==  ("ann", "0123")',
        "```",
      ),
      starter: hs`parseEntry :: String -> (String, String)
parseEntry line = undefined
`,
      tests: [
        { expr: `parseEntry "ann:0123"`, expected: `("ann", "0123")` },
        { expr: `parseEntry "bob:12:34"`, expected: `("bob", "12:34")`, label: "only the first colon splits" },
        { expr: `parseEntry "nobody"`, expected: `("nobody", "")` },
        { expr: `parseEntry ":999"`, expected: `("", "999")` },
      ],
      hint: "`break (== ':') line` gives `(name, rest)`, where `rest` still starts with the colon. Use `drop 1 rest` to remove it (that's also safe when `rest` is empty).",
      solution: hs`parseEntry :: String -> (String, String)
parseEntry line = (name, drop 1 rest)
  where
    (name, rest) = break (== ':') line
`,
    },
    {
      k: "predict",
      expr: 'length (show "hi")',
      answer: "4",
      why: '`show "hi"` is the String `"\\"hi\\""`: it includes the two quote characters, so it has 4 characters, not 2.',
    },
    {
      k: "write",
      body: md(
        "Write `caesar n s`, which shifts every lower-case letter `n` places forward in the alphabet, wrapping from `z` back to `a`. Other characters are unchanged. You may assume `n >= 0`.",
        "",
        "```",
        'caesar 3 "xyz abc!"  ==  "abc def!"',
        "```",
      ),
      setup: hs`import Data.Char
`,
      starter: hs`caesar :: Int -> String -> String
caesar n s = undefined
`,
      tests: [
        { expr: `caesar 3 "xyz abc!"`, expected: `"abc def!"` },
        { expr: `caesar 0 "same"`, expected: `"same"` },
        { expr: `caesar 26 "loop"`, expected: `"loop"` },
        { expr: `caesar 1 "Hal"`, expected: `"Hbm"`, label: "capitals are left alone" },
        { expr: `caesar 27 "a"`, expected: `"b"` },
      ],
      hint: "For a lower-case `c`: its position is `ord c - ord 'a'`; add `n`, take `mod 26`, and turn it back with `chr (ord 'a' + ...)`.",
      solution: hs`caesar :: Int -> String -> String
caesar n s = map shift s
  where
    shift c
      | isLower c = chr (ord 'a' + mod (ord c - ord 'a' + n) 26)
      | otherwise = c
`,
    },
    {
      k: "write",
      body: md("Write `longestWord`, the longest word in a String. If several are equally long, give the first. A precondition is that there's at least one word."),
      starter: hs`longestWord :: String -> String
longestWord s = undefined
`,
      tests: [
        { expr: `longestWord "the quick brown fox"`, expected: `"quick"` },
        { expr: `longestWord "a bb cc"`, expected: `"bb"`, label: "first of the tied words" },
        { expr: `longestWord "  solo  "`, expected: `"solo"` },
        { expr: `longestWord "x yy zzz"`, expected: `"zzz"` },
      ],
      hint: "Work out `n = maximum (map length ws)` where `ws = words s`, then take the first word with that length.",
      solution: hs`longestWord :: String -> String
longestWord s = head [w | w <- ws, length w == n]
  where
    ws = words s
    n  = maximum (map length ws)
`,
    },
    {
      k: "quiz",
      q: "What does `unwords (words s)` do to a String `s`?",
      options: [
        "Turns every run of spaces into one space and removes spaces at the ends",
        "Returns `s` exactly as it was",
        "Removes all spaces",
        "Splits `s` into a list of words",
      ],
      answer: 0,
      why: "`words` throws all the white space away, and `unwords` puts exactly one space between the words. The result is a String, not a list.",
    },
    {
      k: "write",
      body: md(
        "Write `compress`, a run-length encoder: each run of the same character becomes the character followed by the run length, except that runs of length 1 are just the character.",
        "",
        "```",
        'compress "aaabcc"  ==  "a3bc2"',
        "```",
      ),
      starter: hs`compress :: String -> String
compress s = undefined
`,
      tests: [
        { expr: `compress "aaabcc"`, expected: `"a3bc2"` },
        { expr: `compress "abc"`, expected: `"abc"` },
        { expr: `compress ""`, expected: `""` },
        { expr: `compress "zzzzzzzzzzzz"`, expected: `"z12"`, label: "counts can have two digits" },
      ],
      hint: "For `c : rest`, `span (== c) rest` splits off the rest of the run. Its length plus 1 is the count; use `show` to turn a count of 2 or more into digits.",
      solution: hs`compress :: String -> String
compress [] = []
compress (c : rest) = c : count ++ compress others
  where
    (same, others) = span (== c) rest
    n = 1 + length same
    count = if n == 1 then "" else show n
`,
    },
    {
      k: "write",
      body: md("Write `parseInts`, which reads the whole numbers in a String separated by spaces:", "", "```", 'parseInts "12 7 -3"  ==  [12, 7, -3]', "```"),
      starter: hs`parseInts :: String -> [Int]
parseInts s = undefined
`,
      tests: [
        { expr: `parseInts "12 7 -3"`, expected: "[12, 7, -3]" },
        { expr: `parseInts ""`, expected: "[]" },
        { expr: `parseInts "  5   "`, expected: "[5]" },
        { expr: `sum (parseInts "1 2 3 4")`, expected: "10" },
      ],
      hint: "`map read (words s)`. The type signature tells `read` to produce Ints.",
      solution: hs`parseInts :: String -> [Int]
parseInts s = map read (words s)
`,
    },
    {
      k: "write",
      body: md(
        "Write `isPalindrome`, which says whether a String reads the same backwards, ignoring case and ignoring every character that isn't a letter.",
        "",
        "```",
        'isPalindrome "Never odd or even."  ==  True',
        "```",
      ),
      setup: hs`import Data.Char
`,
      starter: hs`isPalindrome :: String -> Bool
isPalindrome s = undefined
`,
      tests: [
        { expr: `isPalindrome "Never odd or even."`, expected: "True" },
        { expr: `isPalindrome "Haskell"`, expected: "False" },
        { expr: `isPalindrome ""`, expected: "True" },
        { expr: `isPalindrome "A man, a plan, a canal: Panama!"`, expected: "True" },
        { expr: `isPalindrome "ab"`, expected: "False" },
      ],
      hint: "Clean first: `cleaned = [toLower c | c <- s, isAlpha c]`. Then compare `cleaned` with `reverse cleaned`.",
      solution: hs`isPalindrome :: String -> Bool
isPalindrome s = cleaned == reverse cleaned
  where
    cleaned = [toLower c | c <- s, isAlpha c]
`,
    },
    {
      k: "write",
      body: md(
        "A configuration file has one setting per line, written `key=value`. Blank lines (containing only spaces, or nothing) are ignored. A precondition is that every other line contains an `=`.",
        "",
        "Define a function `parseConfig :: String -> [(String, String)]` that turns the contents of a file into a table. For example:",
        "",
        "```",
        '*Main> parseConfig "size=12\\n\\ncolour=red\\n"',
        '[("size","12"),("colour","red")]',
        "```",
      ),
      starter: hs`parseConfig :: String -> [(String, String)]
parseConfig contents = undefined
`,
      tests: [
        { expr: hs`parseConfig "size=12\n\ncolour=red\n"`, expected: hs`[("size", "12"), ("colour", "red")]` },
        { expr: hs`parseConfig ""`, expected: "[]" },
        { expr: hs`parseConfig "a=1=2"`, expected: hs`[("a", "1=2")]`, label: "split at the first =" },
        { expr: hs`parseConfig "   \nx=\n"`, expected: hs`[("x", "")]` },
      ],
      hint: "`lines contents`, drop the lines where `words line` is empty, and split each remaining line with `break (== '=')`, dropping the `=` itself.",
      solution: hs`parseConfig :: String -> [(String, String)]
parseConfig contents = [entry l | l <- lines contents, not (null (words l))]
  where
    entry l = let (k, rest) = break (== '=') l in (k, drop 1 rest)
`,
    },
    {
      k: "write",
      body: md(
        "The function `parseConfig` from the previous question is given. Define a function `setting :: String -> String -> String` that takes a key and the contents of a config file, and returns that key's value, or `\"default\"` if the key isn't set. If a key is set more than once, the **last** setting wins. For example:",
        "",
        "```",
        '*Main> setting "colour" "colour=red\\nsize=1\\ncolour=blue"',
        '"blue"',
        '*Main> setting "font" "size=1"',
        '"default"',
        "```",
      ),
      setup: hs`parseConfig :: String -> [(String, String)]
parseConfig contents = [entry l | l <- lines contents, not (null (words l))]
  where
    entry l = let (k, rest) = break (== '=') l in (k, drop 1 rest)
`,
      starter: hs`setting :: String -> String -> String
setting key contents = undefined
`,
      tests: [
        { expr: hs`setting "colour" "colour=red\nsize=1\ncolour=blue"`, expected: hs`"blue"` },
        { expr: hs`setting "font" "size=1"`, expected: hs`"default"` },
        { expr: hs`setting "size" "size=1"`, expected: hs`"1"` },
        { expr: hs`setting "a" ""`, expected: hs`"default"` },
      ],
      hint: "Look the key up in the *reversed* table, so the last setting is found first: `case lookup key (reverse (parseConfig contents)) of ...`.",
      solution: hs`setting :: String -> String -> String
setting key contents
  = case lookup key (reverse (parseConfig contents)) of
      Nothing -> "default"
      Just v  -> v
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `tokenise :: String -> [String]` that splits an arithmetic expression into tokens. A token is either a maximal run of digits, or any single other character that isn't a space. Spaces are discarded. For example:",
        "",
        "```",
        '*Main> tokenise "12+(3 * 45)"',
        '["12","+","(","3","*","45",")"]',
        "```",
      ),
      setup: hs`import Data.Char
`,
      starter: hs`tokenise :: String -> [String]
tokenise s = undefined
`,
      tests: [
        { expr: `tokenise "12+(3 * 45)"`, expected: `["12", "+", "(", "3", "*", "45", ")"]` },
        { expr: `tokenise ""`, expected: "[]" },
        { expr: `tokenise "   "`, expected: "[]" },
        { expr: `tokenise "7"`, expected: `["7"]` },
        { expr: `tokenise "1 2"`, expected: `["1", "2"]`, label: "a space separates two numbers" },
      ],
      hint: "Three cases on `c : cs`: a space is skipped; a digit starts a number, so use `span isDigit (c : cs)`; anything else is the token `[c]`.",
      solution: hs`tokenise :: String -> [String]
tokenise [] = []
tokenise (c : cs)
  | isSpace c = tokenise cs
  | isDigit c = let (num, rest) = span isDigit (c : cs) in num : tokenise rest
  | otherwise = [c] : tokenise cs
`,
    },
    {
      k: "write",
      body: md(
        "Roman numerals use `I=1, V=5, X=10, L=50, C=100, D=500, M=1000`. Normally the values are added, but a symbol written before a larger symbol is subtracted, so `IV` is 4 and `XC` is 90.",
        "",
        "Define a function `fromRoman :: String -> Int` that converts a valid numeral to a number. For example:",
        "",
        "```",
        '*Main> fromRoman "XIV"',
        "14",
        '*Main> fromRoman "MCMXCIX"',
        "1999",
        "```",
      ),
      starter: hs`fromRoman :: String -> Int
fromRoman s = undefined
`,
      tests: [
        { expr: `fromRoman "XIV"`, expected: "14" },
        { expr: `fromRoman "MCMXCIX"`, expected: "1999" },
        { expr: `fromRoman "III"`, expected: "3" },
        { expr: `fromRoman "IX"`, expected: "9" },
        { expr: `fromRoman ""`, expected: "0" },
      ],
      hint: "Turn the String into values first with a lookup table. Then recurse over the list of values: if `a < b` for the first two, subtract `a`; otherwise add it.",
      solution: hs`fromRoman :: String -> Int
fromRoman s = total (map value s)
  where
    value c = head [v | (r, v) <- table, r == c]
    table = [('I', 1), ('V', 5), ('X', 10), ('L', 50), ('C', 100), ('D', 500), ('M', 1000)]
    total (a : b : rest)
      | a < b     = total (b : rest) - a
      | otherwise = a + total (b : rest)
    total xs = sum xs
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `toRoman :: Int -> String` that converts a number between 1 and 3999 to a Roman numeral (see the previous question). Use the subtractive forms `CM, CD, XC, XL, IX, IV`. For example:",
        "",
        "```",
        "*Main> toRoman 14",
        '"XIV"',
        "*Main> toRoman 1999",
        '"MCMXCIX"',
        "```",
      ),
      starter: hs`toRoman :: Int -> String
toRoman n = undefined
`,
      tests: [
        { expr: "toRoman 14", expected: `"XIV"` },
        { expr: "toRoman 1999", expected: `"MCMXCIX"` },
        { expr: "toRoman 4", expected: `"IV"` },
        { expr: "toRoman 3888", expected: `"MMMDCCCLXXXVIII"` },
        { expr: "toRoman 1", expected: `"I"` },
      ],
      hint: "Use a table from largest to smallest, including the two-letter forms: `[(1000, \"M\"), (900, \"CM\"), (500, \"D\"), (400, \"CD\"), ...]`. Find the first entry whose value is at most `n`, output its letters and recurse on `n - value`.",
      solution: hs`toRoman :: Int -> String
toRoman 0 = ""
toRoman n = letters ++ toRoman (n - v)
  where
    (v, letters) = head [p | p@(x, _) <- table, x <= n]
    table = [ (1000, "M"), (900, "CM"), (500, "D"), (400, "CD"), (100, "C"), (90, "XC")
            , (50, "L"), (40, "XL"), (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I") ]
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `wrap :: Int -> String -> [String]` that lays text out in lines of at most `w` characters. Words are separated by single spaces within a line and are never split; take as many words as fit on each line before starting the next. A word longer than `w` goes on a line by itself. For example:",
        "",
        "```",
        '*Main> wrap 10 "the quick brown fox jumps"',
        '["the quick","brown fox","jumps"]',
        '*Main> wrap 3 "a extraordinary b"',
        '["a","extraordinary","b"]',
        "```",
      ),
      starter: hs`wrap :: Int -> String -> [String]
wrap w text = undefined
`,
      tests: [
        { expr: `wrap 10 "the quick brown fox jumps"`, expected: `["the quick", "brown fox", "jumps"]` },
        { expr: `wrap 3 "a extraordinary b"`, expected: `["a", "extraordinary", "b"]` },
        { expr: `wrap 5 ""`, expected: "[]" },
        { expr: `wrap 7 "aa bb cc dd"`, expected: `["aa bb", "cc dd"]` },
        { expr: `wrap 5 "aa bb cc"`, expected: `["aa bb", "cc"]`, label: "a line of exactly w characters is allowed" },
      ],
      hint: "Work on `words text`. A helper `go line ws` keeps the current line: if `length line + 1 + length w'` fits, append the word; otherwise emit `line` and start a new line with the word.",
      solution: hs`wrap :: Int -> String -> [String]
wrap w text
  = case words text of
      []       -> []
      (x : xs) -> go x xs
  where
    go line [] = [line]
    go line (x : xs)
      | length line + 1 + length x <= w = go (line ++ " " ++ x) xs
      | otherwise                       = line : go x xs
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `formatTable :: [(String, Int)] -> String` that lays out a table in two columns. Each name is padded on the right with spaces so that every number starts in the same column, one space after the longest name. Each row ends with a newline. For example:",
        "",
        "```",
        '*Main> formatTable [("ann",3),("bobby",12),("cy",7)]',
        '"ann   3\\nbobby 12\\ncy    7\\n"',
        '*Main> putStr (formatTable [("ann",3),("bobby",12),("cy",7)])',
        "ann   3",
        "bobby 12",
        "cy    7",
        "```",
      ),
      starter: hs`formatTable :: [(String, Int)] -> String
formatTable rows = undefined
`,
      tests: [
        { expr: hs`formatTable [("ann", 3), ("bobby", 12), ("cy", 7)]`, expected: hs`"ann   3\nbobby 12\ncy    7\n"` },
        { expr: "formatTable []", expected: `""` },
        { expr: hs`formatTable [("x", 0)]`, expected: hs`"x 0\n"` },
        { expr: hs`formatTable [("ab", 1), ("cd", 22)]`, expected: hs`"ab 1\ncd 22\n"` },
      ],
      hint: "Find `width = maximum (map (length . fst) rows)`. Each row is `name ++ replicate (width - length name + 1) ' ' ++ show n`. Join with `unlines`. Watch out: `maximum []` crashes, so handle the empty table first.",
      solution: hs`formatTable :: [(String, Int)] -> String
formatTable [] = ""
formatTable rows = unlines [pad name ++ show n | (name, n) <- rows]
  where
    width = maximum [length name | (name, _) <- rows]
    pad name = name ++ replicate (width - length name + 1) ' '
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `expand :: String -> String` that undoes run-length encoding: each letter may be followed by a count (one or more digits) saying how many times to repeat it; a letter with no count appears once. For example:",
        "",
        "```",
        '*Main> expand "a3bc2"',
        '"aaabcc"',
        '*Main> expand "x12"',
        '"xxxxxxxxxxxx"',
        "```",
      ),
      setup: hs`import Data.Char
`,
      starter: hs`expand :: String -> String
expand s = undefined
`,
      tests: [
        { expr: `expand "a3bc2"`, expected: `"aaabcc"` },
        { expr: `expand "x12"`, expected: `"xxxxxxxxxxxx"` },
        { expr: `expand ""`, expected: `""` },
        { expr: `expand "abc"`, expected: `"abc"` },
        { expr: `expand "a10b"`, expected: `"aaaaaaaaaab"` },
      ],
      hint: "For `c : rest`, `span isDigit rest` gives `(digits, others)`. The count is 1 if `digits` is empty, otherwise `read digits`.",
      solution: hs`expand :: String -> String
expand [] = []
expand (c : rest) = replicate n c ++ expand others
  where
    (digits, others) = span isDigit rest
    n = if null digits then 1 else read digits
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Mixed exercise 4: books 1-5
// ---------------------------------------------------------------------------

const treeSetup = hs`data Tree = Leaf | Node Tree Int Tree
  deriving (Eq, Show)

sample :: Tree
sample = Node (Node (Node Leaf 1 Leaf) 3 Leaf) 5 (Node Leaf 8 (Node Leaf 9 Leaf))
`;

const treeShown = [
  "```",
  "data Tree = Leaf | Node Tree Int Tree",
  "  deriving (Eq, Show)",
  "",
  "sample :: Tree",
  "sample = Node (Node (Node Leaf 1 Leaf) 3 Leaf) 5 (Node Leaf 8 (Node Leaf 9 Leaf))",
  "```",
];

const exprSetup = hs`import Data.List (nub)

data Op = Plus | Minus | Times
  deriving (Eq, Show)

data Expr = Val Int | Var String | BinOp Op Expr Expr
  deriving (Eq, Show)

type Env = [(String, Int)]

e1 :: Expr
e1 = BinOp Plus (Var "x") (BinOp Times (Val 3) (Var "y"))
`;

const exprShown = [
  "```",
  "data Op = Plus | Minus | Times",
  "  deriving (Eq, Show)",
  "",
  "data Expr = Val Int | Var String | BinOp Op Expr Expr",
  "  deriving (Eq, Show)",
  "",
  "type Env = [(String, Int)]",
  "",
  "e1 :: Expr",
  'e1 = BinOp Plus (Var "x") (BinOp Times (Val 3) (Var "y"))    -- x + 3 * y',
  "```",
];

const petsSetup = hs`data DTree = Answer String | Question String DTree DTree
  deriving (Eq, Show)

pets :: DTree
pets = Question "Do you have a garden?"
         (Question "Are you out all day?" (Answer "cat") (Answer "dog"))
         (Question "Do you like reptiles?" (Answer "gecko") (Answer "fish"))
`;

const petsShown = [
  "```",
  "data DTree = Answer String | Question String DTree DTree",
  "  deriving (Eq, Show)",
  "",
  "pets :: DTree",
  'pets = Question "Do you have a garden?"',
  '         (Question "Are you out all day?" (Answer "cat") (Answer "dog"))',
  '         (Question "Do you like reptiles?" (Answer "gecko") (Answer "fish"))',
  "```",
];

const mixed04: DrillSet = {
  id: "mixed-04",
  lesson: "",
  title: "Mixed exercise 4",
  intro: md(
    "Mixed review of **Books 1-5**: lists, the list toolkit, lookup tables, strings and parsing, and now your own data types with tree recursion.",
    "",
    "Most January tests define a data type or two in the spec and ask you to write functions over them, so this set leans on that. Each question shows any type definitions it uses; they're already in the file for you.",
    "",
    "The set gets harder as it goes. The last eight questions are in exam style: an expression language with variables, a yes/no decision tree, and a binary search tree check.",
  ),
  drills: [
    {
      k: "quiz",
      q: md("Given this type, what is the type of `Rect`?", "", "```", "data Shape = Circle Double | Rect Double Double", "```"),
      options: ["`Double -> Double -> Shape`", "`Shape`", "`(Double, Double) -> Shape`", "`Double -> Shape`"],
      answer: 0,
      why: "A constructor with fields is a function from its fields to the type. `Rect` takes two Doubles (one at a time, not as a pair) and builds a Shape.",
    },
    {
      k: "predict",
      expr: 'either length negate (Left "abc")',
      answer: "3",
      why: "`either f g` applies `f` to a `Left` value and `g` to a `Right` value. Here it's a `Left`, so the answer is `length \"abc\"`.",
    },
    {
      k: "write",
      body: md(
        "Using this type, write `area`:",
        "",
        "```",
        "data Shape = Circle Double | Rect Double Double",
        "  deriving (Eq, Show)",
        "```",
        "",
        "A `Circle r` has area \\(\\pi r^2\\) (use `pi`); a `Rect w h` has area \\(w \\times h\\).",
      ),
      setup: hs`data Shape = Circle Double | Rect Double Double
  deriving (Eq, Show)
`,
      starter: hs`area :: Shape -> Double
area s = undefined
`,
      tests: [
        { expr: "area (Rect 3 4)", expected: "12.0" },
        { expr: "area (Circle 1) == pi", expected: "True" },
        { expr: "area (Circle 2) == 4 * pi", expected: "True" },
        { expr: "sum (map area [Rect 1 1, Rect 2 0.5])", expected: "2.0" },
      ],
      hint: "One equation per constructor: `area (Circle r) = pi * r * r` and `area (Rect w h) = w * h`.",
      solution: hs`area :: Shape -> Double
area (Circle r) = pi * r * r
area (Rect w h) = w * h
`,
    },
    {
      k: "write",
      body: md("Questions 4-8 use this binary tree:", "", ...treeShown, "", "Write `sumTree`, the sum of all the numbers in a tree."),
      setup: treeSetup,
      starter: hs`sumTree :: Tree -> Int
sumTree t = undefined
`,
      tests: [
        { expr: "sumTree sample", expected: "26" },
        { expr: "sumTree Leaf", expected: "0" },
        { expr: "sumTree (Node Leaf 7 Leaf)", expected: "7" },
        { expr: "sumTree (Node (Node Leaf (-2) Leaf) 1 Leaf)", expected: "-1" },
      ],
      hint: "`sumTree Leaf = 0` and `sumTree (Node l x r) = sumTree l + x + sumTree r`.",
      solution: hs`sumTree :: Tree -> Int
sumTree Leaf         = 0
sumTree (Node l x r) = sumTree l + x + sumTree r
`,
    },
    {
      k: "write",
      body: md("Using the same `Tree` type, write `depth`: the number of nodes on the longest path from the root down. A `Leaf` has depth 0.", "", ...treeShown),
      setup: treeSetup,
      starter: hs`depth :: Tree -> Int
depth t = undefined
`,
      tests: [
        { expr: "depth sample", expected: "3" },
        { expr: "depth Leaf", expected: "0" },
        { expr: "depth (Node Leaf 1 Leaf)", expected: "1" },
        { expr: "depth (Node Leaf 1 (Node Leaf 2 (Node Leaf 3 (Node Leaf 4 Leaf))))", expected: "4" },
      ],
      hint: "A node adds 1 to the deeper of its two subtrees: `1 + max (depth l) (depth r)`.",
      solution: hs`depth :: Tree -> Int
depth Leaf         = 0
depth (Node l _ r) = 1 + max (depth l) (depth r)
`,
    },
    {
      k: "predict",
      expr: "compare 3 5",
      answer: "LT",
      why: "`compare` returns an `Ordering`, which is just a data type with three constructors: `LT`, `EQ` and `GT`. 3 is less than 5.",
    },
    {
      k: "write",
      body: md("Using the same `Tree` type, write `flatten`, which lists the numbers in order: everything in the left subtree, then the node, then everything in the right subtree.", "", ...treeShown),
      setup: treeSetup,
      starter: hs`flatten :: Tree -> [Int]
flatten t = undefined
`,
      tests: [
        { expr: "flatten sample", expected: "[1, 3, 5, 8, 9]" },
        { expr: "flatten Leaf", expected: "[]" },
        { expr: "flatten (Node (Node Leaf 2 Leaf) 1 Leaf)", expected: "[2, 1]" },
        { expr: "length (flatten sample)", expected: "5" },
      ],
      hint: "`flatten (Node l x r) = flatten l ++ [x] ++ flatten r`.",
      solution: hs`flatten :: Tree -> [Int]
flatten Leaf         = []
flatten (Node l x r) = flatten l ++ [x] ++ flatten r
`,
    },
    {
      k: "write",
      body: md(
        "`sample` is a *binary search tree*: everything in a left subtree is smaller than the node and everything in a right subtree is bigger.",
        "",
        "Write `insertT x t`, which inserts `x` in the right place, keeping the search-tree property. If `x` is already in the tree, return the tree unchanged.",
        "",
        ...treeShown,
      ),
      setup: treeSetup,
      starter: hs`insertT :: Int -> Tree -> Tree
insertT x t = undefined
`,
      tests: [
        { expr: "insertT 4 Leaf", expected: "Node Leaf 4 Leaf" },
        { expr: "insertT 2 (Node Leaf 5 Leaf)", expected: "Node (Node Leaf 2 Leaf) 5 Leaf" },
        { expr: "insertT 4 sample", expected: "Node (Node (Node Leaf 1 Leaf) 3 (Node Leaf 4 Leaf)) 5 (Node Leaf 8 (Node Leaf 9 Leaf))" },
        { expr: "insertT 8 sample", expected: "sample", label: "duplicates leave the tree alone" },
      ],
      hint: "Compare `x` with the node's value `y`: smaller goes left (`Node (insertT x l) y r`), bigger goes right, equal returns the node as it is. A `Leaf` becomes `Node Leaf x Leaf`.",
      solution: hs`insertT :: Int -> Tree -> Tree
insertT x Leaf = Node Leaf x Leaf
insertT x t@(Node l y r)
  | x < y     = Node (insertT x l) y r
  | x > y     = Node l y (insertT x r)
  | otherwise = t
`,
    },
    {
      k: "quiz",
      q: "A test checks `mirror t == expected`, where `t :: Tree`. What must the declaration of `Tree` include for this to compile?",
      options: ["`deriving Eq`", "`deriving Show`", "`deriving Ord`", "Nothing extra: every type supports `==`"],
      answer: 0,
      why: "`==` needs an `Eq` instance, and `deriving Eq` writes one for you (constructor by constructor, field by field). `Show` is needed to *print* values, for example in GHCi.",
    },
    {
      k: "write",
      body: md("Using the same `Tree` type, write `mirror`, which swaps the left and right subtrees at every node.", "", ...treeShown),
      setup: treeSetup,
      starter: hs`mirror :: Tree -> Tree
mirror t = undefined
`,
      tests: [
        { expr: "mirror sample", expected: "Node (Node (Node Leaf 9 Leaf) 8 Leaf) 5 (Node Leaf 3 (Node Leaf 1 Leaf))" },
        { expr: "mirror Leaf", expected: "Leaf" },
        { expr: "mirror (mirror sample)", expected: "sample" },
        { expr: "mirror (Node (Node Leaf 1 Leaf) 2 Leaf)", expected: "Node Leaf 2 (Node Leaf 1 Leaf)" },
      ],
      hint: "`mirror (Node l x r) = Node (mirror r) x (mirror l)`.",
      solution: hs`mirror :: Tree -> Tree
mirror Leaf         = Leaf
mirror (Node l x r) = Node (mirror r) x (mirror l)
`,
    },
    {
      k: "write",
      body: md(
        "Traffic lights cycle Red, then RedAmber, then Green, then Amber, then back to Red.",
        "",
        "```",
        "data Light = Red | RedAmber | Green | Amber",
        "  deriving (Eq, Show)",
        "```",
        "",
        "Write `after n l`, the light showing `n` steps after `l`. You may assume `n >= 0`.",
      ),
      setup: hs`data Light = Red | RedAmber | Green | Amber
  deriving (Eq, Show)
`,
      starter: hs`after :: Int -> Light -> Light
after n l = undefined
`,
      tests: [
        { expr: "after 1 Red", expected: "RedAmber" },
        { expr: "after 0 Green", expected: "Green" },
        { expr: "after 2 Amber", expected: "RedAmber" },
        { expr: "after 401 Green", expected: "Amber", label: "big n must be fast enough" },
      ],
      hint: "Write a one-step helper `next` with four equations. Then apply it `mod n 4` times, e.g. `iterate next l !! mod n 4`.",
      solution: hs`after :: Int -> Light -> Light
after n l = iterate next l !! mod n 4
  where
    next Red      = RedAmber
    next RedAmber = Green
    next Green    = Amber
    next Amber    = Red
`,
    },
    {
      k: "predict",
      expr: "[minBound .. maxBound :: Bool]",
      answer: "[False, True]",
      why: "`Bool` is declared as `data Bool = False | True` with `deriving (Enum, Bounded)`, so you can list all its values in declaration order.",
    },
    {
      k: "write",
      body: md(
        "Arithmetic expressions:",
        "",
        "```",
        "data Arith = Num Int | Add Arith Arith | Mul Arith Arith",
        "  deriving (Eq, Show)",
        "```",
        "",
        "Write `evalA`, which works out the value of an expression.",
      ),
      setup: hs`data Arith = Num Int | Add Arith Arith | Mul Arith Arith
  deriving (Eq, Show)
`,
      starter: hs`evalA :: Arith -> Int
evalA e = undefined
`,
      tests: [
        { expr: "evalA (Num 7)", expected: "7" },
        { expr: "evalA (Add (Num 1) (Mul (Num 2) (Num 3)))", expected: "7" },
        { expr: "evalA (Mul (Add (Num 1) (Num 2)) (Num 3))", expected: "9" },
        { expr: "evalA (Mul (Num 0) (Add (Num 5) (Num (-5))))", expected: "0" },
      ],
      hint: "One equation per constructor; the `Add` and `Mul` equations call `evalA` on both sub-expressions.",
      solution: hs`evalA :: Arith -> Int
evalA (Num n)   = n
evalA (Add a b) = evalA a + evalA b
evalA (Mul a b) = evalA a * evalA b
`,
    },
    {
      k: "write",
      body: md(
        "Using the `Arith` type from the previous question, write `showA`, which displays an expression with every `Add` and `Mul` in brackets and no spaces:",
        "",
        "```",
        'showA (Add (Num 1) (Mul (Num 2) (Num 3)))  ==  "(1+(2*3))"',
        "```",
      ),
      setup: hs`data Arith = Num Int | Add Arith Arith | Mul Arith Arith
  deriving (Eq, Show)
`,
      starter: hs`showA :: Arith -> String
showA e = undefined
`,
      tests: [
        { expr: "showA (Add (Num 1) (Mul (Num 2) (Num 3)))", expected: `"(1+(2*3))"` },
        { expr: "showA (Num 42)", expected: `"42"` },
        { expr: "showA (Mul (Add (Num 1) (Num 2)) (Num 3))", expected: `"((1+2)*3)"` },
        { expr: "showA (Num (-1))", expected: `"-1"` },
      ],
      hint: "`showA (Num n) = show n` and `showA (Add a b) = \"(\" ++ showA a ++ \"+\" ++ showA b ++ \")\"`.",
      solution: hs`showA :: Arith -> String
showA (Num n)   = show n
showA (Add a b) = "(" ++ showA a ++ "+" ++ showA b ++ ")"
showA (Mul a b) = "(" ++ showA a ++ "*" ++ showA b ++ ")"
`,
    },
    {
      k: "quiz",
      q: md(
        "`insertT` puts a number into a binary search tree. Which number ends up at the **root** of this tree?",
        "",
        "```",
        "foldr insertT Leaf [3, 1, 2]",
        "```",
      ),
      options: ["2", "3", "1", "It depends on the order of the equations in `insertT`"],
      answer: 0,
      why: "`foldr` works from the right: it's `insertT 3 (insertT 1 (insertT 2 Leaf))`. So 2 is inserted first, into the empty tree, and stays at the root.",
    },
    {
      k: "write",
      body: md(
        "Using the `Tree` type and `insertT` (given), write `fromList`, which builds a search tree by inserting the numbers **from left to right**, so the first number becomes the root.",
        "",
        ...treeShown,
      ),
      setup: treeSetup + hs`
insertT :: Int -> Tree -> Tree
insertT x Leaf = Node Leaf x Leaf
insertT x t@(Node l y r)
  | x < y     = Node (insertT x l) y r
  | x > y     = Node l y (insertT x r)
  | otherwise = t
`,
      starter: hs`fromList :: [Int] -> Tree
fromList xs = undefined
`,
      tests: [
        { expr: "fromList [3, 1, 2]", expected: "Node (Node Leaf 1 (Node Leaf 2 Leaf)) 3 Leaf" },
        { expr: "fromList []", expected: "Leaf" },
        { expr: "fromList [5, 3, 8, 1, 9]", expected: "sample" },
        { expr: "fromList [1, 1, 1]", expected: "Node Leaf 1 Leaf" },
      ],
      hint: "Left to right means `foldl`: `foldl (\\t x -> insertT x t) Leaf xs`. (`foldr insertT Leaf` would insert the last number first.)",
      solution: hs`fromList :: [Int] -> Tree
fromList xs = foldl (\t x -> insertT x t) Leaf xs
`,
    },
    {
      k: "write",
      body: md(
        "Using the same `Tree` type, write `atLevel n t`, the numbers at depth `n` (the root is at level 0), from left to right.",
        "",
        ...treeShown,
      ),
      setup: treeSetup,
      starter: hs`atLevel :: Int -> Tree -> [Int]
atLevel n t = undefined
`,
      tests: [
        { expr: "atLevel 0 sample", expected: "[5]" },
        { expr: "atLevel 1 sample", expected: "[3, 8]" },
        { expr: "atLevel 2 sample", expected: "[1, 9]" },
        { expr: "atLevel 7 sample", expected: "[]" },
        { expr: "atLevel 0 Leaf", expected: "[]" },
      ],
      hint: "A `Leaf` has nothing at any level. At a node, level 0 is `[x]`; otherwise collect level `n - 1` of both subtrees.",
      solution: hs`atLevel :: Int -> Tree -> [Int]
atLevel _ Leaf = []
atLevel 0 (Node _ x _) = [x]
atLevel n (Node l _ r) = atLevel (n - 1) l ++ atLevel (n - 1) r
`,
    },
    {
      k: "write",
      body: md(
        "Questions 18-21 use this representation of expressions with variables. An environment `Env` gives each variable a value.",
        "",
        ...exprShown,
        "",
        "Define a function `evalE :: Env -> Expr -> Int` that evaluates an expression in a given environment. A precondition is that every variable in the expression has a value in the environment. For example:",
        "",
        "```",
        '*Main> evalE [("x",2),("y",5)] e1',
        "17",
        "*Main> evalE [] (BinOp Minus (Val 1) (Val 4))",
        "-3",
        "```",
      ),
      setup: exprSetup,
      starter: hs`evalE :: Env -> Expr -> Int
evalE env e = undefined
`,
      tests: [
        { expr: hs`evalE [("x", 2), ("y", 5)] e1`, expected: "17" },
        { expr: "evalE [] (BinOp Minus (Val 1) (Val 4))", expected: "-3" },
        { expr: hs`evalE [("x", 0), ("y", 1)] e1`, expected: "3" },
        { expr: hs`evalE [("a", 7), ("a", 9)] (Var "a")`, expected: "7" },
      ],
      hint: "`Var v` looks `v` up in `env`. For `BinOp op a b`, evaluate both sides and combine them with a helper `apply :: Op -> Int -> Int -> Int`.",
      solution: hs`evalE :: Env -> Expr -> Int
evalE _ (Val n) = n
evalE env (Var v) = head [x | (w, x) <- env, w == v]
evalE env (BinOp op a b) = apply op (evalE env a) (evalE env b)
  where
    apply Plus  = (+)
    apply Minus = (-)
    apply Times = (*)
`,
    },
    {
      k: "write",
      body: md(
        ...exprShown,
        "",
        "Define a function `vars :: Expr -> [String]` that returns the names of the variables in an expression, each listed once, in the order they first appear reading left to right. (`nub` from `Data.List` is imported.) For example:",
        "",
        "```",
        "*Main> vars e1",
        '["x","y"]',
        '*Main> vars (BinOp Times (Var "y") (BinOp Plus (Var "x") (Var "y")))',
        '["y","x"]',
        "```",
      ),
      setup: exprSetup,
      starter: hs`vars :: Expr -> [String]
vars e = undefined
`,
      tests: [
        { expr: "vars e1", expected: hs`["x", "y"]` },
        { expr: hs`vars (BinOp Times (Var "y") (BinOp Plus (Var "x") (Var "y")))`, expected: hs`["y", "x"]` },
        { expr: "vars (Val 3)", expected: "[]" },
        { expr: hs`vars (BinOp Minus (Var "z") (Var "z"))`, expected: hs`["z"]` },
      ],
      hint: "Collect every variable with a recursive helper (duplicates and all), then `nub` the result.",
      solution: hs`vars :: Expr -> [String]
vars e = nub (go e)
  where
    go (Val _)        = []
    go (Var v)        = [v]
    go (BinOp _ a b)  = go a ++ go b
`,
    },
    {
      k: "write",
      body: md(
        ...exprShown,
        "",
        "Define a function `countOps :: Op -> Expr -> Int` that counts how many times a given operator is used in an expression. For example:",
        "",
        "```",
        "*Main> countOps Times e1",
        "1",
        "*Main> countOps Minus e1",
        "0",
        "```",
      ),
      setup: exprSetup,
      starter: hs`countOps :: Op -> Expr -> Int
countOps op e = undefined
`,
      tests: [
        { expr: "countOps Times e1", expected: "1" },
        { expr: "countOps Minus e1", expected: "0" },
        { expr: "countOps Plus (BinOp Plus e1 (BinOp Plus (Val 1) (Val 2)))", expected: "3" },
        { expr: hs`countOps Plus (Var "q")`, expected: "0" },
      ],
      hint: "At a `BinOp op' a b`, count 1 if `op' == op` (else 0), plus the counts for `a` and `b`. Values and variables count 0.",
      solution: hs`countOps :: Op -> Expr -> Int
countOps op (BinOp op' a b) = (if op' == op then 1 else 0) + countOps op a + countOps op b
countOps _ _ = 0
`,
    },
    {
      k: "write",
      body: md(
        ...exprShown,
        "",
        "Define a function `substitute :: String -> Expr -> Expr -> Expr` such that `substitute v new e` replaces every occurrence of the variable `v` in `e` by the expression `new`. For example:",
        "",
        "```",
        '*Main> substitute "y" (Val 4) e1',
        'BinOp Plus (Var "x") (BinOp Times (Val 3) (Val 4))',
        '*Main> substitute "z" (Val 4) e1 == e1',
        "True",
        "```",
      ),
      setup: exprSetup,
      starter: hs`substitute :: String -> Expr -> Expr -> Expr
substitute v new e = undefined
`,
      tests: [
        { expr: hs`substitute "y" (Val 4) e1`, expected: hs`BinOp Plus (Var "x") (BinOp Times (Val 3) (Val 4))` },
        { expr: hs`substitute "z" (Val 4) e1`, expected: "e1" },
        { expr: hs`substitute "x" (Var "y") e1`, expected: hs`BinOp Plus (Var "y") (BinOp Times (Val 3) (Var "y"))` },
        { expr: hs`substitute "a" (BinOp Plus (Val 1) (Val 1)) (BinOp Times (Var "a") (Var "a"))`, expected: hs`BinOp Times (BinOp Plus (Val 1) (Val 1)) (BinOp Plus (Val 1) (Val 1))` },
      ],
      hint: "Only the `Var` case can change: `Var w` becomes `new` when `w == v`. A `BinOp` rebuilds itself from the substituted children.",
      solution: hs`substitute :: String -> Expr -> Expr -> Expr
substitute v new (Var w)
  | w == v = new
substitute v new (BinOp op a b) = BinOp op (substitute v new a) (substitute v new b)
substitute _ _ e = e
`,
    },
    {
      k: "write",
      body: md(
        "Questions 22-24 use a *decision tree*. Each `Question` has a yes-branch (first) and a no-branch (second).",
        "",
        ...petsShown,
        "",
        "Define a function `answers :: DTree -> [String]` that lists every possible answer, from left to right. For example:",
        "",
        "```",
        "*Main> answers pets",
        '["cat","dog","gecko","fish"]',
        "```",
      ),
      setup: petsSetup,
      starter: hs`answers :: DTree -> [String]
answers t = undefined
`,
      tests: [
        { expr: "answers pets", expected: hs`["cat", "dog", "gecko", "fish"]` },
        { expr: hs`answers (Answer "yes")`, expected: hs`["yes"]` },
        { expr: hs`answers (Question "?" (Answer "a") (Question "??" (Answer "b") (Answer "c")))`, expected: hs`["a", "b", "c"]` },
        { expr: "length (answers pets)", expected: "4" },
      ],
      hint: "`answers (Answer a) = [a]`; a `Question` joins the answers of its yes-branch and no-branch.",
      solution: hs`answers :: DTree -> [String]
answers (Answer a)       = [a]
answers (Question _ y n) = answers y ++ answers n
`,
    },
    {
      k: "write",
      body: md(
        ...petsShown,
        "",
        "Define a function `decide :: [Bool] -> DTree -> String` that follows a list of replies through the tree (`True` means yes) and returns the answer reached. A precondition is that there are enough replies to reach an answer; any extra replies are ignored. For example:",
        "",
        "```",
        "*Main> decide [True,False] pets",
        '"dog"',
        "*Main> decide [False,True] pets",
        '"gecko"',
        "```",
      ),
      setup: petsSetup,
      starter: hs`decide :: [Bool] -> DTree -> String
decide replies t = undefined
`,
      tests: [
        { expr: "decide [True, False] pets", expected: hs`"dog"` },
        { expr: "decide [False, True] pets", expected: hs`"gecko"` },
        { expr: hs`decide [] (Answer "done")`, expected: hs`"done"` },
        { expr: "decide [True, True, False, False] pets", expected: hs`"cat"`, label: "extra replies are ignored" },
      ],
      hint: "An `Answer` ignores the replies. At a `Question`, the first reply picks the branch and you recurse with the remaining replies.",
      solution: hs`decide :: [Bool] -> DTree -> String
decide _ (Answer a) = a
decide (r : rs) (Question _ y n) = decide rs (if r then y else n)
`,
    },
    {
      k: "write",
      body: md(
        ...petsShown,
        "",
        "Define a function `paths :: DTree -> [(String, [Bool])]` that pairs each answer with the list of replies that leads to it, from left to right. For example:",
        "",
        "```",
        "*Main> paths pets",
        '[("cat",[True,True]),("dog",[True,False]),("gecko",[False,True]),("fish",[False,False])]',
        "```",
      ),
      setup: petsSetup,
      starter: hs`paths :: DTree -> [(String, [Bool])]
paths t = undefined
`,
      tests: [
        { expr: "paths pets", expected: hs`[("cat", [True, True]), ("dog", [True, False]), ("gecko", [False, True]), ("fish", [False, False])]` },
        { expr: hs`paths (Answer "x")`, expected: hs`[("x", [])]` },
        { expr: hs`paths (Question "q" (Answer "a") (Answer "b"))`, expected: hs`[("a", [True]), ("b", [False])]` },
        { expr: hs`lookup "fish" (paths pets)`, expected: "Just [False, False]" },
      ],
      hint: "An answer is reached with no replies: `[(a, [])]`. For a question, take the paths of the yes-branch and put `True` on the front of each list; likewise `False` for the no-branch.",
      solution: hs`paths :: DTree -> [(String, [Bool])]
paths (Answer a) = [(a, [])]
paths (Question _ y n)
  = [(a, True : rs) | (a, rs) <- paths y] ++ [(a, False : rs) | (a, rs) <- paths n]
`,
    },
    {
      k: "write",
      body: md(
        ...treeShown,
        "",
        "A tree is a *binary search tree* if, at every node, every number in the left subtree is smaller than the node's number and every number in the right subtree is bigger. Checking only a node's two children is not enough.",
        "",
        "Define a function `isBST :: Tree -> Bool` that checks this property. For example:",
        "",
        "```",
        "*Main> isBST sample",
        "True",
        "*Main> isBST (Node Leaf 5 (Node (Node Leaf 4 Leaf) 6 Leaf))",
        "False",
        "```",
      ),
      setup: treeSetup,
      starter: hs`isBST :: Tree -> Bool
isBST t = undefined
`,
      tests: [
        { expr: "isBST sample", expected: "True" },
        { expr: "isBST (Node Leaf 5 (Node (Node Leaf 4 Leaf) 6 Leaf))", expected: "False", label: "4 is below 6 but in 5's right subtree" },
        { expr: "isBST Leaf", expected: "True" },
        { expr: "isBST (Node (Node Leaf 7 Leaf) 5 Leaf)", expected: "False" },
        { expr: "isBST (Node (Node Leaf 5 Leaf) 5 Leaf)", expected: "False", label: "duplicates aren't allowed" },
      ],
      hint: "The in-order list of a search tree is strictly increasing. Flatten the tree, then check every neighbouring pair with `zipWith (<)`.",
      solution: hs`isBST :: Tree -> Bool
isBST t = and (zipWith (<) xs (drop 1 xs))
  where
    xs = flatten t
    flatten Leaf = []
    flatten (Node l x r) = flatten l ++ [x] ++ flatten r
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Mixed exercise 5: books 1-6
// ---------------------------------------------------------------------------

const rose5 = hs`data Rose = Node Int [Rose]
  deriving (Eq, Show)

r1 :: Rose
r1 = Node 1 [Node 2 [Node 4 []], Node 3 [], Node 5 [Node 6 [], Node 7 []]]
`;

const rose5Shown = [
  "```",
  "data Rose = Node Int [Rose]",
  "  deriving (Eq, Show)",
  "",
  "r1 :: Rose",
  "r1 = Node 1 [Node 2 [Node 4 []], Node 3 [], Node 5 [Node 6 [], Node 7 []]]",
  "",
  "        1",
  "      / | \\",
  "     2  3  5",
  "     |    / \\",
  "     4   6   7",
  "```",
];

const bt5 = hs`data BTree = Nil | Br BTree Int BTree
  deriving (Eq, Show)

bt1 :: BTree
bt1 = Br (Br (Br Nil 1 Nil) 3 Nil) 5 (Br Nil 8 (Br Nil 9 Nil))
`;

const bt5Shown = [
  "```",
  "data BTree = Nil | Br BTree Int BTree",
  "  deriving (Eq, Show)",
  "",
  "bt1 :: BTree",
  "bt1 = Br (Br (Br Nil 1 Nil) 3 Nil) 5 (Br Nil 8 (Br Nil 9 Nil))",
  "```",
];

const fs5 = hs`data FS = File String Int | Dir String [FS]
  deriving (Eq, Show)

docs :: FS
docs
  = Dir "docs"
      [ File "readme.txt" 12
      , Dir "src"
          [ File "Main.hs" 40
          , File "Util.hs" 20
          ]
      , File "notes.md" 8
      , Dir "empty" []
      ]
`;

const fs5Shown = [
  "```",
  "data FS = File String Int | Dir String [FS]",
  "  deriving (Eq, Show)",
  "",
  "docs :: FS",
  "docs = Dir \"docs\"",
  "         [ File \"readme.txt\" 12",
  "         , Dir \"src\" [File \"Main.hs\" 40, File \"Util.hs\" 20]",
  "         , File \"notes.md\" 8",
  "         , Dir \"empty\" []",
  "         ]",
  "```",
];

const mixed05: DrillSet = {
  id: "mixed-05",
  lesson: "",
  title: "Mixed exercise 5",
  intro: md(
    "Mixed review of **Books 1-6**: lists and recursion; map, filter, folds and comprehensions; lookup tables; strings; binary trees; and **rose trees** (a node with a list of children).",
    "",
    "Any data type a question uses is shown in the question and already in the file for you. A rose tree has one constructor; a node with no children, `Node 3 []`, plays the part of a leaf. Recurse on every child with `map` or a comprehension, then combine.",
    "",
    "The set gets harder as it goes. The last eight questions are an exam-style file-system tree.",
  ),
  drills: [
    {
      k: "predict",
      expr: "sum (filter even [1 .. 6])",
      answer: "12",
      why: "`filter even` keeps `[2, 4, 6]`, and those add up to 12.",
    },
    {
      k: "quiz",
      q: "You need every word of `ws :: [String]` that is longer than 3 characters, upper-cased. Which expression does it?",
      options: [
        "`map toUpper (filter ((> 3) . length) ws)`",
        "`map toUpper (filter (> 3) ws)`",
        "`filter ((> 3) . length) (map toUpper ws)`",
        "`map (toUpper . filter ((> 3) . length)) ws`",
      ],
      answer: 0,
      why: "Filter the words first, then `map toUpper` over those strings. Filtering `> 3` directly would compare strings with a number. Mapping first would upper-case short words too, and option 4 has the wrong type.",
    },
    {
      k: "write",
      body: "Write `doublePos`, which doubles every positive number and drops the rest (zero and negatives go).",
      starter: hs`doublePos :: [Int] -> [Int]
doublePos xs = undefined
`,
      tests: [
        { expr: "doublePos [1, 0, -2, 4]", expected: "[2, 8]" },
        { expr: "doublePos []", expected: "[]" },
        { expr: "doublePos [-3, -1]", expected: "[]" },
        { expr: "doublePos [5]", expected: "[10]" },
      ],
      hint: "`[2 * x | x <- xs, x > 0]`, or `map (* 2) (filter (> 0) xs)`.",
      solution: hs`doublePos :: [Int] -> [Int]
doublePos xs = [2 * x | x <- xs, x > 0]
`,
    },
    {
      k: "write",
      body: md("Write `rotate n xs`, which moves the first `n` elements to the end. You may assume `n >= 0`. If `n` is bigger than the length, treat extra rotation as dropping the whole list then appending it (so `rotate 5 [1, 2] == [1, 2]`)."),
      starter: hs`rotate :: Int -> [a] -> [a]
rotate n xs = undefined
`,
      tests: [
        { expr: "rotate 1 [1, 2, 3]", expected: "[2, 3, 1]" },
        { expr: "rotate 0 \"abc\"", expected: '"abc"' },
        { expr: "rotate 5 [1, 2]", expected: "[1, 2]" },
        { expr: "rotate 3 ([] :: [Int])", expected: "[]" },
      ],
      hint: "`drop n xs ++ take n xs`. `drop` of too many is `[]` and `take` of too many is the whole list, so they swap back.",
      solution: hs`rotate :: Int -> [a] -> [a]
rotate n xs = drop n xs ++ take n xs
`,
    },
    {
      k: "predict",
      expr: "[x * x | x <- [1 .. 4], odd x]",
      answer: "[1, 9]",
      why: "The generator gives 1, 2, 3, 4; the guard keeps the odds 1 and 3; each is squared.",
    },
    {
      k: "write",
      body: "Write `getDefault k def table`, which looks `k` up in a table and gives `def` if it is missing.",
      starter: hs`getDefault :: Eq k => k -> v -> [(k, v)] -> v
getDefault k def table = undefined
`,
      tests: [
        { expr: 'getDefault "a" 0 [("a", 3), ("b", 4)]', expected: "3" },
        { expr: 'getDefault "z" 0 [("a", 3)]', expected: "0" },
        { expr: "getDefault 1 'x' []", expected: "'x'" },
        { expr: 'getDefault "a" 0 [("a", 1), ("a", 2)]', expected: "1", label: "first match wins" },
      ],
      hint: "`maybe def id (lookup k table)`, or a `case` on `lookup`.",
      solution: hs`getDefault :: Eq k => k -> v -> [(k, v)] -> v
getDefault k def table = maybe def id (lookup k table)
`,
    },
    {
      k: "write",
      body: "Write `keysOf`, the list of keys of a table, in table order.",
      starter: hs`keysOf :: [(k, v)] -> [k]
keysOf table = undefined
`,
      tests: [
        { expr: 'keysOf [("a", 1), ("b", 2)]', expected: '["a", "b"]' },
        { expr: "keysOf ([] :: [(Int, Int)])", expected: "[]" },
        { expr: "keysOf [(1, True), (1, False)]", expected: "[1, 1]" },
        { expr: "keysOf [(True, 'a')]", expected: "[True]" },
      ],
      hint: "`map fst table`.",
      solution: hs`keysOf :: [(k, v)] -> [k]
keysOf table = map fst table
`,
    },
    {
      k: "quiz",
      q: md("A rose tree is declared `data Rose = Node Int [Rose]`. How do you write a node holding 9 with no children?"),
      options: ["`Node 9`", "`Leaf 9`", "`Node 9 []`", "`Node [] 9`"],
      answer: 2,
      why: "`Node` always has two fields: the number and the list of children. With no children that list is empty.",
    },
    {
      k: "write",
      body: md("Write `titleCase`, which makes the first character of each word upper case and leaves the rest of the word alone:", "", "```", 'titleCase "ada king"  ==  "Ada King"', "```"),
      setup: hs`import Data.Char
`,
      starter: hs`titleCase :: String -> String
titleCase s = undefined
`,
      tests: [
        { expr: 'titleCase "ada king"', expected: '"Ada King"' },
        { expr: 'titleCase ""', expected: '""' },
        { expr: 'titleCase "x"', expected: '"X"' },
        { expr: 'titleCase "  hi   there"', expected: '"Hi There"' },
      ],
      hint: "`unwords [toUpper c : rest | (c : rest) <- words s]`. `words` never gives an empty word.",
      solution: hs`titleCase :: String -> String
titleCase s = unwords [toUpper c : rest | (c : rest) <- words s]
`,
    },
    {
      k: "write",
      body: md("Questions 10, 13, 19 and 22 use this binary tree.", "", ...bt5Shown, "", "Write `btSize`, the number of `Br` nodes."),
      setup: bt5,
      starter: hs`btSize :: BTree -> Int
btSize t = undefined
`,
      tests: [
        { expr: "btSize bt1", expected: "5" },
        { expr: "btSize Nil", expected: "0" },
        { expr: "btSize (Br Nil 7 Nil)", expected: "1" },
        { expr: "btSize (Br (Br Nil 1 Nil) 2 (Br Nil 3 Nil))", expected: "3" },
      ],
      hint: "`btSize Nil = 0` and `btSize (Br l _ r) = 1 + btSize l + btSize r`.",
      solution: hs`btSize :: BTree -> Int
btSize Nil        = 0
btSize (Br l _ r) = 1 + btSize l + btSize r
`,
    },
    {
      k: "predict",
      expr: 'foldr (++) "" ["ab", "c", "d"]',
      answer: '"abcd"',
      why: "`foldr (++) \"\"` joins the strings from the right: `\"ab\" ++ (\"c\" ++ (\"d\" ++ \"\"))`.",
    },
    {
      k: "write",
      body: "Write `put k v table`, which sets the value of `k` to `v`. If `k` is already a key, replace its first entry and drop any later entries for `k`; if not, add the pair at the end.",
      starter: hs`put :: Eq k => k -> v -> [(k, v)] -> [(k, v)]
put k v table = undefined
`,
      tests: [
        { expr: 'put "b" 9 [("a", 1), ("b", 2)]', expected: '[("a", 1), ("b", 9)]' },
        { expr: 'put "c" 3 [("a", 1)]', expected: '[("a", 1), ("c", 3)]' },
        { expr: 'put "a" 1 ([] :: [(String, Int)])', expected: '[("a", 1)]' },
        { expr: 'put "a" 5 [("a", 1), ("b", 2), ("a", 3)]', expected: '[("b", 2), ("a", 5)]' },
      ],
      hint: "Drop every pair whose key is `k`, then append `(k, v)`.",
      solution: hs`put :: Eq k => k -> v -> [(k, v)] -> [(k, v)]
put k v table = [(k', v') | (k', v') <- table, k' /= k] ++ [(k, v)]
`,
    },
    {
      k: "write",
      body: md("Using the same `BTree` type, write `btInorder`: left subtree, then the node, then the right subtree.", "", ...bt5Shown),
      setup: bt5,
      starter: hs`btInorder :: BTree -> [Int]
btInorder t = undefined
`,
      tests: [
        { expr: "btInorder bt1", expected: "[1, 3, 5, 8, 9]" },
        { expr: "btInorder Nil", expected: "[]" },
        { expr: "btInorder (Br Nil 4 Nil)", expected: "[4]" },
        { expr: "btInorder (Br (Br Nil 2 Nil) 1 Nil)", expected: "[2, 1]" },
      ],
      hint: "`btInorder (Br l x r) = btInorder l ++ [x] ++ btInorder r`.",
      solution: hs`btInorder :: BTree -> [Int]
btInorder Nil        = []
btInorder (Br l x r) = btInorder l ++ [x] ++ btInorder r
`,
    },
    {
      k: "quiz",
      q: "`table :: [(String, Int)]`. What is the type of `lookup \"x\" table`?",
      options: ["`Int`", "`Maybe Int`", "`[Int]`", "`(String, Int)`"],
      answer: 1,
      why: "The key might be missing, so `lookup` returns `Maybe Int`.",
    },
    {
      k: "write",
      body: md("Questions 15, 16, 20 and 22 use this rose tree.", "", ...rose5Shown, "", "Write `rSize`, the number of nodes."),
      setup: rose5,
      starter: hs`rSize :: Rose -> Int
rSize t = undefined
`,
      tests: [
        { expr: "rSize r1", expected: "7" },
        { expr: "rSize (Node 3 [])", expected: "1" },
        { expr: "rSize (Node 0 [Node 0 [], Node 0 []])", expected: "3" },
        { expr: "rSize (Node 1 [Node 2 [Node 3 [Node 4 []]]])", expected: "4" },
      ],
      hint: "`rSize (Node _ ts) = 1 + sum (map rSize ts)`. The empty child list is the base case.",
      solution: hs`rSize :: Rose -> Int
rSize (Node _ ts) = 1 + sum (map rSize ts)
`,
    },
    {
      k: "write",
      body: md("Using the same rose tree, write `rFlatten`, listing each node's number **before** its children's numbers (pre-order).", "", ...rose5Shown),
      setup: rose5,
      starter: hs`rFlatten :: Rose -> [Int]
rFlatten t = undefined
`,
      tests: [
        { expr: "rFlatten r1", expected: "[1, 2, 4, 3, 5, 6, 7]" },
        { expr: "rFlatten (Node 9 [])", expected: "[9]" },
        { expr: "rFlatten (Node 1 [Node 2 [], Node 3 []])", expected: "[1, 2, 3]" },
        { expr: "length (rFlatten r1)", expected: "7" },
      ],
      hint: "`rFlatten (Node x ts) = x : concatMap rFlatten ts`.",
      solution: hs`rFlatten :: Rose -> [Int]
rFlatten (Node x ts) = x : concatMap rFlatten ts
`,
    },
    {
      k: "write",
      body: "Write `between lo hi xs`, the elements of `xs` that lie between `lo` and `hi` inclusive, in their original order.",
      starter: hs`between :: Ord a => a -> a -> [a] -> [a]
between lo hi xs = undefined
`,
      tests: [
        { expr: "between 3 5 [1, 4, 9, 3, 5]", expected: "[4, 3, 5]" },
        { expr: 'between \'c\' \'e\' "abcdef"', expected: '"cde"' },
        { expr: "between 1 10 ([] :: [Int])", expected: "[]" },
        { expr: "between 5 5 [5, 4, 5]", expected: "[5, 5]" },
      ],
      hint: "`[x | x <- xs, lo <= x, x <= hi]`.",
      solution: hs`between :: Ord a => a -> a -> [a] -> [a]
between lo hi xs = [x | x <- xs, lo <= x, x <= hi]
`,
    },
    {
      k: "write",
      body: md(
        "A CSV line looks like `name,rest,of,fields`. Write `firstFields`, which gives the text before the first comma of each line. A line with no comma is kept whole. Empty input gives `[]`.",
        "",
        "```",
        'firstFields "Ann,72\\nBen\\nCara,90"  ==  ["Ann","Ben","Cara"]',
        "```",
      ),
      starter: hs`firstFields :: String -> [String]
firstFields s = undefined
`,
      tests: [
        { expr: 'firstFields "Ann,72\\nBen\\nCara,90"', expected: '["Ann", "Ben", "Cara"]' },
        { expr: 'firstFields ""', expected: "[]" },
        { expr: 'firstFields "only"', expected: '["only"]' },
        { expr: 'firstFields ",x\\na,"', expected: '["", "a"]' },
      ],
      hint: "`[takeWhile (/= ',') line | line <- lines s]`.",
      solution: hs`firstFields :: String -> [String]
firstFields s = [takeWhile (/= ',') line | line <- lines s]
`,
    },
    {
      k: "write",
      body: md("`bt1` is a binary search tree. Write `btMember x t`, which is `True` when `x` occurs in `t`. Walk only the side that can hold `x`.", "", ...bt5Shown),
      setup: bt5,
      starter: hs`btMember :: Int -> BTree -> Bool
btMember x t = undefined
`,
      tests: [
        { expr: "btMember 8 bt1", expected: "True" },
        { expr: "btMember 4 bt1", expected: "False" },
        { expr: "btMember 1 Nil", expected: "False" },
        { expr: "btMember 5 bt1", expected: "True" },
        { expr: "btMember 9 (Br Nil 9 Nil)", expected: "True" },
      ],
      hint: "At `Br l y r`, equal is `True`; smaller searches `l`; bigger searches `r`. `Nil` is `False`.",
      solution: hs`btMember :: Int -> BTree -> Bool
btMember _ Nil = False
btMember x (Br l y r)
  | x == y    = True
  | x < y     = btMember x l
  | otherwise = btMember x r
`,
    },
    {
      k: "write",
      body: md("Write `rMap f t`, which applies `f` to every number in a rose tree, keeping the shape.", "", ...rose5Shown),
      setup: rose5,
      starter: hs`rMap :: (Int -> Int) -> Rose -> Rose
rMap f t = undefined
`,
      tests: [
        { expr: "rMap (* 10) (Node 1 [Node 2 [], Node 3 []])", expected: "Node 10 [Node 20 [], Node 30 []]" },
        { expr: "rMap id r1", expected: "r1" },
        { expr: "rMap (+ 1) (Node 0 [])", expected: "Node 1 []" },
        { expr: "rMap abs (Node (-2) [Node 3 []])", expected: "Node 2 [Node 3 []]" },
      ],
      hint: "`rMap f (Node x ts) = Node (f x) (map (rMap f) ts)`.",
      solution: hs`rMap :: (Int -> Int) -> Rose -> Rose
rMap f (Node x ts) = Node (f x) (map (rMap f) ts)
`,
    },
    {
      k: "write",
      body: "Write `countOcc x xs`, how many times `x` occurs in `xs`.",
      starter: hs`countOcc :: Eq a => a -> [a] -> Int
countOcc x xs = undefined
`,
      tests: [
        { expr: 'countOcc \'s\' "mississippi"', expected: "4" },
        { expr: "countOcc 1 ([] :: [Int])", expected: "0" },
        { expr: "countOcc True [False, False]", expected: "0" },
        { expr: "countOcc 7 [7, 1, 7, 7]", expected: "3" },
      ],
      hint: "`length (filter (== x) xs)`.",
      solution: hs`countOcc :: Eq a => a -> [a] -> Int
countOcc x xs = length (filter (== x) xs)
`,
    },
    {
      k: "write",
      body: md(
        "Write `rDepth`: the number of nodes on the longest path from the top down. A node with no children has depth 1.",
        "",
        ...rose5Shown,
        "",
        "`maximum` crashes on `[]`, so a node with no children needs care.",
      ),
      setup: rose5,
      starter: hs`rDepth :: Rose -> Int
rDepth t = undefined
`,
      tests: [
        { expr: "rDepth r1", expected: "3" },
        { expr: "rDepth (Node 3 [])", expected: "1" },
        { expr: "rDepth (Node 1 [Node 2 [Node 3 [Node 4 []]]])", expected: "4" },
        { expr: "rDepth (Node 1 [Node 2 [], Node 3 [Node 4 []], Node 5 []])", expected: "3" },
      ],
      hint: "`rDepth (Node _ ts) = 1 + maximum (0 : map rDepth ts)`.",
      solution: hs`rDepth :: Rose -> Int
rDepth (Node _ ts) = 1 + maximum (0 : map rDepth ts)
`,
    },
    {
      k: "write",
      body: md(
        "Questions 23-30 use a file-system tree. A `File` has a name and a size in kilobytes. A `Dir` has a name and a list of entries.",
        "",
        ...fs5Shown,
        "",
        "Define a function `totalSize :: FS -> Int` that adds up the sizes of every file. Directories contribute 0 of their own. For example:",
        "",
        "```",
        "*Main> totalSize docs",
        "80",
        "*Main> totalSize (Dir \"empty\" [])",
        "0",
        "```",
      ),
      setup: fs5,
      starter: hs`totalSize :: FS -> Int
totalSize e = undefined
`,
      tests: [
        { expr: "totalSize docs", expected: "80" },
        { expr: 'totalSize (Dir "empty" [])', expected: "0" },
        { expr: 'totalSize (File "a" 5)', expected: "5" },
        { expr: 'totalSize (Dir "d" [File "a" 1, File "b" 2])', expected: "3" },
        { expr: 'totalSize (Dir "d" [Dir "e" [File "z" 9]])', expected: "9" },
      ],
      hint: "A file is its size. A directory is `sum (map totalSize kids)`.",
      solution: hs`totalSize :: FS -> Int
totalSize (File _ n) = n
totalSize (Dir _ es) = sum (map totalSize es)
`,
    },
    {
      k: "write",
      body: md(
        ...fs5Shown,
        "",
        "Define a function `fileNames :: FS -> [String]` that lists every file name, in pre-order (a directory's entries left to right, files as you meet them). For example:",
        "",
        "```",
        "*Main> fileNames docs",
        '["readme.txt","Main.hs","Util.hs","notes.md"]',
        "```",
      ),
      setup: fs5,
      starter: hs`fileNames :: FS -> [String]
fileNames e = undefined
`,
      tests: [
        { expr: "fileNames docs", expected: '["readme.txt", "Main.hs", "Util.hs", "notes.md"]' },
        { expr: 'fileNames (File "a.txt" 1)', expected: '["a.txt"]' },
        { expr: 'fileNames (Dir "empty" [])', expected: "[]" },
        { expr: 'fileNames (Dir "d" [Dir "e" [File "z" 1], File "y" 1])', expected: '["z", "y"]' },
        { expr: "length (fileNames docs)", expected: "4" },
      ],
      hint: "A file gives `[name]`. A directory is `concatMap fileNames` of its entries.",
      solution: hs`fileNames :: FS -> [String]
fileNames (File n _) = [n]
fileNames (Dir _ es) = concatMap fileNames es
`,
    },
    {
      k: "write",
      body: md(
        ...fs5Shown,
        "",
        "Define a function `dirNames :: FS -> [String]` that lists every directory name, this directory first, then its subdirectories in pre-order. Files contribute nothing. For example:",
        "",
        "```",
        "*Main> dirNames docs",
        '["docs","src","empty"]',
        "```",
      ),
      setup: fs5,
      starter: hs`dirNames :: FS -> [String]
dirNames e = undefined
`,
      tests: [
        { expr: "dirNames docs", expected: '["docs", "src", "empty"]' },
        { expr: 'dirNames (File "a.txt" 1)', expected: "[]" },
        { expr: 'dirNames (Dir "empty" [])', expected: '["empty"]' },
        { expr: 'dirNames (Dir "a" [Dir "b" [Dir "c" []]])', expected: '["a", "b", "c"]' },
        { expr: 'dirNames (Dir "a" [File "x" 1, Dir "b" []])', expected: '["a", "b"]' },
      ],
      hint: "`dirNames (Dir n es) = n : concatMap dirNames es`, and a file gives `[]`.",
      solution: hs`dirNames :: FS -> [String]
dirNames (File _ _) = []
dirNames (Dir n es) = n : concatMap dirNames es
`,
    },
    {
      k: "write",
      body: md(
        ...fs5Shown,
        "",
        "Define a function `countFiles :: FS -> Int` that counts how many files are in the tree. For example:",
        "",
        "```",
        "*Main> countFiles docs",
        "4",
        "*Main> countFiles (Dir \"empty\" [])",
        "0",
        "```",
      ),
      setup: fs5,
      starter: hs`countFiles :: FS -> Int
countFiles e = undefined
`,
      tests: [
        { expr: "countFiles docs", expected: "4" },
        { expr: 'countFiles (Dir "empty" [])', expected: "0" },
        { expr: 'countFiles (File "a" 1)', expected: "1" },
        { expr: 'countFiles (Dir "d" [File "a" 1, File "b" 1])', expected: "2" },
        { expr: 'countFiles (Dir "d" [Dir "e" [File "z" 1], File "y" 1])', expected: "2" },
      ],
      hint: "A file counts as 1. A directory is `sum (map countFiles kids)`.",
      solution: hs`countFiles :: FS -> Int
countFiles (File _ _) = 1
countFiles (Dir _ es) = sum (map countFiles es)
`,
    },
    {
      k: "write",
      body: md(
        ...fs5Shown,
        "",
        "Define a function `findFile :: String -> FS -> Int` that returns the size of the first file with that name, walking the tree in pre-order. If there is no such file, return 0. File sizes in this question are always positive. For example:",
        "",
        "```",
        '*Main> findFile "Main.hs" docs',
        "40",
        '*Main> findFile "nope" docs',
        "0",
        "```",
      ),
      setup: fs5,
      starter: hs`findFile :: String -> FS -> Int
findFile name e = undefined
`,
      tests: [
        { expr: 'findFile "Main.hs" docs', expected: "40" },
        { expr: 'findFile "nope" docs', expected: "0" },
        { expr: 'findFile "readme.txt" docs', expected: "12" },
        { expr: 'findFile "a" (File "a" 7)', expected: "7" },
        { expr: 'findFile "a" (File "b" 7)', expected: "0" },
        { expr: 'findFile "z" (Dir "d" [File "z" 1, File "z" 9])', expected: "1", label: "first in pre-order" },
      ],
      hint: "On a matching file, return the size. On a directory, take the first non-zero result from the children (or 0).",
      solution: hs`findFile :: String -> FS -> Int
findFile name (File n sz)
  | n == name = sz
  | otherwise = 0
findFile name (Dir _ es) = firstNonZero (map (findFile name) es)
  where
    firstNonZero [] = 0
    firstNonZero (n : ns)
      | n /= 0    = n
      | otherwise = firstNonZero ns
`,
    },
    {
      k: "write",
      body: md(
        ...fs5Shown,
        "",
        "Define a function `biggest :: FS -> String` that returns the name of the **largest** file (greatest size). If several files share that size, pick the first in pre-order. You may assume there is at least one file. For example:",
        "",
        "```",
        "*Main> biggest docs",
        '"Main.hs"',
        "```",
      ),
      setup: fs5,
      starter: hs`biggest :: FS -> String
biggest e = undefined
`,
      tests: [
        { expr: "biggest docs", expected: '"Main.hs"' },
        { expr: 'biggest (File "only" 3)', expected: '"only"' },
        { expr: 'biggest (Dir "d" [File "a" 2, File "b" 2])', expected: '"a"', label: "tie: first in pre-order" },
        { expr: 'biggest (Dir "d" [Dir "e" [File "z" 9], File "y" 8])', expected: '"z"' },
        { expr: 'biggest (Dir "d" [File "a" 1, File "b" 5, File "c" 5])', expected: '"b"' },
      ],
      hint: "Collect `(name, size)` pairs in pre-order, then `foldl` keeping a pair, replacing it only when a strictly larger size appears.",
      solution: hs`biggest :: FS -> String
biggest e = fst (foldl1 pick (files e))
  where
    files (File n sz) = [(n, sz)]
    files (Dir _ es) = concatMap files es
    pick acc@(_, sa) q@(_, sq)
      | sq > sa   = q
      | otherwise = acc
`,
    },
    {
      k: "write",
      body: md(
        ...fs5Shown,
        "",
        "Define a function `listing :: FS -> [String]` that lists the path of every **file**, from the root name down, using `/` as the separator. Directory names appear only as prefixes, not as entries of their own. For example:",
        "",
        "```",
        "*Main> listing docs",
        '["docs/readme.txt","docs/src/Main.hs","docs/src/Util.hs","docs/notes.md"]',
        "*Main> listing (File \"solo\" 1)",
        '["solo"]',
        "```",
      ),
      setup: fs5,
      starter: hs`listing :: FS -> [String]
listing e = undefined
`,
      tests: [
        { expr: "listing docs", expected: '["docs/readme.txt", "docs/src/Main.hs", "docs/src/Util.hs", "docs/notes.md"]' },
        { expr: 'listing (File "solo" 1)', expected: '["solo"]' },
        { expr: 'listing (Dir "empty" [])', expected: "[]" },
        { expr: 'listing (Dir "a" [Dir "b" [File "c" 1]])', expected: '["a/b/c"]' },
        { expr: "length (listing docs)", expected: "4" },
      ],
      hint: "A helper `go prefix` builds paths. For a file, `prefix ++ name` (or just `name` at the top). For a directory, recurse on each child with `prefix ++ dirName ++ \"/\"`.",
      solution: hs`listing :: FS -> [String]
listing e = go "" e
  where
    go prefix (File n _) = [prefix ++ n]
    go prefix (Dir n es) = concatMap (go (prefix ++ n ++ "/")) es
`,
    },
    {
      k: "write",
      body: md(
        ...fs5Shown,
        "",
        "Define a function `scale :: Int -> FS -> FS` that multiplies every file size by `k` and leaves names and the tree shape unchanged. For example:",
        "",
        "```",
        "*Main> scale 2 (File \"a\" 5)",
        'File "a" 10',
        "*Main> totalSize (scale 0 docs)",
        "0",
        "```",
      ),
      setup: fs5,
      starter: hs`scale :: Int -> FS -> FS
scale k e = undefined
`,
      tests: [
        { expr: 'scale 2 (File "a" 5)', expected: 'File "a" 10' },
        { expr: 'scale 0 (File "a" 5)', expected: 'File "a" 0' },
        { expr: 'scale 3 (File "a" 5)', expected: 'File "a" 15' },
        { expr: 'scale 1 docs', expected: "docs" },
        { expr: 'scale 9 (Dir "d" [File "a" 1])', expected: 'Dir "d" [File "a" 9]' },
        { expr: 'scale 2 (Dir "d" [File "a" 1, Dir "e" [File "b" 3]])', expected: 'Dir "d" [File "a" 2, Dir "e" [File "b" 6]]' },
      ],
      hint: "`scale k (File n sz) = File n (k * sz)` and `scale k (Dir n es) = Dir n (map (scale k) es)`.",
      solution: hs`scale :: Int -> FS -> FS
scale k (File n sz) = File n (k * sz)
scale k (Dir n es)  = Dir n (map (scale k) es)
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Mixed exercise 6: + rewriting and Maybe
// ---------------------------------------------------------------------------

const form6 = hs`data Form = FVar String | FNot Form | FAnd Form Form | FOr Form Form | FBool Bool
  deriving (Eq, Show)

f1 :: Form
f1 = FAnd (FVar "a") (FNot (FNot (FVar "b")))

f2 :: Form
f2 = FOr (FBool False) (FAnd (FBool True) (FVar "x"))
`;

const form6Shown = [
  "```",
  "data Form = FVar String | FNot Form | FAnd Form Form | FOr Form Form | FBool Bool",
  "  deriving (Eq, Show)",
  "",
  "f1 = FAnd (FVar \"a\") (FNot (FNot (FVar \"b\")))     -- a /\\ not not b",
  "f2 = FOr (FBool False) (FAnd (FBool True) (FVar \"x\"))  -- False \\/ (True /\\ x)",
  "```",
];

const expr6 = hs`import Data.Maybe
import Data.List (nub)

data Expr = Num Int | Var String | Add Expr Expr | Mul Expr Expr
  deriving (Eq, Show)

type Env = [(String, Int)]

e1 :: Expr
e1 = Add (Var "x") (Mul (Num 3) (Var "y"))

e2 :: Expr
e2 = Mul (Add (Num 1) (Num 2)) (Num 0)

env1 :: Env
env1 = [("x", 2), ("y", 5)]
`;

const expr6Shown = [
  "```",
  "data Expr = Num Int | Var String | Add Expr Expr | Mul Expr Expr",
  "  deriving (Eq, Show)",
  "",
  "type Env = [(String, Int)]",
  "",
  "e1 = Add (Var \"x\") (Mul (Num 3) (Var \"y\"))    -- x + 3 * y",
  "e2 = Mul (Add (Num 1) (Num 2)) (Num 0)        -- (1 + 2) * 0",
  "env1 = [(\"x\", 2), (\"y\", 5)]",
  "```",
];

const mixed06: DrillSet = {
  id: "mixed-06",
  lesson: "",
  title: "Mixed exercise 6",
  intro: md(
    "Everything from mixed 5, plus **rewriting trees with nested patterns** and **Maybe**.",
    "",
    "Rewriting: match a shape such as `Not (Not e)` and replace it; do the children first (bottom-up) so rules fire all the way down. Equation order matters: specific patterns above a catch-all.",
    "",
    "`Maybe` is how exams signal failure: `lookup` misses, a variable is unbound, a rule does not apply. Plumbing several `Maybe`s together is the skill.",
    "",
    "The last eight questions are exam-style: evaluate, rewrite and print an expression language that can fail.",
  ),
  drills: [
    {
      k: "predict",
      expr: "fromMaybe 0 (lookup 3 [(1, 10), (3, 30)])",
      answer: "30",
      why: "`lookup 3` finds `Just 30`, and `fromMaybe` unwraps it. The default 0 is unused.",
    },
    {
      k: "quiz",
      q: "What does `fromMaybe \"?\" Nothing` give?",
      options: ['`"? "`', '`"?"`', "`Nothing`", "`Just \"?\"`"],
      answer: 1,
      why: "`fromMaybe` uses the default exactly when the `Maybe` is `Nothing`.",
    },
    {
      k: "write",
      body: "Write `safeHead`, which is `Just` of the first element, or `Nothing` on an empty list.",
      starter: hs`safeHead :: [a] -> Maybe a
safeHead xs = undefined
`,
      tests: [
        { expr: "safeHead [1, 2, 3]", expected: "Just 1" },
        { expr: "safeHead ([] :: [Int])", expected: "Nothing" },
        { expr: 'safeHead "x"', expected: "Just 'x'" },
        { expr: "safeHead [True]", expected: "Just True" },
      ],
      hint: "`safeHead [] = Nothing` and `safeHead (x : _) = Just x`.",
      solution: hs`safeHead :: [a] -> Maybe a
safeHead []      = Nothing
safeHead (x : _) = Just x
`,
    },
    {
      k: "write",
      body: "Write `safeDiv a b`, which is `Just (div a b)` when `b` is not 0, and `Nothing` when `b` is 0.",
      starter: hs`safeDiv :: Int -> Int -> Maybe Int
safeDiv a b = undefined
`,
      tests: [
        { expr: "safeDiv 10 2", expected: "Just 5" },
        { expr: "safeDiv 10 0", expected: "Nothing" },
        { expr: "safeDiv 0 3", expected: "Just 0" },
        { expr: "safeDiv (-7) 2", expected: "Just (-4)" },
      ],
      hint: "A guard `b == 0` returns `Nothing`; `otherwise` is `Just (div a b)`.",
      solution: hs`safeDiv :: Int -> Int -> Maybe Int
safeDiv a b
  | b == 0    = Nothing
  | otherwise = Just (div a b)
`,
    },
    {
      k: "predict",
      expr: "mapMaybe id [Just 1, Nothing, Just 2]",
      answer: "[1, 2]",
      why: "`mapMaybe` applies a function that returns `Maybe` and keeps only the `Just` results. `id` leaves each `Maybe` as it is, so `Nothing` is dropped.",
    },
    {
      k: "write",
      body: "Write `withDefault k def table`: look `k` up, giving `def` when it is missing. Use `fromMaybe` (import `Data.Maybe`).",
      setup: hs`import Data.Maybe
`,
      starter: hs`withDefault :: Eq k => k -> v -> [(k, v)] -> v
withDefault k def table = undefined
`,
      tests: [
        { expr: 'withDefault "x" 0 [("x", 8)]', expected: "8" },
        { expr: 'withDefault "z" 0 [("x", 8)]', expected: "0" },
        { expr: "withDefault 1 False []", expected: "False" },
        { expr: 'withDefault "a" 9 [("a", 1), ("a", 2)]', expected: "1" },
      ],
      hint: "`withDefault k def table = fromMaybe def (lookup k table)`.",
      solution: hs`withDefault :: Eq k => k -> v -> [(k, v)] -> v
withDefault k def table = fromMaybe def (lookup k table)
`,
    },
    {
      k: "write",
      body: "Write `catJusts`, which keeps the values inside every `Just` and drops every `Nothing`, in order.",
      starter: hs`catJusts :: [Maybe a] -> [a]
catJusts xs = undefined
`,
      tests: [
        { expr: "catJusts [Just 1, Nothing, Just 2]", expected: "[1, 2]" },
        { expr: "catJusts ([] :: [Maybe Int])", expected: "[]" },
        { expr: "catJusts ([Nothing, Nothing] :: [Maybe Int])", expected: "[]" },
        { expr: 'catJusts [Just \'a\']', expected: "['a']" },
      ],
      hint: "Two cons cases: `Just x : xs` keeps `x`; `Nothing : xs` skips. `[]` is `[]`.",
      solution: hs`catJusts :: [Maybe a] -> [a]
catJusts []             = []
catJusts (Just x : xs)  = x : catJusts xs
catJusts (Nothing : xs) = catJusts xs
`,
    },
    {
      k: "quiz",
      q: "Which of these does the pattern `FNot (FNot e)` match?",
      options: [
        "`FNot (FVar \"a\")`",
        "`FNot (FNot (FVar \"a\"))`",
        "`FAnd (FNot (FVar \"a\")) (FNot (FVar \"b\"))`",
        "`FVar \"a\"`",
      ],
      answer: 1,
      why: "The outside must be `FNot` and the thing directly inside must also be `FNot`. Only the second option has that shape.",
    },
    {
      k: "write",
      body: md("Using this type, write `dropDoubleNot`, which removes a double negation at the **root only**. Anything else is returned unchanged.", "", ...form6Shown),
      setup: form6,
      starter: hs`dropDoubleNot :: Form -> Form
dropDoubleNot f = undefined
`,
      tests: [
        { expr: 'dropDoubleNot (FNot (FNot (FVar "a")))', expected: 'FVar "a"' },
        { expr: 'dropDoubleNot (FNot (FVar "a"))', expected: 'FNot (FVar "a")' },
        { expr: "dropDoubleNot (FBool True)", expected: "FBool True" },
        { expr: 'dropDoubleNot (FNot (FNot (FNot (FVar "a"))))', expected: 'FNot (FVar "a")', label: "only one pair at the root" },
      ],
      hint: "`dropDoubleNot (FNot (FNot e)) = e` and a catch-all `dropDoubleNot f = f`.",
      solution: hs`dropDoubleNot :: Form -> Form
dropDoubleNot (FNot (FNot e)) = e
dropDoubleNot f               = f
`,
    },
    {
      k: "write",
      body: md("Write `notConst`, which evaluates `FNot` of a boolean constant, and leaves any other formula alone.", "", ...form6Shown),
      setup: form6,
      starter: hs`notConst :: Form -> Form
notConst f = undefined
`,
      tests: [
        { expr: "notConst (FNot (FBool True))", expected: "FBool False" },
        { expr: "notConst (FNot (FBool False))", expected: "FBool True" },
        { expr: 'notConst (FNot (FVar "a"))', expected: 'FNot (FVar "a")' },
        { expr: "notConst (FBool True)", expected: "FBool True" },
      ],
      hint: "`notConst (FNot (FBool b)) = FBool (not b)`, catch-all unchanged.",
      solution: hs`notConst :: Form -> Form
notConst (FNot (FBool b)) = FBool (not b)
notConst f                = f
`,
    },
    {
      k: "predict",
      expr: "maybe 0 (* 2) Nothing",
      answer: "0",
      why: "`maybe d f` uses `d` on `Nothing` and applies `f` to the value inside a `Just`. Here it is `Nothing`, so 0.",
    },
    {
      k: "write",
      body: "Write `firstJust`, the first `Just` value in a list, or `Nothing` if there is none.",
      starter: hs`firstJust :: [Maybe a] -> Maybe a
firstJust xs = undefined
`,
      tests: [
        { expr: "firstJust [Nothing, Just 3, Just 4]", expected: "Just 3" },
        { expr: "firstJust ([Nothing, Nothing] :: [Maybe Int])", expected: "Nothing" },
        { expr: "firstJust ([] :: [Maybe Int])", expected: "Nothing" },
        { expr: "firstJust [Just True]", expected: "Just True" },
      ],
      hint: "Skip `Nothing`s until you hit a `Just` or run out.",
      solution: hs`firstJust :: [Maybe a] -> Maybe a
firstJust []             = Nothing
firstJust (Just x : _)   = Just x
firstJust (Nothing : xs) = firstJust xs
`,
    },
    {
      k: "write",
      body: "Write `bothJust`, which pairs two `Just` values, and is `Nothing` if either argument is `Nothing`.",
      starter: hs`bothJust :: Maybe a -> Maybe b -> Maybe (a, b)
bothJust ma mb = undefined
`,
      tests: [
        { expr: "bothJust (Just 1) (Just 'a')", expected: "Just (1, 'a')" },
        { expr: "bothJust (Nothing :: Maybe Int) (Just 'a')", expected: "Nothing" },
        { expr: "bothJust (Just 1) (Nothing :: Maybe Char)", expected: "Nothing" },
        { expr: "bothJust (Nothing :: Maybe Int) (Nothing :: Maybe Char)", expected: "Nothing" },
      ],
      hint: "`bothJust (Just x) (Just y) = Just (x, y)` and `bothJust _ _ = Nothing`.",
      solution: hs`bothJust :: Maybe a -> Maybe b -> Maybe (a, b)
bothJust (Just x) (Just y) = Just (x, y)
bothJust _ _               = Nothing
`,
    },
    {
      k: "quiz",
      q: "You are writing a simplifier. The catch-all equation `simpl f = f` is first, and the specific equation `simpl (FNot (FNot e)) = e` is second. What happens?",
      options: [
        "Double negations are still removed: Haskell picks the most specific equation",
        "The specific equation is never used: the catch-all matches everything, including double negations",
        "The file does not compile",
        "It loops forever on `FNot (FNot e)`",
      ],
      answer: 1,
      why: "Equations are tried top to bottom. A catch-all first matches every input, so the specific equation is dead. Put it last.",
    },
    {
      k: "write",
      body: md(
        "Using `Form`, write `evalB env f`. Variables are looked up in `env :: [(String, Bool)]`. If any variable is missing, the result is `Nothing`. Operators are the usual Boolean ones.",
        "",
        ...form6Shown,
      ),
      setup: form6,
      starter: hs`evalB :: [(String, Bool)] -> Form -> Maybe Bool
evalB env f = undefined
`,
      tests: [
        { expr: 'evalB [("a", True), ("b", False)] f1', expected: "Just False" },
        { expr: 'evalB [("x", True)] f2', expected: "Just True" },
        { expr: 'evalB [] (FBool False)', expected: "Just False" },
        { expr: 'evalB [] (FVar "z")', expected: "Nothing" },
        { expr: 'evalB [("a", True)] (FAnd (FVar "a") (FVar "b"))', expected: "Nothing" },
      ],
      hint: "Each constructor: `FBool` wraps in `Just`; `FVar` is `lookup`; `FNot`/`FAnd`/`FOr` combine with `case` or `bothJust`-style plumbing (a `Nothing` anywhere makes `Nothing`).",
      solution: hs`evalB :: [(String, Bool)] -> Form -> Maybe Bool
evalB _ (FBool b) = Just b
evalB env (FVar v) = lookup v env
evalB env (FNot f) =
  case evalB env f of
    Just b  -> Just (not b)
    Nothing -> Nothing
evalB env (FAnd a b) =
  case (evalB env a, evalB env b) of
    (Just x, Just y) -> Just (x && y)
    _                -> Nothing
evalB env (FOr a b) =
  case (evalB env a, evalB env b) of
    (Just x, Just y) -> Just (x || y)
    _                -> Nothing
`,
    },
    {
      k: "write",
      body: md("Write `occurs v f`, which is `True` when variable `v` appears anywhere in the formula.", "", ...form6Shown),
      setup: form6,
      starter: hs`occurs :: String -> Form -> Bool
occurs v f = undefined
`,
      tests: [
        { expr: 'occurs "a" f1', expected: "True" },
        { expr: 'occurs "x" f1', expected: "False" },
        { expr: 'occurs "x" f2', expected: "True" },
        { expr: 'occurs "z" (FBool True)', expected: "False" },
      ],
      hint: "`FVar w` is `w == v`. Recurse into `FNot`/`FAnd`/`FOr`. `FBool` is `False`.",
      solution: hs`occurs :: String -> Form -> Bool
occurs v (FVar w)   = v == w
occurs v (FNot f)   = occurs v f
occurs v (FAnd a b) = occurs v a || occurs v b
occurs v (FOr a b)  = occurs v a || occurs v b
occurs _ (FBool _)  = False
`,
    },
    {
      k: "write",
      body: "Write `addMaybe`, the sum of two `Maybe Int`s, or `Nothing` if either is `Nothing`.",
      starter: hs`addMaybe :: Maybe Int -> Maybe Int -> Maybe Int
addMaybe ma mb = undefined
`,
      tests: [
        { expr: "addMaybe (Just 3) (Just 4)", expected: "Just 7" },
        { expr: "addMaybe Nothing (Just 4)", expected: "Nothing" },
        { expr: "addMaybe (Just 3) Nothing", expected: "Nothing" },
        { expr: "addMaybe (Nothing :: Maybe Int) (Nothing :: Maybe Int)", expected: "Nothing" },
      ],
      hint: "`addMaybe (Just a) (Just b) = Just (a + b)`; anything else `Nothing`.",
      solution: hs`addMaybe :: Maybe Int -> Maybe Int -> Maybe Int
addMaybe (Just a) (Just b) = Just (a + b)
addMaybe _ _               = Nothing
`,
    },
    {
      k: "write",
      body: md(
        "Write `simplAnd`, which applies these rules **at the root only**: `True /\\ e` and `e /\\ True` become `e`; `False /\\ e` and `e /\\ False` become `False`. Any other formula is unchanged.",
        "",
        ...form6Shown,
      ),
      setup: form6,
      starter: hs`simplAnd :: Form -> Form
simplAnd f = undefined
`,
      tests: [
        { expr: 'simplAnd (FAnd (FBool True) (FVar "x"))', expected: 'FVar "x"' },
        { expr: 'simplAnd (FAnd (FVar "x") (FBool True))', expected: 'FVar "x"' },
        { expr: 'simplAnd (FAnd (FBool False) (FVar "x"))', expected: "FBool False" },
        { expr: 'simplAnd (FAnd (FVar "x") (FVar "y"))', expected: 'FAnd (FVar "x") (FVar "y")' },
        { expr: "simplAnd (FBool True)", expected: "FBool True" },
      ],
      hint: "Four nested patterns for the `FAnd` cases, then a catch-all. Put the `FBool False` equations where they cannot be shadowed by a `True` equation you don't have — there is no overlap if you match `FBool True` and `FBool False` separately.",
      solution: hs`simplAnd :: Form -> Form
simplAnd (FAnd (FBool True) e)  = e
simplAnd (FAnd e (FBool True))  = e
simplAnd (FAnd (FBool False) _) = FBool False
simplAnd (FAnd _ (FBool False)) = FBool False
simplAnd f                      = f
`,
    },
    {
      k: "write",
      body: md(
        "Write `pushNot`, one De Morgan step at the root: `not (a /\\ b)` becomes `(not a) \\/ (not b)`, and `not (a \\/ b)` becomes `(not a) /\\ (not b)`. Other formulas are unchanged (do not recurse).",
        "",
        ...form6Shown,
      ),
      setup: form6,
      starter: hs`pushNot :: Form -> Form
pushNot f = undefined
`,
      tests: [
        { expr: 'pushNot (FNot (FAnd (FVar "a") (FVar "b")))', expected: 'FOr (FNot (FVar "a")) (FNot (FVar "b"))' },
        { expr: 'pushNot (FNot (FOr (FVar "a") (FVar "b")))', expected: 'FAnd (FNot (FVar "a")) (FNot (FVar "b"))' },
        { expr: 'pushNot (FNot (FVar "a"))', expected: 'FNot (FVar "a")' },
        { expr: "pushNot (FBool True)", expected: "FBool True" },
      ],
      hint: "Two nested patterns, then a catch-all.",
      solution: hs`pushNot :: Form -> Form
pushNot (FNot (FAnd a b)) = FOr (FNot a) (FNot b)
pushNot (FNot (FOr a b))  = FAnd (FNot a) (FNot b)
pushNot f                 = f
`,
    },
    {
      k: "write",
      body: md(
        "Write `dropAllNotNot`, which removes **every** double negation in a formula, anywhere, by rewriting the children first and then the node.",
        "",
        ...form6Shown,
      ),
      setup: form6,
      starter: hs`dropAllNotNot :: Form -> Form
dropAllNotNot f = undefined
`,
      tests: [
        { expr: "dropAllNotNot f1", expected: 'FAnd (FVar "a") (FVar "b")' },
        { expr: 'dropAllNotNot (FNot (FNot (FNot (FVar "a"))))', expected: 'FNot (FVar "a")' },
        { expr: "dropAllNotNot (FBool True)", expected: "FBool True" },
        { expr: 'dropAllNotNot (FOr (FNot (FNot (FVar "x"))) (FVar "y"))', expected: 'FOr (FVar "x") (FVar "y")' },
      ],
      hint: "Recurse on children, then match `FNot (FNot e)` on the rebuilt node. Nested triple-not becomes a single not because you rewrite the inside first.",
      solution: hs`dropAllNotNot :: Form -> Form
dropAllNotNot (FNot f) =
  case dropAllNotNot f of
    FNot e -> e
    f'     -> FNot f'
dropAllNotNot (FAnd a b) = FAnd (dropAllNotNot a) (dropAllNotNot b)
dropAllNotNot (FOr a b)  = FOr (dropAllNotNot a) (dropAllNotNot b)
dropAllNotNot f          = f
`,
    },
    {
      k: "write",
      body: md("Write `substF v new f`, which replaces every `FVar v` by the formula `new`.", "", ...form6Shown),
      setup: form6,
      starter: hs`substF :: String -> Form -> Form -> Form
substF v new f = undefined
`,
      tests: [
        { expr: 'substF "b" (FBool True) f1', expected: "FAnd (FVar \"a\") (FNot (FNot (FBool True)))" },
        { expr: 'substF "z" (FBool True) f1', expected: "f1" },
        { expr: 'substF "x" (FVar "y") f2', expected: "FOr (FBool False) (FAnd (FBool True) (FVar \"y\"))" },
        { expr: 'substF "a" (FVar "a") (FVar "a")', expected: 'FVar "a"' },
      ],
      hint: "`FVar w` becomes `new` when `w == v`. Rebuild `FNot`/`FAnd`/`FOr` from the substituted children.",
      solution: hs`substF :: String -> Form -> Form -> Form
substF v new (FVar w)
  | w == v = new
substF v new (FNot f)   = FNot (substF v new f)
substF v new (FAnd a b) = FAnd (substF v new a) (substF v new b)
substF v new (FOr a b)  = FOr (substF v new a) (substF v new b)
substF _ _ f            = f
`,
    },
    {
      k: "write",
      body: "Write `allJust`, which turns a list of `Maybe` values into `Just` of the unwrapped list if every element is `Just`, and `Nothing` if any element is `Nothing`.",
      starter: hs`allJust :: [Maybe a] -> Maybe [a]
allJust xs = undefined
`,
      tests: [
        { expr: "allJust [Just 1, Just 2]", expected: "Just [1, 2]" },
        { expr: "allJust [Just 1, Nothing]", expected: "Nothing" },
        { expr: "allJust ([] :: [Maybe Int])", expected: "Just []" },
        { expr: "allJust ([Nothing] :: [Maybe Int])", expected: "Nothing" },
      ],
      hint: "`allJust [] = Just []`. For `Just x : xs`, map `x :` over the recursive result. For `Nothing : _` return `Nothing`.",
      solution: hs`allJust :: [Maybe a] -> Maybe [a]
allJust []            = Just []
allJust (Nothing : _) = Nothing
allJust (Just x : xs) =
  case allJust xs of
    Just ys -> Just (x : ys)
    Nothing -> Nothing
`,
    },
    {
      k: "write",
      body: md(
        "Questions 23-30 use this expression language. Evaluating a variable that is not in the environment **fails** (`Nothing`).",
        "",
        ...expr6Shown,
        "",
        "Define a function `evalE :: Env -> Expr -> Maybe Int` that evaluates an expression. For example:",
        "",
        "```",
        "*Main> evalE env1 e1",
        "Just 17",
        "*Main> evalE [] (Add (Num 1) (Num 4))",
        "Just 5",
        "*Main> evalE env1 (Var \"z\")",
        "Nothing",
        "```",
      ),
      setup: expr6,
      starter: hs`evalE :: Env -> Expr -> Maybe Int
evalE env e = undefined
`,
      tests: [
        { expr: "evalE env1 e1", expected: "Just 17" },
        { expr: "evalE [] (Add (Num 1) (Num 4))", expected: "Just 5" },
        { expr: 'evalE env1 (Var "z")', expected: "Nothing" },
        { expr: "evalE [] e2", expected: "Just 0" },
        { expr: 'evalE [("x", 0)] (Mul (Var "x") (Var "y"))', expected: "Nothing", label: "missing y fails even if multiplied" },
      ],
      hint: "`Num n` is `Just n`. `Var v` is `lookup v env`. For `Add`/`Mul`, evaluate both sides and combine only if both succeeded.",
      solution: hs`evalE :: Env -> Expr -> Maybe Int
evalE _ (Num n) = Just n
evalE env (Var v) = lookup v env
evalE env (Add a b) =
  case (evalE env a, evalE env b) of
    (Just x, Just y) -> Just (x + y)
    _                -> Nothing
evalE env (Mul a b) =
  case (evalE env a, evalE env b) of
    (Just x, Just y) -> Just (x * y)
    _                -> Nothing
`,
    },
    {
      k: "write",
      body: md(
        ...expr6Shown,
        "",
        "Define a function `varsE :: Expr -> [String]` that lists the variable names in an expression, each once, in the order they first appear left to right. (`nub` is imported.) For example:",
        "",
        "```",
        "*Main> varsE e1",
        '["x","y"]',
        "*Main> varsE e2",
        "[]",
        "```",
      ),
      setup: expr6,
      starter: hs`varsE :: Expr -> [String]
varsE e = undefined
`,
      tests: [
        { expr: "varsE e1", expected: '["x", "y"]' },
        { expr: "varsE e2", expected: "[]" },
        { expr: 'varsE (Mul (Var "y") (Add (Var "x") (Var "y")))', expected: '["y", "x"]' },
        { expr: 'varsE (Var "z")', expected: '["z"]' },
        { expr: "varsE (Num 4)", expected: "[]" },
      ],
      hint: "Collect every variable (duplicates and all) with a helper, then `nub`.",
      solution: hs`varsE :: Expr -> [String]
varsE e = nub (go e)
  where
    go (Num _)   = []
    go (Var v)   = [v]
    go (Add a b) = go a ++ go b
    go (Mul a b) = go a ++ go b
`,
    },
    {
      k: "write",
      body: md(
        ...expr6Shown,
        "",
        "Define a function `substE :: String -> Expr -> Expr -> Expr` such that `substE v new e` replaces every `Var v` in `e` by `new`. For example:",
        "",
        "```",
        '*Main> substE "y" (Num 4) e1',
        "Add (Var \"x\") (Mul (Num 3) (Num 4))",
        '*Main> substE "z" (Num 4) e1 == e1',
        "True",
        "```",
      ),
      setup: expr6,
      starter: hs`substE :: String -> Expr -> Expr -> Expr
substE v new e = undefined
`,
      tests: [
        { expr: 'substE "y" (Num 4) e1', expected: 'Add (Var "x") (Mul (Num 3) (Num 4))' },
        { expr: 'substE "z" (Num 4) e1', expected: "e1" },
        { expr: 'substE "x" (Var "y") e1', expected: 'Add (Var "y") (Mul (Num 3) (Var "y"))' },
        { expr: 'substE "a" (Add (Num 1) (Num 1)) (Mul (Var "a") (Var "a"))', expected: "Mul (Add (Num 1) (Num 1)) (Add (Num 1) (Num 1))" },
        { expr: 'substE "x" (Num 0) (Num 5)', expected: "Num 5" },
      ],
      hint: "Only `Var w` can change. Rebuild `Add` and `Mul` from the substituted children.",
      solution: hs`substE :: String -> Expr -> Expr -> Expr
substE v new (Var w)
  | w == v = new
substE v new (Add a b) = Add (substE v new a) (substE v new b)
substE v new (Mul a b) = Mul (substE v new a) (substE v new b)
substE _ _ e           = e
`,
    },
    {
      k: "write",
      body: md(
        ...expr6Shown,
        "",
        "Define a function `foldConst :: Expr -> Expr` that, **at the root only**, replaces `Add (Num a) (Num b)` by `Num (a + b)` and `Mul (Num a) (Num b)` by `Num (a * b)`. Any other expression is unchanged. For example:",
        "",
        "```",
        "*Main> foldConst (Add (Num 1) (Num 2))",
        "Num 3",
        "*Main> foldConst e2",
        "e2",
        "```",
      ),
      setup: expr6,
      starter: hs`foldConst :: Expr -> Expr
foldConst e = undefined
`,
      tests: [
        { expr: "foldConst (Add (Num 1) (Num 2))", expected: "Num 3" },
        { expr: "foldConst (Mul (Num 3) (Num 4))", expected: "Num 12" },
        { expr: "foldConst e2", expected: "e2" },
        { expr: 'foldConst (Add (Num 1) (Var "x"))', expected: 'Add (Num 1) (Var "x")' },
        { expr: "foldConst (Num 7)", expected: "Num 7" },
      ],
      hint: "Two nested patterns, then a catch-all. Do not recurse: `e2`'s inner `Add` is not at the root.",
      solution: hs`foldConst :: Expr -> Expr
foldConst (Add (Num a) (Num b)) = Num (a + b)
foldConst (Mul (Num a) (Num b)) = Num (a * b)
foldConst e                     = e
`,
    },
    {
      k: "write",
      body: md(
        ...expr6Shown,
        "",
        "Define a function `simplE :: Expr -> Expr` that simplifies **bottom-up** with these rules, applied to a node after its children have been simplified:",
        "",
        "- `Add (Num a) (Num b)` becomes `Num (a + b)`, and likewise `Mul` of two numbers.",
        "- `Mul (Num 0) e` and `Mul e (Num 0)` become `Num 0`.",
        "- `Mul (Num 1) e` and `Mul e (Num 1)` become `e`.",
        "- `Add (Num 0) e` and `Add e (Num 0)` become `e`.",
        "",
        "For example:",
        "",
        "```",
        "*Main> simplE e2",
        "Num 0",
        "*Main> simplE (Add (Var \"x\") (Num 0))",
        "Var \"x\"",
        "```",
      ),
      setup: expr6,
      starter: hs`simplE :: Expr -> Expr
simplE e = undefined
`,
      tests: [
        { expr: "simplE e2", expected: "Num 0" },
        { expr: 'simplE (Add (Var "x") (Num 0))', expected: 'Var "x"' },
        { expr: 'simplE (Mul (Num 1) (Var "x"))', expected: 'Var "x"' },
        { expr: "simplE (Add (Num 2) (Num 3))", expected: "Num 5" },
        { expr: 'simplE (Mul (Add (Num 2) (Num (-2))) (Var "x"))', expected: "Num 0" },
        { expr: 'simplE e1', expected: "e1" },
      ],
      hint: "Recurse on both children first, then a `case` on the rebuilt node with the rules (zeros and ones, then two constants, then catch-all).",
      solution: hs`simplE :: Expr -> Expr
simplE e = case e of
  Add a b -> rule (Add (simplE a) (simplE b))
  Mul a b -> rule (Mul (simplE a) (simplE b))
  _       -> e
  where
    rule (Add (Num 0) e') = e'
    rule (Add e' (Num 0)) = e'
    rule (Add (Num a) (Num b)) = Num (a + b)
    rule (Mul (Num 0) _) = Num 0
    rule (Mul _ (Num 0)) = Num 0
    rule (Mul (Num 1) e') = e'
    rule (Mul e' (Num 1)) = e'
    rule (Mul (Num a) (Num b)) = Num (a * b)
    rule e' = e'
`,
    },
    {
      k: "write",
      body: md(
        ...expr6Shown,
        "",
        "Define a function `showE :: Expr -> String` that prints an expression with every `Add` and `Mul` in brackets and no spaces:",
        "",
        "```",
        '*Main> showE e1',
        '"(x+(3*y))"',
        "*Main> showE (Num (-1))",
        '"-1"',
        "```",
      ),
      setup: expr6,
      starter: hs`showE :: Expr -> String
showE e = undefined
`,
      tests: [
        { expr: "showE e1", expected: '"(x+(3*y))"' },
        { expr: "showE (Num (-1))", expected: '"-1"' },
        { expr: "showE e2", expected: '"((1+2)*0)"' },
        { expr: 'showE (Var "abc")', expected: '"abc"' },
        { expr: "showE (Num 0)", expected: '"0"' },
      ],
      hint: "`showE (Num n) = show n`, `showE (Var v) = v`, and operators wrap with `\"(\" ++ ... ++ \"+\" ++ ... ++ \")\"`.",
      solution: hs`showE :: Expr -> String
showE (Num n)   = show n
showE (Var v)   = v
showE (Add a b) = "(" ++ showE a ++ "+" ++ showE b ++ ")"
showE (Mul a b) = "(" ++ showE a ++ "*" ++ showE b ++ ")"
`,
    },
    {
      k: "write",
      body: md(
        ...expr6Shown,
        "",
        "Define a function `unbound :: Env -> Expr -> [String]` that lists the variables of an expression that do **not** have a value in the environment, each once, in first-appearance order. For example:",
        "",
        "```",
        "*Main> unbound env1 e1",
        "[]",
        '*Main> unbound env1 (Add (Var "z") (Var "x"))',
        '["z"]',
        "```",
      ),
      setup: expr6,
      starter: hs`unbound :: Env -> Expr -> [String]
unbound env e = undefined
`,
      tests: [
        { expr: "unbound env1 e1", expected: "[]" },
        { expr: 'unbound env1 (Add (Var "z") (Var "x"))', expected: '["z"]' },
        { expr: 'unbound [] e1', expected: '["x", "y"]' },
        { expr: 'unbound env1 (Var "z")', expected: '["z"]' },
        { expr: "unbound env1 e2", expected: "[]" },
        { expr: 'unbound [("x", 1)] (Add (Var "y") (Var "y"))', expected: '["y"]' },
      ],
      hint: "Collect variables left to right, drop those that `lookup` finds, then `nub` — or `nub` first and then filter.",
      solution: hs`unbound :: Env -> Expr -> [String]
unbound env e = nub [v | v <- go e, isNothing (lookup v env)]
  where
    go (Num _)   = []
    go (Var v)   = [v]
    go (Add a b) = go a ++ go b
    go (Mul a b) = go a ++ go b
`,
    },
    {
      k: "write",
      body: md(
        ...expr6Shown,
        "",
        "Define a function `isGround :: Expr -> Bool` that is `True` when an expression contains **no variables**. For example:",
        "",
        "```",
        "*Main> isGround e2",
        "True",
        "*Main> isGround e1",
        "False",
        "```",
      ),
      setup: expr6,
      starter: hs`isGround :: Expr -> Bool
isGround e = undefined
`,
      tests: [
        { expr: "isGround e2", expected: "True" },
        { expr: "isGround e1", expected: "False" },
        { expr: "isGround (Num 0)", expected: "True" },
        { expr: 'isGround (Var "x")', expected: "False" },
        { expr: 'isGround (Add (Num 1) (Var "x"))', expected: "False" },
      ],
      hint: "`Num` is `True`, `Var` is `False`, `Add`/`Mul` are grounded when both children are.",
      solution: hs`isGround :: Expr -> Bool
isGround (Num _)   = True
isGround (Var _)   = False
isGround (Add a b) = isGround a && isGround b
isGround (Mul a b) = isGround a && isGround b
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Mixed exercise 7: + sets, sorting, grouping
// ---------------------------------------------------------------------------

const scores7 = hs`import Data.List (nub, sort, group, sortOn)

type Student = String
type Module  = String
type Mark    = Int
type Score   = (Student, Module, Mark)

work :: [Score]
work
  = [ ("Ann",  "FP", 72)
    , ("Ben",  "FP", 45)
    , ("Ann",  "DB", 88)
    , ("Cara", "FP", 90)
    , ("Ben",  "DB", 51)
    , ("Ann",  "AI", 64)
    , ("Cara", "AI", 40)
    ]
`;

const scores7Shown = [
  "```",
  "type Score = (String, String, Int)    -- student, module, mark",
  "",
  "work =",
  "  [ (\"Ann\",  \"FP\", 72), (\"Ben\",  \"FP\", 45), (\"Ann\", \"DB\", 88),",
  "    (\"Cara\", \"FP\", 90), (\"Ben\",  \"DB\", 51), (\"Ann\", \"AI\", 64),",
  "    (\"Cara\", \"AI\", 40) ]",
  "```",
  "",
  "A mark of 50 or more is a **pass**.",
];

const mixed07: DrillSet = {
  id: "mixed-07",
  lesson: "",
  title: "Mixed exercise 7",
  intro: md(
    "Everything so far, plus **lists as sets**, **sorting** and **grouping**.",
    "",
    "Exams almost never use a special set type. They use plain lists and say \"without duplicates\" or \"the order does not matter\". `nub`, `union`, `intersect`, `\\\\`, `sort`, `group` and `sortOn` (all from `Data.List`) are the tools. `group` only joins *neighbouring* equals, so sort first if you want every copy of a value together.",
    "",
    "The last eight questions are exam-style: a table of exam marks to group, rank and average.",
  ),
  drills: [
    {
      k: "predict",
      expr: "nub [3, 1, 3, 2, 1]",
      answer: "[3, 1, 2]",
      why: "`nub` keeps the first copy of each element and drops later ones, so the remaining order is first-seen: 3, then 1, then 2.",
    },
    {
      k: "quiz",
      q: "What is `[1, 2, 2, 3] \\\\ [2, 2, 5]`?",
      options: ["`[1, 3]`", "`[1, 2, 3]`", "`[1, 3, 5]`", "An error, because 5 is not in the first list"],
      answer: 0,
      why: "Each 2 in the second list removes one 2 from the first. Removing 5 does nothing. No error.",
    },
    {
      k: "write",
      body: "Write `isSet`, which is `True` when a list has no duplicate elements.",
      setup: hs`import Data.List (nub)
`,
      starter: hs`isSet :: Eq a => [a] -> Bool
isSet xs = undefined
`,
      tests: [
        { expr: "isSet [1, 2, 3]", expected: "True" },
        { expr: "isSet [1, 2, 1]", expected: "False" },
        { expr: "isSet ([] :: [Int])", expected: "True" },
        { expr: 'isSet "abba"', expected: "False" },
      ],
      hint: "`isSet xs = nub xs == xs`. `nub` keeps the first of each, so any later duplicate makes the lists differ.",
      solution: hs`isSet :: Eq a => [a] -> Bool
isSet xs = nub xs == xs
`,
    },
    {
      k: "write",
      body: "Write `unionKeep xs ys`: the elements of `xs` in order, then every element of `ys` that is not already in `xs`.",
      starter: hs`unionKeep :: Eq a => [a] -> [a] -> [a]
unionKeep xs ys = undefined
`,
      tests: [
        { expr: "unionKeep [1, 2] [2, 3, 1]", expected: "[1, 2, 3]" },
        { expr: "unionKeep ([] :: [Int]) [1, 1]", expected: "[1, 1]" },
        { expr: 'unionKeep "ab" ""', expected: '"ab"' },
        { expr: "unionKeep [1, 1] [1]", expected: "[1, 1]" },
      ],
      hint: "`xs ++ [y | y <- ys, notElem y xs]`. Duplicates already in `xs` stay; `union` from `Data.List` does the same.",
      solution: hs`unionKeep :: Eq a => [a] -> [a] -> [a]
unionKeep xs ys = xs ++ [y | y <- ys, notElem y xs]
`,
    },
    {
      k: "predict",
      expr: 'group (sort "abba")',
      answer: '["aa", "bb"]',
      why: "`sort` makes `\"aabb\"`, then `group` splits into runs of equal neighbours: two a's, two b's.",
    },
    {
      k: "write",
      body: md("Write `frequencies`, which pairs each distinct element with how often it occurs, sorted by the element:", "", "```", 'frequencies "abba"  ==  [(\'a\', 2), (\'b\', 2)]', "```"),
      setup: hs`import Data.List (sort, group)
`,
      starter: hs`frequencies :: Ord a => [a] -> [(a, Int)]
frequencies xs = undefined
`,
      tests: [
        { expr: 'frequencies "abba"', expected: "[('a', 2), ('b', 2)]" },
        { expr: "frequencies ([] :: [Int])", expected: "[]" },
        { expr: "frequencies [7]", expected: "[(7, 1)]" },
        { expr: 'frequencies "mississippi"', expected: "[('i', 4), ('m', 1), ('p', 2), ('s', 4)]" },
      ],
      hint: "`[(head g, length g) | g <- group (sort xs)]`.",
      solution: hs`frequencies :: Ord a => [a] -> [(a, Int)]
frequencies xs = [(head g, length g) | g <- group (sort xs)]
`,
    },
    {
      k: "write",
      body: "Write `sortOnLength`, which sorts a list of lists by length, shortest first. Equal lengths keep their original relative order.",
      setup: hs`import Data.List (sortOn)
`,
      starter: hs`sortOnLength :: [[a]] -> [[a]]
sortOnLength xss = undefined
`,
      tests: [
        { expr: 'sortOnLength ["ccc", "a", "bb"]', expected: '["a", "bb", "ccc"]' },
        { expr: "sortOnLength ([] :: [String])", expected: "[]" },
        { expr: 'sortOnLength ["ab", "cd"]', expected: '["ab", "cd"]', label: "stable: equal lengths keep order" },
        { expr: "sortOnLength [[], [1, 2], [3]]", expected: "[[], [3], [1, 2]]" },
      ],
      hint: "`sortOn length xss`. `sortOn` is stable.",
      solution: hs`sortOnLength :: [[a]] -> [[a]]
sortOnLength xss = sortOn length xss
`,
    },
    {
      k: "quiz",
      q: "Why does `group \"mississippi\"` not put all four `s`s in one run?",
      options: [
        "`group` only joins equal elements that are already next to each other",
        "`group` groups by length, not by value",
        "It does: `group` always collects every copy",
        "`group` needs `Ord` and `Char` is not ordered",
      ],
      answer: 0,
      why: "`group` walks the list once and breaks a run as soon as the next element differs. Sort first if you want every copy together.",
    },
    {
      k: "write",
      body: "Write `intersectKeep xs ys`: the elements of `xs` (in `xs` order, duplicates kept if they also sit in `ys`) that occur at least once in `ys`.",
      starter: hs`intersectKeep :: Eq a => [a] -> [a] -> [a]
intersectKeep xs ys = undefined
`,
      tests: [
        { expr: "intersectKeep [1, 2, 3, 2] [2, 4]", expected: "[2, 2]" },
        { expr: "intersectKeep [1, 2] ([] :: [Int])", expected: "[]" },
        { expr: 'intersectKeep "" "abc"', expected: '""' },
        { expr: "intersectKeep [1, 1, 1] [1]", expected: "[1, 1, 1]" },
      ],
      hint: "`[x | x <- xs, elem x ys]`.",
      solution: hs`intersectKeep :: Eq a => [a] -> [a] -> [a]
intersectKeep xs ys = [x | x <- xs, elem x ys]
`,
    },
    {
      k: "write",
      body: "Write `insertSorted x xs`, which inserts `x` into a list that is already sorted ascending, so the result is still sorted. Equal elements: put `x` **after** existing equals.",
      starter: hs`insertSorted :: Ord a => a -> [a] -> [a]
insertSorted x xs = undefined
`,
      tests: [
        { expr: "insertSorted 3 [1, 2, 5]", expected: "[1, 2, 3, 5]" },
        { expr: "insertSorted 1 ([] :: [Int])", expected: "[1]" },
        { expr: "insertSorted 2 [2, 2, 4]", expected: "[2, 2, 2, 4]", label: "goes after equals" },
        { expr: "insertSorted 9 [1, 2]", expected: "[1, 2, 9]" },
      ],
      hint: "If `xs` is empty, `[x]`. If `x < head`, it goes in front; otherwise keep the head and insert into the tail. Use `<` not `<=` so equals go after.",
      solution: hs`insertSorted :: Ord a => a -> [a] -> [a]
insertSorted x [] = [x]
insertSorted x (y : ys)
  | x < y     = x : y : ys
  | otherwise = y : insertSorted x ys
`,
    },
    {
      k: "predict",
      expr: 'sortOn length ["ccc", "a", "bb"]',
      answer: '["a", "bb", "ccc"]',
      why: "`sortOn length` orders by the key `length`, shortest first. `\"a\"` has length 1, `\"bb\"` 2, `\"ccc\"` 3.",
    },
    {
      k: "write",
      body: "Write `mergeSorted`, which merges two **already sorted** ascending lists into one sorted list. You may assume each input is sorted.",
      starter: hs`mergeSorted :: Ord a => [a] -> [a] -> [a]
mergeSorted xs ys = undefined
`,
      tests: [
        { expr: "mergeSorted [1, 3, 5] [2, 4]", expected: "[1, 2, 3, 4, 5]" },
        { expr: "mergeSorted ([] :: [Int]) [1, 2]", expected: "[1, 2]" },
        { expr: "mergeSorted [1, 2] []", expected: "[1, 2]" },
        { expr: "mergeSorted [1, 1] [1, 2]", expected: "[1, 1, 1, 2]" },
      ],
      hint: "If either list is empty, the answer is the other. Otherwise take the smaller head and recurse. On a tie, taking the left head first is fine.",
      solution: hs`mergeSorted :: Ord a => [a] -> [a] -> [a]
mergeSorted [] ys = ys
mergeSorted xs [] = xs
mergeSorted (x : xs) (y : ys)
  | x <= y    = x : mergeSorted xs (y : ys)
  | otherwise = y : mergeSorted (x : xs) ys
`,
    },
    {
      k: "write",
      body: "Write `anagrams a b`, which is `True` when `a` and `b` contain the same characters with the same counts (order ignored).",
      setup: hs`import Data.List (sort)
`,
      starter: hs`anagrams :: Ord a => [a] -> [a] -> Bool
anagrams a b = undefined
`,
      tests: [
        { expr: 'anagrams "listen" "silent"', expected: "True" },
        { expr: 'anagrams "ab" "a"', expected: "False" },
        { expr: "anagrams ([] :: [Int]) []", expected: "True" },
        { expr: 'anagrams "aab" "aba"', expected: "True" },
        { expr: 'anagrams "aab" "abb"', expected: "False" },
      ],
      hint: "`sort a == sort b`.",
      solution: hs`anagrams :: Ord a => [a] -> [a] -> Bool
anagrams a b = sort a == sort b
`,
    },
    {
      k: "quiz",
      q: "You have two sorted lists and want one sorted list of everything in either. Which is the right tool?",
      options: [
        "`xs ++ ys`, then hope",
        "`mergeSorted xs ys` (or `merge`)",
        "`union xs ys`, which always keeps sort order even if the inputs were unsorted",
        "`nub (xs ++ ys)`",
      ],
      answer: 1,
      why: "Merging two sorted lists is linear and keeps order. `++` does not sort; `union` is about duplicates, not order; `nub` after `++` still is not sorted.",
    },
    {
      k: "write",
      body: "Write `topN n xs`, the `n` largest elements of `xs`, **largest first**. If `xs` is shorter than `n`, return all of them, still largest first. You may assume `n >= 0`.",
      setup: hs`import Data.List (sort)
`,
      starter: hs`topN :: Ord a => Int -> [a] -> [a]
topN n xs = undefined
`,
      tests: [
        { expr: "topN 2 [3, 1, 4, 1, 5]", expected: "[5, 4]" },
        { expr: "topN 0 [1, 2]", expected: "[]" },
        { expr: "topN 5 [2, 1]", expected: "[2, 1]" },
        { expr: "topN 3 ([] :: [Int])", expected: "[]" },
      ],
      hint: "`take n (reverse (sort xs))`.",
      solution: hs`topN :: Ord a => Int -> [a] -> [a]
topN n xs = take n (reverse (sort xs))
`,
    },
    {
      k: "write",
      body: "Write `runs`, which splits a list into maximal runs of equal neighbouring elements (this is `group`).",
      setup: hs`import Data.List (group)
`,
      starter: hs`runs :: Eq a => [a] -> [[a]]
runs xs = undefined
`,
      tests: [
        { expr: "runs [1, 1, 2, 2, 2, 1]", expected: "[[1, 1], [2, 2, 2], [1]]" },
        { expr: "runs ([] :: [Int])", expected: "[]" },
        { expr: 'runs "aaa"', expected: '["aaa"]' },
        { expr: "runs [7]", expected: "[[7]]" },
      ],
      hint: "`runs = group`. Or recurse: take the prefix of equals with `span (== x)`, then recurse on the rest.",
      solution: hs`runs :: Eq a => [a] -> [[a]]
runs xs = group xs
`,
    },
    {
      k: "write",
      body: "Write `mode xs`, the element that occurs most often. If several are tied, pick the **smallest** (you may assume `xs` is non-empty).",
      setup: hs`import Data.List (sort, group)
`,
      starter: hs`mode :: Ord a => [a] -> a
mode xs = undefined
`,
      tests: [
        { expr: 'mode "abbaa"', expected: "'a'" },
        { expr: "mode [2, 1, 2, 1]", expected: "1", label: "tie: smallest wins" },
        { expr: "mode [7]", expected: "7" },
        { expr: 'mode "xyzzy"', expected: "'y'" },
      ],
      hint: "Build frequencies via `group (sort xs)`, then pick the pair with the greatest count; on a count tie the smaller key is first in the sorted groups if you only replace on a *strictly* greater count.",
      solution: hs`mode :: Ord a => [a] -> a
mode xs = fst (foldl1 pick freqs)
  where
    freqs = [(head g, length g) | g <- group (sort xs)]
    pick acc@(_, na) q@(_, nq)
      | nq > na   = q
      | otherwise = acc
`,
    },
    {
      k: "write",
      body: "Write `difference xs ys`: `xs` with, for each element of `ys`, one matching copy removed from `xs` (the first copy). This is list difference `\\\\`.",
      setup: hs`import Data.List ((\\))
`,
      starter: hs`difference :: Eq a => [a] -> [a] -> [a]
difference xs ys = undefined
`,
      tests: [
        { expr: "difference [1, 2, 3, 2] [2]", expected: "[1, 3, 2]" },
        { expr: "difference [1, 2] ([] :: [Int])", expected: "[1, 2]" },
        { expr: "difference ([] :: [Int]) [1]", expected: "[]" },
        { expr: 'difference "abba" "ab"', expected: '"ba"' },
      ],
      hint: "`difference xs ys = xs \\\\ ys`.",
      solution: hs`difference :: Eq a => [a] -> [a] -> [a]
difference xs ys = xs \\ ys
`,
    },
    {
      k: "write",
      body: "Write `isSorted`, which is `True` when each element is `<=` the next (empty and singleton lists are sorted).",
      starter: hs`isSorted :: Ord a => [a] -> Bool
isSorted xs = undefined
`,
      tests: [
        { expr: "isSorted [1, 2, 2, 5]", expected: "True" },
        { expr: "isSorted [1, 3, 2]", expected: "False" },
        { expr: "isSorted ([] :: [Int])", expected: "True" },
        { expr: "isSorted [7]", expected: "True" },
      ],
      hint: "`and (zipWith (<=) xs (drop 1 xs))`.",
      solution: hs`isSorted :: Ord a => [a] -> Bool
isSorted xs = and (zipWith (<=) xs (drop 1 xs))
`,
    },
    {
      k: "write",
      body: md("Write `evensFirst`, which lists the even numbers of `xs` (in order) followed by the odds (in order):", "", "```", "evensFirst [1, 2, 3, 4, 5]  ==  [2, 4, 1, 3, 5]", "```"),
      starter: hs`evensFirst :: [Int] -> [Int]
evensFirst xs = undefined
`,
      tests: [
        { expr: "evensFirst [1, 2, 3, 4, 5]", expected: "[2, 4, 1, 3, 5]" },
        { expr: "evensFirst []", expected: "[]" },
        { expr: "evensFirst [1, 3]", expected: "[1, 3]" },
        { expr: "evensFirst [2, 4]", expected: "[2, 4]" },
      ],
      hint: "`filter even xs ++ filter odd xs`.",
      solution: hs`evensFirst :: [Int] -> [Int]
evensFirst xs = filter even xs ++ filter odd xs
`,
    },
    {
      k: "write",
      body: "Write `uniqueSorted xs`: the distinct elements of `xs` in ascending order.",
      setup: hs`import Data.List (nub, sort)
`,
      starter: hs`uniqueSorted :: Ord a => [a] -> [a]
uniqueSorted xs = undefined
`,
      tests: [
        { expr: "uniqueSorted [3, 1, 3, 2, 1]", expected: "[1, 2, 3]" },
        { expr: "uniqueSorted ([] :: [Int])", expected: "[]" },
        { expr: 'uniqueSorted "bca"', expected: '"abc"' },
        { expr: "uniqueSorted [5, 5, 5]", expected: "[5]" },
      ],
      hint: "`nub (sort xs)`, or `map head (group (sort xs))`.",
      solution: hs`uniqueSorted :: Ord a => [a] -> [a]
uniqueSorted xs = nub (sort xs)
`,
    },
    {
      k: "write",
      body: md("Write `byInitial`, which groups **non-empty** words by their first character. Each group is `(firstChar, wordsWithThatInitial)` and groups appear in alphabetical order of the character. Words inside a group keep sorted-word order (`sort` the input first)."),
      setup: hs`import Data.List (sort, groupBy)
`,
      starter: hs`byInitial :: [String] -> [(Char, [String])]
byInitial ws = undefined
`,
      tests: [
        { expr: 'byInitial ["cat", "car", "dog", "cow"]', expected: "[('c', [\"car\", \"cat\", \"cow\"]), ('d', [\"dog\"])]" },
        { expr: "byInitial []", expected: "[]" },
        { expr: 'byInitial ["zoo"]', expected: "[('z', [\"zoo\"])]" },
        { expr: 'byInitial ["b", "a", "aa"]', expected: "[('a', [\"a\", \"aa\"]), ('b', [\"b\"])]" },
      ],
      hint: "Drop empty strings, `sort`, then `groupBy` on `head`. Each group `g` becomes `(head (head g), g)`.",
      solution: hs`byInitial :: [String] -> [(Char, [String])]
byInitial ws = [(head (head g), g) | g <- groupBy same (sort [w | w <- ws, not (null w)])]
  where
    same a b = head a == head b
`,
    },
    {
      k: "write",
      body: md(
        "Questions 23-30 use this table of exam marks.",
        "",
        ...scores7Shown,
        "",
        "Define a function `roster :: [Score] -> [Student]` that lists each student once, in the order they **first** appear. For example:",
        "",
        "```",
        "*Main> roster work",
        '["Ann","Ben","Cara"]',
        "```",
      ),
      setup: scores7,
      starter: hs`roster :: [Score] -> [Student]
roster scores = undefined
`,
      tests: [
        { expr: "roster work", expected: '["Ann", "Ben", "Cara"]' },
        { expr: "roster []", expected: "[]" },
        { expr: 'roster [("Zed", "FP", 1)]', expected: '["Zed"]' },
        { expr: 'roster [("A", "X", 1), ("A", "Y", 2), ("B", "X", 3)]', expected: '["A", "B"]' },
        { expr: "length (roster work)", expected: "3" },
      ],
      hint: "`nub [s | (s, _, _) <- scores]`.",
      solution: hs`roster :: [Score] -> [Student]
roster scores = nub [s | (s, _, _) <- scores]
`,
    },
    {
      k: "write",
      body: md(
        ...scores7Shown,
        "",
        "Define a function `marksOf :: Student -> [Score] -> [Mark]` that lists every mark for that student, in table order. For example:",
        "",
        "```",
        '*Main> marksOf "Ann" work',
        "[72,88,64]",
        "```",
      ),
      setup: scores7,
      starter: hs`marksOf :: Student -> [Score] -> [Mark]
marksOf student scores = undefined
`,
      tests: [
        { expr: 'marksOf "Ann" work', expected: "[72, 88, 64]" },
        { expr: 'marksOf "Ben" work', expected: "[45, 51]" },
        { expr: 'marksOf "Dee" work', expected: "[]" },
        { expr: 'marksOf "Ann" []', expected: "[]" },
        { expr: 'marksOf "Cara" work', expected: "[90, 40]" },
      ],
      hint: "`[m | (s, _, m) <- scores, s == student]`.",
      solution: hs`marksOf :: Student -> [Score] -> [Mark]
marksOf student scores = [m | (s, _, m) <- scores, s == student]
`,
    },
    {
      k: "write",
      body: md(
        ...scores7Shown,
        "",
        "Define a function `passed :: [Score] -> [Score]` that keeps the rows whose mark is at least 50, in table order. For example:",
        "",
        "```",
        "*Main> length (passed work)",
        "5",
        "```",
      ),
      setup: scores7,
      starter: hs`passed :: [Score] -> [Score]
passed scores = undefined
`,
      tests: [
        { expr: "length (passed work)", expected: "5" },
        { expr: "passed []", expected: "[]" },
        { expr: 'passed [("A", "X", 50)]', expected: '[("A", "X", 50)]' },
        { expr: 'passed [("A", "X", 49)]', expected: "[]" },
        { expr: '[m | (_, _, m) <- passed work]', expected: "[72, 88, 90, 51, 64]" },
      ],
      hint: "`[row | row@(_, _, m) <- scores, m >= 50]`.",
      solution: hs`passed :: [Score] -> [Score]
passed scores = [row | row@(_, _, m) <- scores, m >= 50]
`,
    },
    {
      k: "write",
      body: md(
        ...scores7Shown,
        "",
        "Define a function `averageOf :: Student -> [Score] -> Double` that is the mean of that student's marks. You may assume the student has at least one mark. For example:",
        "",
        "```",
        '*Main> averageOf "Ann" work',
        "74.666...     (72 + 88 + 64) / 3",
        "```",
      ),
      setup: scores7,
      starter: hs`averageOf :: Student -> [Score] -> Double
averageOf student scores = undefined
`,
      tests: [
        { expr: 'abs (averageOf "Ann" work - 224 / 3) < 1e-9', label: "Ann mean is 224/3" },
        { expr: 'averageOf "Ben" work', expected: "48.0" },
        { expr: 'averageOf "Cara" work', expected: "65.0" },
        { expr: 'averageOf "Ann" [("Ann", "Z", 100)]', expected: "100.0" },
        { expr: 'averageOf "Ben" work == 48', expected: "True" },
      ],
      hint: "Take `marksOf` as a local list (or inline the comprehension). Mean is `fromIntegral (sum ms) / fromIntegral (length ms)`.",
      solution: hs`averageOf :: Student -> [Score] -> Double
averageOf student scores = fromIntegral (sum ms) / fromIntegral (length ms)
  where
    ms = [m | (s, _, m) <- scores, s == student]
`,
    },
    {
      k: "write",
      body: md(
        ...scores7Shown,
        "",
        "Define a function `modulesOf :: Student -> [Score] -> [Module]` that lists the modules that student sat, in table order. For example:",
        "",
        "```",
        '*Main> modulesOf "Ann" work',
        '["FP","DB","AI"]',
        "```",
      ),
      setup: scores7,
      starter: hs`modulesOf :: Student -> [Score] -> [Module]
modulesOf student scores = undefined
`,
      tests: [
        { expr: 'modulesOf "Ann" work', expected: '["FP", "DB", "AI"]' },
        { expr: 'modulesOf "Ben" work', expected: '["FP", "DB"]' },
        { expr: 'modulesOf "Dee" work', expected: "[]" },
        { expr: 'modulesOf "Cara" work', expected: '["FP", "AI"]' },
        { expr: 'modulesOf "Ann" []', expected: "[]" },
      ],
      hint: "`[m | (s, m, _) <- scores, s == student]`.",
      solution: hs`modulesOf :: Student -> [Score] -> [Module]
modulesOf student scores = [m | (s, m, _) <- scores, s == student]
`,
    },
    {
      k: "write",
      body: md(
        ...scores7Shown,
        "",
        "Define a function `byStudent :: [Score] -> [(Student, [Mark])]` that groups marks by student. Students appear in first-appearance order; marks within a student stay in table order. For example:",
        "",
        "```",
        "*Main> byStudent work",
        '[("Ann",[72,88,64]),("Ben",[45,51]),("Cara",[90,40])]',
        "```",
      ),
      setup: scores7,
      starter: hs`byStudent :: [Score] -> [(Student, [Mark])]
byStudent scores = undefined
`,
      tests: [
        { expr: "byStudent work", expected: '[("Ann", [72, 88, 64]), ("Ben", [45, 51]), ("Cara", [90, 40])]' },
        { expr: "byStudent []", expected: "[]" },
        { expr: 'byStudent [("A", "X", 1), ("A", "Y", 2)]', expected: '[("A", [1, 2])]' },
        { expr: "map fst (byStudent work)", expected: '["Ann", "Ben", "Cara"]' },
        { expr: 'byStudent [("B", "X", 1), ("A", "X", 2), ("B", "Y", 3)]', expected: '[("B", [1, 3]), ("A", [2])]' },
      ],
      hint: "First `nub` the student names in order, then for each name collect their marks with a comprehension.",
      solution: hs`byStudent :: [Score] -> [(Student, [Mark])]
byStudent scores = [(s, [m | (s', _, m) <- scores, s' == s]) | s <- nub [t | (t, _, _) <- scores]]
`,
    },
    {
      k: "write",
      body: md(
        ...scores7Shown,
        "",
        "Define a function `topStudent :: [Score] -> Student` that names the student with the highest **average** mark. You may assume the table is non-empty. If two averages tie, pick the student who appears first in the roster. For example:",
        "",
        "```",
        "*Main> topStudent work",
        '"Ann"',
        "```",
        "",
        "Ann's average is about 74.7, Cara's is 65, Ben's is 48.",
      ),
      setup: scores7,
      starter: hs`topStudent :: [Score] -> Student
topStudent scores = undefined
`,
      tests: [
        { expr: "topStudent work", expected: '"Ann"' },
        { expr: 'topStudent [("A", "X", 10), ("B", "X", 10)]', expected: '"A"', label: "tie: first in roster" },
        { expr: 'topStudent [("Z", "X", 1)]', expected: '"Z"' },
        { expr: 'topStudent [("A", "X", 1), ("B", "X", 100)]', expected: '"B"' },
        { expr: 'topStudent [("A", "X", 80), ("B", "X", 80), ("A", "Y", 70)]', expected: '"B"', label: "A averages 75, B averages 80" },
      ],
      hint: "Walk the roster, compute each average, keep the best so far, replacing only on a *strictly* greater average so ties keep the earlier student.",
      solution: hs`topStudent :: [Score] -> Student
topStudent scores = fst (foldl1 pick avgs)
  where
    names = nub [s | (s, _, _) <- scores]
    avgs = [(s, average s) | s <- names]
    average s =
      let ms = [m | (s', _, m) <- scores, s' == s]
      in fromIntegral (sum ms) / fromIntegral (length ms) :: Double
    pick acc@(_, aa) q@(_, aq)
      | aq > aa   = q
      | otherwise = acc
`,
    },
    {
      k: "write",
      body: md(
        ...scores7Shown,
        "",
        "Define a function `gradeBands :: [Score] -> [(Char, Int)]` that counts how many marks fall in each band, listing bands **A, B, C, D, F** in that order even if a band is empty:",
        "",
        "- A: 70 or more",
        "- B: 60-69",
        "- C: 50-59",
        "- D: 40-49",
        "- F: below 40",
        "",
        "For example:",
        "",
        "```",
        "*Main> gradeBands work",
        "[('A',3),('B',1),('C',1),('D',2),('F',0)]",
        "```",
      ),
      setup: scores7,
      starter: hs`gradeBands :: [Score] -> [(Char, Int)]
gradeBands scores = undefined
`,
      tests: [
        { expr: "gradeBands work", expected: "[('A', 3), ('B', 1), ('C', 1), ('D', 2), ('F', 0)]" },
        { expr: "gradeBands []", expected: "[('A', 0), ('B', 0), ('C', 0), ('D', 0), ('F', 0)]" },
        { expr: 'gradeBands [("A", "X", 70), ("B", "X", 69)]', expected: "[('A', 1), ('B', 1), ('C', 0), ('D', 0), ('F', 0)]" },
        { expr: 'gradeBands [("A", "X", 39)]', expected: "[('A', 0), ('B', 0), ('C', 0), ('D', 0), ('F', 1)]" },
        { expr: "sum [n | (_, n) <- gradeBands work]", expected: "7" },
      ],
      hint: "Write a local `band :: Mark -> Char`, then count `length [() | (_, _, m) <- scores, band m == b]` for each of `'A'`..",
      solution: hs`gradeBands :: [Score] -> [(Char, Int)]
gradeBands scores = [(b, length [() | (_, _, m) <- scores, band m == b]) | b <- "ABCDF"]
  where
    band m
      | m >= 70   = 'A'
      | m >= 60   = 'B'
      | m >= 50   = 'C'
      | m >= 40   = 'D'
      | otherwise = 'F'
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Mixed exercise 8: + interpreters, graphs, search, fixed points
// ---------------------------------------------------------------------------

const lang8 = hs`import Data.Maybe (fromJust)
import Data.List (nub)

data Exp = Lit Int | V String | Plus Exp Exp | Times Exp Exp
  deriving (Eq, Show)

data Stmt = Set String Exp | Seq Stmt Stmt
  deriving (Eq, Show)

type Env = [(String, Int)]

lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x t = fromJust (lookup x t)

env0 :: Env
env0 = [("x", 3), ("y", 4)]

p1 :: Stmt
p1 = Seq (Set "z" (Plus (V "x") (V "y"))) (Set "x" (Times (V "z") (Lit 2)))
`;

const lang8Shown = [
  "```",
  "data Exp  = Lit Int | V String | Plus Exp Exp | Times Exp Exp",
  "data Stmt = Set String Exp | Seq Stmt Stmt",
  "type Env  = [(String, Int)]",
  "",
  "lookUp x t   -- value of a key that is known to be present",
  "env0 = [(\"x\", 3), (\"y\", 4)]",
  "p1   = Seq (Set \"z\" (Plus (V \"x\") (V \"y\")))",
  "           (Set \"x\" (Times (V \"z\") (Lit 2)))",
  "```",
];

const graph8 = hs`import Data.List (nub, sort)

type Node = Int
type DiGraph = [(Node, Node)]

g1 :: DiGraph
g1 = [(1, 2), (2, 3), (1, 4), (4, 3), (3, 5)]
`;

const graph8Shown = [
  "```",
  "type Node    = Int",
  "type DiGraph = [(Node, Node)]    -- directed edges",
  "",
  "g1 = [(1, 2), (2, 3), (1, 4), (4, 3), (3, 5)]",
  "",
  "    1 -> 2 -> 3 -> 5",
  "    |         ^",
  "    +---> 4 --+",
  "```",
];

const mixed08: DrillSet = {
  id: "mixed-08",
  lesson: "",
  title: "Mixed exercise 8",
  intro: md(
    "The last mixed set before the mini papers. Adds **interpreters**, **graphs**, **search**, and **fixed points** (repeat until nothing changes).",
    "",
    "An interpreter evaluates a tiny language against an environment (a lookup table that statements update). A graph is a list of edges; search walks it with a visited list so you do not loop. A fixed point of `f` is a value `x` with `f x == x` — `until` and `iterate` get you there.",
    "",
    "The last ten questions are two short exam parts: a statement language (21-25) and a directed graph (26-30).",
  ),
  drills: [
    {
      k: "predict",
      expr: "[b | (a, b) <- [(1, 2), (1, 3), (2, 4)], a == 1]",
      answer: "[2, 3]",
      why: "Keep the edges that start at 1 and take their other end.",
    },
    {
      k: "quiz",
      q: "When searching a graph, why pass a list of nodes already on the current route (or already visited)?",
      options: [
        "So you can print the route at the end, only",
        "To stop the search going round a cycle forever",
        "Haskell requires an extra argument on every recursive function",
        "Visited lists make `lookup` faster",
      ],
      answer: 1,
      why: "Without remembering where you have been, a cycle of edges sends the recursion round forever. The visited list is the stop condition.",
    },
    {
      k: "write",
      body: md("Using this expression type, write `evalLit`, which evaluates an expression that contains **no variables** (you may assume that).", "", "```", "data Exp = Lit Int | Plus Exp Exp | Times Exp Exp", "```"),
      setup: hs`data Exp = Lit Int | Plus Exp Exp | Times Exp Exp
  deriving (Eq, Show)
`,
      starter: hs`evalLit :: Exp -> Int
evalLit e = undefined
`,
      tests: [
        { expr: "evalLit (Lit 7)", expected: "7" },
        { expr: "evalLit (Plus (Lit 1) (Times (Lit 2) (Lit 3)))", expected: "7" },
        { expr: "evalLit (Times (Lit 0) (Lit 9))", expected: "0" },
        { expr: "evalLit (Plus (Lit (-1)) (Lit 1))", expected: "0" },
      ],
      hint: "One equation per constructor; `Plus` and `Times` recurse on both children.",
      solution: hs`evalLit :: Exp -> Int
evalLit (Lit n)      = n
evalLit (Plus a b)   = evalLit a + evalLit b
evalLit (Times a b)  = evalLit a * evalLit b
`,
    },
    {
      k: "write",
      body: "Write `outs n g`: the nodes that directed graph `g` (a list of `(from, to)` edges) has an edge to from `n`, in edge-list order.",
      starter: hs`outs :: Int -> [(Int, Int)] -> [Int]
outs n g = undefined
`,
      tests: [
        { expr: "outs 1 [(1, 2), (1, 3), (2, 3)]", expected: "[2, 3]" },
        { expr: "outs 3 [(1, 2), (1, 3)]", expected: "[]" },
        { expr: "outs 1 []", expected: "[]" },
        { expr: "outs 2 [(2, 2), (1, 2)]", expected: "[2]" },
      ],
      hint: "`[b | (a, b) <- g, a == n]`.",
      solution: hs`outs :: Int -> [(Int, Int)] -> [Int]
outs n g = [b | (a, b) <- g, a == n]
`,
    },
    {
      k: "predict",
      expr: "take 4 (iterate (* 2) 1)",
      answer: "[1, 2, 4, 8]",
      why: "`iterate f x` is the infinite list `[x, f x, f (f x), ...]`. Starting at 1 and doubling: 1, 2, 4, 8.",
    },
    {
      k: "write",
      body: md("A rewrite rule: replace a neighbouring `1, 1` in a list by a single `2` (the first such pair only). Write `squash`, which does that once. If there is no such pair, return the list unchanged."),
      starter: hs`squash :: [Int] -> [Int]
squash xs = undefined
`,
      tests: [
        { expr: "squash [1, 1, 3]", expected: "[2, 3]" },
        { expr: "squash [1, 2, 1, 1]", expected: "[1, 2, 2]" },
        { expr: "squash [3, 4]", expected: "[3, 4]" },
        { expr: "squash []", expected: "[]" },
        { expr: "squash [1]", expected: "[1]" },
      ],
      hint: "Match `1 : 1 : rest` and return `2 : rest`. Otherwise keep the head and recurse. `[]` and `[x]` are unchanged.",
      solution: hs`squash :: [Int] -> [Int]
squash (1 : 1 : rest) = 2 : rest
squash (x : rest)     = x : squash rest
squash []             = []
`,
    },
    {
      k: "write",
      body: md("Write `evalVar env e`, which evaluates an expression that **may** mention variables. You may assume every variable is in `env`. `lookUp` is given.", "", ...lang8Shown),
      setup: lang8,
      starter: hs`evalVar :: Env -> Exp -> Int
evalVar env e = undefined
`,
      tests: [
        { expr: 'evalVar env0 (V "x")', expected: "3" },
        { expr: 'evalVar env0 (Plus (V "x") (V "y"))', expected: "7" },
        { expr: "evalVar env0 (Times (Lit 2) (Lit 5))", expected: "10" },
        { expr: 'evalVar [("z", 0)] (Plus (V "z") (Lit 1))', expected: "1" },
      ],
      hint: "`Lit n` is `n`; `V v` is `lookUp v env`; operators recurse with the same `env`.",
      solution: hs`evalVar :: Env -> Exp -> Int
evalVar _ (Lit n)       = n
evalVar env (V v)       = lookUp v env
evalVar env (Plus a b)  = evalVar env a + evalVar env b
evalVar env (Times a b) = evalVar env a * evalVar env b
`,
    },
    {
      k: "quiz",
      q: "Evaluating an expression **never** changes the environment. Which of these is therefore true?",
      options: [
        "Both children of `Plus` are evaluated in the same environment",
        "You must thread a new environment out of the left child into the right child",
        "Variables cannot appear in expressions",
        "`Set` is an expression constructor",
      ],
      answer: 0,
      why: "Only statements (`Set`, `Seq`) update the table. An expression is a tree of values; both sides of `Plus` see the same `env`.",
    },
    {
      k: "write",
      body: "The *out-degree* of a node is how many directed edges leave it. Write `outDegree n g`.",
      starter: hs`outDegree :: Int -> [(Int, Int)] -> Int
outDegree n g = undefined
`,
      tests: [
        { expr: "outDegree 1 [(1, 2), (1, 3), (2, 3)]", expected: "2" },
        { expr: "outDegree 3 [(1, 2)]", expected: "0" },
        { expr: "outDegree 1 []", expected: "0" },
        { expr: "outDegree 2 [(2, 2)]", expected: "1" },
      ],
      hint: "`length` of the `outs` list, or `length [() | (a, _) <- g, a == n]`.",
      solution: hs`outDegree :: Int -> [(Int, Int)] -> Int
outDegree n g = length [() | (a, _) <- g, a == n]
`,
    },
    {
      k: "write",
      body: "The *in-degree* of a node is how many directed edges arrive at it. Write `inDegree n g`.",
      starter: hs`inDegree :: Int -> [(Int, Int)] -> Int
inDegree n g = undefined
`,
      tests: [
        { expr: "inDegree 3 [(1, 2), (1, 3), (2, 3)]", expected: "2" },
        { expr: "inDegree 1 [(1, 2)]", expected: "0" },
        { expr: "inDegree 1 []", expected: "0" },
        { expr: "inDegree 2 [(2, 2)]", expected: "1" },
      ],
      hint: "`length [() | (_, b) <- g, b == n]`.",
      solution: hs`inDegree :: Int -> [(Int, Int)] -> Int
inDegree n g = length [() | (_, b) <- g, b == n]
`,
    },
    {
      k: "write",
      body: md("Write `setVar k v env`, which sets key `k` to `v`: replace the first existing pair, or add at the end if `k` is new. Keep at most one pair for `k`."),
      starter: hs`setVar :: Eq k => k -> v -> [(k, v)] -> [(k, v)]
setVar k v env = undefined
`,
      tests: [
        { expr: 'setVar "x" 9 [("x", 1), ("y", 2)]', expected: '[("x", 9), ("y", 2)]' },
        { expr: 'setVar "z" 3 [("x", 1)]', expected: '[("x", 1), ("z", 3)]' },
        { expr: 'setVar "x" 1 ([] :: [(String, Int)])', expected: '[("x", 1)]' },
        { expr: 'setVar "a" 5 [("a", 1), ("b", 2), ("a", 3)]', expected: '[("a", 5), ("b", 2)]' },
      ],
      hint: "If the head key matches, put `(k, v)` there and drop later copies of `k`. Otherwise keep the head and recurse. Empty env: `[(k, v)]`.",
      solution: hs`setVar :: Eq k => k -> v -> [(k, v)] -> [(k, v)]
setVar k v [] = [(k, v)]
setVar k v ((k', v') : rest)
  | k == k'   = (k, v) : [(a, b) | (a, b) <- rest, a /= k]
  | otherwise = (k', v') : setVar k v rest
`,
    },
    {
      k: "predict",
      expr: "until (> 100) (* 2) 1",
      answer: "128",
      why: "`until p f x` applies `f` until `p` holds: 1, 2, 4, 8, 16, 32, 64, 128, and 128 is the first above 100.",
    },
    {
      k: "write",
      body: "Write `sumsTo n xs`: every pair of **distinct positions** `(x, y)` (x to the left of y) whose values add to `n`, in the order of those positions.",
      starter: hs`sumsTo :: Int -> [Int] -> [(Int, Int)]
sumsTo n xs = undefined
`,
      tests: [
        { expr: "sumsTo 5 [1, 2, 3, 4]", expected: "[(1, 4), (2, 3)]" },
        { expr: "sumsTo 4 [2, 2, 2]", expected: "[(2, 2), (2, 2), (2, 2)]" },
        { expr: "sumsTo 10 [1, 2]", expected: "[]" },
        { expr: "sumsTo 0 []", expected: "[]" },
      ],
      hint: "Number with `zip [0 ..]` and use two generators, keeping `i < j`.",
      solution: hs`sumsTo :: Int -> [Int] -> [(Int, Int)]
sumsTo n xs
  = [(x, y) | (i, x) <- ixs, (j, y) <- ixs, i < j, x + y == n]
  where
    ixs = zip [0 :: Int ..] xs
`,
    },
    {
      k: "quiz",
      q: "A function `f` is applied until the value stops changing. Which expression computes that fixed point, assuming it exists?",
      options: [
        "`until (\\x -> f x == x) f x0`",
        "`iterate f x0`",
        "`map f (repeat x0)`",
        "`f x0`",
      ],
      answer: 0,
      why: "`until p f x` stops when `p` holds of the current value. The predicate `f x == x` is exactly \"this is a fixed point\". `iterate` builds the whole infinite sequence; you still have to stop.",
    },
    {
      k: "write",
      body: md("Write `squashAll`, which applies `squash` (given) until the list no longer changes. `squash` replaces the first neighbouring pair of `1`s by a `2`."),
      setup: hs`squash :: [Int] -> [Int]
squash (1 : 1 : rest) = 2 : rest
squash (x : rest)     = x : squash rest
squash []             = []
`,
      starter: hs`squashAll :: [Int] -> [Int]
squashAll xs = undefined
`,
      tests: [
        { expr: "squashAll [1, 1, 1, 1]", expected: "[2, 2]" },
        { expr: "squashAll [1, 1, 3]", expected: "[2, 3]" },
        { expr: "squashAll [3, 4]", expected: "[3, 4]" },
        { expr: "squashAll []", expected: "[]" },
        { expr: "squashAll [1, 2, 1, 1, 1]", expected: "[1, 2, 2, 1]" },
      ],
      hint: "`until (\\ys -> squash ys == ys) squash xs`.",
      solution: hs`squashAll :: [Int] -> [Int]
squashAll xs = until (\ys -> squash ys == ys) squash xs
`,
    },
    {
      k: "write",
      body: md("Write `pathsFrom g start`: every node reachable from `start` along directed edges, **including `start`**, with no duplicates. Use this walk: `go seen x` adds `x` if new, then folds over `outs x` left to right. Return `reverse` of the seen list (newest was at the front). You may assume the graph is finite."),
      setup: graph8,
      starter: hs`pathsFrom :: DiGraph -> Node -> [Node]
pathsFrom g start = undefined
`,
      tests: [
        { expr: "pathsFrom g1 1", expected: "[1, 2, 3, 5, 4]" },
        { expr: "pathsFrom g1 5", expected: "[5]" },
        { expr: "pathsFrom g1 3", expected: "[3, 5]" },
        { expr: "pathsFrom [] 7", expected: "[7]" },
      ],
      hint: "A local `go seen x | elem x seen = seen | otherwise = foldl go (x : seen) [b | (a, b) <- g, a == x]`. Then `reverse (go [] start)`.",
      solution: hs`pathsFrom :: DiGraph -> Node -> [Node]
pathsFrom g start = reverse (go [] start)
  where
    go seen x
      | elem x seen = seen
      | otherwise   = foldl go (x : seen) [b | (a, b) <- g, a == x]
`,
    },
    {
      k: "write",
      body: md("Write `hasRoute g from to`, `True` when `to` is reachable from `from` (a node is reachable from itself). Use a visited list so cycles do not loop."),
      setup: graph8,
      starter: hs`hasRoute :: DiGraph -> Node -> Node -> Bool
hasRoute g from to = undefined
`,
      tests: [
        { expr: "hasRoute g1 1 5", expected: "True" },
        { expr: "hasRoute g1 4 2", expected: "False" },
        { expr: "hasRoute g1 5 5", expected: "True" },
        { expr: "hasRoute [] 1 2", expected: "False" },
        { expr: "hasRoute [(1, 1)] 1 1", expected: "True" },
      ],
      hint: "`elem to (pathsFrom g from)` if you write `pathsFrom` locally, or a boolean `go seen x`.",
      solution: hs`hasRoute :: DiGraph -> Node -> Node -> Bool
hasRoute g from to = go [] from
  where
    go seen x
      | x == to       = True
      | elem x seen   = False
      | otherwise     = any (go (x : seen)) [b | (a, b) <- g, a == x]
`,
    },
    {
      k: "write",
      body: md("Write `allWalks g from to`: every acyclic path from `from` to `to` as a list of nodes (including both ends). A path may not visit a node twice. List paths in the order a depth-first search that tries outgoing edges left to right would find them."),
      setup: graph8,
      starter: hs`allWalks :: DiGraph -> Node -> Node -> [[Node]]
allWalks g from to = undefined
`,
      tests: [
        { expr: "allWalks g1 1 5", expected: "[[1, 2, 3, 5], [1, 4, 3, 5]]" },
        { expr: "allWalks g1 5 1", expected: "[]" },
        { expr: "allWalks g1 5 5", expected: "[[5]]" },
        { expr: "allWalks [] 1 1", expected: "[[1]]" },
        { expr: "allWalks g1 2 5", expected: "[[2, 3, 5]]" },
      ],
      hint: "Helper `go route x` where `route` is the nodes already on this path. If `x` is `to`, emit `[reverse (x : route)]` (or keep the path growing forwards). Skip `x` if it is already on `route`.",
      solution: hs`allWalks :: DiGraph -> Node -> Node -> [[Node]]
allWalks g from to = go [] from
  where
    go route x
      | elem x route = []
      | x == to      = [reverse (x : route)]
      | otherwise    = concatMap (go (x : route)) [b | (a, b) <- g, a == x]
`,
    },
    {
      k: "write",
      body: md("Write `grow g xs`: add to `xs` every node that is one edge out from something already in `xs`. Keep the original order of `xs`, then the new nodes in the order they are first discovered scanning `xs` left to right and their outgoing edges left to right. Do not add duplicates."),
      setup: graph8,
      starter: hs`grow :: DiGraph -> [Node] -> [Node]
grow g xs = undefined
`,
      tests: [
        { expr: "grow g1 [1]", expected: "[1, 2, 4]" },
        { expr: "grow g1 [1, 2, 4]", expected: "[1, 2, 4, 3]" },
        { expr: "grow g1 [5]", expected: "[5]" },
        { expr: "grow g1 []", expected: "[]" },
      ],
      hint: "`nub (xs ++ concatMap outs xs)` with `outs n = [b | (a, b) <- g, a == n]`. `nub` keeps first occurrences, so original `xs` stay at the front.",
      solution: hs`grow :: DiGraph -> [Node] -> [Node]
grow g xs = nub (xs ++ concatMap outs xs)
  where
    outs n = [b | (a, b) <- g, a == n]
`,
    },
    {
      k: "write",
      body: md("Using `grow` as in the previous question (you must define it, or inline it), write `reachableSet g start`: the nodes reachable from `start`, found by applying `grow` until the set stops changing. Include `start`. Order: first-discovered, as `grow` produces."),
      setup: graph8,
      starter: hs`reachableSet :: DiGraph -> Node -> [Node]
reachableSet g start = undefined
`,
      tests: [
        { expr: "reachableSet g1 1", expected: "[1, 2, 4, 3, 5]" },
        { expr: "reachableSet g1 5", expected: "[5]" },
        { expr: "reachableSet g1 4", expected: "[4, 3, 5]" },
        { expr: "reachableSet [] 9", expected: "[9]" },
      ],
      hint: "`until (\\xs -> grow g xs == xs) (grow g) [start]`.",
      solution: hs`reachableSet :: DiGraph -> Node -> [Node]
reachableSet g start = until (\xs -> grow xs == xs) grow [start]
  where
    grow xs = nub (xs ++ concatMap outs xs)
    outs n = [b | (a, b) <- g, a == n]
`,
    },
    {
      k: "write",
      body: md(
        "Questions 21-25: a tiny language of expressions and statements. `lookUp` is given and assumes the key is present.",
        "",
        ...lang8Shown,
        "",
        "Define `evalExp :: Env -> Exp -> Int`. You may assume every variable is in the environment. For example:",
        "",
        "```",
        "*Main> evalExp env0 (Plus (V \"x\") (Lit 1))",
        "4",
        "*Main> evalExp env0 (Times (V \"x\") (V \"y\"))",
        "12",
        "```",
      ),
      setup: lang8,
      starter: hs`evalExp :: Env -> Exp -> Int
evalExp env e = undefined
`,
      tests: [
        { expr: 'evalExp env0 (Plus (V "x") (Lit 1))', expected: "4" },
        { expr: 'evalExp env0 (Times (V "x") (V "y"))', expected: "12" },
        { expr: "evalExp env0 (Lit 0)", expected: "0" },
        { expr: 'evalExp [("a", 10)] (Plus (V "a") (V "a"))', expected: "20" },
        { expr: "evalExp [] (Times (Lit 2) (Lit 3))", expected: "6" },
      ],
      hint: "Same shape as `evalVar`: `Lit`, `V` via `lookUp`, `Plus`/`Times` recurse.",
      solution: hs`evalExp :: Env -> Exp -> Int
evalExp _ (Lit n)       = n
evalExp env (V v)       = lookUp v env
evalExp env (Plus a b)  = evalExp env a + evalExp env b
evalExp env (Times a b) = evalExp env a * evalExp env b
`,
    },
    {
      k: "write",
      body: md(
        ...lang8Shown,
        "",
        "Define `setEnv :: String -> Int -> Env -> Env` that writes a variable: replace it if present, otherwise add it at the end. At most one pair per name. For example:",
        "",
        "```",
        '*Main> setEnv "x" 9 env0',
        "[(\"y\",4),(\"x\",9)]     -- or [(\"x\",9),(\"y\",4)]; order of other keys is yours",
        "```",
        "",
        "The tests accept any order (`unordered`).",
      ),
      setup: lang8,
      starter: hs`setEnv :: String -> Int -> Env -> Env
setEnv k v env = undefined
`,
      tests: [
        { expr: 'setEnv "x" 9 env0', expected: '[("x", 9), ("y", 4)]', unordered: true },
        { expr: 'setEnv "z" 1 env0', expected: '[("x", 3), ("y", 4), ("z", 1)]', unordered: true },
        { expr: 'setEnv "x" 1 []', expected: '[("x", 1)]' },
        { expr: 'lookUp "x" (setEnv "x" 5 env0)', expected: "5" },
        { expr: 'lookUp "y" (setEnv "x" 5 env0)', expected: "4" },
      ],
      hint: "Filter out the old pair for `k`, then append `(k, v)`.",
      solution: hs`setEnv :: String -> Int -> Env -> Env
setEnv k v env = [(k', v') | (k', v') <- env, k' /= k] ++ [(k, v)]
`,
    },
    {
      k: "write",
      body: md(
        ...lang8Shown,
        "",
        "Define `exec :: Env -> Stmt -> Env` that runs a statement and returns the updated environment. `Set v e` evaluates `e` in the current environment and writes `v`. `Seq a b` runs `a`, then runs `b` in the environment `a` produced. For example:",
        "",
        "```",
        "*Main> lookUp \"z\" (exec env0 p1)",
        "7",
        "*Main> lookUp \"x\" (exec env0 p1)",
        "14",
        "```",
      ),
      setup: lang8,
      starter: hs`exec :: Env -> Stmt -> Env
exec env s = undefined
`,
      tests: [
        { expr: 'lookUp "z" (exec env0 p1)', expected: "7" },
        { expr: 'lookUp "x" (exec env0 p1)', expected: "14" },
        { expr: 'lookUp "y" (exec env0 p1)', expected: "4" },
        { expr: 'lookUp "x" (exec env0 (Set "x" (Lit 0)))', expected: "0" },
        { expr: 'lookUp "x" (exec [] (Set "x" (Lit 3)))', expected: "3" },
        { expr: 'lookUp "b" (exec env0 (Seq (Set "a" (Lit 1)) (Set "b" (Plus (V "a") (V "x")))))', expected: "4" },
      ],
      hint: "`exec env (Set v e) = setEnv v (evalExp env e) env`. For `Seq`, `exec (exec env a) b`. You will need local `evalExp` and `setEnv` (or inline them).",
      solution: hs`exec :: Env -> Stmt -> Env
exec env s = go env s
  where
    go env' (Set v e) = setEnv v (evalExp env' e) env'
    go env' (Seq a b) = go (go env' a) b
    evalExp _ (Lit n)        = n
    evalExp env' (V w)       = lookUp w env'
    evalExp env' (Plus x y)  = evalExp env' x + evalExp env' y
    evalExp env' (Times x y) = evalExp env' x * evalExp env' y
    setEnv k val tab = [(k', v') | (k', v') <- tab, k' /= k] ++ [(k, val)]
`,
    },
    {
      k: "write",
      body: md(
        ...lang8Shown,
        "",
        "Define `usedVars :: Stmt -> [String]` that lists every variable **name mentioned** in a statement's expressions (read or written), each once, in first-appearance order. A `Set v e` mentions `v` and every variable in `e` (`v` first, then `e` left to right). For example:",
        "",
        "```",
        "*Main> usedVars p1",
        "[\"z\",\"x\",\"y\"]",
        "```",
      ),
      setup: lang8,
      starter: hs`usedVars :: Stmt -> [String]
usedVars s = undefined
`,
      tests: [
        { expr: "usedVars p1", expected: '["z", "x", "y"]' },
        { expr: 'usedVars (Set "x" (Lit 1))', expected: '["x"]' },
        { expr: 'usedVars (Set "x" (V "x"))', expected: '["x"]' },
        { expr: 'usedVars (Seq (Set "a" (V "b")) (Set "c" (V "a")))', expected: '["a", "b", "c"]' },
        { expr: 'usedVars (Set "q" (Plus (V "m") (V "n")))', expected: '["q", "m", "n"]' },
      ],
      hint: "`nub` of a walk: `Set v e` is `v : varsE e`; `Seq` concatenates. `varsE (V w) = [w]`, `Lit` is `[]`.",
      solution: hs`usedVars :: Stmt -> [String]
usedVars s = nub (go s)
  where
    go (Set v e) = v : varsE e
    go (Seq a b) = go a ++ go b
    varsE (Lit _)      = []
    varsE (V w)        = [w]
    varsE (Plus x y)   = varsE x ++ varsE y
    varsE (Times x y)  = varsE x ++ varsE y
`,
    },
    {
      k: "write",
      body: md(
        ...lang8Shown,
        "",
        "Define `run :: Stmt -> Env` that executes a statement starting from the empty environment. You may assume the program never reads a variable before writing it. For example:",
        "",
        "```",
        "*Main> run (Set \"x\" (Lit 5))",
        "[(\"x\",5)]",
        "*Main> lookUp \"x\" (run p1)",
        "14     -- z is set from env0? wait: p1 run from empty would fail looking up x",
        "```",
        "",
        "Use this starting program instead for the empty-env case: first set `x` and `y`, then `p1`.",
      ),
      setup: lang8,
      starter: hs`run :: Stmt -> Env
run s = undefined
`,
      tests: [
        { expr: 'run (Set "x" (Lit 5))', expected: '[("x", 5)]' },
        { expr: 'lookUp "x" (run (Seq (Set "x" (Lit 3)) (Set "x" (Plus (V "x") (Lit 1)))))', expected: "4" },
        { expr: 'lookUp "z" (run (Seq (Seq (Set "x" (Lit 3)) (Set "y" (Lit 4))) p1))', expected: "7" },
        { expr: 'lookUp "x" (run (Seq (Seq (Set "x" (Lit 3)) (Set "y" (Lit 4))) p1))', expected: "14" },
        { expr: "run (Set \"a\" (Times (Lit 2) (Lit 8)))", expected: '[("a", 16)]' },
      ],
      hint: "`run s = exec [] s` with the same `exec`/`evalExp`/`setEnv` as before.",
      solution: hs`run :: Stmt -> Env
run s = exec [] s
  where
    exec env (Set v e) = setEnv v (evalExp env e) env
    exec env (Seq a b) = exec (exec env a) b
    evalExp _ (Lit n)        = n
    evalExp env (V w)        = lookUp w env
    evalExp env (Plus x y)   = evalExp env x + evalExp env y
    evalExp env (Times x y)  = evalExp env x * evalExp env y
    setEnv k val tab = [(k', v') | (k', v') <- tab, k' /= k] ++ [(k, val)]
`,
    },
    {
      k: "write",
      body: md(
        "Questions 26-30 use this directed graph (a list of edges).",
        "",
        ...graph8Shown,
        "",
        "Define `nodesOf :: DiGraph -> [Node]` that lists every node that appears as either end of an edge, each once, in first-appearance order. For example:",
        "",
        "```",
        "*Main> nodesOf g1",
        "[1,2,3,4,5]",
        "*Main> nodesOf []",
        "[]",
        "```",
      ),
      setup: graph8,
      starter: hs`nodesOf :: DiGraph -> [Node]
nodesOf g = undefined
`,
      tests: [
        { expr: "nodesOf g1", expected: "[1, 2, 3, 4, 5]" },
        { expr: "nodesOf []", expected: "[]" },
        { expr: "nodesOf [(3, 1), (3, 2)]", expected: "[3, 1, 2]" },
        { expr: "nodesOf [(1, 1)]", expected: "[1]" },
        { expr: "nodesOf [(2, 3), (1, 2)]", expected: "[2, 3, 1]" },
      ],
      hint: "`nub` of `[a | (a, _) <- g] ++ [b | (_, b) <- g]`, or flatten each edge as `[a, b]`.",
      solution: hs`nodesOf :: DiGraph -> [Node]
nodesOf g = nub (concat [[a, b] | (a, b) <- g])
`,
    },
    {
      k: "write",
      body: md(
        ...graph8Shown,
        "",
        "Define `outsOf :: Node -> DiGraph -> [Node]` that lists the successors of a node, in the order the edges are stored. For example:",
        "",
        "```",
        "*Main> outsOf 1 g1",
        "[2,4]",
        "*Main> outsOf 5 g1",
        "[]",
        "```",
      ),
      setup: graph8,
      starter: hs`outsOf :: Node -> DiGraph -> [Node]
outsOf n g = undefined
`,
      tests: [
        { expr: "outsOf 1 g1", expected: "[2, 4]" },
        { expr: "outsOf 5 g1", expected: "[]" },
        { expr: "outsOf 2 g1", expected: "[3]" },
        { expr: "outsOf 3 g1", expected: "[5]" },
        { expr: "outsOf 9 []", expected: "[]" },
      ],
      hint: "`[b | (a, b) <- g, a == n]`.",
      solution: hs`outsOf :: Node -> DiGraph -> [Node]
outsOf n g = [b | (a, b) <- g, a == n]
`,
    },
    {
      k: "write",
      body: md(
        ...graph8Shown,
        "",
        "Define `reachableFrom :: DiGraph -> Node -> [Node]` that lists every node reachable from the start, including the start, **depth-first**, outgoing edges left to right, no duplicates. Use exactly this method so the answer is unique:",
        "",
        "- Keep a seen list, newest first, starting empty.",
        "- To visit `x`: if `x` is already seen, do nothing; otherwise put `x` on seen, then visit each successor in order.",
        "- Return `reverse` of the final seen list.",
        "",
        "```",
        "*Main> reachableFrom g1 1",
        "[1,2,3,5,4]",
        "*Main> reachableFrom g1 4",
        "[4,3,5]",
        "```",
      ),
      setup: graph8,
      starter: hs`reachableFrom :: DiGraph -> Node -> [Node]
reachableFrom g start = undefined
`,
      tests: [
        { expr: "reachableFrom g1 1", expected: "[1, 2, 3, 5, 4]" },
        { expr: "reachableFrom g1 4", expected: "[4, 3, 5]" },
        { expr: "reachableFrom g1 5", expected: "[5]" },
        { expr: "reachableFrom [] 8", expected: "[8]" },
        { expr: "reachableFrom [(1, 2), (1, 3)] 1", expected: "[1, 2, 3]" },
        { expr: "sort (reachableFrom g1 1)", expected: "[1, 2, 3, 4, 5]" },
      ],
      hint: "`reverse (go [] start)` with `go seen x | elem x seen = seen | otherwise = foldl go (x : seen) (outs x)`.",
      solution: hs`reachableFrom :: DiGraph -> Node -> [Node]
reachableFrom g start = reverse (go [] start)
  where
    go seen x
      | elem x seen = seen
      | otherwise   = foldl go (x : seen) [b | (a, b) <- g, a == x]
`,
    },
    {
      k: "write",
      body: md(
        ...graph8Shown,
        "",
        "Define `onPath :: DiGraph -> Node -> Node -> Bool` that is `True` when there is a directed route from the first node to the second (a node is on a path to itself). For example:",
        "",
        "```",
        "*Main> onPath g1 1 5",
        "True",
        "*Main> onPath g1 5 1",
        "False",
        "```",
      ),
      setup: graph8,
      starter: hs`onPath :: DiGraph -> Node -> Node -> Bool
onPath g from to = undefined
`,
      tests: [
        { expr: "onPath g1 1 5", expected: "True" },
        { expr: "onPath g1 5 1", expected: "False" },
        { expr: "onPath g1 2 2", expected: "True" },
        { expr: "onPath g1 4 5", expected: "True" },
        { expr: "onPath [] 1 1", expected: "True" },
        { expr: "onPath [(1, 2), (2, 1)] 1 2", expected: "True" },
      ],
      hint: "`elem to (reachableFrom g from)` with a local reachable walker, or a boolean search with a seen list.",
      solution: hs`onPath :: DiGraph -> Node -> Node -> Bool
onPath g from to = elem to (reachableFrom g from)
  where
    reachableFrom g' start = reverse (go [] start)
    go seen x
      | elem x seen = seen
      | otherwise   = foldl go (x : seen) [b | (a, b) <- g, a == x]
`,
    },
    {
      k: "write",
      body: md(
        ...graph8Shown,
        "",
        "Define `closeFrom :: DiGraph -> Node -> [Node]` that computes the reachable set by **growing** a list until it is a fixed point:",
        "",
        "- Start from `[start]`.",
        "- One step: `nub (xs ++ successors of every node in xs)`, successors in edge order.",
        "- Repeat until a step changes nothing.",
        "",
        "This is breadth-ish first-discovered order, not the depth-first order of `reachableFrom`. For example:",
        "",
        "```",
        "*Main> closeFrom g1 1",
        "[1,2,4,3,5]",
        "```",
      ),
      setup: graph8,
      starter: hs`closeFrom :: DiGraph -> Node -> [Node]
closeFrom g start = undefined
`,
      tests: [
        { expr: "closeFrom g1 1", expected: "[1, 2, 4, 3, 5]" },
        { expr: "closeFrom g1 5", expected: "[5]" },
        { expr: "closeFrom g1 4", expected: "[4, 3, 5]" },
        { expr: "closeFrom [] 9", expected: "[9]" },
        { expr: "sort (closeFrom g1 1)", expected: "[1, 2, 3, 4, 5]" },
      ],
      hint: "`until (\\xs -> step xs == xs) step [start]` with `step xs = nub (xs ++ concatMap outs xs)`.",
      solution: hs`closeFrom :: DiGraph -> Node -> [Node]
closeFrom g start = until (\xs -> step xs == xs) step [start]
  where
    step xs = nub (xs ++ concatMap outs xs)
    outs n  = [b | (a, b) <- g, a == n]
`,
    },
  ],
};

export const mixed: DrillSet[] = [mixed01, mixed02, mixed03, mixed04, mixed05, mixed06, mixed07, mixed08];




