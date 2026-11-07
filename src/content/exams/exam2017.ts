import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "y2017",
  year: 2017,
  title: "Decision Trees",
  summary: "Work with a table of weather records, then build a decision tree that learns from it how to tell a good fishing day from a bad one.",
  skills: [
    "lookup tables of pairs",
    "list comprehensions",
    "zip",
    "filter and all",
    "recursion over trees",
    "higher-order functions (a function as a parameter)",
    "maximumBy with comparing",
    "Double arithmetic and fromIntegral",
  ],
  story: md(
    "This paper is about a simple kind of machine learning. You are given a table of past observations, and you build a little flowchart, called a **decision tree**, that can then make predictions about new observations.",
    "",
    "**Records, attributes and classes.** Here are 3 of the 14 rows from the exam's data. Each row describes one day of fly-fishing:",
    "",
    "```",
    "outlook   temp  humidity  wind   result",
    "sunny     hot   high      calm   bad",
    "overcast  hot   high      calm   good",
    "rainy     cool  normal    windy  bad",
    "```",
    "",
    "Each column is an **attribute**: a named property with a small fixed set of possible values. `outlook` can be `sunny`, `overcast` or `rainy`; `temp` can be `hot`, `mild` or `cool`; `humidity` can be `high` or `normal`; `wind` can be `windy` or `calm`. The last column, `result`, is special: it is the **classification** (the answer we want to predict), and it is either `good` or `bad`. Each row is a **record**.",
    "",
    "**Decision trees.** A decision tree asks one question at each box (\"what is the outlook?\") and follows the arrow labelled with the answer, until it reaches an answer at the bottom. Here is the small tree from Figure 2 of the paper:",
    "",
    "```",
    "                  outlook",
    "        sunny /   overcast |    \\ rainy",
    "         humidity        good      wind",
    "     high /   \\ normal          windy /  \\ calm",
    "       bad    good               bad    good",
    "```",
    "",
    "To classify the day `sunny, hot, high, calm`: outlook is sunny, so go left; humidity is high, so go left again; the answer is `bad`. The tree never asked about temp at all.",
    "",
    "The boxes that ask a question are internal **nodes**. The answers at the bottom are **leaves**. There is also a special **null** leaf meaning \"no row in the data ever got here, so I don't know\". For example, no row is both rainy and hot, so the bigger tree of Figure 1 has a null leaf on that path.",
    "",
    "**Building a tree.** To build a tree from a table you pick an attribute, say outlook, and split (partition) the table into one smaller table per value: the sunny rows, the overcast rows, the rainy rows. The outlook column is deleted from each smaller table because every row in it has the same outlook now. Then you build a subtree from each smaller table, the same way. You stop when:",
    "",
    "- the table has no rows: the subtree is `Null`; or",
    "- every row has the same classification (all `good`, say): the subtree is `Leaf \"good\"`.",
    "",
    "Which attribute you split on first changes the shape of the tree. Figure 1 just takes the attributes in header order (outlook, temp, humidity, wind) and gets an 18-box tree. Figure 2 picks the most informative attribute each time and gets an 8-box tree.",
    "",
    "**Entropy (Part IV only).** Entropy measures how mixed up a list of answers is. If all answers are the same the entropy is 0 (no surprise). If they are a 50/50 mix of two values it is 1. For a column where value i makes up a fraction p of the rows, the entropy is the sum over the values of `-p * log2 p` (taking `0 * log2 0` as 0). For the fishing data, 9 rows are good and 5 bad, so:",
    "",
    "```",
    "E = -(9/14) * log2 (9/14) - (5/14) * log2 (5/14) = 0.940",
    "```",
    "",
    "The **gain** of splitting on an attribute is how much the entropy drops: the entropy before, minus the weighted average of the entropies of the smaller tables (each weighted by the fraction of rows it got). Splitting on the attribute with the biggest gain gives small trees like Figure 2.",
    "",
    "### The given types",
    "",
    "```",
    "type AttName   = String",
    "type AttValue  = String",
    "type Attribute = (AttName, [AttValue])",
    "type Header    = [Attribute]",
    "type Row       = [AttValue]",
    "type DataSet   = (Header, [Row])",
    "",
    "data DecisionTree = Null",
    "                  | Leaf AttValue",
    "                  | Node AttName [(AttValue, DecisionTree)]",
    "",
    "type Partition   = [(AttValue, DataSet)]",
    "type AttSelector = DataSet -> Attribute -> Attribute",
    "```",
    "",
    "- An `Attribute` is a name with its list of allowed values, e.g. `(\"wind\", [\"windy\", \"calm\"])`.",
    "- A `Header` lists the attributes of the columns, in column order. A `Row` is just the list of values, so you need the header to know which value belongs to which attribute.",
    "- A `DataSet` is a header together with all its rows.",
    "- `Null` is the \"no data\" leaf, `Leaf v` is an answer leaf, and `Node name branches` asks about attribute `name`; `branches` pairs each possible value with the subtree to follow.",
    "- A `Partition` is the result of splitting: one `(value, smaller data set)` pair per value of the splitting attribute.",
    "- An `AttSelector` is a function that, given a data set and the classification attribute, chooses which attribute to split on next. `buildTree` takes one as a parameter.",
    "",
    "Given to you: `lookUp` (like `lookup` but crashes with a helpful message if the key is missing), `xlogx` (computes `x * log2 x`, giving 0 for 0), `nextAtt` (the simple selector that picks the first non-classification attribute), the attributes `outlook`, `temp`, `humidity`, `wind`, `result`, the data `header`, `table`, `fishingData`, the trees `fig1` and `fig2`, and `outlookPartition`.",
  ),
  notes: md(
    "**Where the marks are.** Part I (utilities) is 14 of 30 marks and every question is short. Part II is 5 marks, Part III is 9 marks, and Part IV is only 2 marks for three functions.",
    "",
    "**Order of attack.** Do Part I in order: each function is used by later ones (`lookUpAtt` by almost everything, `removeAtt` and `remove` by `partitionData`). Test each against the spec's examples. Then `nodes` and `evalTree`, then `partitionData` (check `partitionData fishingData outlook == outlookPartition`), then `buildTree` (check `== fig1`). Only then Part IV.",
    "",
    "**Traps.**",
    "",
    "- `buildFrequencyTable` must list *every* value of the attribute, even ones with count 0 (see the `([],[])` example). Loop over the attribute's values, not over the rows.",
    "- `buildFrequencyTable` and `partitionData` must follow the order of the attribute's values list, so the results match `outlookPartition` and `fig1` exactly.",
    "- `partitionData` removes the attribute from the header *and* from every row.",
    "- In `buildTree`, check for an empty table (`Null`) before checking `allSame` (because `allSame []` is `True` but there is no class to put in a `Leaf`).",
    "- The classification column can be anywhere, so find it by name with `lookUpAtt`, never with `last`.",
    "- In `bestGainAtt`, remove the classification attribute from the header before picking the maximum.",
    "- Use `fromIntegral` when dividing counts to get `Double`s.",
    "",
    "**Short of time?** Part IV is 2 marks for three functions. Make sure Parts I to III are solid first.",
  ),
  setup: hs`import Data.List
import Data.Maybe
import Data.Ord

type AttName = String

type AttValue = String

type Attribute = (AttName, [AttValue])

type Header = [Attribute]

type Row = [AttValue]

type DataSet = (Header, [Row])

data DecisionTree = Null |
                    Leaf AttValue |
                    Node AttName [(AttValue, DecisionTree)]
                  deriving (Eq, Show)

type Partition = [(AttValue, DataSet)]

type AttSelector = DataSet -> Attribute -> Attribute

xlogx :: Double -> Double
xlogx p
  | p <= 1e-100 = 0.0
  | otherwise   = p * log2 p
  where
    log2 x = log x / log 2

lookUp :: (Eq a, Show a, Show b) => a -> [(a, b)] -> b
lookUp x table
  = fromMaybe (error ("lookUp error - no binding for " ++ show x ++
                      " in table: " ++ show table))
              (lookup x table)

nextAtt :: AttSelector
nextAtt (header, _) (classifierName, _)
  = head (filter ((/= classifierName) . fst) header)

--------------------------------------------------------------
-- Test data

outlook :: Attribute
outlook = ("outlook", ["sunny", "overcast", "rainy"])

temp :: Attribute
temp = ("temp", ["hot", "mild", "cool"])

humidity :: Attribute
humidity = ("humidity", ["high", "normal"])

wind :: Attribute
wind = ("wind", ["windy", "calm"])

result :: Attribute
result = ("result", ["good", "bad"])

fishingData :: DataSet
fishingData = (header, table)

header :: Header
header = [outlook, temp, humidity, wind, result]

table :: [Row]
table
  = [["sunny",    "hot",  "high",   "calm",  "bad" ],
     ["sunny",    "hot",  "high",   "windy", "bad" ],
     ["overcast", "hot",  "high",   "calm",  "good"],
     ["rainy",    "mild", "high",   "calm",  "good"],
     ["rainy",    "cool", "normal", "calm",  "good"],
     ["rainy",    "cool", "normal", "windy", "bad" ],
     ["overcast", "cool", "normal", "windy", "good"],
     ["sunny",    "mild", "high",   "calm",  "bad" ],
     ["sunny",    "cool", "normal", "calm",  "good"],
     ["rainy",    "mild", "normal", "calm",  "good"],
     ["sunny",    "mild", "normal", "windy", "good"],
     ["overcast", "mild", "high",   "windy", "good"],
     ["overcast", "hot",  "normal", "calm",  "good"],
     ["rainy",    "mild", "high",   "windy", "bad" ]]

-- Figure 1: built with nextAtt
fig1 :: DecisionTree
fig1
  = Node "outlook"
      [("sunny", Node "temp"
                   [("hot", Leaf "bad"),
                    ("mild", Node "humidity" [("high", Leaf "bad"),
                                              ("normal", Leaf "good")]),
                    ("cool", Leaf "good")]),
       ("overcast", Leaf "good"),
       ("rainy", Node "temp"
                   [("hot", Null),
                    ("mild", Node "humidity"
                               [("high", Node "wind" [("windy", Leaf "bad"),
                                                      ("calm", Leaf "good")]),
                                ("normal", Leaf "good")]),
                    ("cool", Node "humidity"
                               [("high", Null),
                                ("normal", Node "wind" [("windy", Leaf "bad"),
                                                        ("calm", Leaf "good")])])])]

-- Figure 2: built with bestGainAtt
fig2 :: DecisionTree
fig2
  = Node "outlook"
      [("sunny", Node "humidity" [("high", Leaf "bad"),
                                  ("normal", Leaf "good")]),
       ("overcast", Leaf "good"),
       ("rainy", Node "wind" [("windy", Leaf "bad"),
                              ("calm", Leaf "good")])]

-- Table 2: partitionData fishingData outlook
outlookPartition :: Partition
outlookPartition
  = [("sunny", ([temp, humidity, wind, result],
                [["hot",  "high",   "calm",  "bad" ],
                 ["hot",  "high",   "windy", "bad" ],
                 ["mild", "high",   "calm",  "bad" ],
                 ["cool", "normal", "calm",  "good"],
                 ["mild", "normal", "windy", "good"]])),
     ("overcast", ([temp, humidity, wind, result],
                   [["hot",  "high",   "calm",  "good"],
                    ["cool", "normal", "windy", "good"],
                    ["mild", "high",   "windy", "good"],
                    ["hot",  "normal", "calm",  "good"]])),
     ("rainy", ([temp, humidity, wind, result],
                [["mild", "high",   "calm",  "good"],
                 ["cool", "normal", "calm",  "good"],
                 ["cool", "normal", "windy", "bad" ],
                 ["mild", "normal", "calm",  "good"],
                 ["mild", "high",   "windy", "bad" ]]))]
`,
  starter: hs`--------------------------------------------------------------
-- Part I

allSame :: Eq a => [a] -> Bool
allSame = undefined

remove :: Eq a => a -> [(a, b)] -> [(a, b)]
remove = undefined

lookUpAtt :: AttName -> Header -> Row -> AttValue
lookUpAtt = undefined

removeAtt :: AttName -> Header -> Row -> Row
removeAtt = undefined

addToMapping :: Eq a => (a, b) -> [(a, [b])] -> [(a, [b])]
addToMapping = undefined

buildFrequencyTable :: Attribute -> DataSet -> [(AttValue, Int)]
buildFrequencyTable = undefined

--------------------------------------------------------------
-- Part II

nodes :: DecisionTree -> Int
nodes = undefined

evalTree :: DecisionTree -> Header -> Row -> AttValue
evalTree = undefined

--------------------------------------------------------------
-- Part III

partitionData :: DataSet -> Attribute -> Partition
partitionData = undefined

buildTree :: DataSet -> Attribute -> AttSelector -> DecisionTree
buildTree = undefined

--------------------------------------------------------------
-- Part IV

entropy :: DataSet -> Attribute -> Double
entropy = undefined

gain :: DataSet -> Attribute -> Attribute -> Double
gain = undefined

bestGainAtt :: AttSelector
bestGainAtt = undefined
`,
  tasks: [
    {
      id: "allSame",
      name: "allSame",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define `allSame :: Eq a => [a] -> Bool` which returns `True` if every item in the list is the same, and `False` otherwise. The empty list counts as all the same.",
        "",
        "```",
        "ghci> allSame []",
        "True",
        "ghci> allSame [9,9,9]",
        "True",
        "ghci> allSame \"abc\"",
        "False",
        "```",
      ),
      hints: [
        "Compare every element with the first one. The Prelude function `all` checks a condition on every element.",
        "Two cases: the empty list, and a list `x : xs` with a first element.",
        "`all (== x) xs` is `True` exactly when every element of `xs` equals `x`. Don't forget `allSame [] = True`.",
        "`allSame [] = True` and `allSame (x : xs) = all (== x) xs`.",
      ],
      solution: hs`allSame :: Eq a => [a] -> Bool
allSame [] = True
allSame (x : xs) = all (== x) xs`,
      tests: [
        { expr: "allSame ([] :: [Int])", expected: "True" },
        { expr: "allSame [9,9,9]", expected: "True" },
        { expr: 'allSame "abc"', expected: "False" },
        { expr: "allSame [1]", expected: "True" },
        { expr: "allSame [1,1,2]", expected: "False" },
        { expr: "allSame [2,1,1]", expected: "False" },
        { expr: 'allSame ["good","good","good"]', expected: "True" },
      ],
    },
    {
      id: "remove",
      name: "remove",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define `remove :: Eq a => a -> [(a, b)] -> [(a, b)]` which removes the pair whose first component is the given item from a table of pairs. If the item isn't there, return the table unchanged.",
        "",
        "```",
        "ghci> remove 1 [(3,'a'),(1,'b'),(7,'a')]",
        "[(3,'a'),(7,'a')]",
        "ghci> remove 6 []",
        "[]",
        "```",
      ),
      hints: [
        "This is a job for `filter`: keep the pairs whose first component is *not* the item.",
        "The test for one pair is \"its `fst` is different from `x`\".",
        "You can write the test as a lambda `\\(k, _) -> k /= x`, or as the composition `(/= x) . fst`.",
        "`remove x table = filter ((/= x) . fst) table`.",
      ],
      solution: hs`remove :: Eq a => a -> [(a, b)] -> [(a, b)]
remove x = filter ((/= x) . fst)`,
      tests: [
        { expr: "remove 1 [(3,'a'),(1,'b'),(7,'a')]", expected: "[(3,'a'),(7,'a')]" },
        { expr: "remove 6 ([] :: [(Int, Char)])", expected: "[]" },
        { expr: "remove 6 [(3,'a'),(1,'b')]", expected: "[(3,'a'),(1,'b')]" },
        { expr: "remove 3 [(3,'a')]", expected: "[]" },
        { expr: 'remove "temp" header', expected: "[outlook, humidity, wind, result]" },
        { expr: 'remove "result" header', expected: "[outlook, temp, humidity, wind]" },
      ],
    },
    {
      id: "lookUpAtt",
      name: "lookUpAtt",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Using the given `lookUp` function, define `lookUpAtt :: AttName -> Header -> Row -> AttValue` which finds the value of the named attribute in a row. You need the header to know which position in the row belongs to which attribute. The attribute is guaranteed to be in the header.",
        "",
        "```",
        "ghci> table !! 0",
        "[\"sunny\",\"hot\",\"high\",\"calm\",\"bad\"]",
        "ghci> lookUpAtt \"temp\" header (table !! 0)",
        "\"hot\"",
        "```",
      ),
      hints: [
        "Pair each attribute name with the value in the same position, then look the name up in that list of pairs.",
        "`map fst header` gives the attribute names in column order. `zip` pairs them with the row's values.",
        "`zip [\"outlook\",\"temp\"] [\"sunny\",\"hot\"]` is `[(\"outlook\",\"sunny\"),(\"temp\",\"hot\")]`, which is exactly the shape `lookUp` wants.",
        "`lookUpAtt name header row = lookUp name (zip (map fst header) row)`.",
      ],
      solution: hs`lookUpAtt :: AttName -> Header -> Row -> AttValue
lookUpAtt name header row = lookUp name (zip (map fst header) row)`,
      tests: [
        { expr: 'lookUpAtt "temp" header (table !! 0)', expected: '"hot"' },
        { expr: 'lookUpAtt "outlook" header (table !! 0)', expected: '"sunny"' },
        { expr: 'lookUpAtt "result" header (table !! 2)', expected: '"good"' },
        { expr: 'lookUpAtt "wind" header (table !! 13)', expected: '"windy"' },
        { expr: 'map (lookUpAtt "humidity" header) (take 5 table)', expected: '["high","high","high","high","normal"]' },
        { expr: 'lookUpAtt "b" [("a",[]),("b",[]),("c",[])] ["1","2","3"]', expected: '"2"' },
      ],
    },
    {
      id: "removeAtt",
      name: "removeAtt",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define `removeAtt :: AttName -> Header -> Row -> Row` which deletes the value of the named attribute from a row, keeping the other values in their original order. Again you need the header.",
        "",
        "```",
        "ghci> table !! 0",
        "[\"sunny\",\"hot\",\"high\",\"calm\",\"bad\"]",
        "ghci> removeAtt \"temp\" header (table !! 0)",
        "[\"sunny\",\"high\",\"calm\",\"bad\"]",
        "```",
      ),
      hints: [
        "Walk along the header and the row together, keeping each value whose attribute name is not the one to remove.",
        "`zip header row` gives pairs `((name, values), v)`. A list comprehension can filter and pick out `v`.",
        "Pattern match the pair as `((n, _), v)` so you can compare `n` with the name.",
        "`removeAtt name header row = [v | ((n, _), v) <- zip header row, n /= name]`.",
      ],
      solution: hs`removeAtt :: AttName -> Header -> Row -> Row
removeAtt name header row = [v | ((n, _), v) <- zip header row, n /= name]`,
      tests: [
        { expr: 'removeAtt "temp" header (table !! 0)', expected: '["sunny","high","calm","bad"]' },
        { expr: 'removeAtt "outlook" header (table !! 0)', expected: '["hot","high","calm","bad"]' },
        { expr: 'removeAtt "result" header (table !! 0)', expected: '["sunny","hot","high","calm"]' },
        { expr: 'removeAtt "wind" header (table !! 6)', expected: '["overcast","cool","normal","good"]' },
        { expr: 'removeAtt "x" [("x",[])] ["1"]', expected: "[]" },
        { expr: 'removeAtt "humidity" [humidity, wind] ["normal","calm"]', expected: '["calm"]' },
      ],
    },
    {
      id: "addToMapping",
      name: "addToMapping",
      part: "Part I",
      marks: 3,
      prompt: md(
        "A **mapping** is a table that links each key to a *list* of values, like `[(2,\"b\"),(5,\"bcd\")]`. Define `addToMapping :: Eq a => (a, b) -> [(a, [b])] -> [(a, [b])]` which adds the pair `(x, v)` to a mapping:",
        "",
        "- if `x` already has an entry, put `v` on the **front** of its list;",
        "- otherwise add a new entry `(x, [v])`.",
        "",
        "Each key appears at most once in the mapping.",
        "",
        "```",
        "ghci> addToMapping (1,'a') [(2,\"b\")]",
        "[(2,\"b\"),(1,\"a\")]",
        "ghci> addToMapping (5,'a') [(2,\"b\"),(5,\"bcd\")]",
        "[(2,\"b\"),(5,\"abcd\")]",
        "```",
        "",
        "The order of the entries in the result doesn't matter.",
      ),
      hints: [
        "Recurse down the mapping looking for the key. If you reach the end without finding it, add a new entry there.",
        "Base case: `addToMapping (x, v) [] = [(x, [v])]`. Recursive case: look at the first entry `(y, vs)`.",
        "If `x == y`, replace that entry with `(y, v : vs)` and keep the rest as it is (no need to recurse further). Otherwise keep `(y, vs)` and recurse on the rest.",
        md(
          "```",
          "addToMapping (x, v) [] = [(x, [v])]",
          "addToMapping (x, v) ((y, vs) : rest)",
          "  | x == y    = (y, v : vs) : rest",
          "  | otherwise = (y, vs) : addToMapping (x, v) rest",
          "```",
        ),
      ],
      solution: hs`addToMapping :: Eq a => (a, b) -> [(a, [b])] -> [(a, [b])]
addToMapping (x, v) [] = [(x, [v])]
addToMapping (x, v) ((y, vs) : rest)
  | x == y    = (y, v : vs) : rest
  | otherwise = (y, vs) : addToMapping (x, v) rest`,
      tests: [
        { expr: "addToMapping (1,'a') [(2,\"b\")]", expected: '[(2,"b"),(1,"a")]', unordered: true },
        { expr: "addToMapping (5,'a') [(2,\"b\"),(5,\"bcd\")]", expected: '[(2,"b"),(5,"abcd")]', unordered: true },
        { expr: "addToMapping (1,'z') []", expected: '[(1,"z")]' },
        { expr: "addToMapping (2,'x') [(2,\"b\"),(5,\"bcd\")]", expected: '[(2,"xb"),(5,"bcd")]', unordered: true },
        { expr: "length (addToMapping (2,'x') [(2,\"b\"),(5,\"bcd\")])", expected: "2" },
        {
          expr: "foldr addToMapping [] [(1,'a'),(2,'b'),(1,'c')]",
          expected: '[(1,"ac"),(2,"b")]',
          unordered: true,
        },
      ],
    },
    {
      id: "buildFrequencyTable",
      name: "buildFrequencyTable",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define `buildFrequencyTable :: Attribute -> DataSet -> [(AttValue, Int)]` which counts how many rows of the data set have each value of the given attribute. **Every** value of the attribute appears in the result, even if its count is 0.",
        "",
        "```",
        "ghci> buildFrequencyTable result fishingData",
        "[(\"good\",9),(\"bad\",5)]",
        "ghci> buildFrequencyTable outlook fishingData",
        "[(\"sunny\",5),(\"overcast\",4),(\"rainy\",5)]",
        "ghci> buildFrequencyTable outlook ([],[])",
        "[(\"sunny\",0),(\"overcast\",0),(\"rainy\",0)]",
        "```",
        "",
        "The order of the pairs in the result doesn't matter (but listing them in the attribute's value order, as above, is natural).",
      ),
      hints: [
        "Loop over the attribute's list of *values* (not over the rows), and count the rows that have each value.",
        "First get the column of this attribute's values: `map (lookUpAtt name header) rows`.",
        "Count with `length (filter (== v) column)`. Because you loop over the values, values that never appear still get a 0. (With no rows, the column is empty, so `lookUpAtt` is never called on the empty header.)",
        md(
          "```",
          "buildFrequencyTable (name, values) (header, rows)",
          "  = [(v, length (filter (== v) column)) | v <- values]",
          "  where",
          "    column = map (lookUpAtt name header) rows",
          "```",
        ),
      ],
      solution: hs`buildFrequencyTable :: Attribute -> DataSet -> [(AttValue, Int)]
buildFrequencyTable (name, values) (header, rows)
  = [(v, length (filter (== v) column)) | v <- values]
  where
    column = map (lookUpAtt name header) rows`,
      tests: [
        { expr: "buildFrequencyTable result fishingData", expected: '[("good",9),("bad",5)]', unordered: true },
        { expr: "buildFrequencyTable outlook fishingData", expected: '[("sunny",5),("overcast",4),("rainy",5)]', unordered: true },
        { expr: "buildFrequencyTable outlook ([],[])", expected: '[("sunny",0),("overcast",0),("rainy",0)]', unordered: true },
        { expr: "buildFrequencyTable temp fishingData", expected: '[("hot",4),("mild",6),("cool",4)]', unordered: true },
        { expr: "buildFrequencyTable wind fishingData", expected: '[("windy",6),("calm",8)]', unordered: true },
        { expr: "buildFrequencyTable result (header, [])", expected: '[("good",0),("bad",0)]', unordered: true },
        {
          expr: 'buildFrequencyTable outlook (header, filter ((== "overcast") . head) table)',
          expected: '[("sunny",0),("overcast",4),("rainy",0)]',
          unordered: true,
        },
      ],
    },
    {
      id: "nodes",
      name: "nodes",
      part: "Part II",
      marks: 2,
      prompt: md(
        "Define `nodes :: DecisionTree -> Int` which counts the total number of nodes and leaves in a tree. A `Null` counts as 0.",
        "",
        "```",
        "ghci> nodes fig1",
        "18",
        "ghci> nodes fig2",
        "8",
        "```",
      ),
      hints: [
        "Recursion on the tree: one equation per constructor.",
        "`Null` is 0, `Leaf _` is 1, and a `Node` is 1 (itself) plus the counts of all its subtrees.",
        "The subtrees are the second components of the branch pairs: `[t | (_, t) <- branches]` or `map snd branches`.",
        "`nodes (Node _ branches) = 1 + sum (map (nodes . snd) branches)`.",
      ],
      solution: hs`nodes :: DecisionTree -> Int
nodes Null = 0
nodes (Leaf _) = 1
nodes (Node _ branches) = 1 + sum [nodes t | (_, t) <- branches]`,
      tests: [
        { expr: "nodes fig1", expected: "18" },
        { expr: "nodes fig2", expected: "8" },
        { expr: "nodes Null", expected: "0" },
        { expr: 'nodes (Leaf "good")', expected: "1" },
        { expr: 'nodes (Node "wind" [("windy", Null), ("calm", Null)])', expected: "1" },
        { expr: 'nodes (Node "wind" [("windy", Leaf "bad"), ("calm", Leaf "good")])', expected: "3" },
      ],
    },
    {
      id: "evalTree",
      name: "evalTree",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Using `lookUp` and `lookUpAtt`, define `evalTree :: DecisionTree -> Header -> Row -> AttValue` which follows the tree using the values in the row and returns the classification at the leaf it reaches. If the tree is (or leads to) `Null`, return `\"\"`.",
        "",
        "At a `Node name branches`, find the row's value for attribute `name` (that's what the header is for), pick the branch with that value, and carry on down it.",
        "",
        "```",
        "ghci> evalTree fig1 header (table !! 5)",
        "\"bad\"",
        "ghci> evalTree fig2 header (table !! 4)",
        "\"good\"",
        "```",
      ),
      hints: [
        "Recursion on the tree, one equation per constructor. The header and row stay the same all the way down.",
        "`Null` gives `\"\"` and `Leaf v` gives `v`.",
        "For a `Node name branches`: `lookUpAtt name header row` is the value to follow, and `lookUp value branches` is the subtree for that value.",
        "`evalTree (Node name branches) header row = evalTree (lookUp (lookUpAtt name header row) branches) header row`.",
      ],
      solution: hs`evalTree :: DecisionTree -> Header -> Row -> AttValue
evalTree Null _ _ = ""
evalTree (Leaf v) _ _ = v
evalTree (Node name branches) header row
  = evalTree (lookUp (lookUpAtt name header row) branches) header row`,
      tests: [
        { expr: "evalTree fig1 header (table !! 5)", expected: '"bad"' },
        { expr: "evalTree fig2 header (table !! 4)", expected: '"good"' },
        { expr: "evalTree Null header (table !! 0)", expected: '""' },
        { expr: 'evalTree fig1 header ["rainy","hot","high","calm","?"]', expected: '""', label: "a path that ends at Null gives \"\"" },
        { expr: "map (evalTree fig1 header) table", expected: "map last table", label: "fig1 classifies every row of the table correctly" },
        { expr: "map (evalTree fig2 header) table", expected: "map last table", label: "fig2 classifies every row of the table correctly" },
        { expr: 'evalTree fig2 header ["rainy","hot","high","calm","?"]', expected: '"good"' },
        { expr: 'evalTree (Leaf "bad") [] []', expected: '"bad"' },
      ],
    },
    {
      id: "partitionData",
      name: "partitionData",
      part: "Part III",
      marks: 5,
      prompt: md(
        "Define `partitionData :: DataSet -> Attribute -> Partition` which splits a data set by the given attribute: one `(value, DataSet)` pair for each value of the attribute, **in the attribute's value order**. Each smaller data set contains just the rows with that value, and the attribute is removed from both its header and its rows.",
        "",
        "```",
        "ghci> partitionData fishingData outlook == outlookPartition",
        "True",
        "ghci> let ps = partitionData fishingData outlook",
        "ghci> let (val, (header', table')) = ps !! 1",
        "ghci> header'",
        "[(\"temp\",[\"hot\",\"mild\",\"cool\"]),(\"humidity\",[\"high\",\"normal\"]),",
        " (\"wind\",[\"windy\",\"calm\"]),(\"result\",[\"good\",\"bad\"])]",
        "ghci> table'",
        "[[\"hot\",\"high\",\"calm\",\"good\"],[\"cool\",\"normal\",\"windy\",\"good\"],",
        " [\"mild\",\"high\",\"windy\",\"good\"],[\"hot\",\"normal\",\"calm\",\"good\"]]",
        "```",
        "",
        "A value with no matching rows still gets an entry, with an empty list of rows.",
      ),
      hints: [
        "Use a list comprehension over the attribute's values. For each value, build its smaller data set.",
        "The new header is the same for every value: `remove name header`.",
        "The rows for value `v` are the rows where `lookUpAtt name header r == v`, each with that column taken out by `removeAtt name header r`. Use the *old* header for both calls.",
        md(
          "```",
          "partitionData (header, rows) (name, values)",
          "  = [(v, (header', rowsFor v)) | v <- values]",
          "  where",
          "    header' = remove name header",
          "    rowsFor v = [removeAtt name header r | r <- rows, lookUpAtt name header r == v]",
          "```",
        ),
      ],
      solution: hs`partitionData :: DataSet -> Attribute -> Partition
partitionData (header, rows) (name, values)
  = [(v, (header', rowsFor v)) | v <- values]
  where
    header' = remove name header
    rowsFor v = [removeAtt name header r | r <- rows, lookUpAtt name header r == v]`,
      tests: [
        { expr: "partitionData fishingData outlook == outlookPartition", label: "partitionData fishingData outlook == outlookPartition" },
        { expr: "map fst (partitionData fishingData outlook)", expected: '["sunny","overcast","rainy"]' },
        { expr: "fst (snd (partitionData fishingData outlook !! 1))", expected: "[temp, humidity, wind, result]" },
        {
          expr: "snd (snd (partitionData fishingData outlook !! 1))",
          expected: '[["hot","high","calm","good"],["cool","normal","windy","good"],["mild","high","windy","good"],["hot","normal","calm","good"]]',
        },
        { expr: "map (length . snd . snd) (partitionData fishingData temp)", expected: "[4,6,4]" },
        { expr: "map (fst . snd) (partitionData fishingData wind)", expected: "replicate 2 [outlook, temp, humidity, result]" },
        { expr: "partitionData (header, []) humidity", expected: '[("high",([outlook,temp,wind,result],[])),("normal",([outlook,temp,wind,result],[]))]' },
        {
          expr: 'partitionData ([wind, result], [["calm","good"],["windy","bad"],["calm","bad"]]) wind',
          expected: '[("windy",([result],[["bad"]])),("calm",([result],[["good"],["bad"]]))]',
        },
      ],
    },
    {
      id: "buildTree",
      name: "buildTree",
      part: "Part III",
      marks: 4,
      prompt: md(
        "Define `buildTree :: DataSet -> Attribute -> AttSelector -> DecisionTree` which builds a decision tree from a data set:",
        "",
        "- The `Attribute` argument is the classification attribute (`result` for the fishing data). It can be any column, not just the last.",
        "- The `AttSelector` argument is a function that picks the attribute to split on next: call it as `selector dataSet classifier`.",
        "- If the data set has no rows, the tree is `Null`.",
        "- If every row has the same classification `c`, the tree is `Leaf c`.",
        "- Otherwise pick an attribute with the selector, partition the data on it with `partitionData`, and make a `Node` whose branches pair each value with the tree built (recursively, with the same classifier and selector) from that value's partition.",
        "",
        "With the given `nextAtt` selector you get Figure 1:",
        "",
        "```",
        "ghci> buildTree fishingData result nextAtt == fig1",
        "True",
        "```",
      ),
      hints: [
        "Recursion on data sets: the partitions are smaller data sets, so build each subtree with a recursive call.",
        "Write the empty-table case first: `buildTree (_, []) _ _ = Null`. In the other case, compute the column of classifications with `map (lookUpAtt cname header) rows`.",
        "Use guards: `allSame classes` gives a `Leaf (head classes)`; otherwise build the `Node`. The selector returns a whole `Attribute`; the `Node` needs just its name, and `partitionData` needs the whole attribute.",
        md(
          "```",
          "buildTree (_, []) _ _ = Null",
          "buildTree dataSet@(header, rows) classifier@(cname, _) selector",
          "  | allSame classes = Leaf (head classes)",
          "  | otherwise = Node name [(v, buildTree d classifier selector)",
          "                          | (v, d) <- partitionData dataSet att]",
          "  where",
          "    classes = map (lookUpAtt cname header) rows",
          "    att@(name, _) = selector dataSet classifier",
          "```",
        ),
      ],
      solution: hs`buildTree :: DataSet -> Attribute -> AttSelector -> DecisionTree
buildTree (_, []) _ _ = Null
buildTree dataSet@(header, rows) classifier@(cname, _) selector
  | allSame classes = Leaf (head classes)
  | otherwise = Node name [(v, buildTree d classifier selector)
                          | (v, d) <- partitionData dataSet att]
  where
    classes = map (lookUpAtt cname header) rows
    att@(name, _) = selector dataSet classifier`,
      tests: [
        { expr: "buildTree fishingData result nextAtt == fig1", label: "buildTree fishingData result nextAtt == fig1" },
        { expr: "buildTree (header, []) result nextAtt", expected: "Null" },
        { expr: "buildTree (header, take 2 table) result nextAtt", expected: 'Leaf "bad"' },
        {
          expr: "buildTree (header, take 3 table) result nextAtt",
          expected: 'Node "outlook" [("sunny",Leaf "bad"),("overcast",Leaf "good"),("rainy",Null)]',
        },
        {
          expr: 'buildTree ([result, wind], [["good","calm"],["bad","windy"]]) result nextAtt',
          expected: 'Node "wind" [("windy",Leaf "bad"),("calm",Leaf "good")]',
          label: "the classifier column can come first",
        },
        { expr: "nodes (buildTree fishingData result nextAtt)", expected: "18" },
        { expr: "map (evalTree (buildTree fishingData result nextAtt) header) table", expected: "map last table" },
      ],
    },
    {
      id: "entropy",
      name: "entropy",
      part: "Part IV",
      marks: 1,
      prompt: md(
        "Part IV is worth 2 marks in total, shared between `entropy`, `gain` and `bestGainAtt`.",
        "",
        "Using the given `xlogx` (which computes `x * log2 x`, and gives 0 when `x` is 0) and your `buildFrequencyTable`, define `entropy :: DataSet -> Attribute -> Double`. If attribute A has values with counts n1, n2, ... in a data set of N rows, then each value has probability p = n / N and",
        "",
        "```",
        "entropy = sum over the values of  - p * log2 p",
        "```",
        "",
        "The entropy of a data set with no rows is defined to be 0.0.",
        "",
        "```",
        "ghci> entropy fishingData result",
        "0.9402859586706309",
        "ghci> entropy fishingData temp",
        "1.5566567074628228",
        "ghci> entropy (header, []) result",
        "0.0",
        "```",
        "",
        "(The tests allow a tiny rounding difference, because adding Doubles in a different order can change the last digit.)",
      ),
      hints: [
        "Get the counts with `buildFrequencyTable`, turn each into a probability, apply `xlogx`, add them up and negate.",
        "Handle the empty table first: `entropy (_, []) _ = 0.0` (otherwise you would divide by zero).",
        "Counts are `Int`s. Convert with `fromIntegral` before dividing: `fromIntegral n / fromIntegral (length rows)`.",
        "`entropy d@(_, rows) att = negate (sum [xlogx (fromIntegral n / total) | (_, n) <- buildFrequencyTable att d]) where total = fromIntegral (length rows)`.",
      ],
      solution: hs`entropy :: DataSet -> Attribute -> Double
entropy (_, []) _ = 0.0
entropy dataSet@(_, rows) att
  = negate (sum [xlogx (fromIntegral n / total) | (_, n) <- buildFrequencyTable att dataSet])
  where
    total = fromIntegral (length rows)`,
      tests: [
        { expr: "abs (entropy fishingData result - 0.9402859586706309) < 1e-9", label: "entropy fishingData result ~ 0.9402859586706309" },
        { expr: "abs (entropy fishingData temp - 1.5566567074628228) < 1e-9", label: "entropy fishingData temp ~ 1.5566567074628228" },
        { expr: "entropy (header, []) result", expected: "0.0" },
        { expr: "abs (entropy (header, take 2 table) result) < 1e-12", label: "all rows the same class: entropy 0" },
        { expr: "abs (entropy (header, take 4 table) result - 1.0) < 1e-9", label: "2 good and 2 bad: entropy 1" },
        { expr: "abs (entropy fishingData outlook - 1.5774062828523454) < 1e-9", label: "entropy fishingData outlook ~ 1.577" },
      ],
    },
    {
      id: "gain",
      name: "gain",
      part: "Part IV",
      marks: 0.5,
      prompt: md(
        "Define `gain :: DataSet -> Attribute -> Attribute -> Double`. `gain d p c` is the information gain of partitioning data set `d` on attribute `p`, with classification attribute `c`:",
        "",
        "```",
        "gain d p c = entropy d c  -  sum over the partitions (v, d') of  prob(v) * entropy d' c",
        "```",
        "",
        "where prob(v) is the fraction of `d`'s rows that have value `v` for `p` (equivalently, the number of rows in `d'` divided by the number of rows in `d`). For example, for outlook: 0.940 - (5/14 * 0.971 + 4/14 * 0.0 + 5/14 * 0.971) = 0.247.",
        "",
        "```",
        "ghci> gain fishingData outlook result",
        "0.2467498197744391",
        "ghci> gain fishingData temp result",
        "2.9222565658954647e-2",
        "ghci> gain fishingData humidity result",
        "0.15183550136234136",
        "ghci> gain fishingData wind result",
        "4.812703040826927e-2",
        "```",
      ),
      hints: [
        "Use `partitionData d p` to get the smaller data sets, and `entropy` on each of them.",
        "Each partition's weight is (rows in the partition) / (rows in `d`). Both are `Int`s, so use `fromIntegral`.",
        "`partitionData` keeps the classification column in every partition, so `entropy d' c` works directly on each `d'`.",
        md(
          "```",
          "gain dataSet@(_, rows) p c",
          "  = entropy dataSet c - sum [weight d * entropy d c | (_, d) <- partitionData dataSet p]",
          "  where",
          "    weight (_, rows') = fromIntegral (length rows') / fromIntegral (length rows)",
          "```",
        ),
      ],
      solution: hs`gain :: DataSet -> Attribute -> Attribute -> Double
gain dataSet@(_, rows) partAtt classAtt
  = entropy dataSet classAtt - sum [weight d * entropy d classAtt | (_, d) <- partitionData dataSet partAtt]
  where
    weight (_, rows') = fromIntegral (length rows') / fromIntegral (length rows)`,
      tests: [
        { expr: "abs (gain fishingData outlook result - 0.2467498197744391) < 1e-9", label: "gain fishingData outlook result ~ 0.2467498197744391" },
        { expr: "abs (gain fishingData temp result - 2.9222565658954647e-2) < 1e-9", label: "gain fishingData temp result ~ 2.9222565658954647e-2" },
        { expr: "abs (gain fishingData humidity result - 0.15183550136234136) < 1e-9", label: "gain fishingData humidity result ~ 0.15183550136234136" },
        { expr: "abs (gain fishingData wind result - 4.812703040826927e-2) < 1e-9", label: "gain fishingData wind result ~ 4.812703040826927e-2" },
        {
          expr: "all (\\a -> gain fishingData a result >= 0) [outlook, temp, humidity, wind]",
          label: "gain is never negative",
        },
        { expr: "abs (gain (header, take 2 table) wind result) < 1e-12", label: "no gain when the classes are already pure" },
      ],
    },
    {
      id: "bestGainAtt",
      name: "bestGainAtt",
      part: "Part IV",
      marks: 0.5,
      prompt: md(
        "Define the attribute selector `bestGainAtt :: AttSelector` (that is, `DataSet -> Attribute -> Attribute`), which picks the attribute with the largest `gain`. The second argument is the classification attribute.",
        "",
        "**Important:** remove the classification attribute from the header before choosing, otherwise it could win (its gain is the biggest possible) and you would split on the answer itself.",
        "",
        "```",
        "ghci> bestGainAtt fishingData result",
        "(\"outlook\",[\"sunny\",\"overcast\",\"rainy\"])",
        "ghci> buildTree fishingData result bestGainAtt",
        "Node \"outlook\" [(\"sunny\",Node \"humidity\" [(\"high\",Leaf \"bad\"),",
        "  (\"normal\",Leaf \"good\")]),(\"overcast\",Leaf \"good\"),",
        "  (\"rainy\",Node \"wind\" [(\"windy\",Leaf \"bad\"),(\"calm\",Leaf \"good\")])]",
        "ghci> buildTree fishingData result bestGainAtt == fig2",
        "True",
        "```",
      ),
      hints: [
        "`maximumBy` from `Data.List` with `comparing` from `Data.Ord` picks the element with the biggest score.",
        "The candidates are `remove cname header`, where `cname` is the name of the classification attribute. `remove` works because a `Header` is a list of pairs.",
        "The score of a candidate attribute `a` is `gain dataSet a classifier`.",
        "`bestGainAtt dataSet@(header, _) classifier@(cname, _) = maximumBy (comparing (\\a -> gain dataSet a classifier)) (remove cname header)`.",
      ],
      solution: hs`bestGainAtt :: AttSelector
bestGainAtt dataSet@(header, _) classifier@(cname, _)
  = maximumBy (comparing (\a -> gain dataSet a classifier)) (remove cname header)`,
      tests: [
        { expr: "bestGainAtt fishingData result", expected: "outlook" },
        { expr: "buildTree fishingData result bestGainAtt == fig2", label: "buildTree fishingData result bestGainAtt == fig2" },
        { expr: 'bestGainAtt (lookUp "sunny" outlookPartition) result', expected: "humidity" },
        { expr: 'bestGainAtt (lookUp "rainy" outlookPartition) result', expected: "wind" },
        { expr: "nodes (buildTree fishingData result bestGainAtt)", expected: "8" },
        {
          expr: 'bestGainAtt ([result, wind, temp], [["good","calm","hot"],["bad","windy","hot"]]) result',
          expected: "wind",
          label: "the classifier is never chosen, even when it comes first",
        },
      ],
    },
  ],
};
