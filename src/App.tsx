import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Diary from "./pages/Diary";
import Contact from "./pages/Contact";
import "./App.css";
export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  useEffect(() => {
    document.title =
      path === "/contact"
        ? "Contact Phil — Just Phil Ride"
        : path === "/diary"
          ? "Diary — Just Phil Ride"
          : "Just Phil — Riding the 2026 Tour de France Route";
    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      target?.scrollIntoView();
    }
  }, [path]);
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main
        id="main-content"
        className={`page-content ${path === "/" ? "home-page" : "inner-page"}`}
      >
        {path === "/contact" ? (
          <Contact />
        ) : path === "/diary" ? (
          <Diary />
        ) : (
          <Home />
        )}
      </main>
      <div className="footer-wrapper">
        <Footer />
      </div>
    </MotionConfig>
  );
}
