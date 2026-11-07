import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "m01",
  year: 0,
  difficulty: 1,
  minutes: 30,
  title: "Mini paper 1: Library loans",
  summary:
    "A small library keeps a list of who has borrowed which book. Count loans, find who borrowed a title, return a book and spot overdue loans.",
  skills: [
    "lists of pairs and triples",
    "pattern matching on tuples",
    "list comprehensions with a filter",
    "length and filter for counting",
    "simple recursion with a base case",
  ],
  story: md(
    "This is the very first mini paper. It works exactly like a real lab test (a short story, some given types and data, then functions to write), just much shorter. Everything is about plain lists.",
    "",
    "**The domain.** A small library lends out books. It owns several copies of popular books, so the same title can be on loan to more than one person at once. The librarian writes down every loan as a pair: *who* borrowed it and *which* book.",
    "",
    "```",
    "borrower   title",
    "amy        Dune",
    "ben        Emma",
    "amy        Hamlet",
    "cat        Dune",
    "amy        Ulysses",
    "ben        Dune",
    "```",
    "",
    "Here amy has three books out, ben has two and cat has one. Three different people have a copy of Dune.",
    "",
    "Each loan also has a **due day**: the day number by which the book should come back. Days are just whole numbers (day 1, day 2, ...). A loan is **overdue** on day `today` if its due day is strictly *before* `today`. A book due on day 10 is fine on day 10, and overdue on day 11.",
    "",
    "### The given types",
    "",
    "```haskell",
    "type Borrower = String",
    "type Title    = String",
    "type Day      = Int",
    "",
    "type Loan    = (Borrower, Title)",
    "type DueLoan = (Borrower, Title, Day)",
    "```",
    "",
    "- `Borrower`, `Title` and `Day` are just other names (type synonyms) for `String`, `String` and `Int`. They make the signatures easier to read; you use them exactly like `String` and `Int`.",
    "- A `Loan` is a pair such as `(\"amy\", \"Dune\")`: amy has borrowed a copy of Dune.",
    "- A `DueLoan` is a triple such as `(\"amy\", \"Dune\", 12)`: the same loan, due back on day 12.",
    "",
    "You are given the example data `loans :: [Loan]` (the table above) and `dueLoans :: [DueLoan]` (the same loans with due days). Use them in GHCi to try out your functions.",
  ),
  notes: md(
    "**Where the marks are (10 total).** Four short functions: `loanCount` and `borrowersOf` are 2 marks each, `returnBook` and `overdue` are 3 each.",
    "",
    "**Order of attack.** Just go in order. None of the functions depends on another, so if one gets stuck, move on and come back.",
    "",
    "**Strategy.**",
    "",
    "- Read each example in the spec and work it out by hand on the data first. It tells you exactly what shape the answer has.",
    "- Pattern match tuples straight inside a list comprehension: `[t | (b, t) <- loans, b == who]` walks the list and pulls each pair apart for you.",
    "- Keep results in the same order as the input list unless the question says order doesn't matter.",
    "",
    "**Traps.**",
    "",
    "- `returnBook` removes only the **first** matching loan, not all of them. `filter` would remove all of them, so use recursion.",
    "- `overdue` uses strictly less than (`<`), not `<=`.",
  ),
  setup: hs`type Borrower = String

type Title = String

type Day = Int

type Loan = (Borrower, Title)

type DueLoan = (Borrower, Title, Day)

--------------------------------------------------------------
-- Example data

loans :: [Loan]
loans
  = [("amy", "Dune"),
     ("ben", "Emma"),
     ("amy", "Hamlet"),
     ("cat", "Dune"),
     ("amy", "Ulysses"),
     ("ben", "Dune")]

dueLoans :: [DueLoan]
dueLoans
  = [("amy", "Dune",    12),
     ("ben", "Emma",     5),
     ("amy", "Hamlet",   9),
     ("cat", "Dune",    20),
     ("amy", "Ulysses",  3),
     ("ben", "Dune",    15)]
`,
  starter: hs`--------------------------------------------------------------
-- Part I

loanCount :: Borrower -> [Loan] -> Int
loanCount = undefined

borrowersOf :: Title -> [Loan] -> [Borrower]
borrowersOf = undefined

returnBook :: Loan -> [Loan] -> [Loan]
returnBook = undefined

overdue :: Day -> [DueLoan] -> [Loan]
overdue = undefined
`,
  tasks: [
    {
      id: "loanCount",
      name: "loanCount",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `loanCount :: Borrower -> [Loan] -> Int` that returns the number of books the given borrower currently has on loan. A borrower with no loans has a count of 0. For example:",
        "",
        "```",
        "ghci> loanCount \"amy\" loans",
        "3",
        "ghci> loanCount \"cat\" loans",
        "1",
        "ghci> loanCount \"dan\" loans",
        "0",
        "```",
      ),
      hints: [
        "You need to count the loans whose first component is the borrower.",
        "One way: build the list of matching loans, then take its `length`.",
        "A list comprehension can pattern match each pair and keep only the matching ones: `[t | (b, t) <- ls, b == who]`.",
        "`loanCount who ls = length [t | (b, t) <- ls, b == who]`.",
      ],
      solution: hs`loanCount :: Borrower -> [Loan] -> Int
loanCount who ls = length [t | (b, t) <- ls, b == who]`,
      tests: [
        { expr: 'loanCount "amy" loans', expected: "3" },
        { expr: 'loanCount "cat" loans', expected: "1" },
        { expr: 'loanCount "dan" loans', expected: "0" },
        { expr: 'loanCount "ben" loans', expected: "2" },
        { expr: 'loanCount "amy" []', expected: "0" },
        { expr: 'loanCount "x" [("x","A"),("y","A"),("x","B"),("x","A")]', expected: "3" },
        { expr: 'loanCount "Amy" loans', expected: "0", label: "names are case-sensitive: \"Amy\" is not \"amy\"" },
      ],
    },
    {
      id: "borrowersOf",
      name: "borrowersOf",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `borrowersOf :: Title -> [Loan] -> [Borrower]` that returns the names of everyone who has a copy of the given title, in the order they appear in the loans list. For example:",
        "",
        "```",
        "ghci> borrowersOf \"Dune\" loans",
        "[\"amy\",\"cat\",\"ben\"]",
        "ghci> borrowersOf \"Emma\" loans",
        "[\"ben\"]",
        "ghci> borrowersOf \"Beowulf\" loans",
        "[]",
        "```",
      ),
      hints: [
        "This is the mirror image of `loanCount`: now you match on the *second* component and keep the *first*.",
        "Walk the list with a list comprehension, pulling each pair apart as `(b, t)`.",
        "Keep `b` whenever `t == title`. A list comprehension keeps the original order for you.",
        "`borrowersOf title ls = [b | (b, t) <- ls, t == title]`.",
      ],
      solution: hs`borrowersOf :: Title -> [Loan] -> [Borrower]
borrowersOf title ls = [b | (b, t) <- ls, t == title]`,
      tests: [
        { expr: 'borrowersOf "Dune" loans', expected: '["amy","cat","ben"]' },
        { expr: 'borrowersOf "Emma" loans', expected: '["ben"]' },
        { expr: 'borrowersOf "Beowulf" loans', expected: "[]" },
        { expr: 'borrowersOf "Hamlet" loans', expected: '["amy"]' },
        { expr: 'borrowersOf "Dune" []', expected: "[]" },
        { expr: 'borrowersOf "A" [("z","A"),("y","B"),("x","A")]', expected: '["z","x"]', label: "keeps the order of the loans list" },
      ],
    },
    {
      id: "returnBook",
      name: "returnBook",
      part: "Part I",
      marks: 3,
      prompt: md(
        "When a borrower returns a book, its loan is crossed out. Define a function `returnBook :: Loan -> [Loan] -> [Loan]` that removes the **first** occurrence of the given loan from the list, leaving everything else in its original order. If the loan isn't in the list, the list is returned unchanged. For example:",
        "",
        "```",
        "ghci> returnBook (\"cat\", \"Dune\") loans",
        "[(\"amy\",\"Dune\"),(\"ben\",\"Emma\"),(\"amy\",\"Hamlet\"),(\"amy\",\"Ulysses\"),(\"ben\",\"Dune\")]",
        "ghci> returnBook (\"cat\", \"Emma\") [(\"cat\",\"Emma\"),(\"amy\",\"Dune\"),(\"cat\",\"Emma\")]",
        "[(\"amy\",\"Dune\"),(\"cat\",\"Emma\")]",
        "ghci> returnBook (\"dan\", \"Dune\") loans == loans",
        "True",
        "```",
        "",
        "(The same person may have borrowed two copies of the same book; returning one copy removes only one loan.)",
      ),
      hints: [
        "`filter` would remove *every* matching loan, which is wrong here. Write the recursion yourself.",
        "Two cases: the empty list (nothing to remove), and a list `l : ls` with a first loan `l`.",
        "If `l` is the loan being returned, the answer is just `ls` (stop: don't look any further). Otherwise keep `l` at the front and carry on with `ls`.",
        md(
          "```",
          "returnBook _ [] = []",
          "returnBook loan (l : ls)",
          "  | l == loan  = ls",
          "  | otherwise  = l : returnBook loan ls",
          "```",
        ),
      ],
      solution: hs`returnBook :: Loan -> [Loan] -> [Loan]
returnBook _ [] = []
returnBook loan (l : ls)
  | l == loan = ls
  | otherwise = l : returnBook loan ls`,
      tests: [
        {
          expr: 'returnBook ("cat", "Dune") loans',
          expected: '[("amy","Dune"),("ben","Emma"),("amy","Hamlet"),("amy","Ulysses"),("ben","Dune")]',
        },
        {
          expr: 'returnBook ("cat", "Emma") [("cat","Emma"),("amy","Dune"),("cat","Emma")]',
          expected: '[("amy","Dune"),("cat","Emma")]',
          label: "only the first copy is returned",
        },
        { expr: 'returnBook ("dan", "Dune") loans', expected: "loans" },
        { expr: 'returnBook ("amy", "Dune") []', expected: "[]" },
        { expr: 'returnBook ("ben", "Dune") loans', expected: "init loans", label: "removing the last loan" },
        { expr: 'returnBook ("amy", "Dune") loans', expected: "tail loans", label: "removing the first loan" },
        { expr: 'returnBook ("amy", "Emma") loans', expected: "loans", label: "the borrower AND the title must both match" },
        { expr: 'length (returnBook ("amy", "Hamlet") loans)', expected: "5" },
      ],
    },
    {
      id: "overdue",
      name: "overdue",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define a function `overdue :: Day -> [DueLoan] -> [Loan]` that, given today's day number, returns the loans (as `(borrower, title)` pairs, without the day) whose due day is strictly before today. Keep them in their original order. For example:",
        "",
        "```",
        "ghci> overdue 10 dueLoans",
        "[(\"ben\",\"Emma\"),(\"amy\",\"Hamlet\"),(\"amy\",\"Ulysses\")]",
        "ghci> overdue 1 dueLoans",
        "[]",
        "ghci> overdue 12 [(\"amy\",\"Dune\",12)]",
        "[]",
        "```",
        "",
        "The last example shows that a book due today is **not** yet overdue.",
      ),
      hints: [
        "Same shape as `borrowersOf`, but the list holds triples instead of pairs.",
        "Pattern match each triple as `(b, t, d)` in a list comprehension.",
        "Keep the pair `(b, t)` when `d < today`.",
        "`overdue today ds = [(b, t) | (b, t, d) <- ds, d < today]`.",
      ],
      solution: hs`overdue :: Day -> [DueLoan] -> [Loan]
overdue today ds = [(b, t) | (b, t, d) <- ds, d < today]`,
      tests: [
        { expr: "overdue 10 dueLoans", expected: '[("ben","Emma"),("amy","Hamlet"),("amy","Ulysses")]' },
        { expr: "overdue 1 dueLoans", expected: "[]" },
        { expr: 'overdue 12 [("amy","Dune",12)]', expected: "[]", label: "due today is not overdue" },
        { expr: 'overdue 13 [("amy","Dune",12)]', expected: '[("amy","Dune")]' },
        { expr: "overdue 100 dueLoans", expected: "loans", label: "every loan is overdue on day 100" },
        { expr: "overdue 4 dueLoans", expected: '[("amy","Ulysses")]' },
        { expr: "overdue 5 []", expected: "[]" },
        { expr: "length (overdue 16 dueLoans)", expected: "5" },
      ],
    },
  ],
};
