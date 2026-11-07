import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "m02",
  year: 0,
  difficulty: 2,
  minutes: 30,
  title: "Mini paper 2: Football league table",
  summary:
    "Turn a list of match results into a league table: points per match, looking up a team's points with a default, goal difference, and the full table.",
  skills: [
    "4-tuples and pattern matching",
    "guards",
    "lookup tables (lists of pairs)",
    "lookup with a default (Maybe and fromMaybe)",
    "sum over a list comprehension",
    "nub to remove duplicates",
  ],
  story: md(
    "This paper is about a football league. You only need to know how the points are scored, and it's explained right here.",
    "",
    "**Matches.** Each match is played between a **home** team and an **away** team, and each team scores some number of goals. We write a result like this:",
    "",
    "```",
    "Lions 2 - 1 Tigers",
    "```",
    "",
    "meaning Lions (at home) scored 2 and Tigers (away) scored 1.",
    "",
    "**Points.** After every match each team gets points:",
    "",
    "- **3** points for a win (scoring more goals than the other team);",
    "- **1** point for a draw (both teams scoring the same);",
    "- **0** points for a loss.",
    "",
    "So for `Lions 2 - 1 Tigers`, Lions get 3 and Tigers get 0. For `Bears 0 - 0 Wolves`, both get 1.",
    "",
    "**Goal difference.** A team's goal difference is the total number of goals it has scored, minus the total number it has conceded (let in), over all its matches. It can be negative.",
    "",
    "**The league table** lists each team with its total points. Here are the six example results and the table they give:",
    "",
    "```",
    "Lions  2 - 1 Tigers          team    points",
    "Bears  0 - 0 Wolves          Lions      4",
    "Tigers 3 - 1 Bears           Tigers     6",
    "Wolves 1 - 1 Lions           Bears      4",
    "Lions  0 - 2 Bears           Wolves     2",
    "Tigers 2 - 0 Wolves",
    "```",
    "",
    "### The given types",
    "",
    "```haskell",
    "type Team   = String",
    "type Result = (Team, Int, Team, Int)",
    "type Table  = [(Team, Int)]",
    "```",
    "",
    "- A `Result` is a 4-tuple: home team, home goals, away team, away goals. `Lions 2 - 1 Tigers` is `(\"Lions\", 2, \"Tigers\", 1)`. You pull it apart with a pattern like `(h, hg, a, ag)`.",
    "- A `Table` is a **lookup table**: a list of pairs, each linking a key (a team) to a value (its points), such as `[(\"Lions\",4),(\"Tigers\",6)]`. Each team appears at most once. The Prelude function `lookup :: Eq a => a -> [(a, b)] -> Maybe b` searches one: it gives `Just v` if the key is there and `Nothing` if not.",
    "",
    "You are given the example data `results :: [Result]` (the six matches above) and `table :: Table` (the league table above). `fromMaybe` from `Data.Maybe` and `nub` from `Data.List` are imported for you.",
  ),
  notes: md(
    "**Where the marks are (10 total).** `matchPoints` and `pointsFor` are 2 marks each, `goalDifference` and `leagueTable` are 3 each.",
    "",
    "**Order of attack.** Do them in order. `leagueTable` is much easier if you reuse `matchPoints`.",
    "",
    "**Strategy.**",
    "",
    "- Work out one example by hand before writing code. For `goalDifference`, a team can appear as the home team in some matches and the away team in others; handle both.",
    "- `sum [ ... | ... ]` is a great pattern: build the list of numbers you need, then add them up.",
    "- When the question says *order doesn't matter*, the tests sort your answer first, so any order is fine.",
    "",
    "**Traps.**",
    "",
    "- `pointsFor` must not crash for a team that isn't in the table: return 0. Plain `lookup` gives a `Maybe`, so you need to deal with `Nothing`.",
    "- In `leagueTable`, every team must appear exactly once, including teams with 0 points. Collect the team names first (and remove duplicates with `nub`), then total each one.",
  ),
  setup: hs`import Data.List
import Data.Maybe

type Team = String

type Result = (Team, Int, Team, Int)

type Table = [(Team, Int)]

--------------------------------------------------------------
-- Example data

results :: [Result]
results
  = [("Lions",  2, "Tigers", 1),
     ("Bears",  0, "Wolves", 0),
     ("Tigers", 3, "Bears",  1),
     ("Wolves", 1, "Lions",  1),
     ("Lions",  0, "Bears",  2),
     ("Tigers", 2, "Wolves", 0)]

table :: Table
table
  = [("Lions", 4), ("Tigers", 6), ("Bears", 4), ("Wolves", 2)]
`,
  starter: hs`--------------------------------------------------------------
-- Part I

matchPoints :: Result -> [(Team, Int)]
matchPoints = undefined

pointsFor :: Team -> Table -> Int
pointsFor = undefined

goalDifference :: Team -> [Result] -> Int
goalDifference = undefined

leagueTable :: [Result] -> Table
leagueTable = undefined
`,
  tasks: [
    {
      id: "matchPoints",
      name: "matchPoints",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `matchPoints :: Result -> [(Team, Int)]` that returns the points each team earned in one match, as a two-element list: the home team first, then the away team. A win is 3 points, a draw 1, a loss 0. For example:",
        "",
        "```",
        "ghci> matchPoints (\"Lions\", 2, \"Tigers\", 1)",
        "[(\"Lions\",3),(\"Tigers\",0)]",
        "ghci> matchPoints (\"Bears\", 0, \"Wolves\", 0)",
        "[(\"Bears\",1),(\"Wolves\",1)]",
        "ghci> matchPoints (\"Lions\", 0, \"Bears\", 2)",
        "[(\"Lions\",0),(\"Bears\",3)]",
        "```",
      ),
      hints: [
        "Pattern match the result as `(h, hg, a, ag)`: home team, home goals, away team, away goals.",
        "There are three situations: the home team won (`hg > ag`), it was a draw (`hg == ag`), or the away team won.",
        "Use guards, one per situation, each returning a two-element list.",
        md(
          "```",
          "matchPoints (h, hg, a, ag)",
          "  | hg > ag   = [(h, 3), (a, 0)]",
          "  | hg == ag  = [(h, 1), (a, 1)]",
          "  | otherwise = [(h, 0), (a, 3)]",
          "```",
        ),
      ],
      solution: hs`matchPoints :: Result -> [(Team, Int)]
matchPoints (h, hg, a, ag)
  | hg > ag = [(h, 3), (a, 0)]
  | hg == ag = [(h, 1), (a, 1)]
  | otherwise = [(h, 0), (a, 3)]`,
      tests: [
        { expr: 'matchPoints ("Lions", 2, "Tigers", 1)', expected: '[("Lions",3),("Tigers",0)]' },
        { expr: 'matchPoints ("Bears", 0, "Wolves", 0)', expected: '[("Bears",1),("Wolves",1)]' },
        { expr: 'matchPoints ("Lions", 0, "Bears", 2)', expected: '[("Lions",0),("Bears",3)]' },
        { expr: 'matchPoints ("A", 5, "B", 5)', expected: '[("A",1),("B",1)]' },
        { expr: 'matchPoints ("A", 1, "B", 0)', expected: '[("A",3),("B",0)]' },
        { expr: "map matchPoints results !! 5", expected: '[("Tigers",3),("Wolves",0)]' },
        { expr: "sum [p | r <- results, (_, p) <- matchPoints r]", expected: "16" },
      ],
    },
    {
      id: "pointsFor",
      name: "pointsFor",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `pointsFor :: Team -> Table -> Int` that looks up a team's points in a league table. A team that isn't in the table has 0 points. For example:",
        "",
        "```",
        "ghci> pointsFor \"Tigers\" table",
        "6",
        "ghci> pointsFor \"Wolves\" table",
        "2",
        "ghci> pointsFor \"Owls\" table",
        "0",
        "```",
      ),
      hints: [
        "`lookup team t` returns `Just points` if the team is in the table, and `Nothing` if it isn't.",
        "You need to turn that `Maybe Int` into an `Int`, using 0 for `Nothing`.",
        "Either use a `case` expression on the result of `lookup`, or use `fromMaybe :: a -> Maybe a -> a`: `fromMaybe 0 (Just 6)` is 6 and `fromMaybe 0 Nothing` is 0.",
        "`pointsFor team t = fromMaybe 0 (lookup team t)`.",
      ],
      solution: hs`pointsFor :: Team -> Table -> Int
pointsFor team t = fromMaybe 0 (lookup team t)`,
      tests: [
        { expr: 'pointsFor "Tigers" table', expected: "6" },
        { expr: 'pointsFor "Wolves" table', expected: "2" },
        { expr: 'pointsFor "Owls" table', expected: "0" },
        { expr: 'pointsFor "Lions" table', expected: "4" },
        { expr: 'pointsFor "Lions" []', expected: "0" },
        { expr: 'pointsFor "B" [("A",9),("B",0),("C",7)]', expected: "0" },
        { expr: 'pointsFor "C" [("A",9),("B",0),("C",7)]', expected: "7" },
      ],
    },
    {
      id: "goalDifference",
      name: "goalDifference",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define a function `goalDifference :: Team -> [Result] -> Int` that returns the team's goal difference over all the results: the total goals it scored minus the total goals it conceded. Remember that a team can play at home in some matches and away in others. A team that played no matches has goal difference 0. For example:",
        "",
        "```",
        "ghci> goalDifference \"Tigers\" results",
        "3",
        "ghci> goalDifference \"Lions\" results",
        "-1",
        "ghci> goalDifference \"Bears\" results",
        "0",
        "ghci> goalDifference \"Owls\" results",
        "0",
        "```",
        "",
        "(Tigers scored 1 + 3 + 2 = 6 and conceded 2 + 1 + 0 = 3, so their goal difference is 3.)",
      ),
      hints: [
        "In each match the team plays in, it contributes (its goals minus the other team's goals). Add up those contributions.",
        "When the team is at home in `(h, hg, a, ag)` it contributes `hg - ag`. When it is away it contributes `ag - hg`.",
        "Two list comprehensions, one for home matches and one for away matches, then add the two sums.",
        md(
          "```",
          "goalDifference team rs",
          "  = sum [hg - ag | (h, hg, _, ag) <- rs, h == team]",
          "  + sum [ag - hg | (_, hg, a, ag) <- rs, a == team]",
          "```",
        ),
      ],
      solution: hs`goalDifference :: Team -> [Result] -> Int
goalDifference team rs
  = sum [hg - ag | (h, hg, _, ag) <- rs, h == team]
  + sum [ag - hg | (_, hg, a, ag) <- rs, a == team]`,
      tests: [
        { expr: 'goalDifference "Tigers" results', expected: "3" },
        { expr: 'goalDifference "Lions" results', expected: "-1" },
        { expr: 'goalDifference "Bears" results', expected: "0" },
        { expr: 'goalDifference "Wolves" results', expected: "-2" },
        { expr: 'goalDifference "Owls" results', expected: "0" },
        { expr: 'goalDifference "A" [("B", 4, "A", 1)]', expected: "-3", label: "an away defeat" },
        { expr: 'goalDifference "A" [("A", 5, "B", 0), ("C", 1, "A", 2)]', expected: "6" },
        { expr: 'sum [goalDifference t results | t <- ["Lions","Tigers","Bears","Wolves"]]', expected: "0", label: "goal differences always add up to 0" },
      ],
    },
    {
      id: "leagueTable",
      name: "leagueTable",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define a function `leagueTable :: [Result] -> Table` that builds the league table from a list of results: one entry for **every** team that played at least one match, paired with its total points. Each team appears exactly once, even if it has 0 points. For example:",
        "",
        "```",
        "ghci> leagueTable results",
        "[(\"Lions\",4),(\"Tigers\",6),(\"Bears\",4),(\"Wolves\",2)]",
        "ghci> leagueTable [(\"A\", 0, \"B\", 1)]",
        "[(\"A\",0),(\"B\",3)]",
        "ghci> leagueTable []",
        "[]",
        "```",
        "",
        "The order of the entries in the table doesn't matter.",
      ),
      hints: [
        "Split the job in two: first find all the team names, then work out each team's total.",
        "The teams are the home and away teams of every result: `nub (concat [[h, a] | (h, _, a, _) <- rs])` lists each one once.",
        "Use `matchPoints` on every result. A team's total is the sum of every `p` from a pair `(t', p)` where `t'` is that team: `sum [p | r <- rs, (t', p) <- matchPoints r, t' == t]`.",
        md(
          "```",
          "leagueTable rs = [(t, total t) | t <- teams]",
          "  where",
          "    teams   = nub (concat [[h, a] | (h, _, a, _) <- rs])",
          "    total t = sum [p | r <- rs, (t', p) <- matchPoints r, t' == t]",
          "```",
        ),
      ],
      solution: hs`leagueTable :: [Result] -> Table
leagueTable rs = [(t, total t) | t <- teams]
  where
    teams = nub (concat [[h, a] | (h, _, a, _) <- rs])
    total t = sum [p | r <- rs, (t', p) <- matchPoints r, t' == t]`,
      tests: [
        { expr: "leagueTable results", expected: "table", unordered: true },
        { expr: 'leagueTable [("A", 0, "B", 1)]', expected: '[("A",0),("B",3)]', unordered: true },
        { expr: "leagueTable []", expected: "[]" },
        { expr: "length (leagueTable results)", expected: "4", label: "each team appears exactly once" },
        { expr: 'leagueTable [("A", 2, "B", 2), ("B", 1, "A", 1)]', expected: '[("A",2),("B",2)]', unordered: true },
        {
          expr: 'leagueTable [("A", 1, "B", 0), ("C", 0, "A", 3), ("B", 2, "C", 2)]',
          expected: '[("A",6),("B",1),("C",1)]',
          unordered: true,
        },
        { expr: 'pointsFor "Tigers" (leagueTable (take 3 results))', expected: "3" },
      ],
    },
  ],
};
