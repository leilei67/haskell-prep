import { type Book, type DrillSet, hs, md } from "../schema.ts";

const noMaps = ["Data.Set", "Data.Map"];

const listTools = hs`import Data.List (nub, sort, sortBy, group, groupBy)
import Data.Ord (comparing)
`;

const sortTools = hs`import Data.List (sort, sortBy, group, groupBy)
import Data.Ord (comparing)
`;

const enrolSetup = hs`type Name = String
type Course = String
type Enrol = [(Name, Course)]

term :: Enrol
term = [("amy", "haskell"), ("ben", "haskell"), ("amy", "logic"), ("cam", "logic"), ("ben", "circuits")]
`;

const shopSetup = hs`type Code = Int

monday, tuesday :: [Code]
monday = [101, 104, 107, 110]
tuesday = [104, 105, 110, 112]
`;

const voteSetup = hs`import Data.List (sort, group)

votes :: [String]
votes = ["kim", "lee", "kim", "sam", "lee", "kim", "pat"]
`;

const pairSetup = hs`import Data.List (nub, sort, groupBy, sortBy)
import Data.Ord (comparing)

type Key = String
type Val = Int

pairs :: [(Key, Val)]
pairs = [("b", 2), ("a", 5), ("b", 7), ("c", 1), ("a", 3)]
`;

const clubSetup = hs`import Data.List (nub, sort)

type Person = String
type Club = String

signups :: [(Person, [Club])]
signups =
  [ ("amy", ["chess", "choir"])
  , ("ben", ["choir"])
  , ("cam", ["chess", "drama"])
  , ("dot", ["drama", "chess"])
  ]
`;

const markSetup = hs`type Student = String
type Score = Int

marks :: [(Student, Score)]
marks = [("nia", 72), ("omar", 55), ("pia", 72), ("raj", 40), ("sia", 55)]
`;

const wordSetup = hs`import Data.List (sort, groupBy, sortBy)
import Data.Ord (comparing)

words1 :: [String]
words1 = ["eat", "tea", "bat", "tab", "ate", "cab"]
`;

const priceSetup = hs`type Item = String
type Pence = Int

shelfA, shelfB :: [(Item, Pence)]
shelfA = [("bread", 120), ("eggs", 180), ("milk", 95)]
shelfB = [("eggs", 170), ("flour", 80), ("milk", 95)]
`;

const cohortSetup = hs`type Name = String
type Year = Int
type Tutor = String
type Row = (Name, Year, Tutor)

classList :: [Row]
classList =
  [ ("amy", 1, "ravi")
  , ("ben", 2, "nina")
  , ("cam", 1, "nina")
  , ("dot", 1, "ravi")
  , ("eli", 2, "ravi")
  , ("fay", 2, "nina")
  ]
`;

// ---------------------------------------------------------------------------
// Level 1: Warm-up
// ---------------------------------------------------------------------------

const level1: DrillSet = {
  id: "b-sets-l1",
  lesson: "",
  level: 1,
  title: "Level 1: Warm-up",
  intro: md(
    "A list can stand in for a set if we agree that order does not matter and nothing should appear twice. Haskell still stores a list, so you tidy it with `nub`, test membership with `elem` / `notElem`, and sort when you want a stable order.",
    "",
    "A bag (also called a multiset) is the other convention: copies count. `\"aaab\"` as a bag has four letters; as a set it has two, `a` and `b`.",
    "",
    "```",
    "nub [3, 1, 3, 2]     -- [3, 1, 2]  first copy of each is kept",
    "elem 2 [1, 2, 1]     -- True",
    "notElem 4 [1, 2, 1]  -- True",
    "```",
  ),
  drills: [
    {
      k: "predict",
      expr: "nub [6, 1, 6, 2, 1]",
      answer: "[6, 1, 2]",
      why: "Walk left to right and keep a number the first time you see it: 6, then 1, then 2. Later copies of 6 and 1 are dropped.",
    },
    {
      k: "quiz",
      q: "What does `nub` keep when a value appears more than once?",
      options: [
        "The last copy, moved to the front",
        "The first copy, in its original place",
        "Every copy, because `nub` only sorts",
        "One copy, but the place is unspecified",
      ],
      answer: 1,
      why: "`nub` never reorders the first appearances. It only throws away later repeats.",
    },
    {
      k: "predict",
      expr: "elem 0 [2, 0, 2]",
      answer: "True",
      why: "`0` sits in the middle of the list, so `elem` is `True`. Position does not matter, only whether it appears.",
    },
    {
      k: "predict",
      expr: "notElem 'q' \"plug\"",
      answer: "True",
      why: "`'q'` is not one of p, l, u, g, so \"not an element\" is `True`.",
    },
    {
      k: "quiz",
      q: "What is `elem 3 []`?",
      options: ["`True`", "`False`", "An error", "`Nothing`"],
      answer: 1,
      why: "The empty list contains nothing, so 3 is not in it. `elem` on `[]` is always `False`.",
    },
    {
      k: "predict",
      expr: "sort [3, 1, 3, 2]",
      answer: "[1, 2, 3, 3]",
      why: "`sort` puts smaller numbers first. Both 3s stay: sorting does not remove duplicates.",
    },
    {
      k: "quiz",
      q: "What is `group [1, 2, 1]`?",
      options: ["`[[1, 1], [2]]`", "`[[1], [2], [1]]`", "`[[1, 2, 1]]`", "`[[1, 2], [1]]`"],
      answer: 1,
      why: "`group` only joins equal neighbours. The two `1`s are not next to each other, so they stay in separate inner lists.",
    },
    {
      k: "predict",
      expr: "group \"wool\"",
      answer: '["w", "oo", "l"]',
      why: "The two `o`s sit together, so they become one run. `w` and `l` are on their own.",
    },
    {
      k: "quiz",
      q: "As a set, how many elements does `[1, 1, 2]` have?",
      options: [
        "3, because every copy counts",
        "2: the values 1 and 2",
        "1, because you only count the first value",
        "0, because of the repeat",
      ],
      answer: 1,
      why: "A set ignores repeats. The distinct values are 1 and 2. As a bag it would have three elements.",
    },
    {
      k: "quiz",
      q: "Which pair are the same as sets, but not the same as bags?",
      options: ["`[1, 2]` and `[2, 1, 1]`", "`[1, 2]` and `[2, 1]`", "`[1, 2]` and `[1, 3]`", "`[1]` and `[]`"],
      answer: 0,
      why: "Both lists contain 1 and 2 and nothing else, so they are the same set. As bags they differ: one has a single 1, the other has two.",
    },
    {
      k: "predict",
      expr: "length (nub \"copper\")",
      answer: "5",
      why: "`\"copper\"` has six letters but only five distinct ones: c, o, p, e, r. `nub` keeps `\"coper\"`.",
    },
    {
      k: "quiz",
      q: "`notElem x xs` is always the same as which of these?",
      options: ["`elem x xs`", "`not (elem x xs)`", "`elem x (nub xs)`", "`null xs`"],
      answer: 1,
      why: "`notElem` is exactly the negation of `elem`. It does not change the list and it does not care about duplicates.",
    },
    {
      k: "write",
      body: "Write `seenIn x xs`, which is `True` when `x` appears at least once in `xs`.",
      starter: hs`seenIn :: Int -> [Int] -> Bool
seenIn x xs = undefined
`,
      tests: [
        { expr: "seenIn 3 [1, 3, 5]", expected: "True" },
        { expr: "seenIn 4 [1, 3, 5]", expected: "False" },
        { expr: "seenIn 1 []", expected: "False" },
        { expr: "seenIn 2 [2, 2, 2]", expected: "True" },
      ],
      hint: "`elem` already does this: `seenIn x xs = elem x xs`.",
      solution: hs`seenIn :: Int -> [Int] -> Bool
seenIn x xs = elem x xs
`,
      banned: noMaps,
    },
    {
      k: "write",
      body: "Write `unseenIn x xs`, which is `True` when `x` does not appear in `xs`.",
      starter: hs`unseenIn :: Char -> String -> Bool
unseenIn x xs = undefined
`,
      tests: [
        { expr: "unseenIn 'z' \"abc\"", expected: "True" },
        { expr: "unseenIn 'b' \"abc\"", expected: "False" },
        { expr: "unseenIn 'a' \"\"", expected: "True" },
        { expr: "unseenIn 'q' \"qq\"", expected: "False" },
      ],
      hint: "`notElem x xs`, or `not (elem x xs)`.",
      solution: hs`unseenIn :: Char -> String -> Bool
unseenIn x xs = notElem x xs
`,
      banned: noMaps,
    },
    {
      k: "write",
      body: "Write `timesIn x xs`, how many times `x` appears. Copies all count: this is a bag count, not a set test.",
      starter: hs`timesIn :: Int -> [Int] -> Int
timesIn x xs = undefined
`,
      tests: [
        { expr: "timesIn 2 [2, 1, 2, 2]", expected: "3" },
        { expr: "timesIn 9 [1, 2, 3]", expected: "0" },
        { expr: "timesIn 0 []", expected: "0" },
        { expr: "timesIn 5 [5]", expected: "1" },
      ],
      hint: "`length (filter (== x) xs)`.",
      solution: hs`timesIn :: Int -> [Int] -> Int
timesIn x xs = length (filter (== x) xs)
`,
      banned: noMaps,
    },
    {
      k: "write",
      body: "Write `onceIn x xs`, which is `True` when `x` appears exactly once.",
      starter: hs`onceIn :: Char -> String -> Bool
onceIn x xs = undefined
`,
      tests: [
        { expr: "onceIn 'l' \"apple\"", expected: "True" },
        { expr: "onceIn 'p' \"pepper\"", expected: "False" },
        { expr: "onceIn 'z' \"apple\"", expected: "False" },
        { expr: "onceIn 'a' \"\"", expected: "False" },
      ],
      hint: "Count with `length (filter (== x) xs)` and compare with 1.",
      solution: hs`onceIn :: Char -> String -> Bool
onceIn x xs = length (filter (== x) xs) == 1
`,
      banned: noMaps,
    },
    {
      k: "write",
      body: "Write `hasDouble`, which is `True` when some value appears more than once.",
      starter: hs`hasDouble :: Eq a => [a] -> Bool
hasDouble xs = undefined
`,
      tests: [
        { expr: "hasDouble [1, 2, 3 :: Int]", expected: "False" },
        { expr: "hasDouble [1, 2, 1 :: Int]", expected: "True" },
        { expr: "hasDouble ([] :: [Int])", expected: "False" },
        { expr: "hasDouble \"aa\"", expected: "True" },
        { expr: "hasDouble \"abc\"", expected: "False" },
      ],
      hint: "If the list is empty there is no double. Otherwise `elem x xs || hasDouble xs` for `x : xs`.",
      solution: hs`hasDouble :: Eq a => [a] -> Bool
hasDouble [] = False
hasDouble (x : xs) = elem x xs || hasDouble xs
`,
      banned: [...noMaps, "nub", "group"],
    },
    {
      k: "write",
      body: "Write `allDifferent`, which is `True` when no value appears twice.",
      starter: hs`allDifferent :: Eq a => [a] -> Bool
allDifferent xs = undefined
`,
      tests: [
        { expr: "allDifferent [4, 1, 3 :: Int]", expected: "True" },
        { expr: "allDifferent [4, 1, 4 :: Int]", expected: "False" },
        { expr: "allDifferent ([] :: [Char])", expected: "True" },
        { expr: "allDifferent \"hi\"", expected: "True" },
        { expr: "allDifferent \"hill\"", expected: "False" },
      ],
      hint: "The empty list is fine. For `x : xs`, `x` must not be in `xs`, and `xs` must itself be all different.",
      solution: hs`allDifferent :: Eq a => [a] -> Bool
allDifferent [] = True
allDifferent (x : xs) = notElem x xs && allDifferent xs
`,
      banned: [...noMaps, "nub"],
    },
    {
      k: "write",
      body: "Write `keepFirst`, which drops later copies of each value and keeps the first one, in the original order. Do not use `nub`.",
      starter: hs`keepFirst :: Eq a => [a] -> [a]
keepFirst xs = undefined
`,
      tests: [
        { expr: "keepFirst [3, 1, 3, 2, 1 :: Int]", expected: "[3, 1, 2]" },
        { expr: "keepFirst ([] :: [Int])", expected: "[]" },
        { expr: "keepFirst \"pepper\"", expected: '"per"' },
        { expr: "keepFirst [7 :: Int]", expected: "[7]" },
      ],
      hint: "For `x : xs`, put `x` on the front of `keepFirst` applied to `xs` with every `x` filtered out.",
      solution: hs`keepFirst :: Eq a => [a] -> [a]
keepFirst [] = []
keepFirst (x : xs) = x : keepFirst (filter (/= x) xs)
`,
      banned: [...noMaps, "nub", "nubBy"],
    },
    {
      k: "write",
      body: "Write `among xs ys`, the elements of `xs` that also appear in `ys`, in the order they occur in `xs`. Repeats in `xs` are kept if the value is in `ys` at all (a bag walk over `xs`).",
      starter: hs`among :: Eq a => [a] -> [a] -> [a]
among xs ys = undefined
`,
      tests: [
        { expr: "among [1, 2, 2, 3] [2, 4 :: Int]", expected: "[2, 2]" },
        { expr: "among \"hello\" \"world\"", expected: '"llo"' },
        { expr: "among [] [1 :: Int]", expected: "[]" },
        { expr: "among [1, 2] ([] :: [Int])", expected: "[]" },
      ],
      hint: "`filter (\\x -> elem x ys) xs`.",
      solution: hs`among :: Eq a => [a] -> [a] -> [a]
among xs ys = filter (\x -> elem x ys) xs
`,
      banned: [...noMaps, "intersect"],
    },
    {
      k: "write",
      body: "Write `notAmong xs ys`, the elements of `xs` that never appear in `ys`. Every copy of a forbidden value goes.",
      starter: hs`notAmong :: Eq a => [a] -> [a] -> [a]
notAmong xs ys = undefined
`,
      tests: [
        { expr: "notAmong [1, 2, 1, 3] [1 :: Int]", expected: "[2, 3]" },
        { expr: "notAmong \"banana\" \"an\"", expected: '"b"' },
        { expr: "notAmong [] [9 :: Int]", expected: "[]" },
        { expr: "notAmong [4, 5] ([] :: [Int])", expected: "[4, 5]" },
      ],
      hint: "`filter (\\x -> notElem x ys) xs`.",
      solution: hs`notAmong :: Eq a => [a] -> [a] -> [a]
notAmong xs ys = filter (\x -> notElem x ys) xs
`,
      banned: [...noMaps, "\\\\"],
    },
    {
      k: "write",
      body: "Write `addAtEnd x xs`, which puts `x` on the end of `xs` if it is not already there, and otherwise leaves `xs` alone.",
      starter: hs`addAtEnd :: Eq a => a -> [a] -> [a]
addAtEnd x xs = undefined
`,
      tests: [
        { expr: "addAtEnd 4 [1, 2, 3 :: Int]", expected: "[1, 2, 3, 4]" },
        { expr: "addAtEnd 2 [1, 2, 3 :: Int]", expected: "[1, 2, 3]" },
        { expr: "addAtEnd 'z' \"\"", expected: '"z"' },
        { expr: "addAtEnd 0 [0 :: Int]", expected: "[0]" },
      ],
      hint: "If `elem x xs` then `xs`, else `xs ++ [x]`.",
      solution: hs`addAtEnd :: Eq a => a -> [a] -> [a]
addAtEnd x xs
  | elem x xs = xs
  | otherwise = xs ++ [x]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: listTools,
      body: "Write `sortedCopy`, which returns the elements of a list in increasing order. Repeats stay.",
      starter: hs`sortedCopy :: [Int] -> [Int]
sortedCopy xs = undefined
`,
      tests: [
        { expr: "sortedCopy [3, 1, 2]", expected: "[1, 2, 3]" },
        { expr: "sortedCopy [2, 2, 1]", expected: "[1, 2, 2]" },
        { expr: "sortedCopy []", expected: "[]" },
        { expr: "sortedCopy [7]", expected: "[7]" },
      ],
      hint: "`sort` is imported.",
      solution: hs`sortedCopy :: [Int] -> [Int]
sortedCopy xs = sort xs
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: listTools,
      body: "Write `distinctSorted`, the distinct elements of a list, in increasing order. Treat the list as a set, then sort it.",
      starter: hs`distinctSorted :: [Int] -> [Int]
distinctSorted xs = undefined
`,
      tests: [
        { expr: "distinctSorted [3, 1, 3, 2, 1]", expected: "[1, 2, 3]" },
        { expr: "distinctSorted []", expected: "[]" },
        { expr: "distinctSorted [5, 5, 5]", expected: "[5]" },
        { expr: "distinctSorted [0]", expected: "[0]" },
      ],
      hint: "`sort (nub xs)`, or `map head (group (sort xs))`.",
      solution: hs`distinctSorted :: [Int] -> [Int]
distinctSorted xs = sort (nub xs)
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: listTools,
      body: "Write `bunches`, which splits a list into runs of equal neighbours. Do not sort first: two equal values that are not next to each other stay apart.",
      starter: hs`bunches :: Eq a => [a] -> [[a]]
bunches xs = undefined
`,
      tests: [
        { expr: "bunches [1, 1, 2, 2, 1 :: Int]", expected: "[[1, 1], [2, 2], [1]]" },
        { expr: "bunches ([] :: [Int])", expected: "[]" },
        { expr: "bunches \"book\"", expected: '["b", "oo", "k"]' },
        { expr: "bunches [7 :: Int]", expected: "[[7]]" },
      ],
      hint: "`group` is imported and does exactly this.",
      solution: hs`bunches :: Eq a => [a] -> [[a]]
bunches xs = group xs
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: listTools,
      body: "Write `bunchSizes`, the length of each run of equal neighbours, in the order the runs appear.",
      starter: hs`bunchSizes :: Eq a => [a] -> [Int]
bunchSizes xs = undefined
`,
      tests: [
        { expr: "bunchSizes [1, 1, 1, 2, 2 :: Int]", expected: "[3, 2]" },
        { expr: "bunchSizes ([] :: [Char])", expected: "[]" },
        { expr: "bunchSizes \"abbba\"", expected: "[1, 3, 1]" },
        { expr: "bunchSizes [9 :: Int]", expected: "[1]" },
      ],
      hint: "`map length (group xs)`.",
      solution: hs`bunchSizes :: Eq a => [a] -> [Int]
bunchSizes xs = map length (group xs)
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: listTools,
      body: "Write `lettersUsed`, the distinct characters of a string in the order they first appear.",
      starter: hs`lettersUsed :: String -> String
lettersUsed s = undefined
`,
      tests: [
        { expr: "lettersUsed \"committee\"", expected: '"comite"' },
        { expr: "lettersUsed \"\"", expected: '""' },
        { expr: "lettersUsed \"aaa\"", expected: '"a"' },
        { expr: "lettersUsed \"xyz\"", expected: '"xyz"' },
      ],
      hint: "`nub` keeps first appearances.",
      solution: hs`lettersUsed :: String -> String
lettersUsed s = nub s
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: listTools,
      body: "Write `sharedLetters a b`, the distinct letters that appear in both strings, in the order they first appear in `a`.",
      starter: hs`sharedLetters :: String -> String -> String
sharedLetters a b = undefined
`,
      tests: [
        { expr: "sharedLetters \"brick\" \"clock\"", expected: '"ck"' },
        { expr: "sharedLetters \"aaa\" \"ab\"", expected: '"a"' },
        { expr: "sharedLetters \"hi\" \"yo\"", expected: '""' },
        { expr: "sharedLetters \"\" \"abc\"", expected: '""' },
      ],
      hint: "`nub` of those letters of `a` that `elem` in `b`.",
      solution: hs`sharedLetters :: String -> String -> String
sharedLetters a b = nub [c | c <- a, elem c b]
`,
      banned: [...noMaps, "intersect"],
    },
    {
      k: "write",
      body: "Write `firstSingleton`, the first character of a string that appears exactly once, or `Nothing` if every character repeats (or the string is empty).",
      starter: hs`firstSingleton :: String -> Maybe Char
firstSingleton s = undefined
`,
      tests: [
        { expr: "firstSingleton \"abca\"", expected: "Just 'b'" },
        { expr: "firstSingleton \"aabb\"", expected: "Nothing" },
        { expr: "firstSingleton \"\"", expected: "Nothing" },
        { expr: "firstSingleton \"z\"", expected: "Just 'z'" },
        { expr: "firstSingleton \"stress\"", expected: "Just 't'" },
      ],
      hint: "Walk the string and keep the first `c` with `length (filter (== c) s) == 1`.",
      solution: hs`firstSingleton :: String -> Maybe Char
firstSingleton s =
  case [c | c <- s, length (filter (== c) s) == 1] of
    [] -> Nothing
    (c : _) -> Just c
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: listTools,
      body: "Write `onlyOnce`, the distinct values that appear exactly once, in the order they appear.",
      starter: hs`onlyOnce :: Eq a => [a] -> [a]
onlyOnce xs = undefined
`,
      tests: [
        { expr: "onlyOnce [1, 2, 1, 3, 3, 4 :: Int]", expected: "[2, 4]" },
        { expr: "onlyOnce ([] :: [Int])", expected: "[]" },
        { expr: "onlyOnce \"pepper\"", expected: '"r"' },
        { expr: "onlyOnce [5, 5, 5 :: Int]", expected: "[]" },
      ],
      hint: "For each value in `nub xs`, keep it when it occurs once in `xs`.",
      solution: hs`onlyOnce :: Eq a => [a] -> [a]
onlyOnce xs = [x | x <- nub xs, length (filter (== x) xs) == 1]
`,
      banned: noMaps,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 2: Sorting, grouping, walking two lists
// ---------------------------------------------------------------------------

const level2: DrillSet = {
  id: "b-sets-l2",
  lesson: "",
  level: 2,
  title: "Level 2: Sort, group, walk two lists",
  intro: md(
    "When a spec says two lists are already sorted and have no repeats, walk them together. Compare the two heads: the smaller one is unique to that list; if they match, the value is in both.",
    "",
    "`group` after `sort` gathers every copy of a value into one run, which is how you count frequencies. `sortBy (comparing f)` sorts by a key you pick.",
    "",
    "```",
    "sortBy (comparing snd) [(1, 'b'), (2, 'a')]   -- [(2, 'a'), (1, 'b')]",
    "group (sort \"abba\")                            -- [\"aa\", \"bb\"]",
    "```",
  ),
  drills: [
    {
      k: "predict",
      expr: "sortBy (comparing snd) [(3, 'x'), (1, 'z'), (3, 'a')]",
      answer: "[(3, 'a'), (3, 'x'), (1, 'z')]",
      why: "Only the second part of each pair is used: `'a'` then `'x'` then `'z'`. The 3s do not decide the order.",
    },
    {
      k: "quiz",
      q: "For a list of pairs, how does `sort xs` differ from `sortBy (comparing fst) xs`?",
      options: [
        "They always give the same answer",
        "`sort` also uses the second part to break ties; `comparing fst` ignores it",
        "`comparing fst` sorts on the second part",
        "`sort` drops duplicates",
      ],
      answer: 1,
      why: "`sort` on pairs uses the whole pair, so tied first parts are ordered by the second. `comparing fst` looks only at the first part and leaves tied pairs in their original order (the sort is stable).",
    },
    {
      k: "predict",
      expr: "map length (group (sort \"tweed\"))",
      answer: "[1, 2, 1, 1]",
      why: "`sort \"tweed\"` is `\"deetw\"`. Then `group` joins the two `e`s, so the run lengths are 1, 2, 1, 1.",
    },
    {
      k: "quiz",
      q: "You want a frequency table: each value with how many times it appears. Why is `group xs` not enough?",
      options: [
        "`group` cannot count",
        "`group` only joins neighbours, so copies that are apart stay in different runs",
        "`group` sorts the list, which loses the original order",
        "`group` removes duplicates",
      ],
      answer: 1,
      why: "Sort first so equal values become neighbours, then `group`. `map (\\g -> (head g, length g)) (group (sort xs))` is the usual pattern.",
    },
    {
      k: "quiz",
      q: "You are walking two sorted lists with no repeats to build their union. The heads are `x = 4` and `y = 7`. What do you output, and which list do you step along?",
      options: [
        "Output 7 and step the second list",
        "Output 4 and step the first list",
        "Output both 4 and 7, and step both lists",
        "Output nothing and step both lists",
      ],
      answer: 1,
      why: "4 is smaller, so it cannot appear later in the second list. Keep 4 and move on in the first list. 7 waits.",
    },
    {
      k: "predict",
      expr: "map length (group (sort [2, 1, 2, 1, 3 :: Int]))",
      answer: "[2, 2, 1]",
      why: "After sorting you have `[1, 1, 2, 2, 3]`. The run lengths are 2, 2 and 1.",
    },
    {
      k: "quiz",
      q: "`[1, 1, 2]` as a bag compared with `[1, 2]`. Which statement is right?",
      options: [
        "They are the same bag and the same set",
        "They are the same set but different bags, because the extra 1 counts in a bag",
        "They are different sets",
        "Bags ignore copies, so they match",
      ],
      answer: 1,
      why: "As sets both are `{1, 2}`. As bags the first has two 1s and the second has one.",
    },
    {
      k: "predict",
      expr: "map length (sortBy (comparing length) [\"aa\", \"b\", \"ccc\", \"dd\"])",
      answer: "[1, 2, 2, 3]",
      why: "Shortest first: length 1, then the two length-2 words (original order, so `aa` before `dd`), then length 3.",
    },
    {
      k: "write",
      body: md(
        "Write `unionWalk`. Both inputs are sorted ascending with no repeats. The result must be too. Walk the two lists together: do not use `union`, `elem`, `filter` or `nub`.",
      ),
      starter: hs`unionWalk :: [Int] -> [Int] -> [Int]
unionWalk xs ys = undefined
`,
      tests: [
        { expr: "unionWalk [1, 3, 5] [2, 3, 4]", expected: "[1, 2, 3, 4, 5]" },
        { expr: "unionWalk [1, 2] [1, 2]", expected: "[1, 2]" },
        { expr: "unionWalk [] [7, 8]", expected: "[7, 8]" },
        { expr: "unionWalk [7, 8] []", expected: "[7, 8]" },
        { expr: "unionWalk [1, 2, 3] [4, 5]", expected: "[1, 2, 3, 4, 5]" },
      ],
      hint: "If `x < y`, keep `x` and recurse on `xs` and `y : ys`. If `x > y`, keep `y`. If they are equal, keep one copy and step both.",
      solution: hs`unionWalk :: [Int] -> [Int] -> [Int]
unionWalk [] ys = ys
unionWalk xs [] = xs
unionWalk (x : xs) (y : ys)
  | x < y = x : unionWalk xs (y : ys)
  | x > y = y : unionWalk (x : xs) ys
  | otherwise = x : unionWalk xs ys
`,
      banned: [...noMaps, "union", "elem", "notElem", "filter", "nub"],
    },
    {
      k: "write",
      body: "Write `bothWalk`. Both inputs are sorted with no repeats. Return the values that appear in both, still sorted. Walk together; do not use `intersect` or `elem`.",
      starter: hs`bothWalk :: [Int] -> [Int] -> [Int]
bothWalk xs ys = undefined
`,
      tests: [
        { expr: "bothWalk [1, 3, 5, 8] [3, 4, 8, 9]", expected: "[3, 8]" },
        { expr: "bothWalk [1, 2] [3, 4]", expected: "[]" },
        { expr: "bothWalk [] [1, 2]", expected: "[]" },
        { expr: "bothWalk [1, 2] []", expected: "[]" },
        { expr: "bothWalk [2, 4, 6] [2, 4, 6]", expected: "[2, 4, 6]" },
      ],
      hint: "Equal heads: keep that value and step both. If `x < y`, `x` cannot appear later in `ys`, so drop `x`.",
      solution: hs`bothWalk :: [Int] -> [Int] -> [Int]
bothWalk [] _ = []
bothWalk _ [] = []
bothWalk (x : xs) (y : ys)
  | x < y = bothWalk xs (y : ys)
  | x > y = bothWalk (x : xs) ys
  | otherwise = x : bothWalk xs ys
`,
      banned: [...noMaps, "intersect", "elem", "notElem", "filter", "nub"],
    },
    {
      k: "write",
      body: "Write `leftWalk`. Both inputs are sorted with no repeats. Return the values that are in the first list but not the second. Walk together; do not use `elem` or `\\\\`.",
      starter: hs`leftWalk :: [Int] -> [Int] -> [Int]
leftWalk xs ys = undefined
`,
      tests: [
        { expr: "leftWalk [1, 3, 5, 8] [3, 4, 8]", expected: "[1, 5]" },
        { expr: "leftWalk [1, 2] []", expected: "[1, 2]" },
        { expr: "leftWalk [] [1, 2]", expected: "[]" },
        { expr: "leftWalk [1, 2, 3] [1, 2, 3]", expected: "[]" },
        { expr: "leftWalk [1, 4] [2, 3, 5]", expected: "[1, 4]" },
      ],
      hint: "Equal: drop both. `x < y`: keep `x`. `x > y`: drop `y` and keep looking at `x`.",
      solution: hs`leftWalk :: [Int] -> [Int] -> [Int]
leftWalk [] _ = []
leftWalk xs [] = xs
leftWalk (x : xs) (y : ys)
  | x < y = x : leftWalk xs (y : ys)
  | x > y = leftWalk (x : xs) ys
  | otherwise = leftWalk xs ys
`,
      banned: [...noMaps, "\\\\", "elem", "notElem", "filter", "nub"],
    },
    {
      k: "write",
      body: "Write `mergeKeep`. Both inputs are sorted, and repeats are allowed. Merge them into one sorted list, keeping every copy.",
      starter: hs`mergeKeep :: [Int] -> [Int] -> [Int]
mergeKeep xs ys = undefined
`,
      tests: [
        { expr: "mergeKeep [1, 3, 3] [2, 3, 4]", expected: "[1, 2, 3, 3, 3, 4]" },
        { expr: "mergeKeep [] [2, 2]", expected: "[2, 2]" },
        { expr: "mergeKeep [5] []", expected: "[5]" },
        { expr: "mergeKeep [1, 1] [1, 1]", expected: "[1, 1, 1, 1]" },
      ],
      hint: "Like walking the union, but when `x == y` you still output both, one now and one left for the recursive call: `x : mergeKeep xs (y : ys)` if `x <= y`.",
      solution: hs`mergeKeep :: [Int] -> [Int] -> [Int]
mergeKeep [] ys = ys
mergeKeep xs [] = xs
mergeKeep (x : xs) (y : ys)
  | x <= y = x : mergeKeep xs (y : ys)
  | otherwise = y : mergeKeep (x : xs) ys
`,
      banned: [...noMaps, "sort"],
    },
    {
      k: "write",
      body: "Write `squeeze`, which drops adjacent duplicates but leaves copies that are not next to each other. `[1, 1, 2, 1]` becomes `[1, 2, 1]`.",
      starter: hs`squeeze :: Eq a => [a] -> [a]
squeeze xs = undefined
`,
      tests: [
        { expr: "squeeze [1, 1, 2, 2, 2, 1 :: Int]", expected: "[1, 2, 1]" },
        { expr: "squeeze ([] :: [Int])", expected: "[]" },
        { expr: "squeeze \"bookkeeper\"", expected: '"bokeper"' },
        { expr: "squeeze [9 :: Int]", expected: "[9]" },
      ],
      hint: "Compare the first two. If they are equal, skip one. You can also `map head (group xs)` if you import `group`.",
      solution: hs`squeeze :: Eq a => [a] -> [a]
squeeze [] = []
squeeze [x] = [x]
squeeze (x : y : ys)
  | x == y = squeeze (y : ys)
  | otherwise = x : squeeze (y : ys)
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `freqTable`. For each distinct value, give how many times it appears, in increasing order of the value.",
      starter: hs`freqTable :: [Int] -> [(Int, Int)]
freqTable xs = undefined
`,
      tests: [
        { expr: "freqTable [2, 1, 2, 1, 3]", expected: "[(1, 2), (2, 2), (3, 1)]" },
        { expr: "freqTable []", expected: "[]" },
        { expr: "freqTable [7, 7, 7]", expected: "[(7, 3)]" },
        { expr: "freqTable [4]", expected: "[(4, 1)]" },
      ],
      hint: "`[(head g, length g) | g <- group (sort xs)]`.",
      solution: hs`freqTable :: [Int] -> [(Int, Int)]
freqTable xs = [(head g, length g) | g <- group (sort xs)]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `letterFreq`, each character of a string with its count, letters in alphabetical order.",
      starter: hs`letterFreq :: String -> [(Char, Int)]
letterFreq s = undefined
`,
      tests: [
        { expr: "letterFreq \"garage\"", expected: "[('a', 2), ('e', 1), ('g', 2), ('r', 1)]" },
        { expr: "letterFreq \"\"", expected: "[]" },
        { expr: "letterFreq \"zzz\"", expected: "[('z', 3)]" },
        { expr: "letterFreq \"cab\"", expected: "[('a', 1), ('b', 1), ('c', 1)]" },
      ],
      hint: "Same pattern as a number frequency table: `group` after `sort`.",
      solution: hs`letterFreq :: String -> [(Char, Int)]
letterFreq s = [(head g, length g) | g <- group (sort s)]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `sortBySnd`, which sorts a list of pairs by the second part only.",
      starter: hs`sortBySnd :: [(Int, Char)] -> [(Int, Char)]
sortBySnd xs = undefined
`,
      tests: [
        { expr: "sortBySnd [(9, 'c'), (1, 'a'), (5, 'b')]", expected: "[(1, 'a'), (5, 'b'), (9, 'c')]" },
        { expr: "sortBySnd [(2, 'z'), (8, 'm')]", expected: "[(8, 'm'), (2, 'z')]" },
        { expr: "sortBySnd []", expected: "[]" },
        { expr: "sortBySnd [(3, 'a'), (1, 'a')]", expected: "[(3, 'a'), (1, 'a')]" },
      ],
      hint: "`sortBy (comparing snd)`. The last test is a tie: stable sort keeps the original order.",
      solution: hs`sortBySnd :: [(Int, Char)] -> [(Int, Char)]
sortBySnd xs = sortBy (comparing snd) xs
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `shortFirst`, which sorts strings by length, shortest first. Equal lengths keep their original order.",
      starter: hs`shortFirst :: [String] -> [String]
shortFirst xs = undefined
`,
      tests: [
        { expr: "shortFirst [\"the\", \"a\", \"fox\", \"of\"]", expected: '["a", "of", "the", "fox"]' },
        { expr: "shortFirst []", expected: "[]" },
        { expr: "shortFirst [\"zz\"]", expected: '["zz"]' },
        { expr: "shortFirst [\"aaa\", \"b\", \"cc\"]", expected: '["b", "cc", "aaa"]' },
      ],
      hint: "`sortBy (comparing length)`.",
      solution: hs`shortFirst :: [String] -> [String]
shortFirst xs = sortBy (comparing length) xs
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `longFirst`, strings sorted by length, longest first. Equal lengths keep original order.",
      starter: hs`longFirst :: [String] -> [String]
longFirst xs = undefined
`,
      tests: [
        { expr: "longFirst [\"the\", \"a\", \"fox\", \"of\"]", expected: '["the", "fox", "of", "a"]' },
        { expr: "longFirst [\"hi\"]", expected: '["hi"]' },
        { expr: "longFirst []", expected: "[]" },
        { expr: "longFirst [\"x\", \"yyy\", \"zz\"]", expected: '["yyy", "zz", "x"]' },
      ],
      hint: "`sortBy (comparing (negate . length))`, or compare `length b` against `length a`.",
      solution: hs`longFirst :: [String] -> [String]
longFirst xs = sortBy (comparing (negate . length)) xs
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `byLast`, which sorts words by their last character. You may assume every word is non-empty.",
      starter: hs`byLast :: [String] -> [String]
byLast xs = undefined
`,
      tests: [
        { expr: "byLast [\"dog\", \"cat\", \"bar\"]", expected: '["dog", "bar", "cat"]' },
        { expr: "byLast [\"a\", \"b\"]", expected: '["a", "b"]' },
        { expr: "byLast [\"zz\", \"za\"]", expected: '["za", "zz"]' },
        { expr: "byLast []", expected: "[]" },
      ],
      hint: "`sortBy (comparing last)`.",
      solution: hs`byLast :: [String] -> [String]
byLast xs = sortBy (comparing last) xs
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `nameThenAge`, which sorts `(name, age)` pairs by name, and by age when the names match.",
      starter: hs`nameThenAge :: [(String, Int)] -> [(String, Int)]
nameThenAge xs = undefined
`,
      tests: [
        { expr: "nameThenAge [(\"nia\", 20), (\"amy\", 18), (\"nia\", 9)]", expected: '[("amy", 18), ("nia", 9), ("nia", 20)]' },
        { expr: "nameThenAge []", expected: "[]" },
        { expr: "nameThenAge [(\"z\", 1)]", expected: '[("z", 1)]' },
        { expr: "nameThenAge [(\"b\", 2), (\"a\", 9), (\"b\", 1)]", expected: '[("a", 9), ("b", 1), ("b", 2)]' },
      ],
      hint: "Ordinary `sort` on pairs already uses the first part, then the second.",
      solution: hs`nameThenAge :: [(String, Int)] -> [(String, Int)]
nameThenAge xs = sort xs
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `ageThenName`: youngest first; if two ages match, alphabetical name.",
      starter: hs`ageThenName :: [(String, Int)] -> [(String, Int)]
ageThenName xs = undefined
`,
      tests: [
        { expr: "ageThenName [(\"nia\", 20), (\"amy\", 18), (\"ben\", 18)]", expected: '[("amy", 18), ("ben", 18), ("nia", 20)]' },
        { expr: "ageThenName [(\"z\", 1), (\"a\", 1)]", expected: '[("a", 1), ("z", 1)]' },
        { expr: "ageThenName []", expected: "[]" },
        { expr: "ageThenName [(\"only\", 40)]", expected: '[("only", 40)]' },
      ],
      hint: "Flip each pair so the age comes first, `sort`, then flip back. Or `sortBy (comparing (\\(n, a) -> (a, n)))`.",
      solution: hs`ageThenName :: [(String, Int)] -> [(String, Int)]
ageThenName xs = sortBy (comparing (\(n, a) -> (a, n))) xs
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `uniqueSorted`, the distinct values in increasing order, by sorting and then dropping adjacent duplicates. Do not use `nub`.",
      starter: hs`uniqueSorted :: [Int] -> [Int]
uniqueSorted xs = undefined
`,
      tests: [
        { expr: "uniqueSorted [3, 1, 3, 2, 1]", expected: "[1, 2, 3]" },
        { expr: "uniqueSorted []", expected: "[]" },
        { expr: "uniqueSorted [4, 4, 4]", expected: "[4]" },
        { expr: "uniqueSorted [9, 0]", expected: "[0, 9]" },
      ],
      hint: "`map head (group (sort xs))`.",
      solution: hs`uniqueSorted :: [Int] -> [Int]
uniqueSorted xs = map head (group (sort xs))
`,
      banned: [...noMaps, "nub", "nubBy"],
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `sameBag`, which is `True` when two lists contain the same values with the same counts, ignoring order.",
      starter: hs`sameBag :: [Int] -> [Int] -> Bool
sameBag xs ys = undefined
`,
      tests: [
        { expr: "sameBag [1, 2, 1] [2, 1, 1]", expected: "True" },
        { expr: "sameBag [1, 2, 1] [1, 2]", expected: "False" },
        { expr: "sameBag [] []", expected: "True" },
        { expr: "sameBag [1] []", expected: "False" },
        { expr: "sameBag [3, 3, 3] [3, 3, 3]", expected: "True" },
      ],
      hint: "Sort both and compare: copies survive sorting, so counts have to match.",
      solution: hs`sameBag :: [Int] -> [Int] -> Bool
sameBag xs ys = sort xs == sort ys
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: listTools,
      body: "Write `sameMembers`, which is `True` when two lists contain the same distinct values, ignoring order and repeats (set equality).",
      starter: hs`sameMembers :: [Int] -> [Int] -> Bool
sameMembers xs ys = undefined
`,
      tests: [
        { expr: "sameMembers [1, 2, 1] [2, 1]", expected: "True" },
        { expr: "sameMembers [1, 2] [1, 2, 3]", expected: "False" },
        { expr: "sameMembers [] []", expected: "True" },
        { expr: "sameMembers [4, 4] [4]", expected: "True" },
        { expr: "sameMembers [] [0]", expected: "False" },
      ],
      hint: "`sort (nub xs) == sort (nub ys)`.",
      solution: hs`sameMembers :: [Int] -> [Int] -> Bool
sameMembers xs ys = sort (nub xs) == sort (nub ys)
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `atLeast n`, the distinct values that appear at least `n` times, in increasing order.",
      starter: hs`atLeast :: Int -> [Int] -> [Int]
atLeast n xs = undefined
`,
      tests: [
        { expr: "atLeast 2 [1, 2, 1, 3, 2, 1]", expected: "[1, 2]" },
        { expr: "atLeast 3 [1, 2, 1, 3, 2, 1]", expected: "[1]" },
        { expr: "atLeast 1 []", expected: "[]" },
        { expr: "atLeast 5 [9, 9]", expected: "[]" },
      ],
      hint: "Build the grouped runs after sorting, keep those whose length is at least `n`, take `head` of each.",
      solution: hs`atLeast :: Int -> [Int] -> [Int]
atLeast n xs = [head g | g <- group (sort xs), length g >= n]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `singles`, the distinct values that appear exactly once, in increasing order.",
      starter: hs`singles :: [Char] -> [Char]
singles xs = undefined
`,
      tests: [
        { expr: "singles \"pepper\"", expected: '"r"' },
        { expr: "singles \"aabb\"", expected: '""' },
        { expr: "singles \"\"", expected: '""' },
        { expr: "singles \"cab\"", expected: '"abc"' },
      ],
      hint: "After `group (sort xs)`, keep runs of length 1.",
      solution: hs`singles :: [Char] -> [Char]
singles xs = [head g | g <- group (sort xs), length g == 1]
`,
      banned: noMaps,
    },
    {
      k: "write",
      body: "Write `insertUnique x xs`. The list `xs` is sorted and has no repeats. Put `x` in the right place, unless it is already there.",
      starter: hs`insertUnique :: Int -> [Int] -> [Int]
insertUnique x xs = undefined
`,
      tests: [
        { expr: "insertUnique 5 [1, 3, 7]", expected: "[1, 3, 5, 7]" },
        { expr: "insertUnique 3 [1, 3, 7]", expected: "[1, 3, 7]" },
        { expr: "insertUnique 0 [1, 3]", expected: "[0, 1, 3]" },
        { expr: "insertUnique 9 []", expected: "[9]" },
        { expr: "insertUnique 4 [1, 2, 3]", expected: "[1, 2, 3, 4]" },
      ],
      hint: "Walk until you find a head `>= x`. Equal: leave the list as it is. Smaller insert point: put `x` in front.",
      solution: hs`insertUnique :: Int -> [Int] -> [Int]
insertUnique x [] = [x]
insertUnique x (y : ys)
  | x < y = x : y : ys
  | x == y = y : ys
  | otherwise = y : insertUnique x ys
`,
      banned: [...noMaps, "insert", "nub", "elem"],
    },
    {
      k: "write",
      body: "Write `commonCount`. Both lists are sorted; repeats are allowed. Return how many values they have in common as bags: each copy on the left can match at most one copy on the right.",
      starter: hs`commonCount :: [Int] -> [Int] -> Int
commonCount xs ys = undefined
`,
      tests: [
        { expr: "commonCount [1, 1, 2, 3] [1, 2, 2, 4]", expected: "2" },
        { expr: "commonCount [1, 1, 1] [1, 1]", expected: "2" },
        { expr: "commonCount [] [1, 2]", expected: "0" },
        { expr: "commonCount [5, 6] [5, 6]", expected: "2" },
        { expr: "commonCount [1, 2] [3, 4]", expected: "0" },
      ],
      hint: "Walk both. Equal heads: count 1 and step both. `x < y`: step the left. `x > y`: step the right.",
      solution: hs`commonCount :: [Int] -> [Int] -> Int
commonCount [] _ = 0
commonCount _ [] = 0
commonCount (x : xs) (y : ys)
  | x < y = commonCount xs (y : ys)
  | x > y = commonCount (x : xs) ys
  | otherwise = 1 + commonCount xs ys
`,
      banned: [...noMaps, "elem", "filter", "intersect"],
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `hottest`. Given a non-empty list of `(label, score)` pairs, return the label with the highest score. If scores tie, return the label that comes first alphabetically.",
      starter: hs`hottest :: [(String, Int)] -> String
hottest xs = undefined
`,
      tests: [
        { expr: "hottest [(\"red\", 3), (\"blue\", 5), (\"green\", 5)]", expected: '"blue"' },
        { expr: "hottest [(\"only\", 0)]", expected: '"only"' },
        { expr: "hottest [(\"b\", 1), (\"a\", 9), (\"c\", 9)]", expected: '"a"' },
        { expr: "hottest [(\"z\", -2), (\"m\", -2)]", expected: '"m"' },
      ],
      hint: "`sortBy (comparing (\\(n, s) -> (negate s, n)))` and take `fst` of the head.",
      solution: hs`hottest :: [(String, Int)] -> String
hottest xs = fst (head (sortBy (comparing (\(n, s) -> (negate s, n))) xs))
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `dropSparse n`, keeping only values that appear more than `n` times, in their original order, repeats included.",
      starter: hs`dropSparse :: Eq a => Int -> [a] -> [a]
dropSparse n xs = undefined
`,
      tests: [
        { expr: "dropSparse 1 [1, 2, 1, 3, 1, 2 :: Int]", expected: "[1, 2, 1, 1, 2]" },
        { expr: "dropSparse 2 [1, 2, 1, 3, 1, 2 :: Int]", expected: "[1, 1, 1]" },
        { expr: "dropSparse 0 \"ab\"", expected: '"ab"' },
        { expr: "dropSparse 5 [1, 1 :: Int]", expected: "[]" },
      ],
      hint: "Keep `x` when `length (filter (== x) xs) > n`.",
      solution: hs`dropSparse :: Eq a => Int -> [a] -> [a]
dropSparse n xs = [x | x <- xs, length (filter (== x) xs) > n]
`,
      banned: noMaps,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 3: Grouping by a key, bags versus sets
// ---------------------------------------------------------------------------

const level3: DrillSet = {
  id: "b-sets-l3",
  lesson: "",
  level: 3,
  title: "Level 3: Group by a key",
  intro: md(
    "A common job is to turn `[(key, value)]` into `[(key, [value])]`: every key once, with the values that belonged to it. Two ways:",
    "",
    "```",
    "-- first-appearance order of keys",
    "[(k, [v | (k', v) <- ps, k' == k]) | k <- nub (map fst ps)]",
    "",
    "-- sorted keys, using groupBy after sorting",
    "[(fst (head g), map snd g) | g <- groupBy (\\a b -> fst a == fst b) (sortOn fst ps)]",
    "```",
    "",
    "`groupBy` still only joins neighbours, so sort (or `sortBy (comparing fst)`) first. Bags add counts; sets forget copies.",
  ),
  drills: [
    {
      k: "predict",
      expr: "map fst (sort [(2, 'x'), (1, 'a'), (2, 'y')])",
      answer: "[1, 2, 2]",
      why: "`sort` on pairs puts key 1 first, then both key-2 pairs (`'x'` before `'y'`). After that, `groupBy` on equal keys would join the two 2s.",
    },
    {
      k: "quiz",
      q: "What is `groupBy (\\x y -> even x == even y) [2, 4, 1, 3, 6]`?",
      options: [
        "`[[2, 4, 6], [1, 3]]`",
        "`[[2, 4], [1, 3], [6]]`",
        "`[[2], [4], [1], [3], [6]]`",
        "`[[2, 4, 1, 3, 6]]`",
      ],
      answer: 1,
      why: "`groupBy` only looks at neighbours. `2` and `4` are both even, then the odds `1` and `3` form a new run, then `6` starts another even run. To gather every even together you would sort by parity first.",
    },
    {
      k: "predict",
      expr: "map fst (sortBy (comparing (negate . snd)) [(\"b\", 2), (\"a\", 2), (\"c\", 5)])",
      answer: '["c", "b", "a"]',
      why: "Highest score first (`negate . snd` flips 5, 2, 2). The two 2s keep their original order, so `b` before `a`.",
    },
    {
      k: "quiz",
      q: "You grouped pairs into `[(key, [values])]`. How many times should each key appear in that result?",
      options: [
        "Once per original pair with that key",
        "Once, with every matching value collected into the inner list",
        "Zero or one, depending on `nub`",
        "Once per distinct value",
      ],
      answer: 1,
      why: "That is the point of grouping: one row per key, and a list of the values that went with it.",
    },
    {
      k: "quiz",
      q: "Bag union of `[1, 1, 2]` and `[1, 3]` is which list (order ignored)?",
      options: ["`[1, 2, 3]`", "`[1, 1, 1, 2, 3]`", "`[1, 1, 2]`", "`[1, 3]`"],
      answer: 1,
      why: "Bags add copies: three 1s, one 2, one 3. Set union would keep a single 1.",
    },
    {
      k: "predict",
      expr: "sort (nub (map fst [(\"b\", 1), (\"a\", 2), (\"b\", 3)]))",
      answer: '["a", "b"]',
      why: "The keys are b, a, b. `nub` keeps first appearances `b` then `a`; `sort` then makes `a`, `b`. Grouping would collect `[1, 3]` under `b` and `[2]` under `a`.",
    },
    {
      k: "quiz",
      q: "Set difference `xs` minus `ys` should do what with a value that appears three times in `xs` and once in `ys`?",
      options: [
        "Leave two copies (bag difference)",
        "Remove every copy from `xs` (the value is no longer in the set)",
        "Leave three copies",
        "Leave one copy",
      ],
      answer: 1,
      why: "In a set a value is either in or not. If it is in `ys` it is gone from the difference, however many copies `xs` stored. Bag difference would subtract one copy and leave two.",
    },
    {
      k: "predict",
      expr: "length (nub (map fst [(1, 2), (1, 3), (2, 3), (1, 2)]))",
      answer: "2",
      why: "The keys (first parts) are 1, 1, 2, 1. Distinct keys: 1 and 2.",
    },
    {
      k: "write",
      setup: listTools,
      body: "Write `groupPairs`. Given a list of `(key, value)` pairs, return `[(key, [value])]` in the order the keys first appear. Values under a key keep the order they appeared.",
      starter: hs`groupPairs :: Eq a => [(a, b)] -> [(a, [b])]
groupPairs ps = undefined
`,
      tests: [
        { expr: "groupPairs [(\"b\", 1), (\"a\", 2), (\"b\", 3 :: Int)]", expected: '[("b", [1, 3]), ("a", [2])]' },
        { expr: "groupPairs ([] :: [(Int, Int)])", expected: "[]" },
        { expr: "groupPairs [(1, 'x'), (1, 'y')]", expected: "[(1, \"xy\")]" },
        { expr: "groupPairs [(7, True)]", expected: "[(7, [True])]" },
      ],
      hint: "Keys are `nub (map fst ps)`. For each key `k`, collect `[v | (k', v) <- ps, k' == k]`.",
      solution: hs`groupPairs :: Eq a => [(a, b)] -> [(a, [b])]
groupPairs ps = [(k, [v | (k', v) <- ps, k' == k]) | k <- nub (map fst ps)]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `groupSorted`. Same idea as grouping pairs, but the keys in the result must be in increasing order. Sort first, then `groupBy` on equal keys.",
      starter: hs`groupSorted :: Ord a => [(a, b)] -> [(a, [b])]
groupSorted ps = undefined
`,
      tests: [
        { expr: "groupSorted [(\"b\", 1), (\"a\", 2), (\"b\", 3 :: Int)]", expected: '[("a", [2]), ("b", [1, 3])]' },
        { expr: "groupSorted ([] :: [(Int, Char)])", expected: "[]" },
        { expr: "groupSorted [(2, 'x'), (1, 'a'), (2, 'y')]", expected: "[(1, \"a\"), (2, \"xy\")]" },
        { expr: "groupSorted [(0, 9 :: Int)]", expected: "[(0, [9])]" },
      ],
      hint: "`sortBy (comparing fst) ps`, then `groupBy (\\a b -> fst a == fst b)`, then `fst (head g)` with `map snd g`.",
      solution: hs`groupSorted :: Ord a => [(a, b)] -> [(a, [b])]
groupSorted ps =
  [(fst (head g), map snd g) | g <- groupBy (\a b -> fst a == fst b) (sortBy (comparing fst) ps)]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: listTools,
      body: "Write `byInitial`. Group non-empty words by their first letter, in the order those letters first appear. Words in each group stay in their original order.",
      starter: hs`byInitial :: [String] -> [(Char, [String])]
byInitial ws = undefined
`,
      tests: [
        { expr: "byInitial [\"cat\", \"cod\", \"ant\", \"eel\", \"ape\"]", expected: "[('c', [\"cat\", \"cod\"]), ('a', [\"ant\", \"ape\"]), ('e', [\"eel\"])]" },
        { expr: "byInitial []", expected: "[]" },
        { expr: "byInitial [\"hi\"]", expected: "[('h', [\"hi\"])]" },
        { expr: "byInitial [\"bog\", \"bat\", \"bag\"]", expected: "[('b', [\"bog\", \"bat\", \"bag\"])]" },
      ],
      hint: "Keys: `nub (map head ws)`. For letter `c`, the words are `[w | w <- ws, head w == c]`.",
      solution: hs`byInitial :: [String] -> [(Char, [String])]
byInitial ws = [(c, [w | w <- ws, head w == c]) | c <- nub (map head ws)]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `byLength`. Group words by their length. Lengths should appear in increasing order. Words of the same length stay in original order.",
      starter: hs`byLength :: [String] -> [(Int, [String])]
byLength ws = undefined
`,
      tests: [
        { expr: "byLength [\"the\", \"a\", \"fox\", \"of\", \"be\"]", expected: "[(1, [\"a\"]), (2, [\"of\", \"be\"]), (3, [\"the\", \"fox\"])]" },
        { expr: "byLength []", expected: "[]" },
        { expr: "byLength [\"zz\", \"yy\"]", expected: "[(2, [\"zz\", \"yy\"])]" },
        { expr: "byLength [\"solo\"]", expected: "[(4, [\"solo\"])]" },
      ],
      hint: "Sort with `comparing length` (stable, so original order inside a length is kept), then `groupBy` on equal lengths.",
      solution: hs`byLength :: [String] -> [(Int, [String])]
byLength ws =
  [(length (head g), g) | g <- groupBy (\a b -> length a == length b) (sortBy (comparing length) ws)]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: listTools,
      body: "Write `valuesOf k ps`, every value paired with key `k`, in the order they appear. The key itself is not returned.",
      starter: hs`valuesOf :: Eq a => a -> [(a, b)] -> [b]
valuesOf k ps = undefined
`,
      tests: [
        { expr: "valuesOf \"b\" [(\"b\", 1), (\"a\", 2), (\"b\", 3 :: Int)]", expected: "[1, 3]" },
        { expr: "valuesOf \"z\" [(\"b\", 1 :: Int)]", expected: "[]" },
        { expr: "valuesOf 1 ([] :: [(Int, Char)])", expected: "[]" },
        { expr: "valuesOf 7 [(7, 'q')]", expected: "\"q\"" },
      ],
      hint: "`[v | (k', v) <- ps, k' == k]`.",
      solution: hs`valuesOf :: Eq a => a -> [(a, b)] -> [b]
valuesOf k ps = [v | (k', v) <- ps, k' == k]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: listTools,
      body: "Write `busyKeys`, the keys that have at least two values, in first-appearance order.",
      starter: hs`busyKeys :: Eq a => [(a, b)] -> [a]
busyKeys ps = undefined
`,
      tests: [
        { expr: "busyKeys [(\"b\", 1), (\"a\", 2), (\"b\", 3 :: Int), (\"c\", 0)]", expected: '["b"]' },
        { expr: "busyKeys [(\"a\", 1 :: Int), (\"b\", 2)]", expected: "[]" },
        { expr: "busyKeys ([] :: [(Int, Int)])", expected: "[]" },
        { expr: "busyKeys [(1, 'x'), (2, 'y'), (1, 'z'), (2, 'w')]", expected: "[1, 2]" },
      ],
      hint: "For each key in `nub (map fst ps)`, keep it when it appears at least twice as a first part.",
      solution: hs`busyKeys :: Eq a => [(a, b)] -> [a]
busyKeys ps =
  [k | k <- nub (map fst ps), length [() | (k', _) <- ps, k' == k] >= 2]
`,
      banned: noMaps,
    },
    {
      k: "write",
      body: "Write `flattenGroups`, the inverse of grouping: turn `[(key, [value])]` back into `[(key, value)]`, keys in the given order, values in the inner-list order.",
      starter: hs`flattenGroups :: [(a, [b])] -> [(a, b)]
flattenGroups gs = undefined
`,
      tests: [
        { expr: "flattenGroups [(\"b\", [1, 3]), (\"a\", [2 :: Int])]", expected: '[("b", 1), ("b", 3), ("a", 2)]' },
        { expr: "flattenGroups ([] :: [(Int, [Int])])", expected: "[]" },
        { expr: "flattenGroups [(1, \"ab\")]", expected: "[(1, 'a'), (1, 'b')]" },
        { expr: "flattenGroups [(\"x\", [] :: [Int]), (\"y\", [9])]", expected: '[("y", 9)]' },
      ],
      hint: "`[(k, v) | (k, vs) <- gs, v <- vs]`.",
      solution: hs`flattenGroups :: [(a, [b])] -> [(a, b)]
flattenGroups gs = [(k, v) | (k, vs) <- gs, v <- vs]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: listTools,
      body: "Write `invertPairs`: from `[(a, b)]` build `[(b, [a])]` grouping by the original second part, in the order those seconds first appear.",
      starter: hs`invertPairs :: (Eq a, Eq b) => [(a, b)] -> [(b, [a])]
invertPairs ps = undefined
`,
      tests: [
        { expr: "invertPairs [(\"amy\", \"chess\"), (\"ben\", \"choir\"), (\"cam\", \"chess\")]", expected: '[("chess", ["amy", "cam"]), ("choir", ["ben"])]' },
        { expr: "invertPairs ([] :: [(Int, Int)])", expected: "[]" },
        { expr: "invertPairs [(1, 'x'), (2, 'x')]", expected: "[('x', [1, 2])]" },
        { expr: "invertPairs [(7, True)]", expected: "[(True, [7])]" },
      ],
      hint: "Flip, then the same grouping pattern: keys are `nub (map snd ps)`.",
      solution: hs`invertPairs :: (Eq a, Eq b) => [(a, b)] -> [(b, [a])]
invertPairs ps = [(v, [k' | (k', v') <- ps, v' == v]) | v <- nub (map snd ps)]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `bagPlus`. Each input is a sorted list of `(value, count)` with unique values and positive counts. Merge them as bags: add counts of a shared value.",
      starter: hs`bagPlus :: [(Int, Int)] -> [(Int, Int)] -> [(Int, Int)]
bagPlus xs ys = undefined
`,
      tests: [
        { expr: "bagPlus [(1, 2), (3, 1)] [(1, 1), (2, 4)]", expected: "[(1, 3), (2, 4), (3, 1)]" },
        { expr: "bagPlus [] [(5, 2)]", expected: "[(5, 2)]" },
        { expr: "bagPlus [(4, 1)] []", expected: "[(4, 1)]" },
        { expr: "bagPlus [(1, 1), (2, 1)] [(1, 1), (2, 1)]", expected: "[(1, 2), (2, 2)]" },
      ],
      hint: "Walk both. Equal values: output `(x, n + m)` and step both. Smaller value: output that pair and step that list.",
      solution: hs`bagPlus :: [(Int, Int)] -> [(Int, Int)] -> [(Int, Int)]
bagPlus [] ys = ys
bagPlus xs [] = xs
bagPlus ((x, n) : xs) ((y, m) : ys)
  | x < y = (x, n) : bagPlus xs ((y, m) : ys)
  | x > y = (y, m) : bagPlus ((x, n) : xs) ys
  | otherwise = (x, n + m) : bagPlus xs ys
`,
      banned: [...noMaps, "elem", "filter", "lookup"],
    },
    {
      k: "write",
      body: "Write `bagMinus`. Same representation as `bagPlus`. Subtract counts of the second bag from the first. Drop a value if its remaining count is 0 or less.",
      starter: hs`bagMinus :: [(Int, Int)] -> [(Int, Int)] -> [(Int, Int)]
bagMinus xs ys = undefined
`,
      tests: [
        { expr: "bagMinus [(1, 3), (2, 1)] [(1, 1), (3, 4)]", expected: "[(1, 2), (2, 1)]" },
        { expr: "bagMinus [(1, 2)] [(1, 2)]", expected: "[]" },
        { expr: "bagMinus [(1, 2)] [(1, 5)]", expected: "[]" },
        { expr: "bagMinus [(4, 1)] []", expected: "[(4, 1)]" },
        { expr: "bagMinus [] [(1, 1)]", expected: "[]" },
      ],
      hint: "Walk both. Equal: if `n - m > 0`, keep `(x, n - m)`. `x < y`: keep the left pair. `x > y`: the right value was not in the left bag, skip it.",
      solution: hs`bagMinus :: [(Int, Int)] -> [(Int, Int)] -> [(Int, Int)]
bagMinus [] _ = []
bagMinus xs [] = xs
bagMinus ((x, n) : xs) ((y, m) : ys)
  | x < y = (x, n) : bagMinus xs ((y, m) : ys)
  | x > y = bagMinus ((x, n) : xs) ys
  | n - m > 0 = (x, n - m) : bagMinus xs ys
  | otherwise = bagMinus xs ys
`,
      banned: [...noMaps, "elem", "filter", "lookup"],
    },
    {
      k: "write",
      body: "Write `setMinus xs ys`. Treat both as sets (repeats possible). Return the distinct values of `xs` that do not appear in `ys`, in first-appearance order in `xs`.",
      starter: hs`setMinus :: Eq a => [a] -> [a] -> [a]
setMinus xs ys = undefined
`,
      tests: [
        { expr: "setMinus [1, 1, 2, 3, 2] [3, 4 :: Int]", expected: "[1, 2]" },
        { expr: "setMinus \"banana\" \"an\"", expected: '"b"' },
        { expr: "setMinus [] [1 :: Int]", expected: "[]" },
        { expr: "setMinus [1, 2] ([] :: [Int])", expected: "[1, 2]" },
      ],
      hint: "Walk `xs`, keep a value if it is not in `ys` and not already kept. A helper with an accumulator of seen values works, or `nub` then `filter notElem`.",
      solution: hs`setMinus :: Eq a => [a] -> [a] -> [a]
setMinus xs ys = go xs []
  where
    go [] _ = []
    go (x : rest) seen
      | elem x ys = go rest seen
      | elem x seen = go rest seen
      | otherwise = x : go rest (x : seen)
`,
      banned: [...noMaps, "\\\\"],
    },
    {
      k: "write",
      setup: listTools,
      body: "Write `uniqueKeys`, which is `True` when no key is repeated in a list of pairs (the values may repeat).",
      starter: hs`uniqueKeys :: Eq a => [(a, b)] -> Bool
uniqueKeys ps = undefined
`,
      tests: [
        { expr: "uniqueKeys [(\"a\", 1), (\"b\", 1 :: Int)]", expected: "True" },
        { expr: "uniqueKeys [(\"a\", 1), (\"a\", 2 :: Int)]", expected: "False" },
        { expr: "uniqueKeys ([] :: [(Int, Int)])", expected: "True" },
        { expr: "uniqueKeys [(1, True), (2, True), (3, False)]", expected: "True" },
      ],
      hint: "`nub (map fst ps) == map fst ps`.",
      solution: hs`uniqueKeys :: Eq a => [(a, b)] -> Bool
uniqueKeys ps = nub (map fst ps) == map fst ps
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `withCounts`. Turn a bag into a sorted `(value, count)` table, then attach those counts back onto a grouping of pairs by taking `length` of each inner list. Here the input is already `[(key, [value])]`; return `[(key, Int)]` with the size of each group, keys in the given order.",
      starter: hs`withCounts :: [(a, [b])] -> [(a, Int)]
withCounts gs = undefined
`,
      tests: [
        { expr: "withCounts [(\"b\", [1, 3]), (\"a\", [2 :: Int])]", expected: '[("b", 2), ("a", 1)]' },
        { expr: "withCounts ([] :: [(Int, [Int])])", expected: "[]" },
        { expr: "withCounts [(0, [] :: [Int])]", expected: "[(0, 0)]" },
        { expr: "withCounts [(\"x\", \"hey\")]", expected: '[("x", 3)]' },
      ],
      hint: "`[(k, length vs) | (k, vs) <- gs]`.",
      solution: hs`withCounts :: [(a, [b])] -> [(a, Int)]
withCounts gs = [(k, length vs) | (k, vs) <- gs]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: listTools,
      body: "Write `splitByCount`. From a bag, return a pair of lists: the distinct values that appear once, then the distinct values that appear more than once. Both in first-appearance order.",
      starter: hs`splitByCount :: Eq a => [a] -> ([a], [a])
splitByCount xs = undefined
`,
      tests: [
        { expr: "splitByCount [1, 2, 1, 3, 4, 3, 3 :: Int]", expected: "([2, 4], [1, 3])" },
        { expr: "splitByCount ([] :: [Int])", expected: "([], [])" },
        { expr: "splitByCount \"pepper\"", expected: '("r", "pe")' },
        { expr: "splitByCount [9, 8, 7 :: Int]", expected: "([9, 8, 7], [])" },
      ],
      hint: "For each `x` in `nub xs`, look at `length (filter (== x) xs)` and send it to the left or the right list.",
      solution: hs`splitByCount :: Eq a => [a] -> ([a], [a])
splitByCount xs = ([x | x <- u, n x == 1], [x | x <- u, n x > 1])
  where
    u = nub xs
    n x = length (filter (== x) xs)
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: listTools,
      body: "Write `onlyCopies`, the values that appear more than once, each kept as many times as it appears, in original order.",
      starter: hs`onlyCopies :: Eq a => [a] -> [a]
onlyCopies xs = undefined
`,
      tests: [
        { expr: "onlyCopies [1, 2, 1, 3, 2 :: Int]", expected: "[1, 2, 1, 2]" },
        { expr: "onlyCopies \"pepper\"", expected: '"peppe"' },
        { expr: "onlyCopies [1, 2, 3 :: Int]", expected: "[]" },
        { expr: "onlyCopies ([] :: [Int])", expected: "[]" },
      ],
      hint: "Keep `x` when `length (filter (== x) xs) > 1`.",
      solution: hs`onlyCopies :: Eq a => [a] -> [a]
onlyCopies xs = [x | x <- xs, length (filter (== x) xs) > 1]
`,
      banned: noMaps,
    },
    {
      k: "write",
      body: "Write `zipByKey`. Both tables are sorted by key and have unique keys. Walk them together and return `(key, left, right)` for keys that appear in both.",
      starter: hs`zipByKey :: [(String, Int)] -> [(String, Int)] -> [(String, Int, Int)]
zipByKey xs ys = undefined
`,
      tests: [
        { expr: "zipByKey [(\"a\", 1), (\"c\", 3)] [(\"b\", 9), (\"c\", 4)]", expected: '[("c", 3, 4)]' },
        { expr: "zipByKey [(\"a\", 1)] [(\"a\", 2)]", expected: '[("a", 1, 2)]' },
        { expr: "zipByKey [] [(\"a\", 1)]", expected: "[]" },
        { expr: "zipByKey [(\"a\", 1), (\"b\", 2)] [(\"a\", 8), (\"b\", 9)]", expected: '[("a", 1, 8), ("b", 2, 9)]' },
      ],
      hint: "Equal keys: output the triple and step both. Smaller left key: step left. Smaller right key: step right.",
      solution: hs`zipByKey :: [(String, Int)] -> [(String, Int)] -> [(String, Int, Int)]
zipByKey [] _ = []
zipByKey _ [] = []
zipByKey ((k, v) : xs) ((j, u) : ys)
  | k < j = zipByKey xs ((j, u) : ys)
  | k > j = zipByKey ((k, v) : xs) ys
  | otherwise = (k, v, u) : zipByKey xs ys
`,
      banned: [...noMaps, "elem", "filter", "lookup"],
    },
    {
      k: "write",
      body: "Write `missingKeys`. Both key lists are sorted with no repeats. Return the keys of the first list that are not in the second, still sorted. Walk together.",
      starter: hs`missingKeys :: [String] -> [String] -> [String]
missingKeys xs ys = undefined
`,
      tests: [
        { expr: "missingKeys [\"a\", \"c\", \"d\"] [\"b\", \"c\"]", expected: '["a", "d"]' },
        { expr: "missingKeys [\"a\"] []", expected: '["a"]' },
        { expr: "missingKeys [] [\"a\"]", expected: "[]" },
        { expr: "missingKeys [\"a\", \"b\"] [\"a\", \"b\"]", expected: "[]" },
      ],
      hint: "Same walk as sorted difference.",
      solution: hs`missingKeys :: [String] -> [String] -> [String]
missingKeys [] _ = []
missingKeys xs [] = xs
missingKeys (x : xs) (y : ys)
  | x < y = x : missingKeys xs (y : ys)
  | x > y = missingKeys (x : xs) ys
  | otherwise = missingKeys xs ys
`,
      banned: [...noMaps, "elem", "filter", "\\\\", "nub"],
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `runsBy`. Given a list already arranged how you want, split it into runs of neighbours that share the same key `f`. Return `[(key, [elements])]`.",
      starter: hs`runsBy :: Eq b => (a -> b) -> [a] -> [(b, [a])]
runsBy f xs = undefined
`,
      tests: [
        { expr: "runsBy even [2, 4, 1, 3, 6]", expected: "[(True, [2, 4]), (False, [1, 3]), (True, [6])]" },
        { expr: "runsBy length [\"aa\", \"bb\", \"c\", \"ddd\"]", expected: "[(2, [\"aa\", \"bb\"]), (1, [\"c\"]), (3, [\"ddd\"])]" },
        { expr: "runsBy id ([] :: [Int])", expected: "[]" },
        { expr: "runsBy fst [(1, 'a'), (1, 'b'), (2, 'c')]", expected: "[(1, [(1, 'a'), (1, 'b')]), (2, [(2, 'c')])]" },
      ],
      hint: "`groupBy (\\x y -> f x == f y) xs`, then pair `f (head g)` with `g`.",
      solution: hs`runsBy :: Eq b => (a -> b) -> [a] -> [(b, [a])]
runsBy f xs = [(f (head g), g) | g <- groupBy (\x y -> f x == f y) xs]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: sortTools,
      body: "Write `freqDesc`. Frequency table of an Int bag, most frequent first; ties broken by smaller value first.",
      starter: hs`freqDesc :: [Int] -> [(Int, Int)]
freqDesc xs = undefined
`,
      tests: [
        { expr: "freqDesc [1, 2, 1, 3, 2, 1]", expected: "[(1, 3), (2, 2), (3, 1)]" },
        { expr: "freqDesc [4, 5, 4, 5]", expected: "[(4, 2), (5, 2)]" },
        { expr: "freqDesc []", expected: "[]" },
        { expr: "freqDesc [9]", expected: "[(9, 1)]" },
      ],
      hint: "Build `[(head g, length g) | g <- group (sort xs)]`, then `sortBy (comparing (\\(v, n) -> (negate n, v)))`.",
      solution: hs`freqDesc :: [Int] -> [(Int, Int)]
freqDesc xs =
  sortBy (comparing (\(v, n) -> (negate n, v))) [(head g, length g) | g <- group (sort xs)]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: listTools,
      body: "Write `unionAllSorted`. Each inner list is sorted with no repeats. Return the sorted union of all of them, with no repeats. You may walk two lists at a time.",
      starter: hs`unionAllSorted :: [[Int]] -> [Int]
unionAllSorted xss = undefined
`,
      tests: [
        { expr: "unionAllSorted [[1, 3], [2, 3, 4], [0, 4]]", expected: "[0, 1, 2, 3, 4]" },
        { expr: "unionAllSorted []", expected: "[]" },
        { expr: "unionAllSorted [[1, 2]]", expected: "[1, 2]" },
        { expr: "unionAllSorted [[], [5], []]", expected: "[5]" },
      ],
      hint: "Fold a two-list sorted union, starting from `[]`. Write a helper like `unionWalk` from level 2.",
      solution: hs`unionAllSorted :: [[Int]] -> [Int]
unionAllSorted xss = foldr merge [] xss
  where
    merge [] ys = ys
    merge xs [] = xs
    merge (x : xs) (y : ys)
      | x < y = x : merge xs (y : ys)
      | x > y = y : merge (x : xs) ys
      | otherwise = x : merge xs ys
`,
      banned: [...noMaps, "union", "nub"],
    },
    {
      k: "write",
      body: "Write `expandBag`. A bag is stored as a sorted list of `(value, count)` pairs with positive counts. Expand it back into a list that contains each value that many times, values in increasing order.",
      starter: hs`expandBag :: [(Int, Int)] -> [Int]
expandBag xs = undefined
`,
      tests: [
        { expr: "expandBag [(1, 2), (3, 1)]", expected: "[1, 1, 3]" },
        { expr: "expandBag []", expected: "[]" },
        { expr: "expandBag [(5, 3)]", expected: "[5, 5, 5]" },
        { expr: "expandBag [(2, 1), (4, 2)]", expected: "[2, 4, 4]" },
      ],
      hint: "`concat [replicate n v | (v, n) <- xs]`.",
      solution: hs`expandBag :: [(Int, Int)] -> [Int]
expandBag xs = concat [replicate n v | (v, n) <- xs]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: listTools,
      body: "Write `regroup`. You are given `[(key, [value])]` (keys unique). Re-group the same pairs by a function `f` of the value, producing `[(newKey, [value])]` in first-appearance order of `f value`.",
      starter: hs`regroup :: Eq c => (b -> c) -> [(a, [b])] -> [(c, [b])]
regroup f gs = undefined
`,
      tests: [
        { expr: "regroup even [(\"a\", [1, 2, 3]), (\"b\", [4 :: Int])]", expected: "[(False, [1, 3]), (True, [2, 4])]" },
        { expr: "regroup length [(\"x\", [\"hi\", \"a\"]), (\"y\", [\"to\"])]", expected: "[(2, [\"hi\", \"to\"]), (1, [\"a\"])]" },
        { expr: "regroup id ([] :: [(Int, [Int])])", expected: "[]" },
        { expr: "regroup (> 0) [(\"z\", [0, 0 :: Int])]", expected: "[(False, [0, 0])]" },
      ],
      hint: "Flatten to a list of values first, then group those values by `f` in first-appearance order of the keys `f v`.",
      solution: hs`regroup :: Eq c => (b -> c) -> [(a, [b])] -> [(c, [b])]
regroup f gs = [(k, [v | v <- vs, f v == k]) | k <- nub (map f vs)]
  where
    vs = concatMap snd gs
`,
      banned: noMaps,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 4: Exam strength
// ---------------------------------------------------------------------------

const level4: DrillSet = {
  id: "b-sets-l4",
  lesson: "",
  level: 4,
  title: "Level 4: Exam strength",
  intro: md(
    "These are worded like the papers: a small setting, given types, then \"Define a function ...\" and a GHCi transcript. Order is free only when the spec says so; then the tester accepts any order, but duplicates still count. Do not use `Data.Set` or `Data.Map`.",
    "",
    "The last eight questions are 4–5 mark problems: walking two sorted lists, grouping, bags, and combining those ideas.",
  ),
  drills: [
    {
      k: "quiz",
      q: "A spec says: \"the order of the result is unimportant.\" Your function returns `[2, 1, 2]` and the expected answer is `[1, 2]`. Does it pass?",
      options: [
        "Yes: any order is accepted, and the extra 2 is ignored",
        "No: order is free, but the two lists are still different bags",
        "Yes, because both contain 1 and 2",
        "No, because 2 should come first",
      ],
      answer: 1,
      why: "\"Order unimportant\" means the tester sorts both sides before comparing. It does not drop copies. `[1, 2, 2]` is not `[1, 2]`.",
    },
    {
      k: "predict",
      expr: "let (x : _) = [4, 8 :: Int]; (y : _) = [7, 9] in if x < y then x else y",
      answer: "4",
      why: "A union-walk step on sorted lists: 4 is smaller than 7, so 4 is the next value to keep.",
    },
    {
      k: "quiz",
      q: "An exam question asks for every student on a course, \"without duplicates, in alphabetical order.\" Which finish is right?",
      options: [
        "`nub names`",
        "`sort names`",
        "`sort (nub names)`",
        "`group names`",
      ],
      answer: 2,
      why: "`nub` removes copies but keeps first-seen order. `sort` orders them but would keep copies. You need both, and `sort` after `nub` (or `map head . group . sort`).",
    },
    {
      k: "predict",
      expr: "map head (group (sort \"garage\"))",
      answer: '"aegr"',
      why: "`sort \"garage\"` is `\"aaeggr\"`. `group` then `map head` keeps one of each letter: a, e, g, r.",
    },
    {
      k: "quiz",
      q: "The question is: \"How many different modules did amy take?\" The enrolment list has `(\"amy\", \"logic\")` twice. What should you count?",
      options: [
        "Two, because there are two rows",
        "One, because it is the same module: treat the rows as a set of courses",
        "Zero, because of the duplicate",
        "The total number of rows in the whole table",
      ],
      answer: 1,
      why: "\"Different\" means a set of course names, so the second copy of logic does not add another module.",
    },
    {
      k: "predict",
      expr: "sortBy (comparing fst) [(\"b\", 2), (\"a\", 9), (\"b\", 1)]",
      answer: '[("a", 9), ("b", 2), ("b", 1)]',
      why: "`a` first. The two `b` pairs are a tie on the key, so they stay in the original order: 2 then 1. (`sort` on the whole pair would have swapped them, because 1 < 2.)",
    },
    {
      k: "write",
      setup: enrolSetup + listTools,
      body: md(
        "A department stores enrolment as a list of `(student, course)` pairs. The given code contains `term`.",
        "",
        "Define a function `studentsOf :: Course -> Enrol -> [Name]` that returns the distinct students on that course, in the order they first appear. For example:",
        "",
        "```",
        "ghci> studentsOf \"haskell\" term",
        "[\"amy\",\"ben\"]",
        "ghci> studentsOf \"logic\" term",
        "[\"amy\",\"cam\"]",
        "```",
      ),
      starter: hs`studentsOf :: Course -> Enrol -> [Name]
studentsOf c e = undefined
`,
      tests: [
        { expr: "studentsOf \"haskell\" term", expected: '["amy", "ben"]' },
        { expr: "studentsOf \"logic\" term", expected: '["amy", "cam"]' },
        { expr: "studentsOf \"circuits\" term", expected: '["ben"]' },
        { expr: "studentsOf \"latin\" term", expected: "[]" },
      ],
      hint: "`nub [n | (n, c') <- e, c' == c]`.",
      solution: hs`studentsOf :: Course -> Enrol -> [Name]
studentsOf c e = nub [n | (n, c') <- e, c' == c]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: enrolSetup + listTools,
      body: md(
        "Using the enrolment table `term` from the given code.",
        "",
        "Define a function `coursesOf :: Name -> Enrol -> [Course]` that returns the distinct courses a student takes, alphabetical. For example:",
        "",
        "```",
        "ghci> coursesOf \"amy\" term",
        "[\"haskell\",\"logic\"]",
        "ghci> coursesOf \"ben\" term",
        "[\"circuits\",\"haskell\"]",
        "```",
      ),
      starter: hs`coursesOf :: Name -> Enrol -> [Course]
coursesOf n e = undefined
`,
      tests: [
        { expr: "coursesOf \"amy\" term", expected: '["haskell", "logic"]' },
        { expr: "coursesOf \"ben\" term", expected: '["circuits", "haskell"]' },
        { expr: "coursesOf \"cam\" term", expected: '["logic"]' },
        { expr: "coursesOf \"zed\" term", expected: "[]" },
      ],
      hint: "`sort (nub [c | (n', c) <- e, n' == n])`.",
      solution: hs`coursesOf :: Name -> Enrol -> [Course]
coursesOf n e = sort (nub [c | (n', c) <- e, n' == n])
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: shopSetup,
      body: md(
        "A shop logs the product codes sold each day. Each day's list is sorted ascending and has no repeats. The given code contains `monday` and `tuesday`.",
        "",
        "Define a function `newToday :: [Code] -> [Code] -> [Code]` that returns the codes sold on the second day but not the first, still sorted. Walk the two lists together. Do not use `elem` or `filter`. For example:",
        "",
        "```",
        "ghci> newToday monday tuesday",
        "[105,112]",
        "```",
      ),
      starter: hs`newToday :: [Code] -> [Code] -> [Code]
newToday xs ys = undefined
`,
      tests: [
        { expr: "newToday monday tuesday", expected: "[105, 112]" },
        { expr: "newToday tuesday monday", expected: "[101, 107]" },
        { expr: "newToday monday monday", expected: "[]" },
        { expr: "newToday [] [1, 2]", expected: "[1, 2]" },
        { expr: "newToday [1, 2] []", expected: "[]" },
      ],
      hint: "Sorted difference of `ys` minus `xs`: keep a right-hand head when it is smaller; skip both when equal; skip a left-hand head when it is smaller.",
      solution: hs`newToday :: [Code] -> [Code] -> [Code]
newToday _ [] = []
newToday [] ys = ys
newToday (x : xs) (y : ys)
  | y < x = y : newToday (x : xs) ys
  | y > x = newToday xs (y : ys)
  | otherwise = newToday xs ys
`,
      banned: [...noMaps, "elem", "notElem", "filter", "\\\\"],
    },
    {
      k: "write",
      setup: shopSetup,
      body: md(
        "The daily code lists are sorted with no repeats.",
        "",
        "Define a function `soldBoth :: [Code] -> [Code] -> [Code]` that returns the codes sold on both days, still sorted. Walk the lists together. For example:",
        "",
        "```",
        "ghci> soldBoth monday tuesday",
        "[104,110]",
        "```",
      ),
      starter: hs`soldBoth :: [Code] -> [Code] -> [Code]
soldBoth xs ys = undefined
`,
      tests: [
        { expr: "soldBoth monday tuesday", expected: "[104, 110]" },
        { expr: "soldBoth monday monday", expected: "monday" },
        { expr: "soldBoth [1, 2] [3, 4]", expected: "[]" },
        { expr: "soldBoth [] [1]", expected: "[]" },
      ],
      hint: "Sorted intersection: keep a value only when the heads are equal.",
      solution: hs`soldBoth :: [Code] -> [Code] -> [Code]
soldBoth [] _ = []
soldBoth _ [] = []
soldBoth (x : xs) (y : ys)
  | x < y = soldBoth xs (y : ys)
  | x > y = soldBoth (x : xs) ys
  | otherwise = x : soldBoth xs ys
`,
      banned: [...noMaps, "elem", "filter", "intersect"],
    },
    {
      k: "write",
      setup: voteSetup,
      body: md(
        "A ballot is a list of names, one vote each. The given code contains `votes`.",
        "",
        "Define a function `tally :: [String] -> [(String, Int)]` that counts the votes for each name. Names appear in alphabetical order. For example:",
        "",
        "```",
        "ghci> tally votes",
        "[(\"kim\",3),(\"lee\",2),(\"pat\",1),(\"sam\",1)]",
        "```",
      ),
      starter: hs`tally :: [String] -> [(String, Int)]
tally vs = undefined
`,
      tests: [
        { expr: "tally votes", expected: '[("kim", 3), ("lee", 2), ("pat", 1), ("sam", 1)]' },
        { expr: "tally []", expected: "[]" },
        { expr: "tally [\"a\", \"a\", \"a\"]", expected: '[("a", 3)]' },
        { expr: "tally [\"z\", \"a\"]", expected: '[("a", 1), ("z", 1)]' },
      ],
      hint: "`[(head g, length g) | g <- group (sort vs)]`.",
      solution: hs`tally :: [String] -> [(String, Int)]
tally vs = [(head g, length g) | g <- group (sort vs)]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: markSetup + sortTools,
      body: md(
        "A tutor records `(student, score)` pairs. The given code contains `marks`.",
        "",
        "Define a function `byScore :: [(Student, Score)] -> [(Student, Score)]` that sorts the table by score, highest first; students with the same score appear alphabetically. For example:",
        "",
        "```",
        "ghci> byScore marks",
        "[(\"nia\",72),(\"pia\",72),(\"omar\",55),(\"sia\",55),(\"raj\",40)]",
        "```",
      ),
      starter: hs`byScore :: [(Student, Score)] -> [(Student, Score)]
byScore xs = undefined
`,
      tests: [
        { expr: "byScore marks", expected: '[("nia", 72), ("pia", 72), ("omar", 55), ("sia", 55), ("raj", 40)]' },
        { expr: "byScore [(\"z\", 1), (\"a\", 1)]", expected: '[("a", 1), ("z", 1)]' },
        { expr: "byScore []", expected: "[]" },
        { expr: "byScore [(\"only\", 10)]", expected: '[("only", 10)]' },
      ],
      hint: "`sortBy (comparing (\\(n, s) -> (negate s, n)))`.",
      solution: hs`byScore :: [(Student, Score)] -> [(Student, Score)]
byScore xs = sortBy (comparing (\(n, s) -> (negate s, n))) xs
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: markSetup + listTools,
      body: md(
        "Using the mark table.",
        "",
        "Define a function `tiedWith :: Student -> [(Student, Score)] -> [Student]` that returns the other students who have the same score as the named student, alphabetical. If the name is missing, return `[]`. You may assume a name appears at most once. For example:",
        "",
        "```",
        "ghci> tiedWith \"nia\" marks",
        "[\"pia\"]",
        "ghci> tiedWith \"raj\" marks",
        "[]",
        "```",
      ),
      starter: hs`tiedWith :: Student -> [(Student, Score)] -> [Student]
tiedWith s xs = undefined
`,
      tests: [
        { expr: "tiedWith \"nia\" marks", expected: '["pia"]' },
        { expr: "tiedWith \"omar\" marks", expected: '["sia"]' },
        { expr: "tiedWith \"raj\" marks", expected: "[]" },
        { expr: "tiedWith \"zed\" marks", expected: "[]" },
      ],
      hint: "Look up the score, then collect other names with that score and `sort`.",
      solution: hs`tiedWith :: Student -> [(Student, Score)] -> [Student]
tiedWith s xs =
  case lookup s xs of
    Nothing -> []
    Just n -> sort [s' | (s', n') <- xs, s' /= s, n' == n]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: pairSetup,
      body: md(
        "Pairs `(key, value)` are stored in `pairs` in the given code.",
        "",
        "Define a function `collect :: [(Key, Val)] -> [(Key, [Val])]` that groups values by key. Keys appear in alphabetical order. Values under a key stay in their original order. For example:",
        "",
        "```",
        "ghci> collect pairs",
        "[(\"a\",[5,3]),(\"b\",[2,7]),(\"c\",[1])]",
        "```",
      ),
      starter: hs`collect :: [(Key, Val)] -> [(Key, [Val])]
collect ps = undefined
`,
      tests: [
        { expr: "collect pairs", expected: '[("a", [5, 3]), ("b", [2, 7]), ("c", [1])]' },
        { expr: "collect []", expected: "[]" },
        { expr: "collect [(\"z\", 1), (\"z\", 2)]", expected: '[("z", [1, 2])]' },
        { expr: "collect [(\"m\", 0)]", expected: '[("m", [0])]' },
      ],
      hint: "Sort by key with `sortBy (comparing fst)` (stable, so values keep order), then `groupBy` on equal keys.",
      solution: hs`collect :: [(Key, Val)] -> [(Key, [Val])]
collect ps =
  [(fst (head g), map snd g) | g <- groupBy (\a b -> fst a == fst b) (sortBy (comparing fst) ps)]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: listTools + hs`type Seat = Int

booked :: [Seat]
booked = [3, 5, 5, 8, 3, 10]
`,
      body: md(
        "Seat numbers that have been booked may be listed more than once.",
        "",
        "Define a function `taken :: [Seat] -> [Seat]` that returns each booked seat once, in increasing order. For example:",
        "",
        "```",
        "ghci> taken booked",
        "[3,5,8,10]",
        "```",
      ),
      starter: hs`taken :: [Seat] -> [Seat]
taken xs = undefined
`,
      tests: [
        { expr: "taken booked", expected: "[3, 5, 8, 10]" },
        { expr: "taken []", expected: "[]" },
        { expr: "taken [2, 2, 2]", expected: "[2]" },
        { expr: "taken [9, 1]", expected: "[1, 9]" },
      ],
      hint: "`map head (group (sort xs))`, importing `sort` and `group`, or `sort (nub xs)`.",
      solution: hs`taken :: [Seat] -> [Seat]
taken xs = map head (group (sort xs))
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: hs`type Track = String

liked :: [Track]
liked = ["rio", "rio", "hero", "rio", "lust"]
`,
      body: md(
        "A playlist may contain the same track more than once.",
        "",
        "Define a function `uniqueTracks :: [Track] -> [Track]` that keeps the first copy of each track and drops later repeats. For example:",
        "",
        "```",
        "ghci> uniqueTracks liked",
        "[\"rio\",\"hero\",\"lust\"]",
        "```",
      ),
      starter: hs`uniqueTracks :: [Track] -> [Track]
uniqueTracks xs = undefined
`,
      tests: [
        { expr: "uniqueTracks liked", expected: '["rio", "hero", "lust"]' },
        { expr: "uniqueTracks []", expected: "[]" },
        { expr: "uniqueTracks [\"a\"]", expected: '["a"]' },
        { expr: "uniqueTracks [\"x\", \"y\", \"x\", \"y\"]", expected: '["x", "y"]' },
      ],
      hint: "`nub`, or a recursive keep-first.",
      solution: hs`uniqueTracks :: [Track] -> [Track]
uniqueTracks [] = []
uniqueTracks (x : xs) = x : uniqueTracks (filter (/= x) xs)
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: hs`import Data.List (nub)

type Guest = String

rsvp :: [Guest]
rsvp = ["nia", "omar", "nia", "pia"]
`,
      body: md(
        "An RSVP list may contain the same guest twice.",
        "",
        "Define a function `isInvited :: Guest -> [Guest] -> Bool` and a function `guestCount :: [Guest] -> Int`. The count is how many distinct guests there are, not how many rows. For example:",
        "",
        "```",
        "ghci> isInvited \"omar\" rsvp",
        "True",
        "ghci> guestCount rsvp",
        "3",
        "```",
      ),
      starter: hs`isInvited :: Guest -> [Guest] -> Bool
isInvited g xs = undefined

guestCount :: [Guest] -> Int
guestCount xs = undefined
`,
      tests: [
        { expr: "isInvited \"omar\" rsvp", expected: "True" },
        { expr: "isInvited \"zed\" rsvp", expected: "False" },
        { expr: "guestCount rsvp", expected: "3" },
        { expr: "guestCount []", expected: "0" },
        { expr: "guestCount [\"a\", \"a\", \"a\"]", expected: "1" },
      ],
      hint: "`elem` for membership. `length (nub xs)` for the set size.",
      solution: hs`isInvited :: Guest -> [Guest] -> Bool
isInvited g xs = elem g xs

guestCount :: [Guest] -> Int
guestCount xs = length (nub xs)
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: listTools + hs`type Tag = String

postA, postB :: [Tag]
postA = ["news", "uk", "news", "sport"]
postB = ["sport", "fun", "uk"]
`,
      body: md(
        "Two posts have lists of tags. Tags on a post may repeat.",
        "",
        "Define a function `commonTags :: [Tag] -> [Tag] -> [Tag]` that returns the distinct tags that appear on both posts, in alphabetical order. For example:",
        "",
        "```",
        "ghci> commonTags postA postB",
        "[\"sport\",\"uk\"]",
        "```",
      ),
      starter: hs`commonTags :: [Tag] -> [Tag] -> [Tag]
commonTags xs ys = undefined
`,
      tests: [
        { expr: "commonTags postA postB", expected: '["sport", "uk"]' },
        { expr: "commonTags postA postA", expected: '["news", "sport", "uk"]' },
        { expr: "commonTags [] postB", expected: "[]" },
        { expr: "commonTags [\"a\"] [\"b\"]", expected: "[]" },
      ],
      hint: "`sort (nub [t | t <- xs, elem t ys])`.",
      solution: hs`commonTags :: [Tag] -> [Tag] -> [Tag]
commonTags xs ys = sort (nub [t | t <- xs, elem t ys])
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: hs`type Sample = String

run :: [Sample]
run = ["A12", "B3", "A12", "C9", "B3", "B3"]
`,
      body: md(
        "A lab logs sample IDs in the order they were processed. An ID may appear more than once.",
        "",
        "Define a function `repeatsOf :: [Sample] -> [Sample]` that returns the IDs that were processed more than once, each listed once, in the order they first appeared. For example:",
        "",
        "```",
        "ghci> repeatsOf run",
        "[\"A12\",\"B3\"]",
        "```",
      ),
      starter: hs`repeatsOf :: [Sample] -> [Sample]
repeatsOf xs = undefined
`,
      tests: [
        { expr: "repeatsOf run", expected: '["A12", "B3"]' },
        { expr: "repeatsOf [\"X\"]", expected: "[]" },
        { expr: "repeatsOf []", expected: "[]" },
        { expr: "repeatsOf [\"p\", \"q\", \"p\", \"q\", \"p\"]", expected: '["p", "q"]' },
      ],
      hint: "Walk the unique IDs in first-appearance order and keep those whose count is at least 2.",
      solution: hs`repeatsOf :: [Sample] -> [Sample]
repeatsOf xs = [x | x <- uniq, length (filter (== x) xs) > 1]
  where
    uniq = go xs
    go [] = []
    go (y : ys) = y : go (filter (/= y) ys)
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: hs`type Word' = String

line :: [Word']
line = ["the", "cat", "sat", "on", "the", "mat"]
`,
      body: md(
        "Define a function `firstIndex :: Word' -> [Word'] -> Maybe Int` that returns the 0-based position of the first copy of a word, or `Nothing` if it is missing. For example:",
        "",
        "```",
        "ghci> firstIndex \"the\" line",
        "Just 0",
        "ghci> firstIndex \"mat\" line",
        "Just 5",
        "ghci> firstIndex \"dog\" line",
        "Nothing",
        "```",
      ),
      starter: hs`firstIndex :: Word' -> [Word'] -> Maybe Int
firstIndex w xs = undefined
`,
      tests: [
        { expr: "firstIndex \"the\" line", expected: "Just 0" },
        { expr: "firstIndex \"mat\" line", expected: "Just 5" },
        { expr: "firstIndex \"dog\" line", expected: "Nothing" },
        { expr: "firstIndex \"the\" []", expected: "Nothing" },
      ],
      hint: "Walk with an index. When you see the word, return `Just i` and stop.",
      solution: hs`firstIndex :: Word' -> [Word'] -> Maybe Int
firstIndex w xs = go 0 xs
  where
    go _ [] = Nothing
    go i (y : ys)
      | y == w = Just i
      | otherwise = go (i + 1) ys
`,
      banned: [...noMaps, "elemIndex", "findIndex"],
    },
    {
      k: "write",
      setup: listTools,
      body: md(
        "Define a function `dedupSorted :: [Int] -> [Int]`. The input is already sorted. Drop adjacent copies so the result is sorted and unique. Do not use `nub`. For example:",
        "",
        "```",
        "ghci> dedupSorted [1, 1, 2, 2, 2, 5]",
        "[1,2,5]",
        "```",
      ),
      starter: hs`dedupSorted :: [Int] -> [Int]
dedupSorted xs = undefined
`,
      tests: [
        { expr: "dedupSorted [1, 1, 2, 2, 2, 5]", expected: "[1, 2, 5]" },
        { expr: "dedupSorted []", expected: "[]" },
        { expr: "dedupSorted [3]", expected: "[3]" },
        { expr: "dedupSorted [4, 4, 4]", expected: "[4]" },
      ],
      hint: "`map head (group xs)` is enough because the list is already sorted.",
      solution: hs`dedupSorted :: [Int] -> [Int]
dedupSorted xs = map head (group xs)
`,
      banned: [...noMaps, "nub", "nubBy"],
    },
    {
      k: "write",
      setup: listTools,
      body: md(
        "Define a function `authors :: [(String, String)] -> [String]` that, given `(title, author)` pairs, returns the distinct authors in alphabetical order. For example:",
        "",
        "```",
        "ghci> authors [(\"Dune\", \"Herbert\"), (\"Emma\", \"Austen\"), (\"Dune Messiah\", \"Herbert\")]",
        "[\"Austen\",\"Herbert\"]",
        "```",
      ),
      starter: hs`authors :: [(String, String)] -> [String]
authors ps = undefined
`,
      tests: [
        { expr: "authors [(\"Dune\", \"Herbert\"), (\"Emma\", \"Austen\"), (\"Dune Messiah\", \"Herbert\")]", expected: '["Austen", "Herbert"]' },
        { expr: "authors []", expected: "[]" },
        { expr: "authors [(\"a\", \"Z\"), (\"b\", \"A\")]", expected: '["A", "Z"]' },
        { expr: "authors [(\"x\", \"Poe\")]", expected: '["Poe"]' },
      ],
      hint: "`sort (nub (map snd ps))`.",
      solution: hs`authors :: [(String, String)] -> [String]
authors ps = sort (nub (map snd ps))
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: shopSetup,
      body: md(
        "The two daily code lists are sorted with no repeats.",
        "",
        "Define a function `splitCodes :: [Code] -> [Code] -> ([Code], [Code], [Code])` that returns three sorted lists: codes only on the first day, codes on both days, codes only on the second day. Walk the two lists together once. Do not use `elem` or `filter`. For example:",
        "",
        "```",
        "ghci> splitCodes monday tuesday",
        "([101,107],[104,110],[105,112])",
        "```",
        "",
        "[5 marks]",
      ),
      starter: hs`splitCodes :: [Code] -> [Code] -> ([Code], [Code], [Code])
splitCodes xs ys = undefined
`,
      tests: [
        { expr: "splitCodes monday tuesday", expected: "([101, 107], [104, 110], [105, 112])" },
        { expr: "splitCodes [] [1, 2]", expected: "([], [], [1, 2])" },
        { expr: "splitCodes [1, 2] []", expected: "([1, 2], [], [])" },
        { expr: "splitCodes [1, 2] [1, 2]", expected: "([], [1, 2], [])" },
        { expr: "splitCodes [1, 4] [2, 3, 5]", expected: "([1, 4], [], [2, 3, 5])" },
      ],
      hint: "Three-way walk. `x < y`: `x` is only on the left. `x > y`: `y` is only on the right. Equal: it is in both. Use a `where` to unpack the recursive triple.",
      solution: hs`splitCodes :: [Code] -> [Code] -> ([Code], [Code], [Code])
splitCodes [] ys = ([], [], ys)
splitCodes xs [] = (xs, [], [])
splitCodes (x : xs) (y : ys)
  | x < y = (x : a, b, c)
  | x > y = (d, e, y : f)
  | otherwise = (g, x : h, i)
  where
    (a, b, c) = splitCodes xs (y : ys)
    (d, e, f) = splitCodes (x : xs) ys
    (g, h, i) = splitCodes xs ys
`,
      banned: [...noMaps, "elem", "notElem", "filter", "union", "intersect", "\\\\"],
    },
    {
      k: "write",
      setup: voteSetup,
      body: md(
        "Using the ballot `votes`.",
        "",
        "Define a function `winners :: [String] -> [String]` that returns every name that has the highest number of votes. If several names tie for first, return all of them, alphabetical. The empty ballot has no winners. For example:",
        "",
        "```",
        "ghci> winners votes",
        "[\"kim\"]",
        "ghci> winners [\"a\", \"b\", \"a\", \"b\"]",
        "[\"a\",\"b\"]",
        "```",
        "",
        "[4 marks]",
      ),
      starter: hs`winners :: [String] -> [String]
winners vs = undefined
`,
      tests: [
        { expr: "winners votes", expected: '["kim"]' },
        { expr: "winners [\"a\", \"b\", \"a\", \"b\"]", expected: '["a", "b"]' },
        { expr: "winners []", expected: "[]" },
        { expr: "winners [\"z\", \"a\", \"z\"]", expected: '["z"]' },
        { expr: "winners [\"p\"]", expected: '["p"]' },
      ],
      hint: "Group after sorting. The maximum `length` of those groups is the top count. Keep `head g` for groups of that length (they are already alphabetical).",
      solution: hs`winners :: [String] -> [String]
winners [] = []
winners vs = [head g | g <- gs, length g == m]
  where
    gs = group (sort vs)
    m = maximum (map length gs)
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: wordSetup,
      body: md(
        "Two words are anagrams if they contain the same letters with the same counts (order ignored).",
        "",
        "Define a function `anagramGroups :: [String] -> [[String]]` that groups a list of words into anagram families. Inside a family, words are alphabetical. Families appear in alphabetical order of their sorted-letter key (so `\"abc\"` before `\"abt\"` before `\"aet\"`). Do not drop singleton families. For example:",
        "",
        "```",
        "ghci> anagramGroups words1",
        "[[\"cab\"],[\"bat\",\"tab\"],[\"ate\",\"eat\",\"tea\"]]",
        "```",
        "",
        "[5 marks]",
      ),
      starter: hs`anagramGroups :: [String] -> [[String]]
anagramGroups ws = undefined
`,
      tests: [
        { expr: "anagramGroups words1", expected: '[["cab"], ["bat", "tab"], ["ate", "eat", "tea"]]' },
        { expr: "anagramGroups []", expected: "[]" },
        { expr: "anagramGroups [\"aa\", \"a\"]", expected: '[["a"], ["aa"]]' },
        { expr: "anagramGroups [\"dog\", \"god\", \"odg\"]", expected: '[["dog", "god", "odg"]]' },
      ],
      hint: "Pair each word with `sort w`. Sort those pairs by the key, `groupBy` equal keys, `sort` the words in each group. Groups are already in key order.",
      solution: hs`anagramGroups :: [String] -> [[String]]
anagramGroups ws =
  [sort (map snd g) | g <- groupBy (\a b -> fst a == fst b) keyed]
  where
    keyed = sortBy (comparing fst) [(sort w, w) | w <- ws]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: hs`
type Val = Int
type Count = Int
type Bag = [(Val, Count)]
`,
      body: md(
        "A bag of integers is stored as a sorted list of `(value, count)` pairs, each value at most once, each count positive.",
        "",
        "Define a function `mergeBags :: Bag -> Bag -> Bag` that adds the two bags: counts of a shared value are summed. The result must be sorted by value. For example:",
        "",
        "```",
        "ghci> mergeBags [(1, 2), (4, 1)] [(1, 3), (2, 1)]",
        "[(1,5),(2,1),(4,1)]",
        "```",
        "",
        "[4 marks]",
      ),
      starter: hs`mergeBags :: Bag -> Bag -> Bag
mergeBags xs ys = undefined
`,
      tests: [
        { expr: "mergeBags [(1, 2), (4, 1)] [(1, 3), (2, 1)]", expected: "[(1, 5), (2, 1), (4, 1)]" },
        { expr: "mergeBags [] [(3, 1)]", expected: "[(3, 1)]" },
        { expr: "mergeBags [(3, 1)] []", expected: "[(3, 1)]" },
        { expr: "mergeBags [(1, 1), (2, 1)] [(1, 1), (2, 1)]", expected: "[(1, 2), (2, 2)]" },
        { expr: "mergeBags [(5, 2)] [(6, 1)]", expected: "[(5, 2), (6, 1)]" },
      ],
      hint: "Walk both tables. Equal values: emit `(x, n + m)`. Smaller value: emit that pair and step that side.",
      solution: hs`mergeBags :: Bag -> Bag -> Bag
mergeBags [] ys = ys
mergeBags xs [] = xs
mergeBags ((x, n) : xs) ((y, m) : ys)
  | x < y = (x, n) : mergeBags xs ((y, m) : ys)
  | x > y = (y, m) : mergeBags ((x, n) : xs) ys
  | otherwise = (x, n + m) : mergeBags xs ys
`,
      banned: [...noMaps, "elem", "filter", "lookup"],
    },
    {
      k: "write",
      setup: clubSetup,
      body: md(
        "People sign up to clubs. The given table `signups` maps each person to the clubs they joined.",
        "",
        "Define a function `membersOf :: [(Person, [Club])] -> [(Club, [Person])]` that inverts the table. Clubs appear alphabetically. The people in each club appear alphabetically, with no repeats. For example:",
        "",
        "```",
        "ghci> membersOf signups",
        "[(\"chess\",[\"amy\",\"cam\",\"dot\"]),(\"choir\",[\"amy\",\"ben\"]),(\"drama\",[\"cam\",\"dot\"])]",
        "```",
        "",
        "[5 marks]",
      ),
      starter: hs`membersOf :: [(Person, [Club])] -> [(Club, [Person])]
membersOf t = undefined
`,
      tests: [
        { expr: "membersOf signups", expected: '[("chess", ["amy", "cam", "dot"]), ("choir", ["amy", "ben"]), ("drama", ["cam", "dot"])]' },
        { expr: "membersOf []", expected: "[]" },
        { expr: "membersOf [(\"nia\", [])]", expected: "[]" },
        { expr: "membersOf [(\"a\", [\"z\"]), (\"b\", [\"z\", \"m\"])]", expected: '[("m", ["b"]), ("z", ["a", "b"])]' },
      ],
      hint: "All clubs: `sort (nub (concatMap snd t))`. For a club `c`, people are `sort (nub [p | (p, cs) <- t, elem c cs])`.",
      solution: hs`membersOf :: [(Person, [Club])] -> [(Club, [Person])]
membersOf t =
  [(c, sort (nub [p | (p, cs) <- t, elem c cs])) | c <- sort (nub (concatMap snd t))]
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: hs`type Need = Int
type Stream = [Int]
`,
      body: md(
        "You are watching a stream of numbers and you have a set of values you still need to see.",
        "",
        "Define a function `firstCover :: [Need] -> Stream -> Maybe Stream` that returns the shortest prefix of the stream which contains every value of the need-list at least once (order and repeats in the need-list do not matter). If no prefix covers the set, return `Nothing`. An empty need-list is covered by the empty prefix. For example:",
        "",
        "```",
        "ghci> firstCover [2, 5] [1, 2, 3, 2, 5, 9]",
        "Just [1,2,3,2,5]",
        "ghci> firstCover [8] [1, 2, 3]",
        "Nothing",
        "```",
        "",
        "[5 marks]",
      ),
      starter: hs`firstCover :: [Need] -> Stream -> Maybe Stream
firstCover need xs = undefined
`,
      tests: [
        { expr: "firstCover [2, 5] [1, 2, 3, 2, 5, 9]", expected: "Just [1, 2, 3, 2, 5]" },
        { expr: "firstCover [8] [1, 2, 3]", expected: "Nothing" },
        { expr: "firstCover [] [1, 2]", expected: "Just []" },
        { expr: "firstCover [1, 1, 2] [2, 1]", expected: "Just [2, 1]" },
        { expr: "firstCover [3] [3]", expected: "Just [3]" },
        { expr: "firstCover [1, 2] []", expected: "Nothing" },
      ],
      hint: "If `need` is empty, `Just []`. Otherwise grow a prefix until `all (\\n -> elem n prefix) need`.",
      solution: hs`firstCover :: [Need] -> Stream -> Maybe Stream
firstCover need xs
  | null need = Just []
  | otherwise = go [] xs
  where
    covered acc = all (\n -> elem n acc) need
    go _ [] = Nothing
    go acc (y : ys)
      | covered (y : acc) = Just (reverse (y : acc))
      | otherwise = go (y : acc) ys
`,
      banned: noMaps,
    },
    {
      k: "write",
      setup: priceSetup,
      body: md(
        "Two shops publish sorted price lists `(item, pence)` with unique item names, alphabetical.",
        "",
        "Define a function `alignPrices :: [(Item, Pence)] -> [(Item, Pence)] -> [(Item, Maybe Pence, Maybe Pence)]` that walks both lists together and returns one row per item that appears in either list. A missing side is `Nothing`. For example:",
        "",
        "```",
        "ghci> alignPrices shelfA shelfB",
        "[(\"bread\",Just 120,Nothing),(\"eggs\",Just 180,Just 170),(\"flour\",Nothing,Just 80),(\"milk\",Just 95,Just 95)]",
        "```",
        "",
        "[5 marks]",
      ),
      starter: hs`alignPrices :: [(Item, Pence)] -> [(Item, Pence)] -> [(Item, Maybe Pence, Maybe Pence)]
alignPrices xs ys = undefined
`,
      tests: [
        {
          expr: "alignPrices shelfA shelfB",
          expected: '[("bread", Just 120, Nothing), ("eggs", Just 180, Just 170), ("flour", Nothing, Just 80), ("milk", Just 95, Just 95)]',
        },
        { expr: "alignPrices [] [(\"a\", 1)]", expected: '[("a", Nothing, Just 1)]' },
        { expr: "alignPrices [(\"a\", 1)] []", expected: '[("a", Just 1, Nothing)]' },
        { expr: "alignPrices [] []", expected: "[]" },
        { expr: "alignPrices [(\"a\", 1), (\"b\", 2)] [(\"a\", 9), (\"b\", 8)]", expected: '[("a", Just 1, Just 9), ("b", Just 2, Just 8)]' },
      ],
      hint: "Walk both. Smaller left key: `Just` on the left, `Nothing` on the right. Smaller right key: the other way. Equal keys: both `Just`.",
      solution: hs`alignPrices :: [(Item, Pence)] -> [(Item, Pence)] -> [(Item, Maybe Pence, Maybe Pence)]
alignPrices [] ys = [(k, Nothing, Just v) | (k, v) <- ys]
alignPrices xs [] = [(k, Just v, Nothing) | (k, v) <- xs]
alignPrices ((k, v) : xs) ((j, u) : ys)
  | k < j = (k, Just v, Nothing) : alignPrices xs ((j, u) : ys)
  | k > j = (j, Nothing, Just u) : alignPrices ((k, v) : xs) ys
  | otherwise = (k, Just v, Just u) : alignPrices xs ys
`,
      banned: [...noMaps, "elem", "filter", "lookup"],
    },
    {
      k: "write",
      setup: cohortSetup + listTools,
      body: md(
        "A class list is rows of `(name, year, tutor)`. The given code contains `classList`.",
        "",
        "Define a function `cohorts :: [Row] -> [(Year, [(Tutor, [Name])])]` that groups students by year (increasing), and inside each year by tutor (alphabetical). Names in each tutor group are alphabetical. Empty years or tutors should not appear. For example:",
        "",
        "```",
        "ghci> cohorts classList",
        "[(1,[(\"nina\",[\"cam\"]),(\"ravi\",[\"amy\",\"dot\"])]),(2,[(\"nina\",[\"ben\",\"fay\"]),(\"ravi\",[\"eli\"])])]",
        "```",
        "",
        "[5 marks]",
      ),
      starter: hs`cohorts :: [Row] -> [(Year, [(Tutor, [Name])])]
cohorts rs = undefined
`,
      tests: [
        {
          expr: "cohorts classList",
          expected: '[(1, [("nina", ["cam"]), ("ravi", ["amy", "dot"])]), (2, [("nina", ["ben", "fay"]), ("ravi", ["eli"])])]',
        },
        { expr: "cohorts []", expected: "[]" },
        { expr: "cohorts [(\"x\", 3, \"ann\")]", expected: '[(3, [("ann", ["x"])])]' },
        {
          expr: "cohorts [(\"b\", 1, \"t\"), (\"a\", 1, \"t\")]",
          expected: '[(1, [("t", ["a", "b"])])]',
        },
      ],
      hint: "Years: `sort (nub [y | (_, y, _) <- rs])`. For a year, tutors: `sort (nub [t | (_, y, t) <- rs, y == year])`. Names: `sort [n | (n, y, t') <- rs, y == year, t' == t]`.",
      solution: hs`cohorts :: [Row] -> [(Year, [(Tutor, [Name])])]
cohorts rs =
  [(y, [(t, names y t) | t <- tutors y]) | y <- years]
  where
    years = sort (nub [y | (_, y, _) <- rs])
    tutors y = sort (nub [t | (_, y', t) <- rs, y' == y])
    names y t = sort [n | (n, y', t') <- rs, y' == y, t' == t]
`,
      banned: noMaps,
    },
  ],
};

export const book: Book = {
  id: "b-sets",
  order: 10,
  title: "Sets, sorting and grouping",
  blurb: "Lists as sets and bags: nub, elem, walking two sorted lists for union, intersection and difference, sortBy and comparing, group and groupBy, frequencies, and grouping by a key.",
  sets: [level1, level2, level3, level4],
};
