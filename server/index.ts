import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CHECK_IMPORTS, PLAYGROUND_IMPORTS, ghcVersion, runChallenge, runGhci } from "./ghc.ts";

const app = express();
app.use(express.json({ limit: "200kb" }));

app.get("/api/health", async (_req, res) => {
  try {
    res.json({ ok: true, ghc: await ghcVersion() });
  } catch {
    res.json({ ok: false, ghc: "" });
  }
});

app.post("/api/run", async (req, res) => {
  const { defs = "", exprs = [], mode = "playground" } = req.body ?? {};
  if (!Array.isArray(exprs) || exprs.length > 50) {
    res.status(400).json({ error: "exprs must be an array of at most 50 expressions" });
    return;
  }
  const imports = mode === "check" ? CHECK_IMPORTS : PLAYGROUND_IMPORTS;
  res.json(await runGhci(String(defs), exprs.map(String), imports));
});

app.post("/api/challenge", async (req, res) => {
  const { code = "", setup = "", tests = [] } = req.body ?? {};
  res.json(await runChallenge(String(code), String(setup), tests));
});

if (process.env.NODE_ENV === "production") {
  const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

const port = process.env.NODE_ENV === "production" ? 5173 : 5174;
app.listen(port, "127.0.0.1", () => {
  console.log(`Prelude Path API on http://127.0.0.1:${port}`);
});
