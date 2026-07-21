"use client";

import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import MobileMenu from "./MobileMenu";
import { nav } from "@/data/content";

const sectionIds = nav.map((n) => n.href.replace("#", ""));

export default function NavigationRoot() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const ticking = useRef(false);

  useEffect(() => {
    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        ticking.current = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.3, rootMargin: "-10% 0px -60% 0px" }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <Header
        scrolled={scrolled}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        activeHref={active ? `#${active}` : ""}
      />
      <MobileMenu open={menuOpen} onNavigate={() => setMenuOpen(false)} />
    </>
  );
}
