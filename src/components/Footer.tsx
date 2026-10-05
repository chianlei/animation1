import { Mark } from "./UI";
import { links } from "../data/site";
const website = [
  ["Home", "/"],
  ["About", "/#about"],
  ["Route", "/#route"],
  ["Live Tracker", links.tracker],
  ["Charity", links.charity],
  ["Sponsorship", "/#sponsors"],
];
const social = [
  ["Instagram", "https://www.instagram.com/philshackleton/"],
  ["YouTube", "https://www.youtube.com/@PhilShackleton"],
  ["LinkedIn", "https://www.linkedin.com/in/philshackleton/"],
  ["TikTok", "https://www.tiktok.com/@philshackleton"],
  ["Mixd.co.uk", "https://www.mixd.co.uk/"],
  ["MikeKus.com", links.designer],
];
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <div>
          <a href="/" aria-label="Just Phil home">
            <Mark />
          </a>
          <Mark asset="framer-9F7yc.svg" className="footer-bike" />
        </div>
        <p>
          No shortcuts
          <br />
          No support
          <br />
          Just Phil
        </p>
      </div>
      <div className="footer-column">
        <h3>Website:</h3>
        <nav aria-label="Footer website links">
          {website.map(([text, href]) => (
            <a key={text} href={href}>
              {text}
            </a>
          ))}
        </nav>
      </div>
      <div className="footer-column">
        <h3>Elsewhere:</h3>
        <nav aria-label="Social links">
          {social.map(([text, href]) => (
            <a key={text} href={href} target="_blank" rel="noreferrer">
              {text}
            </a>
          ))}
        </nav>
      </div>
      <div className="footer-contact">
        <div className="footer-column">
          <h3>Contact:</h3>
          <nav>
            <a href="/contact">Contact form</a>
            <a href="mailto:info@justphilride.co.uk">info@justphilride.co.uk</a>
          </nav>
        </div>
        <p className="mono">©2026 All Rights Reserved</p>
        <p className="mono">
          Site design:{" "}
          <a href={links.designer} target="_blank" rel="noreferrer">
            mikekus.com
          </a>
        </p>
      </div>
    </footer>
  );
}
