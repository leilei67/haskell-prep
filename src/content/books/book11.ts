import { type Book, type DrillSet, hs, md } from "../schema.ts";

const maybe = hs`import Data.Maybe (fromMaybe, fromJust)
`;

const listy = hs`import Data.List (nub, sort)
`;

const calcSetup = hs`data Calc = C Int | Plus Calc Calc | Minus Calc Calc | Times Calc Calc
  deriving (Eq, Show)

c1 :: Calc
c1 = Plus (C 2) (Times (C 3) (C 4))

c2 :: Calc
c2 = Minus (Times (C 5) (C 2)) (C 3)

c3 :: Calc
c3 = Times (Plus (C 1) (C 1)) (Minus (C 4) (C 1))
`;

const arithSetup = hs`import Data.Maybe (fromJust)

type Name = String
type Env = [(Name, Int)]

data Arith = Lit Int | Use Name | Sum Arith Arith | Prod Arith Arith
  deriving (Eq, Show)

a1 :: Arith
a1 = Sum (Lit 1) (Prod (Use "n") (Lit 2))

a2 :: Arith
a2 = Prod (Use "x") (Use "y")

a3 :: Arith
a3 = Sum (Use "n") (Use "n")

envA :: Env
envA = [("n", 5), ("x", 3), ("y", 4)]
`;

const formulaSetup = hs`import Data.Maybe (fromJust)
import Data.List (nub, sort)

data Mix = Add | Sub | Mul
  deriving (Eq, Show)

data Formula = Amt Int
             | Name String
             | Join Mix Formula Formula
             | Bind String Formula Formula
  deriving (Eq, Show)
-- Bind x e body: work out e, then evaluate body with x standing for that value.

type Env = [(String, Int)]

f1 :: Formula
f1 = Bind "k" (Amt 6) (Join Mul (Name "k") (Name "n"))

f2 :: Formula
f2 = Bind "a" (Join Add (Name "b") (Amt 2)) (Bind "b" (Amt 9) (Join Sub (Name "a") (Name "b")))

f3 :: Formula
f3 = Join Add (Bind "x" (Amt 1) (Name "x")) (Name "x")
`;

const memSetup = hs`import Data.Maybe (fromMaybe, fromJust)

type Cell = String
type Memory = [(Cell, Int)]

data Patch = Write Cell Int | Bump Cell | Zero Cell | Copy Cell Cell
  deriving (Eq, Show)

mem0 :: Memory
mem0 = [("a", 1), ("b", 4)]

mem1 :: Memory
mem1 = [("p", 10), ("q", 0), ("r", 7)]
`;

const bugSetup = hs`data Dir = North | East | South | West
  deriving (Eq, Show)

type Pos = (Int, Int)
type Bug = (Pos, Dir)

data Step = Go Int | TurnL | TurnR | Back Int
  deriving (Eq, Show)

bug0 :: Bug
bug0 = ((0, 0), North)

-- North is (0, 1), East is (1, 0), South is (0, -1), West is (-1, 0).
-- TurnR from North faces East; TurnL from North faces West.
-- Go n walks n squares the way the bug faces. Back n walks n squares
-- the opposite way, without changing the heading.
`;

const stackSetup = hs`type Stack = [Int]
-- The top of the stack is the head of the list.

data Instr = Push Int | Add | Mul | Sub | Dup | Swap | Drop | Neg
  deriving (Eq, Show)

-- Push n puts n on top.
-- Add, Mul, Sub take the top two values: if the stack is (x : y : ys),
-- Add leaves (x + y) : ys, Mul leaves (x * y) : ys, Sub leaves (y - x) : ys
-- (so Push 5, Push 3, Sub computes 5 - 3).
-- Dup copies the top. Swap exchanges the top two. Drop throws the top away.
-- Neg negates the top.
`;

const bankSetup = hs`import Data.Maybe (fromMaybe)

type Pence = Int
type Bank = [(String, Pence)]

data Tx = Open String | Credit String Pence | Debit String Pence | Move String String Pence
  deriving (Eq, Show)

bank0 :: Bank
bank0 = [("ada", 100), ("ben", 40)]

bank1 :: Bank
bank1 = [("ada", 50), ("ben", 20), ("cy", 0)]
`;

const lineSetup = hs`import Data.Maybe (fromJust)

type Env = [(String, Int)]

data Atom = N Int | V String | Plus Atom Atom | Diff Atom Atom
  deriving (Eq, Show)

data Line = Store String Atom | Speak Atom | Skip
  deriving (Eq, Show)
-- Store x a  writes the value of a into x.
-- Speak a    outputs the value of a, without changing the environment.
-- Skip       does nothing.
`;

const vendSetup = hs`type Pence = Int
type Slot = String
type Prices = [(Slot, Pence)]
type Machine = (Pence, Prices)
-- The first component is credit inserted so far.

data Vend = Insert Pence | Choose Slot | CoinReturn
  deriving (Eq, Show)

prices0 :: Prices
prices0 = [("tea", 120), ("bun", 80), ("soup", 200)]

m0 :: Machine
m0 = (0, prices0)
`;

const ovenSetup = hs`data Heat = Off | Low | High
  deriving (Eq, Show)

type Oven = (Heat, Int)
-- heat setting, and minutes of remaining time

data Knob = SetHeat Heat | AddMins Int | Tick | Cancel
  deriving (Eq, Show)
-- Tick: if time is 0, heat becomes Off; otherwise time goes down by 1.
-- Cancel: heat Off and time 0.
`;

const givenEvalCalc = hs`
evalCalc :: Calc -> Int
evalCalc (C n) = n
evalCalc (Plus a b) = evalCalc a + evalCalc b
evalCalc (Minus a b) = evalCalc a - evalCalc b
evalCalc (Times a b) = evalCalc a * evalCalc b
`;

const givenWriteCell = hs`
writeCell :: Cell -> Int -> Memory -> Memory
writeCell c n mem = (c, n) : [p | p <- mem, fst p /= c]
`;

const givenTurn = hs`
turnR :: Dir -> Dir
turnR North = East
turnR East = South
turnR South = West
turnR West = North

turnL :: Dir -> Dir
turnL North = West
turnL West = South
turnL South = East
turnL East = North

delta :: Dir -> Pos
delta North = (0, 1)
delta East = (1, 0)
delta South = (0, -1)
delta West = (-1, 0)
`;

const givenStepBug = hs`
stepOne :: Bug -> Bug
stepOne ((x, y), d) = ((x + dx, y + dy), d)
  where
    (dx, dy) = delta d
`;

const givenRunStack = hs`
runStack :: [Instr] -> Stack -> Stack
runStack [] stk = stk
runStack (i : is) stk = runStack is (step i stk)

step :: Instr -> Stack -> Stack
step (Push n) stk = n : stk
step Add (x : y : ys) = (x + y) : ys
step Mul (x : y : ys) = (x * y) : ys
step Sub (x : y : ys) = (y - x) : ys
step Dup (x : xs) = x : x : xs
step Swap (x : y : ys) = y : x : ys
step Drop (_ : xs) = xs
step Neg (x : xs) = negate x : xs
step _ stk = stk
`;

// ---------------------------------------------------------------------------
// Level 1
// ---------------------------------------------------------------------------

const level1: DrillSet = {
  id: "b-interp-l1",
  lesson: "",
  level: 1,
  title: "Level 1: Warm-up",
  intro: md(
    "An interpreter is a Haskell function that **runs a tiny language**. The program is not a string; it is a value made of constructors. You walk the constructors, look names up in a list of pairs, and (when something changes) pass a new list on.",
    "",
    "```",
    "type Env = [(String, Int)]",
    "",
    "lookup \"x\" [(\"x\", 3), (\"y\", 5)]     -- Just 3",
    "(\"x\", 9) : env                       -- x is now 9, hiding the old x",
    "```",
    "",
    "When a step both **changes** something and **produces** a value, return a pair `(newState, result)`.",
  ),
  drills: [
    {
      k: "quiz",
      q: "In this book, what is an interpreter?",
      options: [
        "A program that turns Haskell into machine code",
        "A Haskell function that runs another tiny language, given as constructors",
        "A function that pretty-prints an expression",
        "GHCi itself",
      ],
      answer: 1,
      why: "The tiny program is a Haskell value (`Plus (C 1) (C 2)`, and so on). Your function says what that value computes. GHC compiling Haskell is a different job.",
    },
    {
      k: "quiz",
      q: "After `type Env = [(String, Int)]`, which statement is true?",
      options: [
        "`Env` is a new type with its own constructor",
        "`Env` is just another name for a list of (name, value) pairs",
        "You must write `Env \"x\" 3` to store a variable",
        "`lookup` will not work on an `Env`",
      ],
      answer: 1,
      why: "`type` only renames an existing type. Every list function still works. `data` is what would make a genuinely new type.",
    },
    {
      k: "predict",
      expr: 'lookup "b" [("a", 1), ("b", 2), ("b", 9)]',
      answer: "Just 2",
      why: "`lookup` stops at the first matching key. The later `(\"b\", 9)` is never seen.",
    },
    {
      k: "quiz",
      q: 'What does `lookup "z" [("x", 1)]` give?',
      options: ["`0`", "`Just 0`", "`Nothing`", "It crashes"],
      answer: 2,
      why: "A missing key is `Nothing`, not an error and not a default. You choose a default afterwards, for example with `fromMaybe`.",
    },
    {
      k: "predict",
      expr: 'fromMaybe 0 (lookup "z" [("x", 5)])',
      answer: "0",
      why: "`\"z\"` is missing, so `lookup` gives `Nothing`, and `fromMaybe 0` turns that into 0.",
    },
    {
      k: "quiz",
      q: "`data Calc = C Int | Plus Calc Calc | Minus Calc Calc | Times Calc Calc`. What is the type of the constructor `Plus`?",
      options: ["`Calc`", "`Int -> Int -> Calc`", "`Calc -> Calc -> Calc`", "`(Calc, Calc) -> Calc`"],
      answer: 2,
      why: "`Plus` takes two already-built calculations, one at a time, and makes a bigger one. It does not add numbers by itself; `eval` is what does that.",
    },
    {
      k: "quiz",
      q: "You evaluate `Sum (Use \"n\") (Lit 1)` in the environment `[(\"n\", 5)]`. What happens to that environment?",
      options: [
        "It becomes `[(\"n\", 6)]`",
        "It is unchanged: evaluating an expression only reads it",
        "`n` is removed",
        "A new pair `(\"n\", 1)` is added",
      ],
      answer: 1,
      why: "Reading a variable does not update it. Only a command such as `Write` or `Store` builds a new environment.",
    },
    {
      k: "predict",
      expr: "foldl (\\s n -> n : s) [] [1, 2, 3]",
      answer: "[3, 2, 1]",
      why: "Each number is put on the front of the accumulator: `[1]`, then `[2, 1]`, then `[3, 2, 1]`. A `foldl` is how you run a list of commands left to right.",
    },
    {
      k: "quiz",
      q: "A function issues the next ticket number and also needs to tell the caller what the following number should be. Why does it return a pair?",
      options: [
        "Haskell functions must return a pair",
        "A function cannot change a variable belonging to its caller, so it hands the updated number back",
        "Pairs are faster than `Int`",
        "So that `lookup` can find it",
      ],
      answer: 1,
      why: "There is no mutable counter. The only way to pass the new number on is to return it, usually as `(newState, result)`.",
    },
    {
      k: "predict",
      expr: "let (s, r) = ([\"b\"], 3) in length s + r",
      answer: "4",
      why: "The pattern `(s, r)` names both parts of the pair. `length [\"b\"]` is 1, plus 3 is 4. This is how you use a returned `(newState, result)`.",
    },
    {
      k: "quiz",
      q: "A stack is the list `[3, 1, 4]`, with the top at the head. What is on top, and what is underneath?",
      options: ["Top 4, then 1, then 3", "Top 3, then 1, then 4", "Top 1, then 3, then 4", "It is not a stack, because stacks are not lists"],
      answer: 1,
      why: "By convention in these questions the head is the top, so 3 is on top, then 1, then 4 at the bottom.",
    },
    {
      k: "predict",
      expr: 'lookup "x" (("x", 9) : [("x", 1), ("y", 2)])',
      answer: "Just 9",
      why: "Putting a new pair on the front hides the old `x`. `lookup` takes the first match, so it sees 9.",
    },
    {
      k: "write",
      body: "Fill in `getVal`. It looks a name up in an environment and wraps the answer in `Maybe`, just like `lookup`. Write it by recursion; do not call `lookup`.",
      starter: hs`getVal :: String -> [(String, Int)] -> Maybe Int
getVal k env = undefined
`,
      banned: ["lookup"],
      tests: [
        { expr: 'getVal "y" [("x", 1), ("y", 2)]', expected: "Just 2" },
        { expr: 'getVal "z" [("x", 1)]', expected: "Nothing" },
        { expr: 'getVal "a" []', expected: "Nothing" },
        { expr: 'getVal "a" [("a", 4), ("a", 9)]', expected: "Just 4" },
      ],
      hint: "Empty list is `Nothing`. For `(name, n) : rest`, if `name == k` give `Just n`, otherwise keep looking in `rest`.",
      solution: hs`getVal :: String -> [(String, Int)] -> Maybe Int
getVal _ [] = Nothing
getVal k ((name, n) : rest)
  | name == k = Just n
  | otherwise = getVal k rest
`,
    },
    {
      k: "write",
      setup: calcSetup,
      body: "Fill in `evalCalc`, which works out the number a `Calc` stands for.",
      starter: hs`evalCalc :: Calc -> Int
evalCalc (C n) = undefined
evalCalc (Plus a b) = undefined
evalCalc (Minus a b) = undefined
evalCalc (Times a b) = undefined
`,
      tests: [
        { expr: "evalCalc (C 7)", expected: "7" },
        { expr: "evalCalc c1", expected: "14" },
        { expr: "evalCalc c2", expected: "7" },
        { expr: "evalCalc c3", expected: "6" },
      ],
      hint: "Evaluate both sides, then combine: `evalCalc (Plus a b) = evalCalc a + evalCalc b`.",
      solution: hs`evalCalc :: Calc -> Int
evalCalc (C n) = n
evalCalc (Plus a b) = evalCalc a + evalCalc b
evalCalc (Minus a b) = evalCalc a - evalCalc b
evalCalc (Times a b) = evalCalc a * evalCalc b
`,
    },
    {
      k: "write",
      setup: calcSetup,
      body: "Fill in `leaves`, the number of `C` constructors in a calculation.",
      starter: hs`leaves :: Calc -> Int
leaves (C _) = undefined
leaves (Plus a b) = undefined
leaves (Minus a b) = undefined
leaves (Times a b) = undefined
`,
      tests: [
        { expr: "leaves (C 9)", expected: "1" },
        { expr: "leaves c1", expected: "3" },
        { expr: "leaves c2", expected: "3" },
        { expr: "leaves c3", expected: "4" },
      ],
      hint: "A `C` is 1. An operator is the sum of the leaves of its two parts.",
      solution: hs`leaves :: Calc -> Int
leaves (C _) = 1
leaves (Plus a b) = leaves a + leaves b
leaves (Minus a b) = leaves a + leaves b
leaves (Times a b) = leaves a + leaves b
`,
    },
    {
      k: "write",
      setup: calcSetup,
      body: "Fill in `ops`, the number of operator nodes (`Plus`, `Minus`, `Times`) in a calculation.",
      starter: hs`ops :: Calc -> Int
ops c = undefined
`,
      tests: [
        { expr: "ops (C 1)", expected: "0" },
        { expr: "ops c1", expected: "2" },
        { expr: "ops c2", expected: "2" },
        { expr: "ops c3", expected: "3" },
      ],
      hint: "`C` has 0 operators. Each of the others is 1 plus the operators in both parts.",
      solution: hs`ops :: Calc -> Int
ops (C _) = 0
ops (Plus a b) = 1 + ops a + ops b
ops (Minus a b) = 1 + ops a + ops b
ops (Times a b) = 1 + ops a + ops b
`,
    },
    {
      k: "write",
      setup: maybe,
      body: "Fill in `getOr`. `getOr d k env` is the value of `k` in `env`, or the default `d` if `k` is missing.",
      starter: hs`getOr :: Int -> String -> [(String, Int)] -> Int
getOr d k env = undefined
`,
      tests: [
        { expr: 'getOr 0 "x" [("x", 4)]', expected: "4" },
        { expr: 'getOr 0 "y" [("x", 4)]', expected: "0" },
        { expr: 'getOr (-1) "y" []', expected: "-1" },
        { expr: 'getOr 0 "b" [("a", 1), ("b", 2), ("b", 3)]', expected: "2" },
      ],
      hint: "`fromMaybe d (lookup k env)`.",
      solution: hs`getOr :: Int -> String -> [(String, Int)] -> Int
getOr d k env = fromMaybe d (lookup k env)
`,
    },
    {
      k: "write",
      setup: arithSetup,
      body: "Fill in `evalArith`. A `Use` takes its value from the environment; you may assume every name is present.",
      starter: hs`evalArith :: Env -> Arith -> Int
evalArith env e = undefined
`,
      tests: [
        { expr: "evalArith [] (Lit 8)", expected: "8" },
        { expr: "evalArith envA a1", expected: "11" },
        { expr: "evalArith envA a2", expected: "12" },
        { expr: "evalArith envA a3", expected: "10" },
      ],
      hint: "`evalArith env (Use v) = fromJust (lookup v env)`. Pass the same `env` to both sides of `Sum` and `Prod`.",
      solution: hs`evalArith :: Env -> Arith -> Int
evalArith _ (Lit n) = n
evalArith env (Use v) = fromJust (lookup v env)
evalArith env (Sum a b) = evalArith env a + evalArith env b
evalArith env (Prod a b) = evalArith env a * evalArith env b
`,
    },
    {
      k: "write",
      setup: memSetup,
      body: "Fill in `writeCell`. Put the new pair at the front, and keep every other pair except an old one for the same cell, in their original order.",
      starter: hs`writeCell :: Cell -> Int -> Memory -> Memory
writeCell c n mem = undefined
`,
      tests: [
        { expr: 'writeCell "a" 9 mem0', expected: '[("a", 9), ("b", 4)]' },
        { expr: 'writeCell "z" 3 mem0', expected: '[("z", 3), ("a", 1), ("b", 4)]' },
        { expr: 'writeCell "q" 1 []', expected: '[("q", 1)]' },
        { expr: 'writeCell "q" 5 mem1', expected: '[("q", 5), ("p", 10), ("r", 7)]' },
      ],
      hint: "`(c, n) : [p | p <- mem, fst p /= c]`.",
      solution: hs`writeCell :: Cell -> Int -> Memory -> Memory
writeCell c n mem = (c, n) : [p | p <- mem, fst p /= c]
`,
    },
    {
      k: "write",
      setup: memSetup,
      body: "Fill in `bumpCell`, which adds 1 to a cell. If the cell is missing, treat it as 0, so it becomes 1. Put the updated pair at the front, as `writeCell` would.",
      starter: hs`bumpCell :: Cell -> Memory -> Memory
bumpCell c mem = undefined
`,
      tests: [
        { expr: 'bumpCell "a" mem0', expected: '[("a", 2), ("b", 4)]' },
        { expr: 'bumpCell "z" mem0', expected: '[("z", 1), ("a", 1), ("b", 4)]' },
        { expr: 'bumpCell "q" mem1', expected: '[("q", 1), ("p", 10), ("r", 7)]' },
        { expr: 'bumpCell "x" []', expected: '[("x", 1)]' },
      ],
      hint: "Read with `fromMaybe 0 (lookup c mem)`, then write that plus 1.",
      solution: hs`bumpCell :: Cell -> Memory -> Memory
bumpCell c mem = (c, n + 1) : [p | p <- mem, fst p /= c]
  where
    n = fromMaybe 0 (lookup c mem)
`,
    },
    {
      k: "write",
      setup: bugSetup,
      body: "Fill in `turnR`, a 90-degree turn to the right: North becomes East, East becomes South, South becomes West, West becomes North.",
      starter: hs`turnR :: Dir -> Dir
turnR d = undefined
`,
      tests: [
        { expr: "turnR North", expected: "East" },
        { expr: "turnR East", expected: "South" },
        { expr: "turnR South", expected: "West" },
        { expr: "turnR West", expected: "North" },
      ],
      hint: "Four equations, one per constructor.",
      solution: hs`turnR :: Dir -> Dir
turnR North = East
turnR East = South
turnR South = West
turnR West = North
`,
    },
    {
      k: "write",
      setup: bugSetup,
      body: "Fill in `stepFwd`. Move the bug one square the way it is facing, and keep the same heading. North increases `y` by 1, East increases `x` by 1, South decreases `y`, West decreases `x`.",
      starter: hs`stepFwd :: Bug -> Bug
stepFwd bug = undefined
`,
      tests: [
        { expr: "stepFwd bug0", expected: "((0, 1), North)" },
        { expr: "stepFwd ((2, 3), East)", expected: "((3, 3), East)" },
        { expr: "stepFwd ((2, 3), South)", expected: "((2, 2), South)" },
        { expr: "stepFwd ((2, 3), West)", expected: "((1, 3), West)" },
      ],
      hint: "Pattern match on the heading. For North: `stepFwd ((x, y), North) = ((x, y + 1), North)`.",
      solution: hs`stepFwd :: Bug -> Bug
stepFwd ((x, y), North) = ((x, y + 1), North)
stepFwd ((x, y), East) = ((x + 1, y), East)
stepFwd ((x, y), South) = ((x, y - 1), South)
stepFwd ((x, y), West) = ((x - 1, y), West)
`,
    },
    {
      k: "write",
      setup: stackSetup,
      body: "Fill in `pushN`, which puts a number on top of a stack.",
      starter: hs`pushN :: Int -> Stack -> Stack
pushN n stk = undefined
`,
      tests: [
        { expr: "pushN 3 []", expected: "[3]" },
        { expr: "pushN 3 [1, 4]", expected: "[3, 1, 4]" },
        { expr: "pushN 0 [2]", expected: "[0, 2]" },
        { expr: "pushN (-1) []", expected: "[-1]" },
      ],
      hint: "The top is the head, so `n : stk`.",
      solution: hs`pushN :: Int -> Stack -> Stack
pushN n stk = n : stk
`,
    },
    {
      k: "write",
      setup: stackSetup,
      body: "Fill in `add2`. If the stack has at least two numbers, replace the top two by their sum. You may assume it does.",
      starter: hs`add2 :: Stack -> Stack
add2 stk = undefined
`,
      tests: [
        { expr: "add2 [3, 2]", expected: "[5]" },
        { expr: "add2 [3, 2, 9]", expected: "[5, 9]" },
        { expr: "add2 [0, 4, 1, 1]", expected: "[4, 1, 1]" },
        { expr: "add2 [-2, 8]", expected: "[6]" },
      ],
      hint: "`add2 (x : y : ys) = (x + y) : ys`.",
      solution: hs`add2 :: Stack -> Stack
add2 (x : y : ys) = (x + y) : ys
`,
    },
    {
      k: "write",
      setup: bankSetup,
      body: "Fill in `openAcc`. If the name is not yet a customer, add them with balance 0 at the front. If they already have an account, leave the bank unchanged.",
      starter: hs`openAcc :: String -> Bank -> Bank
openAcc who bank = undefined
`,
      tests: [
        { expr: 'openAcc "cy" bank0', expected: '[("cy", 0), ("ada", 100), ("ben", 40)]' },
        { expr: 'openAcc "ada" bank0', expected: "bank0" },
        { expr: 'openAcc "ada" []', expected: '[("ada", 0)]' },
        { expr: 'openAcc "ben" bank1', expected: "bank1" },
      ],
      hint: "`lookup who bank`. If it is `Just _`, return `bank`. If `Nothing`, cons `(who, 0)`.",
      solution: hs`openAcc :: String -> Bank -> Bank
openAcc who bank = case lookup who bank of
  Just _ -> bank
  Nothing -> (who, 0) : bank
`,
    },
    {
      k: "write",
      setup: bankSetup,
      body: "Fill in `payIn`. Add `n` pence to the named account. You may assume the account exists. Put the updated pair at the front and keep the others (minus the old pair) in order.",
      starter: hs`payIn :: String -> Pence -> Bank -> Bank
payIn who n bank = undefined
`,
      tests: [
        { expr: 'payIn "ada" 25 bank0', expected: '[("ada", 125), ("ben", 40)]' },
        { expr: 'payIn "ben" 10 bank0', expected: '[("ben", 50), ("ada", 100)]' },
        { expr: 'payIn "cy" 5 bank1', expected: '[("cy", 5), ("ada", 50), ("ben", 20)]' },
        { expr: 'payIn "ada" 0 bank0', expected: '[("ada", 100), ("ben", 40)]' },
      ],
      hint: "New balance is `fromMaybe 0 (lookup who bank) + n`. Then rebuild like `writeCell`.",
      solution: hs`payIn :: String -> Pence -> Bank -> Bank
payIn who n bank = (who, old + n) : [p | p <- bank, fst p /= who]
  where
    old = fromMaybe 0 (lookup who bank)
`,
    },
    {
      k: "write",
      body: md(
        "Fill in `tickets`. `tickets k names` hands out consecutive ticket numbers starting at `k`, and also returns the next unused number.",
        "",
        "```",
        "tickets 10 [\"ada\", \"ben\"]  is  ([(\"ada\", 10), (\"ben\", 11)], 12)",
        "```",
      ),
      starter: hs`tickets :: Int -> [String] -> ([(String, Int)], Int)
tickets k names = undefined
`,
      tests: [
        { expr: 'tickets 10 ["ada", "ben"]', expected: '([("ada", 10), ("ben", 11)], 12)' },
        { expr: 'tickets 1 []', expected: "([], 1)" },
        { expr: 'tickets 5 ["z"]', expected: '([("z", 5)], 6)' },
        { expr: 'tickets 0 ["a", "b", "c"]', expected: '([("a", 0), ("b", 1), ("c", 2)], 3)' },
      ],
      hint: "`tickets k [] = ([], k)`. Otherwise issue `k` to the first name and `tickets (k + 1)` for the rest.",
      solution: hs`tickets :: Int -> [String] -> ([(String, Int)], Int)
tickets k [] = ([], k)
tickets k (n : ns) = ((n, k) : rest, m)
  where
    (rest, m) = tickets (k + 1) ns
`,
    },
    {
      k: "write",
      setup: memSetup,
      body: "Fill in `applyWrites`. Run a list of `(cell, value)` writes **from left to right**, each one seeing the memory the previous one produced. Use `writeCell` as in the starter's first hole, or write the same idea with `foldl`.",
      starter: hs`writeCell :: Cell -> Int -> Memory -> Memory
writeCell c n mem = (c, n) : [p | p <- mem, fst p /= c]

applyWrites :: [(Cell, Int)] -> Memory -> Memory
applyWrites ws mem = undefined
`,
      tests: [
        { expr: 'applyWrites [("a", 9)] mem0', expected: '[("a", 9), ("b", 4)]' },
        { expr: 'applyWrites [("a", 2), ("a", 3)] []', expected: '[("a", 3)]' },
        { expr: 'applyWrites [("x", 1), ("y", 2)] []', expected: '[("y", 2), ("x", 1)]' },
        { expr: "applyWrites [] mem0", expected: "mem0" },
      ],
      hint: "`foldl (\\m (c, n) -> writeCell c n m) mem ws`.",
      solution: hs`writeCell :: Cell -> Int -> Memory -> Memory
writeCell c n mem = (c, n) : [p | p <- mem, fst p /= c]

applyWrites :: [(Cell, Int)] -> Memory -> Memory
applyWrites ws mem = foldl (\m (c, n) -> writeCell c n m) mem ws
`,
    },
    {
      k: "write",
      setup: calcSetup,
      body: md(
        "Fill in `postfix`, which writes a calculation with each operator **after** its two arguments, separated by single spaces.",
        "",
        "```",
        "postfix c1  is  \"2 3 4 * +\"",
        "postfix (C 7)  is  \"7\"",
        "```",
      ),
      starter: hs`postfix :: Calc -> String
postfix c = undefined
`,
      tests: [
        { expr: "postfix c1", expected: `"2 3 4 * +"` },
        { expr: "postfix (C 7)", expected: `"7"` },
        { expr: "postfix c2", expected: `"5 2 * 3 -"` },
        { expr: "postfix c3", expected: `"1 1 + 4 1 - *"` },
      ],
      hint: "`postfix (Plus a b) = postfix a ++ \" \" ++ postfix b ++ \" +\"`. Use `show n` for a `C n`.",
      solution: hs`postfix :: Calc -> String
postfix (C n) = show n
postfix (Plus a b) = postfix a ++ " " ++ postfix b ++ " +"
postfix (Minus a b) = postfix a ++ " " ++ postfix b ++ " -"
postfix (Times a b) = postfix a ++ " " ++ postfix b ++ " *"
`,
    },
    {
      k: "write",
      setup: memSetup,
      body: md(
        "Fill in `swapIn`. `swapIn c n mem` writes `n` into cell `c` (same rule as putting the new pair first) and also returns the **old** value, or 0 if the cell was missing.",
        "",
        "```",
        "swapIn \"a\" 9 mem0  is  ([(\"a\", 9), (\"b\", 4)], 1)",
        "```",
      ),
      starter: hs`swapIn :: Cell -> Int -> Memory -> (Memory, Int)
swapIn c n mem = undefined
`,
      tests: [
        { expr: 'swapIn "a" 9 mem0', expected: '([("a", 9), ("b", 4)], 1)' },
        { expr: 'swapIn "z" 3 mem0', expected: '([("z", 3), ("a", 1), ("b", 4)], 0)' },
        { expr: 'swapIn "q" 1 []', expected: '([("q", 1)], 0)' },
        { expr: 'swapIn "r" 0 mem1', expected: '([("r", 0), ("p", 10), ("q", 0)], 7)' },
      ],
      hint: "The old value is `fromMaybe 0 (lookup c mem)`. Return it alongside the new memory.",
      solution: hs`swapIn :: Cell -> Int -> Memory -> (Memory, Int)
swapIn c n mem = ((c, n) : [p | p <- mem, fst p /= c], fromMaybe 0 (lookup c mem))
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 2
// ---------------------------------------------------------------------------

const level2: DrillSet = {
  id: "b-interp-l2",
  lesson: "",
  level: 2,
  title: "Level 2: Standard",
  intro: md(
    "One complete function from a description. For expressions, write one equation per constructor and pass the environment down. For a list of commands, thread the store through: each command takes the store and gives a new one.",
    "",
    "```",
    "eval env (Bind x e body) = eval ((x, eval env e) : env) body",
    "",
    "run []    bug = bug",
    "run (c:cs) bug = run cs (step c bug)",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: 'You evaluate `Bind "x" (Amt 1) (Name "x")` in `[("x", 9)]`. What value should it give, and why?',
      options: [
        "9, because the outer `x` is still there",
        "1, because the new binding is put in front and `lookup` takes the first `x`",
        "10, the two are added",
        "It is an error: `x` is defined twice",
      ],
      answer: 1,
      why: "The `Bind` puts `(\"x\", 1)` on the front only while evaluating the body. `lookup` sees that 1 first. After the `Bind` finishes, the outer 9 is still there for anything outside.",
    },
    {
      k: "quiz",
      q: 'In `Bind "x" (Name "x") (Amt 0)`, evaluated in `[("x", 4)]`, what does the inner `Name "x"` (the one being bound) refer to?',
      options: [
        "The new `x`, so this is an error or a loop",
        "The outer `x`, so it is 4: a `Bind` does not hide names inside its own right-hand side",
        "0",
        "It is always 0 because the body is `Amt 0`",
      ],
      answer: 1,
      why: "You evaluate the right-hand side in the **old** environment, then add the binding, then evaluate the body. Uses of `x` inside the right-hand side still mean the outer `x`.",
    },
    {
      k: "predict",
      expr: 'foldl (\\n k -> n + k) 0 [10, 20, 3]',
      answer: "33",
      why: "Start at 0, then 10, then 30, then 33. Running commands is the same shape: the accumulator is the current state.",
    },
    {
      k: "quiz",
      q: "A bug starts at `(0, 0)` facing North. It does `Go 2`, then `TurnR`, then `Go 3`. Where is it, and which way does it face?",
      options: [
        "`((3, 2), East)`",
        "`((2, 3), East)`",
        "`((3, 2), North)`",
        "`((0, 5), North)`",
      ],
      answer: 0,
      why: "`Go 2` walks to `(0, 2)` still facing North. `TurnR` faces East. `Go 3` walks to `(3, 2)`.",
    },
    {
      k: "quiz",
      q: "The stack is empty. You run `Push 5`, `Push 3`, `Sub`. What is the stack afterwards?",
      options: ["`[2]`", "`[8]`", "`[-2]`", "`[3, 5]`"],
      answer: 0,
      why: "After the two pushes the stack is `[3, 5]` (3 on top). `Sub` on `(x : y : ys)` leaves `(y - x)`, so `5 - 3 = 2`.",
    },
    {
      k: "predict",
      expr: 'zip ["p", "q"] [8, 9, 10]',
      answer: '[("p", 8), ("q", 9)]',
      why: "`zip` pairs until the shorter list ends, so 10 is dropped. Binding parameters of a tiny function call is `zip names values`.",
    },
    {
      k: "write",
      setup: arithSetup,
      body: "Write `evalArith :: Env -> Arith -> Int`. Every name is in the environment.",
      starter: hs`evalArith :: Env -> Arith -> Int
evalArith env e = undefined
`,
      tests: [
        { expr: "evalArith envA a1", expected: "11" },
        { expr: "evalArith envA a2", expected: "12" },
        { expr: "evalArith [] (Sum (Lit 2) (Lit 3))", expected: "5" },
        { expr: 'evalArith [("z", 7)] (Prod (Use "z") (Lit 0))', expected: "0" },
      ],
      hint: "Four constructors, four equations. `Use v` is `fromJust (lookup v env)`.",
      solution: hs`evalArith :: Env -> Arith -> Int
evalArith _ (Lit n) = n
evalArith env (Use v) = fromJust (lookup v env)
evalArith env (Sum a b) = evalArith env a + evalArith env b
evalArith env (Prod a b) = evalArith env a * evalArith env b
`,
    },
    {
      k: "write",
      setup: arithSetup,
      body: "Write `uses :: Arith -> [Name]`, every variable in the expression from left to right, repeats kept.",
      starter: hs`uses :: Arith -> [Name]
uses e = undefined
`,
      tests: [
        { expr: "uses a1", expected: `["n"]` },
        { expr: "uses a2", expected: `["x", "y"]` },
        { expr: "uses a3", expected: `["n", "n"]` },
        { expr: "uses (Lit 4)", expected: "[]" },
      ],
      hint: "`Use v` gives `[v]`, `Lit` gives `[]`, `Sum` and `Prod` join the two lists.",
      solution: hs`uses :: Arith -> [Name]
uses (Lit _) = []
uses (Use v) = [v]
uses (Sum a b) = uses a ++ uses b
uses (Prod a b) = uses a ++ uses b
`,
    },
    {
      k: "write",
      setup: arithSetup,
      body: "Write `rename :: Name -> Name -> Arith -> Arith`. `rename old new e` changes every `Use old` into `Use new` and leaves everything else alone.",
      starter: hs`rename :: Name -> Name -> Arith -> Arith
rename old new e = undefined
`,
      tests: [
        { expr: 'rename "n" "k" a1', expected: 'Sum (Lit 1) (Prod (Use "k") (Lit 2))' },
        { expr: 'rename "x" "z" a2', expected: 'Prod (Use "z") (Use "y")' },
        { expr: 'rename "q" "r" a2', expected: "a2" },
        { expr: 'rename "n" "n" a3', expected: "a3" },
      ],
      hint: "Only the `Use` equation does work: `if v == old then Use new else Use v`. Rebuild `Sum` and `Prod`.",
      solution: hs`rename :: Name -> Name -> Arith -> Arith
rename _ _ (Lit n) = Lit n
rename old new (Use v) = if v == old then Use new else Use v
rename old new (Sum a b) = Sum (rename old new a) (rename old new b)
rename old new (Prod a b) = Prod (rename old new a) (rename old new b)
`,
    },
    {
      k: "write",
      setup: formulaSetup,
      body: md(
        "Write `evalF :: Env -> Formula -> Int`.",
        "",
        "`Bind x e body` means: evaluate `e` in the current environment, then evaluate `body` with `(x, that value)` on the front. A name takes the value of its first binding; you may assume there is one.",
      ),
      starter: hs`evalF :: Env -> Formula -> Int
evalF env e = undefined
`,
      tests: [
        { expr: 'evalF [("n", 3)] f1', expected: "18" },
        { expr: 'evalF [("b", 5)] f2', expected: "-2", label: "a is 5 + 2, then inner b is 9" },
        { expr: 'evalF [("x", 7)] f3', expected: "8" },
        { expr: 'evalF [] (Bind "x" (Amt 2) (Bind "x" (Join Add (Name "x") (Amt 1)) (Name "x")))', expected: "3" },
        { expr: "evalF [] (Join Sub (Amt 2) (Join Mul (Amt 3) (Amt 4)))", expected: "-10" },
      ],
      hint: "`evalF env (Bind x e body) = evalF ((x, evalF env e) : env) body`. Write a helper for `Mix`.",
      solution: hs`evalF :: Env -> Formula -> Int
evalF _ (Amt n) = n
evalF env (Name v) = fromJust (lookup v env)
evalF env (Join op a b) = mix op (evalF env a) (evalF env b)
evalF env (Bind x e body) = evalF ((x, evalF env e) : env) body

mix :: Mix -> Int -> Int -> Int
mix Add = (+)
mix Sub = (-)
mix Mul = (*)
`,
    },
    {
      k: "write",
      setup: memSetup,
      body: md(
        "Write `applyPatch :: Patch -> Memory -> Memory`.",
        "",
        "- `Write c n` sets cell `c` to `n`.",
        "- `Bump c` adds 1 (missing counts as 0).",
        "- `Zero c` sets `c` to 0.",
        "- `Copy src dst` writes the value of `src` (or 0 if missing) into `dst`.",
        "",
        "Updated pairs go to the front, old pairs for that cell are dropped.",
      ),
      starter: hs`applyPatch :: Patch -> Memory -> Memory
applyPatch p mem = undefined
`,
      tests: [
        { expr: 'applyPatch (Write "a" 9) mem0', expected: '[("a", 9), ("b", 4)]' },
        { expr: 'applyPatch (Bump "b") mem0', expected: '[("b", 5), ("a", 1)]' },
        { expr: 'applyPatch (Zero "p") mem1', expected: '[("p", 0), ("q", 0), ("r", 7)]' },
        { expr: 'applyPatch (Copy "a" "b") mem0', expected: '[("b", 1), ("a", 1)]' },
        { expr: 'applyPatch (Copy "z" "a") mem0', expected: '[("a", 0), ("b", 4)]' },
      ],
      hint: "A small `set c n mem = (c, n) : [p | p <- mem, fst p /= c]` covers every case.",
      solution: hs`applyPatch :: Patch -> Memory -> Memory
applyPatch (Write c n) mem = set c n mem
applyPatch (Bump c) mem = set c (get c mem + 1) mem
applyPatch (Zero c) mem = set c 0 mem
applyPatch (Copy src dst) mem = set dst (get src mem) mem

get :: Cell -> Memory -> Int
get c mem = fromMaybe 0 (lookup c mem)

set :: Cell -> Int -> Memory -> Memory
set c n mem = (c, n) : [p | p <- mem, fst p /= c]
`,
    },
    {
      k: "write",
      setup: memSetup + givenWriteCell,
      body: "`writeCell` is given. Write `copyCell src dst mem`, which writes the value of `src` into `dst`. A missing `src` counts as 0.",
      starter: hs`copyCell :: Cell -> Cell -> Memory -> Memory
copyCell src dst mem = undefined
`,
      tests: [
        { expr: 'copyCell "a" "b" mem0', expected: '[("b", 1), ("a", 1)]' },
        { expr: 'copyCell "b" "b" mem0', expected: '[("b", 4), ("a", 1)]' },
        { expr: 'copyCell "z" "a" mem0', expected: '[("a", 0), ("b", 4)]' },
        { expr: 'copyCell "p" "x" mem1', expected: '[("x", 10), ("p", 10), ("q", 0), ("r", 7)]' },
      ],
      hint: "`writeCell dst (fromMaybe 0 (lookup src mem)) mem`.",
      solution: hs`copyCell :: Cell -> Cell -> Memory -> Memory
copyCell src dst mem = writeCell dst (fromMaybe 0 (lookup src mem)) mem
`,
    },
    {
      k: "write",
      setup: bugSetup + givenTurn,
      body: md(
        "`turnL`, `turnR` and `delta` are given. Write `runBug :: [Step] -> Bug -> Bug`, which carries out a list of steps from left to right.",
        "",
        "`Go n` and `Back n` move one square at a time (`n` is never negative). `Back` does not change the heading.",
      ),
      starter: hs`runBug :: [Step] -> Bug -> Bug
runBug steps bug = undefined
`,
      tests: [
        { expr: "runBug [] bug0", expected: "bug0" },
        { expr: "runBug [Go 2, TurnR, Go 3] bug0", expected: "((3, 2), East)" },
        { expr: "runBug [TurnL, Go 1] bug0", expected: "((-1, 0), West)" },
        { expr: "runBug [Go 1, Back 1] bug0", expected: "((0, 0), North)" },
        { expr: "runBug [TurnR, TurnR, Go 4] bug0", expected: "((0, -4), South)" },
      ],
      hint: "A helper `doStep (Go n)` can recurse on `n`, using `delta` to add one square. Then `foldl` the helper over the list.",
      solution: hs`runBug :: [Step] -> Bug -> Bug
runBug steps bug = foldl (flip doStep) bug steps

doStep :: Step -> Bug -> Bug
doStep (Go n) bug = walk n bug
doStep TurnR (p, d) = (p, turnR d)
doStep TurnL (p, d) = (p, turnL d)
doStep (Back n) bug = walkBack n bug

walk :: Int -> Bug -> Bug
walk 0 bug = bug
walk n ((x, y), d) = walk (n - 1) ((x + dx, y + dy), d)
  where
    (dx, dy) = delta d

walkBack :: Int -> Bug -> Bug
walkBack 0 bug = bug
walkBack n ((x, y), d) = walkBack (n - 1) ((x - dx, y - dy), d)
  where
    (dx, dy) = delta d
`,
    },
    {
      k: "write",
      setup: stackSetup,
      body: "Write `runStack :: [Instr] -> Stack -> Stack`. Run the instructions from left to right. You may assume the stack always has enough values (no underflow).",
      starter: hs`runStack :: [Instr] -> Stack -> Stack
runStack is stk = undefined
`,
      tests: [
        { expr: "runStack [Push 5, Push 3, Sub] []", expected: "[2]" },
        { expr: "runStack [Push 2, Push 3, Add, Push 4, Mul] []", expected: "[20]" },
        { expr: "runStack [Push 7, Dup, Mul] []", expected: "[49]" },
        { expr: "runStack [Push 1, Push 2, Swap] []", expected: "[1, 2]" },
        { expr: "runStack [Push 9, Drop, Push 4] []", expected: "[4]" },
        { expr: "runStack [Push 3, Neg] []", expected: "[-3]" },
      ],
      hint: "A helper `step :: Instr -> Stack -> Stack` with one equation per constructor, then `foldl (flip step) stk is`.",
      solution: hs`runStack :: [Instr] -> Stack -> Stack
runStack is stk = foldl (flip step) stk is

step :: Instr -> Stack -> Stack
step (Push n) stk = n : stk
step Add (x : y : ys) = (x + y) : ys
step Mul (x : y : ys) = (x * y) : ys
step Sub (x : y : ys) = (y - x) : ys
step Dup (x : xs) = x : x : xs
step Swap (x : y : ys) = y : x : ys
step Drop (_ : xs) = xs
step Neg (x : xs) = negate x : xs
`,
    },
    {
      k: "write",
      setup: bankSetup,
      body: "Write `payOut`. Subtract `n` pence from the named account if the balance is at least `n`. If the account is missing, or the balance is too small, leave the bank unchanged. Updated pairs go to the front.",
      starter: hs`payOut :: String -> Pence -> Bank -> Bank
payOut who n bank = undefined
`,
      tests: [
        { expr: 'payOut "ada" 30 bank0', expected: '[("ada", 70), ("ben", 40)]' },
        { expr: 'payOut "ada" 100 bank0', expected: '[("ada", 0), ("ben", 40)]' },
        { expr: 'payOut "ada" 101 bank0', expected: "bank0" },
        { expr: 'payOut "zed" 1 bank0', expected: "bank0" },
        { expr: 'payOut "cy" 0 bank1', expected: '[("cy", 0), ("ada", 50), ("ben", 20)]' },
      ],
      hint: "`case lookup who bank of Just bal | bal >= n -> ... ; _ -> bank`.",
      solution: hs`payOut :: String -> Pence -> Bank -> Bank
payOut who n bank = case lookup who bank of
  Just bal | bal >= n -> (who, bal - n) : [p | p <- bank, fst p /= who]
  _ -> bank
`,
    },
    {
      k: "write",
      setup: bankSetup,
      body: md(
        "Write `sendTo from to n bank`. Move `n` pence from `from` to `to` if both accounts exist and `from` has at least `n`. Otherwise leave the bank unchanged.",
        "",
        "If it succeeds, update `from` first, then `to`, each time putting the updated pair at the front.",
      ),
      starter: hs`sendTo :: String -> String -> Pence -> Bank -> Bank
sendTo from to n bank = undefined
`,
      tests: [
        { expr: 'sendTo "ada" "ben" 30 bank0', expected: '[("ben", 70), ("ada", 70)]' },
        { expr: 'sendTo "ada" "ben" 101 bank0', expected: "bank0" },
        { expr: 'sendTo "ada" "zed" 10 bank0', expected: "bank0" },
        { expr: 'sendTo "zed" "ada" 10 bank0', expected: "bank0" },
        { expr: 'sendTo "ada" "ben" 0 bank0', expected: '[("ben", 40), ("ada", 100)]' },
      ],
      hint: "Look both balances up. If either is missing or `from` is short, return `bank`. Else write `from` then `to`.",
      solution: hs`sendTo :: String -> String -> Pence -> Bank -> Bank
sendTo from to n bank =
  case (lookup from bank, lookup to bank) of
    (Just a, Just b)
      | a >= n -> set to (b + n) (set from (a - n) bank)
    _ -> bank

set :: String -> Pence -> Bank -> Bank
set who n bank = (who, n) : [p | p <- bank, fst p /= who]
`,
    },
    {
      k: "write",
      body: md(
        "Write `issue :: Int -> [String] -> ([(Int, String)], Int)`. Number the names from left to right starting at the given `Int`, and return the next free number as well.",
        "",
        "```",
        "issue 4 [\"tea\", \"bun\"]  is  ([(4, \"tea\"), (5, \"bun\")], 6)",
        "```",
      ),
      starter: hs`issue :: Int -> [String] -> ([(Int, String)], Int)
issue k names = undefined
`,
      tests: [
        { expr: 'issue 4 ["tea", "bun"]', expected: '([(4, "tea"), (5, "bun")], 6)' },
        { expr: "issue 0 []", expected: "([], 0)" },
        { expr: 'issue 9 ["solo"]', expected: '([(9, "solo")], 10)' },
        { expr: 'issue 1 ["a", "b", "c"]', expected: '([(1, "a"), (2, "b"), (3, "c")], 4)' },
      ],
      hint: "`issue k [] = ([], k)`. For `n : ns`, number `n` with `k` and continue from `k + 1`.",
      solution: hs`issue :: Int -> [String] -> ([(Int, String)], Int)
issue k [] = ([], k)
issue k (n : ns) = ((k, n) : rest, m)
  where
    (rest, m) = issue (k + 1) ns
`,
    },
    {
      k: "write",
      setup: arithSetup,
      body: md(
        "Write `showArith`, prefix style with brackets and single spaces.",
        "",
        "```",
        "showArith a1  is  \"(+ 1 (* n 2))\"",
        "showArith a2  is  \"(* x y)\"",
        "```",
      ),
      starter: hs`showArith :: Arith -> String
showArith e = undefined
`,
      tests: [
        { expr: "showArith a1", expected: `"(+ 1 (* n 2))"` },
        { expr: "showArith a2", expected: `"(* x y)"` },
        { expr: "showArith (Lit 7)", expected: `"7"` },
        { expr: 'showArith (Use "abc")', expected: `"abc"` },
      ],
      hint: "`showArith (Sum a b) = \"(+ \" ++ showArith a ++ \" \" ++ showArith b ++ \")\"`.",
      solution: hs`showArith :: Arith -> String
showArith (Lit n) = show n
showArith (Use v) = v
showArith (Sum a b) = "(+ " ++ showArith a ++ " " ++ showArith b ++ ")"
showArith (Prod a b) = "(* " ++ showArith a ++ " " ++ showArith b ++ ")"
`,
    },
    {
      k: "write",
      setup: arithSetup,
      body: "Write `ground :: Arith -> Bool`, which is `True` when the expression contains no `Use` at all.",
      starter: hs`ground :: Arith -> Bool
ground e = undefined
`,
      tests: [
        { expr: "ground a1", expected: "False" },
        { expr: "ground (Sum (Lit 1) (Lit 2))", expected: "True" },
        { expr: "ground (Lit 0)", expected: "True" },
        { expr: 'ground (Prod (Lit 2) (Use "q"))', expected: "False" },
      ],
      hint: "`Use` is `False`, `Lit` is `True`, `Sum`/`Prod` need both sides (`&&`).",
      solution: hs`ground :: Arith -> Bool
ground (Lit _) = True
ground (Use _) = False
ground (Sum a b) = ground a && ground b
ground (Prod a b) = ground a && ground b
`,
    },
    {
      k: "write",
      setup: formulaSetup,
      body: "Write `countBind :: Formula -> Int`, the number of `Bind` nodes. `Join` is not a bind.",
      starter: hs`countBind :: Formula -> Int
countBind e = undefined
`,
      tests: [
        { expr: "countBind f1", expected: "1" },
        { expr: "countBind f2", expected: "2" },
        { expr: "countBind (Amt 3)", expected: "0" },
        { expr: "countBind f3", expected: "1" },
      ],
      hint: "`Bind` counts 1 plus both parts. `Join` only adds the parts. `Amt`/`Name` are 0.",
      solution: hs`countBind :: Formula -> Int
countBind (Amt _) = 0
countBind (Name _) = 0
countBind (Join _ a b) = countBind a + countBind b
countBind (Bind _ e body) = 1 + countBind e + countBind body
`,
    },
    {
      k: "write",
      setup: bugSetup + givenTurn,
      body: "`turnL` and `turnR` are given. Write `finalDir :: [Step] -> Dir -> Dir`, the heading after a list of steps. `Go` and `Back` do not change heading.",
      starter: hs`finalDir :: [Step] -> Dir -> Dir
finalDir steps d = undefined
`,
      tests: [
        { expr: "finalDir [] North", expected: "North" },
        { expr: "finalDir [Go 4, TurnR, Go 1, TurnR] North", expected: "South" },
        { expr: "finalDir [TurnL, TurnL, TurnL, TurnL] East", expected: "East" },
        { expr: "finalDir [Back 9, TurnR] West", expected: "North" },
      ],
      hint: "Ignore `Go` and `Back`. Fold `TurnR`/`TurnL` over the starting direction.",
      solution: hs`finalDir :: [Step] -> Dir -> Dir
finalDir steps d = foldl spin d steps
  where
    spin dir TurnR = turnR dir
    spin dir TurnL = turnL dir
    spin dir _ = dir
`,
    },
    {
      k: "write",
      setup: stackSetup,
      body: "Write `peek :: Stack -> Maybe Int`, the top of the stack, or `Nothing` if it is empty.",
      starter: hs`peek :: Stack -> Maybe Int
peek stk = undefined
`,
      tests: [
        { expr: "peek []", expected: "Nothing" },
        { expr: "peek [4, 1, 2]", expected: "Just 4" },
        { expr: "peek [0]", expected: "Just 0" },
        { expr: "peek [-3, 8]", expected: "Just (-3)" },
      ],
      hint: "`peek [] = Nothing` and `peek (x : _) = Just x`.",
      solution: hs`peek :: Stack -> Maybe Int
peek [] = Nothing
peek (x : _) = Just x
`,
    },
    {
      k: "write",
      setup: memSetup + listy,
      body: "Write `cells :: Memory -> [Cell]`, the cell names in alphabetical order, without duplicates.",
      starter: hs`cells :: Memory -> [Cell]
cells mem = undefined
`,
      tests: [
        { expr: "cells mem0", expected: `["a", "b"]` },
        { expr: "cells mem1", expected: `["p", "q", "r"]` },
        { expr: "cells []", expected: "[]" },
        { expr: 'cells [("z", 1), ("a", 2), ("z", 3)]', expected: `["a", "z"]` },
      ],
      hint: "`sort (nub (map fst mem))`.",
      solution: hs`cells :: Memory -> [Cell]
cells mem = sort (nub (map fst mem))
`,
    },
    {
      k: "write",
      setup: arithSetup,
      body: "Write `evalOr0 :: Env -> Arith -> Int`. Like `evalArith`, but a missing name counts as 0 instead of crashing.",
      starter: hs`evalOr0 :: Env -> Arith -> Int
evalOr0 env e = undefined
`,
      tests: [
        { expr: "evalOr0 envA a1", expected: "11" },
        { expr: "evalOr0 [] a1", expected: "1" },
        { expr: 'evalOr0 [("x", 3)] a2', expected: "0" },
        { expr: "evalOr0 [] (Lit 5)", expected: "5" },
      ],
      hint: "`evalOr0 env (Use v) = fromMaybe 0 (lookup v env)`. `fromMaybe` is in `Data.Maybe`; import it or use a `case`.",
      solution: hs`import Data.Maybe (fromMaybe)

evalOr0 :: Env -> Arith -> Int
evalOr0 _ (Lit n) = n
evalOr0 env (Use v) = fromMaybe 0 (lookup v env)
evalOr0 env (Sum a b) = evalOr0 env a + evalOr0 env b
evalOr0 env (Prod a b) = evalOr0 env a * evalOr0 env b
`,
    },
    {
      k: "write",
      setup: bugSetup + givenTurn + givenStepBug,
      body: "`stepOne`, `turnL`, `turnR` and `delta` are given. Write `goN :: Int -> Bug -> Bug`, which walks `n` squares forward, one at a time. `n` is never negative.",
      starter: hs`goN :: Int -> Bug -> Bug
goN n bug = undefined
`,
      tests: [
        { expr: "goN 0 bug0", expected: "bug0" },
        { expr: "goN 3 bug0", expected: "((0, 3), North)" },
        { expr: "goN 2 ((1, 1), East)", expected: "((3, 1), East)" },
        { expr: "goN 4 ((0, 0), West)", expected: "((-4, 0), West)" },
      ],
      hint: "`goN 0 bug = bug` and `goN n bug = goN (n - 1) (stepOne bug)`.",
      solution: hs`goN :: Int -> Bug -> Bug
goN 0 bug = bug
goN n bug = goN (n - 1) (stepOne bug)
`,
    },
    {
      k: "write",
      setup: stackSetup,
      body: "Write `doDup :: Stack -> Stack`. Copy the top of the stack. You may assume the stack is not empty.",
      starter: hs`doDup :: Stack -> Stack
doDup stk = undefined
`,
      tests: [
        { expr: "doDup [7]", expected: "[7, 7]" },
        { expr: "doDup [1, 2, 3]", expected: "[1, 1, 2, 3]" },
        { expr: "doDup [0, 0]", expected: "[0, 0, 0]" },
        { expr: "doDup [-1]", expected: "[-1, -1]" },
      ],
      hint: "`doDup (x : xs) = x : x : xs`.",
      solution: hs`doDup :: Stack -> Stack
doDup (x : xs) = x : x : xs
`,
    },
    {
      k: "write",
      setup: bankSetup,
      body: "Write `bankSum :: Bank -> Pence`, the total of every balance. If a name appears twice, count both (do not try to unique them).",
      starter: hs`bankSum :: Bank -> Pence
bankSum bank = undefined
`,
      tests: [
        { expr: "bankSum bank0", expected: "140" },
        { expr: "bankSum bank1", expected: "70" },
        { expr: "bankSum []", expected: "0" },
        { expr: 'bankSum [("a", 1), ("a", 1)]', expected: "2" },
      ],
      hint: "`sum (map snd bank)`.",
      solution: hs`bankSum :: Bank -> Pence
bankSum bank = sum (map snd bank)
`,
    },
    {
      k: "write",
      setup: arithSetup,
      body: "Write `plug :: Name -> Arith -> Arith -> Arith`. `plug x e body` replaces every `Use x` inside `body` by the whole expression `e`.",
      starter: hs`plug :: Name -> Arith -> Arith -> Arith
plug x e body = undefined
`,
      tests: [
        { expr: 'plug "n" (Lit 5) a1', expected: "Sum (Lit 1) (Prod (Lit 5) (Lit 2))" },
        { expr: 'plug "x" (Sum (Lit 1) (Lit 1)) a2', expected: 'Prod (Sum (Lit 1) (Lit 1)) (Use "y")' },
        { expr: 'plug "z" (Lit 0) a1', expected: "a1" },
        { expr: 'plug "n" (Use "k") a3', expected: 'Sum (Use "k") (Use "k")' },
      ],
      hint: "`plug x e (Use v) = if v == x then e else Use v`. Recurse into `Sum` and `Prod`.",
      solution: hs`plug :: Name -> Arith -> Arith -> Arith
plug _ _ (Lit n) = Lit n
plug x e (Use v) = if v == x then e else Use v
plug x e (Sum a b) = Sum (plug x e a) (plug x e b)
plug x e (Prod a b) = Prod (plug x e a) (plug x e b)
`,
    },
    {
      k: "write",
      setup: memSetup,
      body: "Write `bumpAll :: [Cell] -> Memory -> Memory`, which bumps each named cell from left to right (missing counts as 0, updated pair at the front).",
      starter: hs`bumpAll :: [Cell] -> Memory -> Memory
bumpAll cs mem = undefined
`,
      tests: [
        { expr: 'bumpAll ["a", "a"] mem0', expected: '[("a", 3), ("b", 4)]' },
        { expr: 'bumpAll ["z"] mem0', expected: '[("z", 1), ("a", 1), ("b", 4)]' },
        { expr: "bumpAll [] mem1", expected: "mem1" },
        { expr: 'bumpAll ["p", "r"] mem1', expected: '[("r", 8), ("p", 11), ("q", 0)]' },
      ],
      hint: "A helper `bump` plus `foldl`.",
      solution: hs`bumpAll :: [Cell] -> Memory -> Memory
bumpAll cs mem = foldl (flip bump) mem cs

bump :: Cell -> Memory -> Memory
bump c mem = (c, fromMaybe 0 (lookup c mem) + 1) : [p | p <- mem, fst p /= c]
`,
    },
    {
      k: "write",
      setup: memSetup + givenWriteCell,
      body: "`writeCell` is given. Write `runPatches :: [Patch] -> Memory -> Memory`. Run the patches from left to right. For this question you only need to handle `Write` and `Bump` (the tests only use those two).",
      starter: hs`runPatches :: [Patch] -> Memory -> Memory
runPatches ps mem = undefined
`,
      tests: [
        { expr: 'runPatches [Write "a" 5, Bump "a"] []', expected: '[("a", 6)]' },
        { expr: "runPatches [] mem0", expected: "mem0" },
        { expr: 'runPatches [Bump "z", Bump "z"] mem0', expected: '[("z", 2), ("a", 1), ("b", 4)]' },
        { expr: 'runPatches [Write "b" 0, Write "a" 0] mem0', expected: '[("a", 0), ("b", 0)]' },
      ],
      hint: "`foldl` with a helper that matches `Write` and `Bump`.",
      solution: hs`runPatches :: [Patch] -> Memory -> Memory
runPatches ps mem = foldl (flip apply) mem ps

apply :: Patch -> Memory -> Memory
apply (Write c n) mem = writeCell c n mem
apply (Bump c) mem = writeCell c (fromMaybe 0 (lookup c mem) + 1) mem
apply (Zero c) mem = writeCell c 0 mem
apply (Copy src dst) mem = writeCell dst (fromMaybe 0 (lookup src mem)) mem
`,
    },
  ],
};

const givenAtom = hs`
evalAtom :: Env -> Atom -> Int
evalAtom _ (N n) = n
evalAtom env (V v) = fromJust (lookup v env)
evalAtom env (Plus a b) = evalAtom env a + evalAtom env b
evalAtom env (Diff a b) = evalAtom env a - evalAtom env b

setVar :: String -> Int -> Env -> Env
setVar x n env = (x, n) : [p | p <- env, fst p /= x]
`;

const progSetup = hs`data Dir = North | East | South | West
  deriving (Eq, Show)

type Pos = (Int, Int)
type Bug = (Pos, Dir)

data Step = Go Int | TurnL | TurnR | Back Int
  deriving (Eq, Show)

data Prog = Do Step | Seq Prog Prog | Times Int Prog
  deriving (Eq, Show)
-- Times n p runs p, n times, in order. n is never negative.

bug0 :: Bug
bug0 = ((0, 0), North)

turnR :: Dir -> Dir
turnR North = East
turnR East = South
turnR South = West
turnR West = North

turnL :: Dir -> Dir
turnL North = West
turnL West = South
turnL South = East
turnL East = North

delta :: Dir -> Pos
delta North = (0, 1)
delta East = (1, 0)
delta South = (0, -1)
delta West = (-1, 0)
`;

const stmtSetup = hs`import Data.Maybe (fromJust)

type Env = [(String, Int)]

data Atom = N Int | V String | Plus Atom Atom | Diff Atom Atom
  deriving (Eq, Show)

data Stmt = Set String Atom | Speak Atom | When Atom [Stmt] | Loop String [Stmt]
  deriving (Eq, Show)
-- When a ss: if a evaluates to something other than 0, run ss, otherwise skip.
-- Loop x ss: while x is present and not 0, run ss. You may assume it always stops.
`;

const givenApplyPatch = hs`
get :: Cell -> Memory -> Int
get c mem = fromMaybe 0 (lookup c mem)

set :: Cell -> Int -> Memory -> Memory
set c n mem = (c, n) : [p | p <- mem, fst p /= c]

applyPatch :: Patch -> Memory -> Memory
applyPatch (Write c n) mem = set c n mem
applyPatch (Bump c) mem = set c (get c mem + 1) mem
applyPatch (Zero c) mem = set c 0 mem
applyPatch (Copy src dst) mem = set dst (get src mem) mem
`;

// ---------------------------------------------------------------------------
// Level 3
// ---------------------------------------------------------------------------

const level3: DrillSet = {
  id: "b-interp-l3",
  lesson: "",
  level: 3,
  title: "Level 3: Stretch",
  intro: md(
    "Two ideas at once: `Maybe` when a name or a stack slot is missing, a pair `(newState, output)`, compiling one language into another, or a `Bind` that hides a name only in its body. Watch the order you thread state: left to right, and the new binding in front.",
    "",
    "```",
    "eval env (Bind x e body) = eval ((x, eval env e) : env) body",
    "",
    "step cmd (state, out) = (state', out ++ extra)",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: md(
        "What does `get \"a\" []` give with this definition?",
        "",
        "```haskell",
        "get :: String -> [(String, Int)] -> Int",
        "get _ _ = 0",
        "get k ((n, v) : rest)",
        "  | k == n    = v",
        "  | otherwise = get k rest",
        "```",
      ),
      options: ["`0`", "A compile error", "It crashes", "`Nothing`"],
      answer: 0,
      why: "Equations are tried top to bottom. `_ _` matches everything, so the second equation is never used. Put the empty-list (or catch-all) case last.",
    },
    {
      k: "quiz",
      q: 'A name is *free* in `Bind x e body` if it is free in `e`, or free in `body` and is not `x`. In `Bind "k" (Name "k") (Name "k")`, which `k` is free?',
      options: [
        "Neither: `Bind` binds `k` everywhere",
        "Only the `k` in the right-hand side `e`",
        "Only the `k` in the body",
        "Both",
      ],
      answer: 1,
      why: "The binding does not cover its own right-hand side. The `k` in `e` looks up the outer environment. The `k` in the body is bound.",
    },
    {
      k: "predict",
      expr: "foldl (\\(s, c) n -> (s + n, c + 1)) (0, 0) [4, 1, 5]",
      answer: "(10, 3)",
      why: "The accumulator is a pair: a running total and a count of steps. After three numbers it is `(10, 3)`. Interpreters that log output use the same idea.",
    },
    {
      k: "quiz",
      q: "`Plus (C 1) (C 2)` compiled to stack instructions, arguments first, operator last, is which list?",
      options: [
        "`[Add, Push 1, Push 2]`",
        "`[Push 1, Push 2, Add]`",
        "`[Push 1, Add, Push 2]`",
        "`[Push 2, Push 1, Add]`",
      ],
      answer: 1,
      why: "Evaluate the left argument, then the right, then `Add`. The right value sits on top, which matches `Add` on `(x : y : ys)` using `x + y`.",
    },
    {
      k: "quiz",
      q: "`sendTo` should move money only if both accounts exist and the source has enough. If it cannot, what must it return?",
      options: [
        "The bank with the source already debited",
        "The original bank, unchanged",
        "An empty bank",
        "A bank with negative balances",
      ],
      answer: 1,
      why: "The whole transfer is one step. If any check fails, you must not keep a half-done update. That is why people return `Maybe Bank`: `Nothing` means \"do nothing\".",
    },
    {
      k: "write",
      setup: formulaSetup,
      body: md(
        "Write `freeNames :: Formula -> [String]`, the names that are used but not bound, in alphabetical order without duplicates.",
        "",
        "In `Bind x e body`, uses of `x` inside `e` are free (this `Bind` does not cover them). Uses of `x` inside `body` are bound.",
      ),
      starter: hs`freeNames :: Formula -> [String]
freeNames e = undefined
`,
      tests: [
        { expr: "freeNames f1", expected: `["n"]` },
        { expr: "freeNames f2", expected: `["b"]` },
        { expr: "freeNames f3", expected: `["x"]` },
        { expr: 'freeNames (Bind "z" (Name "z") (Name "z"))', expected: `["z"]` },
        { expr: "freeNames (Amt 3)", expected: "[]" },
        { expr: 'freeNames (Join Mul (Name "q") (Bind "p" (Name "r") (Join Add (Name "p") (Name "q"))))', expected: `["q", "r"]` },
      ],
      hint: "A helper that may contain repeats: for `Bind x e b` it is `fv e ++ filter (/= x) (fv b)`. Then `sort (nub ...)`.",
      solution: hs`freeNames :: Formula -> [String]
freeNames e = sort (nub (fv e))

fv :: Formula -> [String]
fv (Amt _) = []
fv (Name v) = [v]
fv (Join _ a b) = fv a ++ fv b
fv (Bind x e b) = fv e ++ filter (/= x) (fv b)
`,
    },
    {
      k: "write",
      setup: arithSetup,
      body: "Write `evalM :: Env -> Arith -> Maybe Int`. Like `evalArith`, but `Nothing` if any `Use` is missing from the environment, even if another part is `Lit 0`.",
      starter: hs`evalM :: Env -> Arith -> Maybe Int
evalM env e = undefined
`,
      tests: [
        { expr: "evalM envA a1", expected: "Just 11" },
        { expr: "evalM [] a1", expected: "Nothing" },
        { expr: 'evalM [("x", 3)] a2', expected: "Nothing" },
        { expr: "evalM [] (Lit 5)", expected: "Just 5" },
        { expr: 'evalM [("n", 1)] (Prod (Lit 0) (Use "q"))', expected: "Nothing" },
      ],
      hint: "`evalM env (Use v) = lookup v env`. For `Sum`, a helper `both (+) (evalM env a) (evalM env b)`.",
      solution: hs`evalM :: Env -> Arith -> Maybe Int
evalM _ (Lit n) = Just n
evalM env (Use v) = lookup v env
evalM env (Sum a b) = both (+) (evalM env a) (evalM env b)
evalM env (Prod a b) = both (*) (evalM env a) (evalM env b)

both :: (Int -> Int -> Int) -> Maybe Int -> Maybe Int -> Maybe Int
both f (Just x) (Just y) = Just (f x y)
both _ _ _ = Nothing
`,
    },
    {
      k: "write",
      setup: memSetup + givenApplyPatch,
      body: md(
        "`applyPatch` is given. Write `patchIfPresent :: Patch -> Memory -> Memory`.",
        "",
        "If the cell the patch **writes to** is already in the memory, apply it. If that cell is missing, return the memory unchanged. For `Copy src dst`, the cell that must be present is `dst` (`src` missing still counts as 0, as in `applyPatch`).",
      ),
      starter: hs`patchIfPresent :: Patch -> Memory -> Memory
patchIfPresent p mem = undefined
`,
      tests: [
        { expr: 'patchIfPresent (Bump "a") mem0', expected: '[("a", 2), ("b", 4)]' },
        { expr: 'patchIfPresent (Bump "z") mem0', expected: "mem0" },
        { expr: 'patchIfPresent (Write "q" 3) mem1', expected: '[("q", 3), ("p", 10), ("r", 7)]' },
        { expr: 'patchIfPresent (Copy "a" "b") mem0', expected: '[("b", 1), ("a", 1)]' },
        { expr: 'patchIfPresent (Copy "a" "z") mem0', expected: "mem0" },
      ],
      hint: "A helper `target (Write c _) = c`, and so on. Then `if lookup (target p) mem == Nothing then mem else applyPatch p mem`.",
      solution: hs`patchIfPresent :: Patch -> Memory -> Memory
patchIfPresent p mem = case lookup (target p) mem of
  Nothing -> mem
  Just _ -> applyPatch p mem

target :: Patch -> Cell
target (Write c _) = c
target (Bump c) = c
target (Zero c) = c
target (Copy _ dst) = dst
`,
    },
    {
      k: "write",
      setup: stackSetup,
      body: "Write `stepM :: Instr -> Stack -> Maybe Stack`. Follow the same rules as `runStack`, but give `Nothing` if the stack has too few values. `Push` never fails. An empty stack fails `Dup`, `Drop` and `Neg`.",
      starter: hs`stepM :: Instr -> Stack -> Maybe Stack
stepM i stk = undefined
`,
      tests: [
        { expr: "stepM (Push 3) []", expected: "Just [3]" },
        { expr: "stepM Add [2, 5]", expected: "Just [7]" },
        { expr: "stepM Add [2]", expected: "Nothing" },
        { expr: "stepM Dup []", expected: "Nothing" },
        { expr: "stepM Swap [1, 8]", expected: "Just [8, 1]" },
        { expr: "stepM Sub [3, 5]", expected: "Just [2]" },
        { expr: "stepM Neg [4]", expected: "Just [-4]" },
      ],
      hint: "One equation per constructor that has enough stack, then a final `stepM _ _ = Nothing`.",
      solution: hs`stepM :: Instr -> Stack -> Maybe Stack
stepM (Push n) stk = Just (n : stk)
stepM Add (x : y : ys) = Just ((x + y) : ys)
stepM Mul (x : y : ys) = Just ((x * y) : ys)
stepM Sub (x : y : ys) = Just ((y - x) : ys)
stepM Dup (x : xs) = Just (x : x : xs)
stepM Swap (x : y : ys) = Just (y : x : ys)
stepM Drop (_ : xs) = Just xs
stepM Neg (x : xs) = Just (negate x : xs)
stepM _ _ = Nothing
`,
    },
    {
      k: "write",
      setup: bankSetup,
      body: md(
        "Write `sendM :: String -> String -> Pence -> Bank -> Maybe Bank`.",
        "",
        "If both accounts exist and `from` has at least `n`, return `Just` the updated bank (debit `from` first, then credit `to`, updated pair at the front each time). Otherwise `Nothing`, and you must not describe a half-updated bank.",
      ),
      starter: hs`sendM :: String -> String -> Pence -> Bank -> Maybe Bank
sendM from to n bank = undefined
`,
      tests: [
        { expr: 'sendM "ada" "ben" 30 bank0', expected: 'Just [("ben", 70), ("ada", 70)]' },
        { expr: 'sendM "ada" "ben" 101 bank0', expected: "Nothing" },
        { expr: 'sendM "ada" "zed" 10 bank0', expected: "Nothing" },
        { expr: 'sendM "zed" "ada" 10 bank0', expected: "Nothing" },
        { expr: 'sendM "ada" "ben" 0 bank0', expected: 'Just [("ben", 40), ("ada", 100)]' },
      ],
      hint: "Match on both `lookup`s. Only in the success branch build a new bank.",
      solution: hs`sendM :: String -> String -> Pence -> Bank -> Maybe Bank
sendM from to n bank =
  case (lookup from bank, lookup to bank) of
    (Just a, Just b)
      | a >= n -> Just (set to (b + n) (set from (a - n) bank))
    _ -> Nothing

set :: String -> Pence -> Bank -> Bank
set who n bank = (who, n) : [p | p <- bank, fst p /= who]
`,
    },
    {
      k: "write",
      setup: memSetup + givenApplyPatch,
      body: md(
        "`applyPatch` is given. Write `snapshots :: [Patch] -> Memory -> [Memory]`: the memory **before** the first patch, then after each patch, in order.",
        "",
        "```",
        "snapshots [Bump \"a\"] mem0  is  [mem0, applyPatch (Bump \"a\") mem0]",
        "```",
      ),
      starter: hs`snapshots :: [Patch] -> Memory -> [Memory]
snapshots ps mem = undefined
`,
      tests: [
        { expr: "snapshots [] mem0", expected: "[mem0]" },
        { expr: 'snapshots [Bump "a"] mem0', expected: '[[("a", 1), ("b", 4)], [("a", 2), ("b", 4)]]' },
        { expr: 'length (snapshots [Write "a" 0, Write "a" 1, Write "a" 2] [])', expected: "4" },
        { expr: 'last (snapshots [Write "x" 1, Bump "x"] [])', expected: '[("x", 2)]' },
      ],
      hint: "`snapshots [] mem = [mem]` and `snapshots (p : ps) mem = mem : snapshots ps (applyPatch p mem)`.",
      solution: hs`snapshots :: [Patch] -> Memory -> [Memory]
snapshots [] mem = [mem]
snapshots (p : ps) mem = mem : snapshots ps (applyPatch p mem)
`,
    },
    {
      k: "write",
      setup: calcSetup + stackSetup + givenEvalCalc + givenRunStack,
      body: md(
        "`evalCalc` and `runStack` are given. Write `compile :: Calc -> [Instr]` so that running the instructions on an empty stack leaves the value of the calculation on top.",
        "",
        "Compile each argument first, then the operator. `Sub` on the stack computes `y - x` when the top is `x`, so compile the left argument of `Minus` before the right.",
      ),
      starter: hs`compile :: Calc -> [Instr]
compile c = undefined
`,
      tests: [
        { expr: "compile (C 7)", expected: "[Push 7]" },
        { expr: "compile (Plus (C 1) (C 2))", expected: "[Push 1, Push 2, Add]" },
        { expr: "head (runStack (compile c1) []) == evalCalc c1", label: "compiled c1 evaluates to 14" },
        { expr: "head (runStack (compile c2) []) == evalCalc c2", label: "compiled c2 evaluates to 7" },
        { expr: "head (runStack (compile c3) []) == evalCalc c3", label: "compiled c3 evaluates to 6" },
      ],
      hint: "`compile (Plus a b) = compile a ++ compile b ++ [Add]`. Same shape for `Minus`/`Times` with `Sub`/`Mul`.",
      solution: hs`compile :: Calc -> [Instr]
compile (C n) = [Push n]
compile (Plus a b) = compile a ++ compile b ++ [Add]
compile (Minus a b) = compile a ++ compile b ++ [Sub]
compile (Times a b) = compile a ++ compile b ++ [Mul]
`,
    },
    {
      k: "write",
      setup: calcSetup,
      body: md(
        "Write `simplify :: Calc -> Calc`. Simplify the parts first, then apply these rules to the result:",
        "",
        "- adding `C 0` on either side gives the other side",
        "- multiplying by `C 1` on either side gives the other side",
        "- multiplying by `C 0` on either side gives `C 0`",
        "- subtracting `C 0` on the right gives the left side",
        "",
        "Anything else is left as it is.",
      ),
      starter: hs`simplify :: Calc -> Calc
simplify c = undefined
`,
      tests: [
        { expr: "simplify (Plus (C 0) (C 4))", expected: "C 4" },
        { expr: "simplify (Times (Plus (C 0) (C 1)) (C 9))", expected: "C 9" },
        { expr: "simplify (Times (C 3) (C 0))", expected: "C 0" },
        { expr: "simplify c1", expected: "c1" },
        { expr: "simplify (Minus (Plus (C 2) (C 0)) (C 0))", expected: "C 2" },
      ],
      hint: "Write `simplify (Plus a b) = add (simplify a) (simplify b)` and a helper `add` with one equation per rule.",
      solution: hs`simplify :: Calc -> Calc
simplify (C n) = C n
simplify (Plus a b) = add (simplify a) (simplify b)
simplify (Minus a b) = sub (simplify a) (simplify b)
simplify (Times a b) = mul (simplify a) (simplify b)

add :: Calc -> Calc -> Calc
add (C 0) e = e
add e (C 0) = e
add a b = Plus a b

sub :: Calc -> Calc -> Calc
sub e (C 0) = e
sub a b = Minus a b

mul :: Calc -> Calc -> Calc
mul (C 0) _ = C 0
mul _ (C 0) = C 0
mul (C 1) e = e
mul e (C 1) = e
mul a b = Times a b
`,
    },
    {
      k: "write",
      setup: bugSetup + givenTurn,
      body: md(
        "`turnL`, `turnR` and `delta` are given. Write `path :: [Step] -> Bug -> [Pos]`: the start square, then every square the bug **enters** (each single step of a `Go` or `Back`). Turns do not add a square.",
        "",
        "```",
        "path [Go 2, TurnR, Go 1] bug0  is  [(0,0), (0,1), (0,2), (1,2)]",
        "```",
      ),
      starter: hs`path :: [Step] -> Bug -> [Pos]
path steps bug = undefined
`,
      tests: [
        { expr: "path [] bug0", expected: "[(0, 0)]" },
        { expr: "path [Go 2, TurnR, Go 1] bug0", expected: "[(0, 0), (0, 1), (0, 2), (1, 2)]" },
        { expr: "path [TurnL] bug0", expected: "[(0, 0)]" },
        { expr: "path [Go 1, Back 1] bug0", expected: "[(0, 0), (0, 1), (0, 0)]" },
        { expr: "path [Back 2] ((1, 1), East)", expected: "[(1, 1), (0, 1), (-1, 1)]" },
      ],
      hint: "Thread the current bug. For `Go n`, walk one square `n` times, recording each new position. Turns only update heading.",
      solution: hs`path :: [Step] -> Bug -> [Pos]
path steps bug = fst bug : walk steps bug
  where
    walk [] _ = []
    walk (Go n : ss) b = let (ps, b') = go n b in ps ++ walk ss b'
    walk (Back n : ss) b = let (ps, b') = back n b in ps ++ walk ss b'
    walk (TurnR : ss) (p, d) = walk ss (p, turnR d)
    walk (TurnL : ss) (p, d) = walk ss (p, turnL d)

go :: Int -> Bug -> ([Pos], Bug)
go 0 bug = ([], bug)
go n ((x, y), d) = ((x', y') : ps, bug')
  where
    (dx, dy) = delta d
    (x', y') = (x + dx, y + dy)
    (ps, bug') = go (n - 1) ((x', y'), d)

back :: Int -> Bug -> ([Pos], Bug)
back 0 bug = ([], bug)
back n ((x, y), d) = ((x', y') : ps, bug')
  where
    (dx, dy) = delta d
    (x', y') = (x - dx, y - dy)
    (ps, bug') = back (n - 1) ((x', y'), d)
`,
    },
    {
      k: "write",
      setup: bugSetup + givenTurn,
      body: "`turnL`, `turnR` and `delta` are given. Write `repeatSteps :: Int -> [Step] -> Bug -> Bug`, which runs the same list of steps `n` times in a row (`n` never negative).",
      starter: hs`repeatSteps :: Int -> [Step] -> Bug -> Bug
repeatSteps n steps bug = undefined
`,
      tests: [
        { expr: "repeatSteps 0 [Go 5] bug0", expected: "bug0" },
        { expr: "repeatSteps 4 [TurnR] bug0", expected: "bug0" },
        { expr: "repeatSteps 3 [Go 1, TurnR] bug0", expected: "((1, 0), West)" },
        { expr: "repeatSteps 2 [Go 2] bug0", expected: "((0, 4), North)" },
      ],
      hint: "Write `runBug` for one pass, then recurse on `n`. `Go`/`Back` move one square at a time using `delta`.",
      solution: hs`repeatSteps :: Int -> [Step] -> Bug -> Bug
repeatSteps 0 _ bug = bug
repeatSteps n steps bug = repeatSteps (n - 1) steps (runBug steps bug)

runBug :: [Step] -> Bug -> Bug
runBug steps bug = foldl (flip doStep) bug steps

doStep :: Step -> Bug -> Bug
doStep (Go n) bug = walk n 1 bug
doStep (Back n) bug = walk n (-1) bug
doStep TurnR (p, d) = (p, turnR d)
doStep TurnL (p, d) = (p, turnL d)

walk :: Int -> Int -> Bug -> Bug
walk 0 _ bug = bug
walk n s ((x, y), d) = walk (n - 1) s ((x + s * dx, y + s * dy), d)
  where
    (dx, dy) = delta d
`,
    },
    {
      k: "write",
      setup: memSetup + givenApplyPatch,
      body: "`applyPatch` is given. Write `whenZero :: Cell -> Patch -> Memory -> Memory`. If cell `c` is missing or holds 0, apply the patch; otherwise leave the memory alone.",
      starter: hs`whenZero :: Cell -> Patch -> Memory -> Memory
whenZero c p mem = undefined
`,
      tests: [
        { expr: 'whenZero "q" (Bump "p") mem1', expected: '[("p", 11), ("q", 0), ("r", 7)]' },
        { expr: 'whenZero "p" (Bump "p") mem1', expected: "mem1" },
        { expr: 'whenZero "z" (Write "z" 5) mem0', expected: '[("z", 5), ("a", 1), ("b", 4)]' },
        { expr: 'whenZero "a" (Zero "b") mem0', expected: "mem0" },
      ],
      hint: "`fromMaybe 0 (lookup c mem) == 0`.",
      solution: hs`whenZero :: Cell -> Patch -> Memory -> Memory
whenZero c p mem
  | fromMaybe 0 (lookup c mem) == 0 = applyPatch p mem
  | otherwise = mem
`,
    },
    {
      k: "write",
      setup: vendSetup,
      body: md(
        "Write `stepVend :: Vend -> Machine -> Machine`.",
        "",
        "- `Insert n` adds `n` to the credit.",
        "- `Choose slot` buys if the slot has a price and the credit is at least that price: subtract the price, leave the price list alone. Otherwise do nothing.",
        "- `CoinReturn` sets the credit to 0.",
      ),
      starter: hs`stepVend :: Vend -> Machine -> Machine
stepVend v m = undefined
`,
      tests: [
        { expr: "stepVend (Insert 50) m0", expected: "(50, prices0)" },
        { expr: "stepVend (Choose \"tea\") (120, prices0)", expected: "(0, prices0)" },
        { expr: "stepVend (Choose \"tea\") (119, prices0)", expected: "(119, prices0)" },
        { expr: "stepVend (Choose \"pie\") (500, prices0)", expected: "(500, prices0)" },
        { expr: "stepVend CoinReturn (80, prices0)", expected: "(0, prices0)" },
      ],
      hint: "Pattern match on the command. For `Choose`, `lookup slot prices`.",
      solution: hs`stepVend :: Vend -> Machine -> Machine
stepVend (Insert n) (c, ps) = (c + n, ps)
stepVend (Choose slot) (c, ps) = case lookup slot ps of
  Just p | c >= p -> (c - p, ps)
  _ -> (c, ps)
stepVend CoinReturn (_, ps) = (0, ps)
`,
    },
    {
      k: "write",
      setup: formulaSetup,
      body: md(
        "Write `dropBind :: Formula -> Formula`, which removes every `Bind`. Replace `Bind x e body` by `body` with each free `Name x` replaced by `e`. Drop binds in the parts first, so the expressions you substitute contain no `Bind`.",
        "",
        "```",
        "dropBind f1  is  Join Mul (Amt 6) (Name \"n\")",
        "```",
      ),
      starter: hs`dropBind :: Formula -> Formula
dropBind e = undefined
`,
      tests: [
        { expr: "dropBind f1", expected: 'Join Mul (Amt 6) (Name "n")' },
        { expr: "dropBind f2", expected: 'Join Sub (Join Add (Name "b") (Amt 2)) (Amt 9)' },
        { expr: 'dropBind (Bind "x" (Amt 2) (Bind "x" (Join Add (Name "x") (Amt 1)) (Name "x")))', expected: "Join Add (Amt 2) (Amt 1)" },
        { expr: 'dropBind (Join Add (Amt 1) (Name "q"))', expected: 'Join Add (Amt 1) (Name "q")' },
        { expr: 'dropBind (Bind "x" (Amt 3) (Join Add (Name "x") (Name "x")))', expected: "Join Add (Amt 3) (Amt 3)" },
      ],
      hint: "Write `subst` for formulas with no `Bind`. Then `dropBind (Bind x e b) = subst x (dropBind e) (dropBind b)`.",
      solution: hs`dropBind :: Formula -> Formula
dropBind (Amt n) = Amt n
dropBind (Name v) = Name v
dropBind (Join op a b) = Join op (dropBind a) (dropBind b)
dropBind (Bind x e b) = subst x (dropBind e) (dropBind b)

subst :: String -> Formula -> Formula -> Formula
subst _ _ (Amt n) = Amt n
subst x e (Name v) = if v == x then e else Name v
subst x e (Join op a b) = Join op (subst x e a) (subst x e b)
subst x e (Bind y d b) = Bind y (subst x e d) (if y == x then b else subst x e b)
`,
    },
    {
      k: "write",
      setup: memSetup,
      body: "Write `without :: Cell -> Memory -> Memory`, which drops every pair for that cell and keeps the rest in order.",
      starter: hs`without :: Cell -> Memory -> Memory
without c mem = undefined
`,
      tests: [
        { expr: 'without "a" mem0', expected: '[("b", 4)]' },
        { expr: 'without "z" mem0', expected: "mem0" },
        { expr: 'without "q" mem1', expected: '[("p", 10), ("r", 7)]' },
        { expr: 'without "a" [("a", 1), ("b", 2), ("a", 3)]', expected: '[("b", 2)]' },
      ],
      hint: "`filter (\\p -> fst p /= c) mem`.",
      solution: hs`without :: Cell -> Memory -> Memory
without c mem = [p | p <- mem, fst p /= c]
`,
    },
    {
      k: "write",
      setup: bugSetup,
      body: "Write `manhattan :: Bug -> Int`, the distance from `(0, 0)` to the bug's square, `|x| + |y|`. Heading does not matter.",
      starter: hs`manhattan :: Bug -> Int
manhattan bug = undefined
`,
      tests: [
        { expr: "manhattan bug0", expected: "0" },
        { expr: "manhattan ((3, -4), East)", expected: "7" },
        { expr: "manhattan ((-2, 0), North)", expected: "2" },
        { expr: "manhattan ((1, 1), West)", expected: "2" },
      ],
      hint: "`abs x + abs y`.",
      solution: hs`manhattan :: Bug -> Int
manhattan ((x, y), _) = abs x + abs y
`,
    },
    {
      k: "write",
      setup: stackSetup,
      body: "Write `rot3 :: Stack -> Stack`. Move the third value up to the top: `[x, y, z, ...]` becomes `[z, x, y, ...]`. You may assume the stack has at least three values.",
      starter: hs`rot3 :: Stack -> Stack
rot3 stk = undefined
`,
      tests: [
        { expr: "rot3 [1, 2, 3]", expected: "[3, 1, 2]" },
        { expr: "rot3 [1, 2, 3, 4]", expected: "[3, 1, 2, 4]" },
        { expr: "rot3 [9, 8, 7, 6, 5]", expected: "[7, 9, 8, 6, 5]" },
        { expr: "rot3 [0, 0, 1]", expected: "[1, 0, 0]" },
      ],
      hint: "`rot3 (x : y : z : ys) = z : x : y : ys`.",
      solution: hs`rot3 :: Stack -> Stack
rot3 (x : y : z : ys) = z : x : y : ys
`,
    },
    {
      k: "write",
      setup: formulaSetup,
      body: "This `evalF` has two mistakes. Find and fix them.",
      starter: hs`evalF :: Env -> Formula -> Int
evalF _ (Amt n) = n
evalF env (Name v) = fromJust (lookup v env)
evalF env (Join Add a b) = evalF env a + evalF env b
evalF env (Join Sub a b) = evalF env a + evalF env b
evalF env (Join Mul a b) = evalF env a * evalF env b
evalF env (Bind x e body) = evalF env body
`,
      tests: [
        { expr: 'evalF [("n", 3)] f1', expected: "18" },
        { expr: 'evalF [("b", 5)] f2', expected: "-2" },
        { expr: "evalF [] (Join Sub (Amt 9) (Amt 4))", expected: "5" },
        { expr: 'evalF [("x", 7)] f3', expected: "8" },
      ],
      hint: "`Sub` should subtract, and `Bind` must evaluate the body in an extended environment.",
      solution: hs`evalF :: Env -> Formula -> Int
evalF _ (Amt n) = n
evalF env (Name v) = fromJust (lookup v env)
evalF env (Join Add a b) = evalF env a + evalF env b
evalF env (Join Sub a b) = evalF env a - evalF env b
evalF env (Join Mul a b) = evalF env a * evalF env b
evalF env (Bind x e body) = evalF ((x, evalF env e) : env) body
`,
    },
    {
      k: "write",
      setup: memSetup,
      body: "Write `mergeMem :: Memory -> Memory -> Memory`. Start from the left memory. Then add each pair from the right whose cell is **not** already in the left, keeping the right's order for those extra pairs.",
      starter: hs`mergeMem :: Memory -> Memory -> Memory
mergeMem left right = undefined
`,
      tests: [
        { expr: "mergeMem mem0 mem0", expected: "mem0" },
        { expr: 'mergeMem mem0 [("c", 9)]', expected: '[("a", 1), ("b", 4), ("c", 9)]' },
        { expr: 'mergeMem mem0 [("a", 99), ("c", 1)]', expected: '[("a", 1), ("b", 4), ("c", 1)]' },
        { expr: 'mergeMem [] mem1', expected: "mem1" },
      ],
      hint: "`left ++ [p | p <- right, notElem (fst p) (map fst left)]`.",
      solution: hs`mergeMem :: Memory -> Memory -> Memory
mergeMem left right = left ++ [p | p <- right, notElem (fst p) (map fst left)]
`,
    },
    {
      k: "write",
      setup: lineSetup + givenAtom,
      body: md(
        "`evalAtom` and `setVar` are given. Write `runLines :: [Line] -> Env -> (Env, [Int])`. Run the lines from left to right.",
        "",
        "`Store` updates the environment and prints nothing. `Speak a` prints the value of `a` (in the current environment) and leaves the environment alone. `Skip` does nothing.",
        "",
        "Return the final environment and every spoken number, in order.",
      ),
      starter: hs`runLines :: [Line] -> Env -> (Env, [Int])
runLines ls env = undefined
`,
      tests: [
        { expr: "runLines [] []", expected: "([], [])" },
        { expr: 'snd (runLines [Store "x" (N 3), Speak (V "x"), Speak (Plus (V "x") (N 1))] [])', expected: "[3, 4]" },
        { expr: 'fst (runLines [Store "x" (N 3), Speak (V "x")] [])', expected: '[("x", 3)]' },
        { expr: 'runLines [Speak (N 7)] [("k", 1)]', expected: '([("k", 1)], [7])' },
        { expr: 'snd (runLines [Skip, Store "n" (N 2), Skip, Speak (V "n")] [])', expected: "[2]" },
      ],
      hint: "For `l : rest`, run `l` to get `(env1, out1)`, then the rest from `env1` to get `(env2, out2)`, and join the outputs.",
      solution: hs`runLines :: [Line] -> Env -> (Env, [Int])
runLines [] env = (env, [])
runLines (l : rest) env = (env2, out1 ++ out2)
  where
    (env1, out1) = step l env
    (env2, out2) = runLines rest env1

step :: Line -> Env -> (Env, [Int])
step (Store x a) env = (setVar x (evalAtom env a) env, [])
step (Speak a) env = (env, [evalAtom env a])
step Skip env = (env, [])
`,
    },
    {
      k: "write",
      setup: ovenSetup,
      body: md(
        "Write `runKnobs :: [Knob] -> Oven -> Oven`.",
        "",
        "- `SetHeat h` changes the heat.",
        "- `AddMins n` adds `n` to the remaining time (`n` never negative).",
        "- `Tick`: if time is 0, heat becomes `Off`; otherwise time goes down by 1.",
        "- `Cancel` is heat `Off` and time 0.",
      ),
      starter: hs`runKnobs :: [Knob] -> Oven -> Oven
runKnobs ks oven = undefined
`,
      tests: [
        { expr: "runKnobs [] (High, 5)", expected: "(High, 5)" },
        { expr: "runKnobs [Tick, Tick] (Low, 1)", expected: "(Off, 0)" },
        { expr: "runKnobs [AddMins 3, Tick] (Off, 0)", expected: "(Off, 2)" },
        { expr: "runKnobs [SetHeat High, AddMins 2, Cancel] (Off, 9)", expected: "(Off, 0)" },
        { expr: "runKnobs [Tick] (High, 0)", expected: "(Off, 0)" },
      ],
      hint: "A helper `knob` plus `foldl`.",
      solution: hs`runKnobs :: [Knob] -> Oven -> Oven
runKnobs ks oven = foldl (flip knob) oven ks

knob :: Knob -> Oven -> Oven
knob (SetHeat h) (_, t) = (h, t)
knob (AddMins n) (h, t) = (h, t + n)
knob Tick (h, 0) = (Off, 0)
knob Tick (h, t) = (h, t - 1)
knob Cancel _ = (Off, 0)
`,
    },
    {
      k: "write",
      setup: bankSetup,
      body: "Write `credited :: String -> [Tx] -> Pence`, the total of every `Credit` to that name. Ignore `Open`, `Debit`, `Move`, and credits to other people.",
      starter: hs`credited :: String -> [Tx] -> Pence
credited who txs = undefined
`,
      tests: [
        { expr: 'credited "ada" [Credit "ada" 10, Credit "ben" 5, Credit "ada" 7]', expected: "17" },
        { expr: 'credited "ada" [Open "ada", Debit "ada" 3]', expected: "0" },
        { expr: 'credited "cy" []', expected: "0" },
        { expr: 'credited "ben" [Move "ada" "ben" 20, Credit "ben" 1]', expected: "1" },
      ],
      hint: "A list comprehension: `[n | Credit w n <- txs, w == who]`, then `sum`.",
      solution: hs`credited :: String -> [Tx] -> Pence
credited who txs = sum [n | Credit w n <- txs, w == who]
`,
    },
    {
      k: "write",
      setup: bugSetup + givenTurn + givenStepBug,
      body: md(
        "`stepOne`, `turnL`, `turnR` and `delta` are given. Write `clipStep :: (Int, Int) -> Bug -> Bug`.",
        "",
        "Try to walk one square forward. If the new square would have `x` outside `0 .. w-1` or `y` outside `0 .. h-1`, stay put (same heading). The board is `w` wide and `h` high.",
      ),
      starter: hs`clipStep :: (Int, Int) -> Bug -> Bug
clipStep (w, h) bug = undefined
`,
      tests: [
        { expr: "clipStep (5, 4) bug0", expected: "((0, 1), North)" },
        { expr: "clipStep (5, 4) ((0, 3), North)", expected: "((0, 3), North)" },
        { expr: "clipStep (5, 4) ((0, 0), West)", expected: "((0, 0), West)" },
        { expr: "clipStep (2, 2) ((1, 0), East)", expected: "((1, 0), East)" },
        { expr: "clipStep (2, 2) ((0, 0), East)", expected: "((1, 0), East)" },
      ],
      hint: "Compute `stepOne bug`, then check the new `x` and `y` with `>= 0` and `< w` / `< h`.",
      solution: hs`clipStep :: (Int, Int) -> Bug -> Bug
clipStep (w, h) bug
  | x' >= 0 && x' < w && y' >= 0 && y' < h = bug'
  | otherwise = bug
  where
    bug' = stepOne bug
    ((x', y'), _) = bug'
`,
    },
    {
      k: "write",
      setup: formulaSetup,
      body: md(
        "Write `substF :: String -> Formula -> Formula -> Formula`. `substF x e f` replaces free uses of `Name x` by `e`.",
        "",
        "Inside `Bind y d b`, always substitute in `d`. Substitute in `b` only when `y /= x` (otherwise `x` is hidden).",
      ),
      starter: hs`substF :: String -> Formula -> Formula -> Formula
substF x e f = undefined
`,
      tests: [
        { expr: 'substF "n" (Amt 3) f1', expected: 'Bind "k" (Amt 6) (Join Mul (Name "k") (Amt 3))' },
        { expr: 'substF "k" (Amt 0) f1', expected: "f1" },
        { expr: 'substF "x" (Amt 9) f3', expected: 'Join Add (Bind "x" (Amt 1) (Name "x")) (Amt 9)' },
        { expr: 'substF "b" (Amt 5) (Name "b")', expected: "Amt 5" },
        { expr: 'substF "b" (Amt 5) f2', expected: 'Bind "a" (Join Add (Amt 5) (Amt 2)) (Bind "b" (Amt 9) (Join Sub (Name "a") (Name "b")))' },
      ],
      hint: "`substF x e (Bind y d b) = Bind y (substF x e d) (if y == x then b else substF x e b)`.",
      solution: hs`substF :: String -> Formula -> Formula -> Formula
substF _ _ (Amt n) = Amt n
substF x e (Name v) = if v == x then e else Name v
substF x e (Join op a b) = Join op (substF x e a) (substF x e b)
substF x e (Bind y d b) = Bind y (substF x e d) (if y == x then b else substF x e b)
`,
    },
    {
      k: "write",
      setup: bankSetup,
      body: md(
        "Write `runTxs :: [Tx] -> Bank -> Bank`. Run the transactions from left to right.",
        "",
        "- `Open who`: add `(who, 0)` at the front if missing, otherwise leave the bank.",
        "- `Credit` / `Debit`: you may assume the account exists; `Debit` that would go negative is skipped (bank unchanged for that step).",
        "- `Move from to n`: if both exist and `from` has enough, debit then credit (updated pair at the front each time); otherwise skip.",
      ),
      starter: hs`runTxs :: [Tx] -> Bank -> Bank
runTxs txs bank = undefined
`,
      tests: [
        { expr: 'runTxs [Open "cy", Credit "cy" 15] bank0', expected: '[("cy", 15), ("ada", 100), ("ben", 40)]' },
        { expr: 'runTxs [Debit "ada" 30, Debit "ada" 80] bank0', expected: '[("ada", 70), ("ben", 40)]' },
        { expr: 'runTxs [Move "ada" "ben" 40] bank0', expected: '[("ben", 80), ("ada", 60)]' },
        { expr: 'runTxs [Move "ada" "ben" 200] bank0', expected: "bank0" },
        { expr: "runTxs [] bank1", expected: "bank1" },
      ],
      hint: "A helper `tx` plus `foldl`. Reuse the `set` pattern from `payIn`.",
      solution: hs`runTxs :: [Tx] -> Bank -> Bank
runTxs txs bank = foldl (flip tx) bank txs

tx :: Tx -> Bank -> Bank
tx (Open who) bank = case lookup who bank of
  Just _ -> bank
  Nothing -> (who, 0) : bank
tx (Credit who n) bank = set who (get who bank + n) bank
tx (Debit who n) bank
  | get who bank >= n = set who (get who bank - n) bank
  | otherwise = bank
tx (Move from to n) bank =
  case (lookup from bank, lookup to bank) of
    (Just a, Just b)
      | a >= n -> set to (b + n) (set from (a - n) bank)
    _ -> bank

get :: String -> Bank -> Pence
get who bank = fromMaybe 0 (lookup who bank)

set :: String -> Pence -> Bank -> Bank
set who n bank = (who, n) : [p | p <- bank, fst p /= who]
`,
    },
    {
      k: "write",
      setup: stackSetup,
      body: "Write `runStackM :: [Instr] -> Stack -> Maybe Stack`. Run the instructions from left to right. If any step would underflow, the whole run is `Nothing` (do not return a partial stack).",
      starter: hs`runStackM :: [Instr] -> Stack -> Maybe Stack
runStackM is stk = undefined
`,
      tests: [
        { expr: "runStackM [Push 5, Push 3, Sub] []", expected: "Just [2]" },
        { expr: "runStackM [Add] []", expected: "Nothing" },
        { expr: "runStackM [Push 1, Add] []", expected: "Nothing" },
        { expr: "runStackM [Push 2, Dup, Mul] []", expected: "Just [4]" },
        { expr: "runStackM [] [9]", expected: "Just [9]" },
      ],
      hint: "A helper `stepM` returning `Maybe Stack`, then thread it: `runStackM [] stk = Just stk`, and for `i : is` use `case stepM i stk of Just stk' -> runStackM is stk'; Nothing -> Nothing`.",
      solution: hs`runStackM :: [Instr] -> Stack -> Maybe Stack
runStackM [] stk = Just stk
runStackM (i : is) stk = case stepM i stk of
  Just stk' -> runStackM is stk'
  Nothing -> Nothing

stepM :: Instr -> Stack -> Maybe Stack
stepM (Push n) stk = Just (n : stk)
stepM Add (x : y : ys) = Just ((x + y) : ys)
stepM Mul (x : y : ys) = Just ((x * y) : ys)
stepM Sub (x : y : ys) = Just ((y - x) : ys)
stepM Dup (x : xs) = Just (x : x : xs)
stepM Swap (x : y : ys) = Just (y : x : ys)
stepM Drop (_ : xs) = Just xs
stepM Neg (x : xs) = Just (negate x : xs)
stepM _ _ = Nothing
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 4
// ---------------------------------------------------------------------------

const level4: DrillSet = {
  id: "b-interp-l4",
  lesson: "",
  level: 4,
  title: "Level 4: Exam strength",
  intro: md(
    "Questions worded the way the January test words them, on small invented languages. Read the given types carefully, check the examples against your understanding before you write anything, and test your answer on the examples. The last eight are as hard as a 3 to 5 mark exam question.",
    "",
    "```",
    "-- Define a function evalF :: Env -> Formula -> Int",
    "evalF env (Bind x e body) = evalF ((x, evalF env e) : env) body",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: md(
        "The paper gives you:",
        "",
        "```haskell",
        "data Formula = Amt Int",
        "             | Name String",
        "             | Join Mix Formula Formula",
        "             | Bind String Formula Formula",
        "```",
        "",
        "What is the type of the constructor `Bind`?",
      ),
      options: [
        "`Formula`",
        "`String -> Formula -> Formula -> Formula`",
        "`(String, Formula, Formula) -> Formula`",
        "`Env -> Formula`",
      ],
      answer: 1,
      why: "`Bind` takes a name and two formulas, one at a time. It builds a bigger formula; it does not evaluate anything.",
    },
    {
      k: "quiz",
      q: "You compile `Minus a b` to `compile a ++ compile b ++ [Sub]`, and `Sub` on `(x : y : ys)` leaves `(y - x) : ys`. Why is that the right order?",
      options: [
        "It isn't: you must compile `b` first",
        "After both arguments, `b`'s value is on top (`x`) and `a`'s is underneath (`y`), so `y - x` is `a - b`",
        "`Sub` ignores the stack order",
        "Because `++` reverses lists",
      ],
      answer: 1,
      why: "The second compiled argument is pushed last, so it sits on top. `Sub` subtracts the top from the value under it, which is exactly `a - b`.",
    },
    {
      k: "quiz",
      q: "`Loop \"i\" body` is specified as: while `i` is present and not 0, run `body`. Starting from `[(\"i\", 0)]`, what should one `Loop` step do?",
      options: [
        "Run `body` once, because loops always run at least once",
        "Skip `body` and continue with the rest of the program",
        "Crash, because 0 is not a valid value",
        "Run forever",
      ],
      answer: 1,
      why: "The test happens first. `i` is 0, so the body is not run. (A `DoWhile` would be the version that runs once first; that is a different constructor.)",
    },
    {
      k: "quiz",
      q: "A tiny function has parameters `[\"x\", \"y\"]` and you have evaluated the arguments to `[3, 4]`. The caller's environment already contains `(\"x\", 99)`. How do you build the environment for the body, and what is `x` inside the body?",
      options: [
        "`env ++ zip params values`, so `x` is 99",
        "`zip params values ++ env`, so `x` is 3",
        "`zip params values` only, so `y` is missing if the body uses a global",
        "Replace every `x` in the body by 3 before evaluating, so the environment is unused",
      ],
      answer: 1,
      why: "`lookup` takes the first match, so the parameters must go on the front. Putting them at the back would leave the caller's `x` in force.",
    },
    {
      k: "write",
      setup: formulaSetup,
      body: md(
        "Define a function `nodes :: Formula -> Int` that returns the number of `Join` and `Bind` constructors in a formula. For example:",
        "",
        "```",
        "*Main> nodes f1",
        "2",
        "*Main> nodes (Amt 4)",
        "0",
        "*Main> nodes f2",
        "4",
        "```",
      ),
      starter: hs`nodes :: Formula -> Int
nodes e = undefined
`,
      tests: [
        { expr: "nodes f1", expected: "2" },
        { expr: "nodes f2", expected: "4" },
        { expr: "nodes (Amt 4)", expected: "0" },
        { expr: "nodes f3", expected: "2" },
      ],
      hint: "`Amt` and `Name` are 0. Each `Join` or `Bind` is 1 plus the nodes of its parts.",
      solution: hs`nodes :: Formula -> Int
nodes (Amt _) = 0
nodes (Name _) = 0
nodes (Join _ a b) = 1 + nodes a + nodes b
nodes (Bind _ e b) = 1 + nodes e + nodes b
`,
    },
    {
      k: "write",
      setup: arithSetup + listy,
      body: md(
        "Define a function `varList :: Arith -> [Name]` that returns the names used in an expression, in alphabetical order and without duplicates. For example:",
        "",
        "```",
        "*Main> varList a2",
        "[\"x\",\"y\"]",
        "*Main> varList a3",
        "[\"n\"]",
        "```",
      ),
      starter: hs`varList :: Arith -> [Name]
varList e = undefined
`,
      tests: [
        { expr: "varList a2", expected: `["x", "y"]` },
        { expr: "varList a3", expected: `["n"]` },
        { expr: "varList (Lit 1)", expected: "[]" },
        { expr: 'varList (Sum (Use "b") (Sum (Use "a") (Use "b")))', expected: `["a", "b"]` },
      ],
      hint: "Collect every `Use` with a helper, then `sort (nub ...)`.",
      solution: hs`varList :: Arith -> [Name]
varList e = sort (nub (uses e))

uses :: Arith -> [Name]
uses (Lit _) = []
uses (Use v) = [v]
uses (Sum a b) = uses a ++ uses b
uses (Prod a b) = uses a ++ uses b
`,
    },
    {
      k: "write",
      setup: formulaSetup,
      body: md(
        "In this language, `Bind x e body` means: work out the value of `e`, then evaluate `body` with `x` standing for that value. Inside `body`, this `x` hides any other `x`. Outside `body`, it has no effect.",
        "",
        "Define a function `evalF :: Env -> Formula -> Int` that evaluates a formula. A name takes the value of its **first** binding in the environment; you may assume there is one. For example:",
        "",
        "```",
        "*Main> evalF [(\"n\",3)] f1",
        "18",
        "*Main> evalF [(\"b\",5)] f2",
        "-2",
        "*Main> evalF [(\"x\",7)] f3",
        "8",
        "```",
      ),
      starter: hs`evalF :: Env -> Formula -> Int
evalF env e = undefined
`,
      tests: [
        { expr: 'evalF [("n", 3)] f1', expected: "18" },
        { expr: 'evalF [("b", 5)] f2', expected: "-2" },
        { expr: 'evalF [("x", 7)] f3', expected: "8" },
        { expr: 'evalF [] (Bind "x" (Amt 2) (Bind "x" (Join Add (Name "x") (Amt 1)) (Name "x")))', expected: "3" },
        { expr: "evalF [] (Join Mul (Amt 3) (Amt 4))", expected: "12" },
        { expr: "evalF [] (Amt 5)", expected: "5" },
      ],
      hint: "`evalF env (Bind x e body) = evalF ((x, evalF env e) : env) body`. Write a helper for `Mix`.",
      solution: hs`evalF :: Env -> Formula -> Int
evalF _ (Amt n) = n
evalF env (Name v) = fromJust (lookup v env)
evalF env (Join op a b) = mix op (evalF env a) (evalF env b)
evalF env (Bind x e body) = evalF ((x, evalF env e) : env) body

mix :: Mix -> Int -> Int -> Int
mix Add = (+)
mix Sub = (-)
mix Mul = (*)
`,
    },
    {
      k: "write",
      setup: memSetup,
      body: md(
        "A `Patch` updates a memory of cells. Define a function `applyPatch :: Patch -> Memory -> Memory` as follows:",
        "",
        "- `Write c n` sets cell `c` to `n`.",
        "- `Bump c` adds 1 to `c` (a missing cell counts as 0).",
        "- `Zero c` sets `c` to 0.",
        "- `Copy src dst` writes the value of `src` (or 0 if missing) into `dst`.",
        "",
        "Each update puts the new pair at the front and drops any old pair for that cell. For example:",
        "",
        "```",
        "*Main> applyPatch (Bump \"b\") mem0",
        "[(\"b\",5),(\"a\",1)]",
        "```",
      ),
      starter: hs`applyPatch :: Patch -> Memory -> Memory
applyPatch p mem = undefined
`,
      tests: [
        { expr: 'applyPatch (Bump "b") mem0', expected: '[("b", 5), ("a", 1)]' },
        { expr: 'applyPatch (Zero "p") mem1', expected: '[("p", 0), ("q", 0), ("r", 7)]' },
        { expr: 'applyPatch (Copy "r" "q") mem1', expected: '[("q", 7), ("p", 10), ("r", 7)]' },
        { expr: 'applyPatch (Write "z" 2) []', expected: '[("z", 2)]' },
      ],
      hint: "A helper `set c n mem = (c, n) : [p | p <- mem, fst p /= c]`.",
      solution: hs`applyPatch :: Patch -> Memory -> Memory
applyPatch (Write c n) mem = set c n mem
applyPatch (Bump c) mem = set c (get c mem + 1) mem
applyPatch (Zero c) mem = set c 0 mem
applyPatch (Copy src dst) mem = set dst (get src mem) mem

get :: Cell -> Memory -> Int
get c mem = fromMaybe 0 (lookup c mem)

set :: Cell -> Int -> Memory -> Memory
set c n mem = (c, n) : [p | p <- mem, fst p /= c]
`,
    },
    {
      k: "write",
      setup: bugSetup + givenTurn,
      body: md(
        "`turnL`, `turnR` and `delta` are given. A bug starts at a position facing a direction. `Go n` walks `n` squares that way, one square at a time. `Back n` walks `n` squares the opposite way without changing heading. `TurnR` / `TurnL` turn 90 degrees on the spot.",
        "",
        "Define a function `runBug :: [Step] -> Bug -> Bug` that carries out a list of steps from left to right. For example:",
        "",
        "```",
        "*Main> runBug [Go 2, TurnR, Go 3] bug0",
        "((3,2),East)",
        "```",
      ),
      starter: hs`runBug :: [Step] -> Bug -> Bug
runBug steps bug = undefined
`,
      tests: [
        { expr: "runBug [Go 2, TurnR, Go 3] bug0", expected: "((3, 2), East)" },
        { expr: "runBug [] bug0", expected: "bug0" },
        { expr: "runBug [Back 3, TurnL] bug0", expected: "((0, -3), West)" },
        { expr: "runBug [TurnR, TurnR, Go 1] ((4, 4), North)", expected: "((4, 3), South)" },
      ],
      hint: "A helper for one `Step`, then `foldl`. `Go`/`Back` recurse on the count using `delta`.",
      solution: hs`runBug :: [Step] -> Bug -> Bug
runBug steps bug = foldl (flip doStep) bug steps

doStep :: Step -> Bug -> Bug
doStep (Go n) bug = walk n 1 bug
doStep (Back n) bug = walk n (-1) bug
doStep TurnR (p, d) = (p, turnR d)
doStep TurnL (p, d) = (p, turnL d)

walk :: Int -> Int -> Bug -> Bug
walk 0 _ bug = bug
walk n s ((x, y), d) = walk (n - 1) s ((x + s * dx, y + s * dy), d)
  where
    (dx, dy) = delta d
`,
    },
    {
      k: "write",
      setup: stackSetup,
      body: md(
        "The top of a stack is the head of the list. `Add`/`Mul` replace the top two values by `x + y` / `x * y`. `Sub` on `(x : y : ys)` leaves `(y - x) : ys`. `Dup` copies the top, `Swap` exchanges the top two, `Drop` throws the top away, `Neg` negates the top.",
        "",
        "Define a function `runStack :: [Instr] -> Stack -> Stack`. You may assume the stack never underflows. For example:",
        "",
        "```",
        "*Main> runStack [Push 5, Push 3, Sub] []",
        "[2]",
        "*Main> runStack [Push 2, Push 3, Add, Push 4, Mul] []",
        "[20]",
        "*Main> runStack [Push 1, Push 8, Swap, Drop] []",
        "[8]",
        "```",
      ),
      starter: hs`runStack :: [Instr] -> Stack -> Stack
runStack is stk = undefined
`,
      tests: [
        { expr: "runStack [Push 5, Push 3, Sub] []", expected: "[2]" },
        { expr: "runStack [Push 2, Push 3, Add, Push 4, Mul] []", expected: "[20]" },
        { expr: "runStack [Push 6, Dup, Mul, Neg] []", expected: "[-36]" },
        { expr: "runStack [Push 1, Push 8, Swap] []", expected: "[1, 8]" },
        { expr: "runStack [Push 1, Push 8, Drop] []", expected: "[1]" },
      ],
      hint: "A `step` helper with one equation per constructor, then `foldl (flip step) stk is`.",
      solution: hs`runStack :: [Instr] -> Stack -> Stack
runStack is stk = foldl (flip step) stk is

step :: Instr -> Stack -> Stack
step (Push n) stk = n : stk
step Add (x : y : ys) = (x + y) : ys
step Mul (x : y : ys) = (x * y) : ys
step Sub (x : y : ys) = (y - x) : ys
step Dup (x : xs) = x : x : xs
step Swap (x : y : ys) = y : x : ys
step Drop (_ : xs) = xs
step Neg (x : xs) = negate x : xs
`,
    },
    {
      k: "write",
      setup: bankSetup,
      body: md(
        "Define a function `payOut :: String -> Pence -> Bank -> Bank` that subtracts `n` pence from the named account if it exists and has at least `n`. Otherwise the bank is unchanged. An updated pair goes to the front. For example:",
        "",
        "```",
        "*Main> payOut \"ben\" 40 bank0",
        "[(\"ben\",0),(\"ada\",100)]",
        "*Main> payOut \"ben\" 41 bank0",
        "[(\"ada\",100),(\"ben\",40)]",
        "```",
      ),
      starter: hs`payOut :: String -> Pence -> Bank -> Bank
payOut who n bank = undefined
`,
      tests: [
        { expr: 'payOut "ben" 40 bank0', expected: '[("ben", 0), ("ada", 100)]' },
        { expr: 'payOut "ben" 41 bank0', expected: "bank0" },
        { expr: 'payOut "zed" 1 bank0', expected: "bank0" },
        { expr: 'payOut "cy" 0 bank1', expected: '[("cy", 0), ("ada", 50), ("ben", 20)]' },
      ],
      hint: "`case lookup who bank of Just bal | bal >= n -> ... ; _ -> bank`.",
      solution: hs`payOut :: String -> Pence -> Bank -> Bank
payOut who n bank = case lookup who bank of
  Just bal | bal >= n -> (who, bal - n) : [p | p <- bank, fst p /= who]
  _ -> bank
`,
    },
    {
      k: "write",
      setup: calcSetup,
      body: md(
        "Define a function `postfix :: Calc -> String` that writes a calculation with each operator after its two arguments, with single spaces. For example:",
        "",
        "```",
        "*Main> postfix c1",
        "\"2 3 4 * +\"",
        "*Main> postfix (C 7)",
        "\"7\"",
        "```",
      ),
      starter: hs`postfix :: Calc -> String
postfix c = undefined
`,
      tests: [
        { expr: "postfix c1", expected: `"2 3 4 * +"` },
        { expr: "postfix (C 7)", expected: `"7"` },
        { expr: "postfix c2", expected: `"5 2 * 3 -"` },
        { expr: "postfix (Plus (C 0) (Minus (C 1) (C 1)))", expected: `"0 1 1 - +"` },
        { expr: "postfix (Times (C 2) (C 3))", expected: `"2 3 *"` },
        { expr: "postfix (Minus (C 9) (C 1))", expected: `"9 1 -"` },
      ],
      hint: "`postfix (Plus a b) = postfix a ++ \" \" ++ postfix b ++ \" +\"`.",
      solution: hs`postfix :: Calc -> String
postfix (C n) = show n
postfix (Plus a b) = postfix a ++ " " ++ postfix b ++ " +"
postfix (Minus a b) = postfix a ++ " " ++ postfix b ++ " -"
postfix (Times a b) = postfix a ++ " " ++ postfix b ++ " *"
`,
    },
    {
      k: "write",
      setup: memSetup,
      body: md(
        "Define a function `swapIn :: Cell -> Int -> Memory -> (Memory, Int)` that writes `n` into cell `c` (new pair at the front) and also returns the **old** value of `c`, or 0 if `c` was missing. For example:",
        "",
        "```",
        "*Main> swapIn \"b\" 0 mem0",
        "([(\"b\",0),(\"a\",1)],4)",
        "```",
      ),
      starter: hs`swapIn :: Cell -> Int -> Memory -> (Memory, Int)
swapIn c n mem = undefined
`,
      tests: [
        { expr: 'swapIn "b" 0 mem0', expected: '([("b", 0), ("a", 1)], 4)' },
        { expr: 'swapIn "z" 8 mem0', expected: '([("z", 8), ("a", 1), ("b", 4)], 0)' },
        { expr: 'swapIn "p" 1 []', expected: '([("p", 1)], 0)' },
        { expr: 'swapIn "q" 2 mem1', expected: '([("q", 2), ("p", 10), ("r", 7)], 0)' },
      ],
      hint: "Return a pair. The old value is `fromMaybe 0 (lookup c mem)`.",
      solution: hs`swapIn :: Cell -> Int -> Memory -> (Memory, Int)
swapIn c n mem = ((c, n) : [p | p <- mem, fst p /= c], fromMaybe 0 (lookup c mem))
`,
    },
    {
      k: "write",
      setup: vendSetup,
      body: md(
        "A vending machine holds a credit and a price list. Define `stepVend :: Vend -> Machine -> Machine`:",
        "",
        "- `Insert n` adds `n` to the credit.",
        "- `Choose slot` subtracts the price if the slot exists and the credit is enough; otherwise it does nothing.",
        "- `CoinReturn` sets the credit to 0.",
        "",
        "For example:",
        "",
        "```",
        "*Main> stepVend (Choose \"bun\") (80, prices0)",
        "(0,prices0)",
        "*Main> stepVend (Choose \"bun\") (79, prices0)",
        "(79,prices0)",
        "```",
      ),
      starter: hs`stepVend :: Vend -> Machine -> Machine
stepVend v m = undefined
`,
      tests: [
        { expr: 'stepVend (Choose "bun") (80, prices0)', expected: "(0, prices0)" },
        { expr: 'stepVend (Choose "bun") (79, prices0)', expected: "(79, prices0)" },
        { expr: "stepVend (Insert 20) (10, prices0)", expected: "(30, prices0)" },
        { expr: "stepVend CoinReturn (99, prices0)", expected: "(0, prices0)" },
        { expr: 'stepVend (Choose "pie") (500, prices0)', expected: "(500, prices0)" },
      ],
      hint: "For `Choose`, `case lookup slot ps of Just p | c >= p -> (c - p, ps); _ -> (c, ps)`.",
      solution: hs`stepVend :: Vend -> Machine -> Machine
stepVend (Insert n) (c, ps) = (c + n, ps)
stepVend (Choose slot) (c, ps) = case lookup slot ps of
  Just p | c >= p -> (c - p, ps)
  _ -> (c, ps)
stepVend CoinReturn (_, ps) = (0, ps)
`,
    },
    {
      k: "write",
      setup: formulaSetup,
      body: md(
        "Define a function `showF :: Formula -> String` that writes a formula in prefix style, with brackets and single spaces. `Bind x e body` is written `(let x e body)`. For example:",
        "",
        "```",
        "*Main> showF f1",
        "\"(let k 6 (* k n))\"",
        "*Main> showF (Amt 4)",
        "\"4\"",
        "```",
      ),
      starter: hs`showF :: Formula -> String
showF e = undefined
`,
      tests: [
        { expr: "showF f1", expected: `"(let k 6 (* k n))"` },
        { expr: "showF (Amt 4)", expected: `"4"` },
        { expr: 'showF (Name "abc")', expected: `"abc"` },
        { expr: "showF (Join Sub (Amt 2) (Amt 1))", expected: `"(- 2 1)"` },
        { expr: "showF f3", expected: `"(+ (let x 1 x) x)"` },
      ],
      hint: "`Join Add` uses `+`, `Sub` uses `-`, `Mul` uses `*`. Bind: `\"(let \" ++ x ++ \" \" ++ showF e ++ \" \" ++ showF body ++ \")\"`.",
      solution: hs`showF :: Formula -> String
showF (Amt n) = show n
showF (Name v) = v
showF (Join Add a b) = "(+ " ++ showF a ++ " " ++ showF b ++ ")"
showF (Join Sub a b) = "(- " ++ showF a ++ " " ++ showF b ++ ")"
showF (Join Mul a b) = "(* " ++ showF a ++ " " ++ showF b ++ ")"
showF (Bind x e b) = "(let " ++ x ++ " " ++ showF e ++ " " ++ showF b ++ ")"
`,
    },
    {
      k: "write",
      setup: formulaSetup,
      body: md(
        "Define a function `groundF :: Formula -> Bool` that is `True` when a formula contains no `Name` constructor at all (a `Bind` whose parts are ground still counts as ground). For example:",
        "",
        "```",
        "*Main> groundF (Bind \"x\" (Amt 1) (Amt 2))",
        "True",
        "*Main> groundF f1",
        "False",
        "```",
      ),
      starter: hs`groundF :: Formula -> Bool
groundF e = undefined
`,
      tests: [
        { expr: 'groundF (Bind "x" (Amt 1) (Amt 2))', expected: "True" },
        { expr: "groundF f1", expected: "False" },
        { expr: "groundF (Amt 0)", expected: "True" },
        { expr: 'groundF (Bind "x" (Amt 1) (Name "x"))', expected: "False" },
      ],
      hint: "`Name` is `False`. `Amt` is `True`. `Join` and `Bind` need every part to be ground.",
      solution: hs`groundF :: Formula -> Bool
groundF (Amt _) = True
groundF (Name _) = False
groundF (Join _ a b) = groundF a && groundF b
groundF (Bind _ e b) = groundF e && groundF b
`,
    },
    {
      k: "write",
      setup: bugSetup + givenTurn + givenStepBug,
      body: md(
        "`stepOne`, `turnL`, `turnR` and `delta` are given. Define a function `goN :: Int -> Bug -> Bug` that walks `n` squares forward, one at a time. `n` is never negative. For example:",
        "",
        "```",
        "*Main> goN 4 bug0",
        "((0,4),North)",
        "```",
      ),
      starter: hs`goN :: Int -> Bug -> Bug
goN n bug = undefined
`,
      tests: [
        { expr: "goN 4 bug0", expected: "((0, 4), North)" },
        { expr: "goN 0 ((2, 2), East)", expected: "((2, 2), East)" },
        { expr: "goN 3 ((0, 0), South)", expected: "((0, -3), South)" },
        { expr: "goN 1 ((5, 5), West)", expected: "((4, 5), West)" },
      ],
      hint: "`goN 0 bug = bug` and `goN n bug = goN (n - 1) (stepOne bug)`.",
      solution: hs`goN :: Int -> Bug -> Bug
goN 0 bug = bug
goN n bug = goN (n - 1) (stepOne bug)
`,
    },
    {
      k: "write",
      setup: arithSetup,
      body: md(
        "Define a function `plug :: Name -> Arith -> Arith -> Arith` such that `plug x e body` replaces every `Use x` in `body` by the whole expression `e`. For example:",
        "",
        "```",
        "*Main> plug \"n\" (Lit 5) a1",
        "Sum (Lit 1) (Prod (Lit 5) (Lit 2))",
        "```",
      ),
      starter: hs`plug :: Name -> Arith -> Arith -> Arith
plug x e body = undefined
`,
      tests: [
        { expr: 'plug "n" (Lit 5) a1', expected: "Sum (Lit 1) (Prod (Lit 5) (Lit 2))" },
        { expr: 'plug "y" (Lit 0) a2', expected: 'Prod (Use "x") (Lit 0)' },
        { expr: 'plug "z" (Lit 1) a1', expected: "a1" },
        { expr: 'plug "n" (Use "n") a3', expected: "a3" },
      ],
      hint: "`plug x e (Use v) = if v == x then e else Use v`.",
      solution: hs`plug :: Name -> Arith -> Arith -> Arith
plug _ _ (Lit n) = Lit n
plug x e (Use v) = if v == x then e else Use v
plug x e (Sum a b) = Sum (plug x e a) (plug x e b)
plug x e (Prod a b) = Prod (plug x e a) (plug x e b)
`,
    },
    {
      k: "write",
      setup: bankSetup,
      body: md(
        "Define a function `heldBy :: String -> Bank -> Pence` that returns the named customer's balance, or 0 if they have no account. For example:",
        "",
        "```",
        "*Main> heldBy \"ada\" bank0",
        "100",
        "*Main> heldBy \"zed\" bank0",
        "0",
        "```",
      ),
      starter: hs`heldBy :: String -> Bank -> Pence
heldBy who bank = undefined
`,
      tests: [
        { expr: 'heldBy "ada" bank0', expected: "100" },
        { expr: 'heldBy "zed" bank0', expected: "0" },
        { expr: 'heldBy "cy" bank1', expected: "0" },
        { expr: 'heldBy "ada" []', expected: "0" },
      ],
      hint: "`fromMaybe 0 (lookup who bank)`.",
      solution: hs`heldBy :: String -> Bank -> Pence
heldBy who bank = fromMaybe 0 (lookup who bank)
`,
    },
    {
      k: "write",
      setup: ovenSetup,
      body: md(
        "An oven is a pair `(heat, minutes)`. Define `runKnobs :: [Knob] -> Oven -> Oven`:",
        "",
        "- `SetHeat h` changes the heat.",
        "- `AddMins n` adds `n` to the remaining time.",
        "- `Tick`: if time is 0, heat becomes `Off`; otherwise time decreases by 1.",
        "- `Cancel` sets heat `Off` and time 0.",
        "",
        "For example:",
        "",
        "```",
        "*Main> runKnobs [AddMins 2, Tick, Tick, Tick] (High, 0)",
        "(Off,0)",
        "```",
      ),
      starter: hs`runKnobs :: [Knob] -> Oven -> Oven
runKnobs ks oven = undefined
`,
      tests: [
        { expr: "runKnobs [AddMins 2, Tick, Tick, Tick] (High, 0)", expected: "(Off, 0)" },
        { expr: "runKnobs [SetHeat Low] (Off, 4)", expected: "(Low, 4)" },
        { expr: "runKnobs [Cancel, AddMins 1] (High, 9)", expected: "(Off, 1)" },
        { expr: "runKnobs [] (High, 3)", expected: "(High, 3)" },
      ],
      hint: "A helper `knob` plus `foldl`. After `Cancel` the next `AddMins` still adds onto 0.",
      solution: hs`runKnobs :: [Knob] -> Oven -> Oven
runKnobs ks oven = foldl (flip knob) oven ks

knob :: Knob -> Oven -> Oven
knob (SetHeat h) (_, t) = (h, t)
knob (AddMins n) (h, t) = (h, t + n)
knob Tick (h, 0) = (Off, 0)
knob Tick (h, t) = (h, t - 1)
knob Cancel _ = (Off, 0)
`,
    },
    {
      k: "write",
      setup: memSetup + listy,
      body: md(
        "Define a function `cells :: Memory -> [Cell]` that returns the cell names in alphabetical order, without duplicates. For example:",
        "",
        "```",
        "*Main> cells mem1",
        "[\"p\",\"q\",\"r\"]",
        "```",
      ),
      starter: hs`cells :: Memory -> [Cell]
cells mem = undefined
`,
      tests: [
        { expr: "cells mem1", expected: `["p", "q", "r"]` },
        { expr: "cells mem0", expected: `["a", "b"]` },
        { expr: "cells []", expected: "[]" },
        { expr: 'cells [("m", 1), ("a", 2), ("m", 0)]', expected: `["a", "m"]` },
      ],
      hint: "`sort (nub (map fst mem))`.",
      solution: hs`cells :: Memory -> [Cell]
cells mem = sort (nub (map fst mem))
`,
    },
    {
      k: "write",
      setup: stackSetup,
      body: md(
        "Define a function `topAfter :: [Instr] -> Maybe Int` that runs the instructions from an empty stack and returns the final top value. Give `Nothing` if the stack is empty at the end, or if any instruction underflows. For example:",
        "",
        "```",
        "*Main> topAfter [Push 2, Push 3, Add]",
        "Just 5",
        "*Main> topAfter [Add]",
        "Nothing",
        "```",
      ),
      starter: hs`topAfter :: [Instr] -> Maybe Int
topAfter is = undefined
`,
      tests: [
        { expr: "topAfter [Push 2, Push 3, Add]", expected: "Just 5" },
        { expr: "topAfter [Add]", expected: "Nothing" },
        { expr: "topAfter [Push 9, Drop]", expected: "Nothing" },
        { expr: "topAfter [Push 4, Dup, Mul]", expected: "Just 16" },
        { expr: "topAfter []", expected: "Nothing" },
      ],
      hint: "Thread `Maybe Stack` through a `stepM` helper, then `peek` the result.",
      solution: hs`topAfter :: [Instr] -> Maybe Int
topAfter is = case run [] is of
  Just (x : _) -> Just x
  _ -> Nothing
  where
    run stk [] = Just stk
    run stk (i : rest) = case stepM i stk of
      Just stk' -> run stk' rest
      Nothing -> Nothing

stepM :: Instr -> Stack -> Maybe Stack
stepM (Push n) stk = Just (n : stk)
stepM Add (x : y : ys) = Just ((x + y) : ys)
stepM Mul (x : y : ys) = Just ((x * y) : ys)
stepM Sub (x : y : ys) = Just ((y - x) : ys)
stepM Dup (x : xs) = Just (x : x : xs)
stepM Swap (x : y : ys) = Just (y : x : ys)
stepM Drop (_ : xs) = Just xs
stepM Neg (x : xs) = Just (negate x : xs)
stepM _ _ = Nothing
`,
    },
    {
      k: "write",
      setup: formulaSetup,
      body: md(
        "Define **two** functions.",
        "",
        "- `evalF :: Env -> Formula -> Int` as before (`Bind` extends the environment at the front; you may assume every name is bound when it is used).",
        "- `freeNames :: Formula -> [String]`: names used where they are not bound, alphabetical, no duplicates. In `Bind x e body`, uses of `x` inside `e` are free; uses of `x` inside `body` are not.",
        "",
        "For example:",
        "",
        "```",
        "*Main> evalF [(\"n\",3)] f1",
        "18",
        "*Main> freeNames f1",
        "[\"n\"]",
        "*Main> freeNames f2",
        "[\"b\"]",
        "```",
      ),
      starter: hs`evalF :: Env -> Formula -> Int
evalF env e = undefined

freeNames :: Formula -> [String]
freeNames e = undefined
`,
      tests: [
        { expr: 'evalF [("n", 3)] f1', expected: "18" },
        { expr: 'evalF [("b", 5)] f2', expected: "-2" },
        { expr: "freeNames f1", expected: `["n"]` },
        { expr: "freeNames f2", expected: `["b"]` },
        { expr: "freeNames f3", expected: `["x"]` },
        { expr: 'freeNames (Bind "z" (Name "z") (Name "z"))', expected: `["z"]` },
        { expr: 'evalF [("x", 7)] f3', expected: "8" },
      ],
      hint: "`freeNames = sort . nub . fv`, and `fv (Bind x e b) = fv e ++ filter (/= x) (fv b)`.",
      solution: hs`evalF :: Env -> Formula -> Int
evalF _ (Amt n) = n
evalF env (Name v) = fromJust (lookup v env)
evalF env (Join op a b) = mix op (evalF env a) (evalF env b)
evalF env (Bind x e body) = evalF ((x, evalF env e) : env) body

mix :: Mix -> Int -> Int -> Int
mix Add = (+)
mix Sub = (-)
mix Mul = (*)

freeNames :: Formula -> [String]
freeNames e = sort (nub (fv e))

fv :: Formula -> [String]
fv (Amt _) = []
fv (Name v) = [v]
fv (Join _ a b) = fv a ++ fv b
fv (Bind x e b) = fv e ++ filter (/= x) (fv b)
`,
    },
    {
      k: "write",
      setup: calcSetup + stackSetup + givenEvalCalc + givenRunStack,
      body: md(
        "`evalCalc` and `runStack` are given. Define a function `compile :: Calc -> [Instr]` that compiles a calculation to stack instructions, arguments first and operator last, so that",
        "",
        "```",
        "head (runStack (compile c) []) == evalCalc c",
        "```",
        "",
        "For example:",
        "",
        "```",
        "*Main> compile (Minus (C 5) (C 3))",
        "[Push 5,Push 3,Sub]",
        "*Main> head (runStack (compile c1) [])",
        "14",
        "```",
      ),
      starter: hs`compile :: Calc -> [Instr]
compile c = undefined
`,
      tests: [
        { expr: "compile (Minus (C 5) (C 3))", expected: "[Push 5, Push 3, Sub]" },
        { expr: "compile (C 4)", expected: "[Push 4]" },
        { expr: "head (runStack (compile c1) []) == evalCalc c1", label: "c1 compiles and runs to 14" },
        { expr: "head (runStack (compile c2) []) == evalCalc c2", label: "c2 compiles and runs to 7" },
        { expr: "head (runStack (compile c3) []) == evalCalc c3", label: "c3 compiles and runs to 6" },
      ],
      hint: "`compile (Plus a b) = compile a ++ compile b ++ [Add]`. Same for `Minus`/`Sub` and `Times`/`Mul`.",
      solution: hs`compile :: Calc -> [Instr]
compile (C n) = [Push n]
compile (Plus a b) = compile a ++ compile b ++ [Add]
compile (Minus a b) = compile a ++ compile b ++ [Sub]
compile (Times a b) = compile a ++ compile b ++ [Mul]
`,
    },
    {
      k: "write",
      setup: bugSetup + givenTurn,
      body: md(
        "`turnL`, `turnR` and `delta` are given. Define a function `trace :: [Step] -> Bug -> [Pos]` that lists the start square and then every square the bug **enters** (each single step of a `Go` or `Back`). Turns do not add a square. For example:",
        "",
        "```",
        "*Main> trace [Go 2, TurnR, Go 1] bug0",
        "[(0,0),(0,1),(0,2),(1,2)]",
        "*Main> trace [TurnL] bug0",
        "[(0,0)]",
        "```",
      ),
      starter: hs`trace :: [Step] -> Bug -> [Pos]
trace steps bug = undefined
`,
      tests: [
        { expr: "trace [Go 2, TurnR, Go 1] bug0", expected: "[(0, 0), (0, 1), (0, 2), (1, 2)]" },
        { expr: "trace [TurnL] bug0", expected: "[(0, 0)]" },
        { expr: "trace [] ((3, 3), East)", expected: "[(3, 3)]" },
        { expr: "trace [Go 1, Back 1] bug0", expected: "[(0, 0), (0, 1), (0, 0)]" },
        { expr: "trace [Back 2] ((2, 0), East)", expected: "[(2, 0), (1, 0), (0, 0)]" },
      ],
      hint: "Thread the current bug. For `Go n`, walk one square `n` times and record each new position.",
      solution: hs`trace :: [Step] -> Bug -> [Pos]
trace steps bug = fst bug : extras steps bug
  where
    extras [] _ = []
    extras (Go n : ss) b = let (ps, b') = march n 1 b in ps ++ extras ss b'
    extras (Back n : ss) b = let (ps, b') = march n (-1) b in ps ++ extras ss b'
    extras (TurnR : ss) (p, d) = extras ss (p, turnR d)
    extras (TurnL : ss) (p, d) = extras ss (p, turnL d)

march :: Int -> Int -> Bug -> ([Pos], Bug)
march 0 _ bug = ([], bug)
march n s ((x, y), d) = ((x', y') : ps, bug')
  where
    (dx, dy) = delta d
    (x', y') = (x + s * dx, y + s * dy)
    (ps, bug') = march (n - 1) s ((x', y'), d)
`,
    },
    {
      k: "write",
      setup: lineSetup + givenAtom,
      body: md(
        "`evalAtom` and `setVar` are given. Define a function `runLines :: [Line] -> Env -> (Env, [Int])` that runs a script from left to right and returns the final environment together with every number that was spoken, in order.",
        "",
        "- `Store x a` writes the value of `a` into `x` and speaks nothing.",
        "- `Speak a` speaks the value of `a` and does not change the environment.",
        "- `Skip` does nothing.",
        "",
        "For example:",
        "",
        "```",
        "*Main> snd (runLines [Store \"x\" (N 3), Speak (V \"x\"), Speak (Plus (V \"x\") (N 1))] [])",
        "[3,4]",
        "```",
      ),
      starter: hs`runLines :: [Line] -> Env -> (Env, [Int])
runLines ls env = undefined
`,
      tests: [
        { expr: 'snd (runLines [Store "x" (N 3), Speak (V "x"), Speak (Plus (V "x") (N 1))] [])', expected: "[3, 4]" },
        { expr: 'fst (runLines [Store "x" (N 3), Speak (V "x")] [])', expected: '[("x", 3)]' },
        { expr: "runLines [] [(\"k\", 1)]", expected: '([("k", 1)], [])' },
        { expr: 'snd (runLines [Speak (N 1), Skip, Speak (N 2)] [])', expected: "[1, 2]" },
        { expr: 'fst (runLines [Store "a" (N 1), Store "a" (Plus (V "a") (N 1))] [])', expected: '[("a", 2)]' },
      ],
      hint: "For `l : rest`, run `l` to get `(env1, out1)`, then the rest from `env1`. Join the outputs with `++`.",
      solution: hs`runLines :: [Line] -> Env -> (Env, [Int])
runLines [] env = (env, [])
runLines (l : rest) env = (env2, out1 ++ out2)
  where
    (env1, out1) = step l env
    (env2, out2) = runLines rest env1

step :: Line -> Env -> (Env, [Int])
step (Store x a) env = (setVar x (evalAtom env a) env, [])
step (Speak a) env = (env, [evalAtom env a])
step Skip env = (env, [])
`,
    },
    {
      k: "write",
      setup: bankSetup,
      body: md(
        "Define a function `sendM :: String -> String -> Pence -> Bank -> Maybe Bank` that moves `n` pence from one account to another.",
        "",
        "If both accounts exist and the source has at least `n`, return `Just` the updated bank: debit the source first, then credit the destination, putting each updated pair at the front. If any check fails, return `Nothing` and do not describe a half-updated bank.",
        "",
        "For example:",
        "",
        "```",
        "*Main> sendM \"ada\" \"ben\" 40 bank0",
        "Just [(\"ben\",80),(\"ada\",60)]",
        "*Main> sendM \"ada\" \"ben\" 101 bank0",
        "Nothing",
        "```",
      ),
      starter: hs`sendM :: String -> String -> Pence -> Bank -> Maybe Bank
sendM from to n bank = undefined
`,
      tests: [
        { expr: 'sendM "ada" "ben" 40 bank0', expected: 'Just [("ben", 80), ("ada", 60)]' },
        { expr: 'sendM "ada" "ben" 101 bank0', expected: "Nothing" },
        { expr: 'sendM "ada" "zed" 10 bank0', expected: "Nothing" },
        { expr: 'sendM "ben" "ada" 40 bank0', expected: 'Just [("ada", 140), ("ben", 0)]' },
        { expr: 'sendM "ada" "ben" 0 bank0', expected: 'Just [("ben", 40), ("ada", 100)]' },
      ],
      hint: "Match on both `lookup`s together. Build a new bank only in the success branch.",
      solution: hs`sendM :: String -> String -> Pence -> Bank -> Maybe Bank
sendM from to n bank =
  case (lookup from bank, lookup to bank) of
    (Just a, Just b)
      | a >= n -> Just (set to (b + n) (set from (a - n) bank))
    _ -> Nothing

set :: String -> Pence -> Bank -> Bank
set who n bank = (who, n) : [p | p <- bank, fst p /= who]
`,
    },
    {
      k: "write",
      setup: progSetup,
      body: md(
        "A `Prog` is a tiny turtle program: a single `Step`, two programs in sequence, or `Times n p` which runs `p` exactly `n` times (`n` never negative).",
        "",
        "`Go n` / `Back n` move one square at a time. `turnL`, `turnR` and `delta` are given.",
        "",
        "Define a function `runProg :: Prog -> Bug -> Bug`. For example:",
        "",
        "```",
        "*Main> runProg (Times 4 (Seq (Do (Go 1)) (Do TurnR))) bug0",
        "((0,0),North)",
        "*Main> runProg (Seq (Do (Go 2)) (Do TurnR)) bug0",
        "((0,2),East)",
        "```",
      ),
      starter: hs`runProg :: Prog -> Bug -> Bug
runProg p bug = undefined
`,
      tests: [
        { expr: "runProg (Times 4 (Seq (Do (Go 1)) (Do TurnR))) bug0", expected: "((0, 0), North)" },
        { expr: "runProg (Seq (Do (Go 2)) (Do TurnR)) bug0", expected: "((0, 2), East)" },
        { expr: "runProg (Times 0 (Do (Go 9))) bug0", expected: "bug0" },
        { expr: "runProg (Do (Back 3)) bug0", expected: "((0, -3), North)" },
        { expr: "runProg (Times 3 (Do (Go 1))) ((0, 0), East)", expected: "((3, 0), East)" },
        { expr: "runProg (Do TurnL) bug0", expected: "((0, 0), West)" },
        { expr: "runProg (Seq (Do TurnR) (Do (Go 1))) bug0", expected: "((1, 0), East)" },
      ],
      hint: "`runProg (Seq a b) bug = runProg b (runProg a bug)` and `runProg (Times n p)` recurses on `n`.",
      solution: hs`runProg :: Prog -> Bug -> Bug
runProg (Do s) bug = doStep s bug
runProg (Seq a b) bug = runProg b (runProg a bug)
runProg (Times 0 _) bug = bug
runProg (Times n p) bug = runProg (Times (n - 1) p) (runProg p bug)

doStep :: Step -> Bug -> Bug
doStep (Go n) bug = walk n 1 bug
doStep (Back n) bug = walk n (-1) bug
doStep TurnR (p, d) = (p, turnR d)
doStep TurnL (p, d) = (p, turnL d)

walk :: Int -> Int -> Bug -> Bug
walk 0 _ bug = bug
walk n s ((x, y), d) = walk (n - 1) s ((x + s * dx, y + s * dy), d)
  where
    (dx, dy) = delta d
`,
    },
    {
      k: "write",
      setup: vendSetup,
      body: md(
        "Define a function `runVend :: [Vend] -> Machine -> (Machine, [Slot])` that runs a list of vending commands from left to right and returns the final machine together with the names of the slots that were **successfully** bought, in order.",
        "",
        "A `Choose` that does not have enough credit, or names an unknown slot, buys nothing. `Insert` and `CoinReturn` never buy. For example:",
        "",
        "```",
        "*Main> snd (runVend [Insert 200, Choose \"tea\", Choose \"bun\", Choose \"tea\"] m0)",
        "[\"tea\",\"bun\"]",
        "```",
        "",
        "(After buying tea, 80 is left, which buys a bun, and then tea is too expensive.)",
      ),
      starter: hs`runVend :: [Vend] -> Machine -> (Machine, [Slot])
runVend vs m = undefined
`,
      tests: [
        { expr: 'snd (runVend [Insert 200, Choose "tea", Choose "bun", Choose "tea"] m0)', expected: `["tea", "bun"]` },
        { expr: 'fst (runVend [Insert 200, Choose "tea", Choose "bun"] m0)', expected: "(0, prices0)" },
        { expr: 'snd (runVend [Choose "tea"] m0)', expected: "[]" },
        { expr: "snd (runVend [Insert 50, CoinReturn, Choose \"bun\"] m0)", expected: "[]" },
        { expr: 'snd (runVend [Insert 80, Choose "bun", Insert 80, Choose "bun"] m0)', expected: `["bun", "bun"]` },
      ],
      hint: "Thread `(Machine, [Slot])`. On a successful `Choose`, subtract the price and append the slot name.",
      solution: hs`runVend :: [Vend] -> Machine -> (Machine, [Slot])
runVend vs m = foldl step (m, []) vs

step :: (Machine, [Slot]) -> Vend -> (Machine, [Slot])
step ((c, ps), bought) (Insert n) = ((c + n, ps), bought)
step ((c, ps), bought) CoinReturn = ((0, ps), bought)
step ((c, ps), bought) (Choose slot) = case lookup slot ps of
  Just p | c >= p -> ((c - p, ps), bought ++ [slot])
  _ -> ((c, ps), bought)
`,
    },
    {
      k: "write",
      setup: stmtSetup,
      body: md(
        "This language has assignments, output, a one-armed `When`, and a `Loop` on a variable.",
        "",
        "- `Set x a` writes the value of `a` into `x`.",
        "- `Speak a` outputs the value of `a`.",
        "- `When a ss` runs the block `ss` if `a` evaluates to something other than 0; otherwise it skips it.",
        "- `Loop x ss` runs `ss` again and again while `x` is present and not 0. You may assume every loop in the tests stops.",
        "",
        "Define `exec :: [Stmt] -> Env -> (Env, [Int])`, the final environment and everything spoken, in order. Put an updated binding at the front of the environment. For example:",
        "",
        "```",
        "*Main> snd (exec [Set \"i\" (N 3), Loop \"i\" [Speak (V \"i\"), Set \"i\" (Diff (V \"i\") (N 1))]] [])",
        "[3,2,1]",
        "*Main> snd (exec [When (N 0) [Speak (N 9)], Speak (N 1)] [])",
        "[1]",
        "```",
      ),
      starter: hs`exec :: [Stmt] -> Env -> (Env, [Int])
exec ss env = undefined
`,
      tests: [
        {
          expr: 'snd (exec [Set "i" (N 3), Loop "i" [Speak (V "i"), Set "i" (Diff (V "i") (N 1))]] [])',
          expected: "[3, 2, 1]",
        },
        { expr: 'fst (exec [Set "i" (N 3), Loop "i" [Set "i" (Diff (V "i") (N 1))]] [])', expected: '[("i", 0)]' },
        { expr: "snd (exec [When (N 0) [Speak (N 9)], Speak (N 1)] [])", expected: "[1]" },
        { expr: "snd (exec [When (N 2) [Speak (N 9)], Speak (N 1)] [])", expected: "[9, 1]" },
        {
          expr: 'snd (exec [Set "x" (N 1), When (V "x") [Speak (Plus (V "x") (N 4))]] [])',
          expected: "[5]",
        },
        { expr: "exec [] [(\"z\", 1)]", expected: '([("z", 1)], [])' },
        { expr: "snd (exec [Speak (N 4), Speak (N 5)] [])", expected: "[4, 5]" },
        { expr: 'fst (exec [Set "a" (N 1), Set "b" (N 2)] [])', expected: '[("b", 2), ("a", 1)]' },
      ],
      hint: "`Loop x ss` can be `if get x == 0 then exec rest env else exec (ss ++ (Loop x ss : rest)) env`. Evaluate atoms with a helper; missing names may be treated as 0 for the loop test.",
      solution: hs`exec :: [Stmt] -> Env -> (Env, [Int])
exec [] env = (env, [])
exec (Set x a : rest) env = exec rest (setVar x (eval env a) env)
exec (Speak a : rest) env = (env2, eval env a : out)
  where
    (env2, out) = exec rest env
exec (When a ss : rest) env
  | eval env a /= 0 = exec (ss ++ rest) env
  | otherwise = exec rest env
exec (Loop x ss : rest) env
  | get x env == 0 = exec rest env
  | otherwise = exec (ss ++ Loop x ss : rest) env

eval :: Env -> Atom -> Int
eval _ (N n) = n
eval env (V v) = get v env
eval env (Plus a b) = eval env a + eval env b
eval env (Diff a b) = eval env a - eval env b

get :: String -> Env -> Int
get x env = case lookup x env of
  Just n -> n
  Nothing -> 0

setVar :: String -> Int -> Env -> Env
setVar x n env = (x, n) : [p | p <- env, fst p /= x]
`,
    },
  ],
};

export const book: Book = {
  id: "b-interp",
  order: 11,
  title: "Interpreters and threading state",
  blurb:
    "Evaluate expression trees in an environment, run commands that update a store, and thread state as an extra argument that comes back in a pair.",
  sets: [level1, level2, level3, level4],
};


