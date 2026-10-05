import { Mark, Reveal, AnimatedText } from "./UI";
import { media } from "../data/site";
export default function Mission() {
  return (
    <section className="mission">
      <Reveal y={170} className="mission-landscape">
        <img
          src={media("UpcD000VPbs63TVSkNbjNlWtgs.png")}
          alt="Cyclist beneath dramatic mountain peaks"
          loading="lazy"
        />
      </Reveal>
      <div className="mission-inner">
        <Reveal className="mission-arrow" x={-30} y={0}>
          <Mark asset="framer-78I91.svg" />
        </Reveal>
        <div className="mission-copy">
          <h2>
            <AnimatedText text={"NO SHORTCUTS\nNO SUPPORT\nJUST PHIL."} />
          </h2>
          <Reveal>
            <p>
              In 2026, Phil will take on the full Tour de France route
              completely unsupported; no team car, no mechanics, no support.
              Just Phil. He’ll ride every stage, plus every transfer in between,
              covering almost 6,000km of mountains, cobbles, valleys and brutal
              weather, powered only by grit and determination.
            </p>
            <p>
              He’s doing it for a cause close to his heart. Every kilometre,
              every climb, every lonely stretch of road is to raise money for
              Alzheimer’s Research UK, turning an extraordinary challenge into
              hope for millions.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
