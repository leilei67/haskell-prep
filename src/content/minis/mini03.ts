import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "m03",
  year: 0,
  difficulty: 3,
  minutes: 40,
  title: "Mini paper 3: Run-length encoding and text statistics",
  summary:
    "Compress strings by counting runs of repeated characters, decode them again, print them compactly, capitalise words and count word frequencies.",
  skills: [
    "strings are lists of Char",
    "recursion with span (or group)",
    "replicate and concatMap",
    "show to turn numbers into strings",
    "Data.Char: toUpper and toLower",
    "zipWith on a list and its shifted copy",
    "words, sort and group",
  ],
  story: md(
    "This paper is all about strings. In Haskell a `String` is just a list of characters (`[Char]`), so everything you know about lists works on strings too: `\"abc\"` is the same as `['a','b','c']`, and you can pattern match it as `c : cs`.",
    "",
    "**Run-length encoding.** Some data has long stretches of the same character, like `\"aaaabbbcc\"`. A **run** is a maximal stretch of one repeated character: `\"aaaabbbcc\"` has three runs, four a's, then three b's, then two c's. **Run-length encoding** (RLE) stores each run as the character together with its length:",
    "",
    "```",
    "\"aaaabbbcc\"   becomes   [('a',4),('b',3),('c',2)]",
    "```",
    "",
    "This is how some early image formats and fax machines saved space: a row of 200 white pixels becomes one pair instead of 200 characters. A character can appear in more than one run if the runs are separated: `\"aabaa\"` is `[('a',2),('b',1),('a',2)]`.",
    "",
    "**Decoding** reverses the process: expand each pair back into that many copies of the character. Decoding an encoding always gives back the original string.",
    "",
    "To print an encoding compactly, we write each character followed by its count, but leave out the count when it is 1: `[('a',4),('b',1),('c',2)]` is printed as `\"a4bc2\"`.",
    "",
    "**Text statistics.** The second half of the paper works on ordinary sentences made of words separated by spaces. You will capitalise every word (`\"the cat\"` becomes `\"The Cat\"`) and count how often each word appears, ignoring upper/lower case.",
    "",
    "### The given types",
    "",
    "```haskell",
    "type Run = (Char, Int)",
    "```",
    "",
    "- A `Run` is a character and how many times it repeats, such as `('a', 4)`. The count is always at least 1.",
    "- An encoding is a list of runs, `[Run]`. Two neighbouring runs in an encoding produced by `encode` never have the same character.",
    "",
    "`Data.Char` (with `toUpper`, `toLower`) and `Data.List` (with `sort`, `group`) are imported for you. You are also given example data: the string `sample`, its encoding `sampleRuns`, and the sentence `sentence`.",
  ),
  notes: md(
    "**Where the marks are (12 total).** `encode` and `wordFreq` are 3 marks each; `decode`, `showRuns` and `capitalise` are 2 each.",
    "",
    "**Order of attack.** `encode` first (it is the core idea), then `decode` and `showRuns`, which are quick. `capitalise` and `wordFreq` are independent of the RLE part, so if `encode` is fighting you, skip ahead and come back.",
    "",
    "**Useful functions.**",
    "",
    "- `span p xs` splits a list into the longest prefix whose elements satisfy `p`, and the rest: `span (== 'a') \"aaabca\"` is `(\"aaa\",\"bca\")`.",
    "- `group` from `Data.List` splits a list into runs of equal neighbours: `group \"aaabcc\"` is `[\"aaa\",\"b\",\"cc\"]`.",
    "- `replicate 3 'x'` is `\"xxx\"`; `concatMap f xs` maps `f` over `xs` and joins the resulting lists.",
    "- `show 12` is `\"12\"`.",
    "- `words \"the  cat sat\"` is `[\"the\",\"cat\",\"sat\"]` (any number of spaces separates words).",
    "",
    "**Traps.**",
    "",
    "- In `showRuns`, a count of 1 is *not* printed, but counts of 10 or more print all their digits (`('z',12)` is `\"z12\"`).",
    "- In `capitalise`, only the first letter of each word changes; the rest of the word keeps its case, and all the spaces stay exactly where they were.",
    "- In `wordFreq`, `\"The\"` and `\"the\"` are the same word: turn everything into lower case before counting.",
  ),
  setup: hs`import Data.Char
import Data.List

type Run = (Char, Int)

--------------------------------------------------------------
-- Example data

sample :: String
sample = "aaaabbbccd"

sampleRuns :: [Run]
sampleRuns = [('a', 4), ('b', 3), ('c', 2), ('d', 1)]

sentence :: String
sentence = "The cat and the hat sat on the mat and the cat sat"
`,
  starter: hs`--------------------------------------------------------------
-- Part I: run-length encoding

encode :: String -> [Run]
encode = undefined

decode :: [Run] -> String
decode = undefined

showRuns :: [Run] -> String
showRuns = undefined

--------------------------------------------------------------
-- Part II: text statistics

capitalise :: String -> String
capitalise = undefined

wordFreq :: String -> [(String, Int)]
wordFreq = undefined
`,
  tasks: [
    {
      id: "encode",
      name: "encode",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define a function `encode :: String -> [Run]` that returns the run-length encoding of a string: one `(character, length)` pair for each run, in order. For example:",
        "",
        "```",
        "ghci> encode \"aaaabbbccd\"",
        "[('a',4),('b',3),('c',2),('d',1)]",
        "ghci> encode \"aabaa\"",
        "[('a',2),('b',1),('a',2)]",
        "ghci> encode \"\"",
        "[]",
        "```",
      ),
      hints: [
        "Recursion on the string. The empty string has no runs. For a non-empty string `c : cs`, the first run is `c` followed by however many more `c`s come straight after it.",
        "`span (== c) cs` splits `cs` into the `c`s at the front and everything after them. For example `span (== 'a') \"aabbb\"` is `(\"aa\",\"bbb\")`.",
        "The first run has length `1 + length same` (the 1 is for `c` itself). Then encode the `rest` recursively. (Alternatively, `group` does the splitting for you: `[(head g, length g) | g <- group s]`.)",
        md(
          "```",
          "encode [] = []",
          "encode (c : cs) = (c, 1 + length same) : encode rest",
          "  where",
          "    (same, rest) = span (== c) cs",
          "```",
        ),
      ],
      solution: hs`encode :: String -> [Run]
encode [] = []
encode (c : cs) = (c, 1 + length same) : encode rest
  where
    (same, rest) = span (== c) cs`,
      tests: [
        { expr: "encode sample", expected: "sampleRuns" },
        { expr: 'encode "aabaa"', expected: "[('a',2),('b',1),('a',2)]" },
        { expr: 'encode ""', expected: "[]" },
        { expr: 'encode "x"', expected: "[('x',1)]" },
        { expr: 'encode "abc"', expected: "[('a',1),('b',1),('c',1)]" },
        { expr: 'encode (replicate 12 \'z\')', expected: "[('z',12)]" },
        { expr: 'encode "  hi  "', expected: "[(' ',2),('h',1),('i',1),(' ',2)]" },
      ],
    },
    {
      id: "decode",
      name: "decode",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `decode :: [Run] -> String` that turns an encoding back into the original string. You may assume every count is at least 1. For example:",
        "",
        "```",
        "ghci> decode [('a',4),('b',3),('c',2),('d',1)]",
        "\"aaaabbbccd\"",
        "ghci> decode [('h',1),('o',3)]",
        "\"hooo\"",
        "ghci> decode []",
        "\"\"",
        "```",
        "",
        "For any string `s`, `decode (encode s) == s`.",
      ),
      hints: [
        "Each run `(c, n)` becomes `n` copies of `c`. Then join all those pieces together.",
        "`replicate n c` makes `n` copies of `c`: `replicate 3 'o'` is `\"ooo\"`.",
        "`concat` joins a list of strings: `concat [\"aaa\",\"bb\"]` is `\"aaabb\"`. So build the list of pieces with a comprehension and `concat` it.",
        "`decode runs = concat [replicate n c | (c, n) <- runs]`.",
      ],
      solution: hs`decode :: [Run] -> String
decode runs = concat [replicate n c | (c, n) <- runs]`,
      tests: [
        { expr: "decode sampleRuns", expected: "sample" },
        { expr: "decode [('h',1),('o',3)]", expected: '"hooo"' },
        { expr: "decode []", expected: '""' },
        { expr: "decode [('a',2),('b',1),('a',2)]", expected: '"aabaa"' },
        { expr: "decode [('z',12)]", expected: "replicate 12 'z'" },
        { expr: 'decode (encode "mississippi")', expected: '"mississippi"' },
        { expr: 'decode (encode sentence)', expected: "sentence" },
      ],
    },
    {
      id: "showRuns",
      name: "showRuns",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `showRuns :: [Run] -> String` that prints an encoding compactly: each run is written as its character followed by its count, except that a count of 1 is left out. For example:",
        "",
        "```",
        "ghci> showRuns [('a',4),('b',3),('c',2),('d',1)]",
        "\"a4b3c2d\"",
        "ghci> showRuns (encode \"mississippi\")",
        "\"mis2is2ip2i\"",
        "ghci> showRuns [('z',12)]",
        "\"z12\"",
        "ghci> showRuns []",
        "\"\"",
        "```",
      ),
      hints: [
        "Turn each run into a short string on its own, then join the pieces.",
        "A run `(c, 1)` becomes just `[c]` (a one-character string). Any other run `(c, n)` becomes `c : show n`.",
        "Write a small helper `showRun :: Run -> String` with two equations (or a guard), then use `concatMap showRun` (or `concat (map showRun runs)`).",
        md(
          "```",
          "showRuns runs = concatMap showRun runs",
          "  where",
          "    showRun (c, 1) = [c]",
          "    showRun (c, n) = c : show n",
          "```",
        ),
      ],
      solution: hs`showRuns :: [Run] -> String
showRuns runs = concatMap showRun runs
  where
    showRun (c, 1) = [c]
    showRun (c, n) = c : show n`,
      tests: [
        { expr: "showRuns sampleRuns", expected: '"a4b3c2d"' },
        { expr: 'showRuns (encode "mississippi")', expected: '"mis2is2ip2i"' },
        { expr: "showRuns [('z',12)]", expected: '"z12"' },
        { expr: "showRuns []", expected: '""' },
        { expr: "showRuns [('a',1),('b',1)]", expected: '"ab"' },
        { expr: "showRuns [(' ',3),('x',100)]", expected: '" 3x100"' },
        { expr: 'showRuns (encode "hello")', expected: '"hel2o"' },
      ],
    },
    {
      id: "capitalise",
      name: "capitalise",
      part: "Part II",
      marks: 2,
      prompt: md(
        "Define a function `capitalise :: String -> String` that turns the first character of every word into upper case. A word starts at the very beginning of the string or straight after a space. Every other character, including all spaces, is left exactly as it was. For example:",
        "",
        "```",
        "ghci> capitalise \"the cat sat\"",
        "\"The Cat Sat\"",
        "ghci> capitalise \"  hello  wORLD\"",
        "\"  Hello  WORLD\"",
        "ghci> capitalise \"\"",
        "\"\"",
        "```",
        "",
        "(`toUpper` leaves characters that aren't lower-case letters, such as spaces and digits, unchanged.)",
      ),
      hints: [
        "Whether a character gets capitalised depends on the character *before* it: capitalise it if the previous character is a space, or if there is no previous character.",
        "Trick: `' ' : s` is the string of \"previous characters\", lined up with `s`. Pretending there is a space before the start makes the first character a word start.",
        "`zipWith f (' ' : s) s` calls `f prev c` for each character `c` with the one before it. (`zipWith` stops at the end of the shorter list, so the extra character is ignored.) Alternatively, write a recursive helper that remembers whether the last character was a space.",
        md(
          "```",
          "capitalise s = zipWith cap (' ' : s) s",
          "  where",
          "    cap prev c",
          "      | prev == ' ' = toUpper c",
          "      | otherwise   = c",
          "```",
        ),
      ],
      solution: hs`capitalise :: String -> String
capitalise s = zipWith cap (' ' : s) s
  where
    cap prev c
      | prev == ' ' = toUpper c
      | otherwise = c`,
      tests: [
        { expr: 'capitalise "the cat sat"', expected: '"The Cat Sat"' },
        { expr: 'capitalise "  hello  wORLD"', expected: '"  Hello  WORLD"' },
        { expr: 'capitalise ""', expected: '""' },
        { expr: 'capitalise "a"', expected: '"A"' },
        { expr: 'capitalise "Already Done"', expected: '"Already Done"' },
        { expr: 'capitalise "route 66 west"', expected: '"Route 66 West"' },
        { expr: "capitalise sentence", expected: '"The Cat And The Hat Sat On The Mat And The Cat Sat"' },
        { expr: 'capitalise "x "', expected: '"X "' },
      ],
    },
    {
      id: "wordFreq",
      name: "wordFreq",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define a function `wordFreq :: String -> [(String, Int)]` that counts how many times each word occurs in a piece of text. Words are separated by one or more spaces. Upper and lower case don't matter: every word should be turned into lower case before counting. The result lists each distinct word once, with its count, in **alphabetical order**. For example:",
        "",
        "```",
        "ghci> wordFreq \"The cat and the hat\"",
        "[(\"and\",1),(\"cat\",1),(\"hat\",1),(\"the\",2)]",
        "ghci> wordFreq sentence",
        "[(\"and\",2),(\"cat\",2),(\"hat\",1),(\"mat\",1),(\"on\",1),(\"sat\",2),(\"the\",4)]",
        "ghci> wordFreq \"   \"",
        "[]",
        "```",
        "",
        "You may assume the text contains only letters and spaces.",
      ),
      hints: [
        "Build a pipeline: lower-case the text, split it into words, sort them so equal words sit next to each other, group them, then count each group.",
        "`map toLower text` lower-cases every character; `words` splits into words; `sort` puts them in alphabetical order.",
        "`group (sort [\"the\",\"cat\",\"the\"])` is `[[\"cat\"],[\"the\",\"the\"]]`. Each group `g` turns into `(head g, length g)`.",
        md(
          "```",
          "wordFreq text",
          "  = [(head g, length g) | g <- group (sort (words (map toLower text)))]",
          "```",
        ),
      ],
      solution: hs`wordFreq :: String -> [(String, Int)]
wordFreq text
  = [(head g, length g) | g <- group (sort (words (map toLower text)))]`,
      tests: [
        { expr: 'wordFreq "The cat and the hat"', expected: '[("and",1),("cat",1),("hat",1),("the",2)]' },
        { expr: "wordFreq sentence", expected: '[("and",2),("cat",2),("hat",1),("mat",1),("on",1),("sat",2),("the",4)]' },
        { expr: 'wordFreq "   "', expected: "[]" },
        { expr: 'wordFreq ""', expected: "[]" },
        { expr: 'wordFreq "Go GO go gO"', expected: '[("go",4)]' },
        { expr: 'wordFreq "  b   a  b "', expected: '[("a",1),("b",2)]' },
        { expr: 'sum (map snd (wordFreq sentence))', expected: "length (words sentence)" },
      ],
    },
  ],
};
