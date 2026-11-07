import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "y2019",
  year: 2019,
  title: "SAT Solving",
  summary: "Convert logic formulas to conjunctive normal form and write the Davis-Putnam algorithm that finds every way of making a formula true (enough to solve 8-queens).",
  skills: [
    "recursion over a formula data type",
    "pattern matching on nested constructors",
    "nub and sort",
    "zip with an infinite list",
    "list comprehensions with patterns",
    "backtracking search",
    "concatMap",
  ],
  story: md(
    "This paper is about **logic puzzles**. A formula is built from variables `a`, `b`, `c`, ... that are each either `True` or `False`, joined with **not** (written `!`), **and** (`&`) and **or** (`|`). For example `(a | b) & !c` is true when c is false and at least one of a, b is true.",
    "",
    "The **SAT problem** asks: is there a way to choose True/False for each variable that makes the whole formula true? Each such choice is a **satisfying assignment**. In this paper you find *all* of them. Trying every combination works for a few variables, but n variables have 2^n combinations, which is hopeless for, say, the 64 squares of a chessboard. The **Davis-Putnam (DP) algorithm** is a much smarter search.",
    "",
    "**Normal forms.** DP needs the formula in a standard shape. First **NNF** (negation normal form), where `!` only ever sits directly on a variable. You get there by pushing nots inwards with three rules (De Morgan's laws and double negation):",
    "",
    "```",
    "!(A | B)  =  !A & !B",
    "!(A & B)  =  !A | !B",
    "!!A       =  A",
    "```",
    "",
    "Then **CNF** (conjunctive normal form): an *and* of *clauses*, where each clause is an *or* of **literals** (a literal is a variable or a negated variable). For example `(a | !d) & (!b | !d) & (!c | !d)`. To get from NNF to CNF you push ors inside ands, like multiplying out brackets in algebra:",
    "",
    "```",
    "A | (B & C)  =  (A | B) & (A | C)",
    "(A & B) | C  =  (A | C) & (B | C)",
    "```",
    "",
    "**Flattened CNF.** Number the variables in alphabetical order: a is 1, b is 2, and so on. A literal is that number, or its negative if negated: `!c` is `-3`. A clause becomes a list of literals and the whole CNF a list of clauses: `(a | !d) & (!b | !d)` is `[[1,-4],[-2,-4]]`. An empty clause `[]` is an *or* of nothing, which is False. An empty list of clauses `[]` is an *and* of nothing, which is True.",
    "",
    "**Unit propagation.** A clause with just one literal, like `[4]`, is a **unit clause**: it *forces* that literal to be true (d must be True). Then:",
    "",
    "1. Every clause containing `4` is already true, so delete it (this deletes `[4]` itself too).",
    "2. `-4` is false, so delete `-4` from every clause it appears in.",
    "",
    "```",
    "[[-1,-4],[2,1,5],[3,-2],[4],[3,-5],[-3,-7],[1,7,6],[-3,6]]",
    "  propagate 4:   [[-1],[2,1,5],[3,-2],[3,-5],[-3,-7],[1,7,6],[-3,6]]",
    "  propagate -1:  [[2,5],[3,-2],[3,-5],[-3,-7],[7,6],[-3,6]]",
    "```",
    "",
    "Deleting `-4` left a new unit clause `[-1]`, so we propagated that too. Keep going until no unit clauses are left.",
    "",
    "**The DP algorithm.** Propagate all unit clauses. Then:",
    "",
    "- if no clauses are left, the formula is satisfied: the answer is the list of literals you propagated;",
    "- if some clause became empty `[]`, this path fails: no answers;",
    "- otherwise, take the first literal's variable, say 2, and try both possibilities: put `[2]` on the front of the clauses and solve again, then do the same with `[-2]`. Stick the literals you already propagated on the front of every answer that comes back.",
    "",
    "An answer may leave out a variable (e.g. 5) if it doesn't matter: then that answer stands for two full assignments, one with the variable true and one with it false.",
    "",
    "### The given types",
    "",
    "```",
    "type Id = String",
    "data Formula = Var Id | Not Formula | And Formula Formula | Or Formula Formula",
    "type NNF = Formula",
    "type CNF = Formula",
    "type CNFRep = [[Int]]",
    "type IdMap = [(Id, Int)]",
    "```",
    "",
    "- `Var \"a\"` is the variable a, `Not f` is `!f`, `And f g` is `f & g`, `Or f g` is `f | g`.",
    "- `NNF` and `CNF` are just other names for `Formula`, used to say which shape a formula is in.",
    "- A `CNFRep` is the flattened CNF: a list of clauses, each a list of literal numbers.",
    "- An `IdMap` pairs each variable name with its number, like `[(\"a\",1),(\"b\",2)]`.",
    "",
    "Given to you: `showF` (turns a formula into the short `!`, `&`, `|` notation) and `printF` (prints it), `distribute` (does the or-into-and multiplying out for two CNFs), test formulas `f1`, `f3`, `f4`, `f6`, `f8`, `c3`, `c4`, `cnf1` to `cnf4` with flattened versions `cnf1Rep` to `cnf3Rep`, the variables `a` to `g` as formulas, `queensCNFRep n` (the n-queens puzzle as a CNFRep), `queens n` (the same as a `Formula`) and `printBoard`.",
  ),
  notes: md(
    "**Where the marks are.** 25 marks plus a 2-mark bonus (the total is capped at 25). Part I is 5 marks, Part II 11, Part III 9. The three parts are independent: Part III works on `CNFRep`s directly, and the test data `cnf1Rep` etc. is given, so you can do it before Part II.",
    "",
    "**Order of attack.** Part I is quick (`lookUp`, `vars`, `idMap`). `toNNF` is 4 marks of pure pattern matching. `toCNF` is short once you see that `distribute` does the hard work. `flatten` is 4 marks. Then `propUnits` (5) and `dp` (4): test `dp cnf2Rep` and then 8-queens. Bonus `allSat` last.",
    "",
    "**Traps.**",
    "",
    "- `vars` must return the names sorted, without duplicates.",
    "- In `toNNF`, the `Not` cases must look one level deeper: `Not (And ...)`, `Not (Or ...)`, `Not (Not ...)`. Recurse on the results, since the new `Not`s may need pushing further in.",
    "- In `toCNF`, convert both sides of an `Or` to CNF *before* calling `distribute`.",
    "- In `flatten`, compute the `IdMap` once from the whole formula, not separately for each clause, or the numbers will be wrong.",
    "- In `propUnits`, propagate one unit at a time and recurse: new unit clauses can appear.",
    "- In `dp`, check for \"no clauses left\" before \"an empty clause\", and check both *after* unit propagation.",
    "",
    "**Short of time?** The bonus (`allSat`) is only worth doing if everything else is done. The marks are capped at 25.",
  ),
  setup: hs`import Data.List

type Id = String

data Formula = Var Id
             | Not Formula
             | And Formula Formula
             | Or Formula Formula
             deriving (Eq, Show)

type NNF = Formula

type CNF = Formula

type CNFRep = [[Int]]

type IdMap = [(Id, Int)]

--------------------------------------------------------------
-- Printing

showF :: Formula -> String
showF (Var v)
  = v
showF (Not f)
  = '!' : showF f
showF (And f f')
  = "(" ++ showF f ++ " & " ++ showF f' ++ ")"
showF (Or f f')
  = "(" ++ showF f ++ " | " ++ showF f' ++ ")"

printF :: Formula -> IO ()
printF
  = putStrLn . showF

--------------------------------------------------------------
-- Distribution of Or over And (for toCNF)

distribute :: CNF -> CNF -> CNF
distribute a (And b c)
  = And (distribute a b) (distribute a c)
distribute (And a b) c
  = And (distribute a c) (distribute b c)
distribute a b
  = Or a b

--------------------------------------------------------------
-- Test data

a, b, c, d, e, f, g :: Formula
a = Var "a"
b = Var "b"
c = Var "c"
d = Var "d"
e = Var "e"
f = Var "f"
g = Var "g"

-- Table 1
f1, f3, f4, f6, f8 :: Formula
f1 = Not (Not a)
f3 = And a b
f4 = Not (And (Not a) (Not b))
f6 = Not (Or b (And a (Not c)))
f8 = Or (And a (Not (Or b c))) (Not d)

c3, c4 :: CNF
c3 = And a b
c4 = Or a b

-- Seven clauses, each ruling out one assignment of a, b and c:
-- only a = b = c = True survives
cnf1 :: CNF
cnf1
  = foldr1 And [Or a (Or b c), Or a (Or b (Not c)), Or a (Or (Not b) c),
                Or a (Or (Not b) (Not c)), Or (Not a) (Or b c),
                Or (Not a) (Or b (Not c)), Or (Not a) (Or (Not b) c)]

cnf1Rep :: CNFRep
cnf1Rep
  = [[1,2,3],[1,2,-3],[1,-2,3],[1,-2,-3],[-1,2,3],[-1,2,-3],[-1,-2,3]]

cnf2 :: CNF
cnf2
  = And (Or (Not a) (Not d))
        (And (Or b (Or a e))
             (And (Or c (Not b))
                  (And d
                       (And (Or c (Not e))
                            (And (Or (Not c) (Not g))
                                 (And (Or a (Or g f))
                                      (Or (Not c) f)))))))

cnf2Rep :: CNFRep
cnf2Rep
  = [[-1,-4],[2,1,5],[3,-2],[4],[3,-5],[-3,-7],[1,7,6],[-3,6]]

cnf3 :: CNF
cnf3
  = And (Or (Not c) (Not g))
        (And (Or b (Or c e))
             (And (Or a (Not b))
                  (And (Or a (Not e))
                       (And (Or (Not a) (Not d))
                            (And (Or c (Or d f))
                                 (And (Or (Not a) (Not f))
                                      g))))))

cnf3Rep :: CNFRep
cnf3Rep
  = [[-3,-7],[2,3,5],[1,-2],[1,-5],[-1,-4],[3,4,6],[-1,-6],[7]]

-- Rooks on a 2x2 board: a b is the top row, c d the bottom row.
-- One rook per row, and no two rooks in the same row or column.
cnf4 :: CNF
cnf4
  = foldr1 And [Or a b, Or c d, Or (Not a) (Not b), Or (Not c) (Not d),
                Or (Not a) (Not c), Or (Not b) (Not d)]

--------------------------------------------------------------
-- n-queens

-- The variable for the square in row r, column c (both from 0)
queenVar :: Int -> Int -> Int -> Int
queenVar n r c
  = r * n + c + 1

-- At least one queen in each row, and no two queens on the same
-- row, column or diagonal
queensCNFRep :: Int -> CNFRep
queensCNFRep n
  = [[queenVar n r c | c <- squares] | r <- squares] ++
    [[-(queenVar n r1 c1), -(queenVar n r2 c2)]
      | r1 <- squares, c1 <- squares, r2 <- squares, c2 <- squares,
        (r1, c1) < (r2, c2),
        r1 == r2 || c1 == c2 || abs (r1 - r2) == abs (c1 - c2)]
  where
    squares = [0 .. n - 1]

-- The same constraints as a Formula, with variables named q<row><col>
queens :: Int -> Formula
queens n
  = foldr1 And (map clause (queensCNFRep n))
  where
    clause = foldr1 Or . map literal
    literal i
      | i > 0     = Var (name i)
      | otherwise = Not (Var (name (-i)))
    name i = 'q' : show (div (i - 1) n) ++ show (mod (i - 1) n)

printBoard :: [Int] -> Int -> IO ()
printBoard sol n
  = putStr (unlines [unwords [square (queenVar n r c) | c <- [0 .. n - 1]]
                    | r <- [0 .. n - 1]])
  where
    square v
      | elem v sol = "X"
      | otherwise  = "O"
`,
  starter: hs`--------------------------------------------------------------
-- Part I

lookUp :: Eq a => a -> [(a, b)] -> b
lookUp = undefined

vars :: Formula -> [Id]
vars = undefined

idMap :: Formula -> IdMap
idMap = undefined

--------------------------------------------------------------
-- Part II

toNNF :: Formula -> NNF
toNNF = undefined

toCNF :: Formula -> CNF
toCNF = undefined

flatten :: CNF -> CNFRep
flatten = undefined

--------------------------------------------------------------
-- Part III

propUnits :: CNFRep -> (CNFRep, [Int])
propUnits = undefined

dp :: CNFRep -> [[Int]]
dp = undefined

--------------------------------------------------------------
-- Part IV (bonus)

allSat :: Formula -> [[(Id, Bool)]]
allSat = undefined
`,
  tasks: [
    {
      id: "lookUp",
      name: "lookUp",
      part: "Part I",
      marks: 1,
      prompt: md(
        "Define `lookUp :: Eq a => a -> [(a, b)] -> b` which finds the value paired with an item in a list of (item, value) pairs. The item is guaranteed to appear exactly once.",
        "",
        "```",
        "ghci> lookUp 3 [(2,1),(3,8)]",
        "8",
        "```",
      ),
      hints: [
        "Find the pair whose first component matches, and return its second component.",
        "A list comprehension can collect the matching values: `[v | (k, v) <- table, k == x]`.",
        "That gives a list with exactly one element; take it with `head`. (Or use the Prelude's `lookup` and `fromJust` from `Data.Maybe`.)",
        "`lookUp x table = head [v | (k, v) <- table, k == x]`.",
      ],
      solution: hs`lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x table = head [v | (k, v) <- table, k == x]`,
      tests: [
        { expr: "lookUp 3 [(2,1),(3,8)]", expected: "8" },
        { expr: "lookUp 2 [(2,1),(3,8)]", expected: "1" },
        { expr: 'lookUp "c" [("a",1),("b",2),("c",3)]', expected: "3" },
        { expr: "lookUp 'x' [('x', True)]", expected: "True" },
        { expr: 'lookUp "g" (zip ["a","b","c","d","e","f","g"] [1..])', expected: "7" },
      ],
    },
    {
      id: "vars",
      name: "vars",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Using `nub` and `sort` from `Data.List`, define `vars :: Formula -> [Id]` which returns the variable names in a formula, sorted, with no duplicates. It works on any formula, including ones in CNF.",
        "",
        "```",
        "ghci> f1",
        "Not (Not (Var \"a\"))",
        "ghci> vars f1",
        "[\"a\"]",
        "ghci> printF cnf3",
        "((!c | !g) & ((b | (c | e)) & ((a | !b) & ((a | !e) & ((!a | !d) &",
        "((c | (d | f)) & ((!a | !f) & g)))))))",
        "ghci> vars cnf3",
        "[\"a\",\"b\",\"c\",\"d\",\"e\",\"f\",\"g\"]",
        "```",
      ),
      hints: [
        "Collect every variable name (duplicates and all) by recursion on the formula, then tidy up with `sort` and `nub`.",
        "Write a helper with one equation per constructor: `Var v` gives `[v]`; `Not f` gives the names in `f`; `And` and `Or` join the names from both sides with `++`.",
        "`sort . nub` (or `nub . sort`) on the helper's result gives the final answer.",
        md(
          "```",
          "vars = sort . nub . names",
          "  where",
          "    names (Var v) = [v]",
          "    names (Not f) = names f",
          "    names (And f1 f2) = names f1 ++ names f2",
          "    names (Or f1 f2) = names f1 ++ names f2",
          "```",
        ),
      ],
      solution: hs`vars :: Formula -> [Id]
vars = sort . nub . names
  where
    names (Var v) = [v]
    names (Not f) = names f
    names (And f1 f2) = names f1 ++ names f2
    names (Or f1 f2) = names f1 ++ names f2`,
      tests: [
        { expr: "vars f1", expected: '["a"]' },
        { expr: "vars cnf3", expected: '["a","b","c","d","e","f","g"]' },
        { expr: "vars f6", expected: '["a","b","c"]' },
        { expr: "vars f8", expected: '["a","b","c","d"]' },
        { expr: "vars (And (Var \"z\") (Or (Var \"y\") (Not (Var \"z\"))))", expected: '["y","z"]' },
        { expr: "vars cnf2", expected: '["a","b","c","d","e","f","g"]' },
        { expr: 'vars (Var "x")', expected: '["x"]' },
      ],
    },
    {
      id: "idMap",
      name: "idMap",
      part: "Part I",
      marks: 1,
      prompt: md(
        "Using `vars`, define `idMap :: Formula -> IdMap` which pairs each variable in a formula with the numbers 1, 2, 3, ... in sorted order.",
        "",
        "```",
        "ghci> idMap cnf3",
        "[(\"a\",1),(\"b\",2),(\"c\",3),(\"d\",4),(\"e\",5),(\"f\",6),(\"g\",7)]",
        "```",
      ),
      hints: [
        "`zip` pairs up two lists element by element.",
        "The second list is the numbers from 1 upwards.",
        "`zip` stops at the end of the shorter list, so you can use the infinite list `[1 ..]`.",
        "`idMap f = zip (vars f) [1 ..]`.",
      ],
      solution: hs`idMap :: Formula -> IdMap
idMap f = zip (vars f) [1 ..]`,
      tests: [
        { expr: "idMap cnf3", expected: '[("a",1),("b",2),("c",3),("d",4),("e",5),("f",6),("g",7)]' },
        { expr: "idMap f1", expected: '[("a",1)]' },
        { expr: "idMap f6", expected: '[("a",1),("b",2),("c",3)]' },
        { expr: 'idMap (Or (Var "y") (Var "x"))', expected: '[("x",1),("y",2)]' },
        { expr: "length (idMap (queens 4))", expected: "16" },
      ],
    },
    {
      id: "toNNF",
      name: "toNNF",
      part: "Part II",
      marks: 4,
      prompt: md(
        "Define `toNNF :: Formula -> NNF` which converts a formula to negation normal form, where `Not` is only ever applied directly to a variable. Use these rules (A and B are any sub-formulas), everywhere in the formula:",
        "",
        "```",
        "!(A | B)  =  !A & !B",
        "!(A & B)  =  !A | !B",
        "!!A       =  A",
        "```",
        "",
        "```",
        "ghci> toNNF f1",
        "Var \"a\"",
        "ghci> printF f6",
        "!(b | (a & !c))",
        "ghci> printF (toNNF f6)",
        "(!b & (!a | c))",
        "ghci> printF f8",
        "((a & !(b | c)) | !d)",
        "ghci> printF (toNNF f8)",
        "((a & (!b & !c)) | !d)",
        "```",
      ),
      hints: [
        "Recursion with pattern matching. The interesting cases are `Not` applied to something that isn't a variable, so match two levels deep.",
        "Equations: `Not (Not f)`, `Not (And f1 f2)`, `Not (Or f1 f2)`, `And f1 f2`, `Or f1 f2`, and finally a catch-all for `Var v` and `Not (Var v)`, which are already fine.",
        "After applying De Morgan, the new `Not f1` and `Not f2` may still need work, so call `toNNF` on them: `toNNF (Not (And f1 f2)) = Or (toNNF (Not f1)) (toNNF (Not f2))`.",
        md(
          "```",
          "toNNF (Not (Not f)) = toNNF f",
          "toNNF (Not (And f1 f2)) = Or (toNNF (Not f1)) (toNNF (Not f2))",
          "toNNF (Not (Or f1 f2)) = And (toNNF (Not f1)) (toNNF (Not f2))",
          "toNNF (And f1 f2) = And (toNNF f1) (toNNF f2)",
          "toNNF (Or f1 f2) = Or (toNNF f1) (toNNF f2)",
          "toNNF f = f",
          "```",
        ),
      ],
      solution: hs`toNNF :: Formula -> NNF
toNNF (Not (Not f)) = toNNF f
toNNF (Not (And f1 f2)) = Or (toNNF (Not f1)) (toNNF (Not f2))
toNNF (Not (Or f1 f2)) = And (toNNF (Not f1)) (toNNF (Not f2))
toNNF (And f1 f2) = And (toNNF f1) (toNNF f2)
toNNF (Or f1 f2) = Or (toNNF f1) (toNNF f2)
toNNF f = f`,
      tests: [
        { expr: "toNNF f1", expected: 'Var "a"' },
        { expr: "showF (toNNF f6)", expected: '"(!b & (!a | c))"' },
        { expr: "showF (toNNF f8)", expected: '"((a & (!b & !c)) | !d)"' },
        { expr: "showF (toNNF f4)", expected: '"(a | b)"' },
        { expr: "toNNF (Not (Var \"x\"))", expected: 'Not (Var "x")' },
        { expr: "toNNF f3", expected: "f3" },
        { expr: "showF (toNNF (Not (Not (Not a))))", expected: '"!a"' },
        { expr: "showF (toNNF (Not (And (Or a (Not b)) (Not (Not c)))))", expected: '"((!a & b) | !c)"' },
      ],
    },
    {
      id: "toCNF",
      name: "toCNF",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define `toCNF :: Formula -> CNF` which converts a formula to conjunctive normal form. First convert it to NNF with `toNNF`. Then use a helper that goes into every `And` and `Or`, converting both arguments, and replaces each `Or` by a call to the given `distribute`, which multiplies out ors over ands:",
        "",
        "```",
        "distribute :: CNF -> CNF -> CNF",
        "distribute a (And b c) = And (distribute a b) (distribute a c)",
        "distribute (And a b) c = And (distribute a c) (distribute b c)",
        "distribute a b         = Or a b",
        "```",
        "",
        "After `toNNF`, every `Not` is on a variable, so it can be left alone.",
        "",
        "```",
        "ghci> printF (toCNF f4)",
        "(a | b)",
        "ghci> printF (toCNF f6)",
        "(!b & (!a | c))",
        "ghci> printF (toCNF f8)",
        "((a | !d) & ((!b | !d) & (!c | !d)))",
        "```",
      ),
      hints: [
        "`toCNF = helper . toNNF`, where the helper recurses through the NNF formula.",
        "Helper cases: `And f1 f2` keeps the `And` and converts both sides; `Or f1 f2` becomes `distribute` of the two converted sides; anything else (a variable or a negated variable) stays as it is.",
        "Convert *both* arguments of an `Or` before calling `distribute`: it expects CNFs.",
        md(
          "```",
          "toCNF = cnf . toNNF",
          "  where",
          "    cnf (And f1 f2) = And (cnf f1) (cnf f2)",
          "    cnf (Or f1 f2) = distribute (cnf f1) (cnf f2)",
          "    cnf f = f",
          "```",
        ),
      ],
      solution: hs`toCNF :: Formula -> CNF
toCNF = cnf . toNNF
  where
    cnf (And f1 f2) = And (cnf f1) (cnf f2)
    cnf (Or f1 f2) = distribute (cnf f1) (cnf f2)
    cnf f = f`,
      tests: [
        { expr: "showF (toCNF f4)", expected: '"(a | b)"' },
        { expr: "showF (toCNF f6)", expected: '"(!b & (!a | c))"' },
        { expr: "showF (toCNF f8)", expected: '"((a | !d) & ((!b | !d) & (!c | !d)))"' },
        { expr: "toCNF f1", expected: "a" },
        { expr: "toCNF cnf2", expected: "cnf2", label: "a formula already in CNF is unchanged" },
        { expr: "showF (toCNF (Or (And a b) (And c d)))", expected: '"(((a | c) & (b | c)) & ((a | d) & (b | d)))"' },
        { expr: "showF (toCNF (Not (Or (Not a) (Not (Or b c)))))", expected: '"(a & (b | c))"' },
      ],
    },
    {
      id: "flatten",
      name: "flatten",
      part: "Part II",
      marks: 4,
      prompt: md(
        "Using `idMap`, define `flatten :: CNF -> CNFRep` which turns a CNF formula into its flattened form: a list of clauses, each a list of literal numbers (a variable's number from `idMap`, negative if it is under a `Not`).",
        "",
        "```",
        "ghci> printF c3",
        "(a & b)",
        "ghci> flatten c3",
        "[[1],[2]]",
        "ghci> printF c4",
        "(a | b)",
        "ghci> flatten c4",
        "[[1,2]]",
        "ghci> flatten cnf3",
        "[[-3,-7],[2,3,5],[1,-2],[1,-5],[-1,-4],[3,4,6],[-1,-6],[7]]",
        "```",
        "",
        "The order of the clauses, and of the literals within each clause, doesn't matter.",
      ),
      hints: [
        "Two levels of recursion: the `And`s split the formula into clauses, and the `Or`s inside a clause split it into literals.",
        "Compute `ids = idMap f` once, for the whole formula, in a `where`. Then write two local helpers: `clauses` (for the `And` level) and `literals` (for the `Or` level).",
        "`clauses (And f1 f2) = clauses f1 ++ clauses f2`; anything else is a single clause, `[literals f]`. For literals, `Var v` is `[lookUp v ids]` and `Not (Var v)` is `[negate (lookUp v ids)]`.",
        md(
          "```",
          "flatten f = clauses f",
          "  where",
          "    ids = idMap f",
          "    clauses (And f1 f2) = clauses f1 ++ clauses f2",
          "    clauses f' = [literals f']",
          "    literals (Or f1 f2) = literals f1 ++ literals f2",
          "    literals (Not (Var v)) = [negate (lookUp v ids)]",
          "    literals (Var v) = [lookUp v ids]",
          "```",
        ),
      ],
      solution: hs`flatten :: CNF -> CNFRep
flatten f = clauses f
  where
    ids = idMap f
    clauses (And f1 f2) = clauses f1 ++ clauses f2
    clauses f' = [literals f']
    literals (Or f1 f2) = literals f1 ++ literals f2
    literals (Not (Var v)) = [negate (lookUp v ids)]
    literals (Var v) = [lookUp v ids]`,
      tests: [
        { expr: "map sort (flatten c3)", expected: "[[1],[2]]", unordered: true },
        { expr: "map sort (flatten c4)", expected: "[[1,2]]", unordered: true },
        { expr: "map sort (flatten cnf3)", expected: "map sort cnf3Rep", unordered: true },
        { expr: "map sort (flatten cnf2)", expected: "map sort cnf2Rep", unordered: true },
        { expr: "map sort (flatten cnf1)", expected: "map sort cnf1Rep", unordered: true },
        { expr: 'flatten (Not (Var "x"))', expected: "[[-1]]" },
        { expr: "map sort (flatten (toCNF f8))", expected: "[[-4,1],[-4,-2],[-4,-3]]", unordered: true },
        { expr: "map sort (flatten cnf4)", expected: "[[1,2],[3,4],[-2,-1],[-4,-3],[-3,-1],[-4,-2]]", unordered: true },
      ],
    },
    {
      id: "propUnits",
      name: "propUnits",
      part: "Part III",
      marks: 5,
      prompt: md(
        "Define `propUnits :: CNFRep -> (CNFRep, [Int])` which propagates unit clauses until none are left. It returns the resulting CNF (which contains no unit clauses) and the list of unit literals that were propagated, in the order they were propagated.",
        "",
        "To propagate a unit clause `[u]`:",
        "",
        "1. delete every clause that contains `u` (including `[u]` itself);",
        "2. delete the literal `-u` from every remaining clause.",
        "",
        "```",
        "ghci> propUnits []",
        "([],[])",
        "ghci> propUnits cnf1Rep",
        "([[1,2,3],[1,2,-3],[1,-2,3],[1,-2,-3],[-1,2,3],[-1,2,-3],[-1,-2,3]],[])",
        "ghci> cnf2Rep",
        "[[-1,-4],[2,1,5],[3,-2],[4],[3,-5],[-3,-7],[1,7,6],[-3,6]]",
        "ghci> propUnits cnf2Rep",
        "([[2,5],[3,-2],[3,-5],[-3,-7],[7,6],[-3,6]],[4,-1])",
        "```",
        "",
        "The order of the clauses and of the literals in the results doesn't matter. Hint from the spec: it's easier to propagate one unit clause at a time, and let recursion pick up the others.",
      ),
      hints: [
        "Recursion: find one unit clause, propagate it, then call `propUnits` on the result and add the unit to the front of the list it returns.",
        "`[u | [u] <- cnf]` lists all unit literals (the pattern `[u]` only matches one-element lists). If it's empty, the answer is `(cnf, [])`.",
        "Propagating `u` is one list comprehension: keep the clauses with `notElem u cl`, and from each remove `-u` with `filter (/= negate u) cl`.",
        md(
          "```",
          "propUnits cnf",
          "  = case [u | [u] <- cnf] of",
          "      [] -> (cnf, [])",
          "      (u : _) -> let (cnf', us) = propUnits (propagate u) in (cnf', u : us)",
          "  where",
          "    propagate u = [filter (/= negate u) cl | cl <- cnf, notElem u cl]",
          "```",
        ),
      ],
      solution: hs`propUnits :: CNFRep -> (CNFRep, [Int])
propUnits cnf
  = case [u | [u] <- cnf] of
      [] -> (cnf, [])
      (u : _) -> let (cnf', us) = propUnits (propagate u) in (cnf', u : us)
  where
    propagate u = [filter (/= negate u) cl | cl <- cnf, notElem u cl]`,
      tests: [
        { expr: "propUnits []", expected: "([],[])" },
        { expr: "propUnits cnf1Rep", expected: "(cnf1Rep, [])" },
        {
          expr: "(sort (map sort (fst (propUnits cnf2Rep))), sort (snd (propUnits cnf2Rep)))",
          expected: "(sort (map sort [[2,5],[3,-2],[3,-5],[-3,-7],[7,6],[-3,6]]), sort [4,-1])",
          label: "propUnits cnf2Rep == ([[2,5],[3,-2],[3,-5],[-3,-7],[7,6],[-3,6]],[4,-1]) (any order)",
        },
        { expr: "propUnits [[4]]", expected: "([],[4])" },
        { expr: "fst (propUnits [[1],[-1,2]])", expected: "[]", label: "propagating 1 exposes the new unit 2" },
        { expr: "sort (snd (propUnits [[1],[-1,2]]))", expected: "[1,2]" },
        { expr: "elem [] (fst (propUnits [[1],[-1]]))", label: "a contradiction leaves an empty clause" },
        { expr: "sort (snd (propUnits [[2],[2,5],[3,-2],[3,-5],[-3,-7],[7,6],[-3,6]]))", expected: "sort [2,3,-7,6]" },
        { expr: "all (\\cl -> length cl /= 1) (fst (propUnits cnf3Rep))", label: "no unit clauses are left (cnf3Rep)" },
      ],
    },
    {
      id: "dp",
      name: "dp",
      part: "Part III",
      marks: 4,
      prompt: md(
        "Using `propUnits`, define `dp :: CNFRep -> [[Int]]` which returns all the satisfying assignments of a flattened CNF, using the Davis-Putnam algorithm. First propagate all unit clauses. Then:",
        "",
        "- if there are no clauses left, return a list holding one assignment: the list of literals propagated;",
        "- if any clause is empty (`[]`), there are no assignments: return `[]`;",
        "- otherwise take the variable of the first literal of the first clause, `v`, and solve twice: once with `[v]` added to the front of the clauses (v true), and once with `[-v]` (v false). Put the propagated literals on the front of every assignment that comes back, and join the two lists of answers.",
        "",
        "```",
        "ghci> dp cnf1Rep",
        "[[1,2,3]]",
        "ghci> dp cnf2Rep",
        "[[4,-1,2,3,-7,6],[4,-1,-2,5,3,-7,6]]",
        "ghci> dp cnf3Rep",
        "[]",
        "ghci> let sols = dp (queensCNFRep 8)",
        "ghci> length sols",
        "92",
        "ghci> printBoard (head sols) 8",
        "X O O O O O O O",
        "O O O O X O O O",
        "...",
        "```",
        "",
        "The order of the assignments, and of the literals within each one, doesn't matter (your first 8-queens solution may differ from someone else's).",
      ),
      hints: [
        "Recursion: `dp` calls `propUnits`, inspects the result, and either stops or calls itself twice.",
        "Name the parts: `(cnf', units) = propUnits cnf`. Use guards `null cnf'` (success: `[units]`) and `elem [] cnf'` (failure: `[]`), in that order.",
        "Pick `v = head (head cnf')` (the first literal; using it or its negation both work). The recursive calls are `dp ([v] : cnf')` and `dp ([negate v] : cnf')`. Use `map (units ++)` to put the earlier literals on the front of each answer.",
        md(
          "```",
          "dp cnf",
          "  | null cnf'     = [units]",
          "  | elem [] cnf'  = []",
          "  | otherwise     = map (units ++) (dp ([v] : cnf') ++ dp ([negate v] : cnf'))",
          "  where",
          "    (cnf', units) = propUnits cnf",
          "    v = head (head cnf')",
          "```",
        ),
      ],
      solution: hs`dp :: CNFRep -> [[Int]]
dp cnf
  | null cnf'    = [units]
  | elem [] cnf' = []
  | otherwise    = map (units ++) (dp ([v] : cnf') ++ dp ([negate v] : cnf'))
  where
    (cnf', units) = propUnits cnf
    v = head (head cnf')`,
      tests: [
        { expr: "map sort (dp cnf1Rep)", expected: "[[1,2,3]]" },
        { expr: "map sort (dp cnf2Rep)", expected: "map sort [[4,-1,2,3,-7,6],[4,-1,-2,5,3,-7,6]]", unordered: true },
        { expr: "dp cnf3Rep", expected: "[]" },
        { expr: "dp []", expected: "[[]]", label: "no clauses: one (empty) assignment" },
        { expr: "dp [[]]", expected: "[]", label: "an empty clause: no assignments" },
        { expr: "map sort (dp [[1,2]])", expected: "[[1],[-1,2]]", unordered: true },
        { expr: "length (dp (queensCNFRep 4))", expected: "2", label: "4-queens has exactly 2 solutions" },
        { expr: "sort (map (sort . filter (> 0)) (dp (queensCNFRep 4)))", expected: "[[2,8,9,15],[3,5,12,14]]" },
        { expr: "length (dp (queensCNFRep 8))", expected: "92" },
        {
          expr: "all (\\s -> length (filter (> 0) s) == 8) (dp (queensCNFRep 8))",
          label: "every 8-queens solution places exactly 8 queens",
        },
      ],
    },
    {
      id: "allSat",
      name: "allSat",
      part: "Part IV",
      marks: 2,
      prompt: md(
        "**Bonus (2 marks).** Define `allSat :: Formula -> [[(Id, Bool)]]` which returns every satisfying assignment of *any* formula (not necessarily in CNF), each as a list of `(name, value)` pairs ordered by name. Convert the formula to CNF, flatten it and run `dp`. Then turn each answer back into names and Booleans, including **every** variable: if `dp` left a variable out of an answer, that answer stands for two complete assignments, one with the variable `False` and one with it `True`.",
        "",
        "```",
        "ghci> allSat cnf1",
        "[[(\"a\",True),(\"b\",True),(\"c\",True)]]",
        "ghci> allSat cnf2",
        "[[(\"a\",False),(\"b\",True),(\"c\",True),(\"d\",True),(\"e\",False),(\"f\",True),(\"g\",False)],",
        " [(\"a\",False),(\"b\",True),(\"c\",True),(\"d\",True),(\"e\",True),(\"f\",True),(\"g\",False)],",
        " [(\"a\",False),(\"b\",False),(\"c\",True),(\"d\",True),(\"e\",True),(\"f\",True),(\"g\",False)]]",
        "ghci> allSat cnf3",
        "[]",
        "ghci> allSat cnf4",
        "[[(\"a\",False),(\"b\",True),(\"c\",True),(\"d\",False)],",
        " [(\"a\",True),(\"b\",False),(\"c\",False),(\"d\",True)]]",
        "```",
        "",
        "`cnf4` is the \"rooks\" puzzle on a 2x2 board (a, b top row; c, d bottom row). The order of the assignments in the outer list doesn't matter.",
      ),
      hints: [
        "Pipeline: `dp (flatten (toCNF f))`, then expand each answer into complete assignments with `concatMap`.",
        "Use `idMap f` to go between names and numbers (it numbers the variables the same way `flatten` does). For each `(name, n)`: if `n` is in the answer the value is `[True]`, if `-n` is, `[False]`, otherwise `[False, True]`.",
        "You now have, for each variable, a list of possible values. You need every combination: write a small recursive helper `assignments :: [(Id, [Bool])] -> [[(Id, Bool)]]` whose base case is `[[]]` (one empty assignment).",
        md(
          "```",
          "allSat f = concatMap complete (dp (flatten (toCNF f)))",
          "  where",
          "    complete sol = assignments [(v, choices n sol) | (v, n) <- idMap f]",
          "    choices n sol | elem n sol = [True] | elem (negate n) sol = [False] | otherwise = [False, True]",
          "",
          "assignments [] = [[]]",
          "assignments ((v, bs) : rest) = [(v, x) : r | x <- bs, r <- assignments rest]",
          "```",
        ),
      ],
      solution: hs`allSat :: Formula -> [[(Id, Bool)]]
allSat formula
  = concatMap complete (dp (flatten (toCNF formula)))
  where
    complete sol = assignments [(v, choices n sol) | (v, n) <- idMap formula]
    choices n sol
      | elem n sol          = [True]
      | elem (negate n) sol = [False]
      | otherwise           = [False, True]

-- Every combination of values, one value per variable
assignments :: [(Id, [Bool])] -> [[(Id, Bool)]]
assignments [] = [[]]
assignments ((v, bs) : rest) = [(v, x) : r | x <- bs, r <- assignments rest]`,
      tests: [
        { expr: "allSat cnf1", expected: '[[("a",True),("b",True),("c",True)]]' },
        {
          expr: "allSat cnf2",
          expected:
            '[[("a",False),("b",True),("c",True),("d",True),("e",False),("f",True),("g",False)],[("a",False),("b",True),("c",True),("d",True),("e",True),("f",True),("g",False)],[("a",False),("b",False),("c",True),("d",True),("e",True),("f",True),("g",False)]]',
          unordered: true,
        },
        { expr: "allSat cnf3", expected: "[]" },
        {
          expr: "allSat cnf4",
          expected: '[[("a",False),("b",True),("c",True),("d",False)],[("a",True),("b",False),("c",False),("d",True)]]',
          unordered: true,
        },
        { expr: "allSat (Or a (Not a))", expected: '[[("a",False)],[("a",True)]]', unordered: true, label: "a | !a is always true" },
        {
          expr: "allSat f8",
          expected:
            '[[("a",w),("b",x),("c",y),("d",z)] | w <- [False,True], x <- [False,True], y <- [False,True], z <- [False,True], (w && not x && not y) || not z]',
          unordered: true,
          label: "allSat f8 gives exactly the true rows of f8's truth table",
        },
        { expr: "length (allSat (queens 4))", expected: "2" },
      ],
    },
  ],
};
