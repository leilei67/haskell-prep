import { type Book, type DrillSet, hs, md } from "../schema.ts";

const exprSetup = hs`data Expr = N Int | V String | Plus Expr Expr | Times Expr Expr | Minus Expr Expr
  deriving (Eq, Show)

zPlusX :: Expr
zPlusX = Plus (N 0) (V "x")

xPlusZ :: Expr
xPlusZ = Plus (V "x") (N 0)

nestedZ :: Expr
nestedZ = Plus (N 0) (Plus (N 0) (V "x"))

xTimes1 :: Expr
xTimes1 = Times (V "x") (N 1)

oneTimesX :: Expr
oneTimesX = Times (N 1) (V "x")

yMinusY :: Expr
yMinusY = Minus (V "y") (V "y")

xPlusX :: Expr
xPlusX = Plus (V "x") (V "x")

twoN :: Expr
twoN = Plus (N 2) (N 3)

eDeep :: Expr
eDeep = Times (Plus (N 0) (V "x")) (Plus (V "y") (N 0))

xySum :: Expr
xySum = Plus (V "x") (V "y")
`;

const propSetup = hs`data Prop = T | F | Atom String | Neg Prop | Conj Prop Prop | Disj Prop Prop
  deriving (Eq, Show)

tAndA :: Prop
tAndA = Conj T (Atom "a")

aAndT :: Prop
aAndT = Conj (Atom "a") T

nnB :: Prop
nnB = Neg (Neg (Atom "b"))

aOrF :: Prop
aOrF = Disj (Atom "a") F

fOrA :: Prop
fOrA = Disj F (Atom "a")

notAnd :: Prop
notAnd = Neg (Conj (Atom "a") (Atom "b"))

aAndNa :: Prop
aAndNa = Conj (Atom "a") (Neg (Atom "a"))
`;

const boxSetup = hs`data Box a = Empty | Full a
  deriving (Eq, Show)
`;

const polySetup = hs`-- A polynomial as a list of (variable, coefficient) pairs.
-- The empty name "" is the constant term.
type Poly = [(String, Int)]

poly1 :: Poly
poly1 = [("x", 2), ("y", 1), ("x", 3)]

poly2 :: Poly
poly2 = [("y", 4), ("x", 1), ("y", -4), ("z", 2)]
`;

const signedSetup = hs`data Signed = Credit String | Debit String
  deriving (Eq, Show)
`;

const mixSetup = hs`data Mix = Water | Flour | Sugar | Blend Mix Mix | Scale Int Mix
  deriving (Eq, Show)

dough :: Mix
dough = Blend (Scale 2 Flour) (Blend Water Sugar)

batter :: Mix
batter = Scale 1 (Scale 3 (Blend Flour Water))
`;

const peelSetup =
  exprSetup +
  hs`
peelZeroLeft :: Expr -> Expr
peelZeroLeft (Plus (N 0) e) = e
peelZeroLeft e = e

peelZeroRight :: Expr -> Expr
peelZeroRight (Plus e (N 0)) = e
peelZeroRight e = e

peelZeroTop :: Expr -> Expr
peelZeroTop (Plus (N 0) e) = e
peelZeroTop (Plus e (N 0)) = e
peelZeroTop e = e
`;

const stepSetup =
  exprSetup +
  hs`
-- One-step only: looks at the top node, never inside.
step :: Expr -> Expr
step (Plus (N 0) e) = e
step (Plus e (N 0)) = e
step (Times (N 1) e) = e
step (Times e (N 1)) = e
step (Minus a b) | a == b = N 0
step e = e
`;

const coeffsSetup = hs`-- Coefficients of a polynomial in x, lowest power first.
-- [3, 0, 2] means 3 + 0*x + 2*x^2.
type Coeffs = [Int]

pA :: Coeffs
pA = [1, 2]

pB :: Coeffs
pB = [3, 0, 1]
`;

const level1: DrillSet = {
  id: "b-rewrite-l1",
  lesson: "",
  level: 1,
  title: "Level 1: Warm-up",
  intro: md(
    "A **nested pattern** looks inside a constructor. `Plus (N 0) e` only matches a sum whose left side is the number 0; `e` is whatever sits on the right.",
    "",
    "A **one-step** rewrite uses that kind of pattern at the very top, then stops. If the interesting shape is deeper, a one-step function leaves it alone. Most starters already have the equations: fill in the right-hand sides.",
    "",
    "```",
    "peelZeroLeft (Plus (N 0) e) = e",
    "peelZeroLeft e             = e",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: "The pattern `Plus (N 0) e` is used on `Plus (N 0) (Times (V \"x\") (N 2))`. What is `e`?",
      options: [
        "`N 0`",
        "`Times (V \"x\") (N 2)`",
        "`V \"x\"`",
        "The pattern does not match",
      ],
      answer: 1,
      why: "The outside is `Plus` and the left child is `N 0`, so the pattern fits. `e` names the whole right child, which is the `Times` tree.",
    },
    {
      k: "quiz",
      q: "What does `let f m = case m of { Just (Just n) -> n + 1; _ -> 0 } in f (Just (Just 6))` give?",
      options: ["`7`", "`6`", "`0`", "`1`"],
      answer: 0,
      why: "`Just (Just n)` looks two levels in. `n` is 6, so the answer is 7.",
    },
    {
      k: "quiz",
      q: md(
        "What is `peel (Plus (N 0) (V \"x\"))`?",
        "",
        "```",
        "peel e                 = e",
        "peel (Plus (N 0) e)    = e",
        "```",
      ),
      options: ["`V \"x\"`", "`Plus (N 0) (V \"x\")`", "`N 0`", "A crash"],
      answer: 1,
      why: "Equations are tried from the top. The first one matches every input, so the second line never runs. A catch-all must go last.",
    },
    {
      k: "quiz",
      q: "What does `let f p = case p of { (0, n) -> n; (n, 0) -> n; (a, b) -> a + b } in f (0, 0)` give?",
      options: ["`0`", "`1`", "It crashes", "`(0, 0)`"],
      answer: 0,
      why: "`(0, 0)` matches `(0, n)` first, with `n = 0`. Haskell uses the first fit, not the 'best' one.",
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Fill in `isZeroLeft`. It is `True` exactly when the top of the expression is a `Plus` whose left child is `N 0`.",
      starter: hs`isZeroLeft :: Expr -> Bool
isZeroLeft (Plus (N 0) _) = undefined
isZeroLeft _ = undefined
`,
      tests: [
        { expr: "isZeroLeft zPlusX", expected: "True" },
        { expr: "isZeroLeft xPlusZ", expected: "False" },
        { expr: "isZeroLeft nestedZ", expected: "True", label: "only the top matters" },
        { expr: "isZeroLeft (N 0)", expected: "False" },
        { expr: "isZeroLeft (Plus (N 1) (V \"x\"))", expected: "False" },
      ],
      hint: "The nested pattern is already there. That case is `True`; everything else is `False`.",
      solution: hs`isZeroLeft :: Expr -> Bool
isZeroLeft (Plus (N 0) _) = True
isZeroLeft _ = False
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Fill in `peelZeroLeft`. If the top is `0 + e`, give `e`. Any other expression is unchanged. Do not look inside.",
      starter: hs`peelZeroLeft :: Expr -> Expr
peelZeroLeft (Plus (N 0) e) = undefined
peelZeroLeft e = undefined
`,
      tests: [
        { expr: "peelZeroLeft zPlusX", expected: "V \"x\"" },
        { expr: "peelZeroLeft xPlusZ", expected: "xPlusZ" },
        { expr: "peelZeroLeft nestedZ", expected: "Plus (N 0) (V \"x\")", label: "only one 0 is peeled" },
        { expr: "peelZeroLeft (N 4)", expected: "N 4" },
        { expr: "peelZeroLeft (Plus (N 0) twoN)", expected: "twoN" },
      ],
      hint: "The first right-hand side is `e`. The second is `e` as well: give the input back.",
      solution: hs`peelZeroLeft :: Expr -> Expr
peelZeroLeft (Plus (N 0) e) = e
peelZeroLeft e = e
`,
    },
    {
      k: "quiz",
      q: "A one-step `peelZeroLeft` is run on `Times (Plus (N 0) (V \"x\")) (N 2)`. What comes out?",
      options: [
        "`Times (V \"x\") (N 2)`",
        "`V \"x\"`",
        "`Times (Plus (N 0) (V \"x\")) (N 2)`, unchanged",
        "`Plus (N 0) (Times (V \"x\") (N 2))`",
      ],
      answer: 2,
      why: "The top constructor is `Times`, not `Plus`, so the rule does not match. One-step never walks into the children.",
    },
    {
      k: "quiz",
      q: "What does `let peel t = case t of { (0, x) -> x; p -> p } in peel (0, (0, 5))` give?",
      options: ["`(0, 5)`", "`5`", "`0`", "`(0, 0)`"],
      answer: 0,
      why: "The top pair is `(0, something)`, so the something is returned. That something is still `(0, 5)`: one step does not peel again.",
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Fill in `peelOneRight`. If the top is `e * 1`, give `e`. Leave every other expression alone.",
      starter: hs`peelOneRight :: Expr -> Expr
peelOneRight (Times e (N 1)) = undefined
peelOneRight e = undefined
`,
      tests: [
        { expr: "peelOneRight xTimes1", expected: "V \"x\"" },
        { expr: "peelOneRight oneTimesX", expected: "oneTimesX" },
        { expr: "peelOneRight (Times (Plus (V \"x\") (N 0)) (N 1))", expected: "Plus (V \"x\") (N 0)" },
        { expr: "peelOneRight (Times (V \"x\") (N 2))", expected: "Times (V \"x\") (N 2)" },
        { expr: "peelOneRight (N 1)", expected: "N 1" },
      ],
      hint: "Same shape as `peelZeroLeft`: return the named child, then a catch-all.",
      solution: hs`peelOneRight :: Expr -> Expr
peelOneRight (Times e (N 1)) = e
peelOneRight e = e
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Fill in `cancelSame`. If the top is a `Minus` whose two children are the **same tree** (`==`), give `N 0`. Otherwise leave the expression alone.",
      starter: hs`cancelSame :: Expr -> Expr
cancelSame (Minus a b) | a == b = undefined
cancelSame e = undefined
`,
      tests: [
        { expr: "cancelSame yMinusY", expected: "N 0" },
        { expr: "cancelSame (Minus (V \"y\") (V \"x\"))", expected: "Minus (V \"y\") (V \"x\")" },
        { expr: "cancelSame (Minus (N 3) (N 3))", expected: "N 0" },
        { expr: "cancelSame (Minus zPlusX zPlusX)", expected: "N 0", label: "the two sides are equal as trees" },
        { expr: "cancelSame (Minus zPlusX (V \"x\"))", expected: "Minus zPlusX (V \"x\")", label: "0+x is not the same tree as x" },
      ],
      hint: "The guard already checked `a == b`. Return `N 0`. The catch-all returns `e`.",
      solution: hs`cancelSame :: Expr -> Expr
cancelSame (Minus a b) | a == b = N 0
cancelSame e = e
`,
    },
    {
      k: "quiz",
      q: "`cancelSame` uses `a == b` on the two children of `Minus`. When is `Minus (Plus (N 0) (V \"x\")) (V \"x\")` cancelled to `N 0`?",
      options: [
        "Always, because both sides mean x",
        "Never: the two children are different trees, so `==` is `False`",
        "Only if you derive `Ord`",
        "It crashes, because `==` cannot compare expressions",
      ],
      answer: 1,
      why: "`==` on a `deriving (Eq)` type compares constructors and children exactly. `Plus (N 0) (V \"x\")` is not the same tree as `V \"x\"`. Simplify first if you want those to cancel.",
    },
    {
      k: "quiz",
      q: "What does `let f xs = case xs of { (x : y : zs) | x == y -> x : f zs; (x : zs) -> x : f zs; [] -> [] } in f [1, 1, 2, 2, 2]` give?",
      options: ["`[1, 2, 2]`", "`[1, 2]`", "`[1, 1, 2, 2, 2]`", "`[1, 2, 2, 2]`"],
      answer: 0,
      why: "Each equation that fires drops one copy of a pair and skips the rest of that pair. `[1,1,...]` becomes `1 : f [2,2,2]`. Then `[2,2,2]` becomes `2 : f [2]`, which is `[2, 2]`.",
    },
    {
      k: "write",
      setup: boxSetup,
      body: "Fill in `unwrapOnce`. The input is a box that contains a box. If that inner box is `Full x`, give `Full x`. If it is `Empty`, give `Empty`. An outer `Empty` is `Empty`.",
      starter: hs`unwrapOnce :: Box (Box a) -> Box a
unwrapOnce (Full (Full x)) = undefined
unwrapOnce (Full Empty) = undefined
unwrapOnce Empty = undefined
`,
      tests: [
        { expr: "unwrapOnce (Full (Full True))", expected: "Full True" },
        { expr: "unwrapOnce (Full Empty)", expected: "Empty :: Box Int" },
        { expr: "unwrapOnce (Empty :: Box (Box Char))", expected: "Empty" },
        { expr: "unwrapOnce (Full (Full (Full 'z')))", expected: "Full (Full 'z')", label: "only one Full is peeled" },
      ],
      hint: "The nested pattern `Full (Full x)` names the inner value `x`, so the answer is `Full x`.",
      solution: hs`unwrapOnce :: Box (Box a) -> Box a
unwrapOnce (Full (Full x)) = Full x
unwrapOnce (Full Empty) = Empty
unwrapOnce Empty = Empty
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Fill in `addLits`. If the top is a `Plus` of two `N`s, replace it by their sum. Do not look inside, and do not change anything else.",
      starter: hs`addLits :: Expr -> Expr
addLits (Plus (N a) (N b)) = undefined
addLits e = undefined
`,
      tests: [
        { expr: "addLits twoN", expected: "N 5" },
        { expr: "addLits (Plus (N 0) (N 0))", expected: "N 0" },
        { expr: "addLits (Plus (N 2) (V \"x\"))", expected: "Plus (N 2) (V \"x\")" },
        { expr: "addLits (Plus (Plus (N 1) (N 1)) (N 1))", expected: "Plus (Plus (N 1) (N 1)) (N 1)" },
        { expr: "addLits (N 9)", expected: "N 9" },
      ],
      hint: "`N (a + b)`.",
      solution: hs`addLits :: Expr -> Expr
addLits (Plus (N a) (N b)) = N (a + b)
addLits e = e
`,
    },
    {
      k: "write",
      setup: propSetup,
      body: "Fill in `dropTrueAnd`. One-step, top only: `T && p` is `p`, and `p && T` is `p`. Anything else is unchanged.",
      starter: hs`dropTrueAnd :: Prop -> Prop
dropTrueAnd (Conj T p) = undefined
dropTrueAnd (Conj p T) = undefined
dropTrueAnd p = undefined
`,
      tests: [
        { expr: "dropTrueAnd tAndA", expected: "Atom \"a\"" },
        { expr: "dropTrueAnd aAndT", expected: "Atom \"a\"" },
        { expr: "dropTrueAnd (Conj T T)", expected: "T" },
        { expr: "dropTrueAnd (Conj F (Atom \"a\"))", expected: "Conj F (Atom \"a\")" },
        { expr: "dropTrueAnd (Conj T (Conj T (Atom \"b\")))", expected: "Conj T (Atom \"b\")", label: "only the outer T is dropped" },
      ],
      hint: "Each of the first two right-hand sides is `p`. The catch-all is `p` too, meaning 'give the input back'.",
      solution: hs`dropTrueAnd :: Prop -> Prop
dropTrueAnd (Conj T p) = p
dropTrueAnd (Conj p T) = p
dropTrueAnd p = p
`,
    },
    {
      k: "write",
      setup: propSetup,
      body: "Fill in `peelNotNot`. If the top is `Neg` of a `Neg`, give the inner proposition. Do not walk into `Conj` or `Disj`.",
      starter: hs`peelNotNot :: Prop -> Prop
peelNotNot (Neg (Neg p)) = undefined
peelNotNot p = undefined
`,
      tests: [
        { expr: "peelNotNot nnB", expected: "Atom \"b\"" },
        { expr: "peelNotNot (Neg (Atom \"b\"))", expected: "Neg (Atom \"b\")" },
        { expr: "peelNotNot (Neg (Neg (Neg (Atom \"a\"))))", expected: "Neg (Atom \"a\")" },
        { expr: "peelNotNot (Conj nnB (Atom \"a\"))", expected: "Conj nnB (Atom \"a\")" },
        { expr: "peelNotNot T", expected: "T" },
      ],
      hint: "Return `p` in the nested case.",
      solution: hs`peelNotNot :: Prop -> Prop
peelNotNot (Neg (Neg p)) = p
peelNotNot p = p
`,
    },
    {
      k: "quiz",
      q: "What does `let g t = case t of { (True, p) -> p; (p, True) -> p; q -> q } in g (True, (True, False))` give?",
      options: ["`(True, False)`", "`False`", "`True`", "`(True, True)`"],
      answer: 0,
      why: "The first equation matches, so the right component is returned as-is. The inner `(True, False)` is not rewritten.",
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Fill in `isTimesOne`. It is `True` when the top is a `Times` with `N 1` on either side.",
      starter: hs`isTimesOne :: Expr -> Bool
isTimesOne e = undefined
`,
      tests: [
        { expr: "isTimesOne xTimes1", expected: "True" },
        { expr: "isTimesOne oneTimesX", expected: "True" },
        { expr: "isTimesOne (Times (N 1) (N 1))", expected: "True" },
        { expr: "isTimesOne (Times (V \"x\") (N 2))", expected: "False" },
        { expr: "isTimesOne (Plus (N 1) (V \"x\"))", expected: "False" },
      ],
      hint: "Two nested patterns returning `True`, then `_ = False`.",
      solution: hs`isTimesOne :: Expr -> Bool
isTimesOne (Times (N 1) _) = True
isTimesOne (Times _ (N 1)) = True
isTimesOne _ = False
`,
    },
    {
      k: "write",
      setup: propSetup,
      body: "Fill in `dropFalseOr`. One-step: `F || p` and `p || F` both become `p`.",
      starter: hs`dropFalseOr :: Prop -> Prop
dropFalseOr p = undefined
`,
      tests: [
        { expr: "dropFalseOr fOrA", expected: "Atom \"a\"" },
        { expr: "dropFalseOr aOrF", expected: "Atom \"a\"" },
        { expr: "dropFalseOr (Disj F F)", expected: "F" },
        { expr: "dropFalseOr (Disj T (Atom \"a\"))", expected: "Disj T (Atom \"a\")" },
        { expr: "dropFalseOr (Disj F fOrA)", expected: "fOrA" },
      ],
      hint: "`dropFalseOr (Disj F p) = p`, then the symmetric line, then a catch-all.",
      solution: hs`dropFalseOr :: Prop -> Prop
dropFalseOr (Disj F p) = p
dropFalseOr (Disj p F) = p
dropFalseOr p = p
`,
    },
    {
      k: "quiz",
      q: "Where should the catch-all `tidy e = e` go in a one-step rewriter?",
      options: [
        "First, so unmatched values are fast",
        "Last, after every specific nested pattern",
        "Anywhere: Haskell picks the most specific line",
        "You must not write one; GHC inserts it",
      ],
      answer: 1,
      why: "The first matching equation wins. A catch-all at the top would hide every rule. Put specific shapes first, `tidy e = e` last.",
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Fill in `peelZeroRight`. If the top is `e + 0`, give `e`. Other expressions stay as they are.",
      starter: hs`peelZeroRight :: Expr -> Expr
peelZeroRight e = undefined
`,
      tests: [
        { expr: "peelZeroRight xPlusZ", expected: "V \"x\"" },
        { expr: "peelZeroRight zPlusX", expected: "zPlusX" },
        { expr: "peelZeroRight (Plus (Plus (V \"x\") (N 0)) (N 0))", expected: "Plus (V \"x\") (N 0)" },
        { expr: "peelZeroRight (Plus (V \"x\") (N 1))", expected: "Plus (V \"x\") (N 1)" },
      ],
      hint: "`peelZeroRight (Plus e (N 0)) = e`.",
      solution: hs`peelZeroRight :: Expr -> Expr
peelZeroRight (Plus e (N 0)) = e
peelZeroRight e = e
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Fill in `zeroTimes`. If the top is `0 * e`, give `N 0`. Do not also handle `e * 0` in this question, and do not recurse.",
      starter: hs`zeroTimes :: Expr -> Expr
zeroTimes e = undefined
`,
      tests: [
        { expr: "zeroTimes (Times (N 0) (V \"x\"))", expected: "N 0" },
        { expr: "zeroTimes (Times (V \"x\") (N 0))", expected: "Times (V \"x\") (N 0)" },
        { expr: "zeroTimes (Times (N 0) (Plus (N 1) (N 2)))", expected: "N 0" },
        { expr: "zeroTimes (Plus (Times (N 0) (V \"x\")) (N 1))", expected: "Plus (Times (N 0) (V \"x\")) (N 1)" },
      ],
      hint: "One nested pattern, then a catch-all.",
      solution: hs`zeroTimes :: Expr -> Expr
zeroTimes (Times (N 0) _) = N 0
zeroTimes e = e
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `peelZero`, still one-step: drop a `0` on **either** side of a top `Plus`. If both sides are `N 0`, the left-hand rule should win, giving `N 0`.",
      starter: hs`peelZero :: Expr -> Expr
peelZero e = undefined
`,
      tests: [
        { expr: "peelZero zPlusX", expected: "V \"x\"" },
        { expr: "peelZero xPlusZ", expected: "V \"x\"" },
        { expr: "peelZero (Plus (N 0) (N 0))", expected: "N 0" },
        { expr: "peelZero nestedZ", expected: "Plus (N 0) (V \"x\")" },
        { expr: "peelZero twoN", expected: "twoN" },
      ],
      hint: "Put `Plus (N 0) e` before `Plus e (N 0)`, then the catch-all.",
      solution: hs`peelZero :: Expr -> Expr
peelZero (Plus (N 0) e) = e
peelZero (Plus e (N 0)) = e
peelZero e = e
`,
    },
    {
      k: "quiz",
      q: "What does `let f xs = case xs of { (x : y : zs) | x + y == 0 -> f zs; (x : zs) -> x : f zs; [] -> [] } in f [3, -3, 4, 1, -1]` give?",
      options: ["`[4]`", "`[]`", "`[4, 1, -1]`", "`[3, -3, 4]`"],
      answer: 0,
      why: "`3` and `-3` cancel, then `1` and `-1` cancel, and `4` is kept. The rule only cancels **adjacent** opposites.",
    },
    {
      k: "write",
      setup: polySetup,
      body: "Write `combineFirst`, a one-step combine on a polynomial list. If the first two pairs share a variable, replace them by one pair with the summed coefficient. Otherwise return the list unchanged.",
      starter: hs`combineFirst :: Poly -> Poly
combineFirst ts = undefined
`,
      tests: [
        { expr: "combineFirst [(\"x\", 2), (\"x\", 3), (\"y\", 1)]", expected: "[(\"x\", 5), (\"y\", 1)]" },
        { expr: "combineFirst [(\"x\", 2), (\"y\", 1), (\"x\", 3)]", expected: "[(\"x\", 2), (\"y\", 1), (\"x\", 3)]" },
        { expr: "combineFirst [(\"x\", 4)]", expected: "[(\"x\", 4)]" },
        { expr: "combineFirst ([] :: Poly)", expected: "[]" },
        { expr: "combineFirst [(\"x\", 2), (\"x\", -2)]", expected: "[(\"x\", 0)]" },
      ],
      hint: "Pattern `( (v, a) : (w, b) : rest )` with a guard `v == w`.",
      solution: hs`combineFirst :: Poly -> Poly
combineFirst ((v, a) : (w, b) : rest) | v == w = (v, a + b) : rest
combineFirst ts = ts
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Fill in `subLits`. If the top is a `Minus` of two `N`s, replace it by their difference. One-step only.",
      starter: hs`subLits :: Expr -> Expr
subLits e = undefined
`,
      tests: [
        { expr: "subLits (Minus (N 7) (N 3))", expected: "N 4" },
        { expr: "subLits (Minus (N 3) (N 3))", expected: "N 0" },
        { expr: "subLits (Minus (N 3) (V \"x\"))", expected: "Minus (N 3) (V \"x\")" },
        { expr: "subLits yMinusY", expected: "yMinusY" },
      ],
      hint: "`N (a - b)`. `yMinusY` is not two `N`s, so it stays.",
      solution: hs`subLits :: Expr -> Expr
subLits (Minus (N a) (N b)) = N (a - b)
subLits e = e
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `leafCount`, the number of `N` and `V` nodes in an expression. This is not a rewrite; it is practice walking the same tree you will rewrite.",
      starter: hs`leafCount :: Expr -> Int
leafCount e = undefined
`,
      tests: [
        { expr: "leafCount (V \"x\")", expected: "1" },
        { expr: "leafCount twoN", expected: "2" },
        { expr: "leafCount eDeep", expected: "4" },
        { expr: "leafCount nestedZ", expected: "3" },
      ],
      hint: "`N` and `V` give 1. Each operator adds the counts of its two children.",
      solution: hs`leafCount :: Expr -> Int
leafCount (N _) = 1
leafCount (V _) = 1
leafCount (Plus a b) = leafCount a + leafCount b
leafCount (Times a b) = leafCount a + leafCount b
leafCount (Minus a b) = leafCount a + leafCount b
`,
    },
    {
      k: "quiz",
      q: "Replacing a subexpression means: find every node that is `==` to a given tree, and swap in a new tree. How is that different from a rewrite **rule** such as `0 + e` becomes `e`?",
      options: [
        "There is no difference",
        "A rule matches a shape (some parts are named, some are fixed); a replacement looks for one exact tree",
        "Replacement can only run at the top; a rule always walks the whole tree",
        "A rule needs `deriving (Ord)`",
      ],
      answer: 1,
      why: "`Plus (N 0) e` matches many different right-hand children. Replacement with `==` only hits copies of one particular tree, for example every `V \"x\"`.",
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `swapTop`. If the whole expression is `==` to `old`, give `new`. Otherwise give the expression unchanged. This is a one-node replacement, not a walk.",
      starter: hs`swapTop :: Expr -> Expr -> Expr -> Expr
swapTop old new e = undefined
`,
      tests: [
        { expr: "swapTop (V \"x\") (N 4) (V \"x\")", expected: "N 4" },
        { expr: "swapTop (V \"x\") (N 4) (Plus (V \"x\") (N 1))", expected: "Plus (V \"x\") (N 1)" },
        { expr: "swapTop zPlusX (V \"x\") zPlusX", expected: "V \"x\"" },
        { expr: "swapTop (N 0) (N 1) (V \"x\")", expected: "V \"x\"" },
      ],
      hint: "`if e == old then new else e`.",
      solution: hs`swapTop :: Expr -> Expr -> Expr -> Expr
swapTop old new e = if e == old then new else e
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `peelOneLeft`. If the top is `1 * e`, give `e`. Other expressions are unchanged.",
      starter: hs`peelOneLeft :: Expr -> Expr
peelOneLeft e = undefined
`,
      tests: [
        { expr: "peelOneLeft oneTimesX", expected: "V \"x\"" },
        { expr: "peelOneLeft xTimes1", expected: "xTimes1" },
        { expr: "peelOneLeft (Times (N 1) nestedZ)", expected: "nestedZ" },
        { expr: "peelOneLeft (Times (N 2) (V \"x\"))", expected: "Times (N 2) (V \"x\")" },
      ],
      hint: "`peelOneLeft (Times (N 1) e) = e`.",
      solution: hs`peelOneLeft :: Expr -> Expr
peelOneLeft (Times (N 1) e) = e
peelOneLeft e = e
`,
    },
  ],
};

const level2: DrillSet = {
  id: "b-rewrite-l2",
  lesson: "",
  level: 2,
  title: "Level 2: Standard",
  intro: md(
    "Now the rule has to run **everywhere**. The safe recipe is bottom-up: rewrite the children first, then try the nested patterns on the new top.",
    "",
    "```",
    "tidyZero (Plus a b) = plus0 (tidyZero a) (tidyZero b)",
    "plus0 (N 0) e      = e",
    "plus0 e      (N 0) = e",
    "plus0 a      b     = Plus a b",
    "```",
    "",
    "That is different from one-step: `tidyZero nestedZ` becomes `V \"x\"`, because the inner `0 + x` is cleaned before the outer `Plus` is rebuilt.",
  ),
  drills: [
    {
      k: "quiz",
      q: "Why rewrite the children of `Plus a b` before you try the `0 + e` rule at that node?",
      options: [
        "Haskell will not compile a rule that looks at the top first",
        "Cleaning the children can produce a `N 0` that the top rule then matches",
        "It makes the function tail recursive",
        "So that `==` on expressions ignores constructors",
      ],
      answer: 1,
      why: "In `Plus (Plus (N 0) (N 0)) (V \"x\")`, the inner sum becomes `N 0` first. Only then does the outer node look like `0 + x` and peel.",
    },
    {
      k: "quiz",
      q: "The spec lists three rules. You add a fourth, `x - x` becomes `0`, which is mathematically true. A test compares trees with `==`. What happens?",
      options: [
        "The test passes, because the answer is simpler",
        "The test fails whenever the expected tree still had a `Minus`",
        "The program will not compile",
        "The tester only checks the value, not the tree",
      ],
      answer: 1,
      why: "Auto-tests expect exactly the tree the given rules produce. An extra rule changes the shape, so `==` is `False` even though the maths is right.",
    },
    {
      k: "quiz",
      q: "One-step `peelZeroLeft` on `nestedZ = 0 + (0 + x)` gives `0 + x`. What does a bottom-up walk with the same rule give?",
      options: ["`0 + (0 + x)`, unchanged", "`0 + x`", "`x`", "`0`"],
      answer: 2,
      why: "The inner `0 + x` becomes `x` first. The outer node is then `0 + x`, which becomes `x`.",
    },
    {
      k: "quiz",
      q: "What does `let { w [] = []; w (0 : xs) = w xs; w (x : xs) = x : w xs } in w [0, 0, 4, 0, 5]` give?",
      options: ["`[4, 5]`", "`[0, 4, 5]`", "`[4, 0, 5]`", "`[]`"],
      answer: 0,
      why: "Each 0 is dropped as the walk goes through the whole list. This is applying the rule everywhere, not one-step at the front only.",
    },
    {
      k: "quiz",
      q: "`onEvery r` rebuilds every `Plus`/`Times`/`Minus` with `r` after walking the children. `r` itself is a one-step rule. What does `onEvery peelZeroLeft` do to `Times (Plus (N 0) (V \"x\")) (N 2)`?",
      options: [
        "`Times (V \"x\") (N 2)`",
        "`V \"x\"`",
        "Unchanged, because the top is `Times`",
        "`Plus (N 0) (Times (V \"x\") (N 2))`",
      ],
      answer: 0,
      why: "The walk reaches the inner `Plus` and `peelZeroLeft` turns it into `V \"x\"`. The outer `Times` is rebuilt around that. The top rule does not match `Times`, so the `Times` stays.",
    },
    {
      k: "quiz",
      q: "What does `let { flat (a, b) = flat a ++ flat b; flat n = [n] } in flat ((1, 2), (3, 4))` give?",
      options: ["`[1, 2, 3, 4]`", "`[(1, 2), (3, 4)]`", "`[1, 4]`", "`[4]`"],
      answer: 0,
      why: "Flattening a nested pair is the same idea as flattening nested `Plus` nodes: walk in, keep the leaves.",
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `tidyZeroLeft`, which drops `0 + e` **everywhere**. Rewrite both children of every operator, then if the new top is `Plus (N 0) e`, give `e`.",
      starter: hs`tidyZeroLeft :: Expr -> Expr
tidyZeroLeft e = undefined
`,
      tests: [
        { expr: "tidyZeroLeft nestedZ", expected: "V \"x\"" },
        { expr: "tidyZeroLeft zPlusX", expected: "V \"x\"" },
        { expr: "tidyZeroLeft eDeep", expected: "Times (V \"x\") (Plus (V \"y\") (N 0))" },
        { expr: "tidyZeroLeft xPlusZ", expected: "xPlusZ" },
        { expr: "tidyZeroLeft (Plus (Plus (N 0) (N 0)) (V \"z\"))", expected: "V \"z\"" },
      ],
      hint: "A helper `plus0 (N 0) e = e; plus0 a b = Plus a b` keeps the rule off the recursive function.",
      solution: hs`tidyZeroLeft :: Expr -> Expr
tidyZeroLeft (Plus a b) = plus0 (tidyZeroLeft a) (tidyZeroLeft b)
tidyZeroLeft (Times a b) = Times (tidyZeroLeft a) (tidyZeroLeft b)
tidyZeroLeft (Minus a b) = Minus (tidyZeroLeft a) (tidyZeroLeft b)
tidyZeroLeft e = e

plus0 :: Expr -> Expr -> Expr
plus0 (N 0) e = e
plus0 a b = Plus a b
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `tidyOneRight`, which drops `e * 1` everywhere, using the same children-first recipe.",
      starter: hs`tidyOneRight :: Expr -> Expr
tidyOneRight e = undefined
`,
      tests: [
        { expr: "tidyOneRight xTimes1", expected: "V \"x\"" },
        { expr: "tidyOneRight (Times (Times (V \"x\") (N 1)) (N 1))", expected: "V \"x\"" },
        { expr: "tidyOneRight (Plus xTimes1 (N 2))", expected: "Plus (V \"x\") (N 2)" },
        { expr: "tidyOneRight oneTimesX", expected: "oneTimesX" },
        { expr: "tidyOneRight (N 1)", expected: "N 1" },
      ],
      hint: "Walk every constructor. After rebuilding a `Times`, if the right child is `N 1`, keep the left.",
      solution: hs`tidyOneRight :: Expr -> Expr
tidyOneRight (Plus a b) = Plus (tidyOneRight a) (tidyOneRight b)
tidyOneRight (Times a b) = times1 (tidyOneRight a) (tidyOneRight b)
tidyOneRight (Minus a b) = Minus (tidyOneRight a) (tidyOneRight b)
tidyOneRight e = e

times1 :: Expr -> Expr -> Expr
times1 e (N 1) = e
times1 a b = Times a b
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `tidyZero`, dropping a `0` on **either** side of every `Plus`. Use the left-hand rule first so `0 + 0` becomes `N 0`.",
      starter: hs`tidyZero :: Expr -> Expr
tidyZero e = undefined
`,
      tests: [
        { expr: "tidyZero nestedZ", expected: "V \"x\"" },
        { expr: "tidyZero eDeep", expected: "Times (V \"x\") (V \"y\")" },
        { expr: "tidyZero (Plus (N 0) (N 0))", expected: "N 0" },
        { expr: "tidyZero (Plus xPlusZ zPlusX)", expected: "Plus (V \"x\") (V \"x\")" },
        { expr: "tidyZero twoN", expected: "twoN" },
      ],
      hint: "`plusZ (N 0) e = e; plusZ e (N 0) = e; plusZ a b = Plus a b`.",
      solution: hs`tidyZero :: Expr -> Expr
tidyZero (Plus a b) = plusZ (tidyZero a) (tidyZero b)
tidyZero (Times a b) = Times (tidyZero a) (tidyZero b)
tidyZero (Minus a b) = Minus (tidyZero a) (tidyZero b)
tidyZero e = e

plusZ :: Expr -> Expr -> Expr
plusZ (N 0) e = e
plusZ e (N 0) = e
plusZ a b = Plus a b
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `tidyOne`, dropping a `1` on either side of every `Times`. `1 * 1` should become `N 1` (left-hand rule first).",
      starter: hs`tidyOne :: Expr -> Expr
tidyOne e = undefined
`,
      tests: [
        { expr: "tidyOne xTimes1", expected: "V \"x\"" },
        { expr: "tidyOne oneTimesX", expected: "V \"x\"" },
        { expr: "tidyOne (Times (N 1) (N 1))", expected: "N 1" },
        { expr: "tidyOne (Plus oneTimesX xTimes1)", expected: "Plus (V \"x\") (V \"x\")" },
        { expr: "tidyOne (Times (V \"x\") (N 2))", expected: "Times (V \"x\") (N 2)" },
      ],
      hint: "Same helper style as `tidyZero`, on `Times`.",
      solution: hs`tidyOne :: Expr -> Expr
tidyOne (Plus a b) = Plus (tidyOne a) (tidyOne b)
tidyOne (Times a b) = times1 (tidyOne a) (tidyOne b)
tidyOne (Minus a b) = Minus (tidyOne a) (tidyOne b)
tidyOne e = e

times1 :: Expr -> Expr -> Expr
times1 (N 1) e = e
times1 e (N 1) = e
times1 a b = Times a b
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `tidyCancel`. Walk the tree, then if a `Minus` has two **equal** children, replace it by `N 0`.",
      starter: hs`tidyCancel :: Expr -> Expr
tidyCancel e = undefined
`,
      tests: [
        { expr: "tidyCancel yMinusY", expected: "N 0" },
        { expr: "tidyCancel (Plus yMinusY (N 1))", expected: "Plus (N 0) (N 1)" },
        { expr: "tidyCancel (Minus (Plus (V \"x\") (V \"y\")) (Plus (V \"x\") (V \"y\")))", expected: "N 0" },
        { expr: "tidyCancel (Minus (V \"x\") (V \"y\"))", expected: "Minus (V \"x\") (V \"y\")" },
        { expr: "tidyCancel (Minus zPlusX (V \"x\"))", expected: "Minus zPlusX (V \"x\")" },
      ],
      hint: "After walking, `if a' == b' then N 0 else Minus a' b'`.",
      solution: hs`tidyCancel :: Expr -> Expr
tidyCancel (Plus a b) = Plus (tidyCancel a) (tidyCancel b)
tidyCancel (Times a b) = Times (tidyCancel a) (tidyCancel b)
tidyCancel (Minus a b) =
  let a' = tidyCancel a
      b' = tidyCancel b
  in if a' == b' then N 0 else Minus a' b'
tidyCancel e = e
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `foldPlus`. Walk the tree; after walking, a `Plus` of two `N`s becomes a single `N`. No other folding.",
      starter: hs`foldPlus :: Expr -> Expr
foldPlus e = undefined
`,
      tests: [
        { expr: "foldPlus twoN", expected: "N 5" },
        { expr: "foldPlus (Plus (Plus (N 1) (N 2)) (N 3))", expected: "N 6" },
        { expr: "foldPlus (Plus (N 1) (V \"x\"))", expected: "Plus (N 1) (V \"x\")" },
        { expr: "foldPlus (Times twoN (N 1))", expected: "Times (N 5) (N 1)" },
        { expr: "foldPlus (V \"z\")", expected: "V \"z\"" },
      ],
      hint: "`add (N a) (N b) = N (a + b); add a b = Plus a b`.",
      solution: hs`foldPlus :: Expr -> Expr
foldPlus (Plus a b) = add (foldPlus a) (foldPlus b)
foldPlus (Times a b) = Times (foldPlus a) (foldPlus b)
foldPlus (Minus a b) = Minus (foldPlus a) (foldPlus b)
foldPlus e = e

add :: Expr -> Expr -> Expr
add (N a) (N b) = N (a + b)
add a b = Plus a b
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Write `tidyIds`. Walk bottom-up, then apply **only** these rules at each new top:",
        "",
        "```",
        "0 + e  = e       e + 0  = e",
        "1 * e  = e       e * 1  = e",
        "e - e  = 0",
        "```",
        "",
        "Do not fold `2 + 3`, and do not turn `0 * x` into `0`.",
      ),
      starter: hs`tidyIds :: Expr -> Expr
tidyIds e = undefined
`,
      tests: [
        { expr: "tidyIds eDeep", expected: "Times (V \"x\") (V \"y\")" },
        { expr: "tidyIds (Minus xTimes1 oneTimesX)", expected: "N 0" },
        { expr: "tidyIds twoN", expected: "twoN" },
        { expr: "tidyIds (Times (N 0) (V \"x\"))", expected: "Times (N 0) (V \"x\")" },
        { expr: "tidyIds nestedZ", expected: "V \"x\"" },
      ],
      hint: "Helpers `plusI`, `timesI`, `minusI`. `minusI a b` uses `a == b`.",
      solution: hs`tidyIds :: Expr -> Expr
tidyIds (Plus a b) = plusI (tidyIds a) (tidyIds b)
tidyIds (Times a b) = timesI (tidyIds a) (tidyIds b)
tidyIds (Minus a b) = minusI (tidyIds a) (tidyIds b)
tidyIds e = e

plusI :: Expr -> Expr -> Expr
plusI (N 0) e = e
plusI e (N 0) = e
plusI a b = Plus a b

timesI :: Expr -> Expr -> Expr
timesI (N 1) e = e
timesI e (N 1) = e
timesI a b = Times a b

minusI :: Expr -> Expr -> Expr
minusI a b | a == b = N 0
minusI a b = Minus a b
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `swapIn old new e`, which replaces **every** subtree of `e` that is `==` to `old` with `new`. Walk into children only when the current node is not itself a match (so a match is not also rewritten inside).",
      starter: hs`swapIn :: Expr -> Expr -> Expr -> Expr
swapIn old new e = undefined
`,
      tests: [
        { expr: "swapIn (V \"x\") (N 4) (Plus (V \"x\") (V \"x\"))", expected: "Plus (N 4) (N 4)" },
        { expr: "swapIn zPlusX (V \"x\") (Times zPlusX (N 2))", expected: "Times (V \"x\") (N 2)" },
        { expr: "swapIn (V \"x\") (N 1) (V \"y\")", expected: "V \"y\"" },
        { expr: "swapIn twoN (N 5) (Plus twoN (N 1))", expected: "Plus (N 5) (N 1)" },
        { expr: "swapIn (V \"x\") (Plus (N 1) (N 1)) (V \"x\")", expected: "Plus (N 1) (N 1)" },
      ],
      hint: "If `e == old` then `new`. Otherwise rebuild with `swapIn old new` on each child.",
      solution: hs`swapIn :: Expr -> Expr -> Expr -> Expr
swapIn old new e
  | e == old = new
  | otherwise = case e of
      Plus a b -> Plus (swapIn old new a) (swapIn old new b)
      Times a b -> Times (swapIn old new a) (swapIn old new b)
      Minus a b -> Minus (swapIn old new a) (swapIn old new b)
      _ -> e
`,
    },
    {
      k: "write",
      setup: stepSetup,
      body: md(
        "`step` is given: it is the one-step identity rewriter (`0+e`, `e+0`, `1*e`, `e*1`, `e-e`).",
        "",
        "Write `onEvery`, which applies `step` at **every** node after walking the children. Leaves (`N`, `V`) still go through `step` (it will leave them alone).",
      ),
      starter: hs`onEvery :: Expr -> Expr
onEvery e = undefined
`,
      tests: [
        { expr: "onEvery nestedZ", expected: "V \"x\"" },
        { expr: "onEvery eDeep", expected: "Times (V \"x\") (V \"y\")" },
        { expr: "onEvery (Minus xTimes1 oneTimesX)", expected: "N 0" },
        { expr: "onEvery twoN", expected: "twoN" },
        { expr: "onEvery (Times (N 0) (V \"x\"))", expected: "Times (N 0) (V \"x\")" },
      ],
      hint: "`onEvery (Plus a b) = step (Plus (onEvery a) (onEvery b))`, and the same for `Times` and `Minus`. `onEvery e = step e` for leaves.",
      solution: hs`onEvery :: Expr -> Expr
onEvery (Plus a b) = step (Plus (onEvery a) (onEvery b))
onEvery (Times a b) = step (Times (onEvery a) (onEvery b))
onEvery (Minus a b) = step (Minus (onEvery a) (onEvery b))
onEvery e = step e
`,
    },
    {
      k: "write",
      setup: polySetup,
      body: "Write `gather`. It combines coefficients of the same variable. Keep the **first** place each name appears, drop nothing (a summed coefficient of 0 stays).",
      starter: hs`gather :: Poly -> Poly
gather ts = undefined
`,
      tests: [
        { expr: "gather poly1", expected: "[(\"x\", 5), (\"y\", 1)]" },
        { expr: "gather poly2", expected: "[(\"y\", 0), (\"x\", 1), (\"z\", 2)]" },
        { expr: "gather []", expected: "[]" },
        { expr: "gather [(\"a\", 3)]", expected: "[(\"a\", 3)]" },
        { expr: "gather [(\"q\", 1), (\"q\", 1), (\"q\", 1)]", expected: "[(\"q\", 3)]" },
      ],
      hint: "For `(v, n) : rest`, sum every later coefficient of `v`, then recurse on the pairs whose name is not `v`.",
      solution: hs`gather :: Poly -> Poly
gather [] = []
gather ((v, n) : rest) = (v, n + extra) : gather leftover
  where
    extra = sum [m | (w, m) <- rest, w == v]
    leftover = [(w, m) | (w, m) <- rest, w /= v]
`,
    },
    {
      k: "write",
      setup: signedSetup,
      body: "Write `cancelAdj`. Walk a list of credits and debits and cancel an adjacent opposite pair with the same name (`Credit v` next to `Debit v`, either order). After cancelling a pair, look again from that point (so `Credit \"x\" : Debit \"x\" : Credit \"x\" : Debit \"x\"` all go).",
      starter: hs`cancelAdj :: [Signed] -> [Signed]
cancelAdj xs = undefined
`,
      tests: [
        { expr: "cancelAdj [Credit \"x\", Debit \"x\", Credit \"y\"]", expected: "[Credit \"y\"]" },
        { expr: "cancelAdj [Debit \"a\", Credit \"a\"]", expected: "[]" },
        { expr: "cancelAdj [Credit \"x\", Credit \"x\", Debit \"x\"]", expected: "[Credit \"x\"]" },
        { expr: "cancelAdj [Credit \"x\", Debit \"y\"]", expected: "[Credit \"x\", Debit \"y\"]" },
        { expr: "cancelAdj []", expected: "[]" },
      ],
      hint: "Two nested patterns with a guard `v == w` that recurse on `rest` without keeping the pair. Then `x : cancelAdj rest`.",
      solution: hs`cancelAdj :: [Signed] -> [Signed]
cancelAdj (Credit v : Debit w : rest) | v == w = cancelAdj rest
cancelAdj (Debit v : Credit w : rest) | v == w = cancelAdj rest
cancelAdj (x : rest) = x : cancelAdj rest
cancelAdj [] = []
`,
    },
    {
      k: "write",
      setup: propSetup,
      body: md(
        "Write `tidyConj`. Walk the proposition, then apply only:",
        "",
        "```",
        "T && p  = p       p && T  = p",
        "F && p  = F       p && F  = F",
        "```",
        "",
        "Do not add `p && p = p`. Left-hand `T`/`F` rules come first.",
      ),
      starter: hs`tidyConj :: Prop -> Prop
tidyConj p = undefined
`,
      tests: [
        { expr: "tidyConj tAndA", expected: "Atom \"a\"" },
        { expr: "tidyConj (Conj T (Conj F (Atom \"b\")))", expected: "F" },
        { expr: "tidyConj (Disj tAndA (Atom \"c\"))", expected: "Disj (Atom \"a\") (Atom \"c\")" },
        { expr: "tidyConj (Conj (Atom \"a\") (Atom \"a\"))", expected: "Conj (Atom \"a\") (Atom \"a\")" },
        { expr: "tidyConj (Neg tAndA)", expected: "Neg (Atom \"a\")" },
      ],
      hint: "`tidyConj (Conj a b) = andP (tidyConj a) (tidyConj b)`, and rebuild `Disj`/`Neg` by walking.",
      solution: hs`tidyConj :: Prop -> Prop
tidyConj (Conj a b) = andP (tidyConj a) (tidyConj b)
tidyConj (Disj a b) = Disj (tidyConj a) (tidyConj b)
tidyConj (Neg a) = Neg (tidyConj a)
tidyConj p = p

andP :: Prop -> Prop -> Prop
andP T p = p
andP p T = p
andP F _ = F
andP _ F = F
andP a b = Conj a b
`,
    },
    {
      k: "write",
      setup: propSetup,
      body: "Write `tidyNeg`. Walk, then at each `Neg`: `Neg T` is `F`, `Neg F` is `T`, `Neg (Neg p)` is `p` (and that `p` should already have been tidied). Any other `Neg` stays.",
      starter: hs`tidyNeg :: Prop -> Prop
tidyNeg p = undefined
`,
      tests: [
        { expr: "tidyNeg nnB", expected: "Atom \"b\"" },
        { expr: "tidyNeg (Neg T)", expected: "F" },
        { expr: "tidyNeg (Neg (Neg (Neg F)))", expected: "T" },
        { expr: "tidyNeg (Conj nnB (Neg F))", expected: "Conj (Atom \"b\") T" },
        { expr: "tidyNeg (Neg (Atom \"a\"))", expected: "Neg (Atom \"a\")" },
      ],
      hint: "`tidyNeg (Neg p) = neg (tidyNeg p)` with a small `neg` helper.",
      solution: hs`tidyNeg :: Prop -> Prop
tidyNeg (Neg p) = neg (tidyNeg p)
tidyNeg (Conj a b) = Conj (tidyNeg a) (tidyNeg b)
tidyNeg (Disj a b) = Disj (tidyNeg a) (tidyNeg b)
tidyNeg p = p

neg :: Prop -> Prop
neg T = F
neg F = T
neg (Neg p) = p
neg p = Neg p
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `coeffOf v e`, the coefficient of variable `v` if `e` is a **sum** of numbers, variables, and `k * v` / `v * k` forms. You may assume there is no `Minus` and no product of two variables. A plain `V v` counts as 1.",
      starter: hs`coeffOf :: String -> Expr -> Int
coeffOf v e = undefined
`,
      tests: [
        { expr: "coeffOf \"x\" (Plus (V \"x\") (Times (N 3) (V \"x\")))", expected: "4" },
        { expr: "coeffOf \"y\" (Plus (V \"x\") (N 2))", expected: "0" },
        { expr: "coeffOf \"x\" (Times (V \"x\") (N 5))", expected: "5" },
        { expr: "coeffOf \"x\" (Plus (N 7) (V \"x\"))", expected: "1" },
        { expr: "coeffOf \"x\" (V \"x\")", expected: "1" },
      ],
      hint: "On `Plus`, add the two sides. Match `V v`, `Times (N n) (V v)` and `Times (V v) (N n)`. Anything else about a different variable (or a plain `N`) gives 0.",
      solution: hs`coeffOf :: String -> Expr -> Int
coeffOf v (Plus a b) = coeffOf v a + coeffOf v b
coeffOf v (V w) = if w == v then 1 else 0
coeffOf v (Times (N n) (V w)) = if w == v then n else 0
coeffOf v (Times (V w) (N n)) = if w == v then n else 0
coeffOf _ _ = 0
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `plugIn x e body`, which replaces every `V x` in `body` by the whole tree `e`. Other variables and numbers stay. This is replacement of a named leaf, everywhere.",
      starter: hs`plugIn :: String -> Expr -> Expr -> Expr
plugIn x e body = undefined
`,
      tests: [
        { expr: "plugIn \"x\" (N 4) (Plus (V \"x\") (V \"x\"))", expected: "Plus (N 4) (N 4)" },
        { expr: "plugIn \"x\" (Plus (N 1) (N 1)) zPlusX", expected: "Plus (N 0) (Plus (N 1) (N 1))" },
        { expr: "plugIn \"z\" (N 0) xySum", expected: "xySum" },
        { expr: "plugIn \"x\" (V \"y\") (Times (V \"x\") (V \"y\"))", expected: "Times (V \"y\") (V \"y\")" },
        { expr: "plugIn \"x\" (N 1) (N 8)", expected: "N 8" },
      ],
      hint: "`plugIn x e (V w) = if w == x then e else V w`. Rebuild every operator.",
      solution: hs`plugIn :: String -> Expr -> Expr -> Expr
plugIn _ _ (N n) = N n
plugIn x e (V w) = if w == x then e else V w
plugIn x e (Plus a b) = Plus (plugIn x e a) (plugIn x e b)
plugIn x e (Times a b) = Times (plugIn x e a) (plugIn x e b)
plugIn x e (Minus a b) = Minus (plugIn x e a) (plugIn x e b)
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `tidyZeroMul`. Walk, then `0 * e` and `e * 0` both become `N 0`. Do not also peel `+ 0` in this question.",
      starter: hs`tidyZeroMul :: Expr -> Expr
tidyZeroMul e = undefined
`,
      tests: [
        { expr: "tidyZeroMul (Times (N 0) (V \"x\"))", expected: "N 0" },
        { expr: "tidyZeroMul (Times (V \"x\") (N 0))", expected: "N 0" },
        { expr: "tidyZeroMul (Plus (Times (N 0) (V \"y\")) (V \"x\"))", expected: "Plus (N 0) (V \"x\")" },
        { expr: "tidyZeroMul (Times (Plus (N 0) (N 0)) (V \"x\"))", expected: "Times (Plus (N 0) (N 0)) (V \"x\")" },
        { expr: "tidyZeroMul (Times (N 2) (V \"x\"))", expected: "Times (N 2) (V \"x\")" },
      ],
      hint: "The inner `Plus (N 0) (N 0)` is not a `Times`, so it is not turned into `N 0` here.",
      solution: hs`tidyZeroMul :: Expr -> Expr
tidyZeroMul (Plus a b) = Plus (tidyZeroMul a) (tidyZeroMul b)
tidyZeroMul (Times a b) = mul0 (tidyZeroMul a) (tidyZeroMul b)
tidyZeroMul (Minus a b) = Minus (tidyZeroMul a) (tidyZeroMul b)
tidyZeroMul e = e

mul0 :: Expr -> Expr -> Expr
mul0 (N 0) _ = N 0
mul0 _ (N 0) = N 0
mul0 a b = Times a b
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `flattenPlus`, which lists the summands of a nested `Plus` from left to right. `Times` and `Minus` are not flattened: each is one summand.",
      starter: hs`flattenPlus :: Expr -> [Expr]
flattenPlus e = undefined
`,
      tests: [
        { expr: "flattenPlus (Plus (V \"x\") (Plus (N 1) (V \"y\")))", expected: "[V \"x\", N 1, V \"y\"]" },
        { expr: "flattenPlus (Plus (Plus (N 1) (N 2)) (N 3))", expected: "[N 1, N 2, N 3]" },
        { expr: "flattenPlus (Times (V \"x\") (V \"y\"))", expected: "[Times (V \"x\") (V \"y\")]" },
        { expr: "flattenPlus (V \"z\")", expected: "[V \"z\"]" },
        { expr: "flattenPlus (Plus eDeep (N 0))", expected: "[eDeep, N 0]" },
      ],
      hint: "`flattenPlus (Plus a b) = flattenPlus a ++ flattenPlus b`. Any other node is a singleton list.",
      solution: hs`flattenPlus :: Expr -> [Expr]
flattenPlus (Plus a b) = flattenPlus a ++ flattenPlus b
flattenPlus e = [e]
`,
    },
    {
      k: "write",
      setup: polySetup,
      body: "Write `mergeAdj`. Repeatedly combine **adjacent** pairs that share a name (and keep going, so three `x` in a row become one). Pairs that are not next to each other stay separate.",
      starter: hs`mergeAdj :: Poly -> Poly
mergeAdj ts = undefined
`,
      tests: [
        { expr: "mergeAdj [(\"x\", 1), (\"x\", 2), (\"x\", 3)]", expected: "[(\"x\", 6)]" },
        { expr: "mergeAdj [(\"x\", 1), (\"y\", 2), (\"x\", 3)]", expected: "[(\"x\", 1), (\"y\", 2), (\"x\", 3)]" },
        { expr: "mergeAdj [(\"x\", 1), (\"x\", -1), (\"y\", 4)]", expected: "[(\"x\", 0), (\"y\", 4)]" },
        { expr: "mergeAdj []", expected: "[]" },
      ],
      hint: "`mergeAdj ((v, a) : (w, b) : rest) | v == w = mergeAdj ((v, a + b) : rest)`.",
      solution: hs`mergeAdj :: Poly -> Poly
mergeAdj ((v, a) : (w, b) : rest) | v == w = mergeAdj ((v, a + b) : rest)
mergeAdj (t : rest) = t : mergeAdj rest
mergeAdj [] = []
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `countHits t e`, the number of nodes in `e` whose whole subtree is `==` to `t`. Count a match **and** still look inside it.",
      starter: hs`countHits :: Expr -> Expr -> Int
countHits t e = undefined
`,
      tests: [
        { expr: "countHits (V \"x\") (Plus (V \"x\") (V \"x\"))", expected: "2" },
        { expr: "countHits (V \"x\") (V \"x\")", expected: "1" },
        { expr: "countHits twoN (Plus twoN twoN)", expected: "2" },
        { expr: "countHits (N 0) nestedZ", expected: "2" },
        { expr: "countHits (V \"z\") xySum", expected: "0" },
      ],
      hint: "Add 1 if `t == e`, then add the counts from the children (if any).",
      solution: hs`countHits :: Expr -> Expr -> Int
countHits t e = here + kids
  where
    here = if t == e then 1 else 0
    kids = case e of
      Plus a b -> countHits t a + countHits t b
      Times a b -> countHits t a + countHits t b
      Minus a b -> countHits t a + countHits t b
      _ -> 0
`,
    },
    {
      k: "write",
      setup: mixSetup,
      body: md(
        "Write `tidyScale`. Apply these rules **everywhere**, children first:",
        "",
        "```",
        "Scale 1 m            becomes  m",
        "Scale n (Scale k m)  becomes  Scale (n * k) m",
        "```",
        "",
        "Then keep walking into whatever is left. Other constructors are rebuilt.",
      ),
      starter: hs`tidyScale :: Mix -> Mix
tidyScale m = undefined
`,
      tests: [
        { expr: "tidyScale batter", expected: "Scale 3 (Blend Flour Water)" },
        { expr: "tidyScale (Scale 1 Flour)", expected: "Flour" },
        { expr: "tidyScale (Scale 2 (Scale 4 Sugar))", expected: "Scale 8 Sugar" },
        { expr: "tidyScale (Blend (Scale 1 Water) Flour)", expected: "Blend Water Flour" },
        { expr: "tidyScale (Scale 1 (Scale 1 Water))", expected: "Water" },
      ],
      hint: "Walk the inner mix first. Then a helper `scale n m` handles `n == 1` and a nested `Scale`.",
      solution: hs`tidyScale :: Mix -> Mix
tidyScale (Blend a b) = Blend (tidyScale a) (tidyScale b)
tidyScale (Scale n m) = scale n (tidyScale m)
tidyScale m = m

scale :: Int -> Mix -> Mix
scale 1 m = m
scale n (Scale k m) = Scale (n * k) m
scale n m = Scale n m
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Write **two** functions.",
        "",
        "- `stepTimesZero`: one-step, top only, `0 * e` and `e * 0` become `N 0`.",
        "- `walkTimesZero`: the same rule, applied bottom-up everywhere.",
      ),
      starter: hs`stepTimesZero :: Expr -> Expr
stepTimesZero e = undefined

walkTimesZero :: Expr -> Expr
walkTimesZero e = undefined
`,
      tests: [
        { expr: "stepTimesZero (Times (N 0) (V \"x\"))", expected: "N 0" },
        { expr: "stepTimesZero (Plus (Times (N 0) (V \"x\")) (N 1))", expected: "Plus (Times (N 0) (V \"x\")) (N 1)" },
        { expr: "walkTimesZero (Plus (Times (N 0) (V \"x\")) (N 1))", expected: "Plus (N 0) (N 1)" },
        { expr: "walkTimesZero (Times (N 0) (Times (N 0) (V \"y\")))", expected: "N 0" },
        { expr: "stepTimesZero (Times (N 0) (Times (N 0) (V \"y\")))", expected: "N 0" },
      ],
      hint: "`walkTimesZero (Times a b) = mul0 (walkTimesZero a) (walkTimesZero b)`, reusing the one-step helper.",
      solution: hs`stepTimesZero :: Expr -> Expr
stepTimesZero (Times (N 0) _) = N 0
stepTimesZero (Times _ (N 0)) = N 0
stepTimesZero e = e

walkTimesZero :: Expr -> Expr
walkTimesZero (Plus a b) = Plus (walkTimesZero a) (walkTimesZero b)
walkTimesZero (Times a b) = mul0 (walkTimesZero a) (walkTimesZero b)
walkTimesZero (Minus a b) = Minus (walkTimesZero a) (walkTimesZero b)
walkTimesZero e = e

mul0 :: Expr -> Expr -> Expr
mul0 (N 0) _ = N 0
mul0 _ (N 0) = N 0
mul0 a b = Times a b
`,
    },
    {
      k: "write",
      setup: propSetup,
      body: "Write `tidyDisj`. Walk, then `F || p` and `p || F` become `p`, while `T || p` and `p || T` become `T`. Left-hand `T`/`F` first. Do not rewrite `Conj` with these rules.",
      starter: hs`tidyDisj :: Prop -> Prop
tidyDisj p = undefined
`,
      tests: [
        { expr: "tidyDisj aOrF", expected: "Atom \"a\"" },
        { expr: "tidyDisj (Disj T (Atom \"b\"))", expected: "T" },
        { expr: "tidyDisj (Disj F (Disj F (Atom \"c\")))", expected: "Atom \"c\"" },
        { expr: "tidyDisj (Conj aOrF T)", expected: "Conj (Atom \"a\") T" },
        { expr: "tidyDisj (Disj (Atom \"a\") (Atom \"b\"))", expected: "Disj (Atom \"a\") (Atom \"b\")" },
      ],
      hint: "A helper `orP` with four identity/annihilator lines, then rebuild.",
      solution: hs`tidyDisj :: Prop -> Prop
tidyDisj (Disj a b) = orP (tidyDisj a) (tidyDisj b)
tidyDisj (Conj a b) = Conj (tidyDisj a) (tidyDisj b)
tidyDisj (Neg a) = Neg (tidyDisj a)
tidyDisj p = p

orP :: Prop -> Prop -> Prop
orP T _ = T
orP _ T = T
orP F p = p
orP p F = p
orP a b = Disj a b
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `mapN f e`, which applies `f` to every integer sitting in an `N`, and rebuilds the operators around them. Variables are unchanged.",
      starter: hs`mapN :: (Int -> Int) -> Expr -> Expr
mapN f e = undefined
`,
      tests: [
        { expr: "mapN (\\n -> n + 1) twoN", expected: "Plus (N 3) (N 4)" },
        { expr: "mapN (* 0) nestedZ", expected: "Plus (N 0) (Plus (N 0) (V \"x\"))" },
        { expr: "mapN negate (Minus (N 3) (V \"x\"))", expected: "Minus (N (-3)) (V \"x\")" },
        { expr: "mapN id (V \"q\")", expected: "V \"q\"" },
      ],
      hint: "`mapN f (N n) = N (f n)`. Recurse through `Plus`, `Times`, `Minus`.",
      solution: hs`mapN :: (Int -> Int) -> Expr -> Expr
mapN f (N n) = N (f n)
mapN _ (V v) = V v
mapN f (Plus a b) = Plus (mapN f a) (mapN f b)
mapN f (Times a b) = Times (mapN f a) (mapN f b)
mapN f (Minus a b) = Minus (mapN f a) (mapN f b)
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `doublePlus`. Walk first, then if a `Plus` has two equal children, replace it by `Times (N 2) child`. Do not flatten nested sums; only the two children of one `Plus`.",
      starter: hs`doublePlus :: Expr -> Expr
doublePlus e = undefined
`,
      tests: [
        { expr: "doublePlus xPlusX", expected: "Times (N 2) (V \"x\")" },
        { expr: "doublePlus (Plus (N 3) (N 3))", expected: "Times (N 2) (N 3)" },
        { expr: "doublePlus (Plus (V \"x\") (Plus (V \"x\") (V \"y\")))", expected: "Plus (V \"x\") (Plus (V \"x\") (V \"y\"))" },
        { expr: "doublePlus (Times xPlusX (N 1))", expected: "Times (Times (N 2) (V \"x\")) (N 1)" },
        { expr: "doublePlus (Plus (V \"x\") (V \"y\"))", expected: "Plus (V \"x\") (V \"y\")" },
      ],
      hint: "After walking, `if a' == b' then Times (N 2) a' else Plus a' b'`.",
      solution: hs`doublePlus :: Expr -> Expr
doublePlus (Plus a b) =
  let a' = doublePlus a
      b' = doublePlus b
  in if a' == b' then Times (N 2) a' else Plus a' b'
doublePlus (Times a b) = Times (doublePlus a) (doublePlus b)
doublePlus (Minus a b) = Minus (doublePlus a) (doublePlus b)
doublePlus e = e
`,
    },
  ],
};

const level3: DrillSet = {
  id: "b-rewrite-l3",
  lesson: "",
  level: 3,
  title: "Level 3: Stretch",
  intro: md(
    "A **normal form** is a shape you agree to stop at: for example 'a sum of numbers and `k * variable` terms, with like terms already combined'. You get there by flattening, gathering, and rebuilding — or by pushing every `Neg` in until it sits on an `Atom`.",
    "",
    "Still one pass, children first. Repeating a rewrite until the tree stops changing is a Level 4 idea; do not do it here unless a helper you recurse on is building a smaller tree.",
    "",
    "```",
    "likeTerms e = fromPoly (dropZero (gather (toPoly e)))",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: "Which of these is a fair description of a normal form for sums?",
      options: [
        "Any tree that has the right value",
        "A chosen shape (here: a flattened sum of combined like terms) that every equivalent expression is rewritten into",
        "The shortest possible string, ignoring constructors",
        "Whatever GHCi prints with `Show`",
      ],
      answer: 1,
      why: "Normal form is a promise about **shape**. Many trees mean `2x + y`; the normal form is one of them, built by a fixed recipe so tests can use `==`.",
    },
    {
      k: "quiz",
      q: "`Plus (V \"x\") (Plus (V \"y\") (V \"x\"))` has like terms. Why does `doublePlus` (which only looks at the two children of one `Plus`) leave it unchanged?",
      options: [
        "The two `x`s are not the two children of the same `Plus`",
        "`V \"x\"` does not have an `Eq` instance",
        "You must cancel with `Minus`",
        "Like terms can never be combined in a tree",
      ],
      answer: 0,
      why: "The outer children are `x` and `y + x`, which are not `==`. Flatten to a list first, then gather coefficients.",
    },
    {
      k: "quiz",
      q: "A one-step `peelZero` on `Plus (Plus (N 0) (V \"x\")) (N 1)` gives what?",
      options: [
        "`Plus (V \"x\") (N 1)`",
        "`V \"x\"`",
        "The same tree, unchanged",
        "`Plus (N 0) (V \"x\")`",
      ],
      answer: 2,
      why: "The top is `(0 + x) + 1`. Neither child of the outer `Plus` is `N 0` (the left child is itself a `Plus`). One-step does not look inside.",
    },
    {
      k: "quiz",
      q: "The list `[not (p && q) == (not p || not q) | p <- [False, True], q <- [False, True]]` is four `True`s. Why does a rewriter get to use that?",
      options: [
        "`Neg (Conj a b)` may become `Disj (Neg a) (Neg b)` without changing the meaning",
        "It proves `Conj` is the same constructor as `Disj`",
        "It lets you drop every `Neg`",
        "Haskell will apply it even if you do not write the equation",
      ],
      answer: 0,
      why: "The identity holds for every pair of booleans, so `Neg (Conj a b)` may become `Disj (Neg a) (Neg b)`.",
    },
    {
      k: "quiz",
      q: md(
        "A helper starts:",
        "",
        "```",
        "andP T p = p",
        "andP p T = p",
        "andP F _ = F",
        "```",
        "",
        "What is `andP T F`?",
      ),
      options: ["`T`", "`F`", "`Conj T F`", "It depends on the catch-all"],
      answer: 1,
      why: "The first line matches `T && p` with `p = F`, so the answer is `F`. Equation order is part of the spec.",
    },
    {
      k: "quiz",
      q: "Gathering `[(\"x\", 1), (\"y\", 2), (\"x\", 4)]` by first-seen name gives which list?",
      options: [
        "`[(\"x\", 5), (\"y\", 2)]`",
        "`[(\"x\", 1), (\"y\", 2), (\"x\", 4)]`",
        "`[(\"y\", 2), (\"x\", 5)]`",
        "`[(\"x\", 4)]`",
      ],
      answer: 0,
      why: "Keep the first `x`, add later `x` coefficients, then continue with what is left. `y` stays in its original place.",
    },
    {
      k: "write",
      setup: exprSetup,
      body: "This `tidyZeroLeft` only peels one `0 +` at the top. Change it so every `0 +` in the tree disappears, including those hiding under `Times` and `Minus`.",
      starter: hs`tidyZeroLeft :: Expr -> Expr
tidyZeroLeft (Plus (N 0) e) = e
tidyZeroLeft e = e
`,
      tests: [
        { expr: "tidyZeroLeft nestedZ", expected: "V \"x\"" },
        { expr: "tidyZeroLeft eDeep", expected: "Times (V \"x\") (Plus (V \"y\") (N 0))" },
        { expr: "tidyZeroLeft (Minus zPlusX (N 1))", expected: "Minus (V \"x\") (N 1)" },
        { expr: "tidyZeroLeft xPlusZ", expected: "xPlusZ" },
      ],
      hint: "Walk every constructor, then peel `Plus (N 0) e` on the rebuilt top.",
      solution: hs`tidyZeroLeft :: Expr -> Expr
tidyZeroLeft (Plus a b) = plus0 (tidyZeroLeft a) (tidyZeroLeft b)
tidyZeroLeft (Times a b) = Times (tidyZeroLeft a) (tidyZeroLeft b)
tidyZeroLeft (Minus a b) = Minus (tidyZeroLeft a) (tidyZeroLeft b)
tidyZeroLeft e = e

plus0 :: Expr -> Expr -> Expr
plus0 (N 0) e = e
plus0 a b = Plus a b
`,
    },
    {
      k: "write",
      setup: polySetup,
      body: "Write `dropZero`, which removes every pair whose coefficient is `0` and keeps the order of the rest.",
      starter: hs`dropZero :: Poly -> Poly
dropZero ts = undefined
`,
      tests: [
        { expr: "dropZero [(\"x\", 0), (\"y\", 2), (\"z\", 0)]", expected: "[(\"y\", 2)]" },
        { expr: "dropZero [(\"y\", 0), (\"x\", 1), (\"z\", 2)]", expected: "[(\"x\", 1), (\"z\", 2)]" },
        { expr: "dropZero []", expected: "[]" },
        { expr: "dropZero [(\"x\", 0)]", expected: "[]" },
      ],
      hint: "Skip a pair when `n == 0`.",
      solution: hs`dropZero :: Poly -> Poly
dropZero [] = []
dropZero ((v, n) : rest)
  | n == 0 = dropZero rest
  | otherwise = (v, n) : dropZero rest
`,
    },
    {
      k: "write",
      setup: polySetup,
      body: "Write `polyAdd`, the sum of two polynomials as lists. Concatenate, `gather` like names (first-seen order from the left list then leftover from the right), and **keep** zero coefficients.",
      starter: hs`polyAdd :: Poly -> Poly -> Poly
polyAdd xs ys = undefined
`,
      tests: [
        { expr: "polyAdd [(\"x\", 2)] [(\"x\", 3), (\"y\", 1)]", expected: "[(\"x\", 5), (\"y\", 1)]" },
        { expr: "polyAdd [(\"x\", 2)] [(\"x\", -2)]", expected: "[(\"x\", 0)]" },
        { expr: "polyAdd [] poly1", expected: "[(\"x\", 5), (\"y\", 1)]" },
        { expr: "polyAdd [(\"a\", 1)] []", expected: "[(\"a\", 1)]" },
      ],
      hint: "`polyAdd xs ys = gather (xs ++ ys)`, and write `gather` as in Level 2.",
      solution: hs`polyAdd :: Poly -> Poly -> Poly
polyAdd xs ys = gather (xs ++ ys)

gather :: Poly -> Poly
gather [] = []
gather ((v, n) : rest) = (v, n + extra) : gather leftover
  where
    extra = sum [m | (w, m) <- rest, w == v]
    leftover = [(w, m) | (w, m) <- rest, w /= v]
`,
    },
    {
      k: "write",
      setup: polySetup,
      body: "Write `polyScale k ts`, which multiplies every coefficient by `k`. Keep zeros (so `k = 0` produces a list of zeros of the same length).",
      starter: hs`polyScale :: Int -> Poly -> Poly
polyScale k ts = undefined
`,
      tests: [
        { expr: "polyScale 3 [(\"x\", 2), (\"y\", 1)]", expected: "[(\"x\", 6), (\"y\", 3)]" },
        { expr: "polyScale 0 [(\"x\", 2)]", expected: "[(\"x\", 0)]" },
        { expr: "polyScale (-1) [(\"x\", 4), (\"y\", -1)]", expected: "[(\"x\", -4), (\"y\", 1)]" },
        { expr: "polyScale 2 []", expected: "[]" },
      ],
      hint: "`map` on the coefficient, or `(v, k * n)`.",
      solution: hs`polyScale :: Int -> Poly -> Poly
polyScale k ts = [(v, k * n) | (v, n) <- ts]
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Write `toPoly`. You may assume the expression is a nested `Plus` of `N n`, `V v`, `Times (N k) (V v)` and `Times (V v) (N k)` only (no `Minus`, no product of two variables).",
        "",
        "Use `\"\"` as the name of a constant term. Do not gather yet: `x + 3 + x` becomes `[(\"x\",1), (\"\",3), (\"x\",1)]`.",
      ),
      starter: hs`toPoly :: Expr -> [(String, Int)]
toPoly e = undefined
`,
      tests: [
        { expr: "toPoly (Plus (V \"x\") (Plus (N 3) (V \"x\")))", expected: "[(\"x\", 1), (\"\", 3), (\"x\", 1)]" },
        { expr: "toPoly (Times (N 4) (V \"y\"))", expected: "[(\"y\", 4)]" },
        { expr: "toPoly (Times (V \"y\") (N 4))", expected: "[(\"y\", 4)]" },
        { expr: "toPoly (N 8)", expected: "[(\"\", 8)]" },
        { expr: "toPoly (V \"z\")", expected: "[(\"z\", 1)]" },
      ],
      hint: "`toPoly (Plus a b) = toPoly a ++ toPoly b`. Four leaf-like cases, including both orders of `Times`.",
      solution: hs`toPoly :: Expr -> [(String, Int)]
toPoly (Plus a b) = toPoly a ++ toPoly b
toPoly (N n) = [("", n)]
toPoly (V v) = [(v, 1)]
toPoly (Times (N n) (V v)) = [(v, n)]
toPoly (Times (V v) (N n)) = [(v, n)]
toPoly _ = []
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Write `fromPoly`. Rebuild a list of `(name, coefficient)` as a right-associated `Plus` chain.",
        "",
        "- `(\"\", n)` is `N n`",
        "- `(v, 1)` is `V v`",
        "- `(v, k)` otherwise is `Times (N k) (V v)` (even when `k` is 0 or negative)",
        "- the empty list is `N 0`",
        "- a singleton list is just that term, with no `Plus`",
      ),
      starter: hs`fromPoly :: [(String, Int)] -> Expr
fromPoly ts = undefined
`,
      tests: [
        { expr: "fromPoly [(\"x\", 2), (\"y\", 1)]", expected: "Plus (Times (N 2) (V \"x\")) (V \"y\")" },
        { expr: "fromPoly [(\"\", 5)]", expected: "N 5" },
        { expr: "fromPoly []", expected: "N 0" },
        { expr: "fromPoly [(\"x\", 1)]", expected: "V \"x\"" },
        { expr: "fromPoly [(\"\", 3), (\"x\", 1), (\"y\", 4)]", expected: "Plus (N 3) (Plus (V \"x\") (Times (N 4) (V \"y\")))" },
      ],
      hint: "`fromPoly (t : ts) = if null ts then term t else Plus (term t) (fromPoly ts)`.",
      solution: hs`fromPoly :: [(String, Int)] -> Expr
fromPoly [] = N 0
fromPoly [t] = term t
fromPoly (t : ts) = Plus (term t) (fromPoly ts)

term :: (String, Int) -> Expr
term ("", n) = N n
term (v, 1) = V v
term (v, k) = Times (N k) (V v)
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Write `likeTerms`. Assume the same sum-shape as `toPoly`. Flatten, gather coefficients (first-seen names), drop zeros, rebuild with `fromPoly`'s rules (empty becomes `N 0`; coeff `1` is a plain `V`).",
      ),
      starter: hs`likeTerms :: Expr -> Expr
likeTerms e = undefined
`,
      tests: [
        { expr: "likeTerms (Plus (V \"x\") (Plus (V \"y\") (V \"x\")))", expected: "Plus (Times (N 2) (V \"x\")) (V \"y\")" },
        { expr: "likeTerms (Plus (N 3) (Plus (V \"x\") (N 2)))", expected: "Plus (N 5) (V \"x\")" },
        { expr: "likeTerms (Plus (V \"x\") (Times (N (-1)) (V \"x\")))", expected: "N 0" },
        { expr: "likeTerms (Times (N 4) (V \"y\"))", expected: "Times (N 4) (V \"y\")" },
        { expr: "likeTerms (Plus (V \"a\") (V \"b\"))", expected: "Plus (V \"a\") (V \"b\")" },
      ],
      hint: "Reuse `toPoly`, `gather`, `dropZero`, `fromPoly` as helpers.",
      solution: hs`likeTerms :: Expr -> Expr
likeTerms e = fromPoly (dropZero (gather (toPoly e)))

toPoly :: Expr -> [(String, Int)]
toPoly (Plus a b) = toPoly a ++ toPoly b
toPoly (N n) = [("", n)]
toPoly (V v) = [(v, 1)]
toPoly (Times (N n) (V v)) = [(v, n)]
toPoly (Times (V v) (N n)) = [(v, n)]
toPoly _ = []

gather :: [(String, Int)] -> [(String, Int)]
gather [] = []
gather ((v, n) : rest) = (v, n + extra) : gather leftover
  where
    extra = sum [m | (w, m) <- rest, w == v]
    leftover = [(w, m) | (w, m) <- rest, w /= v]

dropZero :: [(String, Int)] -> [(String, Int)]
dropZero [] = []
dropZero ((v, n) : rest)
  | n == 0 = dropZero rest
  | otherwise = (v, n) : dropZero rest

fromPoly :: [(String, Int)] -> Expr
fromPoly [] = N 0
fromPoly [t] = term t
fromPoly (t : ts) = Plus (term t) (fromPoly ts)

term :: (String, Int) -> Expr
term ("", n) = N n
term (v, 1) = V v
term (v, k) = Times (N k) (V v)
`,
    },
    {
      k: "write",
      setup: propSetup,
      body: md(
        "Write `pushNeg`, which pushes every `Neg` inwards until it sits on an `Atom` (or disappears on `T`/`F`). Use:",
        "",
        "```",
        "Neg T           = F",
        "Neg F           = T",
        "Neg (Neg p)     = pushNeg p",
        "Neg (Conj a b)  = Disj (pushNeg (Neg a)) (pushNeg (Neg b))",
        "Neg (Disj a b)  = Conj (pushNeg (Neg a)) (pushNeg (Neg b))",
        "```",
        "",
        "Walk `Conj` and `Disj` as well. A `Neg` of an `Atom` stays.",
      ),
      starter: hs`pushNeg :: Prop -> Prop
pushNeg p = undefined
`,
      tests: [
        { expr: "pushNeg notAnd", expected: "Disj (Neg (Atom \"a\")) (Neg (Atom \"b\"))" },
        { expr: "pushNeg (Neg (Disj (Atom \"a\") (Neg (Atom \"b\"))))", expected: "Conj (Neg (Atom \"a\")) (Atom \"b\")" },
        { expr: "pushNeg (Neg T)", expected: "F" },
        { expr: "pushNeg (Neg (Neg (Neg (Atom \"p\"))))", expected: "Neg (Atom \"p\")" },
        { expr: "pushNeg (Conj nnB (Atom \"q\"))", expected: "Conj (Atom \"b\") (Atom \"q\")" },
      ],
      hint: "The `Neg (...)` equations must come before a catch-all. Recurse on `Conj`/`Disj` even when there is no `Neg` at the top.",
      solution: hs`pushNeg :: Prop -> Prop
pushNeg (Neg T) = F
pushNeg (Neg F) = T
pushNeg (Neg (Neg p)) = pushNeg p
pushNeg (Neg (Conj a b)) = Disj (pushNeg (Neg a)) (pushNeg (Neg b))
pushNeg (Neg (Disj a b)) = Conj (pushNeg (Neg a)) (pushNeg (Neg b))
pushNeg (Conj a b) = Conj (pushNeg a) (pushNeg b)
pushNeg (Disj a b) = Disj (pushNeg a) (pushNeg b)
pushNeg p = p
`,
    },
    {
      k: "write",
      setup: propSetup,
      body: "Write `isPushed`. It is `True` when every `Neg` sits directly on an `Atom` (and nowhere else). `T` and `F` are allowed. `Neg T` is **not** pushed.",
      starter: hs`isPushed :: Prop -> Bool
isPushed p = undefined
`,
      tests: [
        { expr: "isPushed (Neg (Atom \"a\"))", expected: "True" },
        { expr: "isPushed (Neg T)", expected: "False" },
        { expr: "isPushed (Conj (Neg (Atom \"a\")) (Disj (Atom \"b\") (Neg (Atom \"c\"))))", expected: "True" },
        { expr: "isPushed notAnd", expected: "False" },
        { expr: "isPushed T", expected: "True" },
      ],
      hint: "`Neg (Atom _)` is fine; any other `Neg` is not. Combine `Conj`/`Disj` with `&&`.",
      solution: hs`isPushed :: Prop -> Bool
isPushed T = True
isPushed F = True
isPushed (Atom _) = True
isPushed (Neg (Atom _)) = True
isPushed (Neg _) = False
isPushed (Conj a b) = isPushed a && isPushed b
isPushed (Disj a b) = isPushed a && isPushed b
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `noMinus`. Replace every `Minus a b` by `Plus a (Times (N (-1)) b)`, everywhere, after rewriting the children. Do not simplify further.",
      starter: hs`noMinus :: Expr -> Expr
noMinus e = undefined
`,
      tests: [
        { expr: "noMinus (Minus (V \"x\") (V \"y\"))", expected: "Plus (V \"x\") (Times (N (-1)) (V \"y\"))" },
        { expr: "noMinus yMinusY", expected: "Plus (V \"y\") (Times (N (-1)) (V \"y\"))" },
        { expr: "noMinus (Minus (Minus (N 3) (N 1)) (V \"x\"))", expected: "Plus (Plus (N 3) (Times (N (-1)) (N 1))) (Times (N (-1)) (V \"x\"))" },
        { expr: "noMinus twoN", expected: "twoN" },
      ],
      hint: "`noMinus (Minus a b) = Plus (noMinus a) (Times (N (-1)) (noMinus b))`.",
      solution: hs`noMinus :: Expr -> Expr
noMinus (Minus a b) = Plus (noMinus a) (Times (N (-1)) (noMinus b))
noMinus (Plus a b) = Plus (noMinus a) (noMinus b)
noMinus (Times a b) = Times (noMinus a) (noMinus b)
noMinus e = e
`,
    },
    {
      k: "write",
      setup: mixSetup,
      body: md(
        "Write `amounts`, which turns a `Mix` into a list of `(ingredient, count)` pairs. Use the names `\"water\"`, `\"flour\"` and `\"sugar\"`.",
        "",
        "`Blend` concatenates (then gather, first-seen, **keep zeros**). `Scale n` multiplies every count by `n`.",
      ),
      starter: hs`amounts :: Mix -> [(String, Int)]
amounts m = undefined
`,
      tests: [
        { expr: "amounts dough", expected: "[(\"flour\", 2), (\"water\", 1), (\"sugar\", 1)]" },
        { expr: "amounts (Blend Water Water)", expected: "[(\"water\", 2)]" },
        { expr: "amounts (Scale 0 Flour)", expected: "[(\"flour\", 0)]" },
        { expr: "amounts (Blend Flour Flour)", expected: "[(\"flour\", 2)]" },
        { expr: "amounts batter", expected: "[(\"flour\", 3), (\"water\", 3)]" },
      ],
      hint: "Write a small `gather` on association lists. `batter` is `Scale 1 (Scale 3 ...)`: multiply 1 * 3.",
      solution: hs`amounts :: Mix -> [(String, Int)]
amounts Water = [("water", 1)]
amounts Flour = [("flour", 1)]
amounts Sugar = [("sugar", 1)]
amounts (Blend a b) = gather (amounts a ++ amounts b)
amounts (Scale n m) = [(i, n * k) | (i, k) <- amounts m]

gather :: [(String, Int)] -> [(String, Int)]
gather [] = []
gather ((v, n) : rest) = (v, n + extra) : gather leftover
  where
    extra = sum [c | (w, c) <- rest, w == v]
    leftover = [(w, c) | (w, c) <- rest, w /= v]
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Write `spread`. Walk children first. Then, at a `Times`, apply **one** of these (in this order) to the rewritten children, and **do not** spread the `Plus` you just built:",
        "",
        "```",
        "a * (b + c)  becomes  (a * b) + (a * c)",
        "(a + b) * c  becomes  (a * c) + (b * c)",
        "```",
      ),
      starter: hs`spread :: Expr -> Expr
spread e = undefined
`,
      tests: [
        { expr: "spread (Times (V \"x\") (Plus (V \"y\") (V \"z\")))", expected: "Plus (Times (V \"x\") (V \"y\")) (Times (V \"x\") (V \"z\"))" },
        { expr: "spread (Times (Plus (V \"x\") (V \"y\")) (N 2))", expected: "Plus (Times (V \"x\") (N 2)) (Times (V \"y\") (N 2))" },
        { expr: "spread (Times (V \"x\") (Plus (Plus (V \"y\") (V \"z\")) (V \"w\")))", expected: "Plus (Times (V \"x\") (Plus (V \"y\") (V \"z\"))) (Times (V \"x\") (V \"w\"))" },
        { expr: "spread (Plus (Times (V \"x\") (Plus (N 1) (N 2))) (N 0))", expected: "Plus (Plus (Times (V \"x\") (N 1)) (Times (V \"x\") (N 2))) (N 0)" },
        { expr: "spread (Times (V \"x\") (V \"y\"))", expected: "Times (V \"x\") (V \"y\")" },
      ],
      hint: "`case (spread a, spread b) of { (a', Plus b1 b2) -> Plus (Times a' b1) (Times a' b2); ... }`.",
      solution: hs`spread :: Expr -> Expr
spread (Plus a b) = Plus (spread a) (spread b)
spread (Minus a b) = Minus (spread a) (spread b)
spread (Times a b) = case (spread a, spread b) of
  (a', Plus b1 b2) -> Plus (Times a' b1) (Times a' b2)
  (Plus a1 a2, b') -> Plus (Times a1 b') (Times a2 b')
  (a', b') -> Times a' b'
spread e = e
`,
    },
    {
      k: "write",
      setup: polySetup,
      body: "Write `sortPoly`. Sort by variable **name** (Haskell's `sortOn fst` is fine). The constant `\"\"` will come first because it is the empty string. Do not gather or drop zeros.",
      starter: hs`import Data.List (sortOn)

sortPoly :: Poly -> Poly
sortPoly ts = undefined
`,
      tests: [
        { expr: "sortPoly [(\"y\", 1), (\"x\", 2), (\"\", 3)]", expected: "[(\"\", 3), (\"x\", 2), (\"y\", 1)]" },
        { expr: "sortPoly poly1", expected: "[(\"x\", 2), (\"x\", 3), (\"y\", 1)]" },
        { expr: "sortPoly []", expected: "[]" },
        { expr: "sortPoly [(\"z\", 0), (\"a\", 1)]", expected: "[(\"a\", 1), (\"z\", 0)]" },
      ],
      hint: "`sortOn fst`.",
      solution: hs`import Data.List (sortOn)

sortPoly :: Poly -> Poly
sortPoly ts = sortOn fst ts
`,
    },
    {
      k: "write",
      setup: propSetup,
      body: "Write `atomsOf`, the `Atom` names in a proposition from left to right, including repeats. Then write `uniqAtoms`, the same names with duplicates removed, **first occurrence kept** (do not sort).",
      starter: hs`atomsOf :: Prop -> [String]
atomsOf p = undefined

uniqAtoms :: Prop -> [String]
uniqAtoms p = undefined
`,
      tests: [
        { expr: "atomsOf (Conj (Atom \"b\") (Disj (Atom \"a\") (Atom \"b\")))", expected: "[\"b\", \"a\", \"b\"]" },
        { expr: "uniqAtoms (Conj (Atom \"b\") (Disj (Atom \"a\") (Atom \"b\")))", expected: "[\"b\", \"a\"]" },
        { expr: "atomsOf (Neg (Atom \"z\"))", expected: "[\"z\"]" },
        { expr: "uniqAtoms T", expected: "[]" },
        { expr: "uniqAtoms (Disj (Atom \"p\") (Atom \"p\"))", expected: "[\"p\"]" },
      ],
      hint: "`nub` from `Data.List` removes duplicates and keeps the first of each. Import it, or write a small helper.",
      solution: hs`import Data.List (nub)

atomsOf :: Prop -> [String]
atomsOf (Atom v) = [v]
atomsOf (Neg p) = atomsOf p
atomsOf (Conj a b) = atomsOf a ++ atomsOf b
atomsOf (Disj a b) = atomsOf a ++ atomsOf b
atomsOf _ = []

uniqAtoms :: Prop -> [String]
uniqAtoms p = nub (atomsOf p)
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Write `foldNums`. Walk, then fold any operator whose two children are both `N`:",
        "",
        "```",
        "Plus  (N a) (N b)  = N (a + b)",
        "Times (N a) (N b)  = N (a * b)",
        "Minus (N a) (N b)  = N (a - b)",
        "```",
        "",
        "No identity rules (`+ 0`, `* 1`, `x - x`) in this question.",
      ),
      starter: hs`foldNums :: Expr -> Expr
foldNums e = undefined
`,
      tests: [
        { expr: "foldNums (Times (Plus (N 2) (N 3)) (N 4))", expected: "N 20" },
        { expr: "foldNums (Minus (N 9) (N 1))", expected: "N 8" },
        { expr: "foldNums (Plus (V \"x\") (N 0))", expected: "Plus (V \"x\") (N 0)" },
        { expr: "foldNums (Minus (V \"x\") (V \"x\"))", expected: "Minus (V \"x\") (V \"x\")" },
        { expr: "foldNums (Times (N 2) (Plus (N 1) (V \"x\")))", expected: "Times (N 2) (Plus (N 1) (V \"x\"))" },
      ],
      hint: "A helper for each operator, or one `case` after walking.",
      solution: hs`foldNums :: Expr -> Expr
foldNums (Plus a b) = add (foldNums a) (foldNums b)
foldNums (Times a b) = mul (foldNums a) (foldNums b)
foldNums (Minus a b) = sub (foldNums a) (foldNums b)
foldNums e = e

add :: Expr -> Expr -> Expr
add (N a) (N b) = N (a + b)
add a b = Plus a b

mul :: Expr -> Expr -> Expr
mul (N a) (N b) = N (a * b)
mul a b = Times a b

sub :: Expr -> Expr -> Expr
sub (N a) (N b) = N (a - b)
sub a b = Minus a b
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Write `tidyArith`. Children first, then **exactly** these rules, in this order at each helper:",
        "",
        "Plus: `0 + e`, `e + 0`, then two `N`s folded.",
        "Times: `0 * e`, `e * 0`, `1 * e`, `e * 1`, then two `N`s folded.",
        "Minus: `e - e` (using `==`), then two `N`s folded.",
      ),
      starter: hs`tidyArith :: Expr -> Expr
tidyArith e = undefined
`,
      tests: [
        { expr: "tidyArith (Plus (Times (N 1) (V \"x\")) (Times (N 0) (V \"y\")))", expected: "V \"x\"" },
        { expr: "tidyArith (Minus (Plus (N 2) (N 3)) (N 5))", expected: "N 0" },
        { expr: "tidyArith eDeep", expected: "Times (V \"x\") (V \"y\")" },
        { expr: "tidyArith (Times (N 2) (N 3))", expected: "N 6" },
        { expr: "tidyArith (Plus (V \"x\") (V \"x\"))", expected: "Plus (V \"x\") (V \"x\")" },
      ],
      hint: "Put the identity/annihilator patterns before the two-`N` fold, so `0 * 5` is `N 0` rather than relying on the fold (both are `N 0`, but `0 * x` needs the annihilator).",
      solution: hs`tidyArith :: Expr -> Expr
tidyArith (Plus a b) = plusA (tidyArith a) (tidyArith b)
tidyArith (Times a b) = timesA (tidyArith a) (tidyArith b)
tidyArith (Minus a b) = minusA (tidyArith a) (tidyArith b)
tidyArith e = e

plusA :: Expr -> Expr -> Expr
plusA (N 0) e = e
plusA e (N 0) = e
plusA (N a) (N b) = N (a + b)
plusA a b = Plus a b

timesA :: Expr -> Expr -> Expr
timesA (N 0) _ = N 0
timesA _ (N 0) = N 0
timesA (N 1) e = e
timesA e (N 1) = e
timesA (N a) (N b) = N (a * b)
timesA a b = Times a b

minusA :: Expr -> Expr -> Expr
minusA a b | a == b = N 0
minusA (N a) (N b) = N (a - b)
minusA a b = Minus a b
`,
    },
    {
      k: "write",
      setup: peelSetup,
      body: md(
        "`peelZeroTop` is given (one-step, `0` on either side, top only). Write **two** functions:",
        "",
        "- `onceDeep`: rebuild every operator with `onceDeep` on the children, then run `peelZeroTop` on that new top.",
        "- `onlyTop`: just `peelZeroTop`, no walk.",
        "",
        "The tests show they disagree on some trees.",
      ),
      starter: hs`onceDeep :: Expr -> Expr
onceDeep e = undefined

onlyTop :: Expr -> Expr
onlyTop e = undefined
`,
      tests: [
        { expr: "onlyTop nestedZ", expected: "Plus (N 0) (V \"x\")" },
        { expr: "onceDeep nestedZ", expected: "V \"x\"" },
        { expr: "onlyTop eDeep", expected: "eDeep" },
        { expr: "onceDeep eDeep", expected: "Times (V \"x\") (V \"y\")" },
        { expr: "onlyTop (Plus (N 0) (N 4))", expected: "N 4" },
        { expr: "onceDeep (Plus (N 0) (N 4))", expected: "N 4" },
      ],
      hint: "`onlyTop = peelZeroTop`. For `onceDeep (Plus a b) = peelZeroTop (Plus (onceDeep a) (onceDeep b))`.",
      solution: hs`onceDeep :: Expr -> Expr
onceDeep (Plus a b) = peelZeroTop (Plus (onceDeep a) (onceDeep b))
onceDeep (Times a b) = peelZeroTop (Times (onceDeep a) (onceDeep b))
onceDeep (Minus a b) = peelZeroTop (Minus (onceDeep a) (onceDeep b))
onceDeep e = peelZeroTop e

onlyTop :: Expr -> Expr
onlyTop e = peelZeroTop e
`,
    },
    {
      k: "write",
      setup: signedSetup,
      body: "Write `netted`. For each name, count credits minus debits. Positive net becomes `Credit`, negative becomes `Debit` with a positive name count of 1 per unit (so net 2 is two `Credit`s). Keep **first-seen** name order. Skip names whose net is 0.",
      starter: hs`netted :: [Signed] -> [Signed]
netted xs = undefined
`,
      tests: [
        { expr: "netted [Credit \"x\", Debit \"y\", Debit \"x\", Credit \"y\"]", expected: "[]" },
        { expr: "netted [Credit \"x\", Credit \"x\", Debit \"x\"]", expected: "[Credit \"x\"]" },
        { expr: "netted [Debit \"a\", Debit \"a\", Credit \"b\"]", expected: "[Debit \"a\", Debit \"a\", Credit \"b\"]" },
        { expr: "netted [Credit \"p\", Debit \"q\", Credit \"p\"]", expected: "[Credit \"p\", Credit \"p\", Debit \"q\"]" },
        { expr: "netted []", expected: "[]" },
      ],
      hint: "Collect unique names in order, compute each net, then `replicate (abs n)` of the right constructor.",
      solution: hs`netted :: [Signed] -> [Signed]
netted xs = concatMap emit names
  where
    names = nubNames xs
    emit v =
      let n = net v xs
      in if n > 0 then replicate n (Credit v)
         else replicate (-n) (Debit v)

nubNames :: [Signed] -> [String]
nubNames [] = []
nubNames (Credit v : rest) = v : filter (/= v) (nubNames rest)
nubNames (Debit v : rest) = v : filter (/= v) (nubNames rest)

net :: String -> [Signed] -> Int
net _ [] = 0
net v (Credit w : rest) = (if w == v then 1 else 0) + net v rest
net v (Debit w : rest) = (if w == v then -1 else 0) + net v rest
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `showExpr`. Numbers use `show`, variables are themselves, and every operator is fully bracketed: `(a+b)`, `(a*b)`, `(a-b)` with no spaces.",
      starter: hs`showExpr :: Expr -> String
showExpr e = undefined
`,
      tests: [
        { expr: "showExpr (Plus (V \"x\") (N 1))", expected: "\"(x+1)\"" },
        { expr: "showExpr eDeep", expected: "\"((0+x)*(y+0))\"" },
        { expr: "showExpr (N (-3))", expected: "\"-3\"" },
        { expr: "showExpr (Minus (V \"x\") (V \"x\"))", expected: "\"(x-x)\"" },
        { expr: "showExpr (V \"abc\")", expected: "\"abc\"" },
      ],
      hint: "`showExpr (Plus a b) = \"(\" ++ showExpr a ++ \"+\" ++ showExpr b ++ \")\"`.",
      solution: hs`showExpr :: Expr -> String
showExpr (N n) = show n
showExpr (V v) = v
showExpr (Plus a b) = "(" ++ showExpr a ++ "+" ++ showExpr b ++ ")"
showExpr (Times a b) = "(" ++ showExpr a ++ "*" ++ showExpr b ++ ")"
showExpr (Minus a b) = "(" ++ showExpr a ++ "-" ++ showExpr b ++ ")"
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `constTerm e`, the sum of every `N` that appears as a summand in a nested `Plus` (not inside `Times` or `Minus`). If there is no such number, give 0.",
      starter: hs`constTerm :: Expr -> Int
constTerm e = undefined
`,
      tests: [
        { expr: "constTerm (Plus (N 3) (Plus (V \"x\") (N 2)))", expected: "5" },
        { expr: "constTerm (Times (N 4) (V \"x\"))", expected: "0" },
        { expr: "constTerm (N 7)", expected: "7" },
        { expr: "constTerm (Plus (Minus (N 1) (N 1)) (N 2))", expected: "2" },
        { expr: "constTerm xySum", expected: "0" },
      ],
      hint: "Only recurse through `Plus`. `N n` gives `n`. Everything else gives 0.",
      solution: hs`constTerm :: Expr -> Int
constTerm (Plus a b) = constTerm a + constTerm b
constTerm (N n) = n
constTerm _ = 0
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "This `gather` on a flattened sum forgot to skip the names it had already combined, so `x` is counted twice. Fix it so each name appears once, first-seen order, zeros kept.",
      starter: hs`gatherSum :: Expr -> [(String, Int)]
gatherSum e = combine (bits e)
  where
    bits (Plus a b) = bits a ++ bits b
    bits (N n) = [("", n)]
    bits (V v) = [(v, 1)]
    bits (Times (N n) (V v)) = [(v, n)]
    bits (Times (V v) (N n)) = [(v, n)]
    bits _ = []

    combine [] = []
    combine ((v, n) : rest) = (v, n + extra) : combine rest
      where
        extra = sum [m | (w, m) <- rest, w == v]
`,
      tests: [
        { expr: "gatherSum (Plus (V \"x\") (Plus (V \"x\") (N 1)))", expected: "[(\"x\", 2), (\"\", 1)]" },
        { expr: "gatherSum (Plus (V \"x\") (V \"x\"))", expected: "[(\"x\", 2)]" },
        { expr: "gatherSum (N 4)", expected: "[(\"\", 4)]" },
        { expr: "gatherSum (Plus (Times (N 3) (V \"y\")) (V \"y\"))", expected: "[(\"y\", 4)]" },
      ],
      hint: "After taking `extra` from `rest`, recurse on the pairs whose name is **not** `v`.",
      solution: hs`gatherSum :: Expr -> [(String, Int)]
gatherSum e = combine (bits e)
  where
    bits (Plus a b) = bits a ++ bits b
    bits (N n) = [("", n)]
    bits (V v) = [(v, 1)]
    bits (Times (N n) (V v)) = [(v, n)]
    bits (Times (V v) (N n)) = [(v, n)]
    bits _ = []

    combine [] = []
    combine ((v, n) : rest) = (v, n + extra) : combine leftover
      where
        extra = sum [m | (w, m) <- rest, w == v]
        leftover = [(w, m) | (w, m) <- rest, w /= v]
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `plugAndTidy x e body`. First replace every `V x` in `body` by `e` (do not rewrite `e` itself at this stage). Then run the Level-2 identity tidy: `0+e`, `e+0`, `1*e`, `e*1`, `e-e`, children first. Do not fold `2+3`.",
      starter: hs`plugAndTidy :: String -> Expr -> Expr -> Expr
plugAndTidy x e body = undefined
`,
      tests: [
        { expr: "plugAndTidy \"x\" (N 0) (Plus (V \"x\") (V \"y\"))", expected: "V \"y\"" },
        { expr: "plugAndTidy \"x\" (N 1) (Times (V \"x\") (V \"y\"))", expected: "V \"y\"" },
        { expr: "plugAndTidy \"x\" (V \"y\") (Minus (V \"x\") (V \"y\"))", expected: "N 0" },
        { expr: "plugAndTidy \"x\" (Plus (N 2) (N 3)) (V \"x\")", expected: "Plus (N 2) (N 3)" },
        { expr: "plugAndTidy \"z\" (N 0) xySum", expected: "xySum" },
      ],
      hint: "Two helpers: `plugIn`, then `tidyIds`.",
      solution: hs`plugAndTidy :: String -> Expr -> Expr -> Expr
plugAndTidy x e body = tidyIds (plugIn x e body)

plugIn :: String -> Expr -> Expr -> Expr
plugIn _ _ (N n) = N n
plugIn x e (V w) = if w == x then e else V w
plugIn x e (Plus a b) = Plus (plugIn x e a) (plugIn x e b)
plugIn x e (Times a b) = Times (plugIn x e a) (plugIn x e b)
plugIn x e (Minus a b) = Minus (plugIn x e a) (plugIn x e b)

tidyIds :: Expr -> Expr
tidyIds (Plus a b) = plusI (tidyIds a) (tidyIds b)
tidyIds (Times a b) = timesI (tidyIds a) (tidyIds b)
tidyIds (Minus a b) = minusI (tidyIds a) (tidyIds b)
tidyIds e = e

plusI :: Expr -> Expr -> Expr
plusI (N 0) e = e
plusI e (N 0) = e
plusI a b = Plus a b

timesI :: Expr -> Expr -> Expr
timesI (N 1) e = e
timesI e (N 1) = e
timesI a b = Times a b

minusI :: Expr -> Expr -> Expr
minusI a b | a == b = N 0
minusI a b = Minus a b
`,
    },
    {
      k: "write",
      setup: propSetup,
      body: md(
        "Write `tidyBool`. Walk, then apply the constant rules for `Conj`, `Disj` and `Neg` (the same ones as `tidyConj`, `tidyDisj` and `tidyNeg` together). Order in each helper: annihilators/identities first, then `Neg (Neg p) = p`.",
        "",
        "Do not push `Neg` through `Conj`/`Disj`, and do not add `p && p = p`.",
      ),
      starter: hs`tidyBool :: Prop -> Prop
tidyBool p = undefined
`,
      tests: [
        { expr: "tidyBool (Conj T (Disj F (Atom \"a\")))", expected: "Atom \"a\"" },
        { expr: "tidyBool (Neg (Neg (Neg T)))", expected: "F" },
        { expr: "tidyBool (Disj T aAndNa)", expected: "T" },
        { expr: "tidyBool (Conj (Atom \"a\") (Atom \"a\"))", expected: "Conj (Atom \"a\") (Atom \"a\")" },
        { expr: "tidyBool (Neg (Conj T F))", expected: "T" },
      ],
      hint: "Walk, then `andP` / `orP` / `neg`. `Neg (Conj T F)` becomes `neg F` which is `T`.",
      solution: hs`tidyBool :: Prop -> Prop
tidyBool (Conj a b) = andP (tidyBool a) (tidyBool b)
tidyBool (Disj a b) = orP (tidyBool a) (tidyBool b)
tidyBool (Neg a) = neg (tidyBool a)
tidyBool p = p

andP :: Prop -> Prop -> Prop
andP T p = p
andP p T = p
andP F _ = F
andP _ F = F
andP a b = Conj a b

orP :: Prop -> Prop -> Prop
orP T _ = T
orP _ T = T
orP F p = p
orP p F = p
orP a b = Disj a b

neg :: Prop -> Prop
neg T = F
neg F = T
neg (Neg p) = p
neg p = Neg p
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `varsUsed`, the variable names in an expression from left to right with duplicates removed (first occurrence kept). Do not sort.",
      starter: hs`varsUsed :: Expr -> [String]
varsUsed e = undefined
`,
      tests: [
        { expr: "varsUsed (Plus (V \"y\") (Plus (V \"x\") (V \"y\")))", expected: "[\"y\", \"x\"]" },
        { expr: "varsUsed twoN", expected: "[]" },
        { expr: "varsUsed eDeep", expected: "[\"x\", \"y\"]" },
        { expr: "varsUsed (Minus (V \"a\") (V \"a\"))", expected: "[\"a\"]" },
      ],
      hint: "Collect with `++`, then `nub`. Import `Data.List (nub)`.",
      solution: hs`import Data.List (nub)

varsUsed :: Expr -> [String]
varsUsed e = nub (go e)
  where
    go (V v) = [v]
    go (N _) = []
    go (Plus a b) = go a ++ go b
    go (Times a b) = go a ++ go b
    go (Minus a b) = go a ++ go b
`,
    },
  ],
};

const level4: DrillSet = {
  id: "b-rewrite-l4",
  lesson: "",
  level: 4,
  title: "Level 4: Exam strength",
  intro: md(
    "Questions worded the way the January test words them. Read the given type, tick the examples against your mental picture, then write. The last eight are long: several rules, a chosen normal form, or a **fixpoint** — apply a rewrite again and again until the tree is `==` to what you just had.",
    "",
    "```",
    "untilQuiet f e = let e' = f e in if e' == e then e else untilQuiet f e'",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: "A fixpoint of a rewrite `f` is a value `e` with `f e == e`. How do you compute one from an arbitrary starting tree?",
      options: [
        "Apply `f` once",
        "Apply `f` again and again until the result stops changing",
        "Apply `f` exactly twice",
        "Sort the constructors",
      ],
      answer: 1,
      why: "Each application should make progress (or do nothing). When nothing changes, you have a fixpoint. If `f` can grow the tree forever, this loop never ends — exam rules are chosen so it does end.",
    },
    {
      k: "quiz",
      q: "`peelZeroLeft` is one-step at the top: `0 + e` becomes `e`. What is the fixpoint of `peelZeroLeft` starting from `Plus (Plus (N 0) (V \"x\")) (N 1)`?",
      options: [
        "`V \"x\"`",
        "`Plus (V \"x\") (N 1)`",
        "`Plus (Plus (N 0) (V \"x\")) (N 1)`, unchanged",
        "`N 1`",
      ],
      answer: 2,
      why: "The top is not `0 + something`, so one-step does nothing and the fixpoint is the original tree. A bottom-up walk is what would rewrite the inner `0 + x`.",
    },
    {
      k: "quiz",
      q: "You have a one-pass bottom-up `spread` that rewrites `a * (b + c)` to `(a * b) + (a * c)` at each `Times`, but does not spread the `Plus` it just built. Why might you still take a fixpoint of `spread`?",
      options: [
        "You never need to; one pass always finishes the job",
        "`a * ((b + c) + d)` becomes `(a * (b + c)) + (a * d)`, and that inner product still needs spreading",
        "Fixpoint makes `==` ignore order",
        "Haskell requires it for `Times`",
      ],
      answer: 1,
      why: "One distribution can leave a new `Times` of a `Plus`. Repeating until the tree is stable finishes the expansion.",
    },
    {
      k: "quiz",
      q: "A function drops a leading `0` and is repeated until the list stops changing. Starting from `[0, 0, 4, 5]`, what is the fixpoint?",
      options: ["`[4, 5]`", "`[0, 4, 5]`", "`[]`", "`[0, 0, 4, 5]`"],
      answer: 0,
      why: "Each step drops a leading 0. After two steps the list starts with 4, so the next step leaves it alone. That is a fixpoint.",
    },
    {
      k: "write",
      setup: "",
      body: md(
        "Define a function `untilQuiet :: Eq a => (a -> a) -> a -> a` that applies its function over and over until the value stops changing (`==`). For example:",
        "",
        "```",
        "*Main> untilQuiet tailWhenLong [1, 2, 3, 4]",
        "[1, 2, 3, 4]   -- if tailWhenLong only drops when length > 4",
        "*Main> untilQuiet dropZero [0, 0, 2]",
        "[2]",
        "```",
        "",
        "Here `dropZero (0 : xs) = dropZero xs` and `dropZero xs = xs` otherwise. You only write `untilQuiet`.",
      ),
      starter: hs`untilQuiet :: Eq a => (a -> a) -> a -> a
untilQuiet f x = undefined
`,
      tests: [
        { expr: "untilQuiet (\\xs -> if xs /= [] && head (xs :: [Int]) == 0 then tail xs else xs) [0, 0, 2, 0]", expected: "[2, 0]" },
        { expr: "untilQuiet (* (1 :: Int)) 7", expected: "7" },
        { expr: "untilQuiet (\\n -> if n > 10 then n - 3 else n) (16 :: Int)", expected: "10" },
        { expr: "untilQuiet id \"ok\"", expected: "\"ok\"" },
      ],
      hint: "`let y = f x in if y == x then x else untilQuiet f y`.",
      solution: hs`untilQuiet :: Eq a => (a -> a) -> a -> a
untilQuiet f x = let y = f x in if y == x then x else untilQuiet f y
`,
    },
    {
      k: "write",
      setup: peelSetup,
      body: md(
        "`peelZeroLeft` is given: it rewrites only a top-level `0 + e`.",
        "",
        "Define `quietLeft :: Expr -> Expr` that applies `peelZeroLeft` until the expression stops changing. For example:",
        "",
        "```",
        "*Main> quietLeft nestedZ",
        "V \"x\"",
        "*Main> quietLeft (Plus (Plus (N 0) (V \"x\")) (N 1))",
        "Plus (Plus (N 0) (V \"x\")) (N 1)",
        "```",
      ),
      starter: hs`quietLeft :: Expr -> Expr
quietLeft e = undefined
`,
      tests: [
        { expr: "quietLeft nestedZ", expected: "V \"x\"" },
        { expr: "quietLeft (Plus (N 0) (Plus (N 0) (Plus (N 0) (V \"z\"))))", expected: "V \"z\"" },
        { expr: "quietLeft (Plus (Plus (N 0) (V \"x\")) (N 1))", expected: "Plus (Plus (N 0) (V \"x\")) (N 1)" },
        { expr: "quietLeft (N 3)", expected: "N 3" },
      ],
      hint: "That is `untilQuiet peelZeroLeft`. Write the loop yourself.",
      solution: hs`quietLeft :: Expr -> Expr
quietLeft e = let e' = peelZeroLeft e in if e' == e then e else quietLeft e'
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Define a function `simplify :: Expr -> Expr` that rewrites an expression bottom-up using exactly these rules at each rebuilt node:",
        "",
        "```",
        "0 + e = e    e + 0 = e",
        "1 * e = e    e * 1 = e",
        "0 * e = 0    e * 0 = 0",
        "e - e = 0",
        "```",
        "",
        "Fold two numeric literals with `+`, `*` or `-` as well. For example:",
        "",
        "```",
        "*Main> simplify eDeep",
        "Times (V \"x\") (V \"y\")",
        "*Main> simplify (Plus (Times (N 1) (V \"x\")) (Times (N 0) (V \"y\")))",
        "V \"x\"",
        "```",
      ),
      starter: hs`simplify :: Expr -> Expr
simplify e = undefined
`,
      tests: [
        { expr: "simplify eDeep", expected: "Times (V \"x\") (V \"y\")" },
        { expr: "simplify (Plus (Times (N 1) (V \"x\")) (Times (N 0) (V \"y\")))", expected: "V \"x\"" },
        { expr: "simplify (Minus (Plus (N 2) (N 3)) (N 5))", expected: "N 0" },
        { expr: "simplify (Plus (V \"x\") (V \"x\"))", expected: "Plus (V \"x\") (V \"x\")" },
        { expr: "simplify nestedZ", expected: "V \"x\"" },
      ],
      hint: "Helpers `plusA`, `timesA`, `minusA` with identities before the two-`N` fold.",
      solution: hs`simplify :: Expr -> Expr
simplify (Plus a b) = plusA (simplify a) (simplify b)
simplify (Times a b) = timesA (simplify a) (simplify b)
simplify (Minus a b) = minusA (simplify a) (simplify b)
simplify e = e

plusA :: Expr -> Expr -> Expr
plusA (N 0) e = e
plusA e (N 0) = e
plusA (N a) (N b) = N (a + b)
plusA a b = Plus a b

timesA :: Expr -> Expr -> Expr
timesA (N 0) _ = N 0
timesA _ (N 0) = N 0
timesA (N 1) e = e
timesA e (N 1) = e
timesA (N a) (N b) = N (a * b)
timesA a b = Times a b

minusA :: Expr -> Expr -> Expr
minusA a b | a == b = N 0
minusA (N a) (N b) = N (a - b)
minusA a b = Minus a b
`,
    },
    {
      k: "write",
      setup: propSetup,
      body: md(
        "Define a function `simplifyP :: Prop -> Prop` that walks a proposition and then applies the constant rules:",
        "",
        "```",
        "T && p = p    p && T = p    F && p = F    p && F = F",
        "T || p = T    p || T = T    F || p = p    p || F = p",
        "Neg T = F     Neg F = T     Neg (Neg p) = p",
        "```",
        "",
        "For example:",
        "",
        "```",
        "*Main> simplifyP (Conj T (Disj F (Atom \"a\")))",
        "Atom \"a\"",
        "```",
      ),
      starter: hs`simplifyP :: Prop -> Prop
simplifyP p = undefined
`,
      tests: [
        { expr: "simplifyP (Conj T (Disj F (Atom \"a\")))", expected: "Atom \"a\"" },
        { expr: "simplifyP (Neg (Neg (Atom \"b\")))", expected: "Atom \"b\"" },
        { expr: "simplifyP (Disj T (Atom \"q\"))", expected: "T" },
        { expr: "simplifyP (Conj (Atom \"a\") (Atom \"a\"))", expected: "Conj (Atom \"a\") (Atom \"a\")" },
        { expr: "simplifyP (Neg (Conj T F))", expected: "T" },
      ],
      hint: "Same helpers as `tidyBool` in Level 3.",
      solution: hs`simplifyP :: Prop -> Prop
simplifyP (Conj a b) = andP (simplifyP a) (simplifyP b)
simplifyP (Disj a b) = orP (simplifyP a) (simplifyP b)
simplifyP (Neg a) = neg (simplifyP a)
simplifyP p = p

andP :: Prop -> Prop -> Prop
andP T p = p
andP p T = p
andP F _ = F
andP _ F = F
andP a b = Conj a b

orP :: Prop -> Prop -> Prop
orP T _ = T
orP _ T = T
orP F p = p
orP p F = p
orP a b = Disj a b

neg :: Prop -> Prop
neg T = F
neg F = T
neg (Neg p) = p
neg p = Neg p
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Define a function `bind :: String -> Expr -> Expr -> Expr` that replaces every `V x` in the third argument by the second argument. Other leaves stay. For example:",
        "",
        "```",
        "*Main> bind \"x\" (N 4) (Plus (V \"x\") (V \"y\"))",
        "Plus (N 4) (V \"y\")",
        "```",
      ),
      starter: hs`bind :: String -> Expr -> Expr -> Expr
bind x e body = undefined
`,
      tests: [
        { expr: "bind \"x\" (N 4) (Plus (V \"x\") (V \"y\"))", expected: "Plus (N 4) (V \"y\")" },
        { expr: "bind \"x\" (Plus (N 1) (N 1)) (Times (V \"x\") (V \"x\"))", expected: "Times (Plus (N 1) (N 1)) (Plus (N 1) (N 1))" },
        { expr: "bind \"y\" (N 0) xySum", expected: "Plus (V \"x\") (N 0)" },
        { expr: "bind \"x\" (N 1) (N 9)", expected: "N 9" },
      ],
      hint: "One equation per constructor. The `V` case is `if w == x then e else V w`.",
      solution: hs`bind :: String -> Expr -> Expr -> Expr
bind _ _ (N n) = N n
bind x e (V w) = if w == x then e else V w
bind x e (Plus a b) = Plus (bind x e a) (bind x e b)
bind x e (Times a b) = Times (bind x e a) (bind x e b)
bind x e (Minus a b) = Minus (bind x e a) (bind x e b)
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Define a function `replaceAll :: Expr -> Expr -> Expr -> Expr`. `replaceAll old new e` replaces every subtree of `e` that is `==` to `old` by `new`. If a node matches, do not also walk inside it. For example:",
        "",
        "```",
        "*Main> replaceAll (V \"x\") (N 1) xPlusX",
        "Plus (N 1) (N 1)",
        "```",
      ),
      starter: hs`replaceAll :: Expr -> Expr -> Expr -> Expr
replaceAll old new e = undefined
`,
      tests: [
        { expr: "replaceAll (V \"x\") (N 1) xPlusX", expected: "Plus (N 1) (N 1)" },
        { expr: "replaceAll zPlusX (V \"x\") (Plus zPlusX zPlusX)", expected: "Plus (V \"x\") (V \"x\")" },
        { expr: "replaceAll (N 0) (N 1) (V \"x\")", expected: "V \"x\"" },
        { expr: "replaceAll twoN (N 5) twoN", expected: "N 5" },
      ],
      hint: "Guard `e == old` first, then rebuild.",
      solution: hs`replaceAll :: Expr -> Expr -> Expr -> Expr
replaceAll old new e
  | e == old = new
  | otherwise = case e of
      Plus a b -> Plus (replaceAll old new a) (replaceAll old new b)
      Times a b -> Times (replaceAll old new a) (replaceAll old new b)
      Minus a b -> Minus (replaceAll old new a) (replaceAll old new b)
      _ -> e
`,
    },
    {
      k: "write",
      setup: stepSetup,
      body: md(
        "`step` is given (one-step identities: `0+e`, `e+0`, `1*e`, `e*1`, `e-e`).",
        "",
        "Define `rewriteAll :: Expr -> Expr` that applies `step` at every node after rewriting the children. For example:",
        "",
        "```",
        "*Main> rewriteAll nestedZ",
        "V \"x\"",
        "*Main> rewriteAll (Times (N 0) (V \"x\"))",
        "Times (N 0) (V \"x\")",
        "```",
        "",
        "The last example is unchanged because `step` has no `0 * e` rule.",
      ),
      starter: hs`rewriteAll :: Expr -> Expr
rewriteAll e = undefined
`,
      tests: [
        { expr: "rewriteAll nestedZ", expected: "V \"x\"" },
        { expr: "rewriteAll eDeep", expected: "Times (V \"x\") (V \"y\")" },
        { expr: "rewriteAll (Times (N 0) (V \"x\"))", expected: "Times (N 0) (V \"x\")" },
        { expr: "rewriteAll (Minus oneTimesX xTimes1)", expected: "N 0" },
      ],
      hint: "`rewriteAll (Plus a b) = step (Plus (rewriteAll a) (rewriteAll b))`.",
      solution: hs`rewriteAll :: Expr -> Expr
rewriteAll (Plus a b) = step (Plus (rewriteAll a) (rewriteAll b))
rewriteAll (Times a b) = step (Times (rewriteAll a) (rewriteAll b))
rewriteAll (Minus a b) = step (Minus (rewriteAll a) (rewriteAll b))
rewriteAll e = step e
`,
    },
    {
      k: "write",
      setup: polySetup,
      body: md(
        "Define a function `normalPoly :: Poly -> Poly` that gathers like names (first-seen order), drops zero coefficients, and sorts the rest by name (`sortOn fst`). For example:",
        "",
        "```",
        "*Main> normalPoly poly2",
        "[(\"x\",1),(\"z\",2)]",
        "```",
      ),
      starter: hs`import Data.List (sortOn)

normalPoly :: Poly -> Poly
normalPoly ts = undefined
`,
      tests: [
        { expr: "normalPoly poly2", expected: "[(\"x\", 1), (\"z\", 2)]" },
        { expr: "normalPoly poly1", expected: "[(\"x\", 5), (\"y\", 1)]" },
        { expr: "normalPoly [(\"\", 0), (\"b\", 1), (\"a\", 2)]", expected: "[(\"a\", 2), (\"b\", 1)]" },
        { expr: "normalPoly []", expected: "[]" },
      ],
      hint: "`sortOn fst . filter ((/= 0) . snd) . gather`.",
      solution: hs`import Data.List (sortOn)

normalPoly :: Poly -> Poly
normalPoly ts = sortOn fst (dropZero (gather ts))

gather :: Poly -> Poly
gather [] = []
gather ((v, n) : rest) = (v, n + extra) : gather leftover
  where
    extra = sum [m | (w, m) <- rest, w == v]
    leftover = [(w, m) | (w, m) <- rest, w /= v]

dropZero :: Poly -> Poly
dropZero [] = []
dropZero ((v, n) : rest)
  | n == 0 = dropZero rest
  | otherwise = (v, n) : dropZero rest
`,
    },
    {
      k: "write",
      setup: propSetup,
      body: md(
        "Define a function `pushNots :: Prop -> Prop` that pushes every `Neg` inwards until it sits on an `Atom` (or becomes `T`/`F`). Use De Morgan's laws, `Neg (Neg p) = pushNots p`, `Neg T = F` and `Neg F = T`. For example:",
        "",
        "```",
        "*Main> pushNots notAnd",
        "Disj (Neg (Atom \"a\")) (Neg (Atom \"b\"))",
        "```",
      ),
      starter: hs`pushNots :: Prop -> Prop
pushNots p = undefined
`,
      tests: [
        { expr: "pushNots notAnd", expected: "Disj (Neg (Atom \"a\")) (Neg (Atom \"b\"))" },
        { expr: "pushNots (Neg (Disj (Atom \"a\") (Neg (Atom \"b\"))))", expected: "Conj (Neg (Atom \"a\")) (Atom \"b\")" },
        { expr: "pushNots (Neg (Neg T))", expected: "T" },
        { expr: "pushNots (Conj nnB T)", expected: "Conj (Atom \"b\") T" },
      ],
      hint: "Same equations as `pushNeg` in Level 3.",
      solution: hs`pushNots :: Prop -> Prop
pushNots (Neg T) = F
pushNots (Neg F) = T
pushNots (Neg (Neg p)) = pushNots p
pushNots (Neg (Conj a b)) = Disj (pushNots (Neg a)) (pushNots (Neg b))
pushNots (Neg (Disj a b)) = Conj (pushNots (Neg a)) (pushNots (Neg b))
pushNots (Conj a b) = Conj (pushNots a) (pushNots b)
pushNots (Disj a b) = Disj (pushNots a) (pushNots b)
pushNots p = p
`,
    },
    {
      k: "write",
      setup: mixSetup,
      body: md(
        "Define a function `collapseScale :: Mix -> Mix` that, everywhere in the tree:",
        "",
        "```",
        "Scale 1 m            becomes  m",
        "Scale n (Scale k m)  becomes  Scale (n * k) m",
        "```",
        "",
        "For example:",
        "",
        "```",
        "*Main> collapseScale batter",
        "Scale 3 (Blend Flour Water)",
        "```",
      ),
      starter: hs`collapseScale :: Mix -> Mix
collapseScale m = undefined
`,
      tests: [
        { expr: "collapseScale batter", expected: "Scale 3 (Blend Flour Water)" },
        { expr: "collapseScale (Scale 2 (Scale 5 Sugar))", expected: "Scale 10 Sugar" },
        { expr: "collapseScale (Blend (Scale 1 Water) Flour)", expected: "Blend Water Flour" },
        { expr: "collapseScale Water", expected: "Water" },
      ],
      hint: "Walk the inner mix first, then a helper `scale`.",
      solution: hs`collapseScale :: Mix -> Mix
collapseScale (Blend a b) = Blend (collapseScale a) (collapseScale b)
collapseScale (Scale n m) = scale n (collapseScale m)
collapseScale m = m

scale :: Int -> Mix -> Mix
scale 1 m = m
scale n (Scale k m) = Scale (n * k) m
scale n m = Scale n m
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Define a function `foldClosed :: Expr -> Expr` that folds every operator whose two children (after rewriting) are both `N`, and leaves variables alone. It must not use the identity rules. For example:",
        "",
        "```",
        "*Main> foldClosed (Times (Plus (N 2) (N 3)) (V \"x\"))",
        "Times (N 5) (V \"x\")",
        "*Main> foldClosed (Plus (V \"x\") (N 0))",
        "Plus (V \"x\") (N 0)",
        "```",
      ),
      starter: hs`foldClosed :: Expr -> Expr
foldClosed e = undefined
`,
      tests: [
        { expr: "foldClosed (Times (Plus (N 2) (N 3)) (V \"x\"))", expected: "Times (N 5) (V \"x\")" },
        { expr: "foldClosed (Plus (V \"x\") (N 0))", expected: "Plus (V \"x\") (N 0)" },
        { expr: "foldClosed (Minus (N 8) (N 3))", expected: "N 5" },
        { expr: "foldClosed (Times (N 2) (N 3))", expected: "N 6" },
      ],
      hint: "Walk, then fold two `N`s only.",
      solution: hs`foldClosed :: Expr -> Expr
foldClosed (Plus a b) = add (foldClosed a) (foldClosed b)
foldClosed (Times a b) = mul (foldClosed a) (foldClosed b)
foldClosed (Minus a b) = sub (foldClosed a) (foldClosed b)
foldClosed e = e

add :: Expr -> Expr -> Expr
add (N a) (N b) = N (a + b)
add a b = Plus a b

mul :: Expr -> Expr -> Expr
mul (N a) (N b) = N (a * b)
mul a b = Times a b

sub :: Expr -> Expr -> Expr
sub (N a) (N b) = N (a - b)
sub a b = Minus a b
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Define a function `summands :: Expr -> [Expr]` that lists the top-level summands of a nested `Plus`, left to right. Do not flatten `Times` or `Minus`. For example:",
        "",
        "```",
        "*Main> summands (Plus (V \"x\") (Plus (N 1) (V \"y\")))",
        "[V \"x\", N 1, V \"y\"]",
        "```",
      ),
      starter: hs`summands :: Expr -> [Expr]
summands e = undefined
`,
      tests: [
        { expr: "summands (Plus (V \"x\") (Plus (N 1) (V \"y\")))", expected: "[V \"x\", N 1, V \"y\"]" },
        { expr: "summands (Times (V \"x\") (V \"y\"))", expected: "[Times (V \"x\") (V \"y\")]" },
        { expr: "summands (Plus eDeep (N 0))", expected: "[eDeep, N 0]" },
        { expr: "summands (V \"z\")", expected: "[V \"z\"]" },
      ],
      hint: "`summands (Plus a b) = summands a ++ summands b`.",
      solution: hs`summands :: Expr -> [Expr]
summands (Plus a b) = summands a ++ summands b
summands e = [e]
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Define a function `coeff :: String -> Expr -> Int`. You may assume `e` is a nested `Plus` of numbers, variables, and constant-times-variable products. A plain `V v` counts as coefficient 1. For example:",
        "",
        "```",
        "*Main> coeff \"x\" (Plus (V \"x\") (Times (N 3) (V \"x\")))",
        "4",
        "```",
      ),
      starter: hs`coeff :: String -> Expr -> Int
coeff v e = undefined
`,
      tests: [
        { expr: "coeff \"x\" (Plus (V \"x\") (Times (N 3) (V \"x\")))", expected: "4" },
        { expr: "coeff \"y\" (Plus (V \"x\") (N 2))", expected: "0" },
        { expr: "coeff \"x\" (Times (V \"x\") (N 5))", expected: "5" },
        { expr: "coeff \"x\" (N 9)", expected: "0" },
      ],
      hint: "Add on `Plus`. Match both orders of `Times`.",
      solution: hs`coeff :: String -> Expr -> Int
coeff v (Plus a b) = coeff v a + coeff v b
coeff v (V w) = if w == v then 1 else 0
coeff v (Times (N n) (V w)) = if w == v then n else 0
coeff v (Times (V w) (N n)) = if w == v then n else 0
coeff _ _ = 0
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Define a function `pretty :: Expr -> String`. Numbers use `show`, variables are their names, and every operator is fully bracketed with no spaces: `(a+b)`, `(a*b)`, `(a-b)`. For example:",
        "",
        "```",
        "*Main> pretty (Plus (V \"x\") (N 1))",
        "\"(x+1)\"",
        "```",
      ),
      starter: hs`pretty :: Expr -> String
pretty e = undefined
`,
      tests: [
        { expr: "pretty (Plus (V \"x\") (N 1))", expected: "\"(x+1)\"" },
        { expr: "pretty nestedZ", expected: "\"(0+(0+x))\"" },
        { expr: "pretty (N (-4))", expected: "\"-4\"" },
        { expr: "pretty (V \"q\")", expected: "\"q\"" },
      ],
      hint: "Same idea as `showExpr`.",
      solution: hs`pretty :: Expr -> String
pretty (N n) = show n
pretty (V v) = v
pretty (Plus a b) = "(" ++ pretty a ++ "+" ++ pretty b ++ ")"
pretty (Times a b) = "(" ++ pretty a ++ "*" ++ pretty b ++ ")"
pretty (Minus a b) = "(" ++ pretty a ++ "-" ++ pretty b ++ ")"
`,
    },
    {
      k: "write",
      setup: signedSetup,
      body: md(
        "A `Credit v` and a `Debit v` cancel when they sit next to each other. Define `cancelNext :: [Signed] -> [Signed]` that cancels every adjacent opposite pair, and after a cancel looks again from that point. For example:",
        "",
        "```",
        "*Main> cancelNext [Credit \"x\", Debit \"x\", Credit \"y\"]",
        "[Credit \"y\"]",
        "```",
      ),
      starter: hs`cancelNext :: [Signed] -> [Signed]
cancelNext xs = undefined
`,
      tests: [
        { expr: "cancelNext [Credit \"x\", Debit \"x\", Credit \"y\"]", expected: "[Credit \"y\"]" },
        { expr: "cancelNext [Credit \"x\", Credit \"x\", Debit \"x\"]", expected: "[Credit \"x\"]" },
        { expr: "cancelNext [Debit \"a\", Credit \"b\"]", expected: "[Debit \"a\", Credit \"b\"]" },
        { expr: "cancelNext []", expected: "[]" },
      ],
      hint: "Nested patterns with a guard `v == w`, recursing on `rest`.",
      solution: hs`cancelNext :: [Signed] -> [Signed]
cancelNext (Credit v : Debit w : rest) | v == w = cancelNext rest
cancelNext (Debit v : Credit w : rest) | v == w = cancelNext rest
cancelNext (x : rest) = x : cancelNext rest
cancelNext [] = []
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Define **two** functions:",
        "",
        "- `stepZero :: Expr -> Expr`, one-step at the top: `0 + e` and `e + 0` become `e`.",
        "- `walkZero :: Expr -> Expr`, the same rule after rewriting both children.",
        "",
        "For example `stepZero nestedZ` is `0 + x`, but `walkZero nestedZ` is `x`.",
      ),
      starter: hs`stepZero :: Expr -> Expr
stepZero e = undefined

walkZero :: Expr -> Expr
walkZero e = undefined
`,
      tests: [
        { expr: "stepZero nestedZ", expected: "Plus (N 0) (V \"x\")" },
        { expr: "walkZero nestedZ", expected: "V \"x\"" },
        { expr: "stepZero eDeep", expected: "eDeep" },
        { expr: "walkZero eDeep", expected: "Times (V \"x\") (V \"y\")" },
        { expr: "stepZero xPlusZ", expected: "V \"x\"" },
      ],
      hint: "`walkZero (Plus a b) = plusZ (walkZero a) (walkZero b)`.",
      solution: hs`stepZero :: Expr -> Expr
stepZero (Plus (N 0) e) = e
stepZero (Plus e (N 0)) = e
stepZero e = e

walkZero :: Expr -> Expr
walkZero (Plus a b) = plusZ (walkZero a) (walkZero b)
walkZero (Times a b) = Times (walkZero a) (walkZero b)
walkZero (Minus a b) = Minus (walkZero a) (walkZero b)
walkZero e = e

plusZ :: Expr -> Expr -> Expr
plusZ (N 0) e = e
plusZ e (N 0) = e
plusZ a b = Plus a b
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Define a function `noSub :: Expr -> Expr` that replaces every `Minus a b` by `Plus a (Times (N (-1)) b)`, everywhere. Do not simplify. For example:",
        "",
        "```",
        "*Main> noSub (Minus (V \"x\") (V \"y\"))",
        "Plus (V \"x\") (Times (N (-1)) (V \"y\"))",
        "```",
      ),
      starter: hs`noSub :: Expr -> Expr
noSub e = undefined
`,
      tests: [
        { expr: "noSub (Minus (V \"x\") (V \"y\"))", expected: "Plus (V \"x\") (Times (N (-1)) (V \"y\"))" },
        { expr: "noSub yMinusY", expected: "Plus (V \"y\") (Times (N (-1)) (V \"y\"))" },
        { expr: "noSub twoN", expected: "twoN" },
        { expr: "noSub (Plus (Minus (N 1) (N 1)) (V \"x\"))", expected: "Plus (Plus (N 1) (Times (N (-1)) (N 1))) (V \"x\")" },
      ],
      hint: "Rewrite children of `Plus`/`Times` too.",
      solution: hs`noSub :: Expr -> Expr
noSub (Minus a b) = Plus (noSub a) (Times (N (-1)) (noSub b))
noSub (Plus a b) = Plus (noSub a) (noSub b)
noSub (Times a b) = Times (noSub a) (noSub b)
noSub e = e
`,
    },
    {
      k: "write",
      setup: propSetup,
      body: md(
        "Define a function `litOk :: Prop -> Bool` that is `True` precisely when the proposition is in the form where every `Neg` sits on an `Atom`. `T` and `F` are allowed; `Neg T` is not. For example:",
        "",
        "```",
        "*Main> litOk (Neg (Atom \"a\"))",
        "True",
        "*Main> litOk notAnd",
        "False",
        "```",
      ),
      starter: hs`litOk :: Prop -> Bool
litOk p = undefined
`,
      tests: [
        { expr: "litOk (Neg (Atom \"a\"))", expected: "True" },
        { expr: "litOk notAnd", expected: "False" },
        { expr: "litOk (Neg T)", expected: "False" },
        { expr: "litOk (Conj T (Neg (Atom \"a\")))", expected: "True" },
      ],
      hint: "`Neg (Atom _)` is the only acceptable `Neg`.",
      solution: hs`litOk :: Prop -> Bool
litOk T = True
litOk F = True
litOk (Atom _) = True
litOk (Neg (Atom _)) = True
litOk (Neg _) = False
litOk (Conj a b) = litOk a && litOk b
litOk (Disj a b) = litOk a && litOk b
`,
    },
    {
      k: "write",
      setup: peelSetup,
      body: md(
        "`peelZeroTop` is given. Define `quietWalk :: Expr -> Expr` as follows: rewrite the children with `quietWalk`, rebuild the node, apply `peelZeroTop` once to that top, and **if the result is different from the rebuilt node**, run `quietWalk` on it again. That is a local fixpoint at every node.",
        "",
        "In practice, for these identity rules one extra check is enough. For example:",
        "",
        "```",
        "*Main> quietWalk nestedZ",
        "V \"x\"",
        "*Main> quietWalk (Plus (Plus (N 0) (V \"x\")) (N 0))",
        "V \"x\"",
        "```",
      ),
      starter: hs`quietWalk :: Expr -> Expr
quietWalk e = undefined
`,
      tests: [
        { expr: "quietWalk nestedZ", expected: "V \"x\"" },
        { expr: "quietWalk (Plus (Plus (N 0) (V \"x\")) (N 0))", expected: "V \"x\"" },
        { expr: "quietWalk eDeep", expected: "Times (V \"x\") (V \"y\")" },
        { expr: "quietWalk (Plus (V \"x\") (N 1))", expected: "Plus (V \"x\") (N 1)" },
      ],
      hint: "Build `e' = Plus (quietWalk a) (quietWalk b)`, let `e'' = peelZeroTop e'`, and if `e'' /= e'` then `quietWalk e''` else `e''`.",
      solution: hs`quietWalk :: Expr -> Expr
quietWalk (Plus a b) = again (Plus (quietWalk a) (quietWalk b))
quietWalk (Times a b) = again (Times (quietWalk a) (quietWalk b))
quietWalk (Minus a b) = again (Minus (quietWalk a) (quietWalk b))
quietWalk e = peelZeroTop e

again :: Expr -> Expr
again e = let e' = peelZeroTop e in if e' == e then e else quietWalk e'
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Define `spreadOnce` that walks children first, then at a `Times` applies **one** of",
        "",
        "```",
        "a * (b + c)  becomes  (a * b) + (a * c)",
        "(a + b) * c  becomes  (a * c) + (b * c)",
        "```",
        "",
        "in that order, without spreading the `Plus` it just built.",
        "",
        "Then define `expandAll` that applies `spreadOnce` until the tree stops changing. For example:",
        "",
        "```",
        "*Main> expandAll (Times (V \"x\") (Plus (Plus (V \"y\") (V \"z\")) (V \"w\")))",
        "Plus (Plus (Times (V \"x\") (V \"y\")) (Times (V \"x\") (V \"z\"))) (Times (V \"x\") (V \"w\"))",
        "```",
      ),
      starter: hs`spreadOnce :: Expr -> Expr
spreadOnce e = undefined

expandAll :: Expr -> Expr
expandAll e = undefined
`,
      tests: [
        { expr: "spreadOnce (Times (V \"x\") (Plus (Plus (V \"y\") (V \"z\")) (V \"w\")))", expected: "Plus (Times (V \"x\") (Plus (V \"y\") (V \"z\"))) (Times (V \"x\") (V \"w\"))" },
        { expr: "expandAll (Times (V \"x\") (Plus (Plus (V \"y\") (V \"z\")) (V \"w\")))", expected: "Plus (Plus (Times (V \"x\") (V \"y\")) (Times (V \"x\") (V \"z\"))) (Times (V \"x\") (V \"w\"))" },
        { expr: "expandAll (Times (Plus (V \"a\") (V \"b\")) (N 2))", expected: "Plus (Times (V \"a\") (N 2)) (Times (V \"b\") (N 2))" },
        { expr: "expandAll (V \"x\")", expected: "V \"x\"" },
        { expr: "expandAll (Times (V \"x\") (V \"y\"))", expected: "Times (V \"x\") (V \"y\")" },
      ],
      hint: "`expandAll e = let e' = spreadOnce e in if e' == e then e else expandAll e'`.",
      solution: hs`spreadOnce :: Expr -> Expr
spreadOnce (Plus a b) = Plus (spreadOnce a) (spreadOnce b)
spreadOnce (Minus a b) = Minus (spreadOnce a) (spreadOnce b)
spreadOnce (Times a b) = case (spreadOnce a, spreadOnce b) of
  (a', Plus b1 b2) -> Plus (Times a' b1) (Times a' b2)
  (Plus a1 a2, b') -> Plus (Times a1 b') (Times a2 b')
  (a', b') -> Times a' b'
spreadOnce e = e

expandAll :: Expr -> Expr
expandAll e = let e' = spreadOnce e in if e' == e then e else expandAll e'
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Define `normalise :: Expr -> Expr`, a unique normal form obtained in this **fixed order**:",
        "",
        "1. Replace every `Minus a b` by `Plus a (Times (N (-1)) b)` (everywhere).",
        "2. Expand products over sums by taking the fixpoint of the one-level `spreadOnce` from the previous style of question (same two distribution rules, same order).",
        "3. Read the nested `Plus` as a polynomial (`\"\"` is the constant; `V v` has coeff 1; `Times (N k) (V v)` and `Times (V v) (N k)` are allowed; ignore any other shape).",
        "4. Gather like names, drop zeros, sort by name (`\"\"` first), rebuild as a right-associated `Plus`. Coefficient `1` is a plain `V`; the empty polynomial is `N 0`.",
        "",
        "```",
        "*Main> normalise (Minus (V \"x\") (V \"x\"))",
        "N 0",
        "*Main> normalise (Times (N 2) (Plus (V \"b\") (V \"a\")))",
        "Plus (Times (N 2) (V \"a\")) (Times (N 2) (V \"b\"))",
        "```",
      ),
      starter: hs`import Data.List (sortOn)

normalise :: Expr -> Expr
normalise e = undefined
`,
      tests: [
        { expr: "normalise (Minus (V \"x\") (V \"x\"))", expected: "N 0" },
        { expr: "normalise (Times (N 2) (Plus (V \"b\") (V \"a\")))", expected: "Plus (Times (N 2) (V \"a\")) (Times (N 2) (V \"b\"))" },
        { expr: "normalise (Plus (V \"x\") (N 0))", expected: "V \"x\"" },
        { expr: "normalise (Times (N 0) (V \"y\"))", expected: "N 0" },
        { expr: "normalise (Plus (Times (N 1) (V \"x\")) (V \"x\"))", expected: "Times (N 2) (V \"x\")" },
        { expr: "normalise (Plus (N 3) (Plus (V \"x\") (N 2)))", expected: "Plus (N 5) (V \"x\")" },
      ],
      hint: "Compose the four stages. `sortOn fst` after `gather` and `dropZero`.",
      solution: hs`import Data.List (sortOn)

normalise :: Expr -> Expr
normalise e = fromPoly (sortOn fst (dropZero (gather (toPoly (expandAll (noMinus e))))))

noMinus :: Expr -> Expr
noMinus (Minus a b) = Plus (noMinus a) (Times (N (-1)) (noMinus b))
noMinus (Plus a b) = Plus (noMinus a) (noMinus b)
noMinus (Times a b) = Times (noMinus a) (noMinus b)
noMinus e = e

spreadOnce :: Expr -> Expr
spreadOnce (Plus a b) = Plus (spreadOnce a) (spreadOnce b)
spreadOnce (Minus a b) = Minus (spreadOnce a) (spreadOnce b)
spreadOnce (Times a b) = case (spreadOnce a, spreadOnce b) of
  (a', Plus b1 b2) -> Plus (Times a' b1) (Times a' b2)
  (Plus a1 a2, b') -> Plus (Times a1 b') (Times a2 b')
  (a', b') -> Times a' b'
spreadOnce e = e

expandAll :: Expr -> Expr
expandAll e = let e' = spreadOnce e in if e' == e then e else expandAll e'

toPoly :: Expr -> [(String, Int)]
toPoly (Plus a b) = toPoly a ++ toPoly b
toPoly (N n) = [("", n)]
toPoly (V v) = [(v, 1)]
toPoly (Times (N n) (V v)) = [(v, n)]
toPoly (Times (V v) (N n)) = [(v, n)]
toPoly _ = []

gather :: [(String, Int)] -> [(String, Int)]
gather [] = []
gather ((v, n) : rest) = (v, n + extra) : gather leftover
  where
    extra = sum [m | (w, m) <- rest, w == v]
    leftover = [(w, m) | (w, m) <- rest, w /= v]

dropZero :: [(String, Int)] -> [(String, Int)]
dropZero [] = []
dropZero ((v, n) : rest)
  | n == 0 = dropZero rest
  | otherwise = (v, n) : dropZero rest

fromPoly :: [(String, Int)] -> Expr
fromPoly [] = N 0
fromPoly [t] = term t
fromPoly (t : ts) = Plus (term t) (fromPoly ts)

term :: (String, Int) -> Expr
term ("", n) = N n
term (v, 1) = V v
term (v, k) = Times (N k) (V v)
`,
    },
    {
      k: "write",
      setup: propSetup,
      body: md(
        "Define `quietBool :: Prop -> Prop`. First push every `Neg` inwards (`Neg T = F`, `Neg F = T`, `Neg (Neg p)` unwraps, De Morgan for `Conj`/`Disj`). Then apply the constant `Conj`/`Disj`/`Neg` rules **until the proposition stops changing**.",
        "",
        "```",
        "*Main> quietBool (Neg (Conj T (Atom \"a\")))",
        "Neg (Atom \"a\")",
        "*Main> quietBool (Disj F (Conj T F))",
        "F",
        "```",
      ),
      starter: hs`quietBool :: Prop -> Prop
quietBool p = undefined
`,
      tests: [
        { expr: "quietBool (Neg (Conj T (Atom \"a\")))", expected: "Neg (Atom \"a\")" },
        { expr: "quietBool (Disj F (Conj T F))", expected: "F" },
        { expr: "quietBool (Neg (Neg (Neg T)))", expected: "F" },
        { expr: "quietBool (Conj (Atom \"a\") (Atom \"a\"))", expected: "Conj (Atom \"a\") (Atom \"a\")" },
        { expr: "quietBool (Disj (Neg F) (Atom \"a\"))", expected: "T" },
      ],
      hint: "`quietBool p = until (foldP (push p))` where `until` repeats `foldP` while the tree changes.",
      solution: hs`quietBool :: Prop -> Prop
quietBool p = quiet (push p)

quiet :: Prop -> Prop
quiet p = let p' = foldP p in if p' == p then p else quiet p'

push :: Prop -> Prop
push (Neg T) = F
push (Neg F) = T
push (Neg (Neg p)) = push p
push (Neg (Conj a b)) = Disj (push (Neg a)) (push (Neg b))
push (Neg (Disj a b)) = Conj (push (Neg a)) (push (Neg b))
push (Conj a b) = Conj (push a) (push b)
push (Disj a b) = Disj (push a) (push b)
push p = p

foldP :: Prop -> Prop
foldP (Conj a b) = andP (foldP a) (foldP b)
foldP (Disj a b) = orP (foldP a) (foldP b)
foldP (Neg a) = neg (foldP a)
foldP p = p

andP :: Prop -> Prop -> Prop
andP T p = p
andP p T = p
andP F _ = F
andP _ F = F
andP a b = Conj a b

orP :: Prop -> Prop -> Prop
orP T _ = T
orP _ T = T
orP F p = p
orP p F = p
orP a b = Disj a b

neg :: Prop -> Prop
neg T = F
neg F = T
neg (Neg p) = p
neg p = Neg p
`,
    },
    {
      k: "write",
      setup: mixSetup,
      body: md(
        "Define `normMix :: Mix -> Mix` that:",
        "",
        "1. turns the mix into gathered `(ingredient, count)` amounts using names `\"water\"`, `\"flour\"`, `\"sugar\"` (`Scale` multiplies; `Blend` concatenates then gathers, first-seen);",
        "2. drops zero counts;",
        "3. rebuilds a right-associated `Blend` of `Scale n ingredient` (use `Scale` even when `n == 1`); the empty mix is `Scale 0 Water`.",
        "",
        "```",
        "*Main> normMix (Blend (Scale 2 Water) (Blend Flour (Scale 0 Sugar)))",
        "Blend (Scale 2 Water) (Scale 1 Flour)",
        "*Main> normMix (Scale 0 Flour)",
        "Scale 0 Water",
        "```",
      ),
      starter: hs`normMix :: Mix -> Mix
normMix m = undefined
`,
      tests: [
        { expr: "normMix (Blend (Scale 2 Water) (Blend Flour (Scale 0 Sugar)))", expected: "Blend (Scale 2 Water) (Scale 1 Flour)" },
        { expr: "normMix (Scale 0 Flour)", expected: "Scale 0 Water" },
        { expr: "normMix (Blend Flour Flour)", expected: "Scale 2 Flour" },
        { expr: "normMix batter", expected: "Blend (Scale 3 Flour) (Scale 3 Water)" },
        { expr: "normMix Water", expected: "Scale 1 Water" },
      ],
      hint: "Rebuild with `fromAmt`. A singleton list is just `Scale n ing`, no `Blend`.",
      solution: hs`normMix :: Mix -> Mix
normMix m = fromAmt (dropZero (amounts m))

amounts :: Mix -> [(String, Int)]
amounts Water = [("water", 1)]
amounts Flour = [("flour", 1)]
amounts Sugar = [("sugar", 1)]
amounts (Blend a b) = gather (amounts a ++ amounts b)
amounts (Scale n m) = [(i, n * k) | (i, k) <- amounts m]

gather :: [(String, Int)] -> [(String, Int)]
gather [] = []
gather ((v, n) : rest) = (v, n + extra) : gather leftover
  where
    extra = sum [c | (w, c) <- rest, w == v]
    leftover = [(w, c) | (w, c) <- rest, w /= v]

dropZero :: [(String, Int)] -> [(String, Int)]
dropZero [] = []
dropZero ((v, n) : rest)
  | n == 0 = dropZero rest
  | otherwise = (v, n) : dropZero rest

fromAmt :: [(String, Int)] -> Mix
fromAmt [] = Scale 0 Water
fromAmt [t] = piece t
fromAmt (t : ts) = Blend (piece t) (fromAmt ts)

piece :: (String, Int) -> Mix
piece (i, n) = Scale n (ing i)

ing :: String -> Mix
ing "water" = Water
ing "flour" = Flour
ing "sugar" = Sugar
ing _ = Water
`,
    },
    {
      k: "write",
      setup: coeffsSetup,
      body: md(
        "A polynomial in `x` is stored as `Coeffs`: index `i` is the coefficient of `x^i`. So `[3, 0, 2]` is `3 + 2x^2`.",
        "",
        "Define `polyMul :: Coeffs -> Coeffs -> Coeffs`. The product of the zero polynomial (`[]` or any all-zero list) with anything is `[0]`. Drop **trailing** zeros in the result, except keep a lone `[0]`. For example:",
        "",
        "```",
        "*Main> polyMul [1, 1] [1, 1]",
        "[1, 2, 1]",
        "*Main> polyMul [2] [0, 0, 3]",
        "[0, 0, 6]",
        "```",
      ),
      starter: hs`polyMul :: Coeffs -> Coeffs -> Coeffs
polyMul xs ys = undefined
`,
      tests: [
        { expr: "polyMul [1, 1] [1, 1]", expected: "[1, 2, 1]" },
        { expr: "polyMul [2] [0, 0, 3]", expected: "[0, 0, 6]" },
        { expr: "polyMul [1, 2] []", expected: "[0]" },
        { expr: "polyMul pA pB", expected: "[3, 6, 1, 2]" },
        { expr: "polyMul [0, 0] [1, 1]", expected: "[0]" },
      ],
      hint: "Coefficient `n` of the product is `sum [a * b | (i, a) <- zip [0..] xs, (j, b) <- zip [0..] ys, i + j == n]`. Then strip trailing zeros.",
      solution: hs`polyMul :: Coeffs -> Coeffs -> Coeffs
polyMul xs ys
  | null xs || null ys = [0]
  | otherwise = strip [c n | n <- [0 .. length xs + length ys - 2]]
  where
    c n = sum [a * b | (i, a) <- zip [0..] xs, (j, b) <- zip [0..] ys, i + j == n]

strip :: Coeffs -> Coeffs
strip xs =
  case reverse (dropWhile (== 0) (reverse xs)) of
    [] -> [0]
    ys -> ys
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Define `sameValue :: Expr -> Expr -> Bool`. It is `True` when the two expressions have the same `normalise` tree, using the unique normal form of the earlier `normalise` question (noMinus, expand to a fixpoint, gather, drop zeros, sort by name, rebuild). For example:",
        "",
        "```",
        "*Main> sameValue (Minus (V \"x\") (V \"x\")) (N 0)",
        "True",
        "*Main> sameValue (Plus (V \"x\") (V \"y\")) (Plus (V \"y\") (V \"x\"))",
        "True",
        "*Main> sameValue (V \"x\") (V \"y\")",
        "False",
        "```",
      ),
      starter: hs`import Data.List (sortOn)

sameValue :: Expr -> Expr -> Bool
sameValue a b = undefined
`,
      tests: [
        { expr: "sameValue (Minus (V \"x\") (V \"x\")) (N 0)", expected: "True" },
        { expr: "sameValue (Plus (V \"x\") (V \"y\")) (Plus (V \"y\") (V \"x\"))", expected: "True" },
        { expr: "sameValue (V \"x\") (V \"y\")", expected: "False" },
        { expr: "sameValue (Times (N 2) (Plus (V \"a\") (V \"b\"))) (Plus (Times (N 2) (V \"b\")) (Times (N 2) (V \"a\")))", expected: "True" },
        { expr: "sameValue (Plus (V \"x\") (N 1)) (V \"x\")", expected: "False" },
      ],
      hint: "`sameValue a b = normalise a == normalise b`. Copy the `normalise` pipeline.",
      solution: hs`import Data.List (sortOn)

sameValue :: Expr -> Expr -> Bool
sameValue a b = normalise a == normalise b

normalise :: Expr -> Expr
normalise e = fromPoly (sortOn fst (dropZero (gather (toPoly (expandAll (noMinus e))))))

noMinus :: Expr -> Expr
noMinus (Minus a b) = Plus (noMinus a) (Times (N (-1)) (noMinus b))
noMinus (Plus a b) = Plus (noMinus a) (noMinus b)
noMinus (Times a b) = Times (noMinus a) (noMinus b)
noMinus e = e

spreadOnce :: Expr -> Expr
spreadOnce (Plus a b) = Plus (spreadOnce a) (spreadOnce b)
spreadOnce (Minus a b) = Minus (spreadOnce a) (spreadOnce b)
spreadOnce (Times a b) = case (spreadOnce a, spreadOnce b) of
  (a', Plus b1 b2) -> Plus (Times a' b1) (Times a' b2)
  (Plus a1 a2, b') -> Plus (Times a1 b') (Times a2 b')
  (a', b') -> Times a' b'
spreadOnce e = e

expandAll :: Expr -> Expr
expandAll e = let e' = spreadOnce e in if e' == e then e else expandAll e'

toPoly :: Expr -> [(String, Int)]
toPoly (Plus a b) = toPoly a ++ toPoly b
toPoly (N n) = [("", n)]
toPoly (V v) = [(v, 1)]
toPoly (Times (N n) (V v)) = [(v, n)]
toPoly (Times (V v) (N n)) = [(v, n)]
toPoly _ = []

gather :: [(String, Int)] -> [(String, Int)]
gather [] = []
gather ((v, n) : rest) = (v, n + extra) : gather leftover
  where
    extra = sum [m | (w, m) <- rest, w == v]
    leftover = [(w, m) | (w, m) <- rest, w /= v]

dropZero :: [(String, Int)] -> [(String, Int)]
dropZero [] = []
dropZero ((v, n) : rest)
  | n == 0 = dropZero rest
  | otherwise = (v, n) : dropZero rest

fromPoly :: [(String, Int)] -> Expr
fromPoly [] = N 0
fromPoly [t] = term t
fromPoly (t : ts) = Plus (term t) (fromPoly ts)

term :: (String, Int) -> Expr
term ("", n) = N n
term (v, 1) = V v
term (v, k) = Times (N k) (V v)
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Define `quietRules :: Expr -> Expr`. A **top-only** step tries these rules in order and uses the first match:",
        "",
        "```",
        "0 + e = e",
        "e + 0 = e",
        "1 * e = e",
        "e * 1 = e",
        "0 * e = 0",
        "e * 0 = 0",
        "e - e = 0          -- when the two children are ==",
        "```",
        "",
        "Then `quietRules` repeats that top-only step until the tree is stable. It will rewrite `0+(0+x)` fully, but it will **not** look inside `Times (0+x) 2`. For example:",
        "",
        "```",
        "*Main> quietRules nestedZ",
        "V \"x\"",
        "*Main> quietRules eDeep",
        "Times (Plus (N 0) (V \"x\")) (Plus (V \"y\") (N 0))",
        "```",
      ),
      starter: hs`quietRules :: Expr -> Expr
quietRules e = undefined
`,
      tests: [
        { expr: "quietRules nestedZ", expected: "V \"x\"" },
        { expr: "quietRules eDeep", expected: "eDeep" },
        { expr: "quietRules (Plus (N 0) (Times (N 1) (V \"x\")))", expected: "V \"x\"" },
        { expr: "quietRules (Times (N 0) (Plus (N 0) (V \"x\")))", expected: "N 0" },
        { expr: "quietRules (Minus (V \"x\") (V \"x\"))", expected: "N 0" },
        { expr: "quietRules (Plus (N 1) (N 1))", expected: "Plus (N 1) (N 1)" },
      ],
      hint: "Write `topStep`, then loop while `topStep e /= e`. `0 * (0+x)` matches `0 * e` at the top and becomes `N 0` in one step.",
      solution: hs`quietRules :: Expr -> Expr
quietRules e = let e' = topStep e in if e' == e then e else quietRules e'

topStep :: Expr -> Expr
topStep (Plus (N 0) e) = e
topStep (Plus e (N 0)) = e
topStep (Times (N 1) e) = e
topStep (Times e (N 1)) = e
topStep (Times (N 0) _) = N 0
topStep (Times _ (N 0)) = N 0
topStep (Minus a b) | a == b = N 0
topStep e = e
`,
    },
  ],
};

export const book: Book = {
  id: "b-rewrite",
  order: 7,
  title: "Rewriting and simplification",
  blurb:
    "Nested patterns, one-step rules, rewriting a whole tree, combining like terms, and (at the end) repeating a rewrite until it stops changing.",
  sets: [level1, level2, level3, level4],
};

