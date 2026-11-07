import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "y2018",
  year: 2018,
  title: "Constant Propagation",
  summary: "Write an interpreter for a tiny imperative language, then two compiler optimisations (constant propagation and folding) and the removal of phi functions from SSA code.",
  skills: [
    "interpreters over a data type",
    "mutual recursion",
    "lookup tables as program state",
    "pattern matching on nested constructors",
    "tuples to return several results",
    "worklist algorithms",
    "recursion over statement lists",
  ],
  story: md(
    "A **compiler** turns a program written by a person into instructions the computer runs. Along the way it **optimises** the program: rewrites it so it runs faster but still computes exactly the same answers. In this paper you play compiler for a tiny Java-like language that only has integers.",
    "",
    "**The little language.** A function assigns to variables, has `if`s and `do-while` loops, and returns its answer by assigning to the special variable `$return`:",
    "",
    "```",
    "basicBlock() {",
    "  x = 1",
    "  y = 2",
    "  x = x + y",
    "  y = x * 3",
    "  $return = y",
    "}",
    "```",
    "",
    "There are no Booleans: a condition such as `x == 10` or `i > 0` gives `1` for true and `0` for false. A `do { body } while (cond)` loop runs its body once, then keeps going while the condition is 1. (Unlike a `while` loop, the body always runs at least once.)",
    "",
    "**SSA: Static Single Assignment.** Compilers like to rewrite programs so that every variable is assigned **exactly once**, by giving each assignment a new numbered name. Also, operators are only ever applied to plain variables or constants, never to bigger expressions. The example above becomes:",
    "",
    "```",
    "x0 = 1",
    "y0 = 2",
    "x1 = x0 + y0",
    "y1 = x1 * 3",
    "$return = y1",
    "```",
    "",
    "Now if you see `x0 = 1` you know `x0` is 1 *everywhere*: it can never change (just like a Haskell variable).",
    "",
    "**Constant propagation and folding.** Propagation: if `x0 = 1`, delete that line and write `1` wherever `x0` appears. Folding: if you now see `1 + 2`, replace it with `3`. Repeat: `x1 = 1 + 2` becomes `x1 = 3`, which is a new constant to propagate, so `y1 = 3 * 3` becomes `y1 = 9`, and finally the whole function is just `$return = 9`. The `$return` line is never deleted, because the function must still return something.",
    "",
    "**Phi functions.** What if a variable gets different values on different paths?",
    "",
    "```",
    "if (x > y) {          if (x > y) {",
    "  m = x                 m0 = x",
    "} else {      SSA     } else {",
    "  m = y        ==>      m1 = y",
    "}                     }",
    "$return = m           m2 = PHI(m0, m1)",
    "                      $return = m2",
    "```",
    "",
    "`m2 = PHI(m0, m1)` means \"`m2` is `m0` if we came through the true branch, and `m1` if we came through the false branch\". Phis appear in two places only: straight after an `if`, and at the very start of a `do-while` body, where `i1 = PHI(i0, i2)` means \"`i0` on the first time round the loop, `i2` (the value from the end of the last iteration) after that\".",
    "",
    "A phi can't actually be run, so at the end the compiler removes them (**unPhi**). After an `if`, `v = PHI(e1, e2)` becomes `v = e1` at the end of the true branch and `v = e2` at the end of the false branch. At the start of a loop, it becomes `v = e1` just *before* the loop and `v = e2` at the *end* of the loop body.",
    "",
    "### The given types",
    "",
    "```",
    "type Id = String",
    "type Function = (Id, [Id], Block)",
    "type Block = [Statement]",
    "",
    "data Statement = Assign Id Exp | If Exp Block Block | DoWhile Block Exp",
    "data Exp = Const Int | Var Id | Apply Op Exp Exp | Phi Exp Exp",
    "data Op = Add | Mul | Eq | Gtr",
    "",
    "type State = [(Id, Int)]",
    "```",
    "",
    "- A `Function` is its name, the names of its arguments, and its body.",
    "- A `Block` is a list of statements run in order.",
    "- `Assign v e` is `v = e`. `If p b1 b2` runs `b1` if `p` is 1 and `b2` if it is 0 (`b2` can be empty: no `else`). `DoWhile b p` is `do { b } while (p)`.",
    "- `Const 5` is the number 5, `Var \"x\"` is a variable, `Apply Add e1 e2` is `e1 + e2` (likewise `Mul` is `*`, `Eq` is `==`, `Gtr` is `>`), and `Phi e1 e2` is `PHI(e1, e2)`.",
    "- A `State` records the current value of each variable, e.g. `[(\"x\",7),(\"y\",8)]`.",
    "",
    "Given to you: `lookUp` (finds a key, with a helpful error if missing), `execFun` (runs a function on argument values), `applyPropagate`, `applyUnPhi` and `optimise` (apply your functions to a whole `Function`), the printers `showFun` and `showBlock`, and test data. Each example function comes in up to four versions: `fun` (original), `funSSA`, `funSSAPropagated` (after constant propagation) and `funOptimised` (after unPhi too). The examples are `basicBlock`, `example`, `loop`, `max2` and `fact`, plus the states and expressions `s1` and `e1` to `e5`.",
  ),
  notes: md(
    "**Where the marks are.** Part I (the interpreter) is 14 marks and Part II (propagation) is 13, so these are 27 of the 30. Part III (`unPhi`) is 3 marks, and Part IV is unassessed. The three assessed parts are independent, so if you get stuck, move on.",
    "",
    "**Order of attack.** `update`, `apply`, `eval` take a few minutes each. Then `execStatement`/`execBlock` (7 marks): check `execFun fact [5]` and `execFun loop [4]`. Then `foldConst` and `sub` (quick), then `propagateConstants`, the hardest function. `unPhi` is short and independent: if `propagateConstants` is taking too long, do `unPhi` first.",
    "",
    "**Traps.**",
    "",
    "- `update` must *replace* an existing binding, not add a second one.",
    "- A do-while runs its body *first* and only then tests the condition, using the *new* state.",
    "- `foldConst` must use exactly the rules given (no `1 * x = x`), or the auto-tests will disagree with you.",
    "- In `propagateConstants`, never delete an assignment to `$return`, even when it becomes a constant. Also don't put it in the worklist (it would be found again on every scan, and the algorithm would never stop).",
    "- Constant assignments can be inside `if` branches and loop bodies: your scan must go into nested blocks, and into the conditions of `If` and `DoWhile`.",
    "- An `If` must stay in the block even when both its branches become empty.",
    "",
    "**Short of time?** Skip Part IV entirely (it's worth nothing). If `propagateConstants` won't come together, make sure `unPhi` is done: it's 3 marks for about ten lines.",
  ),
  setup: hs`import Data.Maybe
import Data.List

type Id = String

type Function = (Id, [Id], Block)

type Block = [Statement]

data Statement = Assign Id Exp |
                 If Exp Block Block |
                 DoWhile Block Exp
               deriving (Eq, Show)

data Exp = Const Int | Var Id | Apply Op Exp Exp | Phi Exp Exp
         deriving (Eq, Show)

data Op = Add | Mul | Eq | Gtr
        deriving (Eq, Show)

type State = [(Id, Int)]

lookUp :: (Eq a, Show a) => a -> [(a, b)] -> b
lookUp i table
  = fromMaybe (error ("lookup failed on identifier: " ++ show i))
              (lookup i table)

execFun :: Function -> [Int] -> State
execFun (name, args, p) vs
  = execBlock p (zip args vs)

applyPropagate :: Function -> Function
applyPropagate (name, args, body)
  = (name, args, propagateConstants body)

applyUnPhi :: Function -> Function
applyUnPhi (name, args, body)
  = (name, args, unPhi body)

optimise :: Function -> Function
optimise (name, args, body)
  = (name, args, unPhi (propagateConstants body))

--------------------------------------------------------------
-- Pretty printing

showFun :: Function -> IO ()
showFun (name, args, body)
  = putStr (numberLines (header : blockLines 1 body ++ ["}"]))
  where
    header = name ++ "(" ++ intercalate ", " args ++ ") {"

showBlock :: Block -> IO ()
showBlock b
  = putStr (numberLines (blockLines 0 b))

numberLines :: [String] -> String
numberLines ls
  = unlines [show n ++ ": " ++ l | (n, l) <- zip [1 :: Int ..] ls]

blockLines :: Int -> Block -> [String]
blockLines indent
  = concatMap (statementLines indent)

statementLines :: Int -> Statement -> [String]
statementLines indent (Assign v e)
  = [tab indent ++ v ++ " = " ++ showExp e]
statementLines indent (If p b1 b2)
  = [tab indent ++ "if (" ++ showExp p ++ ") {"] ++
    blockLines (indent + 1) b1 ++
    elsePart ++
    [tab indent ++ "}"]
  where
    elsePart
      | null b2   = []
      | otherwise = (tab indent ++ "} else {") : blockLines (indent + 1) b2
statementLines indent (DoWhile b p)
  = [tab indent ++ "do {"] ++
    blockLines (indent + 1) b ++
    [tab indent ++ "} while (" ++ showExp p ++ ")"]

tab :: Int -> String
tab n
  = replicate (2 * n) ' '

showExp :: Exp -> String
showExp (Const n)
  = show n
showExp (Var v)
  = v
showExp (Apply op e1 e2)
  = showArg e1 ++ " " ++ showOp op ++ " " ++ showArg e2
  where
    showArg e@(Apply _ _ _) = "(" ++ showExp e ++ ")"
    showArg e               = showExp e
showExp (Phi e1 e2)
  = "PHI(" ++ showExp e1 ++ ", " ++ showExp e2 ++ ")"

showOp :: Op -> String
showOp Add = "+"
showOp Mul = "*"
showOp Eq  = "=="
showOp Gtr = ">"

--------------------------------------------------------------
-- Test data

s1 :: State
s1 = [("x", 7), ("y", 8)]

e1, e2, e3, e4, e5 :: Exp
e1 = Var "x"
e2 = Apply Mul (Apply Add (Var "x") (Const 1)) (Var "y")
e3 = Phi (Const 2) (Const 2)
e4 = Apply Add (Const 0) (Var "x")
e5 = Apply Add (Var "a") (Var "x")

fact :: Function
fact
  = ("fact",
     ["n"],
     [If (Apply Eq (Var "n") (Const 0))
        [Assign "$return" (Const 1)]
        [Assign "prod" (Const 1),
         Assign "i" (Var "n"),
         DoWhile
           [Assign "prod" (Apply Mul (Var "prod") (Var "i")),
            Assign "i" (Apply Add (Var "i") (Const (-1)))
           ]
           (Apply Gtr (Var "i") (Const 0)),
         Assign "$return" (Var "prod")
        ]
     ]
    )

factSSA :: Function
factSSA
  = ("fact",
     ["n"],
     [If (Apply Eq (Var "n") (Const 0))
        [Assign "$return" (Const 1)]
        [Assign "prod0" (Const 1),
         Assign "i0" (Var "n"),
         DoWhile
           [Assign "prod1" (Phi (Var "prod0") (Var "prod2")),
            Assign "i1" (Phi (Var "i0") (Var "i2")),
            Assign "prod2" (Apply Mul (Var "prod1") (Var "i1")),
            Assign "i2" (Apply Add (Var "i1") (Const (-1)))
           ]
           (Apply Gtr (Var "i2") (Const 0)),
         Assign "$return" (Var "prod2")
        ]
     ]
    )

factSSAPropagated :: Function
factSSAPropagated
  = ("fact",
     ["n"],
     [If (Apply Eq (Var "n") (Const 0))
        [Assign "$return" (Const 1)]
        [Assign "i0" (Var "n"),
         DoWhile
           [Assign "prod1" (Phi (Const 1) (Var "prod2")),
            Assign "i1" (Phi (Var "i0") (Var "i2")),
            Assign "prod2" (Apply Mul (Var "prod1") (Var "i1")),
            Assign "i2" (Apply Add (Var "i1") (Const (-1)))
           ]
           (Apply Gtr (Var "i2") (Const 0)),
         Assign "$return" (Var "prod2")
        ]
     ]
    )

factOptimised :: Function
factOptimised
  = ("fact",
     ["n"],
     [If (Apply Eq (Var "n") (Const 0))
        [Assign "$return" (Const 1)]
        [Assign "i0" (Var "n"),
         Assign "prod1" (Const 1),
         Assign "i1" (Var "i0"),
         DoWhile
           [Assign "prod2" (Apply Mul (Var "prod1") (Var "i1")),
            Assign "i2" (Apply Add (Var "i1") (Const (-1))),
            Assign "prod1" (Var "prod2"),
            Assign "i1" (Var "i2")
           ]
           (Apply Gtr (Var "i2") (Const 0)),
         Assign "$return" (Var "prod2")
        ]
     ]
    )

basicBlock :: Function
basicBlock
  = ("basicBlock",
     [],
     [Assign "x" (Const 1),
      Assign "y" (Const 2),
      Assign "x" (Apply Add (Var "x") (Var "y")),
      Assign "y" (Apply Mul (Var "x") (Const 3)),
      Assign "$return" (Var "y")
     ]
    )

basicBlockSSA :: Function
basicBlockSSA
  = ("basicBlock",
     [],
     [Assign "x0" (Const 1),
      Assign "y0" (Const 2),
      Assign "x1" (Apply Add (Var "x0") (Var "y0")),
      Assign "y1" (Apply Mul (Var "x1") (Const 3)),
      Assign "$return" (Var "y1")
     ]
    )

basicBlockOptimised :: Function
basicBlockOptimised
  = ("basicBlock",
     [],
     [Assign "$return" (Const 9)]
    )

example :: Function
example
  = ("example",
     ["x"],
     [Assign "a" (Const 1),
      Assign "b" (Apply Add (Var "x") (Const 2)),
      Assign "c" (Const 3),
      If (Apply Eq (Var "x") (Const 10))
         [Assign "a" (Const 1),
          Assign "c" (Const 5)
         ]
         [],
      Assign "d" (Apply Add (Var "a") (Const 3)),
      Assign "e" (Apply Add (Var "d") (Var "b")),
      Assign "$return" (Apply Add (Var "e") (Var "c"))
     ]
    )

exampleSSA :: Function
exampleSSA
  = ("example",
     ["x"],
     [Assign "a0" (Const 1),
      Assign "b0" (Apply Add (Var "x") (Const 2)),
      Assign "c0" (Const 3),
      If (Apply Eq (Var "x") (Const 10))
         [Assign "a1" (Const 1),
          Assign "c1" (Const 5)
         ]
         [],
      Assign "a2" (Phi (Var "a1") (Var "a0")),
      Assign "c2" (Phi (Var "c1") (Var "c0")),
      Assign "d0" (Apply Add (Var "a2") (Const 3)),
      Assign "e0" (Apply Add (Var "d0") (Var "b0")),
      Assign "$return" (Apply Add (Var "e0") (Var "c2"))
     ]
    )

exampleSSAPropagated :: Function
exampleSSAPropagated
  = ("example",
     ["x"],
     [Assign "b0" (Apply Add (Var "x") (Const 2)),
      If (Apply Eq (Var "x") (Const 10))
         []
         [],
      Assign "c2" (Phi (Const 5) (Const 3)),
      Assign "e0" (Apply Add (Const 4) (Var "b0")),
      Assign "$return" (Apply Add (Var "e0") (Var "c2"))
     ]
    )

exampleOptimised :: Function
exampleOptimised
  = ("example",
     ["x"],
     [Assign "b0" (Apply Add (Var "x") (Const 2)),
      If (Apply Eq (Var "x") (Const 10))
         [Assign "c2" (Const 5)]
         [Assign "c2" (Const 3)],
      Assign "e0" (Apply Add (Const 4) (Var "b0")),
      Assign "$return" (Apply Add (Var "e0") (Var "c2"))
     ]
    )

loop :: Function
loop
  = ("loop",
     ["n"],
     [Assign "i" (Var "n"),
      Assign "k" (Const 0),
      Assign "sum" (Const 0),
      If (Apply Eq (Var "i") (Const 0))
         [Assign "$return" (Const 0)]
         [DoWhile
            [Assign "sum"
               (Apply Add (Var "sum")
                  (Apply Mul
                     (Apply Add (Var "i") (Apply Mul (Const 2) (Var "k")))
                     (Apply Add (Apply Add (Var "i") (Apply Mul (Const 2) (Var "k")))
                                (Const 1)))),
             Assign "i" (Apply Add (Var "i") (Const (-1)))
            ]
            (Apply Gtr (Var "i") (Const 0)),
          Assign "$return" (Var "sum")
         ]
     ]
    )

loopSSA :: Function
loopSSA
  = ("loop",
     ["n"],
     [Assign "i0" (Var "n"),
      Assign "k0" (Const 0),
      Assign "sum0" (Const 0),
      If (Apply Eq (Var "i0") (Const 0))
         [Assign "$return" (Const 0)]
         [DoWhile
            [Assign "sum1" (Phi (Var "sum0") (Var "sum2")),
             Assign "i1" (Phi (Var "i0") (Var "i2")),
             Assign "k1" (Apply Mul (Var "k0") (Const 2)),
             Assign "a0" (Apply Add (Var "i1") (Var "k1")),
             Assign "k2" (Apply Mul (Var "k0") (Const 2)),
             Assign "b0" (Apply Add (Var "k2") (Const 1)),
             Assign "b1" (Apply Add (Var "i1") (Var "b0")),
             Assign "m0" (Apply Mul (Var "a0") (Var "b1")),
             Assign "sum2" (Apply Add (Var "sum1") (Var "m0")),
             Assign "i2" (Apply Add (Var "i1") (Const (-1)))
            ]
            (Apply Gtr (Var "i2") (Const 0)),
          Assign "$return" (Var "sum2")
         ]
     ]
    )

loopSSAPropagated :: Function
loopSSAPropagated
  = ("loop",
     ["n"],
     [Assign "i0" (Var "n"),
      If (Apply Eq (Var "i0") (Const 0))
         [Assign "$return" (Const 0)]
         [DoWhile
            [Assign "sum1" (Phi (Const 0) (Var "sum2")),
             Assign "i1" (Phi (Var "i0") (Var "i2")),
             Assign "a0" (Var "i1"),
             Assign "b1" (Apply Add (Var "i1") (Const 1)),
             Assign "m0" (Apply Mul (Var "a0") (Var "b1")),
             Assign "sum2" (Apply Add (Var "sum1") (Var "m0")),
             Assign "i2" (Apply Add (Var "i1") (Const (-1)))
            ]
            (Apply Gtr (Var "i2") (Const 0)),
          Assign "$return" (Var "sum2")
         ]
     ]
    )

loopOptimised :: Function
loopOptimised
  = ("loop",
     ["n"],
     [Assign "i0" (Var "n"),
      If (Apply Eq (Var "i0") (Const 0))
         [Assign "$return" (Const 0)]
         [Assign "sum1" (Const 0),
          Assign "i1" (Var "i0"),
          DoWhile
            [Assign "a0" (Var "i1"),
             Assign "b1" (Apply Add (Var "i1") (Const 1)),
             Assign "m0" (Apply Mul (Var "a0") (Var "b1")),
             Assign "sum2" (Apply Add (Var "sum1") (Var "m0")),
             Assign "i2" (Apply Add (Var "i1") (Const (-1))),
             Assign "sum1" (Var "sum2"),
             Assign "i1" (Var "i2")
            ]
            (Apply Gtr (Var "i2") (Const 0)),
          Assign "$return" (Var "sum2")
         ]
     ]
    )

max2 :: Function
max2
  = ("max2",
     ["x", "y"],
     [If (Apply Gtr (Var "x") (Var "y"))
         [Assign "m" (Var "x")]
         [Assign "m" (Var "y")],
      Assign "$return" (Var "m")
     ]
    )

max2SSA :: Function
max2SSA
  = ("max2",
     ["x", "y"],
     [If (Apply Gtr (Var "x") (Var "y"))
         [Assign "m0" (Var "x")]
         [Assign "m1" (Var "y")],
      Assign "m2" (Phi (Var "m0") (Var "m1")),
      Assign "$return" (Var "m2")
     ]
    )

max2SSAPropagated :: Function
max2SSAPropagated
  = max2SSA

max2Optimised :: Function
max2Optimised
  = ("max2",
     ["x", "y"],
     [If (Apply Gtr (Var "x") (Var "y"))
         [Assign "m0" (Var "x"),
          Assign "m2" (Var "m0")]
         [Assign "m1" (Var "y"),
          Assign "m2" (Var "m1")],
      Assign "$return" (Var "m2")
     ]
    )

--------------------------------------------------------------
-- Test helpers for Part IV (not part of the original template)

-- True if every variable other than $return is assigned at most once
-- and no operator has a nested operator application as an argument
isSSAForm :: Function -> Bool
isSSAForm (_, args, body)
  = noDuplicates (filter (/= "$return") targets) && all flat (blockExps body)
  where
    targets = args ++ blockTargets body
    noDuplicates vs = length (nub vs) == length vs
    flat (Apply _ a b) = simple a && simple b
    flat (Phi a b) = simple a && simple b
    flat _ = True
    simple (Const _) = True
    simple (Var _) = True
    simple _ = False

blockTargets :: Block -> [Id]
blockTargets = concatMap targets
  where
    targets (Assign v _) = [v]
    targets (If _ b1 b2) = blockTargets b1 ++ blockTargets b2
    targets (DoWhile b _) = blockTargets b

blockExps :: Block -> [Exp]
blockExps = concatMap exps
  where
    exps (Assign _ e) = [e]
    exps (If p b1 b2) = p : blockExps b1 ++ blockExps b2
    exps (DoWhile b p) = p : blockExps b

-- The value a function returns for the given arguments
returnValue :: Function -> [Int] -> Int
returnValue f vs = lookUp "$return" (execFun f vs)
`,
  starter: hs`--------------------------------------------------------------
-- Part I

update :: (Id, Int) -> State -> State
update = undefined

apply :: Op -> Int -> Int -> Int
apply = undefined

eval :: Exp -> State -> Int
eval = undefined

execStatement :: Statement -> State -> State
execStatement = undefined

execBlock :: Block -> State -> State
execBlock = undefined

--------------------------------------------------------------
-- Part II

foldConst :: Exp -> Exp
foldConst = undefined

sub :: Id -> Int -> Exp -> Exp
sub = undefined

propagateConstants :: Block -> Block
propagateConstants = undefined

--------------------------------------------------------------
-- Part III

unPhi :: Block -> Block
unPhi = undefined

--------------------------------------------------------------
-- Part IV (unassessed)

makeSSA :: Function -> Function
makeSSA = undefined
`,
  tasks: [
    {
      id: "update",
      name: "update",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define `update :: (Id, Int) -> State -> State` which gives a variable a new value in a state. If the variable is already in the state, its old binding is replaced. If not, the binding is added.",
        "",
        "```",
        "ghci> s1",
        "[(\"x\",7),(\"y\",8)]",
        "ghci> update (\"x\", 3) s1",
        "[(\"x\",3),(\"y\",8)]",
        "ghci> update (\"z\", 0) s1",
        "[(\"z\",0),(\"x\",7),(\"y\",8)]",
        "```",
        "",
        "The order of the pairs in the resulting state is not important, but each variable must appear only once.",
      ),
      hints: [
        "Throw away any old binding for the variable, then add the new one.",
        "`filter` can remove the old binding: keep the pairs whose first component isn't `v`.",
        "Put the new pair on the front with `:`. This works whether or not the variable was there before.",
        "`update (v, n) s = (v, n) : filter ((/= v) . fst) s`.",
      ],
      solution: hs`update :: (Id, Int) -> State -> State
update (v, n) s = (v, n) : filter ((/= v) . fst) s`,
      tests: [
        { expr: 'update ("x", 3) s1', expected: '[("x",3),("y",8)]', unordered: true },
        { expr: 'update ("z", 0) s1', expected: '[("z",0),("x",7),("y",8)]', unordered: true },
        { expr: 'update ("y", 1) s1', expected: '[("x",7),("y",1)]', unordered: true },
        { expr: 'update ("a", 5) []', expected: '[("a",5)]' },
        { expr: 'length (update ("x", 3) s1)', expected: "2" },
        { expr: 'update ("x", 1) (update ("x", 2) [])', expected: '[("x",1)]' },
      ],
    },
    {
      id: "apply",
      name: "apply",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define `apply :: Op -> Int -> Int -> Int` which applies an operator to two integers. `Add` adds and `Mul` multiplies. `Eq` and `Gtr` are comparisons (`==` and `>`), which give `1` for true and `0` for false.",
        "",
        "```",
        "ghci> apply Add 7 5",
        "12",
        "ghci> apply Gtr 4 9",
        "0",
        "```",
      ),
      hints: [
        "One equation per operator, by pattern matching on the `Op`.",
        "`Add` and `Mul` are just `+` and `*`.",
        "For the comparisons, turn the `Bool` into 0 or 1. Either use `if ... then 1 else 0`, or `fromEnum`, which maps `False` to 0 and `True` to 1.",
        "`apply Eq x y = fromEnum (x == y)` and `apply Gtr x y = fromEnum (x > y)`.",
      ],
      solution: hs`apply :: Op -> Int -> Int -> Int
apply Add x y = x + y
apply Mul x y = x * y
apply Eq x y = fromEnum (x == y)
apply Gtr x y = fromEnum (x > y)`,
      tests: [
        { expr: "apply Add 7 5", expected: "12" },
        { expr: "apply Gtr 4 9", expected: "0" },
        { expr: "apply Gtr 9 4", expected: "1" },
        { expr: "apply Gtr 4 4", expected: "0" },
        { expr: "apply Mul 6 (-7)", expected: "-42" },
        { expr: "apply Eq 3 3", expected: "1" },
        { expr: "apply Eq 3 4", expected: "0" },
        { expr: "apply Add (-1) 1", expected: "0" },
      ],
    },
    {
      id: "eval",
      name: "eval",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define `eval :: Exp -> State -> Int` which works out the value of an expression in a given state. Every variable in the expression is bound in the state, and there are no `Phi`s (they can't be run).",
        "",
        "```",
        "ghci> s1",
        "[(\"x\",7),(\"y\",8)]",
        "ghci> e1",
        "Var \"x\"",
        "ghci> e2",
        "Apply Mul (Apply Add (Var \"x\") (Const 1)) (Var \"y\")",
        "ghci> eval e1 s1",
        "7",
        "ghci> eval e2 s1",
        "64",
        "```",
      ),
      hints: [
        "Recursion on the expression: one equation per constructor (you can leave out `Phi`).",
        "A `Const n` is just `n`, and a `Var v` is looked up in the state with `lookUp`.",
        "For `Apply op e1 e2`, evaluate both sides recursively and combine them with your `apply`.",
        "`eval (Apply op e1 e2) s = apply op (eval e1 s) (eval e2 s)`.",
      ],
      solution: hs`eval :: Exp -> State -> Int
eval (Const n) _ = n
eval (Var v) s = lookUp v s
eval (Apply op e1 e2) s = apply op (eval e1 s) (eval e2 s)`,
      tests: [
        { expr: "eval e1 s1", expected: "7" },
        { expr: "eval e2 s1", expected: "64" },
        { expr: "eval (Const 5) []", expected: "5" },
        { expr: 'eval (Var "y") s1', expected: "8" },
        { expr: 'eval (Apply Eq (Var "x") (Const 7)) s1', expected: "1" },
        { expr: 'eval (Apply Gtr (Var "x") (Var "y")) s1', expected: "0" },
        { expr: 'eval (Apply Add (Apply Mul (Const 2) (Var "x")) (Const (-1))) s1', expected: "13" },
      ],
    },
    {
      id: "exec",
      name: "execStatement and execBlock",
      part: "Part I",
      marks: 7,
      prompt: md(
        "Define two mutually recursive functions (each calls the other, because `If` and `DoWhile` contain blocks):",
        "",
        "```",
        "execStatement :: Statement -> State -> State",
        "execBlock     :: Block -> State -> State",
        "```",
        "",
        "Each returns the state after running the statement or block:",
        "",
        "- `Assign v e`: evaluate `e` and update `v`.",
        "- `If p b1 b2`: if `p` evaluates to 1 run `b1`, if 0 run `b2`.",
        "- `DoWhile b p`: run the body `b`; then test `p` **in the new state**. If it is 1, run the whole loop again from that state; if 0, stop.",
        "- A block runs its statements one after another, each starting from the state the previous one left.",
        "",
        "Test with the given `execFun`, which runs a function's body starting from a state holding its arguments:",
        "",
        "```",
        "ghci> execFun fact [5]",
        "[(\"$return\",120),(\"i\",0),(\"prod\",120),(\"n\",5)]",
        "ghci> execFun loop [4]",
        "[(\"$return\",40),(\"i\",0),(\"sum\",40),(\"k\",0),(\"n\",4)]",
        "ghci> execFun loopOptimised [4]",
        "[(\"$return\",40),(\"i1\",0),(\"sum1\",40),(\"i2\",0),(\"sum2\",40),",
        " (\"m0\",2),(\"b1\",2),(\"a0\",1),(\"i0\",4),(\"n\",4)]",
        "```",
        "",
        "The order of the pairs in the state is unimportant.",
      ),
      hints: [
        "`execStatement` pattern matches on the three kinds of statement. `execBlock` is a simple recursion along the list of statements.",
        "`execBlock [] s = s`. For `st : sts`, run `st` first, then run `sts` starting from the resulting state.",
        "For the loop, give the state after one run of the body a name, `s' = execBlock b s`. Then test `eval p s'`: if it is 1, call `execStatement (DoWhile b p) s'` again; otherwise the answer is `s'`.",
        md(
          "```",
          "execStatement (Assign v e) s = update (v, eval e s) s",
          "execStatement (If p b1 b2) s",
          "  | eval p s == 1 = execBlock b1 s",
          "  | otherwise     = execBlock b2 s",
          "execStatement (DoWhile b p) s",
          "  | eval p s' == 1 = execStatement (DoWhile b p) s'",
          "  | otherwise      = s'",
          "  where s' = execBlock b s",
          "",
          "execBlock [] s = s",
          "execBlock (st : sts) s = execBlock sts (execStatement st s)",
          "```",
        ),
      ],
      solution: hs`execStatement :: Statement -> State -> State
execStatement (Assign v e) s
  = update (v, eval e s) s
execStatement (If p b1 b2) s
  | eval p s == 1 = execBlock b1 s
  | otherwise     = execBlock b2 s
execStatement (DoWhile b p) s
  | eval p s' == 1 = execStatement (DoWhile b p) s'
  | otherwise      = s'
  where
    s' = execBlock b s

execBlock :: Block -> State -> State
execBlock [] s = s
execBlock (st : sts) s = execBlock sts (execStatement st s)`,
      tests: [
        { expr: "execFun fact [5]", expected: '[("$return",120),("i",0),("prod",120),("n",5)]', unordered: true },
        { expr: "execFun loop [4]", expected: '[("$return",40),("i",0),("sum",40),("k",0),("n",4)]', unordered: true },
        {
          expr: "execFun loopOptimised [4]",
          expected: '[("$return",40),("i1",0),("sum1",40),("i2",0),("sum2",40),("m0",2),("b1",2),("a0",1),("i0",4),("n",4)]',
          unordered: true,
        },
        { expr: "execFun fact [0]", expected: '[("$return",1),("n",0)]', unordered: true },
        { expr: "execFun basicBlock []", expected: '[("$return",9),("x",3),("y",9)]', unordered: true },
        { expr: "returnValue example [10]", expected: "21" },
        { expr: "returnValue example [3]", expected: "12" },
        { expr: "returnValue max2 [3, 9]", expected: "9" },
        { expr: 'execStatement (Assign "z" (Const 3)) s1', expected: '[("z",3),("x",7),("y",8)]', unordered: true },
        { expr: "execBlock [] s1", expected: "s1" },
        {
          expr: 'execStatement (DoWhile [Assign "x" (Apply Add (Var "x") (Const 1))] (Const 0)) s1',
          expected: '[("x",8),("y",8)]',
          unordered: true,
          label: "a do-while body runs once even when the condition is false",
        },
        { expr: "returnValue loop [10]", expected: "440" },
      ],
    },
    {
      id: "foldConst",
      name: "foldConst",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define `foldConst :: Exp -> Exp` which simplifies an expression in SSA form (so operator arguments are only constants and variables) using **only** these rules:",
        "",
        "- `PHI(c, c)`, where both arguments are the same constant `c`, becomes `c`.",
        "- `c1 <op> c2`, where both arguments are constants, becomes the constant you get by applying the operator.",
        "- `v + 0` and `0 + v`, where `v` is a variable, become `v`.",
        "",
        "Anything else is returned unchanged. (Don't add other rules such as `1 * x = x`: the auto-tests expect exactly these.)",
        "",
        "```",
        "ghci> e3",
        "Phi (Const 2) (Const 2)",
        "ghci> e4",
        "Apply Add (Const 0) (Var \"x\")",
        "ghci> foldConst e3",
        "Const 2",
        "ghci> foldConst e4",
        "Var \"x\"",
        "```",
      ),
      hints: [
        "Pattern matching on the shape of the expression: one equation per rule, then a catch-all.",
        "Patterns can be nested: `foldConst (Apply op (Const c1) (Const c2)) = ...` matches only when both arguments are constants.",
        "For `PHI(c, c)` you can't repeat a variable in a pattern; match `Phi (Const c1) (Const c2)` with a guard `c1 == c2`. If the guard fails, Haskell moves on to the later equations.",
        md(
          "```",
          "foldConst (Phi (Const c1) (Const c2))",
          "  | c1 == c2 = Const c1",
          "foldConst (Apply op (Const c1) (Const c2)) = Const (apply op c1 c2)",
          "foldConst (Apply Add (Var v) (Const 0)) = Var v",
          "foldConst (Apply Add (Const 0) (Var v)) = Var v",
          "foldConst e = e",
          "```",
        ),
      ],
      solution: hs`foldConst :: Exp -> Exp
foldConst (Phi (Const c1) (Const c2))
  | c1 == c2 = Const c1
foldConst (Apply op (Const c1) (Const c2))
  = Const (apply op c1 c2)
foldConst (Apply Add (Var v) (Const 0))
  = Var v
foldConst (Apply Add (Const 0) (Var v))
  = Var v
foldConst e
  = e`,
      tests: [
        { expr: "foldConst e3", expected: "Const 2" },
        { expr: "foldConst e4", expected: 'Var "x"' },
        { expr: 'foldConst (Apply Add (Var "y") (Const 0))', expected: 'Var "y"' },
        { expr: "foldConst (Apply Mul (Const 3) (Const 3))", expected: "Const 9" },
        { expr: "foldConst (Apply Gtr (Const 3) (Const 5))", expected: "Const 0" },
        { expr: "foldConst (Phi (Const 5) (Const 3))", expected: "Phi (Const 5) (Const 3)" },
        { expr: 'foldConst (Apply Mul (Const 1) (Var "x"))', expected: 'Apply Mul (Const 1) (Var "x")', label: "1 * x is not simplified" },
        { expr: 'foldConst (Apply Add (Var "x") (Const 1))', expected: 'Apply Add (Var "x") (Const 1)' },
        { expr: 'foldConst (Var "z")', expected: 'Var "z"' },
      ],
    },
    {
      id: "sub",
      name: "sub",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define `sub :: Id -> Int -> Exp -> Exp` which replaces every occurrence of the given variable by the given constant in an expression, and then applies `foldConst` to the result.",
        "",
        "```",
        "ghci> e5",
        "Apply Add (Var \"a\") (Var \"x\")",
        "ghci> sub \"a\" 0 e5",
        "Var \"x\"",
        "```",
        "",
        "Substitution must reach inside `Apply` and `Phi`.",
      ),
      hints: [
        "Write a local helper that does the replacing (by recursion on the expression), then apply `foldConst` to its result.",
        "The helper's interesting case is `Var v'`: if `v' == v` it becomes `Const c`. `Apply` and `Phi` rebuild themselves with the helper applied to both arguments.",
        "Everything else (constants, other variables) is unchanged. `foldConst` only needs to be applied once, at the top, because the arguments are just constants and variables in SSA form.",
        md(
          "```",
          "sub v c e = foldConst (replace e)",
          "  where",
          "    replace (Var v') | v' == v = Const c",
          "    replace (Apply op a b) = Apply op (replace a) (replace b)",
          "    replace (Phi a b) = Phi (replace a) (replace b)",
          "    replace other = other",
          "```",
        ),
      ],
      solution: hs`sub :: Id -> Int -> Exp -> Exp
sub v c e = foldConst (replace e)
  where
    replace (Var v')
      | v' == v = Const c
    replace (Apply op e1 e2) = Apply op (replace e1) (replace e2)
    replace (Phi e1 e2) = Phi (replace e1) (replace e2)
    replace other = other`,
      tests: [
        { expr: 'sub "a" 0 e5', expected: 'Var "x"' },
        { expr: 'sub "x" 6 (Apply Add (Var "x") (Const 1))', expected: "Const 7" },
        { expr: 'sub "x" 6 (Apply Add (Var "y") (Const 1))', expected: 'Apply Add (Var "y") (Const 1)' },
        { expr: 'sub "a1" 1 (Phi (Var "a1") (Const 1))', expected: "Const 1" },
        { expr: 'sub "c1" 5 (Phi (Var "c1") (Var "c0"))', expected: 'Phi (Const 5) (Var "c0")' },
        { expr: 'sub "x" 3 (Var "x")', expected: "Const 3" },
        { expr: 'sub "x" 3 (Apply Gtr (Var "x") (Var "x"))', expected: "Const 0" },
        { expr: 'sub "k0" 0 (Apply Mul (Var "k0") (Const 2))', expected: "Const 0" },
      ],
    },
    {
      id: "propagateConstants",
      name: "propagateConstants",
      part: "Part II",
      marks: 7,
      prompt: md(
        "Define `propagateConstants :: Block -> Block` which applies constant propagation and folding to a block in SSA form, until nothing more can be done:",
        "",
        "- Find every assignment `v = c` where `c` is a constant, **including inside `if` branches and loop bodies**. Remove it from the block.",
        "- Substitute `c` for `v` in every expression in the block (using `sub`, which also folds). That may create new constant assignments; deal with those the same way.",
        "- **Exception:** an assignment to `$return` is never removed (the function must return something), though substitutions still happen inside it.",
        "- `If` and `DoWhile` statements stay, even if their blocks become empty. Remember to substitute in their conditions too.",
        "",
        "**Suggested method (worklist).** Write a helper",
        "",
        "```",
        "type Worklist = [(Id, Int)]",
        "scan :: Id -> Int -> Block -> (Worklist, Block)",
        "```",
        "",
        "`scan v c b` substitutes `c` for `v` everywhere in `b`, and returns the list of new constant assignments it found (removing them from the block). Start with a dummy scan, `scan \"$INVALID\" 0 b`, to collect the initial constants. Then repeatedly take one `(v, c)` off the worklist, scan the block with it, and add the newly found constants to the worklist. When the worklist is empty, the block is the answer.",
        "",
        "```",
        "ghci> let (_, _, b) = basicBlockSSA",
        "ghci> let (worklist, modifiedBlock) = scan \"$INVALID\" 0 b",
        "ghci> worklist",
        "[(\"x0\",1),(\"y0\",2)]",
        "ghci> showBlock modifiedBlock",
        "1: x1 = x0 + y0",
        "2: y1 = x1 * 3",
        "3: $return = y1",
        "",
        "ghci> showFun (applyPropagate exampleSSA)",
        "1: example(x) {",
        "2:   b0 = x + 2",
        "3:   if (x == 10) {",
        "4:   }",
        "5:   c2 = PHI(5, 3)",
        "6:   e0 = 4 + b0",
        "7:   $return = e0 + c2",
        "8: }",
        "ghci> applyPropagate loopSSA == loopSSAPropagated",
        "True",
        "```",
      ),
      hints: [
        "Use the worklist method: a `scan` helper that does one substitution over a whole block, and a loop that keeps scanning until the worklist is empty.",
        "`scan v c` goes through the statements one by one and returns a pair (new constants, new block). For `Assign x e`: compute `sub v c e`; if it is `Const n`, return `([(x, n)], [])` (constant found, statement dropped), otherwise keep `Assign x e'`. For `If` and `DoWhile`, scan the inner blocks recursively and `sub` into the condition, collecting the inner worklists.",
        "Match `Assign \"$return\" e` *before* the general `Assign` case and always keep it. If you also returned `$return`'s constant in the worklist, every scan would find it again and the loop would never end.",
        md(
          "```",
          "propagateConstants b = go (scan \"$INVALID\" 0 b)",
          "  where",
          "    go ([], b') = b'",
          "    go ((v, c) : rest, b') = let (new, b'') = scan v c b' in go (rest ++ new, b'')",
          "",
          "scan _ _ [] = ([], [])",
          "scan v c (s : rest) = (found ++ found', kept ++ rest')",
          "  where",
          "    (found, kept) = scanStatement s    -- handles one statement",
          "    (found', rest') = scan v c rest",
          "```",
        ),
      ],
      solution: hs`type Worklist = [(Id, Int)]

propagateConstants :: Block -> Block
propagateConstants b
  = propagate (scan "$INVALID" 0 b)
  where
    propagate ([], b') = b'
    propagate ((v, c) : rest, b')
      = let (new, b'') = scan v c b' in propagate (rest ++ new, b'')

-- Substitute v := c throughout a block. Assignments that become constant
-- are removed and returned in the worklist (except those to $return).
scan :: Id -> Int -> Block -> (Worklist, Block)
scan _ _ [] = ([], [])
scan v c (s : rest) = (found ++ found', kept ++ rest')
  where
    (found, kept) = scanStatement s
    (found', rest') = scan v c rest

    scanStatement (Assign "$return" e)
      = ([], [Assign "$return" (sub v c e)])
    scanStatement (Assign x e)
      = case sub v c e of
          Const n -> ([(x, n)], [])
          e'      -> ([], [Assign x e'])
    scanStatement (If p b1 b2)
      = (w1 ++ w2, [If (sub v c p) b1' b2'])
      where
        (w1, b1') = scan v c b1
        (w2, b2') = scan v c b2
    scanStatement (DoWhile body p)
      = (w, [DoWhile body' (sub v c p)])
      where
        (w, body') = scan v c body`,
      tests: [
        { expr: "applyPropagate basicBlockSSA == basicBlockOptimised", label: "applyPropagate basicBlockSSA == basicBlockOptimised" },
        { expr: "applyPropagate exampleSSA", expected: "exampleSSAPropagated" },
        { expr: "applyPropagate loopSSA == loopSSAPropagated", label: "applyPropagate loopSSA == loopSSAPropagated" },
        { expr: "applyPropagate factSSA", expected: "factSSAPropagated" },
        { expr: "applyPropagate max2SSA", expected: "max2SSAPropagated", label: "nothing to do: max2SSA is unchanged" },
        { expr: "propagateConstants []", expected: "[]" },
        { expr: 'propagateConstants [Assign "$return" (Const 4)]', expected: '[Assign "$return" (Const 4)]', label: "$return = 4 is kept" },
        {
          expr: 'propagateConstants [Assign "a" (Const 2), Assign "$return" (Apply Mul (Var "a") (Var "x"))]',
          expected: '[Assign "$return" (Apply Mul (Const 2) (Var "x"))]',
        },
        {
          expr: 'propagateConstants [If (Var "x") [Assign "a" (Const 1)] [], DoWhile [Assign "b" (Apply Add (Var "a") (Const 1))] (Apply Gtr (Var "b") (Var "x")), Assign "$return" (Var "b")]',
          expected: '[If (Var "x") [] [],DoWhile [] (Apply Gtr (Const 2) (Var "x")),Assign "$return" (Const 2)]',
          label: "constants found in nested blocks propagate everywhere, including loop conditions",
        },
      ],
    },
    {
      id: "unPhi",
      name: "unPhi",
      part: "Part III",
      marks: 3,
      prompt: md(
        "Define `unPhi :: Block -> Block` which removes all phi assignments from a block in SSA form:",
        "",
        "- If an `If` statement is followed by one or more phi assignments, then for each `v = PHI(e1, e2)`, add `v = e1` to the end of the true branch and `v = e2` to the end of the false branch. Delete the phi assignment.",
        "- If a `DoWhile` body *begins* with one or more phi assignments, then for each `v = PHI(e1, e2)`, put `v = e1` just before the loop and `v = e2` at the end of the loop body. Delete the phi assignment.",
        "",
        "Blocks inside `if`s and loops must be processed too.",
        "",
        "```",
        "ghci> showFun max2SSAPropagated",
        "1: max2(x, y) {",
        "2:   if (x > y) {",
        "3:     m0 = x",
        "4:   } else {",
        "5:     m1 = y",
        "6:   }",
        "7:   m2 = PHI(m0, m1)",
        "8:   $return = m2",
        "9: }",
        "ghci> showFun (applyUnPhi max2SSAPropagated)",
        "1: max2(x, y) {",
        "2:   if (x > y) {",
        "3:     m0 = x",
        "4:     m2 = m0",
        "5:   } else {",
        "6:     m1 = y",
        "7:     m2 = m1",
        "8:   }",
        "9:   $return = m2",
        "10: }",
        "ghci> applyUnPhi loopSSAPropagated == loopOptimised",
        "True",
        "ghci> optimise loopSSA == loopOptimised",
        "True",
        "```",
      ),
      hints: [
        "Recursion along the block, with special cases for `If` and `DoWhile`. A helper that splits the phi assignments off the front of a block makes both cases easy.",
        "Helper: `takePhis :: Block -> ([(Id, (Exp, Exp))], Block)`. If the block starts with `Assign v (Phi e1 e2)`, record `(v, (e1, e2))` and continue; otherwise stop and return the rest.",
        "For `If p b1 b2 : rest`, the phis are at the front of `rest`. For `DoWhile body p : rest`, they are at the front of `body`. Remember to call `unPhi` on the inner blocks and on the remaining statements.",
        md(
          "```",
          "unPhi (If p b1 b2 : rest)",
          "  = If p (unPhi b1 ++ [Assign v e1 | (v, (e1, _)) <- phis])",
          "         (unPhi b2 ++ [Assign v e2 | (v, (_, e2)) <- phis]) : unPhi rest'",
          "  where (phis, rest') = takePhis rest",
          "unPhi (DoWhile body p : rest)",
          "  = [Assign v e1 | (v, (e1, _)) <- phis] ++",
          "    DoWhile (unPhi body' ++ [Assign v e2 | (v, (_, e2)) <- phis]) p : unPhi rest",
          "  where (phis, body') = takePhis body",
          "```",
        ),
      ],
      solution: hs`unPhi :: Block -> Block
unPhi []
  = []
unPhi (If p b1 b2 : rest)
  = If p (unPhi b1 ++ firsts phis) (unPhi b2 ++ seconds phis) : unPhi rest'
  where
    (phis, rest') = takePhis rest
unPhi (DoWhile body p : rest)
  = firsts phis ++ DoWhile (unPhi body' ++ seconds phis) p : unPhi rest
  where
    (phis, body') = takePhis body
unPhi (s : rest)
  = s : unPhi rest

-- Split the phi assignments off the front of a block
takePhis :: Block -> ([(Id, (Exp, Exp))], Block)
takePhis (Assign v (Phi e1 e2) : rest)
  = ((v, (e1, e2)) : phis, rest')
  where
    (phis, rest') = takePhis rest
takePhis b
  = ([], b)

firsts :: [(Id, (Exp, Exp))] -> Block
firsts phis = [Assign v e1 | (v, (e1, _)) <- phis]

seconds :: [(Id, (Exp, Exp))] -> Block
seconds phis = [Assign v e2 | (v, (_, e2)) <- phis]`,
      tests: [
        { expr: "applyUnPhi max2SSAPropagated", expected: "max2Optimised" },
        { expr: "applyUnPhi loopSSAPropagated == loopOptimised", label: "applyUnPhi loopSSAPropagated == loopOptimised" },
        { expr: "optimise loopSSA == loopOptimised", label: "optimise loopSSA == loopOptimised" },
        { expr: "applyUnPhi exampleSSAPropagated", expected: "exampleOptimised" },
        { expr: "optimise factSSA", expected: "factOptimised" },
        { expr: "unPhi []", expected: "[]" },
        { expr: 'unPhi [Assign "x" (Const 1)]', expected: '[Assign "x" (Const 1)]' },
        {
          expr: "execFun (optimise loopSSA) [4]",
          expected: '[("$return",40),("i1",0),("sum1",40),("i2",0),("sum2",40),("m0",2),("b1",2),("a0",1),("i0",4),("n",4)]',
          unordered: true,
        },
        { expr: "map (returnValue (optimise factSSA)) [[0], [1], [5]]", expected: "[1, 1, 120]" },
      ],
    },
    {
      id: "makeSSA",
      name: "makeSSA",
      part: "Part IV",
      marks: 0,
      prompt: md(
        "**Unassessed (prize tie-breaker only).** Define `makeSSA :: Function -> Function` which converts a function into SSA form. Include a comment describing your strategy.",
        "",
        "- Each assignment to a variable `x` must target a fresh name (`x0`, `x1`, ...), and later uses of `x` must refer to the latest name. Arguments keep their names, and `$return` is never renamed.",
        "- Nested operator applications must be broken into several assignments to new temporary variables, so that every operator's arguments are constants or variables.",
        "- After an `if`, every variable that ends up with different names on the two branches needs a phi: `x2 = PHI(nameFromTrueBranch, nameFromFalseBranch)`.",
        "- At the start of a `do-while` body, every variable that existed before the loop and is assigned inside it needs a phi: `x1 = PHI(nameBeforeLoop, nameAtEndOfBody)`.",
        "",
        "There is no single right answer, so the tests check properties: the result is in SSA form (checked by the test helper `isSSAForm`), and after `applyUnPhi` it computes the same results as the original. For straight-line code, the natural numbering gives exactly the spec's SSA version:",
        "",
        "```",
        "ghci> makeSSA basicBlock == basicBlockSSA",
        "True",
        "ghci> returnValue (applyUnPhi (makeSSA loop)) [4]",
        "40",
        "```",
      ),
      hints: [
        "Walk through the body once, carrying a state: a table from each source variable to its current SSA name, and a table from each base name to its next unused number. Every helper returns its result plus the updated state.",
        "For expressions, return a pair of (statements needed to compute the nested parts, a flat expression). A nested `Apply` argument becomes a fresh temporary `t0`, `t1`, ... assigned just before.",
        "For an `If`, convert both branches starting from the same names (but share the counter so names stay unique), then compare the two resulting name tables. For a `DoWhile`, first give fresh names to the variables assigned in the body that already exist, convert the body, and only then build the phis: their second arguments are the names at the end of the body.",
        "Write `ssaExp`, `ssaBlock` and `ssaStatement`, each of type `... -> SSAState -> (result, SSAState)`, with `type SSAState = ([(Id, Id)], [(Id, Int)])`. For a loop: `phis = [Assign v' (Phi (Var before) (Var after)) | ...]` and the new loop is `DoWhile (phis ++ body' ++ conditionStatements) condition'`.",
      ],
      solution: hs`-- Strategy: walk the body once, threading an SSA state:
--   * a table from each source variable to its current SSA name
--   * a table from each base name to the next unused version number
-- Every assignment gets a fresh name (x0, x1, ...). Nested operator
-- applications are broken up using fresh temporaries t0, t1, ...
-- After an If, each variable whose name differs between the two branches
-- gets a phi. At the top of a do-while loop, each variable that existed
-- before the loop and is assigned in its body gets a fresh name; its phi's
-- second argument is the name it has at the end of the converted body.
type SSAState = ([(Id, Id)], [(Id, Int)])

makeSSA :: Function -> Function
makeSSA (name, args, body)
  = (name, args, body')
  where
    (body', _) = ssaBlock body ([(a, a) | a <- args], [])

ssaFresh :: Id -> SSAState -> (Id, SSAState)
ssaFresh v (env, next)
  = (v ++ show n, (env, update (v, n + 1) next))
  where
    n = fromMaybe 0 (lookup v next)

ssaBind :: Id -> Id -> SSAState -> SSAState
ssaBind v v' (env, next)
  = ((v, v') : filter ((/= v) . fst) env, next)

-- The statements needed to compute the nested parts of an expression,
-- and an expression whose operator arguments are constants or variables
ssaExp :: Exp -> SSAState -> ([Statement], Exp, SSAState)
ssaExp (Var v) st@(env, _)
  = ([], Var (fromMaybe v (lookup v env)), st)
ssaExp (Apply op e1 e2) st
  = (ss1 ++ ss2, Apply op a1 a2, st2)
  where
    (ss1, a1, st1) = ssaArg e1 st
    (ss2, a2, st2) = ssaArg e2 st1
ssaExp e st
  = ([], e, st)

-- Like ssaExp, but an operator application is stored in a new temporary
ssaArg :: Exp -> SSAState -> ([Statement], Exp, SSAState)
ssaArg e st
  = case ssaExp e st of
      (ss, e'@(Apply _ _ _), st1) ->
        let (t, st2) = ssaFresh "t" st1
        in (ss ++ [Assign t e'], Var t, st2)
      flat -> flat

ssaBlock :: Block -> SSAState -> (Block, SSAState)
ssaBlock [] st
  = ([], st)
ssaBlock (s : rest) st
  = (b1 ++ b2, st2)
  where
    (b1, st1) = ssaStatement s st
    (b2, st2) = ssaBlock rest st1

ssaStatement :: Statement -> SSAState -> (Block, SSAState)
ssaStatement (Assign "$return" e) st
  = (ss ++ [Assign "$return" e'], st1)
  where
    (ss, e', st1) = ssaExp e st
ssaStatement (Assign v e) st
  = (ss ++ [Assign v' e'], ssaBind v v' st2)
  where
    (ss, e', st1) = ssaExp e st
    (v', st2) = ssaFresh v st1
ssaStatement (If p b1 b2) st
  = (ss ++ [If p' b1' b2'] ++ phis, st3)
  where
    (ss, p', st0@(env0, _)) = ssaExp p st
    (b1', (env1, next1)) = ssaBlock b1 st0
    (b2', (env2, next2)) = ssaBlock b2 (env0, next1)
    changed = [(v, Var x1, Var x2) | (v, x1) <- reverse env1,
                                      Just x2 <- [lookup v env2], x1 /= x2]
    (phis, st3) = ssaPhis changed (env2, next2)
ssaStatement (DoWhile body p) st@(env0, _)
  = ([DoWhile (phis ++ body' ++ ss) p'], st3)
  where
    carried = nub [v | v <- blockTargets body, isJust (lookup v env0)]
    (heads, st1) = ssaFreshAll carried st
    (body', st2) = ssaBlock body st1
    (ss, p', st3@(env3, _)) = ssaExp p st2
    phis = [Assign v' (Phi (Var (lookUp v env0)) (Var (lookUp v env3)))
           | (v, v') <- heads]

ssaFreshAll :: [Id] -> SSAState -> ([(Id, Id)], SSAState)
ssaFreshAll [] st
  = ([], st)
ssaFreshAll (v : vs) st
  = ((v, v') : rest, st2)
  where
    (v', st1) = ssaFresh v st
    (rest, st2) = ssaFreshAll vs (ssaBind v v' st1)

ssaPhis :: [(Id, Exp, Exp)] -> SSAState -> (Block, SSAState)
ssaPhis [] st
  = ([], st)
ssaPhis ((v, e1, e2) : rest) st
  = (Assign v' (Phi e1 e2) : more, st2)
  where
    (v', st1) = ssaFresh v st
    (more, st2) = ssaPhis rest (ssaBind v v' st1)`,
      tests: [
        { expr: "makeSSA basicBlock == basicBlockSSA", label: "makeSSA basicBlock == basicBlockSSA" },
        { expr: "all isSSAForm (map makeSSA [basicBlock, example, loop, max2, fact])", label: "every converted example is in SSA form" },
        { expr: "returnValue (applyUnPhi (makeSSA loop)) [4]", expected: "40" },
        { expr: "map (returnValue (applyUnPhi (makeSSA loop))) [[0], [1], [6]]", expected: "map (returnValue loop) [[0], [1], [6]]" },
        { expr: "map (returnValue (applyUnPhi (makeSSA fact))) [[0], [1], [5]]", expected: "[1, 1, 120]" },
        { expr: "map (\\x -> returnValue (applyUnPhi (makeSSA example)) [x]) [3, 10]", expected: "[12, 21]" },
        { expr: "map (returnValue (applyUnPhi (makeSSA max2))) [[3, 9], [9, 3]]", expected: "[9, 9]" },
        { expr: "returnValue (optimise (makeSSA loop)) [5]", expected: "70", label: "makeSSA then optimise still computes loop correctly" },
        { expr: "optimise (makeSSA basicBlock)", expected: "basicBlockOptimised" },
      ],
    },
  ],
};
