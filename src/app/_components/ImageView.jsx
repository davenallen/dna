"use client";

import { Fragment, useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import useClickOutside from "@common/useClickOutside";

const ImgViews = ({ close, src, isVideo = false, isIframe = false, title = "", href = "" }) => {
  const domNode = useClickOutside(() => close(false));
  const frameRef = useRef(null);
  const fullRef = useRef(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [full, setFull] = useState(false);
  fullRef.current = full;

  const leaveFullScreen = () => {
    fullRef.current = false;
    setFull(false);
  };

  const toggleFull = () => {
    if (fullRef.current) {
      leaveFullScreen();
      return;
    }
    fullRef.current = true;
    setFull(true);
  };

  // Expanded view fills the browser viewport. Escape leaves it first.
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key !== "Escape") return;
      if (fullRef.current) {
        leaveFullScreen();
        return;
      }
      close(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [close]);

  return (
    <Fragment>
      {/* Background Overlay */}
      <div className="mfp-bg mfp-ready" onClick={() => close(false)}></div>

      <div
        className={`mfp-wrap mfp-close-btn-in mfp-auto-cursor mfp-ready${full ? " is-full" : ""}`}
        tabIndex={-1}
        ref={frameRef}
      >
        <div className="mfp-container mfp-s-ready mfp-iframe-holder mfp-img-container">
          <div className="mfp-content" ref={domNode}>
            {(title || href) && (
              <div className="mfp-caption">
                {title ? <span className="mfp-caption-title">{title}</span> : null}
                {href ? (
                  <Link href={href} className="mfp-case" onClick={() => close(false)}>
                    View case study
                  </Link>
                ) : null}
              </div>
            )}

            <button
              type="button"
              className="mfp-fullscreen"
              onClick={toggleFull}
              aria-label={full ? "Exit full screen" : "Full screen"}
              aria-pressed={full}
            >
              <i className={full ? "fas fa-compress" : "fas fa-expand"} aria-hidden="true" />
            </button>

            {isIframe ? (
              <div
                className="mfp-frame"
                style={{
                  position: "relative",
                  background: "#111",
                  margin: "0 auto",
                }}
              >
                {!iframeLoaded && (
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "#aaa",
                    zIndex: 5,
                    fontSize: "1.1rem"
                  }}>
                    Loading preview...
                  </div>
                )}

                <iframe
                  src={src}
                  className="mfp-iframe"
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  onLoad={() => setIframeLoaded(true)}
                  style={{
                    width: "100%",
                    background: "#111",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
                  }}
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
                />
              </div>
            ) : isVideo ? (
              <div className="mfp-video-wrapper">
                <video
                  autoPlay
                  muted
                  playsInline
                >
                  <source src={src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="mfp-iframe-scaler">
                <img className="mfp-img" src={src} alt={title} />
              </div>
            )}
          </div>

          {/* Close Button */}
          <button 
            className="mfp-close" 
            onClick={() => close(false)}
            style={{ zIndex: 10000, fontSize: "36px", color: "#fff" }}
          >
            ×
          </button>
        </div>
      </div>
    </Fragment>
  );
};

const ImageView = () => {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const [isIframe, setIsIframe] = useState(false);
  const [title, setTitle] = useState("");
  const [href, setHref] = useState("");
  const generation = useRef(0);

  const showMedia = (next) => {
    generation.current += 1;
    setSrc(next.src);
    setIsVideo(!!next.isVideo);
    setIsIframe(!!next.isIframe);
    setTitle(next.title || "");
    setHref(next.href || "");
    setOpen(true);
  };

  useEffect(() => {
    const handleCustomOpen = (e) => {
      if (e.detail?.src) showMedia(e.detail);
    };

    const handleLegacyClick = (e) => {
      const link = e.target.closest('a[data-fancybox]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href) return;

      const isVid = /\.(mp4|webm|ogg)$/i.test(href);

      e.preventDefault();
      e.stopPropagation();

      showMedia({ src: href, isVideo: isVid });
    };

    window.addEventListener("openMedia", handleCustomOpen);
    document.addEventListener("click", handleLegacyClick);

    return () => {
      window.removeEventListener("openMedia", handleCustomOpen);
      document.removeEventListener("click", handleLegacyClick);
    };
  }, []);

  const closeModal = useCallback(() => {
    const closed = ++generation.current;
    setOpen(false);
    setTimeout(() => {
      if (generation.current !== closed) return;
      setSrc("");
      setIsVideo(false);
      setIsIframe(false);
      setTitle("");
      setHref("");
    }, 300);
  }, []);

  return <Fragment>{open && <ImgViews close={closeModal} src={src} isVideo={isVideo} isIframe={isIframe} title={title} href={href} />}</Fragment>;
};

export default ImageView;