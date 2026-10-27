"use client";

import { useEffect, useState } from "react";
import { track } from "@library/visit";

const STORAGE_KEY = "dna-theme";
const BULB_ON = "\u{1F4A1}\u{FE0F}";
const BULB_OFF = "\u{1F4A1}\u{FE0E}";

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
      <span className={`ds-theme-switch-icon${isLight ? " is-on" : " is-off"}`} aria-hidden="true">
        {isLight ? BULB_ON : BULB_OFF}
      </span>
    </button>
  );
}

export default ThemeSwitch;
