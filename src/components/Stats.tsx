import { Reveal } from "./UI";
import { media } from "../data/site";
const stats = [
  ["21 STAGES", "& TRANSFERS"],
  ["8 MOUNTAIN", "STAGES"],
  ["5,661KM"],
  ["TOTAL CLIMBS", "72,718M"],
];
export default function Stats() {
  return (
    <div className="badges" aria-label="Challenge statistics">
      {stats.map((rows, i) => (
        <Reveal className="badge" delay={i * 0.1} key={rows[0]}>
          <img src={media("artwork-1.svg")} alt="" aria-hidden="true" />
          <div className="badge-text">
            <p>
              No shortcuts
              <br />
              No support
            </p>
            <strong>
              {rows.map((row) => (
                <span key={row}>{row}</span>
              ))}
            </strong>
            <p>Just Phil</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
