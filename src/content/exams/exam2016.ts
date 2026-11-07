import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "y2016",
  year: 2016,
  title: "XML and XSL Transformations",
  summary: "Parse XML text into a tree using a stack, then implement a small XSLT-style template language that turns one XML document into another.",
  skills: [
    "parsing strings character by character",
    "span, break and dropWhile",
    "a list used as a stack",
    "rose trees (nodes with a list of children)",
    "recursion over trees",
    "list comprehensions with constructor patterns",
    "concatMap",
  ],
  story: md(
    "**XML** is a very common way of writing structured data as plain text. Data is wrapped in **tags**: `<name>` starts an **element** and `</name>` ends it. Between them go the element's contents: plain text and/or more elements (its **children**). A start tag can also carry **attributes**, which are `name=\"value\"` pairs:",
    "",
    "```",
    "<film title=\"Casablanca\">",
    "  <director>Michael Curtiz</director>",
    "  <year>1942</year>",
    "</film>",
    "```",
    "",
    "Here `film` is an element with one attribute (`title`) and two child elements, `director` and `year`, each containing some text. A whole document is exactly one top-level element. Elements nest properly: you always close the innermost open element first.",
    "",
    "Everything between a `>` and the next `<` is a **text field**, *including whitespace*. So in the example, the newline and two spaces between `<film ...>` and `<director>` are a text field `\"\\n  \"` belonging to `film`. In this exam all whitespace is kept.",
    "",
    "**Parsing** means turning the text into a Haskell value (a tree). The trick used here is a **stack**: a list where you only add or remove at the front. When you read a start tag, push a new empty element onto the stack. When you read text, add it as a child of the element on top. When you read an end tag, pop the top element off and add it as a child of the element underneath. At the very bottom sits a dummy **sentinel** element `Element \"\" [] []`; when the input runs out, the answer is the sentinel's first child.",
    "",
    "```",
    "input                         stack (top first)",
    "<a>                           [a[], sentinel[]]",
    "A                             [a[\"A\"], sentinel[]]",
    "</a>                          [sentinel[a[\"A\"]]]",
    "(end)                         answer: a[\"A\"]",
    "```",
    "",
    "**XSL** is a language for transforming one XML document into another, and it is itself written in XML. An XSL document is a template: it's copied to the output, except for two special elements:",
    "",
    "- `<value-of select=\"path\"></value-of>` is replaced by the text of the first thing the path finds (or `\"\"` if none).",
    "- `<for-each select=\"path\"> ... </for-each>` is replaced by one copy of its children for every element the path finds, with that element as the new **context** (the 'current position').",
    "",
    "A **path** (an XPath) is steps separated by `/`, followed from the current context: `.` means stay here, `name` means every child element called `name`, and `@name` means the attribute called `name`. So from the root, `filmlist/film/@title` means the titles of all films.",
    "",
    "### The given types",
    "",
    "```",
    "type Name       = String",
    "type Attributes = [(String, String)]",
    "data XML        = Text String | Element Name Attributes [XML]",
    "type Stack      = [XML]",
    "type Context    = XML",
    "type XSL        = XML",
    "```",
    "",
    "- `Text s` is a text field.",
    "- `Element name atts children` is an element with its name, its attributes as (name, value) pairs, and its children in order.",
    "",
    "The Casablanca document above parses to:",
    "",
    "```",
    "Element \"film\" [(\"title\",\"Casablanca\")]",
    "  [Text \"\\n  \", Element \"director\" [] [Text \"Michael Curtiz\"],",
    "   Text \"\\n  \", Element \"year\" [] [Text \"1942\"], Text \"\\n\"]",
    "```",
    "",
    "Given helpers: `parseName` (reads an element/attribute name), `parse` and `expandXSL` (the top-level functions that call yours), `showXML`/`showXMLs` (turn XML back into a string), `printXML`/`printXMLs` (print it). Given test data: strings `s1`..`s3`, `casablanca`, `films`, `filmsXSL`, `composersXSL`, `xsl1`..`xsl9`, and their parsed versions `x1`..`x3`, `casablancaParsed`, `filmsParsed`, `xsl1Parsed`..`xsl9Parsed`.",
  ),
  notes: md(
    "**Where the marks are.** Part I (12 marks) is six small utilities; `getValue` (4) is the biggest. Part II (12) is parsing, with `parse'` worth 7. Part III (`expandXSL'`) is 6.",
    "",
    "**Order of attack.** Do Part I in order: it's quick and the later parts use it. In Part II, write `addText` and `popAndAdd` (1 mark each, one line each), then `parseAttributes`, then `parse'`. Test `parse s1`, `parse s2`, then `parse casablanca == casablancaParsed` and `parse films == filmsParsed`.",
    "",
    "**Traps.**",
    "",
    "- `getValue` must include text from children at every depth, and must return a `Text`, not a `String`.",
    "- `addChild` adds at the *end* of the children (`cs ++ [c]`).",
    "- In `parse'`, check for `'<' : '/' : ...` *before* `'<' : ...`, or end tags are read as start tags.",
    "- In `parseAttributes`, skip whitespace around the `=` and after the closing quote. The value itself is kept exactly, spaces included.",
    "- In `expandXSL'`, text in the XSL is copied unchanged, and ordinary elements are copied with their children expanded. A `value-of` always produces exactly one `Text`.",
    "",
    "**Short of time?** Part III is independent of Part II if you use the pre-parsed `xslNParsed` values, so you can attempt it even if `parse'` isn't working.",
  ),
  setup: hs`import Data.Char (isSpace, isAlpha, isDigit)
import Data.List (isInfixOf)

type Name = String

type Attributes = [(String, String)]

data XML = Text String | Element Name Attributes [XML]
         deriving (Eq, Show)

type Stack = [XML]

type Context = XML

type XSL = XML

-----------------------------------------------------------------------
-- Some useful show/print functions

-- The 'show' function for XML objects
showXML :: XML -> String
showXML (Text t)
  = t
showXML (Element n as es)
  = "<" ++ n ++ showAtts as ++ ">" ++ concatMap showXML es ++ "</" ++ n ++ ">"
  where
    showAtts as = concatMap showAtt as
    showAtt (n, v) = " " ++ n ++ "=" ++ "\"" ++ v ++ "\""

-- The 'show' function for lists of XML objects
showXMLs :: [XML] -> String
showXMLs
  = concatMap showXML

-- Prints an XML object to the terminal
printXML :: XML -> IO()
printXML
  = putStrLn . showXML

-- Prints a list of XML objects to the terminal
printXMLs :: [XML] -> IO()
printXMLs
  = mapM_ printXML

-----------------------------------------------------------------------
-- Part II (provided)

sentinel :: XML
sentinel
  = Element "" [] []

parseName :: String -> (Name, String)
parseName []
  = error "Error: attempt to read empty name"
parseName s@(c1 : cs)
  | isAlpha c1 = break (not . isNameChar) s
  | otherwise  = error ("parseName error: name " ++ show s ++
                        " must begin with a letter")
  where
    isNameChar c = isAlpha c || isDigit c || elem c "-."

parse :: String -> XML
-- Pre: The XML string is well-formed
parse s
  = parse' (skipSpace s) [sentinel]

-----------------------------------------------------------------------
-- Part III (provided)

expandXSL :: XSL -> XML -> [XML]
expandXSL xsl source
  = expandXSL' root xsl
  where
    root = Element "/" [] [source]

-- Writes the result of a transformation to a file
output :: FilePath -> XSL -> XML -> IO ()
output file xsl source
  = writeFile file (showXMLs (expandXSL xsl source))

-----------------------------------------------------------------------
-- Test data

s1, s2, s3 :: String
s1
  = "<a>A</a>"
s2
  = "<a x=\"1\"><b>A</b><b>B</b></a>"
s3
  = "<a>\
      \<b>\
        \<c att=\"att1\">text1</c>\
        \<c att=\"att2\">text2</c>\
      \</b>\
      \<b>\
        \<c att=\"att3\">text3</c>\
        \<d>text4</d>\
      \</b>\
    \</a>"

x1, x2, x3 :: XML
x1
  = Element "a" [] [Text "A"]
x2
  = Element "a"
            [("x","1")]
            [Element "b" [] [Text "A"],
             Element "b" [] [Text "B"]]
x3
  = Element "a"
            []
            [Element "b"
                     []
                     [Element "c"
                              [("att","att1")]
                              [Text "text1"],
                      Element "c"
                              [("att","att2")]
                              [Text "text2"]],
             Element "b"
                     []
                     [Element "c"
                              [("att","att3")]
                              [Text "text3"],
                      Element "d"
                              []
                              [Text "text4"]]]

casablanca :: String
casablanca
  = "<film title=\"Casablanca\">\n  <director>Michael Curtiz</director>\n  \
    \<year>1942</year>\n</film>\n\n\n"

casablancaParsed :: XML
casablancaParsed
  = Element "film"
            [("title","Casablanca")]
            [Text "\n  ",
             Element "director" [] [Text "Michael Curtiz"],
             Text "\n  ",
             Element "year" [] [Text "1942"],
             Text "\n"]

films :: String
films
  = "<filmlist>\n\
    \  <film title = \"Rear Window\">\n\
    \    <director>Alfred Hitchcock</director>\n\
    \    <composer>Franz Waxman</composer>\n\
    \    <year>1954</year>\n\
    \  </film>\n\
    \  <film   title =  \"2001: A Space Odyssey\">\n\
    \    <director>Stanley Kubrick</director>\n\
    \    <composer>Richard Strauss</composer>\n\
    \    <composer>Gyorgy Ligeti</composer>\n\
    \    <composer>Johann Strauss</composer>\n\
    \    <year>1968</year>\n\
    \  </film>\n\
    \  <film title=\"Lawrence of Arabia\"  >\n\
    \    <duration>228</duration>\n\
    \    <director>David Lean</director>\n\
    \    <composer>Maurice Jarre</composer>\n\
    \  </film>\n\
    \</filmlist>\n\n\n"

filmsParsed :: XML
filmsParsed
  = Element "filmlist"
            []
            [Text "\n  ",
             Element "film" [("title","Rear Window")]
                            [Text "\n    ",
                             Element "director" [] [Text "Alfred Hitchcock"],
                             Text "\n    ",
                             Element "composer" [] [Text "Franz Waxman"],
                             Text "\n    ",
                             Element "year" [] [Text "1954"],
                             Text "\n  "],
             Text "\n  ",
             Element "film" [("title","2001: A Space Odyssey")]
                            [Text "\n    ",
                             Element "director" [] [Text "Stanley Kubrick"],
                             Text "\n    ",
                             Element "composer" [] [Text "Richard Strauss"],
                             Text "\n    ",
                             Element "composer" [] [Text "Gyorgy Ligeti"],
                             Text "\n    ",
                             Element "composer" [] [Text "Johann Strauss"],
                             Text "\n    ",
                             Element "year" [] [Text "1968"],
                             Text "\n  "],
             Text "\n  ",
             Element "film" [("title","Lawrence of Arabia")]
                            [Text "\n    ",
                             Element "duration" [] [Text "228"],
                             Text "\n    ",
                             Element "director" [] [Text "David Lean"],
                             Text "\n    ",
                             Element "composer" [] [Text "Maurice Jarre"],
                             Text "\n  "],
             Text "\n"]

-- The XSL of Figure 2
filmsXSL :: String
filmsXSL
  = "<html>\n\
    \  <body>\n\
    \    <h2>Film List</h2>\n\
    \    <table border=\"1\">\n\
    \      <tr>\n\
    \        <th align=\"left\">Title</th>\n\
    \        <th align=\"left\">Director</th>\n\
    \        <th align=\"left\">Principal composer</th>\n\
    \      </tr>\n\
    \      <for-each select=\"filmlist/film\">\n\
    \        <tr>\n\
    \          <td><value-of select=\"@title\"></value-of></td>\n\
    \          <td><value-of select=\"director\"></value-of></td>\n\
    \          <td><value-of select=\"composer\"></value-of></td>\n\
    \        </tr>\n\
    \      </for-each>\n\
    \    </table>\n\
    \  </body>\n\
    \</html>\n"

-- An unordered list of the composers of each film
composersXSL :: String
composersXSL
  = "<ul>\n\
    \  <for-each select=\"filmlist/film\">\n\
    \    <li><value-of select=\"@title\"></value-of>\n\
    \      <ul>\n\
    \        <for-each select=\"composer\">\n\
    \          <li><value-of select=\".\"></value-of></li>\n\
    \        </for-each>\n\
    \      </ul>\n\
    \    </li>\n\
    \  </for-each>\n\
    \</ul>\n"

xsl1, xsl2, xsl3, xsl4, xsl5, xsl6, xsl7, xsl8, xsl9 :: String
xsl1
  = "<value-of select = \"a/b/c\"></value-of>"
xsl2
  = "<value-of select = \"a/b\"></value-of>"
xsl3
  = "<value-of select = \"a/b/d\"></value-of>"
xsl4
  = "<value-of select = \"a/b/c/@att\"></value-of>"
xsl5
  = "<value-of select = \"./a/./b/c/./.\"></value-of>"
xsl6
  = "<t1><t2>Preamble</t2><t3><value-of select = \"a/b/c\"></value-of></t3></t1>"
xsl7
  = "<for-each select=\"a/b/c\"><value-of select=\"@att\"></value-of></for-each>"
xsl8
  = "<for-each select=\"a/b\"><t><value-of select=\"c\"></value-of></t></for-each>"
xsl9
  = "<for-each select=\"a/b\"><t1><value-of select=\"e\"></value-of></t1></for-each>"

xsl1Parsed, xsl2Parsed, xsl3Parsed, xsl4Parsed, xsl5Parsed :: XML
xsl6Parsed, xsl7Parsed, xsl8Parsed, xsl9Parsed :: XML
xsl1Parsed
  = Element "value-of" [("select","a/b/c")] []
xsl2Parsed
  = Element "value-of" [("select","a/b")] []
xsl3Parsed
  = Element "value-of" [("select","a/b/d")] []
xsl4Parsed
  = Element "value-of" [("select","a/b/c/@att")] []
xsl5Parsed
  = Element "value-of" [("select","./a/./b/c/./.")] []
xsl6Parsed
  = Element "t1"
            []
            [Element "t2" [] [Text "Preamble"],
             Element "t3" [] [Element "value-of" [("select","a/b/c")] []]]
xsl7Parsed
  = Element "for-each"
            [("select","a/b/c")]
            [Element "value-of" [("select","@att")] []]
xsl8Parsed
  = Element "for-each"
            [("select","a/b")]
            [Element "t" [] [Element "value-of" [("select","c")] []]]
xsl9Parsed
  = Element "for-each"
            [("select","a/b")]
            [Element "t1" [] [Element "value-of" [("select","e")] []]]
`,
  starter: hs`-----------------------------------------------------------------------
-- Part I

skipSpace :: String -> String
skipSpace = undefined

getAttribute :: String -> XML -> String
getAttribute = undefined

getChildren :: String -> XML -> [XML]
getChildren = undefined

getChild :: String -> XML -> XML
getChild = undefined

addChild :: XML -> XML -> XML
-- Pre: the second argument is an Element
addChild = undefined

getValue :: XML -> XML
getValue = undefined

-----------------------------------------------------------------------
-- Part II

addText :: String -> Stack -> Stack
-- Pre: There is at least one Element on the stack
addText = undefined

popAndAdd :: Stack -> Stack
-- Pre: There are at least two Elements on the stack
popAndAdd = undefined

parseAttributes :: String -> (Attributes, String)
-- Pre: The XML attributes string is well-formed
parseAttributes = undefined

parse' :: String -> Stack -> XML
parse' = undefined

-----------------------------------------------------------------------
-- Part III

expandXSL' :: Context -> XSL -> [XML]
expandXSL' = undefined
`,
  tasks: [
    {
      id: "skipSpace",
      name: "skipSpace",
      part: "Part I",
      marks: 1,
      prompt: md(
        "Using the built-in `isSpace`, define `skipSpace :: String -> String` which removes any whitespace (spaces, newlines, tabs) from the *start* of a string.",
        "",
        "```",
        'ghci> skipSpace "\\n \\n\\nsome \\n \\n text"',
        '"some \\n \\n text"',
        "```",
      ),
      hints: [
        "There's a Prelude function that drops elements from the front of a list while a condition holds.",
        "`dropWhile p xs` drops the longest prefix of `xs` whose elements satisfy `p`.",
        "The condition is `isSpace` (already imported from `Data.Char`).",
        "`skipSpace = dropWhile isSpace`",
      ],
      solution: hs`skipSpace :: String -> String
skipSpace
  = dropWhile isSpace`,
      tests: [
        { expr: 'skipSpace "\\n \\n\\nsome \\n \\n text"', expected: '"some \\n \\n text"' },
        { expr: 'skipSpace ""', expected: '""' },
        { expr: 'skipSpace "   "', expected: '""' },
        { expr: 'skipSpace "abc  "', expected: '"abc  "' },
        { expr: 'skipSpace "\\t <a>"', expected: '"<a>"' },
        { expr: 'skipSpace " a b"', expected: '"a b"' },
      ],
    },
    {
      id: "getAttribute",
      name: "getAttribute",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define `getAttribute :: String -> XML -> String` which looks up the value of the named attribute of an XML element. If there is no such attribute (or the XML is a `Text`), the result is `\"\"`.",
        "",
        "```",
        'ghci> getAttribute "x" x2',
        '"1"',
        'ghci> getAttribute "x" (Text "t")',
        '""',
        "```",
      ),
      hints: [
        "Two equations: one for `Element`, one for `Text`.",
        "The attributes are a list of pairs, so `lookup name atts` gives a `Maybe String`.",
        "Turn `Nothing` into `\"\"` with a `case` or with `maybe \"\" id`.",
        md(
          "```",
          "getAttribute name (Element _ atts _) = case lookup name atts of",
          "                                         Just v  -> v",
          "                                         Nothing -> \"\"",
          "getAttribute _ _ = \"\"",
          "```",
        ),
      ],
      solution: hs`getAttribute :: String -> XML -> String
getAttribute name (Element _ atts _)
  = case lookup name atts of
      Just v  -> v
      Nothing -> ""
getAttribute _ _
  = ""`,
      tests: [
        { expr: 'getAttribute "x" x2', expected: '"1"' },
        { expr: 'getAttribute "x" (Text "t")', expected: '""' },
        { expr: 'getAttribute "y" x2', expected: '""' },
        { expr: 'getAttribute "x" x1', expected: '""' },
        { expr: 'getAttribute "title" casablancaParsed', expected: '"Casablanca"' },
        { expr: 'getAttribute "b" (Element "e" [("a","1"),("b","2")] [])', expected: '"2"' },
        { expr: 'getAttribute "select" xsl4Parsed', expected: '"a/b/c/@att"' },
      ],
    },
    {
      id: "getChildren",
      name: "getChildren",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define `getChildren :: String -> XML -> [XML]` which returns the child *elements* of an XML element that have the given name, in order. (A `Text` has no children.)",
        "",
        "```",
        'ghci> getChildren "b" x2',
        '[Element "b" [] [Text "A"],Element "b" [] [Text "B"]]',
        'ghci> getChildren "c" x2',
        "[]",
        "```",
      ),
      hints: [
        "Filter the children list, keeping only `Element`s with the right name.",
        "In a list comprehension, a constructor pattern on the left of `<-` silently skips anything that doesn't match, so `Text` children are skipped automatically.",
        "Use an as-pattern to keep the whole child: `c@(Element n _ _) <- children`.",
        md(
          "```",
          "getChildren name (Element _ _ cs) = [c | c@(Element n _ _) <- cs, n == name]",
          "getChildren _ _ = []",
          "```",
        ),
      ],
      solution: hs`getChildren :: String -> XML -> [XML]
getChildren name (Element _ _ cs)
  = [c | c@(Element n _ _) <- cs, n == name]
getChildren _ _
  = []`,
      tests: [
        { expr: 'getChildren "b" x2', expected: '[Element "b" [] [Text "A"],Element "b" [] [Text "B"]]' },
        { expr: 'getChildren "c" x2', expected: "[]" },
        { expr: 'getChildren "a" x1', expected: "[]" },
        { expr: 'getChildren "d" (getChildren "b" x3 !! 1)', expected: '[Element "d" [] [Text "text4"]]' },
        { expr: 'length (getChildren "film" filmsParsed)', expected: "3", label: "Text children (whitespace) are skipped" },
        { expr: 'getChildren "a" (Text "a")', expected: "[]" },
        { expr: 'getChildren "year" casablancaParsed', expected: '[Element "year" [] [Text "1942"]]' },
      ],
    },
    {
      id: "getChild",
      name: "getChild",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Using `getChildren`, or otherwise, define `getChild :: String -> XML -> XML` which returns the *first* child element with the given name, or `Text \"\"` if there isn't one.",
        "",
        "```",
        'ghci> getChild "b" x2',
        'Element "b" [] [Text "A"]',
        'ghci> getChild "c" x2',
        'Text ""',
        "```",
      ),
      hints: [
        "Call `getChildren` and look at the result.",
        "Two cases: the list is empty, or it has a first element.",
        "Use `case ... of` with patterns `[]` and `(c : _)`.",
        md(
          "```",
          "getChild name x = case getChildren name x of",
          "                    []      -> Text \"\"",
          "                    (c : _) -> c",
          "```",
        ),
      ],
      solution: hs`getChild :: String -> XML -> XML
getChild name x
  = case getChildren name x of
      []      -> Text ""
      (c : _) -> c`,
      tests: [
        { expr: 'getChild "b" x2', expected: 'Element "b" [] [Text "A"]' },
        { expr: 'getChild "c" x2', expected: 'Text ""' },
        { expr: 'getChild "c" (getChild "b" x3)', expected: 'Element "c" [("att","att1")] [Text "text1"]' },
        { expr: 'getChild "director" casablancaParsed', expected: 'Element "director" [] [Text "Michael Curtiz"]' },
        { expr: 'getChild "x" (Text "x")', expected: 'Text ""' },
        { expr: 'getAttribute "title" (getChild "film" filmsParsed)', expected: '"Rear Window"' },
      ],
    },
    {
      id: "addChild",
      name: "addChild",
      part: "Part I",
      marks: 1,
      prompt: md(
        "Define `addChild :: XML -> XML -> XML` which adds a new child at the *end* (rightmost position) of an element's children. Precondition: the second argument is an `Element`.",
        "",
        "```",
        'ghci> addChild (Text "B") (Element "a" [] [Text "A"])',
        'Element "a" [] [Text "A",Text "B"]',
        "```",
      ),
      hints: [
        "Pattern match the element and rebuild it with a longer children list.",
        "Keep the name and attributes exactly as they were.",
        "To put something at the end of a list use `++ [x]`.",
        "`addChild c (Element n atts cs) = Element n atts (cs ++ [c])`",
      ],
      solution: hs`addChild :: XML -> XML -> XML
-- Pre: the second argument is an Element
addChild c (Element n atts cs)
  = Element n atts (cs ++ [c])`,
      tests: [
        { expr: 'addChild (Text "B") (Element "a" [] [Text "A"])', expected: 'Element "a" [] [Text "A",Text "B"]' },
        { expr: "addChild x1 sentinel", expected: 'Element "" [] [Element "a" [] [Text "A"]]' },
        { expr: 'addChild (Text "z") (Element "q" [("k","v")] [])', expected: 'Element "q" [("k","v")] [Text "z"]' },
        { expr: 'addChild x1 (addChild (Text "1") (Element "r" [] []))', expected: 'Element "r" [] [Text "1",Element "a" [] [Text "A"]]' },
        { expr: 'addChild (Element "b" [] [Text "B"]) (Element "a" [("x","1")] [Element "b" [] [Text "A"]])', expected: "x2" },
        { expr: 'addChild (Text "") x1', expected: 'Element "a" [] [Text "A",Text ""]' },
      ],
    },
    {
      id: "getValue",
      name: "getValue",
      part: "Part I",
      marks: 4,
      prompt: md(
        "Define `getValue :: XML -> XML` which returns the *value* of an XML item: all its text fields joined together, including (recursively) the text inside its children, in order. Wrap the resulting string in a `Text`.",
        "",
        "```",
        "ghci> getValue x1",
        'Text "A"',
        "ghci> getValue x2",
        'Text "AB"',
        "```",
        "",
        "The value of `Text s` is just `Text s`.",
      ),
      hints: [
        "Write a helper that returns a plain `String`, then wrap it in `Text` at the end.",
        "The helper recurses over the tree: a `Text t` gives `t`; an `Element` gives the joined-up strings of all its children.",
        "`concatMap helper children` applies the helper to every child and joins the results.",
        md(
          "```",
          "getValue x = Text (textOf x)",
          "  where",
          "    textOf (Text t)          = t",
          "    textOf (Element _ _ cs)  = concatMap textOf cs",
          "```",
        ),
      ],
      solution: hs`getValue :: XML -> XML
getValue x
  = Text (textOf x)
  where
    textOf (Text t)         = t
    textOf (Element _ _ cs) = concatMap textOf cs`,
      tests: [
        { expr: "getValue x1", expected: 'Text "A"' },
        { expr: "getValue x2", expected: 'Text "AB"' },
        { expr: "getValue x3", expected: 'Text "text1text2text3text4"' },
        { expr: 'getValue (Text "hi")', expected: 'Text "hi"' },
        { expr: "getValue sentinel", expected: 'Text ""' },
        { expr: "getValue casablancaParsed", expected: 'Text "\\n  Michael Curtiz\\n  1942\\n"' },
        { expr: 'getValue (getChild "b" x3)', expected: 'Text "text1text2"' },
      ],
    },
    {
      id: "addText",
      name: "addText",
      part: "Part II",
      marks: 1,
      prompt: md(
        "Using `addChild`, or otherwise, define `addText :: String -> Stack -> Stack` which adds a new text field holding the given string to the children of the element on top of the stack. Precondition: the stack is non-empty.",
        "",
        "```",
        'ghci> addText "A" [Element "a" [] [], sentinel]',
        '[Element "a" [] [Text "A"],Element "" [] []]',
        "```",
      ),
      hints: [
        "Only the top of the stack (the head of the list) changes.",
        "Pattern match the stack as `e : rest`.",
        "The new top is `addChild (Text t) e`.",
        "`addText t (e : rest) = addChild (Text t) e : rest`",
      ],
      solution: hs`addText :: String -> Stack -> Stack
-- Pre: There is at least one Element on the stack
addText t (e : rest)
  = addChild (Text t) e : rest`,
      tests: [
        { expr: 'addText "A" [Element "a" [] [], sentinel]', expected: '[Element "a" [] [Text "A"],Element "" [] []]' },
        { expr: 'addText "x" [sentinel]', expected: '[Element "" [] [Text "x"]]' },
        { expr: 'addText "B" [Element "a" [] [Text "A"]]', expected: '[Element "a" [] [Text "A",Text "B"]]' },
        { expr: 'addText "\\n " [Element "film" [("title","Casablanca")] [], sentinel]', expected: '[Element "film" [("title","Casablanca")] [Text "\\n "],sentinel]' },
        { expr: 'length (addText "t" [x1, x2, sentinel])', expected: "3" },
        { expr: 'tail (addText "t" [x1, x2, sentinel])', expected: "[x2, sentinel]" },
      ],
    },
    {
      id: "popAndAdd",
      name: "popAndAdd",
      part: "Part II",
      marks: 1,
      prompt: md(
        "Again using `addChild`, or otherwise, define `popAndAdd :: Stack -> Stack` which removes the element on top of the stack and adds it as the last child of the element beneath it. Precondition: there are at least two elements on the stack.",
        "",
        "```",
        'ghci> popAndAdd [x1, Element "ab" [("a","1")] [], sentinel]',
        '[Element "ab" [("a","1")] [Element "a" [] [Text "A"]],Element "" [] []]',
        "```",
      ),
      hints: [
        "Pattern match the first two elements of the stack.",
        "`e1 : e2 : rest`: `e1` is the finished element, `e2` is its parent.",
        "The new stack has one element fewer: the updated parent, then the rest.",
        "`popAndAdd (e1 : e2 : rest) = addChild e1 e2 : rest`",
      ],
      solution: hs`popAndAdd :: Stack -> Stack
-- Pre: There are at least two Elements on the stack
popAndAdd (e1 : e2 : rest)
  = addChild e1 e2 : rest`,
      tests: [
        { expr: 'popAndAdd [x1, Element "ab" [("a","1")] [], sentinel]', expected: '[Element "ab" [("a","1")] [Element "a" [] [Text "A"]],Element "" [] []]' },
        { expr: "popAndAdd [x1, sentinel]", expected: '[Element "" [] [x1]]' },
        { expr: 'popAndAdd [Element "b" [] [Text "B"], Element "a" [("x","1")] [Element "b" [] [Text "A"]], sentinel]', expected: "[x2, sentinel]" },
        { expr: "length (popAndAdd [x1, x2, x3, sentinel])", expected: "3" },
        { expr: 'popAndAdd [Element "e" [] [], Element "f" [] [Text "t"]]', expected: '[Element "f" [] [Text "t", Element "e" [] []]]' },
      ],
    },
    {
      id: "parseAttributes",
      name: "parseAttributes",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define `parseAttributes :: String -> (Attributes, String)` which reads the attributes at the start of a string (the part of a start tag after the element name), returning the attribute list and the text left after the closing `>`:",
        "",
        "1. Skip whitespace (use `skipSpace`) and look at the first character.",
        "2. If it's `>`, there are no (more) attributes: return `[]` and the text after the `>`.",
        "3. Otherwise read one attribute: its name (use the given `parseName :: String -> (String, String)`, which returns the name and the rest of the string), then skip over the `=`, then the opening `\"`, then read the value up to the closing `\"`, then skip it. Recurse on what's left for the remaining attributes.",
        "",
        "Whitespace around the `=` and after the closing `\"` must be skipped. The input is always well formed.",
        "",
        "```",
        'ghci> parseAttributes "x=\\"7\\">rest of text"',
        '([("x","7")],"rest of text")',
        'ghci> parseAttributes "a = \\"0\\" b = \\"1\\" >rest of text"',
        '([("a","0"),("b","1")],"rest of text")',
        "```",
      ),
      hints: [
        "Recursion on the string, with a `case skipSpace s of` to choose between the `'>' : rest` case and the attribute case.",
        "In the attribute case, use a `where` clause with one step per line: `(name, r1) = parseName s'`, then drop the `=` (after skipping spaces), then drop the `\"` (after skipping spaces), then `(value, r2) = break (== '\"') ...`.",
        "`break (== '\"') str` splits the string at the closing quote; the second part *starts* with the quote, so `drop 1` (or `tail`) it before recursing. Recursion handles the whitespace after it, because each call starts with `skipSpace`.",
        md(
          "```",
          "parseAttributes s = case skipSpace s of",
          "  '>' : rest -> ([], rest)",
          "  s'         -> ((name, value) : atts, rest)",
          "    where",
          "      (name, r1)   = parseName s'",
          "      r2           = drop 1 (skipSpace r1)        -- past '='",
          "      r3           = drop 1 (skipSpace r2)        -- past opening quote",
          "      (value, r4)  = break (== '\"') r3",
          "      (atts, rest) = parseAttributes (drop 1 r4)  -- past closing quote",
          "```",
        ),
      ],
      solution: hs`parseAttributes :: String -> (Attributes, String)
-- Pre: The XML attributes string is well-formed
parseAttributes s
  = case skipSpace s of
      '>' : rest -> ([], rest)
      s'         -> ((name, value) : atts, rest)
        where
          (name, r1)   = parseName s'
          r2           = drop 1 (skipSpace r1)        -- skip the '='
          r3           = drop 1 (skipSpace r2)        -- skip the opening '"'
          (value, r4)  = break (== '"') r3
          (atts, rest) = parseAttributes (drop 1 r4)  -- skip the closing '"'`,
      tests: [
        { expr: 'parseAttributes "x=\\"7\\">rest of text"', expected: '([("x","7")],"rest of text")' },
        { expr: 'parseAttributes "a = \\"0\\" b = \\"1\\" >rest of text"', expected: '([("a","0"),("b","1")],"rest of text")' },
        { expr: 'parseAttributes ">abc"', expected: '([],"abc")' },
        { expr: 'parseAttributes "   >"', expected: '([],"")' },
        { expr: 'parseAttributes " title =  \\"2001: A Space Odyssey\\">\\n"', expected: '([("title","2001: A Space Odyssey")],"\\n")', label: "spaces inside the value are kept" },
        { expr: 'parseAttributes "data-x.1=\\"\\"   ><b>"', expected: '([("data-x.1","")],"<b>")' },
        { expr: 'parseAttributes "a=\\"1\\"b=\\"2\\">"', expected: '([("a","1"),("b","2")],"")' },
      ],
    },
    {
      id: "parse",
      name: "parse'",
      part: "Part II",
      marks: 7,
      prompt: md(
        "The given `parse` skips leading whitespace and starts your helper with a stack holding just the sentinel:",
        "",
        "```",
        "parse s = parse' (skipSpace s) [sentinel]",
        "```",
        "",
        "Define `parse' :: String -> Stack -> XML` using these rules, tried in order:",
        "",
        "1. If the input is empty, the result is the first child of the element on top of the stack.",
        "2. (a) If the input starts with `<` followed by `/`, it's an end tag: skip everything up to and including the next `>`, pop the top element and add it to the one below (`popAndAdd`), and carry on.",
        "   (b) Otherwise if it starts with `<`, it's a start tag: read the name (`parseName`) and the attributes (`parseAttributes`, which also consumes the `>`), push `Element name atts []` onto the stack, and carry on.",
        "   (c) Otherwise it's a text field: read up to, but not including, the next `<`, add it to the top element (`addText`), and carry on.",
        "",
        "```",
        "ghci> parse s1",
        'Element "a" [] [Text "A"]',
        "ghci> showXML (parse s2)",
        '"<a x=\\"1\\"><b>A</b><b>B</b></a>"',
        "ghci> printXML (parse casablanca)",
        '<film title="Casablanca">',
        "  <director>Michael Curtiz</director>",
        "  <year>1942</year>",
        "</film>",
        "ghci> parse films == filmsParsed",
        "True",
        "```",
        "",
        "Trailing whitespace after the last `>` becomes a final text child of the sentinel, which is ignored because only the sentinel's *first* child is returned.",
      ),
      hints: [
        "One equation per rule, using patterns on the string: `\"\"`, `'<' : '/' : rest`, `'<' : rest`, and anything else. The end-tag pattern must come before the start-tag one.",
        "Rule 1: `parse' \"\" (Element _ _ (x : _) : _) = x`. Rule 2a: `dropWhile (/= '>') rest` stops *at* the `>`, so `drop 1` that too.",
        "Rule 2b: `(name, r1) = parseName rest` then `(atts, r2) = parseAttributes r1`; recurse on `r2` with `Element name atts [] : stack`. Rule 2c: `(text, r) = break (== '<') s`.",
        md(
          "```",
          "parse' \"\" (Element _ _ (x : _) : _) = x",
          "parse' ('<' : '/' : rest) stack",
          "  = parse' (drop 1 (dropWhile (/= '>') rest)) (popAndAdd stack)",
          "parse' ('<' : rest) stack",
          "  = parse' r2 (Element name atts [] : stack)",
          "  where (name, r1) = parseName rest",
          "        (atts, r2) = parseAttributes r1",
          "parse' s stack",
          "  = parse' r (addText text stack)",
          "  where (text, r) = break (== '<') s",
          "```",
        ),
      ],
      solution: hs`parse' :: String -> Stack -> XML
parse' "" (Element _ _ (x : _) : _)
  = x
parse' ('<' : '/' : rest) stack
  -- An end tag: the top element is complete
  = parse' (drop 1 (dropWhile (/= '>') rest)) (popAndAdd stack)
parse' ('<' : rest) stack
  -- A start tag: push a new, empty element
  = parse' rest'' (Element name atts [] : stack)
  where
    (name, rest') = parseName rest
    (atts, rest'') = parseAttributes rest'
parse' s stack
  -- A text field, up to the next '<'
  = parse' rest (addText text stack)
  where
    (text, rest) = break (== '<') s`,
      tests: [
        { expr: "parse s1", expected: 'Element "a" [] [Text "A"]' },
        { expr: "showXML (parse s2)", expected: '"<a x=\\"1\\"><b>A</b><b>B</b></a>"' },
        { expr: "parse s2", expected: "x2" },
        { expr: "parse s3", expected: "x3" },
        { expr: "parse casablanca", expected: "casablancaParsed" },
        { expr: "parse films", expected: "filmsParsed" },
        { expr: "parse xsl6", expected: "xsl6Parsed" },
        { expr: "map parse [xsl1, xsl4, xsl5, xsl7, xsl8, xsl9]", expected: "[xsl1Parsed, xsl4Parsed, xsl5Parsed, xsl7Parsed, xsl8Parsed, xsl9Parsed]" },
        { expr: 'parse "  \\n <e></e>"', expected: 'Element "e" [] []', label: "leading whitespace and empty elements" },
        { expr: 'parse "<p> a <q k = \\"v\\" >b</q> </p>  "', expected: 'Element "p" [] [Text " a ",Element "q" [("k","v")] [Text "b"],Text " "]' },
      ],
    },
    {
      id: "expandXSL",
      name: "expandXSL'",
      part: "Part III",
      marks: 6,
      prompt: md(
        "The given `expandXSL` starts your helper with a context that is a made-up root element named `\"/\"` whose only child is the source document:",
        "",
        "```",
        "expandXSL xsl source = expandXSL' root xsl",
        "  where root = Element \"/\" [] [source]",
        "```",
        "",
        "Define `expandXSL' :: Context -> XSL -> [XML]` which expands an XSL template relative to the context element:",
        "",
        "- **Text** in the XSL is copied unchanged.",
        "- **`value-of`** (an element with that name) is replaced by exactly one `Text`: the value (as given by `getValue`) of the *first* item found by following its `select` path from the context, or `Text \"\"` if nothing is found. Any children of the `value-of` are ignored.",
        "- **`for-each`** is replaced by: for each item found by its `select` path (in document order), the expansion of all its children with that item as the new context.",
        "- **Any other element** is copied with the same name and attributes, with its children expanded in the same context.",
        "",
        "A path is steps separated by `/`, each followed in turn: `.` stays at the current item; `name` moves to *all* child elements called `name` (of every item reached so far); `@name` gives the value of that attribute (treat it as a `Text`).",
        "",
        "```",
        "ghci> expandXSL xsl1Parsed x1",
        '[Text ""]',
        "ghci> expandXSL xsl1Parsed x3",
        '[Text "text1"]',
        "ghci> expandXSL xsl2Parsed x3",
        '[Text "text1text2"]',
        "ghci> expandXSL xsl4Parsed x3",
        '[Text "att1"]',
        "ghci> expandXSL xsl5Parsed x3",
        '[Text "text1"]',
        "ghci> showXMLs (expandXSL xsl6Parsed x3)",
        '"<t1><t2>Preamble</t2><t3>text1</t3></t1>"',
        "ghci> expandXSL xsl7Parsed x3",
        '[Text "att1",Text "att2",Text "att3"]',
        "ghci> printXMLs (expandXSL xsl8Parsed x3)",
        "<t>text1</t>",
        "<t>text3</t>",
        "ghci> printXMLs (expandXSL xsl9Parsed x3)",
        "<t1></t1>",
        "<t1></t1>",
        "```",
        "",
        "Applying `parse filmsXSL` to `filmsParsed` produces the film table of Figure 3, one `tr` row per film.",
      ),
      hints: [
        "Write two helpers: one that splits a path string on `/` into a list of steps, and one that follows a list of steps from a context, returning the list of everything reached (`[XML]`).",
        "Following steps: no steps left gives `[ctx]`; `\".\"` continues from `ctx`; `'@' : att` gives `[Text v]` if the attribute exists, else `[]`; a name continues from every child: `concatMap (follow rest) (getChildren name ctx)`.",
        "In `expandXSL'`, match `Element \"value-of\" _ _` and `Element \"for-each\" _ cs` *before* the general `Element` case. Get the path with `getAttribute \"select\" xsl`. For `for-each`: `concat [concatMap (expandXSL' item) cs | item <- found]`.",
        md(
          "```",
          "expandXSL' _ (Text t) = [Text t]",
          "expandXSL' ctx xsl@(Element \"value-of\" _ _)",
          "  = case select ctx xsl of",
          "      []           -> [Text \"\"]",
          "      (item : _)   -> [getValue item]",
          "expandXSL' ctx xsl@(Element \"for-each\" _ cs)",
          "  = concat [concatMap (expandXSL' item) cs | item <- select ctx xsl]",
          "expandXSL' ctx (Element n atts cs)",
          "  = [Element n atts (concatMap (expandXSL' ctx) cs)]",
          "",
          "-- select ctx xsl = follow (splitPath (getAttribute \"select\" xsl)) ctx",
          "```",
        ),
      ],
      solution: hs`expandXSL' :: Context -> XSL -> [XML]
expandXSL' _ (Text t)
  = [Text t]
expandXSL' ctx xsl@(Element "value-of" _ _)
  = case selectXPath ctx xsl of
      []       -> [Text ""]
      item : _ -> [getValue item]
expandXSL' ctx xsl@(Element "for-each" _ cs)
  = concat [concatMap (expandXSL' item) cs | item <- selectXPath ctx xsl]
expandXSL' ctx (Element n atts cs)
  = [Element n atts (concatMap (expandXSL' ctx) cs)]

-- Everything reached by the select path of an XSL operator element
selectXPath :: Context -> XSL -> [XML]
selectXPath ctx xsl
  = followSteps (splitXPath (getAttribute "select" xsl)) ctx

-- "a/./b" becomes ["a", ".", "b"]
splitXPath :: String -> [String]
splitXPath path
  = case break (== '/') path of
      (step, [])       -> [step]
      (step, _ : rest) -> step : splitXPath rest

followSteps :: [String] -> XML -> [XML]
followSteps [] ctx
  = [ctx]
followSteps ("." : steps) ctx
  = followSteps steps ctx
followSteps (('@' : att) : _) (Element _ atts _)
  = case lookup att atts of
      Just v  -> [Text v]
      Nothing -> []
followSteps (('@' : _) : _) _
  = []
followSteps (name : steps) ctx
  = concatMap (followSteps steps) (getChildren name ctx)`,
      tests: [
        { expr: "expandXSL xsl1Parsed x1", expected: '[Text ""]' },
        { expr: "expandXSL xsl1Parsed x3", expected: '[Text "text1"]' },
        { expr: "expandXSL xsl2Parsed x3", expected: '[Text "text1text2"]' },
        { expr: "expandXSL xsl3Parsed x3", expected: '[Text "text4"]', label: "the first item found, even if it's in the second b" },
        { expr: "expandXSL xsl4Parsed x3", expected: '[Text "att1"]' },
        { expr: "expandXSL xsl5Parsed x3", expected: '[Text "text1"]' },
        { expr: "showXMLs (expandXSL xsl6Parsed x3)", expected: '"<t1><t2>Preamble</t2><t3>text1</t3></t1>"' },
        { expr: "expandXSL xsl7Parsed x3", expected: '[Text "att1",Text "att2",Text "att3"]' },
        { expr: "map showXML (expandXSL xsl8Parsed x3)", expected: '["<t>text1</t>","<t>text3</t>"]' },
        { expr: "map showXML (expandXSL xsl9Parsed x3)", expected: '["<t1></t1>","<t1></t1>"]' },
        { expr: "expandXSL xsl7Parsed x1", expected: "[]", label: "for-each over nothing produces nothing" },
        {
          expr: 'let out = showXMLs (expandXSL (parse filmsXSL) filmsParsed) in all (\\s -> isInfixOf s out) ["<td>Rear Window</td>", "<td>Stanley Kubrick</td>", "<td>Richard Strauss</td>", "<td>Lawrence of Arabia</td>", "<td>Maurice Jarre</td>", "<th align=\\"left\\">Title</th>"] && not (isInfixOf "Ligeti" out) && not (isInfixOf "for-each" out)',
          label: "the film table of Figure 3",
        },
        {
          expr: 'let out = showXMLs (expandXSL (parse composersXSL) filmsParsed) in all (\\s -> isInfixOf s out) ["<li>Gyorgy Ligeti</li>", "<li>Johann Strauss</li>", "<li>Franz Waxman</li>", "<li>Maurice Jarre</li>"]',
          label: "composer list: nested for-each and the '.' step",
        },
      ],
    },
  ],
};
