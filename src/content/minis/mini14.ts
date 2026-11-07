import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "m14",
  year: 0,
  difficulty: 14,
  minutes: 150,
  title: "Mini paper 14: Train network routes",
  summary:
    "Plan journeys on a metro map: list stations and neighbours, find everywhere you can reach, the route with fewest stops (breadth-first search), the fewest changes of line, and the arrival time of a journey using a timetable.",
  skills: [
    "lists of pairs as lookup tables",
    "nub, sort and list comprehensions over a graph",
    "graph search with a visited list",
    "breadth-first search with a queue of paths",
    "repeating a step k times",
    "searching an infinite list of candidates",
    "chaining Maybe results with case",
  ],
  story: md(
    "This paper is about **planning train journeys**. A metro **network** is made of **lines**. Each line is a sequence of **stations**, and trains run along it in both directions, stopping at every station. Two stations are **neighbours** if they are next to each other on some line. A station where several lines meet is an **interchange**: you can **change** there from one line to another.",
    "",
    "Here is the example network `metro` of the city of Metroville:",
    "",
    "```",
    "Red:     Airport - Docks - Central - Market - Zoo",
    "Blue:    Harbour - Docks - Museum - Park",
    "Green:   Museum - Central - Uni - Hill",
    "Yellow:  Zoo - Hill - Lake",
    "Shuttle: Island - Pier",
    "```",
    "",
    "Docks, Central, Museum, Zoo and Hill are interchanges. The Shuttle is not connected to anything else: you can't get to Pier from Airport.",
    "",
    "**Fewest stops.** To go from Airport to Lake with the fewest stops, you go Airport, Docks, Central, Uni, Hill, Lake (5 stops). The standard way to find such a route is **breadth-first search** (BFS): first look at all stations 1 stop away, then all stations 2 stops away, and so on. The first time you reach the destination, the route you took is a shortest one. BFS keeps a **queue** of routes to extend: take the route at the front, and add each extension (one more stop to a station not seen before) to the **back**.",
    "",
    "**Fewest changes.** Changing trains is annoying, so passengers may prefer a route with fewer changes even if it has more stops. With 0 changes from Docks you can reach everything on the Red and Blue lines. With 1 change you can also reach everything on any line that meets one of those stations, and so on.",
    "",
    "**Timetables.** Times are whole numbers of **minutes after midnight**: 6:30am is `390`. The timetable says, for each line and station, when trains leave (in either direction). Every train takes `minsPerStop = 2` minutes per stop, and changing trains takes no time: you can catch a train that leaves at the very minute you arrive.",
    "",
    "### The given types",
    "",
    "```",
    "type Station = String",
    "type Line = String",
    "type Network = [(Line, [Station])]",
    "type Time = Int",
    "type Timetable = [((Line, Station), [Time])]",
    "type Leg = (Line, Station, Station)",
    "```",
    "",
    "- A `Network` pairs each line's name with its stations in order along the line. No station appears twice on the same line.",
    "- A `Timetable` pairs a line and station with the departure times from there, in increasing order.",
    "- A `Leg` `(line, from, to)` is one part of a journey: ride `line` from `from` to `to`.",
    "",
    "Given to you: `lookUp`, `minsPerStop`, `showTime` (prints a time like `\"06:30\"`), the network `metro`, its `timetable`, `gridNet n` (a bigger test network: an n by n grid of stations called `\"r-c\"`, with a line along every row and every column), and `isRoute`, which checks that a list of stations is a real route (each station next to the following one on some line).",
  ),
  notes: md(
    "**Where the marks are.** 28 marks. Part I (9) is utilities you will reuse everywhere. Part II (8) is graph search. Part III (7) is about changes of line. Part IV (4) uses the timetable and is independent of Parts II and III.",
    "",
    "**Order of attack.** Do all of Part I first: `neighbours` is used by `reachable` and `route`, and `linesAt` by `reachWithin`. `nextDeparture` is only needed by Part IV, so if time is short you can do Part IV straight after Part I.",
    "",
    "**Traps.**",
    "",
    "- `neighbours` must be sorted with no duplicates (two lines can join the same pair of stations).",
    "- Graph searches loop forever unless you keep a list of stations already **seen** and never visit one twice.",
    "- In `route`, add new routes to the **back** of the queue (`queue ++ new`), or you get depth-first search and long routes.",
    "- In BFS, mark a station as seen when you first add it to the queue, not when you take it off, or the queue can blow up on big networks like `gridNet 8`.",
    "- `route net s s` is `Just [s]`, and `minChanges net s s` is `Just 0`.",
    "- In `minChanges`, searching `[0 ..]` for the first `k` that works never stops if the station is unreachable: check reachability first.",
    "",
    "**Short of time?** `minChanges` (3 marks) is short once `reachWithin` works. Part IV is a nice self-contained 4 marks.",
  ),
  setup: hs`import Data.List

type Station = String

type Line = String

type Network = [(Line, [Station])]

type Time = Int

type Timetable = [((Line, Station), [Time])]

type Leg = (Line, Station, Station)

-- Finds the value paired with a key; the key must be present
lookUp :: Eq a => a -> [(a, b)] -> b
lookUp k table = head [v | (k', v) <- table, k' == k]

minsPerStop :: Int
minsPerStop = 2

showTime :: Time -> String
showTime t = two (div t 60) ++ ":" ++ two (mod t 60)
  where
    two n = (if n < 10 then "0" else "") ++ show n

-- True if each station is next to the following one on some line
isRoute :: Network -> [Station] -> Bool
isRoute net sts = and [next p q | (p, q) <- zip sts (drop 1 sts)]
  where
    next p q = or [elem (p, q) ps || elem (q, p) ps
                  | (_, line) <- net, let ps = zip line (drop 1 line)]

--------------------------------------------------------------
-- Examples

metro :: Network
metro
  = [("Red", ["Airport", "Docks", "Central", "Market", "Zoo"]),
     ("Blue", ["Harbour", "Docks", "Museum", "Park"]),
     ("Green", ["Museum", "Central", "Uni", "Hill"]),
     ("Yellow", ["Zoo", "Hill", "Lake"]),
     ("Shuttle", ["Island", "Pier"])]

timetable :: Timetable
timetable
  = [(("Red", "Airport"), [360, 380, 400, 420]),
     (("Red", "Docks"), [362, 382, 402, 422]),
     (("Red", "Central"), [364, 384, 404, 424]),
     (("Red", "Zoo"), [370, 390, 410]),
     (("Blue", "Docks"), [370, 400, 430]),
     (("Blue", "Harbour"), [365, 395, 425]),
     (("Green", "Central"), [375, 395, 415]),
     (("Green", "Museum"), [373, 393, 413]),
     (("Yellow", "Hill"), [390, 420, 450]),
     (("Yellow", "Zoo"), [385, 415]),
     (("Shuttle", "Island"), [400, 460])]

-- An n by n grid: stations "r-c", a line along each row and column
gridNet :: Int -> Network
gridNet n
  = [("row" ++ show r, [name r c | c <- [0 .. n - 1]]) | r <- [0 .. n - 1]] ++
    [("col" ++ show c, [name r c | r <- [0 .. n - 1]]) | c <- [0 .. n - 1]]
  where
    name r c = show r ++ "-" ++ show c
`,
  starter: hs`--------------------------------------------------------------
-- Part I

stations :: Network -> [Station]
stations = undefined

linesAt :: Network -> Station -> [Line]
linesAt = undefined

neighbours :: Network -> Station -> [Station]
neighbours = undefined

nextDeparture :: Timetable -> Line -> Station -> Time -> Maybe Time
nextDeparture = undefined

--------------------------------------------------------------
-- Part II

reachable :: Network -> Station -> [Station]
reachable = undefined

route :: Network -> Station -> Station -> Maybe [Station]
route = undefined

--------------------------------------------------------------
-- Part III

reachWithin :: Network -> Int -> Station -> [Station]
reachWithin = undefined

minChanges :: Network -> Station -> Station -> Maybe Int
minChanges = undefined

--------------------------------------------------------------
-- Part IV

arrive :: Network -> Timetable -> Time -> [Leg] -> Maybe Time
arrive = undefined
`,
  tasks: [
    {
      id: "stations",
      name: "stations",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `stations :: Network -> [Station]` that returns every station in a network, sorted, with no duplicates. For example:",
        "",
        "```",
        "ghci> stations metro",
        "[\"Airport\",\"Central\",\"Docks\",\"Harbour\",\"Hill\",\"Island\",\"Lake\",\"Market\",",
        " \"Museum\",\"Park\",\"Pier\",\"Uni\",\"Zoo\"]",
        "ghci> stations [(\"X\", [\"b\",\"a\"]), (\"Y\", [\"a\",\"c\"])]",
        "[\"a\",\"b\",\"c\"]",
        "```",
      ),
      hints: [
        "Collect the stations of every line into one list, then remove duplicates and sort.",
        "A comprehension with two generators flattens it: `[st | (_, sts) <- net, st <- sts]`. Or use `concatMap snd net`.",
        "Finish with `sort (nub ...)`.",
        "`stations net = sort (nub [st | (_, sts) <- net, st <- sts])`.",
      ],
      solution: hs`stations :: Network -> [Station]
stations net = sort (nub [st | (_, sts) <- net, st <- sts])`,
      tests: [
        {
          expr: "stations metro",
          expected: '["Airport","Central","Docks","Harbour","Hill","Island","Lake","Market","Museum","Park","Pier","Uni","Zoo"]',
        },
        { expr: 'stations [("X", ["b","a"]), ("Y", ["a","c"])]', expected: '["a","b","c"]' },
        { expr: "stations []", expected: "[]" },
        { expr: 'stations [("X", ["only"])]', expected: '["only"]' },
        { expr: "length (stations (gridNet 5))", expected: "25" },
        { expr: "take 3 (stations (gridNet 3))", expected: '["0-0","0-1","0-2"]' },
      ],
    },
    {
      id: "linesAt",
      name: "linesAt",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `linesAt :: Network -> Station -> [Line]` that returns the lines that stop at a station, in the order they appear in the network. For example:",
        "",
        "```",
        "ghci> linesAt metro \"Docks\"",
        "[\"Red\",\"Blue\"]",
        "ghci> linesAt metro \"Lake\"",
        "[\"Yellow\"]",
        "ghci> linesAt metro \"Nowhere\"",
        "[]",
        "```",
      ),
      hints: [
        "Go through the `(line, stations)` pairs and keep the lines whose station list contains the station.",
        "`elem st sts` tests whether a station is on a line.",
        "A list comprehension with a guard keeps the network order for free.",
        "`linesAt net st = [l | (l, sts) <- net, elem st sts]`.",
      ],
      solution: hs`linesAt :: Network -> Station -> [Line]
linesAt net st = [l | (l, sts) <- net, elem st sts]`,
      tests: [
        { expr: 'linesAt metro "Docks"', expected: '["Red","Blue"]' },
        { expr: 'linesAt metro "Lake"', expected: '["Yellow"]' },
        { expr: 'linesAt metro "Nowhere"', expected: "[]" },
        { expr: 'linesAt metro "Central"', expected: '["Red","Green"]' },
        { expr: 'linesAt metro "Hill"', expected: '["Green","Yellow"]' },
        { expr: 'linesAt (gridNet 3) "1-2"', expected: '["row1","col2"]' },
      ],
    },
    {
      id: "neighbours",
      name: "neighbours",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define a function `neighbours :: Network -> Station -> [Station]` that returns every station directly next to the given one on some line (one stop away, in either direction), sorted, with no duplicates. For example:",
        "",
        "```",
        "ghci> neighbours metro \"Central\"",
        "[\"Docks\",\"Market\",\"Museum\",\"Uni\"]",
        "ghci> neighbours metro \"Airport\"",
        "[\"Docks\"]",
        "ghci> neighbours metro \"Pier\"",
        "[\"Island\"]",
        "ghci> neighbours [(\"A\",[\"x\",\"y\"]),(\"B\",[\"y\",\"x\",\"z\"])] \"x\"",
        "[\"y\",\"z\"]",
        "```",
      ),
      hints: [
        "`zip sts (tail sts)` turns a line into the list of its consecutive pairs: `zip [\"a\",\"b\",\"c\"] [\"b\",\"c\"]` is `[(\"a\",\"b\"),(\"b\",\"c\")]`.",
        "Look at every pair `(p, q)` of every line. If `p` is the station, `q` is a neighbour; if `q` is the station, `p` is a neighbour.",
        "Collect both directions, then `sort (nub ...)`. Two comprehensions joined with `++` work well.",
        md(
          "```",
          "neighbours net st = sort (nub ([q | (p, q) <- pairs, p == st] ++ [p | (p, q) <- pairs, q == st]))",
          "  where",
          "    pairs = [pq | (_, sts) <- net, pq <- zip sts (drop 1 sts)]",
          "```",
        ),
      ],
      solution: hs`neighbours :: Network -> Station -> [Station]
neighbours net st = sort (nub ([q | (p, q) <- pairs, p == st] ++ [p | (p, q) <- pairs, q == st]))
  where
    pairs = [pq | (_, sts) <- net, pq <- zip sts (drop 1 sts)]`,
      tests: [
        { expr: 'neighbours metro "Central"', expected: '["Docks","Market","Museum","Uni"]' },
        { expr: 'neighbours metro "Airport"', expected: '["Docks"]' },
        { expr: 'neighbours metro "Pier"', expected: '["Island"]' },
        { expr: 'neighbours [("A",["x","y"]),("B",["y","x","z"])] "x"', expected: '["y","z"]', label: "no duplicates when two lines share a stretch" },
        { expr: 'neighbours metro "Docks"', expected: '["Airport","Central","Harbour","Museum"]' },
        { expr: 'neighbours metro "Nowhere"', expected: "[]" },
        { expr: 'neighbours (gridNet 3) "1-1"', expected: '["0-1","1-0","1-2","2-1"]' },
        { expr: 'neighbours (gridNet 3) "0-0"', expected: '["0-1","1-0"]' },
      ],
    },
    {
      id: "nextDeparture",
      name: "nextDeparture",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `nextDeparture :: Timetable -> Line -> Station -> Time -> Maybe Time` that returns the first departure of the given line from the given station at or after the given time. It returns `Nothing` if there is no such departure, including when the timetable has no entry for that line and station. For example:",
        "",
        "```",
        "ghci> nextDeparture timetable \"Red\" \"Airport\" 365",
        "Just 380",
        "ghci> nextDeparture timetable \"Red\" \"Airport\" 380",
        "Just 380",
        "ghci> nextDeparture timetable \"Red\" \"Airport\" 421",
        "Nothing",
        "ghci> nextDeparture timetable \"Red\" \"Market\" 0",
        "Nothing",
        "```",
        "",
        "Remember the departure times in each entry are in increasing order.",
      ),
      hints: [
        "Collect every departure time `d` for this line and station with `d >= t`, in a list comprehension over the timetable.",
        "The pattern `((l', st'), ds) <- tt` takes each entry apart; then `d <- ds` goes through its times.",
        "The answer is the first element of that list, if there is one: use `case` with `[]` and `(d : _)`.",
        md(
          "```",
          "nextDeparture tt l st t",
          "  = case [d | ((l', st'), ds) <- tt, l' == l, st' == st, d <- ds, d >= t] of",
          "      [] -> Nothing",
          "      (d : _) -> Just d",
          "```",
        ),
      ],
      solution: hs`nextDeparture :: Timetable -> Line -> Station -> Time -> Maybe Time
nextDeparture tt l st t
  = case [d | ((l', st'), ds) <- tt, l' == l, st' == st, d <- ds, d >= t] of
      [] -> Nothing
      (d : _) -> Just d`,
      tests: [
        { expr: 'nextDeparture timetable "Red" "Airport" 365', expected: "Just 380" },
        { expr: 'nextDeparture timetable "Red" "Airport" 380', expected: "Just 380", label: "a train leaving right now counts" },
        { expr: 'nextDeparture timetable "Red" "Airport" 421', expected: "Nothing" },
        { expr: 'nextDeparture timetable "Red" "Market" 0', expected: "Nothing", label: "no entry for this line and station" },
        { expr: 'nextDeparture timetable "Green" "Central" 0', expected: "Just 375" },
        { expr: 'nextDeparture timetable "Blue" "Docks" 401', expected: "Just 430" },
        { expr: 'nextDeparture timetable "Yellow" "Central" 390', expected: "Nothing", label: "Yellow doesn't stop at Central" },
        { expr: 'nextDeparture [(("L","s"),[10,20]),(("L","t"),[15])] "L" "t" 11', expected: "Just 15" },
      ],
    },
    {
      id: "reachable",
      name: "reachable",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Using `neighbours`, define a function `reachable :: Network -> Station -> [Station]` that returns every station you can get to from the given station by train (any number of stops and changes), including the station itself, sorted. For example:",
        "",
        "```",
        "ghci> reachable metro \"Pier\"",
        "[\"Island\",\"Pier\"]",
        "ghci> reachable metro \"Airport\"",
        "[\"Airport\",\"Central\",\"Docks\",\"Harbour\",\"Hill\",\"Lake\",\"Market\",\"Museum\",",
        " \"Park\",\"Uni\",\"Zoo\"]",
        "```",
        "",
        "Networks can contain cycles (Docks, Central and Museum form a triangle in `metro`), so your function must not visit the same station twice.",
      ),
      hints: [
        "Keep two lists: stations still **to visit**, and stations already **seen**. Start with `[s]` to visit and nothing seen.",
        "Take the first station to visit. If it's already seen, skip it. Otherwise add it to the seen list and add its neighbours to the to-visit list.",
        "When there is nothing left to visit, the seen list is the answer (sort it).",
        md(
          "```",
          "reachable net s = sort (go [s] [])",
          "  where",
          "    go [] seen = seen",
          "    go (x : xs) seen",
          "      | elem x seen = go xs seen",
          "      | otherwise   = go (xs ++ neighbours net x) (x : seen)",
          "```",
        ),
      ],
      solution: hs`reachable :: Network -> Station -> [Station]
reachable net s = sort (go [s] [])
  where
    go [] seen = seen
    go (x : xs) seen
      | elem x seen = go xs seen
      | otherwise   = go (xs ++ neighbours net x) (x : seen)`,
      tests: [
        { expr: 'reachable metro "Pier"', expected: '["Island","Pier"]' },
        {
          expr: 'reachable metro "Airport"',
          expected: '["Airport","Central","Docks","Harbour","Hill","Lake","Market","Museum","Park","Uni","Zoo"]',
        },
        { expr: 'reachable metro "Lake"', expected: 'reachable metro "Airport"' },
        { expr: 'reachable [("A",["x","y"]),("B",["z","w"])] "w"', expected: '["w","z"]' },
        { expr: 'reachable [("A",["p","q","r"]),("B",["r","p"])] "q"', expected: '["p","q","r"]', label: "a cycle" },
        { expr: 'length (reachable (gridNet 6) "3-3")', expected: "36" },
        { expr: 'reachable metro "Nowhere"', expected: '["Nowhere"]', label: "a station on no line can only reach itself" },
      ],
    },
    {
      id: "route",
      name: "route",
      part: "Part II",
      marks: 5,
      prompt: md(
        "Using `neighbours`, define a function `route :: Network -> Station -> Station -> Maybe [Station]` that returns a route from the first station to the second with the **fewest stops**, as the list of stations passed through including both ends. It returns `Nothing` if there is no route. If there are several shortest routes, any one of them may be returned. For example:",
        "",
        "```",
        "ghci> route metro \"Airport\" \"Lake\"",
        "Just [\"Airport\",\"Docks\",\"Central\",\"Uni\",\"Hill\",\"Lake\"]",
        "ghci> route metro \"Park\" \"Docks\"",
        "Just [\"Park\",\"Museum\",\"Docks\"]",
        "ghci> route metro \"Zoo\" \"Zoo\"",
        "Just [\"Zoo\"]",
        "ghci> route metro \"Airport\" \"Pier\"",
        "Nothing",
        "```",
        "",
        "Use breadth-first search: keep a queue of partial routes, starting with the route `[s]`. Repeatedly take the route at the front of the queue. If it ends at the destination, that's the answer. Otherwise extend it by each neighbour of its last station that has not been seen before, mark those neighbours as seen, and add the new routes to the **back** of the queue. If the queue runs out, there is no route. Your function should be fast enough for `gridNet 8`.",
      ),
      hints: [
        "It's easiest to store each partial route **backwards**, newest station first: then the last station is the head, extending is `n : p`, and you `reverse` the answer at the end.",
        "Write a helper `bfs :: [[Station]] -> [Station] -> Maybe [Station]` taking the queue and the seen list. Start with `bfs [[s]] [s]`.",
        "For the route `p@(x : _)` at the front: if `x == t` return `Just (reverse p)`. Otherwise let `new = [n | n <- neighbours net x, notElem n seen]` and call `bfs (rest ++ [n : p | n <- new]) (seen ++ new)`.",
        md(
          "```",
          "route net s t = bfs [[s]] [s]",
          "  where",
          "    bfs [] _ = Nothing",
          "    bfs (p@(x : _) : rest) seen",
          "      | x == t    = Just (reverse p)",
          "      | otherwise = bfs (rest ++ [n : p | n <- new]) (seen ++ new)",
          "      where",
          "        new = [n | n <- neighbours net x, notElem n seen]",
          "```",
        ),
      ],
      solution: hs`route :: Network -> Station -> Station -> Maybe [Station]
route net s t = bfs [[s]] [s]
  where
    -- Each route in the queue is stored backwards: newest station first
    bfs [] _ = Nothing
    bfs (p@(x : _) : rest) seen
      | x == t    = Just (reverse p)
      | otherwise = bfs (rest ++ [n : p | n <- new]) (seen ++ new)
      where
        new = [n | n <- neighbours net x, notElem n seen]`,
      tests: [
        { expr: 'route metro "Airport" "Lake"', expected: 'Just ["Airport","Docks","Central","Uni","Hill","Lake"]' },
        { expr: 'route metro "Park" "Docks"', expected: 'Just ["Park","Museum","Docks"]' },
        { expr: 'route metro "Zoo" "Zoo"', expected: 'Just ["Zoo"]' },
        { expr: 'route metro "Airport" "Pier"', expected: "Nothing" },
        { expr: 'route metro "Island" "Pier"', expected: 'Just ["Island","Pier"]' },
        {
          expr: 'fmap (\\r -> (length r, head r, last r, isRoute metro r)) (route metro "Harbour" "Lake")',
          expected: 'Just (6,"Harbour","Lake",True)',
          label: "Harbour to Lake: a real route with 5 stops (several are possible)",
        },
        {
          expr: 'fmap (\\r -> (length r, head r, last r, isRoute (gridNet 8) r)) (route (gridNet 8) "0-0" "7-7")',
          expected: 'Just (15,"0-0","7-7",True)',
          label: "corner to corner of gridNet 8: 14 stops",
        },
        {
          expr: 'fmap length (route (gridNet 8) "3-4" "3-0")',
          expected: "Just 5",
        },
        { expr: 'route [("A",["x","y"]),("B",["z","w"])] "x" "w"', expected: "Nothing" },
      ],
    },
    {
      id: "reachWithin",
      name: "reachWithin",
      part: "Part III",
      marks: 4,
      prompt: md(
        "Using `linesAt`, define a function `reachWithin :: Network -> Int -> Station -> [Station]` that returns every station you can reach from the given one with **at most k changes** of line, sorted, with no duplicates. With 0 changes you can reach every station on any line that stops at the starting station. With k + 1 changes you can reach every station on any line that stops at a station reachable with k changes. For example:",
        "",
        "```",
        "ghci> reachWithin metro 0 \"Lake\"",
        "[\"Hill\",\"Lake\",\"Zoo\"]",
        "ghci> reachWithin metro 0 \"Docks\"",
        "[\"Airport\",\"Central\",\"Docks\",\"Harbour\",\"Market\",\"Museum\",\"Park\",\"Zoo\"]",
        "ghci> reachWithin metro 1 \"Lake\"",
        "[\"Airport\",\"Central\",\"Docks\",\"Hill\",\"Lake\",\"Market\",\"Museum\",\"Uni\",\"Zoo\"]",
        "```",
        "",
        "You may assume k is at least 0 and the station is on at least one line.",
      ),
      hints: [
        "Write a helper `step :: [Station] -> [Station]` that returns every station on any line through any of the given stations, sorted, with no duplicates.",
        "`linesAt net st` gives the lines at one station, and `lookUp l net` gives the stations on line `l`. A comprehension with three generators combines them: `[st' | st <- sts, l <- linesAt net st, st' <- lookUp l net]`.",
        "The answer with 0 changes is `step [s]`. Each extra change applies `step` once more, so recurse on k (or use `iterate step [s] !! (k + 1)`).",
        md(
          "```",
          "reachWithin net k s = go k (step [s])",
          "  where",
          "    step sts = sort (nub [st' | st <- sts, l <- linesAt net st, st' <- lookUp l net])",
          "    go 0 sts = sts",
          "    go n sts = go (n - 1) (step sts)",
          "```",
        ),
      ],
      solution: hs`reachWithin :: Network -> Int -> Station -> [Station]
reachWithin net k s = go k (step [s])
  where
    step sts = sort (nub [st' | st <- sts, l <- linesAt net st, st' <- lookUp l net])
    go 0 sts = sts
    go n sts = go (n - 1) (step sts)`,
      tests: [
        { expr: 'reachWithin metro 0 "Lake"', expected: '["Hill","Lake","Zoo"]' },
        { expr: 'reachWithin metro 0 "Docks"', expected: '["Airport","Central","Docks","Harbour","Market","Museum","Park","Zoo"]' },
        { expr: 'reachWithin metro 1 "Lake"', expected: '["Airport","Central","Docks","Hill","Lake","Market","Museum","Uni","Zoo"]' },
        { expr: 'reachWithin metro 2 "Lake"', expected: 'reachable metro "Lake"' },
        { expr: 'reachWithin metro 5 "Island"', expected: '["Island","Pier"]' },
        { expr: 'reachWithin (gridNet 4) 0 "1-2"', expected: '["0-2","1-0","1-1","1-2","1-3","2-2","3-2"]' },
        { expr: 'length (reachWithin (gridNet 4) 1 "1-2")', expected: "16" },
        { expr: 'reachWithin [("A",["p","q"]),("B",["q","r"]),("C",["r","s"])] 1 "p"', expected: '["p","q","r"]' },
      ],
    },
    {
      id: "minChanges",
      name: "minChanges",
      part: "Part III",
      marks: 3,
      prompt: md(
        "Using `reachable` and `reachWithin`, define a function `minChanges :: Network -> Station -> Station -> Maybe Int` that returns the smallest number of changes needed to get from the first station to the second, or `Nothing` if the second can't be reached at all. For example:",
        "",
        "```",
        "ghci> minChanges metro \"Airport\" \"Market\"",
        "Just 0",
        "ghci> minChanges metro \"Airport\" \"Lake\"",
        "Just 1",
        "ghci> minChanges metro \"Harbour\" \"Lake\"",
        "Just 2",
        "ghci> minChanges metro \"Airport\" \"Pier\"",
        "Nothing",
        "```",
        "",
        "Note that the route with fewest changes is not always the one with fewest stops: Airport to Lake by fewest stops (via Uni) takes 2 changes, but going round by Zoo takes only 1. You may assume the first station is on at least one line.",
      ),
      hints: [
        "The answer is the smallest k with the destination in `reachWithin net k s`.",
        "Search the infinite list `[0 ..]`: `head [k | k <- [0 ..], elem t (reachWithin net k s)]`. Laziness means it stops at the first one.",
        "That search would run forever if the destination is unreachable, so check `elem t (reachable net s)` first and return `Nothing` if it fails.",
        md(
          "```",
          "minChanges net s t",
          "  | notElem t (reachable net s) = Nothing",
          "  | otherwise = Just (head [k | k <- [0 ..], elem t (reachWithin net k s)])",
          "```",
        ),
      ],
      solution: hs`minChanges :: Network -> Station -> Station -> Maybe Int
minChanges net s t
  | notElem t (reachable net s) = Nothing
  | otherwise = Just (head [k | k <- [0 ..], elem t (reachWithin net k s)])`,
      tests: [
        { expr: 'minChanges metro "Airport" "Market"', expected: "Just 0" },
        { expr: 'minChanges metro "Airport" "Lake"', expected: "Just 1" },
        { expr: 'minChanges metro "Harbour" "Lake"', expected: "Just 2" },
        { expr: 'minChanges metro "Airport" "Pier"', expected: "Nothing" },
        { expr: 'minChanges metro "Uni" "Uni"', expected: "Just 0" },
        { expr: 'minChanges metro "Park" "Uni"', expected: "Just 1" },
        { expr: 'minChanges (gridNet 6) "0-0" "5-5"', expected: "Just 1" },
        { expr: 'minChanges (gridNet 6) "2-0" "2-5"', expected: "Just 0" },
        { expr: 'minChanges [("A",["p","q"]),("B",["q","r"]),("C",["r","s"]),("D",["s","t"])] "p" "t"', expected: "Just 3" },
      ],
    },
    {
      id: "arrive",
      name: "arrive",
      part: "Part IV",
      marks: 4,
      prompt: md(
        "A journey is a list of legs. Using `nextDeparture`, define a function `arrive :: Network -> Timetable -> Time -> [Leg] -> Maybe Time` that returns the time you arrive at the end of a journey, if you are at the start of the first leg at the given time. For each leg `(line, from, to)`:",
        "",
        "- catch the next train on `line` leaving `from` at or after the current time;",
        "- the ride takes `minsPerStop` minutes for each stop between `from` and `to` along the line (count the positions of the two stations in the line's list);",
        "- you arrive at `to` and start the next leg from there, at that time.",
        "",
        "If any leg has no train to catch, the answer is `Nothing`. A journey with no legs arrives immediately. You may assume both stations of every leg are on that leg's line, and each leg starts where the previous one ended. For example:",
        "",
        "```",
        "ghci> arrive metro timetable 365 [(\"Red\",\"Airport\",\"Central\")]",
        "Just 384",
        "ghci> arrive metro timetable 365 [(\"Red\",\"Airport\",\"Central\"),(\"Green\",\"Central\",\"Hill\"),",
        "                                  (\"Yellow\",\"Hill\",\"Lake\")]",
        "Just 422",
        "ghci> fmap showTime it",
        "Just \"07:02\"",
        "ghci> arrive metro timetable 401 [(\"Red\",\"Airport\",\"Central\"),(\"Green\",\"Central\",\"Hill\")]",
        "Nothing",
        "ghci> arrive metro timetable 500 []",
        "Just 500",
        "```",
        "",
        "In the second example: the 380 Red train reaches Central (2 stops) at 384; the next Green train from Central is at 395 and reaches Hill (2 stops) at 399; the next Yellow train from Hill is at 420 and reaches Lake (1 stop) at 422. In the third, the 420 Red train reaches Central at 424, after the last Green train (415).",
      ),
      hints: [
        "Recursion on the list of legs. `arrive _ _ t [] = Just t`.",
        "For a leg `(l, from, to)`: `case nextDeparture tt l from t of` gives `Nothing` (stop: answer `Nothing`) or `Just d` (carry on).",
        "The number of stops is the difference of the two positions on the line: with `sts = lookUp l net`, the position of a station is `length (takeWhile (/= st) sts)`. Use `abs` because you may travel either way.",
        md(
          "```",
          "arrive _ _ t [] = Just t",
          "arrive net tt t ((l, from, to) : legs)",
          "  = case nextDeparture tt l from t of",
          "      Nothing -> Nothing",
          "      Just d -> arrive net tt (d + minsPerStop * abs (pos to - pos from)) legs",
          "  where",
          "    sts = lookUp l net",
          "    pos st = length (takeWhile (/= st) sts)",
          "```",
        ),
      ],
      solution: hs`arrive :: Network -> Timetable -> Time -> [Leg] -> Maybe Time
arrive _ _ t [] = Just t
arrive net tt t ((l, from, to) : legs)
  = case nextDeparture tt l from t of
      Nothing -> Nothing
      Just d -> arrive net tt (d + minsPerStop * abs (pos to - pos from)) legs
  where
    sts = lookUp l net
    pos st = length (takeWhile (/= st) sts)`,
      tests: [
        { expr: 'arrive metro timetable 365 [("Red","Airport","Central")]', expected: "Just 384" },
        {
          expr: 'arrive metro timetable 365 [("Red","Airport","Central"),("Green","Central","Hill"),("Yellow","Hill","Lake")]',
          expected: "Just 422",
        },
        { expr: 'arrive metro timetable 401 [("Red","Airport","Central"),("Green","Central","Hill")]', expected: "Nothing" },
        { expr: "arrive metro timetable 500 []", expected: "Just 500" },
        { expr: 'arrive metro timetable 380 [("Red","Airport","Zoo")]', expected: "Just 388", label: "catching a train leaving right now" },
        { expr: 'arrive metro timetable 0 [("Red","Zoo","Airport")]', expected: "Just 378", label: "travelling backwards along the line" },
        { expr: 'arrive metro timetable 0 [("Yellow","Zoo","Lake"),("Yellow","Lake","Zoo")]', expected: "Nothing", label: "no Yellow departures are listed at Lake" },
        { expr: 'arrive metro timetable 360 [("Blue","Harbour","Museum"),("Green","Museum","Uni")]', expected: "Just 377" },
        { expr: 'arrive metro timetable 365 [("Red","Airport","Docks"),("Red","Docks","Central")]', expected: "Just 384" },
        { expr: 'arrive metro timetable 450 [("Shuttle","Island","Pier")]', expected: "Just 462" },
      ],
    },
  ],
};
