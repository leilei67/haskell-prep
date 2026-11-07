import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "y2012",
  year: 2012,
  title: "Labelled Transition Systems",
  summary: "Model machines as graphs of states and labelled actions, check which action sequences a process allows, and combine two machines running side by side.",
  skills: [
    "association lists",
    "nub and duplicate removal",
    "list comprehensions",
    "recursion over trees",
    "guards in order",
    "graph search",
    "cartesian products",
    "threading state through recursion",
  ],
  story: md(
    "## Labelled Transition Systems (LTSs)",
    "",
    "An LTS describes a machine as a set of states and the actions that move it between them. Think of a vending machine. From state 0 you can press off (go to state 1, where nothing more can happen), blue (go to 2) or red (go to 3). In state 2 the machine gives tea and goes back to 0; in state 3 it gives coffee and goes back to 0:",
    "",
    "```",
    hs`0 --off-->    1
0 --blue-->   2
0 --red-->    3
2 --tea-->    0
3 --coffee--> 0`,
    "```",
    "",
    "Each arrow is a transition: a source state, a target state, and an action label (a lower-case name). States are numbered, and the starting state is always 0. When several transitions leave the same state, any one of them may happen: this is called non-deterministic choice.",
    "",
    "In Haskell an LTS is just a list of transitions, in any order:",
    "",
    "```",
    hs`type Id         = String
type State      = Int
type Transition = ((State, State), Id)    -- ((from, to), action)
type LTS        = [Transition]
type Alphabet   = [Id]

vendorLTS = [((0,1),"off"),((0,2),"blue"),((0,3),"red"),((2,0),"tea"),((3,0),"coffee")]`,
    "```",
    "",
    "The alphabet of an LTS is the set of all its action names: here red, blue, tea, coffee, off. A trace is a sequence of actions you can follow from state 0, e.g. `blue, tea, red, coffee`.",
    "",
    "## FSP: describing processes with text",
    "",
    "FSP (Finite State Processes) is a little language for writing LTSs. A process is one of:",
    "",
    "1. `STOP`: does nothing, ever.",
    "2. A reference to a named process, e.g. `VENDOR` (process names are upper case).",
    "3. An action prefix `a -> P`: do action `a`, then behave like `P`.",
    "4. A choice `(P1 | P2 | ...)`: behave like any one of the `Pi` (each starts with an action).",
    "",
    "```",
    hs`VENDOR = (red -> coffee -> VENDOR | blue -> tea -> VENDOR | off -> STOP)
CLOCK  = (tick -> tock -> CLOCK)
PLAY   = (think -> move -> PLAY | end -> STOP)`,
    "```",
    "",
    "Referring to VENDOR inside its own definition makes it loop, which is where the cycles in the LTS come from. In Haskell:",
    "",
    "```",
    hs`data Process = STOP | Ref Id | Prefix Id Process | Choice [Process]
type ProcessDef = (Id, Process)

vendor = ("VENDOR", Choice [Prefix "red" (Prefix "coffee" (Ref "VENDOR")),
                            Prefix "blue" (Prefix "tea" (Ref "VENDOR")),
                            Prefix "off" STOP])`,
    "```",
    "",
    "- `STOP` is the stopped process.",
    "- `Ref \"VENDOR\"` refers to the process named VENDOR; you find its definition by looking the name up in the list of definitions.",
    "- `Prefix \"red\" p` is `red -> p`.",
    "- `Choice [p1, p2, ...]` is `(p1 | p2 | ...)`.",
    "",
    "A `ProcessDef` pairs a name with its definition. The setup has `vendor`, `clock`, `play`, `maker`, `user`, `p`, `q`, `switch`, `off`, `on`, and the matching LTSs `vendorLTS`, `clockLTS`, `playLTS`, `makerLTS`, `userLTS`, `pLTS`, `qLTS`, `switchLTS`, plus the compositions `clockPlayLTS`, `makerUserLTS` and `pqLTS`.",
    "",
    "## Composition: two machines at once",
    "",
    "Composing two LTSs means running them side by side. A state of the combined machine is a PAIR of states, one from each. Actions that only one machine knows about happen independently (they interleave). Actions that BOTH machines have in their alphabets are shared: they must happen in both machines at the same moment. This is called synchronisation.",
    "",
    "```",
    hs`MAKER = (make -> ready -> MAKER)
USER  = (ready -> use -> USER)`,
    "```",
    "",
    "Here `ready` is shared: the user can't do `ready` until the maker is also ready to do it. But `make` and `use` are independent, so once something is ready the maker can make the next one while the user uses the first.",
    "",
    "The combined states get new numbers using a state map `I`, a table from pairs to numbers, with `I(0,0) = 0`. In Haskell it's `type StateMap = [((State, State), State)]`.",
    "",
    "The setup also has three test helpers that are not part of the exam: `sameLTS a b` (are two LTSs the same up to renumbering states?), `ltsTraces n lts` (all traces of length up to n) and `sameTraces n a b`.",
  ),
  notes: md(
    "Parts I to III are worth 28 marks; Part IV (`compose`, 4 marks) brings the total to 32, capped at 30. Part V (`buildLTS`) is worth nothing and is only for glory. Most questions are independent, so if you get stuck, move on.",
    "",
    "Parts I and II (19 marks) are short functions: get them all. `actions` (5) and `accepts` (6) are recursions over `Process`; the `Ref` case of `accepts` needs a look-up in the list of definitions.",
    "",
    "`composeTransitions` (5): the spec literally says to read the five rules as Haskell guards in order. Do exactly that, and check your answers against the three examples. The order of the guards matters.",
    "",
    "`pruneTransitions` (4) is a graph search from state 0: remember which states you've visited, or cycles will loop forever.",
    "",
    "`compose` (4) is mostly gluing: all pairs of states, a state map numbering them with (0,0) first, compose all pairs of outgoing transitions, then prune. The fiddly part is \"the catch\": a state with no outgoing transitions needs a dummy sentinel transition (`\"$\"` for one side, `\"$'\"` for the other), and the sentinel must be added to the OTHER side's alphabet.",
    "",
    "Traps:",
    "",
    "- `states` must include target states too, not only sources (state 1 in vendorLTS has no outgoing transitions).",
    "- Every process accepts the empty trace, even `STOP`.",
    "- Composition can produce the same transition twice; remove duplicates with `nub`.",
  ),
  setup: hs`import Data.List

type Id = String

type State = Int

type Transition = ((State, State), Id)

type LTS = [Transition]

type Alphabet = [Id]

data Process = STOP | Ref Id | Prefix Id Process | Choice [Process]
  deriving (Eq, Ord, Show)

type ProcessDef = (Id, Process)

type StateMap = [((State, State), State)]

------------------------------------------------------
-- Sample processes

vendor, clock, play, maker, user, p, q, switch, off, on :: ProcessDef

vendor
  = ("VENDOR", Choice [Prefix "red"  (Prefix "coffee" (Ref "VENDOR")),
                       Prefix "blue" (Prefix "tea" (Ref "VENDOR")),
                       Prefix "off" STOP])

clock
  = ("CLOCK", Prefix "tick" (Prefix "tock" (Ref "CLOCK")))

play
  = ("PLAY", Choice [Prefix "think" (Prefix "move" (Ref "PLAY")),
                     Prefix "end" STOP])

maker
  = ("MAKER", Prefix "make" (Prefix "ready" (Ref "MAKER")))

user
  = ("USER", Prefix "ready" (Prefix "use" (Ref "USER")))

p = ("P", Prefix "a" (Prefix "b" (Prefix "c" STOP)))

q = ("Q", Prefix "d" (Prefix "c" (Prefix "b" (Ref "Q"))))

switch
  = ("SWITCH", Ref "OFF")

off
  = ("OFF", Prefix "on" (Ref "ON"))

on
  = ("ON", Prefix "off" (Ref "OFF"))

------------------------------------------------------
-- Sample LTSs

vendorLTS, clockLTS, playLTS, clockPlayLTS, makerLTS, userLTS,
  makerUserLTS, pLTS, qLTS, pqLTS, switchLTS :: LTS

vendorLTS
  = [((0,1),"off"),((0,2),"blue"),((0,3),"red"),((2,0),"tea"),((3,0),"coffee")]

clockLTS
  = [((0,1),"tick"),((1,0),"tock")]

playLTS
  = [((0,1),"think"),((1,0),"move"),((0,2),"end")]

clockPlayLTS
  = [((0,1),"end"),((1,4),"tick"),((4,1),"tock"),((0,3),"tick"),
     ((3,4),"end"),((3,0),"tock"),((3,5),"think"),((5,3),"move"),
     ((5,2),"tock"),((2,0),"move"),((0,2),"think"),((2,5),"tick")]

makerLTS
  = [((0,1),"make"),((1,0),"ready")]

userLTS
  = [((0,1),"ready"),((1,0),"use")]

makerUserLTS
  = [((0,2),"make"),((2,1),"ready"),((1,0),"use"),((1,3),"make"),((3,2),"use")]

pLTS
  = [((0,1),"a"),((1,2),"b"),((2,3),"c")]

qLTS
  = [((0,1),"d"),((1,2),"c"),((2,0),"b")]

pqLTS
  = [((0,1),"d"),((1,4),"a"),((0,3),"a"),((3,4),"d")]

switchLTS
  = [((0,1),"on"),((1,0),"off")]

------------------------------------------------------
-- Test helpers (not part of the exam)

-- Are two LTSs identical once the states (other than 0) are renumbered?
sameLTS :: LTS -> LTS -> Bool
sameLTS a b
  = length sa == length sb && any matches (permutations (tail sb))
  where
    statesOf ts = 0 : delete 0 (nub (concat [[s, t] | ((s, t), _) <- ts]))
    sa = statesOf a
    sb = statesOf b
    norm ts = sort (nub ts)
    matches perm
      = norm [((rename s, rename t), x) | ((s, t), x) <- a] == norm b
      where
        rename s = maybe (-1) id (Prelude.lookup s (zip sa (0 : perm)))

-- All the traces of length at most n, starting from state 0.
ltsTraces :: Int -> LTS -> [[Id]]
ltsTraces n lts
  = sort (nub (from n 0))
  where
    from 0 _ = [[]]
    from k s = [] : [x : rest | ((s', t), x) <- lts, s' == s, rest <- from (k - 1) t]

sameTraces :: Int -> LTS -> LTS -> Bool
sameTraces n a b
  = ltsTraces n a == ltsTraces n b
`,
  starter: hs`-- Part I

lookUp :: Eq a => a -> [(a, b)] -> b
lookUp = undefined

states :: LTS -> [State]
states = undefined

transitions :: State -> LTS -> [Transition]
transitions = undefined

alphabet :: LTS -> Alphabet
alphabet = undefined

-- Part II

actions :: Process -> [Id]
actions = undefined

accepts :: [Id] -> [ProcessDef] -> Bool
accepts = undefined

-- Part III

composeTransitions :: Transition -> Transition
                   -> Alphabet -> Alphabet
                   -> StateMap
                   -> [Transition]
composeTransitions = undefined

pruneTransitions :: [Transition] -> LTS
pruneTransitions = undefined

-- Part IV

compose :: LTS -> LTS -> LTS
compose = undefined

-- Part V

buildLTS :: [ProcessDef] -> LTS
buildLTS = undefined
`,
  tasks: [
    {
      id: "lookup",
      name: "lookUp",
      part: "Part I",
      marks: 1,
      prompt: md(
        "Write `lookUp :: Eq a => a -> [(a, b)] -> b`, which looks up an item in a list of (item, value) pairs and returns its value. A precondition is that the item is in the list.",
        "",
        "```",
        hs`*Main> lookUp (0,1) [((0,0),0),((0,1),1),((1,0),2),((1,1),3)]
1
*Main> lookUp "Q" [p, q]
Prefix "d" (Prefix "c" (Prefix "b" (Ref "Q")))`,
        "```",
      ),
      hints: [
        "Find the first pair whose item matches. A comprehension plus `head`, or a simple recursion.",
        "Comprehension: list every value `v` from a pair `(k, v)` where `k == x`, then take the first.",
        "The precondition means the list of matches is never empty, so `head` is safe.",
        "`lookUp x table = head [v | (k, v) <- table, k == x]`",
      ],
      solution: hs`lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x table
  = head [v | (k, v) <- table, k == x]`,
      tests: [
        { expr: "lookUp (0,1) [((0,0),0),((0,1),1),((1,0),2),((1,1),3)]", expected: "1" },
        { expr: 'lookUp "Q" [p, q]', expected: "snd q" },
        { expr: 'lookUp "OFF" [switch, on, off]', expected: 'Prefix "on" (Ref "ON")' },
        { expr: "lookUp 3 [(1,'a'),(3,'c')]", expected: "'c'" },
        { expr: "lookUp (1,1) [((0,0),0),((0,1),1),((1,0),2),((1,1),3)]", expected: "3" },
        { expr: 'lookUp "x" [("x", True)]', expected: "True" },
      ],
    },
    {
      id: "states",
      name: "states",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Using `nub` (from `Data.List`, which removes duplicates), write `states :: LTS -> [State]`, which lists every state that appears in an LTS, as a source or a target, without duplicates. The order doesn't matter.",
        "",
        "```",
        hs`*Main> states vendorLTS
[0,1,2,3]`,
        "```",
      ),
      hints: [
        "Collect both states from every transition into one list, then `nub` it once.",
        "A comprehension can produce a small list `[s, t]` for each transition `((s, t), _)`; `concat` joins them.",
        "Don't forget the targets: state 1 of vendorLTS is only ever a target (you can't leave it).",
        "`states lts = nub (concat [[s, t] | ((s, t), _) <- lts])`",
      ],
      solution: hs`states :: LTS -> [State]
states lts
  = nub (concat [[s, t] | ((s, t), _) <- lts])`,
      tests: [
        { expr: "states vendorLTS", expected: "[0,1,2,3]", unordered: true },
        { expr: "states clockLTS", expected: "[0,1]", unordered: true },
        { expr: "states playLTS", expected: "[0,1,2]", unordered: true },
        { expr: "states clockPlayLTS", expected: "[0..5]", unordered: true },
        { expr: "states pqLTS", expected: "[0,1,3,4]", unordered: true },
        { expr: "states []", expected: "[]" },
        { expr: 'states [((0,0),"loop")]', expected: "[0]" },
      ],
    },
    {
      id: "transitions",
      name: "transitions",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Write `transitions :: State -> LTS -> [Transition]`, which returns all the transitions that leave the given state. The order doesn't matter.",
        "",
        "```",
        hs`*Main> transitions 0 vendorLTS
[((0,1),"off"),((0,2),"blue"),((0,3),"red")]`,
        "```",
      ),
      hints: [
        "This is a filter on the LTS: keep the transitions whose source is the given state.",
        "In a comprehension you can name the whole transition and its parts at once with an as-pattern: `t@((from, _), _)`.",
        "A state with no outgoing transitions (like state 1 of vendorLTS) gives `[]`.",
        "`transitions s lts = [t | t@((from, _), _) <- lts, from == s]`",
      ],
      solution: hs`transitions :: State -> LTS -> [Transition]
transitions s lts
  = [t | t@((from, _), _) <- lts, from == s]`,
      tests: [
        { expr: "transitions 0 vendorLTS", expected: '[((0,1),"off"),((0,2),"blue"),((0,3),"red")]', unordered: true },
        { expr: "transitions 2 vendorLTS", expected: '[((2,0),"tea")]' },
        { expr: "transitions 1 vendorLTS", expected: "[]", label: "state 1 (after off) has no way out" },
        { expr: "transitions 3 clockPlayLTS", expected: '[((3,4),"end"),((3,0),"tock"),((3,5),"think")]', unordered: true },
        { expr: "transitions 7 vendorLTS", expected: "[]" },
        { expr: "transitions 0 []", expected: "[]" },
      ],
    },
    {
      id: "alphabet",
      name: "alphabet",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Write `alphabet :: LTS -> Alphabet`, which returns all the action names used in an LTS, without duplicates. The order doesn't matter.",
        "",
        "```",
        hs`*Main> alphabet playLTS
["think","move","end"]`,
        "```",
        "",
        "(`[\"end\",\"move\",\"think\"]` in any order is fine.)",
      ),
      hints: [
        "Take the action of every transition, then remove duplicates.",
        "The action is the second component of a transition, so `map snd` gives all of them.",
        "`nub` removes the duplicates.",
        "`alphabet = nub . map snd`",
      ],
      solution: hs`alphabet :: LTS -> Alphabet
alphabet
  = nub . map snd`,
      tests: [
        { expr: "alphabet playLTS", expected: '["end","move","think"]', unordered: true },
        { expr: "alphabet vendorLTS", expected: '["red","blue","tea","coffee","off"]', unordered: true },
        { expr: "alphabet clockPlayLTS", expected: '["end","move","think","tick","tock"]', unordered: true, label: "every action appears several times here" },
        { expr: "alphabet makerUserLTS", expected: '["make","ready","use"]', unordered: true },
        { expr: "alphabet []", expected: "[]" },
        { expr: 'alphabet [((0,1),"a"),((1,0),"a")]', expected: '["a"]' },
      ],
    },
    {
      id: "actions",
      name: "actions",
      part: "Part II",
      marks: 5,
      prompt: md(
        "Write `actions :: Process -> [Id]`, which lists all the action names that appear in an FSP process, without duplicates. The order doesn't matter. `STOP` and `Ref` contain no actions.",
        "",
        "```",
        hs`*Main> actions (snd maker)
["make","ready"]`,
        "```",
        "",
        "(`maker` is a `ProcessDef`, a (name, process) pair, so `snd` gets the process.) A property you can test: `actions` of a process has the same elements as the `alphabet` of its LTS, e.g. `actions (snd vendor)` and `alphabet vendorLTS`.",
      ),
      hints: [
        "Recursion over `Process` to collect every action, then `nub` the result once at the top.",
        "Write a helper with one equation per constructor: `STOP` and `Ref _` give `[]`; `Prefix a p` gives `a` followed by the actions of `p`; `Choice ps` joins the actions of all the `ps`.",
        "Don't follow `Ref`s: they point to other definitions, and following them could loop forever. `concatMap` is handy for `Choice`.",
        md(
          "```",
          hs`actions proc = nub (allActions proc)
  where
    allActions STOP          = []
    allActions (Ref _)       = []
    allActions (Prefix a p') = a : allActions p'
    allActions (Choice ps)   = concatMap allActions ps`,
          "```",
        ),
      ],
      solution: hs`actions :: Process -> [Id]
actions proc
  = nub (allActions proc)
  where
    allActions STOP
      = []
    allActions (Ref _)
      = []
    allActions (Prefix a rest)
      = a : allActions rest
    allActions (Choice ps)
      = concatMap allActions ps`,
      tests: [
        { expr: "actions (snd maker)", expected: '["make","ready"]', unordered: true },
        { expr: "actions STOP", expected: "[]" },
        { expr: 'actions (Ref "VENDOR")', expected: "[]" },
        { expr: "actions (snd vendor)", expected: '["red","coffee","blue","tea","off"]', unordered: true },
        { expr: 'actions (Choice [Prefix "a" (Prefix "b" STOP), Prefix "b" (Prefix "a" STOP)])', expected: '["a","b"]', unordered: true, label: "duplicates removed" },
        { expr: "and [sort (actions (snd d)) == sort (alphabet l) | (d, l) <- [(vendor,vendorLTS),(clock,clockLTS),(play,playLTS),(maker,makerLTS),(user,userLTS),(p,pLTS),(q,qLTS)]]", expected: "True", label: "actions agrees with the alphabet of each sample LTS" },
      ],
    },
    {
      id: "accepts",
      name: "accepts",
      part: "Part II",
      marks: 6,
      prompt: md(
        "Write `accepts :: [Id] -> [ProcessDef] -> Bool`. It is True exactly when the processes can produce the given trace (a finite list of actions, in order). The first definition in the list is the start process; the others are there so that `Ref`s can be looked up.",
        "",
        "```",
        hs`*Main> accepts ["on","off","on"] [switch,on,off]
True
*Main> accepts ["use","use"] [user]
False
*Main> accepts [] [user]
True`,
        "```",
        "",
        "Every process accepts the empty trace.",
      ),
      hints: [
        "Use a helper that takes the remaining trace and the current process, starting from the start process (`snd` of the first definition). Recurse over the process.",
        "Cases: empty trace gives True. `STOP` with actions left gives False. `Prefix b p'`: the next action must be `b`, then continue with `p'`. `Choice ps`: True if ANY of the choices accepts the trace. `Ref name`: look `name` up in the list of definitions and continue with what you find.",
        "Check for the empty trace first, so that `STOP` (and everything else) accepts `[]`. Keep the whole list of definitions available to the helper (e.g. with a `where`) for the `Ref` case.",
        md(
          "```",
          hs`accepts trace defs@((_, start) : _) = acceptsFrom trace start
  where
    acceptsFrom [] _ = True
    acceptsFrom _ STOP = False
    acceptsFrom tr (Ref name) = acceptsFrom tr (lookUp name defs)
    acceptsFrom (a : rest) (Prefix b p') = a == b && acceptsFrom rest p'
    acceptsFrom tr (Choice ps) = any (acceptsFrom tr) ps`,
          "```",
        ),
      ],
      solution: hs`accepts :: [Id] -> [ProcessDef] -> Bool
accepts trace defs
  = acceptsFrom trace (snd (head defs))
  where
    acceptsFrom [] _
      = True
    acceptsFrom _ STOP
      = False
    acceptsFrom tr (Ref name)
      = acceptsFrom tr (lookUp name defs)
    acceptsFrom (a : rest) (Prefix b next)
      = a == b && acceptsFrom rest next
    acceptsFrom tr (Choice ps)
      = any (acceptsFrom tr) ps`,
      tests: [
        { expr: 'accepts ["on","off","on"] [switch,on,off]', expected: "True" },
        { expr: 'accepts ["use","use"] [user]', expected: "False" },
        { expr: "accepts [] [user]", expected: "True" },
        { expr: "accepts [] [(\"S\", STOP)]", expected: "True", label: "even STOP accepts the empty trace" },
        { expr: 'accepts ["red","coffee","blue","tea","off"] [vendor]', expected: "True" },
        { expr: 'accepts ["off","red"] [vendor]', expected: "False", label: "nothing happens after off" },
        { expr: 'accepts ["red","tea"] [vendor]', expected: "False" },
        { expr: 'accepts ["ready","use","ready"] [user]', expected: "True" },
        { expr: 'accepts ["tick","tock","tick","tock","tick"] [clock]', expected: "True", label: "goes round the loop" },
        { expr: 'accepts ["think","move","end"] [play]', expected: "True" },
        { expr: 'accepts ["off"] [switch,on,off]', expected: "False" },
      ],
    },
    {
      id: "composetransitions",
      name: "composeTransitions",
      part: "Part III",
      marks: 5,
      prompt: md(
        "Write a non-recursive function",
        "",
        "```",
        hs`composeTransitions :: Transition -> Transition
                   -> Alphabet -> Alphabet
                   -> StateMap
                   -> [Transition]`,
        "```",
        "",
        "which combines a transition `s --a--> t` from the first LTS (alphabet α1, the first `Alphabet` argument) with a transition `s' --a'--> t'` from the second LTS (alphabet α2). The `StateMap` `m` gives the number of each pair of states: `I(x, y)` is `lookUp (x, y) m`. Apply these rules IN ORDER, like guards:",
        "",
        "1. If `a == a'`: the action is shared and both move together. One transition `I(s,s') --a--> I(t,t')`.",
        "2. Otherwise, if `a` is in α2 and `a'` is in α1: each action is waiting for the other machine, so nothing can happen. No transitions.",
        "3. Otherwise, if `a'` is in α1: `a'` must wait, but `a` can go. One transition `I(s,s') --a--> I(t,s')`.",
        "4. Otherwise, if `a` is in α2: `a` must wait, but `a'` can go. One transition `I(s,s') --a'--> I(s,t')`.",
        "5. Otherwise both can go, independently: two transitions, `I(s,s') --a--> I(t,s')` and `I(s,s') --a'--> I(s,t')`.",
        "",
        "With `m = [((0,0),0),((0,1),1),((1,0),2),((1,1),3)]`:",
        "",
        "```",
        hs`*Main> composeTransitions ((0,1),"a") ((0,1),"c") ["a"] ["b","c"] m
[((0,1),"c"),((0,2),"a")]
*Main> composeTransitions ((1,1),"a") ((1,0),"c") ["a"] ["a","c"] m
[((3,2),"c")]
*Main> composeTransitions ((0,1),"a") ((1,1),"c") ["a", "c"] ["a","c"] m
[]`,
        "```",
        "",
        "The order of the result doesn't matter.",
      ),
      hints: [
        "Pattern match both transitions to name `s`, `t`, `a`, `s'`, `t'`, `a'`, then write the five rules as five guards, in the spec's order. Use `elem` for \"is in the alphabet\".",
        "Define a local helper `i x y = lookUp (x, y) m` so each rule is short, e.g. rule 3 is `[((i s s', i t s'), a)]`.",
        "The order of the guards is what makes the rules right: rule 3 only says \"a' is in α1\" because rule 2 has already ruled out \"a is in α2 as well\".",
        md(
          "```",
          hs`composeTransitions ((s, t), a) ((s', t'), a') alpha1 alpha2 m
  | a == a'                             = [((i s s', i t t'), a)]
  | elem a alpha2 && elem a' alpha1     = []
  | elem a' alpha1                      = [((i s s', i t s'), a)]
  | elem a alpha2                       = [((i s s', i s t'), a')]
  | otherwise = [((i s s', i s t'), a'), ((i s s', i t s'), a)]
  where i x y = lookUp (x, y) m`,
          "```",
        ),
      ],
      solution: hs`composeTransitions :: Transition -> Transition
                   -> Alphabet -> Alphabet
                   -> StateMap
                   -> [Transition]
composeTransitions ((s, t), a) ((s', t'), a') alpha1 alpha2 m
  | a == a'                         = [((i s s', i t t'), a)]
  | elem a alpha2 && elem a' alpha1 = []
  | elem a' alpha1                  = [((i s s', i t s'), a)]
  | elem a alpha2                   = [((i s s', i s t'), a')]
  | otherwise                       = [((i s s', i s t'), a'),
                                       ((i s s', i t s'), a)]
  where
    i x y = lookUp (x, y) m`,
      tests: [
        { expr: 'let m = [((0,0),0),((0,1),1),((1,0),2),((1,1),3)] in composeTransitions ((0,1),"a") ((0,1),"c") ["a"] ["b","c"] m', expected: '[((0,1),"c"),((0,2),"a")]', unordered: true, label: "rule 5: both move independently" },
        { expr: 'let m = [((0,0),0),((0,1),1),((1,0),2),((1,1),3)] in composeTransitions ((1,1),"a") ((1,0),"c") ["a"] ["a","c"] m', expected: '[((3,2),"c")]', label: "rule 4" },
        { expr: 'let m = [((0,0),0),((0,1),1),((1,0),2),((1,1),3)] in composeTransitions ((0,1),"a") ((1,1),"c") ["a", "c"] ["a","c"] m', expected: "[]", label: "rule 2" },
        { expr: 'let m = [((0,0),0),((0,1),1),((1,0),2),((1,1),3)] in composeTransitions ((0,1),"ready") ((0,1),"ready") ["make","ready"] ["ready","use"] m', expected: '[((0,3),"ready")]', label: "rule 1: a shared action moves both" },
        { expr: 'let m = [((0,0),0),((0,1),1),((1,0),2),((1,1),3)] in composeTransitions ((0,1),"a") ((1,0),"b") ["a","b"] ["b"] m', expected: '[((1,3),"a")]', label: "rule 3" },
        { expr: 'let m = [((0,0),0),((0,1),1),((1,0),2),((1,1),3)] in composeTransitions ((1,0),"make") ((0,1),"ready") ["make","ready"] ["ready","use"] m', expected: '[((2,0),"make")]', label: "rule 3: ready waits, make goes" },
        { expr: 'let m = [((0,0),0),((0,1),1),((1,0),2),((1,1),3)] in composeTransitions ((0,1),"ready") ((1,0),"use") ["make","ready"] ["ready","use"] m', expected: '[((1,0),"use")]', label: "rule 4: ready waits, use goes" },
      ],
    },
    {
      id: "prune",
      name: "pruneTransitions",
      part: "Part III",
      marks: 4,
      prompt: md(
        "Write `pruneTransitions :: [Transition] -> LTS`, which keeps only the transitions that can actually be reached from state 0 (by following transitions forwards), and throws the rest away.",
        "",
        "```",
        hs`*Main> pruneTransitions [((0,1),"d"),((1,4),"a"),((2,5),"a")]
[((0,1),"d"),((1,4),"a")]`,
        "```",
        "",
        "States 2 and 5 can't be reached from 0, so the transition between them goes. The order of the result doesn't matter, but it must not contain duplicates (unless the input did).",
      ),
      hints: [
        "This is a graph search starting at state 0. Keep a list of states already visited, so that cycles don't make you go round forever.",
        "The spec suggests `visit :: State -> [State] -> [Transition]`: if the state was visited already return `[]`; otherwise, for each outgoing transition (use `transitions`), keep it and visit its target with this state added to the visited list. A simpler alternative: first work out the list of all reachable states, then keep the transitions whose source is reachable.",
        "With the spec's `visit`, different paths can reach the same state, so the same transitions can be produced more than once: `nub` the result. With the reachable-states approach there are no duplicates.",
        md(
          "```",
          hs`pruneTransitions ts = [t | t@((from, _), _) <- ts, elem from (reachable [0] [])]
  where
    reachable [] seen = seen
    reachable (s : todo) seen
      | elem s seen = reachable todo seen
      | otherwise   = reachable ([to | ((_, to), _) <- transitions s ts] ++ todo) (s : seen)`,
          "```",
        ),
      ],
      solution: hs`pruneTransitions :: [Transition] -> LTS
pruneTransitions ts
  = [t | t@((from, _), _) <- ts, elem from reachable]
  where
    reachable = explore [0] []

    -- explore (states still to visit) (states already visited)
    explore [] seen
      = seen
    explore (s : todo) seen
      | elem s seen = explore todo seen
      | otherwise
        = explore ([to | ((_, to), _) <- transitions s ts] ++ todo) (s : seen)`,
      tests: [
        { expr: 'pruneTransitions [((0,1),"d"),((1,4),"a"),((2,5),"a")]', expected: '[((0,1),"d"),((1,4),"a")]', unordered: true },
        { expr: "pruneTransitions []", expected: "[]" },
        { expr: 'pruneTransitions [((1,2),"a"),((2,1),"b")]', expected: "[]", label: "nothing leaves state 0" },
        { expr: "pruneTransitions clockPlayLTS", expected: "clockPlayLTS", unordered: true, label: "everything reachable, with cycles" },
        { expr: 'pruneTransitions [((0,1),"a"),((1,0),"b"),((3,0),"c"),((1,2),"d"),((2,2),"e")]', expected: '[((0,1),"a"),((1,0),"b"),((1,2),"d"),((2,2),"e")]', unordered: true, label: "a transition INTO the reachable part from outside goes" },
        { expr: 'pruneTransitions [((0,1),"a"),((0,2),"b"),((1,3),"c"),((2,3),"d"),((3,4),"e"),((5,4),"f")]', expected: '[((0,1),"a"),((0,2),"b"),((1,3),"c"),((2,3),"d"),((3,4),"e")]', unordered: true, label: "two paths to the same state: no duplicates" },
      ],
    },
    {
      id: "compose",
      name: "compose",
      part: "Part IV",
      marks: 4,
      prompt: md(
        "Using `composeTransitions` and `pruneTransitions`, write `compose :: LTS -> LTS -> LTS`, which builds the LTS of two LTSs running side by side:",
        "",
        "1. Make every pair `(s, s')` of a state `s` of the first LTS and a state `s'` of the second (the cartesian product). Number them `0, 1, 2, ...` to make the state map, making sure the pair `(0, 0)` gets number 0.",
        "2. For each pair `(s, s')`, take the transitions out of `s` and the transitions out of `s'`, and use `composeTransitions` on every combination of one from each. Join all the results.",
        "3. Prune the result to the transitions reachable from state 0.",
        "",
        "The catch: if `s` has no outgoing transitions, there are no combinations, and the moves of `s'` would be lost. Fix this by giving such a state a dummy transition with a sentinel label that can't be a real action: `((s, s), \"$\")` for a state of the first LTS, `((s', s'), \"$'\")` for the second (they must be different, or they'd synchronise with each other). When a transition from one side has a sentinel label, add that label to the OTHER side's alphabet when you call `composeTransitions`. Then the rules automatically make the sentinel wait forever and let the real action go.",
        "",
        "Your states may be numbered differently from the samples; the tests compare up to renumbering (`sameLTS`):",
        "",
        "```",
        hs`*Main> sameLTS (compose clockLTS playLTS) clockPlayLTS
True
*Main> sameLTS (compose makerLTS userLTS) makerUserLTS
True
*Main> sameLTS (compose pLTS qLTS) pqLTS
True`,
        "```",
        "",
        "The same composed transition can come out more than once (from different combinations), so remove duplicates.",
      ),
      hints: [
        "Steps: state pairs with a comprehension, state map with `zip pairs [0..]`, the composed transitions with a nested comprehension, then `nub` and `pruneTransitions`.",
        "For the state lists, use `0 : delete 0 (states lts)` so that 0 comes first and `(0, 0)` gets number 0. Write a helper `outOf s lts sentinel` that returns `transitions s lts`, or `[((s, s), sentinel)]` if that is empty.",
        "For each pair of transitions `t` (from the first LTS) and `t'` (from the second), call `composeTransitions t t' alpha1' alpha2' m` where `alpha1'` is the first alphabet plus `t'`'s label if that is a sentinel, and `alpha2'` is the second alphabet plus `t`'s label if that is a sentinel.",
        md(
          "```",
          hs`compose lts1 lts2 = pruneTransitions (nub (concatMap composePair pairs))
  where
    pairs = [(s, s') | s <- statesOf lts1, s' <- statesOf lts2]
    m = zip pairs [0..]
    statesOf lts = 0 : delete 0 (states lts)
    composePair (s, s') = concat
      [composeTransitions t t' (withSentinel t' (alphabet lts1)) (withSentinel t (alphabet lts2)) m
      | t <- outOf s lts1 "$", t' <- outOf s' lts2 "$'"]
    withSentinel (_, x) alpha = if head x == '$' then x : alpha else alpha`,
          "```",
        ),
      ],
      solution: hs`compose :: LTS -> LTS -> LTS
compose lts1 lts2
  = pruneTransitions (nub (concatMap composePair pairs))
  where
    pairs = [(s, s') | s <- statesOf lts1, s' <- statesOf lts2]
    m = zip pairs [0..]
    alpha1 = alphabet lts1
    alpha2 = alphabet lts2

    -- State 0 first, so that the pair (0, 0) is numbered 0.
    statesOf lts = 0 : delete 0 (states lts)

    -- A state with no way out gets a dummy transition with a sentinel label.
    outOf s lts sentinel
      | null ts   = [((s, s), sentinel)]
      | otherwise = ts
      where
        ts = transitions s lts

    withSentinel (_, x) alpha
      | isSentinel x = x : alpha
      | otherwise    = alpha

    isSentinel x = take 1 x == "$"

    composePair (s, s')
      = concat [composeTransitions t t' (withSentinel t' alpha1)
                                        (withSentinel t alpha2) m
               | t <- outOf s lts1 "$", t' <- outOf s' lts2 "$'"]`,
      tests: [
        { expr: "sameLTS (compose clockLTS playLTS) clockPlayLTS", label: "CLOCK || PLAY (state 2 of PLAY has no way out)" },
        { expr: "sameLTS (compose makerLTS userLTS) makerUserLTS", label: "MAKER || USER (ready is shared)" },
        { expr: "sameLTS (compose pLTS qLTS) pqLTS", label: "P || Q (b and c are shared and block each other)" },
        { expr: "sameLTS (compose playLTS clockLTS) clockPlayLTS", label: "composing in the other order gives the same shape" },
        { expr: "sameLTS (compose clockLTS clockLTS) clockLTS", label: "a process composed with itself synchronises on everything" },
        { expr: "sameLTS (compose pLTS []) pLTS", label: "composing with an LTS that can do nothing" },
        { expr: 'sameLTS (compose [((0,1),"a")] [((0,1),"b")]) [((0,1),"a"),((0,2),"b"),((1,3),"b"),((2,3),"a")]', label: "both sides stop: both sentinels are needed" },
        { expr: 'length (compose vendorLTS switchLTS)', expected: "13", label: "vendor and switch share off" },
      ],
    },
    {
      id: "buildlts",
      name: "buildLTS",
      part: "Part V",
      marks: 0,
      prompt: md(
        "Hidden part, no marks, eternal glory. Write `buildLTS :: [ProcessDef] -> LTS`, which builds an LTS for the start process (the first definition). Any other processes it refers to are also in the list.",
        "",
        "```",
        hs`*Main> buildLTS [vendor]
[((0,3),"red"),((3,0),"coffee"),((0,2),"blue"),((2,0),"tea"),((0,1),"off")]`,
        "```",
        "",
        "The start state must be 0, but the other state numbers can be any unique positive numbers. Many different LTSs behave the same way. For example `SWITCH = OFF, OFF = (on -> ON), ON = (off -> OFF)` has the two-state LTS `[((0,1),\"on\"),((1,0),\"off\")]`, but the three-state `[((0,1),\"on\"),((1,2),\"off\"),((2,1),\"on\")]` has exactly the same traces and is also acceptable.",
        "",
        "The tests check that your LTS has exactly the same traces (up to length 6) as the sample LTS. `Process` is an instance of `Eq`, which helps.",
      ),
      hints: [
        "Give every distinct process term you can reach its own state. Each `Prefix a next` inside it is a transition labelled `a` to the state of `next`. Remember which terms already have numbers so loops come back to the same state.",
        "First replace any `Ref name` by its definition (repeat while it is still a `Ref`), so `Ref \"VENDOR\"` and VENDOR's body get the same state. A term's moves: `Prefix a next` has one move `(a, next)`; `Choice ps` has the moves of all the `ps`; `STOP` has none.",
        "Keep a table `[(Process, State)]` and a worklist of terms still to process. For each term, give its unseen targets new numbers (the length of the table works), output its transitions, and add the new targets to the worklist.",
        md(
          "```",
          hs`buildLTS defs = explore [start] [(start, 0)]
  where
    start = resolve (snd (head defs))
    resolve (Ref n) = resolve (lookUp n defs)
    resolve other   = other
    moves (Prefix a next) = [(a, resolve next)]
    moves (Choice ps)     = concatMap (moves . resolve) ps
    moves _               = []
    explore [] _ = []
    explore (proc : todo) table = ...`,
          "```",
        ),
      ],
      solution: hs`buildLTS :: [ProcessDef] -> LTS
buildLTS defs
  = explore [start] [(start, 0)]
  where
    start = resolve (snd (head defs))

    -- Replace references by their definitions.
    resolve (Ref name) = resolve (lookUp name defs)
    resolve other      = other

    moves (Prefix a next) = [(a, resolve next)]
    moves (Choice ps)     = concatMap (moves . resolve) ps
    moves _               = []

    -- explore (terms still to process) (each term seen so far, with its state)
    explore [] _
      = []
    explore (proc : todo) table
      = [((lookUp proc table', lookUp next table'), a) | (a, next) <- moves proc]
        ++ explore (todo ++ new) table'
      where
        targets = nub (map snd (moves proc))
        new = [t | t <- targets, notElem t (map fst table)]
        table' = table ++ zip new [length table ..]`,
      tests: [
        { expr: "sameTraces 6 (buildLTS [vendor]) vendorLTS" },
        { expr: "sameTraces 6 (buildLTS [clock]) clockLTS" },
        { expr: "sameTraces 6 (buildLTS [play]) playLTS" },
        { expr: "sameTraces 6 (buildLTS [maker]) makerLTS" },
        { expr: "sameTraces 6 (buildLTS [user]) userLTS" },
        { expr: "sameTraces 6 (buildLTS [p]) pLTS" },
        { expr: "sameTraces 6 (buildLTS [q]) qLTS" },
        { expr: "sameTraces 6 (buildLTS [switch, off, on]) switchLTS", label: "the start process is just a reference" },
        { expr: 'buildLTS [("S", STOP)]', expected: "[]" },
        { expr: "elem 0 (states (buildLTS [vendor]))", expected: "True", label: "the start state is 0" },
      ],
    },
  ],
};
