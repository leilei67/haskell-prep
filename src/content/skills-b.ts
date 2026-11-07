import { type DrillSet, type Lesson, hs, md } from "./schema.ts";

const formulaSetup = hs`data Formula = Var String | Not Formula | And Formula Formula | Or Formula Formula
  deriving (Eq, Show)
`;

const bexpSetup = hs`data BExp = Prim Bool | IdRef Int | Not BExp | And BExp BExp | Or BExp BExp
  deriving (Eq, Show)
`;

const bexpStepSetup = hs`data BExp = Prim Bool | IdRef Int | Not BExp | And BExp BExp | Or BExp BExp
  deriving (Eq, Show)

step :: BExp -> BExp
step (Not (Prim b)) = Prim (not b)
step (And (Prim a) (Prim b)) = Prim (a && b)
step (Or (Prim a) (Prim b)) = Prim (a || b)
step e = e
`;

const reSetup = hs`data RE = Null | Term Char | Seq RE RE | Alt RE RE | Rep RE | Plus RE | Opt RE
  deriving (Eq, Show)
`;

const constSetup = hs`data Exp = Const Int | Var String | Add Exp Exp | Mul Exp Exp
  deriving (Eq, Show)
`;

const rewrite: Lesson = {
  id: "rewrite",
  title: "Rewriting trees with nested patterns",
  blurb: "Simplification rules, equation order, and rewriting a whole tree bottom-up.",
  steps: [
    {
      k: "read",
      body: md(
        "Many exams give you a tree-shaped data type for expressions or formulas, then ask you to rewrite it: simplify it, push negations inward, remove some constructors. This lesson is about exactly that.",
        "",
        "Here is a formula type, very close to the one in 2019:",
        "",
        "```",
        "data Formula = Var String | Not Formula | And Formula Formula | Or Formula Formula",
        "```",
        "",
        "`And (Var \"a\") (Not (Var \"b\"))` means \"a and not b\". A rewriting rule says: when you see this shape, replace it with that shape. For example, \"not not e is just e\".",
      ),
    },
    {
      k: "read",
      body: md(
        "To spot a shape, you put patterns inside patterns. This is called a nested pattern:",
        "",
        "```",
        "dropDoubleNot :: Formula -> Formula",
        "dropDoubleNot (Not (Not e)) = e",
        "dropDoubleNot f             = f",
        "```",
        "",
        "The first equation only matches a `Not` whose inside is also a `Not`. Whatever is inside both is named `e`, and that is the answer. The second equation is a catch-all: any other formula `f` is given back unchanged.",
      ),
    },
    {
      k: "quiz",
      q: "Which of these does the pattern `Not (Not e)` match?",
      options: [
        "`Not (Var \"a\")`",
        "`Not (Not (Var \"a\"))`",
        "`And (Not (Var \"a\")) (Not (Var \"b\"))`",
        "`Var \"a\"`",
      ],
      answer: 1,
      why: "The outside must be `Not`, and the thing directly inside must also be `Not`. Only the second option has that shape; there `e` is `Var \"a\"`. Option 1 is a single `Not`, and option 3 has `And` on the outside.",
    },
    {
      k: "try",
      body: "Nested patterns work with every type, not just yours. Here is a `Maybe` inside a `Maybe`:",
      code: "let f m = case m of { Just (Just n) -> n * 2; _ -> 0 } in f (Just (Just 5))",
      after: "The pattern `Just (Just n)` looked two levels deep and named the 5 `n`. The `_` line catches everything else.",
    },
    {
      k: "predict",
      expr: "let f xs = case xs of { (Just a : Nothing : _) -> a; _ -> 0 } in f [Just 1, Nothing]",
      answer: "1",
      why: "The pattern says: the first element is `Just a`, the second is `Nothing`, then anything. The list fits, with `a` being 1.",
    },
    {
      k: "write",
      setup: formulaSetup,
      body: md(
        "Write `dropDoubleNot`, which removes a double `Not` at the very top of a formula, and leaves every other formula unchanged.",
        "",
        "It only looks at the top. `And (Not (Not (Var \"a\"))) (Var \"b\")` has a double `Not` deeper inside, but it stays as it is.",
      ),
      starter: hs`dropDoubleNot :: Formula -> Formula
dropDoubleNot f = undefined
`,
      tests: [
        { expr: `dropDoubleNot (Not (Not (Var "a")))`, expected: `Var "a"` },
        { expr: `dropDoubleNot (Not (Var "a"))`, expected: `Not (Var "a")` },
        { expr: `dropDoubleNot (Var "x")`, expected: `Var "x"` },
        { expr: `dropDoubleNot (Not (Not (Not (Var "p"))))`, expected: `Not (Var "p")` },
        { expr: `dropDoubleNot (And (Not (Not (Var "a"))) (Var "b"))`, expected: `And (Not (Not (Var "a"))) (Var "b")` },
      ],
      hint: "Two equations: `dropDoubleNot (Not (Not e)) = e`, then a catch-all `dropDoubleNot f = f`.",
      solution: hs`dropDoubleNot :: Formula -> Formula
dropDoubleNot (Not (Not e)) = e
dropDoubleNot f = f
`,
    },
    {
      k: "read",
      body: md(
        "Haskell tries the equations from top to bottom and uses the first one that matches. So order matters. A catch-all must go last:",
        "",
        "```",
        "bad :: Formula -> Formula",
        "bad f             = f        -- matches everything...",
        "bad (Not (Not e)) = e        -- ...so this line is never reached",
        "```",
        "",
        "The general rule: put the most specific shapes first, and the most general ones last. GHC will often warn you \"pattern match is redundant\" when a line can never be reached. Read that warning; it usually means your order is wrong.",
      ),
    },
    {
      k: "quiz",
      q: md(
        "Given these equations, what is `f (And (Var \"a\") (Var \"b\"))`?",
        "",
        "```",
        "f (And _ _)       = 1",
        "f (And (Var _) _) = 2",
        "f _               = 3",
        "```",
      ),
      options: ["`1`", "`2`", "`3`", "It's a compile error"],
      answer: 0,
      why: "The first equation already matches any `And`, so it wins. The second equation can never be used. If you wanted 2, the more specific `And (Var _) _` line would have to come first.",
    },
    {
      k: "predict",
      expr: 'let { f (0, _) = "zero first"; f (_, 0) = "zero second"; f _ = "none" } in f (0, 0)',
      answer: '"zero first"',
      why: "`(0, 0)` matches both of the first two equations, but Haskell stops at the first one that fits.",
    },
    {
      k: "read",
      body: md(
        "What if no equation matches? The program compiles, but crashes when it runs into that value, with a message like `Non-exhaustive patterns in function f`. In an auto-tested exam, one crash fails that test.",
        "",
        "That's why a rewriting function almost always ends with a catch-all line that gives the input back unchanged: \"if no rule applies, leave it alone\".",
      ),
    },
    {
      k: "try",
      code: "let f (Just x) = x in f (Nothing :: Maybe Int)",
      expectError: true,
      after: "`f` has no equation for `Nothing`, so it crashed with \"Non-exhaustive patterns\". A catch-all equation would have prevented this.",
    },
    {
      k: "read",
      body: md(
        "Now a real exam function. The 2009 paper (binary decision diagrams) uses this type:",
        "",
        "```",
        "data BExp = Prim Bool | IdRef Int | Not BExp | And BExp BExp | Or BExp BExp",
        "```",
        "",
        "`Prim True` and `Prim False` are constants; `IdRef 3` means \"variable number 3\". It asks for a one-step `simplify`: it looks only at the top of the expression, and only applies these rules:",
        "",
        "```",
        "Not (Prim b)            becomes  Prim (not b)",
        "And (Prim a) (Prim b)   becomes  Prim (a && b)",
        "Or  (Prim a) (Prim b)   becomes  Prim (a || b)",
        "anything else           stays the same",
        "```",
        "",
        "One-step means no recursion: it never looks inside to simplify the pieces. That was exactly what the exam wanted, because it was always called on small pieces built one level at a time.",
      ),
    },
    {
      k: "write",
      setup: bexpSetup,
      body: "Write the 2009 one-step `simplify` using the three rules above and a catch-all. No recursion.",
      starter: hs`simplify :: BExp -> BExp
simplify e = undefined
`,
      tests: [
        { expr: "simplify (Not (Prim True))", expected: "Prim False" },
        { expr: "simplify (And (Prim True) (Prim False))", expected: "Prim False" },
        { expr: "simplify (Or (Prim False) (Prim True))", expected: "Prim True" },
        { expr: "simplify (And (IdRef 1) (Prim True))", expected: "And (IdRef 1) (Prim True)" },
        { expr: "simplify (Not (Not (Prim True)))", expected: "Not (Not (Prim True))" },
        { expr: "simplify (IdRef 4)", expected: "IdRef 4" },
      ],
      hint: "One equation per rule with nested patterns, like `simplify (Not (Prim b)) = Prim (not b)`, then `simplify e = e` last.",
      solution: hs`simplify :: BExp -> BExp
simplify (Not (Prim b)) = Prim (not b)
simplify (And (Prim a) (Prim b)) = Prim (a && b)
simplify (Or (Prim a) (Prim b)) = Prim (a || b)
simplify e = e
`,
    },
    {
      k: "quiz",
      q: "What does the one-step 2009 `simplify` give for `Not (Not (Prim True))`?",
      options: ["`Prim True`", "`Not (Prim False)`", "`Not (Not (Prim True))`, unchanged", "It crashes"],
      answer: 2,
      why: "The outer `Not` contains `Not (Prim True)`, not a `Prim`, so the rule `Not (Prim b)` does not match at the top. No rule fits, so the catch-all gives it back unchanged. One-step never looks deeper.",
    },
    {
      k: "read",
      body: md(
        "Usually you want to simplify the whole tree. The safe recipe is bottom-up: first rewrite the children, then try the rules on the new top.",
        "",
        "```",
        "simplifyAll (Not e)   = step (Not (simplifyAll e))",
        "simplifyAll (And a b) = step (And (simplifyAll a) (simplifyAll b))",
        "simplifyAll (Or a b)  = step (Or (simplifyAll a) (simplifyAll b))",
        "simplifyAll e         = e",
        "```",
        "",
        "Here `step` is the one-step function. Why children first? In `Not (Not (Prim True))`, the inner `Not (Prim True)` becomes `Prim False`. Only then does the outside look like `Not (Prim False)`, which `step` can turn into `Prim True`.",
      ),
    },
    {
      k: "write",
      setup: bexpStepSetup,
      body: "The setup gives you `step`, the one-step simplifier. Write `simplifyAll`, which simplifies the whole tree bottom-up.",
      starter: hs`simplifyAll :: BExp -> BExp
simplifyAll e = undefined
`,
      tests: [
        { expr: "simplifyAll (Not (Not (Prim True)))", expected: "Prim True" },
        { expr: "simplifyAll (And (Not (Prim False)) (Or (Prim False) (Prim True)))", expected: "Prim True" },
        { expr: "simplifyAll (And (IdRef 1) (Not (Prim True)))", expected: "And (IdRef 1) (Prim False)" },
        { expr: "simplifyAll (IdRef 3)", expected: "IdRef 3" },
        { expr: "simplifyAll (Or (Not (IdRef 2)) (And (Prim True) (Prim True)))", expected: "Or (Not (IdRef 2)) (Prim True)" },
      ],
      hint: "For each constructor with children, rebuild it with `simplifyAll` applied to every child, then wrap the result in `step`. `Prim` and `IdRef` have no children: give them back.",
      solution: hs`simplifyAll :: BExp -> BExp
simplifyAll (Not e) = step (Not (simplifyAll e))
simplifyAll (And a b) = step (And (simplifyAll a) (simplifyAll b))
simplifyAll (Or a b) = step (Or (simplifyAll a) (simplifyAll b))
simplifyAll e = e
`,
    },
    {
      k: "quiz",
      q: "Using the bottom-up `simplifyAll`, what is `simplifyAll (Not (And (Prim True) (Prim False)))`?",
      options: ["`Prim False`", "`Prim True`", "`Not (Prim False)`", "`Not (And (Prim True) (Prim False))`"],
      answer: 1,
      why: "Bottom-up: the inside `And (Prim True) (Prim False)` becomes `Prim False`. Then the top is `Not (Prim False)`, and `step` turns that into `Prim True`.",
    },
    {
      k: "read",
      body: md(
        "Sometimes a rule is recursive itself, because the thing it builds still needs work. 2019 asks for `toNNF`, negation normal form: a formula where `Not` only ever sits directly on a `Var`. You push every `Not` inward using De Morgan's laws:",
        "",
        "```",
        "Not (Not f)     becomes  f",
        "Not (And a b)   becomes  Or  (Not a) (Not b)",
        "Not (Or a b)    becomes  And (Not a) (Not b)",
        "```",
        "",
        "Read the second one as: \"not (a and b)\" is the same as \"(not a) or (not b)\". After a rule fires, the new `Not a` and `Not b` may themselves need pushing further, so you call `toNNF` on them again.",
      ),
    },
    {
      k: "quiz",
      q: "In negation normal form, what should `toNNF (Not (Or (Var \"a\") (Var \"b\")))` be?",
      options: [
        "`Or (Not (Var \"a\")) (Not (Var \"b\"))`",
        "`And (Not (Var \"a\")) (Not (Var \"b\"))`",
        "`Not (And (Var \"a\") (Var \"b\"))`",
        "`And (Var \"a\") (Var \"b\")`",
      ],
      answer: 1,
      why: "De Morgan swaps the operator as the `Not` goes inside: not (a or b) is (not a) and (not b). Keeping `Or` (option 1) is the classic slip.",
    },
    {
      k: "write",
      setup: formulaSetup,
      body: md(
        "Write `toNNF` (2019, worth 4 marks). Use the three rules above (calling `toNNF` again on what they build), plus:",
        "",
        "```",
        "And a b    becomes  And (toNNF a) (toNNF b)",
        "Or a b     becomes  Or  (toNNF a) (toNNF b)",
        "anything else (a Var, or Not of a Var) stays the same",
        "```",
      ),
      starter: hs`toNNF :: Formula -> Formula
toNNF f = undefined
`,
      tests: [
        { expr: `toNNF (Not (Not (Var "a")))`, expected: `Var "a"` },
        { expr: `toNNF (Not (And (Var "a") (Var "b")))`, expected: `Or (Not (Var "a")) (Not (Var "b"))` },
        { expr: `toNNF (Not (Or (Var "a") (Not (Var "b"))))`, expected: `And (Not (Var "a")) (Var "b")` },
        { expr: `toNNF (Not (Var "x"))`, expected: `Not (Var "x")` },
        {
          expr: `toNNF (And (Not (Not (Var "p"))) (Not (And (Var "q") (Not (Var "r")))))`,
          expected: `And (Var "p") (Or (Not (Var "q")) (Var "r"))`,
        },
      ],
      hint: "The `Not (...)` equations must come before the plain catch-all. In the De Morgan cases, build `Or (toNNF (Not a)) (toNNF (Not b))`.",
      solution: hs`toNNF :: Formula -> Formula
toNNF (Not (Not f)) = toNNF f
toNNF (Not (And a b)) = Or (toNNF (Not a)) (toNNF (Not b))
toNNF (Not (Or a b)) = And (toNNF (Not a)) (toNNF (Not b))
toNNF (And a b) = And (toNNF a) (toNNF b)
toNNF (Or a b) = Or (toNNF a) (toNNF b)
toNNF f = f
`,
    },
    {
      k: "read",
      body: md(
        "Another kind of rewrite: removing constructors by expressing them with others. 2014 (regular expressions) has:",
        "",
        "```",
        "data RE = Null | Term Char | Seq RE RE | Alt RE RE | Rep RE | Plus RE | Opt RE",
        "```",
        "",
        "`Plus r` means \"one or more r\", and `Opt r` means \"r or nothing\". Its `simplify` removes both, everywhere in the tree:",
        "",
        "```",
        "Plus r   becomes  Seq r (Rep r)     -- one r, then zero or more",
        "Opt r    becomes  Alt r Null        -- r, or the empty match",
        "```",
        "",
        "Every other constructor is rebuilt with its children simplified.",
      ),
    },
    {
      k: "write",
      setup: reSetup,
      body: "Write the 2014 `simplify`, which removes every `Plus` and `Opt` from a regular expression, at every depth.",
      starter: hs`simplify :: RE -> RE
simplify r = undefined
`,
      tests: [
        { expr: "simplify (Plus (Term 'a'))", expected: "Seq (Term 'a') (Rep (Term 'a'))" },
        { expr: "simplify (Opt (Term 'b'))", expected: "Alt (Term 'b') Null" },
        { expr: "simplify (Seq (Term 'x') (Opt (Term 'y')))", expected: "Seq (Term 'x') (Alt (Term 'y') Null)" },
        { expr: "simplify (Plus (Opt (Term 'c')))", expected: "Seq (Alt (Term 'c') Null) (Rep (Alt (Term 'c') Null))" },
        { expr: "simplify (Rep (Alt Null (Term 'd')))", expected: "Rep (Alt Null (Term 'd'))" },
        { expr: "simplify Null", expected: "Null" },
      ],
      hint: "Simplify the child first. For `Plus r`, name `r' = simplify r` in a `where` and give `Seq r' (Rep r')`. Rebuild `Seq`, `Alt` and `Rep` with simplified children. `Null` and `Term` stay.",
      solution: hs`simplify :: RE -> RE
simplify (Seq a b) = Seq (simplify a) (simplify b)
simplify (Alt a b) = Alt (simplify a) (simplify b)
simplify (Rep r) = Rep (simplify r)
simplify (Plus r) = Seq r' (Rep r')
  where
    r' = simplify r
simplify (Opt r) = Alt (simplify r) Null
simplify r = r
`,
    },
    {
      k: "read",
      body: md(
        "The biggest trap in this topic: adding rules the spec didn't ask for.",
        "",
        "2018 (a compiler optimiser) gives a short, exact list of constant-folding rules. It's tempting to add your own clever ones, like \"x times 1 is x\" or \"x times 0 is 0\". Don't. The tests compare your answer with the expected tree exactly, using `==`. A tree that is \"simpler\" but different is just wrong.",
        "",
        "Implement exactly the rules listed, in the order listed, and nothing else.",
      ),
    },
    {
      k: "quiz",
      q: "The spec's rules for multiplication only fold two constants. You add the extra rule `Mul e (Const 1) = e`. What happens with a test of `foldConst (Mul (Var \"x\") (Const 1))`?",
      options: [
        "It passes: your answer is simpler",
        "It fails: the expected answer is `Mul (Var \"x\") (Const 1)`, unchanged",
        "It fails to compile",
        "The tester ignores extra rules",
      ],
      answer: 1,
      why: "The test checks your result `==` the expected tree. The spec has no rule for this shape, so the expected answer is the input unchanged. Your `Var \"x\"` is not equal to that.",
    },
    {
      k: "write",
      setup: constSetup,
      body: md(
        "Write `foldConst`, modelled on 2018. Work bottom-up: fold the children first, then apply ONLY these rules to the new top:",
        "",
        "```",
        "Add (Const x) (Const y)   becomes  Const (x + y)",
        "Mul (Const x) (Const y)   becomes  Const (x * y)",
        "Add (Const 0) e           becomes  e",
        "Add e (Const 0)           becomes  e",
        "```",
        "",
        "Anything else is rebuilt unchanged (with its folded children).",
      ),
      starter: hs`foldConst :: Exp -> Exp
foldConst e = undefined
`,
      tests: [
        { expr: "foldConst (Add (Mul (Const 2) (Const 3)) (Const 4))", expected: "Const 10" },
        { expr: `foldConst (Add (Var "x") (Add (Const 0) (Const 0)))`, expected: `Var "x"` },
        { expr: `foldConst (Mul (Var "x") (Const 1))`, expected: `Mul (Var "x") (Const 1)` },
        { expr: `foldConst (Mul (Const 0) (Var "y"))`, expected: `Mul (Const 0) (Var "y")` },
        { expr: `foldConst (Add (Const 0) (Mul (Const 5) (Var "z")))`, expected: `Mul (Const 5) (Var "z")` },
        { expr: `foldConst (Var "q")`, expected: `Var "q"` },
      ],
      hint: "For `Add a b`, fold both sides first, then use a `case (foldConst a, foldConst b) of` with one line per rule, and a last line `(a', b') -> Add a' b'`.",
      solution: hs`foldConst :: Exp -> Exp
foldConst (Add a b) = case (foldConst a, foldConst b) of
  (Const x, Const y) -> Const (x + y)
  (Const 0, e) -> e
  (e, Const 0) -> e
  (a', b') -> Add a' b'
foldConst (Mul a b) = case (foldConst a, foldConst b) of
  (Const x, Const y) -> Const (x * y)
  (a', b') -> Mul a' b'
foldConst e = e
`,
    },
    {
      k: "predict",
      body: "Rewriting works on lists too. This collapses any run of zeros into one zero:",
      expr: "let { f (0 : 0 : xs) = f (0 : xs); f (x : xs) = x : f xs; f [] = [] } in f [1, 0, 0, 0, 2]",
      answer: "[1, 0, 2]",
      why: "`0 : 0 : xs` spots two zeros in a row and drops one, then looks again. When only one zero is left, the second equation keeps it and moves on.",
    },
    {
      k: "quiz",
      q: "You're writing a rewriting function. Which checklist is right?",
      options: [
        "General patterns first, specific ones last, no catch-all needed",
        "Specific nested patterns first, a catch-all last, and only the rules the spec gives",
        "Any order, since Haskell picks the best match",
        "Always recurse into children, even if the spec says one step",
      ],
      answer: 1,
      why: "Haskell picks the first match, not the best, so specific shapes go first. The catch-all stops crashes. And the spec decides both the rules and whether it's one-step or the whole tree.",
    },
    {
      k: "read",
      body: md(
        "Summary:",
        "",
        "- A nested pattern like `Not (Not e)` matches a shape several levels deep.",
        "- Equations are tried top to bottom; the first match wins. Specific first, catch-all last.",
        "- One-step (2009 `simplify`): only look at the top. Recursive (2014 `simplify`, 2019 `toNNF`, 2018 `foldConst`): rewrite children first, then the top.",
        "- Use exactly the rules in the spec. Extra rules make answers differ from the expected tree.",
      ),
    },
  ],
};

const rewriteDrills: DrillSet = {
  id: "drill-rewrite",
  lesson: "rewrite",
  title: "Rewriting trees drills",
  drills: [
    {
      k: "quiz",
      q: "When `Not (Not e)` matches `Not (Not (And (Var \"p\") (Var \"q\")))`, what is `e`?",
      options: ["`Var \"p\"`", "`And (Var \"p\") (Var \"q\")`", "`Not (And (Var \"p\") (Var \"q\"))`", "`Var \"q\"`"],
      answer: 1,
      why: "`e` names whatever sits inside both `Not`s: the whole `And` expression.",
    },
    {
      k: "predict",
      expr: 'let f m = case m of { Just (Just c) -> [c]; _ -> "none" } in f (Just (Just \'x\'))',
      answer: '"x"',
      why: "The nested pattern matches, `c` is `'x'`, and `[c]` is the one-character string `\"x\"`.",
    },
    {
      k: "quiz",
      q: md(
        "What is `g (Not (Var \"a\"))`?",
        "",
        "```",
        "g (Not e)       = \"some not\"",
        "g (Not (Var v)) = \"not of a var\"",
        "g _             = \"other\"",
        "```",
      ),
      options: ['`"some not"`', '`"not of a var"`', '`"other"`', "A crash"],
      answer: 0,
      why: "The first equation matches any `Not`, so it wins. The second equation is unreachable; it should have been written first.",
    },
    {
      k: "predict",
      expr: "let f p = case p of { (0, _) -> 0; (n, Just m) -> n + m; _ -> -1 } in f (3, Just 4)",
      answer: "7",
      why: "The first pattern needs a 0, which fails. The second fits with `n = 3` and `m = 4`.",
    },
    {
      k: "write",
      setup: formulaSetup,
      body: "Write `isDoubleNot`, which is `True` exactly when the formula's top is a `Not` directly containing another `Not`.",
      starter: hs`isDoubleNot :: Formula -> Bool
isDoubleNot f = undefined
`,
      tests: [
        { expr: `isDoubleNot (Not (Not (Var "a")))`, expected: "True" },
        { expr: `isDoubleNot (Not (Var "a"))`, expected: "False" },
        { expr: `isDoubleNot (Var "a")`, expected: "False" },
        { expr: `isDoubleNot (And (Not (Not (Var "a"))) (Var "b"))`, expected: "False" },
        { expr: `isDoubleNot (Not (Not (Not (Var "a"))))`, expected: "True" },
      ],
      hint: "`isDoubleNot (Not (Not _)) = True`, then `isDoubleNot _ = False`.",
      solution: hs`isDoubleNot :: Formula -> Bool
isDoubleNot (Not (Not _)) = True
isDoubleNot _ = False
`,
    },
    {
      k: "predict",
      expr: "let { g (x : y : rest) | x == y = g (y : rest); g (x : rest) = x : g rest; g [] = [] } in g [1, 1, 2, 2, 2, 3]",
      answer: "[1, 2, 3]",
      why: "Whenever the first two elements are equal, one is dropped and `g` looks again. So each run of equal numbers shrinks to one.",
    },
    {
      k: "quiz",
      q: "A function has no equation that matches its input. What happens?",
      options: [
        "It returns the input unchanged",
        "It returns `undefined` silently",
        "It crashes at run time with \"Non-exhaustive patterns\"",
        "It never compiles",
      ],
      answer: 2,
      why: "It compiles (maybe with a warning), but crashes when that input actually arrives. Unchanged-input only happens if you write a catch-all yourself.",
    },
    {
      k: "predict",
      expr: "let f xs = case xs of { [Just a, _] -> a; [_, Just b] -> b * 10; _ -> 0 } in f [Nothing, Just 2]",
      answer: "20",
      why: "The first element is `Nothing`, so `[Just a, _]` fails. `[_, Just b]` fits with `b = 2`, giving 20.",
    },
    {
      k: "write",
      setup: hs`data Expr = Num Int | Neg Expr | Add Expr Expr
  deriving (Eq, Show)
`,
      body: md(
        "Write a one-step `simpNeg` (only the top, no recursion) with exactly these rules:",
        "",
        "```",
        "Neg (Num n)   becomes  Num (negate n)",
        "Neg (Neg e)   becomes  e",
        "anything else stays the same",
        "```",
      ),
      starter: hs`simpNeg :: Expr -> Expr
simpNeg e = undefined
`,
      tests: [
        { expr: "simpNeg (Neg (Num 3))", expected: "Num (-3)" },
        { expr: "simpNeg (Neg (Neg (Add (Num 1) (Num 2))))", expected: "Add (Num 1) (Num 2)" },
        { expr: "simpNeg (Neg (Add (Num 1) (Num 2)))", expected: "Neg (Add (Num 1) (Num 2))" },
        { expr: "simpNeg (Add (Neg (Num 1)) (Num 2))", expected: "Add (Neg (Num 1)) (Num 2)" },
        { expr: "simpNeg (Num 7)", expected: "Num 7" },
      ],
      hint: "Three equations: two nested patterns for the rules, then `simpNeg e = e`.",
      solution: hs`simpNeg :: Expr -> Expr
simpNeg (Neg (Num n)) = Num (negate n)
simpNeg (Neg (Neg e)) = e
simpNeg e = e
`,
    },
    {
      k: "quiz",
      q: "With the one-step 2009 `simplify`, what is `simplify (And (Not (Prim True)) (Prim True))`?",
      options: [
        "`Prim False`",
        "`And (Prim False) (Prim True)`",
        "`And (Not (Prim True)) (Prim True)`, unchanged",
        "`Prim True`",
      ],
      answer: 2,
      why: "At the top it's an `And`, but its left side is `Not ...`, not a `Prim`. So `And (Prim a) (Prim b)` doesn't match, and one-step never looks inside. Unchanged.",
    },
    {
      k: "predict",
      expr: "let f (a, (b, c)) = (a + b, c) in f (1, (2, 3))",
      answer: "(3, 3)",
      why: "The nested tuple pattern names `a = 1`, `b = 2`, `c = 3`. The result is `(1 + 2, 3)`.",
    },
    {
      k: "quiz",
      q: "In a bottom-up simplifier, why do you simplify the children before applying the rules at the top?",
      options: [
        "It's faster",
        "Simplifying the children can create a shape at the top that a rule matches, like `Not (Prim False)`",
        "Haskell requires it",
        "So the catch-all is never used",
      ],
      answer: 1,
      why: "In `Not (Not (Prim True))`, the top only becomes `Not (Prim False)` after its child is simplified. Checking the top first would miss that.",
    },
    {
      k: "write",
      setup: formulaSetup,
      body: "Write `removeDoubleNots`, which removes double `Not`s everywhere in the formula, not just at the top.",
      starter: hs`removeDoubleNots :: Formula -> Formula
removeDoubleNots f = undefined
`,
      tests: [
        { expr: `removeDoubleNots (Not (Not (Var "a")))`, expected: `Var "a"` },
        { expr: `removeDoubleNots (And (Not (Not (Var "a"))) (Var "b"))`, expected: `And (Var "a") (Var "b")` },
        { expr: `removeDoubleNots (Not (Not (Not (Var "a"))))`, expected: `Not (Var "a")` },
        { expr: `removeDoubleNots (Not (Or (Var "a") (Not (Not (Var "b")))))`, expected: `Not (Or (Var "a") (Var "b"))` },
        { expr: `removeDoubleNots (Var "z")`, expected: `Var "z"` },
      ],
      hint: "First equation: `removeDoubleNots (Not (Not f)) = removeDoubleNots f`. Then one equation each for `Not`, `And`, `Or` that rebuilds with the children done, then a catch-all.",
      solution: hs`removeDoubleNots :: Formula -> Formula
removeDoubleNots (Not (Not f)) = removeDoubleNots f
removeDoubleNots (Not f) = Not (removeDoubleNots f)
removeDoubleNots (And a b) = And (removeDoubleNots a) (removeDoubleNots b)
removeDoubleNots (Or a b) = Or (removeDoubleNots a) (removeDoubleNots b)
removeDoubleNots f = f
`,
    },
    {
      k: "predict",
      expr: 'let { s ("not" : "not" : r) = s r; s (w : r) = w : s r; s [] = [] } in s (words "not not not happy")',
      answer: '["not", "happy"]',
      why: "The first two `\"not\"`s cancel and are dropped. Then one `\"not\"` is left before `\"happy\"`, which doesn't match the first equation, so it's kept.",
    },
    {
      k: "quiz",
      q: "Which is De Morgan's law for pushing `Not` into an `And`?",
      options: [
        "`Not (And a b)` becomes `And (Not a) (Not b)`",
        "`Not (And a b)` becomes `Or (Not a) (Not b)`",
        "`Not (And a b)` becomes `Or a b`",
        "`Not (And a b)` becomes `Not a`",
      ],
      answer: 1,
      why: "\"Not (a and b)\" is true when at least one of them is false: (not a) or (not b). The operator flips from And to Or.",
    },
    {
      k: "predict",
      expr: "[not (a && b) == (not a || not b) | a <- [True, False], b <- [True, False]]",
      answer: "[True, True, True, True]",
      why: "De Morgan's law holds for every combination of `a` and `b`. That's why `toNNF` may use it.",
    },
    {
      k: "write",
      setup: formulaSetup,
      body: "Write `isNNF`, which checks whether a formula is in negation normal form: every `Not` sits directly on a `Var`.",
      starter: hs`isNNF :: Formula -> Bool
isNNF f = undefined
`,
      tests: [
        { expr: `isNNF (Not (Var "a"))`, expected: "True" },
        { expr: `isNNF (Not (Not (Var "a")))`, expected: "False" },
        { expr: `isNNF (And (Not (Var "a")) (Or (Var "b") (Not (Var "c"))))`, expected: "True" },
        { expr: `isNNF (Or (Var "a") (Not (And (Var "b") (Var "c"))))`, expected: "False" },
        { expr: `isNNF (Var "x")`, expected: "True" },
      ],
      hint: "`Not (Var _)` is fine, any other `Not` is not. `And` and `Or` are fine when both sides are: use `&&`.",
      solution: hs`isNNF :: Formula -> Bool
isNNF (Var _) = True
isNNF (Not (Var _)) = True
isNNF (Not _) = False
isNNF (And a b) = isNNF a && isNNF b
isNNF (Or a b) = isNNF a && isNNF b
`,
    },
    {
      k: "quiz",
      q: "A spec gives four simplification rules. You notice a fifth, mathematically correct one. What should you do?",
      options: [
        "Add it: correct rules can't hurt",
        "Leave it out: the tests expect exactly the trees the four given rules produce",
        "Add it, but only at the end",
        "Replace one of the given rules with it",
      ],
      answer: 1,
      why: "Tests compare trees with `==`. Any extra rewrite changes the shape of some answers, and those tests then fail, even though the maths is right.",
    },
    {
      k: "quiz",
      q: "Where must the catch-all `simplify e = e` go?",
      options: ["First, so it's checked quickly", "Anywhere", "Last, after every specific rule", "It must be left out in Haskell"],
      answer: 2,
      why: "Equations are tried in order. A catch-all first would match everything and the rules below it would never run.",
    },
    {
      k: "predict",
      expr: 'let f xs = case xs of { (a : b : _) | a > b -> "down"; (_ : _ : _) -> "up or flat"; _ -> "short" } in map f [[3, 1], [1, 3], [5]]',
      answer: '["down", "up or flat", "short"]',
      why: "`[3, 1]` passes the guard. `[1, 3]` fails the guard, so the next pattern catches it. `[5]` has fewer than two elements, so only `_` matches.",
    },
    {
      k: "write",
      setup: bexpSetup,
      body: md(
        "2009 exam task: write `restrict e i b`, which replaces every `IdRef i` in `e` with `Prim b`, and simplifies the whole result bottom-up using the one-step rules:",
        "",
        "```",
        "Not (Prim b)            becomes  Prim (not b)",
        "And (Prim a) (Prim b)   becomes  Prim (a && b)",
        "Or  (Prim a) (Prim b)   becomes  Prim (a || b)",
        "```",
        "",
        "Other `IdRef`s stay as they are. Write a helper for the one-step simplifier.",
      ),
      starter: hs`restrict :: BExp -> Int -> Bool -> BExp
restrict e i b = undefined
`,
      tests: [
        { expr: "restrict (IdRef 1) 1 True", expected: "Prim True" },
        { expr: "restrict (And (IdRef 1) (IdRef 2)) 1 False", expected: "And (Prim False) (IdRef 2)" },
        { expr: "restrict (Or (Not (IdRef 3)) (Prim False)) 3 False", expected: "Prim True" },
        { expr: "restrict (And (IdRef 1) (Not (IdRef 1))) 1 True", expected: "Prim False" },
        { expr: "restrict (Not (IdRef 2)) 5 True", expected: "Not (IdRef 2)" },
      ],
      hint: "Recurse into every constructor. For `IdRef j`, give `Prim b` if `j == i`. For `Not`, `And`, `Or`, rebuild with restricted children and pass the result to your one-step `simplify`.",
      solution: hs`simplify :: BExp -> BExp
simplify (Not (Prim b)) = Prim (not b)
simplify (And (Prim a) (Prim b)) = Prim (a && b)
simplify (Or (Prim a) (Prim b)) = Prim (a || b)
simplify e = e

restrict :: BExp -> Int -> Bool -> BExp
restrict (IdRef j) i b
  | j == i = Prim b
  | otherwise = IdRef j
restrict (Not e) i b = simplify (Not (restrict e i b))
restrict (And x y) i b = simplify (And (restrict x i b) (restrict y i b))
restrict (Or x y) i b = simplify (Or (restrict x i b) (restrict y i b))
restrict e _ _ = e
`,
    },
    {
      k: "write",
      setup: formulaSetup,
      body: md(
        "2019 exam task: `distribute a b` builds \"a or b\" but pushes the `Or` inside any `And`s, so the result is an `And` of `Or`s (conjunctive normal form). The rules, in this order:",
        "",
        "```",
        "distribute a (And b c)  =  And (distribute a b) (distribute a c)",
        "distribute (And a b) c  =  And (distribute a c) (distribute b c)",
        "distribute a b          =  Or a b",
        "```",
      ),
      starter: hs`distribute :: Formula -> Formula -> Formula
distribute a b = undefined
`,
      tests: [
        { expr: `distribute (Var "a") (Var "b")`, expected: `Or (Var "a") (Var "b")` },
        { expr: `distribute (Var "a") (And (Var "b") (Var "c"))`, expected: `And (Or (Var "a") (Var "b")) (Or (Var "a") (Var "c"))` },
        { expr: `distribute (And (Var "a") (Var "b")) (Var "c")`, expected: `And (Or (Var "a") (Var "c")) (Or (Var "b") (Var "c"))` },
        {
          expr: `distribute (And (Var "a") (Var "b")) (And (Var "c") (Var "d"))`,
          expected: `And (And (Or (Var "a") (Var "c")) (Or (Var "b") (Var "c"))) (And (Or (Var "a") (Var "d")) (Or (Var "b") (Var "d")))`,
        },
        { expr: `distribute (Not (Var "a")) (Or (Var "b") (Var "c"))`, expected: `Or (Not (Var "a")) (Or (Var "b") (Var "c"))` },
      ],
      hint: "Copy the three rules as three equations, in that order. The order decides the exact tree in the fourth test.",
      solution: hs`distribute :: Formula -> Formula -> Formula
distribute a (And b c) = And (distribute a b) (distribute a c)
distribute (And a b) c = And (distribute a c) (distribute b c)
distribute a b = Or a b
`,
    },
    {
      k: "write",
      setup: hs`data Exp = Const Int | Var String | Add Exp Exp | Mul Exp Exp | Phi Exp Exp
  deriving (Eq, Show)
`,
      body: md(
        "2018 exam style: `foldConst` with a `Phi` node. Fold bottom-up, applying ONLY these rules to the top after folding the children:",
        "",
        "```",
        "Add (Const x) (Const y)            becomes  Const (x + y)",
        "Mul (Const x) (Const y)            becomes  Const (x * y)",
        "Phi (Const x) (Const y), if x == y becomes  Const x",
        "```",
        "",
        "Nothing else changes: no rules about 0 or 1 here.",
      ),
      starter: hs`foldConst :: Exp -> Exp
foldConst e = undefined
`,
      tests: [
        { expr: "foldConst (Add (Const 1) (Mul (Const 2) (Const 3)))", expected: "Const 7" },
        { expr: "foldConst (Phi (Add (Const 1) (Const 1)) (Const 2))", expected: "Const 2" },
        { expr: "foldConst (Phi (Const 1) (Const 2))", expected: "Phi (Const 1) (Const 2)" },
        { expr: `foldConst (Add (Var "x") (Const 0))`, expected: `Add (Var "x") (Const 0)` },
        { expr: `foldConst (Mul (Phi (Var "a") (Var "a")) (Add (Const 2) (Const 2)))`, expected: `Mul (Phi (Var "a") (Var "a")) (Const 4)` },
      ],
      hint: "Use `case (foldConst a, foldConst b) of` for each binary constructor. For `Phi`, the rule needs a guard: `(Const x, Const y) | x == y -> Const x`.",
      solution: hs`foldConst :: Exp -> Exp
foldConst (Add a b) = case (foldConst a, foldConst b) of
  (Const x, Const y) -> Const (x + y)
  (a', b') -> Add a' b'
foldConst (Mul a b) = case (foldConst a, foldConst b) of
  (Const x, Const y) -> Const (x * y)
  (a', b') -> Mul a' b'
foldConst (Phi a b) = case (foldConst a, foldConst b) of
  (Const x, Const y) | x == y -> Const x
  (a', b') -> Phi a' b'
foldConst e = e
`,
    },
    {
      k: "write",
      setup: reSetup,
      body: "2014 exam task, from memory: write `simplify`, which replaces every `Plus r` with `Seq r (Rep r)` and every `Opt r` with `Alt r Null`, at every depth.",
      starter: hs`simplify :: RE -> RE
simplify r = undefined
`,
      tests: [
        { expr: "simplify (Alt (Plus (Term 'a')) (Term 'b'))", expected: "Alt (Seq (Term 'a') (Rep (Term 'a'))) (Term 'b')" },
        { expr: "simplify (Opt (Opt (Term 'a')))", expected: "Alt (Alt (Term 'a') Null) Null" },
        { expr: "simplify (Rep (Plus Null))", expected: "Rep (Seq Null (Rep Null))" },
        { expr: "simplify (Seq (Term 'a') (Term 'b'))", expected: "Seq (Term 'a') (Term 'b')" },
        { expr: "simplify (Term 'z')", expected: "Term 'z'" },
      ],
      hint: "Rebuild `Seq`, `Alt`, `Rep` with simplified children. For `Plus r` and `Opt r`, simplify `r` first, then build the replacement.",
      solution: hs`simplify :: RE -> RE
simplify (Seq a b) = Seq (simplify a) (simplify b)
simplify (Alt a b) = Alt (simplify a) (simplify b)
simplify (Rep r) = Rep (simplify r)
simplify (Plus r) = Seq r' (Rep r')
  where
    r' = simplify r
simplify (Opt r) = Alt (simplify r) Null
simplify r = r
`,
    },
    {
      k: "write",
      setup: hs`data Formula = Var String | Not Formula | And Formula Formula | Or Formula Formula
  deriving (Eq, Show)

toNNF :: Formula -> Formula
toNNF (Not (Not f)) = toNNF f
toNNF (Not (And a b)) = Or (toNNF (Not a)) (toNNF (Not b))
toNNF (Not (Or a b)) = And (toNNF (Not a)) (toNNF (Not b))
toNNF (And a b) = And (toNNF a) (toNNF b)
toNNF (Or a b) = Or (toNNF a) (toNNF b)
toNNF f = f

distribute :: Formula -> Formula -> Formula
distribute a (And b c) = And (distribute a b) (distribute a c)
distribute (And a b) c = And (distribute a c) (distribute b c)
distribute a b = Or a b
`,
      body: md(
        "2019 exam task: write `toCNF`. The setup gives `toNNF` and `distribute`. First turn the formula into NNF, then convert it with a helper `toCNF'`:",
        "",
        "```",
        "toCNF' (And a b)  =  And (toCNF' a) (toCNF' b)",
        "toCNF' (Or a b)   =  distribute (toCNF' a) (toCNF' b)",
        "toCNF' f          =  f",
        "```",
      ),
      starter: hs`toCNF :: Formula -> Formula
toCNF f = undefined
`,
      tests: [
        { expr: `toCNF (Var "a")`, expected: `Var "a"` },
        { expr: `toCNF (Or (Var "a") (And (Var "b") (Var "c")))`, expected: `And (Or (Var "a") (Var "b")) (Or (Var "a") (Var "c"))` },
        { expr: `toCNF (Not (And (Var "a") (Var "b")))`, expected: `Or (Not (Var "a")) (Not (Var "b"))` },
        {
          expr: `toCNF (Not (Or (Var "a") (Not (Or (Var "b") (Var "c")))))`,
          expected: `And (Not (Var "a")) (Or (Var "b") (Var "c"))`,
        },
        { expr: `toCNF (Or (Not (Or (Var "p") (Var "q"))) (Var "r"))`, expected: `And (Or (Not (Var "p")) (Var "r")) (Or (Not (Var "q")) (Var "r"))` },
      ],
      hint: "`toCNF f = toCNF' (toNNF f)`, and write `toCNF'` with the three equations above (in a `where` or as a separate function).",
      solution: hs`toCNF :: Formula -> Formula
toCNF f = toCNF' (toNNF f)

toCNF' :: Formula -> Formula
toCNF' (And a b) = And (toCNF' a) (toCNF' b)
toCNF' (Or a b) = distribute (toCNF' a) (toCNF' b)
toCNF' f = f
`,
    },
  ],
};

const labelSetup = hs`data Tree = Leaf | Node Tree Tree
  deriving (Eq, Show)

data LTree = LLeaf Int | LNode LTree LTree
  deriving (Eq, Show)
`;

const labelGivenSetup = hs`data Tree = Leaf | Node Tree Tree
  deriving (Eq, Show)

data LTree = LLeaf Int | LNode LTree LTree
  deriving (Eq, Show)

label :: Tree -> Int -> (LTree, Int)
label Leaf n = (LLeaf n, n + 1)
label (Node l r) n = (LNode l' r', n2)
  where
    (l', n1) = label l n
    (r', n2) = label r n1
`;

const readNumberSetup = hs`import Data.Char (isDigit)

readNumber :: String -> (Int, String)
readNumber s = (read ds, rest)
  where
    (ds, rest) = span isDigit s
`;

const threading: Lesson = {
  id: "threading",
  title: "Returning tuples and threading state",
  blurb: "Give back a result and what's left over, pass counters along, and build several answers in one pass.",
  steps: [
    {
      k: "read",
      body: md(
        "A function can only return one value, but that value can be a tuple. Exam functions very often return a pair: the answer, plus something else the caller needs next.",
        "",
        "The most common \"something else\" is the rest of the input. You've seen this already in the Prelude:",
        "",
        "```",
        "span    :: (a -> Bool) -> [a] -> ([a], [a])   -- longest front part that passes, and the rest",
        "break   :: (a -> Bool) -> [a] -> ([a], [a])   -- front part up to the first that passes, and the rest",
        "splitAt :: Int -> [a] -> ([a], [a])            -- first n elements, and the rest",
        "```",
      ),
    },
    { k: "try", code: 'span isDigit "123abc"', after: "The digits at the front, and everything after them." },
    {
      k: "predict",
      expr: 'break (== \' \') "hello world"',
      answer: '("hello", " world")',
      why: "`break` stops at the first element that passes the test. The space itself starts the second part.",
    },
    {
      k: "read",
      body: md(
        "To use both parts of a pair, name them with a pattern in a `where`:",
        "",
        "```",
        "readNumber :: String -> (Int, String)",
        "readNumber s = (read ds, rest)",
        "  where",
        "    (ds, rest) = span isDigit s",
        "```",
        "",
        "`(ds, rest) = span isDigit s` runs `span` once and names both halves. `readNumber \"42+x\"` is `(42, \"+x\")`: the number it read, and the input it didn't use yet. A function like this, which eats some input and hands back the rest, is the shape of every parser.",
      ),
    },
    {
      k: "write",
      setup: hs`import Data.Char (isAlpha)
`,
      body: "Write `readWord`, which splits off the letters at the front of a string, and also returns how many letters it took. So `readWord \"abc12\"` is `((\"abc\", 3), \"12\")`.",
      starter: hs`readWord :: String -> ((String, Int), String)
readWord s = undefined
`,
      tests: [
        { expr: 'readWord "abc12"', expected: '(("abc", 3), "12")' },
        { expr: 'readWord "hi there"', expected: '(("hi", 2), " there")' },
        { expr: 'readWord "99"', expected: '(("", 0), "99")' },
        { expr: 'readWord ""', expected: '(("", 0), "")' },
        { expr: 'readWord "word"', expected: '(("word", 4), "")' },
      ],
      hint: "`where (w, rest) = span isAlpha s`, then the answer is `((w, length w), rest)`.",
      solution: hs`readWord :: String -> ((String, Int), String)
readWord s = ((w, length w), rest)
  where
    (w, rest) = span isAlpha s
`,
    },
    {
      k: "quiz",
      q: "What is `fst (span even [2, 4, 5, 6])`?",
      options: ["`[2, 4, 6]`", "`[2, 4]`", "`[5, 6]`", "`[2]`"],
      answer: 1,
      why: "`span` stops at the first element that fails, here 5. So the front part is `[2, 4]`. The 6 is in the rest even though it's even. `filter` would give `[2, 4, 6]`.",
    },
    {
      k: "read",
      body: md(
        "The real power is chaining: feed the rest from one call into the next call.",
        "",
        "```",
        "readSum :: String -> (Int, String)       -- reads \"12+30...\"",
        "readSum s = (a + b, s2)",
        "  where",
        "    (a, s1)  = readNumber s              -- s1 starts with '+'",
        "    (b, s2)  = readNumber (drop 1 s1)    -- skip the '+'",
        "```",
        "",
        "Name each leftover (`s1`, `s2`, ...) and use it exactly once, in the next step. That's called threading: the leftover input is passed along like a thread through each step.",
      ),
    },
    {
      k: "write",
      setup: readNumberSetup,
      body: "The setup gives `readNumber`. Write `readPair`, which reads two numbers separated by one comma, and returns them with the leftover input. `readPair \"12,345xyz\"` is `((12, 345), \"xyz\")`.",
      starter: hs`readPair :: String -> ((Int, Int), String)
readPair s = undefined
`,
      tests: [
        { expr: 'readPair "12,345xyz"', expected: '((12, 345), "xyz")' },
        { expr: 'readPair "1,2"', expected: '((1, 2), "")' },
        { expr: 'readPair "7,0,9"', expected: '((7, 0), ",9")' },
        { expr: 'readPair "100,20 end"', expected: '((100, 20), " end")' },
      ],
      hint: "`(a, s1) = readNumber s`, then `(b, s2) = readNumber (drop 1 s1)`. The answer is `((a, b), s2)`.",
      solution: hs`readPair :: String -> ((Int, Int), String)
readPair s = ((a, b), s2)
  where
    (a, s1) = readNumber s
    (b, s2) = readNumber (drop 1 s1)
`,
    },
    {
      k: "predict",
      expr: "let { (a, r1) = splitAt 2 [1, 2, 3, 4, 5]; (b, r2) = splitAt 1 r1 } in (a, b, r2)",
      answer: "([1, 2], [3], [4, 5])",
      why: "The first `splitAt` takes `[1, 2]` and leaves `[3, 4, 5]`. The second works on that leftover: it takes `[3]` and leaves `[4, 5]`.",
    },
    {
      k: "read",
      body: md(
        "The \"something else\" can also be a counter. Suppose you must give every leaf of a tree a different number, left to right:",
        "",
        "```",
        "data Tree  = Leaf | Node Tree Tree",
        "data LTree = LLeaf Int | LNode LTree LTree",
        "```",
        "",
        "The function takes the next free number `n`, and returns the labelled tree together with the new next free number:",
        "",
        "```",
        "label :: Tree -> Int -> (LTree, Int)",
        "label Leaf n = (LLeaf n, n + 1)          -- use n; n + 1 is now free",
        "label (Node l r) n = (LNode l' r', n2)",
        "  where",
        "    (l', n1) = label l n                 -- left side starts at n",
        "    (r', n2) = label r n1                -- right side starts where the left stopped",
        "```",
        "",
        "This is exactly the shape of 2014's `make`, where fresh state numbers are handed out while building a machine: `(ts1, k1) = make ... k`, then `make ... k1`.",
      ),
    },
    {
      k: "quiz",
      q: "In `label (Node l r) n`, which number should the right subtree start from?",
      options: ["`n`", "`n + 1`", "`n1`, the number handed back by labelling the left subtree", "`n2`"],
      answer: 2,
      why: "The left subtree may use many numbers, not just one. Only `label l n` knows how many, and it tells you by returning `n1`. `n + 1` only works if the left side is a single leaf.",
    },
    {
      k: "write",
      setup: labelSetup,
      body: "Write `label` as described above. Then `label (Node Leaf (Node Leaf Leaf)) 0` is `(LNode (LLeaf 0) (LNode (LLeaf 1) (LLeaf 2)), 3)`.",
      starter: hs`label :: Tree -> Int -> (LTree, Int)
label t n = undefined
`,
      tests: [
        { expr: "label Leaf 5", expected: "(LLeaf 5, 6)" },
        { expr: "label (Node Leaf (Node Leaf Leaf)) 0", expected: "(LNode (LLeaf 0) (LNode (LLeaf 1) (LLeaf 2)), 3)" },
        { expr: "label (Node (Node Leaf Leaf) Leaf) 10", expected: "(LNode (LNode (LLeaf 10) (LLeaf 11)) (LLeaf 12), 13)" },
        {
          expr: "label (Node (Node Leaf Leaf) (Node Leaf Leaf)) 1",
          expected: "(LNode (LNode (LLeaf 1) (LLeaf 2)) (LNode (LLeaf 3) (LLeaf 4)), 5)",
        },
      ],
      hint: "Two equations. In the `Node` case, `where (l', n1) = label l n` and `(r', n2) = label r n1`.",
      solution: hs`label :: Tree -> Int -> (LTree, Int)
label Leaf n = (LLeaf n, n + 1)
label (Node l r) n = (LNode l' r', n2)
  where
    (l', n1) = label l n
    (r', n2) = label r n1
`,
    },
    {
      k: "quiz",
      q: md(
        "What goes wrong with this version?",
        "",
        "```",
        "label (Node l r) n = (LNode l' r', n2)",
        "  where",
        "    (l', n1) = label l n",
        "    (r', n2) = label r n",
        "```",
      ),
      options: [
        "Nothing, it's the same",
        "It doesn't compile: `n1` is unused",
        "Both sides start from `n`, so the left and right leaves get the same numbers",
        "It loops forever",
      ],
      answer: 2,
      why: "It compiles (an unused name is only a warning), but both subtrees count from `n`. Fresh numbers stop being unique, which is exactly what a counter is supposed to prevent.",
    },
    {
      k: "read",
      body: md(
        "Not every numbering needs a thread. In 2009, BDD nodes are numbered by position: the root is node `n`, its two children are `2 * n` and `2 * n + 1`. Each child's number can be worked out from its parent's, so you just pass the right number down:",
        "",
        "```",
        "buildBDD' e n (x : xs) = (n, (x, 2 * n, 2 * n + 1))",
        "                         : buildBDD' (restrict e x False) (2 * n) xs",
        "                        ++ buildBDD' (restrict e x True) (2 * n + 1) xs",
        "```",
        "",
        "Ask yourself: can a child's number be computed from the parent's alone? Then pass it down (2009). Does it depend on how much the left side used? Then thread it and return it (2014).",
      ),
    },
    {
      k: "write",
      setup: labelSetup,
      body: md(
        "Write `nodeIds n t`, listing the numbers of all the `Node`s in `t` (not the leaves), where the top node is numbered `n` and a node numbered `k` has children numbered `2 * k` and `2 * k + 1`. List a node before its left subtree, then its right subtree.",
        "",
        "`nodeIds 1 (Node (Node Leaf Leaf) Leaf)` is `[1, 2]`.",
      ),
      starter: hs`nodeIds :: Int -> Tree -> [Int]
nodeIds n t = undefined
`,
      tests: [
        { expr: "nodeIds 1 Leaf", expected: "[]" },
        { expr: "nodeIds 1 (Node (Node Leaf Leaf) Leaf)", expected: "[1, 2]" },
        { expr: "nodeIds 1 (Node Leaf (Node Leaf Leaf))", expected: "[1, 3]" },
        { expr: "nodeIds 1 (Node (Node Leaf Leaf) (Node (Node Leaf Leaf) Leaf))", expected: "[1, 2, 3, 6]" },
        { expr: "nodeIds 5 (Node Leaf Leaf)", expected: "[5]" },
      ],
      hint: "`nodeIds n (Node l r) = n : nodeIds (2 * n) l ++ nodeIds (2 * n + 1) r`, and leaves give `[]`. No pair needed.",
      solution: hs`nodeIds :: Int -> Tree -> [Int]
nodeIds _ Leaf = []
nodeIds n (Node l r) = n : nodeIds (2 * n) l ++ nodeIds (2 * n + 1) r
`,
    },
    {
      k: "predict",
      expr: "let go n d = if d == 0 then [n] else go (2 * n) (d - 1) ++ go (2 * n + 1) (d - 1) in go 1 2",
      answer: "[4, 5, 6, 7]",
      why: "From 1, depth 2: the children are 2 and 3, and their children are 4, 5 and 6, 7. At depth 0 each number is listed.",
    },
    {
      k: "read",
      body: md(
        "A close relative is the accumulating parameter: an extra input that carries the answer built so far. Here's `reverse` with one:",
        "",
        "```",
        "rev :: [a] -> [a]",
        "rev xs = go xs []",
        "  where",
        "    go [] acc       = acc",
        "    go (y : ys) acc = go ys (y : acc)",
        "```",
        "",
        "Each element is moved onto the front of `acc`, so the first one ends up last. When the input is empty, `acc` is the answer. The helper is usually called `go`, and the outer function starts it with the empty answer.",
      ),
    },
    {
      k: "predict",
      expr: "let { go [] acc = acc; go (x : xs) acc = go xs (acc + x) } in go [1, 2, 3] 10",
      answer: "16",
      why: "The accumulator starts at 10 and each element is added: 11, 13, 16. At the end the accumulator is the answer.",
    },
    {
      k: "write",
      body: "Write `myReverse` using an accumulating helper `go`. Don't use `reverse`.",
      starter: hs`myReverse :: [a] -> [a]
myReverse xs = undefined
`,
      tests: [
        { expr: "myReverse [1, 2, 3 :: Int]", expected: "[3, 2, 1]" },
        { expr: 'myReverse "abc"', expected: '"cba"' },
        { expr: "myReverse ([] :: [Int])", expected: "[]" },
        { expr: "myReverse [True]", expected: "[True]" },
      ],
      banned: ["reverse"],
      hint: "`myReverse xs = go xs []` with `go [] acc = acc` and `go (y : ys) acc = go ys (y : acc)`.",
      solution: hs`myReverse :: [a] -> [a]
myReverse xs = go xs []
  where
    go [] acc = acc
    go (y : ys) acc = go ys (y : acc)
`,
    },
    {
      k: "write",
      body: "Write `runningTotals`, which gives the total so far at each position: `runningTotals [1, 2, 3]` is `[1, 3, 6]`. Use a helper that carries the total so far. Don't use `scanl`.",
      starter: hs`runningTotals :: [Int] -> [Int]
runningTotals xs = undefined
`,
      tests: [
        { expr: "runningTotals [1, 2, 3]", expected: "[1, 3, 6]" },
        { expr: "runningTotals []", expected: "[]" },
        { expr: "runningTotals [5]", expected: "[5]" },
        { expr: "runningTotals [3, -3, 10, 0]", expected: "[3, 0, 10, 10]" },
      ],
      banned: ["scanl", "scanl1"],
      hint: "`go [] _ = []` and `go (y : ys) t = (t + y) : go ys (t + y)`. Start with `go xs 0`.",
      solution: hs`runningTotals :: [Int] -> [Int]
runningTotals xs = go xs 0
  where
    go [] _ = []
    go (y : ys) t = (t + y) : go ys (t + y)
`,
    },
    {
      k: "read",
      body: md(
        "Tuples can have three parts too. To split a list into three groups in one pass (2010 has this shape), the recursion returns a triple, and each step adds the element to one of the three:",
        "",
        "```",
        "split3 :: Int -> [Int] -> ([Int], [Int], [Int])",
        "split3 _ [] = ([], [], [])",
        "split3 p (x : xs)",
        "  | x < p     = (x : ls, es, gs)",
        "  | x == p    = (ls, x : es, gs)",
        "  | otherwise = (ls, es, x : gs)",
        "  where",
        "    (ls, es, gs) = split3 p xs",
        "```",
        "",
        "The recursive call splits the rest; you then put `x` in the right group. One `where` line names all three results.",
      ),
    },
    {
      k: "quiz",
      q: "What is the base case of a recursion that returns three lists?",
      options: ["`[]`", "`([], [])`", "`([], [], [])`", "`[[], [], []]`"],
      answer: 2,
      why: "The result type is a triple of lists, so even the empty input must give a triple: three empty lists. `[[], [], []]` is a list, a different type.",
    },
    {
      k: "write",
      body: "Write `split3` from above, splitting a list into the elements less than, equal to, and greater than `p`, keeping their order.",
      starter: hs`split3 :: Int -> [Int] -> ([Int], [Int], [Int])
split3 p xs = undefined
`,
      tests: [
        { expr: "split3 5 [7, 5, 1, 9, 5, 3]", expected: "([1, 3], [5, 5], [7, 9])" },
        { expr: "split3 0 []", expected: "([], [], [])" },
        { expr: "split3 2 [2]", expected: "([], [2], [])" },
        { expr: "split3 10 [1, 2, 3]", expected: "([1, 2, 3], [], [])" },
      ],
      hint: "Base case `([], [], [])`. Then guards decide which of the three lists `x` goes on, with `where (ls, es, gs) = split3 p xs`.",
      solution: hs`split3 :: Int -> [Int] -> ([Int], [Int], [Int])
split3 _ [] = ([], [], [])
split3 p (x : xs)
  | x < p = (x : ls, es, gs)
  | x == p = (ls, x : es, gs)
  | otherwise = (ls, es, x : gs)
  where
    (ls, es, gs) = split3 p xs
`,
    },
    {
      k: "read",
      body: md(
        "Finally, when a `map` gives you a list of pairs, `unzip` splits it into a pair of lists. `unzip3` does the same for triples.",
        "",
        "```",
        "unzip  :: [(a, b)] -> ([a], [b])",
        "unzip3 :: [(a, b, c)] -> ([a], [b], [c])",
        "```",
        "",
        "And `zip` goes the other way, pairing up two lists.",
      ),
    },
    { k: "try", code: "unzip [(1, 'a'), (2, 'b'), (3, 'c')]" },
    {
      k: "predict",
      expr: "unzip3 [(1, 'a', True), (2, 'b', False)]",
      answer: "([1, 2], \"ab\", [True, False])",
      why: "The first parts make `[1, 2]`, the second parts make `['a', 'b']`, which shows as `\"ab\"`, and the third parts make `[True, False]`.",
    },
    {
      k: "write",
      setup: labelGivenSetup,
      body: md(
        "The setup gives `label`. Write `labelAll`, which labels a whole list of trees with one shared counter, so no two leaves anywhere get the same number. Return the labelled trees and the final next free number.",
        "",
        "`labelAll [Leaf, Node Leaf Leaf] 0` is `([LLeaf 0, LNode (LLeaf 1) (LLeaf 2)], 3)`.",
      ),
      starter: hs`labelAll :: [Tree] -> Int -> ([LTree], Int)
labelAll ts n = undefined
`,
      tests: [
        { expr: "labelAll [] 4", expected: "([], 4)" },
        { expr: "labelAll [Leaf, Node Leaf Leaf] 0", expected: "([LLeaf 0, LNode (LLeaf 1) (LLeaf 2)], 3)" },
        { expr: "labelAll [Leaf, Leaf, Leaf] 7", expected: "([LLeaf 7, LLeaf 8, LLeaf 9], 10)" },
        { expr: "labelAll [Node Leaf Leaf, Leaf] 1", expected: "([LNode (LLeaf 1) (LLeaf 2), LLeaf 3], 4)" },
      ],
      hint: "Recursion on the list. For `t : ts`: `(t', n1) = label t n`, then `(ts', n2) = labelAll ts n1`, and return `(t' : ts', n2)`.",
      solution: hs`labelAll :: [Tree] -> Int -> ([LTree], Int)
labelAll [] n = ([], n)
labelAll (t : ts) n = (t' : ts', n2)
  where
    (t', n1) = label t n
    (ts', n2) = labelAll ts n1
`,
    },
    {
      k: "quiz",
      q: "You call `(a, k1) = f x k`, then `(b, k2) = g y k1`. What should your function return as the new counter?",
      options: ["`k`", "`k1`", "`k2`", "`k1 + k2`"],
      answer: 2,
      why: "`k2` is the last value handed back, so it already accounts for everything both calls used. Returning `k1` would let a later caller reuse numbers that `g` took.",
    },
    {
      k: "read",
      body: md(
        "Summary:",
        "",
        "- Return a tuple when the caller needs two things: the answer and the leftover input, or the answer and a new counter.",
        "- `where (a, s1) = f s` names both parts. Thread `s1` (or `k1`) into the next call, and return the last one.",
        "- If a child's number follows from the parent's (2009's `2n` and `2n + 1`), just pass it down.",
        "- Accumulating helpers `go xs acc` carry the answer so far. Triples work like pairs; base case `([], [], [])`.",
      ),
    },
  ],
};

const threadingDrills: DrillSet = {
  id: "drill-threading",
  lesson: "threading",
  title: "Tuples and threading drills",
  drills: [
    {
      k: "predict",
      expr: "span (< 3) [1, 2, 3, 1]",
      answer: "([1, 2], [3, 1])",
      why: "`span` stops at the first element that fails, the 3. The 1 after it stays in the rest.",
    },
    {
      k: "quiz",
      q: "A function has type `parseInt :: String -> (Int, String)`. What is the `String` in the result most likely to be?",
      options: ["The whole input again", "The input that wasn't used yet", "An error message", "The number as text"],
      answer: 1,
      why: "That's the standard parser shape: the value it read, and the rest of the input for the next step to carry on from.",
    },
    {
      k: "predict",
      expr: 'splitAt 3 "haskell"',
      answer: '("has", "kell")',
      why: "The first 3 characters, and the rest.",
    },
    {
      k: "quiz",
      q: "In `where (a, b) = quotRem 17 5`, what are `a` and `b`?",
      options: ["`a = 3`, `b = 2`", "`a = 2`, `b = 3`", "`a = 17`, `b = 5`", "It's an error: `where` can't bind two names"],
      answer: 0,
      why: "`quotRem` returns the quotient and remainder as a pair, `(3, 2)`, and the pattern `(a, b)` names both parts.",
    },
    {
      k: "write",
      setup: hs`import Data.Char (isUpper)
`,
      body: "Write `takeCaps`, which splits off the capital letters at the start of a string. `takeCaps \"ABcD\"` is `(\"AB\", \"cD\")`.",
      starter: hs`takeCaps :: String -> (String, String)
takeCaps s = undefined
`,
      tests: [
        { expr: 'takeCaps "ABcD"', expected: '("AB", "cD")' },
        { expr: 'takeCaps "abc"', expected: '("", "abc")' },
        { expr: 'takeCaps ""', expected: '("", "")' },
        { expr: 'takeCaps "XYZ"', expected: '("XYZ", "")' },
      ],
      hint: "`span isUpper s` already returns exactly this pair.",
      solution: hs`takeCaps :: String -> (String, String)
takeCaps s = span isUpper s
`,
    },
    {
      k: "predict",
      expr: "let (xs, ys) = break (> 3) [1, 5, 2] in ys ++ xs",
      answer: "[5, 2, 1]",
      why: "`break (> 3)` splits before the 5: `xs = [1]`, `ys = [5, 2]`. Then `ys ++ xs` is `[5, 2, 1]`.",
    },
    {
      k: "predict",
      expr: 'let { go [] acc = acc; go (x : xs) acc = go xs (x : acc) } in go "abc" ""',
      answer: '"cba"',
      why: "Each character moves onto the front of the accumulator: `\"a\"`, `\"ba\"`, `\"cba\"`.",
    },
    {
      k: "quiz",
      q: "You count matching elements with an accumulating helper `go xs acc`. What should the outer call start `acc` at?",
      options: ["`1`", "`0`", "`[]`", "`length xs`"],
      answer: 1,
      why: "Before looking at any element, the count is 0. The starting accumulator is always the answer for an empty input.",
    },
    {
      k: "write",
      body: "Write `sumAcc`, adding up a list using a helper with an accumulator. Don't use `sum` or any fold.",
      starter: hs`sumAcc :: [Int] -> Int
sumAcc xs = undefined
`,
      tests: [
        { expr: "sumAcc [1, 2, 3]", expected: "6" },
        { expr: "sumAcc []", expected: "0" },
        { expr: "sumAcc [-4, 4, 10]", expected: "10" },
        { expr: "sumAcc [7]", expected: "7" },
      ],
      banned: ["sum", "foldr", "foldl", "foldl'"],
      hint: "`sumAcc xs = go xs 0`, with `go [] acc = acc` and `go (y : ys) acc = go ys (acc + y)`.",
      solution: hs`sumAcc :: [Int] -> Int
sumAcc xs = go xs 0
  where
    go [] acc = acc
    go (y : ys) acc = go ys (acc + y)
`,
    },
    {
      k: "predict",
      expr: "let { f [] n = ([], n); f (x : xs) n = let (ys, m) = f xs (n + 1) in ((n, x) : ys, m) } in f \"ab\" 0",
      answer: "([(0, 'a'), (1, 'b')], 2)",
      why: "`'a'` gets 0, then the rest is numbered from 1: `'b'` gets 1, and the empty list hands back 2 as the next free number.",
    },
    {
      k: "quiz",
      q: "When labelling a `Node l r` with a counter, why must the right subtree start from the number returned by the left subtree?",
      options: [
        "Because Haskell evaluates left first",
        "Because only the left call knows how many numbers it used",
        "It doesn't matter which number it starts from",
        "So that the function is tail recursive",
      ],
      answer: 1,
      why: "The left subtree could have one leaf or a hundred. The number it returns tells you where it stopped, so the right side carries on from there and nothing is reused.",
    },
    {
      k: "predict",
      expr: "unzip [(1, 'x'), (2, 'y')]",
      answer: "([1, 2], \"xy\")",
      why: "The first parts make `[1, 2]`; the second parts make `['x', 'y']`, which is the string `\"xy\"`.",
    },
    {
      k: "write",
      body: "Write `numberFrom n xs`, which pairs each element with a number counting up from `n`, and also returns the next unused number. `numberFrom 0 \"ab\"` is `([(0, 'a'), (1, 'b')], 2)`.",
      starter: hs`numberFrom :: Int -> [a] -> ([(Int, a)], Int)
numberFrom n xs = undefined
`,
      tests: [
        { expr: 'numberFrom 0 "ab"', expected: "([(0, 'a'), (1, 'b')], 2)" },
        { expr: 'numberFrom 5 ""', expected: "([], 5)" },
        { expr: "numberFrom 1 [True, False, True]", expected: "([(1, True), (2, False), (3, True)], 4)" },
        { expr: 'numberFrom 9 "z"', expected: "([(9, 'z')], 10)" },
      ],
      hint: "Base case `numberFrom n [] = ([], n)`. Otherwise `(rest, m) = numberFrom (n + 1) xs` and return `((n, x) : rest, m)`.",
      solution: hs`numberFrom :: Int -> [a] -> ([(Int, a)], Int)
numberFrom n [] = ([], n)
numberFrom n (x : xs) = ((n, x) : rest, m)
  where
    (rest, m) = numberFrom (n + 1) xs
`,
    },
    {
      k: "quiz",
      q: "In 2009's BDD numbering, a node has id `n` and its children are `2 * n` and `2 * n + 1`. What are the children of node 3?",
      options: ["4 and 5", "6 and 7", "3 and 4", "5 and 6"],
      answer: 1,
      why: "`2 * 3 = 6` and `2 * 3 + 1 = 7`. Every node's children get unique ids without any counter being passed around.",
    },
    {
      k: "predict",
      expr: "foldl (\\(s, c) x -> (s + x, c + 1)) (0, 0) [4, 5, 6]",
      answer: "(15, 3)",
      why: "The accumulator is a pair: a running sum and a running count. After all three elements it is `(4 + 5 + 6, 3)`.",
    },
    {
      k: "quiz",
      q: "A recursive function returns `([Int], [Int], [Int])`. What does `where (as, bs, cs) = f xs` do?",
      options: [
        "Calls `f` three times",
        "Calls `f xs` once and names the three parts of its result",
        "Makes three copies of `xs`",
        "It's a type error",
      ],
      answer: 1,
      why: "A tuple pattern in `where` runs the call once and gives a name to each part. You then build your result from those names.",
    },
    {
      k: "write",
      body: "Write `evensOdds`, which splits a list into its even and odd elements, keeping their order, in one recursive pass. Don't use `filter` or `partition`.",
      starter: hs`evensOdds :: [Int] -> ([Int], [Int])
evensOdds xs = undefined
`,
      tests: [
        { expr: "evensOdds [1, 2, 3, 4, 6]", expected: "([2, 4, 6], [1, 3])" },
        { expr: "evensOdds []", expected: "([], [])" },
        { expr: "evensOdds [7]", expected: "([], [7])" },
        { expr: "evensOdds [0, -2, -3]", expected: "([0, -2], [-3])" },
      ],
      banned: ["filter", "partition"],
      hint: "Base case `([], [])`. Then `where (es, os) = evensOdds rest`, and put `x` on the front of whichever list it belongs to.",
      solution: hs`evensOdds :: [Int] -> ([Int], [Int])
evensOdds [] = ([], [])
evensOdds (x : rest)
  | even x = (x : es, os)
  | otherwise = (es, x : os)
  where
    (es, os) = evensOdds rest
`,
    },
    {
      k: "predict",
      expr: "let (a, _, c) = unzip3 [(1, 'p', True), (2, 'q', False)] in (sum a, c)",
      answer: "(3, [True, False])",
      why: "`unzip3` gives `([1, 2], \"pq\", [True, False])`. The pattern ignores the middle one with `_`.",
    },
    {
      k: "quiz",
      q: "Why does `label :: Tree -> Int -> (LTree, Int)` return an `Int` as well as the tree?",
      options: [
        "To report how deep the tree is",
        "So whoever called it knows the next free number and can carry on without reusing any",
        "Haskell functions must return a pair",
        "To count the nodes for the tests",
      ],
      answer: 1,
      why: "A function can't change a variable outside itself. The only way to pass the updated counter on is to return it.",
    },
    {
      k: "predict",
      expr: "let { go [] _ = []; go (x : xs) t = (t + x) : go xs (t + x) } in go [5, 1, 4] 0",
      answer: "[5, 6, 10]",
      why: "A running total: 0 + 5 = 5, 5 + 1 = 6, 6 + 4 = 10. Each total is output and passed on.",
    },
    {
      k: "write",
      setup: hs`data RE = Null | Term Char | Seq RE RE | Alt RE RE
  deriving (Eq, Show)

data Label = C Char | Eps
  deriving (Eq, Show)

type Transition = (Int, Int, Label)
`,
      body: md(
        "2014 exam task (simplified `make`): build the transitions of a machine that goes from state `m` to state `n` matching `re`. `k` is the next free state number; return the transitions and the new next free number.",
        "",
        "```",
        "Null:      one transition (m, n, Eps), k unchanged",
        "Term c:    one transition (m, n, C c), k unchanged",
        "Seq r1 r2: use k as a new middle state: r1 goes m to k (with k + 1 free),",
        "           then r2 goes k to n, continuing from what r1 returned",
        "Alt r1 r2: r1 goes m to n from k, then r2 goes m to n continuing from what r1 returned",
        "```",
        "",
        "Join transition lists with `++`, first part first.",
      ),
      starter: hs`make :: RE -> Int -> Int -> Int -> ([Transition], Int)
make re m n k = undefined
`,
      tests: [
        { expr: "make (Term 'a') 1 2 3", expected: "([(1, 2, C 'a')], 3)" },
        { expr: "make Null 1 2 3", expected: "([(1, 2, Eps)], 3)" },
        { expr: "make (Seq (Term 'a') (Term 'b')) 1 2 3", expected: "([(1, 3, C 'a'), (3, 2, C 'b')], 4)" },
        {
          expr: "make (Seq (Seq (Term 'a') (Term 'b')) (Term 'c')) 1 2 3",
          expected: "([(1, 4, C 'a'), (4, 3, C 'b'), (3, 2, C 'c')], 5)",
        },
        { expr: "make (Alt (Term 'x') (Seq Null (Term 'y'))) 0 1 2", expected: "([(0, 1, C 'x'), (0, 2, Eps), (2, 1, C 'y')], 3)" },
      ],
      hint: "For `Seq`: `(ts1, k1) = make r1 m k (k + 1)` and `(ts2, k2) = make r2 k n k1`, result `(ts1 ++ ts2, k2)`.",
      solution: hs`make :: RE -> Int -> Int -> Int -> ([Transition], Int)
make Null m n k = ([(m, n, Eps)], k)
make (Term c) m n k = ([(m, n, C c)], k)
make (Seq r1 r2) m n k = (ts1 ++ ts2, k2)
  where
    (ts1, k1) = make r1 m k (k + 1)
    (ts2, k2) = make r2 k n k1
make (Alt r1 r2) m n k = (ts1 ++ ts2, k2)
  where
    (ts1, k1) = make r1 m n k
    (ts2, k2) = make r2 m n k1
`,
    },
    {
      k: "write",
      setup: hs`data BExp = Prim Bool | IdRef Int | Not BExp | And BExp BExp | Or BExp BExp
  deriving (Eq, Show)

simplify :: BExp -> BExp
simplify (Not (Prim b)) = Prim (not b)
simplify (And (Prim a) (Prim b)) = Prim (a && b)
simplify (Or (Prim a) (Prim b)) = Prim (a || b)
simplify e = e

restrict :: BExp -> Int -> Bool -> BExp
restrict (IdRef j) i b
  | j == i = Prim b
  | otherwise = IdRef j
restrict (Not e) i b = simplify (Not (restrict e i b))
restrict (And x y) i b = simplify (And (restrict x i b) (restrict y i b))
restrict (Or x y) i b = simplify (Or (restrict x i b) (restrict y i b))
restrict e _ _ = e
`,
      body: md(
        "2009 exam task: `buildBDD' e n xs` builds the nodes of a decision diagram for `e`, testing the variables in `xs` in order. Each node is `(id, (var, falseChild, trueChild))`. The setup gives `restrict`.",
        "",
        "```",
        "one variable x left:  [(n, (x, leaf (restrict e x False), leaf (restrict e x True)))]",
        "                      where leaf (Prim False) = 0 and leaf (Prim True) = 1",
        "x : xs (more left):   (n, (x, 2 * n, 2 * n + 1)) at the front, then the nodes for",
        "                      restrict e x False numbered from 2 * n, then for",
        "                      restrict e x True numbered from 2 * n + 1",
        "```",
        "",
        "You can assume `xs` is never empty and contains every variable of `e`.",
      ),
      starter: hs`buildBDD' :: BExp -> Int -> [Int] -> [(Int, (Int, Int, Int))]
buildBDD' e n xs = undefined
`,
      tests: [
        { expr: "buildBDD' (IdRef 1) 2 [1]", expected: "[(2, (1, 0, 1))]" },
        { expr: "buildBDD' (Not (IdRef 1)) 2 [1]", expected: "[(2, (1, 1, 0))]" },
        { expr: "buildBDD' (And (IdRef 1) (IdRef 2)) 2 [1, 2]", expected: "[(2, (1, 4, 5)), (4, (2, 0, 0)), (5, (2, 0, 1))]" },
        { expr: "buildBDD' (Or (IdRef 1) (IdRef 2)) 2 [1, 2]", expected: "[(2, (1, 4, 5)), (4, (2, 0, 1)), (5, (2, 1, 1))]" },
        { expr: "buildBDD' (Or (IdRef 2) (IdRef 1)) 1 [2, 1]", expected: "[(1, (2, 2, 3)), (2, (1, 0, 1)), (3, (1, 1, 1))]" },
      ],
      hint: "Two equations, `[x]` first, then `(x : xs)`. Write a small `leaf` helper with `leaf (Prim b) = if b then 1 else 0`.",
      solution: hs`buildBDD' :: BExp -> Int -> [Int] -> [(Int, (Int, Int, Int))]
buildBDD' e n [x] = [(n, (x, leaf (restrict e x False), leaf (restrict e x True)))]
buildBDD' e n (x : xs) =
  (n, (x, 2 * n, 2 * n + 1))
    : buildBDD' (restrict e x False) (2 * n) xs
    ++ buildBDD' (restrict e x True) (2 * n + 1) xs
buildBDD' _ _ [] = []

leaf :: BExp -> Int
leaf (Prim b) = if b then 1 else 0
leaf _ = 0
`,
    },
    {
      k: "write",
      body: md(
        "2010 exam style: sort a list by repeatedly splitting it in three around a pivot. Write `split3 p xs` (less than, equal to, greater than `p`, in one pass returning a triple), then `qsort3`:",
        "",
        "```",
        "qsort3 []       = []",
        "qsort3 (x : xs) = qsort3 less ++ (x : equal) ++ qsort3 greater",
        "  where (less, equal, greater) = split3 x xs",
        "```",
        "",
        "Don't use `sort`, `filter` or `partition`.",
      ),
      starter: hs`split3 :: Int -> [Int] -> ([Int], [Int], [Int])
split3 p xs = undefined

qsort3 :: [Int] -> [Int]
qsort3 xs = undefined
`,
      tests: [
        { expr: "split3 3 [5, 3, 1, 3]", expected: "([1], [3, 3], [5])" },
        { expr: "qsort3 [3, 1, 2]", expected: "[1, 2, 3]" },
        { expr: "qsort3 []", expected: "[]" },
        { expr: "qsort3 [5, 5, 1, 9, 1, 0]", expected: "[0, 1, 1, 5, 5, 9]" },
        { expr: "qsort3 [-1, 4, -7]", expected: "[-7, -1, 4]" },
      ],
      banned: ["sort", "filter", "partition"],
      hint: "`split3` has base case `([], [], [])` and guards that put `x` on one of the three lists from `where (ls, es, gs) = split3 p rest`.",
      solution: hs`split3 :: Int -> [Int] -> ([Int], [Int], [Int])
split3 _ [] = ([], [], [])
split3 p (x : rest)
  | x < p = (x : ls, es, gs)
  | x == p = (ls, x : es, gs)
  | otherwise = (ls, es, x : gs)
  where
    (ls, es, gs) = split3 p rest

qsort3 :: [Int] -> [Int]
qsort3 [] = []
qsort3 (x : xs) = qsort3 less ++ (x : equal) ++ qsort3 greater
  where
    (less, equal, greater) = split3 x xs
`,
    },
    {
      k: "write",
      body: md(
        "2022 exam style (a helper returning a triple from one pass, like `lift'`): write `summary`, which takes a list of `(name, score)` pairs and returns, in one recursive pass, the names in order, the total score, and the number of scores above 50.",
        "",
        "`summary [(\"a\", 60), (\"b\", 10)]` is `([\"a\", \"b\"], 70, 1)`.",
      ),
      starter: hs`summary :: [(String, Int)] -> ([String], Int, Int)
summary xs = undefined
`,
      tests: [
        { expr: 'summary [("a", 60), ("b", 10)]', expected: '(["a", "b"], 70, 1)' },
        { expr: "summary []", expected: "([], 0, 0)" },
        { expr: 'summary [("x", 51), ("y", 50), ("z", 99)]', expected: '(["x", "y", "z"], 200, 2)' },
        { expr: 'summary [("solo", 0)]', expected: '(["solo"], 0, 0)' },
      ],
      hint: "Base case `([], 0, 0)`. For `(name, s) : rest`, `where (ns, total, high) = summary rest`, then add this item into each of the three parts.",
      solution: hs`summary :: [(String, Int)] -> ([String], Int, Int)
summary [] = ([], 0, 0)
summary ((name, s) : rest) = (name : ns, total + s, high + (if s > 50 then 1 else 0))
  where
    (ns, total, high) = summary rest
`,
    },
    {
      k: "write",
      setup: hs`data Rose = Rose [Rose]
  deriving (Eq, Show)

data LRose = LRose Int [LRose]
  deriving (Eq, Show)
`,
      body: md(
        "Counter threading, 2014 style, on a rose tree (any number of children). Write `labelRose t n`, which numbers every node in pre-order (a node gets its number before its children, children left to right), starting from `n`, and returns the next free number.",
        "",
        "You'll need a helper for the list of children that threads the counter through each child in turn.",
      ),
      starter: hs`labelRose :: Rose -> Int -> (LRose, Int)
labelRose t n = undefined
`,
      tests: [
        { expr: "labelRose (Rose []) 0", expected: "(LRose 0 [], 1)" },
        { expr: "labelRose (Rose [Rose [], Rose []]) 0", expected: "(LRose 0 [LRose 1 [], LRose 2 []], 3)" },
        { expr: "labelRose (Rose [Rose [Rose []], Rose []]) 1", expected: "(LRose 1 [LRose 2 [LRose 3 []], LRose 4 []], 5)" },
        { expr: "labelRose (Rose [Rose [], Rose [Rose [], Rose []]]) 10", expected: "(LRose 10 [LRose 11 [], LRose 12 [LRose 13 [], LRose 14 []]], 15)" },
      ],
      hint: "`labelRose (Rose cs) n = (LRose n cs', n')` where `(cs', n') = labelList cs (n + 1)`. `labelList` is just like `labelAll` from the lesson, but calls `labelRose`.",
      solution: hs`labelRose :: Rose -> Int -> (LRose, Int)
labelRose (Rose cs) n = (LRose n cs', n')
  where
    (cs', n') = labelList cs (n + 1)

labelList :: [Rose] -> Int -> ([LRose], Int)
labelList [] n = ([], n)
labelList (c : cs) n = (c' : cs', n2)
  where
    (c', n1) = labelRose c n
    (cs', n2) = labelList cs n1
`,
    },
  ],
};

const listImports = hs`import Data.List (nub, sort, sortOn, sortBy, group, partition, union, intersect, (\\))
import Data.Ord (comparing)
`;

const sets: Lesson = {
  id: "sets",
  title: "Lists as sets",
  blurb: "nub, union, intersect, sorting and grouping, and picking the best with minimum.",
  steps: [
    {
      k: "read",
      body: md(
        "A set is a collection where order doesn't matter and nothing appears twice. Haskell's exams almost never use a special set type. They use plain lists, and the spec says things like \"the order of the result is unimportant\" or \"without duplicates\".",
        "",
        "`Data.List` has the tools. At the top of your file write:",
        "",
        "```",
        "import Data.List",
        "```",
        "",
        "The first tool is `nub`, which removes duplicates, keeping the first copy of each element.",
      ),
    },
    { k: "try", code: "nub [3, 1, 3, 2, 1]", after: "The first 3 and the first 1 are kept, in their original places; later copies are dropped." },
    {
      k: "predict",
      expr: 'nub "mississippi"',
      answer: '"misp"',
      why: "Go left to right and keep each letter the first time you see it: m, i, s, then p.",
    },
    {
      k: "read",
      body: md(
        "Checking membership: `elem x xs` is `True` if `x` is in `xs`; `notElem` is the opposite. You'll often see them written between their inputs with backticks:",
        "",
        "```",
        "3 `elem` [1, 2, 3]       -- True",
        "```",
        "",
        "Removing: `xs \\\\ ys` is list difference. For each element of `ys`, it removes the first copy of it from `xs`:",
        "",
        "```",
        "[1, 2, 3, 4] \\\\ [2, 4]     is  [1, 3]",
        "[1, 2, 1] \\\\ [1]           is  [2, 1]       -- only the first 1 goes",
        "```",
      ),
    },
    {
      k: "predict",
      expr: "[1, 2, 3, 2] \\\\ [2]",
      answer: "[1, 3, 2]",
      why: "`\\\\` removes only one 2 per 2 in the second list: the first one. The later 2 stays.",
    },
    {
      k: "quiz",
      q: "What is `[1, 2, 2, 3] \\\\ [2, 2, 5]`?",
      options: ["`[1, 3]`", "`[1, 2, 3]`", "`[1, 3, 5]`", "An error, because 5 isn't in the first list"],
      answer: 0,
      why: "Each 2 in the second list removes one 2 from the first, so both go. Removing 5 does nothing, since there isn't one. No error.",
    },
    {
      k: "write",
      body: "Write `insertSet x xs`, which adds `x` to the front of `xs` unless it is already there, so a set stays without duplicates.",
      starter: hs`insertSet :: Eq a => a -> [a] -> [a]
insertSet x xs = undefined
`,
      tests: [
        { expr: "insertSet 3 [1, 2 :: Int]", expected: "[3, 1, 2]" },
        { expr: "insertSet 2 [1, 2 :: Int]", expected: "[1, 2]" },
        { expr: "insertSet 'a' \"\"", expected: '"a"' },
        { expr: 'insertSet \'b\' "abc"', expected: '"abc"' },
      ],
      hint: "`if elem x xs then xs else x : xs`, or two guards.",
      solution: hs`insertSet :: Eq a => a -> [a] -> [a]
insertSet x xs
  | elem x xs = xs
  | otherwise = x : xs
`,
    },
    {
      k: "read",
      body: md(
        "Combining sets:",
        "",
        "```",
        "union xs ys       -- xs, then the elements of ys that aren't already in xs",
        "intersect xs ys   -- the elements of xs that also appear in ys",
        "```",
        "",
        "Both keep the order of the first list. If the inputs have no duplicates, neither will the answer.",
      ),
    },
    {
      k: "predict",
      expr: "union [1, 2] [2, 3, 1, 4]",
      answer: "[1, 2, 3, 4]",
      why: "Start with `[1, 2]`, then add the elements of the second list that are new: 3 and 4.",
    },
    {
      k: "predict",
      expr: "intersect [1, 2, 3, 4] [4, 2, 6]",
      answer: "[2, 4]",
      why: "Keep the elements of the first list that are also in the second. They stay in the first list's order: 2 then 4.",
    },
    {
      k: "write",
      setup: listImports,
      body: md(
        "Write `unionAll`, which joins a list of sets into one set. 2022 has exactly this helper, written as:",
        "",
        "```",
        "unionAll = foldr union []",
        "```",
        "",
        "The order of your answer doesn't matter, but it must not contain duplicates (assuming each input set has none).",
      ),
      starter: hs`unionAll :: Eq a => [[a]] -> [a]
unionAll xss = undefined
`,
      tests: [
        { expr: "unionAll [[1, 2], [2, 3], [3, 4 :: Int]]", expected: "[1, 2, 3, 4]", unordered: true },
        { expr: "unionAll ([] :: [[Int]])", expected: "[]" },
        { expr: 'unionAll ["ab", "", "ba", "c"]', expected: '"abc"', unordered: true },
        { expr: "unionAll [[5 :: Int]]", expected: "[5]" },
      ],
      hint: "`foldr union [] xss`: union every set into the answer, starting from the empty set.",
      solution: hs`unionAll :: Eq a => [[a]] -> [a]
unionAll xss = foldr union [] xss
`,
    },
    {
      k: "quiz",
      q: "Why does `unionAll` start its fold from `[]`?",
      options: [
        "Because `foldr` always needs `[]`",
        "Because the union of no sets is the empty set, and `union xs []` is `xs`",
        "To make the result sorted",
        "To remove duplicates",
      ],
      answer: 1,
      why: "The starting value must be the answer for an empty input, and must not change anything when combined. The empty set does both, just like 0 for `sum`.",
    },
    {
      k: "read",
      body: md(
        "Sorting and grouping:",
        "",
        "```",
        "sort xs                    -- smallest first",
        "sortOn f xs                -- sort by what f gives for each element",
        "sortBy (comparing f) xs    -- the same thing, older style; comparing is from Data.Ord",
        "group xs                   -- split into runs of equal neighbours",
        "```",
        "",
        "`group` only puts together elements that are next to each other, so you nearly always `sort` first. `map length (group (sort xs))` counts how often each value appears.",
      ),
    },
    {
      k: "try",
      code: 'sortOn snd [("b", 2), ("a", 3), ("c", 1)]',
      after: "Sorted by the second part of each pair: 1, 2, 3.",
    },
    {
      k: "predict",
      expr: 'map (\\g -> (head g, length g)) (group (sort "banana"))',
      answer: "[('a', 3), ('b', 1), ('n', 2)]",
      why: "`sort \"banana\"` is `\"aaabnn\"`, `group` gives `[\"aaa\", \"b\", \"nn\"]`, and each group becomes its letter and its size.",
    },
    {
      k: "write",
      setup: formulaSetup + listImports,
      body: md(
        "2019 asks for `vars`: all the variable names in a formula, sorted, with no duplicates.",
        "",
        "Collect every `Var` name with a recursive helper (duplicates and all), then tidy up with `sort (nub ...)`.",
      ),
      starter: hs`vars :: Formula -> [String]
vars f = undefined
`,
      tests: [
        { expr: `vars (And (Var "b") (Or (Var "a") (Not (Var "b"))))`, expected: `["a", "b"]` },
        { expr: `vars (Var "x")`, expected: `["x"]` },
        { expr: `vars (Not (Not (Var "q")))`, expected: `["q"]` },
        { expr: `vars (Or (Var "z") (And (Var "y") (Var "x")))`, expected: `["x", "y", "z"]` },
      ],
      hint: "Helper `names (Var v) = [v]`, `names (Not f) = names f`, `names (And a b) = names a ++ names b`, same for `Or`. Then `vars f = sort (nub (names f))`.",
      solution: hs`vars :: Formula -> [String]
vars f = sort (nub (names f))
  where
    names (Var v) = [v]
    names (Not g) = names g
    names (And a b) = names a ++ names b
    names (Or a b) = names a ++ names b
`,
    },
    {
      k: "read",
      body: md(
        "Tuples compare by their first part; only if those are equal do they compare the second part, and so on. So `minimum` of a list of pairs picks the smallest first part, breaking ties by the second.",
        "",
        "This is a neat trick for picking the best item. In 2021 you need the node with the smallest degree (fewest neighbours), and if there is a tie, the smallest node. Make pairs with the thing to minimise first:",
        "",
        "```",
        "snd (minimum [(degree n, n) | n <- nodes])",
        "```",
        "",
        "`minimum` finds the best pair, and `snd` takes the node out of it.",
      ),
    },
    {
      k: "predict",
      expr: "minimum [(3, 'a'), (1, 'z'), (1, 'b')]",
      answer: "(1, 'b')",
      why: "The smallest first part is 1, shared by two pairs. The tie is broken by the second part: `'b'` comes before `'z'`.",
    },
    {
      k: "quiz",
      q: "You have `degree :: Int -> Int`. Which expression gives the node with the smallest degree, smallest node on ties?",
      options: [
        "`minimum [(n, degree n) | n <- ns]`",
        "`snd (minimum [(degree n, n) | n <- ns])`",
        "`minimum (map degree ns)`",
        "`fst (minimum [(degree n, n) | n <- ns])`",
      ],
      answer: 1,
      why: "The thing you minimise must be first in the pair, and you want the node back, which is the second part. Option 1 just finds the smallest node; option 3 gives a degree, not a node; option 4 also gives the degree.",
    },
    {
      k: "write",
      body: "Write `cheapest`, which takes a list of `(item, price)` pairs and gives the item with the lowest price; if prices tie, the item that comes first alphabetically. The list is never empty.",
      starter: hs`cheapest :: [(String, Int)] -> String
cheapest xs = undefined
`,
      tests: [
        { expr: 'cheapest [("tea", 3), ("cake", 5), ("bun", 2)]', expected: '"bun"' },
        { expr: 'cheapest [("pear", 4), ("apple", 4)]', expected: '"apple"' },
        { expr: 'cheapest [("only", 9)]', expected: '"only"' },
        { expr: 'cheapest [("b", 1), ("a", 7), ("c", 1)]', expected: '"b"' },
      ],
      hint: "Flip each pair so the price comes first: `snd (minimum [(p, item) | (item, p) <- xs])`.",
      solution: hs`cheapest :: [(String, Int)] -> String
cheapest xs = snd (minimum [(p, item) | (item, p) <- xs])
`,
    },
    {
      k: "read",
      body: md(
        "Three more helpers that work on whole sets:",
        "",
        "```",
        "all p xs         -- True if every element passes p",
        "any p xs         -- True if at least one element passes p",
        "partition p xs   -- (the ones that pass, the ones that don't), in one go",
        "```",
        "",
        "\"Is `xs` a subset of `ys`?\" is `all (\\x -> elem x ys) xs`: every element of `xs` is in `ys`.",
      ),
    },
    {
      k: "predict",
      expr: "partition even [1 .. 6]",
      answer: "([2, 4, 6], [1, 3, 5])",
      why: "`partition` is like `filter` and its opposite at once: the evens first, then the rest.",
    },
    {
      k: "quiz",
      q: "What is `all even []`?",
      options: ["`True`", "`False`", "An error", "`[]`"],
      answer: 0,
      why: "There's no element that fails, so \"every element is even\" is true. `all` on an empty list is always `True`, and `any` is always `False`. This often matters for base cases.",
    },
    {
      k: "write",
      body: "Write `subset xs ys` (every element of `xs` is in `ys`) and `sameSet xs ys` (each is a subset of the other, so order and repeats don't matter).",
      starter: hs`subset :: Eq a => [a] -> [a] -> Bool
subset xs ys = undefined

sameSet :: Eq a => [a] -> [a] -> Bool
sameSet xs ys = undefined
`,
      tests: [
        { expr: "subset [1, 2] [3, 2, 1 :: Int]", expected: "True" },
        { expr: "subset [1, 4] [1, 2 :: Int]", expected: "False" },
        { expr: "subset [] [1 :: Int]", expected: "True" },
        { expr: "sameSet [1, 2, 2] [2, 1 :: Int]", expected: "True" },
        { expr: 'sameSet "abc" "ab"', expected: "False" },
      ],
      hint: "`subset xs ys = all (\\x -> elem x ys) xs`, and `sameSet xs ys = subset xs ys && subset ys xs`.",
      solution: hs`subset :: Eq a => [a] -> [a] -> Bool
subset xs ys = all (\x -> elem x ys) xs

sameSet :: Eq a => [a] -> [a] -> Bool
sameSet xs ys = subset xs ys && subset ys xs
`,
    },
    {
      k: "read",
      body: md(
        "When a spec says \"the order doesn't matter\", the auto-tester sorts both your answer and the expected answer before comparing them. So any order is fine, but duplicates still count: `[1, 2, 2]` is not the same as `[1, 2]`.",
        "",
        "When a spec says the answer must be sorted (like 2019's `vars`), finish with `sort`. When it says no duplicates, use `nub`. `sort (nub xs)` does both.",
      ),
    },
    {
      k: "write",
      setup: listImports,
      body: "Write `counts`, giving each character of a string with how many times it appears, most frequent first; ties in alphabetical order. `counts \"banana\"` is `[('a', 3), ('n', 2), ('b', 1)]`.",
      starter: hs`counts :: String -> [(Char, Int)]
counts s = undefined
`,
      tests: [
        { expr: 'counts "banana"', expected: "[('a', 3), ('n', 2), ('b', 1)]" },
        { expr: 'counts ""', expected: "[]" },
        { expr: 'counts "cab"', expected: "[('a', 1), ('b', 1), ('c', 1)]" },
        { expr: 'counts "zzyx"', expected: "[('z', 2), ('x', 1), ('y', 1)]" },
      ],
      hint: "Pairs from `[(head g, length g) | g <- group (sort s)]`, then `sortOn (\\(c, n) -> (negate n, c))`: biggest count first, then the letter.",
      solution: hs`counts :: String -> [(Char, Int)]
counts s = sortOn (\(c, n) -> (negate n, c)) [(head g, length g) | g <- group (sort s)]
`,
    },
    {
      k: "quiz",
      q: "What is `sortBy (comparing snd) [(1, 'b'), (2, 'a'), (3, 'b')]`?",
      options: [
        "`[(2, 'a'), (1, 'b'), (3, 'b')]`",
        "`[(2, 'a'), (3, 'b'), (1, 'b')]`",
        "`[(1, 'b'), (2, 'a'), (3, 'b')]`",
        "`[(1, 'b'), (3, 'b'), (2, 'a')]`",
      ],
      answer: 0,
      why: "It sorts on the second part only, so `'a'` comes first. The two `'b'` pairs are equal as far as sorting is concerned, and Haskell's sort keeps equal elements in their original order (it's stable).",
    },
    {
      k: "read",
      body: md(
        "Summary:",
        "",
        "- `nub` drops repeats, `elem` tests membership, `\\\\` removes, `union` and `intersect` combine.",
        "- `foldr union []` joins many sets (2022's `unionAll`).",
        "- `sort`, `sortOn`, `sortBy (comparing f)`; `group` after `sort` to count.",
        "- `minimum` of `(score, thing)` pairs picks the best thing, ties broken by the thing (2021).",
        "- \"Order doesn't matter\" means any order passes, but duplicates still count.",
      ),
    },
  ],
};

const setsDrills: DrillSet = {
  id: "drill-sets",
  lesson: "sets",
  title: "Lists as sets drills",
  drills: [
    { k: "predict", expr: "nub [1, 1, 2, 1, 3]", answer: "[1, 2, 3]", why: "The first copy of each number stays; the others go." },
    {
      k: "quiz",
      q: "What is `notElem 'x' \"box\"`?",
      options: ["`True`", "`False`", "`'x'`", "An error"],
      answer: 1,
      why: "`'x'` IS in `\"box\"`, so \"not an element\" is `False`.",
    },
    {
      k: "predict",
      expr: '"abcde" \\\\ "bd"',
      answer: '"ace"',
      why: "Remove one `'b'` and one `'d'` from `\"abcde\"`.",
    },
    {
      k: "quiz",
      q: "What is `union [1, 1, 2] [2, 3]`?",
      options: ["`[1, 2, 3]`", "`[1, 1, 2, 3]`", "`[1, 1, 2, 2, 3]`", "`[2, 3, 1]`"],
      answer: 1,
      why: "`union` keeps the first list exactly as it is, repeats included, then adds what's new from the second: 3. It only avoids adding new duplicates.",
    },
    {
      k: "write",
      body: "Write `removeAll xs ys`, which removes EVERY copy of each element of `ys` from `xs` (unlike `\\\\`, which removes one copy).",
      starter: hs`removeAll :: Eq a => [a] -> [a] -> [a]
removeAll xs ys = undefined
`,
      tests: [
        { expr: "removeAll [1, 2, 1, 3] [1 :: Int]", expected: "[2, 3]" },
        { expr: 'removeAll "banana" "an"', expected: '"b"' },
        { expr: "removeAll [] [1 :: Int]", expected: "[]" },
        { expr: "removeAll [4, 5] ([] :: [Int])", expected: "[4, 5]" },
      ],
      hint: "Keep the elements that aren't in `ys`: `filter (\\x -> notElem x ys) xs`.",
      solution: hs`removeAll :: Eq a => [a] -> [a] -> [a]
removeAll xs ys = filter (\x -> notElem x ys) xs
`,
    },
    {
      k: "predict",
      expr: 'intersect "hello" "world"',
      answer: '"llo"',
      why: "Go through `\"hello\"` keeping letters that appear in `\"world\"`: h no, e no, l yes, l yes, o yes. Both `l`s stay because each is checked separately.",
    },
    {
      k: "predict",
      expr: "sort [(2, 'b'), (1, 'z'), (2, 'a')]",
      answer: "[(1, 'z'), (2, 'a'), (2, 'b')]",
      why: "Pairs sort by the first part, and only use the second part to break ties.",
    },
    {
      k: "quiz",
      q: "What is `sortBy (comparing snd) [(1, 'b'), (2, 'a')]`?",
      options: ["`[(1, 'b'), (2, 'a')]`", "`[(2, 'a'), (1, 'b')]`", "`[('a', 2), ('b', 1)]`", "`['a', 'b']`"],
      answer: 1,
      why: "It sorts the pairs (unchanged) by their second part. `'a'` is smaller, so `(2, 'a')` comes first.",
    },
    {
      k: "write",
      body: "Write `isSet`, which is `True` when a list has no duplicates.",
      setup: listImports,
      starter: hs`isSet :: Eq a => [a] -> Bool
isSet xs = undefined
`,
      tests: [
        { expr: "isSet [1, 2, 3 :: Int]", expected: "True" },
        { expr: "isSet [1, 2, 1 :: Int]", expected: "False" },
        { expr: "isSet ([] :: [Int])", expected: "True" },
        { expr: 'isSet "abca"', expected: "False" },
      ],
      hint: "If `nub` changes nothing, there were no duplicates: `nub xs == xs`.",
      solution: hs`isSet :: Eq a => [a] -> Bool
isSet xs = nub xs == xs
`,
    },
    {
      k: "predict",
      expr: "group [1, 1, 2, 3, 3, 3]",
      answer: "[[1, 1], [2], [3, 3, 3]]",
      why: "Each run of equal neighbours becomes one inner list.",
    },
    {
      k: "quiz",
      q: "What is `group \"abab\"`?",
      options: ['`["aa", "bb"]`', '`["a", "b", "a", "b"]`', '`["ab", "ab"]`', '`["abab"]`'],
      answer: 1,
      why: "`group` only joins equal neighbours, and no two neighbours are equal here. To gather all the `a`s together, `sort` first.",
    },
    {
      k: "predict",
      expr: 'maximum [(2, "x"), (5, "a"), (5, "b")]',
      answer: '(5, "b")',
      why: "The biggest first part is 5, tied between two pairs; the tie is broken by the second part, and `\"b\"` is bigger than `\"a\"`.",
    },
    {
      k: "write",
      setup: listImports,
      body: "Write `sameElems`, which says whether two lists contain the same values, ignoring order and repeats.",
      starter: hs`sameElems :: [Int] -> [Int] -> Bool
sameElems xs ys = undefined
`,
      tests: [
        { expr: "sameElems [3, 1, 2] [1, 2, 3]", expected: "True" },
        { expr: "sameElems [1, 1, 2] [2, 1]", expected: "True" },
        { expr: "sameElems [1, 2] [1, 2, 3]", expected: "False" },
        { expr: "sameElems [] []", expected: "True" },
        { expr: "sameElems [] [0]", expected: "False" },
      ],
      hint: "Put both into a standard form and compare: `sort (nub xs) == sort (nub ys)`.",
      solution: hs`sameElems :: [Int] -> [Int] -> Bool
sameElems xs ys = sort (nub xs) == sort (nub ys)
`,
    },
    {
      k: "quiz",
      q: "What is `any (> 10) []`?",
      options: ["`True`", "`False`", "An error", "`Nothing`"],
      answer: 1,
      why: "There is no element at all, so there isn't one that's bigger than 10. `any` of an empty list is `False`.",
    },
    {
      k: "predict",
      expr: 'snd (minimum [(length w, w) | w <- words "the quick brown fox"])',
      answer: '"fox"',
      why: "The shortest length is 3, shared by `\"the\"` and `\"fox\"`. The tie is broken alphabetically, so `(3, \"fox\")` is the minimum.",
    },
    {
      k: "quiz",
      q: "What is `foldr union [] [[1, 2], [2, 3], [3, 4]]`?",
      options: ["`[1, 2, 2, 3, 3, 4]`", "`[1, 2, 3, 4]`", "`[3, 4]`", "`[]`"],
      answer: 1,
      why: "From the right: `union [3, 4] []` is `[3, 4]`, then `union [2, 3] [3, 4]` is `[2, 3, 4]`, then `union [1, 2] [2, 3, 4]` is `[1, 2, 3, 4]`.",
    },
    {
      k: "write",
      setup: listImports,
      body: "Write `allNodes`, which lists every node that appears in a list of edges `(from, to)`, sorted, without duplicates.",
      starter: hs`allNodes :: [(Int, Int)] -> [Int]
allNodes es = undefined
`,
      tests: [
        { expr: "allNodes [(1, 2), (2, 3)]", expected: "[1, 2, 3]" },
        { expr: "allNodes []", expected: "[]" },
        { expr: "allNodes [(5, 1), (1, 5), (3, 3)]", expected: "[1, 3, 5]" },
        { expr: "allNodes [(9, 2)]", expected: "[2, 9]" },
      ],
      hint: "Collect both ends with `concat [[a, b] | (a, b) <- es]`, then `sort (nub ...)`.",
      solution: hs`allNodes :: [(Int, Int)] -> [Int]
allNodes es = sort (nub (concat [[a, b] | (a, b) <- es]))
`,
    },
    {
      k: "predict",
      expr: 'partition (`elem` "aeiou") "education"',
      answer: '("euaio", "dctn")',
      why: "The vowels in the order they appear (e, u, a, i, o), then the other letters (d, c, t, n).",
    },
    {
      k: "quiz",
      q: "Which is the same as `sortOn fst xs` for a list of pairs?",
      options: ["`sort xs`", "`sortBy (comparing fst) xs`", "`sortBy fst xs`", "`map fst (sort xs)`"],
      answer: 1,
      why: "`comparing fst` makes a comparison that looks only at the first part. `sort xs` also uses the second part to break ties, so it can order tied pairs differently.",
    },
    {
      k: "write",
      body: "Write `topScorer`, the name with the highest score; on a tie, the name that comes first alphabetically. The list is never empty.",
      starter: hs`topScorer :: [(String, Int)] -> String
topScorer xs = undefined
`,
      tests: [
        { expr: 'topScorer [("ann", 7), ("bob", 9), ("cat", 3)]', expected: '"bob"' },
        { expr: 'topScorer [("zed", 5), ("amy", 5)]', expected: '"amy"' },
        { expr: 'topScorer [("x", -1)]', expected: '"x"' },
        { expr: 'topScorer [("b", 2), ("a", 1), ("c", 2)]', expected: '"b"' },
      ],
      hint: "Biggest score but smallest name: minimise `(negate score, name)`. So `snd (minimum [(negate s, n) | (n, s) <- xs])`.",
      solution: hs`topScorer :: [(String, Int)] -> String
topScorer xs = snd (minimum [(negate s, n) | (n, s) <- xs])
`,
    },
    {
      k: "write",
      setup: formulaSetup + listImports,
      body: md(
        "2019 exam task: write `vars` (sorted variable names without duplicates), then `idMap`, which numbers them from 1:",
        "",
        "`idMap (And (Var \"b\") (Var \"a\"))` is `[(\"a\", 1), (\"b\", 2)]`.",
      ),
      starter: hs`vars :: Formula -> [String]
vars f = undefined

idMap :: Formula -> [(String, Int)]
idMap f = undefined
`,
      tests: [
        { expr: `vars (Or (Var "b") (Not (Var "a")))`, expected: `["a", "b"]` },
        { expr: `idMap (And (Var "b") (Var "a"))`, expected: `[("a", 1), ("b", 2)]` },
        { expr: `idMap (Var "x")`, expected: `[("x", 1)]` },
        { expr: `idMap (Or (Var "c") (And (Var "a") (Not (Var "c"))))`, expected: `[("a", 1), ("c", 2)]` },
      ],
      hint: "`vars f = sort (nub (names f))` with a helper collecting names. Then `idMap f = zip (vars f) [1 ..]`.",
      solution: hs`vars :: Formula -> [String]
vars f = sort (nub (names f))
  where
    names (Var v) = [v]
    names (Not g) = names g
    names (And a b) = names a ++ names b
    names (Or a b) = names a ++ names b

idMap :: Formula -> [(String, Int)]
idMap f = zip (vars f) [1 ..]
`,
    },
    {
      k: "write",
      body: md(
        "2021 exam task: a graph is `([node], [(node, node)])`, edges going either way. The degree of a node is how many edges touch it. Write `degree`, then `pickNode`, which returns the node with the smallest degree, the smallest such node on ties. Use `minimum` on `(degree, node)` pairs.",
      ),
      starter: hs`degree :: Int -> ([Int], [(Int, Int)]) -> Int
degree n g = undefined

pickNode :: ([Int], [(Int, Int)]) -> Int
pickNode g = undefined
`,
      tests: [
        { expr: "degree 1 ([1, 2, 3], [(1, 2), (3, 1)])", expected: "2" },
        { expr: "degree 4 ([1, 4], [(1, 2)])", expected: "0" },
        { expr: "pickNode ([1, 2, 3], [(1, 2), (3, 1)])", expected: "2" },
        { expr: "pickNode ([5, 6, 7], [(5, 6), (6, 7), (7, 5)])", expected: "5" },
        { expr: "pickNode ([3, 1, 2], [(1, 2), (1, 3), (2, 3), (1, 1)])", expected: "2" },
      ],
      hint: "`degree n (_, es) = length [() | (a, b) <- es, a == n || b == n]`. `pickNode g@(ns, _) = snd (minimum [(degree n g, n) | n <- ns])`.",
      solution: hs`degree :: Int -> ([Int], [(Int, Int)]) -> Int
degree n (_, es) = length [() | (a, b) <- es, a == n || b == n]

pickNode :: ([Int], [(Int, Int)]) -> Int
pickNode g = snd (minimum [(degree n g, n) | n <- fst g])
`,
    },
    {
      k: "write",
      setup: listImports,
      body: "2022 exam style: alongside `unionAll`, write `commonToAll`, the elements that appear in every one of a non-empty list of sets, in the order of the first set. Use `foldr1 intersect`.",
      starter: hs`unionAll :: [[Int]] -> [Int]
unionAll xss = undefined

commonToAll :: [[Int]] -> [Int]
commonToAll xss = undefined
`,
      tests: [
        { expr: "unionAll [[1, 2], [2, 3]]", expected: "[1, 2, 3]", unordered: true },
        { expr: "unionAll []", expected: "[]" },
        { expr: "commonToAll [[1, 2, 3], [3, 2], [2, 3, 4]]", expected: "[2, 3]" },
        { expr: "commonToAll [[1, 2], [3]]", expected: "[]" },
        { expr: "commonToAll [[4, 5]]", expected: "[4, 5]" },
      ],
      hint: "`unionAll = foldr union []`. `foldr1` is `foldr` with no start value, which suits a non-empty list: `commonToAll xss = foldr1 intersect xss`.",
      solution: hs`unionAll :: [[Int]] -> [Int]
unionAll xss = foldr union [] xss

commonToAll :: [[Int]] -> [Int]
commonToAll xss = foldr1 intersect xss
`,
    },
    {
      k: "write",
      setup: listImports,
      body: "2012 exam style: a machine is a list of transitions `(from, char, to)`. Write `states`, every state mentioned (as a source or a target), sorted, without duplicates, and `alphabet`, every character used, sorted, without duplicates.",
      starter: hs`states :: [(Int, Char, Int)] -> [Int]
states ts = undefined

alphabet :: [(Int, Char, Int)] -> [Char]
alphabet ts = undefined
`,
      tests: [
        { expr: "states [(1, 'a', 2), (2, 'b', 1), (2, 'a', 3)]", expected: "[1, 2, 3]" },
        { expr: "alphabet [(1, 'b', 2), (2, 'a', 1), (2, 'b', 3)]", expected: '"ab"' },
        { expr: "states []", expected: "[]" },
        { expr: "states [(4, 'x', 4)]", expected: "[4]" },
        { expr: "alphabet [(0, 'z', 1), (1, 'z', 0)]", expected: '"z"' },
      ],
      hint: "`states ts = sort (nub (concat [[a, b] | (a, _, b) <- ts]))` and `alphabet ts = sort (nub [c | (_, c, _) <- ts])`.",
      solution: hs`states :: [(Int, Char, Int)] -> [Int]
states ts = sort (nub (concat [[a, b] | (a, _, b) <- ts]))

alphabet :: [(Int, Char, Int)] -> [Char]
alphabet ts = sort (nub [c | (_, c, _) <- ts])
`,
    },
    {
      k: "write",
      setup: listImports,
      body: md(
        "2019 exam style: a CNF formula is a list of clauses, each a list of literals (`3` means variable 3, `-3` means not variable 3). Write `normalise`, which sorts each clause and removes repeated literals inside it, then removes repeated clauses and sorts the list of clauses.",
        "",
        "`normalise [[2, 1, 2], [1, 2], [-3]]` is `[[-3], [1, 2]]`.",
      ),
      starter: hs`normalise :: [[Int]] -> [[Int]]
normalise cs = undefined
`,
      tests: [
        { expr: "normalise [[2, 1, 2], [1, 2], [-3]]", expected: "[[-3], [1, 2]]" },
        { expr: "normalise []", expected: "[]" },
        { expr: "normalise [[5, -1], [-1, 5, 5]]", expected: "[[-1, 5]]" },
        { expr: "normalise [[3], [1], [2, 1]]", expected: "[[1], [1, 2], [3]]" },
      ],
      hint: "First `map (sort . nub) cs` to tidy each clause, then `sort (nub ...)` on the whole list. Tidy the clauses first, or `[2, 1]` and `[1, 2]` won't look equal to `nub`.",
      solution: hs`normalise :: [[Int]] -> [[Int]]
normalise cs = sort (nub (map (sort . nub) cs))
`,
    },
  ],
};

const interpTypes = hs`data Op = Add | Sub | Mul | Less | Equal
  deriving (Eq, Show)

data Exp = Const Int | Var String | App Op Exp Exp
  deriving (Eq, Show)

type Env = [(String, Int)]

data Statement = Assign String Exp | If Exp Block Block | While Exp Block | DoWhile Exp Block
  deriving (Eq, Show)

type Block = [Statement]
`;

const interpEval = hs`
lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x t = case lookup x t of
  Just v -> v
  Nothing -> error "lookUp: not found"

apply :: Op -> Int -> Int -> Int
apply Add a b = a + b
apply Sub a b = a - b
apply Mul a b = a * b
apply Less a b = if a < b then 1 else 0
apply Equal a b = if a == b then 1 else 0

eval :: Exp -> Env -> Int
eval (Const n) _ = n
eval (Var v) env = lookUp v env
eval (App op a b) env = apply op (eval a env) (eval b env)

update :: String -> Int -> Env -> Env
update v n env = (v, n) : [p | p <- env, fst p /= v]
`;

const interpExecStatement = hs`
execStatement :: Statement -> Env -> Env
execStatement (Assign v e) env = update v (eval e env) env
execStatement (If c t f) env
  | eval c env /= 0 = execBlock t env
  | otherwise = execBlock f env
execStatement (While c b) env
  | eval c env /= 0 = execStatement (While c b) (execBlock b env)
  | otherwise = env
execStatement (DoWhile c b) env = execStatement (While c b) (execBlock b env)
`;

const interpExecBlock = hs`
execBlock :: Block -> Env -> Env
execBlock b env = foldl (\e s -> execStatement s e) env b
`;

const factProg =
  '[Assign "r" (Const 1), While (App Less (Const 0) (Var "n")) [Assign "r" (App Mul (Var "r") (Var "n")), Assign "n" (App Sub (Var "n") (Const 1))]]';

const interpreters: Lesson = {
  id: "interpreters",
  title: "Writing an interpreter",
  blurb: "Evaluate expressions in an environment, then run statements that change it.",
  steps: [
    {
      k: "read",
      body: md(
        "An interpreter is a program that runs other programs. Several exams (2015 and 2018 among them) give you a tiny programming language as Haskell data types and ask you to run it.",
        "",
        "Running a program needs to know the current value of every variable. That's called the environment (or the state). In exams it is nearly always an association list, a list of (name, value) pairs:",
        "",
        "```",
        "type Env = [(String, Int)]",
        "",
        "[(\"x\", 3), (\"y\", 5)]      -- x is 3, y is 5",
        "```",
      ),
    },
    { k: "try", code: 'lookup "x" [("x", 3), ("y", 5)]', after: "`lookup` finds the value for a name, wrapped in `Just`, or gives `Nothing` if the name isn't there." },
    {
      k: "read",
      body: md(
        "Exams usually give you (or ask for) a `lookUp` that assumes the name is there, so you don't have to handle `Nothing` every time:",
        "",
        "```",
        "lookUp :: Eq a => a -> [(a, b)] -> b",
        "lookUp x t = case lookup x t of",
        "  Just v  -> v",
        "  Nothing -> error \"lookUp: not found\"",
        "```",
        "",
        "`error` crashes with a message. That's acceptable when the spec promises the key is always present.",
      ),
    },
    {
      k: "write",
      body: "Write `lookUp` yourself, without using `lookup`: recurse down the list and give the value of the first pair whose key matches.",
      starter: hs`lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x t = undefined
`,
      tests: [
        { expr: 'lookUp "y" [("x", 1), ("y", 2 :: Int)]', expected: "2" },
        { expr: "lookUp 3 [(3 :: Int, \"c\")]", expected: '"c"' },
        { expr: "lookUp 'a' [('a', 1), ('a', 2 :: Int)]", expected: "1" },
        { expr: "lookUp 5 [(1, True), (5 :: Int, False)]", expected: "False" },
      ],
      banned: ["lookup"],
      hint: "`lookUp x ((k, v) : rest)` gives `v` if `x == k`, otherwise `lookUp x rest`. You don't need an equation for `[]` (or make it `error`).",
      solution: hs`lookUp :: Eq a => a -> [(a, b)] -> b
lookUp _ [] = error "lookUp: not found"
lookUp x ((k, v) : rest)
  | x == k = v
  | otherwise = lookUp x rest
`,
    },
    {
      k: "predict",
      expr: 'fromMaybe 0 (lookup "z" [("x", 1)])',
      answer: "0",
      why: "`\"z\"` isn't there, so `lookup` gives `Nothing`, and `fromMaybe 0` turns that into the default 0.",
    },
    {
      k: "read",
      body: md(
        "Here's an expression language like 2018's:",
        "",
        "```",
        "data Op  = Add | Sub | Mul | Less | Equal",
        "data Exp = Const Int | Var String | App Op Exp Exp",
        "```",
        "",
        "`App Add (Var \"x\") (Const 1)` means `x + 1`. To evaluate it, you need the environment for the variables:",
        "",
        "```",
        "eval :: Exp -> Env -> Int",
        "eval (Const n) _        = n",
        "eval (Var v) env        = lookUp v env",
        "eval (App op a b) env   = apply op (eval a env) (eval b env)",
        "```",
        "",
        "`apply` does the actual arithmetic for one operator. Evaluate both sides first, then combine them. The same `env` is passed down to both sides, unchanged: evaluating an expression never changes a variable.",
      ),
    },
    {
      k: "write",
      body: md(
        "Write `apply`. This language has no Bool values, so comparisons give 1 for true and 0 for false, exactly as in 2018:",
        "",
        "```",
        "data Op = Add | Sub | Mul | Less | Equal",
        "```",
      ),
      setup: hs`data Op = Add | Sub | Mul | Less | Equal
  deriving (Eq, Show)
`,
      starter: hs`apply :: Op -> Int -> Int -> Int
apply op a b = undefined
`,
      tests: [
        { expr: "apply Add 2 3", expected: "5" },
        { expr: "apply Sub 2 3", expected: "-1" },
        { expr: "apply Mul 4 3", expected: "12" },
        { expr: "apply Less 1 2", expected: "1" },
        { expr: "apply Less 2 2", expected: "0" },
        { expr: "apply Equal 7 7", expected: "1" },
      ],
      hint: "One equation per operator. For `Less`: `apply Less a b = if a < b then 1 else 0`.",
      solution: hs`apply :: Op -> Int -> Int -> Int
apply Add a b = a + b
apply Sub a b = a - b
apply Mul a b = a * b
apply Less a b = if a < b then 1 else 0
apply Equal a b = if a == b then 1 else 0
`,
    },
    {
      k: "quiz",
      q: "In this language, what is `apply Less 5 3`?",
      options: ["`False`", "`0`", "`1`", "`2`"],
      answer: 1,
      why: "5 is not less than 3, which is false, and false is encoded as 0. It can't be `False`: `apply` returns an `Int`.",
    },
    {
      k: "write",
      setup: interpTypes + hs`
apply :: Op -> Int -> Int -> Int
apply Add a b = a + b
apply Sub a b = a - b
apply Mul a b = a * b
apply Less a b = if a < b then 1 else 0
apply Equal a b = if a == b then 1 else 0
`,
      body: "The setup gives the types and `apply`. Write `eval`. A variable's value comes from the environment (you may use `lookup` with `fromMaybe`, or write a helper); assume every variable is present.",
      starter: hs`eval :: Exp -> Env -> Int
eval e env = undefined
`,
      tests: [
        { expr: "eval (Const 7) []", expected: "7" },
        { expr: 'eval (Var "x") [("x", 4)]', expected: "4" },
        { expr: 'eval (App Add (Var "x") (Const 1)) [("x", 4)]', expected: "5" },
        { expr: 'eval (App Mul (App Sub (Var "a") (Var "b")) (Const 10)) [("a", 5), ("b", 2)]', expected: "30" },
        { expr: 'eval (App Less (Var "n") (Const 3)) [("n", 2)]', expected: "1" },
      ],
      hint: "Three equations, one per constructor. For `Var v`: `case lookup v env of Just n -> n`. For `App op a b`: `apply op (eval a env) (eval b env)`.",
      solution: hs`eval :: Exp -> Env -> Int
eval (Const n) _ = n
eval (Var v) env = case lookup v env of
  Just n -> n
  Nothing -> error ("unbound variable " ++ v)
eval (App op a b) env = apply op (eval a env) (eval b env)
`,
    },
    {
      k: "predict",
      body: "Turning a Bool into 1 or 0 has a shortcut: `fromEnum`.",
      expr: "fromEnum (3 < 5) + fromEnum (5 < 3)",
      answer: "1",
      why: "`fromEnum True` is 1 and `fromEnum False` is 0, so this is 1 + 0.",
    },
    {
      k: "quiz",
      q: 'What is `eval (App Equal (App Add (Var "x") (Const 1)) (Const 5)) [("x", 4)]`?',
      options: ["`5`", "`True`", "`1`", "`0`"],
      answer: 2,
      why: "Inside first: `x + 1` is 5. Then `Equal 5 5` is true, encoded as 1.",
    },
    {
      k: "read",
      body: md(
        "Statements change the environment. Assigning `x := 9` must give a new environment where `x` is 9. You can't change a list in Haskell, so you build a new one:",
        "",
        "```",
        "update :: String -> Int -> Env -> Env",
        "update v n env = (v, n) : [p | p <- env, fst p /= v]",
        "```",
        "",
        "Put the new pair at the front, and keep every other pair except the old one for `v`. If `v` wasn't there before, it's simply added.",
      ),
    },
    {
      k: "write",
      body: "Write `update` as described: the new binding first, then every other binding (minus any old one for the same name), in their original order.",
      starter: hs`update :: String -> Int -> [(String, Int)] -> [(String, Int)]
update v n env = undefined
`,
      tests: [
        { expr: 'update "x" 9 [("x", 1), ("y", 2)]', expected: '[("x", 9), ("y", 2)]' },
        { expr: 'update "z" 3 [("x", 1)]', expected: '[("z", 3), ("x", 1)]' },
        { expr: 'update "a" 0 []', expected: '[("a", 0)]' },
        { expr: 'update "y" 5 [("x", 1), ("y", 2), ("w", 3)]', expected: '[("y", 5), ("x", 1), ("w", 3)]' },
      ],
      hint: "`(v, n) : filter (\\p -> fst p /= v) env`",
      solution: hs`update :: String -> Int -> [(String, Int)] -> [(String, Int)]
update v n env = (v, n) : filter (\p -> fst p /= v) env
`,
    },
    {
      k: "predict",
      expr: 'let env = [("x", 1), ("y", 2)] in ("x", 9) : filter ((/= "x") . fst) env',
      answer: '[("x", 9), ("y", 2)]',
      why: "The old `x` pair is filtered out and the new one goes on the front. `(/= \"x\") . fst` means \"the name is not x\".",
    },
    {
      k: "read",
      body: md(
        "Now statements and blocks (a block is a list of statements, run in order):",
        "",
        "```",
        "data Statement = Assign String Exp | If Exp Block Block | While Exp Block | DoWhile Exp Block",
        "type Block = [Statement]",
        "```",
        "",
        "Running a statement takes the environment before and gives the environment after:",
        "",
        "```",
        "execStatement :: Statement -> Env -> Env",
        "execStatement (Assign v e) env = update v (eval e env) env",
        "execStatement (If c t f) env",
        "  | eval c env /= 0 = execBlock t env",
        "  | otherwise       = execBlock f env",
        "execStatement (While c b) env",
        "  | eval c env /= 0 = execStatement (While c b) (execBlock b env)",
        "  | otherwise       = env",
        "```",
        "",
        "The While loop: if the condition holds, run the body once, then run the whole While again on the new environment. When it fails, stop, and the environment is the answer.",
      ),
    },
    {
      k: "quiz",
      q: "In this language, when does `If c t f` run the block `t`?",
      options: ["When `eval c env` is `True`", "When `eval c env` is not 0", "When `eval c env` is exactly 0", "When `c` is a `Const`"],
      answer: 1,
      why: "Conditions are Ints, with 0 for false. Anything else counts as true, so the test is `/= 0`. Writing `== True` would be a type error.",
    },
    {
      k: "read",
      body: md(
        "Running a block means running each statement in turn, each one starting from the environment the previous one produced. That's exactly a left fold, with the environment as the accumulator:",
        "",
        "```",
        "execBlock :: Block -> Env -> Env",
        "execBlock b env = foldl (\\e s -> execStatement s e) env b",
        "```",
        "",
        "Notice `execStatement` uses `execBlock` (for If and While), and `execBlock` uses `execStatement`. Two functions that call each other are mutually recursive. Haskell is fine with that: just define both at the top level.",
      ),
    },
    {
      k: "predict",
      expr: "foldl (\\acc f -> f acc) 1 [(+ 2), (* 10), subtract 3]",
      answer: "27",
      why: "Like a block of statements: start at 1, then 1 + 2 = 3, then 3 * 10 = 30, then 30 - 3 = 27. Each step sees the result of the one before.",
    },
    {
      k: "write",
      setup: interpTypes + interpEval + interpExecStatement,
      body: "The setup gives everything except `execBlock` (its `execStatement` calls your `execBlock`). Write `execBlock` with `foldl`, so statements run first to last.",
      starter: hs`execBlock :: Block -> Env -> Env
execBlock b env = undefined
`,
      tests: [
        { expr: "execBlock [] [(\"x\", 1)]", expected: '[("x", 1)]' },
        { expr: 'execBlock [Assign "x" (Const 2), Assign "y" (App Mul (Var "x") (Const 5))] []', expected: '[("x", 2), ("y", 10)]', unordered: true },
        { expr: 'execBlock [Assign "x" (Const 1), Assign "x" (App Add (Var "x") (Var "x"))] []', expected: '[("x", 2)]' },
        { expr: `execBlock ${factProg} [("n", 5)]`, expected: '[("n", 0), ("r", 120)]', unordered: true },
        { expr: 'execBlock [If (App Less (Var "a") (Const 0)) [Assign "s" (Const (-1))] [Assign "s" (Const 1)]] [("a", 3)]', expected: '[("a", 3), ("s", 1)]', unordered: true },
      ],
      hint: "`execBlock b env = foldl (\\e s -> execStatement s e) env b`. The accumulator is the environment; each step runs one statement.",
      solution: hs`execBlock :: Block -> Env -> Env
execBlock b env = foldl (\e s -> execStatement s e) env b
`,
    },
    {
      k: "quiz",
      q: 'What happens running `While (Const 1) [Assign "x" (Const 0)]`?',
      options: ["It runs once", "It never runs", "It runs forever, so the program hangs", "It's a type error"],
      answer: 2,
      why: "The condition is always 1 (true) and the body never changes that, so the loop never stops. The auto-tester would time out. Real exam tests always use loops that end.",
    },
    {
      k: "write",
      setup: interpTypes + interpEval + interpExecBlock,
      body: md(
        "Now the other half: the setup gives `execBlock`, and you write `execStatement` for `Assign`, `If` and `While` (as shown above), plus `DoWhile c b`: run `b` once, then keep going exactly like `While c b`.",
      ),
      starter: hs`execStatement :: Statement -> Env -> Env
execStatement s env = undefined
`,
      tests: [
        { expr: 'execStatement (Assign "x" (Const 3)) []', expected: '[("x", 3)]' },
        { expr: 'execStatement (If (Const 0) [Assign "r" (Const 1)] [Assign "r" (Const 2)]) []', expected: '[("r", 2)]' },
        { expr: `execBlock ${factProg} [("n", 4)]`, expected: '[("n", 0), ("r", 24)]', unordered: true },
        { expr: 'execStatement (While (App Less (Var "i") (Const 0)) [Assign "i" (Const 99)]) [("i", 5)]', expected: '[("i", 5)]' },
        { expr: 'execStatement (DoWhile (App Less (Var "i") (Const 0)) [Assign "i" (Const 99)]) [("i", 5)]', expected: '[("i", 99)]' },
        {
          expr: 'execStatement (DoWhile (App Less (Var "i") (Const 3)) [Assign "i" (App Add (Var "i") (Const 1))]) [("i", 0)]',
          expected: '[("i", 3)]',
        },
      ],
      hint: "`Assign` uses `update` and `eval`. `If` and `While` test `eval c env /= 0`. `DoWhile c b` can be `execStatement (While c b) (execBlock b env)`.",
      solution: hs`execStatement :: Statement -> Env -> Env
execStatement (Assign v e) env = update v (eval e env) env
execStatement (If c t f) env
  | eval c env /= 0 = execBlock t env
  | otherwise = execBlock f env
execStatement (While c b) env
  | eval c env /= 0 = execStatement (While c b) (execBlock b env)
  | otherwise = env
execStatement (DoWhile c b) env = execStatement (While c b) (execBlock b env)
`,
    },
    {
      k: "read",
      body: md(
        "Why have `DoWhile` at all? A `While` checks first and may run its body zero times. A `DoWhile` runs the body first and checks afterwards, so it always runs at least once.",
        "",
        "That's why `DoWhile c b` is just \"run `b`, then behave like `While c b`\". Reusing the code you already have is the safest way to write it.",
      ),
    },
    {
      k: "quiz",
      q: 'Starting from `[("i", 10)]`, what does `DoWhile (App Less (Var "i") (Const 5)) [Assign "i" (App Add (Var "i") (Const 1))]` leave?',
      options: ['`[("i", 10)]`', '`[("i", 11)]`', '`[("i", 5)]`', "It loops forever"],
      answer: 1,
      why: "The body runs once before any check: i becomes 11. Then `11 < 5` is false, so it stops. A `While` would have left i at 10.",
    },
    {
      k: "read",
      body: md(
        "Last piece: function calls. A function has parameter names and a body. To call it, evaluate the arguments, then pair each parameter name with its value using `zip`, and evaluate the body in that environment:",
        "",
        "```",
        "call :: ([String], Exp) -> [Exp] -> Env -> Int",
        "call (params, body) args env = eval body (zip params values ++ env)",
        "  where",
        "    values = [eval a env | a <- args]",
        "```",
        "",
        "The new bindings go in front, so a parameter called `x` hides any outer `x`: `lookup` finds the first match.",
      ),
    },
    {
      k: "predict",
      expr: 'zip ["a", "b"] [1, 2, 3]',
      answer: '[("a", 1), ("b", 2)]',
      why: "`zip` pairs elements up and stops at the end of the shorter list, so the 3 is dropped.",
    },
    {
      k: "write",
      setup: interpTypes + interpEval,
      body: "Write `call`, as described above. `call ([\"x\", \"y\"], App Mul (Var \"x\") (Var \"y\")) [Const 3, Const 4] []` is 12.",
      starter: hs`call :: ([String], Exp) -> [Exp] -> Env -> Int
call (params, body) args env = undefined
`,
      tests: [
        { expr: 'call (["x", "y"], App Mul (Var "x") (Var "y")) [Const 3, Const 4] []', expected: "12" },
        { expr: 'call (["n"], App Add (Var "n") (Var "k")) [Var "k"] [("k", 10)]', expected: "20" },
        { expr: 'call (["x"], Var "x") [Const 1] [("x", 99)]', expected: "1" },
        { expr: "call ([], Const 7) [] []", expected: "7" },
      ],
      hint: "Evaluate every argument in the caller's `env`, then `eval body (zip params values ++ env)`.",
      solution: hs`call :: ([String], Exp) -> [Exp] -> Env -> Int
call (params, body) args env = eval body (zip params values ++ env)
  where
    values = [eval a env | a <- args]
`,
    },
    {
      k: "predict",
      expr: 'lookup "x" ([("x", 1)] ++ [("x", 2)])',
      answer: "Just 1",
      why: "`lookup` takes the first match. That's why new bindings go on the front: they hide older ones with the same name.",
    },
    {
      k: "read",
      body: md(
        "Summary:",
        "",
        "- The environment is a list of `(name, value)` pairs. Read with `lookup`/`lookUp`; change it by building a new list (`update`).",
        "- `eval` follows the shape of the expression type, passing the same `env` down to every part.",
        "- Bools are often encoded as 1 and 0; test conditions with `/= 0`.",
        "- `execStatement :: Statement -> Env -> Env`; a block is a `foldl` over its statements; the two are mutually recursive.",
        "- Calls: `zip params values ++ env`.",
      ),
    },
  ],
};

const interpretersDrills: DrillSet = {
  id: "drill-interpreters",
  lesson: "interpreters",
  title: "Interpreter drills",
  drills: [
    { k: "predict", expr: "lookup 'b' (zip \"abc\" [1 ..])", answer: "Just 2", why: "`zip` pairs `'a'` with 1, `'b'` with 2, and so on." },
    {
      k: "quiz",
      q: "What does `type Env = [(String, Int)]` describe?",
      options: [
        "A new data type with a constructor called Env",
        "Another name for a list of (name, value) pairs",
        "A function from String to Int",
        "A Map from the containers library",
      ],
      answer: 1,
      why: "`type` only gives a new name to an existing type. An `Env` is just a list of pairs; every list function works on it.",
    },
    { k: "predict", expr: 'fromMaybe 0 (lookup "q" [("p", 5)])', answer: "0", why: "`\"q\"` is missing, so the default 0 is used." },
    {
      k: "quiz",
      q: 'What is `lookup 1 [(1, "a"), (1, "b")]`?',
      options: ['`Just "a"`', '`Just "b"`', '`Just ["a", "b"]`', "`Nothing`"],
      answer: 0,
      why: "`lookup` stops at the first matching key.",
    },
    {
      k: "write",
      body: "Write `valueOr v d env`: the value of variable `v` in `env`, or the default `d` if it isn't there.",
      starter: hs`valueOr :: String -> Int -> [(String, Int)] -> Int
valueOr v d env = undefined
`,
      tests: [
        { expr: 'valueOr "x" 0 [("x", 4)]', expected: "4" },
        { expr: 'valueOr "y" 0 [("x", 4)]', expected: "0" },
        { expr: 'valueOr "y" (-1) []', expected: "-1" },
        { expr: 'valueOr "b" 0 [("a", 1), ("b", 2), ("b", 3)]', expected: "2" },
      ],
      hint: "`case lookup v env of Just n -> n; Nothing -> d`.",
      solution: hs`valueOr :: String -> Int -> [(String, Int)] -> Int
valueOr v d env = case lookup v env of
  Just n -> n
  Nothing -> d
`,
    },
    {
      k: "predict",
      expr: "fromEnum (2 > 1) + fromEnum (2 < 1)",
      answer: "1",
      why: "`True` counts as 1 and `False` as 0.",
    },
    {
      k: "quiz",
      q: "In a language where Bools are encoded as Ints, what should `apply Equal 3 3` be?",
      options: ["`True`", "`3`", "`1`", "`0`"],
      answer: 2,
      why: "3 equals 3, so it's true, encoded as 1. The result type is `Int`, so `True` would not even type-check.",
    },
    {
      k: "predict",
      expr: 'foldl (\\env (k, v) -> (k, v) : env) [] [("x", 1), ("y", 2)]',
      answer: '[("y", 2), ("x", 1)]',
      why: "Each binding goes on the front of the accumulated environment, so the last one added ends up first.",
    },
    {
      k: "write",
      setup: hs`data Op = Plus | Minus | Times | Gtr | Eq
  deriving (Eq, Show)
`,
      body: "Write `applyOp` for these operators. `Gtr` (greater than) and `Eq` give 1 for true and 0 for false.",
      starter: hs`applyOp :: Op -> Int -> Int -> Int
applyOp op a b = undefined
`,
      tests: [
        { expr: "applyOp Plus 1 2", expected: "3" },
        { expr: "applyOp Minus 1 2", expected: "-1" },
        { expr: "applyOp Times 3 3", expected: "9" },
        { expr: "applyOp Gtr 3 2", expected: "1" },
        { expr: "applyOp Gtr 2 3", expected: "0" },
        { expr: "applyOp Eq 4 5", expected: "0" },
      ],
      hint: "One equation per operator; `fromEnum (a > b)` gives 1 or 0.",
      solution: hs`applyOp :: Op -> Int -> Int -> Int
applyOp Plus a b = a + b
applyOp Minus a b = a - b
applyOp Times a b = a * b
applyOp Gtr a b = fromEnum (a > b)
applyOp Eq a b = fromEnum (a == b)
`,
    },
    {
      k: "quiz",
      q: "`lookUp` uses `error` when the name is missing. What happens if a program uses a variable that was never assigned?",
      options: ["It gets the value 0", "The interpreter crashes with the error message", "It's a compile error", "It's skipped"],
      answer: 1,
      why: "`error` crashes when it is reached. The type checker can't know which names will be in a list at run time, so it compiles fine.",
    },
    {
      k: "predict",
      expr: "let { ev (Left n) = n; ev (Right (a, b)) = a * b } in sum (map ev [Left 3, Right (2, 5)])",
      answer: "13",
      why: "A tiny interpreter: `Left 3` evaluates to 3, `Right (2, 5)` to 10. The sum is 13.",
    },
    {
      k: "write",
      setup: hs`data Expr = N Int | V String | Plus Expr Expr | IfZero Expr Expr Expr
  deriving (Eq, Show)
`,
      body: "Write `evalE`. `IfZero c t e` evaluates `t` if `c` evaluates to 0, otherwise `e`. Every variable is in the environment.",
      starter: hs`evalE :: Expr -> [(String, Int)] -> Int
evalE e env = undefined
`,
      tests: [
        { expr: "evalE (N 4) []", expected: "4" },
        { expr: 'evalE (Plus (V "a") (N 1)) [("a", 9)]', expected: "10" },
        { expr: 'evalE (IfZero (V "z") (N 1) (N 2)) [("z", 0)]', expected: "1" },
        { expr: 'evalE (IfZero (Plus (V "z") (N 1)) (N 1) (V "z")) [("z", 6)]', expected: "6" },
      ],
      hint: "Four equations. For `IfZero c t e`: `if evalE c env == 0 then evalE t env else evalE e env`.",
      solution: hs`evalE :: Expr -> [(String, Int)] -> Int
evalE (N n) _ = n
evalE (V v) env = case lookup v env of
  Just n -> n
  Nothing -> error "unbound"
evalE (Plus a b) env = evalE a env + evalE b env
evalE (IfZero c t e) env = if evalE c env == 0 then evalE t env else evalE e env
`,
    },
    {
      k: "quiz",
      q: "In `execBlock b env = foldl (\\e s -> execStatement s e) env b`, what is the accumulator?",
      options: ["The current statement", "The environment so far", "The list of statements left", "A count of statements"],
      answer: 1,
      why: "The fold starts with `env` and each step turns the current environment into the next one by running a statement.",
    },
    {
      k: "predict",
      expr: "foldl (\\n f -> f n) 2 [(* 3), (+ 1), (* 2)]",
      answer: "14",
      why: "2 * 3 = 6, 6 + 1 = 7, 7 * 2 = 14: each function is applied to the result of the previous one, left to right.",
    },
    {
      k: "quiz",
      q: "A `While` loop's condition never becomes 0. What does your interpreter do?",
      options: ["Stops after 100 steps", "Returns the original environment", "Runs forever", "Crashes immediately"],
      answer: 2,
      why: "`execStatement (While c b)` calls itself again whenever the condition is non-zero. Nothing stops it, exactly like an infinite loop in a real language.",
    },
    {
      k: "predict",
      expr: "until (> 100) (* 2) 3",
      answer: "192",
      why: "`until p f x` keeps applying `f` while `p` is false, like a while loop: 3, 6, 12, 24, 48, 96, 192. It stops at the first value over 100.",
    },
    {
      k: "write",
      body: "Write `setVar v n env`, which keeps the order of the environment: if `v` is there, replace its value where it is; otherwise add `(v, n)` at the end.",
      starter: hs`setVar :: String -> Int -> [(String, Int)] -> [(String, Int)]
setVar v n env = undefined
`,
      tests: [
        { expr: 'setVar "x" 5 [("x", 1), ("y", 2)]', expected: '[("x", 5), ("y", 2)]' },
        { expr: 'setVar "y" 7 [("x", 1), ("y", 2), ("z", 3)]', expected: '[("x", 1), ("y", 7), ("z", 3)]' },
        { expr: 'setVar "z" 3 [("x", 1)]', expected: '[("x", 1), ("z", 3)]' },
        { expr: 'setVar "a" 0 []', expected: '[("a", 0)]' },
      ],
      hint: "Recursion: `setVar v n [] = [(v, n)]`; for `(k, old) : rest`, if `k == v` give `(v, n) : rest`, else keep `(k, old)` and recurse.",
      solution: hs`setVar :: String -> Int -> [(String, Int)] -> [(String, Int)]
setVar v n [] = [(v, n)]
setVar v n ((k, old) : rest)
  | k == v = (v, n) : rest
  | otherwise = (k, old) : setVar v n rest
`,
    },
    {
      k: "predict",
      expr: 'zip ["a", "b"] (map (* 10) [1, 2])',
      answer: '[("a", 10), ("b", 20)]',
      why: "First the argument values are worked out (10 and 20), then paired with the parameter names. This is how function calls bind their arguments.",
    },
    {
      k: "quiz",
      q: "When calling a function, why is it `zip params values ++ env` and not `env ++ zip params values`?",
      options: [
        "It's faster",
        "So that a parameter hides an outer variable with the same name, since lookup finds the first match",
        "`++` only works that way round",
        "No reason; both give the same answers",
      ],
      answer: 1,
      why: "If `env` already has an `x` and the parameter is also `x`, the parameter must win inside the function. Putting the parameters first makes `lookup` see them first.",
    },
    {
      k: "write",
      setup: interpTypes + interpEval,
      body: "Write `runAssigns`, which runs a list of `(name, expression)` assignments in order, each one seeing the results of the earlier ones. Use `foldl` with the `eval` and `update` from the setup.",
      starter: hs`runAssigns :: [(String, Exp)] -> Env -> Env
runAssigns asgs env = undefined
`,
      tests: [
        { expr: 'runAssigns [("x", Const 1)] []', expected: '[("x", 1)]' },
        { expr: 'runAssigns [("x", Const 2), ("y", App Add (Var "x") (Const 3))] []', expected: '[("x", 2), ("y", 5)]', unordered: true },
        { expr: 'runAssigns [("x", App Mul (Var "x") (Var "x")), ("x", App Sub (Var "x") (Const 1))] [("x", 3)]', expected: '[("x", 8)]' },
        { expr: 'runAssigns [] [("k", 0)]', expected: '[("k", 0)]' },
      ],
      hint: "`foldl (\\e (v, ex) -> update v (eval ex e) e) env asgs`. Evaluate each expression in the environment so far, `e`.",
      solution: hs`runAssigns :: [(String, Exp)] -> Env -> Env
runAssigns asgs env = foldl (\e (v, ex) -> update v (eval ex e) e) env asgs
`,
    },
    {
      k: "write",
      setup: hs`type Id = String

data Op = Add | Mul | Eq | Gtr
  deriving (Eq, Show)

data Exp = Const Int | Var Id | Apply Op Exp Exp
  deriving (Eq, Show)

type State = [(Id, Int)]
`,
      body: "2018 exam task: write `apply` (with `Eq` and `Gtr` giving 1 or 0) and `eval :: Exp -> State -> Int`. Every variable is in the state.",
      starter: hs`apply :: Op -> Int -> Int -> Int
apply op a b = undefined

eval :: Exp -> State -> Int
eval e s = undefined
`,
      tests: [
        { expr: "apply Gtr 5 2", expected: "1" },
        { expr: "apply Eq 5 2", expected: "0" },
        { expr: 'eval (Apply Add (Var "x") (Const 1)) [("x", 4)]', expected: "5" },
        { expr: 'eval (Apply Gtr (Apply Mul (Var "a") (Var "a")) (Const 10)) [("a", 3)]', expected: "0" },
        { expr: 'eval (Apply Eq (Var "p") (Var "q")) [("p", 2), ("q", 2)]', expected: "1" },
        { expr: "eval (Const (-3)) []", expected: "-3" },
      ],
      hint: "`apply Gtr a b = fromEnum (a > b)`. `eval (Apply op a b) s = apply op (eval a s) (eval b s)`; variables use `lookup`.",
      solution: hs`apply :: Op -> Int -> Int -> Int
apply Add a b = a + b
apply Mul a b = a * b
apply Eq a b = fromEnum (a == b)
apply Gtr a b = fromEnum (a > b)

eval :: Exp -> State -> Int
eval (Const n) _ = n
eval (Var v) s = case lookup v s of
  Just n -> n
  Nothing -> error "unbound"
eval (Apply op a b) s = apply op (eval a s) (eval b s)
`,
    },
    {
      k: "write",
      setup: hs`data Exp = Num Int | Id String | Plus Exp Exp | Times Exp Exp | Let String Exp Exp
  deriving (Eq, Show)
`,
      body: md(
        "2015 exam style: `eval :: Exp -> [(String, Int)] -> Int` for a language with local definitions. `Let v e1 e2` means \"let v be e1 in e2\": evaluate `e1`, then evaluate `e2` with `v` bound to that value in front of the environment.",
      ),
      starter: hs`eval :: Exp -> [(String, Int)] -> Int
eval e env = undefined
`,
      tests: [
        { expr: 'eval (Plus (Num 1) (Id "x")) [("x", 2)]', expected: "3" },
        { expr: 'eval (Let "x" (Num 5) (Times (Id "x") (Id "x"))) []', expected: "25" },
        { expr: 'eval (Let "x" (Num 1) (Let "x" (Plus (Id "x") (Num 1)) (Id "x"))) []', expected: "2" },
        { expr: 'eval (Plus (Let "y" (Num 10) (Id "y")) (Id "y")) [("y", 1)]', expected: "11" },
      ],
      hint: "`eval (Let v e1 e2) env = eval e2 ((v, eval e1 env) : env)`. The binding only exists inside `e2`.",
      solution: hs`eval :: Exp -> [(String, Int)] -> Int
eval (Num n) _ = n
eval (Id v) env = case lookup v env of
  Just n -> n
  Nothing -> error "unbound"
eval (Plus a b) env = eval a env + eval b env
eval (Times a b) env = eval a env * eval b env
eval (Let v e1 e2) env = eval e2 ((v, eval e1 env) : env)
`,
    },
    {
      k: "write",
      setup: interpTypes + interpEval,
      body: "2018 exam task: write both `execStatement` (Assign, If, While, DoWhile) and `execBlock` (a `foldl`) from scratch. The setup gives `eval` and `update`.",
      starter: hs`execStatement :: Statement -> Env -> Env
execStatement s env = undefined

execBlock :: Block -> Env -> Env
execBlock b env = undefined
`,
      tests: [
        { expr: `execBlock ${factProg} [("n", 3)]`, expected: '[("n", 0), ("r", 6)]', unordered: true },
        { expr: 'execBlock [] [("q", 1)]', expected: '[("q", 1)]' },
        {
          expr: 'execBlock [Assign "a" (Const 4), If (App Equal (Var "a") (Const 4)) [Assign "b" (Const 1)] [], Assign "a" (App Add (Var "a") (Var "b"))] []',
          expected: '[("a", 5), ("b", 1)]',
          unordered: true,
        },
        { expr: 'execBlock [DoWhile (Const 0) [Assign "t" (Const 8)]] []', expected: '[("t", 8)]' },
        {
          expr: 'execBlock [Assign "s" (Const 0), Assign "i" (Const 1), While (App Less (Var "i") (Const 5)) [Assign "s" (App Add (Var "s") (Var "i")), Assign "i" (App Add (Var "i") (Const 1))]] []',
          expected: '[("i", 5), ("s", 10)]',
          unordered: true,
        },
      ],
      hint: "Follow the lesson: `If` and `While` test `eval c env /= 0`; `DoWhile c b` is `While c b` after one run of `b`; `execBlock` folds `execStatement` over the block.",
      solution: hs`execStatement :: Statement -> Env -> Env
execStatement (Assign v e) env = update v (eval e env) env
execStatement (If c t f) env
  | eval c env /= 0 = execBlock t env
  | otherwise = execBlock f env
execStatement (While c b) env
  | eval c env /= 0 = execStatement (While c b) (execBlock b env)
  | otherwise = env
execStatement (DoWhile c b) env = execStatement (While c b) (execBlock b env)

execBlock :: Block -> Env -> Env
execBlock b env = foldl (\e s -> execStatement s e) env b
`,
    },
    {
      k: "write",
      setup: hs`data Op = Add | Mul
  deriving (Eq, Show)

data Exp = Const Int | Var String | App Op Exp Exp | Call String [Exp]
  deriving (Eq, Show)

type Env = [(String, Int)]

type Functions = [(String, ([String], Exp))]
`,
      body: md(
        "2018 exam style, function calls: `eval fs e env` evaluates `e`, where `fs` is a table of functions, each with parameter names and a body. For `Call f args`: look up `f` in `fs`, evaluate each argument in `env`, then evaluate the body with the parameters bound (in front of `env`) using `zip`.",
      ),
      starter: hs`eval :: Functions -> Exp -> Env -> Int
eval fs e env = undefined
`,
      tests: [
        { expr: 'eval [] (App Add (Const 1) (Var "x")) [("x", 2)]', expected: "3" },
        { expr: 'eval [("sq", (["n"], App Mul (Var "n") (Var "n")))] (Call "sq" [Const 7]) []', expected: "49" },
        {
          expr: 'eval [("add", (["a", "b"], App Add (Var "a") (Var "b")))] (Call "add" [Var "x", Const 10]) [("x", 5)]',
          expected: "15",
        },
        {
          expr: 'eval [("sq", (["n"], App Mul (Var "n") (Var "n"))), ("f", (["x"], Call "sq" [App Add (Var "x") (Const 1)]))] (Call "f" [Const 2]) []',
          expected: "9",
        },
      ],
      hint: "`eval fs (Call f args) env = eval fs body (zip params [eval fs a env | a <- args] ++ env)` where `(params, body)` comes from looking `f` up in `fs`.",
      solution: hs`eval :: Functions -> Exp -> Env -> Int
eval _ (Const n) _ = n
eval _ (Var v) env = case lookup v env of
  Just n -> n
  Nothing -> error "unbound"
eval fs (App op a b) env = applyOp op (eval fs a env) (eval fs b env)
  where
    applyOp Add = (+)
    applyOp Mul = (*)
eval fs (Call f args) env = eval fs body (zip params values ++ env)
  where
    (params, body) = case lookup f fs of
      Just def -> def
      Nothing -> error "unknown function"
    values = [eval fs a env | a <- args]
`,
    },
    {
      k: "write",
      setup: hs`data Exp = Const Int | Var String | Add Exp Exp | Less Exp Exp
  deriving (Eq, Show)

data Statement = Assign String Exp | Print Exp | While Exp [Statement]
  deriving (Eq, Show)

type Env = [(String, Int)]

eval :: Exp -> Env -> Int
eval (Const n) _ = n
eval (Var v) env = case lookup v env of
  Just n -> n
  Nothing -> error "unbound"
eval (Add a b) env = eval a env + eval b env
eval (Less a b) env = fromEnum (eval a env < eval b env)

update :: String -> Int -> Env -> Env
update v n env = (v, n) : [p | p <- env, fst p /= v]
`,
      body: md(
        "2018 style extension with output: `exec` runs a block and returns the final environment AND everything printed, in order. `Print e` outputs the value of `e`. This combines the interpreter with threading state:",
        "",
        "```",
        "exec :: [Statement] -> Env -> (Env, [Int])",
        "```",
        "",
        "Hint for the shape: for `s : rest`, run `s` to get `(env1, out1)`, then run `rest` from `env1` to get `(env2, out2)`, and return `(env2, out1 ++ out2)`.",
      ),
      starter: hs`exec :: [Statement] -> Env -> (Env, [Int])
exec ss env = undefined
`,
      tests: [
        { expr: "exec [] []", expected: "([], [])" },
        { expr: 'snd (exec [Assign "x" (Const 3), Print (Var "x"), Print (Add (Var "x") (Const 1))] [])', expected: "[3, 4]" },
        {
          expr: 'snd (exec [Assign "i" (Const 0), While (Less (Var "i") (Const 3)) [Print (Var "i"), Assign "i" (Add (Var "i") (Const 1))]] [])',
          expected: "[0, 1, 2]",
        },
        {
          expr: 'fst (exec [Assign "i" (Const 0), While (Less (Var "i") (Const 3)) [Assign "i" (Add (Var "i") (Const 1))]] [])',
          expected: '[("i", 3)]',
        },
        { expr: 'exec [Print (Const 7)] [("k", 1)]', expected: '([("k", 1)], [7])' },
      ],
      hint: "Write a helper `step :: Statement -> Env -> (Env, [Int])`. `Assign` prints nothing; `Print e` gives `(env, [eval e env])`; `While c b` runs `exec b env`, then the While again from the new env, joining the outputs.",
      solution: hs`exec :: [Statement] -> Env -> (Env, [Int])
exec [] env = (env, [])
exec (s : rest) env = (env2, out1 ++ out2)
  where
    (env1, out1) = step s env
    (env2, out2) = exec rest env1

step :: Statement -> Env -> (Env, [Int])
step (Assign v e) env = (update v (eval e env) env, [])
step (Print e) env = (env, [eval e env])
step (While c b) env
  | eval c env /= 0 = (env2, out1 ++ out2)
  | otherwise = (env, [])
  where
    (env1, out1) = exec b env
    (env2, out2) = step (While c b) env1
`,
    },
  ],
};

const graphSetup = hs`import Data.List (nub, sort, (\\))

type Graph = ([Int], [(Int, Int)])
`;

const graphHelpers = hs`
neighbours :: Int -> Graph -> [Int]
neighbours n (_, es) = [b | (a, b) <- es, a == n] ++ [a | (a, b) <- es, b == n]

degree :: Int -> Graph -> Int
degree n g = length (neighbours n g)

removeNode :: Int -> Graph -> Graph
removeNode n (ns, es) = (filter (/= n) ns, [(a, b) | (a, b) <- es, a /= n, b /= n])
`;

const fsmSetup = hs`import Data.List (nub, sort)

type Transition = (Int, Char, Int)
`;

const graphs: Lesson = {
  id: "graphs",
  title: "Graphs as lists of edges",
  blurb: "Neighbours, degrees, removing nodes, transitions, and searching without looping forever.",
  steps: [
    {
      k: "read",
      body: md(
        "A graph is a set of nodes (points) joined by edges (lines). Exams store it as plain lists:",
        "",
        "```",
        "type Graph = ([Int], [(Int, Int)])",
        "",
        "g = ([1, 2, 3, 4], [(1, 2), (1, 3), (2, 3)])",
        "```",
        "",
        "The first list is every node; the second is every edge. Node 4 has no edges, which is why the node list is needed as well. In 2021 (graph colouring) edges have no direction: `(1, 2)` joins 1 and 2 both ways. In the state-machine exams (2012, 2014), edges go one way, from a state to the next.",
        "",
        "Almost everything you'll do is a list comprehension over the edges.",
      ),
    },
    {
      k: "predict",
      expr: "[b | (a, b) <- [(1, 2), (1, 3), (2, 3)], a == 1]",
      answer: "[2, 3]",
      why: "Go through the edges, keep those starting at 1, and take their other end.",
    },
    {
      k: "read",
      body: md(
        "In an undirected graph, the edge `(2, 1)` makes 1 a neighbour of 2 just as much as `(1, 2)` does. So you look at both ends:",
        "",
        "```",
        "neighbours :: Int -> Graph -> [Int]",
        "neighbours n (_, es) = [b | (a, b) <- es, a == n] ++ [a | (a, b) <- es, b == n]",
        "```",
        "",
        "The pattern `(_, es)` takes the graph apart: ignore the node list, call the edges `es`.",
      ),
    },
    {
      k: "write",
      setup: graphSetup,
      body: "Write `neighbours` for an undirected graph, as above. The order of the answer doesn't matter.",
      starter: hs`neighbours :: Int -> Graph -> [Int]
neighbours n g = undefined
`,
      tests: [
        { expr: "neighbours 1 ([1, 2, 3], [(1, 2), (1, 3)])", expected: "[2, 3]", unordered: true },
        { expr: "neighbours 3 ([1, 2, 3], [(1, 2), (1, 3), (2, 3)])", expected: "[1, 2]", unordered: true },
        { expr: "neighbours 4 ([1, 2, 3, 4], [(1, 2)])", expected: "[]" },
        { expr: "neighbours 2 ([1, 2, 3], [(2, 1), (3, 2)])", expected: "[1, 3]", unordered: true },
      ],
      hint: "Take the edges apart with `(_, es)`, then join two comprehensions: one for edges starting at `n`, one for edges ending at `n`.",
      solution: hs`neighbours :: Int -> Graph -> [Int]
neighbours n (_, es) = [b | (a, b) <- es, a == n] ++ [a | (a, b) <- es, b == n]
`,
    },
    {
      k: "quiz",
      q: "In the undirected graph `([1, 2, 3], [(1, 2), (3, 2)])`, which version of `neighbours 2` is right?",
      options: [
        "`[b | (a, b) <- es, a == 2]`, giving `[]`",
        "Both directions, giving `[1, 3]`",
        "`[a | (a, b) <- es, b == 2]`, giving `[1, 3]`, which is always enough",
        "`[2]`",
      ],
      answer: 1,
      why: "Edges can be stored either way round, so you must check both ends. Option 3 happens to work here, but fails as soon as an edge is stored as `(2, x)`.",
    },
    {
      k: "write",
      setup: graphSetup + graphHelpers.split("\ndegree")[0],
      body: "The degree of a node is how many edges touch it. The setup gives `neighbours`; write `degree`, and `degrees`, which lists `(node, degree)` for every node in the graph's node list, in that order.",
      starter: hs`degree :: Int -> Graph -> Int
degree n g = undefined

degrees :: Graph -> [(Int, Int)]
degrees g = undefined
`,
      tests: [
        { expr: "degree 1 ([1, 2, 3], [(1, 2), (3, 1)])", expected: "2" },
        { expr: "degree 3 ([1, 2, 3], [(1, 2)])", expected: "0" },
        { expr: "degrees ([1, 2, 3], [(1, 2), (1, 3)])", expected: "[(1, 2), (2, 1), (3, 1)]" },
        { expr: "degrees ([], [])", expected: "[]" },
      ],
      hint: "`degree n g = length (neighbours n g)`. For `degrees`, take the node list apart: `degrees g@(ns, _) = [(n, degree n g) | n <- ns]`.",
      solution: hs`degree :: Int -> Graph -> Int
degree n g = length (neighbours n g)

degrees :: Graph -> [(Int, Int)]
degrees g = [(n, degree n g) | n <- fst g]
`,
    },
    {
      k: "predict",
      expr: "length [() | (a, b) <- [(1, 2), (2, 3), (3, 1)], a == 2 || b == 2]",
      answer: "2",
      why: "Two edges touch node 2: `(1, 2)` and `(2, 3)`. Counting with `()` is a common trick when you only need how many.",
    },
    {
      k: "read",
      body: md(
        "2021 needs `removeNode`: take a node out of the graph, along with every edge that touches it. Both parts of the pair change:",
        "",
        "```",
        "removeNode :: Int -> Graph -> Graph",
        "removeNode n (ns, es) = (filter (/= n) ns, [(a, b) | (a, b) <- es, a /= n, b /= n])",
        "```",
        "",
        "Forgetting the edges is the usual mistake: you'd be left with edges pointing at a node that no longer exists.",
      ),
    },
    {
      k: "write",
      setup: graphSetup,
      body: "Write `removeNode` (2021). Keep the remaining nodes and edges in their original order.",
      starter: hs`removeNode :: Int -> Graph -> Graph
removeNode n g = undefined
`,
      tests: [
        { expr: "removeNode 2 ([1, 2, 3], [(1, 2), (2, 3), (1, 3)])", expected: "([1, 3], [(1, 3)])" },
        { expr: "removeNode 4 ([1, 4], [])", expected: "([1], [])" },
        { expr: "removeNode 1 ([1], [(1, 1)])", expected: "([], [])" },
        { expr: "removeNode 9 ([1, 2], [(1, 2)])", expected: "([1, 2], [(1, 2)])" },
      ],
      hint: "Pattern `(ns, es)`. Return `(filter (/= n) ns, [(a, b) | (a, b) <- es, a /= n, b /= n])`.",
      solution: hs`removeNode :: Int -> Graph -> Graph
removeNode n (ns, es) = (filter (/= n) ns, [(a, b) | (a, b) <- es, a /= n, b /= n])
`,
    },
    {
      k: "quiz",
      q: "What is `removeNode 3 ([1, 2, 3], [(1, 3), (3, 2), (1, 2)])`?",
      options: [
        "`([1, 2], [(1, 3), (3, 2), (1, 2)])`",
        "`([1, 2], [(1, 2)])`",
        "`([1, 2, 3], [(1, 2)])`",
        "`([1, 2], [])`",
      ],
      answer: 1,
      why: "Node 3 leaves the node list, and both edges touching it, `(1, 3)` and `(3, 2)`, leave the edge list. `(1, 2)` doesn't touch 3, so it stays.",
    },
    {
      k: "read",
      body: md(
        "Directed graphs with labels are state machines. 2012 and 2014 store a machine's transitions as triples:",
        "",
        "```",
        "type Transition = (Int, Char, Int)      -- (from state, character read, to state)",
        "",
        "ts = [(1, 'a', 2), (1, 'b', 3), (2, 'a', 1)]",
        "```",
        "",
        "`(1, 'a', 2)` says: in state 1, reading `'a'` takes you to state 2. Finding the transitions out of a state is a comprehension again, matching on the first part only.",
      ),
    },
    {
      k: "write",
      setup: fsmSetup,
      body: "Write `transitionsFrom s ts`, all the transitions in `ts` that leave state `s`, in their original order.",
      starter: hs`transitionsFrom :: Int -> [Transition] -> [Transition]
transitionsFrom s ts = undefined
`,
      tests: [
        { expr: "transitionsFrom 1 [(1, 'a', 2), (2, 'b', 1), (1, 'c', 1)]", expected: "[(1, 'a', 2), (1, 'c', 1)]" },
        { expr: "transitionsFrom 3 [(1, 'a', 2)]", expected: "[]" },
        { expr: "transitionsFrom 2 [(1, 'a', 2), (2, 'b', 1)]", expected: "[(2, 'b', 1)]" },
        { expr: "transitionsFrom 0 []", expected: "[]" },
      ],
      hint: "`[t | t@(from, _, _) <- ts, from == s]`. `t@pattern` names the whole triple while also taking it apart.",
      solution: hs`transitionsFrom :: Int -> [Transition] -> [Transition]
transitionsFrom s ts = [t | t@(from, _, _) <- ts, from == s]
`,
    },
    {
      k: "predict",
      expr: "[t | (s, c, t) <- [(1, 'a', 2), (1, 'b', 3), (2, 'a', 1)], s == 1, c == 'a']",
      answer: "[2]",
      why: "Only `(1, 'a', 2)` starts at 1 and reads `'a'`. Its target is 2.",
    },
    {
      k: "write",
      setup: fsmSetup,
      body: md(
        "A machine can be in several states at once (that's a non-deterministic machine, as in 2014). Write `stepAll ts ss c`: from the set of states `ss`, reading `c`, which states can you be in next? Give them sorted and without duplicates.",
      ),
      starter: hs`stepAll :: [Transition] -> [Int] -> Char -> [Int]
stepAll ts ss c = undefined
`,
      tests: [
        { expr: "stepAll [(1, 'a', 2), (1, 'a', 3), (2, 'a', 3)] [1] 'a'", expected: "[2, 3]" },
        { expr: "stepAll [(1, 'a', 2), (1, 'a', 3), (2, 'a', 3)] [1, 2] 'a'", expected: "[2, 3]" },
        { expr: "stepAll [(1, 'a', 2)] [1] 'b'", expected: "[]" },
        { expr: "stepAll [(1, 'x', 5), (2, 'x', 4)] [2, 1] 'x'", expected: "[4, 5]" },
      ],
      hint: "`sort (nub [t | (s, ch, t) <- ts, elem s ss, ch == c])`.",
      solution: hs`stepAll :: [Transition] -> [Int] -> Char -> [Int]
stepAll ts ss c = sort (nub [t | (s, ch, t) <- ts, elem s ss, ch == c])
`,
    },
    {
      k: "read",
      body: md(
        "Which nodes can you reach from a start node by following edges? This is reachability, and it's solved with a depth-first search. Keep two lists: nodes still to visit, and nodes already visited.",
        "",
        "```",
        "reachable :: Int -> [(Int, Int)] -> [Int]",
        "reachable start es = go [start] []",
        "  where",
        "    go [] visited = visited",
        "    go (n : todo) visited",
        "      | n `elem` visited = go todo visited",
        "      | otherwise        = go (succs n ++ todo) (visited ++ [n])",
        "    succs n = [b | (a, b) <- es, a == n]",
        "```",
        "",
        "Take the next node. If you've seen it, skip it. Otherwise mark it visited and add its successors to the front of the to-do list (that's what makes it depth-first). Stop when nothing is left to do.",
      ),
    },
    {
      k: "quiz",
      q: "What happens if you leave out the `elem n visited` check and the graph has a cycle, like `[(1, 2), (2, 1)]`?",
      options: [
        "Nothing; the answer is the same",
        "The search goes 1, 2, 1, 2, ... forever and never finishes",
        "It crashes with a pattern-match error",
        "It returns an empty list",
      ],
      answer: 1,
      why: "Without the visited list, every visit to 1 adds 2 to the to-do list, and every visit to 2 adds 1 again. The to-do list never empties. The visited list is what guarantees the search ends.",
    },
    {
      k: "predict",
      expr: "let { es = [(1, 2), (2, 1), (2, 3)]; go [] seen = seen; go (n : todo) seen = if elem n seen then go todo seen else go ([b | (a, b) <- es, a == n] ++ todo) (seen ++ [n]) } in go [1] []",
      answer: "[1, 2, 3]",
      why: "Visit 1 (to do: 2). Visit 2 (to do: 1, 3). 1 is already seen, skip it. Visit 3. Nothing left. Despite the cycle between 1 and 2, it stops.",
    },
    {
      k: "write",
      body: "Write `reachable start es`: every node reachable from `start` along directed edges, including `start` itself. Order doesn't matter, but no duplicates. It must stop on graphs with cycles.",
      starter: hs`reachable :: Int -> [(Int, Int)] -> [Int]
reachable start es = undefined
`,
      tests: [
        { expr: "reachable 1 [(1, 2), (2, 3)]", expected: "[1, 2, 3]", unordered: true },
        { expr: "reachable 2 [(1, 2), (2, 3)]", expected: "[2, 3]", unordered: true },
        { expr: "reachable 1 [(1, 2), (2, 1), (2, 3), (3, 3)]", expected: "[1, 2, 3]", unordered: true },
        { expr: "reachable 5 [(1, 2)]", expected: "[5]" },
        { expr: "reachable 1 [(1, 2), (1, 3), (3, 4), (4, 1), (5, 1)]", expected: "[1, 2, 3, 4]", unordered: true },
      ],
      hint: "Copy the shape above: a helper `go todo visited`, which skips nodes already in `visited`.",
      solution: hs`reachable :: Int -> [(Int, Int)] -> [Int]
reachable start es = go [start] []
  where
    go [] visited = visited
    go (n : todo) visited
      | elem n visited = go todo visited
      | otherwise = go (succs n ++ todo) (visited ++ [n])
    succs n = [b | (a, b) <- es, a == n]
`,
    },
    {
      k: "read",
      body: md(
        "2012 uses this for `pruneTransitions`: a machine may contain states you can never get to from the start state. Their transitions are useless, so you remove them.",
        "",
        "The recipe: find the reachable states (search over the transitions, ignoring the characters), then keep only the transitions whose source is one of them.",
      ),
    },
    {
      k: "write",
      setup: fsmSetup,
      body: "Write `prune start ts`: keep only the transitions that leave a state reachable from `start`, in their original order. Write your own reachability helper.",
      starter: hs`prune :: Int -> [Transition] -> [Transition]
prune start ts = undefined
`,
      tests: [
        { expr: "prune 1 [(1, 'a', 2), (3, 'b', 1), (2, 'c', 2)]", expected: "[(1, 'a', 2), (2, 'c', 2)]" },
        { expr: "prune 1 [(2, 'a', 1)]", expected: "[]" },
        { expr: "prune 1 [(1, 'a', 2), (2, 'b', 1), (2, 'a', 3), (4, 'a', 4)]", expected: "[(1, 'a', 2), (2, 'b', 1), (2, 'a', 3)]" },
        { expr: "prune 0 []", expected: "[]" },
      ],
      hint: "First `rs = reach [start] []` using edges `[(s, t) | (s, _, t) <- ts]`, then `[t | t@(s, _, _) <- ts, elem s rs]`.",
      solution: hs`prune :: Int -> [Transition] -> [Transition]
prune start ts = [t | t@(s, _, _) <- ts, elem s rs]
  where
    rs = reach [start] []
    reach [] seen = seen
    reach (n : todo) seen
      | elem n seen = reach todo seen
      | otherwise = reach ([b | (a, _, b) <- ts, a == n] ++ todo) (n : seen)
`,
    },
    {
      k: "quiz",
      q: "Your `reachable` gives `[1, 3, 2]` and the expected answer is `[1, 2, 3]`. The spec says order doesn't matter. Does the test pass?",
      options: ["No, lists must be equal", "Yes, the tester sorts both before comparing", "Only if you call `sort`", "Only for directed graphs"],
      answer: 1,
      why: "When the spec says order doesn't matter, the tester compares them as sets (sorted). Duplicates would still fail, though, which the visited list prevents.",
    },
    {
      k: "read",
      body: md(
        "Sometimes you need every combination of two sets of states, for example to run two machines side by side. That's a cartesian product, and a comprehension with two generators makes it:",
        "",
        "```",
        "[(a, b) | a <- [1, 2], b <- [7, 8]]      is  [(1, 7), (1, 8), (2, 7), (2, 8)]",
        "```",
        "",
        "In the combined machine, state `(s1, s2)` steps on `c` to `(t1, t2)` exactly when the first machine steps `s1` to `t1` on `c` AND the second steps `s2` to `t2` on `c`.",
      ),
    },
    {
      k: "predict",
      expr: "[(a, b) | a <- [1, 2], b <- \"xy\"]",
      answer: "[(1, 'x'), (1, 'y'), (2, 'x'), (2, 'y')]",
      why: "For each `a`, every `b` is tried in turn: the later generator changes fastest.",
    },
    {
      k: "write",
      setup: fsmSetup,
      body: "Write `productTransitions ts1 ts2`: the transitions of two machines running together, as described above. Order doesn't matter.",
      starter: hs`productTransitions :: [Transition] -> [Transition] -> [((Int, Int), Char, (Int, Int))]
productTransitions ts1 ts2 = undefined
`,
      tests: [
        { expr: "productTransitions [(1, 'a', 2)] [(5, 'a', 6)]", expected: "[((1, 5), 'a', (2, 6))]" },
        { expr: "productTransitions [(1, 'a', 2)] [(5, 'b', 6)]", expected: "[]" },
        {
          expr: "productTransitions [(1, 'a', 2), (2, 'b', 1)] [(5, 'a', 5), (5, 'b', 6)]",
          expected: "[((1, 5), 'a', (2, 5)), ((2, 5), 'b', (1, 6))]",
          unordered: true,
        },
        { expr: "productTransitions [] [(1, 'a', 1)]", expected: "[]" },
      ],
      hint: "Two generators and a guard: `[((s1, s2), c1, (t1, t2)) | (s1, c1, t1) <- ts1, (s2, c2, t2) <- ts2, c1 == c2]`.",
      solution: hs`productTransitions :: [Transition] -> [Transition] -> [((Int, Int), Char, (Int, Int))]
productTransitions ts1 ts2 = [((s1, s2), c1, (t1, t2)) | (s1, c1, t1) <- ts1, (s2, c2, t2) <- ts2, c1 == c2]
`,
    },
    {
      k: "quiz",
      q: "Machine A has 3 states and machine B has 4. How many states can the combined machine have?",
      options: ["7", "12", "3", "4"],
      answer: 1,
      why: "Each combined state is a pair `(a, b)`: 3 choices times 4 choices is 12. That's why product machines grow quickly.",
    },
    {
      k: "write",
      setup: graphSetup,
      body: "Write `connected`, which says whether every node of an undirected graph can be reached from its first node. A graph with no nodes counts as connected. Remember edges work both ways.",
      starter: hs`connected :: Graph -> Bool
connected g = undefined
`,
      tests: [
        { expr: "connected ([1, 2, 3], [(1, 2), (3, 2)])", expected: "True" },
        { expr: "connected ([1, 2, 3], [(1, 2)])", expected: "False" },
        { expr: "connected ([], [])", expected: "True" },
        { expr: "connected ([4], [])", expected: "True" },
        { expr: "connected ([1, 2, 3, 4], [(1, 2), (3, 4)])", expected: "False" },
      ],
      hint: "Search from the first node where the successors of `n` are its neighbours in both directions. Then check `all (\\n -> elem n seen) ns`.",
      solution: hs`connected :: Graph -> Bool
connected ([], _) = True
connected (ns, es) = all (\n -> elem n seen) ns
  where
    seen = go [head ns] []
    go [] vs = vs
    go (n : todo) vs
      | elem n vs = go todo vs
      | otherwise = go (nbrs n ++ todo) (n : vs)
    nbrs n = [b | (a, b) <- es, a == n] ++ [a | (a, b) <- es, b == n]
`,
    },
    {
      k: "read",
      body: md(
        "Summary:",
        "",
        "- A graph is `(nodes, edges)`. Undirected: check both ends of every edge. Directed: only the first end.",
        "- Degree is a count of touching edges; `removeNode` filters both the nodes and the edges (2021).",
        "- Transitions `(from, char, to)` are searched with comprehensions (2012, 2014).",
        "- Search with a to-do list and a visited list. The visited check is what stops cycles from looping forever.",
        "- Combinations of states come from two generators in one comprehension.",
      ),
    },
  ],
};

const graphsDrills: DrillSet = {
  id: "drill-graphs",
  lesson: "graphs",
  title: "Graph drills",
  drills: [
    {
      k: "predict",
      expr: "[a | (a, b) <- [(1, 2), (3, 2), (2, 4)], b == 2]",
      answer: "[1, 3]",
      why: "Keep the edges ending at 2 and take their start: 1 and 3.",
    },
    {
      k: "quiz",
      q: "Why does `type Graph = ([Int], [(Int, Int)])` keep a separate list of nodes?",
      options: [
        "It's faster",
        "So nodes with no edges at all are still part of the graph",
        "Haskell needs it to sort the edges",
        "It's not needed; it's always the ends of the edges",
      ],
      answer: 1,
      why: "A node with no edges never appears in the edge list. Without the node list it would vanish, and, for example, colouring would forget to colour it.",
    },
    {
      k: "predict",
      expr: "nub (concat [[a, b] | (a, b) <- [(1, 2), (2, 3)]])",
      answer: "[1, 2, 3]",
      why: "Both ends of every edge, `[1, 2, 2, 3]`, with the repeat removed.",
    },
    {
      k: "quiz",
      q: "In the undirected graph with edges `[(1, 2), (2, 3)]`, what are the neighbours of 2?",
      options: ["`[3]`", "`[1]`", "`[1, 3]`", "`[2]`"],
      answer: 2,
      why: "Undirected edges go both ways, so 2 is joined to 1 (through `(1, 2)`) and to 3 (through `(2, 3)`).",
    },
    {
      k: "write",
      body: "Write `successors n es`: in a directed graph, the nodes you can reach from `n` along one edge, in edge order.",
      starter: hs`successors :: Int -> [(Int, Int)] -> [Int]
successors n es = undefined
`,
      tests: [
        { expr: "successors 1 [(1, 2), (2, 3), (1, 4)]", expected: "[2, 4]" },
        { expr: "successors 3 [(1, 2), (2, 3)]", expected: "[]" },
        { expr: "successors 2 [(2, 2)]", expected: "[2]" },
        { expr: "successors 1 []", expected: "[]" },
      ],
      hint: "`[b | (a, b) <- es, a == n]`.",
      solution: hs`successors :: Int -> [(Int, Int)] -> [Int]
successors n es = [b | (a, b) <- es, a == n]
`,
    },
    {
      k: "predict",
      expr: "filter (\\(a, b) -> a /= 2 && b /= 2) [(1, 2), (2, 3), (1, 3)]",
      answer: "[(1, 3)]",
      why: "Only edges that touch neither end at 2 survive. This is the edge half of `removeNode`.",
    },
    {
      k: "quiz",
      q: "A `removeNode` that only filters the node list (not the edges) is used in 2021's colouring. What goes wrong?",
      options: [
        "Nothing",
        "Degrees and neighbours still count edges to the removed node",
        "It doesn't compile",
        "The node list gets duplicates",
      ],
      answer: 1,
      why: "Degree and neighbours are computed from the edges, so a node that was \"removed\" would still affect every node it was joined to.",
    },
    {
      k: "predict",
      expr: "length (filter (\\(a, b) -> a == 1 || b == 1) [(1, 2), (3, 1), (2, 3)])",
      answer: "2",
      why: "`(1, 2)` and `(3, 1)` touch node 1, so its degree is 2.",
    },
    {
      k: "write",
      body: "Write `predecessors n es`: in a directed graph, the nodes with an edge INTO `n`, in edge order.",
      starter: hs`predecessors :: Int -> [(Int, Int)] -> [Int]
predecessors n es = undefined
`,
      tests: [
        { expr: "predecessors 2 [(1, 2), (3, 2), (2, 4)]", expected: "[1, 3]" },
        { expr: "predecessors 1 [(1, 2)]", expected: "[]" },
        { expr: "predecessors 5 [(5, 5), (4, 5)]", expected: "[5, 4]" },
        { expr: "predecessors 0 []", expected: "[]" },
      ],
      hint: "Match on the second part of each edge: `[a | (a, b) <- es, b == n]`.",
      solution: hs`predecessors :: Int -> [(Int, Int)] -> [Int]
predecessors n es = [a | (a, b) <- es, b == n]
`,
    },
    {
      k: "quiz",
      q: "What is the visited list in a graph search for?",
      options: [
        "To return the answer in sorted order",
        "To avoid processing a node twice, which stops infinite loops on cycles",
        "To count the edges",
        "To store the edges still to explore",
      ],
      answer: 1,
      why: "Without it, a cycle sends the search round and round. With it, each node is expanded at most once, so the search must end.",
    },
    {
      k: "predict",
      expr: "[c | (1, c, _) <- [(1, 'a', 2), (2, 'b', 3), (1, 'c', 1)]]",
      answer: '"ac"',
      why: "A literal in a generator pattern filters: only triples whose first part is 1 match. Their characters are `'a'` and `'c'`.",
    },
    {
      k: "write",
      body: "Write `isolated`: the nodes of an undirected graph that touch no edge at all, in node-list order.",
      setup: graphSetup,
      starter: hs`isolated :: Graph -> [Int]
isolated g = undefined
`,
      tests: [
        { expr: "isolated ([1, 2, 3, 4], [(1, 2)])", expected: "[3, 4]" },
        { expr: "isolated ([1, 2], [(2, 1)])", expected: "[]" },
        { expr: "isolated ([7], [])", expected: "[7]" },
        { expr: "isolated ([], [])", expected: "[]" },
      ],
      hint: "`[n | n <- ns, null [() | (a, b) <- es, a == n || b == n]]`.",
      solution: hs`isolated :: Graph -> [Int]
isolated (ns, es) = [n | n <- ns, null [() | (a, b) <- es, a == n || b == n]]
`,
    },
    {
      k: "quiz",
      q: "Searching `[(1, 2), (2, 3), (3, 1)]` from 1, with a correct visited list. Which nodes are found?",
      options: ["`[1]`", "`[1, 2]`", "`[1, 2, 3]`", "It never stops"],
      answer: 2,
      why: "1 leads to 2, 2 to 3, and 3 back to 1, which is already visited, so the search stops with all three.",
    },
    {
      k: "predict",
      expr: "[(x, y) | x <- [1, 2, 3], y <- [x + 1 .. 3]]",
      answer: "[(1, 2), (1, 3), (2, 3)]",
      why: "The second generator can use `x`. This gives every pair once, with the smaller first: all possible undirected edges between 1, 2 and 3.",
    },
    {
      k: "quiz",
      q: "How many pairs does `[(a, b) | a <- [1, 2, 3], b <- \"xy\"]` contain?",
      options: ["5", "6", "3", "2"],
      answer: 1,
      why: "3 choices of `a` times 2 choices of `b`.",
    },
    {
      k: "predict",
      expr: "let { es = [(1, 2), (2, 3), (3, 1)]; go [] seen = seen; go (n : todo) seen = if elem n seen then go todo seen else go ([b | (a, b) <- es, a == n] ++ todo) (seen ++ [n]) } in go [2] []",
      answer: "[2, 3, 1]",
      why: "Start at 2, which leads to 3, which leads to 1, which leads back to 2, already seen. Nodes are listed in the order first visited.",
    },
    {
      k: "write",
      setup: graphSetup,
      body: "Write `addEdge (a, b) g`: add an undirected edge, also adding `a` and `b` to the node list (at the end) if they're new. Don't add the edge if it is already there in either direction.",
      starter: hs`addEdge :: (Int, Int) -> Graph -> Graph
addEdge e g = undefined
`,
      tests: [
        { expr: "addEdge (1, 2) ([1, 2], [])", expected: "([1, 2], [(1, 2)])" },
        { expr: "addEdge (2, 3) ([1, 2], [(1, 2)])", expected: "([1, 2, 3], [(1, 2), (2, 3)])" },
        { expr: "addEdge (2, 1) ([1, 2], [(1, 2)])", expected: "([1, 2], [(1, 2)])" },
        { expr: "addEdge (5, 6) ([], [])", expected: "([5, 6], [(5, 6)])" },
      ],
      hint: "New nodes: `ns ++ [x | x <- nub [a, b], notElem x ns]`. New edges: `es` if `(a, b)` or `(b, a)` is in it, else `es ++ [(a, b)]`.",
      solution: hs`addEdge :: (Int, Int) -> Graph -> Graph
addEdge (a, b) (ns, es) = (ns ++ [x | x <- nub [a, b], notElem x ns], es')
  where
    es'
      | elem (a, b) es || elem (b, a) es = es
      | otherwise = es ++ [(a, b)]
`,
    },
    {
      k: "predict",
      expr: "iterate (\\s -> nub (s ++ [b | (a, b) <- [(1, 2), (2, 3)], elem a s])) [1] !! 2",
      answer: "[1, 2, 3]",
      why: "Another way to find reachable nodes: repeatedly add every successor of the current set. After one round `[1, 2]`, after two `[1, 2, 3]`.",
    },
    {
      k: "quiz",
      q: "Using the repeated-growing method above, when can you stop?",
      options: [
        "After exactly as many rounds as there are edges",
        "When a round adds nothing new: the set has stopped changing",
        "When the set contains the start node",
        "Never; you must use a visited list",
      ],
      answer: 1,
      why: "If a round adds nothing, every later round adds nothing too. Stopping when `next == current` is called reaching a fixed point.",
    },
    {
      k: "write",
      body: "Write `within k start es`: the nodes reachable from `start` in at most `k` steps along directed edges, sorted, without duplicates. `within 0 s es` is `[s]`.",
      setup: graphSetup,
      starter: hs`within :: Int -> Int -> [(Int, Int)] -> [Int]
within k start es = undefined
`,
      tests: [
        { expr: "within 0 1 [(1, 2)]", expected: "[1]" },
        { expr: "within 1 1 [(1, 2), (2, 3)]", expected: "[1, 2]" },
        { expr: "within 2 1 [(1, 2), (2, 3), (3, 4)]", expected: "[1, 2, 3]" },
        { expr: "within 5 1 [(1, 2), (2, 1)]", expected: "[1, 2]" },
        { expr: "within 1 3 [(1, 2)]", expected: "[3]" },
      ],
      hint: "Recursion on `k`: `within 0 s _ = [s]`; otherwise take `ss = within (k - 1) start es`, and add every successor of a node in `ss`, then `sort (nub ...)`.",
      solution: hs`within :: Int -> Int -> [(Int, Int)] -> [Int]
within 0 s _ = [s]
within k s es = sort (nub (ss ++ [b | (a, b) <- es, elem a ss]))
  where
    ss = within (k - 1) s es
`,
    },
    {
      k: "write",
      setup: graphSetup + graphHelpers,
      body: md(
        "2021 exam task: `colourGraph maxC g` colours the nodes with colours `1 .. maxC` so that joined nodes differ. The setup gives `neighbours`, `degree` and `removeNode`. The algorithm:",
        "",
        "```",
        "no nodes:  []",
        "otherwise: pick n, the node with the smallest (degree n g, n)",
        "           colour the rest: cs = colourGraph maxC (removeNode n g)",
        "           n gets the smallest colour in [1 .. maxC] not used by any neighbour of n in cs,",
        "           or 0 if every colour is taken",
        "           result: (n, colour) : cs",
        "```",
      ),
      starter: hs`colourGraph :: Int -> Graph -> [(Int, Int)]
colourGraph maxC g = undefined
`,
      tests: [
        { expr: "colourGraph 2 ([], [])", expected: "[]" },
        { expr: "colourGraph 2 ([1, 2], [(1, 2)])", expected: "[(1, 2), (2, 1)]" },
        { expr: "colourGraph 3 ([1, 2, 3], [(1, 2), (2, 3), (3, 1)])", expected: "[(1, 3), (2, 2), (3, 1)]" },
        { expr: "colourGraph 2 ([1, 2, 3], [(1, 2), (2, 3), (3, 1)])", expected: "[(1, 0), (2, 2), (3, 1)]" },
        { expr: "colourGraph 2 ([1, 2, 3, 4], [(1, 2), (2, 3), (3, 4)])", expected: "[(1, 2), (2, 1), (3, 2), (4, 1)]" },
      ],
      hint: "`n = snd (minimum [(degree m g, m) | m <- fst g])`. The neighbours' colours: `used = [c | (m, c) <- cs, elem m (neighbours n g)]`. Then `[c | c <- [1 .. maxC], notElem c used]` and take the first, or 0 if empty.",
      solution: hs`colourGraph :: Int -> Graph -> [(Int, Int)]
colourGraph _ ([], _) = []
colourGraph maxC g = (n, colour) : cs
  where
    n = snd (minimum [(degree m g, m) | m <- fst g])
    cs = colourGraph maxC (removeNode n g)
    used = [c | (m, c) <- cs, elem m (neighbours n g)]
    colour = case [c | c <- [1 .. maxC], notElem c used] of
      (c : _) -> c
      [] -> 0
`,
    },
    {
      k: "write",
      setup: hs`import Data.List (nub, sort)

data Label = C Char | Eps
  deriving (Eq, Show)

type Transition = (Int, Int, Label)
`,
      body: md(
        "2014 exam task: `closure ts ss` is every state reachable from the states `ss` using only `Eps` (empty) transitions, including the states in `ss` themselves. Return it sorted without duplicates. Watch out for cycles of `Eps` transitions.",
      ),
      starter: hs`closure :: [Transition] -> [Int] -> [Int]
closure ts ss = undefined
`,
      tests: [
        { expr: "closure [(1, 2, Eps), (2, 3, Eps), (3, 4, C 'a')] [1]", expected: "[1, 2, 3]" },
        { expr: "closure [(1, 2, C 'a')] [1]", expected: "[1]" },
        { expr: "closure [(1, 2, Eps), (2, 1, Eps)] [2]", expected: "[1, 2]" },
        { expr: "closure [(1, 3, Eps), (2, 4, Eps)] [1, 2]", expected: "[1, 2, 3, 4]" },
        { expr: "closure [] [5]", expected: "[5]" },
      ],
      hint: "A search with a to-do list (start with `ss`) and a visited list. The successors of `n` are `[t | (s, t, Eps) <- ts, s == n]`. Finish with `sort`.",
      solution: hs`closure :: [Transition] -> [Int] -> [Int]
closure ts ss = sort (go ss [])
  where
    go [] seen = seen
    go (n : todo) seen
      | elem n seen = go todo seen
      | otherwise = go ([t | (s, t, Eps) <- ts, s == n] ++ todo) (n : seen)
`,
    },
    {
      k: "write",
      setup: fsmSetup,
      body: "2012 exam style: run a deterministic machine. `run ts s input` follows one transition per character from state `s`, and gives `Just` the final state, or `Nothing` if at some point there's no transition for the character.",
      starter: hs`run :: [Transition] -> Int -> String -> Maybe Int
run ts s input = undefined
`,
      tests: [
        { expr: 'run [(1, \'a\', 2), (2, \'b\', 1)] 1 "abab"', expected: "Just 1" },
        { expr: 'run [(1, \'a\', 2), (2, \'b\', 1)] 1 "aa"', expected: "Nothing" },
        { expr: 'run [(1, \'a\', 2)] 1 ""', expected: "Just 1" },
        { expr: 'run [(1, \'a\', 2), (2, \'a\', 3), (3, \'b\', 3)] 1 "aabbb"', expected: "Just 3" },
      ],
      hint: "`run _ s [] = Just s`. For `c : cs`, look for `[t | (from, ch, t) <- ts, from == s, ch == c]`: if it's `(t : _)`, carry on from `t`; if `[]`, give `Nothing`.",
      solution: hs`run :: [Transition] -> Int -> String -> Maybe Int
run _ s [] = Just s
run ts s (c : cs) = case [t | (from, ch, t) <- ts, from == s, ch == c] of
  (t : _) -> run ts t cs
  [] -> Nothing
`,
    },
    {
      k: "write",
      setup: graphSetup,
      body: "2021 exam style: a colouring is a list of `(node, colour)`, where colour 0 means uncoloured. Write `validColouring g cs`: `True` if no edge joins two nodes with the same non-zero colour. Assume every node is in `cs`.",
      starter: hs`validColouring :: Graph -> [(Int, Int)] -> Bool
validColouring g cs = undefined
`,
      tests: [
        { expr: "validColouring ([1, 2], [(1, 2)]) [(1, 1), (2, 2)]", expected: "True" },
        { expr: "validColouring ([1, 2], [(1, 2)]) [(1, 1), (2, 1)]", expected: "False" },
        { expr: "validColouring ([1, 2], [(1, 2)]) [(1, 0), (2, 0)]", expected: "True" },
        { expr: "validColouring ([1, 2, 3], [(1, 2), (2, 3)]) [(1, 1), (2, 2), (3, 1)]", expected: "True" },
        { expr: "validColouring ([1, 2, 3], []) [(1, 1), (2, 1), (3, 1)]", expected: "True" },
      ],
      hint: "`all ok es` where `ok (a, b)` looks up both colours and is `True` if either is 0 or they differ.",
      solution: hs`validColouring :: Graph -> [(Int, Int)] -> Bool
validColouring (_, es) cs = all ok es
  where
    colourOf n = case lookup n cs of
      Just c -> c
      Nothing -> 0
    ok (a, b) = colourOf a == 0 || colourOf b == 0 || colourOf a /= colourOf b
`,
    },
    {
      k: "write",
      setup: fsmSetup,
      body: "2012 exam task, from scratch: `pruneTransitions start ts` keeps, in order, only the transitions whose source state can be reached from `start`. The machine may have cycles.",
      starter: hs`pruneTransitions :: Int -> [Transition] -> [Transition]
pruneTransitions start ts = undefined
`,
      tests: [
        { expr: "pruneTransitions 1 [(1, 'a', 2), (2, 'a', 1), (3, 'a', 1)]", expected: "[(1, 'a', 2), (2, 'a', 1)]" },
        { expr: "pruneTransitions 3 [(1, 'a', 2), (3, 'b', 3)]", expected: "[(3, 'b', 3)]" },
        {
          expr: "pruneTransitions 1 [(4, 'z', 5), (1, 'a', 2), (2, 'b', 4), (6, 'c', 1)]",
          expected: "[(4, 'z', 5), (1, 'a', 2), (2, 'b', 4)]",
        },
        { expr: "pruneTransitions 1 [(2, 'a', 3)]", expected: "[]" },
      ],
      hint: "Reachable states first (to-do list plus visited list, successors `[t | (s, _, t) <- ts, s == n]`), then filter the transitions by source.",
      solution: hs`pruneTransitions :: Int -> [Transition] -> [Transition]
pruneTransitions start ts = [t | t@(s, _, _) <- ts, elem s rs]
  where
    rs = go [start] []
    go [] seen = seen
    go (n : todo) seen
      | elem n seen = go todo seen
      | otherwise = go ([t | (s, _, t) <- ts, s == n] ++ todo) (n : seen)
`,
    },
  ],
};

const satSetup = hs`import Data.List (nub, sort)

data Formula = Var String | Not Formula | And Formula Formula | Or Formula Formula
  deriving (Eq, Show)

evalF :: [(String, Bool)] -> Formula -> Bool
evalF env (Var v) = case lookup v env of
  Just b -> b
  Nothing -> error "unbound"
evalF env (Not f) = not (evalF env f)
evalF env (And a b) = evalF env a && evalF env b
evalF env (Or a b) = evalF env a || evalF env b

vars :: Formula -> [String]
vars (Var v) = [v]
vars (Not f) = vars f
vars (And a b) = sort (nub (vars a ++ vars b))
vars (Or a b) = sort (nub (vars a ++ vars b))

assignments :: [String] -> [[(String, Bool)]]
assignments [] = [[]]
assignments (v : vs) = [(v, b) : rest | b <- [True, False], rest <- assignments vs]
`;

const propagateSetup = hs`propagate :: Int -> [[Int]] -> [[Int]]
propagate l cs = [filter (/= negate l) c | c <- cs, notElem l c]
`;

const search: Lesson = {
  id: "search",
  title: "Searching for all solutions",
  blurb: "Lists of solutions, the [] versus [[]] base case, and trying every choice.",
  steps: [
    {
      k: "read",
      body: md(
        "Some exam questions don't have one answer; they ask for all of them. All the ways to make an amount. All the assignments that make a formula true (2009, 2019). All the paths through a machine (2012, 2014).",
        "",
        "If one solution is a list, then all the solutions are a list of lists:",
        "",
        "```",
        "subsets :: [a] -> [[a]]",
        "subsets [1, 2]   is  [[1, 2], [1], [2], []]",
        "```",
        "",
        "Each inner list is one solution. The outer list holds all of them.",
      ),
    },
    {
      k: "read",
      body: md(
        "The base case is where people lose marks. There are two different \"empty\" answers:",
        "",
        "```",
        "[]      -- no solutions at all: this search failed",
        "[[]]    -- exactly one solution, and that solution is empty",
        "```",
        "",
        "How many subsets does the empty list have? One: the empty set. So `subsets [] = [[]]`. If you wrote `[]` instead, you'd be saying \"there's no way to pick a subset\", and that \"no solutions\" would spread through every bigger answer.",
      ),
    },
    {
      k: "quiz",
      q: "How many solutions does `[[]]` represent?",
      options: ["None", "One (an empty one)", "Two", "It's a type error"],
      answer: 1,
      why: "The outer list has one element, and that element is the empty list. So there's one solution, and it happens to be empty. `[]` would be no solutions.",
    },
    {
      k: "predict",
      expr: "(length ([] :: [[Int]]), length ([[]] :: [[Int]]))",
      answer: "(0, 1)",
      why: "`[]` is a list of no solutions; `[[]]` is a list containing one (empty) solution.",
    },
    {
      k: "read",
      body: md(
        "To build bigger solutions from smaller ones, put a choice on the front of every sub-solution with `map (x :)`:",
        "",
        "```",
        "subsets []       = [[]]",
        "subsets (x : xs) = map (x :) rest ++ rest",
        "  where",
        "    rest = subsets xs",
        "```",
        "",
        "Every subset either includes `x` or it doesn't. The ones that include it are the subsets of `xs` with `x` stuck on the front; the ones that don't are just the subsets of `xs`.",
      ),
    },
    {
      k: "predict",
      expr: "map (1 :) [[2], [], [3, 4]]",
      answer: "[[1, 2], [1], [1, 3, 4]]",
      why: "`(1 :)` is put on the front of each solution, including the empty one, which becomes `[1]`.",
    },
    {
      k: "write",
      body: "Write `subsets`. Keep the order shown: subsets with `x` first, then those without. `subsets [1, 2]` is `[[1, 2], [1], [2], []]`.",
      starter: hs`subsets :: [a] -> [[a]]
subsets xs = undefined
`,
      tests: [
        { expr: "subsets [1, 2 :: Int]", expected: "[[1, 2], [1], [2], []]" },
        { expr: "subsets ([] :: [Int])", expected: "[[]]" },
        { expr: 'subsets "abc"', expected: '["abc", "ab", "ac", "a", "bc", "b", "c", ""]' },
        { expr: "length (subsets [1 .. 10 :: Int])", expected: "1024" },
      ],
      hint: "`subsets [] = [[]]`, and `subsets (x : xs) = map (x :) rest ++ rest` where `rest = subsets xs`.",
      solution: hs`subsets :: [a] -> [[a]]
subsets [] = [[]]
subsets (x : xs) = map (x :) rest ++ rest
  where
    rest = subsets xs
`,
    },
    {
      k: "quiz",
      q: "What would `subsets [1, 2]` give if the base case were `subsets [] = []`?",
      options: ["`[[1, 2], [1], [2], []]`", "`[[1, 2]]`", "`[]`", "`[[]]`"],
      answer: 2,
      why: "`subsets [2]` would be `map (2 :) [] ++ []`, which is `[]`, and so on upwards. Mapping over no solutions gives no solutions. One wrong base case wipes out everything.",
    },
    {
      k: "read",
      body: md(
        "A classic exam search: all the ways to give each variable `True` or `False`. Each solution is an assignment, a list of `(name, value)` pairs:",
        "",
        "```",
        "assignments :: [String] -> [[(String, Bool)]]",
        "assignments []       = [[]]",
        "assignments (v : vs) = [(v, b) : rest | b <- [True, False], rest <- assignments vs]",
        "```",
        "",
        "With no variables there is exactly one assignment: the empty one. Otherwise choose a value `b` for `v`, and combine it with every assignment of the remaining variables. `n` variables give `2 ^ n` assignments.",
      ),
    },
    {
      k: "write",
      body: "Write `assignments`, trying `True` before `False` for each variable.",
      starter: hs`assignments :: [String] -> [[(String, Bool)]]
assignments vs = undefined
`,
      tests: [
        { expr: 'assignments ["a"]', expected: '[[("a", True)], [("a", False)]]' },
        { expr: "assignments []", expected: "[[]]" },
        {
          expr: 'assignments ["x", "y"]',
          expected: '[[("x", True), ("y", True)], [("x", True), ("y", False)], [("x", False), ("y", True)], [("x", False), ("y", False)]]',
        },
        { expr: 'length (assignments ["a", "b", "c"])', expected: "8" },
      ],
      hint: "Base case `[[]]`. Then a comprehension with two generators: `b <- [True, False]` and `rest <- assignments vs`.",
      solution: hs`assignments :: [String] -> [[(String, Bool)]]
assignments [] = [[]]
assignments (v : vs) = [(v, b) : rest | b <- [True, False], rest <- assignments vs]
`,
    },
    {
      k: "predict",
      body: "A shortcut worth knowing: `sequence` on a list of lists picks one element from each list, in every possible way.",
      expr: "sequence [[1, 2], [3]]",
      answer: "[[1, 3], [2, 3]]",
      why: "Choose from the first list (1 or 2), then from the second (only 3). Two choices times one choice is two solutions.",
    },
    {
      k: "read",
      body: md(
        "Often you don't need the solutions themselves, only whether one exists. Then use `any`: it's `True` if at least one branch succeeds, and it stops as soon as it finds one.",
        "",
        "2009's `sat` is a formula satisfiability check: is there any assignment that makes the formula true?",
        "",
        "```",
        "satisfiable :: Formula -> Bool",
        "satisfiable f = any (\\env -> evalF env f) (assignments (vars f))",
        "```",
        "",
        "And if you want the actual solutions, use `filter` with the same test instead of `any`.",
      ),
    },
    {
      k: "write",
      setup: satSetup,
      body: "The setup gives `evalF`, `vars` and `assignments`. Write `satisfiable` (is any assignment of the formula's variables true?) and `models` (all the assignments that make it true, in the order `assignments` gives them).",
      starter: hs`satisfiable :: Formula -> Bool
satisfiable f = undefined

models :: Formula -> [[(String, Bool)]]
models f = undefined
`,
      tests: [
        { expr: 'satisfiable (And (Var "a") (Not (Var "a")))', expected: "False" },
        { expr: 'satisfiable (Or (Var "a") (Var "b"))', expected: "True" },
        { expr: 'models (And (Var "a") (Not (Var "b")))', expected: '[[("a", True), ("b", False)]]' },
        { expr: 'models (Or (Var "a") (Var "b"))', expected: '[[("a", True), ("b", True)], [("a", True), ("b", False)], [("a", False), ("b", True)]]' },
        { expr: 'models (And (Var "p") (Not (Var "p")))', expected: "[]" },
      ],
      hint: "`satisfiable f = any (\\env -> evalF env f) (assignments (vars f))`; `models` is the same with `filter`.",
      solution: hs`satisfiable :: Formula -> Bool
satisfiable f = any (\env -> evalF env f) (assignments (vars f))

models :: Formula -> [[(String, Bool)]]
models f = filter (\env -> evalF env f) (assignments (vars f))
`,
    },
    {
      k: "quiz",
      q: "A search function tries every option with `any`, but there are no options at all (the list is empty). What does `any` give?",
      options: ["`True`", "`False`", "It crashes", "`[]`"],
      answer: 1,
      why: "No branch succeeded, because there were no branches, so the answer is `False`. This is exactly what you want for a dead end: no way forward means failure.",
    },
    {
      k: "read",
      body: md(
        "State machines use the same idea. A non-deterministic machine (2012, 2014) can have several transitions for the same character. It accepts a string if ANY path through it ends in a final state:",
        "",
        "```",
        "accepts :: [Transition] -> [Int] -> Int -> String -> Bool",
        "accepts ts finals s []       = s `elem` finals",
        "accepts ts finals s (c : cs) = any (\\t -> accepts ts finals t cs) nexts",
        "  where",
        "    nexts = [t | (from, ch, t) <- ts, from == s, ch == c]",
        "```",
        "",
        "When the input runs out, succeed if you're in a final state. Otherwise try every possible next state; any success is enough. No possible next state means `any` gets `[]`: a dead end, `False`.",
      ),
    },
    {
      k: "write",
      setup: fsmSetup,
      body: "Write `accepts ts finals s input` as described above.",
      starter: hs`accepts :: [Transition] -> [Int] -> Int -> String -> Bool
accepts ts finals s input = undefined
`,
      tests: [
        { expr: 'accepts [(1, \'a\', 2)] [2] 1 "a"', expected: "True" },
        { expr: 'accepts [(1, \'a\', 2)] [2] 1 "aa"', expected: "False" },
        { expr: 'accepts [(1, \'a\', 1), (1, \'a\', 2), (2, \'b\', 3)] [3] 1 "aaab"', expected: "True" },
        { expr: 'accepts [(1, \'a\', 1), (1, \'a\', 2), (2, \'b\', 3)] [3] 1 "aaba"', expected: "False" },
        { expr: 'accepts [] [1] 1 ""', expected: "True" },
        { expr: 'accepts [(1, \'x\', 2)] [1] 1 "y"', expected: "False" },
      ],
      hint: "Two equations: input empty, check `elem s finals`; otherwise `any` over the next states, calling `accepts` with the rest of the input.",
      solution: hs`accepts :: [Transition] -> [Int] -> Int -> String -> Bool
accepts _ finals s [] = elem s finals
accepts ts finals s (c : cs) = any (\t -> accepts ts finals t cs) nexts
  where
    nexts = [t | (from, ch, t) <- ts, from == s, ch == c]
`,
    },
    {
      k: "predict",
      expr: "or [x * y == 12 | x <- [1 .. 4], y <- [1 .. 4]]",
      answer: "True",
      why: "`or` of a list of Bools is like `any`: `3 * 4` is 12, so at least one is True.",
    },
    {
      k: "read",
      body: md(
        "Permutations (all orderings) use the same tools. Choose which element goes first, then put it on the front of every ordering of the rest:",
        "",
        "```",
        "perms :: Eq a => [a] -> [[a]]",
        "perms [] = [[]]",
        "perms xs = [x : p | x <- xs, p <- perms (delete x xs)]",
        "```",
        "",
        "`delete x xs` (from `Data.List`) removes the first `x`. Again the base case is `[[]]`: there's exactly one way to order nothing.",
      ),
    },
    {
      k: "predict",
      expr: '[x : p | x <- "ab", p <- ["c"]]',
      answer: '["ac", "bc"]',
      why: "Each choice of `x` is put on the front of each sub-solution `p`.",
    },
    {
      k: "write",
      setup: hs`import Data.List (delete)
`,
      body: "Write `perms`, all orderings of a list, in the order the comprehension above gives. Don't use `permutations`.",
      starter: hs`perms :: Eq a => [a] -> [[a]]
perms xs = undefined
`,
      tests: [
        { expr: "perms [1, 2, 3 :: Int]", expected: "[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]" },
        { expr: "perms ([] :: [Int])", expected: "[[]]" },
        { expr: 'perms "ab"', expected: '["ab", "ba"]' },
        { expr: "length (perms [1 .. 5 :: Int])", expected: "120" },
      ],
      banned: ["permutations"],
      hint: "`perms [] = [[]]` and `perms xs = [x : p | x <- xs, p <- perms (delete x xs)]`.",
      solution: hs`perms :: Eq a => [a] -> [[a]]
perms [] = [[]]
perms xs = [x : p | x <- xs, p <- perms (delete x xs)]
`,
    },
    {
      k: "read",
      body: md(
        "Backtracking means: make a choice, carry on, and if that leads nowhere, come back and try the next choice. In Haskell you get it for free: write every choice as a branch, and dead ends just return `[]`, which disappears when the branches are joined with `++`.",
        "",
        "All the ways to pick numbers from a list (in order, each at most once) that add up to a target `t`, with all numbers positive:",
        "",
        "```",
        "sums :: Int -> [Int] -> [[Int]]",
        "sums 0 _  = [[]]                 -- reached the target: one solution, pick nothing more",
        "sums _ [] = []                   -- target not reached, nothing left: dead end",
        "sums t (x : xs)",
        "  | x > t     = sums t xs        -- x is too big: can only skip it",
        "  | otherwise = map (x :) (sums (t - x) xs) ++ sums t xs   -- use x, or skip it",
        "```",
      ),
    },
    {
      k: "quiz",
      q: "Why must `sums 0 _ = [[]]` come before `sums _ [] = []`?",
      options: [
        "It doesn't matter",
        "Because `sums 0 []` means the target was reached exactly as the list ran out, which is a success",
        "Because 0 is smaller than []",
        "To avoid a type error",
      ],
      answer: 1,
      why: "Both equations match `sums 0 []`. The first one that matches wins, and the right answer there is one solution, not none. Swap them and you lose every solution that uses the last number.",
    },
    {
      k: "write",
      body: "Write `sums t xs` as above: all the ways to choose elements of `xs` (keeping their order) that add up to `t`. All numbers are positive.",
      starter: hs`sums :: Int -> [Int] -> [[Int]]
sums t xs = undefined
`,
      tests: [
        { expr: "sums 5 [1, 2, 3, 4]", expected: "[[1, 4], [2, 3]]" },
        { expr: "sums 0 [1, 2]", expected: "[[]]" },
        { expr: "sums 7 [1, 2]", expected: "[]" },
        { expr: "sums 6 [1, 2, 3, 4, 5]", expected: "[[1, 2, 3], [1, 5], [2, 4]]" },
        { expr: "sums 3 [3]", expected: "[[3]]" },
      ],
      hint: "Four equations/guards as in the lesson: `[[]]` for target 0, `[]` for an empty list, skip `x` if it is too big, otherwise use it or skip it.",
      solution: hs`sums :: Int -> [Int] -> [[Int]]
sums 0 _ = [[]]
sums _ [] = []
sums t (x : xs)
  | x > t = sums t xs
  | otherwise = map (x :) (sums (t - x) xs) ++ sums t xs
`,
    },
    {
      k: "read",
      body: md(
        "2019's `dp` is a backtracking SAT solver. A formula in CNF is a list of clauses, each a list of literals: `3` means \"variable 3 is true\", `-3` means \"variable 3 is false\". A clause is satisfied if any of its literals is.",
        "",
        "Choosing a literal `l` to be true simplifies the clauses (this is given to you as `propagate`):",
        "",
        "```",
        "propagate l cs = [filter (/= negate l) c | c <- cs, notElem l c]",
        "```",
        "",
        "Clauses containing `l` are now satisfied, so they go. The opposite literal can no longer help, so it's removed from the others. Then the search (a simplified version of 2019's):",
        "",
        "```",
        "no clauses left           [[]]   -- everything satisfied: one solution, nothing more to choose",
        "some clause is empty      []     -- that clause can't be satisfied: dead end",
        "otherwise                 pick l, the first literal of the first clause;",
        "                          solutions with l true, each starting with l,",
        "                          then solutions with l false, each starting with negate l",
        "```",
      ),
    },
    {
      k: "write",
      setup: propagateSetup,
      body: "Write `dp` as described. The setup gives `propagate`.",
      starter: hs`dp :: [[Int]] -> [[Int]]
dp cs = undefined
`,
      tests: [
        { expr: "dp []", expected: "[[]]" },
        { expr: "dp [[1]]", expected: "[[1]]" },
        { expr: "dp [[1, 2]]", expected: "[[1], [-1, 2]]" },
        { expr: "dp [[1], [-1]]", expected: "[]" },
        { expr: "dp [[1, 2], [-1]]", expected: "[[-1, 2]]" },
        { expr: "dp [[1, -2], [2, 3]]", expected: "[[1, 2], [1, -2, 3], [-1, -2, 3]]" },
      ],
      hint: "Guards: `null cs` gives `[[]]`; `any null cs` gives `[]`; otherwise with `l = head (head cs)`, `map (l :) (dp (propagate l cs)) ++ map (negate l :) (dp (propagate (negate l) cs))`.",
      solution: hs`dp :: [[Int]] -> [[Int]]
dp cs
  | null cs = [[]]
  | any null cs = []
  | otherwise = map (l :) (dp (propagate l cs)) ++ map (negate l :) (dp (propagate (negate l) cs))
  where
    l = head (head cs)
`,
    },
    {
      k: "quiz",
      q: "In `dp`, why does an empty list of clauses give `[[]]` but an empty clause give `[]`?",
      options: [
        "They're the same thing",
        "No clauses means nothing left to satisfy (one solution); an empty clause has no literal that could make it true (no solutions)",
        "An empty clause means the formula is true",
        "It's just a convention with no effect",
      ],
      answer: 1,
      why: "These are the two base cases of any search: success with nothing more to add (`[[]]`), and failure (`[]`). Mixing them up either loses every solution or invents fake ones.",
    },
    {
      k: "predict",
      expr: "concatMap (\\x -> [[x, y] | y <- [x + 1 .. 3]]) [1, 2, 3]",
      answer: "[[1, 2], [1, 3], [2, 3]]",
      why: "For each `x`, make the solutions starting with `x`, then join all the lists of solutions. For `x = 3` there are none, which adds nothing.",
    },
    {
      k: "read",
      body: md(
        "Summary:",
        "",
        "- All solutions: a list of lists. `[]` means no solutions; `[[]]` means one empty solution.",
        "- The success base case gives `[[]]`; the dead end gives `[]`.",
        "- Add a choice to every sub-solution with `map (x :)` or `[x : p | p <- ...]`, and join branches with `++`.",
        "- Only need yes or no? `any` over the branches (2009 `sat`, 2012 and 2014 `accepts`).",
        "- Backtracking (2019 `dp`) is just branches that may return `[]`.",
      ),
    },
  ],
};

const searchDrills: DrillSet = {
  id: "drill-search",
  lesson: "search",
  title: "Searching drills",
  drills: [
    {
      k: "predict",
      expr: 'map (\'a\' :) ["b", "", "cd"]',
      answer: '["ab", "a", "acd"]',
      why: "`'a'` goes on the front of each string, including the empty one.",
    },
    {
      k: "quiz",
      q: "A function returning all solutions gives `[]`. What does that mean?",
      options: ["One empty solution", "There are no solutions", "It crashed", "Every solution is empty"],
      answer: 1,
      why: "The outer list holds the solutions, and it's empty. One empty solution would be `[[]]`.",
    },
    {
      k: "predict",
      expr: "concat [[[1]], [], [[2], [3]]]",
      answer: "[[1], [2], [3]]",
      why: "Joining the solution lists of three branches. The middle branch found nothing, so it adds nothing.",
    },
    {
      k: "quiz",
      q: "How many subsets does `[1, 2, 3]` have?",
      options: ["3", "6", "7", "8"],
      answer: 3,
      why: "Each element is either in or out: 2 * 2 * 2 = 8, counting the empty set and the whole set.",
    },
    {
      k: "write",
      body: "Write `prefixAll x sols`, which puts `x` on the front of every solution in `sols`.",
      starter: hs`prefixAll :: a -> [[a]] -> [[a]]
prefixAll x sols = undefined
`,
      tests: [
        { expr: "prefixAll 1 [[2], [3, 4 :: Int]]", expected: "[[1, 2], [1, 3, 4]]" },
        { expr: "prefixAll 'z' [\"\"]", expected: '["z"]' },
        { expr: "prefixAll 1 ([] :: [[Int]])", expected: "[]" },
        { expr: 'prefixAll \'a\' ["b", "", "c"]', expected: '["ab", "a", "ac"]' },
      ],
      hint: "`map (x :) sols`.",
      solution: hs`prefixAll :: a -> [[a]] -> [[a]]
prefixAll x sols = map (x :) sols
`,
    },
    {
      k: "predict",
      expr: "sequence [[1, 2], [3, 4]]",
      answer: "[[1, 3], [1, 4], [2, 3], [2, 4]]",
      why: "One element from each list, in every possible way; the last list changes fastest.",
    },
    {
      k: "quiz",
      q: "What is `any (\\t -> t > 0) []`?",
      options: ["`True`", "`False`", "An error", "Depends on `t`"],
      answer: 1,
      why: "With no branches, none can succeed. A search with no options left fails.",
    },
    {
      k: "predict",
      expr: "[[x, y] | x <- [True, False], y <- [True, False], x || y]",
      answer: "[[True, True], [True, False], [False, True]]",
      why: "All four combinations, keeping only those where at least one is True. This is a brute-force search for the models of `x || y`.",
    },
    {
      k: "write",
      body: "Write `bitStrings n`: all strings of length `n` made of `'0'` and `'1'`, with `'0'` tried first. `bitStrings 2` is `[\"00\", \"01\", \"10\", \"11\"]`.",
      starter: hs`bitStrings :: Int -> [String]
bitStrings n = undefined
`,
      tests: [
        { expr: "bitStrings 2", expected: '["00", "01", "10", "11"]' },
        { expr: "bitStrings 0", expected: '[""]' },
        { expr: "bitStrings 1", expected: '["0", "1"]' },
        { expr: "length (bitStrings 5)", expected: "32" },
      ],
      hint: "`bitStrings 0 = [\"\"]` (one empty string). Otherwise `[c : rest | c <- \"01\", rest <- bitStrings (n - 1)]`.",
      solution: hs`bitStrings :: Int -> [String]
bitStrings 0 = [""]
bitStrings n = [c : rest | c <- "01", rest <- bitStrings (n - 1)]
`,
    },
    {
      k: "quiz",
      q: "What should `bitStrings 0` be?",
      options: ['`[]`', '`[""]`', '`["0"]`', '`""`'],
      answer: 1,
      why: "There's exactly one string of length 0, the empty string. `[]` would make every longer case empty too.",
    },
    {
      k: "predict",
      expr: 'length (sequence (replicate 4 "ab"))',
      answer: "16",
      why: "Four positions, each with 2 choices: 2 ^ 4 = 16 strings.",
    },
    {
      k: "write",
      body: "Write `choose k xs`: all the ways to pick exactly `k` elements of `xs`, keeping their order. `choose 2 \"abc\"` is `[\"ab\", \"ac\", \"bc\"]`.",
      starter: hs`choose :: Int -> [a] -> [[a]]
choose k xs = undefined
`,
      tests: [
        { expr: 'choose 2 "abc"', expected: '["ab", "ac", "bc"]' },
        { expr: 'choose 0 "abc"', expected: '[""]' },
        { expr: 'choose 4 "abc"', expected: "[]" },
        { expr: "choose 1 [1, 2, 3 :: Int]", expected: "[[1], [2], [3]]" },
        { expr: "length (choose 3 [1 .. 6 :: Int])", expected: "20" },
      ],
      hint: "`choose 0 _ = [[]]`, `choose _ [] = []`, and `choose k (x : xs) = map (x :) (choose (k - 1) xs) ++ choose k xs`.",
      solution: hs`choose :: Int -> [a] -> [[a]]
choose 0 _ = [[]]
choose _ [] = []
choose k (x : xs) = map (x :) (choose (k - 1) xs) ++ choose k xs
`,
    },
    {
      k: "quiz",
      q: "In `choose`, what should `choose 0 []` be?",
      options: ["`[]`, because the list is empty", "`[[]]`, because choosing nothing from nothing is one way", "An error", "`[0]`"],
      answer: 1,
      why: "You need 0 more elements and you have them: that's a success. The `choose 0 _` equation must come before `choose _ []` so this case gets `[[]]`.",
    },
    {
      k: "predict",
      expr: "filter ((== 5) . sum) [[x, y] | x <- [1 .. 4], y <- [x + 1 .. 4]]",
      answer: "[[1, 4], [2, 3]]",
      why: "Generate every pair with `x < y`, then keep the ones that add to 5. Generate-then-filter is the simplest search.",
    },
    {
      k: "quiz",
      q: "What is `map (5 :) []`?",
      options: ["`[[5]]`", "`[5]`", "`[]`", "An error"],
      answer: 2,
      why: "There are no solutions to extend, so there still are none. That's why a dead end (`[]`) stays a dead end however many choices are added above it.",
    },
    {
      k: "predict",
      expr: 'let { ps [] = [[]]; ps (x : xs) = [x : p | p <- ps xs] ++ ps xs } in length (ps "abcd")',
      answer: "16",
      why: "This is `subsets`: 4 elements give 2 ^ 4 = 16 subsets.",
    },
    {
      k: "write",
      body: "Write `paths es a b`: every path from `a` to `b` in a directed graph with no cycles, as the list of nodes visited (starting with `a`, ending with `b`). Follow edges in edge order.",
      starter: hs`paths :: [(Int, Int)] -> Int -> Int -> [[Int]]
paths es a b = undefined
`,
      tests: [
        { expr: "paths [(1, 2), (2, 3)] 1 3", expected: "[[1, 2, 3]]" },
        { expr: "paths [(1, 2), (1, 3), (2, 4), (3, 4)] 1 4", expected: "[[1, 2, 4], [1, 3, 4]]" },
        { expr: "paths [(1, 2)] 2 1", expected: "[]" },
        { expr: "paths [] 5 5", expected: "[[5]]" },
        { expr: "paths [(1, 2), (2, 3), (1, 3)] 1 3", expected: "[[1, 2, 3], [1, 3]]" },
      ],
      hint: "If `a == b`, the one path is `[[b]]`. Otherwise `[a : p | (x, y) <- es, x == a, p <- paths es y b]`; a dead end gives `[]` automatically.",
      solution: hs`paths :: [(Int, Int)] -> Int -> Int -> [[Int]]
paths es a b
  | a == b = [[b]]
  | otherwise = [a : p | (x, y) <- es, x == a, p <- paths es y b]
`,
    },
    {
      k: "quiz",
      q: "In `paths`, node `a` has no outgoing edges and isn't `b`. What does the comprehension give?",
      options: ["`[[a]]`", "`[]`", "It loops", "`[[]]`"],
      answer: 1,
      why: "There are no edges to choose from, so the comprehension produces nothing: no paths from here. Dead ends need no special case.",
    },
    {
      k: "predict",
      expr: "or [a && not b | a <- [True, False], b <- [True, False]]",
      answer: "True",
      why: "`a = True, b = False` makes it true. Trying every assignment and asking whether any works is brute-force satisfiability.",
    },
    {
      k: "write",
      body: "Write `canMake t xs`: can some selection of the (positive) numbers in `xs`, each used at most once, add up exactly to `t`? Answer with a Bool, using `||` to try both branches.",
      starter: hs`canMake :: Int -> [Int] -> Bool
canMake t xs = undefined
`,
      tests: [
        { expr: "canMake 5 [1, 2, 3]", expected: "True" },
        { expr: "canMake 7 [1, 2, 3]", expected: "False" },
        { expr: "canMake 0 []", expected: "True" },
        { expr: "canMake 6 [4, 5, 2]", expected: "True" },
        { expr: "canMake 1 [2, 3]", expected: "False" },
      ],
      hint: "`canMake 0 _ = True`, `canMake _ [] = False`, then `canMake (t - x) xs || canMake t xs` (only use `x` if `x <= t`).",
      solution: hs`canMake :: Int -> [Int] -> Bool
canMake 0 _ = True
canMake _ [] = False
canMake t (x : xs) = (x <= t && canMake (t - x) xs) || canMake t xs
`,
    },
    {
      k: "write",
      setup: hs`data BExp = Prim Bool | IdRef Int | Not BExp | And BExp BExp | Or BExp BExp
  deriving (Eq, Show)

evalB :: [(Int, Bool)] -> BExp -> Bool
evalB _ (Prim b) = b
evalB env (IdRef i) = case lookup i env of
  Just b -> b
  Nothing -> error "unbound"
evalB env (Not e) = not (evalB env e)
evalB env (And a b) = evalB env a && evalB env b
evalB env (Or a b) = evalB env a || evalB env b
`,
      body: "2009 exam style: write `allAssignments` (every way to give each variable `True` or `False`, `True` first), and `sat e vs`, the assignments of the variables `vs` that make `e` true, in that order.",
      starter: hs`allAssignments :: [Int] -> [[(Int, Bool)]]
allAssignments vs = undefined

sat :: BExp -> [Int] -> [[(Int, Bool)]]
sat e vs = undefined
`,
      tests: [
        { expr: "allAssignments []", expected: "[[]]" },
        { expr: "allAssignments [1, 2]", expected: "[[(1, True), (2, True)], [(1, True), (2, False)], [(1, False), (2, True)], [(1, False), (2, False)]]" },
        { expr: "sat (And (IdRef 1) (Not (IdRef 2))) [1, 2]", expected: "[[(1, True), (2, False)]]" },
        { expr: "sat (And (IdRef 1) (Not (IdRef 1))) [1]", expected: "[]" },
        { expr: "sat (Prim True) []", expected: "[[]]" },
      ],
      hint: "`allAssignments` has base case `[[]]` and a two-generator comprehension. `sat e vs = filter (\\env -> evalB env e) (allAssignments vs)`.",
      solution: hs`allAssignments :: [Int] -> [[(Int, Bool)]]
allAssignments [] = [[]]
allAssignments (v : vs) = [(v, b) : rest | b <- [True, False], rest <- allAssignments vs]

sat :: BExp -> [Int] -> [[(Int, Bool)]]
sat e vs = filter (\env -> evalB env e) (allAssignments vs)
`,
    },
    {
      k: "write",
      setup: hs`data Label = C Char | Eps
  deriving (Eq, Show)

type Transition = (Int, Int, Label)
`,
      body: md(
        "2014 exam task: `accepts ts finals s input` for a machine with `Eps` transitions, which move without reading anything. Accept if the input is used up in a final state, OR any transition from `s` leads to acceptance: an `Eps` transition keeps the same input; a `C c` transition needs the input to start with `c` and continues with the rest. You can assume there are no cycles of `Eps` transitions.",
      ),
      starter: hs`accepts :: [Transition] -> [Int] -> Int -> String -> Bool
accepts ts finals s input = undefined
`,
      tests: [
        { expr: "accepts [(1, 2, C 'a')] [2] 1 \"a\"", expected: "True" },
        { expr: "accepts [(1, 2, Eps), (2, 3, C 'a')] [3] 1 \"a\"", expected: "True" },
        { expr: "accepts [(1, 2, C 'a'), (2, 3, Eps)] [3] 1 \"a\"", expected: "True" },
        { expr: "accepts [(1, 2, C 'a'), (1, 3, C 'a'), (3, 4, C 'b')] [4] 1 \"ab\"", expected: "True" },
        { expr: "accepts [(1, 2, C 'a'), (2, 3, Eps)] [3] 1 \"aa\"", expected: "False" },
        { expr: "accepts [] [1] 1 \"\"", expected: "True" },
      ],
      hint: "`(null input && elem s finals) || any try [(t, l) | (from, t, l) <- ts, from == s]`, where `try (t, Eps) = accepts ts finals t input` and `try (t, C c)` checks the first character.",
      solution: hs`accepts :: [Transition] -> [Int] -> Int -> String -> Bool
accepts ts finals s input = (null input && elem s finals) || any try [(t, l) | (from, t, l) <- ts, from == s]
  where
    try (t, Eps) = accepts ts finals t input
    try (t, C c) = case input of
      (x : rest) -> x == c && accepts ts finals t rest
      [] -> False
`,
    },
    {
      k: "write",
      setup: hs`import Data.List (sortOn)
`,
      body: md(
        "2019 exam style: a solution from `dp` may leave some variables unassigned (they can be anything). Write `extend sol vs`, which gives every full solution: each variable in `vs` that doesn't appear in `sol` (as `v` or `-v`) is added both as `v` and as `-v`. Sort the literals of each full solution by their absolute value (`sortOn abs`). The order of the solutions doesn't matter.",
        "",
        "`extend [2] [1, 2]` is `[[1, 2], [-1, 2]]` in any order.",
      ),
      starter: hs`extend :: [Int] -> [Int] -> [[Int]]
extend sol vs = undefined
`,
      tests: [
        { expr: "extend [2] [1, 2]", expected: "[[1, 2], [-1, 2]]", unordered: true },
        { expr: "extend [1, -2] [1, 2]", expected: "[[1, -2]]" },
        { expr: "extend [] [1, 2]", expected: "[[1, 2], [1, -2], [-1, 2], [-1, -2]]", unordered: true },
        { expr: "extend [3] [1, 2, 3]", expected: "[[1, 2, 3], [1, -2, 3], [-1, 2, 3], [-1, -2, 3]]", unordered: true },
        { expr: "extend [] []", expected: "[[]]" },
      ],
      hint: "`missing = [v | v <- vs, notElem v (map abs sol)]`. A helper over `missing` with base case `[sol]`, and for `m : ms`: `[l : s | l <- [m, negate m], s <- go ms]`. Then `map (sortOn abs)`.",
      solution: hs`extend :: [Int] -> [Int] -> [[Int]]
extend sol vs = map (sortOn abs) (go missing)
  where
    missing = [v | v <- vs, notElem v (map abs sol)]
    go [] = [sol]
    go (m : ms) = [l : s | l <- [m, negate m], s <- go ms]
`,
    },
    {
      k: "write",
      setup: fsmSetup,
      body: "2012 exam style: `acceptedStrings ts finals s n` lists every string of exactly `n` characters that the machine accepts starting from `s` (ending in a final state), following transitions in order. Each string appears once per path, so repeats are possible.",
      starter: hs`acceptedStrings :: [Transition] -> [Int] -> Int -> Int -> [String]
acceptedStrings ts finals s n = undefined
`,
      tests: [
        { expr: "acceptedStrings [(1, 'a', 2), (1, 'b', 2)] [2] 1 1", expected: '["a", "b"]' },
        { expr: "acceptedStrings [(1, 'a', 1), (1, 'b', 2)] [2] 1 3", expected: '["aab"]' },
        { expr: "acceptedStrings [(1, 'a', 2)] [1] 1 0", expected: '[""]' },
        { expr: "acceptedStrings [(1, 'a', 2)] [2] 1 0", expected: "[]" },
        { expr: "acceptedStrings [(1, 'a', 1), (1, 'b', 1)] [1] 1 2", expected: '["aa", "ab", "ba", "bb"]' },
      ],
      hint: "`n == 0`: `[\"\"]` if `s` is final, else `[]`. Otherwise `[c : w | (from, c, t) <- ts, from == s, w <- acceptedStrings ts finals t (n - 1)]`.",
      solution: hs`acceptedStrings :: [Transition] -> [Int] -> Int -> Int -> [String]
acceptedStrings ts finals s 0 = if elem s finals then [""] else []
acceptedStrings ts finals s n = [c : w | (from, c, t) <- ts, from == s, w <- acceptedStrings ts finals t (n - 1)]
`,
    },
    {
      k: "write",
      body: md(
        "Backtracking, 2021 colouring style: `allColourings k ns es` gives every way to colour the nodes `ns` (in order) with colours `1 .. k` so that no edge `(a, b)` (undirected) joins two nodes of the same colour. Each solution lists `(node, colour)` in the order of `ns`. Try smaller colours first.",
        "",
        "Hint for the shape: colour the nodes from the last one back, or carry the colouring so far in a helper; a node may only take a colour that none of its already-coloured neighbours has.",
      ),
      starter: hs`allColourings :: Int -> [Int] -> [(Int, Int)] -> [[(Int, Int)]]
allColourings k ns es = undefined
`,
      tests: [
        { expr: "allColourings 2 [1, 2] [(1, 2)]", expected: "[[(1, 1), (2, 2)], [(1, 2), (2, 1)]]" },
        { expr: "allColourings 2 [1, 2, 3] [(1, 2), (2, 3), (3, 1)]", expected: "[]" },
        { expr: "allColourings 1 [1, 2] []", expected: "[[(1, 1), (2, 1)]]" },
        { expr: "allColourings 3 [] []", expected: "[[]]" },
        { expr: "length (allColourings 3 [1, 2, 3] [(1, 2), (2, 3), (3, 1)])", expected: "6" },
      ],
      hint: "Helper `go done todo`: `go done [] = [[]]`; for `n : rest`, try each colour `c` not used by a neighbour of `n` in `done`, and give `[(n, c) : sol | c <- ok, sol <- go ((n, c) : done) rest]`.",
      solution: hs`allColourings :: Int -> [Int] -> [(Int, Int)] -> [[(Int, Int)]]
allColourings k ns es = go [] ns
  where
    nbrs n = [b | (a, b) <- es, a == n] ++ [a | (a, b) <- es, b == n]
    go _ [] = [[]]
    go done (n : rest) =
      [ (n, c) : sol
      | c <- [1 .. k]
      , notElem c [c' | (m, c') <- done, elem m (nbrs n)]
      , sol <- go ((n, c) : done) rest
      ]
`,
    },
  ],
};

export const lessons: Lesson[] = [rewrite, threading, sets, interpreters, graphs, search];
export const drills: DrillSet[] = [rewriteDrills, threadingDrills, setsDrills, interpretersDrills, graphsDrills, searchDrills];
