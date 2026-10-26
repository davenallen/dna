"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { track } from "@library/visit";

const CARDS = [
  {
    id: "spec",
    eyebrow: "Campaign record",
    title: "One spec is the source",
    body: "The date, the slug, the headline, and the URL live in one record. A value that is not in that record does not go on the page.",
    action: "Read the spec",
  },
  {
    id: "calendar",
    eyebrow: "Campaign record",
    title: "The invite uses that record",
    body: "The confirmation builds the Google Calendar link and the .ics file from the title, the time, and the bullets.",
    action: "Build the invite",
  },
  {
    id: "redirect",
    eyebrow: "Campaign record",
    title: "The URL follows the clock",
    body: "Before the event, the URL is the registration page. After the replay time, that same URL sends people to the replay. At the handoff time, it sends them to the next webinar.",
    action: "Check the clock",
  },
  {
    id: "modules",
    eyebrow: "Campaign record",
    title: "The modules read the same copy",
    body: "The pricing matrix and the carousels fill from that record. A member who already owns a product can have that tier hidden.",
    action: "Open the modules",
  },
  {
    id: "handoff",
    eyebrow: "Campaign record",
    title: "The three stay in agreement",
    body: "The calendar, the live URL, and the next webinar all read the one record. A query flag holds the page for QA, and a tab left open rechecks the clock.",
    action: "Review the handoff",
  },
];

export function CampaignKit() {
  const rootRef = useRef(null);
  const viewed = useRef(false);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [picked, setPicked] = useState("");

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    const onScreen = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || viewed.current) return;
      viewed.current = true;
      track("campaign_view", { module: "campaign" });
    }, { threshold: 0.2 });
    onScreen.observe(node);
    return () => onScreen.disconnect();
  }, []);

  const last = index === CARDS.length - 1;
  const card = CARDS[index];

  function go(next) {
    const clamped = Math.max(0, Math.min(CARDS.length - 1, next));
    setPicked("");
    setIndex(clamped);
    track("campaign_step", { module: "campaign", step: clamped + 1, card: CARDS[clamped].id });
  }

  function start() {
    setDone(false);
    setPicked("");
    setIndex(0);
    setOpen(true);
    track("campaign_open", { module: "campaign" });
  }

  function finish(how) {
    setOpen(false);
    setDone(true);
    track("campaign_finish", { module: "campaign", how });
  }

  return (
    <div className="ds-offer ds-onboard ds-campaign" ref={rootRef}>
      {!open && (
        <div className="ds-onboard-start">
          <p className="ds-onboard-lead">
            {done
              ? "The live URL is set. A new webinar replaces the record."
              : "One record drives the calendar, the redirects, and the modules."}
          </p>
          <Button type="button" onClick={start}>{done ? "See the cards again" : "Open the kit"}</Button>
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
            One record for <strong>this launch</strong>
          </p>
          <div className="ds-onboard-nav">
            {index > 0 ? (
              <button type="button" className="ds-onboard-arrow" onClick={() => go(index - 1)}>
                Back
              </button>
            ) : <span />}
            {last ? (
              <Button type="button" onClick={() => finish("ship")}>Ship the page</Button>
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
          <Button
            type="button"
            onClick={() => {
              setPicked(card.action);
              track("campaign_step", { module: "campaign", step: index + 1, card: card.id, choice: card.action });
            }}
          >
            {card.action}
          </Button>
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

export default CampaignKit;
