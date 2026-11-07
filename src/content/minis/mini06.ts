import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "m06",
  year: 0,
  difficulty: 6,
  minutes: 60,
  title: "Mini paper 6: File system directory tree",
  summary:
    "Walk a tree of folders and files: total the sizes, list every path, find files by extension, find the deepest path and delete an entry.",
  skills: [
    "rose trees (a node with a list of children)",
    "recursion with map/sum over children",
    "list comprehensions with a recursive generator",
    "building paths with ++",
    "isSuffixOf",
    "choosing the longest list with a tie-break",
    "rebuilding a tree with one change",
  ],
  story: md(
    "Every computer organises its files in a tree. This paper asks you to write a few of the tools that `ls`, `du` and `find` provide.",
    "",
    "**The domain.** A **file system** is made of **files** and **directories** (folders). A file has a name and a size in bytes. A directory has a name and contains any number of entries, each of which is a file or another directory. Here is the example file system `home`, with file sizes:",
    "",
    "```",
    "home",
    "├── todo.txt          120",
    "├── pics",
    "│   ├── cat.png      2048",
    "│   ├── dog.png      3072",
    "│   └── old",
    "│       └── me.jpg   1500",
    "├── code",
    "│   ├── Main.hs       800",
    "│   ├── lib",
    "│   │   └── utils",
    "│   │       └── List.hs  400",
    "│   └── notes.txt     300",
    "└── empty",
    "```",
    "",
    "`empty` is a directory with nothing in it.",
    "",
    "**Paths.** Every entry is reached from the top (the **root**, here `home`) by a **path**: the names of the directories you go through and finally the entry's own name, joined with `/`. The path of `me.jpg` is `\"home/pics/old/me.jpg\"`, and the path of the `pics` directory is `\"home/pics\"`. The root's path is just `\"home\"`.",
    "",
    "**Extensions.** The **extension** of a file is the part of its name after a dot at the end: `cat.png` has extension `png` and `Main.hs` has extension `hs`. We say a name *has extension* `ext` if it ends with a dot followed by `ext`.",
    "",
    "### The given types",
    "",
    "```haskell",
    "type Name = String",
    "type Size = Int",
    "",
    "data FileSystem = File Name Size",
    "                | Dir Name [FileSystem]",
    "```",
    "",
    "- `File \"cat.png\" 2048` is a file.",
    "- `Dir \"old\" [File \"me.jpg\" 1500]` is a directory containing one file. `Dir \"empty\" []` is an empty directory.",
    "",
    "This is a **rose tree**: unlike the family tree of mini paper 5, where every node had exactly two subtrees, a `Dir` can have *any number* of children, kept in a list. The recursion pattern is: for a `Dir`, apply your function to every child (with `map` or a list comprehension) and combine the results (with `sum`, `concat`, `maximum`, ...). For example, the number of files:",
    "",
    "```haskell",
    "countFiles :: FileSystem -> Int",
    "countFiles (File _ _)    = 1",
    "countFiles (Dir _ items) = sum (map countFiles items)",
    "```",
    "",
    "Paths are represented in two ways in this paper: as a `String` with slashes, like `\"home/pics/cat.png\"`, or as a list of names, like `[\"home\", \"pics\", \"cat.png\"]`. Each question says which one it uses.",
    "",
    "You are given `nameOf :: FileSystem -> Name` (the name of a file or directory), `countFiles` (above) and the example file system `home`. `Data.List` is imported for you. Within one directory, all the names are different.",
  ),
  notes: md(
    "**Where the marks are (15 total).** `totalSize` 2, `hasExtension` 2, `allPaths` 3, `findByExtension` 2, `deepestPath` 3, `removePath` 3.",
    "",
    "**Order of attack.** In order. `hasExtension` is used by `findByExtension`, and `findByExtension` is almost the same as `allPaths`, so do `allPaths` first. `deepestPath` and `removePath` are independent of each other.",
    "",
    "**Strategy.**",
    "",
    "- Every function has two equations: one for `File` and one for `Dir`. Look at the `countFiles` example in the story and copy its shape.",
    "- For paths, think about what the recursive call returns for a child (paths that start at the child), then stick the directory's name and a `/` on the front of each.",
    "- A list comprehension with two generators, `[... | item <- items, p <- allPaths item]`, walks every child and every result from that child.",
    "",
    "**Traps.**",
    "",
    "- An empty directory has size 0 and contains no files, but it does have a path, and `deepestPath` of `Dir \"empty\" []` is `[\"empty\"]`.",
    "- `hasExtension \"txt\" \"txt\"` is `False`: there must be a dot before the extension.",
    "- `deepestPath` must pick the **first** of several equally deep paths. `maximumBy` returns the *last* one on a tie, so write your own choice.",
    "- `removePath` never removes the root, and leaves the tree unchanged if the path doesn't exist.",
  ),
  setup: hs`import Data.List

type Name = String

type Size = Int

data FileSystem = File Name Size
                | Dir Name [FileSystem]
  deriving (Eq, Show)

nameOf :: FileSystem -> Name
nameOf (File n _) = n
nameOf (Dir n _) = n

countFiles :: FileSystem -> Int
countFiles (File _ _) = 1
countFiles (Dir _ items) = sum (map countFiles items)

--------------------------------------------------------------
-- Example data

home :: FileSystem
home
  = Dir "home"
      [File "todo.txt" 120,
       Dir "pics"
         [File "cat.png" 2048,
          File "dog.png" 3072,
          Dir "old" [File "me.jpg" 1500]],
       Dir "code"
         [File "Main.hs" 800,
          Dir "lib" [Dir "utils" [File "List.hs" 400]],
          File "notes.txt" 300],
       Dir "empty" []]
`,
  starter: hs`--------------------------------------------------------------
-- Part I

totalSize :: FileSystem -> Size
totalSize = undefined

hasExtension :: String -> Name -> Bool
hasExtension = undefined

allPaths :: FileSystem -> [String]
allPaths = undefined

findByExtension :: String -> FileSystem -> [String]
findByExtension = undefined

--------------------------------------------------------------
-- Part II

deepestPath :: FileSystem -> [Name]
deepestPath = undefined

removePath :: [Name] -> FileSystem -> FileSystem
removePath = undefined
`,
  tasks: [
    {
      id: "totalSize",
      name: "totalSize",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `totalSize :: FileSystem -> Size` that returns the total size of all the files in a file system. Directories themselves have no size. For example:",
        "",
        "```",
        "ghci> totalSize home",
        "8240",
        "ghci> totalSize (File \"a.txt\" 50)",
        "50",
        "ghci> totalSize (Dir \"empty\" [])",
        "0",
        "```",
      ),
      hints: [
        "Same shape as `countFiles` in the story: one equation for `File`, one for `Dir`.",
        "A file's total size is its own size.",
        "A directory's total size is the sum of the total sizes of its items: `sum (map totalSize items)`. An empty directory gives `sum [] = 0` automatically.",
        md(
          "```",
          "totalSize (File _ s)    = s",
          "totalSize (Dir _ items) = sum (map totalSize items)",
          "```",
        ),
      ],
      solution: hs`totalSize :: FileSystem -> Size
totalSize (File _ s) = s
totalSize (Dir _ items) = sum (map totalSize items)`,
      tests: [
        { expr: "totalSize home", expected: "8240" },
        { expr: 'totalSize (File "a.txt" 50)', expected: "50" },
        { expr: 'totalSize (Dir "empty" [])', expected: "0" },
        { expr: 'totalSize (Dir "a" [Dir "b" [Dir "c" [File "x" 7]], File "y" 3])', expected: "10" },
        { expr: "map totalSize (let Dir _ items = home in items)", expected: "[120,6620,1500,0]" },
        { expr: 'totalSize (Dir "d" [File "z" 0])', expected: "0" },
      ],
    },
    {
      id: "hasExtension",
      name: "hasExtension",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `hasExtension :: String -> Name -> Bool` such that `hasExtension ext name` is `True` exactly when `name` ends with a dot followed by `ext`. For example:",
        "",
        "```",
        "ghci> hasExtension \"png\" \"cat.png\"",
        "True",
        "ghci> hasExtension \"png\" \"cat.jpg\"",
        "False",
        "ghci> hasExtension \"txt\" \"txt\"",
        "False",
        "ghci> hasExtension \"gz\" \"backup.tar.gz\"",
        "True",
        "```",
      ),
      hints: [
        "Build the string the name must end with, then test whether it really ends with it.",
        "The ending is a dot followed by the extension: `'.' : ext` (so `\".png\"` for `\"png\"`).",
        "`isSuffixOf xs ys` from `Data.List` is `True` when `ys` ends with `xs`: `isSuffixOf \".png\" \"cat.png\"` is `True`.",
        "`hasExtension ext name = isSuffixOf ('.' : ext) name`.",
      ],
      solution: hs`hasExtension :: String -> Name -> Bool
hasExtension ext name = isSuffixOf ('.' : ext) name`,
      tests: [
        { expr: 'hasExtension "png" "cat.png"', expected: "True" },
        { expr: 'hasExtension "png" "cat.jpg"', expected: "False" },
        { expr: 'hasExtension "txt" "txt"', expected: "False", label: "there must be a dot before the extension" },
        { expr: 'hasExtension "gz" "backup.tar.gz"', expected: "True" },
        { expr: 'hasExtension "tar" "backup.tar.gz"', expected: "False" },
        { expr: 'hasExtension "hs" "Main.hs"', expected: "True" },
        { expr: 'hasExtension "s" "Main.hs"', expected: "False", label: "the whole extension must match" },
        { expr: 'hasExtension "png" ""', expected: "False" },
      ],
    },
    {
      id: "allPaths",
      name: "allPaths",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define a function `allPaths :: FileSystem -> [String]` that returns the path of **every** entry in the file system (files and directories, including the root), each written with `/` between the names. For example:",
        "",
        "```",
        "ghci> allPaths (Dir \"pics\" [File \"cat.png\" 2048, Dir \"old\" [File \"me.jpg\" 1500]])",
        "[\"pics\",\"pics/cat.png\",\"pics/old\",\"pics/old/me.jpg\"]",
        "ghci> allPaths (File \"a.txt\" 50)",
        "[\"a.txt\"]",
        "ghci> length (allPaths home)",
        "14",
        "```",
        "",
        "The order of the paths doesn't matter.",
      ),
      hints: [
        "A file's only path is its own name. A directory's paths are its own name, plus the paths of everything inside it with `dirName ++ \"/\"` put on the front.",
        "The recursive call `allPaths item` gives the paths inside one child, starting at the child's name (like `\"old/me.jpg\"`). Prefix each with the directory's name and a slash to get `\"pics/old/me.jpg\"`.",
        "A list comprehension with two generators visits every child and every path from that child: `[n ++ \"/\" ++ p | item <- items, p <- allPaths item]`.",
        md(
          "```",
          "allPaths (File n _)     = [n]",
          "allPaths (Dir n items)  = n : [n ++ \"/\" ++ p | item <- items, p <- allPaths item]",
          "```",
        ),
      ],
      solution: hs`allPaths :: FileSystem -> [String]
allPaths (File n _) = [n]
allPaths (Dir n items) = n : [n ++ "/" ++ p | item <- items, p <- allPaths item]`,
      tests: [
        {
          expr: 'allPaths (Dir "pics" [File "cat.png" 2048, Dir "old" [File "me.jpg" 1500]])',
          expected: '["pics","pics/cat.png","pics/old","pics/old/me.jpg"]',
          unordered: true,
        },
        { expr: 'allPaths (File "a.txt" 50)', expected: '["a.txt"]' },
        { expr: "length (allPaths home)", expected: "14" },
        { expr: 'allPaths (Dir "empty" [])', expected: '["empty"]' },
        { expr: 'elem "home/code/lib/utils/List.hs" (allPaths home)', expected: "True" },
        { expr: 'elem "home/empty" (allPaths home)', expected: "True" },
        {
          expr: 'allPaths (Dir "a" [Dir "b" [], File "c" 1])',
          expected: '["a","a/b","a/c"]',
          unordered: true,
        },
      ],
    },
    {
      id: "findByExtension",
      name: "findByExtension",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Using `hasExtension`, define a function `findByExtension :: String -> FileSystem -> [String]` that returns the paths (written with `/`, as in `allPaths`) of all the **files** whose name has the given extension. Directories are never included, even if their name happens to end in the extension. For example:",
        "",
        "```",
        "ghci> findByExtension \"png\" home",
        "[\"home/pics/cat.png\",\"home/pics/dog.png\"]",
        "ghci> findByExtension \"txt\" home",
        "[\"home/todo.txt\",\"home/code/notes.txt\"]",
        "ghci> findByExtension \"pdf\" home",
        "[]",
        "```",
        "",
        "The order of the paths doesn't matter.",
      ),
      hints: [
        "Copy the shape of `allPaths`, but only produce a path for a file when its name has the extension, and never for a directory's own name.",
        "For a file: the result is `[n]` if `hasExtension ext n`, and `[]` otherwise. A one-generator comprehension with just a condition does this: `[n | hasExtension ext n]`.",
        "For a directory: don't include `n` itself, just prefix every path found inside its children: `[n ++ \"/\" ++ p | item <- items, p <- findByExtension ext item]`.",
        md(
          "```",
          "findByExtension ext (File n _) = [n | hasExtension ext n]",
          "findByExtension ext (Dir n items)",
          "  = [n ++ \"/\" ++ p | item <- items, p <- findByExtension ext item]",
          "```",
        ),
      ],
      solution: hs`findByExtension :: String -> FileSystem -> [String]
findByExtension ext (File n _) = [n | hasExtension ext n]
findByExtension ext (Dir n items)
  = [n ++ "/" ++ p | item <- items, p <- findByExtension ext item]`,
      tests: [
        { expr: 'findByExtension "png" home', expected: '["home/pics/cat.png","home/pics/dog.png"]', unordered: true },
        { expr: 'findByExtension "txt" home', expected: '["home/todo.txt","home/code/notes.txt"]', unordered: true },
        { expr: 'findByExtension "pdf" home', expected: "[]" },
        { expr: 'findByExtension "hs" home', expected: '["home/code/Main.hs","home/code/lib/utils/List.hs"]', unordered: true },
        { expr: 'findByExtension "jpg" home', expected: '["home/pics/old/me.jpg"]' },
        { expr: 'findByExtension "txt" (File "a.txt" 5)', expected: '["a.txt"]' },
        { expr: 'findByExtension "d" (Dir "x.d" [Dir "y.d" []])', expected: "[]", label: "directories are never included" },
        { expr: 'findByExtension "d" (Dir "x.d" [File "y.d" 1])', expected: '["x.d/y.d"]' },
      ],
    },
    {
      id: "deepestPath",
      name: "deepestPath",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define a function `deepestPath :: FileSystem -> [Name]` that returns the longest path from the root to any entry, as a **list of names** (root first). If several paths are equally long, return the one that comes **first** (leftmost in the tree). An empty directory or a file is itself the end of a path. For example:",
        "",
        "```",
        "ghci> deepestPath home",
        "[\"home\",\"code\",\"lib\",\"utils\",\"List.hs\"]",
        "ghci> deepestPath (Dir \"a\" [File \"x\" 1, File \"y\" 2])",
        "[\"a\",\"x\"]",
        "ghci> deepestPath (Dir \"empty\" [])",
        "[\"empty\"]",
        "ghci> deepestPath (File \"a.txt\" 50)",
        "[\"a.txt\"]",
        "```",
      ),
      hints: [
        "Three cases: a `File n _` gives `[n]`; an empty `Dir n []` gives `[n]`; a `Dir n items` with children gives `n` on the front of the longest of its children's deepest paths.",
        "`map deepestPath items` gives one candidate path per child. You need to pick the longest, taking the *first* one on a tie.",
        "Write a helper `longer p q` that returns `q` only if it is strictly longer than `p`, and `p` otherwise. Then `foldr1 longer` picks the right one: on a tie the earlier path wins. (`maximumBy (comparing length)` returns the *last* of the longest, which is wrong here.)",
        md(
          "```",
          "deepestPath (File n _)  = [n]",
          "deepestPath (Dir n [])  = [n]",
          "deepestPath (Dir n items) = n : foldr1 longer (map deepestPath items)",
          "  where",
          "    longer p q",
          "      | length q > length p = q",
          "      | otherwise           = p",
          "```",
        ),
      ],
      solution: hs`deepestPath :: FileSystem -> [Name]
deepestPath (File n _) = [n]
deepestPath (Dir n []) = [n]
deepestPath (Dir n items) = n : foldr1 longer (map deepestPath items)
  where
    longer p q
      | length q > length p = q
      | otherwise = p`,
      tests: [
        { expr: "deepestPath home", expected: '["home","code","lib","utils","List.hs"]' },
        { expr: 'deepestPath (Dir "a" [File "x" 1, File "y" 2])', expected: '["a","x"]', label: "a tie: the first one wins" },
        { expr: 'deepestPath (Dir "empty" [])', expected: '["empty"]' },
        { expr: 'deepestPath (File "a.txt" 50)', expected: '["a.txt"]' },
        { expr: 'deepestPath (Dir "a" [File "x" 1, Dir "b" []])', expected: '["a","x"]', label: "an empty directory ties with a file" },
        { expr: 'deepestPath (Dir "a" [File "x" 1, Dir "b" [File "y" 1]])', expected: '["a","b","y"]' },
        {
          expr: 'deepestPath (Dir "r" [Dir "p" [Dir "q" []], Dir "s" [Dir "t" [File "u" 1]], Dir "v" [Dir "w" [Dir "z" []]]])',
          expected: '["r","s","t","u"]',
        },
        { expr: 'deepestPath (Dir "pics" [File "cat.png" 1, Dir "old" [File "me.jpg" 1]])', expected: '["pics","old","me.jpg"]' },
      ],
    },
    {
      id: "removePath",
      name: "removePath",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define a function `removePath :: [Name] -> FileSystem -> FileSystem` that deletes the entry (a file, or a directory with everything inside it) at the given path. The path is a list of names starting with the root's name, and always has at least two names (the root itself is never removed). If there is no entry at that path, the file system is returned unchanged. Everything else keeps its original order. For example:",
        "",
        "```",
        "ghci> removePath [\"home\", \"pics\", \"dog.png\"] (Dir \"home\" [Dir \"pics\" [File \"cat.png\" 2048, File \"dog.png\" 3072]])",
        "Dir \"home\" [Dir \"pics\" [File \"cat.png\" 2048]]",
        "ghci> removePath [\"home\", \"code\"] home",
        "Dir \"home\" [File \"todo.txt\" 120,Dir \"pics\" [File \"cat.png\" 2048,File \"dog.png\" 3072,Dir \"old\" [File \"me.jpg\" 1500]],Dir \"empty\" []]",
        "ghci> removePath [\"home\", \"pics\", \"bird.png\"] home == home",
        "True",
        "```",
      ),
      hints: [
        "Follow the path down the tree, one name at a time. Each step, the first name in the path must be the name of the directory you are in; if it isn't, the path doesn't exist here and nothing changes.",
        "When the path is exactly `[d, target]` and you are in directory `d`, remove the child called `target` from the items: `filter (\\item -> nameOf item /= target) items`.",
        "When the path is longer, `d : rest`, and you are in directory `d`, rebuild the directory with `removePath rest` applied to every child (`map (removePath rest) items`). Children whose name doesn't match `head rest` come back unchanged. Any other case (a `File`, or a name that doesn't match) returns the input unchanged.",
        md(
          "```",
          "removePath [d, target] (Dir n items)",
          "  | d == n = Dir n (filter (\\item -> nameOf item /= target) items)",
          "removePath (d : rest) (Dir n items)",
          "  | d == n = Dir n (map (removePath rest) items)",
          "removePath _ fs = fs",
          "```",
        ),
      ],
      solution: hs`removePath :: [Name] -> FileSystem -> FileSystem
removePath [d, target] (Dir n items)
  | d == n = Dir n (filter (\item -> nameOf item /= target) items)
removePath (d : rest) (Dir n items)
  | d == n = Dir n (map (removePath rest) items)
removePath _ fs = fs`,
      tests: [
        {
          expr: 'removePath ["home", "pics", "dog.png"] (Dir "home" [Dir "pics" [File "cat.png" 2048, File "dog.png" 3072]])',
          expected: 'Dir "home" [Dir "pics" [File "cat.png" 2048]]',
        },
        {
          expr: 'removePath ["home", "code"] home',
          expected:
            'Dir "home" [File "todo.txt" 120,Dir "pics" [File "cat.png" 2048,File "dog.png" 3072,Dir "old" [File "me.jpg" 1500]],Dir "empty" []]',
          label: "removing a whole directory",
        },
        { expr: 'removePath ["home", "pics", "bird.png"] home', expected: "home" },
        { expr: 'removePath ["work", "todo.txt"] home', expected: "home", label: "the root name must match" },
        { expr: 'totalSize (removePath ["home", "code", "lib", "utils", "List.hs"] home)', expected: "7840" },
        { expr: 'deepestPath (removePath ["home", "code", "lib"] home)', expected: '["home","pics","old","me.jpg"]' },
        { expr: 'removePath ["home", "todo.txt", "x"] home', expected: "home", label: "you can't go inside a file" },
        { expr: 'length (allPaths (removePath ["home", "empty"] home))', expected: "13" },
        { expr: 'removePath ["a", "b"] (Dir "a" [File "b" 1, Dir "c" [File "b" 2]])', expected: 'Dir "a" [Dir "c" [File "b" 2]]', label: "only the entry at that exact path goes" },
      ],
    },
  ],
};
