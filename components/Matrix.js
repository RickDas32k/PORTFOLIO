"use client";
import { useEffect, useRef, useState } from "react";
import { matrix } from "../lib/data";
import { ICONS, SKILL_ICON } from "../lib/icons";
import Scramble from "./Scramble";

const SEG = 55; // vh of scrolling spent on each group
const pad = (n) => String(n).padStart(2, "0");

export default function Matrix() {
  const [active, setActive] = useState(0);
  const sec = useRef(null), tabs = useRef(null);

  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const r = sec.current.getBoundingClientRect(), total = r.height - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / (total || 1)));
      setActive(Math.min(matrix.length - 1, Math.floor(p * matrix.length)));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(calc); };
    on(); addEventListener("scroll", on, { passive: true }); addEventListener("resize", on);
    return () => { cancelAnimationFrame(raf); removeEventListener("scroll", on); removeEventListener("resize", on); };
  }, []);

  useEffect(() => { // keep the active tab visible in the mobile tab strip
    const el = tabs.current?.children[active];
    if (el && tabs.current.scrollWidth > tabs.current.clientWidth) tabs.current.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
  }, [active]);

  const jump = (i) => {
    const r = sec.current.getBoundingClientRect(), total = r.height - innerHeight;
    scrollTo({ top: scrollY + r.top + ((i + 0.5) / matrix.length) * total });
  };
  const [g, ts] = matrix[active];

  return (
    <section id="matrix" ref={sec} className="mx" style={{ height: `${100 + matrix.length * SEG}vh` }}>
      <div className="mx-stick">
        <span className="label rv"><Scramble text="// 03.00 SEC_MATRIX_INDEX [03/04]" /></span>
        <h2 className="rv" style={{ "--i": 1 }}>The technology matrix</h2>
        <div className="mx-body">
          <div className="mx-tabs" ref={tabs} role="tablist">
            {matrix.map(([name, list], i) => (
              <button key={name} role="tab" aria-selected={i === active} className={i === active ? "on" : ""} onClick={() => jump(i)}>
                <em>{pad(i + 1)}</em><span>{name}</span><b>{i === active ? <Scramble key={active} text={pad(list.length)} /> : pad(list.length)}</b>
              </button>
            ))}
          </div>
          <div className="mx-panel" key={active}>
            <h3>{g}</h3>
            <div className="tiles">
              {ts.map((t, k) => (
                <div className="tile" style={{ "--k": k }} key={t}>
                  {SKILL_ICON[t] ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d={ICONS[SKILL_ICON[t]]} fill="currentColor" /></svg> : <i className="dotmark" />}
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
