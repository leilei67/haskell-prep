import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "m05",
  year: 0,
  difficulty: 5,
  minutes: 50,
  title: "Mini paper 5: Family tree",
  summary:
    "Explore a family tree that records each person's mother and father: count the known people, list ancestors, measure generations, and find the path to a given ancestor.",
  skills: [
    "reading a data declaration",
    "pattern matching on constructors",
    "recursion over a binary tree",
    "combining results from two subtrees",
    "max and ++",
    "counting down a depth argument",
    "Maybe results and case expressions",
  ],
  story: md(
    "This is the first mini paper with its own **data type**, a tree. Almost every real lab test has one, so this paper is about getting comfortable with them.",
    "",
    "**The domain.** A family tree (also called a pedigree) starts from one person and goes *backwards* in time: the person, their two parents, their four grandparents, and so on. Often some of the people are unknown. Here is Zoe's family tree, with birth years:",
    "",
    "```",
    "                         Zoe 2005",
    "                 mum /            \\ dad",
    "            Mia 1975                Raj 1972",
    "      mum /        \\ dad        mum /     \\ dad",
    "   Rose 1950     Tom 1948        ?       Vik 1945",
    "   /     \\     mum /    \\ dad",
    "  ?       ?  Edith 1925   ?",
    "            /     \\",
    "           ?       ?",
    "```",
    "",
    "Zoe's mother is Mia and her father is Raj. Mia's parents are Rose and Tom. Tom's mother is Edith. Nobody knows who Raj's mother was, so that branch stops with `?`.",
    "",
    "Some words:",
    "",
    "- The **ancestors** of Zoe are everyone in her tree except Zoe herself: her parents, grandparents, great-grandparents and so on. Zoe has 6 known ancestors.",
    "- **Generation** 0 is Zoe herself, generation 1 her parents (Mia, Raj), generation 2 her grandparents (Rose, Tom, Vik) and generation 3 her great-grandparents (Edith).",
    "- The number of **generations** in a tree is how many generations it records: Zoe's tree goes back 4 generations (Zoe, Mia, Tom, Edith).",
    "- The **path** to an ancestor says which parent to follow at each step: Edith is Zoe's mum's dad's mum.",
    "",
    "### The given types",
    "",
    "```haskell",
    "type Name = String",
    "",
    "data Person = Person Name Int",
    "",
    "data FamilyTree = Unknown",
    "                | Known Person FamilyTree FamilyTree",
    "",
    "data Parent = Mum | Dad",
    "```",
    "",
    "A `data` declaration defines a brand new type by listing its **constructors**, the different shapes a value can have, separated by `|`.",
    "",
    "- `Person` has one constructor, also called `Person`, holding a name and a birth year: `Person \"Mia\" 1975`.",
    "- A `FamilyTree` is either `Unknown` (no information, the `?` in the picture), or `Known p mumTree dadTree`: a known person `p` together with the family tree of their mother and the family tree of their father. Because a `FamilyTree` contains two smaller `FamilyTree`s, the type is **recursive**, and so are the functions on it.",
    "- `Parent` is a simple type with two constructors and no data inside, used to describe a path: `[Mum, Dad, Mum]` means mum's dad's mum.",
    "",
    "For example, Mia's part of the tree is:",
    "",
    "```haskell",
    "Known (Person \"Mia\" 1975)",
    "      (Known (Person \"Rose\" 1950) Unknown Unknown)",
    "      (Known (Person \"Tom\" 1948)",
    "             (Known (Person \"Edith\" 1925) Unknown Unknown)",
    "             Unknown)",
    "```",
    "",
    "**Recursion on a tree** looks like recursion on a list, but with two recursive calls. Write one equation for `Unknown` (the base case, like `[]`) and one for `Known p mum dad`, where you call your function on `mum` and on `dad` and combine the two answers.",
    "",
    "You are given `personName :: Person -> Name` and `born :: Person -> Int`, the example trees `zoe` (the picture above), `mia` (Mia's part of it) and `sam` (a person with no known parents). Every name in a tree is different.",
  ),
  notes: md(
    "**Where the marks are (15 total).** `known` 2, `ancestors` 3, `generations` 3, `generation` 3, `pathTo` 4.",
    "",
    "**Order of attack.** In order. Each one is a recursive function with an `Unknown` case and a `Known` case, and they get a little harder each time. `pathTo` is the hardest, so leave it till last.",
    "",
    "**Strategy.**",
    "",
    "- Always start with the `Unknown` equation. Ask: what is the answer for an empty tree? (0 people, no names, 0 generations, no path.)",
    "- Then write the `Known p mum dad` equation, *trusting* that the recursive calls on `mum` and `dad` give correct answers for those smaller trees. Your only job is to combine them with `p`.",
    "- Test on `sam` and `mia` (small trees) before `zoe`.",
    "",
    "**Traps.**",
    "",
    "- `ancestors` must not include the person at the root of the tree, but it must include *all* the earlier generations. A helper that lists everyone in a tree makes this easy.",
    "- `generation 0` of a tree is the root person only. For generation `k` of a `Known` tree, look at generation `k - 1` of both parents' trees.",
    "- In `pathTo`, try the mother's side first. If the person is found there, put `Mum` on the front of the path; only if not, try the father's side.",
  ),
  setup: hs`type Name = String

data Person = Person Name Int
  deriving (Eq, Show)

data FamilyTree = Unknown
                | Known Person FamilyTree FamilyTree
  deriving (Eq, Show)

data Parent = Mum | Dad
  deriving (Eq, Show)

personName :: Person -> Name
personName (Person n _) = n

born :: Person -> Int
born (Person _ y) = y

--------------------------------------------------------------
-- Example data

sam :: FamilyTree
sam = Known (Person "Sam" 1990) Unknown Unknown

mia :: FamilyTree
mia = Known (Person "Mia" 1975)
        (Known (Person "Rose" 1950) Unknown Unknown)
        (Known (Person "Tom" 1948)
          (Known (Person "Edith" 1925) Unknown Unknown)
          Unknown)

zoe :: FamilyTree
zoe = Known (Person "Zoe" 2005)
        mia
        (Known (Person "Raj" 1972)
          Unknown
          (Known (Person "Vik" 1945) Unknown Unknown))
`,
  starter: hs`--------------------------------------------------------------
-- Part I

known :: FamilyTree -> Int
known = undefined

ancestors :: FamilyTree -> [Name]
ancestors = undefined

generations :: FamilyTree -> Int
generations = undefined

--------------------------------------------------------------
-- Part II

generation :: Int -> FamilyTree -> [Name]
generation = undefined

pathTo :: Name -> FamilyTree -> Maybe [Parent]
pathTo = undefined
`,
  tasks: [
    {
      id: "known",
      name: "known",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `known :: FamilyTree -> Int` that counts the known people in a family tree (including the person at the root). For example:",
        "",
        "```",
        "ghci> known zoe",
        "7",
        "ghci> known mia",
        "4",
        "ghci> known sam",
        "1",
        "ghci> known Unknown",
        "0",
        "```",
      ),
      hints: [
        "One equation for each constructor of `FamilyTree`.",
        "An `Unknown` tree has 0 known people.",
        "A `Known p mum dad` tree has the person `p` (that's 1) plus everyone known in `mum` plus everyone known in `dad`.",
        md(
          "```",
          "known Unknown = 0",
          "known (Known _ mum dad) = 1 + known mum + known dad",
          "```",
        ),
      ],
      solution: hs`known :: FamilyTree -> Int
known Unknown = 0
known (Known _ mum dad) = 1 + known mum + known dad`,
      tests: [
        { expr: "known zoe", expected: "7" },
        { expr: "known mia", expected: "4" },
        { expr: "known sam", expected: "1" },
        { expr: "known Unknown", expected: "0" },
        { expr: 'known (Known (Person "A" 1) sam sam)', expected: "3" },
        { expr: 'known (Known (Person "A" 1) Unknown mia)', expected: "5" },
      ],
    },
    {
      id: "ancestors",
      name: "ancestors",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define a function `ancestors :: FamilyTree -> [Name]` that returns the names of all the known ancestors of the person at the root of the tree: everyone in the tree **except** the root person. The ancestors of an `Unknown` tree are `[]`. For example:",
        "",
        "```",
        "ghci> ancestors zoe",
        "[\"Mia\",\"Rose\",\"Tom\",\"Edith\",\"Raj\",\"Vik\"]",
        "ghci> ancestors mia",
        "[\"Rose\",\"Tom\",\"Edith\"]",
        "ghci> ancestors sam",
        "[]",
        "```",
        "",
        "The order of the names doesn't matter.",
      ),
      hints: [
        "Write a helper `everyone :: FamilyTree -> [Name]` that lists *all* the names in a tree, including the root. Then the ancestors are everyone in the mother's tree plus everyone in the father's tree.",
        "`everyone Unknown = []`, and for `Known p mum dad` it is `personName p` followed by everyone in `mum` and everyone in `dad`.",
        "Join lists with `++`. For example `everyone (Known p mum dad) = personName p : everyone mum ++ everyone dad`.",
        md(
          "```",
          "ancestors Unknown = []",
          "ancestors (Known _ mum dad) = everyone mum ++ everyone dad",
          "  where",
          "    everyone Unknown = []",
          "    everyone (Known p m d) = personName p : everyone m ++ everyone d",
          "```",
        ),
      ],
      solution: hs`ancestors :: FamilyTree -> [Name]
ancestors Unknown = []
ancestors (Known _ mum dad) = everyone mum ++ everyone dad
  where
    everyone Unknown = []
    everyone (Known p m d) = personName p : everyone m ++ everyone d`,
      tests: [
        { expr: "ancestors zoe", expected: '["Mia","Rose","Tom","Edith","Raj","Vik"]', unordered: true },
        { expr: "ancestors mia", expected: '["Rose","Tom","Edith"]', unordered: true },
        { expr: "ancestors sam", expected: "[]" },
        { expr: "ancestors Unknown", expected: "[]" },
        { expr: 'ancestors (Known (Person "Kid" 2020) sam Unknown)', expected: '["Sam"]' },
        { expr: 'ancestors (Known (Person "Kid" 2020) Unknown mia)', expected: '["Mia","Rose","Tom","Edith"]', unordered: true },
        { expr: "length (ancestors zoe)", expected: "known zoe - 1" },
      ],
    },
    {
      id: "generations",
      name: "generations",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define a function `generations :: FamilyTree -> Int` that returns the number of generations recorded in the tree: the number of people on the longest line from the root person back through their parents. An `Unknown` tree records 0 generations. For example:",
        "",
        "```",
        "ghci> generations zoe",
        "4",
        "ghci> generations mia",
        "3",
        "ghci> generations sam",
        "1",
        "ghci> generations Unknown",
        "0",
        "```",
        "",
        "(The longest line in `zoe` is Zoe, Mia, Tom, Edith.)",
      ),
      hints: [
        "This is the *height* of the tree. The two sides can have different heights, and you want the bigger one.",
        "`generations Unknown = 0`.",
        "A `Known _ mum dad` tree records one generation (the root person) plus however many the deeper of the two parents' trees records. `max a b` is the larger of `a` and `b`.",
        md(
          "```",
          "generations Unknown = 0",
          "generations (Known _ mum dad) = 1 + max (generations mum) (generations dad)",
          "```",
        ),
      ],
      solution: hs`generations :: FamilyTree -> Int
generations Unknown = 0
generations (Known _ mum dad) = 1 + max (generations mum) (generations dad)`,
      tests: [
        { expr: "generations zoe", expected: "4" },
        { expr: "generations mia", expected: "3" },
        { expr: "generations sam", expected: "1" },
        { expr: "generations Unknown", expected: "0" },
        { expr: 'generations (Known (Person "Kid" 2020) sam mia)', expected: "4", label: "the deeper side counts, even on the dad's side" },
        { expr: 'generations (Known (Person "Kid" 2020) Unknown sam)', expected: "2" },
      ],
    },
    {
      id: "generation",
      name: "generation",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define a function `generation :: Int -> FamilyTree -> [Name]` that returns the names of the known people in generation `k` of the tree. Generation 0 is the root person, generation 1 their parents, generation 2 their grandparents, and so on. If there is nobody known in that generation, the result is `[]`. You may assume `k >= 0`. For example:",
        "",
        "```",
        "ghci> generation 0 zoe",
        "[\"Zoe\"]",
        "ghci> generation 1 zoe",
        "[\"Mia\",\"Raj\"]",
        "ghci> generation 2 zoe",
        "[\"Rose\",\"Tom\",\"Vik\"]",
        "ghci> generation 3 zoe",
        "[\"Edith\"]",
        "ghci> generation 4 zoe",
        "[]",
        "```",
        "",
        "The order of the names doesn't matter.",
      ),
      hints: [
        "Recurse on the tree and count `k` down as you go. Your grandparents (generation 2 for you) are generation 1 for each of your parents.",
        "Three cases: an `Unknown` tree has nobody in any generation; generation 0 of `Known p _ _` is just `[personName p]`; and generation `k` (for `k > 0`) of `Known _ mum dad` combines generation `k - 1` of both parents' trees.",
        "Put the `Unknown` equation first, then the `0` equation, then the general one, so that Haskell tries them in that order.",
        md(
          "```",
          "generation _ Unknown = []",
          "generation 0 (Known p _ _) = [personName p]",
          "generation k (Known _ mum dad) = generation (k - 1) mum ++ generation (k - 1) dad",
          "```",
        ),
      ],
      solution: hs`generation :: Int -> FamilyTree -> [Name]
generation _ Unknown = []
generation 0 (Known p _ _) = [personName p]
generation k (Known _ mum dad) = generation (k - 1) mum ++ generation (k - 1) dad`,
      tests: [
        { expr: "generation 0 zoe", expected: '["Zoe"]' },
        { expr: "generation 1 zoe", expected: '["Mia","Raj"]', unordered: true },
        { expr: "generation 2 zoe", expected: '["Rose","Tom","Vik"]', unordered: true },
        { expr: "generation 3 zoe", expected: '["Edith"]' },
        { expr: "generation 4 zoe", expected: "[]" },
        { expr: "generation 2 mia", expected: '["Edith"]' },
        { expr: "generation 0 Unknown", expected: "[]" },
        { expr: "generation 1 sam", expected: "[]" },
        { expr: "sum [length (generation k zoe) | k <- [0 .. 10]]", expected: "known zoe", label: "every known person is in exactly one generation" },
      ],
    },
    {
      id: "pathTo",
      name: "pathTo",
      part: "Part II",
      marks: 4,
      prompt: md(
        "Define a function `pathTo :: Name -> FamilyTree -> Maybe [Parent]` that finds the person with the given name in the tree and returns `Just` the path to them from the root: the list of parents to follow, `Mum` or `Dad`, one per generation. The path to the root person is `Just []`. If nobody in the tree has that name, the result is `Nothing`. Every name in the tree is different. For example:",
        "",
        "```",
        "ghci> pathTo \"Edith\" zoe",
        "Just [Mum,Dad,Mum]",
        "ghci> pathTo \"Vik\" zoe",
        "Just [Dad,Dad]",
        "ghci> pathTo \"Zoe\" zoe",
        "Just []",
        "ghci> pathTo \"Bob\" zoe",
        "Nothing",
        "```",
      ),
      hints: [
        "Base case: the name can't be found in an `Unknown` tree, so the answer is `Nothing`.",
        "For `Known p mum dad`: if `p` has the name, the path is `Just []`. Otherwise search the mother's tree, and if that fails, the father's tree.",
        "A recursive call returns a `Maybe [Parent]`, so use `case ... of` to look inside it. If `pathTo n mum` is `Just path`, the answer is `Just (Mum : path)`; if it is `Nothing`, try `dad` the same way with `Dad`.",
        md(
          "```",
          "pathTo _ Unknown = Nothing",
          "pathTo n (Known p mum dad)",
          "  | personName p == n = Just []",
          "  | otherwise =",
          "      case pathTo n mum of",
          "        Just path -> Just (Mum : path)",
          "        Nothing ->",
          "          case pathTo n dad of",
          "            Just path -> Just (Dad : path)",
          "            Nothing   -> Nothing",
          "```",
        ),
      ],
      solution: hs`pathTo :: Name -> FamilyTree -> Maybe [Parent]
pathTo _ Unknown = Nothing
pathTo n (Known p mum dad)
  | personName p == n = Just []
  | otherwise =
      case pathTo n mum of
        Just path -> Just (Mum : path)
        Nothing ->
          case pathTo n dad of
            Just path -> Just (Dad : path)
            Nothing -> Nothing`,
      tests: [
        { expr: 'pathTo "Edith" zoe', expected: "Just [Mum,Dad,Mum]" },
        { expr: 'pathTo "Vik" zoe', expected: "Just [Dad,Dad]" },
        { expr: 'pathTo "Zoe" zoe', expected: "Just []" },
        { expr: 'pathTo "Bob" zoe', expected: "Nothing" },
        { expr: 'pathTo "Raj" zoe', expected: "Just [Dad]" },
        { expr: 'pathTo "Rose" zoe', expected: "Just [Mum,Mum]" },
        { expr: 'pathTo "Edith" mia', expected: "Just [Dad,Mum]" },
        { expr: 'pathTo "Sam" Unknown', expected: "Nothing" },
        { expr: 'pathTo "Sam" (Known (Person "Kid" 2020) mia sam)', expected: "Just [Dad]", label: "found only on the dad's side" },
      ],
    },
  ],
};
