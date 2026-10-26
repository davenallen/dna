"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LiveEmbed, LiveModule, SectionTitle, TextLink } from "@components/system";
import { UsePills } from "@components/UsePills";

const CATEGORY_ORDER = ["web-templates", "web-system", "ui-elements"];
const PRIMARY = new Set(CATEGORY_ORDER);
const LEAD_ORDER = [
    "13-signup-landing",
    "15-disability-benefits",
    "16-injury-evaluation",
    "10-campaign-launch-kit",
    "09-registration-path",
    "01-portfolioe-website-project",
    "14-lead-generation",
    "12-onboarding-cards",
    "17-injury-form",
];
const HIDDEN_FROM_GRID = new Set(["06-sales-page-project", "11-traffic-acquisition"]);

function WorkCard({ item, projects, openMedia, quiet = false }) {
    const isVideo = !!item.video;
    const isIframeItem = Boolean(item.iframe) && item.module_grid !== false;
    const showModule = Boolean(item.module) && item.module_grid !== false;
    const iframeModule = !item.module && item.category_slug === "ui-elements" && Boolean(item.iframe);
    const spanRow = (showModule && item.module_grid !== "column") || iframeModule;
    const isLiveModule = showModule || iframeModule;
    const thumbnail = item.poster || item.image;
    const hasMedia = Boolean(thumbnail || isLiveModule);

    return (
        <article
            className={`dna-work-card dna-a ${item.category_slug}${spanRow ? " dna-work-card--live" : ""}${showModule && !spanRow ? " dna-work-card--module" : ""}${quiet ? " dna-work-card--earlier" : ""}${hasMedia ? "" : " dna-work-card--note"}`}
        >
            {isLiveModule ? (
                item.module ? (
                    <LiveModule id={item.module} />
                ) : (
                    <LiveEmbed src={item.iframe} title={item.title} />
                )
            ) : hasMedia ? (
                <button
                    type="button"
                    className="dna-work-card-media"
                    onClick={() => openMedia(item)}
                    aria-label={`Preview ${item.title}`}
                >
                    <img src={thumbnail} alt={item.title} />
                    <span className="dna-work-card-hover">
                        {isIframeItem ? (
                            <i className="fas fa-external-link-alt"></i>
                        ) : isVideo ? (
                            <i className="fas fa-play-circle"></i>
                        ) : (
                            <i className="fas fa-expand"></i>
                        )}
                    </span>
                </button>
            ) : null}
            <div className="dna-work-card-body">
                <span className="dna-work-card-cat">{item.category}</span>
                <h5 className="mb-10">
                    <Link href={`/projects/${item.id}`}>{item.title}</Link>
                </h5>
                {!quiet && item.summary && (
                    <p className="dna-project-summary mb-15">{item.summary}</p>
                )}
                <TextLink href={`/projects/${item.id}`}>{quiet ? "View" : "View case study"}</TextLink>
                <UsePills item={item} projects={projects} />
            </div>
        </article>
    );
}

const ProjectsMasonry = ({ projects, categories, category }) => {
    const router = useRouter();
    const pathname = usePathname();
    const filterKey = PRIMARY.has(category) ? category : "*";

    const sortedProjects = useMemo(() => {
        return [...projects]
            .filter((item) => !HIDDEN_FROM_GRID.has(item.id))
            .sort((a, b) => {
                const aLead = LEAD_ORDER.indexOf(a.id);
                const bLead = LEAD_ORDER.indexOf(b.id);
                if (aLead !== -1 || bLead !== -1) {
                    if (aLead !== -1 && bLead !== -1) return aLead - bLead;
                    return aLead !== -1 ? -1 : 1;
                }
                const ai = CATEGORY_ORDER.indexOf(a.category_slug);
                const bi = CATEGORY_ORDER.indexOf(b.category_slug);
                const aOrder = ai === -1 ? 99 : ai;
                const bOrder = bi === -1 ? 99 : bi;
                if (aOrder !== bOrder) return aOrder - bOrder;
                return a.id > b.id ? 1 : -1;
            });
    }, [projects]);

    const primaryProjects = useMemo(
        () => sortedProjects.filter((item) => PRIMARY.has(item.category_slug)),
        [sortedProjects]
    );
    const earlierProjects = useMemo(
        () => sortedProjects.filter((item) => !PRIMARY.has(item.category_slug)),
        [sortedProjects]
    );
    const visible = useMemo(() => {
        if (filterKey === "*") return primaryProjects;
        const childSlugs = new Set(
            categories
                .filter((item) => item.parent === filterKey)
                .map((item) => item.slug)
        );
        return primaryProjects.filter(
            (p) => p.category_slug === filterKey || childSlugs.has(p.category_slug)
        );
    }, [primaryProjects, filterKey, categories]);

    const handleFilterKeyChange = (key, e) => {
        e.preventDefault();
        const params = new URLSearchParams(window.location.search);
        if (key === "*") params.delete("category");
        else params.set("category", key);
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    };

    const openMedia = (item) => {
        const href = item.id ? `/projects/${item.id}` : "";
        if (item.iframe && item.module_grid !== false) {
            window.dispatchEvent(
                new CustomEvent("openMedia", {
                    detail: {
                        src: item.iframe,
                        isIframe: true,
                        title: item.title || "Live Preview",
                        href,
                    },
                })
            );
        } else if (item.video) {
            window.dispatchEvent(
                new CustomEvent("openMedia", {
                    detail: {
                        src: item.video,
                        isVideo: true,
                        title: item.title || "",
                        href,
                    },
                })
            );
        } else {
            window.dispatchEvent(
                new CustomEvent("openMedia", {
                    detail: {
                        src: item.image || item.poster,
                        isVideo: false,
                        title: item.title || "",
                        href,
                    },
                })
            );
        }
    };

    return (
      <>
        <div className="container-fluid">
            <div className="row p-30-0">
                <div className="col-lg-12">
                    <SectionTitle
                        title="Selected work"
                        aside={
                            <div className="dna-filter">
                                <a
                                    href="#"
                                    data-filter="*"
                                    onClick={(e) => handleFilterKeyChange("*", e)}
                                    className={`dna-link ${filterKey === "*" ? "dna-current" : ""}`}
                                >
                                    All
                                </a>
                                {categories.map((item, key) => (
                                    <a
                                        href="#"
                                        key={`projects-filter-item-${key}`}
                                        data-filter={item.slug}
                                        className={`dna-link ${filterKey === item.slug ? "dna-current" : ""}`}
                                        onClick={(e) => handleFilterKeyChange(item.slug, e)}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        }
                    />
                </div>

                <div className="col-lg-12">
                    <p className="dna-why-hire-intro mb-30">Pages and UI that ship: an email signup, the registration path, the campaign kit, and a personal site, plus membership pricing and offer tables.</p>
                    <div className="dna-work-cards">
                        {visible.map((item) => (
                            <WorkCard key={item.id} item={item} projects={projects} openMedia={openMedia} />
                        ))}
                    </div>
                </div>

                {filterKey === "*" && earlierProjects.length > 0 && (
                    <div className="col-lg-12">
                        <SectionTitle title="Earlier brand and motion work" />
                        <div className="dna-work-cards dna-work-cards--earlier">
                            {earlierProjects.map((item) => (
                                <WorkCard key={item.id} item={item} projects={projects} openMedia={openMedia} quiet />
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
      </>
    );
};

const ProjectsMasonryWithSearch = (props) => {
    const searchParams = useSearchParams();
    return <ProjectsMasonry {...props} category={searchParams.get("category")} />;
};

const ProjectsMasonryBoundary = (props) => {
    return (
        <Suspense fallback={<ProjectsMasonry {...props} category={null} />}>
            <ProjectsMasonryWithSearch {...props} />
        </Suspense>
    );
};

export default ProjectsMasonryBoundary;
