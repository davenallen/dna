"use client";

import { useEffect, useState } from "react";
import { track } from "@library/visit";

const STORAGE_KEY = "dna-theme";

function BulbIcon() {
  return (
    <svg className="ds-theme-switch-icon" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1.35C5.55 1.35 3.7 3.25 3.7 5.7c0 1.45.7 2.45 1.65 3.15.5.4.75.8.75 1.3h3.8c0-.5.25-.9.75-1.3.95-.7 1.65-1.7 1.65-3.15 0-2.45-1.85-4.35-4.3-4.35z" />
      <path d="M6.25 11.55h3.5M6.6 12.9h2.8M7.05 14.25h1.9" />
    </svg>
  );
}

function paintTheme(next) {
  document.documentElement.setAttribute("data-theme", next);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", next === "light" ? "#f6f7fb" : "#1e1e28");
}

export function ThemeSwitch({ className = "" }) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const read = () => {
      setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    paintTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage can be blocked; the attribute still switches this view */
    }
    setTheme(next);
    track("theme_change", { theme: next });
  }

  const isLight = theme === "light";

  return (
    <button
      type="button"
      className={`ds-theme-switch ${className}`.trim()}
      onClick={toggle}
      aria-pressed={isLight}
      aria-label={isLight ? "Switch to dark" : "Switch to light"}
    >
      <BulbIcon />
    </button>
  );
}

export default ThemeSwitch;
