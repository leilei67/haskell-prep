import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "m13",
  year: 0,
  difficulty: 13,
  minutes: 120,
  title: "Mini paper 13: Boolean circuits",
  summary:
    "Model digital logic circuits as a data type: list their inputs, count gates, evaluate them, print truth tables, simplify them with algebraic rules, check two circuits are equivalent, and rebuild any circuit from its truth table.",
  skills: [
    "recursion over an expression data type",
    "nub and sort",
    "generating every combination recursively",
    "list comprehensions over environments",
    "bottom-up simplification with smart constructors",
    "all and and over a truth table",
    "foldr1 to build nested structures",
  ],
  story: md(
    "This paper is about **digital logic circuits**, the building blocks of every processor. A circuit has some named **inputs**, each carrying a Boolean signal (`True` = 1, `False` = 0), wired through **gates** that compute new signals:",
    "",
    "- a **NOT** gate flips its input;",
    "- an **AND** gate is 1 only when both its inputs are 1;",
    "- an **OR** gate is 1 when at least one input is 1;",
    "- an **XOR** (exclusive or) gate is 1 when exactly one input is 1, i.e. when its inputs are *different*.",
    "",
    "There are also **constant** wires that are always 0 or always 1.",
    "",
    "For example, the **half adder** adds two one-bit numbers `a` and `b`. Its sum bit is `a XOR b` and its carry bit is `a AND b`. The **truth table** of a circuit lists its output for every possible combination of inputs:",
    "",
    "```",
    "a b | a ^ b",
    "0 0 |   0",
    "0 1 |   1",
    "1 0 |   1",
    "1 1 |   0",
    "```",
    "",
    "With n inputs there are 2^n rows. Two circuits are **equivalent** if they have the same output on every row, even if they are wired completely differently: `(a | b) & ~(a & b)` is equivalent to `a ^ b`.",
    "",
    "Circuits often contain wasted gates: `a & 1` is just `a`, and `~~b` is just `b`. **Simplifying** removes them using algebraic rules. Finally, *any* truth table can be turned back into a circuit using only AND, OR and NOT, in **sum-of-products** form: one AND-term for each row whose output is 1, all ORed together.",
    "",
    "### The given types",
    "",
    "```",
    "data Circuit = In String",
    "             | Const Bool",
    "             | Not Circuit",
    "             | And Circuit Circuit",
    "             | Or Circuit Circuit",
    "             | Xor Circuit Circuit",
    "",
    "type Env = [(String, Bool)]",
    "```",
    "",
    "- `In \"a\"` is the input wire called a, and `Const True` / `Const False` are constant wires.",
    "- `Not`, `And`, `Or` and `Xor` are the gates. A circuit is a tree: the output is at the root, the inputs at the leaves.",
    "- An `Env` (environment) gives a value to each input name, like `[(\"a\",True),(\"b\",False)]`.",
    "",
    "Given to you: `lookUp`, a printer `showC` that writes circuits in the short notation used above (`~` for not, `&`, `|`, `^`, and `0`/`1` for constants), the inputs `a`, `b`, `c`, `s`, `x`, `y` as circuits, and the example circuits `halfSum`, `halfCarry`, `fullSum`, `majority`, `mux`, `xorByHand` and `messy`.",
  ),
  notes: md(
    "**Where the marks are.** 25 marks. Part I (4) is two short recursions; Part II (8) is evaluation and truth tables; Part III (8) is simplification and equivalence; Part IV (5) builds a circuit from a truth table using Part II.",
    "",
    "**Order of attack.** `inputs` and `gates` are warm-ups with one equation per constructor. Then `eval`, `envs`, `truthTable` in that order: each uses the one before. `equivalent` is a one-liner after that, so do it before `simplify` if `simplify` is taking a while. Part IV needs `truthTable`.",
    "",
    "**Traps.**",
    "",
    "- `inputs` must be sorted with no duplicates; constants have no inputs.",
    "- `gates` counts every gate, including repeated identical sub-circuits: it counts the tree, it doesn't share.",
    "- `envs` must produce the rows in the exact order given (False before True, first input changing slowest). `envs []` is `[[]]`: one row with no inputs, not zero rows.",
    "- In `simplify`, simplify the arguments **first**, then look at the top. A rule like `Xor (Const True) c = Not c` produces a `Not`, which may itself need the `Not` rules: write small helper functions (one per gate) and call them.",
    "- In `equivalent`, the two circuits may use different inputs: test over the inputs of **both**.",
    "",
    "**Short of time?** `equivalent` (3 marks) is the cheapest marks in the second half.",
  ),
  setup: hs`import Data.List

data Circuit = In String
             | Const Bool
             | Not Circuit
             | And Circuit Circuit
             | Or Circuit Circuit
             | Xor Circuit Circuit
  deriving (Eq, Show)

type Env = [(String, Bool)]

-- Finds the value paired with a key; the key must be present
lookUp :: Eq a => a -> [(a, b)] -> b
lookUp k table = head [v | (k', v) <- table, k' == k]

--------------------------------------------------------------
-- Printing

showC :: Circuit -> String
showC (In v) = v
showC (Const True) = "1"
showC (Const False) = "0"
showC (Not c) = '~' : showC c
showC (And c1 c2) = "(" ++ showC c1 ++ " & " ++ showC c2 ++ ")"
showC (Or c1 c2) = "(" ++ showC c1 ++ " | " ++ showC c2 ++ ")"
showC (Xor c1 c2) = "(" ++ showC c1 ++ " ^ " ++ showC c2 ++ ")"

--------------------------------------------------------------
-- Examples

a, b, c, s, x, y :: Circuit
a = In "a"
b = In "b"
c = In "c"
s = In "s"
x = In "x"
y = In "y"

-- Half adder: sum and carry of two bits
halfSum, halfCarry :: Circuit
halfSum = Xor a b
halfCarry = And a b

-- Full adder sum of three bits
fullSum :: Circuit
fullSum = Xor (Xor a b) c

-- True when at least two of a, b, c are true
majority :: Circuit
majority = Or (And a b) (Or (And a c) (And b c))

-- Multiplexer: picks x when s is 0 and y when s is 1
mux :: Circuit
mux = Or (And (Not s) x) (And s y)

-- XOR built from AND, OR and NOT
xorByHand :: Circuit
xorByHand = And (Or a b) (Not (And a b))

-- A wasteful way of writing a & b
messy :: Circuit
messy = And (Or a (Const False)) (Not (Not (Or b b)))
`,
  starter: hs`--------------------------------------------------------------
-- Part I

inputs :: Circuit -> [String]
inputs = undefined

gates :: Circuit -> Int
gates = undefined

--------------------------------------------------------------
-- Part II

eval :: Env -> Circuit -> Bool
eval = undefined

envs :: [String] -> [Env]
envs = undefined

truthTable :: Circuit -> [(Env, Bool)]
truthTable = undefined

--------------------------------------------------------------
-- Part III

simplify :: Circuit -> Circuit
simplify = undefined

equivalent :: Circuit -> Circuit -> Bool
equivalent = undefined

--------------------------------------------------------------
-- Part IV

sumOfProducts :: Circuit -> Circuit
sumOfProducts = undefined
`,
  tasks: [
    {
      id: "inputs",
      name: "inputs",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `inputs :: Circuit -> [String]` that returns the names of the inputs of a circuit, sorted, with no duplicates. For example:",
        "",
        "```",
        "ghci> inputs halfSum",
        "[\"a\",\"b\"]",
        "ghci> showC mux",
        "\"((~s & x) | (s & y))\"",
        "ghci> inputs mux",
        "[\"s\",\"x\",\"y\"]",
        "ghci> inputs (Not (Const True))",
        "[]",
        "```",
      ),
      hints: [
        "Collect all the names, duplicates and all, with a recursive helper, then tidy up with `sort` and `nub`.",
        "The helper has one equation per constructor: `In v` gives `[v]`, `Const _` gives `[]`, `Not c` gives the names in `c`, and each two-input gate joins the names of both sides with `++`.",
        "`inputs = sort . nub . names` where `names` is the helper.",
        md(
          "```",
          "inputs = sort . nub . names",
          "  where",
          "    names (In v) = [v]",
          "    names (Const _) = []",
          "    names (Not c) = names c",
          "    names (And c1 c2) = names c1 ++ names c2",
          "    names (Or c1 c2) = names c1 ++ names c2",
          "    names (Xor c1 c2) = names c1 ++ names c2",
          "```",
        ),
      ],
      solution: hs`inputs :: Circuit -> [String]
inputs = sort . nub . names
  where
    names (In v) = [v]
    names (Const _) = []
    names (Not c) = names c
    names (And c1 c2) = names c1 ++ names c2
    names (Or c1 c2) = names c1 ++ names c2
    names (Xor c1 c2) = names c1 ++ names c2`,
      tests: [
        { expr: "inputs halfSum", expected: '["a","b"]' },
        { expr: "inputs mux", expected: '["s","x","y"]' },
        { expr: "inputs (Not (Const True))", expected: "[]" },
        { expr: "inputs majority", expected: '["a","b","c"]' },
        { expr: "inputs (Xor (In \"z\") (And (In \"m\") (In \"z\")))", expected: '["m","z"]' },
        { expr: "inputs messy", expected: '["a","b"]' },
        { expr: "inputs (In \"q\")", expected: '["q"]' },
      ],
    },
    {
      id: "gates",
      name: "gates",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `gates :: Circuit -> Int` that counts the gates (`Not`, `And`, `Or` and `Xor`) in a circuit. Inputs and constants are wires, not gates. For example:",
        "",
        "```",
        "ghci> gates halfSum",
        "1",
        "ghci> gates mux",
        "4",
        "ghci> gates (In \"a\")",
        "0",
        "ghci> gates messy",
        "5",
        "```",
      ),
      hints: [
        "One equation per constructor again.",
        "`In` and `Const` count 0.",
        "A gate counts 1 plus the gates in its argument(s).",
        md(
          "```",
          "gates (In _) = 0",
          "gates (Const _) = 0",
          "gates (Not c) = 1 + gates c",
          "gates (And c1 c2) = 1 + gates c1 + gates c2",
          "gates (Or c1 c2) = 1 + gates c1 + gates c2",
          "gates (Xor c1 c2) = 1 + gates c1 + gates c2",
          "```",
        ),
      ],
      solution: hs`gates :: Circuit -> Int
gates (In _) = 0
gates (Const _) = 0
gates (Not c) = 1 + gates c
gates (And c1 c2) = 1 + gates c1 + gates c2
gates (Or c1 c2) = 1 + gates c1 + gates c2
gates (Xor c1 c2) = 1 + gates c1 + gates c2`,
      tests: [
        { expr: "gates halfSum", expected: "1" },
        { expr: "gates mux", expected: "4" },
        { expr: "gates (In \"a\")", expected: "0" },
        { expr: "gates messy", expected: "5" },
        { expr: "gates majority", expected: "5" },
        { expr: "gates xorByHand", expected: "4" },
        { expr: "gates (Const False)", expected: "0" },
        { expr: "gates (And a a)", expected: "1" },
      ],
    },
    {
      id: "eval",
      name: "eval",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define a function `eval :: Env -> Circuit -> Bool` that computes the output of a circuit when its inputs have the values in the environment. You may assume every input of the circuit appears in the environment. For example:",
        "",
        "```",
        "ghci> eval [(\"a\",True),(\"b\",False)] halfSum",
        "True",
        "ghci> eval [(\"a\",True),(\"b\",True)] halfSum",
        "False",
        "ghci> eval [(\"s\",True),(\"x\",False),(\"y\",True)] mux",
        "True",
        "ghci> eval [] (Not (Const False))",
        "True",
        "```",
      ),
      hints: [
        "One equation per constructor; the gates call `eval` on their arguments with the same environment.",
        "`In v` is `lookUp v env`; `Const v` is just `v`.",
        "`Not` is `not`, `And` is `&&`, `Or` is `||`. For `Xor`, the output is true when the two values are different: `/=` on Booleans.",
        md(
          "```",
          "eval env (In v) = lookUp v env",
          "eval _ (Const v) = v",
          "eval env (Not c) = not (eval env c)",
          "eval env (And c1 c2) = eval env c1 && eval env c2",
          "eval env (Or c1 c2) = eval env c1 || eval env c2",
          "eval env (Xor c1 c2) = eval env c1 /= eval env c2",
          "```",
        ),
      ],
      solution: hs`eval :: Env -> Circuit -> Bool
eval env (In v) = lookUp v env
eval _ (Const v) = v
eval env (Not c) = not (eval env c)
eval env (And c1 c2) = eval env c1 && eval env c2
eval env (Or c1 c2) = eval env c1 || eval env c2
eval env (Xor c1 c2) = eval env c1 /= eval env c2`,
      tests: [
        { expr: 'eval [("a",True),("b",False)] halfSum', expected: "True" },
        { expr: 'eval [("a",True),("b",True)] halfSum', expected: "False" },
        { expr: 'eval [("s",True),("x",False),("y",True)] mux', expected: "True" },
        { expr: 'eval [("s",False),("x",False),("y",True)] mux', expected: "False" },
        { expr: "eval [] (Not (Const False))", expected: "True" },
        { expr: '[eval [("a",p),("b",q),("c",r)] majority | p <- [False,True], q <- [False,True], r <- [False,True]]', expected: "[False,False,False,True,False,True,True,True]" },
        { expr: '[eval [("a",p),("b",q),("c",r)] fullSum | p <- [False,True], q <- [False,True], r <- [False,True]]', expected: "[False,True,True,False,True,False,False,True]" },
        { expr: 'eval [("b",True),("a",True)] messy', expected: "True" },
      ],
    },
    {
      id: "envs",
      name: "envs",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define a function `envs :: [String] -> [Env]` that returns every possible environment for a list of input names: one for each way of choosing `True` or `False` for each name. The names in each environment are in the same order as the given list. The environments must come in truth-table order: the first name changes slowest, and `False` comes before `True`. For example:",
        "",
        "```",
        "ghci> envs [\"a\"]",
        "[[(\"a\",False)],[(\"a\",True)]]",
        "ghci> envs [\"a\",\"b\"]",
        "[[(\"a\",False),(\"b\",False)],[(\"a\",False),(\"b\",True)],",
        " [(\"a\",True),(\"b\",False)],[(\"a\",True),(\"b\",True)]]",
        "ghci> envs []",
        "[[]]",
        "```",
        "",
        "There is exactly one environment for no names: the empty one.",
      ),
      hints: [
        "Recursion on the list of names. The base case is `envs [] = [[]]`, one empty environment (not `[]`, which would mean *no* environments and make everything else disappear).",
        "For `v : vs`: every environment for `v : vs` is a choice for `v` stuck on the front of an environment for `vs`.",
        "A list comprehension with two generators does it. Put the generator for `v`'s value first so it changes slowest.",
        "`envs (v : vs) = [(v, val) : rest | val <- [False, True], rest <- envs vs]`.",
      ],
      solution: hs`envs :: [String] -> [Env]
envs [] = [[]]
envs (v : vs) = [(v, val) : rest | val <- [False, True], rest <- envs vs]`,
      tests: [
        { expr: 'envs ["a"]', expected: '[[("a",False)],[("a",True)]]' },
        { expr: 'envs ["a","b"]', expected: '[[("a",False),("b",False)],[("a",False),("b",True)],[("a",True),("b",False)],[("a",True),("b",True)]]' },
        { expr: "envs []", expected: "[[]]" },
        { expr: 'length (envs ["p","q","r","s","t"])', expected: "32" },
        { expr: 'map (map snd) (envs ["x","y","z"])', expected: "[[False,False,False],[False,False,True],[False,True,False],[False,True,True],[True,False,False],[True,False,True],[True,True,False],[True,True,True]]" },
        { expr: 'map (map fst) (envs ["b","a"])', expected: '[["b","a"],["b","a"],["b","a"],["b","a"]]', label: "names keep the given order" },
        { expr: 'length (nub (envs ["a","b","c","d"]))', expected: "16", label: "no environment appears twice" },
      ],
    },
    {
      id: "truthTable",
      name: "truthTable",
      part: "Part II",
      marks: 2,
      prompt: md(
        "Using `inputs`, `envs` and `eval`, define a function `truthTable :: Circuit -> [(Env, Bool)]` that returns every row of a circuit's truth table: each environment for the circuit's (sorted) inputs, in the order given by `envs`, paired with the circuit's output. For example:",
        "",
        "```",
        "ghci> truthTable halfCarry",
        "[([(\"a\",False),(\"b\",False)],False),([(\"a\",False),(\"b\",True)],False),",
        " ([(\"a\",True),(\"b\",False)],False),([(\"a\",True),(\"b\",True)],True)]",
        "ghci> truthTable (Const True)",
        "[([],True)]",
        "```",
      ),
      hints: [
        "The rows are `envs (inputs circ)`.",
        "Each row `env` becomes the pair `(env, eval env circ)`.",
        "A list comprehension over the environments does it in one line.",
        "`truthTable circ = [(env, eval env circ) | env <- envs (inputs circ)]`.",
      ],
      solution: hs`truthTable :: Circuit -> [(Env, Bool)]
truthTable circ = [(env, eval env circ) | env <- envs (inputs circ)]`,
      tests: [
        {
          expr: "truthTable halfCarry",
          expected: '[([("a",False),("b",False)],False),([("a",False),("b",True)],False),([("a",True),("b",False)],False),([("a",True),("b",True)],True)]',
        },
        { expr: "truthTable (Const True)", expected: "[([],True)]" },
        { expr: "map snd (truthTable halfSum)", expected: "[False,True,True,False]" },
        { expr: "map snd (truthTable majority)", expected: "[False,False,False,True,False,True,True,True]" },
        { expr: "map snd (truthTable mux)", expected: "[False,False,True,True,False,True,False,True]" },
        { expr: "map snd (truthTable xorByHand)", expected: "map snd (truthTable halfSum)" },
        { expr: "length (truthTable (And (In \"p\") (Or (In \"q\") (In \"p\"))))", expected: "4" },
      ],
    },
    {
      id: "simplify",
      name: "simplify",
      part: "Part III",
      marks: 5,
      prompt: md(
        "Define a function `simplify :: Circuit -> Circuit` that removes wasted gates. Work **bottom-up**: first simplify the argument(s) of a gate, then apply the first of these rules that matches the gate built from the simplified arguments (`c` is any circuit, `v` any Boolean):",
        "",
        "```",
        "~v        =  not v         (a constant)",
        "~~c       =  c",
        "",
        "0 & c     =  0             c & 0  =  0",
        "1 & c     =  c             c & 1  =  c",
        "c & c     =  c",
        "",
        "1 | c     =  1             c | 1  =  1",
        "0 | c     =  c             c | 0  =  c",
        "c | c     =  c",
        "",
        "0 ^ c     =  c             c ^ 0  =  c",
        "1 ^ c     =  ~c            c ^ 1  =  ~c",
        "c ^ c     =  0",
        "```",
        "",
        "If no rule matches, keep the gate. When a rule produces `~c`, apply the two `~` rules to it as well (so `1 ^ ~a` becomes `a`). Inputs and constants are left alone. For example:",
        "",
        "```",
        "ghci> showC messy",
        "\"((a | 0) & ~~(b | b))\"",
        "ghci> simplify messy",
        "And (In \"a\") (In \"b\")",
        "ghci> simplify (Xor (Const True) (Not a))",
        "In \"a\"",
        "ghci> simplify (Or (And a (Const False)) (Xor b b))",
        "Const False",
        "ghci> simplify mux == mux",
        "True",
        "```",
      ),
      hints: [
        "Write one helper per gate that applies that gate's rules to arguments that are **already simplified**: `mkNot :: Circuit -> Circuit`, `mkAnd, mkOr, mkXor :: Circuit -> Circuit -> Circuit`. Then `simplify (And c1 c2) = mkAnd (simplify c1) (simplify c2)`, and so on.",
        "Each helper is a list of equations in the order of the rules, ending with a catch-all that just builds the gate: `mkNot (Const v) = Const (not v)`, `mkNot (Not c) = c`, `mkNot c = Not c`.",
        "The `c & c` rule needs a guard: `mkAnd c1 c2 | c1 == c2 = c1`. For `1 ^ c = ~c`, call `mkNot c` instead of writing `Not c`, so the `~` rules get applied.",
        md(
          "```",
          "mkAnd (Const False) _ = Const False",
          "mkAnd _ (Const False) = Const False",
          "mkAnd (Const True) c = c",
          "mkAnd c (Const True) = c",
          "mkAnd c1 c2",
          "  | c1 == c2  = c1",
          "  | otherwise = And c1 c2",
          "",
          "mkXor (Const False) c = c",
          "mkXor c (Const False) = c",
          "mkXor (Const True) c = mkNot c",
          "mkXor c (Const True) = mkNot c",
          "mkXor c1 c2",
          "  | c1 == c2  = Const False",
          "  | otherwise = Xor c1 c2",
          "```",
          "",
          "`mkOr` is like `mkAnd` with the constants swapped.",
        ),
      ],
      solution: hs`simplify :: Circuit -> Circuit
simplify (Not c) = mkNot (simplify c)
simplify (And c1 c2) = mkAnd (simplify c1) (simplify c2)
simplify (Or c1 c2) = mkOr (simplify c1) (simplify c2)
simplify (Xor c1 c2) = mkXor (simplify c1) (simplify c2)
simplify c = c

-- Each helper applies one gate's rules to simplified arguments
mkNot :: Circuit -> Circuit
mkNot (Const v) = Const (not v)
mkNot (Not c) = c
mkNot c = Not c

mkAnd :: Circuit -> Circuit -> Circuit
mkAnd (Const False) _ = Const False
mkAnd _ (Const False) = Const False
mkAnd (Const True) c = c
mkAnd c (Const True) = c
mkAnd c1 c2
  | c1 == c2  = c1
  | otherwise = And c1 c2

mkOr :: Circuit -> Circuit -> Circuit
mkOr (Const True) _ = Const True
mkOr _ (Const True) = Const True
mkOr (Const False) c = c
mkOr c (Const False) = c
mkOr c1 c2
  | c1 == c2  = c1
  | otherwise = Or c1 c2

mkXor :: Circuit -> Circuit -> Circuit
mkXor (Const False) c = c
mkXor c (Const False) = c
mkXor (Const True) c = mkNot c
mkXor c (Const True) = mkNot c
mkXor c1 c2
  | c1 == c2  = Const False
  | otherwise = Xor c1 c2`,
      tests: [
        { expr: "simplify messy", expected: 'And (In "a") (In "b")' },
        { expr: "simplify (Xor (Const True) (Not a))", expected: 'In "a"' },
        { expr: "simplify (Or (And a (Const False)) (Xor b b))", expected: "Const False" },
        { expr: "simplify mux", expected: "mux", label: "nothing to simplify" },
        { expr: "simplify (Not (Not (Not (Const True))))", expected: "Const False" },
        { expr: "simplify (Or (Const True) (In \"z\"))", expected: "Const True" },
        { expr: "simplify (Xor (Xor a (Const True)) (Const True))", expected: 'In "a"' },
        { expr: "simplify (And (Not (Not b)) (Or b (Const False)))", expected: 'In "b"', label: "arguments simplified first, then c & c" },
        { expr: "simplify (Or (Xor c (Const False)) (And (Const True) (Not c)))", expected: 'Or (In "c") (Not (In "c"))', label: "c | ~c is not one of the rules" },
        { expr: "all (\\(env, v) -> eval env (simplify messy) == v) (truthTable messy)", label: "simplifying doesn't change the output" },
      ],
    },
    {
      id: "equivalent",
      name: "equivalent",
      part: "Part III",
      marks: 3,
      prompt: md(
        "Define a function `equivalent :: Circuit -> Circuit -> Bool` that returns `True` exactly when two circuits give the same output for every combination of values of their inputs. The two circuits may have different inputs: use every input of **either** circuit. For example:",
        "",
        "```",
        "ghci> equivalent halfSum xorByHand",
        "True",
        "ghci> equivalent halfSum halfCarry",
        "False",
        "ghci> equivalent (Or a (Not a)) (Const True)",
        "True",
        "ghci> equivalent a (And a (Or a b))",
        "True",
        "```",
      ),
      hints: [
        "Make the list of all input names from both circuits, without duplicates.",
        "`envs` of that list gives every row to check.",
        "Use `all` (or `and` with a comprehension) to check that `eval env c1 == eval env c2` for every row. `eval` doesn't mind extra names in the environment.",
        md(
          "```",
          "equivalent c1 c2 = and [eval env c1 == eval env c2 | env <- envs names]",
          "  where",
          "    names = nub (inputs c1 ++ inputs c2)",
          "```",
        ),
      ],
      solution: hs`equivalent :: Circuit -> Circuit -> Bool
equivalent c1 c2 = and [eval env c1 == eval env c2 | env <- envs names]
  where
    names = nub (inputs c1 ++ inputs c2)`,
      tests: [
        { expr: "equivalent halfSum xorByHand", expected: "True" },
        { expr: "equivalent halfSum halfCarry", expected: "False" },
        { expr: "equivalent (Or a (Not a)) (Const True)", expected: "True" },
        { expr: "equivalent a (And a (Or a b))", expected: "True", label: "different inputs on each side" },
        { expr: "equivalent a b", expected: "False" },
        { expr: "equivalent messy halfCarry", expected: "True" },
        { expr: "equivalent fullSum (Xor a (Xor b c))", expected: "True" },
        { expr: "equivalent majority (Or (And a b) (And c (Or a b)))", expected: "True" },
        { expr: "equivalent majority fullSum", expected: "False" },
        { expr: "equivalent (Const False) (And b (Not b))", expected: "True" },
      ],
    },
    {
      id: "sumOfProducts",
      name: "sumOfProducts",
      part: "Part IV",
      marks: 5,
      prompt: md(
        "Every circuit can be rebuilt using only `And`, `Or`, `Not` and inputs, straight from its truth table. Using `truthTable`, define a function `sumOfProducts :: Circuit -> Circuit` that does this:",
        "",
        "- For each row of the truth table whose output is `True` (in truth-table order), make a **term**: the `And` of one **literal** per input, in the row's order. The literal is `In v` if `v` is `True` in that row and `Not (In v)` if it is `False`. Join the literals with `foldr1 And`, so three literals `l1`, `l2`, `l3` give `And l1 (And l2 l3)`.",
        "- Join the terms with `foldr1 Or`.",
        "",
        "Two special cases: if no row is `True`, the answer is `Const False`; and if the circuit has no inputs at all, the answer is `Const v` where `v` is its output. For example:",
        "",
        "```",
        "ghci> sumOfProducts halfSum",
        "Or (And (Not (In \"a\")) (In \"b\")) (And (In \"a\") (Not (In \"b\")))",
        "ghci> showC (sumOfProducts majority)",
        "\"((~a & (b & c)) | ((a & (~b & c)) | ((a & (b & ~c)) | (a & (b & c)))))\"",
        "ghci> sumOfProducts (And a (Not a))",
        "Const False",
        "ghci> sumOfProducts (Not (Const False))",
        "Const True",
        "```",
        "",
        "The result is always equivalent to the original circuit.",
      ),
      hints: [
        "First deal with the special cases: `null (inputs circ)` and \"no `True` rows\". Then the general case: build a list of terms, one per `True` row, and `foldr1 Or` them.",
        "The `True` rows' environments are `[env | (env, True) <- truthTable circ]`: the pattern `True` in the generator keeps only those rows.",
        "A term for one `env` is `foldr1 And (map literal env)`, where `literal (v, True) = In v` and `literal (v, False) = Not (In v)`.",
        md(
          "```",
          "sumOfProducts circ",
          "  | null (inputs circ) = Const (eval [] circ)",
          "  | null rows          = Const False",
          "  | otherwise          = foldr1 Or (map term rows)",
          "  where",
          "    rows = [env | (env, True) <- truthTable circ]",
          "    term env = foldr1 And (map literal env)",
          "    literal (v, True) = In v",
          "    literal (v, False) = Not (In v)",
          "```",
        ),
      ],
      solution: hs`sumOfProducts :: Circuit -> Circuit
sumOfProducts circ
  | null (inputs circ) = Const (eval [] circ)
  | null rows          = Const False
  | otherwise          = foldr1 Or (map term rows)
  where
    rows = [env | (env, True) <- truthTable circ]
    term env = foldr1 And (map literal env)
    literal (v, True) = In v
    literal (v, False) = Not (In v)`,
      tests: [
        { expr: "sumOfProducts halfSum", expected: 'Or (And (Not (In "a")) (In "b")) (And (In "a") (Not (In "b")))' },
        { expr: "showC (sumOfProducts majority)", expected: '"((~a & (b & c)) | ((a & (~b & c)) | ((a & (b & ~c)) | (a & (b & c)))))"' },
        { expr: "sumOfProducts (And a (Not a))", expected: "Const False" },
        { expr: "sumOfProducts (Not (Const False))", expected: "Const True" },
        { expr: "sumOfProducts (Xor (Const True) (Const True))", expected: "Const False" },
        { expr: "sumOfProducts a", expected: 'In "a"' },
        { expr: "sumOfProducts (Not b)", expected: 'Not (In "b")' },
        { expr: "equivalent (sumOfProducts mux) mux", expected: "True" },
        { expr: "equivalent (sumOfProducts fullSum) fullSum", expected: "True" },
        {
          expr: "let { ok (In _) = True; ok (Not p) = ok p; ok (And p q) = ok p && ok q; ok (Or p q) = ok p && ok q; ok _ = False } in ok (sumOfProducts fullSum)",
          label: "the result uses no Xor gates and no constants",
        },
      ],
    },
  ],
};
