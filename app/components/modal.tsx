"use client";
import { useEffect, useRef, type ReactNode } from "react";

const focusable = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex="0"]';

export default function Modal({ className, label, onClose, children }: {
  className: string; label: string; onClose: () => void; children: ReactNode;
}) {
  const container = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);

  useEffect(() => {
    const shell = container.current;
    if (!shell) return;
    const previous = document.activeElement as HTMLElement | null;
    const controls = () => Array.from(shell.querySelectorAll<HTMLElement>(focusable));
    (controls()[0] || shell).focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); close.current(); }
      if (event.key !== "Tab" || !shell) return;
      const elements = controls();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first) { event.preventDefault(); shell.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === shell)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
    function onClick(event: MouseEvent) {
      if (event.target === shell) close.current();
    }
    shell.addEventListener("keydown", onKey);
    shell.addEventListener("click", onClick);
    return () => {
      shell.removeEventListener("keydown", onKey);
      shell.removeEventListener("click", onClick);
      if (previous?.isConnected) previous.focus();
    };
  }, []);

  return <div ref={container} className={className} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}>{children}</div>;
}
