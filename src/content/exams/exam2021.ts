import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "y2021",
  year: 2021,
  title: "Graph colouring and register allocation",
  summary:
    "Colour the nodes of a graph so that neighbours never share a colour, then use that colouring to rename a program's variables into machine registers.",
  skills: [
    "list comprehensions",
    "filter and length for counting",
    "tuples and pattern matching",
    "recursion with a base case",
    "minimum on tuples to break ties",
    "list difference with \\\\",
    "lookup tables (association lists)",
    "recursion over a tree-shaped data type",
    "nub and union for sets as lists",
    "fixed-point iteration (prize part)",
  ],
  story: md(
    "This paper has two ideas glued together: colouring a graph, and using that colouring to speed up a program. You don't need to know anything about either. Here they are from zero.",
    "",
    "**What is a graph?** A graph is a set of dots (called nodes) with some lines (called edges) joining pairs of them. That's all. Here is a graph with four nodes, numbered 1 to 4:",
    "",
    "```",
    "    1 ----- 2",
    "    |       |",
    "    |       |",
    "    3 ----- 4",
    "```",
    "",
    "Its edges are 1-2, 1-3, 2-4 and 3-4. The **neighbours** of a node are the nodes it is joined to: the neighbours of 2 are 1 and 4. The **degree** of a node is how many edges touch it: every node above has degree 2.",
    "",
    "**What is graph colouring?** You're given C colours, numbered 1, 2, ..., C. You must give each node one colour so that no edge joins two nodes of the same colour. The graph above can be coloured with two colours: give 1 and 4 colour 1, and give 2 and 3 colour 2. Check: every edge joins a 1 to a 2.",
    "",
    "Add the edge 1-4 and two colours are no longer enough: 1, 2 and 4 are now all joined to each other (a triangle), so they need three different colours. When a node can't be given any colour, we give it the special \"blank\" colour 0, meaning \"left out\".",
    "",
    "```",
    "    1 ----- 2",
    "    | \\     |",
    "    |   \\   |",
    "    3 ----- 4        edges: 1-2 1-3 1-4 2-4 3-4",
    "```",
    "",
    "**Chaitin's algorithm** is the recipe the paper makes you use. It's recursive:",
    "",
    "1. If the graph has no nodes, the answer is the empty colouring `[]`.",
    "2. Otherwise pick the node with the smallest degree. If several tie, pick the one with the smallest label (so `\"i\"` before `\"n\"`, and 1 before 3).",
    "3. Remove that node and all its edges, and colour what's left recursively.",
    "4. Now put the node back: look at the colours its neighbours got, and give it the smallest colour from 1..C that none of them uses. If all C are taken, give it 0.",
    "",
    "**What is a register?** A computer's processor has a handful of tiny, super-fast storage slots called registers, named R1, R2, R3 and so on. Ordinary variables live in main memory, which is much slower. A compiler speeds a program up by storing variables in registers instead. But two variables can only share a register if they're never needed at the same time.",
    "",
    "**Live variables and interference.** A variable is **live** at a line of the program if its current value might still be read later. Two variables **interfere** if they are live at the same moment somewhere. Build a graph with one node per variable and an edge between every interfering pair: this is the **interference graph** (IG). Now colour it with R colours, where R is the number of registers. Colour k means \"store this variable in register Rk\". Neighbours get different colours, so interfering variables never share a register. A blank (0) variable simply keeps its own name.",
    "",
    "Here's the paper's factorial example. On the left is the original; `n` and `i` never interfere, so both go in R2, and `prod` goes in R1:",
    "",
    "```",
    "fun fact(n) {                  fun fact(n) {",
    "0: if (n == 0) {               0: R2 = n;",
    "1:   return = 1;               1: if (R2 == 0) {",
    "   } else {                    2:   return = 1;",
    "2:   prod = 1;                    } else {",
    "3:   i = n;                    3:   R1 = 1;",
    "4:   while (i >= 1) {          4:   while (R2 >= 1) {",
    "5:     prod = prod * i;        5:     R1 = R1 * R2;",
    "6:     i = i + -1;             6:     R2 = R2 + -1;",
    "     }                              }",
    "7:   return = prod;            7:   return = R1;",
    "   }                              }",
    "}                              }",
    "```",
    "",
    "Two details to notice. First, `i = n` became `R2 = R2`, which does nothing, so it was deleted. Second, because the argument `n` now lives in R2, a new first line `R2 = n` copies it in. The special variable `return` (how this little language returns a result) is never renamed.",
    "",
    "**The given types, one by one.**",
    "",
    "```haskell",
    "type Id = String",
    "data Op = Add | Mul | Eq | GEq",
    "data Exp = Const Int | Var Id | Apply Op Exp Exp",
    "data Statement = Assign Id Exp | If Exp Block Block | While Exp Block",
    "type Block = [Statement]",
    "type Function = (Id, [Id], Block)",
    "```",
    "",
    "- `Id` is just a variable name, like `\"prod\"`.",
    "- `Op` names the four operators: `Add` is `+`, `Mul` is `*`, `Eq` is `==` and `GEq` is `>=`.",
    "- `Exp` is an expression. `Const 5` is the number 5. `Var \"i\"` is a use of variable `i`. `Apply Add (Var \"i\") (Const 1)` is `i + 1`: an operator with its left and right sub-expressions. Expressions can nest, so this is a tree.",
    "- `Statement` is one instruction. `Assign \"i\" e` is `i = e;`. `If p b1 b2` runs block `b1` if `p` is true, else block `b2`. `While p b` repeats block `b` while `p` is true.",
    "- `Block` is a list of statements run in order. Blocks contain statements, which can contain blocks again: another tree.",
    "- `Function` is a triple: the function's name, its argument names, and its body.",
    "",
    "```haskell",
    "type Edge a = (a, a)",
    "type Graph a = ([a], [Edge a])",
    "type IG = Graph Id",
    "type Colour = Int",
    "type Colouring a = [(a, Colour)]",
    "type IdMap = [(Id, Id)]",
    "```",
    "",
    "- A `Graph a` is a pair: the list of node labels and the list of edges, each edge a pair of labels. The square graph above is `([1,2,3,4], [(1,2),(1,3),(2,4),(3,4)])`. Edges have no direction: `(1,2)` means 1 and 2 are joined, and each edge appears only once.",
    "- An `IG` is a graph whose labels are variable names.",
    "- A `Colouring` pairs each node with its colour, e.g. `[(\"i\",2),(\"n\",2),(\"prod\",1)]`. Colour 0 means blank.",
    "- An `IdMap` pairs each old variable name with its new one, e.g. `(\"prod\",\"R1\")`.",
    "",
    "You're also given `lookUp key table`, which finds the value paired with `key` in a list of pairs (and crashes with a helpful message if it isn't there).",
  ),
  notes: md(
    "**Where the marks are (30 total).** Part I is 10 marks of short list functions. Part II, `colourGraph`, is 8 marks on its own. Part III is 10 marks of renaming. Part IV, `buildIG`, is 2 marks. Part V is worth 0 marks and only breaks ties for the prize.",
    "",
    "**Order of attack.** Do Part I first: `count`, `degrees`, `neighbours` and `removeNode` are each a few lines, and `colourGraph` needs all of them. Then do `colourGraph` carefully. Then Part III, which is independent of the graph code: if `colourGraph` is fighting you, skip to Part III and come back. `buildIG` is a two-line list comprehension, so do it before you run out of time even if you skip something else.",
    "",
    "**Traps.**",
    "",
    "- `degrees` must report degree 0 for a node with no edges, so loop over the node list, not the edge list.",
    "- An edge `(a, b)` makes `b` a neighbour of `a` and also `a` a neighbour of `b`. Check both ends.",
    "- `colourGraph` tie-break: pick the smallest degree, then the smallest label. `minimum` on swapped `(degree, label)` pairs does exactly that.",
    "- Colours of neighbours come from the recursive result, but which nodes are neighbours comes from the original graph (before removal).",
    "- `buildArgAssignments` must skip arguments that map to themselves (blank colour), otherwise you'd generate useless `a = a` lines.",
    "- `renameBlock` must rename inside `If` and `While` bodies too, and must delete `v = v` assignments at every level, not just the top.",
    "- `buildIG` must not produce the same edge twice, not even once as `(a,b)` and once as `(b,a)`.",
    "",
    "**Part V (0 marks).** Only try `liveVars` and `buildCFG` once Parts I to IV are done and tested. They're included here as practice in fixed-point iteration and threading a counter through a tree.",
  ),
  setup: hs`import Data.List
import Data.Maybe

type Id = String

data Op = Add | Mul | Eq | GEq
  deriving (Eq, Show)

data Exp = Const Int | Var Id | Apply Op Exp Exp
  deriving (Eq, Show)

data Statement = Assign Id Exp
               | If Exp Block Block
               | While Exp Block
  deriving (Eq, Show)

type Block = [Statement]

type Function = (Id, [Id], Block)

type Edge a = (a, a)

type Graph a = ([a], [Edge a])

type IG = Graph Id

type Colour = Int

type Colouring a = [(a, Colour)]

type IdMap = [(Id, Id)]

type CFG = [((Id, [Id]), [Int])]

lookUp :: (Eq a, Show a, Show b) => a -> [(a, b)] -> b
lookUp x table
  = fromMaybe (error ("lookUp error: no binding for " ++ show x ++ " in " ++ show table))
              (lookup x table)

-- Sorts the nodes and edges of a graph (and writes each edge smaller label first)
-- so that graphs can be compared with ==.
sortGraph :: Ord a => Graph a -> Graph a
sortGraph (ns, es) = (sort ns, sort [(min a b, max a b) | (a, b) <- es])

sortCFG :: CFG -> CFG
sortCFG = map (\((d, us), ss) -> ((d, sort us), sort ss))

renameFun :: Function -> IdMap -> Function
renameFun (f, as, b) idMap
  = (f, as, buildArgAssignments as idMap ++ renameBlock b idMap)

------------------------------------------------------------
-- Pretty printing: showFun and showBlock print programs with numbered lines

shOp :: Op -> String
shOp Add = "+"
shOp Mul = "*"
shOp Eq  = "=="
shOp GEq = ">="

shExp :: Exp -> String
shExp (Const n) = show n
shExp (Var v) = v
shExp (Apply op e1 e2) = showArg e1 ++ " " ++ shOp op ++ " " ++ showArg e2
  where
    showArg e@(Apply _ _ _) = "(" ++ shExp e ++ ")"
    showArg e = shExp e

shBlockLines :: Int -> Int -> Block -> ([String], Int)
shBlockLines _ n [] = ([], n)
shBlockLines ind n (s : ss) = (ls1 ++ ls2, n2)
  where
    (ls1, n1) = shStatementLines ind n s
    (ls2, n2) = shBlockLines ind n1 ss

shStatementLines :: Int -> Int -> Statement -> ([String], Int)
shStatementLines ind n (Assign v e)
  = ([shIndent ind (show n ++ ": " ++ v ++ " = " ++ shExp e ++ ";")], n + 1)
shStatementLines ind n (If p b1 b2)
  = ([shIndent ind (show n ++ ": if (" ++ shExp p ++ ") {")] ++ ls1 ++ elsePart ++ [shIndent ind "}"], n2)
  where
    (ls1, n1) = shBlockLines (ind + 1) (n + 1) b1
    (ls2, n2) = shBlockLines (ind + 1) n1 b2
    elsePart = if null b2 then [] else shIndent ind "} else {" : ls2
shStatementLines ind n (While p b)
  = ([shIndent ind (show n ++ ": while (" ++ shExp p ++ ") {")] ++ ls ++ [shIndent ind "}"], n1)
  where
    (ls, n1) = shBlockLines (ind + 1) (n + 1) b

shIndent :: Int -> String -> String
shIndent ind s = replicate (2 * ind) ' ' ++ s

prettyBlock :: Block -> String
prettyBlock b = unlines (fst (shBlockLines 0 0 b))

prettyFun :: Function -> String
prettyFun (f, as, b)
  = unlines (("fun " ++ f ++ "(" ++ intercalate ", " as ++ ") {") : fst (shBlockLines 1 0 b) ++ ["}"])

showBlock :: Block -> IO ()
showBlock = putStr . prettyBlock

showFun :: Function -> IO ()
showFun = putStr . prettyFun

------------------------------------------------------------
-- Examples

fig1Left :: Graph Int
fig1Left = ([1,2,3,4], [(1,2),(1,3),(2,4),(3,4)])

fig1Middle :: Graph Int
fig1Middle = ([1,2,3,4], [(1,2),(1,3),(1,4),(2,4),(3,4)])

fact :: Function
fact
  = ("fact",
     ["n"],
     [If (Apply Eq (Var "n") (Const 0))
       [Assign "return" (Const 1)]
       [Assign "prod" (Const 1),
        Assign "i" (Var "n"),
        While (Apply GEq (Var "i") (Const 1))
          [Assign "prod" (Apply Mul (Var "prod") (Var "i")),
           Assign "i" (Apply Add (Var "i") (Const (-1)))
          ],
        Assign "return" (Var "prod")
       ]
     ]
    )

factB :: Block
factB = body
  where
    (_, _, body) = fact

factIG :: IG
factIG = (["i","n","prod"], [("i","prod"),("n","prod")])

factColouring :: Colouring Id
factColouring = [("i",2),("n",2),("prod",1)]

factIdMap :: IdMap
factIdMap = [("return","return"),("i","R2"),("n","R2"),("prod","R1")]

factTransformed :: Function
factTransformed
  = ("fact",
     ["n"],
     [Assign "R2" (Var "n"),
      If (Apply Eq (Var "R2") (Const 0))
        [Assign "return" (Const 1)]
        [Assign "R1" (Const 1),
         While (Apply GEq (Var "R2") (Const 1))
           [Assign "R1" (Apply Mul (Var "R1") (Var "R2")),
            Assign "R2" (Apply Add (Var "R2") (Const (-1)))
           ],
         Assign "return" (Var "R1")
        ]
     ]
    )

factLiveVars :: [[Id]]
factLiveVars = [["n"],[],["n"],["n","prod"],["i","prod"],["i","prod"],["i","prod"],["prod"]]

factCFG :: CFG
factCFG
  = [(("_",["n"]),[1,2]),
     (("return",[]),[]),
     (("prod",[]),[3]),
     (("i",["n"]),[4]),
     (("_",["i"]),[5,7]),
     (("prod",["i","prod"]),[6]),
     (("i",["i"]),[4]),
     (("return",["prod"]),[])]

fig3 :: Function
fig3
  = ("f",
     ["a","n"],
     [Assign "b" (Const 0),
      While (Apply GEq (Var "n") (Const 1))
        [Assign "c" (Apply Add (Var "a") (Var "b")),
         Assign "d" (Apply Add (Var "c") (Var "b")),
         If (Apply GEq (Var "d") (Const 20))
           [Assign "b" (Apply Add (Var "c") (Var "d")),
            Assign "d" (Apply Add (Var "d") (Const 1))
           ]
           [],
         Assign "a" (Apply Mul (Var "c") (Var "d")),
         Assign "n" (Apply Add (Var "n") (Const (-1)))
        ],
      Assign "return" (Var "d")
     ]
    )

fig3B :: Block
fig3B = body
  where
    (_, _, body) = fig3

fig3IG :: IG
fig3IG = (["a","b","c","d","n"],
          [("a","b"),("a","d"),("a","n"),("b","c"),("b","d"),
           ("b","n"),("c","d"),("c","n"),("d","n")])

fig3Colouring :: Colouring Id
fig3Colouring = [("a",3),("b",0),("c",3),("d",2),("n",1)]

fig3IdMap :: IdMap
fig3IdMap = [("return","return"),("a","R3"),("b","b"),("c","R3"),("d","R2"),("n","R1")]

fig3Transformed :: Function
fig3Transformed
  = ("f",
     ["a","n"],
     [Assign "R3" (Var "a"),
      Assign "R1" (Var "n"),
      Assign "b" (Const 0),
      While (Apply GEq (Var "R1") (Const 1))
        [Assign "R3" (Apply Add (Var "R3") (Var "b")),
         Assign "R2" (Apply Add (Var "R3") (Var "b")),
         If (Apply GEq (Var "R2") (Const 20))
           [Assign "b" (Apply Add (Var "R3") (Var "R2")),
            Assign "R2" (Apply Add (Var "R2") (Const 1))
           ]
           [],
         Assign "R3" (Apply Mul (Var "R3") (Var "R2")),
         Assign "R1" (Apply Add (Var "R1") (Const (-1)))
        ],
      Assign "return" (Var "R2")
     ]
    )

fig3LiveVars :: [[Id]]
fig3LiveVars
  = [["a","d","n"],["a","b","d","n"],["a","b","n"],["b","c","n"],["b","c","d","n"],
     ["c","d","n"],["b","c","d","n"],["b","c","d","n"],["a","b","d","n"],["d"]]

fig3CFG :: CFG
fig3CFG
  = [(("b",[]),[1]),
     (("_",["n"]),[2,9]),
     (("c",["a","b"]),[3]),
     (("d",["b","c"]),[4]),
     (("_",["d"]),[5,7]),
     (("b",["c","d"]),[6]),
     (("d",["d"]),[7]),
     (("a",["c","d"]),[8]),
     (("n",["n"]),[1]),
     (("return",["d"]),[])]

idMap1 :: IdMap
idMap1 = [("a","a"),("b","R1"),("y","R1"),("x","R6")]

e1 :: Exp
e1 = Apply Add (Var "a") (Var "b")

e2 :: Exp
e2 = Apply Mul (Apply Add (Var "x") (Const 2)) (Var "y")
`,
  starter: hs`------------------------------------------------------------
-- Part I

count :: Eq a => a -> [a] -> Int
count = undefined

degrees :: Eq a => Graph a -> [(a, Int)]
degrees = undefined

neighbours :: Eq a => a -> Graph a -> [a]
neighbours = undefined

removeNode :: Eq a => a -> Graph a -> Graph a
removeNode = undefined

------------------------------------------------------------
-- Part II

colourGraph :: (Ord a, Show a) => Int -> Graph a -> Colouring a
colourGraph = undefined

------------------------------------------------------------
-- Part III

buildIdMap :: Colouring Id -> IdMap
buildIdMap = undefined

buildArgAssignments :: [Id] -> IdMap -> [Statement]
buildArgAssignments = undefined

renameExp :: Exp -> IdMap -> Exp
renameExp = undefined

renameBlock :: Block -> IdMap -> Block
renameBlock = undefined

------------------------------------------------------------
-- Part IV

buildIG :: [[Id]] -> IG
buildIG = undefined

------------------------------------------------------------
-- Part V (0 marks, prize only)

liveVars :: CFG -> [[Id]]
liveVars = undefined

buildCFG :: Function -> CFG
buildCFG = undefined
`,
  tasks: [
    {
      id: "count",
      name: "count",
      part: "Part I",
      marks: 1,
      prompt: md(
        "Define `count :: Eq a => a -> [a] -> Int` that counts how many times an item appears in a list.",
        "",
        "```",
        "*Alloc> count 'a' \"b\"",
        "0",
        "*Alloc> count 3 [2,4,1,3,2,3,3]",
        "3",
        "```",
      ),
      hints: [
        "Keep only the elements equal to the item, then measure how many are left.",
        "`filter` keeps the elements that pass a test; `length` counts a list.",
        "The test is \"equal to x\". A section like `(== x)` is a function that asks exactly that.",
        "`count x xs = length (filter (== x) xs)`",
      ],
      solution: hs`count :: Eq a => a -> [a] -> Int
count x xs = length (filter (== x) xs)`,
      tests: [
        { expr: `count 'a' "b"`, expected: "0" },
        { expr: "count 3 [2,4,1,3,2,3,3]", expected: "3" },
        { expr: `count 'x' ""`, expected: "0" },
        { expr: "count True [True, False, True]", expected: "2" },
        { expr: `count "a" ["a", "b", "a", "ab"]`, expected: "2" },
        { expr: "count 5 [5]", expected: "1" },
      ],
    },
    {
      id: "degrees",
      name: "degrees",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Using `count`, or otherwise, define `degrees :: Eq a => Graph a -> [(a, Int)]` that pairs every node of a graph with its degree. The degree of a node is the number of edges that begin or end at it.",
        "",
        "`fig1Left` is the graph of Figure 1 (left), the square with edges 1-2, 1-3, 2-4, 3-4:",
        "",
        "```",
        "*Alloc> degrees ([1], [])",
        "[(1,0)]",
        "*Alloc> fig1Left",
        "([1,2,3,4],[(1,2),(1,3),(2,4),(3,4)])",
        "*Alloc> degrees fig1Left",
        "[(1,2),(2,2),(3,2),(4,2)]",
        "```",
        "",
        "The order of the pairs in the result doesn't matter.",
      ),
      hints: [
        "Make one pair for each node in the node list. Use `count` to work out the number.",
        "Turn the edge list into one long list of all edge endpoints: `(1,2)` contributes both `1` and `2`. A node's degree is how often it appears in that list.",
        "Loop over the nodes, not the edges, so that a node with no edges still appears with degree 0.",
        md(
          "```haskell",
          "degrees (ns, es) = [(n, count n ends) | n <- ns]",
          "  where",
          "    ends = concat [[a, b] | (a, b) <- es]",
          "```",
        ),
      ],
      solution: hs`degrees :: Eq a => Graph a -> [(a, Int)]
degrees (ns, es) = [(n, count n ends) | n <- ns]
  where
    ends = concat [[a, b] | (a, b) <- es]`,
      tests: [
        { expr: "degrees ([1], [])", expected: "[(1,0)]" },
        { expr: "degrees fig1Left", expected: "[(1,2),(2,2),(3,2),(4,2)]", unordered: true },
        { expr: "degrees fig1Middle", expected: "[(1,3),(2,2),(3,2),(4,3)]", unordered: true },
        { expr: "degrees factIG", expected: `[("i",1),("n",1),("prod",2)]`, unordered: true },
        { expr: "degrees fig3IG", expected: `[("a",3),("b",4),("c",3),("d",4),("n",4)]`, unordered: true },
        { expr: "degrees ([1,2,3], [(1,2)])", expected: "[(1,1),(2,1),(3,0)]", unordered: true },
        { expr: "degrees ([] :: [Int], [])", expected: "[]" },
      ],
    },
    {
      id: "neighbours",
      name: "neighbours",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define `neighbours :: Eq a => a -> Graph a -> [a]` that returns the neighbours of a node: every node joined to it by an edge.",
        "",
        "```",
        "*Alloc> neighbours 1 ([1], [])",
        "[]",
        "*Alloc> neighbours 2 fig1Left",
        "[1,4]",
        "```",
        "",
        "The order of the result doesn't matter.",
      ),
      hints: [
        "Look through the edge list. You only need the edges, not the node list.",
        "An edge `(a, b)` touches `n` if `a == n` (then `b` is a neighbour) or if `b == n` (then `a` is a neighbour).",
        "Edges have no direction, so you must check both positions. In `fig1Left`, node 2 appears first in `(2,4)` but second in `(1,2)`.",
        "`neighbours n (_, es) = [b | (a, b) <- es, a == n] ++ [a | (a, b) <- es, b == n]`",
      ],
      solution: hs`neighbours :: Eq a => a -> Graph a -> [a]
neighbours n (_, es) = [b | (a, b) <- es, a == n] ++ [a | (a, b) <- es, b == n]`,
      tests: [
        { expr: "neighbours 1 ([1], [])", expected: "[]" },
        { expr: "neighbours 2 fig1Left", expected: "[1,4]", unordered: true },
        { expr: "neighbours 4 fig1Middle", expected: "[1,2,3]", unordered: true },
        { expr: `neighbours "prod" factIG`, expected: `["i","n"]`, unordered: true },
        { expr: `neighbours "i" factIG`, expected: `["prod"]` },
        { expr: `neighbours "a" fig3IG`, expected: `["b","d","n"]`, unordered: true },
        { expr: `neighbours "n" fig3IG`, expected: `["a","b","c","d"]`, unordered: true },
      ],
    },
    {
      id: "removeNode",
      name: "removeNode",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define `removeNode :: Eq a => a -> Graph a -> Graph a` that removes a node from a graph, together with every edge that touches it.",
        "",
        "```",
        "*Alloc> factIG",
        "([\"i\",\"n\",\"prod\"],[(\"i\",\"prod\"),(\"n\",\"prod\")])",
        "*Alloc> removeNode \"i\" factIG",
        "([\"n\",\"prod\"],[(\"n\",\"prod\")])",
        "*Alloc> removeNode \"prod\" factIG",
        "([\"i\",\"n\"],[])",
        "```",
        "",
        "The order of the elements in the lists doesn't matter. (The tests compare graphs using the given `sortGraph`.)",
      ),
      hints: [
        "Build the new pair: a filtered node list and a filtered edge list.",
        "Keep the nodes that aren't `n`. Keep the edges where neither end is `n`.",
        "An edge `(a, b)` must go if either `a == n` or `b == n`.",
        "`removeNode n (ns, es) = (filter (/= n) ns, [(a, b) | (a, b) <- es, a /= n, b /= n])`",
      ],
      solution: hs`removeNode :: Eq a => a -> Graph a -> Graph a
removeNode n (ns, es) = (filter (/= n) ns, [(a, b) | (a, b) <- es, a /= n, b /= n])`,
      tests: [
        { expr: `sortGraph (removeNode "i" factIG)`, expected: `(["n","prod"],[("n","prod")])` },
        { expr: `sortGraph (removeNode "prod" factIG)`, expected: `(["i","n"],[])` },
        { expr: "sortGraph (removeNode 1 fig1Middle)", expected: "([2,3,4],[(2,4),(3,4)])" },
        { expr: "sortGraph (removeNode 4 fig1Left)", expected: "([1,2,3],[(1,2),(1,3)])" },
        { expr: "removeNode 1 ([1], [])", expected: "([],[])" },
        {
          expr: `sortGraph (removeNode "d" fig3IG)`,
          expected: `(["a","b","c","n"],[("a","b"),("a","n"),("b","c"),("b","n"),("c","n")])`,
        },
        { expr: "sortGraph (removeNode 9 fig1Left)", expected: "sortGraph fig1Left", label: "removing a node that isn't there changes nothing" },
      ],
    },
    {
      id: "colourGraph",
      name: "colourGraph",
      part: "Part II",
      marks: 8,
      prompt: md(
        "Define `colourGraph :: (Ord a, Show a) => Int -> Graph a -> Colouring a` that colours a graph using Chaitin's algorithm. The first argument is the number of colours C; the colours are 1 to C, and 0 means blank.",
        "",
        "The algorithm, for a graph `g`:",
        "",
        "- If `g` has no nodes, the result is `[]`.",
        "- Otherwise pick the node `n` with the smallest degree. If several tie, pick the one with the smallest label.",
        "- Remove `n` (and its edges) from `g`, and colour the smaller graph recursively, giving `cMap`.",
        "- Give `n` the smallest colour in 1..C that isn't used by any of `n`'s neighbours in `g` (look their colours up in `cMap`). If there's none, use 0.",
        "- Return `(n, colour)` added to the front of `cMap`.",
        "",
        "```",
        "*Alloc> fig1Middle",
        "([1,2,3,4],[(1,2),(1,3),(1,4),(2,4),(3,4)])",
        "*Alloc> colourGraph 2 fig1Middle",
        "[(2,2),(1,0),(3,2),(4,1)]",
        "*Alloc> fig3IG",
        "([\"a\",\"b\",\"c\",\"d\",\"n\"],[(\"a\",\"b\"),(\"a\",\"d\"),(\"a\",\"n\"),(\"b\",\"c\"),(\"b\",\"d\"),",
        "(\"b\",\"n\"),(\"c\",\"d\"),(\"c\",\"n\"),(\"d\",\"n\")])",
        "*Alloc> colourGraph 2 fig3IG",
        "[(\"a\",0),(\"b\",0),(\"c\",0),(\"d\",2),(\"n\",1)]",
        "*Alloc> colourGraph 3 fig3IG",
        "[(\"a\",3),(\"b\",0),(\"c\",3),(\"d\",2),(\"n\",1)]",
        "```",
        "",
        "The order of the result doesn't matter. The paper's hint: if you swap each `(node, degree)` pair from `degrees` into `(degree, node)`, the node you want is the second half of the `minimum` of that list. The list difference operator `\\\\` from `Data.List` helps with choosing the colour: `[1,2,3] \\\\ [2]` is `[1,3]`.",
      ),
      hints: [
        "This is recursion on the graph: base case is the empty node list, and each recursive call is on the graph with one node removed. Use all four Part I functions.",
        "In a `where` clause name the pieces: the chosen node `n`, the recursive colouring `cMap = colourGraph c (removeNode n g)`, the colours already used by `n`'s neighbours, and the chosen colour.",
        "`minimum` on pairs compares the first parts, and only uses the second part to break ties. So `minimum [(d, v) | (v, d) <- degrees g]` gives the smallest degree with the smallest label. Find the neighbours in the original `g`, not in the smaller graph, but look their colours up in `cMap`.",
        md(
          "```haskell",
          "colourGraph _ ([], _) = []",
          "colourGraph c g = (n, colour) : cMap",
          "  where",
          "    n = snd (minimum [(d, v) | (v, d) <- degrees g])",
          "    cMap = colourGraph c (removeNode n g)",
          "    taken = [lookUp m cMap | m <- neighbours n g]",
          "    colour = case [1 .. c] \\\\ taken of",
          "               [] -> 0",
          "               (k : _) -> k",
          "```",
        ),
      ],
      solution: hs`colourGraph :: (Ord a, Show a) => Int -> Graph a -> Colouring a
colourGraph _ ([], _) = []
colourGraph c g = (n, colour) : cMap
  where
    -- smallest degree first, smallest label to break ties
    n = snd (minimum [(d, v) | (v, d) <- degrees g])
    cMap = colourGraph c (removeNode n g)
    taken = [lookUp m cMap | m <- neighbours n g]
    colour = case [1 .. c] \\ taken of
               [] -> 0
               (k : _) -> k`,
      tests: [
        { expr: "colourGraph 2 fig1Middle", expected: "[(2,2),(1,0),(3,2),(4,1)]", unordered: true },
        { expr: "colourGraph 2 fig3IG", expected: `[("a",0),("b",0),("c",0),("d",2),("n",1)]`, unordered: true },
        { expr: "colourGraph 3 fig3IG", expected: `[("a",3),("b",0),("c",3),("d",2),("n",1)]`, unordered: true },
        { expr: "colourGraph 2 factIG", expected: "factColouring", unordered: true },
        { expr: "colourGraph 2 fig1Left", expected: "[(1,1),(2,2),(3,2),(4,1)]", unordered: true },
        { expr: "colourGraph 3 fig1Middle", expected: "[(1,3),(2,2),(3,2),(4,1)]", unordered: true },
        { expr: "colourGraph 1 ([7], [])", expected: "[(7,1)]" },
        { expr: "colourGraph 0 factIG", expected: `[("i",0),("n",0),("prod",0)]`, unordered: true },
        { expr: "colourGraph 3 ([] :: [Int], [])", expected: "[]" },
      ],
    },
    {
      id: "buildIdMap",
      name: "buildIdMap",
      part: "Part III",
      marks: 2,
      prompt: md(
        "Define `buildIdMap :: Colouring Id -> IdMap` that turns a colouring of an interference graph into a renaming table.",
        "",
        "- A variable `v` coloured 0 maps to itself: `(v, v)`.",
        "- A variable coloured `n > 0` maps to register `\"Rn\"`: `(v, \"R\" ++ show n)`.",
        "- The table must always contain `(\"return\", \"return\")`.",
        "",
        "```",
        "*Alloc> factColouring",
        "[(\"i\",2),(\"n\",2),(\"prod\",1)]",
        "*Alloc> buildIdMap factColouring",
        "[(\"return\",\"return\"),(\"i\",\"R2\"),(\"n\",\"R2\"),(\"prod\",\"R1\")]",
        "*Alloc> fig3Colouring",
        "[(\"a\",3),(\"b\",0),(\"c\",3),(\"d\",2),(\"n\",1)]",
        "*Alloc> buildIdMap fig3Colouring",
        "[(\"return\",\"return\"),(\"a\",\"R3\"),(\"b\",\"b\"),(\"c\",\"R3\"),(\"d\",\"R2\"),(\"n\",\"R1\")]",
        "```",
        "",
        "The order doesn't matter. `show 27` gives the string `\"27\"`.",
      ),
      hints: [
        "Transform each pair of the colouring with `map` (or a comprehension), then put the `return` entry in front.",
        "Write a small helper that takes one `(v, colour)` pair and returns one `(v, newName)` pair.",
        "Pattern match the colour: a `0` case first, then a general case.",
        md(
          "```haskell",
          "buildIdMap cs = (\"return\", \"return\") : map newName cs",
          "  where",
          "    newName (v, 0) = (v, v)",
          "    newName (v, k) = (v, \"R\" ++ show k)",
          "```",
        ),
      ],
      solution: hs`buildIdMap :: Colouring Id -> IdMap
buildIdMap cs = ("return", "return") : map newName cs
  where
    newName (v, 0) = (v, v)
    newName (v, k) = (v, "R" ++ show k)`,
      tests: [
        { expr: "buildIdMap factColouring", expected: "factIdMap", unordered: true },
        {
          expr: "buildIdMap fig3Colouring",
          expected: `[("return","return"),("a","R3"),("b","b"),("c","R3"),("d","R2"),("n","R1")]`,
          unordered: true,
        },
        { expr: "buildIdMap []", expected: `[("return","return")]` },
        { expr: `buildIdMap [("x",0)]`, expected: `[("return","return"),("x","x")]`, unordered: true },
        { expr: `buildIdMap [("v",12)]`, expected: `[("return","return"),("v","R12")]`, unordered: true },
        { expr: "buildIdMap (colourGraph 3 fig3IG)", expected: "fig3IdMap", unordered: true },
      ],
    },
    {
      id: "buildArgAssignments",
      name: "buildArgAssignments",
      part: "Part III",
      marks: 2,
      prompt: md(
        "If a function argument is mapped to a register, the function body must start by copying the argument into that register. Define `buildArgAssignments :: [Id] -> IdMap -> [Statement]` that, for each argument `a` whose table entry is `(a, r)` with `r` a register, produces `Assign r (Var a)`. Arguments that map to themselves produce nothing. Keep the assignments in the same order as the arguments.",
        "",
        "```",
        "*Alloc> idMap1",
        "[(\"a\",\"a\"),(\"b\",\"R1\"),(\"y\",\"R1\"),(\"x\",\"R6\")]",
        "*Alloc> buildArgAssignments [\"x\",\"y\"] idMap1",
        "[Assign \"R6\" (Var \"x\"),Assign \"R1\" (Var \"y\")]",
        "```",
      ),
      hints: [
        "A list comprehension over the argument list, with a filter.",
        "For each argument, look up its new name with `lookUp`.",
        "Leave out arguments whose new name is the same as the old one (the blank colour). You can name the looked-up value with `let r = lookUp a idMap` inside the comprehension.",
        "`buildArgAssignments as idMap = [Assign r (Var a) | a <- as, let r = lookUp a idMap, r /= a]`",
      ],
      solution: hs`buildArgAssignments :: [Id] -> IdMap -> [Statement]
buildArgAssignments as idMap
  = [Assign r (Var a) | a <- as, let r = lookUp a idMap, r /= a]`,
      tests: [
        { expr: `buildArgAssignments ["x","y"] idMap1`, expected: `[Assign "R6" (Var "x"),Assign "R1" (Var "y")]` },
        { expr: `buildArgAssignments ["y","x"] idMap1`, expected: `[Assign "R1" (Var "y"),Assign "R6" (Var "x")]` },
        { expr: `buildArgAssignments ["n"] factIdMap`, expected: `[Assign "R2" (Var "n")]` },
        { expr: `buildArgAssignments ["a","n"] fig3IdMap`, expected: `[Assign "R3" (Var "a"),Assign "R1" (Var "n")]` },
        { expr: `buildArgAssignments ["a"] idMap1`, expected: "[]" },
        { expr: `buildArgAssignments ["b"] fig3IdMap`, expected: "[]" },
        { expr: "buildArgAssignments [] idMap1", expected: "[]" },
      ],
    },
    {
      id: "renameExp",
      name: "renameExp",
      part: "Part III",
      marks: 2,
      prompt: md(
        "Define `renameExp :: Exp -> IdMap -> Exp` that renames every variable in an expression using the table. You may assume every variable in the expression is in the table.",
        "",
        "```",
        "*Alloc> e1",
        "Apply Add (Var \"a\") (Var \"b\")",
        "*Alloc> renameExp e1 idMap1",
        "Apply Add (Var \"a\") (Var \"R1\")",
        "*Alloc> e2",
        "Apply Mul (Apply Add (Var \"x\") (Const 2)) (Var \"y\")",
        "*Alloc> renameExp e2 idMap1",
        "Apply Mul (Apply Add (Var \"R6\") (Const 2)) (Var \"R1\")",
        "```",
      ),
      hints: [
        "Write one equation per constructor of `Exp`: `Const`, `Var` and `Apply`.",
        "A constant has no variables, so it stays the same. A variable is replaced by its looked-up name.",
        "For `Apply op e1 e2`, keep the operator and rename both sub-expressions recursively.",
        md(
          "```haskell",
          "renameExp (Const n) _ = Const n",
          "renameExp (Var v) idMap = Var (lookUp v idMap)",
          "renameExp (Apply op e1 e2) idMap = Apply op (renameExp e1 idMap) (renameExp e2 idMap)",
          "```",
        ),
      ],
      solution: hs`renameExp :: Exp -> IdMap -> Exp
renameExp (Const n) _ = Const n
renameExp (Var v) idMap = Var (lookUp v idMap)
renameExp (Apply op e1 e2) idMap = Apply op (renameExp e1 idMap) (renameExp e2 idMap)`,
      tests: [
        { expr: "renameExp e1 idMap1", expected: `Apply Add (Var "a") (Var "R1")` },
        { expr: "renameExp e2 idMap1", expected: `Apply Mul (Apply Add (Var "R6") (Const 2)) (Var "R1")` },
        { expr: "renameExp (Const 7) idMap1", expected: "Const 7" },
        { expr: `renameExp (Var "a") fig3IdMap`, expected: `Var "R3"` },
        { expr: `renameExp (Var "b") fig3IdMap`, expected: `Var "b"` },
        {
          expr: `renameExp (Apply Eq (Apply GEq (Var "i") (Var "n")) (Var "prod")) factIdMap`,
          expected: `Apply Eq (Apply GEq (Var "R2") (Var "R2")) (Var "R1")`,
        },
      ],
    },
    {
      id: "renameBlock",
      name: "renameBlock",
      part: "Part III",
      marks: 4,
      prompt: md(
        "Using `renameExp`, define `renameBlock :: Block -> IdMap -> Block` that renames every variable in a block, including the targets of assignments and everything inside `If` and `While` statements. After renaming, remove every assignment of the form `v = v` (an `Assign v (Var v)`), at every nesting level. You may assume every variable in the block is in the table.",
        "",
        "```",
        "*Alloc> showBlock factB",
        "0: if (n == 0) {",
        "  1: return = 1;",
        "} else {",
        "  2: prod = 1;",
        "  3: i = n;",
        "  4: while (i >= 1) {",
        "    5: prod = prod * i;",
        "    6: i = i + -1;",
        "  }",
        "  7: return = prod;",
        "}",
        "*Alloc> showBlock (renameBlock factB factIdMap)",
        "0: if (R2 == 0) {",
        "  1: return = 1;",
        "} else {",
        "  2: R1 = 1;",
        "  3: while (R2 >= 1) {",
        "    4: R1 = R1 * R2;",
        "    5: R2 = R2 + -1;",
        "  }",
        "  6: return = R1;",
        "}",
        "```",
        "",
        "`i = n` became `R2 = R2` and was removed. The template's `renameFun` uses your two functions to rename a whole function:",
        "",
        "```",
        "renameFun :: Function -> IdMap -> Function",
        "renameFun (f, as, b) idMap",
        "  = (f, as, buildArgAssignments as idMap ++ renameBlock b idMap)",
        "",
        "*Alloc> renameFun fact factIdMap == factTransformed",
        "True",
        "*Alloc> renameFun fig3 fig3IdMap == fig3Transformed",
        "True",
        "```",
      ),
      hints: [
        "Rename each statement (with `map` and a helper), then `filter` out the useless assignments.",
        "The helper has one equation per `Statement` constructor. `If` and `While` contain blocks, so call `renameBlock` on those blocks: that's what makes the deletion happen at every level.",
        "Do the `v = v` check after renaming: `i = n` only becomes `R2 = R2` once both sides are renamed. The check is a pattern match on `Assign v (Var w)` with `v == w`; every other statement is kept.",
        md(
          "```haskell",
          "renameBlock b idMap = filter (not . isSelfAssign) (map renameStatement b)",
          "  where",
          "    renameStatement (Assign v e) = Assign (lookUp v idMap) (renameExp e idMap)",
          "    renameStatement (If p b1 b2) = If (renameExp p idMap) (renameBlock b1 idMap) (renameBlock b2 idMap)",
          "    renameStatement (While p body) = While (renameExp p idMap) (renameBlock body idMap)",
          "",
          "    isSelfAssign (Assign v (Var w)) = v == w",
          "    isSelfAssign _ = False",
          "```",
        ),
      ],
      solution: hs`renameBlock :: Block -> IdMap -> Block
renameBlock b idMap = filter (not . isSelfAssign) (map renameStatement b)
  where
    renameStatement (Assign v e) = Assign (lookUp v idMap) (renameExp e idMap)
    renameStatement (If p b1 b2) = If (renameExp p idMap) (renameBlock b1 idMap) (renameBlock b2 idMap)
    renameStatement (While p body) = While (renameExp p idMap) (renameBlock body idMap)

    -- assignments v = v do nothing, so they are dropped
    isSelfAssign (Assign v (Var w)) = v == w
    isSelfAssign _ = False`,
      tests: [
        {
          expr: "renameBlock factB factIdMap",
          expected: "tail (let (_, _, b) = factTransformed in b)",
          label: "renameBlock factB factIdMap is the body of factTransformed (without the R2 = n line)",
        },
        { expr: "renameFun fact factIdMap", expected: "factTransformed" },
        { expr: "renameFun fig3 fig3IdMap", expected: "fig3Transformed" },
        { expr: "renameBlock [] idMap1", expected: "[]" },
        { expr: `renameBlock [Assign "b" (Var "y")] idMap1`, expected: "[]" },
        {
          expr: `renameBlock [While (Var "x") [Assign "y" (Var "b"), Assign "a" (Const 1)]] idMap1`,
          expected: `[While (Var "R6") [Assign "a" (Const 1)]]`,
        },
        {
          expr: `renameBlock [If (Var "a") [] [Assign "b" (Var "b")]] idMap1`,
          expected: `[If (Var "a") [] []]`,
        },
        {
          expr: `renameBlock factB [(v, v) | v <- ["return", "i", "n", "prod"]]`,
          expected: "factB",
          label: "an identity table changes nothing",
        },
      ],
    },
    {
      id: "buildIG",
      name: "buildIG",
      part: "Part IV",
      marks: 2,
      prompt: md(
        "Define `buildIG :: [[Id]] -> IG` that builds the interference graph from a function's live variable sets. There's one set per numbered line of the function, listing the variables live at that line. For example:",
        "",
        "```",
        "*Alloc> factLiveVars",
        "[[\"n\"],[],[\"n\"],[\"n\",\"prod\"],[\"i\",\"prod\"],[\"i\",\"prod\"],[\"i\",\"prod\"],[\"prod\"]]",
        "```",
        "",
        "The nodes are all the variables that appear in any set. There is an edge between `v` and `w` if at least one set contains both. Each edge must appear only once (not as both `(v,w)` and `(w,v)`), and there are no edges from a node to itself.",
        "",
        "```",
        "*Alloc> buildIG factLiveVars",
        "([\"n\",\"prod\",\"i\"],[(\"n\",\"prod\"),(\"prod\",\"i\")])",
        "*Alloc> sortGraph (buildIG factLiveVars) == factIG",
        "True",
        "```",
        "",
        "The order of nodes and edges doesn't matter (tests use `sortGraph`).",
      ),
      hints: [
        "Two list comprehensions: one for the nodes, one for the edges. `nub` from `Data.List` removes duplicates.",
        "Nodes: `concat` all the sets together and remove duplicates.",
        "Edges: for each set, pair up every two different variables in it. Requiring `v < w` means each pair is made in only one direction and never `(v, v)`.",
        "`buildIG liveSets = (nub (concat liveSets), nub [(v, w) | vs <- liveSets, v <- vs, w <- vs, v < w])`",
      ],
      solution: hs`buildIG :: [[Id]] -> IG
buildIG liveSets
  = (nub (concat liveSets), nub [(v, w) | vs <- liveSets, v <- vs, w <- vs, v < w])`,
      tests: [
        { expr: "sortGraph (buildIG factLiveVars)", expected: "factIG" },
        { expr: "sortGraph (buildIG fig3LiveVars)", expected: "fig3IG" },
        { expr: "buildIG []", expected: "([],[])" },
        { expr: `buildIG [["a"]]`, expected: `(["a"],[])` },
        {
          expr: `sortGraph (buildIG [["a","b","c"]])`,
          expected: `(["a","b","c"],[("a","b"),("a","c"),("b","c")])`,
        },
        { expr: `length (snd (buildIG [["x","y"],["y","x"]]))`, expected: "1", label: "an edge is not repeated" },
        { expr: `length (fst (buildIG [["x","y"],["y"],["x"]]))`, expected: "2", label: "a node is not repeated" },
        { expr: "colourGraph 2 (sortGraph (buildIG factLiveVars))", expected: "factColouring", unordered: true, label: "the whole pipeline: live sets to colouring" },
      ],
    },
    {
      id: "liveVars",
      name: "liveVars",
      part: "Part V",
      marks: 0,
      prompt: md(
        "Prize question, 0 marks. A control flow graph (`CFG`, type `[((Id, [Id]), [Int])]`) has one entry per numbered line of a function:",
        "",
        "- a `(def, use)` pair: `def` is the variable assigned on that line (or the dummy `\"_\"` for an `if`/`while` test) and `use` lists the variables read on that line;",
        "- `succ`: the line numbers that could run next (`[]` if the function ends there).",
        "",
        "```",
        "*Alloc> factCFG",
        "[((\"_\",[\"n\"]), [1,2]),",
        " ((\"return\",[]), []),",
        " ((\"prod\",[]), [3]),",
        " ((\"i\",[\"n\"]), [4]),",
        " ((\"_\",[\"i\"]), [5,7]),",
        " ((\"prod\",[\"i\",\"prod\"]),[6]),",
        " ((\"i\",[\"i\"]), [4]),",
        " ((\"return\",[\"prod\"]), [])]",
        "```",
        "",
        "The live set at line n is",
        "",
        "```",
        "live(n) = use(n) ∪ ( (union of live(s) for every s in succ(n)) minus def(n) )",
        "```",
        "",
        "Start with every live set empty and recompute all of them, again and again, until a pass changes nothing. Define `liveVars :: CFG -> [[Id]]`. The order inside each set doesn't matter: `map sort (liveVars factCFG) == factLiveVars` should be `True`.",
      ),
      hints: [
        "This is a fixed-point iteration: a helper takes the current list of live sets and either returns it (if one more pass leaves it unchanged) or recurses on the new list.",
        "Start from `map (const []) cfg`, one empty set per line. One pass is a list comprehension over the CFG entries.",
        "Sort each new set so that \"unchanged\" can be checked with `==`. Use `union` to combine successor sets and `\\\\ [def]` to remove the defined variable.",
        md(
          "```haskell",
          "liveVars cfg = iterateLive (map (const []) cfg)",
          "  where",
          "    iterateLive live",
          "      | next == live = live",
          "      | otherwise = iterateLive next",
          "      where",
          "        next = [sort (union use (liveOut succs \\\\ [def])) | ((def, use), succs) <- cfg]",
          "        liveOut succs = foldr union [] [live !! s | s <- succs]",
          "```",
        ),
      ],
      solution: hs`liveVars :: CFG -> [[Id]]
liveVars cfg = iterateLive (map (const []) cfg)
  where
    -- repeat passes until nothing changes
    iterateLive live
      | next == live = live
      | otherwise = iterateLive next
      where
        next = [sort (union use (liveOut succs \\ [def])) | ((def, use), succs) <- cfg]
        liveOut succs = foldr union [] [live !! s | s <- succs]`,
      tests: [
        { expr: "map sort (liveVars factCFG)", expected: "factLiveVars" },
        { expr: "map sort (liveVars fig3CFG)", expected: "fig3LiveVars" },
        { expr: "liveVars []", expected: "[]" },
        { expr: `map sort (liveVars [(("x",[]),[1]), (("return",["x"]),[])])`, expected: `[[],["x"]]` },
        {
          expr: `map sort (liveVars [(("_",["a"]),[1,2]), (("return",["b"]),[]), (("return",["c"]),[])])`,
          expected: `[["a","b","c"],["b"],["c"]]`,
        },
        { expr: "sortGraph (buildIG (liveVars fig3CFG))", expected: "fig3IG" },
      ],
    },
    {
      id: "buildCFG",
      name: "buildCFG",
      part: "Part V",
      marks: 0,
      prompt: md(
        "Prize question, 0 marks. Define `buildCFG :: Function -> CFG` that builds the control flow graph described in the previous task. Lines are numbered 0, 1, 2, ... in the same order `showFun` numbers them: each assignment is one line, and each `if` or `while` test is one line, followed by the lines inside it.",
        "",
        "- An assignment `v = e` has `def = v` and `use` = the variables in `e`. Its successor is whatever runs next.",
        "- An `if` test has `def = \"_\"`. Its successors are the first line of each branch (an empty branch goes straight to whatever follows the `if`).",
        "- A `while` test has `def = \"_\"`. Its successors are the first line of the body, and whatever follows the loop. The last line of the body goes back to the `while` test.",
        "- The last line of the function has no successors: `[]`.",
        "",
        "The order inside the `use` and `succ` lists doesn't matter: `sortCFG (buildCFG fact) == factCFG` should be `True`.",
      ),
      hints: [
        "Write a helper that builds the entries for a block given two extra facts: the number of the block's first line, and `next`, the successor list for whatever comes after the block (`[]` at the end of the function).",
        "You need to know how many numbered lines a block contains, so you can work out where the next statement starts. Write `countPoints :: Block -> Int`.",
        "Inside a block, each statement's \"what comes next\" is the first line of the following statement, except the last statement, which uses the block's `next`. A `while` body's `next` is `[n]`, the loop's own test line.",
        md(
          "```haskell",
          "buildCFG (_, _, body) = cfgBlock body 0 []",
          "",
          "cfgBlock [] _ _ = []",
          "cfgBlock (s : ss) n next = cfgStatement s n after ++ cfgBlock ss n' next",
          "  where",
          "    n' = n + countPoints [s]",
          "    after = if null ss then next else [n']",
          "",
          "cfgStatement (Assign v e) _ next = [((v, expVars e), next)]",
          "cfgStatement (If p b1 b2) n next = ((\"_\", expVars p), ...) : cfgBlock b1 (n+1) next ++ cfgBlock b2 ... next",
          "cfgStatement (While p b) n next = ((\"_\", expVars p), ... ++ next) : cfgBlock b (n + 1) [n]",
          "```",
        ),
      ],
      solution: hs`buildCFG :: Function -> CFG
buildCFG (_, _, body) = cfgBlock body 0 []

-- cfgBlock b n next: the CFG entries for block b, whose first line is
-- numbered n; next is where control goes after the block ([] = the end).
cfgBlock :: Block -> Int -> [Int] -> CFG
cfgBlock [] _ _ = []
cfgBlock (s : ss) n next = cfgStatement s n after ++ cfgBlock ss n' next
  where
    n' = n + countPoints [s]
    after = if null ss then next else [n']

cfgStatement :: Statement -> Int -> [Int] -> CFG
cfgStatement (Assign v e) _ next = [((v, expVars e), next)]
cfgStatement (If p b1 b2) n next
  = (("_", expVars p), nub (entry b1 n1 ++ entry b2 n2))
      : cfgBlock b1 n1 next ++ cfgBlock b2 n2 next
  where
    n1 = n + 1
    n2 = n1 + countPoints b1
    entry [] _ = next
    entry _ k = [k]
cfgStatement (While p b) n next
  = (("_", expVars p), bodyEntry ++ next) : cfgBlock b (n + 1) [n]
  where
    bodyEntry = if null b then [n] else [n + 1]

countPoints :: Block -> Int
countPoints b = sum (map points b)
  where
    points (Assign _ _) = 1
    points (If _ b1 b2) = 1 + countPoints b1 + countPoints b2
    points (While _ body) = 1 + countPoints body

expVars :: Exp -> [Id]
expVars (Const _) = []
expVars (Var v) = [v]
expVars (Apply _ e1 e2) = union (expVars e1) (expVars e2)`,
      tests: [
        { expr: "sortCFG (buildCFG fact)", expected: "factCFG" },
        { expr: "sortCFG (buildCFG fig3)", expected: "fig3CFG" },
        { expr: `buildCFG ("f", [], [])`, expected: "[]" },
        {
          expr: `sortCFG (buildCFG ("f", ["x"], [Assign "y" (Apply Add (Var "x") (Var "x")), Assign "return" (Var "y")]))`,
          expected: `[(("y",["x"]),[1]),(("return",["y"]),[])]`,
        },
        {
          expr: `sortCFG (buildCFG ("f", ["x"], [If (Var "x") [] [Assign "x" (Const 1)], Assign "return" (Var "x")]))`,
          expected: `[(("_",["x"]),[1,2]),(("x",[]),[2]),(("return",["x"]),[])]`,
        },
        {
          expr: "map sort (liveVars (buildCFG fact))",
          expected: "factLiveVars",
          label: "the full pipeline from a function to its live sets",
        },
        { expr: "sortGraph (buildIG (liveVars (buildCFG fig3)))", expected: "fig3IG" },
      ],
    },
  ],
};
