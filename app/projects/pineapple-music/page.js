"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Particles from "../../../components/Particles";
import ApkDownload from "../../../components/ApkDownload";
import "./page.css";

const stack = [
  "Kotlin", "Android Native", "Android SDK",
  "YouTube Music Backend", "GitHub", "AI-Assisted Development",
  "Mobile UI/UX Design", "APK Packaging & Release",
];

const highlights = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
    ),
    title: "Ad-Free Streaming",
    desc: "Delivers a completely uninterrupted music listening experience, eliminating all advertisements for a premium feel.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>
    ),
    title: "Native Android",
    desc: "Built entirely with Kotlin and the Android SDK for smooth, performant, and platform-native interactions.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
    ),
    title: "Frosted-Glass UI",
    desc: "A modern, calming interface built with frosted-glass design principles — visual clarity meets elegant minimalism.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    ),
    title: "Custom Brand Identity",
    desc: "PineApple-inspired logo, icon, and colour system crafted for instant visual recognition across all app surfaces.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
    ),
    title: "YouTube Music Backend",
    desc: "Powered by the YouTube Music backend, providing access to an extensive catalogue of songs and artists.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    ),
    title: "AI-Assisted Development",
    desc: "Development workflow accelerated with AI tools and agentic workflows, setting a modern precedent for solo app development.",
  },
];

const screenshots = [
  "/screenshots/1.jpeg",
  "/screenshots/2.jpeg",
  "/screenshots/3.jpeg",
  "/screenshots/4.jpeg",
  "/screenshots/5.jpeg",
  "/screenshots/6.jpeg",
  "/screenshots/7.jpeg",
  "/screenshots/8.jpeg",
];

const adVideos = [
  { src: "/ads/PineApple-Music-Promo.mp4",  label: "PineApple Music — Official Promo" },
  { src: "/ads/NikAmore-Features.mp4",       label: "NikAmore — Feature Showcase" },
  { src: "/ads/nikamore-ad.mp4",             label: "NikAmore — Original Ad" },
  { src: "/ads/nikamore-vs.mp4",             label: "NikAmore — Comparison Ad" },
  { src: "/ads/LAST-1.mp4",                  label: "PineApple Music — Teaser 1" },
  { src: "/ads/LAST-2.mp4",                  label: "PineApple Music — Teaser 2" },
];

const timeline = [
  { year: "Jun '26", label: "NikAmore — First Build", desc: "Project conceived and shipped under the name NikAmore (package ID: NikAmp). Launched with a custom female-voice advertisement created under the artist name NikAmp. The first working APK marked the beginning of a solo native Android journey." },
  { year: "Oct '26", label: "PineApple Music — Rebrand", desc: "Full rebrand to PineApple Music with a fresh pineapple-inspired identity — new logo, icon system, colour palette, and refined frosted-glass UI. Released on GitHub with arm64-v8a and universal APK builds." },
  { year: "Present", label: "Active Development", desc: "Ongoing iteration on UI polish, feature additions, and performance improvements. PineApple Music continues to evolve as a personal flagship Android project with a growing set of capabilities." },
];

export default function PineAppleMusicPage() {
  const bar = useRef(null);
  const screensRef = useRef(null);
  const [lightbox, setLightbox] = useState(null); // { src, type: 'img'|'video' }

  const scrollScreenshots = (dir) => {
    if (screensRef.current) {
      screensRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.dataset.in = "1"; io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".rv").forEach((el) => io.observe(el));
    const onScroll = () => {
      const h = document.documentElement;
      if (bar.current) bar.current.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})`;
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); removeEventListener("scroll", onScroll); };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setLightbox(null); };
    if (lightbox) { document.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; }
    else document.body.style.overflow = "";
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <>
      {/* Progress bar */}
      <div className="progress" ref={bar} aria-hidden="true" />

      {/* Nav */}
      <nav className="nav" aria-label="Main">
        <Link href="/" className="logo">R.</Link>
        <Link href="/#projects" className="nav-back">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </Link>
        <span className="nav-pill-label">Mobile App</span>
      </nav>

      {/* Hero */}
      <header className="pp-hero">
        <div className="pp-hero-bg" aria-hidden="true">
          <div className="pp-orb pp-orb1" />
          <div className="pp-orb pp-orb2" />
          <div className="pp-grid-lines" />
        </div>
        <div className="pp-hero-inner">
          <span className="label l1">// PROJECT_INDEX [MOBILE_APP]</span>
          <div className="pp-title-wrap l2">
            <div className="pp-logo-wrap">
              <img
                src="/pineapple-logo.png"
                alt="PineApple Music Logo"
                className="pp-logo-img"
              />
            </div>
            <div>
              <h1 className="pp-h1">PineApple Music</h1>
              <p className="pp-formerly">formerly <em>NikAmore</em></p>
            </div>
          </div>
          <p className="pp-tagline l3">
            An ad-free, native Android music streaming application delivering a premium listening experience through a modern frosted-glass interface, powered by the YouTube Music backend.
          </p>
          <div className="cta l4">
            <ApkDownload />
            <a
              className="btn"
              href="https://github.com/RickDas32k/NikAmore"
              target="_blank"
              rel="noreferrer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.479 5.92.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z"/></svg>
              View on GitHub
            </a>
            <Link href="/#projects" className="btn">← All Projects</Link>
          </div>
          <div className="pp-meta l5">
            <div className="pp-meta-item">
              <span className="pp-meta-label">Platform</span>
              <span>Native Android</span>
            </div>
            <div className="pp-meta-item">
              <span className="pp-meta-label">Language</span>
              <span>Kotlin</span>
            </div>
            <div className="pp-meta-item">
              <span className="pp-meta-label">Status</span>
              <span className="pp-status"><i className="pp-dot" />Active</span>
            </div>
            <div className="pp-meta-item">
              <span className="pp-meta-label">Type</span>
              <span>Personal Project</span>
            </div>
          </div>
        </div>
      </header>

      {/* About */}
      <section className="sec pp-about-sec">
        <div className="pp-container">
          <span className="label rv">// 01 — OVERVIEW</span>
          <h2 className="rv" style={{ "--i": 1 }}>Project Overview</h2>
          <div className="pp-about-grid">
            <div className="rv" style={{ "--i": 2 }}>
              <p className="pp-body-text">
                PineApple Music is a fully native Android music streaming application developed to provide users with a seamless, ad-free listening experience. The project originated under the name <strong>NikAmore</strong> — with package identifier <code>NikAmp</code> — and has since evolved into a mature, polished product with a distinct brand identity.
              </p>
              <p className="pp-body-text">
                The application harnesses the YouTube Music backend to deliver access to a vast music catalogue, while presenting it through a bespoke interface built entirely in Kotlin using the Android SDK. The design philosophy centres on calm, uncluttered aesthetics: frosted-glass surfaces, smooth transitions, and a colour system that feels both modern and approachable.
              </p>
              <p className="pp-body-text">
                Beyond its core functionality, PineApple Music represents a commitment to independent, AI-assisted development — demonstrating how a single developer can conceptualise, design, build, and ship a production-quality Android application from the ground up.
              </p>
            </div>
            <div className="rv" style={{ "--i": 3 }}>
              <blockquote className="pp-quote">
                "An experience that respects the listener — no interruptions, no clutter, just music."
              </blockquote>
              <div className="pp-quick-facts">
                <div className="pp-fact">
                  <span className="pp-fact-num">100%</span>
                  <span className="pp-fact-label">Ad-Free Experience</span>
                </div>
                <div className="pp-fact">
                  <span className="pp-fact-num">Native</span>
                  <span className="pp-fact-label">Android Application</span>
                </div>
                <div className="pp-fact">
                  <span className="pp-fact-num">Solo</span>
                  <span className="pp-fact-label">Developer Project</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="sec pp-features-sec">
        <div className="pp-container">
          <span className="label rv">// 02 — FEATURES</span>
          <h2 className="rv" style={{ "--i": 1 }}>Key Features</h2>
          <div className="pp-features-grid">
            {highlights.map((h, i) => (
              <div key={h.title} className="pp-feature-card rv" style={{ "--i": i + 2 }}>
                <div className="pp-feature-icon">{h.icon}</div>
                <h3 className="pp-feature-title">{h.title}</h3>
                <p className="pp-feature-desc">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="sec pp-stack-sec">
        <div className="pp-container">
          <span className="label rv">// 03 — TECHNOLOGY</span>
          <h2 className="rv" style={{ "--i": 1 }}>Technology Stack</h2>
          <div className="pp-stack-wrap rv" style={{ "--i": 2 }}>
            {stack.map((s, k) => (
              <span key={s} className="pp-chip" style={{ "--k": k }}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Evolution Timeline */}
      <section className="sec pp-timeline-sec">
        <div className="pp-container">
          <span className="label rv">// 04 — EVOLUTION</span>
          <h2 className="rv" style={{ "--i": 1 }}>Project Timeline</h2>
          <div className="pp-timeline">
            {timeline.map((t, i) => (
              <div key={t.year} className="pp-tl-item rv" style={{ "--i": i + 2 }}>
                <div className="pp-tl-left">
                  <span className="pp-tl-year">{t.year}</span>
                </div>
                <div className="pp-tl-line">
                  <div className="pp-tl-dot" />
                  {i < timeline.length - 1 && <div className="pp-tl-track" />}
                </div>
                <div className="pp-tl-right">
                  <h4 className="pp-tl-label">{t.label}</h4>
                  <p className="pp-tl-desc">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section id="screenshots" className="sec pp-screenshots-sec">
        <div className="pp-container">
          <div className="pp-sec-head rv">
            <div>
              <span className="label">// 05 — SCREENSHOTS</span>
              <h2 style={{ margin: "6px 0 10px" }}>App Screenshots</h2>
              <p className="pp-section-sub">
                Side-by-side walkthrough of the interface. Tap any screen to view full size.
              </p>
            </div>
            <div className="pp-scroll-ctrls">
              <button
                type="button"
                className="pp-ctrl-btn"
                onClick={() => scrollScreenshots(-1)}
                aria-label="Scroll left"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button
                type="button"
                className="pp-ctrl-btn"
                onClick={() => scrollScreenshots(1)}
                aria-label="Scroll right"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>
          <div className="pp-screenshots-viewport rv" style={{ "--i": 2 }}>
            <div className="pp-screenshots-track" ref={screensRef}>
              {screenshots.map((src, n) => (
                <div key={src} className="pp-screenshot-slot">
                  <div
                    className="pp-phone-frame"
                    onClick={() => setLightbox({ src, type: "img" })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setLightbox({ src, type: "img" }); }}
                    aria-label={`View screenshot ${n + 1}`}
                  >
                    <div className="pp-phone-notch" />
                    <img
                      src={src}
                      alt={`PineApple Music screenshot ${n + 1}`}
                      className="pp-screenshot-img"
                      loading="lazy"
                    />
                    <div className="pp-screenshot-overlay">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                    </div>
                  </div>
                  <span className="pp-screen-caption">Screen 0{n + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement */}
      <section id="ads" className="sec pp-ads-sec">
        <div className="pp-container">
          <span className="label rv">// 06 — ADVERTISEMENT</span>
          <h2 className="rv" style={{ "--i": 1 }}>App Advertisement</h2>
          <p className="pp-section-sub rv" style={{ "--i": 2 }}>
            Promotional videos and ads created for PineApple Music and NikAmore. Tap to play full screen.
          </p>
          <div className="pp-ads-grid rv" style={{ "--i": 3 }}>
            {adVideos.map((v, i) => (
              <div key={v.src} className="pp-ad-slot">
                <div className="pp-ad-card">
                  <video
                    src={v.src}
                    className="pp-ad-video"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                  />
                  <div className="pp-ad-overlay" onClick={() => setLightbox({ src: v.src, type: "video" })} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setLightbox({ src: v.src, type: "video" }); }} aria-label={`Play ${v.label}`}>
                    <div className="pp-play-ring">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                  </div>
                  <div className="pp-ad-info">
                    <span className="pp-ad-label">{v.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub CTA */}
      <section className="sec pp-cta-sec contact">
        <Particles />
        <div className="pp-cta-inner rv" style={{ "--i": 1 }}>
          <span className="label">// REPOSITORY</span>
          <h2 className="pp-cta-h2 rv" style={{ "--i": 2 }}>
            Explore the<br /><span className="pp-cta-accent">Source Code</span>
          </h2>
          <p className="muted rv" style={{ "--i": 3 }}>
            The full project repository is available on GitHub. Explore the codebase, track the evolution from NikAmore to PineApple Music, and follow future updates.
          </p>
          <div className="cta rv" style={{ "--i": 4, justifyContent: "center" }}>
            <ApkDownload />
            <a
              className="btn"
              href="https://github.com/RickDas32k/NikAmore"
              target="_blank"
              rel="noreferrer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.479 5.92.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub Repository
            </a>
            <Link href="/#projects" className="btn">← Back to Projects</Link>
          </div>
        </div>
      </section>

      <footer className="foot">© 2026 Rick Das — PineApple Music</footer>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="pp-lightbox"
          onClick={(e) => { if (e.target === e.currentTarget) setLightbox(null); }}
          role="dialog"
          aria-modal="true"
        >
          <button className="pp-lb-close" onClick={() => setLightbox(null)} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          {lightbox.type === "img"
            ? <img src={lightbox.src} alt="Screenshot" className="pp-lb-img" />
            : <video src={lightbox.src} controls autoPlay className="pp-lb-video" />
          }
        </div>
      )}
    </>
  );
}
