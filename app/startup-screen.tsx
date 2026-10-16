"use client";

import { useEffect, useState } from "react";

export default function StartupScreen() {
  const [phase, setPhase] = useState("visible");
  useEffect(() => {
    let cancelled = false;
    let finishing = false;
    let fade: ReturnType<typeof setTimeout>;
    let remove: ReturnType<typeof setTimeout>;
    const started = performance.now();
    const logo = new Image();
    logo.src = "/kerla-wolf-logo.png";
    const ready = Promise.all([
      logo.decode().catch(() => {}),
      document.fonts.ready,
    ]);
    const finish = () => {
      if (cancelled || finishing) return;
      finishing = true;
      fade = setTimeout(() => {
        setPhase("leaving");
        remove = setTimeout(() => setPhase("gone"), 300);
      }, Math.max(0, 1100 - (performance.now() - started)));
    };
    // Never trap the user behind a loading screen if a font/image fails.
    const timeout = setTimeout(finish, 4000);
    void ready.then(() => { clearTimeout(timeout); finish(); });
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      clearTimeout(fade);
      clearTimeout(remove);
    };
  }, []);
  if (phase === "gone") return null;
  return <div className={`startup-screen startup-${phase}`} role="status" aria-label="KERLA DOŞ">
    <div className="startup-content">
      <img className="startup-wolf" src="/kerla-wolf-logo.png" alt="" width="180" height="180" fetchPriority="high" />
      <div className="startup-title">KERLA <span>DOŞ</span></div>
      <div className="startup-dots" aria-hidden="true"><i /><i /><i /></div>
    </div>
  </div>;
}
