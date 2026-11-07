import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "y2015",
  year: 2015,
  title: "Functions, Procedures and Memoisation",
  summary: "Write an interpreter for a tiny programming language with functions, procedures, loops and global memo tables, then translate functions into memoised procedures.",
  skills: [
    "association lists as a variable store",
    "recursion over an expression tree",
    "mutual recursion",
    "folding over a list of statements",
    "threading state through a computation",
    "list comprehensions with patterns",
    "Maybe and lookup",
  ],
  story: md(
    "In this paper you write an **interpreter**: a Haskell program that runs programs written in another, tiny language. The tiny programs are not text; they are Haskell values (trees of constructors) that describe the program. Your job is to say what they compute.",
    "",
    "**Memoisation** is the motivation. Take the Fibonacci numbers 1, 1, 2, 3, 5, 8, ... where each is the sum of the previous two:",
    "",
    "```",
    "fib n = if n < 3 then 1 else fib (n - 1) + fib (n - 2)",
    "```",
    "",
    "`fib 35` takes ages, because `fib 33` gets computed twice, `fib 32` three times, and so on. Memoising means keeping a table of answers already computed: before computing `fib k`, look in the table; if it's there, reuse it. Each `fib k` is then computed once. Doing that needs a table that changes as the program runs, which is why the tiny language has *procedures* with variables you can update.",
    "",
    "**Values.** The language has only two kinds of value: whole numbers, written `I 5`, and arrays of whole numbers, written as a list of (index, value) pairs: `A [(0,4),(1,2),(2,7)]` is the array `[4,2,7]`. Any index not mentioned holds 0. There are no Booleans: true is `I 1` and false is `I 0`.",
    "",
    "**Expressions** (the 'pure function' part):",
    "",
    "```",
    "Const v              a constant value",
    "Var \"x\"              the value of variable x",
    "OpApp op e1 e2       apply +, *, <, == or array indexing",
    "Cond p e1 e2         if p then e1 else e2",
    "FunApp \"f\" [e1, e2]  call the function f with these arguments",
    "```",
    "",
    "**State.** To evaluate `Var \"x\"` you need to know what `x` currently holds. The **state** is a list of bindings, each a variable name with its scope and value:",
    "",
    "```",
    "[(\"x\", (Local, I 5)), (\"y\", (Global, I 2)), (\"a\", (Global, A [(0,4),(1,2),(2,7)]))]",
    "```",
    "",
    "A **local** variable belongs to the procedure that's running. A **global** variable is shared by all procedures (the memo tables will be globals).",
    "",
    "**Procedures** are like Java methods: a name, argument names, and a block (list) of statements that are executed one after another, each one changing the state:",
    "",
    "```",
    "Assign \"x\" e           x = e",
    "AssignA \"a\" i e        a[i] = e",
    "If p b1 b2             if (p) { b1 } else { b2 }",
    "While p b              while (p) { b }",
    "Call \"x\" \"p\" [e1, e2]  x := p(e1, e2)    (\"\" instead of \"x\" if no result is kept)",
    "Return e               return e   (stores the value in the special local variable \"$res\")",
    "```",
    "",
    "**Calling a procedure** is the subtle part. The called procedure sees only its own arguments (as locals) plus the globals; it can't see the caller's locals. When it finishes, the caller keeps its own locals, takes the (possibly changed) globals from the procedure's final state, and, if a result was wanted, stores `$res` in the named variable.",
    "",
    "### The given types",
    "",
    "```",
    "type Id = String",
    "data Value = I Int | A [(Int, Int)]",
    "data Op = Add | Mul | Less | Equal | Index",
    "data Exp = Const Value | Var Id | OpApp Op Exp Exp | Cond Exp Exp Exp | FunApp Id [Exp]",
    "type FunDef = (Id, ([Id], Exp))           -- name, (argument names, body)",
    "data Scope = Local | Global",
    "type Binding = (Id, (Scope, Value))",
    "type State = [Binding]",
    "type Block = [Statement]",
    "data Statement = Assign Id Exp | AssignA Id Exp Exp | If Exp Block Block",
    "               | While Exp Block | Call Id Id [Exp] | Return Exp",
    "type ProcDef = (Id, ([Id], Block))        -- name, (argument names, body)",
    "```",
    "",
    "Given helpers: `lookUp` (like `lookup` but with a helpful error), `intToExp`, `listToExp`, `listToVal`, and `memoise` (builds a table-manager procedure). Given test data: `sampleState`, `e1`..`e5`, the definitions `biggest`, `fib`, `sumA`, `gAdd`, `sumA'`, `fibTableManager`, `fibM`, `testFun`, and the runners `execSumA'`, `execGlobalSumA'`, `execFibM`.",
  ),
  notes: md(
    "**Where the marks are.** Part I is 8 marks of small utilities, Part II is 12 (with `eval` worth 8), Part III (`executeStatement`/`executeBlock`) is 8. Part IV (`translate'`) is only 2 and hard.",
    "",
    "**Order of attack.** Do everything in order: each part uses the previous one. Test `eval` on `e1`..`e5` before starting Part III. In Part III get `Assign`, `If`, `While` and `Return` working first (they're short), then `AssignA`, then `Call`.",
    "",
    "**Traps.**",
    "",
    "- `updateVar` must keep the variable's existing scope, and add a *Local* binding at the end only when the variable isn't there.",
    "- `assignArray` must not leave two entries for the same index: remove the old one.",
    "- Indexing an array at a missing index gives `I 0`, not an error.",
    "- In `eval` for `FunApp`, put the argument bindings *in front of* the state (`bindArgs as vs ++ s`) so they hide any variable with the same name.",
    "- `Call` is where the marks go: the procedure runs in `bindArgs args values ++ getGlobals s`; afterwards the state is `getLocals s ++ getGlobals final`, then update `x` with `$res` if `x` isn't `\"\"`.",
    "- `While` must re-check the condition after every pass of the body.",
    "",
    "**Short of time?** Skip Part IV. It's 2 marks out of 30.",
  ),
  setup: hs`import Data.Maybe (fromMaybe)

type Id = String

data Value = I Int | A [(Int, Int)]
           deriving (Eq, Show)

data Op = Add | Mul | Less | Equal | Index
          deriving (Eq, Show)

data Exp = Const Value |
           Var Id |
           OpApp Op Exp Exp |
           Cond Exp Exp Exp |
           FunApp Id [Exp]
         deriving (Eq, Show)

type FunDef = (Id, ([Id], Exp))

data Scope = Local | Global
           deriving (Eq, Show)

type Binding = (Id, (Scope, Value))

type State = [Binding]

type Block = [Statement]

data Statement = Assign Id Exp |
                 AssignA Id Exp Exp |
                 If Exp Block Block |
                 While Exp Block |
                 Call Id Id [Exp] |
                 Return Exp
               deriving (Eq, Show)

type ProcDef = (Id, ([Id], Block))

------------------------------------------------------------------------
-- Predefined functions

lookUp :: (Eq a, Show a) => a -> [(a, b)] -> b
lookUp x t
  = fromMaybe (error ("\nAttempt to lookUp " ++ show x ++
                      " in a table that only has the bindings: " ++
                      show (map fst t)))
              (lookup x t)

-- Turns an Int into an Exp...
intToExp :: Int -> Exp
intToExp n
  = Const (I n)

-- Turns a [Int] into an Exp...
listToExp :: [Int] -> Exp
listToExp
  = Const . listToVal

-- Turns a [Int] into a Value...
listToVal :: [Int] -> Value
listToVal xs
  = A (zip [0..] xs)

memoise :: Id -> Id -> Id -> Id -> Id -> ProcDef
memoise p a f pt mt
  = (p,
     ([a], [If (OpApp Equal (OpApp Index (Var pt) (Var a)) (Const (I 0)))
               [Call "x" f [Var a],
                AssignA pt (Var a) (Const (I 1)),
                AssignA mt (Var a) (Var "x")
               ]
               [],
            Return (OpApp Index (Var mt) (Var a))
           ]
     )
    )

-- Part IV: the top-level translator
translate :: FunDef -> Id -> [(Id, Id)] -> ProcDef
translate (name, (as, e)) newName nameMap
  = (newName, (as, b ++ [Return e']))
  where
    (b, e', ids') = translate' e nameMap ['$' : show n | n <- [1..]]

------------------------------------------------------------------------
-- Test helper (not part of the original template): equal as sets
sameElems :: Eq a => [a] -> [a] -> Bool
sameElems xs ys
  = length xs == length ys && all (\x -> elem x ys) xs && all (\y -> elem y xs) ys

------------------------------------------------------------------------
-- Example states, expressions, functions and procedures

sampleState :: State
sampleState
  = [("x", (Local, I 5)), ("y", (Global, I 2)), ("a", (Global, listToVal [4,2,7]))]

fibState :: State
fibState
  = [("fibPres", (Global, A [])), ("fibTab", (Global, A []))]

sampleArray :: Exp
sampleArray
  = listToExp [9,5,7,1]

e1, e2, e3, e4, e5 :: Exp
e1 = Const (I 1)
e2 = Var "y"
e3 = OpApp Add (Var "x") (Const (I 2))
e4 = Cond (Const (I 1)) (Var "x") (Const (I 9))
e5 = FunApp "fib" [Const (I 6)]

-- biggest(m, n) = if m < n then n else m
biggest :: FunDef
biggest
  = ("biggest",
     (["m", "n"], Cond (OpApp Less (Var "m") (Var "n"))
                       (Var "n")
                       (Var "m")
     )
    )

-- fib(n) = if n < 3 then 1 else fib(n - 1) + fib(n - 2)
fib :: FunDef
fib
  = ("fib",
     (["n"], Cond (OpApp Less (Var "n") (Const (I 3)))
                  (Const (I 1))
                  (OpApp Add (FunApp "fib" [OpApp Add (Var "n") (Const (I (-1)))])
                             (FunApp "fib" [OpApp Add (Var "n") (Const (I (-2)))]))
     )
    )

-- sumA(a, n) = if n < 0 then 0 else a[n] + sumA(a, n - 1)
sumA :: FunDef
sumA
  = ("sumA",
     (["a", "n"], Cond (OpApp Less (Var "n") (Const (I 0)))
                       (Const (I 0))
                       (OpApp Add (OpApp Index (Var "a") (Var "n"))
                                  (FunApp "sumA"
                                          [Var "a", OpApp Add (Var "n")
                                                              (Const (I (-1)))]))
     )
    )

-- isEven(n) = if n == 0 then 1 else (if isEven(n - 1) == 1 then 0 else 1)
testFun :: FunDef
testFun
  = ("testFun",
     (["n"], Cond (OpApp Equal (Var "n") (Const (I 0)))
                  (Const (I 1))
                  (Cond (OpApp Equal (FunApp "testFun" [OpApp Add (Var "n") (Const (I (-1)))])
                                     (Const (I 1)))
                        (Const (I 0))
                        (Const (I 1)))
     )
    )

-- gAdd(x, y) { gSum = x + y; }
gAdd :: ProcDef
gAdd
  = ("gAdd",
     (["x", "y"], [Assign "gSum" (OpApp Add (Var "x") (Var "y"))])
    )

-- sumA'(a, n) { s = 0; i = 0; limit = n + 1;
--               while (i < limit) { s = s + a[i]; i = i + 1 }
--               return s; }
sumA' :: ProcDef
sumA'
  = ("sumA'",
     (["a", "n"], [Assign "s" (Const (I 0)),
                   Assign "i" (Const (I 0)),
                   Assign "limit" (OpApp Add (Var "n") (Const (I 1))),
                   While (OpApp Less (Var "i") (Var "limit"))
                         [Assign "s" (OpApp Add (Var "s")
                                                (OpApp Index (Var "a") (Var "i"))),
                          Assign "i" (OpApp Add (Var "i") (Const (I 1)))
                         ],
                   Return (Var "s")]
     )
    )

fibTableManager :: ProcDef
fibTableManager
  = memoise "fibTableManager" "n" "fibM" "fibPres" "fibTab"

fibM :: ProcDef
fibM
  = ("fibM",
     (["n"], [If (OpApp Less (Var "n") (Const (I 3)))
                 [Assign "$3" (Const (I 1))]
                 [Call "$1" "fibTableManager" [OpApp Add (Var "n") (Const (I (-1)))],
                  Call "$2" "fibTableManager" [OpApp Add (Var "n") (Const (I (-2)))],
                  Assign "$3" (OpApp Add (Var "$1") (Var "$2"))
                 ],
              Return (Var "$3")
             ]
     )
    )

fibMGenerator :: ProcDef
fibMGenerator
  = translate fib "fibM" [("fib", "fibTableManager")]

execSumA' :: [Int] -> Int -> State
execSumA' xs n
  = executeBlock [Call "s" "sumA'" [listToExp xs, intToExp n]] [] [sumA'] []

execGlobalSumA' :: [Int] -> Int -> State
execGlobalSumA' xs n
  = executeBlock [Call "s" "sumA'" [listToExp xs, intToExp n]] [] [sumA']
                 [("s", (Global, I 0))]

execFibM :: Int -> State
execFibM n
  = executeBlock [Call "f" "fibM" [intToExp n]] [] [fibM, fibTableManager] fibState
`,
  starter: hs`------------------------------------------------------------------------
-- Part I

getValue :: Id -> State -> Value
getValue = undefined

getLocals, getGlobals :: State -> State
getLocals = undefined

getGlobals = undefined

assignArray :: Value -> Value -> Value -> Value
assignArray = undefined

updateVar :: (Id, Value) -> State -> State
updateVar = undefined

------------------------------------------------------------------------
-- Part II

applyOp :: Op -> Value -> Value -> Value
applyOp = undefined

bindArgs :: [Id] -> [Value] -> State
bindArgs = undefined

eval :: Exp -> [FunDef] -> State -> Value
eval = undefined

evalArgs :: [Exp] -> [FunDef] -> State -> [Value]
evalArgs = undefined

------------------------------------------------------------------------
-- Part III

executeStatement :: Statement -> [FunDef] -> [ProcDef] -> State -> State
executeStatement = undefined

executeBlock :: Block -> [FunDef] -> [ProcDef] -> State -> State
executeBlock = undefined

------------------------------------------------------------------------
-- Part IV

translate' :: Exp -> [(Id, Id)] -> [Id] -> (Block, Exp, [Id])
translate' = undefined
`,
  tasks: [
    {
      id: "getValue",
      name: "getValue",
      part: "Part I",
      marks: 1,
      prompt: md(
        "Define `getValue :: Id -> State -> Value` which uses the given `lookUp` to find the value of a variable in a state, ignoring its scope. Precondition: the variable has a binding in the state.",
        "",
        "```",
        "ghci> getValue \"x\" sampleState",
        "I 5",
        "```",
      ),
      hints: [
        "`lookUp x s` gives you the pair `(scope, value)` for `x`.",
        "You want the second component of that pair.",
        "`snd` takes the second component of a pair.",
        "`getValue x s = snd (lookUp x s)`",
      ],
      solution: hs`getValue :: Id -> State -> Value
-- Pre: x is bound in the state
getValue x s
  = snd (lookUp x s)`,
      tests: [
        { expr: 'getValue "x" sampleState', expected: "I 5" },
        { expr: 'getValue "y" sampleState', expected: "I 2" },
        { expr: 'getValue "a" sampleState', expected: "A [(0,4),(1,2),(2,7)]" },
        { expr: 'getValue "v" [("v", (Global, I 0))]', expected: "I 0" },
        { expr: 'getValue "x" [("x", (Local, I 1)), ("x", (Global, I 2))]', expected: "I 1", label: "the leftmost binding wins" },
        { expr: 'getValue "fibTab" fibState', expected: "A []" },
      ],
    },
    {
      id: "getLocalsGlobals",
      name: "getLocals / getGlobals",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define `getLocals, getGlobals :: State -> State` which return the local and the global bindings of a state respectively, in the order they appear.",
        "",
        "```",
        "ghci> getLocals sampleState",
        "[(\"x\",(Local,I 5))]",
        "ghci> getGlobals sampleState",
        "[(\"y\",(Global,I 2)),(\"a\",(Global,A [(0,4),(1,2),(2,7)]))]",
        "```",
      ),
      hints: [
        "Each is a filter on the state.",
        "A binding looks like `(name, (scope, value))`. You want to keep it when `scope` is `Local` (or `Global`).",
        "A list comprehension can match the scope constructor directly in the pattern: bindings that don't match are skipped.",
        "`getLocals s = [b | b@(_, (Local, _)) <- s]` and the same with `Global`.",
      ],
      solution: hs`getLocals, getGlobals :: State -> State
getLocals s
  = [b | b@(_, (Local, _)) <- s]

getGlobals s
  = [b | b@(_, (Global, _)) <- s]`,
      tests: [
        { expr: "getLocals sampleState", expected: '[("x",(Local,I 5))]' },
        { expr: "getGlobals sampleState", expected: '[("y",(Global,I 2)),("a",(Global,A [(0,4),(1,2),(2,7)]))]' },
        { expr: "getLocals []", expected: "[]" },
        { expr: "getLocals fibState", expected: "[]" },
        { expr: "getGlobals fibState", expected: "fibState" },
        {
          expr: 'getLocals [("p",(Local,I 1)),("q",(Global,I 2)),("r",(Local,I 3))]',
          expected: '[("p",(Local,I 1)),("r",(Local,I 3))]',
          label: "order is preserved",
        },
      ],
    },
    {
      id: "assignArray",
      name: "assignArray",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define `assignArray :: Value -> Value -> Value -> Value` so that `assignArray a i v` is the array `a` with element `i` set to `v` (`a` is an `A`, `i` and `v` are `I`s). The order of the pairs in the array doesn't matter, but no index may appear more than once.",
        "",
        "```",
        "ghci> assignArray (getValue \"a\" sampleState) (I 2) (I 1)",
        "A [(2,1),(0,4),(1,2)]",
        "```",
        "",
        "(any order of those three pairs is fine)",
      ),
      hints: [
        "Pattern match the three arguments as `A elems`, `I i` and `I v`.",
        "Remove any existing pair for index `i`, then add the new pair `(i, v)`.",
        "`filter ((/= i) . fst) elems` keeps the pairs whose index isn't `i`.",
        "`assignArray (A elems) (I i) (I v) = A ((i, v) : filter ((/= i) . fst) elems)`",
      ],
      solution: hs`assignArray :: Value -> Value -> Value -> Value
assignArray (A elems) (I i) (I v)
  = A ((i, v) : filter ((/= i) . fst) elems)`,
      tests: [
        { expr: 'let A es = assignArray (getValue "a" sampleState) (I 2) (I 1) in sameElems es [(2,1),(0,4),(1,2)]', label: 'assignArray (getValue "a" sampleState) (I 2) (I 1) is A [(2,1),(0,4),(1,2)] in some order' },
        { expr: "assignArray (A []) (I 3) (I 8)", expected: "A [(3,8)]" },
        { expr: "let A es = assignArray (A [(0,1),(1,2)]) (I 5) (I 6) in sameElems es [(0,1),(1,2),(5,6)]", label: "new index is added" },
        { expr: "let A es = assignArray (A [(0,1),(1,2)]) (I 0) (I 9) in sameElems es [(0,9),(1,2)]", label: "existing index is replaced, not duplicated" },
        { expr: "let A es = assignArray (A [(4,4)]) (I 4) (I 4) in es", expected: "[(4,4)]" },
        { expr: "let A es = assignArray (assignArray (A []) (I 1) (I 1)) (I 1) (I 2) in es", expected: "[(1,2)]" },
      ],
    },
    {
      id: "updateVar",
      name: "updateVar",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define `updateVar :: (Id, Value) -> State -> State` which changes the value of a variable in a state, **keeping its scope**. If the variable has no binding, add a new binding with `Local` scope.",
        "",
        "```",
        "ghci> updateVar (\"x\", I 6) sampleState",
        "[(\"x\",(Local,I 6)),(\"y\",(Global,I 2)),(\"a\",(Global,A [(0,4),(1,2),(2,7)]))]",
        "ghci> updateVar (\"z\", I 3) [(\"g\", (Global, I 8))]",
        "[(\"g\",(Global,I 8)),(\"z\",(Local,I 3))]",
        "```",
        "",
        "The order of the bindings doesn't matter, except when the variable has two or more bindings: then the updated binding must be to the left of any others that remain (so `lookUp` finds it). Only the leftmost binding's scope counts.",
      ),
      hints: [
        "Simplest: walk along the state recursively and replace the first binding with the right name.",
        "Base case: reaching the end of the list without finding the name means it's new: the result is `[(x, (Local, v))]`, which adds it at the end.",
        "When the names match, keep that binding's scope: `(x, (scope, v)) : rest`. Leave the rest alone (there may be a hidden global with the same name further on, which must survive).",
        md(
          "```",
          "updateVar (x, v) [] = [(x, (Local, v))]",
          "updateVar (x, v) (b@(y, (scope, _)) : bs)",
          "  | x == y    = (x, (scope, v)) : bs",
          "  | otherwise = b : updateVar (x, v) bs",
          "```",
        ),
      ],
      solution: hs`updateVar :: (Id, Value) -> State -> State
updateVar (x, v) []
  = [(x, (Local, v))]
updateVar (x, v) (b@(y, (scope, _)) : bs)
  | x == y    = (x, (scope, v)) : bs
  | otherwise = b : updateVar (x, v) bs`,
      tests: [
        { expr: 'updateVar ("x", I 6) sampleState', expected: '[("x",(Local,I 6)),("y",(Global,I 2)),("a",(Global,A [(0,4),(1,2),(2,7)]))]' },
        { expr: 'updateVar ("z", I 3) [("g", (Global, I 8))]', expected: '[("g",(Global,I 8)),("z",(Local,I 3))]' },
        { expr: 'updateVar ("q", I 1) []', expected: '[("q",(Local,I 1))]' },
        {
          expr: 'sameElems (updateVar ("y", I 9) sampleState) [("x",(Local,I 5)),("y",(Global,I 9)),("a",(Global,A [(0,4),(1,2),(2,7)]))]',
          label: "a global keeps its Global scope",
        },
        {
          expr: 'sameElems (updateVar ("a", I 0) sampleState) [("x",(Local,I 5)),("y",(Global,I 2)),("a",(Global,I 0))]',
          label: "no duplicate binding is left behind",
        },
        {
          expr: 'lookup "x" (updateVar ("x", I 1) [("x",(Local,I 5)),("x",(Global,I 2))])',
          expected: "Just (Local,I 1)",
          label: "with two bindings, the updated one is found first",
        },
        { expr: 'length (updateVar ("n", I 4) sampleState)', expected: "4" },
      ],
    },
    {
      id: "applyOp",
      name: "applyOp",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define `applyOp :: Op -> Value -> Value -> Value` which applies an operator to two values. `Add`, `Mul`, `Less` and `Equal` take two integers; `Less` and `Equal` give `I 1` for true and `I 0` for false. `Index` takes an array and an integer index, and gives `I 0` if the array has no entry for that index.",
        "",
        "```",
        "ghci> applyOp Add (I 6) (I (-2))",
        "I 4",
        "ghci> applyOp Mul (I 3) (I 4)",
        "I 12",
        "ghci> applyOp Less (I 7) (I 0)",
        "I 0",
        "ghci> applyOp Equal (I 2) (I 2)",
        "I 1",
        "ghci> applyOp Index (A [(1,1),(0,3)]) (I 0)",
        "I 3",
        "ghci> applyOp Index (A [(1,1),(0,3)]) (I 2)",
        "I 0",
        "```",
      ),
      hints: [
        "One equation per operator, pattern matching on the `I` and `A` constructors to get at the numbers.",
        "For `Less` and `Equal`, compute a Haskell `Bool` and turn it into `I 1` or `I 0` with `if ... then ... else`.",
        "For `Index`, `lookup i elems` gives `Maybe Int`. `fromMaybe 0` (already imported) turns `Nothing` into 0.",
        md(
          "```",
          "applyOp Add (I a) (I b)       = I (a + b)",
          "applyOp Mul (I a) (I b)       = I (a * b)",
          "applyOp Less (I a) (I b)      = I (if a < b then 1 else 0)",
          "applyOp Equal (I a) (I b)     = I (if a == b then 1 else 0)",
          "applyOp Index (A elems) (I i) = I (fromMaybe 0 (lookup i elems))",
          "```",
        ),
      ],
      solution: hs`applyOp :: Op -> Value -> Value -> Value
applyOp Add (I a) (I b)       = I (a + b)
applyOp Mul (I a) (I b)       = I (a * b)
applyOp Less (I a) (I b)      = I (if a < b then 1 else 0)
applyOp Equal (I a) (I b)     = I (if a == b then 1 else 0)
applyOp Index (A elems) (I i) = I (fromMaybe 0 (lookup i elems))`,
      tests: [
        { expr: "applyOp Add (I 6) (I (-2))", expected: "I 4" },
        { expr: "applyOp Mul (I 3) (I 4)", expected: "I 12" },
        { expr: "applyOp Less (I 7) (I 0)", expected: "I 0" },
        { expr: "applyOp Less (I 0) (I 7)", expected: "I 1" },
        { expr: "applyOp Equal (I 2) (I 2)", expected: "I 1" },
        { expr: "applyOp Equal (I 2) (I 3)", expected: "I 0" },
        { expr: "applyOp Index (A [(1,1),(0,3)]) (I 0)", expected: "I 3" },
        { expr: "applyOp Index (A [(1,1),(0,3)]) (I 2)", expected: "I 0" },
        { expr: "applyOp Index (A []) (I 0)", expected: "I 0" },
        { expr: "applyOp Less (I 4) (I 4)", expected: "I 0" },
      ],
    },
    {
      id: "bindArgs",
      name: "bindArgs",
      part: "Part II",
      marks: 1,
      prompt: md(
        "Define `bindArgs :: [Id] -> [Value] -> State` which pairs up variable names with values, making each a `Local` binding. Precondition: the two lists have the same length.",
        "",
        "```",
        "ghci> bindArgs [\"x\", \"a\"] [I 6, A [(1,1),(0,3)]]",
        "[(\"x\",(Local,I 6)),(\"a\",(Local,A [(1,1),(0,3)]))]",
        "```",
      ),
      hints: [
        "Walk down both lists together.",
        "`zip` pairs them up; `zipWith` pairs them up and applies a function to each pair.",
        "The function to apply builds `(x, (Local, v))` from `x` and `v`.",
        "`bindArgs xs vs = zipWith (\\x v -> (x, (Local, v))) xs vs`",
      ],
      solution: hs`bindArgs :: [Id] -> [Value] -> State
-- Pre: the lists have the same length
bindArgs
  = zipWith (\x v -> (x, (Local, v)))`,
      tests: [
        { expr: 'bindArgs ["x", "a"] [I 6, A [(1,1),(0,3)]]', expected: '[("x",(Local,I 6)),("a",(Local,A [(1,1),(0,3)]))]' },
        { expr: "bindArgs [] []", expected: "[]" },
        { expr: 'bindArgs ["n"] [I 0]', expected: '[("n",(Local,I 0))]' },
        { expr: 'bindArgs ["p", "q", "r"] [I 1, I 2, I 3]', expected: '[("p",(Local,I 1)),("q",(Local,I 2)),("r",(Local,I 3))]' },
        { expr: 'map fst (bindArgs ["b", "a"] [I 0, I 0])', expected: '["b","a"]' },
        { expr: 'getLocals (bindArgs ["u"] [A []])', expected: '[("u",(Local,A []))]' },
      ],
    },
    {
      id: "eval",
      name: "eval / evalArgs",
      part: "Part II",
      marks: 8,
      prompt: md(
        "Define two mutually recursive functions:",
        "",
        "```",
        "eval     :: Exp -> [FunDef] -> State -> Value",
        "evalArgs :: [Exp] -> [FunDef] -> State -> [Value]",
        "```",
        "",
        "`eval e fs s` evaluates `e` using the function definitions `fs` and state `s`. `evalArgs` evaluates each expression in a list. Rules:",
        "",
        "- `Const v` has value `v`.",
        "- `Var x` has the value of `x` in the state (use `getValue`).",
        "- `Cond p e1 e2`: evaluate `p`; if it's `I 1` the value is that of `e1`, otherwise (`I 0`) that of `e2`.",
        "- `OpApp op a b`: evaluate `a` and `b` and use `applyOp`.",
        "- `FunApp f es`: look up `f` in `fs` to get `(as, body)` (argument names and body). Evaluate the arguments `es` with `evalArgs`, bind them to `as` with `bindArgs`, and evaluate `body` in the state made by putting those bindings in front of the current state (`++`).",
        "",
        "```",
        "ghci> eval (Const (I 1)) [] sampleState",
        "I 1",
        "ghci> eval (Var \"y\") [] sampleState",
        "I 2",
        "ghci> eval (OpApp Add (Var \"x\") (Const (I 2))) [] sampleState",
        "I 7",
        "ghci> eval (Cond (Const (I 1)) (Var \"x\") (Const (I 9))) [] sampleState",
        "I 5",
        "ghci> eval (FunApp \"fib\" [Const (I 6)]) [fib] sampleState",
        "I 8",
        "```",
        "",
        "These test expressions are `e1`..`e5` in the template.",
      ),
      hints: [
        "Structural recursion: one equation of `eval` per constructor of `Exp`. `evalArgs` is just a `map` that calls `eval`.",
        "For `Cond`, compare the predicate's value with `I 1` (Value has `Eq`). For `FunApp`, use a `where` clause: `(as, body) = lookUp f fs`.",
        "The new bindings must go on the *left*: `bindArgs as (evalArgs es fs s) ++ s`. That way the function's arguments hide any variables with the same names.",
        md(
          "```",
          "eval (Const v) _ _       = v",
          "eval (Var x) _ s         = getValue x s",
          "eval (Cond p e1 e2) fs s",
          "  | eval p fs s == I 1   = eval e1 fs s",
          "  | otherwise            = eval e2 fs s",
          "eval (OpApp op a b) fs s = applyOp op (eval a fs s) (eval b fs s)",
          "eval (FunApp f es) fs s  = eval body fs (bindArgs as (evalArgs es fs s) ++ s)",
          "  where (as, body) = lookUp f fs",
          "",
          "evalArgs es fs s = map (\\e -> eval e fs s) es",
          "```",
        ),
      ],
      solution: hs`eval :: Exp -> [FunDef] -> State -> Value
eval (Const v) _ _
  = v
eval (Var x) _ s
  = getValue x s
eval (Cond p e1 e2) fs s
  | eval p fs s == I 1 = eval e1 fs s
  | otherwise          = eval e2 fs s
eval (OpApp op a b) fs s
  = applyOp op (eval a fs s) (eval b fs s)
eval (FunApp f es) fs s
  = eval body fs (bindArgs as (evalArgs es fs s) ++ s)
  where
    (as, body) = lookUp f fs

evalArgs :: [Exp] -> [FunDef] -> State -> [Value]
evalArgs es fs s
  = map (\e -> eval e fs s) es`,
      tests: [
        { expr: "eval e1 [] sampleState", expected: "I 1" },
        { expr: "eval e2 [] sampleState", expected: "I 2" },
        { expr: "eval e3 [] sampleState", expected: "I 7" },
        { expr: "eval e4 [] sampleState", expected: "I 5" },
        { expr: "eval e5 [fib] sampleState", expected: "I 8" },
        { expr: "eval (Cond (Const (I 0)) (Var \"x\") (Const (I 9))) [] sampleState", expected: "I 9" },
        { expr: 'eval (OpApp Index (Var "a") (Const (I 2))) [] sampleState', expected: "I 7" },
        { expr: 'eval (FunApp "biggest" [Var "x", Const (I 8)]) [biggest] sampleState', expected: "I 8" },
        { expr: 'eval (FunApp "sumA" [Var "a", Const (I 2)]) [sumA] sampleState', expected: "I 13" },
        { expr: 'eval (FunApp "biggest" [Var "y", Var "x"]) [biggest] [("x",(Local,I 3)),("y",(Local,I 4)),("m",(Global,I 100))]', expected: "I 4", label: "arguments hide variables of the same name" },
        { expr: "evalArgs [e1, e2, e3] [] sampleState", expected: "[I 1,I 2,I 7]" },
        { expr: "evalArgs [] [] []", expected: "[]" },
      ],
    },
    {
      id: "execute",
      name: "executeStatement / executeBlock",
      part: "Part III",
      marks: 8,
      prompt: md(
        "Define two mutually recursive functions which run statements, turning an input state into an output state:",
        "",
        "```",
        "executeStatement :: Statement -> [FunDef] -> [ProcDef] -> State -> State",
        "executeBlock     :: Block -> [FunDef] -> [ProcDef] -> State -> State",
        "```",
        "",
        "`executeBlock` runs the statements of a block one after another. The rules for each statement:",
        "",
        "- `Assign x e`: set `x` to the value of `e` (with `updateVar`, which creates a new local if `x` isn't bound).",
        "- `AssignA a i e`: the array `a` is in scope. Set element `i` of it to `e`, using `assignArray` and `updateVar`.",
        "- `If p b1 b2`: run block `b1` if `p` is `I 1`, else block `b2`.",
        "- `While p b`: while `p` is `I 1`, run `b`, re-checking `p` each time.",
        "- `Return e`: set the special local variable `\"$res\"` to the value of `e`.",
        "- `Call x p es`: look up procedure `p` to get `(as, body)`. Run `body` in a fresh state made of the arguments (`bindArgs as` of the evaluated `es`, on the left) plus the caller's **globals** only. Call the final state `s'`. The state after the call is the caller's **locals** followed by the **globals of `s'`**. If `x` is not `\"\"`, then also set `x` to the value of `\"$res\"` in `s'`.",
        "",
        "```",
        "ghci> executeBlock [Call \"s\" \"sumA'\" [sampleArray, intToExp 3]] [] [sumA'] []",
        "[(\"s\",(Local,I 22))]",
        "ghci> execSumA' [9,5,7,1] 3",
        "[(\"s\",(Local,I 22))]",
        "ghci> executeBlock [Call \"s\" \"sumA'\" [sampleArray, intToExp 3]] [] [sumA'] [(\"s\", (Global, I 0))]",
        "[(\"s\",(Global,I 22))]",
        "ghci> execGlobalSumA' [9,5,7,1] 3",
        "[(\"s\",(Global,I 22))]",
        "```",
        "",
        "Then enjoy memoisation: `executeBlock [Return (FunApp \"fib\" [intToExp 35])] [fib] [] []` takes forever, but `execFibM 35` is instant and binds `f` to `I 9227465`, with the global tables `fibPres` and `fibTab` filled in.",
      ),
      hints: [
        "`executeBlock` is a left fold over the statements: `foldl (\\st stmt -> executeStatement stmt fs ps st) s b`. `executeStatement` has one equation per constructor of `Statement`.",
        "`While` can call itself: if the condition holds, run the body once and then execute the *same* `While` statement on the new state; otherwise return the state unchanged.",
        "For `Call` use a `where` clause: `(as, body) = lookUp p ps`, `s' = executeBlock body fs ps (bindArgs as (evalArgs es fs s) ++ getGlobals s)`, `back = getLocals s ++ getGlobals s'`. Evaluate the arguments in the *caller's* state `s`.",
        md(
          "```",
          "executeStatement (Assign x e) fs _ s = updateVar (x, eval e fs s) s",
          "executeStatement (AssignA a i e) fs _ s",
          "  = updateVar (a, assignArray (getValue a s) (eval i fs s) (eval e fs s)) s",
          "executeStatement (If p b1 b2) fs ps s",
          "  | eval p fs s == I 1 = executeBlock b1 fs ps s",
          "  | otherwise          = executeBlock b2 fs ps s",
          "executeStatement w@(While p b) fs ps s",
          "  | eval p fs s == I 1 = executeStatement w fs ps (executeBlock b fs ps s)",
          "  | otherwise          = s",
          "executeStatement (Call x p es) fs ps s",
          "  | null x    = back",
          "  | otherwise = updateVar (x, getValue \"$res\" s') back",
          "  where ...  -- as in hint 3",
          "executeStatement (Return e) fs _ s = updateVar (\"$res\", eval e fs s) s",
          "```",
        ),
      ],
      solution: hs`executeStatement :: Statement -> [FunDef] -> [ProcDef] -> State -> State
executeStatement (Assign x e) fs _ s
  = updateVar (x, eval e fs s) s
executeStatement (AssignA a i e) fs _ s
  = updateVar (a, assignArray (getValue a s) (eval i fs s) (eval e fs s)) s
executeStatement (If p b1 b2) fs ps s
  | eval p fs s == I 1 = executeBlock b1 fs ps s
  | otherwise          = executeBlock b2 fs ps s
executeStatement w@(While p b) fs ps s
  | eval p fs s == I 1 = executeStatement w fs ps (executeBlock b fs ps s)
  | otherwise          = s
executeStatement (Call x p es) fs ps s
  | null x    = back
  | otherwise = updateVar (x, getValue "$res" s') back
  where
    (as, body) = lookUp p ps
    -- The procedure sees its arguments and the globals, nothing else
    s'   = executeBlock body fs ps (bindArgs as (evalArgs es fs s) ++ getGlobals s)
    -- Back in the caller: its own locals plus the updated globals
    back = getLocals s ++ getGlobals s'
executeStatement (Return e) fs _ s
  = updateVar ("$res", eval e fs s) s

executeBlock :: Block -> [FunDef] -> [ProcDef] -> State -> State
executeBlock b fs ps s
  = foldl (\st stmt -> executeStatement stmt fs ps st) s b`,
      tests: [
        { expr: "executeBlock [Call \"s\" \"sumA'\" [sampleArray, intToExp 3]] [] [sumA'] []", expected: '[("s",(Local,I 22))]' },
        { expr: "execSumA' [9,5,7,1] 3", expected: '[("s",(Local,I 22))]' },
        { expr: "execGlobalSumA' [9,5,7,1] 3", expected: '[("s",(Global,I 22))]' },
        { expr: 'executeBlock [Return (FunApp "fib" [intToExp 10])] [fib] [] []', expected: '[("$res",(Local,I 55))]' },
        { expr: 'getValue "f" (execFibM 35)', expected: "I 9227465" },
        { expr: 'applyOp Index (getValue "fibTab" (execFibM 35)) (I 30)', expected: "I 832040", label: "the memo table is filled in" },
        { expr: 'let A ps = getValue "fibPres" (execFibM 35) in sameElems ps [(k, 1) | k <- [1 .. 34]]', label: "fibPres has a 1 for every index 1..34" },
        {
          expr: 'getValue "i" (executeBlock [Assign "i" (intToExp 0), While (OpApp Less (Var "i") (intToExp 5)) [Assign "i" (OpApp Add (Var "i") (intToExp 1))]] [] [] [])',
          expected: "I 5",
          label: "a while loop counting to 5",
        },
        {
          expr: 'executeBlock [If (OpApp Equal (Var "x") (intToExp 5)) [Assign "r" (intToExp 1)] [Assign "r" (intToExp 2)]] [] [] [("x",(Local,I 5))]',
          expected: '[("x",(Local,I 5)),("r",(Local,I 1))]',
        },
        {
          expr: 'let A es = getValue "a" (executeBlock [AssignA "a" (intToExp 1) (intToExp 9)] [] [] sampleState) in sameElems es [(0,4),(1,9),(2,7)]',
          label: "AssignA updates one element of an array",
        },
        {
          expr: 'sameElems (executeBlock [Assign "t" (intToExp 1), Call "" "gAdd" [Var "t", intToExp 2]] [] [gAdd] [("gSum",(Global,I 0))]) [("t",(Local,I 1)),("gSum",(Global,I 3))]',
          label: "a procedure can change a global",
        },
        {
          expr: 'executeBlock [Assign "t" (intToExp 1), Call "" "gAdd" [Var "t", intToExp 2]] [] [gAdd] []',
          expected: '[("t",(Local,I 1))]',
          label: "the procedure's own locals vanish after the call",
        },
        {
          expr: 'sameElems (executeBlock [Assign "k" (intToExp 3), Call "m" "sumA\'" [listToExp [1,2,3], Var "k"]] [] [sumA\'] []) [("k",(Local,I 3)),("m",(Local,I 6))]',
          label: "the caller's locals survive a call",
        },
        {
          expr: 'executeBlock [Call "" "setG" [intToExp 5]] [] [("setG", (["g"], [Assign "g" (intToExp 7)]))] [("g",(Global,I 1))]',
          expected: '[("g",(Global,I 1))]',
          label: "an argument hides a global with the same name",
        },
      ],
    },
    {
      id: "translate",
      name: "translate'",
      part: "Part IV",
      marks: 2,
      prompt: md(
        "The given `translate` turns a pure function into a memoised procedure:",
        "",
        "```",
        "translate :: FunDef -> Id -> [(Id, Id)] -> ProcDef",
        "translate (name, (as, e)) newName nameMap",
        "  = (newName, (as, b ++ [Return e']))",
        "  where",
        "    (b, e', ids') = translate' e nameMap ['$' : show n | n <- [1..]]",
        "```",
        "",
        "Define `translate' :: Exp -> [(Id, Id)] -> [Id] -> (Block, Exp, [Id])`. Given an expression, a table mapping memoised function names to the procedure to call instead (e.g. `[(\"fib\", \"fibTableManager\")]`), and an infinite list of fresh variable names (`\"$1\"`, `\"$2\"`, ...), it returns:",
        "",
        "1. a block of statements to run first (`[]` if the expression contains no memoised calls),",
        "2. an expression that, evaluated after that block, gives the value of the original expression,",
        "3. the fresh names not yet used.",
        "",
        "What has to happen:",
        "",
        "- A call to a memoised function becomes a procedure `Call` that stores its result in a fresh variable; the expression becomes `Var` of that variable.",
        "- A `Cond` whose parts produced any statements becomes an `If` statement; each arm assigns its result to the same fresh variable.",
        "- If nothing needed translating, the block is `[]` and the expression is returned unchanged.",
        "",
        "For `fib`, `translate fib \"fibM\" [(\"fib\", \"fibTableManager\")]` should behave like `fibM`:",
        "",
        "```",
        "(\"fibM\", ([\"n\"],",
        "  [If (OpApp Less (Var \"n\") (Const (I 3)))",
        "      [Assign \"$3\" (Const (I 1))]",
        "      [Call \"$1\" \"fibTableManager\" [OpApp Add (Var \"n\") (Const (I (-1)))],",
        "       Call \"$2\" \"fibTableManager\" [OpApp Add (Var \"n\") (Const (I (-2)))],",
        "       Assign \"$3\" (OpApp Add (Var \"$1\") (Var \"$2\"))],",
        "   Return (Var \"$3\")]))",
        "```",
        "",
        "Your fresh names may differ; the tests check that the generated procedures compute the right answers. (`fibMGenerator` is that translation, defined in the template.)",
      ),
      hints: [
        "Recursion over `Exp`, threading the list of fresh names through like the state-number counter in a fold: each recursive call returns the names it didn't use, which you pass to the next call.",
        "`Const` and `Var` give `([], e, ids)`. `OpApp op a b`: translate `a`, then `b` with the leftover names; concatenate the blocks and rebuild `OpApp op a' b'`. For `FunApp f es` write a helper that translates a list of arguments the same way.",
        "For `FunApp f es`, after translating the arguments: if `lookup f nameMap` is `Just p`, take a fresh name `v` and return `(argBlock ++ [Call v p args'], Var v, rest)`. For `Cond p t e`: translate all three; if all three blocks are empty return `Cond p' t' e'` unchanged; otherwise take a fresh `r` and return `(bp ++ [If p' (bt ++ [Assign r t']) (be ++ [Assign r e'])], Var r, rest)`.",
        md(
          "```",
          "translate' (Cond p t e) nm ids",
          "  | all null [bp, bt, be] = ([], Cond p' t' e', ids3)",
          "  | otherwise = (bp ++ [If p' (bt ++ [Assign r t']) (be ++ [Assign r e'])], Var r, ids4)",
          "  where",
          "    (bp, p', ids1) = translate' p nm ids",
          "    (bt, t', ids2) = translate' t nm ids1",
          "    (be, e', ids3) = translate' e nm ids2",
          "    (r : ids4)     = ids3",
          "```",
        ),
      ],
      solution: hs`translate' :: Exp -> [(Id, Id)] -> [Id] -> (Block, Exp, [Id])
translate' (OpApp op a b) nameMap ids
  = (ba ++ bb, OpApp op a' b', ids2)
  where
    (ba, a', ids1) = translate' a nameMap ids
    (bb, b', ids2) = translate' b nameMap ids1
translate' (Cond p t e) nameMap ids
  | all null [bp, bt, be] = ([], Cond p' t' e', ids3)
  | otherwise
      = (bp ++ [If p' (bt ++ [Assign r t']) (be ++ [Assign r e'])], Var r, ids4)
  where
    (bp, p', ids1) = translate' p nameMap ids
    (bt, t', ids2) = translate' t nameMap ids1
    (be, e', ids3) = translate' e nameMap ids2
    (r : ids4)     = ids3
translate' (FunApp f es) nameMap ids
  = case lookup f nameMap of
      Just p  -> (b ++ [Call v p es'], Var v, ids'')
      Nothing -> (b, FunApp f es', ids')
  where
    (b, es', ids') = translateArgs es nameMap ids
    (v : ids'')    = ids'
translate' e _ ids
  = ([], e, ids)

-- Translate a list of expressions, threading the fresh names through
translateArgs :: [Exp] -> [(Id, Id)] -> [Id] -> (Block, [Exp], [Id])
translateArgs [] _ ids
  = ([], [], ids)
translateArgs (e : es) nameMap ids
  = (b ++ bs, e' : es', ids2)
  where
    (b, e', ids1)   = translate' e nameMap ids
    (bs, es', ids2) = translateArgs es nameMap ids1`,
      tests: [
        {
          expr: 'getValue "f" (executeBlock [Call "f" "fibM" [intToExp 30]] [] [fibMGenerator, fibTableManager] fibState)',
          expected: "I 832040",
          label: "fibMGenerator computes fib 30 with memoisation",
        },
        {
          expr: '[ getValue "f" (executeBlock [Call "f" "fibM" [intToExp n]] [] [fibMGenerator, fibTableManager] fibState) | n <- [1 .. 8] ]',
          expected: "map I [1,1,2,3,5,8,13,21]",
        },
        {
          expr: 'translate biggest "bigP" []',
          expected: '("bigP", (["m","n"], [Return (Cond (OpApp Less (Var "m") (Var "n")) (Var "n") (Var "m"))]))',
          label: "no memoised calls: empty block, expression unchanged",
        },
        {
          expr: 'let (b, e, _) = translate\' (OpApp Add (Var "x") (intToExp 1)) [("fib", "fibTM")] ["$1"] in (b, e)',
          expected: '([], OpApp Add (Var "x") (Const (I 1)))',
        },
        {
          expr: 'case translate\' (FunApp "fib" [Var "n"]) [("fib", "fibTM")] ["$1", "$2"] of { ([Call v "fibTM" [Var "n"]], Var v\', _) -> v == v\'; _ -> False }',
          label: "a memoised call becomes a Call whose result variable is returned",
        },
        {
          expr: 'let (_, _, rest) = translate\' (FunApp "g" [Var "n"]) [("fib", "fibTM")] ["$1", "$2"] in rest',
          expected: '["$1","$2"]',
          label: "unused fresh names are handed back",
        },
        {
          expr: '[ getValue "r" (executeBlock [Call "r" "evenM" [intToExp n]] [] [translate testFun "evenM" [("testFun", "evenTM")], memoise "evenTM" "n" "evenM" "evenPres" "evenTab"] [("evenPres",(Global,A [])),("evenTab",(Global,A []))]) | n <- [0, 1, 7, 10] ]',
          expected: "[I 1,I 0,I 0,I 1]",
          label: "memoised call inside the predicate of a nested Cond (testFun)",
        },
        {
          expr: 'getValue "r" (executeBlock [Call "r" "sumAM" [listToExp [3,1,4,1,5], intToExp 4]] [sumA] [translate sumA "sumAM" []] [])',
          expected: "I 14",
          label: "non-memoised recursive calls are left as FunApp",
        },
      ],
    },
  ],
};
