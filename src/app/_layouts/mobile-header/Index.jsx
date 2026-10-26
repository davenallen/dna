"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DRAWER_TOGGLE = "dna-drawer-toggle";
const DRAWER_STATE = "dna-drawer-state";
const DRAWER_CLOSE = "dna-drawer-close";

const MobileHeader = () => {
    const [infoOpen, setInfoOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onState = (event) => {
            const which = event.detail?.which;
            const open = Boolean(event.detail?.open);
            if (which === "info") setInfoOpen(open);
            if (which === "menu") setMenuOpen(open);
        };
        window.addEventListener(DRAWER_STATE, onState);
        return () => window.removeEventListener(DRAWER_STATE, onState);
    }, []);

    const request = (which) => {
        window.dispatchEvent(new CustomEvent(DRAWER_TOGGLE, { detail: which }));
    };

    const closeDrawers = () => {
        window.dispatchEvent(new CustomEvent(DRAWER_CLOSE));
    };

    return (
        <header className="dna-mobile-top-bar">
            <button
                type="button"
                className={`dna-info-bar-btn${infoOpen ? " dna-active" : ""}`}
                onClick={() => request("info")}
                aria-expanded={infoOpen}
                aria-label={infoOpen ? "Close profile" : "Open profile"}
            >
                <span></span>
            </button>
            <Link href="/" className="dna-mobile-logo-link" aria-label="Home" onClick={closeDrawers}>
                <img src="/img/logo.png" alt="DNA" className="dna-mobile-logo" />
            </Link>
            <button
                type="button"
                className={`dna-menu-bar-btn${menuOpen ? " dna-active" : ""}`}
                onClick={() => request("menu")}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
                <span></span>
            </button>
        </header>
    );
};

export default MobileHeader;
