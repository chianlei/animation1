import { Reveal, Pill } from "./UI";
import { links, media } from "../data/site";
import AmbientVideo from "./AmbientVideo";
export default function CTA({ diary = false }: { diary?: boolean }) {
  return (
    <section className="donation dark-panel">
      <div className="donation-copy">
        {!diary && (
          <Reveal>
            <a
              href={links.charity}
              target="_blank"
              rel="noreferrer"
              className="charity-wide"
            >
              <img
                src={media("artwork-3.svg")}
                alt="In aid of Alzheimer's Research UK"
                loading="lazy"
              />
            </a>
          </Reveal>
        )}
        <Reveal>
          <h2>
            {diary ? (
              "Support Phil’s ride for Alzheimer’s"
            ) : (
              <>
                Support
                <br />
                Phil’s ride for Alzheimer’s
              </>
            )}
          </h2>
        </Reveal>
        <Reveal>
          <Pill href={links.donate} className="light large">
            Donate to Phil
          </Pill>
        </Reveal>
        <div className="donation-details mono">
          <span>Just Phil — 2026</span>
          <span>For Alzheimer's Research UK</span>
        </div>
      </div>
      <Reveal x={30} y={0} className="donation-video">
        <AmbientVideo
          file="phil-ride.mp4"
          poster="9pJF9645q1H7SD2yzVJIS2UljD4.jpg"
          label="Phil cycling in the mountains"
        />
      </Reveal>
    </section>
  );
}
