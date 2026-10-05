import type { CSSProperties } from "react";
import { Mark, Reveal } from "./UI";
import { sponsorRows, contactSponsorRows } from "../data/sponsors";
export default function Sponsors({ contact = false }: { contact?: boolean }) {
  const rows = contact ? contactSponsorRows : sponsorRows;
  return (
    <Reveal>
      <section
        className="sponsors"
        id="sponsors"
        aria-labelledby="sponsors-title"
      >
        <h2 id="sponsors-title">Phil is supported by</h2>
        <div className="sponsor-rows">
          {rows.map((row, r) => (
            <div className={`sponsor-row row-${r}`} key={r}>
              <div className="sponsor-track">
                {[0, 1, 2].map((copy) => (
                  <div
                    className="sponsor-set"
                    key={copy}
                    aria-hidden={copy !== 0 ? true : undefined}
                  >
                    {row.map(({ name, asset, href, width, height }) => (
                      <a
                        href={href}
                        key={name}
                        target="_blank"
                        rel="noreferrer"
                        tabIndex={copy !== 0 ? -1 : undefined}
                        aria-label={name}
                        style={
                          {
                            "--sponsor-width": `${width}px`,
                            "--sponsor-height": `${height}px`,
                          } as CSSProperties
                        }
                      >
                        <Mark asset={asset} label={name} />
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
