import { Mark, Reveal } from "./UI";
export default function About() {
  return (
    <section className="about editorial" id="about">
      <Reveal className="editorial-side" x={-30} y={0}>
        <Mark asset="framer-9F7yc.svg" className="about-bike" />
      </Reveal>
      <div className="editorial-copy">
        <Reveal>
          <h2>Just Phil Ride</h2>
        </Reveal>
        <Reveal>
          <p>
            Just Phil is Phil Shackleton’s unsupported Tour de France challenge.
            Phil will ride every stage and every transfer of the 2026 Tour de
            France route – nearly 6,000km from Barcelona to Paris – raising
            funds for Alzheimer’s Research UK.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
