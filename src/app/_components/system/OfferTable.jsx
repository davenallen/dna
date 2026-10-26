"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { track } from "@library/visit";

const PLANS = [
  {
    id: "package1",
    name: "Package 1",
    price: "$797",
    value: "Value: $2,288",
    best: false,
    features: { theClass: true, theIndicator: true, bonus1: true, bonus2: true, twoDays: false, fourDays: false },
  },
  {
    id: "package2",
    name: "Package 2",
    price: "$997",
    value: "Value: $2,688",
    best: false,
    features: { theClass: true, theIndicator: true, bonus1: true, bonus2: true, twoDays: true, fourDays: false },
  },
  {
    id: "package3",
    name: "Package 3",
    price: "$1,197",
    value: "Value: $3,088",
    best: true,
    features: { theClass: true, theIndicator: true, bonus1: true, bonus2: true, twoDays: true, fourDays: true },
  },
];

const FEATURES = [
  { key: "theClass", text: "Feature 1" },
  { key: "theIndicator", text: "Feature 2" },
  { key: "bonus1", text: "Feature 3", bonus: true },
  { key: "bonus2", text: "Feature 4", bonus: true },
  { key: "twoDays", text: "Feature 5" },
  { key: "fourDays", text: "Feature 6" },
];

function FeatureLabel({ feature }) {
  return (
    <>
      {feature.bonus && <span className="ds-offer-bonus">★ Bonus</span>}
      {feature.text}
    </>
  );
}

function Mark({ on }) {
  return (
    <i
      className={`fas fa-${on ? "check" : "times"}`}
      aria-label={on ? "Included" : "Not included"}
    />
  );
}

export function OfferTable() {
  const rootRef = useRef(null);
  const viewed = useRef(false);
  const forcedRef = useRef(null);
  const [forced, setForced] = useState(null);
  const [narrow, setNarrow] = useState(false);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    const apply = () => setNarrow(node.clientWidth < 900);
    apply();
    const resize = new ResizeObserver(apply);
    resize.observe(node);
    const onScreen = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || viewed.current) return;
      viewed.current = true;
      const mode = forcedRef.current || (node.clientWidth < 900 ? "cards" : "table");
      track("offer_view", { module: "offer-table", view: mode });
      onScreen.disconnect();
    }, { threshold: 0.2 });
    onScreen.observe(node);
    return () => {
      resize.disconnect();
      onScreen.disconnect();
    };
  }, []);

  const showCards = forced === "cards" || (forced === null && narrow);

  function chooseView(view) {
    forcedRef.current = view;
    setForced(view);
    track("offer_view", { module: "offer-table", view });
  }

  return (
    <div className="ds-offer ds-offer-table" ref={rootRef}>
      <div className="ds-offer-tabs" role="group" aria-label="View mode">
        <button
          type="button"
          className="ds-offer-tab"
          aria-pressed={showCards}
          onClick={() => chooseView("cards")}
        >
          <i className="fas fa-mobile-alt" aria-hidden="true" />
          Cards
        </button>
        <button
          type="button"
          className="ds-offer-tab"
          aria-pressed={!showCards}
          onClick={() => chooseView("table")}
        >
          <i className="fas fa-table" aria-hidden="true" />
          Table
        </button>
      </div>

      {showCards ? (
        <div className="ds-offer-stack">
          {PLANS.map((plan) => (
            <article className="ds-offer-plan" key={plan.id}>
              <header className={`ds-offer-pack ds-offer-pack--${plan.id}`}>
                {plan.best && <span className="ds-offer-best">Best value</span>}
                <h3>{plan.name}</h3>
                <p className="ds-offer-plan-price">{plan.price}</p>
                <p>{plan.value}</p>
              </header>
              <ul>
                {FEATURES.map((feature) => (
                  <li key={feature.key} className={plan.features[feature.key] ? "is-on" : "is-off"}>
                    <Mark on={plan.features[feature.key]} />
                    <span><FeatureLabel feature={feature} /></span>
                  </li>
                ))}
              </ul>
              <Button
                className="ds-offer-cta"
                variant={plan.best ? "primary" : "secondary"}
                aria-pressed={selected === plan.id}
                onClick={() => {
                  setSelected(plan.id);
                  track("offer_select", {
                    module: "offer-table",
                    plan: plan.name,
                    price: plan.price,
                    view: "cards",
                  });
                }}
              >
                {selected === plan.id ? "Selected" : "Buy Now"}
              </Button>
            </article>
          ))}
        </div>
      ) : (
        <div className="ds-offer-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">What&apos;s included</th>
                {PLANS.map((plan) => (
                  <th scope="col" className={`ds-offer-pack ds-offer-pack--${plan.id}`} key={plan.id}>
                    {plan.best && <span className="ds-offer-best">Best value</span>}
                    <span className="ds-offer-plan-name">{plan.name}</span>
                    <span className="ds-offer-plan-price">{plan.price}</span>
                    <span>{plan.value}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feature) => (
                <tr key={feature.key}>
                  <th scope="row"><FeatureLabel feature={feature} /></th>
                  {PLANS.map((plan) => (
                    <td key={plan.id} className={plan.features[feature.key] ? "is-on" : "is-off"}>
                      <Mark on={plan.features[feature.key]} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row" />
                {PLANS.map((plan) => (
                  <td key={plan.id}>
                    <Button
                      className="ds-offer-cta"
                      variant={plan.best ? "primary" : "secondary"}
                      aria-pressed={selected === plan.id}
                      onClick={() => {
                        setSelected(plan.id);
                        track("offer_select", {
                          module: "offer-table",
                          plan: plan.name,
                          price: plan.price,
                          view: "table",
                        });
                      }}
                    >
                      {selected === plan.id ? "Selected" : "Buy Now"}
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OfferTable;
