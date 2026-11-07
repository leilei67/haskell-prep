import { type Book, type DrillSet, hs, md } from "../schema.ts";

const charImport = hs`import Data.Char (toUpper, toLower, isDigit, isAlpha, isSpace)
`;

const listImport = hs`import Data.List (intercalate, nub)
`;

// ---------------------------------------------------------------------------
// Level 1: Warm-up
// ---------------------------------------------------------------------------

const level1: DrillSet = {
  id: "b-hof-l1",
  lesson: "",
  level: 1,
  title: "Level 1: Warm-up",
  intro: md(
    "One idea at a time. `map` changes every element. `filter` keeps some of them. A section such as `(*2)` is a tiny function with one side already filled in. Most starters already have `map` or `filter` written; you fill in the hole.",
    "",
    "```",
    "map (*2) [1, 2, 3]      -- [2, 4, 6]",
    "filter even [1 .. 6]    -- [2, 4, 6]",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: "What does `map f xs` do?",
      options: [
        "It applies `f` to every element of `xs`, in the same order",
        "It keeps the elements of `xs` for which `f` is `True`",
        "It calls `f` once on the whole list `xs`",
        "It joins `f` onto the front of `xs`",
      ],
      answer: 0,
      why: "`map` walks the list and uses `f` on each element. Keeping some elements is `filter`. `map` never calls `f` on the list as a whole.",
    },
    {
      k: "predict",
      expr: "map (* 3) [1, 2, 4]",
      answer: "[3, 6, 12]",
      why: "`(* 3)` is a section: multiply by 3. So each number is tripled, in order.",
    },
    {
      k: "write",
      body: "Write `plusTen`, which adds 10 to every number. The `map` is there: fill in the function.",
      starter: hs`plusTen :: [Int] -> [Int]
plusTen xs = map undefined xs
`,
      tests: [
        { expr: "plusTen [1, 2, 3]", expected: "[11, 12, 13]" },
        { expr: "plusTen []", expected: "[]" },
        { expr: "plusTen [0]", expected: "[10]" },
        { expr: "plusTen [7, 7, -5]", expected: "[17, 17, 5]", label: "duplicates and negatives" },
      ],
      hint: "The section `(+ 10)` adds 10. Put that where `undefined` is.",
      solution: hs`plusTen :: [Int] -> [Int]
plusTen xs = map (+ 10) xs
`,
    },
    {
      k: "quiz",
      q: "What is `(+ 1)`?",
      options: [
        "A section: the function that adds 1",
        "A type error: you cannot leave a hole next to `+`",
        "The number 1",
        "The same as `1 + 1`",
      ],
      answer: 0,
      why: "An operator with one side filled in is a section. `(+ 1)` waits for the missing number and adds 1 to it. `map (+ 1) [3, 4]` is `[4, 5]`.",
    },
    {
      k: "predict",
      expr: "filter (> 10) [4, 15, 10, 21]",
      answer: "[15, 21]",
      why: "`filter` keeps the elements that pass the test. 15 and 21 are bigger than 10. 10 is not, so it is dropped.",
    },
    {
      k: "write",
      setup: charImport,
      body: "A shop prints labels in block capitals. Write `shout`, which turns every letter of a String to upper case. The `map` is there: fill in the function.",
      starter: hs`shout :: String -> String
shout s = map undefined s
`,
      tests: [
        { expr: `shout "sale"`, expected: `"SALE"` },
        { expr: `shout ""`, expected: `""` },
        { expr: `shout "Hi"`, expected: `"HI"` },
        { expr: `shout "ok ok"`, expected: `"OK OK"`, label: "spaces stay spaces" },
      ],
      hint: "`toUpper` turns one `Char` into upper case. `map` does it to every character.",
      solution: hs`shout :: String -> String
shout s = map toUpper s
`,
    },
    {
      k: "quiz",
      q: "You have a list of temperatures and you want only the ones of 16 or more. Which call is right?",
      options: [
        "`filter (>= 16) temps`",
        "`map (>= 16) temps`",
        "`filter temps (>= 16)`",
        "`map (+ 16) temps`",
      ],
      answer: 0,
      why: "`filter` keeps the elements that pass a test. `map (>= 16)` would give a list of `True`/`False`, not the temperatures. The test comes first, then the list.",
    },
    {
      k: "write",
      body: "A weather log is a list of midday temperatures in Celsius. Write `keepWarm`, which keeps the readings of 16 or more. The `filter` is there: fill in the test.",
      starter: hs`keepWarm :: [Int] -> [Int]
keepWarm temps = filter undefined temps
`,
      tests: [
        { expr: "keepWarm [12, 16, 19, 8]", expected: "[16, 19]" },
        { expr: "keepWarm []", expected: "[]" },
        { expr: "keepWarm [16]", expected: "[16]" },
        { expr: "keepWarm [20, 20, 5]", expected: "[20, 20]", label: "duplicates are both kept" },
        { expr: "keepWarm [0, 5]", expected: "[]", label: "none warm enough" },
      ],
      hint: "The test is the section `(>= 16)`.",
      solution: hs`keepWarm :: [Int] -> [Int]
keepWarm temps = filter (>= 16) temps
`,
    },
    {
      k: "predict",
      expr: "any even [1, 3, 5, 8]",
      answer: "True",
      why: "`any even` is True if at least one element is even. 8 is even, so the answer is True.",
    },
    {
      k: "write",
      body: "A till roll is a list of item prices in pence. Write `anyFree`, which is `True` if any price is `0`. The `any` is there: fill in the test.",
      starter: hs`anyFree :: [Int] -> Bool
anyFree prices = any undefined prices
`,
      tests: [
        { expr: "anyFree [120, 0, 80]", expected: "True" },
        { expr: "anyFree []", expected: "False", label: "nothing is free in an empty list" },
        { expr: "anyFree [50]", expected: "False" },
        { expr: "anyFree [0, 0, 9]", expected: "True", label: "several zeros still count as any" },
        { expr: "anyFree [1, 2, 3]", expected: "False" },
      ],
      hint: "The test is `(== 0)`. `any` on `[]` is `False`.",
      solution: hs`anyFree :: [Int] -> Bool
anyFree prices = any (== 0) prices
`,
    },
    {
      k: "predict",
      expr: "all (/= 0) [2, 4, 0]",
      answer: "False",
      why: "`all` is True only if every element passes. 0 fails `(/= 0)`, so the answer is False.",
    },
    {
      k: "write",
      body: "A warehouse records how many of each item are on the shelf. Write `allInStock`, which is `True` only when every count is bigger than 0. The `all` is there: fill in the test.",
      starter: hs`allInStock :: [Int] -> Bool
allInStock counts = all undefined counts
`,
      tests: [
        { expr: "allInStock [3, 1, 4]", expected: "True" },
        { expr: "allInStock []", expected: "True", label: "all on an empty list is True" },
        { expr: "allInStock [5]", expected: "True" },
        { expr: "allInStock [2, 0, 2]", expected: "False" },
        { expr: "allInStock [0]", expected: "False" },
      ],
      hint: "The test is `(> 0)`. Remember: `all` on `[]` is `True`, because there is no counter-example.",
      solution: hs`allInStock :: [Int] -> Bool
allInStock counts = all (> 0) counts
`,
    },
    {
      k: "quiz",
      q: md(
        "What does this lambda do?",
        "",
        "```",
        "\\x -> x * x",
        "```",
      ),
      options: [
        "It is a function with no name: given `x`, it gives back `x * x`",
        "It multiplies two different lists together",
        "It is a type error: functions must have names",
        "It squares `x` and then throws the result away",
      ],
      answer: 0,
      why: "A lambda is a function you write in place, without giving it a name. The `\\` is meant to look like the Greek letter λ. `map (\\x -> x * x) [2, 3]` is `[4, 9]`.",
    },
    {
      k: "write",
      body: "Write `squares`, which replaces every number with its square. Use `map` and a lambda (not a section: there is no 'square' operator to leave a hole in).",
      starter: hs`squares :: [Int] -> [Int]
squares xs = map undefined xs
`,
      tests: [
        { expr: "squares [2, 3, 4]", expected: "[4, 9, 16]" },
        { expr: "squares []", expected: "[]" },
        { expr: "squares [0]", expected: "[0]" },
        { expr: "squares [-3, -3]", expected: "[9, 9]", label: "negatives square to positives; duplicates stay" },
      ],
      hint: "The lambda is `\\x -> x * x`.",
      solution: hs`squares :: [Int] -> [Int]
squares xs = map (\x -> x * x) xs
`,
    },
    {
      k: "predict",
      expr: "zipWith (+) [1, 2, 3] [10, 20]",
      answer: "[11, 22]",
      why: "`zipWith` walks the two lists together and uses `+` on each pair. It stops when the shorter list runs out, so 3 is unused.",
    },
    {
      k: "write",
      body: "A train's scheduled times and its delays are two lists of minutes. Write `actualTimes`, which adds them pairwise. The `zipWith` is there: fill in the operator.",
      starter: hs`actualTimes :: [Int] -> [Int] -> [Int]
actualTimes scheduled delays = zipWith undefined scheduled delays
`,
      tests: [
        { expr: "actualTimes [10, 25, 40] [0, 5, 2]", expected: "[10, 30, 42]" },
        { expr: "actualTimes [] []", expected: "[]" },
        { expr: "actualTimes [8] [3]", expected: "[11]" },
        { expr: "actualTimes [10, 20] [1]", expected: "[11]", label: "stops at the shorter list" },
        { expr: "actualTimes [5, 5, 5] [0, 0]", expected: "[5, 5]" },
      ],
      hint: "The operator is `(+)`. `zipWith` stops at the shorter list.",
      solution: hs`actualTimes :: [Int] -> [Int] -> [Int]
actualTimes scheduled delays = zipWith (+) scheduled delays
`,
    },
    {
      k: "quiz",
      q: "What are `any even []` and `all even []`?",
      options: [
        "`False` and `True`",
        "`True` and `True`",
        "`False` and `False`",
        "`True` and `False`",
      ],
      answer: 0,
      why: "`any` asks 'is there at least one?'. In an empty list there isn't, so `False`. `all` asks 'is every one even?'. There is no counter-example, so `True`.",
    },
    {
      k: "write",
      body: "A hat stall prices everything in pence. Write `cheapHats`, which keeps the prices strictly under 1000 (ten pounds).",
      starter: hs`cheapHats :: [Int] -> [Int]
cheapHats prices = undefined
`,
      tests: [
        { expr: "cheapHats [800, 1200, 999]", expected: "[800, 999]" },
        { expr: "cheapHats []", expected: "[]" },
        { expr: "cheapHats [50]", expected: "[50]" },
        { expr: "cheapHats [1000, 2000]", expected: "[]", label: "1000 is not strictly under 1000" },
        { expr: "cheapHats [200, 200, 4000]", expected: "[200, 200]" },
      ],
      hint: "`filter (< 1000) prices`.",
      solution: hs`cheapHats :: [Int] -> [Int]
cheapHats prices = filter (< 1000) prices
`,
    },
    {
      k: "predict",
      expr: "(not . even) 6",
      answer: "False",
      why: "`.` means 'do the right-hand function first, then the left'. `even 6` is `True`, and `not True` is `False`.",
    },
    {
      k: "write",
      body: "A playlist is a list of song titles. Write `addBang`, which puts `!` on the end of every title.",
      starter: hs`addBang :: [String] -> [String]
addBang titles = undefined
`,
      tests: [
        { expr: `addBang ["Hey", "Go"]`, expected: `["Hey!", "Go!"]` },
        { expr: "addBang []", expected: "[]" },
        { expr: `addBang ["A"]`, expected: `["A!"]` },
        { expr: `addBang ["", "Hi"]`, expected: `["!", "Hi!"]` },
        { expr: `addBang ["no", "no"]`, expected: `["no!", "no!"]` },
      ],
      hint: "The section `(++ \"!\")` appends an exclamation mark. `map (++ \"!\") titles`.",
      solution: hs`addBang :: [String] -> [String]
addBang titles = map (++ "!") titles
`,
    },
    {
      k: "write",
      body: "Write `nPositives`, which counts how many numbers in a list are bigger than 0. Use `filter` and `length` (or join them with `.`).",
      starter: hs`nPositives :: [Int] -> Int
nPositives xs = undefined
`,
      tests: [
        { expr: "nPositives [3, -1, 0, 5]", expected: "2" },
        { expr: "nPositives []", expected: "0" },
        { expr: "nPositives [8]", expected: "1" },
        { expr: "nPositives [0, 0, -2]", expected: "0", label: "zero is not positive" },
        { expr: "nPositives [1, 1, 1]", expected: "3" },
      ],
      hint: "`length (filter (> 0) xs)`. With composition: `(length . filter (> 0)) xs`.",
      solution: hs`nPositives :: [Int] -> Int
nPositives xs = length (filter (> 0) xs)
`,
    },
    {
      k: "write",
      body: "Write `bumpAll`, which adds 1 to every number, as a list comprehension. Fill in the output on the left of the bar.",
      starter: hs`bumpAll :: [Int] -> [Int]
bumpAll xs = [ undefined | x <- xs ]
`,
      tests: [
        { expr: "bumpAll [4, 5, 6]", expected: "[5, 6, 7]" },
        { expr: "bumpAll []", expected: "[]" },
        { expr: "bumpAll [-1]", expected: "[0]" },
        { expr: "bumpAll [2, 2, 2]", expected: "[3, 3, 3]" },
      ],
      hint: "The output is `x + 1`. The generator `x <- xs` walks the list.",
      solution: hs`bumpAll :: [Int] -> [Int]
bumpAll xs = [ x + 1 | x <- xs ]
`,
    },
    {
      k: "write",
      setup: charImport,
      body: "A ticket code mixes letters and digits. Write `keepDigits`, which keeps only the digit characters, in order.",
      starter: hs`keepDigits :: String -> String
keepDigits s = undefined
`,
      tests: [
        { expr: `keepDigits "AB12c3"`, expected: `"123"` },
        { expr: `keepDigits ""`, expected: `""` },
        { expr: `keepDigits "7"`, expected: `"7"` },
        { expr: `keepDigits "hello"`, expected: `""`, label: "no digits" },
        { expr: `keepDigits "1001"`, expected: `"1001"`, label: "duplicate digits stay" },
      ],
      hint: "`filter isDigit s`. `isDigit` is from `Data.Char`.",
      solution: hs`keepDigits :: String -> String
keepDigits s = filter isDigit s
`,
    },
    {
      k: "write",
      body: md(
        "A playlist description is a list of lines, each holding one or more tags separated by spaces. Write `tagWords`, which flattens them into one list of tags.",
        "",
        "```",
        "tagWords [\"folk pop\", \"live\"]  ==  [\"folk\", \"pop\", \"live\"]",
        "```",
      ),
      starter: hs`tagWords :: [String] -> [String]
tagWords lines = undefined
`,
      tests: [
        { expr: `tagWords ["folk pop", "live"]`, expected: `["folk", "pop", "live"]` },
        { expr: "tagWords []", expected: "[]" },
        { expr: `tagWords ["jazz"]`, expected: `["jazz"]` },
        { expr: `tagWords ["", "rock soul"]`, expected: `["rock", "soul"]`, label: "an empty line adds nothing" },
      ],
      hint: "`concatMap` maps a function that returns a list, then joins the lists: `concatMap words lines`. `words` splits one line on spaces.",
      solution: hs`tagWords :: [String] -> [String]
tagWords lines = concatMap words lines
`,
    },
    {
      k: "write",
      body: "Write `productOf`, which multiplies every number in a list. Use `foldr`. The product of nothing is 1.",
      starter: hs`productOf :: [Int] -> Int
productOf xs = foldr undefined 1 xs
`,
      tests: [
        { expr: "productOf [2, 3, 4]", expected: "24" },
        { expr: "productOf []", expected: "1", label: "empty product is 1" },
        { expr: "productOf [7]", expected: "7" },
        { expr: "productOf [2, 0, 9]", expected: "0" },
        { expr: "productOf [-2, -3]", expected: "6" },
      ],
      hint: "`foldr (*) 1 xs` puts `*` between the elements and uses `1` when the list is empty.",
      solution: hs`productOf :: [Int] -> Int
productOf xs = foldr (*) 1 xs
`,
      banned: ["product"],
    },
    {
      k: "write",
      body: "Two weather stations record the same days. Write `coolerOf`, which keeps the lower temperature of each pair. Use `zipWith`.",
      starter: hs`coolerOf :: [Int] -> [Int] -> [Int]
coolerOf as bs = undefined
`,
      tests: [
        { expr: "coolerOf [12, 18, 9] [10, 20, 9]", expected: "[10, 18, 9]" },
        { expr: "coolerOf [] []", expected: "[]" },
        { expr: "coolerOf [5] [8]", expected: "[5]" },
        { expr: "coolerOf [3, 3] [3, 1, 9]", expected: "[3, 1]", label: "stops at the shorter list; duplicate 3s are fine" },
      ],
      hint: "`zipWith min as bs`. `min` already picks the smaller of two numbers.",
      solution: hs`coolerOf :: [Int] -> [Int] -> [Int]
coolerOf as bs = zipWith min as bs
`,
    },
    {
      k: "write",
      body: "A playlist is a list of song titles. Write `shortTitles`, which keeps titles of at most 4 characters.",
      starter: hs`shortTitles :: [String] -> [String]
shortTitles titles = undefined
`,
      tests: [
        { expr: `shortTitles ["Hey", "Midnight", "Go", "Help"]`, expected: `["Hey", "Go", "Help"]` },
        { expr: "shortTitles []", expected: "[]" },
        { expr: `shortTitles ["Wait"]`, expected: `["Wait"]` },
        { expr: `shortTitles ["abcde", "xy"]`, expected: `["xy"]` },
        { expr: `shortTitles ["no", "no"]`, expected: `["no", "no"]`, label: "duplicates are both kept" },
      ],
      hint: "`filter (\\t -> length t <= 4) titles`. A section cannot do this: you need `length` first.",
      solution: hs`shortTitles :: [String] -> [String]
shortTitles titles = filter (\t -> length t <= 4) titles
`,
    },
    {
      k: "quiz",
      q: "What is the difference between `map f xs` and `concatMap f xs`?",
      options: [
        "`map` builds a list of results; `concatMap` joins those results into one list, so `f` must itself return a list",
        "They are the same function with two names",
        "`concatMap` keeps only the first result; `map` keeps them all",
        "`concatMap` only works on Strings",
      ],
      answer: 0,
      why: "`map words [\"a b\", \"c\"]` is `[[\"a\",\"b\"],[\"c\"]]`. `concatMap words` joins that into `[\"a\",\"b\",\"c\"]`. Use `concatMap` when each element becomes several elements.",
    },
    {
      k: "write",
      body: "Exam marks are out of 100. Write `passMarks`, which keeps the marks of 40 or more, in the original order.",
      starter: hs`passMarks :: [Int] -> [Int]
passMarks ms = undefined
`,
      tests: [
        { expr: "passMarks [39, 40, 72, 18]", expected: "[40, 72]" },
        { expr: "passMarks []", expected: "[]" },
        { expr: "passMarks [40]", expected: "[40]" },
        { expr: "passMarks [10, 20]", expected: "[]", label: "nobody passed" },
        { expr: "passMarks [55, 55, 90]", expected: "[55, 55, 90]" },
      ],
      hint: "`filter (>= 40) ms`.",
      solution: hs`passMarks :: [Int] -> [Int]
passMarks ms = filter (>= 40) ms
`,
    },
    {
      k: "write",
      body: "A cafe adds 20 pence service to every drink. Write `withService`, which adds 20 to every price in a list.",
      starter: hs`withService :: [Int] -> [Int]
withService prices = undefined
`,
      tests: [
        { expr: "withService [180, 220, 90]", expected: "[200, 240, 110]" },
        { expr: "withService []", expected: "[]" },
        { expr: "withService [0]", expected: "[20]", label: "a free drink still gets service" },
        { expr: "withService [50, 50]", expected: "[70, 70]" },
      ],
      hint: "`map (+ 20) prices`.",
      solution: hs`withService :: [Int] -> [Int]
withService prices = map (+ 20) prices
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 2: Standard
// ---------------------------------------------------------------------------

const level2: DrillSet = {
  id: "b-hof-l2",
  lesson: "",
  level: 2,
  title: "Level 2: Standard",
  intro: md(
    "Now each question is one whole function from a plain description. You pick the tool: `map` to change every element, `filter` to keep some, `foldr` to squash a list into one value, or a comprehension when you want both.",
    "",
    "```",
    "passing :: [Int] -> [Int]",
    "passing marks = filter (>= 40) marks",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: md(
        "`foldr` puts an operator between the elements of a list, starting from the right. What is `foldr (+) 0 [1, 2, 3]`?",
        "",
        "```",
        "foldr (+) 0 [1, 2, 3]  means  1 + (2 + (3 + 0))",
        "```",
      ),
      options: ["`6`", "`0`", "`[1, 2, 3]`", "`123`"],
      answer: 0,
      why: "The start value `0` is used when the list runs out. Then each number is added on: `3 + 0` is 3, `2 + 3` is 5, `1 + 5` is 6. That is the same as `sum`.",
    },
    {
      k: "write",
      body: "Write `toFahrenheit`, which converts a list of whole Celsius temperatures to whole Fahrenheit using `div (c * 9) 5 + 32` on each one.",
      starter: hs`toFahrenheit :: [Int] -> [Int]
toFahrenheit cs = undefined
`,
      tests: [
        { expr: "toFahrenheit [0, 10, 20]", expected: "[32, 50, 68]" },
        { expr: "toFahrenheit []", expected: "[]" },
        { expr: "toFahrenheit [0]", expected: "[32]" },
        { expr: "toFahrenheit [-5, -5]", expected: "[23, 23]" },
      ],
      hint: "`map (\\c -> div (c * 9) 5 + 32) cs`.",
      solution: hs`toFahrenheit :: [Int] -> [Int]
toFahrenheit cs = map (\c -> div (c * 9) 5 + 32) cs
`,
    },
    {
      k: "write",
      body: "A bakery lists bun prices in pence. Write `addVat`, which adds 20 percent to every price, using `div (p * 6) 5` (that is `p + div p 5`).",
      starter: hs`addVat :: [Int] -> [Int]
addVat prices = undefined
`,
      tests: [
        { expr: "addVat [100, 250, 80]", expected: "[120, 300, 96]" },
        { expr: "addVat []", expected: "[]" },
        { expr: "addVat [5]", expected: "[6]" },
        { expr: "addVat [0, 10, 10]", expected: "[0, 12, 12]" },
      ],
      hint: "`map (\\p -> div (p * 6) 5) prices`.",
      solution: hs`addVat :: [Int] -> [Int]
addVat prices = map (\p -> div (p * 6) 5) prices
`,
    },
    {
      k: "predict",
      expr: "foldl' (flip (:)) [] [1, 2, 3]",
      answer: "[3, 2, 1]",
      why: "`foldl'` starts from the left. `flip (:)` puts each new element on the front of the answer so far: `[]`, then `[1]`, then `[2,1]`, then `[3,2,1]`. That reverses the list.",
    },
    {
      k: "write",
      body: "Write `rainyDays`, which keeps the rainfall readings that are strictly bigger than 0.",
      starter: hs`rainyDays :: [Int] -> [Int]
rainyDays mm = undefined
`,
      tests: [
        { expr: "rainyDays [0, 4, 0, 12]", expected: "[4, 12]" },
        { expr: "rainyDays []", expected: "[]" },
        { expr: "rainyDays [3]", expected: "[3]" },
        { expr: "rainyDays [0, 0]", expected: "[]", label: "dry week" },
        { expr: "rainyDays [2, 2, 5]", expected: "[2, 2, 5]" },
      ],
      hint: "`filter (> 0) mm`.",
      solution: hs`rainyDays :: [Int] -> [Int]
rainyDays mm = filter (> 0) mm
`,
    },
    {
      k: "write",
      body: "A gym records how many minutes each visit lasted. Write `totalMins`, the total of the list.",
      starter: hs`totalMins :: [Int] -> Int
totalMins visits = undefined
`,
      tests: [
        { expr: "totalMins [40, 15, 60]", expected: "115" },
        { expr: "totalMins []", expected: "0" },
        { expr: "totalMins [25]", expected: "25" },
        { expr: "totalMins [10, 10, 0]", expected: "20" },
      ],
      hint: "`foldr (+) 0 visits`, or `sum visits`. This level is practising folds, so prefer `foldr`.",
      solution: hs`totalMins :: [Int] -> Int
totalMins visits = foldr (+) 0 visits
`,
      banned: ["sum"],
    },
    {
      k: "quiz",
      q: "You want to reverse a long list in one left-to-right pass. Which fold is the natural choice?",
      options: [
        "`foldl' (flip (:)) []`",
        "`foldr (:) []`",
        "`foldr (flip (:)) []`",
        "`foldl' (:) []`",
      ],
      answer: 0,
      why: "`foldl'` walks left to right, and `flip (:)` puts each new element on the front, so the first element ends up at the back. `foldr (:) []` rebuilds the list unchanged. `foldl' (:) []` does not even type-check: `(:)` wants an element on the left, not a list.",
    },
    {
      k: "write",
      body: "Write `myReverse`, which reverses a list using `foldl'`. Do not use the built-in `reverse`.",
      starter: hs`myReverse :: [a] -> [a]
myReverse xs = undefined
`,
      tests: [
        { expr: `myReverse "cat"`, expected: `"tac"` },
        { expr: "myReverse ([] :: [Int])", expected: "[]" },
        { expr: "myReverse [9 :: Int]", expected: "[9]" },
        { expr: "myReverse [1, 2, 2, 3 :: Int]", expected: "[3, 2, 2, 1]" },
      ],
      hint: "`foldl' (flip (:)) [] xs`. `flip (:)` is `\\acc x -> x : acc`.",
      solution: hs`myReverse :: [a] -> [a]
myReverse xs = foldl' (flip (:)) [] xs
`,
      banned: ["reverse"],
    },
    {
      k: "write",
      setup: charImport,
      body: "Write `onlyLetters`, which keeps the alphabetic characters of a String and drops spaces, digits and punctuation.",
      starter: hs`onlyLetters :: String -> String
onlyLetters s = undefined
`,
      tests: [
        { expr: `onlyLetters "Hi 2 u!"`, expected: `"Hiu"` },
        { expr: `onlyLetters ""`, expected: `""` },
        { expr: `onlyLetters "Z"`, expected: `"Z"` },
        { expr: `onlyLetters "123"`, expected: `""` },
        { expr: `onlyLetters "aa-aa"`, expected: `"aaaa"` },
      ],
      hint: "`filter isAlpha s`.",
      solution: hs`onlyLetters :: String -> String
onlyLetters s = filter isAlpha s
`,
    },
    {
      k: "write",
      body: "Write `scaleBy k xs`, which multiplies every number in `xs` by `k`.",
      starter: hs`scaleBy :: Int -> [Int] -> [Int]
scaleBy k xs = undefined
`,
      tests: [
        { expr: "scaleBy 3 [1, 4, 0]", expected: "[3, 12, 0]" },
        { expr: "scaleBy 5 []", expected: "[]" },
        { expr: "scaleBy 2 [7]", expected: "[14]" },
        { expr: "scaleBy 0 [1, 1, 1]", expected: "[0, 0, 0]" },
        { expr: "scaleBy (-1) [2, 2]", expected: "[-2, -2]" },
      ],
      hint: "`map (* k) xs`. The section `(* k)` captures `k`.",
      solution: hs`scaleBy :: Int -> [Int] -> [Int]
scaleBy k xs = map (* k) xs
`,
    },
    {
      k: "write",
      body: "A cinema lists film titles. Write `longestLen`, the length of the longest title. You may assume the list is not empty.",
      starter: hs`longestLen :: [String] -> Int
longestLen titles = undefined
`,
      tests: [
        { expr: `longestLen ["Up", "Dune", "Heat"]`, expected: "4" },
        { expr: `longestLen ["A"]`, expected: "1" },
        { expr: `longestLen ["abc", "abc"]`, expected: "3" },
        { expr: `longestLen ["", "no"]`, expected: "2" },
      ],
      hint: "`maximum (map length titles)`. `maximum` needs a non-empty list, which the question allows.",
      solution: hs`longestLen :: [String] -> Int
longestLen titles = maximum (map length titles)
`,
    },
    {
      k: "write",
      body: "A shop flags a bargain if any price is under 50 pence. Write `hasBargain`.",
      starter: hs`hasBargain :: [Int] -> Bool
hasBargain prices = undefined
`,
      tests: [
        { expr: "hasBargain [120, 40, 80]", expected: "True" },
        { expr: "hasBargain []", expected: "False" },
        { expr: "hasBargain [50]", expected: "False", label: "50 is not under 50" },
        { expr: "hasBargain [9, 9, 200]", expected: "True" },
        { expr: "hasBargain [50, 51]", expected: "False" },
      ],
      hint: "`any (< 50) prices`.",
      solution: hs`hasBargain :: [Int] -> Bool
hasBargain prices = any (< 50) prices
`,
    },
    {
      k: "write",
      body: "A courier lists parcel weights. Write `allLight`, which is `True` when every weight is at most 20.",
      starter: hs`allLight :: [Int] -> Bool
allLight kg = undefined
`,
      tests: [
        { expr: "allLight [4, 20, 1]", expected: "True" },
        { expr: "allLight []", expected: "True" },
        { expr: "allLight [21]", expected: "False" },
        { expr: "allLight [20, 20, 20]", expected: "True" },
        { expr: "allLight [1, 30, 2]", expected: "False" },
      ],
      hint: "`all (<= 20) kg`.",
      solution: hs`allLight :: [Int] -> Bool
allLight kg = all (<= 20) kg
`,
    },
    {
      k: "write",
      body: md(
        "Write `labelSeats`, which pairs each guest name with a seat number starting at 1, using `zipWith`.",
        "",
        "```",
        "labelSeats [\"Ann\", \"Bo\"]  ==  [(1, \"Ann\"), (2, \"Bo\")]",
        "```",
      ),
      starter: hs`labelSeats :: [String] -> [(Int, String)]
labelSeats names = undefined
`,
      tests: [
        { expr: `labelSeats ["Ann", "Bo"]`, expected: `[(1, "Ann"), (2, "Bo")]` },
        { expr: "labelSeats []", expected: "[]" },
        { expr: `labelSeats ["Cy"]`, expected: `[(1, "Cy")]` },
        { expr: `labelSeats ["Al", "Al"]`, expected: `[(1, "Al"), (2, "Al")]` },
      ],
      hint: "`zipWith (\\i n -> (i, n)) [1 ..] names`, or `zip [1 ..] names` if you write it that way. `zipWith` stops when the names run out, so the infinite `[1 ..]` is safe.",
      solution: hs`labelSeats :: [String] -> [(Int, String)]
labelSeats names = zipWith (\i n -> (i, n)) [1 ..] names
`,
    },
    {
      k: "write",
      body: md(
        "A notes app stores each note as a String that may contain several lines. Write `allLines`, which joins every line of every note into one list.",
        "",
        "```",
        "allLines [\"hi\\nthere\", \"bye\"]  ==  [\"hi\", \"there\", \"bye\"]",
        "```",
      ),
      starter: hs`allLines :: [String] -> [String]
allLines notes = undefined
`,
      tests: [
        { expr: `allLines ["hi\\nthere", "bye"]`, expected: `["hi", "there", "bye"]` },
        { expr: "allLines []", expected: "[]" },
        { expr: `allLines ["solo"]`, expected: `["solo"]` },
        { expr: `allLines ["", "a\\nb"]`, expected: `["a", "b"]`, label: "an empty note adds nothing" },
      ],
      hint: "`concatMap lines notes`. `lines` splits one String on newline characters.",
      solution: hs`allLines :: [String] -> [String]
allLines notes = concatMap lines notes
`,
    },
    {
      k: "write",
      body: "Write `countLong n titles`, which counts how many titles are strictly longer than `n` characters.",
      starter: hs`countLong :: Int -> [String] -> Int
countLong n titles = undefined
`,
      tests: [
        { expr: `countLong 3 ["Hey", "Midnight", "Go", "Help"]`, expected: "2" },
        { expr: "countLong 0 []", expected: "0" },
        { expr: `countLong 10 ["short"]`, expected: "0" },
        { expr: `countLong 2 ["abc", "abc", "ab"]`, expected: "2" },
      ],
      hint: "`length (filter (\\t -> length t > n) titles)`.",
      solution: hs`countLong :: Int -> [String] -> Int
countLong n titles = length (filter (\t -> length t > n) titles)
`,
    },
    {
      k: "quiz",
      q: "You need to change every element **and** drop some of them. Which tool does both in one go?",
      options: [
        "A list comprehension with a generator and a filter",
        "`zipWith`, because it walks two lists",
        "`any`, because it stops early",
        "`foldl'`, because it is strict",
      ],
      answer: 0,
      why: "`[x * x | x <- xs, odd x]` squares the odd numbers and drops the even ones. You can also write `map` after `filter`, but the comprehension does both jobs in one expression.",
    },
    {
      k: "write",
      body: md(
        "The recursive product is:",
        "",
        "```",
        "productOf []     = 1",
        "productOf (x:xs) = x * productOf xs",
        "```",
        "",
        "Write `productOf` again, this time as a `foldr`. Do not use `product`.",
      ),
      starter: hs`productOf :: [Int] -> Int
productOf xs = undefined
`,
      tests: [
        { expr: "productOf [1, 2, 3, 4]", expected: "24" },
        { expr: "productOf []", expected: "1" },
        { expr: "productOf [9]", expected: "9" },
        { expr: "productOf [2, 2, 0]", expected: "0" },
      ],
      hint: "Replace `:` with `*` and `[]` with `1`: `foldr (*) 1 xs`.",
      solution: hs`productOf :: [Int] -> Int
productOf xs = foldr (*) 1 xs
`,
      banned: ["product"],
    },
    {
      k: "write",
      body: "Write `oddCubes`, which cubes every odd number in a list and drops the even ones. Use one list comprehension.",
      starter: hs`oddCubes :: [Int] -> [Int]
oddCubes xs = undefined
`,
      tests: [
        { expr: "oddCubes [1, 2, 3, 4]", expected: "[1, 27]" },
        { expr: "oddCubes []", expected: "[]" },
        { expr: "oddCubes [2, 4]", expected: "[]" },
        { expr: "oddCubes [-1, -1]", expected: "[-1, -1]" },
        { expr: "oddCubes [5]", expected: "[125]" },
      ],
      hint: "`[x * x * x | x <- xs, odd x]`.",
      solution: hs`oddCubes :: [Int] -> [Int]
oddCubes xs = [x * x * x | x <- xs, odd x]
`,
    },
    {
      k: "write",
      body: md(
        "Write `firstIndex y xs`, which gives `Just` the first index (from 0) where `y` appears, or `Nothing` if it is missing. Use `zip [0 ..]`.",
        "",
        "```",
        "firstIndex 'n' \"banana\"  ==  Just 2",
        "```",
      ),
      starter: hs`firstIndex :: Eq a => a -> [a] -> Maybe Int
firstIndex y xs = undefined
`,
      tests: [
        { expr: `firstIndex 'n' "banana"`, expected: "Just 2" },
        { expr: "firstIndex (3 :: Int) []", expected: "Nothing" },
        { expr: "firstIndex (7 :: Int) [7]", expected: "Just 0" },
        { expr: `firstIndex 'z' "abc"`, expected: "Nothing" },
        { expr: `firstIndex 'a' "banana"`, expected: "Just 1", label: "first of several" },
      ],
      hint: "Build the matching indexes with a comprehension, then use a `case` (or `listToMaybe`) on that list: empty means `Nothing`, `(i : _)` means `Just i`.",
      solution: hs`firstIndex :: Eq a => a -> [a] -> Maybe Int
firstIndex y xs =
  case [i | (i, x) <- zip [0 ..] xs, x == y] of
    []      -> Nothing
    (i : _) -> Just i
`,
    },
    {
      k: "write",
      body: md(
        "Write `initials`, which gives the first character of each non-empty name. Skip empty strings.",
        "",
        "```",
        "initials [\"Ann\", \"\", \"Bo\"]  ==  \"AB\"",
        "```",
      ),
      starter: hs`initials :: [String] -> String
initials names = undefined
`,
      tests: [
        { expr: `initials ["Ann", "", "Bo"]`, expected: `"AB"` },
        { expr: "initials []", expected: `""` },
        { expr: `initials ["Z"]`, expected: `"Z"` },
        { expr: `initials ["", ""]`, expected: `""` },
        { expr: `initials ["Al", "Al"]`, expected: `"AA"` },
      ],
      hint: "A comprehension with a filter: `[head n | n <- names, not (null n)]`. Do not call `head` on `\"\"`.",
      solution: hs`initials :: [String] -> String
initials names = [head n | n <- names, not (null n)]
`,
    },
    {
      k: "write",
      body: "Two judges score the same routines. Write `bestOf`, which keeps the higher score of each pair.",
      starter: hs`bestOf :: [Int] -> [Int] -> [Int]
bestOf as bs = undefined
`,
      tests: [
        { expr: "bestOf [6, 9, 4] [8, 3, 4]", expected: "[8, 9, 4]" },
        { expr: "bestOf [] []", expected: "[]" },
        { expr: "bestOf [1] [0]", expected: "[1]" },
        { expr: "bestOf [5, 5] [5, 7, 9]", expected: "[5, 7]" },
      ],
      hint: "`zipWith max as bs`.",
      solution: hs`bestOf :: [Int] -> [Int] -> [Int]
bestOf as bs = zipWith max as bs
`,
    },
    {
      k: "write",
      body: md(
        "Write `oddIndex`, which keeps the elements at odd indexes (1, 3, 5, ...). Use `zip [0 ..]`.",
        "",
        "```",
        "oddIndex [10, 20, 30, 40]  ==  [20, 40]",
        "```",
      ),
      starter: hs`oddIndex :: [a] -> [a]
oddIndex xs = undefined
`,
      tests: [
        { expr: "oddIndex [10, 20, 30, 40 :: Int]", expected: "[20, 40]" },
        { expr: "oddIndex ([] :: [Int])", expected: "[]" },
        { expr: "oddIndex [7 :: Int]", expected: "[]", label: "index 0 is even, so a singleton is dropped" },
        { expr: `oddIndex "abcde"`, expected: `"bd"` },
      ],
      hint: "`[x | (i, x) <- zip [0 ..] xs, odd i]`. This is **not** 'keep the odd numbers': it is about the place, not the value.",
      solution: hs`oddIndex :: [a] -> [a]
oddIndex xs = [x | (i, x) <- zip [0 ..] xs, odd i]
`,
    },
    {
      k: "write",
      body: "Write `inBand lo hi xs`, which keeps the numbers that are at least `lo` and at most `hi`.",
      starter: hs`inBand :: Int -> Int -> [Int] -> [Int]
inBand lo hi xs = undefined
`,
      tests: [
        { expr: "inBand 10 20 [5, 10, 15, 20, 25]", expected: "[10, 15, 20]" },
        { expr: "inBand 0 1 []", expected: "[]" },
        { expr: "inBand 3 3 [3]", expected: "[3]" },
        { expr: "inBand 1 2 [9, 8]", expected: "[]" },
        { expr: "inBand 0 5 [1, 1, 6]", expected: "[1, 1]" },
      ],
      hint: "`filter (\\x -> x >= lo && x <= hi) xs`, or a comprehension with two filters.",
      solution: hs`inBand :: Int -> Int -> [Int] -> [Int]
inBand lo hi xs = [x | x <- xs, x >= lo, x <= hi]
`,
    },
    {
      k: "predict",
      expr: "[x | x <- [2, 3, 4, 5], even x, x > 2]",
      answer: "[4]",
      why: "Two filters in a row: `x` must be even **and** bigger than 2. Only 4 passes both.",
    },
    {
      k: "write",
      setup: listImport,
      body: md(
        "Write `csv`, which joins a list of words with commas and no extra spaces.",
        "",
        "```",
        "csv [\"tea\", \"cake\", \"jam\"]  ==  \"tea,cake,jam\"",
        "```",
      ),
      starter: hs`csv :: [String] -> String
csv ws = undefined
`,
      tests: [
        { expr: `csv ["tea", "cake", "jam"]`, expected: `"tea,cake,jam"` },
        { expr: "csv []", expected: `""` },
        { expr: `csv ["only"]`, expected: `"only"` },
        { expr: `csv ["a", "a"]`, expected: `"a,a"` },
      ],
      hint: "`intercalate \",\" ws` from `Data.List`. As a fold: `foldr glue \"\" ws` needs a helper so you do not put a comma after the last word; `intercalate` is the clean tool.",
      solution: hs`csv :: [String] -> String
csv ws = intercalate "," ws
`,
    },
    {
      k: "write",
      body: "Write `orAll`, which is `True` if any element of a list of Bools is `True`. Use `foldr`. The answer for `[]` is `False`.",
      starter: hs`orAll :: [Bool] -> Bool
orAll bs = undefined
`,
      tests: [
        { expr: "orAll [False, True, False]", expected: "True" },
        { expr: "orAll []", expected: "False" },
        { expr: "orAll [False]", expected: "False" },
        { expr: "orAll [True, True]", expected: "True" },
        { expr: "orAll [False, False, False]", expected: "False" },
      ],
      hint: "`foldr (||) False bs`. That is how `or` is defined.",
      solution: hs`orAll :: [Bool] -> Bool
orAll bs = foldr (||) False bs
`,
      banned: ["or", "any"],
    },
    {
      k: "write",
      body: "A library fine list is in pence. Write `waiveSmall`, which replaces every fine under 50 with 0 and leaves the rest unchanged.",
      starter: hs`waiveSmall :: [Int] -> [Int]
waiveSmall fines = undefined
`,
      tests: [
        { expr: "waiveSmall [20, 50, 80]", expected: "[0, 50, 80]" },
        { expr: "waiveSmall []", expected: "[]" },
        { expr: "waiveSmall [49]", expected: "[0]" },
        { expr: "waiveSmall [0, 0, 100]", expected: "[0, 0, 100]" },
      ],
      hint: "`map (\\f -> if f < 50 then 0 else f) fines`.",
      solution: hs`waiveSmall :: [Int] -> [Int]
waiveSmall fines = map (\f -> if f < 50 then 0 else f) fines
`,
    },
    {
      k: "write",
      body: md(
        "Write `halves`, which keeps only the even numbers and halves each of them (using `div`).",
        "",
        "```",
        "halves [1, 4, 6, 7]  ==  [2, 3]",
        "```",
      ),
      starter: hs`halves :: [Int] -> [Int]
halves xs = undefined
`,
      tests: [
        { expr: "halves [1, 4, 6, 7]", expected: "[2, 3]" },
        { expr: "halves []", expected: "[]" },
        { expr: "halves [2]", expected: "[1]" },
        { expr: "halves [1, 3]", expected: "[]" },
        { expr: "halves [8, 8, 0]", expected: "[4, 4, 0]" },
      ],
      hint: "`[div x 2 | x <- xs, even x]`.",
      solution: hs`halves :: [Int] -> [Int]
halves xs = [div x 2 | x <- xs, even x]
`,
    },
    {
      k: "predict",
      expr: "map (not . (== 0)) [0, 2, 0]",
      answer: "[False, True, False]",
      why: "`.` does `(== 0)` first, then `not`. So 0 becomes `True` then `False`; 2 becomes `False` then `True`.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 3: Stretch
// ---------------------------------------------------------------------------

const level3: DrillSet = {
  id: "b-hof-l3",
  lesson: "",
  level: 3,
  title: "Level 3: Stretch",
  intro: md(
    "These mix two or three tools, and they care about empty lists, missing values and duplicates. A small helper with a clear name often beats one long line.",
    "",
    "```",
    "loudAt :: [Int] -> [Int]",
    "loudAt vols = [i | (i, v) <- zip [0 ..] vols, v >= 80]",
    "```",
  ),
  drills: [
    {
      k: "predict",
      expr: "[x + y | x <- [10, 20], y <- [1, 2]]",
      answer: "[11, 12, 21, 22]",
      why: "Two generators try every pair. The later generator `y` changes fastest: 10 with 1 then 2, then 20 with 1 then 2.",
    },
    {
      k: "write",
      body: md(
        "A mark sheet is a list of `(name, mark)` pairs. Write `passingNames`, the names of students with a mark of 40 or more, in sheet order.",
        "",
        "```",
        "passingNames [(\"Ann\", 72), (\"Bo\", 39)]  ==  [\"Ann\"]",
        "```",
      ),
      starter: hs`passingNames :: [(String, Int)] -> [String]
passingNames sheet = undefined
`,
      tests: [
        { expr: `passingNames [("Ann", 72), ("Bo", 39), ("Cy", 40)]`, expected: `["Ann", "Cy"]` },
        { expr: "passingNames []", expected: "[]" },
        { expr: `passingNames [("Di", 18)]`, expected: "[]" },
        { expr: `passingNames [("Ed", 40), ("Ed", 90)]`, expected: `["Ed", "Ed"]`, label: "duplicate names both kept" },
        { expr: `passingNames [("Fay", 100)]`, expected: `["Fay"]` },
      ],
      hint: "`[n | (n, m) <- sheet, m >= 40]`. That is cleaner here than `map fst . filter ...`.",
      solution: hs`passingNames :: [(String, Int)] -> [String]
passingNames sheet = [n | (n, m) <- sheet, m >= 40]
`,
    },
    {
      k: "write",
      body: "A cafe records drink prices in pence. Write `billWithVat`, which adds 20 percent to each price (`div (p * 6) 5`) and then totals them.",
      starter: hs`billWithVat :: [Int] -> Int
billWithVat prices = undefined
`,
      tests: [
        { expr: "billWithVat [100, 50]", expected: "180" },
        { expr: "billWithVat []", expected: "0" },
        { expr: "billWithVat [5]", expected: "6" },
        { expr: "billWithVat [0, 10, 10]", expected: "24" },
      ],
      hint: "`sum (map (\\p -> div (p * 6) 5) prices)`, or a comprehension inside `sum`.",
      solution: hs`billWithVat :: [Int] -> Int
billWithVat prices = sum [div (p * 6) 5 | p <- prices]
`,
    },
    {
      k: "quiz",
      q: md(
        "What is the difference between these two?",
        "",
        "```",
        "foldr  (-) 0 [8, 3, 1]     -- 8 - (3 - (1 - 0))",
        "foldl' (-) 0 [8, 3, 1]     -- ((0 - 8) - 3) - 1",
        "```",
      ),
      options: [
        "`foldr` gives 6 and `foldl'` gives `-12`",
        "They give the same answer, because `-` is associative",
        "`foldr` gives `-12` and `foldl'` gives 6",
        "Both crash: `-` is not allowed in a fold",
      ],
      answer: 0,
      why: "`-` is not associative, so left and right bracketing disagree. `1 - 0` is 1, `3 - 1` is 2, `8 - 2` is 6. From the left: `0 - 8` is `-8`, minus 3 is `-11`, minus 1 is `-12`.",
    },
    {
      k: "write",
      body: md(
        "A bus logs scheduled minutes and actual minutes for the same stops. Write `lateStops`, the stop indexes (from 0) where the bus was strictly late.",
        "",
        "```",
        "lateStops [10, 20, 30] [10, 25, 29]  ==  [1]",
        "```",
      ),
      starter: hs`lateStops :: [Int] -> [Int] -> [Int]
lateStops scheduled actual = undefined
`,
      tests: [
        { expr: "lateStops [10, 20, 30] [10, 25, 29]", expected: "[1]" },
        { expr: "lateStops [] []", expected: "[]" },
        { expr: "lateStops [5] [6]", expected: "[0]" },
        { expr: "lateStops [5, 10] [5, 10]", expected: "[]", label: "on time is not late" },
        { expr: "lateStops [1, 2, 3] [9, 9]", expected: "[0, 1]", label: "stops at the shorter list" },
      ],
      hint: "Zip the three streams: indexes, scheduled, actual. Keep `i` when `a > s`.",
      solution: hs`lateStops :: [Int] -> [Int] -> [Int]
lateStops scheduled actual =
  [i | (i, s, a) <- zip3 [0 ..] scheduled actual, a > s]
`,
    },
    {
      k: "write",
      body: md(
        "A cafe sells teas and cakes. Write `combos`, every pair of one tea price with one cake price, teas changing slowest.",
        "",
        "```",
        "combos [200, 250] [80]  ==  [(200, 80), (250, 80)]",
        "```",
      ),
      starter: hs`combos :: [Int] -> [Int] -> [(Int, Int)]
combos teas cakes = undefined
`,
      tests: [
        { expr: "combos [200, 250] [80, 90]", expected: "[(200, 80), (200, 90), (250, 80), (250, 90)]" },
        { expr: "combos [] [80]", expected: "[]" },
        { expr: "combos [200] []", expected: "[]" },
        { expr: "combos [150] [40]", expected: "[(150, 40)]" },
        { expr: "combos [1, 1] [2]", expected: "[(1, 2), (1, 2)]" },
      ],
      hint: "`[(t, c) | t <- teas, c <- cakes]`. The first generator changes slowest.",
      solution: hs`combos :: [Int] -> [Int] -> [(Int, Int)]
combos teas cakes = [(t, c) | t <- teas, c <- cakes]
`,
    },
    {
      k: "predict",
      expr: "foldl' (-) 0 [8, 3, 1]",
      answer: "-12",
      why: "Left to right: `((0 - 8) - 3) - 1` is `-12`.",
    },
    {
      k: "write",
      body: md(
        "Write `loudAt`, which gives the indexes (from 0) where a volume reading is at least 80.",
        "",
        "```",
        "loudAt [10, 80, 90, 20]  ==  [1, 2]",
        "```",
      ),
      starter: hs`loudAt :: [Int] -> [Int]
loudAt vols = undefined
`,
      tests: [
        { expr: "loudAt [10, 80, 90, 20]", expected: "[1, 2]" },
        { expr: "loudAt []", expected: "[]" },
        { expr: "loudAt [80]", expected: "[0]" },
        { expr: "loudAt [0, 10, 79]", expected: "[]" },
        { expr: "loudAt [80, 80]", expected: "[0, 1]" },
      ],
      hint: "`[i | (i, v) <- zip [0 ..] vols, v >= 80]`.",
      solution: hs`loudAt :: [Int] -> [Int]
loudAt vols = [i | (i, v) <- zip [0 ..] vols, v >= 80]
`,
    },
    {
      k: "write",
      body: md(
        "A shopping bag is a list of lines, each a list of item names. Write `flatBag`, one list of every item, bag order, line order.",
        "",
        "```",
        "flatBag [[\"tea\", \"milk\"], [\"jam\"]]  ==  [\"tea\", \"milk\", \"jam\"]",
        "```",
      ),
      starter: hs`flatBag :: [[String]] -> [String]
flatBag bags = undefined
`,
      tests: [
        { expr: `flatBag [["tea", "milk"], ["jam"]]`, expected: `["tea", "milk", "jam"]` },
        { expr: "flatBag []", expected: "[]" },
        { expr: `flatBag [[], ["egg"]]`, expected: `["egg"]` },
        { expr: `flatBag [["a"], ["a", "b"]]`, expected: `["a", "a", "b"]` },
        { expr: `flatBag [["only"]]`, expected: `["only"]` },
      ],
      hint: "`concatMap id bags`, or `concat bags`, or `[item | line <- bags, item <- line]`.",
      solution: hs`flatBag :: [[String]] -> [String]
flatBag bags = concatMap id bags
`,
    },
    {
      k: "write",
      body: md(
        "The recursive `keepPos` is:",
        "",
        "```",
        "keepPos [] = []",
        "keepPos (x : xs)",
        "  | x > 0     = x : keepPos xs",
        "  | otherwise = keepPos xs",
        "```",
        "",
        "Write `keepPos` as a `foldr`. Do not use `filter`.",
      ),
      starter: hs`keepPos :: [Int] -> [Int]
keepPos xs = undefined
`,
      tests: [
        { expr: "keepPos [3, -1, 0, 4]", expected: "[3, 4]" },
        { expr: "keepPos []", expected: "[]" },
        { expr: "keepPos [-5]", expected: "[]" },
        { expr: "keepPos [1, 1, -1]", expected: "[1, 1]" },
      ],
      hint: "`foldr (\\x acc -> if x > 0 then x : acc else acc) [] xs`. The lambda is the body of the recursive case; `[]` is the base case.",
      solution: hs`keepPos :: [Int] -> [Int]
keepPos xs = foldr (\x acc -> if x > 0 then x : acc else acc) [] xs
`,
      banned: ["filter"],
    },
    {
      k: "write",
      body: md(
        "The recursive `addOne` is:",
        "",
        "```",
        "addOne []     = []",
        "addOne (x:xs) = (x + 1) : addOne xs",
        "```",
        "",
        "Write `addOne` as a `foldr`. Do not use `map`.",
      ),
      starter: hs`addOne :: [Int] -> [Int]
addOne xs = undefined
`,
      tests: [
        { expr: "addOne [4, 5, 6]", expected: "[5, 6, 7]" },
        { expr: "addOne []", expected: "[]" },
        { expr: "addOne [-1]", expected: "[0]" },
        { expr: "addOne [0, 0]", expected: "[1, 1]" },
      ],
      hint: "`foldr (\\x acc -> (x + 1) : acc) [] xs`.",
      solution: hs`addOne :: [Int] -> [Int]
addOne xs = foldr (\x acc -> (x + 1) : acc) [] xs
`,
      banned: ["map"],
    },
    {
      k: "quiz",
      q: "You need the first index of a value in a list. Why is `zip [0 ..] xs` safe even though `[0 ..]` never ends?",
      options: [
        "`zip` stops when the shorter list (`xs`) runs out, so the rest of `[0 ..]` is never built",
        "GHC secretly caps `[0 ..]` at the length of `xs`",
        "It is not safe: the program loops forever",
        "Comprehensions always take the first 100 elements of an infinite list",
      ],
      answer: 0,
      why: "`zip` pairs until either list ends. Laziness means the unused tail of `[0 ..]` is never demanded. (This is about `zip` itself, not a special rule for comprehensions.)",
    },
    {
      k: "write",
      body: "Write `countMatching p xs`, which counts how many elements pass the test `p`. Use composition or `filter` and `length`.",
      starter: hs`countMatching :: (a -> Bool) -> [a] -> Int
countMatching p xs = undefined
`,
      tests: [
        { expr: "countMatching even [1, 2, 3, 4, 4]", expected: "3" },
        { expr: "countMatching even []", expected: "0" },
        { expr: `countMatching (== 'a') "banana"`, expected: "3" },
        { expr: "countMatching (> 9) [1, 2]", expected: "0" },
        { expr: "countMatching (const True) [0]", expected: "1" },
      ],
      hint: "`length (filter p xs)`, or `(length . filter p) xs`.",
      solution: hs`countMatching :: (a -> Bool) -> [a] -> Int
countMatching p xs = length (filter p xs)
`,
    },
    {
      k: "write",
      body: "Write `allSame xs`, which is `True` when every element equals the first one. The empty list is `True`. A one-element list is `True`.",
      starter: hs`allSame :: Eq a => [a] -> Bool
allSame xs = undefined
`,
      tests: [
        { expr: `allSame "aaa"`, expected: "True" },
        { expr: "allSame ([] :: [Int])", expected: "True" },
        { expr: "allSame [7 :: Int]", expected: "True" },
        { expr: `allSame "aba"`, expected: "False" },
        { expr: "allSame [2, 2, 2, 1 :: Int]", expected: "False" },
      ],
      hint: "`all (== head xs) xs` fails on `[]` because of `head`. Pattern match: `allSame [] = True` and `allSame (x : ys) = all (== x) ys`.",
      solution: hs`allSame :: Eq a => [a] -> Bool
allSame [] = True
allSame (x : ys) = all (== x) ys
`,
    },
    {
      k: "write",
      setup: hs`type Track = (String, String, Int)
-- title, artist, seconds

mix :: [Track]
mix = [ ("Slow", "Ada", 90)
      , ("Run",  "Bo",  180)
      , ("Wait", "Ada", 40)
      , ("Go",   "Ada", 200)
      ]
`,
      body: md(
        "A playlist is a list of `(title, artist, seconds)`. Write `artistTime name tracks`, the total seconds of tracks by that artist.",
        "",
        "```",
        "artistTime \"Ada\" mix  ==  330",
        "```",
      ),
      starter: hs`artistTime :: String -> [Track] -> Int
artistTime name tracks = undefined
`,
      tests: [
        { expr: `artistTime "Ada" mix`, expected: "330" },
        { expr: `artistTime "Cy" mix`, expected: "0", label: "missing artist" },
        { expr: `artistTime "Ada" []`, expected: "0" },
        { expr: `artistTime "Bo" mix`, expected: "180" },
        { expr: `artistTime "Ada" [("x", "Ada", 1), ("y", "Ada", 1)]`, expected: "2" },
      ],
      hint: "`sum [secs | (_, a, secs) <- tracks, a == name]`.",
      solution: hs`artistTime :: String -> [Track] -> Int
artistTime name tracks = sum [secs | (_, a, secs) <- tracks, a == name]
`,
    },
    {
      k: "write",
      body: md(
        "Write `warmingDays`, which counts how many times a temperature goes **up** from one day to the next.",
        "",
        "```",
        "warmingDays [10, 12, 9, 15]  ==  2",
        "```",
      ),
      starter: hs`warmingDays :: [Int] -> Int
warmingDays temps = undefined
`,
      tests: [
        { expr: "warmingDays [10, 12, 9, 15]", expected: "2" },
        { expr: "warmingDays []", expected: "0" },
        { expr: "warmingDays [5]", expected: "0" },
        { expr: "warmingDays [3, 3, 3]", expected: "0", label: "flat is not up" },
        { expr: "warmingDays [1, 2, 3, 4]", expected: "3" },
      ],
      hint: "`zipWith` the list with its tail: `zipWith (<) temps (drop 1 temps)` gives a list of Bools; count the `True`s with `length (filter id ...)` or `length [() | True <- ...]`.",
      solution: hs`warmingDays :: [Int] -> Int
warmingDays temps = length [() | True <- zipWith (<) temps (drop 1 temps)]
`,
    },
    {
      k: "write",
      setup: hs`type Line = (String, Int, Int)
-- item, unit price in pence, quantity
`,
      body: md(
        "A receipt is a list of `(item, price, qty)` lines. Write `lineTotals`, each line's `price * qty`, and `paid`, the sum of those totals. Skip lines whose quantity is 0.",
        "",
        "```",
        "lineTotals [(\"tea\", 200, 2), (\"jam\", 80, 0)]  ==  [400]",
        "```",
      ),
      starter: hs`lineTotals :: [Line] -> [Int]
lineTotals basket = undefined

paid :: [Line] -> Int
paid basket = undefined
`,
      tests: [
        { expr: `lineTotals [("tea", 200, 2), ("jam", 80, 0)]`, expected: "[400]" },
        { expr: "lineTotals []", expected: "[]" },
        { expr: `lineTotals [("a", 10, 1)]`, expected: "[10]" },
        { expr: `paid [("tea", 200, 2), ("jam", 80, 3)]`, expected: "640" },
        { expr: "paid []", expected: "0" },
        { expr: `paid [("x", 5, 0), ("y", 5, 0)]`, expected: "0" },
      ],
      hint: "`lineTotals` is `[p * q | (_, p, q) <- basket, q > 0]`. `paid` is `sum` of that.",
      solution: hs`lineTotals :: [Line] -> [Int]
lineTotals basket = [p * q | (_, p, q) <- basket, q > 0]

paid :: [Line] -> Int
paid basket = sum (lineTotals basket)
`,
    },
    {
      k: "write",
      body: md(
        "Write a helper `isWarm :: Int -> Bool` that is `True` for 16 or more, then write `warmCount` using it. Do not copy the number 16 into `warmCount`.",
      ),
      starter: hs`isWarm :: Int -> Bool
isWarm t = undefined

warmCount :: [Int] -> Int
warmCount temps = undefined
`,
      tests: [
        { expr: "isWarm 16", expected: "True" },
        { expr: "isWarm 15", expected: "False" },
        { expr: "warmCount [10, 16, 21, 4]", expected: "2" },
        { expr: "warmCount []", expected: "0" },
        { expr: "warmCount [16, 16]", expected: "2" },
      ],
      hint: "`isWarm t = t >= 16`. Then `warmCount temps = length (filter isWarm temps)`.",
      solution: hs`isWarm :: Int -> Bool
isWarm t = t >= 16

warmCount :: [Int] -> Int
warmCount temps = length (filter isWarm temps)
`,
    },
    {
      k: "write",
      body: md(
        "Write `dropEvery k xs`, which drops the elements whose index (from 0) is a multiple of `k`. You may assume `k > 0`. Index 0 is a multiple of `k`, so the first element is always dropped.",
        "",
        "```",
        "dropEvery 3 [0, 1, 2, 3, 4, 5]  ==  [1, 2, 4, 5]",
        "```",
      ),
      starter: hs`dropEvery :: Int -> [a] -> [a]
dropEvery k xs = undefined
`,
      tests: [
        { expr: "dropEvery 3 [0, 1, 2, 3, 4, 5 :: Int]", expected: "[1, 2, 4, 5]" },
        { expr: "dropEvery 2 ([] :: [Int])", expected: "[]" },
        { expr: "dropEvery 5 [9 :: Int]", expected: "[]" },
        { expr: `dropEvery 1 "abcd"`, expected: `""`, label: "every index is a multiple of 1" },
        { expr: "dropEvery 4 [1, 1, 1, 1, 1 :: Int]", expected: "[1, 1, 1]" },
      ],
      hint: "`[x | (i, x) <- zip [0 ..] xs, mod i k /= 0]`.",
      solution: hs`dropEvery :: Int -> [a] -> [a]
dropEvery k xs = [x | (i, x) <- zip [0 ..] xs, mod i k /= 0]
`,
    },
    {
      k: "predict",
      expr: "concatMap (\\x -> [x, x + 1]) [10, 20]",
      answer: "[10, 11, 20, 21]",
      why: "Each element becomes two: 10 becomes `[10, 11]`, 20 becomes `[20, 21]`. `concatMap` joins those lists.",
    },
    {
      k: "write",
      body: md(
        "A cafe offers drink sizes and syrups. Write `menuPrices`, every total `drink + syrup` that is at most `limit`, drinks changing slowest.",
        "",
        "```",
        "menuPrices 300 [200, 250] [40, 80]  ==  [240, 280, 290]",
        "```",
      ),
      starter: hs`menuPrices :: Int -> [Int] -> [Int] -> [Int]
menuPrices limit drinks syrups = undefined
`,
      tests: [
        { expr: "menuPrices 300 [200, 250] [40, 80]", expected: "[240, 280, 290]" },
        { expr: "menuPrices 100 [200] [40]", expected: "[]" },
        { expr: "menuPrices 50 [] [10]", expected: "[]" },
        { expr: "menuPrices 50 [10] []", expected: "[]" },
        { expr: "menuPrices 20 [10, 10] [5]", expected: "[15, 15]" },
      ],
      hint: "`[d + s | d <- drinks, s <- syrups, d + s <= limit]`.",
      solution: hs`menuPrices :: Int -> [Int] -> [Int] -> [Int]
menuPrices limit drinks syrups =
  [d + s | d <- drinks, s <- syrups, d + s <= limit]
`,
    },
    {
      k: "write",
      body: md(
        "Write `firstPositive xs`, `Just` the first number bigger than 0, or `Nothing` if there isn't one.",
      ),
      starter: hs`firstPositive :: [Int] -> Maybe Int
firstPositive xs = undefined
`,
      tests: [
        { expr: "firstPositive [-2, 0, 5, 9]", expected: "Just 5" },
        { expr: "firstPositive []", expected: "Nothing" },
        { expr: "firstPositive [4]", expected: "Just 4" },
        { expr: "firstPositive [0, -1]", expected: "Nothing" },
        { expr: "firstPositive [1, 1, 1]", expected: "Just 1" },
      ],
      hint: "`case filter (> 0) xs of [] -> Nothing; (x : _) -> Just x`.",
      solution: hs`firstPositive :: [Int] -> Maybe Int
firstPositive xs =
  case filter (> 0) xs of
    []      -> Nothing
    (x : _) -> Just x
`,
    },
    {
      k: "write",
      body: md(
        "A warehouse has `stock :: [String]` and a pick list `want :: [String]`. Write `missing`, the names on the pick list that are not in stock, in pick-list order. Keep duplicates from `want` if that name is missing.",
      ),
      starter: hs`missing :: [String] -> [String] -> [String]
missing stock want = undefined
`,
      tests: [
        { expr: `missing ["tea", "jam"] ["jam", "egg", "tea"]`, expected: `["egg"]` },
        { expr: `missing [] ["tea"]`, expected: `["tea"]` },
        { expr: `missing ["tea"] []`, expected: "[]" },
        { expr: `missing ["tea"] ["tea"]`, expected: "[]" },
        { expr: `missing ["a"] ["b", "b"]`, expected: `["b", "b"]` },
      ],
      hint: "`[w | w <- want, not (elem w stock)]`.",
      solution: hs`missing :: [String] -> [String] -> [String]
missing stock want = [w | w <- want, not (elem w stock)]
`,
    },
    {
      k: "write",
      body: md(
        "Write `rowMaxes`, which maps `maximum` over a list of non-empty rows. Then write `gridMax`, the largest number in the whole grid. You may assume every row is non-empty and the grid is non-empty for `gridMax`.",
      ),
      starter: hs`rowMaxes :: [[Int]] -> [Int]
rowMaxes rows = undefined

gridMax :: [[Int]] -> Int
gridMax rows = undefined
`,
      tests: [
        { expr: "rowMaxes [[1, 9, 3], [4, 0]]", expected: "[9, 4]" },
        { expr: "rowMaxes [[7]]", expected: "[7]" },
        { expr: "rowMaxes [[1, 1], [1, 1]]", expected: "[1, 1]" },
        { expr: "gridMax [[1, 9, 3], [4, 0]]", expected: "9" },
        { expr: "gridMax [[-5], [-1, -8]]", expected: "-1" },
      ],
      hint: "`rowMaxes = map maximum`. `gridMax rows = maximum (rowMaxes rows)`.",
      solution: hs`rowMaxes :: [[Int]] -> [Int]
rowMaxes rows = map maximum rows

gridMax :: [[Int]] -> Int
gridMax rows = maximum (rowMaxes rows)
`,
    },
    {
      k: "quiz",
      q: "You want one number: the total of a list of prices. Which tool is the cleanest?",
      options: [
        "`foldr (+) 0` (or `sum`)",
        "`map`",
        "`filter`",
        "A comprehension with two generators",
      ],
      answer: 0,
      why: "`map` and `filter` still give a list. Two generators make combinations. A fold (or `sum`) is the tool that squashes a list into one value.",
    },
    {
      k: "write",
      setup: charImport,
      body: md(
        "Write `slug`, which lower-cases a title and keeps only letters and digits, turning every other character into `'-'`. Then drop dashes from both ends by using `dropWhile` twice (once on the reverse).",
        "",
        "```",
        "slug \"Hi, World!\"  ==  \"hi-world\"",
        "```",
        "",
        "You may leave inner runs of dashes as a single dash: collapse them with `group` or a small helper. A simple version that maps each character and then collapses dashes is fine.",
      ),
      starter: hs`slug :: String -> String
slug s = undefined
`,
      tests: [
        { expr: `slug "Hi, World!"`, expected: `"hi-world"` },
        { expr: `slug ""`, expected: `""` },
        { expr: `slug "A"`, expected: `"a"` },
        { expr: `slug "--OK--"`, expected: `"ok"` },
        { expr: `slug "a  b"`, expected: `"a-b"` },
        { expr: `slug "Book!"`, expected: `"book"`, label: "double letters are kept" },
      ],
      hint: "Map each character: letters/digits go to lower case, everything else becomes `'-'`. Collapse only runs of dashes (do not squash double letters), then trim dashes from both ends with `dropWhile`.",
      solution: hs`slug :: String -> String
slug s = trim (collapse (map ch s))
  where
    ch c | isAlpha c || isDigit c = toLower c
         | otherwise              = '-'
    collapse [] = []
    collapse (c : cs)
      | c == '-'  = '-' : collapse (dropWhile (== '-') cs)
      | otherwise = c : collapse cs
    trim = dropWhile (== '-') . reverse . dropWhile (== '-') . reverse
`,
    },
    {
      k: "write",
      body: md(
        "Write `joinWith sep xs`, which puts `sep` between the strings. No separator at the start or end.",
        "",
        "```",
        "joinWith \" | \" [\"Ayr\", \"Troon\", \"Irvine\"]  ==  \"Ayr | Troon | Irvine\"",
        "```",
      ),
      starter: hs`joinWith :: String -> [String] -> String
joinWith sep xs = undefined
`,
      tests: [
        { expr: `joinWith " | " ["Ayr", "Troon", "Irvine"]`, expected: `"Ayr | Troon | Irvine"` },
        { expr: `joinWith "," []`, expected: `""` },
        { expr: `joinWith "," ["only"]`, expected: `"only"` },
        { expr: `joinWith "-" ["a", "a"]`, expected: `"a-a"` },
      ],
      hint: "`foldr` needs care on the last element. Cleanest: `intercalate sep xs`. By hand: `case xs of [] -> \"\"; (y : ys) -> y ++ concatMap (sep ++) ys`.",
      solution: hs`joinWith :: String -> [String] -> String
joinWith _ [] = ""
joinWith sep (y : ys) = y ++ concatMap (sep ++) ys
`,
    },
    {
      k: "write",
      body: md(
        "Three judges score each routine. Write `panel`, which zips the three lists into triples and then, for each triple, keeps the middle value after sorting the three scores (the median).",
        "",
        "```",
        "panel [1, 9] [5, 6] [8, 7]  ==  [5, 7]",
        "```",
      ),
      starter: hs`panel :: [Int] -> [Int] -> [Int] -> [Int]
panel as bs cs = undefined
`,
      tests: [
        { expr: "panel [1, 9] [5, 6] [8, 7]", expected: "[5, 7]" },
        { expr: "panel [] [] []", expected: "[]" },
        { expr: "panel [4] [4] [4]", expected: "[4]" },
        { expr: "panel [10, 1, 2] [0, 1] [5, 1, 9]", expected: "[5, 1]", label: "stops at the shortest list" },
      ],
      hint: "`zip3` then `map` a tiny `median [x, y, z] = sort [x, y, z] !! 1`. You will need `import Data.List (sort)` in the solution.",
      solution: hs`import Data.List (sort)

panel :: [Int] -> [Int] -> [Int] -> [Int]
panel as bs cs = map median (zip3 as bs cs)
  where
    median (x, y, z) = sort [x, y, z] !! 1
`,
    },
    {
      k: "write",
      body: md(
        "Write `replaceAt i y xs`, which puts `y` at index `i` (from 0) and leaves the rest of the list as it is. If `i` is not a valid index, the list is unchanged. Use `zip [0 ..]`, not recursion on `i`.",
      ),
      starter: hs`replaceAt :: Int -> a -> [a] -> [a]
replaceAt i y xs = undefined
`,
      tests: [
        { expr: `replaceAt 1 'X' "abc"`, expected: `"aXc"` },
        { expr: `replaceAt 0 'X' "abc"`, expected: `"Xbc"` },
        { expr: `replaceAt 3 'X' "abc"`, expected: `"abc"`, label: "index off the end" },
        { expr: `replaceAt (-1) 'X' "abc"`, expected: `"abc"` },
        { expr: "replaceAt 0 9 ([] :: [Int])", expected: "[]" },
        { expr: "replaceAt 0 5 [1, 1 :: Int]", expected: "[5, 1]" },
      ],
      hint: "`[if k == i then y else x | (k, x) <- zip [0 ..] xs]`. Invalid `i` never matches, so the list comes back unchanged.",
      solution: hs`replaceAt :: Int -> a -> [a] -> [a]
replaceAt i y xs = [if k == i then y else x | (k, x) <- zip [0 ..] xs]
`,
    },
    {
      k: "write",
      body: md(
        "A garden log is rainfall per day. Write `wetSpell mm`, the length of the longest run of strictly positive readings. The empty list gives 0.",
        "",
        "Use `foldr` (or `foldl'`) with a pair `(current, best)`, not a hand-written recursive helper if you can avoid it.",
      ),
      starter: hs`wetSpell :: [Int] -> Int
wetSpell mm = undefined
`,
      tests: [
        { expr: "wetSpell [0, 2, 3, 0, 4]", expected: "2" },
        { expr: "wetSpell []", expected: "0" },
        { expr: "wetSpell [0]", expected: "0" },
        { expr: "wetSpell [1, 1, 1]", expected: "3" },
        { expr: "wetSpell [5, 0, 1, 1, 1, 0]", expected: "3" },
      ],
      hint: "`foldl' step (0, 0) mm`, where `step (cur, best) n` resets `cur` to 0 on a dry day and otherwise does `let cur' = cur + 1 in (cur', max cur' best)`. Then take `snd`.",
      solution: hs`wetSpell :: [Int] -> Int
wetSpell mm = snd (foldl' step (0, 0) mm)
  where
    step (cur, best) n
      | n > 0     = let cur' = cur + 1 in (cur', max cur' best)
      | otherwise = (0, best)
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 4: Exam strength
// ---------------------------------------------------------------------------

const playlistSetup = hs`type Title  = String
type Artist = String
type Secs   = Int
type Track  = (Title, Artist, Secs)

setlist :: [Track]
setlist = [ ("Slow",  "Ada", 90)
          , ("Run",   "Bo",  180)
          , ("Wait",  "Ada", 40)
          , ("Go",    "Ada", 200)
          , ("Night", "Bo",  30)
          ]
`;

const playlistBlock = [
  "```",
  "type Track = (Title, Artist, Secs)",
  "",
  "setlist =",
  "  [ (\"Slow\",  \"Ada\", 90)",
  "  , (\"Run\",   \"Bo\",  180)",
  "  , (\"Wait\",  \"Ada\", 40)",
  "  , (\"Go\",    \"Ada\", 200)",
  "  , (\"Night\", \"Bo\",  30)",
  "  ]",
  "```",
];

const weatherSetup = hs`type Day  = String
type C    = Int
type Log  = [(Day, C)]

week :: Log
week = [("Mon", 9), ("Tue", 16), ("Wed", 12), ("Thu", 19), ("Fri", 19)]
`;

const weatherBlock = [
  "```",
  "type Log = [(Day, C)]",
  "",
  "week = [(\"Mon\", 9), (\"Tue\", 16), (\"Wed\", 12), (\"Thu\", 19), (\"Fri\", 19)]",
  "```",
];

const shopSetup = hs`type Item  = String
type Pence = Int
type Qty   = Int
type Line  = (Item, Pence, Qty)

basket :: [Line]
basket = [("tea", 180, 2), ("cake", 250, 1), ("jam", 90, 0), ("tea", 180, 1)]
`;

const shopBlock = [
  "```",
  "type Line = (Item, Pence, Qty)",
  "",
  "basket = [(\"tea\", 180, 2), (\"cake\", 250, 1), (\"jam\", 90, 0), (\"tea\", 180, 1)]",
  "```",
];

const trainSetup = hs`import Data.List (nub)

type Station = String
type Mins    = Int
type Leg     = (Station, Station, Mins)

coast :: [Leg]
coast = [ ("Ayr", "Troon", 12)
        , ("Troon", "Irvine", 8)
        , ("Irvine", "Kilwinning", 6)
        , ("Kilwinning", "Largs", 25)
        ]
`;

const trainBlock = [
  "```",
  "type Leg = (Station, Station, Mins)",
  "",
  "coast =",
  "  [ (\"Ayr\", \"Troon\", 12)",
  "  , (\"Troon\", \"Irvine\", 8)",
  "  , (\"Irvine\", \"Kilwinning\", 6)",
  "  , (\"Kilwinning\", \"Largs\", 25)",
  "  ]",
  "```",
];

const gradeSetup = hs`type Name = String
type Mark = Int
type Row  = (Name, [Mark])

cohort :: [Row]
cohort = [ ("Ann", [72, 40, 81])
         , ("Bo",  [39, 38, 40])
         , ("Cy",  [90])
         , ("Di",  [])
         ]
`;

const gradeBlock = [
  "```",
  "type Row = (Name, [Mark])",
  "",
  "cohort =",
  "  [ (\"Ann\", [72, 40, 81])",
  "  , (\"Bo\",  [39, 38, 40])",
  "  , (\"Cy\",  [90])",
  "  , (\"Di\",  [])",
  "  ]",
  "```",
];

const ferrySetup = hs`type Port = String
type Mins = Int
type Trip = (Port, Port, Mins)

sailings :: [Trip]
sailings = [ ("Wemyss", "Rothesay", 35)
           , ("Rothesay", "Wemyss", 35)
           , ("Wemyss", "Tarbert", 80)
           , ("Gourock", "Dunoon", 20)
           ]
`;

const hotelSetup = hs`type Room   = String
type Pence  = Int
type Nights = Int
type Booked = (Room, Pence, Nights, Bool)  -- Bool: True means weekend rate

stay :: [Booked]
stay = [ ("12", 8000, 2, False)
       , ("14", 8000, 1, True)
       , ("9",  5000, 0, False)
       , ("3",  5000, 3, True)
       ]
`;

const raceSetup = hs`type Rider = String
type Split = Int  -- seconds from the start
type Card  = (Rider, [Split])

field :: [Card]
field = [ ("Ann", [120, 250, 400])
        , ("Bo",  [110, 240, 390])
        , ("Cy",  [130])
        , ("Di",  [])
        ]
`;

const orchardSetup = hs`import Data.List (nub)

type Tree  = String
type Count = Int
type Pick  = (Tree, Count)

picks :: [Pick]
picks = [("pear", 4), ("apple", 0), ("pear", 2), ("plum", 5), ("apple", 3)]
`;

const gymSetup = hs`type Kind    = String
type Minutes = Int
type Visit   = (Kind, Minutes)

weekGym :: [Visit]
weekGym = [("run", 30), ("swim", 45), ("run", 20), ("yoga", 60), ("run", 0)]
`;

const level4: DrillSet = {
  id: "b-hof-l4",
  lesson: "",
  level: 4,
  title: "Level 4: Exam strength",
  intro: md(
    "These are worded like the real papers: a short story, a type, then **Define a function** and a GHCi transcript. Prefer `map`, `filter`, `foldr` and comprehensions to hand-written recursion. The last eight questions are as hard as a 3–5 mark paper question.",
    "",
    "```",
    "ghci> keepCheap 200 [150, 400, 90]",
    "[150,90]",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: "You have `marks :: [(String, Int)]` and you want the names of people who scored at least 40. Which is the cleanest?",
      options: [
        "`[n | (n, m) <- marks, m >= 40]`",
        "A recursive function with three equations and a helper accumulator",
        "`foldl' (\\acc (n, m) -> n : acc) [] marks`",
        "`zipWith const (map fst marks) (map snd marks)`",
      ],
      answer: 0,
      why: "A comprehension takes each pair apart and filters in one line. The fold reverses the names and ignores the mark. The recursive version works but is more than this job needs.",
    },
    {
      k: "predict",
      expr: "[(a, b) | a <- [1, 2], b <- [1, 2], a < b]",
      answer: "[(1, 2)]",
      why: "Every pair is tried, then the filter `a < b` keeps only `(1, 2)`. `(1,1)`, `(2,1)` and `(2,2)` fail.",
    },
    {
      k: "quiz",
      q: "A function walks a list and returns **one** `Int`. Which tool should you reach for first?",
      options: [
        "`foldr` (or a specialised fold such as `sum`, `length`, `maximum`)",
        "`map`",
        "`zipWith`",
        "A comprehension with two generators",
      ],
      answer: 0,
      why: "`map` and `zipWith` still give lists. Two generators give combinations. A fold is the standard way to turn a list into one value.",
    },
    {
      k: "predict",
      expr: "foldr (\\x acc -> x + 1 : acc) [] [7, 8]",
      answer: "[8, 9]",
      why: "This is `map (+ 1)` written as a fold: each `x` becomes `x + 1` on the front of the answer for the rest.",
    },
    {
      k: "write",
      body: md(
        "A hat stall lists prices in pence.",
        "",
        "Define a function `keepCheap :: Int -> [Int] -> [Int]` that keeps the prices strictly under the given limit. For example:",
        "",
        "```",
        "ghci> keepCheap 200 [150, 400, 90]",
        "[150,90]",
        "ghci> keepCheap 50 []",
        "[]",
        "```",
      ),
      starter: hs`keepCheap :: Int -> [Int] -> [Int]
keepCheap limit prices = undefined
`,
      tests: [
        { expr: "keepCheap 200 [150, 400, 90]", expected: "[150, 90]" },
        { expr: "keepCheap 50 []", expected: "[]" },
        { expr: "keepCheap 100 [100]", expected: "[]" },
        { expr: "keepCheap 10 [3, 3, 20]", expected: "[3, 3]" },
      ],
      hint: "`filter (< limit) prices`.",
      solution: hs`keepCheap :: Int -> [Int] -> [Int]
keepCheap limit prices = filter (< limit) prices
`,
    },
    {
      k: "write",
      setup: weatherSetup,
      body: md(
        "A weather station logs `(day, celsius)` pairs. The given code contains:",
        "",
        ...weatherBlock,
        "",
        "Define a function `warmDays :: C -> Log -> [Day]` that returns the days whose temperature is at least the given threshold, in log order. For example:",
        "",
        "```",
        "ghci> warmDays 16 week",
        "[\"Tue\",\"Thu\",\"Fri\"]",
        "ghci> warmDays 30 week",
        "[]",
        "```",
      ),
      starter: hs`warmDays :: C -> Log -> [Day]
warmDays threshold log = undefined
`,
      tests: [
        { expr: "warmDays 16 week", expected: `["Tue", "Thu", "Fri"]` },
        { expr: "warmDays 30 week", expected: "[]" },
        { expr: "warmDays 0 []", expected: "[]" },
        { expr: "warmDays 19 week", expected: `["Thu", "Fri"]` },
        { expr: `warmDays 10 [("Mon", 10)]`, expected: `["Mon"]` },
      ],
      hint: "`[d | (d, c) <- log, c >= threshold]`.",
      solution: hs`warmDays :: C -> Log -> [Day]
warmDays threshold log = [d | (d, c) <- log, c >= threshold]
`,
    },
    {
      k: "write",
      setup: playlistSetup,
      body: md(
        "A playlist is a list of tracks. The given code contains:",
        "",
        ...playlistBlock,
        "",
        "Define a function `titlesBy :: Artist -> [Track] -> [Title]` that returns the titles by that artist, in playlist order. For example:",
        "",
        "```",
        "ghci> titlesBy \"Ada\" setlist",
        "[\"Slow\",\"Wait\",\"Go\"]",
        "ghci> titlesBy \"Cy\" setlist",
        "[]",
        "```",
      ),
      starter: hs`titlesBy :: Artist -> [Track] -> [Title]
titlesBy who tracks = undefined
`,
      tests: [
        { expr: `titlesBy "Ada" setlist`, expected: `["Slow", "Wait", "Go"]` },
        { expr: `titlesBy "Cy" setlist`, expected: "[]" },
        { expr: `titlesBy "Ada" []`, expected: "[]" },
        { expr: `titlesBy "Bo" setlist`, expected: `["Run", "Night"]` },
      ],
      hint: "`[t | (t, a, _) <- tracks, a == who]`.",
      solution: hs`titlesBy :: Artist -> [Track] -> [Title]
titlesBy who tracks = [t | (t, a, _) <- tracks, a == who]
`,
    },
    {
      k: "write",
      setup: shopSetup,
      body: md(
        "A shop receipt is a list of lines. The given code contains:",
        "",
        ...shopBlock,
        "",
        "Define a function `quantities :: Item -> [Line] -> Int` that returns how many of that item were bought, adding up every matching line. A missing item gives 0. For example:",
        "",
        "```",
        "ghci> quantities \"tea\" basket",
        "3",
        "ghci> quantities \"soup\" basket",
        "0",
        "```",
      ),
      starter: hs`quantities :: Item -> [Line] -> Int
quantities item lines = undefined
`,
      tests: [
        { expr: `quantities "tea" basket`, expected: "3" },
        { expr: `quantities "soup" basket`, expected: "0" },
        { expr: `quantities "jam" basket`, expected: "0", label: "qty 0 still totals 0" },
        { expr: `quantities "tea" []`, expected: "0" },
        { expr: `quantities "cake" basket`, expected: "1" },
      ],
      hint: "`sum [q | (i, _, q) <- lines, i == item]`.",
      solution: hs`quantities :: Item -> [Line] -> Int
quantities item lines = sum [q | (i, _, q) <- lines, i == item]
`,
    },
    {
      k: "write",
      setup: trainSetup,
      body: md(
        "A rail route is a list of legs. The given code contains:",
        "",
        ...trainBlock,
        "",
        "Define a function `minutesFrom :: Station -> [Leg] -> [Mins]` that returns the journey times of legs that **leave** the given station, in route order. For example:",
        "",
        "```",
        "ghci> minutesFrom \"Troon\" coast",
        "[8]",
        "ghci> minutesFrom \"Oban\" coast",
        "[]",
        "```",
      ),
      starter: hs`minutesFrom :: Station -> [Leg] -> [Mins]
minutesFrom st legs = undefined
`,
      tests: [
        { expr: `minutesFrom "Troon" coast`, expected: "[8]" },
        { expr: `minutesFrom "Oban" coast`, expected: "[]" },
        { expr: `minutesFrom "Ayr" []`, expected: "[]" },
        { expr: `minutesFrom "Ayr" coast`, expected: "[12]" },
        { expr: `minutesFrom "Largs" coast`, expected: "[]", label: "terminus: no leg leaves" },
      ],
      hint: "`[m | (from, _, m) <- legs, from == st]`.",
      solution: hs`minutesFrom :: Station -> [Leg] -> [Mins]
minutesFrom st legs = [m | (from, _, m) <- legs, from == st]
`,
    },
    {
      k: "write",
      setup: gradeSetup,
      body: md(
        "A gradebook is a list of rows. The given code contains:",
        "",
        ...gradeBlock,
        "",
        "Define a function `nMarked :: [Row] -> [Int]` that returns, for each student, how many marks they have. For example:",
        "",
        "```",
        "ghci> nMarked cohort",
        "[3,3,1,0]",
        "```",
      ),
      starter: hs`nMarked :: [Row] -> [Int]
nMarked rows = undefined
`,
      tests: [
        { expr: "nMarked cohort", expected: "[3, 3, 1, 0]" },
        { expr: "nMarked []", expected: "[]" },
        { expr: `nMarked [("Ed", [1, 1])]`, expected: "[2]" },
        { expr: `nMarked [("Fay", [])]`, expected: "[0]" },
      ],
      hint: "`map (length . snd) rows`.",
      solution: hs`nMarked :: [Row] -> [Int]
nMarked rows = map (length . snd) rows
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `zipDiff :: [Int] -> [Int] -> [Int]` that subtracts pairwise: each result is an element of the second list minus the matching element of the first. Stop at the shorter list. For example:",
        "",
        "```",
        "ghci> zipDiff [10, 20, 30] [12, 18]",
        "[2,-2]",
        "```",
      ),
      starter: hs`zipDiff :: [Int] -> [Int] -> [Int]
zipDiff xs ys = undefined
`,
      tests: [
        { expr: "zipDiff [10, 20, 30] [12, 18]", expected: "[2, -2]" },
        { expr: "zipDiff [] [1]", expected: "[]" },
        { expr: "zipDiff [4] []", expected: "[]" },
        { expr: "zipDiff [5] [5]", expected: "[0]" },
        { expr: "zipDiff [1, 1] [3, 3, 9]", expected: "[2, 2]" },
      ],
      hint: "`zipWith (\\x y -> y - x) xs ys`. The section `subtract` also works: `zipWith subtract xs ys` because `subtract x y` is `y - x`.",
      solution: hs`zipDiff :: [Int] -> [Int] -> [Int]
zipDiff xs ys = zipWith (\x y -> y - x) xs ys
`,
    },
    {
      k: "write",
      setup: gymSetup,
      body: md(
        "A gym log is a list of `(kind, minutes)` visits.",
        "",
        "```",
        "weekGym = [(\"run\", 30), (\"swim\", 45), (\"run\", 20), (\"yoga\", 60), (\"run\", 0)]",
        "```",
        "",
        "Define a function `minsOf :: Kind -> [Visit] -> Int` that totals the minutes of one kind of visit. For example:",
        "",
        "```",
        "ghci> minsOf \"run\" weekGym",
        "50",
        "ghci> minsOf \"bike\" weekGym",
        "0",
        "```",
      ),
      starter: hs`minsOf :: Kind -> [Visit] -> Int
minsOf kind visits = undefined
`,
      tests: [
        { expr: `minsOf "run" weekGym`, expected: "50" },
        { expr: `minsOf "bike" weekGym`, expected: "0" },
        { expr: `minsOf "run" []`, expected: "0" },
        { expr: `minsOf "yoga" weekGym`, expected: "60" },
        { expr: `minsOf "swim" weekGym`, expected: "45" },
      ],
      hint: "`sum [m | (k, m) <- visits, k == kind]`.",
      solution: hs`minsOf :: Kind -> [Visit] -> Int
minsOf kind visits = sum [m | (k, m) <- visits, k == kind]
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `flattenPairs :: [(a, a)] -> [a]` that turns a list of pairs into one list, first then second of each pair. For example:",
        "",
        "```",
        "ghci> flattenPairs [(1, 2), (3, 4)]",
        "[1,2,3,4]",
        "```",
      ),
      starter: hs`flattenPairs :: [(a, a)] -> [a]
flattenPairs ps = undefined
`,
      tests: [
        { expr: "flattenPairs [(1, 2), (3, 4 :: Int)]", expected: "[1, 2, 3, 4]" },
        { expr: "flattenPairs ([] :: [(Int, Int)])", expected: "[]" },
        { expr: "flattenPairs [(7, 7 :: Int)]", expected: "[7, 7]" },
        { expr: `flattenPairs [('a', 'a'), ('b', 'c')]`, expected: `"aabc"` },
      ],
      hint: "`concatMap (\\(x, y) -> [x, y]) ps`.",
      solution: hs`flattenPairs :: [(a, a)] -> [a]
flattenPairs ps = concatMap (\(x, y) -> [x, y]) ps
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `countTrue :: [Bool] -> Int` that counts how many elements are `True`, written as a `foldr`. Do not use `filter`, `length` or `sum`. For example:",
        "",
        "```",
        "ghci> countTrue [False, True, True]",
        "2",
        "```",
      ),
      starter: hs`countTrue :: [Bool] -> Int
countTrue bs = undefined
`,
      tests: [
        { expr: "countTrue [False, True, True]", expected: "2" },
        { expr: "countTrue []", expected: "0" },
        { expr: "countTrue [False]", expected: "0" },
        { expr: "countTrue [True, True, True]", expected: "3" },
      ],
      hint: "`foldr (\\b n -> if b then n + 1 else n) 0 bs`.",
      solution: hs`countTrue :: [Bool] -> Int
countTrue bs = foldr (\b n -> if b then n + 1 else n) 0 bs
`,
      banned: ["filter", "length", "sum"],
    },
    {
      k: "write",
      setup: orchardSetup,
      body: md(
        "An orchard records `(tree, count)` picks, in the order the fruit was picked.",
        "",
        "```",
        "picks = [(\"pear\", 4), (\"apple\", 0), (\"pear\", 2), (\"plum\", 5), (\"apple\", 3)]",
        "```",
        "",
        "Define a function `picked :: Tree -> [Pick] -> Int` that totals the count for one kind of tree. Then define `kinds :: [Pick] -> [Tree]` that lists each tree name that has a **positive** total, in the order the name first appears. For example:",
        "",
        "```",
        "ghci> picked \"pear\" picks",
        "6",
        "ghci> kinds picks",
        "[\"pear\",\"apple\",\"plum\"]",
        "```",
      ),
      starter: hs`picked :: Tree -> [Pick] -> Int
picked tree ps = undefined

kinds :: [Pick] -> [Tree]
kinds ps = undefined
`,
      tests: [
        { expr: `picked "pear" picks`, expected: "6" },
        { expr: `picked "fig" picks`, expected: "0" },
        { expr: `picked "apple" []`, expected: "0" },
        { expr: "kinds picks", expected: `["pear", "apple", "plum"]` },
        { expr: "kinds []", expected: "[]" },
        { expr: `kinds [("oak", 0)]`, expected: "[]" },
      ],
      hint: "`picked` is a filtered `sum`. For `kinds`, take first-seen names with a comprehension and `notElem` on the answer so far, **or** `nub` of `[t | (t, n) <- ps, picked t ps > 0]` — but `nub` after a filter on totals is cleaner if you first collect unique names.",
      solution: hs`picked :: Tree -> [Pick] -> Int
picked tree ps = sum [n | (t, n) <- ps, t == tree]

kinds :: [Pick] -> [Tree]
kinds ps = nub [t | (t, _) <- ps, picked t ps > 0]
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `padRight n xs` that appends copies of the last element until the list has length `n`. If `xs` is already of length `n` or more, return the first `n` elements. If `xs` is empty, the result is empty (there is no last element to copy). You may assume `n >= 0`. For example:",
        "",
        "```",
        "ghci> padRight 5 [1, 2, 3]",
        "[1,2,3,3,3]",
        "ghci> padRight 2 [1, 2, 3]",
        "[1,2]",
        "```",
      ),
      starter: hs`padRight :: Int -> [a] -> [a]
padRight n xs = undefined
`,
      tests: [
        { expr: "padRight 5 [1, 2, 3 :: Int]", expected: "[1, 2, 3, 3, 3]" },
        { expr: "padRight 2 [1, 2, 3 :: Int]", expected: "[1, 2]" },
        { expr: "padRight 3 ([] :: [Int])", expected: "[]" },
        { expr: "padRight 0 [1, 2 :: Int]", expected: "[]" },
        { expr: "padRight 4 [9 :: Int]", expected: "[9, 9, 9, 9]" },
      ],
      hint: "If `xs` is empty, `[]`. Otherwise `take n (xs ++ repeat (last xs))`.",
      solution: hs`padRight :: Int -> [a] -> [a]
padRight _ [] = []
padRight n xs = take n (xs ++ repeat (last xs))
`,
    },
    {
      k: "write",
      setup: ferrySetup,
      body: md(
        "A ferry company lists trips as `(from, to, minutes)`.",
        "",
        "```",
        "sailings =",
        "  [ (\"Wemyss\", \"Rothesay\", 35)",
        "  , (\"Rothesay\", \"Wemyss\", 35)",
        "  , (\"Wemyss\", \"Tarbert\", 80)",
        "  , (\"Gourock\", \"Dunoon\", 20)",
        "  ]",
        "```",
        "",
        "Define a function `fromPort :: Port -> [Trip] -> [(Port, Mins)]` that returns each destination reachable **directly** from the given port, paired with the time, in table order. For example:",
        "",
        "```",
        "ghci> fromPort \"Wemyss\" sailings",
        "[(\"Rothesay\",35),(\"Tarbert\",80)]",
        "ghci> fromPort \"Dunoon\" sailings",
        "[]",
        "```",
      ),
      starter: hs`fromPort :: Port -> [Trip] -> [(Port, Mins)]
fromPort p trips = undefined
`,
      tests: [
        { expr: `fromPort "Wemyss" sailings`, expected: `[("Rothesay", 35), ("Tarbert", 80)]` },
        { expr: `fromPort "Dunoon" sailings`, expected: "[]" },
        { expr: `fromPort "Wemyss" []`, expected: "[]" },
        { expr: `fromPort "Gourock" sailings`, expected: `[("Dunoon", 20)]` },
        { expr: `fromPort "Rothesay" sailings`, expected: `[("Wemyss", 35)]` },
      ],
      hint: "`[(to, m) | (from, to, m) <- trips, from == p]`.",
      solution: hs`fromPort :: Port -> [Trip] -> [(Port, Mins)]
fromPort p trips = [(to, m) | (from, to, m) <- trips, from == p]
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `applyAt :: (a -> a) -> [Int] -> [a] -> [a]` such that `applyAt f is xs` uses `f` on the elements of `xs` whose index is listed in `is`, and leaves the others unchanged. Indexes that are out of range are ignored. For example:",
        "",
        "```",
        "ghci> applyAt (*10) [0, 2] [1, 2, 3, 4]",
        "[10,2,30,4]",
        "ghci> applyAt (*10) [9] [1, 2]",
        "[1,2]",
        "```",
      ),
      starter: hs`applyAt :: (a -> a) -> [Int] -> [a] -> [a]
applyAt f is xs = undefined
`,
      tests: [
        { expr: "applyAt (* 10) [0, 2] [1, 2, 3, 4 :: Int]", expected: "[10, 2, 30, 4]" },
        { expr: "applyAt (* 10) [9] [1, 2 :: Int]", expected: "[1, 2]" },
        { expr: "applyAt (* 10) [] [1, 2 :: Int]", expected: "[1, 2]" },
        { expr: "applyAt (* 10) [0] ([] :: [Int])", expected: "[]" },
        { expr: "applyAt (* 10) [0, 0, 1] [3, 4 :: Int]", expected: "[30, 40]", label: "duplicate indexes still apply once per position" },
      ],
      hint: "`[if elem i is then f x else x | (i, x) <- zip [0 ..] xs]`.",
      solution: hs`applyAt :: (a -> a) -> [Int] -> [a] -> [a]
applyAt f is xs = [if elem i is then f x else x | (i, x) <- zip [0 ..] xs]
`,
    },
    {
      k: "write",
      body: md(
        "Define a function `runningMax :: Ord a => [a] -> [a]` that replaces each element with the largest value seen so far, from the left. For example:",
        "",
        "```",
        "ghci> runningMax [3, 1, 4, 2]",
        "[3,3,4,4]",
        "```",
      ),
      starter: hs`runningMax :: Ord a => [a] -> [a]
runningMax xs = undefined
`,
      tests: [
        { expr: "runningMax [3, 1, 4, 2 :: Int]", expected: "[3, 3, 4, 4]" },
        { expr: "runningMax ([] :: [Int])", expected: "[]" },
        { expr: "runningMax [5 :: Int]", expected: "[5]" },
        { expr: "runningMax [2, 2, 2 :: Int]", expected: "[2, 2, 2]" },
        { expr: `runningMax "bca"`, expected: `"bcc"` },
      ],
      hint: "`scanl1 max xs`. If you do not want `scanl1`, a `foldl'` that builds the reversed answer and then `reverse` works: at each step the new max is `max x soFar`.",
      solution: hs`runningMax :: Ord a => [a] -> [a]
runningMax xs = scanl1 max xs
`,
    },
    {
      k: "write",
      setup: playlistSetup,
      body: md(
        "Using the playlist types:",
        "",
        ...playlistBlock,
        "",
        "Define a function `longBy :: Artist -> Secs -> [Track] -> [Title]` that returns titles by that artist which last **strictly more** than the given number of seconds, in playlist order. For example:",
        "",
        "```",
        "ghci> longBy \"Ada\" 50 setlist",
        "[\"Slow\",\"Go\"]",
        "```",
      ),
      starter: hs`longBy :: Artist -> Secs -> [Track] -> [Title]
longBy who n tracks = undefined
`,
      tests: [
        { expr: `longBy "Ada" 50 setlist`, expected: `["Slow", "Go"]` },
        { expr: `longBy "Ada" 500 setlist`, expected: "[]" },
        { expr: `longBy "Cy" 0 setlist`, expected: "[]" },
        { expr: `longBy "Bo" 30 setlist`, expected: `["Run"]` },
        { expr: `longBy "Ada" 0 []`, expected: "[]" },
      ],
      hint: "`[t | (t, a, s) <- tracks, a == who, s > n]`.",
      solution: hs`longBy :: Artist -> Secs -> [Track] -> [Title]
longBy who n tracks = [t | (t, a, s) <- tracks, a == who, s > n]
`,
    },
    {
      k: "write",
      setup: gradeSetup,
      body: md(
        "Using the gradebook:",
        "",
        ...gradeBlock,
        "",
        "Define a function `meanOf :: Name -> [Row] -> Maybe Int` that returns the whole-number mean (`div (sum marks) (length marks)`) of that student's marks, or `Nothing` if the student is missing or has no marks. For example:",
        "",
        "```",
        "ghci> meanOf \"Ann\" cohort",
        "Just 64",
        "ghci> meanOf \"Di\" cohort",
        "Nothing",
        "```",
      ),
      starter: hs`meanOf :: Name -> [Row] -> Maybe Int
meanOf name rows = undefined
`,
      tests: [
        { expr: `meanOf "Ann" cohort`, expected: "Just 64" },
        { expr: `meanOf "Di" cohort`, expected: "Nothing" },
        { expr: `meanOf "Ed" cohort`, expected: "Nothing" },
        { expr: `meanOf "Cy" cohort`, expected: "Just 90" },
        { expr: `meanOf "Ann" []`, expected: "Nothing" },
      ],
      hint: "`case lookup name rows of Just (m : ms) -> Just (div (sum (m : ms)) (length (m : ms))); _ -> Nothing`.",
      solution: hs`meanOf :: Name -> [Row] -> Maybe Int
meanOf name rows =
  case lookup name rows of
    Just (m : ms) -> Just (div (sum (m : ms)) (length (m : ms)))
    _             -> Nothing
`,
    },
    {
      k: "write",
      setup: trainSetup,
      body: md(
        "Using the rail route:",
        "",
        ...trainBlock,
        "",
        "Define a function `arrivals :: Station -> [Leg] -> [Station]` that returns the stations with a **direct** leg **into** the given station, in route order. Then define `hubs :: [Leg] -> [Station]` as the stations that appear as a destination at least twice (duplicates in `hubs` should be removed, first-seen order). For example:",
        "",
        "```",
        "ghci> arrivals \"Irvine\" coast",
        "[\"Troon\"]",
        "ghci> hubs (coast ++ [(\"Largs\", \"Troon\", 20)])",
        "[\"Troon\"]",
        "```",
      ),
      starter: hs`arrivals :: Station -> [Leg] -> [Station]
arrivals st legs = undefined

hubs :: [Leg] -> [Station]
hubs legs = undefined
`,
      tests: [
        { expr: `arrivals "Irvine" coast`, expected: `["Troon"]` },
        { expr: `arrivals "Ayr" coast`, expected: "[]" },
        { expr: `arrivals "Troon" []`, expected: "[]" },
        { expr: `hubs (coast ++ [("Largs", "Troon", 20)])`, expected: `["Troon"]` },
        { expr: "hubs coast", expected: "[]" },
        { expr: "hubs []", expected: "[]" },
      ],
      hint: "`arrivals` is `[from | (from, to, _) <- legs, to == st]`. For `hubs`, take destination names with `nub` and keep those whose `length (arrivals to legs) >= 2`.",
      solution: hs`arrivals :: Station -> [Leg] -> [Station]
arrivals st legs = [from | (from, to, _) <- legs, to == st]

hubs :: [Leg] -> [Station]
hubs legs = [to | to <- nub [t | (_, t, _) <- legs], length (arrivals to legs) >= 2]
`,
    },
    // --- last 8: 3-5 mark hardness ---
    {
      k: "write",
      setup: shopSetup,
      body: md(
        "Using the shop receipt:",
        "",
        ...shopBlock,
        "",
        "Define a function `bill :: [Line] -> Pence` that totals `price * qty` over every line. Then define `discounted :: Pence -> [Line] -> Pence` that applies a 10 percent discount (`div (10 * total) 9` is wrong; take `total - div total 10`) when the bill is at least the given threshold, and otherwise returns the bill unchanged. Lines with quantity 0 add nothing. For example:",
        "",
        "```",
        "ghci> bill basket",
        "790",
        "ghci> discounted 500 basket",
        "711",
        "ghci> discounted 9999 basket",
        "790",
        "```",
        "",
        "[3 marks]",
      ),
      starter: hs`bill :: [Line] -> Pence
bill lines = undefined

discounted :: Pence -> [Line] -> Pence
discounted threshold lines = undefined
`,
      tests: [
        { expr: "bill basket", expected: "790" },
        { expr: "bill []", expected: "0" },
        { expr: `bill [("x", 50, 0)]`, expected: "0" },
        { expr: "discounted 500 basket", expected: "711" },
        { expr: "discounted 9999 basket", expected: "790" },
        { expr: "discounted 0 []", expected: "0" },
      ],
      hint: "`bill lines = sum [p * q | (_, p, q) <- lines]`. For `discounted`, compute `t = bill lines`; if `t >= threshold` then `t - div t 10`, else `t`.",
      solution: hs`bill :: [Line] -> Pence
bill lines = sum [p * q | (_, p, q) <- lines]

discounted :: Pence -> [Line] -> Pence
discounted threshold lines
  | t >= threshold = t - div t 10
  | otherwise      = t
  where
    t = bill lines
`,
    },
    {
      k: "write",
      setup: gradeSetup,
      body: md(
        "Using the gradebook:",
        "",
        ...gradeBlock,
        "",
        "Define a function `dropLowest :: [Mark] -> [Mark]` that removes one copy of the smallest mark and keeps the rest in the original order. An empty list stays empty. Then define `adjusted :: [Row] -> [(Name, Int)]` that pairs each student who still has at least one mark after dropping the lowest with the `sum` of what remains. Students with nothing left are left out. For example:",
        "",
        "```",
        "ghci> dropLowest [72, 40, 81]",
        "[72,81]",
        "ghci> adjusted cohort",
        "[(\"Ann\",153),(\"Bo\",79)]",
        "```",
        "",
        "[4 marks]",
      ),
      starter: hs`dropLowest :: [Mark] -> [Mark]
dropLowest ms = undefined

adjusted :: [Row] -> [(Name, Int)]
adjusted rows = undefined
`,
      tests: [
        { expr: "dropLowest [72, 40, 81]", expected: "[72, 81]" },
        { expr: "dropLowest []", expected: "[]" },
        { expr: "dropLowest [5]", expected: "[]" },
        { expr: "dropLowest [2, 2, 5]", expected: "[2, 5]", label: "only one of the duplicates is dropped" },
        { expr: "adjusted cohort", expected: `[("Ann", 153), ("Bo", 79)]` },
        { expr: "adjusted []", expected: "[]" },
        { expr: `adjusted [("Ed", [])]`, expected: "[]" },
        { expr: `adjusted [("Cy", [90])]`, expected: "[]", label: "a single mark is dropped, so nothing remains" },
      ],
      hint: "For `dropLowest`, if the list is empty give `[]`. Otherwise find `m = minimum ms` and drop the first `m` with a fold or `delete` from `Data.List`. For `adjusted`, map each row through `dropLowest` and keep those whose remainder is not null.",
      solution: hs`import Data.List (delete)

dropLowest :: [Mark] -> [Mark]
dropLowest [] = []
dropLowest ms = delete (minimum ms) ms

adjusted :: [Row] -> [(Name, Int)]
adjusted rows = [(n, sum rest) | (n, ms) <- rows, let rest = dropLowest ms, not (null rest)]
`,
    },
    {
      k: "write",
      setup: weatherSetup,
      body: md(
        "Using the weather log:",
        "",
        ...weatherBlock,
        "",
        "Define a function `jumps :: Log -> [(Day, Day, C)]` that walks consecutive days and, for each step up or down, records `(yesterday, today, today - yesterday)`. Then define `firstFrost :: Log -> Maybe Day` as the first day whose temperature is 0 or below, or `Nothing`. For example:",
        "",
        "```",
        "ghci> jumps week",
        "[(\"Mon\",\"Tue\",7),(\"Tue\",\"Wed\",-4),(\"Wed\",\"Thu\",7),(\"Thu\",\"Fri\",0)]",
        "ghci> firstFrost [(\"Sat\", 2), (\"Sun\", 0)]",
        "Just \"Sun\"",
        "```",
        "",
        "[4 marks]",
      ),
      starter: hs`jumps :: Log -> [(Day, Day, C)]
jumps log = undefined

firstFrost :: Log -> Maybe Day
firstFrost log = undefined
`,
      tests: [
        { expr: "jumps week", expected: `[("Mon", "Tue", 7), ("Tue", "Wed", -4), ("Wed", "Thu", 7), ("Thu", "Fri", 0)]` },
        { expr: "jumps []", expected: "[]" },
        { expr: `jumps [("Mon", 5)]`, expected: "[]" },
        { expr: `firstFrost [("Sat", 2), ("Sun", 0)]`, expected: `Just "Sun"` },
        { expr: "firstFrost week", expected: "Nothing" },
        { expr: "firstFrost []", expected: "Nothing" },
      ],
      hint: "`jumps` zips the log with its tail: `zipWith (\\(d1, c1) (d2, c2) -> (d1, d2, c2 - c1)) log (drop 1 log)`. For `firstFrost`, take the first matching day from a comprehension.",
      solution: hs`jumps :: Log -> [(Day, Day, C)]
jumps log =
  zipWith (\(d1, c1) (d2, c2) -> (d1, d2, c2 - c1)) log (drop 1 log)

firstFrost :: Log -> Maybe Day
firstFrost log =
  case [d | (d, c) <- log, c <= 0] of
    []      -> Nothing
    (d : _) -> Just d
`,
    },
    {
      k: "write",
      setup: hotelSetup,
      body: md(
        "A hotel records bookings as `(room, nightlyPrice, nights, weekend)`.",
        "",
        "```",
        "type Booked = (Room, Pence, Nights, Bool)",
        "stay = [(\"12\", 8000, 2, False), (\"14\", 8000, 1, True), (\"9\", 5000, 0, False), (\"3\", 5000, 3, True)]",
        "```",
        "",
        "A weekend booking adds a 25 percent surcharge on the nightly price (`div (p * 5) 4`) before multiplying by the number of nights. Bookings of 0 nights cost 0.",
        "",
        "Define `costOf` for one booking and `stayTotal` for the whole list. Then define `occupied` as the room numbers with at least one night, in booking order. For example:",
        "",
        "```",
        "ghci> costOf (\"14\", 8000, 1, True)",
        "10000",
        "ghci> stayTotal stay",
        "44750",
        "ghci> occupied stay",
        "[\"12\",\"14\",\"3\"]",
        "```",
        "",
        "[4 marks]",
      ),
      starter: hs`costOf :: Booked -> Pence
costOf b = undefined

stayTotal :: [Booked] -> Pence
stayTotal bs = undefined

occupied :: [Booked] -> [Room]
occupied bs = undefined
`,
      tests: [
        { expr: `costOf ("14", 8000, 1, True)`, expected: "10000" },
        { expr: `costOf ("12", 8000, 2, False)`, expected: "16000" },
        { expr: `costOf ("9", 5000, 0, False)`, expected: "0" },
        { expr: "stayTotal stay", expected: "44750" },
        { expr: "stayTotal []", expected: "0" },
        { expr: "occupied stay", expected: `["12", "14", "3"]` },
        { expr: "occupied []", expected: "[]" },
      ],
      hint: "`costOf (_, p, n, w) = n * (if w then div (p * 5) 4 else p)`. `stayTotal = sum . map costOf`. `occupied = [r | (r, _, n, _) <- bs, n > 0]`. Check: 16000 + 10000 + 0 + 3 * 6250 = 44750.",
      solution: hs`costOf :: Booked -> Pence
costOf (_, p, n, w) = n * (if w then div (p * 5) 4 else p)

stayTotal :: [Booked] -> Pence
stayTotal bs = sum (map costOf bs)

occupied :: [Booked] -> [Room]
occupied bs = [r | (r, _, n, _) <- bs, n > 0]
`,
    },
    {
      k: "write",
      setup: raceSetup,
      body: md(
        "A time trial records each rider with a list of split times in seconds from the start, in order.",
        "",
        "```",
        "type Card = (Rider, [Split])",
        "field = [(\"Ann\", [120, 250, 400]), (\"Bo\", [110, 240, 390]), (\"Cy\", [130]), (\"Di\", [])]",
        "```",
        "",
        "Define `lapTimes :: [Split] -> [Int]` that turns splits into per-lap times (the first lap is the first split; later laps are the difference from the previous split). Then define `winner :: [Card] -> Maybe Rider` as the rider with the smallest **last** split among riders who **finished**: they have as many splits as the longest card in the field. If nobody finished, return `Nothing`. If two finishers tie, keep the one who appears first. For example:",
        "",
        "```",
        "ghci> lapTimes [120, 250, 400]",
        "[120,130,150]",
        "ghci> winner field",
        "Just \"Bo\"",
        "```",
        "",
        "[5 marks]",
      ),
      starter: hs`lapTimes :: [Split] -> [Int]
lapTimes splits = undefined

winner :: [Card] -> Maybe Rider
winner cards = undefined
`,
      tests: [
        { expr: "lapTimes [120, 250, 400]", expected: "[120, 130, 150]" },
        { expr: "lapTimes []", expected: "[]" },
        { expr: "lapTimes [50]", expected: "[50]" },
        { expr: "winner field", expected: `Just "Bo"` },
        { expr: "winner []", expected: "Nothing" },
        { expr: `winner [("Di", [])]`, expected: "Nothing" },
        { expr: `winner [("Al", [10]), ("Be", [10])]`, expected: `Just "Al"`, label: "first of a tie" },
        { expr: `winner [("Al", [12]), ("Be", [10]), ("Cy", [10])]`, expected: `Just "Be"`, label: "first of the fastest, not the last" },
      ],
      hint: "`lapTimes ss = zipWith (-) ss (0 : ss)`. For `winner`, let `n` be the longest split list. Keep only cards with `length ss == n` and `n > 0`, pair each with `last ss`, then `foldl1` so a tie keeps the earlier rider.",
      solution: hs`lapTimes :: [Split] -> [Int]
lapTimes splits = zipWith (-) splits (0 : splits)

winner :: [Card] -> Maybe Rider
winner cards =
  case [(r, last ss) | (r, ss) <- cards, n > 0, length ss == n] of
    [] -> Nothing
    xs -> Just (fst (foldl1 better xs))
  where
    n = maximum (0 : [length ss | (_, ss) <- cards])
    better (r0, t0) (r, t)
      | t < t0    = (r, t)
      | otherwise = (r0, t0)
`,
    },
    {
      k: "write",
      setup: hs`import Data.List (nub)

type Slot  = Int
type Name  = String
type Seat  = (Slot, Name)

taken :: [Seat]
taken = [(2, "Ann"), (0, "Bo"), (2, "Cy"), (5, "Di")]
`,
      body: md(
        "A cinema has seats numbered from 0. Bookings are `(slot, name)` and a slot may be listed more than once (double booked).",
        "",
        "```",
        "taken = [(2, \"Ann\"), (0, \"Bo\"), (2, \"Cy\"), (5, \"Di\")]",
        "```",
        "",
        "Define `namesIn :: Slot -> [Seat] -> [Name]` as everyone booked into that slot, in booking order. Define `freeSlots :: Int -> [Seat] -> [Slot]` as the unused slot numbers in `0 .. n - 1`. Define `doubleBooked :: [Seat] -> [Slot]` as the slots that appear more than once, each listed once, in the order they first become a duplicate. For example:",
        "",
        "```",
        "ghci> namesIn 2 taken",
        "[\"Ann\",\"Cy\"]",
        "ghci> freeSlots 6 taken",
        "[1,3,4]",
        "ghci> doubleBooked taken",
        "[2]",
        "```",
        "",
        "[5 marks]",
      ),
      starter: hs`namesIn :: Slot -> [Seat] -> [Name]
namesIn slot seats = undefined

freeSlots :: Int -> [Seat] -> [Slot]
freeSlots n seats = undefined

doubleBooked :: [Seat] -> [Slot]
doubleBooked seats = undefined
`,
      tests: [
        { expr: "namesIn 2 taken", expected: `["Ann", "Cy"]` },
        { expr: "namesIn 9 taken", expected: "[]" },
        { expr: "namesIn 0 []", expected: "[]" },
        { expr: "freeSlots 6 taken", expected: "[1, 3, 4]" },
        { expr: "freeSlots 0 taken", expected: "[]" },
        { expr: "doubleBooked taken", expected: "[2]" },
        { expr: "doubleBooked []", expected: "[]" },
        { expr: `doubleBooked [(1, "a"), (1, "b"), (1, "c")]`, expected: "[1]" },
      ],
      hint: "`namesIn` is a comprehension on the name. `freeSlots n seats = [i | i <- [0 .. n - 1], not (elem i (map fst seats))]`. For `doubleBooked`, a slot is a duplicate when `length (namesIn s seats) > 1`; list unique `fst` values in order and keep those.",
      solution: hs`namesIn :: Slot -> [Seat] -> [Name]
namesIn slot seats = [n | (s, n) <- seats, s == slot]

freeSlots :: Int -> [Seat] -> [Slot]
freeSlots n seats = [i | i <- [0 .. n - 1], not (elem i (map fst seats))]

doubleBooked :: [Seat] -> [Slot]
doubleBooked seats =
  nub [s | (s, _) <- seats, length (namesIn s seats) > 1]
`,
    },
    {
      k: "write",
      setup: hs`type Sku     = String
type OnHand  = Int
type Need    = Int
type Bin     = (Sku, OnHand)
type Order   = (Sku, Need)

warehouse :: [Bin]
warehouse = [("tea", 10), ("jam", 0), ("egg", 4), ("tea", 2)]

order :: [Order]
order = [("jam", 1), ("tea", 11), ("milk", 2), ("egg", 4)]
`,
      body: md(
        "A warehouse is a list of bins `(sku, onHand)`. The same sku may sit in several bins. An order is a list of `(sku, need)`.",
        "",
        "```",
        "warehouse = [(\"tea\", 10), (\"jam\", 0), (\"egg\", 4), (\"tea\", 2)]",
        "order     = [(\"jam\", 1), (\"tea\", 11), (\"milk\", 2), (\"egg\", 4)]",
        "```",
        "",
        "Define `stockOf` as the total on hand for one sku. Define `pickable` as the order lines we can fill in full (stock at least the need), in order-list order. Define `shortfall` as `(sku, need - have)` for lines we cannot fill, including skus that are not in the warehouse (have = 0). For example:",
        "",
        "```",
        "ghci> stockOf \"tea\" warehouse",
        "12",
        "ghci> pickable order warehouse",
        "[(\"tea\",11),(\"egg\",4)]",
        "ghci> shortfall order warehouse",
        "[(\"jam\",1),(\"milk\",2)]",
        "```",
        "",
        "[5 marks]",
      ),
      starter: hs`stockOf :: Sku -> [Bin] -> OnHand
stockOf sku bins = undefined

pickable :: [Order] -> [Bin] -> [Order]
pickable wants bins = undefined

shortfall :: [Order] -> [Bin] -> [(Sku, Int)]
shortfall wants bins = undefined
`,
      tests: [
        { expr: `stockOf "tea" warehouse`, expected: "12" },
        { expr: `stockOf "milk" warehouse`, expected: "0" },
        { expr: `stockOf "tea" []`, expected: "0" },
        { expr: "pickable order warehouse", expected: `[("tea", 11), ("egg", 4)]` },
        { expr: "pickable [] warehouse", expected: "[]" },
        { expr: "shortfall order warehouse", expected: `[("jam", 1), ("milk", 2)]` },
        { expr: "shortfall order []", expected: `[("jam", 1), ("tea", 11), ("milk", 2), ("egg", 4)]` },
      ],
      hint: "`stockOf sku bins = sum [n | (s, n) <- bins, s == sku]`. Then `pickable` keeps lines with `stockOf s bins >= need`. `shortfall` keeps the rest as `(s, need - stockOf s bins)`.",
      solution: hs`stockOf :: Sku -> [Bin] -> OnHand
stockOf sku bins = sum [n | (s, n) <- bins, s == sku]

pickable :: [Order] -> [Bin] -> [Order]
pickable wants bins = [(s, n) | (s, n) <- wants, stockOf s bins >= n]

shortfall :: [Order] -> [Bin] -> [(Sku, Int)]
shortfall wants bins =
  [(s, n - have) | (s, n) <- wants, let have = stockOf s bins, have < n]
`,
    },
    {
      k: "write",
      setup: hs`import Data.List (nub)

type From = String
type To   = String
type Body = String
type Mail = (From, To, Body)

inbox :: [Mail]
inbox = [ ("ann", "bo",  "see you at 5")
        , ("cy",  "bo",  "ok")
        , ("ann", "di",  "bring cake")
        , ("bo",  "ann", "running late")
        , ("ann", "bo",  "ps cake too")
        ]
`,
      body: md(
        "A tiny mail log is a list of `(from, to, body)` messages, oldest first.",
        "",
        "```",
        "inbox =",
        "  [ (\"ann\", \"bo\",  \"see you at 5\")",
        "  , (\"cy\",  \"bo\",  \"ok\")",
        "  , (\"ann\", \"di\",  \"bring cake\")",
        "  , (\"bo\",  \"ann\", \"running late\")",
        "  , (\"ann\", \"bo\",  \"ps cake too\")",
        "  ]",
        "```",
        "",
        "Define `toUser u` as the bodies sent **to** `u`, oldest first. Define `thread a b` as the bodies of messages that went either from `a` to `b` or from `b` to `a`, oldest first. Define `senders` as each distinct `from` address, in the order it first appears. For example:",
        "",
        "```",
        "ghci> toUser \"bo\" inbox",
        "[\"see you at 5\",\"ok\",\"ps cake too\"]",
        "ghci> thread \"ann\" \"bo\" inbox",
        "[\"see you at 5\",\"running late\",\"ps cake too\"]",
        "ghci> senders inbox",
        "[\"ann\",\"cy\",\"bo\"]",
        "```",
        "",
        "[4 marks]",
      ),
      starter: hs`toUser :: String -> [Mail] -> [Body]
toUser u ms = undefined

thread :: String -> String -> [Mail] -> [Body]
thread a b ms = undefined

senders :: [Mail] -> [From]
senders ms = undefined
`,
      tests: [
        { expr: `toUser "bo" inbox`, expected: `["see you at 5", "ok", "ps cake too"]` },
        { expr: `toUser "ed" inbox`, expected: "[]" },
        { expr: `toUser "bo" []`, expected: "[]" },
        { expr: `thread "ann" "bo" inbox`, expected: `["see you at 5", "running late", "ps cake too"]` },
        { expr: `thread "ann" "ann" inbox`, expected: "[]" },
        { expr: "senders inbox", expected: `["ann", "cy", "bo"]` },
        { expr: "senders []", expected: "[]" },
      ],
      hint: "`toUser u ms = [body | (_, to, body) <- ms, to == u]`. `thread` keeps bodies where the pair of ends is `{a, b}` as a set: `(from == a && to == b) || (from == b && to == a)`. `senders = nub (map (\\(f, _, _) -> f) ms)`.",
      solution: hs`toUser :: String -> [Mail] -> [Body]
toUser u ms = [body | (_, to, body) <- ms, to == u]

thread :: String -> String -> [Mail] -> [Body]
thread a b ms =
  [body | (from, to, body) <- ms, (from == a && to == b) || (from == b && to == a)]

senders :: [Mail] -> [From]
senders ms = nub [from | (from, _, _) <- ms]
`,
    },
  ],
};

export const book: Book = {
  id: "b-hof",
  order: 2,
  title: "map, filter, folds and comprehensions",
  blurb: "map, filter, any, all, concatMap, zipWith, lambdas, sections, composition, foldr, foldl', list comprehensions and choosing the cleanest tool.",
  sets: [level1, level2, level3, level4],
};
