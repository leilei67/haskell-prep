export interface Plain {
  p: string;
  w?: string;
  t?: string;
}

export const plain: Record<string, Plain> = {
  // ---------------------------------------------------------- functions as values
  id: {
    p: "Gives back exactly what you give it. `id 5` is `5`, `id \"hi\"` is `\"hi\"`.",
    w: "It looks useless, but sometimes a function needs another function as its input and you want \"do nothing\". `map id [1,2,3]` is `[1,2,3]`.",
  },
  const: {
    p: "Takes two inputs and always gives back the first one, ignoring the second. `const 1 99` is `1`.",
    w: "`map (const 0) [5,6,7]`: `const 0` is a function that ignores its input and gives `0`, so every element becomes `0`: `[0,0,0]`.",
  },
  flip: {
    p: "Takes a function with two inputs and gives you a new version with the inputs swapped.",
    w: "`flip (-) 1 10` means `(-) 10 1`, which is `10 - 1`, so the answer is `9`.",
  },
  "(.)": {
    p: "Glues two functions into one new function. `(f . g) x` means: do `g` to `x` first, then do `f` to the result. Read the dot as \"after\": `f . g` is \"f after g\".",
    w: "`(show . (+1)) 2`: first `(+1)` turns `2` into `3`, then `show` turns `3` into `\"3\"`.",
    t: "It runs right to left. In `f . g`, `g` happens first.",
  },
  "($)": {
    p: "Means \"apply the function on the left to everything on the right\". It exists only to save brackets.",
    w: "`negate $ 2 + 3` is the same as `negate (2 + 3)`, which is `-5`. Without the `$`, `negate 2 + 3` would mean `(negate 2) + 3`, which is `1`.",
  },
  "($!)": {
    p: "The same as `$`, except Haskell works out the value on the right before calling the function. Normally Haskell waits until a value is needed (see laziness); `$!` says \"do it now\".",
    w: "It matters for long-running totals, where postponing every step can use up a lot of memory.",
  },
  curry: {
    p: "Turns a function that takes one pair `(x, y)` into a function that takes `x` and `y` as two separate inputs.",
    w: "`fst` takes a pair. `curry fst 1 2` gives `fst (1, 2)`, which is `1`.",
  },
  uncurry: {
    p: "The opposite of `curry`: turns a two-input function into one that takes a single pair.",
    w: "`uncurry (+) (3, 4)` is `3 + 4`, so `7`. Useful with lists of pairs: `map (uncurry (+)) [(1,2),(3,4)]` is `[3,7]`.",
  },
  fst: { p: "The first part of a pair. `fst (1, 'x')` is `1`.", t: "Only works on pairs (exactly two things), not on triples." },
  snd: { p: "The second part of a pair. `snd (1, 'x')` is `'x'`.", t: "Only works on pairs, not on triples." },
  seq: {
    p: "`seq a b` makes Haskell work out `a` (just far enough to see its outer shape), then gives back `b`. It's a tool for controlling laziness.",
    w: "`seq (1 + 1) \"done\"` is `\"done\"`, but the `1 + 1` gets calculated first. `seq undefined 1` crashes, because working out `undefined` crashes.",
  },

  // ---------------------------------------------------------- truth and order
  "(&&)": {
    p: "AND. The answer is `True` only if both sides are `True`.",
    w: "`True && False` is `False`. If the left side is `False`, Haskell doesn't even look at the right side, so `False && undefined` is just `False`.",
  },
  "(||)": {
    p: "OR. The answer is `True` if at least one side is `True`.",
    w: "`False || True` is `True`. If the left side is `True`, the right side is never looked at.",
  },
  not: { p: "Flips a Bool. `not True` is `False` and `not False` is `True`." },
  otherwise: {
    p: "Just another name for `True`. It's used as the last guard to mean \"in every other case\".",
    w: "```\nsign x\n  | x > 0     = 1\n  | x < 0     = -1\n  | otherwise = 0\n```\nGuards are checked top to bottom; `otherwise` is always `True`, so it catches everything left.",
  },
  "(==)": {
    p: "Asks \"are these two values equal?\" and answers `True` or `False`. `3 == 3` is `True`.",
    t: "Two equals signs. A single `=` is for defining things (`x = 5`), never for comparing.",
  },
  "(/=)": {
    p: "Asks \"are these two values different?\". `1 /= 2` is `True`.",
    t: "Haskell writes not-equal as `/=` (it looks like ≠). `!=` from other languages does not exist.",
  },
  compare: {
    p: "Compares two values and answers `LT` (less than), `EQ` (equal) or `GT` (greater than).",
    w: "`compare 1 2` is `LT`. `compare \"b\" \"a\"` is `GT`, because text is compared alphabetically.",
  },
  "(<)": { p: "Less than. `2 < 3` is `True`. Works on numbers, letters, text, and anything else that can be ordered." },
  "(<=)": { p: "Less than or equal to. `3 <= 3` is `True`." },
  "(>)": { p: "Greater than. `'b' > 'a'` is `True`." },
  "(>=)": { p: "Greater than or equal to. `3 >= 4` is `False`." },
  max: { p: "The bigger of two values. `max 3 7` is `7`, and `max 'a' 'z'` is `'z'`." },
  min: { p: "The smaller of two values. `min 3 7` is `3`." },

  // ---------------------------------------------------------- building lists
  "(++)": {
    p: "Joins two lists end to end. `[1,2] ++ [3]` is `[1,2,3]`, and `\"ab\" ++ \"cd\"` is `\"abcd\"`.",
    t: "Both sides must be lists. To put a single element on the front, use `:` instead: `0 : [1,2]`. Writing `1 ++ [2]` is a type error.",
  },
  "(!!)": {
    p: "Gets the element at a position, counting from 0. `\"hello\" !! 1` is `'e'`.",
    t: "Positions start at 0, not 1. It crashes if the position is negative or past the end.",
  },
  head: { p: "The first element of a list. `head [7,8,9]` is `7`.", t: "Crashes on an empty list `[]`. Pattern matching with `(x : _)` is the safe way." },
  tail: { p: "Everything except the first element. `tail [7,8,9]` is `[8,9]`.", t: "Crashes on an empty list." },
  init: { p: "Everything except the last element. `init [7,8,9]` is `[7,8]`.", t: "Crashes on an empty list." },
  last: { p: "The last element. `last [7,8,9]` is `9`.", t: "Crashes on an empty list." },
  null: {
    p: "Is the list empty? `null []` is `True`, `null [1]` is `False`.",
    t: "Use `null xs` rather than `length xs == 0`: `null` doesn't have to count the whole list, and works on infinite lists.",
  },
  length: { p: "How many elements a list has. `length \"hello\"` is `5`.", t: "The answer is an `Int`. To divide it you need `fromIntegral (length xs) / 2`." },
  reverse: { p: "The same list, backwards. `reverse [1,2,3]` is `[3,2,1]`." },
  replicate: { p: "Makes a list of n copies of something. `replicate 3 'x'` is `\"xxx\"`. You used it in Tic Tac Toe to make an empty board." },
  repeat: {
    p: "An endless list of the same value. You always cut it short with something like `take`.",
    w: "`take 3 (repeat 0)` is `[0,0,0]`. Printing `repeat 0` on its own would never finish.",
  },
  cycle: { p: "Repeats a whole list forever. `take 5 (cycle [1,2])` is `[1,2,1,2,1]`.", t: "Crashes on an empty list (there's nothing to repeat)." },
  iterate: {
    p: "Starts with a value and keeps applying a function to it, making the endless list `[x, f x, f (f x), ...]`.",
    w: "`take 4 (iterate (*2) 1)`: start at `1`, then `2`, `4`, `8`. So `[1,2,4,8]`. You used this in the calculus lab to get every derivative.",
  },

  // ---------------------------------------------------------- slicing lists
  take: { p: "The first n elements. `take 2 [5,6,7]` is `[5,6]`.", w: "Asking for more than there are just gives you all of them: `take 10 [1,2]` is `[1,2]`. It never crashes." },
  drop: { p: "Removes the first n elements and keeps the rest. `drop 2 [5,6,7]` is `[7]`.", w: "Dropping more than there are gives `[]`. It never crashes." },
  splitAt: {
    p: "Cuts a list in two at position n. `splitAt 2 [5,6,7]` is `([5,6],[7])`.",
    w: "It gives the same as `(take n xs, drop n xs)`, as a pair.",
  },
  takeWhile: {
    p: "Takes elements from the front for as long as a test is `True`, and stops at the first one that fails.",
    w: "`takeWhile (< 3) [1,2,3,1]` is `[1,2]`. It stops at `3`, and never looks at the last `1`.",
    t: "It stops at the first failure. If you want every passing element from the whole list, use `filter`.",
  },
  dropWhile: {
    p: "Throws away elements from the front while a test is `True`, then keeps everything from the first failure onwards.",
    w: "`dropWhile (< 3) [1,2,3,1]` is `[3,1]`. Common use: `dropWhile (== ' ') \"   hi\"` removes leading spaces.",
  },
  span: {
    p: "Does `takeWhile` and `dropWhile` in one go, giving both halves as a pair.",
    w: "`span even [2,4,5,6]` is `([2,4],[5,6])`: the front part where `even` holds, and the rest.",
  },
  break: {
    p: "Splits a list at the first element that passes a test. The opposite of `span`.",
    w: "`break (> 3) [1,2,4,1]` is `([1,2],[4,1])`. Handy for text: `break (== ' ') \"hi there\"` is `(\"hi\",\" there\")`.",
  },
  filter: {
    p: "Keeps only the elements that pass a test, checking the whole list. `filter even [1..6]` is `[2,4,6]`.",
    t: "Unlike `takeWhile`, `filter` doesn't stop at the first failure; it checks every element.",
  },

  // ---------------------------------------------------------- reshaping lists
  map: {
    p: "Applies a function to every element of a list. `map (*2) [1,2,3]` is `[2,4,6]`.",
    w: "`map show [1,2]` turns each number into text: `[\"1\",\"2\"]`. The list keeps its length; only the elements change.",
  },
  concat: { p: "Flattens a list of lists into one list. `concat [[1],[2,3]]` is `[1,2,3]`, and `concat [\"ab\",\"cd\"]` is `\"abcd\"`." },
  concatMap: {
    p: "`map` followed by `concat`: apply a function that makes a list for each element, then join all those lists.",
    w: "`concatMap (replicate 2) \"ab\"`: `'a'` becomes `\"aa\"`, `'b'` becomes `\"bb\"`, joined: `\"aabb\"`.",
  },
  zip: {
    p: "Pairs up two lists element by element. `zip [1,2,3] \"ab\"` is `[(1,'a'),(2,'b')]`.",
    t: "It stops when the shorter list runs out, silently dropping the extra elements.",
  },
  zip3: { p: "Like `zip`, but for three lists, making triples. `zip3 [1,2] \"ab\" [True,False]` is `[(1,'a',True),(2,'b',False)]`." },
  zipWith: {
    p: "Like `zip`, but instead of making pairs it combines each pair with a function.",
    w: "`zipWith (+) [1,2] [10,20]` is `[1+10, 2+20]`, which is `[11,22]`.",
  },
  zipWith3: { p: "`zipWith` for three lists. `zipWith3 (\\a b c -> a + b + c) [1] [2] [3]` is `[6]`." },
  unzip: { p: "Splits a list of pairs into two lists. `unzip [(1,'a'),(2,'b')]` is `([1,2],\"ab\")`." },
  unzip3: { p: "Splits a list of triples into three lists." },
  lookup: {
    p: "Looks up a key in a list of (key, value) pairs. You get `Just` the value if the key is there, or `Nothing` if it isn't.",
    w: "`lookup 2 [(1,\"a\"),(2,\"b\")]` is `Just \"b\"`. `lookup 9 [(1,\"a\")]` is `Nothing`.",
  },
  elem: { p: "Is this value in the list? `elem 3 [1,2,3]` is `True`. People often write it between its inputs with backticks: ``3 `elem` [1,2,3]``." },
  notElem: { p: "The opposite of `elem`: is this value missing from the list? `notElem 4 [1,2,3]` is `True`." },

  // ---------------------------------------------------------- folds
  foldr: {
    p: "Combines all the elements of a list into one value, working from the right. You give it a combining function and a starting value.",
    w: "`foldr (+) 0 [1,2,3]` is `1 + (2 + (3 + 0))` = `6`. A handy picture: the list `[1,2,3]` is really `1 : 2 : 3 : []`. `foldr f z` replaces every `:` with `f` and the `[]` with `z`.",
  },
  foldl: {
    p: "Like `foldr`, but works from the left, carrying a running total.",
    w: "`foldl (-) 10 [1,2]` is `(10 - 1) - 2` = `7`.",
    t: "On big lists it can run out of memory. Use `foldl'` instead.",
  },
  "foldl'": {
    p: "The same as `foldl`, but it works out the running total at each step instead of saving it all up for later. This is the left fold to actually use.",
    w: "`foldl' (+) 0 [1..1000000]` adds a million numbers without trouble.",
  },
  foldr1: {
    p: "`foldr` without a starting value; it uses the last element as the start.",
    w: "`foldr1 max [3,1,4]` finds the biggest: `4`.",
    t: "Crashes on an empty list, because there's no element to start from.",
  },
  foldl1: { p: "`foldl` without a starting value; it uses the first element as the start. `foldl1 (-) [10,3,2]` is `(10 - 3) - 2` = `5`.", t: "Crashes on an empty list." },
  sum: { p: "Adds up all the numbers. `sum [1,2,3]` is `6`. `sum []` is `0`." },
  product: { p: "Multiplies all the numbers. `product [1,2,3,4]` is `24`. `product []` is `1`." },
  maximum: { p: "The biggest element. `maximum [3,1,4]` is `4`.", t: "Crashes on an empty list." },
  minimum: { p: "The smallest element. `minimum [3,1,4]` is `1`.", t: "Crashes on an empty list." },
  and: { p: "Are all the Bools in the list `True`? `and [True,False]` is `False`.", t: "`and []` is `True` (nothing is false)." },
  or: { p: "Is at least one Bool in the list `True`? `or [False,True]` is `True`.", t: "`or []` is `False`." },
  any: { p: "Does at least one element pass the test? `any even [1,3,4]` is `True`.", t: "`any p []` is `False`." },
  all: { p: "Does every element pass the test? `all even [2,4]` is `True`.", t: "`all p []` is `True`." },
  scanl: {
    p: "Like `foldl`, but gives you every running total instead of only the final one.",
    w: "`scanl (+) 0 [1,2,3]`: start `0`, then `0+1 = 1`, `1+2 = 3`, `3+3 = 6`. So `[0,1,3,6]`.",
  },
  scanl1: { p: "`scanl` that starts from the first element. `scanl1 (+) [1,2,3]` is `[1,3,6]`." },
  scanr: { p: "Like `foldr`, keeping every running total. `scanr (+) 0 [1,2,3]` is `[6,5,3,0]`." },
  scanr1: { p: "`scanr` that starts from the last element. `scanr1 (+) [1,2,3]` is `[6,5,3]`." },

  // ---------------------------------------------------------- text
  lines: { p: "Splits text into a list of lines, cutting at each newline `\\n`. `lines \"a\\nb\"` is `[\"a\",\"b\"]`." },
  unlines: {
    p: "Joins a list of lines into one text, putting a newline after each.",
    t: "It adds a newline after the last line too: `unlines [\"a\",\"b\"]` is `\"a\\nb\\n\"`.",
  },
  words: {
    p: "Splits text into words, cutting at spaces, tabs and newlines, and throwing away the gaps.",
    w: "`words \"  hi   there \"` is `[\"hi\",\"there\"]`. You used it in Tic Tac Toe to read `\"0 2\"`.",
  },
  unwords: { p: "Joins words with one space between each. `unwords [\"hi\",\"there\"]` is `\"hi there\"`." },
  show: {
    p: "Turns a value into text (a String). `show 42` is `\"42\"`, `show True` is `\"True\"`.",
    t: "`show \"hi\"` gives `\"\\\"hi\\\"\"`: the text includes the quote marks. To print text as-is, use `putStrLn`, not `print`.",
  },
  read: {
    p: "The reverse of `show`: turns text into a value. You usually have to say which type you want: `read \"42\" :: Int`.",
    t: "If the text isn't valid, the program crashes. `readMaybe` (from `Text.Read`) gives `Nothing` instead.",
  },
  reads: {
    p: "A version of `read` that doesn't crash. It gives a list containing the value and the leftover text, or an empty list if reading failed.",
    w: "`(reads \"12abc\" :: [(Int,String)])` is `[(12,\"abc\")]`.",
  },
  shows: {
    p: "Like `show`, but puts the text in front of some other text. `shows 12 \"abc\"` is `\"12abc\"`. Used when you write your own `Show` instances.",
  },
  showString: { p: "Puts a fixed piece of text in front of other text. `showString \"ab\" \"cd\"` is `\"abcd\"`. A building block for `Show` instances." },
  showChar: { p: "Puts one character in front of text. `showChar 'x' \"yz\"` is `\"xyz\"`." },
  showParen: {
    p: "Wraps some shown text in brackets, but only if the first input is `True`. `showParen True (showString \"a\") \"\"` is `\"(a)\"`.",
  },
  showsPrec: {
    p: "The function a `Show` instance really defines. Its number input says how tightly the surrounding code binds, which decides whether brackets are needed. `show` is `showsPrec 0`.",
    w: "This is why `show (Just (-3))` is `\"Just (-3)\"` with brackets, but `show (-3)` is `\"-3\"` without.",
  },
  showList: { p: "How a whole list of a type gets shown. It exists so that a list of `Char` prints as `\"abc\"` rather than `['a','b','c']`." },
  readsPrec: { p: "The function a `Read` instance really defines; the number says whether brackets are expected. You'd normally just write `deriving Read`." },
  readList: { p: "How a whole list of a type is read from text. It exists so strings can be read as `\"abc\"`." },
  readPrec: { p: "A newer way of defining `Read` instances, using a parser. It lives in the `Text.Read` module." },
  readListPrec: { p: "The newer-style version of `readList`, also in `Text.Read`." },
  lex: { p: "Reads one Haskell 'word' (a token) from the start of some text, skipping spaces first. `lex \"  foo bar\"` is `[(\"foo\",\" bar\")]`." },
  readParen: { p: "Wraps a reader so it handles brackets: with `True` the brackets must be there, with `False` they're optional." },

  // ---------------------------------------------------------- numbers
  "(+)": { p: "Addition. `2 + 3` is `5`." },
  "(-)": { p: "Subtraction. `5 - 2` is `3`.", t: "`(-1)` on its own means negative one, not \"subtract one\". Use `subtract 1`." },
  "(*)": { p: "Multiplication. `2 * 3` is `6`." },
  negate: { p: "Flips the sign of a number. `negate 5` is `-5`, `negate (-5)` is `5`. Writing `-x` is really `negate x`." },
  abs: { p: "The size of a number, ignoring its sign. `abs (-3)` is `3`." },
  signum: { p: "The sign of a number: `-1` if negative, `0` if zero, `1` if positive. `signum (-7)` is `-1`." },
  fromInteger: {
    p: "How Haskell turns a whole number you type, like `5`, into whatever number type is needed. You almost never call it yourself.",
    w: "It explains why `5` can be an `Int`, a `Double`, or even your own `Expr` type from the calculus lab.",
  },
  "(^)": {
    p: "Power. `2 ^ 10` is `1024`. The power must be a whole number, zero or more.",
    t: "`2 ^ (-1)` crashes. For negative powers use `^^`; for decimal powers use `**`.",
  },
  subtract: {
    p: "`subtract x y` is `y - x`. `subtract 1 5` is `4`.",
    w: "It exists because `(-1)` means negative one. So instead of `map (-1) xs`, you write `map (subtract 1) xs`.",
  },
  even: { p: "Is the whole number even? `even 4` is `True`." },
  odd: { p: "Is the whole number odd? `odd 3` is `True`." },
  gcd: { p: "Greatest common divisor: the biggest number that divides both. `gcd 12 18` is `6`." },
  lcm: { p: "Lowest common multiple: the smallest number both divide into. `lcm 4 6` is `12`." },

  // ---------------------------------------------------------- whole numbers
  div: {
    p: "Whole-number division, rounding down. `div 7 2` is `3`. Often written ``7 `div` 2``.",
    t: "With negatives it rounds down, not towards zero: `div (-7) 2` is `-4`.",
  },
  mod: {
    p: "The remainder after `div`. `mod 7 2` is `1`. Great for \"every nth\" or \"is it divisible\": `mod x 3 == 0`.",
    t: "With a negative number the answer takes the sign of the second input: `mod (-7) 2` is `1`.",
  },
  quot: { p: "Whole-number division rounding towards zero. Same as `div` for positive numbers; `quot (-7) 2` is `-3`." },
  rem: { p: "The remainder that goes with `quot`. Same as `mod` for positive numbers; `rem (-7) 2` is `-1`." },
  divMod: { p: "Gives `div` and `mod` together as a pair. `divMod 7 2` is `(3,1)`." },
  quotRem: { p: "Gives `quot` and `rem` together as a pair. `quotRem (-7) 2` is `(-3,-1)`." },
  toInteger: { p: "Converts any whole-number type (like `Int`) into `Integer`, the unlimited-size whole number." },
  fromIntegral: {
    p: "Converts a whole number into any other number type. You need it whenever you mix `Int` with `Double`.",
    w: "`length xs / 2` fails, because `length` gives an `Int` and `/` needs decimals. `fromIntegral (length xs) / 2` works.",
  },
  toRational: { p: "Converts a number into an exact fraction. `toRational 0.75` is `3 % 4` (three quarters)." },

  // ---------------------------------------------------------- fractions and floating
  "(/)": { p: "Division with a decimal answer. `7 / 2` is `3.5`.", t: "It doesn't work on `Int`. Use `div` for whole numbers, or convert first with `fromIntegral`." },
  recip: { p: "One divided by the number. `recip 4` is `0.25`." },
  fromRational: {
    p: "How Haskell turns a decimal you type, like `3.5`, into whatever fractional type is needed. You almost never call it yourself.",
  },
  "(^^)": { p: "Power where the power is a whole number that may be negative. `2 ^^ (-1)` is `0.5`." },
  "(**)": { p: "Power where the power can be a decimal. `2 ** 0.5` is the square root of 2, about `1.414`." },
  pi: { p: "The number π, about `3.14159`." },
  exp: { p: "e to the power of x, where e is about 2.718. `exp 1` is about `2.718`." },
  log: { p: "The natural logarithm (base e). It undoes `exp`: `log (exp 2)` is `2.0`.", t: "`log` is base e, not base 10. For base 10 use `logBase 10`." },
  sqrt: { p: "Square root. `sqrt 16` is `4.0`." },
  logBase: { p: "Logarithm with a base you choose. `logBase 2 8` is `3.0`, because 2³ = 8.", t: "The base comes first." },
  sin: { p: "Sine of an angle measured in radians (π radians is 180°). `sin (pi / 2)` is `1.0`." },
  cos: { p: "Cosine of an angle in radians. `cos 0` is `1.0`." },
  tan: { p: "Tangent of an angle in radians. `tan 0` is `0.0`." },
  asin: { p: "Inverse sine: which angle has this sine? `asin 1` is π/2." },
  acos: { p: "Inverse cosine. `acos 1` is `0.0`." },
  atan: { p: "Inverse tangent. `atan 1` is π/4." },
  sinh: { p: "Hyperbolic sine, a maths function related to `exp`: (eˣ − e⁻ˣ)/2." },
  cosh: { p: "Hyperbolic cosine: (eˣ + e⁻ˣ)/2." },
  tanh: { p: "Hyperbolic tangent: `sinh x / cosh x`." },
  asinh: { p: "Inverse of `sinh`." },
  acosh: { p: "Inverse of `cosh`." },
  atanh: { p: "Inverse of `tanh`." },

  // ---------------------------------------------------------- rounding
  truncate: { p: "Chops off the decimal part, moving towards zero. `truncate 2.7` is `2`, `truncate (-2.7)` is `-2`." },
  round: {
    p: "Rounds to the nearest whole number.",
    t: "Exact halves go to the even neighbour: `round 2.5` is `2`, but `round 3.5` is `4`. Not what school taught you.",
  },
  ceiling: { p: "Rounds up. `ceiling 2.1` is `3`." },
  floor: { p: "Rounds down. `floor 2.9` is `2`, and `floor (-2.1)` is `-3`." },
  properFraction: { p: "Splits a number into its whole part and its decimal part. `properFraction 3.75` is `(3, 0.75)`." },
  realToFrac: { p: "Converts between number types, for example from `Float` to `Double`, or from `Int` to `Double`." },

  // ---------------------------------------------------------- Maybe and Either
  maybe: {
    p: "Deals with a `Maybe` value in one line: you give a default for `Nothing`, and a function to use on the value inside `Just`.",
    w: "`maybe 0 (+1) (Just 5)` is `6`. `maybe 0 (+1) Nothing` is the default, `0`.",
  },
  either: {
    p: "Deals with an `Either` value: one function for the `Left` case and one for the `Right` case.",
    w: "`either length negate (Left \"abc\")` uses `length`: `3`. `either length negate (Right 4)` uses `negate`: `-4`.",
  },

  // ---------------------------------------------------------- Functor and Applicative
  fmap: {
    p: "`map`, but for any container, not only lists. It changes the value inside and leaves the container alone.",
    w: "`fmap (+1) (Just 2)` is `Just 3`. `fmap (+1) Nothing` is `Nothing` (nothing to change). `fmap (+1) [1,2]` is `[2,3]`.",
  },
  "(<$>)": { p: "The same as `fmap`, written between its inputs. `(+1) <$> Just 2` is `Just 3`." },
  "(<$)": { p: "Replaces whatever is inside a container with a fixed value. `0 <$ Just 5` is `Just 0`, and `'x' <$ [1,2,3]` is `\"xxx\"`." },
  pure: { p: "Puts a plain value into a container in the simplest way. For `Maybe`, `pure 3` is `Just 3`; for lists, `pure 3` is `[3]`." },
  "(<*>)": {
    p: "Applies a function that is inside a container to a value inside a container.",
    w: "`Just (+1) <*> Just 2` is `Just 3`. If either side is `Nothing`, the answer is `Nothing`. A common pattern: `(+) <$> Just 1 <*> Just 2` is `Just 3`.",
  },
  liftA2: { p: "Combines two containers using a two-input function. `liftA2 (+) (Just 1) (Just 2)` is `Just 3`; if either is `Nothing` you get `Nothing`." },
  "(*>)": { p: "Does both, keeps the right-hand result. `Just 1 *> Just 2` is `Just 2`; `Nothing *> Just 2` is `Nothing`." },
  "(<*)": { p: "Does both, keeps the left-hand result. `Just 1 <* Just 2` is `Just 1`." },

  // ---------------------------------------------------------- monads
  "(>>=)": {
    p: "\"And then\". Takes a value in a container (like a `Maybe`) and a function that uses the value inside to make the next container. If the first step failed, it stops there.",
    w: "`Just 3 >>= \\x -> Just (x * 2)` is `Just 6`. `Nothing >>= \\x -> Just (x * 2)` is `Nothing`. A `do` block is just a tidier way of writing `>>=`.",
  },
  "(>>)": { p: "Do the first thing, ignore its result, then do the second. In IO, `putStr \"a\" >> putStr \"b\"` prints `ab`." },
  return: {
    p: "Wraps a value in a container, exactly like `pure`. In an IO `do` block, `return x` gives back `x` as the result.",
    t: "It does NOT stop the function like `return` in other languages. It just wraps a value.",
  },
  "(=<<)": { p: "`>>=` with its inputs the other way round. `print =<< getLine` reads a line, then prints it." },
  fail: { p: "What happens when a pattern doesn't match on the left of `<-` in a `do` block. For `Maybe` it gives `Nothing`; in IO it crashes with a message." },
  mapM_: { p: "Runs an action for every element of a list, and throws the results away. `mapM_ print [1,2,3]` prints each number on its own line. Your Tic Tac Toe `prettyPrint` used it." },
  sequence_: { p: "Runs a list of actions one after another and throws the results away. `sequence_ [putStr \"a\", putStr \"b\"]` prints `ab`." },

  // ---------------------------------------------------------- traversing
  traverse: {
    p: "Like `map`, but each step can fail (or do IO). If every step succeeds you get all the results; if any step fails, the whole thing fails.",
    w: "`traverse (\\x -> if x > 0 then Just x else Nothing) [1,2]` is `Just [1,2]`. Put a `0` in the list and the answer becomes `Nothing`.",
  },
  sequenceA: {
    p: "Turns a list of containers into a container of a list. `sequenceA [Just 1, Just 2]` is `Just [1,2]`; one `Nothing` makes the whole answer `Nothing`.",
  },
  mapM: { p: "The same as `traverse` (an older name). `mapM Just [1,2]` is `Just [1,2]`." },
  sequence: { p: "The same as `sequenceA` (an older name). `sequence [Just 1, Nothing]` is `Nothing`." },

  // ---------------------------------------------------------- combining
  "(<>)": { p: "Combines two values of the same type. For lists and strings it joins them: `\"ab\" <> \"cd\"` is `\"abcd\"`." },
  sconcat: { p: "Combines every element of a non-empty list with `<>`. It lives in `Data.Semigroup`." },
  stimes: { p: "Combines a value with itself n times. `stimes 3 \"ab\"` is `\"ababab\"`. It lives in `Data.Semigroup`." },
  mempty: { p: "The \"empty\" value for combining with `<>`: `\"\"` for strings, `[]` for lists. Combining with it changes nothing." },
  mappend: { p: "The old name for `<>`. `mappend [1] [2]` is `[1,2]`." },
  mconcat: { p: "Combines a whole list with `<>`. `mconcat [\"a\",\"b\",\"c\"]` is `\"abc\"`." },
  fold: { p: "Combines every element of a container with `<>`. `fold [\"ab\",\"cd\"]` is `\"abcd\"`. Needs `import Data.Foldable`." },
  foldMap: { p: "Turns each element into something combinable, then combines them all. `foldMap show [1,2,3]` is `\"123\"`." },
  "foldMap'": { p: "A version of `foldMap` that works out the running result as it goes. Needs `import Data.Foldable`." },
  "foldr'": { p: "A version of `foldr` that works out each step straight away. Needs `import Data.Foldable`." },
  toList: { p: "Turns any container into a plain list. `toList (Just 3)` is `[3]`. Needs `import Data.Foldable`." },

  // ---------------------------------------------------------- IO
  putChar: { p: "Prints one character." },
  putStr: { p: "Prints text without moving to a new line afterwards. Good for prompts: `putStr \"Your move: \"`." },
  putStrLn: { p: "Prints text and then moves to a new line. `putStrLn \"Hello\"`." },
  print: {
    p: "Prints any value that can be shown, then a new line. `print 42` prints `42`.",
    t: "`print \"hi\"` prints `\"hi\"` with the quote marks, because it uses `show`. Use `putStrLn` for text.",
  },
  getChar: { p: "Waits for the user to type one character and gives it to you." },
  getLine: {
    p: "Waits for the user to type a line, and gives it to you as text (without the Enter at the end).",
    w: "Inside a `do` block: `name <- getLine` stores what was typed in `name`.",
  },
  getContents: { p: "Gives you everything the user types, all the way to the end of input, as one String." },
  interact: { p: "Takes a function from text to text, feeds it all of the input, and prints the result. `interact (map toUpper)` shouts back whatever you type." },
  readFile: { p: "Reads a whole file and gives you its contents as text. `contents <- readFile \"notes.txt\"`." },
  writeFile: { p: "Writes text to a file, replacing whatever was there." },
  appendFile: { p: "Adds text to the end of a file, creating the file if needed." },
  readIO: { p: "Like `read`, but inside IO: if the text can't be read it raises an IO error instead of crashing in the middle of a calculation." },
  readLn: { p: "Reads a line from the user and converts it to a value: `n <- readLn :: IO Int`." },
  ioError: { p: "Raises an IO error, stopping the action. Usually used with `userError`: `ioError (userError \"boom\")`." },
  userError: { p: "Makes an IO error value from a message, ready to raise with `ioError`." },

  // ---------------------------------------------------------- enumerations
  succ: { p: "The next value. `succ 3` is `4`, `succ 'a'` is `'b'`.", t: "Crashes if there is no next value, like `succ True`." },
  pred: { p: "The previous value. `pred 10` is `9`." },
  toEnum: { p: "Turns a position number into a value. `toEnum 65 :: Char` is `'A'` (65 is the code for A)." },
  fromEnum: { p: "Turns a value into its position number. `fromEnum 'A'` is `65`, `fromEnum True` is `1`." },
  enumFrom: { p: "What `[x ..]` really calls: counts up forever from x. `take 3 [5 ..]` is `[5,6,7]`." },
  enumFromThen: { p: "What `[x, y ..]` really calls: counts forever in steps of `y - x`. `take 3 [1, 3 ..]` is `[1,3,5]`." },
  enumFromTo: { p: "What `[x .. z]` really calls: counts from x up to z. `[1 .. 4]` is `[1,2,3,4]`." },
  enumFromThenTo: { p: "What `[x, y .. z]` really calls: counts from x to z in steps of `y - x`. `[1, 3 .. 10]` is `[1,3,5,7,9]`." },
  minBound: { p: "The smallest value of a type. `minBound :: Bool` is `False`." },
  maxBound: { p: "The largest value of a type. `maxBound :: Int` is `9223372036854775807`." },

  // ---------------------------------------------------------- crashes and laziness
  error: { p: "Stops the program with your message. `error \"bad input\"`. Use it for situations that should never happen." },
  errorWithoutStackTrace: { p: "Like `error`, but without the extra lines saying where in the code it happened." },
  undefined: { p: "A placeholder that crashes if anything ever uses it. The lab skeletons use it for functions you haven't written yet." },
  until: {
    p: "Keeps applying a function until a test becomes `True`, then gives you the value.",
    w: "`until (> 100) (*2) 1`: 1, 2, 4, 8, 16, 32, 64, 128. `128 > 100`, so the answer is `128`.",
  },
  asTypeOf: { p: "Gives back its first input, but forces it to have the same type as the second. A rarely needed trick to tell Haskell which type you mean." },

  // ---------------------------------------------------------- inside floating point
  floatRadix: { p: "The base the computer uses to store decimal numbers. For `Double` it's `2` (binary)." },
  floatDigits: { p: "How many binary digits of precision a `Double` has: `53`. That's why decimals are only accurate to about 15–16 digits." },
  floatRange: { p: "The smallest and largest power of 2 a `Double` can use: `(-1021,1024)`." },
  decodeFloat: { p: "Splits a decimal number into the whole number m and power e the computer stores, so that the number equals m × 2^e." },
  encodeFloat: { p: "The reverse of `decodeFloat`: builds m × 2^e. `encodeFloat 1 10` is `1024.0`." },
  exponent: { p: "The power of 2 part of a number, when the rest is scaled to between 0.5 and 1. `exponent 8.0` is `4`, because 8 = 0.5 × 2⁴." },
  significand: { p: "The scaled part between 0.5 and 1. `significand 8.0` is `0.5`." },
  scaleFloat: { p: "Multiplies a number by 2 to the power n, very cheaply. `scaleFloat 3 1.0` is `8.0`." },
  isNaN: { p: "Is this \"not a number\"? `0 / 0` gives NaN, so `isNaN (0 / 0)` is `True`.", t: "NaN is not even equal to itself, so `x == x` can be `False`." },
  isInfinite: { p: "Is this infinity? `isInfinite (1 / 0)` is `True`." },
  isDenormalized: { p: "Is this one of the extremely tiny numbers near zero that are stored with less precision?" },
  isNegativeZero: { p: "Is this `-0.0`? Computers have a separate negative zero, even though `-0.0 == 0.0` is `True`." },
  isIEEE: { p: "Does this number type follow the international standard for decimals (IEEE 754)? `True` for `Double` and `Float`." },
  atan2: { p: "The angle of the point (x, y) from the x-axis, correct in every quadrant.", t: "It takes y first, then x: `atan2 y x`." },
  log1p: { p: "Works out `log (1 + x)` accurately when x is tiny. Needs `import Numeric`." },
  expm1: { p: "Works out `exp x - 1` accurately when x is tiny. Needs `import Numeric`." },
  log1pexp: { p: "Works out `log (1 + exp x)` without overflowing for big x. Needs `import Numeric`." },
  log1mexp: { p: "Works out `log (1 - exp x)` accurately. Needs `import Numeric`." },
};
