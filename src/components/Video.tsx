import { useState } from "react";
import { media } from "../data/site";
export default function Video() {
  const [playing, setPlaying] = useState(false);
  return (
    <section className="video-section" aria-label="Meet Phil">
      <div className="video-frame">
        {playing ? (
          <iframe
            src="https://www.youtube.com/embed/aZ_3eYiq4q0?autoplay=1&controls=1"
            title="Just Phil Ride introduction"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            className="video-cover"
            onClick={() => setPlaying(true)}
            aria-label="Play Just Phil Ride introduction"
          >
            <img
              src={media("FUDKSoEZ9PsNVvjDQcuUnBiO2uY.jpg")}
              alt="Phil introducing his ride"
              loading="lazy"
            />
            <span className="play-circle">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 4l12 8-12 8z" fill="currentColor" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
