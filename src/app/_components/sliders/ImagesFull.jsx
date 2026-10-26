"use client";

import { SliderProps } from "@common/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";

const ImagesFullSlider = ({ items, href = "" }) => {

  const openMedia = (item) => {
    window.dispatchEvent(
      new CustomEvent("openMedia", {
        detail: {
          src: item.video || item.image,
          isVideo: !!item.video,
          title: item.alt || item.name || "",
          href,
        },
      })
    );
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <Swiper
              {...SliderProps.milImagesFullSlider}
              className="swiper-container dna-works-slider"
              style={{ overflow: "visible" }}
            >
              {items.map((item, key) => {
                const isVideo = !!item.video;
                const thumbnail = item.poster || item.image;

                return (
                  <SwiperSlide className="swiper-slide" key={`project-slider-item-${key}`}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();        // Extra safety
                        openMedia(item);
                      }}
                      className="dna-a dna-portfolio-item-frame dna-horizontal"
                    >
                      <img 
                        src={thumbnail} 
                        alt={item.name || item.alt || ""} 
                      />

                      {isVideo ? (
                        <span className="dna-item-hover dna-video-overlay">
                          <i className="fas fa-play-circle"></i>
                        </span>
                      ) : (
                        <span className="dna-item-hover">
                          <i className="fas fa-expand"></i>
                        </span>
                      )}
                    </a>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          {/* Slider Navigation */}
          <div className="col-lg-12">
            <div className="dna-project-slider-navigation dna-slider-navigation">
              <div className="dna-sn-left">
                <div className="swiper-pagination"></div>
              </div>

              <div className="dna-sn-right">
                <div className="dna-slider-nav-frame">
                  <div className="dna-slider-nav dna-works-swiper-prev">
                    <i className="fas fa-chevron-left"></i>
                  </div>
                  <div className="dna-slider-nav dna-works-swiper-next">
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default ImagesFullSlider;