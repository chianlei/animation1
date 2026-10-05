import { useEffect, useRef } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { media } from "../data/site";

export function Reveal({
  children,
  delay = 0,
  x = 0,
  y = 30,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; x?: number; y?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{
        opacity: reduced ? 1 : 0,
        x: reduced ? 0 : x,
        y: reduced ? 0 : y,
      }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay, ease: [0.44, 0, 0.56, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
export function Mark({
  asset = "framer-5s6VI.svg",
  className = "",
  label,
}: {
  asset?: string;
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={`mark ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ "--art": `url("${media(asset)}")` } as CSSProperties}
    />
  );
}
export function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 28 22" aria-hidden="true">
      <path
        d="M1 11h23M15 2l9 9-9 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
      />
    </svg>
  );
}
export function Pill({
  children,
  href,
  className = "",
  onClick,
}: {
  children: ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      {children}
      <Arrow />
    </>
  );
  return href ? (
    <a
      className={`pill ${className}`}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
    >
      {content}
    </a>
  ) : (
    <button className={`pill ${className}`} onClick={onClick}>
      {content}
    </button>
  );
}
export function Wheels() {
  return (
    <div className="wheels" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, x: -30, rotate: -90 }}
          animate={{ opacity: [0.4, 0.7, 1, 1, 1][i], x: 0, rotate: 0 }}
          transition={{
            delay: i * 0.12,
            duration: 0.8,
            ease: [0.44, 0, 0.56, 1],
          }}
        />
      ))}
    </div>
  );
}
export function AnimatedText({ text }: { text: string }) {
  const reduced = useReducedMotion();
  return (
    <span aria-label={text}>
      {text.split("\n").map((line, j) => (
        <span className="animated-line" aria-hidden="true" key={j}>
          {Array.from(line).map((char, i) => (
            <motion.span
              key={i}
              initial={{
                opacity: reduced ? 1 : 0,
                filter: reduced ? "blur(0px)" : "blur(6px)",
              }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: reduced ? 0 : (i + j * 20) * 0.018,
              }}
            >
              {char === " " ? "\u00a0" : char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}

export function FitText({
  children,
  mobileWrap = false,
}: {
  children: string;
  mobileWrap?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const span = ref.current;
    if (!span?.parentElement) return;
    const parent = span.parentElement;
    const resize = () => {
      if (mobileWrap && window.innerWidth < 768) {
        span.style.fontSize = "";
        return;
      }
      const width = span.getBoundingClientRect().width;
      if (width > 0) {
        const size =
          (parseFloat(getComputedStyle(span).fontSize) * parent.clientWidth) /
          width;
        if (Math.abs(size - parseFloat(getComputedStyle(span).fontSize)) > 0.05)
          span.style.fontSize = `${size}px`;
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    void document.fonts.ready.then(resize);
    resize();
    return () => observer.disconnect();
  }, [mobileWrap]);
  return (
    <p>
      <span ref={ref}>{children}</span>
    </p>
  );
}
