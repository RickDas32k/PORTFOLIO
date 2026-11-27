"use client";
import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "rick_portfolio_viewed";
const POLL_INTERVAL_MS = 10000;

export default function ViewsCounter() {
  const [views, setViews] = useState(null);
  const [configured, setConfigured] = useState(true);
  const [docked, setDocked] = useState(false);
  const slotRef = useRef(null);

  useEffect(() => {
    const el = slotRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setDocked(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let active = true;

    async function registerOrFetchView() {
      try {
        const alreadyViewed =
          typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1";
        const res = await fetch("/api/views", {
          method: alreadyViewed ? "GET" : "POST",
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        if (typeof data.configured === "boolean") setConfigured(data.configured);
        if (typeof data.views === "number") {
          setViews(data.views);
          if (!alreadyViewed && typeof window !== "undefined") {
            sessionStorage.setItem(SESSION_KEY, "1");
          }
        }
      } catch {
        // Ignore transient network errors
      }
    }

    async function pollViews() {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/views", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        if (typeof data.configured === "boolean") setConfigured(data.configured);
        if (typeof data.views === "number") setViews(data.views);
      } catch {
        // Ignore transient network errors
      }
    }

    registerOrFetchView();
    const timer = setInterval(pollViews, POLL_INTERVAL_MS);
    const onVisibility = () => {
      if (document.visibilityState === "visible") pollViews();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      active = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const formatted =
    views !== null ? views.toLocaleString("en-US") : configured ? "..." : "--";

  return (
    <div ref={slotRef} className="views-slot">
      <div
        className={`views-badge ${docked ? "views-badge-docked" : "views-badge-pinned"}`}
        aria-live="polite"
        title={configured ? "Live website views" : "Upstash Redis not configured yet"}
      >
        <span className="views-dot" aria-hidden="true" />
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span className="views-label">LIVE VIEWS</span>
        <span className="views-count">{formatted}</span>
      </div>
    </div>
  );
}
