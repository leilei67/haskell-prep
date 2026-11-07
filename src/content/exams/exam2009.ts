import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "y2009",
  year: 2009,
  title: "Binary Decision Diagrams",
  summary: "Represent boolean expressions as decision graphs stored in lookup tables, then check, list and build their satisfying assignments.",
  skills: [
    "association lists",
    "table look-up",
    "recursion over trees",
    "list comprehensions",
    "algebraic data types",
    "pattern matching",
    "accumulating parameters",
    "threading state through recursion",
  ],
  story: md(
    "## Boolean expressions",
    "",
    "A boolean expression is a formula whose answer is either True or False. It is built from:",
    "",
    "- the constants False and True,",
    "- variables, written x1, x2, x3, ... (each one is either True or False, we don't know which yet),",
    "- not (written ¬), and (written ∧) and or (written ∨).",
    "",
    "For example `¬(x1 ∧ (False ∨ x2))`. If you choose x1 = True and x2 = False, then `False ∨ x2` is False, `x1 ∧ False` is False, and `¬False` is True. So that choice of values makes the expression True.",
    "",
    "A choice of values for the variables is called an assignment (or environment). If an assignment makes the expression True we say it satisfies the expression.",
    "",
    "In Haskell the expressions are values of this type:",
    "",
    "```",
    hs`data BExp = Prim Bool | IdRef Index | Not BExp | And BExp BExp | Or BExp BExp`,
    "```",
    "",
    "- `Prim True` and `Prim False` are the two constants (\"primitive\" booleans).",
    "- `IdRef 5` is the variable x5. `Index` is just another name for `Int`.",
    "- `Not e`, `And e1 e2` and `Or e1 e2` are ¬, ∧ and ∨.",
    "",
    "So `¬(x1 ∧ (False ∨ x2))` is written `Not (And (IdRef 1) (Or (Prim False) (IdRef 2)))`.",
    "",
    "An environment is a list of pairs saying what each variable is: `type Env = [(Index, Bool)]`. For example `[(1,True),(2,False)]` means x1 = True and x2 = False.",
    "",
    "## Binary Decision Diagrams (BDDs)",
    "",
    "A BDD is another way to draw the same expression: as a tree of questions. Each inner node asks about one variable. You go LEFT if that variable is False and RIGHT if it is True. When you run out of questions you land on a leaf, F or T, which is the value of the expression for those choices.",
    "",
    "Here is a BDD for `¬(x1 ∧ (False ∨ x2))`, asking about x1 first and then x2:",
    "",
    "```",
    hs`              x1                 node 2
          F /      \ T
           x2        x2            nodes 4 and 5
        F / \ T   F / \ T
         T   T     T   F`,
    "```",
    "",
    "To evaluate with x1 = True and x2 = False: at x1 go right (True), at x2 go left (False), and you land on T. The expression is True for that assignment.",
    "",
    "A complete BDD asks about every variable on every path, so with n variables there are 2^n paths, one per possible assignment. The order of the questions can differ (x1 then x2, or x2 then x1), which gives different but equally correct BDDs.",
    "",
    "## How a BDD is stored",
    "",
    "Instead of a tree data type, a BDD is stored as a table. Every inner node gets a unique id number (a NodeId). The table maps each node id to a triple `(variable, left child id, right child id)`:",
    "",
    "```",
    hs`type NodeId  = Int
type BDDNode = (NodeId, (Index, NodeId, NodeId))
type BDD     = (NodeId, [BDDNode])`,
    "```",
    "",
    "A `BDD` is a pair: the id of the root (top) node, and the list of all the inner nodes. The two leaves are not stored. Instead the special ids `0` and `1` always mean the False leaf and the True leaf. The BDD drawn above is:",
    "",
    "```",
    hs`(2, [(4,(2,1,1)), (5,(2,1,0)), (2,(1,4,5))])`,
    "```",
    "",
    "Read it like this: the root is node 2. Node 2 asks about x1; if False go to node 4, if True go to node 5. Node 4 asks about x2 and both answers lead to id 1 (True). Node 5 asks about x2: False leads to 1 (True), True leads to 0 (False).",
    "",
    "The ids are arbitrary (they just have to be unique and at least 2) and the list can be in any order. That's why you look nodes up by id rather than by position. The expression False needs no questions at all, so its BDD is `(0, [])`: the root IS the False leaf.",
    "",
    "## The given test data",
    "",
    "The template has eight expressions `b1` to `b8`, and a BDD for each (`bdd1` to `bdd8`) that asks about the variables in ascending order:",
    "",
    "```",
    hs`b1  False
b2  ¬(x1 ∧ (False ∨ x2))
b3  x1 ∧ True
b4  x7 ∧ (x2 ∨ ¬x3)
b5  ¬(x7 ∧ (x2 ∨ ¬x3))
b6  (x1 ∧ x2) ∨ (x3 ∧ x4)
b7  ¬x3 ∨ (x2 ∨ ¬x9)
b8  x1 ∨ ¬x1          (always True: a "tautology")`,
    "```",
    "",
    "The setup also has two test helpers that are not part of the exam: `evalBExp` (evaluates an expression directly) and `allEnvs` (every assignment of a list of variables). The tests use them to check your answers.",
  ),
  notes: md(
    "Parts I to III are worth 23 of the 25 marks. Part IV is the prize question and worth only 2, so leave it until everything else works.",
    "",
    "Do the parts in order: each one uses the previous one. `lookUp` is used by `checkSat` and `sat`; `simplify` is used by `restrict`; `restrict` is used by `buildBDD'`.",
    "",
    "The biggest single item is `buildBDD'` (6 marks). The spec tells you exactly how to number nodes (children of node n are 2n and 2n+1), so follow it literally. The leaf case returns `(0, [])` or `(1, [])`, not a node.",
    "",
    "Traps:",
    "",
    "- In `checkSat` and `sat`, ids 0 and 1 are leaves, not entries in the node list. Check for them before looking anything up, or `lookUp` will crash.",
    "- In `sat`, the False leaf gives `[]` (no ways) but the True leaf gives `[[]]` (one way: the empty assignment). Mixing these up gives empty answers everywhere.",
    "- `simplify` is NOT recursive: it only looks at the top constructor. `restrict` does the recursion and calls `simplify` each time it rebuilds a `Not`, `And` or `Or`.",
    "- Don't assume anything about the order of the node list or the environment.",
  ),
  setup: hs`import Data.List (sort)

type Index = Int

data BExp = Prim Bool | IdRef Index | Not BExp | And BExp BExp | Or BExp BExp
  deriving (Eq, Ord, Show)

type Env = [(Index, Bool)]

type NodeId = Int

type BDDNode = (NodeId, (Index, NodeId, NodeId))

type BDD = (NodeId, [BDDNode])

type ROBDD = BDD

buildBDD :: BExp -> [Index] -> BDD
buildBDD e xs
  = buildBDD' e 2 xs

------------------------------------------------------
-- Sample expressions and their BDDs (ascending variable order)

b1, b2, b3, b4, b5, b6, b7, b8 :: BExp
b1 = Prim False
b2 = Not (And (IdRef 1) (Or (Prim False) (IdRef 2)))
b3 = And (IdRef 1) (Prim True)
b4 = And (IdRef 7) (Or (IdRef 2) (Not (IdRef 3)))
b5 = Not (And (IdRef 7) (Or (IdRef 2) (Not (IdRef 3))))
b6 = Or (And (IdRef 1) (IdRef 2)) (And (IdRef 3) (IdRef 4))
b7 = Or (Not (IdRef 3)) (Or (IdRef 2) (Not (IdRef 9)))
b8 = Or (IdRef 1) (Not (IdRef 1))

bdd1, bdd2, bdd3, bdd4, bdd5, bdd6, bdd7, bdd8 :: BDD
bdd1 = (0, [])
bdd2 = (2, [(4,(2,1,1)),(5,(2,1,0)),(2,(1,4,5))])
bdd3 = (5, [(5,(1,0,1))])
bdd4 = (2, [(2,(2,4,5)),(4,(3,8,9)),(8,(7,0,1)),(9,(7,0,0)),
            (5,(3,10,11)),(10,(7,0,1)),(11,(7,0,1))])
bdd5 = (3, [(4,(3,8,9)),(3,(2,4,5)),(8,(7,1,0)),(9,(7,1,1)),
            (5,(3,10,11)),(10,(7,1,0)),(11,(7,1,0))])
bdd6 = (2, [(2,(1,4,5)),(4,(2,8,9)),(8,(3,16,17)),(16,(4,0,0)),
            (17,(4,0,1)),(9,(3,18,19)),(18,(4,0,0)),(19,(4,0,1)),
            (5,(2,10,11)),(10,(3,20,21)),(20,(4,0,0)),(21,(4,0,1)),
            (11,(3,22,23)),(22,(4,1,1)),(23,(4,1,1))])
bdd7 = (6, [(6,(2,4,5)),(4,(3,8,9)),(8,(9,1,1)),(9,(9,1,0)),
            (5,(3,10,11)),(10,(9,1,1)),(11,(9,1,1))])
bdd8 = (2, [(2,(1,1,1))])

------------------------------------------------------
-- Test helpers (not part of the exam)

evalBExp :: BExp -> Env -> Bool
evalBExp (Prim b) _ = b
evalBExp (IdRef i) env = maybe False id (Prelude.lookup i env)
evalBExp (Not e) env = not (evalBExp e env)
evalBExp (And e1 e2) env = evalBExp e1 env && evalBExp e2 env
evalBExp (Or e1 e2) env = evalBExp e1 env || evalBExp e2 env

allEnvs :: [Index] -> [Env]
allEnvs [] = [[]]
allEnvs (x : xs) = [(x, b) : env | b <- [False, True], env <- allEnvs xs]

agreesWith :: BDD -> BExp -> [Index] -> Bool
agreesWith bdd e xs = and [checkSat bdd env == evalBExp e env | env <- allEnvs xs]

isReduced :: BDD -> Bool
isReduced (_, ns)
  = and [l /= r | (_, (_, l, r)) <- ns]
    && length triples == length (nubTriples triples)
    && length ids == length (nubTriples ids)
  where
    triples = map snd ns
    ids = map fst ns
    nubTriples [] = []
    nubTriples (y : ys) = y : nubTriples (filter (/= y) ys)

robddOK :: BExp -> [Index] -> Int -> Bool
robddOK e xs size
  = length (snd r) == size && isReduced r && agreesWith r e xs
  where
    r = buildROBDD e xs
`,
  starter: hs`-- Part I

lookUp :: Eq a => a -> [(a, b)] -> b
lookUp = undefined

checkSat :: BDD -> Env -> Bool
checkSat = undefined

sat :: BDD -> [[(Index, Bool)]]
sat = undefined

-- Part II

simplify :: BExp -> BExp
simplify = undefined

restrict :: BExp -> Index -> Bool -> BExp
restrict = undefined

-- Part III

-- buildBDD e xs = buildBDD' e 2 xs is given to you.
buildBDD' :: BExp -> NodeId -> [Index] -> BDD
buildBDD' = undefined

-- Part IV

buildROBDD :: BExp -> [Index] -> ROBDD
buildROBDD = undefined
`,
  tasks: [
    {
      id: "lookup",
      name: "lookUp",
      part: "Part I",
      marks: 1,
      prompt: md(
        "Write a general table look-up function:",
        "",
        "```",
        hs`lookUp :: Eq a => a -> [(a, b)] -> b`,
        "```",
        "",
        "The table is a list of (key, value) pairs. `lookUp k table` returns the value paired with the key `k`. You may assume `k` appears in the table exactly once (that's the precondition), so you never have to handle a missing key.",
        "",
        "```",
        hs`*Main> lookUp 5 [(4,1),(5,2),(9,9)]
2
*Main> lookUp (2,1) [((1,2),True),((2,1),False)]
False`,
        "```",
      ),
      hints: [
        "You only need the first pair whose key matches. A list comprehension or simple recursion both work.",
        "With a comprehension: collect every value whose key equals `k`, then take the first one with `head`.",
        "The precondition says the key is there, so `head` is safe here. Don't use the Prelude's `lookup`: it returns a `Maybe`, not a plain value.",
        "`lookUp k table = head [v | (k', v) <- table, k' == k]`",
      ],
      solution: hs`lookUp :: Eq a => a -> [(a, b)] -> b
lookUp k table
  = head [v | (k', v) <- table, k' == k]`,
      tests: [
        { expr: "lookUp 5 [(4,1),(5,2),(9,9)]", expected: "2" },
        { expr: "lookUp (2,1) [((1,2),True),((2,1),False)]", expected: "False" },
        { expr: "lookUp 4 [(4,1),(5,2),(9,9)]", expected: "1" },
        { expr: "lookUp 9 [(4,1),(5,2),(9,9)]", expected: "9" },
        { expr: 'lookUp "b" [("a",1),("b",2)]', expected: "2" },
        { expr: "lookUp 'x' [('x', [1,2,3])]", expected: "[1,2,3]" },
      ],
    },
    {
      id: "checksat",
      name: "checkSat",
      part: "Part I",
      marks: 4,
      prompt: md(
        "Write `checkSat :: BDD -> Env -> Bool`. It returns True if the given assignment of variables makes the BDD's expression True, and False otherwise.",
        "",
        "Start at the root node. At each node look up its variable in the environment: go to the left child if the variable is False, the right child if it is True. Stop when you reach id `0` (answer False) or id `1` (answer True).",
        "",
        "```",
        hs`*Main> checkSat bdd2 [(1,True),(2,False)]
True
*Main> checkSat bdd7 [(3,True),(2,False),(9,True)]
False`,
        "```",
        "",
        "You can assume nothing about the node ids (except that they are unique and not 0 or 1), nor about the order of the node list or the environment.",
      ),
      hints: [
        "Write a helper that takes a node id and walks down from there. You need two look-ups: one in the node list (id to triple) and one in the environment (variable to Bool).",
        "Base cases: id 0 gives False, id 1 gives True. Otherwise look up the id to get `(i, l, r)`, then continue from `l` or `r`.",
        "Check for 0 and 1 BEFORE looking the id up: the leaves are not in the node list, so `lookUp 0 nodes` would crash. Start the helper at the root, which may itself be 0 or 1.",
        md(
          "```",
          hs`checkSat (root, nodes) env = walk root
  where
    walk 0 = False
    walk 1 = True
    walk n = if lookUp i env then walk r else walk l
      where (i, l, r) = lookUp n nodes`,
          "```",
        ),
      ],
      solution: hs`checkSat :: BDD -> Env -> Bool
checkSat (root, nodes) env
  = walk root
  where
    walk 0 = False
    walk 1 = True
    walk n
      | lookUp i env = walk r
      | otherwise    = walk l
      where
        (i, l, r) = lookUp n nodes`,
      tests: [
        { expr: "checkSat bdd2 [(1,True),(2,False)]", expected: "True" },
        { expr: "checkSat bdd7 [(3,True),(2,False),(9,True)]", expected: "False" },
        { expr: "checkSat bdd2 [(1,True),(2,True)]", expected: "False" },
        { expr: "checkSat bdd2 [(2,True),(1,False)]", expected: "True" },
        { expr: "checkSat bdd1 []", expected: "False", label: "bdd1 has no nodes: the root is the False leaf" },
        { expr: "checkSat (1, []) []", expected: "True", label: "root is the True leaf" },
        { expr: "checkSat bdd3 [(1,True)]", expected: "True", label: "bdd3 has root id 5" },
        { expr: "checkSat bdd5 [(7,True),(3,False),(2,False)]", expected: "False", label: "bdd5 has root id 3" },
        { expr: "and [checkSat bdd8 env | env <- allEnvs [1]]", expected: "True", label: "b8 is a tautology" },
        { expr: "and [agreesWith bdd b xs | (bdd, b, xs) <- [(bdd2,b2,[1,2]),(bdd4,b4,[2,3,7]),(bdd5,b5,[2,3,7]),(bdd6,b6,[1,2,3,4]),(bdd7,b7,[2,3,9])]]", expected: "True", label: "checkSat agrees with the expressions b2, b4, b5, b6, b7 on every assignment" },
      ],
    },
    {
      id: "sat",
      name: "sat",
      part: "Part I",
      marks: 5,
      prompt: md(
        "Write `sat :: BDD -> [[(Index, Bool)]]`, which lists every assignment that makes the expression True. Each assignment is a list of (variable, value) pairs: the choices made along one path from the root to the True leaf (id 1).",
        "",
        "```",
        hs`*Main> sat bdd1
[]
*Main> sat bdd2
[[(1,False),(2,False)],[(1,False),(2,True)],[(1,True),(2,False)]]
*Main> sat bdd8
[[(1,False)],[(1,True)]]`,
        "```",
        "",
        "List each assignment in path order (top variable first). The tests don't care about the order of the assignments in the outer list, but exploring left (False) before right (True) gives the order above.",
      ),
      hints: [
        "Same shape as `checkSat`: a helper that walks from a node id. But now you explore BOTH children and collect the paths from each.",
        "Base cases: id 0 gives `[]` (no satisfying assignment), id 1 gives `[[]]` (exactly one: the empty assignment). For an inner node, get the paths from the left child and the right child.",
        "Each path from the left child needs `(i, False)` put on its front; each from the right child needs `(i, True)`. If you write `[]` for the True leaf instead of `[[]]` there is nothing to put the pairs onto and every answer comes out empty.",
        md(
          "```",
          hs`sat (root, nodes) = paths root
  where
    paths 0 = []
    paths 1 = [[]]
    paths n = map ((i, False) :) (paths l) ++ map ((i, True) :) (paths r)
      where (i, l, r) = lookUp n nodes`,
          "```",
        ),
      ],
      solution: hs`sat :: BDD -> [[(Index, Bool)]]
sat (root, nodes)
  = paths root
  where
    paths 0 = []
    paths 1 = [[]]
    paths n
      = map ((i, False) :) (paths l) ++ map ((i, True) :) (paths r)
      where
        (i, l, r) = lookUp n nodes`,
      tests: [
        { expr: "sat bdd1", expected: "[]" },
        { expr: "sat bdd2", expected: "[[(1,False),(2,False)],[(1,False),(2,True)],[(1,True),(2,False)]]", unordered: true },
        { expr: "sat bdd8", expected: "[[(1,False)],[(1,True)]]", unordered: true },
        { expr: "sat bdd3", expected: "[[(1,True)]]" },
        { expr: "sat (1, [])", expected: "[[]]", label: "the True leaf has one (empty) satisfying assignment" },
        { expr: "sat bdd4", expected: "[[(2,False),(3,False),(7,True)],[(2,True),(3,False),(7,True)],[(2,True),(3,True),(7,True)]]", unordered: true },
        { expr: "length (sat bdd6)", expected: "7" },
        { expr: "length (sat bdd5)", expected: "5" },
        { expr: "and [checkSat bdd env | bdd <- [bdd2,bdd4,bdd5,bdd6,bdd7], env <- sat bdd]", expected: "True", label: "every assignment sat returns really satisfies the BDD" },
      ],
    },
    {
      id: "simplify",
      name: "simplify",
      part: "Part II",
      marks: 2,
      prompt: md(
        "Write a NON-recursive function `simplify :: BExp -> BExp`. If the expression is a `Not`, `And` or `Or` whose argument(s) are all primitive booleans (`Prim`), replace it by the `Prim` answer from the truth tables. Anything else is returned unchanged.",
        "",
        "```",
        hs`*Main> simplify (Not (Prim False))
Prim True
*Main> simplify (Or (Prim False) (Prim False))
Prim False
*Main> simplify (And (IdRef 3) (Prim True))
And (IdRef 3) (Prim True)`,
        "```",
        "",
        "The third one could in theory become `IdRef 3`, but that kind of simplification is not wanted. Only simplify when every argument is a `Prim`.",
      ),
      hints: [
        "One equation per shape you can simplify, using pattern matching on the constructors, plus a catch-all.",
        "The patterns are `Not (Prim b)`, `And (Prim a) (Prim b)` and `Or (Prim a) (Prim b)`. Use Haskell's own `not`, `&&` and `||` to work out the answer.",
        "Non-recursive means you don't call `simplify` on the parts. `Not (Not (Prim True))` stays as it is because the argument of the outer `Not` isn't a `Prim`.",
        md(
          "```",
          hs`simplify (Not (Prim b))          = Prim (not b)
simplify (And (Prim a) (Prim b)) = Prim (a && b)
simplify (Or (Prim a) (Prim b))  = Prim (a || b)
simplify e                       = e`,
          "```",
        ),
      ],
      solution: hs`simplify :: BExp -> BExp
simplify (Not (Prim b))
  = Prim (not b)
simplify (And (Prim a) (Prim b))
  = Prim (a && b)
simplify (Or (Prim a) (Prim b))
  = Prim (a || b)
simplify e
  = e`,
      tests: [
        { expr: "simplify (Not (Prim False))", expected: "Prim True" },
        { expr: "simplify (Or (Prim False) (Prim False))", expected: "Prim False" },
        { expr: "simplify (And (IdRef 3) (Prim True))", expected: "And (IdRef 3) (Prim True)" },
        { expr: "simplify (Not (Prim True))", expected: "Prim False" },
        { expr: "simplify (And (Prim True) (Prim True))", expected: "Prim True" },
        { expr: "simplify (And (Prim True) (Prim False))", expected: "Prim False" },
        { expr: "simplify (Or (Prim False) (Prim True))", expected: "Prim True" },
        { expr: "simplify (Or (Prim False) (IdRef 2))", expected: "Or (Prim False) (IdRef 2)" },
        { expr: "simplify (Not (Not (Prim True)))", expected: "Not (Not (Prim True))", label: "not recursive: the inner Not is left alone" },
        { expr: "simplify (IdRef 4)", expected: "IdRef 4" },
        { expr: "simplify (Prim True)", expected: "Prim True" },
      ],
    },
    {
      id: "restrict",
      name: "restrict",
      part: "Part II",
      marks: 5,
      prompt: md(
        "Write a recursive function `restrict :: BExp -> Index -> Bool -> BExp`. `restrict e i b` replaces every occurrence of the variable `IdRef i` in `e` with the constant `Prim b`.",
        "",
        "Replacing a variable may make simplification possible, so call `simplify` every time you rebuild a `Not`, `And` or `Or`.",
        "",
        "```",
        hs`*Main> b7
Or (Not (IdRef 3)) (Or (IdRef 2) (Not (IdRef 9)))
*Main> restrict b7 2 True
Or (Not (IdRef 3)) (Or (Prim True) (Not (IdRef 9)))
*Main> restrict (restrict b7 2 True) 9 False
Or (Not (IdRef 3)) (Prim True)
*Main> restrict (restrict (restrict b7 2 True) 9 False) 3 True
Prim True`,
        "```",
      ),
      hints: [
        "Structural recursion over `BExp`: one equation per constructor.",
        "`Prim` stays the same. `IdRef j` becomes `Prim b` if `j == i`, otherwise stays. For `Not`, `And`, `Or`: restrict the parts, rebuild, and pass the rebuilt expression to `simplify`.",
        "Simplify after restricting the children, so that the children are already as simple as possible. That is what lets `Prim True` bubble up to the top in the last example.",
        md(
          "```",
          hs`restrict (Prim b) _ _ = Prim b
restrict (IdRef j) i b
  | j == i    = Prim b
  | otherwise = IdRef j
restrict (Not e) i b     = simplify (Not (restrict e i b))
restrict (And e1 e2) i b = simplify (And (restrict e1 i b) (restrict e2 i b))
-- Or is the same shape as And`,
          "```",
        ),
      ],
      solution: hs`restrict :: BExp -> Index -> Bool -> BExp
restrict (Prim b) _ _
  = Prim b
restrict (IdRef j) i b
  | j == i    = Prim b
  | otherwise = IdRef j
restrict (Not e) i b
  = simplify (Not (restrict e i b))
restrict (And e1 e2) i b
  = simplify (And (restrict e1 i b) (restrict e2 i b))
restrict (Or e1 e2) i b
  = simplify (Or (restrict e1 i b) (restrict e2 i b))`,
      tests: [
        { expr: "restrict b7 2 True", expected: "Or (Not (IdRef 3)) (Or (Prim True) (Not (IdRef 9)))" },
        { expr: "restrict (restrict b7 2 True) 9 False", expected: "Or (Not (IdRef 3)) (Prim True)" },
        { expr: "restrict (restrict (restrict b7 2 True) 9 False) 3 True", expected: "Prim True" },
        { expr: "restrict b2 1 False", expected: "Not (And (Prim False) (Or (Prim False) (IdRef 2)))" },
        { expr: "restrict (restrict b2 1 False) 2 True", expected: "Prim True" },
        { expr: "restrict b8 1 True", expected: "Prim True" },
        { expr: "restrict b8 1 False", expected: "Prim True" },
        { expr: "restrict b6 9 True", expected: "b6", label: "restricting a variable that isn't there changes nothing" },
        { expr: "restrict b1 1 True", expected: "Prim False" },
        { expr: "restrict (IdRef 5) 5 False", expected: "Prim False" },
        { expr: "restrict (restrict b3 1 True) 1 False", expected: "Prim True" },
      ],
    },
    {
      id: "buildbdd",
      name: "buildBDD'",
      part: "Part III",
      marks: 6,
      prompt: md(
        "Build the complete BDD for an expression. The template gives you:",
        "",
        "```",
        hs`buildBDD :: BExp -> [Index] -> BDD
buildBDD e xs
  = buildBDD' e 2 xs`,
        "```",
        "",
        "and you write the helper `buildBDD' :: BExp -> NodeId -> [Index] -> BDD`. The list of indices says which variable to ask about at each level, top to bottom (it contains each variable of the expression exactly once). The `NodeId` is the id to give the node you are about to build.",
        "",
        "`buildBDD' e n (x : xs)` builds node `n`, which asks about variable `x`:",
        "",
        "- Its left child is the BDD for `e` with x set to False (use `restrict e x False`), built with id `2 * n` and the remaining variables `xs`.",
        "- Its right child is the BDD for `e` with x set to True, built with id `2 * n + 1`.",
        "- The result is `(n, (n, (x, l, r)) : <all the nodes of both children>)`, where `l` and `r` are the root ids returned for the children.",
        "",
        "Numbering children 2n and 2n+1 guarantees every node gets a different id (it's how heaps number a binary tree).",
        "",
        "When the list of indices is empty, every variable has been replaced, so `e` has been simplified to `Prim False` or `Prim True`. Return `(0, [])` or `(1, [])`: a leaf, with no nodes.",
        "",
        "```",
        hs`*Main> buildBDD b2 [1,2]
(2,[(2,(1,4,5)),(4,(2,1,1)),(5,(2,1,0))])
*Main> buildBDD b8 [1]
(2,[(2,(1,1,1))])
*Main> buildBDD b1 []
(0,[])`,
        "```",
        "",
        "The order of the node list doesn't matter; the tests sort it.",
      ),
      hints: [
        "Recursion on the list of indices. This is the Shannon expansion: a node for x whose left side is \"e with x = False\" and right side is \"e with x = True\".",
        "Base case `buildBDD' e _ []`: return `(1, [])` if `e == Prim True`, otherwise `(0, [])`. Recursive case: two recursive calls, one per child, each returning a `(rootId, nodes)` pair.",
        "The children's ids are `2 * n` and `2 * n + 1`, but the ids you store in the triple are whatever root ids the recursive calls RETURN, because a child might be a leaf (0 or 1).",
        md(
          "```",
          hs`buildBDD' e _ [] = (if e == Prim True then 1 else 0, [])
buildBDD' e n (x : xs)
  = (n, (n, (x, l, r)) : leftNodes ++ rightNodes)
  where
    (l, leftNodes)  = buildBDD' (restrict e x False) (2 * n) xs
    (r, rightNodes) = buildBDD' (restrict e x True) (2 * n + 1) xs`,
          "```",
        ),
      ],
      solution: hs`buildBDD' :: BExp -> NodeId -> [Index] -> BDD
buildBDD' e _ []
  | e == Prim True = (1, [])
  | otherwise      = (0, [])
buildBDD' e n (x : xs)
  = (n, (n, (x, l, r)) : leftNodes ++ rightNodes)
  where
    (l, leftNodes)  = buildBDD' (restrict e x False) (2 * n) xs
    (r, rightNodes) = buildBDD' (restrict e x True) (2 * n + 1) xs`,
      tests: [
        { expr: "let (r, ns) = buildBDD b2 [1,2] in (r, sort ns)", expected: "(2,[(2,(1,4,5)),(4,(2,1,1)),(5,(2,1,0))])" },
        { expr: "buildBDD b1 []", expected: "(0,[])" },
        { expr: "buildBDD b8 [1]", expected: "bdd8" },
        { expr: "let (r, ns) = buildBDD b4 [2,3,7] in (r, sort ns)", expected: "let (r, ns) = bdd4 in (r, sort ns)", label: "buildBDD b4 [2,3,7] is bdd4" },
        { expr: "let (r, ns) = buildBDD b6 [1,2,3,4] in (r, sort ns)", expected: "let (r, ns) = bdd6 in (r, sort ns)", label: "buildBDD b6 [1,2,3,4] is bdd6" },
        { expr: "buildBDD' b3 7 [1]", expected: "(7,[(7,(1,0,1))])", label: "the given NodeId is used for the root" },
        { expr: "buildBDD (Prim True) []", expected: "(1,[])" },
        { expr: "let (r, ns) = buildBDD b2 [2,1] in (r, sort ns)", expected: "(2,[(2,(2,4,5)),(4,(1,1,1)),(5,(1,1,0))])", label: "variable order [2,1]" },
        { expr: "length (snd (buildBDD b6 [4,2,3,1]))", expected: "15" },
        { expr: "and [agreesWith (buildBDD b xs) b xs | (b, xs) <- [(b2,[2,1]),(b5,[7,3,2]),(b7,[9,2,3]),(b6,[3,1,4,2])]]", expected: "True", label: "built BDDs agree with their expressions for any variable order" },
      ],
    },
    {
      id: "robdd",
      name: "buildROBDD",
      part: "Part IV",
      marks: 2,
      prompt: md(
        "Prize question: build a Reduced Ordered BDD (ROBDD), `buildROBDD :: BExp -> [Index] -> ROBDD`, where `type ROBDD = BDD`. A complete BDD has lots of repetition. An ROBDD removes it with two rules, applied while you build:",
        "",
        "1. Node elimination. If a node's left and right children are the same, the question doesn't matter: don't build the node, just use the child directly.",
        "2. Sharing. If a node `(x, l, r)` with exactly the same variable and children has already been built, reuse its id instead of building a copy.",
        "",
        "```",
        hs`complete BDD for b8 = x1 ∨ ¬x1        ROBDD
          x1                          T
         /  \             ==>   (just the True leaf: (1, []))
        T    T`,
        "```",
        "",
        "Different variable orders give different ROBDDs. For `b6 = (x1 ∧ x2) ∨ (x3 ∧ x4)` the order `[1,2,3,4]` gives an ROBDD with 4 nodes but `[1,3,2,4]` gives 6 nodes. The complete BDD has 15.",
        "",
        "The node ids can be anything unique (2 or more). The tests check that your ROBDD gives the right answer for every assignment, has no node with equal children, has no two nodes with the same triple, and has the minimum number of nodes for that variable order.",
      ),
      hints: [
        "Like `buildBDD'`, but you must carry the table of nodes built so far through the recursion, so the right child can reuse nodes the left child created. Return the new table and the next free id along with the root id.",
        "Helper type idea: `BExp -> [Index] -> [BDDNode] -> NodeId -> (NodeId, [BDDNode], NodeId)`: expression, remaining variables, nodes so far, next free id; result is root id, updated nodes, next free id. Build the left child first, feed its table into the right child.",
        "After building both children: if `l == r` return `l` (elimination). Otherwise search the table for an existing node whose triple is `(x, l, r)` and return its id if found (sharing). Only if both fail, add a new node with the next free id.",
        md(
          "```",
          hs`robdd e [] ns next = (if e == Prim True then 1 else 0, ns, next)
robdd e (x : xs) ns next
  | l == r    = (l, ns2, next2)
  | otherwise = case [n | (n, t) <- ns2, t == (x, l, r)] of
      (n : _) -> (n, ns2, next2)
      []      -> (next2, (next2, (x, l, r)) : ns2, next2 + 1)
  where
    (l, ns1, next1) = robdd (restrict e x False) xs ns next
    (r, ns2, next2) = robdd (restrict e x True) xs ns1 next1`,
          "```",
        ),
      ],
      solution: hs`buildROBDD :: BExp -> [Index] -> ROBDD
buildROBDD e xs
  = (root, nodes)
  where
    (root, nodes, _) = buildReduced e xs [] 2

-- Carries the nodes built so far and the next free id,
-- so that identical subtrees can be shared.
buildReduced :: BExp -> [Index] -> [BDDNode] -> NodeId
             -> (NodeId, [BDDNode], NodeId)
buildReduced e [] ns next
  | e == Prim True = (1, ns, next)
  | otherwise      = (0, ns, next)
buildReduced e (x : xs) ns next
  | l == r    = (l, ns2, next2)
  | otherwise
    = case [n | (n, triple) <- ns2, triple == (x, l, r)] of
        (n : _) -> (n, ns2, next2)
        []      -> (next2, (next2, (x, l, r)) : ns2, next2 + 1)
  where
    (l, ns1, next1) = buildReduced (restrict e x False) xs ns next
    (r, ns2, next2) = buildReduced (restrict e x True) xs ns1 next1`,
      tests: [
        { expr: "robddOK b6 [1,2,3,4] 4", label: "b6 with order [1,2,3,4]: correct, reduced, 4 nodes" },
        { expr: "robddOK b6 [1,3,2,4] 6", label: "b6 with order [1,3,2,4]: correct, reduced, 6 nodes" },
        { expr: "buildROBDD b8 [1]", expected: "(1,[])", label: "a tautology reduces to the True leaf" },
        { expr: "buildROBDD b1 []", expected: "(0,[])" },
        { expr: "robddOK b2 [1,2] 2" },
        { expr: "robddOK b3 [1] 1" },
        { expr: "robddOK b4 [2,3,7] 3" },
        { expr: "robddOK b5 [2,3,7] 3" },
        { expr: "robddOK b7 [2,3,9] 3" },
        { expr: "robddOK (And (IdRef 1) (Not (IdRef 1))) [1] 0", label: "a contradiction reduces to the False leaf" },
      ],
    },
  ],
};
