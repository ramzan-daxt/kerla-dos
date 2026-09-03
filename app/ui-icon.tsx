import type { SVGProps } from "react";

export type AppIconName =
    | "arrow-left" | "arrow-right" | "book" | "check" | "close" | "dice"
    | "heart" | "heart-filled" | "lock" | "mute" | "pause" | "play"
    | "puzzle" | "refresh" | "settings" | "sound" | "sparkle" | "star" | "target" | "turtle" | "unlock";

type IconProps = SVGProps<SVGSVGElement> & { name: AppIconName };

export default function AppIcon({ name, className = "", ...props }: IconProps) {
    const common = {
        className: `app-icon app-icon-${name} ${className}`.trim(),
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        "aria-hidden": true,
        focusable: false,
        ...props,
    } as const;
    switch (name) {
        case "sound": return <svg {...common}><path className="icon-soft" d="M4 9.1h3.1L11.5 5v14l-4.4-4.1H4z"/><path d="M15 8.2c1.05 1.05 1.55 2.3 1.55 3.8S16.05 14.75 15 15.8M17.9 5.7A8.8 8.8 0 0 1 20.2 12a8.8 8.8 0 0 1-2.3 6.3"/></svg>;
        case "mute": return <svg {...common}><path className="icon-soft" d="M4 9.1h3.1L11.5 5v14l-4.4-4.1H4z"/><path d="m15.3 9.2 4.5 5.6m0-5.6-4.5 5.6"/></svg>;
        case "settings": return <svg {...common}><path className="icon-soft" d="M9.5 3.7h5l.65 2.1 1.9 1.1 2.15-.45 2.5 4.3-1.5 1.55v2.2l1.5 1.55-2.5 4.3-2.15-.45-1.9 1.1-.65 2.1h-5l-.65-2.1-1.9-1.1-2.15.45-2.5-4.3 1.5-1.55v-2.2l-1.5-1.55 2.5-4.3 2.15.45 1.9-1.1z"/><circle cx="12" cy="13.4" r="3.1"/></svg>;
        case "star": return <svg {...common}><path className="icon-gold" d="m12 2.8 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>;
        case "book": return <svg {...common}><path className="icon-soft" d="M3.4 5.2c3.7-.9 6.6.25 8.6 2.15v12.2c-2-1.9-4.9-3.05-8.6-2.15zM20.6 5.2c-3.7-.9-6.6.25-8.6 2.15v12.2c2-1.9 4.9-3.05 8.6-2.15z"/><path d="M12 7.35v12.2"/></svg>;
        case "target": return <svg {...common}><circle className="icon-soft" cx="11" cy="13" r="7.2"/><circle cx="11" cy="13" r="3.1"/><path d="m13.2 10.8 7-7m-4.1.2h4.1v4.1"/></svg>;
        case "heart": return <svg {...common}><path className="icon-pink-soft" d="M12 20.4 4.35 13A5 5 0 0 1 11.4 5.9l.6.65.6-.65A5 5 0 0 1 19.65 13z"/></svg>;
        case "heart-filled": return <svg {...common}><path className="icon-pink" d="M12 20.4 4.35 13A5 5 0 0 1 11.4 5.9l.6.65.6-.65A5 5 0 0 1 19.65 13z"/></svg>;
        case "lock": return <svg {...common}><rect className="icon-soft" x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10m-4 4v3"/></svg>;
        case "unlock": return <svg {...common}><rect className="icon-soft" x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7.5a4 4 0 0 1 7.5-2M12 14v3"/></svg>;
        case "sparkle": return <svg {...common}><path className="icon-gold" d="M12 2.8c.8 4.3 2.9 6.4 7.2 7.2-4.3.8-6.4 2.9-7.2 7.2-.8-4.3-2.9-6.4-7.2-7.2 4.3-.8 6.4-2.9 7.2-7.2Z"/><path d="M19 16.4c.3 1.6 1.1 2.4 2.7 2.7-1.6.3-2.4 1.1-2.7 2.7-.3-1.6-1.1-2.4-2.7-2.7 1.6-.3 2.4-1.1 2.7-2.7Z"/></svg>;
        case "play": return <svg {...common}><circle className="icon-soft" cx="12" cy="12" r="9"/><path className="icon-solid" d="m10 8.4 5.5 3.6-5.5 3.6z"/></svg>;
        case "pause": return <svg {...common}><circle className="icon-soft" cx="12" cy="12" r="9"/><path d="M9.4 8.5v7m5.2-7v7"/></svg>;
        case "arrow-left": return <svg {...common}><path d="M19 12H5m5.5-5.5L5 12l5.5 5.5"/></svg>;
        case "arrow-right": return <svg {...common}><path d="M5 12h14m-5.5-5.5L19 12l-5.5 5.5"/></svg>;
        case "refresh": return <svg {...common}><path d="M19.3 8A8 8 0 1 0 20 14m-.7-6V3.8M19.3 8H15"/></svg>;
        case "dice": return <svg {...common}><rect className="icon-soft" x="3.5" y="3.5" width="17" height="17" rx="4"/><circle className="icon-dot" cx="8" cy="8" r="1.2"/><circle className="icon-dot" cx="16" cy="8" r="1.2"/><circle className="icon-dot" cx="12" cy="12" r="1.2"/><circle className="icon-dot" cx="8" cy="16" r="1.2"/><circle className="icon-dot" cx="16" cy="16" r="1.2"/></svg>;
        case "puzzle": return <svg {...common}><path className="icon-soft" d="M4 4h6.2a2.7 2.7 0 1 0 5.4 0H20v6.1a2.7 2.7 0 1 1 0 5.4V20h-6.1a2.7 2.7 0 1 0-5.4 0H4v-6.1a2.7 2.7 0 1 1 0-5.4z"/></svg>;
        case "check": return <svg {...common}><circle className="icon-soft" cx="12" cy="12" r="9"/><path d="m7.8 12.2 2.7 2.8 5.8-6"/></svg>;
        case "close": return <svg {...common}><path d="m6.5 6.5 11 11m0-11-11 11"/></svg>;
        case "turtle": return <svg {...common}><path className="icon-soft" d="M6 14.5a6 6 0 0 1 12 0z"/><circle cx="19.5" cy="14" r="1.8"/><path d="M7 15.5 5.5 18M16.5 15.5 18 18M9 9.8l3 4.7 3-4.7"/></svg>;
    }
}
