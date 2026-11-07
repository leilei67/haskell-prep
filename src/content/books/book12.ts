import { type Book, type DrillSet, hs, md } from "../schema.ts";

const libs = hs`import Data.Maybe (fromMaybe)
import Data.List (nub, sort)
`;

const types = hs`type Node  = String
type Graph = [(Node, [Node])]
`;

const houseSetup =
  libs +
  types +
  hs`

house :: Graph
house =
  [ ("hall",    ["kitchen", "lounge"])
  , ("kitchen", ["hall", "garden"])
  , ("lounge",  ["hall", "study"])
  , ("study",   [])
  , ("garden",  [])
  ]
`;

const roadsSetup =
  libs +
  types +
  hs`

roads :: Graph
roads =
  [ ("York",      ["Leeds", "Hull"])
  , ("Leeds",     ["York", "Sheffield"])
  , ("Hull",      ["York"])
  , ("Sheffield", ["Leeds"])
  ]
`;

const followsSetup =
  libs +
  types +
  hs`

follows :: Graph
follows =
  [ ("ann", ["bo", "cy"])
  , ("bo",  ["cy"])
  , ("cy",  [])
  , ("di",  ["ann"])
  ]
`;

const tinySetup =
  libs +
  hs`
tiny :: [(Int, [Int])]
tiny = [(1, [2, 3]), (2, [4]), (3, [4]), (4, [])]
`;

const campusBlock = [
  "```",
  "type Building = String",
  "type Campus   = [(Building, [Building])]",
  "",
  "campus =",
  "  [ (\"gate\",    [\"quad\", \"cafe\"])",
  "  , (\"quad\",    [\"gate\", \"library\", \"lab\"])",
  "  , (\"cafe\",    [\"gate\"])",
  "  , (\"library\", [\"quad\", \"lab\"])",
  "  , (\"lab\",     [\"library\"])",
  "  , (\"dorm\",    [])",
  "  ]",
  "```",
];

const campusSetup =
  libs +
  hs`
type Building = String
type Campus   = [(Building, [Building])]

campus :: Campus
campus =
  [ ("gate",    ["quad", "cafe"])
  , ("quad",    ["gate", "library", "lab"])
  , ("cafe",    ["gate"])
  , ("library", ["quad", "lab"])
  , ("lab",     ["library"])
  , ("dorm",    [])
  ]
`;

const friendsBlock = [
  "```",
  "type Person = String",
  "type Net    = [(Person, [Person])]",
  "",
  "friends =",
  "  [ (\"ann\", [\"bo\", \"cy\"])",
  "  , (\"bo\",  [\"ann\", \"di\"])",
  "  , (\"cy\",  [\"ann\"])",
  "  , (\"di\",  [\"bo\"])",
  "  , (\"ed\",  [])",
  "  ]",
  "```",
];

const friendsSetup =
  libs +
  hs`
type Person = String
type Net    = [(Person, [Person])]

friends :: Net
friends =
  [ ("ann", ["bo", "cy"])
  , ("bo",  ["ann", "di"])
  , ("cy",  ["ann"])
  , ("di",  ["bo"])
  , ("ed",  [])
  ]
`;

const courseBlock = [
  "```",
  "type Course = String",
  "type Guide  = [(Course, [Course])]",
  "",
  "guide =",
  "  [ (\"Calc2\",  [\"Calc1\"])",
  "  , (\"Calc1\",  [])",
  "  , (\"Alg2\",   [\"Alg1\"])",
  "  , (\"Alg1\",   [])",
  "  , (\"Stats\",  [\"Calc1\", \"Alg1\"])",
  "  , (\"Project\",[\"Calc2\", \"Stats\"])",
  "  ]",
  "```",
];

const courseSetup =
  libs +
  hs`
type Course = String
type Guide  = [(Course, [Course])]

guide :: Guide
guide =
  [ ("Calc2",   ["Calc1"])
  , ("Calc1",   [])
  , ("Alg2",    ["Alg1"])
  , ("Alg1",    [])
  , ("Stats",   ["Calc1", "Alg1"])
  , ("Project", ["Calc2", "Stats"])
  ]
`;

const dungeonBlock = [
  "```",
  "type Room = String",
  "type Map  = [(Room, [Room])]",
  "",
  "dungeon =",
  "  [ (\"entry\", [\"hall\", \"cellar\"])",
  "  , (\"hall\",  [\"entry\", \"throne\", \"garden\"])",
  "  , (\"cellar\",[\"entry\"])",
  "  , (\"throne\",[\"hall\"])",
  "  , (\"garden\",[\"hall\", \"lake\"])",
  "  , (\"lake\",  [\"garden\"])",
  "  ]",
  "```",
];

const dungeonSetup =
  libs +
  hs`
type Room = String
type Map  = [(Room, [Room])]

dungeon :: Map
dungeon =
  [ ("entry",  ["hall", "cellar"])
  , ("hall",   ["entry", "throne", "garden"])
  , ("cellar", ["entry"])
  , ("throne", ["hall"])
  , ("garden", ["hall", "lake"])
  , ("lake",   ["garden"])
  ]
`;

const pagesBlock = [
  "```",
  "type Page = String",
  "type Web  = [(Page, [Page])]",
  "",
  "pages =",
  "  [ (\"home\",   [\"blog\", \"shop\"])",
  "  , (\"blog\",   [\"home\", \"post\"])",
  "  , (\"post\",   [\"blog\"])",
  "  , (\"shop\",   [\"home\", \"cart\"])",
  "  , (\"cart\",   [\"shop\"])",
  "  , (\"hidden\", [\"home\"])",
  "  ]",
  "```",
];

const pagesSetup =
  libs +
  hs`
type Page = String
type Web  = [(Page, [Page])]

pages :: Web
pages =
  [ ("home",   ["blog", "shop"])
  , ("blog",   ["home", "post"])
  , ("post",   ["blog"])
  , ("shop",   ["home", "cart"])
  , ("cart",   ["shop"])
  , ("hidden", ["home"])
  ]
`;

const filesBlock = [
  "```",
  "type File = String",
  "type Deps = [(File, [File])]",
  "",
  "deps =",
  "  [ (\"Main\", [\"A\", \"B\"])",
  "  , (\"A\",    [\"C\"])",
  "  , (\"B\",    [\"C\", \"D\"])",
  "  , (\"C\",    [])",
  "  , (\"D\",    [])",
  "  ]",
  "```",
];

const filesSetup =
  libs +
  hs`
type File = String
type Deps = [(File, [File])]

deps :: Deps
deps =
  [ ("Main", ["A", "B"])
  , ("A",    ["C"])
  , ("B",    ["C", "D"])
  , ("C",    [])
  , ("D",    [])
  ]
`;

const rumourBlock = [
  "```",
  "type Name  = String",
  "type Chats = [(Name, [Name])]",
  "",
  "chats =",
  "  [ (\"mia\",  [\"raj\", \"tom\"])",
  "  , (\"raj\",  [\"kim\"])",
  "  , (\"tom\",  [\"kim\", \"zoe\"])",
  "  , (\"kim\",  [])",
  "  , (\"zoe\",  [\"mia\"])",
  "  , (\"ned\",  [\"pat\"])",
  "  , (\"pat\",  [])",
  "  ]",
  "```",
];

const rumourSetup =
  libs +
  hs`
type Name  = String
type Chats = [(Name, [Name])]

chats :: Chats
chats =
  [ ("mia", ["raj", "tom"])
  , ("raj", ["kim"])
  , ("tom", ["kim", "zoe"])
  , ("kim", [])
  , ("zoe", ["mia"])
  , ("ned", ["pat"])
  , ("pat", [])
  ]
`;

const wildlifeBlock = [
  "```",
  "type Patch = String",
  "type Land  = [(Patch, [Patch])]",
  "",
  "land =",
  "  [ (\"oak\",   [\"pond\", \"ridge\"])",
  "  , (\"pond\",  [\"oak\"])",
  "  , (\"ridge\", [\"oak\", \"cliff\"])",
  "  , (\"cliff\", [\"ridge\"])",
  "  , (\"marsh\", [\"fen\"])",
  "  , (\"fen\",   [\"marsh\"])",
  "  , (\"peak\",  [])",
  "  ]",
  "```",
];

const wildlifeSetup =
  libs +
  hs`
type Patch = String
type Land  = [(Patch, [Patch])]

land :: Land
land =
  [ ("oak",   ["pond", "ridge"])
  , ("pond",  ["oak"])
  , ("ridge", ["oak", "cliff"])
  , ("cliff", ["ridge"])
  , ("marsh", ["fen"])
  , ("fen",   ["marsh"])
  , ("peak",  [])
  ]
`;

// ---------------------------------------------------------------------------
// Level 1: Warm-up
// ---------------------------------------------------------------------------

const level1: DrillSet = {
  id: "b-graphs-l1",
  lesson: "",
  level: 1,
  title: "Level 1: Warm-up",
  intro: md(
    "A graph in this book is a lookup table: each node is paired with the list of nodes you can step to in one go. That's an adjacency list.",
    "",
    "```",
    "g = [(\"A\", [\"B\", \"C\"]), (\"B\", [\"C\"]), (\"C\", [])]",
    "lookup \"A\" g     -- Just [\"B\",\"C\"]",
    "lookup \"Z\" g     -- Nothing  (Z is not a key)",
    "```",
    "",
    "Read one of these tables the same way you read any `[(key, value)]`. The value happens to be a list of neighbours.",
  ),
  drills: [
    {
      k: "quiz",
      q: "In this book a graph is stored as which kind of table?",
      options: [
        "A list of unordered pairs `(a, b)`, plus a separate list of nodes",
        "`[(Node, [Node])]`: each node paired with the nodes next to it",
        "A nested tree of nodes",
        "A list of all paths",
      ],
      answer: 1,
      why: "Each row is one node and the list of nodes you can walk to in one step. Missing from the table is not the same as being in the table with an empty list.",
    },
    {
      k: "quiz",
      q: 'What is `lookup "kitchen" [("hall", ["kitchen"]), ("kitchen", ["garden"]), ("garden", [])]`?',
      options: ['`Just "garden"`', '`Just ["garden"]`', "`Nothing`", '`["garden"]`'],
      answer: 1,
      why: "Key `\"kitchen\"` is in the table, so `lookup` gives its neighbour list wrapped in `Just`.",
    },
    {
      k: "quiz",
      q: 'What is `lookup "attic" [("hall", ["kitchen"]), ("kitchen", ["garden"])]`?',
      options: ['`Just []`', '`[]`', "`Nothing`", "It crashes"],
      answer: 2,
      why: "No pair has the key `\"attic\"`. That is not an error: `lookup` returns `Nothing`.",
    },
    {
      k: "quiz",
      q: "A node is missing from the table. What does `fromMaybe [] (lookup n g)` give?",
      options: [
        "It crashes",
        "`Nothing`",
        "The empty neighbour list `[]`",
        "The node itself, `[n]`",
      ],
      answer: 2,
      why: "`lookup` gives `Nothing`, and `fromMaybe []` turns that into `[]`. So a missing node is treated as having no neighbours. That is the usual default.",
    },
    {
      k: "quiz",
      q: 'What is `fromMaybe [] (lookup "attic" [("hall", ["kitchen"])])`?',
      options: ["`Nothing`", "`[]`", "`[\"attic\"]`", "It crashes"],
      answer: 1,
      why: "`lookup` is `Nothing`, and the default is the empty list.",
    },
    {
      k: "quiz",
      q: 'What is `length (fromMaybe [] (lookup "hall" [("hall", ["kitchen", "lounge"]), ("lounge", [])]))`?',
      options: ["`0`", "`1`", "`2`", "`Nothing`"],
      answer: 2,
      why: "Hall lists two neighbours, so its degree (outgoing) is 2.",
    },
    {
      k: "quiz",
      q: "The degree of a node, for an adjacency list, is which number?",
      options: [
        "How many nodes are in the whole table",
        "The length of that node's neighbour list",
        "Always 2, because an edge has two ends",
        "How many paths start at the node",
      ],
      answer: 1,
      why: "Each neighbour is one outgoing edge. Count them with `length`. A node with `[]` has degree 0.",
    },
    {
      k: "quiz",
      q: 'What is `map fst [("A", ["B"]), ("B", []), ("C", ["A"])]`?',
      options: ['`["B", "C", "A"]`', '`["A", "B", "C"]`', "`[]`", '`[("A", ["B"]), ("B", []), ("C", ["A"])]`'],
      answer: 1,
      why: "`fst` takes the node from each pair, so `map fst` is every key: the nodes the table knows about.",
    },
    {
      k: "quiz",
      q: '`g` contains `("A", ["B"])` and `("B", [])`. Can you walk from B to A in one step?',
      options: [
        "Yes: an edge always works both ways",
        "No: the table is directed unless B also lists A",
        "Yes, because A is in the table",
        "Only if A and B are strings",
      ],
      answer: 1,
      why: "An adjacency list is one-way. `A` lists `B`, so A→B is there. B lists nobody, so B→A is not. To store an undirected edge you write both directions.",
    },
    {
      k: "quiz",
      q: 'What is `snd (head [("ann", ["bo", "cy"])])`?',
      options: ['`"ann"`', '`("ann", ["bo", "cy"])`', '`["bo", "cy"]`', '`Just ["bo", "cy"]`'],
      answer: 2,
      why: "`snd` of a pair is the neighbour list. Head of a one-row table is that pair.",
    },
    {
      k: "quiz",
      q: "A node is in the table with neighbour list `[]`. What is true?",
      options: [
        "The node does not exist",
        "You cannot step anywhere from it (no outgoing edges)",
        "You cannot step to it either",
        "It must be a cycle",
      ],
      answer: 1,
      why: "Empty neighbours means no outgoing edges. Other nodes might still list it, so there can be incoming edges.",
    },
    {
      k: "quiz",
      q: 'What is `[n | (n, ns) <- [("A", ["B"]), ("B", []), ("C", ["A"])], null ns]`?',
      options: ['`["A"]`', '`["B"]`', '`["B", "C"]`', "`[]`"],
      answer: 1,
      why: "The comprehension keeps keys whose neighbour list is empty. Only `B` has `[]`.",
    },
    {
      k: "write",
      body: "Write `nodes`, which lists every node that is a key of the table, in table order. Fill in the hole.",
      starter: hs`nodes :: [(String, [String])] -> [String]
nodes g = map undefined g
`,
      tests: [
        { expr: 'nodes [("A", ["B"]), ("B", [])]', expected: '["A", "B"]' },
        { expr: "nodes []", expected: "[]" },
        { expr: 'nodes [("hall", ["kitchen"])]', expected: '["hall"]' },
        { expr: 'nodes [("x", []), ("y", ["x"]), ("z", [])]', expected: '["x", "y", "z"]' },
      ],
      hint: "`fst` takes the key of each pair.",
      solution: hs`nodes :: [(String, [String])] -> [String]
nodes g = map fst g
`,
    },
    {
      k: "write",
      body: md(
        "Write `neighbours g n`, the nodes you can step to from `n` in one go. If `n` is not a key, give `[]`.",
        "",
        "Fill in the default and the key.",
      ),
      setup: libs,
      starter: hs`neighbours :: [(String, [String])] -> String -> [String]
neighbours g n = fromMaybe undefined (lookup undefined g)
`,
      tests: [
        { expr: 'neighbours [("A", ["B", "C"]), ("B", [])] "A"', expected: '["B", "C"]' },
        { expr: 'neighbours [("A", ["B", "C"]), ("B", [])] "B"', expected: "[]" },
        { expr: 'neighbours [("A", ["B"])] "Z"', expected: "[]", label: "missing key: no neighbours" },
        { expr: 'neighbours [] "A"', expected: "[]" },
      ],
      hint: "`fromMaybe [] (lookup n g)`.",
      solution: hs`neighbours :: [(String, [String])] -> String -> [String]
neighbours g n = fromMaybe [] (lookup n g)
`,
    },
    {
      k: "write",
      body: "Write `degree g n`, how many outgoing neighbours `n` has. A missing node has degree 0. Fill in the hole.",
      setup: libs,
      starter: hs`degree :: [(String, [String])] -> String -> Int
degree g n = undefined (fromMaybe [] (lookup n g))
`,
      tests: [
        { expr: 'degree [("A", ["B", "C"]), ("C", [])] "A"', expected: "2" },
        { expr: 'degree [("A", ["B", "C"]), ("C", [])] "C"', expected: "0" },
        { expr: 'degree [("A", ["B"])] "Z"', expected: "0" },
        { expr: 'degree [] "A"', expected: "0" },
      ],
      hint: "The hole is `length`.",
      solution: hs`degree :: [(String, [String])] -> String -> Int
degree g n = length (fromMaybe [] (lookup n g))
`,
    },
  ],
};

const level1rest: DrillSet["drills"] = [
  {
    k: "write",
    body: "Write `hasNode g n`, which is `True` when `n` is a key of the table.",
    starter: hs`hasNode :: [(String, [String])] -> String -> Bool
hasNode g n = undefined
`,
    tests: [
      { expr: 'hasNode [("A", ["B"]), ("B", [])] "B"', expected: "True" },
      { expr: 'hasNode [("A", ["B"]), ("B", [])] "Z"', expected: "False" },
      { expr: 'hasNode [("A", ["Z"])] "Z"', expected: "False", label: "appearing as a neighbour is not being a key" },
      { expr: 'hasNode [] "A"', expected: "False" },
    ],
    hint: "`elem n (map fst g)`.",
    solution: hs`hasNode :: [(String, [String])] -> String -> Bool
hasNode g n = elem n (map fst g)
`,
  },
  {
    k: "write",
    body: "Write `hasArrow g a b`, which is `True` when `b` is listed as a neighbour of `a`.",
    setup: libs,
    starter: hs`hasArrow :: [(String, [String])] -> String -> String -> Bool
hasArrow g a b = undefined
`,
    tests: [
      { expr: 'hasArrow [("A", ["B", "C"]), ("B", [])] "A" "C"', expected: "True" },
      { expr: 'hasArrow [("A", ["B", "C"]), ("B", [])] "B" "A"', expected: "False" },
      { expr: 'hasArrow [("A", ["B"])] "Z" "A"', expected: "False" },
      { expr: 'hasArrow [("A", ["A"])] "A" "A"', expected: "True", label: "a self-loop is an arrow" },
    ],
    hint: "`elem b (fromMaybe [] (lookup a g))`.",
    solution: hs`hasArrow :: [(String, [String])] -> String -> String -> Bool
hasArrow g a b = elem b (fromMaybe [] (lookup a g))
`,
  },
  {
    k: "write",
    body: "Write `sinks g`, the keys whose neighbour list is empty, in table order. Fill in the condition.",
    starter: hs`sinks :: [(String, [String])] -> [String]
sinks g = [ n | (n, ns) <- g, undefined ]
`,
    tests: [
      { expr: 'sinks [("A", ["B"]), ("B", []), ("C", [])]', expected: '["B", "C"]' },
      { expr: 'sinks [("A", ["B"])]', expected: "[]" },
      { expr: "sinks []", expected: "[]" },
      { expr: 'sinks [("x", [])]', expected: '["x"]' },
    ],
    hint: "`null ns` is `True` when the neighbour list is empty.",
    solution: hs`sinks :: [(String, [String])] -> [String]
sinks g = [ n | (n, ns) <- g, null ns ]
`,
  },
  {
    k: "write",
    body: "Write `fromComprehension g n`, the neighbours of `n`, by walking the table with a list comprehension (do not use `lookup`). A missing node gives `[]`. Fill in the output.",
    starter: hs`fromComprehension :: [(String, [String])] -> String -> [String]
fromComprehension g n = [ undefined | (a, ns) <- g, a == n, b <- ns ]
`,
    tests: [
      { expr: 'fromComprehension [("A", ["B", "C"]), ("B", ["A"])] "A"', expected: '["B", "C"]' },
      { expr: 'fromComprehension [("A", ["B", "C"]), ("B", ["A"])] "B"', expected: '["A"]' },
      { expr: 'fromComprehension [("A", ["B"])] "Z"', expected: "[]" },
      { expr: 'fromComprehension [("A", [])] "A"', expected: "[]" },
    ],
    hint: "You are already looping `b <- ns` for the matching row. Output `b`.",
    solution: hs`fromComprehension :: [(String, [String])] -> String -> [String]
fromComprehension g n = [ b | (a, ns) <- g, a == n, b <- ns ]
`,
  },
  {
    k: "write",
    body: "Write `mentioned g`, every node that appears in any neighbour list, in the order they are written, duplicates kept.",
    starter: hs`mentioned :: [(String, [String])] -> [String]
mentioned g = undefined
`,
    tests: [
      { expr: 'mentioned [("A", ["B", "C"]), ("B", ["C"])]', expected: '["B", "C", "C"]' },
      { expr: 'mentioned [("A", [])]', expected: "[]" },
      { expr: "mentioned []", expected: "[]" },
      { expr: 'mentioned [("A", ["A"])]', expected: '["A"]' },
    ],
    hint: "`concatMap snd g`, or `[b | (_, ns) <- g, b <- ns]`.",
    solution: hs`mentioned :: [(String, [String])] -> [String]
mentioned g = concatMap snd g
`,
  },
  {
    k: "write",
    body: "Write `dropNode n g`, which removes the row for `n` and also strips `n` out of every remaining neighbour list. Keep table order.",
    starter: hs`dropNode :: String -> [(String, [String])] -> [(String, [String])]
dropNode n g = undefined
`,
    tests: [
      { expr: 'dropNode "B" [("A", ["B", "C"]), ("B", ["C"]), ("C", [])]', expected: '[("A", ["C"]), ("C", [])]' },
      { expr: 'dropNode "Z" [("A", ["B"])]', expected: '[("A", ["B"])]' },
      { expr: 'dropNode "A" [("A", ["A"])]', expected: "[]" },
      { expr: 'dropNode "A" []', expected: "[]" },
    ],
    hint: "Keep rows with `a /= n`, and replace each `ns` by `filter (/= n) ns`.",
    solution: hs`dropNode :: String -> [(String, [String])] -> [(String, [String])]
dropNode n g = [ (a, filter (/= n) ns) | (a, ns) <- g, a /= n ]
`,
  },
  {
    k: "write",
    body: "Write `pointedAtBy g n`, the keys that list `n` as a neighbour, in table order. (These are the incoming neighbours.)",
    starter: hs`pointedAtBy :: [(String, [String])] -> String -> [String]
pointedAtBy g n = undefined
`,
    tests: [
      { expr: 'pointedAtBy [("A", ["C"]), ("B", ["C"]), ("C", ["A"])] "C"', expected: '["A", "B"]' },
      { expr: 'pointedAtBy [("A", ["C"]), ("B", ["C"]), ("C", ["A"])] "A"', expected: '["C"]' },
      { expr: 'pointedAtBy [("A", ["B"])] "Z"', expected: "[]" },
      { expr: 'pointedAtBy [] "A"', expected: "[]" },
    ],
    hint: "`[a | (a, ns) <- g, elem n ns]`.",
    solution: hs`pointedAtBy :: [(String, [String])] -> String -> [String]
pointedAtBy g n = [ a | (a, ns) <- g, elem n ns ]
`,
  },
  {
    k: "write",
    body: "Write `busy g k`, the keys that have strictly more than `k` neighbours, in table order.",
    starter: hs`busy :: [(String, [String])] -> Int -> [String]
busy g k = undefined
`,
    tests: [
      { expr: 'busy [("A", ["B", "C"]), ("B", ["C"]), ("C", [])] 1', expected: '["A"]' },
      { expr: 'busy [("A", ["B", "C"]), ("B", ["C"]), ("C", [])] 0', expected: '["A", "B"]' },
      { expr: 'busy [("A", ["B"])] 5', expected: "[]" },
      { expr: "busy [] 0", expected: "[]" },
    ],
    hint: "`[a | (a, ns) <- g, length ns > k]`.",
    solution: hs`busy :: [(String, [String])] -> Int -> [String]
busy g k = [ a | (a, ns) <- g, length ns > k ]
`,
  },
  {
    k: "write",
    body: "Write `edgeCount g`, the total number of outgoing arrows (the sum of the lengths of the neighbour lists).",
    starter: hs`edgeCount :: [(String, [String])] -> Int
edgeCount g = undefined
`,
    tests: [
      { expr: 'edgeCount [("A", ["B", "C"]), ("B", ["C"]), ("C", [])]', expected: "3" },
      { expr: 'edgeCount [("A", [])]', expected: "0" },
      { expr: "edgeCount []", expected: "0" },
      { expr: 'edgeCount [("A", ["A", "A"])]', expected: "2", label: "listed twice: two arrows" },
    ],
    hint: "`sum (map (length . snd) g)`.",
    solution: hs`edgeCount :: [(String, [String])] -> Int
edgeCount g = sum (map (length . snd) g)
`,
  },
  {
    k: "write",
    body: "Write `hasSelfLoop g`, which is `True` when some node lists itself as a neighbour.",
    starter: hs`hasSelfLoop :: [(String, [String])] -> Bool
hasSelfLoop g = undefined
`,
    tests: [
      { expr: 'hasSelfLoop [("A", ["B"]), ("B", ["B"])]', expected: "True" },
      { expr: 'hasSelfLoop [("A", ["B"]), ("B", ["A"])]', expected: "False" },
      { expr: "hasSelfLoop []", expected: "False" },
      { expr: 'hasSelfLoop [("A", ["A", "B"])]', expected: "True" },
    ],
    hint: "`or [elem n ns | (n, ns) <- g]`.",
    solution: hs`hasSelfLoop :: [(String, [String])] -> Bool
hasSelfLoop g = or [ elem n ns | (n, ns) <- g ]
`,
  },
  {
    k: "write",
    body: "Write `alsoBack g a b`, which is `True` when `a` lists `b` and `b` lists `a`. Missing keys count as listing nobody.",
    setup: libs,
    starter: hs`alsoBack :: [(String, [String])] -> String -> String -> Bool
alsoBack g a b = undefined
`,
    tests: [
      { expr: 'alsoBack [("A", ["B"]), ("B", ["A"])] "A" "B"', expected: "True" },
      { expr: 'alsoBack [("A", ["B"]), ("B", [])] "A" "B"', expected: "False" },
      { expr: 'alsoBack [("A", ["B"])] "A" "B"', expected: "False" },
      { expr: 'alsoBack [("A", ["A"])] "A" "A"', expected: "True" },
    ],
    hint: "Two `elem` checks, each with `fromMaybe [] (lookup ... g)`.",
    solution: hs`alsoBack :: [(String, [String])] -> String -> String -> Bool
alsoBack g a b =
  elem b (fromMaybe [] (lookup a g)) && elem a (fromMaybe [] (lookup b g))
`,
  },
  {
    k: "write",
    body: "Write `setNeighbours n ns g`. If `n` is a key, replace its neighbour list with `ns` (same position). If it isn't, leave the table unchanged.",
    starter: hs`setNeighbours :: String -> [String] -> [(String, [String])] -> [(String, [String])]
setNeighbours n ns g = undefined
`,
    tests: [
      { expr: 'setNeighbours "B" ["A"] [("A", ["B"]), ("B", [])]', expected: '[("A", ["B"]), ("B", ["A"])]' },
      { expr: 'setNeighbours "Z" ["A"] [("A", ["B"])]', expected: '[("A", ["B"])]' },
      { expr: 'setNeighbours "A" [] [("A", ["B", "C"])]', expected: '[("A", [])]' },
      { expr: 'setNeighbours "A" ["X"] []', expected: "[]" },
    ],
    hint: "`[if a == n then (a, ns) else (a, old) | (a, old) <- g]`.",
    solution: hs`setNeighbours :: String -> [String] -> [(String, [String])] -> [(String, [String])]
setNeighbours n ns g = [ if a == n then (a, ns) else (a, old) | (a, old) <- g ]
`,
  },
  {
    k: "write",
    body: "Write `addNode n ns g`. If `n` is already a key, leave the table unchanged. Otherwise append `(n, ns)` at the end.",
    starter: hs`addNode :: String -> [String] -> [(String, [String])] -> [(String, [String])]
addNode n ns g = undefined
`,
    tests: [
      { expr: 'addNode "C" ["A"] [("A", ["B"])]', expected: '[("A", ["B"]), ("C", ["A"])]' },
      { expr: 'addNode "A" ["Z"] [("A", ["B"])]', expected: '[("A", ["B"])]', label: "existing key: unchanged" },
      { expr: 'addNode "A" [] []', expected: '[("A", [])]' },
      { expr: 'addNode "B" ["A"] [("A", []), ("C", [])]', expected: '[("A", []), ("C", []), ("B", ["A"])]' },
    ],
    hint: "Guard on `elem n (map fst g)`. If present, return `g`; otherwise `g ++ [(n, ns)]`.",
    solution: hs`addNode :: String -> [String] -> [(String, [String])] -> [(String, [String])]
addNode n ns g
  | elem n (map fst g) = g
  | otherwise          = g ++ [(n, ns)]
`,
  },
  {
    k: "write",
    body: "Write `inDegree g n`, how many keys list `n` as a neighbour. (A node that is only a key, never listed, has in-degree 0.)",
    starter: hs`inDegree :: [(String, [String])] -> String -> Int
inDegree g n = undefined
`,
    tests: [
      { expr: 'inDegree [("A", ["C"]), ("B", ["C"]), ("C", ["A"])] "C"', expected: "2" },
      { expr: 'inDegree [("A", ["C"]), ("B", ["C"]), ("C", ["A"])] "B"', expected: "0" },
      { expr: 'inDegree [("A", ["A"])] "A"', expected: "1" },
      { expr: 'inDegree [] "A"', expected: "0" },
    ],
    hint: "`length [a | (a, ns) <- g, elem n ns]`.",
    solution: hs`inDegree :: [(String, [String])] -> String -> Int
inDegree g n = length [ a | (a, ns) <- g, elem n ns ]
`,
  },
  {
    k: "write",
    body: "Write `isolates g`, keys that have no outgoing neighbours and are never listed by anyone else, in table order.",
    starter: hs`isolates :: [(String, [String])] -> [String]
isolates g = undefined
`,
    tests: [
      { expr: 'isolates [("A", ["B"]), ("B", []), ("C", [])]', expected: '["C"]' },
      { expr: 'isolates [("A", []), ("B", ["A"])]', expected: "[]", label: "A is listed by B" },
      { expr: 'isolates [("A", [])]', expected: '["A"]' },
      { expr: "isolates []", expected: "[]" },
    ],
    hint: "Keep `n` when `null ns` and `notElem n (concatMap snd g)`.",
    solution: hs`isolates :: [(String, [String])] -> [String]
isolates g = [ n | (n, ns) <- g, null ns, notElem n (concatMap snd g) ]
`,
  },
];

// ---------------------------------------------------------------------------
// Level 2: Standard
// ---------------------------------------------------------------------------

const level2: DrillSet = {
  id: "b-graphs-l2",
  lesson: "",
  level: 2,
  title: "Level 2: Standard",
  intro: md(
    "To walk a graph you keep two lists: a to-do list of nodes still to look at, and a seen list of nodes already handled. Without the seen list, a cycle such as A→B→A never finishes.",
    "",
    "```",
    "go [] seen = seen",
    "go (x : todo) seen",
    "  | elem x seen = go todo seen",
    "  | otherwise   = go (todo ++ nbrs) (seen ++ [x])   -- nbrs added at the BACK: BFS",
    "```",
    "",
    "Put neighbours on the front of `todo` instead and the same shape is depth-first (a stack). Put them on the back and it is breadth-first (a queue).",
  ),
  drills: [
    {
      k: "quiz",
      q: "You search A→B→A without a seen list. What happens?",
      options: [
        "You get `[\"A\", \"B\"]` and stop",
        "The to-do list never empties, so the search never finishes",
        "A pattern-match error",
        "You get `[]`",
      ],
      answer: 1,
      why: "Each visit to A adds B, each visit to B adds A. The seen list is what makes the walk finite.",
    },
    {
      k: "quiz",
      q: "You take the next node from the front of `todo` and add its neighbours to the back. What walk is that?",
      options: [
        "Depth-first (a stack)",
        "Breadth-first (a queue)",
        "Random",
        "It only works on trees",
      ],
      answer: 1,
      why: "Front-off, back-on is a queue. You finish a node’s whole layer of neighbours before going deeper. That’s BFS.",
    },
    {
      k: "quiz",
      q: "Same walk, but you add neighbours to the front of `todo`. What walk is that?",
      options: [
        "Breadth-first (a queue)",
        "Depth-first (a stack)",
        "Shortest-path search",
        "It loops on every graph",
      ],
      answer: 1,
      why: "Front-off, front-on is a stack. You dive down one branch before the others. That’s DFS. It is not the way to get fewest hops.",
    },
    {
      k: "quiz",
      q: "Graph `1→2,3; 2→4; 3→4`. BFS from 1 puts neighbours on the back of `todo`. What visit order do you get?",
      options: ["`[1, 2, 4, 3]`", "`[1, 2, 3, 4]`", "`[1, 3, 2, 4]`", "`[4, 3, 2, 1]`"],
      answer: 1,
      why: "Neighbours go on the back, so after 1 you look at 2 then 3 (the queue), then 4. That’s BFS visit order.",
    },
    {
      k: "quiz",
      q: "Same graph, DFS from 1 puts neighbours on the front of `todo`. What visit order do you get?",
      options: ["`[1, 2, 3, 4]`", "`[1, 2, 4, 3]`", "`[1, 4, 2, 3]`", "`[4, 2, 1, 3]`"],
      answer: 1,
      why: "Neighbours go on the front, so after 1 you look at 2, then 2’s neighbour 4, then 3. That’s DFS visit order.",
    },
    {
      k: "quiz",
      q: "Why is the first time BFS reaches a node a shortest walk (fewest arrows)?",
      options: [
        "BFS always follows the numbered order of nodes",
        "BFS expands every node 1 step away, then every node 2 steps away, so the first arrival is a closest one",
        "DFS gets there first on every graph",
        "It isn’t: you still have to check every path",
      ],
      answer: 1,
      why: "A queue finishes the close nodes before the far ones. The first time the target comes off the queue, no shorter walk is still waiting.",
    },
    {
      k: "quiz",
      q: "You start a walk at `Z`, which is not a key of the table. What is the seen list when you finish?",
      options: ["`[]`", '`["Z"]`', "`Nothing`", "The search never finishes"],
      answer: 1,
      why: "`Z` is not a key, so it has no neighbours. The seen list is just `[\"Z\"]`. A walk always includes its start.",
    },
    {
      k: "quiz",
      q: "When should you mark a node as seen in BFS on a big graph?",
      options: [
        "Only when you take it off the queue",
        "When you first add it to the queue, so you don’t enqueue it again",
        "Never; the queue is enough",
        "After the search finishes",
      ],
      answer: 1,
      why: "If you wait until you pop it, many copies of the same node can sit on the queue. Mark it when you first discover it.",
    },
    {
      k: "write",
      body: "Write `neighbours g n` and `degree g n` for an adjacency list. Missing nodes have no neighbours and degree 0.",
      setup: libs,
      starter: hs`neighbours :: [(String, [String])] -> String -> [String]
neighbours g n = undefined

degree :: [(String, [String])] -> String -> Int
degree g n = undefined
`,
      tests: [
        { expr: 'neighbours [("A", ["C", "B"]), ("B", [])] "A"', expected: '["C", "B"]' },
        { expr: 'degree [("A", ["C", "B"]), ("B", [])] "A"', expected: "2" },
        { expr: 'degree [("A", ["C", "B"]), ("B", [])] "Z"', expected: "0" },
        { expr: 'neighbours [] "A"', expected: "[]" },
      ],
      hint: "`fromMaybe [] (lookup n g)`, then `length` of that.",
      solution: hs`neighbours :: [(String, [String])] -> String -> [String]
neighbours g n = fromMaybe [] (lookup n g)

degree :: [(String, [String])] -> String -> Int
degree g n = length (neighbours g n)
`,
    },
    {
      k: "write",
      body: "Write `inNeighbours g n`, every key that lists `n`, in table order.",
      starter: hs`inNeighbours :: [(String, [String])] -> String -> [String]
inNeighbours g n = undefined
`,
      tests: [
        { expr: 'inNeighbours [("A", ["C"]), ("B", ["A", "C"]), ("C", [])] "C"', expected: '["A", "B"]' },
        { expr: 'inNeighbours [("A", ["C"]), ("B", ["A", "C"]), ("C", [])] "B"', expected: "[]" },
        { expr: 'inNeighbours [("A", ["A"])] "A"', expected: '["A"]' },
        { expr: "inNeighbours [] \"x\"", expected: "[]" },
      ],
      hint: "`[a | (a, ns) <- g, elem n ns]`.",
      solution: hs`inNeighbours :: [(String, [String])] -> String -> [String]
inNeighbours g n = [ a | (a, ns) <- g, elem n ns ]
`,
    },
    {
      k: "write",
      body: md(
        "Write `reverseGraph g`, the table the other way round: each node that appears (as a key or as a neighbour) is a key, listed in first-appearance order, and its neighbours are the nodes that used to point to it, in the order those arrows are found.",
        "",
        "Nodes that only appear as neighbours still get a row.",
      ),
      setup: libs,
      starter: hs`reverseGraph :: [(String, [String])] -> [(String, [String])]
reverseGraph g = undefined
`,
      tests: [
        { expr: 'reverseGraph [("A", ["B"]), ("B", ["C"]), ("C", [])]', expected: '[("A", []), ("B", ["A"]), ("C", ["B"])]' },
        { expr: 'reverseGraph [("A", ["B", "C"])]', expected: '[("A", []), ("B", ["A"]), ("C", ["A"])]' },
        { expr: "reverseGraph []", expected: "[]" },
        { expr: 'reverseGraph [("A", ["A"])]', expected: '[("A", ["A"])]' },
      ],
      hint: "The keys are `nub (map fst g ++ concatMap snd g)`. For each key `k`, the new neighbours are `[a | (a, ns) <- g, elem k ns]`.",
      solution: hs`reverseGraph :: [(String, [String])] -> [(String, [String])]
reverseGraph g = [ (k, [ a | (a, ns) <- g, elem k ns ]) | k <- nub (map fst g ++ concatMap snd g) ]
`,
    },
    {
      k: "write",
      body: "Write `makeUndirected g`. For every arrow a→b, make sure b→a is there too. Keep the original keys in order; if `b` is not a key, append a new row at the end the first time you need it. Neighbour lists should not contain duplicates.",
      setup: libs,
      starter: hs`makeUndirected :: [(String, [String])] -> [(String, [String])]
makeUndirected g = undefined
`,
      tests: [
        { expr: 'makeUndirected [("A", ["B"]), ("B", [])]', expected: '[("A", ["B"]), ("B", ["A"])]' },
        { expr: 'makeUndirected [("A", ["B"])]', expected: '[("A", ["B"]), ("B", ["A"])]' },
        { expr: 'makeUndirected [("A", ["B"]), ("B", ["A"])]', expected: '[("A", ["B"]), ("B", ["A"])]' },
        { expr: "makeUndirected []", expected: "[]" },
      ],
      hint: "Keys: `nub (map fst g ++ concatMap snd g)`. For each key `k`, neighbours are `nub (fromMaybe [] (lookup k g) ++ [a | (a, ns) <- g, elem k ns])`.",
      solution: hs`makeUndirected :: [(String, [String])] -> [(String, [String])]
makeUndirected g =
  [ (k, nub (fromMaybe [] (lookup k g) ++ [ a | (a, ns) <- g, elem k ns ]))
  | k <- nub (map fst g ++ concatMap snd g)
  ]
`,
    },
    {
      k: "write",
      body: md(
        "Write `reachable g start`: every node you can get to from `start` by following arrows (any number of steps), including `start` itself. Use a to-do list and a seen list so cycles stop. Order does not matter, but there must be no duplicates.",
      ),
      setup: libs,
      starter: hs`reachable :: [(String, [String])] -> String -> [String]
reachable g start = undefined
`,
      tests: [
        { expr: 'reachable [("A", ["B"]), ("B", ["C"]), ("C", [])] "A"', expected: '["A", "B", "C"]', unordered: true },
        { expr: 'reachable [("A", ["B"]), ("B", ["C"]), ("C", [])] "C"', expected: '["C"]', unordered: true },
        { expr: 'reachable [("A", ["B"]), ("B", ["A"])] "A"', expected: '["A", "B"]', unordered: true },
        { expr: 'reachable [("A", ["B"])] "Z"', expected: '["Z"]', unordered: true },
        { expr: 'reachable [("A", ["B"]), ("C", ["D"])] "A"', expected: '["A", "B"]', unordered: true },
      ],
      hint: "`go [start] []`. Skip a node already in `seen`. Otherwise put it in `seen` and append `fromMaybe [] (lookup x g)` to the to-do list.",
      solution: hs`reachable :: [(String, [String])] -> String -> [String]
reachable g start = go [start] []
  where
    go [] seen = seen
    go (x : todo) seen
      | elem x seen = go todo seen
      | otherwise   = go (todo ++ fromMaybe [] (lookup x g)) (x : seen)
`,
    },
    {
      k: "write",
      body: "Write `hasPath g a b`, which is `True` when `b` is reachable from `a` (including `a == b`). It must finish on graphs with cycles.",
      setup: libs,
      starter: hs`hasPath :: [(String, [String])] -> String -> String -> Bool
hasPath g a b = undefined
`,
      tests: [
        { expr: 'hasPath [("A", ["B"]), ("B", ["C"]), ("C", [])] "A" "C"', expected: "True" },
        { expr: 'hasPath [("A", ["B"]), ("B", ["C"]), ("C", [])] "C" "A"', expected: "False" },
        { expr: 'hasPath [("A", ["B"]), ("B", ["A"])] "A" "B"', expected: "True" },
        { expr: 'hasPath [("A", ["B"])] "A" "A"', expected: "True" },
        { expr: 'hasPath [] "X" "Y"', expected: "False" },
      ],
      hint: "Walk with a seen list from `a`, then `elem b` of the seen nodes.",
      solution: hs`hasPath :: [(String, [String])] -> String -> String -> Bool
hasPath g a b = elem b (go [a] [])
  where
    go [] seen = seen
    go (x : todo) seen
      | elem x seen = go todo seen
      | otherwise   = go (todo ++ fromMaybe [] (lookup x g)) (x : seen)
`,
    },
    {
      k: "write",
      body: md(
        "Write `bfsVisit g start`, the order nodes are first seen in a breadth-first walk from `start`.",
        "",
        "Use this shape: take from the front of `todo`; if unseen, append its neighbours to the back and append the node to `seen`.",
      ),
      setup: tinySetup,
      starter: hs`bfsVisit :: [(Int, [Int])] -> Int -> [Int]
bfsVisit g start = undefined
`,
      tests: [
        { expr: "bfsVisit tiny 1", expected: "[1, 2, 3, 4]" },
        { expr: "bfsVisit tiny 2", expected: "[2, 4]" },
        { expr: "bfsVisit tiny 4", expected: "[4]" },
        { expr: "bfsVisit tiny 9", expected: "[9]" },
      ],
      hint: "`go (todo ++ fromMaybe [] (lookup x g)) (seen ++ [x])`.",
      solution: hs`bfsVisit :: [(Int, [Int])] -> Int -> [Int]
bfsVisit g start = go [start] []
  where
    go [] seen = seen
    go (x : todo) seen
      | elem x seen = go todo seen
      | otherwise   = go (todo ++ fromMaybe [] (lookup x g)) (seen ++ [x])
`,
    },
    {
      k: "write",
      body: md(
        "Write `dfsVisit g start`, the order nodes are first seen in a depth-first walk from `start`.",
        "",
        "Same as BFS, but put neighbours on the front of `todo`.",
      ),
      setup: tinySetup,
      starter: hs`dfsVisit :: [(Int, [Int])] -> Int -> [Int]
dfsVisit g start = undefined
`,
      tests: [
        { expr: "dfsVisit tiny 1", expected: "[1, 2, 4, 3]" },
        { expr: "dfsVisit tiny 3", expected: "[3, 4]" },
        { expr: "dfsVisit [(1, [2]), (2, [1])] 1", expected: "[1, 2]" },
        { expr: "dfsVisit tiny 4", expected: "[4]" },
      ],
      hint: "`go (fromMaybe [] (lookup x g) ++ todo) (seen ++ [x])`.",
      solution: hs`dfsVisit :: [(Int, [Int])] -> Int -> [Int]
dfsVisit g start = go [start] []
  where
    go [] seen = seen
    go (x : todo) seen
      | elem x seen = go todo seen
      | otherwise   = go (fromMaybe [] (lookup x g) ++ todo) (seen ++ [x])
`,
    },
    {
      k: "write",
      body: "Write `sources g`, keys with in-degree 0 (nobody lists them), in table order.",
      starter: hs`sources :: [(String, [String])] -> [String]
sources g = undefined
`,
      tests: [
        { expr: 'sources [("A", ["B"]), ("B", ["C"]), ("C", [])]', expected: '["A"]' },
        { expr: 'sources [("A", ["B"]), ("B", ["A"])]', expected: "[]" },
        { expr: 'sources [("A", []), ("B", [])]', expected: '["A", "B"]' },
        { expr: "sources []", expected: "[]" },
      ],
      hint: "A key `n` is a source when `notElem n (concatMap snd g)`.",
      solution: hs`sources :: [(String, [String])] -> [String]
sources g = [ n | (n, _) <- g, notElem n (concatMap snd g) ]
`,
    },
    {
      k: "write",
      body: "Write `addArrow g a b`. Add `b` at the end of `a`'s neighbour list if it is not already there. If `a` is not a key, append a new row `(a, [b])`. Do not add a row for `b`.",
      setup: libs,
      starter: hs`addArrow :: [(String, [String])] -> String -> String -> [(String, [String])]
addArrow g a b = undefined
`,
      tests: [
        { expr: 'addArrow [("A", ["B"]), ("B", [])] "A" "C"', expected: '[("A", ["B", "C"]), ("B", [])]' },
        { expr: 'addArrow [("A", ["B"]), ("B", [])] "A" "B"', expected: '[("A", ["B"]), ("B", [])]', label: "already there" },
        { expr: 'addArrow [("A", ["B"])] "C" "A"', expected: '[("A", ["B"]), ("C", ["A"])]' },
        { expr: 'addArrow [] "A" "B"', expected: '[("A", ["B"])]' },
      ],
      hint: "If `a` is a key, map over the rows and append `b` when needed. Otherwise `g ++ [(a, [b])]`.",
      solution: hs`addArrow :: [(String, [String])] -> String -> String -> [(String, [String])]
addArrow g a b
  | elem a (map fst g) = [ if x == a && notElem b ns then (x, ns ++ [b]) else (x, ns) | (x, ns) <- g ]
  | otherwise          = g ++ [(a, [b])]
`,
    },
    {
      k: "write",
      body: "Write `removeArrow g a b`, which drops `b` from `a`'s neighbour list. Other rows are unchanged. If `a` is missing, the table is unchanged.",
      starter: hs`removeArrow :: [(String, [String])] -> String -> String -> [(String, [String])]
removeArrow g a b = undefined
`,
      tests: [
        { expr: 'removeArrow [("A", ["B", "C"]), ("B", ["C"])] "A" "B"', expected: '[("A", ["C"]), ("B", ["C"])]' },
        { expr: 'removeArrow [("A", ["B", "C"]), ("B", ["C"])] "A" "Z"', expected: '[("A", ["B", "C"]), ("B", ["C"])]' },
        { expr: 'removeArrow [("A", ["B"])] "Z" "B"', expected: '[("A", ["B"])]' },
        { expr: 'removeArrow [] "A" "B"', expected: "[]" },
      ],
      hint: "`[if x == a then (x, filter (/= b) ns) else (x, ns) | (x, ns) <- g]`.",
      solution: hs`removeArrow :: [(String, [String])] -> String -> String -> [(String, [String])]
removeArrow g a b = [ if x == a then (x, filter (/= b) ns) else (x, ns) | (x, ns) <- g ]
`,
    },
    {
      k: "write",
      body: "Write `commonNeighbours g a b`, nodes that appear in both neighbour lists, in the order they appear in `a`'s list.",
      setup: libs,
      starter: hs`commonNeighbours :: [(String, [String])] -> String -> String -> [String]
commonNeighbours g a b = undefined
`,
      tests: [
        { expr: 'commonNeighbours [("A", ["X", "Y", "Z"]), ("B", ["Y", "W", "X"])] "A" "B"', expected: '["X", "Y"]' },
        { expr: 'commonNeighbours [("A", ["X"]), ("B", ["Y"])] "A" "B"', expected: "[]" },
        { expr: 'commonNeighbours [("A", ["X"])] "A" "B"', expected: "[]" },
        { expr: 'commonNeighbours [("A", ["X", "X"]), ("B", ["X"])] "A" "B"', expected: '["X", "X"]' },
      ],
      hint: "Keep `n` from `a`'s list when `elem n` of `b`'s list.",
      solution: hs`commonNeighbours :: [(String, [String])] -> String -> String -> [String]
commonNeighbours g a b = [ n | n <- na, elem n nb ]
  where
    na = fromMaybe [] (lookup a g)
    nb = fromMaybe [] (lookup b g)
`,
    },
    {
      k: "write",
      body: "Write `keepOnly ns g`, which keeps only the rows whose key is in `ns`, and also drops neighbour entries that are not in `ns`. Keep table order.",
      starter: hs`keepOnly :: [String] -> [(String, [String])] -> [(String, [String])]
keepOnly ns g = undefined
`,
      tests: [
        { expr: 'keepOnly ["A", "C"] [("A", ["B", "C"]), ("B", ["C"]), ("C", ["A"])]', expected: '[("A", ["C"]), ("C", ["A"])]' },
        { expr: 'keepOnly [] [("A", ["B"])]', expected: "[]" },
        { expr: 'keepOnly ["A"] [("A", [])]', expected: '[("A", [])]' },
        { expr: 'keepOnly ["Z"] [("A", ["Z"])]', expected: "[]" },
      ],
      hint: "`[(a, filter (`elem` ns) bs) | (a, bs) <- g, elem a ns]` — write `elem x ns` instead of backticks.",
      solution: hs`keepOnly :: [String] -> [(String, [String])] -> [(String, [String])]
keepOnly ns g = [ (a, filter (\x -> elem x ns) bs) | (a, bs) <- g, elem a ns ]
`,
    },
    {
      k: "write",
      body: "Write `twoHops g n`, every node you can reach in exactly two arrows from `n`, in the order you find them, duplicates kept if two routes land on the same node.",
      setup: libs,
      starter: hs`twoHops :: [(String, [String])] -> String -> [String]
twoHops g n = undefined
`,
      tests: [
        { expr: 'twoHops [("A", ["B", "C"]), ("B", ["D"]), ("C", ["D"]), ("D", [])] "A"', expected: '["D", "D"]' },
        { expr: 'twoHops [("A", ["B"]), ("B", ["A"])] "A"', expected: '["A"]' },
        { expr: 'twoHops [("A", [])] "A"', expected: "[]" },
        { expr: 'twoHops [("A", ["B"])] "Z"', expected: "[]" },
      ],
      hint: "For each neighbour `m` of `n`, output each neighbour of `m`.",
      solution: hs`twoHops :: [(String, [String])] -> String -> [String]
twoHops g n = [ y | x <- fromMaybe [] (lookup n g), y <- fromMaybe [] (lookup x g) ]
`,
    },
    {
      k: "write",
      body: "Write `reachableSize g start`, how many distinct nodes (including `start`) a walk from `start` can reach.",
      setup: libs,
      starter: hs`reachableSize :: [(String, [String])] -> String -> Int
reachableSize g start = undefined
`,
      tests: [
        { expr: 'reachableSize [("A", ["B"]), ("B", ["C"]), ("C", [])] "A"', expected: "3" },
        { expr: 'reachableSize [("A", ["B"]), ("B", ["A"])] "A"', expected: "2" },
        { expr: 'reachableSize [("A", ["B"])] "Z"', expected: "1" },
        { expr: 'reachableSize [("A", ["B"]), ("C", ["D"])] "C"', expected: "2" },
      ],
      hint: "`length` of the seen list after a walk from `start`.",
      solution: hs`reachableSize :: [(String, [String])] -> String -> Int
reachableSize g start = length (go [start] [])
  where
    go [] seen = seen
    go (x : todo) seen
      | elem x seen = go todo seen
      | otherwise   = go (todo ++ fromMaybe [] (lookup x g)) (x : seen)
`,
    },
    {
      k: "write",
      body: "Write `isSymmetric g`, which is `True` when every arrow has a matching arrow the other way. (A self-loop counts as matching itself.)",
      setup: libs,
      starter: hs`isSymmetric :: [(String, [String])] -> Bool
isSymmetric g = undefined
`,
      tests: [
        { expr: 'isSymmetric [("A", ["B"]), ("B", ["A"])]', expected: "True" },
        { expr: 'isSymmetric [("A", ["B"]), ("B", [])]', expected: "False" },
        { expr: 'isSymmetric [("A", ["A"])]', expected: "True" },
        { expr: "isSymmetric []", expected: "True" },
      ],
      hint: "For every `b` in `a`'s list, `a` must be in `b`'s list.",
      solution: hs`isSymmetric :: [(String, [String])] -> Bool
isSymmetric g =
  and [ elem a (fromMaybe [] (lookup b g)) | (a, ns) <- g, b <- ns ]
`,
    },
    {
      k: "write",
      body: "Write `further g start`, the reachable nodes from `start` except `start` itself. Order does not matter.",
      setup: libs,
      starter: hs`further :: [(String, [String])] -> String -> [String]
further g start = undefined
`,
      tests: [
        { expr: 'further [("A", ["B"]), ("B", ["C"]), ("C", [])] "A"', expected: '["B", "C"]', unordered: true },
        { expr: 'further [("A", ["B"]), ("B", ["A"])] "A"', expected: '["B"]', unordered: true },
        { expr: 'further [("A", [])] "A"', expected: "[]" },
        { expr: 'further [("A", ["B"])] "Z"', expected: "[]" },
      ],
      hint: "Walk with a seen list, then `filter (/= start)`.",
      solution: hs`further :: [(String, [String])] -> String -> [String]
further g start = filter (/= start) (go [start] [])
  where
    go [] seen = seen
    go (x : todo) seen
      | elem x seen = go todo seen
      | otherwise   = go (todo ++ fromMaybe [] (lookup x g)) (x : seen)
`,
    },
    {
      k: "write",
      body: "Using the house map in the given code, write `exits room`, the rooms you can step to from `room`. A missing room has no exits.",
      setup: houseSetup,
      starter: hs`exits :: String -> [String]
exits room = undefined
`,
      tests: [
        { expr: 'exits "hall"', expected: '["kitchen", "lounge"]' },
        { expr: 'exits "study"', expected: "[]" },
        { expr: 'exits "attic"', expected: "[]" },
        { expr: 'exits "kitchen"', expected: '["hall", "garden"]' },
      ],
      hint: "`fromMaybe [] (lookup room house)`.",
      solution: hs`exits :: String -> [String]
exits room = fromMaybe [] (lookup room house)
`,
    },
    {
      k: "write",
      body: "Using the house map, write `deadEnds`, the rooms in `house` you cannot leave, in table order.",
      setup: houseSetup,
      starter: hs`deadEnds :: [String]
deadEnds = undefined
`,
      tests: [
        { expr: "deadEnds", expected: '["study", "garden"]' },
        { expr: 'elem "hall" deadEnds', expected: "False" },
        { expr: "length deadEnds", expected: "2" },
        { expr: 'elem "study" deadEnds', expected: "True" },
      ],
      hint: "`[r | (r, ns) <- house, null ns]`.",
      solution: hs`deadEnds :: [String]
deadEnds = [ r | (r, ns) <- house, null ns ]
`,
    },
    {
      k: "write",
      body: "Write `maxDegree g`, the largest outgoing neighbour-list length in the table. The empty table has max degree 0.",
      starter: hs`maxDegree :: [(String, [String])] -> Int
maxDegree g = undefined
`,
      tests: [
        { expr: 'maxDegree [("A", ["B", "C"]), ("B", ["C"]), ("C", [])]', expected: "2" },
        { expr: 'maxDegree [("A", [])]', expected: "0" },
        { expr: "maxDegree []", expected: "0" },
        { expr: 'maxDegree [("A", ["X"]), ("B", ["X", "Y", "Z"])]', expected: "3" },
      ],
      hint: "If `g` is empty, 0; otherwise `maximum (map (length . snd) g)`.",
      solution: hs`maxDegree :: [(String, [String])] -> Int
maxDegree [] = 0
maxDegree g  = maximum (map (length . snd) g)
`,
    },
    {
      k: "write",
      body: "Write `withDegree g d`, the keys whose neighbour list has length exactly `d`, in table order.",
      starter: hs`withDegree :: [(String, [String])] -> Int -> [String]
withDegree g d = undefined
`,
      tests: [
        { expr: 'withDegree [("A", ["B", "C"]), ("B", ["C"]), ("C", [])] 1', expected: '["B"]' },
        { expr: 'withDegree [("A", ["B", "C"]), ("B", ["C"]), ("C", [])] 0', expected: '["C"]' },
        { expr: 'withDegree [("A", ["B"])] 2', expected: "[]" },
        { expr: "withDegree [] 0", expected: "[]" },
      ],
      hint: "`[n | (n, ns) <- g, length ns == d]`.",
      solution: hs`withDegree :: [(String, [String])] -> Int -> [String]
withDegree g d = [ n | (n, ns) <- g, length ns == d ]
`,
    },
    {
      k: "write",
      body: "Write `firstOut g n`, the first neighbour of `n` as `Just` that node, or `Nothing` if `n` is missing or has an empty list.",
      setup: libs,
      starter: hs`firstOut :: [(String, [String])] -> String -> Maybe String
firstOut g n = undefined
`,
      tests: [
        { expr: 'firstOut [("A", ["B", "C"]), ("B", [])] "A"', expected: 'Just "B"' },
        { expr: 'firstOut [("A", ["B", "C"]), ("B", [])] "B"', expected: "Nothing" },
        { expr: 'firstOut [("A", ["B"])] "Z"', expected: "Nothing" },
        { expr: 'firstOut [] "A"', expected: "Nothing" },
      ],
      hint: "`case fromMaybe [] (lookup n g) of [] -> Nothing; (x:_) -> Just x`.",
      solution: hs`firstOut :: [(String, [String])] -> String -> Maybe String
firstOut g n =
  case fromMaybe [] (lookup n g) of
    []      -> Nothing
    (x : _) -> Just x
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 3: Stretch
// ---------------------------------------------------------------------------

const level3: DrillSet = {
  id: "b-graphs-l3",
  lesson: "",
  level: 3,
  title: "Level 3: Stretch",
  intro: md(
    "Three patterns share a to-do list: shortest path (BFS, keep the path you took), connected pieces (repeat a walk from each leftover node), and “until nothing changes” (do one round of spreading or rewriting, stop when the new value equals the old).",
    "",
    "```",
    "step infected = nub (infected ++ neighbours of everyone in infected)",
    "go xs | step xs == xs = xs",
    "      | otherwise     = go (step xs)",
    "```",
    "",
    "A cycle is there if some node can reach itself in one or more steps: start a walk from its neighbours and see if it shows up.",
  ),
  drills: [
    {
      k: "quiz",
      q: "You want the fewest arrows from A to B. Which to-do list is the right tool?",
      options: [
        "A stack (neighbours on the front): DFS",
        "A queue (neighbours on the back): BFS",
        "Either; both give a shortest walk",
        "Sort the nodes and scan once",
      ],
      answer: 1,
      why: "BFS reaches nodes in order of hops. The first time B comes off the queue, that walk is a shortest one. DFS can wander down a long branch first.",
    },
    {
      k: "quiz",
      q: "A rumour starts at Ann. Each round, everyone who already knows it tells their neighbour list. When do you stop?",
      options: [
        "After as many rounds as there are people",
        "When a round adds nobody new (the set of knowers is a fixed point)",
        "When Ann’s neighbour list is empty",
        "After one round",
      ],
      answer: 1,
      why: "One round may not be enough: news can travel along a chain. Stop when the set stops growing.",
    },
    {
      k: "quiz",
      q: 'Ann lists Bo, Bo lists Cy. One rumour-step from `[\"ann\"]` (add every neighbour of everyone who already knows) gives which set?',
      options: ['`["ann"]`', '`["ann", "bo"]`', '`["ann", "bo", "cy"]`', '`["bo"]`'],
      answer: 1,
      why: "Ann tells Bo. Cy is two steps away, so this round doesn’t reach Cy yet.",
    },
    {
      k: "quiz",
      q: "Same chain Ann→Bo→Cy. You repeat the rumour-step until the set of knowers stops growing. Who has heard it?",
      options: ['`["ann"]`', '`["ann", "bo"]`', '`["ann", "bo", "cy"]`', '`["cy"]`'],
      answer: 2,
      why: "`[ann]`, then `[ann,bo]`, then `[ann,bo,cy]`, then nothing new. That last set is the fixed point.",
    },
    {
      k: "quiz",
      q: "On an undirected map (both directions listed), the connected piece containing York is which set?",
      options: [
        "York’s neighbour list only",
        "Every node reachable from York, including York",
        "Every node in the table",
        "The nodes with degree 0",
      ],
      answer: 1,
      why: "Because edges go both ways, “can reach from York” is exactly the towns in York’s piece of the map.",
    },
    {
      k: "quiz",
      q: "How can you tell there is a cycle using reachability?",
      options: [
        "Some neighbour list is empty",
        "Some node `n` is reachable from one of its neighbours (so `n` can get back to itself)",
        "The table has at least three rows",
        "BFS and DFS visit orders differ",
      ],
      answer: 1,
      why: "If a neighbour of `n` can walk to `n`, there is a loop through `n`. A self-loop is the one-step case.",
    },
    {
      k: "write",
      body: "Write `reachable g start` again, as a whole function. Include `start`, allow cycles, order does not matter.",
      setup: libs,
      starter: hs`reachable :: [(String, [String])] -> String -> [String]
reachable g start = undefined
`,
      tests: [
        { expr: 'reachable [("A", ["B", "C"]), ("B", ["A"]), ("C", [])] "A"', expected: '["A", "B", "C"]', unordered: true },
        { expr: 'reachable [("A", ["B", "C"]), ("B", ["A"]), ("C", [])] "C"', expected: '["C"]', unordered: true },
        { expr: 'reachable [] "Q"', expected: '["Q"]', unordered: true },
        { expr: 'reachable [("A", ["B"]), ("C", ["D"])] "C"', expected: '["C", "D"]', unordered: true },
      ],
      hint: "To-do list plus seen list. Append neighbours to the to-do list.",
      solution: hs`reachable :: [(String, [String])] -> String -> [String]
reachable g start = go [start] []
  where
    go [] seen = seen
    go (x : todo) seen
      | elem x seen = go todo seen
      | otherwise   = go (todo ++ fromMaybe [] (lookup x g)) (x : seen)
`,
    },
    {
      k: "write",
      body: "Write `hops g a b`, the fewest arrows from `a` to `b` as `Just n`, or `Nothing` if `b` cannot be reached. `hops g a a` is `Just 0`. Use BFS.",
      setup: libs,
      starter: hs`hops :: [(String, [String])] -> String -> String -> Maybe Int
hops g a b = undefined
`,
      tests: [
        { expr: 'hops [("A", ["B", "C"]), ("B", ["D"]), ("C", ["D"]), ("D", [])] "A" "D"', expected: "Just 2" },
        { expr: 'hops [("A", ["B", "C"]), ("B", ["D"]), ("C", ["D"]), ("D", [])] "A" "A"', expected: "Just 0" },
        { expr: 'hops [("A", ["B"]), ("B", [])] "B" "A"', expected: "Nothing" },
        { expr: 'hops [("A", ["B"]), ("B", ["A"])] "A" "B"', expected: "Just 1" },
        { expr: 'hops [] "X" "Y"', expected: "Nothing" },
      ],
      hint: "Queue of `(node, dist)`. Mark seen when you enqueue. When you take `b` off the queue, return `Just dist`.",
      solution: hs`hops :: [(String, [String])] -> String -> String -> Maybe Int
hops g a b = bfs [(a, 0)] [a]
  where
    bfs [] _ = Nothing
    bfs ((x, d) : rest) seen
      | x == b    = Just d
      | otherwise = bfs (rest ++ [ (n, d + 1) | n <- new ]) (seen ++ new)
      where
        new = [ n | n <- fromMaybe [] (lookup x g), notElem n seen ]
`,
    },
    {
      k: "write",
      body: "Write `shortestPath g a b`, one walk from `a` to `b` with fewest arrows, as `Just [a,...,b]`, or `Nothing`. If `a == b` the path is `Just [a]`. Use BFS and keep the path with each queue item.",
      setup: libs,
      starter: hs`shortestPath :: [(String, [String])] -> String -> String -> Maybe [String]
shortestPath g a b = undefined
`,
      tests: [
        { expr: 'shortestPath [("A", ["B", "C"]), ("B", ["D"]), ("C", ["D"]), ("D", [])] "A" "D"', expected: 'Just ["A", "B", "D"]' },
        { expr: 'shortestPath [("A", ["B", "C"]), ("B", ["D"]), ("C", ["D"]), ("D", [])] "A" "A"', expected: 'Just ["A"]' },
        { expr: 'shortestPath [("A", ["B"]), ("B", [])] "B" "A"', expected: "Nothing" },
        { expr: 'shortestPath [("A", ["B"]), ("B", ["C"]), ("C", [])] "A" "C"', expected: 'Just ["A", "B", "C"]' },
      ],
      hint: "Store the path reversed, current node at the front: `p@(x:_)`. New items are `n : p`. When `x == b`, `Just (reverse p)`. Mark seen when enqueueing.",
      solution: hs`shortestPath :: [(String, [String])] -> String -> String -> Maybe [String]
shortestPath g a b = bfs [[a]] [a]
  where
    bfs [] _ = Nothing
    bfs (p@(x : _) : rest) seen
      | x == b    = Just (reverse p)
      | otherwise = bfs (rest ++ [ n : p | n <- new ]) (seen ++ new)
      where
        new = [ n | n <- fromMaybe [] (lookup x g), notElem n seen ]
    bfs _ _ = Nothing
`,
    },
    {
      k: "write",
      body: "Write `within g k start`, every node you can reach from `start` in at most `k` arrows, including `start`. Order does not matter.",
      setup: libs,
      starter: hs`within :: [(String, [String])] -> Int -> String -> [String]
within g k start = undefined
`,
      tests: [
        { expr: 'within [("A", ["B"]), ("B", ["C"]), ("C", ["D"]), ("D", [])] 0 "A"', expected: '["A"]', unordered: true },
        { expr: 'within [("A", ["B"]), ("B", ["C"]), ("C", ["D"]), ("D", [])] 2 "A"', expected: '["A", "B", "C"]', unordered: true },
        { expr: 'within [("A", ["B"]), ("B", ["A"])] 5 "A"', expected: '["A", "B"]', unordered: true },
        { expr: 'within [("A", ["B"])] 3 "Z"', expected: '["Z"]', unordered: true },
      ],
      hint: "BFS queue of `(node, dist)`. Skip neighbours when `dist == k`. Collect seen nodes.",
      solution: hs`within :: [(String, [String])] -> Int -> String -> [String]
within g k start = bfs [(start, 0)] [start]
  where
    bfs [] seen = seen
    bfs ((x, d) : rest) seen
      | d == k    = bfs rest seen
      | otherwise = bfs (rest ++ [ (n, d + 1) | n <- new ]) (seen ++ new)
      where
        new = [ n | n <- fromMaybe [] (lookup x g), notElem n seen ]
`,
    },
    {
      k: "write",
      body: md(
        "Write `hasCycle g`. There is a cycle if some key `n` can be reached from one of its neighbours (a walk of one or more arrows that returns to `n`). Self-loops count.",
      ),
      setup: libs,
      starter: hs`hasCycle :: [(String, [String])] -> Bool
hasCycle g = undefined
`,
      tests: [
        { expr: 'hasCycle [("A", ["B"]), ("B", ["C"]), ("C", [])]', expected: "False" },
        { expr: 'hasCycle [("A", ["B"]), ("B", ["A"])]', expected: "True" },
        { expr: 'hasCycle [("A", ["A"])]', expected: "True" },
        { expr: 'hasCycle [("A", ["B"]), ("B", ["C"]), ("C", ["A"])]', expected: "True" },
        { expr: "hasCycle []", expected: "False" },
      ],
      hint: "For each key `n`, walk from `fromMaybe [] (lookup n g)` with a seen list, and ask `elem n`.",
      solution: hs`hasCycle :: [(String, [String])] -> Bool
hasCycle g = any leadsBack (map fst g)
  where
    leadsBack n = elem n (go (fromMaybe [] (lookup n g)) [])
    go [] seen = seen
    go (x : todo) seen
      | elem x seen = go todo seen
      | otherwise   = go (todo ++ fromMaybe [] (lookup x g)) (x : seen)
`,
    },
    {
      k: "write",
      body: md(
        "The given roads map lists both directions. Write `component g start`, every town in the same piece of the map as `start`. Order does not matter.",
      ),
      setup: roadsSetup,
      starter: hs`component :: Graph -> String -> [String]
component g start = undefined
`,
      tests: [
        { expr: 'component roads "York"', expected: '["York", "Leeds", "Hull", "Sheffield"]', unordered: true },
        { expr: 'component roads "Sheffield"', expected: '["York", "Leeds", "Hull", "Sheffield"]', unordered: true },
        { expr: 'component roads "Oban"', expected: '["Oban"]', unordered: true },
        { expr: 'component [("A", ["B"]), ("B", ["A"]), ("C", [])] "C"', expected: '["C"]', unordered: true },
      ],
      hint: "On an undirected table this is just `reachable`.",
      solution: hs`component :: Graph -> String -> [String]
component g start = go [start] []
  where
    go [] seen = seen
    go (x : todo) seen
      | elem x seen = go todo seen
      | otherwise   = go (todo ++ fromMaybe [] (lookup x g)) (x : seen)
`,
    },
    {
      k: "write",
      body: md(
        "Still undirected. Write `components g`, the list of connected pieces. Each piece is a list of nodes. Use table order to pick the next unused key, then take its whole component. Sort each piece so the tests don’t care about visit order.",
      ),
      setup: libs + types,
      starter: hs`components :: Graph -> [[String]]
components g = undefined
`,
      tests: [
        { expr: 'components [("A", ["B"]), ("B", ["A"]), ("C", [])]', expected: '[["A", "B"], ["C"]]' },
        { expr: 'components [("A", [])]', expected: '[["A"]]' },
        { expr: "components []", expected: "[]" },
        { expr: 'components [("P", ["Q"]), ("Q", ["P"]), ("R", ["S"]), ("S", ["R"])]', expected: '[["P", "Q"], ["R", "S"]]' },
      ],
      hint: "`go (map fst g)`: take `x`, `c = sort (reachable x)`, then recurse on keys not in `c`.",
      solution: hs`components :: Graph -> [[String]]
components g = go (map fst g)
  where
    go [] = []
    go (x : xs) = sort (reach x) : go [ y | y <- xs, notElem y (reach x) ]
    reach start = walk [start] []
    walk [] seen = seen
    walk (x : todo) seen
      | elem x seen = walk todo seen
      | otherwise   = walk (todo ++ fromMaybe [] (lookup x g)) (x : seen)
`,
    },
    {
      k: "write",
      body: "Write `isConnected g` for an undirected table: every key is reachable from the first key. The empty table counts as connected.",
      setup: libs,
      starter: hs`isConnected :: [(String, [String])] -> Bool
isConnected g = undefined
`,
      tests: [
        { expr: 'isConnected [("A", ["B"]), ("B", ["A", "C"]), ("C", ["B"])]', expected: "True" },
        { expr: 'isConnected [("A", ["B"]), ("B", ["A"]), ("C", [])]', expected: "False" },
        { expr: "isConnected []", expected: "True" },
        { expr: 'isConnected [("A", [])]', expected: "True" },
      ],
      hint: "Empty: `True`. Otherwise walk from `fst (head g)` and check you saw every key.",
      solution: hs`isConnected :: [(String, [String])] -> Bool
isConnected [] = True
isConnected g  = all (\n -> elem n seen) (map fst g)
  where
    start = fst (head g)
    seen  = walk [start] []
    walk [] s = s
    walk (x : todo) s
      | elem x s  = walk todo s
      | otherwise = walk (todo ++ fromMaybe [] (lookup x g)) (x : s)
`,
    },
    {
      k: "write",
      body: "Write `infectStep g infected`: one round of a rumour. Everyone already in `infected` stays; add every neighbour of those people. No duplicates, original people first, then new names in the order you find them.",
      setup: libs,
      starter: hs`infectStep :: [(String, [String])] -> [String] -> [String]
infectStep g infected = undefined
`,
      tests: [
        { expr: 'infectStep [("ann", ["bo"]), ("bo", ["cy"]), ("cy", [])] ["ann"]', expected: '["ann", "bo"]' },
        { expr: 'infectStep [("ann", ["bo"]), ("bo", ["cy"]), ("cy", [])] ["ann", "bo"]', expected: '["ann", "bo", "cy"]' },
        { expr: 'infectStep [("ann", ["bo"]), ("bo", ["cy"]), ("cy", [])] ["ann", "bo", "cy"]', expected: '["ann", "bo", "cy"]' },
        { expr: 'infectStep [("ann", ["bo"])] []', expected: "[]" },
      ],
      hint: "`nub (infected ++ concat [fromMaybe [] (lookup x g) | x <- infected])`.",
      solution: hs`infectStep :: [(String, [String])] -> [String] -> [String]
infectStep g infected =
  nub (infected ++ concat [ fromMaybe [] (lookup x g) | x <- infected ])
`,
    },
    {
      k: "write",
      body: "Write `outbreak g seeds`, the people who eventually hear a rumour that starts with `seeds`. Repeat `infectStep` until the set stops changing. Order does not matter.",
      setup: libs,
      starter: hs`outbreak :: [(String, [String])] -> [String] -> [String]
outbreak g seeds = undefined
`,
      tests: [
        { expr: 'outbreak [("ann", ["bo"]), ("bo", ["cy"]), ("cy", [])] ["ann"]', expected: '["ann", "bo", "cy"]', unordered: true },
        { expr: 'outbreak [("ann", ["bo"]), ("bo", ["cy"]), ("cy", [])] ["cy"]', expected: '["cy"]', unordered: true },
        { expr: 'outbreak [("a", ["b"]), ("b", ["a"]), ("c", [])] ["a"]', expected: '["a", "b"]', unordered: true },
        { expr: 'outbreak [("a", ["b"])] []', expected: "[]" },
      ],
      hint: "`go xs | next == xs = xs | otherwise = go next` where `next = infectStep g xs`.",
      solution: hs`outbreak :: [(String, [String])] -> [String] -> [String]
outbreak g seeds = go seeds
  where
    go xs
      | next == xs = xs
      | otherwise  = go next
      where
        next = nub (xs ++ concat [ fromMaybe [] (lookup x g) | x <- xs ])
`,
    },
    {
      k: "write",
      body: md(
        "Write `grow g`, one round of “add the neighbours of my neighbours”. Each key keeps its row. The new neighbour list is the old one plus every neighbour-of-a-neighbour, duplicates removed, sorted.",
      ),
      setup: libs,
      starter: hs`grow :: [(String, [String])] -> [(String, [String])]
grow g = undefined
`,
      tests: [
        { expr: 'grow [("A", ["B"]), ("B", ["C"]), ("C", [])]', expected: '[("A", ["B", "C"]), ("B", ["C"]), ("C", [])]' },
        { expr: 'grow [("A", ["B"]), ("B", ["A"])]', expected: '[("A", ["A", "B"]), ("B", ["A", "B"])]' },
        { expr: 'grow [("A", [])]', expected: '[("A", [])]' },
        { expr: "grow []", expected: "[]" },
      ],
      hint: "For `(a, bs)`, extras are `concat [fromMaybe [] (lookup b g) | b <- bs]`. Then `sort (nub (bs ++ extras))`.",
      solution: hs`grow :: [(String, [String])] -> [(String, [String])]
grow g =
  [ (a, sort (nub (bs ++ concat [ fromMaybe [] (lookup b g) | b <- bs ])))
  | (a, bs) <- g
  ]
`,
    },
    {
      k: "write",
      body: "Write `closure g`, repeat `grow` until the table stops changing. That is the fixed point: every node that can be reached in any number of steps is listed as a neighbour (the node itself appears only if there is a cycle back to it).",
      setup: libs,
      starter: hs`closure :: [(String, [String])] -> [(String, [String])]
closure g = undefined
`,
      tests: [
        { expr: 'closure [("A", ["B"]), ("B", ["C"]), ("C", [])]', expected: '[("A", ["B", "C"]), ("B", ["C"]), ("C", [])]' },
        { expr: 'closure [("A", ["B"]), ("B", ["A"])]', expected: '[("A", ["A", "B"]), ("B", ["A", "B"])]' },
        { expr: 'closure [("A", [])]', expected: '[("A", [])]' },
        { expr: 'lookup "A" (closure [("A", ["B"]), ("B", ["C"]), ("C", ["D"]), ("D", [])])', expected: 'Just ["B", "C", "D"]' },
      ],
      hint: "Reuse `grow`. Stop when `grow g == g`.",
      solution: hs`closure :: [(String, [String])] -> [(String, [String])]
closure g
  | next == g = g
  | otherwise = closure next
  where
    next =
      [ (a, sort (nub (bs ++ concat [ fromMaybe [] (lookup b g) | b <- bs ])))
      | (a, bs) <- g
      ]
`,
    },
    {
      k: "write",
      body: "Write `canArrive g n`, everyone who can reach `n` (including `n`), by walking the reversed arrows. Order does not matter.",
      setup: libs,
      starter: hs`canArrive :: [(String, [String])] -> String -> [String]
canArrive g n = undefined
`,
      tests: [
        { expr: 'canArrive [("A", ["B"]), ("B", ["C"]), ("C", [])] "C"', expected: '["A", "B", "C"]', unordered: true },
        { expr: 'canArrive [("A", ["B"]), ("B", ["C"]), ("C", [])] "A"', expected: '["A"]', unordered: true },
        { expr: 'canArrive [("A", ["B"]), ("B", ["A"])] "A"', expected: '["A", "B"]', unordered: true },
        { expr: 'canArrive [("A", ["B"])] "Z"', expected: '["Z"]', unordered: true },
      ],
      hint: "Build the reverse table (every mentioned name is a key), then `reachable` from `n`.",
      solution: hs`canArrive :: [(String, [String])] -> String -> [String]
canArrive g n = walk [n] []
  where
    rev =
      [ (k, [ a | (a, ns) <- g, elem k ns ])
      | k <- nub (n : map fst g ++ concatMap snd g)
      ]
    walk [] seen = seen
    walk (x : todo) seen
      | elem x seen = walk todo seen
      | otherwise   = walk (todo ++ fromMaybe [] (lookup x rev)) (x : seen)
`,
    },
    {
      k: "write",
      body: "Write `countPaths g a b`, how many walks go from `a` to `b` on a graph with no cycles. The empty walk counts as 1 when `a == b`.",
      setup: libs,
      starter: hs`countPaths :: [(String, [String])] -> String -> String -> Int
countPaths g a b = undefined
`,
      tests: [
        { expr: 'countPaths [("A", ["B", "C"]), ("B", ["D"]), ("C", ["D"]), ("D", [])] "A" "D"', expected: "2" },
        { expr: 'countPaths [("A", ["B", "C"]), ("B", ["D"]), ("C", ["D"]), ("D", [])] "A" "A"', expected: "1" },
        { expr: 'countPaths [("A", ["B"]), ("B", [])] "B" "A"', expected: "0" },
        { expr: 'countPaths [("A", ["B", "C"]), ("B", ["C"]), ("C", [])] "A" "C"', expected: "2" },
      ],
      hint: "If `a == b` then 1, else sum `countPaths g n b` over neighbours of `a`. Duplicate keys: `lookup` uses the first row; avoid duplicate keys in tests or `concat` all matching rows. Use `fromMaybe [] (lookup a g)`.",
      solution: hs`countPaths :: [(String, [String])] -> String -> String -> Int
countPaths g a b
  | a == b    = 1
  | otherwise = sum [ countPaths g n b | n <- fromMaybe [] (lookup a g) ]
`,
    },
    {
      k: "write",
      body: "Write `without g n`, the table with node `n` deleted (row gone, and `n` stripped from every neighbour list). Then write `stillReach g a b n`: can you get from `a` to `b` without using `n`? If `a == n` or `b == n` the answer is `False` unless `a == b` and `a /= n` is impossible — if either end is `n`, return `False`.",
      setup: libs,
      starter: hs`without :: [(String, [String])] -> String -> [(String, [String])]
without g n = undefined

stillReach :: [(String, [String])] -> String -> String -> String -> Bool
stillReach g a b n = undefined
`,
      tests: [
        { expr: 'without [("A", ["B", "C"]), ("B", ["C"]), ("C", [])] "B"', expected: '[("A", ["C"]), ("C", [])]' },
        { expr: 'stillReach [("A", ["B"]), ("B", ["C"]), ("C", [])] "A" "C" "B"', expected: "False" },
        { expr: 'stillReach [("A", ["B", "C"]), ("B", ["C"]), ("C", [])] "A" "C" "B"', expected: "True" },
        { expr: 'stillReach [("A", ["B"]), ("B", [])] "A" "B" "A"', expected: "False" },
        { expr: 'stillReach [("A", ["B"]), ("B", [])] "A" "A" "B"', expected: "True" },
      ],
      hint: "`stillReach`: if `a == n || b == n` then `a == b && a /= n`; wait, if either is `n`, `False`, except `a == b` and both aren’t `n`. Then walk `without g n`.",
      solution: hs`without :: [(String, [String])] -> String -> [(String, [String])]
without g n = [ (a, filter (/= n) ns) | (a, ns) <- g, a /= n ]

stillReach :: [(String, [String])] -> String -> String -> String -> Bool
stillReach g a b n
  | a == n || b == n = False
  | otherwise        = elem b (walk [a] [])
  where
    g' = without g n
    walk [] seen = seen
    walk (x : todo) seen
      | elem x seen = walk todo seen
      | otherwise   = walk (todo ++ fromMaybe [] (lookup x g')) (x : seen)
`,
    },
    {
      k: "write",
      body: "Write `samePiece g a b` for an undirected table: `True` when `a` and `b` are in the same connected piece.",
      setup: roadsSetup,
      starter: hs`samePiece :: Graph -> String -> String -> Bool
samePiece g a b = undefined
`,
      tests: [
        { expr: 'samePiece roads "York" "Sheffield"', expected: "True" },
        { expr: 'samePiece roads "York" "York"', expected: "True" },
        { expr: 'samePiece [("A", ["B"]), ("B", ["A"]), ("C", [])] "A" "C"', expected: "False" },
        { expr: 'samePiece roads "Hull" "Leeds"', expected: "True" },
      ],
      hint: "`elem b` of a walk from `a`.",
      solution: hs`samePiece :: Graph -> String -> String -> Bool
samePiece g a b = elem b (walk [a] [])
  where
    walk [] seen = seen
    walk (x : todo) seen
      | elem x seen = walk todo seen
      | otherwise   = walk (todo ++ fromMaybe [] (lookup x g)) (x : seen)
`,
    },
    {
      k: "write",
      body: md(
        "Write `peelSources g`: take every key whose neighbour list is empty (nothing left to wait for), in table order, and drop those keys from the table (rows gone, names stripped from remaining lists). Return `(taken, leftover)`.",
      ),
      starter: hs`peelSources :: [(String, [String])] -> ([String], [(String, [String])])
peelSources g = undefined
`,
      tests: [
        {
          expr: 'peelSources [("Main", ["A"]), ("A", ["C"]), ("C", [])]',
          expected: '(["C"], [("Main", ["A"]), ("A", [])])',
        },
        { expr: 'peelSources [("A", ["B"]), ("B", ["A"])]', expected: '([], [("A", ["B"]), ("B", ["A"])])' },
        { expr: 'peelSources [("A", []), ("B", [])]', expected: '(["A", "B"], [])' },
        { expr: "peelSources []", expected: "([], [])" },
      ],
      hint: "`taken = [n | (n, ns) <- g, null ns]`. Leftover rows: keys not in `taken`, neighbour lists filtered.",
      solution: hs`peelSources :: [(String, [String])] -> ([String], [(String, [String])])
peelSources g = (taken, leftover)
  where
    taken    = [ n | (n, ns) <- g, null ns ]
    leftover = [ (n, filter (\x -> notElem x taken) ns) | (n, ns) <- g, notElem n taken ]
`,
    },
    {
      k: "write",
      body: "Write `simplePaths g a b`, every simple path (no repeated node) from `a` to `b`. Follow neighbour-list order, depth-first. Include `[a]` when `a == b`.",
      setup: libs,
      starter: hs`simplePaths :: [(String, [String])] -> String -> String -> [[String]]
simplePaths g a b = undefined
`,
      tests: [
        { expr: 'simplePaths [("A", ["B", "C"]), ("B", ["D"]), ("C", ["D"]), ("D", [])] "A" "D"', expected: '[["A", "B", "D"], ["A", "C", "D"]]' },
        { expr: 'simplePaths [("A", ["B", "C"]), ("B", ["D"]), ("C", ["D"]), ("D", [])] "A" "A"', expected: '[["A"]]' },
        { expr: 'simplePaths [("A", ["B"]), ("B", ["A"])] "A" "B"', expected: '[["A", "B"]]' },
        { expr: 'simplePaths [("A", ["B"]), ("B", [])] "B" "A"', expected: "[]" },
      ],
      hint: "Helper `go path` with `x = last path`. If `x == b`, `[path]`. Else concat `go (path ++ [n])` for neighbours `n` not already in `path`.",
      solution: hs`simplePaths :: [(String, [String])] -> String -> String -> [[String]]
simplePaths g a b = go [a]
  where
    go path
      | x == b    = [path]
      | otherwise = concat [ go (path ++ [n]) | n <- fromMaybe [] (lookup x g), notElem n path ]
      where
        x = last path
`,
    },
    {
      k: "write",
      body: "Write `rounds g seeds`, how many infect-steps it takes until the rumour set stops growing. If `seeds` is already stable, the answer is 0.",
      setup: libs,
      starter: hs`rounds :: [(String, [String])] -> [String] -> Int
rounds g seeds = undefined
`,
      tests: [
        { expr: 'rounds [("ann", ["bo"]), ("bo", ["cy"]), ("cy", [])] ["ann"]', expected: "2" },
        { expr: 'rounds [("ann", ["bo"]), ("bo", ["cy"]), ("cy", [])] ["cy"]', expected: "0" },
        { expr: 'rounds [("a", ["b"]), ("b", ["a"])] ["a"]', expected: "1" },
        { expr: 'rounds [("a", ["b"])] []', expected: "0" },
      ],
      hint: "Count calls until `next == xs`.",
      solution: hs`rounds :: [(String, [String])] -> [String] -> Int
rounds g seeds = go seeds 0
  where
    go xs k
      | next == xs = k
      | otherwise  = go next (k + 1)
      where
        next = nub (xs ++ concat [ fromMaybe [] (lookup x g) | x <- xs ])
`,
    },
    {
      k: "write",
      body: "Write `onPath g a b`, every node that sits on at least one simple path from `a` to `b` (including `a` and `b` if a path exists). Order does not matter. If there is no path, give `[]`.",
      setup: libs,
      starter: hs`onPath :: [(String, [String])] -> String -> String -> [String]
onPath g a b = undefined
`,
      tests: [
        { expr: 'onPath [("A", ["B", "C"]), ("B", ["D"]), ("C", ["D"]), ("D", [])] "A" "D"', expected: '["A", "B", "C", "D"]', unordered: true },
        { expr: 'onPath [("A", ["B"]), ("B", ["C"]), ("C", []), ("X", ["Y"])] "A" "C"', expected: '["A", "B", "C"]', unordered: true },
        { expr: 'onPath [("A", ["B"]), ("B", [])] "B" "A"', expected: "[]" },
        { expr: 'onPath [("A", ["B"])] "A" "A"', expected: '["A"]', unordered: true },
      ],
      hint: "Generate simple paths, then `nub (concat paths)`.",
      solution: hs`onPath :: [(String, [String])] -> String -> String -> [String]
onPath g a b = nub (concat (go [a]))
  where
    go path
      | x == b    = [path]
      | otherwise = concat [ go (path ++ [n]) | n <- fromMaybe [] (lookup x g), notElem n path ]
      where
        x = last path
`,
    },
    {
      k: "write",
      body: "Using `follows` in the given code (directed “who they follow”), write `heardFrom person`, everyone whose posts `person` can eventually see by following chains, including themselves. Order does not matter.",
      setup: followsSetup,
      starter: hs`heardFrom :: String -> [String]
heardFrom person = undefined
`,
      tests: [
        { expr: 'heardFrom "ann"', expected: '["ann", "bo", "cy"]', unordered: true },
        { expr: 'heardFrom "di"', expected: '["di", "ann", "bo", "cy"]', unordered: true },
        { expr: 'heardFrom "cy"', expected: '["cy"]', unordered: true },
        { expr: 'heardFrom "zed"', expected: '["zed"]', unordered: true },
      ],
      hint: "Walk `follows` from `person` with a seen list.",
      solution: hs`heardFrom :: String -> [String]
heardFrom person = go [person] []
  where
    go [] seen = seen
    go (x : todo) seen
      | elem x seen = go todo seen
      | otherwise   = go (todo ++ fromMaybe [] (lookup x follows)) (x : seen)
`,
    },
    {
      k: "write",
      body: "Write `distances g start`, a table of `(node, hops)` for every node BFS discovers from `start`, in discovery order. The start node is `(start, 0)`.",
      setup: libs,
      starter: hs`distances :: [(String, [String])] -> String -> [(String, Int)]
distances g start = undefined
`,
      tests: [
        { expr: 'distances [("A", ["B", "C"]), ("B", ["D"]), ("C", ["D"]), ("D", [])] "A"', expected: '[("A", 0), ("B", 1), ("C", 1), ("D", 2)]' },
        { expr: 'distances [("A", ["B"]), ("B", ["A"])] "A"', expected: '[("A", 0), ("B", 1)]' },
        { expr: 'distances [("A", ["B"])] "Z"', expected: '[("Z", 0)]' },
        { expr: 'distances [("A", [])] "A"', expected: '[("A", 0)]' },
      ],
      hint: "Same BFS as `hops`, but keep an accumulator of discovered `(node, dist)` pairs, start included.",
      solution: hs`distances :: [(String, [String])] -> String -> [(String, Int)]
distances g start = bfs [(start, 0)] [start] [(start, 0)]
  where
    bfs [] _ acc = acc
    bfs ((x, d) : rest) seen acc =
      bfs (rest ++ [ (n, d + 1) | n <- new ]) (seen ++ new) (acc ++ [ (n, d + 1) | n <- new ])
      where
        new = [ n | n <- fromMaybe [] (lookup x g), notElem n seen ]
`,
    },
    {
      k: "write",
      body: "Write `sharedReach g a b`, the nodes reachable from both `a` and `b` (each walk includes its start). Order does not matter.",
      setup: libs,
      starter: hs`sharedReach :: [(String, [String])] -> String -> String -> [String]
sharedReach g a b = undefined
`,
      tests: [
        { expr: 'sharedReach [("A", ["C"]), ("B", ["C"]), ("C", ["D"]), ("D", [])] "A" "B"', expected: '["C", "D"]', unordered: true },
        { expr: 'sharedReach [("A", ["B"]), ("B", [])] "A" "B"', expected: '["B"]', unordered: true },
        { expr: 'sharedReach [("A", ["B"]), ("C", ["D"])] "A" "C"', expected: "[]" },
        { expr: 'sharedReach [("A", ["B"]), ("B", ["A"])] "A" "B"', expected: '["A", "B"]', unordered: true },
      ],
      hint: "Walk from `a` and from `b`, then keep names that appear in both seen lists.",
      solution: hs`sharedReach :: [(String, [String])] -> String -> String -> [String]
sharedReach g a b = [ x | x <- ra, elem x rb ]
  where
    ra = walk [a] []
    rb = walk [b] []
    walk [] seen = seen
    walk (x : todo) seen
      | elem x seen = walk todo seen
      | otherwise   = walk (todo ++ fromMaybe [] (lookup x g)) (x : seen)
`,
    },
    {
      k: "write",
      body: "Write `isDag g`, which is `True` when the table has no cycle (including no self-loop). The empty table is a DAG.",
      setup: libs,
      starter: hs`isDag :: [(String, [String])] -> Bool
isDag g = undefined
`,
      tests: [
        { expr: 'isDag [("A", ["B"]), ("B", ["C"]), ("C", [])]', expected: "True" },
        { expr: 'isDag [("A", ["B"]), ("B", ["A"])]', expected: "False" },
        { expr: 'isDag [("A", ["A"])]', expected: "False" },
        { expr: "isDag []", expected: "True" },
      ],
      hint: "`not` of the cycle check: some key is reachable from its own neighbours.",
      solution: hs`isDag :: [(String, [String])] -> Bool
isDag g = not (any leadsBack (map fst g))
  where
    leadsBack n = elem n (walk (fromMaybe [] (lookup n g)) [])
    walk [] seen = seen
    walk (x : todo) seen
      | elem x seen = walk todo seen
      | otherwise   = walk (todo ++ fromMaybe [] (lookup x g)) (x : seen)
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 4: Exam strength
// ---------------------------------------------------------------------------

const level4: DrillSet = {
  id: "b-graphs-l4",
  lesson: "",
  level: 4,
  title: "Level 4: Exam strength",
  intro: md(
    "Worded like a paper: a small domain, given types, then “Define a function …” and a GHCi transcript. The last eight are 4–6 mark strength: shortest route, pieces of a map, cycles, rumours that run to a fixed point, every simple path, closing under extra hops, a compile order, and the day each person hears the news.",
  ),
  drills: [
    {
      k: "quiz",
      q: "An exam stores a campus as `[(Building, [Building])]`. What is `lookup \"lab\" campus`?",
      options: [
        "Every building you can eventually walk to from the lab",
        "The buildings next door to the lab, or `Nothing` if `lab` is not a key",
        "The degree of the lab",
        "A Boolean",
      ],
      answer: 1,
      why: "`lookup` only sees one row. Walking further is a search you write yourself.",
    },
    {
      k: "quiz",
      q: "The spec says “the order of buildings does not matter”. Your function returns them in visit order. Will an `unordered` test accept it?",
      options: [
        "No; lists must match exactly",
        "Yes; the tester sorts both sides before comparing",
        "Only if you call `sort`",
        "Only for Int nodes",
      ],
      answer: 1,
      why: "When the spec says order doesn’t matter, the tester compares the two lists as sets. Duplicates would still fail.",
    },
    {
      k: "quiz",
      q: 'What is `fromMaybe [] (lookup "dorm" [("gate", ["quad"]), ("dorm", [])])`?',
      options: ["`Nothing`", "`[]`", '`["dorm"]`', '`Just []`'],
      answer: 1,
      why: "The dorm is a key with no doors out. That is different from a missing key, but `fromMaybe []` gives `[]` either way.",
    },
    {
      k: "quiz",
      q: "A question asks for a shortest route on a campus map. Which structure belongs in the answer?",
      options: [
        "A stack of buildings (DFS)",
        "A queue of routes, adding a door at the back, marking a building seen when first discovered",
        "`iterate` until the route is long enough",
        "Sort the buildings alphabetically and join them",
      ],
      answer: 1,
      why: "BFS on routes. Marking a building when you first put it on the queue stops the queue exploding and keeps the first arrival shortest.",
    },
    {
      k: "quiz",
      q: "Prerequisites are stored as `course → courses it needs`. A cycle in that table means what?",
      options: [
        "Every course is optional",
        "Some course list eventually requires itself, so that chain can never be started",
        "The table is undirected",
        "BFS will find a shortest degree",
      ],
      answer: 1,
      why: "If Calc2 needs Calc1 needs Calc2, there is no first course to take. Cycle detection is the check.",
    },
    {
      k: "quiz",
      q: '`g = [("Main", ["A"]), ("A", ["C"]), ("C", [])]`. What is `[n | (n, ns) <- g, null ns]`?',
      options: ['`["Main"]`', '`["A"]`', '`["C"]`', "`[]`"],
      answer: 2,
      why: "C lists no files, so it can be compiled first. That is one round of peeling empty neighbour lists.",
    },
    {
      k: "write",
      body: md(
        "A campus is stored as an adjacency list. The given code contains:",
        "",
        ...campusBlock,
        "",
        "Define a function `doors :: Building -> Campus -> [Building]` that returns the buildings directly connected to the given one, in table order. A building that isn’t a key has no doors. For example:",
        "",
        "```",
        "ghci> doors \"quad\" campus",
        "[\"gate\",\"library\",\"lab\"]",
        "ghci> doors \"dorm\" campus",
        "[]",
        "```",
      ),
      setup: campusSetup,
      starter: hs`doors :: Building -> Campus -> [Building]
doors b c = undefined
`,
      tests: [
        { expr: 'doors "quad" campus', expected: '["gate", "library", "lab"]' },
        { expr: 'doors "dorm" campus', expected: "[]" },
        { expr: 'doors "roof" campus', expected: "[]" },
        { expr: 'doors "cafe" campus', expected: '["gate"]' },
      ],
      hint: "`fromMaybe [] (lookup b c)`.",
      solution: hs`doors :: Building -> Campus -> [Building]
doors b c = fromMaybe [] (lookup b c)
`,
    },
    {
      k: "write",
      body: md(
        "Using the campus types:",
        "",
        ...campusBlock,
        "",
        "Define `degreeOf :: Building -> Campus -> Int`, the number of doors out of the building. A missing building has degree 0. For example:",
        "",
        "```",
        "ghci> degreeOf \"quad\" campus",
        "3",
        "ghci> degreeOf \"dorm\" campus",
        "0",
        "```",
      ),
      setup: campusSetup,
      starter: hs`degreeOf :: Building -> Campus -> Int
degreeOf b c = undefined
`,
      tests: [
        { expr: 'degreeOf "quad" campus', expected: "3" },
        { expr: 'degreeOf "dorm" campus', expected: "0" },
        { expr: 'degreeOf "roof" campus', expected: "0" },
        { expr: 'degreeOf "lab" campus', expected: "1" },
      ],
      hint: "`length (fromMaybe [] (lookup b c))`.",
      solution: hs`degreeOf :: Building -> Campus -> Int
degreeOf b c = length (fromMaybe [] (lookup b c))
`,
    },
    {
      k: "write",
      body: md(
        "Using the campus types:",
        "",
        ...campusBlock,
        "",
        "Define `locked :: Campus -> [Building]`, the buildings with no doors out, in table order. For example:",
        "",
        "```",
        "ghci> locked campus",
        "[\"dorm\"]",
        "```",
      ),
      setup: campusSetup,
      starter: hs`locked :: Campus -> [Building]
locked c = undefined
`,
      tests: [
        { expr: "locked campus", expected: '["dorm"]' },
        { expr: 'locked [("gate", ["quad"]), ("quad", [])]', expected: '["quad"]' },
        { expr: "locked []", expected: "[]" },
        { expr: 'locked [("a", ["b"]), ("b", ["a"])]', expected: "[]" },
      ],
      hint: "`[b | (b, ns) <- c, null ns]`.",
      solution: hs`locked :: Campus -> [Building]
locked c = [ b | (b, ns) <- c, null ns ]
`,
    },
    {
      k: "write",
      body: md(
        "A directed follow-table maps each person to the people they follow. Define `followsBack :: Net -> Person -> Person -> Bool` which is `True` when each of the two people lists the other. Missing people follow nobody.",
        "",
        "```",
        "ghci> followsBack [(\"ann\",[\"bo\"]),(\"bo\",[\"ann\"])] \"ann\" \"bo\"",
        "True",
        "```",
      ),
      setup: friendsSetup,
      starter: hs`followsBack :: Net -> Person -> Person -> Bool
followsBack net a b = undefined
`,
      tests: [
        { expr: 'followsBack friends "ann" "bo"', expected: "True" },
        { expr: 'followsBack friends "ann" "cy"', expected: "True" },
        { expr: 'followsBack friends "ann" "di"', expected: "False" },
        { expr: 'followsBack friends "ed" "ann"', expected: "False" },
      ],
      hint: "Two `elem` checks on `fromMaybe [] (lookup ... net)`.",
      solution: hs`followsBack :: Net -> Person -> Person -> Bool
followsBack net a b =
  elem b (fromMaybe [] (lookup a net)) && elem a (fromMaybe [] (lookup b net))
`,
    },
    {
      k: "write",
      body: md(
        "Using the campus types:",
        "",
        ...campusBlock,
        "",
        "Define `walkable :: Campus -> Building -> [Building]` that returns every building you can reach from the given one by any number of doors (including itself). The campus has loops, so keep a seen list. Order does not matter. For example:",
        "",
        "```",
        "ghci> walkable campus \"dorm\"",
        "[\"dorm\"]",
        "ghci> walkable campus \"lab\"",
        "[\"cafe\",\"gate\",\"lab\",\"library\",\"quad\"]",
        "```",
      ),
      setup: campusSetup,
      starter: hs`walkable :: Campus -> Building -> [Building]
walkable c start = undefined
`,
      tests: [
        { expr: 'walkable campus "dorm"', expected: '["dorm"]', unordered: true },
        { expr: 'walkable campus "lab"', expected: '["cafe", "gate", "lab", "library", "quad"]', unordered: true },
        { expr: 'walkable campus "gate"', expected: '["cafe", "gate", "lab", "library", "quad"]', unordered: true },
        { expr: 'walkable campus "roof"', expected: '["roof"]', unordered: true },
      ],
      hint: "`go [start] []`, skip seen nodes, append `fromMaybe [] (lookup x c)`.",
      solution: hs`walkable :: Campus -> Building -> [Building]
walkable c start = go [start] []
  where
    go [] seen = seen
    go (x : todo) seen
      | elem x seen = go todo seen
      | otherwise   = go (todo ++ fromMaybe [] (lookup x c)) (x : seen)
`,
    },
    {
      k: "write",
      body: md(
        "Using the campus types:",
        "",
        ...campusBlock,
        "",
        "Define `canWalk :: Campus -> Building -> Building -> Bool` which is `True` when there is a walk from the first building to the second (including staying put). For example:",
        "",
        "```",
        "ghci> canWalk campus \"gate\" \"lab\"",
        "True",
        "ghci> canWalk campus \"dorm\" \"gate\"",
        "False",
        "```",
      ),
      setup: campusSetup,
      starter: hs`canWalk :: Campus -> Building -> Building -> Bool
canWalk c a b = undefined
`,
      tests: [
        { expr: 'canWalk campus "gate" "lab"', expected: "True" },
        { expr: 'canWalk campus "dorm" "gate"', expected: "False" },
        { expr: 'canWalk campus "dorm" "dorm"', expected: "True" },
        { expr: 'canWalk campus "lab" "cafe"', expected: "True" },
      ],
      hint: "`elem b` of `walkable c a`.",
      solution: hs`canWalk :: Campus -> Building -> Building -> Bool
canWalk c a b = elem b (go [a] [])
  where
    go [] seen = seen
    go (x : todo) seen
      | elem x seen = go todo seen
      | otherwise   = go (todo ++ fromMaybe [] (lookup x c)) (x : seen)
`,
    },
    {
      k: "write",
      body: md(
        "Using the course guide:",
        "",
        ...courseBlock,
        "",
        "A course maps to the courses it needs first. Define `ready :: Guide -> [Course]`, the courses with an empty needs-list, in table order. For example:",
        "",
        "```",
        "ghci> ready guide",
        "[\"Calc1\",\"Alg1\"]",
        "```",
      ),
      setup: courseSetup,
      starter: hs`ready :: Guide -> [Course]
ready g = undefined
`,
      tests: [
        { expr: "ready guide", expected: '["Calc1", "Alg1"]' },
        { expr: 'ready [("X", ["Y"]), ("Y", ["X"])]', expected: "[]" },
        { expr: 'ready [("Z", [])]', expected: '["Z"]' },
        { expr: "ready []", expected: "[]" },
      ],
      hint: "`[c | (c, ns) <- g, null ns]`.",
      solution: hs`ready :: Guide -> [Course]
ready g = [ c | (c, ns) <- g, null ns ]
`,
    },
    {
      k: "write",
      body: md(
        "Using the course guide:",
        "",
        ...courseBlock,
        "",
        "Define `needsOn :: Guide -> Course -> [Course]`, every course you must have taken before `c` (follow the needs-lists any number of steps), not including `c` itself. Order does not matter. A missing course needs nothing. For example:",
        "",
        "```",
        "ghci> needsOn guide \"Project\"",
        "[\"Alg1\",\"Calc1\",\"Calc2\",\"Stats\"]",
        "```",
      ),
      setup: courseSetup,
      starter: hs`needsOn :: Guide -> Course -> [Course]
needsOn g c = undefined
`,
      tests: [
        { expr: 'needsOn guide "Project"', expected: '["Alg1", "Calc1", "Calc2", "Stats"]', unordered: true },
        { expr: 'needsOn guide "Calc1"', expected: "[]" },
        { expr: 'needsOn guide "Stats"', expected: '["Alg1", "Calc1"]', unordered: true },
        { expr: 'needsOn guide "Dance"', expected: "[]" },
      ],
      hint: "Walk from the neighbours of `c` (not from `c` itself), with a seen list.",
      solution: hs`needsOn :: Guide -> Course -> [Course]
needsOn g c = go (fromMaybe [] (lookup c g)) []
  where
    go [] seen = seen
    go (x : todo) seen
      | elem x seen = go todo seen
      | otherwise   = go (todo ++ fromMaybe [] (lookup x g)) (x : seen)
`,
    },
    {
      k: "write",
      body: md(
        "Using the web pages:",
        "",
        ...pagesBlock,
        "",
        "Define `outLinks :: Page -> Web -> Int`, how many links leave the page. A missing page has 0. For example:",
        "",
        "```",
        "ghci> outLinks \"home\" pages",
        "2",
        "```",
      ),
      setup: pagesSetup,
      starter: hs`outLinks :: Page -> Web -> Int
outLinks p w = undefined
`,
      tests: [
        { expr: 'outLinks "home" pages', expected: "2" },
        { expr: 'outLinks "post" pages', expected: "1" },
        { expr: 'outLinks "missing" pages', expected: "0" },
        { expr: 'outLinks "hidden" pages', expected: "1" },
      ],
      hint: "`length (fromMaybe [] (lookup p w))`.",
      solution: hs`outLinks :: Page -> Web -> Int
outLinks p w = length (fromMaybe [] (lookup p w))
`,
    },
    {
      k: "write",
      body: md(
        "Using the web pages:",
        "",
        ...pagesBlock,
        "",
        "Define `linkedFrom :: Page -> Web -> [Page]`, the pages that link directly to the given one, in table order. For example:",
        "",
        "```",
        "ghci> linkedFrom \"home\" pages",
        "[\"blog\",\"shop\",\"hidden\"]",
        "```",
      ),
      setup: pagesSetup,
      starter: hs`linkedFrom :: Page -> Web -> [Page]
linkedFrom p w = undefined
`,
      tests: [
        { expr: 'linkedFrom "home" pages', expected: '["blog", "shop", "hidden"]' },
        { expr: 'linkedFrom "hidden" pages', expected: "[]" },
        { expr: 'linkedFrom "post" pages', expected: '["blog"]' },
        { expr: 'linkedFrom "cart" pages', expected: '["shop"]' },
      ],
      hint: "`[a | (a, ns) <- w, elem p ns]`.",
      solution: hs`linkedFrom :: Page -> Web -> [Page]
linkedFrom p w = [ a | (a, ns) <- w, elem p ns ]
`,
    },
    {
      k: "write",
      body: md(
        "Using the dungeon map (doors listed both ways):",
        "",
        ...dungeonBlock,
        "",
        "Define `nearby :: Map -> Room -> Int -> [Room]`, every room at most `k` doors from the start, including the start. Order does not matter. For example:",
        "",
        "```",
        "ghci> nearby dungeon \"entry\" 1",
        "[\"cellar\",\"entry\",\"hall\"]",
        "```",
      ),
      setup: dungeonSetup,
      starter: hs`nearby :: Map -> Room -> Int -> [Room]
nearby m start k = undefined
`,
      tests: [
        { expr: 'nearby dungeon "entry" 0', expected: '["entry"]', unordered: true },
        { expr: 'nearby dungeon "entry" 1', expected: '["cellar", "entry", "hall"]', unordered: true },
        { expr: 'nearby dungeon "entry" 2', expected: '["cellar", "entry", "garden", "hall", "throne"]', unordered: true },
        { expr: 'nearby dungeon "lake" 1', expected: '["garden", "lake"]', unordered: true },
      ],
      hint: "BFS with distances. Don’t expand a node whose distance is already `k`.",
      solution: hs`nearby :: Map -> Room -> Int -> [Room]
nearby m start k = bfs [(start, 0)] [start]
  where
    bfs [] seen = seen
    bfs ((x, d) : rest) seen
      | d == k    = bfs rest seen
      | otherwise = bfs (rest ++ [ (n, d + 1) | n <- new ]) (seen ++ new)
      where
        new = [ n | n <- fromMaybe [] (lookup x m), notElem n seen ]
`,
    },
    {
      k: "write",
      body: md(
        "Using the friendship net (both directions listed):",
        "",
        ...friendsBlock,
        "",
        "Define `strangers :: Net -> Person -> [Person]`, everyone in the table who is not in the same connected piece as the given person. Order does not matter. A missing person is a piece of their own, so everyone in the table is a stranger. For example:",
        "",
        "```",
        "ghci> strangers friends \"ann\"",
        "[\"ed\"]",
        "ghci> strangers friends \"ed\"",
        "[\"ann\",\"bo\",\"cy\",\"di\"]",
        "```",
      ),
      setup: friendsSetup,
      starter: hs`strangers :: Net -> Person -> [Person]
strangers net p = undefined
`,
      tests: [
        { expr: 'strangers friends "ann"', expected: '["ed"]', unordered: true },
        { expr: 'strangers friends "ed"', expected: '["ann", "bo", "cy", "di"]', unordered: true },
        { expr: 'strangers friends "zed"', expected: '["ann", "bo", "cy", "di", "ed"]', unordered: true },
        { expr: 'strangers friends "bo"', expected: '["ed"]', unordered: true },
      ],
      hint: "Walk from `p`, then keep keys of `net` that are not in the seen list.",
      solution: hs`strangers :: Net -> Person -> [Person]
strangers net p = [ n | (n, _) <- net, notElem n seen ]
  where
    seen = walk [p] []
    walk [] s = s
    walk (x : todo) s
      | elem x s  = walk todo s
      | otherwise = walk (todo ++ fromMaybe [] (lookup x net)) (x : s)
`,
    },
    {
      k: "write",
      body: md(
        "Using the course guide:",
        "",
        ...courseBlock,
        "",
        "Define `afterOne :: Guide -> Course -> [Course]`, the courses that list the given course as a direct need (the ones you could take next once you pass it), in table order. For example:",
        "",
        "```",
        "ghci> afterOne guide \"Calc1\"",
        "[\"Calc2\",\"Stats\"]",
        "```",
      ),
      setup: courseSetup,
      starter: hs`afterOne :: Guide -> Course -> [Course]
afterOne g c = undefined
`,
      tests: [
        { expr: 'afterOne guide "Calc1"', expected: '["Calc2", "Stats"]' },
        { expr: 'afterOne guide "Alg1"', expected: '["Alg2", "Stats"]' },
        { expr: 'afterOne guide "Project"', expected: "[]" },
        { expr: 'afterOne guide "Calc2"', expected: '["Project"]' },
      ],
      hint: "`[d | (d, ns) <- g, elem c ns]`.",
      solution: hs`afterOne :: Guide -> Course -> [Course]
afterOne g c = [ d | (d, ns) <- g, elem c ns ]
`,
    },
    {
      k: "write",
      body: md(
        "Using the web pages:",
        "",
        ...pagesBlock,
        "",
        "Define `clickDistance :: Web -> Page -> Page -> Maybe Int`, the fewest clicks from the first page to the second, or `Nothing` if you cannot get there. Staying on a page is `Just 0`. For example:",
        "",
        "```",
        "ghci> clickDistance pages \"home\" \"post\"",
        "Just 2",
        "ghci> clickDistance pages \"cart\" \"hidden\"",
        "Nothing",
        "```",
      ),
      setup: pagesSetup,
      starter: hs`clickDistance :: Web -> Page -> Page -> Maybe Int
clickDistance w a b = undefined
`,
      tests: [
        { expr: 'clickDistance pages "home" "post"', expected: "Just 2" },
        { expr: 'clickDistance pages "cart" "hidden"', expected: "Nothing" },
        { expr: 'clickDistance pages "home" "home"', expected: "Just 0" },
        { expr: 'clickDistance pages "hidden" "cart"', expected: "Just 3" },
        { expr: 'clickDistance pages "post" "shop"', expected: "Just 3" },
      ],
      hint: "BFS queue of `(page, dist)`, mark seen when enqueueing.",
      solution: hs`clickDistance :: Web -> Page -> Page -> Maybe Int
clickDistance w a b = bfs [(a, 0)] [a]
  where
    bfs [] _ = Nothing
    bfs ((x, d) : rest) seen
      | x == b    = Just d
      | otherwise = bfs (rest ++ [ (n, d + 1) | n <- new ]) (seen ++ new)
      where
        new = [ n | n <- fromMaybe [] (lookup x w), notElem n seen ]
`,
    },
    {
      k: "write",
      body: md(
        "Using the campus types:",
        "",
        ...campusBlock,
        "",
        "Define `untouched :: Campus -> [Building]`, the buildings nobody lists as a neighbour, in table order. (They may still have doors of their own.) For example:",
        "",
        "```",
        "ghci> untouched campus",
        "[\"dorm\"]",
        "```",
      ),
      setup: campusSetup,
      starter: hs`untouched :: Campus -> [Building]
untouched c = undefined
`,
      tests: [
        { expr: "untouched campus", expected: '["dorm"]' },
        { expr: 'untouched [("gate", ["quad"]), ("quad", ["gate"])]', expected: "[]" },
        { expr: 'untouched [("a", []), ("b", [])]', expected: '["a", "b"]' },
        { expr: "untouched []", expected: "[]" },
      ],
      hint: "`[b | (b, _) <- c, notElem b (concatMap snd c)]`.",
      solution: hs`untouched :: Campus -> [Building]
untouched c = [ b | (b, _) <- c, notElem b (concatMap snd c) ]
`,
    },
    {
      k: "write",
      body: md(
        "Using the friendship net:",
        "",
        ...friendsBlock,
        "",
        "Define `mutuals :: Net -> Person -> [Person]`, the people the given person lists who also list them back, in the order they appear in that person’s list. A missing person has no mutuals. For example:",
        "",
        "```",
        "ghci> mutuals friends \"ann\"",
        "[\"bo\",\"cy\"]",
        "ghci> mutuals friends \"ed\"",
        "[]",
        "```",
      ),
      setup: friendsSetup,
      starter: hs`mutuals :: Net -> Person -> [Person]
mutuals net p = undefined
`,
      tests: [
        { expr: 'mutuals friends "ann"', expected: '["bo", "cy"]' },
        { expr: 'mutuals friends "ed"', expected: "[]" },
        { expr: 'mutuals friends "bo"', expected: '["ann", "di"]' },
        { expr: 'mutuals friends "zed"', expected: "[]" },
      ],
      hint: "Keep `q` in `p`'s list when `elem p` of `q`'s list.",
      solution: hs`mutuals :: Net -> Person -> [Person]
mutuals net p =
  [ q | q <- fromMaybe [] (lookup p net), elem p (fromMaybe [] (lookup q net)) ]
`,
    },
    {
      k: "write",
      body: md(
        "Using the campus types:",
        "",
        ...campusBlock,
        "",
        "Define `route :: Campus -> Building -> Building -> Maybe [Building]` that returns a shortest walk from the first building to the second (fewest doors), including both ends, or `Nothing`. If the two buildings are the same, the route is a singleton. For example:",
        "",
        "```",
        "ghci> route campus \"cafe\" \"lab\"",
        "Just [\"cafe\",\"gate\",\"quad\",\"lab\"]",
        "ghci> route campus \"dorm\" \"gate\"",
        "Nothing",
        "```",
      ),
      setup: campusSetup,
      starter: hs`route :: Campus -> Building -> Building -> Maybe [Building]
route c a b = undefined
`,
      tests: [
        { expr: 'route campus "cafe" "lab"', expected: 'Just ["cafe", "gate", "quad", "lab"]' },
        { expr: 'route campus "dorm" "gate"', expected: "Nothing" },
        { expr: 'route campus "dorm" "dorm"', expected: 'Just ["dorm"]' },
        { expr: 'route campus "gate" "cafe"', expected: 'Just ["gate", "cafe"]' },
        { expr: 'route campus "lab" "cafe"', expected: 'Just ["lab", "library", "quad", "gate", "cafe"]' },
      ],
      hint: "BFS of reversed paths `p@(x:_)`. When `x == b`, `Just (reverse p)`. Mark seen when you enqueue.",
      solution: hs`route :: Campus -> Building -> Building -> Maybe [Building]
route c a b = bfs [[a]] [a]
  where
    bfs [] _ = Nothing
    bfs (p@(x : _) : rest) seen
      | x == b    = Just (reverse p)
      | otherwise = bfs (rest ++ [ n : p | n <- new ]) (seen ++ new)
      where
        new = [ n | n <- fromMaybe [] (lookup x c), notElem n seen ]
    bfs _ _ = Nothing
`,
    },
    {
      k: "write",
      body: md(
        "Wildlife patches: an undirected adjacency list (both directions stored). The given code contains:",
        "",
        ...wildlifeBlock,
        "",
        "Define `habitats :: Land -> [[Patch]]`, the connected pieces of the land. Pick the next unused patch in table order, take everyone reachable from it, sort that piece, and continue. For example:",
        "",
        "```",
        "ghci> habitats land",
        "[[\"cliff\",\"oak\",\"pond\",\"ridge\"],[\"fen\",\"marsh\"],[\"peak\"]]",
        "```",
      ),
      setup: wildlifeSetup,
      starter: hs`habitats :: Land -> [[Patch]]
habitats g = undefined
`,
      tests: [
        { expr: "habitats land", expected: '[["cliff", "oak", "pond", "ridge"], ["fen", "marsh"], ["peak"]]' },
        { expr: 'habitats [("a", [])]', expected: '[["a"]]' },
        { expr: "habitats []", expected: "[]" },
        { expr: 'length (habitats land)', expected: "3" },
        { expr: 'habitats [("x", ["y"]), ("y", ["x"])]', expected: '[["x", "y"]]' },
      ],
      hint: "`go (map fst g)`: component = sort of a seen-list walk; recurse on leftover keys.",
      solution: hs`habitats :: Land -> [[Patch]]
habitats g = go (map fst g)
  where
    go [] = []
    go (x : xs) = sort (reach x) : go [ y | y <- xs, notElem y (reach x) ]
    reach start = walk [start] []
    walk [] seen = seen
    walk (n : todo) seen
      | elem n seen = walk todo seen
      | otherwise   = walk (todo ++ fromMaybe [] (lookup n g)) (n : seen)
`,
    },
    {
      k: "write",
      body: md(
        "Using the course guide:",
        "",
        ...courseBlock,
        "",
        "Define `hasLoop :: Guide -> Bool`, which is `True` when some course can be reached from one of the courses it needs (a cycle of prerequisites, including a course that lists itself). For example:",
        "",
        "```",
        "ghci> hasLoop guide",
        "False",
        "ghci> hasLoop [(\"A\",[\"B\"]),(\"B\",[\"A\"])]",
        "True",
        "```",
      ),
      setup: courseSetup,
      starter: hs`hasLoop :: Guide -> Bool
hasLoop g = undefined
`,
      tests: [
        { expr: "hasLoop guide", expected: "False" },
        { expr: 'hasLoop [("A", ["B"]), ("B", ["A"])]', expected: "True" },
        { expr: 'hasLoop [("A", ["A"])]', expected: "True" },
        { expr: 'hasLoop [("A", ["B"]), ("B", ["C"]), ("C", ["A"])]', expected: "True" },
        { expr: 'hasLoop [("A", ["B"]), ("B", []), ("C", ["C"])]', expected: "True" },
      ],
      hint: "For each key `n`, walk from its needs-list and see if `n` appears.",
      solution: hs`hasLoop :: Guide -> Bool
hasLoop g = any leadsBack (map fst g)
  where
    leadsBack n = elem n (walk (fromMaybe [] (lookup n g)) [])
    walk [] seen = seen
    walk (x : todo) seen
      | elem x seen = walk todo seen
      | otherwise   = walk (todo ++ fromMaybe [] (lookup x g)) (x : seen)
`,
    },
    {
      k: "write",
      body: md(
        "A rumour spreads along a directed chat graph: each round, everyone who already knows it tells the people they chat with. The given code contains:",
        "",
        ...rumourBlock,
        "",
        "Define `everyone :: Chats -> [Name] -> [Name]`, the people who eventually hear a rumour that starts with the given seeds. Repeat “add neighbours of everyone who knows” until the set of knowers does not change. Order does not matter. For example:",
        "",
        "```",
        "ghci> everyone chats [\"mia\"]",
        "[\"kim\",\"mia\",\"raj\",\"tom\",\"zoe\"]",
        "ghci> everyone chats [\"ned\"]",
        "[\"ned\",\"pat\"]",
        "```",
      ),
      setup: rumourSetup,
      starter: hs`everyone :: Chats -> [Name] -> [Name]
everyone g seeds = undefined
`,
      tests: [
        { expr: 'everyone chats ["mia"]', expected: '["kim", "mia", "raj", "tom", "zoe"]', unordered: true },
        { expr: 'everyone chats ["ned"]', expected: '["ned", "pat"]', unordered: true },
        { expr: 'everyone chats ["kim"]', expected: '["kim"]', unordered: true },
        { expr: 'everyone chats ["mia", "ned"]', expected: '["kim", "mia", "ned", "pat", "raj", "tom", "zoe"]', unordered: true },
        { expr: 'everyone chats []', expected: "[]" },
      ],
      hint: "`next = nub (xs ++ concatMap (fromMaybe [] . flip lookup g) xs)` until `next == xs`.",
      solution: hs`everyone :: Chats -> [Name] -> [Name]
everyone g seeds = go seeds
  where
    go xs
      | next == xs = xs
      | otherwise  = go next
      where
        next = nub (xs ++ concat [ fromMaybe [] (lookup x g) | x <- xs ])
`,
    },
    {
      k: "write",
      body: md(
        "Using the dungeon map:",
        "",
        ...dungeonBlock,
        "",
        "Define `ways :: Map -> Room -> Room -> [[Room]]`, every simple route (no room twice) from the first room to the second. Try doors in table order, depth-first. If the rooms are the same, the only route is a singleton. For example:",
        "",
        "```",
        "ghci> ways dungeon \"entry\" \"throne\"",
        "[[\"entry\",\"hall\",\"throne\"]]",
        "ghci> ways dungeon \"entry\" \"entry\"",
        "[[\"entry\"]]",
        "```",
      ),
      setup: dungeonSetup,
      starter: hs`ways :: Map -> Room -> Room -> [[Room]]
ways m a b = undefined
`,
      tests: [
        { expr: 'ways dungeon "entry" "throne"', expected: '[["entry", "hall", "throne"]]' },
        { expr: 'ways dungeon "entry" "entry"', expected: '[["entry"]]' },
        { expr: 'ways dungeon "cellar" "lake"', expected: '[["cellar", "entry", "hall", "garden", "lake"]]' },
        { expr: 'ways dungeon "throne" "cellar"', expected: '[["throne", "hall", "entry", "cellar"]]' },
        { expr: 'length (ways dungeon "entry" "lake")', expected: "1" },
      ],
      hint: "`go path` with `x = last path`. If `x == b` yield `[path]`; else try each unused neighbour.",
      solution: hs`ways :: Map -> Room -> Room -> [[Room]]
ways m a b = go [a]
  where
    go path
      | x == b    = [path]
      | otherwise = concat [ go (path ++ [n]) | n <- fromMaybe [] (lookup x m), notElem n path ]
      where
        x = last path
`,
    },
    {
      k: "write",
      body: md(
        "Using the web pages:",
        "",
        ...pagesBlock,
        "",
        "Define `eventual :: Web -> Web` by repeating one rewrite until nothing changes. One rewrite: each page’s link list becomes the sorted, duplicate-free list of pages you can reach in one or two clicks from it (its links, plus the links of those pages). Stop when a rewrite leaves the table equal to itself. For example:",
        "",
        "```",
        "ghci> lookup \"post\" (eventual pages)",
        "Just [\"blog\",\"cart\",\"home\",\"post\",\"shop\"]",
        "```",
      ),
      setup: pagesSetup,
      starter: hs`eventual :: Web -> Web
eventual w = undefined
`,
      tests: [
        { expr: 'lookup "post" (eventual pages)', expected: 'Just ["blog", "cart", "home", "post", "shop"]' },
        { expr: 'lookup "hidden" (eventual pages)', expected: 'Just ["blog", "cart", "home", "post", "shop"]' },
        { expr: 'eventual [("A", ["B"]), ("B", ["C"]), ("C", [])]', expected: '[("A", ["B", "C"]), ("B", ["C"]), ("C", [])]' },
        { expr: 'eventual [("A", [])]', expected: '[("A", [])]' },
        { expr: "eventual []", expected: "[]" },
      ],
      hint: "`grow` adds neighbours-of-neighbours, `sort . nub`. Then `go w | grow w == w = w | otherwise = go (grow w)`.",
      solution: hs`eventual :: Web -> Web
eventual w
  | next == w = w
  | otherwise = eventual next
  where
    next =
      [ (a, sort (nub (bs ++ concat [ fromMaybe [] (lookup b w) | b <- bs ])))
      | (a, bs) <- w
      ]
`,
    },
    {
      k: "write",
      body: md(
        "Each file maps to the files it imports. A file with an empty list can be compiled now. The given code contains:",
        "",
        ...filesBlock,
        "",
        "Define `compileOrder :: Deps -> [File]` that repeatedly takes every remaining file with an empty import list (in table order), then removes those files from every other import list, until nothing is left. If a cycle remains, ignore those files (they never become empty). For example:",
        "",
        "```",
        "ghci> compileOrder deps",
        "[\"C\",\"D\",\"A\",\"B\",\"Main\"]",
        "```",
      ),
      setup: filesSetup,
      starter: hs`compileOrder :: Deps -> [File]
compileOrder g = undefined
`,
      tests: [
        { expr: "compileOrder deps", expected: '["C", "D", "A", "B", "Main"]' },
        { expr: 'compileOrder [("X", ["Y"]), ("Y", ["X"])]', expected: "[]" },
        { expr: 'compileOrder [("P", []), ("Q", ["P"])]', expected: '["P", "Q"]' },
        { expr: "compileOrder []", expected: "[]" },
        { expr: 'compileOrder [("A", ["B"]), ("B", []), ("C", ["C"])]', expected: '["B", "A"]' },
      ],
      hint: "`taken = [n | (n, ns) <- g, null ns]`. If `taken` is empty, stop. Else `taken ++ compileOrder leftover`.",
      solution: hs`compileOrder :: Deps -> [File]
compileOrder g
  | null taken = []
  | otherwise  = taken ++ compileOrder leftover
  where
    taken    = [ n | (n, ns) <- g, null ns ]
    leftover = [ (n, filter (\x -> notElem x taken) ns) | (n, ns) <- g, notElem n taken ]
`,
    },
    {
      k: "write",
      body: md(
        "Using the chat graph:",
        "",
        ...rumourBlock,
        "",
        "Define `dayHeard :: Chats -> Name -> [(Name, Int)]`, pairing each person who eventually hears a rumour started by the given name with the number of rounds until they hear it (the starter hears it on day 0). People the rumour never reaches are left out. List people in the order BFS first discovers them. For example:",
        "",
        "```",
        "ghci> dayHeard chats \"mia\"",
        "[(\"mia\",0),(\"raj\",1),(\"tom\",1),(\"kim\",2),(\"zoe\",2)]",
        "ghci> dayHeard chats \"ned\"",
        "[(\"ned\",0),(\"pat\",1)]",
        "```",
      ),
      setup: rumourSetup,
      starter: hs`dayHeard :: Chats -> Name -> [(Name, Int)]
dayHeard g start = undefined
`,
      tests: [
        { expr: 'dayHeard chats "mia"', expected: '[("mia", 0), ("raj", 1), ("tom", 1), ("kim", 2), ("zoe", 2)]' },
        { expr: 'dayHeard chats "ned"', expected: '[("ned", 0), ("pat", 1)]' },
        { expr: 'dayHeard chats "kim"', expected: '[("kim", 0)]' },
        { expr: 'dayHeard chats "pat"', expected: '[("pat", 0)]' },
        { expr: 'lookup "zoe" (dayHeard chats "mia")', expected: "Just 2" },
      ],
      hint: "BFS queue of `(name, day)`. Record when you first enqueue (including the start at 0). Mark seen then too.",
      solution: hs`dayHeard :: Chats -> Name -> [(Name, Int)]
dayHeard g start = bfs [(start, 0)] [start] [(start, 0)]
  where
    bfs [] _ acc = acc
    bfs ((x, d) : rest) seen acc =
      bfs (rest ++ [ (n, d + 1) | n <- new ]) (seen ++ new) (acc ++ [ (n, d + 1) | n <- new ])
      where
        new = [ n | n <- fromMaybe [] (lookup x g), notElem n seen ]
`,
    },
  ],
};

level1.drills = [...level1.drills, ...level1rest];

export const book: Book = {
  id: "b-graphs",
  order: 12,
  title: "Graphs, search and fixed points",
  blurb:
    "Graphs as adjacency lists [(Node, [Node])]: neighbours, degree, reachable with a seen list, BFS vs DFS, shortest path, components, until-nothing-changes, and cycle detection.",
  sets: [level1, level2, level3, level4],
};
