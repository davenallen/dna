"use client";

import Data from "@data/sections/hero.json";
import { Button } from "@components/system";

const resolveImg = (url) => {
    if (!url) return "";
    return url.startsWith("/") ? url : `/${url}`;
};

const HeroOne = ({ variant = "portrait" }) => {
    const isCopy = variant === "copy";
    const photoSrc = resolveImg(Data.photo.url);
    const hoverSrc = resolveImg(Data.photo.hoverUrl);
    const hasHoverSwap = Boolean(hoverSrc);

    return (
        <div className="container-fluid">
            <div className="row dna-banner-row">
                <div className="col-lg-12">
                    <div
                        className={`dna-a dna-banner dna-banner-hire${isCopy ? " dna-banner-hire--copy" : ""}`}
                        style={!isCopy && Data.bg_image ? { backgroundImage: "url(" + Data.bg_image + ")" } : undefined}
                    >
                        <div className="dna-banner-back"></div>
                        <div className="dna-banner-dec"></div>
                        <div className="dna-banner-overlay dna-banner-overlay-grid">
                            <div className="dna-banner-title">
                                {Data.status && (
                                    <span className="dna-status-pill">{Data.status}</span>
                                )}
                                {isCopy && Data.title.endsWith(" one person.") ? (
                                    <h1 className="mb-15">
                                        {Data.title.slice(0, -" one person.".length)}{" "}
                                        <span className="dna-hero-headline-tail">one person.</span>
                                    </h1>
                                ) : (
                                    <h1 className="mb-15" dangerouslySetInnerHTML={{ __html: Data.title }} />
                                )}
                                {Data.roleLine && (
                                    <p className="dna-role-line mb-15">{Data.roleLine}</p>
                                )}
                                <p
                                    className="dna-hero-desc mb-25"
                                    dangerouslySetInnerHTML={{ __html: Data.description }}
                                />
                                <div className="dna-buttons-frame">
                                    <Button href={Data.button.link}>{Data.button.label}</Button>
                                    {Data.buttonSecondary && (
                                        <Button
                                            href={Data.buttonSecondary.link}
                                            external={Boolean(Data.buttonSecondary.external)}
                                            variant="secondary"
                                        >
                                            {Data.buttonSecondary.label}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {!isCopy && <div className="dna-banner-photo-wrap">
                                <div className={`dna-hero-portrait ${hasHoverSwap ? "dna-hero-portrait--swap" : ""}`}>
                                    <span className="dna-hero-portrait-glow" aria-hidden="true" />
                                    <span className="dna-hero-portrait-ring dna-hero-portrait-ring--outer" aria-hidden="true" />
                                    <span className="dna-hero-portrait-ring dna-hero-portrait-ring--inner" aria-hidden="true" />
                                    <span className="dna-hero-portrait-dot" aria-hidden="true" />
                                    <div className="dna-hero-portrait-frame">
                                        <div className="dna-hero-portrait-stack">
                                            {/* Base: AI image (always shown) */}
                                            <img
                                                src={photoSrc}
                                                className="dna-banner-photo dna-banner-photo--default"
                                                alt={Data.photo.alt}
                                            />
                                            {/* Overlay: original photo (fades in on hover) */}
                                            {hasHoverSwap && (
                                                <img
                                                    src={hoverSrc}
                                                    className="dna-banner-photo dna-banner-photo--hover"
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroOne;
