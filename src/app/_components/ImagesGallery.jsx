"use client";

import Isotope from "isotope-layout";
import { useEffect, useRef, useState } from "react";
import { SectionTitle } from "@components/system";

const ImagesGallery = ({ items, title, href = "" }) => {
  const isotope = useRef();
  const [filterKey, setFilterKey] = useState("*");

  useEffect(() => {
    isotope.current = new Isotope(".dna-grid", {
      itemSelector: ".dna-grid-item",
      percentPosition: true,
      masonry: { columnWidth: ".dna-grid-item" },
      transitionDuration: "0.5s",
    });
  }, []);

  useEffect(() => {
    if (isotope.current) {
      filterKey === "*"
        ? isotope.current.arrange({ filter: `*` })
        : isotope.current.arrange({ filter: `.${filterKey}` });
    }
  }, [filterKey]);

  // Helper to identify iframe items
  const isIframe = (item) => !!item.iframe;

  const openMedia = (item) => {
    if (isIframe(item)) {
    window.dispatchEvent(
      new CustomEvent("openMedia", {
        detail: {
          src: item.iframe,           // e.g. "/iframes/dna/index.html"
          isIframe: true,
          title: item.alt || "Preview",
          href,
        },
      })
    );
  } else {
      window.dispatchEvent(
        new CustomEvent("openMedia", {
          detail: {
            src: item.video || item.image,
            isVideo: !!item.video,
            title: item.alt || "Preview",
            href,
          },
        })
      );
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <SectionTitle title={title} />
          </div>

          <div className="dna-grid dna-grid-2-col dna-gallery">
            {items.map((item, key) => {
              const isVideo = !!item.video;
              const isFrame = isIframe(item);
              const thumbnail = item.poster || item.image;

              return (
                <div className="dna-grid-item" key={`project-gallery-item-${key}`}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      openMedia(item);
                    }}
                    className={`dna-a dna-portfolio-item-frame dna-${item.masonrySize}`}
                  >
                    <img src={thumbnail} alt={item.alt || ""} />

                    {isVideo && (
                      <span className="dna-item-hover dna-video-overlay">
                        <i className="fas fa-play-circle"></i>
                      </span>
                    )}

                    {isFrame && (
                      <span className="dna-item-hover dna-iframe-overlay">
                        <i className="fas fa-external-link-alt"></i>
                      </span>
                    )}

                    {!isVideo && !isFrame && (
                      <span className="dna-item-hover">
                        <i className="fas fa-expand"></i>
                      </span>
                    )}
                  </a>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </>
  );
};

export default ImagesGallery;