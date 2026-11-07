import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "m07",
  year: 0,
  difficulty: 7,
  minutes: 75,
  title: "Mini paper 7: Calculator with variables",
  summary:
    "Arithmetic expressions as a tree: evaluate them in an environment (failing safely on unknown variables), collect their variables, simplify them with fixed rules, print them, and partially evaluate them.",
  skills: [
    "recursive data types (expression trees)",
    "one equation per constructor",
    "Maybe for failure, with case expressions",
    "lookup tables (environments)",
    "nub to remove duplicates",
    "bottom-up rewriting with nested patterns",
    "building strings recursively",
  ],
  story: md(
    "This paper is the first one shaped exactly like the real tests that are about *programs*: a small language is described as a Haskell data type, and you write the functions that run it, inspect it, rewrite it and print it. Almost every real paper has a part like this, so it is worth getting fluent here.",
    "",
    "**The domain.** A pocket calculator that understands **variables**. You can type `(x + 1) * y`, and the calculator works out the answer once it knows what `x` and `y` stand for. The table that says what each variable stands for is called an **environment**, for example `x = 5, y = 2, z = -3`. With that environment, `(x + 1) * y` is `12`. If an expression mentions a variable that is *not* in the environment (say `w`), there is no answer: the calculator reports failure instead of crashing.",
    "",
    "**Expressions are trees.** Brackets and precedence disappear once an expression is stored as a tree. `2 + 3 * 4` means `2 + (3 * 4)`, which is this tree:",
    "",
    "```",
    "      +",
    "     / \\",
    "    2   *",
    "       / \\",
    "      3   4",
    "```",
    "",
    "Every node is either a leaf (a number or a variable) or an operator with sub-trees below it. Functions over trees are naturally recursive: to handle a `+` node, handle its two children (recursively) and combine the results.",
    "",
    "**Simplifying.** `1 * x + 0 * y` is just `x`. A simplifier rewrites an expression into a smaller one that always has the same value, using a fixed list of rules such as `e + 0 = e`. You will apply the rules **bottom-up**: simplify the children first, then look at the node itself.",
    "",
    "### The given types",
    "",
    "```haskell",
    "data Op = Add | Sub | Mul",
    "",
    "data Expr = Num Int",
    "          | Var String",
    "          | BinOp Op Expr Expr",
    "          | Neg Expr",
    "",
    "type Env = [(String, Int)]",
    "```",
    "",
    "- `Op` is one of the three operators `+`, `-` and `*`.",
    "- `Num 7` is the number 7 and `Var \"x\"` is the variable `x`.",
    "- `BinOp Add e1 e2` is `e1 + e2` (likewise `Sub` is `e1 - e2` and `Mul` is `e1 * e2`). The order of the children matters for `Sub`.",
    "- `Neg e` is `-e`, the negation of `e`.",
    "- An `Env` lists each variable with its value, e.g. `[(\"x\",5),(\"y\",2)]`. Each variable appears at most once.",
    "",
    "So `(x + 1) * y` is `BinOp Mul (BinOp Add (Var \"x\") (Num 1)) (Var \"y\")`.",
    "",
    "Given to you: `opSymbol` (the printed symbol of each operator), the environment `env1` and the example expressions `e1` to `e6`:",
    "",
    "```",
    "e1 = 2 + 3 * 4          e4 = -(y + x)",
    "e2 = (x + 1) * y        e5 = 1 * x + 0 * y",
    "e3 = x - w * 0          e6 = x * y + x * 3",
    "```",
  ),
  notes: md(
    "**Where the marks are.** Part I (the evaluator) is 5 marks, Part II (working on trees) is 10 and Part III is 3. `simplify` is the biggest single task (4 marks).",
    "",
    "**Order of attack.** Do `applyOp` first: `eval`, `simplify` and `partialEval` all use it. Then `eval`, `vars` and `showExpr`, which all have the same shape (one equation per constructor, recurse into children). Leave `simplify` until you are warmed up, and finish with `partialEval`, which is short once `simplify` works.",
    "",
    "**Traps.**",
    "",
    "- `eval` must return `Nothing` if *any* variable in the expression is unbound, even one that would be multiplied by zero (`eval e3 env1` is `Nothing`).",
    "- `vars` must not list a variable twice.",
    "- `simplify` must use exactly the rules given and no others (for example, no `x - x = 0`), or the auto-tests will disagree with you. Always simplify the children *before* looking at the node.",
    "- Subtraction is not symmetric: `0 - e` is **not** simplified to `e`.",
    "",
    "**Testing.** Write each example from the prompts into GHCi. For `simplify`, a good self-check is that simplifying never changes the value: `eval (simplify e) env1 == eval e env1` for every example without unbound variables.",
  ),
  setup: hs`import Data.List
import Data.Maybe

data Op = Add | Sub | Mul
        deriving (Eq, Show)

data Expr = Num Int
          | Var String
          | BinOp Op Expr Expr
          | Neg Expr
          deriving (Eq, Show)

type Env = [(String, Int)]

opSymbol :: Op -> String
opSymbol Add = "+"
opSymbol Sub = "-"
opSymbol Mul = "*"

--------------------------------------------------------------
-- Example data

env1 :: Env
env1 = [("x", 5), ("y", 2), ("z", -3)]

-- 2 + 3 * 4
e1 :: Expr
e1 = BinOp Add (Num 2) (BinOp Mul (Num 3) (Num 4))

-- (x + 1) * y
e2 :: Expr
e2 = BinOp Mul (BinOp Add (Var "x") (Num 1)) (Var "y")

-- x - w * 0
e3 :: Expr
e3 = BinOp Sub (Var "x") (BinOp Mul (Var "w") (Num 0))

-- -(y + x)
e4 :: Expr
e4 = Neg (BinOp Add (Var "y") (Var "x"))

-- 1 * x + 0 * y
e5 :: Expr
e5 = BinOp Add (BinOp Mul (Num 1) (Var "x")) (BinOp Mul (Num 0) (Var "y"))

-- x * y + x * 3
e6 :: Expr
e6 = BinOp Add (BinOp Mul (Var "x") (Var "y")) (BinOp Mul (Var "x") (Num 3))
`,
  starter: hs`--------------------------------------------------------------
-- Part I

applyOp :: Op -> Int -> Int -> Int
applyOp = undefined

eval :: Expr -> Env -> Maybe Int
eval = undefined

--------------------------------------------------------------
-- Part II

vars :: Expr -> [String]
vars = undefined

showExpr :: Expr -> String
showExpr = undefined

simplify :: Expr -> Expr
simplify = undefined

--------------------------------------------------------------
-- Part III

partialEval :: Env -> Expr -> Expr
partialEval = undefined
`,
  tasks: [
    {
      id: "applyOp",
      name: "applyOp",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `applyOp :: Op -> Int -> Int -> Int` that applies an operator to two integers: `Add` adds, `Sub` subtracts the second from the first, and `Mul` multiplies. For example:",
        "",
        "```",
        "ghci> applyOp Add 7 5",
        "12",
        "ghci> applyOp Sub 7 5",
        "2",
        "ghci> applyOp Mul 7 5",
        "35",
        "```",
      ),
      hints: [
        "One equation per operator, by pattern matching on the `Op`.",
        "Each right-hand side is a single Haskell arithmetic operator.",
        "Watch the order for `Sub`: `applyOp Sub x y` is `x - y`, not `y - x`.",
        md(
          "```",
          "applyOp Add x y = x + y",
          "applyOp Sub x y = x - y",
          "applyOp Mul x y = x * y",
          "```",
        ),
      ],
      solution: hs`applyOp :: Op -> Int -> Int -> Int
applyOp Add x y = x + y
applyOp Sub x y = x - y
applyOp Mul x y = x * y`,
      tests: [
        { expr: "applyOp Add 7 5", expected: "12" },
        { expr: "applyOp Sub 7 5", expected: "2" },
        { expr: "applyOp Sub 5 7", expected: "-2" },
        { expr: "applyOp Mul 7 5", expected: "35" },
        { expr: "applyOp Mul (-3) 4", expected: "-12" },
        { expr: "applyOp Add 0 0", expected: "0" },
      ],
    },
    {
      id: "eval",
      name: "eval",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define a function `eval :: Expr -> Env -> Maybe Int` that computes the value of an expression, looking up each variable in the environment. If **any** variable in the expression is not in the environment, the result is `Nothing`; otherwise it is `Just` the value. For example:",
        "",
        "```",
        "ghci> eval e1 env1",
        "Just 14",
        "ghci> eval e2 env1",
        "Just 12",
        "ghci> eval e4 env1",
        "Just (-7)",
        "ghci> eval e3 env1",
        "Nothing",
        "```",
        "",
        "Note that `eval e3 env1` is `Nothing` even though the unbound `w` is multiplied by zero.",
      ),
      hints: [
        "One equation per constructor of `Expr`. `Num n` is always `Just n`.",
        "For `Var x`, the Prelude function `lookup :: Eq a => a -> [(a, b)] -> Maybe b` already returns exactly what you need.",
        "For `Neg e` and `BinOp op e1 e2`, evaluate the children recursively, then use `case` to look inside the `Maybe` results. Matching on a pair `(eval e1 env, eval e2 env)` handles both children at once.",
        md(
          "```",
          "eval (BinOp op e1 e2) env",
          "  = case (eval e1 env, eval e2 env) of",
          "      (Just a, Just b) -> Just (applyOp op a b)",
          "      _                -> Nothing",
          "```",
        ),
      ],
      solution: hs`eval :: Expr -> Env -> Maybe Int
eval (Num n) _ = Just n
eval (Var x) env = lookup x env
eval (Neg e) env
  = case eval e env of
      Just n  -> Just (negate n)
      Nothing -> Nothing
eval (BinOp op e1 e2) env
  = case (eval e1 env, eval e2 env) of
      (Just a, Just b) -> Just (applyOp op a b)
      _                -> Nothing`,
      tests: [
        { expr: "eval e1 env1", expected: "Just 14" },
        { expr: "eval e2 env1", expected: "Just 12" },
        { expr: "eval e4 env1", expected: "Just (-7)" },
        { expr: "eval e3 env1", expected: "Nothing" },
        { expr: "eval e6 env1", expected: "Just 25" },
        { expr: "eval e2 []", expected: "Nothing" },
        { expr: "eval (Num 9) []", expected: "Just 9" },
        { expr: 'eval (BinOp Sub (Var "z") (Neg (Var "y"))) env1', expected: "Just (-1)" },
        { expr: 'eval (Neg (Var "q")) env1', expected: "Nothing" },
      ],
    },
    {
      id: "vars",
      name: "vars",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define a function `vars :: Expr -> [String]` that returns the names of all the variables that appear in an expression. Each name must appear only once in the result. For example:",
        "",
        "```",
        "ghci> vars e2",
        "[\"x\",\"y\"]",
        "ghci> vars e6",
        "[\"x\",\"y\"]",
        "ghci> vars e3",
        "[\"x\",\"w\"]",
        "ghci> vars e1",
        "[]",
        "```",
        "",
        "The order of the names in the result does not matter.",
      ),
      hints: [
        "First write a version that may contain duplicates, then remove them.",
        "Recursion on the expression: a `Num` has no variables, a `Var x` has just `[x]`, and the other cases collect the variables of their children (use `++` for `BinOp`).",
        "`nub` from `Data.List` (already imported) removes duplicates from a list.",
        md(
          "```",
          "vars e = nub (allVars e)",
          "  where",
          "    allVars (Num _) = []",
          "    allVars (Var x) = [x]",
          "    allVars (Neg e) = allVars e",
          "    allVars (BinOp _ e1 e2) = allVars e1 ++ allVars e2",
          "```",
        ),
      ],
      solution: hs`vars :: Expr -> [String]
vars e = nub (allVars e)
  where
    allVars (Num _) = []
    allVars (Var x) = [x]
    allVars (Neg e') = allVars e'
    allVars (BinOp _ e1 e2) = allVars e1 ++ allVars e2`,
      tests: [
        { expr: "vars e2", expected: '["x","y"]', unordered: true },
        { expr: "vars e6", expected: '["x","y"]', unordered: true },
        { expr: "vars e3", expected: '["x","w"]', unordered: true },
        { expr: "vars e1", expected: "[]" },
        { expr: "vars e4", expected: '["x","y"]', unordered: true },
        { expr: 'vars (Var "a")', expected: '["a"]' },
        { expr: 'vars (BinOp Add (Var "a") (Neg (BinOp Mul (Var "b") (Var "a"))))', expected: '["a","b"]', unordered: true },
        { expr: "length (vars e6)", expected: "2", label: "no duplicates in vars e6" },
      ],
    },
    {
      id: "showExpr",
      name: "showExpr",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define a function `showExpr :: Expr -> String` that turns an expression into text, so a person can read it:",
        "",
        "- A number is shown with `show`, and a variable is just its name.",
        "- `BinOp op e1 e2` is shown as `(`, then `e1`, a space, the operator's symbol (use the given `opSymbol`), a space, `e2`, then `)`. Every `BinOp` gets brackets, even when they are not strictly needed.",
        "- `Neg e` is shown as `-` followed by `e`.",
        "",
        "For example:",
        "",
        "```",
        "ghci> showExpr e1",
        "\"(2 + (3 * 4))\"",
        "ghci> showExpr e2",
        "\"((x + 1) * y)\"",
        "ghci> showExpr e4",
        "\"-(y + x)\"",
        "ghci> showExpr (Var \"z\")",
        "\"z\"",
        "```",
      ),
      hints: [
        "One equation per constructor again; the result is built with `++`.",
        "`show 14` is `\"14\"`, so `showExpr (Num n) = show n`.",
        "For a `BinOp`, show both children recursively and glue the pieces together: `\"(\"`, the left text, `\" \"`, the symbol, `\" \"`, the right text, `\")\"`.",
        md(
          "```",
          "showExpr (BinOp op e1 e2)",
          "  = \"(\" ++ showExpr e1 ++ \" \" ++ opSymbol op ++ \" \" ++ showExpr e2 ++ \")\"",
          "showExpr (Neg e) = \"-\" ++ showExpr e",
          "```",
        ),
      ],
      solution: hs`showExpr :: Expr -> String
showExpr (Num n) = show n
showExpr (Var x) = x
showExpr (BinOp op e1 e2)
  = "(" ++ showExpr e1 ++ " " ++ opSymbol op ++ " " ++ showExpr e2 ++ ")"
showExpr (Neg e) = "-" ++ showExpr e`,
      tests: [
        { expr: "showExpr e1", expected: '"(2 + (3 * 4))"' },
        { expr: "showExpr e2", expected: '"((x + 1) * y)"' },
        { expr: "showExpr e4", expected: '"-(y + x)"' },
        { expr: 'showExpr (Var "z")', expected: '"z"' },
        { expr: "showExpr (Num 42)", expected: '"42"' },
        { expr: "showExpr e3", expected: '"(x - (w * 0))"' },
        { expr: "showExpr e6", expected: '"((x * y) + (x * 3))"' },
        { expr: "showExpr (Neg (Neg (Num 1)))", expected: '"--1"' },
      ],
    },
    {
      id: "simplify",
      name: "simplify",
      part: "Part II",
      marks: 4,
      prompt: md(
        "Define a function `simplify :: Expr -> Expr` that simplifies an expression **bottom-up**: first simplify the children of a node, then apply at most one of the following rules to the node itself (`e` stands for any expression, `a` and `b` for any numbers):",
        "",
        "```",
        "a op b   ==>  the number (applyOp op a b)",
        "0 + e    ==>  e",
        "e + 0    ==>  e",
        "e - 0    ==>  e",
        "0 * e    ==>  0",
        "e * 0    ==>  0",
        "1 * e    ==>  e",
        "e * 1    ==>  e",
        "-a       ==>  the number (negate a)",
        "-(-e)    ==>  e",
        "```",
        "",
        "If no rule applies, the node is kept (with its simplified children). Use exactly these rules and no others. For example:",
        "",
        "```",
        "ghci> simplify e1",
        "Num 14",
        "ghci> simplify e3",
        "Var \"x\"",
        "ghci> simplify e5",
        "Var \"x\"",
        "ghci> simplify e4",
        "Neg (BinOp Add (Var \"y\") (Var \"x\"))",
        "ghci> simplify (BinOp Sub (Num 0) (Var \"x\"))",
        "BinOp Sub (Num 0) (Var \"x\")",
        "```",
        "",
        "In `e3 = x - w * 0`, the child `w * 0` becomes `0` first, and then `x - 0` becomes `x`.",
      ),
      hints: [
        "Split the work in two. `simplify` only does the recursion (simplify the children, then call a helper); the helper only applies the rules to a node whose children are already simplified.",
        "Write a helper `simpBin :: Op -> Expr -> Expr -> Expr` with one equation per rule, using nested patterns like `simpBin Add (Num 0) e = e`, and a final catch-all `simpBin op e1 e2 = BinOp op e1 e2`. Equations are tried top to bottom, so the catch-all must come last.",
        "Do the same for negation with `simpNeg :: Expr -> Expr`: `simpNeg (Num n) = Num (negate n)`, `simpNeg (Neg e) = e`, `simpNeg e = Neg e`.",
        md(
          "```",
          "simplify (BinOp op e1 e2) = simpBin op (simplify e1) (simplify e2)",
          "simplify (Neg e) = simpNeg (simplify e)",
          "simplify e = e",
          "",
          "simpBin op (Num a) (Num b) = Num (applyOp op a b)",
          "simpBin Add (Num 0) e = e",
          "...",
          "```",
        ),
      ],
      solution: hs`simplify :: Expr -> Expr
simplify (BinOp op e1 e2) = simpBin op (simplify e1) (simplify e2)
simplify (Neg e) = simpNeg (simplify e)
simplify e = e

-- Apply one rule to an operator whose children are already simplified
simpBin :: Op -> Expr -> Expr -> Expr
simpBin op (Num a) (Num b) = Num (applyOp op a b)
simpBin Add (Num 0) e = e
simpBin Add e (Num 0) = e
simpBin Sub e (Num 0) = e
simpBin Mul (Num 0) _ = Num 0
simpBin Mul _ (Num 0) = Num 0
simpBin Mul (Num 1) e = e
simpBin Mul e (Num 1) = e
simpBin op e1 e2 = BinOp op e1 e2

simpNeg :: Expr -> Expr
simpNeg (Num n) = Num (negate n)
simpNeg (Neg e) = e
simpNeg e = Neg e`,
      tests: [
        { expr: "simplify e1", expected: "Num 14" },
        { expr: "simplify e3", expected: 'Var "x"' },
        { expr: "simplify e5", expected: 'Var "x"' },
        { expr: "simplify e4", expected: 'Neg (BinOp Add (Var "y") (Var "x"))' },
        { expr: 'simplify (BinOp Sub (Num 0) (Var "x"))', expected: 'BinOp Sub (Num 0) (Var "x")', label: "0 - x is not simplified" },
        { expr: "simplify e6", expected: "e6", label: "nothing to do in e6" },
        { expr: 'simplify (Neg (Neg (BinOp Mul (Var "a") (Num 1))))', expected: 'Var "a"' },
        { expr: "simplify (Neg (BinOp Sub (Num 2) (Num 5)))", expected: "Num 3" },
        { expr: 'simplify (BinOp Mul (BinOp Sub (Var "y") (Var "y")) (Num 7))', expected: 'BinOp Mul (BinOp Sub (Var "y") (Var "y")) (Num 7)', label: "no extra rules such as y - y = 0" },
        { expr: "all (\\e -> eval (simplify e) env1 == eval e env1) [e1, e2, e4, e5, e6]", label: "simplify never changes the value" },
      ],
    },
    {
      id: "partialEval",
      name: "partialEval",
      part: "Part III",
      marks: 3,
      prompt: md(
        "Sometimes we only know *some* of the variables. Define a function `partialEval :: Env -> Expr -> Expr` that replaces every variable that is bound in the environment by its value (as a `Num`), leaves the other variables alone, and then simplifies the result with your `simplify`. For example:",
        "",
        "```",
        "ghci> partialEval [(\"x\", 2)] e6",
        "BinOp Add (BinOp Mul (Num 2) (Var \"y\")) (Num 6)",
        "ghci> partialEval env1 e2",
        "Num 12",
        "ghci> partialEval [] e5",
        "Var \"x\"",
        "ghci> partialEval env1 e3",
        "Num 5",
        "```",
        "",
        "Notice the last example: `w` is unknown, but `w * 0` simplifies to `0` anyway, so the answer is a number even though `eval e3 env1` is `Nothing`.",
      ),
      hints: [
        "Two steps: substitute, then simplify. Write the substitution as a local helper and finish with `simplify (sub e)`.",
        "The helper recurses through the tree. The only interesting case is `Var x`: use `lookup x env` and `case` on the answer.",
        "`Just n` gives `Num n`; `Nothing` keeps `Var x`. `Num`, `Neg` and `BinOp` just rebuild themselves around the substituted children.",
        md(
          "```",
          "partialEval env e = simplify (sub e)",
          "  where",
          "    sub (Var x) = case lookup x env of",
          "                    Just n  -> Num n",
          "                    Nothing -> Var x",
          "    sub (Neg e1) = Neg (sub e1)",
          "    sub (BinOp op e1 e2) = BinOp op (sub e1) (sub e2)",
          "    sub other = other",
          "```",
        ),
      ],
      solution: hs`partialEval :: Env -> Expr -> Expr
partialEval env e = simplify (sub e)
  where
    sub (Var x)
      = case lookup x env of
          Just n  -> Num n
          Nothing -> Var x
    sub (Neg e1) = Neg (sub e1)
    sub (BinOp op e1 e2) = BinOp op (sub e1) (sub e2)
    sub other = other`,
      tests: [
        { expr: 'partialEval [("x", 2)] e6', expected: 'BinOp Add (BinOp Mul (Num 2) (Var "y")) (Num 6)' },
        { expr: "partialEval env1 e2", expected: "Num 12" },
        { expr: "partialEval [] e5", expected: 'Var "x"' },
        { expr: "partialEval env1 e3", expected: "Num 5" },
        { expr: 'partialEval [("y", 0)] e6', expected: 'BinOp Mul (Var "x") (Num 3)' },
        { expr: 'partialEval [("y", 1)] e2', expected: 'BinOp Add (Var "x") (Num 1)' },
        { expr: "partialEval [] e1", expected: "Num 14" },
        { expr: "all (\\e -> partialEval env1 e == maybe e Num (eval e env1)) [e1, e2, e4, e6]", label: "with every variable known, partialEval gives the same number as eval" },
      ],
    },
  ],
};
