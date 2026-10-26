"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "./Button";
import { TextLink } from "./TextLink";
import { track } from "@library/visit";

const CASE_STUDY = "/projects/03-purchase-module-project/";

const PERIODS = [
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
  { id: "annual", label: "Annual" },
];

const CORE = ["On-demand session library", "One live session each month", "Email reminders"];
const COMMUNITY = ["Everything in Core Access", "Private member community", "Weekly office hours"];

const OFFERS = {
  monthly: [
    { title: "Core Access", subtitle: "Library and live sessions", price: 47, period: "/month", popular: false, features: CORE },
    { title: "Core + Community", subtitle: "Library, live sessions, and community", price: 147, period: "/month", popular: true, features: COMMUNITY },
  ],
  quarterly: [
    { title: "Core Access", subtitle: "Library and live sessions", price: 127, period: "/quarter", popular: false, features: CORE },
    { title: "Core + Community", subtitle: "Library, live sessions, and community", price: 397, period: "/quarter", popular: true, features: COMMUNITY },
  ],
  annual: [
    { title: "Core Access", subtitle: "Library and live sessions", price: 470, period: "/year", popular: false, features: CORE },
    { title: "Core + Community", subtitle: "Library, live sessions, and community", price: 1470, period: "/year", popular: true, features: COMMUNITY },
  ],
};

export function OfferCompare() {
  const rootRef = useRef(null);
  const pathname = usePathname();
  const onCaseStudy = (pathname || "").replace(/\/$/, "") === "/projects/03-purchase-module-project";
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      track("offer_view", { module: "pricing", view: "cards" });
      observer.disconnect();
    }, { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function choosePeriod(next) {
    setPeriod(next);
    track("billing_period", { module: "pricing", period: next });
  }

  return (
    <div className="ds-offer ds-offer-compare" ref={rootRef}>
      <p className="ds-offer-sample">Pricing module (sample)</p>
      <div className="ds-offer-tabs" role="tablist" aria-label="Billing period">
        {PERIODS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="ds-offer-tab"
            role="tab"
            aria-selected={period === item.id}
            onClick={() => choosePeriod(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="ds-offer-cards">
        {OFFERS[period].map((card) => (
          <article className={`ds-offer-card${card.popular ? " is-popular" : ""}`} key={card.title}>
            {card.popular && <span className="ds-offer-badge">Most popular</span>}
            <h3>{card.title}</h3>
            <p>{card.subtitle}</p>
            <p className="ds-offer-price">
              <span>$</span>
              <b>{card.price}</b>
              <span>{card.period}</span>
            </p>
            <ul>
              {card.features.map((feature) => (
                <li key={feature}>
                  <i className="fas fa-check" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              href={CASE_STUDY}
              className="ds-offer-cta"
              variant={card.popular ? "primary" : "secondary"}
              onClick={() => {
                track("offer_select", {
                  module: "pricing",
                  plan: card.title,
                  period,
                  price: card.price,
                });
              }}
            >
              View case study
            </Button>
          </article>
        ))}
      </div>
      {!onCaseStudy && (
        <p className="ds-offer-note">
          Sample of the comparison-first pricing module.{" "}
          <TextLink href={CASE_STUDY}>Full case study</TextLink>
        </p>
      )}
    </div>
  );
}

export default OfferCompare;
