import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "y2020",
  year: 2020,
  title: "Hash Array Mapped Tries",
  summary: "Use bit manipulation from Data.Bits to build and search a hash array mapped trie, the compact tree-shaped set used inside Scala, Clojure and Haskell libraries.",
  skills: [
    "Data.Bits: .&., shiftR, bit, testBit, setBit",
    "div and mod on binary numbers",
    "list indexing and updating by position",
    "recursion over a tree with a level counter",
    "higher-order functions as parameters",
    "foldr to build a structure",
  ],
  story: md(
    "This paper is about storing a **set** of integers (a collection with no duplicates and no particular order) so that adding a number and asking \"is this number in the set?\" are both fast, even for huge sets. The structure is a **hash array mapped trie** (HAMT). Before that, you need a little binary.",
    "",
    "### Bits and Data.Bits (the pre-reading, in short)",
    "",
    "Every `Int` is stored as 64 **bits** (binary digits). Bits are numbered from the right, starting at 0. For example 29855 written with 16 bits is `0111010010011111`: bit 0 is 1, bit 5 is 0, and bit 14 (the leftmost 1) is 1. The given `showBitVector n k` shows the rightmost `k` bits of `n`:",
    "",
    "```",
    "ghci> showBitVector 29855 16",
    "\"0111010010011111\"",
    "```",
    "",
    "Because each bit is a yes/no, one `Int` can act as a list of 64 flags: a **bit vector**. The module `Data.Bits` has fast functions for this:",
    "",
    "```",
    "9 .&. 5   = 1     1001 and 0101 = 0001  (1 only where both have a 1)",
    "9 .|. 5   = 13    1001 or  0101 = 1101  (1 where either has a 1)",
    "shiftL 2000 2 = 8000   move every bit 2 places left (times 4)",
    "shiftR 2000 3 = 250    move every bit 3 places right (divide by 8)",
    "bit 5     = 32    a single 1 at index 5: 00100000",
    "setBit 39855 14  = 56239   turn bit 14 on",
    "clearBit 39855 0 = 39854   turn bit 0 off",
    "testBit 1771 3   = True    is bit 3 a 1?  (1771 = 011011101011)",
    "testBit 1771 8   = False",
    "```",
    "",
    "**Masking.** `bit n - 1` is n ones on the right: `bit 6 - 1` is `0000000000111111`. Anding with it keeps just the rightmost n bits and zeroes the rest. To pick out bits 5 to 10 of a number, shift right by 5 first, then mask 6 bits:",
    "",
    "```",
    "44628                     = 1010111001010100",
    "shiftR 44628 5           = 0000010101110010",
    "shiftR 44628 5 .&. (bit 6 - 1) = 0000000000110010 = 50",
    "```",
    "",
    "### Tries",
    "",
    "A **trie** (pronounced \"tree\") stores values at the end of a path chosen by the value's own bits. Here each node has up to 16 children, numbered 0 to 15. Take the rightmost 4 bits of the number: they say which child of the root to go to. If that child is another node, the *next* 4 bits say which of *its* children to go to, and so on. With a maximum depth of 3 levels (0, 1, 2):",
    "",
    "```",
    "  73 = 0000 0100 1001     root child 9, then child 4",
    " 206 = 0000 1100 1110     root child 14",
    " 729 = 0010 1101 1001     root child 9, then child 13",
    "2521 = 1001 1101 1001     root child 9, then child 13  (clash with 729!)",
    "```",
    "",
    "73, 729 and 2521 all end in `1001`, so they share root child 9, which must be a node. There, 73 goes to child 4, but 729 and 2521 both have `1101` next. We're out of levels, so they are stored together in a **leaf** at the bottom level: `[729, 2521]`. Values that clash like this are rare if the bits are spread out well.",
    "",
    "**Saving space with a bit vector.** Most of the 16 children are usually empty. So a node stores only the non-empty ones, in a list (the **subnode array**), plus a 16-bit bit vector whose bit i is 1 when child i exists. To find child i: check that bit i is set, then count the 1s *to the right of* bit i; that count is the position in the list. Example: the root of the trie above has bit vector `0100001001000000` (bits 6, 9 and 14 set, since 1830 is in child 6). For 206 we look at bit 14: it's 1, and there are two 1s to its right, so child 14 is at position 2 of the list.",
    "",
    "**Hashing.** If many numbers share their low bits (e.g. all multiples of 256 end in eight 0s), they all pile into one leaf. The fix is to index the trie with a **hash** of each number instead of the number itself: a function that scrambles the bits so that similar numbers get very different hash values. You don't need to understand how `hash` works. (The template's hash in this app is not the same as the one in the original exam, so hashed examples give different tries from the printed spec. The tests use this app's `hash`.)",
    "",
    "### The given types",
    "",
    "```",
    "type BitVector = Int",
    "data Trie = Leaf [Int] | Node BitVector [SubNode]",
    "data SubNode = Term Int | SubTrie Trie",
    "type Hash = Int",
    "type HashFun = Int -> Hash",
    "```",
    "",
    "- `Node bv subs` is a node: `bv` says which children exist, `subs` lists them in index order (lowest index first).",
    "- A `SubNode` is either `Term v`, a single value stored right there in the node, or `SubTrie t`, a whole trie one level down.",
    "- `Leaf vs` holds two or more clashing values, and only appears at the bottom level.",
    "- `empty = Node 0 []` is the empty trie (every trie has a node at its root).",
    "- A `HashFun` is a function from values to hashes: `hash`, or `id` to index by the raw value.",
    "",
    "Given to you: `bitTable` (how many 1 bits each number 0 to 15 has), `showBitVector`, `showT` (prints a trie: bit vectors as 16 bits, terminals as `<v>`, leaves as lists, deeper levels indented), `trieSize`, `binCount` and `meanBinSize` (which use your `sumTrie`), `hash`, the tries `figure` and `figureHashed`, and a test helper `sortLeaves` that sorts the values inside every leaf.",
  ),
  notes: md(
    "**Where the marks are.** Part I is 13 marks (including a 1-mark bonus for the batched `countOnes`; the total is capped at 30). Part II is 10 marks and Part III is 8, of which `insert` is 7.",
    "",
    "**Order of attack.** Do Part I in order: the bit utilities are used by everything later, and `replace` and `insertAt` are plain list recursion you can write in two minutes each. Then `sumTrie` (easy 4 marks) and `member`. Part III last: `insert` is the hard one, but `buildTrie` is a one-line fold worth a mark even if `insert` is shaky.",
    "",
    "**Traps.**",
    "",
    "- Don't write `countOnes = popCount`: it scores nothing. The bonus needs the `bitTable` version (4 bits at a time).",
    "- `countOnesFrom i n` counts the 1s strictly to the *right* of bit i, so mask with `bit i - 1`, not `bit (i + 1) - 1`.",
    "- In `getIndex n i b`, block i starts at bit `i * b`.",
    "- `member` and `insert` must use the *hash* to choose children, but compare the *value* when they reach a `Term` or `Leaf`.",
    "- Carry the level down as you recurse: it decides which block of the hash to use.",
    "- `insert` must not add a value that's already there (in a `Term` or a `Leaf`).",
    "- When a new value clashes with a `Term`, *both* values go into a fresh trie one level down. That's where the hash function argument is needed: to rehash the old value.",
    "- `Data.List` also exports a function called `insert`. If you import `Data.List`, hide it: `import Data.List hiding (insert)`.",
    "",
    "**Short of time?** Write `buildTrie` (one line, 1 mark) even if `insert` isn't finished, and make sure Parts I and II are solid.",
  ),
  setup: hs`import Data.Bits

type BitVector = Int

data Trie = Leaf [Int] | Node BitVector [SubNode]
          deriving (Eq, Show)

data SubNode = Term Int | SubTrie Trie
             deriving (Eq, Show)

type Hash = Int

type HashFun = Int -> Hash

empty :: Trie
empty
  = Node 0 []

bitTable :: [Int]
bitTable
  = [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4]

--------------------------------------------------------------
-- Hashing (you don't need to understand how this works)

hash :: HashFun
hash x
  = mix3 .&. maxBound
  where
    mix1 = xor x (shiftR x 30) * (-4658895280553007687)
    mix2 = xor mix1 (shiftR mix1 27) * (-7723592293110705685)
    mix3 = xor mix2 (shiftR mix2 31)

--------------------------------------------------------------
-- Displaying tries

showBitVector :: Int -> Int -> String
showBitVector _ 0
  = ""
showBitVector bv n
  = showBitVector (div bv 2) (n - 1) ++ show (mod bv 2)

showT :: Trie -> IO ()
showT t
  = putStr (unlines (trieLines 0 t))

trieLines :: Int -> Trie -> [String]
trieLines indent (Leaf vs)
  = [replicate indent ' ' ++ show vs]
trieLines indent (Node bv subs)
  = (replicate indent ' ' ++ showBitVector bv 16) : concatMap subLines subs
  where
    subLines (Term v) = [replicate (indent + 2) ' ' ++ "<" ++ show v ++ ">"]
    subLines (SubTrie t) = trieLines (indent + 2) t

--------------------------------------------------------------
-- These use your sumTrie

trieSize :: Trie -> Int
trieSize t
  = sumTrie (const 1) length t

binCount :: Trie -> Int
binCount t
  = sumTrie (const 1) (const 1) t

meanBinSize :: Trie -> Double
meanBinSize t
  = fromIntegral (trieSize t) / fromIntegral (binCount t)

--------------------------------------------------------------
-- Test data

-- Figure 2 (left): indexed by the raw values
figure :: Trie
figure
  = Node 16960 [Term 1830,
                SubTrie (Node 8208 [Term 73,
                                    SubTrie (Leaf [729, 2521])]),
                Term 206]

-- Figure 2 (right), rebuilt with this template's hash function:
-- buildTrie hash 3 4 [73, 206, 729, 1830, 2521]
figureHashed :: Trie
figureHashed
  = Node 41225 [Term 73,
                Term 206,
                Term 729,
                Term 1830,
                Term 2521]

-- Test helper (not part of the original template): sorts the values in
-- every leaf, so tries can be compared when leaf order doesn't matter
sortLeaves :: Trie -> Trie
sortLeaves (Leaf vs)
  = Leaf (sortInts vs)
  where
    sortInts [] = []
    sortInts (x : xs)
      = sortInts [y | y <- xs, y < x] ++ [x] ++ sortInts [y | y <- xs, y >= x]
sortLeaves (Node bv subs)
  = Node bv (map sortSub subs)
  where
    sortSub (SubTrie t) = SubTrie (sortLeaves t)
    sortSub term = term
`,
  starter: hs`--------------------------------------------------------------
-- Part I

countOnes :: Int -> Int
countOnes = undefined

countOnesFrom :: Int -> Int -> Int
countOnesFrom = undefined

getIndex :: Int -> Int -> Int -> Int
getIndex = undefined

replace :: Int -> [a] -> a -> [a]
replace = undefined

insertAt :: Int -> a -> [a] -> [a]
insertAt = undefined

--------------------------------------------------------------
-- Part II

sumTrie :: (Int -> Int) -> ([Int] -> Int) -> Trie -> Int
sumTrie = undefined

member :: Int -> Hash -> Trie -> Int -> Bool
member = undefined

--------------------------------------------------------------
-- Part III

insert :: HashFun -> Int -> Int -> Int -> Trie -> Trie
insert = undefined

buildTrie :: HashFun -> Int -> Int -> [Int] -> Trie
buildTrie = undefined
`,
  tasks: [
    {
      id: "countOnes",
      name: "countOnes",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define `countOnes :: Int -> Int` which counts the 1 bits in the binary form of a (non-negative) integer.",
        "",
        "- For 2 marks, process one bit at a time with `div` and `mod`.",
        "- For the **bonus mark** (3 in total), process four bits at a time using the given table, where element i is the number of 1 bits in i (for 0 to 15):",
        "",
        "```",
        "bitTable = [0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4]",
        "```",
        "",
        "Do **not** write `countOnes = popCount` (or similar).",
        "",
        "```",
        "ghci> countOnes 0",
        "0",
        "ghci> countOnes 65219",
        "11",
        "```",
      ),
      hints: [
        "Recursion that chops bits off the right-hand end of the number until it reaches 0.",
        "One bit at a time: `mod n 2` is the rightmost bit and `div n 2` is the rest. Four at a time: `n .&. 15` is the rightmost 4 bits (a number 0 to 15) and `shiftR n 4` is the rest.",
        "Look up the count for the rightmost 4 bits with `bitTable !! (n .&. 15)`. The base case is `countOnes 0 = 0`.",
        "`countOnes 0 = 0` and `countOnes n = bitTable !! (n .&. 15) + countOnes (shiftR n 4)`.",
      ],
      solution: hs`countOnes :: Int -> Int
countOnes 0 = 0
countOnes n = bitTable !! (n .&. 15) + countOnes (shiftR n 4)`,
      tests: [
        { expr: "countOnes 0", expected: "0" },
        { expr: "countOnes 65219", expected: "11" },
        { expr: "countOnes 1", expected: "1" },
        { expr: "countOnes 15", expected: "4" },
        { expr: "countOnes 16", expected: "1" },
        { expr: "countOnes 16960", expected: "3" },
        { expr: "countOnes (bit 40 + bit 3)", expected: "2" },
        { expr: "map countOnes [0 .. 300]", expected: "map popCount [0 .. 300 :: Int]" },
      ],
    },
    {
      id: "countOnesFrom",
      name: "countOnesFrom",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Using `countOnes` (or `popCount`), define `countOnesFrom :: Int -> Int -> Int` such that `countOnesFrom i n` is the number of 1 bits in `n` strictly to the right of bit `i` (not including bit `i`). Bits are numbered from 0 at the right.",
        "",
        "```",
        "ghci> countOnesFrom 0 88",
        "0",
        "ghci> countOnesFrom 3 15",
        "3",
        "```",
        "",
        "Hint from the spec: use `.&.` and `bit` to mask the least significant `i` bits of `n`.",
      ),
      hints: [
        "Throw away bit i and everything to its left, then count what's left.",
        "`bit i - 1` is a mask with 1s in positions 0 to i - 1 only.",
        "`n .&. (bit i - 1)` keeps exactly the bits to the right of bit i.",
        "`countOnesFrom i n = countOnes (n .&. (bit i - 1))`.",
      ],
      solution: hs`countOnesFrom :: Int -> Int -> Int
countOnesFrom i n = countOnes (n .&. (bit i - 1))`,
      tests: [
        { expr: "countOnesFrom 0 88", expected: "0" },
        { expr: "countOnesFrom 3 15", expected: "3" },
        { expr: "countOnesFrom 14 16960", expected: "2", label: "206's position in figure's root: 2" },
        { expr: "countOnesFrom 9 16960", expected: "1" },
        { expr: "countOnesFrom 6 16960", expected: "0" },
        { expr: "countOnesFrom 4 15", expected: "4" },
        { expr: "countOnesFrom 13 8208", expected: "1" },
      ],
    },
    {
      id: "getIndex",
      name: "getIndex",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define `getIndex :: Int -> Int -> Int -> Int`. `getIndex n i b` splits `n` into blocks of `b` bits, numbered from 0 at the right, and returns block number `i` as an integer.",
        "",
        "For example 53767 is `1101 0010 0000 0111` in binary: four blocks of 4 bits. Block 0 is `0111` = 7 and block 3 is `1101` = 13. With 8-bit blocks, block 1 is `11010010` = 210.",
        "",
        "```",
        "ghci> showBitVector 53767 16",
        "\"1101001000000111\"",
        "ghci> getIndex 53767 0 4",
        "7",
        "ghci> getIndex 53767 3 4",
        "13",
        "ghci> getIndex 53767 1 8",
        "210",
        "```",
      ),
      hints: [
        "This is the masking trick from the pre-reading: shift the block you want down to the right-hand end, then mask it.",
        "Block i starts at bit `i * b`, so shift right by `i * b`.",
        "A mask for `b` bits is `bit b - 1`.",
        "`getIndex n i b = shiftR n (i * b) .&. (bit b - 1)`.",
      ],
      solution: hs`getIndex :: Int -> Int -> Int -> Int
getIndex n i b = shiftR n (i * b) .&. (bit b - 1)`,
      tests: [
        { expr: "getIndex 53767 0 4", expected: "7" },
        { expr: "getIndex 53767 3 4", expected: "13" },
        { expr: "getIndex 53767 1 8", expected: "210" },
        { expr: "getIndex 53767 1 4", expected: "0" },
        { expr: "getIndex 2521 0 4", expected: "9" },
        { expr: "getIndex 2521 1 4", expected: "13" },
        { expr: "getIndex 44628 0 6", expected: "20" },
        { expr: "getIndex 53767 5 4", expected: "0" },
      ],
    },
    {
      id: "replace",
      name: "replace",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define `replace :: Int -> [a] -> a -> [a]` which replaces the item at position n (counting from 0) of a list with a given value. The index is always less than the length of the list.",
        "",
        "```",
        "ghci> replace 0 \"trie\" 'b'",
        "\"brie\"",
        "ghci> replace 3 \"trie\" 'p'",
        "\"trip\"",
        "```",
      ),
      hints: [
        "Recursion on the index and the list together, counting the index down.",
        "Base case: index 0 means replace the head: `replace 0 (_ : xs) y = y : xs`.",
        "Otherwise keep the head and replace at position `n - 1` in the tail.",
        "`replace n (x : xs) y = x : replace (n - 1) xs y`. (Or without recursion: `take n xs ++ [y] ++ drop (n + 1) xs`.)",
      ],
      solution: hs`replace :: Int -> [a] -> a -> [a]
replace 0 (_ : xs) y = y : xs
replace n (x : xs) y = x : replace (n - 1) xs y`,
      tests: [
        { expr: "replace 0 \"trie\" 'b'", expected: '"brie"' },
        { expr: "replace 3 \"trie\" 'p'", expected: '"trip"' },
        { expr: "replace 1 \"trie\" 'h'", expected: '"thie"' },
        { expr: "replace 0 [5] 7", expected: "[7]" },
        { expr: "replace 2 [1,2,3,4,5] 0", expected: "[1,2,0,4,5]" },
        { expr: "replace 1 [Term 1, Term 2] (Term 9)", expected: "[Term 1, Term 9]" },
      ],
    },
    {
      id: "insertAt",
      name: "insertAt",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define `insertAt :: Int -> a -> [a] -> [a]` which inserts an item at a given position (counting from 0) in a list, moving later items along. The index is at most the length of the list (inserting at the length puts the item at the end).",
        "",
        "```",
        "ghci> insertAt 3 'p' \"trie\"",
        "\"tripe\"",
        "ghci> insertAt 4 's' \"trie\"",
        "\"tries\"",
        "```",
      ),
      hints: [
        "The same shape of recursion as `replace`.",
        "Base case: at index 0, put the new item on the front of the whole list (this also handles the empty list).",
        "Otherwise keep the head and insert at position `n - 1` in the tail.",
        "`insertAt 0 y xs = y : xs` and `insertAt n y (x : xs) = x : insertAt (n - 1) y xs`. (Or `take n xs ++ [y] ++ drop n xs`.)",
      ],
      solution: hs`insertAt :: Int -> a -> [a] -> [a]
insertAt 0 y xs = y : xs
insertAt n y (x : xs) = x : insertAt (n - 1) y xs`,
      tests: [
        { expr: "insertAt 3 'p' \"trie\"", expected: '"tripe"' },
        { expr: "insertAt 4 's' \"trie\"", expected: '"tries"' },
        { expr: "insertAt 0 's' \"trie\"", expected: '"strie"' },
        { expr: "insertAt 0 1 []", expected: "[1]" },
        { expr: "insertAt 2 9 [1,2,3]", expected: "[1,2,9,3]" },
        { expr: "insertAt 1 (Term 5) [Term 1, Term 9]", expected: "[Term 1, Term 5, Term 9]" },
      ],
    },
    {
      id: "sumTrie",
      name: "sumTrie",
      part: "Part II",
      marks: 4,
      prompt: md(
        "Define `sumTrie :: (Int -> Int) -> ([Int] -> Int) -> Trie -> Int` which \"sums\" the parts of a trie, where the two function arguments say what each part is worth:",
        "",
        "- a terminal `Term v` is worth `f v` (the first function);",
        "- a `Leaf vs` is worth `g vs` (the second function);",
        "- a `Node` is worth the sum of all its subnodes;",
        "- a `SubTrie t` is worth `sumTrie f g t`.",
        "",
        "For example `sumTrie (const 1) length` counts the values in a trie (`trieSize`), and `sumTrie (const 1) (const 1)` counts the \"bins\" (terminals plus leaves, `binCount`). Once this works, the given `trieSize`, `binCount` and `meanBinSize` work too.",
        "",
        "```",
        "ghci> sumTrie (const 1) length empty",
        "0",
        "ghci> trieSize empty",
        "0",
        "ghci> sumTrie (const 1) (const 1) figure",
        "4",
        "ghci> binCount figure",
        "4",
        "ghci> meanBinSize figure",
        "1.25",
        "ghci> meanBinSize figureHashed",
        "1.0",
        "```",
      ),
      hints: [
        "Recursion on the trie, with a helper for subnodes. The two functions are passed along unchanged.",
        "`sumTrie f g (Leaf vs) = g vs`. For `Node _ subs`, add up the worth of each subnode with `sum (map ...)`.",
        "The subnode helper has two cases: `Term v` gives `f v`, and `SubTrie t` gives `sumTrie f g t`.",
        md(
          "```",
          "sumTrie _ g (Leaf vs) = g vs",
          "sumTrie f g (Node _ subs) = sum (map sumSub subs)",
          "  where",
          "    sumSub (Term v) = f v",
          "    sumSub (SubTrie t) = sumTrie f g t",
          "```",
        ),
      ],
      solution: hs`sumTrie :: (Int -> Int) -> ([Int] -> Int) -> Trie -> Int
sumTrie _ g (Leaf vs) = g vs
sumTrie f g (Node _ subs) = sum (map sumSub subs)
  where
    sumSub (Term v) = f v
    sumSub (SubTrie t) = sumTrie f g t`,
      tests: [
        { expr: "sumTrie (const 1) length empty", expected: "0" },
        { expr: "trieSize empty", expected: "0" },
        { expr: "sumTrie (const 1) (const 1) figure", expected: "4" },
        { expr: "binCount figure", expected: "4" },
        { expr: "meanBinSize figure", expected: "1.25" },
        { expr: "meanBinSize figureHashed", expected: "1.0" },
        { expr: "trieSize figure", expected: "5" },
        { expr: "sumTrie id sum figure", expected: "5359", label: "sum of the values in figure: 73 + 206 + 729 + 1830 + 2521" },
        { expr: "sumTrie (const 0) length figure", expected: "2", label: "number of values stored in leaves" },
        { expr: "sumTrie id sum (Leaf [1, 2, 3])", expected: "6" },
      ],
    },
    {
      id: "member",
      name: "member",
      part: "Part II",
      marks: 6,
      prompt: md(
        "Using `getIndex` and `countOnesFrom`, define `member :: Int -> Hash -> Trie -> Int -> Bool`. `member v h t b` says whether value `v` is in trie `t`, where `h` is the hash of `v` (used to find the way down) and `b` is the block size (number of bits used per level).",
        "",
        "Start at level 0. At a `Node bv subs` at level `l`, let `i = getIndex h l b`:",
        "",
        "- if bit `i` of `bv` is 0, `v` is not there;",
        "- otherwise look at subnode number `countOnesFrom i bv` in `subs`: a `Term v'` means the answer is `v == v'`; a `SubTrie` means carry on searching it at level `l + 1`.",
        "",
        "At a `Leaf vs`, the answer is whether `v` is in `vs`.",
        "",
        "`figure` is indexed by the raw values (so pass the value itself as the hash); `figureHashed` is indexed by `hash`:",
        "",
        "```",
        "ghci> member 12 12 figure 4",
        "False",
        "ghci> member 73 73 figure 4",
        "True",
        "ghci> member 206 (hash 206) figureHashed 4",
        "True",
        "```",
        "",
        "(In this app `hash 73` is `5800268766420346160`; the original exam's hash gave different numbers.)",
      ),
      hints: [
        "Use a local helper that carries the current level (starting at 0) as it walks down the trie. `v`, `h` and `b` never change, so leave them as outer parameters.",
        "Helper cases: `Leaf vs` gives `elem v vs`. For `Node bv subs`, compute `i = getIndex h level b` in a `where`, and use `testBit bv i` to check whether the child exists.",
        "The child is `subs !! countOnesFrom i bv`. Use `case ... of` on it: `Term v'` gives `v == v'`, `SubTrie t'` recurses at `level + 1`.",
        md(
          "```",
          "member v h t b = search 0 t",
          "  where",
          "    search _ (Leaf vs) = elem v vs",
          "    search level (Node bv subs)",
          "      | not (testBit bv i) = False",
          "      | otherwise = case subs !! countOnesFrom i bv of",
          "                      Term v' -> v == v'",
          "                      SubTrie t' -> search (level + 1) t'",
          "      where i = getIndex h level b",
          "```",
        ),
      ],
      solution: hs`member :: Int -> Hash -> Trie -> Int -> Bool
member v h t b = search 0 t
  where
    search _ (Leaf vs) = elem v vs
    search level (Node bv subs)
      | not (testBit bv i) = False
      | otherwise = case subs !! countOnesFrom i bv of
                      Term v' -> v == v'
                      SubTrie t' -> search (level + 1) t'
      where
        i = getIndex h level b`,
      tests: [
        { expr: "member 12 12 figure 4", expected: "False" },
        { expr: "member 73 73 figure 4", expected: "True" },
        { expr: "member 206 (hash 206) figureHashed 4", expected: "True" },
        { expr: "map (\\v -> member v v figure 4) [73, 206, 729, 1830, 2521]", expected: "replicate 5 True" },
        { expr: "member 134 134 figure 4", expected: "False", label: "same last 4 bits as 1830, but a different value" },
        { expr: "member 1922 1922 figure 4", expected: "False", label: "root child 2 is empty" },
        { expr: "member 31 31 figure 4", expected: "False" },
        { expr: "member 2521 (hash 2521) figure 4", expected: "False", label: "figure is indexed by raw values, not hashes" },
        { expr: "member 5 5 empty 4", expected: "False" },
        {
          expr: "map (\\v -> member v v (Node 2 [SubTrie (Leaf [17, 1])]) 4) [17, 1, 33]",
          expected: "[True, True, False]",
          label: "searching a leaf: 33 reaches the leaf [17, 1] but isn't in it",
        },
      ],
    },
    {
      id: "insert",
      name: "insert",
      part: "Part III",
      marks: 7,
      prompt: md(
        "Define `insert :: HashFun -> Int -> Int -> Int -> Trie -> Trie`. `insert hf d b v t` inserts value `v` into trie `t`, where `hf` is the hash function, `d` is the maximum depth (number of levels) and `b` is the block size. The suggested scheme, keeping track of the current level (starting at 0):",
        "",
        "- At a `Leaf`: add `v` to its values, unless it's already there.",
        "- At the lowest level (level `d - 1`), when not at a leaf: return `Leaf [v]`.",
        "- At a `Node bv subs`: let `i` be block `level` of `hf v`, and `n = countOnesFrom i bv`.",
        "  - If bit `i` is 0: set it, and use `insertAt` to put `Term v` at position `n` of `subs`.",
        "  - If bit `i` is 1: use `replace` to update subnode `n`. A `SubTrie` gets `v` inserted into it (one level down). A `Term v'` stays as it is if `v' == v`; otherwise it becomes a `SubTrie` made by inserting `v'` into `empty` one level down, then inserting `v` into the result. (This is why you need `hf`: to rehash `v'`. At the lowest level this makes a leaf with two values.)",
        "",
        "Using `id` as the hash function indexes by the raw values:",
        "",
        "```",
        "ghci> let t1 = insert id 3 4 2521 empty",
        "ghci> showT t1",
        "0000001000000000",
        "  <2521>",
        "ghci> let t2 = insert id 3 4 1830 t1",
        "ghci> showT t2",
        "0000001001000000",
        "  <1830>",
        "  <2521>",
        "ghci> let t3 = insert id 3 4 729 t2",
        "ghci> showT t3",
        "0000001001000000",
        "  <1830>",
        "  0010000000000000",
        "    [729,2521]          <--- any order will do here",
        "ghci> let t4 = insert hash 3 4 729 empty",
        "ghci> let t5 = insert hash 3 4 2521 t4",
        "ghci> let t6 = insert hash 3 4 206 t5",
        "ghci> showT t6",
        "1000000100001000",
        "  <206>",
        "  <729>",
        "  <2521>",
        "```",
        "",
        "(The last example uses this app's `hash`, so it differs from the printed spec.) The order of the values inside a `Leaf` doesn't matter.",
      ),
      hints: [
        "A local helper `ins value level trie` does the work, starting at level 0. `hf`, `d` and `b` stay fixed, so leave them as outer parameters.",
        "Order the helper's equations: `Leaf` first; then a guard `level == d - 1` giving `Leaf [x]` (Haskell moves on to the next equation if a guard fails); then the `Node` case. Compute `i = getIndex (hf x) level b` and `n = countOnesFrom i bv` in a `where`.",
        "For the clash case, `ins x (level + 1) (ins y (level + 1) empty)` inserts the old value `y` into an empty trie, then the new value `x`. The recursive `ins` hashes each value with `hf` itself, so nothing special is needed for the rehash.",
        md(
          "```",
          "insert hf d b v t = ins v 0 t",
          "  where",
          "    ins x _ (Leaf xs) | elem x xs = Leaf xs",
          "                      | otherwise = Leaf (x : xs)",
          "    ins x level _ | level == d - 1 = Leaf [x]",
          "    ins x level (Node bv subs)",
          "      | not (testBit bv i) = Node (setBit bv i) (insertAt n (Term x) subs)",
          "      | otherwise = Node bv (replace n subs (insSub (subs !! n)))",
          "      where",
          "        i = getIndex (hf x) level b",
          "        n = countOnesFrom i bv",
          "        insSub (SubTrie t') = SubTrie (ins x (level + 1) t')",
          "        insSub (Term y) | y == x = Term y",
          "                        | otherwise = SubTrie (ins x (level + 1) (ins y (level + 1) empty))",
          "```",
        ),
      ],
      solution: hs`insert :: HashFun -> Int -> Int -> Int -> Trie -> Trie
insert hf maxDepth b v t = ins v 0 t
  where
    ins x _ (Leaf xs)
      | elem x xs = Leaf xs
      | otherwise = Leaf (x : xs)
    ins x level _
      | level == maxDepth - 1 = Leaf [x]
    ins x level (Node bv subs)
      | not (testBit bv i) = Node (setBit bv i) (insertAt n (Term x) subs)
      | otherwise          = Node bv (replace n subs (insSub (subs !! n)))
      where
        i = getIndex (hf x) level b
        n = countOnesFrom i bv
        insSub (SubTrie t') = SubTrie (ins x (level + 1) t')
        insSub (Term y)
          | y == x    = Term y
          | otherwise = SubTrie (ins x (level + 1) (ins y (level + 1) empty))`,
      tests: [
        { expr: "insert id 3 4 2521 empty", expected: "Node 512 [Term 2521]" },
        { expr: "insert id 3 4 1830 (insert id 3 4 2521 empty)", expected: "Node 576 [Term 1830, Term 2521]" },
        {
          expr: "sortLeaves (insert id 3 4 729 (insert id 3 4 1830 (insert id 3 4 2521 empty)))",
          expected: "Node 576 [Term 1830, SubTrie (Node 8192 [SubTrie (Leaf [729, 2521])])]",
        },
        {
          expr: "insert hash 3 4 206 (insert hash 3 4 2521 (insert hash 3 4 729 empty))",
          expected: "Node 33032 [Term 206, Term 729, Term 2521]",
        },
        { expr: "insert id 3 4 2521 (insert id 3 4 2521 empty)", expected: "Node 512 [Term 2521]", label: "inserting a value twice changes nothing" },
        { expr: "insert id 3 4 729 figure", expected: "figure", label: "inserting a value already in a leaf changes nothing" },
        {
          expr: "sortLeaves (insert id 3 4 3801 figure)",
          expected: "Node 16960 [Term 1830, SubTrie (Node 8208 [Term 73, SubTrie (Leaf [729, 2521, 3801])]), Term 206]",
          label: "a third clashing value joins the leaf",
        },
        {
          expr: "insert id 2 4 17 (insert id 2 4 1 empty)",
          expected: "Node 2 [SubTrie (Leaf [17, 1])]",
          label: "with depth 2, a clash at level 0 goes straight into a leaf",
        },
        { expr: "insert id 3 2 6 (insert id 3 2 2 empty)", expected: "Node 4 [SubTrie (Node 3 [Term 2, Term 6])]", label: "block size 2" },
      ],
    },
    {
      id: "buildTrie",
      name: "buildTrie",
      part: "Part III",
      marks: 1,
      prompt: md(
        "Use a fold to define `buildTrie :: HashFun -> Int -> Int -> [Int] -> Trie` which builds a trie from a list of values with `insert`, starting from `empty`. The first three arguments are passed on to `insert`. The order of the values within a `Leaf` doesn't matter.",
        "",
        "```",
        "ghci> showT (buildTrie id 3 4 [1..3])",
        "0000000000001110",
        "  <1>",
        "  <2>",
        "  <3>",
        "ghci> showT (buildTrie id 3 4 [n * 256 | n <- [1..5]])",
        "0000000000000001",
        "  0000000000000001",
        "    [256,512,768,1024,1280]",
        "ghci> buildTrie id 3 4 [73,206,729,1830,2521] == figure",
        "True",
        "ghci> buildTrie hash 3 4 [73,206,729,1830,2521] == figureHashed",
        "True",
        "```",
      ),
      hints: [
        "A fold over the list of values, with `empty` as the starting trie.",
        "`insert hf d b` is a function `Int -> Trie -> Trie`: value first, then trie. That's exactly the shape `foldr` wants for its function argument.",
        "With `foldl` you'd need `flip`, and the values in leaves would come out in the reverse order (which is allowed, but `foldr` matches the examples exactly).",
        "`buildTrie hf d b = foldr (insert hf d b) empty`.",
      ],
      solution: hs`buildTrie :: HashFun -> Int -> Int -> [Int] -> Trie
buildTrie hf maxDepth b = foldr (insert hf maxDepth b) empty`,
      tests: [
        { expr: "buildTrie id 3 4 [1..3]", expected: "Node 14 [Term 1, Term 2, Term 3]" },
        {
          expr: "sortLeaves (buildTrie id 3 4 [n * 256 | n <- [1..5]])",
          expected: "Node 1 [SubTrie (Node 1 [SubTrie (Leaf [256,512,768,1024,1280])])]",
        },
        { expr: "sortLeaves (buildTrie id 3 4 [73,206,729,1830,2521])", expected: "sortLeaves figure", label: "buildTrie id 3 4 [73,206,729,1830,2521] == figure (any leaf order)" },
        { expr: "buildTrie hash 3 4 [73,206,729,1830,2521] == figureHashed", label: "buildTrie hash 3 4 [73,206,729,1830,2521] == figureHashed" },
        { expr: "buildTrie id 3 4 []", expected: "empty" },
        {
          expr: "let t = buildTrie hash 4 4 [1..200] in (trieSize t, all (\\v -> member v (hash v) t 4) [1..200], any (\\v -> member v (hash v) t 4) [201..400])",
          expected: "(200, True, False)",
          label: "a hashed trie of 1..200 contains exactly 1..200",
        },
        {
          expr: "let t = buildTrie id 3 2 [0..100] in (trieSize t, all (\\v -> member v v t 2) [0..100], member 101 101 t 2)",
          expected: "(101, True, False)",
          label: "block size 2, depth 3: everything is found, with lots of clashes",
        },
        { expr: "binCount (buildTrie id 3 2 [0..100])", expected: "16" },
        { expr: "buildTrie id 3 4 [5, 5, 5]", expected: "Node 32 [Term 5]", label: "duplicates are stored once" },
      ],
    },
  ],
};
