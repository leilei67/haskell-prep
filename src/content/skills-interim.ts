import { type DrillSet, type Lesson, hs, md } from "./schema.ts";

const mapSetup = hs`import Data.Map (Map)
import qualified Data.Map as Map
import Data.List (foldl')
`;

const phoneMap = 'Map.fromList [("amy", 101), ("ben", 102), ("cam", 103)]';

const setSetup = hs`import Data.Set (Set)
import qualified Data.Set as Set
`;

// ---------------------------------------------------------------------------
// Maps and sets (25/26 interim and finals)
// ---------------------------------------------------------------------------

const mapsSets: Lesson = {
  id: "maps-sets",
  title: "Data.Map and Data.Set",
  blurb: "Keyed lookup and real sets: what newer papers (and the interim) expect beyond list tricks.",
  steps: [
    {
      k: "read",
      body: md(
        "Older public finals often used only lists: `lookup` on `[(String, Int)]`, `nub` for uniqueness, sorting to compare.",
        "",
        "Recent papers and the **25/26** track increasingly use **`Data.Map`** and **`Data.Set`** from `containers` (already on the exam machine).",
        "",
        "Use a **map** when you need fast lookup or update by key (`String`, `Int`, …). Use a **set** when you care about membership or combining collections without duplicates.",
        "",
        "Import style on the exam:",
        "",
        "```",
        "import Data.Map (Map)",
        "import qualified Data.Map as Map",
        "",
        "import Data.Set (Set)",
        "import qualified Data.Set as Set",
        "```",
        "",
        "Then `Map.insert`, `Map.lookup`, `Map.delete`, `Map.fromList`, `Map.toList`, `Map.keys`, and the same pattern for `Set.insert`, `Set.member`, `Set.union`, `Set.fromList`.",
      ),
    },
    {
      k: "try",
      code: `Map.lookup "ben" (${phoneMap})`,
      after: "`lookup` on a map returns `Just` the value or `Nothing` if the key isn't there — same idea as list lookup, but the map keeps keys organised.",
    },
    {
      k: "predict",
      expr: `Map.lookup "dot" (${phoneMap})`,
      answer: "Nothing",
      why: "`dot` isn't in the phone book.",
    },
    {
      k: "predict",
      expr: `Map.insert "dot" 104 (${phoneMap})`,
      answer: 'Map.fromList [("amy",101),("ben",102),("cam",103),("dot",104)]',
      why: "`insert` adds or replaces. `Show` for `Map` prints `fromList [...]` in key order.",
    },
    {
      k: "write",
      setup: mapSetup + hs`phone :: Map String Int
phone = Map.fromList [("amy", 101), ("ben", 102), ("cam", 103)]
`,
      body: "Write `ext :: String -> Int -> Map String Int -> Map String Int`, which adds an extension number for `name` (replacing if `name` was already there).",
      starter: hs`ext :: String -> Int -> Map String Int -> Map String Int
ext name n book = undefined
`,
      tests: [
        { expr: 'Map.lookup "amy" (ext "amy" 201 phone)', expected: "Just 201" },
        { expr: 'Map.lookup "dot" (ext "dot" 104 phone)', expected: "Just 104" },
        { expr: 'Map.size (ext "ben" 999 phone)', expected: "3" },
        { expr: 'Map.member "cam" (ext "dot" 1 phone)', expected: "True" },
      ],
      hint: "One line: `Map.insert name n book`.",
      solution: hs`ext :: String -> Int -> Map String Int -> Map String Int
ext = Map.insert
`,
    },
    {
      k: "write",
      setup: mapSetup + hs`scores :: [(String, Int)]
scores = [("amy", 5), ("ben", 3), ("amy", 2), ("cam", 4)]
`,
      body: "Write `bestScore :: [(String, Int)] -> Map String Int`, which keeps each person's **maximum** score. `Map.fromList` on duplicate keys keeps the **last** entry, so sort or fold in the right order if you use it directly — or use `Map.insertWith max`.",
      starter: hs`bestScore :: [(String, Int)] -> Map String Int
bestScore pairs = undefined
`,
      tests: [
        { expr: 'Map.lookup "amy" (bestScore scores)', expected: "Just 5" },
        { expr: 'Map.lookup "ben" (bestScore scores)', expected: "Just 3" },
        { expr: "Map.size (bestScore scores)", expected: "3" },
        { expr: 'Map.lookup "x" (bestScore [])', expected: "Nothing" },
      ],
      hint: "`foldl' (\\m (k,v) -> Map.insertWith max k v m) Map.empty pairs` or fold from the end so the last pair for each key wins when using `fromList`.",
      solution: hs`bestScore :: [(String, Int)] -> Map String Int
bestScore pairs = foldl' merge Map.empty pairs
  where
    merge m (k, v) = Map.insertWith max k v m
`,
    },
    {
      k: "read",
      body: md(
        "**Sets.** `Set a` is like a list with no duplicates, with fast `member` and set algebra:",
        "",
        "```",
        "Set.union s1 s2       -- everything in either",
        "Set.intersection s1 s2",
        "Set.delete x s",
        "```",
        "",
        "Turn a list into a set with `Set.fromList` (it sorts internally). Turn back with `Set.toList` when you need a list answer.",
      ),
    },
    {
      k: "try",
      code: "Set.member 2 (Set.fromList [1, 2, 2, 3])",
      after: "Duplicates in the input list disappear in the set.",
    },
    {
      k: "predict",
      expr: "Set.toList (Set.union (Set.fromList [1, 2]) (Set.fromList [2, 3]))",
      answer: "[1, 2, 3]",
      why: "Union keeps each element once; `toList` is sorted.",
    },
    {
      k: "write",
      setup: setSetup,
      body: "Write `common :: Ord a => [a] -> [a] -> [a]`, the sorted list of values that appear in **both** input lists (each value once).",
      starter: hs`common :: Ord a => [a] -> [a] -> [a]
common xs ys = undefined
`,
      tests: [
        { expr: 'common "abcde" "cdef"', expected: '"cde"' },
        { expr: "common [1, 2, 2, 3] [2, 2, 4]", expected: "[2]" },
        { expr: 'common "abc" "xyz"', expected: '""' },
        { expr: "common ([] :: [Int]) [1, 2]", expected: "[]" },
      ],
      hint: "`Set.toList (Set.intersection (Set.fromList xs) (Set.fromList ys))`.",
      solution: hs`common :: Ord a => [a] -> [a] -> [a]
common xs ys = Set.toList (Set.intersection (Set.fromList xs) (Set.fromList ys))
`,
    },
    {
      k: "write",
      setup: mapSetup,
      body: "Exam pattern: an **environment** maps variable names to values. Write `bind book name n` (insert into `book`) and `readVar book name` (lookup in `book`).",
      starter: hs`bind :: Map String Int -> String -> Int -> Map String Int
bind book name n = undefined

readVar :: Map String Int -> String -> Maybe Int
readVar book name = undefined
`,
      tests: [
        { expr: 'readVar (bind Map.empty "x" 4) "x"', expected: "Just 4" },
        { expr: 'readVar (bind (Map.fromList [("x", 1)]) "x" 9) "x"', expected: "Just 9" },
        { expr: 'readVar Map.empty "y"', expected: "Nothing" },
      ],
      hint: "`bind book name n = Map.insert name n book` and `readVar book name = Map.lookup name book`.",
      solution: hs`bind :: Map String Int -> String -> Int -> Map String Int
bind book name n = Map.insert name n book

readVar :: Map String Int -> String -> Maybe Int
readVar book name = Map.lookup name book
`,
    },
  ],
};

const mapsSetsDrills: DrillSet = {
  id: "drill-maps-sets",
  lesson: "maps-sets",
  title: "Practise: maps and sets",
  drills: [
    {
      k: "predict",
      expr: "Map.size Map.empty",
      answer: "0",
      why: "The empty map has no bindings.",
    },
  ],
};

// fix drills - add more
mapsSetsDrills.drills.push(
  {
    k: "predict",
    expr: 'Map.lookup "a" (Map.fromList [("a", 1), ("b", 2)])',
    answer: "Just 1",
    why: "Keys are looked up in the map.",
  },
  {
    k: "predict",
    expr: 'Map.member "b" (Map.delete "b" (Map.fromList [("a", 1), ("b", 2)]))',
    answer: "False",
    why: "`delete` removes the key.",
  },
  {
    k: "write",
    setup: mapSetup,
    body: "Write `countKeys :: Map String Int -> Int` — just the number of bindings (`Map.size`).",
    starter: hs`countKeys :: Map String Int -> Int
countKeys = undefined
`,
    tests: [
      { expr: "countKeys Map.empty", expected: "0" },
      { expr: 'countKeys (Map.fromList [("a", 1), ("b", 2)])', expected: "2" },
    ],
    hint: "`Map.size`.",
    solution: hs`countKeys = Map.size
`,
  },
  {
    k: "write",
    setup: mapSetup + hs`env :: Map String Int
env = Map.fromList [("x", 1), ("y", 2)]
`,
    body: "Write `inc :: String -> Map String Int -> Map String Int` — if `name` is in the map, add 1 to its value; if not, leave the map unchanged.",
    starter: hs`inc :: String -> Map String Int -> Map String Int
inc name m = undefined
`,
    tests: [
      { expr: 'Map.lookup "x" (inc "x" env)', expected: "Just 2" },
      { expr: 'Map.lookup "y" (inc "y" env)', expected: "Just 3" },
      { expr: 'Map.lookup "z" (inc "z" env)', expected: "Nothing" },
      { expr: "inc \"z\" env == env", expected: "True", label: "missing key unchanged" },
    ],
    hint: "`Map.alter` or `case Map.lookup name m of Just n -> Map.insert name (n+1) m; Nothing -> m`.",
    solution: hs`inc :: String -> Map String Int -> Map String Int
inc name m = case Map.lookup name m of
  Just n -> Map.insert name (n + 1) m
  Nothing -> m
`,
  },
  {
    k: "write",
    setup: setSetup,
    body: "Write `unique :: Ord a => [a] -> [a]`, sorted list of distinct elements (exam-style set, not `nub` which keeps first position).",
    starter: hs`unique :: Ord a => [a] -> [a]
unique = undefined
`,
    tests: [
      { expr: "unique ([3, 1, 2, 1, 3] :: [Int])", expected: "[1, 2, 3]" },
      { expr: "unique ([] :: [Int])", expected: "[]" },
    ],
    hint: "`Set.toList . Set.fromList`.",
    solution: hs`unique :: Ord a => [a] -> [a]
unique = Set.toList . Set.fromList
`,
  },
);

const treeSetup = hs`data Tree a = Leaf a | Branch (Tree a) (Tree a)
  deriving (Eq, Show)

t1 :: Tree Int
t1 = Branch (Branch (Leaf 1) (Leaf 2)) (Leaf 3)
`;

// ---------------------------------------------------------------------------
// Trees (every good Haskell exam)
// ---------------------------------------------------------------------------

const treesExam: Lesson = {
  id: "trees-exam",
  title: "Recursive trees",
  blurb: "The shape that shows up on almost every paper: count, map, evaluate, and walk.",
  steps: [
    {
      k: "read",
      body: md(
        "Past paper after past paper builds a **recursive data type** — binary trees, expression trees, game trees, syntax trees — and asks you to write functions by **pattern matching** on the constructors.",
        "",
        "The recipe is always the same:",
        "",
        "1. **Base case** on `Leaf` (or the empty shape).",
        "2. **Recursive case** on `Branch` / `Node`: call yourself on the children and combine.",
        "",
        "If you can write `size`, `depth`, `mapTree`, and a small `eval` on an expression tree without thinking, you're in good shape for the interim and the final.",
      ),
    },
    {
      k: "read",
      body: md(
        "Your template file will give you something like:",
        "",
        "```",
        "data Tree a = Leaf a | Branch (Tree a) (Tree a)",
        "```",
        "",
        "Match on `Leaf` and `Branch` — never on a bare list.",
      ),
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `size :: Tree a -> Int`, the number of **leaves** (not internal nodes).",
      starter: hs`size :: Tree a -> Int
size t = undefined
`,
      tests: [
        { expr: "size (Leaf 1)", expected: "1" },
        { expr: "size t1", expected: "3" },
        { expr: "size (Branch (Leaf 'a') (Branch (Leaf 'b') (Leaf 'c')))", expected: "3" },
      ],
      hint: "`size (Leaf _) = 1`; `size (Branch l r) = size l + size r`.",
      solution: hs`size :: Tree a -> Int
size (Leaf _) = 1
size (Branch l r) = size l + size r
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `depth :: Tree a -> Int`, the length of the longest root-to-leaf path (a single leaf has depth 1).",
      starter: hs`depth :: Tree a -> Int
depth t = undefined
`,
      tests: [
        { expr: "depth (Leaf 1)", expected: "1" },
        { expr: "depth t1", expected: "3" },
        { expr: "depth (Branch (Leaf 0) (Leaf 0))", expected: "2" },
      ],
      hint: "`depth (Leaf _) = 1`; `depth (Branch l r) = 1 + max (depth l) (depth r)`.",
      solution: hs`depth :: Tree a -> Int
depth (Leaf _) = 1
depth (Branch l r) = 1 + max (depth l) (depth r)
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `mapTree :: (a -> b) -> Tree a -> Tree b`, the functor map on trees.",
      starter: hs`mapTree :: (a -> b) -> Tree a -> Tree b
mapTree f t = undefined
`,
      tests: [
        { expr: "mapTree (+ 1) (Leaf 3)", expected: "Leaf 4" },
        { expr: "mapTree (* 2) t1", expected: "Branch (Branch (Leaf 2) (Leaf 4)) (Leaf 6)" },
        { expr: 'mapTree show (Leaf True)', expected: 'Leaf "True"' },
      ],
      hint: "Leaf: `Leaf (f x)`; Branch: `Branch (mapTree f l) (mapTree f r)`.",
      solution: hs`mapTree :: (a -> b) -> Tree a -> Tree b
mapTree f (Leaf x) = Leaf (f x)
mapTree f (Branch l r) = Branch (mapTree f l) (mapTree f r)
`,
    },
    {
      k: "write",
      setup: hs`data Expr = Num Int | Add Expr Expr | Mul Expr Expr
  deriving (Eq, Show)

e1 :: Expr
e1 = Add (Mul (Num 2) (Num 3)) (Num 4)
`,
      body: "Classic exam task: `eval :: Expr -> Int`.",
      starter: hs`eval :: Expr -> Int
eval e = undefined
`,
      tests: [
        { expr: "eval (Num 7)", expected: "7" },
        { expr: "eval e1", expected: "10" },
        { expr: "eval (Mul (Num 2) (Add (Num 1) (Num 2)))", expected: "6" },
      ],
      hint: "Two equations for `Add` and `Mul` that call `eval` on children.",
      solution: hs`eval :: Expr -> Int
eval (Num n) = n
eval (Add a b) = eval a + eval b
eval (Mul a b) = eval a * eval b
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `leaves :: Tree a -> [a]`, leaves from **left to right**.",
      starter: hs`leaves :: Tree a -> [a]
leaves t = undefined
`,
      tests: [
        { expr: "leaves (Leaf 9)", expected: "[9]" },
        { expr: "leaves t1", expected: "[1, 2, 3]" },
        { expr: "leaves (Branch (Leaf 'x') (Leaf 'y'))", expected: "\"xy\"" },
      ],
      hint: "`leaves (Leaf x) = [x]`; `leaves (Branch l r) = leaves l ++ leaves r`.",
      solution: hs`leaves :: Tree a -> [a]
leaves (Leaf x) = [x]
leaves (Branch l r) = leaves l ++ leaves r
`,
    },
  ],
};

const treesExamDrills: DrillSet = {
  id: "drill-trees-exam",
  lesson: "trees-exam",
  title: "Practise: recursive trees",
  drills: [
    {
      k: "quiz",
      q: "On `size (Branch l r)`, which is the usual base case?",
      options: ["`size [] = 0`", "`size (Leaf _) = 1`", "`size (Node _ _) = 0`", "`size _ = 0`"],
      answer: 1,
      why: "Leaves are the base; internal nodes combine the recursive results.",
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `sumTree :: Tree Int -> Int`, the sum of values stored at leaves.",
      starter: hs`sumTree :: Tree Int -> Int
sumTree = undefined
`,
      tests: [
        { expr: "sumTree (Leaf 4)", expected: "4" },
        { expr: "sumTree t1", expected: "6" },
      ],
      hint: "Like `leaves` but combine with `+` instead of `++`.",
      solution: hs`sumTree (Leaf n) = n
sumTree (Branch l r) = sumTree l + sumTree r
`,
    },
    {
      k: "write",
      setup: hs`data Expr = Num Int | Neg Expr | Add Expr Expr
  deriving (Eq, Show)
`,
      body: "Write `numNodes :: Expr -> Int`, counting every constructor (`Num`, `Neg`, `Add` each count as one).",
      starter: hs`numNodes :: Expr -> Int
numNodes = undefined
`,
      tests: [
        { expr: "numNodes (Num 0)", expected: "1" },
        { expr: "numNodes (Neg (Num 3))", expected: "2" },
        { expr: "numNodes (Add (Num 1) (Num 2))", expected: "3" },
      ],
      hint: "Each constructor: 1 + sum of children.",
      solution: hs`numNodes (Num _) = 1
numNodes (Neg e) = 1 + numNodes e
numNodes (Add a b) = 1 + numNodes a + numNodes b
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `has :: Eq a => a -> Tree a -> Bool`, whether any leaf holds `x`.",
      starter: hs`has :: Eq a => a -> Tree a -> Bool
has x = undefined
`,
      tests: [
        { expr: "has 2 t1", expected: "True" },
        { expr: "has 9 t1", expected: "False" },
        { expr: "has 'a' (Leaf 'a')", expected: "True" },
      ],
      hint: "Leaf: `== x`; Branch: `||`.",
      solution: hs`has x (Leaf y) = x == y
has x (Branch l r) = has x l || has x r
`,
    },
    {
      k: "quiz",
      q: "Why do exam specs love tree types?",
      options: [
        "They test imports only",
        "They force clear recursive structure and case analysis",
        "They require Template Haskell",
        "They replace all list questions",
      ],
      answer: 1,
      why: "Trees make you show recursion, typing, and case distinction — the core of the course.",
    },
  ],
};

export const lessons: Lesson[] = [mapsSets, treesExam];
export const drills: DrillSet[] = [mapsSetsDrills, treesExamDrills];