import { type DrillSet, type DrillStep, hs, md } from "./schema.ts";

const q = (q: string, options: string[], answer: number, why: string): DrillStep => ({ k: "quiz", q, options, answer, why });

const p = (expr: string, answer: string, why: string, body?: string): DrillStep =>
  body === undefined ? { k: "predict", expr, answer, why } : { k: "predict", body, expr, answer, why };

const w = (
  body: string,
  starter: string,
  solution: string,
  tests: [string, string][],
  hint: string,
  extra: { banned?: string[]; setup?: string } = {},
): DrillStep => ({
  k: "write",
  body,
  starter,
  tests: tests.map(([expr, expected]) => ({ expr, expected })),
  hint,
  solution,
  ...extra,
});

const ignoreTypes = "Ignore the lines with `::` for now. They say what kind of answer each name holds, and you'll meet them properly soon.";

export const drills: DrillSet[] = [
  // ───────────────────────────── talk ─────────────────────────────
  {
    id: "drill-talk",
    lesson: "talk",
    title: "Practice: Talking to GHCi",
    drills: [
      q(
        "What does GHCi print after you type `4 + 5`?",
        ["`45`", "`9`", "`4 + 5`", "Nothing until you press a run button"],
        1,
        "GHCi works out the expression and prints its value. `4 + 5` is 9. Numbers are added, not stuck together.",
      ),
      p("10 - 3", "7", "Plain subtraction: 10 take away 3 is 7."),
      p("10 - 2 * 3", "4", "`*` happens before `-`, just like maths. `2 * 3` is 6, then `10 - 6` is 4."),
      q(
        "What is `(2 + 3) * 4`?",
        ["`14`", "`20`", "`24`", "`9`"],
        1,
        "Brackets first: `2 + 3` is 5. Then `5 * 4` is 20. Without the brackets it would be 14.",
      ),
      p("7 / 2", "3.5", "`/` is division with a decimal answer, so you get 3.5, not 3."),
      w(
        md(
          "Each name below needs a value. Replace each `undefined` with an expression that works out the answer. Practise writing the sum rather than just the final number.",
          "",
          "`a`: twelve plus thirty",
          "`b`: seven times six",
          "`c`: one hundred minus fifty-eight",
          "`d`: eighty-four divided by two (use `/`)",
          "",
          ignoreTypes,
        ),
        hs`a :: Int
a = undefined

b :: Int
b = undefined

c :: Int
c = undefined

d :: Double
d = undefined
`,
        hs`a :: Int
a = 12 + 30

b :: Int
b = 7 * 6

c :: Int
c = 100 - 58

d :: Double
d = 84 / 2
`,
        [
          ["a", "42"],
          ["b", "42"],
          ["c", "42"],
          ["d", "42.0"],
        ],
        "Swap each `undefined` for the sum, for example `a = 12 + 30`.",
      ),
      p('"cat" ++ "dog"', '"catdog"', "`++` sticks two strings together exactly as they are. It doesn't add a space. GHCi shows strings with their quote marks."),
      q(
        'What does `"Hello" ++ "world"` give?',
        ['`"Hello world"`', '`"Helloworld"`', '`"Hello" "world"`', "An error"],
        1,
        "`++` adds nothing in between. If you want a space, you have to put it in yourself: `\"Hello \" ++ \"world\"`.",
      ),
      q(
        'What does `"5" ++ "5"` give?',
        ["`10`", '`"10"`', '`"55"`', "An error"],
        2,
        "These are strings (text), not numbers, because of the quotes. `++` joins text, so you get `\"55\"`.",
      ),
      p("3 > 5", "False", "3 is not bigger than 5, so the comparison answers `False`."),
      q(
        'Why does `"Hi" + " there"` give an error?',
        [
          "`+` only works on numbers; use `++` to join text",
          "Strings need single quotes",
          "There's a space inside the second string",
          "You need brackets around each string",
        ],
        0,
        "`+` is for adding numbers. Text is joined with `++`. Mixing them up is one of the most common beginner errors.",
      ),
      p(
        "2 * 5 == 10",
        "True",
        "`2 * 5` is 10, and 10 equals 10, so the answer is `True`. The `*` is worked out before the `==`.",
        "`==` asks whether two things are equal. It's two equals signs; a single `=` means something different in Haskell. `/=` asks whether two things are different.",
      ),
      w(
        md(
          "Practise brackets. Replace each `undefined` so that:",
          "",
          "`p`: add 2 and 3, then multiply by 4",
          "`q`: take 4 from 10, then multiply by 2",
          "`r`: add 5 and 7, then multiply by (10 minus 8)",
          "`s`: divide 100 by (2 plus 3), using `/`",
          "",
          ignoreTypes,
        ),
        hs`p :: Int
p = undefined

q :: Int
q = undefined

r :: Int
r = undefined

s :: Double
s = undefined
`,
        hs`p :: Int
p = (2 + 3) * 4

q :: Int
q = (10 - 4) * 2

r :: Int
r = (5 + 7) * (10 - 8)

s :: Double
s = 100 / (2 + 3)
`,
        [
          ["p", "20"],
          ["q", "12"],
          ["r", "24"],
          ["s", "20.0"],
        ],
        "Put brackets around whatever must happen first, for example `p = (2 + 3) * 4`.",
      ),
      q(
        "What is `8 - 3 - 2`?",
        ["`3`", "`7`", "`13`", "An error"],
        0,
        "Subtraction goes from left to right: `(8 - 3) - 2`, which is `5 - 2`, which is 3.",
      ),
      p("(1 + 2) * (3 + 4)", "21", "Both brackets first: 3 and 7. Then `3 * 7` is 21."),
      w(
        md(
          "Practise joining text with `++`. Replace each `undefined` so that:",
          "",
          '`fullName` joins `"Ada"`, a space and `"Lovelace"`',
          '`laugh` is `"ha"` joined to itself three times',
          '`excited` is `"hey"` followed by `"!"`',
          '`sentence` joins `"I"`, `"like"` and `"Haskell"` with spaces between them',
          "",
          ignoreTypes,
        ),
        hs`fullName :: String
fullName = undefined

laugh :: String
laugh = undefined

excited :: String
excited = undefined

sentence :: String
sentence = undefined
`,
        hs`fullName :: String
fullName = "Ada" ++ " " ++ "Lovelace"

laugh :: String
laugh = "ha" ++ "ha" ++ "ha"

excited :: String
excited = "hey" ++ "!"

sentence :: String
sentence = "I" ++ " " ++ "like" ++ " " ++ "Haskell"
`,
        [
          ["fullName", '"Ada Lovelace"'],
          ["laugh", '"hahaha"'],
          ["excited", '"hey!"'],
          ["sentence", '"I like Haskell"'],
        ],
        "Remember `++` adds no spaces. A space is the string `\" \"`.",
      ),
      q(
        "Which of these is `True`?",
        ["`3 > 3`", "`10 / 4 == 2`", "`2 + 2 == 4`", "`5 < 1`"],
        2,
        "`3 > 3` is False (equal is not bigger). `10 / 4` is 2.5, not 2. `5 < 1` is False. Only `2 + 2 == 4` is True.",
      ),
      w(
        md(
          "Each of these should be a comparison that answers `True` or `False`. Replace each `undefined`:",
          "",
          "`t1`: is 17 times 3 bigger than 50?",
          "`t2`: is 100 smaller than 99 plus 1?",
          "`t3`: is 6 times 7 equal to 42? (use `==`)",
          '`t4`: is `"cat"` different from `"dog"`? (use `/=`)',
          "",
          ignoreTypes,
        ),
        hs`t1 :: Bool
t1 = undefined

t2 :: Bool
t2 = undefined

t3 :: Bool
t3 = undefined

t4 :: Bool
t4 = undefined
`,
        hs`t1 :: Bool
t1 = 17 * 3 > 50

t2 :: Bool
t2 = 100 < 99 + 1

t3 :: Bool
t3 = 6 * 7 == 42

t4 :: Bool
t4 = "cat" /= "dog"
`,
        [
          ["t1", "True"],
          ["t2", "False"],
          ["t3", "True"],
          ["t4", "True"],
        ],
        "Write the comparison itself, for example `t1 = 17 * 3 > 50`. GHCi works out the True or False.",
      ),
      w(
        md(
          "Let Haskell do the arithmetic. Replace each `undefined`:",
          "",
          "`secondsInDay`: 24 hours, each 60 minutes, each 60 seconds",
          "`minutesInWeek`: 7 days of 24 hours of 60 minutes",
          "`hoursInYear`: 365 days of 24 hours",
          "`halfHour`: 30 minutes as a fraction of an hour (use `/`)",
          "",
          ignoreTypes,
        ),
        hs`secondsInDay :: Int
secondsInDay = undefined

minutesInWeek :: Int
minutesInWeek = undefined

hoursInYear :: Int
hoursInYear = undefined

halfHour :: Double
halfHour = undefined
`,
        hs`secondsInDay :: Int
secondsInDay = 24 * 60 * 60

minutesInWeek :: Int
minutesInWeek = 7 * 24 * 60

hoursInYear :: Int
hoursInYear = 365 * 24

halfHour :: Double
halfHour = 30 / 60
`,
        [
          ["secondsInDay", "86400"],
          ["minutesInWeek", "10080"],
          ["hoursInYear", "8760"],
          ["halfHour", "0.5"],
        ],
        "Multiply the pieces together: `secondsInDay = 24 * 60 * 60`.",
      ),
    ],
  },

  // ───────────────────────────── calling ─────────────────────────────
  {
    id: "drill-calling",
    lesson: "calling",
    title: "Practice: Calling functions",
    drills: [
      q(
        "Someone types `max(3, 7)` because that's how other languages do it. What is the Haskell way?",
        ["`max 3 7`", "`max(3 7)`", "`max [3, 7]`", "`(max, 3, 7)`"],
        0,
        "Name, a space, then the inputs separated by spaces. `max(3, 7)` gives `max` one input, the pair `(3, 7)`, which isn't what it wants.",
      ),
      p("min 4 9", "4", "`min` gives back the smaller of its two inputs."),
      p("negate (2 + 3)", "-5", "The brackets are worked out first, giving 5. Then `negate 5` is -5."),
      q(
        "How does Haskell read `negate 3 + 5`?",
        ["`(negate 3) + 5`, which is 2", "`negate (3 + 5)`, which is -8", "It's an error", "`negate 35`"],
        0,
        "A function grabs the input right next to it before any operator like `+` happens. So it's `(negate 3) + 5`, which is -3 + 5 = 2.",
      ),
      p("max 4 9 + 1", "10", "Function first: `max 4 9` is 9. Then `9 + 1` is 10."),
      w(
        md(
          "Use `max` and `min`. Replace each `undefined` so that:",
          "",
          "`biggest`: the bigger of 13 and 8",
          "`smallest`: the smaller of 13 and 8",
          "`biggestOfThree`: the biggest of 4, 9 and 2 (use `max` twice)",
          "`clamped`: take the bigger of 0 and 15, then the smaller of that and 10",
          "",
          ignoreTypes,
        ),
        hs`biggest :: Int
biggest = undefined

smallest :: Int
smallest = undefined

biggestOfThree :: Int
biggestOfThree = undefined

clamped :: Int
clamped = undefined
`,
        hs`biggest :: Int
biggest = max 13 8

smallest :: Int
smallest = min 13 8

biggestOfThree :: Int
biggestOfThree = max 4 (max 9 2)

clamped :: Int
clamped = min 10 (max 0 15)
`,
        [
          ["biggest", "13"],
          ["smallest", "8"],
          ["biggestOfThree", "9"],
          ["clamped", "10"],
        ],
        "Use brackets to pass one call's answer into another: `max 4 (max 9 2)`.",
      ),
      q(
        "Which of these gives exactly `3`?",
        ["`7 / 2`", "`div 7 2`", "`7 * 2`", "`max 7 2`"],
        1,
        "`div` is whole-number division and throws the remainder away, giving 3. `7 / 2` gives 3.5.",
      ),
      p("mod 17 5", "2", "17 is 3 lots of 5 (15) with 2 left over.", "`mod` gives the remainder after whole-number division."),
      p("div 17 5", "3", "5 goes into 17 three whole times; the remainder is thrown away."),
      q(
        "Which is the same as `div 10 3`?",
        ["``10 `div` 3``", "`10 div 3`", "`(div) 10 3 2`", "`div(10, 3)`"],
        0,
        "Backticks turn a normal function into one you write between its inputs. Without backticks, `10 div 3` tries to use 10 as a function.",
      ),
      q(
        "`max 2 + 3 4` gives an error. Why?",
        [
          "Haskell reads it as `(max 2) + (3 4)`, which makes no sense",
          "`max` only works on one number",
          "You can't add numbers near `max`",
          "The numbers must each be in brackets, like `max (2) (3)`",
        ],
        0,
        "Functions grab the inputs next to them first. To mean \"the bigger of 2 + 3 and 4\", write `max (2 + 3) 4`.",
      ),
      p("max 1 (min 5 3)", "3", "Inside the brackets first: `min 5 3` is 3. Then `max 1 3` is 3."),
      w(
        md(
          "50 eggs are packed into boxes of 12. Use `div` and `mod`:",
          "",
          "`fullBoxes`: how many full boxes",
          "`spareEggs`: how many eggs are left over",
          "",
          "Then for 100 days:",
          "",
          "`fullWeeks`: how many whole weeks (7 days) is that",
          "`extraDays`: how many days are left over",
          "",
          ignoreTypes,
        ),
        hs`fullBoxes :: Int
fullBoxes = undefined

spareEggs :: Int
spareEggs = undefined

fullWeeks :: Int
fullWeeks = undefined

extraDays :: Int
extraDays = undefined
`,
        hs`fullBoxes :: Int
fullBoxes = div 50 12

spareEggs :: Int
spareEggs = mod 50 12

fullWeeks :: Int
fullWeeks = div 100 7

extraDays :: Int
extraDays = mod 100 7
`,
        [
          ["fullBoxes", "4"],
          ["spareEggs", "2"],
          ["fullWeeks", "14"],
          ["extraDays", "2"],
        ],
        "`div 50 12` counts the whole boxes; `mod 50 12` gives what's left over.",
      ),
      q(
        "What does `(-) 10 3` give?",
        ["`7`", "`-7`", "`13`", "An error"],
        0,
        "With an operator in brackets, the first input goes on the left and the second on the right: `10 - 3`, which is 7.",
      ),
      p("(*) 6 7", "42", "`(*)` is times used like a normal function: `6 * 7`."),
      w(
        md(
          "Use each operator in brackets, like a normal function (name first, then inputs). Replace each `undefined`:",
          "",
          "`p1`: add 20 and 22 using `(+)`",
          "`p2`: multiply 6 and 7 using `(*)`",
          "`p3`: take 8 from 50 using `(-)`",
          "`p4`: whole-number divide 84 by 2 using `div`",
          "",
          ignoreTypes,
        ),
        hs`p1 :: Int
p1 = undefined

p2 :: Int
p2 = undefined

p3 :: Int
p3 = undefined

p4 :: Int
p4 = undefined
`,
        hs`p1 :: Int
p1 = (+) 20 22

p2 :: Int
p2 = (*) 6 7

p3 :: Int
p3 = (-) 50 8

p4 :: Int
p4 = div 84 2
`,
        [
          ["p1", "42"],
          ["p2", "42"],
          ["p3", "42"],
          ["p4", "42"],
        ],
        "The operator in brackets comes first, then the two inputs: `(+) 20 22`. Watch the order for `(-)`.",
      ),
      q(
        "What does the line `-- add one` do in a Haskell file?",
        ["Subtracts twice", "Nothing: it's a comment for humans", "Adds one", "Makes the next number negative"],
        1,
        "`--` starts a comment. Haskell ignores everything after it on that line.",
      ),
      p("div 7 2 * 2", "6", "The function happens first: `div 7 2` is 3. Then `3 * 2` is 6. You don't get 7 back, because the remainder was thrown away."),
      w(
        md(
          "`abs` gives the distance of a number from zero: `abs (-4)` is 4 and `abs 4` is 4. Replace each `undefined`:",
          "",
          "`gap`: the distance between 3 and 10, written as `abs` of 3 minus 10",
          "`flipped`: `negate` applied to -42",
          "`share`: 23 sweets shared equally among 4 children: how many each",
          "`bestScore`: the bigger of 2 times 5 and 3 times 3, plus 1",
          "",
          ignoreTypes,
        ),
        hs`gap :: Int
gap = undefined

flipped :: Int
flipped = undefined

share :: Int
share = undefined

bestScore :: Int
bestScore = undefined
`,
        hs`gap :: Int
gap = abs (3 - 10)

flipped :: Int
flipped = negate (-42)

share :: Int
share = div 23 4

bestScore :: Int
bestScore = max (2 * 5) (3 * 3) + 1
`,
        [
          ["gap", "7"],
          ["flipped", "42"],
          ["share", "5"],
          ["bestScore", "11"],
        ],
        "Negative numbers given to a function need brackets: `negate (-42)`. Sums given to a function need brackets too: `abs (3 - 10)`.",
      ),
    ],
  },

  // ───────────────────────────── types ─────────────────────────────
  {
    id: "drill-types",
    lesson: "types",
    title: "Practice: Every value has a type",
    drills: [
      q("What is the type of `3.14`?", ["`Int`", "`Double`", "`Char`", "`String`"], 1, "It has a decimal point, so it's a decimal number: a `Double`."),
      q(
        'What is the type of `"a"`?',
        ["`Char`", "`String`", "`Bool`", "`Int`"],
        1,
        "Double quotes always make a String, even with only one character inside. `'a'` with single quotes would be a Char.",
      ),
      p("not True", "False", "`not` flips a Bool: not True is False.", "`not` takes a Bool and gives the opposite Bool."),
      q(
        "What does GHCi print for `:t False`?",
        ["`False :: Bool`", "`False = Bool`", "`Bool :: False`", "`False`"],
        0,
        "`:t` shows the value, then `::` (\"has type\"), then the type.",
      ),
      p("'a' == 'A'", "False", "Capital letters are different characters from lower-case ones."),
      q(
        "Why is `1 + True` an error?",
        ["`True` is a Bool, and `+` needs numbers", "You need brackets", "`+` only works on Doubles", "GHCi can't add 1 to anything"],
        0,
        "Haskell checks types before running anything. A Bool isn't a number, so it can't be added.",
      ),
      p(hs`"abc" == ['a', 'b', 'c']`, "True", "A String is just a list of characters, so these are the same thing written two ways."),
      q(
        "Which of these is NOT a valid Char?",
        ["`'x'`", "`'7'`", "`' '`", "`'ab'`"],
        3,
        "A Char is exactly one character. `'ab'` is two, which is an error. For text, use double quotes: `\"ab\"`.",
      ),
      w(
        md(
          "Give each name a value of the right type. Replace each `undefined` so that:",
          "",
          "`anInt` is the number 42",
          "`aDouble` is two and a half",
          "`aChar` is the letter z",
          '`aString` is the text `"zebra"`',
          "`aBool` is the answer to \"is 3 less than 8?\" (write the comparison)",
        ),
        hs`anInt :: Int
anInt = undefined

aDouble :: Double
aDouble = undefined

aChar :: Char
aChar = undefined

aString :: String
aString = undefined

aBool :: Bool
aBool = undefined
`,
        hs`anInt :: Int
anInt = 42

aDouble :: Double
aDouble = 2.5

aChar :: Char
aChar = 'z'

aString :: String
aString = "zebra"

aBool :: Bool
aBool = 3 < 8
`,
        [
          ["anInt", "42"],
          ["aDouble", "2.5"],
          ["aChar", "'z'"],
          ["aString", '"zebra"'],
          ["aBool", "True"],
        ],
        "Single quotes for a Char (`'z'`), double quotes for a String (`\"zebra\"`).",
      ),
      p("'a' < 'b'", "True", "Characters are ordered: `'a'` comes before `'b'`."),
      q(
        "What is the type of `3 > 2`?",
        ["`Int`", "`Bool`", "`True`", "`Number`"],
        1,
        "A comparison answers True or False, so its type is `Bool`. `True` is a value, not a type.",
      ),
      p('"Zip" == "zip"', "False", "The first letters differ (`'Z'` vs `'z'`), so the strings are not equal."),
      w(
        md(
          "`/` and `div` give different kinds of answer. Replace each `undefined`:",
          "",
          "`half`: 9 divided by 2 with a decimal answer",
          "`wholeHalf`: 9 divided by 2 as a whole number",
          "`leftover`: the remainder when 9 is divided by 2",
          "`exact`: 10 divided by 4 with a decimal answer",
          "",
          "Look at each signature: `Double` needs `/`, `Int` needs `div` or `mod`.",
        ),
        hs`half :: Double
half = undefined

wholeHalf :: Int
wholeHalf = undefined

leftover :: Int
leftover = undefined

exact :: Double
exact = undefined
`,
        hs`half :: Double
half = 9 / 2

wholeHalf :: Int
wholeHalf = div 9 2

leftover :: Int
leftover = mod 9 2

exact :: Double
exact = 10 / 4
`,
        [
          ["half", "4.5"],
          ["wholeHalf", "4"],
          ["leftover", "1"],
          ["exact", "2.5"],
        ],
        "`/` gives a Double; `div` and `mod` give whole numbers. Try `wholeHalf = 9 / 2` to see the type error you get.",
      ),
      q(
        "`:t \"hi\"` shows `[Char]`. What does that mean?",
        ["A list of characters, which is what a String is", "A broken String", "A single character", "Text that can only be one letter long"],
        0,
        "Square brackets around a type mean \"a list of\". String is just another name for `[Char]`.",
      ),
      p("not (3 > 4)", "True", "`3 > 4` is False, and `not False` is True."),
      w(
        md(
          "Chars and Strings. Replace each `undefined` so that:",
          "",
          "`initial` is the capital letter H",
          '`name` is the text `"Haskell"`',
          "`letters` is the characters a and b, written as a list with square brackets and single quotes",
          "`space` is a single space character",
        ),
        hs`initial :: Char
initial = undefined

name :: String
name = undefined

letters :: [Char]
letters = undefined

space :: Char
space = undefined
`,
        hs`initial :: Char
initial = 'H'

name :: String
name = "Haskell"

letters :: [Char]
letters = ['a', 'b']

space :: Char
space = ' '
`,
        [
          ["initial", "'H'"],
          ["name", '"Haskell"'],
          ["letters", '"ab"'],
          ["space", "' '"],
        ],
        "A list of Chars looks like `['a', 'b']`. A space character is `' '`.",
      ),
      q(
        "Which type can hold the answer of `7 / 2`?",
        ["`Int`", "`Double`", "`Bool`", "`String`"],
        1,
        "The answer is 3.5, which needs a decimal type like `Double`. An `Int` can't hold 3.5.",
      ),
      w(
        md(
          "Write each comparison so it gives a Bool. Replace each `undefined`:",
          "",
          "`b1`: is `'a'` less than `'z'`?",
          '`b2`: is `"cat"` equal to `"Cat"`?',
          "`b3`: the opposite of (2 is bigger than 1), using `not`",
          "`b4`: is 10 divided by 4 (with `/`) equal to 2.5?",
        ),
        hs`b1 :: Bool
b1 = undefined

b2 :: Bool
b2 = undefined

b3 :: Bool
b3 = undefined

b4 :: Bool
b4 = undefined
`,
        hs`b1 :: Bool
b1 = 'a' < 'z'

b2 :: Bool
b2 = "cat" == "Cat"

b3 :: Bool
b3 = not (2 > 1)

b4 :: Bool
b4 = 10 / 4 == 2.5
`,
        [
          ["b1", "True"],
          ["b2", "False"],
          ["b3", "False"],
          ["b4", "True"],
        ],
        "`not` needs brackets around the comparison: `not (2 > 1)`.",
      ),
      w(
        md(
          "Each of these lines has a type error. Write a fixed version, keeping the meaning:",
          "",
          "```",
          "x1 = 1 + True             -- should be 1 plus 1",
          "x2 = \"Score: \" ++ 5       -- should be the text Score: 5",
          "x3 = 'ab'                 -- should be the text ab",
          "x4 = \"a\" == 'a'           -- should compare the Char a with the Char a",
          "```",
        ),
        hs`x1 :: Int
x1 = undefined

x2 :: String
x2 = undefined

x3 :: String
x3 = undefined

x4 :: Bool
x4 = undefined
`,
        hs`x1 :: Int
x1 = 1 + 1

x2 :: String
x2 = "Score: " ++ "5"

x3 :: String
x3 = "ab"

x4 :: Bool
x4 = 'a' == 'a'
`,
        [
          ["x1", "2"],
          ["x2", '"Score: 5"'],
          ["x3", '"ab"'],
          ["x4", "True"],
        ],
        "`++` needs text on both sides, so the 5 must be `\"5\"`. Text needs double quotes; a single Char needs single quotes.",
      ),
    ],
  },

  // ───────────────────────────── functypes ─────────────────────────────
  {
    id: "drill-functypes",
    lesson: "functypes",
    title: "Practice: Reading function types",
    drills: [
      q(
        "How many inputs does a function of type `Int -> Int -> Int` take?",
        ["1", "2", "3", "None"],
        1,
        "Two arrows, so two inputs. The last `Int` is the result.",
      ),
      q(
        "In `isUpper :: Char -> Bool`, what does `isUpper` give back?",
        ["A `Char`", "A `Bool`", "`isUpper`", "A `Char -> Bool`"],
        1,
        "The last type is always the result. It takes a Char and answers True or False.",
      ),
      p("(min 5) 2", "2", "`min 5` is a function waiting for one more number. Given 2, it gives the smaller: 2."),
      q(
        "What is `max 3`, on its own?",
        ["The number 3", "A function waiting for one more number", "An error: `max` needs two inputs", "The biggest number there is"],
        1,
        "Giving a function fewer inputs than it wants is fine. You get back a new function waiting for the rest. This is partial application.",
      ),
      p("replicate 3 'x'", '"xxx"', "Three copies of the Char `'x'` make a list of Chars, which is a String."),
      w(
        md(
          "Define `atLeastZero` using partial application: give `max` just one input. Don't name an input on the left of `=`.",
          "",
          "It should turn negative numbers into 0 and leave other numbers alone.",
        ),
        hs`atLeastZero :: Int -> Int
atLeastZero = undefined
`,
        hs`atLeastZero :: Int -> Int
atLeastZero = max 0
`,
        [
          ["atLeastZero (-5)", "0"],
          ["atLeastZero 7", "7"],
          ["atLeastZero 0", "0"],
          ["atLeastZero (-1)", "0"],
        ],
        "`max 0` is already a function that takes one number and gives the bigger of it and 0.",
      ),
      q(
        "`replicate :: Int -> a -> [a]`. Which call is the right way round?",
        ["`replicate 'x' 3`", "`replicate 3 'x'`", "`replicate (3, 'x')`", "`replicate [3, 'x']`"],
        1,
        "The type says the Int (how many) comes first, then the thing to copy.",
      ),
      p("replicate 2 True", "[True,True]", "Two copies of `True`, in a list. GHCi prints lists with no spaces after the commas."),
      p("((+) 10) 5", "15", "`(+) 10` is a function that adds 10. Given 5, it gives 15."),
      q(
        "What is the type of `not True`?",
        ["`Bool -> Bool`", "`Bool`", "`True`", "`Bool -> True`"],
        1,
        "`not :: Bool -> Bool`. Once you've given it its one input, you have the result: a `Bool`.",
      ),
      w(
        "Define `atMostHundred` by giving `min` one input. Numbers above 100 become 100; others stay the same.",
        hs`atMostHundred :: Int -> Int
atMostHundred = undefined
`,
        hs`atMostHundred :: Int -> Int
atMostHundred = min 100
`,
        [
          ["atMostHundred 150", "100"],
          ["atMostHundred 100", "100"],
          ["atMostHundred 42", "42"],
          ["atMostHundred (-3)", "-3"],
        ],
        "`min 100` gives the smaller of 100 and whatever comes next.",
      ),
      p("(div 20) 4", "5", "`div 20` is waiting for the number to divide 20 by. `div 20 4` is 5."),
      q(
        "If `f :: Int -> Bool -> String`, what is the type of `f 3`?",
        ["`String`", "`Bool -> String`", "`Int -> String`", "`Int`"],
        1,
        "The Int has been given. What's left is: give me a Bool and I'll give you a String.",
      ),
      w(
        md(
          "Define `tenDividedBy` by giving `div` one input. It divides 10 by its input, as a whole number.",
          "",
          "For example `tenDividedBy 3` is 3.",
        ),
        hs`tenDividedBy :: Int -> Int
tenDividedBy = undefined
`,
        hs`tenDividedBy :: Int -> Int
tenDividedBy = div 10
`,
        [
          ["tenDividedBy 2", "5"],
          ["tenDividedBy 3", "3"],
          ["tenDividedBy 10", "1"],
          ["tenDividedBy 20", "0"],
        ],
        "Partial application fills in the first input. `div 10` means `div 10 _`, with the missing input coming second.",
      ),
      p("(replicate 4) 'z'", '"zzzz"', "`replicate 4` is a function waiting for the thing to copy."),
      q(
        "`take :: Int -> [a] -> [a]`. What is the type of `take 2`?",
        ["`[a]`", "`[a] -> [a]`", "`Int -> [a]`", "`Int`"],
        1,
        "The Int has been given, so one input is left: a list. The result is a list.",
      ),
      w(
        "Define `tripleOf` by giving `replicate` one input. It turns a character into a String of three copies of it.",
        hs`tripleOf :: Char -> String
tripleOf = undefined
`,
        hs`tripleOf :: Char -> String
tripleOf = replicate 3
`,
        [
          ["tripleOf 'a'", '"aaa"'],
          ["tripleOf ' '", '"   "'],
          ["tripleOf '7'", '"777"'],
          ["tripleOf 'Z'", '"ZZZ"'],
        ],
        "`replicate` wants the count first. Give it just the count.",
      ),
      w(
        "Define `subtractFrom100` by giving `(-)` one input. It works out 100 minus its input.",
        hs`subtractFrom100 :: Int -> Int
subtractFrom100 = undefined
`,
        hs`subtractFrom100 :: Int -> Int
subtractFrom100 = (-) 100
`,
        [
          ["subtractFrom100 1", "99"],
          ["subtractFrom100 100", "0"],
          ["subtractFrom100 150", "-50"],
          ["subtractFrom100 0", "100"],
        ],
        "`(-) 100 x` means `100 - x`. Leave the `x` off.",
      ),
      q(
        "A function takes a `Char` and an `Int` and gives a `String`. What is its type?",
        ["`Char -> Int -> String`", "`String -> Int -> Char`", "`Char Int -> String`", "`Char -> Int String`"],
        0,
        "Inputs in order, each followed by an arrow, then the result last.",
      ),
    ],
  },

  // ───────────────────────────── define ─────────────────────────────
  {
    id: "drill-define",
    lesson: "define",
    title: "Practice: Writing your own functions",
    drills: [
      q(
        "In `double x = x * 2`, what is `x`?",
        ["A name for the input", "A variable you must set first", "The multiplication sign", "The function's output"],
        0,
        "Left of `=`, after the function name, you name the inputs. When you call `double 4`, `x` stands for 4.",
      ),
      q(
        "Which line correctly defines `inc`, which adds one to its input?",
        ["`inc x = x + 1`", "`inc = x + 1`", "`inc x => x + 1`", "`inc x == x + 1`"],
        0,
        "Name, input name, a single `=`, then the answer. `inc = x + 1` forgets to name the input, so Haskell doesn't know what `x` is.",
      ),
      w(
        "Write `square`, which multiplies a number by itself.",
        hs`square :: Int -> Int
square x = undefined
`,
        hs`square :: Int -> Int
square x = x * x
`,
        [
          ["square 3", "9"],
          ["square 0", "0"],
          ["square (-4)", "16"],
          ["square 1", "1"],
        ],
        "Replace `undefined` with `x` times `x`.",
      ),
      q(
        "Given `f x y = x - y`, what is `f 3 10`?",
        ["`7`", "`-7`", "`13`", "`30`"],
        1,
        "Inputs are matched in order: `x` is 3 and `y` is 10. So it's `3 - 10`, which is -7.",
      ),
      p(
        "let square x = x * x in square (2 + 1) + 1",
        "10",
        "`square (2 + 1)` is `square 3`, which is 9. Then add 1: 10.",
        "`let ... in ...` makes a quick definition just for one expression. Here `square` is defined, then used.",
      ),
      q(
        "Which signature fits `average x y = (x + y) / 2`?",
        [
          "`average :: Int -> Int -> Int`",
          "`average :: Double -> Double -> Double`",
          "`average :: Double -> Double`",
          "`average :: (Double, Double) -> Double`",
        ],
        1,
        "It has two inputs, and `/` needs decimal numbers. So two Doubles in, one Double out.",
      ),
      w(
        "Write `perimeter`, which takes the width and height of a rectangle and gives the distance all the way round it.",
        hs`perimeter :: Int -> Int -> Int
perimeter w h = undefined
`,
        hs`perimeter :: Int -> Int -> Int
perimeter w h = 2 * (w + h)
`,
        [
          ["perimeter 3 4", "14"],
          ["perimeter 0 0", "0"],
          ["perimeter 5 1", "12"],
          ["perimeter 10 10", "40"],
        ],
        "Two widths plus two heights. Careful: `2 * w + h` only doubles the width. Use brackets: `2 * (w + h)`.",
      ),
      p("let half x = div x 2 in half 7 + half 9", "7", "`half 7` is 3 and `half 9` is 4 (remainders thrown away). 3 + 4 is 7."),
      q(
        "Which name can NOT be used for a function?",
        ["`double`", "`myFunction`", "`Double`", "`area2`"],
        2,
        "Function names start with a lower-case letter. Names with a capital first letter are for types, like `Double`.",
      ),
      w(
        md(
          "Write `toFahrenheit`, which converts a Celsius temperature to Fahrenheit.",
          "",
          "The rule: multiply by 9, divide by 5, then add 32.",
        ),
        hs`toFahrenheit :: Double -> Double
toFahrenheit c = undefined
`,
        hs`toFahrenheit :: Double -> Double
toFahrenheit c = c * 9 / 5 + 32
`,
        [
          ["toFahrenheit 0", "32.0"],
          ["toFahrenheit 100", "212.0"],
          ["toFahrenheit (-40)", "-40.0"],
          ["toFahrenheit 10", "50.0"],
        ],
        "`c * 9 / 5 + 32`. `*` and `/` happen before `+`, which is what you want here.",
      ),
      p("let addThenDouble x y = (x + y) * 2 in addThenDouble 3 4", "14", "`x` is 3 and `y` is 4. `(3 + 4) * 2` is 14."),
      q(
        "`square :: Int -> Int` is followed by `square = x * x`. What's wrong?",
        ["The input wasn't given a name on the left of `=`", "`*` doesn't work on Ints", "The signature should say `Int Int`", "Nothing"],
        0,
        "The left side must name the input: `square x = x * x`. Otherwise `x` means nothing.",
      ),
      w(
        "Write `isEven`, which is `True` when a number is even. Don't use `even` or `odd`: use `mod`.",
        hs`isEven :: Int -> Bool
isEven n = undefined
`,
        hs`isEven :: Int -> Bool
isEven n = mod n 2 == 0
`,
        [
          ["isEven 4", "True"],
          ["isEven 7", "False"],
          ["isEven 0", "True"],
          ["isEven (-3)", "False"],
        ],
        "A number is even when the remainder after dividing by 2 is 0. The comparison already gives a Bool.",
        { banned: ["even", "odd"] },
      ),
      p("let f x = x * 2 + 1 in f (f 1)", "7", "Inside first: `f 1` is 3. Then `f 3` is 7."),
      q(
        "If `square x = x * x`, what does `square 3 + 1` mean?",
        ["`(square 3) + 1`, which is 10", "`square (3 + 1)`, which is 16", "An error", "`square 31`"],
        0,
        "A function grabs the input right next to it first. To square 4, write `square (3 + 1)`.",
      ),
      w(
        "Write `average3`, which gives the average of three numbers.",
        hs`average3 :: Double -> Double -> Double -> Double
average3 a b c = undefined
`,
        hs`average3 :: Double -> Double -> Double -> Double
average3 a b c = (a + b + c) / 3
`,
        [
          ["average3 1 2 3", "2.0"],
          ["average3 0 0 0", "0.0"],
          ["average3 1 1 4", "2.0"],
          ["average3 (-3) 0 3", "0.0"],
        ],
        "Add all three in brackets, then divide by 3. Without brackets only `c` is divided.",
      ),
      p(
        "3 > 1 && 2 > 5",
        "False",
        "`3 > 1` is True but `2 > 5` is False. `&&` needs both to be True.",
        "`&&` means \"and\": it's True only when both sides are True. `||` means \"or\": True when at least one side is True.",
      ),
      w(
        "Write `inRange`, which takes a low number, a high number and a value, and says whether the value is between them (including the ends). Use `&&`.",
        hs`inRange :: Int -> Int -> Int -> Bool
inRange lo hi x = undefined
`,
        hs`inRange :: Int -> Int -> Int -> Bool
inRange lo hi x = lo <= x && x <= hi
`,
        [
          ["inRange 1 10 5", "True"],
          ["inRange 1 10 1", "True"],
          ["inRange 1 10 10", "True"],
          ["inRange 1 10 11", "False"],
          ["inRange 1 10 0", "False"],
        ],
        "Two checks joined with `&&`: `lo <= x` and `x <= hi`.",
      ),
      w(
        "Write `totalMinutes`, which takes a number of hours and a number of minutes and gives the total in minutes.",
        hs`totalMinutes :: Int -> Int -> Int
totalMinutes h m = undefined
`,
        hs`totalMinutes :: Int -> Int -> Int
totalMinutes h m = h * 60 + m
`,
        [
          ["totalMinutes 0 0", "0"],
          ["totalMinutes 1 30", "90"],
          ["totalMinutes 2 0", "120"],
          ["totalMinutes 0 45", "45"],
        ],
        "Each hour is 60 minutes: `h * 60`, then add `m`.",
      ),
    ],
  },

  // ───────────────────────────── lists ─────────────────────────────
  {
    id: "drill-lists",
    lesson: "lists",
    title: "Practice: Lists",
    drills: [
      q(
        "Which of these is NOT a valid list?",
        ["`[True, False]`", "`[]`", "`[True, 1]`", '`"abc"`'],
        2,
        "Every element of a list must have the same type. `True` is a Bool and `1` is a number.",
      ),
      p("5 : [6, 7]", "[5,6,7]", "`:` puts one element on the front of a list."),
      p("[1 .. 5]", "[1,2,3,4,5]", "A range includes both ends."),
      q(
        "What does `[1, 2] ++ 3` give?",
        ["`[1,2,3]`", "A type error: `++` joins two lists, and 3 isn't a list", "`[1,2] 3`", "`6`"],
        1,
        "Both sides of `++` must be lists. Write `[1, 2] ++ [3]`. To add to the front, `:` takes a single element: `0 : [1, 2]`.",
      ),
      p("[10, 8 .. 1]", "[10,8,6,4,2]", "The first two numbers set the step: down by 2. It stops before going below 1."),
      q(
        "What happens with `head []`?",
        ["It gives `0`", "It gives `[]`", "It crashes: an empty list has no first element", "It gives `False`"],
        2,
        "`head` only works on non-empty lists. On `[]` the program stops with an error. Always ask: what if the list is empty?",
      ),
      w(
        "Write `addToFront`, which puts a number on the front of a list.",
        hs`addToFront :: Int -> [Int] -> [Int]
addToFront x xs = undefined
`,
        hs`addToFront :: Int -> [Int] -> [Int]
addToFront x xs = x : xs
`,
        [
          ["addToFront 1 [2, 3]", "[1,2,3]"],
          ["addToFront 5 []", "[5]"],
          ["addToFront 0 [0]", "[0,0]"],
          ["addToFront (-1) [1]", "[-1,1]"],
        ],
        "`:` takes one element on its left and a list on its right.",
      ),
      p("reverse [1, 2, 3]", "[3,2,1]", "`reverse` gives the same elements in the opposite order.", "`reverse` flips a list."),
      q(
        "Which is the same as `[1, 2, 3]`?",
        ["`1 : 2 : 3 : []`", "`[1] : [2] : [3]`", "`1 : 2 : 3`", "`(1, 2, 3)`"],
        0,
        "Every list is built from `:` and `[]`. The list must end in `[]`; `1 : 2 : 3` has nothing to put 3 onto.",
      ),
      p(hs`'x' : "yz"`, '"xyz"', "A String is a list of Chars, so `:` can put a Char on the front."),
      p("tail [1, 2, 3]", "[2,3]", "`tail` drops the first element and keeps the rest.", "`tail` gives everything except the first element."),
      q(
        "What is `length [[1, 2], [3, 4, 5]]`?",
        ["`5`", "`2`", "`3`", "An error"],
        1,
        "This is a list of two lists. `length` counts the outer elements: there are 2.",
      ),
      w(
        "Write `upTo`, which gives the list from 1 up to n. Use a range.",
        hs`upTo :: Int -> [Int]
upTo n = undefined
`,
        hs`upTo :: Int -> [Int]
upTo n = [1 .. n]
`,
        [
          ["upTo 5", "[1,2,3,4,5]"],
          ["upTo 1", "[1]"],
          ["upTo 0", "[]"],
          ["upTo (-3)", "[]"],
        ],
        "A range can end at a name: `[1 .. n]`.",
      ),
      p("sum [1 .. 10]", "55", "1 + 2 + ... + 10 is 55.", "`sum` adds up all the numbers in a list."),
      q(
        "What is `[5 .. 1]`?",
        ["`[5,4,3,2,1]`", "`[]`", "`[1,2,3,4,5]`", "An error"],
        1,
        "Ranges count up by 1 unless you say otherwise. There's nothing counting up from 5 to 1. For a countdown write `[5, 4 .. 1]`.",
      ),
      w(
        "Write `evensUpTo`, which gives the even numbers from 2 up to n (including n if it's even). Use a range with a step.",
        hs`evensUpTo :: Int -> [Int]
evensUpTo n = undefined
`,
        hs`evensUpTo :: Int -> [Int]
evensUpTo n = [2, 4 .. n]
`,
        [
          ["evensUpTo 10", "[2,4,6,8,10]"],
          ["evensUpTo 9", "[2,4,6,8]"],
          ["evensUpTo 2", "[2]"],
          ["evensUpTo 1", "[]"],
        ],
        "Give the first two elements to set the step: `[2, 4 .. n]`.",
      ),
      p('drop 2 "hello"', '"llo"', "The first two characters, `h` and `e`, are thrown away.", "`drop n` throws away the first n elements."),
      w(
        md(
          "Write `wrap`, which puts a character at both the start and end of a String.",
          "",
          "For example `wrap '*' \"hi\"` is `\"*hi*\"`.",
        ),
        hs`wrap :: Char -> String -> String
wrap c s = undefined
`,
        hs`wrap :: Char -> String -> String
wrap c s = c : s ++ [c]
`,
        [
          ['wrap \'*\' "hi"', '"*hi*"'],
          ['wrap \'-\' ""', '"--"'],
          ["wrap ' ' \"a\"", '" a "'],
          ['wrap \'x\' "x"', '"xxx"'],
        ],
        "`:` works at the front, but at the end you need `++`, and `++` needs a list on both sides: `s ++ [c]`.",
      ),
      w(
        "Write `countdownFrom`, which gives the numbers from n down to 1. Use a range.",
        hs`countdownFrom :: Int -> [Int]
countdownFrom n = undefined
`,
        hs`countdownFrom :: Int -> [Int]
countdownFrom n = [n, n - 1 .. 1]
`,
        [
          ["countdownFrom 3", "[3,2,1]"],
          ["countdownFrom 1", "[1]"],
          ["countdownFrom 0", "[]"],
          ["countdownFrom 5", "[5,4,3,2,1]"],
        ],
        "`[n .. 1]` counts up, so it's empty. Give the second element to count down: `[n, n - 1 .. 1]`.",
      ),
      w(
        "Write `firstThree`, which gives the first three elements of a list (or the whole list if it's shorter). Use `take`.",
        hs`firstThree :: [Int] -> [Int]
firstThree xs = undefined
`,
        hs`firstThree :: [Int] -> [Int]
firstThree xs = take 3 xs
`,
        [
          ["firstThree [1 .. 10]", "[1,2,3]"],
          ["firstThree [7, 8]", "[7,8]"],
          ["firstThree []", "[]"],
          ["firstThree [4, 5, 6]", "[4,5,6]"],
        ],
        "`take 3 xs`. `take` never crashes on short lists; it just gives what's there.",
      ),
    ],
  },
  // ───────────────────────────── tuples ─────────────────────────────
  {
    id: "drill-tuples",
    lesson: "tuples",
    title: "Practice: Tuples",
    drills: [
      q(
        "What is the type of `('a', True)`?",
        ["`(Char, Bool)`", "`[Char, Bool]`", "`(Bool, Char)`", "`Char -> Bool`"],
        0,
        "A pair: a Char first, then a Bool. The order in the type matches the order in the value.",
      ),
      p("fst (3, 'x')", "3", "`fst` gives the first part of a pair."),
      p('snd ("cat", 9)', "9", "`snd` gives the second part of a pair."),
      q(
        "You want to keep a student's name and mark together. Which fits best?",
        ['A pair like `("Ana", 72)`', 'A list like `["Ana", 72]`', "A Bool", "A range"],
        0,
        "The name is a String and the mark is a number. A list can't mix types; a tuple can.",
      ),
      q(
        "What does `fst (1, 2, 3)` do?",
        ["Gives `1`", "Type error: `fst` only works on pairs", "Gives `(1, 2)`", "Gives `3`"],
        1,
        "`fst` and `snd` are only for tuples of exactly two. For bigger tuples you take them apart with a pattern, like `(a, b, c)`.",
      ),
      w(
        "Write `addPair`, which adds the two numbers in a pair.",
        hs`addPair :: (Int, Int) -> Int
addPair (x, y) = undefined
`,
        hs`addPair :: (Int, Int) -> Int
addPair (x, y) = x + y
`,
        [
          ["addPair (2, 3)", "5"],
          ["addPair (0, 0)", "0"],
          ["addPair (-4, 4)", "0"],
          ["addPair (10, -3)", "7"],
        ],
        "The pattern `(x, y)` already names both parts. Just add them.",
      ),
      p(hs`zip [1, 2, 3] "ab"`, "[(1,'a'),(2,'b')]", "`zip` stops as soon as either list runs out, so the 3 is left out."),
      p("snd (fst ((1, 2), 3))", "2", "`fst ((1, 2), 3)` is `(1, 2)`. Then `snd (1, 2)` is 2."),
      q(
        "What's the type of `[(1, 'a'), (2, 'b')]`, if the numbers are Ints?",
        ["`[(Int, Char)]`", "`([Int], [Char])`", "`(Int, Char)`", "`[Int, Char]`"],
        0,
        "A list whose elements are each a pair of an Int and a Char.",
      ),
      w(
        "Write `sortPair`, which puts the smaller number first.",
        hs`sortPair :: (Int, Int) -> (Int, Int)
sortPair (x, y) = undefined
`,
        hs`sortPair :: (Int, Int) -> (Int, Int)
sortPair (x, y) = (min x y, max x y)
`,
        [
          ["sortPair (5, 2)", "(2,5)"],
          ["sortPair (1, 9)", "(1,9)"],
          ["sortPair (3, 3)", "(3,3)"],
          ["sortPair (-1, -7)", "(-7,-1)"],
        ],
        "Build a new pair: the `min` of the two, then the `max`.",
      ),
      p(
        hs`unzip [(1, 'a'), (2, 'b')]`,
        hs`([1,2],"ab")`,
        "The first parts go into one list and the second parts into another. A list of Chars is shown as a String.",
        "`unzip` does the opposite of `zip`: it turns a list of pairs into a pair of lists.",
      ),
      q(
        "Are `(1, 2)` and `(2, 1)` equal?",
        ["Yes, they have the same numbers", "No, order matters in a tuple"],
        1,
        "Tuples are compared position by position. The first parts differ, so they're not equal.",
      ),
      w(
        md(
          "Prices are stored in pence. Write `splitMoney`, which gives a pair of (pounds, pence).",
          "",
          "For example `splitMoney 250` is `(2, 50)`. Use `div` and `mod`.",
        ),
        hs`splitMoney :: Int -> (Int, Int)
splitMoney p = undefined
`,
        hs`splitMoney :: Int -> (Int, Int)
splitMoney p = (div p 100, mod p 100)
`,
        [
          ["splitMoney 250", "(2,50)"],
          ["splitMoney 99", "(0,99)"],
          ["splitMoney 0", "(0,0)"],
          ["splitMoney 100", "(1,0)"],
        ],
        "There are 100 pence in a pound. Whole pounds: `div p 100`. Pence left over: `mod p 100`.",
      ),
      p(hs`length (zip [1 .. 10] "abc")`, "3", "`zip` stops at the shorter list, which has 3 elements."),
      q(
        "How is a tuple different from a list?",
        [
          "A tuple has a fixed size and can mix types; a list can be any length but holds one type",
          "A tuple is just a faster list",
          "Tuples can only hold numbers",
          "There's no difference",
        ],
        0,
        "Use a tuple to group a few different things together, and a list for many things of the same kind.",
      ),
      w(
        md(
          "On a grid you can only move along rows and columns. Write `gridDistance`, which gives how many steps it takes to go from one point to another.",
          "",
          "It's the distance across plus the distance up or down. `abs` gives the size of a number without its sign: `abs (-3)` is 3.",
        ),
        hs`gridDistance :: (Int, Int) -> (Int, Int) -> Int
gridDistance (x1, y1) (x2, y2) = undefined
`,
        hs`gridDistance :: (Int, Int) -> (Int, Int) -> Int
gridDistance (x1, y1) (x2, y2) = abs (x1 - x2) + abs (y1 - y2)
`,
        [
          ["gridDistance (0, 0) (3, 4)", "7"],
          ["gridDistance (2, 2) (2, 2)", "0"],
          ["gridDistance (-1, -1) (1, 1)", "4"],
          ["gridDistance (5, 2) (2, 5)", "6"],
        ],
        "`abs (x1 - x2)` is the distance across. Add the same thing for the `y`s.",
      ),
      p(hs`zip "ab" [True, False]`, "[('a',True),('b',False)]", "Each Char is paired with the Bool in the same position."),
      w(
        md(
          "Write `numbered`, which pairs each character of a String with its position, counting from 1.",
          "",
          "For example `numbered \"hi\"` is `[(1,'h'),(2,'i')]`.",
        ),
        hs`numbered :: String -> [(Int, Char)]
numbered s = undefined
`,
        hs`numbered :: String -> [(Int, Char)]
numbered s = zip [1 ..] s
`,
        [
          ['numbered "abc"', "[(1,'a'),(2,'b'),(3,'c')]"],
          ['numbered ""', "[]"],
          ['numbered "z"', "[(1,'z')]"],
          ['numbered "hi!"', "[(1,'h'),(2,'i'),(3,'!')]"],
        ],
        "`zip` an endless range `[1 ..]` with the string. `zip` stops when the string runs out.",
      ),
      w(
        "Write `addVectors`, which adds two pairs part by part: the first parts together and the second parts together.",
        hs`addVectors :: (Int, Int) -> (Int, Int) -> (Int, Int)
addVectors (a, b) (c, d) = undefined
`,
        hs`addVectors :: (Int, Int) -> (Int, Int) -> (Int, Int)
addVectors (a, b) (c, d) = (a + c, b + d)
`,
        [
          ["addVectors (1, 2) (3, 4)", "(4,6)"],
          ["addVectors (0, 0) (0, 0)", "(0,0)"],
          ["addVectors (-1, 5) (1, -5)", "(0,0)"],
          ["addVectors (10, 0) (0, 10)", "(10,10)"],
        ],
        "Build a new pair: `(a + c, b + d)`.",
      ),
    ],
  },

  // ───────────────────────────── choices ─────────────────────────────
  {
    id: "drill-choices",
    lesson: "choices",
    title: "Practice: Making choices with if and guards",
    drills: [
      q(
        'What\'s wrong with `if x > 0 then "positive"`?',
        ["Nothing", "It's missing the `else` part, which Haskell requires", "It needs brackets around `x > 0`", "`then` should be `:`"],
        1,
        "Every `if` must have an `else`, because an expression must always have a value. What would the answer be when `x` isn't positive?",
      ),
      p(hs`if 10 > 5 then "big" else "small"`, '"big"', "`10 > 5` is True, so the `then` answer is used."),
      q(
        'Why is `if True then 1 else "no"` an error?',
        ["Both answers must have the same type", "`True` can't be used in an `if`", "Numbers aren't allowed in an `if`", "You must use guards instead"],
        0,
        "The whole `if` has one type. It can't be a number one time and a String another.",
      ),
      p(hs`show 42 ++ "!"`, '"42!"', "`show 42` is the text `\"42\"`, which can be joined with `++`.", "`show` turns a value into text."),
      q(
        md(
          "Given this function, what is `grade 85`?",
          "`grade m`",
          '`  | m >= 50 = "Pass"`',
          '`  | m >= 70 = "Distinction"`',
          '`  | otherwise = "Fail"`',
        ),
        ['`"Distinction"`', '`"Pass"`', '`"Fail"`', "An error"],
        1,
        "Guards are tried from top to bottom and the first True one wins. 85 >= 50 is True, so it never reaches the 70 line. Put the strictest test first.",
      ),
      w(
        "Write `absolute`, which gives the size of a number without its sign. Don't use `abs`.",
        hs`absolute :: Int -> Int
absolute x = undefined
`,
        hs`absolute :: Int -> Int
absolute x = if x < 0 then negate x else x
`,
        [
          ["absolute (-5)", "5"],
          ["absolute 5", "5"],
          ["absolute 0", "0"],
          ["absolute (-1)", "1"],
        ],
        "If it's below zero, `negate` it; otherwise leave it alone.",
        { banned: ["abs"] },
      ),
      p("if mod 10 3 == 0 then 1 else 0", "0", "10 divided by 3 leaves 1, not 0, so the `else` answer is used."),
      q(
        "What is `otherwise`?",
        ["A keyword meaning 'error'", "Just another name for `True`", "A function that ends the program", "The same as `else`, and it only works in `if`"],
        1,
        "`otherwise` is defined as `True`, so the guard always passes. That's why it goes last, to catch everything left.",
      ),
      p("length (show 12345)", "5", "`show 12345` is the text `\"12345\"`, which has 5 characters."),
      w(
        "Write `maxOfThree`, which gives the biggest of three numbers. Use guards, not `max`.",
        hs`maxOfThree :: Int -> Int -> Int -> Int
maxOfThree a b c = undefined
`,
        hs`maxOfThree :: Int -> Int -> Int -> Int
maxOfThree a b c
  | a >= b && a >= c = a
  | b >= c = b
  | otherwise = c
`,
        [
          ["maxOfThree 1 2 3", "3"],
          ["maxOfThree 3 2 1", "3"],
          ["maxOfThree 2 3 1", "3"],
          ["maxOfThree 5 5 5", "5"],
          ["maxOfThree (-1) (-2) (-3)", "-1"],
        ],
        "First guard: is `a` at least as big as both others? If not, the answer is the bigger of `b` and `c`.",
        { banned: ["max", "maximum"] },
      ),
      q(
        md("Where's the mistake?", "`sign x =`", "`  | x > 0 = 1`", "`  | otherwise = 0`"),
        ["There should be no `=` after `sign x` when using guards", "`otherwise` should be `else`", "Guards need `if` in front", "Nothing"],
        0,
        "With guards, each guard line has its own `=`. The first line is just `sign x`.",
      ),
      p(hs`if not (3 == 3) then "a" else "b"`, '"b"', "`3 == 3` is True, so `not (3 == 3)` is False, and the `else` answer is used."),
      w(
        md(
          "Write `classify`, which describes a number as `\"negative\"`, `\"zero\"` or `\"positive\"`.",
        ),
        hs`classify :: Int -> String
classify n = undefined
`,
        hs`classify :: Int -> String
classify n
  | n < 0 = "negative"
  | n == 0 = "zero"
  | otherwise = "positive"
`,
        [
          ["classify (-7)", '"negative"'],
          ["classify 0", '"zero"'],
          ["classify 3", '"positive"'],
          ["classify (-1)", '"negative"'],
        ],
        "Three guards: below zero, equal to zero, and `otherwise`.",
      ),
      q(
        "What is `show 7`?",
        ["`7`", '`"7"`', "`'7'`", "`[7]`"],
        1,
        "`show` always gives a String, so the answer is the text `\"7\"`, in double quotes.",
      ),
      p(
        "if 2 > 1 then 10 else 20 + 5",
        "10",
        "The `else` part is `20 + 5`, but it isn't used because `2 > 1` is True. The answer is 10, not 15.",
      ),
      w(
        md(
          "Write `fizzBuzz`:",
          "",
          "multiples of both 3 and 5 give `\"FizzBuzz\"`",
          "other multiples of 3 give `\"Fizz\"`",
          "other multiples of 5 give `\"Buzz\"`",
          "anything else gives the number as text",
        ),
        hs`fizzBuzz :: Int -> String
fizzBuzz n = undefined
`,
        hs`fizzBuzz :: Int -> String
fizzBuzz n
  | mod n 15 == 0 = "FizzBuzz"
  | mod n 3 == 0 = "Fizz"
  | mod n 5 == 0 = "Buzz"
  | otherwise = show n
`,
        [
          ["fizzBuzz 15", '"FizzBuzz"'],
          ["fizzBuzz 9", '"Fizz"'],
          ["fizzBuzz 10", '"Buzz"'],
          ["fizzBuzz 7", '"7"'],
          ["fizzBuzz 0", '"FizzBuzz"'],
        ],
        "Check the both-3-and-5 case first. If the `mod n 3` guard came first, 15 would give `\"Fizz\"`.",
      ),
      w(
        md(
          "Write `ticketPrice`, which gives the price for someone's age:",
          "",
          "under 3: 0",
          "under 16: 5",
          "65 or over: 7",
          "everyone else: 10",
        ),
        hs`ticketPrice :: Int -> Int
ticketPrice age = undefined
`,
        hs`ticketPrice :: Int -> Int
ticketPrice age
  | age < 3 = 0
  | age < 16 = 5
  | age >= 65 = 7
  | otherwise = 10
`,
        [
          ["ticketPrice 2", "0"],
          ["ticketPrice 3", "5"],
          ["ticketPrice 15", "5"],
          ["ticketPrice 16", "10"],
          ["ticketPrice 64", "10"],
          ["ticketPrice 65", "7"],
        ],
        "Guards from the youngest up. Check the edges carefully: 3 is not under 3.",
      ),
      w(
        md(
          "Write `leapYear`. A year is a leap year if it divides by 4, except years that divide by 100 are not, except years that divide by 400 are.",
          "",
          "So 2024 is, 1900 is not, and 2000 is.",
        ),
        hs`leapYear :: Int -> Bool
leapYear y = undefined
`,
        hs`leapYear :: Int -> Bool
leapYear y
  | mod y 400 == 0 = True
  | mod y 100 == 0 = False
  | otherwise = mod y 4 == 0
`,
        [
          ["leapYear 2024", "True"],
          ["leapYear 2023", "False"],
          ["leapYear 1900", "False"],
          ["leapYear 2000", "True"],
        ],
        "Start with the most specific rule: divisible by 400. Then 100. Then 4.",
      ),
    ],
  },

  // ───────────────────────────── patterns ─────────────────────────────
  {
    id: "drill-patterns",
    lesson: "patterns",
    title: "Practice: Pattern matching and recursion",
    drills: [
      q(
        "Which pattern matches any list with at least one element?",
        ["`[]`", "`(x : xs)`", "`[x, xs]`", "`x xs`"],
        1,
        "`(x : xs)` means a first element `x` stuck on the front of the rest `xs`. `[x, xs]` would only match lists of exactly two elements.",
      ),
      q(
        "When `myLength (x : xs)` is given `[5]`, what is `xs`?",
        ["`5`", "`[]`", "`[5]`", "Nothing: the pattern doesn't match"],
        1,
        "`[5]` is really `5 : []`. So `x` is 5 and `xs` is the empty list.",
      ),
      p(
        hs`let f 0 = "zero"; f _ = "other" in f 3`,
        '"other"',
        "3 doesn't match the pattern `0`, so Haskell tries the next equation. `_` matches anything.",
        "In GHCi you can write several equations on one line, separated by `;`.",
      ),
      q(
        md("Given these equations, what is `isZero 0`?", "`isZero _ = False`", "`isZero 0 = True`"),
        ["`True`", "`False`", "An error"],
        1,
        "Equations are tried from top to bottom. `_` matches everything, so the first equation always wins. Put specific patterns first.",
      ),
      w(
        "Write `factorial` using recursion. `factorial n` is `n * (n - 1) * ... * 1`, and `factorial 0` is 1.",
        hs`factorial :: Int -> Int
factorial 0 = undefined
factorial n = undefined
`,
        hs`factorial :: Int -> Int
factorial 0 = 1
factorial n = n * factorial (n - 1)
`,
        [
          ["factorial 0", "1"],
          ["factorial 1", "1"],
          ["factorial 3", "6"],
          ["factorial 5", "120"],
        ],
        "The base case is 1. Otherwise multiply `n` by the factorial of `n - 1`. The brackets around `n - 1` matter.",
      ),
      p(hs`let fact 0 = 1; fact n = n * fact (n - 1) in fact 4`, "24", "`4 * 3 * 2 * 1 * 1` is 24."),
      q(
        "What happens if you leave out the base case `mySum [] = 0`?",
        [
          "The answer is off by one",
          "The recursion reaches `[]`, no equation matches, and the program crashes",
          "It works anyway because Haskell guesses 0",
          "It refuses to compile",
        ],
        1,
        "Every recursion eventually reaches the empty list. With no equation for `[]`, you get a \"Non-exhaustive patterns\" crash.",
      ),
      p(
        hs`let f [] = 0; f (x : xs) = x + 2 * f xs in f [1, 2, 3]`,
        "17",
        "Work inside out: `f [3]` is 3 + 2 * 0 = 3. `f [2, 3]` is 2 + 2 * 3 = 8. `f [1, 2, 3]` is 1 + 2 * 8 = 17.",
      ),
      w(
        "Write `doubleEach`, which doubles every number in a list, using recursion. Don't use `map`.",
        hs`doubleEach :: [Int] -> [Int]
doubleEach [] = undefined
doubleEach (x : xs) = undefined
`,
        hs`doubleEach :: [Int] -> [Int]
doubleEach [] = []
doubleEach (x : xs) = 2 * x : doubleEach xs
`,
        [
          ["doubleEach [1, 2, 3]", "[2,4,6]"],
          ["doubleEach []", "[]"],
          ["doubleEach [-1]", "[-2]"],
          ["doubleEach [0, 5]", "[0,10]"],
        ],
        "Double the first element and put it on the front of the doubled rest: `2 * x : doubleEach xs`.",
        { banned: ["map"] },
      ),
      q(
        "What does `_` mean in a pattern?",
        ["Match anything and don't give it a name", "Match only empty lists", "Match only zero", "A gap you must fill in later"],
        0,
        "Use `_` when you don't need the value. It matches anything.",
      ),
      p(
        hs`let g [] = "empty"; g [x] = "one"; g _ = "many" in g [7, 8]`,
        '"many"',
        "`[7, 8]` isn't empty and doesn't have exactly one element, so it falls to `_`.",
        "The pattern `[x]` matches a list with exactly one element.",
      ),
      w(
        "Write `myReverse`, which reverses a list, using recursion. Don't use `reverse`.",
        hs`myReverse :: [a] -> [a]
myReverse [] = undefined
myReverse (x : xs) = undefined
`,
        hs`myReverse :: [a] -> [a]
myReverse [] = []
myReverse (x : xs) = myReverse xs ++ [x]
`,
        [
          ["myReverse [1, 2, 3]", "[3,2,1]"],
          ['myReverse "abc"', '"cba"'],
          ["myReverse ([] :: [Int])", "[]"],
          ["myReverse [7]", "[7]"],
        ],
        "Reverse the rest, then put `x` on the end. `++` needs a list on both sides, so write `[x]`.",
        { banned: ["reverse"] },
      ),
      q(
        "Each recursive call of `myLength` works on...",
        ["The same list again", "A list one element shorter", "A list one element longer", "Only the first element"],
        1,
        "`myLength (x : xs)` calls `myLength xs`, which is one shorter. That's why it eventually reaches `[]` and stops.",
      ),
      p(
        hs`let count [] = 0; count (c : cs) = (if c == 'a' then 1 else 0) + count cs in count "banana"`,
        "3",
        "Each `'a'` adds 1 and every other letter adds 0. \"banana\" has three a's.",
      ),
      w(
        "Write `power`, where `power b n` is `b` multiplied by itself `n` times. `power b 0` is 1. Use recursion, not `^`.",
        hs`power :: Int -> Int -> Int
power b 0 = undefined
power b n = undefined
`,
        hs`power :: Int -> Int -> Int
power _ 0 = 1
power b n = b * power b (n - 1)
`,
        [
          ["power 2 10", "1024"],
          ["power 5 0", "1"],
          ["power 0 3", "0"],
          ["power (-2) 3", "-8"],
        ],
        "Recurse on `n`: `b * power b (n - 1)`.",
        { banned: ["^", "^^", "**"] },
      ),
      w(
        md(
          "Exam-style. Write `countChar`, which counts how many times a character appears in a String.",
          "",
          "For example `countChar 'a' \"banana\"` is 3. Upper and lower case are different characters.",
        ),
        hs`countChar :: Char -> String -> Int
countChar c s = undefined
`,
        hs`countChar :: Char -> String -> Int
countChar _ [] = 0
countChar c (x : xs)
  | c == x = 1 + countChar c xs
  | otherwise = countChar c xs
`,
        [
          ['countChar \'a\' "banana"', "3"],
          ['countChar \'z\' "banana"', "0"],
          ['countChar \'a\' ""', "0"],
          ['countChar \'b\' "b"', "1"],
          ['countChar \'A\' "aA"', "1"],
        ],
        "Base case: the empty String has 0. Otherwise use guards: if `x` is the character, count 1 plus the rest.",
      ),
      w(
        md(
          "Exam-style. A table is a list of (key, value) pairs. Write `removeKey`, which removes every pair with the given key and keeps the rest in order.",
        ),
        hs`removeKey :: Int -> [(Int, String)] -> [(Int, String)]
removeKey k table = undefined
`,
        hs`removeKey :: Int -> [(Int, String)] -> [(Int, String)]
removeKey _ [] = []
removeKey k ((k', v) : rest)
  | k == k' = removeKey k rest
  | otherwise = (k', v) : removeKey k rest
`,
        [
          ['removeKey 2 [(1, "a"), (2, "b"), (3, "c")]', '[(1,"a"),(3,"c")]'],
          ['removeKey 9 [(1, "a"), (2, "b")]', '[(1,"a"),(2,"b")]'],
          ["removeKey 1 []", "[]"],
          ['removeKey 1 [(1, "x"), (1, "y")]', "[]"],
        ],
        "You can pattern match on a pair inside the list: `((k', v) : rest)`. Skip the pair if the key matches, otherwise keep it.",
      ),
      w(
        md(
          "Exam-style. Write `everyOther`, which keeps the 1st, 3rd, 5th... elements of a list.",
          "",
          "For example `everyOther \"abcde\"` is `\"ace\"`.",
        ),
        hs`everyOther :: [a] -> [a]
everyOther xs = undefined
`,
        hs`everyOther :: [a] -> [a]
everyOther (x : _ : rest) = x : everyOther rest
everyOther xs = xs
`,
        [
          ["everyOther [1, 2, 3, 4, 5]", "[1,3,5]"],
          ['everyOther "abcdef"', '"ace"'],
          ["everyOther ([] :: [Int])", "[]"],
          ["everyOther [9]", "[9]"],
        ],
        "A pattern can take two elements off at once: `(x : _ : rest)`. Lists with fewer than two elements are already done.",
      ),
      w(
        md(
          "Exam-style. Write `squash`, which replaces each run of the same character next to each other with a single copy.",
          "",
          "For example `squash \"aaabccdd\"` is `\"abcd\"` and `squash \"mississippi\"` is `\"misisipi\"`.",
        ),
        hs`squash :: String -> String
squash s = undefined
`,
        hs`squash :: String -> String
squash (x : y : rest)
  | x == y = squash (y : rest)
  | otherwise = x : squash (y : rest)
squash s = s
`,
        [
          ['squash "aaabccdd"', '"abcd"'],
          ['squash ""', '""'],
          ['squash "a"', '"a"'],
          ['squash "abab"', '"abab"'],
          ['squash "mississippi"', '"misisipi"'],
        ],
        "Look at the first two characters `(x : y : rest)`. If they're equal, drop `x` and carry on with `y : rest`.",
      ),
    ],
  },

  // ───────────────────────────── typevars ─────────────────────────────
  {
    id: "drill-typevars",
    lesson: "typevars",
    title: "Practice: Type variables",
    drills: [
      q(
        "`fst :: (a, b) -> a`. What is the type of `fst (True, 'x')`?",
        ["`Bool`", "`Char`", "`(Bool, Char)`", "`a`"],
        0,
        "Here `a` is Bool and `b` is Char. `fst` gives back an `a`, which is a Bool.",
      ),
      q(
        "`length :: [a] -> Int` (simplified). Which is true?",
        [
          "It works on lists of any type and always gives an Int",
          "It only works on lists of Ints",
          "It gives back the same type as the elements",
          "It only works on Strings",
        ],
        0,
        "`a` can be any type, so any list works. The result is always `Int`, whatever `a` is.",
      ),
      p('id "same"', '"same"', "`id` gives back exactly what it was given.", "`id :: a -> a` gives back its input unchanged."),
      q(
        "Could a function of type `a -> a -> a` be called as `f 1 'x'`?",
        ["Yes", "No: both inputs are `a`, so they must be the same type"],
        1,
        "The same letter means the same type everywhere in one signature. 1 and `'x'` are different types.",
      ),
      p("head [[1, 2], [3]]", "[1,2]", "The elements are lists, so `a` is `[Int]` and the first element is the list `[1, 2]`."),
      w(
        "Write `myFst`, which gives the first part of any pair. Don't use `fst`.",
        hs`myFst :: (a, b) -> a
myFst p = undefined
`,
        hs`myFst :: (a, b) -> a
myFst (x, _) = x
`,
        [
          ["myFst (1, 'x')", "1"],
          ['myFst ("hi", True)', '"hi"'],
          ["myFst ('z', 'y')", "'z'"],
          ["myFst (True, 3)", "True"],
        ],
        "Take the pair apart with a pattern: `myFst (x, _) = x`.",
        { banned: ["fst"] },
      ),
      q(
        "If `xs :: [String]`, what is the type of `head xs`?",
        ["`String`", "`[String]`", "`Char`", "`a`"],
        0,
        "`head :: [a] -> a`. Here `[a]` is `[String]`, so `a` is String.",
      ),
      p(hs`snd (head [(1, 'x'), (2, 'y')])`, "'x'", "`head` gives `(1, 'x')`, then `snd` gives `'x'`. GHCi shows a Char in single quotes."),
      q(
        '`zip :: [a] -> [b] -> [(a, b)]`. What is the type of `zip "ab" [True, False]`?',
        ["`[(Char, Bool)]`", "`[(String, Bool)]`", "`([Char], [Bool])`", "`[(Bool, Char)]`"],
        0,
        "`\"ab\"` is `[Char]`, so `a` is Char. The second list makes `b` Bool. The result is a list of `(Char, Bool)` pairs.",
      ),
      w(
        "Write `twoOf`, which gives a list containing two copies of its input. It should work for any type.",
        hs`twoOf :: a -> [a]
twoOf x = undefined
`,
        hs`twoOf :: a -> [a]
twoOf x = [x, x]
`,
        [
          ["twoOf 'a'", '"aa"'],
          ["twoOf True", "[True,True]"],
          ["twoOf 3", "[3,3]"],
          ['twoOf "hi"', '["hi","hi"]'],
        ],
        "Build the list directly: `[x, x]`.",
      ),
      p("const 'a' True", "'a'", "`const` ignores its second input and gives back the first.", "`const` takes two inputs and gives back the first."),
      q(
        "`const` gives back its first input and ignores the second. Which type fits it?",
        ["`a -> b -> a`", "`a -> b -> b`", "`a -> a`", "`(a, b) -> b`"],
        0,
        "Two inputs that may be different types, and the result has the same type as the first.",
      ),
      w(
        "Write `myLength` for lists of any type, using recursion. Don't use `length`.",
        hs`myLength :: [a] -> Int
myLength [] = undefined
myLength (x : xs) = undefined
`,
        hs`myLength :: [a] -> Int
myLength [] = 0
myLength (_ : xs) = 1 + myLength xs
`,
        [
          ['myLength "hello"', "5"],
          ["myLength ([] :: [Int])", "0"],
          ["myLength [True]", "1"],
          ["myLength [[1], [2, 3]]", "2"],
        ],
        "Empty list: 0. Otherwise 1 plus the length of the rest.",
        { banned: ["length"] },
      ),
      p('reverse ["ab", "cd"]', '["cd","ab"]', "`reverse` flips the order of the elements. It doesn't look inside them, so each string stays the same."),
      w(
        "Write `myLast`, which gives the last element of a non-empty list. Don't use `last`.",
        hs`myLast :: [a] -> a
myLast [x] = undefined
myLast (x : xs) = undefined
`,
        hs`myLast :: [a] -> a
myLast [x] = x
myLast (_ : xs) = myLast xs
`,
        [
          ["myLast [1, 2, 3]", "3"],
          ['myLast "abc"', "'c'"],
          ["myLast [True]", "True"],
          ["myLast [[1], [2]]", "[2]"],
        ],
        "A one-element list `[x]` is the base case. Otherwise throw away the first element and keep looking.",
        { banned: ["last"] },
      ),
      w(
        md(
          "Write `rotate`, which moves the first element of a list to the end.",
          "",
          "For example `rotate [1, 2, 3]` is `[2, 3, 1]`. An empty list stays empty.",
        ),
        hs`rotate :: [a] -> [a]
rotate xs = undefined
`,
        hs`rotate :: [a] -> [a]
rotate [] = []
rotate (x : xs) = xs ++ [x]
`,
        [
          ["rotate [1, 2, 3]", "[2,3,1]"],
          ['rotate "abc"', '"bca"'],
          ["rotate ([] :: [Int])", "[]"],
          ["rotate [5]", "[5]"],
        ],
        "Two equations: one for `[]`, one for `(x : xs)`. No recursion needed.",
      ),
      w(
        "Exam-style. Write `myZip`, which pairs up two lists like `zip`, stopping when either runs out. Don't use `zip`.",
        hs`myZip :: [a] -> [b] -> [(a, b)]
myZip xs ys = undefined
`,
        hs`myZip :: [a] -> [b] -> [(a, b)]
myZip (x : xs) (y : ys) = (x, y) : myZip xs ys
myZip _ _ = []
`,
        [
          ['myZip [1, 2, 3] "ab"', "[(1,'a'),(2,'b')]"],
          ['myZip ([] :: [Int]) "abc"', "[]"],
          ["myZip \"x\" [True]", "[('x',True)]"],
          ["myZip [1, 2] [3, 4]", "[(1,3),(2,4)]"],
        ],
        "If both lists have a first element, pair them and recurse. In every other case the answer is `[]`.",
        { banned: ["zip", "zipWith"] },
      ),
      w(
        md(
          "Exam-style. Write `neighbours`, which pairs each element with the one after it.",
          "",
          "For example `neighbours [1, 2, 3]` is `[(1,2),(2,3)]`.",
        ),
        hs`neighbours :: [a] -> [(a, a)]
neighbours xs = undefined
`,
        hs`neighbours :: [a] -> [(a, a)]
neighbours (x : y : rest) = (x, y) : neighbours (y : rest)
neighbours _ = []
`,
        [
          ["neighbours [1, 2, 3]", "[(1,2),(2,3)]"],
          ["neighbours [1]", "[]"],
          ["neighbours ([] :: [Int])", "[]"],
          ['neighbours "abcd"', "[('a','b'),('b','c'),('c','d')]"],
        ],
        "Take two elements with `(x : y : rest)`, but recurse on `y : rest` so `y` gets paired again.",
      ),
      w(
        md(
          "Exam-style. Write `interleave`, which takes elements from two lists in turn, starting with the first list. When one runs out, the rest of the other follows.",
          "",
          "For example `interleave \"ace\" \"bd\"` is `\"abcde\"`.",
        ),
        hs`interleave :: [a] -> [a] -> [a]
interleave xs ys = undefined
`,
        hs`interleave :: [a] -> [a] -> [a]
interleave [] ys = ys
interleave (x : xs) ys = x : interleave ys xs
`,
        [
          ["interleave [1, 3, 5] [2, 4, 6]", "[1,2,3,4,5,6]"],
          ['interleave "ace" "bd"', '"abcde"'],
          ["interleave ([] :: [Int]) [1, 2]", "[1,2]"],
          ['interleave "ab" ""', '"ab"'],
        ],
        "A neat trick: take `x` from the first list, then swap the two lists round for the recursive call.",
      ),
    ],
  },

  // ───────────────────────────── classes ─────────────────────────────
  {
    id: "drill-classes",
    lesson: "classes",
    title: "Practice: Classes",
    drills: [
      q(
        "What does `Eq a =>` at the start of a type mean?",
        ["`a` must be a type whose values can be compared with `==`", "`a` equals something", "`a` is a number", "The function gives back a Bool"],
        0,
        "It's a constraint: the function works for any type `a`, as long as `a` is in the `Eq` class.",
      ),
      q(
        "Why does `sort` need `Ord a`?",
        ["It has to compare elements to put them in order", "It prints the list", "It adds the elements up", "It doesn't need it"],
        0,
        "Sorting means deciding which of two elements comes first, which needs `<` from `Ord`.",
      ),
      p(hs`show "hi"`, hs`"\"hi\""`, "`show` of a String keeps the quote marks as part of the text, written `\\\"` inside a String. That's why you use `putStrLn`, not `print`, for plain text."),
      q(
        "What is `length [1, 2, 3] / 2`?",
        ["`1.5`", "A type error: `length` gives an Int, and `/` needs a type like Double", "`1`", "`2`"],
        1,
        "`/` belongs to `Fractional`, and Int isn't in it. Convert first with `fromIntegral`.",
      ),
      p(
        "fromIntegral (length [1, 2, 3]) / 2",
        "1.5",
        "`fromIntegral` turns the Int 3 into a number that `/` can use, so you get 1.5.",
        "`fromIntegral` turns a whole number into any number type, so you can use it with `/`.",
      ),
      w(
        md(
          "Write `describe`, which turns a number into a sentence.",
          "",
          "For example `describe 42` is `\"The answer is 42\"`.",
        ),
        hs`describe :: Int -> String
describe n = undefined
`,
        hs`describe :: Int -> String
describe n = "The answer is " ++ show n
`,
        [
          ["describe 42", '"The answer is 42"'],
          ["describe 0", '"The answer is 0"'],
          ["describe (-3)", '"The answer is -3"'],
          ["describe 100", '"The answer is 100"'],
        ],
        "`++` needs two Strings, so turn the number into text first with `show n`.",
      ),
      q(
        "What is `div 7.0 2`?",
        ["`3.5`", "`3.0`", "A type error: `div` needs a whole-number (Integral) type, and 7.0 is a decimal", "`3`"],
        2,
        "`div` and `mod` are in `Integral`. Decimals belong to `Fractional`, which uses `/`.",
      ),
      p(
        hs`read "42" + 1`,
        "43",
        "Adding 1 tells Haskell the text should be read as a number. `read \"42\"` is 42, plus 1 is 43.",
        "`read` turns text into a value. Haskell works out which type from how you use it.",
      ),
      q(
        "You write `data Colour = Red | Green` with no `deriving`. What happens when GHCi tries to print `Red`?",
        [
          "It prints `Red`",
          "An error: there's no Show instance, so Haskell doesn't know how to turn it into text",
          "It prints `0`",
          "It prints `Colour`",
        ],
        1,
        "Printing needs `Show`. Add `deriving (Show)`, or `deriving (Eq, Show)` to compare values too.",
      ),
      w(
        md(
          "Write `average`, which gives the mean of a non-empty list of Ints as a Double.",
          "",
          "You need `fromIntegral` on both the total and the count.",
        ),
        hs`average :: [Int] -> Double
average xs = undefined
`,
        hs`average :: [Int] -> Double
average xs = fromIntegral (sum xs) / fromIntegral (length xs)
`,
        [
          ["average [1, 2]", "1.5"],
          ["average [5]", "5.0"],
          ["average [1, 2, 3, 4]", "2.5"],
          ["average [-2, 2]", "0.0"],
        ],
        "`sum xs` and `length xs` are both Ints. Wrap each in `fromIntegral` before dividing with `/`.",
      ),
      p("compare 3 5", "LT", "3 is less than 5, so `compare` gives `LT`.", "`compare` gives `LT` (less than), `EQ` (equal) or `GT` (greater than)."),
      q(
        "Which constraints does `bigSum x y = x + y > 10` need?",
        ["`(Num a, Ord a)`", "Only `Num a`", "Only `Eq a`", "`(Show a, Read a)`"],
        0,
        "`+` needs `Num` and `>` needs `Ord`. Both are used, so both are needed.",
      ),
      w(
        "Write `isMember`, which checks whether a value is in a list. It should work for any type in `Eq`. Don't use `elem`.",
        hs`isMember :: Eq a => a -> [a] -> Bool
isMember y xs = undefined
`,
        hs`isMember :: Eq a => a -> [a] -> Bool
isMember _ [] = False
isMember y (x : xs) = y == x || isMember y xs
`,
        [
          ["isMember 3 [1, 2, 3]", "True"],
          ['isMember \'z\' "abc"', "False"],
          ["isMember 1 []", "False"],
          ['isMember "b" ["a", "b"]', "True"],
        ],
        "Empty list: False. Otherwise, is it the first element, or is it somewhere in the rest?",
        { banned: ["elem", "notElem"] },
      ),
      p(hs`max "apple" "banana"`, '"banana"', "Strings are ordered like a dictionary. `'b'` comes after `'a'`, so `\"banana\"` is bigger."),
      q(
        "Which of these is NOT in `Eq`?",
        ["`Int`", "`Char`", "`Bool`", "Functions, like `Int -> Int`"],
        3,
        "Haskell can't check whether two functions are equal, so functions aren't in `Eq` (or `Show`).",
      ),
      p("[1, 2, 3] < [1, 3]", "True", "Lists are compared element by element. The first elements are equal; then 2 < 3, so it's True. Length doesn't matter here."),
      w(
        md(
          "The setup gives a type of colours with `deriving (Eq, Show)`. Write `next`, which moves to the next colour: Red to Green, Green to Blue, and Blue back to Red.",
        ),
        hs`next :: Colour -> Colour
next c = undefined
`,
        hs`next :: Colour -> Colour
next Red = Green
next Green = Blue
next Blue = Red
`,
        [
          ["next Red", "Green"],
          ["next Green", "Blue"],
          ["next Blue", "Red"],
          ["next (next Red)", "Blue"],
        ],
        "One equation for each colour, matching on the value: `next Red = Green`.",
        { setup: hs`data Colour = Red | Green | Blue deriving (Eq, Show)
` },
      ),
      w(
        "Write `largest`, which gives the biggest element of a non-empty list of anything in `Ord`. Don't use `maximum`.",
        hs`largest :: Ord a => [a] -> a
largest [x] = undefined
largest (x : xs) = undefined
`,
        hs`largest :: Ord a => [a] -> a
largest [x] = x
largest (x : xs) = max x (largest xs)
`,
        [
          ["largest [3, 9, 2]", "9"],
          ['largest "hello"', "'o'"],
          ["largest [-5, -2, -9]", "-2"],
          ["largest [7]", "7"],
        ],
        "A one-element list's largest is that element. Otherwise take the `max` of the first and the largest of the rest.",
        { banned: ["maximum"] },
      ),
      w(
        md(
          "Exam-style. Write `percentage`, which takes a part and a total and gives the part as a percentage.",
          "",
          "For example `percentage 1 4` is `25.0`.",
        ),
        hs`percentage :: Int -> Int -> Double
percentage part total = undefined
`,
        hs`percentage :: Int -> Int -> Double
percentage part total = 100 * fromIntegral part / fromIntegral total
`,
        [
          ["percentage 1 4", "25.0"],
          ["percentage 0 5", "0.0"],
          ["percentage 3 3", "100.0"],
          ["percentage 1 8", "12.5"],
        ],
        "Convert both Ints with `fromIntegral`, then `100 * part / total`.",
      ),
      w(
        md(
          "Exam-style. Write `allEqual`, which says whether every element of a list is the same. An empty list counts as all equal.",
        ),
        hs`allEqual :: Eq a => [a] -> Bool
allEqual xs = undefined
`,
        hs`allEqual :: Eq a => [a] -> Bool
allEqual (x : y : rest) = x == y && allEqual (y : rest)
allEqual _ = True
`,
        [
          ["allEqual ([] :: [Int])", "True"],
          ["allEqual [1, 1, 1]", "True"],
          ["allEqual [1, 2, 1]", "False"],
          ['allEqual "aaa"', "True"],
          ["allEqual [5]", "True"],
        ],
        "Compare the first two, then check the list from the second element on. Lists shorter than two are all equal.",
      ),
    ],
  },

  // ───────────────────────────── higher ─────────────────────────────
  {
    id: "drill-higher",
    lesson: "higher",
    title: "Practice: Functions that take functions",
    drills: [
      q(
        "What's the difference between `map` and `filter`?",
        [
          "`map` changes every element; `filter` keeps some elements and leaves them unchanged",
          "They do the same thing",
          "`map` removes elements; `filter` changes them",
          "`filter` only works on numbers",
        ],
        0,
        "`map f` gives a list the same length with `f` used on each element. `filter p` gives the elements that pass the test `p`.",
      ),
      p("map (*3) [1, 2, 3]", "[3,6,9]", "Each element is multiplied by 3."),
      p("filter odd [1 .. 10]", "[1,3,5,7,9]", "`odd` is True for 1, 3, 5, 7 and 9, so those are kept."),
      q(
        "What is `(-1)` in Haskell?",
        ["The number minus one, not a function", "A function that subtracts 1", "An error", "A function that negates"],
        0,
        "Minus is special: `(-1)` is just the number -1. To subtract 1 from each element use `subtract 1` or `\\x -> x - 1`.",
      ),
      w(
        "Write `squares`, which squares every number in a list. Use `map`.",
        hs`squares :: [Int] -> [Int]
squares xs = undefined
`,
        hs`squares :: [Int] -> [Int]
squares xs = map (\x -> x * x) xs
`,
        [
          ["squares [1, 2, 3]", "[1,4,9]"],
          ["squares []", "[]"],
          ["squares [-2]", "[4]"],
          ["squares [0, 10]", "[0,100]"],
        ],
        "A lambda that squares: `\\x -> x * x`. Give it to `map`.",
      ),
      p(hs`map (\x -> x * x) [1, 2, 3]`, "[1,4,9]", "The lambda squares each element."),
      q(
        "Which keeps only the numbers less than 3?",
        ["`filter (< 3)`", "`filter (3 <)`", "`map (< 3)`", "`filter < 3`"],
        0,
        "`(< 3)` means \"is it less than 3?\". `(3 <)` fills in the left side instead, so it means \"is 3 less than it?\", the opposite.",
      ),
      p("map (2 ^) [1, 2, 3]", "[2,4,8]", "`(2 ^)` puts the element on the right: 2^1, 2^2, 2^3.", "`^` means \"to the power of\"."),
      p("map (^ 2) [1, 2, 3]", "[1,4,9]", "`(^ 2)` puts the element on the left: 1^2, 2^2, 3^2. Which side is filled in matters."),
      w(
        md(
          "Write `shout`, which turns a String into capitals. `toUpper` (already imported for you) turns one Char into a capital.",
        ),
        hs`import Data.Char (toUpper)

shout :: String -> String
shout s = undefined
`,
        hs`import Data.Char (toUpper)

shout :: String -> String
shout s = map toUpper s
`,
        [
          ['shout "hello"', '"HELLO"'],
          ['shout ""', '""'],
          ['shout "Hi 5!"', '"HI 5!"'],
          ['shout "ABC"', '"ABC"'],
        ],
        "A String is a list of Chars, so `map toUpper` works on it.",
      ),
      q(
        "In `(length . filter even) [1, 2, 3, 4]`, what happens first?",
        ["`filter even`, then `length`", "`length`, then `filter even`", "Both at once", "It's an error"],
        0,
        "`(f . g) x` is `f (g x)`: the right-hand function runs first. So it filters, then counts: 2.",
      ),
      p(hs`filter (/= 'a') "banana"`, '"bnn"', "Every character that isn't `'a'` is kept."),
      w(
        "Write `removeSpaces`, which removes every space from a String. Use `filter`.",
        hs`removeSpaces :: String -> String
removeSpaces s = undefined
`,
        hs`removeSpaces :: String -> String
removeSpaces s = filter (/= ' ') s
`,
        [
          ['removeSpaces "a b c"', '"abc"'],
          ['removeSpaces ""', '""'],
          ['removeSpaces "   "', '""'],
          ['removeSpaces "nospace"', '"nospace"'],
        ],
        "Keep the characters that are not a space: `(/= ' ')`.",
      ),
      q(
        "What is the type of `map`?",
        ["`(a -> b) -> [a] -> [b]`", "`a -> b -> [a] -> [b]`", "`[a] -> [b]`", "`(a -> Bool) -> [a] -> [a]`"],
        0,
        "A function from `a` to `b`, then a list of `a`s, giving a list of `b`s. The last option is the type of `filter`.",
      ),
      p(
        "zipWith (+) [1, 2, 3] [10, 20, 30]",
        "[11,22,33]",
        "The elements in the same position are added: 1 + 10, 2 + 20, 3 + 30.",
        "`zipWith` is like `zip`, but combines each pair with a function instead of making a tuple.",
      ),
      q(
        "Why is `map (+1) 5` an error?",
        ["`map` needs a list as its second input, and 5 is a number", "`(+1)` isn't a function", "You need `filter` instead", "`map` only works on Strings"],
        0,
        "`map :: (a -> b) -> [a] -> [b]`. The second input must be a list. To add 1 to 5, just write `(+1) 5`.",
      ),
      w(
        "Write `countLong`, which counts how many words in a list have more than 3 letters. Use `filter` and `length`.",
        hs`countLong :: [String] -> Int
countLong ws = undefined
`,
        hs`countLong :: [String] -> Int
countLong ws = length (filter (\w -> length w > 3) ws)
`,
        [
          ['countLong ["hi", "hello", "tree", "a"]', "2"],
          ["countLong []", "0"],
          ['countLong ["abc"]', "0"],
          ['countLong ["abcd"]', "1"],
        ],
        "The test is a lambda: `\\w -> length w > 3`. Filter with it, then count.",
      ),
      w(
        md(
          "Exam-style. A table is a list of (key, value) pairs, and keys can repeat. Write `lookupAll`, which gives every value stored under a key, in order.",
        ),
        hs`lookupAll :: Int -> [(Int, String)] -> [String]
lookupAll k table = undefined
`,
        hs`lookupAll :: Int -> [(Int, String)] -> [String]
lookupAll k table = map snd (filter (\(k', _) -> k' == k) table)
`,
        [
          ['lookupAll 1 [(1, "a"), (2, "b"), (1, "c")]', '["a","c"]'],
          ['lookupAll 3 [(1, "a"), (2, "b")]', "[]"],
          ["lookupAll 1 []", "[]"],
          ['lookupAll 2 [(2, "x")]', '["x"]'],
        ],
        "First `filter` the pairs whose key matches, then `map snd` to keep just the values.",
      ),
      w(
        "Exam-style. Write `sumOddSquares`, which adds up the squares of the odd numbers in a list.",
        hs`sumOddSquares :: [Int] -> Int
sumOddSquares xs = undefined
`,
        hs`sumOddSquares :: [Int] -> Int
sumOddSquares xs = sum (map (^ 2) (filter odd xs))
`,
        [
          ["sumOddSquares [1, 2, 3]", "10"],
          ["sumOddSquares []", "0"],
          ["sumOddSquares [2, 4]", "0"],
          ["sumOddSquares [-3]", "9"],
        ],
        "Three steps, inside out: `filter odd`, then `map (^ 2)`, then `sum`.",
      ),
      w(
        md(
          "Exam-style. Write `capitalise`, which gives each word in a list a capital first letter. Empty words stay empty.",
          "",
          "A helper function for one word may help.",
        ),
        hs`import Data.Char (toUpper)

capitalise :: [String] -> [String]
capitalise ws = undefined
`,
        hs`import Data.Char (toUpper)

capWord :: String -> String
capWord [] = []
capWord (c : cs) = toUpper c : cs

capitalise :: [String] -> [String]
capitalise ws = map capWord ws
`,
        [
          ['capitalise ["hello", "world"]', '["Hello","World"]'],
          ["capitalise []", "[]"],
          ['capitalise ["", "a"]', '["","A"]'],
          ['capitalise ["hASKELL"]', '["HASKELL"]'],
        ],
        "Write `capWord` with two patterns (`[]` and `(c : cs)`), then `map` it over the list.",
      ),
    ],
  },
  // ───────────────────────────── maybe ─────────────────────────────
  {
    id: "drill-maybe",
    lesson: "maybe",
    title: "Practice: Maybe",
    drills: [
      q(
        'What does `lookup 3 [(1, "a"), (2, "b")]` give?',
        ["`Nothing`", '`""`', "An error", '`Just ""`'],
        0,
        "There's no pair with key 3, so there's no answer. `lookup` says so with `Nothing` instead of crashing.",
      ),
      p(hs`lookup 'b' (zip "abc" [1 ..])`, "Just 2", "`zip` makes `[('a',1),('b',2),('c',3)]`. The key `'b'` is paired with 2."),
      q(
        "Why is `Just 5 + 1` an error?",
        ["`Just 5` is a `Maybe Int`, not an `Int`, so `+` can't use it", "`+` doesn't work on 5", "`Just` must be written in lower case", "It isn't; it gives `Just 6`"],
        0,
        "A Maybe is a box that might be empty. Take the value out first (with a pattern or `maybe`) before doing maths with it.",
      ),
      p("maybe 0 (*2) (Just 5)", "10", "There's a value, 5, so the function `(*2)` is used on it."),
      p("maybe 0 (*2) Nothing", "0", "There's no value, so you get the default, 0."),
      w(
        "Write `safeHead`, which gives `Just` the first element, or `Nothing` for an empty list.",
        hs`safeHead :: [a] -> Maybe a
safeHead xs = undefined
`,
        hs`safeHead :: [a] -> Maybe a
safeHead [] = Nothing
safeHead (x : _) = Just x
`,
        [
          ["safeHead [1, 2]", "Just 1"],
          ["safeHead ([] :: [Int])", "Nothing"],
          ['safeHead "x"', "Just 'x'"],
          ["safeHead [[1]]", "Just [1]"],
        ],
        "Two equations: `[]` gives `Nothing`, `(x : _)` gives `Just x`.",
      ),
      q(
        "A function might not find an Int. What should its result type be?",
        ["`Int`", "`Maybe Int`", "`[Int]` only", "`Int -> Bool`"],
        1,
        "`Maybe Int` says in the type that there might be no answer, so whoever uses it must handle `Nothing`.",
      ),
      p(
        hs`(readMaybe "12" :: Maybe Int)`,
        "Just 12",
        "The text is a valid number, so you get `Just` it.",
        "`readMaybe` (from Text.Read) tries to read text as a value, giving `Nothing` if it can't. Unlike `read`, it never crashes.",
      ),
      p(hs`(readMaybe "twelve" :: Maybe Int)`, "Nothing", "\"twelve\" isn't digits, so it can't be read as an Int."),
      w(
        md(
          "Write `showScore`, which describes a score that might be missing:",
          "",
          "`Nothing` gives `\"No score yet\"`",
          "`Just 7` gives `\"Score: 7\"`",
        ),
        hs`showScore :: Maybe Int -> String
showScore m = undefined
`,
        hs`showScore :: Maybe Int -> String
showScore Nothing = "No score yet"
showScore (Just n) = "Score: " ++ show n
`,
        [
          ["showScore Nothing", '"No score yet"'],
          ["showScore (Just 7)", '"Score: 7"'],
          ["showScore (Just 0)", '"Score: 0"'],
          ["showScore (Just (-2))", '"Score: -2"'],
        ],
        "Pattern match on `Nothing` and `(Just n)`. Use `show n` to turn the number into text.",
      ),
      q(
        md("Given this function, what happens for `f Nothing`?", "`f :: Maybe Int -> Int`", "`f (Just n) = n`"),
        ["It gives 0", "It crashes: no equation matches `Nothing`", "It gives `Nothing`", "It gives -1"],
        1,
        "There's no equation for `Nothing`, so the program stops with a \"Non-exhaustive patterns\" error. Always handle both cases.",
      ),
      p(
        "fromMaybe 0 (Just 3)",
        "3",
        "There is a value, so the default isn't needed.",
        "`fromMaybe` (from Data.Maybe) takes a default and a Maybe. It gives the value inside a `Just`, or the default for `Nothing`.",
      ),
      w(
        "Write `firstEven`, which gives `Just` the first even number in a list, or `Nothing` if there isn't one.",
        hs`firstEven :: [Int] -> Maybe Int
firstEven xs = undefined
`,
        hs`firstEven :: [Int] -> Maybe Int
firstEven [] = Nothing
firstEven (x : xs)
  | even x = Just x
  | otherwise = firstEven xs
`,
        [
          ["firstEven [1, 3, 4, 6]", "Just 4"],
          ["firstEven []", "Nothing"],
          ["firstEven [1, 3]", "Nothing"],
          ["firstEven [2]", "Just 2"],
          ["firstEven [-2]", "Just (-2)"],
        ],
        "Recursion: empty list gives `Nothing`. If `x` is even, you're done; otherwise look in the rest.",
      ),
      q(
        "If 3 is an Int, what is the type of `Just (Just 3)`?",
        ["`Maybe Int`", "`Maybe (Maybe Int)`", "`Just Int`", "`Int`"],
        1,
        "Each `Just` wraps one more Maybe around the type.",
      ),
      w(
        "Write `addMaybes`, which adds two numbers that might be missing. If either is `Nothing`, the answer is `Nothing`.",
        hs`addMaybes :: Maybe Int -> Maybe Int -> Maybe Int
addMaybes a b = undefined
`,
        hs`addMaybes :: Maybe Int -> Maybe Int -> Maybe Int
addMaybes (Just x) (Just y) = Just (x + y)
addMaybes _ _ = Nothing
`,
        [
          ["addMaybes (Just 2) (Just 3)", "Just 5"],
          ["addMaybes Nothing (Just 1)", "Nothing"],
          ["addMaybes (Just 1) Nothing", "Nothing"],
          ["addMaybes Nothing Nothing", "Nothing"],
        ],
        "One equation for two `Just`s, and one catch-all `_ _` for everything else.",
      ),
      w(
        md(
          "Exam-style. A price list is a list of (item, price) pairs. Write `priceOf`, which gives an item's price, or 0 if it isn't listed.",
        ),
        hs`priceOf :: String -> [(String, Int)] -> Int
priceOf item prices = undefined
`,
        hs`priceOf :: String -> [(String, Int)] -> Int
priceOf item prices = maybe 0 id (lookup item prices)
`,
        [
          ['priceOf "tea" [("tea", 2), ("cake", 3)]', "2"],
          ['priceOf "cake" [("tea", 2), ("cake", 3)]', "3"],
          ['priceOf "pie" [("tea", 2)]', "0"],
          ['priceOf "tea" []', "0"],
        ],
        "`lookup` gives a `Maybe Int`. Turn it into an Int with `maybe 0 id`, or pattern match on the result in a helper.",
      ),
      w(
        md(
          "Exam-style. Write `position`, which gives the index (counting from 0) of the first time a character appears in a String, or `Nothing`.",
          "",
          "For example `position 'c' \"abc\"` is `Just 2`.",
        ),
        hs`position :: Char -> String -> Maybe Int
position c s = undefined
`,
        hs`position :: Char -> String -> Maybe Int
position _ [] = Nothing
position c (x : xs)
  | c == x = Just 0
  | otherwise = maybe Nothing (\i -> Just (i + 1)) (position c xs)
`,
        [
          ['position \'c\' "abc"', "Just 2"],
          ['position \'a\' "abc"', "Just 0"],
          ['position \'z\' "abc"', "Nothing"],
          ['position \'a\' ""', "Nothing"],
          ['position \'b\' "abba"', "Just 1"],
        ],
        "If it's the first character, the answer is `Just 0`. Otherwise find it in the rest and add 1 to the index, if there was one: `maybe Nothing (\\i -> Just (i + 1)) ...`.",
      ),
      w(
        md(
          "Exam-style. Write `totalCost`, which adds up the prices of a shopping list. If any item isn't in the price list, the answer is `Nothing`.",
          "",
          "An empty shopping list costs `Just 0`.",
        ),
        hs`totalCost :: [String] -> [(String, Int)] -> Maybe Int
totalCost items prices = undefined
`,
        hs`plus :: Maybe Int -> Maybe Int -> Maybe Int
plus (Just x) (Just y) = Just (x + y)
plus _ _ = Nothing

totalCost :: [String] -> [(String, Int)] -> Maybe Int
totalCost [] _ = Just 0
totalCost (item : items) prices = plus (lookup item prices) (totalCost items prices)
`,
        [
          ['totalCost ["tea", "milk"] [("tea", 2), ("milk", 1), ("cake", 3)]', "Just 3"],
          ['totalCost [] [("tea", 2)]', "Just 0"],
          ['totalCost ["tea", "pie"] [("tea", 2)]', "Nothing"],
          ['totalCost ["cake", "cake"] [("cake", 3)]', "Just 6"],
        ],
        "Recurse over the shopping list. Combine `lookup item prices` with the total for the rest using a helper like `addMaybes`.",
      ),
      w(
        "Exam-style. Write `justs`, which keeps the values inside the `Just`s and drops the `Nothing`s.",
        hs`justs :: [Maybe Int] -> [Int]
justs xs = undefined
`,
        hs`justs :: [Maybe Int] -> [Int]
justs [] = []
justs (Just x : rest) = x : justs rest
justs (Nothing : rest) = justs rest
`,
        [
          ["justs [Just 1, Nothing, Just 3]", "[1,3]"],
          ["justs []", "[]"],
          ["justs [Nothing]", "[]"],
          ["justs [Just 0]", "[0]"],
        ],
        "Patterns can look inside the first element: `(Just x : rest)` and `(Nothing : rest)`.",
        { banned: ["catMaybes", "mapMaybe"] },
      ),
    ],
  },

  // ───────────────────────────── folding ─────────────────────────────
  {
    id: "drill-folding",
    lesson: "folding",
    title: "Practice: Folding",
    drills: [
      q(
        "In `foldr (+) 0 [1, 2, 3]`, what is the `0` for?",
        ["It's the answer for the empty list, where the fold stops", "It's added to every element", "It's the first element", "It says to start at position 0"],
        0,
        "`foldr` replaces the `[]` at the end of the list with the starting value: `1 + (2 + (3 + 0))`.",
      ),
      p("foldr (+) 0 [4, 5, 6]", "15", "`4 + (5 + (6 + 0))` is 15."),
      q(
        "What starting value should a fold that multiplies everything use?",
        ["`0`", "`1`", "`[]`", "It doesn't matter"],
        1,
        "Anything times 0 is 0, so starting at 0 would always give 0. 1 changes nothing when you multiply by it.",
      ),
      p("foldr (-) 0 [1, 2, 3]", "2", "`1 - (2 - (3 - 0))` is `1 - (2 - 3)`, which is `1 - (-1)`, which is 2."),
      p("foldl (-) 0 [1, 2, 3]", "-6", "From the left: `((0 - 1) - 2) - 3` is -6. With `-`, the direction changes the answer."),
      w(
        "Write `total`, which adds up a list using `foldr`. Don't use `sum`.",
        hs`total :: [Int] -> Int
total xs = foldr undefined undefined xs
`,
        hs`total :: [Int] -> Int
total xs = foldr (+) 0 xs
`,
        [
          ["total [1, 2, 3]", "6"],
          ["total []", "0"],
          ["total [-5, 5]", "0"],
          ["total [10]", "10"],
        ],
        "Combine with `(+)`; the empty list's total is 0.",
        { banned: ["sum"] },
      ),
      q(
        "What is `foldr (:) [] [1, 2, 3]`?",
        ["`[3,2,1]`", "`[1,2,3]`", "`6`", "`[]`"],
        1,
        "`foldr` replaces each `:` with `(:)` and `[]` with `[]`, so you rebuild the same list.",
      ),
      p(hs`foldr (\x acc -> acc + 1) 0 "hello"`, "5", "Every element adds 1 to the answer for the rest, so this counts the elements."),
      q(
        "In `foldr (\\x acc -> ...)`, what is `acc`?",
        ["The answer for the rest of the list", "The first element", "The whole list", "A counter that starts at 1"],
        0,
        "`x` is the current element and `acc` is what the fold already worked out for everything after it.",
      ),
      w(
        "Write `count`, which gives the length of a list using `foldr`. Don't use `length`.",
        hs`count :: [a] -> Int
count xs = foldr undefined undefined xs
`,
        hs`count :: [a] -> Int
count xs = foldr (\_ acc -> acc + 1) 0 xs
`,
        [
          ['count "abc"', "3"],
          ["count ([] :: [Int])", "0"],
          ["count [True]", "1"],
          ["count [[1, 2], [3]]", "2"],
        ],
        "The element doesn't matter, only that it's there: `\\_ acc -> acc + 1`, starting from 0.",
        { banned: ["length"] },
      ),
      p(hs`foldl (\acc x -> x : acc) [] [1, 2, 3]`, "[3,2,1]", "Each element is put on the front of the list built so far, so the list comes out reversed."),
      q(
        "With `foldl`, which way round are the lambda's inputs?",
        ["`\\acc x -> ...` (the running total first)", "`\\x acc -> ...` (the element first)", "It doesn't matter", "`foldl` can't take a lambda"],
        0,
        "`foldl` carries the total from the left, so the total comes first. `foldr` is the other way round: element first, then `acc`.",
      ),
      p("and [True, False, True]", "False", "One element is False, so not all of them are True.", "`and` checks whether every Bool in a list is True."),
      w(
        "Write `allTrue`, which is `True` when every Bool in a list is True, using `foldr`. Don't use `and` or `all`.",
        hs`allTrue :: [Bool] -> Bool
allTrue bs = foldr undefined undefined bs
`,
        hs`allTrue :: [Bool] -> Bool
allTrue bs = foldr (&&) True bs
`,
        [
          ["allTrue []", "True"],
          ["allTrue [True, True]", "True"],
          ["allTrue [True, False]", "False"],
          ["allTrue [False]", "False"],
        ],
        "Combine with `(&&)`. An empty list has nothing False in it, so start from `True`.",
        { banned: ["and", "all"] },
      ),
      p("foldr max 0 [3, 9, 2]", "9", "`max 3 (max 9 (max 2 0))` is 9."),
      w(
        "Write `joinAll`, which joins a list of lists into one list, using `foldr`. Don't use `concat`.",
        hs`joinAll :: [[a]] -> [a]
joinAll xss = foldr undefined undefined xss
`,
        hs`joinAll :: [[a]] -> [a]
joinAll xss = foldr (++) [] xss
`,
        [
          ["joinAll [[1], [2, 3]]", "[1,2,3]"],
          ['joinAll ["ab", "", "c"]', '"abc"'],
          ["joinAll ([] :: [[Int]])", "[]"],
          ["joinAll ([[], []] :: [[Int]])", "[]"],
        ],
        "Combine with `(++)`, starting from the empty list.",
        { banned: ["concat", "concatMap"] },
      ),
      w(
        md(
          "Exam-style. Write `digitsToNumber`, which turns a list of digits into the number they spell, using `foldl`.",
          "",
          "For example `digitsToNumber [1, 2, 3]` is 123.",
        ),
        hs`digitsToNumber :: [Int] -> Int
digitsToNumber ds = undefined
`,
        hs`digitsToNumber :: [Int] -> Int
digitsToNumber ds = foldl (\acc d -> acc * 10 + d) 0 ds
`,
        [
          ["digitsToNumber [1, 2, 3]", "123"],
          ["digitsToNumber []", "0"],
          ["digitsToNumber [0, 7]", "7"],
          ["digitsToNumber [9]", "9"],
        ],
        "Going left to right, each new digit shifts the total one place: `acc * 10 + d`.",
      ),
      w(
        "Exam-style. Write `backwards`, which reverses a list using `foldl`. Don't use `reverse`.",
        hs`backwards :: [a] -> [a]
backwards xs = undefined
`,
        hs`backwards :: [a] -> [a]
backwards xs = foldl (\acc x -> x : acc) [] xs
`,
        [
          ["backwards [1, 2, 3]", "[3,2,1]"],
          ['backwards "abc"', '"cba"'],
          ["backwards ([] :: [Int])", "[]"],
          ["backwards [4]", "[4]"],
        ],
        "Start from `[]` and put each element on the front of the total: `\\acc x -> x : acc`.",
        { banned: ["reverse"] },
      ),
      w(
        md(
          "Exam-style. An order is a list of (item, quantity, unit price) triples. Write `orderTotal`, which gives the total cost, using `foldr`.",
        ),
        hs`orderTotal :: [(String, Int, Int)] -> Int
orderTotal order = undefined
`,
        hs`orderTotal :: [(String, Int, Int)] -> Int
orderTotal order = foldr (\(_, qty, price) acc -> qty * price + acc) 0 order
`,
        [
          ['orderTotal [("pen", 2, 3), ("book", 1, 10)]', "16"],
          ["orderTotal []", "0"],
          ['orderTotal [("x", 0, 99)]', "0"],
          ['orderTotal [("a", 3, 3)]', "9"],
        ],
        "A lambda can take a triple apart: `\\(_, qty, price) acc -> ...`.",
      ),
      w(
        md(
          "Exam-style. Write `countIf`, which counts how many elements pass a test, using `foldr`. Don't use `filter` or `length`.",
          "",
          "For example `countIf even [1 .. 10]` is 5.",
        ),
        hs`countIf :: (a -> Bool) -> [a] -> Int
countIf p xs = undefined
`,
        hs`countIf :: (a -> Bool) -> [a] -> Int
countIf p xs = foldr (\x acc -> if p x then acc + 1 else acc) 0 xs
`,
        [
          ["countIf even [1 .. 10]", "5"],
          ["countIf (> 'm') \"hello\"", "1"],
          ["countIf even ([] :: [Int])", "0"],
          ["countIf odd [1, 3]", "2"],
        ],
        "In the lambda, add 1 only when `p x` is True.",
        { banned: ["filter", "length"] },
      ),
    ],
  },

  // ───────────────────────────── io ─────────────────────────────
  {
    id: "drill-io",
    lesson: "io",
    title: "Practice: IO",
    drills: [
      q(
        "What is the type of `putStrLn`?",
        ["`String -> IO ()`", "`String -> String`", "`IO String`", "`String`"],
        0,
        "It takes a String and gives an action that prints it. `()` means the action produces no useful result.",
      ),
      p(hs`show 5 ++ "!"`, '"5!"', "`show 5` is `\"5\"`. Joined with `\"!\"`, that's `\"5!\"`."),
      q(
        'What\'s the difference between `print "hi"` and `putStrLn "hi"`?',
        [
          "`print` uses `show`, so it prints the quote marks; `putStrLn` prints the text as it is",
          "There's no difference",
          "`putStrLn` adds quote marks",
          "`print` only works on numbers",
        ],
        0,
        "`print x` is `putStrLn (show x)`. `show` of a String adds quotes, so `print \"hi\"` shows `\"hi\"`.",
      ),
      p(
        hs`unwords ["hello", "there"]`,
        '"hello there"',
        "The words are joined with one space between each.",
        "`unwords` joins a list of words into one String with spaces.",
      ),
      q(
        'Why is `putStrLn ("Score: " ++ 5)` an error?',
        ["5 is a number and `++` joins Strings: write `show 5`", "You must use `print` instead of `putStrLn`", "It needs a `do`", "Brackets aren't allowed"],
        0,
        "`++` needs a String on both sides. `\"Score: \" ++ show 5` works.",
      ),
      w(
        md(
          "A program asks for your name with `getLine`, then prints a greeting. Write the pure part: `greet`, which turns a name into the greeting.",
          "",
          "For example `greet \"Sid\"` is `\"Hello, Sid!\"`.",
        ),
        hs`greet :: String -> String
greet name = undefined
`,
        hs`greet :: String -> String
greet name = "Hello, " ++ name ++ "!"
`,
        [
          ['greet "Sid"', '"Hello, Sid!"'],
          ['greet ""', '"Hello, !"'],
          ['greet "Ada Lovelace"', '"Hello, Ada Lovelace!"'],
          ['greet "x"', '"Hello, x!"'],
        ],
        "Join three pieces with `++`: the start, the name and the `\"!\"`.",
      ),
      p(
        hs`words "  roses are   red "`,
        hs`["roses","are","red"]`,
        "Extra spaces are ignored; you just get the words.",
        "`words` splits a String into words wherever there are spaces.",
      ),
      q(
        "Inside a `do` block you write `name <- getLine`. What is the type of `name`?",
        ["`IO String`", "`String`", "`IO ()`", "`Char`"],
        1,
        "`getLine` is an `IO String`. `<-` runs it and gives the plain String it produced the name `name`.",
      ),
      p(
        hs`lines "one\ntwo"`,
        hs`["one","two"]`,
        "The text is cut at the newline.",
        "`\\n` inside a String is a newline character. `lines` splits text into lines.",
      ),
      w(
        md(
          "Write `formatScore`, which makes a line for a scoreboard from a name and a score.",
          "",
          "For example `formatScore \"Alice\" 10` is `\"Alice: 10\"`.",
        ),
        hs`formatScore :: String -> Int -> String
formatScore name score = undefined
`,
        hs`formatScore :: String -> Int -> String
formatScore name score = name ++ ": " ++ show score
`,
        [
          ['formatScore "Alice" 10', '"Alice: 10"'],
          ['formatScore "Bob" 0', '"Bob: 0"'],
          ['formatScore "Eve" (-3)', '"Eve: -3"'],
          ['formatScore "" 7', '": 7"'],
        ],
        "The score is a number, so turn it into text with `show` before using `++`.",
      ),
      q(
        "You have a pure function `shout :: String -> String` and want to shout what the user types. Which works?",
        [
          "In a `do` block: `s <- getLine`, then `putStrLn (shout s)`",
          "`putStrLn (shout getLine)`",
          "`shout <- getLine`",
          "`shout (putStrLn getLine)`",
        ],
        0,
        "`getLine` is an `IO String`, not a String, so `shout` can't use it directly. Run it with `<-` first, then pass the plain String on.",
      ),
      p(
        hs`read "7" * 2 :: Int`,
        "14",
        "`read \"7\"` as an Int is 7, and `7 * 2` is 14.",
        "`read` turns text into a value; `:: Int` at the end says which type you want.",
      ),
      w(
        md(
          "A program reads an age typed by the user. Write `parseAge`, which gives `Just` the age if the text is a whole number that is 0 or more, and `Nothing` otherwise.",
          "",
          "`readMaybe` is imported for you: `readMaybe \"21\" :: Maybe Int` is `Just 21`, and it gives `Nothing` for text that isn't a number.",
        ),
        hs`import Text.Read (readMaybe)

parseAge :: String -> Maybe Int
parseAge s = undefined
`,
        hs`import Text.Read (readMaybe)

checkAge :: Int -> Maybe Int
checkAge n = if n >= 0 then Just n else Nothing

parseAge :: String -> Maybe Int
parseAge s = maybe Nothing checkAge (readMaybe s)
`,
        [
          ['parseAge "21"', "Just 21"],
          ['parseAge "abc"', "Nothing"],
          ['parseAge "-5"', "Nothing"],
          ['parseAge ""', "Nothing"],
          ['parseAge "0"', "Just 0"],
        ],
        "First `readMaybe s`. If that gives `Just n`, check that `n >= 0`. A helper function and `maybe` (or pattern matching in a helper) will do it.",
      ),
      q(
        "What is the usual type of `main`?",
        ["`IO ()`", "`String`", "`()`", "`IO String`"],
        0,
        "`main` is the action the program runs. It does things but doesn't produce a useful result, so it's `IO ()`.",
      ),
      p(hs`unlines ["x", "y"]`, hs`"x\ny\n"`, "`unlines` joins lines, putting a newline (`\\n`) after each one, including the last."),
      w(
        md(
          "Write `showRow`, which turns a list of numbers into one line of text with spaces between them, ready for `putStrLn`.",
          "",
          "For example `showRow [1, 2, 3]` is `\"1 2 3\"`.",
        ),
        hs`showRow :: [Int] -> String
showRow ns = undefined
`,
        hs`showRow :: [Int] -> String
showRow ns = unwords (map show ns)
`,
        [
          ["showRow [1, 2, 3]", '"1 2 3"'],
          ["showRow []", '""'],
          ["showRow [-1, 10]", '"-1 10"'],
          ["showRow [0]", '"0"'],
        ],
        "`map show` turns each number into text, then `unwords` joins them with spaces.",
      ),
      w(
        md(
          "A program reads a line of numbers like `\"3 4 5\"`. Write `addAll`, which adds them up.",
          "",
          "Use `words` to split the text, `read` to turn each piece into an Int, and `sum`.",
        ),
        hs`addAll :: String -> Int
addAll line = undefined
`,
        hs`addAll :: String -> Int
addAll line = sum (map read (words line))
`,
        [
          ['addAll "3 4 5"', "12"],
          ['addAll ""', "0"],
          ['addAll " 10  -2 "', "8"],
          ['addAll "7"', "7"],
        ],
        "`words line` gives a list of Strings. `map read` turns them into numbers; the signature tells `read` they're Ints.",
      ),
      w(
        md(
          "Exam-style. Write `menu`, which turns a list of options into numbered lines, ready to print with `putStr`.",
          "",
          "For example `menu [\"tea\", \"milk\"]` is `\"1. tea\\n2. milk\\n\"`.",
        ),
        hs`menu :: [String] -> String
menu options = undefined
`,
        hs`menu :: [String] -> String
menu options = unlines (map (\(n, o) -> show n ++ ". " ++ o) (zip [1 :: Int ..] options))
`,
        [
          ['menu ["tea", "milk"]', hs`"1. tea\n2. milk\n"`],
          ["menu []", '""'],
          ['menu ["x"]', hs`"1. x\n"`],
          ['menu ["a", "b", "c"]', hs`"1. a\n2. b\n3. c\n"`],
        ],
        "`zip [1 ..]` numbers the options. Turn each pair into a line with `map`, then join them with `unlines`.",
      ),
      w(
        md(
          "Exam-style. A game reads commands with `getLine`. Write the pure function `respond`, which gives the reply to print:",
          "",
          "`\"hello\"` gives `\"Hi!\"`",
          "`\"quit\"` gives `\"Bye\"`",
          "`\"help\"` gives `\"Commands: hello, help, quit\"`",
          "anything else gives `\"Unknown command: \"` followed by the command",
        ),
        hs`respond :: String -> String
respond cmd = undefined
`,
        hs`respond :: String -> String
respond "hello" = "Hi!"
respond "quit" = "Bye"
respond "help" = "Commands: hello, help, quit"
respond cmd = "Unknown command: " ++ cmd
`,
        [
          ['respond "hello"', '"Hi!"'],
          ['respond "quit"', '"Bye"'],
          ['respond "help"', '"Commands: hello, help, quit"'],
          ['respond "jump"', '"Unknown command: jump"'],
          ['respond ""', '"Unknown command: "'],
        ],
        "You can pattern match on String values directly: `respond \"hello\" = ...`. Put the catch-all equation last.",
      ),
    ],
  },

  // ───────────────────────────── containers ─────────────────────────────
  {
    id: "drill-containers",
    lesson: "containers",
    title: "Practice: Functor, Applicative and Monad",
    drills: [
      q(
        "What is `fmap (+1) Nothing`?",
        ["`Nothing`", "`Just 1`", "`1`", "An error"],
        0,
        "There's nothing inside to change, so `fmap` keeps it as `Nothing`.",
      ),
      p("fmap (*2) (Just 5)", "Just 10", "`fmap` changes the value inside and keeps the `Just`."),
      q(
        "On a list, `fmap` does the same as...",
        ["`map`", "`filter`", "`foldr`", "`zip`"],
        0,
        "For lists, the container is the list, so changing what's inside is exactly `map`.",
      ),
      p("(+1) <$> [1, 2, 3]", "[2,3,4]", "`<$>` is `fmap` written between its inputs."),
      p("(+) <$> Just 1 <*> Just 2", "Just 3", "Both values are there, so they are added and the answer is wrapped in `Just`."),
      w(
        "Write `bump`, which adds 1 to the number inside a Maybe, if there is one. Use `fmap` or `<$>`.",
        hs`bump :: Maybe Int -> Maybe Int
bump m = undefined
`,
        hs`bump :: Maybe Int -> Maybe Int
bump m = fmap (+1) m
`,
        [
          ["bump (Just 1)", "Just 2"],
          ["bump Nothing", "Nothing"],
          ["bump (Just (-1))", "Just 0"],
          ["bump (Just 99)", "Just 100"],
        ],
        "`fmap (+1) m`. No pattern matching needed.",
      ),
      q(
        "What is `(+) <$> Just 3` on its own?",
        ["`Just 3`", "A function inside a `Just`, waiting for another number", "An error", "`Just (+)`"],
        1,
        "`fmap` uses `(+)` on 3 inside the box, giving `Just (3 +)`: a partly applied function. `<*>` then gives it the second number.",
      ),
      p(hs`Just 4 >>= \x -> if x > 3 then Just (x * 10) else Nothing`, "Just 40", "4 is passed to the next step. It's bigger than 3, so you get `Just 40`."),
      p(hs`Just 2 >>= \x -> if x > 3 then Just (x * 10) else Nothing`, "Nothing", "2 is not bigger than 3, so the step gives `Nothing`."),
      w(
        "Write `addM`, which adds two numbers that might be missing. Use `<$>` and `<*>`.",
        hs`addM :: Maybe Int -> Maybe Int -> Maybe Int
addM a b = undefined
`,
        hs`addM :: Maybe Int -> Maybe Int -> Maybe Int
addM a b = (+) <$> a <*> b
`,
        [
          ["addM (Just 2) (Just 3)", "Just 5"],
          ["addM Nothing (Just 1)", "Nothing"],
          ["addM (Just 1) Nothing", "Nothing"],
          ["addM (Just (-4)) (Just 4)", "Just 0"],
        ],
        "Same shape as the lesson: `(+) <$> a <*> b`.",
      ),
      q(
        "What does `>>=` do when the value on its left is `Nothing`?",
        ["Skips the next step and gives `Nothing`", "Passes 0 to the next step", "Crashes", "Gives `Just Nothing`"],
        0,
        "There's no value to pass on, so the chain stops and the answer is `Nothing`.",
      ),
      p("fmap length (Just [1, 2, 3])", "Just 3", "`length` is used on the list inside the `Just`."),
      w(
        md(
          "The setup gives `halve`, which halves even numbers and fails (`Nothing`) on odd ones. Write `quarter`, which halves twice, using `>>=`.",
          "",
          "For example `quarter 8` is `Just 2`, but `quarter 6` is `Nothing` because 3 is odd.",
        ),
        hs`quarter :: Int -> Maybe Int
quarter n = undefined
`,
        hs`quarter :: Int -> Maybe Int
quarter n = halve n >>= halve
`,
        [
          ["quarter 8", "Just 2"],
          ["quarter 6", "Nothing"],
          ["quarter 3", "Nothing"],
          ["quarter 0", "Just 0"],
          ["quarter (-4)", "Just (-1)"],
        ],
        "`halve n` gives a Maybe. `>>= halve` passes the value inside on to `halve` again.",
        { setup: hs`halve :: Int -> Maybe Int
halve n = if even n then Just (div n 2) else Nothing
` },
      ),
      q(
        "Which is the same as `fmap f x`?",
        ["`f <$> x`", "`f <*> x`", "`x >>= f`", "`f . x`"],
        0,
        "`<$>` is just `fmap` written between its inputs.",
      ),
      p(
        hs`[1, 2] >>= \x -> [x, x * 10]`,
        "[1,10,2,20]",
        "1 becomes `[1, 10]` and 2 becomes `[2, 20]`, then they're joined.",
        "For lists, `>>=` runs the next step on every element and joins all the results together.",
      ),
      w(
        md(
          "Exam-style. Write `lookupBoth`, which looks up two items in a price list and adds their prices. If either is missing, the answer is `Nothing`.",
        ),
        hs`lookupBoth :: String -> String -> [(String, Int)] -> Maybe Int
lookupBoth a b prices = undefined
`,
        hs`lookupBoth :: String -> String -> [(String, Int)] -> Maybe Int
lookupBoth a b prices = (+) <$> lookup a prices <*> lookup b prices
`,
        [
          ['lookupBoth "tea" "cake" [("tea", 2), ("cake", 3)]', "Just 5"],
          ['lookupBoth "tea" "pie" [("tea", 2), ("cake", 3)]', "Nothing"],
          ['lookupBoth "tea" "tea" [("tea", 2)]', "Just 4"],
          ['lookupBoth "a" "b" []', "Nothing"],
        ],
        "Each `lookup` gives a `Maybe Int`. Combine them like `addM`: `(+) <$> ... <*> ...`.",
      ),
      w(
        md(
          "Exam-style. The setup gives `safeDiv`, which fails on division by zero. Write `divTwice a b c`, which divides `a` by `b`, then divides the answer by `c`, failing if either division fails.",
        ),
        hs`divTwice :: Int -> Int -> Int -> Maybe Int
divTwice a b c = undefined
`,
        hs`divTwice :: Int -> Int -> Int -> Maybe Int
divTwice a b c = safeDiv a b >>= \r -> safeDiv r c
`,
        [
          ["divTwice 100 5 2", "Just 10"],
          ["divTwice 1 0 5", "Nothing"],
          ["divTwice 10 2 0", "Nothing"],
          ["divTwice 7 2 1", "Just 3"],
          ["divTwice 0 3 3", "Just 0"],
        ],
        "The second step needs the first answer: `safeDiv a b >>= \\r -> safeDiv r c`.",
        { setup: hs`safeDiv :: Int -> Int -> Maybe Int
safeDiv _ 0 = Nothing
safeDiv x y = Just (div x y)
` },
      ),
      w(
        md(
          "Exam-style. Write `parseAll`, which reads every String in a list as an Int. If any of them can't be read, the whole answer is `Nothing`.",
          "",
          "`readMaybe` is imported for you. Recurse, combining the first result and the rest with `<$>` and `<*>`.",
        ),
        hs`import Text.Read (readMaybe)

parseAll :: [String] -> Maybe [Int]
parseAll ss = undefined
`,
        hs`import Text.Read (readMaybe)

parseAll :: [String] -> Maybe [Int]
parseAll [] = Just []
parseAll (s : ss) = (:) <$> readMaybe s <*> parseAll ss
`,
        [
          ['parseAll ["1", "2"]', "Just [1,2]"],
          ["parseAll []", "Just []"],
          ['parseAll ["1", "x"]', "Nothing"],
          ['parseAll ["-4"]', "Just [-4]"],
        ],
        "Empty list: `Just []`. Otherwise put the first read value on the front of the rest: `(:) <$> readMaybe s <*> parseAll ss`.",
      ),
      w(
        md(
          "Exam-style. The setup gives `links`, a list of (from, to) pairs. Write `follow n start links`, which follows `n` links starting at `start`. If a link is missing on the way, the answer is `Nothing`.",
          "",
          "For example with the given links, `follow 2 1 links` goes 1 to 2 to 3, giving `Just 3`.",
        ),
        hs`follow :: Int -> Int -> [(Int, Int)] -> Maybe Int
follow n start ls = undefined
`,
        hs`follow :: Int -> Int -> [(Int, Int)] -> Maybe Int
follow 0 start _ = Just start
follow n start ls = lookup start ls >>= \nxt -> follow (n - 1) nxt ls
`,
        [
          ["follow 0 7 links", "Just 7"],
          ["follow 2 1 links", "Just 3"],
          ["follow 4 1 links", "Just 2"],
          ["follow 2 4 links", "Nothing"],
          ["follow 1 5 links", "Nothing"],
        ],
        "After 0 steps you're where you started. Otherwise `lookup` the next place and, with `>>=`, follow the remaining `n - 1` links from there.",
        { setup: hs`links :: [(Int, Int)]
links = [(1, 2), (2, 3), (3, 1), (4, 9)]
` },
      ),
    ],
  },

  // ───────────────────────────── laziness ─────────────────────────────
  {
    id: "drill-laziness",
    lesson: "laziness",
    title: "Practice: Laziness and infinite lists",
    drills: [
      q(
        "Why does `take 3 [1 ..]` finish?",
        ["Haskell only works out the 3 elements it needs", "The list secretly stops at 100", "`take` is a special keyword", "It doesn't finish"],
        0,
        "Laziness: the rest of the endless list is never worked out, because nothing asks for it.",
      ),
      p("take 4 (repeat 'z')", '"zzzz"', "`repeat 'z'` is `\"zzzz...\"` forever; take 4.", "`repeat x` is an endless list of `x`."),
      p(
        "take 4 (iterate (*2) 1)",
        "[1,2,4,8]",
        "Start at 1 and keep doubling: 1, 2, 4, 8, ...",
        "`iterate f x` gives `x`, then `f x`, then `f (f x)`, and so on forever.",
      ),
      q(
        "What does `const 1 undefined` give?",
        ["A crash", "`1`", "`undefined`", "`0`"],
        1,
        "`const` never looks at its second input, so `undefined` is never worked out.",
      ),
      p("fst (3, undefined)", "3", "`fst` only looks at the first part, so the `undefined` is never touched."),
      w(
        "Write `firstSquares`, which gives the first n square numbers (1, 4, 9, ...). Use an endless list and `take`.",
        hs`firstSquares :: Int -> [Int]
firstSquares n = undefined
`,
        hs`firstSquares :: Int -> [Int]
firstSquares n = take n (map (^ 2) [1 ..])
`,
        [
          ["firstSquares 3", "[1,4,9]"],
          ["firstSquares 0", "[]"],
          ["firstSquares 1", "[1]"],
          ["firstSquares 5", "[1,4,9,16,25]"],
        ],
        "`map (^ 2) [1 ..]` is every square number. `take` just the first n.",
      ),
      q(
        "`filter (< 10) [1 ..]` prints `[1,2,3,4,5,6,7,8,9` and then what?",
        [
          "It prints `]` and stops",
          "It hangs forever: `filter` doesn't know no more small numbers are coming",
          "It crashes",
          "It prints all the other numbers",
        ],
        1,
        "`filter` keeps checking forever, hoping for another number below 10. Use `takeWhile (< 10)`, which stops at the first failure.",
      ),
      p("takeWhile (< 10) [1, 4 ..]", "[1,4,7]", "The list is 1, 4, 7, 10, ... and `takeWhile` stops at 10, the first one that fails."),
      p("head (filter even [7 ..])", "8", "`head` only needs the first match, so `filter` only has to check 7 and 8."),
      w(
        "Write `powersOfTwo`, which gives the first n powers of two, starting at 1. Use `iterate`.",
        hs`powersOfTwo :: Int -> [Int]
powersOfTwo n = undefined
`,
        hs`powersOfTwo :: Int -> [Int]
powersOfTwo n = take n (iterate (*2) 1)
`,
        [
          ["powersOfTwo 4", "[1,2,4,8]"],
          ["powersOfTwo 0", "[]"],
          ["powersOfTwo 1", "[1]"],
          ["powersOfTwo 6", "[1,2,4,8,16,32]"],
        ],
        "`iterate (*2) 1` is 1, 2, 4, 8, ... forever. `take n` of it.",
      ),
      q(
        "Which of these never finishes?",
        ["`take 5 [1 ..]`", "`head [1 ..]`", "`sum [1 ..]`", "`takeWhile (< 5) [1 ..]`"],
        2,
        "`sum` has to add every element, and an endless list has no last element.",
      ),
      p("length [undefined, undefined, undefined]", "3", "`length` counts the elements without looking inside them."),
      w(
        md(
          "Write `firstMultipleOver k n`, which gives the smallest multiple of `k` that is bigger than `n`.",
          "",
          "For example `firstMultipleOver 3 10` is 12. Search an endless list starting at `n + 1`.",
        ),
        hs`firstMultipleOver :: Int -> Int -> Int
firstMultipleOver k n = undefined
`,
        hs`firstMultipleOver :: Int -> Int -> Int
firstMultipleOver k n = head (filter (\x -> mod x k == 0) [n + 1 ..])
`,
        [
          ["firstMultipleOver 3 10", "12"],
          ["firstMultipleOver 5 10", "15"],
          ["firstMultipleOver 7 0", "7"],
          ["firstMultipleOver 1 99", "100"],
          ["firstMultipleOver 4 (-3)", "0"],
        ],
        "`filter` the multiples of `k` out of `[n + 1 ..]` and take the `head`. Laziness means it stops at the first one.",
      ),
      q(
        "What happens with `head [undefined, 2]`?",
        ["It gives `2`", "It crashes: `head` gives back the first element, and printing it needs its value", "It gives `[2]`", "It gives `0`"],
        1,
        "`undefined` is fine until something needs its value. Printing the result of `head` needs it.",
      ),
      p(
        "dropWhile (< 5) [1 .. 8]",
        "[5,6,7,8]",
        "1 to 4 pass the test and are dropped. At 5 it stops dropping and keeps the rest.",
        "`dropWhile` throws away elements from the front while the test is True.",
      ),
      w(
        "Write `smallSquares`, which gives every square number (1, 4, 9, ...) that is less than a limit. Use `takeWhile`.",
        hs`smallSquares :: Int -> [Int]
smallSquares limit = undefined
`,
        hs`smallSquares :: Int -> [Int]
smallSquares limit = takeWhile (< limit) (map (^ 2) [1 ..])
`,
        [
          ["smallSquares 30", "[1,4,9,16,25]"],
          ["smallSquares 1", "[]"],
          ["smallSquares 2", "[1]"],
          ["smallSquares 0", "[]"],
          ["smallSquares 26", "[1,4,9,16,25]"],
        ],
        "`filter` would never stop on an endless list. `takeWhile (< limit)` stops at the first square that's too big.",
      ),
      w(
        md(
          "Exam-style. The Collatz step: if n is even, halve it; otherwise make it `3 * n + 1`. Write `collatz`, which gives the steps from n until it reaches 1, including both ends.",
          "",
          "For example `collatz 6` is `[6,3,10,5,16,8,4,2,1]`. Try `iterate` and `takeWhile`.",
        ),
        hs`collatz :: Int -> [Int]
collatz n = undefined
`,
        hs`step :: Int -> Int
step n = if even n then div n 2 else 3 * n + 1

collatz :: Int -> [Int]
collatz n = takeWhile (/= 1) (iterate step n) ++ [1]
`,
        [
          ["collatz 1", "[1]"],
          ["collatz 6", "[6,3,10,5,16,8,4,2,1]"],
          ["collatz 2", "[2,1]"],
          ["length (collatz 27)", "112"],
        ],
        "Write a `step` helper. `iterate step n` is the endless sequence; keep it while it isn't 1, then add the 1 on the end.",
      ),
      w(
        md(
          "Exam-style. Write `firstPrimes`, which gives the first n prime numbers.",
          "",
          "A prime is a number above 1 with no divisors between 2 and itself minus 1. Filter an endless list.",
        ),
        hs`firstPrimes :: Int -> [Int]
firstPrimes n = undefined
`,
        hs`isPrime :: Int -> Bool
isPrime n = n > 1 && filter (\d -> mod n d == 0) [2 .. n - 1] == []

firstPrimes :: Int -> [Int]
firstPrimes n = take n (filter isPrime [2 ..])
`,
        [
          ["firstPrimes 5", "[2,3,5,7,11]"],
          ["firstPrimes 0", "[]"],
          ["firstPrimes 1", "[2]"],
          ["last (firstPrimes 10)", "29"],
        ],
        "Write `isPrime` first. Then `take n (filter isPrime [2 ..])`.",
      ),
      w(
        md(
          "Exam-style. The Fibonacci numbers start 0, 1, and each next one is the sum of the two before: 0, 1, 1, 2, 3, 5, 8, ... Write `fibs`, which gives the first n of them.",
          "",
          "One way: a helper `fibsFrom a b` that builds the endless list starting with `a` and `b`.",
        ),
        hs`fibs :: Int -> [Int]
fibs n = undefined
`,
        hs`fibsFrom :: Int -> Int -> [Int]
fibsFrom a b = a : fibsFrom b (a + b)

fibs :: Int -> [Int]
fibs n = take n (fibsFrom 0 1)
`,
        [
          ["fibs 0", "[]"],
          ["fibs 1", "[0]"],
          ["fibs 7", "[0,1,1,2,3,5,8]"],
          ["last (fibs 20)", "4181"],
        ],
        "`fibsFrom a b = a : fibsFrom b (a + b)` never stops on its own, and that's fine: `take n` only asks for n elements.",
      ),
    ],
  },
];
