"use client";

import { SliderProps } from "@common/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";

import Data from '@data/sliders/testimonial';
import { SectionTitle } from "@components/system";

const TestimonialSlider = () => {
  const stars = [ 1, 2, 3, 4, 5 ];

  return (
    <>
      {/* testimonials */}
      <div className="container-fluid">

        {/* row */}
        <div className="row">

          {/* col */}
          <div className="col-lg-12">

            {/* section title */}
            <SectionTitle title={Data.title} />
            {/* section title end */}

          </div>
          {/* col end */}

          {/* col */}
          <div className="col-lg-12">

            {/* slider container */}
            <Swiper
              {...SliderProps.milReviewsSlider}
              className="swiper-container dna-testimonial-slider"
            >
              {Data.items.map((item, key) => (
                <SwiperSlide className="swiper-slide" key={`testimonial-slider-item-${key}`}>

                  {/* testimonial */}
                  <div className="dna-a dna-testimonial">
                    {/* testimonial body */}
                    <div className="testimonial-body">
                      {/* photo */}
                      <img className="dna-testimonial-face" src={item.image} alt={item.name} />
                      {/* name */}
                      <h5>{item.name}</h5>
                      <div className="dna-el-suptitle mb-15">{item.role}</div>
                      {/* text */}
                      <div className="mb-15">{item.text}</div>
                    </div>
                    {/* testimonial body end */}
                    {item.rating ? (
                    <div className="dna-testimonial-footer">
                      <div className="dna-left-side">
                        <ul className="dna-star-rate">
                          {stars.slice(0, item.rating).map((star, star_key) => (
                          <li key={`testimonial-slider-item-${key}-star-${star_key}`}><i className="fas fa-star"></i></li>
                          ))}
                        </ul>
                      </div>
                      <div className="dna-right-side">

                      </div>
                    </div>
                    ) : null}
                  </div>
                  {/* testimonial end */}

                </SwiperSlide>
              ))}
            </Swiper>

          </div>
          {/* col end */}

          {/* col */}
          <div className="col-lg-12">

            {/* slider navigation */}
            <div className="dna-slider-navigation dna-testimonial-slider-navigation">

              {/* left side */}
              <div className="dna-sn-left">

                {/* slider pagination */}
                <div className="swiper-pagination"></div>

              </div>
              {/* left side end */}

              {/* right side */}
              <div className="dna-sn-right">

                {/* slider navigation */}
                <div className="dna-slider-nav-frame">
                  {/* prev */}
                  <div className="dna-slider-nav dna-testi-swiper-prev"><i className="fas fa-chevron-left"></i></div>
                  {/* next */}
                  <div className="dna-slider-nav dna-testi-swiper-next"><i className="fas fa-chevron-right"></i></div>
                </div>
                {/* slider navigation */}

              </div>
              {/* right side end */}

            </div>
            {/* slider navigation end */}

          </div>
          {/* col end */}

        </div>
        {/* row end */}

      </div>
      {/* reviews end */}
    </>
  );
};
export default TestimonialSlider;
