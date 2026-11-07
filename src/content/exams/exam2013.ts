import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "y2013",
  year: 2013,
  title: "Binomial Heaps",
  summary: "Build a binomial heap (a forest of ordered trees) that can insert values, find the smallest and delete it, then use it to sort a list.",
  skills: [
    "pattern matching on data constructors",
    "recursion over trees",
    "merging two sorted lists",
    "minimum and break",
    "foldr to build a structure",
    "binary arithmetic on lists of bits",
  ],
  story: md(
    "This paper is about a clever way of storing a collection of values so that you can always get the smallest one out quickly. Programmers call such a collection a priority queue. Think of a hospital waiting room where the most urgent patient is always seen next.",
    "",
    "The simplest priority queue is a sorted list: the smallest value is at the front. But putting a new value into a sorted list means walking along the list to find its place, which is slow for long lists. A binomial heap is a smarter shape that makes insert, find-smallest and delete-smallest all fast.",
    "",
    "**Trees.** A tree here is a value sitting at a node, with a list of smaller trees (its children) hanging below it. The node at the very top is the root. A node with no children is a leaf.",
    "",
    "**Ordered (min-heap) trees.** Every tree in this paper obeys one rule: a node's value is smaller than or equal to every value below it. So the root of a tree always holds that tree's smallest value. Here is a tree of 4 values:",
    "",
    "```",
    "      2",
    "     / \\",
    "    8   7",
    "    |",
    "    9",
    "```",
    "",
    "Going down any path the numbers only get bigger: 2, 8, 9 and 2, 7.",
    "",
    "**Binomial trees and rank.** A binomial tree has a very particular shape described by a number called its rank:",
    "",
    "- A tree of rank 0 is a single node with no children.",
    "- A tree of rank r has exactly r children, of ranks r-1, r-2, ..., 1, 0, in that order (biggest first).",
    "",
    "The tree above has rank 2: its children are a rank-1 tree (8 with child 9) and a rank-0 tree (7). A tree of rank r always has exactly 2^r nodes: rank 0 has 1, rank 1 has 2, rank 2 has 4, rank 3 has 8.",
    "",
    "**Combining two trees of the same rank.** Take two trees of rank r. Whichever root is smaller becomes the root of the new tree, and the other tree is stuck on the front of its children list. The result has rank r+1 (twice as many nodes). If both roots are equal, the second tree wins and the first tree becomes its child.",
    "",
    "```",
    "  4        2                2",
    "  |\\   +   |\\    ==>     / | \\",
    "  6 10     8 7           4  8  7",
    "  |        |             |\\  |",
    "  8        9             6 10 9",
    "                         |",
    "                         8",
    "```",
    "",
    "**Binomial heaps.** A heap is a list of binomial trees in increasing order of rank, with at most one tree of each rank. For example a heap of 11 values could be trees of rank 0, 1 and 3 (1 + 2 + 8 = 11). This is exactly like writing 11 in binary: 1011. The smallest value in the whole heap is one of the roots, so to find it you only look at the roots.",
    "",
    "**Merging heaps** works like adding two binary numbers. Walk along both lists of trees. The tree with the smaller rank goes first. If both front trees have the same rank, combine them into one tree of the next rank (a carry!) and merge that into the rest.",
    "",
    "**Deleting the smallest value.** Find the tree whose root is smallest and take it out of the heap. Its children are a list of trees of rank r-1, ..., 1, 0. Reverse that list and it is a valid heap of its own. Merge it back with what was left.",
    "",
    "### The given types",
    "",
    "```",
    "data BinTree a = Node a Int [BinTree a]",
    "type BinHeap a = [BinTree a]",
    "```",
    "",
    "- `Node v r cs` is one tree: `v` is the value at the root, `r` is the rank of this tree, and `cs` is the list of child trees (highest rank first). So `Node 2 2 [Node 8 1 [Node 9 0 []], Node 7 0 []]` is the 4-node tree drawn above.",
    "- `BinHeap a` is just another name for a list of trees, kept in increasing rank order.",
    "- The type `a` can be anything you can compare with `<`, which is why most functions say `Ord a =>`.",
    "",
    "The test data `t1`..`t8` (trees) and `h1`..`h7` (heaps) are given to you. `t5` and `t6` are the two rank-2 trees combined in the picture, and `t7` is the result. `h4` and `h5` are two heaps whose merge is `h6`, and `h7` is `h6` with its minimum deleted.",
  ),
  notes: md(
    "**Where the marks are.** Parts I and II are 22 of the 25 marks. `mergeHeaps` (6) and `deleteMin` (5) are the big ones; `binSort` (4) is easy once those work. Part III (3 marks) is a separate puzzle about binary numbers.",
    "",
    "**Order of attack.** Write `value`, `rank`, `children` first (1 mark, two minutes) and use them everywhere. Then `combineTrees`, `extractMin`, `mergeHeaps`, `insert`. Test `mergeHeaps h4 h5 == h6` before going on. `deleteMin` then `binSort`. Only then Part III.",
    "",
    "**Traps.**",
    "",
    "- In `combineTrees`, when the roots are equal the *second* tree must be the new root. Use `<` (not `<=`) when testing whether the first root is smaller.",
    "- The new child goes on the *front* of the children list, and the new rank is the old rank plus one.",
    "- In `mergeHeaps`, when two ranks are equal, merge the combined tree as a singleton heap `[t]` with the result of merging the tails. Don't just put it on the front: it might clash with a tree of the same rank there.",
    "- In `deleteMin`, if several roots share the minimum value, remove the leftmost one. Remember to `reverse` the children before merging.",
    "- `insert` clashes with `Data.List.insert`, so don't `import Data.List` without an import list.",
    "",
    "**Short of time?** Skip Part III. `toBinary` is the easier half of it if you want one quick mark.",
  ),
  setup: hs`data BinTree a = Node a Int [BinTree a]
  deriving (Eq, Ord, Show)

type BinHeap a = [BinTree a]

--------------------------------------------------------------
-- Test data

-- The trees of Figure 1 (ranks 0, 1, 2 and 3)
t1, t2, t3, t4 :: BinTree Int
t1 = Node 4 0 []
t2 = Node 1 1 [Node 5 0 []]
t3 = Node 2 2 [Node 8 1 [Node 9 0 []], Node 7 0 []]
t4 = Node 2 3 [Node 3 2 [Node 6 1 [Node 8 0 []], Node 10 0 []],
               Node 8 1 [Node 9 0 []],
               Node 7 0 []]

-- The trees of Figure 2: combineTrees t5 t6 == t7
t5, t6, t7 :: BinTree Int
t5 = Node 4 2 [Node 6 1 [Node 8 0 []], Node 10 0 []]
t6 = Node 2 2 [Node 8 1 [Node 9 0 []], Node 7 0 []]
t7 = Node 2 3 [Node 4 2 [Node 6 1 [Node 8 0 []], Node 10 0 []],
               Node 8 1 [Node 9 0 []],
               Node 7 0 []]

-- The rank-2 tree t'' from Section 3.1
t8 :: BinTree Int
t8 = Node 1 2 [Node 12 1 [Node 16 0 []], Node 5 0 []]

h1, h2, h3, h4, h5, h6, h7 :: BinHeap Int
h1 = [t2, t7]

h2 = [t8, t7]

-- Figure 3
h3 = [t1, t2, t4]

-- Figure 4(a): mergeHeaps h4 h5 == h6
h4 = [Node 1 1 [Node 5 0 []], Node 4 2 [Node 6 1 [Node 8 0 []], Node 10 0 []]]

h5 = [Node 4 0 [], Node 12 1 [Node 16 0 []]]

-- Figure 4(b)
h6 = [Node 4 0 [],
      Node 1 3 [Node 4 2 [Node 6 1 [Node 8 0 []], Node 10 0 []],
                Node 12 1 [Node 16 0 []],
                Node 5 0 []]]

-- Figure 5: deleteMin h6 == h7
h7 = [Node 4 3 [Node 4 2 [Node 12 1 [Node 16 0 []], Node 5 0 []],
                Node 6 1 [Node 8 0 []],
                Node 10 0 []]]
`,
  starter: hs`--------------------------------------------------------------
-- Part I

value :: BinTree a -> a
value = undefined

rank :: BinTree a -> Int
rank = undefined

children :: BinTree a -> [BinTree a]
children = undefined

combineTrees :: Ord a => BinTree a -> BinTree a -> BinTree a
combineTrees = undefined

--------------------------------------------------------------
-- Part II

extractMin :: Ord a => BinHeap a -> a
extractMin = undefined

mergeHeaps :: Ord a => BinHeap a -> BinHeap a -> BinHeap a
mergeHeaps = undefined

insert :: Ord a => a -> BinHeap a -> BinHeap a
insert = undefined

deleteMin :: Ord a => BinHeap a -> BinHeap a
deleteMin = undefined

binSort :: Ord a => [a] -> [a]
binSort = undefined

--------------------------------------------------------------
-- Part III

toBinary :: BinHeap a -> [Int]
toBinary = undefined

binarySum :: [Int] -> [Int] -> [Int]
binarySum = undefined
`,
  tasks: [
    {
      id: "accessors",
      name: "value / rank / children",
      part: "Part I",
      marks: 1,
      prompt: md(
        "Define three functions that pull the three pieces out of a tree's root `Node`:",
        "",
        "```",
        "value    :: BinTree a -> a",
        "rank     :: BinTree a -> Int",
        "children :: BinTree a -> [BinTree a]",
        "```",
        "",
        "`value` gives the value stored at the root, `rank` gives the rank, and `children` gives the list of child trees.",
        "",
        "```",
        "ghci> value t4",
        "2",
        "ghci> rank t7",
        "3",
        "ghci> children t2",
        "[Node 5 0 []]",
        "```",
        "",
        "Use these in the later questions instead of pattern matching on `Node` every time.",
      ),
      hints: [
        "Each function is one line of pattern matching on the single constructor `Node`.",
        "The pattern `Node v r cs` names all three parts. Each function returns one of them.",
        "Use `_` for the parts you don't need, e.g. `rank (Node _ r _) = r`.",
        "`value (Node v _ _) = v`, `rank (Node _ r _) = r`, `children (Node _ _ cs) = cs`.",
      ],
      solution: hs`value :: BinTree a -> a
value (Node v _ _) = v

rank :: BinTree a -> Int
rank (Node _ r _) = r

children :: BinTree a -> [BinTree a]
children (Node _ _ cs) = cs`,
      tests: [
        { expr: "value t4", expected: "2" },
        { expr: "rank t7", expected: "3" },
        { expr: "children t2", expected: "[Node 5 0 []]" },
        { expr: "value t1", expected: "4" },
        { expr: "rank t1", expected: "0" },
        { expr: "children t1", expected: "[]" },
        { expr: "map rank (children t4)", expected: "[2,1,0]" },
        { expr: "value (Node 'x' 0 [])", expected: "'x'" },
      ],
    },
    {
      id: "combineTrees",
      name: "combineTrees",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define `combineTrees :: Ord a => BinTree a -> BinTree a -> BinTree a` which combines two ordered trees *of the same rank* r into one ordered tree of rank r + 1.",
        "",
        "- The tree with the smaller root value becomes the new root.",
        "- The other tree is added to the **front** of its list of children.",
        "- If the two roots are equal, act as if the **second** tree has the smaller root: the first tree becomes the first child of the second.",
        "",
        "```",
        "ghci> combineTrees t5 t6 == t7",
        "True",
        "ghci> combineTrees (Node 3 0 []) (Node 1 0 [])",
        "Node 1 1 [Node 3 0 []]",
        "```",
      ),
      hints: [
        "Compare the two root values with guards and build a new `Node`.",
        "Two cases: the first root is strictly smaller, or otherwise (which includes equal).",
        "The new node keeps the winner's value, has rank `rank winner + 1`, and children `loser : children winner`.",
        "`combineTrees t t' | value t < value t' = Node (value t) (rank t + 1) (t' : children t)` and `| otherwise = Node (value t') (rank t' + 1) (t : children t')`.",
      ],
      solution: hs`combineTrees :: Ord a => BinTree a -> BinTree a -> BinTree a
-- Pre: both trees have the same rank
combineTrees t t'
  | value t < value t' = Node (value t) (rank t + 1) (t' : children t)
  | otherwise          = Node (value t') (rank t' + 1) (t : children t')`,
      tests: [
        { expr: "combineTrees t5 t6", expected: "t7" },
        { expr: "combineTrees t6 t5", expected: "t7" },
        { expr: "combineTrees (Node 3 0 []) (Node 1 0 [])", expected: "Node 1 1 [Node 3 0 []]" },
        { expr: "combineTrees (Node 1 0 []) (Node 3 0 [])", expected: "Node 1 1 [Node 3 0 []]" },
        { expr: "combineTrees (Node 5 0 []) (Node 5 0 [])", expected: "Node 5 1 [Node 5 0 []]", label: "equal roots: second tree is the root" },
        {
          expr: "combineTrees (Node 7 1 [Node 9 0 []]) (Node 7 1 [Node 8 0 []])",
          expected: "Node 7 2 [Node 7 1 [Node 9 0 []], Node 8 0 []]",
          label: "equal roots: the first tree becomes the first child of the second",
        },
        { expr: "combineTrees t2 (Node 4 1 [Node 4 0 []])", expected: "Node 1 2 [Node 4 1 [Node 4 0 []], Node 5 0 []]" },
        { expr: "rank (combineTrees t3 t6)", expected: "3" },
      ],
    },
    {
      id: "extractMin",
      name: "extractMin",
      part: "Part II",
      marks: 2,
      prompt: md(
        "Define `extractMin :: Ord a => BinHeap a -> a` which returns the smallest value stored in a heap. The heap is guaranteed to be non-empty.",
        "",
        "Because every tree is ordered, the smallest value in each tree is at its root. So you only need to look at the roots.",
        "",
        "```",
        "ghci> extractMin h3",
        "1",
        "```",
      ),
      hints: [
        "Turn the heap into the list of its root values, then take the smallest.",
        "`map value` gives you the root values.",
        "The Prelude's `minimum` finds the smallest element of a non-empty list.",
        "`extractMin = minimum . map value`",
      ],
      solution: hs`extractMin :: Ord a => BinHeap a -> a
-- Pre: the heap is non-empty
extractMin = minimum . map value`,
      tests: [
        { expr: "extractMin h3", expected: "1" },
        { expr: "extractMin h5", expected: "4" },
        { expr: "extractMin h6", expected: "1" },
        { expr: "extractMin h7", expected: "4" },
        { expr: "extractMin [t1]", expected: "4" },
        { expr: "extractMin [Node 'q' 0 [], Node 'c' 1 [Node 'z' 0 []]]", expected: "'c'" },
      ],
    },
    {
      id: "mergeHeaps",
      name: "mergeHeaps",
      part: "Part II",
      marks: 6,
      prompt: md(
        "Define `mergeHeaps :: Ord a => BinHeap a -> BinHeap a -> BinHeap a` which merges two heaps into one, using these rules:",
        "",
        "- If either heap is empty, the result is the other heap.",
        "- Otherwise look at the first tree of each, `t` and `t'`:",
        "  - If `rank t` is smaller, `t` goes first and the rest is the merge of the tail of the first heap with the whole second heap.",
        "  - If `rank t'` is smaller, the same the other way round.",
        "  - If the ranks are equal, combine `t` and `t'` with `combineTrees t t'`, make a one-tree heap from it, and merge that with the merge of the two tails.",
        "",
        "```",
        "ghci> mergeHeaps h4 h5 == h6",
        "True",
        "```",
        "",
        "The result must still be a valid heap: ranks strictly increasing.",
      ),
      hints: [
        "Recursion on both lists at once, like merging two sorted lists. Two base cases and one recursive case with three guards.",
        "Use an as-pattern so you can refer to the whole heap and its parts: `mergeHeaps h@(t : ts) h'@(t' : ts')`.",
        "In the equal-rank case, don't write `combineTrees t t' : ...`. The combined tree has rank r + 1 and the tails may also contain a tree of rank r + 1, so it has to be merged in: `mergeHeaps [combineTrees t t'] (mergeHeaps ts ts')`.",
        md(
          "```",
          "mergeHeaps [] h = h",
          "mergeHeaps h [] = h",
          "mergeHeaps h@(t : ts) h'@(t' : ts')",
          "  | rank t < rank t' = t : mergeHeaps ts h'",
          "  | rank t' < rank t = t' : mergeHeaps h ts'",
          "  | otherwise        = mergeHeaps [combineTrees t t'] (mergeHeaps ts ts')",
          "```",
        ),
      ],
      solution: hs`mergeHeaps :: Ord a => BinHeap a -> BinHeap a -> BinHeap a
mergeHeaps [] h' = h'
mergeHeaps h []  = h
mergeHeaps h@(t : ts) h'@(t' : ts')
  | rank t < rank t' = t : mergeHeaps ts h'
  | rank t' < rank t = t' : mergeHeaps h ts'
  | otherwise        = mergeHeaps [combineTrees t t'] (mergeHeaps ts ts')`,
      tests: [
        { expr: "mergeHeaps h4 h5", expected: "h6" },
        { expr: "mergeHeaps [] h3", expected: "h3" },
        { expr: "mergeHeaps h3 []", expected: "h3" },
        { expr: "mergeHeaps [] ([] :: BinHeap Int)", expected: "[]" },
        { expr: "mergeHeaps [t1] [t2]", expected: "[t1, t2]" },
        { expr: "mergeHeaps [t2] [t1]", expected: "[t1, t2]" },
        { expr: "mergeHeaps [t5] [t6]", expected: "[t7]" },
        { expr: "mergeHeaps [Node 3 0 []] [Node 1 0 []]", expected: "[Node 1 1 [Node 3 0 []]]" },
        { expr: "map rank (mergeHeaps h3 h4)", expected: "[0,4]", label: "11 + 6 = 17 nodes = 10001 in binary: map rank (mergeHeaps h3 h4) == [0,4]" },
        { expr: "extractMin (mergeHeaps h5 h7)", expected: "4" },
      ],
    },
    {
      id: "insert",
      name: "insert",
      part: "Part II",
      marks: 1,
      prompt: md(
        "Define `insert :: Ord a => a -> BinHeap a -> BinHeap a` which inserts a value into a heap. Make a heap containing just one rank-0 tree holding the value, and merge it with the given heap.",
        "",
        "```",
        "ghci> insert 7 [Node 4 0 []]",
        "[Node 4 1 [Node 7 0 []]]",
        "ghci> insert 7 [t1]",
        "[Node 4 1 [Node 7 0 []]]",
        "```",
      ),
      hints: [
        "This is one call to `mergeHeaps`.",
        "A rank-0 tree holding `x` is `Node x 0 []`.",
        "A heap containing just that tree is the one-element list `[Node x 0 []]`.",
        "`insert x h = mergeHeaps [Node x 0 []] h`",
      ],
      solution: hs`insert :: Ord a => a -> BinHeap a -> BinHeap a
insert x h = mergeHeaps [Node x 0 []] h`,
      tests: [
        { expr: "insert 7 [Node 4 0 []]", expected: "[Node 4 1 [Node 7 0 []]]" },
        { expr: "insert 7 [t1]", expected: "[Node 4 1 [Node 7 0 []]]" },
        { expr: "insert 3 []", expected: "[Node 3 0 []]" },
        { expr: "insert 3 [t2]", expected: "[Node 3 0 [], t2]" },
        { expr: "insert 0 [t1]", expected: "[Node 0 1 [Node 4 0 []]]" },
        { expr: "insert 4 [t1]", expected: "[Node 4 1 [Node 4 0 []]]" },
        { expr: "map rank (foldr insert [] [1 .. 7 :: Int])", expected: "[0,1,2]" },
      ],
    },
    {
      id: "deleteMin",
      name: "deleteMin",
      part: "Part II",
      marks: 5,
      prompt: md(
        "Define `deleteMin :: Ord a => BinHeap a -> BinHeap a` which removes the smallest value from a (non-empty) heap:",
        "",
        "1. Find the tree whose root holds the minimum value. If several roots share the minimum, choose the leftmost one (the one with the lowest rank).",
        "2. Remove that tree from the heap.",
        "3. Its children are trees of rank r-1, ..., 1, 0. Reversed, they form a valid heap.",
        "4. Merge the remaining heap with the reversed children.",
        "",
        "```",
        "ghci> deleteMin h6 == h7",
        "True",
        "```",
      ),
      hints: [
        "Use `extractMin` to know which value you're looking for, then split the heap around the first tree with that root.",
        "`break p xs` splits a list just before the first element satisfying `p`: `break even [1,3,4,5] == ([1,3],[4,5])`. So `break ((== m) . value) h` gives `(before, t : after)` where `t` is the tree to remove.",
        "The children come highest-rank first, so `reverse` them before merging. The remaining heap is `before ++ after`.",
        md(
          "```",
          "deleteMin h = mergeHeaps (before ++ after) (reverse (children t))",
          "  where",
          "    (before, t : after) = break ((== extractMin h) . value) h",
          "```",
        ),
      ],
      solution: hs`deleteMin :: Ord a => BinHeap a -> BinHeap a
-- Pre: the heap is non-empty
deleteMin h = mergeHeaps (before ++ after) (reverse (children t))
  where
    -- t is the leftmost tree whose root holds the minimum value
    (before, t : after) = break ((== extractMin h) . value) h`,
      tests: [
        { expr: "deleteMin h6", expected: "h7" },
        { expr: "deleteMin [t1]", expected: "[]" },
        { expr: "deleteMin [t2]", expected: "[Node 5 0 []]" },
        { expr: "deleteMin h3", expected: "[Node 4 1 [Node 5 0 []], t4]" },
        {
          expr: "deleteMin [Node 1 0 [], Node 1 1 [Node 2 0 []]]",
          expected: "[Node 1 1 [Node 2 0 []]]",
          label: "ties: the leftmost minimum root is removed",
        },
        { expr: "extractMin (deleteMin h6)", expected: "4" },
        { expr: "extractMin (deleteMin (deleteMin h6))", expected: "4" },
        { expr: "deleteMin (insert 7 [t1])", expected: "[Node 7 0 []]" },
      ],
    },
    {
      id: "binSort",
      name: "binSort",
      part: "Part II",
      marks: 4,
      prompt: md(
        "Define `binSort :: Ord a => [a] -> [a]` which sorts a list into ascending order using a binomial heap:",
        "",
        "1. Insert the items one by one into an initially empty heap.",
        "2. Repeatedly take out the minimum (`extractMin`) and then remove it (`deleteMin`) until the heap is empty.",
        "",
        "```",
        "ghci> binSort \"BinomialHeap\"",
        "\"BHaaeiilmnop\"",
        "```",
        "",
        "(Capital letters come before lower-case ones in character order.)",
      ),
      hints: [
        "Two stages: build a heap with a fold, then turn the heap back into a list with a recursive helper.",
        "`foldr insert [] xs` inserts every element of `xs` into the empty heap.",
        "The helper's base case is the empty heap, which gives `[]`. Otherwise the answer starts with `extractMin h`, followed by the helper applied to `deleteMin h`.",
        md(
          "```",
          "binSort xs = toList (foldr insert [] xs)",
          "  where",
          "    toList [] = []",
          "    toList h  = extractMin h : toList (deleteMin h)",
          "```",
        ),
      ],
      solution: hs`binSort :: Ord a => [a] -> [a]
binSort = heapToList . foldr insert []
  where
    heapToList [] = []
    heapToList h  = extractMin h : heapToList (deleteMin h)`,
      tests: [
        { expr: 'binSort "BinomialHeap"', expected: '"BHaaeiilmnop"' },
        { expr: "binSort ([] :: [Int])", expected: "[]" },
        { expr: "binSort [5]", expected: "[5]" },
        { expr: "binSort [3,1,2]", expected: "[1,2,3]" },
        { expr: "binSort [4,4,1,4,1]", expected: "[1,1,4,4,4]" },
        { expr: "binSort [10,9 .. 1]", expected: "[1 .. 10]" },
        { expr: "binSort [1 .. 33]", expected: "[1 .. 33]" },
        { expr: "binSort [ mod (i * 37) 101 | i <- [1 .. 100 :: Int] ]", expected: "[1 .. 100]" },
      ],
    },
    {
      id: "toBinary",
      name: "toBinary",
      part: "Part III",
      marks: 1,
      prompt: md(
        "A heap holds at most one tree of each rank, and a rank-r tree has 2^r nodes. So the number of nodes in a heap can be written in binary: bit r is 1 if the heap contains a tree of rank r, and 0 if not.",
        "",
        "Define `toBinary :: BinHeap a -> [Int]` which gives that binary number as a list of bits, most significant bit first, with no leading zeros (so the first bit is the bit for the largest rank in the heap). Try to avoid `^`, `div` and `mod`.",
        "",
        "```",
        "ghci> toBinary h2",
        "[1,1,0,0]",
        "```",
        "",
        "`h2` has trees of rank 2 and 3, so it holds 4 + 8 = 12 nodes, which is 1100 in binary.",
        "",
        "(Part III is worth 3 marks for `toBinary` and `binarySum` together.)",
      ),
      hints: [
        "You don't need to count nodes at all: just ask, for each rank from the biggest down to 0, whether the heap has a tree of that rank.",
        "The biggest rank is the rank of the last tree, because heaps are in increasing rank order. Get all the ranks with `map rank h`.",
        "A list comprehension over `[maxRank, maxRank - 1 .. 0]` produces the bits in the right order. Treat the empty heap separately (it has no last tree).",
        md(
          "```",
          "toBinary [] = [0]",
          "toBinary h  = [if elem r ranks then 1 else 0 | r <- [rank (last h), rank (last h) - 1 .. 0]]",
          "  where ranks = map rank h",
          "```",
        ),
      ],
      solution: hs`toBinary :: BinHeap a -> [Int]
toBinary [] = [0]
toBinary h
  = [if elem r ranks then 1 else 0 | r <- [topRank, topRank - 1 .. 0]]
  where
    ranks   = map rank h
    topRank = rank (last h)`,
      tests: [
        { expr: "toBinary h2", expected: "[1,1,0,0]" },
        { expr: "toBinary h3", expected: "[1,0,1,1]" },
        { expr: "toBinary h4", expected: "[1,1,0]" },
        { expr: "toBinary h5", expected: "[1,1]" },
        { expr: "toBinary h6", expected: "[1,0,0,1]" },
        { expr: "toBinary h7", expected: "[1,0,0,0]" },
        { expr: "toBinary [t1]", expected: "[1]" },
        { expr: "toBinary (foldr insert [] [1 .. 13 :: Int])", expected: "[1,1,0,1]" },
      ],
    },
    {
      id: "binarySum",
      name: "binarySum",
      part: "Part III",
      marks: 2,
      prompt: md(
        "Define `binarySum :: [Int] -> [Int] -> [Int]` which adds two binary numbers (lists of bits, most significant first) *directly*, using ripple-carry addition: go from the rightmost (least significant) bit to the left, and at each position add the two bits and the carry from the position to the right, using a *full adder*:",
        "",
        "```",
        "b1 b2 carry-in | sum carry-out",
        " 0  0    0     |  0     0",
        " 1  0    0     |  1     0",
        " 0  1    0     |  1     0",
        " 1  1    0     |  0     1",
        " 0  0    1     |  1     0",
        " 1  0    1     |  0     1",
        " 0  1    1     |  0     1",
        " 1  1    1     |  1     1",
        "```",
        "",
        "In other words: add up the three bits; the sum bit is 1 when that total is odd, and the carry-out is 1 when the total is 2 or more. The two numbers may have different lengths. A carry left over at the end becomes a new leading 1.",
        "",
        "```",
        "ghci> binarySum (toBinary h4) (toBinary h5)",
        "[1,0,0,1]",
        "```",
        "",
        "That's 6 + 3 = 9. In general `toBinary (mergeHeaps h h') == binarySum (toBinary h) (toBinary h')`. (Bonus challenge from the spec: can you do it without `reverse`?)",
      ),
      hints: [
        "Reverse both lists so the least significant bit is first, add them with a recursive helper that carries the carry bit as an extra argument, then reverse the answer.",
        "Helper `add c xs ys`. When both lists run out: if the carry is 1 the result is `[1]`, otherwise `[]`. When only one list runs out, pretend it continues with 0s.",
        "With total `s = x + y + c`, the sum bit is `if odd s then 1 else 0` and the new carry is `if s >= 2 then 1 else 0`.",
        md(
          "```",
          "binarySum xs ys = reverse (add 0 (reverse xs) (reverse ys))",
          "  where",
          "    add 0 [] [] = []",
          "    add c [] [] = [c]",
          "    add c [] bs = add c [0] bs",
          "    add c as [] = add c as [0]",
          "    add c (a : as) (b : bs) = bit : add carry as bs",
          "      where s = a + b + c",
          "            bit = if odd s then 1 else 0",
          "            carry = if s >= 2 then 1 else 0",
          "```",
        ),
      ],
      solution: hs`binarySum :: [Int] -> [Int] -> [Int]
binarySum xs ys = reverse (rippleAdd 0 (reverse xs) (reverse ys))
  where
    -- Bits are least significant first here; c is the carry in
    rippleAdd 0 [] [] = []
    rippleAdd c [] [] = [c]
    rippleAdd c [] bs = rippleAdd c [0] bs
    rippleAdd c as [] = rippleAdd c as [0]
    rippleAdd c (a : as) (b : bs) = sumBit : rippleAdd carryOut as bs
      where
        total    = a + b + c
        sumBit   = if odd total then 1 else 0
        carryOut = if total >= 2 then 1 else 0`,
      tests: [
        { expr: "binarySum (toBinary h4) (toBinary h5)", expected: "[1,0,0,1]" },
        { expr: "binarySum [1] [1]", expected: "[1,0]" },
        { expr: "binarySum [1,0] [1]", expected: "[1,1]" },
        { expr: "binarySum [1,1,1] [1]", expected: "[1,0,0,0]" },
        { expr: "binarySum [1] [1,1,1]", expected: "[1,0,0,0]" },
        { expr: "binarySum [1,0,1,1] [1,1,0,0]", expected: "[1,0,1,1,1]" },
        { expr: "binarySum [1,1,1,1] [1,1,1,1]", expected: "[1,1,1,1,0]" },
        { expr: "toBinary (mergeHeaps h3 h6) == binarySum (toBinary h3) (toBinary h6)" },
        { expr: "toBinary (mergeHeaps h1 h4) == binarySum (toBinary h1) (toBinary h4)" },
      ],
    },
  ],
};
