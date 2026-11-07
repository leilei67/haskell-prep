import { type Item, plainFor } from "../lib/content";
import { stripCallStack } from "../lib/haskell";
import { readSignature } from "../lib/readsig";
import { Code, Prose, Rich } from "./Code";
import { RunExample } from "./Exercises";

export function ItemExplainer({ item }: { item: Item }) {
  const plain = plainFor(item);
  const reading = readSignature(item.sig);
  return (
    <div className="explainer">
      <section className="ex-part">
        <h3 className="ex-part-title">In plain words</h3>
        <Prose text={plain?.p ?? item.desc} />
      </section>

      {plain?.w && (
        <section className="ex-part">
          <h3 className="ex-part-title">Worked example</h3>
          <Prose text={plain.w} />
        </section>
      )}

      {item.ex && (
        <section className="ex-part">
          <h3 className="ex-part-title">Try it</h3>
          <Code block code={item.ex} />
          <RunExample ex={item.ex} />
        </section>
      )}

      {plain?.t && (
        <section className="ex-part ex-trap">
          <h3 className="ex-part-title">Watch out</h3>
          <Prose text={plain.t} />
        </section>
      )}

      <section className="ex-part">
        <h3 className="ex-part-title">Its type, read out loud</h3>
        <Code block code={`${item.name} :: ${stripCallStack(item.sig)}`} className="intro-sig" />
        <p className="sig-reading">
          <Rich text={reading.sentence} />
        </p>
        {reading.constraints.map((c) => (
          <p key={c} className="sig-reading sig-constraint">
            <Rich text={c} />
          </p>
        ))}
      </section>

      <details className="ex-formal">
        <summary>The precise definition</summary>
        <p>
          <Rich text={item.explain || item.desc} />
        </p>
      </details>
    </div>
  );
}
