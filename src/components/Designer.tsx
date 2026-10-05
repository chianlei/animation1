import { Reveal, Pill } from "./UI";
import { links } from "../data/site";
import AmbientVideo from "./AmbientVideo";
export default function Designer() {
  return (
    <section className="designer dark-panel">
      <Reveal className="designer-image">
        <AmbientVideo
          file="mike-kus-work.mp4"
          poster="mike-kus-poster.png"
          label="Branding and website design work by Mike Kus"
        />
      </Reveal>
      <div className="designer-copy">
        <Reveal>
          <h2>
            <span>Just Phil</span> branding and web design by{" "}
            <a href={links.designer} target="_blank" rel="noreferrer">
              mikekus.com
            </a>
          </h2>
        </Reveal>
        <Reveal>
          <p className="mono">
            Mike designs distinctive brands and websites that help ambitious
            companies stand out, scale up, and stay memorable.
          </p>
        </Reveal>
        <div className="designer-details">
          <p className="mono">View work at:</p>
          <Pill href={links.designer} className="light">
            MikeKus.com
          </Pill>
        </div>
      </div>
    </section>
  );
}
