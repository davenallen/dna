'use client';

import Data from "@data/sections/history.json";
import Brands from "@data/sections/partners.json";
import Popup from 'reactjs-popup';
import { SectionTitle, TextLink } from "@components/system";

const HistorySection = ( { paddingTop = 0 } ) => {
    return (
        <>
            {/* container */}
            <div className="container-fluid">

            {/* row */}
            <div className={paddingTop ? "row p-30-0" : "row"}>

                {/* col */}
                <div className="col-lg-6">

                    {/* section title */}
                    <SectionTitle title={Data.col1.title} />
                    {/* section title end */}

                    {/* timeline */}
                    <div className="dna-timeline dna-gallery" id="history">
                        {Data.col1.items.map((item, key) => (
                        <div className="dna-timeline-item" key={`education-item-${key}`}>
                            <div className="dna-timeline-mark-light"></div>
                            <div className="dna-timeline-mark"></div>

                            <div className="dna-a dna-timeline-content">
                                <div className="dna-card-header">
                                    <div className="dna-left-side">
                                        <h5>{item.title}</h5>
                                        <div className="dna-el-suptitle mb-15">{item.subtitle}</div>
                                    </div>
                                    <div className="dna-right-side">
                                        <span className="dna-date">{item.date}</span>
                                    </div>
                                </div>
                                <p>{item.text}</p>
                                {item.button &&
                                <TextLink native data-fancybox="diplome" data-no-swup href={item.button.link}>{item.button.label}</TextLink>
                                }
                            </div>
                        </div>
                        ))}
                    </div>
                    {/* timeline end */}

                </div>
                <div className="col-lg-6">

                    {/* section title */}
                    <SectionTitle title={Data.col2.title} />
                    {/* section title end */}

                    {/* timeline */}
                    <div className="dna-timeline">
                        {Data.col2.items.map((item, key) => (
                        <div className="dna-timeline-item" key={`works-item-${key}`}>
                            <div className="dna-timeline-mark-light"></div>
                            <div className="dna-timeline-mark"></div>


                            <div className="dna-a dna-timeline-content">
                                <div className="dna-card-header">
                                    <div className="dna-left-side">
                                        <h5>{item.title}</h5>
                                        <div className="dna-el-suptitle mb-15">{item.subtitle}</div>
                                    </div>
                                    <div className="dna-right-side">
                                        <span className="dna-date">{item.date}</span>
                                    </div>
                                </div>
                                <p>{item.text}</p>
                                {(() => {
                                    if ( item.button ) {
                                        switch ( item.button.type ) {
                                            case "modal" : return (
                                                <Popup trigger={<TextLink>{item.button.label}</TextLink>} position="bottom center">
                                                    {/* testimonial */}
                                                    <div className="dna-a dna-testimonial">
                                                        {/* testimonial body */}
                                                        <div className="testimonial-body">
                                                            {/* photo */}
                                                            <img className="dna-testimonial-face" src="/img/testimonials/face-3.jpg" alt="face" />
                                                            {/* name */}
                                                            <h5>Paul Trueman</h5>
                                                            <div className="dna-el-suptitle mb-15">Template author</div>
                                                            {/* text */}
                                                            <div className="mb-15">Working with Artur has been a pleasure. Better yet - I alerted them of a minor issue before going to sleep. The issue was fixed the next morning. I could not ask for better support. Thank you Artur!
                                                            This is easily a 5 star freelancer.</div>
                                                        </div>
                                                        {/* testimonial body end */}
                                                        {/* testimonial footer */}
                                                        <div className="dna-testimonial-footer">
                                                            <div className="dna-left-side">
                                                            {/* star rate */}
                                                            <ul className="dna-star-rate">
                                                                <li><i className="fas fa-star"></i></li>
                                                                <li><i className="fas fa-star"></i></li>
                                                                <li><i className="fas fa-star"></i></li>
                                                                <li><i className="fas fa-star"></i></li>
                                                                <li><i className="fas fa-star"></i></li>
                                                            </ul>
                                                            {/* star rate end */}
                                                            </div>
                                                            <div className="dna-right-side">

                                                            </div>
                                                        </div>
                                                        {/* testimonial footer end */}
                                                    </div>
                                                    {/* testimonial end */}
                                                </Popup>
                                            );
                                            case "link" : return (
                                                <TextLink native href={item.button.link} target="_blank" rel="noopener noreferrer">{item.button.label}</TextLink>
                                            );
                                        }
                                    }
                                })()}
                            </div>

                        </div>
                        ))}
                    </div>
                    {/* timeline end */}

                </div>
                {/* col end */}

            </div>
            {/* row end */}

            <div className="row">
                {Brands.items.map((item, key) => (
                <div className="col-6 col-lg-3" key={`brand-item-${key}`}>
                    <img className="dna-brand" src={item.image} alt={item.alt} title={item.title} />
                </div>
                ))}
            </div>

            </div>
            {/* container end */}
        </>
    );
};
export default HistorySection;