import { type Book, type DrillSet, hs, md } from "../schema.ts";

const shapeSetup = hs`data Shape = Circle Double | Rect Double Double
  deriving (Eq, Show)
`;

const daySetup = hs`data Day = Mon | Tue | Wed | Thu | Fri | Sat | Sun
  deriving (Eq, Show)
`;

const dishSetup = hs`type Name = String
type Price = Int
type Dish = (Name, Price)
`;

const treeSetup = hs`data Tree a = Leaf | Node (Tree a) a (Tree a)
  deriving (Eq, Show)

t1 :: Tree Int
t1 = Node (Node Leaf 2 Leaf) 5 (Node (Node Leaf 6 Leaf) 8 Leaf)

t2 :: Tree Char
t2 = Node (Node (Node Leaf 'a' Leaf) 'b' Leaf) 'c' (Node Leaf 'd' Leaf)
`;

const insertCode = hs`
insertBST :: Ord a => a -> Tree a -> Tree a
insertBST x Leaf = Node Leaf x Leaf
insertBST x (Node l y r)
  | x < y     = Node (insertBST x l) y r
  | x > y     = Node l y (insertBST x r)
  | otherwise = Node l y r
`;

const simpleExprSetup = hs`data Expr = Num Int | Add Expr Expr | Mul Expr Expr
  deriving (Eq, Show)
`;

const exprSetup = hs`import Data.Maybe (fromJust)

data Expr = Num Int
          | Var String
          | Add Expr Expr
          | Mul Expr Expr
          | Neg Expr
  deriving (Eq, Show)

type Env = [(String, Int)]

e1 :: Expr
e1 = Add (Num 2) (Mul (Var "x") (Num 3))

e2 :: Expr
e2 = Mul (Neg (Var "y")) (Add (Var "x") (Var "y"))

env1 :: Env
env1 = [("x", 4), ("y", 10)]
`;

const itemSetup = hs`type Pence = Int

data Item = Starter String Pence
          | Main String Pence Bool
          | Drink String Pence Int
  deriving (Eq, Show)
`;

const familySetup = hs`data Family = Unknown | Person String Family Family
  deriving (Eq, Show)
-- Person name mother father

ann :: Family
ann = Person "Ann"
        (Person "Beth" (Person "Cara" Unknown Unknown) Unknown)
        (Person "Dan" (Person "Eve" Unknown Unknown) (Person "Fred" Unknown Unknown))
`;

const decisionSetup = hs`data Decision = Answer String | Ask String Decision Decision
  deriving (Eq, Show)
-- Ask question ifYes ifNo

animals :: Decision
animals = Ask "Does it fly?"
            (Ask "Is it a bird?" (Answer "sparrow") (Answer "bat"))
            (Ask "Does it swim?" (Answer "fish") (Answer "dog"))
`;

const circuitSetup = hs`import Data.List (sort, nub)
import Data.Maybe (fromJust)

data Circuit = Input String
             | Not Circuit
             | And Circuit Circuit
             | Or Circuit Circuit
  deriving (Eq, Show)

type Assignment = [(String, Bool)]

halfSum :: Circuit
halfSum = Or (And (Input "a") (Not (Input "b"))) (And (Not (Input "a")) (Input "b"))

c2 :: Circuit
c2 = Not (And (Input "p") (Or (Input "q") (Not (Input "p"))))
`;

const circuitGiven = hs`
inputs :: Circuit -> [String]
inputs c = sort (nub (ins c))
  where
    ins (Input x) = [x]
    ins (Not a) = ins a
    ins (And a b) = ins a ++ ins b
    ins (Or a b) = ins a ++ ins b

evalC :: Assignment -> Circuit -> Bool
evalC env (Input x) = fromJust (lookup x env)
evalC env (Not a) = not (evalC env a)
evalC env (And a b) = evalC env a && evalC env b
evalC env (Or a b) = evalC env a || evalC env b
`;

const bracketSetup = hs`type Rating = Int

data Bracket = Entrant String Rating
             | Match Bracket Bracket
  deriving (Eq, Show)

cup :: Bracket
cup = Match (Match (Entrant "Ada" 1800) (Entrant "Bo" 1650))
            (Match (Entrant "Cy" 1700) (Match (Entrant "Di" 1900) (Entrant "Ed" 1500)))
`;

const winnerGiven = hs`
winner :: Bracket -> (String, Rating)
winner (Entrant n r) = (n, r)
winner (Match a b)
  | snd wb > snd wa = wb
  | otherwise       = wa
  where
    wa = winner a
    wb = winner b
`;

const codeSetup = hs`data Code = Sym Char | Split Code Code
  deriving (Eq, Show)
-- In a Split, bit 0 means go left and bit 1 means go right.

code1 :: Code
code1 = Split (Sym 'e') (Split (Sym 't') (Split (Sym 'a') (Sym 'q')))
`;

const mapSetup = hs`data Map = Tip | Bin Map String Int Map
  deriving (Eq, Show)
-- A search tree ordered by its String keys.

stock :: Map
stock = Bin (Bin Tip "apple" 3 Tip) "kiwi" 7 (Bin (Bin Tip "lime" 0 Tip) "pear" 5 Tip)
`;

const mapGiven = hs`
insertWithM :: (Int -> Int -> Int) -> String -> Int -> Map -> Map
insertWithM _ k v Tip = Bin Tip k v Tip
insertWithM f k v (Bin l k' v' r)
  | k < k'    = Bin (insertWithM f k v l) k' v' r
  | k > k'    = Bin l k' v' (insertWithM f k v r)
  | otherwise = Bin l k' (f v v') r

toListM :: Map -> [(String, Int)]
toListM Tip = []
toListM (Bin l k v r) = toListM l ++ [(k, v)] ++ toListM r
`;

const letSetup = hs`import Data.List (sort, nub)

data Op = Plus | Minus | Times
  deriving (Eq, Show)

data Expr = Val Int
          | Var String
          | Bin Op Expr Expr
          | Let String Expr Expr
  deriving (Eq, Show)
-- Let x e body: inside body, x stands for the value of e.

type Env = [(String, Int)]

ex1 :: Expr
ex1 = Let "x" (Val 5) (Bin Times (Var "x") (Var "y"))

ex2 :: Expr
ex2 = Let "a" (Bin Plus (Var "b") (Val 1)) (Let "b" (Val 10) (Bin Minus (Var "a") (Var "b")))
`;

const level1: DrillSet = {
  id: "b-trees-l1",
  lesson: "",
  level: 1,
  title: "Level 1: Warm-up",
  intro: md(
    "Reading `data` declarations, building values, and writing **one equation per constructor**. Most starters already give you the equations; you fill in the right-hand sides.",
    "",
    "```haskell",
    "data Tree a = Leaf | Node (Tree a) a (Tree a)",
    "",
    "size :: Tree a -> Int",
    "size Leaf         = 0",
    "size (Node l _ r) = size l + 1 + size r",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: "`data Colour = Red | Amber | Green`. How many different values does the type `Colour` have?",
      options: ["1", "3", "4", "Infinitely many"],
      answer: 1,
      why: "Each constructor with no fields is one value. `Colour` has exactly `Red`, `Amber` and `Green`. The type name `Colour` is not a value.",
    },
    {
      k: "quiz",
      q: "Given `data Shape = Circle Double | Rect Double Double`, what is the type of `Rect`?",
      options: ["`Shape`", "`Double -> Double -> Shape`", "`Double -> Shape`", "`(Double, Double) -> Shape`"],
      answer: 1,
      why: "A constructor with fields is a function. `Rect` takes two `Double`s, one at a time, and gives a `Shape`.",
    },
    {
      k: "quiz",
      q: "With the same `Shape` type, which of these is a value of type `Shape`?",
      options: ["`Rect 2.0 3.5`", "`Shape 2.0 3.5`", "`Rect 2.0`", "`Circle \"big\"`"],
      answer: 0,
      why: "`Shape` is the type name, not a constructor. `Rect 2.0` is still waiting for its second `Double`, so it is a function. `Circle` needs a `Double`, not a `String`.",
    },
    {
      k: "quiz",
      q: "You define `data Coin = Heads | Tails` with no `deriving` line, then type `Heads` in GHCi. What happens?",
      options: ["It prints `Heads`", "An error: no instance for `Show Coin`", "It prints `0`", "It prints `Coin`"],
      answer: 1,
      why: "GHCi needs `show` to print a value. Add `deriving (Show)` and GHC writes `show` for you.",
    },
    {
      k: "quiz",
      q: "Which `deriving` clause do you need so that `Heads == Tails` type-checks?",
      options: ["`deriving (Show)`", "`deriving (Eq)`", "`deriving (Ord)`", "None. `==` works on every type"],
      answer: 1,
      why: "`==` belongs to the `Eq` class. Most exam types say `deriving (Eq, Show)` so you can both compare and print values.",
    },
    {
      k: "write",
      setup: shapeSetup,
      body: "Fill in `area`. A circle of radius `r` has area `pi * r * r`. A rectangle has area width times height.",
      starter: hs`area :: Shape -> Double
area (Circle r) = undefined
area (Rect w h) = undefined
`,
      tests: [
        { expr: "area (Rect 2 3)", expected: "6.0" },
        { expr: "area (Rect 0 5)", expected: "0.0" },
        { expr: "area (Circle 1)", expected: "pi" },
        { expr: "area (Circle 2)", expected: "4 * pi" },
      ],
      hint: "Each right-hand side uses the fields named on its left: `area (Rect w h) = w * h`.",
      solution: hs`area :: Shape -> Double
area (Circle r) = pi * r * r
area (Rect w h) = w * h
`,
    },
    {
      k: "write",
      setup: daySetup,
      body: "Fill in `isWeekend`. Saturday and Sunday are the weekend. The last equation catches every other day.",
      starter: hs`isWeekend :: Day -> Bool
isWeekend Sat = undefined
isWeekend Sun = undefined
isWeekend _   = undefined
`,
      tests: [
        { expr: "isWeekend Sat", expected: "True" },
        { expr: "isWeekend Sun", expected: "True" },
        { expr: "isWeekend Mon", expected: "False" },
        { expr: "isWeekend Fri", expected: "False" },
      ],
      hint: "The first two are `True`, the catch-all is `False`.",
      solution: hs`isWeekend :: Day -> Bool
isWeekend Sat = True
isWeekend Sun = True
isWeekend _   = False
`,
    },
    {
      k: "quiz",
      q: "After `type Name = String`, which statement is true?",
      options: [
        "`Name` and `String` are the same type, so you can use one wherever the other is expected",
        "`Name` is a new type and needs its own constructor",
        "You must write `Name \"Ann\"` to make a `Name`",
        "You can't use `++` on a `Name`",
      ],
      answer: 0,
      why: "`type` only gives a new name to an existing type. It makes signatures easier to read. `data` is what makes a genuinely new type.",
    },
    {
      k: "write",
      setup: dishSetup,
      body: "Fill in `cheaper`, which gives the name of the cheaper dish. If the prices are equal, give the first one.",
      starter: hs`cheaper :: Dish -> Dish -> Name
cheaper (n1, p1) (n2, p2) = undefined
`,
      tests: [
        { expr: `cheaper ("soup", 4) ("pie", 6)`, expected: `"soup"` },
        { expr: `cheaper ("pie", 6) ("soup", 4)`, expected: `"soup"` },
        { expr: `cheaper ("tea", 3) ("bun", 3)`, expected: `"tea"` },
        { expr: `cheaper ("cake", 1) ("cake", 2)`, expected: `"cake"` },
      ],
      hint: "`Dish` is just a pair, so the pattern `(n1, p1)` takes it apart. Then `if p2 < p1 then n2 else n1`.",
      solution: hs`cheaper :: Dish -> Dish -> Name
cheaper (n1, p1) (n2, p2) = if p2 < p1 then n2 else n1
`,
    },
    {
      k: "quiz",
      q: "With `data Tree a = Leaf | Node (Tree a) a (Tree a)`, which value is the tree with 7 at the root, 3 as its left child, and nothing on its right?",
      options: [
        "`Node (Node Leaf 3 Leaf) 7 Leaf`",
        "`Node Leaf 7 (Node Leaf 3 Leaf)`",
        "`Node 7 (Node 3) Leaf`",
        "`Node (Node 3) 7 Leaf`",
      ],
      answer: 0,
      why: "The fields of `Node` are left subtree, value, right subtree, in that order. The child 3 is itself a whole tree: `Node Leaf 3 Leaf`.",
    },
    {
      k: "write",
      setup: treeSetup,
      body: md(
        "Define `small` to be this tree (empty subtrees are `Leaf`):",
        "",
        "```",
        "    4",
        "   / \\",
        "  1   9",
        "     /",
        "    6",
        "```",
      ),
      starter: hs`small :: Tree Int
small = undefined
`,
      tests: [
        { expr: "case small of { Node _ x _ -> x; Leaf -> 0 }", expected: "4", label: "the root holds 4" },
        { expr: "case small of { Node l _ _ -> l; Leaf -> Leaf }", expected: "Node Leaf 1 Leaf", label: "the left subtree" },
        { expr: "case small of { Node _ _ r -> r; Leaf -> Leaf }", expected: "Node (Node Leaf 6 Leaf) 9 Leaf", label: "the right subtree" },
        { expr: "small", expected: "Node (Node Leaf 1 Leaf) 4 (Node (Node Leaf 6 Leaf) 9 Leaf)" },
      ],
      hint: "Build it from the bottom up. The 6 is `Node Leaf 6 Leaf`, so the 9 is `Node (Node Leaf 6 Leaf) 9 Leaf`.",
      solution: hs`small :: Tree Int
small = Node (Node Leaf 1 Leaf) 4 (Node (Node Leaf 6 Leaf) 9 Leaf)
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Fill in `size`, the number of `Node`s in a tree.",
      starter: hs`size :: Tree a -> Int
size Leaf = undefined
size (Node l _ r) = undefined
`,
      tests: [
        { expr: "size (Leaf :: Tree Int)", expected: "0" },
        { expr: "size t1", expected: "4" },
        { expr: "size t2", expected: "4" },
        { expr: "size (Node Leaf 'z' Leaf)", expected: "1" },
      ],
      hint: "An empty tree has 0 nodes. A `Node` is 1 plus the sizes of both subtrees.",
      solution: hs`size :: Tree a -> Int
size Leaf = 0
size (Node l _ r) = size l + 1 + size r
`,
    },
    {
      k: "predict",
      body: md(
        "With `depth Leaf = 0` and `depth (Node l _ r) = 1 + max (depth l) (depth r)`, here is `depth (Node (Node Leaf 2 Leaf) 5 Leaf)` part-way through unfolding.",
        "",
        "What is it?",
      ),
      expr: "1 + max (1 + max 0 0) 0",
      answer: "2",
      why: "The inner node gives `1 + max 0 0 = 1`. The root gives `1 + max 1 0 = 2`.",
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Fill in `sumTree`, the total of all the numbers in a tree.",
      starter: hs`sumTree :: Tree Int -> Int
sumTree Leaf = undefined
sumTree (Node l x r) = undefined
`,
      tests: [
        { expr: "sumTree t1", expected: "21" },
        { expr: "sumTree Leaf", expected: "0" },
        { expr: "sumTree (Node Leaf (-3) Leaf)", expected: "-3" },
        { expr: "sumTree (Node (Node Leaf 1 Leaf) 1 (Node Leaf 1 Leaf))", expected: "3" },
      ],
      hint: "Same shape as `size`, but add `x` instead of 1.",
      solution: hs`sumTree :: Tree Int -> Int
sumTree Leaf = 0
sumTree (Node l x r) = sumTree l + x + sumTree r
`,
    },
    {
      k: "quiz",
      q: "How many `Leaf` constructors appear in `Node Leaf 3 (Node Leaf 4 Leaf)`?",
      options: ["1", "2", "3", "4"],
      answer: 2,
      why: "Count them in the text: one before the 3, one before the 4, one after the 4. A tree with n nodes always has n + 1 `Leaf`s.",
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Fill in `depth`: 0 for an empty tree, otherwise 1 plus the depth of the deeper subtree.",
      starter: hs`depth :: Tree a -> Int
depth Leaf = undefined
depth (Node l _ r) = undefined
`,
      tests: [
        { expr: "depth t1", expected: "3" },
        { expr: "depth (Leaf :: Tree Int)", expected: "0" },
        { expr: "depth (Node Leaf 'x' Leaf)", expected: "1" },
        { expr: "depth (Node Leaf 1 (Node Leaf 2 (Node Leaf 3 Leaf)))", expected: "3" },
      ],
      hint: "`max` picks the bigger of two numbers.",
      solution: hs`depth :: Tree a -> Int
depth Leaf = 0
depth (Node l _ r) = 1 + max (depth l) (depth r)
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Fill in `mirror`, which swaps the left and right subtrees at every node.",
      starter: hs`mirror :: Tree a -> Tree a
mirror Leaf = undefined
mirror (Node l x r) = undefined
`,
      tests: [
        { expr: "mirror (Node (Node Leaf 1 Leaf) 2 Leaf)", expected: "Node Leaf 2 (Node Leaf 1 Leaf)" },
        { expr: "mirror t2", expected: "Node (Node Leaf 'd' Leaf) 'c' (Node Leaf 'b' (Node Leaf 'a' Leaf))" },
        { expr: "mirror (Leaf :: Tree Int)", expected: "Leaf" },
        { expr: "mirror (mirror t1) == t1", label: "mirroring twice gives back the original" },
      ],
      hint: "Put the mirrored right subtree on the left: `Node (mirror r) x (mirror l)`.",
      solution: hs`mirror :: Tree a -> Tree a
mirror Leaf = Leaf
mirror (Node l x r) = Node (mirror r) x (mirror l)
`,
    },
    {
      k: "predict",
      body: "A function on `Maybe` also has one equation per constructor, just like a function on a tree.",
      expr: "let { f Nothing = 0; f (Just n) = n * 2 } in f (Just 5) + f Nothing",
      answer: "10",
      why: "`f (Just 5)` uses the second equation and gives 10. `f Nothing` gives 0.",
    },
    {
      k: "write",
      setup: simpleExprSetup,
      body: "Fill in `eval`, which works out the value of an expression.",
      starter: hs`eval :: Expr -> Int
eval (Num n) = undefined
eval (Add a b) = undefined
eval (Mul a b) = undefined
`,
      tests: [
        { expr: "eval (Num 7)", expected: "7" },
        { expr: "eval (Add (Num 2) (Num 3))", expected: "5" },
        { expr: "eval (Mul (Add (Num 1) (Num 2)) (Num 4))", expected: "12" },
        { expr: "eval (Add (Num 1) (Mul (Num 2) (Num 3)))", expected: "7" },
      ],
      hint: "Evaluate both sides, then combine: `eval (Add a b) = eval a + eval b`.",
      solution: hs`eval :: Expr -> Int
eval (Num n) = n
eval (Add a b) = eval a + eval b
eval (Mul a b) = eval a * eval b
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Fill in `preorder`, which lists the root value first, then everything in the left subtree, then everything in the right subtree.",
      starter: hs`preorder :: Tree a -> [a]
preorder Leaf = undefined
preorder (Node l x r) = undefined
`,
      tests: [
        { expr: "preorder t1", expected: "[5, 2, 8, 6]" },
        { expr: "preorder t2", expected: `"cbad"` },
        { expr: "preorder (Leaf :: Tree Int)", expected: "[]" },
        { expr: "preorder (Node Leaf 1 (Node Leaf 2 Leaf))", expected: "[1, 2]" },
      ],
      hint: "`x : preorder l ++ preorder r`.",
      solution: hs`preorder :: Tree a -> [a]
preorder Leaf = []
preorder (Node l x r) = x : preorder l ++ preorder r
`,
    },
  ],
};

const level2: DrillSet = {
  id: "b-trees-l2",
  lesson: "",
  level: 2,
  title: "Level 2: Standard",
  intro: md(
    "One complete function from a plain description, with no equations given. Start by writing one equation per constructor, then fill each one in.",
    "",
    "```haskell",
    "countIf :: (a -> Bool) -> Tree a -> Int",
    "countIf p Leaf = 0",
    "countIf p (Node l x r) = countIf p l + (if p x then 1 else 0) + countIf p r",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: "`data Size = Small | Medium | Large deriving (Eq, Ord, Show)`. What is `Small < Large`?",
      options: ["`True`", "`False`", "An error: no `Ord` instance", "It depends on the spelling"],
      answer: 0,
      why: "A derived `Ord` puts constructors in the order you wrote them: `Small < Medium < Large`.",
    },
    {
      k: "quiz",
      q: "In a binary search tree, every value in a node's left subtree is smaller than the node, and every value in its right subtree is bigger. Which of these is a search tree?",
      options: [
        "`Node (Node Leaf 3 Leaf) 5 (Node Leaf 4 Leaf)`",
        "`Node (Node Leaf 3 Leaf) 5 (Node Leaf 9 Leaf)`",
        "`Node (Node Leaf 7 Leaf) 5 (Node Leaf 9 Leaf)`",
        "`Node Leaf 5 (Node Leaf 2 Leaf)`",
      ],
      answer: 1,
      why: "Only the second has smaller on the left (3) and bigger on the right (9). Reading the tree left to right gives a sorted list: 3, 5, 9.",
    },
    {
      k: "write",
      setup: itemSetup,
      body: md(
        "Write `price :: Item -> Pence`.",
        "",
        "- A `Starter` costs its price.",
        "- A `Main name p side` costs `p`, plus 150 if `side` is `True`.",
        "- A `Drink name p n` is `n` glasses at `p` each.",
      ),
      starter: hs`price :: Item -> Pence
price item = undefined
`,
      tests: [
        { expr: `price (Starter "soup" 450)`, expected: "450" },
        { expr: `price (Main "pie" 1200 True)`, expected: "1350" },
        { expr: `price (Main "pie" 1200 False)`, expected: "1200" },
        { expr: `price (Drink "cola" 300 3)`, expected: "900" },
        { expr: `sum (map price [Starter "a" 1, Main "b" 10 True, Drink "c" 2 0])`, expected: "161" },
      ],
      hint: "Three constructors, three equations. For `Main`, use `if side then p + 150 else p`.",
      solution: hs`price :: Item -> Pence
price (Starter _ p) = p
price (Main _ p side) = if side then p + 150 else p
price (Drink _ p n) = p * n
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `mapTree :: (a -> b) -> Tree a -> Tree b`, which applies a function to every value and keeps the shape of the tree.",
      starter: hs`mapTree :: (a -> b) -> Tree a -> Tree b
mapTree f t = undefined
`,
      tests: [
        { expr: "mapTree (+ 1) t1", expected: "Node (Node Leaf 3 Leaf) 6 (Node (Node Leaf 7 Leaf) 9 Leaf)" },
        { expr: "mapTree even t1", expected: "Node (Node Leaf True Leaf) False (Node (Node Leaf True Leaf) True Leaf)" },
        { expr: "mapTree (: []) t2", expected: `Node (Node (Node Leaf "a" Leaf) "b" Leaf) "c" (Node Leaf "d" Leaf)` },
        { expr: "mapTree show (Leaf :: Tree Int)", expected: "Leaf" },
      ],
      hint: "`mapTree f (Node l x r) = Node (mapTree f l) (f x) (mapTree f r)`.",
      solution: hs`mapTree :: (a -> b) -> Tree a -> Tree b
mapTree _ Leaf = Leaf
mapTree f (Node l x r) = Node (mapTree f l) (f x) (mapTree f r)
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `countIf :: (a -> Bool) -> Tree a -> Int`, the number of values in the tree for which the test is `True`.",
      starter: hs`countIf :: (a -> Bool) -> Tree a -> Int
countIf p t = undefined
`,
      tests: [
        { expr: "countIf even t1", expected: "3" },
        { expr: "countIf (> 5) t1", expected: "2" },
        { expr: "countIf (== 'z') t2", expected: "0" },
        { expr: "countIf (const True) t2", expected: "4" },
      ],
      hint: "At a node, add 1 if `p x` holds, plus the counts from both sides.",
      solution: hs`countIf :: (a -> Bool) -> Tree a -> Int
countIf _ Leaf = 0
countIf p (Node l x r) = countIf p l + (if p x then 1 else 0) + countIf p r
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `rightSpine :: Tree a -> [a]`, the values you meet if you start at the root and keep going right until you reach a `Leaf`.",
      starter: hs`rightSpine :: Tree a -> [a]
rightSpine t = undefined
`,
      tests: [
        { expr: "rightSpine t1", expected: "[5, 8]" },
        { expr: "rightSpine t2", expected: `"cd"` },
        { expr: "rightSpine (Leaf :: Tree Int)", expected: "[]" },
        { expr: "rightSpine (Node (Node Leaf 1 Leaf) 2 Leaf)", expected: "[2]" },
      ],
      hint: "Ignore the left subtree completely: `rightSpine (Node _ x r) = x : rightSpine r`.",
      solution: hs`rightSpine :: Tree a -> [a]
rightSpine Leaf = []
rightSpine (Node _ x r) = x : rightSpine r
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `memberBST :: Ord a => a -> Tree a -> Bool` for a binary search tree. Only look down the side where the value could be.",
      starter: hs`memberBST :: Ord a => a -> Tree a -> Bool
memberBST x t = undefined
`,
      tests: [
        { expr: "memberBST 6 t1", expected: "True" },
        { expr: "memberBST 7 t1", expected: "False" },
        { expr: "memberBST 'a' t2", expected: "True" },
        { expr: "memberBST 1 Leaf", expected: "False" },
        { expr: "memberBST 9 (Node (Node Leaf 9 Leaf) 5 Leaf)", expected: "False", label: "9 > 5, so only the right side is searched" },
      ],
      hint: "Use guards: `x < y` go left, `x > y` go right, otherwise you found it.",
      solution: hs`memberBST :: Ord a => a -> Tree a -> Bool
memberBST _ Leaf = False
memberBST x (Node l y r)
  | x < y     = memberBST x l
  | x > y     = memberBST x r
  | otherwise = True
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `insertBST :: Ord a => a -> Tree a -> Tree a`, which puts a value into a search tree as a new node at the bottom. If the value is already there, return the tree unchanged.",
      starter: hs`insertBST :: Ord a => a -> Tree a -> Tree a
insertBST x t = undefined
`,
      tests: [
        { expr: "insertBST 7 t1", expected: "Node (Node Leaf 2 Leaf) 5 (Node (Node Leaf 6 (Node Leaf 7 Leaf)) 8 Leaf)" },
        { expr: "insertBST 1 t1", expected: "Node (Node (Node Leaf 1 Leaf) 2 Leaf) 5 (Node (Node Leaf 6 Leaf) 8 Leaf)" },
        { expr: "insertBST 5 t1", expected: "t1" },
        { expr: "insertBST 'e' t2", expected: "Node (Node (Node Leaf 'a' Leaf) 'b' Leaf) 'c' (Node Leaf 'd' (Node Leaf 'e' Leaf))" },
        { expr: "insertBST 3 Leaf", expected: "Node Leaf 3 Leaf" },
      ],
      hint: "Rebuild the node you pass through: `x < y` gives `Node (insertBST x l) y r`.",
      solution: hs`insertBST :: Ord a => a -> Tree a -> Tree a
insertBST x Leaf = Node Leaf x Leaf
insertBST x (Node l y r)
  | x < y     = Node (insertBST x l) y r
  | x > y     = Node l y (insertBST x r)
  | otherwise = Node l y r
`,
    },
    {
      k: "write",
      setup: treeSetup + insertCode,
      body: md(
        "`insertBST` is given. Write `buildBST :: Ord a => [a] -> Tree a`, which starts from `Leaf` and inserts the elements of the list one at a time, **from left to right**.",
        "",
        "```",
        "buildBST [5, 2, 8, 6]  is  t1",
        "```",
      ),
      starter: hs`buildBST :: Ord a => [a] -> Tree a
buildBST xs = undefined
`,
      tests: [
        { expr: "buildBST [5, 2, 8, 6]", expected: "t1" },
        { expr: `buildBST "cbda"`, expected: "t2" },
        { expr: "buildBST ([] :: [Int])", expected: "Leaf" },
        { expr: "buildBST [1, 2, 3]", expected: "Node Leaf 1 (Node Leaf 2 (Node Leaf 3 Leaf))" },
      ],
      hint: "`foldl (\\t x -> insertBST x t) Leaf xs`. Using `foldr` would insert the last element first and give a different shape.",
      solution: hs`buildBST :: Ord a => [a] -> Tree a
buildBST xs = foldl (\t x -> insertBST x t) Leaf xs
`,
    },
    {
      k: "quiz",
      q: "Postorder lists both subtrees first (left, then right), then the node itself. What is the postorder of `t1 = Node (Node Leaf 2 Leaf) 5 (Node (Node Leaf 6 Leaf) 8 Leaf)`?",
      options: ["`[2, 6, 8, 5]`", "`[5, 2, 8, 6]`", "`[2, 5, 6, 8]`", "`[6, 8, 2, 5]`"],
      answer: 0,
      why: "Left subtree gives `[2]`. Right subtree gives `[6, 8]` (its child before itself). Then the root 5 comes last.",
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `postorder :: Tree a -> [a]`: the left subtree, then the right subtree, then the node's own value.",
      starter: hs`postorder :: Tree a -> [a]
postorder t = undefined
`,
      tests: [
        { expr: "postorder t1", expected: "[2, 6, 8, 5]" },
        { expr: "postorder t2", expected: `"abdc"` },
        { expr: "postorder (Leaf :: Tree Int)", expected: "[]" },
        { expr: "postorder (Node Leaf 1 (Node Leaf 2 Leaf))", expected: "[2, 1]" },
      ],
      hint: "`postorder l ++ postorder r ++ [x]`.",
      solution: hs`postorder :: Tree a -> [a]
postorder Leaf = []
postorder (Node l x r) = postorder l ++ postorder r ++ [x]
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `atLevel :: Int -> Tree a -> [a]`, the values at level `n` from left to right. The root is at level 0, its children at level 1, and so on.",
      starter: hs`atLevel :: Int -> Tree a -> [a]
atLevel n t = undefined
`,
      tests: [
        { expr: "atLevel 0 t1", expected: "[5]" },
        { expr: "atLevel 1 t1", expected: "[2, 8]" },
        { expr: "atLevel 2 t1", expected: "[6]" },
        { expr: "atLevel 5 t1", expected: "[]" },
        { expr: "atLevel 2 t2", expected: `"a"` },
      ],
      hint: "Level 0 of a node is just its value. Level n of a node is level n - 1 of each subtree, joined.",
      solution: hs`atLevel :: Int -> Tree a -> [a]
atLevel _ Leaf = []
atLevel 0 (Node _ x _) = [x]
atLevel n (Node l _ r) = atLevel (n - 1) l ++ atLevel (n - 1) r
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `fringe :: Tree a -> [a]`, the values of the nodes that have no children (both subtrees are `Leaf`), from left to right.",
      starter: hs`fringe :: Tree a -> [a]
fringe t = undefined
`,
      tests: [
        { expr: "fringe t1", expected: "[2, 6]" },
        { expr: "fringe t2", expected: `"ad"` },
        { expr: "fringe (Leaf :: Tree Int)", expected: "[]" },
        { expr: "fringe (Node Leaf 1 Leaf)", expected: "[1]" },
      ],
      hint: "Put the special pattern `Node Leaf x Leaf` before the general `Node l _ r`.",
      solution: hs`fringe :: Tree a -> [a]
fringe Leaf = []
fringe (Node Leaf x Leaf) = [x]
fringe (Node l _ r) = fringe l ++ fringe r
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `eval :: Env -> Expr -> Int`. The environment gives the value of each variable; you may assume every variable is in it. `Neg e` is minus the value of `e`.",
      starter: hs`eval :: Env -> Expr -> Int
eval env e = undefined
`,
      tests: [
        { expr: "eval env1 e1", expected: "14" },
        { expr: "eval env1 e2", expected: "-140" },
        { expr: "eval [] (Neg (Num 3))", expected: "-3" },
        { expr: `eval [("z", 1)] (Add (Var "z") (Var "z"))`, expected: "2" },
      ],
      hint: "`eval env (Var v) = fromJust (lookup v env)`. Pass `env` along in every recursive call.",
      solution: hs`eval :: Env -> Expr -> Int
eval _ (Num n) = n
eval env (Var v) = fromJust (lookup v env)
eval env (Add a b) = eval env a + eval env b
eval env (Mul a b) = eval env a * eval env b
eval env (Neg a) = negate (eval env a)
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `vars :: Expr -> [String]`, every variable in the expression from left to right. Keep repeats.",
      starter: hs`vars :: Expr -> [String]
vars e = undefined
`,
      tests: [
        { expr: "vars e1", expected: `["x"]` },
        { expr: "vars e2", expected: `["y", "x", "y"]` },
        { expr: "vars (Num 3)", expected: "[]" },
        { expr: `vars (Add (Var "a") (Neg (Var "b")))`, expected: `["a", "b"]` },
      ],
      hint: "`Var v` gives `[v]`, `Num` gives `[]`, the others join the lists from their parts.",
      solution: hs`vars :: Expr -> [String]
vars (Num _) = []
vars (Var v) = [v]
vars (Add a b) = vars a ++ vars b
vars (Mul a b) = vars a ++ vars b
vars (Neg a) = vars a
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `countOps :: Expr -> Int`, the number of operator nodes (`Add`, `Mul` and `Neg`) in an expression.",
      starter: hs`countOps :: Expr -> Int
countOps e = undefined
`,
      tests: [
        { expr: "countOps e1", expected: "2" },
        { expr: "countOps e2", expected: "3" },
        { expr: `countOps (Var "x")`, expected: "0" },
        { expr: "countOps (Neg (Neg (Num 1)))", expected: "2" },
      ],
      hint: "Each operator node counts 1, plus whatever is below it.",
      solution: hs`countOps :: Expr -> Int
countOps (Num _) = 0
countOps (Var _) = 0
countOps (Add a b) = 1 + countOps a + countOps b
countOps (Mul a b) = 1 + countOps a + countOps b
countOps (Neg a) = 1 + countOps a
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `isConstant :: Expr -> Bool`, which is `True` when the expression contains no variables at all. Don't use `vars`.",
      starter: hs`isConstant :: Expr -> Bool
isConstant e = undefined
`,
      tests: [
        { expr: "isConstant e1", expected: "False" },
        { expr: "isConstant (Add (Num 1) (Neg (Num 2)))", expected: "True" },
        { expr: "isConstant (Num 0)", expected: "True" },
        { expr: `isConstant (Mul (Num 2) (Var "q"))`, expected: "False" },
      ],
      hint: "`Var` is `False`, `Num` is `True`, and an `Add` is constant only if both sides are (`&&`).",
      solution: hs`isConstant :: Expr -> Bool
isConstant (Num _) = True
isConstant (Var _) = False
isConstant (Add a b) = isConstant a && isConstant b
isConstant (Mul a b) = isConstant a && isConstant b
isConstant (Neg a) = isConstant a
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `rename :: String -> String -> Expr -> Expr`. `rename old new e` changes every `Var old` in `e` into `Var new` and leaves everything else alone.",
      starter: hs`rename :: String -> String -> Expr -> Expr
rename old new e = undefined
`,
      tests: [
        { expr: `rename "x" "w" e1`, expected: `Add (Num 2) (Mul (Var "w") (Num 3))` },
        { expr: `rename "y" "z" e2`, expected: `Mul (Neg (Var "z")) (Add (Var "x") (Var "z"))` },
        { expr: `rename "q" "r" e2`, expected: "e2" },
        { expr: `rename "x" "y" (Var "x")`, expected: `Var "y"` },
      ],
      hint: "Only the `Var` equation does any work: `if v == old then Var new else Var v`. Every other constructor rebuilds itself.",
      solution: hs`rename :: String -> String -> Expr -> Expr
rename _ _ (Num n) = Num n
rename old new (Var v) = if v == old then Var new else Var v
rename old new (Add a b) = Add (rename old new a) (rename old new b)
rename old new (Mul a b) = Mul (rename old new a) (rename old new b)
rename old new (Neg a) = Neg (rename old new a)
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `subst :: String -> Expr -> Expr -> Expr`. `subst x e body` replaces every `Var x` inside `body` with the whole expression `e`.",
      starter: hs`subst :: String -> Expr -> Expr -> Expr
subst x e body = undefined
`,
      tests: [
        { expr: `subst "x" (Num 4) e1`, expected: "Add (Num 2) (Mul (Num 4) (Num 3))" },
        { expr: `subst "y" (Add (Num 1) (Num 1)) e2`, expected: `Mul (Neg (Add (Num 1) (Num 1))) (Add (Var "x") (Add (Num 1) (Num 1)))` },
        { expr: `subst "z" (Num 0) e1`, expected: "e1" },
        { expr: `subst "x" (Var "y") e1`, expected: `Add (Num 2) (Mul (Var "y") (Num 3))` },
      ],
      hint: "`subst x e (Var v) = if v == x then e else Var v`. Recurse into both sides of `Add` and `Mul`.",
      solution: hs`subst :: String -> Expr -> Expr -> Expr
subst _ _ (Num n) = Num n
subst x e (Var v) = if v == x then e else Var v
subst x e (Add a b) = Add (subst x e a) (subst x e b)
subst x e (Mul a b) = Mul (subst x e a) (subst x e b)
subst x e (Neg a) = Neg (subst x e a)
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Write `showLisp :: Expr -> String`, which writes an expression in prefix style: each operator goes in brackets before its arguments, with single spaces between.",
        "",
        "```",
        "showLisp e1  is  \"(+ 2 (* x 3))\"",
        "showLisp e2  is  \"(* (- y) (+ x y))\"",
        "```",
      ),
      starter: hs`showLisp :: Expr -> String
showLisp e = undefined
`,
      tests: [
        { expr: "showLisp e1", expected: `"(+ 2 (* x 3))"` },
        { expr: "showLisp e2", expected: `"(* (- y) (+ x y))"` },
        { expr: "showLisp (Num 7)", expected: `"7"` },
        { expr: `showLisp (Var "abc")`, expected: `"abc"` },
        { expr: "showLisp (Neg (Num 1))", expected: `"(- 1)"` },
      ],
      hint: "`showLisp (Add a b) = \"(+ \" ++ showLisp a ++ \" \" ++ showLisp b ++ \")\"`. Use `show n` for numbers.",
      solution: hs`showLisp :: Expr -> String
showLisp (Num n) = show n
showLisp (Var v) = v
showLisp (Add a b) = "(+ " ++ showLisp a ++ " " ++ showLisp b ++ ")"
showLisp (Mul a b) = "(* " ++ showLisp a ++ " " ++ showLisp b ++ ")"
showLisp (Neg a) = "(- " ++ showLisp a ++ ")"
`,
    },
  ],
};

const level3: DrillSet = {
  id: "b-trees-l3",
  lesson: "",
  level: 3,
  title: "Level 3: Stretch",
  intro: md(
    "Two ideas at once: a helper function, a `Maybe` result, two trees walked together, or broken code to fix. Watch the edge cases: the empty tree, a single node, a value that isn't there.",
    "",
    "```haskell",
    "combine :: Tree Int -> Tree Int -> Tree Int",
    "combine (Node l1 x r1) (Node l2 y r2) = Node (combine l1 l2) (x + y) (combine r1 r2)",
    "combine _ _ = Leaf",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: md(
        "What does `isLeaf Leaf` give with this definition?",
        "",
        "```haskell",
        "isLeaf :: Tree a -> Bool",
        "isLeaf _    = False",
        "isLeaf Leaf = True",
        "```",
      ),
      options: ["`True`", "`False`", "A compile error", "It crashes"],
      answer: 1,
      why: "Equations are tried top to bottom and `_` matches everything, so the second equation is never reached. Put specific patterns before catch-alls.",
    },
    {
      k: "write",
      setup: treeSetup,
      body: "This `depth` should give 0 for an empty tree and 3 for `t1`, but every answer comes out one too big. Fix it.",
      starter: hs`depth :: Tree a -> Int
depth Leaf = 1
depth (Node l _ r) = 1 + max (depth l) (depth r)
`,
      tests: [
        { expr: "depth (Leaf :: Tree Int)", expected: "0" },
        { expr: "depth t1", expected: "3" },
        { expr: "depth (Node Leaf 1 Leaf)", expected: "1" },
        { expr: "depth t2", expected: "3" },
      ],
      hint: "The base case sets the scale for every other answer.",
      solution: hs`depth :: Tree a -> Int
depth Leaf = 0
depth (Node l _ r) = 1 + max (depth l) (depth r)
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "This `insertBST` works when it goes right, but going left it loses part of the tree. Fix it.",
      starter: hs`insertBST :: Ord a => a -> Tree a -> Tree a
insertBST x Leaf = Node Leaf x Leaf
insertBST x (Node l y r)
  | x < y     = insertBST x l
  | x > y     = Node l y (insertBST x r)
  | otherwise = Node l y r
`,
      tests: [
        { expr: "insertBST 1 t1", expected: "Node (Node (Node Leaf 1 Leaf) 2 Leaf) 5 (Node (Node Leaf 6 Leaf) 8 Leaf)" },
        { expr: "insertBST 7 t1", expected: "Node (Node Leaf 2 Leaf) 5 (Node (Node Leaf 6 (Node Leaf 7 Leaf)) 8 Leaf)" },
        { expr: "insertBST 5 t1", expected: "t1" },
        { expr: "insertBST 3 Leaf", expected: "Node Leaf 3 Leaf" },
      ],
      hint: "The left case must rebuild the current node around the new left subtree, just like the right case does.",
      solution: hs`insertBST :: Ord a => a -> Tree a -> Tree a
insertBST x Leaf = Node Leaf x Leaf
insertBST x (Node l y r)
  | x < y     = Node (insertBST x l) y r
  | x > y     = Node l y (insertBST x r)
  | otherwise = Node l y r
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `prune :: Int -> Tree a -> Tree a`, which keeps only the top `n` levels of a tree. Everything below becomes `Leaf`. `prune 0 t` is `Leaf`.",
      starter: hs`prune :: Int -> Tree a -> Tree a
prune n t = undefined
`,
      tests: [
        { expr: "prune 1 t1", expected: "Node Leaf 5 Leaf" },
        { expr: "prune 2 t1", expected: "Node (Node Leaf 2 Leaf) 5 (Node Leaf 8 Leaf)" },
        { expr: "prune 10 t1", expected: "t1" },
        { expr: "prune 0 t2", expected: "Leaf" },
        { expr: "prune 3 (Leaf :: Tree Int)", expected: "Leaf" },
      ],
      hint: "Two base cases: `n == 0`, and the tree already being a `Leaf`. Otherwise keep the node and prune both subtrees to `n - 1`.",
      solution: hs`prune :: Int -> Tree a -> Tree a
prune 0 _ = Leaf
prune _ Leaf = Leaf
prune n (Node l x r) = Node (prune (n - 1) l) x (prune (n - 1) r)
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `combine :: Tree Int -> Tree Int -> Tree Int`. Where both trees have a node in the same position, the result has a node holding the sum. Where either tree has a `Leaf`, the result has a `Leaf`.",
      starter: hs`combine :: Tree Int -> Tree Int -> Tree Int
combine a b = undefined
`,
      tests: [
        { expr: "combine t1 t1", expected: "Node (Node Leaf 4 Leaf) 10 (Node (Node Leaf 12 Leaf) 16 Leaf)" },
        { expr: "combine t1 Leaf", expected: "Leaf" },
        { expr: "combine Leaf t1", expected: "Leaf" },
        { expr: "combine t1 (Node Leaf 1 (Node Leaf 1 (Node Leaf 1 Leaf)))", expected: "Node Leaf 6 (Node Leaf 9 Leaf)" },
        { expr: "combine (Node Leaf 3 Leaf) (Node (Node Leaf 9 Leaf) 4 Leaf)", expected: "Node Leaf 7 Leaf" },
      ],
      hint: "Pattern match on both trees at once. One equation for two `Node`s, and a catch-all `combine _ _ = Leaf`.",
      solution: hs`combine :: Tree Int -> Tree Int -> Tree Int
combine (Node l1 x r1) (Node l2 y r2) = Node (combine l1 l2) (x + y) (combine r1 r2)
combine _ _ = Leaf
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `minMax :: Ord a => Tree a -> Maybe (a, a)`, the smallest and largest values in a tree, or `Nothing` if it is empty. The tree is **not** necessarily a search tree.",
      starter: hs`minMax :: Ord a => Tree a -> Maybe (a, a)
minMax t = undefined
`,
      tests: [
        { expr: "minMax t1", expected: "Just (2, 8)" },
        { expr: "minMax (Node (Node Leaf 9 Leaf) 1 (Node Leaf 4 Leaf))", expected: "Just (1, 9)" },
        { expr: "minMax (Leaf :: Tree Int)", expected: "Nothing" },
        { expr: "minMax t2", expected: "Just ('a', 'd')" },
      ],
      hint: "One way: a helper that lists all the values, then `Just (minimum xs, maximum xs)` unless the list is empty.",
      solution: hs`minMax :: Ord a => Tree a -> Maybe (a, a)
minMax t
  | null xs   = Nothing
  | otherwise = Just (minimum xs, maximum xs)
  where
    xs = values t

values :: Tree a -> [a]
values Leaf = []
values (Node l x r) = values l ++ [x] ++ values r
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `paths :: Tree a -> [[a]]`, every path from the root down to a node with no children, from left to right.",
      starter: hs`paths :: Tree a -> [[a]]
paths t = undefined
`,
      tests: [
        { expr: "paths t1", expected: "[[5, 2], [5, 8, 6]]" },
        { expr: "paths t2", expected: `["cba", "cd"]` },
        { expr: "paths (Leaf :: Tree Int)", expected: "[]" },
        { expr: "paths (Node Leaf 1 Leaf)", expected: "[[1]]" },
        { expr: "paths (Node Leaf 1 (Node Leaf 2 Leaf))", expected: "[[1, 2]]" },
      ],
      hint: "A childless node gives `[[x]]`. Any other node puts `x` on the front of every path from its subtrees: `map (x :) (paths l ++ paths r)`.",
      solution: hs`paths :: Tree a -> [[a]]
paths Leaf = []
paths (Node Leaf x Leaf) = [[x]]
paths (Node l x r) = map (x :) (paths l ++ paths r)
`,
    },
    {
      k: "quiz",
      q: "You are writing `pathTo :: Eq a => a -> Tree a -> Maybe [a]`. At a node holding 5 (not the target), the left subtree gives `Nothing` and the right subtree gives `Just [8, 6]`. What should this node give?",
      options: ["`Just [5, 8, 6]`", "`Just [8, 6]`", "`Nothing`", "`Just [8, 6, 5]`"],
      answer: 0,
      why: "The path is found on the right, so this node adds itself to the front of it. Only if both sides give `Nothing` is the answer `Nothing`.",
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `pathTo :: Eq a => a -> Tree a -> Maybe [a]`, the values on the way from the root to the first node holding `x` (search the left subtree before the right). Give `Nothing` if `x` is not in the tree. The tree is not necessarily a search tree.",
      starter: hs`pathTo :: Eq a => a -> Tree a -> Maybe [a]
pathTo x t = undefined
`,
      tests: [
        { expr: "pathTo 6 t1", expected: "Just [5, 8, 6]" },
        { expr: "pathTo 5 t1", expected: "Just [5]" },
        { expr: "pathTo 7 t1", expected: "Nothing" },
        { expr: "pathTo 'a' t2", expected: `Just "cba"` },
        { expr: "pathTo 3 (Node (Node Leaf 3 Leaf) 1 (Node Leaf 3 Leaf))", expected: "Just [1, 3]" },
      ],
      hint: "If `x == y`, give `Just [y]`. Otherwise use `case pathTo x l of` and, if that is `Nothing`, try `r`. Put `y :` on the front of whatever you find.",
      solution: hs`pathTo :: Eq a => a -> Tree a -> Maybe [a]
pathTo _ Leaf = Nothing
pathTo x (Node l y r)
  | x == y = Just [y]
  | otherwise = case pathTo x l of
      Just p  -> Just (y : p)
      Nothing -> case pathTo x r of
        Just p  -> Just (y : p)
        Nothing -> Nothing
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: md(
        "Write two functions.",
        "",
        "- `inorder :: Tree a -> [a]` lists the values left subtree first, then the node, then the right subtree.",
        "- `isSearchTree :: Ord a => Tree a -> Bool` is `True` when the inorder list is strictly increasing.",
      ),
      starter: hs`inorder :: Tree a -> [a]
inorder t = undefined

isSearchTree :: Ord a => Tree a -> Bool
isSearchTree t = undefined
`,
      tests: [
        { expr: "inorder t1", expected: "[2, 5, 6, 8]" },
        { expr: "isSearchTree t1", expected: "True" },
        { expr: "isSearchTree t2", expected: "True" },
        { expr: "isSearchTree (Node (Node Leaf 3 Leaf) 5 (Node Leaf 4 Leaf))", expected: "False" },
        { expr: "isSearchTree (Node (Node Leaf 1 (Node Leaf 7 Leaf)) 5 Leaf)", expected: "False", label: "7 is deep in the left of 5" },
        { expr: "isSearchTree (Leaf :: Tree Int)", expected: "True" },
      ],
      hint: "A list is strictly increasing when `and (zipWith (<) xs (drop 1 xs))`.",
      solution: hs`inorder :: Tree a -> [a]
inorder Leaf = []
inorder (Node l x r) = inorder l ++ [x] ++ inorder r

isSearchTree :: Ord a => Tree a -> Bool
isSearchTree t = and (zipWith (<) xs (drop 1 xs))
  where
    xs = inorder t
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `balanced :: Tree a -> Bool`. A tree is balanced when, **at every node**, the depths of the two subtrees differ by at most 1. An empty tree is balanced. You will need a `depth` helper.",
      starter: hs`balanced :: Tree a -> Bool
balanced t = undefined
`,
      tests: [
        { expr: "balanced t1", expected: "True" },
        { expr: "balanced t2", expected: "True" },
        { expr: "balanced (Node Leaf 1 (Node Leaf 2 (Node Leaf 3 Leaf)))", expected: "False" },
        { expr: "balanced (Leaf :: Tree Int)", expected: "True" },
        {
          expr: "balanced (Node (Node (Node (Node Leaf 1 Leaf) 2 Leaf) 3 Leaf) 4 (Node (Node Leaf 5 Leaf) 6 (Node Leaf 7 Leaf)))",
          expected: "False",
          label: "fine at the root, but not at the node holding 3",
        },
      ],
      hint: "`balanced (Node l _ r) = abs (depth l - depth r) <= 1 && balanced l && balanced r`.",
      solution: hs`balanced :: Tree a -> Bool
balanced Leaf = True
balanced (Node l _ r) = abs (depth l - depth r) <= 1 && balanced l && balanced r

depth :: Tree a -> Int
depth Leaf = 0
depth (Node l _ r) = 1 + max (depth l) (depth r)
`,
    },
    {
      k: "write",
      setup: treeSetup + insertCode,
      body: md(
        "`insertBST` is given (it ignores values already in the tree). Write two functions.",
        "",
        "- `toList :: Tree a -> [a]` gives the values in left-to-right order.",
        "- `uniqSort :: Ord a => [a] -> [a]` sorts a list and removes repeats, by inserting everything into a search tree and then reading it back.",
      ),
      starter: hs`toList :: Tree a -> [a]
toList t = undefined

uniqSort :: Ord a => [a] -> [a]
uniqSort xs = undefined
`,
      tests: [
        { expr: "toList t1", expected: "[2, 5, 6, 8]" },
        { expr: "uniqSort [3, 1, 2, 3, 1]", expected: "[1, 2, 3]" },
        { expr: `uniqSort "banana"`, expected: `"abn"` },
        { expr: "uniqSort ([] :: [Int])", expected: "[]" },
      ],
      hint: "`uniqSort xs = toList (foldr insertBST Leaf xs)`. The order of insertion changes the shape, but not the left-to-right order.",
      solution: hs`toList :: Tree a -> [a]
toList Leaf = []
toList (Node l x r) = toList l ++ [x] ++ toList r

uniqSort :: Ord a => [a] -> [a]
uniqSort xs = toList (foldr insertBST Leaf xs)
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "This `eval` has two mistakes. Find and fix them.",
      starter: hs`eval :: Env -> Expr -> Int
eval _ (Num n) = n
eval env (Var v) = fromJust (lookup v env)
eval env (Add a b) = eval env a + eval env b
eval env (Mul a b) = eval env a + eval env b
eval env (Neg a) = eval env a
`,
      tests: [
        { expr: "eval env1 e1", expected: "14" },
        { expr: "eval env1 e2", expected: "-140" },
        { expr: "eval [] (Neg (Num 2))", expected: "-2" },
        { expr: "eval [] (Mul (Num 3) (Num 3))", expected: "9" },
      ],
      hint: "Look at what `Mul` and `Neg` actually do to their values.",
      solution: hs`eval :: Env -> Expr -> Int
eval _ (Num n) = n
eval env (Var v) = fromJust (lookup v env)
eval env (Add a b) = eval env a + eval env b
eval env (Mul a b) = eval env a * eval env b
eval env (Neg a) = negate (eval env a)
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `evalM :: Env -> Expr -> Maybe Int`. It is like `eval`, but gives `Nothing` if any variable in the expression is missing from the environment.",
      starter: hs`evalM :: Env -> Expr -> Maybe Int
evalM env e = undefined
`,
      tests: [
        { expr: "evalM env1 e1", expected: "Just 14" },
        { expr: "evalM [] e1", expected: "Nothing" },
        { expr: `evalM [("y", 1)] e2`, expected: "Nothing", label: "x is missing" },
        { expr: "evalM [] (Neg (Num 5))", expected: "Just (-5)" },
        { expr: `evalM [("x", 1)] (Mul (Num 0) (Var "q"))`, expected: "Nothing" },
      ],
      hint: "`evalM env (Var v) = lookup v env`. For `Add`, use `case` on both results, or a helper `both :: (Int -> Int -> Int) -> Maybe Int -> Maybe Int -> Maybe Int`.",
      solution: hs`evalM :: Env -> Expr -> Maybe Int
evalM _ (Num n) = Just n
evalM env (Var v) = lookup v env
evalM env (Add a b) = both (+) (evalM env a) (evalM env b)
evalM env (Mul a b) = both (*) (evalM env a) (evalM env b)
evalM env (Neg a) = case evalM env a of
  Just n  -> Just (negate n)
  Nothing -> Nothing

both :: (Int -> Int -> Int) -> Maybe Int -> Maybe Int -> Maybe Int
both f (Just x) (Just y) = Just (f x y)
both _ _ _ = Nothing
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: "Write `varList :: Expr -> [String]`, the variables in an expression in alphabetical order with no repeats.",
      starter: hs`import Data.List (sort, nub)

varList :: Expr -> [String]
varList e = undefined
`,
      tests: [
        { expr: "varList e2", expected: `["x", "y"]` },
        { expr: "varList e1", expected: `["x"]` },
        { expr: "varList (Num 1)", expected: "[]" },
        { expr: `varList (Add (Var "b") (Add (Var "a") (Var "b")))`, expected: `["a", "b"]` },
      ],
      hint: "Collect all variables with a helper (repeats and all), then `sort (nub ...)`.",
      solution: hs`import Data.List (sort, nub)

varList :: Expr -> [String]
varList e = sort (nub (allVars e))

allVars :: Expr -> [String]
allVars (Num _) = []
allVars (Var v) = [v]
allVars (Add a b) = allVars a ++ allVars b
allVars (Mul a b) = allVars a ++ allVars b
allVars (Neg a) = allVars a
`,
    },
    {
      k: "write",
      setup: familySetup,
      body: "Write `ancestors :: Family -> [String]`, the names of everyone in the tree except the person at the top. List the mother's side before the father's side, and each person before their own parents.",
      starter: hs`ancestors :: Family -> [String]
ancestors f = undefined
`,
      tests: [
        { expr: "ancestors ann", expected: `["Beth", "Cara", "Dan", "Eve", "Fred"]` },
        { expr: "ancestors Unknown", expected: "[]" },
        { expr: `ancestors (Person "Zed" Unknown Unknown)`, expected: "[]" },
        { expr: `ancestors (Person "Dan" (Person "Eve" Unknown Unknown) (Person "Fred" Unknown Unknown))`, expected: `["Eve", "Fred"]` },
      ],
      hint: "Write a helper `everyone` that does include the top person. Then `ancestors (Person _ m f) = everyone m ++ everyone f`.",
      solution: hs`ancestors :: Family -> [String]
ancestors Unknown = []
ancestors (Person _ m f) = everyone m ++ everyone f

everyone :: Family -> [String]
everyone Unknown = []
everyone (Person n m f) = n : everyone m ++ everyone f
`,
    },
    {
      k: "write",
      setup: familySetup,
      body: "Write `generation :: Int -> Family -> [String]`. Generation 0 is the person at the top, 1 is their parents, 2 their grandparents, and so on. List mother's side first.",
      starter: hs`generation :: Int -> Family -> [String]
generation n f = undefined
`,
      tests: [
        { expr: "generation 0 ann", expected: `["Ann"]` },
        { expr: "generation 1 ann", expected: `["Beth", "Dan"]` },
        { expr: "generation 2 ann", expected: `["Cara", "Eve", "Fred"]` },
        { expr: "generation 3 ann", expected: "[]" },
        { expr: "generation 1 Unknown", expected: "[]" },
      ],
      hint: "`generation 0 (Person n _ _) = [n]`, and for bigger `n`, ask for generation `n - 1` of both parents.",
      solution: hs`generation :: Int -> Family -> [String]
generation _ Unknown = []
generation 0 (Person n _ _) = [n]
generation k (Person _ m f) = generation (k - 1) m ++ generation (k - 1) f
`,
    },
    {
      k: "write",
      setup: decisionSetup,
      body: "Write `decide :: [Bool] -> Decision -> Maybe String`. Follow the answers: `True` takes the yes branch, `False` the no branch. Give `Just` the answer you reach, or `Nothing` if you run out of answers first. Extra answers are ignored.",
      starter: hs`decide :: [Bool] -> Decision -> Maybe String
decide bs d = undefined
`,
      tests: [
        { expr: "decide [True, False] animals", expected: `Just "bat"` },
        { expr: "decide [False, False] animals", expected: `Just "dog"` },
        { expr: "decide [True] animals", expected: "Nothing" },
        { expr: "decide [False, True, True] animals", expected: `Just "fish"` },
        { expr: `decide [] (Answer "cat")`, expected: `Just "cat"` },
      ],
      hint: "Three equations: an `Answer` (whatever the list), an `Ask` with an empty list, and an `Ask` with `b : bs`.",
      solution: hs`decide :: [Bool] -> Decision -> Maybe String
decide _ (Answer a) = Just a
decide [] (Ask _ _ _) = Nothing
decide (b : bs) (Ask _ y n) = decide bs (if b then y else n)
`,
    },
    {
      k: "write",
      setup: decisionSetup,
      body: "Write `outcomes :: Decision -> [(String, [Bool])]`, every answer in the tree (yes branch first) paired with the list of answers that leads to it.",
      starter: hs`outcomes :: Decision -> [(String, [Bool])]
outcomes d = undefined
`,
      tests: [
        {
          expr: "outcomes animals",
          expected: `[("sparrow", [True, True]), ("bat", [True, False]), ("fish", [False, True]), ("dog", [False, False])]`,
        },
        { expr: `outcomes (Answer "cat")`, expected: `[("cat", [])]` },
        {
          expr: `outcomes (Ask "q" (Answer "a") (Ask "r" (Answer "b") (Answer "c")))`,
          expected: `[("a", [True]), ("b", [False, True]), ("c", [False, False])]`,
        },
      ],
      hint: "For an `Ask`, take the outcomes of each branch and put `True` (or `False`) on the front of each path: `[(a, True : p) | (a, p) <- outcomes y]`.",
      solution: hs`outcomes :: Decision -> [(String, [Bool])]
outcomes (Answer a) = [(a, [])]
outcomes (Ask _ y n) = [(a, True : p) | (a, p) <- outcomes y] ++ [(a, False : p) | (a, p) <- outcomes n]
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Write `simplify :: Expr -> Expr`. Simplify the parts of an expression first, then apply these rules to the result:",
        "",
        "- adding `Num 0` on either side gives the other side",
        "- multiplying by `Num 1` on either side gives the other side",
        "- multiplying by `Num 0` on either side gives `Num 0`",
        "- `Neg (Neg e)` gives `e`",
        "",
        "Anything else is left as it is.",
      ),
      starter: hs`simplify :: Expr -> Expr
simplify e = undefined
`,
      tests: [
        { expr: `simplify (Add (Num 0) (Var "x"))`, expected: `Var "x"` },
        { expr: `simplify (Mul (Add (Num 0) (Num 1)) (Var "y"))`, expected: `Var "y"`, label: "the inner Add becomes Num 1 first" },
        { expr: `simplify (Neg (Neg (Mul (Var "z") (Num 0))))`, expected: "Num 0" },
        { expr: "simplify e1", expected: "e1" },
        { expr: `simplify (Add (Var "a") (Mul (Num 1) (Num 0)))`, expected: `Var "a"` },
      ],
      hint: "Write `simplify (Add a b) = add (simplify a) (simplify b)` and a helper `add` with one equation per rule and a final `add a b = Add a b`. Do the same for `Mul` and `Neg`.",
      solution: hs`simplify :: Expr -> Expr
simplify (Num n) = Num n
simplify (Var v) = Var v
simplify (Add a b) = add (simplify a) (simplify b)
simplify (Mul a b) = mul (simplify a) (simplify b)
simplify (Neg a) = neg (simplify a)

add :: Expr -> Expr -> Expr
add (Num 0) e = e
add e (Num 0) = e
add a b = Add a b

mul :: Expr -> Expr -> Expr
mul (Num 0) _ = Num 0
mul _ (Num 0) = Num 0
mul (Num 1) e = e
mul e (Num 1) = e
mul a b = Mul a b

neg :: Expr -> Expr
neg (Neg e) = e
neg e = Neg e
`,
    },
  ],
};

const level4: DrillSet = {
  id: "b-trees-l4",
  lesson: "",
  level: 4,
  title: "Level 4: Exam strength",
  intro: md(
    "Questions worded the way the January test words them, on small invented domains. Read the given types carefully, check the examples against your understanding before you write anything, and test your answer on the examples. The last five are as hard as a 3 to 5 mark exam question.",
    "",
    "```haskell",
    "-- Define a function gates :: Circuit -> Int that returns the number of gates.",
    "gates (Input _) = 0",
    "gates (Not a)   = 1 + gates a",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: md(
        "The test gives you:",
        "",
        "```haskell",
        "data Circuit = Input String",
        "             | Not Circuit",
        "             | And Circuit Circuit",
        "             | Or Circuit Circuit",
        "```",
        "",
        "What is the type of the constructor `And`?",
      ),
      options: ["`Circuit -> Circuit -> Circuit`", "`Circuit`", "`Bool -> Bool -> Bool`", "`(Circuit, Circuit) -> Circuit`"],
      answer: 0,
      why: "`And` takes two circuits and builds a bigger circuit. It does not compute anything; `Bool`s only appear when you evaluate.",
    },
    {
      k: "write",
      setup: circuitSetup,
      body: md(
        "Define a function `gates :: Circuit -> Int` that returns the number of gates (`Not`, `And` and `Or` nodes) in a circuit. For example:",
        "",
        "```",
        "*Main> gates halfSum",
        "5",
        "*Main> gates c2",
        "4",
        "*Main> gates (Input \"x\")",
        "0",
        "```",
      ),
      starter: hs`gates :: Circuit -> Int
gates c = undefined
`,
      tests: [
        { expr: "gates halfSum", expected: "5" },
        { expr: "gates c2", expected: "4" },
        { expr: `gates (Input "x")`, expected: "0" },
        { expr: `gates (Not (Not (Input "x")))`, expected: "2" },
      ],
      hint: "Four constructors, four equations. Each gate counts 1 plus the gates below it.",
      solution: hs`gates :: Circuit -> Int
gates (Input _) = 0
gates (Not a) = 1 + gates a
gates (And a b) = 1 + gates a + gates b
gates (Or a b) = 1 + gates a + gates b
`,
    },
    {
      k: "write",
      setup: circuitSetup,
      body: md(
        "Define a function `inputs :: Circuit -> [String]` that returns the names of the inputs used in a circuit, in alphabetical order and without duplicates. For example:",
        "",
        "```",
        "*Main> inputs halfSum",
        "[\"a\",\"b\"]",
        "*Main> inputs (Not (And (Input \"b\") (Input \"a\")))",
        "[\"a\",\"b\"]",
        "```",
      ),
      starter: hs`inputs :: Circuit -> [String]
inputs c = undefined
`,
      tests: [
        { expr: "inputs halfSum", expected: `["a", "b"]` },
        { expr: "inputs c2", expected: `["p", "q"]` },
        { expr: `inputs (Input "z")`, expected: `["z"]` },
        { expr: `inputs (Not (And (Input "b") (Input "a")))`, expected: `["a", "b"]` },
      ],
      hint: "`sort` and `nub` are imported in the given code. Collect every input with a helper, then tidy the list.",
      solution: hs`inputs :: Circuit -> [String]
inputs c = sort (nub (ins c))
  where
    ins (Input x) = [x]
    ins (Not a) = ins a
    ins (And a b) = ins a ++ ins b
    ins (Or a b) = ins a ++ ins b
`,
    },
    {
      k: "write",
      setup: circuitSetup,
      body: md(
        "Define a function `evalC :: Assignment -> Circuit -> Bool` that returns the output of a circuit when its inputs have the values given in the assignment. You may assume that every input of the circuit appears in the assignment. For example:",
        "",
        "```",
        "*Main> evalC [(\"a\",True),(\"b\",False)] halfSum",
        "True",
        "*Main> evalC [(\"a\",True),(\"b\",True)] halfSum",
        "False",
        "```",
      ),
      starter: hs`evalC :: Assignment -> Circuit -> Bool
evalC env c = undefined
`,
      tests: [
        { expr: `evalC [("a", True), ("b", False)] halfSum`, expected: "True" },
        { expr: `evalC [("a", True), ("b", True)] halfSum`, expected: "False" },
        { expr: `evalC [("p", True), ("q", False)] c2`, expected: "True" },
        { expr: `evalC [("p", True), ("q", True)] c2`, expected: "False" },
        { expr: `evalC [("p", False), ("q", True)] c2`, expected: "True" },
      ],
      hint: "`evalC env (Input x) = fromJust (lookup x env)`. The gates become `not`, `&&` and `||`.",
      solution: hs`evalC :: Assignment -> Circuit -> Bool
evalC env (Input x) = fromJust (lookup x env)
evalC env (Not a) = not (evalC env a)
evalC env (And a b) = evalC env a && evalC env b
evalC env (Or a b) = evalC env a || evalC env b
`,
    },
    {
      k: "write",
      setup: bracketSetup,
      body: md(
        "A knockout tournament is described by a `Bracket`: either a single entrant (name and rating), or a match between the winners of two smaller brackets.",
        "",
        "Define a function `players :: Bracket -> [String]` that returns the names of all the entrants, from left to right. For example:",
        "",
        "```",
        "*Main> players cup",
        "[\"Ada\",\"Bo\",\"Cy\",\"Di\",\"Ed\"]",
        "```",
      ),
      starter: hs`players :: Bracket -> [String]
players b = undefined
`,
      tests: [
        { expr: "players cup", expected: `["Ada", "Bo", "Cy", "Di", "Ed"]` },
        { expr: `players (Entrant "Zoe" 1)`, expected: `["Zoe"]` },
        { expr: `players (Match (Entrant "B" 1) (Entrant "A" 2))`, expected: `["B", "A"]` },
        { expr: "length (players (Match cup cup))", expected: "10" },
      ],
      hint: "Two constructors, two equations.",
      solution: hs`players :: Bracket -> [String]
players (Entrant n _) = [n]
players (Match a b) = players a ++ players b
`,
    },
    {
      k: "write",
      setup: bracketSetup,
      body: md(
        "In each match, the entrant with the higher rating wins. If the ratings are equal, the entrant from the left bracket wins.",
        "",
        "Define a function `winner :: Bracket -> (String, Rating)` that returns the name and rating of the overall winner. For example:",
        "",
        "```",
        "*Main> winner cup",
        "(\"Di\",1900)",
        "*Main> winner (Match (Entrant \"A\" 5) (Entrant \"B\" 5))",
        "(\"A\",5)",
        "```",
      ),
      starter: hs`winner :: Bracket -> (String, Rating)
winner b = undefined
`,
      tests: [
        { expr: "winner cup", expected: `("Di", 1900)` },
        { expr: `winner (Match (Entrant "A" 5) (Entrant "B" 5))`, expected: `("A", 5)` },
        { expr: `winner (Match (Entrant "A" 1) (Match (Entrant "B" 3) (Entrant "C" 2)))`, expected: `("B", 3)` },
        { expr: `winner (Entrant "Solo" 1000)`, expected: `("Solo", 1000)` },
      ],
      hint: "Find the winner of each side with `where wa = winner a; wb = winner b`, then compare their ratings with `snd`.",
      solution: hs`winner :: Bracket -> (String, Rating)
winner (Entrant n r) = (n, r)
winner (Match a b)
  | snd wb > snd wa = wb
  | otherwise       = wa
  where
    wa = winner a
    wb = winner b
`,
    },
    {
      k: "write",
      setup: bracketSetup + winnerGiven,
      body: md(
        "`winner` is given. Define a function `wins :: String -> Bracket -> Int` that returns the number of matches won by the named entrant. For example:",
        "",
        "```",
        "*Main> wins \"Di\" cup",
        "3",
        "*Main> wins \"Ada\" cup",
        "1",
        "*Main> wins \"Ed\" cup",
        "0",
        "```",
      ),
      starter: hs`wins :: String -> Bracket -> Int
wins p b = undefined
`,
      tests: [
        { expr: `wins "Di" cup`, expected: "3" },
        { expr: `wins "Ada" cup`, expected: "1" },
        { expr: `wins "Ed" cup`, expected: "0" },
        { expr: `wins "Zed" cup`, expected: "0" },
        { expr: `wins "Cy" (Match (Entrant "Cy" 2) (Entrant "Bo" 1))`, expected: "1" },
      ],
      hint: "At each `Match`, count 1 if `fst (winner (Match a b)) == p`, then add the wins in both halves.",
      solution: hs`wins :: String -> Bracket -> Int
wins _ (Entrant _ _) = 0
wins p (Match a b) = here + wins p a + wins p b
  where
    here = if fst (winner (Match a b)) == p then 1 else 0
`,
    },
    {
      k: "write",
      setup: codeSetup,
      body: md(
        "A `Code` tree describes a binary code for characters: the path from the root to a `Sym` spells that character's code, with 0 for left and 1 for right. In `code1`, `'e'` is `[0]`, `'t'` is `[1,0]`, `'a'` is `[1,1,0]` and `'q'` is `[1,1,1]`.",
        "",
        "Define a function `symbols :: Code -> String` that returns the characters in the tree, from left to right. For example:",
        "",
        "```",
        "*Main> symbols code1",
        "\"etaq\"",
        "```",
      ),
      starter: hs`symbols :: Code -> String
symbols c = undefined
`,
      tests: [
        { expr: "symbols code1", expected: `"etaq"` },
        { expr: "symbols (Sym 'x')", expected: `"x"` },
        { expr: "symbols (Split (Split (Sym 'a') (Sym 'b')) (Sym 'c'))", expected: `"abc"` },
        { expr: "length (symbols (Split code1 code1))", expected: "8" },
      ],
      hint: "`symbols (Sym c) = [c]`.",
      solution: hs`symbols :: Code -> String
symbols (Sym c) = [c]
symbols (Split l r) = symbols l ++ symbols r
`,
    },
    {
      k: "write",
      setup: codeSetup,
      body: md(
        "To decode a list of bits, start at the root and follow one bit at a time. When you reach a `Sym`, output its character and go back to the root for the next bit.",
        "",
        "Define a function `decode :: Code -> [Int] -> String`. You may assume the root is a `Split` and the bits are a complete, valid message. For example:",
        "",
        "```",
        "*Main> decode code1 [1,0,0,1,1,0]",
        "\"tea\"",
        "*Main> decode code1 []",
        "\"\"",
        "```",
      ),
      starter: hs`decode :: Code -> [Int] -> String
decode c bs = undefined
`,
      tests: [
        { expr: "decode code1 [1, 0, 0, 1, 1, 0]", expected: `"tea"` },
        { expr: "decode code1 []", expected: `""` },
        { expr: "decode code1 [1, 1, 1, 0]", expected: `"qe"` },
        { expr: "decode code1 [0, 0, 0]", expected: `"eee"` },
        { expr: "decode (Split (Sym 'x') (Sym 'y')) [1, 0, 1]", expected: `"yxy"` },
      ],
      hint: "Write a helper `walk :: Code -> [Int] -> (Char, [Int])` that follows bits down to one `Sym` and returns its character and the bits left over. Then `decode` calls `walk` on the whole tree again and again.",
      solution: hs`decode :: Code -> [Int] -> String
decode _ [] = []
decode c bs = x : decode c rest
  where
    (x, rest) = walk c bs

walk :: Code -> [Int] -> (Char, [Int])
walk (Sym x) bs = (x, bs)
walk (Split l r) (b : bs) = walk (if b == 0 then l else r) bs
walk (Split _ _) [] = error "incomplete message"
`,
    },
    {
      k: "write",
      setup: codeSetup,
      body: md(
        "Define a function `codeOf :: Char -> Code -> Maybe [Int]` that returns the code of a character, or `Nothing` if the character is not in the tree. For example:",
        "",
        "```",
        "*Main> codeOf 'a' code1",
        "Just [1,1,0]",
        "*Main> codeOf 'z' code1",
        "Nothing",
        "```",
      ),
      starter: hs`codeOf :: Char -> Code -> Maybe [Int]
codeOf ch c = undefined
`,
      tests: [
        { expr: "codeOf 'a' code1", expected: "Just [1, 1, 0]" },
        { expr: "codeOf 'e' code1", expected: "Just [0]" },
        { expr: "codeOf 'z' code1", expected: "Nothing" },
        { expr: "codeOf 'x' (Sym 'x')", expected: "Just []" },
        { expr: "codeOf 'q' code1", expected: "Just [1, 1, 1]" },
      ],
      hint: "At a `Split`, try the left side and put 0 in front if it works; otherwise try the right side and put 1 in front.",
      solution: hs`codeOf :: Char -> Code -> Maybe [Int]
codeOf ch (Sym c) = if c == ch then Just [] else Nothing
codeOf ch (Split l r) = case codeOf ch l of
  Just bs -> Just (0 : bs)
  Nothing -> case codeOf ch r of
    Just bs -> Just (1 : bs)
    Nothing -> Nothing
`,
    },
    {
      k: "write",
      setup: mapSetup,
      body: md(
        "A `Map` is a binary search tree of key/value pairs: keys in the left subtree of a `Bin` are smaller than its key, and keys on the right are bigger.",
        "",
        "Define a function `lookupM :: String -> Map -> Maybe Int` that returns the value stored under a key. It should only search the subtree in which the key could be. For example:",
        "",
        "```",
        "*Main> lookupM \"pear\" stock",
        "Just 5",
        "*Main> lookupM \"fig\" stock",
        "Nothing",
        "```",
      ),
      starter: hs`lookupM :: String -> Map -> Maybe Int
lookupM k m = undefined
`,
      tests: [
        { expr: `lookupM "pear" stock`, expected: "Just 5" },
        { expr: `lookupM "lime" stock`, expected: "Just 0" },
        { expr: `lookupM "fig" stock`, expected: "Nothing" },
        { expr: `lookupM "kiwi" Tip`, expected: "Nothing" },
        { expr: `lookupM "apple" stock`, expected: "Just 3" },
      ],
      hint: "Compare the key with the node's key using guards, just like `memberBST`.",
      solution: hs`lookupM :: String -> Map -> Maybe Int
lookupM _ Tip = Nothing
lookupM k (Bin l k' v r)
  | k < k'    = lookupM k l
  | k > k'    = lookupM k r
  | otherwise = Just v
`,
    },
    {
      k: "write",
      setup: mapSetup,
      body: md(
        "Define a function `insertWithM :: (Int -> Int -> Int) -> String -> Int -> Map -> Map`. If the key is not in the map, `insertWithM f k v m` adds it with value `v` as a new node at the bottom of the tree. If the key is already there with value `old`, its value becomes `f v old`. For example:",
        "",
        "```",
        "*Main> insertWithM (+) \"kiwi\" 2 stock",
        "Bin (Bin Tip \"apple\" 3 Tip) \"kiwi\" 9 (Bin (Bin Tip \"lime\" 0 Tip) \"pear\" 5 Tip)",
        "*Main> insertWithM (+) \"a\" 1 Tip",
        "Bin Tip \"a\" 1 Tip",
        "```",
      ),
      starter: hs`insertWithM :: (Int -> Int -> Int) -> String -> Int -> Map -> Map
insertWithM f k v m = undefined
`,
      tests: [
        { expr: `insertWithM (+) "kiwi" 2 stock`, expected: `Bin (Bin Tip "apple" 3 Tip) "kiwi" 9 (Bin (Bin Tip "lime" 0 Tip) "pear" 5 Tip)` },
        { expr: `insertWithM (+) "fig" 4 stock`, expected: `Bin (Bin Tip "apple" 3 (Bin Tip "fig" 4 Tip)) "kiwi" 7 (Bin (Bin Tip "lime" 0 Tip) "pear" 5 Tip)` },
        { expr: `insertWithM (-) "pear" 1 stock`, expected: `Bin (Bin Tip "apple" 3 Tip) "kiwi" 7 (Bin (Bin Tip "lime" 0 Tip) "pear" (-4) Tip)`, label: "the new value is f v old = 1 - 5" },
        { expr: `insertWithM (+) "a" 1 Tip`, expected: `Bin Tip "a" 1 Tip` },
      ],
      hint: "Same guards as `lookupM`, but rebuild each `Bin` you pass through. In the equal case, keep `l` and `r` and store `f v old`.",
      solution: hs`insertWithM :: (Int -> Int -> Int) -> String -> Int -> Map -> Map
insertWithM _ k v Tip = Bin Tip k v Tip
insertWithM f k v (Bin l k' v' r)
  | k < k'    = Bin (insertWithM f k v l) k' v' r
  | k > k'    = Bin l k' v' (insertWithM f k v r)
  | otherwise = Bin l k' (f v v') r
`,
    },
    {
      k: "write",
      setup: mapSetup,
      body: md(
        "Define a function `toListM :: Map -> [(String, Int)]` that returns the key/value pairs of a map in increasing order of key. For example:",
        "",
        "```",
        "*Main> toListM stock",
        "[(\"apple\",3),(\"kiwi\",7),(\"lime\",0),(\"pear\",5)]",
        "```",
      ),
      starter: hs`toListM :: Map -> [(String, Int)]
toListM m = undefined
`,
      tests: [
        { expr: "toListM stock", expected: `[("apple", 3), ("kiwi", 7), ("lime", 0), ("pear", 5)]` },
        { expr: "toListM Tip", expected: "[]" },
        { expr: `toListM (Bin Tip "x" 1 Tip)`, expected: `[("x", 1)]` },
        { expr: `map fst (toListM (Bin (Bin Tip "b" 0 Tip) "c" 0 Tip))`, expected: `["b", "c"]` },
      ],
      hint: "In a search tree, the left-to-right (inorder) walk is already sorted by key.",
      solution: hs`toListM :: Map -> [(String, Int)]
toListM Tip = []
toListM (Bin l k v r) = toListM l ++ [(k, v)] ++ toListM r
`,
    },
    {
      k: "write",
      setup: mapSetup + mapGiven,
      body: md(
        "`insertWithM` and `toListM` are given. Define a function `tally :: [String] -> Map` that counts how many times each word occurs. Start from `Tip` and insert the words one at a time, **from left to right**. For example:",
        "",
        "```",
        "*Main> toListM (tally [\"b\",\"a\",\"b\",\"c\",\"b\"])",
        "[(\"a\",1),(\"b\",3),(\"c\",1)]",
        "*Main> tally [\"m\",\"c\",\"t\"]",
        "Bin (Bin Tip \"c\" 1 Tip) \"m\" 1 (Bin Tip \"t\" 1 Tip)",
        "```",
      ),
      starter: hs`tally :: [String] -> Map
tally ws = undefined
`,
      tests: [
        { expr: `toListM (tally ["b", "a", "b", "c", "b"])`, expected: `[("a", 1), ("b", 3), ("c", 1)]` },
        { expr: "tally []", expected: "Tip" },
        { expr: `tally ["x", "x"]`, expected: `Bin Tip "x" 2 Tip` },
        { expr: `tally ["m", "c", "t"]`, expected: `Bin (Bin Tip "c" 1 Tip) "m" 1 (Bin Tip "t" 1 Tip)`, label: "words are inserted left to right" },
      ],
      hint: "Each word adds 1: `insertWithM (+) w 1`. To go left to right, use `foldl` with the map as the accumulator.",
      solution: hs`tally :: [String] -> Map
tally ws = foldl (\m w -> insertWithM (+) w 1 m) Tip ws
`,
    },
    {
      k: "write",
      setup: circuitSetup + circuitGiven,
      body: md(
        "`inputs` and `evalC` are given. A circuit is *satisfiable* if at least one assignment of `True`/`False` to its inputs makes its output `True`.",
        "",
        "Define a function `satisfiable :: Circuit -> Bool`. For example:",
        "",
        "```",
        "*Main> satisfiable halfSum",
        "True",
        "*Main> satisfiable (And (Input \"a\") (Not (Input \"a\")))",
        "False",
        "```",
      ),
      starter: hs`satisfiable :: Circuit -> Bool
satisfiable c = undefined
`,
      tests: [
        { expr: "satisfiable halfSum", expected: "True" },
        { expr: `satisfiable (And (Input "a") (Not (Input "a")))`, expected: "False" },
        { expr: "satisfiable c2", expected: "True" },
        { expr: `satisfiable (Not (Or (Input "x") (Not (Input "x"))))`, expected: "False" },
        { expr: `satisfiable (Input "k")`, expected: "True" },
      ],
      hint: "Write `assignments :: [String] -> [Assignment]` giving all 2^n assignments: for `x : xs`, put `(x, True)` and `(x, False)` in front of each assignment of `xs`. Then use `any`.",
      solution: hs`satisfiable :: Circuit -> Bool
satisfiable c = any (\env -> evalC env c) (assignments (inputs c))

assignments :: [String] -> [Assignment]
assignments [] = [[]]
assignments (x : xs) = [(x, b) : rest | b <- [True, False], rest <- assignments xs]
`,
    },
    {
      k: "write",
      setup: circuitSetup,
      body: md(
        "A circuit is in *negation normal form* when `Not` is only ever applied directly to an `Input`. Any circuit can be converted using these facts:",
        "",
        "- `Not (Not c)` is the same as `c`",
        "- `Not (And a b)` is the same as `Or (Not a) (Not b)`",
        "- `Not (Or a b)` is the same as `And (Not a) (Not b)`",
        "",
        "Define a function `nnf :: Circuit -> Circuit` that converts a circuit to negation normal form, keeping the order of the parts. For example:",
        "",
        "```",
        "*Main> nnf c2",
        "Or (Not (Input \"p\")) (And (Not (Input \"q\")) (Input \"p\"))",
        "*Main> nnf (Not (Not (Not (Input \"a\"))))",
        "Not (Input \"a\")",
        "```",
      ),
      starter: hs`nnf :: Circuit -> Circuit
nnf c = undefined
`,
      tests: [
        { expr: "nnf c2", expected: `Or (Not (Input "p")) (And (Not (Input "q")) (Input "p"))` },
        { expr: `nnf (Not (Not (Not (Input "a"))))`, expected: `Not (Input "a")` },
        { expr: "nnf halfSum", expected: "halfSum" },
        { expr: `nnf (Not (Or (Input "a") (And (Input "b") (Input "c"))))`, expected: `And (Not (Input "a")) (Or (Not (Input "b")) (Not (Input "c")))` },
        { expr: `nnf (And (Not (Not (Input "x"))) (Input "y"))`, expected: `And (Input "x") (Input "y")` },
      ],
      hint: "Use a second function `neg :: Circuit -> Circuit` that gives the negation normal form of `Not c`. Then `nnf (Not c) = neg c`, `neg (Not c) = nnf c`, and `neg (And a b) = Or (neg a) (neg b)`.",
      solution: hs`nnf :: Circuit -> Circuit
nnf (Input x) = Input x
nnf (Not c) = neg c
nnf (And a b) = And (nnf a) (nnf b)
nnf (Or a b) = Or (nnf a) (nnf b)

neg :: Circuit -> Circuit
neg (Input x) = Not (Input x)
neg (Not c) = nnf c
neg (And a b) = Or (neg a) (neg b)
neg (Or a b) = And (neg a) (neg b)
`,
    },
    {
      k: "write",
      setup: letSetup,
      body: md(
        "In this expression language, `Let x e body` means: work out the value of `e`, then evaluate `body` with `x` standing for that value. Inside `body`, this `x` hides any other `x`. Outside `body`, it has no effect.",
        "",
        "Define a function `evalL :: Env -> Expr -> Int` that evaluates an expression. A variable takes the value of its **first** binding in the environment; you may assume there is one. For example:",
        "",
        "```",
        "*Main> evalL [(\"y\",3)] ex1",
        "15",
        "*Main> evalL [(\"b\",2)] ex2",
        "-7",
        "*Main> evalL [(\"x\",7)] (Bin Plus (Let \"x\" (Val 1) (Var \"x\")) (Var \"x\"))",
        "8",
        "```",
      ),
      starter: hs`evalL :: Env -> Expr -> Int
evalL env e = undefined
`,
      tests: [
        { expr: `evalL [("y", 3)] ex1`, expected: "15" },
        { expr: `evalL [("b", 2)] ex2`, expected: "-7", label: "a is 2 + 1, then b is 10 inside the inner Let" },
        { expr: `evalL [("x", 1)] (Let "x" (Val 2) (Var "x"))`, expected: "2" },
        { expr: `evalL [] (Let "x" (Val 2) (Let "x" (Bin Plus (Var "x") (Val 1)) (Var "x")))`, expected: "3" },
        { expr: `evalL [("x", 7)] (Bin Plus (Let "x" (Val 1) (Var "x")) (Var "x"))`, expected: "8" },
        { expr: `evalL [] (Bin Minus (Val 2) (Bin Times (Val 3) (Val 4)))`, expected: "-10" },
      ],
      hint: "`lookup` already finds the first binding. For `Let x e b`, evaluate `b` in the environment `(x, evalL env e) : env`. Write a helper `apply :: Op -> Int -> Int -> Int`.",
      solution: hs`evalL :: Env -> Expr -> Int
evalL _ (Val n) = n
evalL env (Var v) = case lookup v env of
  Just n  -> n
  Nothing -> error ("unbound " ++ v)
evalL env (Bin op a b) = apply op (evalL env a) (evalL env b)
evalL env (Let x e b) = evalL ((x, evalL env e) : env) b

apply :: Op -> Int -> Int -> Int
apply Plus = (+)
apply Minus = (-)
apply Times = (*)
`,
    },
    {
      k: "write",
      setup: letSetup,
      body: md(
        "A variable is *free* in an expression if it is used somewhere that is not inside the body of a `Let` that binds it. Note that in `Let x e body`, uses of `x` inside `e` are not bound by this `Let`.",
        "",
        "Define a function `freeVars :: Expr -> [String]` that returns the free variables of an expression, in alphabetical order and without duplicates. For example:",
        "",
        "```",
        "*Main> freeVars ex1",
        "[\"y\"]",
        "*Main> freeVars ex2",
        "[\"b\"]",
        "*Main> freeVars (Let \"z\" (Var \"z\") (Var \"z\"))",
        "[\"z\"]",
        "```",
      ),
      starter: hs`freeVars :: Expr -> [String]
freeVars e = undefined
`,
      tests: [
        { expr: "freeVars ex1", expected: `["y"]` },
        { expr: "freeVars ex2", expected: `["b"]` },
        { expr: `freeVars (Bin Plus (Let "x" (Val 1) (Var "x")) (Var "x"))`, expected: `["x"]` },
        { expr: `freeVars (Let "z" (Var "z") (Var "z"))`, expected: `["z"]` },
        { expr: "freeVars (Val 3)", expected: "[]" },
        { expr: `freeVars (Bin Times (Var "q") (Let "p" (Var "r") (Bin Plus (Var "p") (Var "q"))))`, expected: `["q", "r"]` },
      ],
      hint: "Write a helper `fv` that may contain repeats. For `Let x e b`, it is `fv e ++ filter (/= x) (fv b)`. Then `freeVars = sort (nub (fv e))`.",
      solution: hs`freeVars :: Expr -> [String]
freeVars e = sort (nub (fv e))

fv :: Expr -> [String]
fv (Val _) = []
fv (Var v) = [v]
fv (Bin _ a b) = fv a ++ fv b
fv (Let x e b) = fv e ++ filter (/= x) (fv b)
`,
    },
    {
      k: "write",
      setup: mapSetup,
      body: md(
        "Define a function `deleteM :: String -> Map -> Map` that removes a key from a map, keeping it a search tree. If the key is not present, the map is unchanged. When the node to remove is found:",
        "",
        "- if its left subtree is `Tip`, replace the node by its right subtree;",
        "- otherwise, if its right subtree is `Tip`, replace it by its left subtree;",
        "- otherwise, replace its key and value by the smallest key (and its value) in the right subtree, and delete that key from the right subtree.",
        "",
        "For example:",
        "",
        "```",
        "*Main> deleteM \"kiwi\" stock",
        "Bin (Bin Tip \"apple\" 3 Tip) \"lime\" 0 (Bin Tip \"pear\" 5 Tip)",
        "*Main> deleteM \"pear\" stock",
        "Bin (Bin Tip \"apple\" 3 Tip) \"kiwi\" 7 (Bin Tip \"lime\" 0 Tip)",
        "```",
      ),
      starter: hs`deleteM :: String -> Map -> Map
deleteM k m = undefined
`,
      tests: [
        { expr: `deleteM "kiwi" stock`, expected: `Bin (Bin Tip "apple" 3 Tip) "lime" 0 (Bin Tip "pear" 5 Tip)` },
        { expr: `deleteM "pear" stock`, expected: `Bin (Bin Tip "apple" 3 Tip) "kiwi" 7 (Bin Tip "lime" 0 Tip)` },
        { expr: `deleteM "apple" stock`, expected: `Bin Tip "kiwi" 7 (Bin (Bin Tip "lime" 0 Tip) "pear" 5 Tip)` },
        { expr: `deleteM "fig" stock`, expected: "stock" },
        { expr: `deleteM "a" (Bin Tip "a" 1 Tip)`, expected: "Tip" },
      ],
      hint: "Write a helper `smallest :: Map -> (String, Int)` that keeps going left. The third case becomes `Bin l k2 v2 (deleteM k2 r) where (k2, v2) = smallest r`.",
      solution: hs`deleteM :: String -> Map -> Map
deleteM _ Tip = Tip
deleteM k (Bin l k' v r)
  | k < k'    = Bin (deleteM k l) k' v r
  | k > k'    = Bin l k' v (deleteM k r)
  | otherwise = joinM l r

joinM :: Map -> Map -> Map
joinM Tip r = r
joinM l Tip = l
joinM l r = Bin l k2 v2 (deleteM k2 r)
  where
    (k2, v2) = smallest r

smallest :: Map -> (String, Int)
smallest (Bin Tip k v _) = (k, v)
smallest (Bin l _ _ _) = smallest l
smallest Tip = error "empty map"
`,
    },
    {
      k: "write",
      setup: letSetup,
      body: md(
        "Define a function `inline :: Expr -> Expr` that removes every `Let` from an expression. `Let x e body` is replaced by `body` with each free occurrence of `Var x` replaced by `e`. Inline the parts first, so that when you substitute there are no `Let`s left inside `body` or `e`. For example:",
        "",
        "```",
        "*Main> inline ex1",
        "Bin Times (Val 5) (Var \"y\")",
        "*Main> inline ex2",
        "Bin Minus (Bin Plus (Var \"b\") (Val 1)) (Val 10)",
        "```",
      ),
      starter: hs`inline :: Expr -> Expr
inline e = undefined
`,
      tests: [
        { expr: "inline ex1", expected: `Bin Times (Val 5) (Var "y")` },
        { expr: "inline ex2", expected: `Bin Minus (Bin Plus (Var "b") (Val 1)) (Val 10)` },
        { expr: `inline (Let "x" (Val 2) (Let "x" (Bin Plus (Var "x") (Val 1)) (Var "x")))`, expected: "Bin Plus (Val 2) (Val 1)" },
        { expr: `inline (Bin Plus (Val 1) (Var "q"))`, expected: `Bin Plus (Val 1) (Var "q")` },
        { expr: `inline (Let "x" (Val 3) (Bin Plus (Var "x") (Var "x")))`, expected: "Bin Plus (Val 3) (Val 3)" },
      ],
      hint: "Write `subst :: String -> Expr -> Expr -> Expr` for expressions with no `Let`s. Then `inline (Let x e b) = subst x (inline e) (inline b)`.",
      solution: hs`inline :: Expr -> Expr
inline (Val n) = Val n
inline (Var v) = Var v
inline (Bin op a b) = Bin op (inline a) (inline b)
inline (Let x e b) = subst x (inline e) (inline b)

subst :: String -> Expr -> Expr -> Expr
subst _ _ (Val n) = Val n
subst x e (Var v) = if v == x then e else Var v
subst x e (Bin op a b) = Bin op (subst x e a) (subst x e b)
subst x e (Let y d b) = Let y (subst x e d) (if y == x then b else subst x e b)
`,
    },
  ],
};

const extra: DrillSet = {
  id: "b-trees-extra",
  lesson: "",
  level: 5,
  title: "Extra practice",
  intro: md(
    "More of the same data-type and tree recursion, mixed difficulty, so you can keep practising without new ideas.",
    "Toward the end the questions are exam-style: a short description, a type, and a GHCi transcript.",
  ),
  drills: [
    {
      k: "quiz",
      q: md(
        "Given",
        "",
        "```",
        "data Tree a = Leaf | Node (Tree a) a (Tree a)",
        "```",
        "",
        "what is the type of the constructor `Node`?",
      ),
      options: [
        "`Tree a -> a -> Tree a -> Tree a`",
        "`a -> Tree a`",
        "`(Tree a, a, Tree a)`",
        "`Tree a`",
      ],
      answer: 0,
      why: "`Node` takes a left subtree, a value, and a right subtree, and builds a `Tree a`.",
    },
    {
      k: "predict",
      body: md(
        "With `size Leaf = 0` and `size (Node l _ r) = 1 + size l + size r`, here is `size (Node (Node Leaf 'a' Leaf) 'b' Leaf)` part-way through unfolding.",
        "",
        "What is it?",
      ),
      expr: "1 + (1 + 0 + 0) + 0",
      answer: "2",
      why: "The inner node `'a'` is 1. The root `'b'` adds 1 more. Two nodes in total.",
    },
    {
      k: "write",
      setup: shapeSetup,
      body: "Fill in `perimeter`. A circle of radius `r` has perimeter `2 * pi * r`. A rectangle has perimeter `2 * (width + height)`.",
      starter: hs`perimeter :: Shape -> Double
perimeter (Circle r) = undefined
perimeter (Rect w h) = undefined
`,
      tests: [
        { expr: "perimeter (Rect 2 3)", expected: "10.0" },
        { expr: "perimeter (Rect 0 5)", expected: "10.0" },
        { expr: "perimeter (Circle 1)", expected: "2 * pi" },
        { expr: "perimeter (Circle 0)", expected: "0.0" },
      ],
      hint: "One equation per constructor: `2 * pi * r` for a circle, `2 * (w + h)` for a rectangle.",
      solution: hs`perimeter :: Shape -> Double
perimeter (Circle r) = 2 * pi * r
perimeter (Rect w h) = 2 * (w + h)
`,
    },
    {
      k: "write",
      setup: daySetup,
      body: "Fill in `nextDay`, which returns the following day of the week. Sunday is followed by Monday.",
      starter: hs`nextDay :: Day -> Day
nextDay d = undefined
`,
      tests: [
        { expr: "nextDay Mon", expected: "Tue" },
        { expr: "nextDay Sun", expected: "Mon" },
        { expr: "nextDay Fri", expected: "Sat" },
        { expr: "nextDay Sat", expected: "Sun" },
      ],
      hint: "One equation per day, or `succ` with a special case for `Sun`. `Day` does not derive `Enum` here, so write the seven equations.",
      solution: hs`nextDay :: Day -> Day
nextDay Mon = Tue
nextDay Tue = Wed
nextDay Wed = Thu
nextDay Thu = Fri
nextDay Fri = Sat
nextDay Sat = Sun
nextDay Sun = Mon
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `isLeaf`, which is True only for `Leaf`.",
      starter: hs`isLeaf :: Tree a -> Bool
isLeaf t = undefined
`,
      tests: [
        { expr: "isLeaf (Leaf :: Tree Int)", expected: "True" },
        { expr: "isLeaf t1", expected: "False" },
        { expr: "isLeaf (Node Leaf 1 Leaf)", expected: "False" },
        { expr: "isLeaf t2", expected: "False" },
      ],
      hint: "`isLeaf Leaf = True` and `isLeaf _ = False`.",
      solution: hs`isLeaf :: Tree a -> Bool
isLeaf Leaf = True
isLeaf _ = False
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `leftmost`, which returns the value at the end of the left spine. `Leaf` has no value, so the result is `Maybe`.",
      starter: hs`leftmost :: Tree a -> Maybe a
leftmost t = undefined
`,
      tests: [
        { expr: "leftmost t1", expected: "Just 2" },
        { expr: "leftmost (Leaf :: Tree Int)", expected: "Nothing" },
        { expr: "leftmost (Node Leaf 9 Leaf)", expected: "Just 9" },
        { expr: "leftmost t2", expected: "Just 'a'" },
      ],
      hint: "On a `Node`, if the left child is `Leaf` you have arrived; otherwise keep going left.",
      solution: hs`leftmost :: Tree a -> Maybe a
leftmost Leaf = Nothing
leftmost (Node Leaf x _) = Just x
leftmost (Node l _ _) = leftmost l
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `rightmost`, which returns the value at the end of the right spine, or `Nothing` for `Leaf`.",
      starter: hs`rightmost :: Tree a -> Maybe a
rightmost t = undefined
`,
      tests: [
        { expr: "rightmost t1", expected: "Just 8" },
        { expr: "rightmost (Leaf :: Tree Int)", expected: "Nothing" },
        { expr: "rightmost (Node Leaf 9 Leaf)", expected: "Just 9" },
        { expr: "rightmost t2", expected: "Just 'd'" },
      ],
      hint: "Same as leftmost, but walk the right child.",
      solution: hs`rightmost :: Tree a -> Maybe a
rightmost Leaf = Nothing
rightmost (Node _ x Leaf) = Just x
rightmost (Node _ _ r) = rightmost r
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `countLeaves`, the number of `Leaf` constructors in a tree (including those under a `Node`).",
      starter: hs`countLeaves :: Tree a -> Int
countLeaves t = undefined
`,
      tests: [
        { expr: "countLeaves (Leaf :: Tree Int)", expected: "1" },
        { expr: "countLeaves (Node Leaf 1 Leaf)", expected: "2" },
        { expr: "countLeaves t1", expected: "5" },
        { expr: "countLeaves t2", expected: "5" },
      ],
      hint: "A `Leaf` counts as 1. A `Node` is the sum of the counts in both subtrees.",
      solution: hs`countLeaves :: Tree a -> Int
countLeaves Leaf = 1
countLeaves (Node l _ r) = countLeaves l + countLeaves r
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `existsT`, which is True when at least one value in the tree passes a test. `Leaf` is False.",
      starter: hs`existsT :: (a -> Bool) -> Tree a -> Bool
existsT p t = undefined
`,
      tests: [
        { expr: "existsT even t1", expected: "True" },
        { expr: "existsT (< 0) t1", expected: "False" },
        { expr: "existsT even (Leaf :: Tree Int)", expected: "False" },
        { expr: "existsT (== 'c') t2", expected: "True" },
      ],
      hint: "On a `Node`, the value itself may pass, or a value in either subtree.",
      solution: hs`existsT :: (a -> Bool) -> Tree a -> Bool
existsT _ Leaf = False
existsT p (Node l x r) = p x || existsT p l || existsT p r
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `allT`, which is True when every value in the tree passes a test. `Leaf` is True.",
      starter: hs`allT :: (a -> Bool) -> Tree a -> Bool
allT p t = undefined
`,
      tests: [
        { expr: "allT (> 0) t1", expected: "True" },
        { expr: "allT even t1", expected: "False" },
        { expr: "allT even (Leaf :: Tree Int)", expected: "True" },
        { expr: "allT (/= 'z') t2", expected: "True" },
      ],
      hint: "On a `Node` you need the value and both subtrees to pass.",
      solution: hs`allT :: (a -> Bool) -> Tree a -> Bool
allT _ Leaf = True
allT p (Node l x r) = p x && allT p l && allT p r
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `maxTree`, the largest Int in a tree of Ints, or `Nothing` if the tree is empty.",
      starter: hs`maxTree :: Tree Int -> Maybe Int
maxTree t = undefined
`,
      tests: [
        { expr: "maxTree t1", expected: "Just 8" },
        { expr: "maxTree Leaf", expected: "Nothing" },
        { expr: "maxTree (Node Leaf 4 Leaf)", expected: "Just 4" },
        { expr: "maxTree (Node (Node Leaf (-3) Leaf) 0 Leaf)", expected: "Just 0" },
      ],
      hint: "Combine `Just x` with the results from both subtrees using `max` on the `Just` values.",
      solution: hs`maxTree :: Tree Int -> Maybe Int
maxTree Leaf = Nothing
maxTree (Node l x r) = Just (maximum (x : [v | Just v <- [maxTree l, maxTree r]]))
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `doubleTree`, which doubles every Int in a tree and keeps the shape.",
      starter: hs`doubleTree :: Tree Int -> Tree Int
doubleTree t = undefined
`,
      tests: [
        { expr: "doubleTree (Node Leaf 3 Leaf)", expected: "Node Leaf 6 Leaf" },
        { expr: "doubleTree Leaf", expected: "Leaf" },
        { expr: "doubleTree t1", expected: "Node (Node Leaf 4 Leaf) 10 (Node (Node Leaf 12 Leaf) 16 Leaf)" },
        { expr: "doubleTree (Node Leaf 0 (Node Leaf (-2) Leaf))", expected: "Node Leaf 0 (Node Leaf (-4) Leaf)" },
      ],
      hint: "`doubleTree (Node l x r) = Node (doubleTree l) (2 * x) (doubleTree r)`.",
      solution: hs`doubleTree :: Tree Int -> Tree Int
doubleTree Leaf = Leaf
doubleTree (Node l x r) = Node (doubleTree l) (2 * x) (doubleTree r)
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `collect`, which lists every value in the tree, left to right (inorder).",
      starter: hs`collect :: Tree a -> [a]
collect t = undefined
`,
      tests: [
        { expr: "collect t1", expected: "[2, 5, 6, 8]" },
        { expr: "collect (Leaf :: Tree Int)", expected: "[]" },
        { expr: "collect (Node Leaf 1 Leaf)", expected: "[1]" },
        { expr: "collect t2", expected: "\"abcd\"" },
      ],
      hint: "`collect (Node l x r) = collect l ++ [x] ++ collect r`.",
      solution: hs`collect :: Tree a -> [a]
collect Leaf = []
collect (Node l x r) = collect l ++ [x] ++ collect r
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `trimLeaves`, which turns every `Node` whose both children are `Leaf` into a `Leaf`. A deeper tree is trimmed one layer at the fringe.",
      starter: hs`trimLeaves :: Tree a -> Tree a
trimLeaves t = undefined
`,
      tests: [
        { expr: "trimLeaves (Node Leaf 1 Leaf)", expected: "Leaf" },
        { expr: "trimLeaves (Leaf :: Tree Int)", expected: "Leaf" },
        { expr: "trimLeaves t1", expected: "Node Leaf 5 (Node Leaf 8 Leaf)" },
        { expr: "trimLeaves (Node (Node Leaf 1 Leaf) 2 (Node Leaf 3 Leaf))", expected: "Node Leaf 2 Leaf" },
      ],
      hint: "If both children of this node are already `Leaf`, become `Leaf`. Otherwise rebuild with trimmed children. The equation for two `Leaf` children must come first.",
      solution: hs`trimLeaves :: Tree a -> Tree a
trimLeaves Leaf = Leaf
trimLeaves (Node Leaf _ Leaf) = Leaf
trimLeaves (Node l x r) = Node (trimLeaves l) x (trimLeaves r)
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `sameShape`, which is True when two trees have the same shape, ignoring the values stored in the nodes.",
      starter: hs`sameShape :: Tree a -> Tree b -> Bool
sameShape t u = undefined
`,
      tests: [
        { expr: "sameShape t1 t2", expected: "False" },
        { expr: "sameShape (Leaf :: Tree Int) (Leaf :: Tree Char)", expected: "True" },
        { expr: "sameShape (Node Leaf 1 Leaf) (Node Leaf 'a' Leaf)", expected: "True" },
        { expr: "sameShape t1 (Node (Node Leaf 0 Leaf) 0 (Node (Node Leaf 0 Leaf) 0 Leaf))", expected: "True" },
      ],
      hint: "Two `Leaf`s match. Two `Node`s match when both lefts match and both rights match. Mixed constructors do not.",
      solution: hs`sameShape :: Tree a -> Tree b -> Bool
sameShape Leaf Leaf = True
sameShape (Node l _ r) (Node l' _ r') = sameShape l l' && sameShape r r'
sameShape _ _ = False
`,
    },
    {
      k: "write",
      setup: treeSetup + insertCode,
      body: "Write `isBST`, which is True when a tree is a binary search tree: every value in the left subtree is strictly less than the node, every value in the right subtree is strictly greater, and both subtrees are themselves BSTs. `Leaf` is a BST.",
      starter: hs`isBST :: Ord a => Tree a -> Bool
isBST t = undefined
`,
      tests: [
        { expr: "isBST t1", expected: "True" },
        { expr: "isBST (Leaf :: Tree Int)", expected: "True" },
        { expr: "isBST (Node (Node Leaf 5 Leaf) 3 Leaf)", expected: "False" },
        { expr: "isBST (Node Leaf 1 (Node Leaf 1 Leaf))", expected: "False", label: "duplicates are not allowed" },
        { expr: "isBST (insertBST 7 t1)", expected: "True" },
      ],
      hint: "Collect the inorder list and check it is strictly increasing. Or, on each node, check `all (< x)` on the left values and `all (> x)` on the right.",
      solution: hs`isBST :: Ord a => Tree a -> Bool
isBST t = strict (inorder t)
  where
    inorder Leaf = []
    inorder (Node l x r) = inorder l ++ [x] ++ inorder r
    strict (x : y : ys) = x < y && strict (y : ys)
    strict _ = True
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `fromListL`, which builds a tree by repeated left-to-right insertion at the right spine: `fromListL [1,2,3]` is a right spine with 1 at the root. The empty list is `Leaf`.",
      starter: hs`fromListL :: [a] -> Tree a
fromListL xs = undefined
`,
      tests: [
        { expr: "fromListL ([] :: [Int])", expected: "Leaf" },
        { expr: "fromListL [1]", expected: "Node Leaf 1 Leaf" },
        { expr: "fromListL [1, 2]", expected: "Node Leaf 1 (Node Leaf 2 Leaf)" },
        { expr: "fromListL [1, 2, 3]", expected: "Node Leaf 1 (Node Leaf 2 (Node Leaf 3 Leaf))" },
      ],
      hint: "`fromListL [] = Leaf` and `fromListL (x : xs) = Node Leaf x (fromListL xs)`.",
      solution: hs`fromListL :: [a] -> Tree a
fromListL [] = Leaf
fromListL (x : xs) = Node Leaf x (fromListL xs)
`,
    },
    {
      k: "write",
      setup: simpleExprSetup,
      body: "Write `countNums`, which counts how many `Num` leaves an `Expr` has.",
      starter: hs`countNums :: Expr -> Int
countNums e = undefined
`,
      tests: [
        { expr: "countNums (Num 3)", expected: "1" },
        { expr: "countNums (Add (Num 1) (Num 2))", expected: "2" },
        { expr: "countNums (Mul (Add (Num 1) (Num 2)) (Num 3))", expected: "3" },
        { expr: "countNums (Add (Num 0) (Mul (Num 0) (Num 0)))", expected: "3" },
      ],
      hint: "`Num` is 1. `Add` and `Mul` add the counts of their two children.",
      solution: hs`countNums :: Expr -> Int
countNums (Num _) = 1
countNums (Add a b) = countNums a + countNums b
countNums (Mul a b) = countNums a + countNums b
`,
    },
    {
      k: "write",
      setup: simpleExprSetup,
      body: "Write `evalS`, which works out the value of an `Expr` with no variables.",
      starter: hs`evalS :: Expr -> Int
evalS e = undefined
`,
      tests: [
        { expr: "evalS (Num 4)", expected: "4" },
        { expr: "evalS (Add (Num 1) (Num 2))", expected: "3" },
        { expr: "evalS (Mul (Add (Num 2) (Num 3)) (Num 4))", expected: "20" },
        { expr: "evalS (Mul (Num 0) (Num 99))", expected: "0" },
      ],
      hint: "`evalS (Add a b) = evalS a + evalS b`, and the same for `Mul`.",
      solution: hs`evalS :: Expr -> Int
evalS (Num n) = n
evalS (Add a b) = evalS a + evalS b
evalS (Mul a b) = evalS a * evalS b
`,
    },
    {
      k: "write",
      setup: dishSetup,
      body: "Write `totalPrice`, which adds the prices of a list of dishes.",
      starter: hs`totalPrice :: [Dish] -> Int
totalPrice ds = undefined
`,
      tests: [
        { expr: `totalPrice [("soup", 300), ("cake", 250)]`, expected: "550" },
        { expr: "totalPrice []", expected: "0" },
        { expr: `totalPrice [("tea", 0)]`, expected: "0" },
        { expr: `totalPrice [("a", 1), ("b", 1), ("c", 1)]`, expected: "3" },
      ],
      hint: "Add `p` from each `(name, p)` pair.",
      solution: hs`totalPrice :: [Dish] -> Int
totalPrice [] = 0
totalPrice ((_, p) : rest) = p + totalPrice rest
`,
    },
    {
      k: "write",
      setup: itemSetup,
      body: "Write `isDrink`, which is True only for a `Drink`.",
      starter: hs`isDrink :: Item -> Bool
isDrink item = undefined
`,
      tests: [
        { expr: `isDrink (Drink "cola" 150 330)`, expected: "True" },
        { expr: `isDrink (Starter "soup" 300)`, expected: "False" },
        { expr: `isDrink (Main "pie" 900 True)`, expected: "False" },
        { expr: `isDrink (Drink "water" 0 500)`, expected: "True" },
      ],
      hint: "`isDrink (Drink _ _ _) = True` and `isDrink _ = False`.",
      solution: hs`isDrink :: Item -> Bool
isDrink (Drink _ _ _) = True
isDrink _ = False
`,
    },
    {
      k: "write",
      setup: familySetup,
      body: "Write `nameOf`, which returns the person's name, or `Nothing` for `Unknown`.",
      starter: hs`nameOf :: Family -> Maybe String
nameOf f = undefined
`,
      tests: [
        { expr: "nameOf ann", expected: `Just "Ann"` },
        { expr: "nameOf Unknown", expected: "Nothing" },
        { expr: `nameOf (Person "X" Unknown Unknown)`, expected: `Just "X"` },
        { expr: "nameOf (case ann of Person _ m _ -> m; Unknown -> Unknown)", expected: `Just "Beth"` },
      ],
      hint: "One equation for `Unknown`, one for `Person`.",
      solution: hs`nameOf :: Family -> Maybe String
nameOf Unknown = Nothing
nameOf (Person n _ _) = Just n
`,
    },
    {
      k: "write",
      setup: familySetup,
      body: "Write `knownPeople`, which lists every name in a family tree, parents after the person (preorder: name, then mother, then father).",
      starter: hs`knownPeople :: Family -> [String]
knownPeople f = undefined
`,
      tests: [
        { expr: "knownPeople Unknown", expected: "[]" },
        { expr: `knownPeople (Person "X" Unknown Unknown)`, expected: `["X"]` },
        { expr: "knownPeople ann", expected: `["Ann", "Beth", "Cara", "Dan", "Eve", "Fred"]` },
        { expr: `knownPeople (Person "A" (Person "B" Unknown Unknown) Unknown)`, expected: `["A", "B"]` },
      ],
      hint: "`knownPeople (Person n m f) = n : knownPeople m ++ knownPeople f`.",
      solution: hs`knownPeople :: Family -> [String]
knownPeople Unknown = []
knownPeople (Person n m f) = n : knownPeople m ++ knownPeople f
`,
    },
    {
      k: "write",
      setup: decisionSetup,
      body: "Write `questions`, which lists every question string in a `Decision` tree, root first then yes-branch then no-branch. `Answer` contributes nothing.",
      starter: hs`questions :: Decision -> [String]
questions d = undefined
`,
      tests: [
        { expr: "questions animals", expected: `["Does it fly?", "Is it a bird?", "Does it swim?"]` },
        { expr: `questions (Answer "x")`, expected: "[]" },
        { expr: `questions (Ask "q" (Answer "a") (Answer "b"))`, expected: `["q"]` },
        { expr: `questions (Ask "q" (Ask "y" (Answer "1") (Answer "2")) (Answer "n"))`, expected: `["q", "y"]` },
      ],
      hint: "`questions (Ask q y n) = q : questions y ++ questions n`.",
      solution: hs`questions :: Decision -> [String]
questions (Answer _) = []
questions (Ask q y n) = q : questions y ++ questions n
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `zipTree`, which pairs values at matching positions. If the shapes differ, keep only the overlapping shape (stop at the first `Leaf` on either side).",
      starter: hs`zipTree :: Tree a -> Tree b -> Tree (a, b)
zipTree t u = undefined
`,
      tests: [
        { expr: "zipTree (Node Leaf 1 Leaf) (Node Leaf 'a' Leaf)", expected: "Node Leaf (1, 'a') Leaf" },
        { expr: "zipTree (Leaf :: Tree Int) t1", expected: "Leaf" },
        { expr: "zipTree t1 (Node Leaf 0 Leaf)", expected: "Node Leaf (5, 0) Leaf" },
        { expr: "zipTree (Node (Node Leaf 1 Leaf) 2 Leaf) (Node Leaf 9 (Node Leaf 8 Leaf))", expected: "Node Leaf (2, 9) Leaf" },
      ],
      hint: "If either tree is `Leaf`, the answer is `Leaf`. Otherwise pair the two values and zip both sides.",
      solution: hs`zipTree :: Tree a -> Tree b -> Tree (a, b)
zipTree (Node l x r) (Node l' y r') = Node (zipTree l l') (x, y) (zipTree r r')
zipTree _ _ = Leaf
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `levelCount`, which returns how many values sit at a given depth. The root is depth 0. A negative depth has count 0.",
      starter: hs`levelCount :: Int -> Tree a -> Int
levelCount n t = undefined
`,
      tests: [
        { expr: "levelCount 0 t1", expected: "1" },
        { expr: "levelCount 1 t1", expected: "2" },
        { expr: "levelCount 2 t1", expected: "1" },
        { expr: "levelCount 0 (Leaf :: Tree Int)", expected: "0" },
        { expr: "levelCount (-1) t1", expected: "0" },
      ],
      hint: "If `n == 0` and you have a `Node`, count 1. If `n > 0`, add the counts at `n - 1` in both subtrees.",
      solution: hs`levelCount :: Int -> Tree a -> Int
levelCount n (Node l _ r)
  | n == 0    = 1
  | n > 0     = levelCount (n - 1) l + levelCount (n - 1) r
  | otherwise = 0
levelCount _ Leaf = 0
`,
    },
    {
      k: "write",
      setup: simpleExprSetup,
      body: "Write `swapAdd`, which swaps the two children of every `Add` (and recursively of `Mul` too). `Num` is unchanged.",
      starter: hs`swapAdd :: Expr -> Expr
swapAdd e = undefined
`,
      tests: [
        { expr: "swapAdd (Add (Num 1) (Num 2))", expected: "Add (Num 2) (Num 1)" },
        { expr: "swapAdd (Num 3)", expected: "Num 3" },
        { expr: "swapAdd (Mul (Add (Num 1) (Num 2)) (Num 3))", expected: "Mul (Add (Num 2) (Num 1)) (Num 3)" },
        { expr: "swapAdd (Add (Add (Num 1) (Num 2)) (Num 3))", expected: "Add (Num 3) (Add (Num 2) (Num 1))" },
      ],
      hint: "Walk both constructors. Only `Add` swaps after the recursive calls.",
      solution: hs`swapAdd :: Expr -> Expr
swapAdd (Num n) = Num n
swapAdd (Add a b) = Add (swapAdd b) (swapAdd a)
swapAdd (Mul a b) = Mul (swapAdd a) (swapAdd b)
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: "Write `grow`, which replaces every `Leaf` by `Node Leaf x Leaf` for a given value `x`, so the tree gets a new fringe of `x`s.",
      starter: hs`grow :: a -> Tree a -> Tree a
grow x t = undefined
`,
      tests: [
        { expr: "grow 0 (Leaf :: Tree Int)", expected: "Node Leaf 0 Leaf" },
        { expr: "grow 0 (Node Leaf 1 Leaf)", expected: "Node (Node Leaf 0 Leaf) 1 (Node Leaf 0 Leaf)" },
        { expr: "grow 9 t1", expected: "Node (Node (Node Leaf 9 Leaf) 2 (Node Leaf 9 Leaf)) 5 (Node (Node (Node Leaf 9 Leaf) 6 (Node Leaf 9 Leaf)) 8 (Node Leaf 9 Leaf))" },
        { expr: "grow 'z' (Node Leaf 'a' Leaf)", expected: "Node (Node Leaf 'z' Leaf) 'a' (Node Leaf 'z' Leaf)" },
      ],
      hint: "`grow x Leaf = Node Leaf x Leaf`. On a `Node`, grow both children.",
      solution: hs`grow :: a -> Tree a -> Tree a
grow x Leaf = Node Leaf x Leaf
grow x (Node l y r) = Node (grow x l) y (grow x r)
`,
    },
    {
      k: "quiz",
      q: "You are writing `size` on `data Tree a = Leaf | Node (Tree a) a (Tree a)`. Which base case is right?",
      options: [
        "`size Leaf = 0`",
        "`size Leaf = 1`",
        "`size Leaf = Leaf`",
        "There is no base case: every tree has a `Node`",
      ],
      answer: 0,
      why: "`Leaf` is the empty tree, so it has no nodes. Forgetting this case is the usual non-exhaustive-patterns crash.",
    },
    {
      k: "predict",
      body: md(
        "With `depth Leaf = 0` and `depth (Node l _ r) = 1 + max (depth l) (depth r)`, here is `depth (Node Leaf 2 (Node Leaf 1 Leaf))` part-way through unfolding.",
        "",
        "What is it?",
      ),
      expr: "1 + max 0 (1 + max 0 0)",
      answer: "2",
      why: "The right child has depth 1. The root is one more, so the tree has depth 2. Mirroring would swap the sides but keep this depth.",
    },
    {
      k: "write",
      setup: circuitSetup,
      body: md(
        "Define a function `fanIn :: Circuit -> Int` that returns how many `And` and `Or` gates a circuit has (not `Not`, not `Input`). For example:",
        "",
        "```",
        "*Main> fanIn halfSum",
        "3",
        "*Main> fanIn (Input \"x\")",
        "0",
        "*Main> fanIn (Not (Input \"x\"))",
        "0",
        "```",
      ),
      starter: hs`fanIn :: Circuit -> Int
fanIn c = undefined
`,
      tests: [
        { expr: "fanIn halfSum", expected: "3" },
        { expr: `fanIn (Input "x")`, expected: "0" },
        { expr: `fanIn (Not (Input "x"))`, expected: "0" },
        { expr: "fanIn c2", expected: "2" },
      ],
      hint: "`And` and `Or` count as 1 plus both sides. `Not` just recurses. `Input` is 0.",
      solution: hs`fanIn :: Circuit -> Int
fanIn (Input _) = 0
fanIn (Not a) = fanIn a
fanIn (And a b) = 1 + fanIn a + fanIn b
fanIn (Or a b) = 1 + fanIn a + fanIn b
`,
    },
    {
      k: "write",
      setup: familySetup,
      body: md(
        "A family tree is",
        "",
        "```",
        "data Family = Unknown | Person String Family Family",
        "-- Person name mother father",
        "```",
        "",
        "Define a function `mothersName :: Family -> Maybe String` that returns the mother's name, or `Nothing` if the person or the mother is `Unknown`. For example:",
        "",
        "```",
        "*Main> mothersName ann",
        "Just \"Beth\"",
        "*Main> mothersName Unknown",
        "Nothing",
        "```",
      ),
      starter: hs`mothersName :: Family -> Maybe String
mothersName f = undefined
`,
      tests: [
        { expr: "mothersName ann", expected: `Just "Beth"` },
        { expr: "mothersName Unknown", expected: "Nothing" },
        { expr: `mothersName (Person "X" Unknown Unknown)`, expected: "Nothing" },
        { expr: "mothersName (case ann of Person _ m _ -> m; Unknown -> Unknown)", expected: `Just "Cara"` },
      ],
      hint: "You need a `Person` whose mother is also a `Person`. Nested patterns work: `Person _ (Person n _ _) _`.",
      solution: hs`mothersName :: Family -> Maybe String
mothersName (Person _ (Person n _ _) _) = Just n
mothersName _ = Nothing
`,
    },
    {
      k: "write",
      setup: decisionSetup,
      body: md(
        "Define a function `answerCount :: Decision -> Int` that returns how many `Answer` leaves a decision tree has. For example:",
        "",
        "```",
        "*Main> answerCount animals",
        "4",
        "*Main> answerCount (Answer \"x\")",
        "1",
        "```",
      ),
      starter: hs`answerCount :: Decision -> Int
answerCount d = undefined
`,
      tests: [
        { expr: "answerCount animals", expected: "4" },
        { expr: `answerCount (Answer "x")`, expected: "1" },
        { expr: `answerCount (Ask "q" (Answer "a") (Answer "b"))`, expected: "2" },
        { expr: `answerCount (Ask "q" (Ask "y" (Answer "1") (Answer "2")) (Answer "n"))`, expected: "3" },
      ],
      hint: "An `Answer` is 1. An `Ask` adds the two branches.",
      solution: hs`answerCount :: Decision -> Int
answerCount (Answer _) = 1
answerCount (Ask _ y n) = answerCount y + answerCount n
`,
    },
    {
      k: "write",
      setup: mapSetup,
      body: md(
        "A search tree of stock is",
        "",
        "```",
        "data Map = Tip | Bin Map String Int Map",
        "```",
        "",
        "Define a function `sizeM :: Map -> Int` that returns how many keys are stored. For example:",
        "",
        "```",
        "*Main> sizeM stock",
        "4",
        "*Main> sizeM Tip",
        "0",
        "```",
      ),
      starter: hs`sizeM :: Map -> Int
sizeM m = undefined
`,
      tests: [
        { expr: "sizeM stock", expected: "4" },
        { expr: "sizeM Tip", expected: "0" },
        { expr: `sizeM (Bin Tip "a" 1 Tip)`, expected: "1" },
        { expr: `sizeM (Bin (Bin Tip "a" 1 Tip) "b" 2 Tip)`, expected: "2" },
      ],
      hint: "`Tip` is 0. A `Bin` is 1 plus both sides.",
      solution: hs`sizeM :: Map -> Int
sizeM Tip = 0
sizeM (Bin l _ _ r) = sizeM l + 1 + sizeM r
`,
    },
    {
      k: "write",
      setup: codeSetup,
      body: md(
        "A Huffman-style code tree is",
        "",
        "```",
        "data Code = Sym Char | Split Code Code",
        "```",
        "",
        "Define a function `codeDepth :: Code -> Int` that returns the length of the longest path from the root to a `Sym` (that path's number of `Split`s). For example:",
        "",
        "```",
        "*Main> codeDepth code1",
        "3",
        "*Main> codeDepth (Sym 'e')",
        "0",
        "```",
      ),
      starter: hs`codeDepth :: Code -> Int
codeDepth c = undefined
`,
      tests: [
        { expr: "codeDepth code1", expected: "3" },
        { expr: "codeDepth (Sym 'e')", expected: "0" },
        { expr: "codeDepth (Split (Sym 'a') (Sym 'b'))", expected: "1" },
        { expr: "codeDepth (Split (Sym 'a') (Split (Sym 'b') (Sym 'c')))", expected: "2" },
      ],
      hint: "A `Sym` has depth 0. A `Split` is 1 plus the maximum of the two children.",
      solution: hs`codeDepth :: Code -> Int
codeDepth (Sym _) = 0
codeDepth (Split a b) = 1 + max (codeDepth a) (codeDepth b)
`,
    },
    {
      k: "write",
      setup: bracketSetup,
      body: md(
        "A knockout bracket is",
        "",
        "```",
        "data Bracket = Entrant String Rating | Match Bracket Bracket",
        "```",
        "",
        "Define a function `matchCount :: Bracket -> Int` that returns how many `Match` nodes there are. For example:",
        "",
        "```",
        "*Main> matchCount cup",
        "4",
        "*Main> matchCount (Entrant \"Ada\" 1800)",
        "0",
        "```",
      ),
      starter: hs`matchCount :: Bracket -> Int
matchCount b = undefined
`,
      tests: [
        { expr: "matchCount cup", expected: "4" },
        { expr: `matchCount (Entrant "Ada" 1800)`, expected: "0" },
        { expr: `matchCount (Match (Entrant "A" 1) (Entrant "B" 2))`, expected: "1" },
        { expr: `matchCount (Match (Match (Entrant "A" 1) (Entrant "B" 2)) (Entrant "C" 3))`, expected: "2" },
      ],
      hint: "An `Entrant` is 0. A `Match` is 1 plus both sides.",
      solution: hs`matchCount :: Bracket -> Int
matchCount (Entrant _ _) = 0
matchCount (Match a b) = 1 + matchCount a + matchCount b
`,
    },
    {
      k: "write",
      setup: exprSetup,
      body: md(
        "Using the given `Expr` type (numbers, variables, add, mul, and `Neg`), define `countNegs :: Expr -> Int` that counts how many `Neg` nodes there are. For example:",
        "",
        "```",
        "*Main> countNegs e2",
        "1",
        "*Main> countNegs e1",
        "0",
        "*Main> countNegs (Neg (Neg (Num 1)))",
        "2",
        "```",
      ),
      starter: hs`countNegs :: Expr -> Int
countNegs e = undefined
`,
      tests: [
        { expr: "countNegs e2", expected: "1" },
        { expr: "countNegs e1", expected: "0" },
        { expr: "countNegs (Neg (Neg (Num 1)))", expected: "2" },
        { expr: "countNegs (Num 3)", expected: "0" },
        { expr: "countNegs (Add (Neg (Var \"x\")) (Neg (Num 1)))", expected: "2" },
      ],
      hint: "`Neg e` is 1 plus the count inside `e`. The other constructors just add their children.",
      solution: hs`countNegs :: Expr -> Int
countNegs (Num _) = 0
countNegs (Var _) = 0
countNegs (Add a b) = countNegs a + countNegs b
countNegs (Mul a b) = countNegs a + countNegs b
countNegs (Neg e) = 1 + countNegs e
`,
    },
    {
      k: "write",
      setup: letSetup,
      body: md(
        "Using the given `Expr` with `Let`, define `letCount :: Expr -> Int` that counts how many `Let` nodes there are. For example:",
        "",
        "```",
        "*Main> letCount ex1",
        "1",
        "*Main> letCount ex2",
        "2",
        "*Main> letCount (Val 3)",
        "0",
        "```",
      ),
      starter: hs`letCount :: Expr -> Int
letCount e = undefined
`,
      tests: [
        { expr: "letCount ex1", expected: "1" },
        { expr: "letCount ex2", expected: "2" },
        { expr: "letCount (Val 3)", expected: "0" },
        { expr: `letCount (Bin Plus (Val 1) (Val 2))`, expected: "0" },
        { expr: `letCount (Let "x" (Let "y" (Val 1) (Val 2)) (Var "x"))`, expected: "2" },
      ],
      hint: "`Let` is 1 plus the counts in the definition and the body. `Bin` adds both sides. `Val` and `Var` are 0.",
      solution: hs`letCount :: Expr -> Int
letCount (Val _) = 0
letCount (Var _) = 0
letCount (Bin _ a b) = letCount a + letCount b
letCount (Let _ d b) = 1 + letCount d + letCount b
`,
    },
    {
      k: "write",
      setup: treeSetup,
      body: md(
        "Define a function `pathsToLeaves :: Tree a -> [[a]]` that returns the path from the root to every `Leaf`, as the list of node values along that path. A `Leaf` on its own has one empty path. For example:",
        "",
        "```",
        "*Main> pathsToLeaves (Node (Node Leaf 1 Leaf) 2 Leaf)",
        "[[2,1],[2,1],[2]]",
        "*Main> pathsToLeaves Leaf",
        "[[]]",
        "```",
        "",
        "Each `Node` has two children, so a node with two `Leaf` children contributes two copies of the same path.",
      ),
      starter: hs`pathsToLeaves :: Tree a -> [[a]]
pathsToLeaves t = undefined
`,
      tests: [
        { expr: "pathsToLeaves (Leaf :: Tree Int)", expected: "[[]]" },
        { expr: "pathsToLeaves (Node Leaf 1 Leaf)", expected: "[[1], [1]]" },
        { expr: "pathsToLeaves (Node (Node Leaf 1 Leaf) 2 Leaf)", expected: "[[2, 1], [2, 1], [2]]" },
        { expr: "pathsToLeaves t1", expected: "[[5, 2], [5, 2], [5, 8, 6], [5, 8, 6], [5, 8]]" },
      ],
      hint: "For a `Node`, put `x` on the front of every path from both children. For `Leaf`, return `[[]]`.",
      solution: hs`pathsToLeaves :: Tree a -> [[a]]
pathsToLeaves Leaf = [[]]
pathsToLeaves (Node l x r) = [x : p | p <- pathsToLeaves l ++ pathsToLeaves r]
`,
    },
    {
      k: "write",
      setup: circuitSetup + circuitGiven,
      body: md(
        "The given code already contains `evalC` and `inputs`.",
        "",
        "Define a function `alwaysTrue :: Circuit -> Bool` that is True when the circuit evaluates to True under every assignment of its inputs. A circuit with no inputs is True only if `evalC []` of it is True. For example:",
        "",
        "```",
        "*Main> alwaysTrue (Or (Input \"p\") (Not (Input \"p\")))",
        "True",
        "*Main> alwaysTrue (Input \"p\")",
        "False",
        "*Main> alwaysTrue (And (Input \"p\") (Not (Input \"p\")))",
        "False",
        "```",
      ),
      starter: hs`alwaysTrue :: Circuit -> Bool
alwaysTrue c = undefined
`,
      tests: [
        { expr: `alwaysTrue (Or (Input "p") (Not (Input "p")))`, expected: "True" },
        { expr: `alwaysTrue (Input "p")`, expected: "False" },
        { expr: `alwaysTrue (And (Input "p") (Not (Input "p")))`, expected: "False" },
        { expr: `alwaysTrue (Not (And (Input "p") (Not (Input "p"))))`, expected: "True" },
        { expr: "alwaysTrue halfSum", expected: "False" },
      ],
      hint: "List every assignment of the inputs (True/False for each name from inputs), then check that evalC is True for all of them.",
      solution: hs`alwaysTrue :: Circuit -> Bool
alwaysTrue c = all (\env -> evalC env c) (assigns (inputs c))
  where
    assigns [] = [[]]
    assigns (x : xs) = [ (x, b) : rest | b <- [False, True], rest <- assigns xs ]
`,
    },
  ],
};

export const book: Book = {
  id: "b-trees",
  order: 5,
  title: "Data types and tree recursion",
  blurb: "Data declarations, binary trees, search trees and expression trees, one equation per constructor.",
  sets: [level1, level2, level3, level4, extra],
};
