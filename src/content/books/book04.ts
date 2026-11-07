import { type Book, type DrillSet, hs, md } from "../schema.ts";

const readNatSetup = hs`import Data.Char (isDigit, digitToInt)

readNat :: String -> Maybe Int
readNat s
  | not (null s) && all isDigit s = Just (foldl (\n c -> n * 10 + digitToInt c) 0 s)
  | otherwise = Nothing
`;

const splitBarSetup = hs`splitBar :: String -> [String]
splitBar s = case break (== '|') s of
  (chunk, [])       -> [chunk]
  (chunk, _ : rest) -> chunk : splitBar rest
`;

// ---------------------------------------------------------------------------
// Level 1: Warm-up
// ---------------------------------------------------------------------------

const level1: DrillSet = {
  id: "b-strings-l1",
  lesson: "",
  level: 1,
  title: "Level 1: Warm-up",
  intro: md(
    "A `String` is just a list of `Char`. That is why `map`, `filter`, `takeWhile` and friends all work on text. This level is one idea at a time: characters, `words` / `lines`, and the `Data.Char` tests. Most starters already have the shape; you fill in the right-hand sides.",
    "",
    "```",
    "\"hi\" !! 0          -- 'h'",
    "map toUpper \"hi\"   -- \"HI\"",
    "words \"  a  b \"    -- [\"a\", \"b\"]",
    "```",
  ),
  drills: [
    {
      k: "quiz",
      q: "In Haskell, what is a `String`?",
      options: [
        "A special type, unrelated to lists",
        "Another name for `[Char]`",
        "Another name for `Char`",
        "A pair of a `Char` and its length",
      ],
      answer: 1,
      why: "`type String = [Char]`. So `\"hi\"` is `'h' : 'i' : []`, and every list function works on text.",
    },
    {
      k: "predict",
      expr: `"tap" !! 2`,
      answer: "'p'",
      why: "Indexing counts from 0, so index 2 of `\"tap\"` is the last character, `'p'`.",
    },
    {
      k: "quiz",
      q: "Which of these is a `String`?",
      options: ["`'z'`", "`\"z\"`", "`z`", "`['z', 'z']` is not a String, but `'z'` is"],
      answer: 1,
      why: "Double quotes make a String (a list of characters). Single quotes make one Char. `\"z\"` is the same as `['z']`.",
    },
    {
      k: "predict",
      expr: `map toUpper "no"`,
      answer: `"NO"`,
      why: "`toUpper` turns one character into its upper-case form. `map` does that to every character.",
    },
    {
      k: "write",
      body: "Write `yell`, which turns every letter of a String to upper case. The import is there; fill in the right-hand side.",
      starter: hs`import Data.Char

yell :: String -> String
yell s = undefined
`,
      tests: [
        { expr: `yell "help"`, expected: `"HELP"` },
        { expr: `yell ""`, expected: `""` },
        { expr: `yell "OK"`, expected: `"OK"` },
        { expr: `yell "box 2"`, expected: `"BOX 2"`, label: "digits and spaces stay as they are" },
      ],
      hint: "`map toUpper s`. `toUpper` leaves digits and spaces alone.",
      solution: hs`import Data.Char

yell :: String -> String
yell s = map toUpper s
`,
    },
    {
      k: "predict",
      expr: `words "  on  off "`,
      answer: `["on", "off"]`,
      why: "`words` splits on any run of whitespace and throws the spaces away, including those at the front and the end.",
    },
    {
      k: "quiz",
      q: "What does `unwords [\"red\", \"bus\"]` give?",
      options: ["`\"redbus\"`", "`\"red bus\"`", "`\"red\\nbus\"`", "`[\"red\", \"bus\"]`"],
      answer: 1,
      why: "`unwords` joins words with a single space. It is the opposite of `words` (except that extra spaces are not put back).",
    },
    {
      k: "write",
      body: "Write `nWords`, which counts how many words are in a String. Use `words`.",
      starter: hs`nWords :: String -> Int
nWords s = undefined
`,
      tests: [
        { expr: `nWords "the red bus"`, expected: "3" },
        { expr: `nWords ""`, expected: "0" },
        { expr: `nWords "   "`, expected: "0", label: "only spaces: no words" },
        { expr: `nWords "  hi   there  "`, expected: "2" },
        { expr: `nWords "one"`, expected: "1" },
      ],
      hint: "The number of words is the length of the list that `words` gives.",
      solution: hs`nWords :: String -> Int
nWords s = length (words s)
`,
    },
    {
      k: "predict",
      expr: `lines "up\\ndown"`,
      answer: `["up", "down"]`,
      why: "`lines` splits only at newline characters. The space-free lines `up` and `down` become two strings.",
    },
    {
      k: "quiz",
      q: "What is special about `unlines [\"a\", \"b\"]`?",
      options: [
        "It is `\"a b\"`",
        "It is `\"a\\nb\"`, with no newline at the end",
        "It is `\"a\\nb\\n\"`: a newline after every line, including the last",
        "It is `\"ab\"`",
      ],
      answer: 2,
      why: "`unlines` puts a newline after each line. So the result always ends with a newline (unless the list is empty).",
    },
    {
      k: "write",
      body: "Write `nLines`, which counts how many lines `lines` finds in a String. Remember what `lines` does with the empty string and with a final newline.",
      starter: hs`nLines :: String -> Int
nLines s = undefined
`,
      tests: [
        { expr: `nLines "up\\ndown"`, expected: "2" },
        { expr: `nLines ""`, expected: "0", label: "empty text has no lines" },
        { expr: `nLines "solo"`, expected: "1" },
        { expr: `nLines "a\\n"`, expected: "1", label: "a final newline does not add an extra line" },
        { expr: `nLines "a\\n\\nb"`, expected: "3", label: "a blank line in the middle still counts" },
      ],
      hint: "`length (lines s)`. `lines \"\"` is `[]`, and `lines \"a\\n\"` is `[\"a\"]`.",
      solution: hs`nLines :: String -> Int
nLines s = length (lines s)
`,
    },
    {
      k: "predict",
      expr: `filter isDigit "a1b22"`,
      answer: `"122"`,
      why: "`isDigit` is True for `'0'` to `'9'`. `filter` keeps those characters, in order, and drops the rest.",
    },
    {
      k: "write",
      body: "Write `keepDigit`, which keeps only the digit characters of a String, in their original order.",
      starter: hs`import Data.Char

keepDigit :: String -> String
keepDigit s = undefined
`,
      tests: [
        { expr: `keepDigit "a1b22"`, expected: `"122"` },
        { expr: `keepDigit "hello"`, expected: `""` },
        { expr: `keepDigit ""`, expected: `""` },
        { expr: `keepDigit "7"`, expected: `"7"` },
        { expr: `keepDigit "room 12B"`, expected: `"12"` },
      ],
      hint: "`filter isDigit s`.",
      solution: hs`import Data.Char

keepDigit :: String -> String
keepDigit s = filter isDigit s
`,
    },
    {
      k: "predict",
      expr: `map toLower "OK"`,
      answer: `"ok"`,
      why: "`toLower` is the opposite of `toUpper`. Non-letters are left alone; here there aren't any.",
    },
    {
      k: "write",
      body: "Write `hush`, which turns every letter of a String to lower case.",
      starter: hs`import Data.Char

hush :: String -> String
hush s = undefined
`,
      tests: [
        { expr: `hush "HELP"`, expected: `"help"` },
        { expr: `hush ""`, expected: `""` },
        { expr: `hush "MiXeD"`, expected: `"mixed"` },
        { expr: `hush "Box 2"`, expected: `"box 2"` },
      ],
      hint: "`map toLower s`.",
      solution: hs`import Data.Char

hush :: String -> String
hush s = map toLower s
`,
    },
    {
      k: "write",
      body: "Write `skipPad`, which removes whitespace from the front of a String (spaces, tabs, newlines) but leaves whitespace later on.",
      starter: hs`import Data.Char

skipPad :: String -> String
skipPad s = undefined
`,
      tests: [
        { expr: `skipPad "   go now"`, expected: `"go now"` },
        { expr: `skipPad "go "`, expected: `"go "` },
        { expr: `skipPad "\\t\\nwait"`, expected: `"wait"` },
        { expr: `skipPad "   "`, expected: `""` },
        { expr: `skipPad ""`, expected: `""` },
      ],
      hint: "`dropWhile isSpace s`. `isSpace` is True for space, tab and newline.",
      solution: hs`import Data.Char

skipPad :: String -> String
skipPad s = dropWhile isSpace s
`,
    },
    {
      k: "write",
      body: "Write `leadingName`, which takes the letters at the front of a String and stops at the first non-letter. The equations are there.",
      starter: hs`import Data.Char

leadingName :: String -> String
leadingName s = undefined
`,
      tests: [
        { expr: `leadingName "Sam22"`, expected: `"Sam"` },
        { expr: `leadingName "22"`, expected: `""` },
        { expr: `leadingName "Al"`, expected: `"Al"` },
        { expr: `leadingName ""`, expected: `""` },
        { expr: `leadingName "Lab 7"`, expected: `"Lab"` },
      ],
      hint: "`takeWhile isAlpha s`.",
      solution: hs`import Data.Char

leadingName :: String -> String
leadingName s = takeWhile isAlpha s
`,
    },
    {
      k: "predict",
      expr: `takeWhile isAlpha "Lab7"`,
      answer: `"Lab"`,
      why: "`takeWhile` keeps characters from the front while the test is True. It stops at `'7'`, which is not a letter.",
    },
    {
      k: "write",
      body: "Write `dropCount`, which throws away digits at the front of a String and keeps the rest.",
      starter: hs`import Data.Char

dropCount :: String -> String
dropCount s = undefined
`,
      tests: [
        { expr: `dropCount "12cm"`, expected: `"cm"` },
        { expr: `dropCount "cm"`, expected: `"cm"` },
        { expr: `dropCount "12"`, expected: `""` },
        { expr: `dropCount ""`, expected: `""` },
        { expr: `dropCount "7th"`, expected: `"th"` },
      ],
      hint: "`dropWhile isDigit s`.",
      solution: hs`import Data.Char

dropCount :: String -> String
dropCount s = dropWhile isDigit s
`,
    },
    {
      k: "predict",
      expr: `dropWhile isDigit "12cm"`,
      answer: `"cm"`,
      why: "The digits at the front go. As soon as `'c'` fails `isDigit`, the rest of the string is returned untouched.",
    },
    {
      k: "write",
      body: "Write `headChar`, which gives `Just` the first character of a String, or `Nothing` if the String is empty.",
      starter: hs`headChar :: String -> Maybe Char
headChar s = undefined
`,
      tests: [
        { expr: `headChar "pin"`, expected: "Just 'p'" },
        { expr: `headChar ""`, expected: "Nothing" },
        { expr: `headChar "x"`, expected: "Just 'x'" },
        { expr: `headChar "  a"`, expected: "Just ' '", label: "a leading space is still a character" },
      ],
      hint: "Pattern match: `[]` is `Nothing`. `(c : _)` is `Just c`.",
      solution: hs`headChar :: String -> Maybe Char
headChar [] = Nothing
headChar (c : _) = Just c
`,
      banned: ["head", "listToMaybe"],
    },
    {
      k: "write",
      body: "Write `tallyChar c s`, which counts how many times the character `c` appears in `s`.",
      starter: hs`tallyChar :: Char -> String -> Int
tallyChar c s = undefined
`,
      tests: [
        { expr: `tallyChar 'a' "banana"`, expected: "3" },
        { expr: `tallyChar 'z' "banana"`, expected: "0" },
        { expr: `tallyChar 'a' ""`, expected: "0" },
        { expr: `tallyChar ' ' "a b c"`, expected: "2" },
      ],
      hint: "`length (filter (== c) s)`, or a list comprehension.",
      solution: hs`tallyChar :: Char -> String -> Int
tallyChar c s = length (filter (== c) s)
`,
    },
    {
      k: "write",
      body: "Write `allDigit`, which is `True` when every character of a String is a digit. The empty string counts as True (there is no counter-example).",
      starter: hs`import Data.Char

allDigit :: String -> Bool
allDigit s = undefined
`,
      tests: [
        { expr: `allDigit "2024"`, expected: "True" },
        { expr: `allDigit ""`, expected: "True", label: "vacuous: no character fails the test" },
        { expr: `allDigit "12a"`, expected: "False" },
        { expr: `allDigit "7"`, expected: "True" },
        { expr: `allDigit "12 3"`, expected: "False", label: "a space is not a digit" },
      ],
      hint: "`all isDigit s`.",
      solution: hs`import Data.Char

allDigit :: String -> Bool
allDigit s = all isDigit s
`,
    },
    {
      k: "write",
      body: "Write `glue`, which joins a list of words into one String with a single space between them.",
      starter: hs`glue :: [String] -> String
glue ws = undefined
`,
      tests: [
        { expr: `glue ["red", "bus"]`, expected: `"red bus"` },
        { expr: `glue []`, expected: `""` },
        { expr: `glue ["solo"]`, expected: `"solo"` },
        { expr: `glue ["a", "b", "c"]`, expected: `"a b c"` },
      ],
      hint: "`unwords ws`.",
      solution: hs`glue :: [String] -> String
glue ws = unwords ws
`,
    },
    {
      k: "write",
      body: "Write `toks`, which splits a String into its words.",
      starter: hs`toks :: String -> [String]
toks s = undefined
`,
      tests: [
        { expr: `toks "red bus"`, expected: `["red", "bus"]` },
        { expr: `toks ""`, expected: "[]" },
        { expr: `toks "  a   b "`, expected: `["a", "b"]` },
        { expr: `toks "one"`, expected: `["one"]` },
      ],
      hint: "`words s`.",
      solution: hs`toks :: String -> [String]
toks s = words s
`,
    },
    {
      k: "write",
      body: "Write `keepAlpha`, which keeps only the letters of a String.",
      starter: hs`import Data.Char

keepAlpha :: String -> String
keepAlpha s = undefined
`,
      tests: [
        { expr: `keepAlpha "R2-D2"`, expected: `"RD"` },
        { expr: `keepAlpha ""`, expected: `""` },
        { expr: `keepAlpha "hello"`, expected: `"hello"` },
        { expr: `keepAlpha "123"`, expected: `""` },
      ],
      hint: "`filter isAlpha s`.",
      solution: hs`import Data.Char

keepAlpha :: String -> String
keepAlpha s = filter isAlpha s
`,
    },
    {
      k: "write",
      body: md(
        "Write `sumDigits`, which adds up the values of the digit characters in a String.",
        "",
        "Precondition: every character is a digit `'0'` to `'9'`.",
      ),
      starter: hs`import Data.Char

sumDigits :: String -> Int
sumDigits s = undefined
`,
      tests: [
        { expr: `sumDigits "12"`, expected: "3" },
        { expr: `sumDigits ""`, expected: "0" },
        { expr: `sumDigits "0"`, expected: "0" },
        { expr: `sumDigits "909"`, expected: "18" },
      ],
      hint: "`digitToInt` turns `'7'` into `7`. Map that, then `sum`.",
      solution: hs`import Data.Char

sumDigits :: String -> Int
sumDigits s = sum (map digitToInt s)
`,
    },
    {
      k: "write",
      body: "Write `hasVowel`, which is `True` if a String contains at least one of `a e i o u`, in either case.",
      starter: hs`import Data.Char

hasVowel :: String -> Bool
hasVowel s = undefined
`,
      tests: [
        { expr: `hasVowel "sky"`, expected: "False" },
        { expr: `hasVowel "Sky"`, expected: "False" },
        { expr: `hasVowel "train"`, expected: "True" },
        { expr: `hasVowel "AEIOU"`, expected: "True" },
        { expr: `hasVowel ""`, expected: "False" },
      ],
      hint: "`any (\\c -> elem (toLower c) \"aeiou\") s`. Use prefix `elem`, not backticks.",
      solution: hs`import Data.Char

hasVowel :: String -> Bool
hasVowel s = any (\c -> elem (toLower c) "aeiou") s
`,
    },
    {
      k: "write",
      body: "Write `firstTok`, which gives `Just` the first word of a String, or `Nothing` if there are no words.",
      starter: hs`firstTok :: String -> Maybe String
firstTok s = undefined
`,
      tests: [
        { expr: `firstTok "red bus"`, expected: `Just "red"` },
        { expr: `firstTok ""`, expected: "Nothing" },
        { expr: `firstTok "   "`, expected: "Nothing" },
        { expr: `firstTok "  only  "`, expected: `Just "only"` },
      ],
      hint: "`case words s of`: empty list means `Nothing`; otherwise take the first word.",
      solution: hs`firstTok :: String -> Maybe String
firstTok s = case words s of
  []      -> Nothing
  (w : _) -> Just w
`,
    },
    {
      k: "write",
      body: "Write `keepText`, which keeps letters and whitespace and throws away everything else (digits, commas, and so on).",
      starter: hs`import Data.Char

keepText :: String -> String
keepText s = undefined
`,
      tests: [
        { expr: `keepText "Hi, you!"`, expected: `"Hi you"` },
        { expr: `keepText ""`, expected: `""` },
        { expr: `keepText "R2D2"`, expected: `"RD"` },
        { expr: `keepText "a b"`, expected: `"a b"` },
        { expr: `keepText "..."`, expected: `""` },
      ],
      hint: "`filter (\\c -> isAlpha c || isSpace c) s`. The comma in `\"Hi, you!\"` goes, but the space stays.",
      solution: hs`import Data.Char

keepText :: String -> String
keepText s = filter (\c -> isAlpha c || isSpace c) s
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 2: Standard
// ---------------------------------------------------------------------------

const level2: DrillSet = {
  id: "b-strings-l2",
  lesson: "",
  level: 2,
  title: "Level 2: Standard",
  intro: md(
    "Now you write each function from a type and a description. `span` and `break` give you a pair: the front chunk, and the rest. `readMaybe` (from `Text.Read`) never crashes: it gives `Nothing` when the text is not a value. `reads` is hungrier: it reads a prefix and hands back what it consumed plus the leftover.",
    "",
    "```",
    "break (== '|') \"a|b|c\"     -- (\"a\", \"|b|c\")",
    "readMaybe \"42\" :: Maybe Int  -- Just 42",
    "reads \"42xyz\" :: [(Int, String)]  -- [(42, \"xyz\")]",
    "```",
  ),
  drills: [
    {
      k: "write",
      body: md(
        "Write `splitBar`, which cuts a String at every `|`. Empty pieces are kept.",
        "",
        "```",
        "splitBar \"a|b||c\"  ==  [\"a\", \"b\", \"\", \"c\"]",
        "splitBar \"\"        ==  [\"\"]",
        "```",
      ),
      starter: hs`splitBar :: String -> [String]
splitBar s = undefined
`,
      tests: [
        { expr: `splitBar "a|b||c"`, expected: `["a", "b", "", "c"]` },
        { expr: `splitBar "abc"`, expected: `["abc"]` },
        { expr: `splitBar ""`, expected: `[""]` },
        { expr: `splitBar "|x|"`, expected: `["", "x", ""]`, label: "bars at both ends" },
        { expr: `splitBar "solo"`, expected: `["solo"]` },
      ],
      hint: "`case break (== '|') s of`: if the second part is `[]`, the answer is `[chunk]`; if it is `(_ : rest)`, skip the bar and recurse.",
      solution: hs`splitBar :: String -> [String]
splitBar s = case break (== '|') s of
  (chunk, [])       -> [chunk]
  (chunk, _ : rest) -> chunk : splitBar rest
`,
      banned: ["words", "lines"],
    },
    {
      k: "write",
      body: "Write `csvCells`, which splits a row on commas, keeping empty cells. A row with no commas is a single cell.",
      starter: hs`csvCells :: String -> [String]
csvCells row = undefined
`,
      tests: [
        { expr: `csvCells "tea,2,hot"`, expected: `["tea", "2", "hot"]` },
        { expr: `csvCells ""`, expected: `[""]` },
        { expr: `csvCells "only"`, expected: `["only"]` },
        { expr: `csvCells ",b,"`, expected: `["", "b", ""]` },
        { expr: `csvCells "a,,c"`, expected: `["a", "", "c"]` },
      ],
      hint: "Same shape as `splitBar`, but the separator is `','`.",
      solution: hs`csvCells :: String -> [String]
csvCells row = case break (== ',') row of
  (cell, [])       -> [cell]
  (cell, _ : rest) -> cell : csvCells rest
`,
      banned: ["words"],
    },
    {
      k: "write",
      body: md(
        "Write `maybeInt`, which tries to read a whole String as an Int.",
        "",
        "`readMaybe` (already imported) gives `Nothing` if the whole string is not a number. It does not skip leftover letters.",
      ),
      starter: hs`import Text.Read (readMaybe)

maybeInt :: String -> Maybe Int
maybeInt s = undefined
`,
      tests: [
        { expr: `maybeInt "42"`, expected: "Just 42" },
        { expr: `maybeInt "cat"`, expected: "Nothing" },
        { expr: `maybeInt "12a"`, expected: "Nothing", label: "leftover letters: fail" },
        { expr: `maybeInt ""`, expected: "Nothing" },
        { expr: `maybeInt "-3"`, expected: "Just (-3)" },
      ],
      hint: "`readMaybe s`. The type signature tells it to make an Int.",
      solution: hs`import Text.Read (readMaybe)

maybeInt :: String -> Maybe Int
maybeInt s = readMaybe s
`,
    },
    {
      k: "write",
      body: md(
        "Write `digitValues`, which turns each digit character into its Int value.",
        "",
        "Precondition: every character is `'0'` to `'9'`.",
      ),
      starter: hs`import Data.Char

digitValues :: String -> [Int]
digitValues s = undefined
`,
      tests: [
        { expr: `digitValues "2024"`, expected: "[2, 0, 2, 4]" },
        { expr: `digitValues ""`, expected: "[]" },
        { expr: `digitValues "7"`, expected: "[7]" },
        { expr: `digitValues "09"`, expected: "[0, 9]" },
      ],
      hint: "`map digitToInt s`.",
      solution: hs`import Data.Char

digitValues :: String -> [Int]
digitValues s = map digitToInt s
`,
    },
    {
      k: "write",
      body: md(
        "Write `fromValues`, which turns each Int 0 to 15 into a digit character (`0`-`9` then `a`-`f`).",
        "",
        "Precondition: every number is between 0 and 15 inclusive.",
      ),
      starter: hs`import Data.Char

fromValues :: [Int] -> String
fromValues ns = undefined
`,
      tests: [
        { expr: `fromValues [1, 10, 15]`, expected: `"1af"` },
        { expr: `fromValues []`, expected: `""` },
        { expr: `fromValues [0]`, expected: `"0"` },
        { expr: `fromValues [9, 10]`, expected: `"9a"` },
      ],
      hint: "`map intToDigit ns`. `intToDigit 10` is `'a'`.",
      solution: hs`import Data.Char

fromValues :: [Int] -> String
fromValues ns = map intToDigit ns
`,
    },
    {
      k: "write",
      body: "Write `hexChars`, which keeps only the hexadecimal digits of a String (`0`-`9`, `a`-`f`, `A`-`F`). Letters that are not hex, and punctuation, are dropped.",
      starter: hs`import Data.Char

hexChars :: String -> String
hexChars s = undefined
`,
      tests: [
        { expr: `hexChars "pink #ff00aa!"`, expected: `"ff00aa"` },
        { expr: `hexChars ""`, expected: `""` },
        { expr: `hexChars "xyz"`, expected: `""` },
        { expr: `hexChars "DeadBeef"`, expected: `"DeadBeef"` },
        { expr: `hexChars "g1G"`, expected: `"1"`, label: "g and G are not hex" },
      ],
      hint: "`filter isHexDigit s`.",
      solution: hs`import Data.Char

hexChars :: String -> String
hexChars s = filter isHexDigit s
`,
    },
    {
      k: "write",
      body: "Write `beforeSlash`, which gives the part of a String before the first `'/'`. If there is no slash, the whole string is the answer.",
      starter: hs`beforeSlash :: String -> String
beforeSlash s = undefined
`,
      tests: [
        { expr: `beforeSlash "docs/notes.txt"`, expected: `"docs"` },
        { expr: `beforeSlash "notes.txt"`, expected: `"notes.txt"` },
        { expr: `beforeSlash ""`, expected: `""` },
        { expr: `beforeSlash "/etc"`, expected: `""` },
        { expr: `beforeSlash "a/b/c"`, expected: `"a"`, label: "only the first slash matters" },
      ],
      hint: "`fst (break (== '/') s)`. `break` puts the slash in the second part, so `fst` is everything before it.",
      solution: hs`beforeSlash :: String -> String
beforeSlash s = fst (break (== '/') s)
`,
    },
    {
      k: "write",
      body: "Write `afterEq`, which gives the text after the first `'='`. If there is no `'='`, the answer is `Nothing`.",
      starter: hs`afterEq :: String -> Maybe String
afterEq s = undefined
`,
      tests: [
        { expr: `afterEq "size=12"`, expected: `Just "12"` },
        { expr: `afterEq "plain"`, expected: "Nothing" },
        { expr: `afterEq "=yes"`, expected: `Just "yes"` },
        { expr: `afterEq "a=b=c"`, expected: `Just "b=c"`, label: "only the first equals splits" },
        { expr: `afterEq ""`, expected: "Nothing" },
      ],
      hint: "`case break (== '=') s of`: the second part ` '=' : rest ` is `Just rest`; anything else is `Nothing`.",
      solution: hs`afterEq :: String -> Maybe String
afterEq s = case break (== '=') s of
  (_, '=' : rest) -> Just rest
  _               -> Nothing
`,
    },
    {
      k: "write",
      body: "Write `stripPunct`, which removes punctuation and keeps letters, digits and whitespace. Use `isAlphaNum` and `isSpace`.",
      starter: hs`import Data.Char

stripPunct :: String -> String
stripPunct s = undefined
`,
      tests: [
        { expr: `stripPunct "Hello, world!"`, expected: `"Hello world"` },
        { expr: `stripPunct ""`, expected: `""` },
        { expr: `stripPunct "R2-D2"`, expected: `"R2D2"` },
        { expr: `stripPunct "well..."`, expected: `"well"` },
        { expr: `stripPunct "a b"`, expected: `"a b"` },
      ],
      hint: "`filter (\\c -> isAlphaNum c || isSpace c) s`.",
      solution: hs`import Data.Char

stripPunct :: String -> String
stripPunct s = filter (\c -> isAlphaNum c || isSpace c) s
`,
    },
    {
      k: "write",
      body: "Write `normalise`, which squeezes any run of whitespace (including newlines) down to single spaces, and trims the ends. `\"  a\\n  b  \"` becomes `\"a b\"`.",
      starter: hs`normalise :: String -> String
normalise s = undefined
`,
      tests: [
        { expr: `normalise "  a\\n  b  "`, expected: `"a b"` },
        { expr: `normalise ""`, expected: `""` },
        { expr: `normalise "one"`, expected: `"one"` },
        { expr: `normalise "   "`, expected: `""` },
        { expr: `normalise "x   y   z"`, expected: `"x y z"` },
      ],
      hint: "`unwords (words s)` tidies whitespace in one go.",
      solution: hs`normalise :: String -> String
normalise s = unwords (words s)
`,
    },
    {
      k: "write",
      body: "Write `wordTally`, which counts the words in a String after squeezing whitespace. Same answer as `nWords` from Level 1, but write it from the type alone.",
      starter: hs`wordTally :: String -> Int
wordTally s = undefined
`,
      tests: [
        { expr: `wordTally "the cat sat"`, expected: "3" },
        { expr: `wordTally ""`, expected: "0" },
        { expr: `wordTally "\\n\\nok\\tthen "`, expected: "2" },
        { expr: `wordTally "word"`, expected: "1" },
      ],
      hint: "`length (words s)`.",
      solution: hs`wordTally :: String -> Int
wordTally s = length (words s)
`,
    },
    {
      k: "write",
      body: "Write `pullDigits`, which collects every digit character of a String, in order, as Ints. Non-digits are skipped; they do not join digits into bigger numbers. So `\"a12b3\"` is `[1, 2, 3]`.",
      starter: hs`import Data.Char

pullDigits :: String -> [Int]
pullDigits s = undefined
`,
      tests: [
        { expr: `pullDigits "a12b3"`, expected: "[1, 2, 3]" },
        { expr: `pullDigits ""`, expected: "[]" },
        { expr: `pullDigits "nope"`, expected: "[]" },
        { expr: `pullDigits "7"`, expected: "[7]" },
        { expr: `pullDigits "room 9"`, expected: "[9]" },
      ],
      hint: "`map digitToInt (filter isDigit s)`.",
      solution: hs`import Data.Char

pullDigits :: String -> [Int]
pullDigits s = map digitToInt (filter isDigit s)
`,
    },
    {
      k: "write",
      body: md(
        "Write `asBool`, which reads `\"yes\"` / `\"true\"` as `Just True` and `\"no\"` / `\"false\"` as `Just False`, ignoring case. Anything else is `Nothing`.",
      ),
      starter: hs`import Data.Char

asBool :: String -> Maybe Bool
asBool s = undefined
`,
      tests: [
        { expr: `asBool "yes"`, expected: "Just True" },
        { expr: `asBool "TRUE"`, expected: "Just True" },
        { expr: `asBool "No"`, expected: "Just False" },
        { expr: `asBool "false"`, expected: "Just False" },
        { expr: `asBool "maybe"`, expected: "Nothing" },
        { expr: `asBool ""`, expected: "Nothing" },
      ],
      hint: "Lower-case the string first, then match the four spellings.",
      solution: hs`import Data.Char

asBool :: String -> Maybe Bool
asBool s = case map toLower s of
  "yes"   -> Just True
  "true"  -> Just True
  "no"    -> Just False
  "false" -> Just False
  _       -> Nothing
`,
    },
    {
      k: "write",
      body: "Write `capWords`, which upper-cases the first character of every word and lower-cases the rest. Words are those that `words` finds; they are joined with single spaces.",
      starter: hs`import Data.Char

capWords :: String -> String
capWords s = undefined
`,
      tests: [
        { expr: `capWords "the RED bus"`, expected: `"The Red Bus"` },
        { expr: `capWords ""`, expected: `""` },
        { expr: `capWords "hi"`, expected: `"Hi"` },
        { expr: `capWords "  a  b "`, expected: `"A B"` },
        { expr: `capWords "OK"`, expected: `"Ok"` },
      ],
      hint: "A helper `cap w` for one word: empty stays empty; otherwise `toUpper` of the first character and `map toLower` of the rest. Then `unwords (map cap (words s))`.",
      solution: hs`import Data.Char

capWords :: String -> String
capWords s = unwords (map cap (words s))
  where
    cap [] = []
    cap (c : cs) = toUpper c : map toLower cs
`,
    },
    {
      k: "quiz",
      q: md(
        "What does this give?",
        "",
        "```",
        "reads \"17abc\" :: [(Int, String)]",
        "```",
      ),
      options: ["`[]`", "`[(17, \"abc\")]`", "`[(17, \"\")]`", "A runtime error"],
      answer: 1,
      why: "`reads` eats a prefix that is an Int and hands back the leftover text. It does not need the whole string to be a number. (If nothing can be read, you get `[]`.)",
    },
    {
      k: "predict",
      expr: `readMaybe "12a" :: Maybe Int`,
      answer: "Nothing",
      why: "`readMaybe` needs the whole string to be the value. The leftover `'a'` makes it fail. `reads` would have given `[(12, \"a\")]`.",
    },
    {
      k: "write",
      body: "Write `unquote`, which removes a matching pair of double quotes around a String. If the string is not wrapped in quotes, return it unchanged. Quotes in the middle are not special.",
      starter: hs`unquote :: String -> String
unquote s = undefined
`,
      tests: [
        { expr: hs`unquote ('"' : "hello" ++ ['"'])`, expected: hs`"hello"` },
        { expr: hs`unquote "hello"`, expected: hs`"hello"` },
        { expr: hs`unquote ('"' : "hi")`, expected: hs`'"' : "hi"`, label: "only an opening quote: unchanged" },
        { expr: hs`unquote ['"', '"']`, expected: hs`""` },
        { expr: hs`unquote ""`, expected: hs`""` },
      ],
      hint: "Match `'\"' : rest`. If `rest` is non-empty and its last character is `'\"'`, drop that last character. `init rest` does it.",
      solution: hs`unquote :: String -> String
unquote ('"' : rest)
  | not (null rest) && last rest == '"' = init rest
unquote s = s
`,
    },
    {
      k: "write",
      body: "Write `squeeze`, which replaces every run of spaces (the character `' '`, not tabs) by a single space. Leading and trailing spaces are kept as one space if they were there.",
      starter: hs`squeeze :: String -> String
squeeze s = undefined
`,
      tests: [
        { expr: `squeeze "a    b"`, expected: `"a b"` },
        { expr: `squeeze ""`, expected: `""` },
        { expr: `squeeze "abc"`, expected: `"abc"` },
        { expr: `squeeze "  a"`, expected: `" a"` },
        { expr: `squeeze "a  "`, expected: `"a "` },
      ],
      hint: "Match two characters: if both are `' '`, drop one and recurse. Otherwise keep the first and carry on.",
      solution: hs`squeeze :: String -> String
squeeze (' ' : ' ' : rest) = squeeze (' ' : rest)
squeeze (c : rest) = c : squeeze rest
squeeze [] = []
`,
    },
    {
      k: "write",
      body: "Write `colonPair`, which splits `\"name:value\"` into `Just (name, value)` at the first colon. No colon means `Nothing`. An empty name or value is allowed.",
      starter: hs`colonPair :: String -> Maybe (String, String)
colonPair s = undefined
`,
      tests: [
        { expr: `colonPair "port:80"`, expected: `Just ("port", "80")` },
        { expr: `colonPair "plain"`, expected: "Nothing" },
        { expr: `colonPair ":only"`, expected: `Just ("", "only")` },
        { expr: `colonPair "k:"`, expected: `Just ("k", "")` },
        { expr: `colonPair "a:b:c"`, expected: `Just ("a", "b:c")` },
      ],
      hint: "`break (== ':')`. The second part must start with the colon.",
      solution: hs`colonPair :: String -> Maybe (String, String)
colonPair s = case break (== ':') s of
  (k, ':' : v) -> Just (k, v)
  _            -> Nothing
`,
    },
    {
      k: "write",
      body: "Write `indentEach n`, which puts `n` spaces on the front of every line of a String. Use `lines` and `unlines`. Precondition: `n >= 0`.",
      starter: hs`indentEach :: Int -> String -> String
indentEach n s = undefined
`,
      tests: [
        { expr: `indentEach 2 "a\\nb"`, expected: `"  a\\n  b\\n"` },
        { expr: `indentEach 0 "a"`, expected: `"a\\n"` },
        { expr: `indentEach 3 ""`, expected: `""`, label: "unlines of no lines is empty" },
        { expr: `indentEach 1 "x\\n\\ny"`, expected: `" x\\n \\n y\\n"` },
      ],
      hint: "`unlines (map (replicate n ' ' ++) (lines s))`. `unlines` adds a newline after every line.",
      solution: hs`indentEach :: Int -> String -> String
indentEach n s = unlines (map (replicate n ' ' ++) (lines s))
`,
    },
    {
      k: "write",
      body: "Write `nonemptyLines`, which gives the lines of a String that are not empty. A line of only spaces still counts as non-empty.",
      starter: hs`nonemptyLines :: String -> [String]
nonemptyLines s = undefined
`,
      tests: [
        { expr: `nonemptyLines "a\\n\\nb"`, expected: `["a", "b"]` },
        { expr: `nonemptyLines ""`, expected: "[]" },
        { expr: `nonemptyLines "solo"`, expected: `["solo"]` },
        { expr: `nonemptyLines "a\\n \\nb"`, expected: `["a", " ", "b"]`, label: "a space is not the empty line" },
        { expr: `nonemptyLines "\\n\\n"`, expected: "[]" },
      ],
      hint: "`filter (not . null) (lines s)`.",
      solution: hs`nonemptyLines :: String -> [String]
nonemptyLines s = filter (not . null) (lines s)
`,
    },
    {
      k: "write",
      body: "Write `firstSentence`, which gives the text before the first `'.'`, not including the dot. If there is no dot, the whole string is the answer.",
      starter: hs`firstSentence :: String -> String
firstSentence s = undefined
`,
      tests: [
        { expr: `firstSentence "Hello there. More."`, expected: `"Hello there"` },
        { expr: `firstSentence "No stop"`, expected: `"No stop"` },
        { expr: `firstSentence ""`, expected: `""` },
        { expr: `firstSentence ".hidden"`, expected: `""` },
        { expr: `firstSentence "Wait."`, expected: `"Wait"` },
      ],
      hint: "`fst (break (== '.') s)`.",
      solution: hs`firstSentence :: String -> String
firstSentence s = fst (break (== '.') s)
`,
    },
    {
      k: "write",
      body: "Write `hexOK`, which is `True` when a String is non-empty and every character is a hex digit.",
      starter: hs`import Data.Char

hexOK :: String -> Bool
hexOK s = undefined
`,
      tests: [
        { expr: `hexOK "ff00aa"`, expected: "True" },
        { expr: `hexOK ""`, expected: "False", label: "empty is not a hex number" },
        { expr: `hexOK "DeadBeef"`, expected: "True" },
        { expr: `hexOK "gg"`, expected: "False" },
        { expr: `hexOK "10"`, expected: "True" },
      ],
      hint: "`not (null s) && all isHexDigit s`.",
      solution: hs`import Data.Char

hexOK :: String -> Bool
hexOK s = not (null s) && all isHexDigit s
`,
    },
    {
      k: "write",
      body: md(
        "Write `intPrefix`, which uses `reads` to take an Int from the front of a String. Leading spaces are allowed. If no Int can be read, the answer is `Nothing`. Leftover text is ignored.",
        "",
        "```",
        "intPrefix \"  17cm\"  ==  Just 17",
        "intPrefix \"cm\"     ==  Nothing",
        "```",
      ),
      starter: hs`intPrefix :: String -> Maybe Int
intPrefix s = undefined
`,
      tests: [
        { expr: `intPrefix "  17cm"`, expected: "Just 17" },
        { expr: `intPrefix "cm"`, expected: "Nothing" },
        { expr: `intPrefix "-4!"`, expected: "Just (-4)" },
        { expr: `intPrefix ""`, expected: "Nothing" },
        { expr: `intPrefix "  "`, expected: "Nothing" },
      ],
      hint: "`case reads s of`: `[(n, _)]` is `Just n`; anything else is `Nothing`.",
      solution: hs`intPrefix :: String -> Maybe Int
intPrefix s = case reads s of
  [(n, _)] -> Just n
  _        -> Nothing
`,
    },
    {
      k: "write",
      body: "Write `startsDigit`, which is `True` when a String's first non-space character is a digit.",
      starter: hs`import Data.Char

startsDigit :: String -> Bool
startsDigit s = undefined
`,
      tests: [
        { expr: `startsDigit "  7up"`, expected: "True" },
        { expr: `startsDigit "up7"`, expected: "False" },
        { expr: `startsDigit ""`, expected: "False" },
        { expr: `startsDigit "   "`, expected: "False" },
        { expr: `startsDigit "0"`, expected: "True" },
      ],
      hint: "Look at `dropWhile isSpace s`. If it starts with a digit, True.",
      solution: hs`import Data.Char

startsDigit :: String -> Bool
startsDigit s = case dropWhile isSpace s of
  (c : _) -> isDigit c
  []      -> False
`,
    },
    {
      k: "write",
      body: "Write `joinSlash`, which joins path pieces with `'/'`. Empty pieces are still joined, so `[\"\", \"etc\", \"hosts\"]` is `\"/etc/hosts\"`.",
      starter: hs`joinSlash :: [String] -> String
joinSlash parts = undefined
`,
      tests: [
        { expr: `joinSlash ["", "etc", "hosts"]`, expected: `"/etc/hosts"` },
        { expr: `joinSlash []`, expected: `""` },
        { expr: `joinSlash ["notes"]`, expected: `"notes"` },
        { expr: `joinSlash ["a", "b", "c"]`, expected: `"a/b/c"` },
      ],
      hint: "A small recursive join, or `intercalate \"/\"` from `Data.List`.",
      solution: hs`import Data.List (intercalate)

joinSlash :: [String] -> String
joinSlash parts = intercalate "/" parts
`,
    },
    {
      k: "quiz",
      q: "What is `break (== ':') \"a:b:c\"`?",
      options: [
        "`(\"a\", \"b:c\")`",
        "`(\"a\", \":b:c\")`",
        "`(\"a:\", \"b:c\")`",
        "`[\"a\", \"b\", \"c\"]`",
      ],
      answer: 1,
      why: "`break` stops at the first character that passes the test, and that character stays at the front of the second part. Drop it with `drop 1` if you do not want it.",
    },
    {
      k: "predict",
      expr: `span isDigit "3rd"`,
      answer: `("3", "rd")`,
      why: "`span` keeps characters from the front while the test is True, and pairs that chunk with the rest. It is `takeWhile` and `dropWhile` in one go.",
    },
    {
      k: "write",
      body: "Write `dropPunctFront`, which throws away non-letters from the front of a String and keeps the rest, including punctuation later on.",
      starter: hs`import Data.Char

dropPunctFront :: String -> String
dropPunctFront s = undefined
`,
      tests: [
        { expr: `dropPunctFront "...Hello!"`, expected: `"Hello!"` },
        { expr: `dropPunctFront "Hello"`, expected: `"Hello"` },
        { expr: `dropPunctFront "!!!"`, expected: `""` },
        { expr: `dropPunctFront ""`, expected: `""` },
        { expr: `dropPunctFront "12abc"`, expected: `"abc"` },
      ],
      hint: "`dropWhile (not . isAlpha) s`.",
      solution: hs`import Data.Char

dropPunctFront :: String -> String
dropPunctFront s = dropWhile (not . isAlpha) s
`,
    },
    {
      k: "write",
      body: md(
        "Write `middleBit`, which gives the text between the first `'['` and the first `']'` after it. If either bracket is missing, the answer is `Nothing`.",
        "",
        "```",
        "middleBit \"see [this] now\"  ==  Just \"this\"",
        "```",
      ),
      starter: hs`middleBit :: String -> Maybe String
middleBit s = undefined
`,
      tests: [
        { expr: `middleBit "see [this] now"`, expected: `Just "this"` },
        { expr: `middleBit "nope"`, expected: "Nothing" },
        { expr: `middleBit "[only"`, expected: "Nothing" },
        { expr: `middleBit "[]"`, expected: `Just ""` },
        { expr: `middleBit "a][b]"`, expected: `Just "b"`, label: "the closing bracket must come after the opening one" },
      ],
      hint: "Drop through to the first `'['` with `dropWhile (/= '[')`. Then `break (== ']')` on what follows that bracket.",
      solution: hs`middleBit :: String -> Maybe String
middleBit s = case dropWhile (/= '[') s of
  '[' : rest -> case break (== ']') rest of
    (inner, ']' : _) -> Just inner
    _                -> Nothing
  _ -> Nothing
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 3: Stretch
// ---------------------------------------------------------------------------

const level3: DrillSet = {
  id: "b-strings-l3",
  lesson: "",
  level: 3,
  title: "Level 3: Stretch",
  intro: md(
    "These combine two or three tools: `span` to grab a run of digits, `readMaybe` to turn them into an Int, `words` to tokenise, `break` to split a field. Watch empty input and leftover letters: `readMaybe \"12cm\" :: Maybe Int` is `Nothing`. Surrounding spaces and a leading zero are fine: `readMaybe \"08\"` is `Just 8`. If the number is glued to letters, take the digit run with `span` first.",
    "",
    "```",
    "span isDigit \"12cm\"           -- (\"12\", \"cm\")",
    "readMaybe \"12\" :: Maybe Int   -- Just 12",
    "readMaybe \"12cm\" :: Maybe Int -- Nothing",
    "```",
  ),
  drills: [
    {
      k: "write",
      body: md(
        "Write `numbersIn`, which collects every run of digits in a String as an Int, in order. Signs are not handled. So `\"room 12B has 3 windows\"` is `[12, 3]`.",
      ),
      starter: hs`import Data.Char

numbersIn :: String -> [Int]
numbersIn s = undefined
`,
      tests: [
        { expr: `numbersIn "room 12B has 3 windows"`, expected: "[12, 3]" },
        { expr: `numbersIn ""`, expected: "[]" },
        { expr: `numbersIn "no digits"`, expected: "[]" },
        { expr: `numbersIn "7"`, expected: "[7]" },
        { expr: `numbersIn "a100b2"`, expected: "[100, 2]" },
      ],
      hint: "If the string starts with a digit, `span isDigit` gives that run; fold `digitToInt` through it and recurse on the rest. Otherwise skip one character.",
      solution: hs`import Data.Char

numbersIn :: String -> [Int]
numbersIn [] = []
numbersIn s@(c : cs)
  | isDigit c = foldl (\n d -> n * 10 + digitToInt d) 0 ds : numbersIn rest
  | otherwise = numbersIn cs
  where
    (ds, rest) = span isDigit s
`,
    },
    {
      k: "write",
      body: md(
        "Write `parseNameAge`, which reads a line like `\"Maya 21\"` as `Just (\"Maya\", 21)`. The name is one word of letters, then a space, then a whole number. Anything else is `Nothing`.",
      ),
      starter: hs`import Data.Char
import Text.Read (readMaybe)

parseNameAge :: String -> Maybe (String, Int)
parseNameAge s = undefined
`,
      tests: [
        { expr: `parseNameAge "Maya 21"`, expected: `Just ("Maya", 21)` },
        { expr: `parseNameAge "Maya"`, expected: "Nothing" },
        { expr: `parseNameAge "21 Maya"`, expected: "Nothing" },
        { expr: `parseNameAge "Maya 21 extra"`, expected: "Nothing" },
        { expr: `parseNameAge ""`, expected: "Nothing" },
        { expr: `parseNameAge "Jo 0"`, expected: `Just ("Jo", 0)` },
      ],
      hint: "`case words s of [name, age]`: the name must `all isAlpha`, and `readMaybe age` must succeed.",
      solution: hs`import Data.Char
import Text.Read (readMaybe)

parseNameAge :: String -> Maybe (String, Int)
parseNameAge s = case words s of
  [name, age] | all isAlpha name && not (null name) ->
    case readMaybe age of
      Just n  -> Just (name, n)
      Nothing -> Nothing
  _ -> Nothing
`,
    },
    {
      k: "write",
      body: "Write `csvInts`, which reads a comma-separated row of Ints. If any cell is not an Int, the whole answer is `Nothing`. Empty cells fail.",
      starter: hs`import Text.Read (readMaybe)

csvInts :: String -> Maybe [Int]
csvInts row = undefined
`,
      tests: [
        { expr: `csvInts "1,2,3"`, expected: "Just [1, 2, 3]" },
        { expr: `csvInts "1,x,3"`, expected: "Nothing" },
        { expr: `csvInts ""`, expected: "Nothing", label: "one empty cell" },
        { expr: `csvInts "7"`, expected: "Just [7]" },
        { expr: `csvInts "-1,0,8"`, expected: "Just [-1, 0, 8]" },
      ],
      hint: "Split on commas (as in Level 2), then try `readMaybe` on each cell. If any is `Nothing`, fail.",
      solution: hs`import Text.Read (readMaybe)

csvInts :: String -> Maybe [Int]
csvInts row = go (cells row)
  where
    cells s = case break (== ',') s of
      (c, [])       -> [c]
      (c, _ : rest) -> c : cells rest
    go [] = Just []
    go (c : cs) = case readMaybe c of
      Nothing -> Nothing
      Just n  -> case go cs of
        Nothing -> Nothing
        Just ns -> Just (n : ns)
`,
    },
    {
      k: "write",
      body: md(
        "Write `parseHex`, which reads a whole String as a hexadecimal Int (no `0x` prefix). Empty input fails. Use `digitToInt`, which already understands `a`-`f` and `A`-`F`.",
      ),
      starter: hs`import Data.Char

parseHex :: String -> Maybe Int
parseHex s = undefined
`,
      tests: [
        { expr: `parseHex "ff"`, expected: "Just 255" },
        { expr: `parseHex "10"`, expected: "Just 16" },
        { expr: `parseHex ""`, expected: "Nothing" },
        { expr: `parseHex "g"`, expected: "Nothing" },
        { expr: `parseHex "0"`, expected: "Just 0" },
        { expr: `parseHex "1A"`, expected: "Just 26" },
      ],
      hint: "If `s` is non-empty and `all isHexDigit s`, fold from the left: `n * 16 + digitToInt c`.",
      solution: hs`import Data.Char

parseHex :: String -> Maybe Int
parseHex s
  | not (null s) && all isHexDigit s =
      Just (foldl (\n c -> n * 16 + digitToInt c) 0 s)
  | otherwise = Nothing
`,
    },
    {
      k: "write",
      body: "Write `longestTok`, which gives the longest word in a String (by number of characters). If several tie, keep the first. No words means `Nothing`.",
      starter: hs`longestTok :: String -> Maybe String
longestTok s = undefined
`,
      tests: [
        { expr: `longestTok "a longer cat"`, expected: `Just "longer"` },
        { expr: `longestTok ""`, expected: "Nothing" },
        { expr: `longestTok "   "`, expected: "Nothing" },
        { expr: `longestTok "aa bb cc"`, expected: `Just "aa"`, label: "first of a tie" },
        { expr: `longestTok "hi"`, expected: `Just "hi"` },
      ],
      hint: "Fold over `words s`, keeping the best so far. Compare with `length`.",
      solution: hs`longestTok :: String -> Maybe String
longestTok s = case words s of
  [] -> Nothing
  (w : ws) -> Just (foldl better w ws)
  where
    better a b
      | length b > length a = b
      | otherwise           = a
`,
    },
    {
      k: "write",
      body: "Write `wordsWith p s`, which keeps the words of `s` that start with the prefix `p`. Matching is case-sensitive.",
      starter: hs`wordsWith :: String -> String -> [String]
wordsWith p s = undefined
`,
      tests: [
        { expr: `wordsWith "th" "the thin cat that"`, expected: `["the", "thin", "that"]` },
        { expr: `wordsWith "z" "the cat"`, expected: "[]" },
        { expr: `wordsWith "the" ""`, expected: "[]" },
        { expr: `wordsWith "" "a b"`, expected: `["a", "b"]`, label: "the empty prefix is a prefix of everything" },
        { expr: `wordsWith "The" "the The"`, expected: `["The"]` },
      ],
      hint: "`filter (isPrefixOf p) (words s)`. `isPrefixOf` is in `Data.List`.",
      solution: hs`import Data.List (isPrefixOf)

wordsWith :: String -> String -> [String]
wordsWith p s = filter (isPrefixOf p) (words s)
`,
    },
    {
      k: "write",
      body: "Write `slug`, which builds a URL-ish slug: lower case, letters and digits only, words joined with `'-'`. Other characters are treated as spaces.",
      starter: hs`import Data.Char

slug :: String -> String
slug s = undefined
`,
      tests: [
        { expr: `slug "Hello, World!"`, expected: `"hello-world"` },
        { expr: `slug ""`, expected: `""` },
        { expr: `slug "R2-D2"`, expected: `"r2-d2"` },
        { expr: `slug "   "`, expected: `""` },
        { expr: `slug "One"`, expected: `"one"` },
      ],
      hint: "Turn every non-alphanumeric character into a space, then `unwords` / `words` to squeeze, then join with `'-'`, after `toLower`.",
      solution: hs`import Data.Char
import Data.List (intercalate)

slug :: String -> String
slug s = intercalate "-" (words (map tidy s))
  where
    tidy c
      | isAlphaNum c = toLower c
      | otherwise    = ' '
`,
    },
    {
      k: "write",
      body: "Write `uniqueWords`, which lists each word once, in the order of first appearance. Case-sensitive.",
      starter: hs`uniqueWords :: String -> [String]
uniqueWords s = undefined
`,
      tests: [
        { expr: `uniqueWords "the cat the mat the"`, expected: `["the", "cat", "mat"]` },
        { expr: `uniqueWords ""`, expected: "[]" },
        { expr: `uniqueWords "a a a"`, expected: `["a"]` },
        { expr: `uniqueWords "The the"`, expected: `["The", "the"]` },
      ],
      hint: "Walk `words s` with an accumulator of words already seen. Skip a word if `elem` says it is in the accumulator. Use prefix `elem`.",
      solution: hs`uniqueWords :: String -> [String]
uniqueWords s = go (words s) []
  where
    go [] seen = reverse seen
    go (w : ws) seen
      | elem w seen = go ws seen
      | otherwise   = go ws (w : seen)
`,
      banned: ["nub", "nubBy"],
    },
    {
      k: "write",
      body: md(
        "Write `parseBounds`, which reads `\"3..7\"` as `Just (3, 7)`. Both ends are Ints, with exactly two dots between them and nothing else. Either end may be negative.",
      ),
      starter: hs`import Text.Read (readMaybe)

parseBounds :: String -> Maybe (Int, Int)
parseBounds s = undefined
`,
      tests: [
        { expr: `parseBounds "3..7"`, expected: "Just (3, 7)" },
        { expr: `parseBounds "3.7"`, expected: "Nothing" },
        { expr: `parseBounds "3...7"`, expected: "Nothing" },
        { expr: `parseBounds "-2..0"`, expected: "Just (-2, 0)" },
        { expr: `parseBounds "7"`, expected: "Nothing" },
        { expr: `parseBounds "3..x"`, expected: "Nothing" },
      ],
      hint: "Find `\"..\"` with `break (== '.')`. The second part should be `'.' : '.' : rest` with `rest` not starting with a dot. Then `readMaybe` both ends.",
      solution: hs`import Text.Read (readMaybe)

parseBounds :: String -> Maybe (Int, Int)
parseBounds s = case break (== '.') s of
  (a, '.' : '.' : b)
    | not (null b) && head b /= '.' ->
        case (readMaybe a, readMaybe b) of
          (Just x, Just y) -> Just (x, y)
          _                -> Nothing
  _ -> Nothing
`,
    },
    {
      k: "write",
      body: "Write `insideBrackets`, which gives every substring that sits in square brackets, in order. Nested brackets are not required: each `'['` takes text up to the next `']'`. A missing closer skips that opener and continues.",
      starter: hs`insideBrackets :: String -> [String]
insideBrackets s = undefined
`,
      tests: [
        { expr: `insideBrackets "see [this] and [that]"`, expected: `["this", "that"]` },
        { expr: `insideBrackets ""`, expected: "[]" },
        { expr: `insideBrackets "nope"`, expected: "[]" },
        { expr: `insideBrackets "[only"`, expected: "[]" },
        { expr: `insideBrackets "[][x]"`, expected: `["", "x"]` },
      ],
      hint: "Drop to the next `'['`. Then `break (== ']')`. If you find the closer, keep the inner text and recurse; if not, stop.",
      solution: hs`insideBrackets :: String -> [String]
insideBrackets s = case dropWhile (/= '[') s of
  '[' : rest -> case break (== ']') rest of
    (inner, ']' : more) -> inner : insideBrackets more
    _                   -> []
  _ -> []
`,
    },
    {
      k: "write",
      body: md(
        "Write `kvPairs`, which reads settings `\"a=1;b=22\"` as `[(\"a\", \"1\"), (\"b\", \"22\")]`. Ignore empty items, so a trailing `';'` is fine. If an item has no `'='`, skip it.",
      ),
      starter: hs`kvPairs :: String -> [(String, String)]
kvPairs s = undefined
`,
      tests: [
        { expr: `kvPairs "a=1;b=22"`, expected: `[("a", "1"), ("b", "22")]` },
        { expr: `kvPairs ""`, expected: "[]" },
        { expr: `kvPairs "x=;y=2;"`, expected: `[("x", ""), ("y", "2")]` },
        { expr: `kvPairs "k=v=w"`, expected: `[("k", "v=w")]` },
        { expr: `kvPairs "nope;a=1"`, expected: `[("a", "1")]` },
      ],
      hint: "Split on `';'`, drop empty items, `break` each item on `'='`. Keep the pair only when the colon-style second part starts with `'='`.",
      solution: hs`kvPairs :: String -> [(String, String)]
kvPairs s = [ (k, v) | item <- splitSemi s, not (null item), (k, '=' : v) <- [break (== '=') item] ]
  where
    splitSemi t = case break (== ';') t of
      (a, [])       -> [a]
      (a, _ : rest) -> a : splitSemi rest
`,
    },
    {
      k: "write",
      body: "Write `takeQuoted`, which gives `Just` the text inside the first pair of double quotes, or `Nothing` if a full pair is not there.",
      starter: hs`takeQuoted :: String -> Maybe String
takeQuoted s = undefined
`,
      tests: [
        { expr: `takeQuoted "say \\"hi\\" now"`, expected: `Just "hi"` },
        { expr: `takeQuoted "no quotes"`, expected: "Nothing" },
        { expr: `takeQuoted "\\"open"`, expected: "Nothing" },
        { expr: `takeQuoted "\\"\\""`, expected: `Just ""` },
        { expr: `takeQuoted "a\\"b\\"c\\"d"`, expected: `Just "b"` },
      ],
      hint: "Drop to the first `'\"'`, then `break` on the next `'\"'`.",
      solution: hs`takeQuoted :: String -> Maybe String
takeQuoted s = case dropWhile (/= '"') s of
  '"' : rest -> case break (== '"') rest of
    (inner, '"' : _) -> Just inner
    _                -> Nothing
  _ -> Nothing
`,
    },
    {
      k: "write",
      body: "Write `sameLetters`, which is `True` when two strings contain the same letters, ignoring case, spaces and punctuation. Digits count as letters here (keep `isAlphaNum`).",
      starter: hs`import Data.Char

sameLetters :: String -> String -> Bool
sameLetters a b = undefined
`,
      tests: [
        { expr: `sameLetters "Listen" "Silent"`, expected: "True" },
        { expr: `sameLetters "a b" "ab"`, expected: "True" },
        { expr: `sameLetters "aa" "a"`, expected: "False" },
        { expr: `sameLetters "" ""`, expected: "True" },
        { expr: `sameLetters "R2-D2" "d2r2"`, expected: "True" },
      ],
      hint: "Keep alphanumeric characters, `toLower` them, then sort both sides and compare.",
      solution: hs`import Data.Char
import Data.List (sort)

sameLetters :: String -> String -> Bool
sameLetters a b = canon a == canon b
  where
    canon s = sort (map toLower (filter isAlphaNum s))
`,
    },
    {
      k: "write",
      setup: readNatSetup,
      body: md(
        "`readNat` is given: it reads a whole String of digits as an Int and accepts leading zeros, so `readNat \"08\"` is `Just 8`.",
        "",
        "Write `parseClock`, which reads `\"09:45\"` as `Just (9, 45)`. Hours 0-23, minutes 0-59. Both parts are digit strings (any length).",
      ),
      starter: hs`parseClock :: String -> Maybe (Int, Int)
parseClock s = undefined
`,
      tests: [
        { expr: `parseClock "09:45"`, expected: "Just (9, 45)" },
        { expr: `parseClock "9:45"`, expected: "Just (9, 45)" },
        { expr: `parseClock "24:00"`, expected: "Nothing" },
        { expr: `parseClock "12:60"`, expected: "Nothing" },
        { expr: `parseClock "12"`, expected: "Nothing" },
        { expr: `parseClock "00:00"`, expected: "Just (0, 0)" },
      ],
      hint: "`break` on `':'`. Then `readNat` both parts and check the ranges.",
      solution: hs`parseClock :: String -> Maybe (Int, Int)
parseClock s = case break (== ':') s of
  (h, ':' : m) ->
    case (readNat h, readNat m) of
      (Just hh, Just mm)
        | hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59 -> Just (hh, mm)
      _ -> Nothing
  _ -> Nothing
`,
    },
    {
      k: "write",
      setup: readNatSetup,
      body: md(
        "`readNat` is given (accepts leading zeros).",
        "",
        "Write `parseSample`, which reads a lab id `\"AB-17\"` as `Just (\"AB\", 17)`: one or more letters, a hyphen, then one or more digits. Anything else is `Nothing`.",
      ),
      starter: hs`parseSample :: String -> Maybe (String, Int)
parseSample s = undefined
`,
      tests: [
        { expr: `parseSample "AB-17"`, expected: `Just ("AB", 17)` },
        { expr: `parseSample "A-0"`, expected: `Just ("A", 0)` },
        { expr: `parseSample "AB17"`, expected: "Nothing" },
        { expr: `parseSample "-17"`, expected: "Nothing" },
        { expr: `parseSample "AB-"`, expected: "Nothing" },
        { expr: `parseSample "ab-17"`, expected: `Just ("ab", 17)` },
      ],
      hint: "`span isAlpha`, then the rest must start with `'-'`. `readNat` the digits after it; they must use up the rest of the string.",
      solution: hs`import Data.Char (isAlpha)

parseSample :: String -> Maybe (String, Int)
parseSample s = case span isAlpha s of
  (name, '-' : ds)
    | not (null name) ->
        case readNat ds of
          Just n | not (null ds) -> Just (name, n)
          _                      -> Nothing
  _ -> Nothing
`,
    },
    {
      k: "write",
      body: "Write `dropComments`, which removes everything from `--` to the end of each line, then drops lines that are now empty or only spaces.",
      starter: hs`import Data.Char

dropComments :: String -> String
dropComments s = undefined
`,
      tests: [
        { expr: `dropComments "keep -- gone\\nstill"`, expected: `"keep\\nstill\\n"` },
        { expr: `dropComments "-- whole"`, expected: `""` },
        { expr: `dropComments ""`, expected: `""` },
        { expr: `dropComments "no comment"`, expected: `"no comment\\n"` },
        { expr: `dropComments "a--b--c"`, expected: `"a\\n"`, label: "the first -- starts the comment" },
      ],
      hint: "For each line, take the part before `\"--\"` (`break` twice, or `takeWhile` with a two-character look). Trim trailing spaces, drop blank results, `unlines`.",
      solution: hs`import Data.Char

dropComments :: String -> String
dropComments s = unlines (filter (not . all isSpace) (map strip (lines s)))
  where
    strip line = dropWhileEnd isSpace (beforeDash line)
    beforeDash [] = []
    beforeDash ('-' : '-' : _) = []
    beforeDash (c : cs) = c : beforeDash cs
    dropWhileEnd p t = reverse (dropWhile p (reverse t))
`,
    },
    {
      k: "write",
      body: "Write `parsePoint`, which reads `\"(2, 3)\"` as `Just (2, 3)`. Spaces around the numbers and comma are allowed. Anything else fails.",
      starter: hs`import Data.Char
import Text.Read (readMaybe)

parsePoint :: String -> Maybe (Int, Int)
parsePoint s = undefined
`,
      tests: [
        { expr: `parsePoint "(2, 3)"`, expected: "Just (2, 3)" },
        { expr: `parsePoint "(2,3)"`, expected: "Just (2, 3)" },
        { expr: `parsePoint "2, 3"`, expected: "Nothing" },
        { expr: `parsePoint "(2, 3, 4)"`, expected: "Nothing" },
        { expr: `parsePoint "(-1, 0)"`, expected: "Just (-1, 0)" },
        { expr: `parsePoint ""`, expected: "Nothing" },
      ],
      hint: "Trim, check it starts with `'('` and ends with `')'`, split the inside on `','`, expect two cells, `readMaybe` each after trimming.",
      solution: hs`import Data.Char
import Text.Read (readMaybe)

parsePoint :: String -> Maybe (Int, Int)
parsePoint s = case trim s of
  '(' : rest | not (null rest) && last rest == ')' ->
    case splitComma (init rest) of
      [a, b] ->
        case (readMaybe (trim a), readMaybe (trim b)) of
          (Just x, Just y) -> Just (x, y)
          _                -> Nothing
      _ -> Nothing
  _ -> Nothing
  where
    trim = dropWhile isSpace . reverse . dropWhile isSpace . reverse
    splitComma t = case break (== ',') t of
      (c, [])       -> [c]
      (c, _ : more) -> c : splitComma more
`,
    },
    {
      k: "write",
      body: "Write `camelWords`, which splits a lowerCamel or UpperCamel identifier into words. A new word starts at each upper-case letter. Digits stay attached to the word they sit in.",
      starter: hs`import Data.Char

camelWords :: String -> [String]
camelWords s = undefined
`,
      tests: [
        { expr: `camelWords "parseNameAge"`, expected: `["parse", "Name", "Age"]` },
        { expr: `camelWords "HTML"`, expected: `["H", "T", "M", "L"]` },
        { expr: `camelWords ""`, expected: "[]" },
        { expr: `camelWords "word"`, expected: `["word"]` },
        { expr: `camelWords "r2D2"`, expected: `["r2", "D2"]` },
      ],
      hint: "Walk character by character. When you see `isUpper`, start a new word (unless you are at the very start).",
      solution: hs`import Data.Char

camelWords :: String -> [String]
camelWords [] = []
camelWords (c : cs) = map reverse (reverse (go [c] [] cs))
  where
    go cur acc [] = cur : acc
    go cur acc (x : xs)
      | isUpper x = go [x] (cur : acc) xs
      | otherwise = go (x : cur) acc xs
`,
    },
    {
      k: "write",
      body: "Write `hashTags`, which collects every word that starts with `'#'` and has at least one character after the hash. The `'#'` is not included in the result. Other words are ignored.",
      starter: hs`hashTags :: String -> [String]
hashTags s = undefined
`,
      tests: [
        { expr: `hashTags "love #haskell and #cs"`, expected: `["haskell", "cs"]` },
        { expr: `hashTags ""`, expected: "[]" },
        { expr: `hashTags "no tags here"`, expected: "[]" },
        { expr: `hashTags "# #"`, expected: "[]", label: "hash alone is not a tag" },
        { expr: `hashTags "#OK"`, expected: `["OK"]` },
      ],
      hint: "Look at `words s`. Keep those that match `'#' : rest` with `rest` non-empty, and return `rest`.",
      solution: hs`hashTags :: String -> [String]
hashTags s = [ rest | ('#' : rest) <- words s, not (null rest) ]
`,
    },
    {
      k: "write",
      body: md(
        "Write `signedInts`, which collects every integer in the text, including negatives. A minus counts only when it sits immediately before a digit. So `\"-4 and 12, plus -0\"` is `[-4, 12, 0]`.",
      ),
      starter: hs`import Data.Char

signedInts :: String -> [Int]
signedInts s = undefined
`,
      tests: [
        { expr: `signedInts "-4 and 12, plus -0"`, expected: "[-4, 12, 0]" },
        { expr: `signedInts ""`, expected: "[]" },
        { expr: `signedInts "nope - nope"`, expected: "[]" },
        { expr: `signedInts "7-3"`, expected: "[7, -3]" },
        { expr: `signedInts "x-y-8z"`, expected: "[-8]" },
      ],
      hint: "If you see `'-'` followed by a digit, take that sign with the digit run. If you see a digit, take the run. Otherwise skip one character.",
      solution: hs`import Data.Char

signedInts :: String -> [Int]
signedInts [] = []
signedInts ('-' : s@(c : _))
  | isDigit c = negate (read ds) : signedInts rest
  where
    (ds, rest) = span isDigit s
signedInts s@(c : cs)
  | isDigit c = read ds : signedInts rest
  | otherwise = signedInts cs
  where
    (ds, rest) = span isDigit s
`,
    },
    {
      k: "quiz",
      q: "What is `readMaybe \"08\" :: Maybe Int`?",
      options: ["`Nothing`", "`Just 8`", "`Just 0`", "A runtime error"],
      answer: 1,
      why: "On this GHC, the `Int` reader accepts a leading zero and surrounding spaces, so `\"08\"` is `Just 8`. Leftover letters still fail: `readMaybe \"08x\"` is `Nothing`.",
    },
    {
      k: "predict",
      expr: `let sp c s = case break (== c) s of { (a, []) -> [a]; (a, _ : r) -> a : sp c r } in sp ' ' "a  b"`,
      answer: `["a", "", "b"]`,
      why: "Splitting on a single space keeps the empty chunk between two spaces. `words` would have given `[\"a\", \"b\"]`. Empty chunks are why CSV and `words` are different tools.",
    },
    {
      k: "write",
      body: "Write `csvTriples`, which reads a row of exactly three comma-separated fields as `Just (a, b, c)`. More or fewer fields is `Nothing`. Fields may be empty.",
      starter: hs`csvTriples :: String -> Maybe (String, String, String)
csvTriples row = undefined
`,
      tests: [
        { expr: `csvTriples "amy,21,yes"`, expected: `Just ("amy", "21", "yes")` },
        { expr: `csvTriples "a,b"`, expected: "Nothing" },
        { expr: `csvTriples "a,b,c,d"`, expected: "Nothing" },
        { expr: `csvTriples ",,"`, expected: `Just ("", "", "")` },
        { expr: `csvTriples "only"`, expected: "Nothing" },
      ],
      hint: "Split on commas. Pattern match `[a, b, c]`.",
      solution: hs`csvTriples :: String -> Maybe (String, String, String)
csvTriples row = case cells row of
  [a, b, c] -> Just (a, b, c)
  _         -> Nothing
  where
    cells s = case break (== ',') s of
      (c, [])       -> [c]
      (c, _ : rest) -> c : cells rest
`,
    },
    {
      k: "write",
      body: "Write `parseFlag`, which reads a command-line flag of the form `\"--name=value\"` as `Just (name, value)`. The name is letters only and non-empty. Anything else is `Nothing`.",
      starter: hs`import Data.Char

parseFlag :: String -> Maybe (String, String)
parseFlag s = undefined
`,
      tests: [
        { expr: `parseFlag "--count=3"`, expected: `Just ("count", "3")` },
        { expr: `parseFlag "--quiet="`, expected: `Just ("quiet", "")` },
        { expr: `parseFlag "-count=3"`, expected: "Nothing" },
        { expr: `parseFlag "--=3"`, expected: "Nothing" },
        { expr: `parseFlag "--c-x=1"`, expected: "Nothing", label: "hyphen in the name is not a letter" },
        { expr: `parseFlag "--ok"`, expected: "Nothing" },
      ],
      hint: "Match `'--' : rest`. Then `span isAlpha` for the name, and the leftover must start with `'='`.",
      solution: hs`import Data.Char

parseFlag :: String -> Maybe (String, String)
parseFlag ('-' : '-' : rest) = case span isAlpha rest of
  (name, '=' : val) | not (null name) -> Just (name, val)
  _ -> Nothing
parseFlag _ = Nothing
`,
    },
    {
      k: "write",
      body: "Write `initialsOf`, which takes a full name and returns the upper-case first letter of each word, with no separators. Words that do not start with a letter are skipped.",
      starter: hs`import Data.Char

initialsOf :: String -> String
initialsOf s = undefined
`,
      tests: [
        { expr: `initialsOf "ada lovelace"`, expected: `"AL"` },
        { expr: `initialsOf ""`, expected: `""` },
        { expr: `initialsOf "  mary  shelley "`, expected: `"MS"` },
        { expr: `initialsOf "R2 D2"`, expected: `"RD"` },
        { expr: `initialsOf "7up bottle"`, expected: `"B"` },
      ],
      hint: "For each word, if it starts with a letter, keep `toUpper` of that letter.",
      solution: hs`import Data.Char

initialsOf :: String -> String
initialsOf s = [ toUpper c | (c : _) <- words s, isAlpha c ]
`,
    },
    {
      k: "write",
      body: "Write `countSent`, which counts sentences ended by `'.'`, `'!'` or `'?'`. Runs of punctuation count as one ending. Text with no ending punctuation counts as 0 sentences (it is a fragment).",
      starter: hs`countSent :: String -> Int
countSent s = undefined
`,
      tests: [
        { expr: `countSent "Hi. Really?!"`, expected: "2" },
        { expr: `countSent ""`, expected: "0" },
        { expr: `countSent "no stop"`, expected: "0" },
        { expr: `countSent "Wait."`, expected: "1" },
        { expr: `countSent "...yes."`, expected: "2", label: "a leading run is one ending, then another at the end" },
      ],
      hint: "Walk the string. When you see an ender, add 1 and skip the rest of that run of enders.",
      solution: hs`countSent :: String -> Int
countSent [] = 0
countSent (c : cs)
  | elem c ".!?" = 1 + countSent (dropWhile (\x -> elem x ".!?") cs)
  | otherwise    = countSent cs
`,
    },
    {
      k: "quiz",
      q: "You need the integer at the front of `\"42cm\"` and you also need to know that `\"cm\"` is left. Which tool is the best fit?",
      options: [
        "`readMaybe \"42cm\" :: Maybe Int`",
        "`reads \"42cm\" :: [(Int, String)]`",
        "`lines \"42cm\"`",
        "`words \"42cm\"`",
      ],
      answer: 1,
      why: "`reads` returns `[(42, \"cm\")]`: the value and the leftover. `readMaybe` needs the whole string, so it gives `Nothing` here.",
    },
    {
      k: "predict",
      expr: `readMaybe " 42" :: Maybe Int`,
      answer: "Just 42",
      why: "The `Read` instance for `Int` skips leading spaces, so this is `Just 42`. Leftover letters still fail: `readMaybe \"42cm\"` is `Nothing`.",
    },
    {
      k: "write",
      body: "Write `unwrapQuotes`, which peels matching double quotes from both ends, repeatedly. Stop when the string is not wrapped. Quotes that do not match at both ends stay.",
      starter: hs`unwrapQuotes :: String -> String
unwrapQuotes s = undefined
`,
      tests: [
        { expr: `unwrapQuotes "\\"\\"hi\\"\\""`, expected: `"hi"` },
        { expr: `unwrapQuotes "hi"`, expected: `"hi"` },
        { expr: `unwrapQuotes "\\"hi"`, expected: `"\\"hi"` },
        { expr: `unwrapQuotes "\\"\\""`, expected: `""` },
        { expr: `unwrapQuotes ""`, expected: `""` },
      ],
      hint: "If the string is `'\"' : rest` and `rest` is non-empty with last character `'\"'`, recurse on `init rest`. Otherwise stop.",
      solution: hs`unwrapQuotes :: String -> String
unwrapQuotes ('"' : rest)
  | not (null rest) && last rest == '"' = unwrapQuotes (init rest)
unwrapQuotes s = s
`,
    },
    {
      k: "write",
      body: md(
        "Write `parseUnit`, which reads a measurement like `\"12cm\"` as `Just (12, \"cm\")`: a non-empty run of digits, then a non-empty run of letters, and nothing else.",
      ),
      starter: hs`import Data.Char

parseUnit :: String -> Maybe (Int, String)
parseUnit s = undefined
`,
      tests: [
        { expr: `parseUnit "12cm"`, expected: `Just (12, "cm")` },
        { expr: `parseUnit "12"`, expected: "Nothing" },
        { expr: `parseUnit "cm"`, expected: "Nothing" },
        { expr: `parseUnit "12cm3"`, expected: "Nothing" },
        { expr: `parseUnit "0kg"`, expected: `Just (0, "kg")` },
        { expr: `parseUnit ""`, expected: "Nothing" },
      ],
      hint: "`span isDigit`, then `span isAlpha` on the rest. Both chunks must be non-empty and the leftover must be empty. Fold `digitToInt` for the number (so leading zeros are fine).",
      solution: hs`import Data.Char

parseUnit :: String -> Maybe (Int, String)
parseUnit s = case span isDigit s of
  (ds, rest)
    | not (null ds) ->
        case span isAlpha rest of
          (unit, []) | not (null unit) ->
            Just (foldl (\n d -> n * 10 + digitToInt d) 0 ds, unit)
          _ -> Nothing
  _ -> Nothing
`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 4: Exam strength
// ---------------------------------------------------------------------------

const cafeSetup = hs`type Pence = Int

menuLine :: String
menuLine = "tea 120"
`;

const chatSetup = hs`chat :: String
chat = "hi @ada and @al @ada please see #notes"
`;

const csvSetup = hs`import Text.Read (readMaybe)

type Row = (String, Int, String)

fruit :: String
fruit = "apple,12,red\nbanana,0,yellow\npear,x,green\n"
`;

const logSetup = hs`logText :: String
logText = unlines
  [ "10:02 START oven"
  , "10:05 WARN door"
  , "10:09 STOP oven"
  ]
`;

const level4: DrillSet = {
  id: "b-strings-l4",
  lesson: "",
  level: 4,
  title: "Level 4: Exam strength",
  intro: md(
    "These are worded like the real paper: a type, a short story, and a GHCi transcript. The types and sample data sit above your code, just as the exam template gives them. Read every example: they settle details the prose leaves open. The last eight are as hard as a 3 to 5 mark question.",
    "",
    "```",
    "ghci> intPrefix \"  17cm\"",
    "Just 17",
    "```",
  ),
  drills: [
    {
      k: "write",
      setup: cafeSetup,
      body: md(
        "A cafe board writes each item as a name, a space, and a price in pence:",
        "",
        "```",
        "type Pence = Int",
        "```",
        "",
        "Define `parsePrice :: String -> Maybe (String, Pence)` that reads one line. The name is one word of letters, then one Int. For example:",
        "",
        "```",
        "ghci> parsePrice menuLine",
        "Just (\"tea\",120)",
        "ghci> parsePrice \"scone 85 extra\"",
        "Nothing",
        "ghci> parsePrice \"tea\"",
        "Nothing",
        "```",
      ),
      starter: hs`import Data.Char
import Text.Read (readMaybe)

parsePrice :: String -> Maybe (String, Pence)
parsePrice s = undefined
`,
      tests: [
        { expr: "parsePrice menuLine", expected: `Just ("tea", 120)` },
        { expr: `parsePrice "scone 85 extra"`, expected: "Nothing" },
        { expr: `parsePrice "tea"`, expected: "Nothing" },
        { expr: `parsePrice ""`, expected: "Nothing" },
        { expr: `parsePrice "Mocha 0"`, expected: `Just ("Mocha", 0)` },
      ],
      hint: "`words`, then `[name, price]`. The name must be non-empty letters; `readMaybe` the price.",
      solution: hs`import Data.Char
import Text.Read (readMaybe)

parsePrice :: String -> Maybe (String, Pence)
parsePrice s = case words s of
  [name, price] | not (null name) && all isAlpha name ->
    case readMaybe price of
      Just n  -> Just (name, n)
      Nothing -> Nothing
  _ -> Nothing
`,
    },
    {
      k: "write",
      setup: readNatSetup,
      body: md(
        "`readNat` is given and accepts leading zeros.",
        "",
        "A stopwatch log writes a split as `minutes:seconds`, for example `\"12:04\"`. Define `parseSplit :: String -> Maybe Int` that returns the total seconds. Minutes are non-negative; seconds are 0 to 59. For example:",
        "",
        "```",
        "ghci> parseSplit \"12:04\"",
        "Just 724",
        "ghci> parseSplit \"0:59\"",
        "Just 59",
        "ghci> parseSplit \"1:60\"",
        "Nothing",
        "```",
      ),
      starter: hs`parseSplit :: String -> Maybe Int
parseSplit s = undefined
`,
      tests: [
        { expr: `parseSplit "12:04"`, expected: "Just 724" },
        { expr: `parseSplit "0:59"`, expected: "Just 59" },
        { expr: `parseSplit "1:60"`, expected: "Nothing" },
        { expr: `parseSplit "12"`, expected: "Nothing" },
        { expr: `parseSplit "00:00"`, expected: "Just 0" },
      ],
      hint: "Split on `':'`, `readNat` both parts, check seconds, then `60 * m + s`.",
      solution: hs`parseSplit :: String -> Maybe Int
parseSplit s = case break (== ':') s of
  (m, ':' : sec) ->
    case (readNat m, readNat sec) of
      (Just mm, Just ss)
        | mm >= 0 && ss >= 0 && ss <= 59 -> Just (60 * mm + ss)
      _ -> Nothing
  _ -> Nothing
`,
    },
    {
      k: "write",
      setup: chatSetup,
      body: md(
        "A chat line mentions people with `'@'` and topics with `'#'`.",
        "",
        "Define `mentions :: String -> [String]` that returns every @-name, without the `'@'`, in order, duplicates kept. A lone `'@'` is not a name. For example:",
        "",
        "```",
        "ghci> mentions chat",
        "[\"ada\",\"al\",\"ada\"]",
        "ghci> mentions \"no one\"",
        "[]",
        "```",
      ),
      starter: hs`mentions :: String -> [String]
mentions s = undefined
`,
      tests: [
        { expr: "mentions chat", expected: `["ada", "al", "ada"]` },
        { expr: `mentions "no one"`, expected: "[]" },
        { expr: `mentions ""`, expected: "[]" },
        { expr: `mentions "@ @"`, expected: "[]" },
        { expr: `mentions "@Z"`, expected: `["Z"]` },
      ],
      hint: "From `words s`, keep `'@' : rest` with `rest` non-empty.",
      solution: hs`mentions :: String -> [String]
mentions s = [ rest | ('@' : rest) <- words s, not (null rest) ]
`,
    },
    {
      k: "write",
      body: md(
        "Define `extOf :: String -> Maybe String` that returns the file extension of a path: the text after the last `'.'` in the final path piece (after the last `'/'`). There must be a `'.'` in that piece, and it must not be the first character of the piece. For example:",
        "",
        "```",
        "ghci> extOf \"docs/notes.txt\"",
        "Just \"txt\"",
        "ghci> extOf \"Makefile\"",
        "Nothing",
        "ghci> extOf \".hidden\"",
        "Nothing",
        "ghci> extOf \"a/b.c.d\"",
        "Just \"d\"",
        "```",
      ),
      starter: hs`extOf :: String -> Maybe String
extOf s = undefined
`,
      tests: [
        { expr: `extOf "docs/notes.txt"`, expected: `Just "txt"` },
        { expr: `extOf "Makefile"`, expected: "Nothing" },
        { expr: `extOf ".hidden"`, expected: "Nothing" },
        { expr: `extOf "a/b.c.d"`, expected: `Just "d"` },
        { expr: `extOf "dir/"`, expected: "Nothing" },
        { expr: `extOf ""`, expected: "Nothing" },
      ],
      hint: "Take the last `/`-piece (`reverse` and `break`, or walk). Then look at the last `'.'` in that piece; if it is at index 0, fail.",
      solution: hs`extOf :: String -> Maybe String
extOf s = ext (lastPiece s)
  where
    lastPiece t = reverse (takeWhile (/= '/') (reverse t))
    ext [] = Nothing
    ext (c : cs) = case break (== '.') (reverse (c : cs)) of
      (_, [])       -> Nothing
      (revExt, _ : revRest)
        | null revRest -> Nothing
        | otherwise    -> Just (reverse revExt)
`,
    },
    {
      k: "write",
      setup: logSetup,
      body: md(
        "An oven log has lines `\"HH:MM KIND name\"`. The sample `logText` is given.",
        "",
        "Define `warnings :: String -> [String]` that returns the `name` of every `WARN` line, in order. Lines that do not have exactly three words, or whose second word is not `WARN`, are ignored. For example:",
        "",
        "```",
        "ghci> warnings logText",
        "[\"door\"]",
        "ghci> warnings \"\"",
        "[]",
        "```",
      ),
      starter: hs`warnings :: String -> [String]
warnings s = undefined
`,
      tests: [
        { expr: "warnings logText", expected: `["door"]` },
        { expr: `warnings ""`, expected: "[]" },
        { expr: `warnings "10:00 WARN pan\\n10:01 WARN lid"`, expected: `["pan", "lid"]` },
        { expr: `warnings "10:00 START oven"`, expected: "[]" },
        { expr: `warnings "broken line"`, expected: "[]" },
      ],
      hint: "`[ name | line <- lines s, [_, \"WARN\", name] <- [words line] ]`.",
      solution: hs`warnings :: String -> [String]
warnings s = [ name | line <- lines s, [_, "WARN", name] <- [words line] ]
`,
    },
    {
      k: "write",
      setup: readNatSetup,
      body: md(
        "`readNat` is given.",
        "",
        "A ferry ticket prints a sailing as `\"Ayr 08:15\"`. Define `parseSailing :: String -> Maybe (String, Int, Int)` that returns the port (letters only), the hour and the minute. For example:",
        "",
        "```",
        "ghci> parseSailing \"Ayr 08:15\"",
        "Just (\"Ayr\",8,15)",
        "ghci> parseSailing \"Ayr 24:00\"",
        "Nothing",
        "```",
      ),
      starter: hs`parseSailing :: String -> Maybe (String, Int, Int)
parseSailing s = undefined
`,
      tests: [
        { expr: `parseSailing "Ayr 08:15"`, expected: `Just ("Ayr", 8, 15)` },
        { expr: `parseSailing "Ayr 24:00"`, expected: "Nothing" },
        { expr: `parseSailing "Troon 00:00"`, expected: `Just ("Troon", 0, 0)` },
        { expr: `parseSailing "Ayr"`, expected: "Nothing" },
        { expr: `parseSailing "Ayr 8:15 extra"`, expected: "Nothing" },
      ],
      hint: "Two words: port and clock. Port `all isAlpha`. Clock as in `parseClock`.",
      solution: hs`import Data.Char (isAlpha)

parseSailing :: String -> Maybe (String, Int, Int)
parseSailing s = case words s of
  [port, clock]
    | not (null port) && all isAlpha port ->
        case break (== ':') clock of
          (h, ':' : m) ->
            case (readNat h, readNat m) of
              (Just hh, Just mm)
                | hh <= 23 && mm <= 59 -> Just (port, hh, mm)
              _ -> Nothing
          _ -> Nothing
  _ -> Nothing
`,
    },
    {
      k: "write",
      body: md(
        "A museum label may start with `\"c. \"` (circa) then a year. Define `labelYear :: String -> Maybe Int` that reads a year of four digits, optionally prefixed by `\"c. \"`. Other text fails. For example:",
        "",
        "```",
        "ghci> labelYear \"c. 1840\"",
        "Just 1840",
        "ghci> labelYear \"1840\"",
        "Just 1840",
        "ghci> labelYear \"c. 184\"",
        "Nothing",
        "```",
      ),
      starter: hs`import Data.Char
import Text.Read (readMaybe)

labelYear :: String -> Maybe Int
labelYear s = undefined
`,
      tests: [
        { expr: `labelYear "c. 1840"`, expected: "Just 1840" },
        { expr: `labelYear "1840"`, expected: "Just 1840" },
        { expr: `labelYear "c. 184"`, expected: "Nothing" },
        { expr: `labelYear "year 1840"`, expected: "Nothing" },
        { expr: `labelYear ""`, expected: "Nothing" },
      ],
      hint: "If the string starts with `\"c. \"`, drop that prefix. Then the rest must be four digits; `readMaybe` it.",
      solution: hs`import Data.Char
import Text.Read (readMaybe)

labelYear :: String -> Maybe Int
labelYear s = year (strip s)
  where
    strip ('c' : '.' : ' ' : rest) = rest
    strip t = t
    year t
      | length t == 4 && all isDigit t = readMaybe t
      | otherwise = Nothing
`,
    },
    {
      k: "quiz",
      q: "A spec says: define `parseCode :: String -> Maybe Int`. The GHCi transcript shows `parseCode \"12x\"` is `Nothing`. Which implementation matches that example?",
      options: [
        "`\\s -> case reads s of [(n, _)] -> Just n; _ -> Nothing`",
        "`readMaybe`",
        "`\\s -> Just (read (filter isDigit s))`",
        "`\\s -> Just (length s)`",
      ],
      answer: 1,
      why: "`readMaybe \"12x\"` is `Nothing` because leftover letters are not allowed. `reads` would give `Just 12` and ignore the `x`, which contradicts the transcript.",
    },
    {
      k: "write",
      body: md(
        "A bakery ticket writes `\"3x bun\"`. Define `parseOrder :: String -> Maybe (Int, String)` that reads a positive count, the letter `'x'`, a space, then the rest of the line as the item name (which may contain spaces). A count of 0 fails. For example:",
        "",
        "```",
        "ghci> parseOrder \"3x bun\"",
        "Just (3,\"bun\")",
        "ghci> parseOrder \"2x iced bun\"",
        "Just (2,\"iced bun\")",
        "ghci> parseOrder \"0x bun\"",
        "Nothing",
        "```",
      ),
      starter: hs`import Data.Char
import Text.Read (readMaybe)

parseOrder :: String -> Maybe (Int, String)
parseOrder s = undefined
`,
      tests: [
        { expr: `parseOrder "3x bun"`, expected: `Just (3, "bun")` },
        { expr: `parseOrder "2x iced bun"`, expected: `Just (2, "iced bun")` },
        { expr: `parseOrder "0x bun"`, expected: "Nothing" },
        { expr: `parseOrder "3 bun"`, expected: "Nothing" },
        { expr: `parseOrder "3x"`, expected: "Nothing" },
        { expr: `parseOrder "3x "`, expected: "Nothing", label: "empty name after the space" },
      ],
      hint: "`span isDigit`, then the rest should be `'x' : ' ' : name` with `name` non-empty. `readMaybe` the digits and check `n > 0`.",
      solution: hs`import Data.Char
import Text.Read (readMaybe)

parseOrder :: String -> Maybe (Int, String)
parseOrder s = case span isDigit s of
  (ds, 'x' : ' ' : name)
    | not (null ds) && not (null name) ->
        case readMaybe ds of
          Just n | n > 0 -> Just (n, name)
          _              -> Nothing
  _ -> Nothing
`,
    },
    {
      k: "write",
      body: md(
        "Define `parseColour :: String -> Maybe (Int, Int, Int)` that reads a CSS colour `\"#rrggbb\"` as three 0-255 components. Letters may be upper or lower case. For example:",
        "",
        "```",
        "ghci> parseColour \"#ff00aa\"",
        "Just (255,0,170)",
        "ghci> parseColour \"#FF00AA\"",
        "Just (255,0,170)",
        "ghci> parseColour \"ff00aa\"",
        "Nothing",
        "```",
      ),
      starter: hs`import Data.Char

parseColour :: String -> Maybe (Int, Int, Int)
parseColour s = undefined
`,
      tests: [
        { expr: `parseColour "#ff00aa"`, expected: "Just (255, 0, 170)" },
        { expr: `parseColour "#FF00AA"`, expected: "Just (255, 0, 170)" },
        { expr: `parseColour "ff00aa"`, expected: "Nothing" },
        { expr: `parseColour "#fff"`, expected: "Nothing" },
        { expr: `parseColour "#gg0000"`, expected: "Nothing" },
        { expr: `parseColour "#000000"`, expected: "Just (0, 0, 0)" },
      ],
      hint: "Match `'#'` then six hex digits. A helper `byte [a,b] = 16 * digitToInt a + digitToInt b`.",
      solution: hs`import Data.Char

parseColour :: String -> Maybe (Int, Int, Int)
parseColour ('#' : a : b : c : d : e : f : [])
  | all isHexDigit [a, b, c, d, e, f] =
      Just (byte a b, byte c d, byte e f)
  where
    byte x y = 16 * digitToInt x + digitToInt y
parseColour _ = Nothing
`,
    },
    {
      k: "write",
      setup: csvSetup,
      body: md(
        "A fruit file has rows `name,count,colour`. `readMaybe` is imported.",
        "",
        "Define `goodRows :: String -> [Row]` that keeps only the rows with exactly three cells whose middle cell is an Int. Other rows are skipped, not a total failure. For example:",
        "",
        "```",
        "ghci> goodRows fruit",
        "[(\"apple\",12,\"red\"),(\"banana\",0,\"yellow\")]",
        "```",
      ),
      starter: hs`goodRows :: String -> [Row]
goodRows s = undefined
`,
      tests: [
        { expr: "goodRows fruit", expected: `[("apple", 12, "red"), ("banana", 0, "yellow")]` },
        { expr: `goodRows ""`, expected: "[]" },
        { expr: `goodRows "only"`, expected: "[]" },
        { expr: `goodRows "x,1,y,z"`, expected: "[]" },
        { expr: `goodRows "kiwi,4,green"`, expected: `[("kiwi", 4, "green")]` },
      ],
      hint: "Split each line on commas. Pattern `[name, n, colour]` and `readMaybe n`.",
      solution: hs`goodRows :: String -> [Row]
goodRows s = [ (name, n, colour) | line <- lines s, (name, n, colour) <- maybeRow line ]
  where
    maybeRow line = case cells line of
      [name, n, colour] ->
        case readMaybe n of
          Just k  -> [(name, k, colour)]
          Nothing -> []
      _ -> []
    cells t = case break (== ',') t of
      (c, [])       -> [c]
      (c, _ : rest) -> c : cells rest
`,
    },
    {
      k: "write",
      body: md(
        "Define `stanzas :: String -> [String]` that splits a poem on blank lines (a line that is empty or only spaces). The pieces are joined back with `unlines`, without the blank separators. Leading and trailing blank lines do not make empty stanzas. For example:",
        "",
        "```",
        "ghci> stanzas \"a\\n\\nb\\nc\\n\\n\\nd\"",
        "[\"a\\n\",\"b\\nc\\n\",\"d\\n\"]",
        "```",
      ),
      starter: hs`import Data.Char

stanzas :: String -> [String]
stanzas s = undefined
`,
      tests: [
        { expr: `stanzas "a\\n\\nb\\nc\\n\\n\\nd"`, expected: `["a\\n", "b\\nc\\n", "d\\n"]` },
        { expr: `stanzas ""`, expected: "[]" },
        { expr: `stanzas "solo"`, expected: `["solo\\n"]` },
        { expr: `stanzas "\\n\\na\\n"`, expected: `["a\\n"]` },
        { expr: `stanzas "a\\n \\nb"`, expected: `["a\\n", "b\\n"]` },
      ],
      hint: "Walk `lines`. Collect a run of non-blank lines, then skip blanks, and `unlines` each run.",
      solution: hs`import Data.Char

stanzas :: String -> [String]
stanzas s = go (lines s)
  where
    blank t = all isSpace t
    go xs = case dropWhile blank xs of
      [] -> []
      ys -> unlines stanza : go rest
        where
          (stanza, rest) = break blank ys
`,
    },
    {
      k: "write",
      body: md(
        "Define `phoneDigits :: String -> Maybe String` that keeps the digits of a phone string. Spaces, hyphens and a leading `'+'` are allowed and dropped. Any other character fails the whole parse. The result must be non-empty. For example:",
        "",
        "```",
        "ghci> phoneDigits \"+44 131 555-0100\"",
        "Just \"441315550100\"",
        "ghci> phoneDigits \"13a\"",
        "Nothing",
        "```",
      ),
      starter: hs`import Data.Char

phoneDigits :: String -> Maybe String
phoneDigits s = undefined
`,
      tests: [
        { expr: `phoneDigits "+44 131 555-0100"`, expected: `Just "441315550100"` },
        { expr: `phoneDigits "13a"`, expected: "Nothing" },
        { expr: `phoneDigits ""`, expected: "Nothing" },
        { expr: `phoneDigits "---"`, expected: "Nothing" },
        { expr: `phoneDigits "7"`, expected: `Just "7"` },
      ],
      hint: "Allow `'+'` only at the front. Keep `isDigit`, skip space and `'-'`. Fail on anything else. Then reject an empty digit string.",
      solution: hs`import Data.Char

phoneDigits :: String -> Maybe String
phoneDigits s = case digits True s of
  Just ds | not (null ds) -> Just ds
  _                       -> Nothing
  where
    digits _ [] = Just []
    digits first (c : cs)
      | isDigit c         = case digits False cs of
                              Just ds -> Just (c : ds)
                              Nothing -> Nothing
      | c == ' ' || c == '-' = digits False cs
      | c == '+' && first    = digits False cs
      | otherwise            = Nothing
`,
    },
    {
      k: "predict",
      expr: `reads "  20x" :: [(Int, String)]`,
      answer: `[(20, "x")]`,
      why: "`reads` skips leading spaces, reads the Int, and keeps the leftover `\"x\"`. That is why it is the right tool when a unit follows a number.",
    },
    {
      k: "write",
      body: md(
        "Define `parseYes :: String -> Maybe Bool` that accepts `y`/`yes`/`n`/`no`, any case, with surrounding spaces. Anything else is `Nothing`. For example:",
        "",
        "```",
        "ghci> parseYes \"  YES \"",
        "Just True",
        "ghci> parseYes \"n\"",
        "Just False",
        "ghci> parseYes \"nope\"",
        "Nothing",
        "```",
      ),
      starter: hs`import Data.Char

parseYes :: String -> Maybe Bool
parseYes s = undefined
`,
      tests: [
        { expr: `parseYes "  YES "`, expected: "Just True" },
        { expr: `parseYes "n"`, expected: "Just False" },
        { expr: `parseYes "nope"`, expected: "Nothing" },
        { expr: `parseYes "y"`, expected: "Just True" },
        { expr: `parseYes ""`, expected: "Nothing" },
        { expr: `parseYes "No"`, expected: "Just False" },
      ],
      hint: "Trim with `dropWhile isSpace` on both ends (reverse trick), then `map toLower`, then match the four spellings.",
      solution: hs`import Data.Char

parseYes :: String -> Maybe Bool
parseYes s = case map toLower (trim s) of
  "y"   -> Just True
  "yes" -> Just True
  "n"   -> Just False
  "no"  -> Just False
  _     -> Nothing
  where
    trim = dropWhile isSpace . reverse . dropWhile isSpace . reverse
`,
    },
    {
      k: "quiz",
      q: "A GHCi transcript shows `lines \"a\\n\"` is `[\"a\"]`, not `[\"a\", \"\"]`. What should `nLines \"a\\n\"` return if it is defined as `length . lines`?",
      options: ["0", "1", "2", "It is a type error"],
      answer: 1,
      why: "A trailing newline ends the last line; it does not create an extra empty line. (`unlines` still adds one after every line when you go the other way.)",
    },
    {
      k: "write",
      body: md(
        "A tiny config file has lines `key=value`. Define `config :: String -> [(String, String)]` that reads every non-blank line of that form. Lines without `'='`, and lines whose key is empty after trimming, are skipped. Values keep inner spaces. For example:",
        "",
        "```",
        "ghci> config \"port=80\\n\\nname=red bus\\n=skip\\nplain\"",
        "[(\"port\",\"80\"),(\"name\",\"red bus\")]",
        "```",
      ),
      starter: hs`import Data.Char

config :: String -> [(String, String)]
config s = undefined
`,
      tests: [
        { expr: `config "port=80\\n\\nname=red bus\\n=skip\\nplain"`, expected: `[("port", "80"), ("name", "red bus")]` },
        { expr: `config ""`, expected: "[]" },
        { expr: `config "  host = a.b  "`, expected: `[("host", " a.b  ")]`, label: "only the key is trimmed; the value is kept raw after the first equals" },
        { expr: `config "=x"`, expected: "[]" },
      ],
      hint: "For each line, `break` on `'='`. Trim the key. Keep the pair when the key is non-empty and the equals was present.",
      solution: hs`import Data.Char

config :: String -> [(String, String)]
config s = [ (trim k, v) | line <- lines s, (k, '=' : v) <- [break (== '=') line], not (null (trim k)) ]
  where
    trim = dropWhile isSpace . reverse . dropWhile isSpace . reverse
`,
    },
    {
      k: "write",
      body: md(
        "Define `extractNums :: String -> [Int]` that finds every Int that `reads` can take, scanning from the left. After a successful read, continue from the leftover. After a failure at a character, skip that character. For example:",
        "",
        "```",
        "ghci> extractNums \"x12y-3z\"",
        "[12,-3]",
        "ghci> extractNums \"nope\"",
        "[]",
        "```",
      ),
      starter: hs`extractNums :: String -> [Int]
extractNums s = undefined
`,
      tests: [
        { expr: `extractNums "x12y-3z"`, expected: "[12, -3]" },
        { expr: `extractNums "nope"`, expected: "[]" },
        { expr: `extractNums ""`, expected: "[]" },
        { expr: `extractNums "7"`, expected: "[7]" },
        { expr: `extractNums "1 2 3"`, expected: "[1, 2, 3]" },
      ],
      hint: "`case reads s of [(n, rest)] -> n : extractNums rest`. If that fails and `s` is `c : cs`, skip `c`.",
      solution: hs`extractNums :: String -> [Int]
extractNums [] = []
extractNums s = case reads s of
  [(n, rest)] | rest /= s -> n : extractNums rest
  _ -> case s of
    (_ : cs) -> extractNums cs
    []       -> []
`,
    },
    {
      k: "write",
      body: md(
        "Define `baseName :: String -> String` that returns the last piece of a path split on `'/'`. Trailing slashes are ignored, so `\"docs/\"` is `\"docs\"`. The empty path is `\"\"`. For example:",
        "",
        "```",
        "ghci> baseName \"docs/notes.txt\"",
        "\"notes.txt\"",
        "ghci> baseName \"docs/\"",
        "\"docs\"",
        "ghci> baseName \"/\"",
        "\"\"",
        "```",
      ),
      starter: hs`baseName :: String -> String
baseName s = undefined
`,
      tests: [
        { expr: `baseName "docs/notes.txt"`, expected: `"notes.txt"` },
        { expr: `baseName "docs/"`, expected: `"docs"` },
        { expr: `baseName "/"`, expected: `""` },
        { expr: `baseName ""`, expected: `""` },
        { expr: `baseName "notes.txt"`, expected: `"notes.txt"` },
      ],
      hint: "Drop trailing `'/'`, then take characters from the end until a `'/'`.",
      solution: hs`baseName :: String -> String
baseName s = reverse (takeWhile (/= '/') (reverse (dropWhileEnd s)))
  where
    dropWhileEnd [] = []
    dropWhileEnd t | last t == '/' = dropWhileEnd (init t)
    dropWhileEnd t = t
`,
    },
    {
      k: "write",
      setup: splitBarSetup,
      body: md(
        "`splitBar` is given: it splits on `'|'`, keeping empty pieces.",
        "",
        "A choir part list looks like `\"S:Ada,Ben|A:Cy\"`. Define `choirParts :: String -> [(Char, [String])]` that splits on `'|'`, then each piece is a part letter, a colon, and comma-separated names. Skip malformed pieces. For example:",
        "",
        "```",
        "ghci> choirParts \"S:Ada,Ben|A:Cy\"",
        "[('S',[\"Ada\",\"Ben\"]),('A',[\"Cy\"])]",
        "ghci> choirParts \"S:Ada|bad\"",
        "[('S',[\"Ada\"])]",
        "```",
      ),
      starter: hs`import Data.Char

choirParts :: String -> [(Char, [String])]
choirParts s = undefined
`,
      tests: [
        { expr: `choirParts "S:Ada,Ben|A:Cy"`, expected: `[('S', ["Ada", "Ben"]), ('A', ["Cy"])]` },
        { expr: `choirParts "S:Ada|bad"`, expected: `[('S', ["Ada"])]` },
        { expr: `choirParts ""`, expected: "[]" },
        { expr: `choirParts "T:Solo"`, expected: `[('T', ["Solo"])]` },
        { expr: `choirParts "S:"`, expected: `[('S', [""])]` },
      ],
      hint: "For each `splitBar` piece, match `p : ':' : rest` with `isAlpha p`. Split `rest` on commas the same way as Level 2.",
      solution: hs`import Data.Char

choirParts :: String -> [(Char, [String])]
choirParts s = [ (p, commas rest) | (p : ':' : rest) <- splitBar s, isAlpha p ]
  where
    commas t = case break (== ',') t of
      (a, [])       -> [a]
      (a, _ : more) -> a : commas more
`,
    },
    {
      k: "write",
      body: md(
        "A theatre ticket prints a seat as a letter then a number, for example `\"B12\"`.",
        "",
        "Define `parseSeat :: String -> Maybe (Char, Int)` that reads one letter (any case) followed by one or more digits and nothing else. For example:",
        "",
        "```",
        "ghci> parseSeat \"B12\"",
        "Just ('B',12)",
        "ghci> parseSeat \"12\"",
        "Nothing",
        "ghci> parseSeat \"B\"",
        "Nothing",
        "```",
      ),
      starter: hs`import Data.Char

parseSeat :: String -> Maybe (Char, Int)
parseSeat s = undefined
`,
      tests: [
        { expr: `parseSeat "B12"`, expected: "Just ('B', 12)" },
        { expr: `parseSeat "12"`, expected: "Nothing" },
        { expr: `parseSeat "B"`, expected: "Nothing" },
        { expr: `parseSeat "BB12"`, expected: "Nothing" },
        { expr: `parseSeat "a0"`, expected: "Just ('a', 0)" },
        { expr: `parseSeat ""`, expected: "Nothing" },
      ],
      hint: "Match `c : ds`. `isAlpha c`, `ds` non-empty and `all isDigit`. Fold `digitToInt` for the number.",
      solution: hs`import Data.Char

parseSeat :: String -> Maybe (Char, Int)
parseSeat (c : ds)
  | isAlpha c && not (null ds) && all isDigit ds =
      Just (c, foldl (\n d -> n * 10 + digitToInt d) 0 ds)
parseSeat _ = Nothing
`,
    },
    {
      k: "write",
      body: md(
        "Define `dropHeader :: String -> String` that removes the first line of a file (the header) and keeps the rest. Use `lines` and `unlines`. For example:",
        "",
        "```",
        "ghci> dropHeader \"name,count\\ntea,2\\n\"",
        "\"tea,2\\n\"",
        "ghci> dropHeader \"only\"",
        "\"\"",
        "```",
      ),
      starter: hs`dropHeader :: String -> String
dropHeader s = undefined
`,
      tests: [
        { expr: `dropHeader "name,count\\ntea,2\\n"`, expected: `"tea,2\\n"` },
        { expr: `dropHeader "only"`, expected: `""` },
        { expr: `dropHeader ""`, expected: `""` },
        { expr: `dropHeader "a\\nb\\nc"`, expected: `"b\\nc\\n"` },
        { expr: `dropHeader "a\\n"`, expected: `""` },
      ],
      hint: "`unlines (drop 1 (lines s))`.",
      solution: hs`dropHeader :: String -> String
dropHeader s = unlines (drop 1 (lines s))
`,
    },
    {
      k: "write",
      body: md(
        "A recipe is one ingredient per line: a positive count, a space, then the rest of the line as the name.",
        "",
        "Define `parseRecipe :: String -> Maybe [(Int, String)]` that reads a whole recipe. If any line fails, the answer is `Nothing`. A count of 0 fails. The empty recipe is `Just []`. For example:",
        "",
        "```",
        "ghci> parseRecipe \"2 eggs\\n100 flour\"",
        "Just [(2,\"eggs\"),(100,\"flour\")]",
        "ghci> parseRecipe \"eggs\"",
        "Nothing",
        "```",
        "",
        "[3 marks]",
      ),
      starter: hs`import Data.Char
import Text.Read (readMaybe)

parseRecipe :: String -> Maybe [(Int, String)]
parseRecipe s = undefined
`,
      tests: [
        { expr: `parseRecipe "2 eggs\\n100 flour"`, expected: `Just [(2, "eggs"), (100, "flour")]` },
        { expr: `parseRecipe "eggs"`, expected: "Nothing" },
        { expr: `parseRecipe ""`, expected: "Just []" },
        { expr: `parseRecipe "0 eggs"`, expected: "Nothing" },
        { expr: `parseRecipe "2 iced buns"`, expected: `Just [(2, "iced buns")]` },
        { expr: `parseRecipe "2 eggs\\n\\n"`, expected: "Nothing", label: "a trailing blank line fails" },
      ],
      hint: "Map a one-line parser over `lines s`. The line is `span isDigit`, then a space, then a non-empty name. Sequence the Maybes: if any is `Nothing`, fail.",
      solution: hs`import Data.Char
import Text.Read (readMaybe)

parseRecipe :: String -> Maybe [(Int, String)]
parseRecipe s = go (lines s)
  where
    go [] = Just []
    go (line : rest) = case parseLine line of
      Nothing -> Nothing
      Just item -> case go rest of
        Nothing    -> Nothing
        Just items -> Just (item : items)
    parseLine line = case span isDigit line of
      (ds, ' ' : name)
        | not (null ds) && not (null name) ->
            case readMaybe ds of
              Just n | n > 0 -> Just (n, name)
              _              -> Nothing
      _ -> Nothing
`,
    },
    {
      k: "write",
      body: md(
        "Define `quotedToks :: String -> [String]` that tokenises a line. Tokens are either a run of non-spaces, or a double-quoted string (which may contain spaces). The quotes are not part of the token. An unclosed quote ends the scan and that unfinished token is dropped. For example:",
        "",
        "```",
        "ghci> quotedToks \"see \\\"hello world\\\" now\"",
        "[\"see\",\"hello world\",\"now\"]",
        "ghci> quotedToks \"ok \\\"open\"",
        "[\"ok\"]",
        "```",
        "",
        "[4 marks]",
      ),
      starter: hs`import Data.Char

quotedToks :: String -> [String]
quotedToks s = undefined
`,
      tests: [
        { expr: `quotedToks "see \\"hello world\\" now"`, expected: `["see", "hello world", "now"]` },
        { expr: `quotedToks "ok \\"open"`, expected: `["ok"]` },
        { expr: `quotedToks ""`, expected: "[]" },
        { expr: `quotedToks "  a   b "`, expected: `["a", "b"]` },
        { expr: `quotedToks "\\"\\""`, expected: `[""]` },
        { expr: `quotedToks "\\"a b\\" \\"c\\""`, expected: `["a b", "c"]` },
      ],
      hint: "Skip spaces. If the next character is `'\"'`, `break` on the next `'\"'`; if it is missing, stop. Otherwise take the next non-space run.",
      solution: hs`import Data.Char

quotedToks :: String -> [String]
quotedToks s = case dropWhile isSpace s of
  [] -> []
  '"' : rest -> case break (== '"') rest of
    (w, '"' : more) -> w : quotedToks more
    _               -> []
  rest -> let (w, more) = break isSpace rest
          in w : quotedToks more
`,
    },
    {
      k: "write",
      setup: readNatSetup,
      body: md(
        "`readNat` is given and accepts leading zeros.",
        "",
        "A stopwatch writes a duration as tokens like `1h`, `20m`, `5s` (hours, minutes, seconds), separated by spaces. Define `parseDuration :: String -> Maybe Int` that returns the total seconds. Every token must be a number followed by exactly one of `h`, `m`, `s`. The empty string fails. For example:",
        "",
        "```",
        "ghci> parseDuration \"1h 20m 5s\"",
        "Just 4805",
        "ghci> parseDuration \"20m\"",
        "Just 1200",
        "ghci> parseDuration \"1x\"",
        "Nothing",
        "```",
        "",
        "[4 marks]",
      ),
      starter: hs`parseDuration :: String -> Maybe Int
parseDuration s = undefined
`,
      tests: [
        { expr: `parseDuration "1h 20m 5s"`, expected: "Just 4805" },
        { expr: `parseDuration "20m"`, expected: "Just 1200" },
        { expr: `parseDuration "1x"`, expected: "Nothing" },
        { expr: `parseDuration ""`, expected: "Nothing" },
        { expr: `parseDuration "5s 1h"`, expected: "Just 3605" },
        { expr: `parseDuration "08s"`, expected: "Just 8" },
      ],
      hint: "`words`, then each token is `span isDigit` plus one unit character. Scale h by 3600, m by 60, s by 1. Sequence the Maybes and `sum`.",
      solution: hs`import Data.Char (isDigit)

parseDuration :: String -> Maybe Int
parseDuration s = case words s of
  [] -> Nothing
  ws -> go ws
  where
    go [] = Just 0
    go (t : ts) = case token t of
      Nothing -> Nothing
      Just n  -> case go ts of
        Nothing -> Nothing
        Just m  -> Just (n + m)
    token t = case span isDigit t of
      (ds, [u]) | not (null ds) ->
        case (readNat ds, unit u) of
          (Just n, Just k) -> Just (n * k)
          _                -> Nothing
      _ -> Nothing
    unit 'h' = Just 3600
    unit 'm' = Just 60
    unit 's' = Just 1
    unit _   = Nothing
`,
    },
    {
      k: "write",
      body: md(
        "A class list row is `name,age,pass` where `pass` is `yes`/`no` (any case).",
        "",
        "Define `parseRecord :: String -> Maybe (String, Int, Bool)` that reads one row of exactly three comma-separated cells. The name is non-empty, the age is an Int, and the flag is yes/no. For example:",
        "",
        "```",
        "ghci> parseRecord \"amy,21,yes\"",
        "Just (\"amy\",21,True)",
        "ghci> parseRecord \"amy,21,maybe\"",
        "Nothing",
        "```",
        "",
        "[4 marks]",
      ),
      starter: hs`import Data.Char
import Text.Read (readMaybe)

parseRecord :: String -> Maybe (String, Int, Bool)
parseRecord row = undefined
`,
      tests: [
        { expr: `parseRecord "amy,21,yes"`, expected: `Just ("amy", 21, True)` },
        { expr: `parseRecord "amy,21,maybe"`, expected: "Nothing" },
        { expr: `parseRecord "ben,0,NO"`, expected: `Just ("ben", 0, False)` },
        { expr: `parseRecord ",21,yes"`, expected: "Nothing" },
        { expr: `parseRecord "amy,21"`, expected: "Nothing" },
        { expr: `parseRecord "amy,21,yes,extra"`, expected: "Nothing" },
      ],
      hint: "Split on commas. Expect three cells. `readMaybe` the age. Lower-case the flag and match `yes` / `no`.",
      solution: hs`import Data.Char
import Text.Read (readMaybe)

parseRecord :: String -> Maybe (String, Int, Bool)
parseRecord row = case cells row of
  [name, age, flag]
    | not (null name) ->
        case (readMaybe age, map toLower flag) of
          (Just n, "yes") -> Just (name, n, True)
          (Just n, "no")  -> Just (name, n, False)
          _               -> Nothing
  _ -> Nothing
  where
    cells s = case break (== ',') s of
      (c, [])       -> [c]
      (c, _ : rest) -> c : cells rest
`,
    },
    {
      k: "write",
      body: md(
        "A query string is `key=value` pairs joined by `'&'`.",
        "",
        "Define `parseQuery :: String -> [(String, String)]` that reads them in order. Skip empty items and items with an empty key. A missing `'='` means skip that item. A value may contain `'='`. For example:",
        "",
        "```",
        "ghci> parseQuery \"q=haskell&n=2\"",
        "[(\"q\",\"haskell\"),(\"n\",\"2\")]",
        "ghci> parseQuery \"a=1&\"",
        "[(\"a\",\"1\")]",
        "ghci> parseQuery \"flag\"",
        "[]",
        "```",
        "",
        "[5 marks]",
      ),
      starter: hs`parseQuery :: String -> [(String, String)]
parseQuery s = undefined
`,
      tests: [
        { expr: `parseQuery "q=haskell&n=2"`, expected: `[("q", "haskell"), ("n", "2")]` },
        { expr: `parseQuery "a=1&"`, expected: `[("a", "1")]` },
        { expr: `parseQuery "flag"`, expected: "[]" },
        { expr: `parseQuery ""`, expected: "[]" },
        { expr: `parseQuery "a=b=c&x=y"`, expected: `[("a", "b=c"), ("x", "y")]` },
        { expr: `parseQuery "=x&k=v"`, expected: `[("k", "v")]` },
      ],
      hint: "Split on `'&'`. For each non-empty item, `break` on `'='`. Keep the pair when the key is non-empty and the equals was present.",
      solution: hs`parseQuery :: String -> [(String, String)]
parseQuery s = [ (k, v) | item <- splitAmp s, not (null item), (k, '=' : v) <- [break (== '=') item], not (null k) ]
  where
    splitAmp t = case break (== '&') t of
      (a, [])       -> [a]
      (a, _ : more) -> a : splitAmp more
`,
    },
    {
      k: "write",
      body: md(
        "A mail merge template uses slots written `<<name>>`.",
        "",
        "Define `fillSlots :: [(String, String)] -> String -> String` that replaces each slot with the matching value from the table. If a name is missing, leave the slot in the text. A `'<'` that does not start a full slot is copied as itself. For example:",
        "",
        "```",
        "ghci> fillSlots [(\"name\",\"Ada\"),(\"item\",\"book\")] \"Dear <<name>>, your <<item>> is ready\"",
        "\"Dear Ada, your book is ready\"",
        "ghci> fillSlots [(\"name\",\"Ada\")] \"hi <<name>> and <<x>>\"",
        "\"hi Ada and <<x>>\"",
        "```",
        "",
        "[4 marks]",
      ),
      starter: hs`fillSlots :: [(String, String)] -> String -> String
fillSlots table s = undefined
`,
      tests: [
        { expr: `fillSlots [("name", "Ada"), ("item", "book")] "Dear <<name>>, your <<item>> is ready"`, expected: `"Dear Ada, your book is ready"` },
        { expr: `fillSlots [("name", "Ada")] "hi <<name>> and <<x>>"`, expected: `"hi Ada and <<x>>"` },
        { expr: `fillSlots [] "no slots"`, expected: `"no slots"` },
        { expr: `fillSlots [("n", "A")] "<<n>>"`, expected: `"A"` },
        { expr: `fillSlots [("n", "A")] "a < b"`, expected: `"a < b"` },
        { expr: `fillSlots [("n", "A")] "<<n"`, expected: `"<<n"` },
      ],
      hint: "If you see `'<' : '<'`, look for `'>' : '>'` in what follows. `lookup` the name. If the closer is missing, keep the first `'<'` and retry from the next character.",
      solution: hs`fillSlots :: [(String, String)] -> String -> String
fillSlots _ [] = []
fillSlots table ('<' : '<' : rest) =
  case break (== '>') rest of
    (name, '>' : '>' : more) ->
      case lookup name table of
        Just v  -> v ++ fillSlots table more
        Nothing -> "<<" ++ name ++ ">>" ++ fillSlots table more
    _ -> '<' : fillSlots table ('<' : rest)
fillSlots table (c : cs) = c : fillSlots table cs
`,
    },
    {
      k: "write",
      setup: readNatSetup,
      body: md(
        "`readNat` is given.",
        "",
        "A lab reference looks like `\"PP-2024-07A\"`: the letters `PP`, a hyphen, a four-digit year, a hyphen, a two-digit code, then one letter. Define `parseRef :: String -> Maybe (Int, Int, Char)` that returns the year, the two-digit code, and the final letter. For example:",
        "",
        "```",
        "ghci> parseRef \"PP-2024-07A\"",
        "Just (2024,7,'A')",
        "ghci> parseRef \"XX-2024-07A\"",
        "Nothing",
        "ghci> parseRef \"PP-2024-7A\"",
        "Nothing",
        "```",
        "",
        "[5 marks]",
      ),
      starter: hs`parseRef :: String -> Maybe (Int, Int, Char)
parseRef s = undefined
`,
      tests: [
        { expr: `parseRef "PP-2024-07A"`, expected: "Just (2024, 7, 'A')" },
        { expr: `parseRef "XX-2024-07A"`, expected: "Nothing" },
        { expr: `parseRef "PP-2024-7A"`, expected: "Nothing" },
        { expr: `parseRef "PP-2024-07"`, expected: "Nothing" },
        { expr: `parseRef "PP-024-07A"`, expected: "Nothing" },
        { expr: `parseRef "pp-2024-07A"`, expected: "Nothing", label: "the prefix is the exact letters PP" },
        { expr: `parseRef "PP-2024-07AB"`, expected: "Nothing" },
      ],
      hint: "Pattern match `\"PP-\"`, then four digits, `'-'`, two digits, one letter, and the end of the string. `readNat` the digit chunks.",
      solution: hs`import Data.Char (isAlpha, isDigit)

parseRef :: String -> Maybe (Int, Int, Char)
parseRef ('P' : 'P' : '-' : a : b : c : d : '-' : e : f : g : [])
  | all isDigit [a, b, c, d, e, f] && isAlpha g =
      case (readNat [a, b, c, d], readNat [e, f]) of
        (Just y, Just n) -> Just (y, n, g)
        _                -> Nothing
parseRef _ = Nothing
`,
    },
    {
      k: "write",
      body: md(
        "Define `padColumns :: [String] -> [String]` that treats each string as a row of words and pads every column (with trailing spaces) to the width of the longest word in that column. Rows may have different numbers of words; missing cells are empty. Columns are joined with a single space. For example:",
        "",
        "```",
        "ghci> padColumns [\"a bb\", \"ccc d\"]",
        "[\"a   bb\",\"ccc d \"]",
        "ghci> padColumns []",
        "[]",
        "```",
        "",
        "[4 marks]",
      ),
      starter: hs`padColumns :: [String] -> [String]
padColumns rows = undefined
`,
      tests: [
        { expr: `padColumns ["a bb", "ccc d"]`, expected: `["a   bb", "ccc d "]` },
        { expr: `padColumns []`, expected: "[]" },
        { expr: `padColumns ["only"]`, expected: `["only"]` },
        { expr: `padColumns ["a b", "c"]`, expected: `["a b", "c  "]` },
        { expr: `padColumns ["a", "bb"]`, expected: `["a ", "bb"]` },
      ],
      hint: "Turn each row into `words`. Find the max number of columns and the max width of each column. Pad each cell on the right with `replicate`, then `unwords`.",
      solution: hs`padColumns :: [String] -> [String]
padColumns rows = map (joinPad widths) table
  where
    table = map words rows
    ncols = maximum (0 : map length table)
    widths =
      [ maximum (0 : [ length (cell r c) | r <- table ])
      | c <- [0 .. ncols - 1]
      ]
    cell r c
      | c < length r = r !! c
      | otherwise    = ""
    joinPad ws r = unwords [ pad w (cell r c) | (c, w) <- zip [0 ..] ws ]
    pad w x = x ++ replicate (w - length x) ' '
`,
    },
  ],
};

export const book: Book = {
  id: "b-strings",
  order: 4,
  title: "Strings and parsing",
  blurb: "String as [Char], words and lines, Data.Char, span and break, splitting, tokenising, and small Maybe parsers.",
  sets: [level1, level2, level3, level4],
};
