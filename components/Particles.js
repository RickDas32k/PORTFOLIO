"use client";
import { useEffect, useRef } from "react";
export default function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, x = c.getContext("2d");
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w, h, raf, m = { x: -999, y: -999 };
    const ps = Array.from({ length: 70 }, () => ({ a: Math.random() * 6.28, r: 30 + Math.random() * 120, s: 0.002 + Math.random() * 0.004, z: 1 + Math.random() * 2 }));
    const size = () => { w = c.width = c.offsetWidth; h = c.height = c.offsetHeight; };
    const draw = () => {
      x.clearRect(0, 0, w, h);
      ps.forEach((p) => {
        p.a += still ? 0 : p.s;
        let px = w / 2 + Math.cos(p.a) * p.r * 1.6, py = h / 2 + Math.sin(p.a) * p.r * 0.8;
        const dx = px - m.x, dy = py - m.y, d = Math.hypot(dx, dy);
        if (d < 90) { px += (dx / d) * (90 - d) * 0.6; py += (dy / d) * (90 - d) * 0.6; }
        x.fillStyle = p.z > 2.2 ? "#ff3b30" : "rgba(255,255,255,.55)";
        x.fillRect(px, py, p.z, p.z);
      });
      if (!still) raf = requestAnimationFrame(draw);
    };
    const mv = (e) => { const b = c.getBoundingClientRect(); m = { x: e.clientX - b.left, y: e.clientY - b.top }; };
    size(); addEventListener("resize", size); c.addEventListener("pointermove", mv); draw();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", size); };
  }, []);
  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}
