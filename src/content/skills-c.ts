import { type DrillSet, type Lesson, hs, md } from "./schema.ts";

// ---------------------------------------------------------------------------
// 13. Repeat until nothing changes
// ---------------------------------------------------------------------------

const ssaSetup = hs`data Op = Add | Mul
  deriving (Eq, Show)

data Exp = Const Int | Var String | Apply Op Exp Exp
  deriving (Eq, Show)

type Block = [(String, Exp)]
type Worklist = [(String, Int)]

foldExp :: Exp -> Exp
foldExp (Apply Add (Const a) (Const b)) = Const (a + b)
foldExp (Apply Mul (Const a) (Const b)) = Const (a * b)
foldExp e = e

sub :: String -> Int -> Exp -> Exp
sub v c (Var w)
  | v == w = Const c
sub v c (Apply op e1 e2) = foldExp (Apply op (sub v c e1) (sub v c e2))
sub _ _ e = e

block1 :: Block
block1 =
  [ ("x0", Const 1)
  , ("y0", Const 2)
  , ("x1", Apply Add (Var "x0") (Var "y0"))
  , ("y1", Apply Mul (Var "x1") (Const 3))
  , ("$return", Var "y1")
  ]

block2 :: Block
block2 =
  [ ("a", Const 2)
  , ("b", Apply Add (Var "n") (Var "a"))
  , ("$return", Apply Mul (Var "b") (Var "a"))
  ]
`;

const scanSolution = hs`scan :: String -> Int -> Block -> (Worklist, Block)
scan v c block = (newWork, kept)
  where
    block' = [(w, sub v c e) | (w, e) <- block]
    newWork = [(w, n) | (w, Const n) <- block', w /= "$return"]
    kept = [(w, e) | (w, e) <- block', not (isConstAssign w e)]
    isConstAssign w (Const _) = w /= "$return"
    isConstAssign _ _ = False
`;

const fixpoint: Lesson = {
  id: "fixpoint",
  title: "Repeat until nothing changes",
  blurb: "iterate, until, fixed points and worklists: the engine behind propUnits and propagateConstants.",
  steps: [
    {
      k: "read",
      body: md(
        "A surprising number of exam questions have the same shape: do one round of work, then do it again, and again, until doing it once more changes nothing.",
        "",
        "- 2019 (SAT solving): keep simplifying a formula using its one-variable clauses until there are none left. That's `propUnits`, worth 5 marks.",
        "- 2018 (compilers): keep replacing variables by their known constant values until no more can be replaced. That's `propagateConstants`, worth 7 marks.",
        "",
        "A value that doesn't change when you apply `f` to it (so `f x == x`) is called a fixed point of `f`. This lesson is about reaching one safely, without looping forever.",
      ),
    },
    {
      k: "read",
      body: md(
        "The Prelude function `iterate` builds the whole sequence of repeated applications:",
        "",
        "```",
        "iterate f x  =  [x, f x, f (f x), f (f (f x)), ...]",
        "```",
        "",
        "That list never ends! Haskell only works out the parts you actually ask for (this is called laziness), so it's safe as long as you only take a finite piece, with `take`, `takeWhile` or `!!`.",
      ),
    },
    { k: "try", code: "take 5 (iterate (*2) 1)", after: "Start at 1, then keep doubling. `take 5` stops after five values." },
    {
      k: "predict",
      expr: "take 4 (iterate (`div` 2) 100)",
      answer: "[100,50,25,12]",
      why: "The first element is the starting value itself, 100. Then 50, 25, and `div 25 2` is 12 (whole-number division).",
    },
    {
      k: "quiz",
      q: "What is `iterate (+1) 0 !! 3`?",
      options: ["`1`", "`3`", "`4`", "It loops forever"],
      answer: 1,
      why: "`iterate (+1) 0` is `[0,1,2,3,...]`. `!! 3` picks index 3 (counting from 0), which is 3. Only the first four elements are ever worked out, so it doesn't loop.",
    },
    {
      k: "read",
      body: md(
        "When you only want the final value, use `until`:",
        "",
        "```",
        "until :: (a -> Bool) -> (a -> a) -> a -> a",
        "until done step start",
        "```",
        "",
        "It checks `done start` first. If that's True, the answer is `start`. Otherwise it applies `step` and checks again, and so on.",
      ),
    },
    { k: "try", code: "until (> 100) (*2) 1", after: "1, 2, 4, ..., 64, 128. 128 is the first value above 100." },
    {
      k: "predict",
      expr: "until (< 10) (`div` 3) 500",
      answer: "6",
      why: "500, then 166, 55, 18, 6. The test `(< 10)` is first True at 6.",
    },
    {
      k: "quiz",
      q: "What is `until (> 0) (*2) 5`?",
      options: ["`10`", "`5`", "`0`", "It loops forever"],
      answer: 1,
      why: "`until` tests before it steps. `5 > 0` is already True, so `step` is never used and the answer is 5.",
    },
    {
      k: "read",
      body: md(
        "Now the key idea. To repeat until nothing changes, compare the old value with the new one:",
        "",
        "```",
        "fixpoint :: Eq a => (a -> a) -> a -> a",
        "fixpoint f x",
        "  | next == x = x",
        "  | otherwise = fixpoint f next",
        "  where",
        "    next = f x",
        "```",
        "",
        "`Eq a =>` is needed because we use `==` on the values. Each round works out `next`. If it's the same as `x`, we've reached a fixed point and stop. Otherwise we go round again starting from `next`.",
      ),
    },
    {
      k: "write",
      body: "Type in `fixpoint` yourself (without looking if you can). You'll reuse it in the next few exercises.",
      starter: hs`fixpoint :: Eq a => (a -> a) -> a -> a
fixpoint f x = undefined
`,
      tests: [
        { expr: "fixpoint (\\n -> max 0 (n - 3)) 10", expected: "0" },
        { expr: "fixpoint (\\n -> n `div` 2) 37", expected: "0" },
        { expr: "fixpoint (\\n -> min 10 (n + 4)) 1", expected: "10" },
        { expr: "fixpoint (map (min 3)) [1,5,2]", expected: "[1,3,2]" },
        { expr: "fixpoint id 'q'", expected: "'q'" },
      ],
      hint: "Work out `next = f x` in a `where`. Two guards: `next == x` stops, `otherwise` calls `fixpoint f next`.",
      solution: hs`fixpoint :: Eq a => (a -> a) -> a -> a
fixpoint f x
  | next == x = x
  | otherwise = fixpoint f next
  where
    next = f x
`,
    },
    {
      k: "predict",
      body: "Here is the same idea written inline with `let`, so it runs in GHCi.",
      expr: "let f n = min 10 (n + 4); go x = if f x == x then x else go (f x) in go 1",
      answer: "10",
      why: "1, 5, 9, then `min 10 13` is 10, then `min 10 14` is 10 again. Old equals new, so we stop at 10.",
    },
    {
      k: "quiz",
      q: "Which of these never finishes?",
      options: ["`fixpoint (\\n -> div n 2) 1000`", "`fixpoint (+1) 0`", "`fixpoint (max 5) 0`", "`fixpoint abs (-3)`"],
      answer: 1,
      why: "`(+1)` changes every value it touches, so the new value never equals the old one. The others settle: halving reaches 0, `max 5` reaches 5, `abs` reaches 3. Before you use a repeat-until-stable loop, ask: does every round make progress towards a stopping point?",
    },
    {
      k: "read",
      body: md(
        "A common pattern: you can write one pass of a simplification easily, but one pass isn't enough because simplifying can create new things to simplify.",
        "",
        "Example: delete pairs of equal neighbouring letters. One left-to-right pass turns `\"abccba\"` into `\"abba\"` (the `cc` went). But now `bb` are neighbours, so another pass gives `\"aa\"`, and another gives `\"\"`.",
        "",
        "The trick is to write the single pass, then wrap it in `fixpoint`.",
      ),
    },
    {
      k: "write",
      body: md(
        "Write `removePairs`, one left-to-right pass that deletes each pair of equal neighbouring characters.",
        "",
        "When the first two characters are equal, drop both and carry on with the rest. Otherwise keep the first character and carry on from the second.",
      ),
      starter: hs`removePairs :: String -> String
removePairs s = undefined
`,
      tests: [
        { expr: 'removePairs "abba"', expected: '"aa"' },
        { expr: 'removePairs "aabb"', expected: '""' },
        { expr: 'removePairs "abccba"', expected: '"abba"' },
        { expr: 'removePairs "abc"', expected: '"abc"' },
        { expr: 'removePairs ""', expected: '""' },
      ],
      hint: "Pattern match on `(a:b:rest)`. If `a == b` the answer is `removePairs rest`, otherwise `a : removePairs (b:rest)`. Any shorter string comes back unchanged.",
      solution: hs`removePairs :: String -> String
removePairs (a:b:rest)
  | a == b = removePairs rest
  | otherwise = a : removePairs (b:rest)
removePairs s = s
`,
    },
    {
      k: "write",
      body: md(
        "`fixpoint` and `removePairs` are given. The starter does just one pass, so it fails on `\"abccba\"`. Fix `reduceAll` so it keeps going until nothing changes.",
      ),
      setup: hs`fixpoint :: Eq a => (a -> a) -> a -> a
fixpoint f x
  | next == x = x
  | otherwise = fixpoint f next
  where
    next = f x

removePairs :: String -> String
removePairs (a:b:rest)
  | a == b = removePairs rest
  | otherwise = a : removePairs (b:rest)
removePairs s = s
`,
      starter: hs`reduceAll :: String -> String
reduceAll s = removePairs s
`,
      tests: [
        { expr: 'reduceAll "abccba"', expected: '""' },
        { expr: 'reduceAll "abccbaz"', expected: '"z"' },
        { expr: 'reduceAll "abc"', expected: '"abc"' },
        { expr: 'reduceAll ""', expected: '""' },
        { expr: 'reduceAll "xyyxzwwz"', expected: '""' },
      ],
      hint: "`reduceAll s = fixpoint removePairs s`.",
      solution: hs`reduceAll :: String -> String
reduceAll s = fixpoint removePairs s
`,
    },
    {
      k: "read",
      body: md(
        "Now a real exam example: 2019's unit propagation, slightly simplified.",
        "",
        "A formula is a list of clauses, and each clause is a list of non-zero Ints. `3` means \"variable 3 is true\" and `-3` means \"variable 3 is false\". A clause with exactly one number, like `[4]`, is called a unit clause: it forces that variable.",
        "",
        "Propagating a unit `u` means two things:",
        "",
        "- Every clause containing `u` is now satisfied, so remove the whole clause.",
        "- From every other clause, delete `-u` (it can't help any more).",
        "",
        "```",
        "propagate 4 [[-1,-4],[2,1,5],[4]]   is  [[-1],[2,1,5]]",
        "```",
        "",
        "Notice the result has a new unit clause `[-1]`. That's why we must repeat.",
      ),
    },
    {
      k: "write",
      body: "Write `propagate u cs`. A list comprehension with a guard does both jobs in one line.",
      starter: hs`propagate :: Int -> [[Int]] -> [[Int]]
propagate u cs = undefined
`,
      tests: [
        { expr: "propagate 4 [[-1,-4],[2,1,5],[4]]", expected: "[[-1],[2,1,5]]" },
        { expr: "propagate 1 [[1,2],[-1,3],[3]]", expected: "[[3],[3]]" },
        { expr: "propagate 5 []", expected: "[]" },
        { expr: "propagate (-2) [[2],[-2,7],[1,2,3]]", expected: "[[],[1,3]]" },
      ],
      hint: "`[filter (/= negate u) c | c <- cs, notElem u c]`",
      solution: hs`propagate :: Int -> [[Int]] -> [[Int]]
propagate u cs = [filter (/= negate u) c | c <- cs, notElem u c]
`,
    },
    {
      k: "quiz",
      q: "Why is it safe to keep propagating unit clauses until there are none left? Why can't it loop forever?",
      options: [
        "Because Haskell stops recursion automatically after a while",
        "Because each round removes at least one clause (the unit clause itself contains `u`), and you can't remove clauses forever",
        "Because the numbers get smaller each time",
        "It isn't safe; it can loop forever",
      ],
      answer: 1,
      why: "The unit clause `[u]` contains `u`, so `propagate u` always removes it. Every round the list of clauses gets shorter, so the process must end. Spotting the thing that shrinks every round is how you convince yourself a loop terminates.",
    },
    {
      k: "write",
      body: md(
        "Write `propUnits`, which returns the simplified formula and the list of units it used, in the order it used them. `propagate` is given.",
        "",
        "The spec's own hint: propagate one unit clause at a time; the others get picked up by recursion. Find the units with the pattern trick `[u | [u] <- cs]`: only clauses that match `[u]` (exactly one element) get through.",
        "",
        "```",
        "propUnits [[-1,-4],[2,1,5],[3,-2],[4],[3,-5],[-3,-7],[1,7,6],[-3,6]]",
        "  == ([[2,5],[3,-2],[3,-5],[-3,-7],[7,6],[-3,6]], [4,-1])",
        "```",
      ),
      setup: hs`propagate :: Int -> [[Int]] -> [[Int]]
propagate u cs = [filter (/= negate u) c | c <- cs, notElem u c]
`,
      starter: hs`propUnits :: [[Int]] -> ([[Int]], [Int])
propUnits cs = undefined
`,
      tests: [
        { expr: "propUnits []", expected: "([], [])" },
        { expr: "propUnits [[1,2],[-1,2]]", expected: "([[1,2],[-1,2]], [])" },
        {
          expr: "propUnits [[-1,-4],[2,1,5],[3,-2],[4],[3,-5],[-3,-7],[1,7,6],[-3,6]]",
          expected: "([[2,5],[3,-2],[3,-5],[-3,-7],[7,6],[-3,6]], [4,-1])",
        },
        { expr: "propUnits [[1],[-1,2],[-2,3]]", expected: "([], [1,2,3])" },
      ],
      hint: "`case [u | [u] <- cs] of` with two branches. `[]` means no units: `(cs, [])`. `(u:_)` means: recursively call `propUnits (propagate u cs)` to get `(cs', us)`, then answer `(cs', u : us)`.",
      solution: hs`propUnits :: [[Int]] -> ([[Int]], [Int])
propUnits cs =
  case [u | [u] <- cs] of
    [] -> (cs, [])
    (u:_) -> (cs', u : us)
      where
        (cs', us) = propUnits (propagate u cs)
`,
    },
    {
      k: "read",
      body: md(
        "The other common pattern is a worklist: a list of jobs still to do.",
        "",
        "```",
        "go []           state = state",
        "go (job : jobs) state = go (jobs ++ newJobs) state'",
        "  where (newJobs, state') = doJob job state",
        "```",
        "",
        "Take one job off the front, do it, and add any new jobs it creates to the end. When the list is empty, you're finished.",
        "",
        "2018's `propagateConstants` suggests exactly this. A block of code is a list of assignments like `(\"x1\", Apply Add (Var \"x0\") (Var \"y0\"))`. A job is a known constant like `(\"x0\", 1)`. Doing the job means replacing `Var \"x0\"` with `Const 1` everywhere and folding sums of two constants. If that turns some other assignment into a constant, say `x1 = 3`, it becomes a new job.",
      ),
    },
    {
      k: "write",
      body: md(
        "Write 2018's `scan v c block`. The data types, `sub` (substitute then fold) and two test blocks are given.",
        "",
        "1. Apply `sub v c` to the right-hand side of every assignment.",
        "2. The new worklist is every assignment that is now `Const n`, as a pair `(name, n)`, except `\"$return\"` (a function must always keep its return).",
        "3. The new block is everything else, so those constant assignments are removed.",
        "",
        "```",
        "scan \"$INVALID\" 0 block1  ==  ([(\"x0\",1),(\"y0\",2)], [x1, y1 and $return unchanged])",
        "```",
        "",
        "Scanning with a name that never appears is a neat way to build the first worklist.",
      ),
      setup: ssaSetup,
      starter: hs`scan :: String -> Int -> Block -> (Worklist, Block)
scan v c block = undefined
`,
      tests: [
        { expr: 'fst (scan "$INVALID" 0 block1)', expected: '[("x0",1),("y0",2)]' },
        { expr: 'snd (scan "$INVALID" 0 block1)', expected: "drop 2 block1" },
        { expr: 'scan "x0" 1 (drop 2 block1)', expected: '([], [("x1", Apply Add (Const 1) (Var "y0")), ("y1", Apply Mul (Var "x1") (Const 3)), ("$return", Var "y1")])' },
        { expr: 'scan "y1" 9 [("$return", Var "y1")]', expected: '([], [("$return", Const 9)])' },
        { expr: 'scan "a" 2 (drop 1 block2)', expected: '([], [("b", Apply Add (Var "n") (Const 2)), ("$return", Apply Mul (Var "b") (Const 2))])' },
      ],
      hint: "Build `block' = [(w, sub v c e) | (w, e) <- block]` in a `where`. The worklist is `[(w, n) | (w, Const n) <- block', w /= \"$return\"]`. For the kept part, a little helper that says whether an assignment is a removable constant is the clearest way.",
      solution: scanSolution,
    },
    {
      k: "write",
      body: md(
        "Now finish 2018's `propagateConstants` with the worklist method. `scan` is given.",
        "",
        "Start with `scan \"$INVALID\" 0 block` to get the first worklist and block. Then loop: take a job `(v, c)`, scan with it, append the new jobs to the end of the worklist. Stop when the worklist is empty and return the block.",
      ),
      setup: ssaSetup + "\n" + scanSolution,
      starter: hs`propagateConstants :: Block -> Block
propagateConstants block = undefined
`,
      tests: [
        { expr: "propagateConstants block1", expected: '[("$return", Const 9)]' },
        {
          expr: "propagateConstants block2",
          expected: '[("b", Apply Add (Var "n") (Const 2)), ("$return", Apply Mul (Var "b") (Const 2))]',
        },
        { expr: "propagateConstants []", expected: "[]" },
        { expr: 'propagateConstants [("$return", Apply Add (Const 1) (Const 1))]', expected: '[("$return", Const 2)]' },
      ],
      hint: "In a `where`: `(work, rest) = scan \"$INVALID\" 0 block`, then `go [] b = b` and `go ((v, c) : more) b = go (more ++ new) b'` where `(new, b') = scan v c b`.",
      solution: hs`propagateConstants :: Block -> Block
propagateConstants block = go work rest
  where
    (work, rest) = scan "$INVALID" 0 block
    go [] b = b
    go ((v, c) : more) b = go (more ++ new) b'
      where
        (new, b') = scan v c b
`,
    },
    {
      k: "quiz",
      q: "In `propagateConstants`, suppose `scan` forgot to remove the constant assignments from the block. What would happen?",
      options: [
        "Nothing; the answer would be the same",
        "It would crash with an exception",
        "The same constants would be found again on every scan and added back to the worklist, so it would never finish",
        "It would finish but return an empty block",
      ],
      answer: 2,
      why: "A worklist loop ends only when the jobs run out. If finished jobs keep reappearing, the list never empties. In every repeat-until loop, ask: what stops the same work being found again?",
    },
    {
      k: "read",
      body: md(
        "Your checklist for any repeat-until-stable function:",
        "",
        "1. Does each round make progress? Something must shrink (fewer clauses, fewer variables, a smaller number) or eventually stop changing.",
        "2. Is the stopping test right? Compare old and new with `==`, or stop when the worklist is `[]`.",
        "3. Does the test happen before the step? `until` and `fixpoint` both check first, so a value that is already finished comes straight back.",
        "",
        "If GHCi seems to hang while you test, press Ctrl-C and check point 1.",
      ),
    },
    {
      k: "predict",
      expr: "length (takeWhile (/= 1) (iterate (\\n -> if even n then n `div` 2 else 3 * n + 1) 6))",
      answer: "8",
      why: "6, 3, 10, 5, 16, 8, 4, 2 are the values before the first 1. That's 8 of them.",
    },
    {
      k: "write",
      body: md(
        "Another way to find a fixed point: generate `iterate f x` and look for the first value that equals the one after it.",
        "",
        "Write `stable`, which finds the first element of a list that is equal to the next element. You may assume such an element exists. Then `stable (iterate f x)` is a fixed point.",
      ),
      starter: hs`stable :: Eq a => [a] -> a
stable xs = undefined
`,
      tests: [
        { expr: "stable [3,2,1,1,0]", expected: "1" },
        { expr: "stable [5,5]", expected: "5" },
        { expr: "stable (iterate (\\n -> max 0 (n - 4)) 10)", expected: "0" },
        { expr: "stable \"bookkeeper\"", expected: "'o'" },
        { expr: "stable (iterate (\\n -> n `div` 3) 1000)", expected: "0" },
      ],
      hint: "Pattern `(x:y:rest)`: if `x == y` the answer is `x`, otherwise look in `(y:rest)`.",
      solution: hs`stable :: Eq a => [a] -> a
stable (x:y:rest)
  | x == y = x
  | otherwise = stable (y:rest)
stable _ = error "no stable element"
`,
    },
    {
      k: "quiz",
      q: "What does `head (dropWhile (< 1000) (iterate (*3) 1))` give?",
      options: ["The number of times you multiply by 3 to pass 1000", "The first power of 3 that is at least 1000, which is 2187", "729, the last power of 3 below 1000", "It loops forever because `iterate` is infinite"],
      answer: 1,
      why: "`dropWhile (< 1000)` throws away 1, 3, 9, ..., 729. The first survivor is 2187. Because Haskell is lazy, it stops generating as soon as `head` has its answer.",
    },
  ],
};

const drillFixpoint: DrillSet = {
  id: "drill-fixpoint",
  lesson: "fixpoint",
  title: "Repeat until nothing changes: drills",
  drills: [
    {
      k: "quiz",
      q: "What is the type of `iterate`?",
      options: ["`(a -> a) -> a -> [a]`", "`(a -> a) -> a -> a`", "`(a -> Bool) -> (a -> a) -> a -> a`", "`Int -> (a -> a) -> a -> a`"],
      answer: 0,
      why: "It takes a step function and a start value and gives the infinite list of repeated applications. `(a -> Bool) -> (a -> a) -> a -> a` is `until`.",
    },
    {
      k: "predict",
      expr: "take 5 (iterate (+3) 0)",
      answer: "[0,3,6,9,12]",
      why: "The list starts with the start value 0 itself, then adds 3 each time.",
    },
    {
      k: "predict",
      expr: "until (>= 50) (*3) 2",
      answer: "54",
      why: "2, 6, 18, 54. 54 is the first value that is at least 50.",
    },
    {
      k: "quiz",
      q: "Which equals `take 3 (iterate f x)`?",
      options: ["`[f x, f (f x), f (f (f x))]`", "`[x, f x, f (f x)]`", "`[f x, f x, f x]`", "`[x, x, x]`"],
      answer: 1,
      why: "`iterate` includes the start value as element 0.",
    },
    {
      k: "predict",
      expr: "takeWhile (/= 0) (iterate (`div` 10) 4072)",
      answer: "[4072,407,40,4]",
      why: "Dividing by 10 with `div` chops off the last digit. The next value would be 0, where `takeWhile` stops.",
    },
    {
      k: "quiz",
      q: "Why does `fixpoint :: Eq a => (a -> a) -> a -> a` need `Eq a`?",
      options: ["Because it uses recursion", "Because it compares the old and new values with `==`", "Because `a` must be a number", "It doesn't; GHC adds it for no reason"],
      answer: 1,
      why: "Deciding that nothing changed means testing `f x == x`, and `==` needs `Eq`.",
    },
    {
      k: "write",
      body: "Write `applyN n f x`, which applies `f` to `x` exactly `n` times. Use `iterate` and `!!`.",
      starter: hs`applyN :: Int -> (a -> a) -> a -> a
applyN n f x = undefined
`,
      tests: [
        { expr: "applyN 3 (*2) 1", expected: "8" },
        { expr: "applyN 0 (*2) 7", expected: "7" },
        { expr: "applyN 2 tail \"hello\"", expected: '"llo"' },
        { expr: "applyN 4 (++ \"!\") \"hi\"", expected: '"hi!!!!"' },
      ],
      hint: "Element number `n` of `iterate f x` has had `f` applied `n` times.",
      solution: hs`applyN :: Int -> (a -> a) -> a -> a
applyN n f x = iterate f x !! n
`,
    },
    {
      k: "predict",
      expr: "length (takeWhile (> 1) (iterate (`div` 2) 64))",
      answer: "6",
      why: "64, 32, 16, 8, 4, 2 are all above 1. Then 1 stops `takeWhile`. Six values.",
    },
    {
      k: "quiz",
      q: "You need every intermediate value of a repeated process, not just the last one. Which do you reach for?",
      options: ["`until`", "`iterate` with `takeWhile`", "`fixpoint`", "`foldr`"],
      answer: 1,
      why: "`until` and `fixpoint` only hand back the final value. `iterate` keeps them all; `takeWhile` cuts the infinite list off.",
    },
    {
      k: "write",
      body: "Write `doublings target`: how many times must you double 1 before it is at least `target`? (For a target of 1 or less, the answer is 0.)",
      starter: hs`doublings :: Int -> Int
doublings target = undefined
`,
      tests: [
        { expr: "doublings 1", expected: "0" },
        { expr: "doublings 8", expected: "3" },
        { expr: "doublings 9", expected: "4" },
        { expr: "doublings 1000", expected: "10" },
        { expr: "doublings (-5)", expected: "0" },
      ],
      hint: "Count the values of `iterate (*2) 1` that are still below the target: `length (takeWhile (< target) (iterate (*2) 1))`.",
      solution: hs`doublings :: Int -> Int
doublings target = length (takeWhile (< target) (iterate (*2) 1))
`,
    },
    {
      k: "predict",
      expr: "until (\\(a, b) -> b == 0) (\\(a, b) -> (b, a `mod` b)) (48, 18)",
      answer: "(6,0)",
      why: "(48,18), then (18,12), (12,6), (6,0). This is Euclid's algorithm for the greatest common divisor: the state is a pair, and you stop when the second part hits 0.",
    },
    {
      k: "quiz",
      q: "In a worklist loop, when should you stop?",
      options: ["After exactly as many rounds as there were jobs at the start", "When the worklist is empty", "When the first job is finished", "When the state stops being a list"],
      answer: 1,
      why: "Jobs can create new jobs, so you can't know the number of rounds in advance. You stop when nothing is left to do.",
    },
    {
      k: "write",
      body: "Write `stable`, which returns the first element of a list that equals the element right after it. You may assume there is one.",
      starter: hs`stable :: Eq a => [a] -> a
stable xs = undefined
`,
      tests: [
        { expr: "stable [9,4,4,2]", expected: "4" },
        { expr: "stable \"aabb\"", expected: "'a'" },
        { expr: "stable (iterate (\\n -> min 20 (n * 3)) 1)", expected: "20" },
        { expr: "stable [1,2,3,3]", expected: "3" },
      ],
      hint: "`stable (x:y:rest)`: compare `x` and `y`; if different, recurse on `(y:rest)`.",
      solution: hs`stable :: Eq a => [a] -> a
stable (x:y:rest)
  | x == y = x
  | otherwise = stable (y:rest)
stable _ = error "no stable element"
`,
    },
    {
      k: "predict",
      expr: "let f xs = nub (xs ++ map (*2) (filter (< 10) xs)) in until (\\xs -> f xs == xs) f [1]",
      answer: "[1,2,4,8,16]",
      why: "Each round adds the doubles of the small numbers: [1], [1,2], [1,2,4], [1,2,4,8], [1,2,4,8,16]. Now the numbers below 10 are 1, 2, 4, 8, whose doubles are all already there, so `f` changes nothing and `until` stops.",
    },
    {
      k: "quiz",
      q: "2019's spec hint for `propUnits` says: \"if a CNF has multiple unit clauses, select one of them to propagate. The others will be picked up by recursion.\" Why does that work?",
      options: [
        "Because propagating one unit deletes all the others",
        "Because the recursive call looks for unit clauses again in the new formula, so any units still there get their turn",
        "Because there is only ever one unit clause",
        "It doesn't; you must propagate them all at once",
      ],
      answer: 1,
      why: "Each recursive call starts by finding units in the current formula. Units that survived, and new ones that appeared, are found on later rounds.",
    },
    {
      k: "predict",
      expr: "head (dropWhile (< 100) (iterate (*2) 3))",
      answer: "192",
      why: "3, 6, 12, 24, 48, 96 are all below 100. The first one that isn't is 192.",
    },
    {
      k: "quiz",
      q: "Which of these is guaranteed to finish for every starting list `xs`?",
      options: ["`fixpoint (0:) xs`", "`fixpoint (drop 1) xs`", "`fixpoint (\\ys -> ys ++ ys) xs`", "`fixpoint reverse xs`"],
      answer: 1,
      why: "`drop 1` makes the list shorter until it's `[]`, and `drop 1 [] == []`. `(0:)` and doubling the list grow forever (except doubling `[]`). `reverse` can swap back and forth forever: `[1,2]`, `[2,1]`, `[1,2]`, ... never equals the previous value.",
    },
    {
      k: "predict",
      expr: "let step s = concatMap (\\c -> if c == 'a' then \"b\" else [c]) s in until (notElem 'a') step \"banana\"",
      answer: "\"bbnbnb\"",
      why: "One step replaces every 'a' with 'b'. After that there's no 'a' left, so `until` stops.",
    },
    {
      k: "quiz",
      q: "Your fixed-point function seems to hang in GHCi. What's the most likely cause?",
      options: [
        "GHCi is slow with recursion",
        "Each round produces a different value, so `next == x` is never True (the step doesn't make progress towards a stopping point)",
        "You forgot a type signature",
        "You used `where` instead of `let`",
      ],
      answer: 1,
      why: "Check that the step really converges. A typical bug: the step keeps adding something already present (use `nub` or check `elem` before adding), or re-adds finished work to a worklist.",
    },
    {
      k: "write",
      body: md(
        "Write `balanced`, which says whether a string of round brackets is balanced. Use a repeat-until-stable approach: delete every `\"()\"` in one pass, repeat until nothing changes, then check whether you are left with the empty string.",
        "",
        "Write your own helper for one pass. Hint: `('(':')':rest)` is a pattern for a string starting with `()`.",
      ),
      starter: hs`balanced :: String -> Bool
balanced s = undefined
`,
      tests: [
        { expr: 'balanced "(()())"', expected: "True" },
        { expr: 'balanced ""', expected: "True" },
        { expr: 'balanced "())("', expected: "False" },
        { expr: 'balanced "((("', expected: "False" },
        { expr: 'balanced "(())()((()))"', expected: "True" },
      ],
      hint: "`onePass ('(':')':rest) = onePass rest`, `onePass (c:rest) = c : onePass rest`, `onePass [] = []`. Then repeat `onePass` until the result equals its input, and compare with `\"\"`.",
      solution: hs`balanced :: String -> Bool
balanced s = repeatPass s == ""
  where
    repeatPass t
      | t' == t = t
      | otherwise = repeatPass t'
      where
        t' = onePass t
    onePass ('(':')':rest) = onePass rest
    onePass (c:rest) = c : onePass rest
    onePass [] = []
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2019, `propUnits`, 5 marks). Write `propUnits` completely, including your own helper to propagate one unit.",
        "",
        "Propagating unit `u`: remove every clause containing `u`, and delete `-u` from the rest. Keep going while there is a unit clause (a clause with exactly one literal). Return the final formula and the units used, in order.",
        "",
        "```",
        "propUnits [[-1,-4],[2,1,5],[3,-2],[4],[3,-5],[-3,-7],[1,7,6],[-3,6]]",
        "  == ([[2,5],[3,-2],[3,-5],[-3,-7],[7,6],[-3,6]], [4,-1])",
        "```",
      ),
      starter: hs`propUnits :: [[Int]] -> ([[Int]], [Int])
propUnits cs = undefined
`,
      tests: [
        { expr: "propUnits []", expected: "([], [])" },
        {
          expr: "propUnits [[1,2,3],[1,2,-3],[1,-2,3],[1,-2,-3],[-1,2,3],[-1,2,-3],[-1,-2,3]]",
          expected: "([[1,2,3],[1,2,-3],[1,-2,3],[1,-2,-3],[-1,2,3],[-1,2,-3],[-1,-2,3]], [])",
        },
        {
          expr: "propUnits [[-1,-4],[2,1,5],[3,-2],[4],[3,-5],[-3,-7],[1,7,6],[-3,6]]",
          expected: "([[2,5],[3,-2],[3,-5],[-3,-7],[7,6],[-3,6]], [4,-1])",
        },
        { expr: "propUnits [[5],[-5,6],[-6,7],[7,8]]", expected: "([], [5,6,7])" },
        { expr: "propUnits [[2],[-2]]", expected: "([[]], [2])" },
      ],
      hint: "Helper: `propagate u cs = [filter (/= negate u) c | c <- cs, notElem u c]`. Then `case [u | [u] <- cs] of [] -> (cs, []); (u:_) -> ...` with a recursive call on `propagate u cs`.",
      solution: hs`propUnits :: [[Int]] -> ([[Int]], [Int])
propUnits cs =
  case [u | [u] <- cs] of
    [] -> (cs, [])
    (u:_) -> (cs', u : us)
      where
        (cs', us) = propUnits (propagate u cs)

propagate :: Int -> [[Int]] -> [[Int]]
propagate u cs = [filter (/= negate u) c | c <- cs, notElem u c]
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2018, `scan`, part of `propagateConstants`, 7 marks). The types, `sub` and test blocks are given.",
        "",
        "`scan v c block` substitutes `v := c` into every right-hand side (using `sub`). Assignments that have become `Const n` (except to `\"$return\"`) are removed from the block and returned as the new worklist `(name, n)`, in block order.",
      ),
      setup: ssaSetup,
      starter: hs`scan :: String -> Int -> Block -> (Worklist, Block)
scan v c block = undefined
`,
      tests: [
        { expr: 'scan "$INVALID" 0 block1', expected: '([("x0",1),("y0",2)], drop 2 block1)' },
        { expr: 'scan "x0" 5 [("x1", Apply Add (Var "x0") (Const 1)), ("z", Var "q")]', expected: '([("x1",6)], [("z", Var "q")])' },
        { expr: 'scan "y1" 9 [("$return", Var "y1")]', expected: '([], [("$return", Const 9)])' },
        { expr: 'scan "a" 1 []', expected: "([], [])" },
        { expr: 'fst (scan "$INVALID" 0 block2)', expected: '[("a",2)]' },
      ],
      hint: "Substitute first (`block'`), then take two list comprehensions over `block'`: one picking `(w, Const n)` with `w /= \"$return\"`, one keeping the rest.",
      solution: scanSolution,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2018, `propagateConstants`, the spec's \"substitution\" method). The types, `foldExp`, `sub` and test blocks are given.",
        "",
        "Repeat this round until the block stops changing: find all assignments `(v, Const c)` (not `\"$return\"`), remove them, and substitute every one of them into the remaining right-hand sides.",
      ),
      setup: ssaSetup,
      starter: hs`propagateConstants :: Block -> Block
propagateConstants block = undefined
`,
      tests: [
        { expr: "propagateConstants block1", expected: '[("$return", Const 9)]' },
        {
          expr: "propagateConstants block2",
          expected: '[("b", Apply Add (Var "n") (Const 2)), ("$return", Apply Mul (Var "b") (Const 2))]',
        },
        { expr: "propagateConstants []", expected: "[]" },
        { expr: 'propagateConstants [("$return", Var "q")]', expected: '[("$return", Var "q")]' },
        {
          expr: 'propagateConstants [("p", Const 3), ("q", Apply Mul (Var "p") (Var "p")), ("r", Apply Add (Var "q") (Var "s")), ("$return", Var "r")]',
          expected: '[("r", Apply Add (Const 9) (Var "s")), ("$return", Var "r")]',
        },
      ],
      hint: "One round: `consts = [(v, c) | (v, Const c) <- b, v /= \"$return\"]`, keep the other assignments, and apply every substitution with `foldr (\\(v, c) e' -> sub v c e') e consts` to each right-hand side. Then compare the new block with the old one.",
      solution: hs`propagateConstants :: Block -> Block
propagateConstants block
  | block' == block = block
  | otherwise = propagateConstants block'
  where
    consts = [(v, c) | (v, Const c) <- block, v /= "$return"]
    rest = [(v, e) | (v, e) <- block, notElem v (map fst consts)]
    block' = [(v, foldr (\(w, c) e' -> sub w c e') e consts) | (v, e) <- rest]
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2011, `unifyPairs`, 8 marks). This is a worklist of type pairs. The types, `occurs` and `substT` are given.",
        "",
        "`unifyPairs pairs s` looks at the head pair:",
        "",
        "- `(TInt, TInt)` or `(TBool, TBool)`, or two identical `TVar`s: discard it and carry on.",
        "- `(TVar v, t)` or `(t, TVar v)`: if `occurs v t`, fail with `Nothing`. Otherwise add `(v, t)` to the front of `s`, and replace `TVar v` by `t` in every remaining pair (`substT v t`).",
        "- `(TFun a b, TFun a' b')`: replace it by the two pairs `(a, a')` and `(b, b')` at the front.",
        "- Anything else: `Nothing`.",
        "",
        "When the list is empty, succeed with `Just s`.",
      ),
      setup: hs`import Data.List (sort)

data Type = TInt | TBool | TFun Type Type | TVar String
  deriving (Eq, Ord, Show)

type Sub = [(String, Type)]

occurs :: String -> Type -> Bool
occurs v (TVar w) = v == w
occurs v (TFun a b) = occurs v a || occurs v b
occurs _ _ = False

substT :: String -> Type -> Type -> Type
substT v t (TVar w)
  | v == w = t
substT v t (TFun a b) = TFun (substT v t a) (substT v t b)
substT _ _ other = other
`,
      starter: hs`unifyPairs :: [(Type, Type)] -> Sub -> Maybe Sub
unifyPairs pairs s = undefined
`,
      tests: [
        { expr: "unifyPairs [(TInt, TInt)] []", expected: "Just []" },
        { expr: "unifyPairs [(TInt, TBool)] []", expected: "Nothing" },
        { expr: 'unifyPairs [(TVar "a", TInt)] []', expected: 'Just [("a", TInt)]' },
        { expr: 'fmap sort (unifyPairs [(TFun (TVar "a") TBool, TFun TInt (TVar "b"))] [])', expected: 'Just [("a", TInt), ("b", TBool)]' },
        { expr: 'unifyPairs [(TVar "a", TFun (TVar "a") TInt)] []', expected: "Nothing" },
        { expr: 'unifyPairs [(TFun (TVar "a") (TVar "a"), TFun TInt TBool)] []', expected: "Nothing" },
      ],
      hint: "One equation per rule. For the variable case write a helper `bind v t ps s`: `Nothing` if `occurs v t`, else `unifyPairs [(substT v t a, substT v t b) | (a, b) <- ps] ((v, t) : s)`. Put the 'two equal TVars' equation before the general TVar ones.",
      solution: hs`unifyPairs :: [(Type, Type)] -> Sub -> Maybe Sub
unifyPairs [] s = Just s
unifyPairs ((TInt, TInt) : ps) s = unifyPairs ps s
unifyPairs ((TBool, TBool) : ps) s = unifyPairs ps s
unifyPairs ((TVar v, TVar w) : ps) s
  | v == w = unifyPairs ps s
unifyPairs ((TVar v, t) : ps) s = bind v t ps s
unifyPairs ((t, TVar v) : ps) s = bind v t ps s
unifyPairs ((TFun a b, TFun a' b') : ps) s = unifyPairs ((a, a') : (b, b') : ps) s
unifyPairs _ _ = Nothing

bind :: String -> Type -> [(Type, Type)] -> Sub -> Maybe Sub
bind v t ps s
  | occurs v t = Nothing
  | otherwise = unifyPairs [(substT v t a, substT v t b) | (a, b) <- ps] ((v, t) : s)
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2013, the idea behind `binSort`: \"repeatedly extract, and then delete, the minimum element, until the heap becomes empty\"). Here the \"heap\" is just a list.",
        "",
        "Write `minSort`, which sorts a list by repeatedly taking out the minimum until nothing is left. Don't use `sort`. `delete` from `Data.List` removes the first occurrence of a value; you'll need to import it.",
      ),
      starter: hs`import Data.List (delete)

minSort :: Ord a => [a] -> [a]
minSort xs = undefined
`,
      banned: ["sort", "sortBy", "sortOn"],
      tests: [
        { expr: 'minSort "BinomialHeap"', expected: '"BHaaeiilmnop"' },
        { expr: "minSort ([] :: [Int])", expected: "[]" },
        { expr: "minSort [3,1,2,1]", expected: "[1,1,2,3]" },
        { expr: "minSort [5]", expected: "[5]" },
        { expr: "minSort [9,8..1]", expected: "[1..9]" },
      ],
      hint: "`minSort [] = []`; otherwise `m = minimum xs` comes first, followed by `minSort (delete m xs)`.",
      solution: hs`import Data.List (delete)

minSort :: Ord a => [a] -> [a]
minSort [] = []
minSort xs = m : minSort (delete m xs)
  where
    m = minimum xs
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// 14. Merging sorted lists
// ---------------------------------------------------------------------------

const polySetup = hs`import Data.Ratio ((%))

type Coefficient = Rational
type Exponent = Integer
type Term = (Coefficient, Exponent)
type Polynomial = [Term]

p1, p2, p3, p4, p5 :: Polynomial
p1 = [(5, 0)]
p2 = [(1, 1)]
p3 = [(2, 2), (-3, 1), (1, 0)]
p4 = [(4, 1), (-3, 0)]
p5 = [(2, 3), (-2, 1), (2, 0)]
`;

const addPSolution = hs`addP :: Polynomial -> Polynomial -> Polynomial
addP p q
  | null terms = [(0, 0)]
  | otherwise = terms
  where
    terms = filter (\(c, _) -> c /= 0) (go p q)
    go [] ys = ys
    go xs [] = xs
    go ((c1, e1) : xs) ((c2, e2) : ys)
      | e1 > e2 = (c1, e1) : go xs ((c2, e2) : ys)
      | e1 < e2 = (c2, e2) : go ((c1, e1) : xs) ys
      | otherwise = (c1 + c2, e1) : go xs ys
`;

const mulPSolution = hs`mulP :: Polynomial -> Polynomial -> Polynomial
mulP p q = foldr addP [(0, 0)] [[(c1 * c2, e1 + e2)] | (c1, e1) <- p, (c2, e2) <- q]
`;

const heapSetup = hs`data BinTree a = Node a Int [BinTree a]
  deriving (Eq, Show)

type BinHeap a = [BinTree a]

value :: BinTree a -> a
value (Node v _ _) = v

rank :: BinTree a -> Int
rank (Node _ r _) = r

combineTrees :: Ord a => BinTree a -> BinTree a -> BinTree a
combineTrees t1@(Node v1 r1 c1) t2@(Node v2 _ c2)
  | v1 < v2 = Node v1 (r1 + 1) (t2 : c1)
  | otherwise = Node v2 (r1 + 1) (t1 : c2)
`;

const mergeHeapsSolution = hs`mergeHeaps :: Ord a => BinHeap a -> BinHeap a -> BinHeap a
mergeHeaps [] h = h
mergeHeaps h [] = h
mergeHeaps h1@(t : ts) h2@(t' : ts')
  | rank t < rank t' = t : mergeHeaps ts h2
  | rank t' < rank t = t' : mergeHeaps h1 ts'
  | otherwise = mergeHeaps [combineTrees t t'] (mergeHeaps ts ts')
`;

const heapTests = [
  { expr: "mergeHeaps [] [Node 3 0 []]", expected: "[Node 3 0 []]" },
  { expr: "mergeHeaps [Node 4 0 []] [Node 7 0 []]", expected: "[Node 4 1 [Node 7 0 []]]" },
  { expr: "mergeHeaps [Node 4 0 []] [Node 1 1 [Node 5 0 []]]", expected: "[Node 4 0 [], Node 1 1 [Node 5 0 []]]" },
  {
    expr: "mergeHeaps [Node 1 1 [Node 5 0 []]] [Node 4 0 [], Node 12 1 [Node 16 0 []]]",
    expected: "[Node 4 0 [], Node 1 2 [Node 12 1 [Node 16 0 []], Node 5 0 []]]",
  },
  { expr: "map rank (foldr (\\x h -> mergeHeaps [Node x 0 []] h) [] [1 .. 7 :: Int])", expected: "[0,1,2]" },
  { expr: "map rank (foldr (\\x h -> mergeHeaps [Node x 0 []] h) [] [1 .. 12 :: Int])", expected: "[2,3]" },
];

const merging: Lesson = {
  id: "merging",
  title: "Merging sorted lists",
  blurb: "Walk two sorted lists together: merge, insert, add polynomials (2024), merge heaps and add binary numbers with a carry (2013).",
  steps: [
    {
      k: "read",
      body: md(
        "Many exam data structures are lists kept in a particular order: polynomial terms by exponent (2024), heap trees by rank (2013), binary digits by position. Combining two of them is called merging.",
        "",
        "The idea: both lists are already sorted, so the smallest element overall must be at the front of one of them. Compare the two heads, output the smaller one, and carry on with what's left.",
        "",
        "```",
        "merge :: Ord a => [a] -> [a] -> [a]",
        "merge [] ys = ys",
        "merge xs [] = xs",
        "merge (x:xs) (y:ys)",
        "  | x <= y    = x : merge xs (y:ys)",
        "  | otherwise = y : merge (x:xs) ys",
        "```",
        "",
        "Notice that only the list whose head was used gets shorter. The other one is passed on whole, head included.",
      ),
    },
    {
      k: "quiz",
      q: "Why does `merge` need two base cases, `merge [] ys = ys` and `merge xs [] = xs`?",
      options: [
        "It doesn't; one would do",
        "Either list can run out first, and when one does, everything left in the other list is already in order, so it goes on the end as it is",
        "So that the result is reversed",
        "Because `merge [] []` would crash otherwise",
      ],
      answer: 1,
      why: "If the first list runs out, the rest of the answer is `ys`; if the second does, it's `xs`. Forgetting one gives a \"non-exhaustive patterns\" crash on some inputs.",
    },
    {
      k: "predict",
      body: "Here is `merge` written on one line with `let`, so GHCi can run it.",
      expr: "let m xs [] = xs; m [] ys = ys; m (x:xs) (y:ys) = if x <= y then x : m xs (y:ys) else y : m (x:xs) ys in m [1,5,9] [2,3,10]",
      answer: "[1,2,3,5,9,10]",
      why: "Compare 1 and 2: take 1. Compare 5 and 2: take 2. 5 and 3: take 3. 5 and 10: take 5. 9 and 10: take 9. The first list is empty, so the rest is `[10]`.",
    },
    {
      k: "write",
      body: "Write `merge` yourself.",
      starter: hs`merge :: Ord a => [a] -> [a] -> [a]
merge xs ys = undefined
`,
      tests: [
        { expr: "merge [1,5,9] [2,3,10]", expected: "[1,2,3,5,9,10]" },
        { expr: "merge [] [1,2]", expected: "[1,2]" },
        { expr: "merge [4] []", expected: "[4]" },
        { expr: "merge [1,1,3] [1,2]", expected: "[1,1,1,2,3]" },
        { expr: 'merge "aceg" "bdf"', expected: '"abcdefg"' },
      ],
      hint: "Three equations: `[]` first, `[]` second, then `(x:xs) (y:ys)` with guards `x <= y` and `otherwise`.",
      solution: hs`merge :: Ord a => [a] -> [a] -> [a]
merge [] ys = ys
merge xs [] = xs
merge (x:xs) (y:ys)
  | x <= y = x : merge xs (y:ys)
  | otherwise = y : merge (x:xs) ys
`,
    },
    {
      k: "read",
      body: md(
        "A special case of merging: put one new element into a sorted list. Walk along until you meet something at least as big, and put the new element there. `Data.List` has this as `insert`:",
        "",
        "```",
        "insert 5 [1,3,7,9]   is  [1,3,5,7,9]",
        "```",
        "",
        "In fact `insert x ys` is just `merge [x] ys`.",
      ),
    },
    {
      k: "predict",
      expr: "insert 'c' \"abde\"",
      answer: "\"abcde\"",
      why: "`'c'` goes in front of the first character that is at least `'c'`, which is `'d'`.",
    },
    {
      k: "write",
      body: "Write `insertSorted x ys` without using `insert` or `merge`.",
      starter: hs`insertSorted :: Ord a => a -> [a] -> [a]
insertSorted x ys = undefined
`,
      banned: ["insert"],
      tests: [
        { expr: "insertSorted 5 [1,3,7,9]", expected: "[1,3,5,7,9]" },
        { expr: "insertSorted 5 []", expected: "[5]" },
        { expr: "insertSorted 0 [1,2]", expected: "[0,1,2]" },
        { expr: "insertSorted 9 [1,2]", expected: "[1,2,9]" },
        { expr: "insertSorted 2 [1,2,3]", expected: "[1,2,2,3]" },
      ],
      hint: "`insertSorted x [] = [x]`. For `(y:ys)`: if `x <= y`, the answer is `x : y : ys`; otherwise `y : insertSorted x ys`.",
      solution: hs`insertSorted :: Ord a => a -> [a] -> [a]
insertSorted x [] = [x]
insertSorted x (y:ys)
  | x <= y = x : y : ys
  | otherwise = y : insertSorted x ys
`,
    },
    {
      k: "read",
      body: md(
        "Merging becomes more interesting when two heads can be equal and must be combined into one.",
        "",
        "For example, two sorted sets with no repeats: if the heads are equal, keep just one copy and move past both. This takes one step through each list instead of the `nub (xs ++ ys)` approach, which compares everything with everything.",
        "",
        "```",
        "| x == y = x : union' xs ys      -- both heads used up",
        "```",
      ),
    },
    {
      k: "write",
      body: "Write `unionSorted`: both inputs are sorted with no repeats; the output must be sorted with no repeats.",
      starter: hs`unionSorted :: Ord a => [a] -> [a] -> [a]
unionSorted xs ys = undefined
`,
      tests: [
        { expr: "unionSorted [1,3,5] [2,3,4]", expected: "[1,2,3,4,5]" },
        { expr: "unionSorted [1,2] [1,2]", expected: "[1,2]" },
        { expr: "unionSorted [] [7]", expected: "[7]" },
        { expr: "unionSorted [7] []", expected: "[7]" },
        { expr: 'unionSorted "bdf" "abcdef"', expected: '"abcdef"' },
      ],
      hint: "Like `merge`, but with three guards: `x < y`, `x > y`, and `otherwise` (equal), where you output `x` once and recurse on `xs ys`.",
      solution: hs`unionSorted :: Ord a => [a] -> [a] -> [a]
unionSorted [] ys = ys
unionSorted xs [] = xs
unionSorted (x:xs) (y:ys)
  | x < y = x : unionSorted xs (y:ys)
  | x > y = y : unionSorted (x:xs) ys
  | otherwise = x : unionSorted xs ys
`,
    },
    {
      k: "read",
      body: md(
        "Now the 2024 exam. A polynomial like 2x³ − 2x + 2 is a list of terms `(coefficient, exponent)`:",
        "",
        "```",
        "type Term       = (Rational, Integer)",
        "type Polynomial = [Term]",
        "",
        "p5 = [(2,3), (-2,1), (2,0)]      -- 2x^3 - 2x + 2",
        "```",
        "",
        "Three rules from the spec that the autotester will hold you to:",
        "",
        "1. Terms are in decreasing order of exponent (biggest power first).",
        "2. No term has coefficient 0 (so no `(0,2)` in the middle).",
        "3. The zero polynomial is `[(0,0)]`, never `[]`.",
        "",
        "Adding two polynomials (`addP`, part of 8 marks) is a merge on the exponents. Because the order is decreasing, the head with the bigger exponent goes first. Equal exponents combine by adding the coefficients.",
      ),
    },
    {
      k: "quiz",
      q: "Adding `[(3,2),(1,0)]` and `[(5,4),(1,2)]`: which term comes first in the answer?",
      options: ["`(3,2)`", "`(5,4)`", "`(4,2)`", "`(1,0)`"],
      answer: 1,
      why: "Exponents go from biggest to smallest, and 4 is the biggest. So in `addP` you output the head with the larger exponent, the opposite of `merge`, which takes the smaller.",
    },
    {
      k: "predict",
      body: "Coefficients are `Rational`, exact fractions. `%` builds one (numerator % denominator), and GHCi always prints them in lowest terms with `%`.",
      expr: "2 % 3 + 1 % 3",
      answer: "1 % 1",
      why: "2/3 + 1/3 = 1, which a Rational prints as `1 % 1`.",
    },
    {
      k: "quiz",
      q: "What should `addP [(1,2)] [(-1,2)]` give?",
      options: ["`[]`", "`[(0,2)]`", "`[(0,0)]`", "`[(0,2),(0,0)]`"],
      answer: 2,
      why: "x² + (−x²) = 0. The term `(0,2)` has coefficient 0, so it's dropped, leaving nothing. But `[]` is not a valid polynomial: zero is written `[(0,0)]`. This edge case is exactly what autotesters check.",
    },
    {
      k: "write",
      body: md(
        "Write 2024's `addP`. The types and `p1`..`p5` are given.",
        "",
        "Plan: merge the term lists by exponent (combining equal exponents), then drop terms with coefficient 0, then turn an empty result into `[(0,0)]`.",
        "",
        "```",
        "addP p3 p4          == [(2,2),(1,1),(-2,0)]     -- 2x^2 + x - 2",
        "addP p5 [(0,0)]     == p5",
        "```",
      ),
      setup: polySetup,
      starter: hs`addP :: Polynomial -> Polynomial -> Polynomial
addP p q = undefined
`,
      tests: [
        { expr: "addP p2 p2", expected: "[(2,1)]" },
        { expr: "addP p3 p4", expected: "[(2,2),(1,1),(-2,0)]" },
        { expr: "addP p5 [(0,0)]", expected: "p5" },
        { expr: "addP [(0,0)] p2", expected: "p2" },
        { expr: "addP [(1,2)] [(-1,2)]", expected: "[(0,0)]" },
        { expr: "addP [(1 % 2, 3)] [(1,0)]", expected: "[(1 % 2, 3), (1, 0)]" },
        { expr: "addP [(1,3),(1,1)] [(2,2),(-1,1)]", expected: "[(1,3),(2,2)]" },
      ],
      hint: "Write a local `go` that merges: if `e1 > e2` output `(c1, e1)` first; if `e1 < e2` output `(c2, e2)` first; if equal output `(c1 + c2, e1)` and move past both. Then `filter (\\(c, _) -> c /= 0)`, and use a guard `null terms = [(0, 0)]`.",
      solution: addPSolution,
    },
    {
      k: "read",
      body: md(
        "Multiplying (`mulP`, the other part of those 8 marks) uses a pattern you'll see again and again: combine every term with every term, then merge all the pieces together.",
        "",
        "Two terms multiply by multiplying coefficients and adding exponents: 2x³ × 3x² = 6x⁵, so `(2,3)` times `(3,2)` is `(6,5)`.",
        "",
        "A list comprehension with two generators gives every pair. But the products come out in the wrong order and with repeated exponents. Rather than sort and combine by hand, reuse `addP`: turn each product into a one-term polynomial and add them all up with `foldr`.",
        "",
        "```",
        "mulP p q = foldr addP [(0,0)] [[(c1 * c2, e1 + e2)] | (c1, e1) <- p, (c2, e2) <- q]",
        "```",
        "",
        "Reusing a function you've already written is exactly what the examiners mean by \"Using addP, or otherwise\". It's shorter, and it inherits all of addP's careful edge cases.",
      ),
    },
    {
      k: "predict",
      expr: "[(c1 * c2, e1 + e2) | (c1, e1) <- [(2,1),(1,0)], (c2, e2) <- [(3,1),(-1,0)]]",
      answer: "[(6,2),(-2,1),(3,1),(-1,0)]",
      why: "For each term of the first list (outer generator), go through every term of the second. `(2,1)` gives `(6,2)` and `(-2,1)`; then `(1,0)` gives `(3,1)` and `(-1,0)`. Two terms have exponent 1, so this still needs combining: that's what `addP` does.",
    },
    {
      k: "quiz",
      q: "Why is `foldr addP [(0,0)] ...` started from `[(0,0)]`?",
      options: [
        "Because `foldr` needs a list of length 1",
        "Because `[(0,0)]` is the zero polynomial: adding it changes nothing, and it's also the right answer if there is nothing to add",
        "Because the constant term must always be present",
        "It should be `[]`",
      ],
      answer: 1,
      why: "The starting value of a fold over addition should be the \"nothing\" value for addition, which for polynomials is `[(0,0)]`. Starting from `[]` would break the rule that `[]` is never a polynomial.",
    },
    {
      k: "write",
      body: md(
        "Write `mulP`. `addP` is given (reuse it!).",
        "",
        "```",
        "mulP p3 p4 == [(8,3),(-18,2),(13,1),(-3,0)]     -- 8x^3 - 18x^2 + 13x - 3",
        "```",
      ),
      setup: polySetup + "\n" + addPSolution,
      starter: hs`mulP :: Polynomial -> Polynomial -> Polynomial
mulP p q = undefined
`,
      tests: [
        { expr: "mulP p3 p4", expected: "[(8,3),(-18,2),(13,1),(-3,0)]" },
        { expr: "mulP p2 p2", expected: "[(1,2)]" },
        { expr: "mulP p5 [(0,0)]", expected: "[(0,0)]" },
        { expr: "mulP [(1,1),(1,0)] [(1,1),(-1,0)]", expected: "[(1,2),(-1,0)]" },
        { expr: "mulP p1 [(1 % 5, 2)]", expected: "[(1,2)]" },
      ],
      hint: "One line: `foldr addP [(0, 0)] [[(c1 * c2, e1 + e2)] | (c1, e1) <- p, (c2, e2) <- q]`.",
      solution: mulPSolution,
    },
    {
      k: "write",
      body: md(
        "2024 also asks for `sumP` and `prodP` (1 mark together) on a list of polynomials. `addP` and `mulP` are given.",
        "",
        "The starting value for a product is the polynomial 1, which is `[(1,0)]`.",
      ),
      setup: polySetup + "\n" + addPSolution + "\n" + mulPSolution,
      starter: hs`sumP :: [Polynomial] -> Polynomial
sumP ps = undefined

prodP :: [Polynomial] -> Polynomial
prodP ps = undefined
`,
      tests: [
        { expr: "sumP [[(0,0)]]", expected: "[(0,0)]" },
        { expr: "sumP [p1,p2,p3,p4,p5]", expected: "[(2,3),(2,2),(5,0)]" },
        { expr: "sumP []", expected: "[(0,0)]" },
        { expr: "prodP [p3,p5]", expected: "[(4,5),(-6,4),(-2,3),(10,2),(-8,1),(2,0)]" },
        { expr: "prodP []", expected: "[(1,0)]" },
      ],
      hint: "`sumP = foldr addP [(0, 0)]` and `prodP = foldr mulP [(1, 0)]`.",
      solution: hs`sumP :: [Polynomial] -> Polynomial
sumP ps = foldr addP [(0, 0)] ps

prodP :: [Polynomial] -> Polynomial
prodP ps = foldr mulP [(1, 0)] ps
`,
    },
    {
      k: "read",
      body: md(
        "Sometimes combining two equal heads makes something that has to go back into the merge. That's called a carry, just like in column addition.",
        "",
        "2013's binomial heaps: a heap is a list of trees in increasing order of rank, with at most one tree of each rank. Two trees of the same rank `r` combine into one tree of rank `r + 1` (`combineTrees`, given). But the rest of the heaps might already contain a tree of rank `r + 1`, so the combined tree can't simply be put on the front. The spec says: merge it, as a one-tree heap, with the result of merging the two tails.",
        "",
        "```",
        "mergeHeaps h1@(t:ts) h2@(t':ts')",
        "  | rank t < rank t' = t  : mergeHeaps ts h2",
        "  | rank t' < rank t = t' : mergeHeaps h1 ts'",
        "  | otherwise        = mergeHeaps [combineTrees t t'] (mergeHeaps ts ts')",
        "```",
        "",
        "`h1@(t:ts)` is an as-pattern: `h1` names the whole list while `t` and `ts` name its parts.",
      ),
    },
    {
      k: "quiz",
      q: "In `mergeHeaps`, why not just write `combineTrees t t' : mergeHeaps ts ts'` in the equal-rank case?",
      options: [
        "It would be slower but still correct",
        "The tails might contain a tree of rank r + 1 too, and then the heap would have two trees of the same rank, breaking the heap rule",
        "`combineTrees` can't be used with `:`",
        "Because the combined tree must go at the end",
      ],
      answer: 1,
      why: "Same as carrying in addition: 1 + 1 in a column makes a carry that must be added to the next column, not just written down.",
    },
    {
      k: "write",
      body: md(
        "Write 2013's `mergeHeaps` (6 marks). The tree type, `rank` and `combineTrees` are given.",
        "",
        "- If either heap is empty, the result is the other.",
        "- Otherwise compare the ranks of the two head trees: the smaller rank goes first.",
        "- Equal ranks: combine the two trees, and merge that one-tree heap with the merge of the two tails.",
      ),
      setup: heapSetup,
      starter: hs`mergeHeaps :: Ord a => BinHeap a -> BinHeap a -> BinHeap a
mergeHeaps h1 h2 = undefined
`,
      tests: heapTests,
      hint: "Copy the shape from the explanation above, plus the two empty-heap equations first.",
      solution: mergeHeapsSolution,
    },
    {
      k: "read",
      body: md(
        "The same carrying happens in binary addition, which 2013 also asked for (`binarySum`). Add the two bits in a column plus the carry coming in:",
        "",
        "```",
        "s = b1 + b2 + carryIn       -- 0, 1, 2 or 3",
        "sum bit   = s `mod` 2",
        "carry out = s `div` 2",
        "```",
        "",
        "Addition goes from the rightmost (least significant) bit. Haskell lists are easiest to process from the front, so a neat plan is: work on lists stored least-significant-bit first, and `reverse` at the start and end.",
      ),
    },
    {
      k: "predict",
      expr: "let s = 1 + 1 + 1 in (s `mod` 2, s `div` 2)",
      answer: "(1,1)",
      why: "1 + 1 + 1 = 3, which is binary 11: sum bit 1, carry 1. Check it against the last row of 2013's full-adder table.",
    },
    {
      k: "write",
      body: md(
        "Write `addLSB xs ys carry`, which adds two binary numbers stored least-significant bit first. If one list runs out, treat its missing bits as 0. When both have run out, a carry of 1 becomes one more bit; a carry of 0 adds nothing.",
        "",
        "```",
        "addLSB [1,1] [1] 0  ==  [0,0,1]      -- 3 + 1 = 4",
        "```",
      ),
      starter: hs`addLSB :: [Int] -> [Int] -> Int -> [Int]
addLSB xs ys carry = undefined
`,
      tests: [
        { expr: "addLSB [1,1] [1] 0", expected: "[0,0,1]" },
        { expr: "addLSB [] [] 0", expected: "[]" },
        { expr: "addLSB [] [] 1", expected: "[1]" },
        { expr: "addLSB [1,0,1] [0,1] 0", expected: "[1,1,1]" },
        { expr: "addLSB [1] [1,1,1] 0", expected: "[0,0,0,1]" },
      ],
      hint: "Two base cases for `[] []`. Otherwise take the first bit of each list (or 0 if the list is empty), work out `s`, output `mod s 2`, and recurse on `drop 1 xs`, `drop 1 ys` with carry `div s 2`.",
      solution: hs`addLSB :: [Int] -> [Int] -> Int -> [Int]
addLSB [] [] 0 = []
addLSB [] [] c = [c]
addLSB xs ys c = mod s 2 : addLSB (drop 1 xs) (drop 1 ys) (div s 2)
  where
    s = firstBit xs + firstBit ys + c
    firstBit [] = 0
    firstBit (b:_) = b
`,
    },
    {
      k: "write",
      body: md(
        "Now `binarySum`, with numbers written the normal way (most significant bit first), as in 2013. `addLSB` is given.",
        "",
        "```",
        "binarySum [1,0,1] [1,1]  ==  [1,0,0,0]      -- 5 + 3 = 8",
        "```",
      ),
      setup: hs`addLSB :: [Int] -> [Int] -> Int -> [Int]
addLSB [] [] 0 = []
addLSB [] [] c = [c]
addLSB xs ys c = mod s 2 : addLSB (drop 1 xs) (drop 1 ys) (div s 2)
  where
    s = firstBit xs + firstBit ys + c
    firstBit [] = 0
    firstBit (b:_) = b
`,
      starter: hs`binarySum :: [Int] -> [Int] -> [Int]
binarySum xs ys = undefined
`,
      tests: [
        { expr: "binarySum [1,0,1] [1,1]", expected: "[1,0,0,0]" },
        { expr: "binarySum [1] [1]", expected: "[1,0]" },
        { expr: "binarySum [1,1,0,0] [1,1]", expected: "[1,1,1,1]" },
        { expr: "binarySum [1,1] [1,1,0]", expected: "[1,0,0,1]" },
        { expr: "binarySum [1,0] [0]", expected: "[1,0]" },
      ],
      hint: "Reverse both inputs, add with carry 0, and reverse the result.",
      solution: hs`binarySum :: [Int] -> [Int] -> [Int]
binarySum xs ys = reverse (addLSB (reverse xs) (reverse ys) 0)
`,
    },
    {
      k: "quiz",
      q: "Which of these is NOT a merge-by-comparing-heads problem?",
      options: [
        "Adding two polynomials in standard form",
        "Merging two binomial heaps",
        "Reversing a list",
        "Combining two sorted lists of (key, count) pairs, adding counts for equal keys",
      ],
      answer: 2,
      why: "Reversing looks at one list. The other three all walk two sorted lists together, compare heads, and combine equal ones. When you see \"both lists are in order\" in a spec, think merge.",
    },
  ],
};

const drillMerging: DrillSet = {
  id: "drill-merging",
  lesson: "merging",
  title: "Merging sorted lists: drills",
  drills: [
    {
      k: "quiz",
      q: "What must be true of the inputs for `merge` to give a sorted answer?",
      options: ["Nothing", "Both inputs are already sorted", "Both inputs have the same length", "The inputs have no repeats"],
      answer: 1,
      why: "`merge` only ever compares the two heads. That's only enough if each list is sorted, so its head is its smallest element.",
    },
    {
      k: "predict",
      expr: "insert 4 [1,3,5,7]",
      answer: "[1,3,4,5,7]",
      why: "4 goes just before the first element that is at least 4, which is 5.",
    },
    {
      k: "predict",
      expr: "let m xs [] = xs; m [] ys = ys; m (x:xs) (y:ys) = if x <= y then x : m xs (y:ys) else y : m (x:xs) ys in m [2,4] [1,3,5,7]",
      answer: "[1,2,3,4,5,7]",
      why: "Heads compared in turn: 1, 2, 3, 4. Then the first list is empty, so `[5,7]` goes on the end unchanged.",
    },
    {
      k: "quiz",
      q: "What is `merge [] [3,1,2]` (using the lesson's `merge`)?",
      options: ["`[1,2,3]`", "`[3,1,2]`", "`[]`", "An error, because the input isn't sorted"],
      answer: 1,
      why: "The base case hands back the other list exactly as it is. `merge` never sorts; it trusts its inputs are sorted already.",
    },
    {
      k: "predict",
      expr: "foldr insert [] [3,1,2]",
      answer: "[1,2,3]",
      why: "Insert 2 into `[]`, then 1, then 3, keeping the list sorted each time. Inserting every element is a full sort (insertion sort).",
    },
    {
      k: "write",
      body: "Write `insertSorted x ys`, which puts `x` into the sorted list `ys` in the right place. Don't use `insert`.",
      starter: hs`insertSorted :: Ord a => a -> [a] -> [a]
insertSorted x ys = undefined
`,
      banned: ["insert"],
      tests: [
        { expr: "insertSorted 3 [1,2,4,5]", expected: "[1,2,3,4,5]" },
        { expr: "insertSorted 'a' \"\"", expected: '"a"' },
        { expr: "insertSorted 10 [1,2]", expected: "[1,2,10]" },
        { expr: "insertSorted (-1) [0]", expected: "[-1,0]" },
      ],
      hint: "Stop at the first `y` with `x <= y` and put `x` in front of it.",
      solution: hs`insertSorted :: Ord a => a -> [a] -> [a]
insertSorted x [] = [x]
insertSorted x (y:ys)
  | x <= y = x : y : ys
  | otherwise = y : insertSorted x ys
`,
    },
    {
      k: "quiz",
      q: "In 2024's polynomials, why is zero written `[(0,0)]` rather than `[]`?",
      options: [
        "Because `[]` causes a type error",
        "Because the spec says so: `[]` is not a valid polynomial, and the tests will expect `[(0,0)]`",
        "Because Rational can't be empty",
        "It's a matter of taste; either passes",
      ],
      answer: 1,
      why: "Representation rules in a spec are part of the answer. `addP [(1,2)] [(-1,2)]` must give `[(0,0)]`; giving `[]` fails the test even though it's \"mathematically\" fine.",
    },
    {
      k: "predict",
      expr: "3 % 4 + 1 % 4",
      answer: "1 % 1",
      why: "3/4 + 1/4 = 1, printed by GHCi as `1 % 1`.",
    },
    {
      k: "quiz",
      q: "Merging polynomials in decreasing exponent order: the heads are `(3,2)` and `(5,4)`. What do you output first?",
      options: ["`(3,2)`", "`(5,4)`", "`(8,4)`", "`(8,6)`"],
      answer: 1,
      why: "Biggest exponent first. Only equal exponents combine.",
    },
    {
      k: "write",
      body: "Write `mergeDesc`, which merges two lists that are sorted in decreasing order, giving a list in decreasing order.",
      starter: hs`mergeDesc :: Ord a => [a] -> [a] -> [a]
mergeDesc xs ys = undefined
`,
      tests: [
        { expr: "mergeDesc [9,5,1] [10,3,2]", expected: "[10,9,5,3,2,1]" },
        { expr: "mergeDesc [] [3,2]", expected: "[3,2]" },
        { expr: "mergeDesc [4] []", expected: "[4]" },
        { expr: "mergeDesc [3,3] [3]", expected: "[3,3,3]" },
        { expr: 'mergeDesc "zyx" "yb"', expected: '"zyyxb"' },
      ],
      hint: "Exactly `merge`, but output the head that is bigger: guard `x >= y`.",
      solution: hs`mergeDesc :: Ord a => [a] -> [a] -> [a]
mergeDesc [] ys = ys
mergeDesc xs [] = xs
mergeDesc (x:xs) (y:ys)
  | x >= y = x : mergeDesc xs (y:ys)
  | otherwise = y : mergeDesc (x:xs) ys
`,
    },
    {
      k: "predict",
      expr: "[(c1 * c2, e1 + e2) | (c1, e1) <- [(1,1),(2,0)], (c2, e2) <- [(1,1),(-2,0)]]",
      answer: "[(1,2),(-2,1),(2,1),(-4,0)]",
      why: "(x + 2)(x − 2): every term times every term, outer list first. The two `x` terms, `(-2,1)` and `(2,1)`, cancel once combined, giving x² − 4.",
    },
    {
      k: "quiz",
      q: "How many term-by-term products does `mulP` form for a 3-term polynomial times a 4-term polynomial?",
      options: ["3", "7", "12", "4"],
      answer: 2,
      why: "Every one of the 3 terms meets every one of the 4: 3 × 4 = 12 products, before combining equal exponents.",
    },
    {
      k: "predict",
      expr: "filter ((/= 0) . fst) [(0,2),(3,1),(0,0)]",
      answer: "[(3,1)]",
      why: "Keeps only terms whose coefficient (the `fst`) isn't 0. Note that this also removes `(0,0)`, so after filtering you must check for an empty list.",
    },
    {
      k: "write",
      body: md(
        "Write `addCounts`, which combines two lists of `(word, count)` pairs, each sorted by word with no repeated words. Equal words have their counts added. The output is sorted by word.",
      ),
      starter: hs`addCounts :: [(String, Int)] -> [(String, Int)] -> [(String, Int)]
addCounts xs ys = undefined
`,
      tests: [
        { expr: 'addCounts [("a",1),("c",2)] [("b",5),("c",1)]', expected: '[("a",1),("b",5),("c",3)]' },
        { expr: 'addCounts [] [("x",1)]', expected: '[("x",1)]' },
        { expr: 'addCounts [("x",1)] []', expected: '[("x",1)]' },
        { expr: 'addCounts [("cat",2)] [("cat",3)]', expected: '[("cat",5)]' },
        { expr: 'addCounts [("b",1)] [("a",1),("c",1)]', expected: '[("a",1),("b",1),("c",1)]' },
      ],
      hint: "Merge on the keys: compare `k1` and `k2`. Smaller key goes first; equal keys give `(k1, n1 + n2)` and recurse on both tails.",
      solution: hs`addCounts :: [(String, Int)] -> [(String, Int)] -> [(String, Int)]
addCounts [] ys = ys
addCounts xs [] = xs
addCounts ((k1, n1) : xs) ((k2, n2) : ys)
  | k1 < k2 = (k1, n1) : addCounts xs ((k2, n2) : ys)
  | k1 > k2 = (k2, n2) : addCounts ((k1, n1) : xs) ys
  | otherwise = (k1, n1 + n2) : addCounts xs ys
`,
    },
    {
      k: "quiz",
      q: "Adding binary columns: both bits are 1 and the carry in is 0. What are the sum bit and carry out?",
      options: ["sum 1, carry 0", "sum 0, carry 1", "sum 1, carry 1", "sum 2, carry 0"],
      answer: 1,
      why: "1 + 1 = 2, which is binary 10: write 0, carry 1. In code: `mod 2 2` is 0 and `div 2 2` is 1.",
    },
    {
      k: "predict",
      expr: "let s = 1 + 0 + 1 in (s `mod` 2, s `div` 2)",
      answer: "(0,1)",
      why: "s = 2: sum bit 0, carry 1.",
    },
    {
      k: "quiz",
      q: "What's the right starting value for `prodP = foldr mulP start`?",
      options: ["`[(0,0)]`", "`[]`", "`[(1,0)]`", "`[(1,1)]`"],
      answer: 2,
      why: "Multiplying by 1 changes nothing, and the polynomial 1 is `[(1,0)]` (1 × x⁰). Starting from `[(0,0)]` would make every product zero.",
    },
    {
      k: "predict",
      expr: "sortBy (comparing (negate . snd)) [(1,0),(3,2),(5,1)]",
      answer: "[(3,2),(5,1),(1,0)]",
      why: "Sorting by the negated exponent puts the biggest exponent first: 2, then 1, then 0. Handy if you ever need to put terms back into standard form.",
    },
    {
      k: "quiz",
      q: "In `mergeHeaps`, two head trees have equal rank. What does the 2013 spec say to do?",
      options: [
        "Keep the one with the smaller root and throw the other away",
        "Combine them, then merge that one-tree heap with the result of merging the two tails",
        "Put both in the result, smaller root first",
        "Combine them and put the result at the end",
      ],
      answer: 1,
      why: "The combined tree has rank r + 1 and may clash with a rank r + 1 tree further on, so it goes back through the merge: a carry.",
    },
    {
      k: "predict",
      expr: "let go [] = []; go ((k, v) : rest) = (k, v + sum [w | (k', w) <- rest, k' == k]) : go [(k', w) | (k', w) <- rest, k' /= k] in go [(2,1),(1,5),(2,3)]",
      answer: "[(2,4),(1,5)]",
      why: "This combines equal keys without needing sorted input: the first `(2,1)` collects the other key-2 value 3, giving `(2,4)`, and the rest is processed with key 2 removed. It works, but it compares everything with everything; when the input is sorted, merging is simpler.",
    },
    {
      k: "write",
      body: md(
        "Exam-style (2024, `addP`, part of 8 marks). Types and `p1`..`p5` are given.",
        "",
        "Add two polynomials in standard form: terms in decreasing exponent order, no zero coefficients, and zero is `[(0,0)]`.",
      ),
      setup: polySetup,
      starter: hs`addP :: Polynomial -> Polynomial -> Polynomial
addP p q = undefined
`,
      tests: [
        { expr: "addP p3 p4", expected: "[(2,2),(1,1),(-2,0)]" },
        { expr: "addP p5 [(0,0)]", expected: "p5" },
        { expr: "addP [(0,0)] [(0,0)]", expected: "[(0,0)]" },
        { expr: "addP p5 [(-2,3),(2,1),(-2,0)]", expected: "[(0,0)]" },
        { expr: "addP [(1 % 3, 2)] [(1 % 6, 2), (1, 1)]", expected: "[(1 % 2, 2), (1, 1)]" },
        { expr: "addP p1 p2", expected: "[(1,1),(5,0)]" },
      ],
      hint: "Merge by exponent (bigger first, equal ones add), filter out zero coefficients, and replace an empty answer with `[(0,0)]`.",
      solution: addPSolution,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2024, `mulP`, part of 8 marks). `addP` and the test polynomials are given.",
        "",
        "Multiply every term by every term (multiply coefficients, add exponents) and combine everything into standard form.",
      ),
      setup: polySetup + "\n" + addPSolution,
      starter: hs`mulP :: Polynomial -> Polynomial -> Polynomial
mulP p q = undefined
`,
      tests: [
        { expr: "mulP p3 p4", expected: "[(8,3),(-18,2),(13,1),(-3,0)]" },
        { expr: "mulP [(1,1),(2,0)] [(1,1),(-2,0)]", expected: "[(1,2),(-4,0)]" },
        { expr: "mulP [(0,0)] p3", expected: "[(0,0)]" },
        { expr: "mulP p3 p5", expected: "[(4,5),(-6,4),(-2,3),(10,2),(-8,1),(2,0)]" },
        { expr: "mulP [(1 % 2, 1)] [(4, 2)]", expected: "[(2,3)]" },
      ],
      hint: "`foldr addP [(0, 0)] [[(c1 * c2, e1 + e2)] | (c1, e1) <- p, (c2, e2) <- q]`",
      solution: mulPSolution,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2024, `sumP` and `prodP`, 1 mark). `addP` and `mulP` are given. Add up, and multiply together, a list of polynomials.",
      ),
      setup: polySetup + "\n" + addPSolution + "\n" + mulPSolution,
      starter: hs`sumP :: [Polynomial] -> Polynomial
sumP ps = undefined

prodP :: [Polynomial] -> Polynomial
prodP ps = undefined
`,
      tests: [
        { expr: "sumP [p1,p2,p3,p4,p5]", expected: "[(2,3),(2,2),(5,0)]" },
        { expr: "sumP []", expected: "[(0,0)]" },
        { expr: "prodP [p3,p5]", expected: "[(4,5),(-6,4),(-2,3),(10,2),(-8,1),(2,0)]" },
        { expr: "prodP [p2,p2,p2]", expected: "[(1,3)]" },
        { expr: "prodP []", expected: "[(1,0)]" },
      ],
      hint: "Two folds. Think about what the answer for an empty list should be.",
      solution: hs`sumP :: [Polynomial] -> Polynomial
sumP ps = foldr addP [(0, 0)] ps

prodP :: [Polynomial] -> Polynomial
prodP ps = foldr mulP [(1, 0)] ps
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2013, `mergeHeaps`, 6 marks). `BinTree`, `rank` and `combineTrees` are given. Heaps are lists of trees in increasing rank order.",
        "",
        "If either heap is empty, return the other. Smaller head rank goes first. Equal ranks: combine the two trees and merge that one-tree heap with the merge of the tails.",
      ),
      setup: heapSetup,
      starter: hs`mergeHeaps :: Ord a => BinHeap a -> BinHeap a -> BinHeap a
mergeHeaps h1 h2 = undefined
`,
      tests: heapTests,
      hint: "Use as-patterns `h1@(t : ts)` and `h2@(t' : ts')` so you can pass a whole heap on unchanged.",
      solution: mergeHeapsSolution,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2013, `binarySum`). Add two non-negative binary numbers given as bit lists, most significant bit first, using ripple-carry addition (a full adder at each position, right to left).",
        "",
        "```",
        "binarySum [1,1] [1,1,0] == [1,0,0,1]       -- 3 + 6 = 9",
        "```",
        "",
        "Write any helper you need.",
      ),
      starter: hs`binarySum :: [Int] -> [Int] -> [Int]
binarySum xs ys = undefined
`,
      tests: [
        { expr: "binarySum [1,1] [1,1,0]", expected: "[1,0,0,1]" },
        { expr: "binarySum [1] [1]", expected: "[1,0]" },
        { expr: "binarySum [1,1,1,1] [1]", expected: "[1,0,0,0,0]" },
        { expr: "binarySum [1,0,1,0] [1,0,1]", expected: "[1,1,1,1]" },
        { expr: "binarySum [0] [0]", expected: "[0]" },
      ],
      hint: "Reverse both, add least-significant-first with a carry (missing bits count as 0; a final carry of 1 adds one more bit), reverse back.",
      solution: hs`binarySum :: [Int] -> [Int] -> [Int]
binarySum xs ys = reverse (go (reverse xs) (reverse ys) 0)
  where
    go [] [] 0 = []
    go [] [] c = [c]
    go as bs c = mod s 2 : go (drop 1 as) (drop 1 bs) (div s 2)
      where
        s = sum (take 1 as) + sum (take 1 bs) + c
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// 15. Working with Maybe
// ---------------------------------------------------------------------------

const calcSetup = hs`data Expr = Num Int | Var String | Add Expr Expr | Div Expr Expr
  deriving (Eq, Show)

type Env = [(String, Int)]
`;

const toySetup = hs`data Expr = Const Rational | X | Add Expr Expr | Mul Expr Expr | Log Expr
  deriving (Eq, Show)
`;

const intSetup = hs`import Data.Ratio ((%))

type Polynomial = [(Rational, Integer)]

data Expr = P Polynomial
          | Add Expr Expr
          | Mul Expr Expr
          | Pow Expr Rational
          | Log Expr
  deriving (Eq, Ord, Show)

intP :: Polynomial -> Polynomial
intP p = [(c / fromIntegral (e + 1), e + 1) | (c, e) <- p, c /= 0] ++ [(0, 0) | all (\(c, _) -> c == 0) p]

isConstant :: Expr -> Bool
isConstant (P [(_, 0)]) = True
isConstant _ = False

x :: Expr
x = P [(1, 1)]
`;

const intE3Solution = hs`intE :: Expr -> Maybe Expr
intE (P p) = Just (P (intP p))
intE (Add e1 e2) = Add <$> intE e1 <*> intE e2
intE (Mul c e)
  | isConstant c = Mul c <$> intE e
intE (Mul e c)
  | isConstant c = Mul c <$> intE e
intE _ = Nothing
`;

const typeSetup = hs`data Type = TInt | TBool | TFun Type Type | TVar String
  deriving (Eq, Show)

type Sub = [(String, Type)]

occurs :: String -> Type -> Bool
occurs v (TVar w) = v == w
occurs v (TFun a b) = occurs v a || occurs v b
occurs _ _ = False

substT :: String -> Type -> Type -> Type
substT v t (TVar w)
  | v == w = t
substT v t (TFun a b) = TFun (substT v t a) (substT v t b)
substT _ _ other = other

applySub :: Sub -> Type -> Type
applySub s t = foldr (\(v, t') acc -> substT v t' acc) t s

unifyPairs :: [(Type, Type)] -> Sub -> Maybe Sub
unifyPairs [] s = Just s
unifyPairs ((TInt, TInt) : ps) s = unifyPairs ps s
unifyPairs ((TBool, TBool) : ps) s = unifyPairs ps s
unifyPairs ((TVar v, TVar w) : ps) s
  | v == w = unifyPairs ps s
unifyPairs ((TVar v, t) : ps) s = bind v t ps s
unifyPairs ((t, TVar v) : ps) s = bind v t ps s
unifyPairs ((TFun a b, TFun a' b') : ps) s = unifyPairs ((a, a') : (b, b') : ps) s
unifyPairs _ _ = Nothing

bind :: String -> Type -> [(Type, Type)] -> Sub -> Maybe Sub
bind v t ps s
  | occurs v t = Nothing
  | otherwise = unifyPairs [(substT v t a, substT v t b) | (a, b) <- ps] ((v, t) : s)
`;

const maybeplumbing: Lesson = {
  id: "maybeplumbing",
  title: "Working with Maybe",
  blurb: "Unwrap, default, chain and combine results that might fail: the plumbing behind 2011's unify and 2024's intE.",
  steps: [
    {
      k: "read",
      body: md(
        "You met `Maybe` in Foundations: a `Maybe Int` is either `Just 5` or `Nothing`. Exams use it whenever a computation is allowed to fail:",
        "",
        "- `lookup` fails when the key is missing.",
        "- 2011's `unify :: Type -> Type -> Maybe Sub` fails when two types can't be matched (8 marks).",
        "- 2024's `intE :: Expr -> Maybe Expr` fails when no integration rule applies (10 marks).",
        "",
        "The hard part isn't one Maybe. It's plumbing several together: steps that each might fail, results that must all succeed, alternatives to try in order. This lesson gives you a tool for each situation.",
      ),
    },
    {
      k: "read",
      body: md(
        "Tool 1: `case`. Pattern match on both shapes, right where you need the value:",
        "",
        "```",
        "describe :: String -> [(String, Int)] -> String",
        "describe k table =",
        "  case lookup k table of",
        "    Nothing -> k ++ \" is missing\"",
        "    Just n  -> k ++ \" is \" ++ show n",
        "```",
        "",
        "This always works, and it's the right choice when the two cases do quite different things.",
      ),
    },
    {
      k: "predict",
      expr: 'case lookup 2 [(1, "a"), (2, "b")] of { Nothing -> "?"; Just s -> s ++ s }',
      answer: '"bb"',
      why: "`lookup 2` finds `Just \"b\"`, so the `Just s` branch runs with `s = \"b\"`.",
    },
    {
      k: "read",
      body: md(
        "Tool 2: when the `Nothing` case is just a default value, there are shortcuts.",
        "",
        "```",
        "fromMaybe :: a -> Maybe a -> a",
        "fromMaybe 0 (Just 7)    is  7",
        "fromMaybe 0 Nothing     is  0",
        "",
        "maybe :: b -> (a -> b) -> Maybe a -> b",
        "maybe \"none\" show (Just 7)   is  \"7\"     -- apply show to what's inside",
        "maybe \"none\" show Nothing    is  \"none\"",
        "```",
        "",
        "`fromMaybe` lives in `Data.Maybe`, so add `import Data.Maybe` at the top of your file. `maybe` is in the Prelude.",
      ),
    },
    {
      k: "predict",
      expr: "fromMaybe 0 (lookup 'z' [('a', 1)])",
      answer: "0",
      why: "`'z'` isn't in the table, so `lookup` gives `Nothing` and `fromMaybe` uses the default 0.",
    },
    {
      k: "predict",
      expr: "maybe 100 (* 2) (Just 21)",
      answer: "42",
      why: "There's a value inside, so `maybe` applies the function `(* 2)` to it. The 100 is only used for `Nothing`.",
    },
    {
      k: "write",
      body: md(
        "This is 2016's `getAttribute` (2 marks), simplified to work on an attribute list: look up an attribute's value, giving `\"\"` if there is no such attribute.",
      ),
      starter: hs`import Data.Maybe

getAttribute :: String -> [(String, String)] -> String
getAttribute name attrs = undefined
`,
      tests: [
        { expr: 'getAttribute "x" [("x","1"),("y","2")]', expected: '"1"' },
        { expr: 'getAttribute "y" [("x","1"),("y","2")]', expected: '"2"' },
        { expr: 'getAttribute "z" [("x","1")]', expected: '""' },
        { expr: 'getAttribute "x" []', expected: '""' },
      ],
      hint: "`fromMaybe \"\" (lookup name attrs)`",
      solution: hs`import Data.Maybe

getAttribute :: String -> [(String, String)] -> String
getAttribute name attrs = fromMaybe "" (lookup name attrs)
`,
    },
    {
      k: "quiz",
      q: "`fromJust :: Maybe a -> a` takes the value out of a `Just`. What does `fromJust Nothing` do?",
      options: ["Returns 0", "Returns `Nothing`", "Crashes the program with an exception", "Returns an empty list"],
      answer: 2,
      why: "There's no value to return, so it crashes. Only use `fromJust` when you are certain it's a `Just` (for example in GHCi while testing, as the 2024 spec suggests). In your answers, prefer `case`, `maybe` or `fromMaybe`.",
    },
    {
      k: "read",
      body: md(
        "Several exam templates give you a `lookUp` that crashes with a helpful message instead of returning a Maybe (2015, 2018):",
        "",
        "```",
        "lookUp :: (Eq a, Show a) => a -> [(a, b)] -> b",
        "lookUp x t = fromMaybe (error (\"lookup failed: \" ++ show x)) (lookup x t)",
        "```",
        "",
        "So which should you use: Maybe, error, or a default?",
        "",
        "- Maybe: when failure is a normal, expected outcome the caller must handle (the spec's type says `Maybe`).",
        "- A default: when the spec says what the answer is in the missing case (2016: \"if the element has no attribute with that name then the result should be the empty string\").",
        "- error: when the spec has a precondition (\"you may assume the key is present\"), so missing means a bug.",
        "",
        "The function's type in the spec usually decides it for you. Never change a given type signature.",
      ),
    },
    {
      k: "quiz",
      q: "The spec says: `lookUp :: Eq a => a -> [(a, b)] -> b` and \"you may assume the item is in the table\". What's the best definition?",
      options: [
        "`lookUp x t = lookup x t`",
        "`lookUp x t = fromMaybe (error \"lookUp: missing key\") (lookup x t)`",
        "`lookUp x t = fromMaybe 0 (lookup x t)`",
        "`lookUp x t = Just (lookup x t)`",
      ],
      answer: 1,
      why: "The result type is `b`, not `Maybe b`, so the first and last don't even type-check. A default of 0 only works if `b` is a number. With a precondition, `error` is the honest choice. A one-line list comprehension, `head [v | (k, v) <- t, k == x]`, also works.",
    },
    {
      k: "read",
      body: md(
        "Tool 3: chaining. Often you need step 2 to use the result of step 1, and each step can fail. With `case` this becomes a staircase:",
        "",
        "```",
        "case lookup a t of",
        "  Nothing -> Nothing",
        "  Just b  -> case lookup b t of",
        "               Nothing -> Nothing",
        "               Just c  -> Just c",
        "```",
        "",
        "The operator `>>=` (pronounced \"bind\") does exactly this pattern for you: `m >>= f` gives `Nothing` if `m` is `Nothing`, and `f v` if `m` is `Just v`.",
        "",
        "```",
        "lookup a t >>= \\b -> lookup b t",
        "```",
      ),
    },
    {
      k: "predict",
      expr: "(Nothing :: Maybe Int) >>= \\x -> Just (x + 1)",
      answer: "Nothing",
      why: "There's no value to pass on, so the function is never called and the whole thing is `Nothing`. Failure flows straight through.",
    },
    {
      k: "predict",
      expr: "lookup 1 [(1, 2), (2, 3)] >>= \\y -> lookup y [(2, 30), (3, 40)]",
      answer: "Just 30",
      why: "The first lookup gives `Just 2`. Then 2 is looked up in the second table: `Just 30`.",
    },
    {
      k: "read",
      body: md(
        "Tool 4: `do` notation is a tidier way to write a chain of `>>=`. For Maybe it reads like a recipe where any failing step makes the whole thing `Nothing`:",
        "",
        "```",
        "grandparent :: String -> [(String, String)] -> Maybe String",
        "grandparent child parents = do",
        "  p <- lookup child parents     -- if Nothing, stop here with Nothing",
        "  lookup p parents              -- the last line is the overall result",
        "```",
        "",
        "`p <- m` means \"run the step `m`; if it gives `Just v`, call the value `p` and continue\". The last line must itself be a Maybe. If you want to finish with a plain value, wrap it: `Just (a + b)` (or `return (a + b)`, which means the same here).",
      ),
    },
    {
      k: "write",
      body: md(
        "`parents` is a table from each person to their parent. Write `greatGrandparent` with a `do` block: three lookups in a row.",
      ),
      setup: hs`family :: [(String, String)]
family = [("ann", "bob"), ("bob", "cat"), ("cat", "dan"), ("dan", "eve")]
`,
      starter: hs`greatGrandparent :: String -> [(String, String)] -> Maybe String
greatGrandparent child parents = undefined
`,
      tests: [
        { expr: 'greatGrandparent "ann" family', expected: 'Just "dan"' },
        { expr: 'greatGrandparent "bob" family', expected: 'Just "eve"' },
        { expr: 'greatGrandparent "cat" family', expected: "Nothing" },
        { expr: 'greatGrandparent "zed" family', expected: "Nothing" },
      ],
      hint: "`do`, then `p <- lookup child parents`, `g <- lookup p parents`, and finally `lookup g parents`.",
      solution: hs`greatGrandparent :: String -> [(String, String)] -> Maybe String
greatGrandparent child parents = do
  p <- lookup child parents
  g <- lookup p parents
  lookup g parents
`,
    },
    {
      k: "quiz",
      q: "In a Maybe `do` block with three `<-` steps, the second step gives `Nothing`. What happens?",
      options: [
        "The third step runs with a default value",
        "The whole block is `Nothing`, and the third step never runs",
        "The block returns the result of the first step",
        "It crashes",
      ],
      answer: 1,
      why: "That's the whole point: one failure short-circuits everything after it. You never write the `Nothing -> Nothing` cases yourself.",
    },
    {
      k: "write",
      body: md(
        "An evaluator that can fail, in the style of the interpreter questions. `eval env e` returns `Nothing` if a variable is not in `env` or if there is a division by zero. Use `do` for `Add` and `Div`.",
        "",
        "```",
        "data Expr = Num Int | Var String | Add Expr Expr | Div Expr Expr",
        "```",
      ),
      setup: calcSetup,
      starter: hs`eval :: Env -> Expr -> Maybe Int
eval env (Num n) = Just n
eval env (Var v) = undefined
eval env (Add a b) = undefined
eval env (Div a b) = undefined
`,
      tests: [
        { expr: 'eval [("x", 4)] (Add (Var "x") (Num 1))', expected: "Just 5" },
        { expr: 'eval [] (Var "x")', expected: "Nothing" },
        { expr: "eval [] (Div (Num 7) (Num 2))", expected: "Just 3" },
        { expr: "eval [] (Div (Num 7) (Add (Num 1) (Num (-1))))", expected: "Nothing" },
        { expr: 'eval [("y", 0)] (Add (Num 1) (Div (Num 5) (Var "y")))', expected: "Nothing" },
      ],
      hint: "`Var v` is just `lookup v env`. For `Div`: `do { x <- eval env a; y <- eval env b; if y == 0 then Nothing else Just (div x y) }` (written over several lines).",
      solution: hs`eval :: Env -> Expr -> Maybe Int
eval env (Num n) = Just n
eval env (Var v) = lookup v env
eval env (Add a b) = do
  x <- eval env a
  y <- eval env b
  Just (x + y)
eval env (Div a b) = do
  x <- eval env a
  y <- eval env b
  if y == 0 then Nothing else Just (div x y)
`,
    },
    {
      k: "read",
      body: md(
        "Tool 5: when two independent results must both succeed and you just want to combine them, there's an even shorter form:",
        "",
        "```",
        "(+) <$> m1 <*> m2         -- Just (a + b) if both are Just, else Nothing",
        "liftA2 (+) m1 m2          -- the same thing",
        "Add <$> intE e1 <*> intE e2",
        "```",
        "",
        "Read `f <$> m1 <*> m2` as \"apply `f` to the values inside `m1` and `m2`, if both are there\". The last line is 2024's rule for integrating a sum: integrate both halves, and fail if either half fails.",
        "",
        "With one Maybe, `f <$> m` (also written `fmap f m`) applies `f` inside: `(+1) <$> Just 4` is `Just 5`.",
      ),
    },
    {
      k: "predict",
      expr: "(+) <$> Just 3 <*> Just 4",
      answer: "Just 7",
      why: "Both have values, so `+` is applied to 3 and 4 and the result is wrapped back up.",
    },
    {
      k: "predict",
      expr: "(,) <$> Just 'a' <*> (Nothing :: Maybe Int)",
      answer: "Nothing",
      why: "The second one failed, so the combination fails. Both must succeed.",
    },
    {
      k: "read",
      body: md(
        "Tool 6: lists of Maybes. Two different questions, two different tools.",
        "",
        "- \"Keep the ones that worked\": `catMaybes :: [Maybe a] -> [a]`, or `mapMaybe f xs`, which maps and keeps the `Just` results in one go.",
        "- \"All of them must work\": `mapM f xs :: Maybe [b]`. It's `Just` the list of results if every `f x` succeeded, and `Nothing` if any failed.",
        "",
        "`catMaybes` and `mapMaybe` are in `Data.Maybe`; `mapM` is in the Prelude.",
      ),
    },
    {
      k: "predict",
      expr: "catMaybes [Just 1, Nothing, Just 3]",
      answer: "[1,3]",
      why: "The `Nothing` is dropped and the values are taken out of the `Just`s.",
    },
    {
      k: "predict",
      expr: "mapMaybe (\\x -> if x > 2 then Just (x * 10) else Nothing) [1, 2, 3, 4]",
      answer: "[30,40]",
      why: "1 and 2 give `Nothing` and are dropped; 3 and 4 become 30 and 40.",
    },
    {
      k: "predict",
      expr: "mapM (\\x -> if x > 0 then Just x else Nothing) [3, 0, 5]",
      answer: "Nothing",
      why: "`mapM` is all-or-nothing, and 0 fails the test.",
    },
    {
      k: "write",
      body: md(
        "`readMaybe` from `Text.Read` turns a String into a value, or `Nothing` if it isn't valid: `readMaybe \"42\" :: Maybe Int` is `Just 42`, `readMaybe \"4x\"` is `Nothing`.",
        "",
        "Write `readAll`, which reads every string as an Int and fails if any one is bad, and `readGood`, which keeps just the ones that read correctly.",
      ),
      starter: hs`import Text.Read (readMaybe)
import Data.Maybe

readAll :: [String] -> Maybe [Int]
readAll ss = undefined

readGood :: [String] -> [Int]
readGood ss = undefined
`,
      tests: [
        { expr: 'readAll ["1", "22", "-3"]', expected: "Just [1,22,-3]" },
        { expr: 'readAll ["1", "x", "3"]', expected: "Nothing" },
        { expr: "readAll []", expected: "Just []" },
        { expr: 'readGood ["1", "x", "3"]', expected: "[1,3]" },
        { expr: 'readGood ["a", "b"]', expected: "[]" },
      ],
      hint: "`readAll ss = mapM readMaybe ss` and `readGood ss = mapMaybe readMaybe ss`. The type signatures tell `readMaybe` to read Ints.",
      solution: hs`import Text.Read (readMaybe)
import Data.Maybe

readAll :: [String] -> Maybe [Int]
readAll ss = mapM readMaybe ss

readGood :: [String] -> [Int]
readGood ss = mapMaybe readMaybe ss
`,
    },
    {
      k: "read",
      body: md(
        "Tool 7: trying alternatives in order, where the first success wins. This is how a rule-based function like 2024's `intE` is built: try rule 1; if it fails, try rule 2; and so on.",
        "",
        "`<|>` from `Control.Applicative` does it: `m1 <|> m2` is `m1` if that's a `Just`, otherwise `m2`.",
        "",
        "```",
        "import Control.Applicative ((<|>))",
        "",
        "Nothing <|> Just 2 <|> Just 3     is  Just 2",
        "```",
        "",
        "Thanks to laziness, later alternatives aren't even worked out once one succeeds. Without the import you can write it yourself with `case`, or with `catMaybes` and take the first element.",
      ),
    },
    {
      k: "predict",
      expr: "let firstJust ms = case catMaybes ms of { [] -> Nothing; (v:_) -> Just v } in firstJust [Nothing, Just 2, Just 3]",
      answer: "Just 2",
      why: "`catMaybes` keeps `[2,3]`, and the first is 2. If every alternative failed, the result would be `Nothing`.",
    },
    {
      k: "write",
      body: md(
        "Write `firstSuccess rules x`: try each rule on `x` in order and return the first `Just` result, or `Nothing` if every rule fails.",
      ),
      starter: hs`firstSuccess :: [a -> Maybe b] -> a -> Maybe b
firstSuccess rules x = undefined
`,
      tests: [
        { expr: "firstSuccess [\\n -> if n > 10 then Just \"big\" else Nothing, \\n -> if even n then Just \"even\" else Nothing] 4", expected: 'Just "even"' },
        { expr: "firstSuccess [\\n -> if n > 10 then Just \"big\" else Nothing, \\n -> if even n then Just \"even\" else Nothing] 12", expected: 'Just "big"' },
        { expr: "firstSuccess [\\n -> if n > 10 then Just \"big\" else Nothing, \\n -> if even n then Just \"even\" else Nothing] 3", expected: "Nothing" },
        { expr: "firstSuccess [] 'x' :: Maybe Int", expected: "Nothing" },
      ],
      hint: "Recursion on the list of rules: `firstSuccess [] _ = Nothing`; for `(r:rs)`, `case r x of` either `Just y -> Just y` or `Nothing -> firstSuccess rs x`.",
      solution: hs`firstSuccess :: [a -> Maybe b] -> a -> Maybe b
firstSuccess [] _ = Nothing
firstSuccess (r:rs) x =
  case r x of
    Just y -> Just y
    Nothing -> firstSuccess rs x
`,
    },
    {
      k: "write",
      body: md(
        "Now a mini version of 2024's `intE`. Expressions are:",
        "",
        "```",
        "data Expr = Const Rational | X | Add Expr Expr | Mul Expr Expr | Log Expr",
        "```",
        "",
        "Integrate with these rules (ignore the constant of integration):",
        "",
        "1. `Const c` integrates to `Mul (Const c) X` (c·x).",
        "2. `X` integrates to `Mul (Const (1/2)) (Mul X X)` (x²/2).",
        "3. `Add a b`: integrate both; fail if either fails.",
        "4. `Mul (Const c) e` or `Mul e (Const c)`: integrate `e` to `i`, giving `Mul (Const c) i`.",
        "5. Anything else: `Nothing`.",
      ),
      setup: toySetup,
      starter: hs`intE :: Expr -> Maybe Expr
intE e = undefined
`,
      tests: [
        { expr: "intE (Const 3)", expected: "Just (Mul (Const 3) X)" },
        { expr: "intE (Add X (Const 1))", expected: "Just (Add (Mul (Const (1/2)) (Mul X X)) (Mul (Const 1) X))" },
        { expr: "intE (Mul X (Const 4))", expected: "Just (Mul (Const 4) (Mul (Const (1/2)) (Mul X X)))" },
        { expr: "intE (Log X)", expected: "Nothing" },
        { expr: "intE (Add X (Log X))", expected: "Nothing" },
        { expr: "intE (Mul X X)", expected: "Nothing" },
      ],
      hint: "One equation per rule. Rule 3 is `Add <$> intE a <*> intE b`. Rule 4 is `Mul (Const c) <$> intE e`. Put the catch-all `intE _ = Nothing` last.",
      solution: hs`intE :: Expr -> Maybe Expr
intE (Const c) = Just (Mul (Const c) X)
intE X = Just (Mul (Const (1 / 2)) (Mul X X))
intE (Add a b) = Add <$> intE a <*> intE b
intE (Mul (Const c) e) = Mul (Const c) <$> intE e
intE (Mul e (Const c)) = Mul (Const c) <$> intE e
intE _ = Nothing
`,
    },
    {
      k: "quiz",
      q: "In that `intE`, why is `intE (Add X (Log X))` `Nothing` even though `X` can be integrated?",
      options: [
        "Because `Add` is never allowed",
        "Because `<$>`/`<*>` need both halves to succeed, and `Log X` has no rule",
        "Because the catch-all case matched first",
        "Because `X` must come second",
      ],
      answer: 1,
      why: "Integrating a sum only works if you can integrate both parts. Returning half an answer would be wrong, so failure spreads upwards automatically.",
    },
  ],
};

const drillMaybe: DrillSet = {
  id: "drill-maybeplumbing",
  lesson: "maybeplumbing",
  title: "Working with Maybe: drills",
  drills: [
    {
      k: "predict",
      expr: "fromMaybe 'x' (Just 'q')",
      answer: "'q'",
      why: "There is a value, so the default `'x'` is ignored.",
    },
    {
      k: "predict",
      expr: "maybe 0 length (Just \"hello\")",
      answer: "5",
      why: "`maybe` applies `length` to the value inside: 5.",
    },
    {
      k: "quiz",
      q: "What is the type of `maybe`?",
      options: ["`a -> Maybe a -> a`", "`b -> (a -> b) -> Maybe a -> b`", "`Maybe a -> a`", "`(a -> b) -> Maybe a -> Maybe b`"],
      answer: 1,
      why: "A default `b`, a function for the `Just` case, then the Maybe. The first option is `fromMaybe`; the last is `fmap` (or `<$>`).",
    },
    {
      k: "predict",
      expr: "maybe \"none\" show (Nothing :: Maybe Int)",
      answer: "\"none\"",
      why: "`Nothing` means the default is used.",
    },
    {
      k: "write",
      body: "Write `orDefault d m` without using `fromMaybe` or `maybe`: the value inside `m`, or `d` if it's `Nothing`.",
      starter: hs`orDefault :: a -> Maybe a -> a
orDefault d m = undefined
`,
      banned: ["fromMaybe", "maybe"],
      tests: [
        { expr: "orDefault 0 (Just 5)", expected: "5" },
        { expr: "orDefault 0 Nothing", expected: "0" },
        { expr: 'orDefault "" (Just "hi")', expected: '"hi"' },
        { expr: "orDefault 'z' Nothing", expected: "'z'" },
      ],
      hint: "Two equations, one for `Nothing` and one for `(Just v)`.",
      solution: hs`orDefault :: a -> Maybe a -> a
orDefault d Nothing = d
orDefault _ (Just v) = v
`,
    },
    {
      k: "quiz",
      q: "Which is the safest way to get an Int out of `lookup k table` when the spec says missing keys count as 0?",
      options: ["`fromJust (lookup k table)`", "`head (lookup k table)`", "`fromMaybe 0 (lookup k table)`", "`lookup k table + 0`"],
      answer: 2,
      why: "`fromJust` crashes on `Nothing`; `head` doesn't work on a Maybe; adding 0 to a Maybe is a type error.",
    },
    {
      k: "predict",
      expr: "Just 3 >>= \\x -> if even x then Just x else Nothing",
      answer: "Nothing",
      why: "3 is passed to the function, which rejects odd numbers.",
    },
    {
      k: "predict",
      expr: "(+1) <$> Just 4",
      answer: "Just 5",
      why: "`<$>` applies the function inside the `Just`.",
    },
    {
      k: "predict",
      expr: "liftA2 max (Just 3) (Just 8)",
      answer: "Just 8",
      why: "Both succeed, so `max 3 8` is wrapped up as `Just 8`.",
    },
    {
      k: "quiz",
      q: "What does this `do` block give?\n\n```\ndo\n  a <- Just 2\n  b <- Nothing\n  Just (a + b)\n```",
      options: ["`Just 2`", "`Nothing`", "`Just 0`", "A type error"],
      answer: 1,
      why: "The second step fails, so the whole block is `Nothing`.",
    },
    {
      k: "write",
      body: "Write `addLookups a b table`: look up both keys and add their values. If either is missing, the answer is `Nothing`.",
      starter: hs`addLookups :: String -> String -> [(String, Int)] -> Maybe Int
addLookups a b table = undefined
`,
      tests: [
        { expr: 'addLookups "x" "y" [("x",1),("y",2)]', expected: "Just 3" },
        { expr: 'addLookups "x" "x" [("x",5)]', expected: "Just 10" },
        { expr: 'addLookups "x" "z" [("x",1)]', expected: "Nothing" },
        { expr: 'addLookups "q" "x" [("x",1)]', expected: "Nothing" },
      ],
      hint: "`(+) <$> lookup a table <*> lookup b table`, or a `do` block.",
      solution: hs`addLookups :: String -> String -> [(String, Int)] -> Maybe Int
addLookups a b table = (+) <$> lookup a table <*> lookup b table
`,
    },
    {
      k: "predict",
      expr: "catMaybes [Nothing, Just 'h', Nothing, Just 'i']",
      answer: "\"hi\"",
      why: "The Chars inside the `Just`s, in order, make the String `\"hi\"`.",
    },
    {
      k: "quiz",
      q: "You have `[Maybe Int]` and want `Nothing` if any element is `Nothing`, else `Just` all the values. Which?",
      options: ["`catMaybes`", "`mapM id` (also called `sequence`)", "`mapMaybe id`", "`fromMaybe []`"],
      answer: 1,
      why: "`mapM` is all-or-nothing. `catMaybes` and `mapMaybe id` quietly drop the failures instead.",
    },
    {
      k: "predict",
      expr: "sequence [Just 1, Just 2, Nothing]",
      answer: "Nothing",
      why: "`sequence` (the same as `mapM id`) needs every element to be a `Just`.",
    },
    {
      k: "write",
      body: md(
        "Write `safeIndex xs i`: `Just` the element at position `i` (counting from 0), or `Nothing` if `i` is out of range (negative or too big). Don't use `!!`.",
      ),
      starter: hs`safeIndex :: [a] -> Int -> Maybe a
safeIndex xs i = undefined
`,
      banned: ["!!"],
      tests: [
        { expr: 'safeIndex "abc" 0', expected: "Just 'a'" },
        { expr: 'safeIndex "abc" 2', expected: "Just 'c'" },
        { expr: 'safeIndex "abc" 3', expected: "Nothing" },
        { expr: 'safeIndex "abc" (-1)', expected: "Nothing" },
        { expr: "safeIndex ([] :: [Int]) 0", expected: "Nothing" },
      ],
      hint: "`safeIndex [] _ = Nothing`. For `(x:xs)`: index 0 gives `Just x`, a negative index gives `Nothing`, otherwise recurse with `i - 1`.",
      solution: hs`safeIndex :: [a] -> Int -> Maybe a
safeIndex [] _ = Nothing
safeIndex (x:xs) i
  | i < 0 = Nothing
  | i == 0 = Just x
  | otherwise = safeIndex xs (i - 1)
`,
    },
    {
      k: "quiz",
      q: "`m1 <|> m2` (from `Control.Applicative`) for Maybe means:",
      options: ["Both must succeed", "`m1` if it is a `Just`, otherwise `m2`", "`m2` if it is a `Just`, otherwise `m1`", "Combine the two values with `++`"],
      answer: 1,
      why: "Left-biased choice: the first success wins. It's how you try rule after rule.",
    },
    {
      k: "predict",
      expr: "mapM (\\s -> readMaybe s :: Maybe Int) [\"7\", \"08\", \"-2\"]",
      answer: "Just [7,8,-2]",
      why: "All three read as Ints (a leading zero is fine), so the whole thing succeeds.",
    },
    {
      k: "quiz",
      q: "A spec says: \"`price :: String -> Menu -> Int` returns the price of an item; if the item is not on the menu the result should be 0\". How should you handle a missing item?",
      options: [
        "Return `Nothing`",
        "Call `error`",
        "Use a default: `fromMaybe 0 (lookup item menu)`",
        "Change the type to `Maybe Int`",
      ],
      answer: 2,
      why: "The type says `Int`, and the spec tells you the missing-case answer. Never change a given signature: the autotester calls your function with exactly that type.",
    },
    {
      k: "write",
      body: md(
        "Write `chain start table steps`: starting from `start`, follow `table` (a list of `(from, to)` pairs) exactly `steps` times. If any link is missing, the answer is `Nothing`.",
        "",
        "```",
        "chain 1 [(1,2),(2,5),(5,9)] 2 == Just 5",
        "```",
      ),
      starter: hs`chain :: Int -> [(Int, Int)] -> Int -> Maybe Int
chain start table steps = undefined
`,
      tests: [
        { expr: "chain 1 [(1,2),(2,5),(5,9)] 2", expected: "Just 5" },
        { expr: "chain 1 [(1,2),(2,5),(5,9)] 0", expected: "Just 1" },
        { expr: "chain 1 [(1,2),(2,5),(5,9)] 3", expected: "Just 9" },
        { expr: "chain 1 [(1,2),(2,5),(5,9)] 4", expected: "Nothing" },
        { expr: "chain 7 [] 1", expected: "Nothing" },
      ],
      hint: "Recursion on `steps`: 0 steps gives `Just start`; otherwise `lookup start table >>= \\next -> chain next table (steps - 1)`.",
      solution: hs`chain :: Int -> [(Int, Int)] -> Int -> Maybe Int
chain start _ 0 = Just start
chain start table steps = lookup start table >>= \next -> chain next table (steps - 1)
`,
    },
    {
      k: "quiz",
      q: "The spec gives `f :: Expr -> Maybe Expr`. Inside it you call `f` on two sub-expressions and want to build `Add r1 r2` from the results. What's wrong with `Add (f e1) (f e2)`?",
      options: [
        "Nothing; it's fine",
        "It's a type error: `Add` wants two `Expr`s but `f e1` is a `Maybe Expr`",
        "It's too slow",
        "It forgets to check for `Nothing` but still compiles",
      ],
      answer: 1,
      why: "The values are still wrapped in Maybe. Use `Add <$> f e1 <*> f e2`, or a `do` block that unwraps both with `<-`.",
    },
    {
      k: "write",
      body: md(
        "Exam-style (2019 and others, `lookUp`). The spec says: `lookUp :: Eq a => a -> [(a, b)] -> b` looks up an item in a table, and you may assume the item is present. For example `lookUp 3 [(2,1),(3,8)]` is 8.",
        "",
        "Write it using `lookup`, with an `error` for the impossible missing case.",
      ),
      starter: hs`lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x t = undefined
`,
      tests: [
        { expr: "lookUp 3 [(2,1),(3,8)]", expected: "8" },
        { expr: "lookUp 'b' [('a', True), ('b', False)]", expected: "False" },
        { expr: "lookUp (2,1) [((1,2),True),((2,1),False)]", expected: "False" },
        { expr: 'lookUp "k" [("k", 1), ("k", 2)]', expected: "1" },
      ],
      hint: "`case lookup x t of Just v -> v; Nothing -> error \"lookUp: item not found\"`, or `fromMaybe (error ...) (lookup x t)` with `import Data.Maybe`.",
      solution: hs`lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x t =
  case lookup x t of
    Just v -> v
    Nothing -> error "lookUp: item not found"
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2016, `getAttribute`, 2 marks). XML is given as",
        "",
        "```",
        "data XML = Text String | Element String [(String, String)] [XML]",
        "```",
        "",
        "`getAttribute name xml` gives the value of the named attribute of an element, or `\"\"` if there's no such attribute or the XML is a `Text`.",
      ),
      setup: hs`data XML = Text String | Element String [(String, String)] [XML]
  deriving (Eq, Show)

x2 :: XML
x2 = Element "a" [("x", "1")] [Element "b" [] [Text "A"], Element "b" [] [Text "B"]]
`,
      starter: hs`getAttribute :: String -> XML -> String
getAttribute name xml = undefined
`,
      tests: [
        { expr: 'getAttribute "x" x2', expected: '"1"' },
        { expr: 'getAttribute "y" x2', expected: '""' },
        { expr: 'getAttribute "x" (Text "t")', expected: '""' },
        { expr: 'getAttribute "b" (Element "e" [("a","1"),("b","22")] [])', expected: '"22"' },
      ],
      hint: "Two equations. For `Element _ attrs _`, use `fromMaybe \"\" (lookup name attrs)` (import `Data.Maybe`) or `maybe \"\" id`. For `Text _` the answer is `\"\"`.",
      solution: hs`getAttribute :: String -> XML -> String
getAttribute name (Element _ attrs _) = maybe "" id (lookup name attrs)
getAttribute _ (Text _) = ""
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2011, using `unify :: Type -> Type -> Maybe Sub`). `unifyPairs` and `applySub` are given.",
        "",
        "1. Define `unify t t'` as `unifyPairs` started with the single pair `(t, t')` and the empty substitution (this is the 2011 template's definition).",
        "2. Define `instantiate t t' target`: unify `t` with `t'`; if that succeeds with substitution `s`, apply `s` to `target`. If unification fails, so does `instantiate`.",
        "",
        "```",
        "instantiate (TVar \"a\") TInt (TFun (TVar \"a\") (TVar \"a\"))  ==  Just (TFun TInt TInt)",
        "```",
      ),
      setup: typeSetup,
      starter: hs`unify :: Type -> Type -> Maybe Sub
unify t t' = undefined

instantiate :: Type -> Type -> Type -> Maybe Type
instantiate t t' target = undefined
`,
      tests: [
        { expr: "unify TInt TInt", expected: "Just []" },
        { expr: "unify TInt TBool", expected: "Nothing" },
        { expr: 'instantiate (TVar "a") TInt (TFun (TVar "a") (TVar "a"))', expected: "Just (TFun TInt TInt)" },
        { expr: 'instantiate (TFun (TVar "a") (TVar "b")) (TFun TBool TInt) (TFun (TVar "b") (TVar "a"))', expected: "Just (TFun TInt TBool)" },
        { expr: 'instantiate (TVar "a") (TFun (TVar "a") TInt) TInt', expected: "Nothing" },
      ],
      hint: "`unify t t' = unifyPairs [(t, t')] []`. Then `instantiate` is a `do` block: `s <- unify t t'` and finish with `Just (applySub s target)`. Or use `<$>`.",
      solution: hs`unify :: Type -> Type -> Maybe Sub
unify t t' = unifyPairs [(t, t')] []

instantiate :: Type -> Type -> Type -> Maybe Type
instantiate t t' target = do
  s <- unify t t'
  Just (applySub s target)
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2024, `intE`, the first three rules from the spec). The real `Expr` type, `intP` (integrates a polynomial) and `isConstant` are given.",
        "",
        "1. `P p`: use `intP`.",
        "2. `Add e1 e2`: integrate both (both must succeed).",
        "3. `Mul c e` or `Mul e c` where `isConstant c`: integrate `e` to `i`, giving `Mul c i`.",
        "4. Temporary catch-all: `Nothing`.",
      ),
      setup: intSetup,
      starter: hs`intE :: Expr -> Maybe Expr
intE e = undefined
`,
      tests: [
        { expr: "intE (P [(2,2),(-3,1),(1,0)])", expected: "Just (P [(2 % 3,3),((-3) % 2,2),(1,1)])" },
        { expr: "intE (Add x (P [(1,0)]))", expected: "Just (Add (P [(1 % 2,2)]) (P [(1,1)]))" },
        { expr: "intE (Mul (P [(3,0)]) x)", expected: "Just (Mul (P [(3,0)]) (P [(1 % 2,2)]))" },
        { expr: "intE (Mul x (P [(3,0)]))", expected: "Just (Mul (P [(3,0)]) (P [(1 % 2,2)]))" },
        { expr: "intE (Log x)", expected: "Nothing" },
        { expr: "intE (Add x (Log x))", expected: "Nothing" },
      ],
      hint: "Rule 3 needs guards: `intE (Mul c e) | isConstant c = Mul c <$> intE e`. Write the swapped version as a separate equation, and put `intE _ = Nothing` last so failed guards fall through to it.",
      solution: intE3Solution,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2024, `intE`, adding more rules in order). Extend the first three rules (from the previous drill) with two more, tried before the catch-all:",
        "",
        "- `Pow x n` (where `x` is exactly `P [(1,1)]`): if `n == -1` the integral is `Log x`; otherwise it is `Mul (P [(1 / (n + 1), 0)]) (Pow x (n + 1))`.",
        "- `Log x`: the integral is `Mul x (Add (Log x) (P [(-1, 0)]))`, which is x(log x − 1).",
        "",
        "Anything else is still `Nothing`. `intP`, `isConstant` and `x` are given.",
      ),
      setup: intSetup,
      starter: intE3Solution,
      tests: [
        { expr: "intE (Pow x (-1))", expected: "Just (Log x)" },
        { expr: "intE (Pow x (1 % 2))", expected: "Just (Mul (P [(2 % 3,0)]) (Pow x (3 % 2)))" },
        { expr: "intE (Log x)", expected: "Just (Mul x (Add (Log x) (P [(-1,0)])))" },
        { expr: "intE (Add (Log x) x)", expected: "Just (Add (Mul x (Add (Log x) (P [(-1,0)]))) (P [(1 % 2,2)]))" },
        { expr: "intE (Mul (P [(2,0)]) (Pow x (-1)))", expected: "Just (Mul (P [(2,0)]) (Log x))" },
        { expr: "intE (Log (P [(2,1)]))", expected: "Nothing" },
        { expr: "intE (P [(4,1)])", expected: "Just (P [(2,2)])" },
      ],
      hint: "Add equations above the catch-all: `intE (Pow e n) | e == x = if n == -1 then Just (Log x) else Just (...)` and `intE (Log e) | e == x = Just (...)`.",
      solution: hs`intE :: Expr -> Maybe Expr
intE (P p) = Just (P (intP p))
intE (Add e1 e2) = Add <$> intE e1 <*> intE e2
intE (Mul c e)
  | isConstant c = Mul c <$> intE e
intE (Mul e c)
  | isConstant c = Mul c <$> intE e
intE (Pow e n)
  | e == x && n == -1 = Just (Log x)
  | e == x = Just (Mul (P [(1 / (n + 1), 0)]) (Pow x (n + 1)))
intE (Log e)
  | e == x = Just (Mul x (Add (Log x) (P [(-1, 0)])))
intE _ = Nothing
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// 16. Numbers in exams
// ---------------------------------------------------------------------------

const close = (expr: string, value: string) => ({
  expr: `abs ((${expr}) - (${value})) < 1e-9`,
  label: `${expr} ≈ ${value}`,
});

const numbers: Lesson = {
  id: "numbers",
  title: "Numbers in exams",
  blurb: "Int, Integer, Double and Rational; converting between them; div and mod; rounding; formulas; binary and Data.Bits.",
  steps: [
    {
      k: "read",
      body: md(
        "Haskell has several number types, and exam specs choose them deliberately:",
        "",
        "```",
        "Int        whole numbers, 64 bits, fast; silently wraps round if too big",
        "Integer    whole numbers of any size, never overflows",
        "Double     decimals, approximate (about 15-16 significant digits)",
        "Rational   exact fractions like 2/3 (needs import Data.Ratio)",
        "```",
        "",
        "2024 used `Rational` coefficients and `Integer` exponents. 2017 computed entropy as a `Double`. 2020 treated an `Int` as 64 bits to twiddle. Using the type the spec says is not optional: the autotester's examples are typed.",
      ),
    },
    {
      k: "quiz",
      q: "You need to represent 1/3 exactly, so that adding three of them gives exactly 1. Which type?",
      options: ["`Int`", "`Double`", "`Rational`", "`Integer`"],
      answer: 2,
      why: "`Rational` stores a numerator and denominator exactly. A `Double` stores an approximation, and Int/Integer can't store fractions at all.",
    },
    {
      k: "predict",
      expr: "0.1 + 0.2 == (0.3 :: Double)",
      answer: "False",
      why: "Doubles are stored in binary, and 0.1 can't be stored exactly, so `0.1 + 0.2` is 0.30000000000000004. Never compare computed Doubles with `==`; this is also why exam tests on Doubles usually allow a tiny tolerance.",
    },
    {
      k: "read",
      body: md(
        "Haskell never converts between number types automatically. `length` gives an `Int`, and `/` only works on fractional types like `Double`, so this fails:",
        "",
        "```",
        "average xs = sum xs / length xs      -- type error",
        "```",
        "",
        "The fix is `fromIntegral`, which turns a whole number (Int or Integer) into whatever number type is needed:",
        "",
        "```",
        "average :: [Int] -> Double",
        "average xs = fromIntegral (sum xs) / fromIntegral (length xs)",
        "```",
        "",
        "Rule of thumb: whenever an Int meets a Double or a Rational, wrap the Int in `fromIntegral`.",
      ),
    },
    {
      k: "try",
      code: "let xs = [1, 2, 3 :: Int] in sum xs / length xs",
      expectError: true,
      after: "The key phrase is `No instance for (Fractional Int)`: you used `/`, which needs a fractional type, on Ints.",
    },
    {
      k: "try",
      code: "let xs = [1, 2, 3 :: Int] in fromIntegral (sum xs) / fromIntegral (length xs)",
      after: "Both sides converted, so `/` works and gives the Double 2.0.",
    },
    {
      k: "write",
      body: "Write `average`. The average of an empty list should be `0` (don't divide by zero!).",
      starter: hs`average :: [Int] -> Double
average xs = undefined
`,
      tests: [
        { expr: "average [1,2,3,4]", expected: "2.5" },
        { expr: "average [5]", expected: "5.0" },
        { expr: "average []", expected: "0.0" },
        { expr: "average [-1,1]", expected: "0.0" },
      ],
      hint: "A guard `null xs = 0`, otherwise `fromIntegral (sum xs) / fromIntegral (length xs)`.",
      solution: hs`average :: [Int] -> Double
average xs
  | null xs = 0
  | otherwise = fromIntegral (sum xs) / fromIntegral (length xs)
`,
    },
    {
      k: "read",
      body: md(
        "Whole-number division comes in two pairs. They agree on positive numbers and differ on negatives:",
        "",
        "```",
        "div  rounds down (towards minus infinity)     div (-7) 2  is  -4",
        "mod  remainder to match div                    mod (-7) 2  is   1",
        "quot rounds towards zero                       quot (-7) 2 is  -3",
        "rem  remainder to match quot                   rem (-7) 2  is  -1",
        "```",
        "",
        "They always satisfy `(div x y) * y + mod x y == x`. Use `div` and `mod` unless a spec says otherwise; `mod` with a positive divisor is never negative, which is what you want for things like \"is it even\" or wrapping round a list.",
        "",
        "Watch out: without brackets, a minus sign in front applies last. `-7` followed by an operator is read as `negate (7 ... )`, so you'd get `negate (div 7 2)`, which is -3. Put negative numbers in brackets: `(-7)`.",
      ),
    },
    {
      k: "predict",
      expr: "(-7) `div` 2",
      answer: "-4",
      why: "-3.5 rounded down (towards minus infinity) is -4.",
    },
    {
      k: "predict",
      expr: "(-7) `mod` 2",
      answer: "1",
      why: "It must match `div`: -4 × 2 = -8, and -7 − (-8) = 1.",
    },
    {
      k: "quiz",
      q: "What is `rem (-7) 2`?",
      options: ["`1`", "`-1`", "`-3`", "`-4`"],
      answer: 1,
      why: "`quot (-7) 2` rounds towards zero to -3, and -3 × 2 = -6, leaving -7 − (-6) = -1. `rem` takes the sign of the number being divided.",
    },
    {
      k: "read",
      body: md(
        "Turning a Double into a whole number needs you to say how:",
        "",
        "```",
        "floor 2.7     is  2      (down)",
        "ceiling 2.1   is  3      (up)",
        "truncate 2.7  is  2      (towards zero: just chop the decimals)",
        "round 2.7     is  3      (nearest)",
        "```",
        "",
        "One surprise: `round` sends exact halves to the nearest even number (\"banker's rounding\"). So `round 2.5` is 2 but `round 3.5` is 4. If a spec says \"round halves up\", write `floor (x + 0.5)`.",
      ),
    },
    {
      k: "predict",
      expr: "round 2.5",
      answer: "2",
      why: "Exact halves go to the even neighbour, and 2 is even.",
    },
    {
      k: "predict",
      expr: "(floor (-2.7), ceiling 2.1, truncate (-2.7))",
      answer: "(-3, 3, -2)",
      why: "`floor` goes down, and down from -2.7 is -3. `ceiling` goes up to 3. `truncate` chops the decimals, so -2.7 becomes -2.",
    },
    {
      k: "read",
      body: md(
        "Rationals (`import Data.Ratio`) are exact fractions. Build one with `%`:",
        "",
        "```",
        "3 % 4                  -- three quarters",
        "numerator (6 % 8)      is  3      -- always stored in lowest terms",
        "denominator (6 % 8)    is  4",
        "```",
        "",
        "GHCi prints them with `%`, and negative ones in brackets: `(-3) % 4`. Integer literals like `2` work as Rationals directly, and `/` divides them exactly.",
        "",
        "In 2024, an exponent is an `Integer` but a coefficient is a `Rational`, so mixing them needs `fromIntegral`. Integrating the term `(c, e)` (that is, c·xᵉ) gives c/(e+1)·xᵉ⁺¹:",
        "",
        "```",
        "intT (c, e) = (c / fromIntegral (e + 1), e + 1)",
        "```",
      ),
    },
    {
      k: "predict",
      expr: "1 % 2 + 1 % 3",
      answer: "5 % 6",
      why: "1/2 + 1/3 = 3/6 + 2/6 = 5/6. Exact, with no rounding.",
    },
    {
      k: "write",
      body: md(
        "Write 2024's `diffT` and `intT` (3 marks): the derivative and the integral of one term `(coefficient, exponent)`.",
        "",
        "- Derivative of c·xᵉ is (c·e)·xᵉ⁻¹. But the derivative of a constant (exponent 0) is `(0,0)`.",
        "- Integral of c·xᵉ is c/(e+1)·xᵉ⁺¹.",
        "",
        "```",
        "diffT (2,3)  ==  (6,2)          intT (2,3)  ==  (1 % 2, 4)",
        "diffT (1,0)  ==  (0,0)          intT (1,0)  ==  (1,1)",
        "```",
      ),
      setup: hs`import Data.Ratio ((%))

type Term = (Rational, Integer)
`,
      starter: hs`diffT :: Term -> Term
diffT (c, e) = undefined

intT :: Term -> Term
intT (c, e) = undefined
`,
      tests: [
        { expr: "diffT (2,3)", expected: "(6,2)" },
        { expr: "diffT (1,0)", expected: "(0,0)" },
        { expr: "diffT (1 % 2, 1)", expected: "(1 % 2, 0)" },
        { expr: "intT (2,3)", expected: "(1 % 2, 4)" },
        { expr: "intT (1,0)", expected: "(1,1)" },
        { expr: "intT (-3, 1)", expected: "((-3) % 2, 2)" },
      ],
      hint: "`diffT (_, 0) = (0, 0)` first, then `diffT (c, e) = (c * fromIntegral e, e - 1)`. For `intT`, divide by `fromIntegral (e + 1)`.",
      solution: hs`diffT :: Term -> Term
diffT (_, 0) = (0, 0)
diffT (c, e) = (c * fromIntegral e, e - 1)

intT :: Term -> Term
intT (c, e) = (c / fromIntegral (e + 1), e + 1)
`,
    },
    {
      k: "read",
      body: md(
        "Turning a maths formula into code is a skill of its own. 2017's entropy (worth marks in Part III) is:",
        "",
        "```",
        "H = − Σ  p · log₂ p        summed over each class, where p = count / total",
        "```",
        "",
        "Step by step:",
        "",
        "1. Count each class (say 9 \"yes\" and 5 \"no\", total 14).",
        "2. Convert to Double and divide: p = 9/14 and 5/14. Remember `fromIntegral`.",
        "3. `log₂` is `logBase 2`.",
        "4. Add up p · log₂ p for each class, then negate.",
        "",
        "Two traps: an empty data set (total 0) would divide by zero, and log₂ 0 is minus infinity. That's why the 2017 template gave you `xlogx`, which treats 0 · log 0 as 0, and the spec said the entropy of an empty data set is 0.0.",
      ),
    },
    {
      k: "quiz",
      q: "What does `0 * logBase 2 0` give in Haskell?",
      options: ["`0.0`", "`NaN` (not a number)", "An exception", "`-Infinity`"],
      answer: 1,
      why: "`logBase 2 0` is `-Infinity`, and 0 × −∞ is undefined, which Doubles represent as `NaN`. It doesn't crash; it silently poisons every sum it touches. Guard against zero before using `log`.",
    },
    {
      k: "write",
      body: md(
        "Write `xlogx` (x · log₂ x, but 0 when x is 0) and `entropy`, which takes the count of each class and returns the entropy. An empty list or all-zero counts give 0.",
        "",
        "```",
        "entropy [9,5]  ≈  0.9402859586706309       (2017's fishing data)",
        "```",
      ),
      starter: hs`xlogx :: Double -> Double
xlogx x = undefined

entropy :: [Int] -> Double
entropy counts = undefined
`,
      tests: [
        close("entropy [9,5]", "0.9402859586706309"),
        close("entropy [1,1]", "1.0"),
        close("entropy [4]", "0.0"),
        close("entropy []", "0.0"),
        close("entropy [2,3,0,5]", "1.4854752972273344"),
        close("xlogx 0", "0.0"),
      ],
      hint: "`xlogx x | x <= 0 = 0 | otherwise = x * logBase 2 x`. In `entropy`, compute `total = sum counts`; if it's 0 the answer is 0, else `negate (sum [xlogx (fromIntegral c / fromIntegral total) | c <- counts])`.",
      solution: hs`xlogx :: Double -> Double
xlogx x
  | x <= 0 = 0
  | otherwise = x * logBase 2 x

entropy :: [Int] -> Double
entropy counts
  | total == 0 = 0
  | otherwise = negate (sum [xlogx (fromIntegral c / fromIntegral total) | c <- counts])
  where
    total = sum counts
`,
    },
    {
      k: "read",
      body: md(
        "Binary digits come out of a number with `mod 2` (the last bit) and `div 2` (everything else), just like decimal digits come out with `mod 10` and `div 10`:",
        "",
        "```",
        "13:  mod 13 2 = 1,  div 13 2 = 6",
        " 6:  mod 6 2  = 0,  div 6 2  = 3",
        " 3:  mod 3 2  = 1,  div 3 2  = 1",
        " 1:  mod 1 2  = 1,  div 1 2  = 0     stop",
        "```",
        "",
        "The bits come out last-first (1, 0, 1, 1), so 13 is binary 1101. Going back, each bit doubles what you had and adds itself: `foldl (\\acc b -> 2 * acc + b) 0 [1,1,0,1]` is 13.",
      ),
    },
    {
      k: "write",
      body: "Write `toBits`, which gives the binary digits of a non-negative number, most significant first. `toBits 0` should be `[0]`.",
      starter: hs`toBits :: Int -> [Int]
toBits n = undefined
`,
      tests: [
        { expr: "toBits 13", expected: "[1,1,0,1]" },
        { expr: "toBits 0", expected: "[0]" },
        { expr: "toBits 1", expected: "[1]" },
        { expr: "toBits 8", expected: "[1,0,0,0]" },
        { expr: "toBits 255", expected: "replicate 8 1" },
      ],
      hint: "A helper `go 0 = []`, `go m = mod m 2 : go (div m 2)` produces the bits last-first; reverse it. Handle `0` separately.",
      solution: hs`toBits :: Int -> [Int]
toBits 0 = [0]
toBits n = reverse (go n)
  where
    go 0 = []
    go m = mod m 2 : go (div m 2)
`,
    },
    {
      k: "read",
      body: md(
        "2020's test came with pre-reading on `Data.Bits` (and the notes were available in the exam). It treats an Int as a row of 64 bits, numbered from 0 on the right. Add `import Data.Bits` to use these:",
        "",
        "```",
        "9 .&. 5         1        and: 1001 .&. 0101 = 0001",
        "9 .|. 5         13       or:  1001 .|. 0101 = 1101",
        "shiftL 2000 2   8000     move bits left 2 places (times 4)",
        "shiftR 2000 3   250      move bits right 3 places (div 8)",
        "bit 5           32       just bit 5 set: 100000",
        "setBit 0 3      8        turn bit 3 on",
        "clearBit 15 0   14       turn bit 0 off: 1111 -> 1110",
        "testBit 1771 3  True     is bit 3 on?",
        "popCount 7      3        how many 1 bits",
        "```",
        "",
        "`.&.` keeps a bit only where both numbers have a 1; `.|.` keeps it where either does.",
      ),
    },
    {
      k: "predict",
      expr: "(12 .&. 10, 12 .|. 10)",
      answer: "(8, 14)",
      why: "12 is 1100 and 10 is 1010. And: only bit 3 is in both, giving 1000 = 8. Or: 1110 = 14.",
    },
    {
      k: "predict",
      expr: "(shiftL 3 4, shiftR 100 2)",
      answer: "(48, 25)",
      why: "Shifting left by 4 multiplies by 2⁴ = 16: 3 × 16 = 48. Shifting right by 2 is `div` 4: 25.",
    },
    {
      k: "predict",
      expr: "(bit 3, setBit 1 4, clearBit 7 1)",
      answer: "(8, 17, 5)",
      why: "`bit 3` is 1000 = 8. Setting bit 4 of 1 gives 10001 = 17. Clearing bit 1 of 111 gives 101 = 5.",
    },
    {
      k: "predict",
      expr: "[testBit 10 i | i <- [0 .. 3]]",
      answer: "[False, True, False, True]",
      why: "10 is 1010. Reading from bit 0 on the right: 0, 1, 0, 1.",
    },
    {
      k: "read",
      body: md(
        "Masking picks out a block of bits. `bit b - 1` is a number whose lowest `b` bits are all 1 (for example `bit 4 - 1` is 15, binary 1111). And-ing with it keeps only those bits.",
        "",
        "To get the `b` bits starting at position `k`, first shift them down to the bottom, then mask:",
        "",
        "```",
        "shiftR n k .&. (bit b - 1)",
        "```",
        "",
        "The pre-reading's example: bits 5 to 10 of 44628 (binary 1010111001010100) are 110010, which is 50. This one expression is most of 2020's `getIndex` (2 marks) and `countOnesFrom` (2 marks).",
      ),
    },
    {
      k: "predict",
      expr: "shiftR 44628 5 .&. (bit 6 - 1)",
      answer: "50",
      why: "Shifting right by 5 moves bits 5-10 to positions 0-5; masking with 111111 throws everything above away. That leaves 110010 = 50.",
    },
    {
      k: "write",
      body: md(
        "Write 2020's `getIndex n i b`: split `n` into blocks of `b` bits, numbered from 0 on the right, and return block `i` as a number.",
        "",
        "```",
        "53767 = 1101 0010 0000 0111",
        "getIndex 53767 0 4  ==  7",
        "getIndex 53767 3 4  ==  13",
        "getIndex 53767 1 8  ==  210",
        "```",
      ),
      starter: hs`import Data.Bits

getIndex :: Int -> Int -> Int -> Int
getIndex n i b = undefined
`,
      tests: [
        { expr: "getIndex 53767 0 4", expected: "7" },
        { expr: "getIndex 53767 3 4", expected: "13" },
        { expr: "getIndex 53767 1 8", expected: "210" },
        { expr: "getIndex 53767 2 4", expected: "2" },
        { expr: "getIndex 53767 4 4", expected: "0" },
      ],
      hint: "Block `i` starts at bit `i * b`. Shift right by that, then mask with `bit b - 1`.",
      solution: hs`import Data.Bits

getIndex :: Int -> Int -> Int -> Int
getIndex n i b = shiftR n (i * b) .&. (bit b - 1)
`,
    },
  ],
};

const drillNumbers: DrillSet = {
  id: "drill-numbers",
  lesson: "numbers",
  title: "Numbers in exams: drills",
  drills: [
    {
      k: "quiz",
      q: "What does `2 ^ 63 :: Int` give?",
      options: ["`9223372036854775808`", "`-9223372036854775808`", "An overflow exception", "`Infinity`"],
      answer: 1,
      why: "An Int has 64 bits and the biggest is 2⁶³ − 1. Going past it silently wraps round to the most negative Int. `Integer` would give the right answer.",
    },
    {
      k: "predict",
      expr: "fromIntegral (7 :: Int) / 2",
      answer: "3.5",
      why: "`fromIntegral` turns the Int 7 into a fractional number so `/` can be used.",
    },
    {
      k: "quiz",
      q: "`xs :: [Int]`. Which expression compiles?",
      options: ["`length xs * 0.5`", "`fromIntegral (length xs) * 0.5`", "`length xs / 2`", "`sum xs / length xs`"],
      answer: 1,
      why: "`0.5` and `/` need a fractional type, and `length` gives an Int. Only the version with `fromIntegral` converts it.",
    },
    {
      k: "predict",
      expr: "(7 `div` (-2), 7 `quot` (-2))",
      answer: "(-4, -3)",
      why: "−3.5 rounded down is −4 (`div`); rounded towards zero is −3 (`quot`).",
    },
    {
      k: "quiz",
      q: "What is `mod (-7) 3`?",
      options: ["`-1`", "`1`", "`2`", "`-2`"],
      answer: 2,
      why: "`div (-7) 3` is −3 (rounded down from −2.33), and −3 × 3 = −9. −7 − (−9) = 2. With a positive divisor, `mod` is never negative.",
    },
    {
      k: "predict",
      expr: "(numerator (6 % 8), denominator (6 % 8))",
      answer: "(3, 4)",
      why: "Rationals are always kept in lowest terms: 6/8 is stored as 3/4.",
    },
    {
      k: "quiz",
      q: "How does GHCi print the Rational minus three quarters?",
      options: ["`-3 % 4`", "`(-3) % 4`", "`-0.75`", "`3 % (-4)`"],
      answer: 1,
      why: "The sign goes on the numerator, in brackets. You'll see this in 2024's examples, like `((-3) % 2, 2)`.",
    },
    {
      k: "predict",
      expr: "(round 3.5, round 4.5, round (-1.5))",
      answer: "(4, 4, -2)",
      why: "Exact halves round to the even neighbour: 3.5 to 4, 4.5 to 4, −1.5 to −2.",
    },
    {
      k: "write",
      body: "Write `percentage part total`: `part` as a percentage of `total`, as a Double. If `total` is 0, the answer is 0.",
      starter: hs`percentage :: Int -> Int -> Double
percentage part total = undefined
`,
      tests: [
        { expr: "percentage 1 4", expected: "25.0" },
        { expr: "percentage 3 3", expected: "100.0" },
        { expr: "percentage 5 0", expected: "0.0" },
        { expr: "percentage 0 7", expected: "0.0" },
        close("percentage 1 3", "33.333333333333336"),
      ],
      hint: "Guard on `total == 0`. Otherwise `100 * fromIntegral part / fromIntegral total`.",
      solution: hs`percentage :: Int -> Int -> Double
percentage part total
  | total == 0 = 0
  | otherwise = 100 * fromIntegral part / fromIntegral total
`,
    },
    {
      k: "quiz",
      q: "You must compute 25! (25 factorial, about 1.5 × 10²⁵) exactly. Which type?",
      options: ["`Int`", "`Integer`", "`Double`", "`Rational`, because it's a big number"],
      answer: 1,
      why: "It's whole and bigger than the largest Int (about 9.2 × 10¹⁸), so `Int` would wrap round. A Double would lose the exact digits.",
    },
    {
      k: "predict",
      expr: "popCount 29855",
      answer: "10",
      why: "29855 is 0111010010011111 in binary, which has ten 1 bits.",
    },
    {
      k: "write",
      body: "Write `fromBits`, which turns a list of binary digits (most significant first) back into a number.",
      starter: hs`fromBits :: [Int] -> Int
fromBits bs = undefined
`,
      tests: [
        { expr: "fromBits [1,1,0,1]", expected: "13" },
        { expr: "fromBits []", expected: "0" },
        { expr: "fromBits [0,0,1]", expected: "1" },
        { expr: "fromBits [1,0,0,0,0,0,0,0,0,0]", expected: "512" },
      ],
      hint: "`foldl (\\acc b -> 2 * acc + b) 0 bs`",
      solution: hs`fromBits :: [Int] -> Int
fromBits bs = foldl (\acc b -> 2 * acc + b) 0 bs
`,
    },
    {
      k: "predict",
      expr: "testBit 1771 8",
      answer: "False",
      why: "1771 is 011011101011 in 12 bits. Bit 8 (ninth from the right) is 0.",
    },
    {
      k: "predict",
      expr: "setBit 39855 14",
      answer: "56239",
      why: "Bit 14 of 39855 was 0; turning it on adds 2¹⁴ = 16384. 39855 + 16384 = 56239 (the pre-reading's own example).",
    },
    {
      k: "quiz",
      q: "What is `bit 4 - 1` in binary?",
      options: ["`10000`", "`1111`", "`1000`", "`0111`"],
      answer: 1,
      why: "`bit 4` is 10000 (16). Subtracting 1 gives 01111 (15): the lowest four bits all set. That's the mask for a 4-bit block.",
    },
    {
      k: "write",
      body: md(
        "Write `isPowerOfTwo` using `Data.Bits`. Trick: a positive number is a power of two exactly when it has a single 1 bit, which is when `n .&. (n - 1)` is 0.",
      ),
      starter: hs`import Data.Bits

isPowerOfTwo :: Int -> Bool
isPowerOfTwo n = undefined
`,
      tests: [
        { expr: "isPowerOfTwo 1", expected: "True" },
        { expr: "isPowerOfTwo 64", expected: "True" },
        { expr: "isPowerOfTwo 96", expected: "False" },
        { expr: "isPowerOfTwo 0", expected: "False" },
        { expr: "isPowerOfTwo (-8)", expected: "False" },
      ],
      hint: "`n > 0 && n .&. (n - 1) == 0`. The `n > 0` part handles 0 and negatives.",
      solution: hs`import Data.Bits

isPowerOfTwo :: Int -> Bool
isPowerOfTwo n = n > 0 && n .&. (n - 1) == 0
`,
    },
    {
      k: "predict",
      expr: "shiftR 53767 12 .&. (bit 4 - 1)",
      answer: "13",
      why: "53767 is 1101 0010 0000 0111. Shifting right 12 leaves 1101 at the bottom; the mask keeps those 4 bits: 13.",
    },
    {
      k: "quiz",
      q: "Why did 2017's template provide `xlogx`, which returns 0 when x is 0?",
      options: [
        "For speed",
        "Because `0 * logBase 2 0` is `NaN`, which would ruin the entropy sum, while mathematically the term should count as 0",
        "Because `logBase` doesn't work on Doubles",
        "Because the entropy must always be positive",
      ],
      answer: 1,
      why: "log 0 is −∞ and 0 × −∞ is NaN. The convention in entropy is that 0 · log 0 = 0, so you must special-case it.",
    },
    {
      k: "predict",
      expr: "(floor 3.999, ceiling 3.001)",
      answer: "(3, 4)",
      why: "`floor` always goes down and `ceiling` always goes up, however close you are.",
    },
    {
      k: "write",
      body: md(
        "Write `toBase b n`: the digits of the non-negative number `n` in base `b` (at least 2), most significant first. `toBase b 0` is `[0]`.",
        "",
        "```",
        "toBase 2 13 == [1,1,0,1]      toBase 10 4072 == [4,0,7,2]",
        "```",
      ),
      starter: hs`toBase :: Int -> Int -> [Int]
toBase b n = undefined
`,
      tests: [
        { expr: "toBase 2 13", expected: "[1,1,0,1]" },
        { expr: "toBase 10 4072", expected: "[4,0,7,2]" },
        { expr: "toBase 16 255", expected: "[15,15]" },
        { expr: "toBase 3 0", expected: "[0]" },
        { expr: "toBase 8 8", expected: "[1,0]" },
      ],
      hint: "Same as binary but with `mod m b` and `div m b`, then reverse. Special-case 0.",
      solution: hs`toBase :: Int -> Int -> [Int]
toBase _ 0 = [0]
toBase b n = reverse (go n)
  where
    go 0 = []
    go m = mod m b : go (div m b)
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2020, `countOnes`, 2 marks). Count the 1 bits in a non-negative Int, processing the bits one at a time with `div` and `mod`. The spec says: \"please do not write countOnes = popCount\".",
        "",
        "```",
        "countOnes 0 == 0        countOnes 65219 == 11",
        "```",
      ),
      starter: hs`countOnes :: Int -> Int
countOnes n = undefined
`,
      banned: ["popCount"],
      tests: [
        { expr: "countOnes 0", expected: "0" },
        { expr: "countOnes 65219", expected: "11" },
        { expr: "countOnes 1", expected: "1" },
        { expr: "countOnes 1023", expected: "10" },
        { expr: "countOnes 1024", expected: "1" },
      ],
      hint: "`countOnes 0 = 0`; otherwise `mod n 2 + countOnes (div n 2)`.",
      solution: hs`countOnes :: Int -> Int
countOnes 0 = 0
countOnes n = mod n 2 + countOnes (div n 2)
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2020, `countOnesFrom`, 2 marks). `countOnesFrom i n` is the number of 1 bits in `n` to the right of bit `i` (not including bit `i`). You may use `popCount` here.",
        "",
        "```",
        "countOnesFrom 0 88 == 0       countOnesFrom 3 15 == 3",
        "```",
        "",
        "Spec hint: use `.&.` and `bit` to mask the least significant `i` bits.",
      ),
      starter: hs`import Data.Bits

countOnesFrom :: Int -> Int -> Int
countOnesFrom i n = undefined
`,
      tests: [
        { expr: "countOnesFrom 0 88", expected: "0" },
        { expr: "countOnesFrom 3 15", expected: "3" },
        { expr: "countOnesFrom 4 88", expected: "1" },
        { expr: "countOnesFrom 7 88", expected: "3" },
        { expr: "countOnesFrom 10 0", expected: "0" },
      ],
      hint: "`popCount (n .&. (bit i - 1))`",
      solution: hs`import Data.Bits

countOnesFrom :: Int -> Int -> Int
countOnesFrom i n = popCount (n .&. (bit i - 1))
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2020, `getIndex`, 2 marks). Return block `i` of `n`, where blocks are `b` bits wide and numbered from 0 on the right.",
        "",
        "```",
        "getIndex 53767 0 4 == 7     getIndex 53767 3 4 == 13     getIndex 53767 1 8 == 210",
        "```",
      ),
      starter: hs`import Data.Bits

getIndex :: Int -> Int -> Int -> Int
getIndex n i b = undefined
`,
      tests: [
        { expr: "getIndex 53767 0 4", expected: "7" },
        { expr: "getIndex 53767 3 4", expected: "13" },
        { expr: "getIndex 53767 1 8", expected: "210" },
        { expr: "getIndex 44628 0 5", expected: "20" },
        { expr: "getIndex 255 1 3", expected: "7" },
      ],
      hint: "Shift block `i` down to the bottom with `shiftR n (i * b)`, then mask with `bit b - 1`.",
      solution: hs`import Data.Bits

getIndex :: Int -> Int -> Int -> Int
getIndex n i b = shiftR n (i * b) .&. (bit b - 1)
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2017, `entropy`). Given the class of each row of a data set (for example a list of `\"yes\"`/`\"no\"` results), compute H = − Σ p · log₂ p over the distinct classes, where p is the fraction of rows in that class. An empty list has entropy 0.0.",
        "",
        "```",
        "entropy (replicate 9 \"yes\" ++ replicate 5 \"no\")  ≈  0.9402859586706309",
        "```",
      ),
      starter: hs`entropy :: [String] -> Double
entropy classes = undefined
`,
      tests: [
        close('entropy (replicate 9 "yes" ++ replicate 5 "no")', "0.9402859586706309"),
        close("entropy []", "0.0"),
        close('entropy ["a","b","a","b"]', "1.0"),
        close('entropy ["hot","mild","cool","hot"]', "1.5"),
        close('entropy ["x","x","x"]', "0.0"),
      ],
      hint: "Find the distinct classes with `nub` (import `Data.List`), count each with a list comprehension or `filter`, divide by the total using `fromIntegral`, and sum p * logBase 2 p (each p here is above 0).",
      solution: hs`import Data.List (nub)

entropy :: [String] -> Double
entropy [] = 0
entropy classes = negate (sum [p * logBase 2 p | c <- nub classes, let p = fraction c])
  where
    total = length classes
    fraction c = fromIntegral (length (filter (== c) classes)) / fromIntegral total
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2024, `diffP` and `intP`, building on `diffT` and `intT`). Polynomials are lists of `(Rational, Integer)` terms in decreasing exponent order. Differentiate and integrate every term.",
        "",
        "Careful: differentiating a constant gives a zero term, which must be dropped, and the zero polynomial is `[(0,0)]`.",
        "",
        "```",
        "diffP [(2,2),(-3,1),(1,0)] == [(4,1),(-3,0)]",
        "intP  [(2,2),(-3,1),(1,0)] == [(2 % 3,3),((-3) % 2,2),(1,1)]",
        "diffP [(5,0)]              == [(0,0)]",
        "```",
      ),
      setup: hs`import Data.Ratio ((%))

type Polynomial = [(Rational, Integer)]
`,
      starter: hs`diffP :: Polynomial -> Polynomial
diffP p = undefined

intP :: Polynomial -> Polynomial
intP p = undefined
`,
      tests: [
        { expr: "diffP [(2,2),(-3,1),(1,0)]", expected: "[(4,1),(-3,0)]" },
        { expr: "diffP [(5,0)]", expected: "[(0,0)]" },
        { expr: "diffP [(1 % 2, 4)]", expected: "[(2,3)]" },
        { expr: "intP [(2,2),(-3,1),(1,0)]", expected: "[(2 % 3,3),((-3) % 2,2),(1,1)]" },
        { expr: "intP [(0,0)]", expected: "[(0,0)]" },
      ],
      hint: "Differentiate each term with `(c * fromIntegral e, e - 1)`, but filter out exponent-0 terms first. If nothing is left, return `[(0,0)]`. For `intP`, keep only terms with a non-zero coefficient before integrating, and again use `[(0,0)]` for an empty result.",
      solution: hs`diffP :: Polynomial -> Polynomial
diffP p = orZero [(c * fromIntegral e, e - 1) | (c, e) <- p, e /= 0, c /= 0]

intP :: Polynomial -> Polynomial
intP p = orZero [(c / fromIntegral (e + 1), e + 1) | (c, e) <- p, c /= 0]

orZero :: Polynomial -> Polynomial
orZero [] = [(0, 0)]
orZero ts = ts
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// 17. Reading text into data
// ---------------------------------------------------------------------------

const xmlBase = hs`import Data.Char

type Name = String
type Attributes = [(Name, String)]

data XML = Text String | Element Name Attributes [XML]
  deriving (Eq, Show)

type Stack = [XML]

sentinel :: XML
sentinel = Element "" [] []

skipSpace :: String -> String
skipSpace s = dropWhile isSpace s

parseName :: String -> (Name, String)
parseName s = span isNameChar s
  where
    isNameChar c = isAlpha c || isDigit c || elem c "-."

addChild :: XML -> XML -> XML
addChild child (Element n as cs) = Element n as (cs ++ [child])
addChild _ t = t

x1 :: XML
x1 = Element "a" [] [Text "A"]
`;

const parseAttributesSolution = hs`parseAttributes :: String -> (Attributes, String)
parseAttributes s =
  case skipSpace s of
    '>' : rest -> ([], rest)
    s' -> ((name, value) : attrs, rest')
      where
        (name, afterName) = parseName s'
        afterEq = skipSpace (drop 1 (skipSpace afterName))
        (value, afterValue) = break (== '"') (drop 1 afterEq)
        (attrs, rest') = parseAttributes (drop 1 afterValue)
`;

const stackOpsSolution = hs`addText :: String -> Stack -> Stack
addText s (top : rest) = addChild (Text s) top : rest

popAndAdd :: Stack -> Stack
popAndAdd (top : next : rest) = addChild top next : rest
`;

const xmlStrings = hs`
s1, s2, casablanca :: String
s1 = "<a>A</a>"
s2 = "<a x=\"1\"><b>A</b><b>B</b></a>"
casablanca = "<film title=\"Casablanca\">\n  <director>Michael Curtiz</director>\n  <year>1942</year>\n</film>\n\n\n"

casablancaParsed :: XML
casablancaParsed =
  Element "film" [("title", "Casablanca")]
    [ Text "\n  "
    , Element "director" [] [Text "Michael Curtiz"]
    , Text "\n  "
    , Element "year" [] [Text "1942"]
    , Text "\n"
    ]

parse :: String -> XML
parse s = parse' (skipSpace s) [sentinel]
`;

const splitOnSolution = hs`splitOn :: Char -> String -> [String]
splitOn c s =
  case break (== c) s of
    (chunk, []) -> [chunk]
    (chunk, _ : rest) -> chunk : splitOn c rest
`;

const parsing: Lesson = {
  id: "parsing",
  title: "Reading text into data",
  blurb: "span, break, words and friends; parsers that return (value, rest); prefix patterns; stacks; 2016's XML parser.",
  steps: [
    {
      k: "read",
      body: md(
        "Parsing means reading a String and turning it into structured data: numbers, pairs, trees. Exams do this more than you might expect. 2016 was an XML parser: `skipSpace` (1 mark), `parseAttributes` (3 marks) and the main stack-based `parse'` (7 marks). 2010 was all about prefixes and substrings.",
        "",
        "Every tool in this lesson is in the Prelude or in `Data.Char` (add `import Data.Char` for `isSpace`, `isDigit`, `isAlpha` and friends).",
      ),
    },
    {
      k: "read",
      body: md(
        "Four functions do most of the work. Each takes a test on characters (like `isDigit`) and a string:",
        "",
        "```",
        "takeWhile isDigit \"123abc\"   is  \"123\"            the front part that passes",
        "dropWhile isDigit \"123abc\"   is  \"abc\"            everything after it",
        "span  isDigit \"123abc\"       is  (\"123\", \"abc\")   both at once",
        "break isSpace \"hi there\"     is  (\"hi\", \" there\")  split at the FIRST char that passes",
        "```",
        "",
        "`span p` keeps going while `p` is True. `break p` keeps going until `p` is True; it's the same as `span (not . p)`.",
      ),
    },
    {
      k: "predict",
      expr: "span isDigit \"2024-01-15\"",
      answer: "(\"2024\", \"-01-15\")",
      why: "The digits at the front go left; everything from the first non-digit (the `-`) goes right.",
    },
    {
      k: "predict",
      expr: "break (== ',') \"ab,cd\"",
      answer: "(\"ab\", \",cd\")",
      why: "`break` stops at the comma, and the comma stays at the start of the second part. You'll usually need `drop 1` to get past it.",
    },
    {
      k: "quiz",
      q: "Which equals `break (== '=') \"key=val\"`?",
      options: ["`(\"key\", \"val\")`", "`(\"key\", \"=val\")`", "`(\"key=\", \"val\")`", "`[\"key\", \"val\"]`"],
      answer: 1,
      why: "The character that stopped the `break` is kept, at the front of the second part. So the value is `drop 1 \"=val\"`.",
    },
    {
      k: "predict",
      expr: "dropWhile isSpace \"   hi there  \"",
      answer: "\"hi there  \"",
      why: "Only the spaces at the front go. `dropWhile` stops at the first character that fails the test, so the middle and end are untouched.",
    },
    {
      k: "write",
      body: "2016's first question (1 mark): using `isSpace`, write `skipSpace`, which discards any leading whitespace (spaces, tabs, newlines).",
      starter: hs`import Data.Char

skipSpace :: String -> String
skipSpace s = undefined
`,
      tests: [
        { expr: 'skipSpace "\\n \\n\\nsome \\n \\n text"', expected: '"some \\n \\n text"' },
        { expr: 'skipSpace "abc"', expected: '"abc"' },
        { expr: 'skipSpace "   "', expected: '""' },
        { expr: 'skipSpace ""', expected: '""' },
      ],
      hint: "`dropWhile isSpace s`",
      solution: hs`import Data.Char

skipSpace :: String -> String
skipSpace s = dropWhile isSpace s
`,
    },
    {
      k: "read",
      body: md(
        "For text split by whitespace or newlines, the Prelude has ready-made splitters:",
        "",
        "```",
        "words \"  the  cat \"     is  [\"the\", \"cat\"]      splits on any whitespace, ignores extra",
        "lines \"a\\nb\"            is  [\"a\", \"b\"]          splits on newlines",
        "unwords [\"a\", \"b\"]      is  \"a b\"",
        "unlines [\"a\", \"b\"]      is  \"a\\nb\\n\"          note the newline after every line",
        "```",
      ),
    },
    {
      k: "predict",
      expr: "words \"  the  cat\\nsat \"",
      answer: "[\"the\", \"cat\", \"sat\"]",
      why: "`words` treats any run of spaces or newlines as one separator and ignores leading and trailing whitespace.",
    },
    {
      k: "predict",
      expr: "lines \"a\\nb\\n\\nc\"",
      answer: "[\"a\", \"b\", \"\", \"c\"]",
      why: "Each newline ends a line. Two newlines in a row mean there's an empty line between them.",
    },
    {
      k: "read",
      body: md(
        "The key idea for bigger parsers: a parser reads what it needs from the front of the string and hands back a pair of what it read and the rest of the string.",
        "",
        "```",
        "parseNumber :: String -> (Int, String)",
        "parseNumber s = (read digits, rest)",
        "  where (digits, rest) = span isDigit s",
        "",
        "parseNumber \"42+x\"  is  (42, \"+x\")",
        "```",
        "",
        "The next parser then starts on `rest`. 2016's `parseName :: String -> (String, String)` and `parseAttributes :: String -> (Attributes, String)` both have this shape. `read` turns a String into a value; the type signature tells it to make an Int.",
      ),
    },
    {
      k: "write",
      body: md(
        "Write `parseNumber`. You may assume the string starts with at least one digit.",
      ),
      starter: hs`import Data.Char

parseNumber :: String -> (Int, String)
parseNumber s = undefined
`,
      tests: [
        { expr: 'parseNumber "123abc"', expected: '(123, "abc")' },
        { expr: 'parseNumber "7"', expected: '(7, "")' },
        { expr: 'parseNumber "0x"', expected: '(0, "x")' },
        { expr: 'parseNumber "42 + 1"', expected: '(42, " + 1")' },
      ],
      hint: "Use `span isDigit s` in a `where`, then `read` the digits.",
      solution: hs`import Data.Char

parseNumber :: String -> (Int, String)
parseNumber s = (read digits, rest)
  where
    (digits, rest) = span isDigit s
`,
    },
    {
      k: "predict",
      expr: "let (name, rest) = span isAlpha \"abc=1;\" in (name, drop 1 rest)",
      answer: "(\"abc\", \"1;\")",
      why: "`span isAlpha` takes the letters; the rest starts with `=`, which `drop 1` skips.",
    },
    {
      k: "read",
      body: md(
        "A String is a list of Chars, so you can pattern match on its first few characters directly:",
        "",
        "```",
        "kind ('<' : '/' : rest) = \"end tag\"",
        "kind ('<' : rest)       = \"start tag\"",
        "kind []                 = \"finished\"",
        "kind _                  = \"text\"",
        "```",
        "",
        "Order matters: Haskell tries equations from top to bottom. `\"</a>\"` also matches `('<' : rest)`, so the more specific end-tag pattern must come first. For longer prefixes, `isPrefixOf` from `Data.List` is handy: `isPrefixOf \"<!--\" s`.",
      ),
    },
    {
      k: "quiz",
      q: "If the `('<' : rest)` equation came before the `('<' : '/' : rest)` one, what would `kind \"</a>\"` give?",
      options: ["`\"end tag\"`", "`\"start tag\"`", "A compile error", "`\"text\"`"],
      answer: 1,
      why: "The first matching equation wins, and `\"</a>\"` does start with `'<'`. GHC would even warn that the end-tag equation can never be reached. Always put specific patterns before general ones.",
    },
    {
      k: "write",
      body: "Write `kind` as above, so that it classifies the start of an XML string.",
      starter: hs`kind :: String -> String
kind s = undefined
`,
      tests: [
        { expr: 'kind "</a>rest"', expected: '"end tag"' },
        { expr: 'kind "<a>"', expected: '"start tag"' },
        { expr: 'kind ""', expected: '"finished"' },
        { expr: 'kind "hello<"', expected: '"text"' },
        { expr: 'kind "/<"', expected: '"text"' },
      ],
      hint: "Four equations, most specific first.",
      solution: hs`kind :: String -> String
kind ('<' : '/' : _) = "end tag"
kind ('<' : _) = "start tag"
kind [] = "finished"
kind _ = "text"
`,
    },
    {
      k: "read",
      body: md(
        "Base Haskell has no `splitOn` for splitting on an arbitrary character, so you'll write it yourself. The trick: `break` at the separator; if nothing is left, that was the last chunk; otherwise skip the separator and split the rest.",
        "",
        "```",
        "splitOn :: Char -> String -> [String]",
        "splitOn c s =",
        "  case break (== c) s of",
        "    (chunk, [])       -> [chunk]",
        "    (chunk, _ : rest) -> chunk : splitOn c rest",
        "```",
        "",
        "The `_` in `_ : rest` is the separator itself, thrown away.",
      ),
    },
    {
      k: "predict",
      expr: "let sp c s = case break (== c) s of { (a, []) -> [a]; (a, _ : r) -> a : sp c r } in sp ',' \"1,,2,\"",
      answer: "[\"1\", \"\", \"2\", \"\"]",
      why: "Two commas in a row give an empty chunk between them, and a comma at the end gives an empty last chunk. That's usually what you want for CSV-style data (unlike `words`, which skips empties).",
    },
    {
      k: "write",
      body: "Write `splitOn`.",
      starter: hs`splitOn :: Char -> String -> [String]
splitOn c s = undefined
`,
      tests: [
        { expr: "splitOn ',' \"a,b,c\"", expected: '["a","b","c"]' },
        { expr: "splitOn ',' \"abc\"", expected: '["abc"]' },
        { expr: "splitOn ',' \"\"", expected: '[""]' },
        { expr: "splitOn ';' \"x;;y;\"", expected: '["x","","y",""]' },
        { expr: "splitOn ' ' \"one two\"", expected: '["one","two"]' },
      ],
      hint: "`case break (== c) s of` with the two cases shown above.",
      solution: splitOnSolution,
    },
    {
      k: "write",
      body: md(
        "Using `splitOn` (given), write `parsePairs`, which reads settings like `\"a=1;b=22\"` into `[(\"a\",\"1\"),(\"b\",\"22\")]`. Ignore empty items, so `\"\"` gives `[]` and a trailing `;` is fine.",
      ),
      setup: splitOnSolution,
      starter: hs`parsePairs :: String -> [(String, String)]
parsePairs s = undefined
`,
      tests: [
        { expr: 'parsePairs "a=1;b=22"', expected: '[("a","1"),("b","22")]' },
        { expr: 'parsePairs ""', expected: "[]" },
        { expr: 'parsePairs "x=;y=2;"', expected: '[("x",""),("y","2")]' },
        { expr: 'parsePairs "k=v=w"', expected: '[("k","v=w")]' },
      ],
      hint: "A list comprehension over `splitOn ';' s`, skipping empty items, with `let (k, v) = break (== '=') item` and producing `(k, drop 1 v)`.",
      solution: hs`parsePairs :: String -> [(String, String)]
parsePairs s = [(k, drop 1 v) | item <- splitOn ';' s, not (null item), let (k, v) = break (== '=') item]
`,
    },
    {
      k: "read",
      body: md(
        "Now 2016's `parseAttributes :: String -> (Attributes, String)` (3 marks). It reads attributes like `a = \"0\" b = \"1\" >` and returns them plus the text after the `>`. The spec's rules:",
        "",
        "1. Skip whitespace and look at the next character.",
        "2. If it's `>`, you're done: no more attributes, and the rest is everything after the `>`.",
        "3. Otherwise read a name (`parseName`), skip spaces, the `=`, spaces, and the opening `\"`. The value is everything up to the closing `\"`. Skip that, and recurse for the remaining attributes.",
        "",
        "```",
        "parseAttributes \"a = \\\"0\\\" b = \\\"1\\\" >rest\"  ==  ([(\"a\",\"0\"),(\"b\",\"1\")], \"rest\")",
        "```",
        "",
        "(The `\\\"` is how a double quote is written inside a Haskell string.)",
      ),
    },
    {
      k: "write",
      body: md(
        "Write `parseAttributes`. `skipSpace` and `parseName` (which splits off a name, like `span`) are given.",
        "",
        "Tip: use `case skipSpace s of` with a `'>' : rest` branch and a general branch, and give the general branch a `where` with one line per step.",
      ),
      setup: xmlBase,
      starter: hs`parseAttributes :: String -> (Attributes, String)
parseAttributes s = undefined
`,
      tests: [
        { expr: "parseAttributes \"x=\\\"7\\\">rest of text\"", expected: '([("x","7")], "rest of text")' },
        { expr: "parseAttributes \"a = \\\"0\\\" b = \\\"1\\\" >rest of text\"", expected: '([("a","0"),("b","1")], "rest of text")' },
        { expr: 'parseAttributes ">after"', expected: '([], "after")' },
        { expr: 'parseAttributes "   >"', expected: '([], "")' },
        { expr: "parseAttributes \"t=\\\"two words\\\">\"", expected: '([("t","two words")], "")' },
      ],
      hint: "General branch: `(name, afterName) = parseName s'`, then `afterEq = skipSpace (drop 1 (skipSpace afterName))` skips the `=`, then `break (== '\"') (drop 1 afterEq)` gives the value, and recurse on `drop 1` of what follows it.",
      solution: parseAttributesSolution,
    },
    {
      k: "read",
      body: md(
        "Nested structures (tags inside tags, brackets inside brackets) need a stack: a list where you only add or remove at the front.",
        "",
        "```",
        "push x stack      =  x : stack",
        "pop (top : rest)  =  rest          -- and top is the item removed",
        "```",
        "",
        "Opening something pushes it; closing pops it. 2016's parser keeps a stack of half-built elements: a start tag pushes a new empty element, text gets added to the element on top, and an end tag pops the top element and adds it as a child of the one below.",
      ),
    },
    {
      k: "predict",
      expr: "foldl (\\st c -> if c == '(' then c : st else drop 1 st) [] \"(()(\"",
      answer: "\"((\"",
      why: "Push, push, pop, push: two open brackets are still waiting to be closed. If the input were balanced, the stack would end empty.",
    },
    {
      k: "write",
      body: md(
        "Write `matched`, which checks that all brackets `()`, `[]` and `{}` in a string are properly matched and nested, ignoring all other characters. Use a stack of the open brackets seen so far.",
      ),
      starter: hs`matched :: String -> Bool
matched s = undefined
`,
      tests: [
        { expr: 'matched "([]{x})"', expected: "True" },
        { expr: 'matched "([)]"', expected: "False" },
        { expr: 'matched "(("', expected: "False" },
        { expr: 'matched "())"', expected: "False" },
        { expr: 'matched "a[b]c"', expected: "True" },
        { expr: 'matched ""', expected: "True" },
      ],
      hint: "A helper `go cs stack`. An opener is pushed. A closer must find its partner on top of the stack (pop it), or the answer is False. Other characters are skipped. At the end the stack must be empty.",
      solution: hs`matched :: String -> Bool
matched s = go s []
  where
    go [] stack = null stack
    go (c : cs) stack
      | elem c "([{" = go cs (c : stack)
      | elem c ")]}" =
          case stack of
            (top : rest) | top == partner c -> go cs rest
            _ -> False
      | otherwise = go cs stack
    partner ')' = '('
    partner ']' = '['
    partner _ = '{'
`,
    },
    {
      k: "read",
      body: md(
        "Finally, a parser that builds a tree by calling itself. Fully bracketed arithmetic like `\"(1+(2*3))\"` becomes:",
        "",
        "```",
        "data Expr = Num Int | Op Char Expr Expr",
        "",
        "Op '+' (Num 1) (Op '*' (Num 2) (Num 3))",
        "```",
        "",
        "The rule: if the string starts with `(`, parse an expression, then read one operator character, then parse another expression, then skip the `)`. Otherwise read a number. Each step passes the rest of the string on to the next, so the pieces line up without any counting.",
      ),
    },
    {
      k: "write",
      body: md(
        "Write `parseExpr :: String -> (Expr, String)` for fully bracketed expressions with no spaces.",
        "",
        "```",
        "parseExpr \"(1+(2*3))\"  ==  (Op '+' (Num 1) (Op '*' (Num 2) (Num 3)), \"\")",
        "```",
      ),
      setup: hs`data Expr = Num Int | Op Char Expr Expr
  deriving (Eq, Show)
`,
      starter: hs`import Data.Char

parseExpr :: String -> (Expr, String)
parseExpr s = undefined
`,
      tests: [
        { expr: 'parseExpr "42rest"', expected: '(Num 42, "rest")' },
        { expr: 'parseExpr "(1+2)"', expected: "(Op '+' (Num 1) (Num 2), \"\")" },
        { expr: 'parseExpr "(1+(2*3))"', expected: "(Op '+' (Num 1) (Op '*' (Num 2) (Num 3)), \"\")" },
        { expr: 'parseExpr "((10-2)*3)!"', expected: "(Op '*' (Op '-' (Num 10) (Num 2)) (Num 3), \"!\")" },
      ],
      hint: "`parseExpr ('(' : rest)`: in a `where`, `(e1, op : rest2) = parseExpr rest` and `(e2, rest3) = parseExpr rest2`; the answer is `(Op op e1 e2, drop 1 rest3)`. Any other string: `span isDigit` and `read`.",
      solution: hs`import Data.Char

parseExpr :: String -> (Expr, String)
parseExpr ('(' : rest) = (Op op e1 e2, drop 1 rest3)
  where
    (e1, op : rest2) = parseExpr rest
    (e2, rest3) = parseExpr rest2
parseExpr s = (Num (read digits), rest)
  where
    (digits, rest) = span isDigit s
`,
    },
    {
      k: "quiz",
      q: "Why do parsers like `parseExpr` return the rest of the string as well as the value?",
      options: [
        "To make the type longer",
        "So the caller knows where the next piece of input starts, without having to count characters",
        "Because Haskell can't return a single value",
        "So the string can be printed later",
      ],
      answer: 1,
      why: "After parsing `e1`, the caller needs to continue from just after it. Handing back the rest makes parsers easy to chain: each one starts where the last one stopped.",
    },
  ],
};

const drillParsing: DrillSet = {
  id: "drill-parsing",
  lesson: "parsing",
  title: "Reading text into data: drills",
  drills: [
    {
      k: "predict",
      expr: "takeWhile isAlpha \"abc123\"",
      answer: "\"abc\"",
      why: "It stops at the first character that isn't a letter, the `1`.",
    },
    {
      k: "quiz",
      q: "What is the type of `span`?",
      options: ["`(a -> Bool) -> [a] -> [a]`", "`(a -> Bool) -> [a] -> ([a], [a])`", "`a -> [a] -> ([a], [a])`", "`(a -> Bool) -> [a] -> [[a]]`"],
      answer: 1,
      why: "A test and a list in; a pair of lists (the part that passed, and the rest) out.",
    },
    {
      k: "predict",
      expr: "span isUpper \"ABcD\"",
      answer: "(\"AB\", \"cD\")",
      why: "It stops at the first lowercase letter. The `D` after it is not collected: `span` only looks at the front.",
    },
    {
      k: "predict",
      expr: "break isSpace \"hello world\"",
      answer: "(\"hello\", \" world\")",
      why: "It breaks at the first space, which stays at the front of the second part.",
    },
    {
      k: "quiz",
      q: "What's the difference between `dropWhile isSpace s` and `filter (not . isSpace) s`?",
      options: [
        "None",
        "`dropWhile` only removes spaces at the front; `filter` removes them everywhere",
        "`filter` only removes spaces at the front; `dropWhile` removes them everywhere",
        "`dropWhile` removes the first space only",
      ],
      answer: 1,
      why: "`dropWhile` stops as soon as the test fails. `filter` checks every character.",
    },
    {
      k: "predict",
      expr: "unwords (words \"  a   b \")",
      answer: "\"a b\"",
      why: "`words` gives `[\"a\",\"b\"]`, and `unwords` joins with single spaces: a quick way to tidy whitespace.",
    },
    {
      k: "quiz",
      q: "Why not split `\"a  b\"` (two spaces) on spaces with your own `splitOn ' '` if you want the words?",
      options: [
        "It would give `[\"a\", \"\", \"b\"]`, with an empty string between the two spaces",
        "It would crash",
        "It would give `[\"a b\"]`",
        "No reason; it's the same as `words`",
      ],
      answer: 0,
      why: "`splitOn` keeps empty chunks; `words` treats any run of whitespace as one separator. Choose the one that matches the format in the spec.",
    },
    {
      k: "predict",
      expr: "read \"42\" + (1 :: Int)",
      answer: "43",
      why: "`read` makes an Int here because it's added to an Int.",
    },
    {
      k: "quiz",
      q: "What happens with `read \"12a\" :: Int`?",
      options: ["`12`", "`Nothing`", "A runtime error: `Prelude.read: no parse`", "`0`"],
      answer: 2,
      why: "`read` must consume the whole string. Use `span isDigit` first to separate the digits, or `readMaybe` if failure is possible.",
    },
    {
      k: "write",
      body: "Write `trim`, which removes whitespace from both ends of a string.",
      starter: hs`import Data.Char

trim :: String -> String
trim s = undefined
`,
      tests: [
        { expr: 'trim "  hi there \\n"', expected: '"hi there"' },
        { expr: 'trim "x"', expected: '"x"' },
        { expr: 'trim "   "', expected: '""' },
        { expr: 'trim ""', expected: '""' },
      ],
      hint: "Drop from the front, reverse, drop from the front again, reverse back.",
      solution: hs`import Data.Char

trim :: String -> String
trim s = reverse (dropWhile isSpace (reverse (dropWhile isSpace s)))
`,
    },
    {
      k: "predict",
      expr: "map digitToInt \"2024\"",
      answer: "[2, 0, 2, 4]",
      why: "`digitToInt` turns each digit character into its number.",
    },
    {
      k: "write",
      body: "Write `splitOn c s`, which splits `s` at every occurrence of `c` (keeping empty pieces).",
      starter: hs`splitOn :: Char -> String -> [String]
splitOn c s = undefined
`,
      tests: [
        { expr: "splitOn '/' \"usr/local/bin\"", expected: '["usr","local","bin"]' },
        { expr: "splitOn ',' \",a\"", expected: '["","a"]' },
        { expr: "splitOn ',' \"\"", expected: '[""]' },
        { expr: "splitOn '-' \"2024-01-15\"", expected: '["2024","01","15"]' },
      ],
      hint: "`break (== c) s`: if the second part is empty, that's the last piece; otherwise skip the separator and recurse.",
      solution: splitOnSolution,
    },
    {
      k: "predict",
      expr: "lines \"one\\ntwo\\n\"",
      answer: "[\"one\", \"two\"]",
      why: "A final newline just ends the last line; it doesn't create an extra empty line.",
    },
    {
      k: "quiz",
      q: "These equations are in this order:\n\n```\nf ('<' : rest)       = 1\nf ('<' : '/' : rest) = 2\nf _                  = 3\n```\n\nWhat is `f \"</b>\"`?",
      options: ["1", "2", "3", "Compile error"],
      answer: 0,
      why: "The first matching equation wins, and `\"</b>\"` starts with `'<'`. The second equation can never be reached; swap them.",
    },
    {
      k: "predict",
      expr: "isPrefixOf \"</\" \"</a>\"",
      answer: "True",
      why: "`isPrefixOf` (from `Data.List`) checks whether the first string is the start of the second.",
    },
    {
      k: "write",
      body: "Write `parseInts`, which reads a line of whitespace-separated whole numbers (possibly negative).",
      starter: hs`parseInts :: String -> [Int]
parseInts s = undefined
`,
      tests: [
        { expr: 'parseInts "12 7 -3"', expected: "[12,7,-3]" },
        { expr: 'parseInts "  5\\n 6 "', expected: "[5,6]" },
        { expr: 'parseInts ""', expected: "[]" },
        { expr: 'parseInts "0"', expected: "[0]" },
      ],
      hint: "`map read (words s)`",
      solution: hs`parseInts :: String -> [Int]
parseInts s = map read (words s)
`,
    },
    {
      k: "quiz",
      q: "A parser has type `String -> (Attributes, String)`. What is the second String for?",
      options: ["An error message", "The text that hasn't been parsed yet", "A copy of the input", "The name of the element"],
      answer: 1,
      why: "Parsers hand back the unread input so the next parser can carry on from there.",
    },
    {
      k: "predict",
      expr: "let (k, v) = break (== '=') \"key=val\" in (k, drop 1 v)",
      answer: "(\"key\", \"val\")",
      why: "`break` keeps the `=` at the start of `v`; `drop 1` removes it.",
    },
    {
      k: "quiz",
      q: "A file's text is `\"a b\\nc\"` (a newline between `a b` and `c`). Which gives `[\"a b\", \"c\"]`?",
      options: ["`words`", "`lines`", "`unwords`", "`splitOn ' '`"],
      answer: 1,
      why: "`lines` splits only at newlines, so the space inside `a b` survives. `words` would give `[\"a\", \"b\", \"c\"]`.",
    },
    {
      k: "write",
      body: md(
        "Write `decode`, which expands run-length encoded text: a count followed by a character, repeated. For example `\"3a2b\"` means three `a`s then two `b`s. Counts can have several digits.",
      ),
      starter: hs`import Data.Char

decode :: String -> String
decode s = undefined
`,
      tests: [
        { expr: 'decode "3a2b"', expected: '"aaabb"' },
        { expr: 'decode ""', expected: '""' },
        { expr: 'decode "10x"', expected: "replicate 10 'x'" },
        { expr: 'decode "1a1b1c"', expected: '"abc"' },
        { expr: 'decode "2z0y1q"', expected: '"zzq"' },
      ],
      hint: "`decode [] = []`. Otherwise `span isDigit s` gives `(ds, c : rest)`; output `replicate (read ds) c ++ decode rest`.",
      solution: hs`import Data.Char

decode :: String -> String
decode [] = []
decode s = replicate (read ds) c ++ decode rest
  where
    (ds, c : rest) = span isDigit s
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2010, `isPrefix` and `removePrefix`, 1 mark each). Don't use `isPrefixOf`.",
        "",
        "- `isPrefix p s` is True if `p` is a prefix of `s`: `isPrefix \"has\" \"haskell\"` and `isPrefix \"\" \"haskell\"` are True; `isPrefix \"haskell\" \"has\"` is False.",
        "- `removePrefix p s` removes the prefix `p` from `s` (precondition: it is a prefix). `removePrefix \"ja\" \"java\"` is `\"va\"`.",
      ),
      starter: hs`isPrefix :: String -> String -> Bool
isPrefix p s = undefined

removePrefix :: String -> String -> String
removePrefix p s = undefined
`,
      banned: ["isPrefixOf"],
      tests: [
        { expr: 'isPrefix "has" "haskell"', expected: "True" },
        { expr: 'isPrefix "" "haskell"', expected: "True" },
        { expr: 'isPrefix "haskell" "has"', expected: "False" },
        { expr: 'isPrefix "ask" "haskell"', expected: "False" },
        { expr: 'removePrefix "ja" "java"', expected: '"va"' },
        { expr: 'removePrefix "" "java"', expected: '"java"' },
      ],
      hint: "`isPrefix [] _ = True`, `isPrefix _ [] = False`, and for two non-empty strings compare the heads and recurse. `removePrefix p s = drop (length p) s`.",
      solution: hs`isPrefix :: String -> String -> Bool
isPrefix [] _ = True
isPrefix _ [] = False
isPrefix (x : xs) (y : ys) = x == y && isPrefix xs ys

removePrefix :: String -> String -> String
removePrefix p s = drop (length p) s
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2010, `findSubstrings`). Return the indices of every occurrence of a substring in a text (in any order). `[]` if there are none.",
        "",
        "```",
        "findSubstrings \"an\" \"banana\" == [1,3]",
        "findSubstrings \"s\" \"mississippi\" == [2,3,5,6]",
        "```",
        "",
        "Hint from the spec: look at all suffixes of the text (`tails` from `Data.List`, or repeated `tail`) and check which ones start with the substring.",
      ),
      starter: hs`import Data.List

findSubstrings :: String -> String -> [Int]
findSubstrings sub text = undefined
`,
      tests: [
        { expr: 'findSubstrings "an" "banana"', expected: "[1,3]", unordered: true },
        { expr: 'findSubstrings "s" "mississippi"', expected: "[2,3,5,6]", unordered: true },
        { expr: 'findSubstrings "x" "abc"', expected: "[]" },
        { expr: 'findSubstrings "aa" "aaa"', expected: "[0,1]", unordered: true },
        { expr: 'findSubstrings "ana" "banana"', expected: "[1,3]", unordered: true },
      ],
      hint: "`[i | (i, suffix) <- zip [0 ..] (tails text), isPrefixOf sub suffix]`",
      solution: hs`import Data.List

findSubstrings :: String -> String -> [Int]
findSubstrings sub text = [i | (i, suffix) <- zip [0 ..] (tails text), isPrefixOf sub suffix]
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2016, `addText` and `popAndAdd`, 1 mark each). The XML type, `addChild` (adds a child at the right-hand end of an element's children) and `sentinel` are given. A `Stack` is a list of elements, top first.",
        "",
        "- `addText s stack` adds `Text s` to the children of the element on top of the stack.",
        "- `popAndAdd stack` removes the top element and adds it to the children of the element below it.",
        "",
        "```",
        "popAndAdd [x1, Element \"ab\" [(\"a\",\"1\")] [], sentinel]",
        "  == [Element \"ab\" [(\"a\",\"1\")] [Element \"a\" [] [Text \"A\"]], sentinel]",
        "```",
      ),
      setup: xmlBase,
      starter: hs`addText :: String -> Stack -> Stack
addText s stack = undefined

popAndAdd :: Stack -> Stack
popAndAdd stack = undefined
`,
      tests: [
        { expr: 'popAndAdd [x1, Element "ab" [("a","1")] [], sentinel]', expected: '[Element "ab" [("a","1")] [Element "a" [] [Text "A"]], sentinel]' },
        { expr: 'addText "hi" [sentinel]', expected: '[Element "" [] [Text "hi"]]' },
        { expr: 'addText "B" [x1, sentinel]', expected: '[Element "a" [] [Text "A", Text "B"], sentinel]' },
        { expr: "popAndAdd [x1, sentinel]", expected: '[Element "" [] [x1]]' },
      ],
      hint: "Pattern match on the stack: `(top : rest)` for `addText`, `(top : next : rest)` for `popAndAdd`, and use `addChild`.",
      solution: stackOpsSolution,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2016, `parseAttributes`, 3 marks). `skipSpace` and `parseName` are given. Parse an attribute list ending in `>`, allowing extra whitespace around `=` and after the closing quote. Return the attributes and the text after the `>`.",
        "",
        "```",
        "parseAttributes \"a = \\\"0\\\" b = \\\"1\\\" >rest of text\"",
        "  == ([(\"a\",\"0\"),(\"b\",\"1\")], \"rest of text\")",
        "```",
      ),
      setup: xmlBase,
      starter: hs`parseAttributes :: String -> (Attributes, String)
parseAttributes s = undefined
`,
      tests: [
        { expr: "parseAttributes \"x=\\\"7\\\">rest of text\"", expected: '([("x","7")], "rest of text")' },
        { expr: "parseAttributes \"a = \\\"0\\\" b = \\\"1\\\" >rest of text\"", expected: '([("a","0"),("b","1")], "rest of text")' },
        { expr: 'parseAttributes ">"', expected: '([], "")' },
        { expr: "parseAttributes \"  id=\\\"\\\"  >x\"", expected: '([("id","")], "x")' },
        { expr: "parseAttributes \"title=\\\"Casablanca\\\">\\n <d>\"", expected: '([("title","Casablanca")], "\\n <d>")' },
      ],
      hint: "Skip whitespace. On `'>' : rest` return `([], rest)`. Otherwise: name with `parseName`, skip spaces, `=`, spaces and the opening quote, `break (== '\"')` for the value, skip the closing quote and recurse.",
      solution: parseAttributesSolution,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2016, `parse'`, 7 marks). `parse s = parse' (skipSpace s) [sentinel]` is given, along with `addText`, `popAndAdd`, `parseAttributes`, `parseName` and test strings `s1`, `s2`, `casablanca`. Write `parse'` using the spec's rules, in this order:",
        "",
        "1. Empty input: the result is the first child of the element on top of the stack.",
        "2. Starts with `</`: skip up to and including the next `>`, pop the top element and add it to the one below (`popAndAdd`), and recurse.",
        "3. Starts with `<`: read the name (`parseName`) and attributes (`parseAttributes`, which also consumes the `>`), push `Element name attributes []`, and recurse.",
        "4. Otherwise: read text up to (not including) the next `<`, add it with `addText`, and recurse.",
      ),
      setup: xmlBase + "\n" + stackOpsSolution + "\n" + parseAttributesSolution + xmlStrings,
      starter: hs`parse' :: String -> Stack -> XML
parse' s stack = undefined
`,
      tests: [
        { expr: "parse s1", expected: 'Element "a" [] [Text "A"]' },
        { expr: "parse s2", expected: 'Element "a" [("x","1")] [Element "b" [] [Text "A"], Element "b" [] [Text "B"]]' },
        { expr: "parse casablanca", expected: "casablancaParsed" },
        { expr: 'parse "  <e></e>"', expected: 'Element "e" [] []' },
        { expr: 'parse "<p>x<b>y</b>z</p>"', expected: 'Element "p" [] [Text "x", Element "b" [] [Text "y"], Text "z"]' },
      ],
      hint: "Four equations in rule order. Rule 1: `parse' \"\" (Element _ _ (child : _) : _) = child`. Rule 2: `parse' ('<' : '/' : rest) stack = parse' (drop 1 (dropWhile (/= '>') rest)) (popAndAdd stack)`. Rules 3 and 4 use `where` to split the input.",
      solution: hs`parse' :: String -> Stack -> XML
parse' "" (Element _ _ (child : _) : _) = child
parse' ('<' : '/' : rest) stack = parse' (drop 1 (dropWhile (/= '>') rest)) (popAndAdd stack)
parse' ('<' : rest) stack = parse' rest' (Element name attrs [] : stack)
  where
    (name, afterName) = parseName rest
    (attrs, rest') = parseAttributes afterName
parse' s stack = parse' rest (addText text stack)
  where
    (text, rest) = break (== '<') s
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// 18. Exam technique
// ---------------------------------------------------------------------------

const examcraft: Lesson = {
  id: "examcraft",
  title: "Exam technique",
  blurb: "Read the spec, keep the file compiling, test as you go, spend time where the marks are, and dodge the autotester's traps.",
  steps: [
    {
      k: "read",
      body: md(
        "Knowing Haskell gets you most of the marks. Exam technique gets you the rest. Here is what the January test looks like (2024 as the model):",
        "",
        "- Three hours, about 30 marks, split into Parts I, II and III.",
        "- A spec (the PDF) describes a problem and gives the data types. A template file gives you those types, some test data, and a stub for each function you must write.",
        "- You work in one file (2024: `Int.hs`). You must not edit the other given files; any changes are reverted.",
        "- Your functions are autotested: the tester calls them with exactly the given type and compares the result with the expected answer.",
        "- 2024's rule: \"comment out any code that does not compile before you complete the test. There will be a TWO MARK PENALTY applied to any program that does not compile.\"",
        "- Marks are also given for style: clarity and sensible use of list comprehensions, higher-order functions and so on.",
      ),
    },
    {
      k: "read",
      body: md(
        "Read the spec actively. For each question, find:",
        "",
        "1. The type signature. It tells you the inputs and output, and it's not negotiable.",
        "2. The examples. They are the tests in disguise. Copy them into GHCi later.",
        "3. Preconditions: \"you may assume\", \"a precondition is that...\". You don't need to handle the other cases.",
        "4. Representation rules: \"the constant 0 is represented by `[(0,0)]`\", \"terms in decreasing order of exponent\". Breaking these fails tests even if your maths is right.",
        "5. Hints and \"Using X above, or otherwise\". The examiners are telling you which earlier function makes this one easy.",
        "6. Notes like \"the order of the elements is unimportant\". That means the tests will accept any order, so don't waste time sorting.",
        "7. The marks. A 1-mark question should take a few minutes; a 7-mark one deserves real time.",
      ),
    },
    {
      k: "quiz",
      q: "2020's spec says of `replace :: Int -> [a] -> a -> [a]`: \"A precondition is that the index is less than the length of the list.\" What does that mean for you?",
      options: [
        "You must return an error message if the index is too big",
        "You must check the index and return the list unchanged if it's too big",
        "You can assume the index is valid; the tests will never use a bad one, so you needn't handle that case",
        "You must use `length` in your answer",
      ],
      answer: 2,
      why: "A precondition is a promise about the inputs. Code that handles impossible cases wastes time (and can make your answer more cluttered, which costs style marks).",
    },
    {
      k: "quiz",
      q: "The spec says: \"The order of the elements in the resulting lists is unimportant.\" Your result is `[3,1,2]` but the example shows `[1,2,3]`. Should you sort it?",
      options: [
        "Yes, always match the example exactly",
        "No: the tests compare in an order-independent way, so any order is fine",
        "Yes, because sorted output gets style marks",
        "Only if the list has more than 3 elements",
      ],
      answer: 1,
      why: "When the spec says order doesn't matter, the tester checks in an order-independent way. When it doesn't say that, assume the order shown in the examples is required.",
    },
    {
      k: "read",
      body: md(
        "The template looks something like this:",
        "",
        "```",
        "addP :: Polynomial -> Polynomial -> Polynomial",
        "addP = undefined",
        "",
        "mulP :: Polynomial -> Polynomial -> Polynomial",
        "mulP = undefined",
        "```",
        "",
        "`undefined` has every type, so the file compiles before you've written anything. It only crashes if it's actually run. That gives you three golden rules:",
        "",
        "1. Never change a given type signature. The tester relies on it.",
        "2. Never delete a stub. If you can't do a function, leave `f = undefined` so the file still compiles and the other functions can be tested.",
        "3. Reload (`:r` in GHCi) after every small change. If it stops compiling, fix it now while you know which line you just touched.",
      ),
    },
    {
      k: "read",
      body: md(
        "If you run out of time halfway through a function and it won't compile, comment out your attempt and put the stub back:",
        "",
        "```",
        "{-",
        "intE (Mul e1 e2) = case applyICR e1 e2 of",
        "  Just r -> ...       -- half-finished, doesn't compile",
        "-}",
        "intE _ = Nothing",
        "```",
        "",
        "`{-` and `-}` comment out a whole block; `--` comments out the rest of a line. A commented-out attempt can still show the marker your thinking, and the file compiles. In the 2024 rules a file that doesn't compile costs 2 marks, and the autotester can only run code that compiles, so this matters more than any single function.",
      ),
    },
    {
      k: "quiz",
      q: "Ten minutes left. `diffE` is half-written and has a type error you can't find. What should you do?",
      options: [
        "Keep trying to fix it until time runs out",
        "Delete `diffE` entirely, including its type signature",
        "Comment out the broken equations, leave `diffE = undefined` (or the parts that do compile) so the file compiles, then reload to check",
        "Submit as it is; the markers will fix it",
      ],
      answer: 2,
      why: "A compiling file keeps every other function's marks and avoids the penalty. Deleting the signature can break other code that uses `diffE`. Always finish with `:r` showing no errors.",
    },
    {
      k: "read",
      body: md(
        "Test as you go. After writing each function, reload and run the spec's examples in GHCi:",
        "",
        "```",
        "*Main> :r",
        "*Main> addP p3 p4",
        "[(2 % 1,2),(1 % 1,1),((-2) % 1,0)]",
        "*Main> addP p3 p4 == [(2,2),(1,1),(-2,0)]",
        "True",
        "```",
        "",
        "Comparing with `==` is quicker and more reliable than reading output by eye. Then try the edge cases the spec mentions: the empty list, zero, a single element. Only then move on. A bug found now costs one minute; a bug found later, when other functions depend on this one, costs much more.",
      ),
    },
    {
      k: "read",
      body: md(
        "Spend your time where the marks are. Parts are usually ordered from easy to hard, but marks don't always follow difficulty:",
        "",
        "- Part I is usually several small utilities worth 1-3 marks each, often needing just a few lines. Do these first and carefully: they're the cheapest marks in the paper, and later parts use them.",
        "- In 2013 Part III was worth only 3 of 25 marks, and the spec itself advised finishing Parts I and II first.",
        "- In 2024 Part III (`intE`) was worth 10 marks but was \"considerably harder\", with much less hand-holding.",
        "",
        "If you're stuck on something for more than 10-15 minutes, leave the stub, move on, and come back. Partial credit is often available: in 2024, getting just the first three rules of `intE` working earns some of its marks.",
      ),
    },
    {
      k: "quiz",
      q: "You have 40 minutes left. You've skipped a 2-mark Part II function that looks routine, and Part III (3 marks) looks hard and you haven't started it. What's the best plan?",
      options: [
        "Start Part III, since it's worth more",
        "Do the 2-mark function first, test it, then attempt the easiest pieces of Part III",
        "Re-check Part I for 40 minutes",
        "Rewrite Part I in a nicer style",
      ],
      answer: 1,
      why: "Marks per minute: the routine 2-marker is nearly certain; the 3 hard marks are a gamble. Bank the sure marks, then grab whatever partial credit Part III offers.",
    },
    {
      k: "read",
      body: md(
        "\"Using X above, or otherwise\" is a gift. It tells you the intended solution reuses X:",
        "",
        "- 2024: `sumP` and `prodP` are one-line folds over `addP` and `mulP`.",
        "- 2020: \"Using `countOnes` above, or `popCount`, define `countOnesFrom`\".",
        "- 2016: \"Using `getChildren`, or otherwise, define `getChild`\".",
        "",
        "Reusing makes your answer shorter, more likely to be right (the earlier function is already tested), and better style. But be careful: if the earlier function is wrong, the error spreads. One more reason to test each function before moving on.",
      ),
    },
    {
      k: "write",
      body: md(
        "Practise reusing. `getChildren name xml` (given) returns the children of an element that have a given name. Using it, write 2016's `getChild` (2 marks): the first such child, or `Text \"\"` if there isn't one.",
      ),
      setup: hs`data XML = Text String | Element String [(String, String)] [XML]
  deriving (Eq, Show)

getChildren :: String -> XML -> [XML]
getChildren name (Element _ _ cs) = [c | c@(Element n _ _) <- cs, n == name]
getChildren _ _ = []

x2 :: XML
x2 = Element "a" [("x", "1")] [Element "b" [] [Text "A"], Element "b" [] [Text "B"]]
`,
      starter: hs`getChild :: String -> XML -> XML
getChild name xml = undefined
`,
      tests: [
        { expr: 'getChild "b" x2', expected: 'Element "b" [] [Text "A"]' },
        { expr: 'getChild "c" x2', expected: 'Text ""' },
        { expr: 'getChild "b" (Text "t")', expected: 'Text ""' },
        { expr: 'getChild "a" (Element "r" [] [Text "q", Element "a" [] []])', expected: 'Element "a" [] []' },
      ],
      hint: "`case getChildren name xml of` with `[]` giving `Text \"\"` and `(c : _)` giving `c`.",
      solution: hs`getChild :: String -> XML -> XML
getChild name xml =
  case getChildren name xml of
    [] -> Text ""
    (c : _) -> c
`,
    },
    {
      k: "read",
      body: md(
        "Autotester traps: your code \"works\" but the test fails anyway. The common ones:",
        "",
        "1. Order of output: the spec's example lists things in a particular order and doesn't say order is unimportant.",
        "2. Exact strings: `\"Fail\"` is not `\"fail\"`; an extra space or a missing newline fails. And `show` on a String adds quote marks.",
        "3. The wrong number type: the spec's output shows `1 % 2` (a Rational) but you produce `0.5` (a Double), or your `Int` overflows where `Integer` was needed.",
        "4. Off-by-one: is the first index 0 or 1? Does \"up to n\" include n?",
        "5. Missing base cases: the tests nearly always include the empty list, 0, or the smallest case.",
        "6. Partial functions: `head`, `tail`, `maximum`, `!!` and `fromJust` crash on empty or missing input.",
        "7. Representation rules: `[(0,0)]` rather than `[]` for the zero polynomial (2024).",
      ),
    },
    {
      k: "predict",
      expr: "show \"hi\"",
      answer: "\"\\\"hi\\\"\"",
      why: "`show` on a String gives a new String that contains the quote marks themselves: 4 characters, `\"hi\"`. GHCi then displays that with escaped quotes. So if a spec wants `x=3`, building it with `show name` gives `\"x\"=3`. Use the String itself; use `show` only on numbers and other values.",
    },
    {
      k: "quiz",
      q: "2024's spec shows `intT (2,3)` giving `(1 % 2,4)`. Your `intT` returns `(0.5, 4)` as a `(Double, Integer)`. What happens?",
      options: [
        "Passes; 0.5 and 1/2 are equal",
        "It won't even compile against the given type `Term -> Term`, where `Term = (Rational, Integer)`",
        "Passes with a warning",
        "Fails only if the tester prints the result",
      ],
      answer: 1,
      why: "The type is fixed by the spec. If you changed the signature to make your version compile, the tester's code wouldn't compile against it. Use `/` on Rationals and `fromIntegral` to convert Integers.",
    },
    {
      k: "write",
      body: md(
        "Fix the order bug. The spec says: `frequencies s` gives each character of `s` with its number of occurrences, in alphabetical order of character.",
        "",
        "```",
        "frequencies \"banana\" == [('a',3),('b',1),('n',2)]",
        "```",
        "",
        "The starter gives the characters in order of first appearance.",
      ),
      starter: hs`import Data.List

frequencies :: String -> [(Char, Int)]
frequencies s = [(c, length (filter (== c) s)) | c <- nub s]
`,
      tests: [
        { expr: 'frequencies "banana"', expected: "[('a',3),('b',1),('n',2)]" },
        { expr: 'frequencies ""', expected: "[]" },
        { expr: 'frequencies "cab"', expected: "[('a',1),('b',1),('c',1)]" },
        { expr: 'frequencies "zzz"', expected: "[('z',3)]" },
      ],
      hint: "Sort the distinct characters: `c <- sort (nub s)`.",
      solution: hs`import Data.List

frequencies :: String -> [(Char, Int)]
frequencies s = [(c, length (filter (== c) s)) | c <- sort (nub s)]
`,
    },
    {
      k: "write",
      body: md(
        "Fix the off-by-one bug in 2020's `replace` (3 marks): replace the item at index `n` (counting from 0) with `y`.",
        "",
        "```",
        "replace 0 \"trie\" 'b' == \"brie\"",
        "replace 3 \"trie\" 'p' == \"trip\"",
        "```",
      ),
      starter: hs`replace :: Int -> [a] -> a -> [a]
replace n xs y = take (n - 1) xs ++ [y] ++ drop n xs
`,
      tests: [
        { expr: "replace 0 \"trie\" 'b'", expected: '"brie"' },
        { expr: "replace 3 \"trie\" 'p'", expected: '"trip"' },
        { expr: "replace 1 \"trie\" 'h'", expected: '"thie"' },
        { expr: "replace 0 [5] 9", expected: "[9]" },
      ],
      hint: "Before index `n` there are exactly `n` items, and after it everything from index `n + 1`.",
      solution: hs`replace :: Int -> [a] -> a -> [a]
replace n xs y = take n xs ++ [y] ++ drop (n + 1) xs
`,
    },
    {
      k: "write",
      body: md(
        "Fix the missing base case. `pairsUp` pairs each element with the next one: `pairsUp [1,2,3] == [(1,2),(2,3)]`. The tests include the empty list.",
      ),
      starter: hs`pairsUp :: [a] -> [(a, a)]
pairsUp (x : y : rest) = (x, y) : pairsUp (y : rest)
pairsUp [x] = []
`,
      tests: [
        { expr: "pairsUp [1,2,3]", expected: "[(1,2),(2,3)]" },
        { expr: "pairsUp [7]", expected: "[]" },
        { expr: "pairsUp ([] :: [Int])", expected: "[]" },
        { expr: 'pairsUp "ab"', expected: "[('a','b')]" },
      ],
      hint: "Replace `pairsUp [x] = []` with a catch-all `pairsUp _ = []`, which covers both the one-element and the empty list.",
      solution: hs`pairsUp :: [a] -> [(a, a)]
pairsUp (x : y : rest) = (x, y) : pairsUp (y : rest)
pairsUp _ = []
`,
    },
    {
      k: "write",
      body: md(
        "Fix the partial function. The spec says: `bestScore` gives the highest score in a list of `(name, score)` pairs, or 0 if the list is empty. The starter crashes on `[]` because `maximum` has no answer for an empty list.",
      ),
      starter: hs`bestScore :: [(String, Int)] -> Int
bestScore scores = maximum (map snd scores)
`,
      tests: [
        { expr: 'bestScore [("a", 3), ("b", 9), ("c", 4)]', expected: "9" },
        { expr: "bestScore []", expected: "0" },
        { expr: 'bestScore [("x", -5)]', expected: "-5" },
        { expr: 'bestScore [("x", 0), ("y", 0)]', expected: "0" },
      ],
      hint: "Add an equation for `[]` before the general one.",
      solution: hs`bestScore :: [(String, Int)] -> Int
bestScore [] = 0
bestScore scores = maximum (map snd scores)
`,
    },
    {
      k: "write",
      body: md(
        "Fix the exact-output bug. The spec says terms are shown like this:",
        "",
        "```",
        "showTerm (3,2) == \"3x^2\"",
        "showTerm (5,1) == \"5x\"",
        "showTerm (7,0) == \"7\"",
        "```",
        "",
        "The starter only gets the first one right.",
      ),
      starter: hs`showTerm :: (Int, Int) -> String
showTerm (c, e) = show c ++ "x^" ++ show e
`,
      tests: [
        { expr: "showTerm (3,2)", expected: '"3x^2"' },
        { expr: "showTerm (5,1)", expected: '"5x"' },
        { expr: "showTerm (7,0)", expected: '"7"' },
        { expr: "showTerm (-1,4)", expected: '"-1x^4"' },
      ],
      hint: "Add equations for exponent 0 and exponent 1 before the general case.",
      solution: hs`showTerm :: (Int, Int) -> String
showTerm (c, 0) = show c
showTerm (c, 1) = show c ++ "x"
showTerm (c, e) = show c ++ "x^" ++ show e
`,
    },
    {
      k: "read",
      body: md(
        "Reading GHC's error messages. They look long, but you only need three things: the file, line and column at the start (`Int.hs:42:17:`), the first sentence, and the code GHC quotes.",
        "",
        "The ones you'll see most:",
        "",
        "```",
        "Couldn't match expected type 'X' with actual type 'Y'",
        "    You gave a Y where a X was needed.",
        "Variable not in scope: lenght",
        "    A typo, a missing import, or a function you haven't written yet.",
        "No instance for (Num Bool) / No instance for (Fractional Int)",
        "    You used an operation on a type that doesn't support it.",
        "Non-exhaustive patterns in function f",
        "    (at runtime) f was called with an input none of its equations match.",
        "```",
        "",
        "Fix the first error first; later errors are often caused by it.",
      ),
    },
    {
      k: "try",
      code: "not 'a'",
      expectError: true,
      after: "\"Couldn't match expected type 'Bool' with actual type 'Char'\": `not` wanted a Bool, and you gave it the Char `'a'`.",
    },
    {
      k: "try",
      code: "lenght [1, 2, 3]",
      expectError: true,
      after: "\"Variable not in scope: lenght\", and GHC even suggests `length`. Read the suggestions; they're often right.",
    },
    {
      k: "try",
      code: "True + 1",
      expectError: true,
      after: "\"No instance for (Num Bool)\": you can't do arithmetic on Bools. When you see `No instance for (Something T)`, ask what operation needs `Something`, and why `T` ended up there.",
    },
    {
      k: "try",
      code: "let f (x : _) = x in f ([] :: [Int])",
      expectError: true,
      after: "This one compiles but crashes when it runs: \"Non-exhaustive patterns in function f\". `f` has no equation for `[]`. This is the error the autotester triggers with its edge-case tests.",
    },
    {
      k: "quiz",
      q: "You see `Couldn't match expected type 'Double' with actual type 'Int'` on the line `avg xs = sum xs / length xs` (where `xs :: [Int]` and `avg` returns a Double). What's the fix?",
      options: [
        "Change the spec's type to return Int",
        "Wrap the Ints in `fromIntegral`: `fromIntegral (sum xs) / fromIntegral (length xs)`",
        "Use `div` and keep the Double type",
        "Add `:: Double` at the end of the line",
      ],
      answer: 1,
      why: "Ints never turn into Doubles by themselves. `fromIntegral` is the converter, and the spec's type must stay as it is.",
    },
    {
      k: "quiz",
      q: "An autotest reports `Non-exhaustive patterns in function go`. What's the most likely cause?",
      options: [
        "A type error in `go`",
        "`go` has no equation for some input the test used, typically `[]` or a constructor you forgot",
        "`go` is too slow",
        "You forgot to import `Data.List`",
      ],
      answer: 1,
      why: "It's a runtime error, so your code compiled. Find `go` and ask which inputs no equation matches. Turning on warnings (`:set -Wall`) makes GHC point these out before you run anything.",
    },
    {
      k: "read",
      body: md(
        "Your exam-day checklist:",
        "",
        "1. Read the whole spec once (10 minutes) before writing code. Note the marks for each part.",
        "2. For each function: read its examples, write the equations, `:r`, run the examples with `==`, try the edge cases.",
        "3. Reuse earlier functions whenever the spec hints at it.",
        "4. Stuck for 15 minutes? Leave the stub, move on, come back later.",
        "5. Every half hour, and in the last 10 minutes: make sure the file compiles. Comment out anything that doesn't.",
        "6. If you have time left over, tidy your code for style marks: clear names, comprehensions and higher-order functions instead of long hand-written recursion.",
      ),
    },
  ],
};

const drillExamcraft: DrillSet = {
  id: "drill-examcraft",
  lesson: "examcraft",
  title: "Exam technique: drills",
  drills: [
    {
      k: "quiz",
      q: "Five minutes before the end, what matters most about your file?",
      options: ["That every function is attempted", "That it compiles", "That it has comments", "That it uses `where` everywhere"],
      answer: 1,
      why: "A non-compiling file costs a penalty (2 marks in 2024) and the autotester can only run code that compiles. Comment out anything broken.",
    },
    {
      k: "quiz",
      q: "What does `f = undefined` in the template do for you?",
      options: [
        "It makes `f` return a default value",
        "It lets the file compile before you've written `f`; it only crashes if `f` is actually called",
        "It tells the autotester to skip `f` and give full marks",
        "Nothing; you should delete it",
      ],
      answer: 1,
      why: "`undefined` fits any type. Keep a stub for every function you haven't finished.",
    },
    {
      k: "predict",
      expr: "show \"x\" ++ \"=\" ++ show 3",
      answer: "\"\\\"x\\\"=3\"",
      why: "`show \"x\"` keeps the quote marks, so the result is `\"x\"=3` with quotes around the x. To get `x=3`, write `\"x\" ++ \"=\" ++ show 3`.",
    },
    {
      k: "quiz",
      q: "The spec says \"Using `getChildren`, or otherwise, define `getChild`\". What does \"or otherwise\" mean?",
      options: [
        "You must not use `getChildren`",
        "Any correct method gets the marks, but reusing `getChildren` is the intended (and usually easiest) way",
        "You get a bonus mark for not using it",
        "You must define `getChildren` again",
      ],
      answer: 1,
      why: "It's a hint, not a restriction. Following it is usually shorter and better style.",
    },
    {
      k: "predict",
      expr: "[1, 2, 3] == [3, 2, 1]",
      answer: "False",
      why: "List equality cares about order. If the spec doesn't say order is unimportant, your output order must match.",
    },
    {
      k: "predict",
      expr: "sort [3, 1, 2] == sort [2, 3, 1]",
      answer: "True",
      why: "Sorting both sides is how you compare results in GHCi when the spec says order doesn't matter.",
    },
    {
      k: "quiz",
      q: "GHC says: `Variable not in scope: nub`. What's the likely fix?",
      options: [
        "Define `nub` yourself",
        "Add `import Data.List` at the top of the file",
        "Rename the function",
        "Add a type signature",
      ],
      answer: 1,
      why: "`nub`, `sort`, `sortBy`, `insert` and friends live in `Data.List`; `fromMaybe` and `mapMaybe` in `Data.Maybe`; `isDigit` and `isSpace` in `Data.Char`.",
    },
    {
      k: "write",
      body: md(
        "Fix the bug. Spec: `average :: [Int] -> Double` gives the mean, with `average [1,2] == 1.5` and `average [] == 0`.",
      ),
      starter: hs`average :: [Int] -> Double
average [] = 0
average xs = fromIntegral (div (sum xs) (length xs))
`,
      tests: [
        { expr: "average [1,2]", expected: "1.5" },
        { expr: "average [2,4]", expected: "3.0" },
        { expr: "average []", expected: "0.0" },
        { expr: "average [1,1,2]", expected: "4 / 3" },
      ],
      hint: "`div` throws away the fraction before the conversion. Convert first, then use `/`.",
      solution: hs`average :: [Int] -> Double
average [] = 0
average xs = fromIntegral (sum xs) / fromIntegral (length xs)
`,
    },
    {
      k: "quiz",
      q: "GHC says: `No instance for (Fractional Int) arising from a use of '/'`. What happened?",
      options: [
        "You divided by zero",
        "You used `/` on Ints; use `div` for whole-number division, or convert with `fromIntegral` if you want a fractional answer",
        "You forgot `import Data.Ratio`",
        "You need `Integer` instead of `Int`",
      ],
      answer: 1,
      why: "`/` needs a Fractional type (Double, Rational). Ints only support `div`.",
    },
    {
      k: "predict",
      expr: "tails \"ab\"",
      answer: "[\"ab\", \"b\", \"\"]",
      why: "`tails` includes the empty list at the end. If a spec's example doesn't show `\"\"` (like 2010's `suffixes \"perl\" == [\"perl\",\"erl\",\"rl\",\"l\"]`), using `tails` directly fails the test.",
    },
    {
      k: "quiz",
      q: "GHC says: `Couldn't match expected type '[Int]' with actual type 'Maybe [Int]'`. What's the likely cause?",
      options: [
        "You need to sort the list",
        "You used the result of something like `lookup` directly, without dealing with the `Nothing` case",
        "The list is empty",
        "You forgot `deriving Show`",
      ],
      answer: 1,
      why: "The value is still wrapped in a Maybe. Unwrap it with `case`, `fromMaybe`, or `<-` in a do block.",
    },
    {
      k: "write",
      body: md(
        "Fix the bug. Spec: `positions c s` gives the indices (from 0) where character `c` appears in `s`, in ascending order.",
      ),
      starter: hs`positions :: Char -> String -> [Int]
positions c s = go 0 s []
  where
    go _ [] acc = acc
    go i (x : xs) acc = go (i + 1) xs (if x == c then i : acc else acc)
`,
      tests: [
        { expr: "positions 'a' \"banana\"", expected: "[1,3,5]" },
        { expr: "positions 'z' \"banana\"", expected: "[]" },
        { expr: "positions 'b' \"banana\"", expected: "[0]" },
        { expr: "positions 'x' \"xx\"", expected: "[0,1]" },
      ],
      hint: "The accumulator collects indices newest-first. Reverse it at the end, or rewrite as `[i | (i, x) <- zip [0 ..] s, x == c]`.",
      solution: hs`positions :: Char -> String -> [Int]
positions c s = [i | (i, x) <- zip [0 ..] s, x == c]
`,
    },
    {
      k: "predict",
      expr: "length [0 .. 4]",
      answer: "5",
      why: "Ranges include both ends: 0, 1, 2, 3, 4. A classic off-by-one source.",
    },
    {
      k: "quiz",
      q: "An autotest fails with `Prelude.head: empty list`. What should you look for?",
      options: [
        "A missing import",
        "A place where `head` is used on a list that can be empty, often a missing `[]` case or an empty search result",
        "A type error",
        "An infinite loop",
      ],
      answer: 1,
      why: "`head`, `tail`, `maximum`, `minimum`, `!!` and `fromJust` are partial: they crash on some inputs. Pattern match or guard instead.",
    },
    {
      k: "write",
      body: md(
        "Fix the bug. Spec: `area` gives the area of any shape. A test with a `Triangle` crashes with \"Non-exhaustive patterns\".",
      ),
      setup: hs`data Shape = Circle Double | Rect Double Double | Triangle Double Double
  deriving (Eq, Show)
`,
      starter: hs`area :: Shape -> Double
area (Circle r) = pi * r * r
area (Rect w h) = w * h
`,
      tests: [
        { expr: "area (Rect 2 3)", expected: "6.0" },
        { expr: "area (Triangle 4 5)", expected: "10.0" },
        { expr: "area (Circle 1)", expected: "pi" },
        { expr: "area (Triangle 1 1)", expected: "0.5" },
      ],
      hint: "Add the missing equation: a triangle with base `b` and height `h` has area `b * h / 2`.",
      solution: hs`area :: Shape -> Double
area (Circle r) = pi * r * r
area (Rect w h) = w * h
area (Triangle b h) = b * h / 2
`,
    },
    {
      k: "predict",
      expr: "drop 2 \"trie\"",
      answer: "\"ie\"",
      why: "`drop n` removes the first n items, which are the ones at indices 0 to n − 1. So `drop 2` starts at index 2.",
    },
    {
      k: "quiz",
      q: "You've been stuck on one 2-mark function for 20 minutes. There are 5 untouched questions after it. What's the best move?",
      options: [
        "Keep going; you're close",
        "Leave its stub (or a compiling partial answer), move on, and come back if there's time",
        "Delete it",
        "Start again from scratch on the same function",
      ],
      answer: 1,
      why: "Marks per minute. Later questions are often independent, or the spec gives you what they need. Come back with fresh eyes.",
    },
    {
      k: "write",
      body: md(
        "Fix the bug. Spec: `label name n` gives a label like `label \"x\" 3 == \"x=3\"`.",
      ),
      starter: hs`label :: String -> Int -> String
label name n = show name ++ "=" ++ show n
`,
      tests: [
        { expr: 'label "x" 3', expected: '"x=3"' },
        { expr: 'label "count" 10', expected: '"count=10"' },
        { expr: 'label "" 0', expected: '"=0"' },
        { expr: 'label "y" (-2)', expected: '"y=-2"' },
      ],
      hint: "`name` is already a String; `show` adds quote marks to it.",
      solution: hs`label :: String -> Int -> String
label name n = name ++ "=" ++ show n
`,
    },
    {
      k: "predict",
      expr: "show (1 % 2 :: Rational)",
      answer: "\"1 % 2\"",
      why: "That's how GHCi shows a Rational. When a spec's example shows `%`, the result must be a Rational, not a Double.",
    },
    {
      k: "quiz",
      q: "After you reload, GHC lists 6 errors. Where should you start?",
      options: ["The last one", "The first one", "Whichever looks easiest", "Ignore them and keep writing"],
      answer: 1,
      why: "Later errors are often knock-on effects of the first. Fix it, reload, and see what's left.",
    },
    {
      k: "write",
      body: md(
        "Exam-style (2020, `insertAt`, 3 marks). Fix the bug. Spec: `insertAt n x xs` inserts `x` at index `n` (precondition: `n` is at most the length of the list).",
        "",
        "```",
        "insertAt 3 'p' \"trie\" == \"tripe\"",
        "insertAt 4 's' \"trie\" == \"tries\"",
        "```",
      ),
      starter: hs`insertAt :: Int -> a -> [a] -> [a]
insertAt n x xs = take (n + 1) xs ++ [x] ++ drop (n + 1) xs
`,
      tests: [
        { expr: "insertAt 3 'p' \"trie\"", expected: '"tripe"' },
        { expr: "insertAt 4 's' \"trie\"", expected: '"tries"' },
        { expr: "insertAt 0 'a' \"bc\"", expected: '"abc"' },
        { expr: "insertAt 0 1 []", expected: "[1]" },
      ],
      hint: "The new item goes after exactly `n` old items. Use `splitAt n xs`, or `take n` and `drop n`.",
      solution: hs`insertAt :: Int -> a -> [a] -> [a]
insertAt n x xs = before ++ x : after
  where
    (before, after) = splitAt n xs
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2024, `diffT`). Fix the bug. The spec's examples:",
        "",
        "```",
        "diffT (1,0) == (0 % 1,0)",
        "diffT (2,3) == (6 % 1,2)",
        "```",
      ),
      setup: hs`import Data.Ratio ((%))

type Term = (Rational, Integer)
`,
      starter: hs`diffT :: Term -> Term
diffT (c, e) = (c * fromIntegral e, e - 1)
`,
      tests: [
        { expr: "diffT (1,0)", expected: "(0,0)" },
        { expr: "diffT (2,3)", expected: "(6,2)" },
        { expr: "diffT (5 % 2, 0)", expected: "(0,0)" },
        { expr: "diffT (1 % 3, 1)", expected: "(1 % 3, 0)" },
      ],
      hint: "The derivative of a constant should be `(0,0)`, but the starter gives exponent −1. Add an equation for exponent 0 first.",
      solution: hs`diffT :: Term -> Term
diffT (_, 0) = (0, 0)
diffT (c, e) = (c * fromIntegral e, e - 1)
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2010, `suffixes`, 4 marks). Fix the bug. Spec: `suffixes` gives all suffixes of a list in descending order of length, for example `suffixes \"perl\" == [\"perl\",\"erl\",\"rl\",\"l\"]`.",
      ),
      starter: hs`import Data.List

suffixes :: [a] -> [[a]]
suffixes xs = tails xs
`,
      tests: [
        { expr: 'suffixes "perl"', expected: '["perl","erl","rl","l"]' },
        { expr: 'suffixes "a"', expected: '["a"]' },
        { expr: "suffixes ([] :: [Int])", expected: "[]" },
        { expr: "suffixes [1,2]", expected: "[[1,2],[2]]" },
      ],
      hint: "`tails` includes the empty list at the end, which the spec doesn't. Drop it: `init (tails xs)`, or `takeWhile (not . null) (iterate tail xs)`.",
      solution: hs`import Data.List

suffixes :: [a] -> [[a]]
suffixes xs = init (tails xs)
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2016, `getChild`, 2 marks). Fix the bug. Spec: the first child of an element with the given name, or `Text \"\"` if there's no such child. `getChildren` is given. The starter crashes when there's no match.",
      ),
      setup: hs`data XML = Text String | Element String [(String, String)] [XML]
  deriving (Eq, Show)

getChildren :: String -> XML -> [XML]
getChildren name (Element _ _ cs) = [c | c@(Element n _ _) <- cs, n == name]
getChildren _ _ = []

x2 :: XML
x2 = Element "a" [("x", "1")] [Element "b" [] [Text "A"], Element "b" [] [Text "B"]]
`,
      starter: hs`getChild :: String -> XML -> XML
getChild name xml = head (getChildren name xml)
`,
      tests: [
        { expr: 'getChild "b" x2', expected: 'Element "b" [] [Text "A"]' },
        { expr: 'getChild "c" x2', expected: 'Text ""' },
        { expr: 'getChild "b" (Text "t")', expected: 'Text ""' },
        { expr: 'getChild "x" (Element "r" [] [])', expected: 'Text ""' },
      ],
      hint: "Replace `head` with a `case` that handles the empty list.",
      solution: hs`getChild :: String -> XML -> XML
getChild name xml =
  case getChildren name xml of
    [] -> Text ""
    (c : _) -> c
`,
    },
    {
      k: "write",
      body: md(
        "Exam-style (2024, `addP`). Fix the bug. Polynomials are `[(coefficient, exponent)]` in decreasing exponent order, with no zero coefficients, and the zero polynomial is `[(0,0)]`. The starter's merge is right, but it gets the zero cases wrong.",
      ),
      setup: hs`import Data.Ratio ((%))

type Polynomial = [(Rational, Integer)]
`,
      starter: hs`addP :: Polynomial -> Polynomial -> Polynomial
addP [] q = q
addP p [] = p
addP ((c1, e1) : p) ((c2, e2) : q)
  | e1 > e2 = (c1, e1) : addP p ((c2, e2) : q)
  | e1 < e2 = (c2, e2) : addP ((c1, e1) : p) q
  | otherwise = (c1 + c2, e1) : addP p q
`,
      tests: [
        { expr: "addP [(2,2),(-3,1),(1,0)] [(4,1),(-3,0)]", expected: "[(2,2),(1,1),(-2,0)]" },
        { expr: "addP [(1,2)] [(-1,2)]", expected: "[(0,0)]" },
        { expr: "addP [(1,1)] [(0,0)]", expected: "[(1,1)]" },
        { expr: "addP [(1,3),(1,0)] [(-1,0)]", expected: "[(1,3)]" },
        { expr: "addP [(0,0)] [(0,0)]", expected: "[(0,0)]" },
      ],
      hint: "Keep the merge as a helper, then filter out zero coefficients, and turn an empty result into `[(0,0)]`.",
      solution: hs`addP :: Polynomial -> Polynomial -> Polynomial
addP p q
  | null terms = [(0, 0)]
  | otherwise = terms
  where
    terms = filter (\(c, _) -> c /= 0) (merge p q)
    merge [] ys = ys
    merge xs [] = xs
    merge ((c1, e1) : xs) ((c2, e2) : ys)
      | e1 > e2 = (c1, e1) : merge xs ((c2, e2) : ys)
      | e1 < e2 = (c2, e2) : merge ((c1, e1) : xs) ys
      | otherwise = (c1 + c2, e1) : merge xs ys
`,
    },
  ],
};

export const lessons: Lesson[] = [fixpoint, merging, maybeplumbing, numbers, parsing, examcraft];
export const drills: DrillSet[] = [drillFixpoint, drillMerging, drillMaybe, drillNumbers, drillParsing, drillExamcraft];
