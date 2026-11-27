"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Particles from "../components/Particles";
import Scramble from "../components/Scramble";
import Matrix from "../components/Matrix";
import MapVideo from "../components/MapVideo";
import ApkDownload from "../components/ApkDownload";
import ViewsCounter from "../components/ViewsCounter";
import { profile, stats, projects, matrix, socials } from "../lib/data";

const PROJECT_ROUTES = {
  "PineApple Music (formerly NikAmore)": "/projects/pineapple-music",
};

const focus = [
  ["Web & app", "Websites and native Android apps, built end to end."],
  ["AI workflows", "Agentic tools and AI-assisted development in daily use."],
  ["School technology", "ERP, UDISE+, CBSE OASIS and institutional IT."],
];
const cursors = [
  ["web", "#ff3b30", "8%", "62%", "-30px,-40px", "13s"],
  ["android", "#4cc9f0", "24%", "88%", "40px,-30px", "16s"],
  ["ai", "#ffd166", "92%", "70%", "-50px,30px", "15s"],
  ["infra", "#b388ff", "78%", "30%", "30px,40px", "18s"],
];
const tags = matrix.flatMap(([, t]) => t);
const links = [["about", "About"], ["projects", "Projects"], ["matrix", "Matrix"], ["contact", "Contact"]];

function Project({ p, i }) {
  const keys = Object.keys(p.tabs);
  const [tab, setTab] = useState(keys[0]);
  const items = p.tabs[tab];
  const router = useRouter();
  const route = PROJECT_ROUTES[p.title];
  return (
    <article className={`card rv${route ? " card-linked" : ""}`} style={{ "--i": i }} onClick={route ? () => router.push(route) : undefined} role={route ? "button" : undefined} tabIndex={route ? 0 : undefined} onKeyDown={route ? (e) => { if (e.key === "Enter" || e.key === " ") router.push(route); } : undefined} aria-label={route ? `Open ${p.title} project page` : undefined}>
      <span className="label">{p.tag}</span>
      {route && (
        <span className="card-link-hint">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          View Project
        </span>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "6px 0 8px" }}>
        {p.title.includes("PineApple Music") && (
          <img
            src="/pineapple-logo.png"
            alt="PineApple Music Logo"
            style={{ width: "36px", height: "36px", borderRadius: "10px", objectFit: "cover", flexShrink: 0, boxShadow: "0 4px 14px rgba(255,59,48,0.35)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
        )}
        <h3 style={{ margin: 0 }}>{p.title}</h3>
      </div>
      <p className="muted">{p.blurb}</p>
      <div className="tabs" role="tablist">
        {keys.map((k) => (
          <button key={k} role="tab" aria-selected={k === tab} className={k === tab ? "on" : ""} onClick={(e) => { e.stopPropagation(); setTab(k); }}>{k}</button>
        ))}
      </div>
      {tab === "Stack" ? (
        <div className="chips">{items.map((x) => <span key={x}>{x}</span>)}</div>
      ) : (
        <ul>{items.map((x) => <li key={x}>{x}</li>)}</ul>
      )}
      {p.title.includes("PineApple Music") && (
        <div style={{ marginTop: "18px" }} onClick={(e) => e.stopPropagation()}>
          <ApkDownload small />
        </div>
      )}
    </article>
  );
}

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [photoOk, setPhotoOk] = useState(true);
  const [active, setActive] = useState("");
  const [resumeOpen, setResumeOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);
  const bar = useRef(null), glow = useRef(null), photo = useRef(null), navRef = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.dataset.in = "1"; io.unobserve(e.target); } }), { threshold: 0.12 });
    document.querySelectorAll(".rv").forEach((el) => io.observe(el));
    const so = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(([id]) => so.observe(document.getElementById(id)));
    const hero = document.getElementById("top");
    const ho = new IntersectionObserver(([e]) => hero.classList.toggle("off", !e.isIntersecting));
    ho.observe(hero);
    const onScroll = () => {
      const h = document.documentElement;
      bar.current.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})`;
      setScrolled(h.scrollTop > 60);
    };
    addEventListener("scroll", onScroll, { passive: true });
    // close expanded nav on click-outside
    const onDocClick = (e) => { if (navRef.current && !navRef.current.contains(e.target)) setNavExpanded(false); };
    document.addEventListener("click", onDocClick);
    return () => { io.disconnect(); so.disconnect(); ho.disconnect(); removeEventListener("scroll", onScroll); document.removeEventListener("click", onDocClick); };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setResumeOpen(false); };
    if (resumeOpen) { document.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => document.removeEventListener("keydown", onKey);
  }, [resumeOpen]);

  const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const heroMove = (e) => {
    if (e.pointerType !== "mouse" || still()) return;
    const b = e.currentTarget.getBoundingClientRect();
    glow.current.style.transform = `translate3d(${e.clientX - b.left - 300}px,${e.clientY - b.top - 300}px,0)`;
  };
  const tilt = (e) => {
    if (e.pointerType !== "mouse" || still()) return;
    const b = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
    photo.current.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  };
  const untilt = () => { photo.current.style.transform = ""; };
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  return (
    <>
      <MapVideo />
      <div className="progress" ref={bar} aria-hidden="true" />
      <nav ref={navRef} className={`nav${scrolled ? " nav-pill" : ""}${navExpanded ? " nav-open" : ""}`} aria-label="Main">
        {/* Pill mode: just the R. logo — click to expand */}
        <a href="#top" className="logo" onClick={scrolled ? (e) => { e.preventDefault(); setNavExpanded(v => !v); } : undefined}>R.</a>
        {/* Full links — hidden in pill mode unless expanded */}
        <span className="nav-links">
          {links.map(([id, t]) => <a key={id} href={`#${id}`} className={active === id ? "act" : ""} onClick={() => setNavExpanded(false)}>{t}</a>)}
          <a href="#contact" className="pill" onClick={() => setNavExpanded(false)}>Get in touch</a>
        </span>
      </nav>

      <header id="top" className="hero" onPointerMove={heroMove}>
        <div className="glow" ref={glow} aria-hidden="true" />
        <div className="ghost glow-t" aria-hidden="true"><span>PORTFOLIO</span></div>
        <div className="ghost" aria-hidden="true"><span>PORTFOLIO</span></div>
        {cursors.map(([n, c, l, t, d, s]) => (
          <div key={n} className="cur" style={{ left: l, top: t, "--c": c, "--d": s, "--m": d }} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M2 1l13 7-6 2-2 6z" fill={c} /></svg><b>{n}</b>
          </div>
        ))}
        <div className="hero-grid">
          <div className="h-left">
            <p className="hello l1">Hello, I&apos;m</p>
            <h1 className="l2"><span className="name">RICK.</span></h1>
            <p className="role l3">{profile.title}</p>
            <p className="lead l4">{profile.tagline}</p>
            <div className="cta l5">
              <a className="btn solid" href="#projects">See my work</a>
              <a className="btn" href="#contact">Contact me</a>
            </div>
          </div>
          <figure className="photo-wrap" onPointerMove={tilt} onPointerLeave={untilt}>
            <div className="photo" ref={photo}>
              {photoOk ? <img src="/rick.jpg" alt="Portrait of Rick Das" onError={() => setPhotoOk(false)} /> : <span className="initials">RD</span>}
              <i className="scan" aria-hidden="true" />
              <i className="br tl" /><i className="br tr" /><i className="br bl" /><i className="br brr" /><em className="coord"><Scramble text="27.33°N 88.60°E" /></em>
              <figcaption><span className="dot" />OPERATOR // RICK DAS</figcaption>
            </div>
          </figure>
          <aside className="h-right">
            {focus.map(([t, d], i) => (
              <div key={t} className="mini" style={{ "--i": i }}>
                <span className="label">{t}</span><p>{d}</p>
              </div>
            ))}
          </aside>
        </div>
        <dl className="stats">
          {stats.map(([n, l, s], i) => (
            <div key={l} className="rv" style={{ "--i": i }}><dt><Scramble text={n} /></dt><dd><b>{l}</b><br />{s}</dd></div>
          ))}
        </dl>
      </header>

      <div className="marquee" aria-hidden="true"><div>{[...tags, ...tags].map((t, i) => <span key={i}>{t}</span>)}</div></div>

      <section id="about" className="sec">
        <span className="label rv"><Scramble text="// 01.00 SEC_ABOUT_INDEX [01/04]" /></span>
        <h2 className="rv" style={{ "--i": 1 }}>Background &amp; philosophy</h2>
        <div className="about">
          <div>{profile.bio.map((t, i) => <p key={t} className="rv" style={{ "--i": i + 2 }}>{t}</p>)}</div>
          <blockquote className="rv" style={{ "--i": 3 }}>{profile.belief}</blockquote>
        </div>
      </section>

      <section id="projects" className="sec">
        <span className="label rv"><Scramble text="// 02.00 SEC_PROJECT_INDEX [02/04]" /></span>
        <h2 className="rv" style={{ "--i": 1 }}>Featured projects</h2>
        <div className="cards">{projects.map((p, i) => <Project key={p.title} p={p} i={i} />)}</div>
      </section>

      <Matrix />

      <section id="contact" className="sec contact">
        <Particles />
        <div className="contact-in">
          <span className="label rv"><Scramble text="// 04.00 SEC_CONTACT_INDEX [04/04]" /></span>
          <h2 className="rv big" style={{ "--i": 1 }}><span>Let&apos;s build something</span><span>that matters.</span></h2>
          <p className="muted rv" style={{ "--i": 2 }}>Open to web, mobile, and AI projects, and to conversations about school technology.</p>
          <div className="cta rv" style={{ "--i": 3 }}>
            <a className="btn solid" href={`mailto:${profile.email}`}>{profile.email}</a>
            <button className="btn" onClick={copy}>{copied ? "Copied" : "Copy email"}</button>
            <a className="btn" href="/resume.pdf" download="Rick-Das-Resume.pdf">Download resume</a>
              <button className="btn btn-eye" onClick={() => setResumeOpen(true)} aria-label="View resume">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                View
              </button>
          </div>
          <ul className="social rv" style={{ "--i": 4 }}>{socials.map(([n, u]) => <li key={n}><a href={u} target="_blank" rel="noreferrer">{n}</a></li>)}</ul>
        </div>
      </section>
      <a className="fab" href="/resume.pdf" download="Rick-Das-Resume.pdf" aria-label="Download resume">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12m0 0l-5-5m5 5l5-5M5 21h14" /></svg>Resume
      </a>
      <button className="fab fab-view" onClick={() => setResumeOpen(true)} aria-label="View resume">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>
      {resumeOpen && (
        <div className="resume-modal" role="dialog" aria-modal="true" aria-label="Resume preview" onClick={(e) => { if (e.target === e.currentTarget) setResumeOpen(false); }}>
          <div className="resume-modal-box">
            <div className="resume-modal-header">
              <span className="resume-modal-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Resume Preview
              </span>
              <div className="resume-modal-actions">
                <a className="btn btn-sm" href="/resume.pdf" download="Rick-Das-Resume.pdf" aria-label="Download resume">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12m0 0l-5-5m5 5l5-5M5 21h14"/></svg>
                  Download
                </a>
                <button className="resume-modal-close" onClick={() => setResumeOpen(false)} aria-label="Close preview">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
            <iframe src="/resume.pdf" title="Resume PDF" className="resume-iframe" />
          </div>
        </div>
      )}
      <footer className="foot">
        <ViewsCounter />
        <span>© 2026 Rick Das</span>
      </footer>
    </>
  );
}
