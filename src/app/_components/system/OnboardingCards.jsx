"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { track } from "@library/visit";

const PRODUCT = "the session";

const CARDS = [
  {
    id: "sessions",
    eyebrow: "Live Session",
    title: "Join the live sessions",
    body: "Sessions run on a set schedule. The room is where the day's work and the reasoning are walked through.",
    action: "View the schedule",
  },
  {
    id: "alerts",
    eyebrow: "Live Session",
    title: "Turn on alerts",
    body: "Alerts go to the app during market hours.",
    stores: ["App Store", "Google Play"],
  },
  {
    id: "list",
    eyebrow: "Live Session",
    title: "Get the weekly list",
    body: "A short list of names, posted on a set day, with a note on why each one is there.",
    action: "Open the list",
  },
  {
    id: "recordings",
    eyebrow: "Live Session",
    title: "Watch the recordings",
    body: "The archive keeps the live sessions, so a missed day can be watched later.",
    action: "Open the recordings",
  },
  {
    id: "overview",
    eyebrow: "Live Session",
    title: "See how the approach works",
    body: "A short overview of the method sits with the rest of the membership.",
    action: "View the overview",
  },
];

export function OnboardingCards({ autoStart = false }) {
  const rootRef = useRef(null);
  const viewed = useRef(false);
  const opened = useRef(false);
  const [open, setOpen] = useState(autoStart);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [picked, setPicked] = useState("");

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    const onScreen = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || viewed.current) return;
      viewed.current = true;
      track("onboarding_view", { module: "onboarding" });
    }, { threshold: 0.2 });
    onScreen.observe(node);
    return () => onScreen.disconnect();
  }, []);

  useEffect(() => {
    if (!autoStart || opened.current) return undefined;
    opened.current = true;
    track("onboarding_open", { module: "onboarding" });
  }, [autoStart]);

  const last = index === CARDS.length - 1;
  const card = CARDS[index];

  function go(next) {
    const clamped = Math.max(0, Math.min(CARDS.length - 1, next));
    setPicked("");
    setIndex(clamped);
    track("onboarding_step", { module: "onboarding", step: clamped + 1, card: CARDS[clamped].id });
  }

  function start() {
    setDone(false);
    setPicked("");
    setIndex(0);
    setOpen(true);
    track("onboarding_open", { module: "onboarding" });
  }

  function finish(how) {
    setOpen(false);
    setDone(true);
    track("onboarding_finish", { module: "onboarding", how });
  }

  return (
    <div className="ds-offer ds-onboard" ref={rootRef}>
      {!open && (
        <div className="ds-onboard-start">
          <p className="ds-onboard-lead">
            {done ? "This is the end of the registration. This is inserted in the registration path as either a final step, upsell platform, or more information." : `A new member of ${PRODUCT} starts here.`}
          </p>
          <Button type="button" onClick={start}>{done ? "See the cards again" : "Get started"}</Button>
        </div>
      )}

      {open && (
        <div className="ds-onboard-card">
          {index > 0 && (
            <button type="button" className="ds-onboard-close" onClick={() => finish("close")} aria-label="Close">
              ×
            </button>
          )}
          <p className="ds-onboard-thanks">
            Thank you for signing up to <strong>{PRODUCT}</strong>
          </p>
          <div className="ds-onboard-nav">
            {index > 0 ? (
              <button type="button" className="ds-onboard-arrow" onClick={() => go(index - 1)}>
                Back
              </button>
            ) : <span />}
            {last ? (
              <Button type="button" onClick={() => finish("dashboard")}>Go to the dashboard</Button>
            ) : (
              <button type="button" className="ds-onboard-arrow" onClick={() => go(index + 1)}>
                Next
              </button>
            )}
          </div>
          <p className="ds-onboard-eyebrow">{card.eyebrow}</p>
          <h3 className="ds-onboard-title">{card.title}</h3>
          <div className="ds-onboard-figure" aria-hidden="true">
            <span>{index + 1} / {CARDS.length}</span>
          </div>
          <p className="ds-onboard-body">{card.body}</p>
          {card.stores ? (
            <div className="ds-onboard-stores">
              {card.stores.map((label) => (
                <Button
                  key={label}
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setPicked(label);
                    track("onboarding_step", { module: "onboarding", step: index + 1, card: card.id, choice: label });
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
          ) : (
            <Button
              type="button"
              onClick={() => {
                setPicked(card.action);
                track("onboarding_step", { module: "onboarding", step: index + 1, card: card.id, choice: card.action });
              }}
            >
              {card.action}
            </Button>
          )}
          {picked && <p className="ds-onboard-picked">{picked} stays on this card. It does not leave the page.</p>}
          {index > 0 && (
            <button type="button" className="ds-onboard-skip" onClick={() => finish("skip")}>
              Skip and continue
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default OnboardingCards;
