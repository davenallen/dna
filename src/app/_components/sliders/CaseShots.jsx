"use client";

import { useRef, useState } from "react";
import { A11y, Keyboard } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

const CaseShots = ({ items = [] }) => {
  const swiperRef = useRef(null);
  const [index, setIndex] = useState(0);
  const reduceMotion = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!items.length) return null;

  const go = (nextIndex) => {
    swiperRef.current?.slideTo(nextIndex);
  };

  return (
    <div
      className="dna-case-shots"
      role="region"
      aria-roledescription="carousel"
      aria-label="Offer page screenshots"
    >
      <div className="dna-case-shot-bar dna-slider-navigation">
        <div className="dna-case-shot-dots" role="tablist" aria-label="Screenshots">
          {items.map((item, dotIndex) => (
            <button
              type="button"
              key={`case-shot-dot-${dotIndex}`}
              className={dotIndex === index ? "is-current" : undefined}
              aria-label={item.caption}
              aria-current={dotIndex === index ? "true" : undefined}
              onClick={() => go(dotIndex)}
            />
          ))}
        </div>
        <p className="dna-case-shot-caption">{items[index]?.caption}</p>
        <div className="dna-sn-right">
          <div className="dna-slider-nav-frame">
            <button
              type="button"
              className="dna-slider-nav"
              aria-label="Previous screenshot"
              disabled={index === 0}
              onClick={() => go((swiperRef.current?.activeIndex ?? index) - 1)}
            >
              <i className="fas fa-chevron-left" aria-hidden="true"></i>
            </button>
            <button
              type="button"
              className="dna-slider-nav"
              aria-label="Next screenshot"
              disabled={index === items.length - 1}
              onClick={() => go((swiperRef.current?.activeIndex ?? index) + 1)}
            >
              <i className="fas fa-chevron-right" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      <Swiper
        modules={[Keyboard, A11y]}
        slidesPerView={1}
        spaceBetween={0}
        speed={reduceMotion ? 0 : 450}
        keyboard={{ enabled: true, onlyInViewport: true }}
        a11y={{
          prevSlideMessage: "Previous screenshot",
          nextSlideMessage: "Next screenshot",
        }}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        onSlideChange={(swiper) => setIndex(swiper.activeIndex)}
      >
        {items.map((item, key) => (
          <SwiperSlide key={`case-shot-${key}`}>
            <div
              className={`dna-case-shot${item.fit === "phone" ? " is-phone" : ""}`}
              tabIndex={0}
            >
              <img src={item.image} alt={item.alt || item.caption || ""} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CaseShots;
