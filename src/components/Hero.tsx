import { motion, useReducedMotion } from "framer-motion";
import { AnimatedText, FitText, Mark, Wheels } from "./UI";
import { media, links } from "../data/site";
import Stats from "./Stats";
export default function Hero() {
  const reduced = useReducedMotion();
  return (
    <section
      className="hero"
      aria-label="Just Phil, riding the 2026 Tour de France route"
    >
      <img
        className="hero-landscape"
        src={media("LEInfS2FQOiErFY8GEGR7lZcoU.png")}
        alt="Cycling through the mountains of France"
        fetchPriority="high"
      />
      <div className="hero-top">
        <div className="hero-wheels">
          <Wheels />
        </div>
        <motion.div
          className="hero-headline"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="desktop-headline">
            <FitText>Just Phil riding the 2026 Tour de France route</FitText>
            <FitText>No shortcuts — No support</FitText>
          </div>
          <div className="mobile-headline">
            <FitText>Just Phil riding the 2026</FitText>
            <FitText>Tour de France route</FitText>
            <FitText>No shortcuts - No support</FitText>
          </div>
        </motion.div>
        <a
          className="hero-charity"
          href={links.charity}
          target="_blank"
          rel="noreferrer"
        >
          <div className="mobile-wheels">
            <Wheels />
          </div>
          <Mark
            asset="framer-2TVec.svg"
            label="In aid of Alzheimer's Research UK"
          />
        </a>
      </div>
      <div className="hero-main">
        <div className="hero-side mono">
          <AnimatedText
            text={
              "JUST PHIL RIDE\n2026 TOUR DE FRANCE\n21 BRUTAL STAGES\n1 MAN NAMED PHIL"
            }
          />
        </div>
        <h1 className="hero-logo">
          <motion.img
            src={media("artwork-0.svg")}
            alt="Just Phil — Tour de Phil 2026"
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 120 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 2, ease: [0.44, 0, 0.56, 1] }}
          />
        </h1>
        <div className="hero-side hero-strap">
          <Mark asset="framer-9F7yc.svg" className="bike" />
          <p className="mono">
            <AnimatedText text={"• NO SHORTCUTS\n• NO SUPPORT\n• JUST PHIL"} />
          </p>
        </div>
      </div>
      <Stats />
    </section>
  );
}
