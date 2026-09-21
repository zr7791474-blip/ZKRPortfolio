import type { Metadata, Viewport } from "next";
import "./globals.css";
import Loader from "@/components/layout/Loader";
import ScrollProgress from "@/components/ui/ScrollProgress";
import NavigationRoot from "@/components/navigation/NavigationRoot";
import Footer from "@/components/layout/Footer";
import FloatingDock from "@/components/contact/FloatingDock";
import ZkrAssistant from "@/components/assistant/ZkrAssistant";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import MotionProvider from "@/components/ui/MotionProvider";

const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("zkr-theme");var t=(s==="light"||s==="dark")?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t);var m=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<m.length;i++){m[i].setAttribute("content",t==="dark"?"#0C273C":"#F4FAE0");m[i].removeAttribute("media")}}catch(e){}})();`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Browser UI colour follows the OS scheme; ThemeToggle overrides it after a manual choice.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4FAE0" },
    { media: "(prefers-color-scheme: dark)", color: "#0C273C" },
  ],
  // Android Chrome: resize the layout viewport when the on-screen keyboard opens,
  // so the bottom-anchored Agent composer is never hidden behind it.
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  title: "ZKR — Zakaria Adli · Full-Stack Developer",
  description:
    "Zakaria Adli (ZKR) — full-stack developer building production-ready digital products: SaaS dashboards, commerce systems, real estate platforms, and business websites.",
  metadataBase: new URL("https://zkr-portfolio.vercel.app"),
  icons: {
    icon: "/logo/zkr.jpg",
    shortcut: "/logo/zkr.jpg",
    apple: "/logo/zkr.jpg",
  },
  openGraph: {
    title: "ZKR — Zakaria Adli · Full-Stack Developer",
    description:
      "Full-stack developer building production-ready digital products — SaaS platforms, commerce systems, and business websites.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        {/* Runs before first paint (no theme flash): saved choice → OS preference → light. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- this rule predates the App
        Router; the root layout (not _document) is the documented place to load global fonts here. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>
          <MotionProvider>
            <Loader />
            <ScrollProgress />
            <NavigationRoot />
            {children}
            <Footer />
            <FloatingDock />
            <ZkrAssistant />
          </MotionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
