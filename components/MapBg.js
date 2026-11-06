"use client";
import { useEffect, useRef } from "react";
import { geoOrthographic, geoPath, geoGraticule, geoDistance } from "d3-geo";

const KF = [
  { p: 0, lon: 25, lat: 18, k: 0.36 },
  { p: 0.16, lon: 78, lat: 22, k: 0.42 },
  { p: 0.34, lon: 80, lat: 23, k: 1.5 },
  { p: 0.55, lon: 88, lat: 24.4, k: 8 },
  { p: 0.78, lon: 88.45, lat: 27.55, k: 26 },
  { p: 1, lon: 88.6065, lat: 27.3389, k: 60 },
];
const STAGES = [[0, "EARTH"], [0.16, "INDIA"], [0.42, "WEST BENGAL"], [0.68, "SIKKIM"], [0.9, "GANGTOK"]];
const KOL = [88.3639, 22.5726], SIL = [88.3953, 26.7271], GTK = [88.6065, 27.3389];
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ss = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };

function view(p) {
  let i = 0;
  while (i < KF.length - 2 && p > KF[i + 1].p) i++;
  const a = KF[i], b = KF[i + 1], t = ss((p - a.p) / (b.p - a.p));
  return { lon: a.lon + (b.lon - a.lon) * t, lat: a.lat + (b.lat - a.lat) * t, k: Math.exp(Math.log(a.k) + (Math.log(b.k) - Math.log(a.k)) * t) };
}

export default function MapBg() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = getComputedStyle(c).fontFamily;
    let w = 0, h = 0, dpr = 1, raf, target = 0, cur = 0, geo = null;
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 1.5);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const prog = () => { const d = document.documentElement; target = clamp(d.scrollTop / ((d.scrollHeight - d.clientHeight) || 1)); };
    Promise.all(["countries", "states", "detail"].map((n) => fetch(`/geo/${n}.json`).then((r) => r.json())))
      .then(([countries, states, detail]) => { geo = { countries, states, detail }; }).catch(() => {});

    const draw = (t) => {
      if (still) { cur = target; t = 0; } else cur += (target - cur) * 0.07;
      const p = cur, v = view(p);
      const u = Math.max(0.75, Math.min(1, w / 900));
      const lon = v.lon + (1 - clamp(p / 0.05)) * t * 0.004, lat = v.lat, k = v.k;
      const R = k * Math.min(w, h);
      const proj = geoOrthographic().translate([w / 2, h / 2]).scale(R).rotate([-lon, -lat]).clipAngle(90).clipExtent([[-30, -30], [w + 30, h + 30]]).precision(0.5);
      const path = geoPath(proj, ctx);
      ctx.clearRect(0, 0, w, h);

      if (k < 1.3) {
        const g = ctx.createRadialGradient(w / 2, h / 2, R * 0.95, w / 2, h / 2, R * 1.22);
        g.addColorStop(0, "rgba(255,59,48,.35)"); g.addColorStop(1, "rgba(255,59,48,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(w / 2, h / 2, R * 1.22, 0, 6.29); ctx.fill();
      }
      ctx.beginPath(); path({ type: "Sphere" }); ctx.fillStyle = "rgba(7,9,11,.9)"; ctx.fill();
      ctx.strokeStyle = "rgba(255,90,80,.55)"; ctx.lineWidth = 1.2; ctx.stroke();

      const span = Math.min(180, (Math.hypot(w, h) / 2 / R) * 57.3 * 1.15);
      const s = span > 60 ? 15 : span > 25 ? 10 : span > 8 ? 5 : span > 3 ? 1 : span > 1 ? 0.25 : 0.1;
      const gr = span >= 90 ? geoGraticule().step([s, s]) : geoGraticule().extent([[lon - span, Math.max(-90, lat - span)], [lon + span, Math.min(90, lat + span)]]).step([s, s]);
      ctx.beginPath(); path(gr()); ctx.strokeStyle = "rgba(255,255,255,.07)"; ctx.lineWidth = 0.6; ctx.stroke();

      if (geo) {
        ctx.beginPath(); path({ type: "FeatureCollection", features: geo.countries.features.filter((f) => f.properties.ADM0_A3 !== "IND") });
        ctx.fillStyle = "rgba(255,255,255,.04)"; ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.2)"; ctx.lineWidth = 0.7; ctx.stroke();

        const ia = 0.35 + 0.65 * clamp((k - 0.9) / 1);
        ctx.beginPath(); path({ type: "FeatureCollection", features: geo.states.features.filter((f) => !["Sikkim", "West Bengal"].includes(f.properties.NAME_1)) });
        ctx.fillStyle = `rgba(255,59,48,${0.07 * ia + 0.03})`; ctx.fill(); ctx.strokeStyle = `rgba(255,59,48,${0.5 * ia})`; ctx.lineWidth = 0.7; ctx.stroke();

        const wb = ss((p - 0.35) / 0.2), sk = ss((p - 0.6) / 0.2), pulse = still ? 0 : Math.sin(t / 500) * 0.04;
        geo.detail.features.forEach((f) => {
          const isSk = f.properties.NAME_1 === "Sikkim", a = isSk ? sk : wb;
          ctx.beginPath(); path(f);
          ctx.fillStyle = `rgba(255,59,48,${0.1 + a * (isSk ? 0.28 : 0.14) + pulse * a})`; ctx.fill();
          ctx.strokeStyle = `rgba(255,${isSk ? 100 : 80},70,${0.55 + 0.45 * a})`; ctx.lineWidth = 0.8 + a * (isSk ? 1.8 : 1); ctx.stroke();
        });
      }

      const ctr = [lon, lat], vis = (pt) => geoDistance(pt, ctr) < 1.5;
      const ra = ss((p - 0.3) / 0.15);
      if (ra > 0) {
        ctx.save(); ctx.beginPath(); path({ type: "LineString", coordinates: [KOL, SIL, GTK] });
        ctx.setLineDash([8, 7]); ctx.lineDashOffset = -t * 0.03; ctx.strokeStyle = `rgba(255,120,100,${0.85 * ra})`; ctx.lineWidth = 1.6; ctx.shadowColor = "#ff3b30"; ctx.shadowBlur = 8; ctx.stroke(); ctx.restore();
      }
      const pin = (pt, label, a, big) => {
        if (a <= 0.01 || !vis(pt)) return null;
        const [x, y] = proj(pt), ph = still ? 0.5 : (t % 1800) / 1800;
        ctx.globalAlpha = a; ctx.strokeStyle = "#ff3b30"; ctx.fillStyle = "#ff3b30"; ctx.lineWidth = 1.5;
        ctx.save(); ctx.translate(x, y); ctx.rotate(0.785); ctx.fillRect(-4, -4, 8, 8); ctx.restore();
        ctx.globalAlpha = a * (1 - ph); ctx.beginPath(); ctx.arc(x, y, 8 + ph * (big ? 46 : 26) * u, 0, 6.29); ctx.stroke();
        ctx.globalAlpha = a; ctx.font = `600 ${(big ? 13 : 11) * u}px ${font}`; ctx.fillStyle = "#fff"; ctx.fillText(label, x + 14, y + 4); ctx.globalAlpha = 1;
        return [x, y];
      };
      pin(KOL, "KOLKATA", ss((p - 0.4) / 0.1) * (1 - ss((p - 0.8) / 0.1)), false);
      pin(SIL, "SILIGURI", ss((p - 0.62) / 0.1) * (1 - ss((p - 0.92) / 0.06)), false);
      const gp = pin(GTK, "GANGTOK // DPS", ss((p - 0.5) / 0.15), true);
      if (gp && p > 0.86 && ctx.createConicGradient && !still) {
        const g = ctx.createConicGradient((t / 1500) % 6.283, gp[0], gp[1]);
        g.addColorStop(0, "rgba(255,59,48,0)"); g.addColorStop(0.92, "rgba(255,59,48,0)"); g.addColorStop(1, "rgba(255,59,48,.4)");
        ctx.globalAlpha = ss((p - 0.86) / 0.1); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(gp[0], gp[1], 170 * u, 0, 6.29); ctx.fill(); ctx.globalAlpha = 1;
      }

      // HUD
      const m = 16, L = 26 * u;
      ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.lineWidth = 1.5; ctx.beginPath();
      [[m, m, 1, 1], [w - m, m, -1, 1], [m, h - m, 1, -1], [w - m, h - m, -1, -1]].forEach(([x, y, a, b]) => { ctx.moveTo(x + a * L, y); ctx.lineTo(x, y); ctx.lineTo(x, y + b * L); });
      ctx.stroke();
      let si = 0; STAGES.forEach(([th], i) => { if (p >= th - 0.001) si = i; });
      ctx.textBaseline = "alphabetic";
      ctx.font = `500 ${11 * u}px ${font}`; ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillText(`SECTOR ${String(si + 1).padStart(2, "0")}/05`, m + 12, h - m - 62 * u);
      ctx.font = `700 ${24 * u}px ${font}`; ctx.fillStyle = "#ff3b30"; ctx.fillText(STAGES[si][1], m + 12, h - m - 34 * u);
      ctx.font = `500 ${11 * u}px ${font}`; ctx.fillStyle = "rgba(255,255,255,.7)";
      const alt = Math.round(20000 / k);
      ctx.fillText(`LAT ${Math.abs(lat).toFixed(4)}${lat >= 0 ? "N" : "S"}  LON ${Math.abs(((lon + 540) % 360) - 180).toFixed(4)}E  ALT ${alt.toLocaleString()} KM`, m + 12, h - m - 12 * u);
      ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fillRect(w - m - 8, m + 70, 2, h - 2 * m - 140);
      ctx.fillStyle = "#ff3b30"; ctx.fillRect(w - m - 8, m + 70, 2, (h - 2 * m - 140) * p);
      if (p < 0.04 && (still || Math.floor(t / 600) % 2 === 0)) { ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.textAlign = "right"; ctx.fillText("SCROLL TO INFIL", w - m - 18, h - m - 12 * u); ctx.textAlign = "left"; }
      const rr = 20 * u, lock = ss((p - 0.88) / 0.1);
      ctx.strokeStyle = lock > 0.5 ? "#ff3b30" : "rgba(255,255,255,.35)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(w / 2, h / 2, rr, 0, 6.29);
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { ctx.moveTo(w / 2 + a * rr, h / 2 + b * rr); ctx.lineTo(w / 2 + a * (rr + 9), h / 2 + b * (rr + 9)); });
      ctx.stroke();
      if (!still) raf = requestAnimationFrame(draw);
    };
    const loop = (t) => { draw(t); if (!still) raf = requestAnimationFrame(loop); };
    const onScroll = () => { prog(); if (still) draw(0); };
    size(); prog(); cur = target; raf = requestAnimationFrame(loop);
    const onResize = () => { size(); if (still) draw(0); };
    addEventListener("resize", onResize); addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", onResize); removeEventListener("scroll", onScroll); };
  }, []);
  return (
    <div className="mapwrap" aria-hidden="true">
      <canvas ref={ref} className="mapbg" />
      <div className="crt" />
    </div>
  );
}
