import { type Exam, hs, md } from "../schema.ts";

export const exam: Exam = {
  id: "y2024",
  year: 2024,
  title: "Symbolic Integration",
  summary:
    "Add, multiply, differentiate and integrate polynomials, then differentiate any expression and integrate many of them using the inverse chain rule.",
  skills: [
    "merging two sorted lists",
    "list comprehensions",
    "foldr over a list of values",
    "Rational arithmetic",
    "recursion over an expression tree",
    "Maybe results and fmap",
    "case on a pair of Maybes",
    "guards",
    "comparing simplified forms with ==",
  ],
  story: md(
    "This paper makes Haskell do calculus with symbols, the way you would on paper, rather than with numbers. Don't panic if calculus is rusty: everything you need is below, and most of the marks are for plain list processing.",
    "",
    "**Polynomials.** A polynomial in x is a sum of terms, each a number times a power of x, like",
    "",
    "```",
    "2x^3 - 2x + 2",
    "```",
    "",
    "Each term has a **coefficient** (the number in front, here 2, -2 and 2) and an **exponent** (the power of x, here 3, 1 and 0; remember x^0 = 1 and x^1 = x). **Standard form** means the terms are written in decreasing order of exponent, with at most one term per exponent and no zero terms.",
    "",
    "In this paper a polynomial is a list of `(coefficient, exponent)` pairs, in standard form. Coefficients are `Rational` (exact fractions) and exponents are `Integer`s that are 0 or more:",
    "",
    "```haskell",
    "type Coefficient = Rational",
    "type Exponent = Integer",
    "type Term = (Coefficient, Exponent)",
    "type Polynomial = [Term]",
    "```",
    "",
    "So `2x^3 - 2x + 2` is `[(2,3),(-2,1),(2,0)]`, the number 4 is `[(4,0)]`, x is `[(1,1)]` and -(2/3)x is `[(-2 % 3,1)]`. `%` (from `Data.Ratio`) builds a fraction: `2 % 3` is two thirds. Zero is written `[(0,0)]`; the empty list `[]` is never a valid polynomial.",
    "",
    "**Differentiation** finds the slope (rate of change) of a function. You only need these rules (`'` means \"derivative of\"):",
    "",
    "```",
    "a'           = 0                      (a constant)",
    "(x^n)'       = n x^(n-1)",
    "(f + g)'     = f' + g'",
    "(f g)'       = f g' + f' g            (product rule)",
    "(log f)'     = f' / f   =  f' f^(-1)",
    "(f^n)'       = n f^(n-1) f'           (chain rule for powers)",
    "```",
    "",
    "The **chain rule** in general says: if h(x) = f(g(x)), then h'(x) = f'(g(x)) g'(x). Differentiate the outside, keep the inside, then multiply by the derivative of the inside. For example (x^2 + 1)^3 has derivative 3 (x^2 + 1)^2 times 2x.",
    "",
    "**Integration** goes backwards: the integral of f is a function whose derivative is f. The rules here:",
    "",
    "```",
    "integral of a f        = a (integral of f)           (a constant)",
    "integral of f + g      = (integral of f) + (integral of g)",
    "integral of x^n        = x^(n+1) / (n+1)             (n not -1)",
    "integral of x^(-1)     = log x",
    "integral of log x      = x (log x - 1)",
    "```",
    "",
    "Every integral really has \"+ c\" at the end (any constant c works, since constants have derivative 0). This paper leaves the c off, and any constants that appear in your answer count as part of c.",
    "",
    "**The inverse chain rule.** There's no simple product rule for integration. The trick this paper uses: if the thing you're integrating looks like g'(x) times f(g(x)), substitute u = g(x), integrate f(u) instead, and put g(x) back for u:",
    "",
    "```",
    "integral of g'(x) f(g(x))  =  integral of f(u),  with u = g(x)",
    "```",
    "",
    "Example: (4x - 3) log(2x^2 - 3x + 1). Here g = 2x^2 - 3x + 1 and g' = 4x - 3 (check!), f = log. The integral of log u is u (log u - 1), so the answer is (2x^2 - 3x + 1)(log(2x^2 - 3x + 1) - 1).",
    "",
    "Three special cases matter. If f is \"do nothing\" (the identity), then g' g integrates to g^2 / 2. If g is just x, then g' is 1, so any f(x) is 1 times f(g(x)): that's how you integrate log x or x^(1/2) on their own. And (the \"twist\") g' might only be a constant multiple of what's there: (4x - 3) (10x^2 - 15x + 5)^(3/2) has g' = 20x - 15, which is 5 times (4x - 3), so you divide the answer by 5.",
    "",
    "**Expressions.** Beyond polynomials, functions are trees:",
    "",
    "```haskell",
    "data Expr = P Polynomial | Add Expr Expr | Mul Expr Expr | Pow Expr Rational | Log Expr",
    "  deriving (Eq, Ord, Show)",
    "```",
    "",
    "- `P p` is a polynomial. Every constant is a polynomial like `P [(5,0)]`.",
    "- `Add e1 e2` is e1 + e2. There's no subtraction: e - 1 is `Add e (P [(-1,0)])`.",
    "- `Mul e1 e2` is e1 times e2.",
    "- `Pow e r` is e to the power r, where r is a `Rational` and may be negative or a fraction: `Pow e (1/2)` is the square root of e, `Pow e (-1)` is 1/e.",
    "- `Log e` is the natural logarithm of e.",
    "",
    "The given `pretty` and `prettyPrint` show these in a readable way. Polynomials go in square brackets, `.` means multiply (not function composition!), and fractions are shown in brackets like `(2/3)`:",
    "",
    "```",
    "*Main> prettyPrint e12",
    "[4x - 3] . log[2x^2 - 3x + 1]",
    "```",
    "",
    "There's also a given `simplify` that tidies an expression (collecting like terms, multiplying out polynomials, pulling out common factors, ordering the pieces). Results are compared after simplifying, because the same function can be written many ways.",
  ),
  notes: md(
    "**Compile or lose marks.** This is the modern exam format: a program that does not compile gets a TWO MARK PENALTY, and the auto-tests can't run at all. Before you finish, make sure the file compiles. Any function you couldn't get working must either keep a compiling body like `= undefined`, or be commented out with `--` (or `{- ... -}`), keeping its type signature and an `undefined` body so the tests still compile. Recompile after every function, not at the end.",
    "",
    "**Where the marks are (30 total).** Part I is 13 marks of polynomial list processing: `addP`/`mulP` 8, `sumP`/`prodP` 1, `diffT`/`intT` 3, `diffP`/`intP` 1. Part II, `diffE`, is 7 marks. Part III, `intE`, is 10 marks and much less guided.",
    "",
    "**Order of attack.** Part I first and carefully: it's the most marks per minute. `addP` is the key function (a merge of two sorted lists), and `mulP`, `sumP` and `prodP` can all be built from it. Then `diffE`, which is five equations straight off the rules. Then `intE`, building it up in stages: polynomials, sums and constant multiples first (that gets the easy tests), then the inverse chain rule.",
    "",
    "**Traps.**",
    "",
    "- Keep polynomials in standard form: no zero terms, and zero itself is `[(0,0)]`, never `[]`. `addP p3 (negative of p3)` must give `[(0,0)]`.",
    "- `diffT (c, 0)` is `(0, 0)`: be careful not to produce an exponent of -1.",
    "- `intT (c, n)` divides by `n + 1`. Use `fromIntegral` to turn the `Integer` exponent into a `Rational`.",
    "- In `intE`, the inverse chain rule must be tried both ways round (`Mul a b` and `Mul b a`), and the \"identity\" case must be tried even when the outside is a `Pow` or `Log` (that's how (log x)/x integrates).",
    "- Compare derivatives after `simplify`, never raw: `diffE` produces lots of `[1] .` and `+ [0]` noise.",
    "- `diffE` and `intE` are tested after simplification, so your output doesn't have to look exactly like the paper's, as long as it's mathematically right.",
  ),
  setup: hs`import Data.List
import Data.Maybe
import Data.Ratio

------------------------------------------------------------
-- Types

type Coefficient = Rational

type Exponent = Integer

type Term = (Coefficient, Exponent)

type Polynomial = [Term]

data Expr = P Polynomial
          | Add Expr Expr
          | Mul Expr Expr
          | Pow Expr Rational
          | Log Expr
  deriving (Eq, Ord, Show)

------------------------------------------------------------
-- Given in the template

toExpr :: Rational -> Expr
toExpr n = P [(n, 0)]

isConstant :: Expr -> Bool
isConstant (P [(_, 0)]) = True
isConstant _ = False

simplifiedDiff :: Expr -> Expr
simplifiedDiff = simplify . diffE

printDiff :: Expr -> IO ()
printDiff = prettyPrint . simplifiedDiff

simplifiedInt :: Expr -> Maybe Expr
simplifiedInt e = fmap simplify (intE e)

printInt :: Expr -> IO ()
printInt e = putStrLn (maybe "Fail" pretty (simplifiedInt e))

------------------------------------------------------------
-- Utilities: pretty printing

class Pretty a where
  pretty :: a -> String

instance (c ~ Rational, n ~ Integer) => Pretty [(c, n)] where
  pretty p = "[" ++ uShowTerms p ++ "]"

instance Pretty Expr where
  pretty = uPrettyE

prettyPrint :: Pretty a => a -> IO ()
prettyPrint = putStrLn . pretty

uShowTerms :: Polynomial -> String
uShowTerms [] = "0"
uShowTerms (t : ts) = showFirst t ++ concatMap showLater ts
  where
    showFirst (c, n)
      | uIsWhole c && c < 0 = "-" ++ uShowCoeff (negate c) n ++ uShowX n
      | otherwise = uShowCoeff c n ++ uShowX n
    showLater (c, n)
      | uIsWhole c && c < 0 = " - " ++ uShowCoeff (negate c) n ++ uShowX n
      | otherwise = " + " ++ uShowCoeff c n ++ uShowX n

uIsWhole :: Rational -> Bool
uIsWhole r = denominator r == 1

uShowCoeff :: Rational -> Integer -> String
uShowCoeff c n
  | c == 1 && n > 0 = ""
  | otherwise = uShowRational c

uShowRational :: Rational -> String
uShowRational r
  | uIsWhole r = show (numerator r)
  | otherwise = "(" ++ show (numerator r) ++ "/" ++ show (denominator r) ++ ")"

uShowX :: Integer -> String
uShowX 0 = ""
uShowX 1 = "x"
uShowX n = "x^" ++ show n

uPrettyE :: Expr -> String
uPrettyE (P p) = pretty p
uPrettyE (Add e1 e2) = uPrettyE e1 ++ " + " ++ uPrettyE e2
uPrettyE (Mul e1 e2) = factor e1 ++ " . " ++ factor e2
  where
    factor e@(Add _ _) = "(" ++ uPrettyE e ++ ")"
    factor e = uPrettyE e
uPrettyE (Pow e r) = base e ++ "^" ++ uShowRational r
  where
    base b@(P [_]) = uPrettyE b
    base b = "(" ++ uPrettyE b ++ ")"
uPrettyE (Log e@(P _)) = "log" ++ uPrettyE e
uPrettyE (Log e) = "log(" ++ uPrettyE e ++ ")"

------------------------------------------------------------
-- Utilities: simplify

-- Polynomial helpers (the Utilities module's own versions)
uTidy :: Polynomial -> Polynomial
uTidy p = case [(c, n) | n <- exps, let c = sum [c' | (c', m) <- p, m == n], c /= 0] of
            [] -> [(0, 0)]
            q -> q
  where
    exps = reverse (sort (nub (map snd p)))

uMulP :: Polynomial -> Polynomial -> Polynomial
uMulP p q = uTidy [(c1 * c2, n1 + n2) | (c1, n1) <- p, (c2, n2) <- q]

uPowP :: Polynomial -> Integer -> Polynomial
uPowP p k = foldr uMulP [(1, 0)] (genericReplicate k p)

uScaleP :: Rational -> Polynomial -> Polynomial
uScaleP k p = uTidy [(k * c, n) | (c, n) <- p]

uIsConstP :: Polynomial -> Bool
uIsConstP p = all ((== 0) . snd) p

uConstOf :: Polynomial -> Rational
uConstOf p = sum (map fst p)

-- The constant factor that leaves whole, coprime coefficients and a
-- positive leading coefficient
uContent :: Polynomial -> Rational
uContent [] = 1
uContent p@((lead, _) : _) = signum lead * (fromIntegral g % l)
  where
    l = foldr lcm 1 (map (denominator . fst) p)
    g = foldr gcd 0 [numerator (c * fromIntegral l) | (c, _) <- p]

uIsNatural :: Rational -> Bool
uIsNatural r = uIsWhole r && r >= 0

simplify :: Expr -> Expr
simplify = uPresent . uNorm

uNorm :: Expr -> Expr
uNorm (P p) = P (uTidy p)
uNorm (Add e1 e2) = uNormSum (uSumTerms (uNorm e1) ++ uSumTerms (uNorm e2))
uNorm (Mul e1 e2) = uNormProd (uProdFactors (uNorm e1) ++ uProdFactors (uNorm e2))
uNorm (Pow e r) = uNormPow (uNorm e) r
uNorm (Log e) = uNormLog (uNorm e)

uSumTerms :: Expr -> [Expr]
uSumTerms (Add e1 e2) = uSumTerms e1 ++ uSumTerms e2
uSumTerms e = [e]

uProdFactors :: Expr -> [Expr]
uProdFactors (Mul e1 e2) = uProdFactors e1 ++ uProdFactors e2
uProdFactors e = [e]

uMkSum :: [Expr] -> Expr
uMkSum [] = P [(0, 0)]
uMkSum es = foldr1 Add es

uMkProd :: [Expr] -> Expr
uMkProd [] = P [(1, 0)]
uMkProd es = foldr1 Mul es

uNormSum :: [Expr] -> Expr
uNormSum ts = uMkSum (polyPart ++ sort others)
  where
    q = foldr (\t acc -> uTidy (t ++ acc)) [(0, 0)] [p | P p <- ts]
    polyPart = if q == [(0, 0)] then [] else [P q]
    grouped = foldl uAddLike [] [uSplitCoeff t | t <- ts, not (uIsPoly t)]
    others = [uNormProd [P [(c, 0)], k] | (k, c) <- grouped, c /= 0]
    uAddLike acc (c, k) = case lookup k acc of
                           Nothing -> acc ++ [(k, c)]
                           Just c' -> [(k', if k' == k then c + c' else c'') | (k', c'') <- acc]

uIsPoly :: Expr -> Bool
uIsPoly (P _) = True
uIsPoly _ = False

-- Splits a (normalised) term into a constant coefficient and the rest
uSplitCoeff :: Expr -> (Rational, Expr)
uSplitCoeff t = case uProdFactors t of
  (P p : rest@(_ : _))
    | uIsConstP p -> (uConstOf p, uMkProd rest)
    | otherwise -> let k = uContent p in (k, uMkProd (P (uScaleP (1 / k) p) : rest))
  _ -> (1, t)

uNormProd :: [Expr] -> Expr
uNormProd fs
  | q == [(0, 0)] = P [(0, 0)]
  | otherwise = uFinish (concatMap uProdFactors rebuilt)
  where
    q = foldr uMulP [(1, 0)] [p | P p <- fs]
    (k, polyBase) = if uIsConstP q then (uConstOf q, []) else (1, [(P q, 1)])
    powers = foldl uAddPower [] (polyBase ++ [uBaseExp f | f <- fs, not (uIsPoly f)])
    rebuilt = [uNormPow b r | (b, r) <- powers, r /= 0]
    uAddPower acc (b, r) = case lookup b acc of
                            Nothing -> acc ++ [(b, r)]
                            Just _ -> [(b', if b' == b then r + r' else r') | (b', r') <- acc]
    uFinish gs = case (q', others) of
                  (_, []) -> P q'
                  ([(1, 0)], _) -> uMkProd others
                  _ -> uMkProd (P q' : others)
      where
        q' = uScaleP k (foldr uMulP [(1, 0)] [p | P p <- gs])
        others = sort [g | g <- gs, not (uIsPoly g)]

uBaseExp :: Expr -> (Expr, Rational)
uBaseExp (Pow b r) = (b, r)
uBaseExp e = (e, 1)

uNormPow :: Expr -> Rational -> Expr
uNormPow _ 0 = P [(1, 0)]
uNormPow e 1 = e
uNormPow (P p) r
  | uIsConstP p && uIsWhole r && (uConstOf p /= 0 || r > 0) = P (uTidy [(uConstOf p ^^ numerator r, 0)])
  | not (uIsConstP p) && uIsNatural r = P (uPowP p (numerator r))
uNormPow (P [(1, k)]) r
  | k > 1 = uNormPow (P [(1, 1)]) (r * fromIntegral k)
uNormPow (Pow b m) r = uNormPow b (m * r)
uNormPow e r = Pow e r

uNormLog :: Expr -> Expr
uNormLog (Pow b r) = uNormProd [P [(r, 0)], uNormLog b]
uNormLog e = Log e

-- Final presentation: pull the common constant factor out of each polynomial
uPresent :: Expr -> Expr
uPresent (P p) = uMkProd (uSplitPoly p)
uPresent (Add e1 e2) = Add (uPresent e1) (uPresent e2)
uPresent e@(Mul _ _) = uMkProd (concatMap (uProdFactors . uPresent) (uProdFactors e))
uPresent (Pow e r) = Pow (uPresent e) r
uPresent (Log e) = Log (uPresent e)

uSplitPoly :: Polynomial -> [Expr]
uSplitPoly p
  | length p < 2 || k == 1 = [P p]
  | otherwise = [P [(k, 0)], P (uScaleP (1 / k) p)]
  where
    k = uContent p

------------------------------------------------------------
-- Numerical checking, used by the tests (Doubles, so Log works)

evalE :: Expr -> Double -> Double
evalE (P p) x = sum [fromRational c * x ^ n | (c, n) <- p]
evalE (Add e1 e2) x = evalE e1 x + evalE e2 x
evalE (Mul e1 e2) x = evalE e1 x * evalE e2 x
evalE (Pow e r) x
  | uIsWhole r = evalE e x ^^ numerator r
  | otherwise = evalE e x ** fromRational r
evalE (Log e) x = log (evalE e x)

testPoints :: [Double]
testPoints = [2, 2.5, 3.25, 4]

closeTo :: Double -> Double -> Bool
closeTo a b = abs (a - b) <= 1e-5 * maximum [1, abs a, abs b]

-- f and g take the same value at every test point
sameFunction :: Expr -> Expr -> Bool
sameFunction f g = and [closeTo (evalE f x) (evalE g x) | x <- testPoints]

-- f and g differ by the same constant at every test point
sameUpToConstant :: Expr -> Expr -> Bool
sameUpToConstant f g = and [closeTo (diff x) (diff 2) | x <- testPoints]
  where
    diff x = evalE f x - evalE g x

-- d is the derivative of f (checked numerically at every test point)
isDerivativeOf :: Expr -> Expr -> Bool
isDerivativeOf d f = and [closeTo (evalE d x) (slope x) | x <- testPoints]
  where
    h = 1e-5
    slope x = (evalE f (x + h) - evalE f (x - h)) / (2 * h)

diffWorks :: Expr -> Bool
diffWorks e = isDerivativeOf (diffE e) e

intWorks :: Expr -> Bool
intWorks e = case intE e of
               Just i -> isDerivativeOf e i
               Nothing -> False

-- intE e succeeds and matches the expected answer, up to the constant of integration
intMatches :: Expr -> Expr -> Bool
intMatches e expected = case intE e of
                          Just i -> sameUpToConstant i expected
                          Nothing -> False

------------------------------------------------------------
-- Examples

p1, p2, p3, p4, p5 :: Polynomial
p1 = [(5, 0)]
p2 = [(1, 1)]
p3 = [(2, 2), (-3, 1), (1, 0)]
p4 = [(4, 1), (-3, 0)]
p5 = [(2, 3), (-2, 1), (2, 0)]

x :: Expr
x = P [(1, 1)]

e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11, e12, e13, e14, e15, e16 :: Expr
e1 = P p1
e2 = P p2
e3 = P p3
e4 = P p4
e5 = P p5
e6 = Add e3 e5
e7 = Mul e1 (Pow e2 (1 / 2))
e8 = Log e2
e9 = Pow e2 (-1)
e10 = Mul e4 e3
e11 = Mul (Pow e2 (-1)) (Log e2)
e12 = Mul e4 (Log e3)
e13 = Mul e4 (Pow e3 (3 / 2))
e14 = Mul e4 (Pow (P [(10, 2), (-15, 1), (5, 0)]) (3 / 2))
e15 = Mul (P [(1, 2), (-1, 0)]) (Log (P [(1, 3), (-3, 1)]))
e16 = Mul e2 (Log e2)
`,
  starter: hs`------------------------------------------------------------
-- Part I

addP :: Polynomial -> Polynomial -> Polynomial
addP = undefined

mulP :: Polynomial -> Polynomial -> Polynomial
mulP = undefined

sumP :: [Polynomial] -> Polynomial
sumP = undefined

prodP :: [Polynomial] -> Polynomial
prodP = undefined

diffT :: Term -> Term
diffT = undefined

intT :: Term -> Term
intT = undefined

diffP :: Polynomial -> Polynomial
diffP = undefined

intP :: Polynomial -> Polynomial
intP = undefined

------------------------------------------------------------
-- Part II

diffE :: Expr -> Expr
diffE = undefined

------------------------------------------------------------
-- Part III

intE :: Expr -> Maybe Expr
intE = undefined

-- Optional helper for the inverse chain rule
applyICR :: Expr -> Expr -> Maybe Expr
applyICR = undefined
`,
  tasks: [
    {
      id: "addP-mulP",
      name: "addP mulP",
      part: "Part I",
      marks: 8,
      prompt: md(
        "Define `addP :: Polynomial -> Polynomial -> Polynomial` and `mulP :: Polynomial -> Polynomial -> Polynomial` that add and multiply two polynomials in standard form, giving a result in standard form (decreasing exponents, one term per exponent, no zero terms, and zero written as `[(0,0)]`).",
        "",
        "The template defines `p1` to `p5`: `p1` is `[5]`, `p2` is `[x]`, `p3` is `[2x^2 - 3x + 1]`, `p4` is `[4x - 3]` and `p5` is `[2x^3 - 2x + 2]`.",
        "",
        "```",
        "*Main> prettyPrint p2",
        "[x]",
        "*Main> prettyPrint (addP p2 p2)",
        "[2x]",
        "*Main> prettyPrint (addP p3 p4)",
        "[2x^2 + x - 2]",
        "*Main> prettyPrint (addP p5 [(0,0)])",
        "[2x^3 - 2x + 2]",
        "*Main> prettyPrint (mulP p3 p4)",
        "[8x^3 - 18x^2 + 13x - 3]",
        "```",
        "",
        "You don't need to pull out common factors like the 2 in `[2x^3 - 2x + 2]`; `simplify` does that later.",
      ),
      hints: [
        "`addP` is a merge of two lists that are both sorted by exponent, biggest first: like the merge step of merge sort. `mulP` multiplies every term of one by every term of the other and adds the results up.",
        "Merge by recursion on both lists: if the first list's leading exponent is bigger, that term comes first; if the second's is bigger, that one comes first; if they're equal, add the coefficients. When one list runs out, the rest of the other follows. Afterwards remove zero terms.",
        "Removing zero terms can leave nothing (e.g. `p + (-p)`), and then the answer must be `[(0,0)]`, not `[]`. For `mulP`, multiplying a term `(c1, n1)` by `(c2, n2)` gives `(c1 * c2, n1 + n2)`. Make one polynomial per term of the first argument, then add them all with `addP`.",
        md(
          "```haskell",
          "addP p q = tidyTerms (mergeTerms p q)",
          "  where",
          "    mergeTerms [] ts = ts",
          "    mergeTerms ts [] = ts",
          "    mergeTerms ((c1, n1) : ts1) ((c2, n2) : ts2)",
          "      | n1 > n2 = (c1, n1) : mergeTerms ts1 ((c2, n2) : ts2)",
          "      | n1 < n2 = (c2, n2) : mergeTerms ((c1, n1) : ts1) ts2",
          "      | otherwise = (c1 + c2, n1) : mergeTerms ts1 ts2",
          "",
          "mulP p q = foldr addP [(0, 0)] [[(c1 * c2, n1 + n2) | (c2, n2) <- q] | (c1, n1) <- p]",
          "",
          "tidyTerms p = case filter ((/= 0) . fst) p of",
          "                [] -> [(0, 0)]",
          "                p' -> p'",
          "```",
        ),
      ],
      solution: hs`addP :: Polynomial -> Polynomial -> Polynomial
addP p q = tidyTerms (mergeTerms p q)
  where
    -- both lists are sorted by decreasing exponent
    mergeTerms [] ts = ts
    mergeTerms ts [] = ts
    mergeTerms ((c1, n1) : ts1) ((c2, n2) : ts2)
      | n1 > n2 = (c1, n1) : mergeTerms ts1 ((c2, n2) : ts2)
      | n1 < n2 = (c2, n2) : mergeTerms ((c1, n1) : ts1) ts2
      | otherwise = (c1 + c2, n1) : mergeTerms ts1 ts2

mulP :: Polynomial -> Polynomial -> Polynomial
mulP p q = foldr addP [(0, 0)] [[(c1 * c2, n1 + n2) | (c2, n2) <- q] | (c1, n1) <- p]

-- Removes zero terms; the zero polynomial is [(0,0)]
tidyTerms :: Polynomial -> Polynomial
tidyTerms p = case filter ((/= 0) . fst) p of
                [] -> [(0, 0)]
                p' -> p'`,
      tests: [
        { expr: "addP p2 p2", expected: "[(2,1)]" },
        { expr: "addP p3 p4", expected: "[(2,2),(1,1),(-2,0)]" },
        { expr: "pretty (addP p3 p4)", expected: `"[2x^2 + x - 2]"` },
        { expr: "addP p5 [(0,0)]", expected: "p5" },
        { expr: "addP [(0,0)] p5", expected: "p5" },
        { expr: "addP p3 [(-2,2),(3,1),(-1,0)]", expected: "[(0,0)]", label: "addP p3 (minus p3) == [(0,0)]" },
        { expr: "addP [(1,0)] [(1,5),(2,3)]", expected: "[(1,5),(2,3),(1,0)]" },
        { expr: "addP [(1,2),(1,1)] [(-1,1),(1,0)]", expected: "[(1,2),(1,0)]" },
        { expr: "mulP p3 p4", expected: "[(8,3),(-18,2),(13,1),(-3,0)]" },
        { expr: "pretty (mulP p3 p4)", expected: `"[8x^3 - 18x^2 + 13x - 3]"` },
        { expr: "mulP p5 [(0,0)]", expected: "[(0,0)]" },
        { expr: "mulP [(1,1),(1,0)] [(1,1),(-1,0)]", expected: "[(1,2),(-1,0)]" },
        { expr: "mulP [(1,0)] p5", expected: "p5" },
        { expr: "mulP [(1 % 2,1)] [(2 % 3,2)]", expected: "[(1 % 3,3)]" },
      ],
    },
    {
      id: "sumP-prodP",
      name: "sumP prodP",
      part: "Part I",
      marks: 1,
      prompt: md(
        "Define `sumP :: [Polynomial] -> Polynomial` and `prodP :: [Polynomial] -> Polynomial` that add up, and multiply together, a list of polynomials.",
        "",
        "```",
        "*Main> prettyPrint (sumP [[(0,0)]])",
        "[0]",
        "*Main> prettyPrint (sumP [p1,p2,p3,p4,p5])",
        "[2x^3 + 2x^2 + 5]",
        "*Main> prettyPrint (prodP [p3,p5])",
        "[4x^5 - 6x^4 - 2x^3 + 10x^2 - 8x + 2]",
        "```",
      ),
      hints: [
        "Combining a whole list with a two-argument function is a fold.",
        "`foldr addP` and `foldr mulP`. You need a starting value for each.",
        "The starting value must change nothing: adding zero `[(0,0)]`, multiplying by one `[(1,0)]`.",
        md("```haskell", "sumP = foldr addP [(0, 0)]", "prodP = foldr mulP [(1, 0)]", "```"),
      ],
      solution: hs`sumP :: [Polynomial] -> Polynomial
sumP = foldr addP [(0, 0)]

prodP :: [Polynomial] -> Polynomial
prodP = foldr mulP [(1, 0)]`,
      tests: [
        { expr: "sumP [[(0,0)]]", expected: "[(0,0)]" },
        { expr: "sumP [p1,p2,p3,p4,p5]", expected: "[(2,3),(2,2),(5,0)]" },
        { expr: "pretty (sumP [p1,p2,p3,p4,p5])", expected: `"[2x^3 + 2x^2 + 5]"` },
        { expr: "prodP [p3,p5]", expected: "[(4,5),(-6,4),(-2,3),(10,2),(-8,1),(2,0)]" },
        { expr: "sumP [p2]", expected: "p2" },
        { expr: "sumP [p3, p3]", expected: "[(4,2),(-6,1),(2,0)]" },
        { expr: "prodP [p2, p2, p2]", expected: "[(1,3)]" },
        { expr: "prodP [p4, [(0,0)], p5]", expected: "[(0,0)]" },
      ],
    },
    {
      id: "diffT-intT",
      name: "diffT intT",
      part: "Part I",
      marks: 3,
      prompt: md(
        "Define `diffT :: Term -> Term` and `intT :: Term -> Term` that differentiate and integrate a single term c x^n:",
        "",
        "- the derivative of c x^n is (c n) x^(n-1), and the derivative of a constant (n = 0) is 0, written `(0,0)`;",
        "- the integral of c x^n is (c / (n+1)) x^(n+1), with no constant of integration.",
        "",
        "```",
        "*Main> diffT (1,0) -- 1",
        "(0 % 1,0)",
        "*Main> diffT (2,3) -- 2x^3",
        "(6 % 1,2)",
        "*Main> intT (1,0)",
        "(1 % 1,1)",
        "*Main> intT (2,3)",
        "(1 % 2,4)",
        "```",
      ),
      hints: [
        "Each is a one-line formula on the pair `(c, n)`. `diffT` needs a special case for `n = 0`.",
        "Pattern match `diffT (_, 0) = (0, 0)` first, then the general equation.",
        "The coefficient is a `Rational` but the exponent is an `Integer`, so multiply or divide by `fromIntegral n` (or `fromIntegral (n + 1)`).",
        md(
          "```haskell",
          "diffT (_, 0) = (0, 0)",
          "diffT (c, n) = (c * fromIntegral n, n - 1)",
          "",
          "intT (c, n) = (c / fromIntegral (n + 1), n + 1)",
          "```",
        ),
      ],
      solution: hs`diffT :: Term -> Term
diffT (_, 0) = (0, 0)
diffT (c, n) = (c * fromIntegral n, n - 1)

intT :: Term -> Term
intT (c, n) = (c / fromIntegral (n + 1), n + 1)`,
      tests: [
        { expr: "diffT (1,0)", expected: "(0 % 1,0)" },
        { expr: "diffT (2,3)", expected: "(6 % 1,2)" },
        { expr: "intT (1,0)", expected: "(1 % 1,1)" },
        { expr: "intT (2,3)", expected: "(1 % 2,4)" },
        { expr: "diffT (5,1)", expected: "(5,0)" },
        { expr: "diffT (2 % 3,6)", expected: "(4,5)" },
        { expr: "intT (-3,2)", expected: "(-1,3)" },
        { expr: "diffT (intT (7 % 2,4))", expected: "(7 % 2,4)" },
      ],
    },
    {
      id: "diffP-intP",
      name: "diffP intP",
      part: "Part I",
      marks: 1,
      prompt: md(
        "Using `diffT` and `intT`, or otherwise, define `diffP :: Polynomial -> Polynomial` and `intP :: Polynomial -> Polynomial` that differentiate and integrate a polynomial, giving a result in standard form.",
        "",
        "```",
        "*Main> prettyPrint (diffP p3)",
        "[4x - 3]",
        "*Main> prettyPrint (intP p3)",
        "[(2/3)x^3 + (-3/2)x^2 + x]",
        "```",
      ),
      hints: [
        "Apply the term function to every term with `map`.",
        "Differentiating a constant term gives `(0,0)`, which isn't allowed in standard form, so remove zero terms afterwards.",
        "Reuse your tidying helper from `addP`. Differentiating a constant polynomial like `p1` must give `[(0,0)]`.",
        md("```haskell", "diffP p = tidyTerms (map diffT p)", "intP p = tidyTerms (map intT p)", "```"),
      ],
      solution: hs`diffP :: Polynomial -> Polynomial
diffP p = tidyTerms (map diffT p)

intP :: Polynomial -> Polynomial
intP p = tidyTerms (map intT p)`,
      tests: [
        { expr: "diffP p3", expected: "[(4,1),(-3,0)]" },
        { expr: "intP p3", expected: "[(2 % 3,3),((-3) % 2,2),(1,1)]" },
        { expr: "pretty (intP p3)", expected: `"[(2/3)x^3 + (-3/2)x^2 + x]"` },
        { expr: "diffP p1", expected: "[(0,0)]" },
        { expr: "diffP p5", expected: "[(6,2),(-2,0)]" },
        { expr: "intP p1", expected: "[(5,1)]" },
        { expr: "intP p2", expected: "[(1 % 2,2)]" },
        { expr: "diffP (intP p5)", expected: "p5" },
      ],
    },
    {
      id: "diffE",
      name: "diffE",
      part: "Part II",
      marks: 7,
      prompt: md(
        "Using `diffP`, define `diffE :: Expr -> Expr` that differentiates any expression with respect to x, using the rules from the introduction (sum rule, product rule, chain rule for `Pow`, and log f has derivative f' times f^(-1)).",
        "",
        "Given helpers: `toExpr r = P [(r, 0)]` turns a number into an expression, `simplifiedDiff = simplify . diffE`, and `printDiff = prettyPrint . simplifiedDiff`. Your raw output can look messy (with `[1] .` and `+ 0` bits); it only has to be mathematically right after simplifying.",
        "",
        "```",
        "*Main> prettyPrint e3",
        "[2x^2 - 3x + 1]",
        "*Main> prettyPrint (diffE e3)    -- your output may look slightly different",
        "[4x - 3 + 0]",
        "*Main> printDiff e3",
        "[4x - 3]",
        "*Main> prettyPrint e10",
        "[4x - 3] . [2x^2 - 3x + 1]",
        "*Main> prettyPrint (diffE e10)",
        "[4x - 3] . [4x - 3 + 0] + [4 + 0] . [2x^2 - 3x + 1]",
        "*Main> printDiff e10",
        "[24x^2 - 36x + 13]",
        "*Main> prettyPrint e11",
        "[x]^-1 . log[x]",
        "*Main> prettyPrint (diffE e11)",
        "[x]^-1 . [1] . [x]^-1 + [1] . [-1] . [x]^-2 . log[x]",
        "*Main> printDiff e11",
        "[-1] . [x]^-2 . log[x] + [x]^-2",
        "```",
        "",
        "Some tests check your derivative numerically: they evaluate it at several values of x and compare with the slope of the original function there.",
      ),
      hints: [
        "One equation per constructor of `Expr`, each copying one rule from the introduction. Recursion handles the nesting.",
        "`P p` uses `diffP`. `Add` differentiates both sides. `Mul e1 e2` is `Add (Mul e1 (diffE e2)) (Mul (diffE e1) e2)`.",
        "For `Pow e n`: the derivative is n times e^(n-1) times e'. Build the n with `toExpr n` and the new power with `Pow e (n - 1)`. For `Log e`: e' times `Pow e (-1)`.",
        md(
          "```haskell",
          "diffE (P p) = P (diffP p)",
          "diffE (Add e1 e2) = Add (diffE e1) (diffE e2)",
          "diffE (Mul e1 e2) = Add (Mul e1 (diffE e2)) (Mul (diffE e1) e2)",
          "diffE (Pow e n) = Mul (diffE e) (Mul (toExpr n) (Pow e (n - 1)))",
          "diffE (Log e) = Mul (diffE e) (Pow e (-1))",
          "```",
        ),
      ],
      solution: hs`diffE :: Expr -> Expr
diffE (P p) = P (diffP p)
diffE (Add e1 e2) = Add (diffE e1) (diffE e2)
diffE (Mul e1 e2) = Add (Mul e1 (diffE e2)) (Mul (diffE e1) e2)
diffE (Pow e n) = Mul (diffE e) (Mul (toExpr n) (Pow e (n - 1)))
diffE (Log e) = Mul (diffE e) (Pow e (-1))`,
      tests: [
        { expr: "simplifiedDiff e3", expected: "P [(4,1),(-3,0)]" },
        { expr: "simplifiedDiff e10", expected: "P [(24,2),(-36,1),(13,0)]" },
        {
          expr: "sameFunction (diffE e11) (Add (Mul (toExpr (-1)) (Mul (Pow x (-2)) (Log x))) (Pow x (-2)))",
          label: "diffE e11 matches [-1] . [x]^-2 . log[x] + [x]^-2",
        },
        { expr: "simplifiedDiff e1", expected: "P [(0,0)]" },
        { expr: "simplifiedDiff (Mul x x)", expected: "P [(2,1)]" },
        { expr: "diffWorks e6", label: "diffE e6 is the derivative of e6 (sum)" },
        { expr: "diffWorks e7", label: "diffE e7 is the derivative of e7 (constant times a square root)" },
        { expr: "diffWorks e8", label: "diffE e8 is the derivative of log x" },
        { expr: "diffWorks e9", label: "diffE e9 is the derivative of x^-1" },
        { expr: "diffWorks e12", label: "diffE e12 is the derivative of e12" },
        { expr: "diffWorks e14", label: "diffE e14 is the derivative of e14" },
        { expr: "diffWorks (Log (Mul e3 (Pow e4 3)))", label: "diffE works on log of a product of powers" },
      ],
    },
    {
      id: "intE",
      name: "intE",
      part: "Part III",
      marks: 10,
      prompt: md(
        "Define `intE :: Expr -> Maybe Expr` that integrates an expression, returning `Nothing` when the rules here aren't enough. Suggested plan:",
        "",
        "1. A polynomial: use `intP`.",
        "2. A sum: integrate both sides (if either fails, the whole thing fails).",
        "3. A product with a constant (`isConstant`) on either side: integrate the other side and multiply by the constant.",
        "4. Any other product: try the inverse chain rule, both ways round, including the identity case (g' times g integrates to g^2/2).",
        "5. Anything else: use the \"multiply by 1\" trick, i.e. treat e as 1 times f(g(x)) and apply the inverse chain rule.",
        "",
        "The paper suggests a helper `applyICR :: Expr -> Expr -> Maybe Expr` for the inverse chain rule, taking g'(x) and f(g(x)). For f, handle `Pow g n` (integral of u^n is u^(n+1)/(n+1), or log u when n is -1), `Log g` (integral of log u is u (log u - 1)) and the identity (integral of u is u^2/2).",
        "",
        "Given helpers: `simplifiedInt` simplifies the result of `intE`, and `printInt` prints it (or `Fail`).",
        "",
        "```",
        "*Main> intE e3",
        "Just (P [(2 % 3,3),((-3) % 2,2),(1 % 1,1)])",
        "*Main> simplifiedInt e3",
        "Just (Mul (P [(1 % 6,0)]) (P [(4 % 1,3),((-9) % 1,2),(6 % 1,1)]))",
        "*Main> printInt e3",
        "[(1/6)] . [4x^3 - 9x^2 + 6x]",
        "*Main> prettyPrint e6",
        "[2x^2 - 3x + 1] + [2x^3 - 2x + 2]",
        "*Main> prettyPrint (fromJust (intE e6))",
        "[(2/3)x^3 + (-3/2)x^2 + x] + [(1/2)x^4 - x^2 + 2x]",
        "*Main> printInt e6",
        "[(1/6)] . [3x^4 + 4x^3 - 15x^2 + 18x]",
        "*Main> printInt e8",
        "[x] . ([-1] + log[x])",
        "*Main> printInt e9",
        "log[x]",
        "*Main> printInt e10",
        "[(1/2)] . [4x^4 - 12x^3 + 13x^2 - 6x + 1]",
        "*Main> printInt e11",
        "[(1/2)] . (log[x])^2",
        "*Main> printInt e12",
        "[2x^2 - 3x + 1] . ([-1] + log[2x^2 - 3x + 1])",
        "*Main> printInt e13",
        "[(2/5)] . ([2x^2 - 3x + 1])^(5/2)",
        "*Main> printInt e14",
        "[(2/25)] . ([5] . [2x^2 - 3x + 1])^(5/2)",
        "*Main> printInt e15",
        "[(1/3)] . [x^3 - 3x] . ([-1] + log[x^3 - 3x])",
        "*Main> printInt e16",
        "Fail",
        "```",
        "",
        "Here `e8` is log x, `e9` is x^(-1), `e10` is (4x - 3)(2x^2 - 3x + 1), `e11` is x^(-1) log x, `e12` is (4x - 3) log(2x^2 - 3x + 1), `e13` is (4x - 3)(2x^2 - 3x + 1)^(3/2), `e14` is (4x - 3)(10x^2 - 15x + 5)^(3/2), `e15` is (x^2 - 1) log(x^3 - 3x) and `e16` is x log x. (The paper doesn't print the template's `e7`, `e14`, `e15` and `e16`; these are reconstructed to match the printed answers.)",
        "",
        "**The twist.** In `e14` and `e15`, the derivative of the inside isn't exactly the factor in front, only a constant multiple of it (20x - 15 is 5 times 4x - 3). The paper's hint: if one polynomial is a constant multiple of another, their simplified forms differ only in their constant factors:",
        "",
        "```",
        "*Main> prettyPrint (simplify (Mul e1 e5))",
        "[10] . [x^3 - x + 1]",
        "*Main> prettyPrint (simplify e5)",
        "[2] . [x^3 - x + 1]",
        "```",
        "",
        "Tests compare your answer with the paper's numerically, allowing for a different constant of integration.",
      ),
      hints: [
        "Write `intE` by cases in the order of the plan, and put all the inverse chain rule work in `applyICR dg fg`, where `dg` should be g' and `fg` is f(g(x)). Products try `applyICR e1 e2` and, if that's `Nothing`, `applyICR e2 e1`. The last case is `applyICR (toExpr 1) e`.",
        "For the sum case, `case (intE e1, intE e2) of (Just i1, Just i2) -> Just (Add i1 i2); _ -> Nothing`. For constants, `fmap (Mul e1) (intE e2)` multiplies inside the `Just`. In `applyICR`, look at the shape of `fg`: `Pow g n` and `Log g` have an obvious inner `g`, and if those fail (or `fg` is something else) try the identity, where `g` is `fg` itself.",
        "To check that `dg` is g', never compare raw `diffE` output. Simplify both `dg` and `diffE g`, split off any leading constant (a simplified constant multiple looks like `Mul (P [(c,0)]) rest`), and compare the rests with `==`. If they match, the scale factor is the ratio of the constants, and you multiply the answer by it. This handles the twist and the exact case at once.",
        md(
          "```haskell",
          "applyICR dg fg = case outer fg of",
          "                   Nothing -> withInner fg (Mul (toExpr (1 / 2)) (Pow fg 2))",
          "                   result -> result",
          "  where",
          "    outer (Pow g n)",
          "      | n == -1 = withInner g (Log g)",
          "      | otherwise = withInner g (Mul (toExpr (1 / (n + 1))) (Pow g (n + 1)))",
          "    outer (Log g) = withInner g (Mul g (Add (Log g) (toExpr (-1))))",
          "    outer _ = Nothing",
          "    withInner g intF = case ratio dg (diffE g) of",
          "                         Just k -> Just (Mul (toExpr k) intF)",
          "                         Nothing -> Nothing",
          "",
          "-- ratio e1 e2 is Just k when e1 = k * e2, comparing simplified forms",
          "```",
        ),
      ],
      solution: hs`intE :: Expr -> Maybe Expr
intE (P p) = Just (P (intP p))
intE (Add e1 e2) = case (intE e1, intE e2) of
                     (Just i1, Just i2) -> Just (Add i1 i2)
                     _ -> Nothing
intE (Mul e1 e2)
  | isConstant e1 = fmap (Mul e1) (intE e2)
  | isConstant e2 = fmap (Mul e2) (intE e1)
  | otherwise = case applyICR e1 e2 of
                  Nothing -> applyICR e2 e1
                  result -> result
-- anything else is 1 * f(g(x)) with g(x) = x
intE e = applyICR (toExpr 1) e

-- applyICR dg fg integrates dg * fg by the inverse chain rule, where fg is
-- f(g(x)) and dg must be a constant multiple of g'(x)
applyICR :: Expr -> Expr -> Maybe Expr
applyICR dg fg = case outer fg of
                   -- f is the identity: the integral of u is u^2 / 2
                   Nothing -> withInner fg (Mul (toExpr (1 / 2)) (Pow fg 2))
                   result -> result
  where
    outer (Pow g n)
      | n == -1 = withInner g (Log g)
      | otherwise = withInner g (Mul (toExpr (1 / (n + 1))) (Pow g (n + 1)))
    outer (Log g) = withInner g (Mul g (Add (Log g) (toExpr (-1))))
    outer _ = Nothing
    -- intF is the integral of f(u) with u = g; scale it when dg = k * g'
    withInner g intF = case ratio dg (diffE g) of
                         Just k -> Just (Mul (toExpr k) intF)
                         Nothing -> Nothing

-- Just k when e1 = k * e2, judged by comparing their simplified forms
ratio :: Expr -> Expr -> Maybe Rational
ratio e1 e2
  | c2 /= 0 && rest1 == rest2 = Just (c1 / c2)
  | otherwise = Nothing
  where
    (c1, rest1) = constantFactor (simplify e1)
    (c2, rest2) = constantFactor (simplify e2)

-- Splits a simplified expression into its constant factor and the rest
constantFactor :: Expr -> (Rational, Expr)
constantFactor (P [(c, n)]) = (c, P [(1, n)])
constantFactor (Mul (P [(c, 0)]) e) = (c, e)
constantFactor e = (1, e)`,
      tests: [
        { expr: "intE e3", expected: "Just (P [(2 % 3,3),((-3) % 2,2),(1 % 1,1)])" },
        { expr: "simplifiedInt e3", expected: "Just (Mul (P [(1 % 6,0)]) (P [(4 % 1,3),((-9) % 1,2),(6 % 1,1)]))" },
        { expr: "simplifiedInt e6", expected: "Just (Mul (P [(1 % 6,0)]) (P [(3,4),(4,3),(-15,2),(18,1)]))" },
        {
          expr: "intMatches e8 (Mul x (Add (toExpr (-1)) (Log x)))",
          label: "intE e8 matches [x] . ([-1] + log[x])",
        },
        { expr: "intMatches e9 (Log x)", label: "intE e9 matches log[x]" },
        {
          expr: "intMatches e10 (Mul (toExpr (1/2)) (P [(4,4),(-12,3),(13,2),(-6,1),(1,0)]))",
          label: "intE e10 matches [(1/2)] . [4x^4 - 12x^3 + 13x^2 - 6x + 1]",
        },
        { expr: "intMatches e11 (Mul (toExpr (1/2)) (Pow (Log x) 2))", label: "intE e11 matches [(1/2)] . (log[x])^2" },
        {
          expr: "intMatches e12 (Mul e3 (Add (toExpr (-1)) (Log e3)))",
          label: "intE e12 matches [2x^2 - 3x + 1] . ([-1] + log[2x^2 - 3x + 1])",
        },
        { expr: "intMatches e13 (Mul (toExpr (2/5)) (Pow e3 (5/2)))", label: "intE e13 matches [(2/5)] . ([2x^2 - 3x + 1])^(5/2)" },
        {
          expr: "intMatches e14 (Mul (toExpr (2/25)) (Pow (Mul (toExpr 5) e3) (5/2)))",
          label: "intE e14 matches [(2/25)] . ([5] . [2x^2 - 3x + 1])^(5/2)  (the twist)",
        },
        {
          expr: "intMatches e15 (Mul (toExpr (1/3)) (Mul (P [(1,3),(-3,1)]) (Add (toExpr (-1)) (Log (P [(1,3),(-3,1)])))))",
          label: "intE e15 matches [(1/3)] . [x^3 - 3x] . ([-1] + log[x^3 - 3x])  (the twist)",
        },
        { expr: "intE e16", expected: "Nothing" },
        { expr: "intWorks e7", label: "intE e7 works (a constant times x^(1/2))" },
        { expr: "intWorks (Mul (Pow e3 (-1)) e4)", label: "intE works on (2x^2 - 3x + 1)^-1 . (4x - 3) (factors swapped)" },
        { expr: "intWorks (Log (P [(3,1)]))", label: "intE works on log[3x] (twist with the multiply-by-1 trick)" },
        { expr: "intWorks (Add e8 (Mul (Log e2) e1))", label: "intE works on log x + (log x) . [5]" },
        { expr: "intE (Mul (Log e2) (Log e2))", expected: "Nothing" },
      ],
    },
  ],
};
