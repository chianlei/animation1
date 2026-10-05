import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mark, Pill } from "./UI";
import { links } from "../data/site";
const items = [
  ["About", "/#about"],
  ["Route", "/#route"],
  ["Live Tracker", links.tracker],
  ["Sponsorship", "/#sponsors"],
  ["Contact", "/contact"],
  ["Diary", "/diary"],
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab") {
        const focusable = [...document.querySelectorAll<HTMLAnchorElement | HTMLButtonElement>(
          '.menu-toggle, .mobile-nav a, .mobile-nav button'
        )].filter(element => element.getBoundingClientRect().width > 0);
        const first = focusable[0];
        const last = focusable.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <header className="site-header">
      <div className="nav-bar">
        <motion.a className="brand" href="/" aria-label="Just Phil home"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.44, 0, 0.56, 1] }}>
          <Mark label="Just Phil" />
        </motion.a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {items.map(([name, href]) => (
            <a
              key={name}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
            >
              {name}
            </a>
          ))}
        </nav>
        <Pill href={links.donate} className="nav-donate">
          Donate to Phil
        </Pill>
        <button
          className={`menu-toggle ${open ? "is-open" : ""}`}
          ref={toggle}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav"
            id="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "calc(100dvh - 72px)", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {items.map(([name, href], i) => (
              <motion.a
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                key={name}
                href={href}
                onClick={() => setOpen(false)}
              >
                {name}
              </motion.a>
            ))}
            <Pill href={links.donate}>Donate to Phil</Pill>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
