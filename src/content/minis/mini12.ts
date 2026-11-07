import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "m12",
  year: 0,
  difficulty: 12,
  minutes: 120,
  title: "Mini paper 12: Huffman coding",
  summary:
    "Compress text with Huffman codes: count letter frequencies, build the code tree by repeatedly merging the two lightest trees, read off the code table, then encode, decode and rebuild a tree from its codes.",
  skills: [
    "recursion over a binary tree data type",
    "group and sort to count frequencies",
    "inserting into a sorted list",
    "repeat-until-one-left recursion",
    "accumulating paths while walking a tree",
    "returning a pair (result, leftover input)",
    "splitting a list by a pattern in a comprehension",
  ],
  story: md(
    "This paper is about **compressing text**. Computers normally store every character in the same number of bits (8 for ASCII). But in most text some letters are far more common than others. **Huffman coding** gives common letters *short* codes and rare letters *long* codes, so the whole message takes fewer bits.",
    "",
    "Take the word `abracadabra`. It has 5 a's, 2 b's, 2 r's, 1 c and 1 d. A Huffman code for it is:",
    "",
    "```",
    "a  0",
    "c  100",
    "d  101",
    "b  110",
    "r  111",
    "```",
    "",
    "so `abracadabra` becomes `0 110 111 0 100 0 101 0 110 111 0`, just 23 bits instead of 88.",
    "",
    "**Why it can be decoded.** No code is the start (a *prefix*) of another code: nothing else starts with `0`, and the three-bit codes are all different. So when you read bits from the left, as soon as what you've read matches a code you know exactly which letter it was. That is called a **prefix code**.",
    "",
    "**The code tree.** A prefix code is really a binary tree. Every letter is a **leaf**. To find a letter's code, walk from the root to its leaf, writing `0` each time you go **left** and `1` each time you go **right**:",
    "",
    "```",
    "          (11)",
    "         /    \\",
    "       a:5    (6)",
    "             /    \\",
    "          (2)      (4)",
    "         /   \\    /   \\",
    "       c:1  d:1  b:2  r:2",
    "```",
    "",
    "Each node also stores a **weight**: for a leaf, how often its letter occurs; for an inner node, the total weight of everything below it.",
    "",
    "**Building the tree (Huffman's algorithm).** Start with one leaf per letter, kept in a list sorted lightest first. Then repeatedly take the **two lightest** trees off the front, join them under a new node whose weight is the sum of theirs (the first one taken goes on the left), and put the new tree back into the list in its sorted place. Each step reduces the number of trees by one; when only one tree is left, that is the Huffman tree. Rare letters get merged early, so they end up deep in the tree with long codes.",
    "",
    "### The given types",
    "",
    "```",
    "data HTree = Leaf Int Char | Node Int HTree HTree",
    "type Code = String",
    "type CodeTable = [(Char, Code)]",
    "```",
    "",
    "- `Leaf w c` is a leaf for character `c` with weight `w`.",
    "- `Node w l r` is an inner node with weight `w`, left subtree `l` and right subtree `r`.",
    "- A `Code` is a string of the characters `'0'` and `'1'`, like `\"110\"`.",
    "- A `CodeTable` pairs every character with its code.",
    "",
    "Given to you: `lookUp` (find the value for a key that is known to be present), the text `text1 = \"abracadabra\"`, its frequency table `freqs1`, its Huffman tree `tree1` (drawn above) and code table `table1`, a second small example `text2`, `freqs2`, `tree2`, and a longer sentence `text3`.",
  ),
  notes: md(
    "**Where the marks are.** 25 marks. Part I (4) is warm-up, Part II (11) is the heart of the paper, Part III (6) uses Part II, and Part IV (4) is a separate tree-building puzzle that only needs to understand codes.",
    "",
    "**Order of attack.** `weight` and `frequencies` first. Then `insertTree` and `buildTree`: check `buildTree freqs1 == tree1` before moving on. `codeTable` and `encode` are quick once you have them. `decode` is the trickiest of the core functions, so save it until encode works and test with round trips like `decode tree1 (encode tree1 text1)`.",
    "",
    "**Traps.**",
    "",
    "- In `insertTree`, a new tree goes **after** any trees of equal weight. Getting this backwards still builds *a* valid Huffman tree, but not the one the tests expect.",
    "- In `buildTree`, insert the leaves in the order they appear in the table. `foldr` inserts them in *reverse* order, which changes how ties are broken.",
    "- The first of the two trees you take off the list goes on the **left**.",
    "- `codeTable` of a tree that is a single leaf must give that letter the code `\"0\"`, not `\"\"`.",
    "- In `decode`, after finding one letter you go back to the **root** for the next one.",
    "",
    "**Short of time?** Part IV is independent of everything else apart from understanding codes: if you are stuck on `decode`, try it.",
  ),
  setup: hs`import Data.List

data HTree = Leaf Int Char | Node Int HTree HTree
  deriving (Eq, Show)

type Code = String

type CodeTable = [(Char, Code)]

-- Finds the value paired with a key; the key must be present
lookUp :: Eq a => a -> [(a, b)] -> b
lookUp x table = head [v | (k, v) <- table, k == x]

--------------------------------------------------------------
-- Examples

text1 :: String
text1 = "abracadabra"

freqs1 :: [(Char, Int)]
freqs1 = [('a',5),('b',2),('c',1),('d',1),('r',2)]

tree1 :: HTree
tree1
  = Node 11 (Leaf 5 'a')
            (Node 6 (Node 2 (Leaf 1 'c') (Leaf 1 'd'))
                    (Node 4 (Leaf 2 'b') (Leaf 2 'r')))

table1 :: CodeTable
table1 = [('a',"0"),('c',"100"),('d',"101"),('b',"110"),('r',"111")]

text2 :: String
text2 = "zxyxzx"

freqs2 :: [(Char, Int)]
freqs2 = [('x',3),('y',1),('z',2)]

tree2 :: HTree
tree2 = Node 6 (Leaf 3 'x') (Node 3 (Leaf 1 'y') (Leaf 2 'z'))

text3 :: String
text3 = "she sells sea shells on the sea shore"
`,
  starter: hs`--------------------------------------------------------------
-- Part I

weight :: HTree -> Int
weight = undefined

frequencies :: String -> [(Char, Int)]
frequencies = undefined

--------------------------------------------------------------
-- Part II

insertTree :: HTree -> [HTree] -> [HTree]
insertTree = undefined

buildTree :: [(Char, Int)] -> HTree
buildTree = undefined

codeTable :: HTree -> CodeTable
codeTable = undefined

--------------------------------------------------------------
-- Part III

encode :: HTree -> String -> Code
encode = undefined

decode :: HTree -> Code -> String
decode = undefined

--------------------------------------------------------------
-- Part IV

treeFromCodes :: CodeTable -> HTree
treeFromCodes = undefined
`,
  tasks: [
    {
      id: "weight",
      name: "weight",
      part: "Part I",
      marks: 1,
      prompt: md(
        "Define a function `weight :: HTree -> Int` that returns the weight stored at the root of a tree. For example:",
        "",
        "```",
        "ghci> weight (Leaf 3 'x')",
        "3",
        "ghci> weight tree1",
        "11",
        "```",
      ),
      hints: [
        "There are two constructors, so write two equations.",
        "The weight is the first field of both `Leaf` and `Node`. You don't need to look inside the subtrees.",
        "Use `_` for the fields you don't care about.",
        md("```", "weight (Leaf w _) = w", "weight (Node w _ _) = w", "```"),
      ],
      solution: hs`weight :: HTree -> Int
weight (Leaf w _) = w
weight (Node w _ _) = w`,
      tests: [
        { expr: "weight (Leaf 3 'x')", expected: "3" },
        { expr: "weight tree1", expected: "11" },
        { expr: "weight tree2", expected: "6" },
        { expr: "weight (Node 0 (Leaf 5 'a') (Leaf 7 'b'))", expected: "0", label: "the stored weight is returned, not recomputed" },
        { expr: "map weight [Leaf 1 'c', Leaf 2 'b']", expected: "[1,2]" },
        { expr: "weight (Leaf 0 ' ')", expected: "0" },
      ],
    },
    {
      id: "frequencies",
      name: "frequencies",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define a function `frequencies :: String -> [(Char, Int)]` that returns each different character in a string paired with the number of times it occurs. The list must be sorted by character, with no character appearing twice. For example:",
        "",
        "```",
        "ghci> frequencies \"abracadabra\"",
        "[('a',5),('b',2),('c',1),('d',1),('r',2)]",
        "ghci> frequencies \"zxyxzx\"",
        "[('x',3),('y',1),('z',2)]",
        "ghci> frequencies \"\"",
        "[]",
        "```",
        "",
        "`sort` and `group` from `Data.List` are useful here: `group` splits a list into runs of equal neighbouring elements.",
      ),
      hints: [
        "If you sort the string first, all copies of each character sit next to each other: `sort \"abracadabra\"` is `\"aaaaabbcdrr\"`.",
        "`group \"aaaaabbcdrr\"` is `[\"aaaaa\",\"bb\",\"c\",\"d\",\"rr\"]`: one run per character.",
        "Each run `g` becomes the pair `(head g, length g)`. A list comprehension or `map` does that for every run.",
        "`frequencies s = [(head g, length g) | g <- group (sort s)]`.",
      ],
      solution: hs`frequencies :: String -> [(Char, Int)]
frequencies s = [(head g, length g) | g <- group (sort s)]`,
      tests: [
        { expr: 'frequencies "abracadabra"', expected: "[('a',5),('b',2),('c',1),('d',1),('r',2)]" },
        { expr: "frequencies text2", expected: "freqs2" },
        { expr: 'frequencies ""', expected: "[]" },
        { expr: 'frequencies "q"', expected: "[('q',1)]" },
        { expr: 'frequencies "bbba"', expected: "[('a',1),('b',3)]", label: "sorted by character, not by count" },
        { expr: "frequencies text3", expected: "[(' ',7),('a',2),('e',7),('h',4),('l',4),('n',1),('o',2),('r',1),('s',8),('t',1)]" },
        { expr: "sum (map snd (frequencies text3))", expected: "length text3" },
      ],
    },
    {
      id: "insertTree",
      name: "insertTree",
      part: "Part II",
      marks: 2,
      prompt: md(
        "Define a function `insertTree :: HTree -> [HTree] -> [HTree]` that inserts a tree into a list of trees that is already sorted by weight, lightest first, so that the result is still sorted. The new tree must go **after** any trees that have the same weight as it. For example:",
        "",
        "```",
        "ghci> insertTree (Leaf 2 'x') [Leaf 1 'a', Leaf 3 'b']",
        "[Leaf 1 'a',Leaf 2 'x',Leaf 3 'b']",
        "ghci> insertTree (Leaf 2 'x') [Leaf 2 'a', Leaf 2 'b', Leaf 5 'c']",
        "[Leaf 2 'a',Leaf 2 'b',Leaf 2 'x',Leaf 5 'c']",
        "ghci> insertTree (Leaf 9 'x') []",
        "[Leaf 9 'x']",
        "```",
      ),
      hints: [
        "This is the classic insert-into-a-sorted-list recursion, comparing by `weight`.",
        "Base case: inserting into `[]` gives a one-element list.",
        "For `u : us`: if the new tree is *strictly* lighter than `u`, it goes in front. Otherwise `u` stays first and you insert into `us`. Using `<` (not `<=`) is what puts it after equal weights.",
        md(
          "```",
          "insertTree t [] = [t]",
          "insertTree t (u : us)",
          "  | weight t < weight u = t : u : us",
          "  | otherwise           = u : insertTree t us",
          "```",
        ),
      ],
      solution: hs`insertTree :: HTree -> [HTree] -> [HTree]
insertTree t [] = [t]
insertTree t (u : us)
  | weight t < weight u = t : u : us
  | otherwise           = u : insertTree t us`,
      tests: [
        { expr: "insertTree (Leaf 2 'x') [Leaf 1 'a', Leaf 3 'b']", expected: "[Leaf 1 'a',Leaf 2 'x',Leaf 3 'b']" },
        { expr: "insertTree (Leaf 2 'x') [Leaf 2 'a', Leaf 2 'b', Leaf 5 'c']", expected: "[Leaf 2 'a',Leaf 2 'b',Leaf 2 'x',Leaf 5 'c']", label: "goes after equal weights" },
        { expr: "insertTree (Leaf 9 'x') []", expected: "[Leaf 9 'x']" },
        { expr: "insertTree (Leaf 0 'x') [Leaf 1 'a']", expected: "[Leaf 0 'x',Leaf 1 'a']" },
        { expr: "insertTree (Leaf 7 'x') [Leaf 1 'a', Leaf 3 'b']", expected: "[Leaf 1 'a',Leaf 3 'b',Leaf 7 'x']" },
        { expr: "insertTree tree2 [Leaf 1 'a', Leaf 6 'b', Leaf 8 'c']", expected: "[Leaf 1 'a',Leaf 6 'b',tree2,Leaf 8 'c']", label: "works on inner nodes too" },
        { expr: "map weight (foldr insertTree [] [Leaf w 'a' | w <- [5,3,8,1,1,9,2]])", expected: "[1,1,2,3,5,8,9]" },
      ],
    },
    {
      id: "buildTree",
      name: "buildTree",
      part: "Part II",
      marks: 5,
      prompt: md(
        "Using `insertTree`, define a function `buildTree :: [(Char, Int)] -> HTree` that builds the Huffman tree for a frequency table, as follows.",
        "",
        "1. Make a `Leaf` for every entry of the table. Starting from the empty list, insert the leaves **one at a time, in the order they appear in the table**, using `insertTree`. This gives a list sorted by weight.",
        "2. If the list has exactly one tree, that is the answer.",
        "3. Otherwise take the first two trees `t1` and `t2` off the front, make `Node (weight t1 + weight t2) t1 t2`, insert it into the rest of the list with `insertTree`, and go back to step 2.",
        "",
        "For example:",
        "",
        "```",
        "ghci> buildTree freqs2",
        "Node 6 (Leaf 3 'x') (Node 3 (Leaf 1 'y') (Leaf 2 'z'))",
        "ghci> buildTree freqs1 == tree1",
        "True",
        "ghci> buildTree [('q',4)]",
        "Leaf 4 'q'",
        "```",
        "",
        "For `freqs1` the starting list is `c:1, d:1, b:2, r:2, a:5`. Merging c and d gives a tree of weight 2, which goes *after* b and r. Then b and r are merged (weight 4), then those two (weight 6), and finally a with that.",
        "",
        "You may assume the table has at least one entry.",
      ),
      hints: [
        "Split the job in two: making the sorted starting list, and a recursive helper `merge :: [HTree] -> HTree` that does steps 2 and 3.",
        "Starting list: insert the leaves left to right. `foldl (\\ts t -> insertTree t ts) [] leaves` does that. (`foldr insertTree [] leaves` would insert them right to left, which breaks ties differently.)",
        "The helper has two cases: `merge [t] = t` and `merge (t1 : t2 : ts) = merge (insertTree (Node (weight t1 + weight t2) t1 t2) ts)`.",
        md(
          "```",
          "buildTree freqs = merge (foldl (\\ts t -> insertTree t ts) [] leaves)",
          "  where",
          "    leaves = [Leaf n c | (c, n) <- freqs]",
          "    merge [t] = t",
          "    merge (t1 : t2 : ts) = merge (insertTree (Node (weight t1 + weight t2) t1 t2) ts)",
          "```",
        ),
      ],
      solution: hs`buildTree :: [(Char, Int)] -> HTree
buildTree freqs = merge (foldl (\ts t -> insertTree t ts) [] leaves)
  where
    leaves = [Leaf n c | (c, n) <- freqs]
    merge [t] = t
    merge (t1 : t2 : ts) = merge (insertTree (Node (weight t1 + weight t2) t1 t2) ts)`,
      tests: [
        { expr: "buildTree freqs2", expected: "tree2" },
        { expr: "buildTree freqs1", expected: "tree1" },
        { expr: "buildTree [('q',4)]", expected: "Leaf 4 'q'" },
        { expr: "buildTree [('a',1),('b',1)]", expected: "Node 2 (Leaf 1 'a') (Leaf 1 'b')" },
        { expr: "buildTree [('a',5),('b',1)]", expected: "Node 6 (Leaf 1 'b') (Leaf 5 'a')", label: "the lighter tree goes on the left" },
        {
          expr: "buildTree [('a',1),('b',1),('c',1),('d',1)]",
          expected: "Node 4 (Node 2 (Leaf 1 'a') (Leaf 1 'b')) (Node 2 (Leaf 1 'c') (Leaf 1 'd'))",
          label: "ties: leaves keep table order, merged trees go after equals",
        },
        { expr: "weight (buildTree (frequencies text3))", expected: "length text3" },
        {
          expr: "buildTree (frequencies \"aaabbc\")",
          expected: "Node 6 (Leaf 3 'a') (Node 3 (Leaf 1 'c') (Leaf 2 'b'))",
        },
      ],
    },
    {
      id: "codeTable",
      name: "codeTable",
      part: "Part II",
      marks: 4,
      prompt: md(
        "Define a function `codeTable :: HTree -> CodeTable` that pairs every character in a tree with its code: the path from the root to its leaf, with `'0'` for each step left and `'1'` for each step right. There is one special case: if the whole tree is a single leaf, its character gets the code `\"0\"` (an empty code would be useless). For example:",
        "",
        "```",
        "ghci> codeTable tree1",
        "[('a',\"0\"),('c',\"100\"),('d',\"101\"),('b',\"110\"),('r',\"111\")]",
        "ghci> codeTable tree2",
        "[('x',\"0\"),('y',\"10\"),('z',\"11\")]",
        "ghci> codeTable (Leaf 4 'q')",
        "[('q',\"0\")]",
        "```",
        "",
        "The order of the pairs doesn't matter.",
      ),
      hints: [
        "Handle the single-leaf case first, then use a recursive helper (in a `where`) for everything else.",
        "In the helper, a leaf is at the end of the path, so its code is the empty string: `go (Leaf _ c) = [(c, \"\")]`.",
        "For a `Node`, every code from the left subtree gets a `'0'` stuck on the front, and every code from the right subtree gets a `'1'`: `[(c, '0' : p) | (c, p) <- go l]`.",
        md(
          "```",
          "codeTable (Leaf _ c) = [(c, \"0\")]",
          "codeTable t = go t",
          "  where",
          "    go (Leaf _ c) = [(c, \"\")]",
          "    go (Node _ l r) = [(c, '0' : p) | (c, p) <- go l] ++ [(c, '1' : p) | (c, p) <- go r]",
          "```",
        ),
      ],
      solution: hs`codeTable :: HTree -> CodeTable
codeTable (Leaf _ c) = [(c, "0")]
codeTable t = go t
  where
    go (Leaf _ c) = [(c, "")]
    go (Node _ l r) = [(c, '0' : p) | (c, p) <- go l] ++ [(c, '1' : p) | (c, p) <- go r]`,
      tests: [
        { expr: "codeTable tree1", expected: "table1", unordered: true },
        { expr: "codeTable tree2", expected: '[(\'x\',"0"),(\'y\',"10"),(\'z\',"11")]', unordered: true },
        { expr: "codeTable (Leaf 4 'q')", expected: '[(\'q\',"0")]', label: "a single leaf gets the code \"0\"" },
        { expr: "codeTable (Node 2 (Leaf 1 'a') (Leaf 1 'b'))", expected: '[(\'a\',"0"),(\'b\',"1")]', unordered: true },
        {
          expr: "codeTable (Node 3 (Node 2 (Leaf 1 'p') (Leaf 1 'q')) (Leaf 1 'r'))",
          expected: '[(\'p\',"00"),(\'q\',"01"),(\'r\',"1")]',
          unordered: true,
        },
        { expr: "length (codeTable (buildTree (frequencies text3)))", expected: "10" },
        {
          expr: "and [not (isPrefixOf p q) | (a, p) <- codeTable (buildTree (frequencies text3)), (b, q) <- codeTable (buildTree (frequencies text3)), a /= b]",
          label: "no code is a prefix of another (text3)",
        },
      ],
    },
    {
      id: "encode",
      name: "encode",
      part: "Part III",
      marks: 2,
      prompt: md(
        "Using `codeTable`, define a function `encode :: HTree -> String -> Code` that encodes a message by replacing every character with its code from the tree, and joining the codes together. You may assume every character of the message appears in the tree. For example:",
        "",
        "```",
        "ghci> encode tree1 \"abracadabra\"",
        "\"01101110100010101101110\"",
        "ghci> encode tree2 \"zxy\"",
        "\"11010\"",
        "ghci> encode tree1 \"\"",
        "\"\"",
        "```",
      ),
      hints: [
        "Build the code table once, in a `where`.",
        "For each character, look up its code with the given `lookUp`.",
        "`concatMap` applies a function that returns a list to every element and joins the results.",
        md("```", "encode t s = concatMap (\\c -> lookUp c table) s", "  where", "    table = codeTable t", "```"),
      ],
      solution: hs`encode :: HTree -> String -> Code
encode t s = concatMap (\c -> lookUp c table) s
  where
    table = codeTable t`,
      tests: [
        { expr: 'encode tree1 "abracadabra"', expected: '"01101110100010101101110"' },
        { expr: 'encode tree2 "zxy"', expected: '"11010"' },
        { expr: 'encode tree1 ""', expected: '""' },
        { expr: "encode tree2 text2", expected: '"110100110"' },
        { expr: 'encode (Leaf 4 \'q\') "qqqq"', expected: '"0000"' },
        { expr: "length (encode (buildTree (frequencies text3)) text3)", expected: "112" },
        { expr: 'encode tree1 "dc"', expected: '"101100"' },
      ],
    },
    {
      id: "decode",
      name: "decode",
      part: "Part III",
      marks: 4,
      prompt: md(
        "Define a function `decode :: HTree -> Code -> String` that turns a string of bits back into the message. Start at the root. Read one bit at a time, going left for `'0'` and right for `'1'`. When you reach a leaf, output its character and go back to the **root** for the next character. Stop when the bits run out.",
        "",
        "You may assume the tree has at least two leaves and the bits are a complete, valid encoding (they never run out in the middle of a character). For example:",
        "",
        "```",
        "ghci> decode tree1 \"01101110100010101101110\"",
        "\"abracadabra\"",
        "ghci> decode tree2 \"11010\"",
        "\"zxy\"",
        "ghci> decode tree1 \"\"",
        "\"\"",
        "```",
      ),
      hints: [
        "Write a helper that decodes *one* character: given a tree and the bits, it walks down to a leaf and returns the character **and the bits that are left over**, as a pair.",
        "The helper: at a `Leaf _ c` the answer is `(c, bits)`; at a `Node _ l r` with bits `b : bs`, carry on in `l` if `b == '0'` and in `r` otherwise, with `bs`.",
        "Then `decode t [] = []`, and for non-empty bits, use the helper on the **whole** tree `t`, keep the character, and call `decode t` on the leftover bits.",
        md(
          "```",
          "decode _ [] = []",
          "decode t bits = c : decode t rest",
          "  where",
          "    (c, rest) = one t bits",
          "    one (Leaf _ x) bs = (x, bs)",
          "    one (Node _ l r) (b : bs)",
          "      | b == '0'  = one l bs",
          "      | otherwise = one r bs",
          "```",
        ),
      ],
      solution: hs`decode :: HTree -> Code -> String
decode _ [] = []
decode t bits = c : decode t rest
  where
    (c, rest) = one t bits
    one (Leaf _ x) bs = (x, bs)
    one (Node _ l r) (b : bs)
      | b == '0'  = one l bs
      | otherwise = one r bs`,
      tests: [
        { expr: 'decode tree1 "01101110100010101101110"', expected: '"abracadabra"' },
        { expr: 'decode tree2 "11010"', expected: '"zxy"' },
        { expr: 'decode tree1 ""', expected: '""' },
        { expr: 'decode tree1 "0000"', expected: '"aaaa"' },
        { expr: 'decode tree1 "111110101100"', expected: '"rbdc"' },
        { expr: "decode tree2 (encode tree2 text2)", expected: "text2" },
        {
          expr: "decode (buildTree (frequencies text3)) (encode (buildTree (frequencies text3)) text3)",
          expected: "text3",
          label: "round trip on text3",
        },
        {
          expr: "decode (buildTree (frequencies ['a'..'z'])) (encode (buildTree (frequencies ['a'..'z'])) \"thequickbrownfoxjumpsoverthelazydog\")",
          expected: '"thequickbrownfoxjumpsoverthelazydog"',
        },
      ],
    },
    {
      id: "treeFromCodes",
      name: "treeFromCodes",
      part: "Part IV",
      marks: 4,
      prompt: md(
        "The person decoding a message needs the tree, but sending a whole `HTree` is wasteful: the code table is enough, because the tree can be rebuilt from it. Weights are not needed for decoding, so the rebuilt tree has **weight 0 everywhere**.",
        "",
        "Define a function `treeFromCodes :: CodeTable -> HTree` that rebuilds the tree from a code table, so that `codeTable (treeFromCodes table)` gives back the same codes (in any order). For example:",
        "",
        "```",
        "ghci> treeFromCodes [('a',\"0\"),('b',\"1\")]",
        "Node 0 (Leaf 0 'a') (Leaf 0 'b')",
        "ghci> treeFromCodes table1",
        "Node 0 (Leaf 0 'a') (Node 0 (Node 0 (Leaf 0 'c') (Leaf 0 'd')) (Node 0 (Leaf 0 'b') (Leaf 0 'r')))",
        "ghci> treeFromCodes [('r',\"111\"),('a',\"0\"),('d',\"101\"),('b',\"110\"),('c',\"100\")]",
        "Node 0 (Leaf 0 'a') (Node 0 (Node 0 (Leaf 0 'c') (Leaf 0 'd')) (Node 0 (Leaf 0 'b') (Leaf 0 'r')))",
        "```",
        "",
        "You may assume the table has at least two entries and is a complete prefix code from some tree: every code is non-empty, no code is a prefix of another, and every node in the tree has two children.",
      ),
      hints: [
        "Think about the *first* bit of each code. Codes starting with `'0'` are in the left subtree, codes starting with `'1'` in the right.",
        "Make a recursive helper that works on a table whose codes may be empty. If the table is a single entry with an empty code, `[(c, \"\")]`, you have reached a leaf.",
        "Otherwise split the table and chop off the first bit at the same time, with patterns in comprehensions: `[(c, cs) | (c, '0' : cs) <- table]` for the left and `'1'` for the right. Build a `Node 0` from the two recursive results.",
        md(
          "```",
          "treeFromCodes [(c, \"\")] = Leaf 0 c",
          "treeFromCodes table",
          "  = Node 0 (treeFromCodes [(c, cs) | (c, '0' : cs) <- table])",
          "           (treeFromCodes [(c, cs) | (c, '1' : cs) <- table])",
          "```",
          "",
          "(The function itself can be the helper: the preconditions only rule out empty codes at the top level.)",
        ),
      ],
      solution: hs`treeFromCodes :: CodeTable -> HTree
treeFromCodes [(c, "")] = Leaf 0 c
treeFromCodes table
  = Node 0 (treeFromCodes [(c, cs) | (c, '0' : cs) <- table])
           (treeFromCodes [(c, cs) | (c, '1' : cs) <- table])`,
      tests: [
        { expr: "treeFromCodes [('a',\"0\"),('b',\"1\")]", expected: "Node 0 (Leaf 0 'a') (Leaf 0 'b')" },
        {
          expr: "treeFromCodes table1",
          expected: "Node 0 (Leaf 0 'a') (Node 0 (Node 0 (Leaf 0 'c') (Leaf 0 'd')) (Node 0 (Leaf 0 'b') (Leaf 0 'r')))",
        },
        {
          expr: "treeFromCodes [('r',\"111\"),('a',\"0\"),('d',\"101\"),('b',\"110\"),('c',\"100\")]",
          expected: "treeFromCodes table1",
          label: "the order of the table doesn't matter",
        },
        { expr: "treeFromCodes [('b',\"1\"),('a',\"0\")]", expected: "Node 0 (Leaf 0 'a') (Leaf 0 'b')" },
        { expr: "codeTable (treeFromCodes (codeTable tree2))", expected: "codeTable tree2", unordered: true },
        {
          expr: "codeTable (treeFromCodes (codeTable (buildTree (frequencies text3))))",
          expected: "codeTable (buildTree (frequencies text3))",
          unordered: true,
        },
        {
          expr: "decode (treeFromCodes table1) \"01101110100010101101110\"",
          expected: "text1",
          label: "the rebuilt tree decodes just as well",
        },
        {
          expr: "treeFromCodes [('p',\"00\"),('q',\"01\"),('r',\"1\")]",
          expected: "Node 0 (Node 0 (Leaf 0 'p') (Leaf 0 'q')) (Leaf 0 'r')",
        },
      ],
    },
  ],
};
