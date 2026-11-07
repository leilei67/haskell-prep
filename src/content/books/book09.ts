import { type Book, type DrillSet, hs, md } from "../schema.ts";

type Level = Book["sets"][number];

const close = (expr: string, value: string) => ({
  expr: `abs ((${expr}) - (${value})) < 1e-9`,
  label: `${expr} ≈ ${value}`,
});

const bits = hs`import Data.Bits
`;

const ratio = hs`import Data.Ratio ((%), numerator, denominator)
`;

// ---------------------------------------------------------------------------
// Level 1
// ---------------------------------------------------------------------------

const level1: Level = {
  id: "b-numbers-l1",
  lesson: "",
  level: 1,
  title: "Level 1: Warm-up",
  intro: md(
    "Reading number code before you write it. Most questions here ask what GHCi prints, so you get fast at `div`, `mod`, rounding, `%` and the bit operators.",
    "",
    "One to start: `div` rounds down and `mod` is what's left over.",
    "",
    "```",
    "div 17 5     -- 3",
    "mod 17 5     -- 2, because 3 * 5 + 2 == 17",
    "```",
  ),
  drills: [
    {
      k: "predict",
      expr: "(div 17 5, mod 17 5)",
      answer: "(3, 2)",
      why: "17 / 5 is 3.4, rounded down to 3. Then 3 × 5 = 15, and 17 − 15 = 2 is left over.",
    },
    {
      k: "predict",
      expr: "(div (-17) 5, mod (-17) 5)",
      answer: "(-4, 3)",
      why: "−17 / 5 is −3.4. `div` rounds DOWN, and down from −3.4 is −4. Then −4 × 5 = −20, and −17 − (−20) = 3.",
    },
    {
      k: "predict",
      expr: "(quot (-17) 5, rem (-17) 5)",
      answer: "(-3, -2)",
      why: "`quot` rounds towards zero, so −3.4 becomes −3. Then −3 × 5 = −15, and −17 − (−15) = −2. `rem` takes the sign of the number being divided.",
    },
    {
      k: "predict",
      expr: "(mod (-7) 2, - mod 7 2)",
      answer: "(1, -1)",
      why: "With brackets, `mod (-7) 2` is 1. Without them, the minus sign is applied last: `- mod 7 2` means `negate (mod 7 2)`, which is −1. Always bracket negative numbers.",
    },
    {
      k: "predict",
      expr: 'fromIntegral (length "hello") / 2',
      answer: "2.5",
      why: "`length` gives the Int 5. `fromIntegral` lets it be used as a Double, so `/` can divide it: 2.5.",
    },
    {
      k: "quiz",
      q: "`n :: Int`. Which expression compiles and gives the square root of `n` as a Double?",
      options: ["`sqrt n`", "`fromIntegral (sqrt n)`", "`sqrt (fromIntegral n)`", "`sqrt n :: Double`"],
      answer: 2,
      why: "`sqrt` needs a fractional type such as Double, so the Int must be converted BEFORE `sqrt` sees it. Converting the result afterwards is too late, and a type annotation never converts anything.",
    },
    {
      k: "predict",
      expr: "(truncate (-3.7), floor (-3.7))",
      answer: "(-3, -4)",
      why: "`truncate` chops the decimals off, so −3.7 becomes −3. `floor` always goes down, and down from −3.7 is −4.",
    },
    {
      k: "predict",
      expr: "round 0.5 + round 1.5",
      answer: "2",
      why: "Exact halves go to the even neighbour: `round 0.5` is 0 and `round 1.5` is 2.",
    },
    {
      k: "write",
      body: md(
        "Write `lastDigit`, the last decimal digit of a number. For a negative number, use the digit you'd see when writing it down, so `lastDigit (-56)` is 6.",
      ),
      starter: hs`lastDigit :: Int -> Int
lastDigit n = undefined
`,
      tests: [
        { expr: "lastDigit 1234", expected: "4" },
        { expr: "lastDigit 7", expected: "7" },
        { expr: "lastDigit 0", expected: "0" },
        { expr: "lastDigit 90", expected: "0" },
        { expr: "lastDigit (-56)", expected: "6" },
      ],
      hint: "`mod n 10` works for positive numbers. For negatives, `mod (-56) 10` is 4, not 6, so take `abs n` first.",
      solution: hs`lastDigit :: Int -> Int
lastDigit n = mod (abs n) 10
`,
    },
    {
      k: "write",
      body: "Write `isEven` without using `even` or `odd`. It must work for negative numbers too.",
      starter: hs`isEven :: Int -> Bool
isEven n = undefined
`,
      banned: ["even", "odd"],
      tests: [
        { expr: "isEven 4", expected: "True" },
        { expr: "isEven 7", expected: "False" },
        { expr: "isEven 0", expected: "True" },
        { expr: "isEven (-3)", expected: "False" },
        { expr: "isEven (-8)", expected: "True" },
      ],
      hint: "A number is even when dividing by 2 leaves nothing over: `mod n 2 == 0`.",
      solution: hs`isEven :: Int -> Bool
isEven n = mod n 2 == 0
`,
    },
    {
      k: "write",
      body: "Write `half`, which halves an Int and gives a Double, so `half 5` is `2.5`.",
      starter: hs`half :: Int -> Double
half n = undefined
`,
      tests: [
        { expr: "half 5", expected: "2.5" },
        { expr: "half 4", expected: "2.0" },
        { expr: "half 0", expected: "0.0" },
        { expr: "half (-3)", expected: "-1.5" },
      ],
      hint: "`n / 2` doesn't type-check because `n` is an Int. Use `fromIntegral n / 2`.",
      solution: hs`half :: Int -> Double
half n = fromIntegral n / 2
`,
    },
    {
      k: "predict",
      expr: "3 % 4 * 2",
      answer: "3 % 2",
      why: "Three quarters times 2 is six quarters, which Haskell stores in lowest terms: 3 % 2.",
    },
    {
      k: "predict",
      expr: "2 % 6 == 1 % 3",
      answer: "True",
      why: "Rationals are always reduced to lowest terms, so 2 % 6 is stored as 1 % 3 and they're equal.",
    },
    {
      k: "predict",
      expr: "sum [1 % 2, 1 % 4, 1 % 4]",
      answer: "1 % 1",
      why: "1/2 + 1/4 + 1/4 is exactly 1. A whole-number Rational still prints with `% 1`.",
    },
    {
      k: "write",
      body: md(
        "Write `toPence`, which turns an amount in pounds (a Double) into a whole number of pence.",
        "",
        "Careful: `19.99 * 100` is `1998.9999999999998` in Double arithmetic, so `floor` and `truncate` give the wrong answer. Round to the nearest instead.",
      ),
      starter: hs`toPence :: Double -> Int
toPence x = undefined
`,
      tests: [
        { expr: "toPence 1.5", expected: "150" },
        { expr: "toPence 19.99", expected: "1999" },
        { expr: "toPence 0.07", expected: "7" },
        { expr: "toPence 0", expected: "0" },
        { expr: "toPence 3", expected: "300" },
      ],
      hint: "`round (x * 100)`",
      solution: hs`toPence :: Double -> Int
toPence x = round (x * 100)
`,
    },
    {
      k: "write",
      body: md(
        "Write `ratio a b`, the exact fraction a/b as a `Rational`. `Data.Ratio` is imported for you.",
        "",
        "`%` needs both sides to be the same type as the fraction's parts (Integer, for a Rational), so convert the Ints first.",
      ),
      setup: ratio,
      starter: hs`ratio :: Int -> Int -> Rational
ratio a b = undefined
`,
      tests: [
        { expr: "ratio 2 4", expected: "1 % 2" },
        { expr: "ratio 6 3", expected: "2 % 1" },
        { expr: "ratio 0 5", expected: "0 % 1" },
        { expr: "ratio 3 (-4)", expected: "(-3) % 4" },
      ],
      hint: "`fromIntegral a % fromIntegral b`",
      solution: hs`ratio :: Int -> Int -> Rational
ratio a b = fromIntegral a % fromIntegral b
`,
    },
    {
      k: "predict",
      expr: "xor 12 10",
      answer: "6",
      why: "12 is 1100 and 10 is 1010. `xor` keeps a bit where exactly one of them has a 1: 0110, which is 6.",
    },
    {
      k: "predict",
      expr: "popCount (255 :: Int)",
      answer: "8",
      why: "255 is 11111111 in binary: eight 1 bits.",
    },
    {
      k: "predict",
      expr: "shiftL 1 10",
      answer: "1024",
      why: "Shifting 1 left by 10 places gives a 1 followed by ten 0s, which is 2¹⁰ = 1024. That's the same as `bit 10`.",
    },
    {
      k: "write",
      body: "Write `isOddBits`, which says whether a number is odd by looking at its lowest bit with `.&.`. Don't use `odd`, `even`, `mod` or `rem`. `Data.Bits` is imported for you.",
      setup: bits,
      starter: hs`isOddBits :: Int -> Bool
isOddBits n = undefined
`,
      banned: ["odd", "even", "mod", "rem"],
      tests: [
        { expr: "isOddBits 7", expected: "True" },
        { expr: "isOddBits 10", expected: "False" },
        { expr: "isOddBits 0", expected: "False" },
        { expr: "isOddBits (-5)", expected: "True" },
      ],
      hint: "Bit 0 is the 1s place. `n .&. 1` is 1 for odd numbers and 0 for even ones.",
      solution: hs`import Data.Bits

isOddBits :: Int -> Bool
isOddBits n = n .&. 1 == 1
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 2
// ---------------------------------------------------------------------------

const level2: Level = {
  id: "b-numbers-l2",
  lesson: "",
  level: 2,
  title: "Level 2: Standard",
  intro: md(
    "One complete function per question, from a plain description. Watch the types: whenever an Int meets a Double or a Rational, you need `fromIntegral`.",
    "",
    "Most digit questions use the same loop: `mod n 10` is the last digit, `div n 10` is the rest.",
    "",
    "```",
    "digitCount 0 = 0",
    "digitCount n = 1 + digitCount (div n 10)",
    "```",
  ),
  drills: [
    {
      k: "write",
      body: md(
        "Write `hexDigit`, which turns a number from 0 to 15 into its hexadecimal digit. Use lower-case letters for 10 to 15.",
        "",
        "```",
        "hexDigit 9  == '9'",
        "hexDigit 10 == 'a'",
        "hexDigit 15 == 'f'",
        "```",
      ),
      starter: hs`hexDigit :: Int -> Char
hexDigit n = undefined
`,
      tests: [
        { expr: "hexDigit 0", expected: "'0'" },
        { expr: "hexDigit 9", expected: "'9'" },
        { expr: "hexDigit 10", expected: "'a'" },
        { expr: "hexDigit 15", expected: "'f'" },
        { expr: "map hexDigit [11, 12, 13]", expected: '"bcd"' },
      ],
      hint: 'Index into a string of all sixteen digits: `"0123456789abcdef" !! n`.',
      solution: hs`hexDigit :: Int -> Char
hexDigit n = "0123456789abcdef" !! n
`,
    },
    {
      k: "write",
      body: "Write `mean`, the average of a list of Doubles. The mean of an empty list is `0`.",
      starter: hs`mean :: [Double] -> Double
mean xs = undefined
`,
      tests: [
        { expr: "mean [1, 2, 3, 4]", expected: "2.5" },
        { expr: "mean [10]", expected: "10.0" },
        { expr: "mean []", expected: "0.0" },
        { expr: "mean [-2, 2, 6]", expected: "2.0" },
      ],
      hint: "The sum is already a Double, but `length` is an Int: `sum xs / fromIntegral (length xs)`. Guard for the empty list first.",
      solution: hs`mean :: [Double] -> Double
mean [] = 0
mean xs = sum xs / fromIntegral (length xs)
`,
    },
    {
      k: "write",
      body: md(
        "Write `roundHalfUp`, which rounds to the nearest whole number, with exact halves going UP (towards plus infinity). That's not what `round` does: `round 2.5` is 2.",
        "",
        "```",
        "roundHalfUp 2.5    == 3",
        "roundHalfUp (-2.5) == -2",
        "```",
      ),
      starter: hs`roundHalfUp :: Double -> Int
roundHalfUp x = undefined
`,
      tests: [
        { expr: "roundHalfUp 2.5", expected: "3" },
        { expr: "roundHalfUp 3.5", expected: "4" },
        { expr: "roundHalfUp 2.4", expected: "2" },
        { expr: "roundHalfUp (-2.5)", expected: "-2" },
        { expr: "roundHalfUp (-2.6)", expected: "-3" },
      ],
      hint: "Add a half, then round down: `floor (x + 0.5)`.",
      solution: hs`roundHalfUp :: Double -> Int
roundHalfUp x = floor (x + 0.5)
`,
    },
    {
      k: "write",
      body: md(
        "Write `pctChange old new`, the percentage change going from `old` to `new`. If `old` is 0 the answer is 0.",
        "",
        "```",
        "pctChange 50 75   == 50.0",
        "pctChange 200 150 == -25.0",
        "```",
      ),
      starter: hs`pctChange :: Double -> Double -> Double
pctChange old new = undefined
`,
      tests: [
        close("pctChange 50 75", "50"),
        close("pctChange 200 150", "-25"),
        close("pctChange 80 80", "0"),
        close("pctChange 0 10", "0"),
        close("pctChange 4 5", "25"),
      ],
      hint: "`(new - old) / old * 100`, with a guard for `old == 0`.",
      solution: hs`pctChange :: Double -> Double -> Double
pctChange old new
  | old == 0 = 0
  | otherwise = (new - old) / old * 100
`,
    },
    {
      k: "write",
      body: "Write `digitSum`, the sum of the decimal digits of a non-negative number. `digitSum 1234` is 10.",
      starter: hs`digitSum :: Int -> Int
digitSum n = undefined
`,
      tests: [
        { expr: "digitSum 1234", expected: "10" },
        { expr: "digitSum 0", expected: "0" },
        { expr: "digitSum 9", expected: "9" },
        { expr: "digitSum 99999", expected: "45" },
        { expr: "digitSum 1000001", expected: "2" },
      ],
      hint: "`digitSum 0 = 0`, and otherwise the last digit `mod n 10` plus `digitSum (div n 10)`.",
      solution: hs`digitSum :: Int -> Int
digitSum 0 = 0
digitSum n = mod n 10 + digitSum (div n 10)
`,
    },
    {
      k: "write",
      body: md(
        "Write `countDigits`, how many decimal digits a number has when written down. Zero has one digit, and the minus sign of a negative number doesn't count.",
        "",
        "```",
        "countDigits 0      == 1",
        "countDigits 10     == 2",
        "countDigits (-123) == 3",
        "```",
      ),
      starter: hs`countDigits :: Int -> Int
countDigits n = undefined
`,
      tests: [
        { expr: "countDigits 0", expected: "1" },
        { expr: "countDigits 7", expected: "1" },
        { expr: "countDigits 10", expected: "2" },
        { expr: "countDigits 99999", expected: "5" },
        { expr: "countDigits (-123)", expected: "3" },
      ],
      hint: "Work on `m = abs n`. If `m < 10` there's one digit; otherwise it's `1 + countDigits (div m 10)`.",
      solution: hs`countDigits :: Int -> Int
countDigits n
  | m < 10 = 1
  | otherwise = 1 + countDigits (div m 10)
  where
    m = abs n
`,
    },
    {
      k: "write",
      body: "Write `toggleBit n i`, which flips bit `i` of `n` (a 0 becomes 1 and a 1 becomes 0). Use `xor` and `bit`; don't use `complementBit`. `Data.Bits` is imported for you.",
      setup: bits,
      starter: hs`toggleBit :: Int -> Int -> Int
toggleBit n i = undefined
`,
      banned: ["complementBit"],
      tests: [
        { expr: "toggleBit 5 1", expected: "7" },
        { expr: "toggleBit 7 1", expected: "5" },
        { expr: "toggleBit 0 10", expected: "1024" },
        { expr: "toggleBit (toggleBit 99 3) 3", expected: "99" },
      ],
      hint: "`bit i` has just bit `i` set. `xor` with it flips that bit and leaves every other bit alone.",
      solution: hs`toggleBit :: Int -> Int -> Int
toggleBit n i = xor n (bit i)
`,
    },
    {
      k: "write",
      body: md(
        "Write `myGcd`, the greatest common divisor of two numbers, without using `gcd`. Use Euclid's method:",
        "",
        "- the gcd of `a` and 0 is `abs a`;",
        "- otherwise the gcd of `a` and `b` is the gcd of `b` and `mod a b`.",
      ),
      starter: hs`myGcd :: Int -> Int -> Int
myGcd a b = undefined
`,
      banned: ["gcd", "lcm"],
      tests: [
        { expr: "myGcd 12 18", expected: "6" },
        { expr: "myGcd 17 5", expected: "1" },
        { expr: "myGcd 0 7", expected: "7" },
        { expr: "myGcd 9 0", expected: "9" },
        { expr: "myGcd (-4) 6", expected: "2" },
      ],
      hint: "Two equations: `myGcd a 0 = abs a` and `myGcd a b = myGcd b (mod a b)`.",
      solution: hs`myGcd :: Int -> Int -> Int
myGcd a 0 = abs a
myGcd a b = myGcd b (mod a b)
`,
    },
    {
      k: "write",
      body: md(
        "Write `weightedMean`, which takes `(value, weight)` pairs and gives the sum of value × weight divided by the total weight. If the total weight is 0 the answer is 0.",
        "",
        "```",
        "weightedMean [(80, 1), (60, 3)] == 65.0",
        "```",
      ),
      starter: hs`weightedMean :: [(Double, Double)] -> Double
weightedMean vws = undefined
`,
      tests: [
        close("weightedMean [(80, 1), (60, 3)]", "65"),
        close("weightedMean [(1, 1), (2, 1), (3, 1)]", "2"),
        close("weightedMean []", "0"),
        close("weightedMean [(5, 0)]", "0"),
        close("weightedMean [(10, 0.5), (20, 1.5)]", "17.5"),
      ],
      hint: "`total = sum (map snd vws)`. If it's 0 return 0; otherwise `sum [v * w | (v, w) <- vws] / total`.",
      solution: hs`weightedMean :: [(Double, Double)] -> Double
weightedMean vws
  | total == 0 = 0
  | otherwise = sum [v * w | (v, w) <- vws] / total
  where
    total = sum (map snd vws)
`,
    },
    {
      k: "write",
      body: md(
        "Write `roundTo d x`, which rounds `x` to `d` decimal places.",
        "",
        "```",
        "roundTo 2 3.14159 == 3.14",
        "roundTo 0 2.7     == 3.0",
        "```",
        "",
        "Multiply by 10ᵈ, round to a whole number, then divide back.",
      ),
      starter: hs`roundTo :: Int -> Double -> Double
roundTo d x = undefined
`,
      tests: [
        close("roundTo 2 3.14159", "3.14"),
        close("roundTo 0 2.7", "3"),
        close("roundTo 1 (-1.26)", "-1.3"),
        close("roundTo 3 2", "2"),
        close("roundTo 1 0.04", "0"),
      ],
      hint: "`fromIntegral (round (x * 10 ^ d)) / 10 ^ d`. The `round` result is whole, so it needs `fromIntegral` to become a Double again.",
      solution: hs`roundTo :: Int -> Double -> Double
roundTo d x = fromIntegral (round (x * 10 ^ d)) / 10 ^ d
`,
    },
    {
      k: "write",
      body: md(
        "Write `variance`, the population variance of a list: the mean of the squared distances from the mean. An empty list has variance 0.",
        "",
        "```",
        "variance [2, 4, 4, 4, 5, 5, 7, 9] == 4.0",
        "```",
      ),
      starter: hs`variance :: [Double] -> Double
variance xs = undefined
`,
      tests: [
        close("variance [2, 4, 4, 4, 5, 5, 7, 9]", "4"),
        close("variance [1, 2, 3, 4]", "1.25"),
        close("variance [3]", "0"),
        close("variance []", "0"),
      ],
      hint: "Work out `m`, the mean, in a `where`. Then `sum [(x - m) ^ 2 | x <- xs] / n`, where `n = fromIntegral (length xs)`.",
      solution: hs`variance :: [Double] -> Double
variance [] = 0
variance xs = sum [(x - m) ^ 2 | x <- xs] / n
  where
    n = fromIntegral (length xs)
    m = sum xs / n
`,
    },
    {
      k: "write",
      body: md(
        "Write `harmonic n`, the exact value of 1/1 + 1/2 + ... + 1/n as a Rational. `harmonic 0` is 0. `Data.Ratio` is imported for you.",
        "",
        "```",
        "harmonic 3 == 11 % 6",
        "```",
      ),
      setup: ratio,
      starter: hs`harmonic :: Int -> Rational
harmonic n = undefined
`,
      tests: [
        { expr: "harmonic 1", expected: "1" },
        { expr: "harmonic 3", expected: "11 % 6" },
        { expr: "harmonic 4", expected: "25 % 12" },
        { expr: "harmonic 0", expected: "0" },
      ],
      hint: "`sum [1 % fromIntegral k | k <- [1 .. n]]`. The `k` is an Int, so it needs converting before `%`.",
      solution: hs`harmonic :: Int -> Rational
harmonic n = sum [1 % fromIntegral k | k <- [1 .. n]]
`,
    },
    {
      k: "write",
      body: md(
        "A polynomial can be stored as its list of coefficients, lowest power first. So `[1, 2, 3]` means 1 + 2x + 3x².",
        "",
        "Write `evalPoly cs x`, the value of the polynomial at `x`. The empty list is the zero polynomial.",
        "",
        "```",
        "evalPoly [1, 2, 3] 2 == 17       -- 1 + 4 + 12",
        "```",
      ),
      starter: hs`evalPoly :: [Int] -> Int -> Int
evalPoly cs x = undefined
`,
      tests: [
        { expr: "evalPoly [1, 2, 3] 2", expected: "17" },
        { expr: "evalPoly [] 5", expected: "0" },
        { expr: "evalPoly [7] 100", expected: "7" },
        { expr: "evalPoly [0, 0, 1] (-3)", expected: "9" },
        { expr: "evalPoly [1, -1] 1", expected: "0" },
      ],
      hint: "Either `sum (zipWith (\\c i -> c * x ^ i) cs [0 ..])`, or Horner's rule: `foldr (\\c acc -> c + x * acc) 0 cs`.",
      solution: hs`evalPoly :: [Int] -> Int -> Int
evalPoly cs x = foldr (\c acc -> c + x * acc) 0 cs
`,
    },
    {
      k: "write",
      body: md(
        "Write `fromHex`, which turns a string of hexadecimal digits into a number. Upper and lower case letters are both allowed. `digitToInt` (from `Data.Char`, imported for you) turns `'a'` or `'A'` into 10.",
        "",
        "```",
        "fromHex \"ff\"   == 255",
        "fromHex \"BEEF\" == 48879",
        "```",
      ),
      setup: hs`import Data.Char (digitToInt)
`,
      starter: hs`fromHex :: String -> Int
fromHex s = undefined
`,
      tests: [
        { expr: 'fromHex "ff"', expected: "255" },
        { expr: 'fromHex "BEEF"', expected: "48879" },
        { expr: 'fromHex "10"', expected: "16" },
        { expr: 'fromHex "0"', expected: "0" },
        { expr: 'fromHex ""', expected: "0" },
      ],
      hint: "Each new digit multiplies what you had by 16 and adds itself: `foldl (\\acc c -> 16 * acc + digitToInt c) 0 s`.",
      solution: hs`fromHex :: String -> Int
fromHex s = foldl (\acc c -> 16 * acc + digitToInt c) 0 s
`,
    },
    {
      k: "write",
      body: md(
        "Write `setBits`, the positions of the 1 bits of a non-negative number, smallest first. `Data.Bits` is imported for you.",
        "",
        "```",
        "setBits 10 == [1, 3]          -- 10 is 1010",
        "```",
      ),
      setup: bits,
      starter: hs`setBits :: Int -> [Int]
setBits n = undefined
`,
      tests: [
        { expr: "setBits 10", expected: "[1, 3]" },
        { expr: "setBits 0", expected: "[]" },
        { expr: "setBits 1", expected: "[0]" },
        { expr: "setBits 255", expected: "[0 .. 7]" },
        { expr: "setBits (bit 40 + 4)", expected: "[2, 40]" },
      ],
      hint: "A non-negative Int uses bits 0 to 62: `[i | i <- [0 .. 62], testBit n i]`.",
      solution: hs`setBits :: Int -> [Int]
setBits n = [i | i <- [0 .. 62], testBit n i]
`,
    },
    {
      k: "write",
      body: md(
        "Write `bitString n w`, the lowest `w` bits of `n` as a string of `'0'`s and `'1'`s, most significant first. This is the `showBitVector` from 2020's pre-reading. `Data.Bits` is imported for you.",
        "",
        "```",
        "bitString 5 4      == \"0101\"",
        "bitString 29855 16 == \"0111010010011111\"",
        "```",
      ),
      setup: bits,
      starter: hs`bitString :: Int -> Int -> String
bitString n w = undefined
`,
      tests: [
        { expr: "bitString 5 4", expected: '"0101"' },
        { expr: "bitString 29855 16", expected: '"0111010010011111"' },
        { expr: "bitString 0 3", expected: '"000"' },
        { expr: "bitString 9 2", expected: '"01"' },
        { expr: "bitString 6 0", expected: '""' },
      ],
      hint: "Go through the positions from `w - 1` down to 0: `[if testBit n i then '1' else '0' | i <- [w - 1, w - 2 .. 0]]`.",
      solution: hs`bitString :: Int -> Int -> String
bitString n w = [if testBit n i then '1' else '0' | i <- [w - 1, w - 2 .. 0]]
`,
    },
    {
      k: "write",
      body: md(
        "Polynomials are coefficient lists, lowest power first. Write `derivPoly`, the derivative. The derivative of c·xⁱ is (c·i)·xⁱ⁻¹, and a constant disappears.",
        "",
        "```",
        "derivPoly [3, 0, 2]    == [0, 4]       -- 3 + 2x² becomes 4x",
        "derivPoly [5]          == []",
        "```",
      ),
      starter: hs`derivPoly :: [Int] -> [Int]
derivPoly cs = undefined
`,
      tests: [
        { expr: "derivPoly [3, 0, 2]", expected: "[0, 4]" },
        { expr: "derivPoly [5]", expected: "[]" },
        { expr: "derivPoly []", expected: "[]" },
        { expr: "derivPoly [1, 1, 1, 1]", expected: "[1, 2, 3]" },
        { expr: "derivPoly [0, -3, 0, 5]", expected: "[-3, 0, 15]" },
      ],
      hint: "Drop the constant, then multiply each remaining coefficient by its old power: `zipWith (*) [1 ..] (drop 1 cs)`.",
      solution: hs`derivPoly :: [Int] -> [Int]
derivPoly cs = zipWith (*) [1 ..] (drop 1 cs)
`,
    },
    {
      k: "write",
      body: md(
        "Write `addPoly`, which adds two polynomials stored as coefficient lists (lowest power first). The lists may have different lengths.",
        "",
        "```",
        "addPoly [1, 2] [3, 4, 5] == [4, 6, 5]",
        "```",
      ),
      starter: hs`addPoly :: [Int] -> [Int] -> [Int]
addPoly ps qs = undefined
`,
      tests: [
        { expr: "addPoly [1, 2] [3, 4, 5]", expected: "[4, 6, 5]" },
        { expr: "addPoly [] [1]", expected: "[1]" },
        { expr: "addPoly [1, 2, 3] []", expected: "[1, 2, 3]" },
        { expr: "addPoly [1, -2] [-1, 2]", expected: "[0, 0]" },
      ],
      hint: "`zipWith` stops at the shorter list, so recurse instead: when either list runs out, the answer is the other list.",
      solution: hs`addPoly :: [Int] -> [Int] -> [Int]
addPoly [] qs = qs
addPoly ps [] = ps
addPoly (p : ps) (q : qs) = p + q : addPoly ps qs
`,
    },
    {
      k: "write",
      body: md(
        "Write `toHex`, the hexadecimal digits of a non-negative number as a lower-case string. `toHex 0` is `\"0\"`.",
        "",
        "```",
        "toHex 255   == \"ff\"",
        "toHex 48879 == \"beef\"",
        "```",
      ),
      starter: hs`toHex :: Int -> String
toHex n = undefined
`,
      tests: [
        { expr: "toHex 255", expected: '"ff"' },
        { expr: "toHex 48879", expected: '"beef"' },
        { expr: "toHex 4096", expected: '"1000"' },
        { expr: "toHex 10", expected: '"a"' },
        { expr: "toHex 0", expected: '"0"' },
      ],
      hint: "A helper `go 0 = []` and `go m = digit (mod m 16) : go (div m 16)` makes the digits last-first; reverse them. Handle 0 on its own.",
      solution: hs`toHex :: Int -> String
toHex 0 = "0"
toHex n = reverse (go n)
  where
    go 0 = []
    go m = ("0123456789abcdef" !! mod m 16) : go (div m 16)
`,
    },
    {
      k: "write",
      body: md(
        "Write `simplify a b`, the fraction a/b in lowest terms as a pair `(top, bottom)`, with a positive bottom. Assume `b` isn't 0. You may use `gcd`.",
        "",
        "```",
        "simplify 6 8    == (3, 4)",
        "simplify 3 (-6) == (-1, 2)",
        "```",
      ),
      starter: hs`simplify :: Int -> Int -> (Int, Int)
simplify a b = undefined
`,
      tests: [
        { expr: "simplify 6 8", expected: "(3, 4)" },
        { expr: "simplify 3 (-6)", expected: "(-1, 2)" },
        { expr: "simplify 0 5", expected: "(0, 1)" },
        { expr: "simplify (-10) (-4)", expected: "(5, 2)" },
        { expr: "simplify 7 1", expected: "(7, 1)" },
      ],
      hint: "Divide both by `g = gcd a b`, then multiply both by `signum b` so the bottom ends up positive.",
      solution: hs`simplify :: Int -> Int -> (Int, Int)
simplify a b = (s * div a g, s * div b g)
  where
    g = gcd a b
    s = signum b
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 3
// ---------------------------------------------------------------------------

const addPolyGiven = hs`addPoly :: [Int] -> [Int] -> [Int]
addPoly [] qs = qs
addPoly ps [] = ps
addPoly (p : ps) (q : qs) = p + q : addPoly ps qs
`;

const level3: Level = {
  id: "b-numbers-l3",
  lesson: "",
  level: 3,
  title: "Level 3: Stretch",
  intro: md(
    "Two ideas at once: digits plus validation, masks plus shifts, Rationals plus `floor`. Some questions give you broken code to fix, and some ask for two related functions.",
    "",
    "A typical combination is pulling out bits `lo` to `hi`: shift them down, then mask.",
    "",
    "```",
    "shiftR n lo .&. (bit (hi - lo + 1) - 1)",
    "```",
  ),
  drills: [
    {
      k: "write",
      body: md(
        "Fix this code. `average` should give the exact mean of a list of Ints as a Double (0 for an empty list), but `average [1, 2]` gives `1.0` instead of `1.5`.",
      ),
      starter: hs`average :: [Int] -> Double
average [] = 0
average xs = fromIntegral (div (sum xs) (length xs))
`,
      tests: [
        { expr: "average [1, 2]", expected: "1.5" },
        { expr: "average []", expected: "0.0" },
        { expr: "average [4, 4]", expected: "4.0" },
        { expr: "average [-1, -2]", expected: "-1.5" },
      ],
      hint: "`div` throws the fraction away before `fromIntegral` ever sees it. Convert both parts first, then use `/`.",
      solution: hs`average :: [Int] -> Double
average [] = 0
average xs = fromIntegral (sum xs) / fromIntegral (length xs)
`,
    },
    {
      k: "write",
      body: "Fix this code. `isOdd` is wrong for some negative numbers. Find a failing input, work out why, and fix it.",
      starter: hs`isOdd :: Int -> Bool
isOdd n = rem n 2 == 1
`,
      banned: ["odd", "even"],
      tests: [
        { expr: "isOdd 3", expected: "True" },
        { expr: "isOdd (-3)", expected: "True" },
        { expr: "isOdd (-4)", expected: "False" },
        { expr: "isOdd 0", expected: "False" },
      ],
      hint: "`rem (-3) 2` is −1, not 1. Either use `mod`, which is never negative for a positive divisor, or test `/= 0`.",
      solution: hs`isOdd :: Int -> Bool
isOdd n = mod n 2 /= 0
`,
    },
    {
      k: "write",
      body: md(
        "Fix this code. `digitsOf` should give the decimal digits of a non-negative number, most significant first, and `digitsOf 0` should be `[0]`. There are two bugs.",
      ),
      starter: hs`digitsOf :: Int -> [Int]
digitsOf 0 = []
digitsOf n = mod n 10 : digitsOf (div n 10)
`,
      tests: [
        { expr: "digitsOf 123", expected: "[1, 2, 3]" },
        { expr: "digitsOf 0", expected: "[0]" },
        { expr: "digitsOf 7", expected: "[7]" },
        { expr: "digitsOf 100", expected: "[1, 0, 0]" },
      ],
      hint: "The recursion produces the digits last-first, so reverse them. And `0` needs its own case outside the recursion, because the recursion itself must stop at 0 with `[]`.",
      solution: hs`digitsOf :: Int -> [Int]
digitsOf 0 = [0]
digitsOf n = reverse (go n)
  where
    go 0 = []
    go m = mod m 10 : go (div m 10)
`,
    },
    {
      k: "write",
      body: md(
        "Write `ratAverage`, the exact mean of a list of Rationals. An empty list has mean 0. `Data.Ratio` is imported for you.",
        "",
        "```",
        "ratAverage [1 % 2, 1 % 3] == 5 % 12",
        "```",
      ),
      setup: ratio,
      starter: hs`ratAverage :: [Rational] -> Rational
ratAverage xs = undefined
`,
      tests: [
        { expr: "ratAverage [1 % 2, 1 % 3]", expected: "5 % 12" },
        { expr: "ratAverage []", expected: "0" },
        { expr: "ratAverage [3]", expected: "3" },
        { expr: "ratAverage [1 % 3, 1 % 3, 1 % 3]", expected: "1 % 3" },
      ],
      hint: "`sum xs / fromIntegral (length xs)`: `/` is exact on Rationals, but the length is an Int, so convert it.",
      solution: hs`ratAverage :: [Rational] -> Rational
ratAverage [] = 0
ratAverage xs = sum xs / fromIntegral (length xs)
`,
    },
    {
      k: "write",
      body: md(
        "Write `toMixed r`, which splits a Rational into a whole part and a fractional part. The whole part is rounded DOWN, so the fractional part is always between 0 (included) and 1.",
        "",
        "```",
        "toMixed (7 % 2)    == (3, 1 % 2)",
        "toMixed ((-7) % 2) == (-4, 1 % 2)       -- -4 + 1/2 is -7/2",
        "```",
        "",
        "`Data.Ratio` is imported for you, including `numerator` and `denominator`.",
      ),
      setup: ratio,
      starter: hs`toMixed :: Rational -> (Integer, Rational)
toMixed r = undefined
`,
      tests: [
        { expr: "toMixed (7 % 2)", expected: "(3, 1 % 2)" },
        { expr: "toMixed ((-7) % 2)", expected: "(-4, 1 % 2)" },
        { expr: "toMixed 4", expected: "(4, 0)" },
        { expr: "toMixed (1 % 3)", expected: "(0, 1 % 3)" },
        { expr: "toMixed ((-1) % 3)", expected: "(-1, 2 % 3)" },
      ],
      hint: "`w = div (numerator r) (denominator r)` rounds down, even for negatives (or use `floor r`). The fractional part is `r - fromIntegral w`.",
      solution: hs`toMixed :: Rational -> (Integer, Rational)
toMixed r = (w, r - fromIntegral w)
  where
    w = div (numerator r) (denominator r)
`,
    },
    {
      k: "write",
      body: md(
        "Write `extractField n lo hi`, the number made of bits `lo` to `hi` (both included) of `n`. `Data.Bits` is imported for you.",
        "",
        "```",
        "extractField 44628 5 10 == 50      -- 44628 is 1010111001010100",
        "```",
      ),
      setup: bits,
      starter: hs`extractField :: Int -> Int -> Int -> Int
extractField n lo hi = undefined
`,
      tests: [
        { expr: "extractField 44628 5 10", expected: "50" },
        { expr: "extractField 255 0 3", expected: "15" },
        { expr: "extractField 53767 12 15", expected: "13" },
        { expr: "extractField 8 3 3", expected: "1" },
        { expr: "extractField 8 0 2", expected: "0" },
      ],
      hint: "There are `hi - lo + 1` bits in the field. Shift right by `lo`, then mask with `bit (hi - lo + 1) - 1`.",
      solution: hs`extractField :: Int -> Int -> Int -> Int
extractField n lo hi = shiftR n lo .&. (bit (hi - lo + 1) - 1)
`,
    },
    {
      k: "write",
      body: md(
        "Write `median` for a non-empty list of Doubles. Sort the list. With an odd number of elements, the median is the middle one. With an even number, it's the mean of the two middle ones. `sort` is imported for you.",
        "",
        "```",
        "median [3, 1, 2]    == 2.0",
        "median [4, 1, 3, 2] == 2.5",
        "```",
      ),
      setup: hs`import Data.List (sort)
`,
      starter: hs`median :: [Double] -> Double
median xs = undefined
`,
      tests: [
        { expr: "median [3, 1, 2]", expected: "2.0" },
        { expr: "median [4, 1, 3, 2]", expected: "2.5" },
        { expr: "median [5]", expected: "5.0" },
        { expr: "median [1, 1, 2, 9]", expected: "1.5" },
        { expr: "median [10, -10]", expected: "0.0" },
      ],
      hint: "Let `s = sort xs`, `n = length s` and `h = div n 2`. If `n` is odd the answer is `s !! h`; otherwise it's `(s !! (h - 1) + s !! h) / 2`.",
      solution: hs`median :: [Double] -> Double
median xs
  | odd n = s !! h
  | otherwise = (s !! (h - 1) + s !! h) / 2
  where
    s = sort xs
    n = length s
    h = div n 2
`,
    },
    {
      k: "write",
      body: md(
        "Write `binToInt`, which reads a string of binary digits. It gives `Nothing` for an empty string or any character other than `'0'` and `'1'`.",
        "",
        "```",
        "binToInt \"1011\" == Just 11",
        "binToInt \"102\"  == Nothing",
        "```",
      ),
      starter: hs`binToInt :: String -> Maybe Int
binToInt s = undefined
`,
      tests: [
        { expr: 'binToInt "1011"', expected: "Just 11" },
        { expr: 'binToInt "0"', expected: "Just 0" },
        { expr: 'binToInt "0001"', expected: "Just 1" },
        { expr: 'binToInt ""', expected: "Nothing" },
        { expr: 'binToInt "102"', expected: "Nothing" },
      ],
      hint: "Check first: `null s` or `not (all (\\c -> c == '0' || c == '1') s)` gives `Nothing`. Otherwise `Just (foldl (\\acc c -> 2 * acc + (if c == '1' then 1 else 0)) 0 s)`.",
      solution: hs`binToInt :: String -> Maybe Int
binToInt s
  | null s || not (all (\c -> c == '0' || c == '1') s) = Nothing
  | otherwise = Just (foldl step 0 s)
  where
    step acc c = 2 * acc + (if c == '1' then 1 else 0)
`,
    },
    {
      k: "write",
      body: md(
        "Write `padBin w n`: the non-negative number `n` written in binary using exactly `w` digits, padded with leading zeros. If `n` needs more than `w` digits, the answer is `Nothing`. `Data.Bits` is imported for you.",
        "",
        "```",
        "padBin 4 5 == Just \"0101\"",
        "padBin 3 8 == Nothing          -- 8 is 1000, four digits",
        "```",
      ),
      setup: bits,
      starter: hs`padBin :: Int -> Int -> Maybe String
padBin w n = undefined
`,
      tests: [
        { expr: "padBin 4 5", expected: 'Just "0101"' },
        { expr: "padBin 3 8", expected: "Nothing" },
        { expr: "padBin 3 7", expected: 'Just "111"' },
        { expr: "padBin 8 0", expected: 'Just "00000000"' },
        { expr: "padBin 0 0", expected: 'Just ""' },
      ],
      hint: "`n` fits in `w` bits exactly when `n < bit w`. If it fits, build the string from `testBit n i` for `i` from `w - 1` down to 0.",
      solution: hs`padBin :: Int -> Int -> Maybe String
padBin w n
  | n >= bit w = Nothing
  | otherwise = Just [if testBit n i then '1' else '0' | i <- [w - 1, w - 2 .. 0]]
`,
    },
    {
      k: "write",
      body: md(
        "Polynomials are coefficient lists, lowest power first. Trailing zeros (the highest powers) don't change the polynomial, so `[1, 2, 0]` and `[1, 2]` both mean 1 + 2x. Write two functions:",
        "",
        "- `trimPoly`, which removes the trailing zeros;",
        "- `degree`, the highest power with a non-zero coefficient. The zero polynomial (all zeros, or empty) has degree −1.",
        "",
        "```",
        "trimPoly [1, 2, 0, 0] == [1, 2]",
        "degree [5, 0, 3, 0]   == 2",
        "```",
      ),
      starter: hs`trimPoly :: [Int] -> [Int]
trimPoly cs = undefined

degree :: [Int] -> Int
degree cs = undefined
`,
      tests: [
        { expr: "trimPoly [1, 2, 0, 0]", expected: "[1, 2]" },
        { expr: "trimPoly [0, 0]", expected: "[]" },
        { expr: "trimPoly [0, 3]", expected: "[0, 3]" },
        { expr: "degree [5, 0, 3, 0]", expected: "2" },
        { expr: "degree [7]", expected: "0" },
        { expr: "degree [0]", expected: "-1" },
        { expr: "degree []", expected: "-1" },
      ],
      hint: "`trimPoly = reverse . dropWhile (== 0) . reverse`. Then `degree cs = length (trimPoly cs) - 1`.",
      solution: hs`trimPoly :: [Int] -> [Int]
trimPoly cs = reverse (dropWhile (== 0) (reverse cs))

degree :: [Int] -> Int
degree cs = length (trimPoly cs) - 1
`,
    },
    {
      k: "write",
      body: md(
        "The Gini impurity of a set of class counts is 1 − Σ p², where p is each class's share of the total. Write `gini`. If the total is 0 the answer is 0.",
        "",
        "```",
        "gini [5, 5]       == 0.5",
        "gini [1, 1, 1, 1] == 0.75",
        "```",
      ),
      starter: hs`gini :: [Int] -> Double
gini counts = undefined
`,
      tests: [
        close("gini [5, 5]", "0.5"),
        close("gini [1, 1, 1, 1]", "0.75"),
        close("gini [10]", "0"),
        close("gini [3, 0]", "0"),
        close("gini []", "0"),
        close("gini [1, 3]", "0.375"),
      ],
      hint: "`total = fromIntegral (sum counts)`. If it's 0 return 0; otherwise `1 - sum [(fromIntegral c / total) ^ 2 | c <- counts]`.",
      solution: hs`gini :: [Int] -> Double
gini counts
  | total == 0 = 0
  | otherwise = 1 - sum [(fromIntegral c / total) ^ 2 | c <- counts]
  where
    total = fromIntegral (sum counts)
`,
    },
    {
      k: "write",
      body: md(
        "A code assigns each symbol a probability and a code length in bits. Write two functions:",
        "",
        "- `entropyP ps`, which is −Σ p · log₂ p over the probabilities. Skip any p that is 0 (it counts as 0).",
        "- `avgCodeLength`, which takes `(probability, length)` pairs and gives Σ p · length.",
        "",
        "```",
        "entropyP [0.5, 0.25, 0.25]                    == 1.5",
        "avgCodeLength [(0.5, 1), (0.25, 2), (0.25, 2)] == 1.5",
        "```",
      ),
      starter: hs`entropyP :: [Double] -> Double
entropyP ps = undefined

avgCodeLength :: [(Double, Int)] -> Double
avgCodeLength pls = undefined
`,
      tests: [
        close("entropyP [0.5, 0.25, 0.25]", "1.5"),
        close("entropyP [0.5, 0.5]", "1"),
        close("entropyP [1, 0]", "0"),
        close("entropyP []", "0"),
        close("avgCodeLength [(0.5, 1), (0.25, 2), (0.25, 2)]", "1.5"),
        close("avgCodeLength [(0.9, 1), (0.1, 3)]", "1.2"),
        close("avgCodeLength []", "0"),
      ],
      hint: "`negate (sum [p * logBase 2 p | p <- ps, p > 0])`. For the second, the length is an Int: `sum [p * fromIntegral l | (p, l) <- pls]`.",
      solution: hs`entropyP :: [Double] -> Double
entropyP ps = negate (sum [p * logBase 2 p | p <- ps, p > 0])

avgCodeLength :: [(Double, Int)] -> Double
avgCodeLength pls = sum [p * fromIntegral l | (p, l) <- pls]
`,
    },
    {
      k: "write",
      body: md(
        "Write `bitsNeeded n`, how many binary digits the non-negative number `n` needs. Treat 0 as needing 0 bits. Don't use `logBase`: Doubles are inexact near powers of two. `Data.Bits` is imported for you.",
        "",
        "```",
        "bitsNeeded 255 == 8",
        "bitsNeeded 256 == 9",
        "```",
      ),
      setup: bits,
      starter: hs`bitsNeeded :: Int -> Int
bitsNeeded n = undefined
`,
      banned: ["logBase", "log"],
      tests: [
        { expr: "bitsNeeded 0", expected: "0" },
        { expr: "bitsNeeded 1", expected: "1" },
        { expr: "bitsNeeded 2", expected: "2" },
        { expr: "bitsNeeded 255", expected: "8" },
        { expr: "bitsNeeded 256", expected: "9" },
        { expr: "bitsNeeded (bit 40)", expected: "41" },
      ],
      hint: "Each `shiftR n 1` removes one bit. `bitsNeeded 0 = 0` and `bitsNeeded n = 1 + bitsNeeded (shiftR n 1)`.",
      solution: hs`bitsNeeded :: Int -> Int
bitsNeeded 0 = 0
bitsNeeded n = 1 + bitsNeeded (shiftR n 1)
`,
    },
    {
      k: "write",
      body: md(
        "A colour is three numbers from 0 to 255: red, green and blue. It can be packed into one Int as 24 bits: red in bits 16-23, green in bits 8-15, blue in bits 0-7. Write `packRGB` and `unpackRGB`. `Data.Bits` is imported for you.",
        "",
        "```",
        "packRGB (255, 128, 0)  == 16744448",
        "unpackRGB 16744448     == (255, 128, 0)",
        "```",
      ),
      setup: bits,
      starter: hs`packRGB :: (Int, Int, Int) -> Int
packRGB (r, g, b) = undefined

unpackRGB :: Int -> (Int, Int, Int)
unpackRGB n = undefined
`,
      tests: [
        { expr: "packRGB (255, 128, 0)", expected: "16744448" },
        { expr: "packRGB (18, 52, 86)", expected: "1193046" },
        { expr: "packRGB (0, 0, 0)", expected: "0" },
        { expr: "unpackRGB 16744448", expected: "(255, 128, 0)" },
        { expr: "unpackRGB 1193046", expected: "(18, 52, 86)" },
        { expr: "unpackRGB (packRGB (1, 2, 3))", expected: "(1, 2, 3)" },
      ],
      hint: "Packing: `shiftL r 16 .|. shiftL g 8 .|. b`. Unpacking: shift each block down and mask with 255.",
      solution: hs`packRGB :: (Int, Int, Int) -> Int
packRGB (r, g, b) = shiftL r 16 .|. shiftL g 8 .|. b

unpackRGB :: Int -> (Int, Int, Int)
unpackRGB n = (shiftR n 16 .&. 255, shiftR n 8 .&. 255, n .&. 255)
`,
    },
    {
      k: "write",
      body: md(
        "Write `stdDev` (the square root of the population variance) and `zScores`, which replaces each value by how many standard deviations it is from the mean: (x − mean) / stdDev. If the standard deviation is 0, every z-score is 0.",
        "",
        "```",
        "stdDev [2, 4, 4, 4, 5, 5, 7, 9]  == 2.0",
        "zScores [2, 4, 4, 4, 5, 5, 7, 9] == [-1.5, -0.5, -0.5, -0.5, 0.0, 0.0, 1.0, 2.0]",
        "```",
        "",
        "An empty list has standard deviation 0.",
      ),
      starter: hs`stdDev :: [Double] -> Double
stdDev xs = undefined

zScores :: [Double] -> [Double]
zScores xs = undefined
`,
      tests: [
        close("stdDev [2, 4, 4, 4, 5, 5, 7, 9]", "2"),
        close("stdDev [1, 3]", "1"),
        close("stdDev []", "0"),
        {
          expr: "and (zipWith (\\a b -> abs (a - b) < 1e-9) (zScores [2, 4, 4, 4, 5, 5, 7, 9]) [-1.5, -0.5, -0.5, -0.5, 0, 0, 1, 2]) && length (zScores [2, 4, 4, 4, 5, 5, 7, 9]) == 8",
          label: "zScores [2, 4, 4, 4, 5, 5, 7, 9] ≈ [-1.5, -0.5, -0.5, -0.5, 0.0, 0.0, 1.0, 2.0]",
        },
        { expr: "zScores [3, 3]", expected: "[0.0, 0.0]" },
        { expr: "zScores []", expected: "[]" },
      ],
      hint: "In `stdDev`, compute the mean `m` and `n = fromIntegral (length xs)`, then `sqrt (sum [(x - m) ^ 2 | x <- xs] / n)`. In `zScores`, if `s == 0` use `map (const 0) xs`.",
      solution: hs`stdDev :: [Double] -> Double
stdDev [] = 0
stdDev xs = sqrt (sum [(x - m) ^ 2 | x <- xs] / n)
  where
    n = fromIntegral (length xs)
    m = sum xs / n

zScores :: [Double] -> [Double]
zScores xs
  | s == 0 = map (const 0) xs
  | otherwise = [(x - m) / s | x <- xs]
  where
    s = stdDev xs
    m = sum xs / fromIntegral (length xs)
`,
    },
    {
      k: "write",
      body: md(
        "Write `setField n k w v`, which replaces the `w` bits of `n` starting at bit `k` with the value `v` (assume `v` fits in `w` bits). All other bits stay as they were. `Data.Bits` is imported for you, including `complement`.",
        "",
        "```",
        "setField 0 4 4 15    == 240        -- 11110000",
        "setField 255 0 4 0   == 240",
        "setField 53767 4 4 9 == 53911      -- 1101 0010 0000 0111 becomes 1101 0010 1001 0111",
        "```",
      ),
      setup: bits,
      starter: hs`setField :: Int -> Int -> Int -> Int -> Int
setField n k w v = undefined
`,
      tests: [
        { expr: "setField 0 4 4 15", expected: "240" },
        { expr: "setField 255 0 4 0", expected: "240" },
        { expr: "setField 53767 4 4 9", expected: "53911" },
        { expr: "setField 5 1 1 1", expected: "7" },
        { expr: "setField 5 1 1 0", expected: "5" },
        { expr: "setField 4095 4 4 3", expected: "3903" },
      ],
      hint: "First clear the field: `n .&. complement (shiftL (bit w - 1) k)`. Then put the new value in with `.|. shiftL v k`.",
      solution: hs`setField :: Int -> Int -> Int -> Int -> Int
setField n k w v = (n .&. complement (shiftL (bit w - 1) k)) .|. shiftL v k
`,
    },
    {
      k: "write",
      body: md(
        "Write `rotl8 x k`, which rotates the 8-bit value `x` (0 to 255) left by `k` places: bits pushed off the top come back in at the bottom. `k` may be any non-negative number; rotating by 8 changes nothing. `Data.Bits` is imported for you.",
        "",
        "```",
        "rotl8 128 1 == 1           -- 10000000 becomes 00000001",
        "rotl8 150 3 == 180         -- 10010110 becomes 10110100",
        "```",
      ),
      setup: bits,
      starter: hs`rotl8 :: Int -> Int -> Int
rotl8 x k = undefined
`,
      tests: [
        { expr: "rotl8 1 1", expected: "2" },
        { expr: "rotl8 128 1", expected: "1" },
        { expr: "rotl8 150 3", expected: "180" },
        { expr: "rotl8 77 0", expected: "77" },
        { expr: "rotl8 77 8", expected: "77" },
        { expr: "rotl8 1 9", expected: "2" },
      ],
      hint: "Use `j = mod k 8`. The bits that go left are `shiftL x j`, the bits that wrap round are `shiftR x (8 - j)`. Combine with `.|.` and keep only 8 bits with `.&. 255`.",
      solution: hs`rotl8 :: Int -> Int -> Int
rotl8 x k = (shiftL x j .|. shiftR x (8 - j)) .&. 255
  where
    j = mod k 8
`,
    },
    {
      k: "write",
      body: md(
        "Write `mulPoly`, which multiplies two polynomials stored as coefficient lists (lowest power first). `addPoly` is given.",
        "",
        "```",
        "mulPoly [1, 1] [1, 1]  == [1, 2, 1]        -- (1 + x)² = 1 + 2x + x²",
        "mulPoly [1, -1] [1, 1] == [1, 0, -1]",
        "```",
        "",
        "Idea: (c + x·P) · Q = c·Q + x·(P·Q), and multiplying by x means putting a 0 on the front.",
      ),
      setup: addPolyGiven,
      starter: hs`mulPoly :: [Int] -> [Int] -> [Int]
mulPoly ps qs = undefined
`,
      tests: [
        { expr: "mulPoly [1, 1] [1, 1]", expected: "[1, 2, 1]" },
        { expr: "mulPoly [1, -1] [1, 1]", expected: "[1, 0, -1]" },
        { expr: "mulPoly [2] [3, 4]", expected: "[6, 8]" },
        { expr: "mulPoly [0, 1] [0, 1]", expected: "[0, 0, 1]" },
        { expr: "mulPoly [1, 2, 3] [4, 5]", expected: "[4, 13, 22, 15]" },
        { expr: "mulPoly [] [1, 2]", expected: "[]" },
      ],
      hint: "`mulPoly [] _ = []` and `mulPoly (c : cs) qs = addPoly (map (c *) qs) (0 : mulPoly cs qs)`.",
      solution: hs`mulPoly :: [Int] -> [Int] -> [Int]
mulPoly [] _ = []
mulPoly (c : cs) qs = addPoly (map (c *) qs) (0 : mulPoly cs qs)
`,
    },
    {
      k: "write",
      body: md(
        "Write `convertBase a b ds`: `ds` are the digits of a number in base `a` (most significant first). Give its digits in base `b`. The number 0 is `[0]` in every base.",
        "",
        "```",
        "convertBase 2 10 [1, 0, 1, 1] == [1, 1]",
        "convertBase 16 8 [15, 15]     == [3, 7, 7]",
        "```",
        "",
        "Write a helper for each direction.",
      ),
      starter: hs`convertBase :: Int -> Int -> [Int] -> [Int]
convertBase a b ds = undefined
`,
      tests: [
        { expr: "convertBase 2 10 [1, 0, 1, 1]", expected: "[1, 1]" },
        { expr: "convertBase 10 2 [1, 3]", expected: "[1, 1, 0, 1]" },
        { expr: "convertBase 16 8 [15, 15]", expected: "[3, 7, 7]" },
        { expr: "convertBase 3 10 [2, 1, 0]", expected: "[2, 1]" },
        { expr: "convertBase 10 16 [0]", expected: "[0]" },
        { expr: "convertBase 10 2 []", expected: "[0]" },
      ],
      hint: "`fromBase = foldl (\\acc d -> a * acc + d) 0`. `toBase 0 = [0]`, otherwise reverse the digits produced by repeated `mod` and `div` by `b`.",
      solution: hs`convertBase :: Int -> Int -> [Int] -> [Int]
convertBase a b ds = toBase (foldl (\acc d -> a * acc + d) 0 ds)
  where
    toBase 0 = [0]
    toBase n = reverse (go n)
    go 0 = []
    go m = mod m b : go (div m b)
`,
    },
    {
      k: "write",
      body: md(
        "The Luhn check catches typos in card numbers. Take the decimal digits from the RIGHT. Leave the 1st, 3rd, 5th, ... alone. Double the 2nd, 4th, 6th, ..., and if doubling gives more than 9, subtract 9. The number passes if the total is a multiple of 10. Write `luhn` for positive numbers.",
        "",
        "```",
        "luhn 79927398713 == True",
        "luhn 79927398710 == False",
        "```",
      ),
      starter: hs`luhn :: Int -> Bool
luhn n = undefined
`,
      tests: [
        { expr: "luhn 79927398713", expected: "True" },
        { expr: "luhn 79927398710", expected: "False" },
        { expr: "luhn 18", expected: "True" },
        { expr: "luhn 4111111111111111", expected: "True" },
        { expr: "luhn 4111111111111112", expected: "False" },
        { expr: "luhn 59", expected: "True" },
      ],
      hint: "Build the digits last-first with `mod 10` and `div 10` (no `reverse` needed!). Then `zipWith` them with `cycle [False, True]` to know which to double.",
      solution: hs`luhn :: Int -> Bool
luhn n = mod (sum (zipWith step (cycle [False, True]) (revDigits n))) 10 == 0
  where
    revDigits 0 = []
    revDigits m = mod m 10 : revDigits (div m 10)
    step False d = d
    step True d
      | 2 * d > 9 = 2 * d - 9
      | otherwise = 2 * d
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 4
// ---------------------------------------------------------------------------

const permsTypes = hs`import Data.Bits
import Data.Char (digitToInt)

data Who = User | Group | Other
  deriving (Eq, Show, Enum)

data Perm = Read | Write | Exec
  deriving (Eq, Show, Enum)

type Mode = Int
`;

const permsGiven =
  permsTypes +
  hs`
position :: Who -> Perm -> Int
position w p = 3 * (2 - fromEnum w) + (2 - fromEnum p)
`;

const permsStory = md(
  "**Unix permissions.** A file's `Mode` is an Int whose lowest 9 bits say who may do what. Bits 8, 7, 6 are read, write, execute for the `User`; bits 5, 4, 3 for the `Group`; bits 2, 1, 0 for `Other`. Written in octal, 755 (binary 111 101 101) means the user can do everything and everyone else can read and execute.",
);

const ipTypes = hs`import Data.Bits
import Data.List (intercalate)

type IP = Int

packIP :: (Int, Int, Int, Int) -> IP
packIP (a, b, c, d) = shiftL a 24 .|. shiftL b 16 .|. shiftL c 8 .|. d
`;

const ipStory =
  "**IPv4 addresses.** An address like `192.168.1.10` is four numbers from 0 to 255 (octets). It's stored as one `IP` (an Int) holding 32 bits: the first octet in bits 24-31, then 16-23, 8-15 and 0-7.";

const boardTypes = hs`import Data.Bits

type Board = Int

cell :: Int -> Int -> Int
cell r c = 4 * r + c
`;

const boardStory =
  "**A 4×4 bitboard.** A `Board` is an Int using 16 bits, one per square. The square in row `r` and column `c` (both 0 to 3) is bit `cell r c = 4 * r + c`; a 1 means the square is filled. Row 0 is the bottom row, so its squares are bits 0-3.";

const level4: Level = {
  id: "b-numbers-l4",
  lesson: "",
  level: 4,
  title: "Level 4: Exam strength",
  intro: md(
    "Questions worded like the real paper, on small invented domains: file permissions, IP addresses, sensor readings, marks, exact polynomials and a bitboard. The types are given, as in the exam. The last five are as hard as a 3-5 mark question.",
    "",
    "Read the examples as carefully as the words. For instance, a spec might say:",
    "",
    "```",
    "*Main> grade 21 30",
    "'A'",
    "```",
    "",
    "and that one line tells you 70% exactly counts as an A.",
  ),
  drills: [
    {
      k: "write",
      body: md(
        permsStory,
        "",
        "Define a function `position :: Who -> Perm -> Int` that returns the bit index used for the given person and permission. For example:",
        "",
        "```",
        "*Main> position User Read",
        "8",
        "*Main> position Group Write",
        "4",
        "*Main> position Other Exec",
        "0",
        "```",
      ),
      setup: permsTypes,
      starter: hs`position :: Who -> Perm -> Int
position w p = undefined
`,
      tests: [
        { expr: "position User Read", expected: "8" },
        { expr: "position Group Write", expected: "4" },
        { expr: "position Other Exec", expected: "0" },
        { expr: "position User Exec", expected: "6" },
        { expr: "position Other Read", expected: "2" },
      ],
      hint: "Each person has a block of 3: User starts at 6, Group at 3, Other at 0. Within a block, Read is +2, Write +1, Exec +0. Small helper functions with one equation per constructor work, or `fromEnum`.",
      solution: hs`position :: Who -> Perm -> Int
position w p = 3 * block w + offset p
  where
    block User = 2
    block Group = 1
    block Other = 0
    offset Read = 2
    offset Write = 1
    offset Exec = 0
`,
    },
    {
      k: "write",
      body: md(
        permsStory,
        "",
        "`position` (from the previous question) is given. Define a function `allowed :: Mode -> Who -> Perm -> Bool` that returns `True` if the mode gives that person that permission. For example:",
        "",
        "```",
        "*Main> allowed 493 User Write",
        "True",
        "*Main> allowed 493 Group Write",
        "False",
        "```",
        "",
        "(493 is octal 755.)",
      ),
      setup: permsGiven,
      starter: hs`allowed :: Mode -> Who -> Perm -> Bool
allowed m w p = undefined
`,
      tests: [
        { expr: "allowed 493 User Write", expected: "True" },
        { expr: "allowed 493 Group Write", expected: "False" },
        { expr: "allowed 493 Other Exec", expected: "True" },
        { expr: "allowed 0 Other Read", expected: "False" },
        { expr: "allowed 420 User Exec", expected: "False" },
      ],
      hint: "`testBit m (position w p)`",
      solution: hs`allowed :: Mode -> Who -> Perm -> Bool
allowed m w p = testBit m (position w p)
`,
    },
    {
      k: "write",
      body: md(
        permsStory,
        "",
        "`position` is given. Define functions `grant, revoke :: Who -> Perm -> Mode -> Mode` that respectively turn the given permission on and off, leaving all other permissions unchanged. For example:",
        "",
        "```",
        "*Main> grant Group Write 493",
        "509",
        "*Main> revoke User Read 493",
        "237",
        "*Main> grant User Read 256",
        "256",
        "```",
      ),
      setup: permsGiven,
      starter: hs`grant :: Who -> Perm -> Mode -> Mode
grant w p m = undefined

revoke :: Who -> Perm -> Mode -> Mode
revoke w p m = undefined
`,
      tests: [
        { expr: "grant Group Write 493", expected: "509" },
        { expr: "grant User Read 256", expected: "256" },
        { expr: "grant Other Exec 0", expected: "1" },
        { expr: "revoke User Read 493", expected: "237" },
        { expr: "revoke Other Exec 0", expected: "0" },
        { expr: "revoke Group Read (grant Group Read 0)", expected: "0" },
      ],
      hint: "`setBit m (position w p)` and `clearBit m (position w p)`. Both are safe to apply when the bit is already in the wanted state.",
      solution: hs`grant :: Who -> Perm -> Mode -> Mode
grant w p m = setBit m (position w p)

revoke :: Who -> Perm -> Mode -> Mode
revoke w p m = clearBit m (position w p)
`,
    },
    {
      k: "write",
      body: md(
        permsStory,
        "",
        "Define a function `showMode :: Mode -> String` that shows a mode the way `ls -l` does: nine characters, `rwx` for each of User, Group and Other in that order, with `-` for any permission that's missing. For example:",
        "",
        "```",
        "*Main> showMode 493",
        "\"rwxr-xr-x\"",
        "*Main> showMode 420",
        "\"rw-r--r--\"",
        "```",
      ),
      setup: permsGiven,
      starter: hs`showMode :: Mode -> String
showMode m = undefined
`,
      tests: [
        { expr: "showMode 493", expected: '"rwxr-xr-x"' },
        { expr: "showMode 420", expected: '"rw-r--r--"' },
        { expr: "showMode 0", expected: '"---------"' },
        { expr: "showMode 511", expected: '"rwxrwxrwx"' },
        { expr: "showMode 448", expected: '"rwx------"' },
      ],
      hint: "Pair the bit positions 8 down to 0 with the letters: `zip [8, 7 .. 0] \"rwxrwxrwx\"`. Keep the letter if the bit is set, otherwise `'-'`.",
      solution: hs`showMode :: Mode -> String
showMode m = [if testBit m i then c else '-' | (i, c) <- zip [8, 7 .. 0] "rwxrwxrwx"]
`,
    },
    {
      k: "write",
      body: md(
        permsStory,
        "",
        "Define a function `readOctal :: String -> Maybe Mode` that reads a mode written in octal (base 8). The result is `Nothing` if the string is empty, contains a character other than `'0'` to `'7'`, or gives a value bigger than 511 (more than 9 bits). For example:",
        "",
        "```",
        "*Main> readOctal \"755\"",
        "Just 493",
        "*Main> readOctal \"758\"",
        "Nothing",
        "*Main> readOctal \"1000\"",
        "Nothing",
        "```",
        "",
        "`digitToInt` is imported for you.",
      ),
      setup: permsGiven,
      starter: hs`readOctal :: String -> Maybe Mode
readOctal s = undefined
`,
      tests: [
        { expr: 'readOctal "755"', expected: "Just 493" },
        { expr: 'readOctal "644"', expected: "Just 420" },
        { expr: 'readOctal "007"', expected: "Just 7" },
        { expr: 'readOctal "758"', expected: "Nothing" },
        { expr: 'readOctal "1000"', expected: "Nothing" },
        { expr: 'readOctal ""', expected: "Nothing" },
      ],
      hint: "Check `null s` and `all (\\c -> c >= '0' && c <= '7') s` first. Then `n = foldl (\\acc c -> 8 * acc + digitToInt c) 0 s`, and check `n <= 511`.",
      solution: hs`readOctal :: String -> Maybe Mode
readOctal s
  | null s || not (all (\c -> c >= '0' && c <= '7') s) = Nothing
  | n > 511 = Nothing
  | otherwise = Just n
  where
    n = foldl (\acc c -> 8 * acc + digitToInt c) 0 s
`,
    },
    {
      k: "write",
      body: md(
        ipStory,
        "",
        "Define a function `octets :: IP -> (Int, Int, Int, Int)` that splits an address back into its four octets, first octet first. For example:",
        "",
        "```",
        "*Main> octets 3232235786",
        "(192,168,1,10)",
        "*Main> octets (packIP (10, 0, 0, 1))",
        "(10,0,0,1)",
        "```",
      ),
      setup: ipTypes,
      starter: hs`octets :: IP -> (Int, Int, Int, Int)
octets ip = undefined
`,
      tests: [
        { expr: "octets 3232235786", expected: "(192, 168, 1, 10)" },
        { expr: "octets (packIP (10, 0, 0, 1))", expected: "(10, 0, 0, 1)" },
        { expr: "octets 0", expected: "(0, 0, 0, 0)" },
        { expr: "octets 4294967295", expected: "(255, 255, 255, 255)" },
      ],
      hint: "Octet number k (counting from the right, from 0) is `shiftR ip (8 * k) .&. 255`.",
      solution: hs`octets :: IP -> (Int, Int, Int, Int)
octets ip = (get 24, get 16, get 8, get 0)
  where
    get k = shiftR ip k .&. 255
`,
    },
    {
      k: "write",
      body: md(
        ipStory,
        "",
        "Define a function `showIP :: IP -> String` that shows an address in the usual dotted form. For example:",
        "",
        "```",
        "*Main> showIP 3232235786",
        "\"192.168.1.10\"",
        "*Main> showIP 0",
        "\"0.0.0.0\"",
        "```",
        "",
        "`intercalate` is imported for you.",
      ),
      setup: ipTypes,
      starter: hs`showIP :: IP -> String
showIP ip = undefined
`,
      tests: [
        { expr: "showIP 3232235786", expected: '"192.168.1.10"' },
        { expr: "showIP 0", expected: '"0.0.0.0"' },
        { expr: "showIP (packIP (10, 0, 0, 1))", expected: '"10.0.0.1"' },
        { expr: "showIP 4294967295", expected: '"255.255.255.255"' },
      ],
      hint: "`intercalate \".\" [show (shiftR ip k .&. 255) | k <- [24, 16, 8, 0]]`",
      solution: hs`showIP :: IP -> String
showIP ip = intercalate "." [show (shiftR ip k .&. 255) | k <- [24, 16, 8, 0]]
`,
    },
    {
      k: "write",
      body: md(
        ipStory,
        "",
        "A network is described by a prefix length `p` from 0 to 32: the first `p` bits of the 32 are the network part. Define a function `netmask :: Int -> IP` that returns the 32-bit number whose top `p` bits are 1 and whose other bits are 0. For example:",
        "",
        "```",
        "*Main> netmask 24",
        "4294967040",
        "*Main> showIP (netmask 20)",
        "\"255.255.240.0\"",
        "*Main> netmask 0",
        "0",
        "```",
        "",
        "Remember an Int has 64 bits: bits 32 and above must stay 0.",
      ),
      setup: ipTypes + hs`
showIP :: IP -> String
showIP ip = intercalate "." [show (shiftR ip k .&. 255) | k <- [24, 16, 8, 0]]
`,
      starter: hs`netmask :: Int -> IP
netmask p = undefined
`,
      tests: [
        { expr: "netmask 24", expected: "4294967040" },
        { expr: "showIP (netmask 20)", expected: '"255.255.240.0"' },
        { expr: "netmask 8", expected: "4278190080" },
        { expr: "netmask 32", expected: "4294967295" },
        { expr: "netmask 0", expected: "0" },
      ],
      hint: "`bit p - 1` has the lowest `p` bits set. Shift it up so it sits at the top of the 32: `shiftL (bit p - 1) (32 - p)`.",
      solution: hs`netmask :: Int -> IP
netmask p = shiftL (bit p - 1) (32 - p)
`,
    },
    {
      k: "write",
      body: md(
        ipStory,
        "",
        "`netmask` is given (see the previous question). Two addresses are on the same network with prefix length `p` if their top `p` bits agree. Define a function `sameNetwork :: Int -> IP -> IP -> Bool` that tests this. For example:",
        "",
        "```",
        "*Main> sameNetwork 24 (packIP (192,168,1,10)) (packIP (192,168,1,200))",
        "True",
        "*Main> sameNetwork 24 (packIP (192,168,1,10)) (packIP (192,168,2,1))",
        "False",
        "*Main> sameNetwork 16 (packIP (192,168,1,10)) (packIP (192,168,2,1))",
        "True",
        "```",
      ),
      setup: ipTypes + hs`
netmask :: Int -> IP
netmask p = shiftL (bit p - 1) (32 - p)
`,
      starter: hs`sameNetwork :: Int -> IP -> IP -> Bool
sameNetwork p a b = undefined
`,
      tests: [
        { expr: "sameNetwork 24 (packIP (192,168,1,10)) (packIP (192,168,1,200))", expected: "True" },
        { expr: "sameNetwork 24 (packIP (192,168,1,10)) (packIP (192,168,2,1))", expected: "False" },
        { expr: "sameNetwork 16 (packIP (192,168,1,10)) (packIP (192,168,2,1))", expected: "True" },
        { expr: "sameNetwork 0 (packIP (1,2,3,4)) (packIP (200,0,0,9))", expected: "True" },
        { expr: "sameNetwork 32 (packIP (1,2,3,4)) (packIP (1,2,3,5))", expected: "False" },
      ],
      hint: "Mask both with `netmask p` (using `.&.`) and compare the results.",
      solution: hs`sameNetwork :: Int -> IP -> IP -> Bool
sameNetwork p a b = a .&. m == b .&. m
  where
    m = netmask p
`,
    },
    {
      k: "write",
      body: md(
        "**Sensor readings.** A house has temperature sensors. Each reading is a pair of the sensor's name and the value it read.",
        "",
        "```",
        "type Reading = (String, Double)",
        "```",
        "",
        "Define a function `meanOf :: String -> [Reading] -> Maybe Double` that returns the mean of all the readings from the named sensor, or `Nothing` if there are none. For example, using `readings1` from the given code:",
        "",
        "```",
        "*Main> meanOf \"hall\" readings1",
        "Just 17.5",
        "*Main> meanOf \"attic\" readings1",
        "Nothing",
        "```",
      ),
      setup: hs`type Reading = (String, Double)

readings1 :: [Reading]
readings1 =
  [ ("kitchen", 21.5), ("hall", 18.0), ("kitchen", 22.5)
  , ("garage", 9.0), ("hall", 17.0), ("kitchen", 20.0)
  ]
`,
      starter: hs`meanOf :: String -> [Reading] -> Maybe Double
meanOf name rs = undefined
`,
      tests: [
        { expr: 'meanOf "hall" readings1', expected: "Just 17.5" },
        { expr: 'meanOf "garage" readings1', expected: "Just 9.0" },
        { expr: 'fmap (\\m -> abs (m - 64 / 3) < 1e-9) (meanOf "kitchen" readings1)', expected: "Just True", label: 'meanOf "kitchen" readings1 ≈ Just 21.333333333333332' },
        { expr: 'meanOf "attic" readings1', expected: "Nothing" },
        { expr: 'meanOf "hall" []', expected: "Nothing" },
      ],
      hint: "`vs = [v | (n, v) <- rs, n == name]`. If `null vs` the answer is `Nothing`, else `Just (sum vs / fromIntegral (length vs))`.",
      solution: hs`meanOf :: String -> [Reading] -> Maybe Double
meanOf name rs
  | null vs = Nothing
  | otherwise = Just (sum vs / fromIntegral (length vs))
  where
    vs = [v | (n, v) <- rs, n == name]
`,
    },
    {
      k: "write",
      body: md(
        "**Marks.** A mark `m` out of `t` (with `t > 0`) is classified by its percentage: 70% or more is `'A'`, 60% or more `'B'`, 50% or more `'C'`, 40% or more `'D'`, and anything lower `'F'`.",
        "",
        "Define a function `grade :: Int -> Int -> Char` that returns the classification. Your answer must be exact on the boundaries, so it's best to compare whole numbers (`100 * m` against `70 * t`) rather than Doubles. For example:",
        "",
        "```",
        "*Main> grade 70 100",
        "'A'",
        "*Main> grade 21 30",
        "'A'",
        "*Main> grade 59 100",
        "'C'",
        "*Main> grade 2 5",
        "'D'",
        "```",
      ),
      starter: hs`grade :: Int -> Int -> Char
grade m t = undefined
`,
      tests: [
        { expr: "grade 70 100", expected: "'A'" },
        { expr: "grade 21 30", expected: "'A'" },
        { expr: "grade 59 100", expected: "'C'" },
        { expr: "grade 2 5", expected: "'D'" },
        { expr: "grade 0 10", expected: "'F'" },
        { expr: "grade 179 300", expected: "'C'" },
        { expr: "grade 3 5", expected: "'B'" },
        { expr: "grade 29 100", expected: "'F'" },
      ],
      hint: "Guards, checked from the top band down: `100 * m >= 70 * t = 'A'`, then 60, 50, 40, and `otherwise = 'F'`.",
      solution: hs`grade :: Int -> Int -> Char
grade m t
  | 100 * m >= 70 * t = 'A'
  | 100 * m >= 60 * t = 'B'
  | 100 * m >= 50 * t = 'C'
  | 100 * m >= 40 * t = 'D'
  | otherwise = 'F'
`,
    },
    {
      k: "write",
      body: md(
        "**Marks.** A module is assessed by several pieces of work. Each is a triple `(mark, outOf, weight)`, where `weight` is the percentage of the module it's worth; the weights add up to 100.",
        "",
        "Define a function `weightedTotal :: [(Int, Int, Int)] -> Double` that returns the module total as a percentage. Each piece contributes `mark / outOf * weight`. For example:",
        "",
        "```",
        "*Main> weightedTotal [(45, 50, 40), (30, 60, 60)]",
        "66.0",
        "*Main> weightedTotal [(10, 10, 100)]",
        "100.0",
        "```",
      ),
      starter: hs`weightedTotal :: [(Int, Int, Int)] -> Double
weightedTotal ws = undefined
`,
      tests: [
        close("weightedTotal [(45, 50, 40), (30, 60, 60)]", "66"),
        close("weightedTotal [(10, 10, 100)]", "100"),
        close("weightedTotal [(0, 20, 50), (20, 20, 50)]", "50"),
        close("weightedTotal [(1, 3, 30), (2, 3, 30), (4, 8, 40)]", "50"),
        close("weightedTotal []", "0"),
      ],
      hint: "All three numbers are Ints, so convert them: `sum [fromIntegral m / fromIntegral o * fromIntegral w | (m, o, w) <- ws]`.",
      solution: hs`weightedTotal :: [(Int, Int, Int)] -> Double
weightedTotal ws = sum [fromIntegral m / fromIntegral o * fromIntegral w | (m, o, w) <- ws]
`,
    },
    {
      k: "write",
      body: md(
        "**Sensor readings.** A reading is an outlier if its distance from the mean is MORE than `k` standard deviations. Use the population standard deviation: the square root of the mean of (x − mean)².",
        "",
        "Define a function `outliers :: Double -> [Double] -> [Double]` that returns the outliers in their original order. For example:",
        "",
        "```",
        "*Main> outliers 1 [1, 2, 3, 4, 5]",
        "[1.0,5.0]",
        "*Main> outliers 1.5 [10, 12, 11, 13, 40]",
        "[40.0]",
        "*Main> outliers 1 [5, 5, 5]",
        "[]",
        "```",
      ),
      starter: hs`outliers :: Double -> [Double] -> [Double]
outliers k xs = undefined
`,
      tests: [
        { expr: "outliers 1 [1, 2, 3, 4, 5]", expected: "[1.0, 5.0]" },
        { expr: "outliers 1.5 [10, 12, 11, 13, 40]", expected: "[40.0]" },
        { expr: "outliers 1 [5, 5, 5]", expected: "[]" },
        { expr: "outliers 2 []", expected: "[]" },
        { expr: "outliers 0.5 [0, 10, 4, 6]", expected: "[0.0, 10.0]" },
      ],
      hint: "Work out `n`, `m` (the mean) and `s` (the standard deviation) in a `where`, then `[x | x <- xs, abs (x - m) > k * s]`. Guard for the empty list so you don't divide by zero.",
      solution: hs`outliers :: Double -> [Double] -> [Double]
outliers _ [] = []
outliers k xs = [x | x <- xs, abs (x - m) > k * s]
  where
    n = fromIntegral (length xs)
    m = sum xs / n
    s = sqrt (sum [(x - m) ^ 2 | x <- xs] / n)
`,
    },
    {
      k: "write",
      body: md(
        "**Exact polynomials.** A polynomial is a list of Rational coefficients, lowest power first, so `[1, 1 % 2]` means 1 + ½x.",
        "",
        "```",
        "type Poly = [Rational]",
        "```",
        "",
        "Define a function `evalP :: Poly -> Rational -> Rational` that evaluates a polynomial exactly. For example:",
        "",
        "```",
        "*Main> evalP [1, 1 % 2] 4",
        "3 % 1",
        "*Main> evalP [1, -1, 1] (1 % 2)",
        "3 % 4",
        "```",
      ),
      setup: ratio + hs`
type Poly = [Rational]
`,
      starter: hs`evalP :: Poly -> Rational -> Rational
evalP p x = undefined
`,
      tests: [
        { expr: "evalP [1, 1 % 2] 4", expected: "3 % 1" },
        { expr: "evalP [1, -1, 1] (1 % 2)", expected: "3 % 4" },
        { expr: "evalP [0, 0, 1] (2 % 3)", expected: "4 % 9" },
        { expr: "evalP [] 7", expected: "0" },
        { expr: "evalP [5] (1 % 9)", expected: "5" },
      ],
      hint: "Horner's rule works unchanged on Rationals: `foldr (\\c acc -> c + x * acc) 0 p`.",
      solution: hs`evalP :: Poly -> Rational -> Rational
evalP p x = foldr (\c acc -> c + x * acc) 0 p
`,
    },
    {
      k: "write",
      body: md(
        "**Exact polynomials.** `type Poly = [Rational]`, lowest power first.",
        "",
        "Define a function `integrateP :: Poly -> Poly` that returns the integral of a polynomial with constant term 0. The term c·xⁱ integrates to c/(i+1)·xⁱ⁺¹. For example:",
        "",
        "```",
        "*Main> integrateP [1, 2, 3]",
        "[0 % 1,1 % 1,1 % 1,1 % 1]",
        "*Main> integrateP [0, 0, 1]",
        "[0 % 1,0 % 1,0 % 1,1 % 3]",
        "*Main> integrateP []",
        "[0 % 1]",
        "```",
      ),
      setup: ratio + hs`
type Poly = [Rational]
`,
      starter: hs`integrateP :: Poly -> Poly
integrateP p = undefined
`,
      tests: [
        { expr: "integrateP [1, 2, 3]", expected: "[0, 1, 1, 1]" },
        { expr: "integrateP [0, 0, 1]", expected: "[0, 0, 0, 1 % 3]" },
        { expr: "integrateP [1 % 2]", expected: "[0, 1 % 2]" },
        { expr: "integrateP [4, 0, 0, 1]", expected: "[0, 4, 0, 0, 1 % 4]" },
        { expr: "integrateP []", expected: "[0]" },
      ],
      hint: "The new constant 0 goes on the front; then divide each coefficient by its new power: `0 : zipWith (/) p [1 ..]`.",
      solution: hs`integrateP :: Poly -> Poly
integrateP p = 0 : zipWith (/) p [1 ..]
`,
    },
    {
      k: "write",
      body: md(
        boardStory,
        "",
        "Define a function `neighbours :: Board -> (Int, Int) -> Int` that returns how many of the (up to eight) squares touching square `(r, c)`, including diagonally, are filled. The square itself doesn't count, and squares off the edge of the board don't exist. For example:",
        "",
        "```",
        "*Main> neighbours 65535 (0, 0)",
        "3",
        "*Main> neighbours 65535 (1, 1)",
        "8",
        "*Main> neighbours (bit (cell 1 0)) (0, 3)",
        "0",
        "```",
        "",
        "The last example matters: bit 4 is right after bit 3 in the number, but square (1, 0) is on the other side of the board from (0, 3).",
      ),
      setup: boardTypes,
      starter: hs`neighbours :: Board -> (Int, Int) -> Int
neighbours b (r, c) = undefined
`,
      tests: [
        { expr: "neighbours 65535 (0, 0)", expected: "3" },
        { expr: "neighbours 65535 (1, 1)", expected: "8" },
        { expr: "neighbours 65535 (0, 1)", expected: "5" },
        { expr: "neighbours (bit (cell 1 0)) (0, 3)", expected: "0" },
        { expr: "neighbours (bit (cell 1 1)) (0, 0)", expected: "1" },
        { expr: "neighbours (bit (cell 1 1)) (1, 1)", expected: "0" },
        { expr: "neighbours (bit (cell 3 3) + bit (cell 2 2)) (3, 2)", expected: "2" },
      ],
      hint: "Count over `dr <- [-1, 0, 1]` and `dc <- [-1, 0, 1]`, skipping `(0, 0)`. Work out `r' = r + dr` and `c' = c + dc`, keep only those with both in 0 to 3, and test the bit `cell r' c'`.",
      solution: hs`neighbours :: Board -> (Int, Int) -> Int
neighbours b (r, c) =
  length
    [ ()
    | dr <- [-1, 0, 1]
    , dc <- [-1, 0, 1]
    , (dr, dc) /= (0, 0)
    , let r' = r + dr
    , let c' = c + dc
    , r' >= 0, r' < 4, c' >= 0, c' < 4
    , testBit b (cell r' c')
    ]
`,
    },
    {
      k: "write",
      body: md(
        boardStory,
        "",
        "In a falling-blocks game, a full row disappears and every row above it drops down by one; empty rows appear at the top.",
        "",
        "Define functions `fullRows :: Board -> [Int]`, which returns the numbers of the full rows in increasing order, and `clearRows :: Board -> Board`, which removes all the full rows at once. For example:",
        "",
        "```",
        "*Main> fullRows 40815",
        "[0,2]",
        "*Main> clearRows 40815",
        "150",
        "*Main> clearRows 31",
        "1",
        "```",
        "",
        "In hexadecimal, 40815 is 9F6F: rows 3, 2, 1, 0 are 1001, 1111, 0110, 1111. Rows 0 and 2 go, row 1 (0110) drops to row 0 and row 3 (1001) drops to row 1, giving hexadecimal 96, which is 150.",
      ),
      setup: boardTypes,
      starter: hs`fullRows :: Board -> [Int]
fullRows b = undefined

clearRows :: Board -> Board
clearRows b = undefined
`,
      tests: [
        { expr: "fullRows 40815", expected: "[0, 2]" },
        { expr: "fullRows 0", expected: "[]" },
        { expr: "fullRows 65535", expected: "[0, 1, 2, 3]" },
        { expr: "clearRows 40815", expected: "150" },
        { expr: "clearRows 31", expected: "1" },
        { expr: "clearRows 61680", expected: "0" },
        { expr: "clearRows 1234", expected: "1234" },
        { expr: "clearRows 65535", expected: "0" },
      ],
      hint: "Row `r` as a number from 0 to 15 is `shiftR b (4 * r) .&. 15`, and a row is full when that's 15. For `clearRows`, keep the rows that aren't full (bottom first), then rebuild: `foldr (\\row acc -> shiftL acc 4 .|. row) 0 kept`.",
      solution: hs`row :: Board -> Int -> Int
row b r = shiftR b (4 * r) .&. 15

fullRows :: Board -> [Int]
fullRows b = [r | r <- [0 .. 3], row b r == 15]

clearRows :: Board -> Board
clearRows b = foldr (\x acc -> shiftL acc 4 .|. x) 0 kept
  where
    kept = [row b r | r <- [0 .. 3], row b r /= 15]
`,
    },
    {
      k: "write",
      body: md(
        "**Exact decimals.** Define a function `decimals :: Rational -> Int -> String` that writes a non-negative Rational as a decimal with exactly `n` digits after the point (`n` is at least 1). Extra digits are cut off, not rounded. For example:",
        "",
        "```",
        "*Main> decimals (1 % 3) 4",
        "\"0.3333\"",
        "*Main> decimals (22 % 7) 5",
        "\"3.14285\"",
        "*Main> decimals 5 2",
        "\"5.00\"",
        "*Main> decimals (1 % 8) 2",
        "\"0.12\"",
        "```",
        "",
        "Use long division: multiply the fractional part by 10; the whole part of the result is the next digit.",
      ),
      setup: ratio,
      starter: hs`decimals :: Rational -> Int -> String
decimals r n = undefined
`,
      tests: [
        { expr: "decimals (1 % 3) 4", expected: '"0.3333"' },
        { expr: "decimals (22 % 7) 5", expected: '"3.14285"' },
        { expr: "decimals 5 2", expected: '"5.00"' },
        { expr: "decimals (1 % 8) 2", expected: '"0.12"' },
        { expr: "decimals (7 % 2) 3", expected: '"3.500"' },
        { expr: "decimals (123 % 10) 1", expected: '"12.3"' },
      ],
      hint: "Let `w = floor r :: Integer`. The answer is `show w ++ \".\" ++ go (r - fromIntegral w) n`, where `go` multiplies by 10, takes `d = floor` of that as the next digit, and recurses on what's left with one fewer digit to go.",
      solution: hs`decimals :: Rational -> Int -> String
decimals r n = show w ++ "." ++ go (r - fromIntegral w) n
  where
    w = floor r :: Integer
    go :: Rational -> Int -> String
    go _ 0 = ""
    go f k = show d ++ go (f10 - fromIntegral d) (k - 1)
      where
        f10 = f * 10
        d = floor f10 :: Integer
`,
    },
    {
      k: "write",
      body: md(
        "**Continued fractions.** Every Rational can be written as a₀ + 1/(a₁ + 1/(a₂ + ...)), stored as the list `[a0, a1, a2, ...]`. To find it: a₀ is `floor r`; if `r` is a whole number you stop, otherwise carry on with 1/(r − a₀).",
        "",
        "Define functions `cf :: Rational -> [Integer]` and `fromCF :: [Integer] -> Rational` (for non-empty lists) that convert in each direction. For example:",
        "",
        "```",
        "*Main> cf (415 % 93)",
        "[4,2,6,7]",
        "*Main> cf ((-7) % 2)",
        "[-4,2]",
        "*Main> fromCF [4,2,6,7]",
        "415 % 93",
        "*Main> fromCF [1,1,1,1]",
        "5 % 3",
        "```",
      ),
      setup: ratio,
      starter: hs`cf :: Rational -> [Integer]
cf r = undefined

fromCF :: [Integer] -> Rational
fromCF as = undefined
`,
      tests: [
        { expr: "cf (415 % 93)", expected: "[4, 2, 6, 7]" },
        { expr: "cf 3", expected: "[3]" },
        { expr: "cf (1 % 3)", expected: "[0, 3]" },
        { expr: "cf ((-7) % 2)", expected: "[-4, 2]" },
        { expr: "fromCF [4, 2, 6, 7]", expected: "415 % 93" },
        { expr: "fromCF [1, 1, 1, 1]", expected: "5 % 3" },
        { expr: "fromCF [0, 3]", expected: "1 % 3" },
        { expr: "fromCF (cf (355 % 113))", expected: "355 % 113" },
      ],
      hint: "In `cf`, let `a = floor r` and `f = r - fromIntegral a`. If `f == 0` the answer is `[a]`, else `a : cf (1 / f)`. For `fromCF`: `fromCF [a] = fromIntegral a` and `fromCF (a : rest) = fromIntegral a + 1 / fromCF rest`.",
      solution: hs`cf :: Rational -> [Integer]
cf r
  | f == 0 = [a]
  | otherwise = a : cf (1 / f)
  where
    a = floor r
    f = r - fromIntegral a

fromCF :: [Integer] -> Rational
fromCF [a] = fromIntegral a
fromCF (a : rest) = fromIntegral a + 1 / fromCF rest
`,
    },
    {
      k: "write",
      body: md(
        "**Packed arrays.** A list of small non-negative numbers can be stored in one Int by giving each element a block of `b` bits: element 0 in bits 0 to b−1, element 1 in the next `b` bits, and so on.",
        "",
        "Define a function `packAll :: Int -> [Int] -> Maybe Int` that packs a list this way. The result is `Nothing` if `b` is less than 1, if any element is negative or doesn't fit in `b` bits, or if the whole list would need more than 63 bits. Also define `unpack :: Int -> Int -> Int -> [Int]`, where `unpack b k n` returns the first `k` elements packed in `n`. For example:",
        "",
        "```",
        "*Main> packAll 4 [7, 0, 2, 13]",
        "Just 53767",
        "*Main> packAll 4 [16]",
        "Nothing",
        "*Main> packAll 9 (replicate 8 1)",
        "Nothing",
        "*Main> unpack 4 4 53767",
        "[7,0,2,13]",
        "*Main> unpack 8 2 53767",
        "[7,210]",
        "```",
      ),
      setup: bits,
      starter: hs`packAll :: Int -> [Int] -> Maybe Int
packAll b xs = undefined

unpack :: Int -> Int -> Int -> [Int]
unpack b k n = undefined
`,
      tests: [
        { expr: "packAll 4 [7, 0, 2, 13]", expected: "Just 53767" },
        { expr: "packAll 4 [16]", expected: "Nothing" },
        { expr: "packAll 3 [1, -1]", expected: "Nothing" },
        { expr: "packAll 9 (replicate 8 1)", expected: "Nothing" },
        { expr: "packAll 7 (replicate 9 127) == Just (bit 63 - 1)", expected: "True" },
        { expr: "packAll 0 []", expected: "Nothing" },
        { expr: "packAll 8 []", expected: "Just 0" },
        { expr: "unpack 4 4 53767", expected: "[7, 0, 2, 13]" },
        { expr: "unpack 8 2 53767", expected: "[7, 210]" },
        { expr: "unpack 3 0 99", expected: "[]" },
        { expr: "fmap (unpack 5 3) (packAll 5 [31, 0, 17])", expected: "Just [31, 0, 17]" },
      ],
      hint: "Check the three failure conditions in guards: `b < 1`, `b * length xs > 63`, and `any (\\x -> x < 0 || x >= bit b) xs`. Then build with `foldr (\\x acc -> shiftL acc b .|. x) 0 xs`. `unpack` is a list comprehension over `i <- [0 .. k - 1]` with `shiftR n (i * b) .&. (bit b - 1)`.",
      solution: hs`packAll :: Int -> [Int] -> Maybe Int
packAll b xs
  | b < 1 = Nothing
  | b * length xs > 63 = Nothing
  | any (\x -> x < 0 || x >= bit b) xs = Nothing
  | otherwise = Just (foldr (\x acc -> shiftL acc b .|. x) 0 xs)

unpack :: Int -> Int -> Int -> [Int]
unpack b k n = [shiftR n (i * b) .&. (bit b - 1) | i <- [0 .. k - 1]]
`,
    },
  ],
};

const extra: DrillSet = {
  id: "b-numbers-extra",
  lesson: "",
  level: 5,
  title: "Extra practice",
  intro: md(
    "More of the same work with Int, Double, Rational and bits, mixed difficulty, so you can keep practising without new ideas.",
    "Toward the end the questions are exam-style: a short description, a type, and a GHCi transcript.",
  ),
  drills: [
    {
      k: "quiz",
      q: "What is `div (-7) 2` in Haskell?",
      options: ["`-3`", "`-4`", "`-3.5`", "`3`"],
      answer: 1,
      why: "`div` rounds toward negative infinity, so `-7` divided by `2` is `-4` remainder `1` (`mod` is never negative here).",
    },
    {
      k: "predict",
      expr: "mod (-7) 2",
      answer: "1",
      why: "`div (-7) 2` is `-4` and `(-4) * 2 + 1` is `-7`, so `mod` is 1. Haskell's `mod` matches `div`.",
    },
    {
      k: "write",
      body: "Write `firstDigit`, the leading decimal digit of a number. For a negative number, use the digit you'd see when writing it down, so `firstDigit (-56)` is 5.",
      starter: hs`firstDigit :: Int -> Int
firstDigit n = undefined
`,
      tests: [
        { expr: "firstDigit 1234", expected: "1" },
        { expr: "firstDigit 7", expected: "7" },
        { expr: "firstDigit 0", expected: "0" },
        { expr: "firstDigit (-56)", expected: "5" },
        { expr: "firstDigit 90", expected: "9" },
      ],
      hint: "Work with `abs n`. While the number is 10 or more, divide by 10.",
      solution: hs`firstDigit :: Int -> Int
firstDigit n = go (abs n)
  where
    go x
      | x < 10    = x
      | otherwise = go (div x 10)
`,
    },
    {
      k: "write",
      body: "Write `absDiff`, the absolute difference of two Ints.",
      starter: hs`absDiff :: Int -> Int -> Int
absDiff a b = undefined
`,
      tests: [
        { expr: "absDiff 3 10", expected: "7" },
        { expr: "absDiff 10 3", expected: "7" },
        { expr: "absDiff 4 4", expected: "0" },
        { expr: "absDiff (-2) 5", expected: "7" },
      ],
      hint: "`abs (a - b)`.",
      solution: hs`absDiff :: Int -> Int -> Int
absDiff a b = abs (a - b)
`,
    },
    {
      k: "write",
      body: "Write `clampInt lo hi x`, which forces `x` into the closed interval from `lo` to `hi`. You may assume `lo <= hi`.",
      starter: hs`clampInt :: Int -> Int -> Int -> Int
clampInt lo hi x = undefined
`,
      tests: [
        { expr: "clampInt 0 10 7", expected: "7" },
        { expr: "clampInt 0 10 (-3)", expected: "0" },
        { expr: "clampInt 0 10 99", expected: "10" },
        { expr: "clampInt 5 5 0", expected: "5" },
      ],
      hint: "`max lo (min hi x)`.",
      solution: hs`clampInt :: Int -> Int -> Int -> Int
clampInt lo hi x = max lo (min hi x)
`,
    },
    {
      k: "write",
      body: "Write `signOf`, which returns `-1` if the number is negative, `0` if it is zero, and `1` if it is positive. Do not use `signum`.",
      starter: hs`signOf :: Int -> Int
signOf n = undefined
`,
      banned: ["signum"],
      tests: [
        { expr: "signOf 8", expected: "1" },
        { expr: "signOf 0", expected: "0" },
        { expr: "signOf (-3)", expected: "-1" },
        { expr: "signOf 1", expected: "1" },
      ],
      hint: "Three guards: `n > 0`, `n < 0`, otherwise 0.",
      solution: hs`signOf :: Int -> Int
signOf n
  | n > 0     = 1
  | n < 0     = -1
  | otherwise = 0
`,
    },
    {
      k: "write",
      body: "Write `powInt base exp`, integer power for a non-negative exponent. `powInt _ 0` is 1, including `powInt 0 0`.",
      starter: hs`powInt :: Int -> Int -> Int
powInt base exp = undefined
`,
      tests: [
        { expr: "powInt 2 10", expected: "1024" },
        { expr: "powInt 5 0", expected: "1" },
        { expr: "powInt 0 0", expected: "1" },
        { expr: "powInt 3 3", expected: "27" },
        { expr: "powInt (-2) 3", expected: "-8" },
      ],
      hint: "If `exp == 0` return 1. Otherwise `base * powInt base (exp - 1)`.",
      solution: hs`powInt :: Int -> Int -> Int
powInt _ 0 = 1
powInt base exp = base * powInt base (exp - 1)
`,
      banned: ["^", "^^", "**"],
    },
    {
      k: "write",
      body: "Write `factorialOf n` for `n >= 0`. `factorialOf 0` is 1.",
      starter: hs`factorialOf :: Int -> Int
factorialOf n = undefined
`,
      tests: [
        { expr: "factorialOf 0", expected: "1" },
        { expr: "factorialOf 1", expected: "1" },
        { expr: "factorialOf 5", expected: "120" },
        { expr: "factorialOf 6", expected: "720" },
      ],
      hint: "`factorialOf 0 = 1` and otherwise `n * factorialOf (n - 1)`.",
      solution: hs`factorialOf :: Int -> Int
factorialOf 0 = 1
factorialOf n = n * factorialOf (n - 1)
`,
      banned: ["product"],
    },
    {
      k: "write",
      body: "Write `myLcm`, the least common multiple of two Ints. You may use `gcd`. The answer should be non-negative. `myLcm 0 0` is 0.",
      starter: hs`myLcm :: Int -> Int -> Int
myLcm a b = undefined
`,
      tests: [
        { expr: "myLcm 4 6", expected: "12" },
        { expr: "myLcm 7 1", expected: "7" },
        { expr: "myLcm 0 5", expected: "0" },
        { expr: "myLcm (-4) 6", expected: "12" },
        { expr: "myLcm 0 0", expected: "0" },
      ],
      hint: "If either is 0 the lcm is 0. Otherwise `div (abs (a * b)) (gcd a b)`.",
      solution: hs`myLcm :: Int -> Int -> Int
myLcm a b
  | a == 0 || b == 0 = 0
  | otherwise        = div (abs (a * b)) (gcd a b)
`,
      banned: ["lcm"],
    },
    {
      k: "write",
      body: "Write `reverseDigits`, which reverses the decimal digits of a number and keeps the sign. Trailing zeros of the original become leading zeros of the reverse and disappear, so `reverseDigits 120` is 21.",
      starter: hs`reverseDigits :: Int -> Int
reverseDigits n = undefined
`,
      tests: [
        { expr: "reverseDigits 123", expected: "321" },
        { expr: "reverseDigits 120", expected: "21" },
        { expr: "reverseDigits 7", expected: "7" },
        { expr: "reverseDigits 0", expected: "0" },
        { expr: "reverseDigits (-45)", expected: "-54" },
      ],
      hint: "Keep the sign separately. A helper that takes an accumulator, `go m acc = go (div m 10) (acc * 10 + mod m 10)`, builds the reverse.",
      solution: hs`reverseDigits :: Int -> Int
reverseDigits n = signum n * go (abs n) 0
  where
    go 0 acc = acc
    go m acc = go (div m 10) (acc * 10 + mod m 10)
`,
    },
    {
      k: "write",
      body: "Write `isPalNum`, which is True when a number's decimal digits read the same forwards and backwards. The sign is ignored, so `-121` is a palindrome.",
      starter: hs`isPalNum :: Int -> Bool
isPalNum n = undefined
`,
      tests: [
        { expr: "isPalNum 121", expected: "True" },
        { expr: "isPalNum 10", expected: "False" },
        { expr: "isPalNum 7", expected: "True" },
        { expr: "isPalNum 0", expected: "True" },
        { expr: "isPalNum (-121)", expected: "True" },
      ],
      hint: "Compare `abs n` with the number you get by reversing its digits.",
      solution: hs`isPalNum :: Int -> Bool
isPalNum n = m == go m 0
  where
    m = abs n
    go 0 acc = acc
    go x acc = go (div x 10) (acc * 10 + mod x 10)
`,
    },
    {
      k: "write",
      setup: bits,
      body: "Write `bitCount`, the number of 1 bits in a non-negative Int. Do not use `popCount`. `Data.Bits` is imported for you.",
      starter: hs`bitCount :: Int -> Int
bitCount n = undefined
`,
      banned: ["popCount"],
      tests: [
        { expr: "bitCount 0", expected: "0" },
        { expr: "bitCount 1", expected: "1" },
        { expr: "bitCount 255", expected: "8" },
        { expr: "bitCount 10", expected: "2" },
        { expr: "bitCount 1024", expected: "1" },
      ],
      hint: "If `n == 0` stop. Otherwise add the lowest bit (`n .&. 1`) and recurse on `shiftR n 1`.",
      solution: hs`bitCount :: Int -> Int
bitCount 0 = 0
bitCount n = (n .&. 1) + bitCount (shiftR n 1)
`,
    },
    {
      k: "write",
      setup: bits,
      body: "Write `lowBits n k`, which keeps only the lowest `k` bits of `n` and clears the rest. If `k` is 0 or less, the answer is 0. `Data.Bits` is imported.",
      starter: hs`lowBits :: Int -> Int -> Int
lowBits n k = undefined
`,
      tests: [
        { expr: "lowBits 13 3", expected: "5" },
        { expr: "lowBits 13 0", expected: "0" },
        { expr: "lowBits 255 8", expected: "255" },
        { expr: "lowBits 5 1", expected: "1" },
        { expr: "lowBits 5 (-1)", expected: "0" },
      ],
      hint: "The mask of `k` ones is `bit k - 1`. Then `n .&. mask`.",
      solution: hs`lowBits :: Int -> Int -> Int
lowBits n k
  | k <= 0    = 0
  | otherwise = n .&. (bit k - 1)
`,
    },
    {
      k: "write",
      setup: bits,
      body: "Write `highNibble`, the high 4 bits of the lowest byte of `n` (bits 4 to 7), as a number 0 to 15.",
      starter: hs`highNibble :: Int -> Int
highNibble n = undefined
`,
      tests: [
        { expr: "highNibble 0", expected: "0" },
        { expr: "highNibble 255", expected: "15" },
        { expr: "highNibble 16", expected: "1" },
        { expr: "highNibble 171", expected: "10" },
        { expr: "highNibble 15", expected: "0" },
      ],
      hint: "`shiftR n 4 .&. 15`.",
      solution: hs`highNibble :: Int -> Int
highNibble n = shiftR n 4 .&. 15
`,
    },
    {
      k: "write",
      setup: ratio,
      body: "Write `ratSum`, the sum of two Rationals. `Data.Ratio` is imported.",
      starter: hs`ratSum :: Rational -> Rational -> Rational
ratSum a b = undefined
`,
      tests: [
        { expr: "ratSum (1 % 2) (1 % 3)", expected: "5 % 6" },
        { expr: "ratSum (1 % 2) (1 % 2)", expected: "1 % 1" },
        { expr: "ratSum (0 % 1) (2 % 5)", expected: "2 % 5" },
        { expr: "ratSum ((-1) % 4) (1 % 4)", expected: "0 % 1" },
      ],
      hint: "Rationals already add with `+`.",
      solution: hs`ratSum :: Rational -> Rational -> Rational
ratSum a b = a + b
`,
    },
    {
      k: "write",
      setup: ratio,
      body: "Write `ratRecip`, the reciprocal of a Rational, or `Nothing` if it is 0.",
      starter: hs`ratRecip :: Rational -> Maybe Rational
ratRecip x = undefined
`,
      tests: [
        { expr: "ratRecip (2 % 3)", expected: "Just (3 % 2)" },
        { expr: "ratRecip (0 % 1)", expected: "Nothing" },
        { expr: "ratRecip (1 % 1)", expected: "Just (1 % 1)" },
        { expr: "ratRecip ((-2) % 5)", expected: "Just ((-5) % 2)" },
      ],
      hint: "If `x == 0` then `Nothing`, else `Just (recip x)` or `Just (1 / x)`.",
      solution: hs`ratRecip :: Rational -> Maybe Rational
ratRecip 0 = Nothing
ratRecip x = Just (recip x)
`,
    },
    {
      k: "write",
      body: "Write `ceilDiv a b`, the smallest Int `q` such that `q * b >= a`, for positive `b`. You may assume `b > 0`. This is ceiling-division.",
      starter: hs`ceilDiv :: Int -> Int -> Int
ceilDiv a b = undefined
`,
      tests: [
        { expr: "ceilDiv 7 3", expected: "3" },
        { expr: "ceilDiv 6 3", expected: "2" },
        { expr: "ceilDiv 1 10", expected: "1" },
        { expr: "ceilDiv 0 5", expected: "0" },
        { expr: "ceilDiv 5 1", expected: "5" },
      ],
      hint: "`div (a + b - 1) b` works when `a >= 0` and `b > 0`.",
      solution: hs`ceilDiv :: Int -> Int -> Int
ceilDiv a b = div (a + b - 1) b
`,
    },
    {
      k: "write",
      body: "Write `fromBinBits`, which reads a String of `'0'` and `'1'` as a non-negative Int. If the string is empty or contains any other character, return `Nothing`.",
      starter: hs`fromBinBits :: String -> Maybe Int
fromBinBits s = undefined
`,
      tests: [
        { expr: `fromBinBits "101"`, expected: "Just 5" },
        { expr: `fromBinBits "0"`, expected: "Just 0" },
        { expr: `fromBinBits ""`, expected: "Nothing" },
        { expr: `fromBinBits "102"`, expected: "Nothing" },
        { expr: `fromBinBits "1000"`, expected: "Just 8" },
      ],
      hint: "Fold from the left: start at 0, each `'0'` does `2 * acc`, each `'1'` does `2 * acc + 1`, anything else fails.",
      solution: hs`fromBinBits :: String -> Maybe Int
fromBinBits [] = Nothing
fromBinBits s = go 0 s
  where
    go acc [] = Just acc
    go acc (c : cs)
      | c == '0'  = go (2 * acc) cs
      | c == '1'  = go (2 * acc + 1) cs
      | otherwise = Nothing
`,
    },
    {
      k: "write",
      body: "Write `toBinBits`, the binary digits of a non-negative Int as a String with no leading zeros. `toBinBits 0` is `\"0\"`.",
      starter: hs`toBinBits :: Int -> String
toBinBits n = undefined
`,
      tests: [
        { expr: "toBinBits 0", expected: '"0"' },
        { expr: "toBinBits 1", expected: '"1"' },
        { expr: "toBinBits 5", expected: '"101"' },
        { expr: "toBinBits 8", expected: '"1000"' },
        { expr: "toBinBits 255", expected: '"11111111"' },
      ],
      hint: "A helper collecting remainders `mod 2` builds the bits last-first; reverse them. Handle 0 on its own.",
      solution: hs`toBinBits :: Int -> String
toBinBits 0 = "0"
toBinBits n = reverse (go n)
  where
    go 0 = []
    go m = (if even m then '0' else '1') : go (div m 2)
`,
    },
    {
      k: "write",
      body: "Write `subPoly`, which subtracts two polynomials stored as lists of coefficients, lowest degree first. When one list is shorter, treat missing coefficients as 0.",
      starter: hs`subPoly :: [Int] -> [Int] -> [Int]
subPoly ps qs = undefined
`,
      tests: [
        { expr: "subPoly [1, 2, 3] [1, 1]", expected: "[0, 1, 3]" },
        { expr: "subPoly [] [1, 2]", expected: "[-1, -2]" },
        { expr: "subPoly [4] []", expected: "[4]" },
        { expr: "subPoly [1, 2] [1, 2]", expected: "[0, 0]" },
      ],
      hint: "Like add, but subtract. When the second list runs out, keep the first. When the first runs out, negate the rest of the second.",
      solution: hs`subPoly :: [Int] -> [Int] -> [Int]
subPoly ps [] = ps
subPoly [] qs = map negate qs
subPoly (p : ps) (q : qs) = (p - q) : subPoly ps qs
`,
    },
    {
      k: "write",
      body: "Write `lerp a b t`, linear interpolation: `a` when `t` is 0 and `b` when `t` is 1. `t` is a Double and so is the answer.",
      starter: hs`lerp :: Double -> Double -> Double -> Double
lerp a b t = undefined
`,
      tests: [
        close("lerp 0 10 0", "0"),
        close("lerp 0 10 1", "10"),
        close("lerp 0 10 0.5", "5"),
        close("lerp 2 8 0.25", "3.5"),
      ],
      hint: "`a + (b - a) * t`.",
      solution: hs`lerp :: Double -> Double -> Double -> Double
lerp a b t = a + (b - a) * t
`,
    },
    {
      k: "write",
      body: "Write `isDivBy a b`, True when `b` divides `a` exactly. `isDivBy _ 0` is False (you cannot divide by 0).",
      starter: hs`isDivBy :: Int -> Int -> Bool
isDivBy a b = undefined
`,
      tests: [
        { expr: "isDivBy 10 5", expected: "True" },
        { expr: "isDivBy 10 3", expected: "False" },
        { expr: "isDivBy 10 0", expected: "False" },
        { expr: "isDivBy 0 7", expected: "True" },
        { expr: "isDivBy (-9) 3", expected: "True" },
      ],
      hint: "If `b == 0` then False, otherwise `mod a b == 0`.",
      solution: hs`isDivBy :: Int -> Int -> Bool
isDivBy _ 0 = False
isDivBy a b = mod a b == 0
`,
    },
    {
      k: "write",
      body: "Write `fromPercent p total`, which returns `p` percent of `total` as an Int, rounding toward zero (ordinary `div`).",
      starter: hs`fromPercent :: Int -> Int -> Int
fromPercent p total = undefined
`,
      tests: [
        { expr: "fromPercent 25 200", expected: "50" },
        { expr: "fromPercent 0 99", expected: "0" },
        { expr: "fromPercent 100 7", expected: "7" },
        { expr: "fromPercent 50 5", expected: "2" },
        { expr: "fromPercent 10 (-80)", expected: "-8" },
      ],
      hint: "`div (p * total) 100`.",
      solution: hs`fromPercent :: Int -> Int -> Int
fromPercent p total = div (p * total) 100
`,
    },
    {
      k: "write",
      body: "Write `roundDownTo n k`, which rounds `n` down to the nearest multiple of `k`. You may assume `k > 0`. For a negative `n`, still round toward negative infinity, so `roundDownTo (-7) 5` is `-10`.",
      starter: hs`roundDownTo :: Int -> Int -> Int
roundDownTo n k = undefined
`,
      tests: [
        { expr: "roundDownTo 17 5", expected: "15" },
        { expr: "roundDownTo 15 5", expected: "15" },
        { expr: "roundDownTo 0 5", expected: "0" },
        { expr: "roundDownTo (-7) 5", expected: "-10" },
        { expr: "roundDownTo 3 1", expected: "3" },
      ],
      hint: "`k * div n k` uses `div`, which already rounds toward negative infinity.",
      solution: hs`roundDownTo :: Int -> Int -> Int
roundDownTo n k = k * div n k
`,
    },
    {
      k: "write",
      setup: bits,
      body: "Write `mixBits a b`, which takes bits from `a` where `b` has a 1, and bits from 0 where `b` has a 0. In other words, it is `a` masked by `b`.",
      starter: hs`mixBits :: Int -> Int -> Int
mixBits a b = undefined
`,
      tests: [
        { expr: "mixBits 15 1", expected: "1" },
        { expr: "mixBits 255 0", expected: "0" },
        { expr: "mixBits 12 10", expected: "8" },
        { expr: "mixBits 7 7", expected: "7" },
      ],
      hint: "`a .&. b`.",
      solution: hs`mixBits :: Int -> Int -> Int
mixBits a b = a .&. b
`,
    },
    {
      k: "write",
      body: "Write `triNumber n`, the nth triangular number `0 + 1 + ... + n`. You may assume `n >= 0`. `triNumber 0` is 0.",
      starter: hs`triNumber :: Int -> Int
triNumber n = undefined
`,
      tests: [
        { expr: "triNumber 0", expected: "0" },
        { expr: "triNumber 1", expected: "1" },
        { expr: "triNumber 4", expected: "10" },
        { expr: "triNumber 10", expected: "55" },
      ],
      hint: "`div (n * (n + 1)) 2`.",
      solution: hs`triNumber :: Int -> Int
triNumber n = div (n * (n + 1)) 2
`,
    },
    {
      k: "write",
      setup: bits,
      body: "Write `maskBetween hi lo n`, which keeps bits `lo` through `hi` inclusive of `n` (counting from 0 at the low end) and clears the rest. You may assume `hi >= lo >= 0`.",
      starter: hs`maskBetween :: Int -> Int -> Int -> Int
maskBetween hi lo n = undefined
`,
      tests: [
        { expr: "maskBetween 3 0 255", expected: "15" },
        { expr: "maskBetween 5 2 255", expected: "60" },
        { expr: "maskBetween 0 0 5", expected: "1" },
        { expr: "maskBetween 10 10 1024", expected: "1024" },
        { expr: "maskBetween 2 1 0", expected: "0" },
      ],
      hint: "The mask is `bit (hi + 1) - bit lo`. Then `.&.` with `n`.",
      solution: hs`maskBetween :: Int -> Int -> Int -> Int
maskBetween hi lo n = n .&. (bit (hi + 1) - bit lo)
`,
    },
    {
      k: "quiz",
      q: "Why is `round (19.99 * 100)` safer than `floor (19.99 * 100)` when turning pounds into pence?",
      options: [
        "`floor` always gives a bigger answer",
        "`19.99 * 100` is not exactly 1999 in Double, so `floor` can drop to 1998",
        "`round` works on Ints and `floor` does not",
        "They always give the same answer",
      ],
      answer: 1,
      why: "Floating-point cannot store 19.99 exactly, so the product can come out just under 1999. `floor` then truncates to 1998; `round` still goes to 1999.",
    },
    {
      k: "predict",
      expr: "numerator (6 % 8) + denominator (6 % 8)",
      answer: "7",
      why: "`6 % 8` simplifies to `3 % 4`, so numerator 3 plus denominator 4 is 7.",
    },
    {
      k: "write",
      body: md(
        "Income tax is 0% on the first 12500 of income and 20% on anything above that. Income is a whole number of pounds.",
        "",
        "Define a function `taxDue :: Int -> Int` that returns the tax due, rounded toward zero. Negative income is treated as 0. For example:",
        "",
        "```",
        "*Main> taxDue 12500",
        "0",
        "*Main> taxDue 22500",
        "2000",
        "*Main> taxDue 0",
        "0",
        "```",
      ),
      starter: hs`taxDue :: Int -> Int
taxDue income = undefined
`,
      tests: [
        { expr: "taxDue 12500", expected: "0" },
        { expr: "taxDue 22500", expected: "2000" },
        { expr: "taxDue 0", expected: "0" },
        { expr: "taxDue (-100)", expected: "0" },
        { expr: "taxDue 12501", expected: "0" },
      ],
      hint: "Let `taxable = max 0 (income - 12500)`, then `div (20 * taxable) 100`.",
      solution: hs`taxDue :: Int -> Int
taxDue income = div (20 * max 0 (income - 12500)) 100
`,
    },
    {
      k: "write",
      body: md(
        "A time of day is stored as a number of seconds since midnight, 0 to 86399.",
        "",
        "Define a function `hms :: Int -> (Int, Int, Int)` that splits it into hours, minutes and seconds. You may assume the input is non-negative. For example:",
        "",
        "```",
        "*Main> hms 3661",
        "(1,1,1)",
        "*Main> hms 0",
        "(0,0,0)",
        "*Main> hms 86399",
        "(23,59,59)",
        "```",
      ),
      starter: hs`hms :: Int -> (Int, Int, Int)
hms n = undefined
`,
      tests: [
        { expr: "hms 3661", expected: "(1, 1, 1)" },
        { expr: "hms 0", expected: "(0, 0, 0)" },
        { expr: "hms 86399", expected: "(23, 59, 59)" },
        { expr: "hms 60", expected: "(0, 1, 0)" },
        { expr: "hms 3600", expected: "(1, 0, 0)" },
      ],
      hint: "Hours are `div n 3600`. The remainder's minutes are `div r 60`, and seconds are `mod r 60`.",
      solution: hs`hms :: Int -> (Int, Int, Int)
hms n = (div n 3600, div r 60, mod r 60)
  where
    r = mod n 3600
`,
    },
    {
      k: "write",
      setup: bits,
      body: md(
        "A colour is stored as an Int whose lowest 24 bits are red, green and blue: bits 16-23 red, 8-15 green, 0-7 blue. Each channel is 0 to 255.",
        "",
        "Define a function `unpackRGB :: Int -> (Int, Int, Int)` that returns `(red, green, blue)`. For example:",
        "",
        "```",
        "*Main> unpackRGB 0",
        "(0,0,0)",
        "*Main> unpackRGB 16711680",
        "(255,0,0)",
        "*Main> unpackRGB 255",
        "(0,0,255)",
        "```",
      ),
      starter: hs`unpackRGB :: Int -> (Int, Int, Int)
unpackRGB n = undefined
`,
      tests: [
        { expr: "unpackRGB 0", expected: "(0, 0, 0)" },
        { expr: "unpackRGB 16711680", expected: "(255, 0, 0)" },
        { expr: "unpackRGB 255", expected: "(0, 0, 255)" },
        { expr: "unpackRGB 65280", expected: "(0, 255, 0)" },
        { expr: "unpackRGB 16777215", expected: "(255, 255, 255)" },
      ],
      hint: "Red is `shiftR n 16 .&. 255`, green `shiftR n 8 .&. 255`, blue `n .&. 255`.",
      solution: hs`unpackRGB :: Int -> (Int, Int, Int)
unpackRGB n = (shiftR n 16 .&. 255, shiftR n 8 .&. 255, n .&. 255)
`,
    },
    {
      k: "write",
      body: md(
        "A simple checksum of a non-negative Int is the repeated digit-sum until a single digit remains (the digital root). `0` stays `0`.",
        "",
        "Define a function `digitalRoot :: Int -> Int`. For example:",
        "",
        "```",
        "*Main> digitalRoot 38",
        "2",
        "*Main> digitalRoot 9",
        "9",
        "*Main> digitalRoot 0",
        "0",
        "```",
        "",
        "(38: 3+8=11, 1+1=2.)",
      ),
      starter: hs`digitalRoot :: Int -> Int
digitalRoot n = undefined
`,
      tests: [
        { expr: "digitalRoot 38", expected: "2" },
        { expr: "digitalRoot 9", expected: "9" },
        { expr: "digitalRoot 0", expected: "0" },
        { expr: "digitalRoot 99", expected: "9" },
        { expr: "digitalRoot 10", expected: "1" },
      ],
      hint: "If `n < 10` you are done. Otherwise sum the digits and recurse. (There is a closed form `1 + mod (n - 1) 9` for `n > 0`.",
      solution: hs`digitalRoot :: Int -> Int
digitalRoot n
  | n < 10    = n
  | otherwise = digitalRoot (digitSum n)
  where
    digitSum 0 = 0
    digitSum m = mod m 10 + digitSum (div m 10)
`,
    },
    {
      k: "write",
      setup: bits,
      body: md(
        "A set of feature flags is stored in an Int. Flag `i` is on when bit `i` is 1.",
        "",
        "Define `hasFlag :: Int -> Int -> Bool` and `withFlag :: Int -> Int -> Int`. `hasFlag flags i` is True when flag `i` is on. `withFlag flags i` returns the flags with flag `i` turned on (other flags unchanged). For example:",
        "",
        "```",
        "*Main> hasFlag 0 3",
        "False",
        "*Main> hasFlag (withFlag 0 3) 3",
        "True",
        "*Main> withFlag 1 0",
        "1",
        "```",
      ),
      starter: hs`hasFlag :: Int -> Int -> Bool
hasFlag flags i = undefined

withFlag :: Int -> Int -> Int
withFlag flags i = undefined
`,
      tests: [
        { expr: "hasFlag 0 3", expected: "False" },
        { expr: "hasFlag (withFlag 0 3) 3", expected: "True" },
        { expr: "withFlag 1 0", expected: "1" },
        { expr: "hasFlag 8 3", expected: "True" },
        { expr: "withFlag 0 0", expected: "1" },
      ],
      hint: "`testBit flags i` and `setBit flags i`, or `.&. bit i` and `.|. bit i`.",
      solution: hs`hasFlag :: Int -> Int -> Bool
hasFlag flags i = testBit flags i

withFlag :: Int -> Int -> Int
withFlag flags i = setBit flags i
`,
    },
    {
      k: "write",
      body: md(
        "A price in pence is an Int. Define `showPence :: Int -> String` that writes it as pounds and pence with a dot and two pence digits. Negative amounts get a leading minus. For example:",
        "",
        "```",
        "*Main> showPence 199",
        "\"1.99\"",
        "*Main> showPence 5",
        "\"0.05\"",
        "*Main> showPence 0",
        "\"0.00\"",
        "*Main> showPence (-20)",
        "\"-0.20\"",
        "```",
      ),
      starter: hs`showPence :: Int -> String
showPence p = undefined
`,
      tests: [
        { expr: "showPence 199", expected: '"1.99"' },
        { expr: "showPence 5", expected: '"0.05"' },
        { expr: "showPence 0", expected: '"0.00"' },
        { expr: "showPence (-20)", expected: '"-0.20"' },
        { expr: "showPence 100", expected: '"1.00"' },
      ],
      hint: "Take `abs p`. Pounds are `div m 100`. Pence are `mod m 100`, padded to two digits. Put a minus in front if `p < 0`.",
      solution: hs`showPence :: Int -> String
showPence p = (if p < 0 then "-" else "") ++ show pounds ++ "." ++ pad pence
  where
    m = abs p
    pounds = div m 100
    pence = mod m 100
    pad n = if n < 10 then '0' : show n else show n
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `movingAvg3 :: [Double] -> [Double]` that replaces each inner element by the average of it and its two neighbours. The first and last elements (if they exist) are left unchanged. A list of length 0, 1 or 2 is returned as it is. For example:",
        "",
        "```",
        "*Main> movingAvg3 [1, 2, 3, 4]",
        "[1.0,2.0,3.0,4.0]",
        "```",
        "",
        "(The inner values: `(1+2+3)/3 = 2` and `(2+3+4)/3 = 3`.)",
      ),
      starter: hs`movingAvg3 :: [Double] -> [Double]
movingAvg3 xs = undefined
`,
      tests: [
        close("head (movingAvg3 [1, 2, 3, 4])", "1"),
        close("movingAvg3 [1, 2, 3, 4] !! 1", "2"),
        close("movingAvg3 [1, 2, 3, 4] !! 2", "3"),
        close("last (movingAvg3 [1, 2, 3, 4])", "4"),
        { expr: "movingAvg3 [5.0]", expected: "[5.0]" },
        { expr: "movingAvg3 []", expected: "[]" },
      ],
      hint: "If the list is shorter than 3, return it. Otherwise keep the head and last, and replace each inner element by the mean of the triple centred on it. `zip3 xs (tail xs) (drop 2 xs)` gives those triples.",
      solution: hs`movingAvg3 :: [Double] -> [Double]
movingAvg3 xs
  | length xs < 3 = xs
  | otherwise = head xs : [(a + b + c) / 3 | (a, b, c) <- zip3 xs (tail xs) (drop 2 xs)] ++ [last xs]
`,
    },
    {
      k: "write",
      setup: ratio,
      body: md(
        "Define a function `ratMix :: Rational -> Rational -> Rational -> Rational` that mixes two Rationals with a weight `t` between 0 and 1: the result is `(1 - t) * a + t * b`. For example:",
        "",
        "```",
        "*Main> ratMix (0 % 1) (1 % 1) (1 % 2)",
        "1 % 2",
        "*Main> ratMix (1 % 2) (1 % 2) (1 % 3)",
        "1 % 2",
        "```",
      ),
      starter: hs`ratMix :: Rational -> Rational -> Rational -> Rational
ratMix a b t = undefined
`,
      tests: [
        { expr: "ratMix (0 % 1) (1 % 1) (1 % 2)", expected: "1 % 2" },
        { expr: "ratMix (1 % 2) (1 % 2) (1 % 3)", expected: "1 % 2" },
        { expr: "ratMix (0 % 1) (1 % 1) (0 % 1)", expected: "0 % 1" },
        { expr: "ratMix (0 % 1) (1 % 1) (1 % 1)", expected: "1 % 1" },
        { expr: "ratMix (1 % 4) (3 % 4) (1 % 2)", expected: "1 % 2" },
      ],
      hint: "`(1 - t) * a + t * b`.",
      solution: hs`ratMix :: Rational -> Rational -> Rational -> Rational
ratMix a b t = (1 - t) * a + t * b
`,
    },
    {
      k: "write",
      setup: bits,
      body: md(
        "Define a function `packNybbles :: [Int] -> Maybe Int` that packs a list of up to 8 nybbles (values 0 to 15) into one Int, first element in the lowest 4 bits, next in bits 4-7, and so on. Return `Nothing` if the list is longer than 8 or any value is outside 0..15. The empty list packs to `Just 0`. For example:",
        "",
        "```",
        "*Main> packNybbles [1, 2]",
        "Just 33",
        "*Main> packNybbles [16]",
        "Nothing",
        "*Main> packNybbles []",
        "Just 0",
        "```",
      ),
      starter: hs`packNybbles :: [Int] -> Maybe Int
packNybbles xs = undefined
`,
      tests: [
        { expr: "packNybbles [1, 2]", expected: "Just 33" },
        { expr: "packNybbles [16]", expected: "Nothing" },
        { expr: "packNybbles []", expected: "Just 0" },
        { expr: "packNybbles [15]", expected: "Just 15" },
        { expr: "packNybbles (replicate 9 0)", expected: "Nothing" },
        { expr: "packNybbles [1, -1]", expected: "Nothing" },
      ],
      hint: "Fail if `length xs > 8` or any element is outside 0..15. Then fold from the left with an index, or from the right: `foldr (\\x acc -> acc * 16 + x)` wait — first element is lowest, so foldr `\\x acc -> shiftL acc 4 .|. x` is wrong; use foldl `\\acc x -> acc .|. shiftL x (4 * i)` or zip with indices.",
      solution: hs`packNybbles :: [Int] -> Maybe Int
packNybbles xs
  | length xs > 8 = Nothing
  | any (\x -> x < 0 || x > 15) xs = Nothing
  | otherwise = Just (sum [shiftL x (4 * i) | (i, x) <- zip [0..] xs])
`,
    },
    {
      k: "write",
      body: md(
        "A quadratic `a x^2 + b x + c` with Int coefficients has discriminant `b^2 - 4 a c`.",
        "",
        "Define a function `discKind :: Int -> Int -> Int -> String` that returns `\"two\"` if the discriminant is positive, `\"one\"` if it is zero, and `\"none\"` if it is negative. For example:",
        "",
        "```",
        "*Main> discKind 1 0 (-1)",
        "\"two\"",
        "*Main> discKind 1 2 1",
        "\"one\"",
        "*Main> discKind 1 0 1",
        "\"none\"",
        "```",
      ),
      starter: hs`discKind :: Int -> Int -> Int -> String
discKind a b c = undefined
`,
      tests: [
        { expr: "discKind 1 0 (-1)", expected: '"two"' },
        { expr: "discKind 1 2 1", expected: '"one"' },
        { expr: "discKind 1 0 1", expected: '"none"' },
        { expr: "discKind 2 5 2", expected: '"two"' },
        { expr: "discKind 1 0 0", expected: '"one"' },
      ],
      hint: "Let `d = b * b - 4 * a * c`, then compare `d` with 0.",
      solution: hs`discKind :: Int -> Int -> Int -> String
discKind a b c
  | d > 0     = "two"
  | d == 0    = "one"
  | otherwise = "none"
  where
    d = b * b - 4 * a * c
`,
    },
    {
      k: "write",
      setup: ipTypes,
      body: md(
        ipStory,
        "",
        "Define a function `broadcast :: Int -> IP -> IP` that returns the broadcast address of the network: the host bits (the lowest `32 - prefix` bits) all set to 1. You may assume `0 <= prefix && prefix <= 32`. For example, prefix 24 on `192.168.1.10` is `192.168.1.255`. For example:",
        "",
        "```",
        "*Main> showIP (broadcast 24 (packIP (192, 168, 1, 10)))",
        "\"192.168.1.255\"",
        "*Main> showIP (broadcast 32 (packIP (10, 0, 0, 1)))",
        "\"10.0.0.1\"",
        "```",
        "",
        "`showIP` and `packIP` are given.",
      ),
      starter: hs`broadcast :: Int -> IP -> IP
broadcast prefix ip = undefined

showIP :: IP -> String
showIP ip =
  intercalate "." [show (shiftR ip k .&. 255) | k <- [24, 16, 8, 0]]
`,
      tests: [
        { expr: "showIP (broadcast 24 (packIP (192, 168, 1, 10)))", expected: '"192.168.1.255"' },
        { expr: "showIP (broadcast 32 (packIP (10, 0, 0, 1)))", expected: '"10.0.0.1"' },
        { expr: "showIP (broadcast 16 (packIP (192, 168, 1, 10)))", expected: '"192.168.255.255"' },
        { expr: "showIP (broadcast 0 (packIP (1, 2, 3, 4)))", expected: '"255.255.255.255"' },
        { expr: "showIP (broadcast 30 (packIP (10, 0, 0, 1)))", expected: '"10.0.0.3"' },
      ],
      hint: "The host mask is `bit (32 - prefix) - 1` (and 0 when prefix is 32). Then `ip .|. hostMask`. Watch `bit 32`; for prefix 0 use a 32-bit mask of ones, `bit 32 - 1` may not fit in a 32-bit Int, so use `shiftL 1 32 - 1` carefully or `complement (shiftL (complement 0) (32 - prefix))`... On 64-bit Int, `bit 32 - 1` is fine.",
      solution: hs`broadcast :: Int -> IP -> IP
broadcast prefix ip = ip .|. (bit (32 - prefix) - 1)

showIP :: IP -> String
showIP ip =
  intercalate "." [show (shiftR ip k .&. 255) | k <- [24, 16, 8, 0]]
`,
    },
  ],
};

export const book: Book = {
  id: "b-numbers",
  order: 9,
  title: "Numbers, Rational and bits",
  blurb: "Int, Integer, Double and Rational; div and mod with negatives; rounding; formulas; digits and bases; polynomials; Data.Bits masks and fields.",
  sets: [level1, level2, level3, level4, extra],
};
