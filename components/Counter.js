"use client";
import { useEffect, useRef, useState } from "react";
export default function Counter({ value }) {
  const m = value.match(/^(\d+)(.*)$/);
  const end = m ? +m[1] : 0, suffix = m ? m[2] : value;
  const [n, setN] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(end); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min((t - t0) / 1400, 1);
        setN(Math.round(end * (1 - Math.pow(1 - p, 4))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [end]);
  return <span ref={ref} suppressHydrationWarning>{n}{suffix}</span>;
}
