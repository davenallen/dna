"use client";

import { useEffect, useRef, useState } from "react";
import AppData from "@data/app.json";

const RESUME = AppData.profile.resume;

function linkBox(viewport, rect) {
  const [x1, y1, x2, y2] = viewport.convertToViewportRectangle(rect);
  return {
    left: Math.min(x1, x2),
    top: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
  };
}

export default function ResumeViewer() {
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const [links, setLinks] = useState([]);
  const [failed, setFailed] = useState(false);
  const closeRef = useRef(null);
  const frameRef = useRef(null);
  const sheetRef = useRef(null);
  const pageRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const fullRef = useRef(false);
  fullRef.current = full;

  const leaveFullScreen = () => {
    fullRef.current = false;
    setFull(false);
  };

  const close = () => {
    leaveFullScreen();
    setOpen(false);
  };

  const toggleFull = () => {
    if (fullRef.current) {
      leaveFullScreen();
      return;
    }
    fullRef.current = true;
    setFull(true);
  };

  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest("a");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (!href.includes("dna-resume")) return;
      if (link.hasAttribute("data-resume-download")) return;
      event.preventDefault();
      setFull(false);
      setOpen(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (!open) {
      setLinks([]);
      setFailed(false);
      return undefined;
    }
    const sheet = sheetRef.current;
    const canvas = canvasRef.current;
    const textHost = textRef.current;
    const pageEl = pageRef.current;
    if (!sheet || !canvas || !textHost || !pageEl || failed) return undefined;

    let cancelled = false;
    let renderTask = null;
    let loadingTask = null;
    let observer = null;
    let lastWidth = 0;
    let generation = 0;

    const paintPage = async (pdfjs, page, annotations) => {
      const width = Math.floor(sheet.clientWidth);
      if (!width || width === lastWidth) return;
      const previousWidth = lastWidth;
      const gen = ++generation;
      lastWidth = width;
      const unscaled = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: width / unscaled.width });
      const ratio = window.devicePixelRatio || 1;
      pageEl.style.width = `${viewport.width}px`;
      pageEl.style.height = `${viewport.height}px`;
      canvas.width = Math.floor(viewport.width * ratio);
      canvas.height = Math.floor(viewport.height * ratio);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      try {
        renderTask?.cancel();
      } catch {
        /* already finished */
      }
      renderTask = page.render({
        canvasContext: canvas.getContext("2d"),
        viewport,
        transform: [ratio, 0, 0, ratio, 0, 0],
      });
      try {
        await renderTask.promise;
      } catch (error) {
        if (gen === generation) lastWidth = previousWidth;
        if (error?.name === "RenderingCancelledException") return;
        throw error;
      }
      if (cancelled || gen !== generation) return;
      setLinks(
        annotations
          .filter((item) => item.subtype === "Link" && item.url)
          .map((item) => {
            const blank = /linkedin\.com/i.test(item.url);
            return {
              ...linkBox(viewport, item.rect),
              url: item.url,
              blank,
              label: blank ? "LinkedIn, opens in a new tab" : item.url,
            };
          })
      );
      textHost.replaceChildren();
      textHost.style.setProperty("--scale-factor", String(viewport.scale));
      const textLayer = new pdfjs.TextLayer({
        textContentSource: page.streamTextContent(),
        container: textHost,
        viewport,
      });
      await textLayer.render();
    };

    const run = async () => {
      const pdfjs = await import("pdfjs-dist");
      if (cancelled) return;
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      loadingTask = pdfjs.getDocument(RESUME);
      const pdf = await loadingTask.promise;
      if (cancelled) return;
      const page = await pdf.getPage(1);
      const annotations = await page.getAnnotations();
      await paintPage(pdfjs, page, annotations);
      observer = new ResizeObserver(() => {
        paintPage(pdfjs, page, annotations).catch((error) => {
          if (!cancelled && error?.name !== "RenderingCancelledException") setFailed(true);
        });
      });
      observer.observe(sheet);
    };

    run().catch(() => {
      if (!cancelled) setFailed(true);
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
      try {
        renderTask?.cancel();
      } catch {
        /* already finished */
      }
      loadingTask?.destroy?.();
    };
  }, [open, failed]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      if (fullRef.current) {
        leaveFullScreen();
        return;
      }
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`dna-resume-overlay${full ? " is-full" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Resume"
      ref={frameRef}
    >
      <button
        type="button"
        className="dna-resume-overlay-backdrop"
        aria-label="Close resume"
        onClick={close}
      />
      <div className="dna-resume-overlay-panel">
        <div className="dna-resume-overlay-bar">
          <p>Resume</p>
          <div className="dna-resume-overlay-actions">
            <a href={RESUME} download data-resume-download="true">
              Download
            </a>
            <button
              type="button"
              onClick={toggleFull}
              aria-label={full ? "Exit full screen" : "Full screen"}
              aria-pressed={full}
            >
              <i className={full ? "fas fa-compress" : "fas fa-expand"} aria-hidden="true" />
            </button>
            <button
              type="button"
              ref={closeRef}
              onClick={close}
              aria-label="Close"
            >
              <i className="fas fa-times" aria-hidden="true" />
            </button>
          </div>
        </div>
        {failed ? (
          <iframe title="David N Allen resume" src={`${RESUME}#toolbar=0&navpanes=0&view=FitH`} />
        ) : (
          <div className="dna-resume-sheet" ref={sheetRef}>
            <div className="dna-resume-page" ref={pageRef}>
              <canvas ref={canvasRef} />
              <div className="textLayer" ref={textRef} />
              {links.map((link) => (
                <a
                  key={`${link.url}-${link.left}-${link.top}`}
                  className="dna-resume-hotspot"
                  href={link.url}
                  target={link.blank ? "_blank" : undefined}
                  rel={link.blank ? "noopener noreferrer" : undefined}
                  aria-label={link.label}
                  style={{
                    left: link.left,
                    top: link.top,
                    width: link.width,
                    height: link.height,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
