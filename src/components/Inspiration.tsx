import { Reveal } from "./UI";
import { links } from "../data/site";
export default function Inspiration() {
  return (
    <section className="inspiration editorial" id="inspiration">
      <Reveal className="editorial-side">
        <p className="mono">Phil's Inspiration</p>
      </Reveal>
      <div className="editorial-copy">
        <Reveal>
          <h2>
            Phil’s mum - meet the inspiration for the Just Phil Tour de France
            challenge.
          </h2>
        </Reveal>
        <Reveal>
          <p>
            Phil’s mum has always been his quiet inspiration, strong, kind, and
            endlessly supportive in everything he’s ever taken on. Watching her
            face the challenges of Alzheimer’s has given this ride a much deeper
            meaning. What began as a personal test of endurance has become a way
            to give something back, to turn something incredibly tough into
            something hopeful. By riding for{" "}
            <a href={links.charity} target="_blank" rel="noreferrer">
              Alzheimer’s Research UK
            </a>
            , Phil is honouring his mum in the most fitting way he knows how:
            with determination, heart, and a refusal to give up.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
