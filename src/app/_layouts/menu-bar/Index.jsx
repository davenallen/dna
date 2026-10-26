"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import AppData from "@data/app.json";
import { usePathname, useSearchParams } from 'next/navigation';
import Link from "next/link";
import { ThemeSwitch } from "@components/system";

const DRAWER_EVENT = "dna-drawer-open";
const DRAWER_TOGGLE = "dna-drawer-toggle";
const DRAWER_STATE = "dna-drawer-state";
const DRAWER_CLOSE = "dna-drawer-close";

const setContentActive = (active) => {
    document.querySelector(".dna-content")?.classList.toggle("dna-active", active);
};

const hasChildren = (item) => Array.isArray(item.children) && item.children.length > 0;

const categoryFrom = (link) => {
    const query = String(link).split("?")[1] || "";
    return new URLSearchParams(query).get("category");
};

const MenuBarModule = ({ category }) => {
    const [toggle, setToggle] = useState(false);
    const [activeSubMenu, setActiveSubMenu] = useState(null);
    const asPath = usePathname();
    const [curLabel, setCurLabel] = useState(0);
    const toggleRef = useRef(false);
    const commitRef = useRef(() => {});

    const isPathActive = (path) => {
        return (asPath.indexOf(path) !== -1) && asPath === path;
    };

    const handleSubMenuClick = (index, event) => {
        if (event) event.preventDefault();
        setActiveSubMenu(activeSubMenu === index ? null : index);
    };

    const onProjectsIndex = (asPath || "/").replace(/\/$/, "") === "/projects";

    const subitemCurrent = (subitem) => {
        const subCategory = categoryFrom(subitem.link);
        if (subCategory) return subCategory === category;
        return !category && onProjectsIndex;
    };

    useEffect(() => {
        const index = AppData.header.menu.findIndex((item) =>
            hasChildren(item) && item.children.some((child) => subitemCurrent(child))
        );
        if (index >= 0) setActiveSubMenu(index);
    }, [category, asPath]);
    
    const commitMenu = (next, touchContent) => {
        const prev = toggleRef.current;
        toggleRef.current = next;
        setToggle(next);
        if (touchContent) setContentActive(next);
        if (prev !== next) {
            window.dispatchEvent(new CustomEvent(DRAWER_STATE, { detail: { which: "menu", open: next } }));
        }
        if (next) {
            window.dispatchEvent(new CustomEvent(DRAWER_EVENT, { detail: "menu" }));
        }
    };
    commitRef.current = commitMenu;

    useEffect(() => {
        if (toggleRef.current) {
            commitRef.current(false, true);
        }

        AppData.header.menu.map((item) => menuLabels(item) );
    }, [asPath])

    const menuLabels = (item) => {
        isPathActive(item.link) ? setCurLabel(item) : 0;
    }

    const closeMenu = () => commitMenu(false, true);

    const menuOpen = () => commitMenu(!toggleRef.current, true);

    useEffect(() => {
        const onOtherDrawer = (event) => {
            if (event.detail === "menu") return;
            commitRef.current(false, false);
        };
        const onToggle = (event) => {
            if (event.detail !== "menu") return;
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
        const close = () => closeMenu();
        curtain?.addEventListener("click", close);
        return () => curtain?.removeEventListener("click", close);
    }, [toggle]);

    return (
        <>
            {/* menu bar */}
            <div className="dna-menu-bar-fix">
            <div className={`dna-menu-bar ${toggle ? "dna-active" : ""}`}>

            {/* menu bar frame */}
            <div className="dna-menu-bar-frame">

                {/* menu bar header */}
                <div className="dna-menu-bar-header">
                {/* menu bar button */}
                <div className={`dna-menu-bar-btn ${toggle ? "dna-active" : ""}`} onClick={() => menuOpen() }>
                    {/* icon */}
                    <span></span>
                </div>
                {/* menu bar button end */}
                </div>
                {/* menu bar header end */}

                {/* scroll frame */}
                <div className="dna-scroll-frame">

                {/* menu */}
                <nav id="swupMenu">
                    {/* menu list */}
                    <ul className="main-menu">
                        {AppData.header.menu.map((item, index) => (
                        <li
                            className={`menu-item ${item.link === "/system" ? "menu-item--quiet" : ""} ${hasChildren(item) ? "menu-item-has-children" : ""} ${isPathActive(item.link) ? "current-menu-item" : ""}`}
                            key={`header-menu-item-${index}`}
                            onClick={hasChildren(item) ? (event) => {
                                if (event.target !== event.currentTarget) return;
                                handleSubMenuClick(index, event);
                            } : undefined}
                        >
                            <Link href={item.link} onClick={hasChildren(item) ? (event) => handleSubMenuClick(index, event) : undefined}>
                                {item.label === "Home" && item.link === "/" ? (
                                    <img src="/img/logo.png" alt="Home" className="dna-menu-logo" />
                                ) : item.label}
                            </Link>
                            {hasChildren(item) && (
                            <ul className={activeSubMenu === index ? 'sub-menu dna-active' : 'sub-menu'}>
                                {item.children.map((subitem, subIndex) => (
                                <li key={`header-submenu-item-${subIndex}`} className={subitemCurrent(subitem) ? "menu-item current-menu-item" : "menu-item"}>
                                    <Link href={subitem.link} onClick={closeMenu}>
                                        {subitem.label}
                                    </Link>
                                </li>
                                ))}
                            </ul>
                            )}
                        </li>
                        ))}
                    </ul>
                    {/* menu list end */}
                </nav>
                {/* menu end */}

                {/* language change */}
                <ul className="dna-language-change" style={{ display: "none" }}>
                    {/* language item */}
                    <li><a href="?lang=fr">FR</a></li>
                    {/* language item */}
                    <li className="dna-active-lang"><a href="?lang=en">EN</a></li>
                </ul>
                {/* language change end */}

                </div>
                {/* scroll frame end */}

                {/* current page title */}
                <div className={`dna-current-page${curLabel !== 0 && curLabel.link === "/system" ? " dna-current-page--quiet" : ""}`}>
                    {curLabel !== 0 ? (
                        <Link href={curLabel.link}>
                            {curLabel.label === "Home" && curLabel.link === "/" ? (
                                <img src="/img/logo.png" alt="Home" className="dna-menu-logo" />
                            ) : curLabel.label}
                        </Link>
                    ) : (
                        <Link href="/">
                            <img src="/img/logo.png" alt="Home" className="dna-menu-logo" />
                        </Link>
                    )}
                </div>
                {/* current page title end */}

                <div className="dna-menu-theme">
                    <ThemeSwitch />
                </div>

            </div>
            {/* menu bar frame */}

            </div>
            </div>
            {/* menu bar end */}
        </>
    );
};

const MenuBarWithSearch = () => {
    const searchParams = useSearchParams();
    return <MenuBarModule category={searchParams.get("category")} />;
};

const MenuBar = () => {
    return (
        <Suspense fallback={<MenuBarModule category={null} />}>
            <MenuBarWithSearch />
        </Suspense>
    );
};

export default MenuBar;