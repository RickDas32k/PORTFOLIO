"use client";
import { useEffect, useRef, useState } from "react";
import Particles from "../components/Particles";
import Counter from "../components/Counter";
import MapBg from "../components/MapBg";
import { profile, stats, projects, matrix, socials } from "../lib/data";

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
  return (
    <article className="card rv" style={{ "--i": i }}>
      <span className="label">{p.tag}</span>
      <h3>{p.title}</h3>
      <p className="muted">{p.blurb}</p>
      <div className="tabs" role="tablist">
        {keys.map((k) => (
          <button key={k} role="tab" aria-selected={k === tab} className={k === tab ? "on" : ""} onClick={() => setTab(k)}>{k}</button>
        ))}
      </div>
      {tab === "Stack" ? (
        <div className="chips">{items.map((x) => <span key={x}>{x}</span>)}</div>
      ) : (
        <ul>{items.map((x) => <li key={x}>{x}</li>)}</ul>
      )}
    </article>
  );
}

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(0);
  const [photoOk, setPhotoOk] = useState(true);
  const [active, setActive] = useState("");
  const bar = useRef(null), glow = useRef(null), photo = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    document.querySelectorAll(".rv").forEach((el) => io.observe(el));
    const so = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(([id]) => so.observe(document.getElementById(id)));
    const onScroll = () => {
      const h = document.documentElement;
      bar.current.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})`;
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); so.disconnect(); removeEventListener("scroll", onScroll); };
  }, []);

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
      <MapBg />
      <div className="progress" ref={bar} aria-hidden="true" />
      <nav className="nav" aria-label="Main">
        <a href="#top" className="logo">R.</a>
        {links.map(([id, t]) => <a key={id} href={`#${id}`} className={active === id ? "act" : ""}>{t}</a>)}
        <a href="#contact" className="pill">Get in touch</a>
      </nav>

      <header id="top" className="hero" onPointerMove={heroMove}>
        <div className="glow" ref={glow} aria-hidden="true" />
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
              <i className="br tl" /><i className="br tr" /><i className="br bl" /><i className="br brr" /><em className="coord">27.33°N 88.60°E</em>
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
            <div key={l} className="rv" style={{ "--i": i }}><dt><Counter value={n} /></dt><dd><b>{l}</b><br />{s}</dd></div>
          ))}
        </dl>
      </header>

      <div className="marquee" aria-hidden="true"><div>{[...tags, ...tags].map((t, i) => <span key={i}>{t}</span>)}</div></div>

      <section id="about" className="sec">
        <span className="label rv">// 01.00 SEC_ABOUT_INDEX [01/04]</span>
        <h2 className="rv" style={{ "--i": 1 }}>Background &amp; philosophy</h2>
        <div className="about">
          <div>{profile.bio.map((t, i) => <p key={t} className="rv" style={{ "--i": i + 2 }}>{t}</p>)}</div>
          <blockquote className="rv" style={{ "--i": 3 }}>{profile.belief}</blockquote>
        </div>
      </section>

      <section id="projects" className="sec">
        <span className="label rv">// 02.00 SEC_PROJECT_INDEX [02/04]</span>
        <h2 className="rv" style={{ "--i": 1 }}>Featured projects</h2>
        <div className="cards">{projects.map((p, i) => <Project key={p.title} p={p} i={i} />)}</div>
      </section>

      <section id="matrix" className="sec">
        <span className="label rv">// 03.00 SEC_MATRIX_INDEX [03/04]</span>
        <h2 className="rv" style={{ "--i": 1 }}>The technology matrix</h2>
        <div className="matrix">
          {matrix.map(([g, ts], i) => (
            <div key={g} className={"group rv" + (open === i ? " open" : "")} style={{ "--i": i % 4 }}>
              <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{g}</span><em>{ts.length}</em>
              </button>
              <div className="body"><div className="chips">{ts.map((t, k) => <span key={t} style={{ "--k": k }}>{t}</span>)}</div></div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="sec contact">
        <Particles />
        <div className="contact-in">
          <span className="label rv">// 04.00 SEC_CONTACT_INDEX [04/04]</span>
          <h2 className="rv big" style={{ "--i": 1 }}>Let&apos;s build something that matters.</h2>
          <p className="muted rv" style={{ "--i": 2 }}>Open to web, mobile, and AI projects, and to conversations about school technology.</p>
          <div className="cta rv" style={{ "--i": 3 }}>
            <a className="btn solid" href={`mailto:${profile.email}`}>{profile.email}</a>
            <button className="btn" onClick={copy}>{copied ? "Copied" : "Copy email"}</button>
          </div>
          <ul className="social rv" style={{ "--i": 4 }}>{socials.map(([n, u]) => <li key={n}><a href={u} target="_blank" rel="noreferrer">{n}</a></li>)}</ul>
        </div>
      </section>
      <footer className="foot">© 2026 Rick Das</footer>
    </>
  );
}
