import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "m09",
  year: 0,
  difficulty: 9,
  minutes: 90,
  title: "Mini paper 9: Robot on a grid",
  summary:
    "A robot follows a program of commands on a grid with walls. Turn and step, check for walls, run a program while threading the robot's state, record its path, find the first square it revisits, and optimise programs by cancelling moves.",
  skills: [
    "enumerated data types and cyclic successors",
    "tuples as state",
    "threading state through a list (foldl or recursion)",
    "recursion on a counter (Forward n)",
    "producing a list of intermediate states",
    "an accumulating 'visited' list",
    "rewriting a list until nothing changes (fixpoint)",
  ],
  story: md(
    "This paper has no tree in it. Instead it practises the other big idea of the real tests: **state that changes step by step**. A robot's position and direction change after every command, and each function passes the new state on to the next step.",
    "",
    "**The domain.** A little robot lives on a rectangular grid of squares. Each square has coordinates `(x, y)`: `x` counts squares from the left (west) edge, `y` counts squares up from the bottom (south) edge, both starting at 0. Some squares contain **walls**. Here is the example room, 5 squares wide and 4 high, with walls marked `#`:",
    "",
    "```",
    "y=3   .  .  .  .  #",
    "y=2   .  .  #  .  .",
    "y=1   .  .  #  .  .",
    "y=0   R  .  .  .  .",
    "     x=0  1  2  3  4",
    "```",
    "",
    "The robot `R` starts in the bottom-left corner `(0, 0)` facing north (up). It understands three commands:",
    "",
    "- **Forward n**: move `n` squares in the direction it is facing, one square at a time. If the next square is a wall or off the grid, the robot stops where it is and ignores the rest of the `n` steps (it doesn't crash).",
    "- **Turn left** and **turn right**: turn 90 degrees on the spot. Turning right from north faces east; turning left from north faces west.",
    "",
    "A **program** is a list of commands, carried out in order. For example, from the start, `Forward 2, TurnRight, Forward 3` moves up to `(0, 2)`, turns east, moves to `(1, 2)` and then stops, because `(2, 2)` is a wall.",
    "",
    "**Path and revisits.** The **trace** of a program is the list of squares the robot is in, in order: where it starts, and then each square it enters. A program that walks round in a circle comes back to a square it has already visited, which is often a sign of a wasteful program.",
    "",
    "**Optimising.** `TurnLeft` immediately followed by `TurnRight` does nothing, and `Forward 2, Forward 1` is the same as `Forward 3`. An optimiser shortens programs using rules like these without changing where the robot ends up.",
    "",
    "### The given types",
    "",
    "```haskell",
    "type Pos = (Int, Int)",
    "",
    "data Dir = North | East | South | West",
    "",
    "data Cmd = Forward Int | TurnLeft | TurnRight",
    "",
    "type Robot = (Pos, Dir)",
    "",
    "type Grid = (Int, Int, [Pos])",
    "```",
    "",
    "- A `Pos` is a square `(x, y)`.",
    "- A `Dir` is one of the four compass directions. North is `y + 1`, east is `x + 1`, south is `y - 1` and west is `x - 1`.",
    "- A `Cmd` is one command. In `Forward n`, `n` is never negative (but may be 0).",
    "- A `Robot` is its position and the direction it faces, e.g. `((0, 0), North)`.",
    "- A `Grid` is `(width, height, walls)`. The squares on the grid are those with `0 <= x < width` and `0 <= y < height`.",
    "",
    "Given to you: the room `room`, the starting robot `start`, and the programs `prog1`, `prog2` and `prog3`:",
    "",
    "```",
    "prog1 = [Forward 2, TurnRight, Forward 3, TurnRight, Forward 5]",
    "prog2 = [Forward 1, TurnRight, Forward 1, TurnRight, Forward 1,",
    "         TurnRight, Forward 1, TurnRight, Forward 3]",
    "prog3 = [TurnLeft, TurnRight, Forward 2, Forward 0, Forward 1,",
    "         TurnRight, TurnLeft, TurnLeft, Forward 0, Forward 3]",
    "```",
  ),
  notes: md(
    "**Where the marks are.** Part I (single moves) is 6 marks, Part II (running programs) is 7, and Part III (analysing programs) is 7.",
    "",
    "**Order of attack.** Part I is three short functions; get them right because everything else uses them. `exec` is the heart of the paper: one command at a time, with `Forward n` done one square at a time by recursion on `n`. Then `run` is a one-liner with `foldl`. `trace` is like `run` but keeps every square. In Part III, `firstRevisit` and `optimise` are independent of each other.",
    "",
    "**Traps.**",
    "",
    "- Walls *and* the edges of the grid both block the robot. Coordinates are valid from 0 up to width - 1 (and height - 1).",
    "- A blocked `Forward` doesn't move the robot at all for the remaining steps, but the commands after it still run.",
    "- In `trace`, a blocked step adds nothing, and turns add nothing: only squares actually *entered* are recorded.",
    "- `optimise` must keep applying its rules until none apply: removing `TurnLeft, TurnRight` from the middle of `Forward 1, TurnLeft, TurnRight, Forward 2` creates a new pair of `Forward`s to merge.",
    "",
    "**Self-check.** An optimised program must end in the same place: `run room start (optimise p) == run room start p` for every example program.",
  ),
  setup: hs`import Data.List
import Data.Maybe

type Pos = (Int, Int)

data Dir = North | East | South | West
         deriving (Eq, Show)

data Cmd = Forward Int | TurnLeft | TurnRight
         deriving (Eq, Show)

type Robot = (Pos, Dir)

-- (width, height, walls)
type Grid = (Int, Int, [Pos])

--------------------------------------------------------------
-- Example data

-- y=3   .  .  .  .  #
-- y=2   .  .  #  .  .
-- y=1   .  .  #  .  .
-- y=0   .  .  .  .  .
--      x=0  1  2  3  4
room :: Grid
room = (5, 4, [(2, 1), (2, 2), (4, 3)])

start :: Robot
start = ((0, 0), North)

prog1 :: [Cmd]
prog1 = [Forward 2, TurnRight, Forward 3, TurnRight, Forward 5]

prog2 :: [Cmd]
prog2 = [Forward 1, TurnRight, Forward 1, TurnRight, Forward 1,
         TurnRight, Forward 1, TurnRight, Forward 3]

prog3 :: [Cmd]
prog3 = [TurnLeft, TurnRight, Forward 2, Forward 0, Forward 1,
         TurnRight, TurnLeft, TurnLeft, Forward 0, Forward 3]
`,
  starter: hs`--------------------------------------------------------------
-- Part I

turnLeft :: Dir -> Dir
turnLeft = undefined

turnRight :: Dir -> Dir
turnRight = undefined

step :: Dir -> Pos -> Pos
step = undefined

isFree :: Grid -> Pos -> Bool
isFree = undefined

--------------------------------------------------------------
-- Part II

exec :: Grid -> Robot -> Cmd -> Robot
exec = undefined

run :: Grid -> Robot -> [Cmd] -> Robot
run = undefined

trace :: Grid -> Robot -> [Cmd] -> [Pos]
trace = undefined

--------------------------------------------------------------
-- Part III

firstRevisit :: Grid -> Robot -> [Cmd] -> Maybe Pos
firstRevisit = undefined

optimise :: [Cmd] -> [Cmd]
optimise = undefined
`,
  tasks: [
    {
      id: "turns",
      name: "turnLeft and turnRight",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define two functions `turnLeft :: Dir -> Dir` and `turnRight :: Dir -> Dir` that give the direction the robot faces after turning 90 degrees left (anticlockwise) or right (clockwise). For example:",
        "",
        "```",
        "ghci> turnRight North",
        "East",
        "ghci> turnRight West",
        "North",
        "ghci> turnLeft North",
        "West",
        "ghci> turnLeft (turnLeft South)",
        "North",
        "```",
      ),
      hints: [
        "Four equations each, one per direction.",
        "Clockwise order is North, East, South, West, and then back to North. `turnRight` moves one step along that cycle.",
        "`turnLeft` goes the other way round: North to West, West to South, and so on.",
        md(
          "```",
          "turnRight North = East",
          "turnRight East = South",
          "turnRight South = West",
          "turnRight West = North",
          "```",
        ),
      ],
      solution: hs`turnLeft :: Dir -> Dir
turnLeft North = West
turnLeft West = South
turnLeft South = East
turnLeft East = North

turnRight :: Dir -> Dir
turnRight North = East
turnRight East = South
turnRight South = West
turnRight West = North`,
      tests: [
        { expr: "turnRight North", expected: "East" },
        { expr: "turnRight West", expected: "North" },
        { expr: "turnLeft North", expected: "West" },
        { expr: "turnLeft (turnLeft South)", expected: "North" },
        { expr: "map turnRight [North, East, South, West]", expected: "[East, South, West, North]" },
        { expr: "map turnLeft [North, East, South, West]", expected: "[West, North, East, South]" },
        { expr: "map (turnLeft . turnRight) [North, East, South, West]", expected: "[North, East, South, West]", label: "left undoes right" },
      ],
    },
    {
      id: "step",
      name: "step",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `step :: Dir -> Pos -> Pos` that gives the square next to a position in the given direction (ignoring walls and edges). North increases `y`, east increases `x`, south decreases `y` and west decreases `x`. For example:",
        "",
        "```",
        "ghci> step North (3, 1)",
        "(3,2)",
        "ghci> step West (3, 1)",
        "(2,1)",
        "ghci> step South (0, 0)",
        "(0,-1)",
        "```",
      ),
      hints: [
        "One equation per direction, pattern matching on the position as a pair `(x, y)`.",
        "Each equation changes exactly one coordinate by 1.",
        "`step North (x, y) = (x, y + 1)`.",
        md(
          "```",
          "step North (x, y) = (x, y + 1)",
          "step East (x, y) = (x + 1, y)",
          "step South (x, y) = (x, y - 1)",
          "step West (x, y) = (x - 1, y)",
          "```",
        ),
      ],
      solution: hs`step :: Dir -> Pos -> Pos
step North (x, y) = (x, y + 1)
step East (x, y) = (x + 1, y)
step South (x, y) = (x, y - 1)
step West (x, y) = (x - 1, y)`,
      tests: [
        { expr: "step North (3, 1)", expected: "(3, 2)" },
        { expr: "step West (3, 1)", expected: "(2, 1)" },
        { expr: "step South (0, 0)", expected: "(0, -1)" },
        { expr: "step East (4, 3)", expected: "(5, 3)" },
        { expr: "step South (step North (2, 2))", expected: "(2, 2)" },
        { expr: "step East (step East (0, 0))", expected: "(2, 0)" },
      ],
    },
    {
      id: "isFree",
      name: "isFree",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `isFree :: Grid -> Pos -> Bool` that is `True` if the robot may stand on the square: it must be on the grid (`0 <= x < width` and `0 <= y < height`) and must not be a wall. For example:",
        "",
        "```",
        "ghci> isFree room (1, 2)",
        "True",
        "ghci> isFree room (2, 2)",
        "False",
        "ghci> isFree room (5, 0)",
        "False",
        "ghci> isFree room (0, -1)",
        "False",
        "```",
      ),
      hints: [
        "Pattern match the grid as a triple `(w, h, walls)` and the position as `(x, y)`.",
        "There are five conditions, all of which must hold; join them with `&&`.",
        "\"Not a wall\" is `notElem (x, y) walls` (or `not (elem (x, y) walls)`).",
        md(
          "```",
          "isFree (w, h, walls) (x, y)",
          "  = x >= 0 && x < w && y >= 0 && y < h && notElem (x, y) walls",
          "```",
        ),
      ],
      solution: hs`isFree :: Grid -> Pos -> Bool
isFree (w, h, walls) (x, y)
  = x >= 0 && x < w && y >= 0 && y < h && notElem (x, y) walls`,
      tests: [
        { expr: "isFree room (1, 2)", expected: "True" },
        { expr: "isFree room (2, 2)", expected: "False" },
        { expr: "isFree room (5, 0)", expected: "False" },
        { expr: "isFree room (0, -1)", expected: "False" },
        { expr: "isFree room (4, 3)", expected: "False" },
        { expr: "isFree room (4, 2)", expected: "True" },
        { expr: "isFree room (0, 4)", expected: "False" },
        { expr: "isFree (1, 1, []) (0, 0)", expected: "True" },
        { expr: "isFree room (-1, 0)", expected: "False" },
      ],
    },
    {
      id: "execRun",
      name: "exec and run",
      part: "Part II",
      marks: 4,
      prompt: md(
        "Define a function `exec :: Grid -> Robot -> Cmd -> Robot` that carries out one command:",
        "",
        "- `TurnLeft` and `TurnRight` change the direction and keep the position.",
        "- `Forward n` moves the robot one square at a time in the direction it faces, up to `n` times. As soon as the next square is not free (see `isFree`), the robot stops where it is.",
        "",
        "Then define `run :: Grid -> Robot -> [Cmd] -> Robot` that carries out a whole program, each command starting from where the previous one left the robot. For example:",
        "",
        "```",
        "ghci> exec room start (Forward 2)",
        "((0,2),North)",
        "ghci> exec room ((0,2),East) (Forward 3)",
        "((1,2),East)",
        "ghci> exec room start TurnLeft",
        "((0,0),West)",
        "ghci> run room start prog1",
        "((1,0),South)",
        "ghci> run room start prog2",
        "((0,3),North)",
        "```",
        "",
        "In `prog1` the robot goes up to `(0, 2)`, turns east, is stopped by the wall at `(2, 2)` after one square, turns south and is stopped by the bottom edge at `(1, 0)`.",
      ),
      hints: [
        "For `Forward n`, use recursion on `n`. With `n` steps left: if `n` is 0, stay. Otherwise look at the next square `step d p`. If it's free, move there and carry on with `Forward (n - 1)`; if not, stop.",
        "Use guards for the three possibilities and a `where` for the next square: `where p' = step d p`.",
        "`run` threads the robot through the list. Explicit recursion works (`run g r (c : cs) = run g (exec g r c) cs`), and so does `foldl (exec g) r cs`, because `exec g` takes the robot first and the command second.",
        md(
          "```",
          "exec g (p, d) (Forward n)",
          "  | n <= 0       = (p, d)",
          "  | isFree g p'  = exec g (p', d) (Forward (n - 1))",
          "  | otherwise    = (p, d)",
          "  where",
          "    p' = step d p",
          "",
          "run g r cs = foldl (exec g) r cs",
          "```",
        ),
      ],
      solution: hs`exec :: Grid -> Robot -> Cmd -> Robot
exec _ (p, d) TurnLeft = (p, turnLeft d)
exec _ (p, d) TurnRight = (p, turnRight d)
exec g (p, d) (Forward n)
  | n <= 0      = (p, d)
  | isFree g p' = exec g (p', d) (Forward (n - 1))
  | otherwise   = (p, d)
  where
    p' = step d p

run :: Grid -> Robot -> [Cmd] -> Robot
run g r cs = foldl (exec g) r cs`,
      tests: [
        { expr: "exec room start (Forward 2)", expected: "((0, 2), North)" },
        { expr: "exec room ((0, 2), East) (Forward 3)", expected: "((1, 2), East)" },
        { expr: "exec room start TurnLeft", expected: "((0, 0), West)" },
        { expr: "exec room start (Forward 0)", expected: "start" },
        { expr: "exec room start (Forward 10)", expected: "((0, 3), North)", label: "stopped by the top edge" },
        { expr: "exec room ((1, 1), East) (Forward 2)", expected: "((1, 1), East)", label: "blocked straight away by a wall" },
        { expr: "run room start prog1", expected: "((1, 0), South)" },
        { expr: "run room start prog2", expected: "((0, 3), North)" },
        { expr: "run room start []", expected: "start" },
        { expr: "run room ((3, 0), North) [Forward 5, TurnLeft, Forward 1, TurnRight, Forward 1]", expected: "((2, 3), North)" },
      ],
    },
    {
      id: "trace",
      name: "trace",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define a function `trace :: Grid -> Robot -> [Cmd] -> [Pos]` that returns every square the robot is in while running a program: its starting square first, then each square it **enters**, in order. Turns and blocked steps add nothing to the trace. For example:",
        "",
        "```",
        "ghci> trace room start prog1",
        "[(0,0),(0,1),(0,2),(1,2),(1,1),(1,0)]",
        "ghci> trace room start [TurnRight]",
        "[(0,0)]",
        "ghci> trace room start prog2",
        "[(0,0),(0,1),(1,1),(1,0),(0,0),(0,1),(0,2),(0,3)]",
        "```",
        "",
        "The last square of the trace is always the position given by `run`.",
      ),
      hints: [
        "The answer is the starting position followed by the squares entered. Write a local helper that produces only the squares entered, and put `fst r :` in front of it.",
        "The helper works through the command list carrying the current robot. A turn adds nothing: carry on with `exec g r c`. A `Forward n` with `n > 0` is one step at a time, so break it into `Forward 1` followed by `Forward (n - 1)`.",
        "Try one square with `r' = exec g r (Forward 1)`. If `r'` is different from `r`, the robot moved: output `fst r'` and continue from `r'` with `Forward (n - 1)`. If `r' == r`, it was blocked, so skip the rest of this command.",
        md(
          "```",
          "trace g r cs = fst r : entered r cs",
          "  where",
          "    entered _ [] = []",
          "    entered r (Forward n : rest)",
          "      | n > 0 && r' /= r = fst r' : entered r' (Forward (n - 1) : rest)",
          "      where r' = exec g r (Forward 1)",
          "    entered r (c : rest) = entered (exec g r c) rest",
          "```",
          "",
          "If the guard fails, Haskell falls through to the last equation, which runs the command (a blocked or zero `Forward` changes nothing) and moves on.",
        ),
      ],
      solution: hs`trace :: Grid -> Robot -> [Cmd] -> [Pos]
trace g r0 cs0 = fst r0 : entered r0 cs0
  where
    -- the squares entered while running the commands
    entered _ [] = []
    entered r (Forward n : rest)
      | n > 0 && r' /= r = fst r' : entered r' (Forward (n - 1) : rest)
      where
        r' = exec g r (Forward 1)
    entered r (c : rest) = entered (exec g r c) rest`,
      tests: [
        { expr: "trace room start prog1", expected: "[(0,0),(0,1),(0,2),(1,2),(1,1),(1,0)]" },
        { expr: "trace room start [TurnRight]", expected: "[(0,0)]" },
        { expr: "trace room start prog2", expected: "[(0,0),(0,1),(1,1),(1,0),(0,0),(0,1),(0,2),(0,3)]" },
        { expr: "trace room start []", expected: "[(0,0)]" },
        { expr: "trace room ((1, 1), East) [Forward 3, TurnLeft, Forward 1]", expected: "[(1,1),(1,2)]", label: "a blocked Forward adds nothing" },
        { expr: "trace room start [Forward 9, TurnRight, Forward 9]", expected: "[(0,0),(0,1),(0,2),(0,3),(1,3),(2,3),(3,3)]" },
        { expr: "last (trace room start prog1) == fst (run room start prog1)", label: "the trace ends where run ends" },
        { expr: "trace room start [Forward 0, TurnLeft, Forward 2]", expected: "[(0,0)]" },
      ],
    },
    {
      id: "firstRevisit",
      name: "firstRevisit",
      part: "Part III",
      marks: 3,
      prompt: md(
        "Define a function `firstRevisit :: Grid -> Robot -> [Cmd] -> Maybe Pos` that finds the first moment the robot enters a square it has already been in during the program (its starting square counts as visited). The result is `Just` that square, or `Nothing` if the robot never revisits a square. For example:",
        "",
        "```",
        "ghci> firstRevisit room start prog2",
        "Just (0,0)",
        "ghci> firstRevisit room start prog1",
        "Nothing",
        "ghci> firstRevisit room start [Forward 2, TurnLeft, TurnLeft, Forward 1]",
        "Just (0,1)",
        "```",
        "",
        "In `prog2` the robot walks round a little square and comes back to `(0, 0)` before it reaches `(0, 1)` for the second time, so the answer is `(0, 0)`.",
      ),
      hints: [
        "Use your `trace`: the question is really about the list of squares, so write a helper on `[Pos]`.",
        "Walk along the trace carrying a list of the squares seen so far, starting with `[]`.",
        "At each square: if it is already in the seen list, that's the answer (`Just` it). Otherwise add it to the seen list and continue. Reaching the end of the trace means `Nothing`.",
        md(
          "```",
          "firstRevisit g r cs = go [] (trace g r cs)",
          "  where",
          "    go _ [] = Nothing",
          "    go seen (p : ps)",
          "      | elem p seen = Just p",
          "      | otherwise   = go (p : seen) ps",
          "```",
        ),
      ],
      solution: hs`firstRevisit :: Grid -> Robot -> [Cmd] -> Maybe Pos
firstRevisit g r cs = go [] (trace g r cs)
  where
    go _ [] = Nothing
    go seen (p : ps)
      | elem p seen = Just p
      | otherwise   = go (p : seen) ps`,
      tests: [
        { expr: "firstRevisit room start prog2", expected: "Just (0, 0)" },
        { expr: "firstRevisit room start prog1", expected: "Nothing" },
        { expr: "firstRevisit room start [Forward 2, TurnLeft, TurnLeft, Forward 1]", expected: "Just (0, 1)" },
        { expr: "firstRevisit room start []", expected: "Nothing" },
        { expr: "firstRevisit room start [TurnLeft, Forward 3, TurnRight, Forward 1]", expected: "Nothing", label: "blocked moves don't count as revisits" },
        { expr: "firstRevisit room start [TurnRight, Forward 4, TurnLeft, TurnLeft, Forward 9]", expected: "Just (3, 0)" },
        { expr: "firstRevisit room ((3, 1), North) [Forward 1, TurnRight, Forward 1, TurnRight, Forward 1, TurnRight, Forward 1]", expected: "Just (3, 1)" },
      ],
    },
    {
      id: "optimise",
      name: "optimise",
      part: "Part III",
      marks: 4,
      prompt: md(
        "Define a function `optimise :: [Cmd] -> [Cmd]` that shortens a program using these rules, which never change where the robot ends up:",
        "",
        "- `Forward 0` is removed.",
        "- `Forward a` immediately followed by `Forward b` becomes `Forward (a + b)`.",
        "- `TurnLeft` immediately followed by `TurnRight` is removed, and so is `TurnRight` immediately followed by `TurnLeft`.",
        "",
        "Keep applying the rules until none of them applies anywhere in the program. Use exactly these rules (for example, don't replace three right turns by one left turn). For example:",
        "",
        "```",
        "ghci> optimise prog3",
        "[Forward 3,TurnLeft,Forward 3]",
        "ghci> optimise [Forward 1, TurnLeft, TurnRight, Forward 2]",
        "[Forward 3]",
        "ghci> optimise [TurnLeft, TurnLeft, TurnRight, TurnRight]",
        "[]",
        "ghci> optimise prog1",
        "[Forward 2,TurnRight,Forward 3,TurnRight,Forward 5]",
        "```",
        "",
        "In the second example, removing the turns brings two `Forward`s together, which can then be merged.",
      ),
      hints: [
        "Split the job in two: a function `pass` that goes once along the list applying the rules, and `optimise`, which repeats `pass` until the list stops changing.",
        "`pass` pattern matches on the first one or two commands, e.g. `pass (Forward a : Forward b : rest) = pass (Forward (a + b) : rest)` (passing the merged command back in lets it merge again with a third `Forward`). End with `pass (c : rest) = c : pass rest` and `pass [] = []`.",
        "For the repetition: compute `p' = pass p`; if `p' == p` nothing changed and `p` is the answer, otherwise `optimise p'`. (`Cmd` derives `Eq`, so lists of commands can be compared with `==`.)",
        md(
          "```",
          "optimise p",
          "  | p' == p    = p",
          "  | otherwise  = optimise p'",
          "  where",
          "    p' = pass p",
          "",
          "pass (Forward 0 : rest) = pass rest",
          "pass (Forward a : Forward b : rest) = pass (Forward (a + b) : rest)",
          "pass (TurnLeft : TurnRight : rest) = pass rest",
          "pass (TurnRight : TurnLeft : rest) = pass rest",
          "pass (c : rest) = c : pass rest",
          "pass [] = []",
          "```",
        ),
      ],
      solution: hs`optimise :: [Cmd] -> [Cmd]
optimise p
  | p' == p   = p
  | otherwise = optimise p'
  where
    p' = pass p

-- One sweep along the program applying the rules
pass :: [Cmd] -> [Cmd]
pass (Forward 0 : rest) = pass rest
pass (Forward a : Forward b : rest) = pass (Forward (a + b) : rest)
pass (TurnLeft : TurnRight : rest) = pass rest
pass (TurnRight : TurnLeft : rest) = pass rest
pass (c : rest) = c : pass rest
pass [] = []`,
      tests: [
        { expr: "optimise prog3", expected: "[Forward 3, TurnLeft, Forward 3]" },
        { expr: "optimise [Forward 1, TurnLeft, TurnRight, Forward 2]", expected: "[Forward 3]" },
        { expr: "optimise [TurnLeft, TurnLeft, TurnRight, TurnRight]", expected: "[]" },
        { expr: "optimise prog1", expected: "prog1", label: "nothing to do in prog1" },
        { expr: "optimise []", expected: "[]" },
        { expr: "optimise [Forward 0, Forward 0]", expected: "[]" },
        { expr: "optimise [TurnRight, TurnRight, TurnRight]", expected: "[TurnRight, TurnRight, TurnRight]", label: "no extra rules" },
        { expr: "optimise [Forward 1, Forward 2, Forward 3, TurnRight, Forward 0, TurnLeft, Forward 4]", expected: "[Forward 10]" },
        { expr: "all (\\p -> run room start (optimise p) == run room start p) [prog1, prog2, prog3]", label: "optimised programs end in the same place" },
      ],
    },
  ],
};
