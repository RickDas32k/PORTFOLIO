"use client";
import { useEffect, useRef, useState } from "react";
const rnd = () => String(Math.floor(Math.random() * 10));

// Digits flicker through random numbers, then lock in left to right. Non-digits stay put.
export default function Scramble({ text }) {
  const [out, setOut] = useState(text);
  const ref = useRef(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setOut(text); return; }
    let raf = 0;
    setOut(text.replace(/\d/g, rnd));
    const run = () => {
      const t0 = performance.now();
      const tick = (t) => {
        const e = t - t0; let s = "", di = 0, done = true;
        for (const ch of text) {
          if (/\d/.test(ch)) { if (e >= 500 + di * 120) s += ch; else { s += rnd(); done = false; } di++; } else s += ch;
        }
        setOut(s);
        if (!done) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { io.disconnect(); run(); } }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [text]);
  return <span ref={ref} suppressHydrationWarning>{out}</span>;
}
