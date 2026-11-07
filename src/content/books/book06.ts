import { type Book, type DrillSet, hs, md } from "../schema.ts";

const roseSetup = hs`data Rose a = Node a [Rose a]
  deriving (Eq, Show)

type Forest a = [Rose a]

solo :: Rose Int
solo = Node 9 []

bush :: Rose Int
bush = Node 1 [Node 2 [], Node 3 [], Node 4 []]

chain :: Rose Int
chain = Node 1 [Node 2 [Node 3 [Node 4 []]]]

twig :: Rose Char
twig = Node 'k' [Node 'a' [], Node 'b' [Node 'd' []], Node 'c' []]

grove :: Forest Int
grove = [solo, bush, chain]
`;

const entrySetup = hs`data Entry = File String Int | Folder String [Entry]
  deriving (Eq, Show)

bag :: Entry
bag = Folder "bag"
  [ File "a.txt" 10
  , Folder "sub" [File "b.txt" 5]
  , Folder "empty" []
  ]
`;

const markSetup = hs`data Markup = Plain String | Tag String [Markup]
  deriving (Eq, Show)

bits :: Markup
bits = Tag "ul" [Tag "li" [Plain "a"], Tag "li" [Plain "b"], Plain "!"]

page :: Markup
page = Tag "html"
  [ Tag "body"
      [ Plain "Hi"
      , Tag "p" [Plain "x", Plain "y"]
      , Tag "br" []
      , Tag "p" [Plain "!"]
      ]
  ]
`;

const langSetup = hs`data Expr = Lit Int | Var String | Add Expr Expr
  deriving (Eq, Show)

data Stmt = Set String Expr | Block [Stmt] | If Expr Stmt Stmt
  deriving (Eq, Show)

type Env = [(String, Int)]

prog :: Stmt
prog = Block
  [ Set "x" (Lit 1)
  , Set "y" (Add (Var "x") (Lit 2))
  , If (Var "y") (Set "z" (Lit 9)) (Set "z" (Lit 0))
  ]
`;

const plusSetup = hs`data Expr = Lit Int | Plus [Expr]
  deriving (Eq, Show)
`;

const fsSetup = hs`data FS = File String Int | Folder String [FS]
  deriving (Eq, Show)

desk :: FS
desk = Folder "desk"
  [ File "readme.txt" 40
  , Folder "src"
      [ File "Main.hs" 120
      , File "Lib.hs" 80
      ]
  , Folder "empty" []
  ]
`;

const orgSetup = hs`data Rose a = Node a [Rose a]
  deriving (Eq, Show)

type Org = Rose String

office :: Org
office = Node "Pat"
  [ Node "Alex" []
  , Node "Sam" [Node "Jo" [], Node "Kim" []]
  , Node "Riley" []
  ]
`;

const taskSetup = hs`data Task = Task String Bool [Task]
  deriving (Eq, Show)

chores :: Task
chores = Task "move" False
  [ Task "boxes" True []
  , Task "clean" False
      [ Task "kitchen" True []
      , Task "bath" False []
      ]
  ]
`;

const partSetup = hs`data Part = Buy String Int | Made String [Part]
  deriving (Eq, Show)

lamp :: Part
lamp = Made "lamp"
  [ Buy "bulb" 5
  , Made "shade"
      [ Buy "cloth" 8
      , Buy "frame" 4
      ]
  , Buy "flex" 3
  ]
`;

const outlineSetup = hs`data Item = Topic String | Unit String [Item]
  deriving (Eq, Show)

course :: Item
course = Unit "FP"
  [ Topic "lists"
  , Unit "trees"
      [ Topic "binary"
      , Topic "rose"
      ]
  , Topic "exams"
  ]
`;

const albumSetup = hs`data Album = Pic String | Album String [Album]
  deriving (Eq, Show)

hols :: Album
hols = Album "trip"
  [ Pic "train"
  , Album "rome" [Pic "forum", Pic "gelato"]
  , Album "empty" []
  ]
`;

const menuSetup = hs`data Dish = Item String Bool | Section String [Dish]
  deriving (Eq, Show)

menu :: Dish
menu = Section "card"
  [ Item "soup" True
  , Section "mains"
      [ Item "pie" False
      , Item "beans" True
      ]
  , Item "tea" True
  ]
`;

const orgBlock = [
  "```",
  "type Org = Rose String",
  "",
  "office = Node \"Pat\"",
  "  [ Node \"Alex\" []",
  "  , Node \"Sam\" [Node \"Jo\" [], Node \"Kim\" []]",
  "  , Node \"Riley\" []",
  "  ]",
  "```",
];

const fsBlock = [
  "```",
  "data FS = File String Int | Folder String [FS]",
  "",
  "desk = Folder \"desk\"",
  "  [ File \"readme.txt\" 40",
  "  , Folder \"src\" [File \"Main.hs\" 120, File \"Lib.hs\" 80]",
  "  , Folder \"empty\" []",
  "  ]",
  "```",
];

const markBlock = [
  "```",
  "data Markup = Plain String | Tag String [Markup]",
  "```",
];

const langBlock = [
  "```",
  "data Expr = Lit Int | Var String | Add Expr Expr",
  "data Stmt = Set String Expr | Block [Stmt] | If Expr Stmt Stmt",
  "type Env  = [(String, Int)]",
  "```",
];

const roseBlock = [
  "```",
  "data Rose a = Node a [Rose a]",
  "```",
];

const level1: DrillSet = {
  id: "b-rose-l1",
  lesson: "",
  level: 1,
  title: "Level 1: Warm-up",
  intro: md(
    "A rose tree is a value plus a **list** of child trees. There is no separate `Leaf`: a node with no children is written `Node x []`. The empty list is the base case.",
    "",
    "```",
    "data Rose a = Node a [Rose a]",
    "",
    "weight :: Rose a -> Int",
    "weight (Node _ ts) = 1 + sum (map weight ts)",
    "```",
    "",
    "`map` walks the children; `sum` (or `concat`, or `foldr`) glues their answers together. A **forest** is just a list of rose trees.",
  ),
  drills: [
    {
      k: "quiz",
      q: "`data Rose a = Node a [Rose a]`. What is the type of the constructor `Node`?",
      options: ["`Rose a`", "`a -> [Rose a] -> Rose a`", "`[Rose a] -> a`", "`(a, [Rose a]) -> Rose a`"],
      answer: 1,
      why: "`Node` is a function of two arguments, one at a time: first the label, then the list of children.",
    },
    {
      k: "quiz",
      q: "Which value is the tree with 5 at the root and two childless children, 1 and 8?",
      options: [
        "`Node 5 [1, 8]`",
        "`Node 5 1 8`",
        "`Node 5 [Node 1 [], Node 8 []]`",
        "`Node [Node 1 [], Node 8 []] 5`",
      ],
      answer: 2,
      why: "Each child is a whole tree, so it needs its own `Node`. The children come as a list, the second field of `Node`.",
    },
    {
      k: "quiz",
      q: "Why is `Node 5` not a finished tree?",
      options: [
        "5 is not a valid label",
        "You still have to give the list of children",
        "You must write `Leaf` as well",
        "Rose trees cannot hold numbers",
      ],
      answer: 1,
      why: "`Node` needs two fields. `Node 5` is still waiting for a `[Rose Int]`. A childless node is `Node 5 []`.",
    },
    {
      k: "write",
      setup: roseSetup,
      body: md(
        "Define `sprig` to be this tree (a childless node is `Node n []`):",
        "",
        "```",
        "    2",
        "   / \\",
        "  7   9",
        "      |",
        "      1",
        "```",
      ),
      starter: hs`sprig :: Rose Int
sprig = undefined
`,
      tests: [
        { expr: "case sprig of { Node x _ -> x }", expected: "2", label: "the root holds 2" },
        { expr: "case sprig of { Node _ ts -> length ts }", expected: "2", label: "two children" },
        { expr: "sprig", expected: "Node 2 [Node 7 [], Node 9 [Node 1 []]]" },
        { expr: "sprig == Node 2 []", expected: "False", label: "not a single node" },
      ],
      hint: "The 1 hangs off the 9: `Node 9 [Node 1 []]`. The 7 is `Node 7 []`.",
      solution: hs`sprig :: Rose Int
sprig = Node 2 [Node 7 [], Node 9 [Node 1 []]]
`,
    },
    {
      k: "quiz",
      q: "`type Forest a = [Rose a]`. Which of these is a forest of two childless trees?",
      options: ["`Node 1 [Node 2 []]`", "`[Node 1 [], Node 2 []]`", "`Node [1, 2] []`", "`[1, 2]`"],
      answer: 1,
      why: "A forest is a list of trees. Each tree is a `Node`. Two roots means two elements of the list.",
    },
    {
      k: "predict",
      body: "Each child of a node can give you a number; you then add those numbers. This is the same idea as adding the lengths of some strings.",
      expr: `sum (map length ["a", "bb", ""])`,
      answer: "3",
      why: "The three children contribute 1, 2 and 0. Adding them gives 3. An empty child list would give `sum []`, which is 0.",
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Fill in `labelOf`, the value stored at the root of a tree.",
      starter: hs`labelOf :: Rose a -> a
labelOf (Node x _) = undefined
`,
      tests: [
        { expr: "labelOf solo", expected: "9" },
        { expr: "labelOf bush", expected: "1" },
        { expr: "labelOf twig", expected: "'k'" },
        { expr: "labelOf (Node True [])", expected: "True" },
      ],
      hint: "The pattern already names the label `x`. Use it.",
      solution: hs`labelOf :: Rose a -> a
labelOf (Node x _) = x
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Fill in `childrenOf`, the list of child trees. For a childless node that list is empty.",
      starter: hs`childrenOf :: Rose a -> [Rose a]
childrenOf (Node _ ts) = undefined
`,
      tests: [
        { expr: "childrenOf solo", expected: "[] :: [Rose Int]" },
        { expr: "length (childrenOf bush)", expected: "3" },
        { expr: "childrenOf (Node 0 [solo])", expected: "[Node 9 []]" },
        { expr: "length (childrenOf chain)", expected: "1" },
      ],
      hint: "The pattern already names the list `ts`.",
      solution: hs`childrenOf :: Rose a -> [Rose a]
childrenOf (Node _ ts) = ts
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Fill in `noKids`. It is `True` exactly when the node has no children.",
      starter: hs`noKids :: Rose a -> Bool
noKids (Node _ ts) = undefined
`,
      tests: [
        { expr: "noKids solo", expected: "True" },
        { expr: "noKids bush", expected: "False" },
        { expr: "noKids (Node 'z' [])", expected: "True" },
        { expr: "noKids chain", expected: "False" },
      ],
      hint: "`null ts`, or `ts == []`.",
      solution: hs`noKids :: Rose a -> Bool
noKids (Node _ ts) = null ts
`,
    },
    {
      k: "quiz",
      q: "Which of these is true of every value of type `Rose a`?",
      options: [
        "It has a `Leaf` constructor somewhere",
        "It has exactly two children",
        "It has at least one node (the root)",
        "It can hold no nodes at all",
      ],
      answer: 2,
      why: "There is only `Node`, so you cannot build an empty rose tree. Forests can be empty: `[]`. A single node is `Node x []`.",
    },
    {
      k: "predict",
      body: "A childless node counts as 1, plus the total from its children.",
      expr: "1 + sum []",
      answer: "1",
      why: "`sum []` is 0, so a node with no children has weight 1. That is why rose-tree recursion does not need a separate empty-tree case.",
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Fill in `weight`, the number of nodes in a tree. A childless node counts as 1.",
      starter: hs`weight :: Rose a -> Int
weight (Node _ ts) = undefined
`,
      tests: [
        { expr: "weight solo", expected: "1" },
        { expr: "weight bush", expected: "4" },
        { expr: "weight chain", expected: "4" },
        { expr: "weight twig", expected: "5" },
        { expr: "weight (Node 0 [solo, solo])", expected: "3" },
      ],
      hint: "`1 + sum (map weight ts)`. `map` walks the children; `sum` adds their weights.",
      solution: hs`weight :: Rose a -> Int
weight (Node _ ts) = 1 + sum (map weight ts)
`,
    },
    {
      k: "predict",
      body: "Height of a childless node will be 0. `foldr max 0` is a safe way to take a maximum that treats the empty list as 0.",
      expr: "foldr max 0 []",
      answer: "0",
      why: "`foldr max 0 []` is just the starting value 0. `maximum []` would crash.",
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Fill in `rise`, the height of a tree. A childless node has height 0. Any other node is 1 plus the tallest child.",
      starter: hs`rise :: Rose a -> Int
rise (Node _ []) = undefined
rise (Node _ ts) = undefined
`,
      tests: [
        { expr: "rise solo", expected: "0" },
        { expr: "rise bush", expected: "1" },
        { expr: "rise chain", expected: "3" },
        { expr: "rise twig", expected: "2" },
        { expr: "rise (Node 0 [solo, chain])", expected: "4" },
      ],
      hint: "The first equation is `0`. The second is `1 + maximum (map rise ts)`. The first equation makes sure `ts` is not empty.",
      solution: hs`rise :: Rose a -> Int
rise (Node _ []) = 0
rise (Node _ ts) = 1 + maximum (map rise ts)
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Fill in `totalInt`, the sum of every number stored in a `Rose Int`.",
      starter: hs`totalInt :: Rose Int -> Int
totalInt (Node x ts) = undefined
`,
      tests: [
        { expr: "totalInt solo", expected: "9" },
        { expr: "totalInt bush", expected: "10" },
        { expr: "totalInt chain", expected: "10" },
        { expr: "totalInt (Node 0 [])", expected: "0" },
        { expr: "totalInt (Node (-2) [Node 5 []])", expected: "3" },
      ],
      hint: "`x + sum (map totalInt ts)`.",
      solution: hs`totalInt :: Rose Int -> Int
totalInt (Node x ts) = x + sum (map totalInt ts)
`,
    },
    {
      k: "quiz",
      q: "You have already worked out an `Int` for every child, so you have a list `[Int]`. What turns that list into the total number of nodes in those children?",
      options: ["`concat`", "`sum`", "`map`", "`Node`"],
      answer: 1,
      why: "`map` is how you got the list. `sum` adds the integers. `concat` is for a list of lists, not a list of numbers.",
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Fill in `front`, which lists every label, the root first, then each child tree from left to right (pre-order).",
      starter: hs`front :: Rose a -> [a]
front (Node x ts) = undefined
`,
      tests: [
        { expr: "front solo", expected: "[9]" },
        { expr: "front bush", expected: "[1, 2, 3, 4]" },
        { expr: "front chain", expected: "[1, 2, 3, 4]" },
        { expr: "front twig", expected: `"kabdc"` },
      ],
      hint: "`x : concatMap front ts`. `concatMap` maps then joins the lists.",
      solution: hs`front :: Rose a -> [a]
front (Node x ts) = x : concatMap front ts
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Fill in `ends`, the labels of nodes with no children, left to right. Put the childless equation first.",
      starter: hs`ends :: Rose a -> [a]
ends (Node x []) = undefined
ends (Node _ ts) = undefined
`,
      tests: [
        { expr: "ends solo", expected: "[9]" },
        { expr: "ends bush", expected: "[2, 3, 4]" },
        { expr: "ends chain", expected: "[4]" },
        { expr: "ends twig", expected: `"adc"` },
        { expr: "ends (Node 1 [Node 2 [Node 3 []]])", expected: "[3]" },
      ],
      hint: "A childless node is `[x]`. Otherwise `concatMap ends ts` (the root has children, so it is not an end).",
      solution: hs`ends :: Rose a -> [a]
ends (Node x []) = [x]
ends (Node _ ts) = concatMap ends ts
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Fill in `kidLabels`, the labels of the **direct** children of the root, not looking any deeper.",
      starter: hs`kidLabels :: Rose a -> [a]
kidLabels (Node _ ts) = undefined
`,
      tests: [
        { expr: "kidLabels solo", expected: "[]" },
        { expr: "kidLabels bush", expected: "[2, 3, 4]" },
        { expr: "kidLabels chain", expected: "[2]" },
        { expr: "kidLabels twig", expected: `"abc"` },
      ],
      hint: "`[x | Node x _ <- ts]`, or `map` a tiny helper that takes the root label of each child.",
      solution: hs`kidLabels :: Rose a -> [a]
kidLabels (Node _ ts) = [x | Node x _ <- ts]
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Fill in `change`, which applies a function to every label and keeps the shape of the tree.",
      starter: hs`change :: (a -> b) -> Rose a -> Rose b
change f (Node x ts) = undefined
`,
      tests: [
        { expr: "change (+ 1) solo", expected: "Node 10 []" },
        { expr: "change (* 10) bush", expected: "Node 10 [Node 20 [], Node 30 [], Node 40 []]" },
        { expr: "change even chain", expected: "Node False [Node True [Node False [Node True []]]]" },
        { expr: "change id twig == twig", label: "id leaves the tree alone" },
      ],
      hint: "`Node (f x) (map (change f) ts)`. `change f` is the function you map over the children.",
      solution: hs`change :: (a -> b) -> Rose a -> Rose b
change f (Node x ts) = Node (f x) (map (change f) ts)
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Fill in `seen`, which is `True` when the given label appears anywhere in the tree.",
      starter: hs`seen :: Eq a => a -> Rose a -> Bool
seen x (Node y ts) = undefined
`,
      tests: [
        { expr: "seen 9 solo", expected: "True" },
        { expr: "seen 8 solo", expected: "False" },
        { expr: "seen 4 bush", expected: "True" },
        { expr: "seen 4 chain", expected: "True" },
        { expr: "seen 'd' twig", expected: "True" },
        { expr: "seen 'z' twig", expected: "False" },
      ],
      hint: "`x == y || or (map (seen x) ts)`. `or` is `True` if any child says `True`.",
      solution: hs`seen :: Eq a => a -> Rose a -> Bool
seen x (Node y ts) = x == y || or (map (seen x) ts)
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Fill in `fan`, the number of **direct** children of the root (not a recursive count).",
      starter: hs`fan :: Rose a -> Int
fan (Node _ ts) = undefined
`,
      tests: [
        { expr: "fan solo", expected: "0" },
        { expr: "fan bush", expected: "3" },
        { expr: "fan chain", expected: "1" },
        { expr: "fan twig", expected: "3" },
      ],
      hint: "`length ts`.",
      solution: hs`fan :: Rose a -> Int
fan (Node _ ts) = length ts
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Fill in `maxFan`, the largest number of direct children of **any** node in the tree.",
      starter: hs`maxFan :: Rose a -> Int
maxFan (Node _ ts) = undefined
`,
      tests: [
        { expr: "maxFan solo", expected: "0" },
        { expr: "maxFan bush", expected: "3" },
        { expr: "maxFan chain", expected: "1" },
        { expr: "maxFan twig", expected: "3" },
        { expr: "maxFan (Node 0 [chain, bush])", expected: "3" },
      ],
      hint: "`maximum (length ts : map maxFan ts)` puts this node's fan on the front, so the list is never empty.",
      solution: hs`maxFan :: Rose a -> Int
maxFan (Node _ ts) = maximum (length ts : map maxFan ts)
`,
    },
    {
      k: "quiz",
      q: "`data Entry = File String Int | Folder String [Entry]`. To count files, how many equations do you write?",
      options: [
        "One equation, because there is only one kind of recursion",
        "Two: one for `File` (that is 1) and one for `Folder` that maps over the list",
        "Three: one extra for the empty folder",
        "None: GHC counts them for you",
      ],
      answer: 1,
      why: "One equation per constructor. An empty folder is already `Folder n []`; `map` over `[]` gives `[]` and `sum` of that is 0.",
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Fill in `forestWeight`, the total number of nodes in every tree of a forest. The empty forest has weight 0.",
      starter: hs`forestWeight :: Forest a -> Int
forestWeight fs = undefined
`,
      tests: [
        { expr: "forestWeight ([] :: Forest Int)", expected: "0" },
        { expr: "forestWeight [solo]", expected: "1" },
        { expr: "forestWeight grove", expected: "9" },
        { expr: "forestWeight [bush, chain]", expected: "8" },
      ],
      hint: "A forest is a list. `sum (map weight fs)` once you have a helper `weight` on a single tree.",
      solution: hs`forestWeight :: Forest a -> Int
forestWeight fs = sum (map weight fs)
  where
    weight (Node _ ts) = 1 + sum (map weight ts)
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Fill in `topLabels`, the root label of every tree in a forest, left to right.",
      starter: hs`topLabels :: Forest a -> [a]
topLabels fs = undefined
`,
      tests: [
        { expr: "topLabels ([] :: Forest Int)", expected: "[]" },
        { expr: "topLabels [solo]", expected: "[9]" },
        { expr: "topLabels grove", expected: "[9, 1, 1]" },
        { expr: "topLabels [twig, Node 'z' []]", expected: `"kz"` },
      ],
      hint: "`[x | Node x _ <- fs]`.",
      solution: hs`topLabels :: Forest a -> [a]
topLabels fs = [x | Node x _ <- fs]
`,
    },
    {
      k: "write",
      setup: entrySetup,
      body: "Fill in `nFiles`. A `File` counts as 1. A `Folder` counts the files in every entry it contains.",
      starter: hs`nFiles :: Entry -> Int
nFiles (File _ _) = undefined
nFiles (Folder _ es) = undefined
`,
      tests: [
        { expr: `nFiles (File "z" 1)`, expected: "1" },
        { expr: `nFiles (Folder "empty" [])`, expected: "0" },
        { expr: "nFiles bag", expected: "2" },
        { expr: `nFiles (Folder "two" [File "a" 1, File "b" 1])`, expected: "2" },
        { expr: `nFiles (Folder "nest" [bag])`, expected: "2" },
      ],
      hint: "`nFiles (Folder _ es) = sum (map nFiles es)`.",
      solution: hs`nFiles :: Entry -> Int
nFiles (File _ _) = 1
nFiles (Folder _ es) = sum (map nFiles es)
`,
    },
    {
      k: "write",
      setup: markSetup,
      body: "Fill in `nTags`. A `Plain` has no tags. A `Tag` counts as 1, plus the tags inside its children.",
      starter: hs`nTags :: Markup -> Int
nTags (Plain _) = undefined
nTags (Tag _ ms) = undefined
`,
      tests: [
        { expr: `nTags (Plain "z")`, expected: "0" },
        { expr: `nTags (Tag "br" [])`, expected: "1" },
        { expr: "nTags bits", expected: "3" },
        { expr: "nTags page", expected: "5" },
      ],
      hint: "`nTags (Tag _ ms) = 1 + sum (map nTags ms)`.",
      solution: hs`nTags :: Markup -> Int
nTags (Plain _) = 0
nTags (Tag _ ms) = 1 + sum (map nTags ms)
`,
    },
    {
      k: "quiz",
      q: "In `weight (Node _ ts) = foldr (\\t n -> weight t + n) 1 ts`, what does `n` stand for?",
      options: [
        "The label of this node",
        "The number of children",
        "The total weight of the children to the right of `t`, plus 1 for this node",
        "Always 0",
      ],
      answer: 2,
      why: "`foldr` starts from 1 (this node) and, going right to left, adds each child's weight. When `ts` is `[]`, the answer is just 1.",
    },
    {
      k: "predict",
      body: "`foldr (++) []` on a list of lists is `concat`: it joins child results.",
      expr: `foldr (++) [] ["ha", "sk"]`,
      answer: `"hask"`,
      why: "\"ha\" ++ (\"sk\" ++ []) is \"hask\". That is the same pattern as joining the lists you get back from each child.",
    },
  ],
};

const level2: DrillSet = {
  id: "b-rose-l2",
  lesson: "",
  level: 2,
  title: "Level 2: Standard",
  intro: md(
    "One complete function from a plain description. Start with `Node x ts`, recurse on every child with `map` or `concatMap`, and combine.",
    "",
    "```",
    "matching p (Node x ts) = [x | p x] ++ concatMap (matching p) ts",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: "If `weight :: Rose a -> Int` and `ts :: [Rose a]`, what is the type of `map weight ts`?",
      options: ["`Int`", "`[Int]`", "`[Rose a]`", "`Rose Int`"],
      answer: 1,
      why: "`map` gives one result per child. Each result is an `Int`, so you get a list of Ints.",
    },
    {
      k: "quiz",
      q: "Which of these is a safe height for a node whose children list might be empty?",
      options: [
        "`1 + maximum (map height ts)`",
        "`foldr max 0 (map (\\t -> 1 + height t) ts)`",
        "`head (map height ts)`",
        "`maximum (map height ts)`",
      ],
      answer: 1,
      why: "`foldr max 0 []` is 0, so a childless node has height 0. `maximum` and `head` crash on `[]`.",
    },
    {
      k: "quiz",
      q: "A forest can be empty. What should `forestCount []` be, if it counts nodes?",
      options: ["1", "0", "It cannot be called", "Nothing"],
      answer: 1,
      why: "There are no trees, so there are no nodes. A rose tree itself cannot be empty, but a forest can.",
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `nodeCount`, the number of nodes in a rose tree.",
      starter: hs`nodeCount :: Rose a -> Int
nodeCount t = undefined
`,
      tests: [
        { expr: "nodeCount solo", expected: "1" },
        { expr: "nodeCount bush", expected: "4" },
        { expr: "nodeCount chain", expected: "4" },
        { expr: "nodeCount twig", expected: "5" },
        { expr: "nodeCount (Node 0 [bush, solo])", expected: "6" },
      ],
      hint: "`nodeCount (Node _ ts) = 1 + sum (map nodeCount ts)`.",
      solution: hs`nodeCount :: Rose a -> Int
nodeCount (Node _ ts) = 1 + sum (map nodeCount ts)
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `height`. A childless node has height 0; any other node is 1 plus the height of its tallest child.",
      starter: hs`height :: Rose a -> Int
height t = undefined
`,
      tests: [
        { expr: "height solo", expected: "0" },
        { expr: "height bush", expected: "1" },
        { expr: "height chain", expected: "3" },
        { expr: "height twig", expected: "2" },
        { expr: "height (Node True [Node False []])", expected: "1" },
      ],
      hint: "Either two equations (`[]` first), or `foldr max 0 (map (\\t -> 1 + height t) ts)`.",
      solution: hs`height :: Rose a -> Int
height (Node _ []) = 0
height (Node _ ts) = 1 + maximum (map height ts)
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `labelSum`, the total of every `Int` stored in the tree.",
      starter: hs`labelSum :: Rose Int -> Int
labelSum t = undefined
`,
      tests: [
        { expr: "labelSum solo", expected: "9" },
        { expr: "labelSum bush", expected: "10" },
        { expr: "labelSum (Node 0 [])", expected: "0" },
        { expr: "labelSum (Node (-1) [Node (-2) [Node 3 []]])", expected: "0" },
        { expr: "labelSum chain", expected: "10" },
      ],
      hint: "`labelSum (Node x ts) = x + sum (map labelSum ts)`.",
      solution: hs`labelSum :: Rose Int -> Int
labelSum (Node x ts) = x + sum (map labelSum ts)
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `roseMap f t`, which applies `f` to every label and keeps the shape.",
      starter: hs`roseMap :: (a -> b) -> Rose a -> Rose b
roseMap f t = undefined
`,
      tests: [
        { expr: "roseMap (+ 1) solo", expected: "Node 10 []" },
        { expr: "roseMap (* 2) bush", expected: "Node 2 [Node 4 [], Node 6 [], Node 8 []]" },
        { expr: "roseMap even chain", expected: "Node False [Node True [Node False [Node True []]]]" },
        { expr: "roseMap id twig == twig", label: "mapping id does nothing" },
      ],
      hint: "`roseMap f (Node x ts) = Node (f x) (map (roseMap f) ts)`.",
      solution: hs`roseMap :: (a -> b) -> Rose a -> Rose b
roseMap f (Node x ts) = Node (f x) (map (roseMap f) ts)
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `matching p t`, the labels for which `p` is `True`, in pre-order (root, then children left to right).",
      starter: hs`matching :: (a -> Bool) -> Rose a -> [a]
matching p t = undefined
`,
      tests: [
        { expr: "matching even solo", expected: "[]" },
        { expr: "matching odd solo", expected: "[9]" },
        { expr: "matching even bush", expected: "[2, 4]" },
        { expr: "matching even chain", expected: "[2, 4]" },
        { expr: "matching (>= 'c') twig", expected: `"kdc"` },
      ],
      hint: "`[x | p x] ++ concatMap (matching p) ts`.",
      solution: hs`matching :: (a -> Bool) -> Rose a -> [a]
matching p (Node x ts) = [x | p x] ++ concatMap (matching p) ts
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: md(
        "Write `foldRose f t`. It turns a tree into a single value: at a node with label `x` and child results `rs`, the answer is `f x rs`.",
        "",
        "```",
        "foldRose (\\x _ -> x)          t   ==  the root label",
        "foldRose (\\_ rs -> 1 + sum rs) t   ==  the number of nodes",
        "```",
      ),
      starter: hs`foldRose :: (a -> [b] -> b) -> Rose a -> b
foldRose f t = undefined
`,
      tests: [
        { expr: "foldRose (\\x _ -> x) solo", expected: "9" },
        { expr: "foldRose (\\_ rs -> 1 + sum rs) bush", expected: "4" },
        { expr: "foldRose (\\x rs -> x + sum rs) chain", expected: "10" },
        { expr: "foldRose (\\x rs -> x : concat rs) twig", expected: `"kabdc"` },
        { expr: "foldRose (\\_ hs -> foldr max 0 (map (1 +) hs)) solo", expected: "0" },
        { expr: "foldRose (\\_ hs -> foldr max 0 (map (1 +) hs)) chain", expected: "3" },
      ],
      hint: "`foldRose f (Node x ts) = f x (map (foldRose f) ts)`.",
      solution: hs`foldRose :: (a -> [b] -> b) -> Rose a -> b
foldRose f (Node x ts) = f x (map (foldRose f) ts)
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `preorder`, listing the root label and then each child tree from left to right.",
      starter: hs`preorder :: Rose a -> [a]
preorder t = undefined
`,
      tests: [
        { expr: "preorder solo", expected: "[9]" },
        { expr: "preorder bush", expected: "[1, 2, 3, 4]" },
        { expr: "preorder chain", expected: "[1, 2, 3, 4]" },
        { expr: "preorder twig", expected: `"kabdc"` },
      ],
      hint: "`x : concatMap preorder ts`.",
      solution: hs`preorder :: Rose a -> [a]
preorder (Node x ts) = x : concatMap preorder ts
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `postorder`, listing every child tree first (left to right) and the root label last.",
      starter: hs`postorder :: Rose a -> [a]
postorder t = undefined
`,
      tests: [
        { expr: "postorder solo", expected: "[9]" },
        { expr: "postorder bush", expected: "[2, 3, 4, 1]" },
        { expr: "postorder chain", expected: "[4, 3, 2, 1]" },
        { expr: "postorder twig", expected: `"adbck"` },
      ],
      hint: "`concatMap postorder ts ++ [x]`.",
      solution: hs`postorder :: Rose a -> [a]
postorder (Node x ts) = concatMap postorder ts ++ [x]
`,
    },
    {
      k: "quiz",
      q: "You want the path of labels from the root to a node whose label is `x`. If the root itself holds `x`, what is the path?",
      options: ["`[]`", "`[x]`", "`Nothing`", "The paths of all the children"],
      answer: 1,
      why: "You have already arrived. The path is the singleton list of this label.",
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `hasLabel x t`, `True` when `x` appears anywhere in the tree.",
      starter: hs`hasLabel :: Eq a => a -> Rose a -> Bool
hasLabel x t = undefined
`,
      tests: [
        { expr: "hasLabel 9 solo", expected: "True" },
        { expr: "hasLabel 0 solo", expected: "False" },
        { expr: "hasLabel 3 bush", expected: "True" },
        { expr: "hasLabel 4 chain", expected: "True" },
        { expr: "hasLabel 'z' twig", expected: "False" },
      ],
      hint: "The root matches, or any child does: `x == y || any (hasLabel x) ts`.",
      solution: hs`hasLabel :: Eq a => a -> Rose a -> Bool
hasLabel x (Node y ts) = x == y || any (hasLabel x) ts
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `firstHit p t`, the first label in pre-order for which `p` is `True`, or `Nothing` if there isn't one.",
      starter: hs`firstHit :: (a -> Bool) -> Rose a -> Maybe a
firstHit p t = undefined
`,
      tests: [
        { expr: "firstHit even solo", expected: "Nothing" },
        { expr: "firstHit odd solo", expected: "Just 9" },
        { expr: "firstHit even bush", expected: "Just 2" },
        { expr: "firstHit (> 3) chain", expected: "Just 4" },
        { expr: "firstHit (== 'c') twig", expected: "Just 'c'" },
        { expr: "firstHit (== 'z') twig", expected: "Nothing" },
      ],
      hint: "If `p x` then `Just x`. Otherwise look through the children left to right and take the first `Just`.",
      solution: hs`firstHit :: (a -> Bool) -> Rose a -> Maybe a
firstHit p (Node x ts)
  | p x       = Just x
  | otherwise = firstJust (map (firstHit p) ts)
  where
    firstJust [] = Nothing
    firstJust (Just y : _) = Just y
    firstJust (Nothing : ms) = firstJust ms
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `pathTo x t`, the labels from the root down to the first node holding `x` (children left to right). Give `Nothing` if `x` is not there.",
      starter: hs`pathTo :: Eq a => a -> Rose a -> Maybe [a]
pathTo x t = undefined
`,
      tests: [
        { expr: "pathTo 9 solo", expected: "Just [9]" },
        { expr: "pathTo 0 solo", expected: "Nothing" },
        { expr: "pathTo 3 bush", expected: "Just [1, 3]" },
        { expr: "pathTo 4 chain", expected: "Just [1, 2, 3, 4]" },
        { expr: "pathTo 'd' twig", expected: `Just "kbd"` },
        { expr: "pathTo 'z' twig", expected: "Nothing" },
      ],
      hint: "If the root is `x`, give `Just [x]`. Otherwise try each child; if one returns `Just p`, give `Just (y : p)`.",
      solution: hs`pathTo :: Eq a => a -> Rose a -> Maybe [a]
pathTo x (Node y ts)
  | x == y    = Just [y]
  | otherwise = case firstJust (map (pathTo x) ts) of
      Just p  -> Just (y : p)
      Nothing -> Nothing
  where
    firstJust [] = Nothing
    firstJust (Just a : _) = Just a
    firstJust (Nothing : ms) = firstJust ms
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `layer n t`, the labels exactly `n` steps below the root, left to right. The root is layer 0.",
      starter: hs`layer :: Int -> Rose a -> [a]
layer n t = undefined
`,
      tests: [
        { expr: "layer 0 solo", expected: "[9]" },
        { expr: "layer 1 solo", expected: "[]" },
        { expr: "layer 1 bush", expected: "[2, 3, 4]" },
        { expr: "layer 2 chain", expected: "[3]" },
        { expr: "layer 0 twig", expected: `"k"` },
        { expr: "layer 1 twig", expected: `"abc"` },
        { expr: "layer 2 twig", expected: `"d"` },
        { expr: "layer 5 twig", expected: `""` },
      ],
      hint: "`layer 0 (Node x _) = [x]`. Otherwise `concatMap (layer (n - 1)) ts`.",
      solution: hs`layer :: Int -> Rose a -> [a]
layer 0 (Node x _) = [x]
layer n (Node _ ts) = concatMap (layer (n - 1)) ts
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `maxBranch`, the largest number of direct children of any node in the tree.",
      starter: hs`maxBranch :: Rose a -> Int
maxBranch t = undefined
`,
      tests: [
        { expr: "maxBranch solo", expected: "0" },
        { expr: "maxBranch bush", expected: "3" },
        { expr: "maxBranch chain", expected: "1" },
        { expr: "maxBranch twig", expected: "3" },
        { expr: "maxBranch (Node 0 [solo, bush])", expected: "3" },
      ],
      hint: "`maximum (length ts : map maxBranch ts)`.",
      solution: hs`maxBranch :: Rose a -> Int
maxBranch (Node _ ts) = maximum (length ts : map maxBranch ts)
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `edges`, the number of parent-to-child links in the tree. A childless node has 0 edges.",
      starter: hs`edges :: Rose a -> Int
edges t = undefined
`,
      tests: [
        { expr: "edges solo", expected: "0" },
        { expr: "edges bush", expected: "3" },
        { expr: "edges chain", expected: "3" },
        { expr: "edges twig", expected: "4" },
        { expr: "edges (Node 0 [solo, solo])", expected: "2" },
      ],
      hint: "`length ts + sum (map edges ts)`. Each child is one edge, plus the edges inside the children.",
      solution: hs`edges :: Rose a -> Int
edges (Node _ ts) = length ts + sum (map edges ts)
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `forestCount`, the total number of nodes in a forest.",
      starter: hs`forestCount :: Forest a -> Int
forestCount fs = undefined
`,
      tests: [
        { expr: "forestCount ([] :: Forest Int)", expected: "0" },
        { expr: "forestCount [solo]", expected: "1" },
        { expr: "forestCount grove", expected: "9" },
        { expr: "forestCount [twig]", expected: "5" },
      ],
      hint: "`sum (map nodeCount fs)` with a helper that counts one tree.",
      solution: hs`forestCount :: Forest a -> Int
forestCount fs = sum (map nodeCount fs)
  where
    nodeCount (Node _ ts) = 1 + sum (map nodeCount ts)
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `forestMap f fs`, which maps `f` over every label in every tree of a forest.",
      starter: hs`forestMap :: (a -> b) -> Forest a -> Forest b
forestMap f fs = undefined
`,
      tests: [
        { expr: "forestMap (+ 1) ([] :: Forest Int)", expected: "[]" },
        { expr: "forestMap (* 2) [solo]", expected: "[Node 18 []]" },
        { expr: "forestMap even [bush]", expected: "[Node False [Node True [], Node False [], Node True []]]" },
        { expr: "forestMap id grove == grove", label: "id on a forest" },
      ],
      hint: "`map` a tree-map over the forest. The tree-map is `Node (f x) (map (go f) ts)`.",
      solution: hs`forestMap :: (a -> b) -> Forest a -> Forest b
forestMap f fs = map (go f) fs
  where
    go g (Node x ts) = Node (g x) (map (go g) ts)
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: md(
        "Write `keepKids p t`. Keep this node. Recurse into each child, but **drop** a child (and its whole subtree) when that child's own root label fails `p`.",
        "",
        "```",
        "keepKids even (Node 1 [Node 2 [Node 4 []], Node 3 [Node 6 []]])",
        "  == Node 1 [Node 2 [Node 4 []]]",
        "```",
      ),
      starter: hs`keepKids :: (a -> Bool) -> Rose a -> Rose a
keepKids p t = undefined
`,
      tests: [
        { expr: "keepKids even solo", expected: "Node 9 []" },
        { expr: "keepKids even bush", expected: "Node 1 [Node 2 [], Node 4 []]" },
        { expr: "keepKids odd chain", expected: "Node 1 []" },
        { expr: "keepKids (/= 'b') twig", expected: "Node 'k' [Node 'a' [], Node 'c' []]" },
        { expr: "keepKids even (Node 1 [Node 2 [Node 4 []], Node 3 [Node 6 []]])", expected: "Node 1 [Node 2 [Node 4 []]]" },
      ],
      hint: "`Node x [keepKids p t | t@(Node y _) <- ts, p y]`.",
      solution: hs`keepKids :: (a -> Bool) -> Rose a -> Rose a
keepKids p (Node x ts) = Node x [keepKids p t | t@(Node y _) <- ts, p y]
`,
    },
    {
      k: "quiz",
      q: "`data Markup = Plain String | Tag String [Markup]`. The children of a `Tag` are a forest of `Markup`. What is `Tag \"br\" []`?",
      options: [
        "A syntax error",
        "A tag with an empty child forest: an empty element",
        "The same as `Plain \"br\"`",
        "A tag that contains one empty string",
      ],
      answer: 1,
      why: "The list of children can be empty. That is an element with no content, like `<br>`.",
    },
    {
      k: "write",
      setup: fsSetup,
      body: "Write `totalBytes`. A `File` contributes its size. A `Folder` is the total of everything inside it. An empty folder is 0.",
      starter: hs`totalBytes :: FS -> Int
totalBytes fs = undefined
`,
      tests: [
        { expr: `totalBytes (File "z" 7)`, expected: "7" },
        { expr: `totalBytes (Folder "empty" [])`, expected: "0" },
        { expr: "totalBytes desk", expected: "240" },
        { expr: `totalBytes (Folder "src" [File "Main.hs" 120, File "Lib.hs" 80])`, expected: "200" },
        { expr: `totalBytes (Folder "wrap" [desk])`, expected: "240" },
      ],
      hint: "`totalBytes (Folder _ items) = sum (map totalBytes items)`.",
      solution: hs`totalBytes :: FS -> Int
totalBytes (File _ n) = n
totalBytes (Folder _ items) = sum (map totalBytes items)
`,
    },
    {
      k: "write",
      setup: fsSetup,
      body: "Write `fileNames`, the names of every file, left to right, at any depth. Folder names are not included.",
      starter: hs`fileNames :: FS -> [String]
fileNames fs = undefined
`,
      tests: [
        { expr: `fileNames (File "z.txt" 1)`, expected: `["z.txt"]` },
        { expr: `fileNames (Folder "empty" [])`, expected: "[]" },
        { expr: "fileNames desk", expected: `["readme.txt", "Main.hs", "Lib.hs"]` },
        { expr: `fileNames (Folder "a" [Folder "b" [File "c" 1]])`, expected: `["c"]` },
      ],
      hint: "`fileNames (Folder _ items) = concatMap fileNames items`.",
      solution: hs`fileNames :: FS -> [String]
fileNames (File n _) = [n]
fileNames (Folder _ items) = concatMap fileNames items
`,
    },
    {
      k: "write",
      setup: markSetup,
      body: "Write `allPlain`, every `Plain` string in a markup value, joined left to right.",
      starter: hs`allPlain :: Markup -> String
allPlain m = undefined
`,
      tests: [
        { expr: `allPlain (Plain "z")`, expected: `"z"` },
        { expr: `allPlain (Tag "br" [])`, expected: `""` },
        { expr: "allPlain bits", expected: `"ab!"` },
        { expr: "allPlain page", expected: `"Hixy!"` },
      ],
      hint: "`allPlain (Plain s) = s` and `allPlain (Tag _ ms) = concatMap allPlain ms`.",
      solution: hs`allPlain :: Markup -> String
allPlain (Plain s) = s
allPlain (Tag _ ms) = concatMap allPlain ms
`,
    },
    {
      k: "quiz",
      q: "`data Stmt = Set String Expr | Block [Stmt] | If Expr Stmt Stmt`. Why do you usually write two functions, one on `Stmt` and one on `[Stmt]`?",
      options: [
        "Haskell forbids recursion on data types",
        "A block is a forest of statements: the list function maps, the statement function has one equation per constructor, and they call each other",
        "You need one function per constructor name",
        "Because `If` has type `[Stmt]`",
      ],
      answer: 1,
      why: "Mutual recursion: the list is a forest, the data type is the tree. Each calls the other.",
    },
    {
      k: "write",
      setup: langSetup,
      body: "Write `countSets`, the number of `Set` constructors anywhere in a statement, including both branches of an `If` and everything inside a `Block`.",
      starter: hs`countSets :: Stmt -> Int
countSets s = undefined
`,
      tests: [
        { expr: `countSets (Set "x" (Lit 1))`, expected: "1" },
        { expr: "countSets (Block [])", expected: "0" },
        { expr: "countSets prog", expected: "4" },
        { expr: `countSets (If (Lit 0) (Block [Set "a" (Lit 1), Set "b" (Lit 2)]) (Set "c" (Lit 3)))`, expected: "3" },
        { expr: `countSets (Block [Block [Set "z" (Lit 0)]])`, expected: "1" },
      ],
      hint: "`countSets (Block ss) = sum (map countSets ss)`. An `If` adds both branches.",
      solution: hs`countSets :: Stmt -> Int
countSets (Set _ _) = 1
countSets (Block ss) = sum (map countSets ss)
countSets (If _ a b) = countSets a + countSets b
`,
    },
    {
      k: "write",
      setup: plusSetup,
      body: md(
        "`Plus` takes a forest of expressions (any number of children, including none). Write `evalExpr`.",
        "",
        "- `Lit n` is `n`.",
        "- `Plus es` is the sum of the values of `es`. `Plus []` is 0.",
      ),
      starter: hs`evalExpr :: Expr -> Int
evalExpr e = undefined
`,
      tests: [
        { expr: "evalExpr (Lit 4)", expected: "4" },
        { expr: "evalExpr (Plus [])", expected: "0" },
        { expr: "evalExpr (Plus [Lit 1, Lit 2, Lit 3])", expected: "6" },
        { expr: "evalExpr (Plus [Plus [Lit 1, Lit 1], Lit 2])", expected: "4" },
        { expr: "evalExpr (Plus [Lit (-5), Plus []])", expected: "-5" },
      ],
      hint: "`evalExpr (Plus es) = sum (map evalExpr es)`.",
      solution: hs`evalExpr :: Expr -> Int
evalExpr (Lit n) = n
evalExpr (Plus es) = sum (map evalExpr es)
`,
    },
    {
      k: "quiz",
      q: "What is a good type for a fold over `Rose a`, where each node sees its label and the list of already-folded children?",
      options: [
        "`(a -> a) -> Rose a -> a`",
        "`(a -> [b] -> b) -> Rose a -> b`",
        "`(b -> a -> b) -> b -> Rose a -> b`",
        "`Rose a -> a`",
      ],
      answer: 1,
      why: "`f x rs` combines the label `x` with the child results `rs`. That is `foldRose`.",
    },
    {
      k: "quiz",
      q: "You want only the labels that pass a test. Which plan is that?",
      options: [
        "Rebuild a tree of the same shape, applying the test as a function (`roseMap`)",
        "Walk the tree and collect a list (`matching`)",
        "Drop child trees whose root fails the test (`keepKids`)",
        "Take the `maximum` of the children",
      ],
      answer: 1,
      why: "Collecting is a list. Rebuilding keeps every node. Dropping children changes the shape. Those are three different functions.",
    },
  ],
};

const level3: DrillSet = {
  id: "b-rose-l3",
  lesson: "",
  level: 3,
  title: "Level 3: Stretch",
  intro: md(
    "Paths, layers, and rebuilding. A **label path** is the names from the root down. An **index path** is the child numbers, starting at 0: `[1, 0]` means the second child, then that child's first child.",
    "",
    "```",
    "follow []     t            = Just t",
    "follow (i:is) (Node _ ts) = pick i ts >>= follow is",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: "In a rose tree, the index path `[1, 0]` means:",
      options: [
        "The root, then its first child",
        "The second child of the root, then that child's first child",
        "The labels 1 and 0",
        "A tree with two nodes",
      ],
      answer: 1,
      why: "Positions count from 0, so 1 is the second child. Then 0 is that child's first child.",
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `allPaths`, every path of labels from the root to a node of the tree, root path first, then children left to right. Include the path that is just the root.",
      starter: hs`allPaths :: Rose a -> [[a]]
allPaths t = undefined
`,
      tests: [
        { expr: "allPaths solo", expected: "[[9]]" },
        { expr: "allPaths bush", expected: "[[1], [1, 2], [1, 3], [1, 4]]" },
        { expr: "allPaths chain", expected: "[[1], [1, 2], [1, 2, 3], [1, 2, 3, 4]]" },
        { expr: "allPaths twig", expected: `["k", "ka", "kb", "kbd", "kc"]` },
      ],
      hint: "`[x] : [x : p | t <- ts, p <- allPaths t]`.",
      solution: hs`allPaths :: Rose a -> [[a]]
allPaths (Node x ts) = [x] : [x : p | t <- ts, p <- allPaths t]
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `tipPaths`, the paths of labels from the root down to every childless node, left to right.",
      starter: hs`tipPaths :: Rose a -> [[a]]
tipPaths t = undefined
`,
      tests: [
        { expr: "tipPaths solo", expected: "[[9]]" },
        { expr: "tipPaths bush", expected: "[[1, 2], [1, 3], [1, 4]]" },
        { expr: "tipPaths chain", expected: "[[1, 2, 3, 4]]" },
        { expr: "tipPaths twig", expected: `["ka", "kbd", "kc"]` },
      ],
      hint: "Childless: `[[x]]`. Otherwise `[x : p | t <- ts, p <- tipPaths t]`.",
      solution: hs`tipPaths :: Rose a -> [[a]]
tipPaths (Node x []) = [[x]]
tipPaths (Node x ts) = [x : p | t <- ts, p <- tipPaths t]
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `follow is t`, the subtree you reach by taking the given child indices from the root. `[]` is the tree itself. Give `Nothing` if an index is out of range.",
      starter: hs`follow :: [Int] -> Rose a -> Maybe (Rose a)
follow is t = undefined
`,
      tests: [
        { expr: "follow [] solo", expected: "Just (Node 9 [])" },
        { expr: "follow [0] solo", expected: "Nothing" },
        { expr: "follow [1] bush", expected: "Just (Node 3 [])" },
        { expr: "follow [0, 0, 0] chain", expected: "Just (Node 4 [])" },
        { expr: "follow [1, 0] twig", expected: "Just (Node 'd' [])" },
        { expr: "follow [3] twig", expected: "Nothing" },
        { expr: "follow [1, 1] twig", expected: "Nothing" },
      ],
      hint: "Write `pick i ts` that walks the list. `follow [] t = Just t`.",
      solution: hs`follow :: [Int] -> Rose a -> Maybe (Rose a)
follow [] t = Just t
follow (i : is) (Node _ ts) = case pick i ts of
  Just t  -> follow is t
  Nothing -> Nothing
  where
    pick 0 (t : _) = Just t
    pick n (_ : rest) = pick (n - 1) rest
    pick _ [] = Nothing
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `levels t`, a list of layers: layer 0 (just the root), then layer 1, and so on, until there are no more nodes. Each layer is left to right.",
      starter: hs`levels :: Rose a -> [[a]]
levels t = undefined
`,
      tests: [
        { expr: "levels solo", expected: "[[9]]" },
        { expr: "levels bush", expected: "[[1], [2, 3, 4]]" },
        { expr: "levels chain", expected: "[[1], [2], [3], [4]]" },
        { expr: "levels twig", expected: `["k", "abc", "d"]` },
      ],
      hint: "Walk a forest of 'nodes at this layer': their labels, then their children as the next forest.",
      solution: hs`levels :: Rose a -> [[a]]
levels t = go [t]
  where
    go [] = []
    go ts = [x | Node x _ <- ts] : go [c | Node _ cs <- ts, c <- cs]
`,
    },
    {
      k: "quiz",
      q: "You zip two rose trees node by node. When must the answer be `Nothing`?",
      options: [
        "When the labels are different",
        "When some node has a different number of children on the two sides",
        "When one tree is taller",
        "Never: you can always zip",
      ],
      answer: 1,
      why: "The shapes have to match at every node. Different labels are fine; different branching is not.",
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `zipRose f t u`. If the two trees have the same shape, pair the labels with `f`. If any node has a different number of children, give `Nothing`.",
      starter: hs`zipRose :: (a -> b -> c) -> Rose a -> Rose b -> Maybe (Rose c)
zipRose f t u = undefined
`,
      tests: [
        { expr: "zipRose (+) solo solo", expected: "Just (Node 18 [])" },
        { expr: "zipRose (+) bush (Node 0 [Node 0 [], Node 0 [], Node 0 []])", expected: "Just (Node 1 [Node 2 [], Node 3 [], Node 4 []])" },
        { expr: "zipRose (,) bush chain", expected: "Nothing" },
        { expr: "zipRose (,) solo bush", expected: "Nothing" },
        { expr: "zipRose (\\x y -> (x, y)) twig twig", expected: "Just (Node ('k', 'k') [Node ('a', 'a') [], Node ('b', 'b') [Node ('d', 'd') []], Node ('c', 'c') []])" },
      ],
      hint: "Check `length` of the two child lists. Then `sequence (zipWith (zipRose f) xs ys)` and wrap with `Node (f x y)`.",
      solution: hs`zipRose :: (a -> b -> c) -> Rose a -> Rose b -> Maybe (Rose c)
zipRose f (Node x xs) (Node y ys)
  | length xs /= length ys = Nothing
  | otherwise = case sequence (zipWith (zipRose f) xs ys) of
      Just zs -> Just (Node (f x y) zs)
      Nothing -> Nothing
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `sameShape`, `True` when two trees have the same branching everywhere (labels may differ).",
      starter: hs`sameShape :: Rose a -> Rose b -> Bool
sameShape t u = undefined
`,
      tests: [
        { expr: "sameShape solo (Node True [])", expected: "True" },
        { expr: "sameShape bush chain", expected: "False" },
        { expr: "sameShape bush (Node 'x' [Node 'y' [], Node 'z' [], Node 'w' []])", expected: "True" },
        { expr: "sameShape twig twig", expected: "True" },
        { expr: "sameShape twig bush", expected: "False" },
      ],
      hint: "`length xs == length ys && and (zipWith sameShape xs ys)`.",
      solution: hs`sameShape :: Rose a -> Rose b -> Bool
sameShape (Node _ xs) (Node _ ys) =
  length xs == length ys && and (zipWith sameShape xs ys)
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `grow y t`, which adds a childless child labelled `y` under every current childless node. Other nodes keep their children, grown in the same way.",
      starter: hs`grow :: a -> Rose a -> Rose a
grow y t = undefined
`,
      tests: [
        { expr: "grow 0 solo", expected: "Node 9 [Node 0 []]" },
        { expr: "grow 0 bush", expected: "Node 1 [Node 2 [Node 0 []], Node 3 [Node 0 []], Node 4 [Node 0 []]]" },
        { expr: "grow 0 chain", expected: "Node 1 [Node 2 [Node 3 [Node 4 [Node 0 []]]]]" },
        { expr: "grow 'z' twig", expected: "Node 'k' [Node 'a' [Node 'z' []], Node 'b' [Node 'd' [Node 'z' []]], Node 'c' [Node 'z' []]]" },
      ],
      hint: "`grow y (Node x []) = Node x [Node y []]`. Otherwise map `grow y` over the children.",
      solution: hs`grow :: a -> Rose a -> Rose a
grow y (Node x []) = Node x [Node y []]
grow y (Node x ts) = Node x (map (grow y) ts)
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `cutBelow n t`. Keep nodes at depth `n` (root is 0) but drop all of their children. Depths above `n` are unchanged.",
      starter: hs`cutBelow :: Int -> Rose a -> Rose a
cutBelow n t = undefined
`,
      tests: [
        { expr: "cutBelow 0 solo", expected: "Node 9 []" },
        { expr: "cutBelow 0 bush", expected: "Node 1 []" },
        { expr: "cutBelow 1 bush", expected: "Node 1 [Node 2 [], Node 3 [], Node 4 []]" },
        { expr: "cutBelow 1 chain", expected: "Node 1 [Node 2 []]" },
        { expr: "cutBelow 1 twig", expected: "Node 'k' [Node 'a' [], Node 'b' [], Node 'c' []]" },
        { expr: "cutBelow 2 twig", expected: "twig" },
      ],
      hint: "`cutBelow 0 (Node x _) = Node x []`. Otherwise map `cutBelow (n - 1)` over the children.",
      solution: hs`cutBelow :: Int -> Rose a -> Rose a
cutBelow 0 (Node x _) = Node x []
cutBelow n (Node x ts) = Node x (map (cutBelow (n - 1)) ts)
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `indexPath x t`, the child-index path from the root to the first node labelled `x`. The root itself is `Just []`. Give `Nothing` if `x` is missing.",
      starter: hs`indexPath :: Eq a => a -> Rose a -> Maybe [Int]
indexPath x t = undefined
`,
      tests: [
        { expr: "indexPath 9 solo", expected: "Just []" },
        { expr: "indexPath 0 solo", expected: "Nothing" },
        { expr: "indexPath 3 bush", expected: "Just [1]" },
        { expr: "indexPath 4 chain", expected: "Just [0, 0, 0]" },
        { expr: "indexPath 'd' twig", expected: "Just [1, 0]" },
        { expr: "indexPath 'c' twig", expected: "Just [2]" },
      ],
      hint: "If the root matches, `Just []`. Otherwise search the children with a counter `i`, and put `i :` on the front of whatever you find.",
      solution: hs`indexPath :: Eq a => a -> Rose a -> Maybe [Int]
indexPath x (Node y ts)
  | x == y    = Just []
  | otherwise = search 0 ts
  where
    search _ [] = Nothing
    search i (t : rest) = case indexPath x t of
      Just p  -> Just (i : p)
      Nothing -> search (i + 1) rest
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `ancestors x t`, the labels from the root down to the **parent** of the first `x`. If `x` is the root, give `[]`. If `x` is missing, give `Nothing`.",
      starter: hs`ancestors :: Eq a => a -> Rose a -> Maybe [a]
ancestors x t = undefined
`,
      tests: [
        { expr: "ancestors 9 solo", expected: "Just []" },
        { expr: "ancestors 0 solo", expected: "Nothing" },
        { expr: "ancestors 3 bush", expected: "Just [1]" },
        { expr: "ancestors 4 chain", expected: "Just [1, 2, 3]" },
        { expr: "ancestors 'd' twig", expected: `Just "kb"` },
        { expr: "ancestors 'k' twig", expected: `Just ""` },
      ],
      hint: "Find the full path of labels (including `x`) and drop the last name. `init` is safe once you know the path is non-empty.",
      solution: hs`ancestors :: Eq a => a -> Rose a -> Maybe [a]
ancestors x t = fmap init (pathTo x t)
  where
    pathTo z (Node y ts)
      | z == y    = Just [y]
      | otherwise = case firstJust (map (pathTo z) ts) of
          Just p  -> Just (y : p)
          Nothing -> Nothing
    firstJust [] = Nothing
    firstJust (Just a : _) = Just a
    firstJust (Nothing : ms) = firstJust ms
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `longest`, the number of nodes on the longest root-to-tip path. A childless node is 1.",
      starter: hs`longest :: Rose a -> Int
longest t = undefined
`,
      tests: [
        { expr: "longest solo", expected: "1" },
        { expr: "longest bush", expected: "2" },
        { expr: "longest chain", expected: "4" },
        { expr: "longest twig", expected: "3" },
        { expr: "longest (Node 0 [solo, chain])", expected: "5" },
      ],
      hint: "This is 1 plus the height (height of a tip is 0). Or `1 + foldr max 0 (map longest ts)` wait: `1 + maximum` of children's longest, with 0 when there are no children: `foldr max 1 (map (1 +) ...)` — simplest: `1 + height`.",
      solution: hs`longest :: Rose a -> Int
longest (Node _ ts) = 1 + foldr max 0 (map longest ts)
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `countLayer n t`, how many nodes sit exactly `n` steps below the root.",
      starter: hs`countLayer :: Int -> Rose a -> Int
countLayer n t = undefined
`,
      tests: [
        { expr: "countLayer 0 solo", expected: "1" },
        { expr: "countLayer 1 solo", expected: "0" },
        { expr: "countLayer 1 bush", expected: "3" },
        { expr: "countLayer 2 chain", expected: "1" },
        { expr: "countLayer 1 twig", expected: "3" },
        { expr: "countLayer 2 twig", expected: "1" },
      ],
      hint: "`length` of that layer, or `countLayer 0 _ = 1` and otherwise sum the counts from the children.",
      solution: hs`countLayer :: Int -> Rose a -> Int
countLayer 0 _ = 1
countLayer n (Node _ ts) = sum (map (countLayer (n - 1)) ts)
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `foldWeight`, the number of nodes, using `foldr` over the children. Do not use `sum`, `map` or `concatMap`.",
      starter: hs`foldWeight :: Rose a -> Int
foldWeight t = undefined
`,
      banned: ["sum", "map", "concatMap", "fmap"],
      tests: [
        { expr: "foldWeight solo", expected: "1" },
        { expr: "foldWeight bush", expected: "4" },
        { expr: "foldWeight chain", expected: "4" },
        { expr: "foldWeight twig", expected: "5" },
      ],
      hint: "`foldr (\\t n -> foldWeight t + n) 1 ts`. The 1 is this node; each child adds its weight.",
      solution: hs`foldWeight :: Rose a -> Int
foldWeight (Node _ ts) = foldr (\t n -> foldWeight t + n) 1 ts
`,
    },
    {
      k: "quiz",
      q: "`Block []` is a statement whose child forest is empty. What should `countSets (Block [])` be?",
      options: ["1", "0", "It crashes", "Nothing"],
      answer: 1,
      why: "There are no `Set`s inside an empty block. `sum (map countSets [])` is 0.",
    },
    {
      k: "write",
      setup: fsSetup,
      body: "Write `pathExists ns fs`. The empty path `[]` means this entry itself. Otherwise look for a child whose name is the next piece and continue. Files have no children.",
      starter: hs`pathExists :: [String] -> FS -> Bool
pathExists ns fs = undefined
`,
      tests: [
        { expr: "pathExists [] desk", expected: "True" },
        { expr: `pathExists ["readme.txt"] desk`, expected: "True" },
        { expr: `pathExists ["src", "Lib.hs"] desk`, expected: "True" },
        { expr: `pathExists ["empty"] desk`, expected: "True" },
        { expr: `pathExists ["src", "nope"] desk`, expected: "False" },
        { expr: `pathExists ["readme.txt", "x"] desk`, expected: "False" },
        { expr: `pathExists ["a"] (File "a" 1)`, expected: "False" },
      ],
      hint: "`pathExists [] _ = True`. On a folder, find the child with `nameOf` matching the next piece.",
      solution: hs`pathExists :: [String] -> FS -> Bool
pathExists [] _ = True
pathExists (_ : _) (File _ _) = False
pathExists (n : ns) (Folder _ items) = case [i | i <- items, nameOf i == n] of
  (i : _) -> pathExists ns i
  []      -> False
  where
    nameOf (File k _) = k
    nameOf (Folder k _) = k
`,
    },
    {
      k: "write",
      setup: fsSetup,
      body: "Write `filesIn`, the names of every file anywhere under this entry, left to right.",
      starter: hs`filesIn :: FS -> [String]
filesIn fs = undefined
`,
      tests: [
        { expr: `filesIn (File "z" 1)`, expected: `["z"]` },
        { expr: `filesIn (Folder "e" [])`, expected: "[]" },
        { expr: "filesIn desk", expected: `["readme.txt", "Main.hs", "Lib.hs"]` },
        { expr: `filesIn (Folder "a" [Folder "b" [], File "c" 1])`, expected: `["c"]` },
      ],
      hint: "Same shape as `nFiles`, but you collect names instead of counting.",
      solution: hs`filesIn :: FS -> [String]
filesIn (File n _) = [n]
filesIn (Folder _ items) = concatMap filesIn items
`,
    },
    {
      k: "write",
      setup: markSetup,
      body: "Write `nestHeight`. `Plain` has height 0. A `Tag` with no children has height 0. Otherwise it is 1 plus the tallest child.",
      starter: hs`nestHeight :: Markup -> Int
nestHeight m = undefined
`,
      tests: [
        { expr: `nestHeight (Plain "z")`, expected: "0" },
        { expr: `nestHeight (Tag "br" [])`, expected: "0" },
        { expr: "nestHeight bits", expected: "2" },
        { expr: "nestHeight page", expected: "3" },
        { expr: `nestHeight (Tag "p" [Plain "x"])`, expected: "1" },
      ],
      hint: "`nestHeight (Tag _ ms) = foldr max 0 (map (\\m -> 1 + nestHeight m) ms)`.",
      solution: hs`nestHeight :: Markup -> Int
nestHeight (Plain _) = 0
nestHeight (Tag _ ms) = foldr max 0 (map (\m -> 1 + nestHeight m) ms)
`,
    },
    {
      k: "write",
      setup: markSetup,
      body: "Write `tagsNamed n m`, how many `Tag`s in `m` have name `n` (at any depth). `Plain` contributes 0.",
      starter: hs`tagsNamed :: String -> Markup -> Int
tagsNamed n m = undefined
`,
      tests: [
        { expr: `tagsNamed "p" (Plain "p")`, expected: "0" },
        { expr: `tagsNamed "br" (Tag "br" [])`, expected: "1" },
        { expr: `tagsNamed "li" bits`, expected: "2" },
        { expr: `tagsNamed "p" page`, expected: "2" },
        { expr: `tagsNamed "html" page`, expected: "1" },
        { expr: `tagsNamed "div" page`, expected: "0" },
      ],
      hint: "Count 1 if this tag's name matches, then add `sum (map (tagsNamed n) ms)`.",
      solution: hs`tagsNamed :: String -> Markup -> Int
tagsNamed _ (Plain _) = 0
tagsNamed n (Tag k ms) = (if k == n then 1 else 0) + sum (map (tagsNamed n) ms)
`,
    },
    {
      k: "write",
      setup: langSetup,
      body: "Write `varsAssigned`, the names that appear on the left of a `Set`, in the order you meet them, with repeats kept. Walk a `Block` left to right and an `If` then-branch then else-branch.",
      starter: hs`varsAssigned :: Stmt -> [String]
varsAssigned s = undefined
`,
      tests: [
        { expr: `varsAssigned (Set "x" (Lit 1))`, expected: `["x"]` },
        { expr: "varsAssigned (Block [])", expected: "[]" },
        { expr: "varsAssigned prog", expected: `["x", "y", "z", "z"]` },
        { expr: `varsAssigned (If (Lit 1) (Set "a" (Lit 0)) (Block [Set "b" (Lit 0), Set "a" (Lit 1)]))`, expected: `["a", "b", "a"]` },
      ],
      hint: "`varsAssigned (Block ss) = concatMap varsAssigned ss`.",
      solution: hs`varsAssigned :: Stmt -> [String]
varsAssigned (Set x _) = [x]
varsAssigned (Block ss) = concatMap varsAssigned ss
varsAssigned (If _ a b) = varsAssigned a ++ varsAssigned b
`,
    },
    {
      k: "write",
      setup: langSetup,
      body: "Write `stmtCount`, the number of statement constructors (`Set`, `Block` or `If`) anywhere. Do not count expressions.",
      starter: hs`stmtCount :: Stmt -> Int
stmtCount s = undefined
`,
      tests: [
        { expr: `stmtCount (Set "x" (Lit 1))`, expected: "1" },
        { expr: "stmtCount (Block [])", expected: "1" },
        { expr: "stmtCount prog", expected: "6" },
        { expr: `stmtCount (If (Lit 0) (Block []) (Set "z" (Lit 0)))`, expected: "3" },
      ],
      hint: "Each constructor counts 1, plus the statements inside. `stmtCount (Block ss) = 1 + sum (map stmtCount ss)`.",
      solution: hs`stmtCount :: Stmt -> Int
stmtCount (Set _ _) = 1
stmtCount (Block ss) = 1 + sum (map stmtCount ss)
stmtCount (If _ a b) = 1 + stmtCount a + stmtCount b
`,
    },
    {
      k: "quiz",
      q: "Why does `follow` return `Maybe (Rose a)` rather than `Rose a`?",
      options: [
        "Rose trees might have no root",
        "An index can be too big for the child list, or negative, so the path can fail",
        "Because `[]` is not a path",
        "GHCi cannot print a tree",
      ],
      answer: 1,
      why: "The child list can be shorter than the index. `Nothing` is how you report that.",
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `forestLabels`, every label in a forest, tree by tree, each tree in pre-order.",
      starter: hs`forestLabels :: Forest a -> [a]
forestLabels fs = undefined
`,
      tests: [
        { expr: "forestLabels ([] :: Forest Int)", expected: "[]" },
        { expr: "forestLabels [solo]", expected: "[9]" },
        { expr: "forestLabels grove", expected: "[9, 1, 2, 3, 4, 1, 2, 3, 4]" },
        { expr: "forestLabels [twig, Node 'z' []]", expected: `"kabdcz"` },
      ],
      hint: "`concatMap preorder fs`.",
      solution: hs`forestLabels :: Forest a -> [a]
forestLabels fs = concatMap pre fs
  where
    pre (Node x ts) = x : concatMap pre ts
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `dropTips t`. Keep the root. Drop any child that is itself childless. Recurse into children that still have children.",
      starter: hs`dropTips :: Rose a -> Rose a
dropTips t = undefined
`,
      tests: [
        { expr: "dropTips solo", expected: "Node 9 []" },
        { expr: "dropTips bush", expected: "Node 1 []" },
        { expr: "dropTips chain", expected: "Node 1 [Node 2 [Node 3 []]]" },
        { expr: "dropTips twig", expected: "Node 'k' [Node 'b' []]" },
        { expr: "dropTips (Node 0 [chain, solo])", expected: "Node 0 [Node 1 [Node 2 [Node 3 []]]]" },
      ],
      hint: "`Node x [dropTips t | t@(Node _ cs) <- ts, not (null cs)]`.",
      solution: hs`dropTips :: Rose a -> Rose a
dropTips (Node x ts) = Node x [dropTips t | t@(Node _ cs) <- ts, not (null cs)]
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `graft x u t`. Replace the first node labelled `x` (pre-order, children left to right) by the whole tree `u`. If `x` is missing, leave `t` alone.",
      starter: hs`graft :: Eq a => a -> Rose a -> Rose a -> Rose a
graft x u t = undefined
`,
      tests: [
        { expr: "graft 9 (Node 0 []) solo", expected: "Node 0 []" },
        { expr: "graft 7 (Node 0 []) solo", expected: "Node 9 []" },
        { expr: "graft 1 (Node 8 []) bush", expected: "Node 8 []" },
        { expr: "graft 3 (Node 0 []) bush", expected: "Node 1 [Node 2 [], Node 0 [], Node 4 []]" },
        { expr: "graft 4 (Node 5 [Node 6 []]) chain", expected: "Node 1 [Node 2 [Node 3 [Node 5 [Node 6 []]]]]" },
        { expr: "graft 'b' (Node 'z' []) twig", expected: "Node 'k' [Node 'a' [], Node 'z' [], Node 'c' []]" },
      ],
      hint: "If this node is `x`, return `u`. Otherwise walk the children and graft into the first one that contains `x`.",
      solution: hs`graft :: Eq a => a -> Rose a -> Rose a -> Rose a
graft x u (Node y ts)
  | x == y    = u
  | otherwise = Node y (change ts)
  where
    change [] = []
    change (t : rest)
      | has x t   = graft x u t : rest
      | otherwise = t : change rest
    has z (Node w cs) = z == w || any (has z) cs
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `onTips f t`, which applies `f` only to labels of childless nodes. Nodes with children keep their labels.",
      starter: hs`onTips :: (a -> a) -> Rose a -> Rose a
onTips f t = undefined
`,
      tests: [
        { expr: "onTips (+ 1) solo", expected: "Node 10 []" },
        { expr: "onTips (+ 1) bush", expected: "Node 1 [Node 3 [], Node 4 [], Node 5 []]" },
        { expr: "onTips (* 10) chain", expected: "Node 1 [Node 2 [Node 3 [Node 40 []]]]" },
        { expr: "onTips (const 'z') twig", expected: "Node 'k' [Node 'z' [], Node 'b' [Node 'z' []], Node 'z' []]" },
      ],
      hint: "`onTips f (Node x []) = Node (f x) []`. Otherwise `Node x (map (onTips f) ts)`.",
      solution: hs`onTips :: (a -> a) -> Rose a -> Rose a
onTips f (Node x []) = Node (f x) []
onTips f (Node x ts) = Node x (map (onTips f) ts)
`,
    },
    {
      k: "quiz",
      q: "What is the difference between `Tag \"br\" []` and `Plain \"\"`?",
      options: [
        "Nothing: they print the same",
        "`Tag` is an element (it counts as a tag, it can have attributes later); `Plain` is only text",
        "`Plain \"\"` is illegal",
        "`Tag \"br\" []` is a forest",
      ],
      answer: 1,
      why: "Different constructors. Functions that count tags will see the `Tag` and skip the `Plain`.",
    },
    {
      k: "quiz",
      q: "`foldr (\\t n -> weight t + n) 1 ts` and `1 + sum (map weight ts)` are equal. Why write the `foldr` version?",
      options: [
        "It is the only version GHC accepts",
        "It walks the child list once and adds, without building an intermediate `[Int]`",
        "It handles `[]` differently",
        "It counts the root twice",
      ],
      answer: 1,
      why: "Same answer, different route. Exams sometimes ask you to use `foldr` on the children instead of `map` then `sum`.",
    },
    {
      k: "write",
      setup: roseSetup,
      body: "Write `deepestLabels`, the labels of every node that sits at the maximum depth, left to right. A childless tree's deepest labels are just the root.",
      starter: hs`deepestLabels :: Rose a -> [a]
deepestLabels t = undefined
`,
      tests: [
        { expr: "deepestLabels solo", expected: "[9]" },
        { expr: "deepestLabels bush", expected: "[2, 3, 4]" },
        { expr: "deepestLabels chain", expected: "[4]" },
        { expr: "deepestLabels twig", expected: `"d"` },
        { expr: "deepestLabels (Node 0 [bush, chain])", expected: "[4]" },
      ],
      hint: "Find the height, then collect layer `height`. Or: if all children are empty, `[x]`; else `concatMap deepestLabels` of the tallest children.",
      solution: hs`deepestLabels :: Rose a -> [a]
deepestLabels t = layer (height t) t
  where
    height (Node _ []) = 0
    height (Node _ ts) = 1 + maximum (map height ts)
    layer 0 (Node x _) = [x]
    layer n (Node _ ts) = concatMap (layer (n - 1)) ts
`,
    },
  ],
};

const level4: DrillSet = {
  id: "b-rose-l4",
  lesson: "",
  level: 4,
  title: "Level 4: Exam strength",
  intro: md(
    "Questions worded the way the January test words them, on small invented domains: an organisation chart, nested to-do lists, a bill of materials, a file system, HTML, and a tiny language. The types are given, as in the exam. Read every GHCi example; they settle details the prose leaves open. The last eight are as hard as a 3 to 5 mark question.",
    "",
    "```",
    "*Main> headcount office",
    "6",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: md(
        "The paper gives you:",
        "",
        "```",
        "data Markup = Plain String | Tag String [Markup]",
        "```",
        "",
        "What is the type of the constructor `Tag`?",
      ),
      options: [
        "`Markup`",
        "`String -> [Markup] -> Markup`",
        "`String -> Markup`",
        "`[Markup] -> Markup`",
      ],
      answer: 1,
      why: "`Tag` takes a name and a forest of children. It is a function of two arguments.",
    },
    {
      k: "quiz",
      q: "`Folder \"empty\" []` is a folder with no entries. What is a sensible size in bytes for it?",
      options: ["It is not a legal value", "0", "1", "Nothing"],
      answer: 1,
      why: "There are no files inside, so the sizes add up to 0. The folder still exists.",
    },
    {
      k: "quiz",
      q: md(
        "You type this in GHCi:",
        "",
        "```",
        "*Main> Node 2 [Node 3 []]",
        "Node 2 [Node 3 []]",
        "```",
        "",
        "How many nodes does that tree have?",
      ),
      options: ["1", "2", "3", "0"],
      answer: 1,
      why: "The root holding 2, and one child holding 3. Two `Node`s.",
    },
    {
      k: "quiz",
      q: "`data Stmt = Set String Expr | Block [Stmt] | If Expr Stmt Stmt`. A function that walks a whole program will typically be...",
      options: [
        "One equation, because `Stmt` is one type",
        "Three equations for `Stmt`, with the `Block` equation mapping over the list (a forest of statements)",
        "Only a function on `[Stmt]`, never on `Stmt`",
        "Impossible: Haskell does not allow a type to contain a list of itself",
      ],
      answer: 1,
      why: "One equation per constructor. `Block` is the forest case: `map` or `foldr` over `[Stmt]`, each element calling back into the `Stmt` function.",
    },
    {
      k: "quiz",
      q: "The index path `[0, 2]` from the root of a rose tree means:",
      options: [
        "Labels 0 and 2",
        "The first child of the root, then that child's third child",
        "The third child of the root, then that child's first child",
        "Go up two steps",
      ],
      answer: 1,
      why: "Indices count from 0, so 0 is the first child and 2 is the third child of that node.",
    },
    {
      k: "quiz",
      q: "Which of these can hold no nodes at all?",
      options: [
        "`Rose a`",
        "`Forest a` (that is, `[Rose a]`)",
        "Both",
        "Neither: every tree type has a root",
      ],
      answer: 1,
      why: "A rose tree always has a `Node`. A forest is a list, so `[]` is the empty forest.",
    },
    {
      k: "write",
      setup: orgSetup,
      body: md(
        "An organisation is stored as a rose tree of names: a person, then the list of people who report to them (any number, including none).",
        "",
        ...orgBlock,
        "",
        "Define a function `reports :: Org -> [String]` that returns the names of the people who report **directly** to the person at the root. For example:",
        "",
        "```",
        "*Main> reports office",
        "[\"Alex\",\"Sam\",\"Riley\"]",
        "*Main> reports (Node \"Alex\" [])",
        "[]",
        "```",
      ),
      starter: hs`reports :: Org -> [String]
reports t = undefined
`,
      tests: [
        { expr: "reports office", expected: `["Alex", "Sam", "Riley"]` },
        { expr: `reports (Node "Alex" [])`, expected: "[]" },
        { expr: `reports (Node "Sam" [Node "Jo" [], Node "Kim" []])`, expected: `["Jo", "Kim"]` },
        { expr: `reports (Node "Pat" [Node "Alex" [Node "Dee" []]])`, expected: `["Alex"]` },
      ],
      hint: "`[n | Node n _ <- ts]`. Do not walk any deeper.",
      solution: hs`reports :: Org -> [String]
reports (Node _ ts) = [n | Node n _ <- ts]
`,
    },
    {
      k: "write",
      setup: orgSetup,
      body: md(
        "Using the organisation type:",
        "",
        ...orgBlock,
        "",
        "Define a function `headcount :: Org -> Int` that returns how many people are in the tree, including the person at the root. For example:",
        "",
        "```",
        "*Main> headcount office",
        "6",
        "*Main> headcount (Node \"Alex\" [])",
        "1",
        "```",
      ),
      starter: hs`headcount :: Org -> Int
headcount t = undefined
`,
      tests: [
        { expr: "headcount office", expected: "6" },
        { expr: `headcount (Node "Alex" [])`, expected: "1" },
        { expr: `headcount (Node "Sam" [Node "Jo" [], Node "Kim" []])`, expected: "3" },
        { expr: `headcount (Node "A" [Node "B" [Node "C" [Node "D" []]]])`, expected: "4" },
      ],
      hint: "`1 + sum (map headcount ts)`.",
      solution: hs`headcount :: Org -> Int
headcount (Node _ ts) = 1 + sum (map headcount ts)
`,
    },
    {
      k: "write",
      setup: orgSetup,
      body: md(
        "Using the organisation type:",
        "",
        ...orgBlock,
        "",
        "Define a function `subtreeNamed :: String -> Org -> Maybe Org` that returns the subtree rooted at the first person with that name (pre-order, children left to right), or `Nothing` if nobody has that name. For example:",
        "",
        "```",
        "*Main> subtreeNamed \"Sam\" office",
        "Just (Node \"Sam\" [Node \"Jo\" [],Node \"Kim\" []])",
        "*Main> subtreeNamed \"Zoe\" office",
        "Nothing",
        "```",
      ),
      starter: hs`subtreeNamed :: String -> Org -> Maybe Org
subtreeNamed n t = undefined
`,
      tests: [
        { expr: `subtreeNamed "Pat" office`, expected: "Just office" },
        { expr: `subtreeNamed "Sam" office`, expected: `Just (Node "Sam" [Node "Jo" [], Node "Kim" []])` },
        { expr: `subtreeNamed "Kim" office`, expected: `Just (Node "Kim" [])` },
        { expr: `subtreeNamed "Zoe" office`, expected: "Nothing" },
        { expr: `subtreeNamed "Alex" (Node "Alex" [])`, expected: `Just (Node "Alex" [])` },
      ],
      hint: "If this node matches, `Just` this whole tree. Otherwise search the children left to right.",
      solution: hs`subtreeNamed :: String -> Org -> Maybe Org
subtreeNamed n t@(Node k ts)
  | n == k    = Just t
  | otherwise = firstJust (map (subtreeNamed n) ts)
  where
    firstJust [] = Nothing
    firstJust (Just a : _) = Just a
    firstJust (Nothing : ms) = firstJust ms
`,
    },
    {
      k: "write",
      setup: taskSetup,
      body: md(
        "A nested to-do list is a title, a done-flag, and a list of subtasks:",
        "",
        "```",
        "data Task = Task String Bool [Task]",
        "```",
        "",
        "`True` means the task is done. Define `howMany :: Task -> Int`, the number of tasks in the tree, including the top one. For example:",
        "",
        "```",
        "*Main> howMany chores",
        "5",
        "*Main> howMany (Task \"one\" True [])",
        "1",
        "```",
      ),
      starter: hs`howMany :: Task -> Int
howMany t = undefined
`,
      tests: [
        { expr: "howMany chores", expected: "5" },
        { expr: `howMany (Task "one" True [])`, expected: "1" },
        { expr: `howMany (Task "a" False [Task "b" True [], Task "c" False []])`, expected: "3" },
        { expr: `howMany (Task "a" False [Task "b" False [Task "c" True []]])`, expected: "3" },
      ],
      hint: "`howMany (Task _ _ ts) = 1 + sum (map howMany ts)`.",
      solution: hs`howMany :: Task -> Int
howMany (Task _ _ ts) = 1 + sum (map howMany ts)
`,
    },
    {
      k: "write",
      setup: taskSetup,
      body: md(
        "Using the `Task` type, define `stillOpen :: Task -> Int`, the number of tasks whose flag is `False` (not done), at any depth. For example:",
        "",
        "```",
        "*Main> stillOpen chores",
        "3",
        "*Main> stillOpen (Task \"one\" True [])",
        "0",
        "```",
      ),
      starter: hs`stillOpen :: Task -> Int
stillOpen t = undefined
`,
      tests: [
        { expr: "stillOpen chores", expected: "3" },
        { expr: `stillOpen (Task "one" True [])`, expected: "0" },
        { expr: `stillOpen (Task "one" False [])`, expected: "1" },
        { expr: `stillOpen (Task "a" True [Task "b" False [], Task "c" True []])`, expected: "1" },
        { expr: `stillOpen (Task "a" False [Task "b" False [Task "c" False []]])`, expected: "3" },
      ],
      hint: "`(if done then 0 else 1) + sum (map stillOpen ts)`.",
      solution: hs`stillOpen :: Task -> Int
stillOpen (Task _ done ts) = (if done then 0 else 1) + sum (map stillOpen ts)
`,
    },
    {
      k: "write",
      setup: partSetup,
      body: md(
        "A bill of materials is either a bought part with a price, or a made part with a list of sub-parts:",
        "",
        "```",
        "data Part = Buy String Int | Made String [Part]",
        "```",
        "",
        "Define `buyCost :: Part -> Int`, the total price of every `Buy` in the tree. A `Made` with no sub-parts costs 0. For example:",
        "",
        "```",
        "*Main> buyCost lamp",
        "20",
        "*Main> buyCost (Made \"frame\" [])",
        "0",
        "```",
      ),
      starter: hs`buyCost :: Part -> Int
buyCost p = undefined
`,
      tests: [
        { expr: "buyCost lamp", expected: "20" },
        { expr: `buyCost (Buy "bolt" 2)`, expected: "2" },
        { expr: `buyCost (Made "frame" [])`, expected: "0" },
        { expr: `buyCost (Made "kit" [Buy "a" 1, Made "b" [Buy "c" 4]])`, expected: "5" },
      ],
      hint: "`buyCost (Made _ ps) = sum (map buyCost ps)`.",
      solution: hs`buyCost :: Part -> Int
buyCost (Buy _ n) = n
buyCost (Made _ ps) = sum (map buyCost ps)
`,
    },
    {
      k: "write",
      setup: partSetup,
      body: md(
        "Using the `Part` type, define `buyNames :: Part -> [String]`, the names of every bought part, left to right. For example:",
        "",
        "```",
        "*Main> buyNames lamp",
        "[\"bulb\",\"cloth\",\"frame\",\"flex\"]",
        "```",
      ),
      starter: hs`buyNames :: Part -> [String]
buyNames p = undefined
`,
      tests: [
        { expr: "buyNames lamp", expected: `["bulb", "cloth", "frame", "flex"]` },
        { expr: `buyNames (Buy "bolt" 2)`, expected: `["bolt"]` },
        { expr: `buyNames (Made "frame" [])`, expected: "[]" },
        { expr: `buyNames (Made "kit" [Buy "a" 1, Made "b" [Buy "c" 4, Buy "a" 1]])`, expected: `["a", "c", "a"]` },
      ],
      hint: "`buyNames (Made _ ps) = concatMap buyNames ps`.",
      solution: hs`buyNames :: Part -> [String]
buyNames (Buy n _) = [n]
buyNames (Made _ ps) = concatMap buyNames ps
`,
    },
    {
      k: "write",
      setup: outlineSetup,
      body: md(
        "A course outline is a forest of topics nested inside units:",
        "",
        "```",
        "data Item = Topic String | Unit String [Item]",
        "```",
        "",
        "Define `topicCount :: Item -> Int`, the number of `Topic`s at any depth. For example:",
        "",
        "```",
        "*Main> topicCount course",
        "4",
        "*Main> topicCount (Unit \"empty\" [])",
        "0",
        "```",
      ),
      starter: hs`topicCount :: Item -> Int
topicCount i = undefined
`,
      tests: [
        { expr: "topicCount course", expected: "4" },
        { expr: `topicCount (Topic "lists")`, expected: "1" },
        { expr: `topicCount (Unit "empty" [])`, expected: "0" },
        { expr: `topicCount (Unit "a" [Unit "b" [Topic "c"], Topic "d"])`, expected: "2" },
      ],
      hint: "`topicCount (Unit _ is) = sum (map topicCount is)`.",
      solution: hs`topicCount :: Item -> Int
topicCount (Topic _) = 1
topicCount (Unit _ is) = sum (map topicCount is)
`,
    },
    {
      k: "write",
      setup: albumSetup,
      body: md(
        "A photo album is either a picture or a named album containing a list of albums and pictures:",
        "",
        "```",
        "data Album = Pic String | Album String [Album]",
        "```",
        "",
        "Define `photoCount :: Album -> Int`. An empty album has 0 photos. For example:",
        "",
        "```",
        "*Main> photoCount hols",
        "3",
        "*Main> photoCount (Album \"empty\" [])",
        "0",
        "```",
      ),
      starter: hs`photoCount :: Album -> Int
photoCount a = undefined
`,
      tests: [
        { expr: "photoCount hols", expected: "3" },
        { expr: `photoCount (Pic "train")`, expected: "1" },
        { expr: `photoCount (Album "empty" [])`, expected: "0" },
        { expr: `photoCount (Album "a" [Album "b" [Pic "c", Pic "d"], Pic "e"])`, expected: "3" },
      ],
      hint: "`photoCount (Album _ as) = sum (map photoCount as)`.",
      solution: hs`photoCount :: Album -> Int
photoCount (Pic _) = 1
photoCount (Album _ as) = sum (map photoCount as)
`,
    },
    {
      k: "write",
      setup: menuSetup,
      body: md(
        "A menu is a tree of dishes. `Item name veg` is a single dish; `veg` is `True` when it is vegetarian. `Section` groups dishes.",
        "",
        "```",
        "data Dish = Item String Bool | Section String [Dish]",
        "```",
        "",
        "Define `vegCount :: Dish -> Int`, the number of vegetarian items at any depth. For example:",
        "",
        "```",
        "*Main> vegCount menu",
        "3",
        "*Main> vegCount (Section \"empty\" [])",
        "0",
        "```",
      ),
      starter: hs`vegCount :: Dish -> Int
vegCount d = undefined
`,
      tests: [
        { expr: "vegCount menu", expected: "3" },
        { expr: `vegCount (Item "soup" True)`, expected: "1" },
        { expr: `vegCount (Item "pie" False)`, expected: "0" },
        { expr: `vegCount (Section "empty" [])`, expected: "0" },
        { expr: `vegCount (Section "s" [Item "a" True, Section "t" [Item "b" True]])`, expected: "2" },
      ],
      hint: "Count 1 when `Item _ True`. A `Section` sums `vegCount` of its children.",
      solution: hs`vegCount :: Dish -> Int
vegCount (Item _ veg) = if veg then 1 else 0
vegCount (Section _ ds) = sum (map vegCount ds)
`,
    },
    {
      k: "write",
      setup: fsSetup,
      body: md(
        "A file system is files and folders:",
        "",
        ...fsBlock,
        "",
        "Define a function `fileCount :: FS -> Int` that returns how many files are in the tree. Empty folders contribute 0. For example:",
        "",
        "```",
        "*Main> fileCount desk",
        "3",
        "*Main> fileCount (Folder \"empty\" [])",
        "0",
        "```",
      ),
      starter: hs`fileCount :: FS -> Int
fileCount fs = undefined
`,
      tests: [
        { expr: "fileCount desk", expected: "3" },
        { expr: `fileCount (File "z" 1)`, expected: "1" },
        { expr: `fileCount (Folder "empty" [])`, expected: "0" },
        { expr: `fileCount (Folder "a" [Folder "b" [File "c" 1], File "d" 1])`, expected: "2" },
      ],
      hint: "`fileCount (Folder _ items) = sum (map fileCount items)`.",
      solution: hs`fileCount :: FS -> Int
fileCount (File _ _) = 1
fileCount (Folder _ items) = sum (map fileCount items)
`,
    },
    {
      k: "write",
      setup: fsSetup,
      body: md(
        "Using the file-system types, define `bytesUsed :: FS -> Int`, the total size of every file. An empty folder uses 0 bytes. For example:",
        "",
        "```",
        "*Main> bytesUsed desk",
        "240",
        "*Main> bytesUsed (Folder \"empty\" [])",
        "0",
        "```",
      ),
      starter: hs`bytesUsed :: FS -> Int
bytesUsed fs = undefined
`,
      tests: [
        { expr: "bytesUsed desk", expected: "240" },
        { expr: `bytesUsed (File "z" 7)`, expected: "7" },
        { expr: `bytesUsed (Folder "empty" [])`, expected: "0" },
        { expr: `bytesUsed (Folder "src" [File "Main.hs" 120, File "Lib.hs" 80])`, expected: "200" },
      ],
      hint: "`bytesUsed (Folder _ items) = sum (map bytesUsed items)`.",
      solution: hs`bytesUsed :: FS -> Int
bytesUsed (File _ n) = n
bytesUsed (Folder _ items) = sum (map bytesUsed items)
`,
    },
    {
      k: "write",
      setup: fsSetup,
      body: md(
        "Using the file-system types, define `folderNames :: FS -> [String]`, the names of every folder in the tree, this folder first and then its contents left to right. Files are skipped. For example:",
        "",
        "```",
        "*Main> folderNames desk",
        "[\"desk\",\"src\",\"empty\"]",
        "*Main> folderNames (File \"z\" 1)",
        "[]",
        "```",
      ),
      starter: hs`folderNames :: FS -> [String]
folderNames fs = undefined
`,
      tests: [
        { expr: "folderNames desk", expected: `["desk", "src", "empty"]` },
        { expr: `folderNames (File "z" 1)`, expected: "[]" },
        { expr: `folderNames (Folder "empty" [])`, expected: `["empty"]` },
        { expr: `folderNames (Folder "a" [Folder "b" [Folder "c" []]])`, expected: `["a", "b", "c"]` },
      ],
      hint: "`folderNames (Folder n items) = n : concatMap folderNames items`.",
      solution: hs`folderNames :: FS -> [String]
folderNames (File _ _) = []
folderNames (Folder n items) = n : concatMap folderNames items
`,
    },
    {
      k: "write",
      setup: markSetup,
      body: md(
        "HTML is stored as:",
        "",
        ...markBlock,
        "",
        "Define `plainText :: Markup -> String`, the concatenation of every `Plain` string, left to right. For example:",
        "",
        "```",
        "*Main> plainText page",
        "\"Hixy!\"",
        "*Main> plainText (Tag \"br\" [])",
        "\"\"",
        "```",
      ),
      starter: hs`plainText :: Markup -> String
plainText m = undefined
`,
      tests: [
        { expr: "plainText page", expected: `"Hixy!"` },
        { expr: `plainText (Plain "z")`, expected: `"z"` },
        { expr: `plainText (Tag "br" [])`, expected: `""` },
        { expr: "plainText bits", expected: `"ab!"` },
      ],
      hint: "`plainText (Tag _ ms) = concatMap plainText ms`.",
      solution: hs`plainText :: Markup -> String
plainText (Plain s) = s
plainText (Tag _ ms) = concatMap plainText ms
`,
    },
    {
      k: "write",
      setup: markSetup,
      body: md(
        "Using the markup type, define `tagCount :: Markup -> Int`, the number of `Tag` constructors. `Plain` counts as 0. For example:",
        "",
        "```",
        "*Main> tagCount page",
        "5",
        "*Main> tagCount (Plain \"z\")",
        "0",
        "```",
      ),
      starter: hs`tagCount :: Markup -> Int
tagCount m = undefined
`,
      tests: [
        { expr: "tagCount page", expected: "5" },
        { expr: `tagCount (Plain "z")`, expected: "0" },
        { expr: `tagCount (Tag "br" [])`, expected: "1" },
        { expr: "tagCount bits", expected: "3" },
      ],
      hint: "`tagCount (Tag _ ms) = 1 + sum (map tagCount ms)`.",
      solution: hs`tagCount :: Markup -> Int
tagCount (Plain _) = 0
tagCount (Tag _ ms) = 1 + sum (map tagCount ms)
`,
    },
    {
      k: "write",
      setup: langSetup,
      body: md(
        "A tiny language has expressions and statements that refer to each other:",
        "",
        ...langBlock,
        "",
        "Define `setCount :: Stmt -> Int`, the number of `Set` constructors anywhere in the statement, including both branches of an `If`. For example:",
        "",
        "```",
        "*Main> setCount prog",
        "4",
        "*Main> setCount (Block [])",
        "0",
        "```",
      ),
      starter: hs`setCount :: Stmt -> Int
setCount s = undefined
`,
      tests: [
        { expr: "setCount prog", expected: "4" },
        { expr: `setCount (Set "x" (Lit 1))`, expected: "1" },
        { expr: "setCount (Block [])", expected: "0" },
        { expr: `setCount (If (Lit 0) (Block [Set "a" (Lit 1)]) (Set "b" (Lit 2)))`, expected: "2" },
        { expr: `setCount (Block [Block [Set "z" (Lit 0)]])`, expected: "1" },
      ],
      hint: "`setCount (Block ss) = sum (map setCount ss)`. The two functions are this one and `map` over the block.",
      solution: hs`setCount :: Stmt -> Int
setCount (Set _ _) = 1
setCount (Block ss) = sum (map setCount ss)
setCount (If _ a b) = setCount a + setCount b
`,
    },
    {
      k: "write",
      setup: orgSetup,
      body: md(
        "Using the organisation type:",
        "",
        ...orgBlock,
        "",
        "Define a function `chainOfCommand :: String -> Org -> Maybe [String]` that returns the names from the root down to the first person with that name, or `Nothing` if they are not in the tree. For example:",
        "",
        "```",
        "*Main> chainOfCommand \"Kim\" office",
        "Just [\"Pat\",\"Sam\",\"Kim\"]",
        "*Main> chainOfCommand \"Pat\" office",
        "Just [\"Pat\"]",
        "*Main> chainOfCommand \"Zoe\" office",
        "Nothing",
        "```",
      ),
      starter: hs`chainOfCommand :: String -> Org -> Maybe [String]
chainOfCommand n t = undefined
`,
      tests: [
        { expr: `chainOfCommand "Kim" office`, expected: `Just ["Pat", "Sam", "Kim"]` },
        { expr: `chainOfCommand "Pat" office`, expected: `Just ["Pat"]` },
        { expr: `chainOfCommand "Alex" office`, expected: `Just ["Pat", "Alex"]` },
        { expr: `chainOfCommand "Zoe" office`, expected: "Nothing" },
        { expr: `chainOfCommand "Jo" (Node "Jo" [])`, expected: `Just ["Jo"]` },
      ],
      hint: "If this node matches, `Just [n]`. Otherwise try each child; prefix this name onto a successful path.",
      solution: hs`chainOfCommand :: String -> Org -> Maybe [String]
chainOfCommand n (Node k ts)
  | n == k    = Just [k]
  | otherwise = case firstJust (map (chainOfCommand n) ts) of
      Just p  -> Just (k : p)
      Nothing -> Nothing
  where
    firstJust [] = Nothing
    firstJust (Just a : _) = Just a
    firstJust (Nothing : ms) = firstJust ms
`,
    },
    {
      k: "write",
      setup: fsSetup,
      body: md(
        "Using the file-system types:",
        "",
        ...fsBlock,
        "",
        "Define `allFilePaths :: FS -> [String]`, the path of every **file**, using `/` between names, starting with this entry's name. Folders that contain no files contribute nothing. For example:",
        "",
        "```",
        "*Main> allFilePaths desk",
        "[\"desk/readme.txt\",\"desk/src/Main.hs\",\"desk/src/Lib.hs\"]",
        "*Main> allFilePaths (Folder \"empty\" [])",
        "[]",
        "*Main> allFilePaths (File \"z.txt\" 1)",
        "[\"z.txt\"]",
        "```",
      ),
      starter: hs`allFilePaths :: FS -> [String]
allFilePaths fs = undefined
`,
      tests: [
        { expr: "allFilePaths desk", expected: `["desk/readme.txt", "desk/src/Main.hs", "desk/src/Lib.hs"]` },
        { expr: `allFilePaths (Folder "empty" [])`, expected: "[]" },
        { expr: `allFilePaths (File "z.txt" 1)`, expected: `["z.txt"]` },
        { expr: `allFilePaths (Folder "a" [Folder "b" [File "c" 1]])`, expected: `["a/b/c"]` },
        { expr: `allFilePaths (Folder "a" [File "x" 1, Folder "empty" [], File "y" 1])`, expected: `["a/x", "a/y"]` },
      ],
      hint: "A helper `go prefix` builds the path so far. For a file, the result is `[prefix]`. For a folder, recurse with `prefix ++ \"/\" ++ name` on each child.",
      solution: hs`allFilePaths :: FS -> [String]
allFilePaths fs = go (nameOf fs) fs
  where
    go prefix (File _ _) = [prefix]
    go prefix (Folder _ items) =
      concatMap (\i -> go (prefix ++ "/" ++ nameOf i) i) items
    nameOf (File n _) = n
    nameOf (Folder n _) = n
`,
    },
    {
      k: "write",
      setup: fsSetup,
      body: md(
        "Using the file-system types, define `du :: [String] -> FS -> Maybe Int`.",
        "",
        "The path is a list of names from **this** entry's children (the empty path `[]` means this entry itself). The result is the total size of the file or folder at that path, or `Nothing` if the path does not exist. A file has no children, so a non-empty path under a file is `Nothing`. For example:",
        "",
        "```",
        "*Main> du [] desk",
        "Just 240",
        "*Main> du [\"src\"] desk",
        "Just 200",
        "*Main> du [\"empty\"] desk",
        "Just 0",
        "*Main> du [\"nope\"] desk",
        "Nothing",
        "```",
      ),
      starter: hs`du :: [String] -> FS -> Maybe Int
du ns fs = undefined
`,
      tests: [
        { expr: "du [] desk", expected: "Just 240" },
        { expr: `du ["src"] desk`, expected: "Just 200" },
        { expr: `du ["readme.txt"] desk`, expected: "Just 40" },
        { expr: `du ["empty"] desk`, expected: "Just 0" },
        { expr: `du ["nope"] desk`, expected: "Nothing" },
        { expr: `du ["src", "Main.hs"] desk`, expected: "Just 120" },
        { expr: `du ["readme.txt", "x"] desk`, expected: "Nothing" },
        { expr: `du ["a"] (File "a" 1)`, expected: "Nothing" },
      ],
      hint: "`du [] fs = Just (bytes fs)`. On a folder, look up the next name among the children.",
      solution: hs`du :: [String] -> FS -> Maybe Int
du path fs = go path fs
  where
    go [] x = Just (bytes x)
    go (_ : _) (File _ _) = Nothing
    go (n : ns) (Folder _ items) = case [i | i <- items, nameOf i == n] of
      (i : _) -> go ns i
      []      -> Nothing
    bytes (File _ k) = k
    bytes (Folder _ is) = sum (map bytes is)
    nameOf (File k _) = k
    nameOf (Folder k _) = k
`,
    },
    {
      k: "write",
      setup: fsSetup,
      body: md(
        "Define `addFile :: [String] -> String -> Int -> FS -> FS`.",
        "",
        "`addFile folders fname n fs` adds a file called `fname` of size `n` inside the folder reached by `folders` (a list of folder names, starting at the children of `fs`). Missing folders on the way are created. If `folders` is empty, the file is added as a child of `fs` when `fs` is a folder. Adding inside a file leaves that file unchanged. For example:",
        "",
        "```",
        "*Main> addFile [] \"a.txt\" 3 (Folder \"d\" [])",
        "Folder \"d\" [File \"a.txt\" 3]",
        "*Main> addFile [\"new\"] \"z\" 1 (Folder \"r\" [])",
        "Folder \"r\" [Folder \"new\" [File \"z\" 1]]",
        "*Main> addFile [] \"x\" 1 (File \"a\" 2)",
        "File \"a\" 2",
        "```",
      ),
      starter: hs`addFile :: [String] -> String -> Int -> FS -> FS
addFile folders fname n fs = undefined
`,
      tests: [
        { expr: `addFile [] "a.txt" 3 (Folder "d" [])`, expected: `Folder "d" [File "a.txt" 3]` },
        { expr: `addFile [] "x" 1 (File "a" 2)`, expected: `File "a" 2` },
        { expr: `addFile ["new"] "z" 1 (Folder "r" [])`, expected: `Folder "r" [Folder "new" [File "z" 1]]` },
        { expr: `addFile ["src"] "Util.hs" 50 desk`, expected: `Folder "desk" [File "readme.txt" 40, Folder "src" [File "Main.hs" 120, File "Lib.hs" 80, File "Util.hs" 50], Folder "empty" []]` },
        { expr: `addFile ["empty"] "x" 2 desk`, expected: `Folder "desk" [File "readme.txt" 40, Folder "src" [File "Main.hs" 120, File "Lib.hs" 80], Folder "empty" [File "x" 2]]` },
        { expr: `addFile ["new", "deep"] "z" 1 (Folder "r" [])`, expected: `Folder "r" [Folder "new" [Folder "deep" [File "z" 1]]]` },
      ],
      hint: "If the path is empty and you have a folder, append the file. If the next folder name is missing, create `Folder p []` and keep going. Walk the child list with a helper.",
      solution: hs`addFile :: [String] -> String -> Int -> FS -> FS
addFile path fname n fs = go path fs
  where
    go [] (Folder d items) = Folder d (items ++ [File fname n])
    go [] f@(File _ _) = f
    go (p : ps) (Folder d items) = Folder d (put items)
      where
        put [] = [go ps (Folder p [])]
        put (i : is)
          | nameOf i == p = go ps i : is
          | otherwise     = i : put is
    go _ f@(File _ _) = f
    nameOf (File k _) = k
    nameOf (Folder k _) = k
`,
    },
    {
      k: "write",
      setup: markSetup,
      body: md(
        "Using the markup type:",
        "",
        ...markBlock,
        "",
        "Define `plainIn :: String -> Markup -> String`. Search for tags with the given name. For the first such tag you meet in pre-order, and for each other match that is **not** nested inside an earlier match, append all of the plain text inside that tag. Do not search inside a tag once you have taken its text. For example:",
        "",
        "```",
        "*Main> plainIn \"p\" page",
        "\"xy!\"",
        "*Main> plainIn \"body\" page",
        "\"Hixy!\"",
        "*Main> plainIn \"div\" page",
        "\"\"",
        "```",
      ),
      starter: hs`plainIn :: String -> Markup -> String
plainIn n m = undefined
`,
      tests: [
        { expr: `plainIn "p" page`, expected: `"xy!"` },
        { expr: `plainIn "body" page`, expected: `"Hixy!"` },
        { expr: `plainIn "br" page`, expected: `""` },
        { expr: `plainIn "div" page`, expected: `""` },
        { expr: `plainIn "p" (Plain "p")`, expected: `""` },
        { expr: `plainIn "li" bits`, expected: `"ab"` },
        { expr: `plainIn "p" (Tag "p" [Tag "p" [Plain "in"], Plain "out"])`, expected: `"inout"` },
      ],
      hint: "If this tag's name matches, `concatMap allPlain` of its children and stop. Otherwise search the children.",
      solution: hs`plainIn :: String -> Markup -> String
plainIn _ (Plain _) = ""
plainIn n (Tag k ms)
  | k == n    = concatMap allPlain ms
  | otherwise = concatMap (plainIn n) ms
  where
    allPlain (Plain s) = s
    allPlain (Tag _ cs) = concatMap allPlain cs
`,
    },
    {
      k: "write",
      setup: langSetup,
      body: md(
        "Using the tiny language:",
        "",
        ...langBlock,
        "",
        "An environment is a table of variable names and integers. `lookup` of a missing variable should behave as 0.",
        "",
        "Define mutually recursive functions `eval :: Env -> Expr -> Int` and `exec :: Env -> Stmt -> Env`.",
        "",
        "- `Set x e` binds `x` to `eval env e` (replace a previous binding of `x` if there is one, and put the new pair at the front).",
        "- `Block ss` runs the statements from left to right, threading the environment.",
        "- `If e s1 s2` runs `s1` when `eval env e` is not 0, and `s2` when it is 0.",
        "",
        "For example:",
        "",
        "```",
        "*Main> exec [] (Set \"x\" (Lit 3))",
        "[(\"x\",3)]",
        "*Main> exec [] prog",
        "[(\"z\",9),(\"y\",3),(\"x\",1)]",
        "*Main> exec [] (Block [])",
        "[]",
        "```",
      ),
      starter: hs`eval :: Env -> Expr -> Int
eval env e = undefined

exec :: Env -> Stmt -> Env
exec env s = undefined
`,
      tests: [
        { expr: `exec [] (Set "x" (Lit 3))`, expected: `[("x", 3)]` },
        { expr: "exec [] (Block [])", expected: "[]" },
        { expr: "exec [] prog", expected: `[("z", 9), ("y", 3), ("x", 1)]` },
        { expr: `exec [("x", 0)] (If (Var "x") (Set "a" (Lit 1)) (Set "b" (Lit 2)))`, expected: `[("b", 2), ("x", 0)]` },
        { expr: `exec [] (Block [Set "x" (Lit 1), Set "x" (Lit 5)])`, expected: `[("x", 5)]` },
        { expr: `eval [] (Add (Lit 2) (Var "missing"))`, expected: "2" },
        { expr: `exec [("x", 4)] (Set "y" (Add (Var "x") (Lit 1)))`, expected: `[("y", 5), ("x", 4)]` },
      ],
      hint: "`exec env (Block ss) = foldl exec env ss`. For `Set`, filter the old `x` out of `env` and put the new pair on the front.",
      solution: hs`eval :: Env -> Expr -> Int
eval _ (Lit n) = n
eval env (Var v) = case lookup v env of
  Just n  -> n
  Nothing -> 0
eval env (Add a b) = eval env a + eval env b

exec :: Env -> Stmt -> Env
exec env (Set x e) = (x, eval env e) : [(k, v) | (k, v) <- env, k /= x]
exec env (Block ss) = foldl exec env ss
exec env (If e s1 s2)
  | eval env e == 0 = exec env s2
  | otherwise       = exec env s1
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: md(
        "Rose trees of any labels:",
        "",
        ...roseBlock,
        "",
        "Define `align :: Rose a -> Rose b -> Maybe (Rose (a, b))`. If the two trees have the same shape (same branching at every node), pair the labels. If any node has a different number of children, the result is `Nothing`. For example:",
        "",
        "```",
        "*Main> align solo solo",
        "Just (Node (9,9) [])",
        "*Main> align bush chain",
        "Nothing",
        "```",
      ),
      starter: hs`align :: Rose a -> Rose b -> Maybe (Rose (a, b))
align t u = undefined
`,
      tests: [
        { expr: "align solo solo", expected: "Just (Node (9, 9) [])" },
        { expr: "align solo bush", expected: "Nothing" },
        { expr: "align bush chain", expected: "Nothing" },
        { expr: "align bush (Node 0 [Node 8 [], Node 7 [], Node 6 []])", expected: "Just (Node (1, 0) [Node (2, 8) [], Node (3, 7) [], Node (4, 6) []])" },
        { expr: "align twig twig", expected: "Just (Node ('k', 'k') [Node ('a', 'a') [], Node ('b', 'b') [Node ('d', 'd') []], Node ('c', 'c') []])" },
        { expr: "align chain (Node True [Node True [Node True [Node True []]]])", expected: "Just (Node (1, True) [Node (2, True) [Node (3, True) [Node (4, True) []]]])" },
      ],
      hint: "If the child lists have different lengths, `Nothing`. Otherwise `sequence (zipWith align xs ys)` and wrap with `Node (x, y)`.",
      solution: hs`align :: Rose a -> Rose b -> Maybe (Rose (a, b))
align (Node x xs) (Node y ys)
  | length xs /= length ys = Nothing
  | otherwise = case sequence (zipWith align xs ys) of
      Just zs -> Just (Node (x, y) zs)
      Nothing -> Nothing
`,
    },
    {
      k: "write",
      setup: roseSetup,
      body: md(
        "Define `edit :: [Int] -> (Rose a -> Rose a) -> Rose a -> Maybe (Rose a)`.",
        "",
        "The list is a child-index path from the root (`[]` means the whole tree). Apply the function to the subtree at that path and rebuild the tree around the result. If an index is negative or too large, give `Nothing`. For example:",
        "",
        "```",
        "*Main> edit [] (\\(Node n ts) -> Node (n + 1) ts) solo",
        "Just (Node 10 [])",
        "*Main> edit [1] (\\_ -> Node 0 []) bush",
        "Just (Node 1 [Node 2 [],Node 0 [],Node 4 []])",
        "*Main> edit [9] id bush",
        "Nothing",
        "```",
      ),
      starter: hs`edit :: [Int] -> (Rose a -> Rose a) -> Rose a -> Maybe (Rose a)
edit is f t = undefined
`,
      tests: [
        { expr: "edit [] (\\(Node n ts) -> Node (n + 1) ts) solo", expected: "Just (Node 10 [])" },
        { expr: "edit [0] (\\_ -> Node 0 []) solo", expected: "Nothing" },
        { expr: "edit [1] (\\_ -> Node 0 []) bush", expected: "Just (Node 1 [Node 2 [], Node 0 [], Node 4 []])" },
        { expr: "edit [0, 0, 0] (\\_ -> Node 9 []) chain", expected: "Just (Node 1 [Node 2 [Node 3 [Node 9 []]]])" },
        { expr: "edit [1, 0] (\\_ -> Node 'z' []) twig", expected: "Just (Node 'k' [Node 'a' [], Node 'b' [Node 'z' []], Node 'c' []])" },
        { expr: "edit [9] id bush", expected: "Nothing" },
        { expr: "edit [-1] id bush", expected: "Nothing" },
        { expr: "edit [] id solo", expected: "Just solo" },
      ],
      hint: "`edit [] f t = Just (f t)`. Otherwise check `0 <= i && i < length ts`, then `edit is f` that child and splice it back with `take` and `drop`.",
      solution: hs`edit :: [Int] -> (Rose a -> Rose a) -> Rose a -> Maybe (Rose a)
edit [] f t = Just (f t)
edit (i : is) f (Node x ts)
  | i < 0 || i >= length ts = Nothing
  | otherwise = case edit is f (ts !! i) of
      Just t' -> Just (Node x (take i ts ++ t' : drop (i + 1) ts))
      Nothing -> Nothing
`,
    },
  ],
};

export const book: Book = {
  id: "b-rose",
  order: 6,
  title: "Rose trees and mutual recursion",
  blurb:
    "Nodes with a list of children, forests, size and height, map filter and fold, paths from the root, and two types that call each other.",
  sets: [level1, level2, level3, level4],
};

