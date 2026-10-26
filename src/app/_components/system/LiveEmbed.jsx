"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "./Button";

export function LiveEmbed({ src, title, preview = false, fullscreen = false, pills = [] }) {
  const frameRef = useRef(null);
  const iframeRef = useRef(null);
  const heightRef = useRef(480);
  const [height, setHeight] = useState(480);
  const [expanded, setExpanded] = useState(false);
  const expandedRef = useRef(false);
  expandedRef.current = expanded;

  useEffect(() => {
    if (preview) return undefined;

    const onMessage = (event) => {
      const frame = iframeRef.current;
      if (!frame || event.source !== frame.contentWindow) return;
      if (!event.data || event.data.source !== "dna-embed") return;
      const next = Number(event.data.height);
      if (!Number.isFinite(next) || next < 80) return;
      if (Math.abs(next - heightRef.current) < 2) return;
      heightRef.current = next;
      setHeight(next);
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [preview]);

  useEffect(() => {
    if (!expanded) return undefined;
    const root = document.documentElement;
    const previous = document.body.style.overflow;
    root.classList.add("dna-viewer-full");
    document.body.style.overflow = "hidden";

    const onKey = (event) => {
      if (event.key !== "Escape" || !expandedRef.current) return;
      setExpanded(false);
    };

    window.addEventListener("keydown", onKey);
    return () => {
      root.classList.remove("dna-viewer-full");
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  const toggleFull = () => {
    setExpanded((value) => !value);
  };

  const tree = (
    <div
      ref={frameRef}
      className={`ds-live-embed${preview ? " ds-live-embed--preview" : ""}${expanded ? " is-full" : ""}`}
    >
      {fullscreen && !preview ? (
        <div className="ds-live-embed-bar">
          {pills.length > 0 ? (
            <div className="dna-use-pills">
              {pills.map((pill) => (
                <Link key={pill.id} href={`/projects/${pill.id}`} className="dna-chip">
                  {pill.title}
                </Link>
              ))}
            </div>
          ) : null}
          <Button
            variant="secondary"
            size="sm"
            className="ds-live-embed-full"
            onClick={toggleFull}
            aria-pressed={expanded}
            aria-label={expanded ? "Exit full screen" : "Full screen"}
          >
            <i className={expanded ? "fas fa-compress" : "fas fa-expand"} aria-hidden="true" />
          </Button>
        </div>
      ) : null}
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        scrolling={expanded ? "yes" : "no"}
        style={preview || expanded ? undefined : { height }}
      />
    </div>
  );

  return tree;
}

export default LiveEmbed;
