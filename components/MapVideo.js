"use client";
import { useEffect, useRef } from "react";

// Scroll position -> video time. The video is all-intra (every frame a keyframe), so seeking is instant.
export default function MapVideo() {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current, mq = matchMedia("(max-aspect-ratio: 1/1)");
    let target = 0, cur = 0, raf = 0, dur = 0;
    const load = () => { const s = mq.matches ? "/map-mobile.mp4" : "/map.mp4"; if (!v.src.endsWith(s)) { dur = 0; v.src = s; v.load(); } };
    const prog = () => { const d = document.documentElement; target = Math.min(1, Math.max(0, d.scrollTop / ((d.scrollHeight - d.clientHeight) || 1))); };
    const step = () => {
      raf = 0; if (!dur) return;
      cur += (target - cur) * 0.2; if (Math.abs(target - cur) < 0.0004) cur = target;
      const t = Math.min(cur * dur, dur - 0.04);
      if (!v.seeking && Math.abs(v.currentTime - t) > 0.01) v.currentTime = t;
      if (cur !== target || v.seeking) raf = requestAnimationFrame(step);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
    const onMeta = () => { dur = v.duration; prog(); cur = target; kick(); };
    const onScroll = () => { prog(); kick(); };
    v.addEventListener("loadedmetadata", onMeta); v.addEventListener("seeked", kick);
    mq.addEventListener("change", load); addEventListener("scroll", onScroll, { passive: true });
    load();
    return () => { cancelAnimationFrame(raf); v.removeEventListener("loadedmetadata", onMeta); v.removeEventListener("seeked", kick); mq.removeEventListener("change", load); removeEventListener("scroll", onScroll); };
  }, []);
  return (
    <div className="mapwrap" aria-hidden="true">
      <video ref={ref} className="mapvid" muted playsInline preload="auto" disablePictureInPicture tabIndex={-1} />
    </div>
  );
}
