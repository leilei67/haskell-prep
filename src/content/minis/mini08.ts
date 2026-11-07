import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "m08",
  year: 0,
  difficulty: 8,
  minutes: 75,
  title: "Mini paper 8: JSON documents",
  summary:
    "JSON-like values as a tree of numbers, strings, arrays and objects: look up fields, follow a path, count keys, print as JSON text, change a value deep inside, and check a document against a simple schema.",
  skills: [
    "a data type with list-carrying constructors",
    "recursion through lists of children (map, sum, all)",
    "Maybe for lookups that can fail",
    "paths: recursion on two things at once",
    "rebuilding a tree with one part changed",
    "intercalate for joining text",
    "list comprehensions over key-value pairs",
  ],
  story: md(
    "**The domain.** JSON is the text format almost every website uses to send data. A JSON document looks like this:",
    "",
    "```",
    '{"name": "Alice", "age": 30, "admin": true,',
    ' "pets": ["cat", "fish"],',
    ' "address": {"city": "London", "postcode": "SW7 2AZ"}}',
    "```",
    "",
    "A JSON value is one of:",
    "",
    "- a **number** such as `30` (whole numbers only in this paper),",
    "- a **string** in double quotes such as `\"Alice\"`,",
    "- a **Boolean**, written `true` or `false`,",
    "- `null`, meaning \"no value\",",
    "- an **array**: a list of values in square brackets, such as `[\"cat\", \"fish\"]`,",
    "- an **object**: a list of *fields* in curly brackets. Each field is a **key** (a string) with a value, written `\"key\": value`.",
    "",
    "Arrays and objects contain other values, which can themselves be arrays and objects, so a JSON document is a **tree**. The top of the tree above is an object with five fields, and the `address` field holds a smaller object.",
    "",
    "**Paths.** To point at a value deep inside a document we give a **path**: the steps to follow from the top. `address` then `city` leads to `\"London\"`. In an array we step by **position** instead, counting from 0: `pets` then position 1 leads to `\"fish\"`.",
    "",
    "**Schemas.** A schema describes what a document should look like, e.g. \"an object with a string field `name`, a number field `age` and a field `pets` holding an array of strings\". Programs check incoming documents against a schema before trusting them.",
    "",
    "### The given types",
    "",
    "```haskell",
    "data Value = Number Int",
    "           | Str String",
    "           | Bool Bool",
    "           | Null",
    "           | Array [Value]",
    "           | Object [(String, Value)]",
    "",
    "data Key = Field String | Index Int",
    "",
    "type Path = [Key]",
    "",
    "data Schema = SNumber | SString | SBool | SAny",
    "            | SArrayOf Schema",
    "            | SObject [(String, Schema)]",
    "```",
    "",
    "- `Value` has one constructor per kind of JSON value. Note `Bool Bool`: the constructor is called `Bool` and it holds a Haskell `Bool`, so `Bool True` is the JSON `true`. An object is a list of (key, value) pairs; keys in one object are all different.",
    "- A `Key` is one step of a path: `Field \"city\"` steps into an object's field, `Index 1` steps to position 1 of an array.",
    "- A `Schema` describes a shape: `SNumber`, `SString` and `SBool` match one kind of value; `SAny` matches anything; `SArrayOf s` matches arrays whose elements all match `s`; `SObject` lists fields that must be present.",
    "",
    "Given to you: two example documents, `alice` (shown above) and `shop`, and three example schemas, `personSchema`, `itemSchema` and `shopSchema`:",
    "",
    "```",
    '{"open": false,',
    ' "items": [{"id": 1, "price": 250, "tags": ["new"]},',
    '           {"id": 2, "price": 99, "tags": []}],',
    ' "owner": null}',
    "```",
  ),
  notes: md(
    "**Where the marks are.** Part I (single steps) is 4 marks, Part II (whole trees and paths) is 11 and Part III (schemas) is 3.",
    "",
    "**Order of attack.** `typeName` and `field` are warm-ups. `query` reuses `field`. `countKeys` and `render` are both \"one equation per constructor, recurse into the children\": the new thing compared to an expression tree is that children come in a *list*, so you will use `map`, `sum` and `intercalate` instead of naming two children. `setAt` is the hardest task: it rebuilds the tree with one value changed. `validate` is independent of `setAt`, so if `setAt` is fighting you, do `validate` first.",
    "",
    "**Traps.**",
    "",
    "- `Index` positions count from 0, and a position outside the array means \"not found\" (no crash: guard before using `!!`).",
    "- `countKeys` counts keys at *every* level, including objects inside arrays.",
    "- In `render`, strings get double quotes and so do object keys, but numbers, Booleans and `null` don't. Separators are a comma followed by a space, and a key is followed by a colon and a space.",
    "- `setAt` with a path that leads nowhere must return the document unchanged, not crash.",
    "- In `validate`, objects may have extra fields that the schema doesn't mention, and `Null` only matches `SAny`.",
  ),
  setup: hs`import Data.List
import Data.Maybe

data Value = Number Int
           | Str String
           | Bool Bool
           | Null
           | Array [Value]
           | Object [(String, Value)]
           deriving (Eq, Show)

data Key = Field String | Index Int
         deriving (Eq, Show)

type Path = [Key]

data Schema = SNumber | SString | SBool | SAny
            | SArrayOf Schema
            | SObject [(String, Schema)]
            deriving (Eq, Show)

--------------------------------------------------------------
-- Example data

alice :: Value
alice
  = Object [ ("name", Str "Alice")
           , ("age", Number 30)
           , ("admin", Bool True)
           , ("pets", Array [Str "cat", Str "fish"])
           , ("address", Object [ ("city", Str "London")
                                , ("postcode", Str "SW7 2AZ") ])
           ]

shop :: Value
shop
  = Object [ ("open", Bool False)
           , ("items", Array [ Object [ ("id", Number 1)
                                      , ("price", Number 250)
                                      , ("tags", Array [Str "new"]) ]
                             , Object [ ("id", Number 2)
                                      , ("price", Number 99)
                                      , ("tags", Array []) ]
                             ])
           , ("owner", Null)
           ]

personSchema :: Schema
personSchema
  = SObject [("name", SString), ("age", SNumber), ("pets", SArrayOf SString)]

itemSchema :: Schema
itemSchema
  = SObject [("id", SNumber), ("price", SNumber), ("tags", SArrayOf SString)]

shopSchema :: Schema
shopSchema
  = SObject [("open", SBool), ("items", SArrayOf itemSchema), ("owner", SAny)]
`,
  starter: hs`--------------------------------------------------------------
-- Part I

typeName :: Value -> String
typeName = undefined

field :: String -> Value -> Maybe Value
field = undefined

--------------------------------------------------------------
-- Part II

query :: Path -> Value -> Maybe Value
query = undefined

countKeys :: Value -> Int
countKeys = undefined

render :: Value -> String
render = undefined

setAt :: Path -> Value -> Value -> Value
setAt = undefined

--------------------------------------------------------------
-- Part III

validate :: Schema -> Value -> Bool
validate = undefined
`,
  tasks: [
    {
      id: "typeName",
      name: "typeName",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `typeName :: Value -> String` that names the kind of a value: `\"number\"`, `\"string\"`, `\"bool\"`, `\"null\"`, `\"array\"` or `\"object\"`. For example:",
        "",
        "```",
        "ghci> typeName (Number 3)",
        "\"number\"",
        "ghci> typeName alice",
        "\"object\"",
        "ghci> typeName (Array [])",
        "\"array\"",
        "```",
      ),
      hints: [
        "One equation per constructor of `Value`, six in all.",
        "You don't need the contents, so use `_` for them: `typeName (Number _) = \"number\"`.",
        "`Null` has no contents at all, so its pattern is just `Null`.",
        md(
          "```",
          "typeName (Number _) = \"number\"",
          "typeName (Str _) = \"string\"",
          "typeName (Bool _) = \"bool\"",
          "typeName Null = \"null\"",
          "typeName (Array _) = \"array\"",
          "typeName (Object _) = \"object\"",
          "```",
        ),
      ],
      solution: hs`typeName :: Value -> String
typeName (Number _) = "number"
typeName (Str _) = "string"
typeName (Bool _) = "bool"
typeName Null = "null"
typeName (Array _) = "array"
typeName (Object _) = "object"`,
      tests: [
        { expr: "typeName (Number 3)", expected: '"number"' },
        { expr: "typeName alice", expected: '"object"' },
        { expr: "typeName (Array [])", expected: '"array"' },
        { expr: 'typeName (Str "")', expected: '"string"' },
        { expr: "typeName (Bool False)", expected: '"bool"' },
        { expr: "typeName Null", expected: '"null"' },
      ],
    },
    {
      id: "field",
      name: "field",
      part: "Part I",
      marks: 2,
      prompt: md(
        "Define a function `field :: String -> Value -> Maybe Value` that looks up a key in an object. The result is `Just` the field's value if the value is an object with that key, and `Nothing` if the key is missing or the value is not an object at all. For example:",
        "",
        "```",
        "ghci> field \"age\" alice",
        "Just (Number 30)",
        "ghci> field \"email\" alice",
        "Nothing",
        "ghci> field \"age\" (Number 30)",
        "Nothing",
        "```",
      ),
      hints: [
        "Two equations: one for `Object`, and a catch-all for everything else.",
        "An object holds a list of (key, value) pairs. Which Prelude function looks up a key in such a list?",
        "`lookup k kvs` returns a `Maybe` already, which is exactly the answer.",
        md(
          "```",
          "field k (Object kvs) = lookup k kvs",
          "field _ _ = Nothing",
          "```",
        ),
      ],
      solution: hs`field :: String -> Value -> Maybe Value
field k (Object kvs) = lookup k kvs
field _ _ = Nothing`,
      tests: [
        { expr: 'field "age" alice', expected: "Just (Number 30)" },
        { expr: 'field "email" alice', expected: "Nothing" },
        { expr: 'field "age" (Number 30)', expected: "Nothing" },
        { expr: 'field "pets" alice', expected: 'Just (Array [Str "cat",Str "fish"])' },
        { expr: 'field "owner" shop', expected: "Just Null" },
        { expr: 'field "x" (Object [])', expected: "Nothing" },
        { expr: 'field "name" (Array [alice])', expected: "Nothing", label: "an array is not an object" },
      ],
    },
    {
      id: "query",
      name: "query",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define a function `query :: Path -> Value -> Maybe Value` that follows a path from the top of a value and returns what it finds:",
        "",
        "- The empty path leads to the value itself.",
        "- `Field k` steps into field `k` of an object.",
        "- `Index i` steps to position `i` of an array (the first element is position 0).",
        "",
        "If any step is impossible (missing key, position outside the array, or the wrong kind of value), the result is `Nothing`. For example:",
        "",
        "```",
        "ghci> query [Field \"address\", Field \"city\"] alice",
        "Just (Str \"London\")",
        "ghci> query [Field \"pets\", Index 1] alice",
        "Just (Str \"fish\")",
        "ghci> query [Field \"items\", Index 0, Field \"price\"] shop",
        "Just (Number 250)",
        "ghci> query [Field \"pets\", Index 2] alice",
        "Nothing",
        "ghci> query [] (Number 3)",
        "Just (Number 3)",
        "```",
      ),
      hints: [
        "Recursion on the path: take one step, then follow the rest of the path from where you landed.",
        "For `Field k : rest`, use your `field`. It returns a `Maybe`, so `case` on it: `Nothing` stays `Nothing`, `Just v'` continues with `query rest v'`.",
        "For `Index i : rest` match the value as `Array vs` and guard with `i >= 0 && i < length vs` before using `vs !! i`. A final catch-all equation returns `Nothing`.",
        md(
          "```",
          "query [] v = Just v",
          "query (Field k : rest) v",
          "  = case field k v of",
          "      Nothing -> Nothing",
          "      Just v' -> query rest v'",
          "query (Index i : rest) (Array vs)",
          "  | i >= 0 && i < length vs = query rest (vs !! i)",
          "query _ _ = Nothing",
          "```",
        ),
      ],
      solution: hs`query :: Path -> Value -> Maybe Value
query [] v = Just v
query (Field k : rest) v
  = case field k v of
      Nothing -> Nothing
      Just v' -> query rest v'
query (Index i : rest) (Array vs)
  | i >= 0 && i < length vs = query rest (vs !! i)
query _ _ = Nothing`,
      tests: [
        { expr: 'query [Field "address", Field "city"] alice', expected: 'Just (Str "London")' },
        { expr: 'query [Field "pets", Index 1] alice', expected: 'Just (Str "fish")' },
        { expr: 'query [Field "items", Index 0, Field "price"] shop', expected: "Just (Number 250)" },
        { expr: 'query [Field "pets", Index 2] alice', expected: "Nothing" },
        { expr: "query [] (Number 3)", expected: "Just (Number 3)" },
        { expr: 'query [Field "pets", Index (-1)] alice', expected: "Nothing" },
        { expr: 'query [Field "age", Field "years"] alice', expected: "Nothing", label: "can't step into a number" },
        { expr: "query [Index 0] alice", expected: "Nothing", label: "can't index into an object" },
        { expr: 'query [Field "items", Index 1, Field "tags"] shop', expected: "Just (Array [])" },
      ],
    },
    {
      id: "countKeys",
      name: "countKeys",
      part: "Part II",
      marks: 2,
      prompt: md(
        "Define a function `countKeys :: Value -> Int` that counts the keys of every object anywhere inside a value, including objects nested inside other objects and inside arrays. For example:",
        "",
        "```",
        "ghci> countKeys alice",
        "7",
        "ghci> countKeys shop",
        "9",
        "ghci> countKeys (Array [Number 1, Number 2])",
        "0",
        "```",
        "",
        "`alice` has 5 keys at the top and 2 inside `address`. `shop` has 3 at the top and 3 in each of the two items.",
      ),
      hints: [
        "Three cases: objects, arrays, and everything else (which has no keys).",
        "An array has as many keys as all its elements together: `sum (map countKeys vs)`.",
        "An object has its own keys (`length kvs`) plus the keys inside all its field values. `map snd kvs` gives the field values.",
        md(
          "```",
          "countKeys (Object kvs) = length kvs + sum (map countKeys (map snd kvs))",
          "countKeys (Array vs) = sum (map countKeys vs)",
          "countKeys _ = 0",
          "```",
        ),
      ],
      solution: hs`countKeys :: Value -> Int
countKeys (Object kvs) = length kvs + sum (map countKeys (map snd kvs))
countKeys (Array vs) = sum (map countKeys vs)
countKeys _ = 0`,
      tests: [
        { expr: "countKeys alice", expected: "7" },
        { expr: "countKeys shop", expected: "9" },
        { expr: "countKeys (Array [Number 1, Number 2])", expected: "0" },
        { expr: "countKeys (Object [])", expected: "0" },
        { expr: "countKeys Null", expected: "0" },
        { expr: "countKeys (Array [alice, alice])", expected: "14" },
        { expr: 'countKeys (Object [("a", Object [("b", Object [("c", Null)])])])', expected: "3" },
      ],
    },
    {
      id: "render",
      name: "render",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define a function `render :: Value -> String` that turns a value into JSON text:",
        "",
        "- A number is shown with `show`. A string is put between double-quote characters. Booleans are `true` and `false`, and `Null` is `null`.",
        "- An array is `[`, then its rendered elements separated by `, ` (comma, space), then `]`.",
        "- An object is `{`, then its fields separated by `, `, then `}`. Each field is the key in double quotes, then `: ` (colon, space), then the rendered value.",
        "",
        "You may assume strings and keys contain no double quotes or backslashes. For example:",
        "",
        "```",
        "ghci> render (Array [Number 1, Bool True, Null])",
        "\"[1, true, null]\"",
        "ghci> putStrLn (render alice)",
        '{"name": "Alice", "age": 30, "admin": true, "pets": ["cat", "fish"], "address": {"city": "London", "postcode": "SW7 2AZ"}}',
        "ghci> putStrLn (render (Object []))",
        "{}",
        "```",
        "",
        "(`putStrLn` prints the text itself; without it, GHCi shows the string with every inner quote written as `\\\"`.)",
      ),
      hints: [
        "One equation per constructor. The array and object cases call `render` on each child with `map`.",
        "`intercalate \", \" [\"a\", \"b\", \"c\"]` is `\"a, b, c\"`: it joins a list of strings with a separator in between (it is in `Data.List`, already imported).",
        "Write a tiny helper `quote s = \"\\\"\" ++ s ++ \"\\\"\"` (in Haskell source, a double quote inside a string is written backslash, double quote). Use it for strings and for keys.",
        md(
          "```",
          "render (Array vs) = \"[\" ++ intercalate \", \" (map render vs) ++ \"]\"",
          "render (Object kvs)",
          "  = \"{\" ++ intercalate \", \" [quote k ++ \": \" ++ render v | (k, v) <- kvs] ++ \"}\"",
          "```",
        ),
      ],
      solution: hs`render :: Value -> String
render (Number n) = show n
render (Str s) = quote s
render (Bool True) = "true"
render (Bool False) = "false"
render Null = "null"
render (Array vs) = "[" ++ intercalate ", " (map render vs) ++ "]"
render (Object kvs)
  = "{" ++ intercalate ", " [quote k ++ ": " ++ render v | (k, v) <- kvs] ++ "}"

quote :: String -> String
quote s = "\"" ++ s ++ "\""`,
      tests: [
        { expr: "render (Array [Number 1, Bool True, Null])", expected: '"[1, true, null]"' },
        {
          expr: "render alice",
          expected: hs`"{\"name\": \"Alice\", \"age\": 30, \"admin\": true, \"pets\": [\"cat\", \"fish\"], \"address\": {\"city\": \"London\", \"postcode\": \"SW7 2AZ\"}}"`,
        },
        { expr: "render (Object [])", expected: '"{}"' },
        { expr: "render (Array [])", expected: '"[]"' },
        { expr: 'render (Str "hi")', expected: hs`"\"hi\""` },
        { expr: "render (Number (-4))", expected: '"-4"' },
        {
          expr: "render shop",
          expected: hs`"{\"open\": false, \"items\": [{\"id\": 1, \"price\": 250, \"tags\": [\"new\"]}, {\"id\": 2, \"price\": 99, \"tags\": []}], \"owner\": null}"`,
        },
        { expr: "render (Array [Array [Number 1], Array []])", expected: '"[[1], []]"' },
      ],
    },
    {
      id: "setAt",
      name: "setAt",
      part: "Part II",
      marks: 3,
      prompt: md(
        "Define a function `setAt :: Path -> Value -> Value -> Value` so that `setAt path new doc` is the document `doc` with the value at `path` replaced by `new`. Everything else in the document stays exactly as it was (including the order of fields and elements). The empty path replaces the whole document. If the path does not lead to an existing value, the document is returned unchanged (no new fields are added). For example:",
        "",
        "```",
        "ghci> setAt [Field \"open\"] (Bool True) shop",
        "Object [(\"open\",Bool True),(\"items\",...),(\"owner\",Null)]",
        "ghci> query [Field \"address\", Field \"city\"] (setAt [Field \"address\", Field \"city\"] (Str \"Leeds\") alice)",
        "Just (Str \"Leeds\")",
        "ghci> setAt [Index 1] Null (Array [Number 1, Number 2, Number 3])",
        "Array [Number 1,Null,Number 3]",
        "ghci> setAt [Field \"email\"] (Str \"a@b.com\") alice == alice",
        "True",
        "```",
      ),
      hints: [
        "Recursion on the path, like `query`. But instead of *returning* the value you find, you *rebuild* the object or array around a changed child.",
        "For `Field k : rest` on `Object kvs`, rebuild every pair: the pair whose key is `k` gets `setAt rest new v` as its value, all the others are kept. A list comprehension with `if ... then ... else` does this in one line.",
        "For `Index i : rest` on `Array vs`, number the elements with `zip [0 ..] vs` and change only the one at position `i`. Add a catch-all `setAt _ _ doc = doc` for impossible steps. A missing key or bad position then changes nothing automatically.",
        md(
          "```",
          "setAt [] new _ = new",
          "setAt (Field k : rest) new (Object kvs)",
          "  = Object [if k' == k then (k', setAt rest new v) else (k', v) | (k', v) <- kvs]",
          "setAt (Index i : rest) new (Array vs)",
          "  = Array [if j == i then setAt rest new v else v | (j, v) <- zip [0 ..] vs]",
          "setAt _ _ doc = doc",
          "```",
        ),
      ],
      solution: hs`setAt :: Path -> Value -> Value -> Value
setAt [] new _ = new
setAt (Field k : rest) new (Object kvs)
  = Object [if k' == k then (k', setAt rest new v) else (k', v) | (k', v) <- kvs]
setAt (Index i : rest) new (Array vs)
  = Array [if j == i then setAt rest new v else v | (j, v) <- zip [0 ..] vs]
setAt _ _ doc = doc`,
      tests: [
        {
          expr: 'setAt [Field "open"] (Bool True) shop',
          expected: 'Object [("open", Bool True), ("items", fromJust (field "items" shop)), ("owner", Null)]',
        },
        { expr: 'query [Field "address", Field "city"] (setAt [Field "address", Field "city"] (Str "Leeds") alice)', expected: 'Just (Str "Leeds")' },
        { expr: "setAt [Index 1] Null (Array [Number 1, Number 2, Number 3])", expected: "Array [Number 1, Null, Number 3]" },
        { expr: 'setAt [Field "email"] (Str "a@b.com") alice', expected: "alice", label: "missing key: unchanged" },
        { expr: "setAt [] Null alice", expected: "Null" },
        { expr: 'setAt [Field "pets", Index 5] Null alice', expected: "alice", label: "bad position: unchanged" },
        {
          expr: 'setAt [Field "items", Index 1, Field "price"] (Number 120) shop',
          expected:
            'Object [("open", Bool False), ("items", Array [Object [("id", Number 1), ("price", Number 250), ("tags", Array [Str "new"])], Object [("id", Number 2), ("price", Number 120), ("tags", Array [])]]), ("owner", Null)]',
        },
        { expr: 'setAt [Field "a"] (Number 2) (Object [("a", Number 1), ("b", Number 1)])', expected: 'Object [("a", Number 2), ("b", Number 1)]' },
        { expr: 'setAt [Field "age", Field "x"] Null alice', expected: "alice", label: "can't step into a number: unchanged" },
      ],
    },
    {
      id: "validate",
      name: "validate",
      part: "Part III",
      marks: 3,
      prompt: md(
        "Define a function `validate :: Schema -> Value -> Bool` that checks whether a value has the shape described by a schema:",
        "",
        "- `SNumber`, `SString` and `SBool` match exactly the numbers, strings and Booleans respectively.",
        "- `SAny` matches every value (including `Null`, which matches nothing else).",
        "- `SArrayOf s` matches an array whose elements **all** match `s` (so an empty array always matches).",
        "- `SObject fields` matches an object that has every field listed, with each field's value matching its schema. The object may have extra fields that the schema doesn't mention.",
        "",
        "For example:",
        "",
        "```",
        "ghci> validate personSchema alice",
        "True",
        "ghci> validate shopSchema shop",
        "True",
        "ghci> validate personSchema shop",
        "False",
        "ghci> validate personSchema (setAt [Field \"pets\", Index 0] (Number 7) alice)",
        "False",
        "ghci> validate (SArrayOf SNumber) (Array [])",
        "True",
        "```",
      ),
      hints: [
        "Pattern match on the schema and the value together, with a final catch-all `validate _ _ = False` for every mismatch.",
        "`validate SAny _ = True` goes first. For arrays: `validate (SArrayOf s) (Array vs) = all (validate s) vs`.",
        "For objects, check each `(k, s)` in the schema's field list: look the key up in the value with your `field`; `Nothing` means fail, `Just v'` means `validate s v'` must hold. `and` of a list comprehension combines the checks.",
        md(
          "```",
          "validate (SObject fs) v@(Object _)",
          "  = and [ok (field k v) s | (k, s) <- fs]",
          "  where",
          "    ok (Just v') s = validate s v'",
          "    ok Nothing _ = False",
          "```",
        ),
      ],
      solution: hs`validate :: Schema -> Value -> Bool
validate SAny _ = True
validate SNumber (Number _) = True
validate SString (Str _) = True
validate SBool (Bool _) = True
validate (SArrayOf s) (Array vs) = all (validate s) vs
validate (SObject fs) v@(Object _)
  = and [ok (field k v) s | (k, s) <- fs]
  where
    ok (Just v') s = validate s v'
    ok Nothing _ = False
validate _ _ = False`,
      tests: [
        { expr: "validate personSchema alice", expected: "True" },
        { expr: "validate shopSchema shop", expected: "True" },
        { expr: "validate personSchema shop", expected: "False" },
        { expr: 'validate personSchema (setAt [Field "pets", Index 0] (Number 7) alice)', expected: "False" },
        { expr: "validate (SArrayOf SNumber) (Array [])", expected: "True" },
        { expr: 'validate personSchema (Object [("name", Str "Bob"), ("age", Number 5)])', expected: "False", label: "a required field is missing" },
        { expr: "validate SAny Null", expected: "True" },
        { expr: "validate SNumber Null", expected: "False" },
        { expr: "validate (SObject []) (Number 1)", expected: "False", label: "SObject only matches objects" },
        { expr: 'validate shopSchema (setAt [Field "items", Index 1, Field "tags"] (Array [Bool True]) shop)', expected: "False" },
      ],
    },
  ],
};
