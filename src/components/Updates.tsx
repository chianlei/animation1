import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, Pill } from "./UI";
import { links, media } from "../data/site";
export default function Updates({ diary = false }: { diary?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="updates dark-panel crop-marks" id="updates">
      <div className="updates-overview">
        <Reveal>
          <h2>{diary ? "Updates from the road" : "Updates from Just Phil"}</h2>
        </Reveal>
        <Reveal>
          <p>
            Follow Phil in real time as he tackles every climb, descent, and
            kilometre of the {diary ? "Tour de France" : "2026 Tour de France"}{" "}
            route — completely solo and unsupported.
          </p>
        </Reveal>
        <Reveal>
          <Pill className="light" href={diary ? links.tracker : "/diary"}>
            {diary ? "Live Tracker" : "View Full Diary"}
          </Pill>
        </Reveal>
      </div>
      <Reveal className="post">
        <div className="post-avatar">
          <img
            src={media("8JUOJssQRufMk9AgZZ3dSztVSc.jpg")}
            alt="Phil Shackleton"
            loading="lazy"
          />
        </div>
        <article>
          <h3>It's Live</h3>
          <p className="post-date">19:32 — March 1st, 2026</p>
          <div className="post-body">
            <p>
              It feels strange writing this. For months, this project has lived
              quietly in spreadsheets, route maps and a handful of
              conversations. It’s been an idea I’ve carried around in my head.
              Today, it’s public.
            </p>
            <p>The Just Phil Ride is live.</p>
            <p>
              In just 5 months, I’ll ride the entire 2026 Tour de France route —
              every stage and every transfer — completely solo and unsupported.
              Nearly 6,000 kilometres in around 25 days. No team cars. No
              support crew. Just me and the road.
            </p>
            <p>
              Going live with this website feels almost as significant as
              rolling out of Barcelona will. Because this is the moment it
              becomes real.
            </p>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  id="post-expanded"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <p>
                    This journey is inspired by my mum and supports Alzheimer’s
                    research. There will be difficult climbs, long transfers and
                    days where keeping going is the challenge.
                  </p>
                  <p>
                    I’ll share the preparation and the ride here. You can follow
                    the live tracker, support the fundraiser and read the
                    original diary for the full story.
                  </p>
                  <a
                    className="post-original"
                    href="https://www.justphilride.co.uk/diary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read the full original diary ↗
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            className="show-more"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls="post-expanded"
          >
            {expanded ? "Show Less −" : "Show More >"}
          </button>
        </article>
      </Reveal>
    </section>
  );
}
