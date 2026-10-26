"use client";

import Data from "@data/sliders/latest-posts.json";
import Date from '@library/date';
import Link from "next/link";
import { SectionTitle, TextLink } from "@components/system";

import { SliderProps } from "@common/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";

const LatestPostsSlider = ( { posts } ) => {
    return (
        <>
            {/* container */}
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

                {/* slider */}
                <Swiper
                    {...SliderProps.milBlogSlider}
                    className="swiper-container dna-blog-slider"
                    style={{"overflow": "visible"}}
                >   
                    {posts.slice(0, Data.numOfItems).map((item, key) => (
                    <SwiperSlide className="swiper-slide" key={`latest-posts-slider-item-${key}`}>
                    
                        {/* blog post card */}
                        <div className="dna-a dna-blog-card">
                        {/* post cover */}
                        <Link href={`/blog/${item.id}`} className="dna-port-cover">
                            {/* img */}
                            <img src={item.image} alt={item.title} />
                        </Link>
                        {/* post cover end */}
                        {/* post description */}
                        <div className="dna-post-description">
                            {/* date */}
                            <div className="dna-date"><Date dateString={item.date} /> / {item.categories[0]}</div>
                            {/* title */}
                            <Link href={`/blog/${item.id}`}>
                                <h5 className="mb-15">{item.title}</h5>
                            </Link>
                            {/* text */}
                            <div className="mb-15">{item.short}</div>
                            {/* link */}
                            <TextLink href={`/blog/${item.id}`}>Read more</TextLink>
                        </div>
                        {/* post description end */}
                        </div>
                        {/* blog post card end */}

                    </SwiperSlide>
                    ))}
                </Swiper>
                {/* slider end */}

                </div>
                {/* col end */}

                {/* col */}
                <div className="col-lg-12">

                {/* slider navigation */}
                <div className="dna-slider-navigation dna-blog-slider-navigation">

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
                        <div className="dna-slider-nav dna-blog-swiper-prev"><i className="fas fa-chevron-left"></i></div>
                        {/* next */}
                        <div className="dna-slider-nav dna-blog-swiper-next"><i className="fas fa-chevron-right"></i></div>
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
            {/* container end */}
        </>
    );
};

export default LatestPostsSlider;
