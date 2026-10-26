"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { ensureVisit, track } from "@library/visit";

const GA_ID = "G-SELDNTWN7S";

function isContactPath(href) {
  const path = href.split("?")[0].split("#")[0];
  return path === "/contact" || path === "/contact/";
}

function trackLocation(el) {
  const marked = el.getAttribute("data-track-location");
  if (marked) return marked;
  if (el.closest(".dna-sidebar-cta")) return "sidebar";
  if (el.closest(".dna-banner-cta")) return "case_study";
  if (el.closest(".dna-banner")) return "hero";
  if (el.closest("#components")) return "system";
  if (el.closest("#swupMenu")) return "menu";
  return "other";
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const skipFirst = useRef(true);

  useEffect(() => {
    const visit = ensureVisit();
    if (typeof window.gtag === "function" && visit.source !== "direct") {
      const campaign = { campaign_source: visit.source };
      if (visit.medium) campaign.campaign_medium = visit.medium;
      if (visit.campaign) campaign.campaign_name = visit.campaign;
      if (visit.content) campaign.campaign_content = visit.content;
      if (visit.term) campaign.campaign_term = visit.term;
      window.gtag("set", campaign);
    }
    if (skipFirst.current) {
      skipFirst.current = false;
    } else if (typeof window.gtag === "function") {
      window.gtag("config", GA_ID, { page_path: pathname });
    }
    track("page_view", { page_path: pathname });
  }, [pathname]);

  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      const location = trackLocation(link);

      if (href.includes("dna-resume") && link.hasAttribute("data-resume-download")) {
        track("resume_download", {
          link_url: href,
          location,
        });
      }

      if (isContactPath(href)) {
        track("cta_contact", { location });
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
