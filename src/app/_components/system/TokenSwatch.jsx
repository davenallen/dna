"use client";

import { useEffect, useState } from "react";

export function TokenSwatch({ cssVar, fallback }) {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    const read = () => {
      const next = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
      if (next) setValue(next);
    };

    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, [cssVar]);

  return (
    <>
      <span className="ds-token-swatch" style={{ background: `var(${cssVar})` }} />
      <p className="ds-token-value">{value}</p>
    </>
  );
}

export default TokenSwatch;
