import { Reveal, Pill } from "./UI";
import { media, links } from "../data/site";
export default function Route() {
  return (
    <section className="route-section" id="route">
      <div className="route-heading editorial">
        <Reveal className="editorial-side">
          <p className="mono">One Epic Journey</p>
        </Reveal>
        <div className="editorial-copy route-title">
          <Reveal>
            <img
              className="route-avatar"
              src={media("8JUOJssQRufMk9AgZZ3dSztVSc.jpg")}
              alt="Phil Shackleton"
              loading="lazy"
            />
            <h2>
              Just Phil
              <br />
              Unsupported
              <br />
              Ride Route
            </h2>
          </Reveal>
          <Reveal className="tracking-button">
            <Pill href={links.tracker}>Live Tracking</Pill>
          </Reveal>
        </div>
      </div>
      <div className="map-area">
        <Reveal y={30} className="map-image">
          <img
            src={media("ZbquV14IuuaJzHPACdt7u6Wzok.svg")}
            alt="The 21 stages and cycling transfers from Barcelona to Paris"
            loading="lazy"
          />
        </Reveal>
        <div className="map-key">
          <h3>Map Key:</h3>
          <p>
            <span className="key-dots">
              <i />
              <i />
            </span>
            Stage start/end points
          </p>
          <p>
            <span className="key-line" />
            Stage ride route
          </p>
          <p>
            <img src={media("artwork-2.svg")} alt="" />
            Stage transfer ride
          </p>
        </div>
      </div>
    </section>
  );
}
