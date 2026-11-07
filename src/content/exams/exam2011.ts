import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "y2011",
  year: 2011,
  title: "Type Inference",
  summary: "Work out the type of expressions in a tiny Haskell-like language, first without type variables and then with unification.",
  skills: [
    "association lists",
    "table look-up",
    "reverse look-up",
    "recursion over trees",
    "algebraic data types",
    "Maybe for failure",
    "worklist algorithms",
    "threading state through recursion",
  ],
  story: md(
    "## What is type inference?",
    "",
    "When you leave out a type signature, GHC works the type out for you. Given `f x = 1 + x`, it reasons: `+` needs two Ints, so `x` must be an Int, and the answer is an Int, so `f :: Int -> Int`. Working types out automatically like this is called type inference. In this exam you write a type inferencer for a tiny language.",
    "",
    "## The tiny language",
    "",
    "It has Int and Bool constants, variables, four built-in (\"primitive\") functions and if-then-else. Primitives are always written in front of their arguments (prefix form), one argument at a time:",
    "",
    "```",
    hs`+   :: Int -> Int -> Int
>   :: Int -> Int -> Bool
==  :: Int -> Int -> Bool
not :: Bool -> Bool`,
    "```",
    "",
    "Expressions are values of this type:",
    "",
    "```",
    hs`data Expr = Number Int | Boolean Bool | Id String | Prim String
          | Cond Expr Expr Expr | App Expr Expr | Fun String Expr`,
    "```",
    "",
    "- `Number 6` and `Boolean False` are constants.",
    "- `Id \"x\"` is a variable called x.",
    "- `Prim \"+\"` is one of the four primitive functions, named by a string.",
    "- `Cond c t e` is `if c then t else e`.",
    "- `App f a` applies the function `f` to ONE argument `a`. Two arguments means two `App`s: `+ y 1` is `App (App (Prim \"+\") (Id \"y\")) (Number 1)`.",
    "- `Fun \"x\" e` is the anonymous function `\\x -> e`. Ignore it until Part IV.",
    "",
    "## Types",
    "",
    "```",
    hs`data Type = TInt | TBool | TFun Type Type | TErr | TVar String`,
    "```",
    "",
    "- `TInt` and `TBool` are Int and Bool.",
    "- `TFun a b` is the function type `a -> b`. So `>` has type `TFun TInt (TFun TInt TBool)`, which is `Int -> (Int -> Bool)`.",
    "- `TErr` means \"type error\": the expression doesn't make sense, e.g. `not 1`.",
    "- `TVar \"a\"` is a type variable: \"some type, we don't know which yet\", like the `a` in `id :: a -> a`. Ignore it until Part III.",
    "",
    "`showT` (given) prints a type the Haskell way, e.g. `showT (TFun TInt TBool)` is `\"(Int -> Bool)\"`. Don't make `Type` an instance of `Show` yourself, it would break the tests.",
    "",
    "A type environment `TEnv` is a table from variable names to their types, e.g. `[(\"x\",TInt),(\"b\",TBool)]`. The table `primTypes` gives the types of the four primitives.",
    "",
    "## The simple rules (Parts I and II)",
    "",
    "- Constants: `Number` has type `TInt`, `Boolean` has type `TBool`.",
    "- `Id x`: look `x` up in the environment.",
    "- `Prim p`: look `p` up in `primTypes`.",
    "- `Cond c t e`: `c` must have type `TBool` and `t` and `e` must have the same type, which is then the type of the whole thing. Otherwise `TErr`.",
    "- `App f a`: `f` must have a function type `TFun t t'` and `a` must have type `t`. Then the result has type `t'`. Otherwise `TErr`.",
    "",
    "For example, with x and y both Int, `+ y` has type `Int -> Int` (`+` took its first Int), and `+ y 1` has type `Int`.",
    "",
    "## Type variables, substitutions and unification (Parts III and IV)",
    "",
    "Once types can contain variables, \"are these two types the same?\" becomes \"can they be MADE the same by choosing what the variables stand for?\".",
    "",
    "A substitution is a table saying what each type variable stands for, e.g. `[(\"a\",TBool),(\"b\",TInt)]`. Applying it to a type replaces each variable by its entry. Applying that one to `TFun (TVar \"a\") (TVar \"b\")` gives `TFun TBool TInt`.",
    "",
    "Unification means finding a substitution that makes two types equal:",
    "",
    "```",
    hs`Int -> a     and   b -> Bool     unify with  a = Bool, b = Int
Bool         and   Int -> Bool   don't unify (one is not a function)
a -> a       and   a             don't unify (a would have to contain itself)`,
    "```",
    "",
    "The last case is caught by the occurs check: a variable can't be bound to a type that contains that same variable, or it would be infinitely big.",
    "",
    "Unification results use `Maybe`: `Just s` for success with substitution `s`, `Nothing` for failure.",
  ),
  notes: md(
    "Parts I to III are worth 28 of 30 marks. Part IV is very hard and worth 2 marks (+1 bonus); only try it once everything else works.",
    "",
    "The biggest single item is `inferType` (10 marks), and it only needs the Part I look-ups. Do Part I quickly (8 marks), then `inferType`. If you get stuck on `inferType`, `applySub` (Part III, 2 marks) is a quick independent win.",
    "",
    "`unifyPairs` (8 marks) is a direct translation of the algorithm's bullet points into pattern-matching equations. Write one equation per bullet, in the same order, and finish with a catch-all `Nothing`.",
    "",
    "Traps:",
    "",
    "- In `inferType` for `Cond`, check the condition is `TBool` AND that both branches are equal. For `App`, the argument type must equal the function's domain (input) type exactly.",
    "- In `unifyPairs`, the case of two equal type variables must come BEFORE the general type-variable case, or you'll bind `a` to `TVar \"a\"` and fail the occurs check.",
    "- After binding `(v, t)`, apply `[(v, t)]` to BOTH types of EVERY remaining pair.",
    "- Don't make `Type` an instance of `Show`: it already derives `Show`.",
  ),
  setup: hs`import Data.List (sort)

-- Ignore the Fun constructor for Parts I-III
data Expr = Number Int |
            Boolean Bool |
            Id String |
            Prim String |
            Cond Expr Expr Expr |
            App Expr Expr |
            Fun String Expr
          deriving (Eq, Ord, Show)

-- Ignore the TVar constructor for Parts I-II
data Type = TInt |
            TBool |
            TFun Type Type |
            TErr |
            TVar String
          deriving (Eq, Ord, Show)

showT :: Type -> String
showT TInt
  = "Int"
showT TBool
  = "Bool"
showT (TFun t t')
  = "(" ++ showT t ++ " -> " ++ showT t' ++ ")"
showT (TVar a)
  = a
showT TErr
  = "Type error"

type TypeTable = [(String, Type)]

type TEnv = TypeTable    -- i.e. [(String, Type)]

type Sub = TypeTable     -- i.e. [(String, Type)]

-- Built-in function types...
primTypes :: TypeTable
primTypes
  = [("+", TFun TInt (TFun TInt TInt)),
     (">", TFun TInt (TFun TInt TBool)),
     ("==", TFun TInt (TFun TInt TBool)),
     ("not", TFun TBool TBool)]

unify :: Type -> Type -> Maybe Sub
unify t t'
  = unifyPairs [(t, t')] []

updateTEnv :: TEnv -> Sub -> TEnv
updateTEnv tenv tsub
  = map modify tenv
  where
    modify (v, t) = (v, applySub tsub t)

combine :: Sub -> Sub -> Sub
combine sNew sOld
  = sNew ++ updateTEnv sOld sNew

-- In combineSubs [s1, s2,..., sn], s1 should be the *most recent* substitution
-- and will be applied *last*
combineSubs :: [Sub] -> Sub
combineSubs
  = foldr1 combine

------------------------------------------------------
-- Examples

env :: TEnv
env
  = [("x",TInt),("y",TInt),("b",TBool),("c",TBool)]

ex1, ex2, ex3, ex4, ex5, ex6, ex7, ex8 :: Expr
type1, type2, type3, type4, type5, type6, type7, type8 :: Type

ex1 = Number 9
type1 = TInt

ex2 = Boolean False
type2 = TBool

ex3 = Prim "not"
type3 = TFun TBool TBool

ex4 = App (Prim "not") (Boolean True)
type4 = TBool

ex5 = App (Prim ">") (Number 0)
type5 = TFun TInt TBool

ex6 = App (App (Prim "+") (Boolean True)) (Number 5)
type6 = TErr

ex7 = Cond (Boolean True) (Boolean False) (Id "c")
type7 = TBool

ex8 = Cond (App (Prim "==") (Number 4)) (Id "b") (Id "c")
type8 = TErr

-- Examples for inferPolyType
ex9, ex10, ex11, ex12, ex13, ex14 :: Expr
type9, type10, type11, type12, type13, type14 :: Type

ex9 = Fun "x" (Boolean True)
type9 = TFun (TVar "a1") TBool

ex10 = Fun "x" (Id "x")
type10 = TFun (TVar "a1") (TVar "a1")

ex11 = Fun "x" (App (Prim "not") (Id "x"))
type11 = TFun TBool TBool

ex12 = Fun "x" (Fun "y" (App (Id "y") (Id "x")))
type12 = TFun (TVar "a1") (TFun (TFun (TVar "a1") (TVar "a3")) (TVar "a3"))

ex13 = Fun "x" (Fun "y" (App (App (Id "y") (Id "x")) (Number 7)))
type13 = TFun (TVar "a1") (TFun (TFun (TVar "a1") (TFun TInt (TVar "a3")))
                                (TVar "a3"))

ex14 = Fun "x" (Fun "y" (App (Id "x") (Prim "+")))
type14 = TFun (TFun (TFun TInt (TFun TInt TInt)) (TVar "a3"))
              (TFun (TVar "a2") (TVar "a3"))

-- Example expression from Section 2.1
exCond :: Expr
exCond
  = Cond (App (Prim "not") (App (App (Prim ">") (Id "x")) (Id "y")))
         (Id "x")
         (App (App (Prim "+") (Id "y")) (Number 1))

------------------------------------------------------
-- Test helper (not part of the exam): are two types the same
-- up to a consistent renaming of their type variables?

alphaEq :: Type -> Type -> Bool
alphaEq t t'
  = renameVars t == renameVars t'
  where
    renameVars ty = rename (zip (distinct (varsOf ty)) [1 :: Int ..]) ty
    varsOf (TVar v) = [v]
    varsOf (TFun a b) = varsOf a ++ varsOf b
    varsOf _ = []
    distinct [] = []
    distinct (v : vs) = v : distinct (filter (/= v) vs)
    rename m (TVar v) = TVar ("v" ++ maybe "?" show (Prelude.lookup v m))
    rename m (TFun a b) = TFun (rename m a) (rename m b)
    rename _ other = other
`,
  starter: hs`-- Part I

lookUp :: Eq a => a -> [(a, b)] -> b
lookUp = undefined

tryToLookUp :: Eq a => a -> b -> [(a, b)] -> b
tryToLookUp = undefined

reverseLookUp :: Eq b => b -> [(a, b)] -> [a]
reverseLookUp = undefined

occurs :: String -> Type -> Bool
occurs = undefined

-- Part II

-- Given an expression and a type environment, infers its type.
inferType :: Expr -> TEnv -> Type
inferType = undefined

-- Part III

applySub :: Sub -> Type -> Type
applySub = undefined

unifyPairs :: [(Type, Type)] -> Sub -> Maybe Sub
unifyPairs = undefined

-- Part IV

inferPolyType :: Expr -> Type
inferPolyType = undefined

inferPolyType' :: Expr -> TEnv -> [String] -> (Sub, Type, [String])
inferPolyType' = undefined
`,
  tasks: [
    {
      id: "lookups",
      name: "lookUp tryToLookUp",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Write two look-up functions for tables of (item, value) pairs.",
        "",
        "(a) `lookUp :: Eq a => a -> [(a, b)] -> b` returns the value for an item. A precondition is that the item is in the table.",
        "",
        "(b) `tryToLookUp :: Eq a => a -> b -> [(a, b)] -> b` returns the value for an item, or the given default value (second argument) if the item isn't in the table.",
        "",
        "```",
        hs`*Main> lookUp "x" [("hello",1),("x",9),("dolly",1)]
9
*Main> lookUp "not" primTypes
TFun TBool TBool
*Main> tryToLookUp "k" 0 [("hello",1),("x",9),("dolly",1)]
0`,
        "```",
        "",
        "Hint from the spec: you can define `lookUp` in terms of `tryToLookUp` by passing `undefined` as the default.",
      ),
      hints: [
        "Write `tryToLookUp` first, by recursion on the table; then `lookUp` is one line.",
        "`tryToLookUp` on an empty table returns the default. On `(k, v) : rest`, return `v` if `k` matches, otherwise keep looking in `rest`.",
        "Passing `undefined` as the default is safe for `lookUp` because of laziness: it is only evaluated if the item is missing, which the precondition rules out.",
        md(
          "```",
          hs`tryToLookUp _ d [] = d
tryToLookUp x d ((k, v) : rest)
  | x == k    = v
  | otherwise = tryToLookUp x d rest

lookUp x table = tryToLookUp x undefined table`,
          "```",
        ),
      ],
      solution: hs`lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x table
  = tryToLookUp x undefined table

tryToLookUp :: Eq a => a -> b -> [(a, b)] -> b
tryToLookUp _ def []
  = def
tryToLookUp x def ((k, v) : rest)
  | x == k    = v
  | otherwise = tryToLookUp x def rest`,
      tests: [
        { expr: 'lookUp "x" [("hello",1),("x",9),("dolly",1)]', expected: "9" },
        { expr: 'lookUp "not" primTypes', expected: "TFun TBool TBool" },
        { expr: 'lookUp ">" primTypes', expected: "TFun TInt (TFun TInt TBool)" },
        { expr: 'tryToLookUp "k" 0 [("hello",1),("x",9),("dolly",1)]', expected: "0" },
        { expr: 'tryToLookUp "dolly" 0 [("hello",1),("x",9),("dolly",1)]', expected: "1" },
        { expr: 'tryToLookUp "a" TInt []', expected: "TInt", label: "empty table gives the default" },
        { expr: 'tryToLookUp "b" (TVar "b") [("a",TBool),("b",TFun TBool TInt)]', expected: "TFun TBool TInt" },
        { expr: "lookUp 3 [(1,'a'),(3,'c')]", expected: "'c'" },
      ],
    },
    {
      id: "reverselookup",
      name: "reverseLookUp",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Write `reverseLookUp :: Eq b => b -> [(a, b)] -> [a]`. Given a value, it returns all the items paired with that value (the opposite direction to a normal look-up).",
        "",
        "```",
        hs`*Main> reverseLookUp 1 [("hello",1),("x",9),("dolly",1)]
["hello","dolly"]
*Main> reverseLookUp (TFun TInt (TFun TInt TBool)) primTypes
[">","=="]`,
        "```",
      ),
      hints: [
        "A list comprehension that keeps some pairs and returns their first component.",
        "Go through every `(k, v)` in the table and keep `k` when `v` equals the given value.",
        "If nothing matches the answer is `[]`, which a comprehension gives you for free.",
        "`reverseLookUp x table = [k | (k, v) <- table, v == x]`",
      ],
      solution: hs`reverseLookUp :: Eq b => b -> [(a, b)] -> [a]
reverseLookUp x table
  = [k | (k, v) <- table, v == x]`,
      tests: [
        { expr: 'reverseLookUp 1 [("hello",1),("x",9),("dolly",1)]', expected: '["hello","dolly"]', unordered: true },
        { expr: "reverseLookUp (TFun TInt (TFun TInt TBool)) primTypes", expected: '[">","=="]', unordered: true },
        { expr: 'reverseLookUp 9 [("hello",1),("x",9),("dolly",1)]', expected: '["x"]' },
        { expr: 'reverseLookUp 5 [("hello",1),("x",9),("dolly",1)]', expected: "[]" },
        { expr: "reverseLookUp TBool ([] :: TEnv)", expected: "[]" },
        { expr: "reverseLookUp TBool env", expected: '["b","c"]', unordered: true },
      ],
    },
    {
      id: "occurs",
      name: "occurs",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Write `occurs :: String -> Type -> Bool`, which is True exactly when the type variable with the given name appears somewhere in the type. A variable occurs in `TFun t t'` if it occurs in either `t` or `t'`.",
        "",
        "```",
        hs`*Main> occurs "x" (TVar "y")
False
*Main> occurs "x" TBool
False
*Main> occurs "x" (TFun TBool (TVar "x"))
True`,
        "```",
      ),
      hints: [
        "Recursion over the `Type`, one equation per kind of constructor.",
        "`TVar v'`: compare names. `TFun t t'`: look in both halves. Anything else (`TInt`, `TBool`, `TErr`) contains no variables.",
        "Use `||` to combine the two halves of a `TFun`.",
        md(
          "```",
          hs`occurs v (TVar v')  = v == v'
occurs v (TFun t t') = occurs v t || occurs v t'
occurs _ _           = False`,
          "```",
        ),
      ],
      solution: hs`occurs :: String -> Type -> Bool
occurs v (TVar v')
  = v == v'
occurs v (TFun t t')
  = occurs v t || occurs v t'
occurs _ _
  = False`,
      tests: [
        { expr: 'occurs "x" (TVar "y")', expected: "False" },
        { expr: 'occurs "x" TBool', expected: "False" },
        { expr: 'occurs "x" (TFun TBool (TVar "x"))', expected: "True" },
        { expr: 'occurs "x" (TVar "x")', expected: "True" },
        { expr: 'occurs "a" (TFun (TFun (TVar "a") TInt) TBool)', expected: "True", label: "deep inside the left of a function type" },
        { expr: 'occurs "a" (TFun TInt (TFun TBool (TVar "b")))', expected: "False" },
        { expr: 'occurs "a" TErr', expected: "False" },
        { expr: 'occurs "a" TInt', expected: "False" },
      ],
    },
    {
      id: "infertype",
      name: "inferType",
      part: "Part II",
      marks: 10,
      prompt: md(
        "Write `inferType :: Expr -> TEnv -> Type`, which infers the type of an expression (with no `Fun` in it) using the rules from the introduction:",
        "",
        "1. `Number _` is `TInt`; `Boolean _` is `TBool`.",
        "2. `Id x` is the type of `x` in the environment (it is guaranteed to be there).",
        "3. `Prim p` is the type of `p` in `primTypes`.",
        "4. `Cond c t e`: if `c` has type `TBool` and `t` and `e` have the same type, that type; otherwise `TErr`.",
        "5. `App f a`: if `f` has type `TFun t t'` and `a` has type `t`, then `t'`; otherwise `TErr`.",
        "",
        "Examples from the template, all using `env = [(\"x\",TInt),(\"y\",TInt),(\"b\",TBool),(\"c\",TBool)]`:",
        "",
        "```",
        hs`e                                                  inferType e env
Number 9                                           TInt
Boolean False                                      TBool
Prim "not"                                         TFun TBool TBool
App (Prim "not") (Boolean True)                    TBool
App (Prim ">") (Number 0)                          TFun TInt TBool
App (App (Prim "+") (Boolean True)) (Number 5)     TErr
Cond (Boolean True) (Boolean False) (Id "c")       TBool
Cond (App (Prim "==") (Number 4)) (Id "b") (Id "c") TErr`,
        "```",
        "",
        "These are `ex1` to `ex8` with expected types `type1` to `type8` in the setup. The spec's worked example `if not (> x y) then x else + y 1` is `exCond`, and has type `TInt`.",
      ),
      hints: [
        "Structural recursion over `Expr`: one equation per constructor (no `Fun`). Use `lookUp` for `Id` and `Prim`. The spec suggests a helper `inferApp` for applications.",
        "`inferApp :: Type -> Type -> Type` takes the type of the function and the type of the argument. If the first is `TFun t t'` and `t` equals the argument type, return `t'`; any other combination gives `TErr`.",
        "For `Cond`, infer all three parts recursively first (name them in a `where`). Note that if `f` is `TErr`, `inferApp` must give `TErr`, which the catch-all equation handles.",
        md(
          "```",
          hs`inferType (Cond c t e) tenv
  | tc == TBool && tt == te = tt
  | otherwise               = TErr
  where
    tc = inferType c tenv
    tt = inferType t tenv
    te = inferType e tenv
inferType (App f a) tenv = inferApp (inferType f tenv) (inferType a tenv)

inferApp (TFun t t') ta
  | t == ta = t'
inferApp _ _ = TErr`,
          "```",
        ),
      ],
      solution: hs`inferType :: Expr -> TEnv -> Type
inferType (Number _) _
  = TInt
inferType (Boolean _) _
  = TBool
inferType (Id x) tenv
  = lookUp x tenv
inferType (Prim p) _
  = lookUp p primTypes
inferType (Cond c t e) tenv
  | tc == TBool && tt == te = tt
  | otherwise               = TErr
  where
    tc = inferType c tenv
    tt = inferType t tenv
    te = inferType e tenv
inferType (App f a) tenv
  = inferApp (inferType f tenv) (inferType a tenv)

-- The type of applying a function of the first type to an argument
-- of the second type.
inferApp :: Type -> Type -> Type
inferApp (TFun t t') ta
  | t == ta = t'
inferApp _ _
  = TErr`,
      tests: [
        { expr: "inferType ex1 env", expected: "type1" },
        { expr: "inferType ex2 env", expected: "type2" },
        { expr: "inferType ex3 env", expected: "type3" },
        { expr: "inferType ex4 env", expected: "type4" },
        { expr: "inferType ex5 env", expected: "type5" },
        { expr: "inferType ex6 env", expected: "type6" },
        { expr: "inferType ex7 env", expected: "type7" },
        { expr: "inferType ex8 env", expected: "type8" },
        { expr: 'inferType exCond [("x",TInt),("y",TInt)]', expected: "TInt", label: "the Section 2.1 example: if not (> x y) then x else + y 1" },
        { expr: 'inferType (App (Prim "+") (Id "y")) env', expected: "TFun TInt TInt" },
        { expr: 'inferType (Cond (Id "b") (Number 1) (Boolean True)) env', expected: "TErr", label: "branches of different types" },
        { expr: "inferType (App (Number 1) (Number 2)) env", expected: "TErr", label: "applying something that isn't a function" },
        { expr: 'inferType (App (Prim "not") (App (Prim "not") (Number 3))) env', expected: "TErr", label: "an error deep inside spreads outwards" },
      ],
    },
    {
      id: "applysub",
      name: "applySub",
      part: "Part III",
      marks: 2,
      prompt: md(
        "Using `tryToLookUp`, write `applySub :: Sub -> Type -> Type`, which applies a substitution to a type: every `TVar v` is replaced by the binding for `v` in the substitution, if there is one. If there isn't, the variable is left as it is.",
        "",
        "With `s = [(\"a\",TBool),(\"b\",TFun TBool TInt)]`:",
        "",
        "```",
        hs`*Main> applySub s TInt
TInt
*Main> applySub s (TFun TBool (TVar "a"))
TFun TBool TBool
*Main> applySub s (TVar "c")
TVar "c"`,
        "```",
      ),
      hints: [
        "Recursion over the type, very like `occurs`.",
        "`TVar v` is the interesting case; `TFun` recurses into both halves; everything else is returned unchanged.",
        "For `TVar v`, \"the binding if there is one, otherwise leave it\" is exactly `tryToLookUp` with `TVar v` as the default.",
        md(
          "```",
          hs`applySub s (TVar v)    = tryToLookUp v (TVar v) s
applySub s (TFun t t') = TFun (applySub s t) (applySub s t')
applySub _ t           = t`,
          "```",
        ),
      ],
      solution: hs`applySub :: Sub -> Type -> Type
applySub s (TVar v)
  = tryToLookUp v (TVar v) s
applySub s (TFun t t')
  = TFun (applySub s t) (applySub s t')
applySub _ t
  = t`,
      tests: [
        { expr: 'applySub [("a",TBool),("b",TFun TBool TInt)] TInt', expected: "TInt" },
        { expr: 'applySub [("a",TBool),("b",TFun TBool TInt)] (TFun TBool (TVar "a"))', expected: "TFun TBool TBool" },
        { expr: 'applySub [("a",TBool),("b",TFun TBool TInt)] (TVar "c")', expected: 'TVar "c"' },
        { expr: 'applySub [("a",TBool),("b",TFun TBool TInt)] (TFun (TVar "b") (TVar "a"))', expected: "TFun (TFun TBool TInt) TBool" },
        { expr: 'applySub [] (TFun (TVar "a") TInt)', expected: 'TFun (TVar "a") TInt' },
        { expr: 'applySub [("a",TInt)] (TFun (TVar "a") (TFun (TVar "a") (TVar "z")))', expected: 'TFun TInt (TFun TInt (TVar "z"))' },
        { expr: 'applySub [("a",TInt)] TErr', expected: "TErr" },
      ],
    },
    {
      id: "unifypairs",
      name: "unifyPairs",
      part: "Part III",
      marks: 8,
      prompt: md(
        "Write `unifyPairs :: [(Type, Type)] -> Sub -> Maybe Sub`, the Martelli-Montanari unification algorithm. It works on a list of pairs of types that must be made equal, and a substitution built up so far (initially `[]`). The given top-level function is:",
        "",
        "```",
        hs`unify :: Type -> Type -> Maybe Sub
unify t t'
  = unifyPairs [(t, t')] []`,
        "```",
        "",
        "Look at the pair at the head of the list:",
        "",
        "- Two `TInt`s, or two `TBool`s: they already match. Drop the pair and carry on with the rest; the substitution is unchanged.",
        "- Two type variables with the same name: also drop the pair and carry on.",
        "- Otherwise, if one side is a type variable `TVar v` and the other side is some type `t`: if `v` occurs in `t`, FAIL (this is the occurs check). If not, add the binding `(v, t)` to the front of the substitution, apply the substitution `[(v, t)]` to both types of every remaining pair, and carry on.",
        "- Two function types `TFun t1 t2` and `TFun t1' t2'`: replace the pair with the two pairs `(t1, t1')` and `(t2, t2')` (at the front is fine) and carry on.",
        "- Anything else: FAIL.",
        "",
        "When the list of pairs is empty you have succeeded: return `Just` the substitution. Failure is `Nothing`.",
        "",
        "For example, if the head is `(TVar \"a\", TInt)` and the rest is",
        "",
        "```",
        hs`[(TBool, TBool), (TFun (TVar "a") (TVar "b"), TVar "c"), (TInt, TVar "a")]`,
        "```",
        "",
        "then you add `(\"a\", TInt)` to the substitution and continue with",
        "",
        "```",
        hs`[(TBool, TBool), (TFun TInt (TVar "b"), TVar "c"), (TInt, TInt)]`,
        "```",
        "",
        "Examples (Table 2 of the spec):",
        "",
        "```",
        hs`t                       t'                       unify t t'
TFun (TVar "a") TInt    TVar "b"                 Just [("b",TFun (TVar "a") TInt)]
TFun TBool TBool        TFun TBool TBool         Just []
TFun (TVar "a") TInt    TFun TBool TInt          Just [("a",TBool)]
TBool                   TFun TInt TBool          Nothing
TFun (TVar "a") TInt    TFun TBool (TVar "b")    Just [("b",TInt),("a",TBool)]
TFun (TVar "a") (TVar "a")  TVar "a"             Nothing`,
        "```",
        "",
        "The order of the bindings in the substitution doesn't matter (the tests sort them).",
      ),
      hints: [
        "Translate each bullet into one pattern-matching equation on the head pair, in the same order. Use `occurs` for the occurs check and `applySub` to update the remaining pairs.",
        "Equations: `[]` gives `Just s`; `(TInt, TInt) : rest` and `(TBool, TBool) : rest` recurse on `rest`; `(TVar v, TVar v') : rest` with guard `v == v'` recurses on `rest`; then `(TVar v, t) : rest` and `(t, TVar v) : rest`; then the two `TFun`s; then `_ _ = Nothing`.",
        "Put the equal-variables equation before the general variable equations. If its guard fails, Haskell falls through to the next equation, which is what you want for two different variables. Write a helper for the variable case so you don't repeat it for both sides.",
        md(
          "```",
          hs`unifyPairs ((TVar v, t) : rest) s = bindVar v t rest s
unifyPairs ((t, TVar v) : rest) s = bindVar v t rest s
unifyPairs ((TFun t1 t2, TFun t1' t2') : rest) s
  = unifyPairs ((t1, t1') : (t2, t2') : rest) s
unifyPairs _ _ = Nothing

bindVar v t rest s
  | occurs v t = Nothing
  | otherwise  = unifyPairs [(applySub b x, applySub b y) | (x, y) <- rest] ((v, t) : s)
  where b = [(v, t)]`,
          "```",
        ),
      ],
      solution: hs`unifyPairs :: [(Type, Type)] -> Sub -> Maybe Sub
unifyPairs [] s
  = Just s
unifyPairs ((TInt, TInt) : rest) s
  = unifyPairs rest s
unifyPairs ((TBool, TBool) : rest) s
  = unifyPairs rest s
unifyPairs ((TVar v, TVar v') : rest) s
  | v == v' = unifyPairs rest s
unifyPairs ((TVar v, t) : rest) s
  = bindTVar v t rest s
unifyPairs ((t, TVar v) : rest) s
  = bindTVar v t rest s
unifyPairs ((TFun t1 t2, TFun t1' t2') : rest) s
  = unifyPairs ((t1, t1') : (t2, t2') : rest) s
unifyPairs _ _
  = Nothing

-- Binds v to t (after the occurs check) and applies the binding
-- to all the remaining pairs.
bindTVar :: String -> Type -> [(Type, Type)] -> Sub -> Maybe Sub
bindTVar v t rest s
  | occurs v t = Nothing
  | otherwise
    = unifyPairs [(applySub b x, applySub b y) | (x, y) <- rest] ((v, t) : s)
  where
    b = [(v, t)]`,
      tests: [
        { expr: 'fmap sort (unify (TFun (TVar "a") TInt) (TVar "b"))', expected: 'Just [("b",TFun (TVar "a") TInt)]' },
        { expr: "unify (TFun TBool TBool) (TFun TBool TBool)", expected: "Just []" },
        { expr: 'fmap sort (unify (TFun (TVar "a") TInt) (TFun TBool TInt))', expected: 'Just [("a",TBool)]' },
        { expr: "unify TBool (TFun TInt TBool)", expected: "Nothing" },
        { expr: 'fmap sort (unify (TFun (TVar "a") TInt) (TFun TBool (TVar "b")))', expected: 'Just (sort [("b",TInt),("a",TBool)])' },
        { expr: 'unify (TFun (TVar "a") (TVar "a")) (TVar "a")', expected: "Nothing", label: "the occurs check" },
        { expr: 'unify (TVar "a") (TVar "a")', expected: "Just []", label: "a variable unifies with itself, with no binding" },
        { expr: "unify TInt TBool", expected: "Nothing" },
        { expr: 'fmap sort (unifyPairs [(TVar "a", TInt), (TBool, TBool), (TFun (TVar "a") (TVar "b"), TVar "c"), (TInt, TVar "a")] [])', expected: 'Just (sort [("c",TFun TInt (TVar "b")),("a",TInt)])', label: "the Section 4.1 example" },
        { expr: 'unifyPairs [(TVar "a", TInt), (TVar "a", TBool)] []', expected: "Nothing", label: "a can't be both Int and Bool" },
        { expr: 'fmap sort (unifyPairs [] [("z",TInt)])', expected: 'Just [("z",TInt)]', label: "nothing left to do: return the substitution so far" },
        { expr: 'unify (TFun TInt (TVar "a")) (TFun (TVar "a") (TFun TInt TInt))', expected: "Nothing", label: "a = Int, then Int must equal Int -> Int" },
      ],
    },
    {
      id: "inferpolytype",
      name: "inferPolyType",
      part: "Part IV",
      marks: 3,
      prompt: md(
        "Part IV (2 marks for the `Fun` rule, plus 1 bonus mark for the `App` rule; the `Cond` rule earns no marks and is for prize candidates). Do NOT change `inferType`. Instead write a new function `inferPolyType :: Expr -> Type` that handles user-defined functions: `Fun \"x\" e` means `\\x -> e`.",
        "",
        "Use the helper `inferPolyType' :: Expr -> TEnv -> [String] -> (Sub, Type, [String])`. It takes the expression, the type environment, and a supply of fresh (never used before) type variable names, e.g. `[\"a1\", \"a2\", \"a3\", ...]`. It returns a substitution (extra things it learnt about the type variables in the environment), the type, and the unused names. Then `inferPolyType e` runs the helper with an empty environment and keeps only the type. (The spec also allows an `Int` counter instead of a list of names; the starter uses the list.)",
        "",
        "Rules:",
        "",
        "- `Number`, `Boolean`, `Prim`, `Id`: as in `inferType`, with the empty substitution `[]` and the names unchanged.",
        "- `Fun x e`: take a fresh name `a`. Infer `e` in the environment extended with `(x, TVar a)`, giving `(s, te, names')`. The result type is `TFun (applySub s (TVar a)) te` (the recursive call may have discovered what `a` is), with substitution `s`. If `te` is `TErr` the result is `TErr`.",
        "- `App f e` (bonus): infer `f` giving `(s1, tf, ...)`. Infer `e` in the environment `updateTEnv env s1`, giving `(s2, te, ...)`. Take a fresh name `a` and unify `tf` with `TFun te (TVar a)`. If that fails the type is `TErr`; if it gives `s`, the result type is `applySub s (TVar a)` and the substitution is `combineSubs [s, s2, s1]` (most recent first).",
        "- `Cond` (prize only): work it out yourself!",
        "",
        "```",
        hs`*Main> showT (inferPolyType ex9)        -- \x -> True
"(a1 -> Bool)"
*Main> showT (inferPolyType ex10)       -- \x -> x
"(a1 -> a1)"
*Main> showT (inferPolyType ex11)       -- \x -> not x
"(Bool -> Bool)"
*Main> showT (inferPolyType ex12)       -- \x -> \y -> y x
"(a1 -> ((a1 -> a3) -> a3))"`,
        "```",
        "",
        "Your type variable names may differ from the examples (`type9` to `type14`). The tests accept any consistent renaming.",
      ),
      hints: [
        "Start with the base cases and `Fun` (they can be tested on `ex9` and `ex10` without `App`). Each case returns a triple `(substitution, type, remaining names)`; always pass the names you didn't use on to the next call.",
        "`inferPolyType e = t where (_, t, _) = inferPolyType' e [] [\"a\" ++ show n | n <- [1..]]`. For `Fun x e` with names `a : rest`: `(s, te, rest') = inferPolyType' e ((x, TVar a) : tenv) rest`.",
        "In `App`, apply `s2` to `tf` before unifying (`e` may have taught you more about `f`'s type variables). If either `tf` or `te` is `TErr`, return `TErr` straight away, otherwise unification might succeed by binding a variable to `TErr`.",
        md(
          "```",
          hs`inferPolyType' (App f e) tenv names
  | tf == TErr || te == TErr = ([], TErr, names2)
  | otherwise = case unify (applySub s2 tf) (TFun te (TVar a)) of
      Nothing -> ([], TErr, names3)
      Just s  -> (combineSubs [s, s2, s1], applySub s (TVar a), names3)
  where
    (s1, tf, names1) = inferPolyType' f tenv names
    (s2, te, names2) = inferPolyType' e (updateTEnv tenv s1) names1
    (a : names3)     = names2`,
          "```",
        ),
      ],
      solution: hs`inferPolyType :: Expr -> Type
inferPolyType e
  = t
  where
    (_, t, _) = inferPolyType' e [] ["a" ++ show n | n <- [1 :: Int ..]]

inferPolyType' :: Expr -> TEnv -> [String] -> (Sub, Type, [String])
inferPolyType' (Number _) _ names
  = ([], TInt, names)
inferPolyType' (Boolean _) _ names
  = ([], TBool, names)
inferPolyType' (Prim p) _ names
  = ([], lookUp p primTypes, names)
inferPolyType' (Id x) tenv names
  = ([], lookUp x tenv, names)
inferPolyType' (Fun x e) tenv (a : names)
  | te == TErr = ([], TErr, names')
  | otherwise  = (s, TFun (applySub s (TVar a)) te, names')
  where
    (s, te, names') = inferPolyType' e ((x, TVar a) : tenv) names
inferPolyType' (App f e) tenv names
  | tf == TErr || te == TErr = ([], TErr, names2)
  | otherwise
    = case unify (applySub s2 tf) (TFun te (TVar a)) of
        Nothing -> ([], TErr, names3)
        Just s  -> (combineSubs [s, s2, s1], applySub s (TVar a), names3)
  where
    (s1, tf, names1) = inferPolyType' f tenv names
    (s2, te, names2) = inferPolyType' e (updateTEnv tenv s1) names1
    (a : names3)     = names2
inferPolyType' (Cond c t e) tenv names
  = inferPolyCond c t e tenv names

-- The prize case: the condition must unify with Bool and the
-- two branches must unify with each other.
inferPolyCond :: Expr -> Expr -> Expr -> TEnv -> [String]
              -> (Sub, Type, [String])
inferPolyCond c t e tenv names
  = case unify tc TBool of
      Nothing -> ([], TErr, names1)
      Just sb
        | tt == TErr || te == TErr -> ([], TErr, names3)
        | otherwise ->
            case unify (applySub s3 tt) te of
              Nothing -> ([], TErr, names3)
              Just su -> (combineSubs [su, s3, s2, sb, s1], applySub su te, names3)
        where
          tenv1 = updateTEnv tenv (combineSubs [sb, s1])
          (s2, tt, names2) = inferPolyType' t tenv1 names1
          (s3, te, names3) = inferPolyType' e (updateTEnv tenv1 s2) names2
  where
    (s1, tc, names1) = inferPolyType' c tenv names`,
      tests: [
        { expr: "alphaEq (inferPolyType ex9) type9", label: "Fun rule: ex9 (\\x -> True)" },
        { expr: "alphaEq (inferPolyType ex10) type10", label: "Fun rule: ex10 (\\x -> x)" },
        { expr: 'alphaEq (inferPolyType (Fun "x" (Fun "y" (Id "x")))) (TFun (TVar "p") (TFun (TVar "q") (TVar "p")))', label: "Fun rule: \\x -> \\y -> x has type p -> q -> p" },
        { expr: 'alphaEq (inferPolyType (Fun "x" (Prim "not"))) (TFun (TVar "a1") (TFun TBool TBool))', label: "Fun rule with a primitive body" },
        { expr: 'inferPolyType (Fun "x" (App (Prim "not") (Number 1)))', expected: "TErr", label: "a Fun whose body is badly typed is TErr" },
        { expr: "inferPolyType ex11", expected: "type11", label: "App rule: ex11" },
        { expr: "alphaEq (inferPolyType ex12) type12", label: "App rule: ex12" },
        { expr: "alphaEq (inferPolyType ex13) type13", label: "App rule: ex13" },
        { expr: "alphaEq (inferPolyType ex14) type14", label: "App rule: ex14" },
        { expr: 'inferPolyType (Fun "x" (App (Id "x") (Id "x")))', expected: "TErr", label: "App rule: \\x -> x x fails the occurs check" },
        { expr: 'inferPolyType (Fun "x" (App (App (Prim "+") (Id "x")) (Number 1)))', expected: "TFun TInt TInt", label: "App rule: \\x -> + x 1" },
        { expr: 'inferPolyType (Fun "x" (Cond (Id "x") (Number 1) (Number 2)))', expected: "TFun TBool TInt", label: "prize (Cond): \\x -> if x then 1 else 2" },
        { expr: 'inferPolyType (Fun "f" (Fun "x" (Cond (App (Id "f") (Id "x")) (Id "x") (Number 0))))', expected: "TFun (TFun TInt TBool) (TFun TInt TInt)", label: "prize (Cond): \\f -> \\x -> if f x then x else 0" },
        { expr: 'inferPolyType (Fun "x" (Cond (Id "x") (Number 1) (Boolean True)))', expected: "TErr", label: "prize (Cond): branches of different types" },
      ],
    },
  ],
};
