"use client";

import { Button, InfoRow } from "@components/system";
import AppData from "@data/app.json";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const DRAWER_EVENT = "dna-drawer-open";
const DRAWER_TOGGLE = "dna-drawer-toggle";
const DRAWER_STATE = "dna-drawer-state";
const DRAWER_CLOSE = "dna-drawer-close";

const setContentActive = (active) => {
    document.querySelector(".dna-content")?.classList.toggle("dna-active", active);
};

const InfoBarModule = () => {
    const [toggle, setToggle] = useState(false);
    const toggleRef = useRef(false);
    const commitRef = useRef(() => {});

    const commitInfo = (next, touchContent) => {
        const prev = toggleRef.current;
        toggleRef.current = next;
        setToggle(next);
        if (touchContent) setContentActive(next);
        if (prev !== next) {
            window.dispatchEvent(new CustomEvent(DRAWER_STATE, { detail: { which: "info", open: next } }));
        }
        if (next) {
            window.dispatchEvent(new CustomEvent(DRAWER_EVENT, { detail: "info" }));
        }
    };
    commitRef.current = commitInfo;

    const barOpen = () => commitInfo(!toggleRef.current, true);

    useEffect(() => {
        const onOtherDrawer = (event) => {
            if (event.detail === "info") return;
            commitRef.current(false, false);
        };
        const onToggle = (event) => {
            if (event.detail !== "info") return;
            commitRef.current(!toggleRef.current, true);
        };
        const onClose = () => commitRef.current(false, true);
        window.addEventListener(DRAWER_EVENT, onOtherDrawer);
        window.addEventListener(DRAWER_TOGGLE, onToggle);
        window.addEventListener(DRAWER_CLOSE, onClose);
        return () => {
            window.removeEventListener(DRAWER_EVENT, onOtherDrawer);
            window.removeEventListener(DRAWER_TOGGLE, onToggle);
            window.removeEventListener(DRAWER_CLOSE, onClose);
        };
    }, []);

    useEffect(() => {
        if (!toggle) return undefined;
        const curtain = document.querySelector(".dna-curtain");
        const close = () => commitRef.current(false, true);
        curtain?.addEventListener("click", close);
        return () => curtain?.removeEventListener("click", close);
    }, [toggle]);

    const chips = AppData.profile.skills.chips || [];
    const knowledge = AppData.profile.skills.knowledge || [];
    // Keep sidebar facts short — resume lives in sticky CTAs
    const sidebarInfo = (AppData.profile.info || []).filter(
        (item) => item.label !== "Resume"
    );

    return (
        <>
            <div className={`dna-info-bar ${toggle ? "dna-active" : ""}`}>
                <div className="dna-info-bar-frame">
                    <div className="dna-info-bar-header">
                        <div
                            className={`dna-info-bar-btn ${toggle ? "dna-active" : ""}`}
                            onClick={() => barOpen()}
                            role="button"
                            aria-label={toggle ? "Close profile" : "Open profile"}
                        >
                            <span></span>
                        </div>
                    </div>

                    <div className="dna-header">
                        <div className="dna-avatar">
                            <a
                                data-fancybox="avatar"
                                data-no-swup
                                href={AppData.profile.avatar}
                                className="dna-avatar-curtain"
                            >
                                <img src={AppData.profile.avatar} alt={AppData.profile.name} />
                                <i className="fas fa-expand"></i>
                            </a>
                            <div className="dna-lamp-light">
                                <div className="dna-available-lamp"></div>
                            </div>
                        </div>
                        <h5 className="dna-name mb-10">
                            <Link href="/">{AppData.profile.name}</Link>
                        </h5>
                        <div
                            className="dna-sm-text"
                            dangerouslySetInnerHTML={{ __html: AppData.profile.role }}
                        />
                        {AppData.profile.availability && (
                            <div className="dna-sidebar-status mt-10">
                                {AppData.profile.availability}
                            </div>
                        )}
                    </div>

                    <div id="scrollbar2" className="dna-scroll-frame dna-scroll-frame-hire">
                        <div className="dna-table p-15-15">
                            <ul>
                                {sidebarInfo.map((item) => (
                                    <InfoRow key={item.label} label={item.label} value={item.value} />
                                ))}
                            </ul>
                        </div>

                        <div className="dna-ls-divider"></div>

                        {chips.length > 0 && (
                            <div className="dna-skill-chips p-15-15">
                                <h6 className="dna-sidebar-label mb-10">Core stack</h6>
                                <div className="dna-chip-wrap">
                                    {chips.map((chip, key) => (
                                        <span className="dna-chip" key={`chip-${key}`}>
                                            {chip}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="dna-ls-divider"></div>

                        <div className="dna-knowledge p-15-15">
                            {knowledge.map((group, index) => (
                                <div key={index} className="dna-knowledge-group">
                                    <h6 className="dna-knowledge-title dna-sidebar-label">
                                        {group.category}
                                    </h6>
                                    <ul className="dna-knowledge-list">
                                        {group.items.map((tool, i) => (
                                            <li key={i}>{tool}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dna-sidebar-cta">
                        <Button
                            href={AppData.profile.resume}
                            external
                            size="sm"
                            className="dna-sidebar-cta-btn"
                            data-no-swup
                        >
                            Resume
                        </Button>
                        <Button href="/contact" variant="secondary" size="sm" className="dna-sidebar-cta-btn">
                            Contact
                        </Button>
                    </div>

                    <div className="dna-ls-social">
                        {AppData.social.map((item, key) => (
                            <a
                                href={item.link}
                                key={`profile-social-item-${key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={item.title}
                            >
                                <i className={item.icon}></i>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

        </>
    );
};

export default InfoBarModule;
