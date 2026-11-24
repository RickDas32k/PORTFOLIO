"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Repo whose GitHub Releases hold the APKs. The site reads the latest release
// automatically, so publishing a new release updates the links here.
const REPO = "RickDas32k/NikAmore";
const API = `https://api.github.com/repos/${REPO}/releases/latest`;

// Used only if GitHub can't be reached (offline / rate limited).
const FALLBACK = {
  version: "v1.0.4",
  modern: "https://github.com/RickDas32k/NikAmore/releases/download/v1.0.4/NikAmp-v1.0.4_arm64-v8a.apk",
  universal: "https://github.com/RickDas32k/NikAmore/releases/download/v1.0.4/NikAmp-v1.0.4.apk",
};

const CACHE_KEY = "pp-latest-release";
const CACHE_MS = 30 * 60 * 1000; // 30 min, keeps us well under GitHub's rate limit
let inflight = null;

function pick(release) {
  const apks = (release.assets || []).filter((a) => /\.apk$/i.test(a.name));
  const modern = apks.find((a) => /arm64/i.test(a.name));
  const universal =
    apks.find((a) => !/arm64|armeabi|x86/i.test(a.name)) ||
    apks.filter((a) => a !== modern).sort((a, b) => b.size - a.size)[0];
  return {
    version: release.tag_name || FALLBACK.version,
    modern: modern?.browser_download_url || FALLBACK.modern,
    universal: universal?.browser_download_url || FALLBACK.universal,
  };
}

function loadLatest() {
  try {
    const c = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
    if (c && Date.now() - c.t < CACHE_MS) return Promise.resolve(c.data);
  } catch {}
  if (inflight) return inflight;
  inflight = fetch(API, { headers: { Accept: "application/vnd.github+json" } })
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((json) => {
      const data = pick(json);
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data })); } catch {}
      return data;
    })
    .catch(() => FALLBACK)
    .finally(() => { inflight = null; });
  return inflight;
}

const dlIcon = (s) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12m0 0l-5-5m5 5l5-5M5 21h14" /></svg>
);

export default function ApkDownload({ small = false }) {
  const [open, setOpen] = useState(false);
  const [rel, setRel] = useState(FALLBACK);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let live = true;
    loadLatest().then((d) => live && setRel(d));
    return () => { live = false; };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open]);

  const options = [
    { href: rel.modern, title: "Download for Modern Phones", size: "(>70MB)", note: "arm64-v8a · recommended for most phones" },
    { href: rel.universal, title: "Download Universal Version", size: "(>180MB)", note: "Works on every Android device" },
  ];

  return (
    <>
      <button type="button" className={`btn solid${small ? " btn-sm" : ""}`} onClick={(e) => { e.stopPropagation(); setOpen(true); }}>
        {dlIcon(small ? 13 : 15)}
        Download for Android
      </button>

      {open && mounted && createPortal(
        <div className="apk-overlay" onClick={(e) => { e.stopPropagation(); if (e.target === e.currentTarget) setOpen(false); }} role="dialog" aria-modal="true" aria-labelledby="apk-title">
          <div className="apk-modal">
            <button type="button" className="apk-close" onClick={() => setOpen(false)} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <span className="label">// ANDROID · {rel.version}</span>
            <h3 id="apk-title">Download PineApple Music</h3>
            <p className="muted apk-sub">Pick the version that fits your phone.</p>
            <div className="apk-options">
              {options.map((o) => (
                <a key={o.title} className="apk-opt" href={o.href} onClick={() => setTimeout(() => setOpen(false), 400)}>
                  <span className="apk-opt-ic">{dlIcon(18)}</span>
                  <span className="apk-opt-txt">
                    <b>{o.title} <em>{o.size}</em></b>
                    <small>{o.note}</small>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
