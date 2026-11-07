import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "m10",
  year: 0,
  difficulty: 10,
  minutes: 90,
  title: "Mini paper 10: Spreadsheet formulas",
  summary:
    "Spreadsheet cells hold formulas that refer to other cells. Look up and change cells, evaluate formulas by following references, list a formula's references, detect circular references with a visited list, and recalculate a sheet in dependency order.",
  skills: [
    "lookup tables with a default value",
    "replacing an entry in an association list",
    "evaluating a tree that refers to a table",
    "nub and order of first appearance",
    "graph search with a path (visited) list",
    "depth-first ordering with an accumulator",
    "folding a table of results",
  ],
  story: md(
    "**The domain.** A spreadsheet is a grid of **cells**, named by a column letter and a row number: `A1`, `B2`, `C9`, ... Each cell holds a **formula**. A formula can be a plain number, or it can **refer to other cells**: if `A3` holds `A1 + A2`, then the value of `A3` is whatever `A1` and `A2` are worth. Change `A1`, and `A3` changes with it. A cell nobody has typed anything into is **empty** and counts as 0.",
    "",
    "Here is the example sheet `budget`:",
    "",
    "```",
    "cell   formula                value",
    "A1     10                     10",
    "A2     20                     20",
    "A3     A1 + A2                30",
    "B1     A3 * 2                 60",
    "B2     SUM(A1, A2, A3, C9)    60     (C9 is empty, so 0)",
    "C1     B1 + B2 * A1           660",
    "```",
    "",
    "**References form a graph.** Draw an arrow from each cell to the cells its formula refers to: `C1` points to `B1`, `B2` and `A1`; `B1` points to `A3`; and so on. To evaluate a cell you follow its arrows (recursively) down to plain numbers.",
    "",
    "**Circular references.** If `A2` holds `A1 + A3` and `A3` holds `A2 * 2`, then working out `A2` needs `A3`, which needs `A2` again: the arrows go round in a circle and evaluation would never finish. Real spreadsheets detect this and show an error. To detect it you walk along the arrows while remembering the cells on your current route; arriving at a cell that is already on the route means you have gone round a circle.",
    "",
    "**Recalculating.** Following references recursively recomputes the same cells many times (`A1` above is needed by four other cells). A real spreadsheet instead puts the cells in an **evaluation order** where every cell comes after the cells it refers to, then computes each cell exactly once, in that order, looking up the values already computed.",
    "",
    "### The given types",
    "",
    "```haskell",
    "type CellRef = String",
    "",
    "data Formula = Lit Int",
    "             | Ref CellRef",
    "             | Add Formula Formula",
    "             | Mul Formula Formula",
    "             | Sum [CellRef]",
    "",
    "type Sheet = [(CellRef, Formula)]",
    "",
    "type Values = [(CellRef, Int)]",
    "```",
    "",
    "- A `CellRef` is a cell name such as `\"A1\"`.",
    "- `Lit 10` is the number 10, `Ref \"A1\"` is the value of cell `A1`, `Add f1 f2` is `f1 + f2`, `Mul f1 f2` is `f1 * f2`, and `Sum [\"A1\", \"A2\"]` is `SUM(A1, A2)`, the total of the listed cells.",
    "- A `Sheet` lists the non-empty cells with their formulas. Each cell appears at most once. Cells not in the list are empty.",
    "- A `Values` table gives each cell's computed number.",
    "",
    "So `C1`'s formula `B1 + B2 * A1` is `Add (Ref \"B1\") (Mul (Ref \"B2\") (Ref \"A1\"))`.",
    "",
    "Given to you: the sheets `budget` (above), `shuffled` (a small sheet whose cells are listed out of order) and `loopy` (which contains circular references):",
    "",
    "```",
    "shuffled:  C1 = B1 + A2      loopy:  A1 = 1",
    "           B1 = A1 * A1              A2 = A1 + A3",
    "           A2 = SUM(A1, B2)          A3 = A2 * 2",
    "           A1 = 3                    B1 = B1",
    "           B2 = A1                   C1 = A1",
    "                                     C2 = A3",
    "```",
  ),
  notes: md(
    "**Where the marks are.** Part I (the table) is 4 marks, Part II (formulas and references) is 8 and Part III (recalculation) is 8.",
    "",
    "**Order of attack.** `formulaAt` is used by nearly everything, so write it first. `evalFormula` is a standard tree evaluator whose `Ref` case calls itself on another cell's formula. `refs` feeds both `cyclic` and `evalOrder`. Part III is the hardest: `evalOrder` needs care with its accumulator, and `recalc` needs `evalOrder` and `cyclic`.",
    "",
    "**Traps.**",
    "",
    "- An empty cell is `Lit 0`, not an error: `formulaAt` never fails.",
    "- `refs` lists each cell once, in the order the cells *first* appear when reading the formula from left to right. `evalOrder` depends on that order.",
    "- `cyclic` must give `True` for a cell that merely *leads into* a circle (like `C2` in `loopy`), and must give `False` when two routes meet without forming a circle (`A` refers to `B` and `C`, both of which refer to `D`).",
    "- In `evalOrder`, only cells that are in the sheet are listed, each exactly once.",
    "",
    "**Self-check.** For a sheet without circles, every value in `recalc` must agree with `evalFormula`: `recalc` is just a faster way to get the same numbers.",
  ),
  setup: hs`import Data.List
import Data.Maybe

type CellRef = String

data Formula = Lit Int
             | Ref CellRef
             | Add Formula Formula
             | Mul Formula Formula
             | Sum [CellRef]
             deriving (Eq, Ord, Show)

type Sheet = [(CellRef, Formula)]

type Values = [(CellRef, Int)]

--------------------------------------------------------------
-- Example data

budget :: Sheet
budget
  = [ ("A1", Lit 10)
    , ("A2", Lit 20)
    , ("A3", Add (Ref "A1") (Ref "A2"))
    , ("B1", Mul (Ref "A3") (Lit 2))
    , ("B2", Sum ["A1", "A2", "A3", "C9"])
    , ("C1", Add (Ref "B1") (Mul (Ref "B2") (Ref "A1")))
    ]

shuffled :: Sheet
shuffled
  = [ ("C1", Add (Ref "B1") (Ref "A2"))
    , ("B1", Mul (Ref "A1") (Ref "A1"))
    , ("A2", Sum ["A1", "B2"])
    , ("A1", Lit 3)
    , ("B2", Ref "A1")
    ]

loopy :: Sheet
loopy
  = [ ("A1", Lit 1)
    , ("A2", Add (Ref "A1") (Ref "A3"))
    , ("A3", Mul (Ref "A2") (Lit 2))
    , ("B1", Ref "B1")
    , ("C1", Ref "A1")
    , ("C2", Ref "A3")
    ]
`,
  starter: hs`--------------------------------------------------------------
-- Part I

formulaAt :: Sheet -> CellRef -> Formula
formulaAt = undefined

setCell :: CellRef -> Formula -> Sheet -> Sheet
setCell = undefined

--------------------------------------------------------------
-- Part II

evalFormula :: Sheet -> Formula -> Int
evalFormula = undefined

refs :: Formula -> [CellRef]
refs = undefined

cyclic :: Sheet -> CellRef -> Bool
cyclic = undefined

--------------------------------------------------------------
-- Part III

evalOrder :: Sheet -> [CellRef]
evalOrder = undefined

recalc :: Sheet -> Maybe Values
recalc = undefined
`,
  tasks: [
    {
      id: "formulaAt",
      name: "formulaAt",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `formulaAt :: Sheet -> CellRef -> Formula` that returns the formula in a cell. An empty cell (one not listed in the sheet) holds `Lit 0`. For example:",
        "",
        "```",
        "ghci> formulaAt budget \"A3\"",
        "Add (Ref \"A1\") (Ref \"A2\")",
        "ghci> formulaAt budget \"C9\"",
        "Lit 0",
        "```",
      ),
      hints: [
        "This is a lookup with a default value for missing keys.",
        "`lookup c sheet` gives a `Maybe Formula`: `Just f` if the cell is there, `Nothing` if it is empty.",
        "`fromMaybe d m` (from `Data.Maybe`, already imported) turns `Nothing` into the default `d` and `Just x` into `x`.",
        "`formulaAt sheet c = fromMaybe (Lit 0) (lookup c sheet)`.",
      ],
      solution: hs`formulaAt :: Sheet -> CellRef -> Formula
formulaAt sheet c = fromMaybe (Lit 0) (lookup c sheet)`,
      tests: [
        { expr: 'formulaAt budget "A3"', expected: 'Add (Ref "A1") (Ref "A2")' },
        { expr: 'formulaAt budget "C9"', expected: "Lit 0" },
        { expr: 'formulaAt budget "A1"', expected: "Lit 10" },
        { expr: 'formulaAt [] "A1"', expected: "Lit 0" },
        { expr: 'formulaAt loopy "B1"', expected: 'Ref "B1"' },
        { expr: 'formulaAt shuffled "A2"', expected: 'Sum ["A1","B2"]' },
      ],
    },
    {
      id: "setCell",
      name: "setCell",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `setCell :: CellRef -> Formula -> Sheet -> Sheet` that puts a formula in a cell. If the cell already has a formula, it is replaced; otherwise the cell is added. Every cell must still appear at most once. For example:",
        "",
        "```",
        "ghci> setCell \"A2\" (Lit 5) [(\"A1\", Lit 1), (\"A2\", Lit 2)]",
        "[(\"A1\",Lit 1),(\"A2\",Lit 5)]",
        "ghci> setCell \"B1\" (Ref \"A1\") [(\"A1\", Lit 1)]",
        "[(\"A1\",Lit 1),(\"B1\",Ref \"A1\")]",
        "```",
        "",
        "The order of the cells in the resulting sheet does not matter.",
      ),
      hints: [
        "One way: remove any existing entry for the cell, then add the new one.",
        "`filter` with a test on `fst` removes the old entry: keep the pairs whose cell name is not `c`.",
        "Add the new pair at the front or the back; both are fine because order doesn't matter (keeping the original position is a nice touch, though).",
        "`setCell c f sheet = filter ((/= c) . fst) sheet ++ [(c, f)]`.",
      ],
      solution: hs`setCell :: CellRef -> Formula -> Sheet -> Sheet
setCell c f sheet
  | isJust (lookup c sheet) = [if c' == c then (c, f) else (c', f') | (c', f') <- sheet]
  | otherwise               = sheet ++ [(c, f)]`,
      tests: [
        { expr: 'setCell "A2" (Lit 5) [("A1", Lit 1), ("A2", Lit 2)]', expected: '[("A1",Lit 1),("A2",Lit 5)]', unordered: true },
        { expr: 'setCell "B1" (Ref "A1") [("A1", Lit 1)]', expected: '[("A1",Lit 1),("B1",Ref "A1")]', unordered: true },
        { expr: 'setCell "A1" (Lit 7) []', expected: '[("A1",Lit 7)]' },
        { expr: 'length (setCell "C1" (Lit 0) budget)', expected: "6", label: "replacing doesn't add a second C1" },
        { expr: 'formulaAt (setCell "C1" (Lit 0) budget) "C1"', expected: "Lit 0" },
        { expr: 'formulaAt (setCell "D4" (Sum ["A1"]) budget) "D4"', expected: 'Sum ["A1"]' },
        { expr: 'setCell "A1" (Lit 2) (setCell "A1" (Lit 1) [])', expected: '[("A1",Lit 2)]' },
      ],
    },
    {
      id: "evalFormula",
      name: "evalFormula",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define a function `evalFormula :: Sheet -> Formula -> Int` that computes the value of a formula. A reference to a cell is worth the value of that cell's formula (worked out in the same way, so references are followed as deeply as necessary), and an empty cell is worth 0. `Sum cs` is the total of the values of the cells `cs`. You may assume there are no circular references. For example:",
        "",
        "```",
        "ghci> evalFormula budget (Ref \"C1\")",
        "660",
        "ghci> evalFormula budget (formulaAt budget \"B2\")",
        "60",
        "ghci> evalFormula budget (Add (Ref \"A1\") (Lit 1))",
        "11",
        "ghci> evalFormula budget (Ref \"Z9\")",
        "0",
        "```",
      ),
      hints: [
        "One equation per constructor of `Formula`, like any tree evaluator.",
        "`Lit n` is `n`. `Add` and `Mul` evaluate both sides recursively and add or multiply.",
        "For `Ref c`, evaluate the formula stored in `c`: `evalFormula sheet (formulaAt sheet c)`. An empty cell gives `Lit 0`, so it is worth 0 automatically.",
        md(
          "```",
          "evalFormula sheet (Ref c) = evalFormula sheet (formulaAt sheet c)",
          "evalFormula sheet (Sum cs) = sum [evalFormula sheet (Ref c) | c <- cs]",
          "```",
        ),
      ],
      solution: hs`evalFormula :: Sheet -> Formula -> Int
evalFormula _ (Lit n) = n
evalFormula sheet (Ref c) = evalFormula sheet (formulaAt sheet c)
evalFormula sheet (Add f1 f2) = evalFormula sheet f1 + evalFormula sheet f2
evalFormula sheet (Mul f1 f2) = evalFormula sheet f1 * evalFormula sheet f2
evalFormula sheet (Sum cs) = sum [evalFormula sheet (Ref c) | c <- cs]`,
      tests: [
        { expr: 'evalFormula budget (Ref "C1")', expected: "660" },
        { expr: 'evalFormula budget (formulaAt budget "B2")', expected: "60" },
        { expr: 'evalFormula budget (Add (Ref "A1") (Lit 1))', expected: "11" },
        { expr: 'evalFormula budget (Ref "Z9")', expected: "0" },
        { expr: "evalFormula [] (Mul (Lit 6) (Lit 7))", expected: "42" },
        { expr: 'map (evalFormula shuffled . Ref) ["A1", "B1", "B2", "A2", "C1"]', expected: "[3, 9, 3, 6, 15]" },
        { expr: "evalFormula budget (Sum [])", expected: "0" },
        { expr: 'evalFormula (setCell "A1" (Lit 1) budget) (Ref "C1")', expected: "84", label: "changing A1 changes C1" },
      ],
    },
    {
      id: "refs",
      name: "refs",
      part: "Part II",
      marks: 2,
      prompt: md(
        "Define a function `refs :: Formula -> [CellRef]` that lists the cells a formula refers to directly (both through `Ref` and through `Sum`). Each cell appears once, and the cells are listed in the order in which they **first** appear when reading the formula from left to right. For example:",
        "",
        "```",
        "ghci> refs (formulaAt budget \"C1\")",
        "[\"B1\",\"B2\",\"A1\"]",
        "ghci> refs (Mul (Ref \"A1\") (Ref \"A1\"))",
        "[\"A1\"]",
        "ghci> refs (Lit 4)",
        "[]",
        "```",
      ),
      hints: [
        "Collect all the references (possibly with repeats) by recursion, then remove the repeats.",
        "A local helper with one equation per constructor: `Lit` gives `[]`, `Ref c` gives `[c]`, `Sum cs` gives `cs`, and `Add`/`Mul` join their children's lists with `++` (left child first).",
        "`nub` removes repeats and keeps the *first* occurrence of each, which is exactly the order required.",
        md(
          "```",
          "refs f = nub (allRefs f)",
          "  where",
          "    allRefs (Lit _) = []",
          "    allRefs (Ref c) = [c]",
          "    allRefs (Add f1 f2) = allRefs f1 ++ allRefs f2",
          "    allRefs (Mul f1 f2) = allRefs f1 ++ allRefs f2",
          "    allRefs (Sum cs) = cs",
          "```",
        ),
      ],
      solution: hs`refs :: Formula -> [CellRef]
refs f = nub (allRefs f)
  where
    allRefs (Lit _) = []
    allRefs (Ref c) = [c]
    allRefs (Add f1 f2) = allRefs f1 ++ allRefs f2
    allRefs (Mul f1 f2) = allRefs f1 ++ allRefs f2
    allRefs (Sum cs) = cs`,
      tests: [
        { expr: 'refs (formulaAt budget "C1")', expected: '["B1","B2","A1"]' },
        { expr: 'refs (Mul (Ref "A1") (Ref "A1"))', expected: '["A1"]' },
        { expr: "refs (Lit 4)", expected: "[]" },
        { expr: 'refs (formulaAt budget "B2")', expected: '["A1","A2","A3","C9"]' },
        { expr: 'refs (Sum ["B2", "A1", "B2"])', expected: '["B2","A1"]' },
        { expr: 'refs (Add (Mul (Lit 2) (Ref "C3")) (Add (Sum ["A1", "C3"]) (Ref "B7")))', expected: '["C3","A1","B7"]' },
        { expr: 'refs (Ref "Z1")', expected: '["Z1"]' },
      ],
    },
    {
      id: "cyclic",
      name: "cyclic",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define a function `cyclic :: Sheet -> CellRef -> Bool` that is `True` if evaluating the given cell would never finish because of a circular reference. That is, starting at the cell and repeatedly following references (use `refs`), some route arrives at a cell that is **already on that route**. Empty cells refer to nothing. For example:",
        "",
        "```",
        "ghci> cyclic loopy \"A2\"",
        "True",
        "ghci> cyclic loopy \"B1\"",
        "True",
        "ghci> cyclic loopy \"C2\"",
        "True",
        "ghci> cyclic loopy \"C1\"",
        "False",
        "ghci> cyclic budget \"C1\"",
        "False",
        "```",
        "",
        "`B1` refers to itself. `C2` is not part of a circle itself, but it refers to `A3`, which is (`A3` to `A2` to `A3`). In `budget`, `C1` reaches `A1` along several different routes, but no route visits a cell twice, so there is no circle.",
      ),
      hints: [
        "Write a helper `go :: [CellRef] -> CellRef -> Bool` whose first argument is the route so far (the cells visited on the way here), starting from `[]`.",
        "In `go route c`: if `c` is already in `route`, you have gone round a circle, so answer `True`. Otherwise, continue from each cell that `c` refers to, with `c` added to the route.",
        "\"Some route arrives at a repeat\" means `any`: `any (go (c : route)) (refs (formulaAt sheet c))`. A cell with no references gives `any` an empty list, which is `False`.",
        md(
          "```",
          "cyclic sheet c = go [] c",
          "  where",
          "    go route x",
          "      | elem x route = True",
          "      | otherwise    = any (go (x : route)) (refs (formulaAt sheet x))",
          "```",
          "",
          "The route is *not* a list of every cell seen so far: a cell reached again along a different route (as in `budget`) is fine.",
        ),
      ],
      solution: hs`cyclic :: Sheet -> CellRef -> Bool
cyclic sheet c = go [] c
  where
    -- route: the cells on the way from the starting cell to x
    go route x
      | elem x route = True
      | otherwise    = any (go (x : route)) (refs (formulaAt sheet x))`,
      tests: [
        { expr: 'cyclic loopy "A2"', expected: "True" },
        { expr: 'cyclic loopy "B1"', expected: "True" },
        { expr: 'cyclic loopy "C2"', expected: "True" },
        { expr: 'cyclic loopy "C1"', expected: "False" },
        { expr: 'cyclic budget "C1"', expected: "False" },
        { expr: 'map (cyclic loopy) ["A1", "A3", "Z9"]', expected: "[False, True, False]" },
        {
          expr: 'cyclic [("A", Add (Ref "B") (Ref "C")), ("B", Ref "D"), ("C", Ref "D"), ("D", Lit 1)] "A"',
          expected: "False",
          label: "two routes meeting at D is not a circle",
        },
        { expr: 'cyclic (setCell "A1" (Ref "C1") budget) "B2"', expected: "True" },
        { expr: 'any (cyclic shuffled) (map fst shuffled)', expected: "False" },
      ],
    },
    {
      id: "evalOrder",
      name: "evalOrder",
      part: "Part III",
      marks: 4,
      prompt: md(
        "Define a function `evalOrder :: Sheet -> [CellRef]` that lists every cell of the sheet (each exactly once) in an order where each cell comes **after** all the sheet's cells it refers to. You may assume the sheet has no circular references. To make the answer unique, use exactly this method:",
        "",
        "- Keep a list of cells already placed, starting empty.",
        "- Go through the sheet's cells in the order they are listed, and **visit** each one.",
        "- To visit a cell `c`: if `c` is already placed, or is not in the sheet (empty), do nothing. Otherwise, first visit each cell in `refs` of `c`'s formula, in order, and then place `c`.",
        "",
        "For example:",
        "",
        "```",
        "ghci> evalOrder shuffled",
        "[\"A1\",\"B1\",\"B2\",\"A2\",\"C1\"]",
        "ghci> evalOrder budget",
        "[\"A1\",\"A2\",\"A3\",\"B1\",\"B2\",\"C1\"]",
        "```",
        "",
        "In `shuffled`, visiting `C1` first visits `B1`, which first visits `A1` (placed first), then `B1` is placed. Next `C1` visits `A2`, which visits `A1` (already placed) and `B2` (placed), then `A2` is placed, and finally `C1`. The remaining cells are already placed.",
      ),
      hints: [
        "The placed list is an accumulator that every visit takes in and gives back (bigger). Write `visit :: [CellRef] -> CellRef -> [CellRef]` taking the placed-so-far list and a cell, and returning the new placed list.",
        "Because `visit` takes the accumulator first, `foldl visit placed cells` visits a whole list of cells in order, threading the accumulator. Use it both for the sheet's cells (`map fst sheet`) and for a cell's references.",
        "It's easiest to keep the placed list **reversed** (newest first), so placing `c` is `c : ...`, and to `reverse` it once at the end. `isNothing (lookup c sheet)` tests for an empty cell.",
        md(
          "```",
          "evalOrder sheet = reverse (foldl visit [] (map fst sheet))",
          "  where",
          "    visit placed c",
          "      | elem c placed || isNothing (lookup c sheet) = placed",
          "      | otherwise = c : foldl visit placed (refs (formulaAt sheet c))",
          "```",
        ),
      ],
      solution: hs`evalOrder :: Sheet -> [CellRef]
evalOrder sheet = reverse (foldl visit [] (map fst sheet))
  where
    -- placed is kept newest-first
    visit placed c
      | elem c placed || isNothing (lookup c sheet) = placed
      | otherwise = c : foldl visit placed (refs (formulaAt sheet c))`,
      tests: [
        { expr: "evalOrder shuffled", expected: '["A1","B1","B2","A2","C1"]' },
        { expr: "evalOrder budget", expected: '["A1","A2","A3","B1","B2","C1"]' },
        { expr: "evalOrder []", expected: "[]" },
        { expr: "evalOrder (reverse budget)", expected: '["A1","A2","A3","B1","B2","C1"]', label: "evalOrder (reverse budget): C1 is visited first but placed last" },
        { expr: 'evalOrder [("B", Ref "C"), ("A", Ref "B"), ("C", Lit 1)]', expected: '["C","B","A"]' },
        { expr: "sort (evalOrder shuffled) == sort (map fst shuffled)", label: "every cell exactly once" },
        {
          expr: 'evalOrder [("X", Sum ["Q", "P"]), ("P", Lit 1), ("Q", Ref "P")]',
          expected: '["P","Q","X"]',
        },
      ],
    },
    {
      id: "recalc",
      name: "recalc",
      part: "Part III",
      marks: 4,
      prompt: md(
        "Define a function `recalc :: Sheet -> Maybe Values` that computes the value of every cell in the sheet, each exactly once:",
        "",
        "- If any cell of the sheet is cyclic (use `cyclic`), the result is `Nothing`.",
        "- Otherwise, go through the cells in the order given by `evalOrder`, building up a `Values` table. Each cell's formula is evaluated using the values **already in the table** for references (a referenced cell not in the table is empty, so 0). Do not use `evalFormula`, which would recompute cells.",
        "",
        "The result is `Just` the table, with the cells in evaluation order. For example:",
        "",
        "```",
        "ghci> recalc shuffled",
        "Just [(\"A1\",3),(\"B1\",9),(\"B2\",3),(\"A2\",6),(\"C1\",15)]",
        "ghci> recalc budget",
        "Just [(\"A1\",10),(\"A2\",20),(\"A3\",30),(\"B1\",60),(\"B2\",60),(\"C1\",660)]",
        "ghci> recalc loopy",
        "Nothing",
        "```",
      ),
      hints: [
        "Use a guard for the cyclic case: `any (cyclic sheet) (map fst sheet)`.",
        "Write a local evaluator `value :: Values -> Formula -> Int`. It is just like `evalFormula`, except that `Ref c` is `fromMaybe 0 (lookup c vals)` instead of a recursive evaluation.",
        "Build the table with `foldl` over `evalOrder sheet`, starting from `[]`. For each cell `c`, append `(c, value vals (formulaAt sheet c))` to the table `vals` built so far.",
        md(
          "```",
          "recalc sheet",
          "  | any (cyclic sheet) (map fst sheet) = Nothing",
          "  | otherwise = Just (foldl add [] (evalOrder sheet))",
          "  where",
          "    add vals c = vals ++ [(c, value vals (formulaAt sheet c))]",
          "    value vals (Ref c) = fromMaybe 0 (lookup c vals)",
          "    ...",
          "```",
        ),
      ],
      solution: hs`recalc :: Sheet -> Maybe Values
recalc sheet
  | any (cyclic sheet) (map fst sheet) = Nothing
  | otherwise = Just (foldl add [] (evalOrder sheet))
  where
    add vals c = vals ++ [(c, value vals (formulaAt sheet c))]

    -- evaluate using only the values computed so far
    value _ (Lit n) = n
    value vals (Ref c) = fromMaybe 0 (lookup c vals)
    value vals (Add f1 f2) = value vals f1 + value vals f2
    value vals (Mul f1 f2) = value vals f1 * value vals f2
    value vals (Sum cs) = sum [value vals (Ref c) | c <- cs]`,
      tests: [
        { expr: "recalc shuffled", expected: 'Just [("A1",3),("B1",9),("B2",3),("A2",6),("C1",15)]' },
        { expr: "recalc budget", expected: 'Just [("A1",10),("A2",20),("A3",30),("B1",60),("B2",60),("C1",660)]' },
        { expr: "recalc loopy", expected: "Nothing" },
        { expr: "recalc []", expected: "Just []" },
        {
          expr: 'fmap sort (recalc (setCell "A1" (Lit 1) budget))',
          expected: 'Just [("A1",1),("A2",20),("A3",21),("B1",42),("B2",42),("C1",84)]',
        },
        { expr: 'recalc (setCell "A1" (Ref "C1") budget)', expected: "Nothing" },
        { expr: 'recalc [("A1", Ref "Z9"), ("A2", Add (Ref "A1") (Lit 4))]', expected: 'Just [("A1",0),("A2",4)]' },
        {
          expr: "all (\\(c, v) -> evalFormula budget (Ref c) == v) (fromJust (recalc budget))",
          label: "recalc agrees with evalFormula",
        },
      ],
    },
  ],
};
