import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "y2010",
  year: 2010,
  title: "String Matching and Suffix Trees",
  summary: "Find where a word occurs inside a text, first by checking every suffix, then by searching and building a suffix tree.",
  skills: [
    "string processing",
    "recursion over lists",
    "list comprehensions",
    "zip with indices",
    "recursion over rose trees",
    "concatMap",
    "tuples as multiple results",
    "foldl",
  ],
  story: md(
    "## Prefixes, suffixes and substrings",
    "",
    "Three words you need, using the string \"banana\":",
    "",
    "- A prefix is a piece from the START of a string: `\"\"`, `\"b\"`, `\"ba\"`, `\"ban\"`, ... `\"banana\"`.",
    "- A suffix is a piece from the END of a string: `\"a\"`, `\"na\"`, `\"ana\"`, ... `\"banana\"`.",
    "- A substring is any unbroken piece from anywhere: `\"nan\"` is a substring of \"banana\", `\"bnn\"` is not.",
    "",
    "The key fact: a substring is always a prefix of some suffix. Every suffix starts at some position, and if `s` occurs at position i then `s` is a prefix of the suffix that starts at i. Positions (indices) count from 0.",
    "",
    "```",
    hs`index  suffix
  0    banana
  1    anana      "an" is a prefix of this one...
  2    nana
  3    ana        ...and of this one, so "an" occurs at 1 and 3
  4    na
  5    a`,
    "```",
    "",
    "That gives the simple (\"naive\") way to search: try every suffix. It works, but can be slow for long texts. A suffix tree is a data structure that makes searching much faster.",
    "",
    "## Suffix trees",
    "",
    "A suffix tree stores all the suffixes of a text in one tree. The edges going down are labelled with strings. Reading the labels along any path from the top to a leaf spells out exactly one suffix, and the leaf holds the index where that suffix starts. Suffixes that start the same way share the start of their path.",
    "",
    "Here is the suffix tree for \"banana\":",
    "",
    "```",
    hs`                  (root)
      "banana"/     | "a"         \ "na"
             0      *               *
              "na" / \ ""    "na" /  \ ""
                  *   5          2    4
            "na" / \ ""
                1   3`,
    "```",
    "",
    "Follow \"a\" then \"na\" then \"na\" to reach leaf 1: that spells \"anana\", the suffix at index 1. Follow \"a\" then \"\" to reach leaf 5: \"a\", the suffix at index 5. Every inner node (*) is a substring that occurs more than once: the node under \"a\" means \"a\" occurs at 1, 3 and 5.",
    "",
    "In Haskell:",
    "",
    "```",
    hs`data SuffixTree = Leaf Int | Node [(String, SuffixTree)]
  deriving (Eq, Ord, Show)`,
    "```",
    "",
    "- `Leaf i` is a leaf holding the starting index `i` of one suffix.",
    "- `Node subtrees` is an inner node. It can have any number of children, each paired with the string labelling the edge down to it. The order of the children doesn't matter.",
    "",
    "The setup defines `s1 = \"banana\"` with its tree `t1`, and `s2 = \"mississippi\"` with its tree `t2`.",
    "",
    "## Searching a suffix tree",
    "",
    "To find a search string `s`, compare it with the label `a` of each child of the root, checking these cases in order:",
    "",
    "1. `s` is a prefix of `a`: found! Every leaf below that child is a match.",
    "2. `a` is a prefix of `s`: go down into that child and keep searching for what's left of `s` after removing `a`.",
    "3. Neither: this child can't contain `s`, so skip it.",
    "",
    "For example, searching \"iss\" in \"mississippi\": the label \"i\" is a prefix of \"iss\" (case 2), so go down with \"ss\". There \"ss\" is a prefix of the label \"ssi\" (case 1), so all leaves below match: 1 and 4.",
  ),
  notes: md(
    "Parts I to III are worth 24 of 25 marks. The prize question (Part IV) is worth 1 mark, and there's 1 bonus mark for writing and using `partition` in Part II.",
    "",
    "Part I (12 marks) is short string functions: do it quickly and carefully, it's almost half the paper. `suffixes` is worth a surprising 4 marks, and both `isSubstring` and `findSubstrings` must be written in terms of `isPrefix` and `suffixes` as the spec asks.",
    "",
    "Part II: `getIndices` is a small tree recursion. For `findSubstrings'` the three cases must be tested in the order given, and the leaf case needs care: reaching `Leaf i` with nothing left to find means a match `[i]`, otherwise `[]`.",
    "",
    "Part III: `insert` is the hardest part. Writing `partition` first (the bonus) makes it much easier, so it's worth doing even if you don't care about the bonus. Test `insert` by building `buildTree s1` and comparing with `t1` (children may come out in a different order, which is fine).",
    "",
    "Traps:",
    "",
    "- `suffixes \"perl\"` does NOT include the empty string.",
    "- An empty label `\"\"` is a prefix of everything. In `findSubstrings'` this is fine as long as you handle the leaf case correctly.",
    "- Don't import `Data.List` unqualified for `partition` or `insert`: you are defining functions with those names yourself.",
  ),
  setup: hs`import Data.List (sort)

data SuffixTree = Leaf Int | Node [(String, SuffixTree)]
  deriving (Eq, Ord, Show)

buildTree :: String -> SuffixTree
buildTree s
  = foldl (flip insert) (Node []) (zip (suffixes s) [0..])

------------------------------------------------------
-- Examples

s1 :: String
s1
  = "banana"

s2 :: String
s2
  = "mississippi"

t1 :: SuffixTree
t1
  = Node [("banana", Leaf 0),
          ("a", Node [("na", Node [("na", Leaf 1),
                                   ("", Leaf 3)]),
                     ("", Leaf 5)]),
          ("na", Node [("na", Leaf 2),
                       ("", Leaf 4)])]

t2 :: SuffixTree
t2
  = Node [("mississippi", Leaf 0),
          ("i", Node [("ssi", Node [("ssippi", Leaf 1),
                                    ("ppi", Leaf 4)]),
                      ("ppi", Leaf 7),
                      ("", Leaf 10)]),
          ("s", Node [("si", Node [("ssippi", Leaf 2),
                                   ("ppi", Leaf 5)]),
                      ("i", Node [("ssippi", Leaf 3),
                                  ("ppi", Leaf 6)])]),
          ("p", Node [("pi", Leaf 8),
                      ("i", Leaf 9)])]

------------------------------------------------------
-- Test helper (not part of the exam): sorts the children of every
-- node, so that trees can be compared ignoring the order of subtrees.

canon :: SuffixTree -> SuffixTree
canon (Leaf i)
  = Leaf i
canon (Node ts)
  = Node (sort [(a, canon t) | (a, t) <- ts])
`,
  starter: hs`-- Part I

isPrefix :: String -> String -> Bool
isPrefix = undefined

removePrefix :: String -> String -> String
removePrefix = undefined

suffixes :: [a] -> [[a]]
suffixes = undefined

isSubstring :: String -> String -> Bool
isSubstring = undefined

findSubstrings :: String -> String -> [Int]
findSubstrings = undefined

-- Part II

getIndices :: SuffixTree -> [Int]
getIndices = undefined

findSubstrings' :: String -> SuffixTree -> [Int]
findSubstrings' = undefined

-- Optional (bonus mark)
partition :: Eq a => [a] -> [a] -> ([a], [a], [a])
partition = undefined

-- Part III

insert :: (String, Int) -> SuffixTree -> SuffixTree
insert = undefined

-- Part IV

longestRepeatedSubstring :: SuffixTree -> String
longestRepeatedSubstring = undefined
`,
  tasks: [
    {
      id: "isprefix",
      name: "isPrefix",
      part: "Part I",
      marks: 1,
      prompt: md(
        "Write `isPrefix :: String -> String -> Bool`, which is True exactly when the first string is a prefix of (appears at the start of) the second.",
        "",
        "```",
        hs`*Main> isPrefix "has" "haskell"
True
*Main> isPrefix "" "haskell"
True
*Main> isPrefix "haskell" "has"
False
*Main> isPrefix "ask" "haskell"
False`,
        "```",
      ),
      hints: [
        "Either recursion on both strings at once, or compare the first string with the right-sized front piece of the second.",
        "With `take`: `s` is a prefix of `t` when the first `length s` characters of `t` are exactly `s`.",
        "The empty string is a prefix of everything, and nothing longer than `t` can be a prefix of `t`. `take` handles both automatically.",
        "`isPrefix s t = take (length s) t == s`",
      ],
      solution: hs`isPrefix :: String -> String -> Bool
isPrefix s t
  = take (length s) t == s`,
      tests: [
        { expr: 'isPrefix "has" "haskell"', expected: "True" },
        { expr: 'isPrefix "" "haskell"', expected: "True" },
        { expr: 'isPrefix "haskell" "has"', expected: "False" },
        { expr: 'isPrefix "ask" "haskell"', expected: "False" },
        { expr: 'isPrefix "haskell" "haskell"', expected: "True" },
        { expr: 'isPrefix "" ""', expected: "True" },
        { expr: 'isPrefix "a" ""', expected: "False" },
      ],
    },
    {
      id: "removeprefix",
      name: "removePrefix",
      part: "Part I",
      marks: 1,
      prompt: md(
        "Write `removePrefix :: String -> String -> String`, which removes the prefix (first argument) from the front of the second string. A precondition is that the first string really is a prefix of the second.",
        "",
        "```",
        hs`*Main> removePrefix "ja" "java"
"va"
*Main> removePrefix "" "java"
"java"`,
        "```",
      ),
      hints: [
        "Because of the precondition you don't need to check anything: you only need to know how long the prefix is.",
        "Which Prelude function throws away the first n elements of a list?",
        "`drop`. The precondition means the characters dropped are exactly the prefix.",
        "`removePrefix s t = drop (length s) t`",
      ],
      solution: hs`removePrefix :: String -> String -> String
removePrefix s t
  = drop (length s) t`,
      tests: [
        { expr: 'removePrefix "ja" "java"', expected: '"va"' },
        { expr: 'removePrefix "" "java"', expected: '"java"' },
        { expr: 'removePrefix "java" "java"', expected: '""' },
        { expr: 'removePrefix "mis" "mississippi"', expected: '"sissippi"' },
        { expr: 'removePrefix "" ""', expected: '""' },
        { expr: 'removePrefix "h" "has"', expected: '"as"' },
      ],
    },
    {
      id: "suffixes",
      name: "suffixes",
      part: "Part I",
      marks: 4,
      prompt: md(
        "Write `suffixes :: [a] -> [[a]]`, which returns all the suffixes of a list, longest first. The empty list is NOT included.",
        "",
        "```",
        hs`*Main> suffixes "perl"
["perl","erl","rl","l"]`,
        "```",
        "",
        "The order matters here (longest first). The type is polymorphic, so it must work on any list, not only strings.",
      ),
      hints: [
        "Each suffix is the `tail` of the one before. Either use simple recursion or the Prelude's `iterate` / `takeWhile`.",
        "Recursion: the suffixes of `[]` are `[]`. The suffixes of `x : xs` are the whole list `x : xs` followed by the suffixes of `xs`.",
        "Make sure the base case gives `[]`, not `[[]]`, otherwise you get an empty string at the end.",
        md(
          "```",
          hs`suffixes [] = []
suffixes xs = xs : suffixes (tail xs)`,
          "```",
          "",
          "or `suffixes = takeWhile (not . null) . iterate tail`",
        ),
      ],
      solution: hs`suffixes :: [a] -> [[a]]
suffixes []
  = []
suffixes xs
  = xs : suffixes (tail xs)`,
      tests: [
        { expr: 'suffixes "perl"', expected: '["perl","erl","rl","l"]' },
        { expr: 'suffixes ""', expected: "[]" },
        { expr: 'suffixes "a"', expected: '["a"]' },
        { expr: "suffixes s1", expected: '["banana","anana","nana","ana","na","a"]' },
        { expr: "suffixes [1,2,3 :: Int]", expected: "[[1,2,3],[2,3],[3]]" },
        { expr: "length (suffixes s2)", expected: "11" },
      ],
    },
    {
      id: "issubstring",
      name: "isSubstring",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Using `isPrefix` and `suffixes`, write `isSubstring :: String -> String -> Bool`, which is True exactly when the first string occurs somewhere inside the second.",
        "",
        "```",
        hs`*Main> isSubstring "ho" "python"
True
*Main> isSubstring "thong" "python"
False`,
        "```",
      ),
      hints: [
        "A substring is a prefix of some suffix. You need \"is there at least one suffix for which ... holds?\"",
        "The Prelude function `any` takes a test and a list and says whether at least one element passes.",
        "The test to apply to each suffix is `isPrefix s` (a partial application: `isPrefix` with its first argument filled in).",
        "`isSubstring s t = any (isPrefix s) (suffixes t)`",
      ],
      solution: hs`isSubstring :: String -> String -> Bool
isSubstring s t
  = any (isPrefix s) (suffixes t)`,
      tests: [
        { expr: 'isSubstring "ho" "python"', expected: "True" },
        { expr: 'isSubstring "thong" "python"', expected: "False" },
        { expr: 'isSubstring "python" "python"', expected: "True" },
        { expr: 'isSubstring "n" "python"', expected: "True", label: "the very last character" },
        { expr: 'isSubstring "p" "python"', expected: "True", label: "the very first character" },
        { expr: 'isSubstring "ssis" "mississippi"', expected: "True" },
        { expr: 'isSubstring "sss" "mississippi"', expected: "False" },
        { expr: 'isSubstring "pythons" "python"', expected: "False" },
      ],
    },
    {
      id: "findsubstrings",
      name: "findSubstrings",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Using `isPrefix` and `suffixes`, write `findSubstrings :: String -> String -> [Int]`, which returns the indices of ALL the places where the first string occurs in the second (the naive method: check every suffix). If there are none, return `[]`. Indices count from 0, and the order of the result doesn't matter.",
        "",
        "```",
        hs`*Main> findSubstrings "an" "banana"
[1,3]
*Main> findSubstrings "s" "mississippi"
[2,3,5,6]`,
        "```",
      ),
      hints: [
        "Pair each suffix with the index where it starts, then keep the indices of the suffixes that start with the search string.",
        "`zip (suffixes t) [0..]` pairs every suffix with its starting index: `[(\"banana\",0),(\"anana\",1),...]`.",
        "A list comprehension can both filter (keep only suffixes where `isPrefix s suffix`) and pick out just the index.",
        "`findSubstrings s t = [i | (suffix, i) <- zip (suffixes t) [0..], isPrefix s suffix]`",
      ],
      solution: hs`findSubstrings :: String -> String -> [Int]
findSubstrings s t
  = [i | (suffix, i) <- zip (suffixes t) [0..], isPrefix s suffix]`,
      tests: [
        { expr: 'findSubstrings "an" "banana"', expected: "[1,3]", unordered: true },
        { expr: 'findSubstrings "s" "mississippi"', expected: "[2,3,5,6]", unordered: true },
        { expr: 'findSubstrings "is" "mississippi"', expected: "[1,4]", unordered: true },
        { expr: 'findSubstrings "issi" "mississippi"', expected: "[1,4]", unordered: true, label: "overlapping occurrences both count" },
        { expr: 'findSubstrings "xyz" "banana"', expected: "[]" },
        { expr: 'findSubstrings "banana" "banana"', expected: "[0]" },
        { expr: 'findSubstrings "a" "banana"', expected: "[1,3,5]", unordered: true },
        { expr: 'findSubstrings "s" "i miss mississippi"', expected: "[4,5,9,10,12,13]", unordered: true },
        { expr: 'findSubstrings "is" "i miss mississippi"', expected: "[3,8,11]", unordered: true },
        { expr: 'findSubstrings "issi" "i miss mississippi"', expected: "[8,11]", unordered: true },
      ],
    },
    {
      id: "getindices",
      name: "getIndices",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Write `getIndices :: SuffixTree -> [Int]`, which returns all the indices stored in the leaves of a suffix tree. The order doesn't matter.",
        "",
        "```",
        hs`*Main> getIndices (Node [("",Leaf 4),("",Leaf 1)])
[4,1]
*Main> getIndices t1
[0,1,3,5,2,4]`,
        "```",
        "",
        "(Any order is fine: `[1,4]` and `[0,1,2,3,4,5]` are just as good.)",
      ),
      hints: [
        "Recursion over the tree, one equation per constructor.",
        "A `Leaf i` gives `[i]`. A `Node` gives all the indices from all of its subtrees joined together.",
        "Each child is a `(label, subtree)` pair; you only need the subtree (`snd`). `concatMap` applies a function to each element and joins the resulting lists.",
        md(
          "```",
          hs`getIndices (Leaf i)  = [i]
getIndices (Node ts) = concatMap (getIndices . snd) ts`,
          "```",
        ),
      ],
      solution: hs`getIndices :: SuffixTree -> [Int]
getIndices (Leaf i)
  = [i]
getIndices (Node ts)
  = concatMap (getIndices . snd) ts`,
      tests: [
        { expr: 'getIndices (Node [("",Leaf 4),("",Leaf 1)])', expected: "[1,4]", unordered: true },
        { expr: "getIndices t1", expected: "[0,1,2,3,4,5]", unordered: true },
        { expr: "getIndices t2", expected: "[0..10]", unordered: true },
        { expr: "getIndices (Leaf 7)", expected: "[7]" },
        { expr: "getIndices (Node [])", expected: "[]" },
        { expr: 'getIndices (Node [("p", Node [("pi", Leaf 8), ("i", Leaf 9)])])', expected: "[8,9]", unordered: true },
      ],
    },
    {
      id: "findsubstrings2",
      name: "findSubstrings'",
      part: "Part II",
      marks: 5,
      prompt: md(
        "Using `getIndices`, write `findSubstrings' :: String -> SuffixTree -> [Int]`, which finds all occurrences of a search string using the suffix-tree search from the introduction. At a `Node`, check each labelled subtree `(a, t)` using the three cases, in order:",
        "",
        "1. If `s` is a prefix of `a`: every leaf in `t` is a match (`getIndices t`).",
        "2. If `a` is a prefix of `s`: search `t` for `s` with `a` removed from the front.",
        "3. Otherwise: no matches in this subtree.",
        "",
        "If the search reaches a `Leaf i` with nothing left to search for (`\"\"`), it is a match and the answer is `[i]`. If there is still something left (e.g. searching \"ippity\" in \"mississippi\"), the answer is `[]`.",
        "",
        "```",
        hs`*Main> findSubstrings' "an" t1
[1,3]
*Main> findSubstrings' "s" t2
[2,3,5,6]`,
        "```",
        "",
        "The order of the result doesn't matter. The answers must agree with `findSubstrings` from Part I.",
      ),
      hints: [
        "Recursion over the tree. At a `Node`, handle every child separately and join the results (`concatMap`). At most one child will give a non-empty list.",
        "Leaf equations first: `findSubstrings' \"\" (Leaf i) = [i]` and `findSubstrings' _ (Leaf _) = []`. For a `Node`, write a local helper that takes one `(a, t)` pair and uses guards for the three cases.",
        "The guards must be in the spec's order: test `isPrefix s a` before `isPrefix a s`. Use `isPrefix` and `removePrefix` from Part I.",
        md(
          "```",
          hs`findSubstrings' s (Node ts) = concatMap search ts
  where
    search (a, t)
      | isPrefix s a = getIndices t
      | isPrefix a s = findSubstrings' (removePrefix a s) t
      | otherwise    = []`,
          "```",
        ),
      ],
      solution: hs`findSubstrings' :: String -> SuffixTree -> [Int]
findSubstrings' "" (Leaf i)
  = [i]
findSubstrings' _ (Leaf _)
  = []
findSubstrings' s (Node ts)
  = concatMap search ts
  where
    search (a, t)
      | isPrefix s a = getIndices t
      | isPrefix a s = findSubstrings' (removePrefix a s) t
      | otherwise    = []`,
      tests: [
        { expr: `findSubstrings' "an" t1`, expected: "[1,3]", unordered: true },
        { expr: `findSubstrings' "s" t2`, expected: "[2,3,5,6]", unordered: true },
        { expr: `findSubstrings' "pi" t2`, expected: "[9]", label: "the search ends exactly at a leaf" },
        { expr: `findSubstrings' "ippity" t2`, expected: "[]", label: "reaches a leaf with characters still left over" },
        { expr: `findSubstrings' "iss" t2`, expected: "[1,4]", unordered: true },
        { expr: `findSubstrings' "ssify" t2`, expected: "[]" },
        { expr: `findSubstrings' "a" t1`, expected: "[1,3,5]", unordered: true },
        { expr: `findSubstrings' "banana" t1`, expected: "[0]" },
        { expr: `findSubstrings' "xyz" t1`, expected: "[]" },
        { expr: `and [sort (findSubstrings' s t2) == sort (findSubstrings s s2) | s <- ["i","ss","ssi","issi","p","pp","ppi","m","mi","sip","x","mississippi"]]`, expected: "True", label: "agrees with findSubstrings on many searches in mississippi" },
      ],
    },
    {
      id: "partition",
      name: "partition",
      part: "Part II",
      marks: 1,
      prompt: md(
        "Optional, for the bonus mark. Write `partition :: Eq a => [a] -> [a] -> ([a], [a], [a])`, which finds the longest common prefix of two lists and returns it, together with what is left of each list after removing it.",
        "",
        "```",
        hs`*Main> partition "happy" "haskell"
("ha","ppy","skell")`,
        "```",
        "",
        "This replaces calling `isPrefix` and then `removePrefix` (which scans the same characters twice). It also makes `insert` in Part III much easier.",
      ),
      hints: [
        "Recursion on both lists at once. Keep going while the front elements are equal.",
        "If both lists start with the same element `x`, partition the tails and put `x` on the front of the common prefix. In every other case (one list empty, or different first elements) the common prefix is empty and nothing is removed.",
        "To put `x` on the first component of a triple returned by the recursive call, name the parts with a `where`: `(p, rest1, rest2) = partition xs ys`.",
        md(
          "```",
          hs`partition (x : xs) (y : ys)
  | x == y = (x : p, rest1, rest2)
  where (p, rest1, rest2) = partition xs ys
partition xs ys = ([], xs, ys)`,
          "```",
        ),
      ],
      solution: hs`partition :: Eq a => [a] -> [a] -> ([a], [a], [a])
partition (x : xs) (y : ys)
  | x == y = (x : p, rest1, rest2)
  where
    (p, rest1, rest2) = partition xs ys
partition xs ys
  = ([], xs, ys)`,
      tests: [
        { expr: 'partition "happy" "haskell"', expected: '("ha","ppy","skell")' },
        { expr: 'partition "" "abc"', expected: '("","","abc")' },
        { expr: 'partition "abc" ""', expected: '("","abc","")' },
        { expr: 'partition "abc" "abc"', expected: '("abc","","")' },
        { expr: 'partition "ana" "anana"', expected: '("ana","","na")' },
        { expr: 'partition "xyz" "abc"', expected: '("","xyz","abc")' },
        { expr: "partition [1,2,3] [1,2,4 :: Int]", expected: "([1,2],[3],[4])" },
      ],
    },
    {
      id: "insert",
      name: "insert",
      part: "Part III",
      marks: 4,
      prompt: md(
        "Write `insert :: (String, Int) -> SuffixTree -> SuffixTree`, which adds one suffix `s` with its index `n` to a suffix tree. The template then builds a whole tree by inserting every suffix, longest first:",
        "",
        "```",
        hs`buildTree :: String -> SuffixTree
buildTree s
  = foldl (flip insert) (Node []) (zip (suffixes s) [0..])`,
        "```",
        "",
        "To insert `(s, n)` into a `Node`, look at each labelled subtree `(a, t)`. Let `p` be the common prefix of `s` and `a`.",
        "",
        "- If `p` is empty, this subtree is left unchanged.",
        "- If `p == a` (so `a` is a prefix of `s`), push the insertion down: insert `(s - p, n)` into `t`, where `s - p` means `s` with `p` removed from the front.",
        "- Otherwise (they share only part of `a`), split the edge: replace the label with `p`, and the subtree with a new `Node` that has exactly two children: `(s - p, Leaf n)` and `(a - p, t)`.",
        "",
        "If NO subtree has a non-empty common prefix with `s`, add a new child `(s, Leaf n)` to the node instead.",
        "",
        "For example, inserting `(\"ana\", 3)` into a node with child `(\"anana\", Leaf 1)`: the common prefix is \"ana\", which isn't the whole label, so the edge is split:",
        "",
        "```",
        hs`("anana", Leaf 1)    becomes    ("ana", Node [("", Leaf 3), ("na", Leaf 1)])`,
        "```",
        "",
        "The order of the children doesn't matter. If `insert` is right, `buildTree s1` is `t1` and `buildTree s2` is `t2` up to the order of children (the tests compare them with `canon`, which sorts the children).",
      ),
      hints: [
        "Use `partition s a` to get the common prefix `p` and both remainders in one go. First decide whether ANY child shares a non-empty prefix with `s`; if none does, add a new leaf.",
        "Structure: `insert (s, n) (Node ts)` with two guards. If `any shares ts` then `Node (map insertInto ts)`, otherwise `Node ((s, Leaf n) : ts)`. `insertInto` handles one `(a, t)` pair with the three cases.",
        "In `insertInto (a, t)` with `(p, sRest, aRest) = partition s a`: empty `p` leaves `(a, t)` alone; `p == a` gives `(a, insert (sRest, n) t)`; otherwise `(p, Node [(sRest, Leaf n), (aRest, t)])`. You never need to insert into a `Leaf`.",
        md(
          "```",
          hs`insert (s, n) (Node ts)
  | any shares ts = Node (map insertInto ts)
  | otherwise     = Node ((s, Leaf n) : ts)
  where
    shares (a, _) = not (null p) where (p, _, _) = partition s a
    insertInto (a, t)
      | null p    = (a, t)
      | p == a    = (a, insert (sRest, n) t)
      | otherwise = (p, Node [(sRest, Leaf n), (aRest, t)])
      where (p, sRest, aRest) = partition s a`,
          "```",
        ),
      ],
      solution: hs`insert :: (String, Int) -> SuffixTree -> SuffixTree
insert (s, n) (Node ts)
  | any shares ts = Node (map insertInto ts)
  | otherwise     = Node ((s, Leaf n) : ts)
  where
    commonPrefix a = p where (p, _, _) = partition s a

    shares (a, _) = not (null (commonPrefix a))

    insertInto (a, t)
      | null p    = (a, t)
      | p == a    = (a, insert (sRest, n) t)
      | otherwise = (p, Node [(sRest, Leaf n), (aRest, t)])
      where
        (p, sRest, aRest) = partition s a
insert _ leaf
  = leaf`,
      tests: [
        { expr: 'insert ("abc", 0) (Node [])', expected: 'Node [("abc",Leaf 0)]' },
        { expr: 'canon (insert ("xy", 2) (Node [("ab", Leaf 0)]))', expected: 'Node [("ab",Leaf 0),("xy",Leaf 2)]', label: "nothing in common: add a new leaf" },
        { expr: 'canon (insert ("ana", 3) (Node [("anana", Leaf 1)]))', expected: 'Node [("ana",Node [("",Leaf 3),("na",Leaf 1)])]', label: "split an edge" },
        { expr: 'canon (insert ("anx", 4) (Node [("an", Node [("a", Leaf 1), ("", Leaf 3)])]))', expected: 'Node [("an",Node [("",Leaf 3),("a",Leaf 1),("x",Leaf 4)])]', label: "label is a prefix: push the insertion down" },
        { expr: "canon (buildTree s1)", expected: "canon t1", label: "buildTree s1 is t1 (ignoring child order)" },
        { expr: "canon (buildTree s2)", expected: "canon t2", label: "buildTree s2 is t2 (ignoring child order)" },
        { expr: 'canon (buildTree "aaa")', expected: 'Node [("a",Node [("",Leaf 2),("a",Node [("",Leaf 1),("a",Leaf 0)])])]' },
        { expr: `and [sort (findSubstrings' s (buildTree t)) == sort (findSubstrings s t) | t <- ["abracadabra","imiss mississippi"], s <- ["a","ab","abra","ra","c","s","ss","issi"," ","x"]]`, expected: "True", label: "searching a built tree agrees with findSubstrings" },
      ],
    },
    {
      id: "lrs",
      name: "longestRepeatedSubstring",
      part: "Part IV",
      marks: 1,
      prompt: md(
        "Prize question. The longest repeated substring of a text is the longest substring that occurs at least twice (the occurrences may overlap). Write `longestRepeatedSubstring :: SuffixTree -> String`.",
        "",
        "For \"mississippi\" the answer is \"issi\" (\"is\" also appears twice, but is shorter):",
        "",
        "```",
        hs`*Main> longestRepeatedSubstring t2
"issi"`,
        "```",
        "",
        "If several substrings tie for longest (\"miss\" and \"issi\" in \"miss mississippi\"), any of them is acceptable. If nothing repeats, return `\"\"`.",
      ),
      hints: [
        "Every inner node of a suffix tree (other than the root) has at least two leaves below it, so the string spelled from the root to it occurs at least twice. You want the longest such string.",
        "Write a helper that lists the strings spelled by the paths from the root to every inner `Node`. Then pick the longest.",
        "Only go into children that are `Node`s (a `Leaf` is a single occurrence). For each such child `(a, sub)`, the paths are `a` itself and `a ++ rest` for every path `rest` inside `sub`.",
        md(
          "```",
          hs`innerPaths (Leaf _)  = []
innerPaths (Node ts) = [a ++ rest | (a, sub@(Node _)) <- ts, rest <- "" : innerPaths sub]

longestRepeatedSubstring t = foldr longer "" (innerPaths t)
  where longer a b = if length a >= length b then a else b`,
          "```",
        ),
      ],
      solution: hs`longestRepeatedSubstring :: SuffixTree -> String
longestRepeatedSubstring t
  = foldr longer "" (innerPaths t)
  where
    longer a b
      | length a >= length b = a
      | otherwise            = b

-- The strings spelled out on the way from the root to each inner node.
-- Each of these occurs at least twice in the text.
innerPaths :: SuffixTree -> [String]
innerPaths (Leaf _)
  = []
innerPaths (Node ts)
  = [a ++ rest | (a, sub@(Node _)) <- ts, rest <- "" : innerPaths sub]`,
      tests: [
        { expr: "longestRepeatedSubstring t2", expected: '"issi"' },
        { expr: "longestRepeatedSubstring t1", expected: '"ana"' },
        { expr: 'longestRepeatedSubstring (Node [("abc", Leaf 0)])', expected: '""', label: "nothing repeats" },
        { expr: 'longestRepeatedSubstring (buildTree "aaaa")', expected: '"aaa"', label: "overlapping occurrences" },
        { expr: 'longestRepeatedSubstring (buildTree "abcabxabcd")', expected: '"abc"' },
        { expr: 'longestRepeatedSubstring (buildTree "miss mississippi") `elem` ["miss","issi"]', expected: "True", label: "a tie: either answer is fine" },
        { expr: 'longestRepeatedSubstring (buildTree "abcdef")', expected: '""' },
      ],
    },
  ],
};
