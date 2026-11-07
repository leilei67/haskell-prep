import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "y2014",
  year: 2014,
  title: "Regular Expressions and Finite Automata",
  summary: "Represent regular expressions as a data type, turn them into state machines (automata), and decide whether a machine accepts a string.",
  skills: [
    "recursion over a data type",
    "association lists",
    "tuples as records",
    "list comprehensions",
    "backtracking search with any",
    "threading a counter through recursion",
    "accumulating parameters and folds",
  ],
  story: md(
    "A **regular expression** (regex) is a tiny pattern language for describing a set of strings. Search tools, text editors and programming languages all use them. In this paper a regex is built from these pieces:",
    "",
    "```",
    "a        a single character: matches only \"a\"",
    "ab       one regex followed by another: matches \"ab\"",
    "(ab|c)   a choice: matches \"ab\" or \"c\"",
    "e*       zero or more copies of e      a*  matches \"\", \"a\", \"aa\", ...",
    "e+       one or more copies of e       a+  matches \"a\", \"aa\", ...",
    "e?       e or nothing                  a?  matches \"\" or \"a\"",
    "(a|)     the empty regex (written ε) matches only \"\"",
    "```",
    "",
    "If a regex matches a string we say it **accepts** the string. For example `(ab|c)*` accepts `\"\"`, `\"c\"` and `\"abababccab\"` but not `\"ac\"`. `+` and `?` are just shorthand: `e+` is the same as `ee*`, and `e?` is the same as `(e|ε)`.",
    "",
    "**Automata.** To actually check whether a string matches, we turn the regex into a machine called an automaton. It is a set of numbered **states** joined by arrows called **transitions**. Each arrow is labelled with a character, or with `Eps` (short for ε, 'epsilon'), meaning you may follow it for free without using up a character. There is one **start** state and some **terminal** (accepting) states.",
    "",
    "To test a string you start at the start state and follow arrows: a character arrow uses up the matching next character of the string, an `Eps` arrow uses nothing. If you can end up at a terminal state with no characters left, the string is accepted. Here is a machine for `ab*`:",
    "",
    "```",
    "   a          b",
    "1 ----> 2   2 ----> 2      start state 1, terminal state 2",
    "```",
    "",
    "**Non-deterministic (NDA).** Sometimes a state has several arrows you could take (for example two `Eps` arrows). You don't know in advance which one leads to success, so you have to try them all: this is called *non-deterministic*. Trying one choice, and going back to try another if it fails, is called **backtracking**.",
    "",
    "**Deterministic (DA).** A deterministic automaton has no `Eps` arrows, and from each state at most one arrow per character. Then there's never a choice to make. Part IV converts an NDA into an equivalent DA.",
    "",
    "### The given types",
    "",
    "```",
    "data RE = Null | Term Char | Seq RE RE | Alt RE RE | Rep RE | Plus RE | Opt RE",
    "```",
    "",
    "- `Null` is the empty regex ε. `Term 'a'` matches the single character `a`.",
    "- `Seq r1 r2` is r1 followed by r2. `Alt r1 r2` is `(r1|r2)`.",
    "- `Rep r` is `r*`, `Plus r` is `r+`, `Opt r` is `r?`.",
    "",
    "So `(ab)?d+` is `Seq (Opt (Seq (Term 'a') (Term 'b'))) (Plus (Term 'd'))`.",
    "",
    "```",
    "type State      = Int",
    "data Label      = C Char | Eps",
    "type Transition = (State, State, Label)          -- (from, to, label)",
    "type Automaton  = (State, [State], [Transition]) -- (start, terminals, transitions)",
    "```",
    "",
    "For example the machine for `x'*` (`nda2`) is",
    "",
    "```",
    "(1,[2],[(1,3,C 'x'),(3,4,Eps),(4,2,Eps),(4,5,Eps),(5,6,C '\\''),(6,2,Eps),(6,5,Eps)])",
    "```",
    "",
    "Given test data: `re1`..`re5` and `reFigure` (regexes), `nda1`..`nda5` and `ndaFigure` (their NDAs, exactly as `makeNDA` builds them), and `da1`..`da5` (equivalent deterministic machines). `showRE` prints a regex compactly, e.g. `showRE re5 == \"(ab)?d+\"`.",
  ),
  notes: md(
    "**Where the marks are.** Part I (4), Part II (11), Part III (8) are 23 of 25. The two big questions are `accepts` (6) and `make` (8). Part IV is only 2 marks and hard.",
    "",
    "**Order of attack.** Knock off `lookUp`, the three accessors, `isTerminal`, `transitionsFrom` and `labels` quickly: they're one-liners with list comprehensions. Then `simplify`, then `accepts`, then `make`.",
    "",
    "**Traps.**",
    "",
    "- `simplify` must recurse into *every* constructor, not just `Plus` and `Opt`, or a `Plus` buried inside a `Seq` survives.",
    "- In `accepts`, check \"terminal state *and* no characters left\" first. Being at a terminal state with characters left is not success: keep exploring.",
    "- In `make`, keep the state numbering exactly as described (it makes `makeNDA re2 == nda2` true, which is a great test). The trick is threading the 'next free number' through: the number returned by the first recursive call becomes the input to the second.",
    "- `labels` must drop `Eps` and remove duplicates (use `nub`).",
    "",
    "**Short of time?** Skip Part IV. Get `make` working on `Term`, `Null` and `Seq` first for partial marks, then add `Alt` and `Rep`.",
  ),
  setup: hs`import Data.List (nub, sort)

data RE = Null      |   -- Null expression
          Term Char |   -- Terminal
          Seq RE RE |   -- Sequence
          Alt RE RE |   -- Alternation
          Rep RE    |   -- Repetition (*)
          Plus RE   |   -- Repetition (+)
          Opt RE        -- Optional expression (?)
        deriving (Eq, Show)

type State = Int

data Label = C Char | Eps
           deriving (Eq, Ord, Show)

type Transition = (State, State, Label)

type Automaton = (State, [State], [Transition])

type MetaState = [State]

type MetaTransition = (MetaState, MetaState, Label)

--------------------------------------------------------
-- Showing REs

showRE :: RE -> String
showRE (Seq re re')
  = showRE re ++ showRE re'
showRE (Alt re re')
  = "(" ++ showRE re ++ "|" ++ showRE re' ++ ")"
showRE (Rep re)
  = showRE' re ++ "*"
showRE (Plus re)
  = showRE' re ++ "+"
showRE (Opt re)
  =  showRE' re ++ "?"
showRE re
  = showRE' re

showRE' :: RE -> String
showRE' Null
  = ""
showRE' (Term c)
  = [c]
showRE' (Alt re re')
  = showRE (Alt re re')
showRE' re
  = "(" ++ showRE re ++ ")"

--------------------------------------------------------
-- Part III (provided)

makeNDA :: RE -> Automaton
makeNDA re
  = (1, [2], sort transitions)
  where
    (transitions, k) = make (simplify re) 1 2 3

--------------------------------------------------------
-- Test cases

reFigure, re1, re2, re3, re4, re5 :: RE
reFigure
  = Seq (Rep (Alt (Term 'a') (Term 'b'))) (Term 'c')
re1
  = Seq (Alt (Term 'x') (Term 'y')) (Alt (Term '1') (Term '2'))
re2
  = Seq (Term 'x') (Rep (Term '\''))
re3
  = Rep (Alt (Seq (Term 'a') (Term 'b')) (Term 'c'))
re4
  = Seq (Alt (Term 'a') Null) (Term 'a')
re5
  = Seq (Opt (Seq (Term 'a') (Term 'b'))) (Plus (Term 'd'))

nd, nd' :: Automaton
nd = (1,[4],[(1,2,C 'a'),(1,3,C 'b'),(2,3,Eps),(2,4,C 'c')])

nd' = (1,[4],[(1,2,Eps),(1,3,C 'a'),(2,4,C 'a'),(2,4,C 'b'),
              (3,4,C 'b'),(3,4,Eps)])

ndaFigure, nda1, nda2, nda3, nda4, nda5 :: Automaton
daFigure, da1, da2, da3, da4, da5 :: Automaton
ndaFigure
  = (1,[2],[(1,3,Eps),(1,5,Eps),(3,4,Eps),(4,2,C 'c'),(5,7,Eps),
            (5,9,Eps),(6,3,Eps),(6,5,Eps),(7,8,C 'a'),(8,6,Eps),
            (9,10,C 'b'),(10,6,Eps)])
daFigure
  = (1,[2],[(1,1,C 'a'),(1,1,C 'b'),(1,2,C 'c')])

nda1
  = (1,[2],[(1,5,Eps),(1,7,Eps),(3,4,Eps),(4,9,Eps),(4,11,Eps),
            (5,6,C 'x'),(6,3,Eps),(7,8,C 'y'),(8,3,Eps),(9,10,C '1'),
            (10,2,Eps),(11,12,C '2'),(12,2,Eps)])
da1
  = (1,[3],[(1,2,C 'x'),(1,2,C 'y'),(2,3,C '1'),(2,3,C '2')])

nda2
  = (1,[2],[(1,3,C 'x'),(3,4,Eps),(4,2,Eps),(4,5,Eps),(5,6,C '\''),
            (6,2,Eps),(6,5,Eps)])
da2
  = (1,[2],[(1,2,C 'x'),(2,2,C '\'')])

nda3
  = (1,[2],[(1,2,Eps),(1,3,Eps),(3,5,Eps),(3,7,Eps),(4,2,Eps),
            (4,3,Eps),(5,9,C 'a'),(6,4,Eps),(7,8,C 'c'),(8,4,Eps),
            (9,10,Eps),(10,6,C 'b')])
da3
  = (1,[1],[(1,1,C 'c'),(1,2,C 'a'),(2,1,C 'b')])

nda4
  = (1,[2],[(1,5,Eps),(1,7,Eps),(3,4,Eps),(4,2,C 'a'),(5,6,C 'a'),
            (6,3,Eps),(7,8,Eps),(8,3,Eps)])
da4
  = (1,[2,3],[(1,2,C 'a'),(2,3,C 'a')])

nda5
  = (1,[2],[(1,5,Eps),(1,7,Eps),(3,4,Eps),(4,11,C 'd'),(5,9,C 'a'),
            (6,3,Eps),(7,8,Eps),(8,3,Eps),(9,10,Eps),(10,6,C 'b'),
            (11,12,Eps),(12,2,Eps),(12,13,Eps),(13,14,C 'd'),
            (14,2,Eps),(14,13,Eps)])
da5
  = (1,[2],[(1,2,C 'd'),(1,3,C 'a'),(2,2,C 'd'),(3,4,C 'b'),
            (4,2,C 'd')])
`,
  starter: hs`--------------------------------------------------------
-- Part I

lookUp :: Eq a => a -> [(a, b)] -> b
lookUp = undefined

simplify :: RE -> RE
simplify = undefined

--------------------------------------------------------
-- Part II

startState :: Automaton -> State
startState = undefined

terminalStates :: Automaton -> [State]
terminalStates = undefined

transitions :: Automaton -> [Transition]
transitions = undefined

isTerminal :: State -> Automaton -> Bool
isTerminal = undefined

transitionsFrom :: State -> Automaton -> [Transition]
transitionsFrom = undefined

labels :: [Transition] -> [Label]
labels = undefined

accepts :: Automaton -> String -> Bool
accepts = undefined

--------------------------------------------------------
-- Part III

make :: RE -> Int -> Int -> Int -> ([Transition], Int)
make = undefined

--------------------------------------------------------
-- Part IV

getFrontier :: State -> Automaton -> [Transition]
getFrontier = undefined

groupTransitions :: [Transition] -> [(Label, [State])]
groupTransitions = undefined

makeDA :: Automaton -> Automaton
-- Suggested helper (define it in a where clause so it can see the NDA):
-- makeDA' :: [State] -> [MetaState] -> [MetaTransition]
--            -> (MetaState, [MetaState], [MetaTransition])
makeDA = undefined
`,
  tasks: [
    {
      id: "lookUp",
      name: "lookUp",
      part: "Part I",
      marks: 1,
      prompt: md(
        "Define `lookUp :: Eq a => a -> [(a, b)] -> b` which looks up an item in a list of (item, value) pairs and returns its value. Precondition: the item occurs exactly once in the list.",
        "",
        "```",
        "ghci> lookUp 2 [(1,'a'),(2,'b')]",
        "'b'",
        "```",
      ),
      hints: [
        "A list comprehension can pick out the value whose key matches.",
        "`[v | (k, v) <- table, k == x]` is the list of matching values. Because of the precondition it has exactly one element.",
        "Alternatively the Prelude's `lookup` returns a `Maybe b`; you'd then need to unwrap the `Just`.",
        "`lookUp x table = head [v | (k, v) <- table, k == x]`",
      ],
      solution: hs`lookUp :: Eq a => a -> [(a, b)] -> b
-- Pre: x occurs exactly once in the table
lookUp x table
  = head [v | (k, v) <- table, k == x]`,
      tests: [
        { expr: "lookUp 2 [(1,'a'),(2,'b')]", expected: "'b'" },
        { expr: "lookUp 1 [(1,'a'),(2,'b')]", expected: "'a'" },
        { expr: 'lookUp "y" [("x", 5), ("y", 7), ("z", 9)]', expected: "7" },
        { expr: "lookUp 'c' (zip \"abc\" [1 :: Int ..])", expected: "3" },
        { expr: "lookUp (C 'a') [(Eps, [1]), (C 'a', [2,3])]", expected: "[2,3]" },
        { expr: "lookUp [1,2] [([1], 'p'), ([1,2], 'q')]", expected: "'q'" },
      ],
    },
    {
      id: "simplify",
      name: "simplify",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define `simplify :: RE -> RE` which removes every `Plus` and `Opt` from a regex using the identities",
        "",
        "```",
        "e+  =  ee*     i.e. Plus e  becomes  Seq e (Rep e)",
        "e?  =  (e|)    i.e. Opt e   becomes  Alt e Null",
        "```",
        "",
        "Every sub-expression must be simplified too, wherever it appears.",
        "",
        "```",
        "ghci> showRE (simplify re5)",
        "\"(ab|)dd*\"",
        "```",
      ),
      hints: [
        "Structural recursion: one equation per constructor of `RE`.",
        "`Null` and `Term c` stay as they are. `Seq`, `Alt` and `Rep` keep their constructor but simplify their parts.",
        "For `Plus e`, simplify `e` first (call it `e'`) and build `Seq e' (Rep e')`. For `Opt e` build `Alt (simplify e) Null`.",
        md(
          "```",
          "simplify (Seq r1 r2) = Seq (simplify r1) (simplify r2)",
          "simplify (Alt r1 r2) = Alt (simplify r1) (simplify r2)",
          "simplify (Rep r)     = Rep (simplify r)",
          "simplify (Plus r)    = Seq r' (Rep r') where r' = simplify r",
          "simplify (Opt r)     = Alt (simplify r) Null",
          "simplify r           = r",
          "```",
        ),
      ],
      solution: hs`simplify :: RE -> RE
simplify (Seq r1 r2) = Seq (simplify r1) (simplify r2)
simplify (Alt r1 r2) = Alt (simplify r1) (simplify r2)
simplify (Rep r)     = Rep (simplify r)
simplify (Plus r)    = Seq r' (Rep r')
  where
    r' = simplify r
simplify (Opt r)     = Alt (simplify r) Null
simplify r           = r`,
      tests: [
        { expr: "showRE (simplify re5)", expected: '"(ab|)dd*"' },
        { expr: "simplify re5", expected: "Seq (Alt (Seq (Term 'a') (Term 'b')) Null) (Seq (Term 'd') (Rep (Term 'd')))" },
        { expr: "simplify re3", expected: "re3" },
        { expr: "simplify (Plus (Term 'a'))", expected: "Seq (Term 'a') (Rep (Term 'a'))" },
        { expr: "simplify (Opt (Term 'a'))", expected: "Alt (Term 'a') Null" },
        { expr: "simplify Null", expected: "Null" },
        { expr: "simplify (Rep (Opt (Plus (Term 'z'))))", expected: "Rep (Alt (Seq (Term 'z') (Rep (Term 'z'))) Null)", label: "nested + and ? inside *" },
        { expr: "showRE (simplify (Alt (Plus (Term 'a')) (Opt (Term 'b'))))", expected: '"(aa*|(b|))"' },
      ],
    },
    {
      id: "accessors",
      name: "startState / terminalStates / transitions",
      part: "Part II",
      marks: 1,
      prompt: md(
        "Define the three accessor functions for an automaton (a 3-tuple):",
        "",
        "```",
        "startState     :: Automaton -> State",
        "terminalStates :: Automaton -> [State]",
        "transitions    :: Automaton -> [Transition]",
        "```",
        "",
        "```",
        "ghci> terminalStates nda1",
        "[2]",
        "```",
        "",
        "Use them wherever you see fit later on.",
      ),
      hints: [
        "Pattern match on the triple.",
        "An automaton is `(start, terminals, ts)`.",
        "Use `_` for the parts each function ignores.",
        "`startState (s, _, _) = s`, `terminalStates (_, ts, _) = ts`, `transitions (_, _, ts) = ts`.",
      ],
      solution: hs`startState :: Automaton -> State
startState (s, _, _) = s

terminalStates :: Automaton -> [State]
terminalStates (_, ts, _) = ts

transitions :: Automaton -> [Transition]
transitions (_, _, ts) = ts`,
      tests: [
        { expr: "terminalStates nda1", expected: "[2]" },
        { expr: "terminalStates da4", expected: "[2,3]" },
        { expr: "startState nda3", expected: "1" },
        { expr: "startState (7, [8], [])", expected: "7" },
        { expr: "transitions da2", expected: "[(1,2,C 'x'),(2,2,C '\\'')]" },
        { expr: "length (transitions ndaFigure)", expected: "12" },
      ],
    },
    {
      id: "isTerminal",
      name: "isTerminal",
      part: "Part II",
      marks: 1,
      prompt: md(
        "Define `isTerminal :: State -> Automaton -> Bool` which is `True` exactly when the state is one of the automaton's terminal (accepting) states.",
        "",
        "```",
        "ghci> isTerminal 2 nda1",
        "True",
        "ghci> isTerminal 3 da4",
        "True",
        "ghci> isTerminal 5 nda2",
        "False",
        "```",
      ),
      hints: [
        "This is a membership test.",
        "`terminalStates a` is the list to search.",
        "`elem x xs` checks whether `x` is in `xs`.",
        "`isTerminal s a = elem s (terminalStates a)`",
      ],
      solution: hs`isTerminal :: State -> Automaton -> Bool
isTerminal s a = elem s (terminalStates a)`,
      tests: [
        { expr: "isTerminal 2 nda1", expected: "True" },
        { expr: "isTerminal 3 da4", expected: "True" },
        { expr: "isTerminal 5 nda2", expected: "False" },
        { expr: "isTerminal 1 da3", expected: "True" },
        { expr: "isTerminal 1 nda3", expected: "False" },
        { expr: "isTerminal 2 (1, [], [])", expected: "False" },
      ],
    },
    {
      id: "transitionsFrom",
      name: "transitionsFrom",
      part: "Part II",
      marks: 2,
      prompt: md(
        "Define `transitionsFrom :: State -> Automaton -> [Transition]` which returns the transitions leaving a given state (those whose *source* is that state), in the order they appear. If the state doesn't appear, the result is `[]`.",
        "",
        "```",
        "ghci> transitionsFrom 5 ndaFigure",
        "[(5,7,Eps),(5,9,Eps)]",
        "ghci> transitionsFrom 10 nda3",
        "[(10,6,C 'b')]",
        "```",
      ),
      hints: [
        "Filter the list of transitions.",
        "A transition is a triple `(from, to, label)`; you want the ones whose `from` matches.",
        "A list comprehension with a pattern on the left of `<-` is neatest.",
        "`transitionsFrom s a = [t | t@(from, _, _) <- transitions a, from == s]`",
      ],
      solution: hs`transitionsFrom :: State -> Automaton -> [Transition]
transitionsFrom s a
  = [t | t@(from, _, _) <- transitions a, from == s]`,
      tests: [
        { expr: "transitionsFrom 5 ndaFigure", expected: "[(5,7,Eps),(5,9,Eps)]" },
        { expr: "transitionsFrom 10 nda3", expected: "[(10,6,C 'b')]" },
        { expr: "transitionsFrom 2 nda3", expected: "[]", label: "terminal state with no exits" },
        { expr: "transitionsFrom 99 nda1", expected: "[]", label: "state not in the automaton" },
        { expr: "transitionsFrom 1 da5", expected: "[(1,2,C 'd'),(1,3,C 'a')]" },
        { expr: "transitionsFrom 2 nd'", expected: "[(2,4,C 'a'),(2,4,C 'b')]" },
      ],
    },
    {
      id: "labels",
      name: "labels",
      part: "Part II",
      marks: 1,
      prompt: md(
        "Define `labels :: [Transition] -> [Label]` which returns the labels of the given transitions, with no duplicates and with every `Eps` left out. Keep the labels in the order they first appear.",
        "",
        "```",
        "ghci> labels [(1,2,Eps)]",
        "[]",
        "ghci> labels (transitions nda3)",
        "[C 'a',C 'c',C 'b']",
        "```",
        "",
        "Hint from the spec: use `nub` from `Data.List` to remove duplicates (it's already imported for you).",
      ),
      hints: [
        "Collect the non-`Eps` labels with a comprehension, then remove duplicates.",
        "In a comprehension, `(_, _, l) <- ts` gives each label `l`.",
        "Add the guard `l /= Eps`. `nub` keeps the first occurrence of each value.",
        "`labels ts = nub [l | (_, _, l) <- ts, l /= Eps]`",
      ],
      solution: hs`labels :: [Transition] -> [Label]
labels ts = nub [l | (_, _, l) <- ts, l /= Eps]`,
      tests: [
        { expr: "labels [(1,2,Eps)]", expected: "[]" },
        { expr: "labels (transitions nda3)", expected: "[C 'a',C 'c',C 'b']" },
        { expr: "labels []", expected: "[]" },
        { expr: "labels (transitions da1)", expected: "[C 'x',C 'y',C '1',C '2']" },
        { expr: "labels (transitions nda5)", expected: "[C 'd',C 'a',C 'b']", label: "duplicate 'd' labels appear once" },
        { expr: "labels [(1,1,C 'z'),(2,2,Eps),(3,3,C 'z')]", expected: "[C 'z']" },
      ],
    },
    {
      id: "accepts",
      name: "accepts",
      part: "Part II",
      marks: 6,
      prompt: md(
        "Define `accepts :: Automaton -> String -> Bool` which says whether the automaton accepts the string, using **backtracking**: try every possible path, and succeed if any path works.",
        "",
        "Use a helper `accepts' :: State -> String -> Bool` (current state, characters still to match), starting from the start state and the whole string:",
        "",
        "- If the state is terminal and the string is empty (`null`), the answer is `True`.",
        "- Otherwise get the transitions leaving the state (`transitionsFrom`) and try each one; succeed if any of them succeeds.",
        "",
        "Trying one transition (the spec suggests a helper `try :: String -> Transition -> Bool`):",
        "",
        "- An `Eps` transition to state `t`: continue with `accepts'` from `t`, string unchanged.",
        "- A `C c` transition to state `t`: if the string is empty, fail. If its first character equals `c`, continue from `t` with the rest of the string. Otherwise fail.",
        "",
        "Examples, using the NDA for `(a|b)*c` and the regexes of Table 1:",
        "",
        "```",
        "ghci> accepts ndaFigure \"ac\"",
        "True",
        "ghci> accepts ndaFigure \"aac\"",
        "True",
        "ghci> accepts ndaFigure \"cc\"",
        "False",
        "ghci> accepts nda3 \"abababccab\"",
        "True",
        "ghci> accepts nda5 \"ababd\"",
        "False",
        "```",
      ),
      hints: [
        "Define `accepts'` and `try` in a `where` clause so they can see the automaton without passing it around. Use `any` to say \"at least one path works\".",
        "`accepts a s = accepts' (startState a) s`. In `accepts'`, the first guard is `isTerminal st a && null str`; the `otherwise` case is `any (try str) (transitionsFrom st a)`.",
        "Pattern match in `try` on the label and the string: `try str (_, t, Eps)`, `try (x : xs) (_, t, C c)`, and a final catch-all `try _ _ = False` for an empty string meeting a character arrow.",
        md(
          "```",
          "accepts a s = accepts' (startState a) s",
          "  where",
          "    accepts' st str",
          "      | isTerminal st a && null str = True",
          "      | otherwise = any (try str) (transitionsFrom st a)",
          "    try str (_, t, Eps)        = accepts' t str",
          "    try (x : xs) (_, t, C c)   = x == c && accepts' t xs",
          "    try _ _                    = False",
          "```",
        ),
      ],
      solution: hs`accepts :: Automaton -> String -> Bool
accepts a s
  = accepts' (startState a) s
  where
    accepts' :: State -> String -> Bool
    accepts' st str
      | isTerminal st a && null str = True
      | otherwise = any (try str) (transitionsFrom st a)

    -- Follow one transition, if it is allowed
    try :: String -> Transition -> Bool
    try str (_, t, Eps)      = accepts' t str
    try (x : xs) (_, t, C c) = x == c && accepts' t xs
    try _ _                  = False`,
      tests: [
        { expr: 'all (accepts ndaFigure) ["ac", "bc", "aac", "c", "babac"]' },
        { expr: 'not (any (accepts ndaFigure) ["cc", "ad", "", "ab"])' },
        { expr: 'all (accepts nda1) ["x2", "y1"] && not (any (accepts nda1) ["x", "x3"])', label: "(x|y)(1|2)" },
        { expr: 'all (accepts nda2) ["x", "x\'", "x\'\'\'"] && not (any (accepts nda2) ["y", "\'", "x\'x"])', label: "x'*" },
        { expr: 'all (accepts nda3) ["", "c", "abababccab"] && not (any (accepts nda3) ["d", "ac", "cccb"])', label: "(ab|c)*" },
        { expr: 'all (accepts nda4) ["a", "aa"] && not (any (accepts nda4) ["b", "aaa", ""])', label: "(a|)a" },
        { expr: 'all (accepts nda5) ["d", "abd", "abddd"] && not (any (accepts nda5) ["ab", "bd", "ababd"])', label: "(ab)?d+" },
        { expr: 'all (accepts da5) ["d", "abd", "abddd"] && not (any (accepts da5) ["ab", "bd", "ababd"])', label: "works on DAs too" },
        { expr: 'accepts nd "ac"', expected: "True" },
        { expr: 'map (accepts nd) ["", "a", "ab", "b", "acc"]', expected: "[False,False,False,False,False]", label: "dead ends and leftover characters are rejected" },
        { expr: 'map (accepts nd\') ["a", "aa", "b", "ab", "abb"]', expected: "[True,False,True,True,False]" },
      ],
    },
    {
      id: "make",
      name: "make",
      part: "Part III",
      marks: 8,
      prompt: md(
        "`makeNDA` is given:",
        "",
        "```",
        "makeNDA re = (1, [2], sort transitions)",
        "  where (transitions, k) = make (simplify re) 1 2 3",
        "```",
        "",
        "Define `make :: RE -> Int -> Int -> Int -> ([Transition], Int)`. `make re m n k` builds the transitions of an NDA for `re` that starts at state `m` and ends at state `n`. `k` is the next unused state number. It returns the transitions and the next unused state number afterwards. (The regex has already been simplified, so there are no `Plus` or `Opt`.)",
        "",
        "Follow these rules exactly:",
        "",
        "```",
        "Null:      m --Eps--> n                         (k unchanged)",
        "Term c:    m --C c--> n                         (k unchanged)",
        "",
        "Seq r1 r2: r1 from m to k",
        "           k --Eps--> k+1",
        "           r2 from k+1 to n",
        "           (r1 is built with next-free k+2; r2 with whatever r1 returned)",
        "",
        "Alt r1 r2: m --Eps--> k      m --Eps--> k+2",
        "           r1 from k to k+1   r2 from k+2 to k+3",
        "           k+1 --Eps--> n     k+3 --Eps--> n",
        "           (r1 is built with next-free k+4; r2 with whatever r1 returned)",
        "",
        "Rep r:     m --Eps--> k      m --Eps--> n",
        "           r from k to k+1",
        "           k+1 --Eps--> k    k+1 --Eps--> n",
        "           (r is built with next-free k+2)",
        "```",
        "",
        "```",
        "ghci> makeNDA (Term 'x')",
        "(1,[2],[(1,2,C 'x')])",
        "ghci> makeNDA re2",
        "(1,[2],[(1,3,C 'x'),(3,4,Eps),(4,2,Eps),(4,5,Eps),(5,6,C '\\''),(6,2,Eps),(6,5,Eps)])",
        "```",
        "",
        "Exact reproduction of the numbering isn't required for the marks (what matters is that the NDA accepts the right strings), but following the rules makes `makeNDA reN == ndaN` true for every example.",
      ),
      hints: [
        "One equation per constructor. Recursive cases call `make` on the sub-expressions, then add a few `Eps` transitions of their own.",
        "Use a `where` clause to name the results of the recursive calls, e.g. `(ts1, k1) = make r1 m k (k + 2)` and then `(ts2, k2) = make r2 (k + 1) n k1`. The final next-free number is `k2`.",
        "The order of the transitions in your list doesn't matter, because `makeNDA` sorts them. What matters is the state numbers, and passing `k1` (not `k + 2` again) into the second recursive call.",
        md(
          "```",
          "make Null m n k     = ([(m, n, Eps)], k)",
          "make (Term c) m n k = ([(m, n, C c)], k)",
          "make (Seq r1 r2) m n k = ((k, k + 1, Eps) : ts1 ++ ts2, k2)",
          "  where (ts1, k1) = make r1 m k (k + 2)",
          "        (ts2, k2) = make r2 (k + 1) n k1",
          "make (Alt r1 r2) m n k",
          "  = ([(m, k, Eps), (m, k + 2, Eps), (k + 1, n, Eps), (k + 3, n, Eps)] ++ ts1 ++ ts2, k2)",
          "  where (ts1, k1) = make r1 k (k + 1) (k + 4)",
          "        (ts2, k2) = make r2 (k + 2) (k + 3) k1",
          "make (Rep r) m n k = (... four Eps transitions ... ++ ts, k1)",
          "  where (ts, k1) = make r k (k + 1) (k + 2)",
          "```",
        ),
      ],
      solution: hs`make :: RE -> Int -> Int -> Int -> ([Transition], Int)
-- make re m n k builds an NDA for re from state m to state n,
-- where k is the next unused state number
make Null m n k
  = ([(m, n, Eps)], k)
make (Term c) m n k
  = ([(m, n, C c)], k)
make (Seq r1 r2) m n k
  = ((k, k + 1, Eps) : ts1 ++ ts2, k2)
  where
    (ts1, k1) = make r1 m k (k + 2)
    (ts2, k2) = make r2 (k + 1) n k1
make (Alt r1 r2) m n k
  = ([(m, k, Eps), (m, k + 2, Eps), (k + 1, n, Eps), (k + 3, n, Eps)]
      ++ ts1 ++ ts2, k2)
  where
    (ts1, k1) = make r1 k (k + 1) (k + 4)
    (ts2, k2) = make r2 (k + 2) (k + 3) k1
make (Rep r) m n k
  = ([(m, k, Eps), (m, n, Eps), (k + 1, k, Eps), (k + 1, n, Eps)] ++ ts, k1)
  where
    (ts, k1) = make r k (k + 1) (k + 2)`,
      tests: [
        { expr: "makeNDA (Term 'x')", expected: "(1,[2],[(1,2,C 'x')])" },
        { expr: "makeNDA Null", expected: "(1,[2],[(1,2,Eps)])" },
        { expr: "makeNDA re2", expected: "nda2" },
        { expr: "makeNDA reFigure", expected: "ndaFigure" },
        { expr: "makeNDA re1", expected: "nda1" },
        { expr: "makeNDA re3", expected: "nda3" },
        { expr: "makeNDA re4", expected: "nda4" },
        { expr: "makeNDA re5", expected: "nda5" },
        { expr: "let (ts, k) = make (Seq (Term 'a') (Term 'b')) 1 2 3 in (sort ts, k)", expected: "([(1,3,C 'a'),(3,4,Eps),(4,2,C 'b')],5)" },
        { expr: "snd (make (simplify re5) 1 2 3)", expected: "15", label: "next free state after building re5's NDA" },
        {
          expr: 'let a = makeNDA (Seq (Plus (Alt (Term \'a\') (Term \'b\'))) (Opt (Term \'c\'))) in all (accepts a) ["a", "abba", "bc", "bbbc"] && not (any (accepts a) ["", "c", "acc", "ca"])',
          label: "behaviour: (a|b)+c? accepts the right strings",
        },
      ],
    },
    {
      id: "getFrontier",
      name: "getFrontier",
      part: "Part IV",
      marks: 0,
      prompt: md(
        "Part IV (2 marks in total, shared by `getFrontier`, `groupTransitions` and `makeDA`) converts an NDA into a deterministic automaton. This first helper is suggested by the spec.",
        "",
        "Define `getFrontier :: State -> Automaton -> [Transition]`. Starting at the given state, follow `Eps` transitions as far as possible. The **frontier** is the list of non-`Eps` transitions you reach. If you reach a terminal state `t`, include a special \"phantom\" transition `(t, t, Eps)` to record that fact.",
        "",
        "You may assume every cycle in the NDA contains at least one non-`Eps` transition, so following `Eps` arrows always stops.",
        "",
        "```",
        "ghci> getFrontier 1 nda3",
        "[(2,2,Eps),(5,9,C 'a'),(7,8,C 'c')]",
        "```",
        "",
        "Order doesn't matter.",
      ),
      hints: [
        "Recursion on states: a terminal state gives just its phantom transition; otherwise look at each transition leaving the state.",
        "For each transition from the state: an `Eps` transition to `t` means \"recurse from `t`\"; a character transition is part of the frontier itself.",
        "`concatMap` over `transitionsFrom s a` with a small helper that handles one transition.",
        md(
          "```",
          "getFrontier s a",
          "  | isTerminal s a = [(s, s, Eps)]",
          "  | otherwise = concatMap follow (transitionsFrom s a)",
          "  where",
          "    follow (_, t, Eps) = getFrontier t a",
          "    follow tr          = [tr]",
          "```",
        ),
      ],
      solution: hs`getFrontier :: State -> Automaton -> [Transition]
-- Pre: every cycle in the NDA contains a non-Eps transition
getFrontier s a
  | isTerminal s a = [(s, s, Eps)]
  | otherwise      = concatMap follow (transitionsFrom s a)
  where
    follow (_, t, Eps) = getFrontier t a
    follow tr          = [tr]`,
      tests: [
        { expr: "getFrontier 1 nda3", expected: "[(2,2,Eps),(5,9,C 'a'),(7,8,C 'c')]", unordered: true },
        { expr: "getFrontier 1 nda4", expected: "[(5,6,C 'a'),(4,2,C 'a')]", unordered: true },
        { expr: "getFrontier 2 nda4", expected: "[(2,2,Eps)]" },
        { expr: "getFrontier 1 ndaFigure", expected: "[(4,2,C 'c'),(7,8,C 'a'),(9,10,C 'b')]", unordered: true },
        { expr: "getFrontier 6 nda2", expected: "[(2,2,Eps),(5,6,C '\\'')]", unordered: true },
        { expr: "getFrontier 1 da5", expected: "[(1,2,C 'd'),(1,3,C 'a')]", unordered: true },
      ],
    },
    {
      id: "groupTransitions",
      name: "groupTransitions",
      part: "Part IV",
      marks: 0,
      prompt: md(
        "Define `groupTransitions :: [Transition] -> [(Label, [State])]` which groups a frontier by label: for each (non-`Eps`) label, the list of distinct target states reached by transitions with that label. The phantom `Eps` transition must not appear in the result.",
        "",
        "```",
        "ghci> groupTransitions [(3,7,C 'a'),(5,9,C 'a')]",
        "[(C 'a',[7,9])]",
        "ghci> groupTransitions [(2,2,Eps),(5,9,C 'a'),(7,8,C 'c')]",
        "[(C 'a',[9]),(C 'c',[8])]",
        "```",
        "",
        "The spec's hints: use `labels` (it removes `Eps` automatically) and a list comprehension. (Part of Part IV's 2 marks.)",
      ),
      hints: [
        "A list comprehension over the labels, with another list comprehension inside it for the targets.",
        "`labels ts` gives each distinct non-`Eps` label once.",
        "For a label `l`, the targets are `[t | (_, t, l') <- ts, l' == l]`; wrap them in `nub` so they're unique.",
        "`groupTransitions ts = [(l, nub [t | (_, t, l') <- ts, l' == l]) | l <- labels ts]`",
      ],
      solution: hs`groupTransitions :: [Transition] -> [(Label, [State])]
groupTransitions ts
  = [(l, nub [t | (_, t, l') <- ts, l' == l]) | l <- labels ts]`,
      tests: [
        { expr: "groupTransitions [(3,7,C 'a'),(5,9,C 'a')]", expected: "[(C 'a',[7,9])]" },
        { expr: "groupTransitions [(2,2,Eps),(5,9,C 'a'),(7,8,C 'c')]", expected: "[(C 'a',[9]),(C 'c',[8])]" },
        { expr: "groupTransitions []", expected: "[]" },
        { expr: "groupTransitions [(2,2,Eps)]", expected: "[]" },
        { expr: "groupTransitions [(1,4,C 'b'),(2,4,C 'b'),(3,5,C 'a')]", expected: "[(C 'b',[4]),(C 'a',[5])]", label: "duplicate targets appear once" },
        { expr: "groupTransitions (getFrontier 1 nda3)", expected: "[(C 'a',[9]),(C 'c',[8])]", unordered: true },
      ],
    },
    {
      id: "makeDA",
      name: "makeDA",
      part: "Part IV",
      marks: 2,
      prompt: md(
        "Define `makeDA :: Automaton -> Automaton` which turns an NDA into an equivalent **deterministic** automaton: no `Eps` transitions, and from each state at most one transition per label. It must accept exactly the same strings.",
        "",
        "Each DA state (a **metastate**) stands for a *set* of NDA states, kept as a sorted list without duplicates. Suggested algorithm, using a helper `makeDA' :: [State] -> [MetaState] -> [MetaTransition] -> (MetaState, [MetaState], [MetaTransition])` whose last two arguments accumulate the metastates and transitions found so far:",
        "",
        "1. Given a set of NDA states, concatenate their frontiers (`getFrontier`).",
        "2. The metastate is the sorted, de-duplicated list of the *source* states of those frontier transitions. E.g. the frontier of `[1]` in `nda3` gives metastate `[2,5,7]`.",
        "3. If that metastate has been seen already, return it with the accumulators unchanged.",
        "4. Otherwise add it to the metastates, group the frontier by label (`groupTransitions`) and, for each `(label, targets)`, recursively visit `targets`; if that returns root `r`, add the transition `(metastate, r, label)`. Thread the accumulators through (a fold).",
        "",
        "Finally number the metastates 1, 2, 3, ... (the start metastate should get the start number), and make a metastate terminal if it contains a terminal NDA state.",
        "",
        "The DAs `da1`..`da5` (Table 4 of the spec) are correct answers for `nda1`..`nda5`, but your state numbering may differ. So the tests check behaviour: the result is deterministic, has the same number of states as the given DA, and accepts exactly the same strings as the NDA.",
      ),
      hints: [
        "Put `makeDA'` in a `where` clause inside `makeDA` so it can see the NDA. Start it with `makeDA' [startState nda] [] []`.",
        "In `makeDA'`: `frontier = concatMap (\\s -> getFrontier s nda) ss` and `m = sort (nub [s | (s, _, _) <- frontier])`. If `elem m ms` return `(m, ms, ts)`; otherwise `foldl step (m, m : ms, ts) (groupTransitions frontier)`.",
        "`step (_, ms', ts') (l, targets) = (m, ms'', (m, r, l) : ts'') where (r, ms'', ts'') = makeDA' targets ms' ts'`. Metastates are prepended, so the start metastate is last: number `reverse ms` with `zip [1 ..]`.",
        md(
          "```",
          "makeDA nda = (1, terminals, sort [(num a, num b, l) | (a, b, l) <- mts])",
          "  where",
          "    (_, ms, mts) = makeDA' [startState nda] [] []",
          "    numbering = zip (reverse ms) [1 ..]",
          "    num m = lookUp m numbering",
          "    terminals = [num m | m <- ms, any (\\s -> isTerminal s nda) m]",
          "    makeDA' ss ms ts = ...   -- as in hints 2 and 3",
          "```",
        ),
      ],
      solution: hs`makeDA :: Automaton -> Automaton
makeDA nda
  = (1, sort terminals, sort [(number a, number b, l) | (a, b, l) <- metaTs])
  where
    (_, metaStates, metaTs) = makeDA' [startState nda] [] []

    -- The start metastate was added first, so it ends up last
    numbering = zip (reverse metaStates) [1 ..]
    number m  = lookUp m numbering
    terminals = [number m | m <- metaStates, any (\s -> isTerminal s nda) m]

    makeDA' :: [State] -> [MetaState] -> [MetaTransition]
               -> (MetaState, [MetaState], [MetaTransition])
    makeDA' ss ms ts
      | elem m ms = (m, ms, ts)
      | otherwise = foldl step (m, m : ms, ts) (groupTransitions frontier)
      where
        frontier = concatMap (\s -> getFrontier s nda) ss
        m        = sort (nub [s | (s, _, _) <- frontier])
        step (_, ms', ts') (l, targets)
          = (m, ms'', (m, r, l) : ts'')
          where
            (r, ms'', ts'') = makeDA' targets ms' ts'`,
      tests: [
        {
          expr: "and [ and [l /= Eps | (_, _, l) <- ts] && length (nub [(s, l) | (s, _, l) <- ts]) == length ts | (_, _, ts) <- map makeDA [nda1, nda2, nda3, nda4, nda5, ndaFigure] ]",
          label: "every result is deterministic (no Eps, at most one transition per state and label)",
        },
        {
          expr: 'let d = makeDA nda1 in all (\\w -> accepts d w == accepts nda1 w) ["", "x", "y", "x1", "x2", "y1", "y2", "x3", "xy", "x12", "1"]',
          label: "makeDA nda1 accepts the same strings as nda1",
        },
        {
          expr: 'let d = makeDA nda2 in all (\\w -> accepts d w == accepts nda2 w) ["", "x", "y", "x\'", "x\'\'\'", "\'", "x\'x", "xx"]',
          label: "makeDA nda2 accepts the same strings as nda2",
        },
        {
          expr: 'let d = makeDA nda3 in all (\\w -> accepts d w == accepts nda3 w) ["", "c", "ab", "abc", "abababccab", "d", "ac", "cccb", "a", "ba"]',
          label: "makeDA nda3 accepts the same strings as nda3",
        },
        {
          expr: 'let d = makeDA nda4 in all (\\w -> accepts d w == accepts nda4 w) ["", "a", "aa", "aaa", "b", "ab"]',
          label: "makeDA nda4 accepts the same strings as nda4",
        },
        {
          expr: 'let d = makeDA nda5 in all (\\w -> accepts d w == accepts nda5 w) ["", "d", "dd", "abd", "abddd", "ab", "bd", "ababd", "abab", "ad"]',
          label: "makeDA nda5 accepts the same strings as nda5",
        },
        {
          expr: 'let d = makeDA ndaFigure in all (\\w -> accepts d w == accepts ndaFigure w) ["", "c", "ac", "bc", "abbac", "cc", "ad", "ab"]',
          label: "makeDA ndaFigure accepts the same strings as ndaFigure",
        },
        {
          expr: "[ length (nub (startState d : concat [[s, t] | (s, t, _) <- transitions d])) | d <- map makeDA [nda1, nda2, nda3, nda4, nda5] ]",
          expected: "[3,2,2,3,4]",
          label: "same number of states as da1..da5",
        },
        {
          expr: "[ length (terminalStates d) | d <- map makeDA [nda1, nda2, nda3, nda4, nda5] ]",
          expected: "[1,1,1,2,1]",
          label: "same number of terminal states as da1..da5",
        },
      ],
    },
  ],
};
