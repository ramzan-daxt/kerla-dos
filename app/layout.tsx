import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { Comfortaa, Nunito } from "next/font/google";
import "./globals.css";
import "./lesson.css";
import "./game.css";
import "./premium.css";
import "./categories.css";
import "./locked-words.css";
import "./playful.css";
import "./logo.css";
import "./learning-paths.css";
import "./settings.css";
import "./home-extras.css";
import "./icon-assets.css";
import "./full-story.css";
import "./ui-icons.css";
import "./phone.css";
import "./tablet.css";
import "./home-redesign.css";
import "./games.css";
import "./minimal-cards.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700", "800", "900"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KERLA DOŞ — нохчийн мотт берашна",
  description: "Хаза, дагахь латтаде, ловза.",
  icons: {
    icon: "/kerla-dos-logo.png",
    shortcut: "/kerla-dos-logo.png",
    apple: "/kerla-dos-logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${nunito.variable} ${comfortaa.variable} antialiased`}
        style={{
          "--font-nunito": nunito.style.fontFamily,
          "--font-comfortaa": comfortaa.style.fontFamily,
        } as CSSProperties}
      >
        <div className="phone-portrait-gate" role="status" aria-label="Телефон нисса хӀоттабе">
          <div className="phone-portrait-picture" aria-hidden="true">
            <span />
          </div>
          <strong>Телефон нисса хӀоттабе</strong>
          <small>KERLA DOŞ</small>
        </div>
        {children}
      </body>
    </html>
  );
}
