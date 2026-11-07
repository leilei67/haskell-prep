import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "y2022",
  year: 2022,
  title: "Supercombinators",
  summary:
    "Find the free variables of functions in a tiny Haskell-like language, then lambda-lift every nested function to the top level as a supercombinator.",
  skills: [
    "pattern matching on a recursive data type",
    "partition and filter",
    "union, \\\\ and nub for sets as lists",
    "foldr",
    "lookup tables (association lists)",
    "case on Maybe",
    "returning pairs from recursion (unzip)",
    "tree traversal that collects results",
  ],
  story: md(
    "This paper is about a trick compilers like GHC use on functions that are defined inside other functions. You'll be working with a made-up mini language, represented as a Haskell data type. Let's build up the ideas.",
    "",
    "**Free and bound variables.** Look at this Haskell function:",
    "",
    "```haskell",
    "g y = y + x",
    "```",
    "",
    "`y` is a parameter of `g`, so we say `y` is **bound** in `g`. But `x` isn't a parameter. It must come from somewhere outside, so we say `x` is **free** in `g`. A variable is free in an expression if it's used there but not defined there.",
    "",
    "**Why free variables are a nuisance.** Here `g` is defined inside `f`, and uses `f`'s parameter `x`:",
    "",
    "```haskell",
    "let f x = let g y = y + x",
    "          in g",
    "in f 3 8",
    "```",
    "",
    "`f 3` returns the function `g`, but a `g` that must remember \"x is 3\". When `g` is later applied to 8, it has escaped from the place where `x` was defined. A compiler has to store that `x = 3` somewhere, which is messy.",
    "",
    "**Lambda lifting** fixes this. Give `g` an extra parameter for each free variable, then move it to the top level, where it can't capture anything:",
    "",
    "```",
    "let",
    "  $f x = $g x",
    "  $g x y = + y x",
    "in $f 3 8",
    "```",
    "",
    "Every place that used `g` now uses `$g x`, a **partial application**: `$g` takes two arguments, and giving it only `x` leaves a function still waiting for `y`. (A function's **arity** is the number of parameters it takes; a partial application gives it fewer than that.) The `$` in front marks functions that have been transformed. A function whose body only mentions its own parameters (and primitives) is called a **supercombinator**. After lifting, every function is a supercombinator.",
    "",
    "The paper's adage: \"When leaving a let expression, please take all your belongings with you!\" A function leaving its `let` must take its free variables along as parameters.",
    "",
    "**Siblings.** Functions defined in the same `let` can call each other (they may be mutually recursive). They all get lifted to the top together, so calls between siblings don't count as free variables. But ordinary variables in the same `let`, like `z = 1`, stay behind, so a function that uses `z` must take `z` as a parameter. And if one sibling needs `y` and the other needs `z`, both get both, because each will call the other and must pass everything along.",
    "",
    "**The mini language.** A program is one expression:",
    "",
    "```haskell",
    "data Exp = Const Int | Var Id | Fun [Id] Exp | App Exp [Exp] | Let [Binding] Exp",
    "type Id = String",
    "type Binding = (Id, Exp)",
    "type Supercombinator = Binding",
    "```",
    "",
    "- `Const 5` is the integer 5. There are no booleans: 1 means true and 0 means false.",
    "- `Var \"x\"` is a variable. The five primitives are also written as variables: `Var \"+\"`, `Var \"-\"`, `Var \"*\"`, `Var \"<=\"` and `Var \"ite\"`. The list `prims` holds their names.",
    "- `Fun [\"x\",\"y\"] body` is a function with parameters `x` and `y`. Functions only ever appear as the right-hand side of a `let` binding (so they always have a name).",
    "- `App f [a, b]` applies `f` to the arguments `a` and `b`. Arguments come as a list. `App (Var \"ite\") [p, q, r]` means `if p then q else r`.",
    "- `Let bindings body` defines some names, then evaluates `body`. Each binding is a `(name, expression)` pair. A binding whose expression is a `Fun` defines a function; any other binding defines a variable. All bindings in one `let` can see each other.",
    "",
    "For example, `let succ x = + x 1 in succ 5` (primitives are written before their arguments) is:",
    "",
    "```haskell",
    "Let [(\"succ\", Fun [\"x\"] (App (Var \"+\") [Var \"x\", Const 1]))]",
    "    (App (Var \"succ\") [Const 5])",
    "```",
    "",
    "The template gives you `putExp`, which prints an expression in source syntax, the example programs `e1` to `e20`, and lifted versions `e1'`, `e4'`, `e14'` and so on. The lifting happens in three passes, and you write all three: `buildFVMap` (find each function's free variables), `modifyFunctions` (add the extra parameters and rename), and `lift` (move the functions to the top):",
    "",
    "```haskell",
    "lambdaLift :: Exp -> Exp",
    "lambdaLift e = lift (modifyFunctions (buildFVMap e) e)",
    "```",
  ),
  notes: md(
    "**Where the marks are (30 total).** Part I (`isFun`, `splitDefs`, `topLevelFunctions`) is 5 marks of one-liners. Part II is 9 marks, 7 of them for `freeVars`. Part III is 16 marks: `buildFVMap` 6, `modifyFunctions` 6, `lift` 4.",
    "",
    "**Order of attack.** Do the parts in order; they really do build on each other. Bank Part I in the first 15 minutes. Spend real care on `freeVars`: it's the biggest single item and `buildFVMap` depends on it. For `freeVars` and the Part III functions, write one equation per constructor of `Exp`, and check each against the data type so you don't forget where sub-expressions hide (inside a `let`, they're in the bindings and in the body).",
    "",
    "**If you're short of time.** `buildFVMap` and `modifyFunctions` are worth more than `lift` and are easier. You can test `modifyFunctions` on its own with `putExp (modifyFunctions (buildFVMap e19) e19)`.",
    "",
    "**Traps.**",
    "",
    "- Primitives like `\"+\"` are not free variables.",
    "- `freeVars` of a `let` removes all the names the `let` binds, from everything inside it (bindings and body), because the bindings can see each other.",
    "- In `buildFVMap`, the free variables of one function are the union over all its sibling functions, minus the siblings' names, and sorted. Non-function siblings like `x = 3` do count as free.",
    "- `buildFVMap` must search every sub-expression: function bodies, variable bindings, `let` bodies and application arguments.",
    "- In `modifyFunctions`, rename the definition (`f` becomes `$f`), prepend the free variables to its parameters, and modify its body too. A reference to a function with no free variables becomes just `Var \"$f\"`, not `App (Var \"$f\") []`.",
    "- In `lift`, a `let` that has no bindings left must disappear: `Let [] e` is just `e`.",
  ),
  setup: hs`import Data.List
import Data.Maybe

data Exp = Const Int
         | Var Id
         | Fun [Id] Exp
         | App Exp [Exp]
         | Let [Binding] Exp
  deriving (Eq, Show)

type Id = String

type Binding = (Id, Exp)

type Supercombinator = Binding

prims :: [Id]
prims = ["+", "-", "*", "<=", "ite"]

lookUp :: Id -> [(Id, a)] -> a
lookUp v env
  = fromMaybe (error ("lookUp failed with search key " ++ v)) (lookup v env)

lambdaLift :: Exp -> Exp
lambdaLift e
  = lift (modifyFunctions (buildFVMap e) e)

------------------------------------------------------------
-- Pretty printing: putExp shows an expression in source syntax

shE :: Int -> Exp -> String
shE _ (Const n) = show n
shE _ (Var v) = v
shE i (Fun as e) = "Fun " ++ unwords as ++ " -> " ++ shE i e
shE i (App (Var "ite") [p, q, r])
  = "if " ++ shE i p ++
    shNewLine (i + 2) ++ "then" ++ shNewLine (i + 4) ++ shE (i + 4) q ++
    shNewLine (i + 2) ++ "else" ++ shNewLine (i + 4) ++ shE (i + 4) r
shE i (App f as) = unwords (showFn f : map (shArg i) as)
  where
    showFn f'@(App _ _) = "(" ++ shE i f' ++ ")"
    showFn f' = shArg i f'
shE i (Let bs e)
  = "let" ++ concatMap (\b -> shNewLine (i + 2) ++ shBinding (i + 2) b) bs ++
    shNewLine i ++ "in " ++ shE (i + 3) e

shArg :: Int -> Exp -> String
shArg i e@(App _ _) = "(" ++ shE i e ++ ")"
shArg i e@(Fun _ _) = "(" ++ shE i e ++ ")"
shArg i e@(Let _ _) = "(" ++ shE i e ++ ")"
shArg i e = shE i e

shBinding :: Int -> Binding -> String
shBinding i (f, Fun as e) = unwords (f : as) ++ " = " ++ shE (i + 2) e
shBinding i (v, e) = v ++ " = " ++ shE (i + 2) e

shNewLine :: Int -> String
shNewLine i = "\n" ++ replicate i ' '

prettyExp :: Exp -> String
prettyExp e = shE 0 e

putExp :: Exp -> IO ()
putExp e = putStrLn (prettyExp e)

------------------------------------------------------------
-- An evaluator, used by the tests to check that lifting keeps the meaning

data EvalValue = EvIntV Int | EvFunV Int ([EvalValue] -> EvalValue)

evalProgram :: [(Id, EvalValue)] -> Exp -> EvalValue
evalProgram _ (Const n) = EvIntV n
evalProgram env (Var v) = fromMaybe (evPrim v) (lookup v env)
evalProgram env (Fun as e) = EvFunV (length as) (\vs -> evalProgram (zip as vs ++ env) e)
evalProgram env (App f es) = evApply (evalProgram env f) (map (evalProgram env) es)
evalProgram env (Let bs e) = evalProgram env' e
  where
    env' = [(v, evalProgram env' b) | (v, b) <- bs] ++ env

evApply :: EvalValue -> [EvalValue] -> EvalValue
evApply v [] = v
evApply (EvFunV n f) vs
  | length vs < n = EvFunV (n - length vs) (\more -> f (vs ++ more))
  | otherwise = evApply (f (take n vs)) (drop n vs)
evApply (EvIntV _) _ = error "applying a number"

evPrim :: Id -> EvalValue
evPrim "+" = evArith (+)
evPrim "-" = evArith (-)
evPrim "*" = evArith (*)
evPrim "<=" = evArith (\a b -> if a <= b then 1 else 0)
evPrim "ite" = EvFunV 3 (\[p, q, r] -> if evIntOf p /= 0 then q else r)
evPrim v = error ("unbound variable " ++ v)

evArith :: (Int -> Int -> Int) -> EvalValue
evArith op = EvFunV 2 (\[a, b] -> EvIntV (op (evIntOf a) (evIntOf b)))

evIntOf :: EvalValue -> Int
evIntOf (EvIntV n) = n
evIntOf _ = error "expected a number"

-- The value of a whole program
run :: Exp -> Int
run e = evIntOf (evalProgram [] e)

-- Puts the supercombinators of a lifted program in alphabetical order,
-- so that results can be compared whatever order you list them in.
sortTop :: Exp -> Exp
sortTop (Let bs e) = Let (sortOn fst bs) e
sortTop e = e

------------------------------------------------------------
-- Examples

-- let f x = let g y = + y x in g in f 3 8
e1 :: Exp
e1 = Let [("f", Fun ["x"] (Let [("g", Fun ["y"] (App (Var "+") [Var "y", Var "x"]))] (Var "g")))]
         (App (Var "f") [Const 3, Const 8])

e1' :: Exp
e1' = Let [("$f", Fun ["x"] (App (Var "$g") [Var "x"])),
           ("$g", Fun ["x", "y"] (App (Var "+") [Var "y", Var "x"]))]
          (App (Var "$f") [Const 3, Const 8])

-- let succ x = + x 1 in succ 5
e2 :: Exp
e2 = Let [("succ", Fun ["x"] (App (Var "+") [Var "x", Const 1]))]
         (App (Var "succ") [Const 5])

e2' :: Exp
e2' = Let [("$succ", Fun ["x"] (App (Var "+") [Var "x", Const 1]))]
          (App (Var "$succ") [Const 5])

-- factorial of 6
e3 :: Exp
e3 = Let [("f", Fun ["x"] (App (Var "ite") [App (Var "<=") [Var "x", Const 1],
                                             Const 1,
                                             App (Var "*") [Var "x", App (Var "f") [App (Var "-") [Var "x", Const 1]]]]))]
         (App (Var "f") [Const 6])

e3' :: Exp
e3' = Let [("$f", Fun ["x"] (App (Var "ite") [App (Var "<=") [Var "x", Const 1],
                                               Const 1,
                                               App (Var "*") [Var "x", App (Var "$f") [App (Var "-") [Var "x", Const 1]]]]))]
          (App (Var "$f") [Const 6])

-- let x = 3; g y = + y x in g 8
e4 :: Exp
e4 = Let [("x", Const 3), ("g", Fun ["y"] (App (Var "+") [Var "y", Var "x"]))]
         (App (Var "g") [Const 8])

e4' :: Exp
e4' = Let [("$g", Fun ["x", "y"] (App (Var "+") [Var "y", Var "x"]))]
          (Let [("x", Const 3)] (App (App (Var "$g") [Var "x"]) [Const 8]))

e5 :: Exp
e5 = Fun ["x", "y"] (Var "x")

-- let x = 3; y = + x 1 in * x y   (no functions at all)
e6 :: Exp
e6 = Let [("x", Const 3), ("y", App (Var "+") [Var "x", Const 1])]
         (App (Var "*") [Var "x", Var "y"])

-- Fun x -> + x z
e7 :: Exp
e7 = Fun ["x"] (App (Var "+") [Var "x", Var "z"])

-- let x = + y 1 in * x z
e8 :: Exp
e8 = Let [("x", App (Var "+") [Var "y", Const 1])] (App (Var "*") [Var "x", Var "z"])

-- let f y = + y x in f x
e9 :: Exp
e9 = Let [("f", Fun ["y"] (App (Var "+") [Var "y", Var "x"]))] (App (Var "f") [Var "x"])

-- mutually recursive even and odd
e10 :: Exp
e10 = Let [("even", Fun ["n"] (App (Var "ite") [App (Var "<=") [Var "n", Const 0],
                                                 Const 1,
                                                 App (Var "odd") [App (Var "-") [Var "n", Const 1]]])),
           ("odd", Fun ["n"] (App (Var "ite") [App (Var "<=") [Var "n", Const 0],
                                                Const 0,
                                                App (Var "even") [App (Var "-") [Var "n", Const 1]]]))]
          (App (Var "even") [Const 10])

e10' :: Exp
e10' = Let [("$even", Fun ["n"] (App (Var "ite") [App (Var "<=") [Var "n", Const 0],
                                                   Const 1,
                                                   App (Var "$odd") [App (Var "-") [Var "n", Const 1]]])),
            ("$odd", Fun ["n"] (App (Var "ite") [App (Var "<=") [Var "n", Const 0],
                                                  Const 0,
                                                  App (Var "$even") [App (Var "-") [Var "n", Const 1]]]))]
           (App (Var "$even") [Const 10])

-- let k = 10; addK x = + x k in addK 5
e11 :: Exp
e11 = Let [("k", Const 10), ("addK", Fun ["x"] (App (Var "+") [Var "x", Var "k"]))]
          (App (Var "addK") [Const 5])

e11' :: Exp
e11' = Let [("$addK", Fun ["k", "x"] (App (Var "+") [Var "x", Var "k"]))]
           (Let [("k", Const 10)] (App (App (Var "$addK") [Var "k"]) [Const 5]))

-- let double x = + x x; quad x = double (double x) in quad 3
e12 :: Exp
e12 = Let [("double", Fun ["x"] (App (Var "+") [Var "x", Var "x"])),
           ("quad", Fun ["x"] (App (Var "double") [App (Var "double") [Var "x"]]))]
          (App (Var "quad") [Const 3])

e12' :: Exp
e12' = Let [("$double", Fun ["x"] (App (Var "+") [Var "x", Var "x"])),
            ("$quad", Fun ["x"] (App (Var "$double") [App (Var "$double") [Var "x"]]))]
           (App (Var "$quad") [Const 3])

-- let f x = let g y = let h z = + x (+ y z) in h in g in f 1 2 3
e13 :: Exp
e13 = Let [("f", Fun ["x"]
                   (Let [("g", Fun ["y"]
                                 (Let [("h", Fun ["z"] (App (Var "+") [Var "x", App (Var "+") [Var "y", Var "z"]]))]
                                      (Var "h")))]
                        (Var "g")))]
          (App (Var "f") [Const 1, Const 2, Const 3])

e13' :: Exp
e13' = Let [("$f", Fun ["x"] (App (Var "$g") [Var "x"])),
            ("$g", Fun ["x", "y"] (App (Var "$h") [Var "x", Var "y"])),
            ("$h", Fun ["x", "y", "z"] (App (Var "+") [Var "x", App (Var "+") [Var "y", Var "z"]]))]
           (App (Var "$f") [Const 1, Const 2, Const 3])

-- let a = 2 in let b = + a 1; scale x = * x b; twice x = scale (scale x) in twice a
e14 :: Exp
e14 = Let [("a", Const 2)]
          (Let [("b", App (Var "+") [Var "a", Const 1]),
                ("scale", Fun ["x"] (App (Var "*") [Var "x", Var "b"])),
                ("twice", Fun ["x"] (App (Var "scale") [App (Var "scale") [Var "x"]]))]
               (App (Var "twice") [Var "a"]))

e14' :: Exp
e14' = Let [("$scale", Fun ["b", "x"] (App (Var "*") [Var "x", Var "b"])),
            ("$twice", Fun ["b", "x"] (App (App (Var "$scale") [Var "b"])
                                           [App (App (Var "$scale") [Var "b"]) [Var "x"]]))]
           (Let [("a", Const 2)]
                (Let [("b", App (Var "+") [Var "a", Const 1])]
                     (App (App (Var "$twice") [Var "b"]) [Var "a"])))

-- let y = (let sq x = * x x in sq 4) in + y 1
e15 :: Exp
e15 = Let [("y", Let [("sq", Fun ["x"] (App (Var "*") [Var "x", Var "x"]))] (App (Var "sq") [Const 4]))]
          (App (Var "+") [Var "y", Const 1])

e15' :: Exp
e15' = Let [("$sq", Fun ["x"] (App (Var "*") [Var "x", Var "x"]))]
           (Let [("y", App (Var "$sq") [Const 4])] (App (Var "+") [Var "y", Const 1]))

-- + 1 (let inc n = + n 1 in inc 2)
e16 :: Exp
e16 = App (Var "+") [Const 1, Let [("inc", Fun ["n"] (App (Var "+") [Var "n", Const 1]))] (App (Var "inc") [Const 2])]

e16' :: Exp
e16' = Let [("$inc", Fun ["n"] (App (Var "+") [Var "n", Const 1]))]
           (App (Var "+") [Const 1, App (Var "$inc") [Const 2]])

-- let apply f x = f x; main n = let addN m = + m n in apply addN 5 in main 3
e17 :: Exp
e17 = Let [("apply", Fun ["f", "x"] (App (Var "f") [Var "x"])),
           ("main", Fun ["n"] (Let [("addN", Fun ["m"] (App (Var "+") [Var "m", Var "n"]))]
                                   (App (Var "apply") [Var "addN", Const 5])))]
          (App (Var "main") [Const 3])

e17' :: Exp
e17' = Let [("$apply", Fun ["f", "x"] (App (Var "f") [Var "x"])),
            ("$main", Fun ["n"] (App (Var "$apply") [App (Var "$addN") [Var "n"], Const 5])),
            ("$addN", Fun ["n", "m"] (App (Var "+") [Var "m", Var "n"]))]
           (App (Var "$main") [Const 3])

-- let f x = let y = * x x in + y 1 in f 3
e18 :: Exp
e18 = Let [("f", Fun ["x"] (Let [("y", App (Var "*") [Var "x", Var "x"])] (App (Var "+") [Var "y", Const 1])))]
          (App (Var "f") [Const 3])

e18' :: Exp
e18' = Let [("$f", Fun ["x"] (Let [("y", App (Var "*") [Var "x", Var "x"])] (App (Var "+") [Var "y", Const 1])))]
           (App (Var "$f") [Const 3])

-- factorial using two mutually recursive functions and let-bound y and z
e19 :: Exp
e19 = Let [("y", Const 1)]
          (Let [("z", Const 1),
                ("f", Fun ["x"] (App (Var "ite") [App (Var "<=") [Var "x", Var "y"],
                                                   Var "y",
                                                   App (Var "g") [Var "x"]])),
                ("g", Fun ["x"] (App (Var "*") [Var "x", App (Var "f") [App (Var "-") [Var "x", Var "z"]]]))]
               (App (Var "f") [Const 6]))

e19' :: Exp
e19' = Let [("$f", Fun ["y", "z", "x"] (App (Var "ite") [App (Var "<=") [Var "x", Var "y"],
                                                          Var "y",
                                                          App (App (Var "$g") [Var "y", Var "z"]) [Var "x"]])),
            ("$g", Fun ["y", "z", "x"] (App (Var "*") [Var "x", App (App (Var "$f") [Var "y", Var "z"])
                                                                     [App (Var "-") [Var "x", Var "z"]]]))]
           (Let [("y", Const 1)]
                (Let [("z", Const 1)]
                     (App (App (Var "$f") [Var "y", Var "z"]) [Const 6])))

-- no let at the top
e20 :: Exp
e20 = App (Var "*") [Const 6, Const 7]
`,
  starter: hs`------------------------------------------------------------
-- Part I

isFun :: Exp -> Bool
isFun = undefined

splitDefs :: [Binding] -> ([Binding], [Binding])
splitDefs = undefined

topLevelFunctions :: Exp -> Int
topLevelFunctions = undefined

------------------------------------------------------------
-- Part II

unionAll :: Eq a => [[a]] -> [a]
unionAll = undefined

freeVars :: Exp -> [Id]
freeVars = undefined

------------------------------------------------------------
-- Part III

buildFVMap :: Exp -> [(Id, [Id])]
buildFVMap = undefined

modifyFunctions :: [(Id, [Id])] -> Exp -> Exp
modifyFunctions = undefined

lift :: Exp -> Exp
lift = undefined

-- Suggested helper for lift (you may delete it if you don't use it)
lift' :: Exp -> (Exp, [Supercombinator])
lift' = undefined
`,
  tasks: [
    {
      id: "isFun",
      name: "isFun",
      part: "Part I",
      marks: 1,
      prompt: md(
        "Define `isFun :: Exp -> Bool` that returns `True` if the expression is a function (built with `Fun`) and `False` otherwise.",
        "",
        "```",
        "*SC> isFun e2",
        "False",
        "*SC> e5",
        "Fun [\"x\",\"y\"] (Var \"x\")",
        "*SC> isFun e5",
        "True",
        "```",
      ),
      hints: [
        "Pattern matching on the constructor is all you need.",
        "Two equations: one for the `Fun` case, one catch-all.",
        "Use `_` for the parts of `Fun` you don't care about.",
        md("```haskell", "isFun (Fun _ _) = True", "isFun _ = False", "```"),
      ],
      solution: hs`isFun :: Exp -> Bool
isFun (Fun _ _) = True
isFun _ = False`,
      tests: [
        { expr: "isFun e2", expected: "False" },
        { expr: "isFun e5", expected: "True" },
        { expr: "isFun e7", expected: "True" },
        { expr: "isFun (Const 1)", expected: "False" },
        { expr: `isFun (Var "f")`, expected: "False" },
        { expr: `isFun (App (Var "+") [Const 1, Const 2])`, expected: "False" },
        { expr: "isFun (Let [] e5)", expected: "False" },
      ],
    },
    {
      id: "splitDefs",
      name: "splitDefs",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Using `isFun`, or otherwise, define `splitDefs :: [Binding] -> ([Binding], [Binding])` that splits a list of bindings into the function definitions and the variable (non-function) definitions. Keep each sublist in the original order.",
        "",
        "```",
        "*SC> putExp e4",
        "let",
        "  x = 3",
        "  g y = + y x",
        "in g 8",
        "*SC> e4",
        "Let [(\"x\",Const 3),(\"g\",Fun [\"y\"] (App (Var \"+\") [Var \"y\",Var \"x\"]))]",
        "    (App (Var \"g\") [Const 8])",
        "*SC> let Let bs _ = e4 in splitDefs bs",
        "([(\"g\",Fun [\"y\"] (App (Var \"+\") [Var \"y\",Var \"x\"]))],[(\"x\",Const 3)])",
        "```",
      ),
      hints: [
        "`Data.List` has a function that splits a list into (the elements that pass a test, the ones that fail).",
        "That function is `partition :: (a -> Bool) -> [a] -> ([a], [a])`, and it keeps the original order.",
        "The test must look at the expression half of each binding: `isFun . snd`.",
        "`splitDefs = partition (isFun . snd)`",
      ],
      solution: hs`splitDefs :: [Binding] -> ([Binding], [Binding])
splitDefs = partition (isFun . snd)`,
      tests: [
        {
          expr: "(let Let bs _ = e4 in splitDefs bs)",
          expected: `([("g",Fun ["y"] (App (Var "+") [Var "y",Var "x"]))],[("x",Const 3)])`,
        },
        { expr: "splitDefs []", expected: "([],[])" },
        {
          expr: `splitDefs [("a", Const 1), ("f", e5), ("b", Var "a"), ("g", e7)]`,
          expected: `([("f", e5), ("g", e7)], [("a", Const 1), ("b", Var "a")])`,
        },
        { expr: `splitDefs [("f", e5)]`, expected: `([("f", e5)], [])` },
        { expr: `splitDefs [("x", Const 3), ("y", Var "x")]`, expected: `([], [("x", Const 3), ("y", Var "x")])` },
        { expr: "(let Let bs _ = e10 in map fst (fst (splitDefs bs)))", expected: `["even","odd"]` },
      ],
    },
    {
      id: "topLevelFunctions",
      name: "topLevelFunctions",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Using `isFun`, or otherwise, define `topLevelFunctions :: Exp -> Int` that counts the functions defined in the topmost `let` of a program. If the program isn't a `let` at the top, the answer is 0.",
        "",
        "```",
        "*SC> topLevelFunctions e4",
        "1",
        "*SC> topLevelFunctions e12",
        "2",
        "*SC> topLevelFunctions e20",
        "0",
        "```",
      ),
      hints: [
        "Two equations: one for `Let`, one catch-all returning 0.",
        "Only look at the bindings of the outermost `let`. Don't look inside the body or the bindings.",
        "Count the bindings whose expression `isFun`.",
        md("```haskell", "topLevelFunctions (Let bs _) = length (filter (isFun . snd) bs)", "topLevelFunctions _ = 0", "```"),
      ],
      solution: hs`topLevelFunctions :: Exp -> Int
topLevelFunctions (Let bs _) = length (filter (isFun . snd) bs)
topLevelFunctions _ = 0`,
      tests: [
        { expr: "topLevelFunctions e4", expected: "1" },
        { expr: "topLevelFunctions e12", expected: "2" },
        { expr: "topLevelFunctions e20", expected: "0" },
        { expr: "topLevelFunctions e1", expected: "1" },
        { expr: "topLevelFunctions e19", expected: "0", label: "topLevelFunctions e19 == 0 (the outer let only defines y)" },
        { expr: "topLevelFunctions e6", expected: "0" },
        { expr: "topLevelFunctions e5", expected: "0" },
        { expr: "topLevelFunctions e17", expected: "2" },
      ],
    },
    {
      id: "unionAll",
      name: "unionAll",
      part: "Part II",
      marks: 2,
      prompt: md(
        "`Data.List` has `union`, which joins two duplicate-free lists without creating duplicates:",
        "",
        "```",
        "*SC> union [1, 3] [1, 2, 3, 7]",
        "[1,3,2,7]",
        "```",
        "",
        "Define `unionAll :: Eq a => [[a]] -> [a]` that takes the union of a whole list of duplicate-free lists.",
        "",
        "```",
        "*SC> unionAll [[2, 5], [4, 2], [5, 1]]",
        "[2,5,4,1]",
        "```",
        "",
        "The order of the result doesn't matter.",
      ),
      hints: [
        "This is \"combine a list of things with a two-argument function\": a fold.",
        "Use `foldr` with `union` as the combining function.",
        "The starting value is the union of no lists at all: the empty list.",
        "`unionAll = foldr union []`",
      ],
      solution: hs`unionAll :: Eq a => [[a]] -> [a]
unionAll = foldr union []`,
      tests: [
        { expr: "unionAll [[2, 5], [4, 2], [5, 1]]", expected: "[2,5,4,1]", unordered: true },
        { expr: "unionAll ([] :: [[Int]])", expected: "[]" },
        { expr: "unionAll [[1, 2, 3]]", expected: "[1,2,3]", unordered: true },
        { expr: "unionAll [[1], [1], [1]]", expected: "[1]" },
        { expr: `unionAll ["ab", "bc", "", "ca"]`, expected: `"abc"`, unordered: true },
        { expr: "length (unionAll [[1, 2], [2, 3], [3, 4]])", expected: "4" },
      ],
    },
    {
      id: "freeVars",
      name: "freeVars",
      part: "Part II",
      marks: 7,
      prompt: md(
        "Using `union` and `unionAll`, or otherwise, define `freeVars :: Exp -> [Id]` that returns the free variables of an expression, as a list with no duplicates. The rules:",
        "",
        "- A constant has no free variables.",
        "- A variable is free, unless it's the name of a primitive (in `prims`). So `Var \"v\"` is free but `Var \"*\"` isn't.",
        "- The free variables of an application are the union of those of the function and of every argument.",
        "- The free variables of a function `Fun as body` are those of `body`, minus the parameters `as`.",
        "- The free variables of a `let` are the union of the free variables of every expression inside it (each binding's right-hand side and the body), minus the names the `let` binds. (The bindings can all see each other.)",
        "",
        "\"Minus\" is list difference, `\\\\` from `Data.List`: `[1, 3, 5] \\\\ [1, 3]` is `[5]`.",
        "",
        "```",
        "*SC> putExp e7",
        "Fun x -> + x z",
        "*SC> freeVars e7",
        "[\"z\"]",
        "*SC> putExp e8",
        "let",
        "  x = + y 1",
        "in * x z",
        "*SC> freeVars e8",
        "[\"y\",\"z\"]",
        "*SC> putExp e9",
        "let",
        "  f y = + y x",
        "in f x",
        "*SC> freeVars e9",
        "[\"x\"]",
        "```",
        "",
        "(The template's `e7`, `e8` and `e9` aren't printed in the paper. These are equivalents with the same answers.) The order of the result doesn't matter.",
      ),
      hints: [
        "Write one equation for each of the five constructors of `Exp`, following the rules one by one.",
        "For `Var v`, use a guard: `elem v prims`. For `App f es`, the expressions to look in are `f : es`, so `unionAll (map freeVars (f : es))`.",
        "For `Let bs e`, the expressions inside are the body `e` and the right-hand sides `map snd bs`. The names it binds are `map fst bs`. Subtract them after taking the union, not before.",
        md(
          "```haskell",
          "freeVars (Const _) = []",
          "freeVars (Var v)",
          "  | elem v prims = []",
          "  | otherwise = [v]",
          "freeVars (Fun as e) = freeVars e \\\\ as",
          "freeVars (App f es) = unionAll (map freeVars (f : es))",
          "freeVars (Let bs e) = unionAll (map freeVars (e : map snd bs)) \\\\ map fst bs",
          "```",
        ),
      ],
      solution: hs`freeVars :: Exp -> [Id]
freeVars (Const _) = []
freeVars (Var v)
  | elem v prims = []
  | otherwise = [v]
freeVars (Fun as e) = freeVars e \\ as
freeVars (App f es) = unionAll (map freeVars (f : es))
-- every binding can see every other, so the bound names are removed from all of them
freeVars (Let bs e) = unionAll (map freeVars (e : map snd bs)) \\ map fst bs`,
      tests: [
        { expr: "freeVars e7", expected: `["z"]` },
        { expr: "freeVars e8", expected: `["y","z"]`, unordered: true },
        { expr: "freeVars e9", expected: `["x"]` },
        { expr: "freeVars (Const 3)", expected: "[]" },
        { expr: `freeVars (Var "v")`, expected: `["v"]` },
        { expr: `freeVars (Var "*")`, expected: "[]" },
        { expr: "freeVars e1", expected: "[]" },
        { expr: "freeVars e4", expected: "[]" },
        { expr: "freeVars e5", expected: "[]" },
        { expr: `freeVars (App (Var "x") [Var "x", Var "y", Const 1])`, expected: `["x","y"]`, unordered: true },
        {
          expr: `freeVars (Fun ["x"] (App (Var "*") [Var "x", App (Var "f") [App (Var "-") [Var "x", Var "z"]]]))`,
          expected: `["f","z"]`,
          unordered: true,
        },
        { expr: `freeVars (Let [("a", Var "b"), ("b", Var "c")] (Var "a"))`, expected: `["c"]` },
      ],
    },
    {
      id: "buildFVMap",
      name: "buildFVMap",
      part: "Part III",
      marks: 6,
      prompt: md(
        "Define `buildFVMap :: Exp -> [(Id, [Id])]` that builds a table from every function name in the program (at any depth) to the extra parameters it will need when lifted.",
        "",
        "For the functions defined in one `let`, the extra parameters are: the union of `freeVars` of all those sibling functions, minus the names of the sibling functions themselves, sorted with `sort`. Every function in the same `let` gets that same list. (Siblings are lifted together, so they can always see each other. Variable bindings in the same `let`, like `z = 1`, stay behind, so they do count.) `splitDefs` will help.",
        "",
        "```",
        "*SC> putExp e1",
        "let",
        "  f x = let",
        "      g y = + y x",
        "    in g",
        "in f 3 8",
        "*SC> buildFVMap e1",
        "[(\"f\",[]),(\"g\",[\"x\"])]",
        "*SC> buildFVMap e2",
        "[(\"succ\",[])]",
        "*SC> putExp e19",
        "let",
        "  y = 1",
        "in let",
        "     z = 1",
        "     f x = if <= x y",
        "         then",
        "           y",
        "         else",
        "           g x",
        "     g x = * x (f (- x z))",
        "   in f 6",
        "*SC> buildFVMap e19",
        "[(\"f\",[\"y\",\"z\"]),(\"g\",[\"y\",\"z\"])]",
        "```",
        "",
        "In `e19`, `f` needs `y` and `g` needs `z`, and they call each other, so both get `[\"y\",\"z\"]`. The order of the table's entries doesn't matter, but sort each list of free variables.",
      ),
      hints: [
        "This is a traversal of the whole expression that collects table entries. Write one equation per constructor; the `Let` case does the real work, and every case recurses into all of its sub-expressions.",
        "In the `Let bs e` case: `(fs, _) = splitDefs bs` gives the functions. The shared list is `sort (unionAll (map (freeVars . snd) fs) \\\\ map fst fs)`. Make one entry per function.",
        "Don't forget to keep searching: function bodies and variable bindings (`map snd bs`) can contain more `let`s, and so can the `let` body and the parts of an `App`. `Const` and `Var` give `[]`.",
        md(
          "```haskell",
          "buildFVMap (Let bs e)",
          "  = [(f, fvs) | (f, _) <- fs] ++ concatMap (buildFVMap . snd) bs ++ buildFVMap e",
          "  where",
          "    (fs, _) = splitDefs bs",
          "    fvs = sort (unionAll (map (freeVars . snd) fs) \\\\ map fst fs)",
          "buildFVMap (Fun _ e) = buildFVMap e",
          "buildFVMap (App f es) = concatMap buildFVMap (f : es)",
          "buildFVMap _ = []",
          "```",
        ),
      ],
      solution: hs`buildFVMap :: Exp -> [(Id, [Id])]
buildFVMap (Let bs e)
  = [(f, fvs) | (f, _) <- fs] ++ concatMap (buildFVMap . snd) bs ++ buildFVMap e
  where
    (fs, _) = splitDefs bs
    -- siblings share one parameter list; they never count as free in each other
    fvs = sort (unionAll (map (freeVars . snd) fs) \\ map fst fs)
buildFVMap (Fun _ e) = buildFVMap e
buildFVMap (App f es) = concatMap buildFVMap (f : es)
buildFVMap _ = []`,
      tests: [
        { expr: "buildFVMap e1", expected: `[("f",[]),("g",["x"])]`, unordered: true },
        { expr: "buildFVMap e2", expected: `[("succ",[])]` },
        { expr: "buildFVMap e19", expected: `[("f",["y","z"]),("g",["y","z"])]`, unordered: true },
        { expr: "buildFVMap e4", expected: `[("g",["x"])]` },
        { expr: "buildFVMap e3", expected: `[("f",[])]` },
        { expr: "buildFVMap e13", expected: `[("f",[]),("g",["x"]),("h",["x","y"])]`, unordered: true },
        { expr: "buildFVMap e14", expected: `[("scale",["b"]),("twice",["b"])]`, unordered: true },
        { expr: "buildFVMap e17", expected: `[("apply",[]),("main",[]),("addN",["n"])]`, unordered: true },
        { expr: "buildFVMap e15", expected: `[("sq",[])]`, label: "buildFVMap e15 == [(\"sq\",[])] (a let inside a variable binding)" },
        { expr: "buildFVMap e16", expected: `[("inc",[])]`, label: "buildFVMap e16 == [(\"inc\",[])] (a let inside an argument)" },
        { expr: "buildFVMap e20", expected: "[]" },
        { expr: "buildFVMap e6", expected: "[]" },
      ],
    },
    {
      id: "modifyFunctions",
      name: "modifyFunctions",
      part: "Part III",
      marks: 6,
      prompt: md(
        "Define `modifyFunctions :: [(Id, [Id])] -> Exp -> Exp` that uses a free-variable table (from `buildFVMap`) to change every function definition and every function reference in a program:",
        "",
        "- A definition `(f, Fun as e)` in a `let` becomes `('$' : f, Fun (fvs ++ as) e')`, where `fvs` is `f`'s entry in the table and `e'` is the body, itself modified.",
        "- A reference `Var f`, where `f` is in the table, becomes the partial application `App (Var ('$' : f)) (map Var fvs)`. If `fvs` is empty, it becomes just `Var ('$' : f)`.",
        "- Variables not in the table and constants are unchanged. An application is modified by modifying the function and every argument.",
        "- You don't need a case for `Fun` on its own: functions only appear inside `let` bindings.",
        "",
        "```",
        "*SC> mapper = buildFVMap e1",
        "*SC> putExp (modifyFunctions mapper e1)",
        "let",
        "  $f x = let",
        "      $g x y = + y x",
        "    in $g x",
        "in $f 3 8",
        "*SC> putExp (modifyFunctions (buildFVMap e19) e19)",
        "let",
        "  y = 1",
        "in let",
        "     z = 1",
        "     $f y z x = if <= x y",
        "         then",
        "           y",
        "         else",
        "           ($g y z) x",
        "     $g y z x = * x (($f y z) (- x z))",
        "   in ($f y z) 6",
        "```",
      ),
      hints: [
        "One equation each for `Let`, `Var` and `App`, plus a catch-all that returns the expression unchanged.",
        "In the `Let` case, map a helper over the bindings. The helper has two cases: a function binding `(f, Fun as body)` and any other binding `(v, e)` (whose expression still needs modifying). Then modify the body too.",
        "For `Var v`, use `case lookup v fvMap of` with three branches: `Nothing` (not a function: unchanged), `Just []` (just rename), `Just fvs` (partial application). `'$' : v` puts the dollar sign on the front of the name.",
        md(
          "```haskell",
          "modifyFunctions fvMap (Let bs e) = Let (map modifyBinding bs) (modifyFunctions fvMap e)",
          "  where",
          "    modifyBinding (f, Fun as body) = ('$' : f, Fun (lookUp f fvMap ++ as) (modifyFunctions fvMap body))",
          "    modifyBinding (v, e') = (v, modifyFunctions fvMap e')",
          "modifyFunctions fvMap (Var v)",
          "  = case lookup v fvMap of",
          "      Nothing -> Var v",
          "      Just [] -> Var ('$' : v)",
          "      Just fvs -> App (Var ('$' : v)) (map Var fvs)",
          "modifyFunctions fvMap (App f es) = App (modifyFunctions fvMap f) (map (modifyFunctions fvMap) es)",
          "modifyFunctions _ e = e",
          "```",
        ),
      ],
      solution: hs`modifyFunctions :: [(Id, [Id])] -> Exp -> Exp
modifyFunctions fvMap (Let bs e) = Let (map modifyBinding bs) (modifyFunctions fvMap e)
  where
    modifyBinding (f, Fun as body)
      = ('$' : f, Fun (lookUp f fvMap ++ as) (modifyFunctions fvMap body))
    modifyBinding (v, e') = (v, modifyFunctions fvMap e')
modifyFunctions fvMap (Var v)
  = case lookup v fvMap of
      Nothing -> Var v
      Just [] -> Var ('$' : v)
      Just fvs -> App (Var ('$' : v)) (map Var fvs)
modifyFunctions fvMap (App f es)
  = App (modifyFunctions fvMap f) (map (modifyFunctions fvMap) es)
modifyFunctions _ e = e`,
      tests: [
        {
          expr: "modifyFunctions (buildFVMap e1) e1",
          expected: `Let [("$f", Fun ["x"] (Let [("$g", Fun ["x","y"] (App (Var "+") [Var "y", Var "x"]))] (App (Var "$g") [Var "x"])))] (App (Var "$f") [Const 3, Const 8])`,
        },
        {
          expr: "modifyFunctions (buildFVMap e19) e19",
          expected: `Let [("y",Const 1)] (Let [("z",Const 1),("$f",Fun ["y","z","x"] (App (Var "ite") [App (Var "<=") [Var "x",Var "y"],Var "y",App (App (Var "$g") [Var "y",Var "z"]) [Var "x"]])),("$g",Fun ["y","z","x"] (App (Var "*") [Var "x",App (App (Var "$f") [Var "y",Var "z"]) [App (Var "-") [Var "x",Var "z"]]]))] (App (App (Var "$f") [Var "y",Var "z"]) [Const 6]))`,
        },
        {
          expr: "modifyFunctions (buildFVMap e4) e4",
          expected: `Let [("x",Const 3),("$g",Fun ["x","y"] (App (Var "+") [Var "y",Var "x"]))] (App (App (Var "$g") [Var "x"]) [Const 8])`,
        },
        { expr: "modifyFunctions (buildFVMap e2) e2", expected: "e2'" },
        { expr: "modifyFunctions (buildFVMap e10) e10", expected: "e10'" },
        {
          expr: "modifyFunctions (buildFVMap e11) e11",
          expected: `Let [("k",Const 10),("$addK",Fun ["k","x"] (App (Var "+") [Var "x",Var "k"]))] (App (App (Var "$addK") [Var "k"]) [Const 5])`,
        },
        { expr: `modifyFunctions [("f",["a","b"])] (Var "f")`, expected: `App (Var "$f") [Var "a",Var "b"]` },
        { expr: `modifyFunctions [("f",[])] (Var "f")`, expected: `Var "$f"` },
        { expr: `modifyFunctions [("f",["a"])] (Var "g")`, expected: `Var "g"` },
        { expr: "modifyFunctions [] e20", expected: "e20" },
        { expr: "modifyFunctions (buildFVMap e6) e6", expected: "e6", label: "a program with no functions is unchanged" },
      ],
    },
    {
      id: "lift",
      name: "lift",
      part: "Part III",
      marks: 4,
      prompt: md(
        "Define `lift :: Exp -> Exp` that moves every function definition (they're all supercombinators after `modifyFunctions`) to a single `let` at the very top of the program. Variable bindings stay where they are. If a `let` is left with no bindings, replace `Let [] e` with `e`. If no functions were found at all, don't add a new `let` at the top.",
        "",
        "The suggested approach is a helper `lift' :: Exp -> (Exp, [Supercombinator])` that returns the expression with all function definitions removed, together with the list of definitions it removed. Then `lift` wraps the result in one `let` containing all of them. (`type Supercombinator = Binding`.)",
        "",
        "```",
        "*SC> topLevelFunctions e1",
        "1",
        "*SC> topLevelFunctions (lambdaLift e1)",
        "2",
        "*SC> putExp (lambdaLift e1)",
        "let",
        "  $f x = $g x",
        "  $g x y = + y x",
        "in $f 3 8",
        "*SC> lambdaLift e4 == e4'",
        "True",
        "*SC> lambdaLift e14 == e14'",
        "True",
        "*SC> putExp (lambdaLift e19)",
        "let",
        "  $f y z x = if <= x y",
        "      then",
        "        y",
        "      else",
        "        ($g y z) x",
        "  $g y z x = * x (($f y z) (- x z))",
        "in let",
        "     y = 1",
        "   in let",
        "        z = 1",
        "      in ($f y z) 6",
        "```",
        "",
        "The paper's `e14` isn't printed, so this app's `e14` is its own example: `let a = 2 in let b = + a 1; scale x = * x b; twice x = scale (scale x) in twice a`. The expected lifted forms list a `let`'s own functions first, then any found inside their bodies, then those found in variable bindings, then those found in the body. Some tests use `sortTop`, which sorts the top-level definitions by name, so any order you choose is accepted there. Other tests check that the lifted program computes the same number, using a given evaluator `run`.",
      ),
      hints: [
        "Write `lift'` by cases. `Const` and `Var` return themselves with `[]`. `App` lifts the function and each argument (`unzip (map lift' es)` is handy) and joins all the lists found. The `Let` case does the real work.",
        "For `Let bs e`: split the bindings with `splitDefs`. Lift the body, every function body and every variable binding's expression. The function bindings (with lifted bodies) go into the result list, together with everything found inside them. The variable bindings stay in a `let` around the lifted body.",
        "Write a tiny helper `makeLet [] e = e` and `makeLet bs e = Let bs e`. Use it when rebuilding the inner `let`, and again in `lift` to wrap the top: `lift e = makeLet scs e'` where `(e', scs) = lift' e`.",
        md(
          "```haskell",
          "lift' (Let bs e) = (makeLet vs' e', scs ++ concat scss ++ concat vscss ++ escs)",
          "  where",
          "    (fs, vs) = splitDefs bs",
          "    (e', escs) = lift' e",
          "    liftedFs = [((f, Fun as b'), bscs) | (f, Fun as b) <- fs, let (b', bscs) = lift' b]",
          "    scs = map fst liftedFs",
          "    scss = map snd liftedFs",
          "    liftedVs = [((v, b'), bscs) | (v, b) <- vs, let (b', bscs) = lift' b]",
          "    vs' = map fst liftedVs",
          "    vscss = map snd liftedVs",
          "```",
        ),
      ],
      solution: hs`lift :: Exp -> Exp
lift e = makeLet scs e'
  where
    (e', scs) = lift' e

-- Returns the expression with every function definition removed,
-- and the list of definitions that were removed.
lift' :: Exp -> (Exp, [Supercombinator])
lift' (Let bs e) = (makeLet vs' e', scs ++ concat scss ++ concat vscss ++ escs)
  where
    (fs, vs) = splitDefs bs
    (e', escs) = lift' e
    liftedFs = [((f, Fun as b'), bscs) | (f, Fun as b) <- fs, let (b', bscs) = lift' b]
    scs = map fst liftedFs
    scss = map snd liftedFs
    liftedVs = [((v, b'), bscs) | (v, b) <- vs, let (b', bscs) = lift' b]
    vs' = map fst liftedVs
    vscss = map snd liftedVs
lift' (App f es) = (App f' es', fscs ++ concat escss)
  where
    (f', fscs) = lift' f
    (es', escss) = unzip (map lift' es)
lift' (Fun as e) = (Fun as e', scs)
  where
    (e', scs) = lift' e
lift' e = (e, [])

-- Let [] e is just e
makeLet :: [Binding] -> Exp -> Exp
makeLet [] e = e
makeLet bs e = Let bs e`,
      tests: [
        { expr: "lambdaLift e1", expected: "e1'" },
        { expr: "topLevelFunctions (lambdaLift e1)", expected: "2" },
        { expr: "lambdaLift e4", expected: "e4'" },
        { expr: "lambdaLift e14", expected: "e14'" },
        { expr: "lambdaLift e19", expected: "e19'" },
        { expr: "lambdaLift e3", expected: "e3'" },
        { expr: "sortTop (lambdaLift e13)", expected: "sortTop e13'" },
        { expr: "sortTop (lambdaLift e17)", expected: "sortTop e17'" },
        { expr: "lambdaLift e15", expected: "e15'", label: "lambdaLift e15 == e15' (a function inside a variable binding)" },
        { expr: "lambdaLift e16", expected: "e16'", label: "lambdaLift e16 == e16' (a function inside an argument)" },
        { expr: "lambdaLift e18", expected: "e18'", label: "lambdaLift e18 == e18' (a let with only variables stays put)" },
        { expr: "lift e20", expected: "e20" },
        {
          expr: "[run (lambdaLift e) | e <- [e1, e3, e10, e13, e14, e17, e19]]",
          expected: "[run e | e <- [e1, e3, e10, e13, e14, e17, e19]]",
          label: "lifted programs compute the same answers",
        },
      ],
    },
  ],
};
