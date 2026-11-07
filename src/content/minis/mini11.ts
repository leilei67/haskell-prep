import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "m11",
  year: 0,
  difficulty: 11,
  minutes: 105,
  title: "Mini paper 11: Package dependencies",
  summary:
    "A software repository of named, versioned packages. Look up a package, list its versions and newest release, follow direct and reverse dependencies, report missing packages, take the dependency closure, and produce a topological install order.",
  skills: [
    "lookup in a list of records",
    "filtering and sorting",
    "picking a maximum with a fold",
    "Maybe for a search that can fail",
    "graphs as adjacency stored on nodes",
    "nub and order of first appearance",
    "depth-first search with an accumulator",
    "topological order by visiting dependencies first",
  ],
  story: md(
    "**The domain.** A **package** is a piece of software you can install: a compiler library, a web server, a command-line tool. Every package has a **name** (such as `\"json\"`), a **version** (a whole number, bigger meaning newer), and a list of **dependencies**: the names of other packages it needs in order to work. Several versions of the same name can sit in the repository at once; installing a name always means installing its **newest** version.",
    "",
    "Here is the example repository `repo`:",
    "",
    "```",
    "name   version   depends on",
    "core   1         (nothing)",
    "json   1         core",
    "core   2         (nothing)",
    "json   2         core",
    "http   1         json, core",
    "cli    1         http, json",
    "web    1         http",
    "fmt    3         (nothing)",
    "app    1         cli, fmt",
    "bad    1         ghost",
    "```",
    "",
    "So the newest `core` is version 2, the newest `json` is version 2, and `app` needs both `cli` and `fmt`. Package `bad` depends on `ghost`, which is **not** in the repository: it cannot be installed.",
    "",
    "**Dependencies form a graph.** Draw an arrow from each package to each name it depends on: `cli` points to `http` and `json`; `http` points to `json` and `core`; and so on. To install `cli` you first install everything reachable along those arrows (`core`, then `json`, then `http`, then `cli`). The arrows never go round in a circle in this paper: you may assume there are no cyclic dependencies.",
    "",
    "**Missing names.** A dependency might name a package that is not in the repository at all (`ghost` above). Direct dependencies of `bad` already include a hole; a hole can also sit further down, if `worse` depends on `bad`. The **closure** of a name lists only packages that actually exist; **missing** lists the holes.",
    "",
    "### The given types",
    "",
    "```haskell",
    "type Name = String",
    "",
    "type Version = Int",
    "",
    "data Package = Pkg Name Version [Name]",
    "",
    "type Repo = [Package]",
    "```",
    "",
    "- A `Name` is a package name such as `\"http\"`.",
    "- A `Version` is a whole number. Version 2 is newer than version 1.",
    "- `Pkg n v ds` is the package named `n` at version `v`, depending on the names `ds` (in the order listed, with no duplicates).",
    "- A `Repo` is a list of packages. Each pair of name and version appears at most once. The same name may appear at several versions.",
    "",
    "Queries that take a `Name` (rather than a specific version) always use the **newest** package of that name.",
    "",
    "Given to you: the repository `repo` (above), a three-package chain `chain` whose packages are listed out of dependency order, and a tiny extra repository `worseRepo` in which `worse` depends on `bad` (and so, indirectly, on the missing `ghost`):",
    "",
    "```",
    "chain:     a 1 -> b      worseRepo:  everything in repo, plus",
    "           c 1 -> (none)             worse 1 -> bad, core",
    "           b 1 -> c",
    "```",
  ),
  notes: md(
    "**Where the marks are.** Part I (finding packages) is 9 marks. Part II (the dependency graph) is 15.",
    "",
    "**Order of attack.** `findPkg` is independent of the rest. `versions` and `newest` both scan for a name; write `newest` next, because `directDeps` and almost everything in Part II uses it. `closure` feeds `missing` and `installOrder`. `canInstall` is a one-liner once `missing` works.",
    "",
    "**Traps.**",
    "",
    "- Name-based queries use the **newest** version. `directDeps repo \"json\"` is the dependencies of `json` version 2, not version 1.",
    "- A name that is not in the repo at all: `newest` and `findPkg` give `Nothing`, `directDeps` and `closure` give `[]`, `missing` gives a singleton list of that name, `canInstall` is `False`, `installOrder` is `Nothing`.",
    "- `closure` lists only names that exist in the repo. A missing dependency is *not* included in the closure; it shows up in `missing` instead.",
    "- `installOrder` must use exactly the visit method in the question. Any correct topological order will install, but only one order matches the tests.",
    "",
    "**Self-check.** If `canInstall repo n` is `True`, then `installOrder repo n` is `Just xs` where `xs` is a permutation of `closure repo n`, and each name comes after every name it depends on.",
  ),
  setup: hs`import Data.List
import Data.Maybe

type Name = String

type Version = Int

data Package = Pkg Name Version [Name]
  deriving (Eq, Show)

type Repo = [Package]

--------------------------------------------------------------
-- Example data

repo :: Repo
repo
  = [ Pkg "core" 1 []
    , Pkg "json" 1 ["core"]
    , Pkg "core" 2 []
    , Pkg "json" 2 ["core"]
    , Pkg "http" 1 ["json", "core"]
    , Pkg "cli"  1 ["http", "json"]
    , Pkg "web"  1 ["http"]
    , Pkg "fmt"  3 []
    , Pkg "app"  1 ["cli", "fmt"]
    , Pkg "bad"  1 ["ghost"]
    ]

chain :: Repo
chain
  = [ Pkg "a" 1 ["b"]
    , Pkg "c" 1 []
    , Pkg "b" 1 ["c"]
    ]

worseRepo :: Repo
worseRepo = repo ++ [Pkg "worse" 1 ["bad", "core"]]
`,
  starter: hs`--------------------------------------------------------------
-- Part I

findPkg :: Repo -> Name -> Version -> Maybe Package
findPkg = undefined

versions :: Repo -> Name -> [Version]
versions = undefined

newest :: Repo -> Name -> Maybe Package
newest = undefined

directDeps :: Repo -> Name -> [Name]
directDeps = undefined

--------------------------------------------------------------
-- Part II

neededBy :: Repo -> Name -> [Name]
neededBy = undefined

missing :: Repo -> Name -> [Name]
missing = undefined

canInstall :: Repo -> Name -> Bool
canInstall = undefined

closure :: Repo -> Name -> [Name]
closure = undefined

installOrder :: Repo -> Name -> Maybe [Name]
installOrder = undefined
`,
  tasks: [
    {
      id: "findPkg",
      name: "findPkg",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `findPkg :: Repo -> Name -> Version -> Maybe Package` that finds the package with the given name and version. If there is no such package, the result is `Nothing`. For example:",
        "",
        "```",
        "ghci> findPkg repo \"core\" 1",
        "Just (Pkg \"core\" 1 [])",
        "ghci> findPkg repo \"core\" 2",
        "Just (Pkg \"core\" 2 [])",
        "ghci> findPkg repo \"core\" 9",
        "Nothing",
        "ghci> findPkg repo \"ghost\" 1",
        "Nothing",
        "```",
      ),
      hints: [
        "Walk the list and keep the first package whose name and version both match.",
        "A list comprehension with `listToMaybe` (from `Data.Maybe`, already imported) turns zero-or-more matches into a `Maybe`: `Nothing` on `[]`, `Just` of the head otherwise.",
        "You can also recurse: if the head matches, wrap it in `Just`; if not, search the rest; `[]` is `Nothing`.",
        md(
          "```",
          "findPkg repo n v = listToMaybe [p | p@(Pkg n' v' _) <- repo, n' == n, v' == v]",
          "```",
        ),
      ],
      solution: hs`findPkg :: Repo -> Name -> Version -> Maybe Package
findPkg repo n v = listToMaybe [p | p@(Pkg n' v' _) <- repo, n' == n, v' == v]`,
      tests: [
        { expr: 'findPkg repo "core" 1', expected: 'Just (Pkg "core" 1 [])' },
        { expr: 'findPkg repo "core" 2', expected: 'Just (Pkg "core" 2 [])' },
        { expr: 'findPkg repo "core" 9', expected: "Nothing" },
        { expr: 'findPkg repo "ghost" 1', expected: "Nothing" },
        { expr: "findPkg [] \"x\" 1", expected: "Nothing" },
        { expr: 'findPkg repo "json" 2', expected: 'Just (Pkg "json" 2 ["core"])' },
        { expr: 'findPkg chain "b" 1', expected: 'Just (Pkg "b" 1 ["c"])' },
        { expr: 'findPkg repo "fmt" 3', expected: 'Just (Pkg "fmt" 3 [])' },
      ],
    },
    {
      id: "versions",
      name: "versions",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `versions :: Repo -> Name -> [Version]` that lists every version of a name that is in the repository, **sorted smallest first**, with no duplicates. If the name is not in the repository, the list is empty. For example:",
        "",
        "```",
        "ghci> versions repo \"core\"",
        "[1,2]",
        "ghci> versions repo \"fmt\"",
        "[3]",
        "ghci> versions repo \"ghost\"",
        "[]",
        "```",
      ),
      hints: [
        "Collect the version field of every package whose name matches.",
        "`sort` (from `Data.List`, already imported) puts them smallest first. `nub` after sorting removes any duplicate versions, though the spec says each (name, version) pair appears at most once.",
        "A name that never occurs gives `[]`, and `sort []` is `[]`.",
        md(
          "```",
          "versions repo n = sort [v | Pkg n' v _ <- repo, n' == n]",
          "```",
        ),
      ],
      solution: hs`versions :: Repo -> Name -> [Version]
versions repo n = sort [v | Pkg n' v _ <- repo, n' == n]`,
      tests: [
        { expr: 'versions repo "core"', expected: "[1, 2]" },
        { expr: 'versions repo "fmt"', expected: "[3]" },
        { expr: 'versions repo "ghost"', expected: "[]" },
        { expr: 'versions [] "x"', expected: "[]" },
        { expr: 'versions repo "json"', expected: "[1, 2]" },
        { expr: 'versions repo "http"', expected: "[1]" },
        { expr: 'versions chain "a"', expected: "[1]" },
        { expr: 'versions repo "app"', expected: "[1]" },
      ],
    },
    {
      id: "newest",
      name: "newest",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define a function `newest :: Repo -> Name -> Maybe Package` that returns the package of the given name with the **greatest version**. If the name is not in the repository, the result is `Nothing`. If two entries somehow had the same greatest version, return the one that appears **first** in the repository. For example:",
        "",
        "```",
        "ghci> newest repo \"core\"",
        "Just (Pkg \"core\" 2 [])",
        "ghci> newest repo \"json\"",
        "Just (Pkg \"json\" 2 [\"core\"])",
        "ghci> newest repo \"ghost\"",
        "Nothing",
        "```",
      ),
      hints: [
        "Collect every package of that name, then pick the one with the biggest version.",
        "On an empty collection the answer is `Nothing`. On a non-empty list, `foldl` from the first package, replacing the accumulator only when a strictly greater version appears, keeps the first of a tie.",
        "`listToMaybe` / `maybe` can wrap the empty/non-empty split. You don't need `maximumBy`.",
        md(
          "```",
          "newest repo n =",
          "  case [p | p@(Pkg n' _ _) <- repo, n' == n] of",
          "    []     -> Nothing",
          "    p : ps -> Just (foldl pick p ps)",
          "  where",
          "    pick acc@(Pkg _ va _) q@(Pkg _ vq _)",
          "      | vq > va   = q",
          "      | otherwise = acc",
          "```",
        ),
      ],
      solution: hs`newest :: Repo -> Name -> Maybe Package
newest repo n =
  case [p | p@(Pkg n' _ _) <- repo, n' == n] of
    []     -> Nothing
    p : ps -> Just (foldl pick p ps)
  where
    pick acc@(Pkg _ va _) q@(Pkg _ vq _)
      | vq > va   = q
      | otherwise = acc`,
      tests: [
        { expr: 'newest repo "core"', expected: 'Just (Pkg "core" 2 [])' },
        { expr: 'newest repo "json"', expected: 'Just (Pkg "json" 2 ["core"])' },
        { expr: 'newest repo "ghost"', expected: "Nothing" },
        { expr: 'newest [] "x"', expected: "Nothing" },
        { expr: 'newest repo "fmt"', expected: 'Just (Pkg "fmt" 3 [])' },
        { expr: 'newest repo "cli"', expected: 'Just (Pkg "cli" 1 ["http", "json"])' },
        { expr: 'newest chain "b"', expected: 'Just (Pkg "b" 1 ["c"])' },
        { expr: 'newest repo "bad"', expected: 'Just (Pkg "bad" 1 ["ghost"])' },
      ],
    },
    {
      id: "directDeps",
      name: "directDeps",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `directDeps :: Repo -> Name -> [Name]` that lists the dependencies of the **newest** package of that name, in the order they are stored. If the name is not in the repository, the list is empty. For example:",
        "",
        "```",
        "ghci> directDeps repo \"http\"",
        "[\"json\",\"core\"]",
        "ghci> directDeps repo \"core\"",
        "[]",
        "ghci> directDeps repo \"ghost\"",
        "[]",
        "```",
      ),
      hints: [
        "This is `newest`, then taking the dependency list out of the `Pkg`, or `[]` when `newest` is `Nothing`.",
        "`maybe [] deps (newest repo n)` does the wrap/unwrap. `deps (Pkg _ _ ds) = ds`.",
        "A `case` on `newest repo n` is equally fine.",
        md(
          "```",
          "directDeps repo n = maybe [] deps (newest repo n)",
          "  where",
          "    deps (Pkg _ _ ds) = ds",
          "```",
        ),
      ],
      solution: hs`directDeps :: Repo -> Name -> [Name]
directDeps repo n = maybe [] deps (newest repo n)
  where
    deps (Pkg _ _ ds) = ds`,
      tests: [
        { expr: 'directDeps repo "http"', expected: '["json", "core"]' },
        { expr: 'directDeps repo "core"', expected: "[]" },
        { expr: 'directDeps repo "ghost"', expected: "[]" },
        { expr: 'directDeps [] "x"', expected: "[]" },
        { expr: 'directDeps repo "json"', expected: '["core"]' },
        { expr: 'directDeps repo "app"', expected: '["cli", "fmt"]' },
        { expr: 'directDeps repo "bad"', expected: '["ghost"]' },
        { expr: 'directDeps chain "a"', expected: '["b"]' },
      ],
    },
    {
      id: "neededBy",
      name: "neededBy",
      part: "Part II",
      marks: 2,
      prompt: md(
        "Define a function `neededBy :: Repo -> Name -> [Name]` that lists every package **name** that has at least one version depending on the given name (that version's dependency list contains it). Each name appears once, in the order names **first** appear in the repository. For example:",
        "",
        "```",
        "ghci> neededBy repo \"core\"",
        "[\"json\",\"http\"]",
        "ghci> neededBy repo \"json\"",
        "[\"http\",\"cli\"]",
        "ghci> neededBy repo \"web\"",
        "[]",
        "```",
        "",
        "`json` version 1 and version 2 both depend on `core`, but `json` is listed once. `cli` depends on `json` (and `http`), so `cli` appears in `neededBy repo \"json\"`.",
      ),
      hints: [
        "Walk the whole repo, not just newest packages: an old version that still depends on `n` counts.",
        "Collect names `n'` where `Pkg n' _ ds` has `n` as an element of `ds`.",
        "`nub` keeps the first occurrence of each name, which is the order required. A name never depends on itself in this paper, but `nub` would still be right if it did.",
        md(
          "```",
          "neededBy repo n = nub [n' | Pkg n' _ ds <- repo, elem n ds]",
          "```",
        ),
      ],
      solution: hs`neededBy :: Repo -> Name -> [Name]
neededBy repo n = nub [n' | Pkg n' _ ds <- repo, elem n ds]`,
      tests: [
        { expr: 'neededBy repo "core"', expected: '["json", "http"]' },
        { expr: 'neededBy repo "json"', expected: '["http", "cli"]' },
        { expr: 'neededBy repo "web"', expected: "[]" },
        { expr: 'neededBy repo "fmt"', expected: '["app"]' },
        { expr: 'neededBy repo "ghost"', expected: '["bad"]' },
        { expr: 'neededBy [] "x"', expected: "[]" },
        { expr: 'neededBy repo "cli"', expected: '["app"]' },
        { expr: 'neededBy chain "c"', expected: '["b"]' },
        { expr: 'neededBy chain "a"', expected: "[]" },
      ],
    },
    {
      id: "missing",
      name: "missing",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define a function `missing :: Repo -> Name -> [Name]` that lists every package name you would need in order to install `n` that is **not** in the repository. Each missing name appears once, in the order they are **first** discovered by the following walk:",
        "",
        "- If `n` itself is not in the repository, the answer is `[n]`.",
        "- Otherwise start from `n` and look at the direct dependencies of every **existing** package you can reach (the names in `closure`, which you may use even if you write it later — or walk it yourself). A direct dependency that has no package in the repository is missing.",
        "",
        "For example:",
        "",
        "```",
        "ghci> missing repo \"cli\"",
        "[]",
        "ghci> missing repo \"bad\"",
        "[\"ghost\"]",
        "ghci> missing repo \"nope\"",
        "[\"nope\"]",
        "ghci> missing worseRepo \"worse\"",
        "[\"ghost\"]",
        "```",
        "",
        "`worse` depends on `bad` and `core`. `bad` exists but needs `ghost`, which does not, so the hole is `ghost`.",
      ),
      hints: [
        "Handle the 'name not in the repo' case first with `newest` / `isNothing`.",
        "Then collect `d` from `directDeps` of every name in `closure repo n` for which `newest repo d` is `Nothing`. `nub` keeps first-discovery order if you walk `closure` in its listed order.",
        "You can write a small walker that does not depend on `closure` yet: from an existing name, look at each direct dep; if that dep exists, recurse; if not, it is missing.",
        md(
          "```",
          "missing repo n =",
          "  case newest repo n of",
          "    Nothing -> [n]",
          "    Just _  -> nub [d | x <- closure repo n, d <- directDeps repo x,",
          "                        isNothing (newest repo d)]",
          "```",
        ),
      ],
      solution: hs`missing :: Repo -> Name -> [Name]
missing repo n =
  case newest repo n of
    Nothing -> [n]
    Just _  -> nub [d | x <- closure repo n, d <- directDeps repo x, isNothing (newest repo d)]`,
      tests: [
        { expr: 'missing repo "cli"', expected: "[]" },
        { expr: 'missing repo "bad"', expected: '["ghost"]' },
        { expr: 'missing repo "nope"', expected: '["nope"]' },
        { expr: 'missing worseRepo "worse"', expected: '["ghost"]' },
        { expr: 'missing [] "x"', expected: '["x"]' },
        { expr: 'missing repo "core"', expected: "[]" },
        { expr: 'missing repo "app"', expected: "[]" },
        { expr: 'missing chain "a"', expected: "[]" },
        { expr: 'missing repo "ghost"', expected: '["ghost"]' },
      ],
    },
    {
      id: "canInstall",
      name: "canInstall",
      part: "Part II",
      marks: 2,
      prompt: md(
        "Define a function `canInstall :: Repo -> Name -> Bool` that is `True` when every package needed to install `n` is present in the repository: `n` itself, and every name reachable through its (possibly nested) dependencies. For example:",
        "",
        "```",
        "ghci> canInstall repo \"cli\"",
        "True",
        "ghci> canInstall repo \"bad\"",
        "False",
        "ghci> canInstall repo \"nope\"",
        "False",
        "ghci> canInstall worseRepo \"worse\"",
        "False",
        "```",
      ),
      hints: [
        "Once `missing` is right, this is whether that list is empty.",
        "`canInstall repo n = null (missing repo n)`.",
        "A name that is not in the repo has `missing = [n]`, so it cannot be installed. A name whose nested deps include a hole also fails.",
        md("```", "canInstall repo n = null (missing repo n)", "```"),
      ],
      solution: hs`canInstall :: Repo -> Name -> Bool
canInstall repo n = null (missing repo n)`,
      tests: [
        { expr: 'canInstall repo "cli"', expected: "True" },
        { expr: 'canInstall repo "bad"', expected: "False" },
        { expr: 'canInstall repo "nope"', expected: "False" },
        { expr: 'canInstall worseRepo "worse"', expected: "False" },
        { expr: 'canInstall repo "core"', expected: "True" },
        { expr: 'canInstall [] "x"', expected: "False" },
        { expr: 'canInstall repo "app"', expected: "True" },
        { expr: 'canInstall repo "fmt"', expected: "True" },
        { expr: 'canInstall chain "a"', expected: "True" },
      ],
    },
    {
      id: "closure",
      name: "closure",
      part: "Part II",
      marks: 4,
      prompt: md(
        "Define a function `closure :: Repo -> Name -> [Name]` that lists every package name reachable from `n` by following newest-version dependencies, **including `n` itself**. Only names that exist in the repository are listed. Each name appears once, in this order:",
        "",
        "- If `n` is not in the repository, the list is empty.",
        "- Otherwise perform a depth-first walk: output `n`, then walk each of its `directDeps` in the order they are stored. Skip a name you have already output (`nub` of the walk is the required order).",
        "",
        "You may assume there are no cyclic dependencies. For example:",
        "",
        "```",
        "ghci> closure repo \"cli\"",
        "[\"cli\",\"http\",\"json\",\"core\"]",
        "ghci> closure repo \"core\"",
        "[\"core\"]",
        "ghci> closure repo \"nope\"",
        "[]",
        "ghci> closure repo \"bad\"",
        "[\"bad\"]",
        "```",
        "",
        "`bad` is in the repo so it appears, but `ghost` is not, so `ghost` is not in the closure.",
      ),
      hints: [
        "A helper `go x` returns the walk starting at `x`: empty if `x` is not in the repo, otherwise `x` followed by `concatMap go` of its direct dependencies.",
        "`nub` then removes names reached along more than one path (`core` is reached from both `http` and `json`), keeping the first occurrence.",
        "Do not emit a name that has no package: when `newest` is `Nothing`, `go` returns `[]` rather than `[x]`.",
        md(
          "```",
          "closure repo n = nub (go n)",
          "  where",
          "    go x = case newest repo x of",
          "      Nothing -> []",
          "      Just _  -> x : concatMap go (directDeps repo x)",
          "```",
        ),
      ],
      solution: hs`closure :: Repo -> Name -> [Name]
closure repo n = nub (go n)
  where
    go x = case newest repo x of
      Nothing -> []
      Just _  -> x : concatMap go (directDeps repo x)`,
      tests: [
        { expr: 'closure repo "cli"', expected: '["cli", "http", "json", "core"]' },
        { expr: 'closure repo "core"', expected: '["core"]' },
        { expr: 'closure repo "nope"', expected: "[]" },
        { expr: 'closure repo "bad"', expected: '["bad"]' },
        { expr: 'closure repo "app"', expected: '["app", "cli", "http", "json", "core", "fmt"]' },
        { expr: 'closure repo "web"', expected: '["web", "http", "json", "core"]' },
        { expr: 'closure worseRepo "worse"', expected: '["worse", "bad", "core"]' },
        { expr: 'closure [] "x"', expected: "[]" },
        { expr: 'closure chain "a"', expected: '["a", "b", "c"]' },
        { expr: 'closure repo "fmt"', expected: '["fmt"]' },
      ],
    },
    {
      id: "installOrder",
      name: "installOrder",
      part: "Part II",
      marks: 4,
      prompt: md(
        "Define a function `installOrder :: Repo -> Name -> Maybe [Name]` that lists the existing packages needed to install `n`, each exactly once, in an order where each name comes **after** every name it depends on (so you can install left to right).",
        "",
        "- If `n` cannot be installed (`canInstall` is `False`), the result is `Nothing`.",
        "- Otherwise use exactly this method, so the answer is unique:",
        "  - Keep a list of names already placed, starting empty.",
        "  - **Visit** `n`.",
        "  - To visit a name `x`: if `x` is already placed, or is not in the repository, do nothing. Otherwise first visit each of its `directDeps` in order, then place `x`.",
        "",
        "For example:",
        "",
        "```",
        "ghci> installOrder repo \"cli\"",
        "Just [\"core\",\"json\",\"http\",\"cli\"]",
        "ghci> installOrder repo \"app\"",
        "Just [\"core\",\"json\",\"http\",\"cli\",\"fmt\",\"app\"]",
        "ghci> installOrder chain \"a\"",
        "Just [\"c\",\"b\",\"a\"]",
        "ghci> installOrder repo \"bad\"",
        "Nothing",
        "```",
        "",
        "In `chain`, visiting `a` visits `b`, which visits `c` (placed first).",
      ),
      hints: [
        "Guard with `canInstall` (or `null (missing repo n)` plus a check that `n` exists — `canInstall` already covers that).",
        "The placed list is an accumulator. Write `visit :: [Name] -> Name -> [Name]`. Because `visit` takes the accumulator first, `foldl visit placed ds` visits a whole dependency list.",
        "Keep placed **newest-first** (just placed at the front) and `reverse` once at the end, as in the spreadsheet `evalOrder` pattern.",
        md(
          "```",
          "installOrder repo n",
          "  | not (canInstall repo n) = Nothing",
          "  | otherwise = Just (reverse (visit [] n))",
          "  where",
          "    visit placed x",
          "      | elem x placed || isNothing (newest repo x) = placed",
          "      | otherwise = x : foldl visit placed (directDeps repo x)",
          "```",
        ),
      ],
      solution: hs`installOrder :: Repo -> Name -> Maybe [Name]
installOrder repo n
  | not (canInstall repo n) = Nothing
  | otherwise = Just (reverse (visit [] n))
  where
    visit placed x
      | elem x placed || isNothing (newest repo x) = placed
      | otherwise = x : foldl visit placed (directDeps repo x)`,
      tests: [
        { expr: 'installOrder repo "cli"', expected: 'Just ["core", "json", "http", "cli"]' },
        { expr: 'installOrder repo "app"', expected: 'Just ["core", "json", "http", "cli", "fmt", "app"]' },
        { expr: 'installOrder chain "a"', expected: 'Just ["c", "b", "a"]' },
        { expr: 'installOrder repo "bad"', expected: "Nothing" },
        { expr: 'installOrder repo "core"', expected: 'Just ["core"]' },
        { expr: 'installOrder repo "nope"', expected: "Nothing" },
        { expr: 'installOrder repo "web"', expected: 'Just ["core", "json", "http", "web"]' },
        { expr: 'installOrder repo "fmt"', expected: 'Just ["fmt"]' },
        { expr: 'installOrder worseRepo "worse"', expected: "Nothing" },
        { expr: 'installOrder [] "x"', expected: "Nothing" },
        {
          expr: 'sort (fromJust (installOrder repo "app")) == sort (closure repo "app")',
          label: "installOrder of app is a permutation of its closure",
        },
        {
          expr: 'case installOrder repo "cli" of { Just xs -> and [all (\\d -> elem d (take i xs)) (directDeps repo x) | (i, x) <- zip [0 :: Int ..] xs]; Nothing -> False }',
          label: "each name in cli's order comes after its deps",
        },
      ],
    },
  ],
};
