import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "m04",
  year: 0,
  difficulty: 4,
  minutes: 45,
  title: "Mini paper 4: Shop inventory and orders",
  summary:
    "Keep a corner shop's stock table up to date: look up stock levels, check and apply orders (which can fail), take deliveries, and rank the best-selling items.",
  skills: [
    "lookup tables with a default",
    "all with a lambda",
    "Maybe as a result (Just / Nothing)",
    "updating one entry of a table",
    "foldl to apply a list of changes",
    "nub and sum to total by key",
    "sortOn with a tuple key for tie-breaks",
  ],
  story: md(
    "This paper is about a small shop that keeps track of what it has on its shelves. It uses the most common structure in the lab tests: a **lookup table**, a list of `(key, value)` pairs.",
    "",
    "**Stock.** The shop's stock is a table saying how many of each item it has:",
    "",
    "```",
    "item     quantity",
    "apple       10",
    "bread        4",
    "cheese       0",
    "milk         6",
    "```",
    "",
    "Each item appears at most once. An item that isn't in the table at all counts as 0 in stock (the shop simply doesn't have any).",
    "",
    "**Orders.** A customer's order is also a table: which items they want and how many of each, for example 3 apples and 2 milk. Each item appears at most once in an order and every quantity is at least 1. An order can be **fulfilled** only if the shop has enough of *every* item in it. If it can, the shop hands over the goods and the quantities are subtracted from its stock. If it can't (even for one item), the whole order is refused and nothing changes.",
    "",
    "**Deliveries.** When a delivery arrives, its quantities are added to the stock. A delivery can include an item the shop has never stocked before; that item gets a new entry in the table.",
    "",
    "**Best sellers.** At the end of the week the manager wants to know which items sold most, given the list of all the orders that were fulfilled.",
    "",
    "### The given types",
    "",
    "```haskell",
    "type Item  = String",
    "type Stock = [(Item, Int)]",
    "type Order = [(Item, Int)]",
    "```",
    "",
    "- `Stock` and `Order` have exactly the same shape, a list of `(item, quantity)` pairs. They are given different names only to make the signatures easier to read. A delivery is also just a list of `(item, quantity)` pairs.",
    "- Some functions return a `Maybe Stock`. `Maybe` is how Haskell says \"this might fail\": the answer is either `Just s` (it worked, and here's the new stock `s`) or `Nothing` (it failed).",
    "",
    "You are given the example stock `shop`, two example orders `order1` (can be fulfilled) and `order2` (can't), and `week`, the list of orders fulfilled this week. `Data.List` and `Data.Maybe` are imported for you.",
  ),
  notes: md(
    "**Where the marks are (12 total).** `stockOf`, `canFulfil` and `restock` are 2 marks each; `applyOrder` and `bestSellers` are 3 each.",
    "",
    "**Order of attack.** In order. `stockOf` is used by `canFulfil`, and `canFulfil` is used by `applyOrder`. `restock` and `bestSellers` don't depend on the others, so you can do them in any order.",
    "",
    "**Strategy.**",
    "",
    "- Reuse your earlier functions: past papers are designed so that later questions get shorter if you do.",
    "- To change one entry of a table, rebuild the whole table with a list comprehension that changes only the matching entry: `[(k, if k == key then f v else v) | (k, v) <- table]`.",
    "- To apply a whole list of changes one by one, use `foldl`: `foldl step start changes` starts with `start` and applies `step` with each change in turn.",
    "",
    "**Traps.**",
    "",
    "- An item with 0 in stock stays in the table after an order; don't delete it.",
    "- `applyOrder` must check the *whole* order before changing anything.",
    "- `bestSellers` sorts by quantity, **biggest first**, and breaks ties alphabetically. `sortOn (\\(i, n) -> (negate n, i))` does both at once: tuples are compared by their first component, then by their second.",
  ),
  setup: hs`import Data.List
import Data.Maybe

type Item = String

type Stock = [(Item, Int)]

type Order = [(Item, Int)]

--------------------------------------------------------------
-- Example data

shop :: Stock
shop = [("apple", 10), ("bread", 4), ("cheese", 0), ("milk", 6)]

order1 :: Order
order1 = [("apple", 3), ("milk", 2)]

order2 :: Order
order2 = [("milk", 1), ("bread", 5)]

week :: [Order]
week
  = [[("apple", 3), ("milk", 2)],
     [("bread", 1), ("apple", 2)],
     [("milk", 4)],
     [("bread", 2), ("cheese", 1)],
     [("apple", 1)]]
`,
  starter: hs`--------------------------------------------------------------
-- Part I

stockOf :: Item -> Stock -> Int
stockOf = undefined

canFulfil :: Order -> Stock -> Bool
canFulfil = undefined

applyOrder :: Order -> Stock -> Maybe Stock
applyOrder = undefined

restock :: [(Item, Int)] -> Stock -> Stock
restock = undefined

bestSellers :: [Order] -> [(Item, Int)]
bestSellers = undefined
`,
  tasks: [
    {
      id: "stockOf",
      name: "stockOf",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `stockOf :: Item -> Stock -> Int` that returns how many of the given item the shop has. An item that isn't in the stock table has 0. For example:",
        "",
        "```",
        "ghci> stockOf \"apple\" shop",
        "10",
        "ghci> stockOf \"cheese\" shop",
        "0",
        "ghci> stockOf \"eggs\" shop",
        "0",
        "```",
      ),
      hints: [
        "This is a lookup with a default value.",
        "`lookup item s` gives `Just n` if the item is in the table and `Nothing` if not.",
        "`fromMaybe 0` turns `Just n` into `n` and `Nothing` into `0`.",
        "`stockOf item s = fromMaybe 0 (lookup item s)`.",
      ],
      solution: hs`stockOf :: Item -> Stock -> Int
stockOf item s = fromMaybe 0 (lookup item s)`,
      tests: [
        { expr: 'stockOf "apple" shop', expected: "10" },
        { expr: 'stockOf "cheese" shop', expected: "0" },
        { expr: 'stockOf "eggs" shop', expected: "0" },
        { expr: 'stockOf "milk" shop', expected: "6" },
        { expr: 'stockOf "milk" []', expected: "0" },
        { expr: 'map (\\i -> stockOf i shop) ["bread","apple","tea"]', expected: "[4,10,0]" },
      ],
    },
    {
      id: "canFulfil",
      name: "canFulfil",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `canFulfil :: Order -> Stock -> Bool` that returns `True` if the shop has at least the ordered quantity of **every** item in the order, and `False` otherwise. The empty order can always be fulfilled. For example:",
        "",
        "```",
        "ghci> canFulfil order1 shop",
        "True",
        "ghci> canFulfil order2 shop",
        "False",
        "ghci> canFulfil [(\"eggs\", 1)] shop",
        "False",
        "ghci> canFulfil [(\"bread\", 4)] shop",
        "True",
        "```",
      ),
      hints: [
        "Check a condition on every pair of the order. The Prelude function `all p xs` is `True` when `p` holds for every element of `xs`.",
        "The condition for one pair `(item, n)` is: the shop has at least `n` of `item`. Use your `stockOf`.",
        "Write the condition as a lambda that pattern matches the pair: `\\(item, n) -> stockOf item s >= n`.",
        "`canFulfil order s = all (\\(item, n) -> stockOf item s >= n) order`.",
      ],
      solution: hs`canFulfil :: Order -> Stock -> Bool
canFulfil order s = all (\(item, n) -> stockOf item s >= n) order`,
      tests: [
        { expr: "canFulfil order1 shop", expected: "True" },
        { expr: "canFulfil order2 shop", expected: "False" },
        { expr: 'canFulfil [("eggs", 1)] shop', expected: "False" },
        { expr: 'canFulfil [("bread", 4)] shop', expected: "True", label: "exactly enough is enough" },
        { expr: "canFulfil [] shop", expected: "True" },
        { expr: 'canFulfil [("cheese", 1)] shop', expected: "False" },
        { expr: 'canFulfil [("apple", 10), ("milk", 6), ("bread", 4)] shop', expected: "True" },
        { expr: 'canFulfil [("apple", 1), ("milk", 7)] shop', expected: "False", label: "one item short is enough to refuse" },
      ],
    },
    {
      id: "applyOrder",
      name: "applyOrder",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define a function `applyOrder :: Order -> Stock -> Maybe Stock`. If the order can be fulfilled, the result is `Just` the new stock, where each ordered quantity has been subtracted from that item's entry. Items keep their order in the table and items that reach 0 stay in the table. If the order can't be fulfilled, the result is `Nothing`. For example:",
        "",
        "```",
        "ghci> applyOrder order1 shop",
        "Just [(\"apple\",7),(\"bread\",4),(\"cheese\",0),(\"milk\",4)]",
        "ghci> applyOrder order2 shop",
        "Nothing",
        "ghci> applyOrder [(\"bread\", 4)] shop",
        "Just [(\"apple\",10),(\"bread\",0),(\"cheese\",0),(\"milk\",6)]",
        "```",
      ),
      hints: [
        "First decide whether the order can be fulfilled (you already wrote `canFulfil`). Use two guards: one returning `Nothing`, one returning `Just` the new stock.",
        "To build the new stock, go through the *stock* (not the order) and subtract from each entry however many of that item were ordered.",
        "How many of item `i` were ordered? Look it up in the order, with default 0 for items that weren't ordered: `fromMaybe 0 (lookup i order)`.",
        md(
          "```",
          "applyOrder order s",
          "  | canFulfil order s = Just [(i, n - ordered i) | (i, n) <- s]",
          "  | otherwise         = Nothing",
          "  where",
          "    ordered i = fromMaybe 0 (lookup i order)",
          "```",
        ),
      ],
      solution: hs`applyOrder :: Order -> Stock -> Maybe Stock
applyOrder order s
  | canFulfil order s = Just [(i, n - ordered i) | (i, n) <- s]
  | otherwise = Nothing
  where
    ordered i = fromMaybe 0 (lookup i order)`,
      tests: [
        { expr: "applyOrder order1 shop", expected: 'Just [("apple",7),("bread",4),("cheese",0),("milk",4)]' },
        { expr: "applyOrder order2 shop", expected: "Nothing" },
        { expr: 'applyOrder [("bread", 4)] shop', expected: 'Just [("apple",10),("bread",0),("cheese",0),("milk",6)]' },
        { expr: "applyOrder [] shop", expected: "Just shop" },
        { expr: 'applyOrder [("eggs", 2)] shop', expected: "Nothing" },
        { expr: 'applyOrder [("milk", 6), ("apple", 10)] shop', expected: 'Just [("apple",0),("bread",4),("cheese",0),("milk",0)]' },
        { expr: "applyOrder order1 shop >>= applyOrder order1", expected: 'Just [("apple",4),("bread",4),("cheese",0),("milk",2)]', label: "applying order1 twice" },
        { expr: 'applyOrder [("milk", 3)] [("milk", 2)]', expected: "Nothing" },
      ],
    },
    {
      id: "restock",
      name: "restock",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `restock :: [(Item, Int)] -> Stock -> Stock` that adds a delivery to the stock. For each `(item, n)` in the delivery: if the item is already in the stock, add `n` to its quantity; otherwise add a new entry `(item, n)`. Each item must still appear only once in the result. For example:",
        "",
        "```",
        "ghci> restock [(\"cheese\", 5), (\"eggs\", 12)] shop",
        "[(\"apple\",10),(\"bread\",4),(\"cheese\",5),(\"milk\",6),(\"eggs\",12)]",
        "ghci> restock [] shop == shop",
        "True",
        "ghci> restock [(\"tea\", 2), (\"tea\", 3)] []",
        "[(\"tea\",5)]",
        "```",
        "",
        "The order of the entries in the result doesn't matter.",
      ),
      hints: [
        "First write a helper `addOne :: Stock -> (Item, Int) -> Stock` that adds a single delivered item. Then apply it once for each item in the delivery.",
        "In `addOne s (i, n)`: if `i` is one of the items in `s` (`elem i (map fst s)`), rebuild `s` adding `n` to just that entry; otherwise put `(i, n)` on the end.",
        "To apply `addOne` with every delivered pair in turn, starting from the old stock, use `foldl addOne stock delivery`.",
        md(
          "```",
          "restock delivery stock = foldl addOne stock delivery",
          "  where",
          "    addOne s (i, n)",
          "      | elem i (map fst s) = [(j, if j == i then m + n else m) | (j, m) <- s]",
          "      | otherwise          = s ++ [(i, n)]",
          "```",
        ),
      ],
      solution: hs`restock :: [(Item, Int)] -> Stock -> Stock
restock delivery stock = foldl addOne stock delivery
  where
    addOne s (i, n)
      | elem i (map fst s) = [(j, if j == i then m + n else m) | (j, m) <- s]
      | otherwise = s ++ [(i, n)]`,
      tests: [
        {
          expr: 'restock [("cheese", 5), ("eggs", 12)] shop',
          expected: '[("apple",10),("bread",4),("cheese",5),("milk",6),("eggs",12)]',
          unordered: true,
        },
        { expr: "restock [] shop", expected: "shop", unordered: true },
        { expr: 'restock [("tea", 2), ("tea", 3)] []', expected: '[("tea",5)]' },
        { expr: 'restock [("apple", 1), ("apple", 1)] shop', expected: '[("apple",12),("bread",4),("cheese",0),("milk",6)]', unordered: true },
        { expr: 'restock [("eggs", 6)] []', expected: '[("eggs",6)]' },
        { expr: 'length (restock [("eggs", 6), ("milk", 1), ("eggs", 6)] shop)', expected: "5", label: "no item appears twice" },
        { expr: 'stockOf "eggs" (restock [("eggs", 6), ("milk", 1), ("eggs", 6)] shop)', expected: "12" },
      ],
    },
    {
      id: "bestSellers",
      name: "bestSellers",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define a function `bestSellers :: [Order] -> [(Item, Int)]` that, given all the orders fulfilled in a period, returns each item that was ordered at least once together with the total quantity sold. The list is sorted by quantity, **largest first**; items with the same quantity are listed in alphabetical order. For example:",
        "",
        "```",
        "ghci> bestSellers week",
        "[(\"apple\",6),(\"milk\",6),(\"bread\",3),(\"cheese\",1)]",
        "ghci> bestSellers [[(\"tea\",1)],[(\"jam\",1),(\"tea\",1)]]",
        "[(\"tea\",2),(\"jam\",1)]",
        "ghci> bestSellers []",
        "[]",
        "```",
      ),
      hints: [
        "Two steps: first build a table of totals (one entry per item), then sort it.",
        "The items are `nub [i | o <- orders, (i, _) <- o]`. The total for item `i` is `sum [n | o <- orders, (j, n) <- o, j == i]`.",
        "To sort biggest-first with alphabetical tie-break, sort on the key `(negate n, i)`: `sortOn (\\(i, n) -> (negate n, i)) totals`. Negating flips the order of the numbers, and the item name only matters when the numbers are equal.",
        md(
          "```",
          "bestSellers orders = sortOn (\\(i, n) -> (negate n, i)) totals",
          "  where",
          "    items  = nub [i | o <- orders, (i, _) <- o]",
          "    totals = [(i, sum [n | o <- orders, (j, n) <- o, j == i]) | i <- items]",
          "```",
        ),
      ],
      solution: hs`bestSellers :: [Order] -> [(Item, Int)]
bestSellers orders = sortOn (\(i, n) -> (negate n, i)) totals
  where
    items = nub [i | o <- orders, (i, _) <- o]
    totals = [(i, sum [n | o <- orders, (j, n) <- o, j == i]) | i <- items]`,
      tests: [
        { expr: "bestSellers week", expected: '[("apple",6),("milk",6),("bread",3),("cheese",1)]' },
        { expr: 'bestSellers [[("tea",1)],[("jam",1),("tea",1)]]', expected: '[("tea",2),("jam",1)]' },
        { expr: "bestSellers []", expected: "[]" },
        { expr: "bestSellers [order1]", expected: '[("apple",3),("milk",2)]' },
        { expr: 'bestSellers [[("z",2)],[("b",2)],[("m",2)]]', expected: '[("b",2),("m",2),("z",2)]', label: "ties in alphabetical order" },
        { expr: 'bestSellers [[("a",1)],[("b",5)],[("a",1)]]', expected: '[("b",5),("a",2)]' },
        { expr: "bestSellers (reverse week)", expected: "bestSellers week", label: "the order of the orders doesn't change the answer" },
      ],
    },
  ],
};
